// I DUE LATI DEVONO CALCOLARE LO STESSO INDIRIZZO.
//
// ⚠ È IL DIFETTO PIÙ SUBDOLO DI TUTTA QUESTA FACCENDA. Il gioco deposita il
// messaggio su un argomento ricavato dalla password; il lettore va a cercarlo su
// un argomento ricavato dalla stessa password. Se i due conti divergono anche di
// un carattere non succede NIENTE di visibile: il gioco dice «mandato ✔» (ed è
// vero, l'ha mandato), il lettore dice «nessun rapporto» (ed è vero, lì non c'è
// niente), e i rapporti finiscono in un angolo di internet dove non guarda
// nessuno. Nessun errore, nessun avviso, e settimane a chiedersi perché.
//
// ⚠ E SONO DUE IMPLEMENTAZIONI DIVERSE PER FORZA: nel gioco «crypto.subtle»
// (che è quello che ha un browser), nel lettore «node:crypto» (che è sincrono e
// più comodo). Due strade per lo stesso numero è esattamente la situazione in
// cui una prova serve.
import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { argomentoDi, SOGLIA_ALLEGATO, SERVIZIO } from '../src/ui/canale.js';

/** La copia del lettore, ricopiata qui: se una delle due cambia, si vede. */
function argomentoDelLettore(pw) {
  const esa = createHash('sha256').update('leafy-shadows/' + pw).digest('hex');
  return 'leafy-' + esa.slice(0, 24);
}

test('gioco e lettore arrivano allo STESSO argomento', async () => {
  for (const pw of ['Bb7papa70', 'a', 'una password con spazi', 'àccènti-e-simboli!', '12345678']) {
    assert.equal(await argomentoDi(pw), argomentoDelLettore(pw), `password «${pw}»`);
  }
});

test('password diverse danno indirizzi diversi', () => {
  // ⚠ Altrimenti due persone finirebbero a scrivere sulla stessa casella.
  const visti = new Set();
  for (const pw of ['a', 'b', 'Bb7papa70', 'bb7papa70', 'Bb7papa7', 'Bb7papa70 ']) {
    const a = argomentoDelLettore(pw);
    assert.equal(visti.has(a), false, `«${pw}» collide con un'altra`);
    visti.add(a);
  }
});

test('l\'argomento non lascia trapelare la password', () => {
  // ⚠ L'argomento è PUBBLICO su ntfy: chi lo vede non deve poterne ricavare la
  // password. Un'impronta non si inverte; ma se per pigrizia ci finisse dentro
  // la password in chiaro, la cosa sarebbe rotta e sembrerebbe a posto.
  const pw = 'Bb7papa70';
  const a = argomentoDelLettore(pw);
  assert.equal(a.includes(pw), false);
  assert.equal(a.toLowerCase().includes(pw.toLowerCase()), false);
});

test('è un nome buono per ntfy: corto, stabile, senza caratteri strani', () => {
  const a = argomentoDelLettore('Bb7papa70');
  assert.match(a, /^leafy-[0-9a-f]{24}$/, a);
  // ⚠ E LO STESSO OGNI VOLTA, se no il lettore cercherebbe dove non c'è.
  assert.equal(a, argomentoDelLettore('Bb7papa70'));
});

test('96 bit di indirizzo: non si indovina', () => {
  // 24 cifre esadecimali = 96 bit. Provarli tutti non è una cosa che si fa.
  const a = argomentoDelLettore('x');
  assert.equal(a.length - 'leafy-'.length, 24);
});

test('la soglia dell\'allegato è quella misurata', () => {
  // ⚠ Misurato su ntfy.sh: fino a 4 KB il corpo torna come messaggio, sopra
  // diventa un allegato («You received a file») che dura 3 ore invece di 12.
  // Il numero sta qui perché il pannello lo dice all'utente.
  assert.equal(SOGLIA_ALLEGATO, 4096);
  assert.equal(SERVIZIO, 'https://ntfy.sh');
});

// ---------------------------------------------------------------------------
// E LA SHA-256 SCRITTA A MANO, che è il ripiego per i telefoni in casa.
//
// ⚠ SU http SEMPLICE «crypto.subtle» NON ESISTE. I browser lo danno solo nei
// «contesti sicuri» (https o localhost), e un telefono che apre
// http://192.168.1.31:8144/ non lo è. Senza ripiego il bottone sarebbe morto
// proprio sul dispositivo per cui esiste; con un ripiego che calcola un numero
// DIVERSO sarebbe peggio — i rapporti partirebbero verso un indirizzo dove non
// guarda nessuno, e nessuno darebbe errore.
import { sha256Esa } from '../src/ui/sha256.js';

test('la SHA-256 a mano dà lo stesso risultato di quella vera', () => {
  const casi = ['', 'a', 'abc', 'Bb7papa70', 'leafy-shadows/Bb7papa70',
    'x'.repeat(55), 'x'.repeat(56), 'x'.repeat(63), 'x'.repeat(64), 'x'.repeat(65),
    'x'.repeat(119), 'x'.repeat(120), 'x'.repeat(1000), 'àccènti e simboli ✔ 漢字'];
  for (const c of casi) {
    const mio = sha256Esa(new TextEncoder().encode(c));
    const vero = createHash('sha256').update(c, 'utf8').digest('hex');
    assert.equal(mio, vero, `«${c.length > 30 ? c.slice(0, 20) + '…(' + c.length + ')' : c}»`);
  }
});

test('e i confini del riempimento, che sono dove si sbaglia', () => {
  // ⚠ 55/56 e 119/120 sono i punti in cui la coda con la lunghezza fa scattare
  // un blocco in più: è lì che un riempimento sbagliato dà un'impronta
  // plausibile e diversa dalla vera.
  for (let n = 0; n <= 130; n++) {
    const b = new Uint8Array(n).fill(65);
    assert.equal(sha256Esa(b), createHash('sha256').update(Buffer.from(b)).digest('hex'), `lunghezza ${n}`);
  }
});

test('il ripiego porta allo STESSO argomento del lettore', () => {
  // ⚠ È la prova che conta: telefono in casa (senza subtle) e lettore devono
  // guardare nella stessa casella.
  for (const pw of ['Bb7papa70', 'prova', 'con spazi e àccènti']) {
    const daRipiego = 'leafy-' + sha256Esa(new TextEncoder().encode('leafy-shadows/' + pw)).slice(0, 24);
    assert.equal(daRipiego, argomentoDelLettore(pw), `password «${pw}»`);
  }
});

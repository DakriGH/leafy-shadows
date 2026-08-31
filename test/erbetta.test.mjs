// L'ERBETTA È UNO STRATO SUO — separato dal blocco.
//
// ⚠ Committente: «è sbagliato che il blocco d'erba e l'erbetta siano la stessa
// cosa, sono 2 cose diverse». Fino a ora i fili ERANO il blocco: crescevano su
// ogni blocco d'erba e sparivano solo rompendolo. Quindi non si poteva né
// rasare un prato né piantare erba sulla pietra — due cose che in un gioco dove
// «tutto è un furniture» devono potersi fare.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Erba, collegaFabbrica } from '../src/vegetazione/erba.js';
import { Mondo } from '../src/world/world.js';

// ⚠ L'ERBA VUOLE UNA FABBRICA per parlare col motore; qui non c'è un motore,
// quindi se ne passa una FINTA. È la stessa iniezione che usa il gioco vero, ed
// è quello che rende provabile in Node un modulo che disegna.
collegaFabbrica({
  creaPrato: () => ({}), scriviPrato: () => {}, animaPrato: () => {},
  mostraPrato: () => {}, materialiConMappa: () => new Set(), cambiaMappa: () => {},
});

function prato() {
  const m = new Mondo();
  for (let x = -4; x <= 4; x++) for (let z = -4; z <= 4; z++) {
    m.metti(x, 6, z, 'erba', true);
    m.metti(x, 5, z, 'terra', true);
  }
  m.metti(3, 6, 3, 'pietra', true);      // una lastra senza erba
  return m;
}
const nuova = () => new Erba({}, { max: 1000, densita: 4, raggioChunk: 2 });

test('di fabbrica una cella è AUTOMATICA', () => {
  const e = nuova();
  assert.equal(e.statoCella(0, 0), 'auto');
});

test('su un blocco d\'erba i fili ci sono, sulla pietra no', () => {
  const m = prato(), e = nuova();
  assert.equal(e.haFili(0, 7, 0, m), true, 'sopra l\'erba');
  assert.equal(e.haFili(3, 7, 3, m), false, 'sopra la pietra');
});

test('RASARE toglie i fili senza toccare il blocco', () => {
  // ⚠ È LA COSA CHE MANCAVA, ed è tutto il punto: il blocco resta.
  const m = prato(), e = nuova();
  assert.equal(e.rasa(0, 0), true);
  assert.equal(e.statoCella(0, 0), 'rasato');
  assert.equal(e.haFili(0, 7, 0, m), false, 'i fili sono spariti');
  assert.equal(m.tipo(0, 6, 0), 'erba', 'e il blocco è ancora d\'erba');
  assert.equal(e.rasa(0, 0), false, 'rasare due volte non fa niente');
});

test('PIANTARE mette i fili anche sulla pietra', () => {
  const m = prato(), e = nuova();
  assert.equal(e.haFili(3, 7, 3, m), false);
  e.posa(3, 7, 3);
  assert.equal(e.statoCella(3, 3), 'posato');
  assert.equal(e.haFili(3, 7, 3, m), true, 'l\'erbetta cresce dove la si mette');
  assert.equal(m.tipo(3, 6, 3), 'pietra', 'e il blocco resta pietra');
});

test('rasare una cella piantata a mano la rasa davvero', () => {
  // ⚠ LA RASATURA VINCE SU TUTTO: è l'ordine che ci si aspetta da un gesto che
  // dice «via di qui». Senza, un ciuffo posato sarebbe irremovibile.
  const m = prato(), e = nuova();
  e.posa(0, 7, 0);
  assert.equal(e.statoCella(0, 0), 'posato');
  e.rasa(0, 0);
  assert.equal(e.statoCella(0, 0), 'rasato');
  assert.equal(e.haFili(0, 7, 0, m), false);
});

test('e si torna indietro: ricresce', () => {
  const m = prato(), e = nuova();
  e.rasa(0, 0);
  assert.equal(e.togliRasa(0, 0), true);
  assert.equal(e.statoCella(0, 0), 'auto');
  assert.equal(e.haFili(0, 7, 0, m), true);
  assert.equal(e.togliRasa(0, 0), false, 'e togliere due volte non fa niente');
});

test('ogni cambio invalida la cache, se no non si vedrebbe', () => {
  // ⚠ LA CHIAVE DELLA CACHE DEI CIUFFI CONTIENE QUESTO NUMERO. Senza, i chunk
  // già seminati tornerebbero fuori identici e rasare non si vedrebbe — è lo
  // stesso difetto che ha lasciato un prato verde sopra un terreno innevato.
  // ⚠ E LA REVISIONE È PER CHUNK, NON PER MONDO. Era una sola, condivisa: ogni
  // gesto la faceva salire e mandava a vuoto l'INTERO ring — 121 chunk
  // riseminati per un ciuffo, misurati. Vedi la prova sulle semine più sotto.
  const e = nuova();
  const ver = () => e._verChunk.get('0,0') || 0;
  const v0 = ver();
  e.rasa(1, 1);   assert.ok(ver() > v0, 'rasare');
  const v1 = ver();
  e.posa(2, 7, 2); assert.ok(ver() > v1, 'piantare');
  const v2 = ver();
  e.togliRasa(1, 1); assert.ok(ver() > v2, 'far ricrescere');
});

test('e un chunk non risente di quello che succede in un altro', () => {
  // ⚠ È LA PROPRIETÀ CHE FA COMPARIRE L'ERBA SUBITO: se toccare una cella
  // sporcasse anche i vicini, tornerebbero da riseminare tutti.
  const e = nuova();
  e.posa(2, 7, 2);                       // chunk 0,0
  const lontano = e._verChunk.get('3,3') || 0;
  e.rasa(1, 1);                          // ancora chunk 0,0
  assert.equal(e._verChunk.get('3,3') || 0, lontano, 'il chunk lontano non si è mosso');
  assert.ok((e._verChunk.get('0,0') || 0) >= 2, 'e quello toccato sì');
});

test('le celle sono indipendenti: rasare una non tocca le altre', () => {
  const m = prato(), e = nuova();
  e.rasa(0, 0);
  assert.equal(e.haFili(0, 7, 0, m), false);
  assert.equal(e.haFili(1, 7, 0, m), true, 'quella accanto resta com\'era');
  assert.equal(e.haFili(0, 7, 1, m), true);
});

// ---------------------------------------------------------------------------
// QUANTO CI METTE A COMPARIRE — che è una domanda sulle PRESTAZIONI, ed è per
// questo che si misura invece di guardarla.
//
// ⚠ Committente: «quando la piazzi compare dopo parecchio». Vero, e la causa
// non era l'erba lenta: era che posare UN ciuffo faceva riseminare TUTTO il
// prato attorno al giocatore, perché la revisione dei ciuffi posati stava nella
// chiave della cache — una sola, valida per l'intero mondo. Cambiarla mandava a
// vuoto le 121 voci del ring insieme, e il prato non si scambia finché la coda
// non è finita: con un budget di pochi millisecondi per fotogramma sono secondi.

/** Un prato abbastanza largo da coprire tutto il ring: se i chunk sono VUOTI la
 *  misura non dice niente, perché un chunk vuoto costa quasi zero. */
function pratoLargo(r = 96) {
  const m = new Mondo();
  for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
    m.metti(x, 6, z, 'erba', true); m.metti(x, 5, z, 'terra', true);
  }
  return m;
}

/** Semina finché la coda non è vuota, contando i fotogrammi e le semine VERE. */
function macina(e, m, dove = { x: 0, y: 7, z: 0 }) {
  const vero = e._seminaVero.bind(e);
  let semine = 0;
  e._seminaVero = (...a) => { semine++; return vero(...a); };
  let giri = 0;
  do { e.aggiorna(0.016, m, dove, null, dove); giri++; } while (e._coda.length && giri < 500);
  e._seminaVero = vero;
  return { giri, semine };
}

test('posare un ciuffo risemina UN chunk, non tutto il prato', () => {
  const m = pratoLargo();
  const e = new Erba({}, { max: 900000, densita: 4, raggioChunk: 5 });
  macina(e, m);                                  // il ring è caldo
  const dopo = macina(e, m);
  assert.equal(dopo.semine, 0, 'senza cambiamenti non si risemina niente');

  e.posa(1, 7, 1);
  const conCiuffo = macina(e, m);
  // ⚠ IL NUMERO CHE CONTA: 121 = tutto il ring, 1 = solo il chunk toccato.
  assert.ok(conCiuffo.semine <= 2,
    `posare un ciuffo ha riseminato ${conCiuffo.semine} chunk: deve toccarne uno`);
});

test('e il ciuffo compare SUBITO, non dopo parecchi fotogrammi', () => {
  const m = pratoLargo();
  // ⚠ SU UNA LASTRA DI PIETRA, se no il ciuffo si pianta dove l'erba c'era già
  // e il conto non cambia: la prova passerebbe senza aver misurato niente.
  m.metti(1, 6, 1, 'pietra', true);
  const e = new Erba({}, { max: 900000, densita: 4, raggioChunk: 5 });
  macina(e, m);
  const prima = e.fili;
  e.posa(1, 7, 1);
  // un solo fotogramma: la coda deve svuotarsi e lo scambio deve essere avvenuto
  // ⚠ AL PIÙ DUE FOTOGRAMMI: misurati 11 prima della correzione, cioè quasi due
  // decimi di secondo dopo il clic. Vedi BUDGET_GESTO in `erba.js`.
  let giri = 0;
  do { e.aggiorna(0.016, m, { x: 0, y: 7, z: 0 }, null, { x: 0, y: 7, z: 0 }); giri++; }
  while (e._coda.length && giri < 60);
  assert.ok(giri <= 2, `il prato si è riscambiato dopo ${giri} fotogrammi`);
  assert.ok(e.fili > prima, `i fili devono essere aumentati subito (${prima} → ${e.fili})`);
});

test('rasare toglie i fili subito e senza riseminare il mondo', () => {
  const m = pratoLargo();
  const e = new Erba({}, { max: 900000, densita: 4, raggioChunk: 5 });
  macina(e, m);
  const prima = e.fili;
  e.rasa(0, 0);
  const r = macina(e, m);
  assert.ok(r.semine <= 2, `rasare ha riseminato ${r.semine} chunk`);
  assert.ok(e.fili < prima, `i fili devono calare subito (${prima} → ${e.fili})`);
});

// L'OMEGA TEST: la macchina a gradini, provata senza GPU.
//
// ⚠ Un banco che misura è esattamente la cosa che non ci si accorge di aver
// rotto: se un giorno smette di buttare via il riscaldo, i numeri arrivano e
// SEMBRANO a posto. È la stessa ragione per cui `ui/rapporto.js` è una funzione
// pura provata in Node.
import test from 'node:test';
import assert from 'node:assert/strict';
import { BancoOmega, GRADINI } from '../src/partita/banco-omega.js';

/** Fa girare il banco con una durata per gradino, e torna gli esiti. */
function gira(banco, msPerGradino, scenaPerGradino = null) {
  let carico = banco.avvia(), i = 0;
  const applicati = [carico];
  let giri = 0;
  while (banco.inCorso && giri++ < 200000) {
    const r = banco.passo(msPerGradino[i] ?? 16.7, scenaPerGradino ? scenaPerGradino[i] : null);
    if (r.cambiato) { i++; if (r.carico) applicati.push(r.carico); }
  }
  return applicati;
}

test('il banco fa tutti i gradini e ne applica il carico, uno alla volta', () => {
  const b = new BancoOmega({ riscaldo: 5, misurati: 40 });
  const applicati = gira(b, GRADINI.map(() => 16.7));
  assert.equal(b.fase, 'finito');
  assert.equal(b.esiti.length, GRADINI.length);
  assert.equal(applicati.length, GRADINI.length, 'ogni gradino deve ricevere il suo carico');
  assert.deepEqual(b.esiti.map((e) => e.id), GRADINI.map((g) => g.id));
});

test('⚠ IL RISCALDO SI BUTTA DAVVERO: i primi fotogrammi non entrano nella misura', () => {
  // ⚠ È LA PROVA CHE VALE PIÙ DI TUTTE. Cambiando gradino la partita registra
  // blocchi, costruisce mesh, compila shader: i primi fotogrammi misurano IL
  // CAMBIO. Se il riscaldo non si buttasse, ogni gradino uscirebbe più lento di
  // quello che è — e il banco direbbe che il motore non regge un carico che
  // regge benissimo.
  const b = new BancoOmega({ gradini: [GRADINI[0]], riscaldo: 30, misurati: 60 });
  b.avvia();
  for (let i = 0; i < 30; i++) b.passo(500);    // il cambio: fotogrammi lentissimi
  for (let i = 0; i < 60; i++) b.passo(16.7);   // il regime
  const m = b.esiti[0].misura;
  assert.ok(m.p50 < 20, `il riscaldo è entrato nella misura: p50 ${m.p50.toFixed(1)} ms`);
  assert.equal(m.max, 16.7, 'nessun fotogramma del riscaldo deve essere finito nel campione');
});

test('le letture della scena si prendono al MASSIMO, non all\'ultimo fotogramma', () => {
  // ⚠ Durante un gradino la camera gira e il frustum scarta roba diversa:
  // l'ultimo fotogramma direbbe «quanti disegni c'erano quando ho smesso di
  // guardare», che non è il costo di quel carico.
  const b = new BancoOmega({ gradini: [GRADINI[0]], riscaldo: 0, misurati: 40 });
  b.avvia();
  for (let i = 0; i < 40; i++) b.passo(16.7, { disegni: i === 12 ? 900 : 100, triangoli: 10 });
  assert.equal(b.esiti[0].scena.disegni, 900);
});

test('il verdetto dice dove si rompe e di chi è la colpa', () => {
  const b = new BancoOmega({ riscaldo: 2, misurati: 40 });
  // i primi gradini lisci a 60, poi sempre peggio; l'ultimo (AR) costa il doppio
  // del penultimo, che e' quello che deve fare una seconda resa completa
  gira(b, [16.7, 16.7, 16.7, 30, 60, 120, 228]);
  const v = b.verdetto();
  assert.equal(v.ultimoBuono, 'modelli256', 'e quello prima della prima rottura');
  assert.equal(v.primoRotto, 'modelli1024', 'deve dire dove si rompe');
  // ⚠ IL PREZZO DELL'AR È UN RAPPORTO, non una differenza: «costa il doppio» si
  // porta su un'altra macchina, «costa 8 ms» no.
  assert.ok(v.prezzoAr > 1.5 && v.prezzoAr < 2.5, `il gradino AR costa ${v.prezzoAr}× (atteso ~1,9)`);
  assert.equal(v.collo, 'quanti', 'a 120 ms per fotogramma il collo sono i fotogrammi, non il ritmo');
  assert.ok(v.prezzoCarico > 5, 'il carico pieno deve costare molto più del riposo');
});

test('e un banco che non ha girato non inventa un verdetto', () => {
  assert.equal(new BancoOmega().verdetto(), null);
});

test('l\'avanzamento sale da zero a uno e non torna indietro', () => {
  const b = new BancoOmega({ riscaldo: 3, misurati: 20 });
  assert.equal(b.avanzamento, 0);
  b.avvia();
  let prima = 0, giri = 0;
  while (b.inCorso && giri++ < 100000) {
    b.passo(16.7);
    assert.ok(b.avanzamento >= prima - 1e-9, 'l\'avanzamento è tornato indietro');
    prima = b.avanzamento;
  }
  assert.equal(b.avanzamento, 1);
});

test('ogni gradino cambia UNA cosa sola rispetto al precedente', () => {
  // ⚠ È LA REGOLA DEL BANCO, e non è pignoleria: tre modifiche e una misura non
  // è una misura. Se un gradino cambiasse due voci insieme, il suo numero non
  // direbbe quale delle due lo ha prodotto — che è tutto quello che serve.
  for (let i = 1; i < GRADINI.length; i++) {
    const a = GRADINI[i - 1].carico, b = GRADINI[i].carico;
    const diverse = Object.keys(b).filter((k) => a[k] !== b[k]);
    assert.equal(diverse.length, 1,
      `«${GRADINI[i].nome}» cambia ${diverse.length} voci rispetto al precedente (${diverse.join(', ')}): il suo numero non dirà di chi è la colpa`);
  }
});

test('e la prova AR è davvero la doppia resa, per ultima', () => {
  const ar = GRADINI[GRADINI.length - 1];
  assert.equal(ar.id, 'ar');
  assert.equal(ar.carico.ar, true);
  assert.ok(GRADINI.slice(0, -1).every((g) => g.carico.ar === false),
    'solo l\'ultimo gradino accende la doppia resa: se no ogni misura porterebbe il costo dell\'AR dentro');
});

test('⚠ e «ultimo buono» è quello PRIMA della rottura, non quello con voto alto', () => {
  // ⚠ I VOTI NON SONO MONOTONI, e la prima misura vera lo ha mostrato subito: a
  // 1024 arredi unici la macchina alternava 7 e 14 ms (un vsync sì e uno no) e
  // prendeva 16; al gradino DOPO, con la doppia resa dell'AR, stava stabile a
  // 14 e prendeva 71. Prendendo «l'ultimo con voto alto» il verdetto diceva
  // «ultimo gradino buono: AR» — il contrario della verità.
  const b = new BancoOmega({ riscaldo: 0, misurati: 40 });
  // buono, buono, ROTTO (alternanza), poi stabile ma lento: 71 punti
  const durate = [16.7, 16.7, null, 14, 14, 14, 14];
  let carico = b.avvia(), i = 0, k = 0;
  while (b.inCorso) {
    const d = durate[i];
    b.passo(d === null ? (k++ % 2 ? 7 : 14) : d);
    const r = b.passo(d === null ? (k++ % 2 ? 7 : 14) : d);
    if (r.cambiato) i++;
  }
  const v = b.verdetto();
  assert.equal(v.primoRotto, 'modelli64', `si rompe a ${v.primoRotto}`);
  assert.equal(v.ultimoBuono, 'luci', `ultimo buono ${v.ultimoBuono}: deve essere quello PRIMA della rottura`);
});

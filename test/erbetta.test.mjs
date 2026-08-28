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
  const e = nuova();
  const v0 = e._verPosati;
  e.rasa(1, 1);   assert.ok(e._verPosati > v0, 'rasare');
  const v1 = e._verPosati;
  e.posa(2, 7, 2); assert.ok(e._verPosati > v1, 'piantare');
  const v2 = e._verPosati;
  e.togliRasa(1, 1); assert.ok(e._verPosati > v2, 'far ricrescere');
});

test('le celle sono indipendenti: rasare una non tocca le altre', () => {
  const m = prato(), e = nuova();
  e.rasa(0, 0);
  assert.equal(e.haFili(0, 7, 0, m), false);
  assert.equal(e.haFili(1, 7, 0, m), true, 'quella accanto resta com\'era');
  assert.equal(e.haFili(0, 7, 1, m), true);
});

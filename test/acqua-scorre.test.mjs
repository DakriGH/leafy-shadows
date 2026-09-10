// L'ACQUA CHE SCORRE — le regole di Minecraft, finalmente eseguite.
//
// ⚠ QUESTA SIMULAZIONE NON SI ERA MAI AVVIATA. `world/acqua.js` importava un
// `config.js` che in Leafy-Shadows non esiste, e `SimAcqua` non compariva in un
// solo import di tutto il progetto: scritta, ragionata, mai girata. Il
// committente se n'e' accorto dal risultato («l'acqua non si aggiorna in modo
// dinamico come su Minecraft»), non dal codice — che e' l'unico modo di
// accorgersi di una cosa che semplicemente non gira. Da qui in poi c'e' una
// prova, cosi' non puo' succedere di nuovo in silenzio.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { SimAcqua, ACQUA } from '../src/world/acqua.js';
import { livelloAcqua } from '../src/world/blocks.js';

/** Un pavimento di pietra da (-r,-r) a (r,r) alla quota 0. */
function vasca(r = 10) {
  const m = new Mondo();
  for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) m.metti(x, 0, z, 'pietra', true);
  return m;
}
function gira(sim, quanti = 200) { let n = 0; for (let i = 0; i < quanti; i++) n += sim.tick(); return n; }
const liv = (m, x, y, z) => { const t = m.tipo(x, y, z); return t === null ? null : livelloAcqua(t); };

test('UNA SORGENTE RIEMPIE LE CELLE VUOTE ACCANTO, perdendo un livello per cella', () => {
  const m = vasca();
  m.metti(0, 1, 0, 'acqua', true);
  const sim = new SimAcqua(m);
  sim.pianificaAttorno([0, 1, 0]);
  gira(sim);

  assert.equal(liv(m, 0, 1, 0), 0, 'la sorgente resta sorgente');
  assert.equal(liv(m, 1, 1, 0), 1, 'accanto arriva un flusso di livello 1');
  assert.equal(liv(m, 2, 1, 0), 2);
  assert.equal(liv(m, 3, 1, 0), 3);
  // ⚠ e si ferma alla portata: se no un rubinetto allagherebbe il mondo
  assert.equal(liv(m, ACQUA.portata, 1, 0), ACQUA.portata);
  assert.equal(liv(m, ACQUA.portata + 1, 1, 0), null, 'oltre la portata non arriva');
});

test('L\'ACQUA SCENDE se puo\', e cadendo non perde forza', () => {
  const m = new Mondo();
  for (let x = -3; x <= 3; x++) for (let z = -3; z <= 3; z++) m.metti(x, 0, z, 'pietra', true);
  m.metti(0, 5, 0, 'acqua', true);
  const sim = new SimAcqua(m);
  sim.pianificaAttorno([0, 5, 0]);
  gira(sim, 400);
  for (let y = 4; y >= 1; y--) assert.equal(liv(m, 0, y, 0), 1, `alla quota ${y} manca la caduta`);
});

test('DUE SORGENTI CON UN APPOGGIO FANNO UNA SORGENTE: è l\'acqua infinita', () => {
  const m = vasca();
  m.metti(-1, 1, 0, 'acqua', true);
  m.metti(1, 1, 0, 'acqua', true);
  const sim = new SimAcqua(m);
  sim.pianificaAttorno([-1, 1, 0]); sim.pianificaAttorno([1, 1, 0]);
  gira(sim);
  assert.equal(liv(m, 0, 1, 0), 0, 'in mezzo doveva nascere una sorgente');
});

test('TOLTA LA SORGENTE, il flusso decade e sparisce', () => {
  const m = vasca();
  m.metti(0, 1, 0, 'acqua', true);
  const sim = new SimAcqua(m);
  sim.pianificaAttorno([0, 1, 0]);
  gira(sim);
  assert.equal(liv(m, 3, 1, 0), 3, 'prima il flusso c\'era');

  m.togli(0, 1, 0, true);
  sim.pianificaAttorno([0, 1, 0]);
  gira(sim, 600);
  for (let x = 0; x <= 4; x++) assert.equal(liv(m, x, 1, 0), null, `in ${x} è rimasta acqua`);
});

test('UNA BUCA SCAVATA ACCANTO A UN LAGO SI RIEMPIE — il caso vero del gioco', () => {
  // ⚠ È il gesto che il committente fa davvero: si scava vicino all'acqua e ci
  // si aspetta che entri. Prima non entrava, perché la sim non girava.
  const m = vasca(12);
  for (let x = -8; x <= -2; x++) for (let z = -4; z <= 4; z++) m.metti(x, 1, z, 'acqua', true);   // il lago
  for (let x = -1; x <= 3; x++) for (let z = -1; z <= 1; z++) m.metti(x, 1, z, 'terra', true);    // la riva
  const sim = new SimAcqua(m);
  gira(sim, 50);
  assert.equal(liv(m, -1, 1, 0), null, 'a riva chiusa non deve entrare niente');

  // ⚠ SI SCAVA DOVE LA RIVA TOCCA IL LAGO. La prima stesura di questa prova
  // scavava a due celle dall'acqua, con la terra in mezzo, e poi si stupiva che
  // restasse asciutta: era la prova a essere sbagliata, non la simulazione.
  m.togli(-1, 1, 0, true);                   // il lago finisce a x = −2: questa è la cella che lo tocca
  sim.pianificaAttorno([-1, 1, 0]);
  gira(sim, 400);
  assert.notEqual(liv(m, -1, 1, 0), null, 'la buca accanto al lago è rimasta asciutta');
  assert.equal(liv(m, 0, 1, 0), null, 'e la terra accanto è rimasta terra');
});

test('IL BUDGET FRENA: un tick non lavora piu\' di quanto dichiarato', () => {
  // ⚠ Senza freno, una diga aperta su un lago grande fa un tick da diecimila
  // celle e il fotogramma sparisce. Con il budget l'acqua ci mette qualche tick
  // in più, e non si vede la differenza — anche l'acqua vera ci mette un momento.
  const m = vasca(20);
  const sim = new SimAcqua(m);
  for (let x = -20; x <= 20; x++) for (let z = -20; z <= 20; z++) sim.pianifica(x, 1, z);
  const prima = sim.coda.size;
  assert.ok(prima > ACQUA.budget * 2, 'la prova non mette in coda abbastanza celle');
  sim.tick();
  assert.equal(prima - sim.coda.size, ACQUA.budget, 'un tick ha lavorato più del budget');
});

test('la sim scrive in SILENZIO: non finisce nel registro delle modifiche del giocatore', () => {
  // ⚠ Se no, ogni goccia che si muove sarebbe una «modifica del giocatore» da
  // salvare, e un ruscello riempirebbe il salvataggio all'infinito.
  const m = vasca();
  const eventi = [];
  m.onEvento = (e) => eventi.push(e);
  m.metti(0, 1, 0, 'acqua', true);
  const sim = new SimAcqua(m);
  sim.pianificaAttorno([0, 1, 0]);
  gira(sim);
  assert.equal(eventi.length, 0, 'la simulazione ha emesso eventi');
});

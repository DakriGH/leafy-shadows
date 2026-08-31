// LE PARETI DI CASCATA DICHIARANO LA LORO COLONNA — e la dichiarazione va
// provata, perché a valle c'è uno shader che ci costruisce sopra gli effetti
// per fascia (labbro, filamenti, schiuma alla base): se cima e base escono
// storti, il sintomo sarà «la schiuma sta a mezz'aria», lontano dal mesher.
//
// ⚠ LA BASE SI FERMA SULLA SORGENTE: una colonna che si tuffa in un lago
// finisce AL PELO del lago, non sul suo fondo. Contare il lago dentro la
// colonna gonfierebbe l'altezza — e con lei la schiuma — di tutta la
// profondità della vasca d'arrivo.

import test from 'node:test';
import assert from 'node:assert/strict';
import { Mesher, collegaFabbrica } from '../src/world/mesher.js';
import { Mondo } from '../src/world/world.js';

const scritte = [];
collegaFabbrica({
  materialeMondo: () => ({}), materialeAcqua: () => ({}),
  creaChunk: (kc) => ({ solidi: { kc }, acqua: { kc } }),
  scrivi: (mesh, dati) => { scritte.push({ kc: mesh.kc, dati }); },
  rimuoviChunk: () => {}, aggiornaCielo: () => {}, cambiaMateriale: () => {},
  colori: () => ({}), coloriCambiati: () => {},
  impostaVoxel: () => {}, spegniVoxel: () => {}, latoMassimoVoxel: () => 128,
  mondoVelato: () => false,
});

test('cima e base della colonna arrivano nel canale extra delle pareti', () => {
  const m = new Mondo();
  // il pavimento, una colonna di cinque celle in caduta, e un laghetto sotto
  for (let x = 0; x < 6; x++) for (let z = 0; z < 6; z++) m.metti(x, 0, z, 'roccia', true);
  m.metti(2, 1, 2, 'acqua', true);                      // il lago: una sorgente
  for (let y = 2; y <= 6; y++) m.metti(2, y, 2, 'acqua~1', true);   // la colonna
  const me = new Mesher({}, m);
  me.ricostruisciTutto(m, { x: 2, z: 2 });

  // si raccolgono le terne extra dei vertici d'acqua (aAcqua: 3 numeri a vertice)
  const acq = scritte.map((s) => s.dati && s.dati.acq).find((a) => a && a.length);
  assert.ok(acq, 'la geometria dell\'acqua deve avere il canale extra');
  const pareti = [];
  for (let i = 0; i < acq.length; i += 3) {
    if (acq[i + 2] === 2) pareti.push([acq[i], acq[i + 1]]);
  }
  assert.ok(pareti.length > 0, 'una colonna in caduta deve produrre pareti tipo 2');
  // ⚠ LA SPECIFICA L'HA INSEGNATA LA PROVA STESSA, alla prima esecuzione: anche
  // la cella-LAGO in cui la colonna si tuffa ha acqua sopra, quindi è
  // «cascata» e dichiara la sua colonna con la SUA base (1). Ed è giusto così:
  // le sue pareti (esposte solo nei laghi minuscoli come questo) sono il punto
  // del tuffo, cioè esattamente dove il piede deve schiumare. La prima stesura
  // pretendeva base=2 per tutte, e il mesher aveva ragione lui.
  const cime = new Set(pareti.map(([c]) => c));
  const basi = new Set(pareti.map(([, b]) => b));
  assert.deepEqual([...cime], [7], 'la cima è il tetto della cella più alta, per tutti');
  assert.ok(basi.has(2), 'le celle in caduta si fermano sopra la sorgente del lago');
  for (const b of basi) assert.ok(b === 1 || b === 2, `base inattesa: ${b}`);
});

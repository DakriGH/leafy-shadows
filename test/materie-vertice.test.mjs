// L'IDENTITÀ DELLA MATERIA VIAGGIA NEL VERTICE — il livello per pixel di world/materie.js.
//
// ⚠ IL DIFETTO CHE PRESIDIA È MUTO DUE VOLTE: un buffer `aMateria` lungo
// diverso dai vertici fa leggere lo shader di traverso (colori a caso, o mesh
// sparita) senza un errore; e un indice sbagliato accende l'emissione sul
// blocco accanto a quello giusto. Qui si contano i float e si controlla CHI
// porta quale numero.
import test from 'node:test';
import assert from 'node:assert/strict';
import { costruisciChunkDati, geometriaSingola, collegaFabbrica } from '../src/world/mesher.js';
import { Mondo } from '../src/world/world.js';
import { MATERIE, NOMI_MATERIE, MATERIE_MAX, indiceMateria, tavolozzaMaterie, GLINT_RAGGIO_MAX } from '../src/world/materie.js';
import { BLOCCHI } from '../src/world/blocks.js';

collegaFabbrica({ aggiornaCielo: () => {}, impostaVoxel: () => {}, spegniVoxel: () => {}, latoMassimoVoxel: () => 128, mondoVelato: () => false });

test('la tavolozza: riga 0 vuota, una riga per materia, nell\'ordine della tabella', () => {
  const t = tavolozzaMaterie();
  assert.equal(t.length, MATERIE_MAX * 4);
  assert.deepEqual([...t.slice(0, 4)], [0, 0, 0, 0], 'la riga 0 è «nessuna materia»');
  for (const nome of NOMI_MATERIE) {
    const i = indiceMateria(nome), m = MATERIE[nome];
    assert.ok(i > 0 && i < MATERIE_MAX, `${nome} ha un indice`);
    // ⚠ È UN Float32Array: 0,6 non è 0,6. Si confronta con la tolleranza del float.
    const vicino = (a, b, cosa) => assert.ok(Math.abs(a - b) < 1e-6, `${nome}: ${cosa} ${a} ≠ ${b}`);
    vicino(t[i * 4], m.emiss || 0, 'emissione');
    vicino(t[i * 4 + 1], m.curva || 0, 'curva');
    assert.ok(t[i * 4 + 2] <= GLINT_RAGGIO_MAX, `${nome}: il brillio non supera il tetto`);
    vicino(t[i * 4 + 3], m.riflette || 0, 'cielo');
  }
  assert.equal(indiceMateria('inesistente'), 0, 'una materia sconosciuta è «nessuna»');
});

test('nel chunk ogni vertice ha la sua materia: ferro sì, erba no', () => {
  const m = new Mondo();
  for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) { m.metti(x, 4, z, 'terra', true); m.metti(x, 5, z, x < 8 ? 'erba' : 'ferro', true); }
  const r = costruisciChunkDati(m, '0,0', 0);
  const { pos, mat } = r.solidi;
  assert.equal(mat.length * 3, pos.length, 'un float per vertice');
  const ferro = indiceMateria(BLOCCHI.ferro.materia);
  let conFerro = 0, senza = 0;
  for (let v = 0; v < mat.length; v++) {
    const x = pos[v * 3];
    if (mat[v] === ferro) { conFerro++; assert.ok(x >= 7.4, `un vertice di ferro a x=${x}`); }
    else { senza++; assert.equal(mat[v], 0); }
  }
  assert.ok(conFerro > 0 && senza > 0, 'ci sono tutt\'e due');
  // e la pelle porta lo stesso numero
  const pelle = costruisciChunkDati(m, '0,0', 1);
  assert.equal(pelle.solidi.mat.length * 3, pelle.solidi.pos.length);
  assert.ok(pelle.solidi.mat.some((v) => v === ferro), 'anche la pelle sa del ferro');
  // e il blocco singolo dell'anteprima
  assert.ok(geometriaSingola('ferro').mat.every((v) => v === ferro));
  assert.ok(geometriaSingola('erba').mat.every((v) => v === 0));
});

test('l\'acqua porta il canale a zero (il suo materiale non lo legge)', () => {
  const m = new Mondo();
  for (let x = 0; x < 4; x++) for (let z = 0; z < 4; z++) { m.metti(x, 4, z, 'terra', true); m.metti(x, 5, z, 'acqua', true); }
  const r = costruisciChunkDati(m, '0,0', 0);
  assert.equal(r.acqua.mat.length * 3, r.acqua.pos.length);
  assert.ok(r.acqua.mat.every((v) => v === 0));
});

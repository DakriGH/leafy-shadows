// IL NUCLEO, in Node: il formato del vertice, gli indici condivisi, il terreno
// finto deterministico e le matrici. Niente GPU qui: si prova quello che si può.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CostruttoreNucleo, leggiVertice, indiciCondivisi, BYTE_VERTICE, QUAD_MAX, N_SU, N_GIU, N_XP, indiceNormale, versoNormale } from '../src/nucleo/formato.js';
import { costruisciChunkFinto, altezza, lampade } from '../src/nucleo/terreno-finto.js';
import { prospettiva, guarda, moltiplica, pianiFrustum, scatolaNelFrustum } from '../src/nucleo/matrici.js';

test('un vertice sono dodici byte in sedicesimi, e si rilegge uguale', () => {
  const c = new CostruttoreNucleo(1);
  c.quadDa([0, 10, 0, N_SU, 15, 3, 0x5ca83d], [-0.125, 10.5625, 16.125, N_SU, 15, 3, 0x5ca83d, 1, 9], [16, 10, 16, N_SU, 15, 3, 0x5ca83d, 1], [16, 10, 0, N_SU, 15, 3, 0x5ca83d]);
  const d = c.dati();
  assert.equal(d.byte.length, 4 * BYTE_VERTICE);
  assert.equal(d.quad, 1); assert.equal(d.triangoli, 2);
  const v = leggiVertice(d.byte, 1);
  assert.deepEqual(v, { x: -0.125, z: 16.125, y: 10.5625, normale: N_SU, vento: 1, materia: 9, cielo: 15, blocco: 3, colore: 0x5ca83d });
  assert.throws(() => c.vertice(31.5, 0, 0, N_SU, 0, 0, 0), RangeError, 'x oltre i nove bit');
  assert.throws(() => c.vertice(0, 4096, 0, N_SU, 0, 0, 0), RangeError, 'y oltre i sedici bit');
  assert.throws(() => c.vertice(0, 0, 0, 13, 0, 0, 0), RangeError, 'la normale zero non esiste');
});

test('la normale a 27 va e torna: facce, smussi, angoli', () => {
  assert.equal(N_SU, 16); assert.equal(N_GIU, 10); assert.equal(N_XP, 22);
  assert.deepEqual(versoNormale(indiceNormale(1, 1, 0)), [1, 1, 0]);
  assert.deepEqual(versoNormale(indiceNormale(-1, 1, -1)), [-1, 1, -1]);
  assert.deepEqual(versoNormale(N_GIU), [0, -1, 0]);
});

test('il costruttore cresce da sé e non supera il tetto dei quad', () => {
  const c = new CostruttoreNucleo(2);
  for (let i = 0; i < 100; i++) c.quadDa([0, 1, 0, N_SU, 15, 0, 0xffffff], [0, 1, 1, N_SU, 15, 0, 0xffffff], [1, 1, 1, N_SU, 15, 0, 0xffffff], [1, 1, 0, N_SU, 15, 0, 0xffffff]);
  assert.equal(c.dati().quad, 100);
  assert.ok(c.byte.length >= 100 * 4 * BYTE_VERTICE);
});

test('gli indici condivisi sono 0 1 2 · 0 2 3 per ogni quad, fino a 65.536 vertici', () => {
  const idx = indiciCondivisi(3);
  assert.deepEqual([...idx], [0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11]);
  const tutti = indiciCondivisi();
  assert.equal(tutti.length, QUAD_MAX * 6);
  assert.equal(tutti[tutti.length - 1], QUAD_MAX * 4 - 1, 'l\'ultimo indice è l\'ultimo vertice a 16 bit');
});

test('il terreno finto è deterministico, chiuso nel chunk e sotto il tetto', () => {
  const a = costruisciChunkFinto(3, -2), b = costruisciChunkFinto(3, -2);
  assert.deepEqual([...a.byte], [...b.byte]);
  assert.ok(a.quad > 300 && a.quad < QUAD_MAX, `quad ${a.quad}`);
  assert.ok(a.minY >= 0 && a.maxY <= 255 && a.minY < a.maxY);
  for (let i = 0; i < a.vertici; i++) {
    const v = leggiVertice(a.byte, i);
    assert.ok(v.x <= 16 && v.z <= 16 && v.y >= a.minY && v.y <= a.maxY, `vertice ${i} fuori: ${JSON.stringify(v)}`);
  }
  // la cima di ogni colonna sta a altezza+1
  const v0 = leggiVertice(a.byte, 0);
  assert.equal(v0.y, altezza(3 * 16, -2 * 16) + 1);
});

test('cento chunk stanno fra i 200k e i 400k triangoli: la scena della porta F0', () => {
  let tri = 0;
  for (let cx = -5; cx < 5; cx++) for (let cz = -5; cz < 5; cz++) tri += costruisciChunkFinto(cx, cz).triangoli;
  assert.ok(tri > 200000 && tri < 400000, `${tri}`);
  assert.ok(lampade(0, 0).length <= 2);
});

test('le matrici: un punto davanti alla camera sta nel frustum, uno dietro no', () => {
  const P = prospettiva(0.9, 16 / 9, 0.3, 400), V = guarda([0, 10, 30], [0, 0, 0]);
  const VP = moltiplica(P, V);
  const piani = pianiFrustum(VP);
  assert.ok(scatolaNelFrustum(piani, -1, -1, -1, 1, 1, 1), 'l\'origine è davanti');
  assert.ok(!scatolaNelFrustum(piani, -1, 9, 60, 1, 11, 62), 'dietro la camera no');
  assert.ok(!scatolaNelFrustum(piani, 500, 0, 0, 501, 1, 1), 'lontano a destra no');
});

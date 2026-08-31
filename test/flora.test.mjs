// LA FLORA SI PROVA IN NODE — geometrie e semina, senza motore.
//
// ⚠ I difetti che queste prove inchiodano sono tutti MUTI a schermo: una
// geometria con i colori disallineati esce «quasi giusta» (colori a caso ma
// plausibili), una semina non deterministica dà mondi diversi a ogni avvio (e
// misure non confrontabili), un fiore dentro l'acqua si nota dopo giorni.

import test from 'node:test';
import assert from 'node:assert/strict';
import { FAMIGLIE, semina } from '../src/world/flora.js';
import { Mondo } from '../src/world/world.js';

test('ogni geometria ha posizioni e colori allineati, in terne e quaterne', () => {
  for (const [nome, f] of Object.entries(FAMIGLIE)) {
    // il generatore riceve un caso finto deterministico
    let s = 42;
    const r = () => { s = (s * 16807) % 2147483647; return (s % 1000) / 1000; };
    const g = f.costruisci(r);
    assert.ok(g.pos.length >= 9, `${nome}: almeno un triangolo`);
    assert.equal(g.pos.length % 9, 0, `${nome}: le posizioni vanno a triangoli interi`);
    assert.equal(g.col.length / 4, g.pos.length / 3, `${nome}: un colore RGBA per vertice`);
    for (const c of g.col) assert.ok(c >= 0 && c <= 1, `${nome}: colori in [0,1]`);
  }
});

test('le geometrie stanno sopra il suolo, non ci affondano dentro', () => {
  let s = 7;
  const r = () => { s = (s * 16807) % 2147483647; return (s % 1000) / 1000; };
  for (const [nome, f] of Object.entries(FAMIGLIE)) {
    const g = f.costruisci(r);
    let minY = Infinity;
    for (let i = 1; i < g.pos.length; i += 3) minY = Math.min(minY, g.pos[i]);
    assert.ok(minY > -0.35, `${nome}: il punto più basso (${minY}) non sprofonda`);
  }
});

function mondoDiProva() {
  const m = new Mondo();
  for (let x = 0; x < 30; x++) {
    for (let z = 0; z < 30; z++) {
      m.metti(x, 4, z, 'terra', true);
      m.metti(x, 5, z, 'erba', true);
    }
  }
  // una pozza: qui non si semina, ma le canne la vogliono VICINA
  for (let x = 10; x < 14; x++) for (let z = 10; z < 14; z++) {
    m.togli(x, 5, z, true);
    m.metti(x, 5, z, 'acqua', true);
  }
  return m;
}

test('la semina è deterministica: stesso seme, stesso bosco', () => {
  const dove = { x0: 0, z0: 0, x1: 30, z1: 30 };
  const a = semina(mondoDiProva(), dove, { densita: 3 });
  const b = semina(mondoDiProva(), dove, { densita: 3 });
  assert.deepEqual(a, b);
});

test('niente flora nell\'acqua, e le canne solo vicino alla riva', () => {
  const dove = { x0: 0, z0: 0, x1: 30, z1: 30 };
  const e = semina(mondoDiProva(), dove, { densita: 6, seme: 99 });
  const tutte = Object.entries(e).flatMap(([n, v]) => v.map((p) => ({ ...p, n })));
  assert.ok(tutte.length > 10, 'con densità alta qualcosa nasce');
  for (const p of tutte) {
    const dentroPozza = p.x >= 10 && p.x < 14 && p.z >= 10 && p.z < 14;
    assert.ok(!dentroPozza, `${p.n} dentro l'acqua a ${p.x},${p.z}`);
  }
  for (const c of e.canna) {
    const vicino = c.x >= 7 && c.x <= 17 && c.z >= 7 && c.z <= 17;
    assert.ok(vicino, `canna lontana dall'acqua a ${c.x},${c.z}`);
  }
});

test('la densità scala la quantità, non la disposizione delle prime', () => {
  const dove = { x0: 0, z0: 0, x1: 30, z1: 30 };
  const poca = Object.values(semina(mondoDiProva(), dove, { densita: 1 })).flat().length;
  const tanta = Object.values(semina(mondoDiProva(), dove, { densita: 8 })).flat().length;
  assert.ok(tanta > poca * 3, `8× la densità deve dare molte più piante (${poca} → ${tanta})`);
});

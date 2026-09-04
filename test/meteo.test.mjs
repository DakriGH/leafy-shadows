import test from 'node:test';
import assert from 'node:assert/strict';
import { Meteo } from '../src/partita/meteo.js';

test('il mare vaga fra 0 e 1, piano, e con lo stesso seme fa la stessa strada', () => {
  const a = new Meteo(7), b = new Meteo(7);
  let max = 0, salto = 0, prec = a.agitazione;
  for (let i = 0; i < 6000; i++) {
    const v = a.aggiorna(0.1); b.aggiorna(0.1);
    assert.ok(v >= 0 && v <= 1);
    salto = Math.max(salto, Math.abs(v - prec)); prec = v; max = Math.max(max, v);
  }
  assert.ok(salto < 0.02, 'niente scatti: ' + salto);
  assert.ok(max > 0.3, 'in dieci minuti si muove: ' + max);
  assert.equal(a.agitazione, b.agitazione);
});

test('fermo resta dov\'è', () => {
  const m = new Meteo(3); m.auto = false; m.agitazione = 0.7;
  for (let i = 0; i < 100; i++) m.aggiorna(1);
  assert.equal(m.agitazione, 0.7);
});

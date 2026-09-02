// L'ERBA DEL NUCLEO: fili a triangolo nel formato a otto byte, dentro il chunk.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CostruttoreErba, BYTE_FILO } from '../src/nucleo/erba.js';
import { Mondo } from '../src/world/world.js';
import { costruisciChunkNucleo } from '../src/nucleo/mesher-nucleo.js';

test('un ciuffo sono tre vertici per filo, dentro il chunk, base e punta', () => {
  const c = new CostruttoreErba(4);
  const n = c.ciuffo(5, 6, 7, 0, 0, 0x4f9e46, 15, 1);
  const d = c.dati();
  assert.ok(n >= 2 && n <= 10, `${n} fili`);
  assert.equal(d.vertici, n * 3); assert.equal(d.fili, n);
  assert.equal(d.byte.length, n * 3 * BYTE_FILO);
  for (let i = 0; i < d.vertici; i++) {
    const o = i * BYTE_FILO;
    assert.ok(d.byte[o] <= 128 && d.byte[o + 1] <= 128, 'in ottavi dentro il chunk');
    assert.ok(d.byte[o + 2] >= (6 + 1 - 4) * 8, 'sopra la cima della cella');
    const punta = d.byte[o + 7] & 1;
    assert.equal(punta, i % 3 === 2 ? 1 : 0, 'la punta è il terzo vertice');
    assert.equal(d.byte[o + 7] >> 1, 15, 'porta il cielo');
  }
});

test('il mesher mette i fili solo sulle cime d\'erba scoperte, e la densità li scala', () => {
  const m = new Mondo();
  for (let x = 0; x < 8; x++) for (let z = 0; z < 8; z++) m.metti(x, 3, z, x < 4 ? 'erba' : 'terra', true);
  m.metti(0, 4, 0, 'roccia', true);   // una cima coperta
  const d2 = costruisciChunkNucleo(m, '0,0', { erba: 2 });
  const d4 = costruisciChunkNucleo(m, '0,0', { erba: 4 });
  const d0 = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  assert.equal(d0.erba.fili, 0);
  assert.ok(d2.erba.fili > 31 * 2 && d2.erba.fili < 31 * 12, `${d2.erba.fili} fili su 31 cime`);
  assert.ok(d4.erba.fili > d2.erba.fili * 1.5, 'più densità, più fili');
  assert.equal(d2.quad, d0.quad, 'l\'erba non tocca i solidi');
});

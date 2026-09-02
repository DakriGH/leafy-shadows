import test from 'node:test';
import assert from 'node:assert/strict';
import { modelloDaCuboidi, scatola, piramide } from '../src/nucleo/cuboidi.js';
import { gatto, TAVOLOZZE, ARREDI, registraArredi } from '../src/partita/arredi.js';
import { leggiModello } from '../src/nucleo/modelli.js';
import { defDi } from '../src/world/blocks.js';

test('una scatola sono 12 triangoli a 20 byte, con normali unitarie e colore piatto; una piramide 6', () => {
  const m = modelloDaCuboidi([scatola(0, 0, 0, 1, 2, 1, 0x112233)]);
  assert.equal(m.triangoli, 12); assert.equal(m.byte.length, 36 * 20); assert.equal(m.minY, 0); assert.equal(m.maxY, 2);
  assert.deepEqual([m.byte[16], m.byte[17], m.byte[18]], [0x11, 0x22, 0x33]);
  const p = modelloDaCuboidi([piramide(0, 0, 0, 1, 1, 0xffffff)]);
  assert.equal(p.triangoli, 6);
  const dv = new DataView(p.byte.buffer);
  for (let i = 0; i < p.vertici; i++) { const n = [p.byte[i * 20 + 12], p.byte[i * 20 + 13], p.byte[i * 20 + 14]].map((b) => (b > 127 ? b - 256 : b) / 127); assert.ok(Math.abs(Math.hypot(...n) - 1) < 0.03, `normale unitaria: ${n}`); void dv; }
});

test('una scatola girata mantiene il perno e le normali girate', () => {
  const m = modelloDaCuboidi([scatola(0, 0, 0, 1, 1, 1, 0xffffff, { giro: Math.PI / 2 })]);
  const dv = new DataView(m.byte.buffer);
  let xMax = -9; for (let i = 0; i < m.vertici; i++) xMax = Math.max(xMax, dv.getFloat32(i * 20, true));
  assert.ok(Math.abs(xMax - 0.5) < 1e-6, 'girata di 90° attorno al centro è la stessa scatola');
});

test('i gatti delle reference si costruiscono, sono alti circa un blocco e guardano −Z', () => {
  const g = gatto(TAVOLOZZE.blu);
  assert.ok(g.triangoli > 100 && g.maxY > 1.1 && g.maxY < 1.4, `${g.triangoli} triangoli, alto ${g.maxY}`);
  assert.equal(g.minY, 0, 'coi piedi a terra');
  const dv = new DataView(g.byte.buffer);
  let zOcchi = 9; for (let i = 0; i < g.vertici; i++) if (g.byte[i * 20 + 16] === 255 && g.byte[i * 20 + 17] === 255) zOcchi = Math.min(zOcchi, dv.getFloat32(i * 20 + 8, true));
  assert.ok(zOcchi < -0.2, 'gli occhi stanno sul muso, davanti (−Z)');
});

test('gli arredi si registrano come blocchi «modello» non solidi, e ogni modello si costruisce', () => {
  const ids = registraArredi();
  assert.ok(ids.includes('fungo') && ids.includes('scala') && ids.includes('megafono'));
  for (const id of ids) { const d = defDi(id); assert.equal(d.forma, 'modello'); assert.equal(d.modello, id); assert.equal(d.solido, false); const m = ARREDI[id].costruisci(); assert.ok(m.triangoli > 6, id); }
  assert.deepEqual(registraArredi(), ids, 'idempotente');
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { RegistroModelli } from '../src/partita/registro-modelli.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { allungaIstanze, modelloCubo } from '../src/nucleo/modelli.js';

registraDecorazioni();

test('il registro impara dagli eventi del mondo e ricompone solo i tipi cambiati', () => {
  const r = new RegistroModelli();
  r.evento({ tipo: 'metti', cella: [1, 5, 2], blocco: 'albero' });
  r.evento({ tipo: 'metti', cella: [4, 5, 2], blocco: 'lampione' });
  r.evento({ tipo: 'metti', cella: [9, 5, 9], blocco: 'terra' });   // non è un modello
  assert.equal(r.istanze, 2);
  const c = r.cambiate();
  assert.deepEqual(c.map((x) => x[0]).sort(), ['albero', 'lampione']);
  assert.deepEqual([...c.find((x) => x[0] === 'albero')[1]], [1.5, 5, 2.5, 1]);
  assert.equal(r.cambiate().length, 0, 'niente da rifare');
  r.evento({ tipo: 'togli', cella: [1, 5, 2] });
  const d = r.cambiate();
  assert.equal(d.length, 1); assert.equal(d[0][0], 'albero'); assert.equal(d[0][1].length, 0);
});

test('le istanze corte diventano otto float con tinta bianca; il cubo ha 36 vertici a 20 byte', () => {
  assert.deepEqual([...allungaIstanze([1, 2, 3, 4])], [1, 2, 3, 4, 1, 1, 1, 0]);
  assert.equal(allungaIstanze(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]), 8).length, 8);
  const c = modelloCubo([10, 20, 30], 1, 2, 1);
  assert.equal(c.vertici, 36); assert.equal(c.byte.length, 36 * 20); assert.equal(c.maxY, 2);
  assert.deepEqual([c.byte[16], c.byte[17], c.byte[18]], [10, 20, 30]);
});

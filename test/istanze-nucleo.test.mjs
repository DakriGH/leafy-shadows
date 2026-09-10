// Le istanze del nucleo e il cubo: il contratto fra chi produce le liste
// (`partita/entita.js`) e chi le disegna (`nucleo/modelli.js`).
//
// ⚠ Questo file era `registro-modelli.test.mjs`. Il registro dei modelli non
// esiste più: l'hanno sostituito le entità (`test/entita.test.mjs`), che sanno
// dire anche giro, scala e tinta. Qui resta la parte che riguarda il nucleo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { allungaIstanze, modelloCubo } from '../src/nucleo/modelli.js';

test('le istanze corte diventano otto float con tinta bianca; il cubo ha 36 vertici a 20 byte', () => {
  assert.deepEqual([...allungaIstanze([1, 2, 3, 4])], [1, 2, 3, 4, 1, 1, 1, 0]);
  assert.equal(allungaIstanze(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]), 8).length, 8);
  const c = modelloCubo([10, 20, 30], 1, 2, 1);
  assert.equal(c.vertici, 36); assert.equal(c.byte.length, 36 * 20); assert.equal(c.maxY, 2);
  assert.deepEqual([c.byte[16], c.byte[17], c.byte[18]], [10, 20, 30]);
});

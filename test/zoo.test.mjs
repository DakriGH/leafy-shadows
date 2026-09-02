import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { registraArredi } from '../src/partita/arredi.js';
import { generaChunkZoo, QUOTA } from '../src/partita/zoo.js';

registraDecorazioni(); registraArredi();

test('lo zoo: il piano, la vasca, la scalinata, il muro dei materiali, i lampioni e gli arredi', () => {
  const m = new Mondo(); const dec = [];
  for (let cx = -3; cx <= 2; cx++) for (let cz = -3; cz <= 2; cz++) dec.push(...generaChunkZoo(m, cx, cz));
  assert.equal(m.tipo(0, QUOTA, 0), 'erba');
  assert.equal(m.tipo(40, QUOTA, 0), null, 'fuori dal piano non c\'è niente');
  assert.equal(m.tipo(10, QUOTA, -16), 'acqua', 'la vasca');
  assert.equal(m.tipo(-16, QUOTA + 5, 11), 'pietra', 'la scalinata sale');
  assert.equal(m.tipo(-24, QUOTA + 2, 20), 'erba', 'il muro dei materiali parte dal primo blocco della cassetta');
  assert.ok(dec.filter((d) => d[3] === 'lampione').length >= 8, 'il viale');
  assert.ok(dec.some((d) => d[3] === 'gatto') && dec.some((d) => d[3] === 'megafono'), 'gli arredi in fila');
  assert.equal(m.tipo(18, QUOTA + 1, 8), 'lampadaRossa');
});

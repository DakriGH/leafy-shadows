import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo, CHUNK } from '../src/world/world.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { registraArredi } from '../src/partita/arredi.js';
import { generaChunkVetrina, QUOTA } from '../src/partita/vetrina.js';

test('la vetrina è un\'isola nel nulla: erba sopra, terra ai fianchi, pozza, cose', () => {
  registraDecorazioni(); registraArredi();
  const m = new Mondo();
  const deco = [];
  for (let cx = -1; cx <= 0; cx++) for (let cz = -1; cz <= 0; cz++) deco.push(...generaChunkVetrina(m, cx, cz));
  assert.equal(m.tipo(0, QUOTA, -5), 'erba');
  assert.equal(m.tipo(0, QUOTA - 1, -5), 'terra');
  assert.equal(m.tipo(0, QUOTA + 1, -2), 'erba', 'il gradino alto');
  assert.equal(m.tipo(2, QUOTA, 2), 'acqua', 'la pozza');
  assert.equal(m.tipo(12, QUOTA, 0), null, 'fuori dall\'isola non c\'è niente');
  assert.equal(m.tipo(0, QUOTA - 4, 0), null, 'sotto l\'isola il nero');
  const tipi = deco.map((d) => d[3]);
  for (const t of ['albero', 'lampione', 'gatto', 'fungo']) assert.ok(tipi.includes(t), t);
  void CHUNK;
});

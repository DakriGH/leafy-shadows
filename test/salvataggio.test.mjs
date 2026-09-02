import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { generaChunkOpenWorld } from '../src/world/worldgen.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { Frontiera } from '../src/world/frontiera.js';
import { impacchetta, spacchetta, contaModifiche } from '../src/partita/salvataggio.js';

registraDecorazioni();
const nuovo = () => { const m = new Mondo(); const f = new Frontiera(m, (mm, cx, cz) => generaChunkOpenWorld(mm, cx, cz, 4242)); return { m, f }; };

test('le modifiche del giocatore sopravvivono a un pacco e a una rigenerazione dal seme', () => {
  const { m, f } = nuovo();
  f.assicura(0.5, 0.5, { resa: 16 }, { subito: true });
  const t = m.tipo(3, 4, 3);
  m.metti(3, 30, 3, 'mattoni');          // posato in aria, dove il seme non mette niente
  let y = 20; while (y > -20 && !m.tipo(5, y, 5)) y--;   // la cima di una colonna
  const cima = m.tipo(5, y, 5);
  m.togli(5, y, 5);
  assert.equal(contaModifiche(m), 2);
  const pacco = impacchetta(m, { seme: 4242 });
  assert.ok(pacco.length < 400, `è piccolo: ${pacco.length} byte`);
  const { m: m2, f: f2 } = nuovo();
  assert.equal(spacchetta(m2, pacco), 2);
  f2.assicura(0.5, 0.5, { resa: 16 }, { subito: true });
  assert.equal(m2.tipo(3, 30, 3), 'mattoni', 'il blocco posato c\'è');
  assert.equal(m2.tipo(5, y, 5), null, `la cima tolta manca ancora (era ${cima})`);
  assert.equal(m2.tipo(3, 4, 3), t, 'il resto è quello del seme');
});

test('un pacco rotto o di un\'altra versione non tocca il mondo', () => {
  const { m } = nuovo();
  assert.equal(spacchetta(m, '{non è json'), -1);
  assert.equal(spacchetta(m, JSON.stringify({ v: 99, chunk: {} })), -1);
  assert.equal(spacchetta(m, JSON.stringify({ v: 1, chunk: { 'a,b': [[1, 'x']], '0,0': [[1, 2], ['no', 'x'], [5, 'terra']] } })), 1, 'solo la voce buona');
  assert.equal(spacchetta(m, ''), 0);
});

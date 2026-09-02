// I CORPI del sandbox: cadono, si posano, rimbalzano, dormono, fanno mucchio.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Corpi, PASSO } from '../src/partita/corpi.js';

/** Un pavimento a y < 0 e un muro a x >= 10. */
const mondo = { solido: (x, y, z) => y < 0 || x >= 10 };

test('un cubo cade e si posa sulla faccia sopra del pavimento, senza tremare', () => {
  const c = new Corpi(mondo);
  const k = c.aggiungi({ x: 2, y: 6, z: 2, lato: 0.5 });
  for (let i = 0; i < 180; i++) c.avanza(PASSO);
  assert.ok(Math.abs(k.y - 0.25) < 1e-6, `centro a mezzo lato dal pavimento, era ${k.y}`);
  assert.equal(k.vy, 0);
  assert.ok(k.aTerra);
  const y1 = k.y; c.avanza(PASSO); assert.equal(k.y, y1, 'posato resta posato');
});

test('a passo lungo non attraversa il pavimento (sottopassi)', () => {
  const c = new Corpi(mondo);
  const k = c.aggiungi({ x: 2, y: 1, z: 2, vy: -40, lato: 0.5 });
  c.avanza(PASSO);
  assert.ok(k.y >= 0.25 - 1e-6, `è rimasto sopra il pavimento: ${k.y}`);
});

test('un fotogramma lungo fa al più quattro passi, e uno corto nessuno', () => {
  const c = new Corpi(mondo);
  c.aggiungi({ x: 2, y: 6, z: 2 });
  assert.equal(c.avanza(1), 4);
  assert.equal(c.avanza(PASSO / 3), 0);
  assert.equal(c.avanza(PASSO / 3), 0);
  assert.equal(c.avanza(PASSO / 3), 1, 'i tre terzi fanno un passo');
});

test('contro il muro rimbalza indietro', () => {
  const c = new Corpi(mondo);
  const k = c.aggiungi({ x: 9.3, y: 0.25, z: 2, vx: 12, lato: 0.5 });
  for (let i = 0; i < 30; i++) c.avanza(PASSO);
  assert.ok(k.x < 9.75, `non è entrato nel muro: ${k.x}`);
  assert.ok(k.vx <= 0, `è tornato indietro o fermo: vx ${k.vx}`);
});

test('fermo e appoggiato, dopo un poco dorme; un urto lo sveglia', () => {
  const c = new Corpi(mondo);
  const k = c.aggiungi({ x: 2, y: 0.25, z: 2, lato: 0.5 });
  for (let i = 0; i < 60; i++) c.avanza(PASSO);
  assert.ok(k.dorme, 'dorme');
  assert.equal(c.statistiche.svegli, 0);
  c.aggiungi({ x: 2, y: 0.6, z: 2, lato: 0.5 });   // uno sopra, compenetrato
  c.avanza(PASSO);
  assert.ok(!k.dorme, 'svegliato dal vicino');
});

test('cento cubi nello stesso punto fanno un mucchio, non una scatola sola', () => {
  const c = new Corpi(mondo);
  for (let i = 0; i < 100; i++) c.aggiungi({ x: 5 + (i % 3) * 0.01, y: 3 + i * 0.01, z: 5, lato: 0.5 });
  for (let i = 0; i < 240; i++) c.avanza(PASSO);
  let sopraUno = 0, sparsi = 0;
  for (const k of c.lista) { if (k.y > 0.6) sopraUno++; if (Math.hypot(k.x - 5, k.z - 5) > 0.4) sparsi++; }
  assert.ok(sopraUno > 5, `ce n'è di impilati: ${sopraUno}`);
  assert.ok(sparsi > 20, `e di sparsi intorno: ${sparsi}`);
  for (const k of c.lista) assert.ok(k.y >= 0.25 - 1e-3, 'nessuno sotto il pavimento');
});

test('le istanze sono otto float per corpo, con la base del cubo a terra', () => {
  const c = new Corpi(mondo);
  c.aggiungi({ x: 1, y: 0.25, z: 1, lato: 0.5, colore: [1, 0.5, 0], giro: 0.3 });
  const i = c.istanze();
  assert.equal(i.length, 8);
  assert.deepEqual([...i].map((v) => +v.toFixed(3)), [1, 0, 1, 0.5, 1, 0.5, 0, 0.3]);
});

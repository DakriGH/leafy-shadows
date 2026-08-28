// MIRARE A COSE CHE NON SONO BLOCCHI, e la mano vuota.
//
// ⚠ Il difetto che ha generato tutto questo: un lampione è un modello piantato
// in aria, la griglia sotto è VUOTA, e il cammino ci passava attraverso —
// cliccarlo era impossibile. Il committente: «manca il modo di interagire con i
// lampioni».
import test from 'node:test';
import assert from 'node:assert/strict';
import { miraCompleta, incrociaScatola, PORTATA } from '../src/gioco/mira.js';
import { Lampioni } from '../src/gioco/lampioni.js';
import { azione, Cantiere, CASSETTA } from '../src/gioco/cantiere.js';
import { Luci } from '../src/motore/luci.js';
import { Mondo } from '../src/world/world.js';

const vers = (x, y, z) => { const n = Math.hypot(x, y, z); return { x: x / n, y: y / n, z: z / n }; };
function piano(quota = 6, raggio = 12) {
  const m = new Mondo();
  for (let x = -raggio; x <= raggio; x++) for (let z = -raggio; z <= raggio; z++) m.metti(x, quota, z, 'terra', true);
  return m;
}

test('il raggio incrocia una scatola davanti a sé', () => {
  const d = incrociaScatola({ x: 0, y: 0, z: 0 }, vers(1, 0, 0),
    { x: 4, y: -1, z: -1 }, { x: 5, y: 1, z: 1 }, 20);
  assert.ok(Math.abs(d - 4) < 1e-6);
});

test('e non quella che si ha dietro', () => {
  // ⚠ IL CASO CHE SBAGLIA IN SILENZIO: con gli intervalli non ordinati, una
  // scatola alle spalle dà una distanza NEGATIVA che sembra «vicinissima».
  const d = incrociaScatola({ x: 0, y: 0, z: 0 }, vers(1, 0, 0),
    { x: -5, y: -1, z: -1 }, { x: -4, y: 1, z: 1 }, 20);
  assert.equal(d, -1);
});

test('un raggio parallelo alla lastra non divide per zero', () => {
  // dentro sull'asse y, parallelo: deve incrociare
  assert.ok(incrociaScatola({ x: 0, y: 0, z: 0 }, vers(1, 0, 0),
    { x: 4, y: -1, z: -1 }, { x: 5, y: 1, z: 1 }, 20) >= 0);
  // fuori sull'asse y, parallelo: non deve
  assert.equal(incrociaScatola({ x: 0, y: 9, z: 0 }, vers(1, 0, 0),
    { x: 4, y: -1, z: -1 }, { x: 5, y: 1, z: 1 }, 20), -1);
});

test('si mira al lampione, non al terreno sotto di lui', () => {
  const m = piano(6);
  const lp = new Lampioni();
  lp.aggiungi({ x: 3.5, y: 7, z: 0.5, indiceLuce: 0 });
  const r = miraCompleta(m, { x: 0.5, y: 8.5, z: 0.5 }, vers(1, 0, 0), lp.scatole(), 20);
  assert.ok(r.dato, 'doveva colpire il lampione, non un blocco: ' + JSON.stringify(r));
  assert.equal(r.dato.x, 3.5);
});

test('ma non attraverso un muro', () => {
  // ⚠ LA PROVA CHE VALE: guardando solo «c'è una scatola sul raggio?» si
  // accenderebbe un lampione attraverso la roccia.
  const m = piano(6);
  for (let y = 7; y < 12; y++) m.metti(2, y, 0, 'pietra', true);
  const lp = new Lampioni();
  lp.aggiungi({ x: 5.5, y: 7, z: 0.5, indiceLuce: 0 });
  const r = miraCompleta(m, { x: 0.5, y: 8.5, z: 0.5 }, vers(1, 0, 0), lp.scatole(), 20);
  assert.ok(!r.dato, 'il muro deve vincere');
  assert.deepEqual(r.cella, [2, 8, 0]);
});

test('senza scatole si comporta come la mira di sempre', () => {
  const m = piano(6);
  const a = miraCompleta(m, { x: 0.5, y: 12, z: 0.5 }, vers(0, -1, 0), [], 20);
  assert.deepEqual(a.cella, [0, 6, 0]);
  assert.deepEqual(a.faccia, [0, 1, 0]);
});

test("l'azione dipende da cosa si ha in mano, non da quale tasto", () => {
  assert.equal(azione(null, null), 'rompi', 'mano vuota: si rompe');
  assert.equal(azione('pietra', null), 'posa', 'con un blocco: si posa');
  // ⚠ UN LAMPIONE VINCE SEMPRE, anche con un blocco in mano: se no per
  // accendere una luce bisognerebbe prima svuotarsi le mani.
  assert.equal(azione(null, {}), 'interagisci');
  assert.equal(azione('pietra', {}), 'interagisci');
});

test('la mano vuota è il primo posto della cassetta, e non posa niente', () => {
  assert.equal(CASSETTA[0], null);
  const c = new Cantiere(piano(6), new Luci());
  c.scegli(0);
  assert.equal(c.manoVuota, true);
  assert.equal(c.nomeScelto, 'mano vuota');
  assert.equal(c.posa(0, 8, 0), false, 'con la mano vuota non deve comparire niente');
});

test('i lampioni seguono la notte, e l\'interruttore vale fino al cambio', () => {
  const lp = new Lampioni();
  const a = lp.aggiungi({ x: 0.5, y: 7, z: 0.5, indiceLuce: 0 });
  const b = lp.aggiungi({ x: 9.5, y: 7, z: 0.5, indiceLuce: 1 });
  assert.equal(lp.accesi, 0);
  lp.aggiornaNotte(true);
  assert.equal(lp.accesi, 2, 'di notte si accendono da soli');
  lp.alterna(a);
  assert.equal(a.acceso, false);
  assert.equal(a.aMano, true);
  assert.equal(lp.accesi, 1, 'e uno si può spegnere a mano');
  assert.equal(lp.aggiornaNotte(true), false, 'la stessa notte non rifà niente');
  assert.equal(lp.accesi, 1, 'e non riaccende quello spento a mano');
  lp.aggiornaNotte(false);
  assert.equal(lp.accesi, 0);
  assert.equal(a.aMano, false, 'col giorno il «a mano» si azzera');
  assert.ok(b);
});

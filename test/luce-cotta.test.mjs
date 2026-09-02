// LA LUCE COTTA: cielo dall'alto e dai lati, lampade a caduta, i solidi fermano.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { cuociLuce, CADUTA_LAMPADA } from '../src/nucleo/luce-cotta.js';
import { costruisciChunkNucleo } from '../src/nucleo/mesher-nucleo.js';
import { leggiVertice, N_SU, N_GIU, N_XP, N_XM, N_ZP, N_ZM } from '../src/nucleo/formato.js';

registraDecorazioni();

test('a cielo aperto la cella ha 15; sotto una lastra il cielo entra dai lati e cala di uno', () => {
  const m = new Mondo();
  for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) m.metti(x, 0, z, 'terra', true);
  for (let x = 4; x < 12; x++) for (let z = 4; z < 12; z++) m.metti(x, 3, z, 'roccia', true);   // una lastra sospesa
  const l = cuociLuce(m, '0,0', -2, 6);
  assert.equal(l.leggi(0, 1, 0)[0], 15, 'fuori dalla lastra: cielo pieno');
  assert.equal(l.leggi(4, 1, 8)[0], 14, 'un passo sotto la lastra');
  assert.equal(l.leggi(7, 1, 8)[0], 11, 'quattro passi dentro');
  assert.equal(l.leggi(7, 3, 8)[0], 0, 'dentro la roccia niente');
});

test('una lampada fa 15 alla testa e cala di CADUTA per cella, e un muro la ferma', () => {
  const m = new Mondo();
  for (let x = -8; x < 24; x++) for (let z = -8; z < 24; z++) m.metti(x, 0, z, 'terra', true);
  m.metti(5, 1, 5, 'lampione', true);        // la luce sta a quota +2,6 → cella y = 4
  for (let y = 1; y < 8; y++) m.metti(8, y, 5, 'roccia', true);   // un muro a est
  const l = cuociLuce(m, '0,0', -2, 8);
  assert.equal(l.leggi(5, 4, 5)[1], 15);
  assert.equal(l.leggi(6, 4, 5)[1], 15 - CADUTA_LAMPADA);
  assert.equal(l.leggi(5, 4, 8)[1], 15 - 3 * CADUTA_LAMPADA);
  // oltre il muro la luce arriva solo GIRANDOCI ATTORNO, quindi molto più debole che davanti
  assert.ok(l.leggi(9, 4, 5)[1] < l.leggi(7, 4, 5)[1] - 2 * CADUTA_LAMPADA, `dietro il muro ${l.leggi(9, 4, 5)[1]} contro davanti ${l.leggi(7, 4, 5)[1]}`);
  assert.equal(l.leggi(8, 4, 5)[1], 0, 'dentro il muro niente');
});

test('il mesher scrive nel vertice la luce della cella davanti alla faccia', () => {
  const m = new Mondo();
  for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) m.metti(x, 0, z, 'terra', true);
  m.metti(3, 1, 3, 'lampione', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  let conBlocco = 0, cieloPieno = 0, sopra = 0, fondiBui = 0, fondi = 0;
  for (let i = 0; i < d.vertici; i++) {
    const v = leggiVertice(d.byte, i);
    if (v.blocco > 0) conBlocco++;
    if (v.normale === N_GIU) { fondi++; if (v.cielo < 15) fondiBui++; continue; }   // i fondi stanno sotto la lastra: il cielo entra solo dai lati
    if (v.normale !== N_SU && v.normale !== N_XP && v.normale !== N_XM && v.normale !== N_ZP && v.normale !== N_ZM) continue;   // smussi e angoli: luce del massimo fra i versi
    sopra++; if (v.cielo === 15) cieloPieno++;
  }
  assert.ok(conBlocco > 0, 'le cime attorno al lampione hanno luce di blocco');
  // ⚠ LA LUCE È PER VERTICE (media delle otto celle verso fuori): a cielo aperto
  // le cime hanno cielo pieno; sotto la lastra i fondi sono bui tranne l'orlo,
  // dove il vertice legge anche l'aria di fianco (è l'occlusione ambientale)
  assert.equal(cieloPieno, sopra, 'a cielo aperto ogni faccia che non sia un fondo ha cielo pieno (il cielo è per faccia)');
  assert.equal(fondiBui, fondi, 'e sotto la lastra nessun fondo ha il cielo pieno');
  const senza = costruisciChunkNucleo(m, '0,0', { erba: 0, luce: false });
  assert.equal(senza.quad, d.quad, 'la luce non cambia la geometria');
});

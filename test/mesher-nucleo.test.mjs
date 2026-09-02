// IL MESHER DEL NUCLEO legge il mondo di Leafy e scrive il formato a otto byte,
// coi colori della palette di oggi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { generaOpenWorld } from '../src/world/worldgen.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { paletteBlocco } from '../src/world/stagioni.js';
import { costruisciChunkNucleo, mappaAltezze, SCARTO_Y } from '../src/nucleo/mesher-nucleo.js';
import { leggiVertice } from '../src/nucleo/formato.js';

registraDecorazioni();

test('un blocco solo ha sei facce, coi colori cima/lato/fondo della palette', () => {
  const m = new Mondo(); m.metti(3, 5, 4, 'terra', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  assert.equal(d.quad, 6);
  const pal = paletteBlocco('terra', 5);
  const colori = new Set();
  for (let i = 0; i < d.vertici; i++) colori.add(leggiVertice(d.byte, i).colore);
  assert.ok(colori.has(pal.cima) && colori.has(pal.lato) && colori.has(pal.fondo), 'i tre colori della palette');
  const v0 = leggiVertice(d.byte, 0);
  assert.equal(v0.y, 5 + SCARTO_Y, 'la quota porta lo scarto');
  assert.equal(d.y0, -SCARTO_Y);
  assert.equal(d.altezze[3 * 16 + 4], 5);
});

test('due blocchi adiacenti nascondono le facce in mezzo', () => {
  const m = new Mondo(); m.metti(0, 0, 0, 'terra', true); m.metti(1, 0, 0, 'terra', true);
  assert.equal(costruisciChunkNucleo(m, '0,0', { erba: 0 }).quad, 10);
});

test('l\'erba col cappello mette i ciuffi nel mesh, con la cima che ondeggia', () => {
  const m = new Mondo(); m.metti(2, 0, 2, 'erba', true);
  const senza = costruisciChunkNucleo(m, '0,0', { erba: 0 }).quad;
  const d = costruisciChunkNucleo(m, '0,0', { erba: 3 });
  assert.ok(d.quad > senza, 'ci sono i ciuffi');
  let vento = 0;
  for (let i = 0; i < d.vertici; i++) if (leggiVertice(d.byte, i).vento) vento++;
  assert.ok(vento > 0 && vento % 2 === 0, 'le cime dei fili ondeggiano, i piedi no');
  assert.equal(d.maxY, 0 + 2 + SCARTO_Y);
});

test('l\'acqua mostra la faccia solo verso l\'aria', () => {
  const m = new Mondo(); m.metti(0, 0, 0, 'terra', true); m.metti(0, 1, 0, 'acqua', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  // terra: 5 facce (la cima è coperta dall'acqua? no: l'acqua non è opaca → la cima resta) → 6; acqua: 5 (sotto c'è terra)
  assert.equal(d.quad, 6 + 5);
  assert.equal(d.altezze[0], 0, 'l\'acqua non conta come cima solida');
});

test('l\'open world vero: tutti i chunk stanno sotto il tetto e la mappa delle altezze è piena', () => {
  const m = new Mondo(); generaOpenWorld(m, 4242, 32);
  const chunks = [];
  let tri = 0, cxMin = 99, czMin = 99, cxMax = -99, czMax = -99;
  for (const kc of m.chunks.keys()) {
    const d = costruisciChunkNucleo(m, kc);
    chunks.push(d); tri += d.triangoli;
    cxMin = Math.min(cxMin, d.cx); cxMax = Math.max(cxMax, d.cx); czMin = Math.min(czMin, d.cz); czMax = Math.max(czMax, d.cz);
    assert.ok(d.quad < 16384, `${kc}: ${d.quad} quad`);
  }
  assert.ok(chunks.length >= 16 && tri > 20000, `${chunks.length} chunk, ${tri} triangoli`);
  const alt = mappaAltezze(chunks, cxMin, czMin, cxMax, czMax);
  assert.equal(alt.byte.length, alt.larghezza * alt.profondita);
  let piene = 0; for (const b of alt.byte) if (b > 0) piene++;
  // il mondo copre 65×65 colonne dentro un rettangolo di 5×5 chunk (80×80): il resto è vuoto per davvero
  assert.equal(piene, 65 * 65, 'ogni colonna del mondo ha una cima, e fuori dal mondo niente');
});

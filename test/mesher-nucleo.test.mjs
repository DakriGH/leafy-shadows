// IL MESHER DEL NUCLEO legge il mondo di Leafy e scrive il formato a otto byte,
// coi colori della palette di oggi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { generaOpenWorld } from '../src/world/worldgen.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { paletteBlocco } from '../src/world/stagioni.js';
import { costruisciChunkNucleo, mappaAltezze, SCARTO_Y } from '../src/nucleo/mesher-nucleo.js';
import { leggiVertice, N_SU, N_GIU, versoNormale } from '../src/nucleo/formato.js';

registraDecorazioni();

test('un blocco solo è un supercubo: sei facce a ±9/16, dodici smussi, otto angoli, coi colori della palette', () => {
  const m = new Mondo(); m.metti(3, 5, 4, 'terra', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  assert.equal(d.quad, 26, 'ventisei pezzi (gli angoli sono quad degeneri)');
  const pal = paletteBlocco('terra', 5);
  const colori = new Set(), normali = new Set();
  let xMin = 99, xMax = -99, yMin = 999, yMax = -999;
  for (let i = 0; i < d.vertici; i++) {
    const v = leggiVertice(d.byte, i); colori.add(v.colore); normali.add(v.normale);
    xMin = Math.min(xMin, v.x); xMax = Math.max(xMax, v.x); yMin = Math.min(yMin, v.y); yMax = Math.max(yMax, v.y);
  }
  assert.ok(colori.has(pal.cima) && colori.has(pal.lato) && colori.has(pal.fondo), 'i tre colori della palette');
  assert.equal(normali.size, 26, 'tutte le normali del supercubo');
  assert.equal(xMin, 3 + 0.5 - 9 / 16, 'il corpo sborda a 9/16: più grande della cella'); assert.equal(xMax, 3 + 0.5 + 9 / 16);
  assert.equal(yMin, 5 + SCARTO_Y + 0.5 - 9 / 16); assert.equal(yMax, 5 + SCARTO_Y + 0.5 + 9 / 16);
  assert.equal(d.y0, -SCARTO_Y);
  assert.equal(d.altezze[3 * 16 + 4], 5);
});

test('due blocchi adiacenti nascondono i pezzi in mezzo, e il vicino non ha cuciture: le pareti si sovrappongono', () => {
  const m = new Mondo(); m.metti(0, 0, 0, 'terra', true); m.metti(1, 0, 0, 'terra', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  assert.ok(d.quad < 52 && d.quad > 26, `meno di due supercubi interi: ${d.quad}`);
  for (let i = 0; i < d.vertici; i++) { const v = leggiVertice(d.byte, i); assert.ok(Math.abs(v.x - 1) > 0.01 || versoNormale(v.normale)[0] === 0, 'nessuna faccia sul piano di contatto x = 1'); }
});

test('il blocco con il cappello ha il brim a 10/16 e la cima a filo cella', () => {
  const m = new Mondo(); m.metti(2, 0, 2, 'erba', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  let xMax = -99, yCima = -999;
  for (let i = 0; i < d.vertici; i++) { const v = leggiVertice(d.byte, i); xMax = Math.max(xMax, v.x); if (v.normale === N_SU) yCima = Math.max(yCima, v.y); }
  assert.equal(xMax, 2.5 + 10 / 16, 'il brim sborda a 10 px');
  assert.equal(yCima, 0 + SCARTO_Y + 1, 'la cima è a filo cella: le cime si affiancano al pixel');
});

test('l\'erba col cappello mette i fili nel mesh dell\'erba, non nei solidi', () => {
  const m = new Mondo(); m.metti(2, 0, 2, 'erba', true);
  const senza = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  const d = costruisciChunkNucleo(m, '0,0', { erba: 3 });
  assert.equal(d.quad, senza.quad, 'i solidi non cambiano');
  assert.ok(d.erba.fili > 0, 'ci sono i fili');
  assert.equal(d.erba.vertici, d.erba.fili * 6, 'sei vertici per lamella (dal shader)');
  assert.ok(d.maxY >= 0 + 2 + SCARTO_Y);
});

test('l\'acqua va nel suo mesh, con profondità e livello nel vertice', () => {
  const m = new Mondo(); m.metti(0, 0, 0, 'terra', true); m.metti(0, 1, 0, 'acqua', true); m.metti(0, 2, 0, 'acqua', true); m.metti(0, 3, 0, 'acqua~1', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0 });
  assert.equal(d.quad, 26, 'la terra è un supercubo intero (l\'acqua non è opaca)');
  assert.ok(d.acqua.quad > 0, 'l\'acqua ha un mesh suo');
  // il pelo (normale +Y) esiste solo sulla cella più alta, e porta profondità 2 e livello 1
  let peli = 0;
  for (let i = 0; i < d.acqua.vertici; i++) { const v = leggiVertice(d.acqua.byte, i); if (v.normale === N_SU) { peli++; assert.equal(v.cielo, 2); assert.equal(v.blocco, 1); } }
  assert.equal(peli, 4, 'un pelo solo, quattro vertici');
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

test('il chunk sa la quota del suo pelo più alto (il piano dello specchio)', () => {
  const m = new Mondo(); m.metti(0, 0, 0, 'terra', true); m.metti(0, 1, 0, 'acqua', true); m.metti(3, 5, 3, 'acqua~2', true);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0, luce: false });
  assert.equal(d.acqua.pelo, 5 + (15 - 4) / 16, 'il pelo è quello di peloDi(): y + (15 − 2·livello)/16, del pelo più alto');
  const senza = new Mondo(); senza.metti(0, 0, 0, 'terra', true);
  assert.equal(costruisciChunkNucleo(senza, '0,0', { erba: 0, luce: false }).acqua.pelo, null, 'senza acqua, niente pelo');
});

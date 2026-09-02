// IL MESHER DEL NUCLEO — dal mondo di Leafy al formato a otto byte, fase F1.
//
// Legge lo STESSO mondo del gioco (`world/world.js`) con la STESSA palette
// (`world/stagioni.js`, `motivi.js`, `materie.js`): i colori escono identici a
// quelli del mesher di oggi, cotti nel vertice. Cambia solo cosa se ne fa la
// GPU: un chunk è una chiamata di disegno sola.
//
// ⚠ NIENTE MOTORE: gira in Node, ed è lì che si prova.
// ⚠ FASE F1, DICHIARATA: facce per blocco (niente greedy ancora), luce del cielo
// piena ovunque (la propagazione è F2), acqua come blocco opaco (F3), niente
// modelli (alberi e lampioni: F3). L'erba a ciuffi sta già nel mesh.
import { CHUNK } from '../world/world.js';
import { defDi, tipoBase } from '../world/blocks.js';
import { paletteBlocco, coloreFaccia } from '../world/stagioni.js';
import { tintaPalette } from '../world/motivi.js';
import { materiaDi, tingiMateria, indiceMateria } from '../world/materie.js';
import { FORME_VUOTE } from '../world/forme.js';
import { CostruttoreNucleo } from './formato.js';

/** Lo scarto in Y: il mondo può scendere sotto zero, il byte no. */
export const SCARTO_Y = 64;

const FACCE = [
  // dx dy dz normale asse segno
  [1, 0, 0, 0, 0, 1], [-1, 0, 0, 1, 0, -1], [0, 1, 0, 2, 1, 1], [0, -1, 0, 3, 1, -1], [0, 0, 1, 4, 2, 1], [0, 0, -1, 5, 2, -1],
];

/** Un blocco che ferma lo sguardo (culling delle facce): pieno, non acqua, non forma vuota. */
function opaco(tipo) {
  if (!tipo) return false;
  const d = defDi(tipo);
  return !d.acqua && !d.vetro && !FORME_VUOTE.has(d.forma);
}
function eAcqua(tipo) { return !!tipo && tipo.charCodeAt(0) === 97 && tipo.startsWith('acqua'); }

function hash(x, y, z) {
  let h = (x * 374761393 + y * 668265263 + z * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/**
 * Costruisce il chunk `kc` («cx,cz») del mondo.
 * @returns {{ byte, quad, vertici, triangoli, minY, maxY, y0, cx, cz, altezze }}
 *   `altezze` è la cima solida di ogni colonna del chunk (16×16, Int16, -1 se vuota):
 *   serve alla mappa delle altezze per l'ombra del sole.
 */
export function costruisciChunkNucleo(mondo, kc, { erba = 2 } = {}) {
  const v = kc.indexOf(',');
  const cx = +kc.slice(0, v), cz = +kc.slice(v + 1);
  const ox = cx * CHUNK, oz = cz * CHUNK;
  const c = new CostruttoreNucleo(1024);
  const altezze = new Int16Array(CHUNK * CHUNK).fill(-1);
  let minY = 255, maxY = 0;
  const q = (x, y, z, n, col, vento = 0, mat = 0) => [x - ox, y + SCARTO_Y, z - oz, n, 15, 0, col, vento, mat];

  mondo.perOgniDelChunk(kc, (x, y, z, tipo) => {
    const def = defDi(tipo);
    if (FORME_VUOTE.has(def.forma)) return;          // piante, lastre, modelli: F3
    const acqua = eAcqua(tipo);
    const ly = y + SCARTO_Y;
    if (ly < 0 || ly > 254) return;
    const i = (x - ox) * CHUNK + (z - oz);
    if (!acqua && y > altezze[i]) altezze[i] = y;

    let pal = paletteBlocco(tipoBase(tipo), y);
    if (def.motivo) pal = tintaPalette(pal, def.motivo, def.motivoForza ?? 1, x, y, z);
    const materia = materiaDi(def);
    if (materia) pal = { ...pal, cima: tingiMateria(pal.cima, materia), lato: tingiMateria(pal.lato, materia), fondo: tingiMateria(pal.fondo, materia) };
    const mat = materia ? indiceMateria(def.materia) : 0;

    for (const [dx, dy, dz, n, asse, segno] of FACCE) {
      const vic = mondo.tipo(x + dx, y + dy, z + dz);
      if (acqua) { if (vic) continue; }                   // l'acqua mostra la faccia solo verso l'aria
      else if (opaco(vic)) continue;                      // il solido si ferma sui solidi
      const col = coloreFaccia(pal, asse, segno);
      const X = x, Y = y, Z = z;
      let a, b, cc, d;
      if (n === 0)      { a = [X + 1, Y, Z]; b = [X + 1, Y + 1, Z]; cc = [X + 1, Y + 1, Z + 1]; d = [X + 1, Y, Z + 1]; }
      else if (n === 1) { a = [X, Y, Z + 1]; b = [X, Y + 1, Z + 1]; cc = [X, Y + 1, Z]; d = [X, Y, Z]; }
      else if (n === 2) { a = [X, Y + 1, Z]; b = [X, Y + 1, Z + 1]; cc = [X + 1, Y + 1, Z + 1]; d = [X + 1, Y + 1, Z]; }
      else if (n === 3) { a = [X, Y, Z + 1]; b = [X, Y, Z]; cc = [X + 1, Y, Z]; d = [X + 1, Y, Z + 1]; }
      else if (n === 4) { a = [X + 1, Y, Z + 1]; b = [X + 1, Y + 1, Z + 1]; cc = [X, Y + 1, Z + 1]; d = [X, Y, Z + 1]; }
      else              { a = [X, Y, Z]; b = [X, Y + 1, Z]; cc = [X + 1, Y + 1, Z]; d = [X + 1, Y, Z]; }
      c.quadDa(q(...a, n, col, 0, mat), q(...b, n, col, 0, mat), q(...cc, n, col, 0, mat), q(...d, n, col, 0, mat));
      if (ly < minY) minY = ly; if (ly + 1 > maxY) maxY = ly + 1;
    }

    // ⚠ L'ERBA STA NEL MESH (rifondazione, tecnica 3): sulle cime col cappello,
    // due quad a croce per ciuffo, la cima ondeggia. Stesso colore della cima,
    // appena più scuro, come i fili del prato di oggi.
    if (def.cappello && !mondo.tipo(x, y + 1, z)) {
      const cf = scurisci(pal.cima, 0.92);
      for (let k = 0; k < erba; k++) {
        if (hash(x, z, k) < 0.3) continue;
        const X = x, Z = z, Y = y + 1, T = y + 2;
        c.quadDa(q(X, Y, Z, 2, cf), q(X, T, Z, 2, cf, 1), q(X + 1, T, Z + 1, 2, cf, 1), q(X + 1, Y, Z + 1, 2, cf));
        c.quadDa(q(X + 1, Y, Z, 2, cf), q(X + 1, T, Z, 2, cf, 1), q(X, T, Z + 1, 2, cf, 1), q(X, Y, Z + 1, 2, cf));
        if (T + SCARTO_Y > maxY) maxY = T + SCARTO_Y;
      }
    }
  });
  if (minY > maxY) { minY = 0; maxY = 0; }
  const d = c.dati();
  return { ...d, minY, maxY, y0: -SCARTO_Y, cx, cz, altezze };
}

function scurisci(c, k) {
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return (f((c >> 16) & 255) << 16) | (f((c >> 8) & 255) << 8) | f(c & 255);
}

/**
 * La mappa delle altezze di un rettangolo di chunk, per l'horizon mapping:
 * un byte per colonna (cima solida + 1, in quota di mondo; 0 se vuota o sotto zero).
 */
export function mappaAltezze(chunks, cxMin, czMin, cxMax, czMax) {
  const w = (cxMax - cxMin + 1) * CHUNK, h = (czMax - czMin + 1) * CHUNK;
  const byte = new Uint8Array(w * h);
  for (const d of chunks) {
    if (!d.altezze) continue;
    const bx = (d.cx - cxMin) * CHUNK, bz = (d.cz - czMin) * CHUNK;
    for (let lx = 0; lx < CHUNK; lx++) for (let lz = 0; lz < CHUNK; lz++) {
      const a = d.altezze[lx * CHUNK + lz];
      // ⚠ IN QUOTA DI MONDO, non di chunk: il fragment confronta con la posizione
      // vera (lo scarto del chunk è già dentro `uChunk`). Con lo scarto aggiunto
      // qui tutto il mondo stava «sotto» la mappa: ombra ovunque, a mezzogiorno.
      byte[(bz + lz) * w + (bx + lx)] = a < 0 ? 0 : Math.max(0, Math.min(255, a + 1));
    }
  }
  return { byte, x0: cxMin * CHUNK, z0: czMin * CHUNK, larghezza: w, profondita: h };
}

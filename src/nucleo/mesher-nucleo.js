// IL MESHER DEL NUCLEO — dal mondo di Leafy al formato a otto byte, fase F1.
//
// Legge lo STESSO mondo del gioco (`world/world.js`) con la STESSA palette
// (`world/stagioni.js`, `motivi.js`, `materie.js`): i colori escono identici a
// quelli del mesher di oggi, cotti nel vertice. Cambia solo cosa se ne fa la
// GPU: un chunk è una chiamata di disegno sola.
//
// ⚠ NIENTE MOTORE: gira in Node, ed è lì che si prova.
// ⚠ FASE F1/F2: facce per blocco (niente greedy ancora); la LUCE È COTTA
// (`luce-cotta.js`): ogni faccia porta il cielo e la luce di blocco della cella
// d'aria che ha davanti. L'erba a ciuffi sta già nel mesh; i modelli vanno a
// istanze (nucleo/modelli.js).
//
// ⚠ L'ACQUA È UN MESH A PARTE nello stesso formato (tecnica 4): il pelo e le
// pareti verso l'aria, disegnati DOPO i solidi con la fusione. Nel vertice:
//  · «cielo» porta la PROFONDITÀ della colonna (0..15 celle d'acqua sotto il
//    pelo): è così che il lago vira al violaceo scendendo senza una passata di
//    profondità — il mesher la sa già;
//  · «blocco» porta il LIVELLO (`acqua~n`): il vertex shader abbassa il pelo di
//    (1 + 2n)/16, che è esattamente `peloDi` in world/pelo.js.
import { CHUNK } from '../world/world.js';
import { defDi, tipoBase } from '../world/blocks.js';
import { paletteBlocco, coloreFaccia } from '../world/stagioni.js';
import { tintaPalette } from '../world/motivi.js';
import { materiaDi, tingiMateria, indiceMateria } from '../world/materie.js';
import { FORME_VUOTE } from '../world/forme.js';
import { CostruttoreNucleo } from './formato.js';
import { livelloAcqua } from '../world/blocks.js';
import { cuociLuce } from './luce-cotta.js';
import { CostruttoreErba } from './erba.js';

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
 * @returns {{ byte, quad, vertici, triangoli, minY, maxY, y0, cx, cz, altezze, acqua: { byte, quad, pelo }, erba: { byte, vertici, fili, yBase } }}
 *   `altezze` è la cima solida di ogni colonna del chunk (16×16, Int16, -1 se vuota):
 *   serve alla mappa delle altezze per l'ombra del sole.
 */
export function costruisciChunkNucleo(mondo, kc, { erba = 2, luce = true } = {}) {
  const v = kc.indexOf(',');
  const cx = +kc.slice(0, v), cz = +kc.slice(v + 1);
  const ox = cx * CHUNK, oz = cz * CHUNK;
  const c = new CostruttoreNucleo(1024);
  const ca = new CostruttoreNucleo(64);          // l'acqua
  let peloMax = -Infinity;                        // la quota del pelo più alto del chunk (il piano dello specchio)
  const altezze = new Int16Array(CHUNK * CHUNK).fill(-1);
  let minY = 255, maxY = 0;
  // la fascia verticale del chunk, per cuocere la luce solo dove serve
  let yLo = Infinity, yHi = -Infinity;
  mondo.perOgniDelChunk(kc, (x, y) => { if (y < yLo) yLo = y; if (y > yHi) yHi = y; });
  const lc = (luce && yLo <= yHi) ? cuociLuce(mondo, kc, yLo - 2, yHi + 3) : null;
  const ce = new CostruttoreErba(Number.isFinite(yLo) ? yLo : 0);   // l'erba a fili, con la sua base
  const luceDi = (x, y, z) => (lc ? lc.leggi(x, y, z) : [15, 0]);
  const q = (x, y, z, n, col, vento = 0, mat = 0, cielo = 15, blocco = 0) => [x - ox, y + SCARTO_Y, z - oz, n, cielo, blocco, col, vento, mat];
  // ⚠ IL BIT «VENTO» PER L'ACQUA DICE «VERTICE IN CIMA ALLA CELLA»: il vertex
  // shader abbassa al pelo anche gli orli delle pareti, se no una parete
  // d'acqua alta una cella spunta di un sedicesimo sopra il pelo abbassato e
  // sul lago si vedono mille velette grigie (visto nel banco, primo piano).
  const qa = (x, y, z, n, col, prof, liv, cima) => [x - ox, y + SCARTO_Y, z - oz, n, prof, liv, col, cima ? 1 : 0, 0];

  mondo.perOgniDelChunk(kc, (x, y, z, tipo) => {
    const def = defDi(tipo);
    if (def.forma === 'modello' && def.modello === 'albero') {
      // ⚠ L'ALBERO STA NELLA MAPPA DELLE ALTEZZE con la sua chioma (una croce
      // di celle a quota +3): è così che fa ombra col sole, senza mappa d'ombra.
      for (const [dx, dz] of [[0, 0], [1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const lx = x + dx - ox, lz = z + dz - oz;
        if (lx < 0 || lx >= CHUNK || lz < 0 || lz >= CHUNK) continue;
        const i = lx * CHUNK + lz;
        if (y + 3 > altezze[i]) altezze[i] = y + 3;
      }
    }
    if (FORME_VUOTE.has(def.forma)) return;          // piante, lastre, modelli: F3
    const acqua = eAcqua(tipo);
    const ly = y + SCARTO_Y;
    if (ly < 0 || ly > 254) return;
    const i = (x - ox) * CHUNK + (z - oz);
    if (!acqua && y > altezze[i]) altezze[i] = y;   // (la chioma di un albero, se c'è, è già più alta)

    let pal = paletteBlocco(tipoBase(tipo), y);
    if (def.motivo) pal = tintaPalette(pal, def.motivo, def.motivoForza ?? 1, x, y, z);
    const materia = materiaDi(def);
    if (materia) pal = { ...pal, cima: tingiMateria(pal.cima, materia), lato: tingiMateria(pal.lato, materia), fondo: tingiMateria(pal.fondo, materia) };
    const mat = materia ? indiceMateria(def.materia) : 0;

    // la profondità e il livello, solo per l'acqua
    let prof = 0, liv = 0;
    if (acqua) {
      liv = Math.max(0, Math.min(15, livelloAcqua(tipo) || 0));
      while (prof < 15 && eAcqua(mondo.tipo(x, y - 1 - prof, z))) prof++;
    }
    for (const [dx, dy, dz, n, asse, segno] of FACCE) {
      const vic = mondo.tipo(x + dx, y + dy, z + dz);
      if (acqua) { if (vic && (eAcqua(vic) || opaco(vic))) continue; }   // il pelo verso l'aria, mai fra acqua e acqua
      else if (opaco(vic)) continue;                                      // il solido si ferma sui solidi
      const col = coloreFaccia(pal, asse, segno);
      const X = x, Y = y, Z = z;
      let a, b, cc, d;
      if (n === 0)      { a = [X + 1, Y, Z]; b = [X + 1, Y + 1, Z]; cc = [X + 1, Y + 1, Z + 1]; d = [X + 1, Y, Z + 1]; }
      else if (n === 1) { a = [X, Y, Z + 1]; b = [X, Y + 1, Z + 1]; cc = [X, Y + 1, Z]; d = [X, Y, Z]; }
      else if (n === 2) { a = [X, Y + 1, Z]; b = [X, Y + 1, Z + 1]; cc = [X + 1, Y + 1, Z + 1]; d = [X + 1, Y + 1, Z]; }
      else if (n === 3) { a = [X, Y, Z + 1]; b = [X, Y, Z]; cc = [X + 1, Y, Z]; d = [X + 1, Y, Z + 1]; }
      else if (n === 4) { a = [X + 1, Y, Z + 1]; b = [X + 1, Y + 1, Z + 1]; cc = [X, Y + 1, Z + 1]; d = [X, Y, Z + 1]; }
      else              { a = [X, Y, Z]; b = [X, Y + 1, Z]; cc = [X + 1, Y + 1, Z]; d = [X + 1, Y, Z]; }
      if (acqua && n === 2) { const pelo = y + (15 - 2 * liv) / 16; if (pelo > peloMax) peloMax = pelo; }   // peloDi() di world/pelo.js
      if (acqua) ca.quadDa(qa(...a, n, col, prof, liv, a[1] === Y + 1), qa(...b, n, col, prof, liv, b[1] === Y + 1), qa(...cc, n, col, prof, liv, cc[1] === Y + 1), qa(...d, n, col, prof, liv, d[1] === Y + 1));
      else {
        // ⚠ LA LUCE DELLA FACCIA È QUELLA DELLA CELLA CHE HA DAVANTI (la cella d'aria)
        const [ci, bl] = luceDi(x + dx, y + dy, z + dz);
        c.quadDa(q(...a, n, col, 0, mat, ci, bl), q(...b, n, col, 0, mat, ci, bl), q(...cc, n, col, 0, mat, ci, bl), q(...d, n, col, 0, mat, ci, bl));
      }
      if (ly < minY) minY = ly; if (ly + 1 > maxY) maxY = ly + 1;
    }

    // ⚠ L'ERBA STA NEL MESH (rifondazione, tecnica 3): sulle cime col cappello,
    // un ciuffo di fili a triangolo come il prato di oggi (nucleo/erba.js),
    // con la luce del cielo della cella sopra.
    if (def.cappello && erba > 0 && !mondo.tipo(x, y + 1, z)) {
      const [ce15] = luceDi(x, y + 1, z);
      ce.ciuffo(x, y, z, ox, oz, pal.cima, ce15, erba / 2);
      if (y + 2 + SCARTO_Y > maxY) maxY = y + 2 + SCARTO_Y;
    }
  });
  if (minY > maxY) { minY = 0; maxY = 0; }
  const d = c.dati();
  return { ...d, minY, maxY, y0: -SCARTO_Y, cx, cz, altezze, acqua: { ...ca.dati(), pelo: peloMax === -Infinity ? null : peloMax }, erba: ce.dati() };
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

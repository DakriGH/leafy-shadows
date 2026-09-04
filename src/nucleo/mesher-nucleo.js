// IL MESHER DEL NUCLEO — dal mondo di Leafy al formato a dodici byte, fase F1.
//
// Legge lo STESSO mondo del gioco (`world/world.js`) con la STESSA palette
// (`world/stagioni.js`, `motivi.js`, `materie.js`): i colori escono identici a
// quelli del mesher di oggi, cotti nel vertice. Cambia solo cosa se ne fa la
// GPU: un chunk è una chiamata di disegno sola.
//
// ⚠ NIENTE MOTORE: gira in Node, ed è lì che si prova.
// ⚠ LA GEOMETRIA È QUELLA DI LEAFY, NON UN VOXEL: il supercubo e il blocco col
// cappello di `world/supercubo.js` (corpo a ±9/16, brim a 10/16, smussi 8→9),
// gli stessi pezzi del mesher di oggi, scritti nel formato del nucleo da un
// adattatore (`Pennello`) con la stessa firma quad/tri/materia. Il committente
// l'ha visto a schermo: «stai usando voxel, devi usare i beveled cuboid, più
// grandi della griglia così si crea una connessione perfetta». Da qui in poi
// il nucleo e il gioco condividono il file della forma del blocco.
// ⚠ FASE F1/F2: pezzi per blocco (niente greedy ancora); la LUCE È COTTA
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
import { FORME_VUOTE, FORME_EXTRA } from '../world/forme.js';
import { supercubo, conCappello } from '../world/supercubo.js';
import { CostruttoreNucleo, indiceNormale } from './formato.js';
import { livelloAcqua } from '../world/blocks.js';
import { cuociLuce } from './luce-cotta.js';
import { CostruttoreErba } from './erba.js';

/** Lo scarto in Y: il mondo può scendere sotto zero, il byte no. */
export const SCARTO_Y = 64;

const FACCE = [
  // dx dy dz normale(indice a 27) asse segno
  [1, 0, 0, indiceNormale(1, 0, 0), 0, 1], [-1, 0, 0, indiceNormale(-1, 0, 0), 0, -1],
  [0, 1, 0, indiceNormale(0, 1, 0), 1, 1], [0, -1, 0, indiceNormale(0, -1, 0), 1, -1],
  [0, 0, 1, indiceNormale(0, 0, 1), 2, 1], [0, 0, -1, indiceNormale(0, 0, -1), 2, -1],
];
const IV = (dx, dy, dz) => ((dy + 1) * 3 + (dz + 1)) * 3 + (dx + 1);

/**
 * L'ADATTATORE: la firma del costruttore del gioco (`quad`, `tri`, `materia`)
 * sopra il formato del nucleo. Le posizioni arrivano in coordinate di mondo
 * (il centro cella ± sedicesimi) e finiscono relative al chunk; il verso
 * `fuori` diventa l'indice a 27; la luce del pezzo la decide `luce(fuori)`.
 * ⚠ L'ORIENTAMENTO È QUELLO DEL COSTRUTTORE VECCHIO: se (b−a)×(c−a) è discorde
 * da `fuori`, si gira — così ogni pezzo è antiorario visto da fuori e il
 * culling delle facce di schiena non ne perde nessuno.
 * ⚠ UN TRIANGOLO È UN QUAD DEGENERE (a b c c): gli indici sono condivisi e
 * fissi (0 1 2 · 0 2 3), quindi il secondo triangolo (a c c) ha area zero e
 * non costa un pixel.
 */
class Pennello {
  constructor(c, ox, oz, luceDi, aria) { this.c = c; this.ox = ox; this.oz = oz; this._materia = 0; this.luceDi = luceDi; this.aria = aria; this._cielo = 15; this._cella = null; }
  materia(i) { this._materia = i | 0; }
  /** La cella del blocco in lavorazione: il cielo si legge davanti alla faccia, per faccia. */
  cella(x, y, z) { this._cella = [x, y, z]; }
  /**
   * ⚠ LA REGOLA DI LEAFY: DUE FACCE DELLO STESSO COLORE HANNO LO STESSO COLORE,
   * a meno che una sia in ombra. Quindi il CIELO è per faccia (la cella d'aria
   * davanti, il massimo fra i versi di uno smusso), niente sfumature né
   * occlusione ambientale: una media che prendeva anche le celle solide
   * toglieva il sole a ogni faccia accanto a un altro blocco, e il committente
   * vedeva «artefatti ovunque». Solo la LUCE DI BLOCCO (le pozze dei lampioni)
   * è per vertice, media delle celle d'ARIA attorno: le pozze sono tonde e
   * a bande, come in gioco.
   */
  _cieloFaccia(f) {
    const [x, y, z] = this._cella;
    let ci = -1;
    for (let a = 0; a < 3; a++) {
      if (!f[a]) continue;
      const c1 = this.luceDi(x + (a === 0 ? f[0] : 0), y + (a === 1 ? f[1] : 0), z + (a === 2 ? f[2] : 0))[0];
      if (c1 > ci) ci = c1;
    }
    return ci < 0 ? this.luceDi(x, y + 1, z)[0] : ci;
  }
  _bloccoVertice(p, f) {
    const l = Math.hypot(f[0], f[1], f[2]) || 1;
    const qx = p[0] + f[0] / l * 0.5, qy = p[1] + f[1] / l * 0.5, qz = p[2] + f[2] / l * 0.5;
    let bl = 0, n = 0;
    for (const dx of [-0.45, 0.45]) for (const dy of [-0.45, 0.45]) for (const dz of [-0.45, 0.45]) {
      const cx = Math.floor(qx + dx), cy = Math.floor(qy + dy), cz = Math.floor(qz + dz);
      if (!this.aria(cx, cy, cz)) continue;
      bl += this.luceDi(cx, cy, cz)[1]; n++;
    }
    return n ? Math.round(bl / n) : 0;
  }
  _v(p, ni, colore, f) { return [p[0] - this.ox, p[1] + SCARTO_Y, p[2] - this.oz, ni, this._cielo, this._bloccoVertice(p, f), colore, 0, this._materia]; }
  _giro(a, b, c, fuori) {
    const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
    const acx = c[0] - a[0], acy = c[1] - a[1], acz = c[2] - a[2];
    const nx = aby * acz - abz * acy, ny = abz * acx - abx * acz, nz = abx * acy - aby * acx;
    return nx * fuori[0] + ny * fuori[1] + nz * fuori[2] < 0;
  }
  tri(a, b, c, colore, fuori) {
    if (this._giro(a, b, c, fuori)) { const t = b; b = c; c = t; }
    const ni = indiceNormale(fuori[0], fuori[1], fuori[2]); this._cielo = this._cieloFaccia(fuori);
    this.c.quadDa(this._v(a, ni, colore, fuori), this._v(b, ni, colore, fuori), this._v(c, ni, colore, fuori), this._v(c, ni, colore, fuori));
  }
  quad(a, b, c, d, colore, fuori) {
    const ni = indiceNormale(fuori[0], fuori[1], fuori[2]); this._cielo = this._cieloFaccia(fuori);
    if (this._giro(a, b, c, fuori)) { const t = b; b = d; d = t; }
    this.c.quadDa(this._v(a, ni, colore, fuori), this._v(b, ni, colore, fuori), this._v(c, ni, colore, fuori), this._v(d, ni, colore, fuori));
  }
}

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
  const pen = new Pennello(c, ox, oz, luceDi, (x, y, z) => !opaco(mondo.tipo(x, y, z)));
  const vicini = new Uint8Array(27);
  // ⚠ IL BIT «VENTO» PER L'ACQUA DICE «VERTICE IN CIMA ALLA CELLA»: il vertex
  // shader abbassa al pelo anche gli orli delle pareti, se no una parete
  // d'acqua alta una cella spunta di un sedicesimo sopra il pelo abbassato e
  // sul lago si vedono mille velette grigie (visto nel banco, primo piano).
  const qa = (x, y, z, n, col, prof, liv, cima) => [x - ox, y + SCARTO_Y, z - oz, n, prof, liv, col, cima ? 1 : 0, 0];

  mondo.perOgniDelChunk(kc, (x, y, z, tipo) => {
    const def = defDi(tipo);
    if (def.forma === 'modello' && def.modello === 'albero') {
      // ⚠ L'ALBERO STA NELLA MAPPA DELLE ALTEZZE con la sua chioma: un DISCO di
      // raggio 2 (cupola: +4 al centro, +3 attorno, +2 sull'orlo), così l'ombra
      // del sole è tonda e non una croce di quadrati.
      for (let dx = -2; dx <= 2; dx++) for (let dz = -2; dz <= 2; dz++) {
        const r2 = dx * dx + dz * dz; if (r2 > 4) continue;
        const lx = x + dx - ox, lz = z + dz - oz;
        if (lx < 0 || lx >= CHUNK || lz < 0 || lz >= CHUNK) continue;
        const i = lx * CHUNK + lz, h = y + (r2 === 0 ? 4 : r2 <= 2 ? 3 : 2);
        if (h > altezze[i]) altezze[i] = h;
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
    if (materia) {
      pal = { ...pal, cima: tingiMateria(pal.cima, materia), lato: tingiMateria(pal.lato, materia), fondo: tingiMateria(pal.fondo, materia) };
      if (pal.facce) pal.facce = pal.facce.map((k) => (k === null || k === undefined ? k : tingiMateria(k, materia)));
    }
    const mat = materia ? indiceMateria(def.materia) : 0;

    if (!acqua) {
      // ── IL SOLIDO: il supercubo di Leafy, come nel gioco ──────────────────
      // l'intorno 3×3×3 in una volta sola: 1 = solido che occlude
      vicini.fill(0);
      for (let dy = -1; dy <= 1; dy++) for (let dz = -1; dz <= 1; dz++) for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        if (opaco(mondo.tipo(x + dx, y + dy, z + dz))) vicini[IV(dx, dy, dz)] = 1;
      }
      const vicinoSolido = (dx, dy, dz) => vicini[IV(dx, dy, dz)] === 1;
      pen.materia(mat); pen.cella(x, y, z);
      const cxm = x + 0.5, cym = y + 0.5, czm = z + 0.5;
      const extra = def.forma && FORME_EXTRA[def.forma];
      if (extra) extra(pen, cxm, cym, czm, pal, () => false);
      else if (def.cappello && !vicinoSolido(0, 1, 0)) conCappello(pen, cxm, cym, czm, pal, vicinoSolido);
      else {
        // un vicino col cappello SCOPERTO è alto 16 px, non 18: in orizzontale culla solo chi è a tutta altezza
        const vicinoTuttaAltezza = (dx, dy, dz) => {
          if (!vicinoSolido(dx, dy, dz)) return false;
          if (dy !== 0) return true;
          return !defDi(mondo.tipo(x + dx, y, z + dz)).cappello || vicinoSolido(dx, 1, dz);
        };
        supercubo(pen, cxm, cym, czm, pal, vicinoTuttaAltezza, materia ? materia.orlo : 0);
      }
      if (ly - 1 < minY) minY = ly - 1; if (ly + 2 > maxY) maxY = ly + 2;   // il brim sborda di 2/16
    }

    // la profondità e il livello, solo per l'acqua
    let prof = 0, liv = 0;
    if (acqua) {
      liv = Math.max(0, Math.min(15, livelloAcqua(tipo) || 0));
      while (prof < 15 && eAcqua(mondo.tipo(x, y - 1 - prof, z))) prof++;
    }
    // ⚠ LA PROFONDITÀ SI CAMPIONA AL VERTICE (media delle celle d'acqua attorno):
    // per cella tutti e quattro i vertici erano uguali e il colore faceva
    // QUADRATI netti sul pelo. Così sfuma da un vertice all'altro.
    const profCella = (cx, cz) => { if (!eAcqua(mondo.tipo(cx, y, cz))) return -1; let p = 0; while (p < 15 && eAcqua(mondo.tipo(cx, y - 1 - p, cz))) p++; return p; };
    const profV = (vx, vz) => { let s = 0, k = 0; for (const cx of [vx - 1, vx]) for (const cz of [vz - 1, vz]) { const p = profCella(cx, cz); if (p >= 0) { s += p; k++; } } return k ? Math.round(s / k) : prof; };
    if (acqua) for (const [dx, dy, dz, n, asse, segno] of FACCE) {
      const vic = mondo.tipo(x + dx, y + dy, z + dz);
      if (vic && (eAcqua(vic) || opaco(vic))) continue;   // il pelo verso l'aria, mai fra acqua e acqua
      const col = coloreFaccia(pal, asse, segno);
      const X = x, Y = y, Z = z;
      let a, b, cc, d;
      if (dx === 1)       { a = [X + 1, Y, Z]; b = [X + 1, Y + 1, Z]; cc = [X + 1, Y + 1, Z + 1]; d = [X + 1, Y, Z + 1]; }
      else if (dx === -1) { a = [X, Y, Z + 1]; b = [X, Y + 1, Z + 1]; cc = [X, Y + 1, Z]; d = [X, Y, Z]; }
      else if (dy === 1)  { a = [X, Y + 1, Z]; b = [X, Y + 1, Z + 1]; cc = [X + 1, Y + 1, Z + 1]; d = [X + 1, Y + 1, Z]; }
      else if (dy === -1) { a = [X, Y, Z + 1]; b = [X, Y, Z]; cc = [X + 1, Y, Z]; d = [X + 1, Y, Z + 1]; }
      else if (dz === 1)  { a = [X + 1, Y, Z + 1]; b = [X + 1, Y + 1, Z + 1]; cc = [X, Y + 1, Z + 1]; d = [X, Y, Z + 1]; }
      else                { a = [X, Y, Z]; b = [X, Y + 1, Z]; cc = [X + 1, Y + 1, Z]; d = [X + 1, Y, Z]; }
      if (dy === 1) { const pelo = y + (15 - 2 * liv) / 16; if (pelo > peloMax) peloMax = pelo; }   // peloDi() di world/pelo.js
      ca.quadDa(qa(...a, n, col, profV(a[0], a[2]), liv, a[1] === Y + 1), qa(...b, n, col, profV(b[0], b[2]), liv, b[1] === Y + 1), qa(...cc, n, col, profV(cc[0], cc[2]), liv, cc[1] === Y + 1), qa(...d, n, col, profV(d[0], d[2]), liv, d[1] === Y + 1));
      if (ly < minY) minY = ly; if (ly + 1 > maxY) maxY = ly + 1;
    }

    // ⚠ L'ERBA STA NEL MESH (rifondazione, tecnica 3): sulle cime col cappello,
    // un ciuffo di fili a triangolo come il prato di oggi (nucleo/erba.js),
    // con la luce del cielo della cella sopra.
    if (def.cappello && erba > 0 && !mondo.tipo(x, y + 1, z)) {
      const [ce15, bl15] = luceDi(x, y + 1, z);
      ce.ciuffo(x, y, z, ox, oz, pal.cima, ce15, erba / 2, bl15);
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

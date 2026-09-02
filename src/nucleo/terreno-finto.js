// IL TERRENO FINTO DEL BANCO F0 — colline, sabbia, erba a ciuffi e qualche
// lampada, tutto cotto nei vertici. Serve a misurare il nucleo con una scena
// VERA per numero di triangoli, prima di collegare il mondo di gioco (fase F1).
//
// ⚠ È DETERMINISTICO: stesso seme, stessi byte. Le prove in Node lo pretendono,
// e il confronto fra due telefoni ha senso solo se disegnano la stessa cosa.
import { CostruttoreNucleo, LATO_CHUNK, SEGNALE_VENTO, SEGNALE_CIMA } from './formato.js';

// le materie del banco: indice → colore lo dà la tavolozza del renderer
export const MATERIE = {
  erba: 1, terra: 2, sabbia: 3, roccia: 4, filo: 5, tronco: 6, chioma: 7, lampada: 8,
};
export const TAVOLOZZA = [
  [0, 0, 0],
  [0.36, 0.66, 0.24],   // erba
  [0.52, 0.36, 0.22],   // terra
  [0.86, 0.78, 0.55],   // sabbia
  [0.55, 0.55, 0.52],   // roccia
  [0.30, 0.62, 0.20],   // filo d'erba
  [0.36, 0.22, 0.12],   // tronco
  [0.16, 0.42, 0.18],   // chioma
  [1.00, 0.85, 0.45],   // lampada (emissiva: la resa la tratta a parte)
];

function hash(x, z, seme) {
  let h = (x * 374761393 + z * 668265263 + seme * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function liscio(x, z, periodo, seme) {
  const fx = x / periodo, fz = z / periodo;
  const ix = Math.floor(fx), iz = Math.floor(fz);
  const tx = fx - ix, tz = fz - iz;
  const sx = tx * tx * (3 - 2 * tx), sz = tz * tz * (3 - 2 * tz);
  const a = hash(ix, iz, seme), b = hash(ix + 1, iz, seme), c = hash(ix, iz + 1, seme), d = hash(ix + 1, iz + 1, seme);
  return (a + (b - a) * sx) + ((c + (d - c) * sx) - (a + (b - a) * sx)) * sz;
}

/** La quota della colonna (x, z): colline morbide con terrazze, come Leafy. */
export function altezza(x, z, seme = 7) {
  const g = liscio(x, z, 48, seme) * 14 + liscio(x, z, 17, seme + 1) * 5 + liscio(x, z, 6, seme + 2) * 1.5;
  return 8 + Math.floor(g);
}
/** Il tipo della cima: sabbia bassa, erba in mezzo, roccia in alto. */
export function materiaCima(h) { return h < 11 ? MATERIE.sabbia : h > 24 ? MATERIE.roccia : MATERIE.erba; }

/** Le lampade del banco: una ogni tanto, su una colonna d'erba. */
export function lampade(cx, cz, seme = 7) {
  const out = [];
  for (let i = 0; i < 2; i++) {
    const r = hash(cx * 3 + i, cz * 5 - i, seme + 9);
    if (r < 0.35) continue;
    const lx = cx * LATO_CHUNK + Math.floor(hash(cx, cz, seme + 11 + i) * 15) + 0.5;
    const lz = cz * LATO_CHUNK + Math.floor(hash(cz, cx, seme + 13 + i) * 15) + 0.5;
    const h = altezza(Math.floor(lx), Math.floor(lz), seme);
    if (materiaCima(h) !== MATERIE.erba) continue;
    out.push({ x: lx, y: h + 3, z: lz });
  }
  return out;
}

/** Luce di blocco in una cella: 15 alla lampada, −1 per cella (la propagazione
 *  di Minecraft, qui a distanza euclidea perché è un banco, non il gioco). */
function luceBlocco(x, y, z, lamp) {
  let m = 0;
  for (const l of lamp) {
    const d = Math.sqrt((x - l.x) ** 2 + (y - l.y) ** 2 + (z - l.z) ** 2);
    const v = 15 - d;
    if (v > m) m = v;
  }
  return Math.max(0, Math.min(15, Math.round(m)));
}

/**
 * Costruisce il chunk (cx, cz): cime, pareti verso le colonne più basse, fili
 * d'erba a croce sulle cime d'erba, pali delle lampade.
 * @returns {{ byte, quad, vertici, triangoli, minY, maxY }}
 */
export function costruisciChunkFinto(cx, cz, { seme = 7, erba = 2, raggioLampade = 2 } = {}) {
  const c = new CostruttoreNucleo(1600);
  const ox = cx * LATO_CHUNK, oz = cz * LATO_CHUNK;
  let minY = 255, maxY = 0;
  // le lampade dei chunk vicini illuminano anche questo
  const lamp = [];
  for (let dx = -raggioLampade; dx <= raggioLampade; dx++) for (let dz = -raggioLampade; dz <= raggioLampade; dz++) lamp.push(...lampade(cx + dx, cz + dz, seme));

  for (let lx = 0; lx < LATO_CHUNK; lx++) {
    for (let lz = 0; lz < LATO_CHUNK; lz++) {
      const x = ox + lx, z = oz + lz;
      const h = altezza(x, z, seme);
      if (h < minY) minY = h; if (h + 1 > maxY) maxY = h + 1;
      const mat = materiaCima(h);
      const tinta = Math.floor(hash(x, z, seme + 3) * 255);
      const bl = luceBlocco(x + 0.5, h + 1, z + 0.5, lamp);
      // la cima: (x, h+1, z) → (x+1, h+1, z+1), normale +Y, cielo pieno
      c.quadDa([lx, h + 1, lz, 2, 15, bl, mat, tinta], [lx, h + 1, lz + 1, 2, 15, bl, mat, tinta],
               [lx + 1, h + 1, lz + 1, 2, 15, bl, mat, tinta], [lx + 1, h + 1, lz, 2, 15, bl, mat, tinta]);
      // le pareti: verso ogni vicino più basso, dal suo tetto al nostro
      const vicini = [[1, 0, 0], [-1, 0, 1], [0, 1, 4], [0, -1, 5]];
      for (const [dx, dz, nrm] of vicini) {
        const hv = altezza(x + dx, z + dz, seme);
        for (let y = hv + 1; y <= h; y++) {
          const cielo = Math.max(6, 15 - (h - y) * 2);       // in fondo a un dirupo c'è meno cielo
          const m = (y === h && mat === MATERIE.erba) ? MATERIE.erba : (h > 24 ? MATERIE.roccia : MATERIE.terra);
          const b2 = luceBlocco(x + 0.5 + dx * 0.5, y + 0.5, z + 0.5 + dz * 0.5, lamp);
          const yb = y, yt = y + 1;
          if (dx === 1)       c.quadDa([lx + 1, yb, lz, nrm, cielo, b2, m, tinta], [lx + 1, yt, lz, nrm, cielo, b2, m, tinta], [lx + 1, yt, lz + 1, nrm, cielo, b2, m, tinta], [lx + 1, yb, lz + 1, nrm, cielo, b2, m, tinta]);
          else if (dx === -1) c.quadDa([lx, yb, lz + 1, nrm, cielo, b2, m, tinta], [lx, yt, lz + 1, nrm, cielo, b2, m, tinta], [lx, yt, lz, nrm, cielo, b2, m, tinta], [lx, yb, lz, nrm, cielo, b2, m, tinta]);
          else if (dz === 1)  c.quadDa([lx + 1, yb, lz + 1, nrm, cielo, b2, m, tinta], [lx + 1, yt, lz + 1, nrm, cielo, b2, m, tinta], [lx, yt, lz + 1, nrm, cielo, b2, m, tinta], [lx, yb, lz + 1, nrm, cielo, b2, m, tinta]);
          else                c.quadDa([lx, yb, lz, nrm, cielo, b2, m, tinta], [lx, yt, lz, nrm, cielo, b2, m, tinta], [lx + 1, yt, lz, nrm, cielo, b2, m, tinta], [lx + 1, yb, lz, nrm, cielo, b2, m, tinta]);
          if (y < minY) minY = y;
        }
      }
      // l'erba: `erba` croci per cima d'erba, ognuna due quad a doppia faccia
      if (mat === MATERIE.erba) {
        for (let k = 0; k < erba; k++) {
          const r = hash(x, z, seme + 20 + k);
          if (r < 0.25) continue;
          const alt = 1;
          const ox2 = lx + (k === 0 ? 0 : 0), oz2 = lz + (k === 0 ? 0 : 0);
          const s = SEGNALE_VENTO, sc = SEGNALE_VENTO | SEGNALE_CIMA;
          const t2 = Math.floor(hash(x, z, seme + 30 + k) * 255);
          // due quad a X dentro la cella: entrambi con normale +Y (l'erba è tinta piatta)
          c.quadDa([ox2, h + 1, oz2, 2, 15, bl, MATERIE.filo, t2, s], [ox2, h + 1 + alt, oz2, 2, 15, bl, MATERIE.filo, t2, sc],
                   [ox2 + 1, h + 1 + alt, oz2 + 1, 2, 15, bl, MATERIE.filo, t2, sc], [ox2 + 1, h + 1, oz2 + 1, 2, 15, bl, MATERIE.filo, t2, s]);
          c.quadDa([ox2 + 1, h + 1, oz2, 2, 15, bl, MATERIE.filo, t2, s], [ox2 + 1, h + 1 + alt, oz2, 2, 15, bl, MATERIE.filo, t2, sc],
                   [ox2, h + 1 + alt, oz2 + 1, 2, 15, bl, MATERIE.filo, t2, sc], [ox2, h + 1, oz2 + 1, 2, 15, bl, MATERIE.filo, t2, s]);
          if (h + 2 > maxY) maxY = h + 2;
        }
      }
    }
  }
  // i pali delle lampade di QUESTO chunk: un palo di 3 blocchi e una testa emissiva
  for (const l of lampade(cx, cz, seme)) {
    const lx = Math.floor(l.x) - ox, lz = Math.floor(l.z) - oz, base = l.y - 3;
    for (let y = base + 1; y <= l.y; y++) {
      const m = y === l.y ? MATERIE.lampada : MATERIE.tronco;
      const bl = y === l.y ? 15 : 12;
      const a = lx + 0.5 - 0.15, b = lx + 0.5 + 0.15;   // ⚠ i pali stanno su posizioni intere: qui si arrotonda alla cella
      const A = Math.floor(a), B = Math.min(LATO_CHUNK, Math.floor(a) + 1);
      const C = lz, D = lz + 1;
      c.quadDa([B, y, C, 0, 12, bl, m, 0], [B, y + 1, C, 0, 12, bl, m, 0], [B, y + 1, D, 0, 12, bl, m, 0], [B, y, D, 0, 12, bl, m, 0]);
      c.quadDa([A, y, D, 1, 12, bl, m, 0], [A, y + 1, D, 1, 12, bl, m, 0], [A, y + 1, C, 1, 12, bl, m, 0], [A, y, C, 1, 12, bl, m, 0]);
      c.quadDa([B, y, D, 4, 12, bl, m, 0], [B, y + 1, D, 4, 12, bl, m, 0], [A, y + 1, D, 4, 12, bl, m, 0], [A, y, D, 4, 12, bl, m, 0]);
      c.quadDa([A, y, C, 5, 12, bl, m, 0], [A, y + 1, C, 5, 12, bl, m, 0], [B, y + 1, C, 5, 12, bl, m, 0], [B, y, C, 5, 12, bl, m, 0]);
      if (y === l.y) c.quadDa([A, y + 1, C, 2, 15, bl, m, 0], [A, y + 1, D, 2, 15, bl, m, 0], [B, y + 1, D, 2, 15, bl, m, 0], [B, y + 1, C, 2, 15, bl, m, 0]);
      if (y + 1 > maxY) maxY = y + 1;
    }
  }
  const d = c.dati();
  return { ...d, minY, maxY, cx, cz };
}

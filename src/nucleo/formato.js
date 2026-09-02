// IL FORMATO DEL VERTICE DEL NUCLEO — dodici byte, posizioni in SEDICESIMI.
//
// ⚠ È LA PRIMA PIETRA DELLA RIFONDAZIONE (docs/RIFONDAZIONE.md, tecnica 2): un
// chunk è UNA chiamata di disegno, e ogni vertice porta tutto quello che il
// pixel deve sapere, già cotto. Niente float: posizione INTERA in sedicesimi
// di blocco relativa al chunk, normale a indice, luce del cielo e di blocco a
// 4 bit l'una (come Minecraft), l'indice di materia e un bit di vento.
//
// ⚠ PERCHÉ SEDICESIMI E NON BLOCCHI INTERI: la geometria di Leafy NON È UN
// VOXEL (world/supercubo.js): il corpo del blocco sta a ±9/16, il brim
// dell'erba a 10/16, gli smussi vanno da 8 a 9. A byte interi il nucleo
// disegnava cubi nudi, e il committente l'ha visto subito («stai usando
// voxel»). Un pixel di Leafy è 1/16 di blocco, e un vertice deve poterlo dire.
//
//   uint32 A   x (9 bit, sedicesimi + 16: da −1 a +31 blocchi) | z (9 bit) <<9
//              | normale (5 bit) <<18 | vento (1 bit) <<23 | materia (4 bit) <<24
//   uint32 B   y (16 bit, sedicesimi dallo scarto del chunk) | cielo (4) <<16 | blocco (4) <<20
//   byte 8-11  r g b 0                IL COLORE COTTO, come nel mesher di oggi
//
// ⚠ LA NORMALE È UN INDICE A 27: (sx+1)·9 + (sy+1)·3 + (sz+1) con sx,sy,sz in
// {−1, 0, 1} — le sei facce, i dodici smussi e gli otto angoli del supercubo
// con un numero solo; lo shader la ricava con tre divisioni, senza tabella.
// 13 (lo zero) non si emette mai.
//
// ⚠ IL COLORE È RGB, NON UN INDICE, ed è una scelta di fedeltà: la palette di
// Leafy (stagione, rampa a ping-pong per quota, motivi, tinta delle materie) è
// già tutta in `world/stagioni.js` + `motivi.js` + `materie.js` e produce un
// colore per faccia. Cuocerlo tale e quale nel vertice vuol dire che il nucleo
// disegna ESATTAMENTE i colori del gioco di oggi, senza reinventare niente.
//   materia 0..15: la riga di `world/materie.js` (emissione, brillio, riflesso)
//   vento: il vertice ondeggia (la cima di un filo d'erba); per l'acqua, «cima della cella»
//
// ⚠ NIENTE MOTORE QUI DENTRO: gira in Node, ed è lì che si prova.

export const BYTE_VERTICE = 12;
export const LATO_CHUNK = 16;
export const SEDICESIMI = 16;
const SCARTO_XZ = 16;      // sedicesimi: un blocco di margine sotto zero (il brim sborda 2/16 fuori dal chunk)
/** ⚠ IL TETTO DEI QUAD PER CHUNK: gli indici sono a 16 bit (65.536 vertici), quindi
 *  16.384 quad. Un chunk di terreno col supercubo sta sui 3-6 mila: c'è margine,
 *  e se un giorno non basta si spezza in due disegni, non si passa a 32 bit
 *  (su mobile gli indici a 32 bit sono un'estensione, e costano). */
export const QUAD_MAX = 16384;

/** L'indice di normale da un verso a componenti in {−1, 0, 1}. */
export function indiceNormale(nx, ny, nz) {
  return (Math.sign(nx) + 1) * 9 + (Math.sign(ny) + 1) * 3 + (Math.sign(nz) + 1);
}
/** Le sei facce, per nome. */
export const N_XP = indiceNormale(1, 0, 0), N_XM = indiceNormale(-1, 0, 0);
export const N_SU = indiceNormale(0, 1, 0), N_GIU = indiceNormale(0, -1, 0);
export const N_ZP = indiceNormale(0, 0, 1), N_ZM = indiceNormale(0, 0, -1);
/** Dall'indice al verso (non normalizzato). */
export function versoNormale(i) { return [Math.floor(i / 9) - 1, Math.floor(i / 3) % 3 - 1, i % 3 - 1]; }
/** Le sei facce nell'ordine storico +x −x +y −y +z −z → indice a 27. */
export const NORMALE_ASSE = [N_XP, N_XM, N_SU, N_GIU, N_ZP, N_ZM];

/** Costruisce il vettore di byte di un chunk, quad per quad. Cresce da sé. */
export class CostruttoreNucleo {
  constructor(quadStimati = 1024) {
    this.byte = new Uint8Array(quadStimati * 4 * BYTE_VERTICE);
    this.u32 = new Uint32Array(this.byte.buffer);
    this.n = 0;          // vertici scritti
    this.quad = 0;
  }

  _spazio(vertici) {
    const serve = (this.n + vertici) * BYTE_VERTICE;
    if (serve <= this.byte.length) return;
    let nuovo = this.byte.length * 2;
    while (nuovo < serve) nuovo *= 2;
    const b = new Uint8Array(nuovo); b.set(this.byte); this.byte = b; this.u32 = new Uint32Array(b.buffer);
  }

  /**
   * Un vertice. `x`, `z` in blocchi relativi al chunk (anche frazionari: si
   * arrotonda al sedicesimo), `y` in blocchi dallo scarto del chunk; `normale`
   * è l'indice a 27; `colore` è 0xRRGGBB come lo danno `paletteBlocco` e
   * `coloreFaccia`. Chi passa fuori scala lo scopre subito.
   */
  vertice(x, y, z, normale, cielo, blocco, colore, vento = 0, materia = 0) {
    const X = Math.round(x * SEDICESIMI) + SCARTO_XZ, Z = Math.round(z * SEDICESIMI) + SCARTO_XZ, Y = Math.round(y * SEDICESIMI);
    if (X < 0 || X > 511 || Z < 0 || Z > 511 || Y < 0 || Y > 65535) throw new RangeError(`vertice fuori dal chunk: ${x},${y},${z}`);
    if (normale < 0 || normale > 26 || normale === 13) throw new RangeError(`normale non valida: ${normale}`);
    this._spazio(1);
    const o = this.n * 3, b = this.byte, u = this.u32;
    u[o] = (X | (Z << 9) | ((normale & 31) << 18) | ((vento & 1) << 23) | ((materia & 15) << 24)) >>> 0;
    u[o + 1] = (Y | ((cielo & 15) << 16) | ((blocco & 15) << 20)) >>> 0;
    const ob = this.n * BYTE_VERTICE + 8;
    b[ob] = (colore >> 16) & 255; b[ob + 1] = (colore >> 8) & 255; b[ob + 2] = colore & 255; b[ob + 3] = 0;
    this.n++;
  }

  /** Quattro vertici in senso antiorario visti da fuori: v0 v1 v2 v3. */
  quadDa(v0, v1, v2, v3) {
    if (this.quad >= QUAD_MAX) throw new RangeError('troppi quad per un chunk');
    for (const v of [v0, v1, v2, v3]) this.vertice(...v);
    this.quad++;
  }

  /** I byte esatti (una vista, senza copia) e quanti quad. */
  dati() {
    return { byte: this.byte.subarray(0, this.n * BYTE_VERTICE), quad: this.quad, vertici: this.n, triangoli: this.quad * 2 };
  }
}

/** Legge un vertice dai byte: serve alle prove e agli strumenti, non alla resa. Posizioni in blocchi. */
export function leggiVertice(byte, i) {
  const o = i * BYTE_VERTICE;
  const dv = new DataView(byte.buffer, byte.byteOffset + o, BYTE_VERTICE);
  const A = dv.getUint32(0, true), B = dv.getUint32(4, true);
  return {
    x: ((A & 511) - SCARTO_XZ) / SEDICESIMI, z: (((A >>> 9) & 511) - SCARTO_XZ) / SEDICESIMI, y: (B & 65535) / SEDICESIMI,
    normale: (A >>> 18) & 31, vento: (A >>> 23) & 1, materia: (A >>> 24) & 15,
    cielo: (B >>> 16) & 15, blocco: (B >>> 20) & 15,
    colore: (byte[o + 8] << 16) | (byte[o + 9] << 8) | byte[o + 10],
  };
}

/**
 * GLI INDICI SONO CONDIVISI: ogni quad è 0 1 2 · 0 2 3 sui suoi quattro vertici,
 * quindi un solo buffer di indici serve a TUTTI i chunk (si disegna con
 * `quad * 6`). Un buffer in meno per chunk, e nessun indice da ricalcolare.
 */
export function indiciCondivisi(quad = QUAD_MAX) {
  const idx = new Uint16Array(quad * 6);
  for (let q = 0, i = 0, v = 0; q < quad; q++, v += 4) {
    idx[i++] = v; idx[i++] = v + 1; idx[i++] = v + 2;
    idx[i++] = v; idx[i++] = v + 2; idx[i++] = v + 3;
  }
  return idx;
}

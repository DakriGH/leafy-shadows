// L'ERBA DEL NUCLEO — fili a triangolo dentro il mesh del chunk (tecnica 3).
//
// Il prato di oggi (motore/erba.js) è a istanze sottili: 50.000 lamelle, una
// risemina quando si cambia chunk, un tetto di memoria per dispositivo. Qui
// ogni filo è UN TRIANGOLO cotto nel chunk: si disegna col chunk, si culla col
// chunk, non si risemina mai. Le forme, i colori e il vento sono quelli del
// prato di Leafy: ciuffi di 3-7 fili, larghi 0,10-0,18, alti 0,2-0,9, base
// del colore della cima e punta più chiara, ondeggio per hash.
//
// FORMATO (8 byte per vertice, 3 vertici per filo):
//   byte 0-1  x z  in ottavi di cella nel chunk (0..128)
//   byte 2    y    in ottavi di cella sopra `yBase` del chunk (0..255 → 32 celle)
//   byte 3    seme (fase del vento)
//   byte 4-6  r g b
//   byte 7    bit0 = punta (ondeggia), bit1-7 = cielo cotto (0..15) << 1 … e basta
export const BYTE_FILO = 8;

const FORME = [
  { n: 5, largo: 0.15, alto: 0.32, apri: 0.42 },
  { n: 4, largo: 0.12, alto: 0.50, apri: 0.34 },
  { n: 7, largo: 0.10, alto: 0.38, apri: 0.46 },
  { n: 3, largo: 0.18, alto: 0.28, apri: 0.30 },
];

function hash(x, z, k) {
  let h = (x * 374761393 + z * 668265263 + k * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
function chiarisci(c, k) {
  const f = (v) => Math.max(0, Math.min(255, Math.round(v * k)));
  return (f((c >> 16) & 255) << 16) | (f((c >> 8) & 255) << 8) | f(c & 255);
}

export class CostruttoreErba {
  constructor(yBase, fili = 512) {
    this.yBase = yBase;
    this.byte = new Uint8Array(fili * 3 * BYTE_FILO);
    this.n = 0;
  }
  _v(x8, z8, y8, seme, col, punta, cielo) {
    if ((this.n + 1) * BYTE_FILO > this.byte.length) { const b = new Uint8Array(this.byte.length * 2); b.set(this.byte); this.byte = b; }
    const o = this.n * BYTE_FILO, b = this.byte;
    b[o] = x8; b[o + 1] = z8; b[o + 2] = y8; b[o + 3] = seme;
    b[o + 4] = (col >> 16) & 255; b[o + 5] = (col >> 8) & 255; b[o + 6] = col & 255;
    b[o + 7] = (punta ? 1 : 0) | ((cielo & 15) << 1);
    this.n++;
  }
  /**
   * Un ciuffo sulla cima della cella (x, y, z) del mondo (quote assolute), nel
   * chunk con origine (ox, oz). `densita` scala il numero di fili della forma.
   */
  ciuffo(x, y, z, ox, oz, colCima, cielo, densita = 1) {
    const f = FORME[Math.floor(hash(x, z, 3) * FORME.length)];
    const n = Math.max(1, Math.round(f.n * densita * (0.82 + 0.36 * hash(x, z, 5))));
    const yb = y + 1 - this.yBase;
    if (yb < 0 || yb * 8 > 255 - 8) return 0;
    for (let k = 0; k < n; k++) {
      const q = hash(x, z, k * 17 + 5), r = hash(x, z, k * 17 + 11), a = hash(x, z, k * 17 + 23), g = hash(x, z, k * 17 + 41), j = hash(x, z, k * 17 + 59);
      const apri = Math.min(0.98, 0.66 + f.apri);
      const cx = x + 0.5 + (q - 0.5) * apri, cz = z + 0.5 + (r - 0.5) * apri;
      const ang = a * Math.PI;
      // ⚠ CIUFFI BASSI, come nelle concept art del committente (un terzo di
      // blocco, non uno intero): a un blocco l'erba copriva il gatto e le terrazze.
      const alto = Math.min(0.8, f.alto * (0.62 + 0.8 * hash(x, z, k * 17 + 71)) * (0.5 + 0.6 * Math.pow(g, 1.5)));
      const largo = f.largo * (0.8 + 0.4 * j) * 0.5;
      const dx = Math.cos(ang) * largo, dz = Math.sin(ang) * largo;
      const base = chiarisci(colCima, 0.94 + 0.12 * j);
      const punta = chiarisci(colCima, 1.0 + 0.18 * hash(x, z, k * 17 + 83));
      const X = (v) => Math.max(0, Math.min(128, Math.round((v - ox) * 8)));
      const Z = (v) => Math.max(0, Math.min(128, Math.round((v - oz) * 8)));
      const seme = Math.floor(hash(x, z, k * 17 + 97) * 255);
      const y8 = Math.round(yb * 8), yt8 = Math.min(255, Math.round((yb + alto) * 8));
      // ⚠ TRE VERTICI, un triangolo: base sinistra, base destra, punta (come il prato)
      this._v(X(cx - dx), Z(cz - dz), y8, seme, base, 0, cielo);
      this._v(X(cx + dx), Z(cz + dz), y8, seme, base, 0, cielo);
      this._v(X(cx), Z(cz), yt8, seme, punta, 1, cielo);
    }
    return n;
  }
  dati() { return { byte: this.byte.subarray(0, this.n * BYTE_FILO), vertici: this.n, fili: this.n / 3, yBase: this.yBase }; }
}

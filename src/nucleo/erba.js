// L'ERBA DEL NUCLEO — lamelle a ISTANZE dentro il chunk (tecnica 3).
//
// Il prato di Leafy è fatto di LAMELLE rettangolari con la sfumatura (base
// scura, punta chiara) che da lontano diventano triangoli. Qui ogni lamella
// è UN'ISTANZA di 12 byte cotta nel chunk: la geometria (un rettangolo, due
// triangoli) la costruisce il vertex shader da `gl_VertexID`, e SEMPRE lui
// decide la forma in base alla distanza — rettangolo vicino, triangolo
// lontano (le due punte si chiudono al centro), e nell'ultimo tratto prima
// del confine dell'erba la lamella si abbassa nel terreno. Così il passaggio
// non SCATTA mai: niente pop-in, che era «tremendo» a schermo.
//
// FORMATO (12 byte per lamella):
//   byte 0-1  x z  base della lamella, in ottavi di cella nel chunk (0..128)
//   byte 2    y    base, in ottavi di cella sopra `yBase` del chunk (0..255 → 32 celle)
//   byte 3    seme (fase del vento, verso della lamella)
//   byte 4-6  r g b  il colore della punta (la base è lo stesso, più scuro)
//   byte 7    cielo cotto (0..15) << 2
//   byte 8    altezza in 1/64 di cella (0..255 → 4 celle)
//   byte 9    larghezza in 1/128 di cella
//   byte 10   inclinazione della punta lungo il verso, in 1/128 di cella (+128)
//   byte 11   libero
export const BYTE_FILO = 12;

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
    this.byte = new Uint8Array(fili * BYTE_FILO);
    this.n = 0;
  }
  _lamella(x8, z8, y8, seme, col, cielo, alto64, largo128, inclina) {
    if ((this.n + 1) * BYTE_FILO > this.byte.length) { const b = new Uint8Array(this.byte.length * 2); b.set(this.byte); this.byte = b; }
    const o = this.n * BYTE_FILO, b = this.byte;
    b[o] = x8; b[o + 1] = z8; b[o + 2] = y8; b[o + 3] = seme;
    b[o + 4] = (col >> 16) & 255; b[o + 5] = (col >> 8) & 255; b[o + 6] = col & 255;
    b[o + 7] = (cielo & 15) << 2;
    b[o + 8] = Math.max(1, Math.min(255, alto64)); b[o + 9] = Math.max(1, Math.min(255, largo128)); b[o + 10] = Math.max(0, Math.min(255, inclina + 128)); b[o + 11] = 0;
    this.n++;
  }
  /**
   * Un ciuffo sulla cima della cella (x, y, z) del mondo (quote assolute), nel
   * chunk con origine (ox, oz). `densita` scala il numero di lamelle della forma.
   */
  ciuffo(x, y, z, ox, oz, colCima, cielo, densita = 1) {
    const f = FORME[Math.floor(hash(x, z, 3) * FORME.length)];
    const n = Math.max(1, Math.round(f.n * densita * (0.82 + 0.36 * hash(x, z, 5))));
    const yb = y + 1 - this.yBase;
    if (yb < 0 || yb * 8 > 255 - 8) return 0;
    for (let k = 0; k < n; k++) {
      const q = hash(x, z, k * 17 + 5), r = hash(x, z, k * 17 + 11), g = hash(x, z, k * 17 + 41), j = hash(x, z, k * 17 + 59);
      const apri = Math.min(0.98, 0.66 + f.apri);
      const cx = x + 0.5 + (q - 0.5) * apri, cz = z + 0.5 + (r - 0.5) * apri;
      // ⚠ CIUFFI BASSI, come nelle concept art del committente (un terzo di
      // blocco, non uno intero): a un blocco l'erba copriva il gatto e le terrazze.
      const alto = Math.min(0.8, f.alto * (0.62 + 0.8 * hash(x, z, k * 17 + 71)) * (0.5 + 0.6 * Math.pow(g, 1.5)));
      const largo = f.largo * (0.8 + 0.4 * j);
      const inclina = (hash(x, z, k * 17 + 83) - 0.5) * 0.5;   // la punta pende un po' da una parte
      const punta = chiarisci(colCima, 1.0 + 0.18 * hash(x, z, k * 17 + 89));
      const X = Math.max(0, Math.min(128, Math.round((cx - ox) * 8))), Z = Math.max(0, Math.min(128, Math.round((cz - oz) * 8)));
      const seme = Math.floor(hash(x, z, k * 17 + 97) * 255);
      this._lamella(X, Z, Math.round(yb * 8), seme, punta, cielo, Math.round(alto * 64), Math.round(largo * 128), Math.round(inclina * 128));
    }
    return n;
  }
  /** `vertici` è per compatibilità: le lamelle sono istanze, sei vertici l'una dal shader. */
  dati() { return { byte: this.byte.subarray(0, this.n * BYTE_FILO), vertici: this.n * 6, fili: this.n, yBase: this.yBase }; }
}

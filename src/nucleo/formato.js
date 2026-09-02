// IL FORMATO DEL VERTICE DEL NUCLEO — otto byte, e non uno di più.
//
// ⚠ È LA PRIMA PIETRA DELLA RIFONDAZIONE (docs/RIFONDAZIONE.md, tecnica 2): un
// chunk è UNA chiamata di disegno, e ogni vertice porta tutto quello che il
// pixel deve sapere, già cotto. Niente float: posizione intera relativa al
// chunk, normale a indice, luce del cielo e di blocco a 4 bit l'una (come
// Minecraft), l'indice di materia e un byte di segnali. Un mondo da mezzo
// milione di vertici sta in 4 MB, e la GPU legge un vettore di byte solo.
//
// ⚠ NIENTE MOTORE QUI DENTRO: è un file di `nucleo/` che gira anche in Node,
// perché il mesher del nucleo si prova in Node come tutto `world/`.
//
//   byte 0  x   0..16   posizione nel chunk (16 = il bordo lontano)
//   byte 1  z   0..16
//   byte 2  y   0..255  quota nel chunk (il chunk porta il suo scarto in Y)
//   byte 3  normale (3 bit) | vento (1 bit) | materia (4 bit)
//   byte 4  cielo << 4 | blocco     le due luci, 0..15 l'una
//   byte 5-7  r g b                 IL COLORE COTTO, come nel mesher di oggi
//
// ⚠ IL COLORE È RGB, NON UN INDICE, ed è una scelta di fedeltà: la palette di
// Leafy (stagione, rampa a ping-pong per quota, motivi, tinta delle materie) è
// già tutta in `world/stagioni.js` + `motivi.js` + `materie.js` e produce un
// colore per faccia. Cuocerlo tale e quale nel vertice vuol dire che il nucleo
// disegna ESATTAMENTE i colori del gioco di oggi, senza reinventare niente. Il
// prezzo sono tre byte invece di uno, e un cambio di stagione che rifà i chunk
// (come oggi: «i colori sono cotti nella mesh»).
//   materia 0..15: la riga di `world/materie.js` (emissione, brillio, riflesso)
//   vento: il vertice ondeggia (la cima di un filo d'erba)

export const BYTE_VERTICE = 8;
export const LATO_CHUNK = 16;
/** ⚠ IL TETTO DEI QUAD PER CHUNK: gli indici sono a 16 bit (65.536 vertici), quindi
 *  16.384 quad. Un chunk di terreno con l'erba sta sui 1.500: c'è margine dieci
 *  volte, e se un giorno non basta si spezza in due disegni, non si passa a 32 bit
 *  (su mobile gli indici a 32 bit sono un'estensione, e costano). */
export const QUAD_MAX = 16384;

export const NORMALI = [
  [1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1],
];
/** Impacchetta il terzo byte: normale 0..5, vento 0/1, materia 0..15. */
export function byteNormale(normale, vento = 0, materia = 0) {
  return (normale & 7) | ((vento & 1) << 3) | ((materia & 15) << 4);
}

/** Costruisce il vettore di byte di un chunk, quad per quad. Cresce da sé. */
export class CostruttoreNucleo {
  constructor(quadStimati = 1024) {
    this.byte = new Uint8Array(quadStimati * 4 * BYTE_VERTICE);
    this.n = 0;          // vertici scritti
    this.quad = 0;
  }

  _spazio(vertici) {
    const serve = (this.n + vertici) * BYTE_VERTICE;
    if (serve <= this.byte.length) return;
    let nuovo = this.byte.length * 2;
    while (nuovo < serve) nuovo *= 2;
    const b = new Uint8Array(nuovo); b.set(this.byte); this.byte = b;
  }

  /** Un vertice. Tutti i campi interi; chi passa fuori scala lo scopre subito.
   *  `colore` è un intero 0xRRGGBB, come lo danno `paletteBlocco` e `coloreFaccia`. */
  vertice(x, y, z, normale, cielo, blocco, colore, vento = 0, materia = 0) {
    if (x < 0 || x > LATO_CHUNK || z < 0 || z > LATO_CHUNK || y < 0 || y > 255) throw new RangeError(`vertice fuori dal chunk: ${x},${y},${z}`);
    this._spazio(1);
    const o = this.n * BYTE_VERTICE, b = this.byte;
    b[o] = x; b[o + 1] = z; b[o + 2] = y; b[o + 3] = byteNormale(normale, vento, materia);
    b[o + 4] = ((cielo & 15) << 4) | (blocco & 15);
    b[o + 5] = (colore >> 16) & 255; b[o + 6] = (colore >> 8) & 255; b[o + 7] = colore & 255;
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

/** Legge un vertice dai byte: serve alle prove e agli strumenti, non alla resa. */
export function leggiVertice(byte, i) {
  const o = i * BYTE_VERTICE;
  return { x: byte[o], z: byte[o + 1], y: byte[o + 2], normale: byte[o + 3] & 7, vento: (byte[o + 3] >> 3) & 1, materia: byte[o + 3] >> 4,
    cielo: byte[o + 4] >> 4, blocco: byte[o + 4] & 15, colore: (byte[o + 5] << 16) | (byte[o + 6] << 8) | byte[o + 7] };
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

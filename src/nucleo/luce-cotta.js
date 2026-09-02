// LA LUCE COTTA — cielo e lampade propagati nella griglia, come Minecraft (F2).
//
// ⚠ È LA TECNICA 1 DELLA RIFONDAZIONE: il costo della luce si paga alla
// costruzione, non al fotogramma. Due canali per cella, 0..15:
//  · CIELO: 15 dove sopra la cella c'è solo aria fino al cielo; sotto una
//    sporgenza o in grotta la luce entra dai lati perdendo 1 per cella. È così
//    che l'interno di una caverna è buio e l'imbocco sfuma.
//  · BLOCCO: 15 alla sorgente (la testa del lampione) e −CADUTA per cella,
//    sui sei vicini, fermandosi sui solidi. Il raggio del lampione di Leafy è
//    4,6 blocchi (decorazioni.js) ma la testa sta 2,6 celle SOPRA il suolo:
//    con caduta 3 a terra arrivavano 6 su 15 (misurato: 28 vertici accesi in
//    un chunk). Con caduta 2 sotto la lampada c'è 9, e la pozza a terra ha un
//    raggio di ~5 celle, che è il lampione di Leafy.
//
// ⚠ NIENTE MOTORE, gira in Node. Si calcola per CHUNK con un margine: la luce
// dei vicini entra dai bordi, quindi si propaga su una scatola più larga del
// chunk (il raggio massimo di una lampada) e si tiene solo il centro.
import { CHUNK } from '../world/world.js';
import { defDi } from '../world/blocks.js';
import { FORME_VUOTE } from '../world/forme.js';
import { DECORAZIONI } from '../world/decorazioni.js';

export const CADUTA_LAMPADA = 2;
export const MARGINE = 6;                 // celle oltre il chunk, in pianta
const ALTO = 256;

function ferma(tipo) {
  if (!tipo) return false;
  const d = defDi(tipo);
  return !d.acqua && !d.vetro && !FORME_VUOTE.has(d.forma);
}

/**
 * La luce di un chunk: due Uint8Array (cielo, blocco) sulla scatola
 * [x0−M, x0+16+M) × [yMin, yMax] × [z0−M, z0+16+M), con `leggi(x, y, z)`.
 * @param mondo   il mondo (tipo(x,y,z), perOgniDelChunk)
 * @param kc      «cx,cz»
 * @param yMin/yMax  la fascia verticale da calcolare (il chunk più un po')
 */
export function cuociLuce(mondo, kc, yMin, yMax) {
  const v = kc.indexOf(',');
  const cx = +kc.slice(0, v), cz = +kc.slice(v + 1);
  const x0 = cx * CHUNK - MARGINE, z0 = cz * CHUNK - MARGINE;
  const W = CHUNK + 2 * MARGINE, H = yMax - yMin + 1, D = W;
  const n = W * H * D;
  const cielo = new Uint8Array(n), blocco = new Uint8Array(n), solido = new Uint8Array(n);
  const idx = (x, y, z) => ((x - x0) * H + (y - yMin)) * D + (z - z0);
  const dentro = (x, y, z) => x >= x0 && x < x0 + W && y >= yMin && y <= yMax && z >= z0 && z < z0 + D;

  // 1) i solidi della scatola e le sorgenti
  const sorgenti = [];
  for (let x = x0; x < x0 + W; x++) for (let z = z0; z < z0 + D; z++) {
    // ⚠ IL CIELO ARRIVA DALL'ALTO: si scende la colonna finché non si trova un
    // solido; da lì in giù la colonna è «coperta» (cielo diretto 0).
    let coperta = false;
    for (let y = yMax; y >= yMin; y--) {
      const t = mondo.tipo(x, y, z);
      const i = idx(x, y, z);
      if (ferma(t)) { solido[i] = 1; coperta = true; continue; }
      // ⚠ sopra la fascia calcolata ci può essere altro: si guarda fino a ALTO
      if (!coperta && y === yMax) { for (let yy = yMax + 1; yy < ALTO && yy < yMax + 40; yy++) if (ferma(mondo.tipo(x, yy, z))) { coperta = true; break; } }
      if (!coperta) cielo[i] = 15;
      if (t) {
        const d = defDi(t);
        const dec = d.forma === 'modello' && DECORAZIONI[t];
        if (dec && dec.luce) sorgenti.push([x, y + Math.round(dec.luce.quota ?? 1), z]);
      }
    }
  }
  // 2) il cielo entra dai lati: BFS dai 15 con −1 per cella (l'acqua toglie 2)
  const coda = [];
  for (let i = 0; i < n; i++) if (cielo[i] === 15) coda.push(i);
  propaga(coda, cielo, solido, W, H, D, 1);
  // 3) le lampade: 15 alla sorgente, −CADUTA per cella
  const codaB = [];
  for (const [x, y, z] of sorgenti) { if (!dentro(x, y, z)) continue; const i = idx(x, y, z); blocco[i] = 15; codaB.push(i); }
  propaga(codaB, blocco, solido, W, H, D, CADUTA_LAMPADA);

  return {
    x0, z0, yMin, yMax, W, H, D, cielo, blocco,
    /** La luce della cella (x, y, z), o [15, 0] fuori scatola (sopra: cielo pieno). */
    leggi(x, y, z) {
      if (!dentro(x, y, z)) return y > yMax ? [15, 0] : [0, 0];
      const i = idx(x, y, z);
      return [cielo[i], blocco[i]];
    },
  };
}

/** BFS a ondate: da ogni cella accesa ai sei vicini, con la caduta, fermandosi sui solidi. */
function propaga(coda, luce, solido, W, H, D, caduta) {
  const passi = [H * D, -H * D, D, -D, 1, -1];
  let testa = 0;
  while (testa < coda.length) {
    const i = coda[testa++];
    const l = luce[i] - caduta;
    if (l <= 0) continue;
    const x = Math.floor(i / (H * D)), y = Math.floor(i / D) % H, z = i % D;
    for (let k = 0; k < 6; k++) {
      if ((k === 0 && x === W - 1) || (k === 1 && x === 0) || (k === 2 && y === H - 1) || (k === 3 && y === 0) || (k === 4 && z === D - 1) || (k === 5 && z === 0)) continue;
      const j = i + passi[k];
      if (solido[j] || luce[j] >= l) continue;
      luce[j] = l;
      coda.push(j);
    }
  }
}

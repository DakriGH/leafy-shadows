// SHA-256 A MANO — perché su un telefono, in casa, «crypto.subtle» NON C'È.
//
// ⚠ QUESTA È LA TRAPPOLA CHE AVREBBE FATTO FALLIRE TUTTO, e in modo storto. I
// browser espongono `crypto.subtle` solo nei «contesti sicuri»: https, oppure
// localhost. Un telefono che apre il gioco su `http://192.168.1.31:8144/` —
// cioè il modo normale di provarlo in casa — trova `crypto.subtle` UNDEFINED.
// L'argomento su ntfy si ricava da un'impronta della password: senza impronta
// niente indirizzo, e il bottone sarebbe morto proprio sul dispositivo per cui
// esiste. Peggio: l'errore sarebbe uscito come «niente rete», che manda a
// cercare dalla parte sbagliata.
//
// ⚠ E NON SI PUÒ AGGIRARE CAMBIANDO CONTO. Serve che il gioco e il lettore
// arrivino allo STESSO nome: cambiare impronta solo dove manca `subtle`
// vorrebbe dire due indirizzi diversi per la stessa password, cioè rapporti
// spediti in un posto dove nessuno guarda. Quindi la stessa SHA-256, scritta
// qui in una quarantina di righe.
//
// ⚠ SERVE SOLO A FARE UN NOME, non a proteggere niente: la password non viaggia
// (vedi «ui/canale.js»). Ma dev'essere SHA-256 vera, bit per bit, se no i due
// lati divergono — ed è esattamente quello che la prova controlla.

const K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);

const gira = (x, n) => (x >>> n) | (x << (32 - n));

/** L'impronta di questi byte, in esadecimale minuscolo. */
export function sha256Esa(byte) {
  const h = new Uint32Array([0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
                             0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19]);
  // ⚠ IL RIEMPIMENTO: un 1 in bit, poi zeri, poi la LUNGHEZZA IN BIT su 64 bit
  // in fondo. Sbagliarlo dà un'impronta plausibile e diversa da quella vera —
  // il genere di errore che si vede solo confrontandolo con un'altra
  // implementazione, che è quello che fa la prova.
  const bitLen = byte.length * 8;
  const conCoda = new Uint8Array(((byte.length + 9 + 63) >> 6) << 6);
  conCoda.set(byte);
  conCoda[byte.length] = 0x80;
  // la lunghezza sta negli ultimi 8 byte; sopra i 4 GB non ci arriviamo mai
  new DataView(conCoda.buffer).setUint32(conCoda.length - 4, bitLen >>> 0);
  new DataView(conCoda.buffer).setUint32(conCoda.length - 8, Math.floor(bitLen / 4294967296));

  const w = new Uint32Array(64);
  const vista = new DataView(conCoda.buffer);
  for (let blocco = 0; blocco < conCoda.length; blocco += 64) {
    for (let i = 0; i < 16; i++) w[i] = vista.getUint32(blocco + i * 4);
    for (let i = 16; i < 64; i++) {
      const s0 = gira(w[i - 15], 7) ^ gira(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = gira(w[i - 2], 17) ^ gira(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, hh] = h;
    for (let i = 0; i < 64; i++) {
      const S1 = gira(e, 6) ^ gira(e, 11) ^ gira(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K[i] + w[i]) >>> 0;
      const S0 = gira(a, 2) ^ gira(a, 13) ^ gira(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  let fuori = '';
  for (const x of h) fuori += x.toString(16).padStart(8, '0');
  return fuori;
}

// LA FOTOGRAFIA DI UNA ZONA DEL MONDO — quello che un chunk deve sapere per
// costruirsi, impacchettato per attraversare il confine di un Worker.
//
// ⚠ NIENTE MOTORE, NIENTE STATO: si importa in Node e nel Worker allo stesso
// modo. È un Uint16Array denso (0 = aria, n = indice+1 in `tipi`) su una
// scatola che copre il chunk più i margini che il mesher legge davvero:
//   · ±4 in pianta — la riva guarda 2 celle, il culling 1, la pelle 1;
//   · 33 in giù — la pelle cerca la colonna vicina fin lì;
//   · 26 in su — la colonna di una cascata si misura fino a 24 sopra.
// Chi legge fuori dalla scatola trova aria, come fuori dal mondo.
//
// ⚠ E PORTA CON SÉ LA STAGIONE e le definizioni dei blocchi che nomina: nel
// Worker `stagioni.js` e `blocks.js` sono copie con il loro stato, e senza
// questi due pezzi un chunk costruito d'inverno tornerebbe verde, o un blocco
// dell'Officina «perduto».
import { CHUNK } from './world.js';
import { BLOCCHI, tipoBase, registraBlocco } from './blocks.js';
import { stagioneCorrente, mescolanzaCorrente, impostaMescolanza } from './stagioni.js';

export const MARGINE_XZ = 4;
export const MARGINE_GIU = 33;
export const MARGINE_SU = 26;

/**
 * Fotografa la zona attorno a `kc`. `null` se il chunk è vuoto (chi chiama lo rimuove).
 * @param stagione  {corrente, mescolanza} — di fabbrica quella del modulo stagioni
 */
export function fotografa(mondo, kc, livello = 0, soloAcqua = false, stagione = null) {
  const v = kc.indexOf(',');
  const cx = +kc.slice(0, v), cz = +kc.slice(v + 1);
  let minY = Infinity, maxY = -Infinity;
  mondo.perOgniDelChunk(kc, (x, y) => { if (y < minY) minY = y; if (y > maxY) maxY = y; });
  if (minY === Infinity) return null;
  const x0 = cx * CHUNK - MARGINE_XZ, z0 = cz * CHUNK - MARGINE_XZ, y0 = minY - MARGINE_GIU;
  const nx = CHUNK + 2 * MARGINE_XZ, nz = nx, ny = maxY + MARGINE_SU - y0 + 1;
  const celle = new Uint16Array(nx * ny * nz);
  const tipi = [];
  const indice = new Map();
  for (let dcx = -1; dcx <= 1; dcx++) {
    for (let dcz = -1; dcz <= 1; dcz++) {
      mondo.perOgniDelChunk((cx + dcx) + ',' + (cz + dcz), (x, y, z, tipo) => {
        const ix = x - x0, iy = y - y0, iz = z - z0;
        if (ix < 0 || ix >= nx || iy < 0 || iy >= ny || iz < 0 || iz >= nz) return;
        let t = indice.get(tipo);
        if (t === undefined) { t = tipi.push(tipo); indice.set(tipo, t); }
        celle[(ix * ny + iy) * nz + iz] = t;
      });
    }
  }
  const defs = {};
  for (const t of tipi) { const b = tipoBase(t); if (!(b in defs)) defs[b] = BLOCCHI[b] || null; }
  return {
    kc, livello, soloAcqua, x0, y0, z0, nx, ny, nz, celle, tipi, defs,
    stagione: stagione || { corrente: stagioneCorrente(), mescolanza: mescolanzaCorrente() },
  };
}

/** Un mondo di sola lettura sopra una fotografia: le tre domande che il mesher fa. */
export class MondoFoto {
  constructor(f) { Object.assign(this, f); }
  tipo(x, y, z) {
    const ix = x - this.x0, iy = y - this.y0, iz = z - this.z0;
    if (ix < 0 || ix >= this.nx || iy < 0 || iy >= this.ny || iz < 0 || iz >= this.nz) return null;
    const t = this.celle[(ix * this.ny + iy) * this.nz + iz];
    return t ? this.tipi[t - 1] : null;
  }
  pieno(x, y, z) { return this.tipo(x, y, z) !== null; }
  *blocchiDelChunk(kc) {
    const v = kc.indexOf(',');
    const cx = +kc.slice(0, v) * CHUNK, cz = +kc.slice(v + 1) * CHUNK;
    for (let x = cx; x < cx + CHUNK; x++) {
      for (let z = cz; z < cz + CHUNK; z++) {
        for (let y = this.y0; y < this.y0 + this.ny; y++) {
          const t = this.tipo(x, y, z);
          if (t) yield { x, y, z, tipo: t };
        }
      }
    }
  }
  perOgniDelChunk(kc, cb) { for (const b of this.blocchiDelChunk(kc)) cb(b.x, b.y, b.z, b.tipo); }
}

/**
 * Mette il modulo delle stagioni e il registro dei blocchi nello stato della
 * fotografia. Nel filo principale non cambia niente (sono già così); nel Worker
 * è l'unico modo di saperlo.
 * ⚠ `impostaMescolanza` e non `impostaStagione`: la seconda ritinge il
 * fogliame attraverso la fabbrica, che nel Worker non esiste.
 */
export function allineaAllaFoto(f) {
  const st = f.stagione;
  if (st) {
    if (st.mescolanza) impostaMescolanza(st.mescolanza.da, st.mescolanza.a, st.mescolanza.mix);
    else impostaMescolanza(st.corrente, st.corrente, 0);
  }
  for (const [id, def] of Object.entries(f.defs || {})) {
    if (def && !BLOCCHI[id]) registraBlocco(id, def);
  }
}

/** Da array JS a Float32Array, così viaggiano senza copia (trasferibili). */
export function impacchetta(r) {
  const f32 = (a) => (a && !(a instanceof Float32Array) ? new Float32Array(a) : a);
  const dati = (d) => (d ? { pos: f32(d.pos), col: f32(d.col), mat: f32(d.mat), acq: f32(d.acq), riv: f32(d.riv) } : d);
  const out = { ...r, acqua: dati(r.acqua) };
  if (r.solidi) out.solidi = dati(r.solidi);
  return out;
}

/** I buffer trasferibili di un risultato impacchettato. */
export function trasferibili(r) {
  const t = [];
  for (const d of [r.solidi, r.acqua]) {
    if (!d) continue;
    for (const a of [d.pos, d.col, d.mat, d.acq, d.riv]) if (a && a.buffer && !t.includes(a.buffer)) t.push(a.buffer);
  }
  return t;
}

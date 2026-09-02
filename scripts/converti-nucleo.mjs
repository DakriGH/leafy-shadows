// GLB → IL FORMATO DEI MODELLI DEL NUCLEO, una volta sola e fuori dal gioco.
//
// ⚠ Il nucleo non ha Babylon, quindi non legge glTF a runtime: qui si cuoce
// ogni modello in una lista di triangoli piatti — posizione, normale, colore —
// con la trasformazione dei nodi già applicata e il colore campionato dalla
// texture al centro di ogni triangolo. I modelli di Leafy sono a palette (una
// texture da 128×128 con zone di colore piatto), quindi un colore per
// triangolo È il colore del modello: nessuna texture in gioco.
//
//   modelli/nucleo/<nome>.bin
//   intestazione: 'LNM1' + uint32 triangoli
//   per vertice (16 byte): float32 x y z · int8 nx ny nz · uint8 materia · uint8 r g b · uint8 0
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { inflateSync } from 'node:zlib';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
const MODELLI = ['albero', 'lampione', 'ciuffo', 'panchina'];
/** Lo stesso schiarimento del gioco (`modelli.js`, `schiarisci: 1.6`). */
const SCHIARISCI = 1.6;
/** I triangoli più chiari del lampione sono la testa accesa: materia 1 = emissiva,
 *  e prendono il colore della LUCE del lampione (decorazioni.js: 0xffd889), non
 *  il verde della texture — di notte è la lampada che si vede, non il vetro. */
const SOGLIA_EMISSIVA = 0.6;
const COLORE_LAMPADA = [0xff / 255, 0xd8 / 255, 0x89 / 255];

// ── PNG (solo quello che serve: 8 bit, RGB/RGBA, non interlacciato) ─────────
function decodificaPng(buf) {
  if (buf.readUInt32BE(0) !== 0x89504e47) throw new Error('non è un PNG');
  let p = 8, w = 0, h = 0, tipo = 0, idat = [];
  while (p < buf.length) {
    const len = buf.readUInt32BE(p), nome = buf.toString('ascii', p + 4, p + 8), dati = buf.subarray(p + 8, p + 8 + len);
    if (nome === 'IHDR') { w = dati.readUInt32BE(0); h = dati.readUInt32BE(4); tipo = dati[9]; if (dati[8] !== 8 || dati[12] !== 0) throw new Error('PNG non gestito (bit/interlace)'); }
    else if (nome === 'IDAT') idat.push(dati);
    else if (nome === 'IEND') break;
    p += 12 + len;
  }
  const canali = tipo === 6 ? 4 : tipo === 2 ? 3 : tipo === 0 ? 1 : (() => { throw new Error(`PNG colorType ${tipo} non gestito`); })();
  const raw = inflateSync(Buffer.concat(idat));
  const riga = w * canali, out = new Uint8Array(w * h * 4);
  let prev = new Uint8Array(riga);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (riga + 1)], cur = new Uint8Array(raw.subarray(y * (riga + 1) + 1, y * (riga + 1) + 1 + riga));
    for (let i = 0; i < riga; i++) {
      const a = i >= canali ? cur[i - canali] : 0, b = prev[i], c = i >= canali ? prev[i - canali] : 0;
      let v = cur[i];
      if (f === 1) v += a; else if (f === 2) v += b; else if (f === 3) v += (a + b) >> 1;
      else if (f === 4) { const pp = a + b - c, pa = Math.abs(pp - a), pb = Math.abs(pp - b), pc = Math.abs(pp - c); v += (pa <= pb && pa <= pc) ? a : (pb <= pc ? b : c); }
      cur[i] = v & 255;
    }
    for (let x = 0; x < w; x++) {
      const o = (y * w + x) * 4;
      out[o] = cur[x * canali]; out[o + 1] = canali >= 3 ? cur[x * canali + 1] : cur[x * canali]; out[o + 2] = canali >= 3 ? cur[x * canali + 2] : cur[x * canali]; out[o + 3] = canali === 4 ? cur[x * canali + 3] : 255;
    }
    prev = cur;
  }
  return { w, h, dati: out };
}

// ── glTF binario ────────────────────────────────────────────────────────────
function leggiGlb(buf) {
  const jl = buf.readUInt32LE(12); const json = JSON.parse(buf.toString('utf8', 20, 20 + jl));
  const bl = buf.readUInt32LE(20 + jl); const bin = buf.subarray(28 + jl, 28 + jl + bl);
  return { json, bin };
}
function accessore(g, i) {
  const a = g.json.accessors[i], bv = g.json.bufferViews[a.bufferView];
  const n = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 }[a.type];
  const off = (bv.byteOffset || 0) + (a.byteOffset || 0);
  const Tipo = { 5126: Float32Array, 5123: Uint16Array, 5125: Uint32Array, 5121: Uint8Array }[a.componentType];
  const passo = bv.byteStride ? bv.byteStride / Tipo.BYTES_PER_ELEMENT : n;
  const src = new Tipo(g.bin.buffer, g.bin.byteOffset + off, passo * (a.count - 1) + n);
  const out = new Float64Array(a.count * n);
  for (let k = 0; k < a.count; k++) for (let c = 0; c < n; c++) out[k * n + c] = src[k * passo + c];
  return { dati: out, n, count: a.count };
}
// matrici 4×4 per colonne
function matTRS(t = [0, 0, 0], q = [0, 0, 0, 1], s = [1, 1, 1]) {
  const [x, y, z, w] = q;
  const m = [1 - 2 * (y * y + z * z), 2 * (x * y + z * w), 2 * (x * z - y * w), 0,
    2 * (x * y - z * w), 1 - 2 * (x * x + z * z), 2 * (y * z + x * w), 0,
    2 * (x * z + y * w), 2 * (y * z - x * w), 1 - 2 * (x * x + y * y), 0, t[0], t[1], t[2], 1];
  for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) m[c * 4 + r] *= s[c];
  return m;
}
function mul(a, b) { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; }
function trasf(m, p) { return [m[0] * p[0] + m[4] * p[1] + m[8] * p[2] + m[12], m[1] * p[0] + m[5] * p[1] + m[9] * p[2] + m[13], m[2] * p[0] + m[6] * p[1] + m[10] * p[2] + m[14]]; }
function trasfN(m, n) { const v = [m[0] * n[0] + m[4] * n[1] + m[8] * n[2], m[1] * n[0] + m[5] * n[1] + m[9] * n[2], m[2] * n[0] + m[6] * n[1] + m[10] * n[2]]; const l = Math.hypot(...v) || 1; return v.map((x) => x / l); }

function converti(nome) {
  const g = leggiGlb(readFileSync(join(radice, 'modelli', `${nome}.glb`)));
  const img = g.json.images && g.json.images[0];
  let tex = null;
  if (img && img.bufferView !== undefined) { const bv = g.json.bufferViews[img.bufferView]; tex = decodificaPng(Buffer.from(g.bin.subarray(bv.byteOffset || 0, (bv.byteOffset || 0) + bv.byteLength))); }
  const tri = [];   // [x,y,z,nx,ny,nz,r,g,b] × 3
  const visita = (ni, padre) => {
    const nd = g.json.nodes[ni];
    const m = nd.matrix ? mul(padre, nd.matrix) : mul(padre, matTRS(nd.translation, nd.rotation, nd.scale));
    if (nd.mesh !== undefined) {
      for (const p of g.json.meshes[nd.mesh].primitives) {
        const P = accessore(g, p.attributes.POSITION), N = p.attributes.NORMAL !== undefined ? accessore(g, p.attributes.NORMAL) : null;
        const UV = p.attributes.TEXCOORD_0 !== undefined ? accessore(g, p.attributes.TEXCOORD_0) : null;
        const I = p.indices !== undefined ? accessore(g, p.indices).dati : Float64Array.from({ length: P.count }, (_, i) => i);
        const mat = g.json.materials && g.json.materials[p.material || 0];
        const base = (mat && mat.pbrMetallicRoughness && mat.pbrMetallicRoughness.baseColorFactor) || [1, 1, 1, 1];
        for (let k = 0; k + 2 < I.length; k += 3) {
          const idx = [I[k], I[k + 1], I[k + 2]];
          // il colore: la texture al baricentro del triangolo (palette piatta), per il fattore base, schiarito come in gioco
          let col = [base[0], base[1], base[2]];
          if (tex && UV) {
            let u = 0, v = 0; for (const i of idx) { u += UV.dati[i * 2]; v += UV.dati[i * 2 + 1]; } u /= 3; v /= 3;
            const px = Math.min(tex.w - 1, Math.max(0, Math.floor((u - Math.floor(u)) * tex.w))), py = Math.min(tex.h - 1, Math.max(0, Math.floor((v - Math.floor(v)) * tex.h)));
            const o = (py * tex.w + px) * 4;
            if (tex.dati[o + 3] < 40) continue;   // ritaglio alfa: il triangolo non c'è
            col = [col[0] * tex.dati[o] / 255, col[1] * tex.dati[o + 1] / 255, col[2] * tex.dati[o + 2] / 255];
          }
          col = col.map((c) => Math.min(1, c * SCHIARISCI));
          const lum = 0.3 * col[0] + 0.59 * col[1] + 0.11 * col[2];
          const materia = (nome === 'lampione' && lum > SOGLIA_EMISSIVA) ? 1 : 0;
          if (materia === 1) col = COLORE_LAMPADA;
          const vs = idx.map((i) => {
            const pos = trasf(m, [P.dati[i * 3], P.dati[i * 3 + 1], P.dati[i * 3 + 2]]);
            const nrm = N ? trasfN(m, [N.dati[i * 3], N.dati[i * 3 + 1], N.dati[i * 3 + 2]]) : [0, 1, 0];
            return { pos, nrm };
          });
          tri.push({ vs, col, materia });
        }
      }
    }
    for (const c of nd.children || []) visita(c, m);
  }
  const scena = g.json.scenes[g.json.scene || 0];
  for (const n of scena.nodes) visita(n, matTRS());
  // ⚠ IL MODELLO SI APPOGGIA A TERRA: si trasla perché il punto più basso stia a y = 0
  let minY = Infinity, min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
  for (const t of tri) for (const v of t.vs) { for (let a = 0; a < 3; a++) { min[a] = Math.min(min[a], v.pos[a]); max[a] = Math.max(max[a], v.pos[a]); } minY = Math.min(minY, v.pos[1]); }
  const out = Buffer.alloc(8 + tri.length * 3 * 16);
  out.write('LNM1', 0, 'ascii'); out.writeUInt32LE(tri.length, 4);
  let o = 8;
  for (const t of tri) for (const v of t.vs) {
    out.writeFloatLE(v.pos[0], o); out.writeFloatLE(v.pos[1] - minY, o + 4); out.writeFloatLE(v.pos[2], o + 8);
    out.writeInt8(Math.round(v.nrm[0] * 127), o + 12); out.writeInt8(Math.round(v.nrm[1] * 127), o + 13); out.writeInt8(Math.round(v.nrm[2] * 127), o + 14);
    out.writeUInt8(t.materia, o + 15);
    o += 16;
  }
  // il colore dopo la normale nei 16 byte? no: i 16 byte sono pos(12) + n(3) + materia(1); il colore va in un secondo blocco
  const col = Buffer.alloc(tri.length * 3 * 4);
  let c = 0;
  for (const t of tri) for (let k = 0; k < 3; k++) { col[c] = Math.round(t.col[0] * 255); col[c + 1] = Math.round(t.col[1] * 255); col[c + 2] = Math.round(t.col[2] * 255); col[c + 3] = 0; c += 4; }
  mkdirSync(join(radice, 'modelli', 'nucleo'), { recursive: true });
  writeFileSync(join(radice, 'modelli', 'nucleo', `${nome}.bin`), Buffer.concat([out, col]));
  console.log(`${nome}: ${tri.length} triangoli, ingombro x ${(max[0] - min[0]).toFixed(2)} y ${(max[1] - min[1]).toFixed(2)} z ${(max[2] - min[2]).toFixed(2)}, base y ${minY.toFixed(2)}, ${(out.length + col.length) / 1024 | 0} KB`);
}
for (const n of (process.argv[2] ? [process.argv[2]] : MODELLI)) converti(n);

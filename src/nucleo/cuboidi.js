// LE FORME — modelli fatti di scatole, piramidi e SOLIDI TORNITI, scritti a
// mano o dall'Officina, nel formato dei modelli del nucleo (20 byte per vertice).
//
// È lo stampo di Blockbench, in piccolo: un modello è una lista di PEZZI:
//   · scatola   `{ da: [x,y,z], a: [x,y,z], colore }`
//   · piramide  `{ piramide: true, da, a, punta: [x,y,z], colore }` (base a y = da[1])
//   · tornio    `{ tornio: [[raggio, y], …], x, z, lati: 8, colore }` — un
//               profilo (raggio per quota) fatto girare attorno a Y: teste,
//               corpi, cappelli dei funghi, coni, anelli. A otto lati e con la
//               luce piatta esce SFACCETTATO, che è il look delle concept art.
// Tutti accettano `materia`, `scala: [sx,sy,sz]`, `rot: [rx,ry,rz]` (radianti,
// attorno a X poi Y poi Z) o `giro` (solo Y), `perno` (di fabbrica il centro).
// Le coordinate sono in blocchi con l'origine ai piedi (y = 0 a terra), la
// faccia «davanti» guarda −Z (come guarda il giocatore con alpha = 0).
//
// ⚠ NIENTE GL, NIENTE DOM: torna byte. Si prova in Node. Il colore è piatto
// per pezzo, come tutto Leafy: niente texture, la luce la fa lo shader a
// gradini.

const FACCE = [   // [normale, quattro angoli (0/1 su ciascun asse) in senso antiorario visti da fuori]
  [[0, 0, 1], [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]],
  [[0, 0, -1], [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]]],
  [[1, 0, 0], [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]]],
  [[-1, 0, 0], [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
  [[0, 1, 0], [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]]],
  [[0, -1, 0], [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
];

/** La trasformazione di un pezzo: scala, poi rotazioni X Y Z attorno al perno. */
function trasformazione(p, centro) {
  const perno = p.perno || centro;
  const sc = p.scala || [1, 1, 1];
  const rot = p.rot || [0, p.giro || 0, 0];
  const [cx, sx] = [Math.cos(rot[0]), Math.sin(rot[0])], [cy, sy] = [Math.cos(rot[1]), Math.sin(rot[1])], [cz, sz] = [Math.cos(rot[2]), Math.sin(rot[2])];
  const gira = (x, y, z) => {
    let y1 = y * cx - z * sx, z1 = y * sx + z * cx; y = y1; z = z1;                 // X
    let x1 = x * cy + z * sy; z1 = -x * sy + z * cy; x = x1; z = z1;               // Y
    x1 = x * cz - y * sz; y1 = x * sz + y * cz; x = x1; y = y1;                     // Z
    return [x, y, z];
  };
  return {
    punto: (v) => { const [x, y, z] = gira((v[0] - perno[0]) * sc[0], (v[1] - perno[1]) * sc[1], (v[2] - perno[2]) * sc[2]); return [x + perno[0], y + perno[1], z + perno[2]]; },
    normale: (n) => { const [x, y, z] = gira(n[0] / sc[0], n[1] / sc[1], n[2] / sc[2]); const l = Math.hypot(x, y, z) || 1; return [x / l, y / l, z / l]; },
  };
}

/** Costruisce il modello: `{ byte, vertici, triangoli, minY, maxY, raggio }` come `leggiModello`. */
export function modelloDaCuboidi(pezzi) {
  const tri = [];   // [ [p0,p1,p2], normale, colore, materia ]
  const metti = (a, b, c, n, col, mat) => tri.push([[a, b, c], n, col, mat]);
  for (const p of pezzi) {
    const col = p.colore ?? 0xffffff, mat = p.materia | 0;
    if (p.tornio) {
      const lati = p.lati || 8, prof = p.tornio, x0 = p.x || 0, z0 = p.z || 0;
      const yMin = Math.min(...prof.map((q) => q[1])), yMax = Math.max(...prof.map((q) => q[1]));
      const T = trasformazione(p, [x0, (yMin + yMax) / 2, z0]);
      const anello = (r, y) => { const a = []; for (let i = 0; i < lati; i++) { const t = (i / lati) * Math.PI * 2 + (p.fase || 0); a.push([x0 + Math.cos(t) * r, y, z0 + Math.sin(t) * r]); } return a; };
      const anelli = prof.map(([r, y]) => anello(r, y));
      for (let k = 0; k + 1 < prof.length; k++) {
        const A = anelli[k], B = anelli[k + 1];
        for (let i = 0; i < lati; i++) {
          const j = (i + 1) % lati;
          const a = A[i], b = A[j], c = B[j], d = B[i];
          if (prof[k][0] === 0 && prof[k + 1][0] === 0) continue;
          const n = normaleDi(a, b, c, d);
          if (prof[k][0] > 0 && prof[k + 1][0] > 0) { metti(a, b, c, n, col, mat); metti(a, c, d, n, col, mat); }
          else if (prof[k][0] > 0) metti(a, b, c, normaleDi(a, b, c), col, mat);       // verso una punta in alto
          else metti(a, c, d, normaleDi(a, c, d), col, mat);                             // da una punta in basso
        }
      }
      // i tappi: il fondo (se il primo raggio non è zero) e la cima
      if (prof[0][0] > 0 && !p.aperto) { const A = anelli[0]; for (let i = 1; i + 1 < lati; i++) metti(A[0], A[i + 1], A[i], [0, -1, 0], col, mat); }
      if (prof[prof.length - 1][0] > 0 && !p.aperto) { const A = anelli[prof.length - 1]; for (let i = 1; i + 1 < lati; i++) metti(A[0], A[i], A[i + 1], [0, 1, 0], col, mat); }
      applica(tri, T);
      continue;
    }
    const centro = [(p.da[0] + p.a[0]) / 2, (p.da[1] + p.a[1]) / 2, (p.da[2] + p.a[2]) / 2];
    const T = trasformazione(p, centro);
    if (p.piramide) {
      const b = [[p.da[0], p.da[1], p.da[2]], [p.a[0], p.da[1], p.da[2]], [p.a[0], p.da[1], p.a[2]], [p.da[0], p.da[1], p.a[2]]];
      const v = p.punta;
      for (let i = 0; i < 4; i++) { const a = b[i], c = b[(i + 1) % 4]; metti(a, v, c, normaleDi(a, v, c), col, mat); }
      metti(b[0], b[1], b[2], [0, -1, 0], col, mat); metti(b[0], b[2], b[3], [0, -1, 0], col, mat);
      applica(tri, T);
      continue;
    }
    const ang = (k) => [k[0] ? p.a[0] : p.da[0], k[1] ? p.a[1] : p.da[1], k[2] ? p.a[2] : p.da[2]];
    for (const [n, k] of FACCE) {
      const asse = n[0] ? 0 : n[1] ? 1 : 2;
      if (p.a[asse] === p.da[asse]) continue;
      const q = k.map(ang);
      metti(q[0], q[1], q[2], n, col, mat); metti(q[0], q[2], q[3], n, col, mat);
    }
    applica(tri, T);
  }
  const n = tri.length * 3, out = new Uint8Array(n * 20), dv = new DataView(out.buffer);
  let i = 0, minY = Infinity, maxY = -Infinity, raggio = 0;
  for (const [pts, nn, col, mat] of tri) {
    for (const v of pts) {
      const o = i * 20;
      dv.setFloat32(o, v[0], true); dv.setFloat32(o + 4, v[1], true); dv.setFloat32(o + 8, v[2], true);
      out[o + 12] = Math.round(nn[0] * 127) & 255; out[o + 13] = Math.round(nn[1] * 127) & 255; out[o + 14] = Math.round(nn[2] * 127) & 255; out[o + 15] = mat;
      out[o + 16] = (col >> 16) & 255; out[o + 17] = (col >> 8) & 255; out[o + 18] = col & 255; out[o + 19] = 255;
      minY = Math.min(minY, v[1]); maxY = Math.max(maxY, v[1]); raggio = Math.max(raggio, Math.hypot(v[0], v[2]));
      i++;
    }
  }
  return { byte: out, vertici: n, triangoli: tri.length, minY, maxY, raggio };
}

/** Applica la trasformazione del pezzo ai suoi triangoli (gli ultimi, non ancora trasformati). */
function applica(tri, T) {
  for (let q = tri.length - 1; q >= 0; q--) {
    const t = tri[q];
    if (t[4]) break;
    t[0] = t[0].map(T.punto); t[1] = T.normale(t[1]); t[4] = true;
  }
}

function normaleDi(a, b, c, d = null) {
  // per un quad si usano le diagonali: robusto anche se non è perfettamente piano
  const p = d ? [c[0] - a[0], c[1] - a[1], c[2] - a[2]] : [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
  const q = d ? [d[0] - b[0], d[1] - b[1], d[2] - b[2]] : [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
  const nx = p[1] * q[2] - p[2] * q[1], ny = p[2] * q[0] - p[0] * q[2], nz = p[0] * q[1] - p[1] * q[0], l = Math.hypot(nx, ny, nz) || 1;
  return [nx / l, ny / l, nz / l];
}

/** Una scatola centrata in (x, z) larga `w`, alta `h`, profonda `d`, da `y0`. */
export const scatola = (x, y0, z, w, h, d, colore, extra = {}) => ({ da: [x - w / 2, y0, z - d / 2], a: [x + w / 2, y0 + h, z + d / 2], colore, ...extra });
/** Una piramide a base quadrata centrata in (x, z), base `w`, alta `h`, con la punta spostata di (px, pz). */
export const piramide = (x, y0, z, w, h, colore, px = 0, pz = 0, extra = {}) => ({ piramide: true, da: [x - w / 2, y0, z - w / 2], a: [x + w / 2, y0, z + w / 2], punta: [x + px, y0 + h, z + pz], colore, ...extra });
/** Un solido tornito in (x, z): `profilo` = [[raggio, y], …] dal basso all'alto. */
export const tornio = (x, z, profilo, colore, extra = {}) => ({ tornio: profilo, x, z, lati: 8, colore, ...extra });

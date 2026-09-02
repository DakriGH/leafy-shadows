// I CUBOIDI — modelli fatti di scatole (e piramidi), scritti a mano o
// dall'Officina, nel formato dei modelli del nucleo (20 byte per vertice).
//
// È lo stampo di Blockbench, in piccolo: un modello è una lista di PEZZI, ogni
// pezzo una scatola `{ da: [x,y,z], a: [x,y,z], colore, materia?, giro?,
// perno? }` o una piramide `{ piramide: true, da, a, punta: [x,y,z], colore }`.
// Le coordinate sono in blocchi con l'origine ai piedi (y = 0 a terra), la
// faccia «davanti» guarda −Z (come guarda il giocatore con alpha = 0).
//
// ⚠ NIENTE GL, NIENTE DOM: torna byte. Si prova in Node. Il colore è piatto
// per pezzo, come tutto Leafy: niente texture, la luce la fa lo shader a
// gradini. Con `giro` (radianti, attorno a Y sul `perno`, di fabbrica il
// centro della scatola) si inclinano code, manici, bastoni.

const FACCE = [   // [normale, quattro angoli (0/1 su ciascun asse) in senso antiorario visti da fuori]
  [[0, 0, 1], [[0, 0, 1], [1, 0, 1], [1, 1, 1], [0, 1, 1]]],
  [[0, 0, -1], [[1, 0, 0], [0, 0, 0], [0, 1, 0], [1, 1, 0]]],
  [[1, 0, 0], [[1, 0, 1], [1, 0, 0], [1, 1, 0], [1, 1, 1]]],
  [[-1, 0, 0], [[0, 0, 0], [0, 0, 1], [0, 1, 1], [0, 1, 0]]],
  [[0, 1, 0], [[0, 1, 1], [1, 1, 1], [1, 1, 0], [0, 1, 0]]],
  [[0, -1, 0], [[0, 0, 0], [1, 0, 0], [1, 0, 1], [0, 0, 1]]],
];

/** Costruisce il modello: `{ byte, vertici, triangoli, minY, maxY, raggio }` come `leggiModello`. */
export function modelloDaCuboidi(pezzi) {
  const tri = [];   // [ [p0,p1,p2], normale, colore, materia ]
  for (const p of pezzi) {
    const col = p.colore ?? 0xffffff, mat = p.materia | 0;
    const giro = p.giro || 0;
    const perno = p.perno || [(p.da[0] + p.a[0]) / 2, (p.da[1] + p.a[1]) / 2, (p.da[2] + p.a[2]) / 2];
    const ruota = (v) => {
      if (!giro) return v;
      const c = Math.cos(giro), s = Math.sin(giro), x = v[0] - perno[0], z = v[2] - perno[2];
      return [perno[0] + x * c - z * s, v[1], perno[2] + x * s + z * c];
    };
    const ruotaN = (n) => { if (!giro) return n; const c = Math.cos(giro), s = Math.sin(giro); return [n[0] * c - n[2] * s, n[1], n[0] * s + n[2] * c]; };
    const ang = (k) => ruota([k[0] ? p.a[0] : p.da[0], k[1] ? p.a[1] : p.da[1], k[2] ? p.a[2] : p.da[2]]);
    if (p.piramide) {
      // base a y = da[1] (quattro angoli), punta in `punta`: quattro triangoli laterali e il fondo
      const b = [[p.da[0], p.da[1], p.da[2]], [p.a[0], p.da[1], p.da[2]], [p.a[0], p.da[1], p.a[2]], [p.da[0], p.da[1], p.a[2]]].map(ruota);
      const v = ruota(p.punta);
      for (let i = 0; i < 4; i++) {
        const a = b[i], c = b[(i + 1) % 4];
        tri.push([[a, v, c], normale(a, v, c), col, mat]);
      }
      tri.push([[b[0], b[1], b[2]], [0, -1, 0], col, mat]); tri.push([[b[0], b[2], b[3]], [0, -1, 0], col, mat]);
      continue;
    }
    for (const [n, k] of FACCE) {
      // una faccia piatta (lato zero) non si emette
      const asse = n[0] ? 0 : n[1] ? 1 : 2;
      if (p.a[asse] === p.da[asse]) continue;
      const q = k.map(ang), nn = ruotaN(n);
      tri.push([[q[0], q[1], q[2]], nn, col, mat]); tri.push([[q[0], q[2], q[3]], nn, col, mat]);
    }
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

function normale(a, b, c) {
  const ux = b[0] - a[0], uy = b[1] - a[1], uz = b[2] - a[2], vx = c[0] - a[0], vy = c[1] - a[1], vz = c[2] - a[2];
  const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx, l = Math.hypot(nx, ny, nz) || 1;
  return [nx / l, ny / l, nz / l];
}

/** Una scatola centrata in (x, z) larga `w`, profonda `d`, da `y0` a `y1`. */
export const scatola = (x, y0, z, w, h, d, colore, extra = {}) => ({ da: [x - w / 2, y0, z - d / 2], a: [x + w / 2, y0 + h, z + d / 2], colore, ...extra });
/** Una piramide a base quadrata centrata in (x, z), base `w`, alta `h`, con la punta spostata di (px, pz). */
export const piramide = (x, y0, z, w, h, colore, px = 0, pz = 0, extra = {}) => ({ piramide: true, da: [x - w / 2, y0, z - w / 2], a: [x + w / 2, y0, z + w / 2], punta: [x + px, y0 + h, z + pz], colore, ...extra });

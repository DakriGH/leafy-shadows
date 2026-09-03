// LE QUATTRO OPERAZIONI DI MATRICE CHE SERVONO, e basta. Colonne come le vuole
// WebGL (m[12..14] è la traslazione). Nessuna dipendenza: gira in Node.
export function prospettiva(fovY, rapporto, vicino, lontano) {
  const f = 1 / Math.tan(fovY / 2), nf = 1 / (vicino - lontano);
  return new Float32Array([f / rapporto, 0, 0, 0, 0, f, 0, 0, 0, 0, (lontano + vicino) * nf, -1, 0, 0, 2 * lontano * vicino * nf, 0]);
}
/** L'ortografica quadrata del sole: ±raggio in x e y, profondità da vicino a lontano. */
export function ortografica(raggio, vicino, lontano) {
  const d = 1 / (lontano - vicino);
  return new Float32Array([1 / raggio, 0, 0, 0, 0, 1 / raggio, 0, 0, 0, 0, -2 * d, 0, 0, 0, -(lontano + vicino) * d, 1]);
}
export function guarda(occhio, centro, su = [0, 1, 0]) {
  let zx = occhio[0] - centro[0], zy = occhio[1] - centro[1], zz = occhio[2] - centro[2];
  let l = Math.hypot(zx, zy, zz) || 1; zx /= l; zy /= l; zz /= l;
  let xx = su[1] * zz - su[2] * zy, xy = su[2] * zx - su[0] * zz, xz = su[0] * zy - su[1] * zx;
  l = Math.hypot(xx, xy, xz) || 1; xx /= l; xy /= l; xz /= l;
  const yx = zy * xz - zz * xy, yy = zz * xx - zx * xz, yz = zx * xy - zy * xx;
  return new Float32Array([xx, yx, zx, 0, xy, yy, zy, 0, xz, yz, zz, 0,
    -(xx * occhio[0] + xy * occhio[1] + xz * occhio[2]), -(yx * occhio[0] + yy * occhio[1] + yz * occhio[2]), -(zx * occhio[0] + zy * occhio[1] + zz * occhio[2]), 1]);
}
export function moltiplica(a, b, out = new Float32Array(16)) {
  for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) {
    out[c * 4 + r] = a[r] * b[c * 4] + a[4 + r] * b[c * 4 + 1] + a[8 + r] * b[c * 4 + 2] + a[12 + r] * b[c * 4 + 3];
  }
  return out;
}
/** I sei piani del frustum da una matrice vista-proiezione (Gribb–Hartmann), normalizzati. */
export function pianiFrustum(m, out = new Float32Array(24)) {
  const riga = (i) => [m[i], m[4 + i], m[8 + i], m[12 + i]];
  const r0 = riga(0), r1 = riga(1), r2 = riga(2), r3 = riga(3);
  const piani = [
    [r3[0] + r0[0], r3[1] + r0[1], r3[2] + r0[2], r3[3] + r0[3]],
    [r3[0] - r0[0], r3[1] - r0[1], r3[2] - r0[2], r3[3] - r0[3]],
    [r3[0] + r1[0], r3[1] + r1[1], r3[2] + r1[2], r3[3] + r1[3]],
    [r3[0] - r1[0], r3[1] - r1[1], r3[2] - r1[2], r3[3] - r1[3]],
    [r3[0] + r2[0], r3[1] + r2[1], r3[2] + r2[2], r3[3] + r2[3]],
    [r3[0] - r2[0], r3[1] - r2[1], r3[2] - r2[2], r3[3] - r2[3]],
  ];
  for (let i = 0; i < 6; i++) {
    const [a, b, c, d] = piani[i]; const l = Math.hypot(a, b, c) || 1;
    out[i * 4] = a / l; out[i * 4 + 1] = b / l; out[i * 4 + 2] = c / l; out[i * 4 + 3] = d / l;
  }
  return out;
}
/** Una scatola (min, max) è almeno in parte dentro il frustum? */
export function scatolaNelFrustum(piani, minX, minY, minZ, maxX, maxY, maxZ) {
  for (let i = 0; i < 6; i++) {
    const a = piani[i * 4], b = piani[i * 4 + 1], c = piani[i * 4 + 2], d = piani[i * 4 + 3];
    const px = a > 0 ? maxX : minX, py = b > 0 ? maxY : minY, pz = c > 0 ? maxZ : minZ;
    if (a * px + b * py + c * pz + d < 0) return false;
  }
  return true;
}

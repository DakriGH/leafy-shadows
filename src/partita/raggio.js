// IL RAGGIO DELLA MIRA DA UN PUNTO DELLO SCHERMO — aritmetica pura, provata in Node.
//
// ⚠ LA DESTRA È `avanti × su`, NON `su × avanti`: con la formula girata il
// puntatore era SPECCHIATO in orizzontale («non riesco a puntare ad alcun
// blocco»), e al centro dello schermo, dove miravano le prove, non si vedeva.
// Mano destra, Y in su, guardando −Z la destra è +X: il test lo pretende.

/**
 * @param occhio   [x, y, z] della camera
 * @param centro   [x, y, z] dove guarda
 * @param fov      verticale, radianti
 * @param rapporto larghezza / altezza
 * @param nx, ny   punto dello schermo in [-1, 1] (destra e alto positivi)
 * @returns {x, y, z} versore
 */
export function raggioDaSchermo(occhio, centro, fov, rapporto, nx = 0, ny = 0) {
  const f = [centro[0] - occhio[0], centro[1] - occhio[1], centro[2] - occhio[2]];
  const fl = Math.hypot(...f) || 1; f[0] /= fl; f[1] /= fl; f[2] /= fl;
  const r = [-f[2], 0, f[0]]; const rl = Math.hypot(...r) || 1; r[0] /= rl; r[2] /= rl;   // destra = f × su
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];   // su = destra × f
  const t = Math.tan(fov / 2), sx = nx * t * rapporto, sy = ny * t;
  const d = [f[0] + r[0] * sx + u[0] * sy, f[1] + r[1] * sx + u[1] * sy, f[2] + r[2] * sx + u[2] * sy];
  const dl = Math.hypot(...d) || 1;
  return { x: d[0] / dl, y: d[1] / dl, z: d[2] / dl };
}

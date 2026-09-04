// IL SUPERCUBO DI LEAFY — la geometria di un blocco, quella delle concept art.
//
// ⚠ NON È UN VOXEL: il corpo sta a ±9/16 (18 px su una griglia da 16), quindi
// due blocchi vicini si SOVRAPPONGONO di 2 px e la cucitura non esiste; gli
// smussi vanno da 8 a 9 px; il blocco col CAPPELLO (l'erba) ha il corpo a 9,
// un bordino (brim) che sborda a 10 px con sotto-smusso e smusso alto, e la
// cima A FILO cella a +8, così le cime si affiancano al pixel. Il profilo è
// ricavato dal GrassCell.fbx del committente (SPEC-TECNICA §1).
//
// ⚠ STA IN UN FILE SUO PERCHÉ LO USANO DUE MESHER: quello del gioco di oggi
// (`world/mesher.js`) e quello del nucleo (`nucleo/mesher-nucleo.js`). La
// firma è la stessa per tutti e due: un costruttore con `quad(a,b,c,d,colore,
// fuori)` e `tri(a,b,c,colore,fuori)`, il centro della cella, la palette, e
// `vicino(dx,dy,dz)` che dice se di là c'è un solido che occlude. Niente
// motore, niente stato: gira in Node.
import { coloreFaccia } from './stagioni.js';
import { tingiMateria } from './materie.js';

export const U = 1 / 16;                 // 1 pixel in unità mondo
export const COPPIE_SMUSSO = [[0, 1], [0, 2], [1, 2]];
export const LATI = [[1, 0], [-1, 0], [0, 1], [0, -1]];

function vec(cx, cy, cz, a, va, b, vb, c, vc) {
  const p = [cx, cy, cz];
  p[a] += va; p[b] += vb; p[c] += vc;
  return p;
}

// ---- supercubo classico (26 pezzi) -----------------------------------------

/**
 * @param orlo quanto SCHIARIRE i venti pezzi smussati (0 = come le facce).
 *
 * ⚠ L'ORLO SOSTITUISCE UNA DISTINZIONE CHE C'ERA GIÀ, e questo è l'argomento
 * che lo separa dal chiaroscuro cotto che il committente ha bocciato. Oggi lo
 * smusso sceglie il colore con `cima ? pal.cima : (fondo ? pal.fondo : pal.lato)`,
 * cioè TRE classi per orientamento. L'orlo le rimpiazza con UNA voce sola per
 * tutti e venti i pezzi: dopo l'orlo gli smussi sono PIÙ isotropi di adesso,
 * non meno. Resta un argomento, e va guardato a schermo prima di crederci.
 */
/** ⚠ L'ORLO SCHIARISCE E BASTA: la tinta e la saturazione della materia sono
 *  GIÀ dentro `pal` (le ha applicate `costruisciBlocco`). Ripassarci la materia
 *  vera le applicherebbe DUE VOLTE — un metallo grigio-ferro diventerebbe
 *  carbone, e solo sugli smussi. Questa riga finta ha tinta e saturazione
 *  neutre apposta: fa solo lo `schiarisci`. */
const ORLO_PIATTO = { tinta: 1, satura: 1 };

export function supercubo(b, cx, cy, cz, pal, vicino, orlo = 0) {
  const F = 8 * U, H = 9 * U;
  const N = (asse, s) => vicino(asse === 0 ? s : 0, asse === 1 ? s : 0, asse === 2 ? s : 0);

  for (let a = 0; a < 3; a++) {
    for (const s of [-1, 1]) {
      if (N(a, s)) continue;
      const bA = (a + 1) % 3, cA = (a + 2) % 3;
      // pittura PER FACCIA se il blocco ce l'ha, altrimenti cima/lato/fondo
      const colore = coloreFaccia(pal, a, s);
      const fuori = [0, 0, 0]; fuori[a] = s;
      b.quad(
        vec(cx, cy, cz, a, s * H, bA, -F, cA, -F),
        vec(cx, cy, cz, a, s * H, bA, +F, cA, -F),
        vec(cx, cy, cz, a, s * H, bA, +F, cA, +F),
        vec(cx, cy, cz, a, s * H, bA, -F, cA, +F),
        colore, fuori,
      );
    }
  }
  for (const [a, bAsse] of COPPIE_SMUSSO) {
    const t = 3 - a - bAsse;
    for (const sa of [-1, 1]) for (const sb of [-1, 1]) {
      if (N(a, sa) || N(bAsse, sb)) continue;
      const cima = (a === 1 && sa > 0) || (bAsse === 1 && sb > 0);
      const fondo = (a === 1 && sa < 0) || (bAsse === 1 && sb < 0);
      const base = cima ? pal.cima : (fondo ? pal.fondo : pal.lato);
      const colore = orlo ? tingiMateria(base, ORLO_PIATTO, orlo) : base;
      const fuori = [0, 0, 0]; fuori[a] = sa; fuori[bAsse] = sb;
      b.quad(
        vec(cx, cy, cz, a, sa * H, bAsse, sb * F, t, -F),
        vec(cx, cy, cz, a, sa * F, bAsse, sb * H, t, -F),
        vec(cx, cy, cz, a, sa * F, bAsse, sb * H, t, +F),
        vec(cx, cy, cz, a, sa * H, bAsse, sb * F, t, +F),
        colore, fuori,
      );
    }
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    if (N(0, sx) || N(1, sy) || N(2, sz)) continue;
    b.tri(
      [cx + sx * H, cy + sy * F, cz + sz * F],
      [cx + sx * F, cy + sy * H, cz + sz * F],
      [cx + sx * F, cy + sy * F, cz + sz * H],
      orlo ? tingiMateria(sy > 0 ? pal.cima : pal.fondo, ORLO_PIATTO, orlo)
           : (sy > 0 ? pal.cima : pal.fondo), [sx, sy, sz],
    );
  }
}

// ---- blocco col cappello (profilo GrassCell, quote in px dal centro cella) --
//   corpo: fondo −9 (metà 8) · smusso · parete ±9 da −8 a +2 · taglio d'angolo
//   cappello: sotto-smusso (9,+2)→(10,+3) · brim ±10 da +3 a +7 ·
//             smusso alto (10,+7)→(9,+8) · estensione piatta a +8 (8→9) · cima ±8 a +8

export function conCappello(b, cx, cy, cz, pal, vicino) {
  const Nh = (dx, dz) => vicino(dx, 0, dz);
  const sotto = vicino(0, -1, 0);
  // ⚠ L'ORLO (il brim, la fascia verde sul fianco) HA UN COLORE SUO: nelle concept è verde cupo (#34974c) sotto la cima piena (#5ac550)
  const cima = pal.cima, lato = pal.lato, fondo = pal.fondo, orlo = pal.orlo ?? pal.cima;
  const p = (x, y, z) => [cx + x * U, cy + y * U, cz + z * U];

  // fondo e smussi bassi (come il supercubo)
  if (!sotto) {
    b.quad(p(-8, -9, -8), p(8, -9, -8), p(8, -9, 8), p(-8, -9, 8), fondo, [0, -1, 0]);
  }
  for (const [dx, dz] of LATI) {
    if (Nh(dx, dz)) continue;
    const tx = -dz, tz = dx;                       // tangente
    const q = (u, y, t) => p(u * dx + t * tx, y, u * dz + t * tz);
    const fuori = [dx, 0, dz];
    if (!sotto) b.quad(q(8, -9, -8), q(9, -8, -8), q(9, -8, 8), q(8, -9, 8), fondo, [dx, -1, dz]);
    b.quad(q(9, -8, -8), q(9, 2, -8), q(9, 2, 8), q(9, -8, 8), lato, fuori);      // parete corpo
    b.quad(q(9, 2, -8), q(10, 3, -8), q(10, 3, 8), q(9, 2, 8), orlo, fuori);      // sotto-smusso brim
    b.quad(q(10, 3, -8), q(10, 7, -8), q(10, 7, 8), q(10, 3, 8), orlo, fuori);    // parete brim
    b.quad(q(10, 7, -8), q(9, 8, -8), q(9, 8, 8), q(10, 7, 8), cima, [dx, 1, dz]); // smusso alto
    b.quad(q(8, 8, -8), q(9, 8, -8), q(9, 8, 8), q(8, 8, 8), cima, [0, 1, 0]);    // estensione cima
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    if (Nh(sx, 0) || Nh(0, sz)) continue;
    const q = (x, y, z) => p(x * sx, y, z * sz);
    const fuori = [sx, 0, sz];
    if (!sotto) b.tri(q(9, -8, 8), q(8, -9, 8), q(8, -8, 9), fondo, [sx, -1, sz]); // angolo basso
    b.quad(q(9, -8, 8), q(8, -8, 9), q(8, 2, 9), q(9, 2, 8), lato, fuori);         // taglio verticale corpo
    b.quad(q(9, 2, 8), q(8, 2, 9), q(8, 3, 10), q(10, 3, 8), orlo, fuori);         // angolo sotto-smusso
    b.quad(q(10, 3, 8), q(8, 3, 10), q(8, 7, 10), q(10, 7, 8), orlo, fuori);       // angolo brim
    b.quad(q(10, 7, 8), q(8, 7, 10), q(8, 8, 9), q(9, 8, 8), cima, [sx, 1, sz]);   // angolo smusso alto
    b.tri(q(8, 8, 8), q(9, 8, 8), q(8, 8, 9), cima, [0, 1, 0]);                    // angolo estensione
  }
  // cima centrale (il ramo cappello esiste solo se sopra c'è aria)
  b.quad(p(-8, 8, -8), p(8, 8, -8), p(8, 8, 8), p(-8, 8, 8), cima, [0, 1, 0]);
}

// ---- acqua: scatola A FILO CELLA (16 px), pelo che scende col livello --------
// A 18 px le cime di celle d'acqua adiacenti si sovrapponevano di 2 px e la
// doppia trasparenza disegnava una griglia scura. A 16 px combaciano al pixel
// e restano comunque sigillate: i corpi dei solidi vicini (18 px) le coprono.
// Il pelo: sorgente +7 px, flussi più bassi (7 − 2·livello) → rivoli e cascate.

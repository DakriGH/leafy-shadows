// LA VETRINA — la concept art ricostruita nel nero, per guardare i COLORI.
//
// Il committente: «ricreare la concept art in uno spazio totalmente nero così
// capisci bene cosa c'è da sistemare a livello cromatico». Un'isola sospesa
// di supercubi (erba sopra, terra ai fianchi) a due gradini, una pozza,
// un albero, un lampione, i gatti, i funghi, gli attrezzi, i ciuffi. Niente
// cielo, niente nebbia: solo la palette e la luce, su nero.
//
// ⚠ NIENTE DOM, NIENTE GL: si prova in Node (test/vetrina.test.mjs).
import { CHUNK } from '../world/world.js';

export const QUOTA = 12;   // ⚠ A QUOTA 12 LA RAMPA DELL'ERBA DÀ #5ac650, il verde pieno delle concept (a 8 dava il passo scuro)

/** L'isola: [x0, x1, z0, z1, quota] per gradino (estremi inclusi). */
const GRADINI = [
  [-7, 6, -5, 4, QUOTA],          // il piano basso
  [-3, 4, -4, 0, QUOTA + 1],      // il gradino alto, in fondo
];
const POZZA = [1, 3, 2, 3];       // x0, x1, z0, z1 sul piano basso

function dentro(x, z, [x0, x1, z0, z1]) { return x >= x0 && x <= x1 && z >= z0 && z <= z1; }

/** Genera il chunk (cx, cz) della vetrina; torna le decorazioni non silenziose da posare. */
export function generaChunkVetrina(mondo, cx, cz) {
  const decorazioni = [];
  const x0 = cx * CHUNK, z0 = cz * CHUNK;
  for (let x = x0; x < x0 + CHUNK; x++) for (let z = z0; z < z0 + CHUNK; z++) {
    let cima = -1;
    for (const g of GRADINI) if (dentro(x, z, g)) cima = Math.max(cima, g[4]);
    if (cima < 0) continue;
    // ⚠ TRE DI TERRA SOTTO L'ERBA: i fianchi terracotta sono metà della palette
    for (let y = cima - 3; y < cima; y++) mondo.metti(x, y, z, 'terra', true);
    if (dentro(x, z, POZZA)) { mondo.metti(x, cima - 1, z, 'acqua', true); mondo.metti(x, cima, z, 'acqua', true); continue; }
    mondo.metti(x, cima, z, 'erba', true);
  }
  // le cose, ognuna nel suo chunk (si posano non silenziose: sono modelli)
  const cose = [
    [-5, QUOTA + 1, -3, 'albero'],
    [4, QUOTA + 1, 0, 'lampione'],
    [-1, QUOTA + 2, -2, 'gatto'],
    [-2, QUOTA + 1, 2, 'fungo'],
    [-3, QUOTA + 1, 3, 'fungo'],
    [5, QUOTA + 1, 3, 'canna'],
    [-6, QUOTA + 1, 2, 'retino'],
    [0, QUOTA + 1, 4, 'cazzuola'],
  ];
  for (const c of cose) if (c[0] >= x0 && c[0] < x0 + CHUNK && c[2] >= z0 && c[2] < z0 + CHUNK) decorazioni.push(c);
  return decorazioni;
}

// LO ZOO — la scena di prova: un piano con tutto quello che va guardato.
//
// «Un zoo dove testiamo tutto: ombre dinamiche, luce colorata cotta e
// dinamica, materiali PBR emulati, acqua, fisica…». È un GENERATORE come
// quello dell'open world (per chunk, così passa dalla stessa frontiera e
// dallo stesso streaming): un piano d'erba 64×64 a quota 4, la vasca
// d'acqua, la scalinata di pietra, il muro dei materiali (una colonna per
// blocco della cassetta), il viale dei lampioni, le lampade colorate, gli
// arredi in fila. Fuori dal piano non c'è niente.
//
// ⚠ NIENTE DOM: torna le decorazioni come `generaChunkOpenWorld`. Si prova in Node.
import { CHUNK } from '../world/world.js';
import { CASSETTA, ATTREZZI } from '../gioco/cantiere.js';
import { defDi } from '../world/blocks.js';
import { ARREDI } from './arredi.js';

export const QUOTA = 4;
const META = 32;

/** Genera il chunk (cx, cz) dello zoo nel mondo; torna [[x, y, z, tipo], …] da posare non silenziose (modelli). */
export function generaChunkZoo(mondo, cx, cz) {
  const decorazioni = [];
  const x0 = cx * CHUNK, z0 = cz * CHUNK;
  for (let x = x0; x < x0 + CHUNK; x++) for (let z = z0; z < z0 + CHUNK; z++) {
    if (x < -META || x >= META || z < -META || z >= META) continue;
    // il piano: terra sotto, erba sopra
    for (let y = QUOTA - 3; y < QUOTA; y++) mondo.metti(x, y, z, 'terra', true);
    mondo.metti(x, QUOTA, z, 'erba', true);
    // la vasca: 12×8 scavata di due, con l'acqua a filo
    if (x >= 6 && x < 18 && z >= -20 && z < -12) { mondo.togli(x, QUOTA, z, true); mondo.metti(x, QUOTA - 1, z, 'acqua', true); mondo.metti(x, QUOTA, z, 'acqua', true); }
    // la scalinata di pietra: verso +z, otto gradini
    if (x >= -20 && x < -12 && z >= 4 && z < 12) for (let y = QUOTA + 1; y <= QUOTA + (z - 3); y++) mondo.metti(x, y, z, 'pietra', true);
    // il muro dei materiali: una colonna alta tre per ogni blocco della cassetta, lungo z = 20
    if (z === 20 && x >= -24 && x < 24) {
      const tipi = CASSETTA.filter((t) => t && !ATTREZZI[t] && defDi(t).forma !== 'modello');
      const i = Math.floor((x + 24) / 2);
      if ((x + 24) % 2 === 0 && i < tipi.length) for (let y = QUOTA + 1; y <= QUOTA + 3; y++) mondo.metti(x, y, z, tipi[i], true);
    }
    // il viale dei lampioni: lungo x = -4, ogni sei blocchi
    if (x === -4 && z >= -28 && z < 28 && (z + 28) % 6 === 0) decorazioni.push([x, QUOTA + 1, z, 'lampione']);
    // gli alberi: un boschetto a sud-ovest
    if (x >= -28 && x < -8 && z >= -28 && z < -8 && ((x * 7 + z * 13) % 11 === 0)) decorazioni.push([x, QUOTA + 1, z, 'albero']);
    // gli arredi in fila, lungo z = -4
    const arredi = Object.keys(ARREDI);
    if (z === -4 && x >= 0 && x < arredi.length * 2 && x % 2 === 0) decorazioni.push([x, QUOTA + 1, z, arredi[x / 2]]);
    // le lampade colorate: quattro blocchi in croce attorno a (20, 8)
    if (z === 8) { if (x === 18) mondo.metti(x, QUOTA + 1, z, 'lampadaRossa', true); if (x === 22) mondo.metti(x, QUOTA + 1, z, 'lampadaBlu', true); }
    if (x === 20) { if (z === 6) mondo.metti(x, QUOTA + 1, z, 'lampadaVerde', true); if (z === 10) mondo.metti(x, QUOTA + 1, z, 'lampadaPesante', true); }
  }
  return decorazioni;
}

// IL WORKER DEL MESHER — un chunk alla volta, fuori dal filo principale.
//
// ⚠ NON RICORDA NIENTE fra un messaggio e l'altro: ogni lavoro porta la sua
// fotografia (mesher-foto.js), e qui si fa solo il conto. È la ragione per cui
// non può divergere dal mondo vero, e per cui morire e rinascere non costa
// nulla — il filo principale rimette in coda quello che era in volo.
//
// ⚠ IMPORTA SOLO `world/`: niente motore, niente import map (un Worker a moduli
// non la vede). La regola «fuori da src/motore non si nomina Babylon» è quello
// che rende possibile questo file.
import { costruisciChunkDati } from './mesher.js';
import { MondoFoto, allineaAllaFoto, impacchetta, trasferibili } from './mesher-foto.js';

self.onmessage = (ev) => {
  const f = ev.data;
  allineaAllaFoto(f);
  const r = impacchetta(costruisciChunkDati(new MondoFoto(f), f.kc, f.livello, f.soloAcqua));
  r.kc = f.kc;
  r.livello = f.livello;
  self.postMessage(r, trasferibili(r));
};

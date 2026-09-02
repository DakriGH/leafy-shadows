// IL WORKER DEL MESHER DEL NUCLEO — un chunk alla volta, fuori dal filo principale.
//
// ⚠ NON RICORDA NIENTE fra un messaggio e l'altro: ogni lavoro porta la sua
// fotografia (world/mesher-foto.js, con margine 6 per la luce cotta) e qui si
// fa solo il conto: mesh, acqua, erba, luce. Il risultato torna con i buffer
// TRASFERITI, non copiati.
//
// ⚠ IMPORTA SOLO `world/` E `nucleo/`: niente DOM, niente motore. È lo stesso
// codice che gira in Node nelle prove, quindi non può divergere dal filo
// principale, che lo usa come ripiego quando il Worker non c'è.
import { costruisciChunkNucleo } from './mesher-nucleo.js';
import { MondoFoto, allineaAllaFoto } from '../world/mesher-foto.js';

self.onmessage = (ev) => {
  const f = ev.data;
  allineaAllaFoto(f);
  const d = costruisciChunkNucleo(new MondoFoto(f), f.kc, { erba: f.erba });
  const buffer = [d.byte.buffer, d.altezze.buffer];
  if (d.acqua && d.acqua.byte) buffer.push(d.acqua.byte.buffer);
  if (d.erba && d.erba.byte) buffer.push(d.erba.byte.buffer);
  self.postMessage({ kc: f.kc, dati: d, marca: f.marca }, [...new Set(buffer)]);
};

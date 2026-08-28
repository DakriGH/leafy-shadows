// LA REGIA — collega, non fa.
//
// FASE 1 del piano (docs/PIANO.md): scheletro, un pezzo di mondo VERO a schermo,
// e una risposta alla sola domanda che conta adesso — **il look regge?**
// Non c'è erba, non c'è acqua animata, non ci sono modelli: c'è il terreno di
// Leafy generato dal worldgen di sempre, meshato dal mesher di sempre, e
// illuminato dal motore invece che da noi. Se quello che si vede non convince,
// si ferma qui e si ripensa, prima di aver investito settimane.

import { Rig } from './motore/motore.js';
import { Fabbrica } from './motore/fabbrica.js';
import { Giorno } from './motore/giorno.js';
import { Mondo } from './world/world.js';
import { Mesher, collegaFabbrica as fabbricaMesher } from './world/mesher.js';
import { collegaFabbrica as fabbricaStagioni } from './world/stagioni.js';
import { generaOpenWorld } from './world/worldgen.js';
import { Erba, collegaFabbrica as fabbricaErba } from './vegetazione/erba.js';

const tela = document.getElementById('tela');
const stato = document.getElementById('stato');

const rig = new Rig(tela);
const fabbrica = new Fabbrica(rig);
// ⚠ PRIMA DI TOCCARE IL MONDO. Il mesher e le stagioni chiamano la fabbrica
// alla prima mesh: collegarla dopo dà un `null` in un punto lontano da qui.
fabbricaMesher(fabbrica);
fabbricaStagioni(fabbrica);
fabbricaErba(fabbrica);

const mondo = new Mondo();
const mesher = new Mesher(rig.scena, mondo);

// ---- il mondo, quello vero -------------------------------------------------
const t0 = performance.now();
const { alberi, lampioni } = generaOpenWorld(mondo, 4242, 48);
const tGen = performance.now() - t0;

const t1 = performance.now();
mesher.ricostruisciTutto(mondo);
const tMesh = performance.now() - t1;

// il bersaglio della camera sulla cima del terreno al centro
let cima = 8;
for (let y = 60; y > 0; y--) if (mondo.tipo(0, y, 0)) { cima = y + 1; break; }
rig.camera.setTarget(new (rig.camera.target.constructor)(0, cima, 0));

// ---- l'erba ----------------------------------------------------------------
// ⚠ IL TETTO È QUELLO MISURATO SU LANTERN, non «il più alto che regge»: il caso
// peggiore vero (anello a passo pieno tutto a erba, densità 8) sta sotto 450k.
const erba = new Erba(rig.scena, { max: 500000, densita: 7.8, raggioChunk: 6 });
const passeggero = { x: 0.5, y: cima, z: 0.5 };

// ---- il ciclo del giorno ----------------------------------------------------
const giorno = new Giorno(rig, { durata: 300, ora: 0.42 });

// ---- il contatore onesto ---------------------------------------------------
// ⚠ NON GLI FPS: i MILLISECONDI. In Lantern ho passato una giornata a dire «va
// bene» guardando le medie, mentre il committente sentiva i picchi. Qui si
// scrivono il p50 e il p99 del fotogramma, che sono i due numeri che
// descrivono uno scatto — la media non lo descrive mai.
const finestra = [];
let ultimo = performance.now();
function aggiornaStato() {
  const ora = performance.now();
  finestra.push(ora - ultimo);
  ultimo = ora;
  if (finestra.length > 240) finestra.shift();
  if (finestra.length < 30 || finestra.length % 15) return;
  const s = finestra.slice().sort((a, b) => a - b);
  const p = (q) => s[Math.floor(s.length * q)].toFixed(1);
  stato.textContent =
    `p50 ${p(0.5)} ms   p99 ${p(0.99)} ms\n` +
    `chunk ${mesher.chunks.size}   blocchi ${mondo.contaBlocchi.toLocaleString('it')}\n` +
    `worldgen ${tGen.toFixed(0)} ms   mesh ${tMesh.toFixed(0)} ms\n` +
    `erba ${erba.fili.toLocaleString('it')} lamelle   ${giorno.orologio}\n` +
    `alberi ${alberi.length} (ancora non posati)\n` +
    `I = ispettore`;
}

rig.avvia((dt) => {
  giorno.aggiorna(dt);
  // la semina è a BILANCIO DI TEMPO, non a numero di chunk: i chunk non costano
  // uguale, e contarli lasciava passare picchi da tre millisecondi e mezzo
  erba.aggiorna(dt, mondo, passeggero, null, rig.camera.position);
  aggiornaStato();
});

// una manina per lavorarci sopra dall'ispettore e dalla console
globalThis.LEAFY = { rig, fabbrica, mondo, mesher, erba, giorno, passeggero, generaOpenWorld };

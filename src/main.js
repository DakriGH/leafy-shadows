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
import { Modelli } from './motore/modelli.js';
import { Mondo } from './world/world.js';
import { Mesher, collegaFabbrica as fabbricaMesher } from './world/mesher.js';
import { collegaFabbrica as fabbricaStagioni } from './world/stagioni.js';
import { generaOpenWorld } from './world/worldgen.js';
import { Erba, collegaFabbrica as fabbricaErba } from './vegetazione/erba.js';
import { Passeggero, tastiera } from './gioco/passeggero.js';

const tela = document.getElementById('tela');
const stato = document.getElementById('stato');
const spia = document.getElementById('fps');

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

// ---- chi cammina ------------------------------------------------------------
const passeggero = new Passeggero(mondo, { x: 0.5, y: cima + 1, z: 0.5 });
const intento = tastiera();
// un segnaposto: il gatto vero arriva col suo modello. Serve a vedere DOVE si è.
const corpo = fabbrica.segnaposto();
// ⚠ LA CAMERA SEGUE, NON INSEGUE. Un pedinamento morbido su un personaggio che
// cammina su blocchi fa ondeggiare tutta l'inquadratura a ogni scalino; qui il
// bersaglio va dove va il passeggero, e a smorzare è solo la quota — che è
// l'unica che salta di un blocco intero.
let quotaMorbida = passeggero.y;

// ---- i modelli --------------------------------------------------------------
// ⚠ ASINCRONO, E IL GIOCO NON LO ASPETTA. Un .glb da 52 KB arriva in fretta ma
// non è istantaneo, e bloccare l'avvio per gli alberi vorrebbe dire una pagina
// bianca su una connessione lenta. Il mondo si vede subito; gli alberi
// compaiono quando ci sono.
const modelli = new Modelli(rig.scena, rig);
let alberiPosati = 0;
modelli.carica('albero').then(() => {
  // ⚠ worldgen dà TERNE [x, quota, z], non oggetti. Trattarle come oggetti dava
  // NaN nelle matrici, cioè quarantotto alberi disegnati in nessun posto — e
  // senza un errore, perché una matrice di NaN è una matrice valida.
  alberiPosati = modelli.piazza('albero', alberi.map(([x, h, z]) => ({
    // ⚠ `h` È GIÀ LA SUPERFICIE, non la quota del blocco. Ci aggiungevo 1
    // «perché la faccia sopra sta a h+1», e gli alberi galleggiavano di
    // ESATTAMENTE un blocco — misurato: albero a quota 8, blocco più alto a 6,
    // superficie a 7. Un difetto da un blocco tondo non è mai un errore di
    // arrotondamento: è un +1 di troppo, e conviene cercarlo lì.
    x: x + 0.5, y: h, z: z + 0.5,
    // ⚠ IL GIRO È DETERMINISTICO, non casuale: un albero deve stare girato
    // sempre allo stesso modo, o a ogni ricarica il bosco cambia faccia.
    giro: (((x * 73856093) ^ (z * 19349663)) >>> 0) / 4294967296 * Math.PI * 2,
  })));
}).catch((e) => { console.error('alberi:', e); });

// ---- i lampioni, e le loro luci ---------------------------------------------
// ⚠ LA LUCE STA UN PO' SOPRA IL PALO, non alla base: una sfera centrata a terra
// illumina il terreno e non l'aria, e il lampione sembra spento.
let lampioniPosati = 0;
modelli.carica('lampione').then(() => {
  lampioniPosati = modelli.piazza('lampione', lampioni.map(([x, h, z]) => ({ x: x + 0.5, y: h, z: z + 0.5, giro: 0 })));
  for (const [x, h, z] of lampioni) {
    // ⚠ QUATTORDICI E NON OTTO E MEZZO. La pozza è quantizzata a tre gradini
    // (`BANDE_LUCE`), quindi il primo gradino si azzera dove (1 - d/r)² scende
    // sotto un sesto: con r = 8,5 succede a cinque blocchi, e la lampada era
    // praticamente invisibile — misurato leggendo il pixel, non a occhio.
    // Il raggio non è «quanto illumina»: è quanto illumina PRIMA che i gradini
    // la spengano, ed è tre quarti del raggio scritto.
    rig.luci.accendi({ x: x + 0.5, y: h + 2.6, z: z + 0.5, raggio: 14, forza: 1 });
  }
}).catch((e) => { console.error('lampioni:', e); });

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

  // ⚠ GLI FPS E I MILLISECONDI INSIEME, e i secondi non bastano da soli: con la
  // sincronia verticale il numero si incolla al tetto del pannello e non dice
  // più niente — sessanta fps sono sessanta sia che si lavori un millisecondo
  // sia che se ne lavorino quindici. Il ms del p99 è quello che si SENTE.
  const fps = Math.round(1000 / s[s.length >> 1]);
  spia.textContent = `${fps} fps\n${p(0.5)} / ${p(0.99)} ms`;
  stato.textContent =
    `p50 ${p(0.5)} ms   p99 ${p(0.99)} ms\n` +
    `chunk ${mesher.chunks.size}   blocchi ${mondo.contaBlocchi.toLocaleString('it')}\n` +
    `worldgen ${tGen.toFixed(0)} ms   mesh ${tMesh.toFixed(0)} ms\n` +
    `erba ${erba.fili.toLocaleString('it')} lamelle   ${giorno.orologio}\n` +
    `alberi ${alberiPosati}/${alberi.length}   lampioni ${lampioniPosati}\n` +
    `I = ispettore`;
}

rig.avvia((dt) => {
  giorno.aggiorna(dt);
  // ⚠ IL VERSO SI CHIEDE ALLA CAMERA, non si ricava dal suo angolo: `alpha` da
  // solo non basta a sapere dove punta, e il conto sbagliato si sente subito.
  passeggero.aggiorna(dt, intento, rig.versoCamera());
  quotaMorbida += (passeggero.y - quotaMorbida) * Math.min(1, dt * 9);
  rig.camera.target.set(passeggero.x, quotaMorbida + 0.6, passeggero.z);
  fabbrica.muoviSegnaposto(corpo, passeggero);
  // la semina è a BILANCIO DI TEMPO, non a numero di chunk: i chunk non costano
  // uguale, e contarli lasciava passare picchi da tre millisecondi e mezzo
  erba.aggiorna(dt, mondo, passeggero, null, rig.camera.position);
  aggiornaStato();
});

// una manina per lavorarci sopra dall'ispettore e dalla console
globalThis.LEAFY = { rig, fabbrica, mondo, mesher, erba, giorno, modelli, passeggero, generaOpenWorld };

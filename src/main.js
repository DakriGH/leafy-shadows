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
import { miraCompleta, posabile, raggiungibile, portataRaggio } from './gioco/mira.js';
import { Cantiere, CASSETTA, NOME_AZIONE } from './gioco/cantiere.js';
import { Lampioni } from './gioco/lampioni.js';
import { ascoltaClic } from './gioco/puntatore.js';
import { Barra } from './ui/barra.js';
import { defDi } from './world/blocks.js';
import { geometriaSingola } from './world/mesher.js';
import { ScalaQualita, misuraHz } from './motore/qualita.js';

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
// ⚠ MA SU MOBILE IL TETTO SI ABBASSA, e non è la stessa cosa della densità: il
// tetto è quanto BUFFER si alloca, cioè memoria di GPU che si paga anche se non
// la si riempie mai. Mezzo milione di lamelle sono 10,5 MB di attributi.
const erba = new Erba(rig.scena, {
  max: rig.dispositivo.mobile ? 120000 : 500000,
  densita: rig.profilo.erba, raggioChunk: rig.profilo.erbaR,
});

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
const lampioni_ = new Lampioni();
const aloni = fabbrica.aloni(64);
modelli.carica('lampione').then(() => {
  lampioniPosati = modelli.piazza('lampione', lampioni.map(([x, h, z]) => ({ x: x + 0.5, y: h, z: z + 0.5, giro: 0 })));
  for (const [x, h, z] of lampioni) {
    // ⚠ E TORNA A OTTO E MEZZO, che è il numero di Lantern. L'avevo alzato a
    // quattordici perché le lampade non si vedevano, e la causa non era il
    // raggio: era la mia formula di caduta (vedi `luci.js`). Curato il difetto,
    // il raggio torna a voler dire quanto illumina.
    const i = rig.luci.accendi({ x: x + 0.5, y: h + 2.6, z: z + 0.5, raggio: 8.5, forza: 1 });
    lampioni_.aggiungi({ x: x + 0.5, y: h, z: z + 0.5, indiceLuce: i });
  }
  applicaLampioni();
}).catch((e) => { console.error('lampioni:', e); });

/**
 * DALLO STATO DEI LAMPIONI ALLE COSE CHE SI VEDONO — la luce e l'alone.
 * ⚠ UN POSTO SOLO, e ci passa anche l'accensione iniziale: se lo stato di
 * partenza prendesse un'altra strada sarebbe l'unico caso non provato dal
 * codice che gestisce tutti gli altri.
 */
function applicaLampioni() {
  const punti = [];
  for (const l of lampioni_.elenco) {
    // spegnere = raggio zero, che è come `Luci` segna uno slot morto
    rig.luci.pos[l.indiceLuce * 4 + 3] = l.acceso ? 8.5 : 0;
    // ⚠ L'ALONE STA DOVE STA LA LAMPADA, non ai piedi del palo: 2,6 sopra la
    // base, lo stesso numero della luce. Due numeri per la stessa cosa sarebbe
    // il modo di vederli divergere al primo ritocco.
    punti.push({ x: l.x, y: l.y + 2.6, z: l.z, acceso: l.acceso });
  }
  fabbrica.muoviAloni(aloni, punti);
}

// ---- il cantiere: rompere, posare, illuminare -------------------------------
const cantiere = new Cantiere(mondo, rig.luci);
cantiere.scegli(1);                       // si parte con l'erba in mano
const mirino = fabbrica.mirino();
const anteprima = fabbrica.anteprima();
/** Dov'è il puntatore, in pixel di tela. Null = mira al centro dello schermo. */
let puntatore = { x: 0, y: 0 };
/** Il bersaglio calcolato una volta per fotogramma, riusato da HUD e clic. */
let bersaglio = null;

// ⚠ IL BERSAGLIO SI CALCOLA UNA VOLTA SOLA, nel giro del fotogramma, e non
// dentro il gestore del clic. Ricalcolarlo al clic sembra più «giusto» e invece
// introduce uno scarto: fra l'ultimo disegno e il clic la camera può essersi
// mossa, e si rompe un blocco diverso da quello che aveva il mirino addosso.
// Quello che si vede evidenziato è quello che si rompe, per costruzione.
/** Cosa farà il prossimo clic: 'rompi' | 'posa' | 'interagisci' | null. */
let cosaFa = null;

function aggiornaMira() {
  const r = rig.raggioDaPuntatore(puntatore.x, puntatore.y);
  // ⚠ IL RAGGIO SI TIRA FINO A LÀ, il braccio si controlla dopo: vedi `mira.js`.
  // ⚠ E GUARDA ANCHE LE SCATOLE DEI LAMPIONI, che non sono blocchi: la griglia
  // sotto di loro è vuota e il cammino ci passava attraverso.
  const b = miraCompleta(mondo, r.origine, r.verso, lampioni_.scatole(), portataRaggio(rig.camera.radius));
  bersaglio = null; cosaFa = null;
  if (b && b.dato) {
    // un lampione: si controlla la portata sul suo piede
    if (raggiungibile([Math.floor(b.dato.x), Math.floor(b.dato.y) + 1, Math.floor(b.dato.z)], passeggero)) {
      bersaglio = b; cosaFa = 'interagisci';
    }
  } else if (b && raggiungibile(b.cella, passeggero)) {
    bersaglio = b;
    cosaFa = cantiere.azione(null);
    if (cosaFa === 'posa' && !posabile(mondo, b.prima, passeggero)) cosaFa = null;
  }

  // ⚠ IL MIRINO DICE ANCHE COSA SUCCEDERÀ, col colore: bianco = si rompe,
  // verde = si posa, giallo = si accende. È l'unico modo per non dover
  // indovinare quale delle due celle sta per essere toccata.
  const COLORE = { rompi: [1, 1, 1], posa: [0.55, 1, 0.6], interagisci: [1, 0.86, 0.45] };
  fabbrica.muoviMirino(mirino, bersaglio && bersaglio.cella, COLORE[cosaFa] || [1, 1, 1]);
  // ⚠ E L'ANTEPRIMA MOSTRA IL BLOCCO VERO, con la sua forma e i suoi colori:
  // che un blocco d'erba abbia il cappello si vede prima di cliccare, non dopo.
  fabbrica.muoviAnteprima(anteprima, cosaFa === 'posa' ? formaDi(cantiere.tipoScelto) : null,
    cosaFa === 'posa' ? bersaglio.prima : null);
}

// ⚠ LE FORME SI TENGONO DA PARTE: `geometriaSingola` ricostruisce il blocco da
// zero, e chiamarla a ogni fotogramma vorrebbe dire rifare la stessa geometria
// sessanta volte al secondo per un cubo che non cambia mai.
const _forme = new Map();
function formaDi(tipo) {
  if (!tipo) return null;
  if (!_forme.has(tipo)) _forme.set(tipo, { ...geometriaSingola(tipo), tipo });
  return _forme.get(tipo);
}

/** Fa quello che il mirino sta promettendo. */
function agisci() {
  if (!bersaglio || !cosaFa) return;
  if (cosaFa === 'interagisci') { lampioni_.alterna(bersaglio.dato); applicaLampioni(); }
  else if (cosaFa === 'rompi') cantiere.rompi(...bersaglio.cella);
  else if (cosaFa === 'posa') cantiere.posa(...bersaglio.prima);
}

addEventListener('pointermove', (e) => { puntatore.x = e.clientX; puntatore.y = e.clientY; });

// ⚠ SOLO I CLIC VERI, e questa è la correzione al difetto che il committente ha
// visto: «hai usato il tasto sinistro e destro per piazzare, ma è anche il modo
// che uso per muovere la telecamera». Prima si agiva su `pointerdown`, quindi
// ogni rotazione della camera rompeva anche il blocco da cui era partita. Vedi
// `gioco/puntatore.js`: un clic è tale solo se il puntatore non si è spostato.
ascoltaClic(tela, (e) => {
  // ⚠ IL BERSAGLIO SI RICALCOLA SUL PUNTO DEL RILASCIO: su un telefono il dito
  // non ha un «pointermove» prima di toccare, quindi il bersaglio calcolato nel
  // giro precedente è quello di dove stava il dito PRIMA — cioè da nessuna parte.
  puntatore.x = e.clientX; puntatore.y = e.clientY;
  aggiornaMira();
  if (e.button === 1) {
    // ⚠ IL TASTO CENTRALE COPIA IL BLOCCO che si sta guardando, come in
    // Minecraft: è il gesto che chiunque abbia costruito in un gioco a blocchi
    // prova per primo, e non trovarlo è una piccola frustrazione gratuita.
    if (!bersaglio || bersaglio.dato) return;
    const i = CASSETTA.indexOf(mondo.tipo(...bersaglio.cella));
    if (i >= 0) cantiere.scegli(i);
    e.preventDefault();
    return;
  }
  // ⚠ IL DESTRO ROMPE SEMPRE, ed è l'unica scorciatoia che resta legata a un
  // tasto: serve a rompere senza svuotarsi le mani, e su un telefono non
  // manca a nessuno perché lì si tocca la casella della mano vuota.
  if (e.button === 2 && bersaglio && !bersaglio.dato) { cantiere.rompi(...bersaglio.cella); return; }
  if (e.button === 0) agisci();
});

// ---- la scala di qualità ----------------------------------------------------
// ⚠ ESISTE PERCHÉ IL TELEFONO FACEVA SEI FOTOGRAMMI AL SECONDO mentre il PC
// andava meglio di Leafy-Lantern. Non era un difetto: era una configurazione da
// desktop su un chip con un decimo della banda e tre volte i pixel.
// ⚠ E SI MISURA CON `screen` PERCHÉ IL BERSAGLIO NON È IL TETTO DEL PANNELLO:
// vedi `gioco/adatta.js`.
const scala = new ScalaQualita({
  mobile: rig.dispositivo.mobile,
  applica: (p) => rig.applicaProfilo(p, { erba }),
});
scala.avvia();
// ⚠ E QUANTO VA LO SCHERMO SI MISURA, non si chiede: `screen.refreshRate` non
// esiste in Chrome e tornava `undefined`. Arriva dopo una quarantina di
// fotogrammi, che è comunque prima che la scala possa decidere qualcosa.
misuraHz().then((hz) => scala.impostaHz(hz));

// ---- la barra in mano -------------------------------------------------------
const barra = new Barra({
  cassetta: CASSETTA,
  colorePer: (t) => '#' + defDi(t).cima.toString(16).padStart(6, '0'),
  nomePer: (t) => defDi(t).nome,
  onScegli: (i) => cantiere.scegli(i),
});

// ---- il ciclo del giorno ----------------------------------------------------
const giorno = new Giorno(rig, { durata: 300, ora: 0.42 });

// ⚠ I TASTI SI LEGGONO PER CODICE FISICO (`e.code`), non per carattere: su una
// tastiera italiana `,` e `.` stanno dove stanno, e leggendo `e.key` i comandi
// cambierebbero posto cambiando disposizione. `Comma` e `Period` sono il tasto,
// non il segno.
addEventListener('keydown', (e) => {
  if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.code === 'Comma') { giorno.auto = false; giorno.t = (giorno.t + 0.985) % 1; giorno.applica(); }
  else if (e.code === 'Period') { giorno.auto = false; giorno.t = (giorno.t + 0.015) % 1; giorno.applica(); }
  else if (e.code === 'KeyP') giorno.auto = !giorno.auto;
  else if (e.code === 'KeyQ' && bersaglio && !bersaglio.dato) cantiere.rompi(...bersaglio.cella);
  else if (e.code === 'KeyE') agisci();
  else if (e.code === 'KeyR') cantiere.scegli(cantiere.scelto + (e.shiftKey ? -1 : 1));
  // ⚠ K FISSA LA QUALITÀ A MANO, e serve per PROVARE: senza, per vedere il
  // gradino più basso bisogna trovare una macchina che soffra davvero.
  else if (e.code === 'KeyK') {
    if (scala.adatta.manuale && scala.livello >= scala.quanti - 1) scala.libera();
    else scala.fissa(scala.adatta.manuale ? scala.livello + 1 : 0);
  }
  else if (e.code.startsWith('Digit')) {
    const n = Number(e.code.slice(5));
    if (n >= 1 && n <= 9) cantiere.scegli(n - 1);
  }
});

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
  // ⚠ LA SCALA GUARDA IL p50, NON LA MEDIA: una media si lascia tirare su da
  // una raffica di fotogrammi buoni mentre il gioco singhiozza — è l'errore che
  // in Lantern mi ha fatto dire «va bene» per una giornata intera.
  scala.osserva(fps, ora);
  spia.textContent = `${fps} fps\n${p(0.5)} / ${p(0.99)} ms`;
  // ⚠ L'ORDINE CONTA, e conta SUL TELEFONO: là il pannello sta arrotolato alle
  // prime due righe e si apre col tocco (vedi il CSS in `index.html`). Quindi la
  // prima riga dev'essere quella che serve a capire perché va piano — classe del
  // dispositivo, gradino, pixel veri — e non «chunk e blocchi», che è la prima
  // cosa che avevo messo perché era la prima che avevo scritto.
  stato.textContent =
    `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'}  q${scala.livello}/${scala.quanti - 1}` +
    `${scala.adatta.manuale ? '·mano' : ''}  ${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()}` +
    `  dpr ${devicePixelRatio}  ${p(0.5)}/${p(0.99)} ms\n` +
    `ombre ${rig.profilo.sole ? rig.ombre.numCascades + '×' + rig.profilo.mappa : 'no'}` +
    `  lampade ${rig.fissi.ombreLampade ? 'con ombra' : 'senza'}` +
    `  erba ${(erba.attiva ? erba.fili : 0).toLocaleString('it')}\n` +
    `${rig.scheda.software ? '⚠ DISEGNA IN SOFTWARE' : rig.scheda.nome.slice(0, 40)}\n` +
    `chunk ${mesher.chunks.size}   blocchi ${mondo.contaBlocchi.toLocaleString('it')}   ` +
    `luci ${rig.luci.accese}   alberi ${alberiPosati}/${alberi.length}\n` +
    `worldgen ${tGen.toFixed(0)} ms   mesh ${tMesh.toFixed(0)} ms\n` +
    `\n${giorno.orologio}${giorno.auto ? '' : ' (fermo)'}\n` +
    `clic = quello che hai in mano · destro rompe · centrale copia\n` +
    `1-9 / R mano   , . ora   P ciclo   K qualità   I ispettore`;
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
  // ⚠ E QUI IL MONDO SI RIDISEGNA DOVE È CAMBIATO. Il mesher tiene già una coda
  // a bilancio di tempo (3 ms per fotogramma) e si accorge da solo di quali
  // chunk sono sporchi: rompere un blocco non ricostruisce niente sul momento,
  // mette in coda. Senza questa riga si poteva rompere quanto si voleva e a
  // schermo non cambiava niente — il mondo era giusto, l'immagine vecchia.
  mesher.aggiorna(mondo, passeggero);
  // ⚠ I LAMPIONI SEGUONO LA NOTTE, come in Lantern: si accendono da soli quando
  // il sole scende, e l'interruttore a mano vale fino al prossimo cambio.
  if (lampioni_.aggiornaNotte(giorno.t < 0.24 || giorno.t > 0.80)) applicaLampioni();
  aggiornaMira();
  barra.aggiorna(cantiere.scelto, cosaFa
    ? `<b>${NOME_AZIONE[cosaFa]}</b> · ${cosaFa === 'interagisci' ? 'lampione' : cantiere.nomeScelto}`
    : `— · ${cantiere.nomeScelto}`);
  aggiornaStato();
});

// una manina per lavorarci sopra dall'ispettore e dalla console
globalThis.LEAFY = { rig, fabbrica, mondo, mesher, erba, giorno, modelli, passeggero, cantiere, scala, lampioni: lampioni_, barra, generaOpenWorld };

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
import { Cantiere, CASSETTA, NOME_AZIONE, ATTREZZI } from './gioco/cantiere.js';
import { Decoro } from './gioco/decoro.js';
import { registraDecorazioni, DECORAZIONI } from './world/decorazioni.js';
import { ascoltaClic } from './gioco/puntatore.js';
import { scalaColpetto, inCorso, DURATA as DURATA_COLPETTO } from './gioco/colpetto.js';
import { Barra } from './ui/barra.js';
import { ComandiTocco } from './ui/comandi.js';
import { PannelloCielo } from './ui/cielo.js';
import { STAGIONI, stagioneCorrente, stagioneAlGiorno, impostaMescolanza,
         INIZIO_STAGIONE } from './world/stagioni.js';
import { defDi } from './world/blocks.js';
import { paletteBlocco, ritingiFogliame } from './world/stagioni.js';
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

// ⚠ PRIMA DI TOCCARE IL MONDO, come la fabbrica: alberi e lampioni sono BLOCCHI
// (vedi `world/decorazioni.js`), e il worldgen li posa. Registrarli dopo vorrebbe
// dire un tipo sconosciuto e un difetto lontano da qui.
registraDecorazioni();

const mondo = new Mondo();
const mesher = new Mesher(rig.scena, mondo);

// ---- il mondo, quello vero -------------------------------------------------
const t0 = performance.now();
const { alberi, lampioni } = generaOpenWorld(mondo, 4242, 48);
// ⚠ E ADESSO DIVENTANO CELLE. Il worldgen dà delle terne [x, quota, z] e prima
// finivano dritte nelle istanze di mesh: fuori dal mondo, quindi irrompibili e
// non salvabili. Posarle come blocchi le fa entrare in tutta la macchina che
// c'è già — mira, rottura, barra, salvataggio.
// ⚠ «h» È GIÀ LA SUPERFICIE, cioè la prima cella d'aria: la decorazione va LÌ,
// non a h+1. È lo stesso +1 che una volta faceva galleggiare gli alberi.
for (const [x, h, z] of alberi) mondo.metti(x, h, z, 'albero', true);
for (const [x, h, z] of lampioni) mondo.metti(x, h, z, 'lampione', true);
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
// ⚠ SOLO DOVE SERVE: su un desktop col mouse un joystick a schermo è ingombro.
// La classe del dispositivo l'ha già decisa il motore (`rig.dispositivo`), e
// «tocco» è la domanda giusta — non «mobile», che è la classe GRAFICA: un
// convertibile aperto a tablet ha uno schermo veloce e le dita.
const comandi = rig.dispositivo.tocco ? new ComandiTocco(intento) : null;
/** ⚠ SUL TELEFONO È IL PICCONE, sul computer è il tasto destro tenuto premuto:
 *  due modi diversi per la stessa cosa, perché i due dispositivi hanno cose
 *  diverse da premere. Il nome è uno solo, e l'etichetta sopra la barra dice
 *  sempre la verità su cosa farà il prossimo clic. */
// ⚠ E SUL COMPUTER È SHIFT: il tasto destro serviva a rompere e adesso serve a
// interagire, quindi rompere senza svuotarsi le mani vuole un modificatore. Si
// legge dallo stato dei tasti, non da un evento, perché il clic può arrivare da
// un punto qualunque del giro.
let shiftGiu = false;
addEventListener('keydown', (e) => { if (e.key === 'Shift') shiftGiu = true; });
addEventListener('keyup', (e) => { if (e.key === 'Shift') shiftGiu = false; });
addEventListener('blur', () => { shiftGiu = false; });
const demolisce = () => shiftGiu || !!(comandi && comandi.demolisci);
// un segnaposto: il gatto vero arriva col suo modello. Serve a vedere DOVE si è.
const corpo = fabbrica.segnaposto();
// ⚠ LA CAMERA SEGUE, NON INSEGUE. Un pedinamento morbido su un personaggio che
// cammina su blocchi fa ondeggiare tutta l'inquadratura a ogni scalino; qui il
// bersaglio va dove va il passeggero, e a smorzare è solo la quota — che è
// l'unica che salta di un blocco intero.
let quotaMorbida = passeggero.y;

// ---- i modelli e le decorazioni ---------------------------------------------
// ⚠ ASINCRONO, E IL GIOCO NON LO ASPETTA. Un .glb da 52 KB arriva in fretta ma
// non è istantaneo, e bloccare l'avvio per gli alberi vorrebbe dire una pagina
// bianca su una connessione lenta. Il mondo si vede subito; gli alberi
// compaiono quando ci sono.
const modelli = new Modelli(rig.scena, rig, fabbrica);
const decoro = new Decoro();
decoro.scansiona(mondo);
const aloni = fabbrica.aloni(96);

/** Quali modelli sono già arrivati: si ridisegna solo quello che c'è. */
const modelliPronti = new Set();
for (const nome of Object.keys(DECORAZIONI)) {
  modelli.carica(nome, { proietta: DECORAZIONI[nome].proietta !== false })
    .then(() => { modelliPronti.add(nome); _versioneDisegnata = -1; })
    .catch((e) => { console.error(nome + ':', e); });
}

// ⚠ SI RIDISEGNA SOLO QUANDO CAMBIA, e il confronto è su un numero: rifare le
// matrici di sessanta istanze a ogni fotogramma sarebbe lavoro per niente, e
// contarle non basterebbe — romperne una e posarne un'altra lascia il conto
// uguale e il mondo diverso.
let _versioneDisegnata = -1;
function aggiornaDecoro() {
  if (decoro.versione === _versioneDisegnata) return;
  _versioneDisegnata = decoro.versione;
  for (const nome of modelliPronti) {
    const voci = decoro.diTipo(nome);
    modelli.piazza(nome, voci.map((v) => ({ x: v.x + 0.5, y: v.y, z: v.z + 0.5, giro: v.giro, scala: v.scala || 1 })));
  }
  applicaLuciDecoro();
}

/**
 * DALLO STATO DELLE DECORAZIONI ALLE COSE CHE SI VEDONO — la luce e l'alone.
 * ⚠ UN POSTO SOLO, e ci passa anche l'accensione iniziale: se lo stato di
 * partenza prendesse un'altra strada sarebbe l'unico caso non provato dal
 * codice che gestisce tutti gli altri.
 * ⚠ E LE LAMPADE SI RIFANNO DA ZERO ogni volta: sono qualche decina, e un
 * registro incrementale di indici che si spostano è esattamente il genere di
 * cosa che si rompe quando si rompe un lampione in mezzo alla fila.
 */
function applicaLuciDecoro() {
  rig.luci.spegniTutte();
  const punti = [];
  for (const v of decoro.per.values()) {
    const d = DECORAZIONI[v.tipo];
    if (!d.luce || !v.acceso) continue;
    const q = d.luce.quota;
    rig.luci.accendi({
      x: v.x + 0.5, y: v.y + q, z: v.z + 0.5,
      raggio: d.luce.raggio, forza: d.luce.intensita, ombra: d.luce.ombra,
      colore: [((d.luce.colore >> 16) & 255) / 255, ((d.luce.colore >> 8) & 255) / 255, (d.luce.colore & 255) / 255],
    });
    punti.push({ x: v.x + 0.5, y: v.y + q, z: v.z + 0.5, acceso: true });
  }
  fabbrica.muoviAloni(aloni, punti);
}

// ⚠ IL MONDO CI RACCONTA I SUOI CAMBI, e questa riga è quella che tiene in piedi
// tutto: rompere un albero non deve richiedere che qualcuno si ricordi di
// avvisare il registro. È lo stesso meccanismo con cui in Lantern un blocco-
// lampada accende la sua luce.
mondo.onEvento = (e) => {
  if (decoro.evento(e)) aggiornaDecoro();
  // ⚠ E L'ERBA VA RISEMINATA, se no posare un blocco d'erba non fa crescere
  // niente. Misurato: cinque per cinque celle di erba posate, ZERO fili nuovi.
  // La coda della semina si riapre solo quando il giocatore CAMBIA CHUNK
  // (`_ccx/_ccz` in `vegetazione/erba.js`), che è giusto per chi cammina e
  // cieco per chi costruisce. Committente: «non posso piazzare o rompere
  // lampioni alberi erba».
  // ⚠ E COSTA POCO: la cache dei ciuffi ha la revisione del chunk nella chiave,
  // quindi i chunk non toccati escono dalla cache e solo quello cambiato si
  // rifà davvero.
  erba.risemina();
};

/**
 * LA STAGIONE SEGUE IL CALENDARIO, con quattordici giorni di passaggio.
 *
 * ⚠ E SI RIDIPINGE A GRADINI, non a ogni fotogramma. Ritingere vuol dire
 * camminare i buffer dei colori di tutti i chunk e riseminare centomila
 * lamelle: farlo sessanta volte al secondo per due settimane di gioco sarebbe
 * assurdo. Venti gradini su due settimane sono un passo ogni diciassette ore di
 * gioco — invisibile all'occhio e gratis per la macchina.
 */
const PASSI_STAGIONE = 20;
let _passoStagione = -1;
function aggiornaStagione() {
  const s = stagioneAlGiorno(giorno.giorno);
  const passo = Math.round(s.mix * PASSI_STAGIONE);
  const chiave = `${s.da}|${s.a}|${passo}`;
  if (chiave === _passoStagione) return;
  const primaCorrente = stagioneCorrente();
  _passoStagione = chiave;
  impostaMescolanza(s.da, s.a, passo / PASSI_STAGIONE);
  // il terreno: si ritingono le cime d'erba marcate dal mesher
  mesher.ritintaErba((y) => {
    const p = paletteBlocco('erba', y);
    return { r: ((p.cima >> 16) & 255) / 255, g: ((p.cima >> 8) & 255) / 255, b: (p.cima & 255) / 255 };
  });
  // ⚠ «scorda», NON «risemina»: la seconda riapre la coda ma i chunk escono
  // dalla CACHE, che non ha la stagione nella chiave — e tornano fuori i ciuffi
  // vecchi, col colore vecchio.
  erba.scorda();
  // ⚠ E IL REMESH SOLO QUANDO CAMBIA LA STAGIONE DOMINANTE: l'inverno cambia
  // anche la SABBIA, che è cotta nella geometria e non passa da `ritintaErba`.
  // Farlo a ogni gradino vorrebbe dire ricostruire il mondo venti volte.
  if (stagioneCorrente() !== primaCorrente) {
    ritingiFogliame();
    if (stagioneCorrente() === 'inverno' || primaCorrente === 'inverno') mesher.ricostruisciTutto(mondo);
  }
}

// ---- il cantiere: rompere, posare, illuminare -------------------------------
const cantiere = new Cantiere(mondo, rig.luci);
cantiere.scegli(1);                       // si parte con l'erba in mano
const mirino = fabbrica.mirino();
const anteprima = fabbrica.anteprima();
const meshColpetto = fabbrica.colpetto();
/** Chi sta rispondendo al tocco, e da quando. ⚠ UNO SOLO: due colpetti insieme
 *  si leggerebbero come un tremolio, e comunque si clicca una cosa per volta. */
let colpo = null;
/** Dov'è il puntatore, in pixel di tela. Null = mira al centro dello schermo. */
let puntatore = { x: 0, y: 0 };
/** Il bersaglio calcolato una volta per fotogramma, riusato da HUD e clic. */
let bersaglio = null;

// ⚠ IL BERSAGLIO SI CALCOLA UNA VOLTA SOLA, nel giro del fotogramma, e non
// dentro il gestore del clic. Ricalcolarlo al clic sembra più «giusto» e invece
// introduce uno scarto: fra l'ultimo disegno e il clic la camera può essersi
// mossa, e si rompe un blocco diverso da quello che aveva il mirino addosso.
// Quello che si vede evidenziato è quello che si rompe, per costruzione.
/** Cosa farà il prossimo clic: 'rompi' | 'posa' | 'interagisci' | 'pianta' | 'rasa' | null. */
let cosaFa = null;
/** La cella su cui agisce l'erbetta: quella d'aria sopra il blocco puntato. */
let cellaErba = null;

function aggiornaMira() {
  const r = rig.raggioDaPuntatore(puntatore.x, puntatore.y);
  // ⚠ IL RAGGIO SI TIRA FINO A LÀ, il braccio si controlla dopo: vedi `mira.js`.
  // ⚠ E GUARDA ANCHE LE SCATOLE DEI LAMPIONI, che non sono blocchi: la griglia
  // sotto di loro è vuota e il cammino ci passava attraverso.
  const b = miraCompleta(mondo, r.origine, r.verso, decoro.scatole(), portataRaggio(rig.camera.radius));
  bersaglio = null; cosaFa = null;
  // ⚠ UNA DECORAZIONE HA UNA CELLA COME TUTTI, e la portata si misura su
  // quella: la scatola è alta quattro celle, e misurare dal suo centro
  // vorrebbe dire poter rompere la punta di un albero che ha i piedi fuori
  // portata.
  const dentro = b && (b.dato ? raggiungibile(b.dato.cella, passeggero)
                              : b.cella && raggiungibile(b.cella, passeggero));
  if (dentro) {
    bersaglio = b;
    // ⚠ L'ERBETTA VIVE SOPRA IL BLOCCO, non dentro: si punta un blocco e si
    // agisce sulla cella d'aria che ha sopra, che è dove i fili crescono.
    // Vale qualunque faccia si stia colpendo — puntare il fianco di una
    // terrazza e vedersi piantare l'erba di lato sarebbe incomprensibile.
    cellaErba = b.dato ? b.dato.cella
      : (b.cella ? [b.cella[0], b.cella[1] + 1, b.cella[2]] : null);
    const fili = cellaErba && erba.haFili(cellaErba[0], cellaErba[1], cellaErba[2], mondo);
    cosaFa = cantiere.azione(decoro.interattivo(b.dato), demolisce(), fili);
    // ⚠ E «posa» SI DECLASSA A NIENTE SE NON C'È DOVE POSARE: la cella davanti
    // può essere occupata, o può essere addosso al giocatore (murarsi da soli è
    // il primo modo in cui un gioco a blocchi si rompe). Meglio un mirino che
    // non promette niente di un clic che non fa niente.
    if (cosaFa === 'posa' && !(b.prima && posabile(mondo, b.prima, passeggero))) cosaFa = null;
    // ⚠ E «rompi» SU UNA DECORAZIONE ROMPE LEI, non il blocco che ha dietro.
  }

  // ⚠ IL MIRINO DICE ANCHE COSA SUCCEDERÀ, col colore: bianco = si rompe,
  // verde = si posa, giallo = si accende. È l'unico modo per non dover
  // indovinare quale delle due celle sta per essere toccata.
  const COLORE = { rompi: [1, 1, 1], posa: [0.55, 1, 0.6], interagisci: [1, 0.86, 0.45],
                   pianta: [0.45, 1, 0.4], rasa: [1, 0.6, 0.35] };
  // ⚠ IL MIRINO VA SULLA CELLA DELLA DECORAZIONE quando è lei il bersaglio: se
  // no evidenzia il terreno DIETRO l'albero e sembra che si stia per rompere
  // quello — cioè mente proprio nel momento in cui deve chiarire.
  const cellaMirino = bersaglio && (bersaglio.dato ? bersaglio.dato.cella : bersaglio.cella);
  fabbrica.muoviMirino(mirino, cellaMirino, COLORE[cosaFa] || [1, 1, 1]);
  // ⚠ E L'ANTEPRIMA MOSTRA IL BLOCCO VERO, con la sua forma e i suoi colori:
  // che un blocco d'erba abbia il cappello si vede prima di cliccare, non dopo.
  fabbrica.muoviAnteprima(anteprima, cosaFa === 'posa' ? formaDi(cantiere.tipoScelto) : null,
    cosaFa === 'posa' ? bersaglio.prima : null);
  // ⚠ E IL MIRINO SI SPOSTA SULLA CELLA DELL'ERBETTA quando è lei il bersaglio:
  // se restasse sul blocco sotto direbbe il posto sbagliato di un'unità.
  if ((cosaFa === 'pianta' || cosaFa === 'rasa') && cellaErba) {
    fabbrica.muoviMirino(mirino, cellaErba, COLORE[cosaFa]);
  }
}

// ⚠ LE FORME SI TENGONO DA PARTE: `geometriaSingola` ricostruisce il blocco da
// zero, e chiamarla a ogni fotogramma vorrebbe dire rifare la stessa geometria
// sessanta volte al secondo per un cubo che non cambia mai.
const _forme = new Map();
function formaDi(tipo) {
  if (!tipo) return null;
  if (!_forme.has(tipo)) {
    let g = geometriaSingola(tipo);
    // ⚠ UNA DECORAZIONE NON HA GEOMETRIA, e l'anteprima usciva VUOTA: zero
    // vertici, cioè nessun segno di dove sarebbe finito il ciuffo. Il
    // committente l'ha visto come «non riesco a piazzarla dove voglio» — e
    // aveva ragione, perché senza anteprima si posa alla cieca.
    // La forma la disegna un MODELLO, che qui non c'è; quindi si disegna la sua
    // SCATOLA, con la sua misura vera e il suo colore. Non è il ciuffo, ma dice
    // le due cose che servono: dove va e quanto è grande.
    if (!g.pos.length && DECORAZIONI[tipo]) g = scatolaAnteprima(DECORAZIONI[tipo]);
    _forme.set(tipo, { ...g, tipo });
  }
  return _forme.get(tipo);
}

/**
 * UNA SCATOLA, in coordinate CENTRATE SULLA CELLA — come le costruisce il
 * mesher (`cx = x + 0.5`), se no l'anteprima esce spostata di mezzo blocco.
 * ⚠ E POGGIA SUL FONDO DELLA CELLA: un ciuffo alto nove decimi centrato darebbe
 * una scatola mezza sottoterra, che è esattamente il contrario di «dove va».
 */
function scatolaAnteprima(d) {
  const mx = d.mezza, h = d.altezza;
  const y0 = -0.5, y1 = -0.5 + h;
  const V = [[-mx, y0, -mx], [mx, y0, -mx], [mx, y0, mx], [-mx, y0, mx],
             [-mx, y1, -mx], [mx, y1, -mx], [mx, y1, mx], [-mx, y1, mx]];
  const F = [[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],
             [1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]];
  const pos = [], col = [];
  const c = [((d.cima >> 16) & 255) / 255, ((d.cima >> 8) & 255) / 255, (d.cima & 255) / 255];
  for (const t of F) for (const i of t) { pos.push(...V[i]); col.push(...c); }
  return { pos: new Float32Array(pos), col: new Float32Array(col) };
}

/** Fa quello che il mirino sta promettendo. */
function agisci() {
  if (!bersaglio || !cosaFa) return;
  if (cosaFa === 'interagisci') { decoro.alterna(bersaglio.dato); applicaLuciDecoro(); tocca(); }
  else if (cosaFa === 'rompi') cantiere.rompi(...(bersaglio.dato ? bersaglio.dato.cella : bersaglio.cella));
  else if (cosaFa === 'posa') cantiere.posa(...bersaglio.prima);
  // ⚠ L'ERBETTA NON TOCCA IL MONDO: è vegetazione, non un blocco. Il mondo non
  // sa che esista, ed è giusto così — sono due cose diverse.
  else if (cosaFa === 'pianta' && cellaErba) { erba.togliRasa(cellaErba[0], cellaErba[2]); erba.posa(...cellaErba); tocca(); }
  else if (cosaFa === 'rasa' && cellaErba) { erba.rasa(cellaErba[0], cellaErba[2]); tocca(); }
}

/**
 * TOCCA quello che si sta guardando: si gonfia un momento e torna.
 *
 * ⚠ IL MONDO NON CAMBIA DI UN BIT — è il vincolo del committente, «solo
 * graficamente mi raccomando». E serve: fino a ora cliccare una cosa che non fa
 * niente non dava nessun segnale, e un gesto senza risposta si legge come
 * «rotto» anche quando è solo «niente da fare qui».
 */
function tocca() {
  if (!bersaglio) return false;
  if (bersaglio.dato) colpo = { voce: bersaglio.dato, t0: performance.now() };
  else if (bersaglio.cella && mondo.tipo(...bersaglio.cella)) {
    colpo = { cella: bersaglio.cella, tipo: mondo.tipo(...bersaglio.cella), t0: performance.now() };
  }
  return !!colpo;
}

/** Un fotogramma di colpetto. ⚠ Si spegne DA SOLO: `scalaColpetto` torna
 *  esattamente 1 fuori dalla finestra, e su quell'1 si smette di disegnare. */
function aggiornaColpetto() {
  if (!colpo) return;
  const s = scalaColpetto(performance.now() - colpo.t0);
  if (colpo.voce) {
    // ⚠ UNA DECORAZIONE SI GONFIA NELLA SUA MATRICE, e quindi si ridisegnano le
    // istanze di quel modello. Costa una manciata di matrici per fotogramma per
    // due decimi di secondo — e solo mentre dura.
    colpo.voce.scala = s;
    _versioneDisegnata = -1;
    aggiornaDecoro();
  } else {
    fabbrica.muoviColpetto(meshColpetto, formaDi(colpo.tipo), colpo.cella, s);
  }
  if (!inCorso(performance.now() - colpo.t0)) {
    if (colpo.voce) { colpo.voce.scala = 1; _versioneDisegnata = -1; aggiornaDecoro(); }
    else fabbrica.muoviColpetto(meshColpetto, null, null, 1);
    colpo = null;
  }
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
  // ⚠ IL DESTRO ADESSO INTERAGISCE, NON ROMPE PIÙ. Committente: «dammi la
  // possibilità di interagire con la qualunque, anche con i blocchi». Quindi:
  // se il bersaglio si accende, si accende; e in OGNI caso dà il colpetto —
  // anche un cubo di pietra, che di suo non fa niente. È la differenza fra un
  // mondo che risponde e uno che ignora.
  // ⚠ E PER ROMPERE C'È SHIFT (o il piccone sul telefono): un tasto solo non
  // può fare due cose, e fra le due quella che mancava era questa.
  if (e.button === 2 && bersaglio) {
    if (decoro.interattivo(bersaglio.dato)) { decoro.alterna(bersaglio.dato); applicaLuciDecoro(); }
    tocca();
    return;
  }
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
  // ⚠ UN ATTREZZO NON È UN BLOCCO: nome e colore vengono dalla sua tabella,
  // non da `defDi`, che per «erbetta» non saprebbe niente.
  colorePer: (t) => '#' + (ATTREZZI[t] ? ATTREZZI[t].colore : defDi(t).cima).toString(16).padStart(6, '0'),
  nomePer: (t) => (ATTREZZI[t] ? ATTREZZI[t].nome : defDi(t).nome),
  onScegli: (i) => cantiere.scegli(i),
});

// ---- il ciclo del giorno, e il pannello per pilotarlo ------------------------
const giorno = new Giorno(rig, { durata: 300, ora: 0.42 });

// ⚠ LE STAGIONI C'ERANO GIÀ TUTTE — quattro palette, la transizione morbida, la
// ritinta del fogliame nelle texture — e non le collegava nessuno. Erano
// arrivate con lo strato mondo e stavano lì dalla migrazione: 300 righe che
// giravano a vuoto. Committente: «mancano anche le stagioni».
const cielo = new PannelloCielo({
  stagioni: STAGIONI,
  stagione: stagioneCorrente(),
  onOra: (t) => { giorno.t = t; giorno.applica(); },
  // ⚠ `null` VUOL DIRE «alterna», un booleano vuol dire «metti così»: la barra
  // dell'ora deve poter SPEGNERE il ciclo senza rischiare di riaccenderlo.
  onCiclo: (v) => { giorno.auto = v === null ? !giorno.auto : v; },
  // ⚠ CLICCARE UNA STAGIONE ADESSO SPOSTA LA DATA, non fa partire una
  // dissolvenza: da quando l'anno è un asse vero, «mettimi in autunno» vuol
  // dire «portami al 15 ottobre». Una dissolvenza slegata dal calendario
  // avrebbe fatto due verità sulla stessa cosa.
  onStagione: (k) => {
    const i = INIZIO_STAGIONE.findIndex((s) => s.chiave === k);
    if (i >= 0) giorno.impostaGiorno(INIZIO_STAGIONE[i].giorno + 25);
  },
  onGiorno: (g) => giorno.impostaGiorno(g),
});

// ⚠ I TASTI SI LEGGONO PER CODICE FISICO (`e.code`), non per carattere: su una
// tastiera italiana `,` e `.` stanno dove stanno, e leggendo `e.key` i comandi
// cambierebbero posto cambiando disposizione. `Comma` e `Period` sono il tasto,
// non il segno.
addEventListener('keydown', (e) => {
  if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.code === 'Comma') { giorno.auto = false; giorno.t = (giorno.t + 0.985) % 1; giorno.applica(); }
  else if (e.code === 'Period') { giorno.auto = false; giorno.t = (giorno.t + 0.015) % 1; giorno.applica(); }
  else if (e.code === 'KeyP') giorno.auto = !giorno.auto;
  else if (e.code === 'KeyQ' && bersaglio) cantiere.rompi(...(bersaglio.dato ? bersaglio.dato.cella : bersaglio.cella));
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

/** La data come la legge un umano: «15 apr». */
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
function etichettaData() {
  const d = new Date(Date.UTC(giorno.anno, 0, 1) + giorno.giorno * 86400000);
  return `${d.getUTCDate()} ${MESI[d.getUTCMonth()]}`;
}

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
    // ⚠ E QUI C'È IL RAPPORTO FRA PIXEL RESI E PIXEL A SCHERMO, che è il numero
    // che distingue «l'immagine è sporca» da «l'immagine è INGRANDITA». Se la
    // tela CSS è più grande di quella resa, tutto viene stirato e ogni bordo
    // diventa una scaletta — e a occhio si legge come acne, glitch, strisce,
    // qualunque cosa. Senza questo numero le due ipotesi si somigliano, e ci ho
    // già perso un giro cercando un'acne che non c'era.
    `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'}  q${scala.livello}/${scala.quanti - 1}` +
    `${scala.adatta.manuale ? '·mano' : ''}  ${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()}` +
    ` su ${tela.clientWidth}×${tela.clientHeight}` +
    ` (×${(rig.motore.getRenderWidth() / Math.max(1, tela.clientWidth)).toFixed(2)})` +
    `  dpr ${devicePixelRatio}  ${p(0.5)}/${p(0.99)} ms\n` +
    `ombre ${rig.profilo.sole ? rig.ombre.numCascades + '×' + rig.profilo.mappa : 'no'}` +
    `  lampade ${rig.fissi.ombreLampade ? 'con ombra' : 'senza'}` +
    `  erba ${(erba.attiva ? erba.fili : 0).toLocaleString('it')}\n` +
    `${rig.scheda.software ? '⚠ DISEGNA IN SOFTWARE' : rig.scheda.nome.slice(0, 40)}\n` +
    `chunk ${mesher.chunks.size}   blocchi ${mondo.contaBlocchi.toLocaleString('it')}   ` +
    `luci ${rig.luci.accese}   decorazioni ${decoro.quanti} (${decoro.accesi} accese)\n` +
    `worldgen ${tGen.toFixed(0)} ms   mesh ${tMesh.toFixed(0)} ms\n` +
    `\n${giorno.orologio}${giorno.auto ? '' : ' (fermo)'}\n` +
    `clic = quello che hai in mano · destro rompe · centrale copia\n` +
    `destro tocca e accende · maiusc+clic rompe\n` +
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
  // ⚠ LA STAGIONE SEGUE IL CALENDARIO, non un cronometro: vedi
  // `aggiornaStagione` più su. La vecchia transizione a tempo è sparita perché
  // diceva una seconda verità sulla stessa cosa — l'anno adesso è un asse.
  aggiornaStagione();

  // ⚠ I LAMPIONI SEGUONO LA NOTTE, come in Lantern: si accendono da soli quando
  // il sole scende, e l'interruttore a mano vale fino al prossimo cambio.
  if (decoro.aggiornaNotte(giorno.t < 0.24 || giorno.t > 0.80)) applicaLuciDecoro();
  aggiornaDecoro();
  aggiornaMira();
  // ⚠ E IL COLPETTO VA CHIAMATO, che sembra ovvio e invece era la riga
  // mancante: la funzione era scritta, provata e mai eseguita. Il committente
  // l'ha visto come «non hai integrato l'interagire con l'animazione» — ed era
  // esatto, perché il pezzo che mancava era l'integrazione, non il pezzo.
  aggiornaColpetto();
  // il quadrante del cielo: dove sta il sole, dove guardo io
  const d = rig.sole.direction;
  cielo.aggiorna({
    t: giorno.t, orologio: giorno.orologio, auto: giorno.auto,
    // ⚠ LA DIREZIONE DEL SOLE PUNTA VERSO LA SCENA, non verso il sole: per
    // sapere DOVE STA il sole si gira di segno. È lo stesso segno che nello
    // shader fa `-uSoleVerso`, e sbagliarlo qui darebbe un quadrante
    // specchiato — che si nota solo confrontandolo con le ombre vere.
    altezza: -d.y, dir: { x: -d.x, z: -d.z }, vista: rig.versoCamera(),
    // ⚠ LA LUNA HA LA SUA POSIZIONE, non è più «l'opposto del sole»: a mezzo
    // mese sta a novanta gradi, ed è quello che si chiama primo quarto.
    luna: giorno.astroLuna && {
      x: -Math.sin(giorno.astroLuna.azimut * Math.PI / 180),
      z: Math.cos(giorno.astroLuna.azimut * Math.PI / 180),
      altezza: Math.sin(giorno.astroLuna.altezza * Math.PI / 180),
      fase: giorno.astroLuna.fase, illuminata: giorno.astroLuna.illuminata,
    },
    giorno: giorno.giorno, data: etichettaData(), stagione: stagioneCorrente(),
  });
  // ⚠ L'ETICHETTA DEVE DIRE ANCHE **COSA**, non solo cosa si fa. Diceva «rompi ·
  // mano vuota», che nomina la MANO: guardando un ciuffo in mezzo all'erba non
  // si sapeva se si stesse per rompere lui o il blocco sotto. Adesso quando il
  // bersaglio è una decorazione si chiama per nome.
  const nomeBersaglio = (cosaFa === 'pianta' || cosaFa === 'rasa') ? 'erbetta'
    : bersaglio && bersaglio.dato
    ? defDi(bersaglio.dato.tipo).nome
    : (cosaFa === 'rompi' && bersaglio && bersaglio.cella && mondo.tipo(...bersaglio.cella)
        ? defDi(mondo.tipo(...bersaglio.cella)).nome
        : cantiere.nomeScelto);
  barra.aggiorna(cantiere.scelto, cosaFa
    ? `<b>${NOME_AZIONE[cosaFa]}</b> · ${nomeBersaglio}`
    : `— · ${cantiere.nomeScelto}`);
  aggiornaStato();
});

// una manina per lavorarci sopra dall'ispettore e dalla console
globalThis.LEAFY = { rig, fabbrica, mondo, mesher, erba, giorno, modelli, passeggero, cantiere, scala, decoro, barra, generaOpenWorld };

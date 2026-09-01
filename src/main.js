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
import { RICETTE } from './motore/acqua.js';
import { SceltaAcqua } from './ui/acqua.js';
import { quadro, stampaQuadro } from './gioco/misure.js';
import { semina, FAMIGLIE, caso } from './world/flora.js';
import { Flora } from './motore/flora.js';
import { Mondo } from './world/world.js';
import { Mesher, collegaFabbrica as fabbricaMesher } from './world/mesher.js';
import { collegaFabbrica as fabbricaStagioni } from './world/stagioni.js';
import { generaOpenWorld, LIVELLO_ACQUA } from './world/worldgen.js';
import { peloVicino, pianoDaTenere } from './world/pelo.js';
import { Erba, collegaFabbrica as fabbricaErba } from './vegetazione/erba.js';
import { Passeggero, tastiera } from './gioco/passeggero.js';
import { miraCompleta, posabile, raggiungibile, portataRaggio } from './gioco/mira.js';
import { Cantiere, CASSETTA, NOME_AZIONE, ATTREZZI, daEsadecimale } from './gioco/cantiere.js';
import { Decoro } from './gioco/decoro.js';
import { registraDecorazioni, DECORAZIONI } from './world/decorazioni.js';
import { ascoltaClic, ascoltaPressione } from './gioco/puntatore.js';
import { scalaColpetto, inCorso, DURATA as DURATA_COLPETTO,
         scalaPosa, DURATA_POSA, scalaDanno, tremolio } from './gioco/effetti.js';
import { Scavo, durataPer } from './gioco/scavo.js';
import { Schegge, PER_COLPO, PER_ROTTURA } from './gioco/schegge.js';
import { Barra } from './ui/barra.js';
import { ComandiTocco } from './ui/comandi.js';
import { ModoGui } from './ui/modo.js';
import { Diagnostica } from './ui/diagnostica.js';
import { PannelloCielo } from './ui/cielo.js';
import { STAGIONI, stagioneCorrente, stagioneAlGiorno, impostaMescolanza,
         INIZIO_STAGIONE } from './world/stagioni.js';
import { defDi } from './world/blocks.js';
import { paletteBlocco, ritingiFogliame } from './world/stagioni.js';
import { geometriaSingola } from './world/mesher.js';
import { ScalaQualita, misuraHz, faticaRicordata } from './motore/qualita.js';

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
// ⚠ L'ESTENSIONE È PARAMETRICA (`?mondo=N`, semilato in blocchi) PER MISURARE
// LA SCALA, ed è il primo passo verso il mondo grande chiesto dal committente
// («facciamo il mondo alto 300 blocchi e largo 4k così testiamo bene il
// chunking e le performance»).
//
// ⚠ E I NUMERI DICONO CHE 4k NON SI FA COSÌ, va detto prima di provarci:
// misurata in Node la generazione TUTTA IN UNA VOLTA (che è quella di oggi),
// costa ~7,8 µs e ~0,55 KB per colonna, lineare — 66 ms/10 MB a semilato 48,
// 801 ms/56 MB a 160. Un mondo 4000×4000 sono 16 milioni di colonne: **~2
// minuti di blocco e ~9 GB di RAM**, prima ancora di contare i 300 di altezza.
// Non è una taratura: serve la generazione PER CHUNK a richiesta più lo
// scarico dei chunk lontani (lo streaming della fase R3), e la coda del mesher
// è già il modello giusto. Fino ad allora questo parametro serve a trovare il
// tetto vero di oggi con una misura invece che con una speranza.
const _semilato = Math.max(16, Math.min(400, Number((location.search.match(/[?&]mondo=(\d+)/) || [])[1]) || 48));
const { alberi, lampioni } = generaOpenWorld(mondo, 4242, _semilato);
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
// ⚠ SOLO QUELLO CHE SI HA ADDOSSO, il resto arriva mentre si guarda. Vedi
// `ricostruisciTutto`: sul telefono del committente i 49 chunk in un blocco solo
// erano 5.507 ms di pagina congelata prima di vedere qualcosa.
// ⚠ E IL PUNTO È L'ORIGINE, non il passeggero: quello nasce trenta righe più in
// giù (gli serve la quota del terreno, che si legge dal mondo appena fatto), e
// nominarlo qui darebbe un errore di zona morta. Il mondo si genera attorno allo
// zero e lì si nasce, quindi è lo stesso punto detto prima di poterlo chiedere.
mesher.ricostruisciTutto(mondo, { x: 0.5, z: 0.5 });
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
// ⚠ I COMANDI A DITO SI CREANO SEMPRE, e a decidere se si vedono è una CLASSE
// sulla radice. Prima si creavano solo se il browser diceva «tocco», cioè si
// decideva una volta per tutte all'avvio — e su un Chromebook quella decisione
// è sbagliata metà del tempo, perché lo stesso coso è un portatile o un tablet
// secondo come lo tieni. Committente: «manca il tastino per passare da modalità
// desktop e GUI smartphone, perché da Chromebook ho entrambe le modalità».
const comandi = new ComandiTocco(intento);
const modoGui = new ModoGui((aTocco) => {
  // ⚠ E IL JOYSTICK VA AZZERATO CAMBIANDO MODO: nascosto con «display: none»
  // non riceve più eventi, quindi se lo si stava tenendo l'ultimo valore
  // resterebbe lì per sempre — cioè si camminerebbe da soli, senza toccare
  // niente e senza capire perché.
  if (!aTocco && comandi.azzera) comandi.azzera();
});
/** ⚠ SUL TELEFONO È IL PICCONE, sul computer è il tasto destro tenuto premuto:
 *  due modi diversi per la stessa cosa, perché i due dispositivi hanno cose
 *  diverse da premere. Il nome è uno solo, e l'etichetta sopra la barra dice
 *  sempre la verità su cosa farà il prossimo clic. */
// ⚠ ADESSO IL TASTO BASTA DA SÉ, e questo non è più un modificatore: è la
// scelta di COSA FAR VEDERE. Committente: «voglio tasto sinistro mano libera per
// distruggere [...] tasto destro interagisci o piazzi se hai selezionato in mano
// qualcosa». Con due tasti che fanno due cose diverse, il mirino non può
// promettere una cosa sola — quindi mostra quella del tasto che stai per usare:
// sul computer Shift anticipa il sinistro, sul telefono lo fa il piccone (che lì
// è l'unico modo di dire quale dei due tasti sta emulando il dito).
let shiftGiu = false;
addEventListener('keydown', (e) => { if (e.key === 'Shift') shiftGiu = true; });
addEventListener('keyup', (e) => { if (e.key === 'Shift') shiftGiu = false; });
addEventListener('blur', () => { shiftGiu = false; });
/** Il mirino mostra il tasto che distrugge? Sul telefono è il piccone. */
const mostraDistruggi = () => shiftGiu || (modoGui.aTocco && !!comandi.demolisci);
/** Sul telefono il dito è UN tasto solo: il piccone dice quale dei due. */
/** ⚠ Vale solo a dito: col mouse il piccone non c'è e non deve contare. */
const ditoDistrugge = () => modoGui.aTocco && !!comandi.demolisci;
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

// ---- la flora: il mondo si veste, e la «prova dei 9000» ha la sua leva ------
// ⚠ CINQUE FAMIGLIE PROCEDURALI a thin instances: il costo per fotogramma
// cresce con le FAMIGLIE (un disegno l'una), non con le istanze — è il
// meccanismo su cui saliranno i 9000 asset veri, e intanto il mondo smette di
// essere «3 asset in croce». `?carico=N` moltiplica la densità per la prova di
// carico misurata (N=8 ≈ seimila istanze); senza parametro, densità da tabella.
const caricoFlora = Number((location.search.match(/[?&]carico=(\d+)/) || [])[1] || 1);
const flora = new Flora(rig, fabbrica.matMondo);
{
  const semi = semina(mondo, { x0: -48, z0: -48, x1: 49, z1: 49 }, { yMin: 2, yMax: 26, densita: caricoFlora });
  const rGeo = caso(715);
  for (const [nome, f] of Object.entries(FAMIGLIE)) {
    // ⚠ DUE VARIANTI PER FAMIGLIA, non una: con la geometria unica l'occhio
    // aggancia la ripetizione in tre secondi (è il difetto «tileset» dell'acqua,
    // trasferito ai cespugli). Due varianti + scala + giro bastano a romperla,
    // e il conto dei disegni resta a dieci.
    const meta = Math.ceil(semi[nome].length / 2);
    flora.pianta(nome + ':a', f.costruisci(rGeo), semi[nome].slice(0, meta), { proietta: f.proietta });
    flora.pianta(nome + ':b', f.costruisci(rGeo), semi[nome].slice(meta), { proietta: f.proietta });
  }
}
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
  _aloniAccesi = punti;
  _aloniDove = null;             // costringe il riconfezionamento al giro dopo
}

/**
 * GLI ALONI SI RICONFEZIONANO QUANDO SERVE, non a ogni fotogramma e non solo
 * quando cambia una luce.
 *
 * ⚠ IL TAGLIO PER DISTANZA DIPENDE DA DOVE STA LA CAMERA, quindi non può stare
 * in `applicaLuciDecoro`, che gira solo quando una lampada si accende: fermo lì,
 * camminando si porterebbe dietro gli aloni scelti dieci minuti prima. Ma non
 * serve nemmeno rifarlo sessanta volte al secondo — la lista cambia solo se ci
 * si è spostati di qualche blocco. Due metri di soglia e il lavoro sparisce.
 */
let _aloniAccesi = [];
let _aloniDove = null;
function aggiornaAloni() {
  const c = rig.camera.position;
  if (_aloniDove) {
    const dx = c.x - _aloniDove.x, dy = c.y - _aloniDove.y, dz = c.z - _aloniDove.z;
    if (dx * dx + dy * dy + dz * dz < 4) return;
  }
  _aloniDove = { x: c.x, y: c.y, z: c.z };
  // ⚠ LA PORTATA È QUELLA DELLA NEBBIA: oltre, l'alone è dentro il grigio e non
  // si vede — ma senza questo taglio finiva in GPU lo stesso, perché la mesh
  // degli aloni è «sempre attiva» e Babylon non la culla (vedi `aloni`).
  fabbrica.muoviAloni(aloni, _aloniAccesi, c, (rig.scena.fogEnd || 120) + 8);
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
  // ⚠ «subito» PERCHÉ QUESTO È UN GESTO, non una passeggiata: c'è qualcuno che
  // ha appena cliccato e sta guardando esattamente lì. Misurato: cinque
  // fotogrammi prima, uno adesso. Vedi BUDGET_GESTO in `vegetazione/erba.js`.
  erba.risemina(true);
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
    // ⚠ ANCHE QUI A SCAGLIONI: un cambio di stagione a metà partita rifà tutti i
    // chunk, ed è lo stesso blocco dell'avvio — solo che qui capita mentre si
    // sta giocando, cioè nel momento peggiore.
    if (stagioneCorrente() === 'inverno' || primaCorrente === 'inverno') mesher.ricostruisciTutto(mondo, passeggero);
  }
}

// ---- il cantiere: rompere, posare, illuminare -------------------------------
const cantiere = new Cantiere(mondo, rig.luci);
cantiere.scegli(1);                       // si parte con l'erba in mano
const mirino = fabbrica.mirino();
const anteprima = fabbrica.anteprima();
const meshColpetto = fabbrica.colpetto();
// ⚠ TRE FANTASMI E NON UNO. Sembrano lo stesso oggetto — una copia del blocco —
// ma i tre effetti possono capitare INSIEME: si dà un colpo a un muro (danno),
// si gira e si posa un blocco (atterraggio), e nel frattempo il colpetto di
// prima non è ancora finito. Con una mesh sola l'ultimo arrivato ruberebbe la
// geometria agli altri, che sparirebbero a metà — un difetto che si vedrebbe
// solo ogni tanto, cioè il peggiore da ritrovare. Tre mesh nascoste costano
// nulla: una mesh disabilitata non entra nemmeno nella selezione.
const meshDanno = fabbrica.colpetto();
const meshPosa = fabbrica.colpetto();
/** Chi sta rispondendo al tocco, e da quando. ⚠ UNO SOLO: due colpetti insieme
 *  si leggerebbero come un tremolio, e comunque si clicca una cosa per volta. */
let colpo = null;
/** Il blocco appena posato che sta ancora atterrando. */
let posa = null;
/** Dov'è il puntatore, in pixel di tela. Null = mira al centro dello schermo. */
let puntatore = { x: 0, y: 0 };
/** Il bersaglio calcolato una volta per fotogramma, riusato da HUD e clic. */
let bersaglio = null;

// ⚠ IL BERSAGLIO SI CALCOLA UNA VOLTA SOLA, nel giro del fotogramma, e non
// dentro il gestore del clic. Ricalcolarlo al clic sembra più «giusto» e invece
// introduce uno scarto: fra l'ultimo disegno e il clic la camera può essersi
// mossa, e si rompe un blocco diverso da quello che aveva il mirino addosso.
// Quello che si vede evidenziato è quello che si rompe, per costruzione.
/** Cosa fa ciascun tasto su questo bersaglio. ⚠ SE NE CALCOLANO DUE, non una:
 *  i due tasti fanno due cose diverse, e il mirino ne può mostrare solo una —
 *  ma l'etichetta sotto la barra le dice tutte e due, che è il modo di
 *  IMPARARE la mappa dei tasti senza doverla leggere da qualche parte. */
let azSinistra = null, azDestra = null;
/** Quella che il mirino sta mostrando: 'rompi' | 'posa' | 'interagisci' | ... */
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
    const inter = decoro.interattivo(b.dato);
    azSinistra = cantiere.azione(inter, true, fili);
    azDestra = cantiere.azione(inter, false, fili);
    // ⚠ E «posa» SI DECLASSA A «tocca» SE NON C'È DOVE POSARE: la cella davanti
    // può essere occupata, o può essere addosso al giocatore (murarsi da soli è
    // il primo modo in cui un gioco a blocchi si rompe). Meglio un mirino che
    // non promette niente di un clic che non fa niente — ma il colpetto lo dà
    // lo stesso, se no un clic a vuoto sembra un gioco che si è piantato.
    if (azDestra === 'posa' && !(b.prima && posabile(mondo, b.prima, passeggero))) azDestra = 'tocca';
    cosaFa = mostraDistruggi() ? azSinistra : azDestra;
    // ⚠ E «rompi» SU UNA DECORAZIONE ROMPE LEI, non il blocco che ha dietro.
  }

  // ⚠ IL MIRINO DICE ANCHE COSA SUCCEDERÀ, col colore: bianco = si rompe,
  // verde = si posa, giallo = si accende. È l'unico modo per non dover
  // indovinare quale delle due celle sta per essere toccata.
  const COLORE = { rompi: [1, 0.55, 0.45], posa: [0.55, 1, 0.6], interagisci: [1, 0.86, 0.45],
                   pianta: [0.45, 1, 0.4], rasa: [1, 0.6, 0.35], tocca: [1, 1, 1] };
  // ⚠ IL MIRINO VA SULLA CELLA DELLA DECORAZIONE quando è lei il bersaglio: se
  // no evidenzia il terreno DIETRO l'albero e sembra che si stia per rompere
  // quello — cioè mente proprio nel momento in cui deve chiarire.
  const cellaMirino = bersaglio && (bersaglio.dato ? bersaglio.dato.cella : bersaglio.cella);
  fabbrica.muoviMirino(mirino, cellaMirino, COLORE[cosaFa] || [1, 1, 1]);
  // ⚠ E L'ANTEPRIMA MOSTRA IL BLOCCO VERO, con la sua forma e i suoi colori:
  // che un blocco d'erba abbia il cappello si vede prima di cliccare, non dopo.
  // ⚠ E PER LE DECORAZIONI MOSTRA IL MODELLO, non la sua scatola. Committente:
  // «le preview non corrispondono con il modello 3D». Un albero disegnato come
  // un parallelepipedo dice dove va ma mente sulla forma, e chi lo posa scopre
  // solo dopo com'era. Le due strade sono diverse perché diverse sono le cose:
  // un blocco ha una geometria che sappiamo costruire, un modello ce l'ha già.
  const tipoInMano = cantiere.tipoScelto;
  const posaModello = cosaFa === 'posa' && !!DECORAZIONI[tipoInMano] && modelliPronti.has(tipoInMano);
  fabbrica.muoviAnteprima(anteprima,
    cosaFa === 'posa' && !posaModello ? formaDi(tipoInMano) : null,
    cosaFa === 'posa' && !posaModello ? bersaglio.prima : null);
  if (posaModello) {
    // ⚠ GIRATO COME CI FINIRÀ: il giro di una decorazione è una funzione della
    // sua cella (vedi `decoro._metti`), quindi si può sapere PRIMA di posarla —
    // e se l'anteprima mostrasse un albero girato diversamente da quello che
    // compare, l'anteprima mentirebbe di nuovo, solo più sottilmente.
    const [x, , z] = bersaglio.prima;
    const giro = (((x * 73856093) ^ (z * 19349663)) >>> 0) / 4294967296 * Math.PI * 2;
    modelli.muoviFantasma(tipoInMano, bersaglio.prima, giro);
  } else modelli.nascondiFantasmi();
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

/* ---- rompere, posare, toccare: quello che succede a ogni clic --------------
 *
 * ⚠ TRE COSE DIVERSE CHE PRIMA ERANO UNA. Il committente le ha chieste insieme
 * perché a schermo si vedono insieme: «devi cliccare più volte per distruggere
 * lo stesso blocco/furniture, fallo capire con degli effetti» e «manca proprio
 * l'animazione di piazzamento di tutto e distruzione di tutto». Sono:
 *   lo SCAVO      — il conto dei colpi (gioco/scavo.js, provato in Node)
 *   le SCHEGGE    — i pezzetti che saltano via (gioco/schegge.js, idem)
 *   le CURVE      — gonfia, trema, atterra (gioco/effetti.js, idem)
 * Qui c'è solo la regia: chi chiama chi, e quando.
 */

const scavo = new Scavo();
const schegge = new Schegge();
const meshSchegge = fabbrica.schegge(Schegge.vertici());

/** I colori di un blocco, per farne schegge dei suoi colori e non grigie. */
function coloriDi(tipo, y) {
  const d = DECORAZIONI[tipo];
  if (d) return [daEsadecimale(d.cima), daEsadecimale(d.cima)];
  const p = paletteBlocco(tipo, y);
  return [daEsadecimale(p.cima), daEsadecimale(p.lato), daEsadecimale(p.fondo)];
}

/** Il centro della cella, che è dove nascono le schegge. */
const centroDi = (c) => ({ x: c[0] + 0.5, y: c[1] + 0.5, z: c[2] + 0.5 });

/**
 * FA QUELLO CHE IL TASTO PROMETTE.
 * @param distruggi il tasto sinistro (o il piccone sul telefono)
 */
function agisci(distruggi) {
  if (!bersaglio) return;
  const atto = distruggi ? azSinistra : azDestra;
  if (!atto) return;
  // ⚠ «rompi» NON PASSA PIÙ DI QUI: rompere non è un gesto istantaneo, è una
  // pressione che dura (vedi `scava` e `gioco/scavo.js`). Committente: «la
  // distruzione non deve essere mai istantanea, devi tenere premuto come su
  // Minecraft». Resta però il caso della TASTIERA — vedi `Q`.
  if (atto === 'rompi') return;
  // ⚠ QUALUNQUE ALTRO GESTO MOLLA LO SCAVO: chi smette di scavare un blocco per
  // accenderne un altro non deve tornare e trovarlo ancora a tre quarti.
  scavo.molla();
  if (atto === 'interagisci') { decoro.alterna(bersaglio.dato); applicaLuciDecoro(); tocca(); }
  else if (atto === 'posa') { cantiere.posa(...bersaglio.prima); atterra(bersaglio.prima); }
  // ⚠ L'ERBETTA NON TOCCA IL MONDO: è vegetazione, non un blocco. Il mondo non
  // sa che esista, ed è giusto così — sono due cose diverse.
  else if (atto === 'pianta' && cellaErba) {
    erba.togliRasa(cellaErba[0], cellaErba[2]); erba.posa(...cellaErba);
    // ⚠ ANCHE L'ERBETTA HA LA SUA COMPARSA, e non poteva essere l'atterraggio
    // dei blocchi: i fili non sono un cubo. Sono le schegge, verso l'alto e coi
    // colori del prato — si legge come un ciuffo che spunta.
    schegge.scoppia(centroDi(cellaErba), coloriDi('erba', cellaErba[1] - 1), PER_COLPO, { x: 0, y: 1, z: 0 });
  }
  else if (atto === 'rasa' && cellaErba) {
    erba.rasa(cellaErba[0], cellaErba[2]);
    schegge.scoppia(centroDi(cellaErba), coloriDi('erba', cellaErba[1] - 1), PER_COLPO, null);
  }
  // ⚠ E «tocca» NON È «NIENTE»: committente, «anche se l'oggetto o cuboid non
  // cambia stato deve sentirsi questa interazione».
  else if (atto === 'tocca') tocca();
}

/**
 * UN FOTOGRAMMA DI SCAVO su quello che si sta guardando. Rompe quando è ora.
 *
 * ⚠ IL BERSAGLIO SI IDENTIFICA CON UNA CHIAVE, non con l'oggetto: una
 * decorazione è una voce di registro che sopravvive ai fotogrammi, ma un blocco
 * è solo tre numeri, e confrontare gli array darebbe sempre «diverso» — cioè un
 * blocco che non si rompe mai perché a ogni giro riparte da capo.
 */
function scava(adesso) {
  const dec = bersaglio && bersaglio.dato;
  const cella = bersaglio && (dec ? dec.cella : bersaglio.cella);
  if (!cella) { scavo.molla(); return; }
  const tipo = dec ? dec.tipo : mondo.tipo(...cella);
  if (!tipo) { scavo.molla(); return; }
  scavo.premi(cella.join(','), durataPer(defDi(tipo)), adesso);

  // ⚠ LE SCHEGGE SALTANO VERSO CHI SCAVA, cioè lungo la faccia mirata: è il
  // dettaglio che fa sembrare che i pezzi arrivino DAL colpo e non dal blocco.
  const f = bersaglio.faccia;
  const verso = f ? { x: f[0], y: f[1], z: f[2] } : null;
  const colori = coloriDi(tipo, cella[1]);
  if (scavo.schegge(adesso)) schegge.scoppia(centroDi(cella), colori, PER_COLPO, verso);
  if (!scavo.finito(adesso)) return;

  rompiSubito();
}

/**
 * VIA, ADESSO. ⚠ Sta a parte perché ci si arriva da due strade: la fine dello
 * scavo e la scorciatoia da tastiera. Il botto è lo stesso — e deve esserlo, se
 * no lo stesso evento avrebbe due facce secondo come lo si è provocato.
 */
function rompiSubito() {
  const dec = bersaglio && bersaglio.dato;
  const cella = bersaglio && (dec ? dec.cella : bersaglio.cella);
  if (!cella) return;
  const tipo = dec ? dec.tipo : mondo.tipo(...cella);
  if (!tipo) return;
  // ⚠ ALLA ROTTURA NE SALTANO VIA TANTE E SENZA DIREZIONE: è quello che
  // distingue «lo sto scavando» da «l'ho rotto» senza bisogno di un suono.
  schegge.scoppia(centroDi(cella), coloriDi(tipo, cella[1]), PER_ROTTURA, null);
  scavo.molla();
  cantiere.rompi(...cella);
  // il fantasma del danno se ne va con il blocco che rappresentava
  fabbrica.muoviColpetto(meshDanno, null, null, 1);
}

/**
 * L'ATTERRAGGIO di un blocco appena posato: vedi `scalaPosa`.
 * ⚠ IL BLOCCO VERO È GIÀ LÌ. Questa è la copia che gli cala addosso.
 */
function atterra(cella) {
  const tipo = mondo.tipo(...cella);
  if (!tipo) return;
  // ⚠ UNA DECORAZIONE ATTERRA NELLA SUA MATRICE, non col fantasma. Il fantasma
  // disegna `formaDi`, e per un albero quella non è la geometria dell'albero: è
  // la sua SCATOLA di ripiego (vedi `scatolaAnteprima`) — un albero appena
  // piantato si sarebbe visto atterrare come un parallelepipedo, e poi diventare
  // un albero. Le decorazioni sono istanze di un modello e hanno già una scala
  // per istanza, che è la stessa strada del colpetto.
  const voce = decoro.per.get(cella.join(','));
  posa = voce ? { voce, t0: performance.now() } : { cella: cella.slice(), tipo, t0: performance.now() };
  // e un po' di polvere sotto, che è quello che fa sembrare che abbia PESO
  schegge.scoppia(centroDi(cella), coloriDi(tipo, cella[1]), PER_COLPO, { x: 0, y: -0.5, z: 0 });
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

/**
 * UN FOTOGRAMMA DI TUTTE LE RISPOSTE.
 *
 * ⚠ VA CHIAMATA, e sembra ovvio: la prima stesura del colpetto era scritta,
 * provata con sei prove verdi e MAI ESEGUITA. Il committente l'ha vista come
 * «non hai integrato l'interagire con l'animazione» — ed era esatto, perché il
 * pezzo che mancava era l'integrazione, non il pezzo.
 */
function aggiornaEffetti(dt) {
  const adesso = performance.now();
  aggiornaColpetto(adesso);
  aggiornaDanno(adesso);
  aggiornaPosa(adesso);
  // le schegge: fisica e disegno. ⚠ SI SPENGONO DA SOLE — `scriviIn` non scrive
  // niente quando non ce n'è, e la mesh si nasconde.
  if (schegge.quante) schegge.aggiorna(dt);
  if (schegge.quante || meshSchegge.isEnabled()) fabbrica.scriviSchegge(meshSchegge, schegge);
}

/** ⚠ Si spegne DA SOLO: `scalaColpetto` torna esattamente 1 fuori dalla
 *  finestra, e su quell'1 si smette di disegnare. */
function aggiornaColpetto(adesso) {
  if (!colpo) return;
  const s = scalaColpetto(adesso - colpo.t0);
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
  if (!inCorso(adesso - colpo.t0)) {
    if (colpo.voce) { colpo.voce.scala = 1; _versioneDisegnata = -1; aggiornaDecoro(); }
    else fabbrica.muoviColpetto(meshColpetto, null, null, 1);
    colpo = null;
  }
}

/**
 * IL BLOCCO CHE STA CEDENDO: gonfio e tremante, in proporzione ai colpi presi.
 *
 * ⚠ È IL «FALLO CAPIRE CON DEGLI EFFETTI» del committente, e non è una barra
 * della salute: una barra sarebbe l'unico pezzo di interfaccia dentro il mondo,
 * in un gioco che è un diorama. Il tremolio dice la stessa cosa restando roba
 * del mondo — e si vede con la coda dell'occhio, che è dove serve.
 */
let _dannoDove = null;
function aggiornaDanno(adesso) {
  const p = scavo.progresso(adesso);
  if (p <= 0) {
    if (_dannoDove) {
      // ⚠ ANCHE LA DECORAZIONE VA RIMESSA A POSTO, se no resta gonfia per sempre
      if (_dannoDove.voce) { _dannoDove.voce.scala = 1; _versioneDisegnata = -1; aggiornaDecoro(); }
      else fabbrica.muoviColpetto(meshDanno, null, null, 1);
      _dannoDove = null;
    }
    return;
  }
  if (!bersaglioDelloScavo()) return;
  const s = scalaDanno(p), salto = tremolio(p, adesso);
  const b = _dannoDove;
  if (b.voce) {
    b.voce.scala = s;
    _versioneDisegnata = -1;
    aggiornaDecoro();
  } else {
    fabbrica.muoviColpetto(meshDanno, formaDi(b.tipo), b.cella, s, salto);
  }
}

/** Ritrova chi sta prendendo i colpi, dalla chiave dello scavo. */
function bersaglioDelloScavo() {
  if (!scavo.dove) return false;
  if (_dannoDove && _dannoDove.chiave === scavo.dove) return true;
  const cella = scavo.dove.split(',').map(Number);
  // ⚠ LA CHIAVE È LA STESSA STRINGA che usa il registro delle decorazioni
  // (`x,y,z`): sono due mondi diversi ma la cella è una sola.
  const voce = decoro.per.get(scavo.dove);
  const tipo = voce ? voce.tipo : mondo.tipo(...cella);
  if (!tipo) { _dannoDove = null; return false; }
  _dannoDove = { chiave: scavo.dove, cella, tipo, voce };
  return true;
}

/** L'atterraggio del blocco appena posato. */
function aggiornaPosa(adesso) {
  if (!posa) return;
  const t = adesso - posa.t0;
  const s = scalaPosa(t);
  if (posa.voce) { posa.voce.scala = s; _versioneDisegnata = -1; aggiornaDecoro(); }
  else fabbrica.muoviColpetto(meshPosa, formaDi(posa.tipo), posa.cella, s);
  if (t >= DURATA_POSA) {
    if (posa.voce) { posa.voce.scala = 1; _versioneDisegnata = -1; aggiornaDecoro(); }
    else fabbrica.muoviColpetto(meshPosa, null, null, 1);
    posa = null;
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
  // ⚠ UN TASTO, UN VERBO. Committente: «voglio tasto sinistro mano libera per
  // distruggere [...] tasto destro interagisci o piazzi se hai selezionato in
  // mano qualcosa». Prima l'azione dipendeva da cosa si aveva in mano E da cosa
  // si stava guardando, e il risultato era che i due tasti facevano spesso la
  // stessa cosa — il committente l'ha detto esatto: «la mano vuota se clicco il
  // sinistro rompe, se clicco il destro rompe».
  // ⚠ E SUL TELEFONO IL DITO È UN TASTO SOLO: il piccone dice quale dei due sta
  // emulando, ed è per questo che c'è.
  if (e.button === 2) { agisci(false); return; }
  // ⚠ IL SINISTRO NON AGISCE PIÙ AL RILASCIO — scava mentre è giù, e a farlo è
  // `ascoltaPressione` qui sotto. Ma sul telefono il dito È il tasto sinistro, e
  // col piccone SPENTO deve posare: quello sì che è un gesto istantaneo.
  if (e.button === 0 && modoGui.aTocco && !ditoDistrugge()) agisci(false);
});

// ⚠ E QUESTO È IL TASTO CHE SCAVA. Un clic risponde a «l'ha toccato?»; scavare
// ha bisogno di «lo sta ancora tenendo?», che è una domanda diversa e vuole un
// ascolto diverso. Se il puntatore comincia a trascinare, `ascoltaPressione`
// chiude da sé: quello che sta facendo è girare la camera.
let _scavando = false;
ascoltaPressione(tela, {
  onInizio: (e) => {
    // sul telefono il dito scava solo col piccone acceso; sul computer il
    // sinistro scava sempre
    if (modoGui.aTocco && !ditoDistrugge()) return;
    puntatore.x = e.clientX; puntatore.y = e.clientY;
    aggiornaMira();
    _scavando = true;
  },
  onFine: () => { _scavando = false; scavo.molla(); },
});

// ---- la scala di qualità ----------------------------------------------------
// ⚠ ESISTE PERCHÉ IL TELEFONO FACEVA SEI FOTOGRAMMI AL SECONDO mentre il PC
// andava meglio di Leafy-Lantern. Non era un difetto: era una configurazione da
// desktop su un chip con un decimo della banda e tre volte i pixel.
// ⚠ E SI MISURA CON `screen` PERCHÉ IL BERSAGLIO NON È IL TETTO DEL PANNELLO:
// vedi `gioco/adatta.js`.
const scala = new ScalaQualita({
  mobile: rig.dispositivo.mobile,
  applica: (p) => rig.applicaProfilo(p, { erba, fabbrica }),
});
scala.avvia();
// ⚠ E QUANTO VA LO SCHERMO SI MISURA, non si chiede: `screen.refreshRate` non
// esiste in Chrome e tornava `undefined`. Arriva dopo una quarantina di
// fotogrammi, che è comunque prima che la scala possa decidere qualcosa.
misuraHz().then((hz) => scala.impostaHz(hz));

// ⚠ SI PARTE DAL MASSIMO OVUNQUE, telefono compreso — questo non cambia, ed è
// mandato del committente: «a priori dobbiamo puntare al massimo su ogni
// dispositivo». `ScalaQualita` nasce già al gradino 0 e `avvia()` l'ha appena
// applicato: non serve nessun `fissa`.
//
// ⚠ E `fissa(0)` NON ERA «partire al massimo»: era «partire al massimo E NON
// MUOVERSI PIÙ». Metteva `manuale = true` prima ancora che il giocatore
// toccasse qualcosa, cioè spegneva l'automatismo di fabbrica su tutte le
// macchine — comprese quelle che a q0 fanno sei fotogrammi al secondo e non
// hanno modo di saperlo (su un telefono la pillola ⚙ la si trova DOPO aver
// deciso che il gioco è rotto).
//
// ⚠ IL CONTRATTO NUOVO È UNO SOLO, e risponde al verdetto che aveva staccato
// l'automatismo («il preset automatico è inconsistente», la scala che
// «pompava» su e giù): **automatico finché non lo tocchi, mai più dopo**. Chi
// sceglie un livello dalla pillola o col tasto K chiama `fissa`, e da quel
// momento la scala non si muove più da sola per tutta la sessione. Nessuno si
// vede cambiare la grafica sotto gli occhi dopo aver detto cosa vuole.
//
// ⚠ E L'OSCILLAZIONE, che era il difetto vero, ha già le sue tre cure in
// `gioco/adatta.js`, tutte provate in Node: si scende dopo 3 misure e si
// risale dopo 8; il gradino che non ha retto si ricorda con un'attesa che
// RADDOPPIA a ogni buca (senza, la prova conta 66 oscillazioni in 17 minuti);
// e una discesa che non guadagna almeno l'8% si ANNULLA da sola — «una scala
// che non verifica è una scala che spera». Quello che mancava non era la
// prudenza: era che nessuno la chiamasse.
//
// ⚠ E LA PILLOLA SEGUE: se la scala scende da sola, l'etichetta si sposta sul
// nome più vicino (`mostra`, che non riapplica niente). Una pillola che dice
// ULTRA mentre il gioco gira a MEDIA è peggio di non averla.
// ⚠ I NOMI SONO POCHI E GROSSI, non un nome per gradino: sette gradini con
// sette nomi sono un menu di sfumature indistinguibili. Quattro nomi, quattro
// salti che si VEDONO. La mappa è sugli indici della tabella LIVELLI.
const LIVELLI_GRAFICA = rig.dispositivo.mobile
  ? [['ultra', 0], ['alta', 1], ['media', 3], ['bassa', 5]]
  : [['ultra', 0], ['alta', 2], ['media', 3], ['bassa', 5]];
const sceltaGrafica = new SceltaAcqua(
  LIVELLI_GRAFICA.map(([nome, gradino]) => ({ chiave: nome, nome: nome.toUpperCase(), gradino })),
  (chiave, voce) => scala.fissa(voce.gradino),
  { id: 'graficaSel', emoji: '⚙', titolo: 'Livello di grafica (anche col tasto K)', sotto: 1 },
);
/**
 * QUALE DEI QUATTRO NOMI DESCRIVE IL GRADINO IN CUI SI È.
 *
 * ⚠ I NOMI SONO QUATTRO E I GRADINI SETTE, quindi la scala automatica passa da
 * gradini che non hanno un nome. Si prende l'ultimo nome che comincia a quel
 * gradino o prima — cioè si arrotonda per DIFETTO: q4 con i nomi su [0,2,3,5] è
 * «media» (che comincia a 3), non «bassa». Dire un nome più alto di quello che
 * si sta vedendo sarebbe l'unico errore che conta.
 */
function nomeDelGradino(g) {
  let i = 0;
  for (let k = 0; k < LIVELLI_GRAFICA.length; k++) if (LIVELLI_GRAFICA[k][1] <= g) i = k;
  return i;
}

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
  // ⚠ Q ROMPE SUBITO, ed è l'unica eccezione all'«mai istantanea»: è una
  // scorciatoia da tastiera per chi costruisce, dove il gesto è già esplicito
  // (un tasto dedicato, non il tasto con cui si gira anche la camera).
  else if (e.code === 'KeyQ') { if (bersaglio && azSinistra === 'rompi') rompiSubito(); }
  else if (e.code === 'KeyE') agisci(false);
  else if (e.code === 'KeyR') cantiere.scegli(cantiere.scelto + (e.shiftKey ? -1 : 1));
  // ⚠ K CICLA I LIVELLI DELLA PILLOLA, non i gradini fini: da quando
  // l'automatismo è fuori, i livelli con un nome sono l'unica scala che esiste
  // per chi guarda — e il tasto deve dire le stesse cose del bottone.
  else if (e.code === 'KeyK') sceltaGrafica.muovi(e.shiftKey ? -1 : 1);
  // ⚠ A CICLA LE ACQUE NEL GIOCO VERO, e non è un doppione del banco.
  // ⚠ IL TASTO A NON C'È PIÙ, e la ragione l'ha detta il committente: «non ha
  // senso se mi muovo con WASD» — l'acqua cambiava sotto i piedi camminando a
  // sinistra. L'acqua si cicla dalla pillola 💧 a schermo (ui/acqua.js), che
  // resta la strada unica: era già la regola («ogni comando che serve a
  // guardare vuole un bottone»), e il tasto era il doppione.
  else if (e.code.startsWith('Digit')) {
    const n = Number(e.code.slice(5));
    if (n >= 1 && n <= 9) cantiere.scegli(n - 1);
  }
});

/** Quale acqua si sta guardando, e l'etichetta che lo dice. */
let _acquaScritta = '', _acquaFinoA = 0;

// ⚠ IL BOTTONE E IL TASTO PASSANO DALLA STESSA PORTA. Committente: «voglio un
// tasto fisico, altrimenti da mobile come testo le varie acque?» — e ha ragione
// due volte, perché il telefono non è solo un dispositivo in più: è il posto
// dove i difetti grafici si vedono per primi. Il tasto `A` resta perché con la
// tastiera è più veloce, ma non è più lui a fare il lavoro: chiama il selettore,
// che è l'unico posto dove l'acqua cambia. Due strade che fanno la stessa cosa
// in due modi diversi divergono sempre — di solito il giorno che se ne cambia
// una sola.
// ⚠ SI PARTE DAL LAGO A SPECCHIO: scelta del committente, non un default
// tecnico — «è importantissimo lo specchio, voglio proprio vedere un lago
// specchiato nel mondo». Prima era `ghibli`; il lago ne è l'erede col
// riflesso planare e l'acqua vera accesi.
//
// ⚠ E PER ORA SI PARTE DA `ghibli`, CHE È UN PRESTITO, NON UN RIPENSAMENTO.
// Misurato qui (RTX 4060, 1280×720, posa standard, fotogramma tirato a mano
// senza vsync): `ghibli` 2,5 ms e 138 disegni, `lago` 5,7 ms e **448**. I 310
// disegni di differenza sono le tre rese complete della scena che `lago`
// accende — specchio, rifrazione, profondità — e sono la causa del salto da
// 80 a 12 fotogrammi al secondo (docs/DIAGNOSI-PRESTAZIONI.md §1).
//
// ⚠ IL PUNTO NON È CHE `lago` SIA TROPPO BELLO: è che quelle passate stanno
// FUORI dai profili di qualità. Il livello «bassa» spegne le ombre del sole e
// lascia intatte tre rese della scena, che è l'esatto contrario di una scala
// di qualità. Finché la scala non le governa (passo 2) e non costano meno
// (passo 3), la ricetta di partenza non può essere quella che le accende
// tutte — un gioco che parte a 12 fps non lo giudica nessuno.
//
// ⚠ E SI TORNA A `lago` ALLA FINE DEL PASSO 3, non «un giorno»: da lì il
// profilo decide da sé quante passate concedere, e chi ha la macchina per lo
// specchio se lo tiene. La pillola 💧 intanto lo raggiunge in un tocco, e il
// banco dell'acqua parte da `lago` come prima — lì si guarda, non si gioca.
const ACQUA_DI_PARTENZA = 'ghibli';
const sceltaAcqua = new SceltaAcqua(
  Object.entries(RICETTE).map(([chiave, r]) => ({ chiave, nome: r.nome, nota: r.nota })),
  (chiave, voce, i) => {
    fabbrica.cambiaRicettaAcqua(chiave);
    // ⚠ IL NOME NON BASTA: serve la NOTA, che è la riga che dice cosa guardare.
    // Senza, ciclare quaranta acque è un gioco a indovinare quale si sta vedendo.
    _acquaScritta = `${i + 1}/${RICETTE ? Object.keys(RICETTE).length : 0}  ${voce.nome}\n${voce.nota || ''}`;
    _acquaFinoA = performance.now() + 6000;
  },
);
// ⚠ E IL MONDO PARTE CON UNA RICETTA VERA, non con l'acqua base. Questa riga è
// metà della risposta a «in gioco non noto alcuna miglioria»: senza, la
// `Fabbrica` costruisce il materiale di fabbrica — `acqua-tratti-piatto`, cioè
// stile generico, modello piatto, `vera: 0` — che è l'acqua più povera che
// l'impianto sappia fare, e nessuna delle quaranta ricette. Chi apriva il gioco
// vedeva quella e non aveva modo di sapere che le novità stavano tutte altrove,
// dietro un tasto che non aveva ancora premuto. Il banco parte da `cristallina`
// per la stessa ragione, e adesso i due partono uguali.
sceltaAcqua.vaiA(Math.max(0, sceltaAcqua.voci.findIndex((v) => v.chiave === ACQUA_DI_PARTENZA)));
// ⚠ L'ETICHETTA NO, PERÒ: all'avvio non è una scelta di nessuno, e sei secondi
// di scritta addosso al primo fotogramma sono rumore. Si azzera subito.
_acquaFinoA = 0;

// ⚠ IL PIANO DELLO SPECCHIO VA MESSO SUL MARE, E NEL GIOCO NON LO FACEVA
// NESSUNO — è la causa di «non riflette proprio nulla» e di metà del «sembra
// monocromatica e opaca». Un riflesso planare specchia la scena rispetto a UN
// piano: `creaSpecchio` lo lascia al valore di comodo del banco (9,5), e il
// banco lo rimette a ogni vasca (`seguiSpecchio`) — il gioco non lo rimetteva
// mai. Il pelo del mare vero sta a `LIVELLO_ACQUA + 15/16` = 5,94: si
// specchiava rispetto a un piano tre blocchi e mezzo TROPPO ALTO, cioè
// l'immagine riflessa era la scena sbagliata (spostata di sette blocchi in
// verticale) — niente alberi, niente cielo giusto, solo una patina slavata.
// ⚠ E VA CHIAMATO ANCHE PER LA RISACCA/il fondale alla Galaxy, che dallo
// stesso livello ricavano dov'è la superficie.
// ⚠ IL LIMITE RESTA UNO SOLO E VA SAPUTO: un piano per volta. Il mare
// principale riflette; una pozza sopraelevata sul dirupo no — è la tecnica,
// non una svista (vedi la nota di `creaSpecchio`).
// ⚠ E IL PIANO SEGUE L'ACQUA, non è una costante: «il riflesso deve stare a
// qualsiasi altezza dell'acqua, anche se faccio una grotta e ci metto acqua
// sotto». `peloVicino` (world/pelo.js, provato in Node) cerca il pelo LIBERO
// più vicino al giocatore pesando la verticale; `pianoDaTenere` lo sposta a
// scatti da mezzo blocco, se no l'immagine riflessa slitterebbe camminando.
// Si ricontrolla ogni mezzo secondo: cercare a ogni fotogramma sarebbe
// sprecato (l'acqua non si sposta) e a ogni chunk sarebbe troppo tardi.
let _pianoAcqua = LIVELLO_ACQUA + 15 / 16;
let _pianoFra = 0;
fabbrica.quotaSpecchioAcqua(_pianoAcqua);
fabbrica.rivaTerreno(_pianoAcqua, 0);
function seguiPeloAcqua(dt) {
  _pianoFra -= dt;
  if (_pianoFra > 0) return;
  _pianoFra = 0.5;
  const nuovo = pianoDaTenere(_pianoAcqua, peloVicino(mondo, passeggero.x, passeggero.y, passeggero.z));
  if (nuovo === _pianoAcqua) return;
  _pianoAcqua = nuovo;
  fabbrica.quotaSpecchioAcqua(_pianoAcqua);
  fabbrica.rivaTerreno(_pianoAcqua, 0);
}

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
/**
 * QUANTO SI STA DISEGNANDO — i due numeri che dicono dove va il tempo.
 *
 * ⚠ SI CONTANO OGNI TANTO, NON A OGNI FOTOGRAMMA: girare l'elenco delle mesh
 * attive costa, e per un pannello di diagnosi due volte al secondo bastano. È
 * la stessa ragione per cui il resto del pannello si aggiorna ogni 15 giri.
 */
let _disegni = 0, _triangoli = 0;
const _storiaFps = [], _storiaLivelli = [];
function contaDisegno() {
  // ⚠ IL CONTO DEI DISEGNI LO DÀ IL MOTORE, e va acceso: Babylon lo tiene
  // sempre, ma lo azzera a ogni fotogramma solo se qualcuno ha dichiarato di
  // volerlo leggere. Senza, è il totale dall'avvio — la prima misura diceva
  // «89.806 disegni», che a occhio sembra un numero e invece è un cronometro
  // che nessuno ha mai fermato.
  _disegni = rig.misura.disegni;
  let tri = 0;
  const att = rig.scena.getActiveMeshes();
  for (let i = 0; i < att.length; i++) {
    const x = att.data[i];
    if (!x) continue;
    tri += ((x.getTotalIndices() / 3) | 0) * Math.max(1, x.thinInstanceCount || 0);
  }
  _triangoli = tri;
}

function aggiornaStato() {
  const ora = performance.now();
  finestra.push(ora - ultimo);
  ultimo = ora;
  if (finestra.length > 240) finestra.shift();
  if (finestra.length < 30 || finestra.length % 15) return;
  const s = finestra.slice().sort((a, b) => a - b);
  const p = (q) => s[Math.floor(s.length * q)].toFixed(1);
  contaDisegno();

  // ⚠ GLI FPS E I MILLISECONDI INSIEME, e i secondi non bastano da soli: con la
  // sincronia verticale il numero si incolla al tetto del pannello e non dice
  // più niente — sessanta fps sono sessanta sia che si lavori un millisecondo
  // sia che se ne lavorino quindici. Il ms del p99 è quello che si SENTE.
  const fps = Math.round(1000 / s[s.length >> 1]);
  // ⚠ LA STORIA VALE PIÙ DELL'ISTANTE, ed è la cosa che uno scatto dello
  // schermo non potrà mai dire: un p99 alto una volta è un caso, un gradino che
  // scende tre volte in un minuto è un difetto. Costa due numeri ogni quarto di
  // secondo, e li porta via il rapporto di diagnostica.
  _storiaFps.push(fps);
  if (_storiaFps.length > 240) _storiaFps.shift();
  if (_storiaLivelli[_storiaLivelli.length - 1] !== scala.livello) _storiaLivelli.push(scala.livello);
  // ⚠ E QUI LA SCALA GUARDA. Finché nessuno ha toccato la pillola può scendere
  // (e risalire) da sola; al primo `fissa` si ferma per sempre. La storia dei
  // livelli resta nel rapporto: è l'unico modo di vedere, da un telefono che
  // non si può profilare, se la scala ha lavorato o ha pompato.
  if (scala.osserva(fps, ora)) sceltaGrafica.mostra(nomeDelGradino(scala.livello));
  // ⚠ L'ETICHETTA DELL'ACQUA STA NELLA SPIA, non in un riquadro suo: nel gioco
  // lo spazio a schermo è del gioco, e un pannello in più coprirebbe proprio
  // l'acqua che si sta guardando. Scade da sola dopo sei secondi.
  const acquaOra = performance.now() < _acquaFinoA ? `\n${_acquaScritta}` : '';
  spia.textContent = `${fps} fps\n${p(0.5)} / ${p(0.99)} ms${acquaOra}`;
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
    `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'}${rig.dispositivo.uaMentiva ? '·GPU' : ''}  q${scala.livello}/${scala.quanti - 1}` +
    `${scala.adatta.manuale ? '·mano' : ''}  ${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()}` +
    ` su ${tela.clientWidth}×${tela.clientHeight}` +
    ` (×${(rig.motore.getRenderWidth() / Math.max(1, tela.clientWidth)).toFixed(2)})` +
    `  dpr ${devicePixelRatio}  ${p(0.5)}/${p(0.99)} ms\n` +
    `${rig.fissi.ombreLampade || rig.dispositivo.mobile ? '' : `LEGGERA ${faticaRicordata()}/3 (?pesante per riprovare)  `}` +
    `ombre ${rig.profilo.sole ? rig.ombre.numCascades + '×' + rig.profilo.mappa : 'no'}` +
    `${rig.profilo.sole && rig.profilo.ombraOgni > 1 ? '/' + rig.profilo.ombraOgni + 'f' : ''}` +
    `  lampade ${rig.fissi.ombreLampade ? 'con ombra' : 'senza'}` +
    `  erba ${(erba.attiva ? erba.fili : 0).toLocaleString('it')}` +
    `  flora ${flora.istanze.toLocaleString('it')} in ${flora.settori} settori\n` +
    // ⚠ DISEGNI E TRIANGOLI, e sono le due grandezze che dicono DOVE va il
    // tempo su una macchina che non posso profilare. Un telefono non ha una
    // console: quello che arriva è uno scatto di questo pannello, e senza questi
    // due numeri si può solo tirare a indovinare. Misurato qui: prima erano
    // 553.641 triangoli, di cui 294.912 di soli aloni dei lampioni.
    // ⚠ E I DISEGNI SONO IL NUMERO CHE CONTA SUL TELEFONO più dei triangoli:
    // ogni chiamata di disegno è lavoro di CPU nel browser, e la CPU di un
    // telefono è cinque volte più lenta. La mappa delle ombre ne fa una per
    // mesh PER CASCATA — misurato: 208 su 273.
    `disegni ${_disegni}   triangoli ${_triangoli.toLocaleString('it')}` +
    // ⚠ SPALMATI SUI FOTOGRAMMI, non «quanto costa quando la rifà». Lo strumento
    // conta solo i giri in cui la mappa si ridisegna davvero, quindi con la
    // rifrittura ogni due fotogrammi il numero grezzo SALE — e letto di fretta
    // sembra che l'ottimizzazione abbia peggiorato le cose. Diviso per ogni
    // quanti giri si rifà, dice quello che si paga per fotogramma.
    `   ombre ${(rig.misura.ombreMs / Math.max(1, rig.profilo.ombraOgni)).toFixed(2)} ms\n` +
    // ⚠ LA PIPELINE DICHIARATA (fase R2): ogni passata oltre la scena, con
    // taglia e quante mesh ridisegna. È la tabella che il rework tiene sotto
    // controllo — se qui compare una riga nuova, qualcuno la sta pagando.
    `passate: ${rig.passate().map((p) => `${p.nome} ${p.lato}²${p.passate > 1 ? '×' + p.passate : ''}(${p.mesh < 0 ? 'tutte' : p.mesh})`).join(' · ') || 'solo la scena'}\n` +
    `${rig.scheda.software ? '⚠ DISEGNA IN SOFTWARE' : rig.scheda.nome.slice(0, 40)}\n` +
    `chunk ${mesher.chunks.size}   blocchi ${mondo.contaBlocchi.toLocaleString('it')}   ` +
    `luci ${rig.luci.accese}   decorazioni ${decoro.quanti} (${decoro.accesi} accese)\n` +
    `worldgen ${tGen.toFixed(0)} ms   mesh ${tMesh.toFixed(0)} ms\n` +
    `\n${giorno.orologio}${giorno.auto ? '' : ' (fermo)'}\n` +
    `SINISTRO: TIENI PREMUTO per rompere · DESTRO posa, o accende a mano vuota\n` +
    `centrale copia · maiusc mostra il sinistro · Q rompi subito  E usa\n` +
    `1-9 / R mano   , . ora   P ciclo   K qualità   I ispettore\n` +
    `💧 ACQUA a sinistra: ${sceltaAcqua.indice + 1}/${sceltaAcqua.voci.length} ${sceltaAcqua.voce.nome}\n` +
    // ⚠ E IL PANNELLO DICE ANCHE DOV'È IL BOTTONE. Committente: «sul cellulare
    // non vedo il tasto per la diagnosi». Questo pannello è la cosa che si
    // guarda quando qualcosa non va, quindi è il posto giusto per dire come si
    // manda quello che c'è scritto sopra.
    `🩺 diagnosi (a sinistra) manda tutto questo a Claude`;
}

/** Il tempo dell'acqua: si accumula qui perché il motore passa solo il DELTA. */
let tAcqua = 0;

// ---- il banco di misura (fase R1 del rework): `?misura` nell'indirizzo -------
// ⚠ STESSA SCENA, STESSA CAMERA, STESSA ORA — o i numeri non si possono
// confrontare fra prima e dopo, né fra il PC e il telefono. La sequenza:
// 4 secondi di riscaldo (i primi secondi non si giudicano: worldgen, mesh,
// compilazione degli shader — CLAUDE.md), poi 60 fotogrammi a vuoto, poi 300
// misurati. Il risultato compare in un riquadro COPIABILE e finisce nel
// rapporto 🩺, così dal telefono arriva con un tocco.
const misuraChiesta = /[?&]misura/.test(location.search);
// ⚠ `?misura=serie` È IL PROFILO PER ESCLUSIONE SUL DISPOSITIVO VERO, ed esiste
// perché il collo del Mali non si può indovinare da una RTX: un giro solo dal
// telefono misura la stessa posa in sette configurazioni — pieno, senza erba,
// senza ombre, senza FXAA, senza acqua, coi materiali congelati, a tre quarti
// di risoluzione (DIAGNOSI del fill-rate, non un taglio: si ripristina da
// sola) — e mette tutti i quadri nel rapporto 🩺. Ogni passo ha il SUO
// riscaldo, perché spegnere le ombre ricompila i materiali e senza riscaldo la
// misura esce avvelenata (già successo: «senza ombre» peggio del pieno).
const misuraSerie = /[?&]misura=serie/.test(location.search);
// ⚠ LE VOCI «IN MARCIA» (`muovi`) SONO LA SECONDA METÀ DELLA VERITÀ: dalla
// passeggiata del committente il telefono fa 85 fps da fermo e 23–36 in
// movimento — perché camminando la firma di quiete cambia sempre e le cascate
// si ridisegnano, e l'erba/il mondo entrano nel binning ogni fotogramma. La
// camera orbita da sola durante la raccolta: stessa scena, stesso arco, e i
// delta fra «in marcia», «in marcia senza ombre» e «in marcia senza erba»
// dicono CHI paga il movimento.
const _serieVoci = [
  { nome: 'pieno (fermo)', su: () => {}, giu: () => {} },
  { nome: 'in marcia', muovi: true, su: () => {}, giu: () => {} },
  { nome: 'marcia senza ombre', muovi: true, su: () => { rig.sole.shadowEnabled = false; },
    giu: () => { rig.sole.shadowEnabled = true; rig._ombraOgni(rig.profilo.ombraOgni); rig._sporcaOmbre(); } },
  { nome: 'marcia senza erba', muovi: true, su: () => erba.imposta(false), giu: () => erba.imposta(true) },
  { nome: 'senza fxaa', su: () => { if (rig.fxaa) { rig.fxaa.dispose(); rig.fxaa = null; } },
    giu: () => rig.applicaProfilo(rig.profilo, { erba, fabbrica, particelle: null }) },
  { nome: 'senza acqua', su: () => rig.scena.meshes.forEach((m) => { if (m.name.startsWith('acqua:')) m.setEnabled(false); }),
    giu: () => rig.scena.meshes.forEach((m) => { if (m.name.startsWith('acqua:')) m.setEnabled(true); }) },
  { nome: 'materiali congelati', su: () => rig.scena.materials.forEach((m) => m.freeze()), giu: () => rig.scena.materials.forEach((m) => m.unfreeze()) },
  { nome: 'scala 0.75', su: () => rig.applicaScala(0.75), giu: () => rig.applicaScala(rig.profilo.scala) },
];
let _misuraStato = misuraChiesta ? 'attesa' : 'no';
let _misuraVia = 0;
let _seriePasso = 0;
const _misuraCampioni = [];
const _serieEsiti = [];
function _misuraFine() {
  const q = quadro(_misuraCampioni, {
    dove: `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'} ${(rig.scheda && rig.scheda.nome) || ''}`,
    scena: `q${scala.livello} acqua:${sceltaAcqua.voce.chiave}`,
    pixel: `${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()}`,
    passate: rig.passate().map((p) => `${p.nome} ${p.lato}²×${p.passate} (${p.mesh} mesh)`).join(' · '),
  });
  _misuraCampioni.length = 0;
  return q;
}
function _misuraMostra(testo) {
  const r = document.createElement('pre');
  r.id = 'quadroMisura';
  r.style.cssText = 'position:fixed;inset:auto 12px 12px 12px;z-index:50;margin:0 auto;max-width:560px;'
    + 'max-height:70vh;overflow:auto;padding:12px 14px;border-radius:12px;background:rgba(255,255,255,.97);'
    + 'border:2px solid #0d2a1a;font:12px/1.5 ui-monospace,monospace;color:#0d2a1a;white-space:pre-wrap;user-select:text;';
  r.textContent = `${testo}\n\n(tocca per chiudere — il quadro resta nel rapporto 🩺)`;
  r.addEventListener('click', () => r.remove());
  document.body.appendChild(r);
}
function _misuraGiro(msFrame) {
  if (_misuraStato === 'no' || _misuraStato === 'fatta') return;
  const ora = performance.now();
  if (_misuraStato === 'attesa') {
    if (!_misuraVia) _misuraVia = ora + 4000;
    if (ora < _misuraVia) return;
    // la POSA standard: il fiume dello spawn, sole delle 13, camera a tre quarti
    giorno.auto = false; giorno.t = 0.5; giorno.applica();
    rig.camera.target.set(-40, 8, 14);
    rig.camera.alpha = -0.9; rig.camera.beta = 1.12; rig.camera.radius = 26;
    if (misuraSerie) _serieVoci[0].su();
    _misuraStato = 'riscaldo'; _misuraVia = misuraSerie ? 45 : 60;
    return;
  }
  if (_misuraStato === 'riscaldo') {
    if (--_misuraVia > 0) return;
    _misuraStato = 'raccolta';
    return;
  }
  // la marcia finta: la camera orbita — la firma di quiete cambia, le ombre
  // si ridisegnano, il mondo scorre nel binning: come camminare, ripetibile
  if (misuraSerie && _serieVoci[_seriePasso].muovi) rig.camera.alpha += 0.012;
  const c = rig.campione();
  _misuraCampioni.push({ ms: msFrame, disegni: c.disegni, rtMs: c.rtMs, ombreMs: rig.misura.ombreMs });
  const bersaglio = misuraSerie ? 150 : 300;
  if (_misuraCampioni.length < bersaglio) return;
  if (!misuraSerie) {
    _misuraStato = 'fatta';
    const q = _misuraFine();
    globalThis.LEAFY.ultimaMisura = q;
    _misuraMostra(`📏 MISURA R1\n${stampaQuadro(q)}`);
    return;
  }
  // la serie: chiudo questo passo, apro il prossimo
  const voce = _serieVoci[_seriePasso];
  const q = _misuraFine();
  _serieEsiti.push({ nome: voce.nome, p50: q.fotogramma.p50, p99: q.fotogramma.p99, disegni: q.disegni && q.disegni.p50 });
  voce.giu();
  // la camera torna alla posa standard: ogni voce parte dallo stesso punto
  rig.camera.alpha = -0.9;
  _seriePasso++;
  if (_seriePasso < _serieVoci.length) {
    _serieVoci[_seriePasso].su();
    _misuraStato = 'riscaldo'; _misuraVia = 45;
    return;
  }
  _misuraStato = 'fatta';
  const base = _serieEsiti[0].p50;
  const righe = _serieEsiti.map((e) => {
    const delta = e.nome === 'pieno' ? '' : `  →  ${(base - e.p50) >= 0 ? '−' : '+'}${Math.abs(base - e.p50).toFixed(1)} ms`;
    return `${e.nome.padEnd(20)} p50 ${String(e.p50).padStart(5)} · p99 ${String(e.p99).padStart(5)} · ${e.disegni}d${delta}`;
  });
  globalThis.LEAFY.ultimaMisura = { serie: _serieEsiti, dove: `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'} ${(rig.scheda && rig.scheda.nome) || ''}` };
  _misuraMostra(`📏 SERIE R1 — dove va il tempo su QUESTO dispositivo\n${righe.join('\n')}`);
}

// ⚠ LA FIRMA DI QUIETE: un numero che cambia quando cambia qualcosa che le
// ombre VEDONO. Il verso del sole, la camera (le cascate seguono il suo
// frustum: girarla cambia la mappa anche a mondo fermo), il giocatore (il suo
// corpo proietta), e la revisione del mondo dalla fabbrica. Quantizzata, se no
// il rumore dell'ultimo decimale non fa congelare mai.
// ⚠ IL VENTO DELL'ERBA NON C'È, ED È UNA DECISIONE: se l'erba che ondeggia
// contasse, la scena non sarebbe MAI ferma e il congelamento non scatterebbe
// mai. Il prezzo è un'ombra d'erba immobile quando tutto il resto è fermo —
// che a ombraOgni 2-3 già oggi trema di suo, e non l'ha mai notato nessuno.
function firmaQuiete() {
  const c = rig.camera, s = rig.soleVerso, p = passeggero;
  const q = (v, k) => Math.round(v * k);
  // ⚠ IL SOLE È QUANTIZZATO LARGO (1/100 ≈ 0,6°), ed è la riga che fa valere il
  // congelamento ANCHE col ciclo del giorno attivo: a passo fine il sole
  // «cambiava» ogni fotogramma e la mappa non si congelava mai — nemmeno da
  // fermi, che è il caso del diorama e di chi costruisce. Così l'ombra avanza a
  // micro-scatti (uno ogni ~mezzo secondo di gioco): quando il quanto cambia la
  // mappa si rifà col sole VERO, quindi la posizione è sempre giusta — è solo
  // la cadenza a essere diradata. Sul Mali-G68 le cascate valgono ~2,4 ms a
  // fotogramma (rapporto 🩺 del 30/08): da fermi diventano ~zero.
  return `${q(s.x, 100)},${q(s.y, 100)},${q(s.z, 100)}|${q(c.alpha, 1000)},${q(c.beta, 1000)},${q(c.radius, 100)}`
    + `|${q(c.target.x, 100)},${q(c.target.y, 100)},${q(c.target.z, 100)}`
    + `|${q(p.x, 100)},${q(p.y, 100)},${q(p.z, 100)}|${fabbrica.revOmbre || 0}`;
}

rig.avvia((dt) => {
  _misuraGiro(dt * 1000);
  seguiPeloAcqua(dt);
  rig.quieteOmbre(firmaQuiete());
  giorno.aggiorna(dt);
  // ⚠ IL DISEGNO DELL'ACQUA SCORRE A TEMPO, NON A FOTOGRAMMI: a 144 Hz e a 30
  // la corrente deve andare alla stessa velocità, se no su un telefono lento il
  // ruscello rallenta insieme agli fps e si legge come un difetto della fisica.
  // È lo stesso inciampo della scia della schiuma in Lantern, che svaniva in un
  // quarto di secondo a 120 fps e in un secondo a 30.
  tAcqua += dt;
  fabbrica.animaAcqua(tAcqua);
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
  // ⚠ E LE RISPOSTE VANNO CHIAMATE, che sembra ovvio e invece era la riga
  // mancante: la prima stesura del colpetto era scritta, provata e mai eseguita.
  // Il committente l'ha visto come «non hai integrato l'interagire con
  // l'animazione» — ed era esatto: il pezzo che mancava era l'integrazione.
  // ⚠ LO SCAVO AVANZA QUI e non nel gestore del puntatore: un `pointerdown` è
  // UN evento, e scavare è una cosa che dura. Finché il tasto è giù, ogni
  // fotogramma aggiunge il suo pezzo di tempo.
  if (_scavando) scava(performance.now());
  aggiornaEffetti(dt);
  aggiornaAloni();
  // ⚠ E CHI PROIETTA OMBRA SI RIVEDE MENTRE SI CAMMINA: ogni chunk fuori dalla
  // portata delle cascate vale QUATTRO chiamate di disegno in meno (due su
  // mobile). Vedi «fabbrica.aggiornaOmbre».
  fabbrica.aggiornaOmbre(rig.camera.position);
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
  // ⚠ E DICE TUTTI E DUE I TASTI, che è il modo di imparare la mappa senza
  // doverla leggere da qualche parte: si guarda una cosa e c'è scritto cosa
  // farebbe ciascun tasto SU QUELLA COSA. Sul telefono no — lì il dito è un
  // tasto solo e il piccone dice già quale, due verbi confonderebbero.
  const verbo = (a) => (a ? NOME_AZIONE[a] : '—');
  barra.aggiorna(cantiere.scelto, !bersaglio
    ? `— · ${cantiere.nomeScelto}`
    : modoGui.aTocco
      ? `<b>${verbo(cosaFa)}</b> · ${nomeBersaglio}`
      : `<b>${verbo(azSinistra)}</b> / ${verbo(azDestra)} · ${nomeBersaglio}`);
  aggiornaStato();
});

// una manina per lavorarci sopra dall'ispettore e dalla console
// ---- il bottone della diagnostica -------------------------------------------
// ⚠ Committente: «non riesci a creare un bottone manda diagnostica, così in
// automatico ti arriva tutto?». Il pezzo che conta è la funzione qui sotto:
// decidere COSA si sa della macchina. Tutto il resto — mandarlo, ripiegare sugli
// appunti se non c'è nessuno in ascolto — sta in «ui/diagnostica.js».
// ⚠ E NON C'È NIENTE DI PERSONALE: solo roba tecnica. Vedi «ui/rapporto.js»,
// che è il posto dove fermarsi a pensarci se un giorno servisse aggiungere un
// campo.
const diagnostica = new Diagnostica(() => {
  const s = finestra.slice().sort((a, b) => a - b);
  const q = (v) => (s.length ? s[Math.floor(s.length * v)] : null);
  return {
    // ⚠ LA VERSIONE LA SCRIVE LA PUBBLICAZIONE in fondo alla pagina; in sviluppo
    // quel nodo non c'è, e va bene così — è proprio l'informazione «questa non è
    // una build pubblicata».
    versione: (document.getElementById('versione') || {}).textContent || '',
    // ⚠ IL QUADRO R1 VIAGGIA COL RAPPORTO: la misura dal telefono non si
    // trascrive da uno scatto — arriva coi suoi percentili dentro il 🩺.
    misuraR1: globalThis.LEAFY && globalThis.LEAFY.ultimaMisura || null,
    mobile: rig.dispositivo.mobile, tocco: rig.dispositivo.tocco, modoGui: modoGui.scelta,
    ua: navigator.userAgent, cpu: navigator.hardwareConcurrency || null,
    memoriaGB: navigator.deviceMemory || null,
    css: [tela.clientWidth, tela.clientHeight],
    reso: [rig.motore.getRenderWidth(), rig.motore.getRenderHeight()],
    dpr: devicePixelRatio,
    livello: scala.livello, quantiLivelli: scala.quanti, manuale: scala.adatta.manuale,
    profilo: rig.profilo,
    ombreLampade: rig.fissi.ombreLampade, antialias: rig.fissi.antialias,
    fps: s.length ? 1000 / q(0.5) : null, p50: q(0.5), p99: q(0.99),
    disegni: _disegni, triangoli: _triangoli,
    ombreMs: rig.misura.ombreMs / Math.max(1, rig.profilo.ombraOgni),
    storiaFps: _storiaFps, storiaLivelli: _storiaLivelli,
    scheda: rig.scheda.nome, software: rig.scheda.software,
    chunk: mesher.chunks.size, blocchi: mondo.contaBlocchi,
    luci: rig.luci.accese, decorazioni: decoro.quanti,
    erba: erba.attiva ? erba.fili : 0,
    ora: giorno.orologio, giorno: giorno.giorno,
    worldgenMs: tGen, meshMs: tMesh,
  };
}, () => rig.scatto(600));

globalThis.LEAFY = { rig, fabbrica, mondo, mesher, erba, giorno, modelli, passeggero, cantiere, scala, decoro, barra, flora, generaOpenWorld,
  // ⚠ ANCHE GLI EFFETTI STANNO QUI, ed è quello che permette di PROVARE dalla
  // console che un blocco vuole più colpi invece di guardarlo e sperare.
  scavo, schegge, agisci, modoGui, diagnostica, mira: () => ({ bersaglio, azSinistra, azDestra, cosaFa }) };

// LA REGIA DEL BANCO DELL'ACQUA — una pagina che serve a scegliere, non a giocare.
//
// ⚠ ESISTE PERCHÉ SCEGLIERE UNO STILE NON È GUARDARE UNA SCENA. Ho proposto
// all'occhio del committente tre disegni del pelo di fila e li ha bocciati
// tutti e tre («piena di macchie», «tremenda, è tutto splattellato»): ogni volta
// sbagliavo il PRINCIPIO, non i numeri, e ogni giro costava un pomeriggio. La
// via d'uscita non è indovinare meglio — è mettere le alternative vere una
// accanto all'altra, su tutti i casi che contano, e poterle scambiare in un
// tasto mentre si guarda.
//
// Qui dentro non c'è nessuna logica di gioco: si costruisce l'acquario
// (`world/acquario.js`, che non sa cosa sia una GPU), si accende il motore, e si
// dà da schiacciare tutto quello che cambia l'aspetto dell'acqua.
//
// ⚠ E L'ERBA PARTE SPENTA, che è una scelta e non una dimenticanza: metà delle
// decisioni sull'acqua si giocano sul BORDO, e i fili d'erba stanno esattamente
// lì davanti. Si riaccende con un tasto quando si vuole vedere la scena vera.

import { Rig } from './motore/motore.js';
import { Fabbrica } from './motore/fabbrica.js';
import { STILI, MODELLI, RICETTE, altezzaPelo } from './motore/acqua.js';
import { pallaSolida } from './motore/palle.js';
import {
  creaPalla, aggiornaPalla, trascinaPalla, portaPalla, mollaPalla, colpisciPalla,
  azzeraPalla, scontraPalle,
} from './gioco/galleggiante.js';
import { Giorno } from './motore/giorno.js';
import { ScalaQualita, misuraHz } from './motore/qualita.js';
import { Mondo } from './world/world.js';
import { Mesher, collegaFabbrica as fabbricaMesher } from './world/mesher.js';
import { collegaFabbrica as fabbricaStagioni } from './world/stagioni.js';
import { Erba, collegaFabbrica as fabbricaErba } from './vegetazione/erba.js';
import { Particelle } from './motore/particelle.js';
import { pianoSpruzzi } from './gioco/spruzzi.js';
import { generaAcquario, VASCHE, centroDi, ingombroDi, SUOLO, PASSO } from './world/acquario.js';

const tela = document.getElementById('tela');
const barra = document.getElementById('barra');
const nota = document.getElementById('nota');
const spia = document.getElementById('fps');

const rig = new Rig(tela);
const fabbrica = new Fabbrica(rig);
fabbricaMesher(fabbrica);
fabbricaStagioni(fabbrica);
fabbricaErba(fabbrica);

const mondo = new Mondo();
const mesher = new Mesher(rig.scena, mondo);
generaAcquario(mondo);
mesher.ricostruisciTutto(mondo);

const erba = new Erba(rig.scena, { max: 120000, densita: rig.profilo.erba, raggioChunk: 2 });
const giorno = new Giorno(rig, { durata: 240, ora: 0.42 });
giorno.auto = false;

// ⚠ FERMA SUL GRADINO MIGLIORE: qui si guarda, non si gioca, e una scala che si
// muove da sola cambierebbe la scena sotto gli occhi proprio mentre si sta
// confrontando due stili.
/**
 * GLI SPRUZZI DELLE CASCATE.
 *
 * ⚠ I PUNTI NON SE LI INVENTA LA REGIA: li dichiara il mesher (`puntiAcqua`),
 * che sa dove una colonna sbatte e da quanto in alto viene. Qui si accende e si
 * spegne, e basta — la decisione di quanti e quali sta in `gioco/spruzzi.js`,
 * che è provato in Node.
 *
 * ⚠ E SI RIFANNO SOLO QUANDO IL MONDO CAMBIA, mai a ogni fotogramma: costruire
 * un sistema di particelle alloca un buffer sulla GPU. Nel banco il mondo non
 * cambia mai dopo l'avvio, quindi è una volta sola.
 */
const particelle = new Particelle(rig.scena, rig);
let spruzziAccesi = true;
function rifaiSpruzzi() {
  particelle.spegniTutte();
  if (!spruzziAccesi) return;
  const { impatti } = mesher.puntiAcqua();
  for (const s of pianoSpruzzi(impatti)) particelle.accendi(s.effetto, s, s.ritocchi);
}
rifaiSpruzzi();

// ⚠ E `particelle` VA PASSATO ALLA SCALA, o la qualità non li governerà: dentro
// `applicaProfilo` c'è `if (particelle) particelle.mostra(p.particelle)`, e senza
// la chiave quel ramo non scatta e basta — nessun errore, nessun avviso.
const scala = new ScalaQualita({ mobile: rig.dispositivo.mobile, applica: (p) => rig.applicaProfilo(p, { erba, particelle }) });
scala.fissa(0);
misuraHz().then((hz) => scala.impostaHz(hz));

// ⚠ L'ERBA SI SPEGNE QUI, DOPO LA SCALA, e l'ordine è un difetto già preso:
// `applicaProfilo` fa `erba.imposta(p.erba > 0)`, e il gradino migliore ha erba
// densa — quindi spegnerla prima di fissare la qualità voleva dire spegnerla e
// riaccenderla nella riga seguente. A schermo il banco partiva con il prato
// addosso alla riva, cioè davanti a metà delle decisioni che deve far prendere.
erba.imposta(false);

// ---- lo stato del banco -----------------------------------------------------
const NOMI_STILE = Object.keys(STILI);
let stile = NOMI_STILE[NOMI_STILE.length - 1];
let quale = 0;
let tempo = 0;

/** Le ore che contano: sono quelle in cui l'acqua cambia mestiere. */
const ORE = [
  { nome: 'alba', t: 0.27 },
  { nome: 'mattina', t: 0.36 },
  { nome: 'mezzogiorno', t: 0.50 },
  { nome: 'tramonto', t: 0.79 },
  { nome: 'notte', t: 0.03 },
];

/**
 * ⚠ IL PIANO DELLO SPECCHIO SEGUE LA VASCA, e senza questa riga il riflesso è
 * giusto in una vasca sola. Un riflesso planare ha UN piano: qui le vasche
 * hanno il pelo a quote diverse (la cascata ce l'ha sei blocchi più in alto), e
 * lo specchio va rimesso a fuoco ogni volta che ci si sposta.
 */
function seguiSpecchio() {
  const pelo = SUOLO + 0.95 + (VASCHE[quale].quotaPelo || 0);
  fabbrica.quotaSpecchioAcqua(pelo);
  // ⚠ LA RISACCA VUOLE IL RETTANGOLO DELL'ACQUA, non della piazzola: con
  // l'ingombro intero tutta l'erba della piazzola (stessa quota della banda)
  // veniva bagnata a pois — verificato spegnendo e riaccendendo. Le vasche
  // senza `rettAcqua` (il ruscello, coi peli a cinque quote) restano senza.
  // ⚠ LA RISACCA SUL TERRENO È SPENTA, per verdetto del committente: «le onde
  // della battigia hanno rotto tutto, sembra sporco». L'infrastruttura resta
  // (fabbrica.rivaTerreno con il rettangolo dell'acqua), perché il difetto era
  // di taratura, non di idea — ma si riaccende solo quando ci sarà un disegno
  // che merita, non prima.
  // ⚠ IL RETTANGOLO SI PASSA COMUNQUE (ampiezza 0 = risacca ferma): adesso lo
  // usa anche il FONDALE ALLA GALAXY (docs/STUDIO-RETRO.md), che ha bisogno di
  // sapere dove sta l'acqua per far ondeggiare solo i vertici sommersi.
  const r = VASCHE[quale].rettAcqua;
  const ox = VASCHE[quale].x * PASSO, oz = VASCHE[quale].z * PASSO;
  fabbrica.rivaTerreno(pelo, 0, r ? { x0: ox + r.x0, z0: oz + r.z0, x1: ox + r.x1, z1: oz + r.z1 } : null);
  fabbrica.fondaleOnda(fondaleGalaxy && r ? 0.06 : 0);
}
/** Il fondale che ondeggia sotto il pelo — si giudica qui prima del gioco. */
let fondaleGalaxy = false;

function vaiA(i) {
  quale = ((i % VASCHE.length) + VASCHE.length) % VASCHE.length;
  const v = VASCHE[quale];
  const c = centroDi(v);
  seguiSpecchio();
  rig.camera.target.set(c.x, c.y, c.z);
  rig.camera.radius = 30;
  rig.camera.beta = 1.05;
  erba.aggiorna(0.016, mondo, c, null, rig.camera.position);
  sistemaPalle();
  disegnaBarra();
}

/**
 * LE RICETTE: un pacchetto intero invece di quattro manopole.
 * ⚠ E STANNO PRIME NELLA BARRA perché sono il modo in cui si SCEGLIE. I quattro
 * assi sciolti servono a capire perché una ricetta funziona, cioè dopo.
 */
function cambiaRicetta(nome) {
  fabbrica.cambiaRicettaAcqua(nome);
  stile = fabbrica.acqua.stile;
  seguiSpecchio();
  disegnaBarra();
}

/** La scala dell'acqua vera: 0 pittura · 1 profondità · 2 rifrazione · 3 caustiche. */
function cambiaVera(livello) {
  stile = fabbrica.cambiaStileAcqua(stile, fabbrica.acqua.onde, fabbrica.acqua.modello, fabbrica.acqua.riflesso, livello);
  disegnaBarra();
}

/** Il modello di luce: il terzo asse, indipendente dagli altri due. */
function cambiaModello(nome) {
  stile = fabbrica.cambiaStileAcqua(stile, fabbrica.acqua.onde, nome);
  disegnaBarra();
}

function cambiaStile(nome, onde) {
  // ⚠ IL SECONDO PARAMETRO VA PASSATO, e il difetto era muto: senza,
  // `cambiaStileAcqua` cade sul valore corrente delle onde e chiamare
  // `cambiaStile('liscia', true)` non le accendeva — restituendo comunque un
  // materiale valido e nessun errore. Trovato provando dalla console, non a
  // schermo: a occhio «l'acqua non ondeggia» si sarebbe letta come onde troppo
  // basse, e avrei alzato l'ampiezza inseguendo un difetto che non c'era.
  stile = fabbrica.cambiaStileAcqua(nome, onde === undefined ? fabbrica.acqua.onde : onde);
  disegnaBarra();
}

function impostaOra(t) {
  giorno.t = ((t % 1) + 1) % 1;
  giorno.applica();
  disegnaBarra();
}

/**
 * ⚠ «GUARDA VERSO IL SOLE» NON È UN VEZZO, ed è la cosa che questo banco ha da
 * insegnare più di tutte. Il luccichio speculare vive in una finestra STRETTA di
 * azimut: fuori vale zero, dentro vale uno. Tarandolo da un'inquadratura a caso
 * sembrava rotto (misurato: due scatti con il brillio a otto volte contro zero
 * muovevano il 9% dei pixel, cioè granelli); girando la camera dalla parte
 * opposta al sole la stessa pozza diventava bianca piena. Un banco che non ha
 * questo tasto porta a tarare al buio.
 *
 * `soleVerso` è il verso in cui VIAGGIA la luce, quindi la sua parte orizzontale
 * punta lontano dal sole: mettendo lì la camera e guardando il bersaglio, si
 * guarda verso il sole.
 */
function guardaVerso(dir) {
  rig.camera.alpha = Math.atan2(dir.z, dir.x);
  rig.camera.beta = 1.38;
}

// ---- la barra dei comandi ---------------------------------------------------
//
// ⚠ ERA UNA PARETE, e il committente l'ha vista dal telefono: «la GUI copre il
// 99% dello schermo e non si capisce nulla». Ventisei bottoni tutti aperti su
// un riquadro da 576 px di larghezza sono quattro righe di comandi e un dito
// d'acqua — cioè un banco che rende impossibile la cosa per cui esiste.
//
// La cura non è rimpicciolire i bottoni: è che di ventisei scelte, in un dato
// momento, ne interessa UNA famiglia. Quindi una riga sola di menu con dentro il
// valore corrente («stile · inchiostro»), e la famiglia si apre solo quando la
// si tocca.
//
// ⚠ E IL MENU APERTO NON SI CHIUDE DOPO LA SCELTA, di proposito: questo banco
// serve a CONFRONTARE, e confrontare vuol dire toccare cinque stili di fila
// guardando in mezzo. Un menu che si richiude a ogni scelta costringe a due
// tocchi per prova, e a quel punto non si confronta più: si campiona.
// ⚠ Sotto, il pannello NON copre mai più di due quinti dello schermo, e scorre.

const scelte = document.getElementById('scelte');
const pannello = document.getElementById('pannello');
let apertoOra = null;

function bottone(testo, acceso, quando) {
  const b = document.createElement('button');
  b.textContent = testo;
  if (acceso) b.className = 'acceso';
  b.onclick = (ev) => { ev.stopPropagation(); quando(); };
  return b;
}

/** I menu, in tabella: etichetta corta, valore corrente, e cosa contengono. */
function menu() {
  return [
    {
      id: 'acqua', valore: () => (fabbrica.acqua.ricetta ? RICETTE[fabbrica.acqua.ricetta].nome : 'su misura'),
      voci: () => Object.entries(RICETTE).map(([n, r]) => [r.nome, n === fabbrica.acqua.ricetta, () => cambiaRicetta(n)]),
    },
    {
      id: 'vasca', valore: () => VASCHE[quale].nome,
      voci: () => VASCHE.map((v, i) => [v.nome, i === quale, () => vaiA(i)]),
    },
    {
      id: 'stile', valore: () => stile,
      voci: () => NOMI_STILE.map((n) => [n, n === stile, () => cambiaStile(n)]),
    },
    {
      id: 'ora', valore: () => giorno.orologio,
      voci: () => [
        ...ORE.map((o) => [o.nome, Math.abs(giorno.t - o.t) < 0.005, () => impostaOra(o.t)]),
        ['− 15 min', false, () => impostaOra(giorno.t - 0.0104)],
        ['+ 15 min', false, () => impostaOra(giorno.t + 0.0104)],
        [giorno.auto ? '⏸ ferma' : '▶ fai girare', giorno.auto, () => { giorno.auto = !giorno.auto; disegnaBarra(); }],
      ],
    },
    {
      // ⚠ LA LUCE È IL MENU CHE MANCAVA, ed è quello che il committente stava
      // chiedendo davvero: non «altre decorazioni», ma altri MODI di trattare
      // la superficie. I dieci disegni passavano tutti dalla stessa legge.
      id: 'luce', valore: () => fabbrica.acqua.modello,
      voci: () => Object.entries(MODELLI).map(([n, m]) => [`${n} — ${m.nota}`, n === fabbrica.acqua.modello, () => cambiaModello(n)]),
    },
    {
      // ⚠ QUESTA È LA SCALA CHE FA LA DIFFERENZA FRA PITTURA E ACQUA DI GIOCO,
      // ed è una scala e non tre interruttori: caustiche ⇒ rifrazione ⇒
      // profondità (le caustiche si dipingono sull'immagine rifratta, la
      // rifrazione ha bisogno dello spessore). Ogni gradino paga passate vere.
      id: 'vera', valore: () => ['pittura', 'profondità', 'rifrazione', 'caustiche'][fabbrica.acqua.vera],
      voci: () => [
        ['pittura (com\'era)', fabbrica.acqua.vera === 0, () => cambiaVera(0)],
        ['profondità — schiuma di contatto, fondale vero', fabbrica.acqua.vera === 1, () => cambiaVera(1)],
        ['rifrazione — il fondo deformato, assorbimento', fabbrica.acqua.vera === 2, () => cambiaVera(2)],
        ['caustiche — la luce dipinta sul fondo', fabbrica.acqua.vera === 3, () => cambiaVera(3)],
      ],
    },
    {
      // ⚠ IL RIFLESSO È L'UNICO CHE COSTA UN PASS, e sta in un menu suo proprio
      // per questo: gli altri assi si combinano liberi, questo va acceso
      // sapendo che si sta pagando un render in più. Il contatore accanto è lì
      // per leggere il prezzo mentre lo si accende.
      id: 'riflesso', valore: () => (fabbrica.acqua.riflesso ? 'planare (1 pass)' : 'nessuno'),
      voci: () => [
        ['nessuno', !fabbrica.acqua.riflesso, () => { stile = fabbrica.cambiaStileAcqua(stile, fabbrica.acqua.onde, fabbrica.acqua.modello, false); }],
        ['planare — costa un pass', fabbrica.acqua.riflesso, () => { stile = fabbrica.cambiaStileAcqua(stile, fabbrica.acqua.onde, fabbrica.acqua.modello, true); seguiSpecchio(); }],
      ],
    },
    {
      // ⚠ IL MOTO È UN MENU SUO, non una voce dentro «vista», e la distinzione
      // è quella che il committente ha messo a fuoco: i dieci «stili» qui sopra
      // dipingono il pelo, il moto lo MUOVE. Sono due decisioni diverse e si
      // combinano — dieci disegni per due geometrie fanno venti materiali, non
      // undici voci in un elenco.
      id: 'moto', valore: () => (fabbrica.acqua.onde ? 'onde vere' : 'lastra ferma'),
      voci: () => [
        ['lastra ferma', !fabbrica.acqua.onde, () => { stile = fabbrica.cambiaStileAcqua(stile, false, fabbrica.acqua.modello); }],
        ['onde vere (vertici)', fabbrica.acqua.onde, () => { stile = fabbrica.cambiaStileAcqua(stile, true, fabbrica.acqua.modello); }],
      ],
    },
    {
      id: 'vista', valore: () => (erba.attiva ? 'con erba' : 'senza erba'),
      voci: () => [
        ['☀ verso il sole', false, () => guardaVerso(rig.soleVerso)],
        ['☾ verso la luna', false, () => guardaVerso(rig.lunaVerso)],
        ['dall\'alto', false, () => { rig.camera.beta = 0.28; }],
        ['di taglio', false, () => { rig.camera.beta = 1.05; }],
        ['radente', false, () => { rig.camera.beta = 1.48; }],
        [erba.attiva ? 'erba: accesa' : 'erba: spenta', erba.attiva, () => { erba.imposta(!erba.attiva); disegnaBarra(); }],
        [pioggia ? '🌧 pioggia: accesa' : 'pioggia: spenta', pioggia, () => { pioggia = !pioggia; disegnaBarra(); }],
        // la «rifrazione» senza passate: il fondale ondeggia, la superficie no
        [fondaleGalaxy ? '〰 fondale Galaxy: acceso' : 'fondale Galaxy: spento', fondaleGalaxy,
          () => { fondaleGalaxy = !fondaleGalaxy; seguiSpecchio(); disegnaBarra(); }],
      ],
    },
    {
      // ⚠ UN MENU SUO, e non una voce dentro «vista»: i particellari sono
      // l'unica cosa di questa pagina che costa disegni e simulazione, quindi
      // devono potersi spegnere da soli mentre si guarda il contatore. È la
      // stessa ragione per cui riflesso e profondità hanno i loro.
      id: 'spruzzi', valore: () => (spruzziAccesi ? `${particelle.vive}` : 'spenti'),
      voci: () => [
        [spruzziAccesi ? 'spruzzi: accesi' : 'spruzzi: spenti', spruzziAccesi,
          () => { spruzziAccesi = !spruzziAccesi; rifaiSpruzzi(); disegnaBarra(); }],
        [`sistemi vivi: ${particelle.sistemi.length}`, false, () => disegnaBarra()],
        [`particelle in volo: ${particelle.vive}`, false, () => disegnaBarra()],
        [particelle.suGPU ? 'girano sulla GPU' : 'girano sulla CPU', false, () => {}],
      ],
    },
  ];
}

function apri(id) {
  apertoOra = apertoOra === id ? null : id;
  disegnaBarra();
}

/**
 * ⚠ LA BARRA È MINIMA DI FABBRICA, ed è una correzione del committente: «è
 * pieno di roba che non mi serve, voglio solo poter cambiare a ruota l'acqua
 * con un tasto comodo e vedere bene tutto». Il mestiere di questa pagina è UNO:
 * passare all'acqua dopo. Quindi di fabbrica ci sono tre tasti — indietro,
 * l'ACQUA (che avanza), la vasca — e tutto il resto (ora, vista, i quattro
 * assi sciolti) sta dietro «⋯», per chi sta tarando invece che scegliendo.
 */
let regia = false;

function nomiRicette() { return Object.keys(RICETTE); }

function giraRicetta(passo) {
  const nomi = nomiRicette();
  const dove = Math.max(0, nomi.indexOf(fabbrica.acqua.ricetta));
  cambiaRicetta(nomi[((dove + passo) % nomi.length + nomi.length) % nomi.length]);
}

function disegnaBarra() {
  scelte.textContent = '';
  pannello.textContent = '';

  if (!regia) {
    const prima = bottone('‹', false, () => giraRicetta(-1));
    const ric = fabbrica.acqua.ricetta ? RICETTE[fabbrica.acqua.ricetta].nome : 'su misura';
    const grande = bottone(`${ric}  ›`, true, () => giraRicetta(1));
    grande.classList.add('grande');
    const vas = bottone(`vasca: ${VASCHE[quale].nome}  ›`, false, () => vaiA(quale + 1));
    const rip = bottone('⚽ ↺', false, () => sistemaPalle());
    rip.title = 'rimetti le palle galleggianti al loro posto';
    const altro = bottone('⋯', false, () => { regia = true; disegnaBarra(); });
    scelte.append(prima, grande, vas, rip, altro);
    pannello.style.display = 'none';
    nota.textContent = fabbrica.acqua.ricetta ? RICETTE[fabbrica.acqua.ricetta].nota : '';
    return;
  }

  scelte.append(bottone('‹ torna ai tre tasti', true, () => { regia = false; apertoOra = null; disegnaBarra(); }));
  for (const m of menu()) {
    // ⚠ IL VALORE STA NEL BOTTONE, non solo dentro il menu: chiuso, il banco
    // deve comunque dire COSA si sta guardando. Senza, per sapere che stile è
    // acceso bisogna aprire il menu — e allora tanto valeva lasciarlo aperto.
    const b = bottone(`${m.id} · ${m.valore()}`, apertoOra === m.id, () => apri(m.id));
    b.classList.add('menu');
    b.dataset.menu = m.id;
    scelte.append(b);
  }
  scelte.append(bottone('?', nota.classList.contains('mostra'), () => { nota.classList.toggle('mostra'); disegnaBarra(); }));
  scelte.append(bottone('nascondi', false, () => { document.body.classList.add('nudo'); }));

  const aperto = menu().find((m) => m.id === apertoOra);
  pannello.style.display = aperto ? 'flex' : 'none';
  if (aperto) for (const [testo, acceso, quando] of aperto.voci()) {
    pannello.append(bottone(testo, acceso, () => { quando(); disegnaBarra(); }));
  }
  const ric = fabbrica.acqua.ricetta ? RICETTE[fabbrica.acqua.ricetta] : null;
  // ⚠ DUE NOTE, non una: quella della VASCA dice cosa guardare in questa scena,
  // quella della RICETTA dice cosa dovrebbe fare questa acqua. Un banco che ne
  // mostra una sola costringe a ricordarsi l'altra.
  nota.textContent = ric ? `${ric.nome} — ${ric.nota}\n\n${VASCHE[quale].nome}: ${VASCHE[quale].nota}`
                         : VASCHE[quale].nota;
}

// ⚠ E SI TORNA INDIETRO TOCCANDO LA SCENA. Un bottone «nascondi» senza il suo
// contrario è una trappola: sul telefono non c'è un tasto Esc, e chi ha nascosto
// la barra resta con una pagina che non fa più niente.
// ⚠ IL CLIC SULL'ACQUA È UN TOCCO, e la distinzione dal TRASCINAMENTO (che
// ruota la camera) si fa a mano: giù/su vicini nel tempo e nello spazio. Il
// punto toccato si trova intersecando il raggio del puntatore col piano del
// pelo — niente picking di scena: è una divisione.
// ---- le palle galleggianti: i segnaposto degli NPC in acqua ----------------
// Quattro misure per vedere come tuffo, scia e schiuma di contatto scalano col
// corpo. Si spostano tenendo premuto (la palla insegue il dito sul piano del
// pelo), un tocco rapido è un colpetto, il bottone ⚽↺ le rimette a casa.
// La fisica sta in gioco/galleggiante.js (Node); qui solo il legame.
const MISURE_PALLE = [0.35, 0.55, 0.8, 1.15];
const TINTE_PALLE = ['#e2574c', '#e8b23a', '#7b57c9', '#3a9e58'];
const palle = MISURE_PALLE.map((r, i) => ({ dati: creaPalla(r, 0, 0, 0), mesh: pallaSolida(rig, r, TINTE_PALLE[i], i) }));
let pallaInMano = null;

function quotaPeloVasca() { return SUOLO + 0.95 + (VASCHE[quale].quotaPelo || 0); }

/**
 * La cima del terreno SOLIDO in una colonna, chiesta al mondo vero.
 * ⚠ È la cura a «si incastra nel terreno / non riesco ad andare in alcuni
 * bordi»: un fondo piatto e dei muri a rettangolo non possono descrivere una
 * vasca scavata in una piazzola — o bloccavano l'acqua buona o lasciavano la
 * palla dentro la sabbia. L'acqua NON è solida, quindi la scansione la buca e
 * trova il fondale.
 */
function quotaTerreno(x, z) {
  const ix = Math.floor(x), iz = Math.floor(z);
  for (let y = SUOLO + 6; y >= SUOLO - 5; y--) {
    if (mondo.solido(ix, y, iz)) return y + 1;
  }
  return SUOLO - 4;
}

function ambientePalle() {
  const g = ingombroDi(VASCHE[quale]);
  return {
    // il pelo VERO, onde comprese: le palle cavalcano la stessa funzione
    // d'onda che la GPU disegna (altezzaPelo), con il moto della ricetta viva
    pelo: (x, z) => quotaPeloVasca() + altezzaPelo(x, z, tempo, fabbrica.acqua.R.moto),
    // il pavimento è il terreno per punto: sull'acqua è il fondale scavato,
    // sulla sabbia è la spiaggia — la palla ci rotola sopra invece di
    // incastrarsi, e si può portare OVUNQUE sulla piazzola
    fondo: quotaTerreno,
    // l'unico muro è il bordo dell'isola: oltre c'è il vuoto
    muri: { x0: g.x0 + 0.4, z0: g.z0 + 0.4, x1: g.x1 - 0.4, z1: g.z1 - 0.4 },
  };
}

/** Le rimette in fila sopra la vasca corrente: cadono, e cadendo si tuffano. */
function sistemaPalle() {
  const c = centroDi(VASCHE[quale]);
  palle.forEach((p, i) => {
    p.dati.casa.x = c.x - 4.5 + i * 3;
    p.dati.casa.y = quotaPeloVasca() + 2.5 + i * 0.6;
    p.dati.casa.z = c.z + 3;
    azzeraPalla(p.dati);
    p.mesh.position.set(p.dati.x, p.dati.y, p.dati.z);
  });
}

/** Quale palla sta sotto il puntatore: raggio contro sfera, in JS puro. */
function pescaPalla(raggio) {
  let vicina = null, piuVicina = Infinity;
  for (const p of palle) {
    const inX = p.dati.x - raggio.origine.x, inY = p.dati.y - raggio.origine.y, inZ = p.dati.z - raggio.origine.z;
    const lungo = inX * raggio.verso.x + inY * raggio.verso.y + inZ * raggio.verso.z;
    if (lungo <= 0) continue;
    const scarto = inX * inX + inY * inY + inZ * inZ - lungo * lungo;
    const presa = p.dati.raggio * 1.5; // margine: col dito non si mira al pixel
    if (scarto <= presa * presa && lungo < piuVicina) { piuVicina = lungo; vicina = p; }
  }
  return vicina;
}

let _giuX = 0, _giuY = 0, _giuT = 0;
let _presaAerea = false; // tasto destro: la palla si prende IN MANO
// il punto del mondo sotto il puntatore, sul piano del pelo (per mirare)
function miraSulPelo(ev) {
  const raggio = rig.raggioDaPuntatore(ev.clientX, ev.clientY);
  if (!raggio || Math.abs(raggio.verso.y) < 1e-4) return null;
  const passi = (quotaPeloVasca() - raggio.origine.y) / raggio.verso.y;
  if (passi <= 0) return null;
  return { x: raggio.origine.x + raggio.verso.x * passi, z: raggio.origine.z + raggio.verso.z * passi };
}
// senza questa riga il tasto destro apre il menu del browser a metà del gesto
document.getElementById('tela').addEventListener('contextmenu', (ev) => ev.preventDefault());
document.getElementById('tela').addEventListener('pointerdown', (ev) => {
  _giuX = ev.clientX; _giuY = ev.clientY; _giuT = performance.now();
  if (document.body.classList.contains('nudo')) document.body.classList.remove('nudo');
  else if (apertoOra) { apertoOra = null; disegnaBarra(); }
  // la presa di una palla SPEGNE la camera: un gesto solo, un significato solo
  const raggio = rig.raggioDaPuntatore(ev.clientX, ev.clientY);
  pallaInMano = raggio ? pescaPalla(raggio) : null;
  // ⚠ IL TASTO DICE IL VERBO: sinistro = trascinare sull'acqua, destro =
  // sollevare in mano («la porto dove voglio, a +2 blocchi dal terreno»)
  _presaAerea = !!pallaInMano && ev.button === 2;
  if (pallaInMano) rig.camera.detachControl();
});
document.getElementById('tela').addEventListener('pointermove', (ev) => {
  if (!pallaInMano) return;
  const mira = miraSulPelo(ev);
  if (!mira) return;
  if (_presaAerea) portaPalla(pallaInMano.dati, mira.x, quotaTerreno(mira.x, mira.z) + 2, mira.z);
  else trascinaPalla(pallaInMano.dati, mira.x, mira.z);
});
document.getElementById('tela').addEventListener('pointerup', (ev) => {
  const fermo = Math.hypot(ev.clientX - _giuX, ev.clientY - _giuY) < 7 && performance.now() - _giuT < 350;
  if (pallaInMano) {
    // il gesto era sulla palla: rapido col sinistro = colpetto nella
    // direzione dello sguardo; lungo = fine della presa (la palla tiene
    // l'abbrivio — mollata dall'aria, ricade e si tuffa)
    if (fermo && !_presaAerea) {
      const spinta = rig.raggioDaPuntatore(ev.clientX, ev.clientY);
      if (spinta) colpisciPalla(pallaInMano.dati, spinta.verso.x, spinta.verso.z, 8);
    }
    mollaPalla(pallaInMano.dati);
    pallaInMano = null;
    _presaAerea = false;
    rig.camera.attachControl(tela, true); // com'era attaccata nel Rig
    return; // niente tocco sull'acqua: un gesto, un significato
  }
  if (!fermo) return;
  const raggio = rig.raggioDaPuntatore(ev.clientX, ev.clientY);
  if (!raggio || Math.abs(raggio.verso.y) < 1e-4) return;
  const pelo = SUOLO + 0.95 + (VASCHE[quale].quotaPelo || 0);
  const passi = (pelo - raggio.origine.y) / raggio.verso.y;
  if (passi <= 0) return;
  fabbrica.toccaAcqua(raggio.origine.x + raggio.verso.x * passi, raggio.origine.z + raggio.verso.z * passi, 1);
});

/** La pioggia: tocchi a caso attorno alla vasca, per vedere il sistema vivere. */
let pioggia = false;
let _pioggiaFra = 0;

// ---- i tasti, per chi ci lavora --------------------------------------------
addEventListener('keydown', (e) => {
  if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.code === 'ArrowRight' || e.code === 'KeyE') vaiA(quale + 1);
  else if (e.code === 'ArrowLeft' || e.code === 'KeyQ') vaiA(quale - 1);
  // ⚠ H GIRA LE RICETTE, non più gli stili sciolti: è il tasto comodo chiesto
  // dal committente, e deve fare la cosa che si fa cento volte, non quella che
  // si fa due. Gli assi sciolti restano dietro «⋯».
  else if (e.code === 'KeyH' && e.shiftKey) giraRicetta(-1);
  else if (e.code === 'KeyH') giraRicetta(1);
  else if (e.code === 'ArrowUp') impostaOra(giorno.t + 0.0104);
  else if (e.code === 'ArrowDown') impostaOra(giorno.t - 0.0104);
  else if (e.code === 'Space') { giorno.auto = !giorno.auto; disegnaBarra(); e.preventDefault(); }
  else if (e.code === 'KeyS') guardaVerso(rig.soleVerso);
  else if (e.code === 'KeyG') { erba.imposta(!erba.attiva); disegnaBarra(); }
  else if (e.code === 'KeyK') scala.fissa((scala.livello + 1) % scala.quanti);
});

vaiA(0);
// ⚠ SI PARTE SU UNA RICETTA, non su «su misura»: il primo tasto della pagina
// dice il nome dell'acqua, e un banco che si apre senza un'acqua scelta
// comincia con una parola vuota proprio dove deve esserci il suo mestiere.
cambiaRicetta('lago');

// ---- il giro ----------------------------------------------------------------
const finestra = [];
let ultimo = performance.now();

// ⚠ IL CORPO DEL GIRO HA UN NOME (`giroBanco`) e sta anche su BANCO: nel pane
// headless requestAnimationFrame non scatta (trappola nota), e per verificare
// palle e tocchi bisogna poter far battere il giro a mano, con lo stesso
// codice che gira dal vivo — non con una copia che diverge.
const giroBanco = (dt) => {
  giorno.aggiorna(dt);
  // ⚠ A TEMPO, NON A FOTOGRAMMI: a 144 Hz e a 30 la corrente deve andare alla
  // stessa velocità, se no su una macchina lenta il ruscello rallenta insieme
  // agli fps e si legge come un difetto della fisica.
  tempo += dt;
  fabbrica.animaAcqua(tempo);
  // le palle: fisica pura, POI gli urti fra loro, POI le mesh si mettono
  // dov'è finita la fisica. Gli eventi diventano segni sull'acqua: il tuffo è
  // un tocco (cerchio che sfuma + onda nel riflesso), la scia va sul SUO
  // registro (dischetti morbidi che svaniscono). La schiuma al bordo non
  // passa da qui: la fa la profondità `vera` da sola.
  const ambiente = ambientePalle();
  for (const p of palle) {
    const eventi = aggiornaPalla(p.dati, dt, ambiente);
    if (eventi.tuffo) fabbrica.toccaAcqua(eventi.tuffo.x, eventi.tuffo.z, eventi.tuffo.forza);
    if (eventi.scia) fabbrica.sciaAcqua(eventi.scia.x, eventi.scia.z, eventi.scia.forza);
  }
  scontraPalle(palle.map((p) => p.dati));
  for (const p of palle) p.mesh.position.set(p.dati.x, p.dati.y, p.dati.z);
  // la pioggia: un tocco ogni tanto, dentro la vasca che si sta guardando
  if (pioggia) {
    _pioggiaFra -= dt;
    if (_pioggiaFra <= 0) {
      _pioggiaFra = 0.10 + Math.random() * 0.14;
      const c = centroDi(VASCHE[quale]);
      fabbrica.toccaAcqua(c.x + (Math.random() - 0.5) * 16, c.z + (Math.random() - 0.5) * 16, 0.5 + Math.random() * 0.5);
    }
  }
  if (erba.attiva) erba.aggiorna(dt, mondo, centroDi(VASCHE[quale]), null, rig.camera.position);
  // ⚠ VA CHIAMATO OGNI FOTOGRAMMA ANCHE SE NON SI SPOSTA NIENTE: è l'unico posto
  // che RIACCENDE i sistemi (`mostra(false)` spegne e non riaccende, apposta —
  // due comandi sullo stesso oggetto vogliono un arbitro). Senza questa riga i
  // particellari si spengono alla prima volta che escono di portata e non
  // tornano più, e sembrerebbe che si «rompano da soli».
  particelle.aggiorna(rig.camera, PASSO * 1.3);

  const ora = performance.now();
  finestra.push(ora - ultimo); ultimo = ora;
  if (finestra.length > 240) finestra.shift();
  if (finestra.length < 30 || finestra.length % 20) return;
  const ordinati = finestra.slice().sort((a, b) => a - b);
  const p = (q) => ordinati[Math.floor(ordinati.length * q)].toFixed(1);
  // ⚠ NON GLI FPS: i MILLISECONDI, e il p99 accanto al p50. Una media non
  // descrive mai uno scatto, e qui si guardano superfici trasparenti — che è
  // proprio la famiglia di cose che costa a picchi, non in media.
  spia.textContent = `${Math.round(1000 / ordinati[ordinati.length >> 1])} fps   ${p(0.5)} / ${p(0.99)} ms\n`
    + `${giorno.orologio}   ${fabbrica.acqua.materiale.name}   q${scala.livello}   ${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()}`;
  // ⚠ QUANDO L'ORA GIRA SI RISCRIVE SOLO LA SUA ETICHETTA, non tutta la barra:
  // ricostruire i bottoni tre volte al secondo vuol dire che un tocco può
  // cadere su un bottone che sta per essere buttato via — sul telefono si
  // traduce in comandi che «ogni tanto non rispondono».
  if (giorno.auto) {
    const chip = scelte.querySelector('[data-menu="ora"]');
    if (chip) chip.textContent = `ora · ${giorno.orologio}`;
  }
};
rig.avvia(giroBanco);

globalThis.BANCO = { RICETTE, cambiaRicetta, rig, fabbrica, mondo, mesher, erba, giorno, scala, VASCHE, vaiA, cambiaStile, cambiaModello, STILI, MODELLI, particelle, rifaiSpruzzi, palle, sistemaPalle, giroBanco };

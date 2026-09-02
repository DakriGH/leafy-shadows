// Mesher dei supercubi — SPEC-TECNICA.md §1.
// Tre famiglie di blocchi:
//  · supercubo classico (26 pezzi, culling distruttivo sui vicini);
//  · blocco col CAPPELLO (erba): profilo ricavato dal GrassCell.fbx dell'utente —
//    corpo 18 px + bordino che sborda a 20 px, sotto-smusso, parete del brim,
//    smusso alto e cima A FILO cella. Le cime si affiancano al pixel: il brim
//    esiste solo sui lati esposti (il modello Blockbench sovrappone, noi culliamo);
//  · acqua: scatola col pelo ribassato di 2 px sotto la cima dell'erba.
// Il mondo è a chunk: si ricostruiscono solo i chunk sporchi.

// ⚠ QUI NON SI NOMINA IL MOTORE. Vedi src/motore/motore.js per il perché: in
// Leafy-Lantern questo file importava three e `../fx/materials.js`, e quei due
// import da soli legavano tutta la cartella `world/` al motore grafico. Il
// mesher riempie array di float — è sempre stato così — e adesso li consegna a
// una FABBRICA iniettata da main, che è l'unica a sapere cosa sia una mesh.
import { BLOCCHI, defDi, tipoBase, livelloAcqua } from './blocks.js';
import { paletteBlocco, coloreFaccia } from './stagioni.js';
import { materiaDi, tingiMateria, indiceMateria } from './materie.js';
import { FORME_EXTRA, FORME_VUOTE } from './forme.js';
import { tintaPalette } from './motivi.js';
import { GrigliaLuce, scatolaPerMondo } from './luce.js';
import { fotografa } from './mesher-foto.js';

// La fabbrica di resa. La inietta main all'avvio; qui si sa solo che espone
// creaChunk / scrivi / rimuoviChunk / materialeMondo, e i quattro nomi della
// luce a voxel che per ora sono innocui.
let _f = null;
export function collegaFabbrica(f) { _f = f; }
const materialeMondo   = () => _f.materialeMondo();
const materialeAcqua   = () => _f.materialeAcqua();
const aggiornaCielo    = (c) => _f.aggiornaCielo(c);
const impostaVoxel     = (a, b, c) => _f.impostaVoxel(a, b, c);
const spegniVoxel      = () => _f.spegniVoxel();
const latoMassimoVoxel = () => _f.latoMassimoVoxel();
const mondoVelato      = () => _f.mondoVelato();
import { CHUNK } from './world.js';

/**
 * QUANTI CHUNK ATTORNO AL GIOCATORE SI COSTRUISCONO SUBITO, all'avvio.
 *
 * ⚠ UNO, cioè un quadrato 3×3 = 9 chunk di 16 celle: quarantotto blocchi per
 * lato attorno a chi guarda. Il resto arriva dalla coda, dal più vicino al più
 * lontano, un chunk per fotogramma.
 *
 * ⚠ IL NUMERO VIENE DA UNA MISURA, non dal gusto. Con tutti e 49 in un colpo il
 * blocco era 657 ms qui e 5.507 sul telefono del committente; con raggio 2
 * (25 chunk su 49) scendeva solo a 443 — mezza misura per mezzo problema. Con
 * raggio 1 sono 204 ms, e i 40 chunk rimasti entrano da soli in 803 ms senza
 * che il gioco smetta di rispondere.
 *
 * ⚠ E IL PREZZO È CHE IL MONDO SI VEDE POPOLARE. Vale la pena: uno schermo fermo
 * si legge come un gioco rotto, un mondo che si riempie si legge come un mondo
 * che carica. Se un giorno il pop-in desse fastidio, questa è la manopola.
 */
const RAGGIO_SUBITO = 1;

const U = 1 / 16;                 // 1 pixel in unità mondo
const COPPIE_SMUSSO = [[0, 1], [0, 2], [1, 2]];
const LATI = [[1, 0], [-1, 0], [0, 1], [0, -1]];
/** Da esadecimale a tre float [0..1]. ⚠ NIENTE CONVERSIONE DI SPAZIO COLORE:
 *  era `THREE.Color.setHex`, che con la gestione colore accesa converte
 *  sRGB→lineare. Qui il colore va nel buffer com'è e la conversione la fa il
 *  motore alla fine, che è dove va fatta una volta sola. */
const _colore = { r: 0, g: 0, b: 0 };
function _daHex(h) {
  _colore.r = ((h >> 16) & 255) / 255;
  _colore.g = ((h >> 8) & 255) / 255;
  _colore.b = (h & 255) / 255;
}

// COLORI PIATTI DA PALETTE, ED È UNA SCELTA GRAFICA — non una cosa che manca.
// Qui NON c'è ombreggiatura per direzione di faccia e NON c'è occlusione
// ambientale: un tentativo le aveva aggiunte entrambe (una costante per normale
// più il velo classico sui tre vicini dell'angolo) ed è stato bocciato. Lo
// stacco fra le facce lo dà GIÀ coloreFaccia() scegliendo cima/lato/fondo dalla
// palette, e il volume lo danno le luci-sfera con le loro bande nette: sono
// quelli i gradini voluti, e un secondo moltiplicatore continuo sopra li
// sporcava. Il colore che finisce nel buffer è quindi ESATTAMENTE quello della
// palette, senza nessun fattore in mezzo. Se un giorno torna la tentazione:
// git show b540f50 ha l'implementazione completa di entrambe.

// Indice nell'intorno 3×3×3 precalcolato del blocco in corso. I VICINI SI
// PRECALCOLANO perché mondo.tipo() compone una stringa "x,y,z" e cerca in una
// Map, e il solo culling del supercubo ne chiede una cinquantina per blocco:
// con la cache diventa un'indicizzazione d'array.
const IV = (dx, dy, dz) => ((dy + 1) * 3 + (dz + 1)) * 3 + (dx + 1);


class Costruttore {
  constructor() {
    this.pos = []; this.col = []; this.acq = null; this._ex = null;
    // L'IDENTITÀ DELLA MATERIA per vertice (world/materie.js): 0 = nessuna. Si
    // scrive SEMPRE, anche tutta a zero, perché lo shader del mondo dichiara
    // l'attributo e una mesh senza quel buffer leggerebbe l'attributo spento.
    this.mat = []; this._materia = 0;
    // vertici "cima d'erba" [indice, quotaCella, …]: il cambio stagione SMOOTH
    // riscrive solo questi float nel color buffer, senza ricostruire nulla
    this.erbe = [];
    this._erbaHex = null; this._erbaY = 0;
  }

  // QUI IL MESHER CUOCEVA L'OCCLUSIONE, un attributo aOcc di tre byte per
  // vertice: 24 bit, uno per lampada, letti nella cella d'aria davanti a ogni
  // faccia. Non c'è più, e non è una semplificazione gratuita — era la CAUSA
  // delle «ombre quadrate e tagliate»: un dato per faccia e per cella può
  // cambiare valore solo sui confini dei voxel, quindi il bordo dell'ombra
  // scendeva a scalini da una cella. Adesso l'ombra si legge per FRAMMENTO da
  // una mappa d'ombra per lampada (world/ombre.js), in coordinate mondo: la
  // geometria non ne porta più traccia, e ci guadagnano anche gatto, mano,
  // mobili e creature, che prima andavano sondati a mano uno per uno.

  /** Attiva/spegne la marcatura dei triangoli color pal.cima come "erba". */
  erba(hexCima, quotaCella) { this._erbaHex = hexCima; this._erbaY = quotaCella; }
  fineErba() { this._erbaHex = null; }
  /** La materia dei prossimi triangoli (indice della tavolozza, 0 = nessuna). */
  materia(i) { this._materia = i | 0; }

  /** Canale extra per-vertice dell'ACQUA: (dirX corrente, dirZ corrente, tipo faccia).
   *  tipo: 0 sorgente calma · 1 pelo che scorre · 2 lato cascata · 3 schiuma · 5 piatto. */
  extra(fx, fz, tipo) {
    if (!this.acq) { this.acq = []; this.riv = []; }
    this._ex = [fx, fz, tipo];
  }

  /** riva per-vertice, DUE numeri per angolo: (quanto è lontana la sponda,
   *  quanta acqua aperta c'è intorno) — vedi rivaAngolo(). Il default (1,1) è
   *  "largo e aperto", cioè nessuna schiuma: è ciò che leggono le facce
   *  laterali, che la riva non ce l'hanno. */
  tri(a, b, c, colore, fuori, rABC = null) {
    let rA = UNO_UNO, rB = UNO_UNO, rC = UNO_UNO;
    if (rABC) { rA = rABC[0]; rB = rABC[1]; rC = rABC[2]; }
    const abx = b[0] - a[0], aby = b[1] - a[1], abz = b[2] - a[2];
    const acx = c[0] - a[0], acy = c[1] - a[1], acz = c[2] - a[2];
    const nx = aby * acz - abz * acy, ny = abz * acx - abx * acz, nz = abx * acy - aby * acx;
    if (nx * fuori[0] + ny * fuori[1] + nz * fuori[2] < 0) {
      const t = b; b = c; c = t;
      const tr = rB; rB = rC; rC = tr;
    }
    if (this._erbaHex !== null && colore === this._erbaHex) {
      this.erbe.push(this.pos.length / 3, this._erbaY);
    }
    this.pos.push(a[0], a[1], a[2], b[0], b[1], b[2], c[0], c[1], c[2]);
    // IL COLORE DELLA PALETTE, TALE E QUALE, su tutti e tre i vertici: nessun
    // moltiplicatore per direzione di faccia né per occlusione (vedi in alto)
    _daHex(colore);
    for (let i = 0; i < 3; i++) this.col.push(_colore.r, _colore.g, _colore.b);
    this.mat.push(this._materia, this._materia, this._materia);
    if (this.acq) {
      const e = this._ex || [0, 0, 5];
      for (let i = 0; i < 3; i++) this.acq.push(e[0], e[1], e[2]);
      this.riv.push(rA[0], rA[1], rB[0], rB[1], rC[0], rC[1]);
    }
  }

  // SEMPRE la diagonale a–c. La rotazione condizionale su b–d serviva SOLO
  // all'occlusione ambientale: erano i suoi quattro valori d'angolo a poter
  // essere non coplanari, e lì la diagonale sbagliata lasciava una cucitura
  // visibile in mezzo alla faccia. Senza AO i quattro vertici di un quad hanno
  // lo STESSO identico colore, quindi non c'è più niente da interpolare e
  // nessun taglio può vedersi.
  quad(a, b, c, d, colore, fuori, rABCD = null) {
    this.tri(a, b, c, colore, fuori, rABCD ? [rABCD[0], rABCD[1], rABCD[2]] : null);
    this.tri(a, c, d, colore, fuori, rABCD ? [rABCD[0], rABCD[2], rABCD[3]] : null);
  }

  /** I dati grezzi, non una geometria: chi li monta è la fabbrica.
   *  ⚠ È IL CONFINE. Finché questo metodo torna array, `world/` resta
   *  agnostico e si può provare in Node senza un contesto grafico. */
  dati() {
    return { pos: this.pos, col: this.col, mat: this.mat, acq: this.acq || null, riv: this.riv || null };
  }

  get vuoto() { return this.pos.length === 0; }
}

/** Costruttore per il liquido: in più tiene i punti per i particellari
 *  (correnti sul pelo e impatti delle cascate). */
function costruttoreAcqua() {
  const c = new Costruttore();
  c.flussi = []; c.impatti = [];
  return c;
}

function vec(cx, cy, cz, a, va, b, vb, c, vc) {
  const p = [cx, cy, cz];
  p[a] += va; p[b] += vb; p[c] += vc;
  return p;
}

// ---- supercubo classico (26 pezzi) -----------------------------------------

/**
 * @param orlo quanto SCHIARIRE i venti pezzi smussati (0 = come le facce).
 *
 * ⚠ L'ORLO SOSTITUISCE UNA DISTINZIONE CHE C'ERA GIÀ, e questo è l'argomento
 * che lo separa dal chiaroscuro cotto che il committente ha bocciato. Oggi lo
 * smusso sceglie il colore con `cima ? pal.cima : (fondo ? pal.fondo : pal.lato)`,
 * cioè TRE classi per orientamento. L'orlo le rimpiazza con UNA voce sola per
 * tutti e venti i pezzi: dopo l'orlo gli smussi sono PIÙ isotropi di adesso,
 * non meno. Resta un argomento, e va guardato a schermo prima di crederci.
 */
/** ⚠ L'ORLO SCHIARISCE E BASTA: la tinta e la saturazione della materia sono
 *  GIÀ dentro `pal` (le ha applicate `costruisciBlocco`). Ripassarci la materia
 *  vera le applicherebbe DUE VOLTE — un metallo grigio-ferro diventerebbe
 *  carbone, e solo sugli smussi. Questa riga finta ha tinta e saturazione
 *  neutre apposta: fa solo lo `schiarisci`. */
const ORLO_PIATTO = { tinta: 1, satura: 1 };

export function supercubo(b, cx, cy, cz, pal, vicino, orlo = 0) {
  const F = 8 * U, H = 9 * U;
  const N = (asse, s) => vicino(asse === 0 ? s : 0, asse === 1 ? s : 0, asse === 2 ? s : 0);

  for (let a = 0; a < 3; a++) {
    for (const s of [-1, 1]) {
      if (N(a, s)) continue;
      const bA = (a + 1) % 3, cA = (a + 2) % 3;
      // pittura PER FACCIA se il blocco ce l'ha, altrimenti cima/lato/fondo
      const colore = coloreFaccia(pal, a, s);
      const fuori = [0, 0, 0]; fuori[a] = s;
      b.quad(
        vec(cx, cy, cz, a, s * H, bA, -F, cA, -F),
        vec(cx, cy, cz, a, s * H, bA, +F, cA, -F),
        vec(cx, cy, cz, a, s * H, bA, +F, cA, +F),
        vec(cx, cy, cz, a, s * H, bA, -F, cA, +F),
        colore, fuori,
      );
    }
  }
  for (const [a, bAsse] of COPPIE_SMUSSO) {
    const t = 3 - a - bAsse;
    for (const sa of [-1, 1]) for (const sb of [-1, 1]) {
      if (N(a, sa) || N(bAsse, sb)) continue;
      const cima = (a === 1 && sa > 0) || (bAsse === 1 && sb > 0);
      const fondo = (a === 1 && sa < 0) || (bAsse === 1 && sb < 0);
      const base = cima ? pal.cima : (fondo ? pal.fondo : pal.lato);
      const colore = orlo ? tingiMateria(base, ORLO_PIATTO, orlo) : base;
      const fuori = [0, 0, 0]; fuori[a] = sa; fuori[bAsse] = sb;
      b.quad(
        vec(cx, cy, cz, a, sa * H, bAsse, sb * F, t, -F),
        vec(cx, cy, cz, a, sa * F, bAsse, sb * H, t, -F),
        vec(cx, cy, cz, a, sa * F, bAsse, sb * H, t, +F),
        vec(cx, cy, cz, a, sa * H, bAsse, sb * F, t, +F),
        colore, fuori,
      );
    }
  }
  for (const sx of [-1, 1]) for (const sy of [-1, 1]) for (const sz of [-1, 1]) {
    if (N(0, sx) || N(1, sy) || N(2, sz)) continue;
    b.tri(
      [cx + sx * H, cy + sy * F, cz + sz * F],
      [cx + sx * F, cy + sy * H, cz + sz * F],
      [cx + sx * F, cy + sy * F, cz + sz * H],
      orlo ? tingiMateria(sy > 0 ? pal.cima : pal.fondo, ORLO_PIATTO, orlo)
           : (sy > 0 ? pal.cima : pal.fondo), [sx, sy, sz],
    );
  }
}

// ---- blocco col cappello (profilo GrassCell, quote in px dal centro cella) --
//   corpo: fondo −9 (metà 8) · smusso · parete ±9 da −8 a +2 · taglio d'angolo
//   cappello: sotto-smusso (9,+2)→(10,+3) · brim ±10 da +3 a +7 ·
//             smusso alto (10,+7)→(9,+8) · estensione piatta a +8 (8→9) · cima ±8 a +8

function conCappello(b, cx, cy, cz, pal, vicino) {
  const Nh = (dx, dz) => vicino(dx, 0, dz);
  const sotto = vicino(0, -1, 0);
  const cima = pal.cima, lato = pal.lato, fondo = pal.fondo;
  const p = (x, y, z) => [cx + x * U, cy + y * U, cz + z * U];

  // fondo e smussi bassi (come il supercubo)
  if (!sotto) {
    b.quad(p(-8, -9, -8), p(8, -9, -8), p(8, -9, 8), p(-8, -9, 8), fondo, [0, -1, 0]);
  }
  for (const [dx, dz] of LATI) {
    if (Nh(dx, dz)) continue;
    const tx = -dz, tz = dx;                       // tangente
    const q = (u, y, t) => p(u * dx + t * tx, y, u * dz + t * tz);
    const fuori = [dx, 0, dz];
    if (!sotto) b.quad(q(8, -9, -8), q(9, -8, -8), q(9, -8, 8), q(8, -9, 8), fondo, [dx, -1, dz]);
    b.quad(q(9, -8, -8), q(9, 2, -8), q(9, 2, 8), q(9, -8, 8), lato, fuori);      // parete corpo
    b.quad(q(9, 2, -8), q(10, 3, -8), q(10, 3, 8), q(9, 2, 8), cima, fuori);      // sotto-smusso brim
    b.quad(q(10, 3, -8), q(10, 7, -8), q(10, 7, 8), q(10, 3, 8), cima, fuori);    // parete brim
    b.quad(q(10, 7, -8), q(9, 8, -8), q(9, 8, 8), q(10, 7, 8), cima, [dx, 1, dz]); // smusso alto
    b.quad(q(8, 8, -8), q(9, 8, -8), q(9, 8, 8), q(8, 8, 8), cima, [0, 1, 0]);    // estensione cima
  }
  for (const sx of [-1, 1]) for (const sz of [-1, 1]) {
    if (Nh(sx, 0) || Nh(0, sz)) continue;
    const q = (x, y, z) => p(x * sx, y, z * sz);
    const fuori = [sx, 0, sz];
    if (!sotto) b.tri(q(9, -8, 8), q(8, -9, 8), q(8, -8, 9), fondo, [sx, -1, sz]); // angolo basso
    b.quad(q(9, -8, 8), q(8, -8, 9), q(8, 2, 9), q(9, 2, 8), lato, fuori);         // taglio verticale corpo
    b.quad(q(9, 2, 8), q(8, 2, 9), q(8, 3, 10), q(10, 3, 8), cima, fuori);         // angolo sotto-smusso
    b.quad(q(10, 3, 8), q(8, 3, 10), q(8, 7, 10), q(10, 7, 8), cima, fuori);       // angolo brim
    b.quad(q(10, 7, 8), q(8, 7, 10), q(8, 8, 9), q(9, 8, 8), cima, [sx, 1, sz]);   // angolo smusso alto
    b.tri(q(8, 8, 8), q(9, 8, 8), q(8, 8, 9), cima, [0, 1, 0]);                    // angolo estensione
  }
  // cima centrale (il ramo cappello esiste solo se sopra c'è aria)
  b.quad(p(-8, 8, -8), p(8, 8, -8), p(8, 8, 8), p(-8, 8, 8), cima, [0, 1, 0]);
}

// ---- acqua: scatola A FILO CELLA (16 px), pelo che scende col livello --------
// A 18 px le cime di celle d'acqua adiacenti si sovrapponevano di 2 px e la
// doppia trasparenza disegnava una griglia scura. A 16 px combaciano al pixel
// e restano comunque sigillate: i corpi dei solidi vicini (18 px) le coprono.
// Il pelo: sorgente +7 px, flussi più bassi (7 − 2·livello) → rivoli e cascate.

const peloDi = (L) => (7 - 2 * Math.max(0, L)) * U;

// ---- RIVA: una DISTANZA, non un interruttore --------------------------------
// aRiva valeva 0 o 1 per angolo ("tocco un solido / non lo tocco"): la banda di
// schiuma era larga ESATTAMENTE una cella e NESSUNA soglia nello shader poteva
// allargarla, per quanto la si girasse. Adesso ogni angolo porta due numeri:
//   x = quanto è LONTANA la sponda (0 = ci sto addosso, 1 = RIVA_RAGGIO celle);
//   y = quanta ACQUA APERTA c'è intorno (1 = mare aperto, ~0.2 = canaletto).
//
// Il secondo è quello che rende sicura tutta l'operazione, e nasce da un limite
// che la sola distanza non può aggirare: in un canale largo UNA cella tutti e
// quattro gli angoli toccano una sponda, quindi la distanza vale 0 su tutta la
// cella e qualunque soglia la dipingerebbe di bianco piena. È esattamente il
// foglio bianco già visto una volta, ed è il motivo per cui a suo tempo la
// soglia venne alzata fino a spegnere quasi tutta la schiuma. L'apertura in quel
// canale vale ~0.2 contro lo ~0.5 di una riva vera: allo shader basta per
// distinguerli, e la soglia può tornare generosa dove la riva è vera.
const RIVA_RAGGIO = 2;
const RIVA_LATO = RIVA_RAGGIO * 2 + 1;
const UNO_UNO = [1, 1];              // "largo e aperto": nessuna schiuma
// L'intorno 5×5 della cella d'acqua in corso (1 = colonna che ferma l'acqua) e
// i quattro angoli già calcolati. Scratch riusati: acquaBox li consuma dentro
// lo stesso quad(), e allocare cinque array per cella d'acqua è lavoro per il GC
// in un ciclo che gira su ogni pelo del mondo.
const _rivaIntorno = new Uint8Array(RIVA_LATO * RIVA_LATO);
const _rivaAngoli = [[1, 1], [1, 1], [1, 1], [1, 1]];   // −−, +−, ++, −+

// Dislivello fra i quattro angoli oltre il quale il pelo non è più un pelo ma
// uno scivolo (vedi il tipo 3 in acquaBox). Mezzo blocco su una cella: i
// raccordi dolci fra due livelli d'acqua valgono 2 px = 0.125, quelli veri
// delle rampe arrivano a 0.75÷1.0 — misurati sulla scalinata di collaudo.
const PENDENZA_RIPIDA = 0.5;

/**
 * Distanza dalla sponda e apertura per TUTTI E QUATTRO gli angoli della cella
 * d'acqua, in una passata sola. Scrive in `_rivaAngoli` e lo ritorna.
 * `solido(dx,dz)` = c'è un blocco che ferma l'acqua in quella colonna.
 *
 * UNA LETTURA DEL MONDO, NON QUATTRO. La finestra 5×5 non dipende dall'angolo —
 * sx/sz entrano solo nell'aritmetica della distanza — quindi scandirla una volta
 * per angolo era ripetere quattro volte lo stesso lavoro: 100 mondo.tipo() per
 * cella d'acqua invece dei 25 dichiarati nel commento, e mondo.tipo() compone
 * una stringa "x,y,z" e cerca in una Map. Misurato sul collaudo con la funzione
 * strumentata: 4587 chiamate per 37 celle, di cui 3200 attribuibili alla riva e
 * 2400 ripetizioni byte-identiche.
 *
 * L'angolo sta a mezza cella dal centro: è da LÌ che si misura, altrimenti i
 * quattro angoli avrebbero tutti la stessa distanza e il canale tornerebbe
 * piatto. Le distanze sono al BORDO della cella solida (−0.5), non al centro.
 *
 * L'APERTURA È UNA LARGHEZZA, non più una frazione di celle aperte. La frazione
 * non sapeva distinguere "canale stretto" da "riva di uno specchio d'acqua", e
 * anzi li metteva nell'ordine SBAGLIATO: la cella d'angolo di una pozza 5×5 ha
 * 9 colonne aperte su 25 (0.36), MENO di un canale largo due celle (10/25 =
 * 0.40). A schermo il canale da 2 usciva più bianco (37.2% dei pixel) della
 * pozza (29.4%), e quello da 1 — l'unico caso che il collaudo prova — era
 * l'unico corretto. Qui si conta la cosa vera: quante celle d'acqua CONSECUTIVE
 * ci sono attraversando la cella in X e in Z, e si tiene la più stretta. Il
 * canale da 1 vale ancora 1/5 = 0.20 esatto (la taratura dello shader regge),
 * quello da 2 vale 0.40, quello da 3 vale 0.60 — e la pozza non scende mai
 * sotto 0.60. La relazione con la larghezza torna monotòna.
 */
function rivaCella(solido) {
  const g = _rivaIntorno;
  for (let dx = -RIVA_RAGGIO; dx <= RIVA_RAGGIO; dx++) {
    for (let dz = -RIVA_RAGGIO; dz <= RIVA_RAGGIO; dz++) {
      g[(dx + RIVA_RAGGIO) * RIVA_LATO + (dz + RIVA_RAGGIO)] = solido(dx, dz) ? 1 : 0;
    }
  }
  // larghezza libera attraversando il centro, sui due assi: si cammina finché
  // non si incontra una sponda (la cella di mezzo è acqua per costruzione)
  const C = RIVA_RAGGIO;
  let spanX = 1, spanZ = 1;
  for (let d = 1; d <= RIVA_RAGGIO; d++) { if (g[(C + d) * RIVA_LATO + C]) break; spanX++; }
  for (let d = 1; d <= RIVA_RAGGIO; d++) { if (g[(C - d) * RIVA_LATO + C]) break; spanX++; }
  for (let d = 1; d <= RIVA_RAGGIO; d++) { if (g[C * RIVA_LATO + C + d]) break; spanZ++; }
  for (let d = 1; d <= RIVA_RAGGIO; d++) { if (g[C * RIVA_LATO + C - d]) break; spanZ++; }
  const apertura = Math.min(spanX, spanZ) / RIVA_LATO;

  for (let a = 0; a < 4; a++) {
    const sx = a === 0 || a === 3 ? -1 : 1;
    const sz = a < 2 ? -1 : 1;
    const cx = sx * 0.5, cz = sz * 0.5;
    let vicina2 = Infinity;
    for (let dx = -RIVA_RAGGIO; dx <= RIVA_RAGGIO; dx++) {
      for (let dz = -RIVA_RAGGIO; dz <= RIVA_RAGGIO; dz++) {
        if (!g[(dx + RIVA_RAGGIO) * RIVA_LATO + (dz + RIVA_RAGGIO)]) continue;
        const ax = dx - cx, az = dz - cz, d2 = ax * ax + az * az;
        if (d2 < vicina2) vicina2 = d2;
      }
    }
    // la radice UNA volta sola, sul minimo: ordinare per distanza o per distanza
    // AL QUADRATO è la stessa cosa, e Math.hypot dentro un ciclo per cella
    // d'acqua è fra le cose più lente che V8 sappia fare
    const vicina = vicina2 === Infinity ? RIVA_RAGGIO : Math.max(0, Math.sqrt(vicina2) - 0.5);
    _rivaAngoli[a][0] = Math.min(1, vicina / RIVA_RAGGIO);
    _rivaAngoli[a][1] = apertura;
  }
  return _rivaAngoli;
}

// info = { livello, mioSopra, cascata, flusso:[fx,fz], vicinoAcqua, vicinoPieno }
function acquaBox(b, cx, cy, cz, pal, info) {
  const F = 8 * U;
  const { livello, mioSopra, cascata, flusso, vicinoAcqua, vicinoPieno, acquaA, colonna } = info;
  // UNA sola lettura per colonna: rivaAngolo ne scandisce 25, e passare dal
  // paio vicinoAcqua+vicinoPieno (tre mondo.tipo/pieno a cella) le triplicava
  const solidoXZ = info.solidoXZ || ((dx, dz) => vicinoAcqua(dx, dz) === null && vicinoPieno(dx, 0, dz));
  const p = (x, y, z) => [cx + x, cy + y, cz + z];
  const scorre = flusso[0] !== 0 || flusso[1] !== 0;
  const mioPelo = peloDi(livello);
  const pelo = mioSopra ? F : mioPelo;

  // QUOTA D'ANGOLO (le "curve" di Minecraft): ogni angolo del pelo sta alla
  // MEDIA dei peli delle celle d'acqua che lo toccano (io + 3 vicini). Gli
  // angoli condivisi coincidono per costruzione → le superfici si RACCORDANO
  // in rampe continue, niente terrazze. Colonna piena vicina → angolo a filo.
  const quotaAngolo = (sx, sz) => {
    if (mioSopra) return F;
    let somma = mioPelo, n = 1;
    for (const [dx, dz] of [[sx, 0], [0, sz], [sx, sz]]) {
      const v = vicinoAcqua(dx, dz);
      if (v !== null) {
        if (v.sopra) return F;
        somma += peloDi(v.livello); n++;
        continue;
      }
      // RACCORDO IN PENDENZA (foci nei laghi, labbri delle cascate): se di
      // fianco non c'è acqua ma UN GRADINO sotto/sopra sì, l'angolo scivola
      // verso quel pelo. I due lati mediano le STESSE quote assolute → gli
      // angoli condivisi coincidono e il muro diventa una rampa continua.
      if (!acquaA || vicinoPieno(dx, 0, dz)) continue;
      const giu = acquaA(dx, -1, dz);
      if (giu !== null && giu !== undefined) { somma += peloDi(giu) - 2 * F; n++; continue; }
      if (!vicinoPieno(dx, 1, dz)) {
        const su = acquaA(dx, 1, dz);
        if (su !== null && su !== undefined) { somma += peloDi(su) + 2 * F; n++; }
      }
    }
    return somma / n;
  };
  const hMM = quotaAngolo(-1, -1), hPM = quotaAngolo(1, -1);
  const hPP = quotaAngolo(1, 1), hMP = quotaAngolo(-1, 1);
  const angolo = (sx, sz) => (sx < 0 ? (sz < 0 ? hMM : hMP) : (sz < 0 ? hPM : hPP));

  if (!mioSopra) {
    const riva = rivaCella(solidoXZ);     // −−, +−, ++, −+: l'ordine del quad
    // FACCIA IN PENDENZA → tipo 3. Quando i quattro angoli non stanno quasi
    // sullo stesso piano questo non è un pelo piatto: è uno scivolo, e nello
    // shader prende un DISEGNO suo (le strisce lungo la corrente) — ma resta
    // pelo a tutti gli effetti, con riflesso, schiuma e onde come gli altri.
    //
    // Un commit passato aveva sistemato il bianco "delle cascate" correggendo
    // solo le facce LATERALI (tipo 2); la faccia superiore in pendenza aveva
    // tipo 1 e finiva nel ramo del pelo calmo, dove il rumore si campiona SOLO
    // in XZ. Su uno scivolo che scende quasi un blocco per cella quel rumore si
    // stira lungo la linea di massima pendenza: invece di spruzzo fine vengono
    // chiazze grandi e collegate, e il bianco non si spezza mai.
    const hMin = Math.min(hMM, hPM, hPP, hMP), hMax = Math.max(hMM, hPM, hPP, hMP);
    const inPendenza = hMax - hMin > PENDENZA_RIPIDA;
    b.extra(flusso[0], flusso[1], inPendenza ? 3 : (scorre ? 1 : 0));
    b.quad(p(-F, hMM, -F), p(F, hPM, -F), p(F, hPP, F), p(-F, hMP, F), pal.cima, [0, 1, 0], riva);
  }
  b.extra(0, 0, 5);
  if (!vicinoPieno(0, -1, 0)) b.quad(p(-F, -F, -F), p(F, -F, -F), p(F, -F, F), p(-F, -F, F), pal.fondo, [0, -1, 0]);

  for (const [dx, dz] of LATI) {
    const acquaLi = vicinoAcqua(dx, dz);             // livello dell'acqua vicina o null
    let base = -F;
    if (acquaLi !== null) {
      // acqua contro acqua: le rampe si raccordano da sole. Serve una parete
      // solo per le COLONNE PIENE (cascate), sopra il pelo del vicino.
      if (!mioSopra) continue;
      const suoPelo = acquaLi.sopra ? F : peloDi(acquaLi.livello);
      if (suoPelo >= pelo - 1e-6) continue;
      base = suoPelo;
    } else if (vicinoPieno(dx, 0, dz)) {
      continue;                                       // sigillata dal solido (18 px)
    }
    const tx = -dz, tz = dx;
    // le due quote in alto della parete = gli angoli di quel lato (rampa)
    const h1 = mioSopra ? F : angolo(dx - tx, dz - tz);
    const h2 = mioSopra ? F : angolo(dx + tx, dz + tz);
    // ⚠ LE PARETI DI CASCATA DICHIARANO LA COLONNA: (quota della cima, quota
    // della base, 2). Il fragment ne ricava altezza totale e caduta percorsa,
    // e da lì gli effetti PER FASCIA — labbro teso in cima, filamenti che si
    // stirano accelerando, schiuma alla base dai tre blocchi in su. Prima qui
    // c'erano due zeri sprecati, e la parete era cieca sulla propria altezza.
    if (cascata && colonna) b.extra(colonna[0], colonna[1], 2);
    else b.extra(0, 0, cascata ? 2 : 5);
    b.quad(
      p(dx * F - tx * F, base, dz * F - tz * F),
      p(dx * F + tx * F, base, dz * F + tz * F),
      p(dx * F + tx * F, h2, dz * F + tz * F),
      p(dx * F - tx * F, h1, dz * F - tz * F),
      pal.lato, [dx, 0, dz],
    );
    b.extra(0, 0, 5);
  }
}

// ---- smistamento per blocco ---------------------------------------------------

function costruisciBlocco(bSolidi, bAcqua, mondo, x, y, z, tipo) {
  const def = defDi(tipo);
  let pal = paletteBlocco(tipoBase(tipo), y);   // stagione + rampa d'altezza
  // MOTIVO: variazione deterministica cella per cella (la "texture" qui)
  if (def.motivo) pal = tintaPalette(pal, def.motivo, def.motivoForza ?? 1, x, y, z);
  // LA MATERIA SI CUOCE QUI, una volta per blocco e non per vertice: da questo
  // punto in giù nessuno sa più che esistono i materiali, e il pixel meno che mai.
  // È il livello a COSTO ZERO del §13: tinta e saturazione entrano nel `color`
  // per vertice che il mesher già scrive, e il programma del mondo non guadagna
  // un'istruzione. Vedi world/materie.js.
  const materia = materiaDi(def);
  if (materia) {
    pal = { ...pal,
      cima: tingiMateria(pal.cima, materia),
      lato: tingiMateria(pal.lato, materia),
      fondo: tingiMateria(pal.fondo, materia),
    };
    if (pal.facce) {
      pal.facce = pal.facce.map((c) => (c === null || c === undefined ? c : tingiMateria(c, materia)));
    }
  }
  // e l'identità va nel vertice: è quello che il pixel legge per emissione,
  // brillio e cielo (il livello per pixel di world/materie.js)
  bSolidi.materia(materia ? indiceMateria(def.materia) : 0);
  const cx = x + 0.5, cy = y + 0.5, cz = z + 0.5;
  if (def.acqua) {
    const sopraT = mondo.tipo(x, y + 1, z);
    const mioSopra = !!(sopraT && defDi(sopraT).acqua);
    const vicinoAcqua = (dx, dz) => {
      const t = mondo.tipo(x + dx, y, z + dz);
      if (!t || !defDi(t).acqua) return null;
      const s = mondo.tipo(x + dx, y + 1, z + dz);
      return { livello: livelloAcqua(t), sopra: !!(s && defDi(s).acqua) };
    };
    // CORRENTE: gradiente dei livelli (dal basso N verso l'alto N) + attrazione
    // verso i bordi liberi dove sta per cadere. Le sorgenti ferme restano calme.
    const Lc = livelloAcqua(tipo);
    let fx = 0, fz = 0;
    for (const [dx, dz] of LATI) {
      const t2 = mondo.tipo(x + dx, y, z + dz);
      if (t2 && defDi(t2).acqua) {
        const dL = livelloAcqua(t2) - Lc;
        fx += dL * dx; fz += dL * dz;
      } else if (!mondo.pieno(x + dx, y, z + dz) && !mondo.pieno(x + dx, y - 1, z + dz)) {
        fx += 1.5 * dx; fz += 1.5 * dz;              // orlo della cascata: tira di là
      }
    }
    const lung = Math.hypot(fx, fz);
    const flusso = (Lc > 0 || mioSopra) && lung > 0.01 ? [fx / lung, fz / lung] : [0, 0];

    // punti per i PARTICELLARI: correnti sul pelo e impatti delle cascate
    if (bAcqua.flussi && !mioSopra && (flusso[0] || flusso[1])) {
      bAcqua.flussi.push({ x: cx, y: cy + (7 - 2 * Lc) / 16, z: cz, fx: flusso[0], fz: flusso[1] });
    }
    if (bAcqua.impatti && mioSopra && livelloAcqua(sopraT) > 0) {
      // impatto SOLO sotto una colonna che CADE (flussi): il fondo di un lago
      // di sorgenti non è una cascata — niente bollicine sott'acqua
      const sotto = mondo.tipo(x, y - 1, z);
      const atterrata = !!sotto && (!defDi(sotto).acqua || livelloAcqua(sotto) === 0);
      if (atterrata) {
        let h = 0;
        while (h < 12) {
          const su = mondo.tipo(x, y + 1 + h, z);
          if (!su || !defDi(su).acqua) break;
          h++;
        }
        // le bollicine nascono ALLA SUPERFICIE della colonna, non sott'acqua
        const tCima = mondo.tipo(x, y + h, z);
        const Lc2 = tCima ? (livelloAcqua(tCima) || 0) : 0;
        // `ys` è tutt'altra quota: DOVE SBATTE, cioè il centro della cella che
        // ha fermato la colonna. Ci si appende l'anello di schiuma, che sta sul
        // pelo della pozza; `y` invece è la cima della colonna e serve solo alle
        // bollicine. Confonderle metteva l'anello in cima alla cascata.
        bAcqua.impatti.push({ x: cx, y: y + h + (15 - 2 * Lc2) / 16 + 0.02, z: cz, ys: cy, h });
      }
    }
    // LA COLONNA DELLA CASCATA: quanto sale e quanto scende, in quote di mondo.
    // ⚠ La CIMA sale finché c'è acqua (il pelo in cima alla colonna); la BASE
    // scende finché c'è acqua IN CADUTA — una sorgente sotto è il lago in cui
    // si tuffa, e lì la colonna finisce: contarlo dentro gonfierebbe l'altezza
    // di tutta la profondità del lago. Il tetto a 24 è un paracadute, non un
    // limite di progetto.
    let colonna = null;
    if (mioSopra) {
      let su = y, giu = y;
      while (su - y < 24) { const t2 = mondo.tipo(x, su + 1, z); if (!t2 || !defDi(t2).acqua) break; su++; }
      while (y - giu < 24) {
        const t2 = mondo.tipo(x, giu - 1, z);
        if (!t2 || !defDi(t2).acqua || livelloAcqua(t2) === 0) break;
        giu--;
      }
      colonna = [su + 1, giu];
    }
    acquaBox(bAcqua, cx, cy, cz, pal, {
      livello: Lc, mioSopra, cascata: mioSopra, flusso, vicinoAcqua, colonna,
      vicinoPieno: (dx, dy, dz) => mondo.pieno(x + dx, y + dy, z + dz),
      // "questa colonna ferma l'acqua?" con UNA lettura: stessa regola del
      // culling (acqua e forme non piene non contano). mondo.pieno() da solo
      // non basta — conta anche l'acqua, e ogni pozza sarebbe sponda di sé stessa
      solidoXZ: (dx, dz) => {
        const t = mondo.tipo(x + dx, y, z + dz);
        if (!t) return false;
        const d = defDi(t);
        return !d.acqua && !FORME_VUOTE.has(d.forma);
      },
      // livello dell'acqua in una cella qualsiasi (anche sopra/sotto), per i
      // raccordi in pendenza alle foci e sui labbri delle cascate
      acquaA: (dx, dy, dz) => {
        const t = mondo.tipo(x + dx, y + dy, z + dz);
        const L = t ? livelloAcqua(t) : null;
        return L;
      },
    });
    return;
  }
  // INTORNO 3×3×3 IN UNA VOLTA SOLA. Prima ogni vicinoSolido() rifaceva una
  // mondo.tipo() (stringa + Map) e il supercubo ne chiede una cinquantina per
  // blocco. Qui si pagano 26 lookup fissi e poi tutto è indicizzazione d'array.
  // 1 = solido che occlude; acqua e forme non piene valgono 0 (lastre, pilastri
  // e croci non riempiono la cella: se cullassero i vicini si aprirebbero buchi).
  const vicini = new Uint8Array(27);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dz = -1; dz <= 1; dz++) {
      for (let dx = -1; dx <= 1; dx++) {
        if (dx === 0 && dy === 0 && dz === 0) continue;
        const t = mondo.tipo(x + dx, y + dy, z + dz);
        if (!t) continue;
        const d = defDi(t);
        if (!d.acqua && !FORME_VUOTE.has(d.forma)) vicini[IV(dx, dy, dz)] = 1;
      }
    }
  }
  const vicinoSolido = (dx, dy, dz) => vicini[IV(dx, dy, dz)] === 1;
  // forme non-cubiche dell'Officina: non cullano (non riempiono la cella)
  const extra = def.forma && FORME_EXTRA[def.forma];
  if (extra) {
    extra(bSolidi, cx, cy, cz, pal, () => false);
    return;
  }
  if (def.cappello && !vicinoSolido(0, 1, 0)) {
    bSolidi.erba(pal.cima, y);          // marca le cime: ritinta stagionale in-place
    conCappello(bSolidi, cx, cy, cz, pal, vicinoSolido);
    bSolidi.fineErba();
  } else {
    // REGOLA SPECIALE (culling attraverso i bordi): un vicino col cappello
    // SCOPERTO è alto 16 px, non 18 — non copre la fascia +8..+9 del supercubo.
    // In orizzontale culla solo un vicino "a tutta altezza".
    const vicinoTuttaAltezza = (dx, dy, dz) => {
      if (!vicinoSolido(dx, dy, dz)) return false;
      if (dy !== 0) return true;
      const t = mondo.tipo(x + dx, y, z + dz);
      return !defDi(t).cappello || vicinoSolido(dx, 1, dz);
    };
    supercubo(bSolidi, cx, cy, cz, pal, vicinoTuttaAltezza, materia ? materia.orlo : 0);
  }
}


// ---- LA PELLE: il chunk lontano ----------------------------------------------
//
// ⚠ OLTRE UNA CERTA DISTANZA IL SUPERCUBO È SPRECO PURO: a ottanta blocchi uno
// smusso da un sedicesimo è meno di un pixel, e un cappello d'erba sono cento
// triangoli che l'occhio non distingue da un quadrato. Ma senza quei chunk
// l'orizzonte è vuoto, e la distanza di resa resta inchiodata a quanto il
// dettaglio pieno si può permettere. La pelle è la terza via: per ogni COLONNA
// un quadrato di cima (il blocco più alto) e le pareti verso le colonne più
// basse, nei colori della palette — la stessa silhouette a terrazze, senza i
// pezzi che da lontano non si vedono. Da due a dieci triangoli per colonna,
// contro le centinaia del dettaglio pieno.
//
// ⚠ QUELLO CHE LA PELLE NON SA: grotte, sporgenze, blocchi sospesi. Vede solo il
// blocco più alto di ogni colonna. È il limite dichiarato di un LOD da
// orizzonte, e sta oltre `raggioPieno`, cioè dove il dettaglio pieno non arriva
// comunque — la nebbia comincia prima.
//
// ⚠ L'ACQUA RESTA PIENA anche nella pelle: il suo pelo è già una superficie
// sola, e lo shader dell'acqua vuole i suoi canali (corrente, riva) che solo
// `acquaBox` sa scrivere. Il costo dell'acqua non è la geometria.
//
// ⚠ E LA PELLE È GEOMETRIA DEL MESHER COME LE ALTRE: stessi colori di palette,
// stessa marcatura dell'erba (`b.erba`), quindi la ritinta stagionale la trova
// come trova i cappelli e il confine fra pieno e pelle non cambia tinta —
// cambia solo il numero di triangoli.
const PELLE_PARETE_MAX = 32;   // quanto in giù si cerca la colonna vicina prima di dichiararla un dirupo

function costruisciPelle(bSolidi, bAcqua, mondo, kc) {
  const v = kc.indexOf(',');
  const cx0 = +kc.slice(0, v) * CHUNK, cz0 = +kc.slice(v + 1) * CHUNK;
  // la cima di ogni colonna del chunk in UNA passata sui blocchi (16×16 voci)
  const cime = new Int16Array(CHUNK * CHUNK).fill(-32768);
  const tipi = new Array(CHUNK * CHUNK).fill(null);
  for (const { x, y, z, tipo } of mondo.blocchiDelChunk(kc)) {
    const d = defDi(tipo);
    if (d.acqua) { costruisciBlocco(bSolidi, bAcqua, mondo, x, y, z, tipo); continue; }
    if (FORME_VUOTE.has(d.forma)) continue;
    const i = (x - cx0) * CHUNK + (z - cz0);
    if (y > cime[i]) { cime[i] = y; tipi[i] = tipo; }
  }
  // «fin dove arriva la colonna qui accanto?»: dentro il chunk si legge la
  // tabella, fuori si scende con mondo.tipo() dal mio livello — al massimo
  // PELLE_PARETE_MAX letture, di solito una o due.
  const solidoIn = (x, y, z) => {
    const t = mondo.tipo(x, y, z);
    if (!t) return false;
    const d = defDi(t);
    return !d.acqua && !FORME_VUOTE.has(d.forma);
  };
  const cimaVicina = (x, z, yDa) => {
    const lx = x - cx0, lz = z - cz0;
    if (lx >= 0 && lx < CHUNK && lz >= 0 && lz < CHUNK) return cime[lx * CHUNK + lz];
    for (let y = yDa; y > yDa - PELLE_PARETE_MAX; y--) if (solidoIn(x, y, z)) return y;
    return yDa - PELLE_PARETE_MAX;
  };
  for (let lx = 0; lx < CHUNK; lx++) {
    for (let lz = 0; lz < CHUNK; lz++) {
      const i = lx * CHUNK + lz, y = cime[i];
      if (y === -32768) continue;
      const x = cx0 + lx, z = cz0 + lz, tipo = tipi[i];
      const def = defDi(tipo);
      let pal = paletteBlocco(tipoBase(tipo), y);
      if (def.motivo) pal = tintaPalette(pal, def.motivo, def.motivoForza ?? 1, x, y, z);
      const materia = materiaDi(def);
      if (materia) {
        pal = { ...pal, cima: tingiMateria(pal.cima, materia), lato: tingiMateria(pal.lato, materia), fondo: tingiMateria(pal.fondo, materia) };
      }
      bSolidi.materia(materia ? indiceMateria(def.materia) : 0);
      // la cima: un quadrato a filo cella. Per l'erba è la cima del cappello,
      // marcata come tale così la stagione la ridipinge in-place
      if (def.cappello) bSolidi.erba(pal.cima, y);
      bSolidi.quad([x, y + 1, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x, y + 1, z + 1], coloreFaccia(pal, 1, 1), [0, 1, 0]);
      if (def.cappello) bSolidi.fineErba();
      // le pareti: solo verso le colonne più basse, alte quanto il dislivello.
      // ⚠ COL COLORE DEL LATO DEL BLOCCO DI CIMA per tutta la parete: la colonna
      // sotto è quasi sempre terra dello stesso marrone, e da lontano una
      // striscia di due toni non si distingue da una di uno.
      for (const [dx, dz] of LATI) {
        const yV = cimaVicina(x + dx, z + dz, y);
        if (yV >= y) continue;
        const base = Math.max(yV + 1, y + 1 - PELLE_PARETE_MAX);
        const colore = coloreFaccia(pal, dx !== 0 ? 0 : 2, dx !== 0 ? dx : dz);
        const px = x + (dx > 0 ? 1 : 0), pz = z + (dz > 0 ? 1 : 0);
        if (dx !== 0) {
          bSolidi.quad([px, base, z], [px, y + 1, z], [px, y + 1, z + 1], [px, base, z + 1], colore, [dx, 0, 0]);
        } else {
          bSolidi.quad([x, base, pz], [x, y + 1, pz], [x + 1, y + 1, pz], [x + 1, base, pz], colore, [0, 0, dz]);
        }
      }
    }
  }
}

/**
 * IL LIVELLO DI DETTAGLIO CHE UN CHUNK MERITA da dove si guarda: 0 pieno,
 * 1 pelle, null «non costruirlo». Le distanze sono dal punto del chunk più
 * vicino all'osservatore (in pianta), così un chunk che si sta per attraversare
 * è già pieno prima che ci si metta piede.
 *
 * ⚠ CON ISTERESI: chi è già costruito a un livello lo tiene finché non supera
 * il confine di un chunk intero. Senza, camminando lungo il bordo di un cerchio
 * i chunk sul confine si rifarebbero a ogni passo, avanti e indietro.
 */
function livelloPer(kc, bx, bz, raggi, costruito) {
  const v = kc.indexOf(',');
  const x0 = +kc.slice(0, v) * CHUNK, z0 = +kc.slice(v + 1) * CHUNK;
  const dx = Math.max(x0 - bx, 0, bx - (x0 + CHUNK));
  const dz = Math.max(z0 - bz, 0, bz - (z0 + CHUNK));
  const d = Math.sqrt(dx * dx + dz * dz);
  const isteresi = costruito === undefined ? 0 : CHUNK;
  if (d <= raggi.pieno + (costruito === 0 ? isteresi : 0)) return 0;
  if (d <= raggi.resa + (costruito !== undefined ? isteresi : 0)) return 1;
  return null;
}

/**
 * I DATI DI UN CHUNK, e basta: niente mesh, niente fabbrica, niente stato del
 * mesher. È la funzione che gira in linea E nel Worker (vedi mesher-worker.js),
 * e il fatto che sia una funzione pura è quello che rende le due strade
 * intercambiabili — la prova `mesher-foto.test.mjs` pretende che diano gli
 * stessi identici triangoli.
 *
 * @param mondo    il mondo vero, o una sua fotografia (mesher-foto.js)
 * @param livello  0 pieno · 1 pelle
 * @param soloAcqua rifà solo il liquido (la simulazione dell'acqua sporca chunk di continuo)
 */
export function costruisciChunkDati(mondo, kc, livello = 0, soloAcqua = false) {
  const acqua = costruttoreAcqua();
  if (soloAcqua) {
    const scarto = new Costruttore();
    for (const { x, y, z, tipo } of mondo.blocchiDelChunk(kc)) {
      if (!defDi(tipo).acqua) continue;
      costruisciBlocco(scarto, acqua, mondo, x, y, z, tipo);
    }
    return { soloAcqua: true, acqua: acqua.dati(), flussi: acqua.flussi, impatti: acqua.impatti };
  }
  const solidi = new Costruttore();
  if (livello === 1) {
    costruisciPelle(solidi, acqua, mondo, kc);
  } else {
    for (const { x, y, z, tipo } of mondo.blocchiDelChunk(kc)) {
      costruisciBlocco(solidi, acqua, mondo, x, y, z, tipo);
    }
  }
  return {
    soloAcqua: false, vuoto: solidi.vuoto && acqua.vuoto,
    solidi: solidi.dati(), erbe: solidi.erbe,
    acqua: acqua.dati(), flussi: acqua.flussi, impatti: acqua.impatti,
  };
}

/**
 * QUANTI CHUNK SI SPEDISCONO AL WORKER PER FOTOGRAMMA, e quanti risultati si
 * caricano in GPU. Spedire costa la fotografia (nove chunk scorsi, ~1 ms);
 * caricare costa la VertexData e le normali (~1 ms a chunk pieno). Sono i due
 * pezzi che restano sul filo principale, e vanno a bilancio come tutto il resto.
 */
const SPEDIZIONI_PER_GIRO = 4;
const APPLICAZIONI_PER_GIRO = 3;

// ---- mesher a chunk ------------------------------------------------------------

// PARACADUTE: oltre questa taglia la griglia di luce non si calcola proprio.
// Meglio nessuna maschera (il mondo torna esattamente com'era) che mezzo
// secondo di blocco all'apertura di un mondo enorme.
//
// DA DOVE VIENE IL NUMERO. Il ricalcolo pieno costa ~75 µs ogni mille celle
// (misurato in gioco: 19,7 ms su una griglia di 265k celle, open world r48).
// 2 milioni di celle sono quindi ~150 ms, il massimo che abbia senso far
// aspettare in un colpo solo. Era 6e6, cioè mezzo secondo abbondante — e per
// giunta IRRAGGIUNGIBILE: il raggio più grande che il menu debug sappia
// generare è 96, che fa una scatola di ~197×30×197 = 1,16M celle, cinque volte
// sotto la soglia. Un paracadute che non si apre mai è codice morto; questo
// invece resta una rete vera per i mondi importati o costruiti in verticale.
const LUCE_LIMITE_CELLE = 2e6;
// Oltre questi cambi in un colpo solo la rilluminazione locale non conviene più
// (generazione del mondo, import, incolla di una struttura): meglio una griglia
// nuova. NON è più una soglia sulla TAGLIA DEL MONDO: quella era una rupe
// invisibile — misurava le celle di un AABB denso, quindi sull'arcipelago
// scattava per un blocco posato più in alto, e da lì in poi la maschera
// smetteva di aggiornarsi senza dare alcun segnale.
//
// PERCHÉ 96. È il punto in cui le due strade costano uguale sul mondo di prova.
// Una cella cambiata costa una ri-illuminazione della zona che tocca (una
// traversata per lampada e per cella dentro il raggio); il ricalcolo pieno costa quanto il mondo e non dipende da quante
// celle sono cambiate. Sull'open world r48 il pieno sta fra 20 e 90 ms, e la
// via locale ci arriva attorno al centinaio di celle. Sotto conviene sempre il
// locale, sopra il pieno: il numero è la frontiera, non una preferenza. È anche
// abbastanza alto da coprire i casi normali (una casetta, una zolla di terreno,
// i lampioni che si accendono al tramonto) senza mai svegliare il ricalcolo.
const CAMBI_MAX_LOCALI = 96;

export class Mesher {
  constructor(scena) {
    this.scena = scena;
    this.chunks = new Map();       // "cx,cz" → { solidi: Mesh, acqua: Mesh }
    // occTroppoGrande: il paracadute LUCE_LIMITE_CELLE è scattato. Serve un
    // campo suo perché prima quel caso lasciava occCelle = 0 e il pannello
    // stampava "occlusione spenta" — la STESSA identica riga di "l'utente ha
    // spento l'interruttore" e di "mondo vuoto". Tre stati diversi sotto
    // un'etichetta sola: se il paracadute si aprisse davvero, nessuno saprebbe
    // distinguerlo da una preferenza.
    this.statistiche = { ultimaMs: 0, chunkAttivi: 0, occMs: 0, occCelle: 0, occLocali: 0, occTroppoGrande: 0, voxTroppoLarga: 0, inCoda: 0 };
    this._codaPiena = new Set();   // chunk in attesa di rebuild INTERO (vedi aggiorna)
    this._codaAcqua = new Set();   // chunk in attesa del solo rebuild dell'acqua
    /**
     * I RAGGI DI RESA, in blocchi: { resa, pieno }. Dentro `pieno` il chunk è a
     * dettaglio pieno; fra `pieno` e `resa` è una PELLE (vedi costruisciPelle);
     * oltre `resa` non ha mesh e, se ce l'aveva, la perde. `null` = tutto pieno
     * sempre, com'era prima: è quello che vedono le prove e lo zoo.
     *
     * ⚠ È QUESTO CHE SLEGA LA DISTANZA DI RESA DAL COSTO: alzare `resa` aggiunge
     * pelli, che costano una frazione; e un mondo più grande della distanza di
     * resa non tiene in vita mesh che nessuno vede (misurato sul mondo r160:
     * 928 mesh in scena per 120 attive, e 21,6 ms di fotogramma). Li imposta la
     * fabbrica dal profilo (`_f.raggi`), o chi vuole con `impostaRaggi`.
     */
    this.raggi = null;
    this._livelli = new Map();     // kc → 0 | 1: com'è costruito ADESSO
    /**
     * IL WORKER: `undefined` = mai provato, `null` = non c'è (Node, browser
     * senza Worker a moduli, o è morto) e si costruisce in linea come sempre.
     *
     * ⚠ È STATELESS APPOSTA. Prima idea: una copia del mondo nel Worker tenuta
     * in pari dagli eventi. Ma la simulazione dell'acqua scrive «silenziosa»
     * (nessun evento, per non svegliare il netcode a ogni cella) e la copia
     * sarebbe divergita al primo ruscello, senza un errore. Quindi ogni lavoro
     * porta con sé la FOTOGRAFIA della zona che gli serve (mesher-foto.js): un
     * Uint16Array di 24×H×24 celle, e il Worker non ricorda niente fra un
     * chunk e l'altro. Costa una copia da 30–60 KB a chunk, e in cambio non
     * può mai essere sbagliato.
     */
    this.lavoro = undefined;
    this._inVolo = new Map();      // kc → livello: spediti al Worker, non ancora tornati
    this._pronti = [];             // risultati tornati, da caricare in GPU a bilancio
    this._chunkOsservatore = null; // "cx,cz" di chi guarda all'ultimo riesame
    this._bersaglio = null;        // {x, z} dell'ultimo riesame
    this.luce = null;              // GrigliaLuce (i muri), rifatta prima dei chunk
    this.occlusioneAttiva = true;  // interruttore delle Impostazioni
    this._velato = false;          // il mondo sta usando il materiale dell'occhio di bue?
    // QUI STAVA MEZZO SISTEMA, e vale la pena dire cosa se n'è andato con le
    // mappe d'ombra cotte: l'atlante delle piastrelle, la mappa cella→piastrella,
    // il contatore delle lampade rimaste senza, l'elenco delle sorgenti che NON
    // sono blocchi (i lampioni dei furni) e le celle-luce sporche da ricuocere.
    // Servivano tutti a una cosa sola — sapere QUALE lampada aveva una mappa da
    // rifare — e col cammino per-frammento non c'è più niente di cotto: l'ombra
    // esce dalla griglia dei muri, che è una sola per tutte le lampade del mondo.
    // Accendere un lampione adesso non tocca proprio nulla di qui dentro.
  }

  /**
   * Ricalcola la GRIGLIA DEI MURI sull'estensione occupata dal mondo, e la
   * carica in GPU. Si fa QUI, una volta per ricostruzione: dice solo DOVE stanno
   * i solidi e NON dipende dall'ora — il giorno e la notte li fa uAmbiente, un
   * colore che lo shader moltiplica per tutto, quindi cambiare ora non tocca
   * niente e infatti il ciclo non rimesha mai.
   */
  _ricalcolaLuce(mondo) {
    const t0 = performance.now();
    const vecchia = this.luce;
    this.luce = null;
    this.statistiche.occCelle = 0;
    this.statistiche.occMs = 0;
    this.statistiche.occLocali = 0;
    this.statistiche.occTroppoGrande = 0;
    this.statistiche.voxTroppoLarga = 0;
    mondo.scordaCambi();
    if (!this.occlusioneAttiva) { this._spegniOmbre(); return; }

    // UNA SOLA PASSATA SUL MONDO. La scatola serve prima di poter allocare la
    // griglia, quindi le celle solide si mettono da parte qui appiattite: la
    // seconda passata, da sola, costava 39 ms su 73k blocchi. E si usa perOgni()
    // invece di tutti(), che per ogni blocco ricompone le coordinate con
    // split+map e alloca un oggetto: altri 34 ms buttati (misurato in gioco).
    let minX = Infinity, minY = Infinity, minZ = Infinity;
    let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    const solidi = [];
    // blocchi che fermano le lampade ma NON il sole (Officina: «solo alle
    // lampade»). Elenco a parte perche' sono rari: cosi' il ciclo caldo resta
    // quello di prima e questi si applicano dopo, in una passata sua.
    const senzaSole = [];
    mondo.perOgni((x, y, z, tipo) => {
      if (x < minX) minX = x; if (x > maxX) maxX = x;
      if (y < minY) minY = y; if (y > maxY) maxY = y;
      if (z < minZ) minZ = z; if (z > maxZ) maxZ = z;
      const d = defDi(tipo);
      // Stessa regola del culling: acqua e forme non piene NON fermano la luce
      // (una pianta o una lastra non fanno ombra). `vetro` (Officina) esce di
      // qui per la stessa porta: non ferma niente, quindi non entra in griglia.
      if (!d.acqua && !d.vetro && !FORME_VUOTE.has(d.forma)) {
        solidi.push(x, y, z);
        if (d.ombraSole === false) senzaSole.push(x, y, z);
      }
      // LE LAMPADE NON SI RACCOLGONO PIÙ, ed è la semplificazione più grossa di
      // tutta la riscrittura: la griglia serve a dire dove sono i MURI, e i muri
      // non sanno niente di chi li illumina. Prima qui si metteva da parte ogni
      // sorgente pesante per poterle cuocere una mappa a testa.
    });
    if (!isFinite(minX)) { this._spegniOmbre(); return; }   // mondo vuoto

    // GLI INGOMBRI DEI FURNI ALLARGANO LA SCATOLA, e non è pignoleria: la chioma
    // di un albero piantato sul blocco più alto del mondo sta SOPRA il mondo, e
    // fuori dalla scatola marcaOmbra() scarta in silenzio — cioè l'albero più
    // visibile del diorama sarebbe l'unico senza ombra.
    for (const c of mondo.ombreFurni.values()) {
      if (c.x < minX) minX = c.x; if (c.x > maxX) maxX = c.x;
      if (c.y < minY) minY = c.y; if (c.y > maxY) maxY = c.y;
      if (c.z < minZ) minZ = c.z; if (c.z > maxZ) maxZ = c.z;
    }

    const scatola = scatolaPerMondo(minX, minY, minZ, maxX, maxY, maxZ);
    const celle = scatola.larghezza * scatola.altezza * scatola.profondita;
    // il pannello deve poter dire "troppo grande", non "spenta": vedi statistiche
    if (celle > LUCE_LIMITE_CELLE) {
      this.statistiche.occTroppoGrande = celle;
      this._spegniOmbre();
      return;
    }
    // RIUSO: se la scatola non e' cambiata (il caso normale, perche' il ricalcolo
    // pieno capita quasi solo al caricamento e all'import) si ricicla l'array
    // dei solidi invece di riallocarlo e darlo in pasto al GC
    const g = (vecchia && vecchia.stessaScatola(scatola))
      ? (vecchia.azzera(), vecchia) : new GrigliaLuce(scatola);

    // SOLIDITA' PRECALCOLATA, la lezione costata cara: passare `mondo.pieno` come
    // test costava 423 ms su 195k celle contro 56, perche' compone una stringa
    // "x,y,z" e cerca in una Map, e la cottura lo chiede a OGNI PASSO di OGNI
    // raggiata, cioe' il ciclo piu' caldo del gioco. Qui e' un Uint8Array riempito
    // una volta, e la traversata legge un indice che si porta dietro (vedi
    // distanzaSolido in luce.js).
    for (let i = 0; i < solidi.length; i += 3) g.marcaSolido(solidi[i], solidi[i + 1], solidi[i + 2]);
    // QUI C'ERA LA REGOLA DELLA «BUCCIA»: un blocco con aria sopra e solido
    // sotto non proiettava il sole, per togliere le linguette d'ombra dei
    // gradini da un blocco. TOLTA DOPO UN GIRO SOLO, e la lezione merita di
    // restare scritta: curava un difetto vero ma ne apriva uno peggiore, cioe'
    // che QUELLO CHE COSTRUISCE IL GIOCATORE smetteva di fare ombra. Una colonna
    // da due blocchi e' fatta di un blocco «interno» e uno di buccia: con quella
    // regola proiettava mezza cella, cioe' niente. Chi posa un cubo e non vede
    // l'ombra non pensa «bella scelta stilistica», pensa che sia rotto — e aveva
    // ragione. La regola resta disponibile per chi la CHIEDE (Officina, «solo
    // alle lampade»), che e' un'altra cosa: li' e' una decisione dell'autore.
    // Il seghettato delle terrazze si cura dove nasce davvero: sulla FORZA del
    // chiaroscuro (vedi uSoleTermForza in fx/materials.js).
    //
    // chi l'ha dichiarato nell'Officina non proietta il sole, comunque sia messo
    for (let i = 0; i < senzaSole.length; i += 3) g.marcaSolido(senzaSole[i], senzaSole[i + 1], senzaSole[i + 2], true);
    // DOPO i blocchi: marcaOmbra non declassa un muro, quindi l'ordine conta
    for (const c of mondo.ombreFurni.values()) g.marcaOmbra(c.x, c.y, c.z, c.op > 0);
    // LA GPU HA UN TETTO SUL LATO di una texture 3D (il minimo garantito da
    // WebGL2 e' 256; le schede vere danno 2048). E' l'unico limite rimasto di
    // tutto il sistema, e a differenza del tetto di 48 lampade non lo si
    // incontra costruendo: ci vorrebbe un mondo lungo piu' di 2000 celle su un
    // asse. Se succede, niente ombre e il pannello lo DICE.
    if (!this._collegaVoxel(g, scatola)) { this._spegniOmbre(); return; }
    this.luce = g;
    this.statistiche.occCelle = celle;
    this.statistiche.occMs = performance.now() - t0;
  }

  /** Carica la griglia in GPU. False se la scheda non regge un lato cosi' lungo. */
  _collegaVoxel(g, scatola) {
    const lato = latoMassimoVoxel();
    const piu = Math.max(scatola.larghezza, scatola.altezza, scatola.profondita);
    if (piu > lato) { this.statistiche.voxTroppoLarga = piu; return false; }
    impostaVoxel(g.solidi, scatola, g.cimaY);
    return true;
  }

  /** Niente griglia = niente ombre: le sfere attraversano i muri esattamente
   *  come prima che l'occlusione esistesse. E' il ripiego ONESTO, non un caso da
   *  nascondere: succede col mondo vuoto, con l'interruttore delle Impostazioni
   *  spento, quando si apre il paracadute delle celle e nell'Officina. */
  _spegniOmbre() {
    spegniVoxel();
  }

  /**
   * Ricalcolo pieno CHIAMATO DAL VIVO, cioe' mentre si gioca.
   *
   * QUI PRIMA C'ERA MOLTO DI PIU', e vale la pena dire cosa se n'e' andato: la
   * maschera d'occlusione era cotta nei VERTICI, quindi rifarla voleva dire
   * anche capire QUALI CHUNK rimeshare (si teneva una copia dell'array `visto` e
   * la si confrontava colonna per colonna, per non sporcare l'intero open world
   * a ogni blocco posato). Con le mappe d'ombra la geometria non porta piu'
   * niente di luminoso: cambiare le ombre non tocca un solo vertice, e questa
   * funzione e' tornata a essere quello che dice il nome.
   */
  _ricalcolaLuceDalVivo(mondo) {
    this._ricalcolaLuce(mondo);
  }

  /** I guasti che degraderebbero in silenzio: il pannello debug li stampa.
   *  - occTroppoGrande   il paracadute delle celle si e' aperto: niente ombre
   *  - voxTroppoLarga    un lato del mondo supera il massimo della GPU per una
   *                      texture 3D: niente ombre (serve un mondo lungo migliaia
   *                      di celle su un asse, quindi non lo si incontra giocando)
   *
   *  DICONO COM'E' ADESSO, non quante volte e' successo dall'avvio: un contatore
   *  che sa solo crescere fa stampare al pannello un guasto gia' riparato per
   *  tutta la sessione, ed e' esattamente com'era prima.
   *
   *  QUI C'ERA ANCHE tasselliEsauriti — le lampade pesanti rimaste senza
   *  piastrella quando l'atlante da 48 finiva. Non c'e' piu' perche' non c'e'
   *  piu' niente da esaurire: la griglia dei muri e' una sola e risponde a
   *  qualunque numero di lampade.
   */
  guasti() {
    return {
      occTroppoGrande: this.statistiche.occTroppoGrande,
      voxTroppoLarga: this.statistiche.voxTroppoLarga,
    };
  }

  // (qui vivevano sporcaLuce() e verificaLuciFurni(). Servivano a dire al mesher
  // che una LAMPADA era cambiata — accesa, spenta, posata, tolta — perche' la sua
  // mappa d'ombra andava ricotta, e verificaLuciFurni ricostruiva l'elenco dei
  // lampioni d'arredo a ogni giro solo per scoprire CHI era cambiato.
  // Col cammino per-frammento l'ombra non dipende da nessun dato per-lampada:
  // accendere un lampione cambia la sua sfera e nient'altro, e la sfera la scrive
  // gia' aggiornaLuci una volta per frame. Sono spariti con loro la bandierina
  // _luciFurniDaVerificare in main.js e il ponte mesher.sorgentiExtra.)

  _entry(kc) {
    let e = this.chunks.get(kc);
    if (!e) {
      e = _f.creaChunk(kc);
      this.chunks.set(kc, e);
    }
    return e;
  }

  _rimuovi(kc) {
    const e = this.chunks.get(kc);
    if (e) {
      _f.rimuoviChunk(e);
      this.chunks.delete(kc);
    }
    this._livelli.delete(kc);
    this._cieloChunk(kc, null);
  }

  /** Heightmap del cielo per le ombre delle nuvole: quota superficie per colonna. */
  _cieloChunk(kc, mondo) {
    const [cx, cz] = kc.split(',').map(Number);
    const quote = new Map();       // "locale" ix,iz → quota
    const colonne = [];
    if (mondo) {
      for (const { x, y, z, tipo } of mondo.blocchiDelChunk(kc)) {
        // ⚠ QUANTO OCCLUDE DAVVERO, non «un blocco intero e amen». La quota qui
        // dentro È l'ombra portata dal terreno, e finché tutto valeva y+1 un
        // FIORE proiettava l'ombra di un cubo pieno: il committente l'ha visto
        // come «i blocchi con mesh diversa fanno ombre sbagliate», ed era
        // esatto. La forma la conosce già il def, basta chiedergliela.
        //   · croce  = due quad incrociati (piante, fiori): non occlude niente,
        //              e mettergli un cubo d'ombra è il difetto in questione;
        //   · lastra = mezza cella: occlude mezzo blocco;
        //   · acqua  = trasparente, la luce ci passa;
        //   · pilastro resta pieno: è sottile ma alto, e a un texel per blocco
        //     la larghezza non è esprimibile — meglio l'ombra che il buco.
        const d = defDi(tipo);
        if (!d || d.acqua || d.forma === 'croce') continue;
        const alt = y + (d.forma === 'lastra' ? 0.5 : 1);
        const k = (x - cx * CHUNK) * CHUNK + (z - cz * CHUNK);
        const q = quote.get(k);
        if (q === undefined || alt > q) quote.set(k, alt);
      }
    }
    for (let ix = 0; ix < CHUNK; ix++) {
      for (let iz = 0; iz < CHUNK; iz++) {
        const q = quote.get(ix * CHUNK + iz);
        colonne.push([[cx * CHUNK + ix, cz * CHUNK + iz], q === undefined ? -1000 : q]);
      }
    }
    aggiornaCielo(colonne);
  }

  /**
   * IL MONDO OPACO O VELATO, deciso una volta per frame. L'occhio di bue ha
   * bisogno di un materiale trasparente, ma tenerlo trasparente SEMPRE costa
   * l'early-z su tutti i chunk — e questo gioco è fill-rate bound: vuol dire
   * ridisegnare più volte gli stessi pixel per niente. Qui si scambia il
   * riferimento (una scrittura, non una ricompilazione) solo quando il velo si
   * apre o si chiude davvero.
   */
  aggiornaMaterialeMondo() {
    const velato = mondoVelato();
    if (velato === this._velato) return;
    this._velato = velato;
    const m = materialeMondo();
    for (const e of this.chunks.values()) _f.cambiaMateriale(e.solidi, m);
  }

  _chunk(mondo, kc, soloAcqua = false) {
    // REBUILD SOLO-ACQUA: la simulazione tocca solo celle d'acqua, ricostruire
    // anche tutti i solidi del chunk (i cappelli d'erba pesano 100+ tri l'uno)
    // faceva crollare gli fps durante l'espansione. Qui si rifà solo il liquido.
    if (soloAcqua && !this.chunks.get(kc)) return;
    // il livello che merita da dove si guarda: null = non lo si costruisce
    const livello = this._livelloDi(kc);
    if (livello === null) { this._rimuovi(kc); return; }
    this._applica(mondo, kc, livello, costruisciChunkDati(mondo, kc, livello, soloAcqua));
  }

  /** Carica in GPU quello che `costruisciChunkDati` ha prodotto, in linea o nel Worker. */
  _applica(mondo, kc, livello, r) {
    if (r.soloAcqua) {
      const e0 = this.chunks.get(kc);
      if (!e0) return;
      _f.scrivi(e0.acqua, r.acqua);
      e0.flussi = r.flussi;
      e0.impatti = r.impatti;
      return;
    }
    this._cieloChunk(kc, mondo);
    if (r.vuoto) { this._rimuovi(kc); return; }
    const e = this._entry(kc);
    _f.scrivi(e.solidi, r.solidi);
    e.erbe = r.erbe;
    _f.scrivi(e.acqua, r.acqua);
    e.flussi = r.flussi;
    e.impatti = r.impatti;
    this._livelli.set(kc, livello);
  }

  /**
   * Il Worker, la prima volta che serve. `null` se non si può: si costruisce in
   * linea, che è quello che fanno le prove in Node e i browser vecchi.
   * ⚠ A MODULI, e senza import map: il Worker importa solo `world/`, che non
   * nomina il motore e non ha specificatori nudi — è la regola della casa che
   * paga qui. Se il Worker muore, i lavori in volo tornano in coda e da lì in
   * poi si va in linea: un chunk in ritardo si vede, un chunk perso no.
   */
  _avviaLavoro() {
    if (this.lavoro !== undefined) return this.lavoro;
    this.lavoro = null;
    if (typeof Worker !== 'function') return null;
    try {
      const w = new Worker(new URL('./mesher-worker.js', import.meta.url), { type: 'module' });
      w.onmessage = (ev) => { this._pronti.push(ev.data); };
      w.onerror = (ev) => {
        console.warn('mesher: il Worker si è fermato, si costruisce in linea —', ev && ev.message);
        for (const kc of this._inVolo.keys()) this._codaPiena.add(kc);
        this._inVolo.clear();
        try { w.terminate(); } catch {}
        this.lavoro = null;
      };
      this.lavoro = w;
    } catch (e) {
      console.warn('mesher: niente Worker —', e && e.message);
      this.lavoro = null;
    }
    return this.lavoro;
  }

  /** Il livello voluto per questo chunk adesso (0 pieno · 1 pelle · null niente). */
  _livelloDi(kc) {
    if (!this.raggi || !this._bersaglio) return 0;
    return livelloPer(kc, this._bersaglio.x, this._bersaglio.z, this.raggi, this._livelli.get(kc));
  }

  /**
   * Cambia i raggi di resa. Il riesame dei chunk avviene al prossimo `aggiorna`
   * (si azzera la memoria di «dove stavo»), e da lì i chunk che cambiano
   * livello entrano in coda come sporchi: niente si rifà in un colpo solo.
   */
  impostaRaggi(raggi) {
    this.raggi = raggi && Number.isFinite(raggi.resa) ? { resa: raggi.resa, pieno: Math.min(raggi.pieno ?? raggi.resa, raggi.resa) } : null;
    this._chunkOsservatore = null;
  }

  /**
   * IL RIESAME: chi guarda ha cambiato chunk (o sono cambiati i raggi), quindi
   * si ripassano tutti i chunk del mondo e si decide chi sale, chi scende e chi
   * esce. Una passata sulle chiavi ogni sedici blocchi di cammino: sul mondo
   * r400 (2.601 chunk) è mezzo millisecondo, e non succede a ogni fotogramma.
   *
   * ⚠ CHI ESCE, ESCE SUBITO: buttare una mesh è gratis, e tenerla un frame in
   * più non serve a nessuno. Chi cambia livello va in coda: costruire costa, e
   * la coda è già a bilancio e ordinata per distanza.
   */
  _riesamina(mondo, b) {
    this._bersaglio = { x: b.x, z: b.z };
    for (const kc of mondo.chunks.keys()) {
      const costruito = this._livelli.get(kc);
      const voluto = livelloPer(kc, b.x, b.z, this.raggi, costruito);
      if (voluto === null) {
        if (costruito !== undefined) this._rimuovi(kc);
        this._codaPiena.delete(kc); this._codaAcqua.delete(kc);
      } else if (voluto !== costruito) {
        this._codaPiena.add(kc); this._codaAcqua.delete(kc);
      }
    }
  }

  /** Cambio stagione SMOOTH: riscrive in-place i colori delle cime d'erba
   *  (indici marcati dal Costruttore) — niente remesh, solo float nel buffer.
   *  `colorePer(quotaCella)` → {r,g,b} in [0..1]. */
  ritintaErba(colorePer) {
    for (const e of this.chunks.values()) {
      if (!e.erbe || e.erbe.length === 0) continue;
      const arr = _f.colori(e.solidi);
      if (!arr) continue;
      // stride 2 (indice del primo vertice, quota) e NIENTE fattori: il colore
      // di stagione va nel buffer tale e quale, esattamente come lo scrive
      // tri(). Portava anche tre moltiplicatori per triangolo — ombra per
      // faccia × AO — e senza di loro qui l'erba sarebbe tornata piatta al
      // primo cambio di stagione; adesso quei moltiplicatori non esistono più
      // e riapplicarli scurirebbe le sole cime d'erba, che sono le uniche a
      // passare da qui.
      for (let i = 0; i < e.erbe.length; i += 2) {
        const vi = e.erbe[i], c = colorePer(e.erbe[i + 1]);
        for (let v = 0; v < 3; v++) {
          const o = (vi + v) * 3;
          arr[o] = c.r; arr[o + 1] = c.g; arr[o + 2] = c.b;
        }
      }
      _f.coloriCambiati(e.solidi);
    }
  }

  /**
   * I PUNTI DOVE L'ACQUA FA QUALCOSA: impatti delle cascate e correnti sul pelo.
   *
   * ⚠ IL MESHER LI CALCOLAVA GIÀ E LI BUTTAVA VIA — due array per chunk, riempiti
   * a ogni ricostruzione e mai letti da nessuno, esattamente com'era per
   * `dati.acq` prima che l'acqua imparasse a usarli. Non è un dato nuovo: è un
   * dato che era lì. Questo getter è tutto quello che mancava.
   *
   * ⚠ E SI ENUMERA DAI CHUNK, non si tiene un elenco a parte: un elenco andrebbe
   * tenuto in pari con le ricostruzioni parziali (una cascata che si prosciuga
   * lascerebbe il suo impatto acceso per sempre), mentre le voci dei chunk
   * muoiono insieme al chunk che le ha prodotte.
   */
  puntiAcqua() {
    const impatti = [], flussi = [];
    for (const e of this.chunks.values()) {
      if (e.impatti) impatti.push(...e.impatti);
      if (e.flussi) flussi.push(...e.flussi);
    }
    return { impatti, flussi };
  }

  /** Ricostruzione totale (avvio, import, reset): via gli orfani, su tutto il resto. */
  /**
   * @param attorno  {x,z} — se c'è, si costruiscono SUBITO solo i chunk vicini
   *                 e gli altri finiscono in coda (vedi `aggiorna`).
   */
  ricostruisciTutto(mondo, attorno = null) {
    const t0 = performance.now();
    this._ricalcolaLuce(mondo);
    for (const kc of [...this.chunks.keys()]) {
      if (!mondo.chunks.has(kc)) this._rimuovi(kc);
    }
    // ⚠ NON TUTTI SUBITO, SE C'È UN POSTO DA CUI GUARDARE. Misurato: 12,7 ms per
    // chunk su questa macchina, 49 chunk = 657 ms in un blocco solo; sul
    // telefono del committente (Mali-G68) gli stessi 49 chunk sono 5.507 ms —
    // cinque secondi e mezzo di pagina CONGELATA prima di vedere qualcosa.
    //
    // ⚠ E LA MACCHINA PER FARLO C'ERA GIÀ, inutilizzata: `aggiorna` scorre una
    // coda con un bilancio di 3 ms per fotogramma, ORDINATA PER DISTANZA dal
    // giocatore. Bastava non riempirla tutta di colpo. Adesso si costruisce
    // quello che si ha addosso e il resto arriva mentre si guarda — che è come
    // fanno tutti i giochi a blocchi, e non per estetica: un mondo che si
    // popola si legge come un mondo che carica, uno schermo fermo si legge come
    // un gioco rotto.
    const raggio = attorno ? RAGGIO_SUBITO : Infinity;
    const cx = attorno ? Math.floor(attorno.x / CHUNK) : 0;
    const cz = attorno ? Math.floor(attorno.z / CHUNK) : 0;
    // ⚠ I RAGGI DI RESA VALGONO ANCHE QUI: con un punto da cui guardare, i chunk
    // oltre `resa` non entrano nemmeno in coda. Senza punto (prove, zoo) si fa
    // tutto pieno come sempre.
    if (attorno) { this._bersaglio = { x: attorno.x, z: attorno.z }; this._chunkOsservatore = Math.floor(attorno.x / CHUNK) + ',' + Math.floor(attorno.z / CHUNK); }
    else this._bersaglio = null;
    for (const kc of mondo.chunks.keys()) {
      if (raggio === Infinity) { this._chunk(mondo, kc); continue; }
      if (this.raggi && this._livelloDi(kc) === null) { this._codaPiena.delete(kc); this._codaAcqua.delete(kc); continue; }
      const v = kc.indexOf(',');
      const dx = +kc.slice(0, v) - cx, dz = +kc.slice(v + 1) - cz;
      if (Math.max(Math.abs(dx), Math.abs(dz)) <= raggio) this._chunk(mondo, kc);
      else this._codaPiena.add(kc);
    }
    mondo.sporchi.clear();
    mondo.sporchiAcqua.clear();
    // ⚠ E LA CODA DELL'ACQUA SI SVUOTA, ma non quella piena: parlano di un mondo
    // che non c'è più — tranne quella che abbiamo appena riempito noi qui sopra
    // apposta, con i chunk lontani da costruire con calma. Svuotarle tutte e
    // due, com'era prima, vorrebbe dire che il resto del mondo non arriva mai.
    this._codaAcqua.clear();
    // ⚠ E I RISULTATI IN VOLO PARLANO DEL MONDO DI PRIMA: quando torneranno,
    // `_inVolo` non li conosce più e `aggiorna` li lascia cadere.
    this._inVolo.clear();
    this._pronti.length = 0;
    this.statistiche.ultimaMs = performance.now() - t0;
    this.statistiche.chunkAttivi = this.chunks.size;
    this.statistiche.inCoda = this._codaPiena.size;
  }

  /**
   * Porta la griglia dei muri in pari con cio' che e' cambiato: LOCALE quando
   * puo', da capo quando il cambiamento e' troppo grosso (generazione, import) o
   * esce dalla scatola. Non c'e' nessuna soglia sulla taglia del mondo: la
   * griglia si aggiorna mentre si costruisce SEMPRE, anche su un open world r48.
   *
   * L'acqua non entra mai qui: non ferma la luce e non ne emette, e la sua
   * simulazione tocca celle di continuo (world.js non la registra apposta).
   *
   * QUANTO SI E' SEMPLIFICATO. Prima questa funzione doveva anche ricostruire
   * l'elenco dei lampioni d'arredo e confrontarlo col precedente, capire quale
   * cella-lampada era cambiata e passare a _cuociOmbre l'elenco delle mappe da
   * rifare — perche' una lampada accesa cambiava un'ombra cotta. Adesso l'ombra
   * la calcola lo shader sui muri, e i muri non cambiano quando si preme un
   * interruttore: resta il solo giro sulle celle che hanno cambiato SOLIDITA'.
   */
  _rillumina(mondo) {
    if (!this.occlusioneAttiva) { mondo.scordaCambi(); return; }
    if (!this.luce) { this._ricalcolaLuceDalVivo(mondo); return; }
    // niente da fare: la simulazione dell'acqua sporca chunk di continuo e non
    // deve pagare nemmeno questo giro
    if (mondo.cambiate.length === 0) return;
    if (mondo.troppiCambi || mondo.cambiate.length / 3 > CAMBI_MAX_LOCALI) {
      this._ricalcolaLuceDalVivo(mondo); return;
    }

    const t0 = performance.now();
    const visto = new Set(), cambi = [];
    const c = mondo.cambiate;
    const defIn = (x, y, z) => {
      const t = mondo.tipo(x, y, z);
      return t ? defDi(t) : null;
    };
    const solidoIn = (x, y, z) => {
      const d = defIn(x, y, z);
      return !!(d && !d.acqua && !d.vetro && !FORME_VUOTE.has(d.forma));
    };
    const esamina = (x, y, z) => {
      const k = x + ',' + y + ',' + z;
      if (visto.has(k)) return;
      visto.add(k);
      const solido = solidoIn(x, y, z);
      const d = solido ? defIn(x, y, z) : null;
      cambi.push({
        x, y, z,
        solido,
        // pelle = ferma le lampade ma non proietta il sole. SOLO su richiesta
        // dell'autore del blocco (Officina, «solo alle lampade»): la vecchia
        // regola automatica sulla buccia del terreno e' stata tolta, vedi il
        // commento lungo nella ricostruzione piena.
        pelle: solido && !!(d && d.ombraSole === false),
        ombra: mondo.ombraFurniIn(x, y, z),
      });
    };
    for (let i = 0; i < c.length; i += 3) {
      const x = c[i], y = c[i + 1], z = c[i + 2];
      // UNA CELLA, UNA VOCE: la classe di un blocco dipende solo da se' stesso.
      // (Per un giro ha dipeso anche dai vicini in verticale — la regola della
      // buccia — e allora qui se ne esaminavano tre per ogni cambio.)
      esamina(x, y, z);
    }
    mondo.scordaCambi();

    if (!this.luce.applicaCambi(cambi)) { this._ricalcolaLuceDalVivo(mondo); return; }
    // UN BYTE CAMBIATO, UN VOLUME RICARICATO: la texture 3D si ricarica intera
    // perche' e' l'unico modo che three offre di aggiornare una Data3DTexture, e
    // costa quanto la griglia (52 KB sul diorama, 291 KB sul mondo di test).
    // Si paga a blocco POSATO, non per frame — camminare non passa di qui.
    impostaVoxel(this.luce.solidi, this.luce.scatola(), this.luce.cimaY);
    this.statistiche.occMs = performance.now() - t0;
    this.statistiche.occLocali = cambi.length;
  }

  /**
   * Ricostruzione incrementale: solo i chunk sporchi. Da chiamare nel loop.
   *
   * ⚠ A BILANCIO, NON PIÙ TUTTI IN UN COLPO. Sul mondo gigante l'acqua che si
   * assesta sporca i chunk a grappoli, e rifarli tutti nello stesso frame è
   * costato un fotogramma da 177 MILLISECONDI — misurato camminando, ed è
   * esattamente lo scatto che si sente. (E a ruota il render pagava il
   * caricamento di tutta quella geometria fresca insieme: altri 155.)
   *
   * I chunk sporchi passano in una CODA interna e si ricostruiscono i più
   * VICINI al punto guardato prima, dentro ~3 ms a frame — sempre almeno uno,
   * così il blocco appena posato dal giocatore (che è per forza vicino) compare
   * nello stesso fotogramma di prima. Il resto scivola ai frame dopo: un chunk
   * d'acqua in fondo al mondo che si aggiorna tre frame più tardi non lo vede
   * nessuno, un fotogramma da 177 ms lo vedono tutti.
   *
   * @param bersaglio (facolt.) il punto guardato: Vector3 o {x,z}
   */
  aggiorna(mondo, bersaglio = null) {
    // ---- lo streaming, se c'è: prima si genera, poi si costruisce -------------
    // ⚠ E LA GRIGLIA DEI MURI SI SPEGNE: è UNA texture 3D sulla scatola di tutto
    // il mondo, e un mondo che cresce mentre si cammina la rifarebbe a ogni
    // chunk nuovo finché non sfonda il paracadute. La griglia che segue la
    // camera è il prossimo passo (PIANO-REWORK, R3); fino ad allora con lo
    // streaming le lampade tornano ad attraversare i muri — un ripiego che si
    // vede, non un guasto muto.
    if (mondo.frontiera) {
      if (this.occlusioneAttiva) { this.occlusioneAttiva = false; mondo.scordaCambi(); this._spegniOmbre(); }
      if (bersaglio) mondo.frontiera.assicura(bersaglio.x, bersaglio.z, this.raggi);
      mondo.scordaCambi();
    }
    if (mondo.cambiate.length) this._rillumina(mondo);   // luce: subito, costa a blocco
    // i raggi li dice la fabbrica (dal profilo di qualità), se sa dirli
    if (_f.raggi) {
      const r = _f.raggi();
      if (!!r !== !!this.raggi || (r && (r.resa !== this.raggi.resa || r.pieno !== this.raggi.pieno))) this.impostaRaggi(r);
    }
    if (this.raggi && bersaglio) {
      const kc = Math.floor(bersaglio.x / CHUNK) + ',' + Math.floor(bersaglio.z / CHUNK);
      if (kc !== this._chunkOsservatore) { this._chunkOsservatore = kc; this._riesamina(mondo, bersaglio); }
    }
    // gli sporchi nuovi entrano in coda (il pieno vince sul solo-acqua)
    if (mondo.sporchi.size) {
      for (const kc of mondo.sporchi) { this._codaPiena.add(kc); this._codaAcqua.delete(kc); }
      mondo.sporchi.clear();
    }
    if (mondo.sporchiAcqua.size) {
      for (const kc of mondo.sporchiAcqua) if (!this._codaPiena.has(kc)) this._codaAcqua.add(kc);
      mondo.sporchiAcqua.clear();
    }
    if (this._codaPiena.size === 0 && this._codaAcqua.size === 0 && this._pronti.length === 0) return;
    const t0 = performance.now();
    const w = this._avviaLavoro();
    // ---- quello che il Worker ha finito si carica in GPU, a bilancio ----------
    // ⚠ PRIMA di spedire altro: così un chunk sporcato di nuovo mentre era in
    // volo riparte dal risultato già applicato e non salta un giro.
    let applicati = 0;
    while (this._pronti.length && applicati < APPLICAZIONI_PER_GIRO) {
      const r = this._pronti.shift();
      const livello = this._inVolo.get(r.kc);
      this._inVolo.delete(r.kc);
      if (livello === undefined) continue;                  // un lavoro rimesso in coda dopo un guasto
      if (!mondo.chunks.has(r.kc)) { this._rimuovi(r.kc); continue; }
      this._applica(mondo, r.kc, livello, r);
      applicati++;
    }
    // ordina per distanza dal punto guardato: ciò che si vede si aggiorna prima
    const bx = bersaglio ? bersaglio.x : 0, bz = bersaglio ? bersaglio.z : 0;
    const coda = [];
    for (const kc of this._codaPiena) coda.push([kc, false]);
    for (const kc of this._codaAcqua) coda.push([kc, true]);
    coda.sort((a, b) => {
      const [ax, az] = a[0].split(','), [cx, cz] = b[0].split(',');
      const da = (ax * 16 + 8 - bx) ** 2 + (az * 16 + 8 - bz) ** 2;
      const db = (cx * 16 + 8 - bx) ** 2 + (cz * 16 + 8 - bz) ** 2;
      return da - db;
    });
    let fatti = 0;
    for (const [kc, soloAcqua] of coda) {
      const dove = soloAcqua ? this._codaAcqua : this._codaPiena;
      if (!mondo.chunks.has(kc)) { this._rimuovi(kc); dove.delete(kc); continue; }
      if (w) {
        // ---- la strada del Worker: si fotografa e si spedisce -----------------
        if (fatti >= SPEDIZIONI_PER_GIRO) break;
        if (this._inVolo.has(kc)) continue;                 // torna al prossimo giro, col risultato applicato
        const livello = this._livelloDi(kc);
        if (livello === null) { this._rimuovi(kc); dove.delete(kc); continue; }
        if (soloAcqua && !this.chunks.get(kc)) { dove.delete(kc); continue; }
        const foto = fotografa(mondo, kc, livello, soloAcqua);
        if (!foto) { this._rimuovi(kc); dove.delete(kc); continue; }
        w.postMessage(foto, [foto.celle.buffer]);
        this._inVolo.set(kc, livello);
        dove.delete(kc);
        fatti++;
        continue;
      }
      // ---- in linea, com'è sempre stato --------------------------------------
      if (fatti > 0 && performance.now() - t0 > 3) break;   // bilancio: mai il primo
      this._chunk(mondo, kc, soloAcqua);
      dove.delete(kc);
      fatti++;
    }
    this.statistiche.ultimaMs = performance.now() - t0;
    this.statistiche.chunkAttivi = this.chunks.size;
    // ⚠ IN CODA CONTA ANCHE CHI È IN VOLO: per chi aspetta «tutto costruito» un
    // chunk nel Worker è lavoro che manca, e il pannello deve dirlo.
    this.statistiche.inCoda = this._codaPiena.size + this._codaAcqua.size + this._inVolo.size;
    this.statistiche.inVolo = this._inVolo.size;
    let pelli = 0; for (const l of this._livelli.values()) if (l === 1) pelli++;
    this.statistiche.pelli = pelli;
  }
}

// ---- superficie di prova ----------------------------------------------------
// Roba interna esportata SOLO per i test (test/mesher.test.mjs): la riva e la
// soglia di pendenza, cioè i numeri su cui sono tarate le soglie dello shader
// dell'acqua — cambiarli qui lo scalibrerebbe in silenzio.
export { rivaCella, Costruttore, PENDENZA_RIPIDA, RIVA_RAGGIO, costruisciPelle, livelloPer, costruisciBlocco, costruttoreAcqua, PELLE_PARETE_MAX };
// ⚠ ED ESPORTATO ANCHE IL PARACADUTE, perché superarlo spegne le ombre delle
// lampade IN SILENZIO — nessun errore, solo luce che attraversa i muri. Lo zoo
// ci sta vicino (allargare le piazzole allarga la griglia) e ha una prova che
// lo controlla: senza esportarlo, quella prova avrebbe una copia del numero, e
// una copia prima o poi diverge.
export { LUCE_LIMITE_CELLE };

/** Geometria di un singolo blocco isolato (per il ghost di anteprima). */
export function geometriaSingola(tipo) {
  const def = defDi(tipo);
  const pal = paletteBlocco(tipoBase(tipo), 3);   // quota media della rampa
  const b = new Costruttore();
  const nessuno = () => false;
  { const mt = materiaDi(def); b.materia(mt ? indiceMateria(def.materia) : 0); }
  if (def.acqua) acquaBox(b, 0, 0, 0, pal, { livello: 0, mioSopra: false, cascata: false, flusso: [0, 0], vicinoAcqua: () => null, vicinoPieno: nessuno });
  else if (def.forma && FORME_EXTRA[def.forma]) FORME_EXTRA[def.forma](b, 0, 0, 0, pal, nessuno);
  else if (def.cappello) conCappello(b, 0, 0, 0, pal, nessuno);
  else supercubo(b, 0, 0, 0, pal, nessuno);
  return b.dati();
}

/**
 * IL REGISTRO DEL MESHER PER L'OFFICINA: chunk, livelli, coda, Worker.
 *
 * ⚠ QUI NON SI NOMINA IL MOTORE, e il registro non fa eccezione: la manopola
 * «dettaglio pieno fino a» è un campo del PROFILO (`pieno`), e a scriverlo
 * nel profilo ci pensa chi chiama, con `applicaPieno(v)` (in apri.js è
 * `rig.applicaProfilo`, come per tutte le colonne). Il mesher sa solo leggere
 * i raggi che la fabbrica gli dà.
 */
export function registroMesher(mesher, mondo, { applicaPieno = null, leggiPieno = null, attorno = null } = {}) {
  const st = () => mesher.statistiche;
  const campi = [
    { chiave: 'chunk', nome: 'chunk costruiti / nel mondo', tipo: 'lettura', leggi: () => `${mesher.chunks.size} / ${mondo.chunks.size}` },
    { chiave: 'pelli', nome: 'di cui pelle', tipo: 'lettura', leggi: () => st().pelli ?? 0 },
    { chiave: 'coda', nome: 'in coda (di cui in volo nel Worker)', tipo: 'lettura', leggi: () => `${st().inCoda} (${st().inVolo ?? 0})` },
    { chiave: 'worker', nome: 'Worker del mesher', tipo: 'lettura',
      leggi: () => (mesher.lavoro ? 'attivo' : mesher.lavoro === null ? 'assente: si costruisce in linea' : 'non ancora usato') },
    { chiave: 'raggi', nome: 'raggi: pieno / resa', tipo: 'lettura', unita: 'blocchi',
      leggi: () => (mesher.raggi ? `${mesher.raggi.pieno} / ${mesher.raggi.resa}` : 'tutto pieno (nessun raggio)') },
    { chiave: 'blocchi', nome: 'blocchi nel mondo', tipo: 'lettura', leggi: () => mondo.contaBlocchi.toLocaleString('it') },
    { chiave: 'luce', nome: 'griglia dei muri (celle · ms)', tipo: 'lettura',
      leggi: () => `${(st().occCelle || 0).toLocaleString('it')} · ${(st().occMs || 0).toFixed(1)} ms` },
    { chiave: 'ultima', nome: 'ultimo giro del mesher', tipo: 'lettura', leggi: () => `${(st().ultimaMs || 0).toFixed(2)} ms` },
  ];
  if (applicaPieno && leggiPieno) {
    campi.splice(4, 0, { chiave: 'pieno', nome: 'dettaglio pieno fino a', tipo: 'numero', min: 16, max: 400, passo: 4, unita: 'blocchi',
      nota: 'oltre, i chunk sono PELLE (cima + pareti, niente smussi). È la colonna `pieno` del profilo; se il profilo tace, metà distanza',
      leggi: leggiPieno, scrivi: applicaPieno });
  }
  campi.push({ chiave: 'rifai', nome: '🔁 ricostruisci tutto (dal giocatore)', tipo: 'azione',
    fai: () => mesher.ricostruisciTutto(mondo, attorno ? attorno() : null) });
  return {
    chiave: 'mondo', nome: 'Mondo',
    nota: 'I chunk hanno tre livelli: pieno vicino, pelle lontano, niente oltre la resa. Si costruiscono nel Worker; qui si vede quanti, e a che punto è la coda.',
    campi,
  };
}

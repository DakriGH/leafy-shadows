// IL TRATTEGGIO DELL'ACQUA — il disegno che si muove sul pelo.
//
// ⚠ QUESTO FILE NON NOMINA BABYLON E NON IMPORTA NIENTE, di proposito: generare
// una tessitura è aritmetica, e l'aritmetica si prova in Node. Chi la carica
// sulla scheda è `acqua.js`, che è l'unico che sa cosa sia una texture.
//
// ── PERCHÉ UNA TESSITURA E NON DEL RUMORE NELLO SHADER ──────────────────────
//
// Lo shader toon di riferimento (Roystan, e i due port che girano) taglia una
// texture di rumore con una soglia: `step(soglia, rumore)`. Il taglio è la
// ragione per cui sta in stile — quello che esce non è una sfumatura, sono
// CHIAZZE PIATTE dal bordo netto, esattamente la grammatica di Leafy.
//
// Il rumore si può anche calcolare nel fragment, e su desktop non si sentirebbe.
// Su mobile sì: lì la valuta scarsa sono le ALU e i registri (vedi CLAUDE.md,
// «su mobile un `if` non spegne niente» — è la stessa storia dell'occupancy).
// Una lettura da texture è la cosa che una GPU a tile sa fare meglio di tutte.
// Quindi il rumore si cuoce UNA VOLTA all'avvio, in 64 KB, e poi si legge.
//
// ── E NON È RUMORE, SONO TRATTI ─────────────────────────────────────────────
//
// Se il campo è rumore isotropo, tagliarlo dà chiazze tonde: è il look del
// pacchetto Unity che gira su ogni asset store, ed è generico. Nelle referenze
// che contano — la prima immagine del committente — le onde non sono chiazze:
// sono LOSANGHE ALLUNGATE, tratti come di pennello, tutti nello stesso verso.
//
// Si ottengono da un rumore campionato con periodi DIVERSI nelle due direzioni:
// poche celle lungo u e tante lungo v danno macchie larghe e basse. Tagliate,
// diventano tratti. E siccome il campo è continuo, muovendo la soglia i tratti
// non scorrono soltanto: si allungano e si accorciano, cioè RESPIRANO. È quella
// la differenza fra dell'acqua e una texture che scivola.
//
// ── QUATTRO SEGNALI IN UNA LETTURA SOLA ─────────────────────────────────────
//
// ⚠ E QUESTA È LA RIGA CHE COSTA MENO DI TUTTE. Ogni canale porta un campo suo,
// quindi UNA `texture2D` dà allo shader tutti e quattro i disegni che gli
// servono. Metterli in quattro texture vorrebbe dire quattro letture per
// frammento d'acqua a schermo pieno, per gli stessi identici byte.

/** Il lato della tessitura. Potenza di due (serve al ripetersi e ai mipmap). */
export const LATO = 128;

/**
 * I CANALI, in tabella — e i periodi sono la forma del disegno.
 *
 * `pu`/`pv` sono quante celle di rumore stanno nel lato, lungo u e lungo v: un
 * periodo BASSO vuol dire macchie GRANDI in quella direzione. Il rapporto fra i
 * due è quanto il tratto è allungato.
 *
 *  · R «tratti»    4 × 24 → tratti lunghi SEI VOLTE quanto sono alti, orientati
 *                  lungo u. È il disegno principale del pelo.
 *                  ⚠ E UNA OTTAVA SOLA, che è una correzione presa guardando
 *                  insieme al committente: «non è pulita come quelle delle
 *                  reference». Con due ottave la seconda spezzetta i tratti e
 *                  quello che esce non sono segni, sono MACCHIE con i bordi
 *                  frastagliati. Le referenze sono grandi campi di tinta piena
 *                  con sopra pochi segni netti: la pulizia viene da lì, non da
 *                  quanto è ricco il rumore.
 *  · G «deriva»    5 × 5  → campo largo e lento: non si vede mai da solo, serve
 *                  a SPOSTARE il punto in cui si legge R. È il trucco che
 *                  rompe il ripetersi della tessitura: senza, a schermo si
 *                  legge la griglia da 128 e si vede il reticolo (è lo stesso
 *                  difetto dell'erba, «il tiling era un hash riusato»).
 *  · B «scintille» 18 × 18 → punti fini e fitti: il luccichio del sole non è
 *                  una macchia, è polvere di luce.
 *  · A «chiazze»   9 × 9  → medio e isotropo: rompe il bordo della schiuma, che
 *                  se no sarebbe una curva di livello geometrica e si vedrebbe.
 *
 * ⚠ E QUESTI DUE NUMERI VENGONO DA UNA GUARDATA, non da un ragionamento: la
 * prima stesura aveva la deriva a 3 (una macchia sola su tutta la tessitura:
 * spostava tutto il campo insieme invece di deformarlo) e le scintille a 30 —
 * cioè celle di rumore da quattro texel, che è rumore per pixel. Un campo così
 * fine non si può filtrare: a distanza ogni pixel pesca una cella diversa a
 * ogni fotogramma e l'acqua SFARFALLA. Le ho stampate come immagine e si vedeva
 * subito; dedurlo dai numeri non mi era riuscito.
 *
 * ⚠ I PERIODI DEVONO DIVIDERE `LATO`, o il campo non si richiude: la cella a
 * cavallo della cucitura leggerebbe due angoli diversi e resterebbe una riga
 * visibile lungo tutto il bordo. 6, 3, 30 e 9 non dividono 128 — e non serve
 * che lo facciano, perché la periodicità qui la dà il MODULO sugli indici del
 * reticolo (vedi `valore`), non la divisibilità. Quello che deve valere è che
 * il reticolo si chiuda su se stesso, e col modulo si chiude sempre.
 */
const CANALI = [
  { pu: 4, pv: 24, ottave: 1, seme: 1 },     // R — i tratti
  { pu: 5, pv: 5, ottave: 1, seme: 2 },      // G — la deriva
  { pu: 18, pv: 18, ottave: 1, seme: 3 },    // B — le scintille
  { pu: 9, pv: 9, ottave: 2, seme: 4 },      // A — le chiazze
];

/**
 * L'hash del reticolo: da due interi a un numero fra 0 e 1.
 *
 * ⚠ `Math.imul` E NON `*`, e non è pignoleria: in JavaScript un prodotto fra
 * interi grandi passa per il doppio in virgola mobile e i bit bassi — gli unici
 * che qui portano informazione — si perdono. Con `imul` il prodotto resta a 32
 * bit come vuole l'hash. È lo stesso inciampo che in Lantern aveva reso il
 * tiling dell'erba «un hash riusato».
 */
function hash(ix, iy, seme) {
  let h = Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seme, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}

/** Il modulo che torna sempre positivo (in JS `-1 % 6` fa −1, non 5). */
const mod = (i, p) => ((i % p) + p) % p;

/**
 * Rumore di valore periodico su (u,v) in [0,1), con periodi diversi nelle due
 * direzioni.
 *
 * ⚠ LA PERIODICITÀ VIENE DAL MODULO SUGLI INDICI, ed è il motivo per cui la
 * tessitura si ripete senza cucitura: l'angolo di reticolo a `pu` è lo STESSO
 * oggetto dell'angolo a 0, non un altro che gli somiglia. Qualunque altra via
 * (specchiare, sfumare i bordi) lascia una traccia che a schermo si vede.
 *
 * L'interpolazione è la classica curva liscia 3t²−2t³: serve che il campo sia
 * continuo, se no il taglio darebbe tratti dal bordo a scaletta invece che
 * netto e pulito.
 */
function valore(u, v, pu, pv, seme) {
  const x = u * pu, y = v * pv;
  const x0 = Math.floor(x), y0 = Math.floor(y);
  const fx = x - x0, fy = y - y0;
  const sx = fx * fx * (3 - 2 * fx), sy = fy * fy * (3 - 2 * fy);
  const ax = mod(x0, pu), bx = mod(x0 + 1, pu);
  const ay = mod(y0, pv), by = mod(y0 + 1, pv);
  const a = hash(ax, ay, seme), b = hash(bx, ay, seme);
  const c = hash(ax, by, seme), d = hash(bx, by, seme);
  const sopra = a + (b - a) * sx;
  const sotto = c + (d - c) * sx;
  return sopra + (sotto - sopra) * sy;
}

/**
 * Più ottave dello stesso campo: la seconda ha periodo doppio e peso metà.
 *
 * Serve solo ai tratti e alle chiazze, e serve a poco ma si vede: con UNA sola
 * ottava tutti i tratti escono della stessa taglia, e una superficie d'acqua
 * fatta di losanghe tutte identiche si legge come un motivo, non come dell'acqua.
 */
function campo(u, v, { pu, pv, ottave, seme }) {
  let somma = 0, peso = 0, amp = 1;
  for (let o = 0; o < ottave; o++) {
    const k = 1 << o;
    somma += valore(u, v, pu * k, pv * k, seme + o * 97) * amp;
    peso += amp;
    amp *= 0.5;
  }
  return somma / peso;
}

/**
 * LA TESSITURA, come byte RGBA pronti per la scheda.
 *
 * Torna un `Uint8Array` di LATO·LATO·4. Chi lo carica è `acqua.js`; qui non si
 * sa nemmeno che esista una GPU, ed è per questo che questa funzione si può
 * chiamare da una prova senza aprire una finestra.
 */
export function tratteggio(lato = LATO) {
  const dati = new Uint8Array(lato * lato * 4);
  for (let y = 0; y < lato; y++) {
    const v = y / lato;
    for (let x = 0; x < lato; x++) {
      const u = x / lato;
      const o = (y * lato + x) * 4;
      for (let c = 0; c < 4; c++) {
        // ⚠ `min(255, …)` e non un arrotondamento nudo: `campo` può toccare 1
        // esatto e 1·256 farebbe 256, che in un Uint8Array diventa 0 — cioè un
        // punto NERO in mezzo al massimo. È il difetto che non si vede finché
        // non lo si cerca, e allora sembra un guasto della scheda.
        dati[o + c] = Math.min(255, Math.floor(campo(u, v, CANALI[c]) * 256));
      }
    }
  }
  return dati;
}

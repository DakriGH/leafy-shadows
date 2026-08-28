// L'ERBA — ciuffi piazzati sopra i blocchi d'erba, in UN draw call.
//
// LA PRIMA VERSIONE ERA SBAGLIATA, e il committente l'ha bocciata su cinque
// punti. Vale la pena scriverli, perché ognuno è una regola:
//
//   1. «FUORISTILE»: erano fili sottili e affusolati, da erba realistica. Qui
//      tutto è fatto di scatole e colori piatti — l'erba dev'essere RETTANGOLI
//      SPESSI, non lame.
//   2. «IL COLORE DELL'ERBA SOTTO, al variare delle altezze»: il verde era una
//      coppia di costanti. Ora ogni ciuffo prende il colore dalla PALETTE della
//      cella su cui sta (`paletteBlocco`), quindi segue la rampa per quota e le
//      stagioni senza saperne niente.
//   3. «UN OGGETTO PIAZZATO SOPRA IL BLOCCO, non sempre lo stesso»: un ciuffo è
//      un oggettino con la sua forma, e ce ne sono quattro tipi diversi scelti
//      per cella — non un tappeto di cloni.
//   4. «SPARISCE A DISTANZA»: prima il campo era un cerchio di 26 blocchi e
//      finiva lì, con un bordo visibile. Ora arriva a 80+ blocchi diradando a
//      ANELLI: vicino un ciuffo per cella, più in là uno ogni due, poi uno ogni
//      quattro. Il prato continua fino all'orizzonte senza costare di più.
//   5. «CALI DI FPS»: ed erano veri, ma non della GPU. La semina scandiva
//      migliaia di colonne IN UN FRAME SOLO ogni volta che si usciva dal
//      riquadro — una raffica di lavoro che si vedeva. Adesso si semina un
//      CHUNK PER FRAME in un buffer di scorta, e si scambia quando è pronto:
//      il vecchio prato resta visibile intanto, e nessun frame paga più di 256
//      colonne. La quota di una colonna si legge da una passata sola sui
//      blocchi del chunk, non frugando in giù cella per cella (era l'altra metà
//      del costo: `appoggioInColonna` scava fino a sessanta blocchi).
//
// L'ANIMAZIONE RESTA TUTTA NEL VERTEX SHADER: la CPU per frame scrive quattro
// uniform. Muovere ventimila ciuffi costa quanto muoverne uno.

// ⚠ QUI NON SI NOMINA IL MOTORE, come nel mondo. Di questo file, in
// Leafy-Lantern, 346 righe su 930 erano stringhe GLSL e 19 toccavano three: il
// resto — quale cella riceve un ciuffo, quante lamelle, di che colore, quanto
// alte, come si dirada con la distanza — è aritmetica, e l'aritmetica non
// cambia con il motore. Adesso la semina riempie array e li consegna alla
// FABBRICA, che ne fa istanze; il vento e il colore vivono nel materiale.
import { paletteBlocco, coloreRampaChiaro } from '../world/stagioni.js';
import { CHUNK } from '../world/world.js';

// la fabbrica di resa, iniettata da main
let _r = null;
export function collegaFabbrica(f) { _r = f; }

// I QUATTRO TIPI DI CIUFFO: (quante lamelle, larghezza, altezza, apertura).
// Non è varietà per la varietà — un prato di cloni si legge come una texture
// ripetuta, e in un gioco di cubi si nota subito.
const TIPI = [
  { n: 5, largo: 0.15, alto: 0.32, apri: 0.42 },   // ciuffo basso e largo
  { n: 4, largo: 0.12, alto: 0.50, apri: 0.34 },   // lamelle alte
  { n: 7, largo: 0.10, alto: 0.38, apri: 0.46 },   // cespuglio fitto
  { n: 3, largo: 0.18, alto: 0.28, apri: 0.30 },   // poche lamelle larghe
];
const LAMELLE_MAX = 8;
/** L'altezza media dei quattro tipi. È la scala del manto, non un valore per
 *  cella: vedi la nota sull'altezza dentro `_seminaVero`. */
const ALTO_MEDIO = (0.32 + 0.50 + 0.38 + 0.28) / 4;

// LE CHIAZZE. Un prato con l'erba su OGNI cella si legge come una moquette
// stesa: nell'erba vera ci sono radure, zone rade e ciuffi fitti. Due rumori
// per hash — uno largo (macchie da otto celle) e uno fine (cella per cella) —
// bastano a rompere la regolarità senza inventare una simulazione.
const CHIAZZA_LARGA = 8;

// QUANTI CHUNK GIÀ SEMINATI SI TENGONO DA PARTE. Il ring più largo è 11×11 =
// 121 chunk, e lo stesso chunk può stare in cache a due passi di diradamento
// diversi mentre lo si attraversa: 320 lascia margine senza far crescere la
// memoria (una voce media sono poche decine di KB).
const CACHE_CHUNK = 320;

/** Colonna senza niente sopra, nell'array piatto delle quote. */
const SENZA_CIMA = -32768;

// QUANTO PUÒ DURARE LA SEMINA IN UN FRAME. Mezzo millisecondo: su un telefono
// che ne ha undici per fotogramma è il 5%, e la coda si svuota comunque in poche
// decine di frame perché la maggior parte dei chunk arriva dalla cache.
// SU MOBILE META': mezzo millisecondo e' il 5% di un frame a 90 Hz, e la coda si
// svuota comunque in qualche decina di fotogrammi perche' quasi tutti i chunk
// arrivano dalla cache. Meglio seminare piu' piano che rubare tempo al frame.
const BUDGET_MS = (typeof matchMedia === 'function' && matchMedia('(pointer: coarse)').matches) ? 0.25 : 0.5;

/**
 * IL MANTO: un rumore liscio su coordinate di MONDO, a tre scale.
 *
 * ⚠ SERVE PERCHÉ IL PRATO SI LEGGEVA COME UN TILESET, e il committente l'ha
 * detto esatto: «è molto ripetitiva, si nota troppo che è un tileset». Aveva
 * ragione, e la causa era che TUTTO variava con periodo di UN BLOCCO: il tipo di
 * ciuffo, il numero di lamelle, l'altezza. Un campo di duecento blocchi fatto di
 * variazione a un blocco È una texture ripetuta, per definizione — l'occhio ci
 * mette due secondi a trovarne il passo.
 *
 * Il colore poi non variava affatto: «paletteBlocco» dà UN verde per quota,
 * quindi un'intera terrazza era tinta unita.
 *
 * Qui si aggiunge la scala che mancava. Tre ottave con periodi che non stanno in
 * rapporto semplice (2,7 · 9,3 · 31 blocchi): nessuno dei tre si allinea con gli
 * altri, quindi la somma non ha un passo riconoscibile. Modula ALTEZZA, NUMERO e
 * COLORE — le tre cose che l'occhio usa per trovare la ripetizione.
 *
 * ⚠ E SI CALCOLA UNA VOLTA PER CELLA, non per lamella: le chiazze che servono
 * sono larghe blocchi, non centimetri, e per lamella costerebbe dodici hash
 * invece di uno. La variazione fine fra lamelle vicine c'era già.
 */
function rumore(x, z, s) {
  const x0 = Math.floor(x), z0 = Math.floor(z);
  const fx = x - x0, fz = z - z0;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  const a = hash(x0, z0, s), b = hash(x0 + 1, z0, s);
  const c = hash(x0, z0 + 1, s), d = hash(x0 + 1, z0 + 1, s);
  const u = a + (b - a) * sx, v = c + (d - c) * sx;
  return u + (v - u) * sz;
}
/**
 * ⚠ LE OTTAVE SONO RUOTATE, E OGNUNA DI UN ANGOLO DIVERSO. Non è pignoleria: il
 * rumore A VALORE su reticolo quadrato ha struttura ALLINEATA AGLI ASSI, e tre
 * ottave allineate fra loro non si annullano — sommano i loro assi. Viene un
 * motivo a scacchi che dall'alto non si vede (l'ho guardato: rumore pulito) ma
 * di lato, dove le lamelle si sovrappongono, si legge come CORSIE.
 *
 * ⚠ E I PESI SONO SPOSTATI SULLE SCALE LARGHE. Prima l'ottava dominante era a
 * 2,7 blocchi: a distanza da diorama sono pochi pixel, cioè un motivo che si
 * ripete dentro l'inquadratura — che è esattamente quello che l'occhio chiama
 * «tileset». Adesso comanda quella a 27 blocchi, e le due corte servono solo a
 * sporcarne il bordo.
 *
 * I periodi non stanno in rapporto semplice (27 · 11,3 · 4,1) apposta: se lo
 * fossero, i tre si riallineerebbero a intervalli regolari e il motivo
 * tornerebbe, solo più lontano.
 */
const OTTAVE = [
  { seme: 151, periodo: 27.0, peso: 0.46, ang: 0.00 },
  { seme: 157, periodo: 11.3, peso: 0.32, ang: 0.90 },
  { seme: 163, periodo: 4.10, peso: 0.22, ang: 2.10 },
];
function manto(x, z) {
  let v = 0;
  for (const o of OTTAVE) {
    const c = Math.cos(o.ang), s = Math.sin(o.ang);
    v += rumore((x * c - z * s) / o.periodo, (x * s + z * c) / o.periodo, o.seme) * o.peso;
  }
  return v;
}

/** Il tipo di ciuffo di una cella. Deterministico come tutto il resto.
 *  Esportato per le prove: senza, la continuità del manto si può solo guardare. */
export function tipoDi(x, z) { return TIPI[(hash(x, z, 3) * TIPI.length) | 0]; }

/**
 * IL MANTO È UN CAMPO CONTINUO, NON UNA COSTANTE PER CELLA.
 *
 * Committente: «ok che sono zolle, ma non si deve notare troppo lo stacco tra
 * una cella di erba e l'altra, deve essere smooth la transizione». Aveva
 * ragione, e la causa era una riga sola: l'altezza della lamella veniva da
 * «tipo.alto», cioè dal tipo di ciuffo scelto PER CELLA. I quattro tipi vanno da
 * 0,28 a 0,50 — quasi il doppio — quindi due celle vicine potevano stare una a
 * mezzo blocco e l'altra a un quarto, con il salto ESATTAMENTE sul confine.
 * A prato rado non si vedeva: i ciuffi erano isolati e il confine non c'era. A
 * prato chiuso il confine c'è dappertutto, e si legge come una GRIGLIA.
 *
 * Qui il valore si interpola fra i CENTRI delle quattro celle che circondano la
 * lamella, con la curva liscia di smoothstep. I quattro tipi restano — sono
 * ancora loro a decidere quali altezze esistono — ma fra un centro e l'altro il
 * manto sale e scende invece di gradinare. Costa quattro hash PER CELLA (non
 * per lamella: i quattro vicini sono gli stessi per tutto il ciuffo) e due
 * interpolazioni per lamella.
 */
const VICINI = new Array(9);   // il 3×3 attorno alla cella, riusato: la semina è sincrona

/** Riempie VICINI col 3×3 di tipi attorno a (x,z). Indice: (dx+1)*3 + (dz+1). */
function scriviVicini(x, z) {
  for (let dx = -1; dx <= 1; dx++) {
    for (let dz = -1; dz <= 1; dz++) VICINI[(dx + 1) * 3 + (dz + 1)] = tipoDi(x + dx, z + dz);
  }
}

function fraCelle(px, pz, campo, cx, cz) {
  const gx = px - 0.5, gz = pz - 0.5;          // i centri delle celle stanno a +0.5
  const x0 = Math.floor(gx), z0 = Math.floor(gz);
  const fx = gx - x0, fz = gz - z0;
  const sx = fx * fx * (3 - 2 * fx), sz = fz * fz * (3 - 2 * fz);
  // la lamella può sbordare dalla sua cella, quindi il quadrato dei centri che
  // la contiene è uno dei quattro del 3×3 — mai fuori.
  const i = (x0 - cx + 1) * 3 + (z0 - cz + 1);
  const a = VICINI[i][campo], b = VICINI[i + 3][campo];
  const c = VICINI[i + 1][campo], d = VICINI[i + 4][campo];
  const su = a + (b - a) * sx;
  return su + ((c + (d - c) * sx) - su) * sz;
}

/** Chiave numerica di cella, con offset per le coordinate NEGATIVE. */
function chiaveCella(x, z) { return (x + 2048) * 4096 + (z + 2048); }

/** Hash deterministico: stessa cella, stesso ciuffo, per sempre. */
function hash(x, z, s) {
  let h = (x * 374761393 + z * 668265263 + s * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}



// ANELLI DI DIRADAMENTO, in chunk di distanza: quanto spesso si semina una
// cella. Vicino tutte, poi una ogni due, poi una ogni quattro. È così che il
// prato arriva all'orizzonte senza che il conto delle lamelle esploda.
// ⚠ ERANO 1 / 3, e il congedo per livello cadeva TROPPO VICINO — a sedici
// blocchi il prato perdeva quindici lamelle su sedici, e siccome il congedo le
// porta al colore piatto del blocco prima di toglierle, attorno al giocatore si
// vedeva sia il diradamento sia la perdita della sfumatura. Le soglie non le
// posso spostare da sole: sono legate al punto in cui un chunk cambia classe,
// che è il minimo a cui il diradamento può togliere qualcosa. Quindi si allarga
// la classe: passo pieno fino a DUE chunk (confine a 32 blocchi) e passo 2 fino
// a QUATTRO (confine a 64). Costa più lamelle nell'anello vicino — che è quello
// che si guarda — e il tetto di `max` taglia comunque le più lontane, che sono
// già in dissolvenza.
function passoPerDistanza(dc) {
  if (dc <= 2) return 1;
  if (dc <= 4) return 2;
  return 4;
}

export class Erba {
  /**
   * @param opzioni.raggioChunk quanti chunk attorno al giocatore (5 ≈ 80 blocchi)
   * @param opzioni.densita moltiplicatore di lamelle (la scala di qualità lo muove)
   */
  constructor(scena, { raggioChunk = 5, densita = 1, max = 30000 } = {}) {
    this.raggioChunk = raggioChunk;
    this.densita = densita;
    this.max = max;
    this.attiva = true;
    this._t = 0;
    this._ccx = 1e9; this._ccz = 1e9;
    this._coda = [];          // chunk da seminare, in ordine di distanza
    this._n = 0;              // lamelle scritte nel buffer di scorta
    this._quote = new Map();  // riuso fra i chunk della stessa passata
    this._cache = new Map();  // chunk già seminati: vedi _seminaChunk
    // ---- I CIUFFI MESSI A MANO ----------------------------------------------
    // ⚠ IL FURNI «Ciuffo d'erba» NON HA UN MODELLO SUO. La prima versione era un
    // ventaglio di scatoline costruito a parte, e il committente l'ha bocciata
    // subito: due sistemi che disegnano la stessa cosa non restano d'accordo, e
    // quello fatto a mano era il peggiore dei due. Adesso il furni registra la
    // sua cella qui e a disegnarla e' questo sistema — stesse lamelle, stesso
    // vento, stessa ombra del sole, stesse luci, stesso congedo con la distanza.
    this._posati = new Map();  // chiave(x,z) → { y }
    this._verPosati = 0;

    // DUE BUFFER: si semina in quello di SCORTA e si scambia a lavoro finito.
    // Senza, durante la semina progressiva si vedrebbe il prato costruirsi
    // pezzo per pezzo — che è peggio del salto che si voleva togliere.
    this.iPos = new Float32Array(max * 4);
    this.iDati = new Float32Array(max * 4);
    this.iCol = new Float32Array(max * 3);
    this.iColCima = new Float32Array(max * 3);
    this.sPos = new Float32Array(max * 4);
    this.sDati = new Float32Array(max * 4);
    this.sCol = new Float32Array(max * 3);
    this.sColCima = new Float32Array(max * 3);
    // il PRATO vero e proprio lo costruisce la fabbrica: qui si sa solo che
    // esiste e che accetta `n` istanze coi quattro array qui sopra
    this.prato = _r.creaPrato(max);

    this._apparso = 1;        // vedi _scambia: 0 = campo appena nato, si stacca dal terreno
    this.forzaMeteo = 0;      // 0 sereno, 1 rovescio: la muove main
    this._forza = 0;
    this.fili = 0;
  }

  /**
   * LE QUOTE DI UN CHUNK IN UNA PASSATA SOLA. `appoggioInColonna` frugherebbe
   * in giù fino a sessanta celle PER COLONNA: su 256 colonne sono quindicimila
   * ricerche, ed era metà del calo di frame. Qui si scorrono i blocchi che il
   * chunk ha davvero — che sono quelli e basta — tenendo il più alto di ognuna.
   */
  _quoteChunk(mondo, kc) {
    // UN ARRAY PIATTO, NON UNA MAPPA. Un chunk ha 256 colonne e basta: indicizzarle
    // per posizione locale costa un moltiplicatore, mentre la Map costava una
    // chiave impacchettata + un hash + un oggetto {y,tipo} PER BLOCCO — e i
    // blocchi di un chunk sono migliaia. Sparisce anche l'offset +2048 con cui
    // si impacchettavano le coordinate negative: era il posto dove i ciuffi
    // finivano a mezz'aria dall'altra parte del mondo, e ora non esiste più.
    const N = CHUNK * CHUNK;
    if (!this._qy) { this._qy = new Int16Array(N); this._qt = new Array(N); }
    const qy = this._qy, qt = this._qt;
    qy.fill(SENZA_CIMA);
    const virgola = kc.indexOf(',');
    const ox = +kc.slice(0, virgola) * CHUNK, oz = +kc.slice(virgola + 1) * CHUNK;
    for (const b of mondo.blocchiDelChunk(kc)) {
      const i = (b.x - ox) * CHUNK + (b.z - oz);
      if (i < 0 || i >= N) continue;
      if (b.y > qy[i]) { qy[i] = b.y; qt[i] = b.tipo; }
    }
    return { qy, qt, ox, oz };
  }

  /**
   * IL CHUNK GIÀ SEMINATO NON SI RISEMINA. È la cura del difetto peggiore di
   * questo sistema, ed era invisibile finché non si è misurato: attraversando un
   * confine di chunk — cioè ogni sedici passi — `_apriCoda` buttava via TUTTO e
   * rifaceva da capo tutti gli 81 chunk del ring. Misurato camminando sul mondo
   * aperto: picchi da 3,5 ms sull'erba e 2,1 sulle foglie, con mediana ZERO. Su
   * un telefono cinque volte più lento sono i trenta millisecondi che il
   * committente vedeva come scatto.
   *
   * Dei 81 chunk, attraversando un confine ne cambiano una ventina: gli altri
   * sessanta hanno lo stesso contenuto di un attimo prima. Qui si tengono le
   * lamelle già calcolate e si ricopiano — una memcpy invece di rifare hash,
   * palette e quote.
   *
   * LA CHIAVE PORTA DENTRO LA REVISIONE DEL CHUNK (mondo.revisione), quindi
   * scavare una cella rende irraggiungibile la voce vecchia: la cache non ha
   * bisogno di essere svuotata da nessuno, si invalida da sola. E porta dentro
   * anche il PASSO di diradamento, perché lo stesso chunk visto da lontano ha
   * meno ciuffi di quando lo si ha addosso.
   *
   * EFFETTO COLLATERALE CHE VALE DA SOLO: l'istante di nascita viaggia con la
   * lamella. Prima ogni riseminata rimetteva `nascita = adesso` su TUTTO il
   * prato, cioè ogni sedici passi l'intero campo ricresceva da scala zero sotto
   * gli occhi. Adesso ricresce solo l'erba davvero nuova.
   *
   * @returns quante lamelle ha scritto nel buffer di scorta
   */
  _seminaChunk(mondo, kc, dc) {
    const passo = passoPerDistanza(dc);
    // ⚠ LA DENSITÀ STA NELLA CHIAVE. Decide quante lamelle per ciuffo E quante
    // celle restano scoperte: un chunk seminato a densità 1 non vale a densità 8,
    // e senza questo pezzo la scala di qualità lasciava in giro il prato vecchio.
    const ck = kc + '|' + passo + '|' + this.densita + '|' + this._verPosati + '|' + (mondo.revisione ? mondo.revisione(kc) : 0);
    const pronto = this._cache.get(ck);
    if (pronto) {
      if (this._n + pronto.n > this.max) return 0;
      this.sPos.set(pronto.pos, this._n * 4);
      this.sDati.set(pronto.dati, this._n * 4);
      this.sCol.set(pronto.col, this._n * 3);
      this.sColCima.set(pronto.colCima, this._n * 3);
      this._n += pronto.n;
      return pronto.n;
    }
    const i0 = this._n;
    const scritte = this._seminaVero(mondo, kc, passo);
    this._ricorda(ck, i0, scritte);
    return scritte;
  }

  /** Mette da parte le lamelle appena seminate. La cache è a coda: le voci più
   *  vecchie sono quelle dei chunk che ci si è lasciati alle spalle. */
  _ricorda(ck, i0, n) {
    if (n <= 0) return;
    this._cache.set(ck, {
      n,
      pos: this.sPos.slice(i0 * 4, (i0 + n) * 4),
      dati: this.sDati.slice(i0 * 4, (i0 + n) * 4),
      col: this.sCol.slice(i0 * 3, (i0 + n) * 3),
      colCima: this.sColCima.slice(i0 * 3, (i0 + n) * 3),
    });
    while (this._cache.size > CACHE_CHUNK) {
      this._cache.delete(this._cache.keys().next().value);
    }
  }

  _seminaVero(mondo, kc, passo) {
    const { qy, qt, ox, oz } = this._quoteChunk(mondo, kc);
    const { sPos, sDati, sCol, sColCima } = this;
    let n = this._n;
    const col = { r: 0, g: 0, b: 0 }, colCima = { r: 0, g: 0, b: 0 };
    const daHex = (o, h) => { o.r = ((h >> 16) & 255) / 255; o.g = ((h >> 8) & 255) / 255; o.b = (h & 255) / 255; };
    // QUANTO SI CHIUDE IL PRATO. Vedi le chiazze più sotto: a densità 1 vale 0 e
    // il prato è quello di sempre, da 4 in su vale 1 e nessuna cella d'erba
    // resta scoperta. Sta qui e non nel ciclo perché dipende solo dalla densità.
    const copertura = Math.min(1, Math.max(0, (this.densita - 1) / 3));
    for (let i = 0; i < qy.length; i++) {
      if (n >= this.max - LAMELLE_MAX) break;
      const x = ox + ((i / CHUNK) | 0), z = oz + (i % CHUNK);
      const posato = this._posati.get(chiaveCella(x, z));
      let cima;
      if (posato) {
        // MESSO A MANO: sta dove l'hanno messo, su qualunque blocco e senza
        // passare per radure e diradamento — chi lo posa vuole vederlo lì.
        cima = { y: posato.y - 1, tipo: 'erba' };
      } else {
        if (qy[i] === SENZA_CIMA || qt[i] !== 'erba') continue;
        cima = { y: qy[i], tipo: qt[i] };
        // il diradamento è per POSIZIONE, non a caso: allontanandosi il prato si
        // dirada sempre negli stessi punti e non «brulica» mentre cammini
        if (passo > 1 && ((x % passo) + passo) % passo !== 0) continue;
        if (passo > 1 && ((z % passo) + passo) % passo !== 0) continue;

        // LE CHIAZZE: una macchia larga decide le radure, un rumore fine dirada
        // dentro la macchia. Senza, il prato è una moquette stesa uguale ovunque.
        //
        // ⚠ SALENDO DI DENSITÀ SI CHIUDONO, non si infittiscono i ciuffi che
        // sopravvivono. È il punto che avevo sbagliato: «più erba» non vuol dire
        // ciuffi più fitti dentro le stesse radure, vuol dire che le radure
        // spariscono e il verde copre il blocco. `copertura` è quanto si è
        // chiuso il prato: 0 a densità 1 (prato di sempre, non cambia un pixel),
        // 1 da densità 4 in su (nessuna cella d'erba resta scoperta).
        const macchia = hash(Math.floor(x / CHIAZZA_LARGA), Math.floor(z / CHIAZZA_LARGA), 91);
        if (macchia < 0.16 * (1 - copertura)) continue;   // radura
        const fitto = 0.55 + 0.45 * macchia;              // quanto è fitta QUESTA macchia
        if (hash(x, z, 57) > fitto + (1 - fitto) * copertura) continue;
      }
      const tipo = tipoDi(x, z);
      scriviVicini(x, z);
      // il manto: una volta per cella, decide di quanto questa zolla è più alta,
      // più fitta e più chiara della media. È quello che rompe la ripetizione.
      const mm = manto(x, z);       // il 3×3 che serve al campo continuo, una volta per cella
      // ⚠ E ANCHE IL NUMERO DI LAMELLE SI AMMORBIDISCE. I tipi vanno da 3 a 7
      // lamelle: a densità 8 sono 24 contro 56 nella cella accanto, cioè più del
      // doppio di roba a un blocco di distanza — l'altra metà della griglia che
      // si vedeva. La media coi quattro vicini in croce (la cella pesa doppio, se
      // no il tipo non conta più niente) dimezza il salto senza appiattire il
      // prato.
      const nMedio = (tipo.n * 2 + VICINI[1].n + VICINI[3].n + VICINI[5].n + VICINI[7].n) / 6;
      // ⚠ ANCHE LA QUANTITÀ SEGUE IL MANTO, ma poco (±18%): tanto basta a far
      // respirare il prato, e di più riaprirebbe le radure che la densità alta
      // esiste apposta per chiudere.
      const quante = Math.max(1, Math.round(nMedio * this.densita * (0.82 + 0.36 * mm)));
      // IL COLORE DEL BLOCCO SOTTO: paletteBlocco conosce la rampa per quota e
      // la stagione, quindi il ciuffo è intonato senza saperne niente
      const p = paletteBlocco(cima.tipo, cima.y);
      daHex(col, p.cima);
      // LA PUNTA: la stessa rampa stagionale, due gradini più chiara. Non un
      // verde moltiplicato — vedi il fragment shader, era quello che si vedeva
      // «quasi emissivo» a distanza.
      daHex(colCima, coloreRampaChiaro(cima.tipo, cima.y, 2));
      const y = cima.y + 1;
      // 0 = c'e' a qualunque passo, 1 = sparisce a passo 4, 2 = solo a passo 1.
      // I ciuffi POSATI a mano sono sempre 0: chi li mette vuole vederli sempre.
      const mx4 = ((x % 4) + 4) % 4, mz4 = ((z % 4) + 4) % 4;
      const mx2 = ((x % 2) + 2) % 2, mz2 = ((z % 2) + 2) % 2;
      const liv = posato ? 0 : ((mx4 === 0 && mz4 === 0) ? 0 : ((mx2 === 0 && mz2 === 0) ? 1 : 2));
      for (let i = 0; i < quante; i++) {
        // ⚠ CINQUE HASH, NON TRE, E OGNUNO FA UNA COSA SOLA. Questo era IL
        // difetto del tiling, ed era lì fin da Leafy-Lantern senza che nessuno
        // lo vedesse: «h1» decideva la posizione X della lamella dentro la cella
        // E la sua altezza, «h2» la posizione Z E la larghezza. Cioè in OGNI
        // cella l'erba cresceva da sinistra a destra e si allargava da davanti a
        // dietro — un dente di sega identico su ogni blocco, che è la
        // definizione di tiling.
        //
        // Misurato dalla prova: attraversando il confine di una cella l'altezza
        // media saltava di 1,49×. Riusare un hash è gratis e sembra innocuo:
        // costa un motivo regolare grande quanto il mondo.
        const h1 = hash(x, z, i * 17 + 5), h2 = hash(x, z, i * 17 + 11), h3 = hash(x, z, i * 17 + 23);
        const h4 = hash(x, z, i * 17 + 41), h5 = hash(x, z, i * 17 + 59);
        const j = n * 4, d = n * 4;
        // IL JITTER RIEMPIE LA CELLA. Con i ciuffi al centro si vedeva la
        // GRIGLIA — file regolari a un blocco di passo, che in un mondo di cubi
        // è la cosa che si nota per prima. Qui la lamella può stare ovunque
        // nella cella, e il reticolo sparisce.
        // ⚠ E LA DISPERSIONE ARRIVA AL BORDO. Era 0,42+apri, cioè mezza
        // larghezza fra 0,36 e 0,44: le lamelle si fermavano PRIMA del confine
        // della cella, e restava una riga più rada ogni blocco — cioè un
        // reticolo di righe rade, che è metà dello «stacco fra una cella e
        // l'altra». Adesso arrivano a 0,49 dal centro, cioè al confine.
        //
        // ⚠ MA NON OLTRE. Sbordare sembrava più naturale (l'erba vera pende dal
        // ciglio) e invece è un bug: la lamella nasce alla quota della SUA cella,
        // quindi una che sborda su una cella più bassa, sull'acqua o sul vuoto
        // resta appesa in aria. `test/sagome-ombra.test.mjs` lo ha beccato in
        // -9,21 al primo giro. Il tetto a 0,98 tiene il centro dentro la cella.
        const disp = Math.min(0.98, 0.66 + tipo.apri);
        const px = x + 0.5 + (h1 - 0.5) * disp;
        const pz = z + 0.5 + (h2 - 0.5) * disp;
        sPos[j] = px;
sPos[j + 1] = y;
        sPos[j + 2] = pz;
        // IL LIVELLO DI DIRADAMENTO, e non l'istante di nascita: la nascita non
        // si anima piu' (il committente l'aveva bocciata) e quello slot serviva
        // a questo. E' posizionale come il diradamento stesso — una cella che
        // sopravvive a passo 4 sopravvive anche a 2 e a 1 — quindi la cache dei
        // chunk resta valida senza toccarla.
        sPos[j + 3] = liv;
        sDati[d] = h3 * Math.PI;
        // ⚠ L'ALTEZZA NON TOCCA PIÙ IL RETICOLO DELLE CELLE, e questa è la
        // terza stesura. Le prime due sbagliavano tutt'e due, in modi opposti:
        //
        //   1. «tipo.alto», costante per cella → GRADINO netto sul confine fra
        //      una cella e l'altra: una griglia a un blocco di passo.
        //   2. «fraCelle», interpolato fra i CENTRI delle celle → CUPOLA. Il
        //      centro prende il valore pieno della sua cella, i bordi la media
        //      coi vicini: le celle alte diventano dossi e le basse conche.
        //      Il committente l'ha visto esatto: «sono dei balzi più alti al
        //      centro del blocco e più bassi ai lati, così sembra tiling».
        //      Avevo tolto il gradino e ci avevo messo una cupola.
        //
        // La cura non è una terza interpolazione: è togliere il reticolo. Il
        // manto si legge alla posizione della LAMELLA, non della cella, quindi
        // l'altezza è un campo continuo che delle celle non sa niente — né
        // gradini al confine, né cupole al centro, perché non c'è nessun
        // confine e nessun centro.
        //
        // I quattro TIPI restano, ma per il NUMERO di lamelle, la larghezza e
        // l'apertura del ciuffo: quelle non disegnano una superficie e non
        // possono fare né gradini né cupole.
        // ⚠ E LA VARIAZIONE ERA TROPPO STRETTA: misurata, lo scarto tipo era il
        // 18% della media e l'ottanta per cento delle lamelle stava in una
        // fascia di 1,6× — cioè «tutta alta uguale», che è quello che il
        // committente ha visto. Due cause, tutt'e due statistiche:
        //
        //  1. IL MANTO SI CONCENTRA AL CENTRO. Sommare tre ottave di rumore è
        //     sommare tre variabili quasi indipendenti: per il teorema del
        //     limite centrale il risultato si stringe attorno a 0,5 e i pesi
        //     0,46/0,32/0,22 mentono su quanto varia davvero. Si riapre con un
        //     guadagno attorno al centro.
        //  2. LA PARTE CASUALE ERA UNIFORME E STRETTA (±22%). Ma l'erba vera non
        //     è uniforme: ci sono tanti fili medi e QUALCUNO che spunta. Una
        //     potenza sull'uniforme dà proprio quella forma — coda lunga verso
        //     l'alto, gobba in basso — e costa una moltiplicazione.
        const mB = Math.min(1, Math.max(0, 0.5 + (manto(px, pz) - 0.5) * 1.7));
        sDati[d + 1] = ALTO_MEDIO * (0.62 + 0.80 * mB) * (0.52 + 1.15 * Math.pow(h4, 1.5));
        sDati[d + 2] = tipo.largo * (0.80 + 0.40 * h5);
        sDati[d + 3] = (h4 + h3) * 6.283;
        // ogni lamella un filo più chiara o più scura: senza, un ciuffo è una
        // macchia piatta
        // ⚠ IL COLORE VARIA A DUE SCALE, e prima non variava affatto a quella
        // larga: «paletteBlocco» dà un verde per quota, quindi tutta la terrazza
        // era tinta unita e la ripetizione saltava all'occhio.
        //   · «v» è la variazione FINE, per lamella (±6%): senza, un ciuffo è
        //     una macchia piatta;
        //   · «k» è quella LARGA, dal manto: sposta la zolla verso il verde più
        //     chiaro della rampa (colCima), che è un colore che la palette HA
        //     GIÀ. Così le chiazze restano dentro lo stile invece di essere un
        //     verde inventato — è lo stesso principio della punta della lamella.
        // ⚠ LA BASE È ESATTAMENTE IL COLORE DEL BLOCCO SOTTO, senza NIENTE in
        // mezzo — né la variazione per lamella né quella a chiazze. È una regola
        // di Leafy e il committente l'ha ribadita guardando: «vedo numerosi fili
        // d'erba la cui base non inizia dal colore del blocco di sotto; ci sta la
        // variazione, ma la sfumatura deve sempre partire dal colore base in modo
        // che il fondo si mescoli col blocco d'erba».
        //
        // Ha ragione, e il motivo è che a quota zero il filo e il blocco sono lo
        // stesso pixel: se i due colori differiscono anche di poco, l'attacco si
        // legge come una riga e il ciuffo sembra APPOGGIATO sopra invece che
        // cresciuto lì. Prima applicavo «v» e «mesc» a tutt'e due i capi.
        //
        // Quindi tutta la variazione — per lamella e a chiazze — vive nella
        // PUNTA. Il che è anche più bello: la sfumatura di ogni filo parte dallo
        // stesso verde e arriva a un verde suo.
        const jc = n * 3;
        sCol[jc] = col.r; sCol[jc + 1] = col.g; sCol[jc + 2] = col.b;

        const v = 0.94 + 0.12 * h5;                 // variazione fine, per lamella
        const k = (mm - 0.5) * 0.55;                // e larga, dal manto
        const mesc = (a, b) => (k >= 0 ? a + (b - a) * k : a * (1 + k * 0.55));
        sColCima[jc] = mesc(colCima.r, colCima.r * 1.12) * v;
        sColCima[jc + 1] = mesc(colCima.g, colCima.g * 1.12) * v;
        sColCima[jc + 2] = mesc(colCima.b, colCima.b * 1.12) * v;
        n++;
      }
    }
    const scritte = n - this._n;
    this._n = n;
    return scritte;
  }

  /** Prepara la coda dei chunk attorno al giocatore, dal più vicino. */
  _apriCoda(ccx, ccz) {
    const r = this.raggioChunk;
    this._coda.length = 0;
    for (let dx = -r; dx <= r; dx++) {
      for (let dz = -r; dz <= r; dz++) {
        const dc = Math.max(Math.abs(dx), Math.abs(dz));
        if (dc > r) continue;
        this._coda.push({ kc: (ccx + dx) + ',' + (ccz + dz), dc });
      }
    }
    this._coda.sort((a, b) => a.dc - b.dc);
    this._n = 0;
  }

  /**
   * IL BUFFER DI SCORTA DIVENTA QUELLO VIVO.
   *
   * ⚠ E SI CARICA SOLO LA PARTE USATA. Senza `addUpdateRange` three fa un
   * `bufferSubData` dell'INTERO array — cioè del tetto, non delle lamelle
   * scritte. Col tetto a 900 000 volevano dire 14,4 MB per iPos, altrettanti
   * per iDati e 10,8 per ciascun colore: una cinquantina di megabyte spediti
   * alla GPU ogni volta che si attraversa il confine di un chunk, per duecento
   * mila lamelle che ne occupano un quinto. Era una parte grossa del «si
   * notano durante la generazione»: non l'erba che appare, il fotogramma che
   * si ferma mentre appare.
   *
   * Le liste di intervalli si azzerano PRIMA di aggiungere: si accumulano, e
   * un intervallo vecchio più largo rimetterebbe in piedi il carico intero.
   */
  _scambia() {
    const n = this._n;
    this.iPos.set(this.sPos.subarray(0, n * 4));
    this.iDati.set(this.sDati.subarray(0, n * 4));
    this.iCol.set(this.sCol.subarray(0, n * 3));
    this.iColCima.set(this.sColCima.subarray(0, n * 3));
    // ⚠ E IL CARICO PARZIALE ADESSO È DEL MOTORE. In Lantern questa era la
    // riga che costava 8,1 ms a ogni confine di chunk, finché non ho scoperto
    // che senza `addUpdateRange` three spedisce l'INTERO array — il tetto, non
    // le lamelle scritte. Babylon lo chiama `thinInstancePartialBufferUpdate`
    // ed è la stessa idea, ma non è una cosa che dobbiamo ricordarci noi.
    _r.scriviPrato(this.prato, n, this);
    // LA COMPARSA. Il campo che nasce da zero (mondo nuovo, erba riaccesa, primo
    // avvio) si stacca dal terreno in mezzo secondo invece di apparire in un
    // fotogramma; una riseminata normale — quella di quando cammini — non la
    // fa partire, perché lì il prato c'era già e i fili vicini sono identici.
    if (this.fili === 0 && n > 0) this._apparso = 0;
    this.fili = n;
  }

  /**
   * Da chiamare nel loop. La CPU qui fa cinque cose: avanza l'orologio, muove
   * il vento, copia la posizione del giocatore, e — se serve — semina AL PIÙ
   * due chunk. Tutto il resto lo fa la GPU.
   */
  aggiorna(dt, mondo, pos, ambiente, occhio) {
    if (!this.attiva) return;
    this._t += dt;
    // la comparsa del campo: mezzo secondo dal colore del blocco a quello pieno
    if (this._apparso < 1) this._apparso = Math.min(1, this._apparso + dt * 2);

    // IL VENTO SEGUE IL METEO, ed è la richiesta: con il rovescio si devono
    // VEDERE le raffiche. La forza insegue invece di saltare (il temporale
    // arriva, non scatta) e la direzione gira piano.
    this._forza += (this.forzaMeteo - this._forza) * Math.min(1, dt * 0.5);
    const a = this._t * 0.045;
    const fondo = 0.18 + 0.55 * this._forza;
    const raffica = 0.30 + 0.75 * this._forza;
    this.vento = { x: Math.cos(a), z: Math.sin(a), fondo, raffica };
    // il giocatore è sempre il primo; gli altri li mette main (gatti, palle)
    // ⚠ IL RAGGIO ERA TROPPO LARGO, e il committente l'ha descritto esatto: «è
    // strano passare a un blocco di distanza e vedere le foglie muoversi». Il
    // gatto è largo poco più di mezzo blocco: un raggio di 1.1 blocchi voleva dire
    // spostare la vegetazione che sta a mezzo blocco di distanza dal suo fianco, cioè
    // toccarla senza toccarla. Adesso il bordo dell'influenza sta appena fuori
    // dal corpo: si muove quello che il gatto sfiora davvero.
    this.mobile = { x: pos.x, y: pos.y, z: pos.z, r: 0.60 };
    // IL CONGEDO SI MISURA DALLA CAMERA, non dal giocatore. L'avevo scritto al
    // contrario e a schermo il prato spariva del tutto: in vista a diorama la
    // camera sta a sessanta blocchi e guarda terreno lontano DAL GIOCATORE, che
    // con la misura sbagliata risultava tutto oltre la soglia. Quello che conta
    // e' quanto e' lontano dall'OCCHIO, perche' e' li' che una lamella diventa
    // piu' piccola di un pixel.
    this.occhio = occhio || pos;
    this.centro = pos;
    // IL BORDO DEL CAMPO. Il ring seminato e' un QUADRATO di chunk attorno al
    // giocatore: il cerchio inscritto ha raggio raggioChunk·CHUNK, ed e' li' che
    // il prato finisce di sicuro in tutte le direzioni. Si spegne prima di
    // arrivarci, se no si vede il muro.
    const bordo = this.raggioChunk * CHUNK;
    this.bordo = { da: bordo * 0.55, a: bordo * 0.92 };
    // e dalla camera: piu' corto, perche' qui il motivo e' la dimensione a
    // schermo e non l'esistenza
    this.sfuma = { da: bordo * 0.62, a: bordo * 0.98 };

    const ccx = Math.floor(pos.x / CHUNK), ccz = Math.floor(pos.z / CHUNK);
    if (ccx !== this._ccx || ccz !== this._ccz) {
      this._ccx = ccx; this._ccz = ccz;
      this._apriCoda(ccx, ccz);
    }
    // UN BUDGET DI TEMPO, NON UN NUMERO DI CHUNK. È la differenza fra sperare e
    // sapere: «due chunk per frame» è un tetto sul CONTEGGIO, e i chunk non
    // costano uguale — uno pieno d'erba costa dieci volte uno di roccia, e uno
    // già in cache costa una memcpy. Il tetto sul conteggio lasciava passare
    // picchi da tre millisecondi e mezzo (misurati camminando sul mondo aperto);
    // il tetto sul TEMPO li taglia dove sono, e nelle passate fatte di sole
    // copie fa scorrere la coda molto più in fretta di prima.
    //
    // SEMPRE ALMENO UNO, altrimenti su un dispositivo lentissimo il budget
    // sarebbe già finito prima di cominciare e la coda non scorrerebbe mai.
    const t0 = performance.now();
    let fatti = 0;
    while (this._coda.length && (fatti === 0 || performance.now() - t0 < BUDGET_MS)) {
      const c = this._coda.shift();
      this._seminaChunk(mondo, c.kc, c.dc);
      fatti++;
    }
    if (!this._coda.length && this._n !== this.fili) this._scambia();
    // ⚠ UN PACCHETTO SOLO, non venti uniform. La semina calcola grandezze di
    // GIOCO (dove tira il vento, dove sta l'occhio, dove finisce il campo) e le
    // consegna; tradurle in uniform è mestiere del motore. È lo stesso confine
    // del mesher, e vale per la stessa ragione: qui dentro si deve poter
    // ragionare senza sapere che esiste una GPU.
    _r.animaPrato(this.prato, this);
  }

  /** Il mondo è cambiato sotto i piedi (blocco posato, mondo nuovo). */
  /** Un ciuffo MESSO A MANO in questa cella (il furni «Ciuffo d'erba»). */
  posa(x, y, z) {
    this._posati.set(chiaveCella(x, z), { y });
    this._verPosati++;
    this.risemina();
  }

  /** Via il ciuffo messo a mano. */
  togliPosa(x, z) {
    if (!this._posati.delete(chiaveCella(x, z))) return;
    this._verPosati++;
    this.risemina();
  }

  risemina() { this._ccx = 1e9; this._ccz = 1e9; }

  imposta(on) {
    this.attiva = !!on;
    _r.mostraPrato(this.prato, this.attiva);
    if (this.attiva) this.risemina();
  }
}

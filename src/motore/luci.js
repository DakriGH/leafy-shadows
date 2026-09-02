// LE LUCI — sfere, non lampade.
//
// ⚠ NON SONO LUCI DEL MOTORE, ED È UNA SCELTA OBBLIGATA DA COME FUNZIONA LO
// STILE. Lo stile piatto legge l'ombra del sole da `diffuseBase`, cioè
// dall'accumulo delle luci della scena (vedi `stile.js`): ci basta perché c'è
// UNA SOLA luce, la direzionale. Aggiungerci dei punti luce vorrebbe dire
// sommare il loro contributo dentro quello stesso numero — e il numero smette
// di essere il fattore d'ombra. La legge dello stile si romperebbe alla prima
// lampada accesa.
//
// Quindi i lampioni li facciamo noi, e va bene così anche esteticamente: in
// Leafy una lampada non è una luce fisica, è una SFERA DI INFLUENZA con caduta
// A GRADINI. Nessuna rampa continua, nessuna specularità: un alone netto, come
// tutto il resto.
//
// ⚠ E QUANDO SARANNO TANTE, la strada è il «clustered lighting» di Babylon 9
// (`ClusteredLightContainer`, accelerato via WebGPU — verificato che c'è). Fino
// a un paio di dozzine questo costa meno: sono due array di uniform e un ciclo
// corto nel fragment, senza nessuna struttura da tenere aggiornata.

/**
 * ⚠ IL TETTO È COTTO NELLA COMPILAZIONE, e non può non esserlo: in GLSL il
 * limite di un ciclo dev'essere costante. Ventiquattro è quello che serve a un
 * villaggio; oltre, si passa alle luci clusterizzate invece di alzarlo.
 */
export const LUCI_MAX = 24;

/** I gradini dell'alone. Gli stessi dell'ombra: è la stessa nettezza. */
export const BANDE_LUCE = 3;

/** ⚠ DEVE ESSERE LO STESSO ESPONENTE DI `stile.js` (GAMMA). Sta scritto due
 *  volte perché importarlo creerebbe un anello — `stile.js` importa questo
 *  file. Se un giorno divergono, le lampade saranno l'unica cosa fuori posto e
 *  non si capirà perché: è il tipo di legame che va detto, non nascosto. */
const GAMMA_LUCI = 2.2;

// ⚠ LE COSTANTI DEL CAMMINO VENGONO DAL MONDO, NON DA QUI. `src/world/luce.js`
// tiene la griglia dei muri, il numero massimo di passi e la soglia che decide
// cosa ferma una lampada: sono le stesse costanti su cui è tarato il gemello in
// JS (`GrigliaLuce.occluso`), che è l'unico modo di provare senza GPU la cosa da
// cui dipende tutto l'aspetto delle ombre. Riscriverle qui vorrebbe dire due
// verità che divergono al primo ritocco.
import { PASSI_MAX, SCARTO_OMBRA, FERMA_LUME } from '../world/luce.js';

export class Luci {
  constructor() {
    // ⚠ ARRAY PIATTI, non elenchi di Vector4, e non è un vezzo: le uniform di
    // tipo array si legano con `setArray4`, che vuole un array piatto di
    // numeri. Tenerli già così toglie una conversione per fotogramma e — più
    // importante — toglie il dubbio su quale sia la copia buona.
    this.pos = new Float32Array(LUCI_MAX * 4);   // (x, y, z, raggio)
    this.col = new Float32Array(LUCI_MAX * 3);
    /**
     * CHI PROIETTA OMBRA, 1 o 0 per lampada.
     *
     * ⚠ SONO DUE CLASSI, non una manopola, ed è la distinzione di Lantern:
     *  · PESANTE (1): ferma sui muri. Cammina la griglia per ogni pixel dentro
     *    la sua pozza — è il termine più caro del fragment, e si paga solo lì.
     *  · LEGGERA (0): trapassa tutto, costa una distanza. È quella dei fuochi
     *    fatui e degli effetti, che si muovono e non devono costare niente.
     * Il difetto di prima era che TUTTE erano leggere: i lampioni illuminavano
     * attraverso l'isola, e con tredici lampioni sovrapposti la notte diventava
     * giorno. Non era l'ambiente sbagliato — misurato: spegnendo le lampade il
     * buio era esatto (79 contro 96 previsti).
     */
    this.ombra = new Float32Array(LUCI_MAX);
    /**
     * I SEMI-LATI DELLA SORGENTE — ed è così che si fanno le luci «ad area» e
     * «quadrate» senza aggiungere nemmeno una primitiva.
     *
     * ⚠ UNA SOLA FORMA, QUATTRO USI. La distanza da una SCATOLA con semi-lati
     * (hx, hy, hz) degrada in tutto quello che serve:
     *   · (0, 0, 0)   un punto      → la lampada di sempre
     *   · (L, 0, 0)   un segmento   → un neon, una striscia
     *   · (L, 0, W)   un rettangolo → una luce ad AREA, un lucernario
     *   · (a, b, c)   una scatola   → una luce QUADRATA, un blocco che brilla
     * Tre primitive separate sarebbero stati tre rami nel ciclo più caldo del
     * fragment; così è un `max` e una sottrazione, che il punto paga uguale.
     *
     * ⚠ E SONO ALLINEATE AGLI ASSI, dichiarato: in un mondo di cubi tutto è
     * allineato, e una rotazione costerebbe una matrice per luce per pixel. Il
     * giorno che servirà un neon in diagonale, quel giorno si paga.
     */
    this.est = new Float32Array(LUCI_MAX * 4);
    /** Quanti slot sono in uso (compresi i buchi): è il limite del ciclo. */
    this.quante = 0;
    /** chiave → indice, per chi deve poter spegnere quella che ha acceso. */
    this._perChiave = new Map();
  }

  /**
   * Accende una lampada. Torna il suo indice, o -1 se non c'è più posto.
   *
   * ⚠ GLI INDICI NON SI SPOSTANO MAI, ed è una scelta contro un difetto che
   * sarebbe arrivato di sicuro. Compattando l'array a ogni spegnimento, ogni
   * indice tenuto da qualcun altro punterebbe alla lampada sbagliata — lo zoo
   * tiene gli indici delle luci in moto, e le avrebbe viste saltare da una
   * all'altra rompendo un blocco a caso dall'altra parte della mappa. Quindi
   * uno slot spento resta lì con raggio zero (lo shader lo salta con un
   * confronto) e il prossimo `accendi` lo riusa.
   */
  accendi({ x, y, z, raggio = 7, colore = [1.0, 0.86, 0.62], forza = 1, ombra = true,
            semiLati = null, chiave = null }) {
    let i = -1;
    for (let k = 0; k < this.quante; k++) if (this.pos[k * 4 + 3] <= 0) { i = k; break; }
    if (i < 0) {
      if (this.quante >= LUCI_MAX) return -1;
      i = this.quante++;
    }
    this.pos.set([x, y, z, raggio], i * 4);
    // ⚠ IL COLORE SI DECODIFICA QUI, UNA VOLTA SOLA. I colori si scrivono in
    // spazio di VISUALIZZAZIONE — `0xffd889` nella tabella dei blocchi, `[1,
    // 0.35, 0.30]` nello zoo — perché è così che un umano sceglie un colore. Ma
    // lo shader somma le pozze in spazio LINEARE (vedi `stile.js`), e sommare
    // valori compressi è proprio il difetto che sbiancava le sovrapposizioni.
    // Convertire qui costa una volta per accensione invece che per pixel.
    this.col.set([
      Math.pow(colore[0], GAMMA_LUCI) * forza,
      Math.pow(colore[1], GAMMA_LUCI) * forza,
      Math.pow(colore[2], GAMMA_LUCI) * forza,
    ], i * 3);
    this.ombra[i] = ombra ? 1 : 0;
    this.est.set(semiLati ? [semiLati[0], semiLati[1], semiLati[2], 0] : [0, 0, 0, 0], i * 4);
    if (chiave !== null) this._perChiave.set(chiave, i);
    return i;
  }

  /** Spegne una lampada per indice. Il buco resta e verrà riusato. */
  spegni(i) {
    if (i < 0 || i >= this.quante) return false;
    this.pos[i * 4 + 3] = 0;
    this.col[i * 3] = this.col[i * 3 + 1] = this.col[i * 3 + 2] = 0;
    this.ombra[i] = 0;
    // ⚠ SI ACCORCIA SOLO DALLA CODA: togliendo l'ultima, il ciclo dello shader
    // fa un giro in meno per pixel. In mezzo no, se no gli indici si spostano.
    while (this.quante > 0 && this.pos[(this.quante - 1) * 4 + 3] <= 0) this.quante--;
    return true;
  }

  /** Spegne la lampada registrata con questa chiave (una cella, di solito). */
  spegniChiave(k) {
    const i = this._perChiave.get(k);
    if (i === undefined) return false;
    this._perChiave.delete(k);
    return this.spegni(i);
  }

  haChiave(k) { return this._perChiave.has(k); }

  spegniTutte() {
    this.pos.fill(0); this.col.fill(0); this.ombra.fill(0); this.est.fill(0);
    this.quante = 0;
    this._perChiave.clear();
  }

  /** Quante sono accese davvero (i buchi non contano). */
  get accese() {
    let n = 0;
    for (let i = 0; i < this.quante; i++) if (this.pos[i * 4 + 3] > 0) n++;
    return n;
  }

  /**
   * Le posizioni COME LE VEDE LO SHADER.
   *
   * ⚠ E NON SONO QUELLE DEL MONDO. Il motore gira con `useLargeWorldRendering`
   * (vedi `motore.js`), che accende l'ORIGINE MOBILE: le posizioni arrivano allo
   * shader già traslate, con la camera sull'origine. Quindi `vPositionW` non è
   * la posizione nel mondo — è quella relativa alla camera.
   *
   * Passando le luci in coordinate assolute, la distanza usciva sbagliata di
   * tutta la posizione della camera: le lampade non illuminavano niente, e
   * quella di prova «funzionava» solo perché l'avevo messa addosso al giocatore,
   * cioè dove l'errore è quasi zero. Un difetto che si nasconde proprio nel caso
   * con cui lo si prova.
   *
   * ⚠ L'avevo pure scritto, accendendo l'origine mobile: «cambia il significato
   * delle coordinate dentro gli shader, accenderla a materiali scritti vorrebbe
   * dire ri-verificarli tutti». Poi ho scritto un materiale nuovo e non l'ho
   * verificato.
   */
  perLoShader(camera) {
    if (!this._rel || this._rel.length !== this.pos.length) this._rel = new Float32Array(this.pos.length);
    const cx = camera.position.x, cy = camera.position.y, cz = camera.position.z;
    for (let i = 0; i < this.quante; i++) {
      const o = i * 4;
      this._rel[o] = this.pos[o] - cx;
      this._rel[o + 1] = this.pos[o + 1] - cy;
      this._rel[o + 2] = this.pos[o + 2] - cz;
      this._rel[o + 3] = this.pos[o + 3];
    }
    return this._rel;
  }
}

/**
 * IL PEZZO DI GLSL, e sta qui accanto ai dati apposta: chi cambia il numero di
 * luci o la legge della caduta trova le due cose nello stesso file.
 *
 * ⚠ LA CADUTA È LINEARE E IL TAGLIO È «ceil», COPIATI DA LANTERN RIGA PER RIGA,
 * e le due cose insieme sono la ragione per cui la pozza si vede. Avevo scritto
 * una caduta al quadrato tagliata con «floor(q·3 + 0.5)», che sembra la stessa
 * cosa e non lo è: con l'arrotondamento al più vicino tutto ciò che sta sotto un
 * sesto va a ZERO, cioè la pozza muore a tre quinti scarsi del raggio, e col
 * quadrato ancora prima — a cinque blocchi su otto e mezzo.
 *
 * Con «ceil» invece qualunque punto DENTRO il raggio prende almeno un gradino:
 * la pozza riempie esattamente il raggio scritto, e i tre gradini si dispongono
 * in tre anelli concentrici larghi uguali. Il raggio torna a voler dire quello
 * che dice.
 *
 * ⚠ E IO AVEVO CURATO IL SINTOMO: visto che le lampade non si vedevano, avevo
 * alzato il raggio da 8,5 a 14 e scritto in un commento la formula del difetto
 * come se fosse una legge di natura («il raggio è quanto illumina PRIMA che i
 * gradini la spengano»). Era una mia svista descritta con cura.
 *
 * ⚠ NIENTE N·L. Una luce-sfera di Leafy illumina in base a DOVE SEI, non a come
 * sei girato: è un alone, non una lampadina fisica. Metterci il prodotto scalare
 * darebbe le facce laterali dei cubi scure dentro la pozza di luce, che è
 * esattamente l'ombreggiatura «semi realistica» che lo stile rifiuta.
 *
 * ⚠ E SI SOMMA DOPO L'OMBRA, non dentro: una lampada accesa deve illuminare
 * anche quello che sta all'ombra del sole. È il motivo per cui di notte, in
 * Leafy, sotto un lampione si vede.
 */
/**
 * IL CAMMINO NELLA GRIGLIA DEI MURI — perché una lampada non attraversi un muro.
 *
 * ⚠ È IL PEZZO CHE MANCAVA PER «RENDERLE COME QUELLE DI LANTERN». La formula
 * della pozza l'avevo già ricopiata (caduta lineare, taglio con `ceil`) e non
 * bastava: guardando la notte, le pozze dei tredici lampioni passavano attraverso
 * l'isola e si sommavano dall'altra parte. Una sfera è solo una distanza — non
 * sa niente dei muri. Questo le dà l'unica cosa che le mancava.
 *
 * IL METODO è la marcia di Amanatides-Woo, la stessa di `gioco/mira.js`: si
 * avanza sempre verso il confine di cella più vicino, quindi si visitano
 * ESATTAMENTE le celle attraversate dal raggio — non una di più (ombre più
 * grasse del vero) né una di meno (luce che passa negli spigoli).
 *
 * ⚠ E IL BORDO È ESATTO, non approssimato: cade AL PIXEL sullo spigolo del cubo
 * che lo proietta. Niente mappa d'ombra, niente reticolo di texel sul ricevente,
 * niente bias da tarare — non c'è nessuna distanza cotta da confrontare, quindi
 * non c'è l'acne che un bias cura. In un gioco a blocchi i gradini che restano
 * sono i cubi veri, e si leggono come voluti. È il contrario di quello che
 * facciamo per il sole, ed è giusto così: il sole illumina tutto lo schermo e
 * non può permettersi un cammino per pixel; una lampada lo paga solo dentro la
 * sua pozza.
 *
 * ⚠ IL GEMELLO IN JS È `GrigliaLuce.occluso` (world/luce.js) e le due devono
 * restare identiche: è l'unico modo di provare senza GPU la cosa da cui dipende
 * tutto l'aspetto delle ombre delle lampade.
 *
 * ⚠ E QUI SI TORNA IN COORDINATE DI MONDO. `vPositionW` è relativo alla camera
 * (origine mobile, vedi `perLoShader`), ma le celle della griglia sono indici
 * assoluti: si somma `uCamPos`. È l'unico punto del progetto che disfa
 * l'origine mobile, e va detto — a mondi molto grandi è il primo conto che
 * perde precisione. Ai nostri (±768 blocchi) float32 risolve 6·10⁻⁵ di blocco:
 * quattro ordini di grandezza di margine.
 */
export const GLSL_OMBRA_VOXEL = `
  // Il byte della cella, 0.0 fuori dalla griglia. ⚠ FUORI NON È MURO, È ARIA
  // APERTA: la regola opposta darebbe un guscio nero attorno al mondo.
  // ⚠ «texelFetch» e non «texture»: indirizzamento INTERO — niente mezzo texel
  // da aggiungere, niente normalizzazione, niente filtro da spegnere.
  float voxVal(ivec3 c) {
    ivec3 i = c - ivec3(uVoxMin.xyz);
    if (i.x < 0 || i.y < 0 || i.z < 0) return 0.0;
    if (float(i.x) >= uVoxDim.x || float(i.y) >= uVoxDim.y || float(i.z) >= uVoxDim.z) return 0.0;
    // l'ordine è (z, y, x): è il contratto di layout scritto in world/luce.js
    return texelFetch(uVox, ivec3(i.z, i.y, i.x), 0).r;
  }

  // FERMA UNA LAMPADA: muri, buccia del terreno e gli ingombri OPACHI, cioè i
  // mobili che non portano una sorgente — un albero fa ombra alla luce del
  // lampione accanto. Resta fuori solo l'ingombro di CHI la luce ce l'ha
  // addosso: la sua lampada sta dentro il proprio palo e si murerebbe da sola.
  bool voxPieno(ivec3 c) { return voxVal(c) > ${(FERMA_LUME / 255 - 0.5 / 255).toFixed(4)}; }

  bool ombraVoxel(vec3 lampada, vec3 dir, float dist) {
    vec3 passo = vec3(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0, dir.z >= 0.0 ? 1.0 : -1.0);
    // il max evita la divisione per zero sugli assi: 1e8 si comporta da infinito
    vec3 inv = 1.0 / max(abs(dir), vec3(1e-8));
    vec3 f = lampada - floor(lampada);
    vec3 prossimo = ((passo * 0.5 + 0.5) - passo * f) * inv;
    ivec3 c = ivec3(floor(lampada));
    ivec3 ipasso = ivec3(passo);
    // ⚠ IL RAGGIO SI FERMA UN MILLESIMO DI CELLA PRIMA del frammento: il
    // frammento sta SULLA faccia di un blocco, cioè esattamente sul confine
    // della sua cella, e senza questo scarto il rumore di virgola mobile lo
    // farebbe finire ogni tanto DENTRO il solido che lo porta.
    float limite = dist - ${SCARTO_OMBRA.toFixed(5)};
    for (int k = 0; k < ${PASSI_MAX}; k++) {
      float t;
      if (prossimo.x <= prossimo.y && prossimo.x <= prossimo.z) { t = prossimo.x; c.x += ipasso.x; prossimo.x += inv.x; }
      else if (prossimo.y <= prossimo.z)                        { t = prossimo.y; c.y += ipasso.y; prossimo.y += inv.y; }
      else                                                      { t = prossimo.z; c.z += ipasso.z; prossimo.z += inv.z; }
      if (t >= limite) return false;               // arrivati senza incontrare niente
      if (voxPieno(c)) return true;
    }
    return false;
  }
`;

/**
 * L'ACCUMULO DELLE LAMPADE, in due varianti.
 *
 * ⚠ E SONO DUE STRINGHE, NON UN `if`, ed è la lezione mobile di Leafy-Lantern
 * scritta là per esteso: «SPEGNERE UNA COSA CON UN if NON LA SPEGNE». Su una
 * GPU MOBILE il compilatore riserva i registri per il caso peggiore anche nei
 * rami che non esegue, e con tanti registri per thread scendono i thread in
 * volo: lo shader va piano ANCHE quando non fa niente. È il motivo per cui
 * laggiù abbassare la risoluzione non spostava gli fps — non erano i pixel, era
 * l'occupancy. E il cammino nei voxel è il termine più caro del nostro
 * fragment: misurato su Mali-G68, in Lantern, ~30% degli fps.
 *
 * Quindi con `conOmbre = false` il cammino non c'è proprio: niente `texelFetch`,
 * niente ciclo da ventotto passi, niente registri riservati.
 *
 * ⚠ E SI DECIDE ALLA CREAZIONE DEL MATERIALE, non a caldo. Verificato leggendo
 * il sorgente e provandolo: `CustomMaterial.Builder` mette il sorgente in cache
 * e torna subito se lo trova; e anche svuotando quella cache il motore tiene
 * l'effetto già compilato — misurato, il sorgente a schermo non cambia.
 */
/**
 * @param curva  espressione GLSL (float) che STRINGE o ALLARGA la banda della
 *               lampada per materia — `curva` in world/materie.js: +1 metallo
 *               (banda stretta, «duro e lucido»), −1 fango (larga e smorzata).
 *               `null` = niente termine: la caduta lineare di sempre, senza
 *               nemmeno un `pow` per chi non ha materie (erba, acqua, modelli).
 */
export function glslAccumuloLuci(conOmbre, curva = null) {
  const caduta = curva ? `pow(1.0 - d / lampada.w, exp2(${curva}))` : '1.0 - d / lampada.w';
  return `
  vec3 lampade = vec3(0.0);
  for (int i = 0; i < ${LUCI_MAX}; i++) {
    if (float(i) >= uLuciNum) break;
    vec4 lampada = uLuciPos[i];
    if (lampada.w <= 0.0) continue;
    vec3 dv = vPositionW - lampada.xyz;
    // ⚠ MAI NOMI DI UNA LETTERA IN GLSL INNESTATO: Babylon, nel blocco della
    // nebbia, emette «#define E 2.71828». Il preprocessore non conosce ambiti.
    vec3 semiLati = uLuciEst[i].xyz;
    // ⚠ LA DISTANZA È DALLA SCATOLA, NON DAL CENTRO: coi semi-lati a zero il
    // conto ritorna «length(dv)», cioè la lampada a punto, senza un ramo. È
    // così che si fanno le luci ad area, i neon e quelle quadrate con una
    // primitiva sola.
    vec3 fuori = max(abs(dv) - semiLati, vec3(0.0));
    float d2 = dot(fuori, fuori);
    if (d2 >= lampada.w * lampada.w) continue;
    float d = sqrt(d2);
${conOmbre ? `    // ⚠ IL CAMMINO SI PAGA SOLO DENTRO LA SFERA E SOLO SE LA LAMPADA È PESANTE:
    // il costo segue la SOVRAPPOSIZIONE delle pozze, non il numero di lampade a
    // schermo — un pixel dentro una sola pozza cammina una volta sola, per lunga
    // che sia la fila di lampioni.
    // ⚠ E PARTE DAL PUNTO PIÙ VICINO DELLA SCATOLA: da una luce ad area il
    // raggio d'ombra deve nascere sul pannello, se no un neon lungo sei blocchi
    // proietterebbe come se fosse tutto nel suo punto di mezzo.
    if (uVoxMin.w > 0.5 && uLuciOmbra[i] > 0.5 && d > 1e-4) {
      vec3 sorgente = lampada.xyz + clamp(dv, -semiLati, semiLati);
      if (ombraVoxel(sorgente + uCamPos, (vPositionW - sorgente) / d, d)) continue;
    }` : '    // (qui vive il cammino nei voxel: su mobile non viene compilato)'}
    float caduta = ${caduta};
    float banda = ceil(caduta * ${BANDE_LUCE.toFixed(1)}) / ${BANDE_LUCE.toFixed(1)};
    lampade += uLuciCol[i] * banda;
  }
`;
}

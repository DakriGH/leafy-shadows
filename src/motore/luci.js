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

export class Luci {
  constructor() {
    // ⚠ ARRAY PIATTI, non elenchi di Vector4, e non è un vezzo: le uniform di
    // tipo array si legano con `setArray4`, che vuole un array piatto di
    // numeri. Tenerli già così toglie una conversione per fotogramma e — più
    // importante — toglie il dubbio su quale sia la copia buona.
    this.pos = new Float32Array(LUCI_MAX * 4);   // (x, y, z, raggio)
    this.col = new Float32Array(LUCI_MAX * 3);
    this.quante = 0;
    this._elenco = [];
  }

  /** Accende una lampada. Torna il suo indice, o -1 se non c'è più posto. */
  accendi({ x, y, z, raggio = 7, colore = [1.0, 0.86, 0.62], forza = 1 }) {
    if (this.quante >= LUCI_MAX) return -1;
    const i = this.quante++;
    this.pos.set([x, y, z, raggio], i * 4);
    this.col.set([colore[0] * forza, colore[1] * forza, colore[2] * forza], i * 3);
    this._elenco.push({ x, y, z, raggio });
    return i;
  }

  spegniTutte() {
    this.pos.fill(0); this.col.fill(0);
    this.quante = 0;
    this._elenco.length = 0;
  }

  get elenco() { return this._elenco; }

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
 * ⚠ NIENTE N·L. Una luce-sfera di Leafy illumina in base a DOVE SEI, non a come
 * sei girato: è un alone, non una lampadina fisica. Metterci il prodotto scalare
 * darebbe le facce laterali dei cubi scure dentro la pozza di luce, che è
 * esattamente l'ombreggiatura «semi realistica» che lo stile rifiuta.
 *
 * ⚠ E SI SOMMA DOPO L'OMBRA, non dentro: una lampada accesa deve illuminare
 * anche quello che sta all'ombra del sole. È il motivo per cui di notte, in
 * Leafy, sotto un lampione si vede.
 */
export const GLSL_LUCI_ACCUMULO = `
  vec3 lampade = vec3(0.0);
  for (int i = 0; i < ${LUCI_MAX}; i++) {
    if (float(i) >= uLuciNum) break;
    vec4 L = uLuciPos[i];
    if (L.w <= 0.0) continue;
    float d = distance(vPositionW, L.xyz);
    if (d >= L.w) continue;
    float q = 1.0 - d / L.w;
    q = q * q;
    // a gradini, con la stessa costante dell'ombra: la nettezza è una sola
    q = floor(q * ${BANDE_LUCE.toFixed(1)} + 0.5) / ${BANDE_LUCE.toFixed(1)};
    lampade += uLuciCol[i] * q;
  }
`;

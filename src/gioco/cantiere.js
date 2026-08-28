// IL CANTIERE — rompere, posare, e le lampade che si accendono da sole.
//
// ⚠ NON SA CHE ESISTE UN MOTORE né un mouse: riceve un mondo, una cella e un
// tipo, e cambia il mondo. Chi traduce un clic in una cella è `main.js`; chi
// ridisegna il chunk è il mesher, che si accorge da solo (`mondo.sporchi`).
//
// ⚠ E LE LAMPADE LE DICE LA TABELLA DEI BLOCCHI, non questo file. In
// `world/blocks.js` un blocco può dichiarare `luce: { colore, raggio,
// intensita, ombra }` — è la regola di Lantern, «la tabella dice COSA, il
// modulo fa» — quindi qui non c'è nessun elenco di quali blocchi illuminano:
// c'è una riga che legge quel campo. Aggiungere una lampada nuova al gioco
// vuol dire aggiungere una riga alla tabella e nient'altro.

import { defDi } from '../world/blocks.js';

/**
 * LA CASSETTA DEGLI ATTREZZI, cioè cosa si può posare.
 *
 * ⚠ TABELLA, NON `if` SPARSI. Ci sono i materiali di base, e poi le lampade —
 * che sono il motivo per cui questa cosa è interessante da provare: si posa un
 * blocco e la stanza si illumina.
 */
export const CASSETTA = [
  // ⚠ IL PRIMO POSTO È LA MANO VUOTA, e non è un buco nell'elenco: è uno
  // strumento. Con la mano vuota si ROMPE e si INTERAGISCE; con un blocco in
  // mano si POSA. È la regola di Lantern («tocco = usa quello che hai in
  // mano»), ed è l'unica che funziona uguale col mouse e col dito — su un
  // telefono un «tasto destro» non esiste.
  null,
  'erba', 'terra', 'pietra', 'mattoni', 'legno', 'sabbia', 'neve',
  'lanaRossa', 'lanaBlu', 'lanaGialla',
  'lampadaPesante', 'lampadaRossa', 'lampadaVerde', 'lampadaBlu', 'lucciola',
  // ⚠ E ANCHE LE DECORAZIONI, perché sono blocchi come gli altri: da quando
  // alberi e lampioni vivono nel mondo (`world/decorazioni.js`) non c'è nessuna
  // ragione per cui debbano avere una strada tutta loro per essere posati.
  'albero', 'lampione', 'ciuffo',
];

/**
 * COSA FARÀ IL PROSSIMO CLIC — e si decide qui, in un posto solo.
 *
 * ⚠ È LA CORREZIONE AL DIFETTO CHE IL COMMITTENTE HA VISTO: «hai usato il tasto
 * sinistro e destro per piazzare, ma è anche il modo che uso per muovere la
 * telecamera». Il problema vero non erano i tasti — era che l'azione dipendeva
 * dal TASTO invece che da quello che si ha in mano. Con i tasti, su un telefono
 * non c'è niente da premere; con la mano, la regola è una e vale ovunque.
 *
 * L'ordine conta: un lampione vince sempre, anche con un blocco in mano —
 * altrimenti per accendere una luce bisognerebbe prima svuotarsi le mani, che è
 * esattamente il genere di passaggio che nessuno indovina.
 */
export function azione(tipoInMano, bersaglioInterattivo) {
  if (bersaglioInterattivo) return 'interagisci';
  return tipoInMano ? 'posa' : 'rompi';
}

/** Come si chiama, per scriverlo accanto al mirino. */
export const NOME_AZIONE = { interagisci: 'accendi', posa: 'posa', rompi: 'rompi' };

/** 0xRRGGBB → [r, g, b] in 0..1. */
export function daEsadecimale(n) {
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** La chiave con cui una cella si ricorda la sua lampada. */
const chiaveCella = (x, y, z) => `${x},${y},${z}`;

export class Cantiere {
  /**
   * @param mondo  la griglia
   * @param luci   il registro delle lampade (`rig.luci`) — o null per non averne
   */
  constructor(mondo, luci = null) {
    this.mondo = mondo;
    this.luci = luci;
    this.scelto = 0;
    /** Chi ha rotto/posato cosa, per dirlo a schermo. */
    this.ultimo = null;
  }

  get tipoScelto() { return CASSETTA[this.scelto]; }
  get nomeScelto() { return this.tipoScelto ? defDi(this.tipoScelto).nome : 'mano vuota'; }
  get manoVuota() { return !this.tipoScelto; }

  /** Cosa farà il prossimo clic, dato cosa si sta guardando. */
  azione(bersaglioInterattivo) { return azione(this.tipoScelto, bersaglioInterattivo); }

  scegli(i) { this.scelto = ((i % CASSETTA.length) + CASSETTA.length) % CASSETTA.length; }

  /**
   * ROMPE il blocco in questa cella.
   * ⚠ E SPEGNE LA SUA LAMPADA, che è la metà che si dimentica: senza, si rompe
   * il lampione e la pozza di luce resta lì a mezz'aria. Un difetto che si vede
   * solo di notte, cioè quello che sfugge alle prove fatte di giorno.
   */
  rompi(x, y, z) {
    const t = this.mondo.tipo(x, y, z);
    if (t === null) return null;
    this.mondo.togli(x, y, z);
    if (this.luci) this.luci.spegniChiave(chiaveCella(x, y, z));
    this.ultimo = { azione: 'rotto', tipo: t, cella: [x, y, z] };
    return t;
  }

  /**
   * POSA il blocco scelto in questa cella, e se è una lampada la accende.
   *
   * ⚠ LA LUCE STA AL CENTRO DELLA CELLA, non al suo angolo: `metti` ragiona per
   * celle intere, la luce per punti nello spazio, e sbagliando di mezzo blocco
   * la pozza esce storta rispetto al blocco che la fa — di poco, quel tanto che
   * si nota senza capire perché.
   */
  posa(x, y, z, tipo = this.tipoScelto) {
    if (!tipo) return false;                 // ⚠ con la mano vuota non si posa
    if (this.mondo.pieno(x, y, z)) return false;
    this.mondo.metti(x, y, z, tipo);
    const def = defDi(tipo);
    if (this.luci && def.luce) {
      this.luci.accendi({
        x: x + 0.5, y: y + 0.5, z: z + 0.5,
        raggio: def.luce.raggio,
        colore: daEsadecimale(def.luce.colore),
        forza: def.luce.intensita ?? 1,
        chiave: chiaveCella(x, y, z),
      });
    }
    this.ultimo = { azione: 'posato', tipo, cella: [x, y, z] };
    return true;
  }
}

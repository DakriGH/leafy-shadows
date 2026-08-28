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
  'albero', 'lampione',
  // ⚠ E UN ATTREZZO, che non è un blocco: vedi `ATTREZZI`.
  'erbetta',
];

/**
 * GLI ATTREZZI — cose che si tengono in mano e NON sono blocchi.
 *
 * ⚠ L'ERBETTA È IL PRIMO, ed esiste per una correzione del committente: «è
 * sbagliato che il blocco d'erba e l'erbetta siano la stessa cosa, sono 2 cose
 * diverse». Vero: fino a ora i fili ERANO il blocco — crescevano su ogni blocco
 * d'erba e sparivano solo rompendolo. Non si poteva né rasare un prato né
 * piantare erba sulla pietra.
 *
 * ⚠ E FA LE DUE COSE CON UN GESTO SOLO: se la cella ha i fili li rasa, se non
 * li ha li pianta. Un attrezzo per piantare e uno per rasare sarebbero due
 * caselle e una scelta in più da fare ogni volta; così l'etichetta dice sempre
 * cosa succederà («pianta» o «rasa») e non c'è niente da ricordare.
 */
export const ATTREZZI = {
  erbetta: { nome: 'Erbetta', colore: 0x64bb4f, agisce: 'erba' },
};

/**
 * COSA FARÀ IL PROSSIMO CLIC — e si decide qui, in un posto solo.
 *
 * ⚠ QUESTA REGOLA L'HO SBAGLIATA UNA VOLTA, E AL CONTRARIO. Avevo scritto: con
 * la mano vuota si rompe, con un blocco in mano si accende. Committente: «non
 * c'è modo di interagire con gli oggetti, perché con la mano vuota il sinistro
 * rompe e il destro rompe». Aveva ragione: accendere una lampada richiedeva di
 * avere in mano un BLOCCO, che è l'ultima cosa che qualcuno prova.
 *
 * La regola giusta è che **l'interazione appartiene all'OGGETTO, non alla
 * mano**: una cosa che si accende, si accende — con qualunque cosa si abbia in
 * mano, come una porta o una leva in qualunque gioco. Quello che si ha in mano
 * decide solo cosa fare col resto del mondo.
 *
 * L'ordine, quindi:
 *  1. si sta DEMOLENDO (destro, o il piccone sul telefono) → rompi, sempre;
 *  2. il bersaglio si accende → accendi;
 *  3. mano vuota → rompi;
 *  4. blocco in mano → posa.
 *
 * ⚠ E IL PUNTO 1 VIENE PRIMA DEL 2 PER FORZA: se no un lampione non si potrebbe
 * più rompere, perché si accenderebbe e basta. È l'unico modo di togliere una
 * cosa interattiva.
 */
export function azione(tipoInMano, bersaglioInterattivo, demolisci = false, ciSonoFili = false) {
  if (demolisci) return 'rompi';
  // ⚠ UN ATTREZZO VIENE PRIMA DELL'INTERAZIONE: chi ha in mano l'erbetta e
  // clicca un lampione vuole piantare l'erba ai suoi piedi, non accenderlo.
  const a = ATTREZZI[tipoInMano];
  if (a && a.agisce === 'erba') return ciSonoFili ? 'rasa' : 'pianta';
  if (bersaglioInterattivo) return 'interagisci';
  return tipoInMano ? 'posa' : 'rompi';
}

/** Come si chiama, per scriverlo accanto al mirino. */
export const NOME_AZIONE = { interagisci: 'accendi', posa: 'posa', rompi: 'rompi',
                             pianta: 'pianta', rasa: 'rasa' };

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
  get nomeScelto() {
    const t = this.tipoScelto;
    if (!t) return 'mano vuota';
    return ATTREZZI[t] ? ATTREZZI[t].nome : defDi(t).nome;
  }
  get manoVuota() { return !this.tipoScelto; }
  /** ⚠ Un attrezzo NON si posa: `posa` lo rifiuta, e chi decide l'azione lo sa. */
  get attrezzo() { return ATTREZZI[this.tipoScelto] || null; }

  /** Cosa farà il prossimo clic, dato cosa si sta guardando. */
  azione(bersaglioInterattivo, demolisci, ciSonoFili) {
    return azione(this.tipoScelto, bersaglioInterattivo, demolisci, ciSonoFili);
  }

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
    if (!tipo || ATTREZZI[tipo]) return false;   // ⚠ né con la mano vuota né con un attrezzo
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

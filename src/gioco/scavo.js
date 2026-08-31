// LO SCAVO — rompere una cosa TENENDOLA PREMUTA, non cliccandola.
//
// ⚠ Committente: «la distruzione in particolare non deve essere mai istantanea,
// devi tenere premuto da touchscreen e da mobile come su Minecraft». E la
// versione prima di questa contava i CLIC, che è una cosa diversa e sbagliata
// per due ragioni che si sentono subito con le mani:
//   · a clic si può andare velocissimi, quindi «più colpi» non rallenta
//     davvero — rende solo il gesto più faticoso;
//   · e soprattutto NON si vede quanto manca. Con un tasto tenuto giù il tempo
//     scorre da solo, e la barra è il blocco stesso che si gonfia e trema.
//
// ⚠ SI MISURA IN TEMPO, NON IN FOTOGRAMMI. A 144 Hz e a 20 fps un blocco deve
// volerci lo stesso: se contassimo i giri, su un telefono lento tutto
// diventerebbe tre volte più duro proprio dove è già tutto più faticoso.
//
// ⚠ E QUI DENTRO NON C'È NESSUN MOTORE: è un cronometro con una chiave. Si prova
// in Node, che è l'unico modo di provare una cosa che dipende dal TEMPO senza
// stare a guardare uno schermo.

/** Quanto ci vuole a rompere qualcosa di normale, in millisecondi. */
export const DURATA = 550;
/** Ogni quanto salta via una manciata di schegge mentre si scava. */
export const SCHEGGE_OGNI = 130;

export class Scavo {
  constructor() {
    this.dove = null;        // la chiave del bersaglio, o null se non si scava
    this.durata = DURATA;
    this.inizio = 0;
    this._ultimeSchegge = 0;
  }

  /**
   * SI TIENE PREMUTO QUI. Da chiamare a ogni fotogramma finché il tasto è giù.
   *
   * ⚠ CAMBIARE BERSAGLIO RICOMINCIA DA ZERO, come in Minecraft: il progresso è
   * di QUEL blocco, non della mano. Se restasse, si potrebbe consumare mezzo
   * muro a spizzichi e poi buttarlo giù tutto con un tocco per blocco.
   */
  premi(chiave, durata, adesso) {
    if (this.dove !== chiave) {
      this.dove = chiave;
      this.durata = Math.max(60, durata || DURATA);
      this.inizio = adesso;
      this._ultimeSchegge = adesso;
    }
  }

  /** Il tasto è stato mollato (o il puntatore se n'è andato a ruotare). */
  molla() { this.dove = null; this.inizio = 0; }

  /** Da 0 a 1. Vale 0 se non si sta scavando niente. */
  progresso(adesso) {
    if (!this.dove) return 0;
    return Math.min(1, (adesso - this.inizio) / this.durata);
  }

  /** È arrivato in fondo? ⚠ Si azzera da sé: il bersaglio non esiste più. */
  finito(adesso) {
    if (!this.dove || this.progresso(adesso) < 1) return false;
    this.molla();
    return true;
  }

  /**
   * È ORA DI FAR SALTARE VIA UNA MANCIATA DI SCHEGGE?
   * ⚠ A TEMPO E NON A FOTOGRAMMI, per la stessa ragione di tutto il resto: a
   * 144 Hz uscirebbero sette volte più pezzetti che a 20, cioè lo stesso gesto
   * darebbe due effetti diversi secondo la macchina.
   */
  schegge(adesso) {
    if (!this.dove || adesso - this._ultimeSchegge < SCHEGGE_OGNI) return false;
    this._ultimeSchegge = adesso;
    return true;
  }
}

/**
 * QUANTO CI VUOLE A ROMPERE QUESTO.
 *
 * ⚠ LA SCALA RESTA CORTA — da mezzo secondo a poco più di uno. Questo è un gioco
 * in cui si costruisce, non uno in cui si sopravvive: la durezza serve a far
 * SENTIRE la differenza fra la terra e il cristallo, non a fare da tassa. Un
 * muro di venti blocchi a un secondo l'uno sono venti secondi, ed è già tanto.
 *
 * ⚠ E `salute` IN `blocks.js` NON È UN TEMPO: arriva a 100 e serve ad altro.
 * Usarla come millisecondi darebbe blocchi da un decimo di secondo e blocchi da
 * dieci. Qui si legge come una FASCIA, e le fasce sono tre.
 */
export function durataPer(def) {
  if (!def) return DURATA;
  if (def.salute >= 100) return 1100;          // cristallo, lampade: roba dura
  if (def.fam === 'mina') return 750;          // pietra, roccia: si scava
  if (def.fam === 'taglia') return 600;        // legno, foglie: si taglia
  return 380;                                  // terra, sabbia, erba: si sposta
}

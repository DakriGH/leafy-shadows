// LA SCALA DI QUALITÀ — quando scendere di un gradino, e quando risalire.
//
// ⚠ NON SA CHE ESISTE UN MOTORE, e questo è il punto: la parte difficile di una
// scala automatica non è applicare un livello, è DECIDERE. Quella decisione è
// aritmetica su una serie di fps, e si prova in Node — mentre l'unico modo di
// provarla a schermo sarebbe far scaldare una GPU per venti minuti sperando che
// oscilli.
//
// ⚠ E LA LOGICA È QUELLA DI LEAFY-LANTERN, ricopiata perché è già stata pagata.
// Là la prima versione non risaliva mai; la seconda risaliva e oscillava. Le due
// cure — l'isteresi e la MEMORIA DEL GRADINO CHE NON HA RETTO — sono il frutto
// di quel giro, e rifarle da capo vorrebbe dire rifare anche gli errori.

/** Quanti secondi si aspetta prima di cambiare di nuovo: la scena si assesta. */
export const ATTESA_CAMBIO = 2500;
/** Quante misure consecutive sotto soglia prima di scendere. Poche: chi soffre
 *  lo deve smettere di soffrire subito. */
export const CAMPIONI_GIU = 3;

/**
 * SOTTO QUESTA FRAZIONE DEL BERSAGLIO SI SCENDE SUBITO, e di più gradini.
 *
 * ⚠ SERVE PERCHÉ LA SCALA ERA TROPPO LENTA, e il committente l'ha vista sul suo
 * telefono: 23 fotogrammi al secondo e la qualità ferma a q1 su cinque. Non era
 * rotta — era che ogni gradino costa tre misure a 2,5 s l'una, cioè 7,5
 * secondi, e arrivare in fondo voleva dire trentasette secondi di gioco
 * ingiocabile. Nessuno aspetta trentasette secondi per vedere se migliora.
 *
 * Sotto questa soglia non c'è niente da confermare: una misura basta, e il salto
 * è proporzionale a quanto si è lontani. Sopra, la prudenza resta — scendere per
 * un singhiozzo isolato è il difetto opposto.
 *
 * ⚠ E NON PUÒ VALERE 0,5, che è quello che avevo scritto: `sogliaGiu` vale già
 * metà del bersaglio, quindi le due soglie coincidevano e il ramo PRUDENTE non
 * girava mai — qualunque calo diventava un crollo. L'ha trovato una prova che
 * si aspettava tre misure e ne vedeva bastare una. Con 0,4 la soglia cade sui
 * ventiquattro fotogrammi, che è il numero che questo file chiama già «sotto,
 * il gioco non è lento: è rotto».
 */
export const CROLLO = 0.4;
/** E quante sopra soglia prima di risalire. Tante: risalire è una scommessa. */
export const CAMPIONI_SU = 8;
/** Quanto si aspetta prima di riprovare un gradino che non ha retto. */
export const RIPROVA_MS = 60000;

/**
 * QUANTO SI IGNORA ALL'AVVIO, e va detto perché esiste.
 *
 * ⚠ I PRIMI SECONDI SONO SEMPRE BRUTTI, e non dicono niente sulla macchina:
 * si genera il mondo, si costruiscono le mesh (misurato: 456 ms), si compilano
 * gli shader, si semina l'erba. Una scala che guardasse lì dentro
 * precipiterebbe in fondo su qualunque computer, e poi ci resterebbe un minuto
 * per via della memoria del gradino fallito.
 *
 * ⚠ E PRIMA ERA UN CASO, non una scelta: `_ultimoCambio` partiva a zero e
 * l'attesa fra due cambi faceva da silenziatore per i primi 2,5 s. Funzionava,
 * ma nessuno l'aveva deciso — l'ha trovato una prova che si aspettava un
 * cambio e non lo vedeva. Adesso è una costante col suo nome.
 */
export const ATTESA_AVVIO = 4000;

export class Adattatore {
  /**
   * @param quanti      quanti livelli ha la scala
   * @param livello     da quale partire
   * @param hz          la frequenza dello schermo (per il bersaglio)
   */
  constructor({ quanti, livello = 0, hz = 60 } = {}) {
    this.quanti = quanti;
    this.livello = livello;
    this.hz = hz;
    this.manuale = false;
    this._giu = 0; this._su = 0;
    this._ultimoCambio = ATTESA_AVVIO - ATTESA_CAMBIO;
    this._livelloFallito = -1;
    this._quandoFallito = 0;
  }

  /**
   * IL BERSAGLIO NON È IL TETTO DELLO SCHERMO, ed è la correzione che conta.
   *
   * ⚠ Su un pannello a 144 Hz, puntare al tetto vuol dire non arrivarci mai e
   * scendere di qualità per sempre — mentre a sessanta fotogrammi stabili non
   * manca niente. Sopra i sessanta, i fotogrammi in più valgono meno della
   * qualità. Quindi il bersaglio è `min(tetto, 60)`: su un 60 Hz è il tetto, su
   * un 144 Hz è sessanta, e a cento fps si RISALE invece di restare in fondo.
   */
  get bersaglio() { return Math.min(this.hz > 0 ? this.hz : 60, 60); }
  /** ⚠ 0,92 e non 1: con la sincronia verticale «il tetto esatto» non arriva mai
   *  — si resta a 58 su 60 e la scala non risale più. */
  get sogliaSu() { return this.bersaglio * 0.92; }
  /** ⚠ E MAI SOTTO 24: sotto quella soglia il gioco non è lento, è rotto, e
   *  bisogna scendere anche su uno schermo lentissimo. */
  get sogliaGiu() { return Math.max(24, this.bersaglio * 0.5); }

  /**
   * Una misura di fps. Torna il livello NUOVO se è cambiato, altrimenti -1.
   * @param adesso i millisecondi (si passano da fuori: così si prova in Node)
   */
  osserva(fps, adesso) {
    if (this.manuale) return -1;
    if (adesso - this._ultimoCambio < ATTESA_CAMBIO) return -1;

    if (fps < this.sogliaGiu) { this._giu++; this._su = 0; }
    else if (fps >= this.sogliaSu) { this._su++; this._giu = 0; }
    else { this._giu = 0; this._su = 0; }   // in mezzo: si sta bene, fermi

    // ⚠ IL CROLLO NON SI CONFERMA, SI CURA. Con gli fps sotto metà del
    // bersaglio non c'è nessuna ambiguità da risolvere con altre due misure:
    // si scende, e di quanti gradini serve.
    const crollo = fps < Math.max(24, this.bersaglio * CROLLO);
    const bastano = crollo ? 1 : CAMPIONI_GIU;

    if (this._giu >= bastano && this.livello < this.quanti - 1) {
      // ⚠ SI RICORDA QUALE GRADINO NON HA RETTO. Senza, la scala oscilla: si
      // risale, il gradino di sopra non regge, si riscende, e qualche secondo
      // dopo si riprova — un su-e-giù continuo, che a schermo è la qualità che
      // sfarfalla. È il difetto che nasce insieme alla cura: prima non risaliva
      // MAI, e un difetto che non si vede sostituisce quello che si vede.
      this._livelloFallito = this.livello;
      this._quandoFallito = adesso;
      // ⚠ IL SALTO È PROPORZIONALE: a metà del bersaglio si scende di uno, a un
      // terzo di due, a un quarto di tre. Il tetto è tre perché oltre si
      // rischia di finire in fondo per un singhiozzo — e risalire costa otto
      // misure, cioè molto più che scendere di un gradino di troppo.
      const passi = Math.max(1, Math.min(3, Math.round(this.bersaglio / Math.max(fps, 1)) - 1));
      return this._vaiA(Math.min(this.quanti - 1, this.livello + passi), adesso);
    }
    if (this._su >= CAMPIONI_SU && this.livello > 0) {
      // il gradino che ha già fallito si riprova, ma dopo un minuto: la scena
      // può essere cambiata (si è usciti dal bosco, è finita la pioggia) e
      // allora vale la pena; riprovarlo subito è solo l'oscillazione.
      if (this.livello - 1 === this._livelloFallito && adesso - this._quandoFallito < RIPROVA_MS) {
        this._su = 0;
        return -1;
      }
      return this._vaiA(this.livello - 1, adesso);
    }
    return -1;
  }

  _vaiA(i, adesso) {
    this.livello = i;
    this._giu = this._su = 0;
    this._ultimoCambio = adesso;
    return i;
  }

  /** Fissa un livello a mano: da lì la scala non si muove più da sola. */
  fissa(i) {
    this.manuale = true;
    this.livello = Math.max(0, Math.min(this.quanti - 1, i));
    return this.livello;
  }

  /** Torna automatica. */
  libera() { this.manuale = false; this._giu = this._su = 0; }
}

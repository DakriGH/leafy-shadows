// L'OMEGA TEST — il banco a GRADINI, e cerca il ginocchio, non una cartolina.
//
// ⚠ IL COMMITTENTE: «facciamo l'omega test con luci colorate, migliaia di
// blocchi unici con texture uniche, migliaia di furniture con texture e
// materiali unici, deve essere perfetto. Così testiamo a fondo il framerate vero
// di sforzo su ogni dispositivo. Raggiungere il massimo degli fps e framepacing
// sarà fondamentale su ogni dispositivo anche quelli più scarsi, in vista
// dell'AR: render della camera + render in gioco in contemporanea + fisica +
// luci + multiplayer, insomma dovrà essere perfetto».
//
// ⚠ E PER QUESTO NON ACCENDE TUTTO INSIEME. Un banco che mette a schermo
// l'abominio intero e legge un numero risponde a una domanda inutile — «regge
// l'abominio?» — quasi sempre no, e non si impara niente. La domanda utile è
// DOVE SI ROMPE: a quale numero di modelli unici, di luci, di corpi. Quello è
// un numero che si può portare in una decisione di progetto (quanti asset
// distinti può avere una scena AR su quel telefono?), e per averlo bisogna
// salire un gradino alla volta e misurare ognuno da solo.
//
// ⚠ E OGNI GRADINO MISURA UNA COSA SOLA. Tre modifiche e una misura non è una
// misura: è già scritto in CLAUDE.md a proposito della scala di qualità, e
// costò un verdetto («la grafica è peggiorata di molto ma ho guadagnato sì e no
// 5 fps»). Qui vale doppio, perché le voci non costano affatto nello stesso
// modo — mille blocchi diversi finiscono nella mesh del loro chunk e non
// aggiungono un disegno, mille modelli diversi aggiungono MILLE DISEGNI.
//
// ⚠ NIENTE DOM, NIENTE GL: è una macchina a stati che dice cosa accendere e
// raccoglie i numeri. Chi la guida applica le manopole. Si prova in Node.
import { Ritmo, voto } from './ritmo.js';

/**
 * I GRADINI. `carico` è quello che il banco chiede alla partita di accendere;
 * chi guida lo applica e basta. `spiega` dice cosa si sta misurando, e non è
 * decorazione: un numero senza la sua domanda fra un mese non serve.
 *
 * ⚠ L'ORDINE NON È CASUALE: prima il riposo (il fondo scala di quella
 * macchina), poi le voci una alla volta dalla più economica alla più cara, poi
 * tutto insieme, e per ultima l'AR — che è l'unica che raddoppia il disegno.
 */
export const GRADINI = [
  // ⚠ IL MONDO DELL'OMEGA C'È GIÀ IN TUTTI I GRADINI, e non è una scorciatoia:
  // duemila tipi di blocco diversi stanno nella MESH del loro chunk, e cambiarli
  // vorrebbe dire rigenerare e ri-meshare il mondo in mezzo alla misura — cioè
  // misurare la ricostruzione. Sono il fondo costante; il «riposo» è già
  // l'abominio dei blocchi, ed è la prima cosa che il banco dimostra: mille tipi
  // diversi NON costano un disegno in più.
  { id: 'riposo', nome: 'Il mondo omega', spiega: '2000 tipi di blocco diversi, canali, alberi: il fondo scala di questa macchina',
    carico: { pozze: false, arredi: 0, corpi: 0, ar: false } },
  { id: 'luci', nome: '+ pozze colorate', spiega: 'le lampade accendono: cammino nei voxel per pixel, la voce piu cara del motore',
    carico: { pozze: true, arredi: 0, corpi: 0, ar: false } },
  { id: 'modelli64', nome: '+ 64 arredi unici', spiega: 'sessantaquattro mesh diverse = sessantaquattro disegni per passata',
    carico: { pozze: true, arredi: 64, corpi: 0, ar: false } },
  { id: 'modelli256', nome: '+ 256 arredi unici', spiega: 'il gradino dove di solito si vede il ginocchio dei disegni',
    carico: { pozze: true, arredi: 256, corpi: 0, ar: false } },
  { id: 'modelli1024', nome: '+ 1024 arredi unici', spiega: 'mille mesh diverse: il caso peggiore onesto per una scena piena di roba',
    carico: { pozze: true, arredi: 1024, corpi: 0, ar: false } },
  { id: 'fisica', nome: '+ 400 corpi', spiega: 'la fisica a passo fisso sotto carico: CPU, non GPU',
    carico: { pozze: true, arredi: 1024, corpi: 400, ar: false } },
  // ⚠ L'AR NON È UN EFFETTO IN PIÙ, È UNA SECONDA RESA. In AR il fotogramma
  // porta l'immagine della camera E la scena, nello stesso budget: il modo
  // onesto di provarlo senza avere ancora l'AR è DISEGNARE LA SCENA DUE VOLTE.
  // Se questo gradino dimezza i fotogrammi, è esattamente quello che succederà
  // il giorno che l'AR si accende — e saperlo adesso vale più che scoprirlo poi.
  { id: 'ar', nome: '+ prova AR (doppia resa)', spiega: 'la scena disegnata DUE volte per fotogramma: il budget vero dell AR',
    carico: { pozze: true, arredi: 1024, corpi: 400, ar: true } },
];

/** Fotogrammi buttati a ogni gradino, e fotogrammi misurati. */
export const RISCALDO = 45;
export const MISURATI = 180;

/**
 * ⚠ IL RISCALDO NON È SUPERSTIZIONE. Cambiando gradino la partita registra
 * blocchi, costruisce mesh, compila shader e ricarica buffer: i primi fotogrammi
 * dopo un cambio misurano IL CAMBIO, non il carico. In questo progetto è già
 * successo di leggere l'avvio e crederlo il regime (CLAUDE.md, «i primi 4
 * secondi non si giudicano»).
 */
export class BancoOmega {
  /**
   * @param opz.gradini     quali gradini fare (di fabbrica: tutti)
   * @param opz.riscaldo    fotogrammi buttati per gradino
   * @param opz.misurati    fotogrammi misurati per gradino
   */
  constructor({ gradini = GRADINI, riscaldo = RISCALDO, misurati = MISURATI } = {}) {
    this.gradini = gradini;
    this.riscaldo = riscaldo;
    this.misurati = misurati;
    this.i = -1;
    this.fatti = 0;
    this.fase = 'fermo';        // fermo | riscaldo | misura | finito
    this.contatore = 0;
    this.ritmo = new Ritmo({ tetto: misurati });
    this.esiti = [];
    this._scena = null;         // le letture della scena, per il gradino in corso
  }

  get gradino() { return this.i >= 0 && this.i < this.gradini.length ? this.gradini[this.i] : null; }
  get inCorso() { return this.fase === 'riscaldo' || this.fase === 'misura'; }

  /** Il carico da applicare adesso; `null` se il banco è fermo o finito. */
  get carico() { const g = this.gradino; return g ? g.carico : null; }

  /**
   * Quanto manca, 0..1.
   * ⚠ SI CONTANO I FOTOGRAMMI FATTI, non si ricava da gradino e contatore:
   * quel conto TORNAVA INDIETRO al passaggio riscaldo→misura, perché il
   * contatore riparte da zero. Una barra che arretra si legge come «si è
   * inceppato», ed è il genere di difetto che sembra un guasto del banco.
   */
  get avanzamento() {
    if (this.fase === 'finito') return 1;
    const totale = this.gradini.length * (this.riscaldo + this.misurati);
    return totale > 0 ? Math.min(1, this.fatti / totale) : 0;
  }

  avvia() {
    this.i = 0; this.contatore = 0; this.fatti = 0;
    // ⚠ CON RISCALDO ZERO NON SI BUTTA UN FOTOGRAMMA: la fase di riscaldo ne
    // consumava uno lo stesso, e chi chiede «nessun riscaldo» (una prova, un
    // banco corto) si trovava un campione più corto di quello che aveva chiesto.
    this.fase = this.riscaldo > 0 ? 'riscaldo' : 'misura';
    this.esiti.length = 0; this.ritmo.azzera(); this._scena = null;
    return this.carico;
  }

  ferma() { this.fase = 'fermo'; this.i = -1; this.contatore = 0; this.fatti = 0; }

  /**
   * Un fotogramma. Torna `{ cambiato, carico }`: `cambiato` vero quando si passa
   * al gradino dopo, e allora `carico` è quello nuovo da applicare.
   *
   * @param ms     durata del fotogramma in millisecondi
   * @param scena  letture del momento: `{ disegni, triangoli, istanze, tipi, chunk }`
   */
  passo(ms, scena = null) {
    if (!this.inCorso) return { cambiato: false, carico: null };
    // ⚠ LE LETTURE DELLA SCENA SI PRENDONO AL MASSIMO, non alla fine: durante un
    // gradino la camera gira e il frustum scarta roba diversa, quindi l'ultimo
    // fotogramma direbbe «quanti disegni c'erano quando ho smesso di guardare».
    // Il numero che interessa è il PEGGIORE che quel carico ha prodotto.
    if (scena) {
      if (!this._scena) this._scena = { ...scena };
      else for (const k of Object.keys(scena)) if (scena[k] > this._scena[k]) this._scena[k] = scena[k];
    }
    this.contatore++; this.fatti++;
    if (this.fase === 'riscaldo') {
      if (this.contatore >= this.riscaldo) { this.fase = 'misura'; this.contatore = 0; this.ritmo.azzera(); this._scena = scena ? { ...scena } : null; }
      return { cambiato: false, carico: null };
    }
    this.ritmo.campiona(ms);
    if (this.contatore < this.misurati) return { cambiato: false, carico: null };
    return this._chiudiGradino();
  }

  _chiudiGradino() {
    const g = this.gradino;
    const m = this.ritmo.misura();
    this.esiti.push({ id: g.id, nome: g.nome, spiega: g.spiega, carico: g.carico, misura: m, voto: voto(m), scena: this._scena });
    this.i++;
    this.contatore = 0; this._scena = null;
    if (this.i >= this.gradini.length) { this.fase = 'finito'; return { cambiato: true, carico: null, finito: true }; }
    this.fase = this.riscaldo > 0 ? 'riscaldo' : 'misura';
    if (this.fase === 'misura') this.ritmo.azzera();
    return { cambiato: true, carico: this.carico };
  }

  /**
   * IL VERDETTO: dove si rompe, e per colpa di cosa.
   *
   * ⚠ È LA RISPOSTA CHE IL BANCO ESISTE PER DARE. Otto tabelle di numeri non
   * sono un risultato: il risultato è «questa macchina regge N modelli unici e
   * si siede al gradino tale, e il collo è il ritmo (non i fotogrammi)».
   */
  verdetto() {
    if (!this.esiti.length) return null;
    // ⚠ «L'ULTIMO BUONO» È QUELLO PRIMA DELLA PRIMA ROTTURA, non l'ultimo con un
    // voto alto: i voti NON sono monotoni, e la prima misura vera lo ha
    // dimostrato subito. A 1024 arredi unici questa macchina alterna 7 e 14
    // millesimi (perde un vsync sì e uno no): voto 16. Al gradino dopo, con
    // l'AR, sta stabile a 14 e prende 71 — meglio, ma dopo. Prendendo «l'ultimo
    // con voto alto» il verdetto diceva «ultimo gradino buono: AR», cioè
    // esattamente il contrario della verità.
    const iRotto = this.esiti.findIndex((e) => e.voto.punti < 45);
    const primoRotto = iRotto >= 0 ? this.esiti[iRotto] : null;
    const ultimoBuono = iRotto > 0 ? this.esiti[iRotto - 1] : (iRotto === 0 ? null : this.esiti[this.esiti.length - 1]);
    const riposo = this.esiti[0];
    const ar = this.esiti.find((e) => e.id === 'ar');
    const pieno = this.esiti.find((e) => e.id === 'fisica') || this.esiti[this.esiti.length - 1];
    return {
      ultimoBuono: ultimoBuono ? ultimoBuono.id : null,
      primoRotto: primoRotto ? primoRotto.id : null,
      // ⚠ IL PREZZO DELL'AR È UN RAPPORTO, non una differenza: «la seconda resa
      // costa il 45 % dei fotogrammi» si porta su un'altra macchina, «costa 8 ms» no.
      prezzoAr: ar && pieno && ar.misura && pieno.misura && pieno.misura.p50 > 0
        ? ar.misura.p50 / pieno.misura.p50 : null,
      // e il costo di TUTTO il carico rispetto al mondo nudo, sempre in rapporto
      prezzoCarico: pieno && riposo && pieno.misura && riposo.misura && riposo.misura.p50 > 0
        ? pieno.misura.p50 / riposo.misura.p50 : null,
      // ⚠ E IL COLLO SI DECIDE SUL GRADINO PIENO, non sulla media di tutti: al
      // riposo il collo è quasi sempre il vsync, e includerlo direbbe sempre «i
      // fotogrammi», che è il consiglio sbagliato.
      collo: pieno && pieno.voto ? pieno.voto.collo : null,
      agganciato: riposo && riposo.misura ? riposo.misura.regolare : false,
      // ⚠ E I RAPPORTI SONO UN PAVIMENTO, NON UNA MISURA, quando il riposo è
      // incollato al vsync: lì il p50 è il PANNELLO, non il motore, quindi il
      // costo vero del carico è nascosto sotto il soffitto dello schermo. La
      // prima misura vera ha detto «il carico pieno costa 1,01x il mondo nudo»,
      // che letto senza questa riga vuol dire «gratis» — mentre vuol dire
      // «tutt'e due stanno sotto il tetto dei 144 Hz e non si sa di quanto».
      soloPavimento: riposo && riposo.misura ? riposo.misura.regolare : false,
    };
  }

  /** Le righe da mettere in un rapporto o a schermo. */
  righe() {
    return this.esiti.map((e) => {
      const m = e.misura;
      if (!m) return `${e.nome}: poco campione`;
      const s = e.scena || {};
      return `${e.nome.padEnd(24)} ${m.fps.toFixed(0).padStart(4)} fps · p50 ${m.p50.toFixed(1).padStart(5)} p99 ${m.p99.toFixed(1).padStart(6)} ms`
        + ` · scarto ${m.scarto.toFixed(2).padStart(5)} · singh ${m.singhiozziAlSec.toFixed(1)}/s`
        + ` · ${String(s.disegni ?? '?').padStart(5)} disegni · voto ${String(e.voto.punti).padStart(3)} (${e.voto.giudizio})`;
    });
  }
}

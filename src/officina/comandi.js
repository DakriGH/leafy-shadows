// Officina — il BUS DEI COMANDI.
//
// ⚠ L'OFFICINA NON TOCCA MAI LA SCENA DIRETTAMENTE, e questa è la regola che
// tiene insieme tutto il resto. Ogni modifica passa da qui come un comando:
// { registro, campo, prima, dopo, autore, t }. Un comando si esegue, si annulla,
// si ripete, si SERIALIZZA. Il giorno che il sandbox va in rete, il giocatore
// che costruisce e lo strumento di sviluppo parlano la stessa lingua: il server
// valida un comando e lo ritrasmette, non "una modifica alla scena".
//
// Il bus non sa cosa sia un registro: gli si passa `scrivi(registro, campo, valore)`
// e lui chiama quella. Così si prova da solo, senza Babylon.

export class BusComandi {
  constructor({ scrivi, autore = 'locale', limite = 500 } = {}) {
    this._scrivi = scrivi;
    this.autore = autore;
    this.limite = limite;
    this.fatti = [];      // comandi eseguiti, in ordine
    this.disfatti = [];   // comandi annullati, pronti per «ripeti»
    this.diario = [];     // TUTTO quello che è passato, anche gli annulla: è il log di rete
    this._osservatori = new Set();
  }

  // Esegue e registra. `prima` lo legge chi chiama (il pannello conosce il valore
  // corrente): il bus non legge niente, così resta cieco e portabile.
  esegui({ registro, campo, prima, dopo, nota }) {
    if (uguali(prima, dopo)) return null;
    const c = { registro, campo, prima: copia(prima), dopo: copia(dopo), autore: this.autore, t: Date.now(), nota };
    this._scrivi(registro, campo, c.dopo);
    this.fatti.push(c);
    if (this.fatti.length > this.limite) this.fatti.shift();
    this.disfatti.length = 0;
    this._annota('esegui', c);
    return c;
  }

  // ⚠ I TRASCINAMENTI DEGLI SLIDER NON DEVONO FARE CENTO COMANDI: mentre il dito
  // si muove si scrive «a vista» (senza registrare); al rilascio si emette UN
  // comando con il valore di partenza e quello finale. Vedi pannello.js.
  aVista(registro, campo, valore) { this._scrivi(registro, campo, valore); }

  annulla() {
    const c = this.fatti.pop();
    if (!c) return null;
    this._scrivi(c.registro, c.campo, c.prima);
    this.disfatti.push(c);
    this._annota('annulla', c);
    return c;
  }

  ripeti() {
    const c = this.disfatti.pop();
    if (!c) return null;
    this._scrivi(c.registro, c.campo, c.dopo);
    this.fatti.push(c);
    this._annota('ripeti', c);
    return c;
  }

  get puoAnnullare() { return this.fatti.length > 0; }
  get puoRipetere() { return this.disfatti.length > 0; }

  // Lo stato «netto» come mappa registro→campo→valore: è quello che si salva
  // come preset (preset.js) e che un client appena entrato riceverebbe.
  netto() {
    const n = {};
    for (const c of this.fatti) ((n[c.registro] ||= {})[c.campo] = c.dopo);
    return n;
  }

  // Rigioca un elenco di comandi (da un preset o dalla rete). Non li registra
  // come annullabili: sono «lo stato in cui ci si trova», non «cose fatte da me».
  rigioca(comandi) {
    for (const c of comandi) this._scrivi(c.registro, c.campo, c.dopo);
  }

  osserva(f) { this._osservatori.add(f); return () => this._osservatori.delete(f); }

  _annota(verbo, c) {
    this.diario.push({ verbo, ...c });
    if (this.diario.length > this.limite * 2) this.diario.shift();
    for (const f of this._osservatori) f(verbo, c);
  }
}

function copia(v) { return v && typeof v === 'object' ? JSON.parse(JSON.stringify(v)) : v; }
function uguali(a, b) { return a === b || (a && b && typeof a === 'object' && JSON.stringify(a) === JSON.stringify(b)); }

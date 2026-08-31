// LA MODALITÀ DELL'INTERFACCIA — a dito o col mouse, e si può DECIDERE.
//
// ⚠ Committente: «manca il tastino per passare da modalità desktop e GUI
// smartphone, perché da Chromebook ho entrambe le modalità». Ed è il caso che
// smonta l'idea che il dispositivo si possa indovinare: un convertibile ha
// davvero tutte e due le cose, e quale sia quella giusta lo sa solo chi lo tiene
// in mano — dipende da com'è aperto in quel momento, non da cosa dice il
// browser. `matchMedia` può dire cosa c'È, mai cosa si sta USANDO.
//
// ⚠ QUINDI TRE STATI E NON DUE: «auto» segue il browser (ed è giusto per il
// 99% dei dispositivi, che una modalità sola ce l'hanno), e le altre due la
// scavalcano. Un interruttore a due posizioni costringerebbe chiunque a
// scegliere a mano una cosa che quasi sempre si indovina da sé.
//
// ⚠ E LA SCELTA SI RICORDA. Chi apre il gioco col Chromebook piegato a tablet
// non deve ripremere il bottone a ogni ricarica.

const CHIAVE = 'leafy.gui';
/** La classe che accende tutto il vestito «a dito»: barra grande, comandi,
 *  pannelli stretti. Sta sulla radice, così la vedono tutti i fogli di stile. */
export const CLASSE = 'gui-tocco';

// ⚠ LO STILE DEI DUE TASTINI STA IN «ui/diagnostica.js», in un posto solo: sono
// due pillole identiche impilate sullo stesso bordo, e tenerle in due fogli
// diversi vuol dire che prima o poi una cresce e l'altra no.
const STILE = `
`;

/**
 * IL TASTINO, più la regola che decide la modalità.
 * @param onCambio (aTocco) → void, per chi deve rifare qualcosa
 */
export class ModoGui {
  constructor(onCambio) {
    this.onCambio = onCambio;
    // 'auto' | 'tocco' | 'mouse'
    this.scelta = (() => {
      try { return localStorage.getItem(CHIAVE) || 'auto'; } catch { return 'auto'; }
    })();

    const stile = document.createElement('style');
    stile.textContent = STILE;
    document.head.appendChild(stile);

    this.nodo = document.createElement('div');
    this.nodo.id = 'modoGui';
    document.body.appendChild(this.nodo);
    this.nodo.addEventListener('click', () => this.cicla());

    // ⚠ E SI ASCOLTA IL BROWSER MENTRE CAMBIA IDEA: piegare un convertibile
    // cambia `pointer: coarse` a pagina aperta. In «auto» va seguito, se no
    // l'automatico è automatico solo al primo caricamento.
    if (typeof matchMedia === 'function') {
      this._mq = matchMedia('(pointer: coarse)');
      const ascolta = () => { if (this.scelta === 'auto') this.applica(); };
      if (this._mq.addEventListener) this._mq.addEventListener('change', ascolta);
    }
    this.applica();
  }

  /** Quello che dice il browser, quando non abbiamo deciso noi. */
  get automatico() { return !!(this._mq && this._mq.matches); }

  /** La risposta che conta: adesso si gioca a dito o col mouse? */
  get aTocco() {
    if (this.scelta === 'tocco') return true;
    if (this.scelta === 'mouse') return false;
    return this.automatico;
  }

  /** auto → tocco → mouse → auto. */
  cicla() {
    this.scelta = this.scelta === 'auto' ? 'tocco' : this.scelta === 'tocco' ? 'mouse' : 'auto';
    try { localStorage.setItem(CHIAVE, this.scelta); } catch { /* navigazione privata */ }
    this.applica();
  }

  applica() {
    const a = this.aTocco;
    document.documentElement.classList.toggle(CLASSE, a);
    this.nodo.classList.toggle('fissato', this.scelta !== 'auto');
    this.nodo.innerHTML = a ? '<b>📱</b> a dito' : '<b>🖥</b> col mouse';
    this.nodo.title = this.scelta === 'auto'
      ? `Interfaccia: automatica (adesso ${a ? 'a dito' : 'col mouse'}) — tocca per fissarla`
      : `Interfaccia: ${a ? 'a dito' : 'col mouse'}, fissata — tocca per cambiare`;
    if (this.onCambio) this.onCambio(a);
  }
}

// IL SELETTORE DELL'ACQUA — una pillola a schermo, perché sul telefono non c'è
// una tastiera.
//
// ⚠ PERCHÉ NON BASTAVA IL TASTO `A`. Committente: «voglio un tasto fisico,
// altrimenti da mobile come testo le varie acque?». È lo stesso difetto già
// pagato due volte in questo progetto — la qualità si cicla con `K`, la
// diagnostica si mandava da console — e la regola che ne è uscita è che **ogni
// comando che serve a GUARDARE dev'essere raggiungibile con un dito**: il
// telefono è il posto dove i difetti grafici si vedono per primi (schermo
// piccolo, GPU debole, luce del sole), ed è l'unico posto dove non si può
// digitare niente.
//
// ⚠ E NON NOMINA NESSUN MOTORE: riceve l'elenco e una funzione da chiamare. Chi
// gli passa cosa lo decide `main.js`; qui dentro c'è solo un bottone.

const STILE = `
/* stessa pillola di 🩺 e 📱: bordo, sfondo chiaro, scritta — non un'icona muta.
   ⚠ E STA SOTTO LE ALTRE DUE, non accanto: sul telefono la colonna sinistra è
   l'unica fascia sicuramente vuota, mentre in orizzontale si finisce sopra la
   scena o sotto il pollice che gira la camera. */
.pillolaScelta {
  /* ⚠ LA FILA È UNA VARIABILE, non un top scritto a mano: in modalità tocco le
     pillole crescono, e un valore fisso calcolato per il mouse le farebbe
     accavallare proprio sul telefono — cioè dove servono. */
  position: fixed; left: 8px; top: calc(46% + 84px + var(--fila, 0) * 40px); z-index: 30;
  height: 34px; border-radius: 17px; cursor: pointer;
  border: 2px solid rgba(13,42,26,.22); background: rgba(255,255,255,.92);
  font: 600 12px/1 system-ui, sans-serif; color: #0d2a1a;
  display: flex; align-items: center; overflow: hidden;
  box-shadow: 0 2px 8px rgba(13,42,26,.14);
  -webkit-tap-highlight-color: transparent; user-select: none;
}
.pillolaScelta .goccia { font: 15px/1 system-ui, sans-serif; padding: 0 2px 0 9px; }
/* ⚠ LE FRECCE SONO BERSAGLI, NON DECORAZIONI: larghe quanto un polpastrello
   anche col mouse, se no su un telefono si becca sempre quella sbagliata. */
.pillolaScelta .frec { padding: 0 10px; align-self: stretch; display: flex; align-items: center;
  font: 700 15px/1 system-ui, sans-serif; color: #3c5a4a; }
.pillolaScelta .frec:hover { background: rgba(13,42,26,.08); color: #0d2a1a; }
/* ⚠ IL NOME SI TRONCA E NON MANDA A CAPO: quaranta acque hanno nomi di lunghezza
   diversa, e una pillola che cambia larghezza a ogni tocco fa ballare le frecce
   sotto il dito — si finisce per premere due volte quella sbagliata. */
.pillolaScelta .nome { max-width: 150px; overflow: hidden; text-overflow: ellipsis;
  white-space: nowrap; padding: 0 4px; }
.pillolaScelta .cont { color: #3c5a4a; font-weight: 500; padding-right: 8px; }
.gui-tocco .pillolaScelta { height: 42px; border-radius: 21px; font-size: 13px; top: calc(46% + 100px + var(--fila, 0) * 48px); }
.gui-tocco .pillolaScelta .goccia { font-size: 18px; }
.gui-tocco .pillolaScelta .frec { font-size: 18px; padding: 0 13px; }
.gui-tocco .pillolaScelta .nome { max-width: 170px; }
`;

export class SceltaAcqua {
  /**
   * @param voci    [{ chiave, nome, nota }] — l'elenco delle voci
   * @param cambia  (chiave, voce, indice) → void, chiamata a ogni scelta
   * @param aspetto { id, emoji, titolo, sotto } — per RIUSARE la pillola:
   *                la grafica, l'acqua e qualunque altra cosa da ciclare a
   *                dito vogliono lo stesso identico controllo, e due copie
   *                dello stesso CSS divergono sempre. `sotto` è quante pillole
   *                stanno sopra questa nella colonna (0 = il posto dell'acqua).
   */
  constructor(voci, cambia, aspetto = {}) {
    this.voci = voci;
    this.cambia = cambia;
    this.indice = 0;
    const { id = 'acquaSel', emoji = '💧', titolo = 'Cambia l\'acqua', sotto = 0 } = aspetto;

    if (!document.getElementById('stile-pillola-scelta')) {
      const stile = document.createElement('style');
      stile.id = 'stile-pillola-scelta';
      stile.textContent = STILE;
      document.head.appendChild(stile);
    }

    this.nodo = document.createElement('div');
    this.nodo.id = id;
    this.nodo.className = 'pillolaScelta';
    if (sotto) this.nodo.style.setProperty('--fila', sotto);
    this.nodo.title = titolo;
    this.nodo.innerHTML = `<span class="goccia">${emoji}</span>`
      + '<span class="frec" data-va="-1">‹</span>'
      + '<span class="nome"></span>'
      + '<span class="cont"></span>'
      + '<span class="frec" data-va="1">›</span>';
    document.body.appendChild(this.nodo);

    // ⚠ UN ASCOLTO SOLO SUL CONTENITORE, e la direzione la dice il bersaglio:
    // con un ascolto per freccia si finisce per registrarli due volte quando la
    // pillola si ridisegna, e i tocchi cominciano a contare doppio — un difetto
    // che si legge come «ne salta una ogni tanto».
    this.nodo.addEventListener('click', (ev) => {
      const chi = ev.target.closest('.frec');
      this.muovi(chi ? Number(chi.dataset.va) : 1);
    });
    this.disegna();
  }

  /** Avanti (+1) o indietro (−1), a giro tondo. */
  muovi(passo) {
    const n = this.voci.length;
    this.indice = ((this.indice + passo) % n + n) % n;
    this.applica();
  }

  vaiA(i) {
    this.indice = ((i % this.voci.length) + this.voci.length) % this.voci.length;
    this.applica();
  }

  applica() {
    const v = this.voci[this.indice];
    this.disegna();
    this.cambia(v.chiave, v, this.indice);
  }

  disegna() {
    const v = this.voci[this.indice];
    this.nodo.querySelector('.nome').textContent = v.nome;
    this.nodo.querySelector('.cont').textContent = `${this.indice + 1}/${this.voci.length}`;
  }

  /** L'acqua di adesso, per chi deve scriverla altrove (il pannello, la spia). */
  get voce() { return this.voci[this.indice]; }
}

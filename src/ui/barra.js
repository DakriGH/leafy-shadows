// LA BARRA — cosa hai in mano, e cosa farà il prossimo clic.
//
// ⚠ ESISTE PERCHÉ SENZA NON SI CAPIVA NIENTE. Prima quello che avevi in mano
// stava scritto in una riga di diagnostica in mezzo ad altre otto, e cosa
// facesse un clic non stava scritto da nessuna parte: si scopriva cliccando.
// Committente: «sistemiamo meglio questa GUI un minimo per renderla
// comprensibile».
//
// ⚠ E SERVE DOPPIO SU UN TELEFONO, dove non ci sono i tasti numerici: toccare
// una casella è l'unico modo di cambiare mano.
//
// ── LO STILE ────────────────────────────────────────────────────────────────
// Minimale, mai skeumorfico: niente legno, niente ottone, niente texture. Un
// pannello chiaro, bordi sottili, il colore VERO del blocco come icona — che è
// anche l'unica icona che non mente, perché è lo stesso colore che comparirà a
// schermo. Le emoji sarebbero state più veloci e avrebbero portato dentro lo
// stile di qualcun altro.
//
// ⚠ NON NOMINA BABYLON né conosce il mondo: riceve la cassetta, i colori e un
// callback. È DOM, e il DOM non è il motore.

const CSS = `
#barra { position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%);
  z-index: 20; display: flex; flex-direction: column; align-items: center; gap: 6px;
  font: 12px/1.3 ui-monospace, monospace; color: #0d2a1a; user-select: none; }
#barra .azione { background: rgba(255,255,255,.82); border-radius: 6px;
  padding: 3px 10px; letter-spacing: .04em; white-space: nowrap; }
#barra .azione b { font-weight: 700; }
#barra .caselle { display: flex; gap: 4px; background: rgba(255,255,255,.72);
  padding: 5px; border-radius: 8px; }
#barra .c { width: 34px; height: 34px; border-radius: 5px; border: 1px solid rgba(13,42,26,.18);
  background: #fff; display: flex; align-items: center; justify-content: center;
  position: relative; cursor: pointer; padding: 0; }
#barra .c i { width: 20px; height: 20px; border-radius: 3px; display: block; }
#barra .c.scelta { border-color: #0d2a1a; border-width: 2px; box-shadow: 0 0 0 2px rgba(13,42,26,.12); }
#barra .c span { position: absolute; right: 2px; bottom: 0; font-size: 9px; opacity: .5; }
/* la mano vuota: un contorno e basta, che è esattamente quello che è */
#barra .c.vuota i { background: none; border: 2px dashed rgba(13,42,26,.35); }
/* ⚠ SUL TELEFONO SI SCORRE, E LE CASELLE SONO PIÙ GRANDI. Diciannove caselle
   schiacciate in 375 px fanno quadratini da diciotto pixel: non si toccano e
   non si riconoscono. Committente: «la hotbar è inutilmente lunga, dammi la
   possibilità di scorrere così ho le icone più grandi e comprensibili».
   Quindi caselle da 52 px — un bersaglio che il dito prende — e la striscia
   scorre. ⚠ Con l'AGGANCIO («scroll-snap»), se no si resta sempre a metà fra
   due caselle e non si capisce quale sia scelta.
   ⚠ E LA BARRA DI SCORRIMENTO SI NASCONDE ma lo scorrimento resta: su un
   telefono quella barra è tre pixel di grigio che rubano spazio e non si
   toccano comunque. */
/* ⚠ NON PIÙ UNA MEDIA QUERY MA UNA CLASSE, e il motivo è un dispositivo vero: un
   Chromebook ha lo schermo largo E il touchscreen, quindi con la larghezza si
   prendeva sempre il vestito da mouse anche tenendolo piegato a tablet.
   Committente: «manca il tastino per passare da modalità desktop e GUI
   smartphone». La classe la mette «ui/modo.js», che di suo segue il browser ma
   si può fissare a mano — perché quale sia la modalità giusta lo sa solo chi ha
   il coso in mano. */
.gui-tocco #barra { bottom: 10px; gap: 4px; width: 100vw; }
.gui-tocco #barra .c { width: 52px; height: 52px; scroll-snap-align: center; flex: 0 0 auto; }
.gui-tocco #barra .c i { width: 30px; height: 30px; }
.gui-tocco #barra .c span { font-size: 11px; right: 3px; }
.gui-tocco #barra .caselle { max-width: 100vw; overflow-x: auto; scroll-snap-type: x proximity;
  -webkit-overflow-scrolling: touch; padding: 6px 10px; border-radius: 0;
  scrollbar-width: none; }
.gui-tocco #barra .caselle::-webkit-scrollbar { display: none; }
`;

export class Barra {
  /**
   * @param cassetta  l'elenco dei tipi (con `null` per la mano vuota)
   * @param colorePer (tipo) → '#rrggbb', il colore della cima del blocco
   * @param nomePer   (tipo) → nome leggibile
   * @param onScegli  (indice) → void
   */
  constructor({ cassetta, colorePer, nomePer, onScegli }) {
    this.cassetta = cassetta;
    this.onScegli = onScegli;
    const stile = document.createElement('style');
    stile.textContent = CSS;
    document.head.appendChild(stile);

    const root = this.root = document.createElement('div');
    root.id = 'barra';
    this.azione = document.createElement('div');
    this.azione.className = 'azione';
    const caselle = document.createElement('div');
    caselle.className = 'caselle';

    this.bottoni = cassetta.map((tipo, i) => {
      const b = document.createElement('button');
      b.className = 'c' + (tipo ? '' : ' vuota');
      b.title = tipo ? nomePer(tipo) : 'mano vuota — rompi e accendi';
      const icona = document.createElement('i');
      if (tipo) icona.style.background = colorePer(tipo);
      b.appendChild(icona);
      // ⚠ IL NUMERO SOLO SUI PRIMI NOVE, perché solo quelli hanno un tasto: una
      // targhetta che promette una scorciatoia che non esiste è peggio di
      // nessuna targhetta.
      if (i < 9) { const n = document.createElement('span'); n.textContent = i + 1; b.appendChild(n); }
      // ⚠ «pointerdown» E NON «click»: sul telefono il click arriva dopo un
      // ritardo, e in mezzo il tocco è già arrivato alla tela sotto — si
      // cambiava mano E si posava un blocco.
      b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); this.onScegli(i); });
      caselle.appendChild(b);
      return b;
    });

    root.append(this.azione, caselle);
    document.body.appendChild(root);
    this._scelta = -1;
  }

  /**
   * Aggiorna quale casella è scelta e cosa dirà l'etichetta.
   * ⚠ SCRIVE SOLO SE È CAMBIATO: questa roba gira a ogni fotogramma, e toccare
   * il DOM sessanta volte al secondo per riscriverci lo stesso testo fa
   * ricalcolare il layout per niente.
   */
  aggiorna(scelta, testoAzione) {
    if (scelta !== this._scelta) {
      if (this.bottoni[this._scelta]) this.bottoni[this._scelta].classList.remove('scelta');
      if (this.bottoni[scelta]) {
        this.bottoni[scelta].classList.add('scelta');
        // ⚠ E SI PORTA IN VISTA, se no cambiando mano coi tasti (o con R) la
        // casella scelta finisce fuori dalla striscia scorrevole e non si vede
        // più cosa si ha in mano — il difetto nasce insieme allo scorrimento.
        this.bottoni[scelta].scrollIntoView({ block: 'nearest', inline: 'center' });
      }
      this._scelta = scelta;
    }
    if (testoAzione !== this._testo) { this.azione.innerHTML = testoAzione; this._testo = testoAzione; }
  }
}

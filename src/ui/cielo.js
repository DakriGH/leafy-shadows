// IL PANNELLO DEL CIELO — dove sta il sole, che ora è, che stagione.
//
// ⚠ È UN BANCO DI PROVA, non un ornamento, ed è quello che il committente ha
// chiesto: «un giroscopio o mappa piccolina comoda con il ciclo del sole e luna
// e una sbarra per cambiare l'ora, comodo per capire l'angolazione del sole e
// luna e fare dei test». Fino a oggi l'ora si spostava con due tasti e
// l'angolazione del sole non si poteva SAPERE: si indovinava guardando le
// ombre, che è il contrario di misurare.
//
// ── PERCHÉ UN QUADRANTE POLARE, e non una linea dell'orizzonte ──────────────
// Di un sole servono DUE numeri — quanto è alto e da che parte sta — e una
// vista di lato ne dà uno solo. Il quadrante polare li dà tutti e due in un
// disegno che sta in un pollice: il CENTRO è lo zenit, il BORDO è l'orizzonte,
// e l'angolo attorno è la direzione. Un sole che d'estate passa vicino al centro
// e d'inverno striscia sul bordo si legge a colpo d'occhio, ed è esattamente il
// tipo di cosa per cui serviva.
//
// ⚠ E C'È ANCHE DOVE GUARDA LA CAMERA, perché la domanda vera quando si guarda
// un'ombra non è «dov'è il sole» ma «dov'è il sole RISPETTO A ME».
//
// ⚠ NON NOMINA BABYLON: riceve numeri (altezza, direzione, ora) e chiama dei
// callback. È DOM, e il DOM non è il motore.

const CSS = `
#cielo { position: fixed; right: 8px; top: 58px; z-index: 20; width: 132px;
  background: rgba(255,255,255,.72); border-radius: 8px; padding: 8px;
  font: 11px/1.35 ui-monospace, monospace; color: #0d2a1a; user-select: none; }
#cielo .titolo { display: flex; justify-content: space-between; align-items: center;
  cursor: pointer; letter-spacing: .04em; }
#cielo .corpo { margin-top: 6px; }
#cielo.chiuso .corpo { display: none; }
#cielo svg { display: block; margin: 0 auto; }
#cielo .riga { display: flex; align-items: center; gap: 5px; margin-top: 6px; }
/* ⚠ «min-width: 0» E NON È UN DETTAGLIO: un figlio flessibile non scende sotto
   la sua larghezza NATURALE senza questa riga, e la larghezza naturale di un
   input range è circa 170 px — dentro un pannello da 118 sul telefono sbordava
   fuori dallo schermo. È la trappola più vecchia di flexbox. */
#cielo input[type=range] { flex: 1; min-width: 0; height: 14px; accent-color: #0d2a1a; }
#cielo button { font: 11px ui-monospace, monospace; color: #0d2a1a; cursor: pointer;
  background: #fff; border: 1px solid rgba(13,42,26,.2); border-radius: 4px; padding: 2px 5px; }
#cielo button.acceso { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
#cielo .et { font-size: 9px; opacity: .55; width: 26px; }
#cielo .data { font-size: 10px; opacity: .7; text-align: center; margin-top: 3px; }
#cielo .stagioni { display: flex; gap: 3px; margin-top: 6px; }
#cielo .stagioni button { flex: 1; padding: 3px 0; font-size: 12px; }
/* stretto quando si gioca a dito: vedi «ui/modo.js» */
.gui-tocco #cielo { width: 118px; right: 6px; top: 46px; }
`;

const R = 40, C = 46;   // raggio del quadrante e centro (il riquadro è 92)

export class PannelloCielo {
  /**
   * @param opzioni.stagioni  { chiave: {nome, emoji} }
   * @param opzioni.onOra     (t 0..1) → void
   * @param opzioni.onCiclo   (acceso) → void
   * @param opzioni.onStagione(chiave) → void
   */
  constructor({ stagioni, stagione, onOra, onCiclo, onStagione, onGiorno }) {
    const stile = document.createElement('style');
    stile.textContent = CSS;
    document.head.appendChild(stile);

    const root = this.root = document.createElement('div');
    root.id = 'cielo';
    // ⚠ IL QUADRANTE È SVG E NON CANVAS: sono sei elementi che si muovono con
    // un `transform`, e il browser li ridisegna da solo. Un canvas vorrebbe
    // dire ridisegnare tutto a mano a ogni fotogramma per far muovere un pallino.
    root.innerHTML = `
      <div class="titolo"><span>cielo</span><b class="ora">—</b></div>
      <div class="corpo">
        <svg width="92" height="92" viewBox="0 0 92 92">
          <circle cx="${C}" cy="${C}" r="${R}" fill="rgba(120,170,210,.30)" stroke="rgba(13,42,26,.30)"/>
          <circle cx="${C}" cy="${C}" r="${R * 0.5}" fill="none" stroke="rgba(13,42,26,.14)"/>
          <line x1="${C}" y1="${C - R}" x2="${C}" y2="${C + R}" stroke="rgba(13,42,26,.14)"/>
          <line x1="${C - R}" y1="${C}" x2="${C + R}" y2="${C}" stroke="rgba(13,42,26,.14)"/>
          <path class="camera" d="M0 0" fill="rgba(13,42,26,.16)"/>
          <circle class="luna" r="4.5" fill="#dfe6f2" stroke="rgba(13,42,26,.35)"/>
          <path class="fase" fill="rgba(13,42,26,.55)"/>
          <circle class="sole" r="5.5" fill="#ffcf4d" stroke="rgba(120,80,0,.5)"/>
          <text x="${C}" y="9" text-anchor="middle" font-size="8" fill="rgba(13,42,26,.55)">N</text>
          <text x="${C + R + 3}" y="${C + 3}" text-anchor="middle" font-size="8" fill="rgba(13,42,26,.55)">E</text>
        </svg>
        <div class="riga">
          <button class="ciclo" title="ferma o riavvia il ciclo">⏸</button>
          <input class="barra" type="range" min="0" max="1000" value="420">
        </div>
        <div class="riga"><span class="et">anno</span><input class="barraAnno" type="range" min="0" max="364" value="105"></div>
        <div class="data">—</div>
        <div class="stagioni"></div>
      </div>`;
    document.body.appendChild(root);

    this.el = (s) => root.querySelector(s);
    this.sole = this.el('.sole'); this.luna = this.el('.luna'); this.fase = this.el('.fase');
    this.testoData = this.el('.data');
    this.camera = this.el('.camera'); this.testoOra = this.el('.ora');
    const barra = this.barra = this.el('.barra');
    const bCiclo = this.bCiclo = this.el('.ciclo');

    // ⚠ «input» E NON «change»: la barra deve muovere il sole MENTRE si
    // trascina, se no per vedere l'effetto bisogna lasciarla e riprendere.
    barra.addEventListener('input', () => { this._daBarra = true; onOra(Number(barra.value) / 1000); });
    // ⚠ E FERMA IL CICLO DA SOLA: trascinare l'ora mentre il tempo scorre vuol
    // dire lottare contro il ciclo, che riprende a spostare il sole appena si
    // molla. Chi tocca la barra sta facendo una prova, non guardando un tramonto.
    barra.addEventListener('pointerdown', () => onCiclo(false));
    bCiclo.addEventListener('click', () => onCiclo(null));

    // ⚠ LO SLIDER DELL'ANNO È SOLO CROMATICO E ASTRONOMICO, non tocca il ciclo
    // giorno/notte: committente, «uno slider che ci fa muovere durante l'anno,
    // solo a livello cromatico, non ciclo vero giorno notte». Sposta il GIORNO,
    // e con lui la declinazione del sole e la mescolanza delle stagioni; l'ora
    // resta quella che è.
    this.barraAnno = this.el('.barraAnno');
    this.barraAnno.addEventListener('input', () => onGiorno(Number(this.barraAnno.value)));

    const sta = this.el('.stagioni');
    this.bStagioni = {};
    for (const [k, s] of Object.entries(stagioni)) {
      const b = document.createElement('button');
      b.textContent = s.emoji; b.title = s.nome;
      b.addEventListener('click', () => onStagione(k));
      sta.appendChild(b);
      this.bStagioni[k] = b;
    }
    this.stagione(stagione);

    this.el('.titolo').addEventListener('click', () => root.classList.toggle('chiuso'));
  }

  stagione(k) {
    for (const [c, b] of Object.entries(this.bStagioni)) b.classList.toggle('acceso', c === k);
  }

  /**
   * @param altezza  quanto è alto il sole, −1..1 (1 = zenit)
   * @param dir      da che parte sta il sole, sul piano: {x, z} (versore)
   * @param vista    dove guarda la camera, sul piano: {x, z}
   */
  aggiorna({ t, orologio, auto, altezza, dir, vista, luna, giorno, data, stagione }) {
    // ⚠ IL CENTRO È LO ZENIT E IL BORDO L'ORIZZONTE, quindi il raggio è
    // l'inverso dell'altezza. E un astro SOTTO l'orizzonte si disegna fuori dal
    // cerchio — si vede che è tramontato invece di sparire, che per una prova è
    // meglio: sparire e «non essere disegnato per un difetto» si somigliano.
    const punta = (el, ax, az, alt) => {
      const r = R * Math.min(1.22, 1 - Math.max(-0.2, alt));
      el.setAttribute('cx', (C + Math.sin(Math.atan2(ax, -az)) * r).toFixed(1));
      el.setAttribute('cy', (C - Math.cos(Math.atan2(ax, -az)) * r).toFixed(1));
      el.setAttribute('opacity', alt < -0.05 ? 0.35 : 1);
    };
    punta(this.sole, dir.x, dir.z, altezza);
    // ⚠ E LA LUNA ADESSO HA LA SUA ORBITA, non è più «l'opposto del sole». La
    // semplificazione di prima diceva una bugia visibile: a mezzo mese la luna
    // sta a novanta gradi dal sole, non a centottanta, e quella differenza è
    // esattamente quello che si chiama «primo quarto».
    if (luna) {
      punta(this.luna, luna.x, luna.z, luna.altezza);
      // la parte in ombra: una mezzaluna disegnata come due archi
      const cx = +this.luna.getAttribute('cx'), cy = +this.luna.getAttribute('cy'), r = 4.5;
      const k = 1 - 2 * luna.illuminata;          // +1 nuova, −1 piena
      this.fase.setAttribute('d',
        `M${cx} ${cy - r} A${r} ${r} 0 0 ${luna.fase < 0.5 ? 0 : 1} ${cx} ${cy + r} ` +
        `A${Math.abs(r * k)} ${r} 0 0 ${k < 0 ? (luna.fase < 0.5 ? 0 : 1) : (luna.fase < 0.5 ? 1 : 0)} ${cx} ${cy - r} Z`);
      this.fase.setAttribute('opacity', luna.altezza < -0.05 ? 0.2 : 0.75);
    }

    // il cono di dove guarda la camera: un settore largo mezzo quadrante
    const a = Math.atan2(vista.x, -vista.z), ap = 0.45;
    const p = (ang, rr) => `${(C + Math.sin(ang) * rr).toFixed(1)} ${(C - Math.cos(ang) * rr).toFixed(1)}`;
    this.camera.setAttribute('d', `M${C} ${C} L${p(a - ap, R)} A${R} ${R} 0 0 1 ${p(a + ap, R)} Z`);

    if (orologio !== this._ora) { this.testoOra.textContent = orologio; this._ora = orologio; }
    if (auto !== this._auto) { this.bCiclo.textContent = auto ? '⏸' : '▶'; this._auto = auto; }
    // ⚠ NON SI RISCRIVE LA BARRA MENTRE LA SI TRASCINA: il valore che si scrive
    // farebbe saltare il cursore sotto il dito. Si aggiorna solo se il ciclo
    // sta muovendo l'ora per conto suo.
    if (auto) { const v = Math.round(t * 1000); if (v !== Number(this.barra.value)) this.barra.value = v; }
    if (giorno !== undefined && Number(this.barraAnno.value) !== giorno) this.barraAnno.value = giorno;
    if (data !== this._data) { this.testoData.textContent = data; this._data = data; }
    if (stagione !== this._st) { this.stagione(stagione); this._st = stagione; }
  }
}

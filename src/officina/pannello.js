// Officina — IL PANNELLO.
//
// Un solo pannello, generato dallo schema (schema.js), che parla al gioco solo
// attraverso il bus dei comandi (comandi.js). Sul telefono è un foglio in
// basso; con il mouse è una colonna a destra. In entrambi i casi la scena resta
// libera per la camera: il pannello prende i tocchi SOLO sulla sua area.
//
// ⚠ ZERO DIPENDENZE, DI PROPOSITO. Una libreria di widget (Tweakpane, lil-gui)
// farebbe lo stesso in meno righe, ma qui il pannello deve: stare su un
// telefono a una mano, non rubare i tasti al gioco, ridisegnare il valore VERO
// letto dalla scena ogni mezzo secondo. Sono tre requisiti che con una libreria
// si combattono; a mano sono trecento righe che si leggono.

import { mostra, interpreta } from './schema.js';

const CSS = `
#officina { --inch: #0d2a1a; --carta: rgba(255,255,255,.94); --riga: rgba(13,42,26,.12); --acceso: #0d2a1a; --accesoTesto: #eaf6ef;
  --tenue: rgba(13,42,26,.06); --tenue2: rgba(13,42,26,.13); --campo: #fff; --esito: rgba(13,42,26,.035); --fuoco: #2f7d4f; --ombra: 0 4px 24px rgba(13,42,26,.16);
  position: fixed; z-index: 40; font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--inch);
  right: 8px; bottom: 8px; width: min(380px, calc(100vw - 16px)); pointer-events: none; }
/* ⚠ IL TEMA SCURO È DELL'EDITOR, NON DEL GIOCO: il pannello dentro la shell deve
   dire «sei fuori dal gioco». Stessi controlli, altra carta. */
#officina.scuro { --inch: #dfe8e2; --carta: #151c18; --riga: rgba(223,232,226,.12); --acceso: #79b8ff; --accesoTesto: #0b1a2b;
  --tenue: rgba(223,232,226,.07); --tenue2: rgba(223,232,226,.15); --campo: #0f1512; --esito: rgba(223,232,226,.05); --fuoco: #79b8ff; --ombra: none; }
#officina * { box-sizing: border-box; }
#officina .off-tasto { pointer-events: auto; position: absolute; right: 0; bottom: 0; font: inherit; font-weight: 700;
  color: var(--inch); background: var(--carta); border: 1px solid var(--riga); border-radius: 8px; padding: 7px 11px; cursor: pointer;
  box-shadow: var(--ombra); white-space: pre; }
#officina.aperta .off-tasto { display: none; }
#officina .off-corpo { display: none; pointer-events: auto; width: 100%; min-width: 0; background: var(--carta); border: 1px solid var(--riga); border-radius: 10px;
  box-shadow: var(--ombra); max-height: min(78vh, 720px); overflow: hidden; flex-direction: column; touch-action: pan-y; }
#officina.aperta .off-corpo { display: flex; }
/* incassato: dentro la shell dell'editor, niente finestra flottante */
#officina.incassato { position: static; width: auto; height: 100%; pointer-events: auto; }
#officina.incassato .off-tasto { display: none; }
#officina.incassato .off-corpo { display: flex; height: 100%; max-height: none; border: 0; border-radius: 0; box-shadow: none; animation: none; }
#officina.incassato [data-fa=chiudi], #officina.incassato .off-vivi { display: none; }
#officina header { display: flex; align-items: center; gap: 6px; padding: 7px 8px 6px; border-bottom: 1px solid var(--riga); }
#officina header .off-vivi { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
#officina header .off-vivi b { font-size: 14px; }
#officina header .off-spazio { flex: 1; }
#officina header button { font: inherit; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga);
  border-radius: 6px; padding: 3px 7px; cursor: pointer; min-width: 30px; }
#officina header button:disabled { opacity: .35; cursor: default; }
#officina nav { display: flex; gap: 4px; padding: 6px 8px; overflow-x: auto; border-bottom: 1px solid var(--riga); scrollbar-width: none; }
#officina.incassato nav { flex-wrap: wrap; overflow: visible; }   /* nel dock c'è spazio in altezza: le schede vanno a capo invece di sparire a destra */
#officina nav button { font: inherit; font-size: 11px; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga);
  border-radius: 999px; padding: 4px 10px; white-space: nowrap; cursor: pointer; flex: 0 0 auto; }
#officina nav button.acceso { background: var(--acceso); border-color: var(--acceso); color: var(--accesoTesto); }
#officina .off-campi { overflow: auto; padding: 6px 10px 10px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 7px; min-width: 0; flex: 1; align-content: start; }   /* ⚠ align-content: start — nel dock alto le righe della griglia si stiravano a riempirlo: un campo ogni cento pixel */
#officina .off-nota { font-size: 11px; opacity: .72; margin: 2px 0 4px; white-space: pre-wrap; }
#officina .campo { display: grid; grid-template-columns: minmax(0, 1fr); gap: 3px; min-width: 0; }
#officina .campo .riga { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
#officina .campo .nome { min-width: 0; flex: 1 1 auto; }
#officina .campo .valore { font-variant-numeric: tabular-nums; opacity: .85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 62%; flex: 0 1 auto; }
#officina .campo small { display: block; font-size: 10.5px; opacity: .62; line-height: 1.35; }
#officina input[type=range] { width: 100%; accent-color: var(--acceso); margin: 0; height: 22px; }
#officina select, #officina input[type=text] { font: inherit; color: var(--inch); background: var(--campo); border: 1px solid var(--riga); border-radius: 6px; padding: 4px 6px; max-width: 58%; }
#officina input[type=color] { width: 44px; height: 26px; border: 1px solid var(--riga); border-radius: 6px; padding: 0; background: none; }
#officina .interruttore { font: inherit; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga); border-radius: 999px; padding: 3px 10px; cursor: pointer; min-width: 44px; }
#officina .interruttore.acceso { background: var(--acceso); border-color: var(--acceso); color: var(--accesoTesto); }
#officina .azione { font: inherit; font-weight: 600; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga); border-radius: 7px; padding: 6px 10px; cursor: pointer; text-align: left; }
#officina .azione:active { background: var(--tenue2); }
#officina .off-esito { margin: 0; padding: 7px 10px; border-top: 1px solid var(--riga); max-height: 34%; overflow: auto; font-size: 11px; white-space: pre-wrap; user-select: text; background: var(--esito); }
#officina button:focus-visible, #officina input:focus-visible, #officina select:focus-visible { outline: 2px solid var(--fuoco); outline-offset: 1px; }
@media (max-width: 720px), (pointer: coarse) {
  #officina:not(.incassato) { right: 6px; left: 6px; bottom: 6px; width: auto; }
  #officina:not(.incassato) .off-corpo { max-height: 62vh; }
}
@media (prefers-reduced-motion: no-preference) { #officina:not(.incassato) .off-corpo { animation: off-sale .16s ease-out; } }
@keyframes off-sale { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
`;

export class Pannello {
  constructor({ registri, bus, vivi, radice = document.body, titolo = 'Officina', contenitore = null, scuro = false }) {
    this.registri = registri;
    this.bus = bus;
    this._vivi = vivi || (() => '');
    this.attivo = registri[0] && registri[0].chiave;
    this._el = {};
    this.incassato = !!contenitore;
    this._costruisci(contenitore || radice, titolo, scuro);
    this._orologio = setInterval(() => this.aggiorna(), 500);
    bus.osserva(() => this.aggiorna(true));
  }

  apri(si = true) { if (this.incassato) si = true; this.radice.classList.toggle('aperta', si); if (si) this.aggiorna(true); }
  get aperto() { return this.incassato || this.radice.classList.contains('aperta'); }

  // Testo nel riquadro sotto i campi (misure, preset esportati). Resta finché
  // non lo si sostituisce: è fatto per essere letto, copiato, fotografato.
  esito(testo) { this._el.esito.hidden = !testo; this._el.esito.textContent = testo || ''; }

  _costruisci(radice, titolo, scuro) {
    if (!document.getElementById('officina-stile')) {
      const s = document.createElement('style'); s.id = 'officina-stile'; s.textContent = CSS; document.head.appendChild(s);
    }
    const r = (this.radice = document.createElement('div')); r.id = 'officina';
    if (this.incassato) r.classList.add('incassato', 'aperta');
    if (scuro) r.classList.add('scuro');
    r.innerHTML = `
      <button class="off-tasto" type="button" aria-label="apri ${titolo}">⚙ ${titolo}</button>
      <div class="off-corpo" role="dialog" aria-label="${titolo}">
        <header>
          <div class="off-vivi">…</div>
          <span class="off-spazio"></span>
          <button type="button" data-fa="annulla" title="annulla">↶</button>
          <button type="button" data-fa="ripeti" title="ripeti">↷</button>
          <button type="button" data-fa="chiudi" title="chiudi">✕</button>
        </header>
        <nav></nav>
        <div class="off-campi"></div>
        <pre class="off-esito" hidden></pre>
      </div>`;
    radice.appendChild(r);
    this._el.tasto = r.querySelector('.off-tasto');
    this._el.vivi = r.querySelector('.off-vivi');
    this._el.nav = r.querySelector('nav');
    this._el.campi = r.querySelector('.off-campi');
    this._el.esito = r.querySelector('.off-esito');
    this._el.annulla = r.querySelector('[data-fa=annulla]');
    this._el.ripeti = r.querySelector('[data-fa=ripeti]');

    this._el.tasto.addEventListener('click', () => this.apri(true));
    r.querySelector('[data-fa=chiudi]').addEventListener('click', () => this.apri(false));
    this._el.annulla.addEventListener('click', () => this.bus.annulla());
    this._el.ripeti.addEventListener('click', () => this.bus.ripeti());

    // ⚠ I TASTI PREMUTI NEL PANNELLO NON DEVONO ARRIVARE AL GIOCO (K cambia la
    // qualità, H lo stile dell'acqua, spazio salta): il gioco ascolta su window,
    // e fermare la propagazione qui basta. Esc chiude.
    r.addEventListener('keydown', (e) => { if (e.key === 'Escape') this.apri(false); e.stopPropagation(); });
    r.addEventListener('keyup', (e) => e.stopPropagation());
    // e nemmeno la rotella deve zoomare la camera mentre si scorre la lista
    r.querySelector('.off-corpo').addEventListener('wheel', (e) => e.stopPropagation(), { passive: true });

    for (const reg of this.registri) {
      const b = document.createElement('button'); b.type = 'button'; b.textContent = reg.nome; b.dataset.chiave = reg.chiave;
      b.addEventListener('click', () => { this.attivo = reg.chiave; this._disegnaScheda(); });
      this._el.nav.appendChild(b);
    }
    this._disegnaScheda();
  }

  _disegnaScheda() {
    for (const b of this._el.nav.children) b.classList.toggle('acceso', b.dataset.chiave === this.attivo);
    const reg = this.registri.find((x) => x.chiave === this.attivo);
    const box = this._el.campi; box.innerHTML = ''; this._controlli = [];
    if (!reg) return;
    if (reg.nota) { const n = document.createElement('div'); n.className = 'off-nota'; n.textContent = reg.nota; box.appendChild(n); }
    for (const campo of reg.campi) box.appendChild(this._controllo(reg, campo));
    this.aggiorna(true);
  }

  _controllo(reg, campo) {
    const w = document.createElement('div'); w.className = 'campo'; w.dataset.campo = campo.chiave;
    const riga = document.createElement('div'); riga.className = 'riga';
    const nome = document.createElement('span'); nome.className = 'nome'; nome.textContent = campo.nome;
    riga.appendChild(nome); w.appendChild(riga);
    const scrivi = (prima, dopo) => this.bus.esegui({ registro: reg.chiave, campo: campo.chiave, prima, dopo });
    const ctl = { campo, el: null, mostra: null, tocco: false };

    switch (campo.tipo) {
      case 'numero': {
        const val = document.createElement('span'); val.className = 'valore'; riga.appendChild(val);
        const inp = document.createElement('input'); inp.type = 'range'; inp.min = campo.min; inp.max = campo.max; inp.step = campo.passo;
        let prima;
        inp.addEventListener('input', () => { if (prima === undefined) prima = campo.leggi(); ctl.tocco = true; const v = Number(inp.value); val.textContent = mostra(campo, v); this.bus.aVista(reg.chiave, campo.chiave, v); });
        inp.addEventListener('change', () => { const v = Number(inp.value); ctl.tocco = false; const p = prima === undefined ? campo.leggi() : prima; prima = undefined; scrivi(p, v); });
        w.appendChild(inp); ctl.el = inp; ctl.mostra = (v) => { if (!ctl.tocco) { inp.value = v; val.textContent = mostra(campo, v); } };
        break;
      }
      case 'interruttore': {
        const b = document.createElement('button'); b.type = 'button'; b.className = 'interruttore';
        b.addEventListener('click', () => { const p = !!campo.leggi(); scrivi(p, !p); });
        riga.appendChild(b); ctl.el = b; ctl.mostra = (v) => { b.classList.toggle('acceso', !!v); b.textContent = v ? 'sì' : 'no'; };
        break;
      }
      case 'scelta': {
        const s = document.createElement('select');
        for (const o of campo.scelte) { const op = document.createElement('option'); op.value = String(o.v); op.textContent = o.nome; s.appendChild(op); }
        s.addEventListener('change', () => scrivi(campo.leggi(), interpreta(campo, s.value)));
        riga.appendChild(s); ctl.el = s; ctl.mostra = (v) => { s.value = String(v); };
        break;
      }
      case 'colore': {
        const c = document.createElement('input'); c.type = 'color'; let prima;
        c.addEventListener('input', () => { if (prima === undefined) prima = campo.leggi(); this.bus.aVista(reg.chiave, campo.chiave, c.value); });
        c.addEventListener('change', () => { const p = prima === undefined ? campo.leggi() : prima; prima = undefined; scrivi(p, c.value); });
        riga.appendChild(c); ctl.el = c; ctl.mostra = (v) => { if (document.activeElement !== c) c.value = v || '#000000'; };
        break;
      }
      case 'testo': {
        const t = document.createElement('input'); t.type = 'text'; t.readOnly = !campo.scrivi;
        t.addEventListener('change', () => campo.scrivi && scrivi(campo.leggi(), t.value));
        riga.appendChild(t); ctl.el = t; ctl.mostra = (v) => { if (document.activeElement !== t) t.value = v ?? ''; };
        break;
      }
      case 'lettura': {
        const val = document.createElement('span'); val.className = 'valore'; riga.appendChild(val);
        ctl.mostra = (v) => { val.textContent = mostra(campo, v); };
        break;
      }
      case 'azione': {
        w.removeChild(riga);
        const b = document.createElement('button'); b.type = 'button'; b.className = 'azione'; b.textContent = campo.nome;
        b.addEventListener('click', async () => { b.disabled = true; try { await campo.fai(this); } finally { b.disabled = false; this.aggiorna(true); } });
        w.appendChild(b); ctl.el = b;
        break;
      }
    }
    if (campo.nota) { const n = document.createElement('small'); n.textContent = campo.nota; w.appendChild(n); }
    this._controlli.push(ctl);
    return w;
  }

  // Ridisegna i valori VERI. `forza` salta il risparmio quando il pannello è chiuso.
  aggiorna(forza = false) {
    this._el.tasto.textContent = `⚙ ${this._vivi(true) || 'Officina'}`;
    if (!this.aperto && !forza) return;
    this._el.vivi.innerHTML = this._vivi(false) || '';
    this._el.annulla.disabled = !this.bus.puoAnnullare;
    this._el.ripeti.disabled = !this.bus.puoRipetere;
    for (const c of this._controlli || []) {
      if (!c.mostra || c.tocco) continue;
      try { c.mostra(c.campo.leggi()); } catch (e) { if (c.el) c.el.title = String(e); }
    }
  }
}

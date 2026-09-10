// IL TASTO ⚡ OMEGA TEST — sotto 🩺 diagnosi, e per la stessa ragione.
//
// ⚠ IL COMMITTENTE: «voglio proprio un tasto nuovo sotto Diagnosi chiamato Omega
// Test». È la QUARTA volta che questo progetto paga la stessa lezione (la
// qualità si ciclava solo con `K`, le acque solo con `A`, la diagnostica si
// mandava da console) e la ragione è sempre la stessa: **il telefono è il posto
// dove i difetti si vedono per primi, ed è l'unico dove non si può digitare
// niente**. Un banco che si avvia scrivendo `?omega` nell'indirizzo, su un
// telefono, non si avvia mai.
//
// ⚠ E STA SOTTO 🩺 PERCHÉ FINISCE DENTRO 🩺: il banco produce numeri, e i numeri
// devono tornare indietro. Il bottone qui accanto è il canale che esiste già.
//
// ⚠ SI FA IN DUE MOSSE, e la prima è un ricaricamento. L'abominio vuole un mondo
// suo (il generatore `?omega`): montarlo dentro una partita in corso vorrebbe
// dire misurare mezz'ora di terreno normale con duemila blocchi appiccicati
// sopra, cioè un'altra cosa. Quindi da una partita normale il tasto PORTA nel
// banco (`?omega&banco`), e lì parte da solo.
import { Ritmo } from '../partita/ritmo.js';

const STILE = `
#omegaBtn {
  position: fixed; left: 8px; z-index: 30; height: 34px; padding: 0 11px 0 9px;
  border-radius: 17px; cursor: pointer; white-space: nowrap;
  border: 2px solid rgba(13,42,26,.22); background: rgba(255,255,255,.92);
  font: 600 12px/1 system-ui, sans-serif; color: #0d2a1a;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(13,42,26,.14);
  -webkit-tap-highlight-color: transparent; user-select: none;
  top: calc(46% + 84px);
}
#omegaBtn b { font: 15px/1 system-ui, sans-serif; }
#omegaBtn:hover { background: #fff; }
#omegaBtn.corso { background: #2a1a4d; color: #fff; border-color: #2a1a4d; }
.gui-tocco #omegaBtn { height: 42px; padding: 0 14px 0 11px; font-size: 13px; border-radius: 21px; top: 108px; }
.gui-tocco #omegaBtn b { font-size: 18px; }

#omegaPan { position: fixed; inset: auto 12px 12px 12px; z-index: 41;
  max-width: 560px; margin: 0 auto; padding: 12px 14px; border-radius: 12px;
  background: rgba(255,255,255,.97); border: 1px solid rgba(13,42,26,.18);
  font: 13px/1.5 system-ui, sans-serif; color: #0d2a1a; display: none;
  box-shadow: 0 6px 24px rgba(13,42,26,.18); max-height: 72vh; overflow: auto; }
#omegaPan.aperto { display: block; }
#omegaPan h4 { margin: 0 0 6px; font-size: 14px; }
#omegaPan p { margin: 0 0 8px; color: #3c5a4a; }
#omegaPan .righe { display: flex; gap: 8px; margin-top: 8px; }
#omegaPan button { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(13,42,26,.22); background: #fff; font: 13px system-ui, sans-serif; }
#omegaPan button.primo { background: #2a1a4d; color: #fff; border-color: #2a1a4d; }
#omegaPan pre { margin: 8px 0 0; font: 11px/1.45 ui-monospace, monospace; white-space: pre;
  overflow-x: auto; background: #f4f6f4; padding: 8px; border-radius: 6px; }
/* ⚠ LA BARRA È UN NUMERO, NON UNA DECORAZIONE: il banco dura minuti e senza
   sapere quanto manca si crede che si sia piantato, e si ricarica la pagina
   proprio mentre stava misurando. */
#omegaPan .barra { height: 8px; border-radius: 4px; background: #e3e7e3; overflow: hidden; margin: 6px 0; }
#omegaPan .barra i { display: block; height: 100%; background: #2a1a4d; width: 0; transition: width .2s; }
#omegaPan .voce { font: 12px/1.5 ui-monospace, monospace; color: #3c5a4a; }
#omegaPan .verdetto { margin-top: 8px; padding: 8px; border-radius: 6px; background: #f2eef8; border: 1px solid #d8cdeb; }
`;

export class TastoOmega {
  /**
   * @param opz.inBanco   siamo già nel mondo dell'omega test?
   * @param opz.vaiAlBanco  () → porta nel banco (di solito un cambio di indirizzo)
   * @param opz.avvia     () → fa partire il banco; torna il BancoOmega
   * @param opz.ferma     () → lo interrompe
   * @param opz.manda     (testo) → lo consegna al 🩺 (facoltativo)
   */
  constructor({ inBanco = false, vaiAlBanco = null, avvia = null, ferma = null, manda = null } = {}) {
    this.inBanco = inBanco;
    this.vaiAlBanco = vaiAlBanco;
    this._avvia = avvia;
    this._ferma = ferma;
    this.manda = manda;
    this.banco = null;

    const stile = document.createElement('style');
    stile.textContent = STILE;
    document.head.appendChild(stile);

    this.nodo = document.createElement('div');
    this.nodo.id = 'omegaBtn';
    this.nodo.innerHTML = '<b>&#9889;</b> omega test';
    this.nodo.title = 'Il banco di tortura: migliaia di blocchi e arredi unici, luci colorate, framepacing';
    document.body.appendChild(this.nodo);
    this.nodo.addEventListener('click', () => this.apri());

    this.pan = document.createElement('div');
    this.pan.id = 'omegaPan';
    document.body.appendChild(this.pan);
  }

  apri() {
    this.pan.classList.add('aperto');
    if (this.banco && this.banco.inCorso) this._disegnaCorso();
    else if (this.banco && this.banco.fase === 'finito') this._disegnaEsito();
    else this._disegnaInvito();
  }

  chiudi() { this.pan.classList.remove('aperto'); }

  _disegnaInvito() {
    const dentro = this.inBanco;
    this.pan.innerHTML = `
      <h4>&#9889; Omega Test</h4>
      <p>Il banco di tortura: <b>duemila blocchi unici</b> (tavolozza e materia proprie),
      fino a <b>mille arredi unici</b> (una mesh diversa ognuno, cioè un disegno ognuno),
      <b>luci colorate fitte</b>, i corpi della fisica, e per ultima la
      <b>prova AR</b> — la scena disegnata due volte per fotogramma, che è il budget
      vero dell'AR.</p>
      <p>Sale a gradini e misura ognuno da solo: serve a sapere <b>dove si rompe</b>,
      non se regge tutto. Dura circa quattro minuti; non toccare niente mentre gira.</p>
      ${dentro ? '' : '<p><b>Serve il mondo dell\'omega test</b>: la pagina si ricarica e il banco parte da solo.</p>'}
      <div class="righe">
        <button class="primo" id="omegaVai">${dentro ? 'Avvia il banco' : 'Vai al banco e avvia'}</button>
        <button id="omegaChiudi">Chiudi</button>
      </div>`;
    this.pan.querySelector('#omegaChiudi').onclick = () => this.chiudi();
    this.pan.querySelector('#omegaVai').onclick = () => {
      if (!dentro) { if (this.vaiAlBanco) this.vaiAlBanco(); return; }
      this.banco = this._avvia && this._avvia();
      this.nodo.classList.add('corso');
      this._disegnaCorso();
    };
  }

  _disegnaCorso() {
    const b = this.banco;
    const g = b && b.gradino;
    this.pan.innerHTML = `
      <h4>&#9889; Omega Test &mdash; in corso</h4>
      <div class="barra"><i style="width:${((b ? b.avanzamento : 0) * 100).toFixed(1)}%"></i></div>
      <div class="voce" id="omegaVoce">${g ? `${escapa(g.nome)} &middot; ${b.fase === 'riscaldo' ? 'riscaldo' : 'misura'}` : ''}</div>
      <p class="voce">${g ? escapa(g.spiega) : ''}</p>
      <pre id="omegaFin">${escapa((b ? b.righe() : []).join('\n')) || '(ancora niente)'}</pre>
      <div class="righe">
        <button id="omegaStop">Ferma</button>
        <button id="omegaChiudi">Nascondi</button>
      </div>`;
    this.pan.querySelector('#omegaChiudi').onclick = () => this.chiudi();
    this.pan.querySelector('#omegaStop').onclick = () => {
      if (this._ferma) this._ferma();
      this.nodo.classList.remove('corso');
      this._disegnaInvito();
    };
  }

  /** Da chiamare a ogni fotogramma: aggiorna la barra senza rifare il pannello. */
  aggiorna() {
    const b = this.banco;
    if (!b || !this.pan.classList.contains('aperto')) return;
    if (b.fase === 'finito') { if (!this._giaFinito) { this._giaFinito = true; this.nodo.classList.remove('corso'); this._disegnaEsito(); } return; }
    if (!b.inCorso) return;
    // ⚠ SI TOCCANO SOLO I TRE NODI CHE CAMBIANO: rifare l'innerHTML a ogni
    // fotogramma vorrebbe dire ricostruire il DOM sessanta volte al secondo
    // DENTRO la misura — cioè misurare il pannello invece del motore.
    const barra = this.pan.querySelector('.barra i');
    if (barra) barra.style.width = `${(b.avanzamento * 100).toFixed(1)}%`;
    const voce = this.pan.querySelector('#omegaVoce');
    const g = b.gradino;
    if (voce && g) voce.innerHTML = `${escapa(g.nome)} &middot; ${b.fase === 'riscaldo' ? 'riscaldo' : 'misura'}`;
    const fin = this.pan.querySelector('#omegaFin');
    if (fin && this._nEsiti !== b.esiti.length) { this._nEsiti = b.esiti.length; fin.textContent = b.righe().join('\n') || '(ancora niente)'; }
  }

  /** Il rapporto in testo: quello che finisce nel 🩺 e negli appunti. */
  testo() {
    const b = this.banco;
    if (!b || !b.esiti.length) return '';
    const v = b.verdetto();
    const righe = ['OMEGA TEST', ...b.righe(), ''];
    if (v) {
      righe.push(`ultimo gradino buono: ${v.ultimoBuono || 'nessuno'}`);
      righe.push(`si rompe a:           ${v.primoRotto || 'mai'}`);
      if (v.prezzoCarico) righe.push(`il carico pieno costa ${v.soloPavimento ? 'almeno ' : ''}${v.prezzoCarico.toFixed(2)}x il mondo nudo`);
      if (v.prezzoAr) righe.push(`la doppia resa (AR) costa ${v.prezzoAr.toFixed(2)}x`);
      righe.push(`il collo di bottiglia e': ${v.collo === 'ritmo' ? 'IL RITMO (singhiozzi), non i fotogrammi' : 'I FOTOGRAMMI (si disegna troppo)'}`);
      if (v.agganciato) righe.push('⚠ a riposo il ritmo e\' AGGANCIATO ALLO SCHERMO: il p50 del riposo e\' il pannello e non il motore, quindi i rapporti qui sopra sono PAVIMENTI');
    }
    return righe.join('\n');
  }

  _disegnaEsito() {
    const b = this.banco, v = b.verdetto();
    this.pan.innerHTML = `
      <h4>&#9889; Omega Test &mdash; finito</h4>
      <pre>${escapa(b.righe().join('\n'))}</pre>
      ${v ? `<div class="verdetto">
        <div><b>Ultimo gradino buono:</b> ${escapa(v.ultimoBuono || 'nessuno')}</div>
        <div><b>Si rompe a:</b> ${escapa(v.primoRotto || 'mai')}</div>
        ${v.prezzoCarico ? `<div><b>Il carico pieno costa</b> ${v.soloPavimento ? 'almeno ' : ''}${v.prezzoCarico.toFixed(2)}&times; il mondo nudo</div>` : ''}
        ${v.prezzoAr ? `<div><b>La doppia resa (AR) costa</b> ${v.prezzoAr.toFixed(2)}&times;</div>` : ''}
        <div><b>Collo di bottiglia:</b> ${v.collo === 'ritmo' ? 'il RITMO (singhiozzi), non i fotogrammi' : 'i FOTOGRAMMI (si disegna troppo)'}</div>
        ${v.agganciato ? '<div>&#9888; a riposo il ritmo &egrave; agganciato allo schermo: quel p50 &egrave; il pannello, non il motore</div>' : ''}
      </div>` : ''}
      <div class="righe">
        ${this.manda ? '<button class="primo" id="omegaManda">Manda col &#129658;</button>' : ''}
        <button id="omegaCopia">Copia</button>
        <button id="omegaChiudi">Chiudi</button>
      </div>`;
    this.pan.querySelector('#omegaChiudi').onclick = () => this.chiudi();
    this.pan.querySelector('#omegaCopia').onclick = () => { navigator.clipboard?.writeText(this.testo()); };
    const m = this.pan.querySelector('#omegaManda');
    if (m) m.onclick = () => this.manda(this.testo());
  }
}

function escapa(s) {
  return String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
}

export { Ritmo };

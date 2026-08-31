// IL BOTTONE 🩺 — «manda tutto a Claude», in un tocco.
//
// ⚠ Committente: «non riesci a creare un bottone manda diagnostica, così in
// automatico ti arriva tutto?». Fin qui il canale era uno scatto dello schermo
// mandato a mano, e aveva due difetti: nel pannello ci sta quello che ci sta
// (non quello che serve a quella domanda lì), e uno scatto è un ISTANTE — non
// dice che il gradino di qualità è sceso tre volte in un minuto, che è
// esattamente il genere di cosa che spiega un difetto.
//
// ⚠ E IL GETTONE NON STA NEL CODICE. Una chiave scritta qui dentro sarebbe
// leggibile da chiunque apra la pagina: la si incolla UNA VOLTA per dispositivo
// e resta nel «localStorage» di quel coso. Chi la stampa è il collettore
// («strumenti/diagnostica.mjs»), che è l'unico posto dove esiste davvero.

import { costruisciRapporto, pesoKB } from './rapporto.js';
import { manda as mandaAlCanale } from './canale.js';

const CHIAVE_LOCALE = 'leafy.diagnostica.chiave';

const STILE = `
/* ⚠ UNA PILLOLA CON LA SCRITTA, NON UN'ICONA MUTA. La prima versione erano due
   tondini da 34 px sul bordo sinistro, semitrasparenti, sopra una scena piena di
   verde: sul telefono il committente non li ha proprio VISTI — «non vedo il
   tasto per la diagnosi e dove mettere poi la password». Un'icona da sola
   chiede di indovinare cosa fa; una parola no. E costa una manciata di pixel di
   larghezza in una fascia dello schermo che è comunque vuota. */
#diag, #modoGui {
  position: fixed; left: 8px; z-index: 30; height: 34px; padding: 0 11px 0 9px;
  border-radius: 17px; cursor: pointer; white-space: nowrap;
  border: 2px solid rgba(13,42,26,.22); background: rgba(255,255,255,.92);
  font: 600 12px/1 system-ui, sans-serif; color: #0d2a1a;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(13,42,26,.14);
  -webkit-tap-highlight-color: transparent; user-select: none;
}
#diag b, #modoGui b { font: 15px/1 system-ui, sans-serif; }
#diag { top: calc(46% + 42px); }
#modoGui { top: 46%; }
#diag:hover, #modoGui:hover { background: #fff; }
#diag.corso { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
/* ⚠ ACCESO = SCELTA A MANO. Quando segue il browser resta smorto: se no non si
   distingue «l'ho deciso io» da «l'ha indovinato lui», e sono due cose diverse
   nel momento in cui una va bene e l'altra no. */
#modoGui.fissato { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
/* a dito tutto cresce: il bersaglio dev'essere un bersaglio per un pollice */
.gui-tocco #diag, .gui-tocco #modoGui { height: 42px; padding: 0 14px 0 11px; font-size: 13px; border-radius: 21px; }
.gui-tocco #diag b, .gui-tocco #modoGui b { font-size: 18px; }
.gui-tocco #diag { top: calc(46% + 50px); }

#diagPanel { position: fixed; inset: auto 12px 12px 12px; z-index: 40;
  max-width: 420px; margin: 0 auto; padding: 12px 14px; border-radius: 12px;
  background: rgba(255,255,255,.97); border: 1px solid rgba(13,42,26,.18);
  font: 13px/1.5 system-ui, sans-serif; color: #0d2a1a; display: none;
  box-shadow: 0 6px 24px rgba(13,42,26,.18); }
#diagPanel.aperto { display: block; }
#diagPanel h4 { margin: 0 0 6px; font-size: 14px; }
#diagPanel p { margin: 0 0 8px; color: #3c5a4a; }
#diagPanel input { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px;
  border: 1px solid rgba(13,42,26,.25); font: 13px ui-monospace, monospace; margin-bottom: 8px; }
/* ⚠ IL CAMPO DELLA PASSWORD SI DEVE VEDERE CHE È QUELLO: committente, «dove
   mettere poi la password per mandartelo». Bordo scuro e sfondo appena tinto. */
#diagPanel input#diagChiave { border: 2px solid #0d2a1a; background: #f4f8f5; }
#diagPanel .righe { display: flex; gap: 8px; }
#diagPanel button { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(13,42,26,.22); background: #fff; font: 13px system-ui, sans-serif; }
#diagPanel button.primo { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
#diagPanel .esito { margin-top: 8px; font: 12px ui-monospace, monospace; white-space: pre-wrap; }
`;

export class Diagnostica {
  /**
   * @param leggi   () → l'oggetto di letture per «costruisciRapporto»
   * @param scatta  () → Promise<dataURL|null>, la figura (facoltativa)
   */
  constructor(leggi, scatta) {
    this.leggi = leggi;
    this.scatta = scatta;
    // ⚠ GLI ERRORI SI RACCOLGONO DA SUBITO, non da quando si preme il bottone:
    // quello che serve capire è quasi sempre successo PRIMA che qualcuno
    // decidesse di mandare un rapporto.
    this.errori = [];
    addEventListener('error', (e) => this._errore(e.error || e.message));
    addEventListener('unhandledrejection', (e) => this._errore(e.reason));

    const stile = document.createElement('style');
    stile.textContent = STILE;
    document.head.appendChild(stile);

    this.nodo = document.createElement('div');
    this.nodo.id = 'diag';
    this.nodo.innerHTML = '<b>🩺</b> diagnosi';
    this.nodo.title = 'Manda la diagnostica';
    document.body.appendChild(this.nodo);
    this.nodo.addEventListener('click', () => this.apri());

    this.pannello = document.createElement('div');
    this.pannello.id = 'diagPanel';
    document.body.appendChild(this.pannello);
  }

  _errore(e) {
    const t = e && e.stack ? e.stack : String(e);
    this.errori.push(t);
    if (this.errori.length > 40) this.errori.shift();
  }

  get chiave() {
    try { return localStorage.getItem(CHIAVE_LOCALE) || ''; } catch { return ''; }
  }
  set chiave(v) {
    try { localStorage.setItem(CHIAVE_LOCALE, v); } catch { /* navigazione privata */ }
  }

  apri() {
    const p = this.pannello;
    p.classList.add('aperto');
    // ⚠ IL CAMPO DELLA NOTA C'È SEMPRE, ed è la parte più utile del rapporto:
    // i numeri dicono COSA sta succedendo, la riga scritta a mano dice cosa si
    // stava facendo. «stavo girando la camera sul bosco» vale più di dieci
    // campi in più.
    p.innerHTML = `
      <h4>Manda la diagnostica</h4>
      <p>${this.chiave
        ? 'Numeri, storia degli fps, errori e uno scatto. Niente di personale.'
        : '<b>Serve la password.</b> Non è un lucchetto: è l\'indirizzo dove finisce il rapporto. Si mette una volta sola su questo dispositivo.'}</p>
      <input id="diagNota" placeholder="Cosa stavi facendo? (facoltativo)" maxlength="200">
      <!-- ⚠ LO SCATTO È UTILISSIMO E COSTOSO INSIEME, quindi si sceglie. Con la
           figura il rapporto sta sui 60 KB e sul cloud diventa un ALLEGATO, che
           dura tre ore invece di dodici; senza sono due kilobyte, cioè davvero
           «un messaggio». Chi manda dal treno e mi scrive dopo mezza giornata
           deve poter togliere la figura. -->
      <label style="display:flex;gap:7px;align-items:center;margin:-2px 0 9px;color:#3c5a4a">
        <input type="checkbox" id="diagScatto" checked style="width:auto;margin:0">
        con lo scatto della scena (più pesante, dura meno)
      </label>
      ${this.chiave ? '' : '<input id="diagChiave" placeholder="password (una volta per dispositivo)" ' +
        // ⚠ LE TASTIERE DEI TELEFONI CI METTONO LE MANI: maiuscola automatica
        // sulla prima lettera, correttore, completamento. Una chiave digitata
        // su un telefono arriva diversa da com'è stata scritta, e il rifiuto
        // poi sembra colpa del codice invece che della tastiera. Lo spazio in
        // coda lo toglie il «trim», di qua e di là.
        'autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false">'}
      <div class="righe">
        <button class="primo" id="diagVai">Manda</button>
        <button id="diagCopia">Copia</button>
        <button id="diagChiudi">Chiudi</button>
      </div>
      <div class="esito" id="diagEsito"></div>`;
    p.querySelector('#diagChiudi').onclick = () => p.classList.remove('aperto');
    p.querySelector('#diagCopia').onclick = () => this.vai(true);
    p.querySelector('#diagVai').onclick = () => this.vai(false);
    setTimeout(() => { const n = p.querySelector('#diagNota'); if (n) n.focus(); }, 30);
  }

  _dice(t) {
    const e = this.pannello.querySelector('#diagEsito');
    if (e) e.textContent = t;
  }

  async vai(soloCopia) {
    const campoChiave = this.pannello.querySelector('#diagChiave');
    if (campoChiave && campoChiave.value.trim()) this.chiave = campoChiave.value.trim();
    const nota = (this.pannello.querySelector('#diagNota') || {}).value || '';

    this.nodo.classList.add('corso');
    this._dice('preparo…');
    const vuoleScatto = (this.pannello.querySelector('#diagScatto') || {}).checked !== false;
    let scatto = null;
    if (vuoleScatto) {
      try { scatto = this.scatta ? await this.scatta() : null; } catch (e) { this._errore(e); }
    }

    const rapporto = costruisciRapporto({
      ...this.leggi(), quando: new Date().toISOString(), nota,
      errori: this.errori, scatto,
    });
    const peso = pesoKB(rapporto);
    const testo = JSON.stringify(rapporto, null, 1);

    if (soloCopia) {
      await this._negliAppunti(testo);
      this.nodo.classList.remove('corso');
      return;
    }

    // ---- 1) IL COLLETTORE IN CASA, se c'è ------------------------------------
    // ⚠ SI CHIEDE PRIMA SE C'È QUALCUNO, e non è un giro sprecato: se la pagina
    // è servita da un server normale, un POST a «/_diagnostica» non FALLISCE —
    // torna un onesto 404. Senza questa domanda il messaggio sarebbe «il
    // collettore ha detto no: 404», che è vero e non serve a niente: il
    // collettore non ha detto niente, non c'era.
    // ⚠ E VIENE PRIMA DEL CLOUD perché è meglio sotto ogni aspetto: il rapporto
    // resta sulla macchina, ci sta intero (scatto compreso) e non scade.
    let inCasa = false;
    try {
      const s = await fetch('/_diagnostica', { method: 'GET' });
      inCasa = s.ok && (await s.json().catch(() => ({}))).collettore === true;
    } catch { inCasa = false; }

    if (inCasa) {
      try {
        const r = await fetch('/_diagnostica', {
          method: 'POST',
          headers: { 'content-type': 'application/json', 'x-chiave': this.chiave },
          body: testo,
        });
        if (r.status === 403) { this._dice('password sbagliata.'); this.chiave = ''; }
        else if (r.status === 429) this._dice('troppi tentativi: riprova fra dieci minuti.');
        else if (!r.ok) this._dice('il collettore ha detto no: ' + r.status);
        else {
          const d = await r.json().catch(() => ({}));
          this._dice(`mandato in casa ✔  ${d.nome || ''}  (${peso} KB)`);
          setTimeout(() => this.pannello.classList.remove('aperto'), 1600);
        }
        this.nodo.classList.remove('corso');
        return;
      } catch { /* è caduto: si prova il cloud */ }
    }

    // ---- 2) IL CLOUD, che è il caso «sono fuori casa» -------------------------
    // ⚠ È QUI CHE SERVE LA PASSWORD DAVVERO. Non fa da lucchetto — il servizio
    // è pubblico e non chiede niente a nessuno — fa da INDIRIZZO: l'argomento
    // su cui il messaggio viene depositato si ricava da lei. Chi non la sa non
    // sa nemmeno dove guardare. Vedi «ui/canale.js».
    if (!this.chiave) {
      this._dice('serve la password: è l\'indirizzo dove finisce il rapporto.');
      this.nodo.classList.remove('corso');
      return;
    }
    try {
      const esito = await mandaAlCanale(this.chiave, testo);
      this._dice(esito.ok ? esito.dice + '\n(fuori casa: passa dal cloud)' : esito.dice);
      if (esito.ok) setTimeout(() => this.pannello.classList.remove('aperto'), 2200);
    } catch (e) {
      // ⚠ E SE NON C'È NEMMENO LA RETE si torna all'unico canale che non può
      // fallire: un file sul dispositivo, da mandare a mano. È il modo di prima,
      // e resta buono — solo che adesso è l'ultima spiaggia invece della prima.
      await this._negliAppunti(testo, 'niente rete. ');
    }
    this.nodo.classList.remove('corso');
  }

  async _negliAppunti(testo, premessa = '') {
    try {
      await navigator.clipboard.writeText(testo);
      this._dice(premessa + 'copiato negli appunti ✔\nincollalo nella chat.');
    } catch {
      // ⚠ GLI APPUNTI VOGLIONO UN CONTESTO SICURO (https o localhost) e un
      // gesto: da un indirizzo di rete in chiaro il permesso non c'è. Allora si
      // scarica un file, che funziona sempre.
      const b = new Blob([testo], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(b);
      a.download = 'leafy-diagnostica.json';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 4000);
      this._dice(premessa + 'scaricato come file ✔\nmandami quello.');
    }
  }
}

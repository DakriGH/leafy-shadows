// I COMANDI A TOCCO — muoversi con il dito.
//
// ⚠ MANCAVANO DEL TUTTO, e senza il gioco su un telefono non è giocabile: si
// poteva guardare e costruire, non camminare. Committente: «non appare alcun
// joystick e bottoni per muoversi con il touchscreen».
//
// ⚠ E OGNI COMANDO CATTURA IL SUO PUNTATORE (`setPointerCapture`), che è la
// riga senza cui joystick e tasti non funzionano INSIEME: senza cattura, il
// dito che esce dal cerchio del joystick smette di essere suo e il movimento si
// pianta a metà. È lo stesso accorgimento dei comandi a tocco di Leafy-Lantern.
//
// ⚠ E NON PARLA COL MOTORE: scrive due numeri in un oggetto «intento», lo
// stesso che riempie la tastiera (`gioco/passeggero.js`). Chi cammina non sa se
// gli arriva da un dito o da WASD.

const CSS = `
#comandi { position: fixed; inset: 0; z-index: 15; pointer-events: none;
  font: 12px/1 ui-monospace, monospace; color: #0d2a1a; user-select: none;
  -webkit-user-select: none; touch-action: none; }
#comandi .stick { position: absolute; left: 18px; bottom: 96px; width: 116px; height: 116px;
  border-radius: 50%; background: rgba(255,255,255,.42); border: 1px solid rgba(13,42,26,.16);
  pointer-events: auto; }
#comandi .knob { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px;
  margin: -23px 0 0 -23px; border-radius: 50%; background: rgba(255,255,255,.92);
  border: 1px solid rgba(13,42,26,.22); }
#comandi .btn { position: absolute; right: 18px; width: 62px; height: 62px; border-radius: 50%;
  background: rgba(255,255,255,.72); border: 1px solid rgba(13,42,26,.18);
  pointer-events: auto; display: flex; align-items: center; justify-content: center;
  font-size: 20px; padding: 0; color: #0d2a1a; }
#comandi .btn.premuto { background: rgba(13,42,26,.16); }
#comandi .salta { bottom: 96px; }
#comandi .demolisci { bottom: 168px; font-size: 22px; }
#comandi .demolisci.acceso { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
`;

export class ComandiTocco {
  /**
   * @param intento  l'oggetto {avanti, destra, salta} che riempie anche la tastiera
   * @param opzioni.onOra  (delta) → void, per scorrere l'ora col tasto in alto
   */
  constructor(intento, { visibile = true, onDemolisci = null } = {}) {
    this.intento = intento;
    /**
     * ⚠ IL PICCONE È L'UNICO MODO DI ROMPERE UNA COSA INTERATTIVA COL DITO.
     * Su un mouse c'è il tasto destro; su un telefono non esiste. E siccome
     * ora un lampione si ACCENDE al tocco (l'interazione appartiene
     * all'oggetto, non alla mano), senza questo non ci sarebbe verso di
     * toglierlo.
     * ⚠ È UNA MODALITÀ, e va bene perché è VISIBILE: il tasto resta acceso e
     * l'etichetta sopra la barra dice «rompi». Una modalità nascosta sarebbe
     * un'altra cosa.
     */
    this.demolisci = false;
    const stile = document.createElement('style');
    stile.textContent = CSS;
    document.head.appendChild(stile);

    const root = this.root = document.createElement('div');
    root.id = 'comandi';
    root.innerHTML = `
      <div class="stick"><div class="knob"></div></div>
      <button class="btn salta" title="Salta">⤴</button>
      <button class="btn demolisci" title="Demolisci: i tocchi rompono">⛏</button>`;
    document.body.appendChild(root);
    this.mostra(visibile);

    const stick = root.querySelector('.stick');
    const knob = root.querySelector('.knob');
    let idJoy = null, cx = 0, cy = 0, raggio = 58;

    // ⚠ IL VERSO DELLO SCHERMO NON È IL VERSO DEL MONDO: sullo schermo «su» è y
    // che DIMINUISCE, e nel gioco «avanti» è positivo. Il segno va girato una
    // volta sola, qui, se no lo si gira per sbaglio due volte più in là.
    const scrivi = (dx, dy) => {
      knob.style.transform = `translate(${dx * raggio * 0.62}px, ${dy * raggio * 0.62}px)`;
      this.intento.avanti = -dy;
      this.intento.destra = dx;
    };

    const muovi = (e) => {
      if (e.pointerId !== idJoy) return;
      let dx = (e.clientX - cx) / raggio, dy = (e.clientY - cy) / raggio;
      const m = Math.hypot(dx, dy);
      // ⚠ SI NORMALIZZA SOLO OLTRE IL BORDO: dentro il cerchio il joystick è
      // ANALOGICO — spostarlo poco cammina piano. Normalizzando sempre si
      // avrebbe un interruttore, e su un telefono la differenza fra camminare e
      // scattare è tutta lì.
      if (m > 1) { dx /= m; dy /= m; }
      scrivi(dx, dy);
      e.preventDefault();
    };
    stick.addEventListener('pointerdown', (e) => {
      idJoy = e.pointerId;
      try { stick.setPointerCapture(e.pointerId); } catch { /* va bene lo stesso */ }
      const r = stick.getBoundingClientRect();
      cx = r.left + r.width / 2; cy = r.top + r.height / 2; raggio = r.width / 2;
      muovi(e);
    });
    stick.addEventListener('pointermove', muovi);
    const fine = (e) => { if (e.pointerId === idJoy) { idJoy = null; scrivi(0, 0); } };
    stick.addEventListener('pointerup', fine);
    stick.addEventListener('pointercancel', fine);

    // ---- il salto: si tiene premuto -----------------------------------------
    const salta = root.querySelector('.salta');
    const giu = (e) => { e.preventDefault(); this.intento.salta = true; salta.classList.add('premuto'); };
    const su = () => { this.intento.salta = false; salta.classList.remove('premuto'); };
    salta.addEventListener('pointerdown', giu);
    salta.addEventListener('pointerup', su);
    salta.addEventListener('pointercancel', su);
    // ⚠ E ANCHE «pointerleave»: il dito che scivola fuori dal tasto senza
    // alzarsi lascerebbe il salto premuto per sempre.
    salta.addEventListener('pointerleave', su);

    const dem = root.querySelector('.demolisci');
    dem.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      this.demolisci = !this.demolisci;
      dem.classList.toggle('acceso', this.demolisci);
      if (onDemolisci) onDemolisci(this.demolisci);
    });
  }

  mostra(v) { this.root.style.display = v ? 'block' : 'none'; }
}

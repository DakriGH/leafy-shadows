// LO SGUARDO — dove guarda la camera, dal dito o dal mouse.
//
// Un trascinamento sulla tela gira lo sguardo (alpha attorno a Y, beta su e
// giù); con il puntatore CATTURATO (doppio clic sul computer, o il tasto L)
// basta muovere il mouse. Il joystick e i tasti a schermo (`ui/comandi.js`)
// stanno su elementi loro: i loro tocchi non arrivano qui.
//
// ⚠ CONVENZIONE: alpha = 0 guarda verso −Z; la destra è +X (mano destra, Y in
// su, come `gioco/passeggero.js`). `avantiPiano()` è il versore che il
// passeggero vuole: sul piano, e lo dice chi la camera ce l'ha.
export class Sguardo {
  constructor(tela, { alpha = 0, beta = -0.25, sensibilita = 0.0042 } = {}) {
    this.alpha = alpha; this.beta = beta; this.sensibilita = sensibilita;
    this.trascinato = 0;   // pixel trascinati dal pointerdown: chi ascolta i clic guarda qui
    this.fermo = false;    // vero durante un pizzico a due dita: il trascinamento non gira lo sguardo
    this.attivo = null;   // il puntatore che trascina (null = nessuno); pubblico per le prove
    tela.addEventListener('pointerdown', (e) => {
      if (this.attivo !== null) return;
      this.attivo = e.pointerId; this.trascinato = 0;
      this._x = e.clientX; this._y = e.clientY;
      try { tela.setPointerCapture(e.pointerId); } catch { /* niente */ }
    });
    tela.addEventListener('pointermove', (e) => {
      if (document.pointerLockElement === tela) { this._gira(e.movementX, e.movementY); return; }
      if (e.pointerId !== this.attivo) return;
      const dx = e.clientX - this._x, dy = e.clientY - this._y;
      this._x = e.clientX; this._y = e.clientY;
      if (this.fermo) return;   // si pizzica: si segue il dito senza girare, per non saltare dopo
      this.trascinato += Math.hypot(dx, dy);
      this._gira(dx, dy);
    });
    const fine = (e) => { if (e.pointerId === this.attivo) this.attivo = null; };
    tela.addEventListener('pointerup', fine);
    tela.addEventListener('pointercancel', fine);
    tela.addEventListener('dblclick', () => { if (tela.requestPointerLock) tela.requestPointerLock(); });
    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyL' && !/^(INPUT|TEXTAREA)$/.test(e.target && e.target.tagName)) {
        if (document.pointerLockElement === tela) document.exitPointerLock(); else if (tela.requestPointerLock) tela.requestPointerLock();
      }
    });
  }

  _gira(dx, dy) {
    this.alpha += dx * this.sensibilita;
    this.beta = Math.max(-1.45, Math.min(1.45, this.beta - dy * this.sensibilita));
  }

  /** Il versore di dove si guarda, in coordinate di mondo. */
  verso() {
    const cb = Math.cos(this.beta);
    return [cb * Math.sin(this.alpha), Math.sin(this.beta), -cb * Math.cos(this.alpha)];
  }

  /** Il versore avanti sul piano, per il passeggero. */
  avantiPiano() { return { x: Math.sin(this.alpha), z: -Math.cos(this.alpha) }; }
}

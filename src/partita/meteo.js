// IL METEO — per adesso solo il mare: quanto è agitata l'acqua.
//
// Un valore da 0 (specchio) a 1 (mosso) che vaga da solo: ogni tanto sceglie
// una meta nuova (quasi sempre calma, di rado burrasca) e ci va piano, in
// qualche decina di secondi. La resa lo legge (`resa.mare`) e l'acqua alza le
// onde, deforma di più il riflesso e allarga i brillii. Niente DOM, niente GL:
// si prova in Node. Il seme lo rende ripetibile.
export class Meteo {
  constructor(seme = 1) {
    this.agitazione = 0.25;
    this.meta = 0.25;
    this.auto = true;
    this.fra = 20;              // secondi alla prossima meta
    this._s = (seme >>> 0) || 1;
  }

  /** Un numero in [0,1) ripetibile (xorshift32). */
  _caso() {
    let x = this._s; x ^= x << 13; x ^= x >>> 17; x ^= x << 5; this._s = x >>> 0;
    return (this._s % 100000) / 100000;
  }

  /** Avanza di `dt` secondi. Fermo (`auto` falso) resta dov'è. */
  aggiorna(dt) {
    if (!this.auto) return this.agitazione;
    this.fra -= dt;
    if (this.fra <= 0) {
      // ⚠ QUASI SEMPRE CALMA: la potenza 2 schiaccia verso lo zero, la burrasca è rara
      this.meta = Math.pow(this._caso(), 2);
      this.fra = 25 + this._caso() * 50;
    }
    const k = 1 - Math.exp(-dt / 12);   // costante di tempo 12 s: cambia, ma non a scatti
    this.agitazione += (this.meta - this.agitazione) * k;
    return this.agitazione;
  }
}

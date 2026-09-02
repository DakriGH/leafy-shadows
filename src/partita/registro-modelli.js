// I MODELLI A SCHERMO — quali alberi, lampioni e panchine esistono, per tipo.
//
// Impara dagli EVENTI del mondo (`mondo.onEvento`), come `gioco/decoro.js` nel
// gioco di oggi: una posa non silenziosa di un blocco con forma «modello» è
// un'istanza in più, un `togli` su quella cella è un'istanza in meno. La
// frontiera posa le decorazioni non silenziose apposta. Ogni tipo tiene la
// sua lista e la ricompone (`Float32Array`) solo quando è cambiata.
//
// ⚠ NIENTE DOM, NIENTE GL: torna liste di numeri. Si prova in Node.
import { defDi } from '../world/blocks.js';

export class RegistroModelli {
  constructor() {
    this.tipi = new Map();      // nome del modello → Map(chiave cella → [x, y, z])
    this.celle = new Map();     // chiave cella → nome del modello
    this.sporchi = new Set();
  }

  /** Da agganciare a `mondo.onEvento` (o da chiamare a mano). */
  evento(e) {
    const [x, y, z] = e.cella, k = x + ',' + y + ',' + z;
    if (e.tipo === 'metti') {
      const def = defDi(e.blocco);
      if (!def || def.forma !== 'modello' || !def.modello) return;
      this._togli(k);
      let t = this.tipi.get(def.modello); if (!t) { t = new Map(); this.tipi.set(def.modello, t); }
      t.set(k, [x + 0.5, y, z + 0.5]);
      this.celle.set(k, def.modello);
      this.sporchi.add(def.modello);
    } else if (e.tipo === 'togli') this._togli(k);
  }

  _togli(k) {
    const nome = this.celle.get(k); if (!nome) return;
    this.tipi.get(nome).delete(k); this.celle.delete(k); this.sporchi.add(nome);
  }

  /** Le liste cambiate dall'ultima volta: [nome, Float32Array x y z scala]. Svuota `sporchi`. */
  cambiate() {
    const out = [];
    for (const nome of this.sporchi) {
      const t = this.tipi.get(nome) || new Map();
      const a = new Float32Array(t.size * 4); let i = 0;
      for (const [x, y, z] of t.values()) { a[i++] = x; a[i++] = y; a[i++] = z; a[i++] = 1; }
      out.push([nome, a]);
    }
    this.sporchi.clear();
    return out;
  }

  get istanze() { let n = 0; for (const t of this.tipi.values()) n += t.size; return n; }
}

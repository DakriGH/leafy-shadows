// I MODELLI A SCHERMO — quali alberi, lampioni e panchine esistono, per tipo.
//
// Impara dagli EVENTI del mondo (`mondo.onEvento`), come `gioco/decoro.js` nel
// gioco di oggi: una posa non silenziosa di un blocco con forma «modello» è
// un'istanza in più, un `togli` su quella cella è un'istanza in meno. La
// frontiera posa le decorazioni non silenziose apposta. Ogni tipo tiene la
// sua lista e la ricompone (`Float32Array`) solo quando è cambiata.
//
// ⚠ OTTO FLOAT PER ISTANZA, NON QUATTRO: x y z scala | r g b giro. Il nucleo
// li accettava già tutti e otto (`nucleo/modelli.js`, un disegno per tipo) —
// era questo lato che ne sapeva scrivere solo quattro, con la scala inchiodata
// a 1 e nessun giro. Cioè: girare o ingrandire una cosa posata era impossibile
// da DIRE, non da disegnare. La posa la decide il catalogo
// (`partita/catalogo.js`), che è anche il posto dove un asset dichiara se il
// suo giro è libero, a quarti o fermo.
//
// ⚠ NIENTE DOM, NIENTE GL: torna liste di numeri. Si prova in Node.
import { defDi } from '../world/blocks.js';
import { posaDi } from './catalogo.js';

export class RegistroModelli {
  /** `varia` a false toglie giro e scala variabili: serve per il confronto fianco a fianco. */
  constructor({ varia = true } = {}) {
    this.tipi = new Map();      // nome del modello → Map(chiave cella → [x, y, z] DELLA CELLA)
    this.celle = new Map();     // chiave cella → nome del modello
    this.sporchi = new Set();
    this.varia = varia;
  }

  /** Da agganciare a `mondo.onEvento` (o da chiamare a mano). */
  evento(e) {
    const [x, y, z] = e.cella, k = x + ',' + y + ',' + z;
    if (e.tipo === 'metti') {
      const def = defDi(e.blocco);
      if (!def || def.forma !== 'modello' || !def.modello) return;
      this._togli(k);
      let t = this.tipi.get(def.modello); if (!t) { t = new Map(); this.tipi.set(def.modello, t); }
      // ⚠ SI TIENE LA CELLA, NON IL CENTRO. L'impronta della posa si ricava
      // dalle coordinate INTERE: con x+0,5 due celle vicine darebbero impronte
      // diverse a ogni ricostruzione se mai cambiasse l'offset, e soprattutto
      // il centro è una cosa che si ricalcola in una riga.
      t.set(k, [x, y, z]);
      this.celle.set(k, def.modello);
      this.sporchi.add(def.modello);
    } else if (e.tipo === 'togli') this._togli(k);
  }

  _togli(k) {
    const nome = this.celle.get(k); if (!nome) return;
    this.tipi.get(nome).delete(k); this.celle.delete(k); this.sporchi.add(nome);
  }

  /** Le liste cambiate dall'ultima volta: [nome, Float32Array x y z scala r g b giro]. Svuota `sporchi`. */
  cambiate() {
    const out = [];
    for (const nome of this.sporchi) {
      const t = this.tipi.get(nome) || new Map();
      const a = new Float32Array(t.size * 8); let i = 0;
      for (const [x, y, z] of t.values()) {
        const p = posaDi(nome, x, y, z, this.varia);
        a[i++] = x + 0.5; a[i++] = y; a[i++] = z + 0.5; a[i++] = p.scala;
        a[i++] = p.tinta[0]; a[i++] = p.tinta[1]; a[i++] = p.tinta[2]; a[i++] = p.giro;
      }
      out.push([nome, a]);
    }
    this.sporchi.clear();
    return out;
  }

  get istanze() { let n = 0; for (const t of this.tipi.values()) n += t.size; return n; }
}

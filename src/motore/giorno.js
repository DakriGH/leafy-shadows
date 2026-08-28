// IL CICLO DEL GIORNO — quattro valori, e una tabella.
//
// ⚠ NON È UN PORTING. In Leafy-Lantern il ciclo giorno/notte sono 346 righe, e
// la maggior parte serviva a cose che qui non esistono più: ricuocere la mappa
// del cielo, spegnere e riaccendere sistemi d'ombra, riscrivere una dozzina di
// uniform sparse in tre file. Con lo stile piatto (`stile.js`) il colore di ogni
// cosa esce da **tre grandezze**, quindi il ciclo è muoverne tre più il sole:
//
//   · `ambienteCol`  quanto e di che colore luccica il mondo in pieno sole
//   · `ombraTinta`   di che colore VIRA l'ombra (non un grigio: il cielo)
//   · `cielo`        il fondo, che è anche il colore del vuoto all'orizzonte
//   · la direzione del sole, che decide dove cadono le ombre
//
// ⚠ TABELLA, NON `if` SPARSI. È la regola della casa e qui si vede perché: le
// ore chiave sono dati, non codice, e chi vuole ritoccare l'alba tocca una riga
// senza leggere il resto. Aggiungere un'ora vuol dire aggiungere una riga.

import { Color3 } from '@babylonjs/core/Maths/math.color.js';
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';

/**
 * LE ORE CHIAVE. `t` è l'ora normalizzata: 0 = mezzanotte, 0,5 = mezzogiorno.
 *
 * ⚠ L'OMBRA NON È MAI GRIGIA in nessuna riga di questa tabella, ed è la regola
 * che tiene insieme lo stile: all'ombra non c'è meno luce, c'è LUCE DIVERSA —
 * quella del cielo. Di giorno è azzurra, all'alba è rosata, di notte è blu.
 * Un grigio scurirebbe e basta, appiattendo tutto.
 */
const ORE = [
  // t     ambiente (sole pieno)      ombra (il cielo)          fondo del cielo
  [0.00, [0.30, 0.34, 0.52], [0.42, 0.46, 0.70], [0.07, 0.09, 0.18]],  // notte fonda
  [0.22, [0.44, 0.44, 0.58], [0.48, 0.50, 0.72], [0.20, 0.22, 0.34]],  // prima dell'alba
  [0.27, [1.10, 0.82, 0.66], [0.62, 0.58, 0.76], [0.86, 0.62, 0.52]],  // alba
  [0.34, [1.08, 0.98, 0.88], [0.60, 0.66, 0.82], [0.62, 0.78, 0.92]],  // mattino
  [0.50, [1.06, 1.03, 0.97], [0.60, 0.68, 0.82], [0.62, 0.81, 0.91]],  // mezzogiorno
  [0.68, [1.08, 0.98, 0.86], [0.60, 0.66, 0.82], [0.64, 0.80, 0.90]],  // pomeriggio
  [0.76, [1.14, 0.78, 0.58], [0.60, 0.54, 0.74], [0.92, 0.60, 0.44]],  // tramonto
  [0.82, [0.52, 0.46, 0.60], [0.48, 0.48, 0.72], [0.26, 0.24, 0.38]],  // crepuscolo
  [1.00, [0.30, 0.34, 0.52], [0.42, 0.46, 0.70], [0.07, 0.09, 0.18]],  // e si richiude
];

/** L'arco del sole non scende mai sotto l'orizzonte: di notte illumina
 *  l'ambiente, e il sole resta appena sopra.
 *  ⚠ ALZATA DA 0,10 A 0,24, e non è pigrizia: con il sole a sei gradi le
 *  cascate si stirano per chilometri e la tessitura d'ombra collassa — sul pelo
 *  dell'acqua il bordo diventa una SCALINATA di texel, che il committente ha
 *  fotografato. A quattordici gradi le ombre sono ancora lunghe (è l'alba) ma la
 *  mappa le regge. È la stessa scelta di Leafy-Lantern, presa per lo stesso
 *  motivo, e lì costava anche una passata d'ombra che non serviva a niente. */
const ALTEZZA_MIN = 0.24;

function fraOre(t) {
  const u = ((t % 1) + 1) % 1;
  let i = 0;
  while (i < ORE.length - 2 && ORE[i + 1][0] <= u) i++;
  const [t0, a0, o0, c0] = ORE[i];
  const [t1, a1, o1, c1] = ORE[i + 1];
  const k = t1 > t0 ? (u - t0) / (t1 - t0) : 0;
  // smoothstep: il passaggio fra un'ora e l'altra non deve avere spigoli, se no
  // all'alba si vede il momento in cui il colore «cambia marcia»
  const s = k * k * (3 - 2 * k);
  const mix3 = (p, q) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s, p[2] + (q[2] - p[2]) * s];
  return { amb: mix3(a0, a1), omb: mix3(o0, o1), cielo: mix3(c0, c1) };
}

export class Giorno {
  /** @param durata quanti secondi dura un giorno intero */
  constructor(rig, { durata = 300, ora = 0.42 } = {}) {
    this.rig = rig;
    this.durata = durata;
    this.t = ora;
    this.auto = true;
    this.applica();
  }

  aggiorna(dt) {
    if (!this.auto) return;
    this.t = (this.t + dt / this.durata) % 1;
    this.applica();
  }

  applica() {
    const { amb, omb, cielo } = fraOre(this.t);
    const r = this.rig;
    r.ambienteCol.set(amb[0], amb[1], amb[2]);
    r.ombraTinta.set(omb[0], omb[1], omb[2]);
    r.scena.clearColor.set(cielo[0], cielo[1], cielo[2], 1);

    // IL SOLE gira su un arco inclinato: sorge a est, culmina a sud, tramonta a
    // ovest. L'inclinazione serve a non farlo passare per lo zenit — a picco le
    // ombre spariscono e il diorama si appiattisce.
    const a = (this.t - 0.25) * Math.PI * 2;
    const alt = Math.max(ALTEZZA_MIN, Math.sin(a) * 0.85 + 0.06);
    const oriz = Math.sqrt(Math.max(0, 1 - alt * alt));
    r.sole.direction.set(-Math.cos(a) * oriz, -alt, -0.42 * oriz);
    r.sole.direction.normalize();
    // ⚠ E LA POSIZIONE VA MOSSA CON LA DIREZIONE: la mappa a cascata la usa per
    // inquadrare, e lasciandola ferma le cascate si sganciano dal sole. È un
    // difetto che si vede solo a certe ore, cioè il peggior tipo.
    r.sole.position.set(-r.sole.direction.x * 90, -r.sole.direction.y * 90, -r.sole.direction.z * 90);
  }

  /** L'ora come la legge un umano. */
  get orologio() {
    const m = Math.round(this.t * 1440);
    return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  }
}

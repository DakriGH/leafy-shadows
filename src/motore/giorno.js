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
 * LE ORE CHIAVE, E SONO QUELLE DI LANTERN, numero per numero.
 *
 * ⚠ LE AVEVO RISCRITTE «A OCCHIO» ED ERANO TUTTE PIÙ CHIARE. Committente:
 * «graficamente rendile come quelle di Lantern» — e guardando la notte si
 * capisce subito: la mia mezzanotte aveva un ambiente di (0,30 0,34 0,52),
 * quella di Lantern (0,20 0,23 0,38). Mezza volta più chiara, cioè non era
 * notte — e una lampada si vede per DIFFERENZA, quindi il buio attorno è metà
 * del suo lavoro. Le pozze sembravano gel colorati appoggiati sopra.
 *
 * `t` è l'ora normalizzata: 0 = mezzanotte, 0,5 = mezzogiorno. `ambiente` è
 * quanto e di che colore luccica il mondo in pieno sole; `cielo` è il fondo, ed
 * è anche il colore della nebbia.
 *
 * ⚠ E L'OMBRA NON STA PIÙ IN TABELLA: si RICAVA dal cielo (vedi `tintaOmbra`).
 * In Lantern è così, e la ragione è che due colonne scritte a mano prima o poi
 * divergono — e quando divergono l'ombra smette di essere «la luce del cielo»,
 * che è la regola che tiene su tutto lo stile.
 */
const ORE = [
  // t     ambiente (sole pieno)      cielo / nebbia
  [0.00, [0.20, 0.23, 0.38], [0.055, 0.086, 0.188]],  // notte fonda     (0x0e1630)
  [0.20, [0.23, 0.26, 0.41], [0.094, 0.125, 0.290]],  // prima dell'alba (0x18204a)
  [0.26, [0.92, 0.78, 0.66], [1.000, 0.718, 0.529]],  // alba            (0xffb787)
  [0.34, [1.04, 1.00, 0.94], [0.561, 0.827, 1.000]],  // mattino         (0x8fd3ff)
  [0.66, [1.04, 1.00, 0.94], [0.561, 0.827, 1.000]],  // pomeriggio
  [0.74, [0.95, 0.72, 0.58], [1.000, 0.616, 0.431]],  // tramonto        (0xff9d6e)
  [0.82, [0.25, 0.28, 0.43], [0.102, 0.129, 0.282]],  // crepuscolo      (0x1a2148)
  [1.00, [0.20, 0.23, 0.38], [0.055, 0.086, 0.188]],  // e si richiude
];

/**
 * QUANTO SCURISCE L'OMBRA — e sono due numeri tarati LEGGENDO I PIXEL, non a
 * occhio. Dal commento di Lantern, che vale la pena ricopiare per intero perché
 * descrive una finestra stretta trovata a fatica:
 *
 *   «l'esponente 1.6 è sceso a 0.85 e il fattore di giorno da 0.50 a 0.72.
 *    prima  alle 08:00     →  ombra al 79% del sole   (non si vede)
 *    adesso alle 08:00     →  ombra al 60% del sole   (si vede)
 *    adesso a mezzogiorno  →  ombra al 53% del sole   (ombra piena)
 *    Sopra il 70% l'ombra sparisce dentro la saturazione del verde; sotto il
 *    45% il diorama diventa a chiazze e i lampioni di sera non hanno più
 *    contrasto su cui lavorare. La finestra utile è stretta, ed è questa.»
 */
const FONDO_OMBRA = 0.48;
const ALBA = 0.22;          // sotto quest'altezza del sole l'ombra si smorza
const liscia = (t) => (t <= 0 ? 0 : t >= 1 ? 1 : t * t * (3 - 2 * t));

/**
 * LA TINTA DELL'OMBRA, RICAVATA DAL CIELO DELL'ORA.
 *
 * ⚠ SI NORMALIZZA SUL CANALE PIÙ ALTO, e senza quel passaggio l'ombra
 * scurirebbe DUE VOLTE: la luminosità la porta già `k`, e prendendola anche dal
 * cielo la notte diventerebbe nera. Poi si smorza verso il bianco, se no a
 * mezzogiorno l'ombra è un cartone azzurro invece che erba in ombra.
 *
 * ⚠ E DI NOTTE SCURISCE MOLTO MENO (0,30 invece di 0,72): la luna non è il
 * sole, e un'ombra di luna nera come quella di mezzogiorno si legge come un
 * buco. È anche quello che lascia alle lampade il contrasto su cui lavorare.
 */
function tintaOmbra(cielo, alt, notte, fuori) {
  const rampa = liscia(alt / ALBA) * (FONDO_OMBRA + (1 - FONDO_OMBRA) * Math.pow(Math.max(alt, 0), 0.85));
  const k = Math.min(0.85, (notte ? 0.30 : 0.72) * rampa);
  const m = Math.max(cielo[0], cielo[1], cielo[2]) || 1;
  for (let i = 0; i < 3; i++) {
    const tinta = cielo[i] / m;
    fuori[i] = (tinta + (1 - tinta) * 0.55) * (1 - k);
  }
  return fuori;
}

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
  const [t0, a0, c0] = ORE[i];
  const [t1, a1, c1] = ORE[i + 1];
  const k = t1 > t0 ? (u - t0) / (t1 - t0) : 0;
  // smoothstep: il passaggio fra un'ora e l'altra non deve avere spigoli, se no
  // all'alba si vede il momento in cui il colore «cambia marcia»
  const s = k * k * (3 - 2 * k);
  const mix3 = (p, q) => [p[0] + (q[0] - p[0]) * s, p[1] + (q[1] - p[1]) * s, p[2] + (q[2] - p[2]) * s];
  return { amb: mix3(a0, a1), cielo: mix3(c0, c1) };
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
    const { amb, cielo } = fraOre(this.t);
    const r = this.rig;
    r.ambienteCol.set(amb[0], amb[1], amb[2]);
    r.scena.clearColor.set(cielo[0], cielo[1], cielo[2], 1);
    // ⚠ LA NEBBIA SEGUE IL CIELO NELLA STESSA RIGA. Tenerle in due posti vuol
    // dire che prima o poi divergono, e quando divergono si vede una banda
    // all'orizzonte: la nebbia denuncia il confine invece di nasconderlo.
    r.scena.fogColor.set(cielo[0], cielo[1], cielo[2]);

    // IL SOLE gira su un arco inclinato: sorge a est, culmina a sud, tramonta a
    // ovest. L'inclinazione serve a non farlo passare per lo zenit — a picco le
    // ombre spariscono e il diorama si appiattisce.
    const a = (this.t - 0.25) * Math.PI * 2;
    const altVera = Math.sin(a) * 0.85 + 0.06;
    const alt = Math.max(ALTEZZA_MIN, altVera);
    const oriz = Math.sqrt(Math.max(0, 1 - alt * alt));
    r.sole.direction.set(-Math.cos(a) * oriz, -alt, -0.42 * oriz);
    r.sole.direction.normalize();
    // ⚠ E LA POSIZIONE VA MOSSA CON LA DIREZIONE: la mappa a cascata la usa per
    // inquadrare, e lasciandola ferma le cascate si sganciano dal sole. È un
    // difetto che si vede solo a certe ore, cioè il peggior tipo.
    r.sole.position.set(-r.sole.direction.x * 90, -r.sole.direction.y * 90, -r.sole.direction.z * 90);

    // ⚠ L'OMBRA SI CALCOLA CON L'ALTEZZA VERA, non con quella tenuta al minimo.
    // `ALTEZZA_MIN` è una bugia detta alla MAPPA D'OMBRA (col sole a sei gradi
    // le cascate si stirano e il bordo diventa una scalinata); dirla anche
    // all'ombra vorrebbe dire che a mezzanotte il mondo si comporta come
    // all'alba, cioè che la notte non arriva mai.
    this._ombra = tintaOmbra(cielo, altVera, altVera <= 0, this._ombra || [0, 0, 0]);
    r.ombraTinta.set(this._ombra[0], this._ombra[1], this._ombra[2]);
  }

  /** L'ora come la legge un umano. */
  get orologio() {
    const m = Math.round(this.t * 1440);
    return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
  }
}

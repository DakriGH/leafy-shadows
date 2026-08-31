// LE SCHEGGE — i pezzetti che saltano via da un blocco che si sta rompendo.
//
// ⚠ SONO CUBETTI E NON UNA NUVOLA DI PUNTINI, perché in Leafy non c'è niente di
// sfumato: il fumo, le scie e le particelle morbide sono il linguaggio di un
// altro gioco. Un blocco che si rompe fa pezzi di sé stesso, dei suoi colori.
//
// ⚠ E SPARISCONO RIMPICCIOLENDO, non sfumando. Il materiale del mondo è opaco e
// scrive in profondità: una scheggia che svanisse in trasparenza vorrebbe dire
// un secondo materiale, un secondo passaggio di disegno e l'ordinamento per
// profondità. Rimpicciolire fino a zero costa niente e in stile piatto si legge
// uguale — anzi meglio, perché somiglia a come sparisce tutto il resto.
//
// ⚠ QUI DENTRO NON SI NOMINA BABYLON — è il confine della casa. Questo modulo
// calcola dove stanno i pezzetti e di che colore sono, e li scrive in due array;
// caricarli in GPU è mestiere del motore. Ed è la ragione per cui la fisica di
// una cosa che dura mezzo secondo si può provare in Node.

/** Quanti pezzetti possono volare tutti insieme. Oltre, i più vecchi cedono. */
export const MAX = 72;
/** Quanti ne salta via un colpo che NON rompe, e quanti la rottura. */
export const PER_COLPO = 5, PER_ROTTURA = 16;

const GRAVITA = 16;      // blocchi/s² — cadono in fretta, sono sassolini
const ATTRITO = 1.8;     // /s, frena l'orizzontale: se no scivolano via piatti
const VITA = [0.30, 0.62];

/**
 * UN CASO PREVEDIBILE. ⚠ Non `Math.random`: due schegge che nascono dalla stessa
 * cella devono poter essere rifatte identiche in una prova, e un effetto che si
 * comporta ogni volta diverso non si può misurare — si può solo guardare.
 */
function seme(n) {
  let s = (n >>> 0) || 1;
  return () => {
    s ^= s << 13; s >>>= 0;
    s ^= s >> 17;
    s ^= s << 5; s >>>= 0;
    return s / 4294967296;
  };
}

export class Schegge {
  constructor(max = MAX) {
    this.max = max;
    this.vive = [];
    this._n = 0;              // per il seme: cambia a ogni scoppio
  }

  /**
   * SALTANO VIA DA QUI.
   * @param centro   {x,y,z} il centro della cella
   * @param colori   una o più terne 0..1: i colori del blocco
   * @param quante   quante schegge
   * @param verso    {x,y,z} da che parte spingerle (la faccia colpita), o null
   */
  scoppia(centro, colori, quante = PER_COLPO, verso = null) {
    const r = seme((centro.x * 73856093) ^ (centro.y * 19349663) ^ (centro.z * 83492791) ^ (this._n++ * 2654435761));
    for (let i = 0; i < quante; i++) {
      // ⚠ NASCONO SPARSE NELLA CELLA, non nel suo centro: tutte dallo stesso
      // punto sarebbe una fontana, e una fontana non è un blocco che si sbriciola.
      const ox = (r() - 0.5) * 0.8, oy = (r() - 0.5) * 0.8, oz = (r() - 0.5) * 0.8;
      // la spinta è verso la faccia colpita più una parte sferica, e SEMPRE un
      // po' verso l'alto: senza, i pezzi strisciano per terra invece di saltare
      let vx = (r() - 0.5) * 3.2, vy = 1.6 + r() * 2.8, vz = (r() - 0.5) * 3.2;
      if (verso) { vx += verso.x * 2.4; vy += verso.y * 1.6; vz += verso.z * 2.4; }
      const c = colori[(r() * colori.length) | 0] || [1, 1, 1];
      this.vive.push({
        x: centro.x + ox, y: centro.y + oy, z: centro.z + oz,
        vx, vy, vz,
        // la taglia varia molto: qualche pezzo grosso e tanta briciola è quello
        // che dice «si è sbriciolato» invece di «si è diviso in parti uguali»
        taglia: 0.06 + r() * r() * 0.16,
        t: 0, durata: VITA[0] + r() * (VITA[1] - VITA[0]),
        r: c[0], g: c[1], b: c[2],
      });
    }
    // ⚠ IL TETTO TAGLIA DALLE PIÙ VECCHIE. Se tagliasse le nuove, un colpo dato
    // mentre il cielo è pieno di pezzi non farebbe niente — cioè il gioco
    // smetterebbe di rispondere proprio quando ci si sta dando da fare.
    if (this.vive.length > this.max) this.vive.splice(0, this.vive.length - this.max);
  }

  /** Un passo di fisica. Ritorna quante ne sono rimaste. */
  aggiorna(dt) {
    const d = Math.min(dt, 0.05);   // un fotogramma perso non le spara via
    const f = Math.max(0, 1 - ATTRITO * d);
    for (let i = this.vive.length - 1; i >= 0; i--) {
      const s = this.vive[i];
      s.t += d;
      if (s.t >= s.durata) { this.vive.splice(i, 1); continue; }
      s.vy -= GRAVITA * d;
      s.vx *= f; s.vz *= f;
      s.x += s.vx * d; s.y += s.vy * d; s.z += s.vz * d;
    }
    return this.vive.length;
  }

  /** Quanto è grande adesso una scheggia: la sua taglia che va a zero. */
  static taglia(s) {
    const u = Math.max(0, Math.min(1, 1 - s.t / s.durata));
    // ⚠ AL QUADRATO: sparisce presto e in fretta, invece di restare a lungo
    // come un puntino. Un pezzetto che si spegne lentamente sembra fumo.
    return s.taglia * u * u;
  }

  get quante() { return this.vive.length; }

  /**
   * SCRIVE I CUBETTI in due array (posizioni e colori), pronti da caricare.
   * @returns quanti VERTICI sono stati scritti
   */
  scriviIn(pos, col) {
    let v = 0;
    for (const s of this.vive) {
      const m = Schegge.taglia(s);
      if (m <= 0) continue;
      for (let k = 0; k < FACCE.length; k++) {
        const a = FACCE[k];
        pos[v * 3] = s.x + a[0] * m; pos[v * 3 + 1] = s.y + a[1] * m; pos[v * 3 + 2] = s.z + a[2] * m;
        col[v * 3] = s.r; col[v * 3 + 1] = s.g; col[v * 3 + 2] = s.b;
        v++;
      }
    }
    return v;
  }

  /** Quanti vertici al massimo servono: per allocare gli array una volta sola. */
  static vertici(max = MAX) { return max * FACCE.length; }
}

/** I 36 vertici di un cubetto di semilato 1, nell'ordine dei triangoli. */
const FACCE = (() => {
  const V = [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]];
  const T = [[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],
             [1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]];
  const out = [];
  for (const t of T) for (const i of t) out.push(V[i]);
  return out;
})();

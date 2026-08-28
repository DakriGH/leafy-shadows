// IL DECORO — chi tiene il conto di alberi e lampioni piazzati nel mondo.
//
// ⚠ NON È UN SECONDO MONDO: la verità è nella griglia (`mondo.tipo`), e questo
// registro è solo una vista comoda — quali celle hanno una decorazione, dove va
// il modello, quali si accendono. Si nutre degli EVENTI del mondo, come in
// Leafy-Lantern fa `luciBlocchi`: un blocco posato o rotto si racconta da solo,
// e nessuno deve ricordarsi di aggiornare due elenchi.
//
// ⚠ NON SA CHE ESISTE UN MOTORE. Dice DOVE vanno i modelli e QUALI lampade sono
// accese; chi disegna e chi accende è la regia. Si prova in Node.

import { DECORAZIONI, scatolaDi } from '../world/decorazioni.js';
import { defDi } from '../world/blocks.js';

const chiave = (x, y, z) => `${x},${y},${z}`;

export class Decoro {
  constructor() {
    this.per = new Map();          // chiave cella → voce
    this.eNotte = false;
    /** Sale a ogni cambio: chi ridisegna i modelli guarda questo e non conta. */
    this.versione = 0;
  }

  /**
   * ⚠ UNA SCANSIONE SOLA, DOPO IL WORLDGEN, e poi mai più: da lì in avanti
   * bastano gli eventi. Contare 300.000 celle a ogni fotogramma per trovarne
   * sessanta sarebbe il modo più caro possibile di sapere una cosa che il mondo
   * ci dice gratis quando cambia.
   */
  scansiona(mondo) {
    this.per.clear();
    mondo.perOgni((x, y, z, tipo) => {
      if (DECORAZIONI[tipo]) this._metti(x, y, z, tipo);
    });
    this.versione++;
    return this.per.size;
  }

  /** Un evento del mondo: `{ tipo: 'metti'|'togli', cella, blocco }`. */
  evento(e) {
    if (e.tipo === 'metti') {
      if (!DECORAZIONI[e.blocco]) return false;
      this._metti(e.cella[0], e.cella[1], e.cella[2], e.blocco);
      this.versione++;
      return true;
    }
    if (e.tipo === 'togli') {
      const k = chiave(...e.cella);
      if (!this.per.has(k)) return false;
      this.per.delete(k);
      this.versione++;
      return true;
    }
    return false;
  }

  _metti(x, y, z, tipo) {
    const d = DECORAZIONI[tipo];
    const s = scatolaDi(tipo, x, y, z);
    this.per.set(chiave(x, y, z), {
      tipo, x, y, z, cella: [x, y, z],
      // ⚠ IL GIRO È DETERMINISTICO, non casuale: un albero deve stare girato
      // sempre allo stesso modo, o a ogni ricarica il bosco cambia faccia.
      giro: (((x * 73856093) ^ (z * 19349663)) >>> 0) / 4294967296 * Math.PI * 2,
      // se ha una luce, parte accesa quanto è la notte adesso
      acceso: d.luce ? (d.notte ? this.eNotte : true) : false,
      aMano: false,
      min: s.min, max: s.max,
    });
  }

  /** Quelli di un tipo, per ridisegnare le istanze di quel modello. */
  diTipo(tipo) {
    const fuori = [];
    for (const v of this.per.values()) if (v.tipo === tipo) fuori.push(v);
    return fuori;
  }

  /** Le scatole da dare a `miraCompleta`. */
  scatole() {
    const fuori = [];
    for (const v of this.per.values()) fuori.push({ min: v.min, max: v.max, dato: v });
    return fuori;
  }

  /** Si può accendere/spegnere? Solo chi ha una luce. */
  interattivo(v) { return !!(v && DECORAZIONI[v.tipo].luce); }

  alterna(v) {
    if (!this.interattivo(v)) return false;
    v.aMano = true;
    v.acceso = !v.acceso;
    return v.acceso;
  }

  /**
   * IL CICLO DEL GIORNO accende e spegne chi lo segue.
   * ⚠ E AZZERA IL «a mano», come in Lantern: l'interruttore vale fino al
   * prossimo passaggio giorno/notte, poi il mondo riprende il suo corso. È la
   * scelta semplice, ed è quella che non lascia mezza città accesa a mezzogiorno.
   */
  aggiornaNotte(eNotte) {
    if (eNotte === this.eNotte) return false;
    this.eNotte = eNotte;
    for (const v of this.per.values()) {
      if (!DECORAZIONI[v.tipo].notte) continue;
      v.aMano = false;
      v.acceso = eNotte;
    }
    return true;
  }

  get accesi() { let n = 0; for (const v of this.per.values()) if (v.acceso) n++; return n; }
  get quanti() { return this.per.size; }
}

/** ⚠ Serve alla barra: una decorazione ha un nome come ogni altro blocco. */
export function nomeDi(tipo) { return defDi(tipo).nome; }

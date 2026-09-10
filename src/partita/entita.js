// LE ENTITÀ — le cose che stanno nel mondo, con un'identità.
//
// ⚠ PRIMA NON ESISTEVANO, e il difetto si vedeva dove nessuno lo cercava:
// nell'Officina. Un oggetto posato era un blocco in una cella e basta — niente
// id, niente giro, niente scala, niente dati suoi, niente nome. Un pannello
// che non ha oggetti può solo diventare quello che era diventato: una lista di
// manopole globali. **Un ispettore ispeziona un'entità**; se l'entità non
// c'è, non c'è niente da selezionare e non c'è niente da mostrare.
//
// E la stessa mancanza si pagava altre due volte:
//  · i NOVEMILA ASSET (R3) hanno bisogno che il costo non cresca col numero di
//    cose che ESISTONO: qui i dati caldi stanno in array tipizzati con lo
//    stesso passo delle istanze del nucleo, e comporre la lista da disegnare
//    è una copia, non un giro di oggetti;
//  · l'AR è un DIORAMA, cioè una lista di cose posate con la loro posa:
//    `serializza()` è quella lista, ed è quello che finirà in un QR.
//
// ⚠ SOSTITUISCE `registro-modelli.js`, non gli si affianca. Due macchine che
// tengono la stessa verità è la malattia che `docs/ARCHITETTURA.md` denuncia a
// pagina uno («le decorazioni vivono in tre posti tenuti allineati con una
// ricostruzione totale»): la cura non è una terza macchina.
//
// ⚠ NIENTE DOM, NIENTE GL, NIENTE BABYLON: numeri e basta. Si prova in Node.
import { defDi } from '../world/blocks.js';
import { posaDi } from './catalogo.js';

/** Quanti slot alla nascita: si raddoppia quando finiscono. */
const INIZIALE = 256;
/** Il passo dei dati caldi: x y z scala | r g b giro — ⚠ È ESATTAMENTE il
 *  formato che `nucleo/modelli.js` vuole per le istanze, e non è un caso:
 *  così `cambiate()` copia una riga per volta invece di comporla. */
const PASSO = 8;
/** Il lato del chunk, per l'indice. Deve restare quello del mondo. */
const CHUNK = 16;

const chiaveChunk = (cx, cz) => cx + ',' + cz;
const chiaveCella = (x, y, z) => x + ',' + y + ',' + z;

export class Entita {
  /** `varia` a false toglie giro e scala dal catalogo: serve al confronto fianco a fianco. */
  constructor({ varia = true } = {}) {
    this.varia = varia;

    this._n = INIZIALE;
    this._dati = new Float32Array(this._n * PASSO);   // x y z scala r g b giro
    this._id = new Int32Array(this._n);               // slot → id (0 = slot libero)
    this._tipo = new Array(this._n).fill(null);       // slot → id del catalogo

    this._slot = new Map();        // id → slot
    this._liberi = [];             // slot riusabili
    this._primo = 0;               // il primo slot mai usato
    this._prossimoId = 1;

    this._perTipo = new Map();     // tipo → Set(slot)
    this._perChunk = new Map();    // 'cx,cz' → Set(slot)
    this._chunk = new Map();       // slot → 'cx,cz' (per sfilarlo senza cercarlo)
    this._perCella = new Map();    // 'x,y,z' → slot (solo per chi nasce da un blocco)
    this._cella = new Map();       // slot → 'x,y,z'
    this._meta = new Map();        // slot → { … } (sparso: la maggior parte non ne ha)
    this._nome = new Map();        // slot → nome proprio

    this.sporchi = new Set();      // i tipi la cui lista va rifatta
  }

  // ── crescere ───────────────────────────────────────────────────────────────
  _cresci() {
    const n = this._n * 2;
    const d = new Float32Array(n * PASSO); d.set(this._dati);
    const i = new Int32Array(n); i.set(this._id);
    this._dati = d; this._id = i;
    this._tipo.length = n; this._tipo.fill(null, this._n);
    this._n = n;
  }

  _prendiSlot() {
    if (this._liberi.length) return this._liberi.pop();
    if (this._primo >= this._n) this._cresci();
    return this._primo++;
  }

  // ── mettere e togliere ─────────────────────────────────────────────────────

  /**
   * Aggiunge un'entità e torna il suo **id**, che è stabile: sopravvive a
   * qualunque altra aggiunta o rimozione. ⚠ È la ragione per cui l'id non è
   * l'indice: un ispettore tiene in mano la selezione mentre il mondo continua
   * a scaricare chunk, e un indice che scorre gli farebbe cambiare oggetto
   * sotto le dita.
   *
   * La posa (giro, scala) se non si dice la decide il catalogo dalla cella —
   * ed è quello che fanno gli alberi e i lampioni del mondo. Chi la dice
   * esplicitamente (l'Officina, un gizmo, un diorama salvato) VINCE sempre.
   */
  aggiungi(tipo, x, y, z, { giro, scala, tinta, nome, dati, cella } = {}) {
    const s = this._prendiSlot();
    const id = this._prossimoId++;
    this._id[s] = id; this._slot.set(id, s); this._tipo[s] = tipo;

    const base = cella
      ? posaDi(tipo, cella[0], cella[1], cella[2], this.varia)
      : { scala: 1, giro: 0, tinta: [1, 1, 1] };
    const o = s * PASSO;
    this._dati[o] = x; this._dati[o + 1] = y; this._dati[o + 2] = z;
    this._dati[o + 3] = scala ?? base.scala;
    const t = tinta || base.tinta;
    this._dati[o + 4] = t[0]; this._dati[o + 5] = t[1]; this._dati[o + 6] = t[2];
    this._dati[o + 7] = giro ?? base.giro;

    let ins = this._perTipo.get(tipo); if (!ins) { ins = new Set(); this._perTipo.set(tipo, ins); }
    ins.add(s);
    this._indicizza(s, x, z);
    if (cella) {
      const k = chiaveCella(cella[0], cella[1], cella[2]);
      this._perCella.set(k, s); this._cella.set(s, k);
    }
    if (nome) this._nome.set(s, nome);
    if (dati) this._meta.set(s, { ...dati });
    this.sporchi.add(tipo);
    return id;
  }

  /** Toglie un'entità. Torna true se c'era. */
  togli(id) {
    const s = this._slot.get(id);
    if (s === undefined) return false;
    const tipo = this._tipo[s];
    this._perTipo.get(tipo).delete(s);
    this._sfila(s);
    const k = this._cella.get(s);
    if (k !== undefined) { this._perCella.delete(k); this._cella.delete(s); }
    this._meta.delete(s); this._nome.delete(s);
    this._slot.delete(id); this._id[s] = 0; this._tipo[s] = null;
    this._liberi.push(s);
    this.sporchi.add(tipo);
    return true;
  }

  // ── l'indice per chunk ─────────────────────────────────────────────────────
  //
  // ⚠ SERVE A DUE COSE DIVERSE e vale la pena dirle tutte e due: allo
  // STREAMING (quando un chunk se ne va, le sue entità se ne vanno con lui) e
  // all'EDITOR (l'albero della scena si apre per zona, non con novemila righe
  // in fila).
  _chunkDi(x, z) { return chiaveChunk(Math.floor(x / CHUNK), Math.floor(z / CHUNK)); }

  _indicizza(s, x, z) {
    const k = this._chunkDi(x, z);
    let c = this._perChunk.get(k); if (!c) { c = new Set(); this._perChunk.set(k, c); }
    c.add(s);
    this._chunk.set(s, k);
  }

  _sfila(s) {
    const k = this._chunk.get(s);
    if (k === undefined) return;
    const c = this._perChunk.get(k);
    if (c) { c.delete(s); if (!c.size) this._perChunk.delete(k); }
    this._chunk.delete(s);
  }

  /** Gli id delle entità in un chunk. */
  nelChunk(cx, cz) {
    const c = this._perChunk.get(chiaveChunk(cx, cz));
    return c ? [...c].map((s) => this._id[s]) : [];
  }

  // ── leggere e modificare ───────────────────────────────────────────────────

  /** Tutto di un'entità, in un oggetto comodo. `null` se l'id non c'è più. */
  leggi(id) {
    const s = this._slot.get(id);
    if (s === undefined) return null;
    const o = s * PASSO;
    return {
      id, tipo: this._tipo[s],
      x: this._dati[o], y: this._dati[o + 1], z: this._dati[o + 2],
      scala: this._dati[o + 3],
      tinta: [this._dati[o + 4], this._dati[o + 5], this._dati[o + 6]],
      giro: this._dati[o + 7],
      nome: this._nome.get(s) || null,
      dati: this._meta.get(s) || null,
    };
  }

  /**
   * Cambia la posa. Si passano solo i campi che cambiano — è la firma che
   * serve a un gizmo, che di solito ne muove uno solo.
   * ⚠ SPOSTARE VUOL DIRE RIMETTERE NELL'INDICE: senza, un oggetto trascinato
   * oltre il bordo del chunk resterebbe indicizzato dove non è più, e lo
   * streaming lo scaricherebbe guardando il chunk sbagliato.
   */
  posa(id, { x, y, z, giro, scala, tinta } = {}) {
    const s = this._slot.get(id);
    if (s === undefined) return false;
    const o = s * PASSO;
    const spostato = x !== undefined || z !== undefined;
    if (x !== undefined) this._dati[o] = x;
    if (y !== undefined) this._dati[o + 1] = y;
    if (z !== undefined) this._dati[o + 2] = z;
    if (scala !== undefined) this._dati[o + 3] = scala;
    if (tinta) { this._dati[o + 4] = tinta[0]; this._dati[o + 5] = tinta[1]; this._dati[o + 6] = tinta[2]; }
    if (giro !== undefined) this._dati[o + 7] = giro;
    if (spostato) { this._sfila(s); this._indicizza(s, this._dati[o], this._dati[o + 2]); }
    this.sporchi.add(this._tipo[s]);
    return true;
  }

  /** I metadati: si leggono e si scrivono a pezzi, come l'ispettore li mostra. */
  metadati(id, cambi) {
    const s = this._slot.get(id);
    if (s === undefined) return null;
    if (cambi) {
      this._meta.set(s, { ...(this._meta.get(s) || {}), ...cambi });
      // ⚠ i metadati NON sporcano il tipo: non toccano il disegno. Sporcarlo
      // vorrebbe dire ricomporre e ricaricare un buffer sulla GPU ogni volta
      // che si scrive una nota in un campo di testo.
    }
    return this._meta.get(s) || null;
  }

  /** Il nome proprio, quello che si legge nell'albero della scena. */
  battezza(id, nome) {
    const s = this._slot.get(id);
    if (s === undefined) return false;
    if (nome) this._nome.set(s, nome); else this._nome.delete(s);
    return true;
  }

  // ── il mondo che parla ─────────────────────────────────────────────────────

  /**
   * Da agganciare a `mondo.onEvento`. Un blocco con forma «modello» posato non
   * in silenzio è un'entità in più; toglierlo la toglie.
   * ⚠ LA POSA ARRIVA DALLA CELLA (catalogo), così è la stessa in ogni sessione
   * e non si rimescola quando lo streaming ricarica il chunk.
   */
  evento(e) {
    const [x, y, z] = e.cella;
    if (e.tipo === 'metti') {
      const def = defDi(e.blocco);
      if (!def || def.forma !== 'modello' || !def.modello) return;
      this._dallaCella(x, y, z);   // se c'era già qualcosa in quella cella, via
      this.aggiungi(def.modello, x + 0.5, y, z + 0.5, { cella: [x, y, z] });
    } else if (e.tipo === 'togli') this._dallaCella(x, y, z);
  }

  _dallaCella(x, y, z) {
    const s = this._perCella.get(chiaveCella(x, y, z));
    if (s !== undefined) this.togli(this._id[s]);
  }

  // ── la resa ────────────────────────────────────────────────────────────────

  /**
   * Le liste cambiate dall'ultima volta: `[tipo, Float32Array]` a otto float
   * per istanza (x y z scala | r g b giro), pronta per `nucleo/modelli.js`.
   * Svuota `sporchi`.
   */
  cambiate() {
    const out = [];
    for (const tipo of this.sporchi) {
      const ins = this._perTipo.get(tipo);
      const a = new Float32Array((ins ? ins.size : 0) * PASSO);
      let i = 0;
      if (ins) for (const s of ins) { a.set(this._dati.subarray(s * PASSO, s * PASSO + PASSO), i); i += PASSO; }
      out.push([tipo, a]);
    }
    this.sporchi.clear();
    return out;
  }

  /** Quante entità ci sono. */
  get conta() { return this._slot.size; }

  /** Quante ce ne sono di un tipo. */
  quante(tipo) { const s = this._perTipo.get(tipo); return s ? s.size : 0; }

  /** Gli id di tutte, per l'albero della scena. */
  tutte() { return [...this._slot.keys()]; }

  // ⚠ QUESTI DUE GIRANO A OGNI FOTOGRAMMA (la mira, le lampade vicine): niente
  // array di ritorno, niente oggetti per entità. È la ragione per cui i dati
  // caldi stanno in un Float32Array e non in una lista di oggetti — con
  // novemila cose, un oggetto per entità per fotogramma è il collo.
  /** I tipi vivi, senza allocare: si scorre e basta. */
  tipiVivi() { return this._perTipo.keys(); }

  /** Chiama `fn(x, y, z, id, scala, giro)` per ogni entità di un tipo. */
  ognunaDi(tipo, fn) {
    const ins = this._perTipo.get(tipo);
    if (!ins) return;
    for (const s of ins) {
      const o = s * PASSO;
      fn(this._dati[o], this._dati[o + 1], this._dati[o + 2], this._id[s], this._dati[o + 3], this._dati[o + 7]);
    }
  }

  /** I tipi presenti, con quante ce n'è: la radice dell'albero della scena. */
  perTipo() {
    const out = [];
    for (const [tipo, ins] of this._perTipo) if (ins.size) out.push([tipo, ins.size]);
    out.sort((a, b) => a[0].localeCompare(b[0]));
    return out;
  }

  // ── il diorama ─────────────────────────────────────────────────────────────

  /**
   * La scena come dati: è la lista che va in un file, in un salvataggio o in
   * un QR. ⚠ NON si salvano le entità nate da un blocco del mondo: quelle le
   * rifà il mondo da solo quando il chunk torna, e salvarle vorrebbe dire
   * averne due. Si salva quello che il mondo NON sa rifare, cioè quello che
   * qualcuno ha posato o spostato a mano.
   */
  serializza({ tutto = false } = {}) {
    const fuori = [];
    for (const [id, s] of this._slot) {
      if (!tutto && this._cella.has(s)) continue;
      const o = s * PASSO;
      const e = {
        id, tipo: this._tipo[s],
        p: [this._dati[o], this._dati[o + 1], this._dati[o + 2]],
        s: this._dati[o + 3], g: this._dati[o + 7],
      };
      const t = [this._dati[o + 4], this._dati[o + 5], this._dati[o + 6]];
      if (t[0] !== 1 || t[1] !== 1 || t[2] !== 1) e.t = t;
      const n = this._nome.get(s); if (n) e.n = n;
      const m = this._meta.get(s); if (m) e.m = m;
      fuori.push(e);
    }
    return { versione: 1, entita: fuori };
  }

  /** Rimette dentro quello che `serializza()` ha tirato fuori. Torna quante ne ha messe. */
  deserializza(pacco) {
    if (!pacco || pacco.versione !== 1 || !Array.isArray(pacco.entita)) throw new Error('pacco di entità non riconosciuto');
    let n = 0;
    for (const e of pacco.entita) {
      this.aggiungi(e.tipo, e.p[0], e.p[1], e.p[2], { giro: e.g, scala: e.s, tinta: e.t, nome: e.n, dati: e.m });
      n++;
    }
    return n;
  }
}

// LA FRONTIERA — lo streaming del mondo: si genera quello che sta per vedersi,
// si scarica quello che non si vede più.
//
// ⚠ NIENTE MOTORE, come tutto `world/`: la frontiera conosce il mondo e un
// generatore per chunk, e basta. Lo chiama il mesher a ogni giro con la
// posizione di chi guarda e i suoi raggi di resa (`mesher.raggi`): si genera
// fino a `resa` più un margine (così il confine della generazione sta dove non
// si disegna niente) e si tiene in memoria fino a un margine più largo (così
// chi torna indietro di un passo non rigenera).
//
// ⚠ LE MODIFICHE DEL GIOCATORE SOPRAVVIVONO ALLO SCARICO: il mondo le annota
// per chunk (`mondo.modifiche`) e le riapplica quando il chunk si rigenera dal
// seme. La frontiera non conserva blocchi: conserva DIFFERENZE. È lo stesso
// modello del salvataggio e del netcode — un chunk è il suo seme più la storia
// di chi l'ha toccato.
//
// ⚠ LE DECORAZIONI SI POSANO NON SILENZIOSE, ed è l'unica eccezione al «la
// generazione scrive silenziosa»: alberi e lampioni sono blocchi che un
// registro (gioco/decoro.js) impara dagli EVENTI del mondo. Una posa silenziosa
// darebbe un albero nel mondo e nessun modello a schermo; per la stessa ragione
// allo scarico si emette un `togli` per ciascuno.
import { CHUNK } from './world.js';

/** Quanti chunk si generano per giro: ~0,3 ms l'uno, e la coda è per distanza. */
const GENERAZIONI_PER_GIRO = 4;

export class Frontiera {
  /**
   * @param mondo
   * @param genera   (mondo, cx, cz) → [[x, h, z, tipo], …] le decorazioni da posare
   * @param opzioni  { margineGenera: blocchi oltre la resa (32), margineTieni: oltre la resa (96) }
   */
  constructor(mondo, genera, { margineGenera = 2 * CHUNK, margineTieni = 6 * CHUNK } = {}) {
    this.mondo = mondo;
    this.genera = genera;
    this.margineGenera = margineGenera;
    this.margineTieni = margineTieni;
    this._coda = [];               // chunk da generare, dal più vicino
    this._chunkOsservatore = null;
    this.statistiche = { generati: 0, scaricati: 0, inCoda: 0, ultimaMs: 0 };
    mondo.frontiera = this;
  }

  /**
   * Da chiamare a ogni giro con la posizione di chi guarda e i raggi di resa.
   * `subito` = genera tutto quello che serve ORA (l'avvio: il 3×3 sotto i piedi
   * deve esistere prima che il mesher lo costruisca).
   */
  assicura(x, z, raggi, { subito = false } = {}) {
    const t0 = performance.now();
    const cx = Math.floor(x / CHUNK), cz = Math.floor(z / CHUNK);
    const kcOss = cx + ',' + cz;
    const resa = raggi && Number.isFinite(raggi.resa) ? raggi.resa : 4 * CHUNK;
    if (kcOss !== this._chunkOsservatore || subito) {
      this._chunkOsservatore = kcOss;
      this._riesamina(cx, cz, x, z, resa);
    }
    let fatti = 0;
    const tetto = subito ? Infinity : GENERAZIONI_PER_GIRO;
    while (this._coda.length && fatti < tetto) {
      const kc = this._coda.shift();
      if (this.mondo.generati.has(kc)) continue;
      this._generaChunk(kc);
      fatti++;
    }
    this.statistiche.inCoda = this._coda.length;
    this.statistiche.ultimaMs = performance.now() - t0;
    return fatti;
  }

  _riesamina(cx, cz, x, z, resa) {
    const rg = resa + this.margineGenera, rt = resa + this.margineTieni;
    const nChunk = Math.ceil(rg / CHUNK) + 1;
    const voluti = [];
    for (let dx = -nChunk; dx <= nChunk; dx++) {
      for (let dz = -nChunk; dz <= nChunk; dz++) {
        const kc = (cx + dx) + ',' + (cz + dz);
        if (this.mondo.generati.has(kc)) continue;
        const d = distanzaChunk(cx + dx, cz + dz, x, z);
        if (d <= rg) voluti.push([d, kc]);
      }
    }
    voluti.sort((a, b) => a[0] - b[0]);
    this._coda = voluti.map((v) => v[1]);
    // e chi è troppo lontano se ne va — subito: buttare è gratis
    for (const kc of [...this.mondo.generati]) {
      const v = kc.indexOf(',');
      if (distanzaChunk(+kc.slice(0, v), +kc.slice(v + 1), x, z) > rt) this._scaricaChunk(kc);
    }
  }

  _generaChunk(kc) {
    const v = kc.indexOf(',');
    const cx = +kc.slice(0, v), cz = +kc.slice(v + 1);
    const decorazioni = this.genera(this.mondo, cx, cz) || [];
    this.mondo.segnaGenerato(kc);
    // ⚠ PRIMA LE MODIFICHE, POI LE DECORAZIONI: un albero tagliato dal giocatore
    // è una modifica «null» sulla sua cella, e va vinta dalla modifica.
    const mod = this.mondo.modifiche.get(kc);
    for (const [x, h, z, tipo] of decorazioni) {
      if (mod && mod.has(chiaveCella(x, h, z))) continue;
      this.mondo.metti(x, h, z, tipo);          // NON silenziosa: il registro deve saperlo
      this.mondo.modifiche.get(kc)?.delete(chiaveCella(x, h, z));   // non è una modifica del giocatore
    }
    this.mondo.applicaModifiche(kc);
    this.statistiche.generati++;
  }

  _scaricaChunk(kc) {
    const decorativi = this.mondo.scaricaChunk(kc);
    if (this.mondo.onEvento) for (const [x, y, z] of decorativi) this.mondo.onEvento({ tipo: 'togli', cella: [x, y, z] });
    this.statistiche.scaricati++;
  }
}

/** Distanza in pianta da (x, z) al punto più vicino del chunk (cx, cz). */
function distanzaChunk(cx, cz, x, z) {
  const x0 = cx * CHUNK, z0 = cz * CHUNK;
  const dx = Math.max(x0 - x, 0, x - (x0 + CHUNK)), dz = Math.max(z0 - z, 0, z - (z0 + CHUNK));
  return Math.sqrt(dx * dx + dz * dz);
}

// la chiave di cella del mondo (stessa formula di world.js: qui serve solo a
// confrontare le modifiche, che il mondo indicizza così)
const OFF_XZ = 2048, OFF_Y = 64;
const chiaveCella = (x, y, z) => ((x + OFF_XZ) * 4096 + (z + OFF_XZ)) * 256 + (y + OFF_Y);

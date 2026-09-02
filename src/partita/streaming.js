// LO STREAMING DEL NUCLEO — la frontiera genera, questo costruisce e scarica.
//
// Il mondo è infinito (`world/frontiera.js`, `generaChunkOpenWorld`): si
// genera fino a un margine oltre la resa, si costruisce (mesh + luce cotta)
// solo entro la resa, dal chunk più vicino, dentro un BUDGET di millisecondi
// per fotogramma — almeno un chunk a giro, così la coda non si ferma mai, e
// mai più del budget, così il fotogramma non scatta. I chunk che la frontiera
// scarica escono dallo schermo nello stesso giro.
//
// ⚠ LE MODIFICHE PASSANO DA QUI: il mondo segna `sporchi` (e i vicini di bordo,
// `_sporca`), ma la LUCE COTTA arriva a sei celle dal chunk (`luce-cotta.js`,
// MARGINE): un lampione posato a tre celle dal confine illumina anche il
// chunk accanto, che il mondo non segna. `tocca(x, z)` aggiunge i vicini
// entro quel margine. Chi cambia un blocco chiama `tocca`.
//
// ⚠ NIENTE DOM: riceve mondo, resa e generatore. Si prova in Node con una resa
// finta (`test/streaming.test.mjs`).
import { Frontiera } from '../world/frontiera.js';
import { CHUNK } from '../world/world.js';
import { costruisciChunkNucleo } from '../nucleo/mesher-nucleo.js';

const MARGINE_LUCE = 6;

export class Streaming {
  /**
   * @param mondo    il mondo
   * @param resa     chi ha `carica(kc, dati)`, `rimuovi(kc)`, `chunks` (Map)
   * @param genera   (mondo, cx, cz) → decorazioni, come vuole la frontiera
   */
  constructor(mondo, resa, genera, { erba = 8, raggioResa = 96, budgetMs = 5, lavoro = null } = {}) {
    this.mondo = mondo; this.resa = resa; this.erba = erba; this.raggioResa = raggioResa; this.budgetMs = budgetMs;
    // ⚠ LA SQUADRA DI WORKER (nucleo/lavoro.js), se c'è: i chunk si costruiscono
    // fuori dal filo principale e arrivano al giro dopo. Un chunk cambiato
    // mentre è in volo (`marca` diversa) si rimanda: il risultato vecchio si
    // butta, non si disegna un chunk già stantio.
    this.lavoro = lavoro;
    this._marca = new Map();
    this._vuoti = new Set();   // chunk generati senza blocchi (lo zoo, il vuoto): non si rimettono in coda a ogni giro
    this.frontiera = new Frontiera(mondo, genera, { margineGenera: 2 * CHUNK, margineTieni: 5 * CHUNK });
    this.coda = new Set();
    this.statistiche = { inCoda: 0, costruiti: 0, scaricati: 0, ultimaMs: 0, chunk: 0, inVolo: 0 };
    this._ordine = [];
  }

  /** L'avvio: genera e costruisce tutto quello che serve intorno, senza budget. */
  avvio(x, z) {
    this.frontiera.assicura(x, z, { resa: this.raggioResa }, { subito: true });
    this.aggiorna(x, z, Infinity);
  }

  /** Un blocco cambiato in (x, z): il suo chunk e i vicini entro il margine della luce. */
  tocca(x, z) {
    for (const dx of [-MARGINE_LUCE, 0, MARGINE_LUCE]) for (const dz of [-MARGINE_LUCE, 0, MARGINE_LUCE]) {
      this.coda.add(Math.floor((x + dx) / CHUNK) + ',' + Math.floor((z + dz) / CHUNK));
    }
  }

  /** Un giro: da chiamare a ogni fotogramma con la posizione di chi cammina. */
  aggiorna(x, z, budgetMs = this.budgetMs) {
    const t0 = performance.now();
    const m = this.mondo, r = this.resa;
    this.frontiera.assicura(x, z, { resa: this.raggioResa });
    for (const kc of m.sporchi) { this.coda.add(kc); this._vuoti.delete(kc); } m.sporchi.clear();
    for (const kc of m.sporchiAcqua) this.coda.add(kc); m.sporchiAcqua.clear();
    // ⚠ NON si rimette in coda chi è IN VOLO: rimesso, il suo risultato tornava
    // «stantio» (la coda lo aveva) e si buttava, per sempre — camminando, il
    // mondo non cresceva più. Visto nel bundle, 60 blocchi a est dello spawn.
    for (const kc of m.generati) if (!r.chunks.has(kc) && !this._vuoti.has(kc) && !(this.lavoro && this.lavoro.inVolo.has(kc))) this.coda.add(kc);
    for (const kc of [...r.chunks.keys()]) if (!m.generati.has(kc)) { r.rimuovi(kc); this.coda.delete(kc); this.statistiche.scaricati++; }
    if (this.coda.size) {
      const ordine = this._ordine; ordine.length = 0;
      for (const kc of this.coda) { const d = distanza(kc, x, z); if (d <= this.raggioResa + CHUNK) ordine.push([d, kc]); }
      ordine.sort((a, b) => a[0] - b[0]);
      let fatti = 0;
      this._vicini = ordine.length;
      for (const [, kc] of ordine) {
        if (!this.lavoro && fatti > 0 && performance.now() - t0 > budgetMs) break;
        if (this.lavoro && this.lavoro.vivo && this.lavoro.liberi === 0) break;   // si aspetta un operaio: la coda resta
        if (this.lavoro && this.lavoro.vivo && this.lavoro.inVolo.has(kc)) continue;   // già in volo: si rimanda al ritorno
        this.coda.delete(kc);
        if (!m.generati.has(kc)) continue;
        if (!m.chunks.has(kc)) { if (r.chunks.has(kc)) r.rimuovi(kc); this._vuoti.add(kc); this._vicini--; continue; }   // vuoto: niente da disegnare
        if (this.lavoro && this.lavoro.vivo && budgetMs !== Infinity) {
          const marca = (this._marca.get(kc) || 0) + 1; this._marca.set(kc, marca);
          if (this.lavoro.manda(m, kc, this.erba, marca) === null) { if (r.chunks.has(kc)) r.rimuovi(kc); }
          fatti++;
          continue;
        }
        r.carica(kc, costruisciChunkNucleo(m, kc, { erba: this.erba }));
        fatti++; this.statistiche.costruiti++;
      }
      this._vicini -= fatti;
    } else this._vicini = 0;
    // ── i chunk tornati dai Worker ───────────────────────────────────────────
    if (this.lavoro && this.lavoro.vivo) {
      for (const { kc, dati, marca } of this.lavoro.raccogli()) {
        if (!m.generati.has(kc)) continue;                       // scaricato nel frattempo
        if (this._marca.get(kc) !== marca) { this.coda.add(kc); continue; }   // cambiato in volo: si rifà
        if (this.coda.has(kc)) continue;                          // segnato di nuovo: arriva la versione nuova
        r.carica(kc, dati); this.statistiche.costruiti++;
      }
      this.statistiche.inVolo = this.lavoro.inVolo.size;
    }
    // ⚠ IN CODA = quelli ENTRO la resa ancora da costruire: i chunk oltre restano
    // in coda apposta (si costruiranno avvicinandosi) e non sono lavoro arretrato.
    this.statistiche.inCoda = this._vicini;
    this.statistiche.ultimaMs = performance.now() - t0;
    this.statistiche.chunk = r.chunks.size;
  }
}

function distanza(kc, x, z) {
  const v = kc.indexOf(',');
  return Math.hypot((+kc.slice(0, v)) * CHUNK + CHUNK / 2 - x, (+kc.slice(v + 1)) * CHUNK + CHUNK / 2 - z);
}

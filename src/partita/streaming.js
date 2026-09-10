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

/**
 * Quanti millisecondi si spendono a costruire PRIMA di mostrare il primo
 * fotogramma. ⚠ Non zero: il quadrato sotto i piedi deve esistere, se no si
 * cade nel vuoto e si vede il mondo comparire da sotto. Non tanti: ogni
 * millisecondo qui è pagina ferma, e su una macchina lenta si moltiplica.
 */
export const BUDGET_AVVIO = 250;

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
    this.frontiera = new Frontiera(mondo, genera, {
      margineGenera: 2 * CHUNK, margineTieni: 5 * CHUNK,
      // ⚠ UN CHUNK NUOVO RIMETTE IN CODA I VICINI **GIÀ COSTRUITI**, e solo
      // quelli: la loro luce cotta è di quando lui non c'era. Il «già costruiti»
      // non è un'ottimizzazione da poco, è quello che rende la cura gratis —
      // alla frontiera i vicini non sono ancora costruiti quasi mai (si genera
      // trentadue celle oltre la resa), quindi di solito questo insieme è vuoto
      // e non si rifà niente. Quando NON è vuoto, è esattamente il caso rotto.
      onGenerato: (kc, cx, cz) => {
        for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
          if (!dx && !dz) continue;
          const v = (cx + dx) + ',' + (cz + dz);
          if (this.resa.chunks.has(v)) { this.coda.add(v); this.statistiche.rifattiPerLuce++; }
        }
      },
    });
    this.coda = new Set();
    // ⚠ I CHUNK TORNATI DAI WORKER CHE ASPETTANO DI SALIRE SULLA GPU: il
    // caricamento costa, e senza una fila si faceva tutto dentro un fotogramma.
    this._daCaricare = [];
    this.statistiche = { inCoda: 0, costruiti: 0, scaricati: 0, ultimaMs: 0, chunk: 0, inVolo: 0, rifattiPerLuce: 0, generaMs: 0, costruisciMs: 0, daCaricare: 0 };
    this._ordine = [];
  }

  /**
   * L'avvio: genera quello che serve intorno e costruisce SOLO IL VICINO.
   *
   * ⚠ MISURA LE DUE FASI SEPARATE, e prima erano un numero solo scritto sotto
   * due nomi («worldgenMs» e «meshMs», identici in ogni rapporto): sembrava di
   * sapere dove andasse il tempo dell'avvio, e non lo diceva nessuno. Dal
   * Chromebook sono arrivati DICIANNOVE SECONDI di pagina ferma, e senza la
   * divisione non si poteva nemmeno cominciare a capire da che parte guardare.
   * Misurato appena divisi (questa macchina, raggio 96, 154 chunk):
   * **generazione 142 ms, costruzione 1767 ms** — il 92 % è la costruzione.
   *
   * ⚠ E LA COSTRUZIONE AVEVA BUDGET INFINITO: `aggiorna(x, z, Infinity)`
   * costruiva TUTTI E CENTOCINQUANTAQUATTRO i chunk prima di mostrare un
   * fotogramma. Su questa macchina 1,8 s, sul Chromebook una decina di volte
   * tanto. La cura è la STESSA già scritta in CLAUDE.md per il mesher vecchio
   * («l'avvio: sei secondi di schermo fermo, poi uno e mezzo») e mai arrivata
   * qui: si costruisce il vicino e il resto entra da solo, un po' per
   * fotogramma, mentre il gioco già risponde.
   *
   * ⚠ IL PREZZO È CHE IL MONDO SI VEDE POPOLARE, e vale la pena: uno schermo
   * fermo si legge come un gioco rotto, un mondo che si riempie si legge come un
   * mondo che carica.
   *
   * ⚠ E IL BUDGET È IN MILLISECONDI, non in numero di chunk: una macchina lenta
   * ne costruisce meno nello stesso tempo, che è esattamente quello che deve
   * fare. Un conteggio fisso darebbe a tutti la stessa attesa MOLTIPLICATA per
   * quanto sono lenti — cioè punirebbe proprio chi ha già poco.
   */
  avvio(x, z) {
    const t0 = performance.now();
    this.frontiera.assicura(x, z, { resa: this.raggioResa }, { subito: true });
    const t1 = performance.now();
    this.aggiorna(x, z, BUDGET_AVVIO);
    this.statistiche.generaMs = t1 - t0;
    this.statistiche.costruisciMs = performance.now() - t1;
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
    //
    // ⚠ ARRIVANO A RAFFICA E SI CARICANO A GOCCE, e prima non era così: si
    // faceva `carica` per OGNI chunk tornato, senza nessun tetto. Ogni `carica`
    // manda alla GPU i buffer del chunk (vertici, erba, acqua) e riscrive la
    // tegola delle altezze: con quattro operai che consegnano insieme sono
    // decine di caricamenti dentro un fotogramma solo.
    // ⚠ NON SI VEDEVA finché l'avvio costruiva tutto in linea; appena la
    // costruzione è passata ai Worker (10/09/2026) il costo si è spostato QUI, e
    // dal Chromebook è arrivato **JS 29,7 ms su un fotogramma da 66** con
    // novantacinque chunk ancora in coda. Il tetto sulla costruzione c'era e su
    // questo no: il lavoro è passato dalla porta senza guardia.
    if (this.lavoro && this.lavoro.vivo) {
      for (const x of this.lavoro.raccogli()) this._daCaricare.push(x);
      this.statistiche.inVolo = this.lavoro.inVolo.size;
    }
    // ⚠ ALMENO UNO A GIRO, come per la costruzione: senza, su una macchina già
    // in ritardo il budget è finito prima ancora di cominciare e la coda non si
    // svuota MAI — il mondo smette di crescere e sembra un guasto dello
    // streaming, non un budget stretto.
    let caricati = 0;
    while (this._daCaricare.length) {
      if (caricati > 0 && performance.now() - t0 > budgetMs) break;
      const { kc, dati, marca } = this._daCaricare.shift();
      if (!m.generati.has(kc)) continue;                       // scaricato nel frattempo
      if (this._marca.get(kc) !== marca) { this.coda.add(kc); continue; }   // cambiato in volo: si rifà
      if (this.coda.has(kc)) continue;                          // segnato di nuovo: arriva la versione nuova
      r.carica(kc, dati); this.statistiche.costruiti++; caricati++;
    }
    // ⚠ IN CODA = quelli ENTRO la resa ancora da costruire, PIÙ quelli già
    // costruiti che aspettano di salire sulla GPU: se no un mondo ancora a metà
    // si dichiarava finito, e il pannello diceva «coda 0» mentre arrivavano.
    this.statistiche.inCoda = this._vicini + this._daCaricare.length;
    this.statistiche.daCaricare = this._daCaricare.length;
    this.statistiche.ultimaMs = performance.now() - t0;
    this.statistiche.chunk = r.chunks.size;
  }
}

function distanza(kc, x, z) {
  const v = kc.indexOf(',');
  return Math.hypot((+kc.slice(0, v)) * CHUNK + CHUNK / 2 - x, (+kc.slice(v + 1)) * CHUNK + CHUNK / 2 - z);
}

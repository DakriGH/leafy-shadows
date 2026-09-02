// IL LAVORO — la squadra di Worker che costruisce i chunk del nucleo.
//
// `creaLavoro()` torna null dove i Worker non ci sono (Node, o un browser
// che li vieta): chi lo usa (partita/streaming.js) costruisce in linea. Se un
// Worker muore, la squadra lo dimentica e quello che aveva in volo torna in
// coda al giro dopo: il filo principale non aspetta mai nessuno.
//
// ⚠ L'URL DEL WORKER È RELATIVO A QUESTO FILE: in sviluppo è
// `src/nucleo/mesher-nucleo-worker.js`, nel bundle (esbuild con
// `entryNames: '[name]'`, vedi scripts/pubblica.mjs) è
// `mesher-nucleo-worker.js` accanto a `partita.js`. Stesso nome, per questo.
import { fotografa } from '../world/mesher-foto.js';
import { MARGINE as MARGINE_LUCE } from './luce-cotta.js';

export class Lavoro {
  constructor(n) {
    this.operai = [];
    this.pronti = [];
    this.inVolo = new Map();     // kc → marca
    for (let i = 0; i < n; i++) {
      const w = new Worker(new URL('./mesher-nucleo-worker.js', import.meta.url), { type: 'module' });
      const o = { w, occupato: null };
      w.onmessage = (ev) => { o.occupato = null; this.pronti.push(ev.data); };
      w.onerror = (ev) => {
        console.warn('lavoro: un Worker si è fermato —', ev && ev.message);
        this.operai = this.operai.filter((x) => x !== o);
        if (o.occupato) this.inVolo.delete(o.occupato);
        try { w.terminate(); } catch { /* niente */ }
      };
      this.operai.push(o);
    }
  }

  get vivo() { return this.operai.length > 0; }
  get liberi() { return this.operai.filter((o) => !o.occupato).length; }

  /** Manda un chunk a un operaio libero. Torna false se nessuno è libero o il chunk è vuoto. */
  manda(mondo, kc, erba, marca = 0) {
    const o = this.operai.find((x) => !x.occupato);
    if (!o) return false;
    const f = fotografa(mondo, kc, 0, false, null, MARGINE_LUCE);
    if (!f) return null;
    f.erba = erba; f.marca = marca;
    o.occupato = kc; this.inVolo.set(kc, marca);
    o.w.postMessage(f, [f.celle.buffer]);
    return true;
  }

  /** I risultati arrivati dall'ultimo giro (svuota la lista). */
  raccogli() {
    const r = this.pronti; this.pronti = [];
    for (const x of r) this.inVolo.delete(x.kc);
    return r;
  }
}

export function creaLavoro(n = null) {
  if (typeof Worker !== 'function') return null;
  const quanti = n ?? Math.max(1, Math.min(3, (globalThis.navigator && navigator.hardwareConcurrency || 2) - 1));
  try { const l = new Lavoro(quanti); return l.vivo ? l : null; } catch (e) { console.warn('lavoro: niente Worker —', e && e.message); return null; }
}

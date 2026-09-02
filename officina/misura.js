// Officina — IL CAMPIONATORE.
//
// «Va piano» è un'opinione; p50 e p99 del tempo di fotogramma sono un fatto. Il
// campionatore registra ogni frame (durata, disegni, ms delle passate RTT) e
// dà i percentili. Serve al bordo del pannello (numeri vivi) e alle misure
// A/B: «misura 5 s» prima e dopo un cambiamento, e si confronta.
//
// ⚠ SUL TELEFONO IL PRIMO SECONDO DOPO UN CAMBIO È SPORCO: compilazione shader,
// risemina dell'erba, RTT da riallocare. `misura()` scarta il riscaldo.

export class Campionatore {
  constructor({ campione, finestra = 240 } = {}) {
    this._campione = campione || (() => ({}));   // () => { disegni?, rtMs?, ... }
    this.finestra = finestra;
    this.ms = [];
    this.disegni = [];
    this.rtMs = [];
    this._prima = 0;
    this._raccolta = null;
  }

  // Da chiamare a ogni frame (prima o dopo il render, purché sempre nello stesso punto).
  passo(adesso = performance.now()) {
    if (this._prima) {
      const dt = adesso - this._prima;
      const c = this._campione() || {};
      spingi(this.ms, dt, this.finestra);
      if (Number.isFinite(c.disegni)) spingi(this.disegni, c.disegni, this.finestra);
      if (Number.isFinite(c.rtMs)) spingi(this.rtMs, c.rtMs, this.finestra);
      if (this._raccolta && adesso >= this._raccolta.da) {
        this._raccolta.ms.push(dt);
        if (Number.isFinite(c.disegni)) this._raccolta.disegni.push(c.disegni);
        if (Number.isFinite(c.rtMs)) this._raccolta.rtMs.push(c.rtMs);
      }
    }
    this._prima = adesso;
  }

  // Istantanea sugli ultimi `finestra` frame.
  adesso() {
    return {
      fps: this.ms.length ? Math.round(1000 / percentile(this.ms, 0.5)) : null,
      p50: arr(percentile(this.ms, 0.5)),
      p99: arr(percentile(this.ms, 0.99)),
      disegni: this.disegni.length ? Math.round(percentile(this.disegni, 0.5)) : null,
      rtMs: arr(percentile(this.rtMs, 0.5)),
    };
  }

  // Misura vera: `secondi` di raccolta dopo `riscaldo` secondi scartati.
  misura({ secondi = 5, riscaldo = 1, etichetta = '' } = {}) {
    const inizio = performance.now();
    this._raccolta = { da: inizio + riscaldo * 1000, ms: [], disegni: [], rtMs: [] };
    return new Promise((risolvi) => {
      const fine = inizio + (riscaldo + secondi) * 1000;
      const controlla = () => {
        if (performance.now() < fine) return requestAnimationFrame(controlla);
        const r = this._raccolta; this._raccolta = null;
        risolvi({
          etichetta, frame: r.ms.length, secondi,
          fps: r.ms.length ? Math.round(1000 / percentile(r.ms, 0.5)) : null,
          p50: arr(percentile(r.ms, 0.5)), p99: arr(percentile(r.ms, 0.99)),
          disegni: r.disegni.length ? Math.round(percentile(r.disegni, 0.5)) : null,
          rtMs: arr(percentile(r.rtMs, 0.5)),
        });
      };
      requestAnimationFrame(controlla);
    });
  }
}

function spingi(a, v, n) { a.push(v); if (a.length > n) a.shift(); }
function percentile(a, q) { if (!a.length) return NaN; const s = a.slice().sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * q))]; }
function arr(v) { return Number.isFinite(v) ? Math.round(v * 10) / 10 : null; }

// Tabella di testo per il rapporto (monospazio, si incolla in una chat).
export function tabellaMisure(righe) {
  const largo = Math.max(8, ...righe.map((r) => (r.etichetta || '').length));
  const testa = `${'misura'.padEnd(largo)}   fps   p50    p99   disegni  rt ms`;
  return [testa, ...righe.map((r) =>
    `${(r.etichetta || '').padEnd(largo)}  ${String(r.fps ?? '—').padStart(4)}  ${String(r.p50 ?? '—').padStart(5)}  ${String(r.p99 ?? '—').padStart(5)}  ${String(r.disegni ?? '—').padStart(7)}  ${String(r.rtMs ?? '—').padStart(5)}`
  )].join('\n');
}

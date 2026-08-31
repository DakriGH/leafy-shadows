// IL BANCO DI MISURA — la fase R1 del rework: prima di toccare, si fotografa.
//
// ⚠ QUESTO FILE NON NOMINA NESSUN MOTORE E NESSUN DOM: riceve numeri e ne
// restituisce statistiche. È la parte del misuratore che DEVE essere provata in
// Node (`test/misure.test.mjs`), perché è quella che mente in silenzio: un
// percentile calcolato male non dà errori — dà rapporti «a posto» su un gioco
// che singhiozza, che è l'errore già pagato due volte (la media in Lantern, il
// contatore delle ombre che conservava l'ultimo valore).
//
// ⚠ PERCHÉ percentili E NON MEDIE, detto una volta per tutta la sessione: uno
// scatto ogni due secondi è invisibile in una media su 300 fotogrammi (299×7ms
// + 1×80ms = media 7,2ms, «tutto bene») ed è ESATTAMENTE quello che l'occhio
// sente. Il p99 lo becca; il max dice il caso peggiore; il p50 dice il ritmo.

/**
 * Le statistiche di una serie di tempi (ms per fotogramma).
 * @returns { quanti, p50, p90, p99, max, media } — media inclusa SOLO per
 *          smascherarla: quando p99 e media raccontano storie diverse, è la
 *          media che sta mentendo.
 */
export function statistiche(tempi) {
  if (!tempi || !tempi.length) return null;
  const ord = [...tempi].sort((a, b) => a - b);
  // ⚠ IL PERCENTILE È «IL VALORE SOTTO CUI STA IL P%», con l'indice CLAMPATO:
  // su 300 campioni il p99 è l'indice 297, non 299 — prendere l'ultimo
  // trasformerebbe il p99 nel max, e i due numeri servono proprio perché
  // dicono cose diverse (uno scatto sistematico contro un caso isolato).
  const p = (q) => ord[Math.min(ord.length - 1, Math.floor(ord.length * q))];
  const somma = ord.reduce((a, b) => a + b, 0);
  return {
    quanti: ord.length,
    p50: +p(0.5).toFixed(2),
    p90: +p(0.9).toFixed(2),
    p99: +p(0.99).toFixed(2),
    max: +ord[ord.length - 1].toFixed(2),
    media: +(somma / ord.length).toFixed(2),
  };
}

/**
 * IL QUADRO di una sessione di misura: fotogrammi + contatori di scena.
 *
 * `campioni` è quello che il raccoglitore ha messo da parte a ogni fotogramma:
 * { ms, disegni, triangoli, ombreMs, rtMs }. Qui si riassume; là si campiona.
 */
export function quadro(campioni, contesto = {}) {
  const serie = (nome) => campioni.map((c) => c[nome]).filter((v) => Number.isFinite(v));
  return {
    contesto,
    fotogramma: statistiche(serie('ms')),
    ombreMs: statistiche(serie('ombreMs')),
    passateMs: statistiche(serie('rtMs')),
    disegni: statistiche(serie('disegni')),
    triangoli: statistiche(serie('triangoli')),
  };
}

/**
 * IL CONFRONTO fra due quadri: la forma in cui ogni fase del rework si chiude.
 *
 * ⚠ SI CONFRONTANO I PERCENTILI, MAI QUADRO CONTRO «SENSAZIONE»: il guadagno è
 * (prima − dopo) sul p50 e sul p99, in ms e in percento. Un'ottimizzazione che
 * migliora il p50 e peggiora il p99 ha spostato il costo, non l'ha tolto — e
 * questa funzione la smaschera invece di farla passare per vittoria.
 */
export function confronto(prima, dopo) {
  const riga = (nome) => {
    const a = prima[nome], b = dopo[nome];
    if (!a || !b) return null;
    return {
      p50: { prima: a.p50, dopo: b.p50, guadagnoMs: +(a.p50 - b.p50).toFixed(2), guadagnoPct: a.p50 ? +((1 - b.p50 / a.p50) * 100).toFixed(1) : 0 },
      p99: { prima: a.p99, dopo: b.p99, guadagnoMs: +(a.p99 - b.p99).toFixed(2), guadagnoPct: a.p99 ? +((1 - b.p99 / a.p99) * 100).toFixed(1) : 0 },
    };
  };
  return { fotogramma: riga('fotogramma'), ombreMs: riga('ombreMs'), passateMs: riga('passateMs') };
}

/** Il quadro in righe leggibili, per il pannello e per il rapporto 🩺. */
export function stampaQuadro(q) {
  if (!q) return 'nessuna misura';
  const r = (nome, s, unita = 'ms') => (s ? `${nome}  p50 ${s.p50} · p90 ${s.p90} · p99 ${s.p99} · max ${s.max} ${unita}` : `${nome}  —`);
  const c = q.contesto || {};
  return [
    `${c.dove || '?'}  ${c.scena || ''}  ${c.pixel || ''}`,
    r('fotogramma', q.fotogramma),
    r('ombre     ', q.ombreMs),
    r('passate   ', q.passateMs),
    r('disegni   ', q.disegni, ''),
    r('triangoli ', q.triangoli, ''),
    c.passate ? `pipeline: ${c.passate}` : '',
  ].filter(Boolean).join('\n');
}

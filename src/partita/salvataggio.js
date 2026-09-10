// IL SALVATAGGIO — le modifiche del giocatore, e basta.
//
// ⚠ NON SI SALVA IL MONDO, SI SALVANO LE DIFFERENZE: un chunk è il suo seme
// più la storia di chi l'ha toccato (`world/frontiera.js`), e il mondo le
// tiene già per chunk in `mondo.modifiche` (cella → tipo, o null = tolta).
// Salvare quelle è salvare tutto, in pochi KB, e ricaricarle PRIMA che la
// frontiera generi vuol dire che ogni chunk rinasce già modificato.
//
// ⚠ NIENTE DOM, NIENTE localStorage QUI DENTRO: si passano stringhe. Chi le
// mette da qualche parte (partita.js) decide dove; questo file si prova in Node.

const VERSIONE = 1;

/** Le modifiche del mondo come stringa JSON compatta. */
export function impacchetta(mondo, extra = {}) {
  const chunk = {};
  for (const [kc, m] of mondo.modifiche) {
    if (!m.size) continue;
    chunk[kc] = [...m].map(([k, tipo]) => [k, tipo]);
  }
  // ⚠ LE CELLE BAGNATE VANNO SALVATE, se no un albero piantato in un lago
  // torna asciutto al ricaricamento: il waterlogging è una decisione di chi
  // gioca, non un dato rigenerabile dal seme.
  // ⚠ E IL CAMPO È FACOLTATIVO, senza alzare la VERSIONE. Alzarla farebbe
  // rifiutare i salvataggi che ci sono già (`dati.v !== VERSIONE` torna −1) e
  // butterebbe via il mondo che il committente ha costruito, in cambio di un
  // campo che i pacchi vecchi semplicemente non hanno.
  const bagnate = mondo.bagnate && mondo.bagnate.size ? [...mondo.bagnate] : undefined;
  return JSON.stringify({ v: VERSIONE, chunk, ...(bagnate ? { bagnate } : {}), ...extra });
}

/** Rimette le modifiche nel mondo (prima della generazione). Torna quante celle, o -1 se il pacco non è buono. */
export function spacchetta(mondo, testo) {
  if (!testo) return 0;
  let dati;
  try { dati = JSON.parse(testo); } catch { return -1; }
  if (!dati || dati.v !== VERSIONE || typeof dati.chunk !== 'object') return -1;
  let n = 0;
  for (const [kc, lista] of Object.entries(dati.chunk)) {
    if (!/^-?\d+,-?\d+$/.test(kc) || !Array.isArray(lista)) continue;
    const m = new Map();
    for (const voce of lista) {
      if (!Array.isArray(voce) || voce.length !== 2 || !Number.isInteger(voce[0])) continue;
      if (voce[1] !== null && typeof voce[1] !== 'string') continue;
      m.set(voce[0], voce[1]); n++;
    }
    if (m.size) mondo.modifiche.set(kc, m);
  }
  // ⚠ SI RIMETTONO SUBITO, non alla generazione del chunk: `bagnata()` è una
  // ricerca in una mappa e non ha bisogno che il chunk esista. Chi lo chiede è
  // il mesher, e il mesher chiede solo delle celle che sta già costruendo.
  if (Array.isArray(dati.bagnate) && mondo.bagnate) {
    for (const voce of dati.bagnate) {
      if (!Array.isArray(voce) || voce.length !== 2) continue;
      if (!Number.isInteger(voce[0]) || !Number.isInteger(voce[1])) continue;
      mondo.bagnate.set(voce[0], Math.max(0, Math.min(15, voce[1])));
    }
  }
  return n;
}

/** Quante celle modificate ci sono in tutto. */
export function contaModifiche(mondo) { let n = 0; for (const m of mondo.modifiche.values()) n += m.size; return n; }

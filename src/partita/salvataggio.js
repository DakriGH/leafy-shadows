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
  return JSON.stringify({ v: VERSIONE, chunk, ...extra });
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
  return n;
}

/** Quante celle modificate ci sono in tutto. */
export function contaModifiche(mondo) { let n = 0; for (const m of mondo.modifiche.values()) n += m.size; return n; }

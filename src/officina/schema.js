// Officina — LO SCHEMA DEI CAMPI.
//
// Un registro è { chiave, nome, nota?, campi: [...] }. Un campo è
//   { chiave, nome, tipo, leggi(), scrivi(v), nota?, ...parametri del tipo }
// e il pannello si genera da solo leggendo `tipo`. Tipi:
//   numero      { min, max, passo, unita? }        slider + valore
//   interruttore                                   sì/no
//   scelta      { scelte: [{v, nome}] | ['a','b'] } menu
//   colore                                         '#rrggbb'
//   testo                                          riga di testo (sola lettura se manca scrivi)
//   azione      { fai() }                          bottone
//   lettura                                        valore mostrato e basta (si aggiorna da solo)
//
// ⚠ NIENTE CAMPI SENZA `leggi`: l'Officina disegna SEMPRE il valore vero della
// scena, mai quello che crede di aver scritto. Se il gioco cambia una cosa da
// solo (lo scalatore adattivo, il ciclo del giorno), il pannello lo mostra.

export const TIPI = ['numero', 'interruttore', 'scelta', 'colore', 'testo', 'azione', 'lettura'];

export function normalizzaRegistro(r) {
  if (!r || !r.chiave || !Array.isArray(r.campi)) throw new Error(`registro malformato: ${r && r.chiave}`);
  for (const c of r.campi) {
    if (!TIPI.includes(c.tipo)) throw new Error(`${r.chiave}.${c.chiave}: tipo sconosciuto «${c.tipo}»`);
    if (c.tipo !== 'azione' && typeof c.leggi !== 'function') throw new Error(`${r.chiave}.${c.chiave}: manca leggi()`);
    if (c.tipo === 'scelta') c.scelte = (c.scelte || []).map((s) => (typeof s === 'object' ? s : { v: s, nome: String(s) }));
    if (c.tipo === 'numero') { c.min ??= 0; c.max ??= 1; c.passo ??= (c.max - c.min) / 100; }
  }
  return r;
}

// Valore → testo corto per il pannello e per il rapporto.
export function mostra(campo, v) {
  if (v == null) return '—';
  switch (campo.tipo) {
    case 'numero': {
      const d = campo.passo >= 1 ? 0 : campo.passo >= 0.1 ? 1 : campo.passo >= 0.01 ? 2 : 3;
      return Number(v).toFixed(d) + (campo.unita ? ' ' + campo.unita : '');
    }
    case 'interruttore': return v ? 'sì' : 'no';
    case 'scelta': { const s = campo.scelte.find((x) => x.v === v); return s ? s.nome : String(v); }
    default: return typeof v === 'object' ? JSON.stringify(v) : String(v);
  }
}

// Stringa dallo slider/menu → valore del tipo giusto.
export function interpreta(campo, testo) {
  switch (campo.tipo) {
    case 'numero': return Number(testo);
    case 'interruttore': return !!testo && testo !== 'false';
    case 'scelta': { const s = campo.scelte.find((x) => String(x.v) === String(testo)); return s ? s.v : testo; }
    default: return testo;
  }
}

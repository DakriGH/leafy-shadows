// Officina — I PRESET.
//
// Un preset è lo stato netto dei registri: { versione, nome, quando, valori: {registro: {campo: v}} }.
// Si salva nel localStorage del browser (per ritrovarlo domani sullo stesso
// telefono) e si esporta come JSON (per portarlo nel sorgente o mandarlo in
// chat). ⚠ IL SALVATAGGIO VIVE NEL BROWSER CHE USI, come per i diorami di
// Lantern: se cambi browser, esporta.

const CHIAVE = 'leafy.officina.preset';

export function raccogli(registri) {
  const valori = {};
  for (const r of registri) {
    for (const c of r.campi) {
      if (c.tipo === 'azione' || c.tipo === 'lettura' || !c.scrivi) continue;
      (valori[r.chiave] ||= {})[c.chiave] = c.leggi();
    }
  }
  return valori;
}

export function applica(registri, valori, scrivi) {
  let n = 0;
  for (const r of registri) {
    const v = valori && valori[r.chiave]; if (!v) continue;
    for (const c of r.campi) if (c.chiave in v && c.scrivi) { scrivi(r.chiave, c.chiave, v[c.chiave]); n++; }
  }
  return n;
}

export function impacchetta(registri, nome = 'preset') {
  return { versione: 1, nome, quando: new Date().toISOString(), valori: raccogli(registri) };
}

export function salvaLocale(pacchetto) {
  try { const tutti = leggiLocali(); tutti[pacchetto.nome] = pacchetto; localStorage.setItem(CHIAVE, JSON.stringify(tutti)); return true; } catch { return false; }
}
export function leggiLocali() {
  try { return JSON.parse(localStorage.getItem(CHIAVE) || '{}') || {}; } catch { return {}; }
}
export function cancellaLocale(nome) {
  try { const tutti = leggiLocali(); delete tutti[nome]; localStorage.setItem(CHIAVE, JSON.stringify(tutti)); } catch {}
}

// Copia negli appunti con ripiego (su alcuni browser mobili navigator.clipboard
// vuole un gesto: la chiamata arriva sempre da un tocco su un bottone).
export async function copia(testo) {
  try { await navigator.clipboard.writeText(testo); return true; } catch {}
  try {
    const ta = document.createElement('textarea'); ta.value = testo; ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand('copy'); ta.remove(); return ok;
  } catch { return false; }
}

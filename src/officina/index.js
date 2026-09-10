// Officina — LA PORTA.
//
//   import { apriOfficina } from './officina/index.js';
//   const off = apriOfficina({ registri, campione, autore });
//
// `registri` è un elenco di registri (schema.js); `campione` è una funzione
// () => ({ disegni, rtMs }) letta a ogni frame dal campionatore. Chi la usa
// deve chiamare `off.passo()` una volta per frame (o passare `agganciaFrame`).
//
// ⚠ QUI NON SI SA NIENTE DEL GIOCO, ed è la regola che ha fatto sparire
// l'adattatore. Nella versione che girava sopra la build pubblicata c'era un
// file (`leafy.js`) che conosceva i nomi interni di TUTTO — `rig._specchioAcqua`,
// `fabbrica.acqua.vera`, `scala.fissa` — perché era l'unico modo di parlare a un
// gioco senza sorgente. Adesso ogni modulo dichiara il SUO registro accanto al
// suo codice (`registroAcqua` in motore/acqua.js, `registroQualita` in
// motore/qualita.js…) e `src/officina/apri.js` li mette in fila: chi cambia una
// manopola cambia la riga che le sta accanto, non un file lontano che mente in
// silenzio.

import { BusComandi } from './comandi.js';
import { normalizzaRegistro } from './schema.js';
import { Campionatore } from './misura.js';
import { Pannello } from './pannello.js';

export function apriOfficina({ registri, campione, autore = 'officina', titolo = 'Officina', apertoSubito = false, agganciaFrame, contenitore = null, scuro = false } = {}) {
  registri = registri.map(normalizzaRegistro);
  const perChiave = new Map(registri.map((r) => [r.chiave, new Map(r.campi.map((c) => [c.chiave, c]))]));

  const perRegistro = new Map(registri.map((r) => [r.chiave, r]));
  const scrivi = (registro, campo, valore) => {
    const c = perChiave.get(registro) && perChiave.get(registro).get(campo);
    if (c && c.scrivi) { c.scrivi(valore); return; }
    // ⚠ I CAMPI DINAMICI ESISTONO PER L'ISPETTORE, e senza di loro l'ispettore
    // sarebbe l'unica parte dell'Officina senza annulla/ripeti. Le manopole di
    // una vista sono note in anticipo; le proprietà di un'ENTITÀ no — la chiave
    // è «<id>.giro», e l'id nasce quando qualcuno posa un albero. Un registro
    // può quindi dichiarare `scriviDinamico(campo, valore)` e prendersi tutte le
    // chiavi che lo schema non conosce, passando comunque dal bus dei comandi.
    const r = perRegistro.get(registro);
    if (r && typeof r.scriviDinamico === 'function') { r.scriviDinamico(campo, valore); return; }
    throw new Error(`campo non scrivibile: ${registro}.${campo}`);
  };
  const bus = new BusComandi({ scrivi, autore });
  const campionatore = new Campionatore({ campione });

  const vivi = (corto) => {
    const a = campionatore.adesso();
    if (a.fps == null) return corto ? 'Officina' : 'in attesa del primo fotogramma…';
    if (corto) return `${a.fps} fps · ${a.disegni ?? '—'}d`;
    return `<b>${a.fps}</b> fps · p50 ${a.p50} · p99 ${a.p99} ms · <b>${a.disegni ?? '—'}</b> disegni · rt ${a.rtMs ?? '—'} ms`;
  };
  const pannello = new Pannello({ registri, bus, vivi, titolo, contenitore, scuro });
  if (apertoSubito) pannello.apri(true);
  if (agganciaFrame) agganciaFrame(() => campionatore.passo());

  return { registri, bus, campionatore, pannello, vivi, passo: () => campionatore.passo() };
}

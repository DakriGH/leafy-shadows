// Officina — LA PORTA.
//
//   import { apriOfficina } from './officina/index.js';
//   const off = apriOfficina({ registri, campione, autore });
//
// `registri` è un elenco di registri (schema.js); `campione` è una funzione
// () => ({ disegni, rtMs }) letta a ogni frame dal campionatore. Chi la usa
// deve chiamare `off.passo()` una volta per frame (o passare `agganciaFrame`).
// Per la build pubblicata c'è già tutto pronto in leafy.js.

import { BusComandi } from './comandi.js';
import { normalizzaRegistro } from './schema.js';
import { Campionatore } from './misura.js';
import { Pannello } from './pannello.js';

export function apriOfficina({ registri, campione, autore = 'officina', titolo = 'Officina', apertoSubito = false, agganciaFrame } = {}) {
  registri = registri.map(normalizzaRegistro);
  const perChiave = new Map(registri.map((r) => [r.chiave, new Map(r.campi.map((c) => [c.chiave, c]))]));

  const scrivi = (registro, campo, valore) => {
    const c = perChiave.get(registro) && perChiave.get(registro).get(campo);
    if (!c || !c.scrivi) throw new Error(`campo non scrivibile: ${registro}.${campo}`);
    c.scrivi(valore);
  };
  const bus = new BusComandi({ scrivi, autore });
  const campionatore = new Campionatore({ campione });

  const vivi = (corto) => {
    const a = campionatore.adesso();
    if (a.fps == null) return corto ? 'Officina' : 'in attesa del primo fotogramma…';
    if (corto) return `${a.fps} fps · ${a.disegni ?? '—'}d`;
    return `<b>${a.fps}</b> fps · p50 ${a.p50} · p99 ${a.p99} ms · <b>${a.disegni ?? '—'}</b> disegni · rt ${a.rtMs ?? '—'} ms`;
  };
  const pannello = new Pannello({ registri, bus, vivi, titolo });
  if (apertoSubito) pannello.apri(true);
  if (agganciaFrame) agganciaFrame(() => campionatore.passo());

  return { registri, bus, campionatore, pannello, passo: () => campionatore.passo() };
}

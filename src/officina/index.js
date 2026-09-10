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

/**
 * @param gruppi  facoltativo: `[{ contenitore, registri, etichetta, azioni }]`.
 *
 * ⚠ SERVE PER LA SHELL A PIÙ RIQUADRI, quella che il committente chiama «come
 * Unity»: gerarchia a sinistra, ispettore a destra, assets sotto. Un pannello
 * solo con dieci schede non è un editor — è un cassetto: per guardare un
 * oggetto mentre si sfogliano gli assets bisognerebbe avere due schede aperte
 * insieme, che è precisamente quello che una scheda non sa fare.
 *
 * I riquadri sono Pannelli diversi ma condividono **un bus solo**: annulla e
 * ripeti valgono per tutto l'editor, non per il riquadro in cui si è.
 */
export function apriOfficina({ registri, gruppi = null, campione, autore = 'officina', titolo = 'Officina', apertoSubito = false, agganciaFrame, contenitore = null, scuro = false } = {}) {
  if (gruppi) registri = gruppi.flatMap((g) => g.registri);
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
  const pannelli = (gruppi || [{ contenitore, registri, etichetta: null, azioni: true }]).map((g, i) => new Pannello({
    registri: g.registri.map(normalizzaRegistro), bus, vivi, titolo,
    contenitore: g.contenitore || contenitore, scuro,
    etichetta: g.etichetta ?? null,
    // annulla/ripeti su un riquadro solo: il bus è uno, e quattro coppie di
    // frecce sembrerebbero quattro storie diverse
    azioni: g.azioni ?? i === 0,
  }));
  const pannello = pannelli[0];
  if (apertoSubito) for (const p of pannelli) p.apri(true);
  if (agganciaFrame) agganciaFrame(() => campionatore.passo());

  /** Porta in primo piano una scheda, in qualunque riquadro sia. */
  const vaiA = (chiave) => { for (const p of pannelli) if (p.registri.some((r) => r.chiave === chiave)) p.vaiA(chiave); };

  return { registri, bus, campionatore, pannello, pannelli, vivi, vaiA, passo: () => campionatore.passo() };
}

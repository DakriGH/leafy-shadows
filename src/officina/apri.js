// L'OFFICINA, INNESTATA NEL GIOCO — la porta unica.
//
// ⚠ QUI NON C'È NESSUN ADATTATORE, ed è tutta la differenza con la versione che
// girava sopra la build pubblicata. Là un file solo (`officina/leafy.js`)
// conosceva i nomi interni di tutto il motore — `rig._specchioAcqua`,
// `fabbrica.acqua.vera`, `scala.fissa` — perché era l'unico modo di parlare a un
// gioco senza sorgente; e un file così mente in silenzio il giorno che qualcuno
// rinomina una cosa. Adesso ogni modulo dichiara il SUO registro accanto al suo
// codice, e questo file li mette in fila. Se un registro si rompe, si rompe
// dove sta la manopola.
//
// ⚠ E SI CARICA SOLO SE LA SI CHIEDE (`?officina` nell'indirizzo): è uno
// strumento, e chi apre il gioco per giocare non deve pagarne il DOM, i
// timer, né il campionatore.

import { apriOfficina } from './index.js';
import { apriEditor } from './editor.js';
import { tabellaMisure } from './misura.js';
import { impacchetta, applica, salvaLocale, leggiLocali, copia } from './preset.js';
import { registroAcqua } from '../motore/acqua.js';
import { registroQualita } from '../motore/qualita.js';
import { registroOmbre, registroMotore } from '../motore/motore.js';
import { registroGiorno } from '../motore/giorno.js';
import { registroErba } from '../vegetazione/erba.js';

/**
 * @param pezzi  { rig, fabbrica, scala, giorno, erba, particelle, versione }
 *               — gli oggetti VERI del gioco, non nomi da indovinare.
 */
export function apriLOfficina(pezzi, { apertoSubito = true, editor = true } = {}) {
  const { rig, fabbrica, scala, giorno, erba, particelle } = pezzi;
  const bersagli = { erba, fabbrica, particelle };
  let off = null;
  const misure = [];
  const stato = { preset: '' };

  // ── la scheda «Misura»: è dell'Officina, non di un modulo del motore ──────
  const passateTesto = () => rig.passate()
    .map((e) => `${e.nome} ${e.lato}²×${e.passate} (${e.mesh < 0 ? 'tutte' : e.mesh} mesh)`).join('\n');
  // ⚠ L'ETICHETTA DICE LA CONFIGURAZIONE, se no la tabella delle misure è un
  // elenco di numeri senza padre e il confronto lo si fa a memoria.
  const etichetta = () => `#${misure.length + 1} q${scala.livello} ${fabbrica.acqua.ricetta || fabbrica.acqua.stile}`
    + ` v${fabbrica.acqua.vera | 0}${fabbrica.acqua.riflesso ? '+sp' : ''}`;
  const rapporto = () => [
    `Leafy-Shadows · Officina · ${pezzi.versione || ''}`,
    `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'} · ${rig.scheda.nome}`,
    `${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()} · dpr ${devicePixelRatio}`
      + ` · scala ${rig.profilo.scala} · gradino ${scala.livello}/${scala.quanti - 1}`
      + `${scala.adatta.manuale ? ' (a mano)' : ''}`,
    `mesh ${rig.scena.meshes.length} (${rig.scena.getActiveMeshes().length} attive) · materiali ${rig.scena.materials.length}`,
    '', 'passate:', passateTesto(), '',
    misure.length ? tabellaMisure(misure) : '(nessuna misura)',
    '', 'comandi netti:', JSON.stringify(off ? off.bus.netto() : {}, null, 1),
  ].join('\n');

  const diagnostica = {
    chiave: 'misura', nome: 'Misura',
    nota: 'Una misura = 5 s di raccolta dopo 1 s di riscaldo (il primo secondo dopo un cambio è sporco: '
      + 'shader da compilare, erba da riseminare, bersagli da riallocare). Cambia UNA cosa, misura, confronta.',
    campi: [
      { chiave: 'passate', nome: 'passate extra', tipo: 'lettura', leggi: () => rig.passate().length },
      { chiave: 'elenco', nome: 'quali', tipo: 'lettura', leggi: () => passateTesto().replace(/\n/g, ' · ') || 'nessuna' },
      { chiave: 'misura', nome: '📏 misura 5 secondi', tipo: 'azione', fai: async (pan) => {
          pan.esito(`misuro «${etichetta()}»… non toccare per 6 secondi`);
          misure.push(await off.campionatore.misura({ secondi: 5, riscaldo: 1, etichetta: etichetta() }));
          pan.esito(tabellaMisure(misure) + '\n\npassate:\n' + passateTesto());
        } },
      { chiave: 'copia', nome: '📋 copia il rapporto', tipo: 'azione', fai: async (pan) => {
          const ok = await copia(rapporto());
          pan.esito((ok ? 'copiato negli appunti\n\n' : 'copia fallita: selezionalo qui sotto\n\n') + rapporto());
        } },
      { chiave: 'esporta', nome: '💾 esporta preset (copia JSON)', tipo: 'azione', fai: async (pan) => {
          const t = JSON.stringify(impacchetta(off.registri, 'officina'), null, 1);
          const ok = await copia(t); pan.esito((ok ? 'JSON copiato\n\n' : '') + t);
        } },
      { chiave: 'salva', nome: '🗂 salva preset in questo browser', tipo: 'azione', fai: async (pan) => {
          const nome = `officina ${new Date().toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}`;
          salvaLocale(impacchetta(off.registri, nome)); ricaricaPreset(); pan.esito(`salvato «${nome}»`);
        } },
      { chiave: 'carica', nome: 'carica preset salvato', tipo: 'scelta', scelte: [],
        leggi: () => stato.preset || '',
        scrivi: (v) => { const pz = leggiLocali()[v]; if (pz) { stato.preset = v; applica(off.registri, pz.valori, (r, c, val) => off.bus.aVista(r, c, val)); } } },
      { chiave: 'importa', nome: '📥 importa preset (incolla JSON)', tipo: 'azione', fai: async (pan) => {
          const t = prompt('incolla il JSON del preset'); if (!t) return;
          try {
            const pz = JSON.parse(t);
            const n = applica(off.registri, pz.valori || pz, (r, c, val) => off.bus.aVista(r, c, val));
            pan.esito(`applicati ${n} valori`);
          } catch (e) { pan.esito('JSON non valido: ' + e.message); }
        } },
    ],
  };
  const ricaricaPreset = () => {
    const c = diagnostica.campi.find((x) => x.chiave === 'carica');
    c.scelte = [{ v: '', nome: '—' }, ...Object.keys(leggiLocali()).map((n) => ({ v: n, nome: n }))];
    if (off) off.pannello._disegnaScheda();
  };
  ricaricaPreset();

  // ⚠ PRIMA LA CORNICE, POI IL PANNELLO: il pannello si incassa nel riquadro che
  // la cornice gli lascia. Senza cornice resta una finestra flottante sul gioco.
  const shell = editor
    ? apriEditor({ titolo: 'Officina', vivi: () => (off ? off.vivi(false) : ''), onRidimensiona: () => rig.motore.resize() })
    : null;
  off = apriOfficina({
    registri: [
      registroAcqua(rig, fabbrica),
      registroQualita(rig, scala, bersagli),
      registroOmbre(rig),
      registroGiorno(giorno),
      registroErba(erba),
      registroMotore(rig),
      diagnostica,
    ],
    campione: () => rig.campione(),
    agganciaFrame: (f) => rig.scena.onAfterRenderObservable.add(f),
    apertoSubito,
    contenitore: shell ? shell.contenitore : null,
    scuro: !!shell,
  });
  off.editor = shell;
  if (shell) shell.rimisura();
  return off;
}

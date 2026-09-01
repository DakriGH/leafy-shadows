// Officina — L'ADATTATORE ALLA BUILD PUBBLICATA.
//
// La build espone `globalThis.LEAFY` (rig, fabbrica, erba, giorno, scala…): qui
// sopra si costruiscono i registri dell'Officina SENZA toccare il gioco. È il
// modo di provare sul telefono, oggi, le stesse leve che nel sorgente andranno
// nei profili: quante passate fa l'acqua, quanto grandi, ogni quanti frame.
//
// ⚠ QUESTO FILE CONOSCE I NOMI INTERNI DELLA BUILD (rig._specchioAcqua,
// rig._rifrazioneAcqua, rig._profonditaAcqua): è un adattatore, ed è l'UNICO
// posto che li sa. Nel sorgente, i registri li dichiara ogni modulo per sé
// (acqua.js espone il suo, erba.js il suo) e questo file sparisce.

import { apriOfficina } from './index.js';
import { tabellaMisure } from './misura.js';
import { impacchetta, applica, salvaLocale, leggiLocali, copia } from './preset.js';

const RICETTE = ['cristallina', 'lago', 'abisso', 'kintsugi', 'benzina', 'bolla', 'ladri', 'tempesta', 'moebius', 'sogno', 'smeraldo',
  'anime', 'rime', 'torrente', 'giada', 'termale', 'casa', 'acnl', 'acnh', 'bayonetta', 'bdsp', 'windwaker', 'botw', 'minecraft',
  'ghibli', 'sumi', 'monument', 'piscina', 'palude', 'lava', 'ghiaccio', 'notte', 'tropicale', 'oceano', 'neon', 'metallo', 'vetrata', 'cartone'];
const STILI = ['liscia', 'bande', 'rete', 'creste', 'tratti', 'scaglie', 'gocce', 'mosaico', 'vetro', 'inchiostro', 'pixel'];
const MODELLI = ['piatto', 'celle', 'morbida', 'lucida', 'spenta', 'vetrosa'];

export async function officinaLeafy({ apertoSubito = false } = {}) {
  await attendi(() => !!(globalThis.LEAFY && globalThis.LEAFY.rig && globalThis.LEAFY.fabbrica && globalThis.LEAFY.rig.scena));
  const L = globalThis.LEAFY;
  const { rig, fabbrica: vi, erba: es, giorno: ai, scala: Js } = L;
  const scena = rig.scena, motore = rig.motore;
  let off = null;                    // riempito sotto: le azioni lo usano a tempo di clic
  const misure = [];
  const stato = { cull: false };

  // — acqua —————————————————————————————————————————————————————————————
  const variante = (p) => {
    const a = vi.acqua;
    vi.cambiaStileAcqua(p.stile ?? a.stile, p.onde ?? a.onde, p.modello ?? a.modello, p.riflesso ?? a.riflesso, p.vera ?? a.vera);
  };
  const specchio = () => rig._specchioAcqua || null;
  const rifrazione = () => rig._rifrazioneAcqua || null;
  const profondita = () => (rig._profonditaAcqua && rig._profonditaAcqua.getDepthMap()) || null;
  const meshAcqua = () => scena.meshes.find((m) => m.name.startsWith('acqua:') && m.isEnabled());

  // ⚠ LE LISTE DI RESA DELLE PASSATE NON SONO CULLATE DA BABYLON: un renderList
  // fisso viene disegnato tutto, anche quello che sta dietro la camera. Qui si
  // prova l'effetto del cull più grezzo possibile: si passano solo le mesh
  // attive del frame. Per lo specchio è approssimato (la camera riflessa vede
  // altre cose), ma il numero che si cerca è «quanto costa non cullare».
  const cullLista = (strato, lista) => {
    const attive = scena.getActiveMeshes(); const dentro = new Set(lista); const fuori = [];
    for (let i = 0; i < attive.length; i++) { const m = attive.data[i]; if (dentro.has(m)) fuori.push(m); }
    return fuori;
  };
  const applicaCull = () => {
    for (const rt of [specchio(), rifrazione(), profondita()]) {
      if (!rt) continue;
      const voluto = stato.cull ? cullLista : null;
      if (rt.getCustomRenderList !== voluto) rt.getCustomRenderList = voluto;
    }
  };

  const acqua = {
    chiave: 'acqua', nome: 'Acqua',
    nota: 'Ricetta e varianti creano un materiale nuovo (un attimo di compilazione). Le passate sotto sono le rese extra della scena che l\'acqua richiede: sono loro il costo.',
    campi: [
      { chiave: 'ricetta', nome: 'ricetta', tipo: 'scelta', scelte: [{ v: '', nome: '— variante —' }, ...RICETTE], nota: 'cambiando stile o passate la ricetta diventa una «variante»',
        leggi: () => vi.acqua.ricetta || '', scrivi: (v) => v && vi.cambiaRicettaAcqua(v) },
      { chiave: 'stile', nome: 'stile', tipo: 'scelta', scelte: STILI, leggi: () => vi.acqua.stile, scrivi: (v) => variante({ stile: v }) },
      { chiave: 'modello', nome: 'modello di luce', tipo: 'scelta', scelte: MODELLI, leggi: () => vi.acqua.modello, scrivi: (v) => variante({ modello: v }) },
      { chiave: 'onde', nome: 'onde', tipo: 'interruttore', leggi: () => !!vi.acqua.onde, scrivi: (v) => variante({ onde: v }) },
      { chiave: 'riflesso', nome: 'specchio (passata riflesso)', tipo: 'interruttore', leggi: () => !!vi.acqua.riflesso, scrivi: (v) => variante({ riflesso: v }) },
      { chiave: 'vera', nome: 'acqua «vera»', tipo: 'numero', min: 0, max: 3, passo: 1, nota: '0 niente · 1 profondità (passata depth) · 2 + rifrazione (passata colore) · 3 + caustiche',
        leggi: () => vi.acqua.vera | 0, scrivi: (v) => variante({ vera: v }) },
      { chiave: 'ombre', nome: 'riceve le ombre del sole', tipo: 'interruttore', leggi: () => { const m = meshAcqua(); return m ? !!m.receiveShadows : !!rig.profilo.ombraAcqua; }, scrivi: (v) => vi.ombreSullAcqua(v) },
      { chiave: 'cull', nome: 'passate cullate al frustum', tipo: 'interruttore', nota: 'prova: disegna nelle passate solo le mesh attive del frame',
        leggi: () => stato.cull, scrivi: (v) => { stato.cull = !!v; applicaCull(); } },
      { chiave: 'specchioLato', nome: 'specchio: lato', tipo: 'numero', min: 128, max: 1024, passo: 128, unita: 'px',
        leggi: () => (specchio() ? specchio().getSize().width : 0), scrivi: (v) => specchio() && specchio().resize(v) },
      { chiave: 'specchioOgni', nome: 'specchio: ogni N fotogrammi', tipo: 'numero', min: 1, max: 8, passo: 1,
        leggi: () => (specchio() ? Math.max(1, specchio().refreshRate) : 1), scrivi: (v) => specchio() && (specchio().refreshRate = v) },
      { chiave: 'specchioSfoca', nome: 'specchio: sfocatura', tipo: 'numero', min: 0, max: 24, passo: 1,
        leggi: () => (specchio() ? specchio().adaptiveBlurKernel : 0), scrivi: (v) => specchio() && (specchio().adaptiveBlurKernel = v) },
      { chiave: 'specchioQuota', nome: 'specchio: quota del piano', tipo: 'numero', min: 0, max: 24, passo: 0.5, nota: 'il lago del mondo sta a 5; la build usa 9.5',
        leggi: () => (specchio() ? specchio().mirrorPlane.d : 0), scrivi: (v) => vi.quotaSpecchioAcqua(v) },
      { chiave: 'rifrazioneLato', nome: 'rifrazione: lato', tipo: 'numero', min: 128, max: 1024, passo: 128, unita: 'px',
        leggi: () => (rifrazione() ? rifrazione().getSize().width : 0), scrivi: (v) => rifrazione() && rifrazione().resize(v) },
      { chiave: 'profonditaScala', nome: 'profondità: scala rispetto allo schermo', tipo: 'numero', min: 0.25, max: 1, passo: 0.25,
        leggi: () => (profondita() ? Math.round((profondita().getSize().width / Math.max(1, motore.getRenderWidth())) * 4) / 4 : 0),
        scrivi: (v) => profondita() && profondita().resize({ width: Math.round(motore.getRenderWidth() * v), height: Math.round(motore.getRenderHeight() * v) }) },
    ],
  };

  // — qualità (profilo) ——————————————————————————————————————————————————
  const profiloCon = (campo, v) => rig.applicaProfilo({ ...rig.profilo, [campo]: v }, { erba: es, fabbrica: vi });
  const p = (chiave, nome, tipo, extra = {}) => ({ chiave, nome, tipo, ...extra, leggi: () => rig.profilo[chiave], scrivi: (v) => profiloCon(chiave, v) });
  const qualita = {
    chiave: 'qualita', nome: 'Qualità',
    nota: 'Il livello applica un profilo intero; le voci sotto ne cambiano un campo alla volta. Lo scalatore automatico in questa build è fermo (manuale).',
    campi: [
      { chiave: 'livello', nome: 'livello', tipo: 'scelta', scelte: [...Array(Js ? Js.quanti : 7).keys()].map((i) => ({ v: i, nome: `${i}${i === 0 ? ' (massimo)' : ''}` })),
        leggi: () => (Js ? Js.livello : 0), scrivi: (v) => Js && Js.fissa(v) },
      p('scala', 'scala di risoluzione', 'numero', { min: 0.25, max: 1, passo: 0.05 }),
      p('dist', 'distanza di resa', 'numero', { min: 30, max: 200, passo: 5, unita: 'blocchi' }),
      p('sole', 'ombre del sole', 'interruttore'),
      p('cascate', 'cascate d\'ombra', 'scelta', { scelte: [1, 2, 3, 4] }),
      p('mappa', 'mappa d\'ombra', 'scelta', { scelte: [256, 512, 768, 1024, 2048] }),
      p('ombraZ', 'ombre fino a', 'numero', { min: 10, max: 120, passo: 2, unita: 'blocchi' }),
      p('pcf', 'ombre morbide (PCF)', 'interruttore'),
      p('ombraOgni', 'ombre ogni N fotogrammi', 'numero', { min: 1, max: 6, passo: 1 }),
      p('fxaa', 'FXAA', 'interruttore'),
      p('erba', 'erba: densità', 'numero', { min: 0, max: 8, passo: 0.2 }),
      p('erbaR', 'erba: raggio in chunk', 'numero', { min: 0, max: 6, passo: 1 }),
    ],
  };

  // — ombre ————————————————————————————————————————————————————————————————
  const mappaOmbre = () => rig.ombre && rig.ombre.getShadowMap();
  const Q = rig.ombre && rig.ombre.constructor;
  const ombre = {
    chiave: 'ombre', nome: 'Ombre',
    nota: 'Cascate del sole. «profondità automatica» su desktop accende una passata di riduzione in più a ogni frame.',
    campi: [
      { chiave: 'autoZ', nome: 'profondità automatica (depth reducer)', tipo: 'interruttore', leggi: () => !!rig.ombre.autoCalcDepthBounds, scrivi: (v) => (rig.ombre.autoCalcDepthBounds = v) },
      { chiave: 'filtro', nome: 'filtro', tipo: 'scelta', scelte: Q ? [{ v: Q.QUALITY_HIGH, nome: 'alto' }, { v: Q.QUALITY_MEDIUM, nome: 'medio' }, { v: Q.QUALITY_LOW, nome: 'basso' }] : [],
        leggi: () => rig.ombre.filteringQuality, scrivi: (v) => (rig.ombre.filteringQuality = v) },
      { chiave: 'lambda', nome: 'lambda (riparto cascate)', tipo: 'numero', min: 0.5, max: 1, passo: 0.01, leggi: () => rig.ombre.lambda, scrivi: (v) => (rig.ombre.lambda = v) },
      { chiave: 'bias', nome: 'bias', tipo: 'numero', min: 0, max: 0.02, passo: 0.0005, leggi: () => rig.ombre.bias, scrivi: (v) => (rig.ombre.bias = v) },
      { chiave: 'normalBias', nome: 'normal bias', tipo: 'numero', min: 0, max: 0.05, passo: 0.001, leggi: () => rig.ombre.normalBias, scrivi: (v) => (rig.ombre.normalBias = v) },
      { chiave: 'ferme', nome: 'ombre ferme (non si rinnovano)', tipo: 'interruttore', nota: 'il gioco le riaccende da solo quando sole o camera si muovono',
        leggi: () => !!mappaOmbre() && mappaOmbre().refreshRate === 0, scrivi: (v) => (v ? mappaOmbre() && (mappaOmbre().refreshRate = 0) : rig._ombraOgni(rig.profilo.ombraOgni)) },
    ],
  };

  // — giorno ———————————————————————————————————————————————————————————————
  const giorno = {
    chiave: 'giorno', nome: 'Giorno',
    campi: [
      { chiave: 'auto', nome: 'ciclo automatico', tipo: 'interruttore', leggi: () => !!ai.auto, scrivi: (v) => { ai.auto = v; ai.applica && ai.applica(); } },
      { chiave: 't', nome: 'ora del giorno', tipo: 'numero', min: 0, max: 1, passo: 0.002, leggi: () => ai.t, scrivi: (v) => { ai.t = v; ai.applica && ai.applica(); } },
      { chiave: 'orologio', nome: 'orologio', tipo: 'lettura', leggi: () => ai.orologio },
      { chiave: 'giorno', nome: 'giorno', tipo: 'lettura', leggi: () => ai.giorno },
    ],
  };

  // — erba ————————————————————————————————————————————————————————————————
  const erba = {
    chiave: 'erba', nome: 'Erba',
    campi: [
      { chiave: 'attiva', nome: 'attiva', tipo: 'interruttore', leggi: () => !!es.attiva, scrivi: (v) => es.imposta(v) },
      { chiave: 'densita', nome: 'densità', tipo: 'numero', min: 0, max: 8, passo: 0.2, leggi: () => es.densita, scrivi: (v) => { es.densita = v; es.risemina(); } },
      { chiave: 'raggio', nome: 'raggio in chunk', tipo: 'numero', min: 0, max: 6, passo: 1, leggi: () => es.raggioChunk, scrivi: (v) => { es.raggioChunk = v; es.risemina(); } },
      { chiave: 'fili', nome: 'fili disegnati', tipo: 'lettura', leggi: () => (es.attiva ? es.fili : 0) },
    ],
  };

  // — motore ———————————————————————————————————————————————————————————————
  const attr = () => { try { return motore._gl.getContextAttributes(); } catch { return {}; } };
  const motoreReg = {
    chiave: 'motore', nome: 'Motore',
    campi: [
      { chiave: 'dprMax', nome: 'DPR massimo', tipo: 'numero', min: 1, max: 3, passo: 0.25, nota: 'la risoluzione vera = min(DPR, questo) × scala',
        leggi: () => rig.dprMax, scrivi: (v) => { rig.dprMax = v; rig.applicaScala(rig._scala); } },
      { chiave: 'picking', nome: 'picking di Babylon al tocco', tipo: 'interruttore', nota: 'il gioco usa un suo raycast: questo è lavoro doppio',
        leggi: () => !scena.skipPointerDownPicking, scrivi: (v) => { scena.skipPointerDownPicking = scena.skipPointerUpPicking = !v; } },
      { chiave: 'attiveFerme', nome: 'mesh attive congelate', tipo: 'interruttore', nota: 'salta la selezione per frustum: solo per misurare quanto costa',
        leggi: () => !!scena._activeMeshesFrozen, scrivi: (v) => (v ? scena.freezeActiveMeshes() : scena.unfreezeActiveMeshes()) },
      { chiave: 'materialiFermi', nome: 'materiali congelati', tipo: 'interruttore',
        leggi: () => scena.materials.length > 0 && scena.materials.every((m) => m.isFrozen), scrivi: (v) => scena.materials.forEach((m) => (v ? m.freeze() : m.unfreeze())) },
      { chiave: 'msaa', nome: 'MSAA (fisso all\'avvio)', tipo: 'lettura', leggi: () => (attr().antialias ? 'acceso' : 'spento') },
      { chiave: 'webgl', nome: 'WebGL', tipo: 'lettura', leggi: () => motore.webGLVersion },
    ],
  };

  // — diagnostica ———————————————————————————————————————————————————————————
  const passateTesto = () => rig.passate().map((e) => `${e.nome} ${e.lato}²×${e.passate} (${e.mesh} mesh)`).join('\n');
  const etichetta = () => `#${misure.length + 1} q${Js ? Js.livello : '?'} ${vi.acqua.ricetta || vi.acqua.stile} v${vi.acqua.vera | 0}${vi.acqua.riflesso ? '+sp' : ''}${stato.cull ? ' cull' : ''}`;
  const rapporto = () => [
    `Leafy-Shadows · Officina · ${(document.getElementById('versione') || {}).textContent || ''}`,
    `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'}${rig.dispositivo.uaMentiva ? ' (da GPU)' : ''} · ${rig.scheda.nome}`,
    `${motore.getRenderWidth()}×${motore.getRenderHeight()} · dpr ${devicePixelRatio} · scala ${rig.profilo.scala} · livello ${Js ? Js.livello : '?'}`,
    `mesh ${scena.meshes.length} (${scena.getActiveMeshes().length} attive) · materiali ${scena.materials.length}`,
    '', 'passate:', passateTesto(), '',
    misure.length ? tabellaMisure(misure) : '(nessuna misura)',
    '', 'comandi netti:', JSON.stringify(off ? off.bus.netto() : {}, null, 1),
  ].join('\n');
  const diagnostica = {
    chiave: 'diagnostica', nome: 'Misura',
    nota: 'Una misura = 5 s di raccolta dopo 1 s di riscaldo. Cambia UNA cosa, misura, confronta.',
    campi: [
      { chiave: 'scheda', nome: 'scheda', tipo: 'lettura', leggi: () => rig.scheda.nome },
      { chiave: 'reso', nome: 'risoluzione', tipo: 'lettura', leggi: () => `${motore.getRenderWidth()}×${motore.getRenderHeight()}` },
      { chiave: 'mesh', nome: 'mesh (attive)', tipo: 'lettura', leggi: () => `${scena.meshes.length} (${scena.getActiveMeshes().length})` },
      { chiave: 'passate', nome: 'passate extra', tipo: 'lettura', leggi: () => rig.passate().length },
      { chiave: 'misura', nome: '📏 misura 5 secondi', tipo: 'azione', fai: async (pan) => {
          pan.esito(`misuro «${etichetta()}»… non toccare per 6 secondi`);
          const m = await off.campionatore.misura({ secondi: 5, riscaldo: 1, etichetta: etichetta() });
          misure.push(m); pan.esito(tabellaMisure(misure) + '\n\npassate:\n' + passateTesto());
        } },
      { chiave: 'copia', nome: '📋 copia il rapporto', tipo: 'azione', fai: async (pan) => { const ok = await copia(rapporto()); pan.esito((ok ? 'copiato negli appunti\n\n' : 'copia fallita: selezionalo qui sotto\n\n') + rapporto()); } },
      { chiave: 'esporta', nome: '💾 esporta preset (copia JSON)', tipo: 'azione', fai: async (pan) => { const t = JSON.stringify(impacchetta(off.registri, 'officina'), null, 1); const ok = await copia(t); pan.esito((ok ? 'JSON copiato\n\n' : '') + t); } },
      { chiave: 'salva', nome: '🗂 salva preset in questo browser', tipo: 'azione', fai: async (pan) => {
          const nome = `officina ${new Date().toLocaleString('it-IT', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' })}`;
          salvaLocale(impacchetta(off.registri, nome)); ricaricaPreset(); pan.esito(`salvato «${nome}»`);
        } },
      { chiave: 'carica', nome: 'carica preset salvato', tipo: 'scelta', scelte: [], leggi: () => stato.presetScelto || '',
        scrivi: (v) => { const pz = leggiLocali()[v]; if (pz) { stato.presetScelto = v; applica(off.registri, pz.valori, (r, c, val) => off.bus.aVista(r, c, val)); } } },
      { chiave: 'importa', nome: '📥 importa preset (incolla JSON)', tipo: 'azione', fai: async (pan) => {
          const t = prompt('incolla il JSON del preset'); if (!t) return;
          try { const pz = JSON.parse(t); const n = applica(off.registri, pz.valori || pz, (r, c, val) => off.bus.aVista(r, c, val)); pan.esito(`applicati ${n} valori`); } catch (e) { pan.esito('JSON non valido: ' + e.message); }
        } },
    ],
  };
  const ricaricaPreset = () => {
    const c = diagnostica.campi.find((x) => x.chiave === 'carica');
    c.scelte = [{ v: '', nome: '—' }, ...Object.keys(leggiLocali()).map((n) => ({ v: n, nome: n }))];
    if (off) off.pannello._disegnaScheda();
  };
  ricaricaPreset();

  off = apriOfficina({
    registri: [acqua, qualita, ombre, giorno, erba, motoreReg, diagnostica],
    campione: () => rig.campione(),
    agganciaFrame: (f) => scena.onAfterRenderObservable.add(() => { f(); applicaCull(); }),
    apertoSubito,
  });
  globalThis.OFFICINA = off;
  return off;
}

function attendi(cond, ms = 20000) {
  return new Promise((ok, no) => {
    const t0 = performance.now();
    const giro = () => { if (cond()) return ok(); if (performance.now() - t0 > ms) return no(new Error('LEAFY non è comparso: il gioco è partito?')); setTimeout(giro, 100); };
    giro();
  });
}

// LA QUALITÀ — quanto lavoro chiedere alla macchina che ci sta girando sopra.
//
// ⚠ PERCHÉ ESISTE, e la data conta: fino a oggi Leafy-Shadows era tarato per UN
// computer solo — questo. Sul PC del committente andava meglio di Leafy-Lantern;
// sul suo telefono faceva SEI fotogrammi al secondo. Non è un difetto: è una
// configurazione da desktop fatta girare su un chip che ha un decimo della banda
// e tre volte i pixel.
//
// ⚠ E IL TELEFONO NON SI PUÒ MISURARE DA QUI. Su questa macchina il vsync a
// 144 Hz copre tutto: ho dovuto salire a 17,4 milioni di pixel per vedere una
// differenza. Quindi i numeri di partenza NON vengono da misure mie: vengono da
// Leafy-Lantern, che una scala di qualità mobile ce l'ha, tarata su hardware
// vero, e da lì si ricopiano invece di reinventarli.
//
// ── LE COSE CHE COSTANO, in ordine, e come le so ─────────────────────────────
//
// 1. I PIXEL. Un telefono ha DPR 2,5–3,5: un canvas a schermo intero costa
//    6–12 volte i pixel di un desktop. Da Lantern: «il cap del pixel ratio è il
//    singolo fattore che pesa di più sui fps». E qui non c'era NESSUN cap —
//    `adaptToDeviceRatio` era acceso e basta, cioè si renderizzava a DPR pieno.
//
// 2. LE CASCATE DELL'OMBRA. Misurato qui, a 17,4 Mpixel: passare da quattro
//    cascate a due vale 1,5 ms, mentre il filtro PCF vale 0,5. Non è il
//    campionamento: è che ogni cascata è un RENDER della scena in una mappa di
//    profondità. Quattro mappe da 2048² sono 16,8 milioni di pixel di profondità
//    per fotogramma, in aggiunta alla scena. Su un telefono è da solo un
//    disastro.
//
// 3. LE OMBRE DELLE LAMPADE. Da Lantern, misurato su Mali-G68: **~30% di fps**.
//    Lì la scala mobile le tiene SEMPRE spente e non le riaccende mai da sola.
//
// ⚠ E UN `if` NON LE SPEGNE, che è la lezione più importante di tutte e viene
// ancora da Lantern: su una GPU MOBILE il compilatore deve riservare i registri
// per il caso peggiore anche nei rami che non esegue, e con tanti registri per
// thread scendono i thread in volo. Lo shader va piano ANCHE quando non fa
// niente. È il motivo per cui laggiù abbassare la risoluzione non spostava gli
// fps: non erano i pixel, era l'occupancy. Quindi il cammino nei voxel non va
// messo dentro un `if` — non deve proprio essere COMPILATO.
//
// ⚠ E QUESTO SI DECIDE ALL'AVVIO, non si cambia in corsa. Verificato leggendo il
// sorgente e provandolo: `CustomMaterial.Builder` mette il sorgente in cache
// (`Effect.ShadersStore`) e non lo rigenera più, e anche svuotando quella cache
// il motore tiene l'effetto già compilato. Misurato: cambiando l'innesto e
// sporcando il materiale, il sorgente a schermo NON cambia. Quindi la classe del
// dispositivo decide una volta sola; il resto della scala si muove a caldo.

// ⚠ E QUESTO FILE NON NOMINA BABYLON, di proposito: rilevare la macchina e
// scegliere un gradino è aritmetica e tabelle, e si prova in Node. Chi APPLICA
// un profilo è il motore (`rig.applicaProfilo`), che è l'unico che sa cosa sia
// una mappa d'ombra. Sta in `src/motore/` solo perché è roba di resa.

import { Adattatore } from '../gioco/adatta.js';

/**
 * CHE MACCHINA È — e sono TRE domande diverse, non una.
 *
 * ⚠ La distinzione viene da Leafy-Lantern e serve tutta:
 *  · `tocco`         lo schermo si può toccare (anche un desktop);
 *  · `toccoPrimario` il DITO è il puntatore principale — è questo che decide se
 *                    i comandi a schermo servono di fabbrica;
 *  · `mobile`        la classe GRAFICA, che è l'unica che ci interessa qui.
 * Un desktop con un monitor toccabile ha il mouse come primario e non vuole i
 * comandi a dito; un convertibile aperto a tablet sì. E un tablet con un mouse
 * bluetooth non deve diventare un desktop: per questo i nomi restano.
 */
export function classeDispositivo() {
  if (typeof matchMedia !== 'function') return { tocco: false, toccoPrimario: false, mobile: false };
  const tocco = matchMedia('(pointer: coarse)').matches || (navigator.maxTouchPoints || 0) > 0;
  const toccoPrimario = matchMedia('(pointer: coarse)').matches;
  const finePresente = matchMedia('(any-pointer: fine)').matches;
  const perNome = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  return { tocco, toccoPrimario, mobile: perNome || (toccoPrimario && !finePresente) };
}

/**
 * IL NOME DELLA SCHEDA, e se sta disegnando in SOFTWARE.
 * ⚠ SERVE SAPERLO SUBITO: se il browser è caduto sul renderer software gli fps
 * crollano e non c'è nessuna manopola che li recuperi. Meglio dirlo in faccia
 * che indagare a caso — in Lantern è successo su un Chromebook.
 */
export function schedaDi(motore) {
  try {
    const gl = motore._gl;
    const ext = gl && gl.getExtension('WEBGL_debug_renderer_info');
    const nome = ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : 'sconosciuta';
    return { nome, software: /swiftshader|llvmpipe|software|microsoft basic/i.test(nome) };
  } catch { return { nome: 'sconosciuta', software: false }; }
}

/**
 * ⚠ IL TETTO DEL RAPPORTO DEI PIXEL, e questi due numeri valgono più di tutta
 * la tabella qui sotto. Su un telefono con DPR 3, renderizzare a DPR pieno
 * costa NOVE volte i pixel di renderizzare a 1. Uno e mezzo è il valore di
 * Lantern, scelto lì dopo aver provato: sotto si vede la scalettatura, sopra
 * non si guadagna niente in nitidezza su uno schermo così denso.
 */
export const DPR_MAX = { mobile: 1.5, desktop: 2 };

/**
 * I LIVELLI, in tabella — regola della casa, e qui serve doppio: chi ritocca la
 * qualità tocca UNA RIGA, e chi legge vede subito cosa si spegne prima.
 *
 * Ogni riga è un gradino, dal migliore al peggiore. Le colonne:
 *  · `scala`      moltiplica il rapporto dei pixel (1 = il tetto di DPR_MAX)
 *  · `cascate`    quante cascate d'ombra — ⚠ il minimo di Babylon è DUE
 *  · `mappa`      il lato della mappa d'ombra
 *  · `ombraZ`     fin dove arriva l'ombra del sole — ⚠ VA CON `mappa`, vedi sotto
 *  · `pcf`        il filtro morbido dell'ombra (costa poco: si spegne tardi)
 *  · `sole`       l'ombra del sole tutta intera, mappa compresa
 *  · `dist`       la distanza di resa (e con lei la nebbia e il LOD dei chunk)
 *  · `erba`       la densità dell'erba, `erbaR` quanti chunk attorno
 *  · `fxaa`       l'antialiasing sull'immagine
 *  · `particelle` gli effetti
 */
/**
 * ⚠ TEXEL PER BLOCCO: LA GRANDEZZA CHE DECIDE L'ACNE, ed è `mappa / ombraZ`.
 *
 * Il difetto che ha reso necessaria questa costante: avevo portato la mappa
 * d'ombra da 2048 a 1024 su mobile lasciando `ombraZ` a 90. Metà dei texel
 * sparsi sulla stessa area vuol dire ogni texel grande il doppio, e un texel
 * grande è esattamente ciò che fa l'acne — la profondità in spazio-luce varia
 * di più dentro un texel di quanto nessuno scarto costante possa coprire.
 * Committente: «guarda quanto acne ovunque».
 *
 * Quindi ogni gradino accorcia l'ombra INSIEME alla mappa: 2048/90, 1024/45,
 * 768/34, 512/22 danno tutti 22,8 texel per blocco. L'ombra arriva meno
 * lontano — è il prezzo onesto — ma è pulita a qualunque livello. Ed è la stessa
 * regola già scritta in CLAUDE.md: «ogni metro che si pretende di ombreggiare
 * toglie texel a quelli vicini».
 */
export const TEXEL_PER_BLOCCO = 22.8;

export const LIVELLI = {
  // ⚠ SU MOBILE SI PARTE GIÀ SCARICHI, e non è pessimismo: partire in alto vuol
  // dire dare al giocatore i primi dieci secondi a sei fotogrammi, che è quando
  // decide se il gioco funziona. Si scende in fretta e si risale piano.
  // ⚠ E L'ERBA SCENDE MOLTO PRIMA DI PRIMA, per un numero che il committente ha
  // fotografato: 489×919 — meno di mezzo megapixel — e ancora 43 ms per
  // fotogramma. Mezzo megapixel non è un problema di RIEMPIMENTO per nessuna
  // GPU degli ultimi dieci anni: se a quella risoluzione si fatica, il collo di
  // bottiglia è altrove, e le prime due cose che stanno «altrove» sono i
  // VERTICI e la CPU. Cinquantaduemila lamelle sono l'unica cosa in scena che
  // ne conta a decine di migliaia — e le semina la CPU.
  mobile: [
    { scala: 1.00, cascate: 2, mappa: 1024, ombraZ: 45, pcf: false, sole: true,  dist: 100, erba: 2.0, erbaR: 2, fxaa: true,  particelle: true },
    { scala: 0.85, cascate: 2, mappa:  768, ombraZ: 34, pcf: false, sole: true,  dist:  85, erba: 1.2, erbaR: 2, fxaa: true,  particelle: false },
    { scala: 0.72, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: true,  dist:  70, erba: 0.6, erbaR: 1, fxaa: true,  particelle: false },
    { scala: 0.60, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  60, erba: 0.0, erbaR: 1, fxaa: false, particelle: false },
    // ⚠ GLI ULTIMI DUE SONO LA CORSIA D'EMERGENZA: brutti, ma GIOCABILI. In
    // Lantern esistono per la stessa ragione — senza, le GPU più deboli
    // restavano incollate sotto i trenta senza via d'uscita.
    { scala: 0.50, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  50, erba: 0.0, erbaR: 1, fxaa: false, particelle: false },
    { scala: 0.42, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  40, erba: 0.0, erbaR: 1, fxaa: false, particelle: false },
  ],
  desktop: [
    { scala: 1.00, cascate: 4, mappa: 2048, ombraZ: 90, pcf: true,  sole: true,  dist: 150, erba: 7.8, erbaR: 6, fxaa: true,  particelle: true },
    { scala: 1.00, cascate: 3, mappa: 2048, ombraZ: 90, pcf: true,  sole: true,  dist: 130, erba: 6.0, erbaR: 5, fxaa: true,  particelle: true },
    { scala: 0.85, cascate: 2, mappa: 1024, ombraZ: 45, pcf: true,  sole: true,  dist: 110, erba: 4.5, erbaR: 4, fxaa: true,  particelle: true },
    { scala: 0.70, cascate: 2, mappa: 1024, ombraZ: 45, pcf: false, sole: true,  dist:  90, erba: 3.0, erbaR: 3, fxaa: true,  particelle: false },
    { scala: 0.60, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  70, erba: 1.5, erbaR: 2, fxaa: false, particelle: false },
  ],
};

/**
 * LE COSE CHE SI DECIDONO ALL'AVVIO E NON SI CAMBIANO PIÙ.
 *
 * ⚠ SONO QUELLE CHE STANNO NELLO SHADER, e il motivo è tecnico e verificato:
 * il sorgente di un `CustomMaterial` si compila una volta e resta. Cambiare
 * queste vuol dire ricaricare la pagina — che è onesto, costa un secondo, e si
 * fa una volta per dispositivo invece che a ogni gradino.
 */
export function fissiDiAvvio(dispositivo) {
  return {
    // ⚠ SU MOBILE MAI, ed è la riga che pesa di più di tutto questo file: da
    // Lantern, misurato su Mali-G68, il cammino nei voxel costa ~30% degli fps.
    // E non basta spegnerlo con un `if` — non deve essere compilato.
    ombreLampade: !dispositivo.mobile,
    // ⚠ L'MSAA DEL CANVAS RESTA SPENTO SU MOBILE (quadruplica il riempimento),
    // MA FXAA NO — e la distinzione è tutta la partita. FXAA è UNA passata a
    // schermo intero: a 0,68 Mpixel non si sente. L'avevo spento «perché è una
    // passata in più su un chip già a corto di banda», e ho tolto proprio la
    // cura scritta in CLAUDE.md per questo esatto difetto: «le terrazze di
    // Leafy sono fianchi alti UN blocco, a cinquanta blocchi meno di un pixel;
    // un triangolo più piccolo del pixel scompare e riappare mentre la camera
    // si muove — il committente l'ha visto come vibrazioni a distanza».
    antialias: !dispositivo.mobile,
  };
}

/**
 * QUANTO VA VELOCE LO SCHERMO, misurato — non chiesto.
 *
 * ⚠ `screen.refreshRate` NON ESISTE in Chrome: l'avevo scritto e tornava
 * `undefined`, cioè il ripiego a sessanta funzionava per caso su un pannello a
 * 144. Un valore inventato che «funziona» è peggio di nessun valore, perché
 * nessuno va a controllarlo.
 *
 * Si misura invece dal ritmo dei fotogrammi: la MEDIANA di una manciata di
 * intervalli, che è robusta al primo fotogramma lungo e a un singhiozzo in
 * mezzo. Torna una promessa perché serve un pezzo di tempo per saperlo.
 */
export function misuraHz(quanti = 40) {
  return new Promise((risolvi) => {
    if (typeof requestAnimationFrame !== 'function') return risolvi(60);
    const dt = [];
    let prima = -1;
    const giro = (t) => {
      if (prima >= 0) dt.push(t - prima);
      prima = t;
      if (dt.length < quanti) requestAnimationFrame(giro);
      else {
        dt.sort((a, b) => a - b);
        const m = dt[dt.length >> 1];
        risolvi(m > 0.5 ? Math.round(1000 / m) : 60);
      }
    };
    requestAnimationFrame(giro);
  });
}

/**
 * LA SCALA — tiene il gradino, misura, e chiama chi applica.
 *
 * ⚠ NON APPLICA NIENTE DA SOLA: riceve `applica(profilo)` da fuori. Così questo
 * file resta provabile in Node e la stessa scala serve sia al gioco sia allo
 * zoo, che hanno cose diverse da spegnere.
 */
export class ScalaQualita {
  constructor({ mobile, applica, hz = 60 }) {
    this.mobile = !!mobile;
    this.livelli = LIVELLI[this.mobile ? 'mobile' : 'desktop'];
    this._applica = applica;
    this.adatta = new Adattatore({ quanti: this.livelli.length, hz });
    this.cambi = 0;
  }

  /** Corregge il bersaglio quando si sa quanto va lo schermo davvero. */
  impostaHz(hz) { if (hz > 0) this.adatta.hz = hz; }

  get profilo() { return this.livelli[this.adatta.livello]; }
  get livello() { return this.adatta.livello; }
  get quanti() { return this.livelli.length; }

  /** Applica il gradino corrente. Da chiamare una volta all'avvio. */
  avvia() { this._applica(this.profilo); return this.profilo; }

  /**
   * Una misura di fps. Se il gradino cambia, applica e torna true.
   * ⚠ L'ORA SI PASSA DA FUORI: è quello che rende provabile la decisione.
   */
  osserva(fps, adesso) {
    if (this.adatta.osserva(fps, adesso) < 0) return false;
    this.cambi++;
    this._applica(this.profilo);
    return true;
  }

  /** Fissa un gradino a mano (e la scala smette di muoversi da sola). */
  fissa(i) { this.adatta.fissa(i); this._applica(this.profilo); return this.profilo; }
  libera() { this.adatta.libera(); }
}

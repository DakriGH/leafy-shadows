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
/**
 * LA GPU È DA TELEFONO? Si giudica dal NOME del renderer, perché l'user-agent
 * si può travestire («richiedi sito desktop») e la GPU no. Da un rapporto 🩺
 * vero: Mali-G68 classificata desktop → profilo pieno → 6 fps.
 * ⚠ Funzione pura e provata in Node (`test/gpu-telefono.test.mjs`): la lista
 * dei nomi è esattamente il genere di cosa che si sbaglia in silenzio.
 */
export function gpuDaTelefono(nome) {
  return /\b(Mali|Adreno|PowerVR|Apple GPU|Immortalis|Xclipse)\b/i.test(nome || '');
}

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
 *
 * ⚠ E LE CINQUE COLONNE DELL'ACQUA, che prima non c'erano ed è il difetto che
 * ha fatto crollare la build del 31/08 da 80 fotogrammi a 12. L'acqua accende
 * fino a TRE rese complete della scena per fotogramma (specchio, rifrazione,
 * profondità) e l'unica leva che i profili avevano su di lei era `ombraAcqua`:
 * il gradino «bassa» spegneva le ombre del sole e lasciava intatte tre rese
 * della scena, che è l'esatto contrario di una scala di qualità. Una ricetta
 * poteva accendersi passate che nessun profilo sapeva di pagare.
 *  · `acquaVera`     il TETTO della scala «vera» (0 pittura · 1 profondità ·
 *                    2 + rifrazione · 3 + caustiche). La ricetta chiede, il
 *                    profilo concede: `min(ricetta, profilo)`.
 *  · `acquaSpecchio` se il riflesso planare è permesso (la ricetta lo chiede)
 *  · `acquaLato`     il lato in pixel di specchio e rifrazione
 *  · `acquaOgni`     ogni quanti fotogrammi si rifà lo specchio
 *  · `acquaProf`     la mappa di profondità come frazione dello SCHERMO —
 *                    ⚠ prima era sempre a piena risoluzione (× DPR fino a 2) e
 *                    non seguiva nemmeno `scala`: Babylon la crea grande quanto
 *                    la tela nel momento in cui nasce, e non la ridimensiona mai
 *                    (verificato in `depthRenderer.pure.js`).
 *
 * ⚠ IL TETTO NON È UNA MANOPOLA A CALDO: `vera` e `riflesso` si compilano nello
 * shader (la solita regola della casa — quello che non si paga non deve nemmeno
 * essere compilato), quindi cambiare gradino RICOSTRUISCE il materiale. Si
 * tiene in cache come tutti gli altri: scendere e risalire non ricompila due
 * volte.
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
    // ⚠ E L'ACQUA RICEVE LE OMBRE SOLO IN ALTO. Misurato (RTX 4060, 33 Mpx,
    // notte): l'acqua che riceve costa 1,1 ms su 26 — il 4,2% del fotogramma —
    // per l'ombra di un albero che cade sull'acqua. Si vede, quindi non si
    // toglie a chi può permettersela; ma è fra le prime cose da lasciare andare
    // quando il margine finisce, perché è un dettaglio su una superficie che di
    // suo è già tutta movimento.
    // ⚠ E NON È UN FISSO: si accende e si spegne a caldo, quindi sta nella scala
    // e non in `fissiDiAvvio`.
    //
    // ⚠ LE OMBRE OGNI TRE GIRI SU MOBILE, e il numero viene da una misura sul
    // telefono del committente (Mali-G68): la mappa d'ombra costava 5,22 ms
    // spalmati su un fotogramma da 25,6 — il venti per cento del tempo. A tre
    // giri erano 3,5. Ho provato due giri sui primi gradini (l'ombra del
    // giocatore a tre giri su trenta fotogrammi avanza a scatti): rapporto 🩺
    // del 02/09 alle 10:53, 30 fps piatti a q0 con 109 disegni. Su questa GPU
    // il costo è il NUMERO DI DISEGNI, non i pixel, e da quando il sole
    // quantizzato fine tiene la mappa viva col ciclo del giorno (main.js,
    // firmaQuiete) ogni giro in più di cascate sono ~25 disegni. Tre giri.
    // ⚠ E NON È «abbassare la qualità»: la mappa resta 1024 a due cascate, cioè
    // l'ombra è LA STESSA. Cambia solo ogni quanto la si ridisegna.
    //
    // ⚠ E L'ACQUA SUL TELEFONO È PITTURA A OGNI GRADINO (`acquaVera` 0, niente
    // specchio), dallo stesso rapporto: con `lago` di partenza il profilo
    // concedeva specchio e passata di rifrazione/profondità, cioè due liste di
    // disegno intere in più per fotogramma — misurate su una RTX, dove sono
    // gratis, mai sul Mali, dove sono 30 fps piatti (109 disegni contro i 47
    // della build da 87 fps del 31/08). La ricetta chiede, il profilo concede:
    // qui non concede, e `lago` resta `lago` nel colore e nel moto.
    //
    // ⚠ IL PRIMO GRADINO È IL TETTO, E DEVE ESSERE GENEROSO. Questo l'ho
    // sbagliato una volta: avevo abbassato l'erba QUI, sul gradino zero, per
    // curare un telefono lento — e siccome l'adattatore da q0 può solo
    // SCENDERE, avevo messo un tetto basso permanente anche sui dispositivi che
    // reggevano benissimo. Committente: «noto un'enorme diminuzione dell'erba,
    // è normale?». Sì, ed era troppo.
    // La forma giusta è: tetto ricco, e la scala trova il livello da sola in
    // due secondi e mezzo (sotto i 24 fps le basta UNA misura, vedi
    // `gioco/adatta.js`). Tarare il tetto è indovinare; far scendere la scala è
    // misurare.
    { scala: 1.00, cascate: 2, mappa: 1024, ombraZ: 45, pcf: false, sole: true,  dist: 110, erba: 4.0, erbaR: 3, ombraOgni: 3, ombraAcqua: true , fxaa: false, particelle: true,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 3, acquaProf: 0.50 },
    { scala: 1.00, cascate: 2, mappa: 1024, ombraZ: 45, pcf: false, sole: true,  dist: 100, erba: 2.0, erbaR: 2, ombraOgni: 3, ombraAcqua: false, fxaa: false, particelle: true,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 3, acquaProf: 0.50 },
    { scala: 0.85, cascate: 2, mappa:  768, ombraZ: 34, pcf: false, sole: true,  dist:  85, erba: 1.2, erbaR: 2, ombraOgni: 3, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 3, acquaProf: 0.40 },
    { scala: 0.72, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: true,  dist:  70, erba: 0.6, erbaR: 1, ombraOgni: 3, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 4, acquaProf: 0.40 },
    // ⚠ GLI ULTIMI TRE SONO LA CORSIA D'EMERGENZA: brutti, ma GIOCABILI. In
    // Lantern esistono per la stessa ragione — senza, le GPU più deboli
    // restavano incollate sotto i trenta senza via d'uscita.
    { scala: 0.60, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  60, erba: 0.0, erbaR: 1, ombraOgni: 4, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 4, acquaProf: 0.40 },
    { scala: 0.50, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  50, erba: 0.0, erbaR: 1, ombraOgni: 4, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 4, acquaProf: 0.40 },
    { scala: 0.42, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  40, erba: 0.0, erbaR: 1, ombraOgni: 4, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 4, acquaProf: 0.40 },
  ],
  desktop: [
    // ⚠ TRE CASCATE E NON QUATTRO SUL GRADINO PIÙ ALTO, e non è un risparmio
    // travestito: ogni cascata è un RENDER della scena in una mappa di
    // profondità, cioè 63 chiamate di disegno l'una in questa scena — la
    // quarta da sola vale più di tutto lo specchio dell'acqua. E quello che
    // dà è il quarto anello di distanza, dove `lambda` a 0,94 lascia già
    // pochissimi texel: la differenza si vede sul bordo di un'ombra a
    // settanta blocchi, che è dove nessuno guarda. La densità vicina, che è
    // quella che si vede, la decidono `mappa/ombraZ` e lambda, e non cambiano.
    { scala: 1.00, cascate: 3, mappa: 2048, ombraZ: 90, pcf: true,  sole: true,  dist: 150, erba: 7.8, erbaR: 6, ombraOgni: 1, ombraAcqua: true , fxaa: true,  particelle: true,
      acquaVera: 3, acquaSpecchio: true , acquaLato: 256, acquaOgni: 2, acquaProf: 1.00 },
    { scala: 1.00, cascate: 3, mappa: 2048, ombraZ: 90, pcf: true,  sole: true,  dist: 130, erba: 6.0, erbaR: 5, ombraOgni: 1, ombraAcqua: true , fxaa: true,  particelle: true,
      acquaVera: 3, acquaSpecchio: true , acquaLato: 256, acquaOgni: 2, acquaProf: 0.75 },
    { scala: 0.85, cascate: 2, mappa: 1024, ombraZ: 45, pcf: true,  sole: true,  dist: 110, erba: 4.5, erbaR: 4, ombraOgni: 1, ombraAcqua: true , fxaa: true,  particelle: true,
      acquaVera: 3, acquaSpecchio: true , acquaLato: 256, acquaOgni: 3, acquaProf: 0.50 },
    { scala: 0.70, cascate: 2, mappa: 1024, ombraZ: 45, pcf: false, sole: true,  dist:  90, erba: 3.0, erbaR: 3, ombraOgni: 2, ombraAcqua: false, fxaa: true,  particelle: false,
      acquaVera: 2, acquaSpecchio: false, acquaLato: 256, acquaOgni: 3, acquaProf: 0.50 },
    { scala: 0.60, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  70, erba: 1.5, erbaR: 2, ombraOgni: 3, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 1, acquaSpecchio: false, acquaLato: 256, acquaOgni: 3, acquaProf: 0.50 },
    // ⚠ ANCHE IL DESKTOP HA LA SUA CORSIA D'EMERGENZA, e mancava. Il commento
    // due scale più su lo diceva già — «senza, le GPU più deboli restavano
    // incollate sotto i trenta senza via d'uscita» — ma l'avevo scritto solo per
    // mobile, come se «desktop» volesse dire «GPU da desktop».
    // ⚠ NON VUOL DIRE. Il Chromebook del committente ha una Intel HD 400 del
    // 2015, che è più debole del Mali-G68 del suo telefono; ma ha un mouse,
    // quindi prendeva questa scala. Misurato: è sceso fino all'ULTIMO gradino
    // (storia [0, 3, 4]) e faceva ancora 13 fps, senza più strada davanti.
    { scala: 0.50, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  55, erba: 0.0, erbaR: 1, ombraOgni: 4, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 4, acquaProf: 0.50 },
    { scala: 0.42, cascate: 2, mappa:  512, ombraZ: 22, pcf: false, sole: false, dist:  40, erba: 0.0, erbaR: 1, ombraOgni: 4, ombraAcqua: false, fxaa: false, particelle: false,
      acquaVera: 0, acquaSpecchio: false, acquaLato: 256, acquaOgni: 4, acquaProf: 0.50 },
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
/** Dove si ricorda quanto ha faticato questa macchina. */
const CHIAVE_FATICA = 'leafy.fatica';

/**
 * QUANTO SI ALLEGGERISCE, A GRADINI.
 *
 * ⚠ NON TUTTO INSIEME, e la prima versione sbagliava proprio qui: spegneva le
 * tre cose care in un colpo solo, e il committente ha risposto «la grafica è
 * peggiorata di molto ma ho guadagnato sì e no 5 fps». Aveva ragione due volte:
 * il prezzo era alto e non sapevo nemmeno quale delle tre lo stesse pagando.
 * Tre modifiche e una misura sola non è una misura.
 *
 * ⚠ L'ORDINE VIENE DA UNA MISURA E DA UN LIMITE DICHIARATO. Misurato qui (RTX
 * 4060, 33 Mpx, notte, 13 lampioni): senza il cammino nei voxel 26,0 → 24,7 ms;
 * senza acqua ricca e senza MSAA, dentro il rumore. Quindi il voxel per primo:
 * è l'unico che costi qualcosa di misurabile ed è anche il meno visibile — è la
 * luce delle lampade che non attraversa i muri.
 * ⚠ MA QUELLA MISURA NON SI TRASFERISCE a una GPU affamata di banda: l'MSAA
 * quadruplica il framebuffer, e su una Intel HD 400 del 2015 può pesare dieci
 * volte più che su una scheda con banda da vendere. Per questo è il secondo e
 * non l'ultimo — e per questo la scelta la fa la MACCHINA, salendo di gradino
 * solo quando quello prima non è bastato.
 */
export const GRADINI_FATICA = [
  { voxel: true,  msaa: true,  acqua: true  },   // 0 — tutto acceso
  { voxel: false, msaa: true,  acqua: true  },   // 1 — via il cammino nei voxel
  { voxel: false, msaa: false, acqua: true  },   // 2 — via anche l'MSAA
  { voxel: false, msaa: false, acqua: false },   // 3 — via anche l'acqua ricca
];

/**
 * A CHE GRADINO DI FATICA È QUESTA MACCHINA — 0 = nessuna.
 *
 * ⚠ È UNA MISURA, NON UN INDOVINELLO. Le tre opzioni si compilano dentro lo
 * shader e non si possono cambiare a caldo: vanno decise PRIMA di sapere quanto
 * va la macchina. Fin qui la decisione era «ha un mouse?», che è un'ipotesi
 * travestita da fatto — e sul Chromebook del committente (Intel HD 400 del
 * 2015, più debole del suo telefono) era l'ipotesi sbagliata.
 *
 * ⚠ QUINDI SI GUARDA IL GIRO PRECEDENTE. Se l'ultima volta la scala di qualità
 * è arrivata in fondo ed era ancora sotto, si sale di un gradino. Costa un
 * ricaricamento per gradino, e in cambio non c'è nessun elenco di nomi di
 * schede video da tenere aggiornato — che è la soluzione che sembra ovvia e
 * marcisce in un anno.
 */
export function faticaRicordata() {
  try {
    // ⚠ E C'È UN MODO DI TORNARE INDIETRO, se no alleggerire è una porta a senso
    // unico: una macchina che si è arresa una volta — magari per una scena
    // storta o un fotogramma perso mentre costruiva — resterebbe leggera per
    // sempre. Via URL e non con un tasto, perché il caso d'uso è un Chromebook
    // piegato a tablet o un telefono, dove una scorciatoia da tastiera non c'è.
    if (typeof location === 'object' && /[?&]pesante\b/.test(location.search)) {
      ricordaFatica(0);
      return 0;
    }
    const n = parseInt(localStorage.getItem(CHIAVE_FATICA), 10);
    return Number.isFinite(n) ? Math.max(0, Math.min(GRADINI_FATICA.length - 1, n)) : 0;
  } catch { return 0; }
}

/** Da chiamare quando la scala tocca il fondo e non basta ancora. */
export function ricordaFatica(livello) {
  try {
    const n = Math.max(0, Math.min(GRADINI_FATICA.length - 1, livello | 0));
    if (n === 0) localStorage.removeItem(CHIAVE_FATICA);
    else localStorage.setItem(CHIAVE_FATICA, String(n));
  } catch { /* navigazione privata */ }
}

/**
 * COSA SPEGNERE, DA INDIRIZZO: `?senza=voxel,acqua,msaa` (o `?senza=tutto`).
 *
 * ⚠ SERVE A MISURARLI UNO PER UNO, ed è nato da un errore di metodo mio: la
 * prima modalità leggera spegneva tutte e tre le cose care INSIEME, e quando il
 * committente ha detto «la grafica è peggiorata di molto ma ho guadagnato sì e
 * no 5 fps» non avevo modo di sapere QUALE delle tre gliela stesse rovinando né
 * quale stesse pagando. Tre modifiche e una misura sola non è una misura.
 *
 * Con questo si mandano tre rapporti — `?senza=voxel`, `?senza=acqua`,
 * `?senza=msaa` — e si legge quanto vale ciascuna sulla macchina vera, che è
 * l'unica che conti: qui una RTX ha banda da vendere e l'MSAA non si sente,
 * su una integrata del 2015 può essere il costo principale.
 */
function spentiDaIndirizzo() {
  try {
    const m = /[?&]senza=([a-z,]+)/.exec(location.search);
    return m ? new Set(m[1].split(',')) : new Set();
  } catch { return new Set(); }
}

export function fissiDiAvvio(dispositivo) {
  // ⚠ UN TELEFONO PARTE DALL'ULTIMO GRADINO: lì la misura c'è già, da Lantern, e
  // non serve farla scoprire a ogni telefono del mondo un ricaricamento per volta.
  const g = GRADINI_FATICA[dispositivo.mobile ? GRADINI_FATICA.length - 1 : faticaRicordata()];
  const senza = spentiDaIndirizzo();
  const acceso = (nome) => g[nome] && !senza.has(nome) && !senza.has('tutto');
  return {
    // ⚠ SU MOBILE MAI, ed è la riga che pesa di più di tutto questo file: da
    // Lantern, misurato su Mali-G68, il cammino nei voxel costa ~30% degli fps.
    // E non basta spegnerlo con un `if` — non deve essere compilato.
    ombreLampade: acceso('voxel'),
    // ⚠ L'ACQUA RICCA È UNA LETTURA IN PIÙ PER FRAMMENTO, e la sua compagnia:
    // la deriva che rompe il ripetersi della tessitura, il riflesso della luna
    // e la scintilla delle lampade. Su mobile si compila la variante povera —
    // una lettura sola, solo il sole — e non è un `if`: è un altro sorgente.
    // Stessa ragione del cammino nei voxel qui sopra, e stessa misura di
    // Lantern dietro: su una GPU a tile il ramo non eseguito costa lo stesso.
    // ⚠ E LA SCINTILLA DELLE LAMPADE SI SPEGNE INSIEME ALLE LORO OMBRE, che su
    // mobile sono già spente: sarebbe l'unico punto in cui tornerebbero a
    // costare, per un effetto che su uno schermo da sei pollici non si vede.
    // ⚠ L'ACQUA NON SI OTTIMIZZA — PER ADESSO, E DI PROPOSITO. Committente:
    // «in gioco non noto alcuna miglioria dell'acqua, vedo roba ripetuta,
    // splattellata… come se le novità non le avessi messe correttamente o le
    // impostazioni grafiche automatiche non mi facciano vedere bene l'acqua.
    // Per adesso l'acqua non deve avere ottimizzazioni, deve essere perfetta».
    // Aveva ragione sulla diagnosi: su mobile (e su qualunque macchina che
    // avesse toccato il fondo della scala) si compilava la variante POVERA —
    // una lettura sola, quindi ZERO anti-tiling: niente warp, niente rotazione,
    // niente terza scala, e `vera` forzata a 0, cioè niente profondità né
    // rifrazione né caustiche. Tutto il lavoro sull'acqua semplicemente non
    // esisteva nel sorgente che girava, e a schermo era indistinguibile da «le
    // migliorie non sono state fatte».
    //
    // ⚠ E FINCHÉ L'ACQUA SI STA SCEGLIENDO, DEGRADARLA È PEGGIO CHE INUTILE:
    // il senso di questa fase è guardarla per giudicarla, e un'ottimizzazione
    // che cambia quello che si guarda falsa proprio la cosa da decidere — si
    // finisce per bocciare un disegno per un difetto che sta nella scala. Si
    // rimette `acceso('acqua')` quando la ricetta sarà scelta e ci sarà da
    // farla girare sul telefono; il commento sopra spiega cosa si riaccende.
    acquaRicca: true,
    // ⚠ L'MSAA DEL CANVAS RESTA SPENTO SU MOBILE (quadruplica il riempimento),
    // MA FXAA NO — e la distinzione è tutta la partita. FXAA è UNA passata a
    // schermo intero: a 0,68 Mpixel non si sente. L'avevo spento «perché è una
    // passata in più su un chip già a corto di banda», e ho tolto proprio la
    // cura scritta in CLAUDE.md per questo esatto difetto: «le terrazze di
    // Leafy sono fianchi alti UN blocco, a cinquanta blocchi meno di un pixel;
    // un triangolo più piccolo del pixel scompare e riappare mentre la camera
    // si muove — il committente l'ha visto come vibrazioni a distanza».
    // ⚠ RIBALTATO DALLO STUDIO TBDR (docs/STUDIO-RETRO.md): su una GPU a tile
    // l'MSAA del canvas vive nella memoria on-chip e si risolve on-tile — ARM
    // misura ~500 MB/s contro i ~5 GB/s del percorso a passata separata. È il
    // POST-PROCESS a costare (load/store fullscreen), non l'MSAA: quindi su
    // mobile MSAA acceso e FXAA spento in tabella — l'esatto contrario di
    // prima, quando la nota «quadruplica il riempimento» applicava al tiler
    // una verità da GPU desktop.
    antialias: dispositivo.mobile ? !senza.has('msaa') && !senza.has('tutto') : acceso('msaa'),
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
      else risolvi(hzDaIntervalli(dt));
    };
    requestAnimationFrame(giro);
  });
}

/**
 * DA UN ELENCO DI INTERVALLI FRA FOTOGRAMMI, LA FREQUENZA DELLO SCHERMO.
 *
 * ⚠ E NON È LA STESSA COSA DI «QUANTI FOTOGRAMMI FA», che è l'errore che c'era
 * qui e che è costato un'altalena vera. Prima si prendeva la MEDIANA degli
 * intervalli: su una macchina che disegna a 25 fps la mediana dice 25, e il
 * codice lo prendeva per uno schermo a 25 Hz. Da lì il bersaglio diventava 25,
 * le due soglie della scala di qualità si INVERTIVANO, e la qualità pompava su
 * e giù per sempre (vedi `margineMinimo` in `gioco/adatta.js`).
 *
 * ⚠ LA DIFFERENZA SI VEDE NELLA REGOLARITÀ, non nel valore. Uno schermo
 * sincronizzato consegna intervalli quasi identici — 16,7 · 16,7 · 16,7. Una
 * macchina che arranca li consegna sparpagliati — 38 · 51 · 42 · 61. Quindi:
 * se sono regolari, quello è lo schermo e ci si crede; se sono sparsi, non
 * sappiamo quanto va lo schermo e si dice sessanta, che è il caso quasi
 * universale. Alla scala di qualità non serve saperlo: penserà lei a scendere,
 * ma sulla base di una misura VERA invece che di un'ipotesi circolare.
 *
 * ⚠ NIENTE SOTTO 30, in nessun caso: schermi più lenti in pratica non esistono,
 * e ogni numero più basso è la macchina che arranca travestita da schermo.
 */
export function hzDaIntervalli(dt) {
  if (!dt || dt.length < 4) return 60;
  const s = dt.slice().sort((a, b) => a - b);
  const p10 = s[Math.floor(s.length * 0.1)];
  const p50 = s[s.length >> 1];
  if (!(p10 > 0.5)) return 60;
  // ⚠ IL 25% DI SPARPAGLIAMENTO È LA SOGLIA: la sincronia verticale sta molto
  // sotto (i suoi intervalli differiscono di frazioni di millisecondo), una
  // macchina in affanno molto sopra.
  const regolare = (p50 - p10) / p10 < 0.25;
  if (!regolare) return 60;
  const hz = Math.round(1000 / p50);
  return hz < 30 ? 60 : Math.min(hz, 250);
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
    const cambiato = this.adatta.osserva(fps, adesso);
    // ⚠ SE SI È ARRESA, SE LO SEGNA PER IL PROSSIMO AVVIO. La scala ha finito la
    // strada e non basta ancora: le cose che aiuterebbero davvero si compilano
    // nello shader e non si cambiano a caldo (vedi `fissiDiAvvio`). L'unica cosa
    // che si può fare è ricordarselo — e la prossima volta partire leggeri.
    // ⚠ E NON SI CANCELLA MAI DA SÉ: in modalità leggera gli fps salgono, quindi
    // una cancellazione automatica farebbe ripartire pesante, poi arrendersi,
    // poi ripartire pesante — un'altalena a ogni ricaricamento. Si toglie a mano
    // (il pannello dice che è attiva).
    // ⚠ UN GRADINO PER VOLTA, e solo se questo giro non è bastato: si alleggerisce
    // il minimo indispensabile invece di spegnere tutto e sperare.
    if (this.adatta.arresa && !this._segnata) {
      this._segnata = true;
      ricordaFatica(faticaRicordata() + 1);
    }
    if (cambiato < 0) return false;
    this.cambi++;
    this._applica(this.profilo);
    return true;
  }

  /** Fissa un gradino a mano (e la scala smette di muoversi da sola). */
  fissa(i) { this.adatta.fissa(i); this._applica(this.profilo); return this.profilo; }
  libera() { this.adatta.libera(); }
}

/**
 * IL REGISTRO DELLA QUALITÀ PER L'OFFICINA.
 *
 * ⚠ IL LIVELLO APPLICA UNA RIGA INTERA, le voci sotto ne cambiano UN campo:
 * sono due gesti diversi e vanno tenuti distinti, se no non si capisce mai se
 * un numero è quello del gradino o un ritocco.
 *
 * ⚠ E TOCCARE UNA QUALSIASI DI QUESTE MANOPOLE FERMA LO SCALATORE AUTOMATICO
 * (`scala.fissa`), perché è il contratto del gioco: automatico finché non lo
 * tocchi, fermo per sempre dopo. Chi apre l'Officina sta guardando una cosa
 * precisa, e una scala che gliela cambia sotto gli occhi mentre misura è
 * peggio di nessuna scala.
 *
 * ⚠ QUESTO FILE NON NOMINA BABYLON, e il registro non fa eccezione: legge la
 * tabella e chiama `rig.applicaProfilo`, che è l'unico che sa cosa sia una
 * mappa d'ombra.
 */
export function registroQualita(rig, scala, bersagli) {
  const conCampo = (chiave, v) => { scala.adatta.manuale = true; rig.applicaProfilo({ ...rig.profilo, [chiave]: v }, bersagli); };
  const p = (chiave, nome, tipo, extra = {}) => ({ chiave, nome, tipo, ...extra,
    leggi: () => rig.profilo[chiave], scrivi: (v) => conCampo(chiave, v) });
  return {
    chiave: 'qualita', nome: 'Qualità',
    nota: 'Il livello applica un gradino intero; le voci sotto ne cambiano un campo alla volta. '
      + 'Toccare qualunque cosa qui ferma lo scalatore automatico per il resto della sessione.',
    campi: [
      { chiave: 'livello', nome: 'gradino', tipo: 'scelta',
        scelte: [...Array(scala.quanti).keys()].map((i) => ({ v: i, nome: `${i}${i === 0 ? ' (massimo)' : i === scala.quanti - 1 ? ' (minimo)' : ''}` })),
        leggi: () => scala.livello, scrivi: (v) => scala.fissa(v) },
      { chiave: 'auto', nome: 'scalatore automatico', tipo: 'lettura',
        nota: 'si spegne da solo al primo gradino scelto a mano',
        leggi: () => (scala.adatta.manuale ? 'fermo (a mano)' : 'acceso') },
      p('scala', 'scala di risoluzione', 'numero', { min: 0.25, max: 1, passo: 0.01 }),
      p('dist', 'distanza di resa', 'numero', { min: 30, max: 200, passo: 5, unita: 'blocchi' }),
      p('sole', 'ombre del sole', 'interruttore'),
      p('cascate', 'cascate d\'ombra', 'scelta', { scelte: [2, 3, 4] }),
      p('mappa', 'mappa d\'ombra', 'scelta', { scelte: [256, 512, 768, 1024, 2048] }),
      p('ombraZ', 'ombre fino a', 'numero', { min: 10, max: 120, passo: 2, unita: 'blocchi' }),
      p('pcf', 'ombre morbide (PCF)', 'interruttore'),
      p('ombraOgni', 'ombre ogni N fotogrammi', 'numero', { min: 1, max: 6, passo: 1 }),
      p('ombraAcqua', 'ombre sull\'acqua', 'interruttore'),
      p('fxaa', 'FXAA', 'interruttore'),
      p('particelle', 'effetti (spruzzi, veli, bolle)', 'interruttore'),
      p('erba', 'erba: densità', 'numero', { min: 0, max: 8, passo: 0.2 }),
      p('erbaR', 'erba: raggio in chunk', 'numero', { min: 0, max: 6, passo: 1 }),
      p('acquaVera', 'acqua: tetto di «vera»', 'numero', { min: 0, max: 3, passo: 1 }),
      p('acquaSpecchio', 'acqua: specchio permesso', 'interruttore'),
      p('acquaLato', 'acqua: lato dello specchio', 'numero', { min: 128, max: 1024, passo: 128, unita: 'px' }),
      p('acquaOgni', 'acqua: specchio ogni N', 'numero', { min: 1, max: 8, passo: 1 }),
      p('acquaProf', 'acqua: frazione della passata sott\'acqua', 'numero', { min: 0.2, max: 1, passo: 0.05 }),
      { chiave: 'texel', nome: 'texel per blocco d\'ombra', tipo: 'lettura',
        nota: `la costante di casa è ${TEXEL_PER_BLOCCO}: è mappa ÷ portata, ed è la grandezza che decide l'acne`,
        leggi: () => Math.round(rig.profilo.mappa / rig.profilo.ombraZ * 10) / 10 },
    ],
  };
}

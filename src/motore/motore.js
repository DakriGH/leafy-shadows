// IL MOTORE — l'UNICO file che sa che sotto c'è Babylon.
//
// PERCHÉ QUESTO CONFINE ESISTE, e perché è la prima riga scritta del progetto.
// In Leafy-Lantern lo strato di resa era three.js sparso ovunque: `src/world/`
// importava `../fx/materials.js`, il mesher costruiva `THREE.Mesh`, e cambiare
// motore voleva dire toccare quaranta file. Misurato prima di partire: il mondo
// (griglia, chunk, acqua, worldgen, stagioni — 4.310 righe) usava del motore
// OTTO NOMI IN TUTTO. Otto. Il resto era già agnostico e non lo sapeva nessuno.
//
// Quindi qui la regola è secca: **fuori da `src/motore/` non si nomina Babylon.**
// Il mondo produce array grezzi e li passa a una fabbrica; l'input parla di
// intenzioni, non di eventi del motore. Se fra due anni Babylon non va più bene,
// il conto da pagare è questa cartella e basta.
//
// ⚠ E GLI IMPORT SONO PROFONDI, non dal barile. `@babylonjs/core/index.js`
// tira dentro 2.224 moduli: senza bundler sono 2.224 richieste al server di
// sviluppo. Importando il singolo file si paga solo quello che si usa — ed è
// anche il modo in cui si scopre subito cosa serve davvero.

import { Engine } from '@babylonjs/core/Engines/engine.js';
import { Scene } from '@babylonjs/core/scene.js';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera.js';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight.js';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight.js';
import { CascadedShadowGenerator } from '@babylonjs/core/Lights/Shadows/cascadedShadowGenerator.js';
// ⚠ SEMPRE PRESENTE, non solo per fare esperimenti. È l'unico strumento che si
// ha su una macchina che non si può profilare: su un telefono non c'è una
// console, e quello che arriva è uno SCATTO DELLO SCHERMO. Un pannello che dice
// disegni e millisecondi trasforma «va piano» da opinione in misura.
import { SceneInstrumentation } from '@babylonjs/core/Instrumentation/sceneInstrumentation.js';
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color.js';
import { FxaaPostProcess } from '@babylonjs/core/PostProcesses/fxaaPostProcess.js';
import '@babylonjs/core/Shaders/fxaa.fragment.js';
import '@babylonjs/core/Shaders/fxaa.vertex.js';
import '@babylonjs/core/Shaders/postprocess.vertex.js';
import '@babylonjs/core/Engines/Extensions/engine.renderTarget.js';
// ⚠ LA FUNZIONE PURA, non l'estensione di Scene. `Culling/ray.js` aggiunge
// `scene.createPickingRay` come effetto collaterale; `ray.core.js` esporta la
// stessa cosa come funzione. Con gli import profondi la seconda è meglio: si
// vede da dove viene, e non aggiunge metodi a una classe altrui.
import { CreatePickingRay } from '@babylonjs/core/Culling/ray.core.js';
import { Matrix } from '@babylonjs/core/Maths/math.vector.js';
import { ambienteDiFabbrica } from './stile.js';
import { Luci } from './luci.js';
import { classeDispositivo, schedaDi, gpuDaTelefono, fissiDiAvvio, DPR_MAX, LIVELLI } from './qualita.js';

// ⚠ GLI SHADER VANNO IMPORTATI A MANO quando si importa in profondità. Babylon
// registra i sorgenti dei suoi materiali come EFFETTI COLLATERALI di moduli
// separati: con il barile arrivano da soli, con gli import profondi no, e il
// materiale fallisce a runtime con «effect is not ready» invece che a build.
// Le ombre a cascata ne vogliono di loro (il depth pass e il filtro PCF).
import '@babylonjs/core/Shaders/shadowMap.vertex.js';
import '@babylonjs/core/Shaders/shadowMap.fragment.js';
import '@babylonjs/core/Shaders/depth.vertex.js';
import '@babylonjs/core/Shaders/depth.fragment.js';
import '@babylonjs/core/Lights/Shadows/shadowGeneratorSceneComponent.js';

/** Il cielo di Leafy, che è anche il colore del vuoto oltre l'orizzonte. */
export const CIELO = { r: 0.62, g: 0.81, b: 0.91 };

/**
 * IL RIG: motore, scena, camera, sole e ombre in un oggetto solo.
 *
 * È l'equivalente del `rig` di Lantern e volutamente ha la stessa forma, così
 * la regia (`main.js`) si legge uguale e il confronto fra i due progetti resta
 * possibile riga per riga.
 */
export class Rig {
  constructor(tela) {
    this.tela = tela;

    // ---- CHE MACCHINA È, e si decide PRIMA di creare qualunque cosa ---------
    // ⚠ DUE COSE SI DECIDONO QUI E NON SI CAMBIANO PIÙ: l'antialiasing del
    // canvas (sta nel contesto WebGL: o c'è o si ricrea il motore) e se il
    // cammino nei voxel delle lampade viene COMPILATO. La seconda è la lezione
    // mobile di Leafy-Lantern — su una GPU mobile un `if` non spegne niente,
    // perché il compilatore riserva i registri per il ramo che non esegue e con
    // tanti registri per thread scendono i thread in volo. Lì abbassare la
    // risoluzione non spostava gli fps: non erano i pixel, era l'occupancy.
    this.dispositivo = classeDispositivo();
    this.fissi = fissiDiAvvio(this.dispositivo);
    this.dprMax = DPR_MAX[this.dispositivo.mobile ? 'mobile' : 'desktop'];
    // ⚠ IL PRIMO GRADINO SERVE GIÀ QUI. Costruire una mappa d'ombra 2048² a
    // quattro cascate e poi ridurla vuol dire allocare 16 MB di texture su un
    // telefono per buttarli un fotogramma dopo — e su alcuni chip
    // l'allocazione stessa è un singhiozzo visibile. Meglio non farla nascere.
    this.profilo = LIVELLI[this.dispositivo.mobile ? 'mobile' : 'desktop'][0];

    // ⚠ `antialias: true` QUI E NON PIÙ AVANTI. In Lantern l'MSAA era una
    // manopola che si poteva spegnere per sbaglio, e spegnendola «era tutto
    // seghettato» — un giorno intero per capirlo. Su Babylon l'antialiasing del
    // canvas si decide alla creazione del contesto: o c'è o si ricrea il motore.
    // Che è esattamente il posto giusto per una cosa che non si deve poter
    // perdere in silenzio.
    this.motore = new Engine(tela, true, {
      // ⚠ SPENTO OVUNQUE (era `!mobile`): dice al driver che il framebuffer va
      // CONSERVATO a fine fotogramma — su una GPU a tile è una copia intera per
      // frame, e serviva solo agli scatti, che passano da `rig.scatto` (il
      // bersaglio apposta che funziona comunque). Anche su desktop era banda
      // pagata per niente. Vedi docs/STUDIO-RETRO.md.
      preserveDrawingBuffer: false,
      stencil: false,
      // ⚠ RIBALTATO DALLO STUDIO TBDR (docs/STUDIO-RETRO.md): su un tiler l'MSAA
      // è on-chip e quasi gratis, il post-process no — la tabella mobile spegne
      // FXAA e qui il canvas tiene l'MSAA. La vecchia nota «quadruplica il
      // riempimento» valeva per le GPU desktop.
      antialias: this.fissi.antialias,
      powerPreference: 'high-performance',
      // ⚠ IL MONDO GRANDE SI DECIDE QUI, ALLA CREAZIONE, O NON SI DECIDE PIÙ.
      // `useLargeWorldRendering` fa due cose (verificate nella d.ts di 9.23):
      // porta le matrici a 64 bit e accende l'ORIGINE MOBILE su tutte le scene —
      // cioè sposta le posizioni prima di darle agli shader, tenendo la camera
      // sull'origine e traslando il mondo. È la cura al tremolio dei vertici
      // quando ci si allontana dal centro della mappa.
      //
      // Si accende ADESSO e non «quando servirà», perché l'origine mobile
      // cambia il significato delle coordinate dentro gli shader: accenderla a
      // materiali scritti vorrebbe dire ri-verificarli tutti. In Leafy-Lantern
      // ogni materiale ragionava in coordinate MONDO (vPosMondo) — con l'origine
      // mobile quella grandezza non è più la stessa, e va saputo da subito.
      // ⚠ E COSTA: le matrici a 64 bit sono lavoro di CPU in più a ogni nodo.
      // Va misurato, non dato per buono.
      useLargeWorldRendering: true,
    }, true);

    // ⚠ IL TETTO DEL RAPPORTO DEI PIXEL, e questa riga da sola vale più di
    // tutto il resto del file su un telefono. Il quarto argomento qui sopra è
    // `adaptToDeviceRatio`: acceso, Babylon renderizza al DPR PIENO del
    // dispositivo. Su un telefono con DPR 3 sono NOVE VOLTE i pixel di un
    // desktop — e per tutto questo progetto è stato acceso senza nessun tetto.
    // Da Leafy-Lantern: «il cap del pixel ratio è il singolo fattore che pesa
    // di più sui fps».
    // ⚠ E `setHardwareScalingLevel` NON RIDIMENSIONA DA SOLO: senza `resize()`
    // non succede niente, e non si lamenta. Ci ho perso una misura intera —
    // tutti i numeri uscivano identici e credevo fosse il vsync.
    // ⚠ LA PERDITA DEL CONTESTO LA GESTISCE BABYLON DA SÉ (verificato nel
    // sorgente: registra `webglcontextlost` e chiama `preventDefault`, che è la
    // riga senza la quale il contesto non torna più e la tela resta NERA per
    // sempre). In Leafy-Lantern quel gestore era nostro; qui non serve.
    this.scheda = schedaDi(this.motore);
    // ⚠ L'USER-AGENT MENTE, LA GPU NO — e questo blocco viene da un rapporto 🩺
    // vero: «desktop» a 6 fps, p50 179 ms, ombre 48 ms… su una Mali-G68. Era il
    // telefono del committente con «richiedi sito desktop» attivo: l'UA diceva
    // desktop, la classe gli credeva, e il profilo desktop pieno (4 cascate
    // 2048², 269k triangoli) finiva su una GPU a tile. Con la scala automatica
    // tolta per decisione, quel caso non ha più nessuna rete sotto: si corregge
    // QUI, dove il nome della scheda è finalmente noto. Il motore è già nato
    // (l'MSAA del canvas resta quello del contesto — su una GPU a tile è il
    // costo minore), ma profilo, DPR e fissi si raddrizzano prima che nasca
    // la scena.
    if (gpuDaTelefono(this.scheda.nome) && !this.dispositivo.mobile) {
      this.dispositivo.mobile = true;
      this.dispositivo.uaMentiva = true;      // per il pannello e i rapporti
      this.fissi = fissiDiAvvio(this.dispositivo);
      this.dprMax = DPR_MAX.mobile;
      this.profilo = LIVELLI.mobile[0];
    }
    this._scala = 1;
    this.applicaScala(1);

    this.scena = new Scene(this.motore);
    this.scena.clearColor = new Color4(CIELO.r, CIELO.g, CIELO.b, 1);

    // ---- LE MANOPOLE DI BABYLON CHE QUI ERANO TUTTE NELLA POSIZIONE SBAGLIATA
    //
    // ⚠ SONO IMPOSTAZIONI DI FABBRICA PENSATE PER UN EDITOR, non per un gioco:
    // Babylon di suo è pronto a farsi cliccare le mesh, a ricontrollare i
    // materiali e a tenersi le risorse in cache offline, perché il suo caso
    // tipico è una scena in un browser dentro un'app. Un gioco che si disegna e
    // basta paga tutte queste cose e non ne usa nessuna.
    //
    // ⚠ E QUESTA COSTA MENO DI QUANTO SEMBRA — misurata, dopo averlo scritto al
    // contrario. Senza, Babylon fa una picking a ogni movimento del puntatore
    // per sapere su quale mesh sta il mouse, e avevo scritto che voleva dire
    // «intersecare mezzo milione di triangoli». Falso: quasi tutte le nostre
    // mesh hanno «isPickable = false», quindi non c'è quasi niente da provare.
    // Cronometrando 400 eventi: 11,5 ms in tutto senza, 8,1 con — nove
    // MILLESIMI di millisecondo per evento. Si tiene perché è gratis e perché è
    // vero che non ci serve (il bersaglio lo troviamo camminando la griglia in
    // `gioco/mira.js`), non perché sposti i numeri.
    this.scena.skipPointerMovePicking = true;
    this.scena.constantlyUpdateMeshUnderPointer = false;
    // ⚠ E NEMMENO ALLA PRESSIONE E AL RILASCIO, che è dove costava davvero.
    // Il commento qui sopra («quasi tutte le mesh hanno isPickable = false»)
    // era vero per tutto TRANNE la cosa più grossa che c'è: i chunk del
    // terreno, rimasti pescabili. Alla pressione Babylon interseca il raggio
    // con le migliaia di triangoli di ogni chunk in vista — e la pressione è
    // esattamente il gesto con cui si scava, cioè il momento in cui uno scatto
    // si sente. Il bersaglio lo troviamo noi camminando la griglia
    // (`gioco/mira.js`): il picking di Babylon qui è lavoro doppio.
    this.scena.skipPointerDownPicking = true;
    this.scena.skipPointerUpPicking = true;
    // ⚠ E LA CACHE OFFLINE (IndexedDB) non la usiamo: i modelli arrivano da
    // `node_modules` e dal disco, che è già locale.
    this.motore.enableOfflineSupport = false;
    // ⚠ E I MATERIALI NON CAMBIANO A OGNI FOTOGRAMMA. Questo blocca il
    // meccanismo che a ogni modifica di scena rimarca tutti i materiali come
    // «da ricontrollare»: le uniform continuano ad andare in GPU, quello che
    // sparisce è il giro di controlli. Chi cambia davvero un materiale lo
    // sblocca da sé (`markAsDirty`), e qui dentro non succede mai.
    this.scena.blockMaterialDirtyMechanism = true;

    // ---- LA NEBBIA, che è metà del LOD --------------------------------------
    // ⚠ E ADESSO SÌ, perché adesso c'è una distanza di resa da nascondere. Il
    // commento che stava qui («niente nebbia ancora: messa prima diventa una
    // scusa per non guardare quanto lontano si arriva») era giusto e ha fatto
    // il suo lavoro: si è guardato, si è visto il bordo del mondo, e ora si
    // decide dove finire invece di sfumare per non decidere.
    //
    // ⚠ IL COLORE DELLA NEBBIA È IL CIELO, sempre. Se differiscono anche di
    // poco si vede una banda all'orizzonte dove il mondo finisce e il fondo
    // comincia — e a quel punto la nebbia denuncia il confine invece di
    // nasconderlo. Lo tiene allineato il ciclo del giorno, che li scrive
    // insieme (`giorno.js`).
    this.scena.fogMode = Scene.FOGMODE_LINEAR;
    this.scena.fogColor = new Color3(CIELO.r, CIELO.g, CIELO.b);
    this.distanzaResa = this.profilo.dist;
    this._osservatoriDistanza = [];
    this.scena.fogStart = this.distanzaResa * 0.55;
    this.scena.fogEnd = this.distanzaResa * 0.98;

    // ⚠ MANO DESTRA, E VA DECISO ALLA PRIMA RIGA. Babylon è SINISTRORSO di
    // fabbrica; three.js è destrorso. Tutto il mondo di Leafy — worldgen,
    // mesher, l'avvolgimento dei triangoli, il verso delle facce — è scritto
    // destrorso, e lo resterà: è quello il codice che sopravvive alla
    // migrazione, non il motore.
    //
    // Senza questa riga il primo mondo a schermo era GRIGIO e vuoto, e ci ho
    // messo tre schermate a capire perché: con l'avvolgimento invertito TUTTE
    // le facce diventano di dietro, il culling le butta, e quello che si vede
    // sono gli INTERNI del terreno. Le normali poi le calcola l'avvolgimento,
    // quindi uscivano puntate al contrario e la luce non prendeva niente —
    // due sintomi diversi, una causa sola. Misurato leggendo il buffer: una
    // faccia rivolta in SU al fondo del mondo, che è impossibile.
    this.scena.useRightHandedSystem = true;
    // ⚠ NIENTE NEBBIA ANCORA: in Lantern la nebbia nascondeva il bordo del
    // mondo caricato, e va rimessa DOPO aver deciso la distanza di resa. Messa
    // prima diventa una scusa per non guardare quanto lontano si arriva.

    // LA CAMERA A DIORAMA. Orbitale attorno a un bersaglio, come in Lantern:
    // ArcRotateCamera è esattamente quel modello, ma già scritto e con i
    // vincoli (limiti di beta, inerzia, pizzico su telefono) di serie.
    this.camera = new ArcRotateCamera('camera', -Math.PI / 4, Math.PI / 3.2, 26,
      new Vector3(0, 6, 0), this.scena);
    this.camera.lowerBetaLimit = 0.15;
    this.camera.upperBetaLimit = Math.PI / 2.05;   // mai sotto l'orizzonte
    this.camera.lowerRadiusLimit = 4;
    this.camera.upperRadiusLimit = 120;
    this.camera.wheelDeltaPercentage = 0.02;
    this.camera.pinchDeltaPercentage = 0.02;
    this.camera.minZ = 0.5;
    this.camera.maxZ = 900;
    this.camera.attachControl(tela, true);
    // ⚠ SOLO IL TASTO SINISTRO GIRA LA CAMERA. Di fabbrica l'ArcRotateCamera
    // ascolta tutti e tre i tasti: il destro ruotava E apriva il menu del
    // browser, quindi non era utilizzabile per posare un blocco. Qui il destro
    // e il centrale restano liberi per il gioco, che è l'unico motivo per cui
    // questa riga esiste.
    if (this.camera.inputs.attached.pointers) this.camera.inputs.attached.pointers.buttons = [0];
    tela.addEventListener('contextmenu', (e) => e.preventDefault());

    // ---- LA LUCE ------------------------------------------------------------
    // ⚠ E QUI SI È PRECISATA LA SCELTA DI CAMPO, dopo una bocciatura. Accettare
    // il modello del motore vuol dire accettare come CALCOLA l'ombra — la mappa
    // a cascata, che è il motivo per cui abbiamo cambiato libreria. NON vuol
    // dire accettare come la DIPINGE. Con lo StandardMaterial nudo ogni faccia
    // prende il suo N·L, la cima chiara e i fianchi degradanti: rendering
    // corretto, stile sbagliato. Committente: «non esiste un colore diverso da
    // ombra o non in ombra». Vedi `stile.js` per come si spegne l'una tenendo
    // l'altra.
    //
    // UNA SOLA LUCE, quindi, e serve a produrre la mappa d'ombra. Bianca e a
    // intensità 1 perché quello che accumula deve essere il FATTORE D'OMBRA
    // puro: il colore della luce del giorno sta in `ambienteCol`.
    this.sole = new DirectionalLight('sole', ambienteDiFabbrica().verso.clone(), this.scena);
    this.sole.position = new Vector3(60, 90, 60);
    this.sole.intensity = 1;
    this.sole.diffuse = new Color3(1, 1, 1);
    this.sole.specular = new Color3(0, 0, 0);

    // ⚠ NIENTE EMISFERICA. Sembrava il modo di avere «il cielo che rischiara»,
    // e invece è un secondo termine che finisce dentro lo stesso accumulo da cui
    // leggiamo l'ombra: sporcherebbe il numero. L'ambiente qui è un COLORE che
    // moltiplica, non una luce — esattamente come in Leafy-Lantern.
    // le lampade: sfere nostre, non luci del motore. Vedi `luci.js` per il
    // perché — in due parole, il loro contributo sporcherebbe il numero da cui
    // leggiamo l'ombra del sole.
    this.luci = new Luci();

    /**
     * LA GRIGLIA DEI MURI che le lampade camminano per fare ombra.
     *
     * ⚠ STA SUL RIG e non dentro la fabbrica perché la leggono in due: la
     * fabbrica la CARICA (è lei che sa cos'è una texture 3D) e lo stile la LEGA
     * a ogni materiale. Tenerla in mezzo, in un oggetto semplice, evita che uno
     * dei due debba conoscere l'altro.
     */
    this.voxel = { texture: null, attiva: false, minX: 0, minY: 0, minZ: 0,
                   larghezza: 0, altezza: 0, profondita: 0, cima: 0 };

    const amb = ambienteDiFabbrica();
    this.ambienteCol = amb.ambiente;   // quanto luccica in pieno sole
    this.ombraTinta = amb.ombra;       // di che colore vira l'ombra (NON un grigio)
    this.soleVerso = this.sole.direction;
    // ⚠ IL SOLE HA UN PAVIMENTO, LA SUA LUCE NO. `sole.direction` non scende
    // mai sotto i 14° (`giorno.js`, o le cascate d'ombra si stirano): a
    // mezzanotte punta ancora in giù. Chi ha bisogno di sapere se c'è davvero
    // il sole — il brillio dell'acqua — legge questo, che il ciclo del giorno
    // ricalcola dall'altezza VERA. Senza, il lago luccica di notte.
    this.soleLuce = 1;
    this.lunaVerso = new Vector3(0, -1, 0);
    this.lunaLuce = 0;                 // quanta luna c'è: fase per «è sopra l'orizzonte»

    // ---- LE OMBRE, che in Lantern erano 1.090 righe nostre -------------------
    // Tre sistemi scritti a mano (controluce, campoSole, marcia), una mappa
    // 2048² ricostruita 11 volte al secondo, 95.176 ricostruzioni in una
    // sessione e un picco da 3,8 ms. Qui sono quattro righe.
    this.ombre = new CascadedShadowGenerator(this.profilo.mappa, this.sole);
    this.ombre.numCascades = this.profilo.cascate;
    // ⚠ `lambda` VICINO A 1 = TESSITURA DENSA DOVE SI GUARDA. Spartisce le
    // cascate in modo logaritmico invece che lineare: la prima copre pochi metri
    // con tutti i suoi texel, l'ultima copre il resto. È la manopola che decide
    // se il bordo dell'ombra è netto o a scalini.
    this.ombre.lambda = 0.94;
    this.ombre.stabilizeCascades = true;    // il bordo non «striscia» camminando
    this.ombre.filteringQuality = this.profilo.pcf
      ? CascadedShadowGenerator.QUALITY_HIGH : CascadedShadowGenerator.QUALITY_LOW;
    this.ombre.usePercentageCloserFiltering = this.profilo.pcf;
    // ⚠ NOVANTA E NON CENTOQUARANTA: la distanza d'ombra è il denominatore della
    // risoluzione. Ogni metro in più che si pretende di ombreggiare toglie texel
    // a quelli vicini — e l'ombra a novanta blocchi non la guarda nessuno,
    // mentre la scaletta a dieci la vedono tutti.
    this.ombre.shadowMaxZ = this.profilo.ombraZ;
    this.ombre.depthClamp = true;
    // ⚠ `autoCalcDepthBounds` È SPENTO ANCHE SU DESKTOP, e il numero che l'ha
    // deciso è questo: misurato con la ricetta `ghibli` e la scena FERMA — cioè
    // con la mappa d'ombra congelata, quando le cascate non stanno disegnando
    // niente — spegnerlo porta 130 → **70 disegni** e 2,5 → **1,0 ms** per
    // fotogramma. Non gli importa che le cascate siano ferme: il riduttore
    // min/max si tira dietro un `DepthRenderer` suo, a piena risoluzione,
    // sull'intera scena, a ogni giro.
    //
    // ⚠ E QUELLO CHE SI PERDE È MENO DI QUELLO CHE SEMBRA, perché qui il range
    // di profondità utile lo sappiamo già: `shadowMaxZ` è la portata del
    // profilo (90 blocchi su desktop) e il mondo è alto una trentina di
    // blocchi, non un canyon. La densità dei texel resta quella di
    // TEXEL_PER_BLOCCO, il riparto lo fa `lambda` a 0,94 — e l'acne, in questo
    // progetto, non la cura il range: la cura la soglia di `facciaAlSole`
    // (vedi CLAUDE.md, «l'acne si cura con la soglia, non col bias»).
    this.ombre.autoCalcDepthBounds = false;
    // ⚠ E LA MAPPA NON SI RIFÀ A OGNI FOTOGRAMMA. Misurato con
    // `SceneInstrumentation`: la resa dei bersagli d'ombra costa 2,12 ms su 5,98
    // di CPU per fotogramma — più di un terzo — e disegna quattro volte gli
    // stessi 112.430 triangoli, uno per cascata. Ma cosa cambia da un
    // fotogramma al successivo? Il sole si muove di un quarto di grado al
    // minuto, e la geometria è ferma finché non si rompe qualcosa. Rifarla ogni
    // due giri dimezza la spesa e a schermo l'ombra è in ritardo di sedici
    // millisecondi, che nessuno vede.
    // ⚠ TRANNE SUL GRADINO PIÙ ALTO DEL DESKTOP, dove la scala non è lì per
    // risparmiare: chi ha la macchina per farlo deve vedere il meglio.
    this._ombraOgni(this.profilo.ombraOgni);

    // ---- LO STRUMENTO ---------------------------------------------------
    // ⚠ COSTA POCO E VALE MOLTO: accende i due contatori che dicono DOVE va il
    // tempo — quante chiamate di disegno per fotogramma, e quanti millisecondi
    // se ne va la mappa delle ombre. Misurato su questa macchina: 273 disegni
    // di cui 208 di sole ombre, e 1,81 ms su 5,98 di CPU.
    this._strumento = new SceneInstrumentation(this.scena);
    this._strumento.captureRenderTargetsRenderTime = true;
    this._sommaDisegni = 0; this._giriDisegni = 0; this._mediaDisegni = 0;

    // ⚠ IL BIAS È LA MANOPOLA CHE CI HA FATTO PENARE PER GIORNI in Lantern
    // (acne sulle diagonali, ombre staccate da terra). Qui parte dai valori
    // consigliati e si tara GUARDANDO, con il sole basso: è l'angolo che
    // smaschera l'acne, ed è quello da cui non guardavo.
    // ⚠ LO SCARTO PER NORMALE È PICCOLO, E VA TENUTO PICCOLO. Sposta il punto
    // campionato LUNGO LA NORMALE della superficie che riceve: serve contro
    // l'acne, ma vicino al bordo di un'ombra quello spostamento fa uscire il
    // campione da sotto l'occlusore, e si accende una LINEETTA sul contorno.
    // Il committente l'ha vista e descritta esatta: «è come se prendesse lo
    // sbalzo del blocco d'erba e ci passasse la luce». Con lo stile piatto quel
    // filo di luce si vede il doppio, perché non c'è nessuna sfumatura a
    // nasconderlo.
    //
    // Qui l'acne la tiene a bada soprattutto altro: le facce che guardano
    // dall'altra parte del sole sono in ombra per geometria (vedi `stile.js`),
    // e il sole non scende mai troppo (vedi `giorno.js`). Quindi lo scarto può
    // restare quasi zero, che è dove il bordo è pulito.
    this.ombre.bias = 0.002;
    this.ombre.normalBias = 0.006;

    // ---- L'ANTIALIASING DEI BORDI SOTTILI ------------------------------------
    // ⚠ L'MSAA DELLA TELA NON BASTA QUI, e il motivo è la geometria: le terrazze
    // di Leafy sono fianchi alti UN blocco, e a cinquanta blocchi di distanza un
    // blocco è meno di un pixel. L'MSAA campiona di più dentro il triangolo, ma
    // un triangolo più piccolo del pixel scompare e riappare mentre la camera si
    // muove — è lo sfarfallio che il committente ha visto come «vibrazioni a
    // distanza». FXAA lavora sull'IMMAGINE, cioè proprio dove il difetto si
    // manifesta, e costa una passata a schermo intero invece di quadruplicare il
    // riempimento.
    //
    // ⚠ NON È UN SOSTITUTO DEL LOD, ed è bene dirlo: il LOD toglie i triangoli
    // che non si vedono, FXAA rende sopportabili quelli che restano. Servono
    // tutt'e due, e il LOD è il prossimo pezzo.
    // ⚠ E SU MOBILE NON NASCE: un post-process è una passata a schermo intero,
    // e su un chip che è già a corto di banda è proprio quello che non serve.
    this.fxaa = this.profilo.fxaa ? new FxaaPostProcess('fxaa', 1, this.camera) : null;

    addEventListener('resize', () => this.motore.resize());
    this._collegaIspettore();
  }

  /**
   * L'ISPETTORE, MA A RICHIESTA.
   *
   * Il committente lo vuole per lavorarci sopra insieme a me: la gerarchia
   * della scena, i materiali, i parametri delle ombre e le statistiche, tutto
   * modificabile dal vivo mentre io scrivo codice. È la cosa che in Lantern è
   * mancata di più — lì ogni manopola andava esposta a mano nel «Banco V2».
   *
   * ⚠ SI CARICA SOLO QUANDO SI PREME, e non è pigrizia: il pacchetto è 6,8 MB
   * ed è una dipendenza di SVILUPPO. Con l'import statico finirebbe nel gioco
   * pubblicato; con `import()` dentro il gestore del tasto non lo tocca nessuno
   * finché non lo si chiede.
   */
  _collegaIspettore() {
    addEventListener('keydown', async (e) => {
      if (e.key !== 'i' && e.key !== 'I') return;
      if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
      try {
        const ins = await import('@babylonjs/inspector');
        if (this._ispettoreAperto) { ins.HideInspector ? ins.HideInspector() : null; this._ispettoreAperto = false; }
        else { ins.ShowInspector(this.scena); this._ispettoreAperto = true; }
      } catch (err) {
        console.error('ispettore:', err);
      }
    });
  }

  /**
   * QUANTI PIXEL DISEGNARE, e il conto è uno solo per non avere due verità.
   * `s` moltiplica il tetto: 1 = il tetto pieno, 0,5 = metà lato.
   */
  applicaScala(s) {
    this._scala = s;
    const dpr = Math.min(typeof devicePixelRatio === 'number' ? devicePixelRatio : 1, this.dprMax) * s;
    this.motore.setHardwareScalingLevel(1 / Math.max(0.25, dpr));
    this.motore.resize();
  }

  /**
   * APPLICA UN GRADINO DELLA SCALA DI QUALITÀ.
   *
   * ⚠ QUI DENTRO C'È SOLO CIÒ CHE SI PUÒ CAMBIARE A CALDO. Le cose che vivono
   * nello shader (il cammino nei voxel) stanno in `fissi` e si decidono alla
   * creazione: verificato che `CustomMaterial` mette il sorgente in cache e non
   * lo rigenera, e che svuotare quella cache non basta perché l'effetto
   * compilato resta nel motore.
   *
   * ⚠ E L'ERBA E LE PARTICELLE NON SONO SUE: il rig le chiama attraverso
   * `bersagli`, che la regia gli passa. Se no il motore dovrebbe conoscere la
   * vegetazione, e non è affar suo.
   */
  /**
   * UNO SCATTO DELLA SCENA, come dato da mandare.
   *
   * ⚠ NON SI LEGGE LA TELA. Su mobile «preserveDrawingBuffer» è spento apposta
   * (costa banda su un chip che è già il collo di bottiglia), e con quello
   * spento «toDataURL» torna un'immagine VUOTA. Ci sono già cascato: quattro
   * misure di pixel di fila che tornavano zero, e per un giro ho creduto ai
   * numeri invece che al metodo. Qui si ridisegna in un bersaglio apposta, che
   * funziona in tutti e due i casi.
   *
   * ⚠ E SI RIMPICCIOLISCE: da un telefono con dpr 3 una figura a piena
   * risoluzione sono megabyte, e un rapporto che non parte è peggio di un
   * rapporto senza figura. Seicento pixel bastano per vedere se il prato c'è,
   * se le ombre sono a scaletta, se l'immagine è stirata.
   *
   * ⚠ IMPORTATO AL VOLO: è un attrezzo che si usa una volta ogni tanto, e non
   * deve pesare sull'avvio di chi non lo preme mai.
   */
  async scatto(larghezza = 600) {
    const { CreateScreenshotUsingRenderTargetAsync } =
      await import('@babylonjs/core/Misc/screenshotTools.js');
    const alt = Math.round(larghezza * this.motore.getRenderHeight() / Math.max(1, this.motore.getRenderWidth()));
    // ⚠ GLI ARGOMENTI SONO NOVE PRIMA DELLA QUALITÀ, e li avevo contati male:
    // la qualità è l'undicesimo, e messa al decimo finiva in «useLayerMask» —
    // cioè un numero al posto di un vero/falso, che non dà nessun errore e
    // semplicemente ignora la compressione. Firma per esteso:
    // (motore, camera, misura, tipo, campioni, antialias, nomeFile,
    //  sprite, stencil, useLayerMask, qualità)
    return CreateScreenshotUsingRenderTargetAsync(this.motore, this.camera,
      { width: larghezza, height: alt }, 'image/webp', 1, false, undefined, false, false, true, 0.72);
  }

  /**
   * I NUMERI CHE DICONO DOVE VA IL TEMPO. ⚠ Non si nomina Babylon fuori di qui:
   * chi disegna il pannello riceve due numeri, non un oggetto di un motore.
   */
  get misura() {
    if (!this._strumento) return { disegni: 0, ombreMs: 0 };
    return {
      // ⚠ LA MEDIA, NON L'ISTANTE, e non è pignoleria: da quando la mappa delle
      // ombre si rifà ogni due fotogrammi, metà dei giri non hanno il passaggio
      // d'ombra. Leggendo il contatore ISTANTANEO il numero esce 61 o 125
      // secondo su quale dei due si capita — cioè una moneta. E siccome è il
      // numero con cui diagnostico un telefono che non posso profilare, una
      // moneta è peggio di niente: la prima misura buona mi avrebbe fatto
      // credere di aver dimezzato le chiamate di disegno.
      disegni: Math.round(this._mediaDisegni),
      // ⚠ ZERO QUANDO IL SOLE È SPENTO, e non è pignoleria: quel contatore
      // conserva l'ULTIMA media anche quando nessun bersaglio viene più
      // disegnato. Col sole spento riportava 3,21 ms — PIÙ di quando le ombre
      // c'erano (2,17) — mentre i disegni crollavano da 82 a 50, cioè la
      // passata era davvero sparita. Sul Chromebook del committente il rapporto
      // diceva «ombre 34 ms» su un fotogramma da 74, con il sole spento, e ho
      // quasi passato mezz'ora a inseguire millisecondi che non esistevano.
      // ⚠ UNO STRUMENTO CHE MENTE È PEGGIO DI UNO CHE MANCA: se non ci fosse
      // stato, avrei cercato altrove; dicendo un numero grosso mi ha mandato
      // dalla parte sbagliata con l'aria di avermi aiutato.
      ombreMs: this.profilo.sole ? this._strumento.renderTargetsRenderTimeCounter.lastSecAverage : 0,
    };
  }

  /**
   * UN CAMPIONE PER FOTOGRAMMA, per il banco di misura (fase R1 del rework).
   *
   * ⚠ QUI SI LEGGE `current`, NON la media: il banco fa lui le statistiche
   * (p50/p99 in `gioco/misure.js`, provato in Node), e una media di medie è il
   * modo classico di lisciare via proprio gli scatti che si stanno cercando.
   * ⚠ E `rtMs` è il tempo di TUTTI i bersagli di resa — ombre, specchio,
   * rifrazione, profondità insieme: è il numero della «pipeline», quello che il
   * rework deve far scendere. Il dettaglio per passata Babylon non lo dà
   * gratis; quando servirà si misurerà spegnendo una passata alla volta.
   */
  campione() {
    if (!this._strumento) return { disegni: NaN, rtMs: NaN };
    return {
      disegni: this._strumento.drawCallsCounter.current,
      rtMs: this._strumento.renderTargetsRenderTimeCounter.current,
    };
  }

  /**
   * L'INVENTARIO DELLE PASSATE: cosa si disegna oltre alla scena, e quanto è
   * grosso. È la tabella che la fase R2 deve tenere sotto controllo — ogni
   * passata nuova si paga qui, visibile, non sepolta in un contatore unico.
   */
  passate() {
    const voci = [];
    for (const luce of this.scena.lights) {
      const g = luce.getShadowGenerator && luce.getShadowGenerator();
      if (!g) continue;
      const mappa = g.getShadowMap();
      voci.push({ nome: `ombre:${luce.name}`, lato: mappa.getSize().width, passate: g.numCascades || 1, mesh: mappa.renderList ? mappa.renderList.length : -1 });
    }
    for (const t of this.scena.customRenderTargets) {
      voci.push({ nome: t.name, lato: t.getSize().width, passate: 1, mesh: t.renderList ? t.renderList.length : -1 });
    }
    for (const dr of Object.values(this.scena._depthRenderer || {})) {
      const mappa = dr.getDepthMap();
      voci.push({ nome: mappa.name || 'profondità', lato: mappa.getSize().width, passate: 1, mesh: mappa.renderList ? mappa.renderList.length : -1 });
    }
    return voci;
  }

  /**
   * OGNI QUANTI FOTOGRAMMI SI RIFÀ LA MAPPA DELLE OMBRE.
   * ⚠ 0 e 1 vogliono dire «tutti»; la mappa si segna anche come da rifare
   * SUBITO, se no cambiando gradino si resterebbe con l'ultima disegnata alla
   * risoluzione vecchia finché non scatta il turno.
   */
  _ombraOgni(n) {
    const mappa = this.ombre && this.ombre.getShadowMap();
    if (!mappa) return;
    mappa.refreshRate = Math.max(1, n || 1);
    mappa.resetRefreshCounter();
    this._ombraPasso = Math.max(1, n || 1);
  }

  /**
   * LA MAPPA D'OMBRA SI RIFÀ SOLO QUANDO QUALCOSA È CAMBIATO — fase R2.
   *
   * ⚠ IL NUMERO CHE L'HA DECISA: 208 chiamate di disegno su 296 erano le
   * quattro cascate (52 mesh × 4), rifatte OGNI fotogramma anche col sole
   * fermo, il mondo fermo e la camera ferma — cioè per la maggior parte del
   * tempo di chi costruisce o guarda. Un'ombra di una scena immobile è
   * un'immagine immobile: ridisegnarla è pagare per niente.
   *
   * Chi chiama passa una FIRMA: un numero che cambia quando cambia qualcosa
   * che le ombre vedono (verso del sole, camera — le cascate seguono il suo
   * frustum —, revisione del mondo, posizione dei proiettanti mobili). Qui
   * dentro c'è solo l'isteresi: TRE fotogrammi con la stessa firma → si
   * congela (`refreshRate 0`, che per Babylon è «una volta e basta»); firma
   * nuova → si scongela subito e si riparte dal passo del profilo.
   *
   * ⚠ LA SOGLIA A TRE non è prudenza a caso: il congelamento all'ISTANTE
   * farebbe da filtro passa-basso su chi si muove a scatti piccoli (un tocco
   * di stick), congelando e scongelando a raffica — e ogni scongelo paga una
   * mappa intera. Tre fotogrammi fermi vuol dire «si è fermato davvero».
   */
  /** Un proiettante nuovo scongela le ombre alla prossima firma, qualunque sia. */
  _sporcaOmbre() { this._quieteFirma = null; }

  quieteOmbre(firma) {
    const mappa = this.ombre && this.ombre.getShadowMap();
    if (!mappa || !this.sole.shadowEnabled) return;
    if (firma === this._quieteFirma) {
      if (this._quieteConta < 3) { if (++this._quieteConta === 3) mappa.refreshRate = 0; }
      // ⚠ E SI RIAPPLICA SE QUALCUN ALTRO L'HA SCIOLTO: spegni-e-riaccendi il
      // sole (la serie di misura lo fa) lasciava il contatore a 3 e la mappa
      // viva — «già congelata» per il contatore, mai più congelata per la GPU.
      // Trovato dalla serie stessa: 364 disegni nei passi dopo «senza ombre».
      else if (mappa.refreshRate !== 0) mappa.refreshRate = 0;
    } else {
      this._quieteFirma = firma;
      this._quieteConta = 0;
      if (mappa.refreshRate === 0) {
        mappa.refreshRate = this._ombraPasso || 1;
        mappa.resetRefreshCounter();
      }
    }
  }

  applicaProfilo(p, bersagli = {}) {
    this.applicaScala(p.scala);
    this.impostaDistanza(p.dist);
    // ⚠ E FUORI DAL RAMO «se il sole c'è»: vale anche a sole spento, perché il
    // costo è del campionamento, non del sole.
    // ⚠ ARRIVA DA `bersagli` E NON DA UN CAMPO DEL RIG: la fabbrica conosce il
    // rig, non il contrario, e girare la freccia per una riga vorrebbe dire due
    // oggetti che si tengono per mano. `bersagli` è il canale che esiste già
    // per questo — è come ci arrivano l'erba e le particelle.
    if (bersagli.fabbrica) bersagli.fabbrica.ombreSullAcqua(p.ombraAcqua !== false);
    // ⚠ E L'ACQUA INTERA, non solo la sua ombra — è la riga che mancava, e la
    // sua assenza è costata 68 fotogrammi al secondo. Una ricetta può accendere
    // TRE rese complete della scena a fotogramma (specchio, rifrazione,
    // profondità): finché l'unica leva del profilo era `ombraAcqua`, il gradino
    // «bassa» spegneva le ombre del sole e lasciava intatte tre rese della
    // scena. Adesso il profilo dice il tetto (`acquaVera`, `acquaSpecchio`) e la
    // misura (`acquaLato`, `acquaOgni`, `acquaProf`), e l'acqua non può
    // accendersi niente che il gradino non abbia concesso.
    // ⚠ DOPO `applicaScala`, non prima: la mappa di profondità si misura in
    // frazione dello schermo VERO, e lo schermo vero cambia proprio lì sopra.
    if (bersagli.fabbrica && bersagli.fabbrica.applicaProfiloAcqua) bersagli.fabbrica.applicaProfiloAcqua(p);

    // le ombre del sole. ⚠ `shadowEnabled = false` toglie la mappa dai render
    // target (verificato nel sorgente della scena): non è solo il
    // campionamento, è tutta la passata di profondità che sparisce.
    this.sole.shadowEnabled = p.sole;
    if (p.sole) {
      // ⚠ IL MINIMO DI BABYLON È DUE CASCATE (MIN_CASCADES_COUNT): sotto non si
      // scende, si spegne l'ombra e basta — ed è quello che fanno gli ultimi
      // gradini. Misurato qui a 17,4 Mpixel: da quattro cascate a due valgono
      // 1,5 ms, il filtro PCF solo 0,5. Non è il campionamento a costare: ogni
      // cascata è un RENDER della scena in una mappa di profondità.
      if (this.ombre.numCascades !== p.cascate) this.ombre.numCascades = p.cascate;
      this._ombraOgni(p.ombraOgni);
      if (this.ombre.mapSize !== p.mappa) this.ombre.mapSize = p.mappa;
      // ⚠ E L'OMBRA SI ACCORCIA INSIEME ALLA MAPPA: quello che conta è
      // `mappa / ombraZ`, i texel per blocco. Cambiare una senza l'altra è
      // esattamente come ho fatto nascere l'acne su mobile.
      this.ombre.shadowMaxZ = p.ombraZ;
      this.ombre.usePercentageCloserFiltering = p.pcf;
      this.ombre.filteringQuality = p.pcf
        ? CascadedShadowGenerator.QUALITY_HIGH
        : CascadedShadowGenerator.QUALITY_LOW;
    }

    // FXAA: si crea e si distrugge, non si «spegne» — un post-process spento
    // resta una passata a schermo intero.
    if (p.fxaa && !this.fxaa) this.fxaa = new FxaaPostProcess('fxaa', 1, this.camera);
    else if (!p.fxaa && this.fxaa) { this.fxaa.dispose(); this.fxaa = null; }

    const { erba, particelle } = bersagli;
    if (erba) {
      erba.imposta(p.erba > 0);
      if (p.erba > 0 && (erba.densita !== p.erba || erba.raggioChunk !== p.erbaR)) {
        erba.densita = p.erba;
        erba.raggioChunk = p.erbaR;
        // ⚠ E VA RISEMINATA: la cache dei ciuffi ha la densità nella chiave,
        // quindi si invalida da sola, ma il raggio no — senza questa riga i
        // chunk già seminati restano com'erano e il gradino non si vede.
        erba.risemina();
      }
    }
    if (particelle) particelle.mostra(p.particelle);
    this.profilo = p;
    return p;
  }

  /** Un oggetto che proietta ombra. ⚠ È UN ELENCO, non «tutto meno qualcosa»:
   *  in Lantern la polarità sbagliata metteva in mappa farfalle, nuvole e
   *  pioggia, e se n'è accorto il committente guardando, non un errore. */
  proietta(mesh) { this.ombre.addShadowCaster(mesh, true); this._sporcaOmbre(); return mesh; }

  /**
   * LA DISTANZA DI RESA, e da lì tutto il resto.
   *
   * ⚠ PER UN DIORAMA IL LOD VERO È QUESTO. Un terrazzamento è alto UN blocco: a
   * centocinquanta blocchi è un decimo di pixel, e un triangolo più piccolo del
   * pixel non si «semplifica» — scompare e riappare mentre la camera si muove.
   * È lo sfarfallio che si vedeva. Semplificare la maglia laggiù non lo cura:
   * lo cura non disegnarla, e nascondere il confine con la nebbia.
   *
   * (Una maglia più grossa a distanza servirà il giorno che il mondo sarà
   * abbastanza grande da volerne vedere due chilometri. Non è oggi.)
   */
  impostaDistanza(d) {
    this.distanzaResa = d;
    this.scena.fogStart = d * 0.55;
    this.scena.fogEnd = d * 0.98;
    this.camera.maxZ = d * 1.15;
    for (const fn of this._osservatoriDistanza) fn(d);
  }

  /** Chi deve rifare i conti quando la distanza di resa cambia (la fabbrica,
   *  per i livelli di LOD dei chunk). ⚠ Un elenco e non un solo posto: il
   *  giorno che anche l'erba vorrà saperlo, non si litiga per la casella. */
  osservaDistanza(fn) { this._osservatoriDistanza.push(fn); }

  /**
   * IL RAGGIO SOTTO IL PUNTATORE, in coordinate di MONDO.
   *
   * ⚠ L'UNPROIEZIONE LA FA BABYLON, e questo è il pezzo che non va riscritto:
   * viewport, scala hardware del canvas, matrici di vista e proiezione. Sono
   * cinque righe che sembrano facili e che sbagliate danno un raggio quasi
   * giusto — cioè il difetto peggiore, quello che si vede solo ai bordi dello
   * schermo o solo con la finestra ridimensionata.
   *
   * ⚠ MA L'ORIGINE LA PRENDIAMO DALLA CAMERA, NON DAL RAGGIO, e il motivo è
   * sempre quello: `useLargeWorldRendering` accende l'origine mobile, e la
   * matrice di vista da cui Babylon ricava il raggio ha la traslazione tolta —
   * l'origine tornerebbe quasi a zero invece che dove sta la camera. La
   * DIREZIONE invece è immune (una traslazione non gira niente), quindi si
   * prende quella da Babylon e la posizione da `camera.globalPosition`, che è in
   * coordinate di mondo. È lo stesso inciampo delle lampade, e stavolta l'ho
   * evitato prima invece che dopo.
   */
  raggioDaPuntatore(sx, sy) {
    const r = CreatePickingRay(this.scena, sx, sy, Matrix.IdentityReadOnly, this.camera);
    const p = this.camera.globalPosition;
    return { origine: { x: p.x, y: p.y, z: p.z }, verso: { x: r.direction.x, y: r.direction.y, z: r.direction.z } };
  }

  /** Il raggio al centro dello schermo: è quello che si usa da tastiera. */
  raggioAvanti() {
    return this.raggioDaPuntatore(this.motore.getRenderWidth() / 2, this.motore.getRenderHeight() / 2);
  }

  /** Dove guarda la camera, proiettato sul piano. È l'unica cosa che il
   *  giocatore ha bisogno di sapere della vista per muoversi coerentemente. */
  versoCamera() {
    const c = this.camera;
    return { x: c.target.x - c.position.x, z: c.target.z - c.position.z };
  }

  /** Il conto onesto del fotogramma: non gli fps, i millisecondi di lavoro. */
  get ms() { return this.motore.getDeltaTime(); }

  avvia(perFrame) {
    this.motore.runRenderLoop(() => {
      if (perFrame) perFrame(this.motore.getDeltaTime() / 1000);
      this.scena.render();
      // ⚠ IL CONTO DEI DISEGNI SI CAMPIONA QUI, DOPO AVER DISEGNATO, e si fa la
      // media da soli. Babylon una media ce l'ha («lastSecAverage») ma per
      // questo contatore resta a ZERO: non è alimentata, e me ne sono accorto
      // solo perché il pannello diceva «disegni 0» invece di un numero storto.
      // E la media serve davvero: da quando la mappa d'ombra si rifà ogni due
      // fotogrammi, il contatore ISTANTANEO esce 61 o 125 secondo su quale dei
      // due giri capita la lettura — cioè una moneta. Per un numero con cui si
      // diagnostica un telefono che non si può profilare, una moneta è peggio
      // di niente: la prima misura buona mi avrebbe fatto credere di aver
      // dimezzato le chiamate di disegno.
      if (this._strumento) {
        this._sommaDisegni += this._strumento.drawCallsCounter.current;
        if (++this._giriDisegni >= 60) {
          this._mediaDisegni = this._sommaDisegni / this._giriDisegni;
          this._sommaDisegni = 0; this._giriDisegni = 0;
        }
      }
    });
  }
}

/**
 * IL REGISTRO DELLE OMBRE PER L'OFFICINA.
 *
 * ⚠ SONO LE MANOPOLE CHE NON STANNO NEL PROFILO, perché sono quelle che si
 * TARANO guardando: bias, normal bias, lambda, filtro. Quello che si trova
 * buono qui va scritto nella tabella dei livelli (`qualita.js`), non lasciato
 * in un preset — un preset vive nel browser di chi l'ha fatto.
 */
export function registroOmbre(rig) {
  const mappa = () => rig.ombre && rig.ombre.getShadowMap();
  return {
    chiave: 'ombre', nome: 'Ombre',
    nota: 'Cascate del sole. La mappa si CONGELA da sola quando sole, camera e mondo stanno fermi '
      + '(tre fotogrammi con la stessa firma): «si rinnova» qui sotto dice se in questo istante è viva.',
    campi: [
      { chiave: 'autoZ', nome: 'profondità automatica (riduttore min/max)', tipo: 'interruttore',
        nota: 'una passata di profondità a schermo intero IN PIÙ a ogni giro, anche a mappa congelata: misurato 130 → 70 disegni spegnendola',
        leggi: () => !!rig.ombre.autoCalcDepthBounds, scrivi: (v) => (rig.ombre.autoCalcDepthBounds = v) },
      { chiave: 'filtro', nome: 'filtro', tipo: 'scelta',
        scelte: [{ v: CascadedShadowGenerator.QUALITY_HIGH, nome: 'alto' },
                 { v: CascadedShadowGenerator.QUALITY_MEDIUM, nome: 'medio' },
                 { v: CascadedShadowGenerator.QUALITY_LOW, nome: 'basso' }],
        leggi: () => rig.ombre.filteringQuality, scrivi: (v) => (rig.ombre.filteringQuality = v) },
      { chiave: 'lambda', nome: 'lambda (riparto delle cascate)', tipo: 'numero', min: 0.5, max: 1, passo: 0.01,
        nota: 'vicino a 1 = tessitura densa dove si guarda',
        leggi: () => rig.ombre.lambda, scrivi: (v) => (rig.ombre.lambda = v) },
      { chiave: 'bias', nome: 'bias', tipo: 'numero', min: 0, max: 0.02, passo: 0.0005,
        leggi: () => rig.ombre.bias, scrivi: (v) => (rig.ombre.bias = v) },
      { chiave: 'normalBias', nome: 'normal bias', tipo: 'numero', min: 0, max: 0.05, passo: 0.001,
        nota: 'ALZARLO È LA CURA SBAGLIATA all\'acne: accende una lineetta sul bordo dell\'ombra (vedi CLAUDE.md)',
        leggi: () => rig.ombre.normalBias, scrivi: (v) => (rig.ombre.normalBias = v) },
      { chiave: 'stabili', nome: 'cascate stabilizzate', tipo: 'interruttore',
        leggi: () => !!rig.ombre.stabilizeCascades, scrivi: (v) => (rig.ombre.stabilizeCascades = v) },
      { chiave: 'viva', nome: 'la mappa si rinnova adesso', tipo: 'lettura',
        leggi: () => (mappa() ? (mappa().refreshRate === 0 ? 'no (congelata)' : `sì, ogni ${mappa().refreshRate}`) : '—') },
    ],
  };
}

/** IL REGISTRO DEL MOTORE: quello che si misura, non quello che si sceglie. */
export function registroMotore(rig) {
  const attr = () => { try { return rig.motore._gl.getContextAttributes(); } catch { return {}; } };
  return {
    chiave: 'motore', nome: 'Motore',
    campi: [
      { chiave: 'dprMax', nome: 'DPR massimo', tipo: 'numero', min: 1, max: 3, passo: 0.25,
        nota: 'la risoluzione vera = min(DPR del dispositivo, questo) × scala del profilo',
        leggi: () => rig.dprMax, scrivi: (v) => { rig.dprMax = v; rig.applicaScala(rig._scala); } },
      { chiave: 'picking', nome: 'picking di Babylon al tocco', tipo: 'interruttore',
        nota: 'il gioco cammina la griglia da sé: questo è lavoro doppio (e con l\'origine mobile il raggio è pure degenere)',
        leggi: () => !rig.scena.skipPointerDownPicking,
        scrivi: (v) => { rig.scena.skipPointerDownPicking = rig.scena.skipPointerUpPicking = !v; } },
      { chiave: 'attiveFerme', nome: 'mesh attive congelate', tipo: 'interruttore',
        nota: 'salta la selezione per frustum: serve SOLO a misurare quanto costa',
        leggi: () => !!rig.scena._activeMeshesFrozen,
        scrivi: (v) => (v ? rig.scena.freezeActiveMeshes() : rig.scena.unfreezeActiveMeshes()) },
      { chiave: 'scheda', nome: 'scheda', tipo: 'lettura', leggi: () => rig.scheda.nome },
      { chiave: 'reso', nome: 'risoluzione', tipo: 'lettura',
        leggi: () => `${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()}` },
      { chiave: 'mesh', nome: 'mesh (attive)', tipo: 'lettura',
        leggi: () => `${rig.scena.meshes.length} (${rig.scena.getActiveMeshes().length})` },
      { chiave: 'msaa', nome: 'MSAA (fisso all\'avvio)', tipo: 'lettura', leggi: () => (attr().antialias ? 'acceso' : 'spento') },
      { chiave: 'webgl', nome: 'WebGL', tipo: 'lettura', leggi: () => rig.motore.webGLVersion },
    ],
  };
}

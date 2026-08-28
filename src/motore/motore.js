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

    // ⚠ `antialias: true` QUI E NON PIÙ AVANTI. In Lantern l'MSAA era una
    // manopola che si poteva spegnere per sbaglio, e spegnendola «era tutto
    // seghettato» — un giorno intero per capirlo. Su Babylon l'antialiasing del
    // canvas si decide alla creazione del contesto: o c'è o si ricrea il motore.
    // Che è esattamente il posto giusto per una cosa che non si deve poter
    // perdere in silenzio.
    this.motore = new Engine(tela, true, {
      preserveDrawingBuffer: true,   // serve agli scatti di confronto
      stencil: false,
      antialias: true,
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

    this.scena = new Scene(this.motore);
    this.scena.clearColor = new Color4(CIELO.r, CIELO.g, CIELO.b, 1);

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
    this.distanzaResa = 150;
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

    // ---- LE OMBRE, che in Lantern erano 1.090 righe nostre -------------------
    // Tre sistemi scritti a mano (controluce, campoSole, marcia), una mappa
    // 2048² ricostruita 11 volte al secondo, 95.176 ricostruzioni in una
    // sessione e un picco da 3,8 ms. Qui sono quattro righe.
    this.ombre = new CascadedShadowGenerator(2048, this.sole);
    this.ombre.numCascades = 4;
    // ⚠ `lambda` VICINO A 1 = TESSITURA DENSA DOVE SI GUARDA. Spartisce le
    // cascate in modo logaritmico invece che lineare: la prima copre pochi metri
    // con tutti i suoi texel, l'ultima copre il resto. È la manopola che decide
    // se il bordo dell'ombra è netto o a scalini.
    this.ombre.lambda = 0.94;
    this.ombre.stabilizeCascades = true;    // il bordo non «striscia» camminando
    this.ombre.filteringQuality = CascadedShadowGenerator.QUALITY_HIGH;
    this.ombre.usePercentageCloserFiltering = true;
    // ⚠ NOVANTA E NON CENTOQUARANTA: la distanza d'ombra è il denominatore della
    // risoluzione. Ogni metro in più che si pretende di ombreggiare toglie texel
    // a quelli vicini — e l'ombra a novanta blocchi non la guarda nessuno,
    // mentre la scaletta a dieci la vedono tutti.
    this.ombre.shadowMaxZ = 90;
    this.ombre.depthClamp = true;
    this.ombre.autoCalcDepthBounds = true;

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
    this.fxaa = new FxaaPostProcess('fxaa', 1, this.camera);

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

  /** Un oggetto che proietta ombra. ⚠ È UN ELENCO, non «tutto meno qualcosa»:
   *  in Lantern la polarità sbagliata metteva in mappa farfalle, nuvole e
   *  pioggia, e se n'è accorto il committente guardando, non un errore. */
  proietta(mesh) { this.ombre.addShadowCaster(mesh, true); return mesh; }

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
    });
  }
}

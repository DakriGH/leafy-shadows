// LA FABBRICA — dove i dati grezzi del mondo diventano roba del motore.
//
// Il mesher riempie array di float e non sa cos'è una mesh; questo file lo sa e
// non sa cos'è un blocco. È l'unico punto di contatto fra le due metà, ed è
// tenuto piccolo apposta: finché sta sotto le duecento righe, cambiare motore
// resta un lavoro di un pomeriggio invece che di un mese.

import { Mesh } from '@babylonjs/core/Meshes/mesh.js';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData.js';
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer.js';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial.js';
import { Color3 } from '@babylonjs/core/Maths/math.color.js';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture.js';
import { RawTexture3D } from '@babylonjs/core/Materials/Textures/rawTexture3D.js';
import { Constants } from '@babylonjs/core/Engines/constants.js';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { Prato } from './prato.js';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.js';
import { Mesh as MeshCostanti } from '@babylonjs/core/Meshes/mesh.js';
import '@babylonjs/core/Meshes/Builders/capsuleBuilder.js';
import { CustomMaterial } from '@babylonjs/materials/custom/customMaterial.js';
import { applicaStilePiatto } from './stile.js';

// ⚠ ANCHE QUI GLI SHADER A MANO: con gli import profondi il sorgente del
// materiale standard non arriva da solo, e il primo disegno fallisce con
// «effect is not ready» invece di dare un errore in fase di caricamento.
import '@babylonjs/core/Shaders/default.vertex.js';
import '@babylonjs/core/Shaders/default.fragment.js';

export class Fabbrica {
  constructor(rig) {
    this.rig = rig;
    this.scena = rig.scena;
    /** Le mesh dei chunk, per rifare i livelli di LOD quando la distanza cambia. */
    this._chunkMesh = new Set();
    rig.osservaDistanza(() => this.applicaDistanza());

    // ---- IL MATERIALE DEL MONDO ---------------------------------------------
    // In Leafy-Lantern era 2.839 righe di shader iniettato a mano. Qui sono
    // sei righe, e la differenza non è la bravura: è che lì la luce la
    // calcolavamo noi e qui la calcola il motore.
    //
    // ⚠ SPECULARE A ZERO, o il diorama diventa plastica. È l'unica cosa che
    // va tolta di mano al materiale standard: i cubi di Leafy sono tinta
    // piatta, e un riflesso speculare su una faccia piatta si legge come
    // vernice lucida. Il colore arriva tutto dai VERTICI (`useVertexColor`),
    // esattamente come prima.
    // ⚠ IL COLORE È QUELLO DEI VERTICI, E BASTA. Il mesher ci ha già cotto
    // dentro lo stacco fra le facce (coloreFaccia sceglie cima/lato/fondo dalla
    // palette): è quello il volume, e un N·L sopra lo sporca. `baseColor.rgb`
    // nel fragment è esattamente quel colore.
    this.matMondo = applicaStilePiatto(new CustomMaterial('mondo', this.scena), rig, 'baseColor.rgb');
    this.matMondo.backFaceCulling = true;

    this.matAcqua = applicaStilePiatto(new CustomMaterial('acqua', this.scena), rig, 'baseColor.rgb');
    this.matAcqua.alpha = 0.72;
    this.matAcqua.backFaceCulling = false;

    this._conMappa = new Set();
    this._materiali = [this.matMondo, this.matAcqua];
  }

  // ── il ciclo di vita di un chunk ───────────────────────────────────────────

  /**
   * IL LOD DEI CHUNK, e lo fa Babylon.
   *
   * ⚠ UN LIVELLO DI LOD «NESSUNA MESH» È IL MODO DEL MOTORE per dire «oltre
   * questa distanza non disegnare»: `addLODLevel(d, null)`. Sta dentro la
   * selezione delle mesh attive, quindi non costa un giro nostro per fotogramma
   * e non c'è un secondo elenco da tenere allineato. Scriverlo a mano avrebbe
   * voluto dire ricalcolare distanze per cento chunk per fotogramma per ottenere
   * la stessa cosa, peggio.
   *
   * ⚠ E PER UN DIORAMA È QUESTO IL LOD, non una maglia più grossa. Un
   * terrazzamento è alto UN blocco: a centocinquanta blocchi è un decimo di
   * pixel, e un triangolo più piccolo del pixel non si «semplifica» — scompare e
   * riappare mentre la camera si muove. Non lo cura semplificare: lo cura non
   * disegnarlo, e nascondere il confine con la nebbia.
   *
   * ⚠ E SI TAGLIA OLTRE IL RAGGIO DEL CHUNK, non alla distanza di resa secca.
   * Babylon misura il LOD dal CENTRO della sfera di contenimento: un chunk il
   * cui centro sta a centocinquanta ha il bordo vicino a centotrenta, cioè
   * dentro la nebbia ma non ancora sparito — e sparire lì è un POP. Sommando il
   * raggio, quando un chunk viene tolto il suo punto più vicino è comunque
   * oltre la fine della nebbia, dove non si vede niente per costruzione.
   *
   * ⚠ E IL RAGGIO SI CHIEDE ALLA MESH, non si indovina: i chunk di Leafy non
   * sono cubi — sono sedici per sedici in pianta e alti quanto il terreno, che
   * sull'open world va da due a trenta blocchi. Un numero scritto a mano
   * sarebbe giusto per la pianura e sbagliato per la montagna.
   */
  _lod(mesh) {
    const bi = mesh.getBoundingInfo && mesh.getTotalVertices() > 0 ? mesh.getBoundingInfo() : null;
    const raggio = bi ? bi.boundingSphere.radiusWorld : 20;
    mesh.removeLODLevel(null);
    mesh.addLODLevel(this.rig.scena.fogEnd + raggio, null);
  }

  creaChunk(kc) {
    const solidi = new Mesh('solidi:' + kc, this.scena);
    const acqua = new Mesh('acqua:' + kc, this.scena);
    solidi.material = this.matMondo;
    acqua.material = this.matAcqua;
    // ⚠ LE GEOMETRIE SONO GIÀ IN COORDINATE MONDO e le mesh non si spostano
    // mai: congelare la matrice toglie un aggiornamento per chunk per
    // fotogramma. Con centinaia di chunk è lavoro di CPU che sparisce.
    solidi.freezeWorldMatrix();
    acqua.freezeWorldMatrix();
    acqua.alphaIndex = 2;               // il liquido va disegnato dopo i solidi
    acqua.isPickable = false;
    // ⚠ PROIETTARE E RICEVERE SONO DUE COSE, e la seconda è FALSA di fabbrica.
    // Col solo `addShadowCaster` la mappa si riempie, il costo si paga, e a
    // schermo non cambia NIENTE — il terreno con il sole a 17° non aveva una
    // sola ombra. Un difetto muto, che è la famiglia peggiore: nessun errore,
    // nessun avviso, solo un'immagine sbagliata che sembra giusta.
    solidi.receiveShadows = true;
    acqua.receiveShadows = true;
    this.rig.proietta(solidi);          // ⚠ elenco, non «tutto meno qualcosa»
    this._lod(solidi); this._lod(acqua);
    this._chunkMesh.add(solidi); this._chunkMesh.add(acqua);
    return { solidi, acqua };
  }

  /**
   * Carica i dati grezzi dentro una mesh.
   *
   * ⚠ QUI NASCONO LE NORMALI, e in Leafy-Lantern non esistevano affatto: il
   * mondo era unlit, il colore stava tutto nel vertice e una normale non
   * serviva a niente. Con la luce del motore servono, e vanno FACCIA PER
   * FACCIA — se fossero mediate fra i triangoli vicini gli spigoli dei cubi si
   * arrotonderebbero e il diorama diventerebbe una collina di plastilina.
   *
   * Vengono piatte GRATIS perché il mesher non condivide i vertici: ogni
   * triangolo ha i suoi tre, quindi ognuno riceve la normale del suo triangolo
   * e nessuno media niente. È una proprietà che avevamo già e non sapevamo di
   * avere — l'unica ragione per cui questa funzione sta in dieci righe.
   */
  scrivi(mesh, dati) {
    const n = dati.pos.length / 3;
    if (n === 0) { mesh.setEnabled(false); return; }
    const vd = new VertexData();
    vd.positions = dati.pos;
    vd.colors = _aRgba(dati.col);
    // ⚠ E L'AVVOLGIMENTO SI GIRA QUI, UNA VOLTA SOLA. Il mesher scrive i
    // triangoli in senso antiorario, che è la convenzione di three; Babylon li
    // vuole nell'altro verso e li considerava tutti «di dietro». Due sintomi
    // che sembravano due difetti diversi, e sono lo stesso:
    //   · il culling buttava OGNI faccia e si vedevano gli INTERNI del terreno
    //     (una distesa grigia con le terrazze viste da sotto);
    //   · `ComputeNormals` ricava la normale dall'avvolgimento, quindi usciva
    //     puntata all'ingiù e la luce non prendeva niente — tutto scuro.
    // Girare i due indici finali di ogni triangolo li cura tutt'e due, e lo fa
    // nel posto giusto: il mondo continua a pensare destrorso come ha sempre
    // fatto, e la conversione vive nell'unico file che conosce il motore.
    // ⚠ Non basta `scene.useRightHandedSystem`: quello raddrizza le matrici e
    // la camera, non il verso con cui si legge un triangolo. Provato.
    const idx = new Uint32Array(n);
    for (let i = 0; i < n; i += 3) { idx[i] = i; idx[i + 1] = i + 2; idx[i + 2] = i + 1; }
    vd.indices = idx;
    const nor = new Float32Array(n * 3);
    VertexData.ComputeNormals(vd.positions, vd.indices, nor);
    vd.normals = nor;
    vd.applyToMesh(mesh, true);         // `true` = aggiornabile: serve alla ritinta stagionale
    mesh.setEnabled(true);
    // ⚠ IL LOD SI RIFÀ QUI E NON SOLO ALLA CREAZIONE: la sua soglia dipende dal
    // RAGGIO della mesh, e alla creazione la mesh è vuota — il raggio sarebbe
    // quello di ripiego. Rifacendolo a ogni scrittura la soglia segue anche i
    // chunk che cambiano forma, cioè quelli in cui si sta scavando.
    this._lod(mesh);
  }

  /** La distanza di resa è cambiata: si rifanno i livelli di LOD. */
  applicaDistanza() { for (const m of this._chunkMesh) this._lod(m); }

  rimuoviChunk(e) {
    this.rig.ombre.removeShadowCaster(e.solidi, true);
    // ⚠ E VIA ANCHE DALL'ELENCO DEL LOD, se no la Set trattiene mesh distrutte:
    // una perdita che non dà nessun sintomo finché non si conta la memoria.
    this._chunkMesh.delete(e.solidi); this._chunkMesh.delete(e.acqua);
    e.solidi.dispose(false, false);
    e.acqua.dispose(false, false);
  }

  cambiaMateriale(mesh, m) { mesh.material = m; }

  // ── la ritinta stagionale scrive dentro il buffer dei colori ───────────────
  // ⚠ IL BUFFER È RGBA, il mesher pensa in RGB. La conversione sta QUI e non
  // nel mondo: è una faccenda del motore, e infilarla nel mesher vorrebbe dire
  // che il mesher sa com'è fatto un vertex buffer di Babylon.
  colori(mesh) {
    const a = mesh.getVerticesData(VertexBuffer.ColorKind);
    if (!a) return null;
    if (!mesh._rgbPonte || mesh._rgbPonte.length * 4 !== a.length * 3) {
      mesh._rgbPonte = new Float32Array(a.length / 4 * 3);
    }
    const p = mesh._rgbPonte;
    for (let i = 0, j = 0; i < a.length; i += 4, j += 3) { p[j] = a[i]; p[j + 1] = a[i + 1]; p[j + 2] = a[i + 2]; }
    return p;
  }

  coloriCambiati(mesh) {
    const p = mesh._rgbPonte;
    if (!p) return;
    mesh.updateVerticesData(VertexBuffer.ColorKind, _aRgba(p), false, false);
  }

  // ── i nomi che il mondo si aspetta ────────────────────────────────────────
  materialeMondo() { return this.matMondo; }
  materialeAcqua() { return this.matAcqua; }

  // ⚠ QUESTI QUATTRO SONO VUOTI, ED È IL PUNTO DELLA MIGRAZIONE. Erano la luce
  // a voxel di Leafy-Lantern: una griglia 3D di occlusione ricalcolata a fette,
  // 473 righe di `campoSole.js` più il cammino per frammento. Adesso la stessa
  // domanda («questo punto vede il sole?») la risponde la mappa a cascata del
  // motore, e questi non hanno più niente da fare. Restano come funzioni perché
  // il mesher li chiama — toglierli è un lavoro da fare nel mondo, non qui, e
  // si fa quando avremo verificato che nulla ne senta la mancanza.
  aggiornaCielo(_colonne) {}

  // ── la griglia dei muri, per le ombre delle lampade ───────────────────────
  //
  // ⚠ TUTTA LA MACCHINA ERA GIÀ QUI e non lo sapevo: `world/luce.js` costruisce
  // la griglia, `world/mesher.js` la ricostruisce quando il mondo cambia e
  // chiama questi tre metodi. Erano stub vuoti dalla migrazione — cioè il
  // sistema c'era, girava, e buttava via il risultato. Il difetto si vedeva
  // solo di notte, come pozze di lampione che passano attraverso l'isola.
  //
  // ⚠ IL LAYOUT È UN CONTRATTO scritto in `world/luce.js`: l'array è ordinato
  // (z, y, x), quindi la texture è larga `profondita`, alta `altezza` e fonda
  // `larghezza`. Scambiarne due dà una griglia che sembra funzionare e proietta
  // ombre nel posto sbagliato — il tipo di difetto che si insegue per ore.
  impostaVoxel(solidi, scatola, cima) {
    const { minX, minY, minZ, larghezza, altezza, profondita } = scatola;
    const v = this.rig.voxel;
    if (!v.texture || v.larghezza !== larghezza || v.altezza !== altezza || v.profondita !== profondita) {
      if (v.texture) v.texture.dispose();
      // ⚠ NEAREST E NIENTE MIPMAP: si legge con `texelFetch`, che è
      // indirizzamento intero. Un filtro qui mescolerebbe celle vicine, cioè
      // renderebbe i muri semitrasparenti a caso lungo i bordi.
      v.texture = new RawTexture3D(solidi, profondita, altezza, larghezza,
        Constants.TEXTUREFORMAT_R, this.scena, false, false,
        Texture.NEAREST_SAMPLINGMODE, Constants.TEXTURETYPE_UNSIGNED_BYTE);
      v.texture.wrapU = v.texture.wrapV = v.texture.wrapR = Texture.CLAMP_ADDRESSMODE;
      v.larghezza = larghezza; v.altezza = altezza; v.profondita = profondita;
    } else {
      v.texture.update(solidi);
    }
    v.minX = minX; v.minY = minY; v.minZ = minZ;
    // la cima è l'acceleratore del sole in Lantern; qui il sole ha la sua mappa
    // a cascata e non cammina niente, quindi si tiene solo per il pannello
    v.cima = Number.isFinite(cima) ? cima : minY + altezza;
    v.attiva = true;
  }

  /** Niente griglia: le sfere tornano ad attraversare i muri. È il ripiego
   *  ONESTO — mondo vuoto, scheda che non regge il lato, interruttore spento. */
  spegniVoxel() { this.rig.voxel.attiva = false; }

  /**
   * IL LATO MASSIMO DI UNA TEXTURE 3D, l'unico limite di tutto il sistema.
   * ⚠ SI CHIEDE ALLA SCHEDA, non si indovina: il minimo GARANTITO da WebGL2 è
   * 256, le schede vere danno 2048, e un mondo più largo del limite darebbe una
   * texture che non si crea — cioè niente ombre, in silenzio. Chiedendolo, il
   * mesher se ne accorge da solo e stacca la griglia invece di rompersi.
   */
  latoMassimoVoxel() {
    if (this._latoVox === undefined) {
      const gl = this.rig.motore._gl;
      this._latoVox = (gl && gl.MAX_3D_TEXTURE_SIZE) ? gl.getParameter(gl.MAX_3D_TEXTURE_SIZE) : 256;
    }
    return this._latoVox;
  }
  mondoVelato() { return false; }

  // ── il segnaposto del giocatore ───────────────────────────────────────────
  // ⚠ È UN SEGNAPOSTO, e va detto: il gatto di Leafy è geometria costruita a
  // codice (testa, orecchie, coda) e va rifatta, non ricopiata. Finché non c'è,
  // serve qualcosa che dica DOVE si è — camminare in un mondo senza vedersi è
  // il modo migliore per non accorgersi che la fisica è sbagliata.
  segnaposto() {
    const m = MeshBuilder.CreateCapsule('corpo', { height: 0.9, radius: 0.28, tessellation: 8 }, this.scena);
    m.material = applicaStilePiatto(new CustomMaterial('corpo', this.scena), this.rig, undefined, { facce: false });
    m.material.diffuseColor = new Color3(0.22, 0.55, 0.86);
    m.isPickable = false;
    m.receiveShadows = true;
    this.rig.proietta(m);
    return m;
  }
  muoviSegnaposto(m, p) {
    m.position.set(p.x, p.y + 0.45, p.z);
    m.rotation.y = p.verso;
  }

  // ── gli aloni delle lampade ───────────────────────────────────────────────
  /**
   * DUE GUSCI CONCENTRICI ADDITIVI, ed è la ricetta di Leafy-Lantern presa
   * numero per numero — raggi 0,42 e 0,85, opacità 0,16 e 0,06.
   *
   * ⚠ «VELATURE, NON PALLE», che è testuale dal codice di Lantern e segnato lì
   * come «richiesta esplicita dell'utente». Il guscio grande deve essere quasi
   * invisibile: è quello che dà il CORPO all'alone senza che si legga come una
   * sfera di vetro appesa al palo. Alzare quelle opacità è il modo di
   * riottenere la palla che era stata bocciata.
   *
   * ⚠ IMMUNI ALLA NEBBIA (`applyFog = false`): una luce vista da lontano deve
   * restare un punto luminoso, non sbiadire nel grigio. In Lantern è `fog:
   * false` sul materiale, per la stessa ragione.
   *
   * ⚠ E NON SCRIVONO LA PROFONDITÀ: sono trasparenti additivi, e scrivendola si
   * cancellerebbero a vicenda a seconda dell'ordine di disegno — due sfere
   * concentriche sono il caso peggiore possibile per quel difetto.
   *
   * ⚠ A ISTANZE SOTTILI: una città di lampioni sono due mesh in tutto invece di
   * due per lampione. Spegnerne uno vuol dire mandare la sua matrice a scala
   * zero, che è il modo giusto qui — una mesh in meno non si può «nascondere»
   * dentro un buffer di istanze.
   */
  aloni(quanti) {
    const gusci = [
      // ⚠ LE OPACITÀ SONO QUELLE DELLA PRIMA VERSIONE DI LANTERN (commit
      // 7510d19): 0,5 e 0,2. Avevo copiato quelle di OGGI — 0,16 e 0,06 — che
      // laggiù vanno bene perché c'è anche mille altro acceso, e qui davano due
      // velature quasi invisibili.
      // ⚠ E I RAGGI SONO PIÙ GRANDI DEI SUOI (0,24 e 0,46): là l'alone sta su
      // una lanterna in mano, qui sulla testa di un lampione alto tre metri, e
      // alla stessa misura si perdeva dentro il modello. Il rapporto fra i due
      // gusci resta più di due, che è quello che li fa leggere come due anelli
      // invece che come una macchia sola.
      // ⚠ E IL GUSCIO ESTERNO VA PIÙ CALDO DEL SUO, non più chiaro: additivo su
      // un cielo notturno bluastro, un colore poco saturo alza tutti e tre i
      // canali e il risultato si legge GRIGIO — che è il residuo di «solo
      // bianche» dopo aver tolto il doppio lato. Scendendo di verde e di blu il
      // canale rosso resta l'unico a saturare, e quando satura satura CALDO.
      { r: 0.58, colore: new Color3(1.0, 0.860, 0.58), alfa: 0.46 },
      { r: 1.30, colore: new Color3(1.0, 0.700, 0.28), alfa: 0.16 },
    ];
    const mesh = gusci.map((g, i) => {
      // ⚠ SFERA INVERTITA — l'idea è del committente: «potresti fare inverted
      // sphere per questi aloni, così il lampione spicca». Ed è giusta.
      //
      // Con una sfera normale l'alone si disegna DAVANTI alla lampada e la
      // annega: il palo e la testa spariscono dentro la luce, che è il difetto
      // del «troppo forte». Girando l'avvolgimento (`BACKSIDE`) si vede solo la
      // METÀ LONTANA del guscio; la prova di profondità fa il resto, perché la
      // testa del lampione le sta davanti e la occlude. Risultato: la luce
      // circonda l'oggetto invece di coprirlo, e la sagoma resta netta.
      //
      // ⚠ E COSTA LA METÀ, come effetto collaterale gradito: si disegna un
      // emisfero invece di due, che è la stessa ragione per cui il culling
      // aveva già tolto la saturazione a bianco.
      const m = MeshBuilder.CreateSphere('alone' + i,
        { diameter: g.r * 2, segments: 12, sideOrientation: MeshCostanti.BACKSIDE }, this.scena);
      const mat = new StandardMaterial('alone' + i, this.scena);
      mat.disableLighting = true;
      mat.emissiveColor = g.colore;
      mat.diffuseColor = Color3.Black();
      mat.specularColor = Color3.Black();
      mat.alpha = g.alfa;
      mat.alphaMode = 1;                 // ALPHA_ADD: si somma, non copre
      // ⚠ SOLO LE FACCE DAVANTI, ED È LA CURA AL BIANCO. Con le facce di dietro
      // accese ogni pixel dentro la sagoma riceve la sfera DUE VOLTE — davanti e
      // dietro — e un additivo raddoppiato satura. Misurato: senza culling il
      // centro dell'alone usciva (255, 255, 254), cioè bianco puro; con il
      // culling (194, 176, 153), che è caldo. Committente: «le sfere sopra i
      // lampioni sono solo bianche e troppo forti».
      // Lantern usa un MeshBasicMaterial senza toccare `side`, cioè solo fronte:
      // avevo aggiunto io il doppio lato pensando che «una sfera vuota si veda
      // meglio da dentro», e per un additivo è esattamente il contrario.
      mat.backFaceCulling = true;
      mat.disableDepthWrite = true;
      mat.applyFog = false;
      m.material = mat;
      m.isPickable = false;
      m.receiveShadows = false;
      m.alphaIndex = 3;                  // dopo il mondo e dopo l'acqua
      // ⚠ SEMPRE ATTIVA, E QUESTO È IL DIFETTO PER CUI GLI ALONI SPARIVANO.
      // Una mesh a istanze sottili tiene la scatola di contenimento della
      // GEOMETRIA DI BASE — misurata: [-0,42 … +0,42] attorno all'ORIGINE del
      // mondo — non delle sue istanze. Babylon la cullava appena l'origine
      // usciva dall'inquadratura, e tutti gli aloni sparivano insieme, ovunque
      // fossero. Committente: «perché la sfera del lampione sparisce?».
      // ⚠ E NON SI CURA RICALCOLANDO LA SCATOLA: i lampioni stanno sparsi per
      // tutto il mondo, quindi la scatola vera coprirebbe tutto e il culling
      // non taglierebbe mai niente. Due mesh sempre attive costano meno del
      // conto per decidere di tenerle.
      m.alwaysSelectAsActiveMesh = true;
      // ⚠ LA MATRICE È OBBLIGATORIA anche qui: `thinInstanceCount` si tara su
      // `matrixData.length / 16`. Si alloca una volta e si muta.
      m.thinInstanceSetBuffer('matrix', new Float32Array(quanti * 16), 16, false);
      return m;
    });
    return { mesh, quanti };
  }

  /**
   * Mette gli aloni dove stanno le lampade accese.
   * ⚠ SPENTO = SCALA ZERO, non «saltato»: le istanze sottili non hanno buchi,
   * quindi un alone spento è un alone grande zero. Costa lo stesso disegnarlo
   * (è un vertice degenere) e costa molto meno che riscrivere il buffer.
   */
  muoviAloni(a, punti) {
    const n = Math.min(punti.length, a.quanti);
    for (const m of a.mesh) {
      const buf = m._thinInstanceDataStorage.matrixData;
      for (let i = 0; i < a.quanti; i++) {
        const o = i * 16;
        const p = i < n ? punti[i] : null;
        const s = p && p.acceso ? 1 : 0;
        buf[o] = s; buf[o + 1] = 0; buf[o + 2] = 0; buf[o + 3] = 0;
        buf[o + 4] = 0; buf[o + 5] = s; buf[o + 6] = 0; buf[o + 7] = 0;
        buf[o + 8] = 0; buf[o + 9] = 0; buf[o + 10] = s; buf[o + 11] = 0;
        buf[o + 12] = p ? p.x : 0; buf[o + 13] = p ? p.y : 0; buf[o + 14] = p ? p.z : 0; buf[o + 15] = 1;
      }
      m.thinInstanceCount = a.quanti;
      // ⚠ QUI L'AGGIORNAMENTO INTERO VA BENE, ed è l'eccezione: il tetto è il
      // numero di lampioni, una dozzina, non mezzo milione come per l'erba.
      // La variante parziale costerebbe più codice che byte risparmiati.
      m.thinInstanceBufferUpdated('matrix');
    }
  }

  // ── il mirino ─────────────────────────────────────────────────────────────
  /**
   * IL CUBO DI SELEZIONE: dove sto per rompere o posare.
   *
   * ⚠ SERVE, E NON È UN ORPELLO. Senza, costruire in un mondo a blocchi è un
   * tiro a indovinare: si clicca, esce un cubo in un posto che non è quello che
   * si guardava, e non si capisce se ha sbagliato la mira o il conto. Con il
   * mirino, l'errore si vede PRIMA del clic.
   *
   * ⚠ FUORI DALLE OMBRE E FUORI DALLA LUCE, tutte e due volute: in mappa
   * proietterebbe l'ombra di un cubo che non esiste, e illuminato cambierebbe
   * colore col sole proprio mentre il suo mestiere è restare leggibile a
   * qualunque ora. `disableLighting` + `emissiveColor` è il modo di Babylon per
   * dire «questo colore, e basta».
   */
  mirino() {
    // ⚠ UN FILO PIÙ GRANDE DEL BLOCCO: a misura esatta le facce coincidono con
    // quelle del cubo sotto e il filo si vede a tratti, mangiato dal z-fighting.
    const m = MeshBuilder.CreateBox('mirino', { size: 1.006 }, this.scena);
    const mat = new StandardMaterial('mirino', this.scena);
    mat.wireframe = true;
    mat.disableLighting = true;
    mat.emissiveColor = new Color3(1, 1, 1);
    mat.diffuseColor = Color3.Black();
    mat.specularColor = Color3.Black();
    m.material = mat;
    m.isPickable = false;
    m.receiveShadows = false;
    m.setEnabled(false);
    return m;
  }

  /**
   * L'ANTEPREMA DI POSA — il blocco che comparirà, mostrato prima di cliccare.
   *
   * ⚠ MANCAVA, e senza si costruisce a indovinare: il mirino dice QUALE cella,
   * ma non che faccia avrà il blocco lì dentro. E in Leafy la faccia cambia
   * davvero — un blocco d'erba ha il cappello, l'acqua ha un livello, le forme
   * speciali hanno la loro sagoma. Committente: «manca anche la preview di
   * posizionamento».
   *
   * ⚠ LA GEOMETRIA LA DÀ IL MESHER (`geometriaSingola`), che è l'unico che sa
   * come si costruisce un blocco. Il commento lì diceva già «per il ghost di
   * anteprima» — era scritta per questo e non l'aveva mai chiamata nessuno.
   *
   * ⚠ E NON È NELLE OMBRE NÉ NELLA LUCE: un blocco che non esiste ancora non
   * deve proiettare niente, e deve restare leggibile a qualunque ora.
   */
  anteprima() {
    const m = new Mesh('anteprima', this.scena);
    const mat = new StandardMaterial('anteprima', this.scena);
    mat.disableLighting = true;
    mat.diffuseColor = Color3.Black();
    mat.specularColor = Color3.Black();
    mat.emissiveColor = new Color3(1, 1, 1);
    mat.alpha = 0.45;
    mat.disableDepthWrite = true;
    mat.backFaceCulling = false;
    mat.applyFog = false;
    m.material = mat;
    // ⚠ I COLORI DEI VERTICI SI ACCENDONO SULLA MESH, NON SUL MATERIALE, ed è
    // il genere di dettaglio che fa uscire un'anteprima bianca senza un errore.
    // In Babylon `useVertexColors` sta su AbstractMesh (vale già true di
    // fabbrica, ma scriverlo dice che ci contiamo): è la mesh a dichiarare di
    // avere quel buffer, e da lì il materiale riceve il `#define VERTEXCOLOR`.
    // Senza colori dei vertici l'anteprima sarebbe un cubo bianco generico,
    // mentre serve che un blocco d'erba si veda verde col suo cappello chiaro.
    m.useVertexColors = true;
    m.isPickable = false;
    m.receiveShadows = false;
    m.alphaIndex = 4;
    m.setEnabled(false);
    return m;
  }

  /** Carica nell'anteprima la forma di questo tipo di blocco, e la mette lì. */
  muoviAnteprima(m, dati, cella) {
    if (!cella || !dati) { if (m.isEnabled()) m.setEnabled(false); return; }
    if (m._tipo !== dati.tipo) {
      m._tipo = dati.tipo;
      const vd = new VertexData();
      vd.positions = dati.pos;
      vd.colors = dati.col;
      const n = dati.pos.length / 3;
      const idx = new Uint32Array(n);
      // ⚠ STESSO GIRO DEI TRIANGOLI DEL MONDO: il mesher scrive antiorario, e
      // qui vale la stessa regola — se no l'anteprima si vede solo da dentro.
      for (let i = 0; i < n; i += 3) { idx[i] = i; idx[i + 1] = i + 2; idx[i + 2] = i + 1; }
      vd.indices = idx;
      vd.applyToMesh(m, true);
    }
    if (!m.isEnabled()) m.setEnabled(true);
    // ⚠ MEZZA CELLA, E NON È UN AGGIUSTAMENTO A OCCHIO: il mesher costruisce
    // ogni blocco CENTRATO sul centro della cella (`const cx = x + 0.5` nel suo
    // ciclo), mentre `geometriaSingola` lo costruisce centrato sull'origine.
    // Mettendo la mesh sull'angolo della cella l'anteprima usciva spostata di
    // mezzo blocco su tutti e tre gli assi — il committente l'ha vista come
    // «sfasata di 0.5 in diagonale», che è esattamente la diagonale del cubetto.
    m.position.set(cella[0] + 0.5, cella[1] + 0.5, cella[2] + 0.5);
  }

  /** Sposta il mirino su una cella, o lo spegne se non c'è bersaglio. */
  muoviMirino(m, cella, colore) {
    if (!cella) { if (m.isEnabled()) m.setEnabled(false); return; }
    if (!m.isEnabled()) m.setEnabled(true);
    m.position.set(cella[0] + 0.5, cella[1] + 0.5, cella[2] + 0.5);
    if (colore) m.material.emissiveColor.set(colore[0], colore[1], colore[2]);
  }

  // ⚠ LE LAMPADE NON HANNO BISOGNO DI ESSERE «AGGIORNATE»: ogni materiale se le
  // rilegge da `rig.luci` a ogni disegno (vedi `stile.js`). Accendere una
  // lampada è scrivere in quell'oggetto, e basta.

  // ── il prato ──────────────────────────────────────────────────────────────
  creaPrato(max) { const p = new Prato(this.scena, this.rig, max); this._materiali.push(p.materiale); return p; }
  scriviPrato(prato, n, erba) { prato.scrivi(n, erba); }
  animaPrato(prato, erba) { prato.anima(erba); }
  mostraPrato(prato, on) { prato.mostra(on); }

  // ── texture (serve alle stagioni sul fogliame dei modelli) ────────────────
  texturaDaCanvas(canvas) {
    const t = new Texture(canvas.toDataURL(), this.scena, true, false, Texture.NEAREST_SAMPLINGMODE);
    return t;
  }
  materialiConMappa() { return this._conMappa; }
  cambiaMappa(m, tex) { if (m.diffuseTexture !== tex) m.diffuseTexture = tex; }
}

/** RGB → RGBA con alfa a 1. Babylon vuole quattro canali nel buffer dei colori. */
function _aRgba(rgb) {
  const n = rgb.length / 3;
  const out = new Float32Array(n * 4);
  for (let i = 0, j = 0; i < n; i++, j += 3) {
    const o = i * 4;
    out[o] = rgb[j]; out[o + 1] = rgb[j + 1]; out[o + 2] = rgb[j + 2]; out[o + 3] = 1;
  }
  return out;
}

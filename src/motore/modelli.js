// I MODELLI — alberi, lampioni, panchine. Caricati in glTF, disegnati a istanze.
//
// ⚠ IL FORMATO È CAMBIATO, E NON È UN DETTAGLIO. In Leafy-Lantern i modelli si
// caricavano in **FBX a runtime**, con FBXLoader: un formato di scambio pensato
// per gli editor, che il gioco riconvertiva a ogni avvio, su ogni dispositivo.
// Babylon l'FBX non lo legge, e ha ragione a non leggerlo. Qui si converte una
// volta sola, fuori dal gioco (`npm run modelli`), e il gioco riceve roba già
// pronta per la GPU: l'albero è passato da un pezzo di 3,4 MB a **52 KB**.
//
// ⚠ E SI DISEGNANO A THIN INSTANCE, come l'erba. Quarantotto alberi sono
// quarantotto chiamate di disegno se si clonano, una sola se si istanziano — e
// il bosco di Leafy, quando ci sarà tutto, di alberi ne ha centinaia.

import { LoadAssetContainerAsync } from '@babylonjs/core/Loading/sceneLoader.js';
import { VertexBuffer } from '@babylonjs/core/Buffers/buffer.js';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { CustomMaterial } from '@babylonjs/materials/custom/customMaterial.js';
import { applicaStilePiatto } from './stile.js';
import '@babylonjs/loaders/glTF/2.0/glTFLoader.js';
import '@babylonjs/core/Meshes/thinInstanceMesh.js';

/** Dove stanno i .glb. Relativo alla pagina, così vale anche pubblicato. */
const CARTELLA = './modelli/';

export class Modelli {
  constructor(scena, rig, fabbrica = null) {
    // ⚠ SERVE LA FABBRICA, e solo per le stagioni: è lei a tenere l'elenco dei
    // materiali che hanno una mappa da ritingere (`materialiConMappa`), che è
    // il canale da cui `world/stagioni.js` fa passare il fogliame d'autunno.
    // Senza, l'elenco resta vuoto e la ritinta gira a vuoto — che è esattamente
    // com'era: alberi verdi sotto la neve.
    this.fabbrica = fabbrica;
    this.scena = scena;
    this.rig = rig;
    this._caricati = new Map();   // nome → { mesh, matrici, n }
  }

  /**
   * Carica un .glb e ne prepara la mesh per le istanze.
   *
   * ⚠ SI FONDONO IN UNA MESH SOLA. Un glTF arriva come un albero di nodi — il
   * tronco, la chioma, magari un vuoto di raggruppamento — e istanziare un
   * albero di nodi vuol dire istanziarne ogni foglia separatamente. Fondere
   * PRIMA e istanziare DOPO tiene il conto delle chiamate di disegno a uno per
   * TIPO di modello, non per pezzo.
   */
  async carica(nome, { scala = 1, schiarisci = 1.6, proietta = true } = {}) {
    if (this._caricati.has(nome)) return this._caricati.get(nome);
    const cont = await LoadAssetContainerAsync(`${CARTELLA}${nome}.glb`, this.scena);
    const pezzi = cont.meshes.filter((m) => m.getTotalVertices() > 0);
    if (!pezzi.length) throw new Error(`${nome}.glb non ha geometria`);

    // ⚠ LA TEXTURE SI PRENDE PRIMA DI FONDERE, e il materiale si fonde in UNO.
    // Fondendo con `multiMaterials: true` esce un MultiMaterial, che di texture
    // non ne ha nessuna — e il risultato erano quarantotto alberi BIANCHI, con
    // la texture perfettamente presente dentro il .glb. Qui i pezzi condividono
    // tutti lo stesso materiale (è un albero, non un veicolo), quindi si fonde a
    // materiale singolo. E si legge `albedoTexture`: il glTF arriva come PBR.
    const origine = pezzi[0].material;
    const tex = origine && (origine.albedoTexture || origine.diffuseTexture) || null;
    const { Mesh } = await import('@babylonjs/core/Meshes/mesh.js');
    const fuso = Mesh.MergeMeshes(pezzi, true, true, undefined, false, false)
      || pezzi[0];
    fuso.name = nome;
    if (scala !== 1) fuso.scaling.setAll(scala);
    fuso.bakeCurrentTransformIntoVertices();

    // ⚠ L'ORIGINE DEL MODELLO NON STA SUI PIEDI, e il .glb non ha nessun
    // obbligo di metterla lì: chi l'ha modellato l'ha lasciata dove gli
    // comodava. Piazzando alla quota del terreno gli alberi risultavano
    // AFFONDATI o SOSPESI a seconda del modello — «gli alberi sono volanti».
    // Qui si misura il riquadro una volta e si sposta la geometria in modo che
    // y=0 sia la base. Da lì in poi chi piazza ragiona in quote di mondo e non
    // deve sapere niente di come è stato esportato il file.
    // ⚠ SI SPOSTANO I VERTICI, NON LA MESH. Passare da `position` +
    // `bakeCurrentTransformIntoVertices` sembrava equivalente e non lo è: la
    // mesh viene poi disegnata a ISTANZE, e la sua matrice locale non ha più
    // voce in capitolo — restava un offset che nessuno applicava, e gli alberi
    // fluttuavano. Qui si guarda l'array delle posizioni, si trova il minimo, e
    // lo si sottrae. Dopo, y=0 È la base, e chi piazza ragiona in quote di mondo.
    //
    // (Il .glb dell'albero ha un nodo con traslazione y = 1,275 dentro: l'origine
    // di un modello non sta sui piedi, e non ha nessun obbligo di starci.)
    const vp = fuso.getVerticesData(VertexBuffer.PositionKind);
    let giu = Infinity;
    for (let i = 1; i < vp.length; i += 3) if (vp[i] < giu) giu = vp[i];
    if (isFinite(giu) && Math.abs(giu) > 1e-4) {
      for (let i = 1; i < vp.length; i += 3) vp[i] -= giu;
      fuso.updateVerticesData(VertexBuffer.PositionKind, vp);
    }
    fuso.refreshBoundingInfo();

    // ⚠ LO STESSO STILE DEL MONDO. Un albero illuminato con la legge del motore
    // accanto a un terreno illuminato con la nostra è il difetto che in Leafy
    // si vede subito: due leggi diverse per la stessa luce. Il colore piatto qui
    // è quello del modello (texture o colori di vertice) — se il glTF non ne ha,
    // resta il diffuso del materiale.
    const m = applicaStilePiatto(new CustomMaterial(`mat:${nome}`, this.scena), this.rig, 'baseColor.rgb', { facce: false, schiarisci });
    m.backFaceCulling = false;   // le chiome sono piani incrociati
    if (tex) {
      m.diffuseTexture = tex;
      tex.hasAlpha = true;
      this._registraPerStagioni(m, tex);
      // ⚠ RITAGLIO, NON TRASPARENZA. Le chiome sono piani incrociati con
      // l'alfa nella texture: con la trasparenza vera andrebbero ORDINATE per
      // profondità (e fra loro non c'è un ordine giusto), e nella mappa d'ombra
      // sparirebbero del tutto. Col ritaglio il pixel c'è o non c'è, il che è
      // anche esattamente lo stile di Leafy: nessuna sfumatura.
      m.transparencyMode = 1;   // MATERIAL_ALPHATEST
      m.useAlphaFromDiffuseTexture = true;
      // ⚠ E NIENTE FILTRO SULLA TEXTURE: i modelli sono a pixel grossi, e
      // l'interpolazione bilineare li impasta. È la stessa scelta di Lantern.
      const { Texture } = await import('@babylonjs/core/Materials/Textures/texture.js');
      tex.updateSamplingMode(Texture.NEAREST_SAMPLINGMODE);
    }
    fuso.material = m;

    fuso.isPickable = false;
    // ⚠ UN ALBERO PROIETTA MA NON RICEVE, ed è una scelta di stile. Una chioma è
    // una pila di coni: se riceve la propria ombra, i piani bassi finiscono al
    // buio e l'albero esce mezzo nero — «il colore degli alberi è fuoristile».
    // In Leafy il fogliame è tinta piatta e l'ombra la proietta soltanto. Il
    // prezzo è che un albero dentro l'ombra di un altro non si scurisce: si vede
    // pochissimo, e costa molto meno di un bosco a chiazze scure.
    fuso.receiveShadows = false;
    // ⚠ NON TUTTO DEVE PROIETTARE, e chi decide è la tabella delle decorazioni.
    // Committente: «i ciuffi d'erba e i LOD in generale non devono fare ombre,
    // per alleggerire». Ed è giusto due volte: un ciuffo alto nove decimi
    // proietta un'ombra che nessuno guarda, e ogni proiettante è geometria in
    // PIÙ disegnata in ogni cascata della mappa — su mobile due volte, su
    // desktop quattro. È la stessa ragione per cui il prato non proietta.
    if (proietta) this.rig.proietta(fuso);
    fuso.setEnabled(false);              // finché non ha istanze non si disegna

    const voce = { mesh: fuso, matrici: null, n: 0 };
    this._caricati.set(nome, voce);
    return voce;
  }

  /**
   * PREPARA UN MATERIALE ALLA RITINTA STAGIONALE.
   *
   * ⚠ IL RIMAPPAGGIO VIVE IN `world/stagioni.js` E NON QUI, ed è giusto: è
   * matematica su HSL e vale su qualunque motore. Ma vuole una IMMAGINE da cui
   * partire, e una texture di Babylon non è un'immagine — è roba in GPU. Qui la
   * si riporta a terra: si leggono i pixel, si mettono in un canvas, e lo si
   * appende come `mapOriginale`. Da lì in poi le stagioni non sanno più che
   * motore ci sia sotto.
   *
   * ⚠ `userData` NON ESISTE SU UN MATERIALE DI BABYLON — è un'idea di three, e
   * `stagioni.js` la cerca lì perché veniva da lì. Si crea: cambiarle nome
   * vorrebbe dire toccare il mondo per una faccenda del motore.
   *
   * ⚠ ED È ASINCRONA perché `readPixels` lo è. Chi chiama non aspetta: se la
   * stagione cambia prima che sia pronta, quel cambio non ritinge il fogliame e
   * il successivo sì. Meglio un ritardo che un blocco all'avvio.
   */
  async _registraPerStagioni(materiale, tex) {
    if (!this.fabbrica) return;
    try {
      if (!tex.isReady()) await new Promise((ok) => tex.onLoadObservable.addOnce(() => ok()));
      const { width: w, height: h } = tex.getSize();
      const px = await tex.readPixels();
      if (!px || !w || !h) return;
      const canvas = document.createElement('canvas');
      canvas.width = w; canvas.height = h;
      const ctx = canvas.getContext('2d');
      const img = ctx.createImageData(w, h);
      img.data.set(new Uint8ClampedArray(px.buffer, px.byteOffset, px.byteLength));
      ctx.putImageData(img, 0, 0);
      materiale.userData = materiale.userData || {};
      materiale.userData.mapOriginale = { image: canvas };
      this.fabbrica.materialiConMappa().add(materiale);
    } catch (e) {
      console.warn('stagioni: non ho potuto leggere la texture di', materiale.name, e);
    }
  }

  /**
   * Piazza tutte le copie di un modello, in un colpo solo.
   * @param dove elenco di { x, y, z, giro } — `giro` in radianti attorno a Y
   */
  piazza(nome, dove) {
    const voce = this._caricati.get(nome);
    if (!voce) throw new Error(`${nome} non è stato caricato`);
    const n = dove.length;
    const dati = new Float32Array(n * 16);
    const m = new Matrix();
    const q = new Quaternion();
    // ⚠ LA SCALA NON È PIÙ FISSA A UNO: serve al «colpetto», la risposta
    // grafica al tocco (vedi `gioco/colpetto.js`). Chi non la passa resta a 1,
    // quindi nessun chiamante vecchio se ne accorge.
    const dim = new Vector3(1, 1, 1);
    const pos = new Vector3();
    for (let i = 0; i < n; i++) {
      const d = dove[i];
      Quaternion.RotationAxisToRef(Vector3.UpReadOnly, d.giro || 0, q);
      pos.set(d.x, d.y, d.z);
      dim.setAll(d.scala || 1);
      Matrix.ComposeToRef(dim, q, pos, m);
      m.copyToArray(dati, i * 16);
    }
    voce.mesh.thinInstanceSetBuffer('matrix', dati, 16, true);
    voce.mesh.thinInstanceCount = n;
    voce.mesh.setEnabled(n > 0);
    voce.matrici = dati; voce.n = n;
    return n;
  }
}

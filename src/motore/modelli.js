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
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { CustomMaterial } from '@babylonjs/materials/custom/customMaterial.js';
import { applicaStilePiatto } from './stile.js';
import '@babylonjs/loaders/glTF/2.0/glTFLoader.js';
import '@babylonjs/core/Meshes/thinInstanceMesh.js';

/** Dove stanno i .glb. Relativo alla pagina, così vale anche pubblicato. */
const CARTELLA = './modelli/';

export class Modelli {
  constructor(scena, rig) {
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
  async carica(nome, { scala = 1 } = {}) {
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

    // ⚠ LO STESSO STILE DEL MONDO. Un albero illuminato con la legge del motore
    // accanto a un terreno illuminato con la nostra è il difetto che in Leafy
    // si vede subito: due leggi diverse per la stessa luce. Il colore piatto qui
    // è quello del modello (texture o colori di vertice) — se il glTF non ne ha,
    // resta il diffuso del materiale.
    const m = applicaStilePiatto(new CustomMaterial(`mat:${nome}`, this.scena), this.rig, 'baseColor.rgb');
    m.backFaceCulling = false;   // le chiome sono piani incrociati
    if (tex) {
      m.diffuseTexture = tex;
      tex.hasAlpha = true;
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
    fuso.receiveShadows = true;          // ⚠ falso di fabbrica: vedi CLAUDE.md
    this.rig.proietta(fuso);
    fuso.setEnabled(false);              // finché non ha istanze non si disegna

    const voce = { mesh: fuso, matrici: null, n: 0 };
    this._caricati.set(nome, voce);
    return voce;
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
    const uno = new Vector3(1, 1, 1);
    const pos = new Vector3();
    for (let i = 0; i < n; i++) {
      const d = dove[i];
      Quaternion.RotationAxisToRef(Vector3.UpReadOnly, d.giro || 0, q);
      pos.set(d.x, d.y, d.z);
      Matrix.ComposeToRef(uno, q, pos, m);
      m.copyToArray(dati, i * 16);
    }
    voce.mesh.thinInstanceSetBuffer('matrix', dati, 16, true);
    voce.mesh.thinInstanceCount = n;
    voce.mesh.setEnabled(n > 0);
    voce.matrici = dati; voce.n = n;
    return n;
  }
}

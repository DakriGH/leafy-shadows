// LA FLORA A SCHERMO — una mesh per famiglia, migliaia di istanze, un disegno.
//
// ⚠ È IL PEZZO-MOTORE DELLA «PROVA DEI 9000» (fase R3): il costo per fotogramma
// deve crescere con le FAMIGLIE (una chiamata di disegno l'una), non con le
// istanze. La strada è la stessa dell'erba — 101.698 lamelle a 0,18 ms — e dei
// modelli: thin instances su una mesh sola.
//
// ⚠ IL MATERIALE È QUELLO DEL MONDO, e non per pigrizia: la flora deve prendere
// LA STESSA ombra a gradini, la stessa tinta di cielo, le stesse lampade dei
// blocchi su cui poggia — un materiale nuovo sarebbe una seconda legge della
// luce da tenere allineata a mano per sempre. I colori stanno nei vertici,
// come per i chunk: il materiale li veste gratis.

import { Mesh } from '@babylonjs/core/Meshes/mesh.js';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData.js';
import { Matrix, Quaternion, Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import '@babylonjs/core/Meshes/thinInstanceMesh.js';

export class Flora {
  /**
   * @param rig       per proiettare le ombre
   * @param materiale il materiale del MONDO (fabbrica.matMondo)
   */
  constructor(rig, materiale) {
    this.rig = rig;
    this.materiale = materiale;
    this.famiglie = new Map();   // nome → { mesh, quante }
  }

  /**
   * Pianta una famiglia: geometria (pos/col da `world/flora.js`) + posizioni.
   *
   * ⚠ LE MATRICI SI COSTRUISCONO UNA VOLTA E BASTA: la flora non si muove, e
   * `thinInstanceSetBuffer(..., true)` dice a Babylon che il buffer è STATICO —
   * niente ricarichi per fotogramma, che è la trappola già pagata due volte
   * (l'erba qui, `addUpdateRange` in Lantern).
   *
   * ⚠ E LE NORMALI SI CALCOLANO DOPO AVER GIRATO L'AVVOLGIMENTO, come in
   * `fabbrica.scrivi`: le geometrie della flora arrivano antiorarie (la
   * convenzione del mesher), e Babylon le legge al contrario.
   */
  /**
   * ⚠ LE ISTANZE SI DIVIDONO PER SETTORE, ed è la riga che rende la flora
   * CULLABILE: con una mesh sola per famiglia la scatola dell'unione copre il
   * mondo intero, e il frustum non può scartare niente — ogni fiore dietro la
   * camera si paga lo stesso. A settori di 48 celle il motore scarta i settori
   * fuori vista da solo, e sul mondo GRANDE (quello dei 9000 asset) il costo
   * smette di crescere con l'area: cresce con quello che si guarda. Il prezzo
   * sul mondo piccolo è qualche mesh in più in elenco — misurato: zero ms.
   */
  pianta(nome, geometria, posizioni, { proietta = false, latoSettore = 48 } = {}) {
    this.togli(nome);
    if (!posizioni.length) return null;
    const settori = new Map();
    for (const p of posizioni) {
      const k = `${Math.floor(p.x / latoSettore)},${Math.floor(p.z / latoSettore)}`;
      if (!settori.has(k)) settori.set(k, []);
      settori.get(k).push(p);
    }
    const meshes = [];
    for (const [k, gruppo] of settori) {
      meshes.push(this._piantaSettore(`flora:${nome}:${k}`, geometria, gruppo, proietta));
    }
    this.famiglie.set(nome, { meshes, quante: posizioni.length });
    return meshes;
  }

  _piantaSettore(nomeMesh, geometria, posizioni, proietta) {
    const mesh = new Mesh(nomeMesh, this.rig.scena);
    const vd = new VertexData();
    // ⚠ OGNI TRIANGOLO ESISTE DUE VOLTE, UNA PER VERSO — e la decisione viene
    // da un difetto VISTO, non immaginato: alla prima verifica a schermo le
    // rocce mostravano solo il tetto e i cespugli sparivano dall'angolo
    // opposto. Le geometrie della flora sono scritte a mano in `world/flora.js`
    // e pretendere l'avvolgimento coerente su ogni tri scritto a occhio è il
    // modo di riprendersi lo stesso difetto al prossimo cespuglio. Qui si
    // duplica tutto girato: visibile da ogni lato PER COSTRUZIONE, le normali
    // escono giuste per ciascun verso, e il costo — a queste quantità — è
    // qualche migliaio di triangoli, cioè niente. ⚠ Vale per la flora
    // procedurale e basta: i .glb veri arrivano con l'avvolgimento giusto
    // dall'export, e i loro triangoli non si raddoppiano.
    const nV = geometria.pos.length / 3;
    const pos = new Float32Array(nV * 2 * 3);
    const col = new Float32Array(nV * 2 * 4);
    pos.set(geometria.pos, 0);
    pos.set(geometria.pos, nV * 3);
    col.set(geometria.col, 0);
    col.set(geometria.col, nV * 4);
    const ind = new Uint32Array(nV * 2);
    for (let i = 0; i < nV; i += 3) {
      ind[i] = i; ind[i + 1] = i + 2; ind[i + 2] = i + 1;                        // il verso «da fuori»
      ind[nV + i] = nV + i; ind[nV + i + 1] = nV + i + 1; ind[nV + i + 2] = nV + i + 2;  // e il suo retro
    }
    vd.positions = pos;
    vd.colors = col;
    vd.indices = ind;
    const nrm = new Float32Array(nV * 2 * 3);
    VertexData.ComputeNormals(vd.positions, vd.indices, nrm);
    vd.normals = nrm;
    vd.applyToMesh(mesh);
    mesh.material = this.materiale;
    mesh.isPickable = false;

    const dati = new Float32Array(posizioni.length * 16);
    const m = new Matrix();
    const q = new Quaternion();
    const s = new Vector3();
    const p = new Vector3();
    for (let i = 0; i < posizioni.length; i++) {
      const v = posizioni[i];
      Quaternion.RotationYawPitchRollToRef(v.giro || 0, 0, 0, q);
      s.setAll(v.scala || 1);
      p.set(v.x, v.y, v.z);
      Matrix.ComposeToRef(s, q, p, m);
      m.copyToArray(dati, i * 16);
    }
    mesh.thinInstanceSetBuffer('matrix', dati, 16, true);
    mesh.thinInstanceCount = posizioni.length;
    // ⚠ IL CULLING PER ISTANZA NON ESISTE con le thin instances: la scatola è
    // l'UNIONE del settore — ed è per questo che i settori esistono (vedi
    // `pianta`): il frustum scarta il settore intero, che è il grano giusto.
    mesh.thinInstanceRefreshBoundingInfo();
    // ⚠ LA MATRICE DEL NODO È FERMA PER SEMPRE: le posizioni vere stanno nelle
    // matrici delle istanze. Congelarla toglie un aggiornamento per mesh per
    // fotogramma — coi settori le mesh sono decine, e su una CPU mobile è
    // esattamente il genere di brusio che si somma.
    mesh.freezeWorldMatrix();

    if (proietta) this.rig.proietta(mesh);
    // la flora RICEVE le ombre dei blocchi e degli alberi
    mesh.receiveShadows = true;
    return mesh;
  }

  togli(nome) {
    const f = this.famiglie.get(nome);
    if (!f) return;
    for (const m of f.meshes) m.dispose();
    this.famiglie.delete(nome);
  }

  /** Quante istanze vive in tutto: il numero della prova di carico. */
  get istanze() {
    let n = 0;
    for (const f of this.famiglie.values()) n += f.quante;
    return n;
  }

  /** Quante mesh in elenco (settori × famiglie): il numero del culling. */
  get settori() {
    let n = 0;
    for (const f of this.famiglie.values()) n += f.meshes.length;
    return n;
  }
}

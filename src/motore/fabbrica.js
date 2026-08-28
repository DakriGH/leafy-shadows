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
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { Prato } from './prato.js';

// ⚠ ANCHE QUI GLI SHADER A MANO: con gli import profondi il sorgente del
// materiale standard non arriva da solo, e il primo disegno fallisce con
// «effect is not ready» invece di dare un errore in fase di caricamento.
import '@babylonjs/core/Shaders/default.vertex.js';
import '@babylonjs/core/Shaders/default.fragment.js';

export class Fabbrica {
  constructor(rig) {
    this.rig = rig;
    this.scena = rig.scena;

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
    this.matMondo = new StandardMaterial('mondo', this.scena);
    this.matMondo.specularColor = Color3.Black();
    this.matMondo.diffuseColor = Color3.White();
    this.matMondo.backFaceCulling = true;

    this.matAcqua = new StandardMaterial('acqua', this.scena);
    this.matAcqua.specularColor = new Color3(0.25, 0.3, 0.32);
    this.matAcqua.specularPower = 64;
    this.matAcqua.diffuseColor = Color3.White();
    this.matAcqua.alpha = 0.72;
    this.matAcqua.backFaceCulling = false;

    this._conMappa = new Set();
  }

  // ── il ciclo di vita di un chunk ───────────────────────────────────────────

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
  }

  rimuoviChunk(e) {
    this.rig.ombre.removeShadowCaster(e.solidi, true);
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
  impostaVoxel(_mesh, _scatola, _cimaY) {}
  spegniVoxel() {}
  latoMassimoVoxel() { return 0; }
  mondoVelato() { return false; }

  // ── il prato ──────────────────────────────────────────────────────────────
  creaPrato(max) { return new Prato(this.scena, this.rig, max); }
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

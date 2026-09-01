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
import { Vector4 } from '@babylonjs/core/Maths/math.vector.js';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture.js';
import { RawTexture3D } from '@babylonjs/core/Materials/Textures/rawTexture3D.js';
import { Constants } from '@babylonjs/core/Engines/constants.js';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { Prato } from './prato.js';
import { Acqua, governaPassate, misuraPassate, misuraSottAcqua } from './acqua.js';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder.js';
import { Mesh as MeshCostanti } from '@babylonjs/core/Meshes/mesh.js';
import '@babylonjs/core/Meshes/Builders/capsuleBuilder.js';
import { CustomMaterial } from '@babylonjs/materials/custom/customMaterial.js';
import { applicaStilePiatto, aggiungiDefinizioniFragment } from './stile.js';

// ⚠ ANCHE QUI GLI SHADER A MANO: con gli import profondi il sorgente del
// materiale standard non arriva da solo, e il primo disegno fallisce con
// «effect is not ready» invece di dare un errore in fase di caricamento.
import '@babylonjs/core/Shaders/default.vertex.js';
import '@babylonjs/core/Shaders/default.fragment.js';

/**
 * L'ALONE DELLE LAMPADE — ANELLI CONCENTRICI PIATTI, non una sfumatura.
 *
 * ⚠ È LA CORREZIONE CHE CONTA, e me l'ha fatta il committente due volte:
 * «stilizzato e colorato come nel primo Lantern», «non mi piace così bianco il
 * tutto». Avevo fatto un bagliore MORBIDO — due gusci che sfumano l'uno
 * nell'altro — ed è l'opposto dello stile di questo gioco. Qui l'ombra è un
 * gradino, la pozza di una lampada è a tre bande nette, il fogliame è tinta
 * piatta: **non c'è una sola sfumatura in tutto Leafy**. Un alone sfumato è
 * l'unica cosa morbida a schermo e si vede subito che viene da un'altra parte.
 *
 * Quindi sono TRE gusci, ognuno di un colore SUO e piatto. Fra l'uno e l'altro
 * il salto è netto perché la silhouette di una sfera è netta: si leggono come
 * tre anelli concentrici, che è la parola «concentriche» del committente.
 *
 * ⚠ E I COLORI SONO SATURI, che è la cura al bianco. Un additivo alza tutti e
 * tre i canali: partendo da un colore poco saturo arrivano insieme al tetto e
 * il risultato è bianco. Partendo da un giallo-arancio profondo satura PRIMA il
 * rosso, e quando satura il risultato resta caldo. Misurato sul pixel: prima
 * (255, 255, 254), cioè bianco puro.
 *
 * ⚠ IL PIÙ GRANDE PER PRIMO, e l'ordine è quello di disegno (`alphaIndex`): un
 * additivo non ha bisogno di ordine per il colore, ma averlo dal grande al
 * piccolo tiene i bordi dei tre anelli prevedibili quando si sovrappongono due
 * lampade.
 */
const GUSCI = [
  { r: 1.55, colore: [1.00, 0.42, 0.06], alfa: 0.13 },   // amber profondo, l'orlo
  { r: 1.00, colore: [1.00, 0.62, 0.12], alfa: 0.18 },   // arancio
  { r: 0.55, colore: [1.00, 0.86, 0.38], alfa: 0.30 },   // il cuore, giallo caldo
];


/** I 36 vertici di un cubetto canonico: servono solo a calcolare le normali una
 *  volta sola (vedi `schegge`), perché una scheggia non ruota mai. */
const CUBETTO = (() => {
  const V = [[-1,-1,-1],[1,-1,-1],[1,-1,1],[-1,-1,1],[-1,1,-1],[1,1,-1],[1,1,1],[-1,1,1]];
  const T = [[0,1,2],[0,2,3],[4,6,5],[4,7,6],[0,4,5],[0,5,1],
             [1,5,6],[1,6,2],[2,6,7],[2,7,3],[3,7,4],[3,4,0]];
  const out = [];
  for (const t of T) for (const i of t) out.push(V[i]);
  return out;
})();

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

    // ---- LA RISACCA SUL TERRENO ---------------------------------------------
    // ⚠ QUI E NON NELL'ACQUA, ed è l'osservazione più affilata dello studio: la
    // mesh dell'acqua FINISCE alla sponda, quindi la lingua che avanza e si
    // ritira sulla sabbia — lo «swash» di Animal Crossing — non può viverci.
    // Vive nel materiale del mondo: una fascia sopra il pelo che respira col
    // coseno (stesso scarto di fase −2,5 delle righe di riva, così i due
    // orologi non divergono), un fronte bianco sul bordo, e dietro la SABBIA
    // BAGNATA — che per la regola di casa non è sabbia scurita: scurisce E
    // vira, come l'ombra.
    // ⚠ COMPILATA SOLO SU DESKTOP (`acquaRicca`): è ALU nel fragment di TUTTO
    // il terreno, e su mobile un `if` non spegnerebbe niente.
    // ⚠ `position` è l'attributo GREZZO, cioè il mondo vero anche con l'origine
    // mobile: le geometrie dei chunk sono in coordinate assolute e congelate.
    if (rig.fissi.acquaRicca) {
      this._risacca = new Vector4(-9999, 0, 0.55, 0);   // (livello, ampiezza, velocità, libero)
      // ⚠ IL RETTANGOLO DELLO SPECCHIO, ed è la maschera che mancava: senza,
      // la fascia bagnata dipingeva TUTTO il terreno a quella quota — macchie
      // leopardate sull'erba a tre piazzole di distanza, visto al primo
      // scatto. Il mondo non sa dove sta l'acqua: glielo dice chi la governa.
      this._risaccaRett = new Vector4(0, 0, -1, -1);     // (x0, z0, x1, z1)
      this.matMondo.AddUniform('uRisacca', 'vec4', this._risacca);
      this.matMondo.AddUniform('uRisaccaRett', 'vec4', this._risaccaRett);
      this.matMondo.AddUniform('uTempoMondo', 'float', 0);
      this.matMondo.AddUniform('uFondaleOnda', 'float', 0);
      this.matMondo.Vertex_Definitions('\n  varying vec3 vMondoPos;\n');
      // ⚠ LA «RIFRAZIONE» ALLA MARIO GALAXY (docs/STUDIO-RETRO.md): su Wii non
      // si rifrangeva l'acqua — si faceva ONDEGGIARE IL FONDALE sotto di lei, e
      // la superficie restava ferma. Qui: i vertici del mondo che stanno sotto
      // il pelo (uRisacca.x) e dentro il rettangolo dell'acqua si spostano in
      // xz con due seni composti, pesati da quanto sono sommersi. Chi guarda
      // ATTRAVERSO l'acqua vede il fondo che ondeggia — cioè la rifrazione —
      // senza nessuna passata: niente RTT, niente copia dello schermo, gratis
      // sulla GPU a tile. Quei vertici da fuori non si vedono mai (sono
      // sott'acqua per definizione), quindi il mondo asciutto non si muove.
      // ⚠ SPENTA DI FABBRICA (uFondaleOnda 0): si accende con `fondaleOnda()`
      // dove il pelo e il rettangolo sono noti — e il committente la giudica
      // nel banco prima che entri nel gioco.
      this.matMondo.Vertex_Before_PositionUpdated(`
  vMondoPos = position;
  vec2 mondoRettFuori = max(max(uRisaccaRett.xy - position.xz, position.xz - uRisaccaRett.zw), vec2(0.0));
  float mondoSotto = clamp((uRisacca.x - 0.15 - position.y) * 1.6, 0.0, 1.0) * step(length(mondoRettFuori), 0.01);
  float mondoOndaX = sin(position.z * 1.7 + uTempoMondo * 1.3) + 0.6 * sin(position.z * 3.9 - uTempoMondo * 0.8);
  float mondoOndaZ = sin(position.x * 1.5 - uTempoMondo * 1.1) + 0.6 * sin(position.x * 4.3 + uTempoMondo * 0.9);
  positionUpdated.xz += vec2(mondoOndaX, mondoOndaZ) * (uFondaleOnda * mondoSotto);
`);
      aggiungiDefinizioniFragment(this.matMondo, '\n  varying vec3 vMondoPos;\n');
      this.matMondo.Fragment_Custom_Diffuse(`
  float mondoRespiro = 0.5 + 0.5 * cos(uTempoMondo * uRisacca.z * 6.2831 - 2.5);
  float mondoFestone = sin(vMondoPos.x * 5.1 + vMondoPos.z * 3.7) * 0.06 + sin(vMondoPos.x * 1.9 - vMondoPos.z * 2.3) * 0.05;
  float mondoQuota = vMondoPos.y - uRisacca.x + mondoFestone;
  float mondoFronte = uRisacca.y * (0.30 + 0.70 * mondoRespiro);
  vec2 mondoFuori = max(max(uRisaccaRett.xy - vMondoPos.xz, vMondoPos.xz - uRisaccaRett.zw), vec2(0.0));
  float mondoVicino = step(length(mondoFuori), 1.6);
  float mondoAcceso = step(0.01, uRisacca.y) * mondoVicino;
  float mondoBagnato = step(0.0, mondoQuota) * step(mondoQuota, uRisacca.y) * mondoAcceso;
  float mondoSchiumaRiva = step(abs(mondoQuota - mondoFronte), 0.05) * mondoAcceso * step(0.15, mondoRespiro);
  baseColor.rgb = mix(baseColor.rgb, baseColor.rgb * vec3(0.74, 0.80, 0.92), mondoBagnato * 0.85);
  baseColor.rgb = mix(baseColor.rgb, vec3(0.97, 0.99, 1.0), mondoSchiumaRiva);
`);
    }

    // ---- L'ACQUA ------------------------------------------------------------
    // ⚠ FINO A IERI ERA IL MATERIALE DEL MONDO CON L'ALFA A 0,72, cioè l'acqua
    // NON aveva un aspetto suo: era terreno semitrasparente. E intanto il
    // mesher le calcolava già corrente, tipo di faccia e distanza dalla sponda,
    // che questa fabbrica buttava via a ogni chunk. Vedi `acqua.js`.
    // ⚠ IL TETTO PARTE APERTO, e non è pigrizia: chi decide quanta acqua ci si
    // può permettere è il profilo di qualità, che arriva subito dopo
    // (`applicaProfiloAcqua`, chiamata da `rig.applicaProfilo`). Partire chiusi
    // vorrebbe dire compilare due volte il materiale all'avvio — una col tetto
    // di comodo e una col tetto vero — per niente.
    this._tettoAcqua = { vera: 3, riflesso: true };
    this._ricettaAcqua = null;
    this._profAcqua = 1;
    this._misuraAcqua = null;
    this.acqua = new Acqua(rig, { ricca: rig.fissi.acquaRicca, tetto: this._tettoAcqua });
    this.matAcqua = this.acqua.materiale;

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
    // ⚠ NEMMENO I SOLIDI SONO PESCABILI, ed era l'ultima mesh grossa rimasta
    // pescabile di tutto il gioco. Il bersaglio lo troviamo camminando la
    // griglia (`gioco/mira.js`, dieci passi di DDA); il picking di Babylon su un
    // chunk vuol dire intersecare il raggio con le sue MIGLIAIA di triangoli, e
    // lo faceva a ogni pressione e a ogni rilascio del dito — cioè proprio nel
    // momento in cui si sta scavando e uno scatto si sente.
    acqua.isPickable = false;
    solidi.isPickable = false;
    // ⚠ PROIETTARE E RICEVERE SONO DUE COSE, e la seconda è FALSA di fabbrica.
    // Col solo `addShadowCaster` la mappa si riempie, il costo si paga, e a
    // schermo non cambia NIENTE — il terreno con il sole a 17° non aveva una
    // sola ombra. Un difetto muto, che è la famiglia peggiore: nessun errore,
    // nessun avviso, solo un'immagine sbagliata che sembra giusta.
    solidi.receiveShadows = true;
    // ⚠ L'ACQUA RICEVE SOLO SE IL GRADINO SE LO PUÒ PERMETTERE: misurato 1,1 ms
    // su 26 (il 4,2% del fotogramma) per l'ombra di un albero sull'acqua. Vedi
    // `ombraAcqua` in `motore/qualita.js`.
    acqua.receiveShadows = this.rig.profilo.ombraAcqua !== false;
    this.rig.proietta(solidi);          // ⚠ elenco, non «tutto meno qualcosa»
    solidi._proietta = true;            // lo stato che legge «aggiornaOmbre»
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
    // ⚠ OGNI SCRITTURA È UN EVENTO PER LE OMBRE: la mappa del sole ora si
    // congela quando la scena è ferma (rig.quieteOmbre), e questo contatore è
    // come la firma di quiete viene a sapere che il mondo è cambiato — un
    // blocco posato, un chunk rifatto. Senza, l'ombra del blocco nuovo
    // apparirebbe solo alla prossima mossa della camera.
    this.revOmbre = (this.revOmbre || 0) + 1;
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
    // ---- I CANALI DELL'ACQUA -------------------------------------------------
    // ⚠ QUESTI DUE ARRAY ESISTEVANO DA SEMPRE E NON SONO MAI ARRIVATI ALLA
    // SCHEDA. Il mesher li riempie per ogni vertice d'acqua — corrente, tipo di
    // faccia, distanza dalla sponda, apertura dello specchio — e qui si
    // caricavano posizioni, colori e normali e basta. Nessun errore, nessun
    // avviso: semplicemente l'acqua non poteva avere un aspetto suo, e il conto
    // della riva (25 celle scandite per ogni cella d'acqua) si pagava per
    // niente, a ogni rifacimento di chunk.
    // ⚠ E SI CARICANO SOLO SE CI SONO: le mesh dei solidi non hanno questi
    // canali, e dichiararli vuoti darebbe un buffer di lunghezza zero contro un
    // attributo dichiarato nello shader — cioè il tipo di guasto muto che in
    // questo progetto è già costato tre giornate.
    if (dati.acq) mesh.setVerticesData('aAcqua', dati.acq, false, 3);
    if (dati.riv) mesh.setVerticesData('aRiva', dati.riv, false, 2);
    mesh.setEnabled(true);
    // ⚠ IL LOD SI RIFÀ QUI E NON SOLO ALLA CREAZIONE: la sua soglia dipende dal
    // RAGGIO della mesh, e alla creazione la mesh è vuota — il raggio sarebbe
    // quello di ripiego. Rifacendolo a ogni scrittura la soglia segue anche i
    // chunk che cambiano forma, cioè quelli in cui si sta scavando.
    this._lod(mesh);
  }

  /** La distanza di resa è cambiata: si rifanno i livelli di LOD. */
  applicaDistanza() { for (const m of this._chunkMesh) this._lod(m); this._dovOmbre = null; }

  /**
   * L'ACQUA RICEVE LE OMBRE? — da chiamare quando cambia il gradino.
   * ⚠ SI APPLICA ALLE MESH GIÀ FATTE, non solo alle prossime: scendere di
   * gradino deve valere SUBITO, se no il risparmio arriva solo per i chunk che
   * si costruiranno — cioè quasi mai, visto che il mondo è già lì.
   */
  ombreSullAcqua(si) {
    for (const m of this._chunkMesh) {
      if (m.name.startsWith('acqua:')) m.receiveShadows = !!si;
    }
  }

  /**
   * CHI PROIETTA OMBRA ADESSO — solo i chunk abbastanza vicini da poterne fare
   * una che si veda.
   *
   * ⚠ È IL TAGLIO PIÙ REDDITIZIO CHE C'È, e si misura: la mappa a cascate
   * disegna ogni mesh dell'elenco UNA VOLTA PER CASCATA, quindi ogni chunk tolto
   * vale QUATTRO chiamate di disegno in meno (due su mobile). Provato a mano:
   * togliendone dieci si passa da 273 disegni a 233, esatti esatti.
   *
   * ⚠ E IL CONFINE NON È LA NEBBIA MA `shadowMaxZ`: le cascate coprono fin lì e
   * non un metro di più. Un chunk a centoventi blocchi si VEDE (la nebbia
   * comincia a ottantacinque) ma la sua ombra no — cioè finiva in GPU quattro
   * volte per fotogramma per non produrre un solo pixel.
   *
   * ⚠ NON SI PUÒ USARE `isVisible`, che pure funzionerebbe: quello lo toglie
   * anche dalla vista normale, e il chunk sparirebbe a occhio. La lista delle
   * ombre e quella del disegno sono due liste diverse, ed è giusto così.
   */
  aggiornaOmbre(occhio) {
    const raggio = this.rig.ombre ? this.rig.ombre.shadowMaxZ : 0;
    if (!raggio) return;
    // ⚠ SI RIFÀ SOLO QUANDO CI SI È MOSSI DAVVERO: la lista cambia ogni tanti
    // blocchi, non ogni fotogramma, e scorrere i chunk sessanta volte al secondo
    // per scoprire che non è cambiato niente è lavoro sprecato.
    if (this._dovOmbre) {
      const dx = occhio.x - this._dovOmbre.x, dy = occhio.y - this._dovOmbre.y, dz = occhio.z - this._dovOmbre.z;
      if (dx * dx + dy * dy + dz * dz < 36) return;
    }
    this._dovOmbre = { x: occhio.x, y: occhio.y, z: occhio.z };
    for (const m of this._chunkMesh) {
      if (!m.name.startsWith('solidi:') || m.getTotalVertices() === 0) continue;
      const sf = m.getBoundingInfo().boundingSphere;
      const c = sf.centerWorld;
      const dx = c.x - occhio.x, dy = c.y - occhio.y, dz = c.z - occhio.z;
      const dentro = Math.sqrt(dx * dx + dy * dy + dz * dz) - sf.radiusWorld <= raggio;
      if (dentro === m._proietta) continue;
      m._proietta = dentro;
      if (dentro) this.rig.ombre.addShadowCaster(m, true);
      else this.rig.ombre.removeShadowCaster(m, true);
    }
  }

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
  /**
   * I RAGGI DI RESA PER IL MESHER, in blocchi: dentro `pieno` dettaglio pieno,
   * fino a `resa` la pelle, oltre niente (vedi `costruisciPelle` nel mesher).
   * ⚠ `resa` sta un chunk OLTRE la distanza di resa: il LOD del motore toglie
   * la mesh a `fogEnd + raggio`, e un chunk che il mesher non costruisce ma il
   * motore avrebbe ancora disegnato sarebbe un buco nella nebbia.
   * ⚠ `pieno` è la manopola del profilo (`dist` è la distanza, `pieno` quanto
   * di quella è a dettaglio pieno); se il profilo non lo dice, metà distanza —
   * a settantacinque blocchi uno smusso è meno di un pixel su qualunque schermo.
   */
  raggi() {
    const d = this.rig.distanzaResa;
    if (!Number.isFinite(d)) return null;
    const p = this.rig.profilo && Number.isFinite(this.rig.profilo.pieno) ? this.rig.profilo.pieno : d * 0.5;
    return { resa: d + 16, pieno: Math.min(p, d) };
  }
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
  /** I tre gusci concentrici: la tabella e il perché stanno in cima al file. */
  aloni(quanti) {
    const mesh = GUSCI.map((g, i) => {
      // ⚠ SFERA INVERTITA — l'idea è del committente: «potresti fare inverted
      // sphere per questi aloni, così il lampione spicca». Ed è giusta.
      //
      // Con una sfera normale l'alone si disegna DAVANTI alla lampada e la
      // annega: il palo e la testa spariscono dentro la luce. Girando
      // l'avvolgimento si vede solo la METÀ LONTANA del guscio, e la prova di
      // profondità fa il resto — la testa le sta davanti e la occlude. La luce
      // circonda l'oggetto invece di coprirlo, e la sagoma resta netta.
      //
      // ⚠ E COSTA LA METÀ: si disegna un emisfero invece di due. È anche la
      // ragione per cui non satura più: con le facce di dietro accese ogni
      // pixel riceveva la sfera DUE VOLTE, e un additivo raddoppiato sbianca —
      // misurato, (255, 255, 254).
      // ⚠ POCHI SPICCHI, E SI MISURA PERCHÉ: a 14 spicchi una sfera fa 1.024
      // triangoli, e con novantasei lampioni per tre gusci facevano 294.912
      // triangoli per fotogramma — il 53% di TUTTA la scena, per un effetto che
      // è una macchia sfumata. A 6 ne fa 256. La differenza a schermo non si
      // vede: un guscio additivo di colore piatto non ha una silhouette da
      // rovinare, ha un bordo morbido che i pixel arrotondano comunque.
      const m = MeshBuilder.CreateSphere('alone' + i,
        { diameter: g.r * 2, segments: 6, sideOrientation: MeshCostanti.BACKSIDE }, this.scena);
      const mat = new StandardMaterial('alone' + i, this.scena);
      mat.disableLighting = true;
      mat.emissiveColor = new Color3(...g.colore);
      mat.diffuseColor = Color3.Black();
      mat.specularColor = Color3.Black();
      mat.alpha = g.alfa;
      mat.alphaMode = 1;                 // ALPHA_ADD: si somma, non copre
      mat.backFaceCulling = true;
      mat.disableDepthWrite = true;
      // ⚠ IMMUNE ALLA NEBBIA: una luce vista da lontano deve restare un punto
      // luminoso, non sbiadire nel grigio. In Lantern è `fog: false`, per la
      // stessa ragione.
      mat.applyFog = false;
      m.material = mat;
      m.isPickable = false;
      m.receiveShadows = false;
      m.alphaIndex = 3 + i;              // dal più grande al più piccolo
      // ⚠ SEMPRE ATTIVA, E QUESTO È IL DIFETTO PER CUI GLI ALONI SPARIVANO.
      // Una mesh a istanze sottili tiene la scatola di contenimento della
      // GEOMETRIA DI BASE — misurata: [-0,42 … +0,42] attorno all'ORIGINE del
      // mondo — non delle sue istanze. Babylon la cullava appena l'origine
      // usciva dall'inquadratura, e tutti gli aloni sparivano insieme, ovunque
      // fossero. Committente: «perché la sfera del lampione sparisce?».
      // ⚠ E NON SI CURA RICALCOLANDO LA SCATOLA: i lampioni stanno sparsi per
      // tutto il mondo, quindi quella vera coprirebbe tutto e il culling non
      // taglierebbe mai niente. Due mesh sempre attive costano meno del conto
      // per decidere di tenerle.
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
  muoviAloni(a, punti, occhio = null, portata = 0) {
    // ⚠ SI SCRIVONO SOLO QUELLI CHE SI VEDONO DAVVERO, e il conto della mesh si
    // taglia lì. Prima si scrivevano TUTTI e i lampioni spenti prendevano scala
    // zero: un triangolo degenere non copre pixel, ma il suo vertice viene
    // trasformato lo stesso — 294.912 vertici per fotogramma a mezzogiorno, per
    // disegnare il nulla. Con il conto tagliato, di giorno la mesh non entra
    // nemmeno nella lista da disegnare.
    //
    // ⚠ E C'È IL TAGLIO PER DISTANZA, che è il vero LOD per istanza che
    // mancava: un alone oltre la nebbia non si vede, ma finiva in GPU comunque
    // perché la mesh è «sempre attiva» (vedi `aloni`) e quindi il culling di
    // Babylon non la guarda nemmeno. Qui la distanza la sappiamo noi, e costa
    // un confronto per lampione.
    const r2 = portata > 0 ? portata * portata : 0;
    let n = 0;
    const primo = a.mesh[0];
    const buf0 = primo._thinInstanceDataStorage.matrixData;
    for (let i = 0; i < punti.length && n < a.quanti; i++) {
      const p = punti[i];
      if (!p || !p.acceso) continue;
      if (r2 && occhio) {
        const dx = p.x - occhio.x, dy = p.y - occhio.y, dz = p.z - occhio.z;
        if (dx * dx + dy * dy + dz * dz > r2) continue;
      }
      const o = n * 16;
      buf0[o] = 1; buf0[o + 1] = 0; buf0[o + 2] = 0; buf0[o + 3] = 0;
      buf0[o + 4] = 0; buf0[o + 5] = 1; buf0[o + 6] = 0; buf0[o + 7] = 0;
      buf0[o + 8] = 0; buf0[o + 9] = 0; buf0[o + 10] = 1; buf0[o + 11] = 0;
      buf0[o + 12] = p.x; buf0[o + 13] = p.y; buf0[o + 14] = p.z; buf0[o + 15] = 1;
      n++;
    }
    // ⚠ I TRE GUSCI STANNO NEGLI STESSI POSTI: si calcola una volta e si copia.
    // Il raggio ce l'ha la GEOMETRIA di ciascun guscio, non la sua matrice.
    for (const m of a.mesh) {
      if (m !== primo) m._thinInstanceDataStorage.matrixData.set(buf0.subarray(0, n * 16));
      m.thinInstanceCount = n;
      // ⚠ QUI L'AGGIORNAMENTO INTERO VA BENE, ed è l'eccezione: il tetto è il
      // numero di lampioni, una dozzina, non mezzo milione come per l'erba.
      // La variante parziale costerebbe più codice che byte risparmiati.
      m.thinInstanceBufferUpdated('matrix');
      // e se non ce n'è nessuno acceso, la mesh esce di scena del tutto
      if (m.isEnabled() !== n > 0) m.setEnabled(n > 0);
    }
    return n;
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

  /**
   * IL COLPETTO — una COPIA del blocco che si gonfia e torna.
   *
   * ⚠ IL MONDO NON CAMBIA DI UN BIT, ed è il vincolo del committente: «solo
   * graficamente mi raccomando». Un blocco vero è cotto dentro la mesh del suo
   * chunk e non si può scalare da solo senza rifare il chunk — che sarebbe
   * lavoro vero per un effetto di due decimi di secondo.
   *
   * Quindi si disegna una COPIA sopra: stessa geometria (`geometriaSingola`),
   * stessi colori di vertice, stesso materiale del mondo. Gonfiata dell'uno per
   * cento è già più grande dell'originale e lo nasconde dentro di sé, quindi a
   * schermo sembra che sia il blocco a respirare. Quando finisce, sparisce.
   *
   * ⚠ E USA IL MATERIALE DEL MONDO, non uno suo: con un materiale diverso il
   * blocco cambierebbe COLORE mentre si gonfia — e allora non sembrerebbe più
   * lui, sembrerebbe un'altra cosa comparsa al suo posto.
   */
  colpetto() {
    const m = new Mesh('colpetto', this.scena);
    m.material = this.matMondo;
    m.isPickable = false;
    m.receiveShadows = true;
    // ⚠ NON PROIETTA OMBRA: per due decimi di secondo l'ombra del blocco
    // diventerebbe più grande, e quel movimento a terra si nota più del
    // colpetto stesso.
    m.setEnabled(false);
    return m;
  }

  /** Mette il colpetto su una cella con una certa scala. `scala <= 1` lo spegne. */
  /**
   * LA MESH DELLE SCHEGGE — una sola per tutti i pezzetti in volo.
   *
   * ⚠ UNA MESH E NON UNA PER SCHEGGIA: settantadue mesh vorrebbero dire
   * settantadue chiamate di disegno per un effetto che dura mezzo secondo. Qui
   * i cubetti stanno tutti nello stesso buffer e si riscrivono a ogni
   * fotogramma — 2.592 vertici, che è meno di un chunk qualsiasi.
   *
   * ⚠ E IL BUFFER SI ALLOCA UNA VOLTA SOLA, alla misura massima, con
   * `updatable`: rifare la VertexData a ogni fotogramma vorrebbe dire creare e
   * buttare via array a sessanta hertz, cioè dare da lavorare al raccoglitore
   * di rifiuti proprio mentre si sta cercando di essere fluidi.
   */
  schegge(vertici) {
    const m = new Mesh('schegge', this.scena);
    m.material = this.matMondo;
    m.isPickable = false;
    m.receiveShadows = false;
    const vd = new VertexData();
    const pos0 = new Float32Array(vertici * 3);
    // ⚠ LE NORMALI SI CALCOLANO UNA VOLTA SOLA, e si può perché un cubetto è
    // sempre lo stesso cubetto: le schegge cambiano posizione e misura, mai
    // orientamento. Quindi si riempie il buffer con dei cubi canonici, si
    // calcolano le normali su quelli, e poi si sposteranno pure — le normali
    // restano giuste. Ricalcolarle a ogni fotogramma sarebbe lavoro sprecato.
    // ⚠ E SE SI LASCIASSERO A ZERO le schegge uscirebbero NERE: il materiale del
    // mondo illumina col prodotto scalare fra normale e sole, e con la normale
    // nulla quel prodotto è zero — cioè sole spento su ogni faccia.
    for (let i = 0; i < vertici; i++) {
      const a = CUBETTO[i % 36];
      pos0[i * 3] = a[0]; pos0[i * 3 + 1] = a[1]; pos0[i * 3 + 2] = a[2];
    }
    vd.positions = pos0;
    vd.colors = new Float32Array(vertici * 4);
    const idx = new Uint32Array(vertici);
    // ⚠ STESSO GIRO DEI TRIANGOLI DEL MONDO: il mesher scrive antiorario.
    for (let i = 0; i < vertici; i += 3) { idx[i] = i; idx[i + 1] = i + 2; idx[i + 2] = i + 1; }
    vd.indices = idx;
    const nor = new Float32Array(vertici * 3);
    VertexData.ComputeNormals(vd.positions, vd.indices, nor);
    vd.normals = nor;
    vd.applyToMesh(m, true);
    m._pos = new Float32Array(vertici * 3);
    m._col = new Float32Array(vertici * 3);
    m._col4 = new Float32Array(vertici * 4);
    // ⚠ SEMPRE ATTIVA anche quando è lontana dal centro: i suoi vertici stanno
    // dove volano i pezzi, ma la scatola di delimitazione resta quella con cui
    // è nata (tutti zeri). Senza questa riga Babylon la considera fuori campo e
    // non la disegna — è lo stesso inciampo degli aloni dei lampioni.
    m.alwaysSelectAsActiveMesh = true;
    m.setEnabled(false);
    return m;
  }

  /**
   * CARICA I PEZZETTI IN VOLO.
   * ⚠ È LA SCHEGGIAIA A SCRIVERSI, come fa il prato con `scriviPrato`: il
   * calcolo di dove stanno i cubetti è gioco, caricarli in GPU è motore.
   */
  scriviSchegge(m, schegge) {
    const { _pos: pos, _col: col, _col4: col4 } = m;
    const n = schegge.scriviIn(pos, col);
    if (!n) { if (m.isEnabled()) m.setEnabled(false); return; }
    // ⚠ IL COLORE DEL MONDO HA QUATTRO CANALI e le schegge ne calcolano tre:
    // l'alfa la mette il motore, che è l'unico a sapere che esiste. Se il
    // buffer arrivasse a tre componenti Babylon leggerebbe di traverso e i
    // cubetti uscirebbero di colori a caso.
    for (let i = 0; i < n; i++) {
      col4[i * 4] = col[i * 3]; col4[i * 4 + 1] = col[i * 3 + 1];
      col4[i * 4 + 2] = col[i * 3 + 2]; col4[i * 4 + 3] = 1;
    }
    // ⚠ E I VERTICI AVANZATI SI COLLASSANO IN UN PUNTO invece di essere
    // lasciati dov'erano: il buffer è lungo quanto il massimo, e i triangoli
    // oltre `n` disegnerebbero i pezzetti del colpo precedente, fermi a
    // mezz'aria. Collassati a zero area non coprono nessun pixel.
    pos.fill(0, n * 3);
    m.updateVerticesData('position', pos, false, false);
    m.updateVerticesData('color', col4, false, false);
    if (!m.isEnabled()) m.setEnabled(true);
  }

  muoviColpetto(m, dati, cella, scala, salto = null) {
    if (!cella || !dati || scala <= 1) { if (m.isEnabled()) m.setEnabled(false); return; }
    if (m._tipo !== dati.tipo) {
      m._tipo = dati.tipo;
      const vd = new VertexData();
      vd.positions = dati.pos;
      vd.colors = dati.col;
      const n = dati.pos.length / 3;
      const idx = new Uint32Array(n);
      // ⚠ STESSO GIRO DEI TRIANGOLI DEL MONDO: il mesher scrive antiorario.
      for (let i = 0; i < n; i += 3) { idx[i] = i; idx[i + 1] = i + 2; idx[i + 2] = i + 1; }
      vd.indices = idx;
      const nor = new Float32Array(n * 3);
      VertexData.ComputeNormals(vd.positions, vd.indices, nor);
      vd.normals = nor;
      vd.applyToMesh(m, true);
    }
    if (!m.isEnabled()) m.setEnabled(true);
    // ⚠ IL SALTO È IL TREMOLIO DEL BLOCCO CHE STA PER CEDERE, e sta qui e non
    // nella scala perché sono due cose diverse: la scala dice quanto è gonfio,
    // il salto dice quanto trema. Vedi `gioco/effetti.js`.
    const sx = salto ? salto.x : 0, sy = salto ? salto.y : 0, sz = salto ? salto.z : 0;
    m.position.set(cella[0] + 0.5 + sx, cella[1] + 0.5 + sy, cella[2] + 0.5 + sz);
    m.scaling.setAll(scala);
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

  // ── l'acqua ───────────────────────────────────────────────────────────────
  /** Una volta per fotogramma: il disegno che scorre e la luna. */
  animaAcqua(t) {
    this.acqua.anima(t);
    if (this._risacca) this.matMondo._newUniformInstances['float-uTempoMondo'] = t;
    // ⚠ IL GOVERNO DELLE PASSATE, ogni fotogramma ma quasi gratis: l'elenco
    // delle mesh d'acqua si rinfresca ogni 30 giri (le mesh dei chunk nascono e
    // muoiono di rado), e il controllo di visibilità è un `some` che si ferma
    // alla prima mesh d'acqua dentro il frustum. Il frustum può non esserci
    // ancora al primo fotogramma: in dubbio si tiene ACCESO — un fotogramma di
    // passata inutile è niente, un fotogramma di acqua senza fondale si vede.
    if ((this._giroPassate = (this._giroPassate || 0) + 1) % 30 === 1 || !this._mesheAcqua) {
      this._mesheAcqua = this.scena.meshes.filter((m) => m.name.startsWith('acqua:'));
      // ⚠ E QUI SI RIMISURA LA MAPPA DI PROFONDITÀ, perché nessun altro lo fa:
      // Babylon la crea grande quanto la tela e non la ridimensiona MAI — né
      // quando la finestra cambia, né quando il profilo cambia `scala`. Un
      // controllo ogni trenta giri è gratis e chiude tutt'e due i buchi con
      // una riga sola invece che con due osservatori.
      if (this._profAcqua) misuraSottAcqua(this.rig, this._profAcqua);
    }
    const piani = this.scena.frustumPlanes;
    const visibile = !piani || this._mesheAcqua.some((m) => m.isEnabled() && m.isInFrustum(piani));
    governaPassate(this.rig, {
      specchio: !!this.acqua.riflesso,
      // ⚠ UNA SOLA CONDIZIONE PER DUE LETTURE: dal 02/09 rifrazione e
      // profondità escono dalla stessa passata (colore + attacco di profondità
      // campionabile), quindi basta che la ricetta chieda la profondità.
      sotto: !!this.acqua.profondita,
    }, visibile);
  }

  /**
   * Dove sta il pelo per la risacca sul terreno. Ampiezza 0 = spenta.
   * ⚠ UN LIVELLO SOLO, come lo specchio: è una fascia globale sulla quota, e
   * due vasche a quote diverse non possono avere lo swash insieme. È il
   * limite onesto della tecnica, non una svista.
   */
  rivaTerreno(livello, ampiezza = 0.45, rettangolo = null) {
    if (!this._risacca) return;
    this._risacca.x = livello;
    this._risacca.y = ampiezza;
    // senza rettangolo la risacca resta spenta: una fascia globale sulla quota
    // dipinge il mondo intero, ed è il difetto che questa firma previene
    if (rettangolo) this._risaccaRett.set(rettangolo.x0, rettangolo.z0, rettangolo.x1, rettangolo.z1);
    else this._risacca.y = 0;
  }

  /**
   * LA «RIFRAZIONE» ALLA GALAXY: quanto ondeggia il fondale sotto il pelo
   * (in blocchi; 0 = ferma). Usa il livello e il rettangolo di `rivaTerreno`,
   * quindi va chiamata DOPO — stesso piano, stessa vasca.
   */
  fondaleOnda(ampiezza = 0) {
    this.matMondo._newUniformInstances['float-uFondaleOnda'] = ampiezza;
  }

  /**
   * CAMBIA LA RICETTA: un pacchetto intero (disegno, luce, geometria, riflesso
   * e i numeri) invece di quattro manopole.
   * ⚠ SI TIENE IN CACHE come gli altri: ricompilare avanti e indietro fra due
   * ricette mentre le si confronta farebbe singhiozzare la scena proprio nel
   * momento in cui si sta guardando la differenza.
   */
  cambiaRicettaAcqua(nome) {
    this._acque = this._acque || {};
    // ⚠ IL TETTO DEL PROFILO STA NELLA CHIAVE, e senza questo pezzo il resto non
    // servirebbe a niente: `vera` e `riflesso` si compilano nello shader, quindi
    // la stessa ricetta a due gradini diversi sono due MATERIALI diversi. Con la
    // chiave sul solo nome il primo compilato vincerebbe per sempre, e cambiare
    // qualità non toglierebbe una sola passata — in silenzio, che è il modo
    // peggiore.
    const t = this._tettoAcqua;
    const chiave = `ricetta:${nome}|${t.vera}|${t.riflesso ? 1 : 0}`;
    if (!this._acque[chiave]) {
      this._acque[chiave] = new Acqua(this.rig, { ricca: this.rig.fissi.acquaRicca, ricetta: nome, tetto: t });
    }
    this.acqua = this._acque[chiave];
    this._ricettaAcqua = nome;
    this._montaAcqua();
    return this.acqua.ricetta;
  }

  /**
   * QUELLO CHE VA RIFATTO A OGNI CAMBIO DI MATERIALE DELL'ACQUA.
   *
   * ⚠ E LA QUOTA DELLO SPECCHIO È LA RIGA CHE CI VOLEVA. Lo specchio è un
   * singleton del rig, ma nasce la PRIMA volta che un materiale col riflesso
   * lo chiede — col piano al valore di comodo (9,5). Partendo da un'acqua senza
   * specchio e passando a una che ce l'ha (dalla pillola 💧, o perché la scala
   * di qualità è risalita), lo specchio nasceva lì e nessuno gli diceva più
   * dov'è l'acqua: `seguiPeloAcqua` in main.js riapplica il piano solo quando
   * CAMBIA, e da fermi non cambia mai. Difetto muto: a schermo si legge come
   * «l'acqua non riflette», che è esattamente il verdetto già pagato una volta.
   */
  _montaAcqua() {
    this.matAcqua = this.acqua.materiale;
    for (const mesh of this._chunkMesh) {
      if (mesh.name.startsWith('acqua')) mesh.material = this.matAcqua;
    }
    if (this._quotaSpecchio !== undefined) this.acqua.quotaSpecchio(this._quotaSpecchio);
    // ⚠ E LE MISURE DELLE PASSATE, per la STESSA ragione della quota: specchio
    // e rifrazione nascono la prima volta che un materiale le chiede, con le
    // misure di fabbrica (512², ogni fotogramma). Partendo da un'acqua che non
    // le usa — ed è il caso normale da quando la ricetta di partenza è `ghibli`
    // — il profilo di qualità aveva già parlato quando non c'era nessuno ad
    // ascoltarlo. Misurato prima di questa riga: q0 con `lago` scelta a mano
    // teneva lo specchio a 512² ogni fotogramma invece dei 256² ogni due del
    // profilo, in silenzio.
    if (this._misuraAcqua) misuraPassate(this.rig, this._misuraAcqua);
  }

  /**
   * L'ACQUA DENTRO IL PROFILO DI QUALITÀ — la porta che il 31/08 non c'era.
   *
   * ⚠ IL DIFETTO CHE CURA, in una riga: l'unica leva che i profili avevano
   * sull'acqua era `ombraAcqua`, cioè un dettaglio; e intanto una ricetta
   * poteva accendere TRE rese complete della scena per fotogramma senza che
   * nessun gradino lo sapesse. Il livello «bassa» spegneva le ombre del sole e
   * lasciava intatte specchio, rifrazione e profondità — l'esatto contrario di
   * una scala di qualità.
   *
   * Due mestieri diversi, e vanno tenuti separati:
   *  · il TETTO (`acquaVera`, `acquaSpecchio`) vive nello shader: cambiarlo
   *    vuol dire ricostruire il materiale, e per questo passa dalla stessa
   *    porta che usa chi cambia ricetta a mano (cache compresa);
   *  · la MISURA (`acquaLato`, `acquaOgni`, `acquaProf`) è solo pixel, e si
   *    gira a caldo senza ricompilare niente.
   */
  applicaProfiloAcqua(p) {
    const vera = p.acquaVera ?? 3;
    const riflesso = p.acquaSpecchio !== false;
    const t = this._tettoAcqua;
    if (t.vera !== vera || t.riflesso !== riflesso) {
      this._tettoAcqua = { vera, riflesso };
      // ⚠ SI RICOSTRUISCE DALLO STESSO POSTO DA CUI SI CAMBIA A MANO: due
      // strade che fanno la stessa cosa divergono sempre, di solito il giorno
      // che se ne cambia una sola.
      if (this._ricettaAcqua) this.cambiaRicettaAcqua(this._ricettaAcqua);
      else this.cambiaStileAcqua(this.acqua.stile, this.acqua.onde, this.acqua.modello, this.acqua.riflesso, this.acqua.vera);
    }
    this._profAcqua = p.acquaProf ?? 1;
    this._misuraAcqua = { lato: p.acquaLato ?? 512, ogni: p.acquaOgni ?? 1, prof: this._profAcqua };
    misuraPassate(this.rig, this._misuraAcqua);
  }

  /** Dove sta il pelo da riflettere: un riflesso planare ha UN piano solo. */
  quotaSpecchioAcqua(y) { this._quotaSpecchio = y; this.acqua.quotaSpecchio(y); }

  /** Un impatto sull'acqua VIVA: anelli che si allargano da (x, z). */
  toccaAcqua(x, z, forza = 1) { this.acqua.tocca(x, z, forza); }

  /** Un segno di scia sull'acqua: `raggio` in blocchi (vedi il registro uScia in acqua.js). */
  sciaAcqua(x, z, raggio = 0.5) { this.acqua.scia(x, z, raggio); }

  /**
   * CAMBIA LO STILE DEL PELO, ricostruendo il materiale.
   *
   * ⚠ SI RICOSTRUISCE, NON SI RITOCCA, e non è pigrizia: il sorgente di un
   * `CustomMaterial` si compila una volta e resta in cache (vedi CLAUDE.md —
   * misurato: cambiando l'innesto e sporcando il materiale, il sorgente a
   * schermo NON cambia). Uno stile è GLSL diverso, quindi è un materiale nuovo.
   *
   * ⚠ E QUELLO VECCHIO NON SI BUTTA. Serve a scegliere, cioè a tornare indietro
   * un attimo dopo: ricompilare avanti e indietro fa singhiozzare la scena
   * proprio mentre si sta guardando la differenza. Sono cinque materiali e
   * cinque tessiture da 64 KB — si tengono.
   */
  cambiaStileAcqua(nome, onde = this.acqua.onde, modello = this.acqua.modello, riflesso = this.acqua.riflesso, vera = this.acqua.vera) {
    // ⚠ LA CHIAVE È LA COPPIA, non il solo nome: le onde cambiano il VERTEX
    // shader, quindi «rete ferma» e «rete che ondeggia» sono due sorgenti
    // diversi e due materiali diversi. Con la chiave sul solo nome il secondo
    // non sarebbe mai nato e il bottone del moto non avrebbe fatto niente —
    // in silenzio, che è il modo peggiore.
    const t = this._tettoAcqua;
    const impronta = (a) => `${a.stile}|${a.modello}|${a.onde ? 1 : 0}|${a.riflesso ? 1 : 0}|${a.vera}`;
    const chiave = `${nome}|${modello}|${onde ? 1 : 0}|${riflesso ? 1 : 0}|${vera}|${t.vera}|${t.riflesso ? 1 : 0}`;
    this._acque = this._acque || { [impronta(this.acqua)]: this.acqua };
    if (!this._acque[chiave]) {
      this._acque[chiave] = new Acqua(this.rig, { ricca: this.rig.fissi.acquaRicca, stile: nome, onde, modello, riflesso, vera, tetto: t });
    }
    this._ricettaAcqua = null;
    this.acqua = this._acque[chiave];
    this._montaAcqua();
    return this.acqua.stile;
  }

  // ── il prato ──────────────────────────────────────────────────────────────
  creaPrato(max) { const p = new Prato(this.scena, this.rig, max); this._materiali.push(p.materiale); return p; }
  scriviPrato(prato, n, erba, nVicine = n) { prato.scrivi(n, erba, nVicine); }
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

// IL PRATO — le lamelle d'erba, rifatte con quello che dà Babylon.
//
// ⚠ NON È UN PORTING, ED È UNA CORREZIONE. La prima stesura di questo file era
// uno `ShaderMaterial` con dentro il vertex shader di Leafy-Lantern ricopiato:
// funzionava, e sbagliava due volte. Primo, uno ShaderMaterial **non riceve le
// luci né le ombre della scena** — cioè avrei riportato a mano l'unica cosa per
// cui abbiamo cambiato motore. Secondo, riscrivere il codice di prima su una
// libreria nuova è il modo migliore per portarsi dietro anche i suoi limiti.
//
// Quello che si tiene di Lantern sono le REGOLE DI GIOCO — quali celle hanno
// erba, quante lamelle, come si dirada con la distanza — che stanno in
// `src/vegetazione/erba.js` e non sanno cosa sia una GPU. Come si disegnano è
// tutto da rifare, e qui si rifà così:
//
//  · `CustomMaterial` invece di uno shader nostro. Sotto è uno StandardMaterial,
//    quindi l'erba prende le luci della scena, la NEBBIA e — la cosa che conta —
//    le OMBRE A CASCATA, gratis. Noi ci innestiamo solo il vento, che è l'unica
//    parte che nessun motore può dare: è geometria animata per istanza.
//  · THIN INSTANCE per il disegno. Il buffer delle matrici è obbligatorio (l'ho
//    letto nel sorgente: `thinInstanceCount` si tara su `matrixData.length/16`),
//    ma non deve costare: si riempie di identità una volta e a ogni semina si
//    riscrivono i TRE float della traslazione. Rotazione, altezza, larghezza e
//    colori restano attributi nostri.
//    In cambio Babylon sa dove stanno le istanze. In Lantern l'erba aveva il
//    culling SPENTO con una sfera di raggio diecimila: ogni lamella partiva
//    sempre, guardassi o no da quella parte.

import { Mesh } from '@babylonjs/core/Meshes/mesh.js';
import { VertexData } from '@babylonjs/core/Meshes/mesh.vertexData.js';
import { Vector2, Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector.js';
import { Color3 } from '@babylonjs/core/Maths/math.color.js';
import { CustomMaterial } from '@babylonjs/materials/custom/customMaterial.js';
import { applicaStilePiatto, aggiungiDefinizioniFragment } from './stile.js';
import '@babylonjs/core/Meshes/thinInstanceMesh.js';

export class Prato {
  constructor(scena, rig, max) {
    this.scena = scena;
    this.rig = rig;
    this.max = max;

    this.mesh = new Mesh('prato', scena);
    const vd = new VertexData();
    // La lamella è un QUAD, e i suoi vertici portano solo la forma: (-0.5..0.5)
    // in larghezza, 0..1 in altezza. Tutto il resto — quanto è alta, quanto
    // larga, come è girata — arriva per istanza. Quattro vertici per lamella,
    // come in Lantern: quella parte era giusta.
    vd.positions = [-0.5, 0, 0, 0.5, 0, 0, 0.5, 1, 0, -0.5, 1, 0];
    vd.normals = [0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0];   // le raddrizza il vertex
    vd.uvs = [0, 0, 1, 0, 1, 1, 0, 1];
    vd.indices = [0, 2, 1, 0, 3, 2];                     // avvolgimento di Babylon
    vd.applyToMesh(this.mesh, false);

    this.mesh.material = this._materiale();
    this.mesh.isPickable = false;
    this.mesh.receiveShadows = true;      // ⚠ falso di fabbrica: vedi CLAUDE.md
    this.mesh.doNotSyncBoundingInfo = true;
    this.mesh.alwaysSelectAsActiveMesh = true;
    // ⚠ L'ERBA NON PROIETTA OMBRA, ed è una decisione, non una dimenticanza.
    // Duecentomila quad dentro la mappa a cascata la riempiono di rumore e
    // costano quanto tutto il resto messo insieme; l'ombra che ne verrebbe è
    // sotto il texel. In Lantern era la stessa scelta, presa per lo stesso
    // motivo. Se un giorno si vuole, si mette solo la cascata più vicina.

    this.matrici = new Float32Array(max * 16);
    for (let i = 0; i < max; i++) {
      const o = i * 16;
      this.matrici[o] = 1; this.matrici[o + 5] = 1; this.matrici[o + 10] = 1; this.matrici[o + 15] = 1;
    }
    // ⚠ STATICA E MAI PIÙ TOCCATA. Prima la usavo come portatrice della
    // posizione — tre float per lamella invece di sedici, sembrava furbo. Poi
    // ho misurato: quel buffer è 16 float per istanza, cioè 6,5 MB dei 10,5 che
    // si spedivano a ogni semina, per portare TRE numeri che avevamo già in
    // «iPos». Adesso resta identità per sempre, si carica una volta all'avvio, e
    // la posizione la legge il vertex shader dal nostro attributo. Il carico per
    // semina è sceso da 10,5 MB a 5,6.
    this.mesh.thinInstanceSetBuffer('matrix', this.matrici, 16, true);
    this.mesh.thinInstanceCount = 0;
    this._collegati = false;
  }

  _materiale() {
    // ⚠ LO STESSO STILE DEL MONDO, dallo stesso posto. L'erba con una legge di
    // luce sua e il terreno con un'altra è il difetto che in Leafy-Lantern è
    // stato bocciato tre volte: sul confine dell'ombra il filo e il blocco sotto
    // stavano su due leggi diverse e si vedeva. Qui il colore piatto è la nostra
    // sfumatura base→punta, e l'ombra la mette `stile.js`.
    // ⚠ `facce: false`, E QUESTA ERA LA CAUSA DELLE «LINEETTE DI LUCE A CASO».
    // Il termine «faccia al sole» è la verità geometrica su un CUBO: una faccia
    // che guarda a nord, col sole a sud, è in ombra e basta. Su una lamella
    // d'erba non vuol dire niente — e peggio, la sua normale dipende da quanto
    // il VENTO la sta piegando in quell'istante. Col sole basso il prodotto
    // scalare cambia segno da un filo all'altro, quindi i fili si accendevano e
    // si spegnevano a caso, e ondeggiando pure: il committente le ha viste come
    // «tante lineette di luce a caso», ed erano proprio quelle.
    // Un filo d'erba non ha un davanti e un dietro. L'ombra gliela dà la mappa.
    const m = applicaStilePiatto(new CustomMaterial('erba', this.scena), this.rig, 'vErbaCol', { facce: false });
    m.backFaceCulling = false;            // una lamella si guarda da due lati

    m.AddAttribute('iPos');               // base (xyz) + livello di diradamento (w)
    m.AddAttribute('iDati');              // (rotazione, altezza, larghezza, fase)
    m.AddAttribute('iCol');               // colore alla base = il blocco sotto
    m.AddAttribute('iColCima');           // e alla punta: rampa, due gradini più chiara
    // ⚠ NIENTE `setFloat`: CustomMaterial È uno StandardMaterial, non uno
    // ShaderMaterial. Le uniform nostre le tiene in una mappa interna e le
    // rilega a ogni disegno da sola. Quindi si passano OGGETTI e poi si mutano:
    // il legame resta valido, e non si alloca un Vector3 per fotogramma.
    // (Il solo `uTempo` è un numero, e i numeri non si mutano: quello va
    // riscritto nella mappa. È l'unico punto in cui tocchiamo un campo privato,
    // ed è qui apposta — se Babylon lo cambia, si aggiusta in una riga.)
    this.uVento  = new Vector4(1, 0, 0.22, 0.35);
    this.uCentro = new Vector3(0, 0, 0);
    this.uOcchio = new Vector3(0, 0, 0);
    this.uSfuma  = new Vector2(60, 96);
    m.AddUniform('uTempo', 'float', 0);
    m.AddUniform('uVento', 'vec4', this.uVento);
    m.AddUniform('uCentro', 'vec3', this.uCentro);
    m.AddUniform('uOcchio', 'vec3', this.uOcchio);
    m.AddUniform('uSfuma', 'vec2', this.uSfuma);

    m.Vertex_Definitions(`
      attribute vec4 iPos;      // base della lamella (xyz) e livello di diradamento (w)
      attribute vec4 iDati;
      attribute vec3 iCol;
      attribute vec3 iColCima;
      varying vec3 vErbaCol;
      // ⚠ GLOBALE, NON VARYING: serve solo fra due innesti dello stesso main.
      // Babylon li stampa a due righe di distanza (CUSTOM_VERTEX_UPDATE_POSITION
      // e ..._NORMAL), quindi una locale basterebbe — ma dichiararla qui rende
      // esplicito che la piega la calcola uno e la usa l'altro.
      vec2 vErbaPiega;
    `);

    // ⚠ SI LAVORA IN SPAZIO OGGETTO. La matrice dell'istanza porta la sola
    // traslazione, quindi qui `positionUpdated` è la lamella attorno alla sua
    // base e il mondo se ne occupa dopo. È il motivo per cui questo innesto è
    // corto: non c'è nessuna coordinata da rimettere a posto a mano.
    m.Vertex_Before_PositionUpdated(`
      float alt = position.y;

      // il colore: base = il blocco sotto, punta = la rampa stagionale due
      // gradini più chiara. La sfumatura è LEGGERA per costruzione — in Lantern
      // era «vCol · 1,70», un verde inventato che a distanza sembrava emissivo.
      vErbaCol = mix(iCol, iColCima, pow(alt, 1.4));

      // IL CONGEDO CON LA DISTANZA. La lamella non si accorcia e non svanisce:
      // converge al colore esatto del blocco sotto, quindi quando sparisce è
      // già indistinguibile dal terreno. Due animazioni diverse sono state
      // bocciate prima di arrivare a questa.
      // ⚠ LA POSIZIONE VIENE DAL NOSTRO ATTRIBUTO, non dalla matrice
      // dell'istanza. Ci ho provato con «world3» e non ne vale la pena per due
      // ragioni, tutte e due misurate: quegli attributi esistono solo dentro il
      // ramo INSTANCES (e Babylon compila anche la variante senza, che allora
      // non compilava affatto e lasciava la mesh invisibile senza dire niente),
      // e la matrice costa 16 float per istanza contro i 4 di «iPos».
      // Qui la matrice resta identità, quindi «positionUpdated» è già mondo.
      vec3 baseMondo = iPos.xyz;
      // ⚠ UNA ESPRESSIONE, UNA RIGA. Il processore di shader di Babylon lavora
      // RIGA PER RIGA: un'espressione spezzata su più righe gli sfugge e il
      // GLSL esce malformato. Mi ha dato «0:320: '?' : syntax error» su un
      // ternario andato a capo, e — peggio — «forceCompilation» diceva «ok»
      // lo stesso: l'errore vero sta in «subMesh.effect.getCompilationError()».
      float via = clamp((distance(baseMondo.xz, uOcchio.xz) - uSfuma.x) / max(uSfuma.y - uSfuma.x, 0.001), 0.0, 1.0);
      vErbaCol = mix(vErbaCol, iCol, smoothstep(0.0, 0.5, via));

      // IL VENTO: due onde sfasate dalla POSIZIONE (il prato si piega a ondate,
      // non tutto insieme) più un tremolio corto per ciuffo.
      float onda  = sin(uTempo * 1.15 + dot(baseMondo.xz, uVento.xy) * 0.30 + iDati.w);
      float onda2 = sin(uTempo * 2.30 - dot(baseMondo.xz, uVento.xy) * 0.11 + iDati.w * 1.7);
      float tremo = sin(uTempo * 4.10 + iDati.w * 6.3) * 0.18;
      float piega = (uVento.z + uVento.w * (onda * 0.75 + onda2 * 0.35) + tremo) * 0.22;

      // chi passa apre il ciuffo e si richiude da solo: niente stato da tenere,
      // è tutta geometria
      vec2 d = baseMondo.xz - uCentro.xz;
      float dd = length(d);
      vec2 spinta = vec2(0.0);
      if (dd < 0.60 && abs(baseMondo.y - uCentro.y) < 1.6) { spinta = normalize(d + vec2(1e-4)) * pow(1.0 - dd / 0.60, 2.0) * 0.45; }

      // RETTANGOLO, NON LAMA: la larghezza si stringe appena in cima (0.82), non
      // fino a una punta. È la differenza fra un filo d'erba e una scheggia.
      float largo = iDati.z * (1.0 - alt * 0.18);
      float cc = cos(iDati.x), ss = sin(iDati.x);
      vec3 lam = vec3(position.x * largo * cc, alt * iDati.y, position.x * largo * ss);

      // la piega cresce col QUADRATO dell'altezza: la base resta piantata e la
      // cima fa tutto il movimento, che è come si piega un ciuffo vero
      float k = alt * alt;
      vec2 dir = uVento.xy * piega + spinta;
      lam.x += dir.x * k;
      lam.z += dir.y * k;
      lam.y -= dot(dir, dir) * k * 0.30;

      // ⚠ DUE CENTIMETRI SOTTO IL PELO DEL BLOCCO. Con la base esattamente a
      // quota, il quad e la faccia superiore del blocco sono COMPLANARI, e due
      // superfici complanari in z-buffer litigano: è la lineetta nera che
      // compare e sparisce alla base dei ciuffi muovendo la camera.
      lam.y -= 0.02;

      vErbaPiega = dir;
      positionUpdated = baseMondo + lam;
    `);

    // ⚠ LA NORMALE GUARDA IL CIELO, non di lato. Una lamella è un quad
    // verticale: con la sua normale vera, un prato fitto è un muro di lamette
    // quasi nere, perché il sole le prende di taglio. Puntarla in su e piegarla
    // col vento la fa illuminare come il terreno su cui sta — che è quello che
    // l'occhio si aspetta da un prato.
    m.Vertex_Before_NormalUpdated(`
      normalUpdated = normalize(vec3(vErbaPiega.x * 0.5, 1.0, vErbaPiega.y * 0.5));
    `);

    aggiungiDefinizioniFragment(m, `
      varying vec3 vErbaCol;
    `);

    this.materiale = m;
    return m;
  }

  /** I dati della semina diventano istanze. `e` è l'oggetto Erba. */
  scrivi(n, e) {
    if (n > this.max) n = this.max;
    if (!this._collegati) {
      this.mesh.thinInstanceSetBuffer('iPos', e.iPos, 4, false);
      this.mesh.thinInstanceSetBuffer('iDati', e.iDati, 4, false);
      this.mesh.thinInstanceSetBuffer('iCol', e.iCol, 3, false);
      this.mesh.thinInstanceSetBuffer('iColCima', e.iColCima, 3, false);
      this._collegati = true;
    }
    // ⚠ PARZIALE, NON «aggiornato». È LA STESSA TRAPPOLA DI THREE, su un altro
    // motore e con un altro nome. `thinInstanceBufferUpdated(kind)` spedisce
    // l'INTERO array — cioè il TETTO, mezzo milione di istanze — anche quando
    // ce ne sono centomila. Misurato qui: 12,4 ms contro 1,9. In Leafy-Lantern
    // la stessa cosa costava 8,1 ms finché non ho scoperto `addUpdateRange`.
    //
    // Vale la pena scriverlo come regola, perché è la seconda volta: il carico
    // parziale è SEMPRE da chiedere, e il difetto non dà nessun segnale — non
    // un errore, non un avviso, solo un fotogramma che si ferma ogni tanto.
    for (const k of ['iPos', 'iDati', 'iCol', 'iColCima']) {
      this.mesh.thinInstancePartialBufferUpdate(k, n, 0);
    }
    this.mesh.thinInstanceCount = n;
  }

  /** Le grandezze di gioco diventano uniform. Una volta per fotogramma. */
  anima(e) {
    this.materiale._newUniformInstances['float-uTempo'] = e._t;
    if (e.vento) this.uVento.set(e.vento.x, e.vento.z, e.vento.fondo, e.vento.raffica);
    if (e.centro) this.uCentro.set(e.centro.x, e.centro.y, e.centro.z);
    if (e.occhio) this.uOcchio.set(e.occhio.x, e.occhio.y, e.occhio.z);
    if (e.sfuma) this.uSfuma.set(e.sfuma.da, e.sfuma.a);
  }

  mostra(on) { this.mesh.setEnabled(!!on); }
}

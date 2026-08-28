// LE PARTICELLE — e le fa Babylon, non noi.
//
// ⚠ QUESTA VOLTA SI USA QUELLO CHE C'È, ed è esattamente il motivo per cui
// siamo migrati. In Leafy-Lantern le particelle erano un sistema nostro: pool,
// buffer, ordinamento, aggiornamento a mano. Qui `ParticleSystem` fa tutto, e in
// più esiste `GPUParticleSystem` che tiene l'intera simulazione sulla scheda —
// la CPU non tocca una particella, nemmeno per aggiornarne la posizione.
//
// ⚠ SI PREFERISCE LA VARIANTE GPU QUANDO C'È, e il ripiego è dichiarato: senza
// transform feedback (WebGL1) si torna a quella CPU, che è la stessa API e la
// stessa resa, solo con un costo per particella invece che zero.
//
// ── QUELLO CHE ANCORA NON FANNO, detto in chiaro ───────────────────────────
// ⚠ LE PARTICELLE NON PRENDONO LE LAMPADE. In Lantern sì, e per VERTICE, con la
// stessa identica formula del mondo (`GLSL_LUCI_VERTICE`) — «perché se fosse
// anche solo simile si vedrebbe». Qui vorrebbe dire scrivere un effetto
// particellare tutto nostro (`setCustomEffect`), cioè rinunciare a metà del
// motivo per cui si usa il sistema del motore. Sta nello zoo apposta: è una
// differenza da GUARDARE prima di decidere se pagarla.

import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem.js';
import { GPUParticleSystem } from '@babylonjs/core/Particles/gpuParticleSystem.js';
// ⚠ E LA PIATTAFORMA VA IMPORTATA A PARTE, che è la STESSA trappola degli
// shader (vedi `motore.js`): con gli import profondi Babylon non registra da
// solo la classe che fa girare le particelle su WebGL2. E il tranello qui è
// peggiore, perché `GPUParticleSystem.IsSupported` risponde SÌ lo stesso — dice
// che la SCHEDA regge, non che il codice sia stato caricato. Si scopre alla
// prima particella: «The WebGL2ParticleSystem class is not available!».
import '@babylonjs/core/Particles/webgl2ParticleSystem.js';
import '@babylonjs/core/Shaders/gpuUpdateParticles.vertex.js';
import '@babylonjs/core/Shaders/gpuUpdateParticles.fragment.js';
import '@babylonjs/core/Shaders/gpuRenderParticles.vertex.js';
import '@babylonjs/core/Shaders/gpuRenderParticles.fragment.js';
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';
import { Mesh } from '@babylonjs/core/Meshes/mesh.js';
import { Color4 } from '@babylonjs/core/Maths/math.color.js';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture.js';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { Constants } from '@babylonjs/core/Engines/constants.js';
import '@babylonjs/core/Shaders/particles.vertex.js';
import '@babylonjs/core/Shaders/particles.fragment.js';
import '@babylonjs/core/ShadersWGSL/particles.vertex.js';
import '@babylonjs/core/ShadersWGSL/particles.fragment.js';

/**
 * LA FIGURA DI UNA PARTICELLA: un quadratino pieno, e basta.
 *
 * ⚠ NIENTE ALONE SFUMATO, ed è una scelta di stile, non una scorciatoia. La
 * texture di fabbrica di ogni motore è una macchia gaussiana: in un gioco fatto
 * di tagli netti — ombre a tre gradini, pozze ad anelli, colori piatti — una
 * macchia sfumata è l'unica cosa morbida a schermo e si vede subito che viene
 * da un'altra parte. Un quadrato di quattro texel opachi costa niente e sta
 * dentro lo stile.
 */
function figuraQuadrata(scena) {
  const d = new Uint8Array(4 * 4 * 4).fill(255);
  const t = RawTexture.CreateRGBATexture(d, 4, 4, scena, false, false, Texture.NEAREST_SAMPLINGMODE);
  t.wrapU = t.wrapV = Texture.CLAMP_ADDRESSMODE;
  return t;
}

/**
 * LE RICETTE, in tabella.
 *
 * ⚠ TABELLA, NON `if` SPARSI — regola della casa. Chi aggiunge un effetto
 * aggiunge UNA RIGA, e la trova. `colore` e `colore2` sono gli estremi della
 * sfumatura, `fine` il colore a cui si spegne.
 */
export const RICETTE = {
  // ⚠ IL SEGNO DELLA GRAVITÀ: POSITIVO CADE, NEGATIVO SALE. Detto qui perché la
  // prima stesura l'aveva sbagliato su tre ricette su quattro — il fumo cadeva
  // e la neve saliva — e a schermo sembrava «un effetto strano» invece che un
  // segno girato. Una convenzione che non sta scritta si sbaglia.
  // `verso` è il cono di uscita; `quota` alza il punto di emissione.
  lucciole: {
    quante: 260, vita: [2.2, 4.5], taglia: [0.06, 0.14], ritmo: 70,
    colore: [1.0, 0.95, 0.55, 1], colore2: [0.55, 1.0, 0.6, 1], fine: [0.3, 0.8, 0.4, 0],
    forma: { raggio: 3.2, altezza: 2.4 }, velocita: [0.15, 0.5],
    // galleggiano: né su né giù, e il cono è quasi sferico
    gravita: 0, verso: [[-1, -0.6, -1], [1, 1, 1]],
  },
  fumo: {
    quante: 160, vita: [1.8, 3.4], taglia: [0.35, 1.2], ritmo: 40,
    colore: [0.82, 0.84, 0.88, 0.85], colore2: [0.7, 0.72, 0.78, 0.7], fine: [0.6, 0.62, 0.68, 0],
    forma: { raggio: 0.35, altezza: 0.3 }, velocita: [0.6, 1.2],
    // ⚠ SALE, quindi gravità NEGATIVA: è più leggero dell'aria, non più pesante.
    gravita: -0.9, verso: [[-0.25, 1, -0.25], [0.25, 1, 0.25]],
  },
  scintille: {
    quante: 400, vita: [0.6, 1.4], taglia: [0.05, 0.11], ritmo: 220,
    colore: [1.0, 0.72, 0.28, 1], colore2: [1.0, 0.42, 0.18, 1], fine: [0.8, 0.2, 0.1, 0],
    forma: { raggio: 0.25, altezza: 0.2 }, velocita: [2.6, 5.0],
    // ⚠ L'ARCO È IL PUNTO: sparate in su forte e tirate giù dalla gravità. Con
    // la gravità al contrario salgono e basta, e una scintilla che non ricade
    // non sembra una scintilla — sembra una bolla.
    gravita: 9, verso: [[-0.6, 1, -0.6], [0.6, 1, 0.6]],
  },
  neve: {
    quante: 700, vita: [5.0, 9.0], taglia: [0.07, 0.15], ritmo: 120,
    colore: [1, 1, 1, 1], colore2: [0.9, 0.95, 1, 1], fine: [0.85, 0.9, 1, 0],
    // ⚠ NASCE IN ALTO E SU TUTTA LA PIAZZOLA: una nevicata che esce da un punto
    // è una fontana. Il raggio è la METÀ della piazzola, non un ciuffo.
    forma: { raggio: 14, altezza: 0.5 }, quota: 16, velocita: [0.2, 0.6],
    gravita: 1.1, verso: [[-0.3, -1, -0.3], [0.3, -0.6, 0.3]],
  },
};

export class Particelle {
  constructor(scena, rig) {
    this.scena = scena;
    this.rig = rig;
    this.figura = figuraQuadrata(scena);
    this.sistemi = [];
    /** L'interruttore generale. ⚠ SERVE UNA BANDIERA e non basta `stop()`: il
     *  taglio per distanza gira a ogni fotogramma e riaccenderebbe subito
     *  quello che l'interruttore ha appena spento. Due comandi sullo stesso
     *  oggetto vogliono un arbitro, se no vince l'ultimo che ha parlato. */
    this.accese = true;
    /** Lo dichiara il motore, non chi guarda: serve a dirlo nel pannello. */
    this.suGPU = GPUParticleSystem.IsSupported;
  }

  /** Accende un effetto in un punto. Torna il sistema, per poterlo spegnere. */
  accendi(nome, { x, y, z }) {
    const r = RICETTE[nome];
    if (!r) throw new Error('ricetta sconosciuta: ' + nome);
    // ⚠ E SE LA VARIANTE GPU NON SI COSTRUISCE, SI RIPIEGA — non si esplode. Un
    // effetto è un ornamento: farlo mancare deve costare una riga in console,
    // non una pagina bianca. (È successo: la prima volta ha buttato giù tutto lo
    // zoo perché mancava un import.)
    let s = null;
    if (this.suGPU) {
      try { s = new GPUParticleSystem('p:' + nome, { capacity: r.quante }, this.scena); }
      catch (e) { console.warn('particelle su GPU non disponibili, ripiego sulla CPU:', e.message); this.suGPU = false; }
    }
    if (!s) s = new ParticleSystem('p:' + nome, r.quante, this.scena);
    s.particleTexture = this.figura;
    // ⚠ L'EMITTENTE È UNA MESH VUOTA E NON UN PUNTO, ed è l'unico modo che il
    // motore dà per spegnere davvero un sistema. Leggendo `scene.pure.js`: un
    // sistema entra fra gli attivi se `isStarted() && (!emitter.position ||
    // emitter.isEnabled())`. Con un Vector3 la prima condizione è sempre vera
    // (un vettore non ha `.position`) e la seconda non si valuta: il sistema è
    // SEMPRE attivo. E `stop()` non aiuta — sta scritto nella sua stessa
    // documentazione, «this will still be true after stop is called», e sulla
    // variante GPU «rendering is still happening but the system is frozen».
    // Con una mesh, `setEnabled(false)` lo toglie sia dall'aggiornamento sia dal
    // disegno. Costa un nodo vuoto per effetto.
    const ancora = new Mesh('ancora:' + nome, this.scena);
    ancora.position.set(x, y + (r.quota || 0), z);
    ancora.isVisible = false;
    ancora.isPickable = false;
    s.emitter = ancora;
    s.minEmitBox = new Vector3(-r.forma.raggio, -r.forma.altezza, -r.forma.raggio);
    s.maxEmitBox = new Vector3(r.forma.raggio, r.forma.altezza, r.forma.raggio);
    s.color1 = new Color4(...r.colore);
    s.color2 = new Color4(...r.colore2);
    s.colorDead = new Color4(...r.fine);
    s.minSize = r.taglia[0]; s.maxSize = r.taglia[1];
    s.minLifeTime = r.vita[0]; s.maxLifeTime = r.vita[1];
    s.emitRate = r.ritmo;
    // ⚠ FUSIONE NORMALE, NON ADDITIVA. L'additiva è la scelta di fabbrica di
    // ogni motore perché «brilla», e in un mondo a colori piatti brilla e basta:
    // dieci particelle sovrapposte diventano bianco puro, cioè l'unica zona
    // dello schermo senza colore. Con la normale restano del loro colore.
    s.blendMode = ParticleSystem.BLENDMODE_STANDARD;
    // positivo cade, negativo sale: vedi la nota in cima alla tabella
    s.gravity = new Vector3(0, -r.gravita, 0);
    s.direction1 = new Vector3(...r.verso[0]);
    s.direction2 = new Vector3(...r.verso[1]);
    s.minEmitPower = r.velocita[0]; s.maxEmitPower = r.velocita[1];
    s.updateSpeed = 0.012;
    s.start();
    this.sistemi.push(s);
    return s;
  }

  /**
   * SPEGNE I SISTEMI LONTANI, e serve per due ragioni insieme.
   *
   * ⚠ NON C'È NESSUN TAGLIO PER DISTANZA DI FABBRICA: un sistema di particelle
   * continua a simulare e a disegnare anche se sta a duecento blocchi e non lo
   * guarda nessuno. Nello zoo si è visto subito — dalla piazzola del corridoio
   * si vedeva nevicare quella delle particelle, due stanze più in là. Uno zoo
   * che non isola dà risposte sbagliate.
   *
   * ⚠ E SI FERMA L'EMISSIONE, NON SI NASCONDE LA MESH: fermando l'emittente le
   * particelle già in volo finiscono la loro vita e il sistema si svuota da
   * solo, quindi tornando indietro non ricompare un fotogramma di roba
   * congelata. Nascondere e riapparire darebbe uno scatto.
   */
  aggiorna(camera, portata = 90) {
    const p = camera.globalPosition || camera.position;
    for (const s of this.sistemi) {
      const e = s.emitter.position;
      const vuole = this.accese
        && (e.x - p.x) ** 2 + (e.y - p.y) ** 2 + (e.z - p.z) ** 2 <= portata * portata;
      if (vuole !== s.emitter.isEnabled()) s.emitter.setEnabled(vuole);
    }
  }

  /** Quante particelle sono vive adesso, in tutto: è il numero da guardare. */
  get vive() { return this.sistemi.reduce((n, s) => n + (s.getActiveCount ? s.getActiveCount() : s.particles.length), 0); }

  mostra(on) {
    this.accese = !!on;
    for (const s of this.sistemi) if (!on) s.emitter.setEnabled(false);
  }

  spegniTutte() {
    for (const s of this.sistemi) { s.emitter.dispose(); s.dispose(); }
    this.sistemi.length = 0;
  }
}

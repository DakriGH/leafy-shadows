// LA RESA DEL NUCLEO — un programma, un formato, un disegno per chunk.
//
// Lo stile è quello di Leafy espresso sulla luce COTTA (docs/RIFONDAZIONE.md,
// tecnica 1): la luce del cielo e quella di blocco arrivano dal vertice, il
// ciclo del giorno le colora, «una faccia vede il sole o no» resta un gradino,
// l'ombra è del colore del cielo, le lampade fanno bande. L'unica cosa per
// pixel è l'ombra direzionale del sole via HORIZON MAPPING sulla mappa delle
// altezze (tecnica 1, seconda parte): pochi passi verso il sole, niente mappa
// d'ombra, niente acne per costruzione. È accendibile, per misurarla.
import { compila } from './gl.js';
import { BYTE_VERTICE, indiciCondivisi, QUAD_MAX } from './formato.js';
import { prospettiva, guarda, moltiplica, pianiFrustum, scatolaNelFrustum } from './matrici.js';

const VS = `#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale vento materia · B: y cielo blocco (nucleo/formato.js)
layout(location = 1) in uvec4 aC;   // r g b 0
uniform mat4 uVP;
uniform vec3 uChunk;
uniform float uTempo;
uniform vec3 uSoleVerso;      // da dove ARRIVA la luce (verso il basso)
uniform vec3 uSoleCol;
uniform float uSoleForza;
uniform vec3 uCieloCol;       // il colore dell'ombra: È il cielo
uniform vec4 uMaterie[16];    // per materia: emissione, brillio, riflesso, (libero)
uniform vec2 uNebbia;
uniform vec3 uCam;
flat out vec3 vColOmbra;      // quello che si vede anche all'ombra del sole
flat out vec3 vColSole;       // quello che il sole aggiunge (l'horizon map lo può togliere)
out float vNebbia;
out vec3 vPos;
void main() {
  // ⚠ POSIZIONI IN SEDICESIMI (nucleo/formato.js): x e z con un blocco di margine, y dallo scarto del chunk
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  uint ni = (A >> 18u) & 31u;
  uint vento = (A >> 23u) & 1u;
  uint materia = (A >> 24u) & 15u;
  if (vento == 1u) {   // la cima di un filo d'erba ondeggia
    float f = sin(uTempo * 1.7 + p.x * 0.9 + p.z * 1.3);
    p.x += f * 0.18; p.z += cos(uTempo * 1.1 + p.z * 0.7 + p.x * 0.4) * 0.12;
  }
  // la normale a 27: facce, smussi e angoli del supercubo
  vec3 n = normalize(vec3(float(ni / 9u) - 1.0, float((ni / 3u) % 3u) - 1.0, float(ni % 3u) - 1.0));
  float cielo = float((B >> 16u) & 15u) / 15.0;
  float blocco = float((B >> 20u) & 15u) / 15.0;
  // ⚠ IL COLORE È QUELLO COTTO DAL MESHER (la palette di Leafy), in spazio lineare
  vec3 base = pow(vec3(aC.xyz) / 255.0, vec3(2.2));
  vec4 mat = uMaterie[materia];
  // ⚠ LA FACCIA VEDE IL SOLE O NO: la soglia a 0,12 è la cura dell'acne di Leafy.
  // L'erba (vento) è tinta piatta: vede sempre il sole.
  float faccia = (vento == 1u) ? 1.0 : step(0.12, dot(n, -uSoleVerso));
  // ⚠ IL CIELO COTTO È A GRADINI, come tutto il resto: quattro bande. Vede il
  // sole solo chi ha il cielo pieno (una grotta non prende il sole diretto, e
  // l'imbocco sfuma a scalini); l'ombra resta del colore del cielo.
  float cieloBande = floor(cielo * 4.0 + 0.5) / 4.0;
  float sole = floor(step(0.99, cielo) * faccia * uSoleForza * 3.0 + 0.5) / 3.0;   // tre bande: l'ombra è un gradino
  float lampada = floor(blocco * 4.0 + 0.5) / 4.0;                                  // quattro bande, come le lampade di Leafy
  // ⚠ AL SOLE PIENO IL COLORE È QUELLO DELLA PALETTE, esatto: il sole non
  // «aggiunge», SOSTITUISCE l'ombra (confronto affiancato col gioco: sommando
  // sole e cielo il nucleo usciva più chiaro del gioco di un quarto).
  // ⚠ L'OMBRA NON È NERA, È DEL COLORE DEL CIELO: moltiplica, non sottrae; in
  // grotta (cielo cotto basso) scende a gradini.
  vec3 ombra = base * uCieloCol * (0.25 + 0.75 * cieloBande);
  // ⚠ LE POZZE DEI LAMPIONI SONO CALDE E PIENE: 1,25 sopra il bianco, o di
  // notte (cielo cotto scuro) restavano timide accanto alla testa emissiva.
  vec3 lume = base * vec3(1.30, 1.02, 0.58) * lampada;
  vec3 pieno = base * uSoleCol;
  if (mat.x > 0.0) { ombra = mix(ombra, base * 1.15, mat.x); pieno = mix(pieno, base * 1.15, mat.x); }   // emissiva: scavalca ombra e notte
  // vColOmbra + vColSole*luce nel fragment: con luce = 1 (sole) da' pieno, con 0 da' ombra
  vec3 colSole = (pieno - ombra) * sole;
  ombra += lume;
  vColOmbra = ombra;
  vColSole = colSole;
  float d = distance(p, uCam);
  vNebbia = clamp((d - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`;

const FS = `#version 300 es
precision mediump float;
precision mediump sampler2D;
flat in vec3 vColOmbra;
flat in vec3 vColSole;
in float vNebbia;
in vec3 vPos;
uniform vec3 uNebbiaCol;
uniform float uOmbra;            // 1 = horizon mapping acceso
uniform highp float uTaglio;     // sotto questa quota non si disegna (la passata dello specchio)
// ⚠ STESSA PRECISIONE DEL VERTEX: un uniform condiviso fra i due shader deve
// avere la stessa precisione, o il link fallisce («precisions differ»).
uniform highp vec3 uSoleVerso;
uniform sampler2D uAltezze;      // R8: quota della cima / 255, un texel per colonna
uniform vec4 uAltRett;           // x0, z0, 1/larghezza, 1/profondita
out vec4 colore;
void main() {
  if (vPos.y < uTaglio) discard;   // lo specchio non guarda sott'acqua
  float luce = 1.0;
  if (uOmbra > 0.5) {
    // ⚠ HORIZON MAPPING: si cammina verso il sole sulla mappa delle altezze.
    // Otto passi a passo crescente: vicino fitto (il bordo dell'ombra), lontano
    // rado (l'ombra della collina). Niente texel d'ombra, niente acne.
    vec3 dir = -uSoleVerso;
    vec3 q = vPos + dir * 0.35 + vec3(0.0, 0.15, 0.0);
    float passo = 0.6;
    for (int i = 0; i < 8; i++) {
      q += dir * passo;
      vec2 uv = (q.xz - uAltRett.xy) * uAltRett.zw;
      float h = texture(uAltezze, uv).r * 255.0;
      if (h > q.y) { luce = 0.0; break; }
      passo *= 1.35;
    }
  }
  vec3 c = vColOmbra + vColSole * luce;
  // ⚠ I CONTI SONO IN SPAZIO LINEARE (il colore cotto viene decodificato nel
  // vertex): qui si torna in sRGB, o tutto esce scuro e saturo.
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, 1.0);
}`;

// ── L'ACQUA: un programma suo, una passata sola, dopo i solidi ──────────────
// La legge del lago, parola per parola del committente («a 10 blocchi di
// profondità il tutto diventa violaceo ed è leggermente opaco; salendo hue
// shift e trasparenza maggiore verso la superficie»; «radente, il lago diventa
// il cielo capovolto»): superficie azzurra e trasparente, fondo violaceo e
// quasi pieno, la profondità viene dal VERTICE (il mesher la sa), il cielo
// capovolto è fresnel verso il colore della nebbia/cielo. Onde nel vertex, un
// brillio a gradino verso il sole. Niente rifrazione, niente depth pass.
//
// ⚠ LO SPECCHIO (F3, misurato): una passata in più PRIMA dei solidi, a mezza
// risoluzione, con la camera specchiata rispetto al pelo (matrice di
// riflessione: stesso VP per la posizione a schermo, quindi il fragment
// dell'acqua legge il riflesso con gl_FragCoord, senza coordinate in più) e
// il taglio sotto il pelo. Costa i disegni dei solidi e dei modelli visti
// dallo specchio, e si spegne da solo quando l'acqua non è a schermo o si è
// sott'acqua. È «la stessa telecamera specchiata» che chiedeva il committente.
const VS_ACQUA = `#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale cima · B: y prof livello
layout(location = 1) in uvec4 aC;   // r g b 0
uniform mat4 uVP;
uniform vec3 uChunk;
uniform float uTempo;
uniform vec3 uCam;
uniform vec2 uNebbia;
out vec3 vPos;
out vec3 vCol;
out float vProf;
out float vNebbia;
flat out float vPelo;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  uint normale = (A >> 18u) & 31u;
  bool cima = ((A >> 23u) & 1u) == 1u;   // vertice in cima alla cella: il pelo, o l'orlo di una parete
  float prof = float((B >> 16u) & 15u);
  float liv = float((B >> 20u) & 15u);
  // il pelo: peloDi() di world/pelo.js, e un'onda piccola (moto 0,018 del lago)
  if (cima) p.y -= (1.0 + 2.0 * liv) / 16.0;
  p.y += 0.035 * sin(uTempo * 1.3 + p.x * 0.7 + p.z * 0.9) + 0.02 * sin(uTempo * 2.1 - p.z * 1.7);
  vPos = p;
  vCol = pow(vec3(aC.xyz) / 255.0, vec3(2.2));
  vProf = prof;
  vPelo = normale == 16u ? 1.0 : 0.0;   // 16 = (0, +1, 0) nell'indice a 27
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  gl_Position = uVP * vec4(p, 1.0);
}`;
const FS_ACQUA = `#version 300 es
// ⚠ highp come il vertex: gli uniform sono condivisi e la precisione deve coincidere
precision highp float;
in vec3 vPos;
in vec3 vCol;
in float vProf;
in float vNebbia;
flat in float vPelo;
uniform vec3 uCam;
uniform vec3 uSoleVerso;
uniform vec3 uSoleCol;
uniform float uSoleForza;
uniform vec3 uCieloCol;
uniform vec3 uNebbiaCol;
uniform float uTempo;
uniform sampler2D uSpecchio;     // la scena specchiata, a mezza risoluzione
uniform vec3 uSchermo;           // 1/larghezza, 1/altezza, forza dello specchio (0 = spento)
out vec4 colore;
void main() {
  vec3 vista = normalize(uCam - vPos);
  // la normale del pelo ondeggia appena: basta per il brillio, non per deformare
  vec3 n = vPelo > 0.5 ? normalize(vec3(0.06 * sin(uTempo * 1.7 + vPos.x * 2.3), 1.0, 0.06 * cos(uTempo * 1.1 + vPos.z * 1.9))) : vec3(0.0, 1.0, 0.0);
  // profondità → violaceo e opaco (scala 0,12 per blocco, corpo come la ricetta)
  float k = clamp(vProf * 0.12, 0.0, 1.0);
  vec3 viola = pow(vec3(0.38, 0.30, 0.62), vec3(2.2));
  vec3 acqua = mix(vCol, viola, k * 0.75);
  float alfa = mix(0.34, 0.88, k);
  // il sole: la luce sul pelo, a gradino (prima del riflesso: il riflesso ha già la sua luce)
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  acqua *= mix(uCieloCol * 0.7, uSoleCol, sole * 0.85);
  // il cielo capovolto: fresnel verso il colore del cielo (la nebbia È il cielo all'orizzonte)
  float fres = pow(1.0 - max(dot(n, vista), 0.0), 3.0);
  vec3 cielo = pow(uNebbiaCol, vec3(2.2));
  // ⚠ LO SPECCHIO SI LEGGE A SCHERMO: la passata specchiata usa la stessa
  // proiezione, quindi il riflesso di questo pixel sta in questo pixel. Le
  // onde lo spostano di un soffio (n.xz), che è quanto basta a farlo vivere.
  vec2 uv = clamp(gl_FragCoord.xy * uSchermo.xy + n.xz * 0.16 * vPelo, 0.002, 0.998);
  vec3 riflesso = mix(cielo, pow(texture(uSpecchio, uv).rgb, vec3(2.2)), uSchermo.z);
  // ⚠ IL CIELO CAPOVOLTO SOLO RADENTE quando non c'è specchio: a 45° il fresnel
  // cubico vale il 2%. Con lo specchio il riflesso c'è sempre un po' (22%) e
  // radente è quasi tutto (85%): l'acqua resta acqua guardandola dall'alto.
  float peso = mix(fres * 0.55, mix(0.22, 0.85, fres), uSchermo.z) * vPelo;
  acqua = mix(acqua, riflesso, peso);
  alfa = mix(alfa, 0.95, fres * vPelo);
  float brillio = step(0.985, dot(reflect(-vista, n), -uSoleVerso)) * uSoleForza * vPelo;
  acqua += vec3(0.9) * brillio;
  vec3 c = pow(mix(acqua, cielo, vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, mix(alfa, 1.0, vNebbia));
}`;

// ── L'ERBA: fili a triangolo, un disegno per chunk, due facce, opaca ────────
const VS_ERBA = `#version 300 es
precision highp float;
layout(location = 0) in uvec4 aA;   // x8 z8 y8 seme
layout(location = 1) in uvec4 aB;   // r g b (punta | cielo<<1)
uniform mat4 uVP;
uniform vec3 uChunk;                // x0, yBase, z0
uniform float uTempo;
uniform vec3 uSoleVerso;
uniform vec3 uSoleCol;
uniform float uSoleForza;
uniform vec3 uCieloCol;
uniform vec2 uNebbia;
uniform vec3 uCam;
uniform vec2 uVento;                // direzione del vento in pianta
flat out vec3 vColOmbra;
flat out vec3 vColSole;
out float vNebbia;
out vec3 vPos;
void main() {
  vec3 p = uChunk + vec3(float(aA.x), float(aA.z), float(aA.y)) / 8.0;
  float seme = float(aA.w) / 255.0;
  bool punta = (aB.w & 1u) == 1u;
  float cielo = float(aB.w >> 1u) / 15.0;
  if (punta) {   // la punta ondeggia col vento, la base no: come il prato
    float f = sin(uTempo * 1.9 + seme * 6.28 + p.x * 0.35 + p.z * 0.5) * 0.5 + 0.5;
    p.xz += uVento * (0.06 + 0.16 * f) + vec2(sin(uTempo * 3.1 + seme * 9.0), cos(uTempo * 2.3 + seme * 7.0)) * 0.03;
  }
  vec3 base = pow(vec3(aB.xyz) / 255.0, vec3(2.2));
  // l'erba è tinta piatta: vede il sole se ha il cielo, senza normale
  float sole = floor(step(0.99, cielo) * uSoleForza * 3.0 + 0.5) / 3.0;
  float cieloBande = floor(cielo * 4.0 + 0.5) / 4.0;
  vec3 ombraE = base * uCieloCol * (0.25 + 0.75 * cieloBande);
  vColOmbra = ombraE;
  vColSole = (base * uSoleCol - ombraE) * sole;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`;

export class Resa {
  constructor(gl) {
    this.gl = gl;
    this.programma = compila(gl, VS, FS);
    this.u = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uMaterie', 'uNebbia', 'uCam', 'uNebbiaCol', 'uOmbra', 'uAltezze', 'uAltRett', 'uTaglio']) {
      this.u[n] = gl.getUniformLocation(this.programma, n);
    }
    // ⚠ UN SOLO BUFFER DI INDICI PER TUTTI I CHUNK (formato.js)
    this.ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indiciCondivisi(QUAD_MAX), gl.STATIC_DRAW);
    this.programmaErba = compila(gl, VS_ERBA, FS);   // stesso fragment dei solidi (horizon mapping, nebbia)
    this.ue = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uNebbia', 'uCam', 'uVento', 'uNebbiaCol', 'uOmbra', 'uAltezze', 'uAltRett', 'uTaglio']) this.ue[n] = gl.getUniformLocation(this.programmaErba, n);
    this.programmaAcqua = compila(gl, VS_ACQUA, FS_ACQUA);
    this.ua = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uCam', 'uNebbia', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uNebbiaCol', 'uSpecchio', 'uSchermo']) this.ua[n] = gl.getUniformLocation(this.programmaAcqua, n);
    this.chunks = new Map();
    this.altezze = null;
    this.statistiche = { disegni: 0, triangoli: 0, chunkVisti: 0, chunkTotali: 0, disegniAcqua: 0, triangoliAcqua: 0, disegniErba: 0, triangoliErba: 0, disegniSpecchio: 0, triangoliSpecchio: 0, pelo: null };
    this._visibili = [];
    this._visibiliErba = [];
    this._camera = null;
    // ⚠ LO SPECCHIO DELL'ACQUA: un framebuffer a `scala` della tela, riusato
    // finché la tela non cambia misura. `attivo` lo accende; si misura col
    // banco (`?specchio=no` per il confronto). `pelo` è la quota del piano.
    this.specchio = { attivo: true, scala: 0.5, fbo: null, tex: null, rbo: null, w: 0, h: 0, pelo: null, mostra: false };
    this.vpSpecchio = new Float32Array(16);
    this.pianiSpecchio = new Float32Array(24);
    this._riflessione = new Float32Array(16);
    this._voti = new Map();
    this.vpCorrente = null;     // il VP della passata in corso (specchio o vista): i modelli lo leggono
    // ⚠ LA FINESTRA DELLE ALTEZZE: nel mondo in streaming la mappa per l'horizon
    // mapping non può coprire tutto — è una texture quadrata che SEGUE chi
    // cammina (`apriFinestraAltezze`, `seguiAltezze`), e ogni chunk ci scrive la
    // sua tegola 16×16 quando entra o cambia. Nel banco resta la mappa intera.
    this.finestra = null;
    this._tegolaVuota = new Uint8Array(256);
    this.taglio = -1e9;         // la quota sotto cui la passata in corso non disegna
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.62, 0.81, 0.91, 1);
    this.vp = new Float32Array(16);
    this.piani = new Float32Array(24);
    this.tempo = 0;
    this.impostaMaterie([[0, 0, 0, 0], [1, 0, 0, 0]]);   // 0 nessuna, 1 emissiva (il banco)
    this.ombra = true;
    this.tutto = false;   // il banco: niente frustum, per misurare il tetto dei disegni
    this.erbaFinoA = 6 * 16;   // LOD: i fili entro sei chunk, come erbaR del profilo ULTRA
    this.sole = { verso: [-0.5, -0.7, -0.3], colore: [1.0, 0.96, 0.86], forza: 1.0, cielo: [0.60, 0.68, 0.82] };
    this.nebbia = { da: 90, a: 150, colore: [0.72, 0.85, 0.92] };
  }

  /** Carica (o sostituisce) un chunk: un VAO, un VBO, otto byte per vertice. */
  carica(kc, dati) {
    const gl = this.gl;
    let c = this.chunks.get(kc);
    if (!c) {
      c = { vao: gl.createVertexArray(), vbo: gl.createBuffer(), quad: 0 };
      gl.bindVertexArray(c.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, c.vbo);
      gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 2, gl.UNSIGNED_INT, BYTE_VERTICE, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 8);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
      gl.bindVertexArray(null);
      this.chunks.set(kc, c);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, c.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, dati.byte, gl.STATIC_DRAW);
    c.quad = dati.quad;
    // l'erba del chunk, se c'è: fili a triangolo, un VAO suo
    const e = dati.erba;
    c.verticiErba = e ? e.vertici : 0;
    c.yBaseErba = e ? e.yBase : 0;
    if (c.verticiErba > 0) {
      if (!c.vaoErba) {
        c.vaoErba = gl.createVertexArray(); c.vboErba = gl.createBuffer();
        gl.bindVertexArray(c.vaoErba);
        gl.bindBuffer(gl.ARRAY_BUFFER, c.vboErba);
        gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 4, gl.UNSIGNED_BYTE, 8, 0);
        gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, 8, 4);
        gl.bindVertexArray(null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, c.vboErba);
      gl.bufferData(gl.ARRAY_BUFFER, e.byte, gl.STATIC_DRAW);
    }
    // l'acqua del chunk, se c'è: stesso formato, un VAO suo
    const a = dati.acqua;
    c.quadAcqua = a ? a.quad : 0;
    c.peloAcqua = a && a.pelo != null ? a.pelo : null;   // la quota del pelo più alto (per il piano dello specchio)
    if (c.quadAcqua > 0) {
      if (!c.vaoAcqua) {
        c.vaoAcqua = gl.createVertexArray(); c.vboAcqua = gl.createBuffer();
        gl.bindVertexArray(c.vaoAcqua);
        gl.bindBuffer(gl.ARRAY_BUFFER, c.vboAcqua);
        gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 2, gl.UNSIGNED_INT, BYTE_VERTICE, 0);
        gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 8);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bindVertexArray(null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, c.vboAcqua);
      gl.bufferData(gl.ARRAY_BUFFER, a.byte, gl.STATIC_DRAW);
    }
    c.x0 = dati.cx * 16; c.z0 = dati.cz * 16; c.minY = dati.minY; c.maxY = dati.maxY;
    c.y0 = dati.y0 || 0;
    c.chunk = [c.x0, c.y0, c.z0];
    // la tegola delle altezze (quota di mondo + 1, come mappaAltezze), per la finestra
    if (dati.altezze) {
      if (!c.tegola) c.tegola = new Uint8Array(256);
      for (let lx = 0; lx < 16; lx++) for (let lz = 0; lz < 16; lz++) { const a = dati.altezze[lx * 16 + lz]; c.tegola[lz * 16 + lx] = a < 0 ? 0 : Math.max(0, Math.min(255, a + 1)); }
      if (this.finestra) this._scriviTegola(c);
    }
  }

  /**
   * Apre la finestra delle altezze (lato in blocchi, multiplo di 16) centrata
   * su (x, z). Da chiamare PRIMA di caricare i chunk del mondo in streaming.
   */
  apriFinestraAltezze(x, z, lato = 512) {
    const gl = this.gl;
    if (!this.altezze) this.altezze = gl.createTexture();
    this.finestra = { lato, x0: 0, z0: 0, vuota: new Uint8Array(lato * lato), spostamenti: 0 };
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._centraFinestra(x, z, true);
  }

  /** La finestra segue chi cammina: si sposta (e si riscrive) solo quando si è a un quarto dal bordo. */
  seguiAltezze(x, z) { if (this.finestra) this._centraFinestra(x, z, false); }

  _centraFinestra(x, z, forza) {
    const gl = this.gl, f = this.finestra, mezzo = f.lato / 2;
    if (!forza && Math.abs(x - (f.x0 + mezzo)) < f.lato / 4 && Math.abs(z - (f.z0 + mezzo)) < f.lato / 4) return false;
    f.x0 = Math.floor((x - mezzo) / 16) * 16; f.z0 = Math.floor((z - mezzo) / 16) * 16;
    this.altRett = [f.x0, f.z0, 1 / f.lato, 1 / f.lato];
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, f.lato, f.lato, 0, gl.RED, gl.UNSIGNED_BYTE, f.vuota);
    for (const c of this.chunks.values()) if (c.tegola) this._scriviTegola(c);
    f.spostamenti++;
    return true;
  }

  _scriviTegola(c, vuota = false) {
    const gl = this.gl, f = this.finestra;
    const px = c.x0 - f.x0, pz = c.z0 - f.z0;
    if (px < 0 || pz < 0 || px + 16 > f.lato || pz + 16 > f.lato) return;
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, px, pz, 16, 16, gl.RED, gl.UNSIGNED_BYTE, vuota ? this._tegolaVuota : c.tegola);
  }

  /**
   * LA CELLA MIRATA: dodici spigoli in linea, neri e poi bianchi (si leggono su
   * ogni fondo), con `progresso` 0..1 lo scavo la tinge d'arancio. Si disegna
   * dopo i solidi e i modelli, prima dell'acqua, con la profondità.
   */
  evidenzia(x, y, z, progresso = 0) {
    const gl = this.gl;
    if (!this.programmaSpigoli) {
      this.programmaSpigoli = compila(gl, `#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,
      `#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`);
      this.uSpigoli = { uVP: gl.getUniformLocation(this.programmaSpigoli, 'uVP'), uCella: gl.getUniformLocation(this.programmaSpigoli, 'uCella'), uColore: gl.getUniformLocation(this.programmaSpigoli, 'uColore') };
      this.vaoSpigoli = gl.createVertexArray();
    }
    const u = this.uSpigoli;
    gl.useProgram(this.programmaSpigoli);
    gl.uniformMatrix4fv(u.uVP, false, this.vp);
    gl.bindVertexArray(this.vaoSpigoli);
    gl.uniform4f(u.uCella, x, y, z, 0.012); gl.uniform3f(u.uColore, 0.05, 0.16, 0.10);
    gl.drawArrays(gl.LINES, 0, 24);
    gl.uniform4f(u.uCella, x, y, z, 0.004); gl.uniform3f(u.uColore, 1.0, 1.0 - 0.45 * progresso, 1.0 - 0.8 * progresso);
    gl.drawArrays(gl.LINES, 0, 24);
    gl.bindVertexArray(null);
  }

  rimuovi(kc) {
    const c = this.chunks.get(kc); if (!c) return;
    if (this.finestra && c.tegola) this._scriviTegola(c, true);
    this.gl.deleteVertexArray(c.vao); this.gl.deleteBuffer(c.vbo);
    if (c.vaoAcqua) { this.gl.deleteVertexArray(c.vaoAcqua); this.gl.deleteBuffer(c.vboAcqua); }
    if (c.vaoErba) { this.gl.deleteVertexArray(c.vaoErba); this.gl.deleteBuffer(c.vboErba); }
    this.chunks.delete(kc);
  }

  /** La mappa delle altezze per l'horizon mapping: un byte per colonna. */
  impostaAltezze(byte, x0, z0, larghezza, profondita) {
    const gl = this.gl;
    if (!this.altezze) this.altezze = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, larghezza, profondita, 0, gl.RED, gl.UNSIGNED_BYTE, byte);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.altRett = [x0, z0, 1 / larghezza, 1 / profondita];
  }

  /** Le sedici materie: [emissione, brillio, riflesso, libero] per riga. La riga 0 è «nessuna». */
  impostaMaterie(righe) {
    const piatto = new Float32Array(64);
    for (let i = 0; i < 16 && i < righe.length; i++) for (let k = 0; k < 4; k++) piatto[i * 4 + k] = righe[i][k] || 0;
    this.materie = piatto;
  }

  /**
   * Un fotogramma. `camera` = { occhio, centro, fov, rapporto }; `modelli`, se
   * c'è, viene disegnato anche nello specchio (nella vista lo disegna il
   * chiamante, dopo, con `modelli.disegna(resa, camera)`).
   * ⚠ ZERO ALLOCAZIONI QUI DENTRO: le matrici e i piani sono riusati.
   */
  disegna(camera, dt, modelli = null) {
    const gl = this.gl, st = this.statistiche;
    this.tempo += dt;
    const P = prospettiva(camera.fov, camera.rapporto, 0.3, 400);
    const V = guarda(camera.occhio, camera.centro);
    moltiplica(P, V, this.vp);
    pianiFrustum(this.vp, this.piani);
    this._camera = camera;
    // ── la scelta di cosa si vede: una volta sola, per solidi, acqua ed erba ──
    this._visibili.length = 0;
    this._visibiliErba.length = 0;
    let visti = 0;
    for (const c of this.chunks.values()) {
      if (c.quad === 0 && c.quadAcqua === 0) continue;
      c.visto = this.tutto || scatolaNelFrustum(this.piani, c.x0, c.y0 + c.minY, c.z0, c.x0 + 16, c.y0 + c.maxY + 1, c.z0 + 16);
      if (!c.visto) continue;
      visti++;
      if (c.quadAcqua > 0) this._visibili.push(c);
      // ⚠ LOD DELL'ERBA: i fili si disegnano solo entro `erbaFinoA` blocchi dal
      // centro del chunk (come il raggio del prato di oggi): da lontano l'erba è
      // la tinta della cima, e i triangoli risparmiati sono migliaia per chunk.
      if (c.verticiErba > 0 && Math.hypot(c.x0 + 8 - camera.occhio[0], c.z0 + 8 - camera.occhio[2]) <= this.erbaFinoA) this._visibiliErba.push(c);
    }
    // ── lo specchio dell'acqua, prima di tutto: una passata a parte ──────────
    st.disegniSpecchio = 0; st.triangoliSpecchio = 0; st.pelo = null;
    this.specchio.pelo = null;
    if (this.specchio.attivo && this._visibili.length) this._specchia(camera, modelli);
    // ── la vista ──────────────────────────────────────────────────────────────
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.taglio = -1e9;
    this.vpCorrente = this.vp;
    const [disegni, tri] = this._solidi(this.vp, this.piani, camera.occhio, false);
    // ── l'erba dei chunk visti: opaca, a due facce, stesso frustum ────────────
    let disegniErba = 0, triErba = 0;
    if (this._visibiliErba.length) {
      const ue = this.ue, s = this.sole;
      gl.useProgram(this.programmaErba);
      gl.uniformMatrix4fv(ue.uVP, false, this.vp);
      gl.uniform1f(ue.uTempo, this.tempo);
      gl.uniform3f(ue.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
      gl.uniform3f(ue.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
      gl.uniform1f(ue.uSoleForza, s.forza);
      gl.uniform3f(ue.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
      gl.uniform2f(ue.uNebbia, this.nebbia.da, this.nebbia.a);
      gl.uniform3f(ue.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
      gl.uniform3f(ue.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
      gl.uniform2f(ue.uVento, Math.cos(this.tempo * 0.045), Math.sin(this.tempo * 0.045));
      gl.uniform1f(ue.uOmbra, this.ombra && this.altezze ? 1 : 0);
      gl.uniform1f(ue.uTaglio, -1e9);
      if (this.altezze) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.altezze); gl.uniform1i(ue.uAltezze, 0); gl.uniform4f(ue.uAltRett, this.altRett[0], this.altRett[1], this.altRett[2], this.altRett[3]); }
      gl.disable(gl.CULL_FACE);
      for (const c of this._visibiliErba) {
        // ⚠ LA BASE DELL'ERBA È GIÀ IN QUOTA DI MONDO (yLo del chunk): NON si somma
        // lo scarto del chunk, o i fili finiscono 64 celle sotto, nel lago.
        gl.uniform3f(ue.uChunk, c.chunk[0], c.yBaseErba, c.chunk[2]);
        gl.bindVertexArray(c.vaoErba);
        gl.drawArrays(gl.TRIANGLES, 0, c.verticiErba);
        disegniErba++; triErba += c.verticiErba / 3;
      }
      gl.enable(gl.CULL_FACE);
      gl.bindVertexArray(null);
    }
    st.disegni = disegni; st.triangoli = tri; st.chunkVisti = visti; st.chunkTotali = this.chunks.size;
    st.disegniErba = disegniErba; st.triangoliErba = triErba;
  }

  /**
   * I solidi con un VP e un frustum dati: la vista (`specchiato` falso: si
   * disegnano i chunk già scelti) o lo specchio (`specchiato` vero: frustum
   * suo, e le facce si scartano al contrario perché la riflessione capovolge
   * il verso dei triangoli). Torna [disegni, triangoli].
   */
  _solidi(vp, piani, occhio, specchiato) {
    const gl = this.gl, u = this.u, s = this.sole;
    gl.useProgram(this.programma);
    gl.uniformMatrix4fv(u.uVP, false, vp);
    gl.uniform1f(u.uTempo, this.tempo);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform3f(u.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
    gl.uniform4fv(u.uMaterie, this.materie);
    gl.uniform2f(u.uNebbia, this.nebbia.da, this.nebbia.a);
    gl.uniform3f(u.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
    gl.uniform3f(u.uCam, occhio[0], occhio[1], occhio[2]);
    gl.uniform1f(u.uOmbra, this.ombra && this.altezze ? 1 : 0);
    gl.uniform1f(u.uTaglio, this.taglio);
    if (this.altezze) {
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.altezze);
      gl.uniform1i(u.uAltezze, 0);
      gl.uniform4f(u.uAltRett, this.altRett[0], this.altRett[1], this.altRett[2], this.altRett[3]);
    }
    let disegni = 0, tri = 0;
    for (const c of this.chunks.values()) {
      if (c.quad === 0) continue;
      if (specchiato) { if (!this.tutto && !scatolaNelFrustum(piani, c.x0, c.y0 + c.minY, c.z0, c.x0 + 16, c.y0 + c.maxY + 1, c.z0 + 16)) continue; }
      else if (!c.visto) continue;
      gl.uniform3f(u.uChunk, c.chunk[0], c.chunk[1], c.chunk[2]);
      gl.bindVertexArray(c.vao);
      gl.drawElements(gl.TRIANGLES, c.quad * 6, gl.UNSIGNED_SHORT, 0);
      disegni++; tri += c.quad * 2;
    }
    gl.bindVertexArray(null);
    return [disegni, tri];
  }

  /**
   * Il pelo da specchiare. Un piano solo (è il limite della tecnica), quindi si
   * sceglie l'acqua che RIEMPIE LO SCHERMO: ogni chunk visto vota per la quota
   * del suo pelo con i suoi quad d'acqua, smorzati dalla distanza (la verticale
   * pesa 2,2, come in world/pelo.js). Il lago di sessanta chunk vince sulla
   * pozza della sorgente a due passi, e la pozza vince quando ci si è sopra.
   */
  _peloVicino(occhio) {
    const voti = this._voti; voti.clear();
    for (const c of this._visibili) {
      if (c.peloAcqua == null) continue;
      const d = Math.hypot(c.x0 + 8 - occhio[0], c.z0 + 8 - occhio[2]) + 2.2 * Math.abs(c.peloAcqua - occhio[1]);
      voti.set(c.peloAcqua, (voti.get(c.peloAcqua) || 0) + c.quadAcqua / (1 + d));
    }
    let pelo = null, meglio = 0;
    for (const [q, v] of voti) if (v > meglio) { meglio = v; pelo = q; }
    return pelo;
  }

  /**
   * LA PASSATA DELLO SPECCHIO. Matrice di riflessione rispetto al piano y = pelo
   * (x, y, z) → (x, 2·pelo − y, z), moltiplicata a destra del VP: un punto del
   * mondo finisce a schermo dove finirebbe la sua immagine riflessa, quindi il
   * fragment dell'acqua legge il riflesso con le proprie coordinate a schermo.
   * La riflessione capovolge il verso dei triangoli: si scartano le facce
   * davanti. Sotto il pelo non si disegna (uTaglio). Sott'acqua non si specchia.
   */
  _specchia(camera, modelli) {
    const gl = this.gl, sp = this.specchio, st = this.statistiche;
    const pelo = this._peloVicino(camera.occhio);
    if (pelo == null || camera.occhio[1] <= pelo + 0.2) return;
    // il framebuffer, alla misura della tela per `scala`
    const w = Math.max(1, Math.round(gl.drawingBufferWidth * sp.scala)), h = Math.max(1, Math.round(gl.drawingBufferHeight * sp.scala));
    if (!sp.fbo || sp.w !== w || sp.h !== h) this._preparaSpecchio(w, h);
    const R = this._riflessione;
    R.fill(0); R[0] = 1; R[5] = -1; R[10] = 1; R[13] = 2 * pelo; R[15] = 1;
    moltiplica(this.vp, R, this.vpSpecchio);
    pianiFrustum(this.vpSpecchio, this.pianiSpecchio);
    const occhio = [camera.occhio[0], 2 * pelo - camera.occhio[1], camera.occhio[2]];
    gl.bindFramebuffer(gl.FRAMEBUFFER, sp.fbo);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.cullFace(gl.FRONT);
    this.taglio = pelo - 0.05;
    this.vpCorrente = this.vpSpecchio;
    const [d, t] = this._solidi(this.vpSpecchio, this.pianiSpecchio, occhio, true);
    st.disegniSpecchio = d; st.triangoliSpecchio = t;
    if (modelli) {
      modelli.disegna(this, { occhio, centro: camera.centro, fov: camera.fov, rapporto: camera.rapporto });
      st.disegniSpecchio += modelli.statistiche.disegni; st.triangoliSpecchio += modelli.statistiche.triangoli;
    }
    gl.cullFace(gl.BACK);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.taglio = -1e9;
    sp.pelo = pelo; st.pelo = pelo;
  }

  _mostraSpecchio() {
    const gl = this.gl, sp = this.specchio;
    if (!this.programmaQuad) {
      this.programmaQuad = compila(gl, `#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`, `#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`);
      this.uQuad = gl.getUniformLocation(this.programmaQuad, 'uTex');
      this.vaoQuad = gl.createVertexArray();
    }
    gl.useProgram(this.programmaQuad);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sp.tex); gl.uniform1i(this.uQuad, 0);
    gl.bindVertexArray(this.vaoQuad);
    gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.enable(gl.DEPTH_TEST);
    gl.bindVertexArray(null);
  }

  _preparaSpecchio(w, h) {
    const gl = this.gl, sp = this.specchio;
    if (!sp.fbo) { sp.fbo = gl.createFramebuffer(); sp.tex = gl.createTexture(); sp.rbo = gl.createRenderbuffer(); }
    gl.bindTexture(gl.TEXTURE_2D, sp.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindRenderbuffer(gl.RENDERBUFFER, sp.rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    gl.bindFramebuffer(gl.FRAMEBUFFER, sp.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sp.tex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, sp.rbo);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { sp.attivo = false; console.warn('specchio: framebuffer incompleto, spento'); }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    sp.w = w; sp.h = h;
  }

  /**
   * L'ACQUA, dopo tutto il resto: fusione accesa, profondità letta ma non scritta,
   * niente culling delle facce (si guarda anche da sotto). Solo i chunk d'acqua
   * già passati dal frustum in `disegna`: il culling dell'acqua è lo stesso dei
   * solidi, e un chunk senza acqua non arriva neanche qui. Lo specchio, se la
   * passata c'è stata, entra come texture letta a schermo.
   */
  disegnaAcqua() {
    const gl = this.gl, u = this.ua, s = this.sole, camera = this._camera, sp = this.specchio;
    if (!camera || this._visibili.length === 0) { this.statistiche.disegniAcqua = 0; return; }
    gl.useProgram(this.programmaAcqua);
    gl.uniformMatrix4fv(u.uVP, false, this.vp);
    gl.uniform1f(u.uTempo, this.tempo);
    gl.uniform3f(u.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform2f(u.uNebbia, this.nebbia.da, this.nebbia.a);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform3f(u.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
    gl.uniform3f(u.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
    const conSpecchio = sp.pelo != null && sp.tex;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, conSpecchio ? sp.tex : null); gl.uniform1i(u.uSpecchio, 1);
    gl.uniform3f(u.uSchermo, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight, conSpecchio ? 1 : 0);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false); gl.disable(gl.CULL_FACE);
    let disegni = 0, tri = 0;
    for (const c of this._visibili) {
      gl.uniform3f(u.uChunk, c.chunk[0], c.chunk[1], c.chunk[2]);
      gl.bindVertexArray(c.vaoAcqua);
      gl.drawElements(gl.TRIANGLES, c.quadAcqua * 6, gl.UNSIGNED_SHORT, 0);
      disegni++; tri += c.quadAcqua * 2;
    }
    gl.bindVertexArray(null);
    gl.depthMask(true); gl.enable(gl.CULL_FACE); gl.disable(gl.BLEND);
    gl.activeTexture(gl.TEXTURE0);
    this.statistiche.disegniAcqua = disegni; this.statistiche.triangoliAcqua = tri;
    // il banco: lo specchio nudo in basso a sinistra, per vedere cosa legge l'acqua
    // ⚠ NON con blitFramebuffer: la tela con antialias è multisample, e il blit
    // verso un framebuffer multisample è un GL_INVALID_OPERATION. Un quad.
    if (sp.mostra && conSpecchio) this._mostraSpecchio();
  }
}

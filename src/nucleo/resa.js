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
layout(location = 0) in uvec4 aA;   // x z y (normale|vento|materia)
layout(location = 1) in uvec4 aB;   // luci r g b
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
const vec3 N[6] = vec3[6](vec3(1,0,0), vec3(-1,0,0), vec3(0,1,0), vec3(0,-1,0), vec3(0,0,1), vec3(0,0,-1));
void main() {
  vec3 p = uChunk + vec3(float(aA.x), float(aA.z), float(aA.y));
  uint b3 = aA.w;
  uint normale = b3 & 7u;
  uint vento = (b3 >> 3u) & 1u;
  uint materia = b3 >> 4u;
  if (vento == 1u) {   // la cima di un filo d'erba ondeggia
    float f = sin(uTempo * 1.7 + p.x * 0.9 + p.z * 1.3);
    p.x += f * 0.18; p.z += cos(uTempo * 1.1 + p.z * 0.7 + p.x * 0.4) * 0.12;
  }
  vec3 n = N[normale];
  float cielo = float(aB.x >> 4u) / 15.0;
  float blocco = float(aB.x & 15u) / 15.0;
  // ⚠ IL COLORE È QUELLO COTTO DAL MESHER (la palette di Leafy), in spazio lineare
  vec3 base = pow(vec3(aB.yzw) / 255.0, vec3(2.2));
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
  // ⚠ L'OMBRA NON È NERA, È DEL COLORE DEL CIELO: moltiplica, non sottrae
  vec3 ombra = base * uCieloCol * (0.12 + 0.48 * cieloBande) + base * vec3(1.0, 0.80, 0.50) * lampada * 0.9;
  vec3 pieno = base * uSoleCol * sole * 0.85;
  if (mat.x > 0.0) { ombra = mix(ombra, base * 1.15, mat.x); pieno *= (1.0 - mat.x); }   // emissiva: scavalca ombra e notte
  vColOmbra = ombra;
  vColSole = pieno;
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
// ⚠ STESSA PRECISIONE DEL VERTEX: un uniform condiviso fra i due shader deve
// avere la stessa precisione, o il link fallisce («precisions differ»).
uniform highp vec3 uSoleVerso;
uniform sampler2D uAltezze;      // R8: quota della cima / 255, un texel per colonna
uniform vec4 uAltRett;           // x0, z0, 1/larghezza, 1/profondita
out vec4 colore;
void main() {
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
// brillio a gradino verso il sole. Niente specchio, niente rifrazione, niente
// depth pass: quelle sono passate, e qui non ce ne sono.
const VS_ACQUA = `#version 300 es
precision highp float;
layout(location = 0) in uvec4 aA;   // x z y (normale)
layout(location = 1) in uvec4 aB;   // (prof<<4|livello) r g b
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
  vec3 p = uChunk + vec3(float(aA.x), float(aA.z), float(aA.y));
  uint normale = aA.w & 7u;
  float prof = float(aB.x >> 4u);
  float liv = float(aB.x & 15u);
  // il pelo: peloDi() di world/pelo.js, e un'onda piccola (moto 0,018 del lago)
  if (normale == 2u) p.y -= (1.0 + 2.0 * liv) / 16.0;
  p.y += 0.035 * sin(uTempo * 1.3 + p.x * 0.7 + p.z * 0.9) + 0.02 * sin(uTempo * 2.1 - p.z * 1.7);
  vPos = p;
  vCol = pow(vec3(aB.yzw) / 255.0, vec3(2.2));
  vProf = prof;
  vPelo = normale == 2u ? 1.0 : 0.0;
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
  // il cielo capovolto: fresnel verso il colore del cielo (la nebbia È il cielo all'orizzonte)
  float fres = pow(1.0 - max(dot(n, vista), 0.0), 3.0);
  vec3 cielo = pow(uNebbiaCol, vec3(2.2));
  acqua = mix(acqua, cielo, fres * 0.85 * vPelo);
  alfa = mix(alfa, 0.95, fres * vPelo);
  // il sole: la luce sul pelo, a gradino; il brillio è uno step verso il riflesso
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  acqua *= mix(uCieloCol * 0.7, uSoleCol, sole * 0.85);
  float brillio = step(0.985, dot(reflect(-vista, n), -uSoleVerso)) * uSoleForza * vPelo;
  acqua += vec3(0.9) * brillio;
  vec3 c = pow(mix(acqua, cielo, vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, mix(alfa, 1.0, vNebbia));
}`;

export class Resa {
  constructor(gl) {
    this.gl = gl;
    this.programma = compila(gl, VS, FS);
    this.u = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uMaterie', 'uNebbia', 'uCam', 'uNebbiaCol', 'uOmbra', 'uAltezze', 'uAltRett']) {
      this.u[n] = gl.getUniformLocation(this.programma, n);
    }
    // ⚠ UN SOLO BUFFER DI INDICI PER TUTTI I CHUNK (formato.js)
    this.ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indiciCondivisi(QUAD_MAX), gl.STATIC_DRAW);
    this.programmaAcqua = compila(gl, VS_ACQUA, FS_ACQUA);
    this.ua = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uCam', 'uNebbia', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uNebbiaCol']) this.ua[n] = gl.getUniformLocation(this.programmaAcqua, n);
    this.chunks = new Map();
    this.altezze = null;
    this.statistiche = { disegni: 0, triangoli: 0, chunkVisti: 0, chunkTotali: 0, disegniAcqua: 0, triangoliAcqua: 0 };
    this._visibili = [];
    this._camera = null;
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
      gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 4);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
      gl.bindVertexArray(null);
      this.chunks.set(kc, c);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, c.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, dati.byte, gl.STATIC_DRAW);
    c.quad = dati.quad;
    // l'acqua del chunk, se c'è: stesso formato, un VAO suo
    const a = dati.acqua;
    c.quadAcqua = a ? a.quad : 0;
    if (c.quadAcqua > 0) {
      if (!c.vaoAcqua) {
        c.vaoAcqua = gl.createVertexArray(); c.vboAcqua = gl.createBuffer();
        gl.bindVertexArray(c.vaoAcqua);
        gl.bindBuffer(gl.ARRAY_BUFFER, c.vboAcqua);
        gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 0);
        gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 4);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bindVertexArray(null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, c.vboAcqua);
      gl.bufferData(gl.ARRAY_BUFFER, a.byte, gl.STATIC_DRAW);
    }
    c.x0 = dati.cx * 16; c.z0 = dati.cz * 16; c.minY = dati.minY; c.maxY = dati.maxY;
    c.y0 = dati.y0 || 0;
    c.chunk = [c.x0, c.y0, c.z0];
  }

  rimuovi(kc) {
    const c = this.chunks.get(kc); if (!c) return;
    this.gl.deleteVertexArray(c.vao); this.gl.deleteBuffer(c.vbo);
    if (c.vaoAcqua) { this.gl.deleteVertexArray(c.vaoAcqua); this.gl.deleteBuffer(c.vboAcqua); }
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
   * Un fotogramma. `camera` = { occhio, centro, fov, rapporto }.
   * ⚠ ZERO ALLOCAZIONI QUI DENTRO: le matrici e i piani sono riusati.
   */
  disegna(camera, dt) {
    const gl = this.gl, st = this.statistiche;
    this.tempo += dt;
    const P = prospettiva(camera.fov, camera.rapporto, 0.3, 400);
    const V = guarda(camera.occhio, camera.centro);
    moltiplica(P, V, this.vp);
    pianiFrustum(this.vp, this.piani);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(this.programma);
    const u = this.u, s = this.sole;
    gl.uniformMatrix4fv(u.uVP, false, this.vp);
    gl.uniform1f(u.uTempo, this.tempo);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform3f(u.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
    gl.uniform4fv(u.uMaterie, this.materie);
    gl.uniform2f(u.uNebbia, this.nebbia.da, this.nebbia.a);
    gl.uniform3f(u.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
    gl.uniform3f(u.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform1f(u.uOmbra, this.ombra && this.altezze ? 1 : 0);
    if (this.altezze) {
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.altezze);
      gl.uniform1i(u.uAltezze, 0);
      gl.uniform4f(u.uAltRett, this.altRett[0], this.altRett[1], this.altRett[2], this.altRett[3]);
    }
    let disegni = 0, tri = 0, visti = 0;
    this._visibili.length = 0;
    for (const c of this.chunks.values()) {
      if (c.quad === 0 && c.quadAcqua === 0) continue;
      if (!this.tutto && !scatolaNelFrustum(this.piani, c.x0, c.y0 + c.minY, c.z0, c.x0 + 16, c.y0 + c.maxY + 1, c.z0 + 16)) continue;
      visti++;
      if (c.quadAcqua > 0) this._visibili.push(c);
      if (c.quad === 0) continue;
      gl.uniform3f(u.uChunk, c.chunk[0], c.chunk[1], c.chunk[2]);
      gl.bindVertexArray(c.vao);
      gl.drawElements(gl.TRIANGLES, c.quad * 6, gl.UNSIGNED_SHORT, 0);
      disegni++; tri += c.quad * 2;
    }
    gl.bindVertexArray(null);
    this._camera = camera;
    st.disegni = disegni; st.triangoli = tri; st.chunkVisti = visti; st.chunkTotali = this.chunks.size;
  }

  /**
   * L'ACQUA, dopo tutto il resto: fusione accesa, profondità letta ma non scritta,
   * niente culling delle facce (si guarda anche da sotto). Solo i chunk d'acqua
   * già passati dal frustum in `disegna`: il culling dell'acqua è lo stesso dei
   * solidi, e un chunk senza acqua non arriva neanche qui.
   */
  disegnaAcqua() {
    const gl = this.gl, u = this.ua, s = this.sole, camera = this._camera;
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
    this.statistiche.disegniAcqua = disegni; this.statistiche.triangoliAcqua = tri;
  }
}

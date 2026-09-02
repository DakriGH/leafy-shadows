// I MODELLI DEL NUCLEO — alberi, lampioni, panchine: triangoli piatti cotti
// offline (scripts/converti-nucleo.mjs), disegnati A ISTANZE: un disegno per
// TIPO di modello, non per albero. Cento alberi sono una chiamata.
//
// Stessa luce dei chunk: colore piatto dal vertice, «la faccia vede il sole o
// no» a gradino, l'ombra del colore del cielo, horizon mapping per l'ombra del
// sole, nebbia. La luce cotta della cella (F2) arriverà per istanza.
import { compila } from './gl.js';

/** Legge un .bin del nucleo: 'LNM1', uint32 triangoli, 16 byte per vertice, poi 4 byte di colore per vertice. */
export function leggiModello(buf) {
  const dv = new DataView(buf);
  if (String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3)) !== 'LNM1') throw new Error('non è un modello del nucleo');
  const tri = dv.getUint32(4, true), n = tri * 3;
  const geo = new Uint8Array(buf, 8, n * 16);
  const col = new Uint8Array(buf, 8 + n * 16, n * 4);
  // si intrecciano in un buffer solo da 20 byte: pos(12) n(3) materia(1) rgb(3) 0(1)
  const out = new Uint8Array(n * 20);
  for (let i = 0; i < n; i++) { out.set(geo.subarray(i * 16, i * 16 + 16), i * 20); out.set(col.subarray(i * 4, i * 4 + 4), i * 20 + 16); }
  let minY = Infinity, maxY = -Infinity, raggio = 0;
  const f = new DataView(out.buffer);
  for (let i = 0; i < n; i++) { const x = f.getFloat32(i * 20, true), y = f.getFloat32(i * 20 + 4, true), z = f.getFloat32(i * 20 + 8, true); minY = Math.min(minY, y); maxY = Math.max(maxY, y); raggio = Math.max(raggio, Math.hypot(x, z)); }
  return { byte: out, vertici: n, triangoli: tri, minY, maxY, raggio };
}

const VS = `#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNor;        // int8 nx ny nz (normalizzati)
layout(location = 2) in vec4 aCol;        // rgb normalizzati
layout(location = 3) in vec4 aIst;        // per istanza: x y z, scala
layout(location = 5) in vec4 aTinta;      // per istanza: r g b (moltiplica il colore), giro attorno a Y
layout(location = 4) in uint aMat;        // materia, byte 15
uniform mat4 uVP;
uniform float uTempo;
uniform vec3 uSoleVerso;
uniform vec3 uSoleCol;
uniform float uSoleForza;
uniform vec3 uCieloCol;
uniform vec4 uMaterie[16];
uniform vec2 uNebbia;
uniform vec3 uCam;
flat out vec3 vColOmbra;
flat out vec3 vColSole;
out float vNebbia;
out vec3 vPos;
void main() {
  // il giro attorno a Y (i corpi del sandbox, un albero girato a caso): seno e
  // coseno per vertice costano meno di una matrice per istanza
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  vec3 p = aIst.xyz + q * aIst.w;
  vec3 n = normalize(vec3(aNor.x * cg - aNor.z * sg, aNor.y, aNor.x * sg + aNor.z * cg));
  int materia = int(aMat);
  vec3 base = pow(aCol.rgb * aTinta.rgb, vec3(2.2));
  vec4 mat = uMaterie[materia];
  // niente shading per faccia (la regola di Leafy): la normale non entra nel colore
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  vec3 ombra = base * uCieloCol;
  vec3 pieno = base * uSoleCol;
  if (mat.x > 0.0) { ombra = mix(ombra, base * 1.15, mat.x); pieno = mix(pieno, base * 1.15, mat.x); }
  vColOmbra = ombra; vColSole = (pieno - ombra) * sole;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
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
uniform highp vec4 uBuco;        // il buco di visuale (vedi resa.js); zero per il giocatore stesso
uniform highp vec3 uOcchio;
uniform vec3 uNebbiaCol;
uniform float uOmbra;
uniform highp float uTaglio;     // la passata dello specchio non disegna sotto il pelo
uniform highp vec3 uSoleVerso;
uniform sampler2D uAltezze;
uniform vec4 uAltRett;
out vec4 colore;
void main() {
  if (vPos.y < uTaglio) discard;
  if (uBuco.w > 0.0) {
    vec3 seg = uBuco.xyz - uOcchio; float lung = length(seg); vec3 dir = seg / lung;
    float t = dot(vPos - uOcchio, dir);
    if (t > 0.0 && t < lung - 0.35 && length(vPos - uOcchio - dir * t) < uBuco.w) discard;
  }
  float luce = 1.0;
  if (uOmbra > 0.5) {
    vec3 dir = -uSoleVerso;
    vec3 q = vPos + dir * 0.35 + vec3(0.0, 0.15, 0.0);
    float passo = 0.6, cammino = 0.35, copertura = 0.0;
    for (int i = 0; i < 8; i++) {
      q += dir * passo; cammino += passo;
      vec2 uv = (q.xz - uAltRett.xy) * uAltRett.zw;
      float h = texture(uAltezze, uv).r * 255.0;
      copertura = max(copertura, clamp((h - q.y) / (0.3 + 0.10 * cammino), 0.0, 1.0));
      passo *= 1.35;
    }
    luce = 1.0 - copertura;
  }
  vec3 c = vColOmbra + vColSole * luce;
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, 1.0);
}`;

/** Da [x,y,z,scala]* a [x,y,z,scala,r,g,b,giro]* (tinta bianca, giro zero); a otto passa com'è. */
export function allungaIstanze(lista, perIstanza = 4) {
  if (perIstanza === 8) return lista instanceof Float32Array ? lista : new Float32Array(lista);
  const n = lista.length / 4, out = new Float32Array(n * 8);
  for (let i = 0; i < n; i++) { out.set([lista[i * 4], lista[i * 4 + 1], lista[i * 4 + 2], lista[i * 4 + 3], 1, 1, 1, 0], i * 8); }
  return out;
}

/**
 * UN CUBO PROCEDURALE nel formato dei modelli (20 byte per vertice), bianco:
 * la tinta la dà l'istanza. Base a y = 0, lato 1, centrato in x e z. È il
 * corpo del sandbox; con lo stesso stampo si fanno lastre e pali.
 */
export function modelloCubo(colore = [255, 255, 255], sx = 1, sy = 1, sz = 1) {
  const F = [   // [normale, quattro vertici in senso antiorario visti da fuori]
    [[0, 0, 1], [[-1, 0, 1], [1, 0, 1], [1, 1, 1], [-1, 1, 1]]],
    [[0, 0, -1], [[1, 0, -1], [-1, 0, -1], [-1, 1, -1], [1, 1, -1]]],
    [[1, 0, 0], [[1, 0, 1], [1, 0, -1], [1, 1, -1], [1, 1, 1]]],
    [[-1, 0, 0], [[-1, 0, -1], [-1, 0, 1], [-1, 1, 1], [-1, 1, -1]]],
    [[0, 1, 0], [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]]],
    [[0, -1, 0], [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]]],
  ];
  const n = 36, out = new Uint8Array(n * 20), dv = new DataView(out.buffer);
  let i = 0;
  const metti = (v, nn) => {
    const o = i * 20;
    dv.setFloat32(o, v[0] * sx / 2, true); dv.setFloat32(o + 4, v[1] * sy, true); dv.setFloat32(o + 8, v[2] * sz / 2, true);
    out[o + 12] = nn[0] * 127 & 255; out[o + 13] = nn[1] * 127 & 255; out[o + 14] = nn[2] * 127 & 255; out[o + 15] = 0;
    out[o + 16] = colore[0]; out[o + 17] = colore[1]; out[o + 18] = colore[2]; out[o + 19] = 255;
    i++;
  };
  for (const [nn, [a, b, c, d]] of F) { metti(a, nn); metti(b, nn); metti(c, nn); metti(a, nn); metti(c, nn); metti(d, nn); }
  return { byte: out, vertici: n, triangoli: 12, minY: 0, maxY: sy, raggio: Math.hypot(sx, sz) / 2 };
}

export class Modelli {
  constructor(gl) {
    this.gl = gl;
    this.programma = compila(gl, VS, FS);
    this.u = {};
    for (const n of ['uVP', 'uTempo', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uMaterie', 'uNebbia', 'uCam', 'uNebbiaCol', 'uOmbra', 'uAltezze', 'uAltRett', 'uTaglio', 'uBuco', 'uOcchio']) this.u[n] = gl.getUniformLocation(this.programma, n);
    this.tipi = new Map();   // nome → { vao, vbo, ibo, vertici, istanze: Float32Array, n }
    this.statistiche = { disegni: 0, triangoli: 0, istanze: 0 };
  }

  /** Registra un tipo di modello (dati da `leggiModello`). */
  registra(nome, modello) {
    const gl = this.gl;
    const t = { vao: gl.createVertexArray(), vbo: gl.createBuffer(), ibo: gl.createBuffer(), vertici: modello.vertici, triangoli: modello.triangoli, istanze: new Float32Array(0), n: 0, sporco: false, raggio: modello.raggio, maxY: modello.maxY };
    gl.bindVertexArray(t.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, t.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, modello.byte, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.BYTE, true, 20, 12);
    gl.enableVertexAttribArray(4); gl.vertexAttribIPointer(4, 1, gl.UNSIGNED_BYTE, 20, 15);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.UNSIGNED_BYTE, true, 20, 16);
    // ⚠ OTTO FLOAT PER ISTANZA: x y z scala | r g b giro. `istanze()` accetta
    // anche la forma corta a quattro (tinta bianca, giro zero) e la allunga.
    gl.bindBuffer(gl.ARRAY_BUFFER, t.ibo);
    gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 32, 0); gl.vertexAttribDivisor(3, 1);
    gl.enableVertexAttribArray(5); gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 32, 16); gl.vertexAttribDivisor(5, 1);
    gl.bindVertexArray(null);
    this.tipi.set(nome, t);
    return t;
  }

  /** Le istanze di un tipo: [x, y, z, scala, …]. Si ricarica al prossimo disegno. */
  istanze(nome, lista, perIstanza = 4) {
    const t = this.tipi.get(nome); if (!t) return;
    t.istanze = allungaIstanze(lista, perIstanza);
    t.n = t.istanze.length / 8; t.sporco = true;
  }

  /** Disegna tutti i tipi con le stesse uniform della resa dei chunk, nella
   *  passata in corso (la vista, o lo specchio: VP e taglio li dice la resa). */
  disegna(resa, camera) {
    const gl = this.gl, u = this.u, s = resa.sole;
    gl.useProgram(this.programma);
    gl.uniformMatrix4fv(u.uVP, false, resa.vpCorrente || resa.vp);
    gl.uniform1f(u.uTaglio, resa.taglio ?? -1e9);
    const buco = resa.vpCorrente === resa.vpSpecchio ? [0, 0, 0, 0] : (resa.buco || [0, 0, 0, 0]);
    gl.uniform3f(u.uOcchio, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform1f(u.uTempo, resa.tempo);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform3f(u.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
    gl.uniform4fv(u.uMaterie, resa.materie);
    gl.uniform2f(u.uNebbia, resa.nebbia.da, resa.nebbia.a);
    gl.uniform3f(u.uNebbiaCol, resa.nebbia.colore[0], resa.nebbia.colore[1], resa.nebbia.colore[2]);
    gl.uniform3f(u.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform1f(u.uOmbra, resa.ombra && resa.altezze ? 1 : 0);
    if (resa.altezze) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, resa.altezze); gl.uniform1i(u.uAltezze, 0); gl.uniform4f(u.uAltRett, resa.altRett[0], resa.altRett[1], resa.altRett[2], resa.altRett[3]); }
    let disegni = 0, tri = 0, ist = 0;
    for (const [nome, t] of this.tipi) {
      if (t.n === 0) continue;
      // ⚠ IL GIOCATORE NON SI BUCA: il buco serve a vederlo, non a cancellarlo
      gl.uniform4f(u.uBuco, buco[0], buco[1], buco[2], nome === 'omino' ? 0 : buco[3]);
      gl.bindVertexArray(t.vao);
      if (t.sporco) { gl.bindBuffer(gl.ARRAY_BUFFER, t.ibo); gl.bufferData(gl.ARRAY_BUFFER, t.istanze, gl.DYNAMIC_DRAW); t.sporco = false; }
      gl.drawArraysInstanced(gl.TRIANGLES, 0, t.vertici, t.n);
      disegni++; tri += t.triangoli * t.n; ist += t.n;
    }
    gl.bindVertexArray(null);
    this.statistiche.disegni = disegni; this.statistiche.triangoli = tri; this.statistiche.istanze = ist;
  }
}

// I BAGLIORI — il glow delle lanterne come lo facevano i vecchi giochi: uno
// SPRITE ADDITIVO a cartello per sorgente, niente passate a schermo intero.
//
// Quake, Ocarina, Mario 64: una lanterna accesa non «emette» nel frame buffer,
// ha davanti un quad che guarda sempre la camera, sfumato dal centro al bordo,
// sommato (blend additivo) a quello che c'è dietro. Costa un disegno a istanze
// per TUTTE le lanterne (sei vertici dal gl_VertexID, otto float per istanza)
// e dà il 90% del bloom con zero memoria in più. Il bloom vero (una passata a
// un quarto di risoluzione) è il gradino dopo, se il 🩺 lo permette.
//
// Il cartello sta un po' PIÙ VICINO alla camera della sorgente (un quarto del
// raggio), così il vetro della lanterna non lo copre; la profondità si legge
// ma non si scrive, quindi un muro davanti lo nasconde come deve. Di giorno
// il bagliore resta, tenue: il sole lo copre da sé.
import { compila } from './gl.js';

const VS = `#version 300 es
precision highp float;
layout(location = 0) in vec4 aPos;     // per istanza: x y z, raggio
layout(location = 1) in vec4 aCol;     // per istanza: r g b, forza
uniform mat4 uVP;
uniform vec3 uCam;
uniform float uSoleForza;
out vec2 vUv;
out vec4 vCol;
void main() {
  int id = gl_VertexID;
  vec2 q = vec2((id == 1 || id == 2 || id == 4) ? 1.0 : -1.0, (id == 2 || id == 4 || id == 5) ? 1.0 : -1.0);
  vec3 verso = normalize(uCam - aPos.xyz);
  vec3 destra = normalize(cross(vec3(0.0, 1.0, 0.0), verso));
  vec3 su = cross(verso, destra);
  vec3 p = aPos.xyz + verso * aPos.w * 0.25 + (destra * q.x + su * q.y) * aPos.w;
  vUv = q;
  // di notte pieno, di giorno un quarto: il sole lo copre da sé
  vCol = vec4(aCol.rgb * aCol.a * mix(1.0, 0.22, uSoleForza), 1.0);
  gl_Position = uVP * vec4(p, 1.0);
}`;
const FS = `#version 300 es
precision mediump float;
in vec2 vUv;
in vec4 vCol;
out vec4 colore;
void main() {
  float d = length(vUv);
  if (d > 1.0) discard;
  // ⚠ DUE CERCHI CONCENTRICI PIATTI, dello stesso colore, in trasparenza: come le
  // «fake point light» di Unity a cui ci ispiriamo. Niente alone bianco sfumato
  // («fuori stile»): il cuore è lo stesso colore, solo più pieno.
  float a = (d < 0.5 ? 0.16 : 0.0) + (d < 1.0 ? 0.14 : 0.0);   // tenui: additivi, sul verde diventavano bianchi
  colore = vec4(vCol.rgb * a, 1.0);
}`;

export class Bagliori {
  constructor(gl) {
    this.gl = gl;
    this.programma = compila(gl, VS, FS);
    this.u = {}; for (const n of ['uVP', 'uCam', 'uSoleForza']) this.u[n] = gl.getUniformLocation(this.programma, n);
    this.vao = gl.createVertexArray(); this.ibo = gl.createBuffer();
    gl.bindVertexArray(this.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ibo);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 4, gl.FLOAT, false, 32, 0); gl.vertexAttribDivisor(0, 1);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 32, 16); gl.vertexAttribDivisor(1, 1);
    gl.bindVertexArray(null);
    this.n = 0; this.attivo = true;
    this.statistiche = { disegni: 0, bagliori: 0 };
  }

  /** Le sorgenti: [x, y, z, raggio, r, g, b, forza, …] (otto float l'una). */
  istanze(lista) {
    const gl = this.gl, a = lista instanceof Float32Array ? lista : new Float32Array(lista);
    this.n = a.length / 8;
    gl.bindBuffer(gl.ARRAY_BUFFER, this.ibo); gl.bufferData(gl.ARRAY_BUFFER, a, gl.DYNAMIC_DRAW);
  }

  /** Dopo l'acqua, additivo, profondità letta e non scritta. */
  disegna(resa, camera) {
    const gl = this.gl, u = this.u;
    if (!this.attivo || this.n === 0) { this.statistiche.disegni = 0; this.statistiche.bagliori = 0; return; }
    gl.useProgram(this.programma);
    gl.uniformMatrix4fv(u.uVP, false, resa.vp);
    gl.uniform3f(u.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform1f(u.uSoleForza, resa.sole.forza);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE);
    gl.depthMask(false); gl.disable(gl.CULL_FACE);
    gl.bindVertexArray(this.vao);
    gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, this.n);
    gl.bindVertexArray(null);
    gl.depthMask(true); gl.enable(gl.CULL_FACE); gl.disable(gl.BLEND);
    this.statistiche.disegni = 1; this.statistiche.bagliori = this.n;
  }
}

// IL CONTESTO WEBGL2 DEL NUCLEO — poche righe, nessuna magia.
//
// ⚠ QUI NON C'È BABYLON, ed è il punto (docs/RIFONDAZIONE.md §3): il nucleo parla
// con la GPU direttamente, così ogni chiamata di disegno costa quello che costa
// il driver e niente di più. Su Android ogni disegno «di libreria» pesava
// 0,1-0,2 ms di JS; qui un disegno è un `bindVertexArray` e un `drawElements`.

/** Crea il contesto. `dprMax` è l'unico freno alla risoluzione: la grafica è la
 *  stessa ovunque, i pixel no (un telefono a dpr 3 non ne ha bisogno). */
export function creaContesto(tela, { antialias = true, dprMax = 1.5 } = {}) {
  const gl = tela.getContext('webgl2', {
    antialias, alpha: false, depth: true, stencil: false,
    // ⚠ SPENTO: con lo scatto si ridisegna e si legge nello stesso giro.
    preserveDrawingBuffer: false, powerPreference: 'high-performance', desynchronized: false,
  });
  if (!gl) throw new Error('WebGL2 non disponibile');
  const dpr = Math.min(dprMax, devicePixelRatio || 1);
  const ridimensiona = () => {
    const w = Math.max(1, Math.round(tela.clientWidth * dpr)), h = Math.max(1, Math.round(tela.clientHeight * dpr));
    if (tela.width !== w || tela.height !== h) { tela.width = w; tela.height = h; gl.viewport(0, 0, w, h); return true; }
    return false;
  };
  ridimensiona();
  return { gl, dpr, ridimensiona };
}

export function compila(gl, sorgenteV, sorgenteF) {
  const fai = (tipo, src) => {
    const s = gl.createShader(tipo);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(`shader: ${gl.getShaderInfoLog(s)}\n${src.split('\n').map((r, i) => `${i + 1}: ${r}`).join('\n')}`);
    return s;
  };
  const p = gl.createProgram();
  gl.attachShader(p, fai(gl.VERTEX_SHADER, sorgenteV));
  gl.attachShader(p, fai(gl.FRAGMENT_SHADER, sorgenteF));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(`programma: ${gl.getProgramInfoLog(p)}`);
  return p;
}

/** Il nome della scheda, se il browser lo dice (Chrome sì, Firefox no). */
export function nomeScheda(gl) {
  const e = gl.getExtension('WEBGL_debug_renderer_info');
  return e ? gl.getParameter(e.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER);
}

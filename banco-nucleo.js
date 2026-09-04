function Te(i,{antialias:e=!0,dprMax:a=1.5}={}){let o=i.getContext("webgl2",{antialias:e,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!o)throw new Error("WebGL2 non disponibile");let t=Math.min(a,devicePixelRatio||1),r=()=>{let n=Math.max(1,Math.round(i.clientWidth*t)),s=Math.max(1,Math.round(i.clientHeight*t));return i.width!==n||i.height!==s?(i.width=n,i.height=s,o.viewport(0,0,n,s),!0):!1};return r(),{gl:o,dpr:t,ridimensiona:r}}function W(i,e,a){let o=(r,n)=>{let s=i.createShader(r);if(i.shaderSource(s,n),i.compileShader(s),!i.getShaderParameter(s,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(s)}
${n.split(`
`).map((f,l)=>`${l+1}: ${f}`).join(`
`)}`);return s},t=i.createProgram();if(i.attachShader(t,o(i.VERTEX_SHADER,e)),i.attachShader(t,o(i.FRAGMENT_SHADER,a)),i.linkProgram(t),!i.getProgramParameter(t,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(t)}`);return t}function Bo(i){let e=i.getExtension("WEBGL_debug_renderer_info");return e?i.getParameter(e.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function Y(i,e,a){return(Math.sign(i)+1)*9+(Math.sign(e)+1)*3+(Math.sign(a)+1)}var Tt=Y(1,0,0),_t=Y(-1,0,0),St=Y(0,1,0),Rt=Y(0,-1,0),Ct=Y(0,0,1),zt=Y(0,0,-1);var _e=[Tt,_t,St,Rt,Ct,zt],Mo=class{constructor(e=1024){this.byte=new Uint8Array(e*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(e){let a=(this.n+e)*12;if(a<=this.byte.length)return;let o=this.byte.length*2;for(;o<a;)o*=2;let t=new Uint8Array(o);t.set(this.byte),this.byte=t,this.u32=new Uint32Array(t.buffer)}vertice(e,a,o,t,r,n,s,f=0,l=0){let u=Math.round(e*16)+16,m=Math.round(o*16)+16,h=Math.round(a*16);if(u<0||u>511||m<0||m>511||h<0||h>65535)throw new RangeError(`vertice fuori dal chunk: ${e},${a},${o}`);if(t<0||t>26||t===13)throw new RangeError(`normale non valida: ${t}`);this._spazio(1);let c=this.n*3,d=this.byte,b=this.u32;b[c]=(u|m<<9|(t&31)<<18|(f&1)<<23|(l&15)<<24)>>>0,b[c+1]=(h|(r&15)<<16|(n&15)<<20)>>>0;let p=this.n*12+8;d[p]=s>>16&255,d[p+1]=s>>8&255,d[p+2]=s&255,d[p+3]=0,this.n++}quadDa(e,a,o,t){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let r of[e,a,o,t])this.vertice(...r);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function Se(i=16384){let e=new Uint16Array(i*6);for(let a=0,o=0,t=0;a<i;a++,t+=4)e[o++]=t,e[o++]=t+1,e[o++]=t+2,e[o++]=t,e[o++]=t+2,e[o++]=t+3;return e}function Re(i,e,a,o){let t=1/Math.tan(i/2),r=1/(a-o);return new Float32Array([t/e,0,0,0,0,t,0,0,0,0,(o+a)*r,-1,0,0,2*o*a*r,0])}function re(i,e,a){let o=1/(a-e);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*o,0,0,0,-(a+e)*o,1])}function qo(i,e,a=[0,1,0]){let o=i[0]-e[0],t=i[1]-e[1],r=i[2]-e[2],n=Math.hypot(o,t,r)||1;o/=n,t/=n,r/=n;let s=a[1]*r-a[2]*t,f=a[2]*o-a[0]*r,l=a[0]*t-a[1]*o;n=Math.hypot(s,f,l)||1,s/=n,f/=n,l/=n;let u=t*l-r*f,m=r*s-o*l,h=o*f-t*s;return new Float32Array([s,u,o,0,f,m,t,0,l,h,r,0,-(s*i[0]+f*i[1]+l*i[2]),-(u*i[0]+m*i[1]+h*i[2]),-(o*i[0]+t*i[1]+r*i[2]),1])}function Ce(i,e=new Float32Array(16)){let[a,o,t,r,n,s,f,l,u,m,h,c,d,b,p,g]=i,E=a*s-o*n,v=a*f-t*n,_=a*l-r*n,R=o*f-t*s,S=o*l-r*s,z=t*l-r*f,x=u*b-m*d,A=u*p-h*d,T=u*g-c*d,C=m*p-h*b,N=m*g-c*b,I=h*g-c*p,O=E*I-v*N+_*C+R*T-S*A+z*x;return O?(O=1/O,e[0]=(s*I-f*N+l*C)*O,e[1]=(t*N-o*I-r*C)*O,e[2]=(b*z-p*S+g*R)*O,e[3]=(h*S-m*z-c*R)*O,e[4]=(f*T-n*I-l*A)*O,e[5]=(a*I-t*T+r*A)*O,e[6]=(p*_-d*z-g*v)*O,e[7]=(u*z-h*_+c*v)*O,e[8]=(n*N-s*T+l*x)*O,e[9]=(o*T-a*N-r*x)*O,e[10]=(d*S-b*_+g*E)*O,e[11]=(m*_-u*S-c*E)*O,e[12]=(s*A-n*C-f*x)*O,e[13]=(a*C-o*A+t*x)*O,e[14]=(b*v-d*R-p*E)*O,e[15]=(u*R-m*v+h*E)*O,e):null}function Po(i,e,a=new Float32Array(16)){for(let o=0;o<4;o++)for(let t=0;t<4;t++)a[o*4+t]=i[t]*e[o*4]+i[4+t]*e[o*4+1]+i[8+t]*e[o*4+2]+i[12+t]*e[o*4+3];return a}function ne(i,e=new Float32Array(24)){let a=f=>[i[f],i[4+f],i[8+f],i[12+f]],o=a(0),t=a(1),r=a(2),n=a(3),s=[[n[0]+o[0],n[1]+o[1],n[2]+o[2],n[3]+o[3]],[n[0]-o[0],n[1]-o[1],n[2]-o[2],n[3]-o[3]],[n[0]+t[0],n[1]+t[1],n[2]+t[2],n[3]+t[3]],[n[0]-t[0],n[1]-t[1],n[2]-t[2],n[3]-t[3]],[n[0]+r[0],n[1]+r[1],n[2]+r[2],n[3]+r[3]],[n[0]-r[0],n[1]-r[1],n[2]-r[2],n[3]-r[3]]];for(let f=0;f<6;f++){let[l,u,m,h]=s[f],c=Math.hypot(l,u,m)||1;e[f*4]=l/c,e[f*4+1]=u/c,e[f*4+2]=m/c,e[f*4+3]=h/c}return e}function se(i,e,a,o,t,r,n){for(let s=0;s<6;s++){let f=i[s*4],l=i[s*4+1],u=i[s*4+2],m=i[s*4+3],h=f>0?t:e,c=l>0?r:a,d=u>0?n:o;if(f*h+l*c+u*d+m<0)return!1}return!0}var Ft=`#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale vento materia \xB7 B: y cielo blocco (nucleo/formato.js)
layout(location = 1) in uvec4 aC;   // r g b 0
uniform mat4 uVP;
uniform vec3 uChunk;
uniform float uTempo;
uniform vec3 uSoleVerso;      // da dove ARRIVA la luce (verso il basso)
uniform float uSoleForza;
uniform vec4 uMaterie[16];    // per materia: emissione, brillio, riflesso, (libero)
uniform vec2 uNebbia;
uniform vec3 uCam;
flat out vec3 vBase;          // il colore cotto, lineare
flat out float vSole;         // quanto sole prende la faccia, a bande (l'horizon map lo pu\xF2 togliere)
flat out float vEmis;         // materia emissiva
flat out float vCielo;        // il cielo \xE8 PER FACCIA (la regola di Leafy: niente sfumature sui solidi)
flat out float vFaccia;       // 1 = la faccia guarda il sole, 0 = \xE8 di spalle (sui blocchi: sempre 1)
flat out vec3 vN;             // la normale geometrica: serve alla mappa d'ombra per non avere acne
flat out vec3 vOmbra;         // il colore d'ombra stilizzato (hue shift verso il blu), lineare
out float vBlocco;            // la luce di blocco sfuma: le pozze dei lampioni sono tonde
out float vNebbia;
out vec3 vPos;
// \u26A0 L'OMBRA DI LEAFY NON \xC8 \xABPI\xD9 SCURO\xBB: \xE8 lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' pi\xF9 satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: \xABle ombre sono solo il colore
// hue shift pi\xF9 scuro stilizzato\xBB.
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y), e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
uniform vec3 uStile;   // spostamento di tinta verso il blu, saturazione, valore (resa.stile: l'Officina li muove)
vec3 ombraStile(vec3 s) {
  vec3 h = rgb2hsv(s);
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via pi\xF9 corta verso il blu
  // \u26A0 MISURATO SULLE CONCEPT: il terracotta si sposta appena (3 %: #e59b69 \u2192
  // #bf704b), il verde molto di pi\xF9 (15 %: #5ac550 \u2192 #34974c). I colori caldi
  // (tinta sotto i 40\xB0) prendono un quinto dello spostamento.
  float caldo = 1.0 - smoothstep(0.11, 0.25, h.x);
  float freddo = smoothstep(0.42, 0.55, h.x);   // i verdi-petrolio e i blu (la chioma dell'albero) restano loro: viravano al ciano
  h.x = fract(h.x + d * uStile.x * mix(1.0, 0.2, caldo) * mix(1.0, 0.35, freddo));
  h.y = min(1.0, h.y * uStile.y + 0.03);
  h.z *= uStile.z;
  return hsv2rgb(h);
}
void main() {
  // \u26A0 POSIZIONI IN SEDICESIMI (nucleo/formato.js): x e z con un blocco di margine, y dallo scarto del chunk
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
  vCielo = float((B >> 16u) & 15u) / 15.0;
  vBlocco = float((B >> 20u) & 15u) / 15.0;
  // \u26A0 IL COLORE \xC8 QUELLO COTTO DAL MESHER (la palette di Leafy), in spazio lineare
  vBase = pow(vec3(aC.xyz) / 255.0, vec3(2.2));
  vOmbra = pow(ombraStile(vec3(aC.xyz) / 255.0), vec3(2.2));
  vEmis = uMaterie[materia].x;
  // \u26A0 LA LUCE \xC8 A DUE BANDE PER DIREZIONE DEL SOLE, come nel cel shading: una
  // faccia che guarda il sole ha il colore pieno, una di spalle ha il colore
  // d'ombra \u2014 lo STESSO di chi sta nell'ombra portata. Non \xE8 lo shading di
  // Minecraft (che scurisce i lati sempre, per convenzione): due oggetti dello
  // stesso colore hanno lo stesso colore, e cambia solo chi \xE8 al sole o in
  // ombra. Senza questo tutto era piatto (\xABcome se tutto fosse piatto\xBB).
  // \u26A0 DUE TINTE E BASTA, MISURATE SULLE CONCEPT: il fianco al sole dell'isola
  // \xE8 #e69c67, quello di spalle #bf6f4b (lo stesso colore, tinta spostata,
  // pi\xF9 scuro). Niente mezza banda: era quella, sugli smussi, il \xABleggero
  // face shading a bordo dei blocchi\xBB. Uno smusso a 45\xB0 cade sempre nella
  // tinta di una delle due facce vicine, e non fa riga.
  vFaccia = dot(n, -uSoleVerso) > 0.0 ? 1.0 : 0.0;
  vN = n;
  vSole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  float d = distance(p, uCam);
  vNebbia = clamp((d - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,ze=`#version 300 es
precision mediump float;
precision mediump sampler2D;
flat in vec3 vBase;
flat in float vSole;
flat in float vEmis;
flat in float vCielo;
flat in float vFaccia;
flat in vec3 vN;
flat in vec3 vOmbra;
in float vBlocco;
in float vNebbia;
in highp vec3 vPos;   // \u26A0 highp: l'ombra si legge a coordinate di mondo (\xB1256), in mediump ballerebbe di un quarto di blocco
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI pi\xF9 vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// \u26A0 LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni (\xABesagonale\xBB).
// La luce cotta resta come MASCHERA (dietro un muro non si passa) e per le
// lampade-blocco, che non stanno nella lista.
float pozza(highp vec3 pos) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    s += q < 0.55 ? 1.0 : (q < 1.0 ? 0.45 : 0.0);
  }
  return min(s, 1.0);
}

uniform vec3 uNebbiaCol;
uniform vec3 uSoleCol;
uniform vec3 uCieloCol;          // il colore dell'ombra: \xC8 il cielo
uniform float uOmbra;            // 1 = ombra del sole accesa
uniform highp float uSoleForza;  // \u26A0 highp come nel vertex, o il link fallisce (\xABprecisions differ\xBB)
uniform highp float uTaglio;     // sotto questa quota non si disegna (la passata dello specchio)
// \u26A0 STESSA PRECISIONE DEL VERTEX: un uniform condiviso fra i due shader deve
// avere la stessa precisione, o il link fallisce (\xABprecisions differ\xBB).
uniform highp vec3 uSoleVerso;
uniform sampler2D uOmbre;        // la mappa delle ombre: quota d'ombra per colonna (Resa._calcolaOmbre)
uniform vec2 uOmbreScala;        // come si decodifica: quota = r * x + y
uniform highp vec4 uAltRett;           // x0, z0, 1/larghezza, 1/profondita
uniform highp vec4 uBuco;        // il buco di visuale della terza persona: il giocatore (xyz) e il raggio (0 = spento)
uniform highp vec3 uOcchio;      // da dove guarda la camera
uniform highp sampler2DShadow uMappaStat;   // la mappa d'ombra FERMA: terreno, lampioni, alberi (si rif\xE0 quando serve)
uniform highp sampler2DShadow uMappaDin;    // quella di chi si muove (gatto, corpi): ogni fotogramma, piccola
uniform highp mat4 uLuceVP;                 // mondo \u2192 clip del sole
uniform float uMappaOn;                     // 1 = la mappa vale
uniform vec2 uMappaSbieco;                  // x: scostamento lungo la normale (blocchi), y: bias di profondit\xE0 (clip 0..1)
// \u26A0 LA MAPPA D'OMBRA VERA (Resa._aggiornaMappa): profondit\xE0 vista dal sole,
// quindi l'ombra ha la FORMA della cosa \u2014 il palo del lampione, il gatto, la
// chioma \u2014 non della colonna. Il confronto lo fa la texture (sampler2DShadow,
// 2\xD72 in hardware: bordo netto ma senza scalini); lo scostamento lungo la
// normale e il bias tolgono l'acne. Fuori dalla mappa torna -1 e si usa la
// mappa per colonna (ombraSole), che copre tutto il mondo in streaming.
uniform highp mat4 uLuceVPDin;              // mondo \u2192 clip della mappa di chi si muove (pi\xF9 stretta: pi\xF9 fitta)
uniform vec2 uMappaTexel;                   // mezzo texel delle due mappe, in uv
// \u26A0 QUATTRO LETTURE A MEZZO TEXEL E POI UNA SOGLIA: il bordo resta netto ma
// senza scalini (le ombre \xABpixellate\xBB). Ogni lettura \xE8 gi\xE0 un 2\xD72 in hardware.
float pcf(highp sampler2DShadow m, highp vec3 c, float t) {
  return 0.25 * (texture(m, c + vec3(-t, -t, 0.0)) + texture(m, c + vec3(t, -t, 0.0)) + texture(m, c + vec3(-t, t, 0.0)) + texture(m, c + vec3(t, t, 0.0)));
}
float ombraMappa(highp vec3 pos, vec3 n) {
  if (uMappaOn < 0.5) return -1.0;
  highp vec3 p = pos + n * uMappaSbieco.x;
  highp vec4 q = uLuceVP * vec4(p, 1.0);
  highp vec3 u = q.xyz * 0.5 + 0.5;
  if (u.x < 0.004 || u.x > 0.996 || u.y < 0.004 || u.y > 0.996 || u.z > 1.0) return -1.0;
  float s = pcf(uMappaStat, vec3(u.xy, u.z - uMappaSbieco.y), uMappaTexel.x);
  highp vec4 q2 = uLuceVPDin * vec4(p, 1.0);
  highp vec3 u2 = q2.xyz * 0.5 + 0.5;
  if (u2.x > 0.002 && u2.x < 0.998 && u2.y > 0.002 && u2.y < 0.998 && u2.z <= 1.0) s = min(s, pcf(uMappaDin, vec3(u2.xy, u2.z - uMappaSbieco.y), uMappaTexel.y));
  return smoothstep(0.3, 0.7, s);
}
out vec4 colore;
// \u26A0 L'OMBRA DEL SOLE \xC8 UNA LETTURA SOLA: la mappa delle ombre (uOmbre, per
// colonna: la quota sotto cui si \xE8 in ombra, calcolata dalla GPU quando il sole
// si sposta, vedi Resa._calcolaOmbre) letta mezzo blocco VERSO il sole (cos\xEC
// una parete al sole legge la colonna davanti, non la propria) e confrontata
// con la quota del pixel con una soglia netta: cel shading, niente acne,
// niente puntini, niente penombra sbavata.
float ombraSole(highp vec3 pos) {
  vec2 dir = -uSoleVerso.xz; float l = length(dir); dir = l > 1e-4 ? dir / l : vec2(0.0);
  highp vec2 uv = (pos.xz + dir * 0.5 - uAltRett.xy) * uAltRett.zw;
  float hs = texture(uOmbre, uv).r * uOmbreScala.x + uOmbreScala.y;
  return 1.0 - smoothstep(-0.04, 0.04, hs - (pos.y + 0.03));
}
void main() {
  if (vPos.y < uTaglio) discard;   // lo specchio non guarda sott'acqua
  if (uBuco.w > 0.0) {
    vec3 seg = uBuco.xyz - uOcchio; float lung = length(seg); vec3 dir = seg / lung;
    float t = dot(vPos - uOcchio, dir);
    if (t > 0.0 && t < lung - 0.35 && length(vPos - uOcchio - dir * t) < uBuco.w) discard;
  }
  float luce = vFaccia;
  if (uOmbra > 0.5 && luce > 0.0) { float m = ombraMappa(vPos, vN); luce *= m >= 0.0 ? m : ombraSole(vPos); }
  // le bande: il cielo a quattro (per faccia), la lampada a quattro (sulla luce
  // interpolata: pozze tonde), il sole diretto solo dove il cielo \xE8 pieno
  float cieloB = floor(vCielo * 4.0 + 0.5) / 4.0;
  // \u26A0 LE POZZE: cerchi netti (pozza) dove la luce cotta dice che la luce arriva,
  // le bande cotte per le lampade-blocco; di giorno si spengono (il sole le sovrasta)
  float notte = 1.0 - smoothstep(0.30, 0.75, uSoleForza);
  float lamp = max(pozza(vPos) * step(0.02, vBlocco), floor(vBlocco * 4.0 + 0.5) / 4.0) * notte;
  float sole = vSole * step(0.99, vCielo) * luce;
  // l'ombra: il colore stilizzato (hue shift), tinto dal giorno/notte, pi\xF9 scuro senza cielo
  vec3 ombra = vOmbra * uCieloCol * (0.30 + 0.70 * cieloB);
  vec3 pieno = vBase * uSoleCol;
  if (vEmis > 0.0) { ombra = mix(ombra, vBase * 1.15, vEmis); pieno = mix(pieno, vBase * 1.15, vEmis); }   // emissiva: scavalca ombra e notte
  // \u26A0 LE POZZE DEI LAMPIONI SONO CALDE E PIENE: 1,3 sopra il bianco
  vec3 c = mix(ombra, pieno, sole) + vBase * vec3(1.30, 1.02, 0.58) * lamp;
  // \u26A0 I CONTI SONO IN SPAZIO LINEARE: qui si torna in sRGB, o tutto esce scuro e saturo.
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, 1.0);
}`,yt=`#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale cima \xB7 B: y prof livello
layout(location = 1) in uvec4 aC;   // r g b 0
uniform mat4 uVP;
uniform vec3 uChunk;
uniform float uTempo;
uniform vec3 uCam;
uniform vec2 uNebbia;
uniform float uMare;                // il meteo: 0 = specchio, 1 = mosso
out vec3 vPos;
out vec3 vCol;
out float vProf;
out float vNebbia;
flat out float vPelo;
// \u26A0 TRE ONDE LUNGHE DA TRE DIREZIONI, con lunghezze che non si dividono
// (12, 7 e 4,6 blocchi) e velocit\xE0 diverse: cos\xEC il disegno non si ripete a
// vista. Le stesse tre stanno nel fragment (la normale \xE8 la loro derivata),
// e l'ampiezza la decide il meteo. Con una sola il lago era un tappeto.
float onde(vec2 p, float t) {
  return sin(dot(p, vec2(0.80, 0.60)) * 0.53 + t * 0.9) + 0.7 * sin(dot(p, vec2(-0.50, 0.87)) * 0.91 + t * 1.3) + 0.5 * sin(dot(p, vec2(0.30, -0.95)) * 1.37 + t * 1.7);
}
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  uint normale = (A >> 18u) & 31u;
  bool cima = ((A >> 23u) & 1u) == 1u;   // vertice in cima alla cella: il pelo, o l'orlo di una parete
  float prof = float((B >> 16u) & 15u);
  float liv = float((B >> 20u) & 15u);
  // il pelo: peloDi() di world/pelo.js, e un'onda piccola (moto 0,018 del lago)
  if (cima) p.y -= (1.0 + 2.0 * liv) / 16.0;
  p.y += mix(0.012, 0.07, uMare) * onde(p.xz, uTempo);
  vPos = p;
  vCol = pow(vec3(aC.xyz) / 255.0, vec3(2.2));
  vProf = prof;
  vPelo = normale == 16u ? 1.0 : 0.0;   // 16 = (0, +1, 0) nell'indice a 27
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  gl_Position = uVP * vec4(p, 1.0);
}`,Lt=`#version 300 es
// \u26A0 highp come il vertex: gli uniform sono condivisi e la precisione deve coincidere
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
uniform float uMare;             // il meteo: 0 = specchio, 1 = mosso
out vec4 colore;
// la pendenza delle tre onde lunghe del vertex (la derivata), per la normale
vec2 pendenza(vec2 p, float t) {
  return vec2(0.80, 0.60) * 0.53 * cos(dot(p, vec2(0.80, 0.60)) * 0.53 + t * 0.9)
       + vec2(-0.50, 0.87) * 0.64 * cos(dot(p, vec2(-0.50, 0.87)) * 0.91 + t * 1.3)
       + vec2(0.30, -0.95) * 0.69 * cos(dot(p, vec2(0.30, -0.95)) * 1.37 + t * 1.7);
}
// \u26A0 LE INCRESPATURE: tre onde corte (1,5 \xB7 1 \xB7 0,65 blocchi) e svelte sopra
// quelle lunghe. Sono loro a rompere la ripetizione e a fare le scintille del
// sole: senza, le onde lunghe da sole facevano bolle (\xABmetaball\xBB).
vec2 increspa(vec2 p, float t) {
  return vec2(0.96, 0.28) * 0.50 * cos(dot(p, vec2(0.96, 0.28)) * 4.1 + t * 3.1)
       + vec2(-0.37, 0.93) * 0.35 * cos(dot(p, vec2(-0.37, 0.93)) * 6.3 + t * 2.4)
       + vec2(0.71, -0.71) * 0.20 * cos(dot(p, vec2(0.71, -0.71)) * 9.7 + t * 4.0 + 1.7);
}
void main() {
  vec3 vista = normalize(uCam - vPos);
  float dist = distance(uCam, vPos);
  // \u26A0 LA NORMALE VIENE DALLE ONDE LUNGHE E BASTA: lisce e leggibili. Le
  // increspature fini facevano un riflesso \xABcasuale\xBB e brillii a coriandoli
  // (\xABguardando il sole si nota che le onde non sono fatte bene\xBB).
  vec2 g = pendenza(vPos.xz, uTempo) * mix(0.05, 0.22, uMare);
  vec3 n = vPelo > 0.5 ? normalize(vec3(-g.x, 1.0, -g.y)) : vec3(0.0, 1.0, 0.0);
  // profondit\xE0 \u2192 violaceo e opaco (scala 0,12 per blocco, corpo come la ricetta)
  float k = clamp(vProf * 0.12, 0.0, 1.0);
  vec3 viola = pow(vec3(0.38, 0.30, 0.62), vec3(2.2));
  vec3 acqua = mix(vCol, viola, k * 0.75);
  float alfa = mix(0.34, 0.88, k);
  // il sole: la luce sul pelo, a gradino (prima del riflesso: il riflesso ha gi\xE0 la sua luce)
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  acqua *= mix(uCieloCol * 0.7, uSoleCol, sole * 0.85);
  // il cielo capovolto: fresnel verso il colore del cielo (la nebbia \xC8 il cielo all'orizzonte)
  float fres = pow(1.0 - max(dot(n, vista), 0.0), 3.0);
  vec3 cielo = pow(uNebbiaCol, vec3(2.2));
  // \u26A0 LO SPECCHIO SI LEGGE A SCHERMO: la passata specchiata usa la stessa
  // proiezione, quindi il riflesso di questo pixel sta in questo pixel. Le
  // onde lo spostano di un soffio (n.xz), che \xE8 quanto basta a farlo vivere.
  // \u26A0 LA DEFORMAZIONE \xC8 PICCOLA (1-4 % dello schermo, con lo 0,45 di prima
  // erano bolle) e CALA CON LA DISTANZA (da lontano un'onda \xE8 un pixel), e si
  // spegne ai bordi dello schermo: fuori dallo specchio non c'\xE8 niente, e il
  // riflesso \xABtagliato\xBB era il bordo che si spalmava.
  vec2 s = gl_FragCoord.xy * uSchermo.xy;
  float bordo = smoothstep(0.0, 0.08, min(min(s.x, 1.0 - s.x), min(s.y, 1.0 - s.y)));
  vec2 uv = clamp(s + n.xz * mix(0.03, 0.10, uMare) * vPelo * bordo / (1.0 + dist * 0.02), 0.002, 0.998);
  vec3 riflesso = mix(cielo, pow(texture(uSpecchio, uv).rgb, vec3(2.2)), uSchermo.z);
  // \u26A0 IL CIELO CAPOVOLTO SOLO RADENTE quando non c'\xE8 specchio: a 45\xB0 il fresnel
  // cubico vale il 2%. Con lo specchio il riflesso c'\xE8 sempre un po' (22%) e
  // radente \xE8 quasi tutto (85%): l'acqua resta acqua guardandola dall'alto.
  // dall'alto l'acqua resta del SUO colore (riflesso al 20 %, calmo; 12 % mosso), radente \xE8 cielo
  float peso = mix(fres * 0.55, mix(mix(0.20, 0.12, uMare), 0.85, fres), uSchermo.z) * vPelo;
  acqua = mix(acqua, riflesso, peso);
  alfa = mix(alfa, 0.95, fres * vPelo);
  // il brillio del sole: una banda netta sulle onde lunghe (cel), pi\xF9 larga col mare mosso
  float brillio = step(mix(0.994, 0.982, uMare), dot(reflect(-vista, n), -uSoleVerso)) * uSoleForza * vPelo;
  acqua += vec3(0.8) * brillio;
  vec3 c = pow(mix(acqua, cielo, vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, mix(alfa, 1.0, vNebbia));
}`,It=`#version 300 es
precision highp float;
// \u26A0 UNA LAMELLA \xC8 UN'ISTANZA (nucleo/erba.js): la geometria la fa gl_VertexID
layout(location = 0) in uvec4 aA;   // x8 z8 y8 seme
layout(location = 1) in uvec4 aB;   // r g b (cielo<<2)
layout(location = 2) in uvec4 aC;   // altezza/64, larghezza/128, inclinazione/128+128, (blocco | punta<<4)
uniform mat4 uVP;
uniform vec3 uChunk;                // x0, yBase, z0
uniform float uTempo;
uniform vec3 uSoleVerso;
uniform float uSoleForza;
uniform vec2 uNebbia;
uniform vec3 uCam;
uniform vec2 uVento;                // direzione del vento in pianta
uniform float uErbaFinoA;           // oltre, niente lamelle: ci si arriva abbassandole, non tagliandole
out vec3 vBase;
out float vSole;
out float vEmis;
out float vCielo;
out float vBlocco;
out float vNebbia;
out vec3 vPos;
out float vFaccia;
out vec3 vN;
out vec3 vOmbra;
// \u26A0 L'OMBRA DI LEAFY NON \xC8 \xABPI\xD9 SCURO\xBB: \xE8 lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' pi\xF9 satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: \xABle ombre sono solo il colore
// hue shift pi\xF9 scuro stilizzato\xBB.
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y), e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
uniform vec3 uStile;   // spostamento di tinta verso il blu, saturazione, valore (resa.stile: l'Officina li muove)
vec3 ombraStile(vec3 s) {
  vec3 h = rgb2hsv(s);
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via pi\xF9 corta verso il blu
  // \u26A0 MISURATO SULLE CONCEPT: il terracotta si sposta appena (3 %: #e59b69 \u2192
  // #bf704b), il verde molto di pi\xF9 (15 %: #5ac550 \u2192 #34974c). I colori caldi
  // (tinta sotto i 40\xB0) prendono un quinto dello spostamento.
  float caldo = 1.0 - smoothstep(0.11, 0.25, h.x);
  float freddo = smoothstep(0.42, 0.55, h.x);   // i verdi-petrolio e i blu (la chioma dell'albero) restano loro: viravano al ciano
  h.x = fract(h.x + d * uStile.x * mix(1.0, 0.2, caldo) * mix(1.0, 0.35, freddo));
  h.y = min(1.0, h.y * uStile.y + 0.03);
  h.z *= uStile.z;
  return hsv2rgb(h);
}
void main() {
  vec3 base = uChunk + vec3(float(aA.x), float(aA.z), float(aA.y)) / 8.0;
  float seme = float(aA.w) / 255.0;
  float cielo = float(aB.w >> 2u) / 15.0;
  float alto = float(aC.x) / 64.0, largo = float(aC.y) / 128.0, inclina = (float(aC.z) - 128.0) / 128.0;
  // il verso della lamella in pianta (dal seme) e la sua perpendicolare
  float ang = seme * 6.2832;
  vec2 lungo = vec2(cos(ang), sin(ang)), largoV = vec2(-lungo.y, lungo.x);
  // la distanza decide la forma: rettangolo vicino, triangolo da 28 blocchi in poi,
  // e nell'ultimo quinto prima del confine la lamella si abbassa nel terreno
  float d = distance(base.xz, uCam.xz);
  float triangolo = smoothstep(28.0, 44.0, d);
  float fade = 1.0 - smoothstep(uErbaFinoA * 0.8, uErbaFinoA, d);
  alto *= fade;
  // i sei vertici del rettangolo: 0 basso-sx, 1 basso-dx, 2 alto-dx, 3 basso-sx, 4 alto-dx, 5 alto-sx
  int id = gl_VertexID;
  float punta = (id == 2 || id == 4 || id == 5) ? 1.0 : 0.0;
  float lato = (id == 1 || id == 2 || id == 4) ? 1.0 : -1.0;
  lato *= mix(1.0, 0.0, punta * triangolo);   // in alto, da lontano, le due punte si chiudono al centro
  vec3 p = base;
  p.xz += largoV * (lato * largo * 0.5) + lungo * (inclina * punta);
  p.y += alto * punta;
  if (punta > 0.5) {   // la punta ondeggia col vento, la base no: come il prato
    float f = sin(uTempo * 1.9 + seme * 6.28 + base.x * 0.35 + base.z * 0.5) * 0.5 + 0.5;
    p.xz += (uVento * (0.06 + 0.16 * f) + vec2(sin(uTempo * 3.1 + seme * 9.0), cos(uTempo * 2.3 + seme * 7.0)) * 0.03) * fade;
  }
  // \u26A0 IL COLORE \xC8 QUELLO DELLA CIMA DEL BLOCCO SOTTO, e la punta se ne scosta
  // di poco (0,90\u20261,10, quasi sempre \xB13%): la sfumatura di Leafy, non un
  // gradiente scuro-chiaro. Cel shading alla Zelda: la lamella \xE8 del prato.
  float scosta = 0.9 + 0.2 * float(aC.w >> 4u) / 15.0;
  // \u26A0 I CIUFFI SONO UN PO' PI\xD9 SCURI DEL PRATO (0,86: nelle concept i fili sono verde cupo sul verde pieno), radi
  vBase = pow(vec3(aB.xyz) / 255.0, vec3(2.2)) * 0.86 * mix(1.0, scosta, punta);
  vOmbra = pow(ombraStile(vec3(aB.xyz) / 255.0), vec3(2.2)) * 0.86 * mix(1.0, scosta, punta);
  // l'erba \xE8 del prato: guarda il sole come la cima del blocco (normale in su), senza bande sue
  vSole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  vFaccia = 1.0; vN = vec3(0.0, 1.0, 0.0);
  vCielo = cielo; vBlocco = float(aC.w & 15u) / 15.0; vEmis = 0.0;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,Nt=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,Pt=`#version 300 es
precision highp float;
in vec2 vNdc;
uniform mat4 uInvVP;
uniform vec3 uOcchio;
uniform vec3 uSoleVerso;
uniform float uSoleForza;
uniform vec3 uNebbiaCol;   // l'orizzonte (sRGB): la nebbia, cos\xEC il lontano ci si fonde
uniform vec3 uZenit;       // lo zenit (sRGB)
out vec4 colore;
void main() {
  vec4 p = uInvVP * vec4(vNdc, 1.0, 1.0);
  vec3 dir = normalize(p.xyz / p.w - uOcchio);
  float h = clamp(dir.y, 0.0, 1.0);
  vec3 c = mix(uNebbiaCol, uZenit, pow(h, 0.6));
  // il disco del sole e il suo alone caldo
  float d = max(dot(dir, -uSoleVerso), 0.0);
  c += vec3(1.0, 0.95, 0.80) * (smoothstep(0.99900, 0.99945, d) + 0.30 * pow(d, 40.0)) * uSoleForza;
  colore = vec4(c, 1.0);
}`,wt=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Ut=`#version 300 es
precision mediump float;
void main() {}`,ko=class{constructor(e){this.gl=e,this.programma=W(e,Ft,ze),this.u={};for(let a of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile"])this.u[a]=e.getUniformLocation(this.programma,a);this.ebo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,Se(16384),e.STATIC_DRAW),this.programmaErba=W(e,It,ze.replace(/flat in /g,"in ")),this.ue={};for(let a of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile"])this.ue[a]=e.getUniformLocation(this.programmaErba,a);this.programmaOmbra=W(e,wt,Ut),this.uo={uVP:e.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:e.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=W(e,yt,Lt),this.ua={};for(let a of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare"])this.ua[a]=e.getUniformLocation(this.programmaAcqua,a);this.programmaCielo=W(e,Nt,Pt),this.uc={};for(let a of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[a]=e.getUniformLocation(this.programmaCielo,a);this.vaoVuoto=e.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(256),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!e.getExtension("EXT_color_buffer_half_float")&&!!e.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),e.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(e,a){let o=this.mappa;Math.hypot(e+8-o.centro[0],a+8-o.centro[2])<=o.raggio+12&&(o.sporca=!0)}carica(e,a){let o=this.gl;this._sporcaMappa(a.cx*16,a.cz*16);let t=this.chunks.get(e);t||(t={vao:o.createVertexArray(),vbo:o.createBuffer(),quad:0},o.bindVertexArray(t.vao),o.bindBuffer(o.ARRAY_BUFFER,t.vbo),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,2,o.UNSIGNED_INT,12,0),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,8),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ebo),o.bindVertexArray(null),this.chunks.set(e,t)),o.bindBuffer(o.ARRAY_BUFFER,t.vbo),o.bufferData(o.ARRAY_BUFFER,a.byte,o.STATIC_DRAW),t.quad=a.quad;let r=a.erba;t.verticiErba=r?r.vertici:0,t.lamelle=r?r.fili:0,t.yBaseErba=r?r.yBase:0,t.verticiErba>0&&(t.vaoErba||(t.vaoErba=o.createVertexArray(),t.vboErba=o.createBuffer(),o.bindVertexArray(t.vaoErba),o.bindBuffer(o.ARRAY_BUFFER,t.vboErba),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,4,o.UNSIGNED_BYTE,12,0),o.vertexAttribDivisor(0,1),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,4),o.vertexAttribDivisor(1,1),o.enableVertexAttribArray(2),o.vertexAttribIPointer(2,4,o.UNSIGNED_BYTE,12,8),o.vertexAttribDivisor(2,1),o.bindVertexArray(null)),o.bindBuffer(o.ARRAY_BUFFER,t.vboErba),o.bufferData(o.ARRAY_BUFFER,r.byte,o.STATIC_DRAW));let n=a.acqua;if(t.quadAcqua=n?n.quad:0,t.peloAcqua=n&&n.pelo!=null?n.pelo:null,t.quadAcqua>0&&(t.vaoAcqua||(t.vaoAcqua=o.createVertexArray(),t.vboAcqua=o.createBuffer(),o.bindVertexArray(t.vaoAcqua),o.bindBuffer(o.ARRAY_BUFFER,t.vboAcqua),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,2,o.UNSIGNED_INT,12,0),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,8),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ebo),o.bindVertexArray(null)),o.bindBuffer(o.ARRAY_BUFFER,t.vboAcqua),o.bufferData(o.ARRAY_BUFFER,n.byte,o.STATIC_DRAW)),t.x0=a.cx*16,t.z0=a.cz*16,t.minY=a.minY,t.maxY=a.maxY,t.y0=a.y0||0,t.chunk=[t.x0,t.y0,t.z0],a.altezze){t.tegola||(t.tegola=new Uint8Array(256));for(let s=0;s<16;s++)for(let f=0;f<16;f++){let l=a.altezze[s*16+f];t.tegola[f*16+s]=l<0?0:Math.max(0,Math.min(255,l+1))}this.finestra&&this._scriviTegola(t)}}apriFinestraAltezze(e,a,o=512){let t=this.gl;this.altezze||(this.altezze=t.createTexture()),this.finestra={lato:o,x0:0,z0:0,vuota:new Uint8Array(o*o),spostamenti:0},t.bindTexture(t.TEXTURE_2D,this.altezze),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.NEAREST),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this._centraFinestra(e,a,!0)}seguiAltezze(e,a){this.finestra&&this._centraFinestra(e,a,!1)}_centraFinestra(e,a,o){let t=this.gl,r=this.finestra,n=r.lato/2;if(!o&&Math.abs(e-(r.x0+n))<r.lato/4&&Math.abs(a-(r.z0+n))<r.lato/4)return!1;r.x0=Math.floor((e-n)/16)*16,r.z0=Math.floor((a-n)/16)*16,this.altRett=[r.x0,r.z0,1/r.lato,1/r.lato],this.ombre.w!==r.lato?this._preparaOmbre(r.lato,r.lato):this.ombre.sporco=[0,0,r.lato,r.lato],t.bindTexture(t.TEXTURE_2D,this.altezze),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texImage2D(t.TEXTURE_2D,0,t.R8,r.lato,r.lato,0,t.RED,t.UNSIGNED_BYTE,r.vuota);for(let s of this.chunks.values())s.tegola&&this._scriviTegola(s);return r.spostamenti++,!0}_scriviTegola(e,a=!1){let o=this.gl,t=this.finestra,r=e.x0-t.x0,n=e.z0-t.z0;r<0||n<0||r+16>t.lato||n+16>t.lato||(o.bindTexture(o.TEXTURE_2D,this.altezze),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texSubImage2D(o.TEXTURE_2D,0,r,n,16,16,o.RED,o.UNSIGNED_BYTE,a?this._tegolaVuota:e.tegola),this._sporcaOmbre(r,n,16,16))}evidenzia(e,a,o,t=0){let r=this.gl;this.programmaSpigoli||(this.programmaSpigoli=W(r,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:r.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:r.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:r.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=r.createVertexArray());let n=this.uSpigoli;r.useProgram(this.programmaSpigoli),r.uniformMatrix4fv(n.uVP,!1,this.vp),r.bindVertexArray(this.vaoSpigoli),r.uniform4f(n.uCella,e,a,o,.012),r.uniform3f(n.uColore,.05,.16,.1),r.drawArrays(r.LINES,0,24),r.uniform4f(n.uCella,e,a,o,.004),r.uniform3f(n.uColore,1,1-.45*t,1-.8*t),r.drawArrays(r.LINES,0,24),r.bindVertexArray(null)}scatola(e,a,o,t,r,n,s=.3,f=.02){let l=this.gl;this.programmaPieno||(this.programmaPieno=W(l,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:l.getUniformLocation(this.programmaPieno,"uVP"),uCella:l.getUniformLocation(this.programmaPieno,"uCella"),uColore:l.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=l.createVertexArray());let u=this.uPieno;l.useProgram(this.programmaPieno),l.uniformMatrix4fv(u.uVP,!1,this.vp),l.uniform4f(u.uCella,e,a,o,f),l.uniform4f(u.uColore,t*s,r*s,n*s,s),l.bindVertexArray(this.vaoPieno),l.enable(l.BLEND),l.blendFunc(l.ONE,l.ONE_MINUS_SRC_ALPHA),l.depthMask(!1),l.disable(l.CULL_FACE),l.drawArrays(l.TRIANGLES,0,36),l.enable(l.CULL_FACE),l.depthMask(!0),l.disable(l.BLEND),l.bindVertexArray(null)}rimuovi(e){let a=this.chunks.get(e);a&&(this._sporcaMappa(a.x0,a.z0),this.finestra&&a.tegola&&this._scriviTegola(a,!0),this.gl.deleteVertexArray(a.vao),this.gl.deleteBuffer(a.vbo),a.vaoAcqua&&(this.gl.deleteVertexArray(a.vaoAcqua),this.gl.deleteBuffer(a.vboAcqua)),a.vaoErba&&(this.gl.deleteVertexArray(a.vaoErba),this.gl.deleteBuffer(a.vboErba)),this.chunks.delete(e))}_sporcaOmbre(e,a,o,t){let n=[Math.max(0,e-26),Math.max(0,a-26),Math.min(this.ombre.w||1e9,e+o+26),Math.min(this.ombre.h||1e9,a+t+26)],s=this.ombre.sporco;this.ombre.sporco=s?[Math.min(s[0],n[0]),Math.min(s[1],n[1]),Math.max(s[2],n[2]),Math.max(s[3],n[3])]:n}_preparaOmbre(e,a){let o=this.gl,t=this.ombre;if(t.tex||(t.tex=o.createTexture(),t.fbo=o.createFramebuffer()),o.bindTexture(o.TEXTURE_2D,t.tex),t.mezzoFloat=this._ombreMezzo,t.mezzoFloat?(o.texImage2D(o.TEXTURE_2D,0,o.R16F,e,a,0,o.RED,o.HALF_FLOAT,null),t.scala=1,t.offset=0):(o.texImage2D(o.TEXTURE_2D,0,o.R8,e,a,0,o.RED,o.UNSIGNED_BYTE,null),t.scala=64,t.offset=-8),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindFramebuffer(o.FRAMEBUFFER,t.fbo),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,t.tex,0),o.checkFramebufferStatus(o.FRAMEBUFFER)!==o.FRAMEBUFFER_COMPLETE&&t.mezzoFloat)return this._ombreMezzo=!1,o.bindFramebuffer(o.FRAMEBUFFER,null),this._preparaOmbre(e,a);if(o.bindFramebuffer(o.FRAMEBUFFER,null),t.w=e,t.h=a,t.sporco=[0,0,e,a],!this.programmaOmbre){this.programmaOmbre=W(o,`#version 300 es
void main() { vec2 q = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(q, 0.0, 1.0); }`,`#version 300 es
precision highp float;
uniform sampler2D uAltezze;   // R8: la cima di ogni colonna (+1) / 255
uniform vec4 uAltRett;        // x0, z0, 1/larghezza, 1/profondita
uniform vec3 uSole;           // direzione VERSO il sole in pianta (x, z), e la pendenza (tan dell'elevazione)
uniform vec2 uCodifica;       // scala e offset: r = (quota - offset) / scala
out vec4 colore;
void main() {
  // la colonna di questo texel, al centro
  vec2 p = gl_FragCoord.xy;
  vec2 dir = uSole.xy; float tg = uSole.z;
  // la propria cima, un quarto di passo avanti: le pareti di schiena sono in ombra, le cime no
  float hs = texture(uAltezze, p * uAltRett.zw).r * 255.0 - 0.25 * tg;
  // \u26A0 PASSO FISSO DI MEZZO BLOCCO PER 24 BLOCCHI: nessuna colonna saltata, che era la causa dei puntini
  for (int i = 1; i <= 48; i++) {
    float t = float(i) * 0.5;
    float h = texture(uAltezze, (p + dir * t) * uAltRett.zw).r * 255.0;
    hs = max(hs, h - t * tg);
  }
  colore = vec4((hs - uCodifica.y) / uCodifica.x, 0.0, 0.0, 1.0);
}`),this.uOmbre={};for(let r of["uAltezze","uAltRett","uSole","uCodifica"])this.uOmbre[r]=o.getUniformLocation(this.programmaOmbre,r);this.vaoOmbre=o.createVertexArray()}}_calcolaOmbre(){let e=this.gl,a=this.ombre,o=this.sole;if(!this.altezze||!a.tex||(o.verso[0]*a.sole[0]+o.verso[1]*a.sole[1]+o.verso[2]*a.sole[2]<.99996&&(a.sole=o.verso.slice(),a.sporco=[0,0,a.w,a.h]),!a.sporco))return;let[r,n,s,f]=a.sporco;if(a.sporco=null,s<=r||f<=n)return;let l=Math.hypot(o.verso[0],o.verso[2])||1e-4,u=[-o.verso[0]/l,-o.verso[2]/l],m=Math.max(.05,-o.verso[1]/l);e.bindFramebuffer(e.FRAMEBUFFER,a.fbo),e.viewport(0,0,a.w,a.h),e.enable(e.SCISSOR_TEST),e.scissor(r,n,s-r,f-n),e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE),e.useProgram(this.programmaOmbre),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(this.uOmbre.uAltezze,0),e.uniform4f(this.uOmbre.uAltRett,0,0,1/a.w,1/a.h),e.uniform3f(this.uOmbre.uSole,u[0],u[1],m),e.uniform2f(this.uOmbre.uCodifica,a.scala,a.offset),e.bindVertexArray(this.vaoOmbre),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.disable(e.SCISSOR_TEST),e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),a.calcoli++,this.statistiche.calcoliOmbre=a.calcoli}_disegnaCielo(e,a){let o=this.gl,t=this.uc,r=this.sole;if(this.cieloNero||!Ce(e,this._invVP))return;o.useProgram(this.programmaCielo),o.uniformMatrix4fv(t.uInvVP,!1,this._invVP),o.uniform3f(t.uOcchio,a[0],a[1],a[2]),o.uniform3f(t.uSoleVerso,r.verso[0],r.verso[1],r.verso[2]),o.uniform1f(t.uSoleForza,r.forza),o.uniform3f(t.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let n=r.forza;o.uniform3f(t.uZenit,.04+.32*n,.06+.56*n,.14+.82*n),o.disable(o.DEPTH_TEST),o.depthMask(!1),o.disable(o.CULL_FACE),o.bindVertexArray(this.vaoVuoto),o.drawArrays(o.TRIANGLES,0,3),o.bindVertexArray(null),o.enable(o.CULL_FACE),o.depthMask(!0),o.enable(o.DEPTH_TEST)}_preparaMappa(){let e=this.gl,a=this.mappa,o=t=>{let r=e.createTexture();e.bindTexture(e.TEXTURE_2D,r),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,t,t,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_FUNC,e.LEQUAL);let n=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,n),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,r,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);let s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:r,fbo:n,lato:t,ok:s}};a.stat=o(a.lato),a.din=o(a.latoDin),(!a.stat.ok||!a.din.ok)&&(a.attiva=!1)}legaMappa(e){let a=this.gl,o=this.mappa;a.activeTexture(a.TEXTURE1),a.bindTexture(a.TEXTURE_2D,o.stat.tex),a.uniform1i(e.uMappaStat,1),a.activeTexture(a.TEXTURE2),a.bindTexture(a.TEXTURE_2D,o.din.tex),a.uniform1i(e.uMappaDin,2),a.activeTexture(a.TEXTURE0),a.uniform1f(e.uMappaOn,o.on?1:0),a.uniformMatrix4fv(e.uLuceVP,!1,o.vp),a.uniformMatrix4fv(e.uLuceVPDin,!1,o.vpDin),a.uniform2f(e.uMappaTexel,.5/o.lato,.5/o.latoDin),a.uniform2f(e.uMappaSbieco,1.5*(2*o.raggio/o.lato),.1/220),a.uniform4fv(e.uLampade,this.lampade),a.uniform1i(e.uNLampade,this.nLampade),a.uniform3f(e.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore)}_aggiornaMappa(e,a){let o=this.gl,t=this.mappa,r=this.sole,n=this.statistiche;if(t.on=!1,!t.attiva||!this.ombra)return;let s=typeof performance<"u"?performance.now():0,f=e.centro[0],l=e.centro[2],u=!1;Math.hypot(f-t.centro[0],l-t.centro[2])>6&&(t.centro=[Math.round(f/2)*2,Math.round(e.centro[1]),Math.round(l/2)*2],u=!0);{let p=r.verso,g=e.centro,E=[g[0]-p[0]*120,g[1]-p[1]*120,g[2]-p[2]*120],v=Math.abs(p[1])>.95?[0,0,1]:[0,1,0];Po(re(t.raggioDin,10,230),qo(E,g,v),t.vpDin)}r.verso[0]*t.sole[0]+r.verso[1]*t.sole[1]+r.verso[2]*t.sole[2]<.99999&&(t.soleMosso=!0);let h=t.sporca||t.soleMosso||a&&a.mappaSporca,c=u||h&&s-(t.ultimo||0)>=120;if(c){t.sole=r.verso.slice(),t.soleMosso=!1,t.ultimo=s;let p=r.verso,g=t.centro,E=[g[0]-p[0]*120,g[1]-p[1]*120,g[2]-p[2]*120],v=Math.abs(p[1])>.95?[0,0,1]:[0,1,0];Po(re(t.raggio,10,230),qo(E,g,v),t.vp)}if(o.enable(o.POLYGON_OFFSET_FILL),o.polygonOffset(1.5,4),c){o.bindFramebuffer(o.FRAMEBUFFER,t.stat.fbo),o.viewport(0,0,t.stat.lato,t.stat.lato),o.clear(o.DEPTH_BUFFER_BIT),o.useProgram(this.programmaOmbra),o.uniformMatrix4fv(this.uo.uVP,!1,t.vp);let p=0,g=0,E=t.raggio+12;for(let v of this.chunks.values())v.quad!==0&&(Math.hypot(v.x0+8-t.centro[0],v.z0+8-t.centro[2])>E||(o.uniform3f(this.uo.uChunk,v.chunk[0],v.chunk[1],v.chunk[2]),o.bindVertexArray(v.vao),o.drawElements(o.TRIANGLES,v.quad*6,o.UNSIGNED_SHORT,0),p++,g+=v.quad*2));if(o.bindVertexArray(null),a){let[v,_]=a.disegnaOmbra(t.vp,!1);p+=v,g+=_,a.mappaSporca=!1}t.sporca=!1,t.calcoli++,t.disegni=p,t.triangoli=g}o.bindFramebuffer(o.FRAMEBUFFER,t.din.fbo),o.viewport(0,0,t.din.lato,t.din.lato),o.clear(o.DEPTH_BUFFER_BIT);let d=0,b=0;a&&([d,b]=a.disegnaOmbra(t.vpDin,!0)),o.disable(o.POLYGON_OFFSET_FILL),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),t.on=!0,n.calcoliMappa=t.calcoli,n.disegniOmbra=d+(c?t.disegni:0),n.triangoliOmbra=b+(c?t.triangoli:0)}impostaAltezze(e,a,o,t,r){let n=this.gl;this.altezze||(this.altezze=n.createTexture()),n.bindTexture(n.TEXTURE_2D,this.altezze),n.pixelStorei(n.UNPACK_ALIGNMENT,1),n.texImage2D(n.TEXTURE_2D,0,n.R8,t,r,0,n.RED,n.UNSIGNED_BYTE,e),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_MAG_FILTER,n.NEAREST),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_S,n.CLAMP_TO_EDGE),n.texParameteri(n.TEXTURE_2D,n.TEXTURE_WRAP_T,n.CLAMP_TO_EDGE),this.altRett=[a,o,1/t,1/r],this._preparaOmbre(t,r)}impostaMaterie(e){let a=new Float32Array(64);for(let o=0;o<16&&o<e.length;o++)for(let t=0;t<4;t++)a[o*4+t]=e[o][t]||0;this.materie=a}disegna(e,a,o=null){let t=this.gl,r=this.statistiche;this.tempo+=a;let n=Re(e.fov,e.rapporto,.3,400),s=qo(e.occhio,e.centro);Po(n,s,this.vp),ne(this.vp,this.piani),this._camera=e,this._visibili.length=0,this._visibiliErba.length=0;let f=0;for(let c of this.chunks.values())c.quad===0&&c.quadAcqua===0||(c.visto=this.tutto||se(this.piani,c.x0,c.y0+c.minY,c.z0,c.x0+16,c.y0+c.maxY+1,c.z0+16),c.visto&&(f++,c.quadAcqua>0&&this._visibili.push(c),c.verticiErba>0&&Math.hypot(c.x0+8-e.occhio[0],c.z0+8-e.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(c)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(e,o),r.disegniSpecchio=0,r.triangoliSpecchio=0,r.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(e,o),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,e.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[l,u]=this._solidi(this.vp,this.piani,e.occhio,!1),m=0,h=0;if(this._visibiliErba.length){let c=this.ue,d=this.sole;t.useProgram(this.programmaErba),t.uniformMatrix4fv(c.uVP,!1,this.vp),t.uniform1f(c.uTempo,this.tempo),t.uniform3f(c.uSoleVerso,d.verso[0],d.verso[1],d.verso[2]),t.uniform3f(c.uSoleCol,d.colore[0],d.colore[1],d.colore[2]),t.uniform1f(c.uSoleForza,d.forza),t.uniform3f(c.uCieloCol,d.cielo[0],d.cielo[1],d.cielo[2]),t.uniform2f(c.uNebbia,this.nebbia.da,this.nebbia.a),t.uniform3f(c.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),t.uniform3f(c.uCam,e.occhio[0],e.occhio[1],e.occhio[2]),t.uniform2f(c.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),t.uniform1f(c.uOmbra,this.ombra&&this.altezze?1:0),t.uniform1f(c.uTaglio,-1e9),t.uniform1f(c.uErbaFinoA,this.erbaFinoA),t.uniform4f(c.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),t.uniform3f(c.uOcchio,e.occhio[0],e.occhio[1],e.occhio[2]),this.altezze&&(t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.ombre.tex),t.uniform1i(c.uOmbre,0),t.uniform2f(c.uOmbreScala,this.ombre.scala,this.ombre.offset),t.uniform4f(c.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(c),t.disable(t.CULL_FACE);for(let b of this._visibiliErba)t.uniform3f(c.uChunk,b.chunk[0],b.yBaseErba,b.chunk[2]),t.bindVertexArray(b.vaoErba),t.drawArraysInstanced(t.TRIANGLES,0,6,b.lamelle),m++,h+=b.lamelle*2;t.enable(t.CULL_FACE),t.bindVertexArray(null)}r.disegni=l,r.triangoli=u,r.chunkVisti=f,r.chunkTotali=this.chunks.size,r.disegniErba=m,r.triangoliErba=h}_solidi(e,a,o,t){let r=this.gl,n=this.u,s=this.sole;r.useProgram(this.programma),r.uniformMatrix4fv(n.uVP,!1,e),r.uniform1f(n.uTempo,this.tempo),r.uniform3f(n.uSoleVerso,s.verso[0],s.verso[1],s.verso[2]),r.uniform3f(n.uSoleCol,s.colore[0],s.colore[1],s.colore[2]),r.uniform1f(n.uSoleForza,s.forza),r.uniform3f(n.uCieloCol,s.cielo[0],s.cielo[1],s.cielo[2]),r.uniform4fv(n.uMaterie,this.materie),r.uniform2f(n.uNebbia,this.nebbia.da,this.nebbia.a),r.uniform3f(n.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),r.uniform3f(n.uCam,o[0],o[1],o[2]),r.uniform1f(n.uOmbra,this.ombra&&this.altezze?1:0),r.uniform1f(n.uTaglio,this.taglio);let f=t?[0,0,0,0]:this.buco;r.uniform4f(n.uBuco,f[0],f[1],f[2],f[3]),r.uniform3f(n.uOcchio,o[0],o[1],o[2]),this.altezze&&(r.activeTexture(r.TEXTURE0),r.bindTexture(r.TEXTURE_2D,this.ombre.tex),r.uniform1i(n.uOmbre,0),r.uniform2f(n.uOmbreScala,this.ombre.scala,this.ombre.offset),r.uniform4f(n.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(n);let l=0,u=0;for(let m of this.chunks.values())if(m.quad!==0){if(t){if(!this.tutto&&!se(a,m.x0,m.y0+m.minY,m.z0,m.x0+16,m.y0+m.maxY+1,m.z0+16))continue}else if(!m.visto)continue;r.uniform3f(n.uChunk,m.chunk[0],m.chunk[1],m.chunk[2]),r.bindVertexArray(m.vao),r.drawElements(r.TRIANGLES,m.quad*6,r.UNSIGNED_SHORT,0),l++,u+=m.quad*2}return r.bindVertexArray(null),[l,u]}_peloVicino(e){let a=this._voti;a.clear();for(let r of this._visibili){if(r.peloAcqua==null)continue;let n=Math.hypot(r.x0+8-e[0],r.z0+8-e[2])+2.2*Math.abs(r.peloAcqua-e[1]);a.set(r.peloAcqua,(a.get(r.peloAcqua)||0)+r.quadAcqua/(1+n))}let o=null,t=0;for(let[r,n]of a)n>t&&(t=n,o=r);return o}_specchia(e,a){let o=this.gl,t=this.specchio,r=this.statistiche,n=this._peloVicino(e.occhio);if(n==null||e.occhio[1]<=n+.2)return;let s=Math.max(1,Math.round(o.drawingBufferWidth*t.scala)),f=Math.max(1,Math.round(o.drawingBufferHeight*t.scala));(!t.fbo||t.w!==s||t.h!==f)&&this._preparaSpecchio(s,f);let l=this._riflessione;l.fill(0),l[0]=1,l[5]=-1,l[10]=1,l[13]=2*n,l[15]=1,Po(this.vp,l,this.vpSpecchio),ne(this.vpSpecchio,this.pianiSpecchio);let u=[e.occhio[0],2*n-e.occhio[1],e.occhio[2]];o.bindFramebuffer(o.FRAMEBUFFER,t.fbo),o.viewport(0,0,s,f),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),o.cullFace(o.FRONT),this.taglio=n-.05,this.vpCorrente=this.vpSpecchio;let[m,h]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);r.disegniSpecchio=m,r.triangoliSpecchio=h,a&&(a.disegna(this,{occhio:u,centro:e.centro,fov:e.fov,rapporto:e.rapporto}),r.disegniSpecchio+=a.statistiche.disegni,r.triangoliSpecchio+=a.statistiche.triangoli),o.cullFace(o.BACK),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),this.taglio=-1e9,t.pelo=n,r.pelo=n}_mostraSpecchio(){let e=this.gl,a=this.specchio;this.programmaQuad||(this.programmaQuad=W(e,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=e.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=e.createVertexArray()),e.useProgram(this.programmaQuad),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,a.tex),e.uniform1i(this.uQuad,0),e.bindVertexArray(this.vaoQuad),e.disable(e.DEPTH_TEST),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.enable(e.DEPTH_TEST),e.bindVertexArray(null)}_preparaSpecchio(e,a){let o=this.gl,t=this.specchio;t.fbo||(t.fbo=o.createFramebuffer(),t.tex=o.createTexture(),t.rbo=o.createRenderbuffer()),o.bindTexture(o.TEXTURE_2D,t.tex),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,e,a,0,o.RGBA,o.UNSIGNED_BYTE,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindRenderbuffer(o.RENDERBUFFER,t.rbo),o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_COMPONENT16,e,a),o.bindFramebuffer(o.FRAMEBUFFER,t.fbo),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,t.tex,0),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,t.rbo),o.checkFramebufferStatus(o.FRAMEBUFFER)!==o.FRAMEBUFFER_COMPLETE&&(t.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindTexture(o.TEXTURE_2D,null),t.w=e,t.h=a}disegnaAcqua(){let e=this.gl,a=this.ua,o=this.sole,t=this._camera,r=this.specchio;if(!t||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}e.useProgram(this.programmaAcqua),e.uniformMatrix4fv(a.uVP,!1,this.vp),e.uniform1f(a.uTempo,this.tempo),e.uniform3f(a.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),e.uniform2f(a.uNebbia,this.nebbia.da,this.nebbia.a),e.uniform3f(a.uSoleVerso,o.verso[0],o.verso[1],o.verso[2]),e.uniform3f(a.uSoleCol,o.colore[0],o.colore[1],o.colore[2]),e.uniform1f(a.uSoleForza,o.forza),e.uniform3f(a.uCieloCol,o.cielo[0],o.cielo[1],o.cielo[2]),e.uniform3f(a.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let n=r.pelo!=null&&r.tex;e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,n?r.tex:null),e.uniform1i(a.uSpecchio,1),e.uniform3f(a.uSchermo,1/e.drawingBufferWidth,1/e.drawingBufferHeight,n?1:0),e.uniform1f(a.uMare,this.mare),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.depthMask(!1),e.disable(e.CULL_FACE);let s=0,f=0;for(let l of this._visibili)e.uniform3f(a.uChunk,l.chunk[0],l.chunk[1],l.chunk[2]),e.bindVertexArray(l.vaoAcqua),e.drawElements(e.TRIANGLES,l.quadAcqua*6,e.UNSIGNED_SHORT,0),s++,f+=l.quadAcqua*2;e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),e.activeTexture(e.TEXTURE0),this.statistiche.disegniAcqua=s,this.statistiche.triangoliAcqua=f,r.mostra&&n&&this._mostraSpecchio()}};var ue=class extends Mo{vertice(e,a,o,t,r,n,s,f=0,l=0){super.vertice(e,a,o,_e[t],r,n,s,f,l)}},oo={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},Go=[0,6072381,8739896,14403468,9211013,5086771,6043679,2714414,16767347],Dt=1;function ce(i,e){let a=o=>Math.max(0,Math.min(255,Math.round(o*e)));return a(i>>16&255)<<16|a(i>>8&255)<<8|a(i&255)}function ro(i,e,a){let o=i*374761393+e*668265263+a*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function le(i,e,a,o){let t=i/a,r=e/a,n=Math.floor(t),s=Math.floor(r),f=t-n,l=r-s,u=f*f*(3-2*f),m=l*l*(3-2*l),h=ro(n,s,o),c=ro(n+1,s,o),d=ro(n,s+1,o),b=ro(n+1,s+1,o);return h+(c-h)*u+(d+(b-d)*u-(h+(c-h)*u))*m}function zo(i,e,a=7){let o=le(i,e,48,a)*14+le(i,e,17,a+1)*5+le(i,e,6,a+2)*1.5;return 8+Math.floor(o)}function ye(i){return i<11?oo.sabbia:i>24?oo.roccia:oo.erba}function Oe(i,e,a=7){let o=[];for(let t=0;t<2;t++){if(ro(i*3+t,e*5-t,a+9)<.35)continue;let n=i*16+Math.floor(ro(i,e,a+11+t)*15)+.5,s=e*16+Math.floor(ro(e,i,a+13+t)*15)+.5,f=zo(Math.floor(n),Math.floor(s),a);ye(f)===oo.erba&&o.push({x:n,y:f+3,z:s})}return o}function Fe(i,e,a,o){let t=0;for(let r of o){let s=15-Math.sqrt((i-r.x)**2+(e-r.y)**2+(a-r.z)**2);s>t&&(t=s)}return Math.max(0,Math.min(15,Math.round(t)))}function Le(i,e,{seme:a=7,erba:o=2,raggioLampade:t=2}={}){let r=new ue(1600),n=i*16,s=e*16,f=255,l=0,u=[];for(let h=-t;h<=t;h++)for(let c=-t;c<=t;c++)u.push(...Oe(i+h,e+c,a));for(let h=0;h<16;h++)for(let c=0;c<16;c++){let d=n+h,b=s+c,p=zo(d,b,a);p<f&&(f=p),p+1>l&&(l=p+1);let g=ye(p),E=.94+.12*ro(d,b,a+3),v=Fe(d+.5,p+1,b+.5,u),_=ce(Go[g],E);r.quadDa([h,p+1,c,2,15,v,_],[h,p+1,c+1,2,15,v,_],[h+1,p+1,c+1,2,15,v,_],[h+1,p+1,c,2,15,v,_]);let R=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[S,z,x]of R){let A=zo(d+S,b+z,a);for(let T=A+1;T<=p;T++){let C=Math.max(6,15-(p-T)*2),N=T===p&&g===oo.erba?oo.erba:p>24?oo.roccia:oo.terra,I=Fe(d+.5+S*.5,T+.5,b+.5+z*.5,u),O=T,Z=T+1,L=ce(Go[N],E);S===1?r.quadDa([h+1,O,c,x,C,I,L],[h+1,Z,c,x,C,I,L],[h+1,Z,c+1,x,C,I,L],[h+1,O,c+1,x,C,I,L]):S===-1?r.quadDa([h,O,c+1,x,C,I,L],[h,Z,c+1,x,C,I,L],[h,Z,c,x,C,I,L],[h,O,c,x,C,I,L]):z===1?r.quadDa([h+1,O,c+1,x,C,I,L],[h+1,Z,c+1,x,C,I,L],[h,Z,c+1,x,C,I,L],[h,O,c+1,x,C,I,L]):r.quadDa([h,O,c,x,C,I,L],[h,Z,c,x,C,I,L],[h+1,Z,c,x,C,I,L],[h+1,O,c,x,C,I,L]),T<f&&(f=T)}}if(g===oo.erba)for(let S=0;S<o;S++){if(ro(d,b,a+20+S)<.25)continue;let x=1,A=h,T=c,C=ce(Go[oo.filo],.94+.12*ro(d,b,a+30+S));r.quadDa([A,p+1,T,2,15,v,C],[A,p+1+x,T,2,15,v,C,1],[A+1,p+1+x,T+1,2,15,v,C,1],[A+1,p+1,T+1,2,15,v,C]),r.quadDa([A+1,p+1,T,2,15,v,C],[A+1,p+1+x,T,2,15,v,C,1],[A,p+1+x,T+1,2,15,v,C,1],[A,p+1,T+1,2,15,v,C]),p+2>l&&(l=p+2)}}for(let h of Oe(i,e,a)){let c=Math.floor(h.x)-n,d=Math.floor(h.z)-s,b=h.y-3;for(let p=b+1;p<=h.y;p++){let g=p===h.y?oo.lampada:oo.tronco,E=p===h.y?15:12,v=Go[g],_=p===h.y?Dt:0,R=c+.5-.15,S=c+.5+.15,z=Math.floor(R),x=Math.min(16,Math.floor(R)+1),A=d,T=d+1;r.quadDa([x,p,A,0,12,E,v,0,_],[x,p+1,A,0,12,E,v,0,_],[x,p+1,T,0,12,E,v,0,_],[x,p,T,0,12,E,v,0,_]),r.quadDa([z,p,T,1,12,E,v,0,_],[z,p+1,T,1,12,E,v,0,_],[z,p+1,A,1,12,E,v,0,_],[z,p,A,1,12,E,v,0,_]),r.quadDa([x,p,T,4,12,E,v,0,_],[x,p+1,T,4,12,E,v,0,_],[z,p+1,T,4,12,E,v,0,_],[z,p,T,4,12,E,v,0,_]),r.quadDa([z,p,A,5,12,E,v,0,_],[z,p+1,A,5,12,E,v,0,_],[x,p+1,A,5,12,E,v,0,_],[x,p,A,5,12,E,v,0,_]),p===h.y&&r.quadDa([z,p+1,A,2,15,E,v,0,_],[z,p+1,T,2,15,E,v,0,_],[x,p+1,T,2,15,E,v,0,_],[x,p+1,A,2,15,E,v,0,_]),p+1>l&&(l=p+1)}}return{...r.dati(),minY:f,maxY:l,cx:i,cz:e}}var Ie={erba:{nome:"Erba",cima:5949008,lato:15113319,fondo:13208416,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:15113319,lato:15113319,fondo:13208416,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},Ne=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],Xo={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};Ne.push(Xo);var Bt={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};Ne.push(Bt);function Pe(i,e,a=Xo){Ie[i]=e,a.blocchi.includes(i)||a.blocchi.push(i)}var qt={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"};function $(i){return Ie[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||qt}function we(i){let e=i.indexOf("~");return e<0?i:i.slice(0,e)}function Ue(i){if(!i||!i.startsWith("acqua"))return null;let e=i.indexOf("~");return e<0?0:Number(i.slice(e+1))}var F=16,Vt=256,Yo=2048,De=64,eo=(i,e,a)=>((i+Yo)*4096+(a+Yo))*256+(e+De),Oo=i=>Math.floor(i/(256*4096))-Yo,Fo=i=>Math.floor(i/256)%4096-Yo,yo=i=>i%256-De;var vo=(i,e)=>Math.floor(i/F)+","+Math.floor(e/F),$o=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(e){this.generati.add(e)}_annotaModifica(e,a,o,t){if(!this.frontiera)return;let r=vo(e,o),n=this.modifiche.get(r);n||(n=new Map,this.modifiche.set(r,n)),n.set(eo(e,a,o),t)}applicaModifiche(e){let a=this.modifiche.get(e);if(!a)return 0;for(let[o,t]of a){let r=Oo(o),n=yo(o),s=Fo(o);t===null?this.togli(r,n,s,!0):this.metti(r,n,s,t,!0)}return a.size}scaricaChunk(e){let a=this.chunks.get(e);if(!a)return this.generati.delete(e),[];let o=[];for(let[t,r]of a){let n=$(r);n&&n.forma==="modello"&&o.push([Oo(t),yo(t),Fo(t),r])}return this.contaBlocchi-=a.size,this.chunks.delete(e),this._scordaMemo(),this.generati.delete(e),this._tocca(e,this.sporchi),o}_cambiata(e,a,o){if(this.cambiate.length>=3*Vt){this.troppiCambi=!0;return}this.cambiate.push(e,a,o)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(e,a){let o=Math.floor(e/F),t=Math.floor(a/F);if(this._memoChunk!==null&&this._memoCx===o&&this._memoCz===t)return this._memoChunk;let r=this.chunks.get(o+","+t)||null;return this._memoCx=o,this._memoCz=t,this._memoChunk=r,r}tipo(e,a,o){let t=this._chunkDi(e,o);return t&&t.get(eo(e,a,o))||null}pieno(e,a,o){return this.tipo(e,a,o)!==null}solido(e,a,o){let t=this.tipo(e,a,o);if(t&&$(t).solido)return!0;let r=this.furni.get(eo(e,a,o));return!!r&&!(r.def&&r.def.calpestabile)}calpestabile(e,a,o){if(!this.solido(e,a-1,o)||this.solido(e,a,o)||this.solido(e,a+1,o))return!1;let t=this.tipo(e,a,o);return!(t&&$(t).acqua)}_sporca(e,a,o=this.sporchi){let t=(e%F+F)%F,r=(a%F+F)%F;this._tocca(vo(e,a),o),t===0&&this._tocca(vo(e-1,a),o),t===F-1&&this._tocca(vo(e+1,a),o),r===0&&this._tocca(vo(e,a-1),o),r===F-1&&this._tocca(vo(e,a+1),o)}_tocca(e,a){a.add(e),this._rev.set(e,(this._rev.get(e)||0)+1)}revisione(e){return this._rev.get(e)||0}metti(e,a,o,t,r=!1){let n=vo(e,o),s=this.chunks.get(n);s||(s=new Map,this.chunks.set(n,s),this._scordaMemo());let f=eo(e,a,o),l=s.get(f);l===void 0&&this.contaBlocchi++,s.set(f,t);let u=t.charCodeAt(0)===97&&t.startsWith("acqua")&&(l===void 0||l.startsWith("acqua"));this._sporca(e,o,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(e,a,o),r||(this._annotaModifica(e,a,o,t),this.onEvento&&this.onEvento({tipo:"metti",cella:[e,a,o],blocco:t}))}togli(e,a,o,t=!1){let r=vo(e,o),n=this.chunks.get(r);if(!n)return!1;let s=eo(e,a,o),f=n.get(s);if(!n.delete(s))return!1;this.contaBlocchi--,n.size===0&&(this.chunks.delete(r),this._scordaMemo());let l=!!(f&&f.startsWith("acqua"));return this._sporca(e,o,l?this.sporchiAcqua:this.sporchi),l||this._cambiata(e,a,o),t||(this._annotaModifica(e,a,o,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[e,a,o]})),!0}occupaFurni(e,a){for(let[o,t,r]of e)this.furni.set(eo(o,t,r),a)}liberaFurni(e){for(let[a,o,t]of e)this.furni.delete(eo(a,o,t))}furniIn(e,a,o){return this.furni.get(eo(e,a,o))||null}occupaOmbra(e,a=!1){for(let[o,t,r]of e){let n=eo(o,t,r),s=this.ombreFurni.get(n);if(s){s.n++,a&&s.op++===0&&this._cambiata(o,t,r);continue}this.ombreFurni.set(n,{x:o,y:t,z:r,n:1,op:a?1:0}),this._cambiata(o,t,r)}}liberaOmbra(e,a=!1){for(let[o,t,r]of e){let n=eo(o,t,r),s=this.ombreFurni.get(n);s&&(a&&s.op>0&&--s.op===0&&s.n>1&&this._cambiata(o,t,r),!(--s.n>0)&&(this.ombreFurni.delete(n),this._cambiata(o,t,r)))}}ombraFurniIn(e,a,o){let t=this.ombreFurni.get(eo(e,a,o));return t?t.op>0?2:1:0}appoggioInColonna(e,a,o,t=8){for(let r=o;r>o-t;r--)if(this.calpestabile(e,r,a))return r;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let e of this._rev.keys())this._rev.set(e,this._rev.get(e)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let e of this.chunks.values())for(let[a,o]of e)yield{x:Oo(a),y:yo(a),z:Fo(a),tipo:o}}perOgni(e){for(let a of this.chunks.values())for(let[o,t]of a)e(Oo(o),yo(o),Fo(o),t)}*blocchiDelChunk(e){let a=this.chunks.get(e);if(a)for(let[o,t]of a)yield{x:Oo(o),y:yo(o),z:Fo(o),tipo:t}}perOgniDelChunk(e,a){let o=this.chunks.get(e);if(o)for(let[t,r]of o)a(Oo(t),yo(t),Fo(t),r)}};var kt={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},wo="primavera";var Ho=null;function Ko(i,e,a){let o=i>>16&255,t=i>>8&255,r=i&255,n=e>>16&255,s=e>>8&255,f=e&255,l=(u,m)=>Math.round(u+(m-u)*a);return l(o,n)<<16|l(t,s)<<8|l(r,f)}function Be(i,e){if(Ho){let a=wo;wo=Ho.da;let o=fe(i,e);wo=Ho.a;let t=fe(i,e);wo=a;let r=Ho.mix;return{cima:Zo(o.cima,t.cima,r),lato:Zo(o.lato,t.lato,r),fondo:Zo(o.fondo,t.fondo,r),facce:o.facce,orlo:o.orlo!=null&&t.orlo!=null?Zo(o.orlo,t.orlo,r):o.orlo}}return fe(i,e)}function Zo(i,e,a){let o=Math.round((i>>16&255)+((e>>16&255)-(i>>16&255))*a),t=Math.round((i>>8&255)+((e>>8&255)-(i>>8&255))*a),r=Math.round((i&255)+((e&255)-(i&255))*a);return o<<16|t<<8|r}function fe(i,e){let a=$(i),o=kt[wo],{cima:t,lato:r,fondo:n}=a;if(a.cappello&&o.erba&&!a.override&&(t=o.erba[he(e,o.erba.length)]),a.reagisce==="stagione"&&o.erba){let s=o.erba[he(e,o.erba.length)],f=a.reagisceForza??1;t=Ko(t,s,f),r=Ko(r,s,f*.45),n=Ko(n,s,f*.3)}else if(a.reagisce==="quota"){let s=he(e,8)/7,f=(a.reagisceForza??1)*.5,l=u=>Ko(u,16777215,s*f);t=l(t),r=l(r),n=l(n)}return i==="sabbia"&&o.sabbia&&({cima:t,lato:r,fondo:n}=o.sabbia),{cima:t,lato:r,fondo:n,facce:a.facce||null,orlo:a.orlo!=null?a.orlo:void 0}}function co(i,e,a){if(i.facce){let o=e*2+(a>0?0:1),t=i.facce[o];if(t!=null)return t}return e===1?a>0?i.cima:i.fondo:i.lato}function he(i,e=8){let a=(e-1)*2,o=(Math.round(i)%a+a)%a;return o>=e&&(o=a-o),o}function me(i,e,a){let o=(i|0)*374761393+(e|0)*668265263+(a|0)*2147483647;return o=(o^o>>>13)*1274126177,o=o^o>>>16,(o>>>0)%1e3/1e3}function Gt(i,e){let a=i>>16&255,o=i>>8&255,t=i&255,r=n=>Math.max(0,Math.min(255,Math.round(n*(1+e))));return r(a)<<16|r(o)<<8|r(t)}function Xt(i,e,a,o,t,r){if(!e||e==="liscio"||!a)return i;let n=0;return e==="chiazze"?n=(me(o,t,r)-.5)*2:e==="venature"?n=(me(0,t,0)-.5)*2*.7+(me(o,t,r)-.5)*.3:e==="sfumato"&&(n=(t%16+16)%16/16-.5),Gt(i,n*a*.34)}function qe(i,e,a,o,t,r){if(!e||e==="liscio"||!a)return i;let n=s=>Xt(s,e,a,o,t,r);return{cima:n(i.cima),lato:n(i.lato),fondo:n(i.fondo),facce:i.facce?i.facce.map(n):null}}var Ve={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},Yt=Object.keys(Ve);function ke(i){return!i||!i.materia?null:Ve[i.materia]||null}function go(i,e,a=0){if(!e)return i;let o=(i>>16&255)/255,t=(i>>8&255)/255,r=(i&255)/255,n=.2126*o+.7152*t+.0722*r,s=e.satura;o=n+(o-n)*s,t=n+(t-n)*s,r=n+(r-n)*s;let f=e.tinta*(1+a),l=u=>Math.max(0,Math.min(255,Math.round(u*f*255)));return l(o)<<16|l(t)<<8|l(r)}var $t=16;function Ge(i){let e=Yt.indexOf(i);return e<0||e+1>=$t?0:e+1}var pe=1/16,Xe=8*pe,to=9*pe;function Ye(i,e,a,o,t,r,n,s){let f=(u,m,h)=>[e+u,a+m,o+h];i.quad(f(-s,n,-s),f(s,n,-s),f(s,n,s),f(-s,n,s),co(t,1,1),[0,1,0]),i.quad(f(-s,r,-s),f(s,r,-s),f(s,r,s),f(-s,r,s),co(t,1,-1),[0,-1,0]);let l=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of l){let[m,,h]=u.d,c=-h,d=m,b=(p,g)=>f(m*s+c*g,p,h*s+d*g);i.quad(b(r,-s),b(n,-s),b(n,s),b(r,s),co(t,u.asse,u.segno),u.d)}}function Ht(i,e,a,o,t){Ye(i,e,a,o,t,-to,0,Xe)}function Kt(i,e,a,o,t){Ye(i,e,a,o,t,-to,to,5*pe)}function Zt(i,e,a,o,t){let r=(l,u,m)=>[e+l,a+u,o+m],n=co(t,0,1),s=Xe,f=[[[-s,-to,-s],[s,-to,s],[s,to,s],[-s,to,-s],[1,0,-1]],[[-s,-to,s],[s,-to,-s],[s,to,-s],[-s,to,s],[1,0,1]]];for(let[l,u,m,h,c]of f)i.quad(r(...l),r(...u),r(...m),r(...h),n,c),i.quad(r(...l),r(...u),r(...m),r(...h),n,[-c[0],-c[1],-c[2]])}function jt(){}var $e={lastra:Ht,pilastro:Kt,croce:Zt,modello:jt},Uo=new Set(["lastra","pilastro","croce","modello"]);var Do=1/16,Wt=[[0,1],[0,2],[1,2]],Qt=[[1,0],[-1,0],[0,1],[0,-1]];function xo(i,e,a,o,t,r,n,s,f){let l=[i,e,a];return l[o]+=t,l[r]+=n,l[s]+=f,l}var He={tinta:1,satura:1};function Ke(i,e,a,o,t,r,n=0){let s=8*Do,f=9*Do,l=(u,m)=>r(u===0?m:0,u===1?m:0,u===2?m:0);for(let u=0;u<3;u++)for(let m of[-1,1]){if(l(u,m))continue;let h=(u+1)%3,c=(u+2)%3,d=co(t,u,m),b=[0,0,0];b[u]=m,i.quad(xo(e,a,o,u,m*f,h,-s,c,-s),xo(e,a,o,u,m*f,h,+s,c,-s),xo(e,a,o,u,m*f,h,+s,c,+s),xo(e,a,o,u,m*f,h,-s,c,+s),d,b)}for(let[u,m]of Wt){let h=3-u-m;for(let c of[-1,1])for(let d of[-1,1]){if(l(u,c)||l(m,d))continue;let b=u===1&&c>0||m===1&&d>0,p=u===1&&c<0||m===1&&d<0,g=b?t.cima:p?t.fondo:t.lato,E=n?go(g,He,n):g,v=[0,0,0];v[u]=c,v[m]=d,i.quad(xo(e,a,o,u,c*f,m,d*s,h,-s),xo(e,a,o,u,c*s,m,d*f,h,-s),xo(e,a,o,u,c*s,m,d*f,h,+s),xo(e,a,o,u,c*f,m,d*s,h,+s),E,v)}}for(let u of[-1,1])for(let m of[-1,1])for(let h of[-1,1])l(0,u)||l(1,m)||l(2,h)||i.tri([e+u*f,a+m*s,o+h*s],[e+u*s,a+m*f,o+h*s],[e+u*s,a+m*s,o+h*f],n?go(m>0?t.cima:t.fondo,He,n):m>0?t.cima:t.fondo,[u,m,h])}function Ze(i,e,a,o,t,r){let n=(c,d)=>r(c,0,d),s=r(0,-1,0),f=t.cima,l=t.lato,u=t.fondo,m=t.orlo??t.cima,h=(c,d,b)=>[e+c*Do,a+d*Do,o+b*Do];s||i.quad(h(-8,-9,-8),h(8,-9,-8),h(8,-9,8),h(-8,-9,8),u,[0,-1,0]);for(let[c,d]of Qt){if(n(c,d))continue;let b=-d,p=c,g=(v,_,R)=>h(v*c+R*b,_,v*d+R*p),E=[c,0,d];s||i.quad(g(8,-9,-8),g(9,-8,-8),g(9,-8,8),g(8,-9,8),u,[c,-1,d]),i.quad(g(9,-8,-8),g(9,2,-8),g(9,2,8),g(9,-8,8),l,E),i.quad(g(9,2,-8),g(10,3,-8),g(10,3,8),g(9,2,8),m,E),i.quad(g(10,3,-8),g(10,7,-8),g(10,7,8),g(10,3,8),m,E),i.quad(g(10,7,-8),g(9,8,-8),g(9,8,8),g(10,7,8),f,[c,1,d]),i.quad(g(8,8,-8),g(9,8,-8),g(9,8,8),g(8,8,8),f,[0,1,0])}for(let c of[-1,1])for(let d of[-1,1]){if(n(c,0)||n(0,d))continue;let b=(g,E,v)=>h(g*c,E,v*d),p=[c,0,d];s||i.tri(b(9,-8,8),b(8,-9,8),b(8,-8,9),u,[c,-1,d]),i.quad(b(9,-8,8),b(8,-8,9),b(8,2,9),b(9,2,8),l,p),i.quad(b(9,2,8),b(8,2,9),b(8,3,10),b(10,3,8),m,p),i.quad(b(10,3,8),b(8,3,10),b(8,7,10),b(10,7,8),m,p),i.quad(b(10,7,8),b(8,7,10),b(8,8,9),b(9,8,8),f,[c,1,d]),i.tri(b(8,8,8),b(9,8,8),b(8,8,9),f,[0,1,0])}i.quad(h(-8,8,-8),h(8,8,-8),h(8,8,8),h(-8,8,8),f,[0,1,0])}var de={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function je(){for(let[i,e]of Object.entries(de))Pe(i,{nome:e.nome,cima:e.cima,lato:e.lato,fondo:e.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:e.modello},Xo)}var Jt=2,be=6,oa=256;function We(i){if(!i)return!1;let e=$(i);return!e.acqua&&!e.vetro&&!Uo.has(e.forma)}function Je(i,e,a,o){let t=e.indexOf(","),r=+e.slice(0,t),n=+e.slice(t+1),s=r*F-be,f=n*F-be,l=F+2*be,u=o-a+1,m=l,h=l*u*m,c=new Uint8Array(h),d=new Uint8Array(h),b=new Uint8Array(h),p=(R,S,z)=>((R-s)*u+(S-a))*m+(z-f),g=(R,S,z)=>R>=s&&R<s+l&&S>=a&&S<=o&&z>=f&&z<f+m,E=[];for(let R=s;R<s+l;R++)for(let S=f;S<f+m;S++){let z=!1;for(let x=o;x>=a;x--){let A=i.tipo(R,x,S),T=p(R,x,S);if(We(A)){b[T]=1,z=!0;continue}if(!z&&x===o){for(let C=o+1;C<oa&&C<o+40;C++)if(We(i.tipo(R,C,S))){z=!0;break}}if(z||(c[T]=15),A){let N=$(A).forma==="modello"&&de[A];N&&N.luce&&E.push([R,x+Math.round(N.luce.quota??1),S])}}}let v=[];for(let R=0;R<h;R++)c[R]===15&&v.push(R);Qe(v,c,b,l,u,m,1);let _=[];for(let[R,S,z]of E){if(!g(R,S,z))continue;let x=p(R,S,z);d[x]=15,_.push(x)}return Qe(_,d,b,l,u,m,Jt),{x0:s,z0:f,yMin:a,yMax:o,W:l,H:u,D:m,cielo:c,blocco:d,leggi(R,S,z){if(!g(R,S,z))return S>o?[15,0]:[0,0];let x=p(R,S,z);return[c[x],d[x]]}}}function Qe(i,e,a,o,t,r,n){let s=[t*r,-t*r,r,-r,1,-1],f=0;for(;f<i.length;){let l=i[f++],u=e[l]-n;if(u<=0)continue;let m=Math.floor(l/(t*r)),h=Math.floor(l/r)%t,c=l%r;for(let d=0;d<6;d++){if(d===0&&m===o-1||d===1&&m===0||d===2&&h===t-1||d===3&&h===0||d===4&&c===r-1||d===5&&c===0)continue;let b=l+s[d];a[b]||e[b]>=u||(e[b]=u,i.push(b))}}}var ot=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function no(i,e,a){let o=i*374761393+e*668265263+a*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}var jo=class{constructor(e,a=512){this.yBase=e,this.byte=new Uint8Array(a*12),this.n=0}_lamella(e,a,o,t,r,n,s,f,l,u=0,m=8){if((this.n+1)*12>this.byte.length){let d=new Uint8Array(this.byte.length*2);d.set(this.byte),this.byte=d}let h=this.n*12,c=this.byte;c[h]=e,c[h+1]=a,c[h+2]=o,c[h+3]=t,c[h+4]=r>>16&255,c[h+5]=r>>8&255,c[h+6]=r&255,c[h+7]=(n&15)<<2,c[h+8]=Math.max(1,Math.min(255,s)),c[h+9]=Math.max(1,Math.min(255,f)),c[h+10]=Math.max(0,Math.min(255,l+128)),c[h+11]=u&15|(m&15)<<4,this.n++}ciuffo(e,a,o,t,r,n,s,f=1,l=0){let u=ot[Math.floor(no(e,o,3)*ot.length)],m=Math.max(1,Math.round(u.n*f*(.82+.36*no(e,o,5)))),h=a+1-this.yBase;if(h<0||h*8>247)return 0;for(let c=0;c<m;c++){let d=no(e,o,c*17+5),b=no(e,o,c*17+11),p=no(e,o,c*17+41),g=no(e,o,c*17+59),E=Math.min(.98,.66+u.apri),v=e+.5+(d-.5)*E,_=o+.5+(b-.5)*E,R=Math.min(.8,u.alto*(.62+.8*no(e,o,c*17+71))*(.5+.6*Math.pow(p,1.5))),S=u.largo*(.8+.4*g),z=(no(e,o,c*17+83)-.5)*.5,x=no(e,o,c*17+89),A=x<.15?.9+.03*x:x>.85?1.07+.03*(x-.85):.97+.06*(x-.15)/.7,T=Math.max(0,Math.min(128,Math.round((v-t)*8))),C=Math.max(0,Math.min(128,Math.round((_-r)*8))),N=Math.floor(no(e,o,c*17+97)*255);this._lamella(T,C,Math.round(h*8),N,n,s,Math.round(R*64),Math.round(S*128),Math.round(z*128),l,Math.round((A-.9)/.2*15))}return m}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var Eo=64,ea=[[1,0,0,Y(1,0,0),0,1],[-1,0,0,Y(-1,0,0),0,-1],[0,1,0,Y(0,1,0),1,1],[0,-1,0,Y(0,-1,0),1,-1],[0,0,1,Y(0,0,1),2,1],[0,0,-1,Y(0,0,-1),2,-1]],et=(i,e,a)=>((e+1)*3+(a+1))*3+(i+1),xe=class{constructor(e,a,o,t,r){this.c=e,this.ox=a,this.oz=o,this._materia=0,this.luceDi=t,this.aria=r,this._cielo=15,this._cella=null}materia(e){this._materia=e|0}cella(e,a,o){this._cella=[e,a,o]}_cieloFaccia(e){let[a,o,t]=this._cella,r=-1;for(let n=0;n<3;n++){if(!e[n])continue;let s=this.luceDi(a+(n===0?e[0]:0),o+(n===1?e[1]:0),t+(n===2?e[2]:0))[0];s>r&&(r=s)}return r<0?this.luceDi(a,o+1,t)[0]:r}_bloccoVertice(e,a){let o=Math.hypot(a[0],a[1],a[2])||1,t=e[0]+a[0]/o*.5,r=e[1]+a[1]/o*.5,n=e[2]+a[2]/o*.5,s=0,f=0;for(let l of[-.45,.45])for(let u of[-.45,.45])for(let m of[-.45,.45]){let h=Math.floor(t+l),c=Math.floor(r+u),d=Math.floor(n+m);this.aria(h,c,d)&&(s+=this.luceDi(h,c,d)[1],f++)}return f?Math.round(s/f):0}_v(e,a,o,t){return[e[0]-this.ox,e[1]+Eo,e[2]-this.oz,a,this._cielo,this._bloccoVertice(e,t),o,0,this._materia]}_giro(e,a,o,t){let r=a[0]-e[0],n=a[1]-e[1],s=a[2]-e[2],f=o[0]-e[0],l=o[1]-e[1],u=o[2]-e[2],m=n*u-s*l,h=s*f-r*u,c=r*l-n*f;return m*t[0]+h*t[1]+c*t[2]<0}tri(e,a,o,t,r){if(this._giro(e,a,o,r)){let s=a;a=o,o=s}let n=Y(r[0],r[1],r[2]);this._cielo=this._cieloFaccia(r),this.c.quadDa(this._v(e,n,t,r),this._v(a,n,t,r),this._v(o,n,t,r),this._v(o,n,t,r))}quad(e,a,o,t,r,n){let s=Y(n[0],n[1],n[2]);if(this._cielo=this._cieloFaccia(n),this._giro(e,a,o,n)){let f=a;a=t,t=f}this.c.quadDa(this._v(e,s,r,n),this._v(a,s,r,n),this._v(o,s,r,n),this._v(t,s,r,n))}};function ve(i){if(!i)return!1;let e=$(i);return!e.acqua&&!e.vetro&&!Uo.has(e.forma)}function ge(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function tt(i,e,{erba:a=2,luce:o=!0}={}){let t=e.indexOf(","),r=+e.slice(0,t),n=+e.slice(t+1),s=r*F,f=n*F,l=new Mo(1024),u=new Mo(64),m=-1/0,h=new Int16Array(F*F).fill(-1),c=255,d=0,b=1/0,p=-1/0;i.perOgniDelChunk(e,(x,A)=>{A<b&&(b=A),A>p&&(p=A)});let g=o&&b<=p?Je(i,e,b-2,p+3):null,E=new jo(Number.isFinite(b)?b:0),v=(x,A,T)=>g?g.leggi(x,A,T):[15,0],_=new xe(l,s,f,v,(x,A,T)=>!ve(i.tipo(x,A,T))),R=new Uint8Array(27),S=(x,A,T,C,N,I,O,Z)=>[x-s,A+Eo,T-f,C,I,O,N,Z?1:0,0];return i.perOgniDelChunk(e,(x,A,T,C)=>{let N=$(C);if(N.forma==="modello"&&N.modello==="albero")for(let B=-2;B<=2;B++)for(let G=-2;G<=2;G++){let io=B*B+G*G;if(io>4)continue;let J=x+B-s,fo=T+G-f;if(J<0||J>=F||fo<0||fo>=F)continue;let j=J*F+fo,V=A+(io===0?4:io<=2?3:2);V>h[j]&&(h[j]=V)}if(Uo.has(N.forma))return;let I=ge(C),O=A+Eo;if(O<0||O>254)return;let Z=(x-s)*F+(T-f);!I&&A>h[Z]&&(h[Z]=A);let L=Be(we(C),A);N.motivo&&(L=qe(L,N.motivo,N.motivoForza??1,x,A,T));let uo=ke(N);uo&&(L={...L,cima:go(L.cima,uo),lato:go(L.lato,uo),fondo:go(L.fondo,uo)},L.facce&&(L.facce=L.facce.map(B=>B==null?B:go(B,uo))));let Mt=uo?Ge(N.materia):0;if(!I){R.fill(0);for(let j=-1;j<=1;j++)for(let V=-1;V<=1;V++)for(let X=-1;X<=1;X++)X===0&&j===0&&V===0||ve(i.tipo(x+X,A+j,T+V))&&(R[et(X,j,V)]=1);let B=(j,V,X)=>R[et(j,V,X)]===1;_.materia(Mt),_.cella(x,A,T);let G=x+.5,io=A+.5,J=T+.5,fo=N.forma&&$e[N.forma];fo?fo(_,G,io,J,L,()=>!1):N.cappello&&!B(0,1,0)?Ze(_,G,io,J,L,B):Ke(_,G,io,J,L,(V,X,P)=>B(V,X,P)?X!==0?!0:!$(i.tipo(x+V,A,T+P)).cappello||B(V,1,P):!1,uo?uo.orlo:0),O-1<c&&(c=O-1),O+2>d&&(d=O+2)}let Ao=0,Co=0;if(I)for(Co=Math.max(0,Math.min(15,Ue(C)||0));Ao<15&&ge(i.tipo(x,A-1-Ao,T));)Ao++;if(I)for(let[B,G,io,J,fo,j]of ea){let V=i.tipo(x+B,A+G,T+io);if(V&&(ge(V)||ve(V)))continue;let X=co(L,fo,j),P=x,w=A,U=T,ho,mo,po,bo;if(B===1?(ho=[P+1,w,U],mo=[P+1,w+1,U],po=[P+1,w+1,U+1],bo=[P+1,w,U+1]):B===-1?(ho=[P,w,U+1],mo=[P,w+1,U+1],po=[P,w+1,U],bo=[P,w,U]):G===1?(ho=[P,w+1,U],mo=[P,w+1,U+1],po=[P+1,w+1,U+1],bo=[P+1,w+1,U]):G===-1?(ho=[P,w,U+1],mo=[P,w,U],po=[P+1,w,U],bo=[P+1,w,U+1]):io===1?(ho=[P+1,w,U+1],mo=[P+1,w+1,U+1],po=[P,w+1,U+1],bo=[P,w,U+1]):(ho=[P,w,U],mo=[P,w+1,U],po=[P+1,w+1,U],bo=[P+1,w,U]),G===1){let Me=A+(15-2*Co)/16;Me>m&&(m=Me)}u.quadDa(S(...ho,J,X,Ao,Co,ho[1]===w+1),S(...mo,J,X,Ao,Co,mo[1]===w+1),S(...po,J,X,Ao,Co,po[1]===w+1),S(...bo,J,X,Ao,Co,bo[1]===w+1)),O<c&&(c=O),O+1>d&&(d=O+1)}if(N.cappello&&a>0&&!i.tipo(x,A+1,T)){let[B,G]=v(x,A+1,T);E.ciuffo(x,A,T,s,f,L.cima,B,a/2,G),A+2+Eo>d&&(d=A+2+Eo)}}),c>d&&(c=0,d=0),{...l.dati(),minY:c,maxY:d,y0:-Eo,cx:r,cz:n,altezze:h,acqua:{...u.dati(),pelo:m===-1/0?null:m},erba:E.dati()}}function at(i,e,a,o,t){let r=(o-e+1)*F,n=(t-a+1)*F,s=new Uint8Array(r*n);for(let f of i){if(!f.altezze)continue;let l=(f.cx-e)*F,u=(f.cz-a)*F;for(let m=0;m<F;m++)for(let h=0;h<F;h++){let c=f.altezze[m*F+h];s[(u+h)*r+(l+m)]=c<0?0:Math.max(0,Math.min(255,c+1))}}return{byte:s,x0:e*F,z0:a*F,larghezza:r,profondita:n}}function _o(i,e,a){let o=i*374761393+e*668265263+a*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function it(i){return i*i*(3-2*i)}function Ee(i,e,a){let o=Math.floor(i),t=Math.floor(e),r=it(i-o),n=it(e-t),s=_o(o,t,a),f=_o(o+1,t,a),l=_o(o,t+1,a),u=_o(o+1,t+1,a);return s+(f-s)*r+(l-s)*n+(s-f-l+u)*r*n}var Lo=5;function rt(i,e=1,a=64){i.svuota();let o=[],t=[],r=new Map,n=[];for(let u=-a;u<=a;u++)for(let m=-a;m<=a;m++){let h=.55*Ee(u*.028,m*.028,e)+.3*Ee(u*.07,m*.07,e+11)+.15*Ee(u*.16,m*.16,e+29),c=Math.max(2,1+Math.round(Math.pow(Math.max(0,h),1.6)*22)),d=Math.max(Math.abs(u),Math.abs(m)),b=Math.min(1,Math.max(0,(a-2-d)/8)),p=b*b*(3-2*b);c=Math.round(c*p+(Lo+1)*(1-p));let g=c<=Lo+1;r.set(u+"|"+m,c);for(let E=0;E<c;E++){let _=E===c-1?g?"sabbia":"erba":E<c-3?"roccia":"terra";i.metti(u,E,m,_,!0)}if(c<=Lo)for(let E=c;E<=Lo;E++)i.metti(u,E,m,"acqua",!0);else if(!g){let E=_o(u*3+1,m*3+7,e+101);if(E>.988&&o.length<90?o.push([u,c,m]):E<.004&&t.length<14&&t.push([u,c,m]),c>=Lo+6){let v=_o(u*5+3,m*5+11,e+57);v>.99&&n.push({x:u,z:m,h:c,r:v})}}}let s=aa(i,r,e,n,a),f=u=>!s.has(u[0]+"|"+u[2]),l=[...s].map(u=>{let[m,h]=u.split("|").map(Number);return[m,r.get(u)-2,h]});return{alberi:o.filter(f),lampioni:t.filter(f),fiume:l}}var ta=[[1,0],[-1,0],[0,1],[0,-1]];function aa(i,e,a,o,t=64){let r=new Set;o.sort((f,l)=>l.h-f.h||f.r-l.r);let n=[];for(let f of o){if(n.length>=5)break;n.every(l=>(l.x-f.x)**2+(l.z-f.z)**2>=784)&&n.push(f)}let s=(f,l)=>{let u=f+"|"+l;if(r.has(u))return;let m=e.get(u);i.togli(f,m-1,l,!0),i.togli(f,m-2,l,!0),i.metti(f,m-2,l,"acqua",!0),r.add(u)};for(let f of n){let l=f.x,u=f.z,m=null,h=0,c=new Set([l+"|"+u]);for(let d=0;d<500;d++){let b=e.get(l+"|"+u);if(s(l,u),m){let v=l+m[1],_=u-m[0];e.get(v+"|"+_)===b&&s(v,_)}let p=null,g=1/0,E=1/0;for(let v of ta){let _=l+v[0],R=u+v[1];if(c.has(_+"|"+R))continue;let S=e.get(_+"|"+R);if(S===void 0)continue;let z=(v===m?-.5:0)+_o(_*7+5,R*7+13,a+71);(S<g||S===g&&z<E)&&(p=v,g=S,E=z)}if(!p||g>b||(h=g===b?h+1:0,h>24)||(l+=p[0],u+=p[1],c.add(l+"|"+u),m=p,e.get(l+"|"+u)<=Lo)||Math.max(Math.abs(l),Math.abs(u))>=t-6)break}}for(let f of r){let[l,u]=f.split("|").map(Number),m=e.get(f);for(let h=-1;h<=1;h++)for(let c=-1;c<=1;c++){if(!h&&!c)continue;let d=l+h+"|"+(u+c);if(r.has(d))continue;let b=e.get(d);b===void 0||b<m||b>m+1||i.tipo(l+h,b-1,u+c)==="erba"&&(i.togli(l+h,b-1,u+c,!0),i.metti(l+h,b-1,u+c,"sabbia",!0))}}return r}function nt(i){let e=new DataView(i);if(String.fromCharCode(e.getUint8(0),e.getUint8(1),e.getUint8(2),e.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let a=e.getUint32(4,!0),o=a*3,t=new Uint8Array(i,8,o*16),r=new Uint8Array(i,8+o*16,o*4),n=new Uint8Array(o*20);for(let m=0;m<o;m++)n.set(t.subarray(m*16,m*16+16),m*20),n.set(r.subarray(m*4,m*4+4),m*20+16);let s=1/0,f=-1/0,l=0,u=new DataView(n.buffer);for(let m=0;m<o;m++){let h=u.getFloat32(m*20,!0),c=u.getFloat32(m*20+4,!0),d=u.getFloat32(m*20+8,!0);s=Math.min(s,c),f=Math.max(f,c),l=Math.max(l,Math.hypot(h,d))}return{byte:n,vertici:o,triangoli:a,minY:s,maxY:f,raggio:l}}var ia=`#version 300 es
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
flat out vec3 vBase;
flat out float vFaccia;
flat out vec3 vN;
out float vNebbia;
out vec3 vPos;
// \u26A0 L'OMBRA DI LEAFY NON \xC8 \xABPI\xD9 SCURO\xBB: \xE8 lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' pi\xF9 satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: \xABle ombre sono solo il colore
// hue shift pi\xF9 scuro stilizzato\xBB.
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y), e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
uniform vec3 uStile;   // spostamento di tinta verso il blu, saturazione, valore (resa.stile: l'Officina li muove)
vec3 ombraStile(vec3 s) {
  vec3 h = rgb2hsv(s);
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via pi\xF9 corta verso il blu
  // \u26A0 MISURATO SULLE CONCEPT: il terracotta si sposta appena (3 %: #e59b69 \u2192
  // #bf704b), il verde molto di pi\xF9 (15 %: #5ac550 \u2192 #34974c). I colori caldi
  // (tinta sotto i 40\xB0) prendono un quinto dello spostamento.
  float caldo = 1.0 - smoothstep(0.11, 0.25, h.x);
  float freddo = smoothstep(0.42, 0.55, h.x);   // i verdi-petrolio e i blu (la chioma dell'albero) restano loro: viravano al ciano
  h.x = fract(h.x + d * uStile.x * mix(1.0, 0.2, caldo) * mix(1.0, 0.35, freddo));
  h.y = min(1.0, h.y * uStile.y + 0.03);
  h.z *= uStile.z;
  return hsv2rgb(h);
}
void main() {
  // il giro attorno a Y (i corpi del sandbox, un albero girato a caso): seno e
  // coseno per vertice costano meno di una matrice per istanza
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  vec3 p = aIst.xyz + q * aIst.w;
  vec3 n = normalize(vec3(aNor.x * cg - aNor.z * sg, aNor.y, aNor.x * sg + aNor.z * cg));
  int materia = int(aMat);
  vec3 base = pow(aCol.rgb * aTinta.rgb, vec3(2.2));
  vBase = base;
  vec4 mat = uMaterie[materia];
  // due bande per direzione del sole, come i blocchi (vedi resa.js): la faccia
  // che guarda il sole \xE8 piena, quella di spalle ha il colore d'ombra
  // \u26A0 I MODELLI HANNO DUE TINTE E BASTA: la faccia che guarda il sole ha il
  // colore pieno, quella di spalle il colore d'ombra stilizzato (lo stesso
  // dell'ombra portata). Niente mezza banda: sfumava, e non \xE8 Leafy.
  vFaccia = (mat.x > 0.0 || dot(n, -uSoleVerso) > 0.0) ? 1.0 : 0.0;
  vN = n;
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  vec3 ombra = pow(ombraStile(aCol.rgb * aTinta.rgb), vec3(2.2)) * uCieloCol;
  vec3 pieno = base * uSoleCol;
  if (mat.x > 0.0) { ombra = mix(ombra, base * 1.15, mat.x); pieno = mix(pieno, base * 1.15, mat.x); }
  vColOmbra = ombra; vColSole = (pieno - ombra) * sole;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,ra=`#version 300 es
precision mediump float;
precision mediump sampler2D;
flat in vec3 vColOmbra;
flat in vec3 vColSole;
flat in vec3 vBase;
flat in float vFaccia;
flat in vec3 vN;
in float vNebbia;
in highp vec3 vPos;
uniform highp float uSoleForza;
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI pi\xF9 vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// \u26A0 LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni (\xABesagonale\xBB).
// La luce cotta resta come MASCHERA (dietro un muro non si passa) e per le
// lampade-blocco, che non stanno nella lista.
float pozza(highp vec3 pos) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    s += q < 0.55 ? 1.0 : (q < 1.0 ? 0.45 : 0.0);
  }
  return min(s, 1.0);
}

uniform highp vec4 uBuco;        // il buco di visuale (vedi resa.js); zero per il giocatore stesso
uniform highp vec3 uOcchio;
uniform vec3 uNebbiaCol;
uniform float uSagoma;           // 1 = la passata della sagoma: colore scuro pieno, senza luce
uniform float uOmbra;
uniform highp float uTaglio;     // la passata dello specchio non disegna sotto il pelo
uniform highp vec3 uSoleVerso;
uniform sampler2D uOmbre;
uniform vec2 uOmbreScala;
uniform highp vec4 uAltRett;
uniform highp sampler2DShadow uMappaStat;   // la mappa d'ombra FERMA: terreno, lampioni, alberi (si rif\xE0 quando serve)
uniform highp sampler2DShadow uMappaDin;    // quella di chi si muove (gatto, corpi): ogni fotogramma, piccola
uniform highp mat4 uLuceVP;                 // mondo \u2192 clip del sole
uniform float uMappaOn;                     // 1 = la mappa vale
uniform vec2 uMappaSbieco;                  // x: scostamento lungo la normale (blocchi), y: bias di profondit\xE0 (clip 0..1)
// \u26A0 LA MAPPA D'OMBRA VERA (Resa._aggiornaMappa): profondit\xE0 vista dal sole,
// quindi l'ombra ha la FORMA della cosa \u2014 il palo del lampione, il gatto, la
// chioma \u2014 non della colonna. Il confronto lo fa la texture (sampler2DShadow,
// 2\xD72 in hardware: bordo netto ma senza scalini); lo scostamento lungo la
// normale e il bias tolgono l'acne. Fuori dalla mappa torna -1 e si usa la
// mappa per colonna (ombraSole), che copre tutto il mondo in streaming.
uniform highp mat4 uLuceVPDin;              // mondo \u2192 clip della mappa di chi si muove (pi\xF9 stretta: pi\xF9 fitta)
uniform vec2 uMappaTexel;                   // mezzo texel delle due mappe, in uv
// \u26A0 QUATTRO LETTURE A MEZZO TEXEL E POI UNA SOGLIA: il bordo resta netto ma
// senza scalini (le ombre \xABpixellate\xBB). Ogni lettura \xE8 gi\xE0 un 2\xD72 in hardware.
float pcf(highp sampler2DShadow m, highp vec3 c, float t) {
  return 0.25 * (texture(m, c + vec3(-t, -t, 0.0)) + texture(m, c + vec3(t, -t, 0.0)) + texture(m, c + vec3(-t, t, 0.0)) + texture(m, c + vec3(t, t, 0.0)));
}
float ombraMappa(highp vec3 pos, vec3 n) {
  if (uMappaOn < 0.5) return -1.0;
  highp vec3 p = pos + n * uMappaSbieco.x;
  highp vec4 q = uLuceVP * vec4(p, 1.0);
  highp vec3 u = q.xyz * 0.5 + 0.5;
  if (u.x < 0.004 || u.x > 0.996 || u.y < 0.004 || u.y > 0.996 || u.z > 1.0) return -1.0;
  float s = pcf(uMappaStat, vec3(u.xy, u.z - uMappaSbieco.y), uMappaTexel.x);
  highp vec4 q2 = uLuceVPDin * vec4(p, 1.0);
  highp vec3 u2 = q2.xyz * 0.5 + 0.5;
  if (u2.x > 0.002 && u2.x < 0.998 && u2.y > 0.002 && u2.y < 0.998 && u2.z <= 1.0) s = min(s, pcf(uMappaDin, vec3(u2.xy, u2.z - uMappaSbieco.y), uMappaTexel.y));
  return smoothstep(0.3, 0.7, s);
}
out vec4 colore;
// \u26A0 L'OMBRA DEL SOLE \xC8 UNA LETTURA SOLA: la mappa delle ombre (uOmbre, per
// colonna: la quota sotto cui si \xE8 in ombra, calcolata dalla GPU quando il sole
// si sposta, vedi Resa._calcolaOmbre) letta mezzo blocco VERSO il sole (cos\xEC
// una parete al sole legge la colonna davanti, non la propria) e confrontata
// con la quota del pixel con una soglia netta: cel shading, niente acne,
// niente puntini, niente penombra sbavata.
float ombraSole(highp vec3 pos) {
  vec2 dir = -uSoleVerso.xz; float l = length(dir); dir = l > 1e-4 ? dir / l : vec2(0.0);
  highp vec2 uv = (pos.xz + dir * 0.5 - uAltRett.xy) * uAltRett.zw;
  float hs = texture(uOmbre, uv).r * uOmbreScala.x + uOmbreScala.y;
  return 1.0 - smoothstep(-0.04, 0.04, hs - (pos.y + 0.03));
}
void main() {
  if (vPos.y < uTaglio) discard;
  if (uBuco.w > 0.0) {
    vec3 seg = uBuco.xyz - uOcchio; float lung = length(seg); vec3 dir = seg / lung;
    float t = dot(vPos - uOcchio, dir);
    if (t > 0.0 && t < lung - 0.35 && length(vPos - uOcchio - dir * t) < uBuco.w) discard;
  }
  float luce = vFaccia;
  if (uOmbra > 0.5 && luce > 0.0) { float m = ombraMappa(vPos, vN); luce *= m >= 0.0 ? m : ombraSole(vPos); }
  vec3 c = vColOmbra + vColSole * luce;
  // le pozze dei lampioni anche sui modelli (il gatto sotto il lampione, di notte)
  c += vBase * vec3(1.30, 1.02, 0.58) * pozza(vPos) * (1.0 - smoothstep(0.30, 0.75, uSoleForza));
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  // \u26A0 LA SAGOMA: quando il gatto \xE8 dietro un albero o un muro, si vede la sua
  // ombra piatta attraverso (il committente: \xABun cono che mostra il player
  // anche attraverso i blocchi, magari in nero\xBB, non un buco nel mondo)
  if (uSagoma > 0.5) { colore = vec4(c * 0.18 * 0.55, 0.55); return; }
  colore = vec4(c, 1.0);
}`;function na(i,e=4){if(e===8)return i instanceof Float32Array?i:new Float32Array(i);let a=i.length/4,o=new Float32Array(a*8);for(let t=0;t<a;t++)o.set([i[t*4],i[t*4+1],i[t*4+2],i[t*4+3],1,1,1,0],t*8);return o}var sa=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,ca=`#version 300 es
precision mediump float;
void main() {}`,Wo=class{constructor(e){this.gl=e,this.programma=W(e,ia,ra),this.u={};for(let a of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile"])this.u[a]=e.getUniformLocation(this.programma,a);this.programmaOmbra=W(e,sa,ca),this.uoVP=e.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(e,a){let o=this.gl,t={vao:o.createVertexArray(),vbo:o.createBuffer(),ibo:o.createBuffer(),vertici:a.vertici,triangoli:a.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:a.raggio,maxY:a.maxY};return o.bindVertexArray(t.vao),o.bindBuffer(o.ARRAY_BUFFER,t.vbo),o.bufferData(o.ARRAY_BUFFER,a.byte,o.STATIC_DRAW),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,3,o.FLOAT,!1,20,0),o.enableVertexAttribArray(1),o.vertexAttribPointer(1,3,o.BYTE,!0,20,12),o.enableVertexAttribArray(4),o.vertexAttribIPointer(4,1,o.UNSIGNED_BYTE,20,15),o.enableVertexAttribArray(2),o.vertexAttribPointer(2,4,o.UNSIGNED_BYTE,!0,20,16),o.bindBuffer(o.ARRAY_BUFFER,t.ibo),o.enableVertexAttribArray(3),o.vertexAttribPointer(3,4,o.FLOAT,!1,32,0),o.vertexAttribDivisor(3,1),o.enableVertexAttribArray(5),o.vertexAttribPointer(5,4,o.FLOAT,!1,32,16),o.vertexAttribDivisor(5,1),o.bindVertexArray(null),this.tipi.set(e,t),t}istanze(e,a,o=4){let t=this.tipi.get(e);t&&(t.istanze=na(a,o),t.n=t.istanze.length/8,t.sporco=!0,this.dinamici.has(e)||(this.mappaSporca=!0))}disegnaOmbra(e,a){let o=this.gl;o.useProgram(this.programmaOmbra),o.uniformMatrix4fv(this.uoVP,!1,e);let t=0,r=0;for(let[n,s]of this.tipi)s.n===0||this.dinamici.has(n)!==a||(o.bindVertexArray(s.vao),s.sporco&&(o.bindBuffer(o.ARRAY_BUFFER,s.ibo),o.bufferData(o.ARRAY_BUFFER,s.istanze,o.DYNAMIC_DRAW),s.sporco=!1),o.drawArraysInstanced(o.TRIANGLES,0,s.vertici,s.n),t++,r+=s.triangoli*s.n);return o.bindVertexArray(null),[t,r]}disegna(e,a){let o=this.gl,t=this.u,r=e.sole;o.useProgram(this.programma),o.uniformMatrix4fv(t.uVP,!1,e.vpCorrente||e.vp),o.uniform1f(t.uTaglio,e.taglio??-1e9);let n=e.vpCorrente===e.vpSpecchio?[0,0,0,0]:e.buco||[0,0,0,0];o.uniform3f(t.uOcchio,a.occhio[0],a.occhio[1],a.occhio[2]),o.uniform1f(t.uTempo,e.tempo),o.uniform3f(t.uSoleVerso,r.verso[0],r.verso[1],r.verso[2]),o.uniform3f(t.uSoleCol,r.colore[0],r.colore[1],r.colore[2]),o.uniform1f(t.uSoleForza,r.forza),o.uniform3f(t.uCieloCol,r.cielo[0],r.cielo[1],r.cielo[2]),o.uniform4fv(t.uMaterie,e.materie),o.uniform2f(t.uNebbia,e.nebbia.da,e.nebbia.a),o.uniform3f(t.uNebbiaCol,e.nebbia.colore[0],e.nebbia.colore[1],e.nebbia.colore[2]),o.uniform3f(t.uCam,a.occhio[0],a.occhio[1],a.occhio[2]),o.uniform1f(t.uOmbra,e.ombra&&e.altezze?1:0),e.altezze&&(o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,e.ombre.tex),o.uniform1i(t.uOmbre,0),o.uniform2f(t.uOmbreScala,e.ombre.scala,e.ombre.offset),o.uniform4f(t.uAltRett,e.altRett[0],e.altRett[1],e.altRett[2],e.altRett[3])),e.legaMappa(t);let s=0,f=0,l=0;o.uniform1f(t.uSagoma,0);for(let[m,h]of this.tipi)h.n!==0&&(o.uniform4f(t.uBuco,n[0],n[1],n[2],m==="omino"?0:n[3]),o.bindVertexArray(h.vao),h.sporco&&(o.bindBuffer(o.ARRAY_BUFFER,h.ibo),o.bufferData(o.ARRAY_BUFFER,h.istanze,o.DYNAMIC_DRAW),h.sporco=!1),o.drawArraysInstanced(o.TRIANGLES,0,h.vertici,h.n),s++,f+=h.triangoli*h.n,l+=h.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&e.vpCorrente!==e.vpSpecchio&&(o.uniform1f(t.uSagoma,1),o.depthFunc(o.GREATER),o.depthMask(!1),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.bindVertexArray(u.vao),o.drawArraysInstanced(o.TRIANGLES,0,u.vertici,u.n),o.disable(o.BLEND),o.depthMask(!0),o.depthFunc(o.LESS),o.uniform1f(t.uSagoma,0),s++),o.bindVertexArray(null),this.statistiche.disegni=s,this.statistiche.triangoli=f,this.statistiche.istanze=l}};function st(i={}){let e=(a,o=1)=>typeof a=="number"&&isFinite(a)?+a.toFixed(o):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:e(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?e(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:e(i.fps,0),p50ms:e(i.p50,2),p99ms:e(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:e(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(a=>Math.round(a)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[]},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:e(i.worldgenMs,0),meshMs:e(i.meshMs,0)},errori:(i.errori||[]).slice(-12).map(a=>String(a).slice(0,500)),scatto:i.scatto||null}}function ct(i){return Math.round(JSON.stringify(i).length/1024)}var la=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),so=(i,e)=>i>>>e|i<<32-e;function lt(i){let e=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),a=i.length*8,o=new Uint8Array(i.length+9+63>>6<<6);o.set(i),o[i.length]=128,new DataView(o.buffer).setUint32(o.length-4,a>>>0),new DataView(o.buffer).setUint32(o.length-8,Math.floor(a/4294967296));let t=new Uint32Array(64),r=new DataView(o.buffer);for(let s=0;s<o.length;s+=64){for(let p=0;p<16;p++)t[p]=r.getUint32(s+p*4);for(let p=16;p<64;p++){let g=so(t[p-15],7)^so(t[p-15],18)^t[p-15]>>>3,E=so(t[p-2],17)^so(t[p-2],19)^t[p-2]>>>10;t[p]=t[p-16]+g+t[p-7]+E>>>0}let[f,l,u,m,h,c,d,b]=e;for(let p=0;p<64;p++){let g=so(h,6)^so(h,11)^so(h,25),E=h&c^~h&d,v=b+g+E+la[p]+t[p]>>>0,_=so(f,2)^so(f,13)^so(f,22),R=f&l^f&u^l&u,S=_+R>>>0;b=d,d=c,c=h,h=m+v>>>0,m=u,u=l,l=f,f=v+S>>>0}e[0]=e[0]+f>>>0,e[1]=e[1]+l>>>0,e[2]=e[2]+u>>>0,e[3]=e[3]+m>>>0,e[4]=e[4]+h>>>0,e[5]=e[5]+c>>>0,e[6]=e[6]+d>>>0,e[7]=e[7]+b>>>0}let n="";for(let s of e)n+=s.toString(16).padStart(8,"0");return n}var ua="https://ntfy.sh",fa=4096;async function ha(i){let e=new TextEncoder().encode("leafy-shadows/"+i),a;if(globalThis.crypto&&crypto.subtle){let o=await crypto.subtle.digest("SHA-256",e);a=[...new Uint8Array(o)].map(t=>t.toString(16).padStart(2,"0")).join("")}else a=lt(e);return"leafy-"+a.slice(0,24)}async function ut(i,e){let a=await ha(i),o=await fetch(`${ua}/${a}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:e});if(!o.ok)return{ok:!1,dice:`il servizio ha detto no: ${o.status}`};let t=await o.json().catch(()=>({})),r=e.length>fa;return{ok:!0,id:t.id||"",dice:r?`mandato \u2714 (${Math.round(e.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(e.length/1024)} KB, dura 12 ore)`}}var ft="leafy.diagnostica.chiave",ma=`
/* \u26A0 UNA PILLOLA CON LA SCRITTA, NON UN'ICONA MUTA. La prima versione erano due
   tondini da 34 px sul bordo sinistro, semitrasparenti, sopra una scena piena di
   verde: sul telefono il committente non li ha proprio VISTI \u2014 \xABnon vedo il
   tasto per la diagnosi e dove mettere poi la password\xBB. Un'icona da sola
   chiede di indovinare cosa fa; una parola no. E costa una manciata di pixel di
   larghezza in una fascia dello schermo che \xE8 comunque vuota. */
#diag, #modoGui {
  position: fixed; left: 8px; z-index: 30; height: 34px; padding: 0 11px 0 9px;
  border-radius: 17px; cursor: pointer; white-space: nowrap;
  border: 2px solid rgba(13,42,26,.22); background: rgba(255,255,255,.92);
  font: 600 12px/1 system-ui, sans-serif; color: #0d2a1a;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(13,42,26,.14);
  -webkit-tap-highlight-color: transparent; user-select: none;
}
#diag b, #modoGui b { font: 15px/1 system-ui, sans-serif; }
#diag { top: calc(46% + 42px); }
#modoGui { top: 46%; }
#diag:hover, #modoGui:hover { background: #fff; }
#diag.corso { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
/* \u26A0 ACCESO = SCELTA A MANO. Quando segue il browser resta smorto: se no non si
   distingue \xABl'ho deciso io\xBB da \xABl'ha indovinato lui\xBB, e sono due cose diverse
   nel momento in cui una va bene e l'altra no. */
#modoGui.fissato { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
/* a dito tutto cresce: il bersaglio dev'essere un bersaglio per un pollice */
.gui-tocco #diag, .gui-tocco #modoGui { height: 42px; padding: 0 14px 0 11px; font-size: 13px; border-radius: 21px; }
.gui-tocco #diag b, .gui-tocco #modoGui b { font-size: 18px; }
.gui-tocco #diag { top: calc(46% + 50px); }

#diagPanel { position: fixed; inset: auto 12px 12px 12px; z-index: 40;
  max-width: 420px; margin: 0 auto; padding: 12px 14px; border-radius: 12px;
  background: rgba(255,255,255,.97); border: 1px solid rgba(13,42,26,.18);
  font: 13px/1.5 system-ui, sans-serif; color: #0d2a1a; display: none;
  box-shadow: 0 6px 24px rgba(13,42,26,.18); }
#diagPanel.aperto { display: block; }
#diagPanel h4 { margin: 0 0 6px; font-size: 14px; }
#diagPanel p { margin: 0 0 8px; color: #3c5a4a; }
#diagPanel input { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px;
  border: 1px solid rgba(13,42,26,.25); font: 13px ui-monospace, monospace; margin-bottom: 8px; }
/* \u26A0 IL CAMPO DELLA PASSWORD SI DEVE VEDERE CHE \xC8 QUELLO: committente, \xABdove
   mettere poi la password per mandartelo\xBB. Bordo scuro e sfondo appena tinto. */
#diagPanel input#diagChiave { border: 2px solid #0d2a1a; background: #f4f8f5; }
#diagPanel .righe { display: flex; gap: 8px; }
#diagPanel button { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(13,42,26,.22); background: #fff; font: 13px system-ui, sans-serif; }
#diagPanel button.primo { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
#diagPanel .esito { margin-top: 8px; font: 12px ui-monospace, monospace; white-space: pre-wrap; }
`,Qo=class{constructor(e,a){this.leggi=e,this.scatta=a,this.errori=[],addEventListener("error",t=>this._errore(t.error||t.message)),addEventListener("unhandledrejection",t=>this._errore(t.reason));let o=document.createElement("style");o.textContent=ma,document.head.appendChild(o),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(e){let a=e&&e.stack?e.stack:String(e);this.errori.push(a),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(ft)||""}catch{return""}}set chiave(e){try{localStorage.setItem(ft,e)}catch{}}apri(){let e=this.pannello;e.classList.add("aperto"),e.innerHTML=`
      <h4>Manda la diagnostica</h4>
      <p>${this.chiave?"Numeri, storia degli fps, errori e uno scatto. Niente di personale.":"<b>Serve la password.</b> Non \xE8 un lucchetto: \xE8 l'indirizzo dove finisce il rapporto. Si mette una volta sola su questo dispositivo."}</p>
      <input id="diagNota" placeholder="Cosa stavi facendo? (facoltativo)" maxlength="200">
      <!-- \u26A0 LO SCATTO \xC8 UTILISSIMO E COSTOSO INSIEME, quindi si sceglie. Con la
           figura il rapporto sta sui 60 KB e sul cloud diventa un ALLEGATO, che
           dura tre ore invece di dodici; senza sono due kilobyte, cio\xE8 davvero
           \xABun messaggio\xBB. Chi manda dal treno e mi scrive dopo mezza giornata
           deve poter togliere la figura. -->
      <label style="display:flex;gap:7px;align-items:center;margin:-2px 0 9px;color:#3c5a4a">
        <input type="checkbox" id="diagScatto" checked style="width:auto;margin:0">
        con lo scatto della scena (pi\xF9 pesante, dura meno)
      </label>
      ${this.chiave?"":'<input id="diagChiave" placeholder="password (una volta per dispositivo)" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false">'}
      <div class="righe">
        <button class="primo" id="diagVai">Manda</button>
        <button id="diagCopia">Copia</button>
        <button id="diagChiudi">Chiudi</button>
      </div>
      <div class="esito" id="diagEsito"></div>`,e.querySelector("#diagChiudi").onclick=()=>e.classList.remove("aperto"),e.querySelector("#diagCopia").onclick=()=>this.vai(!0),e.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let a=e.querySelector("#diagNota");a&&a.focus()},30)}_dice(e){let a=this.pannello.querySelector("#diagEsito");a&&(a.textContent=e)}async vai(e){let a=this.pannello.querySelector("#diagChiave");a&&a.value.trim()&&(this.chiave=a.value.trim());let o=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let t=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,r=null;if(t)try{r=this.scatta?await this.scatta():null}catch(u){this._errore(u)}let n=st({...this.leggi(),quando:new Date().toISOString(),nota:o,errori:this.errori,scatto:r}),s=ct(n),f=JSON.stringify(n,null,1);if(e){await this._negliAppunti(f),this.nodo.classList.remove("corso");return}let l=!1;try{let u=await fetch("/_diagnostica",{method:"GET"});l=u.ok&&(await u.json().catch(()=>({}))).collettore===!0}catch{l=!1}if(l)try{let u=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:f});if(u.status===403)this._dice("password sbagliata."),this.chiave="";else if(u.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!u.ok)this._dice("il collettore ha detto no: "+u.status);else{let m=await u.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${m.nome||""}  (${s} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let u=await ut(this.chiave,f);this._dice(u.ok?u.dice+`
(fuori casa: passa dal cloud)`:u.dice),u.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(f,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(e,a=""){try{await navigator.clipboard.writeText(e),this._dice(a+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let o=new Blob([e],{type:"application/json"}),t=document.createElement("a");t.href=URL.createObjectURL(o),t.download="leafy-diagnostica.json",t.click(),setTimeout(()=>URL.revokeObjectURL(t.href),4e3),this._dice(a+`scaricato come file \u2714
mandami quello.`)}}};var q=document.getElementById("tela"),pa=document.getElementById("stato"),da=document.getElementById("fps"),K=new URLSearchParams(location.search),y={raggio:+(K.get("raggio")||5),erba:+(K.get("erba")??8),ombra:K.get("ombra")!=="no",specchio:K.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(K.get("specchio")??.5)||.5)),dprMax:+(K.get("dpr")||1.5),rampa:K.has("rampa"),tutto:K.has("tutto"),mondo:K.has("finto")||K.has("rampa")?0:Math.max(16,Math.min(400,+(K.get("mondo")||48))),ora:K.has("ora")?Math.max(0,Math.min(1,+K.get("ora"))):null},{gl:No,dpr:ba,ridimensiona:va}=Te(q,{antialias:!0,dprMax:y.dprMax}),M=new ko(No),Q=new Wo(No);M.ombra=y.ombra;M.specchio.attivo=y.specchio>0;M.specchio.scala=y.specchio||.5;M.specchio.mostra=K.has("vedi");var ae=0,Ro=0;function dt(i,e){let a=performance.now();for(let r of[...M.chunks.keys()])M.rimuovi(r);ae=0;for(let r=-i;r<i;r++)for(let n=-i;n<i;n++)M.carica(r+","+n,Le(r,n,{erba:e})),ae+=256;let o=i*2*16,t=new Uint8Array(o*o);for(let r=0;r<o;r++)for(let n=0;n<o;n++)t[r*o+n]=zo(n-i*16,r-i*16)+1;M.impostaAltezze(t,-i*16,-i*16,o,o),Ro=performance.now()-a}var ao=null,bt=0,vt=0;function ga(i,e){let a=performance.now();for(let h of[...M.chunks.keys()])M.rimuovi(h);je(),ao=new $o;let{alberi:o,lampioni:t}=rt(ao,4242,i);for(let[h,c,d]of o)ao.metti(h,c,d,"albero",!0);for(let[h,c,d]of t)ao.metti(h,c,d,"lampione",!0);let r=performance.now()-a,n=[],s=1e9,f=1e9,l=-1e9,u=-1e9;for(let h of ao.chunks.keys()){let c=tt(ao,h,{erba:e});M.carica(h,c),n.push(c),s=Math.min(s,c.cx),l=Math.max(l,c.cx),f=Math.min(f,c.cz),u=Math.max(u,c.cz)}let m=at(n,s,f,l,u);return M.impostaAltezze(m.byte,m.x0,m.z0,m.larghezza,m.profondita),ae=bt=ao.contaBlocchi,vt=n.length,Ro=performance.now()-a,{tGen:r,tMesh:Ro-r}}var Ae=null;y.mondo?Ae=ga(y.mondo,y.erba):dt(y.raggio,y.erba);async function xa(){if(!ao)return;let i=new Map;ao.perOgni((e,a,o,t)=>{let r=$(t);r.forma!=="modello"||!r.modello||(i.has(r.modello)||i.set(r.modello,[]),i.get(r.modello).push(e+.5,a,o+.5,1))});for(let[e,a]of i)try{let o=await fetch(`./modelli/nucleo/${e}.bin`);if(!o.ok)throw new Error(`${o.status}`);Q.registra(e,nt(await o.arrayBuffer())),Q.istanze(e,a)}catch(o){console.warn(`modello ${e}: ${o.message}`)}}xa();M.tutto=y.tutto;var Ea=()=>{if(!ao)return zo(0,0)+2;for(let i=120;i>-Eo;i--)if(ao.tipo(0,i,0))return i+2;return 8},D={alpha:-.8,beta:1.05,raggio:46,centro:[0,Ea(),0],fov:.9};function gt(){let i=Math.sin(D.beta),e=Math.cos(D.beta);return[D.centro[0]+D.raggio*i*Math.cos(D.alpha),D.centro[1]+D.raggio*e,D.centro[2]+D.raggio*i*Math.sin(D.alpha)]}var Io=null,Jo=0;q.addEventListener("pointerdown",i=>{Io={x:i.clientX,y:i.clientY},q.setPointerCapture(i.pointerId)});q.addEventListener("pointermove",i=>{Io&&(D.alpha+=(i.clientX-Io.x)*.006,D.beta=Math.max(.15,Math.min(1.5,D.beta-(i.clientY-Io.y)*.006)),Io={x:i.clientX,y:i.clientY})});q.addEventListener("pointerup",()=>{Io=null});q.addEventListener("wheel",i=>{D.raggio=Math.max(8,Math.min(140,D.raggio*(i.deltaY>0?1.1:.9))),i.preventDefault()},{passive:!1});q.addEventListener("touchstart",i=>{i.touches.length===2&&(Jo=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY))},{passive:!0});q.addEventListener("touchmove",i=>{if(i.touches.length!==2)return;let e=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY);Jo>0&&(D.raggio=Math.max(8,Math.min(140,D.raggio*Jo/e))),Jo=e},{passive:!0});var oe=y.ora??.35;function Aa(i){y.ora===null&&(oe=(oe+i/300)%1);let e=oe*Math.PI*2-Math.PI/2,a=.24+.5*Math.max(0,Math.sin(e)),o=e*.5;M.sole.verso=[-Math.cos(o)*Math.cos(Math.asin(a)),-a,-Math.sin(o)*Math.cos(Math.asin(a))];let t=Math.max(0,Math.min(1,(Math.sin(e)+.1)*2));M.sole.forza=t;let r=Math.min(1,Math.max(0,(a-.24)/.4));M.sole.colore=[1,.78+.22*r,.55+.45*r],M.sole.cielo=[.36+.64*t,.38+.62*t,.57+.43*t],M.nebbia.colore=[.25+.47*t,.35+.5*t,.5+.42*t],No.clearColor(M.nebbia.colore[0],M.nebbia.colore[1],M.nebbia.colore[2],1)}var H=[],lo=[],ee=[],ht=performance.now(),xt=0,mt=0;function Et(i){let e=Math.min(.1,(i-ht)/1e3);ht=i;let a=performance.now();va(),Aa(e);let t={occhio:gt(),centro:D.centro,fov:D.fov,rapporto:q.width/q.height};M.disegna(t,e,Q),Q.disegna(M,t),M.disegnaAcqua();let r=performance.now()-a;H.push(e*1e3),H.length>240&&H.shift(),lo.push(r),lo.length>240&&lo.shift(),xt++,i-mt>500&&(mt=i,At()),y.rampa&&!y.mondo&&Ma(i),requestAnimationFrame(Et)}var te=[{raggio:5,erba:2,tutto:!1},{raggio:6,erba:3,tutto:!1},{raggio:7,erba:4,tutto:!1},{raggio:6,erba:3,tutto:!0},{raggio:8,erba:4,tutto:!0}],ie=[],So=-1,pt=0;function Ma(i){if(So>=0&&i-pt<6e3)return;if(So>=0){let a=H.slice(-Math.min(H.length,200)),o=te[So];ie.push({...o,fps:+(1e3/(k(a,.5)||1)).toFixed(0),p50:+k(a,.5).toFixed(1),p99:+k(a,.99).toFixed(1),js:+k(lo,.5).toFixed(2),disegni:M.statistiche.disegni,triangoli:M.statistiche.triangoli})}if(So++,So>=te.length){y.rampa=!1,At();return}let e=te[So];dt(e.raggio,e.erba),M.tutto=e.tutto,y.erba=e.erba,y.raggio=e.raggio,H.length=0,lo.length=0,pt=i}var k=(i,e)=>{if(!i.length)return 0;let a=i.slice().sort((o,t)=>o-t);return a[Math.min(a.length-1,Math.floor(a.length*e))]};function At(){let i=k(H,.5),e=k(H,.99),a=i?1e3/i:0;ee.push(Math.round(a)),ee.length>120&&ee.shift();let o={disegni:M.statistiche.disegni+Q.statistiche.disegni+M.statistiche.disegniAcqua+M.statistiche.disegniErba+M.statistiche.disegniSpecchio,triangoli:M.statistiche.triangoli+Q.statistiche.triangoli+M.statistiche.triangoliAcqua+M.statistiche.triangoliErba+M.statistiche.triangoliSpecchio,chunkVisti:M.statistiche.chunkVisti,chunkTotali:M.statistiche.chunkTotali};da.textContent=`${a.toFixed(0)} fps
${i.toFixed(1)} / ${e.toFixed(1)} ms
JS ${k(lo,.5).toFixed(2)} ms`,pa.textContent=`NUCLEO ${y.mondo?`F1 \xB7 open world vero (semilato ${y.mondo}, ${vt} chunk, ${bt.toLocaleString("it")} blocchi, gen ${Ae.tGen.toFixed(0)} ms + mesh ${Ae.tMesh.toFixed(0)} ms)`:"F0"} \xB7 ${q.width}\xD7${q.height} (dpr ${ba.toFixed(2)})
disegni ${o.disegni}  triangoli ${o.triangoli.toLocaleString("it")}  chunk ${o.chunkVisti}/${o.chunkTotali}
ombra del sole: ${M.ombra?"horizon mapping":"spenta"} \xB7 erba ${y.erba} \xB7 modelli ${Q.statistiche.istanze} istanze in ${Q.statistiche.disegni} disegni \xB7 acqua ${M.statistiche.disegniAcqua} disegni${M.statistiche.pelo!=null?` + specchio ${M.statistiche.disegniSpecchio} disegni (pelo ${M.statistiche.pelo.toFixed(2)}, scala ${M.specchio.scala})`:" (senza specchio)"} \xB7 erba ${M.statistiche.triangoliErba.toLocaleString("it")} fili in ${M.statistiche.disegniErba} disegni \xB7 costruzione ${Ro.toFixed(0)} ms
${Bo(No)}
?mondo=96 ?ora=0.95 ?finto ?raggio=${y.raggio} ?erba=${y.erba} ?ombra=${y.ombra?"s\xEC":"no"} ?specchio=${y.specchio||"no"} ?dpr=${y.dprMax} ?rampa ?tutto  \xB7  tocca lo schermo per girare`+(ie.length?`
RAMPA  fps  p50   p99   dis  triangoli
`+ie.map(t=>`r${t.raggio} e${t.erba}${t.tutto?" tutto":""}  ${String(t.fps).padStart(3)}  ${String(t.p50).padStart(5)}  ${String(t.p99).padStart(5)}  ${String(t.disegni).padStart(3)}  ${t.triangoli.toLocaleString("it")}`).join(`
`):"")+(y.rampa?`
rampa: gradino ${So+1}/${te.length}\u2026`:"")}requestAnimationFrame(Et);var Ta=new Qo(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[q.clientWidth,q.clientHeight],reso:[q.width,q.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:y.mondo?"nucleo F1 mondo vero":"nucleo F0",mondo:y.mondo,raggio:y.raggio,erba:y.erba,ombra:M.ombra,specchio:y.specchio,disegniSpecchio:M.statistiche.disegniSpecchio,tutto:!!M.tutto,dprMax:y.dprMax,jsMs:+k(lo,.5).toFixed(2),jsP99:+k(lo,.99).toFixed(2),rampa:ie},ombreLampade:!1,antialias:!0,fps:k(H,.5)?1e3/k(H,.5):null,p50:k(H,.5),p99:k(H,.99),disegni:M.statistiche.disegni+Q.statistiche.disegni+M.statistiche.disegniAcqua+M.statistiche.disegniErba+M.statistiche.disegniSpecchio,triangoli:M.statistiche.triangoli+Q.statistiche.triangoli+M.statistiche.triangoliAcqua+M.statistiche.triangoliErba+M.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:ee,storiaLivelli:[],scheda:Bo(No),software:/swiftshader|llvmpipe/i.test(Bo(No)),chunk:M.statistiche.chunkTotali,blocchi:ae,luci:0,decorazioni:Q.statistiche.istanze,erba:M.statistiche.triangoliErba,ora:`${Math.floor(oe*24)}h`,giorno:0,worldgenMs:Ro,meshMs:Ro}),()=>{let i=gt();return M.disegna({occhio:i,centro:D.centro,fov:D.fov,rapporto:q.width/q.height},0),Promise.resolve(q.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:M,modelli:Q,cam:D,opz:y,statistiche:()=>({fps:1e3/(k(H,.5)||1),p50:k(H,.5),p99:k(H,.99),js:k(lo,.5),...M.statistiche,modelli:{...Q.statistiche},costruzioneMs:Ro,fotogrammi:xt}),diagnostica:Ta};

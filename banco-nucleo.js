function Re(i,{antialias:e=!0,dprMax:t=1.5}={}){let o=i.getContext("webgl2",{antialias:e,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!o)throw new Error("WebGL2 non disponibile");let a=Math.min(t,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(i.clientWidth*a)),s=Math.max(1,Math.round(i.clientHeight*a));return i.width!==r||i.height!==s?(i.width=r,i.height=s,o.viewport(0,0,r,s),!0):!1};return n(),{gl:o,dpr:a,ridimensiona:n}}function oo(i,e,t){let o=(n,r)=>{let s=i.createShader(n);if(i.shaderSource(s,r),i.compileShader(s),!i.getShaderParameter(s,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(s)}
${r.split(`
`).map((f,l)=>`${l+1}: ${f}`).join(`
`)}`);return s},a=i.createProgram();if(i.attachShader(a,o(i.VERTEX_SHADER,e)),i.attachShader(a,o(i.FRAGMENT_SHADER,t)),i.linkProgram(a),!i.getProgramParameter(a,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(a)}`);return a}function ko(i){let e=i.getExtension("WEBGL_debug_renderer_info");return e?i.getParameter(e.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function Z(i,e,t){return(Math.sign(i)+1)*9+(Math.sign(e)+1)*3+(Math.sign(t)+1)}var Sa=Z(1,0,0),_a=Z(-1,0,0),Ca=Z(0,1,0),Oa=Z(0,-1,0),La=Z(0,0,1),Ia=Z(0,0,-1);var Se=[Sa,_a,Ca,Oa,La,Ia],To=class{constructor(e=1024){this.byte=new Uint8Array(e*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(e){let t=(this.n+e)*12;if(t<=this.byte.length)return;let o=this.byte.length*2;for(;o<t;)o*=2;let a=new Uint8Array(o);a.set(this.byte),this.byte=a,this.u32=new Uint32Array(a.buffer)}vertice(e,t,o,a,n,r,s,f=0,l=0){let u=Math.round(e*16)+16,h=Math.round(o*16)+16,m=Math.round(t*16);if(u<0||u>511||h<0||h>511||m<0||m>65535)throw new RangeError(`vertice fuori dal chunk: ${e},${t},${o}`);if(a<0||a>26||a===13)throw new RangeError(`normale non valida: ${a}`);this._spazio(1);let c=this.n*3,d=this.byte,v=this.u32;v[c]=(u|h<<9|(a&31)<<18|(f&1)<<23|(l&15)<<24)>>>0,v[c+1]=(m|(n&15)<<16|(r&15)<<20)>>>0;let p=this.n*12+8;d[p]=s>>16&255,d[p+1]=s>>8&255,d[p+2]=s&255,d[p+3]=0,this.n++}quadDa(e,t,o,a){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[e,t,o,a])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function _e(i=16384){let e=new Uint16Array(i*6);for(let t=0,o=0,a=0;t<i;t++,a+=4)e[o++]=a,e[o++]=a+1,e[o++]=a+2,e[o++]=a,e[o++]=a+2,e[o++]=a+3;return e}function Ce(i,e,t,o){let a=1/Math.tan(i/2),n=1/(t-o);return new Float32Array([a/e,0,0,0,0,a,0,0,0,0,(o+t)*n,-1,0,0,2*o*t*n,0])}function ce(i,e,t){let o=1/(t-e);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*o,0,0,0,-(t+e)*o,1])}function Go(i,e,t=[0,1,0]){let o=i[0]-e[0],a=i[1]-e[1],n=i[2]-e[2],r=Math.hypot(o,a,n)||1;o/=r,a/=r,n/=r;let s=t[1]*n-t[2]*a,f=t[2]*o-t[0]*n,l=t[0]*a-t[1]*o;r=Math.hypot(s,f,l)||1,s/=r,f/=r,l/=r;let u=a*l-n*f,h=n*s-o*l,m=o*f-a*s;return new Float32Array([s,u,o,0,f,h,a,0,l,m,n,0,-(s*i[0]+f*i[1]+l*i[2]),-(u*i[0]+h*i[1]+m*i[2]),-(o*i[0]+a*i[1]+n*i[2]),1])}function Oe(i,e=new Float32Array(16)){let[t,o,a,n,r,s,f,l,u,h,m,c,d,v,p,g]=i,E=t*s-o*r,b=t*f-a*r,R=t*l-n*r,S=o*f-a*s,_=o*l-n*s,C=a*l-n*f,M=u*v-h*d,z=u*p-m*d,x=u*g-c*d,T=h*p-m*v,B=h*g-c*v,O=m*g-c*p,L=E*O-b*B+R*T+S*x-_*z+C*M;return L?(L=1/L,e[0]=(s*O-f*B+l*T)*L,e[1]=(a*B-o*O-n*T)*L,e[2]=(v*C-p*_+g*S)*L,e[3]=(m*_-h*C-c*S)*L,e[4]=(f*x-r*O-l*z)*L,e[5]=(t*O-a*x+n*z)*L,e[6]=(p*R-d*C-g*b)*L,e[7]=(u*C-m*R+c*b)*L,e[8]=(r*B-s*x+l*M)*L,e[9]=(o*x-t*B-n*M)*L,e[10]=(d*_-v*R+g*E)*L,e[11]=(h*R-u*_-c*E)*L,e[12]=(s*z-r*T-f*M)*L,e[13]=(t*T-o*z+a*M)*L,e[14]=(v*b-d*S-p*E)*L,e[15]=(u*S-h*b+m*E)*L,e):null}function Po(i,e,t=new Float32Array(16)){for(let o=0;o<4;o++)for(let a=0;a<4;a++)t[o*4+a]=i[a]*e[o*4]+i[4+a]*e[o*4+1]+i[8+a]*e[o*4+2]+i[12+a]*e[o*4+3];return t}function ue(i,e=new Float32Array(24)){let t=f=>[i[f],i[4+f],i[8+f],i[12+f]],o=t(0),a=t(1),n=t(2),r=t(3),s=[[r[0]+o[0],r[1]+o[1],r[2]+o[2],r[3]+o[3]],[r[0]-o[0],r[1]-o[1],r[2]-o[2],r[3]-o[3]],[r[0]+a[0],r[1]+a[1],r[2]+a[2],r[3]+a[3]],[r[0]-a[0],r[1]-a[1],r[2]-a[2],r[3]-a[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let f=0;f<6;f++){let[l,u,h,m]=s[f],c=Math.hypot(l,u,h)||1;e[f*4]=l/c,e[f*4+1]=u/c,e[f*4+2]=h/c,e[f*4+3]=m/c}return e}function fe(i,e,t,o,a,n,r){for(let s=0;s<6;s++){let f=i[s*4],l=i[s*4+1],u=i[s*4+2],h=i[s*4+3],m=f>0?a:e,c=l>0?n:t,d=u>0?r:o;if(f*m+l*c+u*d+h<0)return!1}return!0}var Fa=`#version 300 es
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
}`,Le=`#version 300 es
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
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI pi\xF9 vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// \u26A0 LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni (\xABesagonale\xBB).
// La luce cotta resta come MASCHERA (dietro un muro non si passa) e per le
// lampade-blocco, che non stanno nella lista.
uniform sampler2D uAltezze;   // la mappa delle altezze (cima di ogni colonna + 1), per l'ombra della lampada
// \u26A0 L'OMBRA DELLA LAMPADA SI CAMMINA CELLA PER CELLA (Amanatides\u2013Woo, la
// traversata dei voxel in due dimensioni): dal punto si va verso la lanterna
// (a 2,6 di quota) attraversando le colonne della mappa delle altezze una per
// una, e ci si ferma sulla prima che sta sopra il raggio.
// \u26A0 NON a passi fissi: con dodici passi uguali il bordo dell'ombra cadeva
// DOVE CAPITAVA IL PASSO, non sul bordo del blocco, ed era seghettato (\xABl'ombra
// \xE8 seghettata quadrata non va bene\xBB). Camminando i confini delle celle il
// taglio \xE8 esattamente il profilo del blocco, dritto, e le letture sono meno:
// una per cella attraversata, al massimo quattordici (il raggio \xE8 4,6).
float ombraLampada(highp vec3 pos, highp vec3 L) {
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 prossimo = (cella + max(verso, vec2(0.0)) - pos.xz) / (verso * mod_);   // quanto manca al confine
  highp vec2 quanto = 1.0 / mod_;                    // e quanto da un confine al prossimo
  for (int i = 0; i < 14; i++) {
    highp float t = min(prossimo.x, prossimo.y);
    if (t >= lungo) break;                           // arrivati alla lanterna: niente in mezzo
    if (prossimo.x < prossimo.y) { cella.x += verso.x; prossimo.x += quanto.x; }
    else { cella.y += verso.y; prossimo.y += quanto.y; }
    highp float y = pos.y + (L.y - pos.y) * (t / lungo);
    // \u26A0 IL CANALE G: il solido VERO. Col canale R (la silhouette, chioma
    // compresa) un albero metteva davanti alla lampada un disco di colonne
    // alte quattro \u2014 cio\xE8 un ostacolo squadrato, e l'ombra che ne usciva era
    // \xABun'ombra quadrata delle luci\xBB. Un albero adesso non fa ombra alla
    // lampada: \xE8 meno sbagliato di una che non somiglia a lui, e la sua ombra
    // vera dal sole ce l'ha gi\xE0 dalla mappa d'ombra (che \xE8 per forma).
    float h = texture(uAltezze, (cella + 0.5 - uAltRett.xy) * uAltRett.zw).g * 255.0;
    if (h > y + 0.05 && h > pos.y + 0.6) return 0.0;
  }
  return 1.0;
}
float pozza(highp vec3 pos, float cotto) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // \u26A0 TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    s += anello * ombraLampada(pos, uLampade[i].xyz + vec3(0.0, 2.6, 0.0));
  }
  return min(s, 1.0);
}
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
  // \u26A0 LA LUCE DEI LAMPIONI \xC8 SOLO LA POZZA per pixel: tre cerchi netti, tagliati
  // dall'ostacolo (ombraLampada). Le bande della luce COTTA (floor(vBlocco*4))
  // NON si sommano pi\xF9: la cottura gira attorno ai muri per inondazione e
  // dietro un cubo faceva gradini di luce che non erano l'ombra del lampione
  // (\xABi cerchi hanno un'ombra che non \xE8 normale\xBB). vBlocco resta nel vertice.
  // \u26A0 DI GIORNO I CERCHI RESTANO, in trasparenza (45 %): come i lampioni accesi di Leafy
  float notte = mix(0.45, 1.0, 1.0 - smoothstep(0.30, 0.75, uSoleForza));
  float lamp = pozza(vPos, vBlocco) * notte;
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
}`,Na=`#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale cima \xB7 B: y prof livello
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
}`,Pa=`#version 300 es
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
// \u26A0 CHI GALLEGGIA: **[x, z, mezzoX, mezzoZ]** per otto \u2014 l'IMPRONTA, non un
// raggio. Era [x, y, z, raggio], e la y non la leggeva nessuno: un centro e un
// raggio sono un cerchio, e con un cerchio qualunque mesh entri in acqua fa
// sempre lo stesso segno. Le due mezze misure lasciano alla schiuma la forma
// della cosa che la fa.
// \u26A0 E LE MISURE SI RESTRINGONO A ZERO quando il galleggiante esce dalla
// finestra (partita.js): \xABflickerer\xE0 tantissimo\xBB \u2014 e sarebbe successo, perch\xE9
// gli otto pi\xF9 vicini cambiano di continuo e un galleggiante che esce dalla
// lista spariva di colpo. Rimpicciolendosi, se ne va senza che si veda.
uniform highp vec4 uGalleggianti[8];
uniform int uNGalleggianti;
uniform sampler2D uAltezze;      // la cima solida di ogni colonna (+1) / 255: dice dov'\xE8 la riva
uniform highp vec4 uAltRett;     // x0, z0, 1/larghezza, 1/profondita
out vec4 colore;
// \u26A0 LA RIVA NON \xC8 LA PROFONDIT\xC0: un lago basso \xE8 basso dappertutto, e a
// misurarla con vProf la schiuma copriva tutto lo specchio d'acqua. La riva
// \xE8 \xABdi qui c'\xE8 TERRA PI\xD9 ALTA a meno di un passo\xBB, e la dice la mappa delle
// altezze: sei letture attorno al pixel, su un raggio che respira.
// \u26A0 IL CONFRONTO \xC8 FRA CIME DI CELLA, non fra quote esatte: il pelo sta un po'
// sotto il bordo della sua cella (peloDi) e ondeggia, quindi con una soglia
// sulla y vera la sabbia allo stesso livello dell'acqua \u2014 cio\xE8 LA RIVA \u2014 non
// contava. La cima della cella d'acqua \xE8 floor(y) + 1: \xE8 terra tutto ci\xF2 che
// arriva lass\xF9 o pi\xF9 su.
// \u26A0 NIENTE LETTERE ACCENTATE NEI NOMI GLSL (si chiamava terraL\xEC): il programma
// non compila, l'eccezione ferma tutto e la pagina non parte proprio.
float terraLi(highp vec2 q, float cima) {
  highp vec2 uv = (q - uAltRett.xy) * uAltRett.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  // \u26A0 IL CANALE G: il solido VERO, senza la chioma degli alberi. Col canale R
  // (la silhouette per il sole) un albero con la punta nell'acqua faceva
  // tredici colonne di riva finta attorno a se': \xABcreano tantissima schiuma in
  // acqua anche se vedi solo la punta o solo il tronco\xBB.
  return texture(uAltezze, uv).g * 255.0 > cima - 0.5 ? 1.0 : 0.0;
}
float riva(highp vec3 pos, float onda) {
  // \u26A0 SENZA MARGINE: il pelo sta SEMPRE un po' SOTTO la cima della sua cella
  // (peloDi toglie almeno 1/16, l'onda al massimo 0,055), quindi floor(y) \xE8 la
  // base della cella d'acqua. Un +0,1 \xABdi sicurezza\xBB la faceva saltare alla
  // cella di sopra e la riva non contava mai: schiuma zero.
  float cima = floor(pos.y) + 1.0;
  // \u26A0 SI FA LA MEDIA DI SEDICI ASSAGGI, NON IL MASSIMO DI SEI. La mappa delle
  // altezze ha un texel per colonna: con un test s\xEC/no il bordo della schiuma
  // cade sul bordo del TEXEL, cio\xE8 fa una scaletta di blocchi interi \u2014 \xABal
  // bordo \xE8 seghettata, orribile\xBB. \xC8 parente stretto del difetto gi\xE0 pagato
  // con l'ombra della lampada (\xABseghettata quadrata\xBB), e la cura \xE8 la stessa
  // in spirito: smettere di leggere una griglia come se fosse un contorno.
  // Mediando sedici assaggi il valore diventa CONTINUO (diciassette
  // gradazioni) e il bordo si taglia dove si vuole con uno smoothstep, invece
  // di ereditare la griglia; le direzioni ruotano con l'onda, cos\xEC il taglio
  // non \xE8 mai lo stesso due volte e non si legge come un cerchio di compasso.
  // \u26A0 E I RAGGI SONO PI\xD9 CORTI di prima (era 0,78 fisso): \xABun pochino troppo
  // spessa\xBB. Adesso la fascia sta attorno a mezzo blocco.
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7854 + onda * 0.6;   // quarantacinque gradi, e ruotano
    vec2 dir = vec2(cos(a), sin(a));
    s += terraLi(pos.xz + dir * (0.35 + onda * 0.5), cima);
    s += terraLi(pos.xz + dir * (0.75 + onda * 0.8), cima);
  }
  return s * 0.0625;
}
/**
 * \u26A0 IL CAMPO \xC8 CONTINUO, IL TAGLIO NO \u2014 e la distinzione \xE8 tutta qui.
 *
 * Il committente: \xABla schiuma non \xE8 netta come quella che volevo, senza
 * sfumature fuori stile\xBB. Ha ragione, ed \xE8 la regola della casa scritta dal
 * primo giorno: **l'ombra \xE8 un gradino, non una rampa**. Una schiuma sfumata \xE8
 * il rendering di qualcun altro.
 *
 * Ma \xABnetta\xBB e \xABnon seghettata\xBB non sono in contraddizione, e crederlo \xE8
 * l'errore: la scaletta veniva dal CAMPO (sedici assaggi s\xEC/no su una griglia
 * di un texel per colonna), non dal taglio. Un campo continuo tagliato con un
 * gradino d\xE0 un bordo NETTO che segue il contorno vero della riva; un campo a
 * gradini, comunque lo si tagli, d\xE0 una scaletta di blocchi. Quindi: media per
 * il campo, gradino per il bordo.
 *
 * \u26A0 E DUE BANDE, non una \u2014 come le pozze dei lampioni e come l'ombra a tre
 * bande: una risacca piena attaccata alla riva e una pi\xF9 magra fuori. Una
 * banda sola si legge come un contorno disegnato col pennarello.
 * Il mezzo texel di smoothstep e' solo antialiasing, come nella mappa d'ombra
 * (smoothstep 0.3 - 0.7): a occhio e' un gradino.
 *
 * \u26A0 E NIENTE BACKTICK IN QUESTO COMMENTO: sta dentro un template literal di
 * JavaScript, quindi un backtick lo CHIUDE e il file non si carica proprio.
 * Ci sono appena ricascato scrivendo questa nota. C'e' un test apposta
 * (test/glsl-backtick.test.mjs) e serve.
 */
float aGradini(float v, float soglia) {
  return smoothstep(soglia - 0.03, soglia + 0.03, v);
}
/**
 * L'anello attorno a chi galleggia \u2014 e SEGUE L'IMPRONTA, non un cerchio.
 *
 * \u26A0 \xABNon rappresenta per niente la forma dell'oggetto a seconda della mesh che
 * entra dinamicamente\xBB: giusto, e la causa stava nei dati, non qui. Gli otto
 * galleggianti portavano un centro e UN RAGGIO \u2014 cio\xE8 un cerchio, e qualunque
 * cosa entrasse in acqua faceva sempre un cerchio. Adesso portano le due
 * mezze misure dell'impronta, e questa \xE8 la distanza da un rettangolo
 * arrotondato: un cubo fa una schiuma squadrata, il gatto una ovale allungata
 * come lui.
 */
float anelloForma(highp vec2 p, highp vec2 centro, highp vec2 mezzo, float onda) {
  highp vec2 q = abs(p - centro) - mezzo;
  float d = length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0);
  float x = d + onda * 0.5;
  // \u26A0 DUE ANELLI NETTI, non una ghirlanda sfumata: dentro pieno, fuori magro,
  // e in mezzo un gradino. Il mezzo texel \xE8 antialiasing, non una rampa.
  float dentro = smoothstep(0.16, 0.13, x) * smoothstep(-0.16, -0.13, x);
  float fuori = smoothstep(0.30, 0.27, x) * smoothstep(-0.20, -0.17, x);
  return max(dentro, fuori * 0.55);
}
void main() {
  vec3 vista = normalize(uCam - vPos);
  float lontano = distance(uCam, vPos);
  // \u26A0 LA NORMALE VIENE DALLE SOLE ONDE LUNGHE, ed \xE8 una lezione gi\xE0 pagata sul
  // lato Babylon (CLAUDE.md: \xABle increspature fini facevano un riflesso
  // "casuale" e brillii a coriandoli guardando il sole\xBB) che qui non era mai
  // arrivata. Le frequenze erano 2,3 e 1,9 sul mondo, cio\xE8 un motivo che si
  // RIPETE OGNI 2,7 BLOCCHI: guardando il lago verso il sole si vedeva la
  // stessa piega tornare a intervalli regolari \u2014 il \xABtiling tutto ripetuto\xBB
  // del committente. Adesso 0,24 e 0,22: periodo ventisei blocchi, che a
  // schermo non torna mai due volte.
  float o1 = sin(uTempo * 0.50 + vPos.x * 0.24 + vPos.z * 0.10);
  float o2 = cos(uTempo * 0.37 - vPos.x * 0.09 + vPos.z * 0.22);
  vec3 n = vPelo > 0.5 ? normalize(vec3(0.055 * o1, 1.0, 0.055 * o2)) : vec3(0.0, 1.0, 0.0);
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
  // \u26A0 E LA DEFORMAZIONE CALA CON LA DISTANZA. Era 0,16 dello SCHERMO, fissa:
  // sedici per cento della larghezza dello schermo, uguale a due metri e a
  // ottanta. Da vicino \xE8 troppa; da lontano, dove quei ventisei blocchi di
  // periodo stanno in pochi pixel, diventa un tremolio ad altissima frequenza
  // \u2014 la \xABdistorsione strana\xBB. Legandola alla distanza lo spostamento resta
  // costante nel MONDO invece che sullo schermo, ed \xE8 quello che vuole
  // l'occhio. Il tetto \xE8 il 3 % (CLAUDE.md dice 3-10 %: qui il riflesso \xE8 gi\xE0
  // a mezza risoluzione, e oltre si vede sfocare).
  float sfumaOnda = 8.0 / (8.0 + lontano);
  vec2 uv = clamp(gl_FragCoord.xy * uSchermo.xy + n.xz * 0.03 * sfumaOnda * vPelo, 0.002, 0.998);
  vec3 riflesso = mix(cielo, pow(texture(uSpecchio, uv).rgb, vec3(2.2)), uSchermo.z);
  // \u26A0 IL CIELO CAPOVOLTO SOLO RADENTE quando non c'\xE8 specchio: a 45\xB0 il fresnel
  // cubico vale il 2%. Con lo specchio il riflesso c'\xE8 sempre un po' (22%) e
  // radente \xE8 quasi tutto (85%): l'acqua resta acqua guardandola dall'alto.
  float peso = mix(fres * 0.55, mix(0.22, 0.85, fres), uSchermo.z) * vPelo;
  acqua = mix(acqua, riflesso, peso);
  alfa = mix(alfa, 0.95, fres * vPelo);
  float brillio = step(0.985, dot(reflect(-vista, n), -uSoleVerso)) * uSoleForza * vPelo;
  acqua += vec3(0.9) * brillio;
  // \u26A0 LA SCHIUMA: alla riva (dove il fondo \xE8 alto, vProf piccola) e attorno a
  // chi galleggia. Solo sul pelo, e sopra a tutto il resto (anche al riflesso):
  // \xE8 il segno che l'acqua tocca qualcosa, e in Leafy \xE8 quello che d\xE0 vita.
  float onda = 0.13 * sin(uTempo * 1.5 + vPos.x * 1.9 + vPos.z * 1.1) + 0.08 * sin(uTempo * 2.3 - vPos.x * 1.3 + vPos.z * 2.7);
  // \u26A0 DUE BANDE NETTE alla riva: piena attaccata a terra, magra un passo fuori.
  // \u26A0 LE SOGLIE SONO CONTATE, non a occhio. A distanza d da una riva dritta la
  // quota di assaggi che cadono a terra vale acos(d/r)/pi per anello: con
  // raggi 0,35 e 0,75 viene circa 0,47 a filo di riva, 0,36 a un quinto di
  // blocco, 0,16 a due quinti, 0 oltre. Quindi 0,40 taglia la risacca piena
  // (un decimo di blocco) e 0,14 quella magra (mezzo blocco): due bande nette,
  // larghe in tutto poco meno di mezzo blocco.
  float campo = riva(vPos, onda);
  float sRiva = max(aGradini(campo, 0.40), aGradini(campo, 0.14) * 0.5);
  float sTocco = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNGalleggianti) break;
    highp vec4 g = uGalleggianti[i];
    sTocco = max(sTocco, anelloForma(vPos.xz, g.xy, g.zw, onda));
  }
  // \u26A0 DUE SCHIUME DIVERSE, e il committente l'ha chiesto: \xABla schiuma di
  // diverso tipo e materiale\xBB. Non sono la stessa cosa e non devono sembrarlo:
  // quella della RIVA \xE8 una risacca \u2014 bassa, un filo sabbiosa, ferma dov'\xE8;
  // quella del CONTATTO \xE8 agitata \u2014 pi\xF9 bianca, pi\xF9 stretta, e si muove con
  // chi la fa. Dipingerle con lo stesso bianco le faceva leggere come un
  // difetto solo, ed \xE8 il motivo per cui una sola parola (\xABorribile\xBB) copriva
  // due cose lontane.
  sRiva *= vPelo * 0.72;      // 0,85 prima: \xABun pochino troppo spessa\xBB
  sTocco *= vPelo * 0.92;
  vec3 luceSchiuma = mix(uCieloCol * 0.9, uSoleCol, sole * 0.85);
  vec3 biancoRiva = pow(vec3(0.90, 0.93, 0.91), vec3(2.2));
  vec3 biancoTocco = pow(vec3(0.97, 0.99, 1.0), vec3(2.2));
  acqua = mix(acqua, biancoRiva * luceSchiuma, sRiva);
  acqua = mix(acqua, biancoTocco * luceSchiuma, sTocco);
  alfa = mix(alfa, 0.93, sRiva);
  alfa = mix(alfa, 0.98, sTocco);
  vec3 c = pow(mix(acqua, cielo, vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, mix(alfa, 1.0, vNebbia));
}`,qa=`#version 300 es
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
  vBase = pow(vec3(aB.xyz) / 255.0, vec3(2.2)) * mix(1.0, scosta, punta);
  vOmbra = pow(ombraStile(vec3(aB.xyz) / 255.0), vec3(2.2)) * mix(1.0, scosta, punta);
  // l'erba \xE8 del prato: guarda il sole come la cima del blocco (normale in su), senza bande sue
  vSole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  vFaccia = 1.0; vN = vec3(0.0, 1.0, 0.0);
  vCielo = cielo; vBlocco = float(aC.w & 15u) / 15.0; vEmis = 0.0;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,Da=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,Ua=`#version 300 es
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
}`,wa=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Ba=`#version 300 es
precision mediump float;
void main() {}`,Yo=class{constructor(e){this.gl=e,this.programma=oo(e,Fa,Le),this.u={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[t]=e.getUniformLocation(this.programma,t);this.ebo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,_e(16384),e.STATIC_DRAW),this.programmaErba=oo(e,qa,Le.replace(/flat in /g,"in ")),this.ue={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.ue[t]=e.getUniformLocation(this.programmaErba,t);this.programmaOmbra=oo(e,wa,Ba),this.uo={uVP:e.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:e.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=oo(e,Na,Pa),this.ua={};for(let t of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[t]=e.getUniformLocation(this.programmaAcqua,t);this.programmaCielo=oo(e,Da,Ua),this.uc={};for(let t of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[t]=e.getUniformLocation(this.programmaCielo,t);this.vaoVuoto=e.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(512),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!e.getExtension("EXT_color_buffer_half_float")&&!!e.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),e.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(e,t){let o=this.mappa;Math.hypot(e+8-o.centro[0],t+8-o.centro[2])<=o.raggio+12&&(o.sporca=!0)}carica(e,t){let o=this.gl;this._sporcaMappa(t.cx*16,t.cz*16);let a=this.chunks.get(e);a||(a={vao:o.createVertexArray(),vbo:o.createBuffer(),quad:0},o.bindVertexArray(a.vao),o.bindBuffer(o.ARRAY_BUFFER,a.vbo),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,2,o.UNSIGNED_INT,12,0),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,8),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ebo),o.bindVertexArray(null),this.chunks.set(e,a)),o.bindBuffer(o.ARRAY_BUFFER,a.vbo),o.bufferData(o.ARRAY_BUFFER,t.byte,o.STATIC_DRAW),a.quad=t.quad;let n=t.erba;a.verticiErba=n?n.vertici:0,a.lamelle=n?n.fili:0,a.yBaseErba=n?n.yBase:0,a.verticiErba>0&&(a.vaoErba||(a.vaoErba=o.createVertexArray(),a.vboErba=o.createBuffer(),o.bindVertexArray(a.vaoErba),o.bindBuffer(o.ARRAY_BUFFER,a.vboErba),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,4,o.UNSIGNED_BYTE,12,0),o.vertexAttribDivisor(0,1),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,4),o.vertexAttribDivisor(1,1),o.enableVertexAttribArray(2),o.vertexAttribIPointer(2,4,o.UNSIGNED_BYTE,12,8),o.vertexAttribDivisor(2,1),o.bindVertexArray(null)),o.bindBuffer(o.ARRAY_BUFFER,a.vboErba),o.bufferData(o.ARRAY_BUFFER,n.byte,o.STATIC_DRAW));let r=t.acqua;if(a.quadAcqua=r?r.quad:0,a.peloAcqua=r&&r.pelo!=null?r.pelo:null,a.quadAcqua>0&&(a.vaoAcqua||(a.vaoAcqua=o.createVertexArray(),a.vboAcqua=o.createBuffer(),o.bindVertexArray(a.vaoAcqua),o.bindBuffer(o.ARRAY_BUFFER,a.vboAcqua),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,2,o.UNSIGNED_INT,12,0),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,8),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ebo),o.bindVertexArray(null)),o.bindBuffer(o.ARRAY_BUFFER,a.vboAcqua),o.bufferData(o.ARRAY_BUFFER,r.byte,o.STATIC_DRAW)),a.x0=t.cx*16,a.z0=t.cz*16,a.minY=t.minY,a.maxY=t.maxY,a.y0=t.y0||0,a.chunk=[a.x0,a.y0,a.z0],t.altezze){a.tegola||(a.tegola=new Uint8Array(512));let s=t.solide||t.altezze;for(let f=0;f<16;f++)for(let l=0;l<16;l++){let u=(l*16+f)*2,h=t.altezze[f*16+l],m=s[f*16+l];a.tegola[u]=h<0?0:Math.max(0,Math.min(255,h+1)),a.tegola[u+1]=m<0?0:Math.max(0,Math.min(255,m+1))}this.finestra&&this._scriviTegola(a)}}apriFinestraAltezze(e,t,o=512){let a=this.gl;this.altezze||(this.altezze=a.createTexture()),this.finestra={lato:o,x0:0,z0:0,vuota:new Uint8Array(o*o*2),spostamenti:0},a.bindTexture(a.TEXTURE_2D,this.altezze),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),this._centraFinestra(e,t,!0)}seguiAltezze(e,t){this.finestra&&this._centraFinestra(e,t,!1)}_centraFinestra(e,t,o){let a=this.gl,n=this.finestra,r=n.lato/2;if(!o&&Math.abs(e-(n.x0+r))<n.lato/4&&Math.abs(t-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((e-r)/16)*16,n.z0=Math.floor((t-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.w!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,n.lato,n.lato],a.bindTexture(a.TEXTURE_2D,this.altezze),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.RG8,n.lato,n.lato,0,a.RG,a.UNSIGNED_BYTE,n.vuota);for(let s of this.chunks.values())s.tegola&&this._scriviTegola(s);return n.spostamenti++,!0}_scriviTegola(e,t=!1){let o=this.gl,a=this.finestra,n=e.x0-a.x0,r=e.z0-a.z0;n<0||r<0||n+16>a.lato||r+16>a.lato||(o.bindTexture(o.TEXTURE_2D,this.altezze),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texSubImage2D(o.TEXTURE_2D,0,n,r,16,16,o.RG,o.UNSIGNED_BYTE,t?this._tegolaVuota:e.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(e,t,o,a=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=oo(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,e,t,o,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,e,t,o,.1),n.uniform3f(r.uColore,1,1-.45*a,1-.8*a),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(e,t,o,a,n,r,s=.3,f=.1){let l=this.gl;this.programmaPieno||(this.programmaPieno=oo(l,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:l.getUniformLocation(this.programmaPieno,"uVP"),uCella:l.getUniformLocation(this.programmaPieno,"uCella"),uColore:l.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=l.createVertexArray());let u=this.uPieno;l.useProgram(this.programmaPieno),l.uniformMatrix4fv(u.uVP,!1,this.vp),l.uniform4f(u.uCella,e,t,o,f),l.uniform4f(u.uColore,a*s,n*s,r*s,s),l.bindVertexArray(this.vaoPieno),l.enable(l.BLEND),l.blendFunc(l.ONE,l.ONE_MINUS_SRC_ALPHA),l.depthMask(!1),l.disable(l.CULL_FACE),l.drawArrays(l.TRIANGLES,0,36),l.enable(l.CULL_FACE),l.depthMask(!0),l.disable(l.BLEND),l.bindVertexArray(null)}rimuovi(e){let t=this.chunks.get(e);t&&(this._sporcaMappa(t.x0,t.z0),this.finestra&&t.tegola&&this._scriviTegola(t,!0),this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.vbo),t.vaoAcqua&&(this.gl.deleteVertexArray(t.vaoAcqua),this.gl.deleteBuffer(t.vboAcqua)),t.vaoErba&&(this.gl.deleteVertexArray(t.vaoErba),this.gl.deleteBuffer(t.vboErba)),this.chunks.delete(e))}_sporcaOmbre(e,t,o,a){let r=[Math.max(0,e-26),Math.max(0,t-26),Math.min(this.ombre.w||1e9,e+o+26),Math.min(this.ombre.h||1e9,t+a+26)],s=this.ombre.sporco;this.ombre.sporco=s?[Math.min(s[0],r[0]),Math.min(s[1],r[1]),Math.max(s[2],r[2]),Math.max(s[3],r[3])]:r}_preparaOmbre(e,t){let o=this.gl,a=this.ombre;if(a.tex||(a.tex=o.createTexture(),a.fbo=o.createFramebuffer()),o.bindTexture(o.TEXTURE_2D,a.tex),a.mezzoFloat=this._ombreMezzo,a.mezzoFloat?(o.texImage2D(o.TEXTURE_2D,0,o.R16F,e,t,0,o.RED,o.HALF_FLOAT,null),a.scala=1,a.offset=0):(o.texImage2D(o.TEXTURE_2D,0,o.R8,e,t,0,o.RED,o.UNSIGNED_BYTE,null),a.scala=64,a.offset=-8),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindFramebuffer(o.FRAMEBUFFER,a.fbo),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,a.tex,0),o.checkFramebufferStatus(o.FRAMEBUFFER)!==o.FRAMEBUFFER_COMPLETE&&a.mezzoFloat)return this._ombreMezzo=!1,o.bindFramebuffer(o.FRAMEBUFFER,null),this._preparaOmbre(e,t);if(o.bindFramebuffer(o.FRAMEBUFFER,null),a.w=e,a.h=t,a.sporco=[0,0,e,t],!this.programmaOmbre){this.programmaOmbre=oo(o,`#version 300 es
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
}`),this.uOmbre={};for(let n of["uAltezze","uAltRett","uSole","uCodifica"])this.uOmbre[n]=o.getUniformLocation(this.programmaOmbre,n);this.vaoOmbre=o.createVertexArray()}}_calcolaOmbre(){let e=this.gl,t=this.ombre,o=this.sole;if(!this.altezze||!t.tex||(o.verso[0]*t.sole[0]+o.verso[1]*t.sole[1]+o.verso[2]*t.sole[2]<.99996&&(t.sole=o.verso.slice(),t.sporco=[0,0,t.w,t.h]),!t.sporco))return;let n=96,[r,s,f,l]=t.sporco;if(f<=r||l<=s){t.sporco=null;return}let u=Math.min(l,s+n);t.sporco=u>=l?null:[r,u,f,l];let h=Math.hypot(o.verso[0],o.verso[2])||1e-4,m=[-o.verso[0]/h,-o.verso[2]/h],c=Math.max(.05,-o.verso[1]/h);e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.viewport(0,0,t.w,t.h),e.enable(e.SCISSOR_TEST),e.scissor(r,s,f-r,u-s),e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE),e.useProgram(this.programmaOmbre),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(this.uOmbre.uAltezze,0),e.uniform4f(this.uOmbre.uAltRett,0,0,1/t.w,1/t.h),e.uniform3f(this.uOmbre.uSole,m[0],m[1],c),e.uniform2f(this.uOmbre.uCodifica,t.scala,t.offset),e.bindVertexArray(this.vaoOmbre),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.disable(e.SCISSOR_TEST),e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),t.calcoli++,this.statistiche.calcoliOmbre=t.calcoli}_disegnaCielo(e,t){let o=this.gl,a=this.uc,n=this.sole;if(this.cieloNero||!Oe(e,this._invVP))return;o.useProgram(this.programmaCielo),o.uniformMatrix4fv(a.uInvVP,!1,this._invVP),o.uniform3f(a.uOcchio,t[0],t[1],t[2]),o.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),o.uniform1f(a.uSoleForza,n.forza),o.uniform3f(a.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;o.uniform3f(a.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),o.disable(o.DEPTH_TEST),o.depthMask(!1),o.disable(o.CULL_FACE),o.bindVertexArray(this.vaoVuoto),o.drawArrays(o.TRIANGLES,0,3),o.bindVertexArray(null),o.enable(o.CULL_FACE),o.depthMask(!0),o.enable(o.DEPTH_TEST)}_preparaMappa(){let e=this.gl,t=this.mappa,o=a=>{let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,a,a,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_FUNC,e.LEQUAL);let r=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,n,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);let s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:n,fbo:r,lato:a,ok:s}};t.stat=o(t.lato),t.din=o(t.latoDin),(!t.stat.ok||!t.din.ok)&&(t.attiva=!1)}legaMappa(e){let t=this.gl,o=this.mappa;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,o.stat.tex),t.uniform1i(e.uMappaStat,1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,o.din.tex),t.uniform1i(e.uMappaDin,2),t.activeTexture(t.TEXTURE0),t.uniform1f(e.uMappaOn,o.on?1:0),t.uniformMatrix4fv(e.uLuceVP,!1,o.vp),t.uniformMatrix4fv(e.uLuceVPDin,!1,o.vpDin),t.uniform2f(e.uMappaTexel,.5/o.lato,.5/o.latoDin),t.uniform2f(e.uMappaSbieco,1.5*(2*o.raggio/o.lato),.1/220),t.uniform4fv(e.uLampade,this.lampade),t.uniform1i(e.uNLampade,this.nLampade),t.uniform3f(e.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(e.uAltezze,3),t.activeTexture(t.TEXTURE0))}_aggiornaMappa(e,t){let o=this.gl,a=this.mappa,n=this.sole,r=this.statistiche;if(a.on=!1,!a.attiva||!this.ombra)return;let s=typeof performance<"u"?performance.now():0,f=e.centro[0],l=e.centro[2],u=!1;Math.hypot(f-a.centro[0],l-a.centro[2])>10&&(a.centro=[Math.round(f/2)*2,Math.round(e.centro[1]),Math.round(l/2)*2],u=!0);{let p=n.verso,g=e.centro,E=[g[0]-p[0]*120,g[1]-p[1]*120,g[2]-p[2]*120],b=Math.abs(p[1])>.95?[0,0,1]:[0,1,0];Po(ce(a.raggioDin,10,230),Go(E,g,b),a.vpDin)}n.verso[0]*a.sole[0]+n.verso[1]*a.sole[1]+n.verso[2]*a.sole[2]<.99985&&(a.soleMosso=!0);let m=a.sporca||a.soleMosso||t&&t.mappaSporca,c=u||m&&s-(a.ultimo||0)>=500;if(c){a.sole=n.verso.slice(),a.soleMosso=!1,a.ultimo=s;let p=n.verso,g=a.centro,E=[g[0]-p[0]*120,g[1]-p[1]*120,g[2]-p[2]*120],b=Math.abs(p[1])>.95?[0,0,1]:[0,1,0];Po(ce(a.raggio,10,230),Go(E,g,b),a.vp)}if(o.enable(o.POLYGON_OFFSET_FILL),o.polygonOffset(1.5,4),c){o.bindFramebuffer(o.FRAMEBUFFER,a.stat.fbo),o.viewport(0,0,a.stat.lato,a.stat.lato),o.clear(o.DEPTH_BUFFER_BIT),o.useProgram(this.programmaOmbra),o.uniformMatrix4fv(this.uo.uVP,!1,a.vp);let p=0,g=0,E=a.raggio+12;for(let b of this.chunks.values())b.quad!==0&&(Math.hypot(b.x0+8-a.centro[0],b.z0+8-a.centro[2])>E||(o.uniform3f(this.uo.uChunk,b.chunk[0],b.chunk[1],b.chunk[2]),o.bindVertexArray(b.vao),o.drawElements(o.TRIANGLES,b.quad*6,o.UNSIGNED_SHORT,0),p++,g+=b.quad*2));if(o.bindVertexArray(null),t){let[b,R]=t.disegnaOmbra(a.vp,!1);p+=b,g+=R,t.mappaSporca=!1}a.sporca=!1,a.calcoli++,a.disegni=p,a.triangoli=g}o.bindFramebuffer(o.FRAMEBUFFER,a.din.fbo),o.viewport(0,0,a.din.lato,a.din.lato),o.clear(o.DEPTH_BUFFER_BIT);let d=0,v=0;t&&([d,v]=t.disegnaOmbra(a.vpDin,!0)),o.disable(o.POLYGON_OFFSET_FILL),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),a.on=!0,r.calcoliMappa=a.calcoli,r.disegniOmbra=d+(c?a.disegni:0),r.triangoliOmbra=v+(c?a.triangoli:0)}impostaAltezze(e,t,o,a,n,r=null){let s=this.gl;this.altezze||(this.altezze=s.createTexture()),s.bindTexture(s.TEXTURE_2D,this.altezze),s.pixelStorei(s.UNPACK_ALIGNMENT,1);let f=new Uint8Array(a*n*2);for(let l=0;l<a*n;l++)f[l*2]=e[l],f[l*2+1]=r?r[l]:e[l];s.texImage2D(s.TEXTURE_2D,0,s.RG8,a,n,0,s.RG,s.UNSIGNED_BYTE,f),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.altRett=[t,o,1/a,1/n],this._preparaOmbre(a,n)}impostaMaterie(e){let t=new Float32Array(64);for(let o=0;o<16&&o<e.length;o++)for(let a=0;a<4;a++)t[o*4+a]=e[o][a]||0;this.materie=t}disegna(e,t,o=null){let a=this.gl,n=this.statistiche;this.tempo+=t;let r=Ce(e.fov,e.rapporto,.3,400),s=Go(e.occhio,e.centro);Po(r,s,this.vp),ue(this.vp,this.piani),this._camera=e,this._visibili.length=0,this._visibiliErba.length=0;let f=0;for(let c of this.chunks.values())c.quad===0&&c.quadAcqua===0||(c.visto=this.tutto||fe(this.piani,c.x0,c.y0+c.minY,c.z0,c.x0+16,c.y0+c.maxY+1,c.z0+16),c.visto&&(f++,c.quadAcqua>0&&this._visibili.push(c),c.verticiErba>0&&Math.hypot(c.x0+8-e.occhio[0],c.z0+8-e.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(c)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(e,o),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(e,o),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,e.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[l,u]=this._solidi(this.vp,this.piani,e.occhio,!1),h=0,m=0;if(this._visibiliErba.length){let c=this.ue,d=this.sole;a.useProgram(this.programmaErba),a.uniformMatrix4fv(c.uVP,!1,this.vp),a.uniform1f(c.uTempo,this.tempo),a.uniform3f(c.uSoleVerso,d.verso[0],d.verso[1],d.verso[2]),a.uniform3f(c.uSoleCol,d.colore[0],d.colore[1],d.colore[2]),a.uniform1f(c.uSoleForza,d.forza),a.uniform3f(c.uCieloCol,d.cielo[0],d.cielo[1],d.cielo[2]),a.uniform2f(c.uNebbia,this.nebbia.da,this.nebbia.a),a.uniform3f(c.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),a.uniform3f(c.uCam,e.occhio[0],e.occhio[1],e.occhio[2]),a.uniform2f(c.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),a.uniform1f(c.uOmbra,this.ombra&&this.altezze?1:0),a.uniform1f(c.uTaglio,-1e9),a.uniform1f(c.uErbaFinoA,this.erbaFinoA),a.uniform4f(c.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),a.uniform3f(c.uOcchio,e.occhio[0],e.occhio[1],e.occhio[2]),this.altezze&&(a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.ombre.tex),a.uniform1i(c.uOmbre,0),a.uniform2f(c.uOmbreScala,this.ombre.scala,this.ombre.offset),a.uniform4f(c.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(c),a.disable(a.CULL_FACE);for(let v of this._visibiliErba)a.uniform3f(c.uChunk,v.chunk[0],v.yBaseErba,v.chunk[2]),a.bindVertexArray(v.vaoErba),a.drawArraysInstanced(a.TRIANGLES,0,6,v.lamelle),h++,m+=v.lamelle*2;a.enable(a.CULL_FACE),a.bindVertexArray(null)}n.disegni=l,n.triangoli=u,n.chunkVisti=f,n.chunkTotali=this.chunks.size,n.disegniErba=h,n.triangoliErba=m}_solidi(e,t,o,a){let n=this.gl,r=this.u,s=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,e),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,s.verso[0],s.verso[1],s.verso[2]),n.uniform3f(r.uSoleCol,s.colore[0],s.colore[1],s.colore[2]),n.uniform1f(r.uSoleForza,s.forza),n.uniform3f(r.uCieloCol,s.cielo[0],s.cielo[1],s.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,o[0],o[1],o[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let f=a?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,f[0],f[1],f[2],f[3]),n.uniform3f(r.uOcchio,o[0],o[1],o[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let l=0,u=0;for(let h of this.chunks.values())if(h.quad!==0){if(a){if(!this.tutto&&!fe(t,h.x0,h.y0+h.minY,h.z0,h.x0+16,h.y0+h.maxY+1,h.z0+16))continue}else if(!h.visto)continue;n.uniform3f(r.uChunk,h.chunk[0],h.chunk[1],h.chunk[2]),n.bindVertexArray(h.vao),n.drawElements(n.TRIANGLES,h.quad*6,n.UNSIGNED_SHORT,0),l++,u+=h.quad*2}return n.bindVertexArray(null),[l,u]}_peloVicino(e){let t=this._voti;t.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-e[0],n.z0+8-e[2])+2.2*Math.abs(n.peloAcqua-e[1]);t.set(n.peloAcqua,(t.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let o=null,a=0;for(let[n,r]of t)r>a&&(a=r,o=n);return o}_specchia(e,t){let o=this.gl,a=this.specchio,n=this.statistiche,r=this._peloVicino(e.occhio);if(r==null||e.occhio[1]<=r+.2)return;let s=Math.max(1,Math.round(o.drawingBufferWidth*a.scala)),f=Math.max(1,Math.round(o.drawingBufferHeight*a.scala));(!a.fbo||a.w!==s||a.h!==f)&&this._preparaSpecchio(s,f);let l=this._riflessione;l.fill(0),l[0]=1,l[5]=-1,l[10]=1,l[13]=2*r,l[15]=1,Po(this.vp,l,this.vpSpecchio),ue(this.vpSpecchio,this.pianiSpecchio);let u=[e.occhio[0],2*r-e.occhio[1],e.occhio[2]];o.bindFramebuffer(o.FRAMEBUFFER,a.fbo),o.viewport(0,0,s,f),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),o.cullFace(o.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[h,m]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);n.disegniSpecchio=h,n.triangoliSpecchio=m,t&&(t.disegna(this,{occhio:u,centro:e.centro,fov:e.fov,rapporto:e.rapporto}),n.disegniSpecchio+=t.statistiche.disegni,n.triangoliSpecchio+=t.statistiche.triangoli),o.cullFace(o.BACK),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),this.taglio=-1e9,a.pelo=r,n.pelo=r}_mostraSpecchio(){let e=this.gl,t=this.specchio;this.programmaQuad||(this.programmaQuad=oo(e,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=e.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=e.createVertexArray()),e.useProgram(this.programmaQuad),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.tex),e.uniform1i(this.uQuad,0),e.bindVertexArray(this.vaoQuad),e.disable(e.DEPTH_TEST),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.enable(e.DEPTH_TEST),e.bindVertexArray(null)}_preparaSpecchio(e,t){let o=this.gl,a=this.specchio;a.fbo||(a.fbo=o.createFramebuffer(),a.tex=o.createTexture(),a.rbo=o.createRenderbuffer()),o.bindTexture(o.TEXTURE_2D,a.tex),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,e,t,0,o.RGBA,o.UNSIGNED_BYTE,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindRenderbuffer(o.RENDERBUFFER,a.rbo),o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_COMPONENT16,e,t),o.bindFramebuffer(o.FRAMEBUFFER,a.fbo),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,a.tex,0),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,a.rbo),o.checkFramebufferStatus(o.FRAMEBUFFER)!==o.FRAMEBUFFER_COMPLETE&&(a.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindTexture(o.TEXTURE_2D,null),a.w=e,a.h=t}disegnaAcqua(){let e=this.gl,t=this.ua,o=this.sole,a=this._camera,n=this.specchio;if(!a||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}e.useProgram(this.programmaAcqua),e.uniformMatrix4fv(t.uVP,!1,this.vp),e.uniform1f(t.uTempo,this.tempo),e.uniform3f(t.uCam,a.occhio[0],a.occhio[1],a.occhio[2]),e.uniform2f(t.uNebbia,this.nebbia.da,this.nebbia.a),e.uniform3f(t.uSoleVerso,o.verso[0],o.verso[1],o.verso[2]),e.uniform3f(t.uSoleCol,o.colore[0],o.colore[1],o.colore[2]),e.uniform1f(t.uSoleForza,o.forza),e.uniform3f(t.uCieloCol,o.cielo[0],o.cielo[1],o.cielo[2]),e.uniform3f(t.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,r?n.tex:null),e.uniform1i(t.uSpecchio,1),e.uniform3f(t.uSchermo,1/e.drawingBufferWidth,1/e.drawingBufferHeight,r?1:0),e.uniform1f(t.uMare,this.mare),e.uniform4fv(t.uGalleggianti,this.galleggianti),e.uniform1i(t.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(t.uAltezze,2),e.uniform4f(t.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):e.uniform4f(t.uAltRett,0,0,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.depthMask(!1),e.disable(e.CULL_FACE);let s=0,f=0;for(let l of this._visibili)e.uniform3f(t.uChunk,l.chunk[0],l.chunk[1],l.chunk[2]),e.bindVertexArray(l.vaoAcqua),e.drawElements(e.TRIANGLES,l.quadAcqua*6,e.UNSIGNED_SHORT,0),s++,f+=l.quadAcqua*2;e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),e.activeTexture(e.TEXTURE0),this.statistiche.disegniAcqua=s,this.statistiche.triangoliAcqua=f,n.mostra&&r&&this._mostraSpecchio()}};var pe=class extends To{vertice(e,t,o,a,n,r,s,f=0,l=0){super.vertice(e,t,o,Se[a],n,r,s,f,l)}},ao={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},$o=[0,6072381,8739896,14403468,9211013,5086771,6043679,2714414,16767347],Va=1;function me(i,e){let t=o=>Math.max(0,Math.min(255,Math.round(o*e)));return t(i>>16&255)<<16|t(i>>8&255)<<8|t(i&255)}function fo(i,e,t){let o=i*374761393+e*668265263+t*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function he(i,e,t,o){let a=i/t,n=e/t,r=Math.floor(a),s=Math.floor(n),f=a-r,l=n-s,u=f*f*(3-2*f),h=l*l*(3-2*l),m=fo(r,s,o),c=fo(r+1,s,o),d=fo(r,s+1,o),v=fo(r+1,s+1,o);return m+(c-m)*u+(d+(v-d)*u-(m+(c-m)*u))*h}function Co(i,e,t=7){let o=he(i,e,48,t)*14+he(i,e,17,t+1)*5+he(i,e,6,t+2)*1.5;return 8+Math.floor(o)}function Fe(i){return i<11?ao.sabbia:i>24?ao.roccia:ao.erba}function Ie(i,e,t=7){let o=[];for(let a=0;a<2;a++){if(fo(i*3+a,e*5-a,t+9)<.35)continue;let r=i*16+Math.floor(fo(i,e,t+11+a)*15)+.5,s=e*16+Math.floor(fo(e,i,t+13+a)*15)+.5,f=Co(Math.floor(r),Math.floor(s),t);Fe(f)===ao.erba&&o.push({x:r,y:f+3,z:s})}return o}function ye(i,e,t,o){let a=0;for(let n of o){let s=15-Math.sqrt((i-n.x)**2+(e-n.y)**2+(t-n.z)**2);s>a&&(a=s)}return Math.max(0,Math.min(15,Math.round(a)))}function Ne(i,e,{seme:t=7,erba:o=2,raggioLampade:a=2}={}){let n=new pe(1600),r=i*16,s=e*16,f=255,l=0,u=[];for(let m=-a;m<=a;m++)for(let c=-a;c<=a;c++)u.push(...Ie(i+m,e+c,t));for(let m=0;m<16;m++)for(let c=0;c<16;c++){let d=r+m,v=s+c,p=Co(d,v,t);p<f&&(f=p),p+1>l&&(l=p+1);let g=Fe(p),E=.94+.12*fo(d,v,t+3),b=ye(d+.5,p+1,v+.5,u),R=me($o[g],E);n.quadDa([m,p+1,c,2,15,b,R],[m,p+1,c+1,2,15,b,R],[m+1,p+1,c+1,2,15,b,R],[m+1,p+1,c,2,15,b,R]);let S=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[_,C,M]of S){let z=Co(d+_,v+C,t);for(let x=z+1;x<=p;x++){let T=Math.max(6,15-(p-x)*2),B=x===p&&g===ao.erba?ao.erba:p>24?ao.roccia:ao.terra,O=ye(d+.5+_*.5,x+.5,v+.5+C*.5,u),L=x,V=x+1,D=me($o[B],E);_===1?n.quadDa([m+1,L,c,M,T,O,D],[m+1,V,c,M,T,O,D],[m+1,V,c+1,M,T,O,D],[m+1,L,c+1,M,T,O,D]):_===-1?n.quadDa([m,L,c+1,M,T,O,D],[m,V,c+1,M,T,O,D],[m,V,c,M,T,O,D],[m,L,c,M,T,O,D]):C===1?n.quadDa([m+1,L,c+1,M,T,O,D],[m+1,V,c+1,M,T,O,D],[m,V,c+1,M,T,O,D],[m,L,c+1,M,T,O,D]):n.quadDa([m,L,c,M,T,O,D],[m,V,c,M,T,O,D],[m+1,V,c,M,T,O,D],[m+1,L,c,M,T,O,D]),x<f&&(f=x)}}if(g===ao.erba)for(let _=0;_<o;_++){if(fo(d,v,t+20+_)<.25)continue;let M=1,z=m,x=c,T=me($o[ao.filo],.94+.12*fo(d,v,t+30+_));n.quadDa([z,p+1,x,2,15,b,T],[z,p+1+M,x,2,15,b,T,1],[z+1,p+1+M,x+1,2,15,b,T,1],[z+1,p+1,x+1,2,15,b,T]),n.quadDa([z+1,p+1,x,2,15,b,T],[z+1,p+1+M,x,2,15,b,T,1],[z,p+1+M,x+1,2,15,b,T,1],[z,p+1,x+1,2,15,b,T]),p+2>l&&(l=p+2)}}for(let m of Ie(i,e,t)){let c=Math.floor(m.x)-r,d=Math.floor(m.z)-s,v=m.y-3;for(let p=v+1;p<=m.y;p++){let g=p===m.y?ao.lampada:ao.tronco,E=p===m.y?15:12,b=$o[g],R=p===m.y?Va:0,S=c+.5-.15,_=c+.5+.15,C=Math.floor(S),M=Math.min(16,Math.floor(S)+1),z=d,x=d+1;n.quadDa([M,p,z,0,12,E,b,0,R],[M,p+1,z,0,12,E,b,0,R],[M,p+1,x,0,12,E,b,0,R],[M,p,x,0,12,E,b,0,R]),n.quadDa([C,p,x,1,12,E,b,0,R],[C,p+1,x,1,12,E,b,0,R],[C,p+1,z,1,12,E,b,0,R],[C,p,z,1,12,E,b,0,R]),n.quadDa([M,p,x,4,12,E,b,0,R],[M,p+1,x,4,12,E,b,0,R],[C,p+1,x,4,12,E,b,0,R],[C,p,x,4,12,E,b,0,R]),n.quadDa([C,p,z,5,12,E,b,0,R],[C,p+1,z,5,12,E,b,0,R],[M,p+1,z,5,12,E,b,0,R],[M,p,z,5,12,E,b,0,R]),p===m.y&&n.quadDa([C,p+1,z,2,15,E,b,0,R],[C,p+1,x,2,15,E,b,0,R],[M,p+1,x,2,15,E,b,0,R],[M,p+1,z,2,15,E,b,0,R]),p+1>l&&(l=p+1)}}return{...n.dati(),minY:f,maxY:l,cx:i,cz:e}}var Pe={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},qe=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],Ho={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};qe.push(Ho);var ka={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};qe.push(ka);function De(i,e,t=Ho){Pe[i]=e,t.blocchi.includes(i)||t.blocchi.push(i)}var Ga={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"};function W(i){return Pe[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||Ga}function Ue(i){let e=i.indexOf("~");return e<0?i:i.slice(0,e)}function we(i){if(!i||!i.startsWith("acqua"))return null;let e=i.indexOf("~");return e<0?0:Number(i.slice(e+1))}var I=16,Xa=256,jo=2048,Be=64,to=(i,e,t)=>((i+jo)*4096+(t+jo))*256+(e+Be),Oo=i=>Math.floor(i/(256*4096))-jo,Lo=i=>Math.floor(i/256)%4096-jo,Io=i=>i%256-Be;var go=(i,e)=>Math.floor(i/I)+","+Math.floor(e/I),Ko=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(e){this.generati.add(e)}_annotaModifica(e,t,o,a){if(!this.frontiera)return;let n=go(e,o),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(to(e,t,o),a)}applicaModifiche(e){let t=this.modifiche.get(e);if(!t)return 0;for(let[o,a]of t){let n=Oo(o),r=Io(o),s=Lo(o);a===null?this.togli(n,r,s,!0):this.metti(n,r,s,a,!0)}return t.size}scaricaChunk(e){let t=this.chunks.get(e);if(!t)return this.generati.delete(e),[];let o=[];for(let[a,n]of t){let r=W(n);r&&r.forma==="modello"&&o.push([Oo(a),Io(a),Lo(a),n])}return this.contaBlocchi-=t.size,this.chunks.delete(e),this._scordaMemo(),this.generati.delete(e),this._tocca(e,this.sporchi),o}_cambiata(e,t,o){if(this.cambiate.length>=3*Xa){this.troppiCambi=!0;return}this.cambiate.push(e,t,o)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(e,t){let o=Math.floor(e/I),a=Math.floor(t/I);if(this._memoChunk!==null&&this._memoCx===o&&this._memoCz===a)return this._memoChunk;let n=this.chunks.get(o+","+a)||null;return this._memoCx=o,this._memoCz=a,this._memoChunk=n,n}tipo(e,t,o){let a=this._chunkDi(e,o);return a&&a.get(to(e,t,o))||null}pieno(e,t,o){return this.tipo(e,t,o)!==null}solido(e,t,o){let a=this.tipo(e,t,o);if(a&&W(a).solido)return!0;let n=this.furni.get(to(e,t,o));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(e,t,o){if(!this.solido(e,t-1,o)||this.solido(e,t,o)||this.solido(e,t+1,o))return!1;let a=this.tipo(e,t,o);return!(a&&W(a).acqua)}_sporca(e,t,o=this.sporchi){let a=(e%I+I)%I,n=(t%I+I)%I;this._tocca(go(e,t),o),a===0&&this._tocca(go(e-1,t),o),a===I-1&&this._tocca(go(e+1,t),o),n===0&&this._tocca(go(e,t-1),o),n===I-1&&this._tocca(go(e,t+1),o)}_tocca(e,t){t.add(e),this._rev.set(e,(this._rev.get(e)||0)+1)}revisione(e){return this._rev.get(e)||0}metti(e,t,o,a,n=!1){let r=go(e,o),s=this.chunks.get(r);s||(s=new Map,this.chunks.set(r,s),this._scordaMemo());let f=to(e,t,o),l=s.get(f);l===void 0&&this.contaBlocchi++,s.set(f,a);let u=a.charCodeAt(0)===97&&a.startsWith("acqua")&&(l===void 0||l.startsWith("acqua"));this._sporca(e,o,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(e,t,o),n||(this._annotaModifica(e,t,o,a),this.onEvento&&this.onEvento({tipo:"metti",cella:[e,t,o],blocco:a}))}togli(e,t,o,a=!1){let n=go(e,o),r=this.chunks.get(n);if(!r)return!1;let s=to(e,t,o),f=r.get(s);if(!r.delete(s))return!1;this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let l=!!(f&&f.startsWith("acqua"));return this._sporca(e,o,l?this.sporchiAcqua:this.sporchi),l||this._cambiata(e,t,o),a||(this._annotaModifica(e,t,o,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[e,t,o]})),!0}occupaFurni(e,t){for(let[o,a,n]of e)this.furni.set(to(o,a,n),t)}liberaFurni(e){for(let[t,o,a]of e)this.furni.delete(to(t,o,a))}furniIn(e,t,o){return this.furni.get(to(e,t,o))||null}occupaOmbra(e,t=!1){for(let[o,a,n]of e){let r=to(o,a,n),s=this.ombreFurni.get(r);if(s){s.n++,t&&s.op++===0&&this._cambiata(o,a,n);continue}this.ombreFurni.set(r,{x:o,y:a,z:n,n:1,op:t?1:0}),this._cambiata(o,a,n)}}liberaOmbra(e,t=!1){for(let[o,a,n]of e){let r=to(o,a,n),s=this.ombreFurni.get(r);s&&(t&&s.op>0&&--s.op===0&&s.n>1&&this._cambiata(o,a,n),!(--s.n>0)&&(this.ombreFurni.delete(r),this._cambiata(o,a,n)))}}ombraFurniIn(e,t,o){let a=this.ombreFurni.get(to(e,t,o));return a?a.op>0?2:1:0}appoggioInColonna(e,t,o,a=8){for(let n=o;n>o-a;n--)if(this.calpestabile(e,n,t))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let e of this._rev.keys())this._rev.set(e,this._rev.get(e)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let e of this.chunks.values())for(let[t,o]of e)yield{x:Oo(t),y:Io(t),z:Lo(t),tipo:o}}perOgni(e){for(let t of this.chunks.values())for(let[o,a]of t)e(Oo(o),Io(o),Lo(o),a)}*blocchiDelChunk(e){let t=this.chunks.get(e);if(t)for(let[o,a]of t)yield{x:Oo(o),y:Io(o),z:Lo(o),tipo:a}}perOgniDelChunk(e,t){let o=this.chunks.get(e);if(o)for(let[a,n]of o)t(Oo(a),Io(a),Lo(a),n)}};var Ya={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},qo="primavera";var Zo=null;function Wo(i,e,t){let o=i>>16&255,a=i>>8&255,n=i&255,r=e>>16&255,s=e>>8&255,f=e&255,l=(u,h)=>Math.round(u+(h-u)*t);return l(o,r)<<16|l(a,s)<<8|l(n,f)}function Ve(i,e){if(Zo){let t=qo;qo=Zo.da;let o=de(i,e);qo=Zo.a;let a=de(i,e);qo=t;let n=Zo.mix;return{cima:Qo(o.cima,a.cima,n),lato:Qo(o.lato,a.lato,n),fondo:Qo(o.fondo,a.fondo,n),facce:o.facce,orlo:o.orlo!=null&&a.orlo!=null?Qo(o.orlo,a.orlo,n):o.orlo}}return de(i,e)}function Qo(i,e,t){let o=Math.round((i>>16&255)+((e>>16&255)-(i>>16&255))*t),a=Math.round((i>>8&255)+((e>>8&255)-(i>>8&255))*t),n=Math.round((i&255)+((e&255)-(i&255))*t);return o<<16|a<<8|n}function de(i,e){let t=W(i),o=Ya[qo],{cima:a,lato:n,fondo:r}=t;if(t.cappello&&o.erba&&!t.override&&(a=o.erba[ve(e,o.erba.length)]),t.reagisce==="stagione"&&o.erba){let s=o.erba[ve(e,o.erba.length)],f=t.reagisceForza??1;a=Wo(a,s,f),n=Wo(n,s,f*.45),r=Wo(r,s,f*.3)}else if(t.reagisce==="quota"){let s=ve(e,8)/7,f=(t.reagisceForza??1)*.5,l=u=>Wo(u,16777215,s*f);a=l(a),n=l(n),r=l(r)}return i==="sabbia"&&o.sabbia&&({cima:a,lato:n,fondo:r}=o.sabbia),{cima:a,lato:n,fondo:r,facce:t.facce||null,orlo:t.orlo!=null?t.orlo:void 0}}function po(i,e,t){if(i.facce){let o=e*2+(t>0?0:1),a=i.facce[o];if(a!=null)return a}return e===1?t>0?i.cima:i.fondo:i.lato}function ve(i,e=8){let t=(e-1)*2,o=(Math.round(i)%t+t)%t;return o>=e&&(o=t-o),o}function be(i,e,t){let o=(i|0)*374761393+(e|0)*668265263+(t|0)*2147483647;return o=(o^o>>>13)*1274126177,o=o^o>>>16,(o>>>0)%1e3/1e3}function $a(i,e){let t=i>>16&255,o=i>>8&255,a=i&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+e))));return n(t)<<16|n(o)<<8|n(a)}function Ha(i,e,t,o,a,n){if(!e||e==="liscio"||!t)return i;let r=0;return e==="chiazze"?r=(be(o,a,n)-.5)*2:e==="venature"?r=(be(0,a,0)-.5)*2*.7+(be(o,a,n)-.5)*.3:e==="sfumato"&&(r=(a%16+16)%16/16-.5),$a(i,r*t*.34)}function ke(i,e,t,o,a,n){if(!e||e==="liscio"||!t)return i;let r=s=>Ha(s,e,t,o,a,n);return{cima:r(i.cima),lato:r(i.lato),fondo:r(i.fondo),facce:i.facce?i.facce.map(r):null}}var Ge={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},ja=Object.keys(Ge);function Xe(i){return!i||!i.materia?null:Ge[i.materia]||null}function xo(i,e,t=0){if(!e)return i;let o=(i>>16&255)/255,a=(i>>8&255)/255,n=(i&255)/255,r=.2126*o+.7152*a+.0722*n,s=e.satura;o=r+(o-r)*s,a=r+(a-r)*s,n=r+(n-r)*s;let f=e.tinta*(1+t),l=u=>Math.max(0,Math.min(255,Math.round(u*f*255)));return l(o)<<16|l(a)<<8|l(n)}var Ka=16;function Ye(i){let e=ja.indexOf(i);return e<0||e+1>=Ka?0:e+1}var ge=1/16,$e=8*ge,io=9*ge;function He(i,e,t,o,a,n,r,s){let f=(u,h,m)=>[e+u,t+h,o+m];i.quad(f(-s,r,-s),f(s,r,-s),f(s,r,s),f(-s,r,s),po(a,1,1),[0,1,0]),i.quad(f(-s,n,-s),f(s,n,-s),f(s,n,s),f(-s,n,s),po(a,1,-1),[0,-1,0]);let l=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of l){let[h,,m]=u.d,c=-m,d=h,v=(p,g)=>f(h*s+c*g,p,m*s+d*g);i.quad(v(n,-s),v(r,-s),v(r,s),v(n,s),po(a,u.asse,u.segno),u.d)}}function Za(i,e,t,o,a){He(i,e,t,o,a,-io,0,$e)}function Wa(i,e,t,o,a){He(i,e,t,o,a,-io,io,5*ge)}function Qa(i,e,t,o,a){let n=(l,u,h)=>[e+l,t+u,o+h],r=po(a,0,1),s=$e,f=[[[-s,-io,-s],[s,-io,s],[s,io,s],[-s,io,-s],[1,0,-1]],[[-s,-io,s],[s,-io,-s],[s,io,-s],[-s,io,s],[1,0,1]]];for(let[l,u,h,m,c]of f)i.quad(n(...l),n(...u),n(...h),n(...m),r,c),i.quad(n(...l),n(...u),n(...h),n(...m),r,[-c[0],-c[1],-c[2]])}function Ja(){}var je={lastra:Za,pilastro:Wa,croce:Qa,modello:Ja},Do=new Set(["lastra","pilastro","croce","modello"]);var Uo=1/16,ot=[[0,1],[0,2],[1,2]],et=[[1,0],[-1,0],[0,1],[0,-1]];function Eo(i,e,t,o,a,n,r,s,f){let l=[i,e,t];return l[o]+=a,l[n]+=r,l[s]+=f,l}var Ke={tinta:1,satura:1};function Ze(i,e,t,o,a,n,r=0){let s=8*Uo,f=9*Uo,l=(u,h)=>n(u===0?h:0,u===1?h:0,u===2?h:0);for(let u=0;u<3;u++)for(let h of[-1,1]){if(l(u,h))continue;let m=(u+1)%3,c=(u+2)%3,d=po(a,u,h),v=[0,0,0];v[u]=h,i.quad(Eo(e,t,o,u,h*f,m,-s,c,-s),Eo(e,t,o,u,h*f,m,+s,c,-s),Eo(e,t,o,u,h*f,m,+s,c,+s),Eo(e,t,o,u,h*f,m,-s,c,+s),d,v)}for(let[u,h]of ot){let m=3-u-h;for(let c of[-1,1])for(let d of[-1,1]){if(l(u,c)||l(h,d))continue;let v=u===1&&c>0||h===1&&d>0,p=u===1&&c<0||h===1&&d<0,g=v?a.cima:p?a.fondo:a.lato,E=r?xo(g,Ke,r):g,b=[0,0,0];b[u]=c,b[h]=d,i.quad(Eo(e,t,o,u,c*f,h,d*s,m,-s),Eo(e,t,o,u,c*s,h,d*f,m,-s),Eo(e,t,o,u,c*s,h,d*f,m,+s),Eo(e,t,o,u,c*f,h,d*s,m,+s),E,b)}}for(let u of[-1,1])for(let h of[-1,1])for(let m of[-1,1])l(0,u)||l(1,h)||l(2,m)||i.tri([e+u*f,t+h*s,o+m*s],[e+u*s,t+h*f,o+m*s],[e+u*s,t+h*s,o+m*f],r?xo(h>0?a.cima:a.fondo,Ke,r):h>0?a.cima:a.fondo,[u,h,m])}function We(i,e,t,o,a,n){let r=(c,d)=>n(c,0,d),s=n(0,-1,0),f=a.cima,l=a.lato,u=a.fondo,h=a.orlo??a.cima,m=(c,d,v)=>[e+c*Uo,t+d*Uo,o+v*Uo];s||i.quad(m(-8,-9,-8),m(8,-9,-8),m(8,-9,8),m(-8,-9,8),u,[0,-1,0]);for(let[c,d]of et){if(r(c,d))continue;let v=-d,p=c,g=(b,R,S)=>m(b*c+S*v,R,b*d+S*p),E=[c,0,d];s||i.quad(g(8,-9,-8),g(9,-8,-8),g(9,-8,8),g(8,-9,8),u,[c,-1,d]),i.quad(g(9,-8,-8),g(9,2,-8),g(9,2,8),g(9,-8,8),l,E),i.quad(g(9,2,-8),g(10,3,-8),g(10,3,8),g(9,2,8),h,E),i.quad(g(10,3,-8),g(10,7,-8),g(10,7,8),g(10,3,8),h,E),i.quad(g(10,7,-8),g(9,8,-8),g(9,8,8),g(10,7,8),f,[c,1,d]),i.quad(g(8,8,-8),g(9,8,-8),g(9,8,8),g(8,8,8),f,[0,1,0])}for(let c of[-1,1])for(let d of[-1,1]){if(r(c,0)||r(0,d))continue;let v=(g,E,b)=>m(g*c,E,b*d),p=[c,0,d];s||i.tri(v(9,-8,8),v(8,-9,8),v(8,-8,9),u,[c,-1,d]),i.quad(v(9,-8,8),v(8,-8,9),v(8,2,9),v(9,2,8),l,p),i.quad(v(9,2,8),v(8,2,9),v(8,3,10),v(10,3,8),h,p),i.quad(v(10,3,8),v(8,3,10),v(8,7,10),v(10,7,8),h,p),i.quad(v(10,7,8),v(8,7,10),v(8,8,9),v(9,8,8),f,[c,1,d]),i.tri(v(8,8,8),v(9,8,8),v(8,8,9),f,[0,1,0])}i.quad(m(-8,8,-8),m(8,8,-8),m(8,8,8),m(-8,8,8),f,[0,1,0])}var xe={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function Qe(){for(let[i,e]of Object.entries(xe))De(i,{nome:e.nome,cima:e.cima,lato:e.lato,fondo:e.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:e.modello},Ho)}var at=2,Ee=6,tt=256;function Je(i){if(!i)return!1;let e=W(i);return!e.acqua&&!e.vetro&&!Do.has(e.forma)}function ea(i,e,t,o){let a=e.indexOf(","),n=+e.slice(0,a),r=+e.slice(a+1),s=n*I-Ee,f=r*I-Ee,l=I+2*Ee,u=o-t+1,h=l,m=l*u*h,c=new Uint8Array(m),d=new Uint8Array(m),v=new Uint8Array(m),p=(S,_,C)=>((S-s)*u+(_-t))*h+(C-f),g=(S,_,C)=>S>=s&&S<s+l&&_>=t&&_<=o&&C>=f&&C<f+h,E=[];for(let S=s;S<s+l;S++)for(let _=f;_<f+h;_++){let C=!1;for(let M=o;M>=t;M--){let z=i.tipo(S,M,_),x=p(S,M,_);if(Je(z)){v[x]=1,C=!0;continue}if(!C&&M===o){for(let T=o+1;T<tt&&T<o+40;T++)if(Je(i.tipo(S,T,_))){C=!0;break}}if(C||(c[x]=15),z){let B=W(z).forma==="modello"&&xe[z];B&&B.luce&&E.push([S,M+Math.round(B.luce.quota??1),_])}}}let b=[];for(let S=0;S<m;S++)c[S]===15&&b.push(S);oa(b,c,v,l,u,h,1);let R=[];for(let[S,_,C]of E){if(!g(S,_,C))continue;let M=p(S,_,C);d[M]=15,R.push(M)}return oa(R,d,v,l,u,h,at),{x0:s,z0:f,yMin:t,yMax:o,W:l,H:u,D:h,cielo:c,blocco:d,leggi(S,_,C){if(!g(S,_,C))return _>o?[15,0]:[0,0];let M=p(S,_,C);return[c[M],d[M]]}}}function oa(i,e,t,o,a,n,r){let s=[a*n,-a*n,n,-n,1,-1],f=0;for(;f<i.length;){let l=i[f++],u=e[l]-r;if(u<=0)continue;let h=Math.floor(l/(a*n)),m=Math.floor(l/n)%a,c=l%n;for(let d=0;d<6;d++){if(d===0&&h===o-1||d===1&&h===0||d===2&&m===a-1||d===3&&m===0||d===4&&c===n-1||d===5&&c===0)continue;let v=l+s[d];t[v]||e[v]>=u||(e[v]=u,i.push(v))}}}var aa=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function mo(i,e,t){let o=i*374761393+e*668265263+t*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}var Jo=class{constructor(e,t=512){this.yBase=e,this.byte=new Uint8Array(t*12),this.n=0}_lamella(e,t,o,a,n,r,s,f,l,u=0,h=8){if((this.n+1)*12>this.byte.length){let d=new Uint8Array(this.byte.length*2);d.set(this.byte),this.byte=d}let m=this.n*12,c=this.byte;c[m]=e,c[m+1]=t,c[m+2]=o,c[m+3]=a,c[m+4]=n>>16&255,c[m+5]=n>>8&255,c[m+6]=n&255,c[m+7]=(r&15)<<2,c[m+8]=Math.max(1,Math.min(255,s)),c[m+9]=Math.max(1,Math.min(255,f)),c[m+10]=Math.max(0,Math.min(255,l+128)),c[m+11]=u&15|(h&15)<<4,this.n++}ciuffo(e,t,o,a,n,r,s,f=1,l=0){let u=aa[Math.floor(mo(e,o,3)*aa.length)],h=Math.max(1,Math.round(u.n*f*(.82+.36*mo(e,o,5)))),m=t+1-this.yBase;if(m<0||m*8>247)return 0;for(let c=0;c<h;c++){let d=mo(e,o,c*17+5),v=mo(e,o,c*17+11),p=mo(e,o,c*17+41),g=mo(e,o,c*17+59),E=Math.min(.98,.66+u.apri),b=e+.5+(d-.5)*E,R=o+.5+(v-.5)*E,S=Math.min(.8,u.alto*(.62+.8*mo(e,o,c*17+71))*(.5+.6*Math.pow(p,1.5))),_=u.largo*(.8+.4*g),C=(mo(e,o,c*17+83)-.5)*.5,M=mo(e,o,c*17+89),z=M<.15?.9+.03*M:M>.85?1.07+.03*(M-.85):.97+.06*(M-.15)/.7,x=Math.max(0,Math.min(128,Math.round((b-a)*8))),T=Math.max(0,Math.min(128,Math.round((R-n)*8))),B=Math.floor(mo(e,o,c*17+97)*255);this._lamella(x,T,Math.round(m*8),B,r,s,Math.round(S*64),Math.round(_*128),Math.round(C*128),l,Math.round((z-.9)/.2*15))}return h}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var Ao=64,it=[[1,0,0,Z(1,0,0),0,1],[-1,0,0,Z(-1,0,0),0,-1],[0,1,0,Z(0,1,0),1,1],[0,-1,0,Z(0,-1,0),1,-1],[0,0,1,Z(0,0,1),2,1],[0,0,-1,Z(0,0,-1),2,-1]],ta=(i,e,t)=>((e+1)*3+(t+1))*3+(i+1),Ae=class{constructor(e,t,o,a,n){this.c=e,this.ox=t,this.oz=o,this._materia=0,this.luceDi=a,this.aria=n,this._cielo=15,this._cella=null}materia(e){this._materia=e|0}cella(e,t,o){this._cella=[e,t,o]}_cieloFaccia(e){let[t,o,a]=this._cella,n=-1;for(let r=0;r<3;r++){if(!e[r])continue;let s=this.luceDi(t+(r===0?e[0]:0),o+(r===1?e[1]:0),a+(r===2?e[2]:0))[0];s>n&&(n=s)}return n<0?this.luceDi(t,o+1,a)[0]:n}_bloccoVertice(e,t){let o=Math.hypot(t[0],t[1],t[2])||1,a=e[0]+t[0]/o*.5,n=e[1]+t[1]/o*.5,r=e[2]+t[2]/o*.5,s=0,f=0;for(let l of[-.45,.45])for(let u of[-.45,.45])for(let h of[-.45,.45]){let m=Math.floor(a+l),c=Math.floor(n+u),d=Math.floor(r+h);this.aria(m,c,d)&&(s+=this.luceDi(m,c,d)[1],f++)}return f?Math.round(s/f):0}_v(e,t,o,a){return[e[0]-this.ox,e[1]+Ao,e[2]-this.oz,t,this._cielo,this._bloccoVertice(e,a),o,0,this._materia]}_giro(e,t,o,a){let n=t[0]-e[0],r=t[1]-e[1],s=t[2]-e[2],f=o[0]-e[0],l=o[1]-e[1],u=o[2]-e[2],h=r*u-s*l,m=s*f-n*u,c=n*l-r*f;return h*a[0]+m*a[1]+c*a[2]<0}tri(e,t,o,a,n){if(this._giro(e,t,o,n)){let s=t;t=o,o=s}let r=Z(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(e,r,a,n),this._v(t,r,a,n),this._v(o,r,a,n),this._v(o,r,a,n))}quad(e,t,o,a,n,r){let s=Z(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(e,t,o,r)){let f=t;t=a,a=f}this.c.quadDa(this._v(e,s,n,r),this._v(t,s,n,r),this._v(o,s,n,r),this._v(a,s,n,r))}};function oe(i){if(!i)return!1;let e=W(i);return!e.acqua&&!e.vetro&&!Do.has(e.forma)}function wo(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function ia(i,e,{erba:t=2,luce:o=!0}={}){let a=e.indexOf(","),n=+e.slice(0,a),r=+e.slice(a+1),s=n*I,f=r*I,l=new To(1024),u=new To(64),h=-1/0,m=new Int16Array(I*I).fill(-1),c=new Int16Array(I*I).fill(-1),d=255,v=0,p=1/0,g=-1/0;i.perOgniDelChunk(e,(z,x)=>{x<p&&(p=x),x>g&&(g=x)});let E=o&&p<=g?ea(i,e,p-2,g+3):null,b=new Jo(Number.isFinite(p)?p:0),R=(z,x,T)=>E?E.leggi(z,x,T):[15,0],S=new Ae(l,s,f,R,(z,x,T)=>!oe(i.tipo(z,x,T))),_=new Uint8Array(27),C=(z,x,T,B,O,L,V,D)=>[z-s,x+Ao,T-f,B,L,V,O,D?1:0,0];return i.perOgniDelChunk(e,(z,x,T,B)=>{let O=W(B);if(O.forma==="modello"&&O.modello==="albero")for(let P=-2;P<=2;P++)for(let U=-2;U<=2;U++){let X=P*P+U*U;if(X>4)continue;let $=z+P-s,ro=T+U-f;if($<0||$>=I||ro<0||ro>=I)continue;let j=$*I+ro,k=x+(X===0?4:X<=2?3:2);k>m[j]&&(m[j]=k)}if(Do.has(O.forma))return;let L=wo(B),V=x+Ao;if(V<0||V>254)return;let D=(z-s)*I+(T-f);!L&&x>m[D]&&(m[D]=x),!L&&oe(B)&&x>c[D]&&(c[D]=x);let H=Ve(Ue(B),x);O.motivo&&(H=ke(H,O.motivo,O.motivoForza??1,z,x,T));let bo=Xe(O);bo&&(H={...H,cima:xo(H.cima,bo),lato:xo(H.lato,bo),fondo:xo(H.fondo,bo)},H.facce&&(H.facce=H.facce.map(P=>P==null?P:xo(P,bo))));let za=bo?Ye(O.materia):0;if(!L){_.fill(0);for(let j=-1;j<=1;j++)for(let k=-1;k<=1;k++)for(let K=-1;K<=1;K++)K===0&&j===0&&k===0||oe(i.tipo(z+K,x+j,T+k))&&(_[ta(K,j,k)]=1);let P=(j,k,K)=>_[ta(j,k,K)]===1;S.materia(za),S.cella(z,x,T);let U=z+.5,X=x+.5,$=T+.5,ro=O.forma&&je[O.forma];ro?ro(S,U,X,$,H,()=>!1):O.cappello&&!P(0,1,0)?We(S,U,X,$,H,P):Ze(S,U,X,$,H,(k,K,F)=>P(k,K,F)?K!==0?!0:!W(i.tipo(z+k,x,T+F)).cappello||P(k,1,F):!1,bo?bo.orlo:0),V-1<d&&(d=V-1),V+2>v&&(v=V+2)}let Bo=0,_o=0;if(L)for(_o=Math.max(0,Math.min(15,we(B)||0));Bo<15&&wo(i.tipo(z,x-1-Bo,T));)Bo++;let Ra=(P,U)=>{if(!wo(i.tipo(P,x,U)))return-1;let X=0;for(;X<15&&wo(i.tipo(P,x-1-X,U));)X++;return X},Vo=(P,U)=>{let X=0,$=0;for(let ro of[P-1,P])for(let j of[U-1,U]){let k=Ra(ro,j);k>=0&&(X+=k,$++)}return $?Math.round(X/$):Bo};if(L)for(let[P,U,X,$,ro,j]of it){let k=i.tipo(z+P,x+U,T+X);if(k&&(wo(k)||oe(k)))continue;let K=po(H,ro,j),F=z,N=x,q=T,so,lo,co,uo;if(P===1?(so=[F+1,N,q],lo=[F+1,N+1,q],co=[F+1,N+1,q+1],uo=[F+1,N,q+1]):P===-1?(so=[F,N,q+1],lo=[F,N+1,q+1],co=[F,N+1,q],uo=[F,N,q]):U===1?(so=[F,N+1,q],lo=[F,N+1,q+1],co=[F+1,N+1,q+1],uo=[F+1,N+1,q]):U===-1?(so=[F,N,q+1],lo=[F,N,q],co=[F+1,N,q],uo=[F+1,N,q+1]):X===1?(so=[F+1,N,q+1],lo=[F+1,N+1,q+1],co=[F,N+1,q+1],uo=[F,N,q+1]):(so=[F,N,q],lo=[F,N+1,q],co=[F+1,N+1,q],uo=[F+1,N,q]),U===1){let ze=x+(15-2*_o)/16;ze>h&&(h=ze)}u.quadDa(C(...so,$,K,Vo(so[0],so[2]),_o,so[1]===N+1),C(...lo,$,K,Vo(lo[0],lo[2]),_o,lo[1]===N+1),C(...co,$,K,Vo(co[0],co[2]),_o,co[1]===N+1),C(...uo,$,K,Vo(uo[0],uo[2]),_o,uo[1]===N+1)),V<d&&(d=V),V+1>v&&(v=V+1)}if(O.cappello&&t>0&&!i.tipo(z,x+1,T)){let[P,U]=R(z,x+1,T);b.ciuffo(z,x,T,s,f,H.cima,P,t/2,U),x+2+Ao>v&&(v=x+2+Ao)}}),d>v&&(d=0,v=0),{...l.dati(),minY:d,maxY:v,y0:-Ao,cx:n,cz:r,altezze:m,solide:c,acqua:{...u.dati(),pelo:h===-1/0?null:h},erba:b.dati()}}function na(i,e,t,o,a){let n=(o-e+1)*I,r=(a-t+1)*I,s=new Uint8Array(n*r);for(let f of i){if(!f.altezze)continue;let l=(f.cx-e)*I,u=(f.cz-t)*I;for(let h=0;h<I;h++)for(let m=0;m<I;m++){let c=f.altezze[h*I+m];s[(u+m)*n+(l+h)]=c<0?0:Math.max(0,Math.min(255,c+1))}}return{byte:s,x0:e*I,z0:t*I,larghezza:n,profondita:r}}function zo(i,e,t){let o=i*374761393+e*668265263+t*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function ra(i){return i*i*(3-2*i)}function Te(i,e,t){let o=Math.floor(i),a=Math.floor(e),n=ra(i-o),r=ra(e-a),s=zo(o,a,t),f=zo(o+1,a,t),l=zo(o,a+1,t),u=zo(o+1,a+1,t);return s+(f-s)*n+(l-s)*r+(s-f-l+u)*n*r}var yo=5;function sa(i,e=1,t=64){i.svuota();let o=[],a=[],n=new Map,r=[];for(let u=-t;u<=t;u++)for(let h=-t;h<=t;h++){let m=.55*Te(u*.028,h*.028,e)+.3*Te(u*.07,h*.07,e+11)+.15*Te(u*.16,h*.16,e+29),c=Math.max(2,1+Math.round(Math.pow(Math.max(0,m),1.6)*22)),d=Math.max(Math.abs(u),Math.abs(h)),v=Math.min(1,Math.max(0,(t-2-d)/8)),p=v*v*(3-2*v);c=Math.round(c*p+(yo+1)*(1-p));let g=c<=yo+1;n.set(u+"|"+h,c);for(let E=0;E<c;E++){let R=E===c-1?g?"sabbia":"erba":E<c-3?"roccia":"terra";i.metti(u,E,h,R,!0)}if(c<=yo)for(let E=c;E<=yo;E++)i.metti(u,E,h,"acqua",!0);else if(!g){let E=zo(u*3+1,h*3+7,e+101);if(E>.988&&o.length<90?o.push([u,c,h]):E<.004&&a.length<14&&a.push([u,c,h]),c>=yo+6){let b=zo(u*5+3,h*5+11,e+57);b>.99&&r.push({x:u,z:h,h:c,r:b})}}}let s=rt(i,n,e,r,t),f=u=>!s.has(u[0]+"|"+u[2]),l=[...s].map(u=>{let[h,m]=u.split("|").map(Number);return[h,n.get(u)-2,m]});return{alberi:o.filter(f),lampioni:a.filter(f),fiume:l}}var nt=[[1,0],[-1,0],[0,1],[0,-1]];function rt(i,e,t,o,a=64){let n=new Set;o.sort((f,l)=>l.h-f.h||f.r-l.r);let r=[];for(let f of o){if(r.length>=5)break;r.every(l=>(l.x-f.x)**2+(l.z-f.z)**2>=784)&&r.push(f)}let s=(f,l)=>{let u=f+"|"+l;if(n.has(u))return;let h=e.get(u);i.togli(f,h-1,l,!0),i.togli(f,h-2,l,!0),i.metti(f,h-2,l,"acqua",!0),n.add(u)};for(let f of r){let l=f.x,u=f.z,h=null,m=0,c=new Set([l+"|"+u]);for(let d=0;d<500;d++){let v=e.get(l+"|"+u);if(s(l,u),h){let b=l+h[1],R=u-h[0];e.get(b+"|"+R)===v&&s(b,R)}let p=null,g=1/0,E=1/0;for(let b of nt){let R=l+b[0],S=u+b[1];if(c.has(R+"|"+S))continue;let _=e.get(R+"|"+S);if(_===void 0)continue;let C=(b===h?-.5:0)+zo(R*7+5,S*7+13,t+71);(_<g||_===g&&C<E)&&(p=b,g=_,E=C)}if(!p||g>v||(m=g===v?m+1:0,m>24)||(l+=p[0],u+=p[1],c.add(l+"|"+u),h=p,e.get(l+"|"+u)<=yo)||Math.max(Math.abs(l),Math.abs(u))>=a-6)break}}for(let f of n){let[l,u]=f.split("|").map(Number),h=e.get(f);for(let m=-1;m<=1;m++)for(let c=-1;c<=1;c++){if(!m&&!c)continue;let d=l+m+"|"+(u+c);if(n.has(d))continue;let v=e.get(d);v===void 0||v<h||v>h+1||i.tipo(l+m,v-1,u+c)==="erba"&&(i.togli(l+m,v-1,u+c,!0),i.metti(l+m,v-1,u+c,"sabbia",!0))}}return n}function la(i){let e=new DataView(i);if(String.fromCharCode(e.getUint8(0),e.getUint8(1),e.getUint8(2),e.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let t=e.getUint32(4,!0),o=t*3,a=new Uint8Array(i,8,o*16),n=new Uint8Array(i,8+o*16,o*4),r=new Uint8Array(o*20);for(let h=0;h<o;h++)r.set(a.subarray(h*16,h*16+16),h*20),r.set(n.subarray(h*4,h*4+4),h*20+16);let s=1/0,f=-1/0,l=0,u=new DataView(r.buffer);for(let h=0;h<o;h++){let m=u.getFloat32(h*20,!0),c=u.getFloat32(h*20+4,!0),d=u.getFloat32(h*20+8,!0);s=Math.min(s,c),f=Math.max(f,c),l=Math.max(l,Math.hypot(m,d))}return{byte:r,vertici:o,triangoli:t,minY:s,maxY:f,raggio:l}}var st=`#version 300 es
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
}`,lt=`#version 300 es
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
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI pi\xF9 vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// \u26A0 LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni (\xABesagonale\xBB).
// La luce cotta resta come MASCHERA (dietro un muro non si passa) e per le
// lampade-blocco, che non stanno nella lista.
uniform sampler2D uAltezze;   // la mappa delle altezze (cima di ogni colonna + 1), per l'ombra della lampada
// \u26A0 L'OMBRA DELLA LAMPADA SI CAMMINA CELLA PER CELLA (Amanatides\u2013Woo, la
// traversata dei voxel in due dimensioni): dal punto si va verso la lanterna
// (a 2,6 di quota) attraversando le colonne della mappa delle altezze una per
// una, e ci si ferma sulla prima che sta sopra il raggio.
// \u26A0 NON a passi fissi: con dodici passi uguali il bordo dell'ombra cadeva
// DOVE CAPITAVA IL PASSO, non sul bordo del blocco, ed era seghettato (\xABl'ombra
// \xE8 seghettata quadrata non va bene\xBB). Camminando i confini delle celle il
// taglio \xE8 esattamente il profilo del blocco, dritto, e le letture sono meno:
// una per cella attraversata, al massimo quattordici (il raggio \xE8 4,6).
float ombraLampada(highp vec3 pos, highp vec3 L) {
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 prossimo = (cella + max(verso, vec2(0.0)) - pos.xz) / (verso * mod_);   // quanto manca al confine
  highp vec2 quanto = 1.0 / mod_;                    // e quanto da un confine al prossimo
  for (int i = 0; i < 14; i++) {
    highp float t = min(prossimo.x, prossimo.y);
    if (t >= lungo) break;                           // arrivati alla lanterna: niente in mezzo
    if (prossimo.x < prossimo.y) { cella.x += verso.x; prossimo.x += quanto.x; }
    else { cella.y += verso.y; prossimo.y += quanto.y; }
    highp float y = pos.y + (L.y - pos.y) * (t / lungo);
    float h = texture(uAltezze, (cella + 0.5 - uAltRett.xy) * uAltRett.zw).r * 255.0;
    if (h > y + 0.05 && h > pos.y + 0.6) return 0.0;
  }
  return 1.0;
}
float pozza(highp vec3 pos, float cotto) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // \u26A0 TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    s += anello * ombraLampada(pos, uLampade[i].xyz + vec3(0.0, 2.6, 0.0));
  }
  return min(s, 1.0);
}
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
  c += vBase * vec3(1.30, 1.02, 0.58) * pozza(vPos, 1.0) * mix(0.45, 1.0, 1.0 - smoothstep(0.30, 0.75, uSoleForza));   // i modelli non hanno luce cotta: passa
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  // \u26A0 LA SAGOMA: quando il gatto \xE8 dietro un albero o un muro, si vede la sua
  // ombra piatta attraverso (il committente: \xABun cono che mostra il player
  // anche attraverso i blocchi, magari in nero\xBB, non un buco nel mondo)
  if (uSagoma > 0.5) { colore = vec4(c * 0.18 * 0.55, 0.55); return; }
  colore = vec4(c, 1.0);
}`;function ct(i,e=4){if(e===8)return i instanceof Float32Array?i:new Float32Array(i);let t=i.length/4,o=new Float32Array(t*8);for(let a=0;a<t;a++)o.set([i[a*4],i[a*4+1],i[a*4+2],i[a*4+3],1,1,1,0],a*8);return o}var ut=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,ft=`#version 300 es
precision mediump float;
void main() {}`,ee=class{constructor(e){this.gl=e,this.programma=oo(e,st,lt),this.u={};for(let t of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[t]=e.getUniformLocation(this.programma,t);this.programmaOmbra=oo(e,ut,ft),this.uoVP=e.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(e,t){let o=this.gl,a={vao:o.createVertexArray(),vbo:o.createBuffer(),ibo:o.createBuffer(),vertici:t.vertici,triangoli:t.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:t.raggio,maxY:t.maxY};return o.bindVertexArray(a.vao),o.bindBuffer(o.ARRAY_BUFFER,a.vbo),o.bufferData(o.ARRAY_BUFFER,t.byte,o.STATIC_DRAW),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,3,o.FLOAT,!1,20,0),o.enableVertexAttribArray(1),o.vertexAttribPointer(1,3,o.BYTE,!0,20,12),o.enableVertexAttribArray(4),o.vertexAttribIPointer(4,1,o.UNSIGNED_BYTE,20,15),o.enableVertexAttribArray(2),o.vertexAttribPointer(2,4,o.UNSIGNED_BYTE,!0,20,16),o.bindBuffer(o.ARRAY_BUFFER,a.ibo),o.enableVertexAttribArray(3),o.vertexAttribPointer(3,4,o.FLOAT,!1,32,0),o.vertexAttribDivisor(3,1),o.enableVertexAttribArray(5),o.vertexAttribPointer(5,4,o.FLOAT,!1,32,16),o.vertexAttribDivisor(5,1),o.bindVertexArray(null),this.tipi.set(e,a),a}istanze(e,t,o=4){let a=this.tipi.get(e);a&&(a.istanze=ct(t,o),a.n=a.istanze.length/8,a.sporco=!0,this.dinamici.has(e)||(this.mappaSporca=!0))}disegnaOmbra(e,t){let o=this.gl;o.useProgram(this.programmaOmbra),o.uniformMatrix4fv(this.uoVP,!1,e);let a=0,n=0;for(let[r,s]of this.tipi)s.n===0||this.dinamici.has(r)!==t||(o.bindVertexArray(s.vao),s.sporco&&(o.bindBuffer(o.ARRAY_BUFFER,s.ibo),o.bufferData(o.ARRAY_BUFFER,s.istanze,o.DYNAMIC_DRAW),s.sporco=!1),o.drawArraysInstanced(o.TRIANGLES,0,s.vertici,s.n),a++,n+=s.triangoli*s.n);return o.bindVertexArray(null),[a,n]}disegna(e,t){let o=this.gl,a=this.u,n=e.sole;o.useProgram(this.programma),o.uniformMatrix4fv(a.uVP,!1,e.vpCorrente||e.vp),o.uniform1f(a.uTaglio,e.taglio??-1e9);let r=e.vpCorrente===e.vpSpecchio?[0,0,0,0]:e.buco||[0,0,0,0];o.uniform3f(a.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),o.uniform1f(a.uTempo,e.tempo),o.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),o.uniform3f(a.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),o.uniform1f(a.uSoleForza,n.forza),o.uniform3f(a.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),o.uniform4fv(a.uMaterie,e.materie),o.uniform2f(a.uNebbia,e.nebbia.da,e.nebbia.a),o.uniform3f(a.uNebbiaCol,e.nebbia.colore[0],e.nebbia.colore[1],e.nebbia.colore[2]),o.uniform3f(a.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),o.uniform1f(a.uOmbra,e.ombra&&e.altezze?1:0),e.altezze&&(o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,e.ombre.tex),o.uniform1i(a.uOmbre,0),o.uniform2f(a.uOmbreScala,e.ombre.scala,e.ombre.offset),o.uniform4f(a.uAltRett,e.altRett[0],e.altRett[1],e.altRett[2],e.altRett[3])),e.legaMappa(a);let s=0,f=0,l=0;o.uniform1f(a.uSagoma,0);for(let[h,m]of this.tipi)m.n!==0&&(o.uniform4f(a.uBuco,r[0],r[1],r[2],h==="omino"?0:r[3]),o.bindVertexArray(m.vao),m.sporco&&(o.bindBuffer(o.ARRAY_BUFFER,m.ibo),o.bufferData(o.ARRAY_BUFFER,m.istanze,o.DYNAMIC_DRAW),m.sporco=!1),o.drawArraysInstanced(o.TRIANGLES,0,m.vertici,m.n),s++,f+=m.triangoli*m.n,l+=m.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&e.vpCorrente!==e.vpSpecchio&&(o.uniform1f(a.uSagoma,1),o.depthFunc(o.GREATER),o.depthMask(!1),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.bindVertexArray(u.vao),o.drawArraysInstanced(o.TRIANGLES,0,u.vertici,u.n),o.disable(o.BLEND),o.depthMask(!0),o.depthFunc(o.LESS),o.uniform1f(a.uSagoma,0),s++),o.bindVertexArray(null),this.statistiche.disegni=s,this.statistiche.triangoli=f,this.statistiche.istanze=l}};function ca(i={}){let e=(t,o=1)=>typeof t=="number"&&isFinite(t)?+t.toFixed(o):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:e(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?e(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:e(i.fps,0),p50ms:e(i.p50,2),p99ms:e(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:e(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(t=>Math.round(t)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[]},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:e(i.worldgenMs,0),meshMs:e(i.meshMs,0)},errori:(i.errori||[]).slice(-12).map(t=>String(t).slice(0,500)),scatto:i.scatto||null}}function ua(i){return Math.round(JSON.stringify(i).length/1024)}var mt=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),ho=(i,e)=>i>>>e|i<<32-e;function fa(i){let e=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),t=i.length*8,o=new Uint8Array(i.length+9+63>>6<<6);o.set(i),o[i.length]=128,new DataView(o.buffer).setUint32(o.length-4,t>>>0),new DataView(o.buffer).setUint32(o.length-8,Math.floor(t/4294967296));let a=new Uint32Array(64),n=new DataView(o.buffer);for(let s=0;s<o.length;s+=64){for(let p=0;p<16;p++)a[p]=n.getUint32(s+p*4);for(let p=16;p<64;p++){let g=ho(a[p-15],7)^ho(a[p-15],18)^a[p-15]>>>3,E=ho(a[p-2],17)^ho(a[p-2],19)^a[p-2]>>>10;a[p]=a[p-16]+g+a[p-7]+E>>>0}let[f,l,u,h,m,c,d,v]=e;for(let p=0;p<64;p++){let g=ho(m,6)^ho(m,11)^ho(m,25),E=m&c^~m&d,b=v+g+E+mt[p]+a[p]>>>0,R=ho(f,2)^ho(f,13)^ho(f,22),S=f&l^f&u^l&u,_=R+S>>>0;v=d,d=c,c=m,m=h+b>>>0,h=u,u=l,l=f,f=b+_>>>0}e[0]=e[0]+f>>>0,e[1]=e[1]+l>>>0,e[2]=e[2]+u>>>0,e[3]=e[3]+h>>>0,e[4]=e[4]+m>>>0,e[5]=e[5]+c>>>0,e[6]=e[6]+d>>>0,e[7]=e[7]+v>>>0}let r="";for(let s of e)r+=s.toString(16).padStart(8,"0");return r}var ht="https://ntfy.sh",pt=4096;async function dt(i){let e=new TextEncoder().encode("leafy-shadows/"+i),t;if(globalThis.crypto&&crypto.subtle){let o=await crypto.subtle.digest("SHA-256",e);t=[...new Uint8Array(o)].map(a=>a.toString(16).padStart(2,"0")).join("")}else t=fa(e);return"leafy-"+t.slice(0,24)}async function ma(i,e){let t=await dt(i),o=await fetch(`${ht}/${t}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:e});if(!o.ok)return{ok:!1,dice:`il servizio ha detto no: ${o.status}`};let a=await o.json().catch(()=>({})),n=e.length>pt;return{ok:!0,id:a.id||"",dice:n?`mandato \u2714 (${Math.round(e.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(e.length/1024)} KB, dura 12 ore)`}}var ha="leafy.diagnostica.chiave",vt=`
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
`,ae=class{constructor(e,t){this.leggi=e,this.scatta=t,this.errori=[],addEventListener("error",a=>this._errore(a.error||a.message)),addEventListener("unhandledrejection",a=>this._errore(a.reason));let o=document.createElement("style");o.textContent=vt,document.head.appendChild(o),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(e){let t=e&&e.stack?e.stack:String(e);this.errori.push(t),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(ha)||""}catch{return""}}set chiave(e){try{localStorage.setItem(ha,e)}catch{}}apri(){let e=this.pannello;e.classList.add("aperto"),e.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,e.querySelector("#diagChiudi").onclick=()=>e.classList.remove("aperto"),e.querySelector("#diagCopia").onclick=()=>this.vai(!0),e.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let t=e.querySelector("#diagNota");t&&t.focus()},30)}_dice(e){let t=this.pannello.querySelector("#diagEsito");t&&(t.textContent=e)}async vai(e){let t=this.pannello.querySelector("#diagChiave");t&&t.value.trim()&&(this.chiave=t.value.trim());let o=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let a=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,n=null;if(a)try{n=this.scatta?await this.scatta():null}catch(u){this._errore(u)}let r=ca({...this.leggi(),quando:new Date().toISOString(),nota:o,errori:this.errori,scatto:n}),s=ua(r),f=JSON.stringify(r,null,1);if(e){await this._negliAppunti(f),this.nodo.classList.remove("corso");return}let l=!1;try{let u=await fetch("/_diagnostica",{method:"GET"});l=u.ok&&(await u.json().catch(()=>({}))).collettore===!0}catch{l=!1}if(l)try{let u=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:f});if(u.status===403)this._dice("password sbagliata."),this.chiave="";else if(u.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!u.ok)this._dice("il collettore ha detto no: "+u.status);else{let h=await u.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${h.nome||""}  (${s} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let u=await ma(this.chiave,f);this._dice(u.ok?u.dice+`
(fuori casa: passa dal cloud)`:u.dice),u.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(f,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(e,t=""){try{await navigator.clipboard.writeText(e),this._dice(t+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let o=new Blob([e],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download="leafy-diagnostica.json",a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),4e3),this._dice(t+`scaricato come file \u2714
mandami quello.`)}}};var G=document.getElementById("tela"),bt=document.getElementById("stato"),gt=document.getElementById("fps"),J=new URLSearchParams(location.search),y={raggio:+(J.get("raggio")||5),erba:+(J.get("erba")??8),ombra:J.get("ombra")!=="no",specchio:J.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(J.get("specchio")??.5)||.5)),dprMax:+(J.get("dpr")||1.5),rampa:J.has("rampa"),tutto:J.has("tutto"),mondo:J.has("finto")||J.has("rampa")?0:Math.max(16,Math.min(400,+(J.get("mondo")||48))),ora:J.has("ora")?Math.max(0,Math.min(1,+J.get("ora"))):null},{gl:No,dpr:xt,ridimensiona:Et}=Re(G,{antialias:!0,dprMax:y.dprMax}),A=new Yo(No),eo=new ee(No);A.ombra=y.ombra;A.specchio.attivo=y.specchio>0;A.specchio.scala=y.specchio||.5;A.specchio.mostra=J.has("vedi");var se=0,So=0;function ba(i,e){let t=performance.now();for(let n of[...A.chunks.keys()])A.rimuovi(n);se=0;for(let n=-i;n<i;n++)for(let r=-i;r<i;r++)A.carica(n+","+r,Ne(n,r,{erba:e})),se+=256;let o=i*2*16,a=new Uint8Array(o*o);for(let n=0;n<o;n++)for(let r=0;r<o;r++)a[n*o+r]=Co(r-i*16,n-i*16)+1;A.impostaAltezze(a,-i*16,-i*16,o,o),So=performance.now()-t}var no=null,ga=0,xa=0;function At(i,e){let t=performance.now();for(let m of[...A.chunks.keys()])A.rimuovi(m);Qe(),no=new Ko;let{alberi:o,lampioni:a}=sa(no,4242,i);for(let[m,c,d]of o)no.metti(m,c,d,"albero",!0);for(let[m,c,d]of a)no.metti(m,c,d,"lampione",!0);let n=performance.now()-t,r=[],s=1e9,f=1e9,l=-1e9,u=-1e9;for(let m of no.chunks.keys()){let c=ia(no,m,{erba:e});A.carica(m,c),r.push(c),s=Math.min(s,c.cx),l=Math.max(l,c.cx),f=Math.min(f,c.cz),u=Math.max(u,c.cz)}let h=na(r,s,f,l,u);return A.impostaAltezze(h.byte,h.x0,h.z0,h.larghezza,h.profondita),se=ga=no.contaBlocchi,xa=r.length,So=performance.now()-t,{tGen:n,tMesh:So-n}}var Me=null;y.mondo?Me=At(y.mondo,y.erba):ba(y.raggio,y.erba);async function Tt(){if(!no)return;let i=new Map;no.perOgni((e,t,o,a)=>{let n=W(a);n.forma!=="modello"||!n.modello||(i.has(n.modello)||i.set(n.modello,[]),i.get(n.modello).push(e+.5,t,o+.5,1))});for(let[e,t]of i)try{let o=await fetch(`./modelli/nucleo/${e}.bin`);if(!o.ok)throw new Error(`${o.status}`);eo.registra(e,la(await o.arrayBuffer())),eo.istanze(e,t)}catch(o){console.warn(`modello ${e}: ${o.message}`)}}Tt();A.tutto=y.tutto;var Mt=()=>{if(!no)return Co(0,0)+2;for(let i=120;i>-Ao;i--)if(no.tipo(0,i,0))return i+2;return 8},w={alpha:-.8,beta:1.05,raggio:46,centro:[0,Mt(),0],fov:.9};function Ea(){let i=Math.sin(w.beta),e=Math.cos(w.beta);return[w.centro[0]+w.raggio*i*Math.cos(w.alpha),w.centro[1]+w.raggio*e,w.centro[2]+w.raggio*i*Math.sin(w.alpha)]}var Fo=null,te=0;G.addEventListener("pointerdown",i=>{Fo={x:i.clientX,y:i.clientY},G.setPointerCapture(i.pointerId)});G.addEventListener("pointermove",i=>{Fo&&(w.alpha+=(i.clientX-Fo.x)*.006,w.beta=Math.max(.15,Math.min(1.5,w.beta-(i.clientY-Fo.y)*.006)),Fo={x:i.clientX,y:i.clientY})});G.addEventListener("pointerup",()=>{Fo=null});G.addEventListener("wheel",i=>{w.raggio=Math.max(8,Math.min(140,w.raggio*(i.deltaY>0?1.1:.9))),i.preventDefault()},{passive:!1});G.addEventListener("touchstart",i=>{i.touches.length===2&&(te=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY))},{passive:!0});G.addEventListener("touchmove",i=>{if(i.touches.length!==2)return;let e=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY);te>0&&(w.raggio=Math.max(8,Math.min(140,w.raggio*te/e))),te=e},{passive:!0});var ie=y.ora??.35;function zt(i){y.ora===null&&(ie=(ie+i/300)%1);let e=ie*Math.PI*2-Math.PI/2,t=.24+.5*Math.max(0,Math.sin(e)),o=e*.5;A.sole.verso=[-Math.cos(o)*Math.cos(Math.asin(t)),-t,-Math.sin(o)*Math.cos(Math.asin(t))];let a=Math.max(0,Math.min(1,(Math.sin(e)+.1)*2));A.sole.forza=a;let n=Math.min(1,Math.max(0,(t-.24)/.4));A.sole.colore=[1,.78+.22*n,.55+.45*n],A.sole.cielo=[.36+.64*a,.38+.62*a,.57+.43*a],A.nebbia.colore=[.25+.47*a,.35+.5*a,.5+.42*a],No.clearColor(A.nebbia.colore[0],A.nebbia.colore[1],A.nebbia.colore[2],1)}var Q=[],vo=[],ne=[],pa=performance.now(),Aa=0,da=0;function Ta(i){let e=Math.min(.1,(i-pa)/1e3);pa=i;let t=performance.now();Et(),zt(e);let a={occhio:Ea(),centro:w.centro,fov:w.fov,rapporto:G.width/G.height};A.disegna(a,e,eo),eo.disegna(A,a),A.disegnaAcqua();let n=performance.now()-t;Q.push(e*1e3),Q.length>240&&Q.shift(),vo.push(n),vo.length>240&&vo.shift(),Aa++,i-da>500&&(da=i,Ma()),y.rampa&&!y.mondo&&Rt(i),requestAnimationFrame(Ta)}var re=[{raggio:5,erba:2,tutto:!1},{raggio:6,erba:3,tutto:!1},{raggio:7,erba:4,tutto:!1},{raggio:6,erba:3,tutto:!0},{raggio:8,erba:4,tutto:!0}],le=[],Ro=-1,va=0;function Rt(i){if(Ro>=0&&i-va<6e3)return;if(Ro>=0){let t=Q.slice(-Math.min(Q.length,200)),o=re[Ro];le.push({...o,fps:+(1e3/(Y(t,.5)||1)).toFixed(0),p50:+Y(t,.5).toFixed(1),p99:+Y(t,.99).toFixed(1),js:+Y(vo,.5).toFixed(2),disegni:A.statistiche.disegni,triangoli:A.statistiche.triangoli})}if(Ro++,Ro>=re.length){y.rampa=!1,Ma();return}let e=re[Ro];ba(e.raggio,e.erba),A.tutto=e.tutto,y.erba=e.erba,y.raggio=e.raggio,Q.length=0,vo.length=0,va=i}var Y=(i,e)=>{if(!i.length)return 0;let t=i.slice().sort((o,a)=>o-a);return t[Math.min(t.length-1,Math.floor(t.length*e))]};function Ma(){let i=Y(Q,.5),e=Y(Q,.99),t=i?1e3/i:0;ne.push(Math.round(t)),ne.length>120&&ne.shift();let o={disegni:A.statistiche.disegni+eo.statistiche.disegni+A.statistiche.disegniAcqua+A.statistiche.disegniErba+A.statistiche.disegniSpecchio,triangoli:A.statistiche.triangoli+eo.statistiche.triangoli+A.statistiche.triangoliAcqua+A.statistiche.triangoliErba+A.statistiche.triangoliSpecchio,chunkVisti:A.statistiche.chunkVisti,chunkTotali:A.statistiche.chunkTotali};gt.textContent=`${t.toFixed(0)} fps
${i.toFixed(1)} / ${e.toFixed(1)} ms
JS ${Y(vo,.5).toFixed(2)} ms`,bt.textContent=`NUCLEO ${y.mondo?`F1 \xB7 open world vero (semilato ${y.mondo}, ${xa} chunk, ${ga.toLocaleString("it")} blocchi, gen ${Me.tGen.toFixed(0)} ms + mesh ${Me.tMesh.toFixed(0)} ms)`:"F0"} \xB7 ${G.width}\xD7${G.height} (dpr ${xt.toFixed(2)})
disegni ${o.disegni}  triangoli ${o.triangoli.toLocaleString("it")}  chunk ${o.chunkVisti}/${o.chunkTotali}
ombra del sole: ${A.ombra?"horizon mapping":"spenta"} \xB7 erba ${y.erba} \xB7 modelli ${eo.statistiche.istanze} istanze in ${eo.statistiche.disegni} disegni \xB7 acqua ${A.statistiche.disegniAcqua} disegni${A.statistiche.pelo!=null?` + specchio ${A.statistiche.disegniSpecchio} disegni (pelo ${A.statistiche.pelo.toFixed(2)}, scala ${A.specchio.scala})`:" (senza specchio)"} \xB7 erba ${A.statistiche.triangoliErba.toLocaleString("it")} fili in ${A.statistiche.disegniErba} disegni \xB7 costruzione ${So.toFixed(0)} ms
${ko(No)}
?mondo=96 ?ora=0.95 ?finto ?raggio=${y.raggio} ?erba=${y.erba} ?ombra=${y.ombra?"s\xEC":"no"} ?specchio=${y.specchio||"no"} ?dpr=${y.dprMax} ?rampa ?tutto  \xB7  tocca lo schermo per girare`+(le.length?`
RAMPA  fps  p50   p99   dis  triangoli
`+le.map(a=>`r${a.raggio} e${a.erba}${a.tutto?" tutto":""}  ${String(a.fps).padStart(3)}  ${String(a.p50).padStart(5)}  ${String(a.p99).padStart(5)}  ${String(a.disegni).padStart(3)}  ${a.triangoli.toLocaleString("it")}`).join(`
`):"")+(y.rampa?`
rampa: gradino ${Ro+1}/${re.length}\u2026`:"")}requestAnimationFrame(Ta);var St=new ae(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[G.clientWidth,G.clientHeight],reso:[G.width,G.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:y.mondo?"nucleo F1 mondo vero":"nucleo F0",mondo:y.mondo,raggio:y.raggio,erba:y.erba,ombra:A.ombra,specchio:y.specchio,disegniSpecchio:A.statistiche.disegniSpecchio,tutto:!!A.tutto,dprMax:y.dprMax,jsMs:+Y(vo,.5).toFixed(2),jsP99:+Y(vo,.99).toFixed(2),rampa:le},ombreLampade:!1,antialias:!0,fps:Y(Q,.5)?1e3/Y(Q,.5):null,p50:Y(Q,.5),p99:Y(Q,.99),disegni:A.statistiche.disegni+eo.statistiche.disegni+A.statistiche.disegniAcqua+A.statistiche.disegniErba+A.statistiche.disegniSpecchio,triangoli:A.statistiche.triangoli+eo.statistiche.triangoli+A.statistiche.triangoliAcqua+A.statistiche.triangoliErba+A.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:ne,storiaLivelli:[],scheda:ko(No),software:/swiftshader|llvmpipe/i.test(ko(No)),chunk:A.statistiche.chunkTotali,blocchi:se,luci:0,decorazioni:eo.statistiche.istanze,erba:A.statistiche.triangoliErba,ora:`${Math.floor(ie*24)}h`,giorno:0,worldgenMs:So,meshMs:So}),()=>{let i=Ea();return A.disegna({occhio:i,centro:w.centro,fov:w.fov,rapporto:G.width/G.height},0),Promise.resolve(G.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:A,modelli:eo,cam:w,opz:y,statistiche:()=>({fps:1e3/(Y(Q,.5)||1),p50:Y(Q,.5),p99:Y(Q,.99),js:Y(vo,.5),...A.statistiche,modelli:{...eo.statistiche},costruzioneMs:So,fotogrammi:Aa}),diagnostica:St};

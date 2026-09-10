function _o(i,{antialias:e=!0,dprMax:t=1.5}={}){let o=i.getContext("webgl2",{antialias:e,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!o)throw new Error("WebGL2 non disponibile");let a=Math.min(t,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(i.clientWidth*a)),l=Math.max(1,Math.round(i.clientHeight*a));return i.width!==r||i.height!==l?(i.width=r,i.height=l,o.viewport(0,0,r,l),!0):!1};return n(),{gl:o,dpr:a,ridimensiona:n}}function oe(i,e,t){let o=(n,r)=>{let l=i.createShader(n);if(i.shaderSource(l,r),i.compileShader(l),!i.getShaderParameter(l,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(l)}
${r.split(`
`).map((f,c)=>`${c+1}: ${f}`).join(`
`)}`);return l},a=i.createProgram();if(i.attachShader(a,o(i.VERTEX_SHADER,e)),i.attachShader(a,o(i.FRAGMENT_SHADER,t)),i.linkProgram(a),!i.getProgramParameter(a,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(a)}`);return a}function ke(i){let e=i.getExtension("WEBGL_debug_renderer_info");return e?i.getParameter(e.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function K(i,e,t){return(Math.sign(i)+1)*9+(Math.sign(e)+1)*3+(Math.sign(t)+1)}var Oa=K(1,0,0),Ia=K(-1,0,0),Na=K(0,1,0),ya=K(0,-1,0),qa=K(0,0,1),Fa=K(0,0,-1);var Lo=[Oa,Ia,Na,ya,qa,Fa],ze=class{constructor(e=1024){this.byte=new Uint8Array(e*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(e){let t=(this.n+e)*12;if(t<=this.byte.length)return;let o=this.byte.length*2;for(;o<t;)o*=2;let a=new Uint8Array(o);a.set(this.byte),this.byte=a,this.u32=new Uint32Array(a.buffer)}vertice(e,t,o,a,n,r,l,f=0,c=0){let u=Math.round(e*16)+16,p=Math.round(o*16)+16,m=Math.round(t*16);if(u<0||u>511||p<0||p>511||m<0||m>65535)throw new RangeError(`vertice fuori dal chunk: ${e},${t},${o}`);if(a<0||a>26||a===13)throw new RangeError(`normale non valida: ${a}`);this._spazio(1);let s=this.n*3,d=this.byte,v=this.u32;v[s]=(u|p<<9|(a&31)<<18|(f&1)<<23|(c&15)<<24)>>>0,v[s+1]=(m|(n&15)<<16|(r&15)<<20)>>>0;let h=this.n*12+8;d[h]=l>>16&255,d[h+1]=l>>8&255,d[h+2]=l&255,d[h+3]=0,this.n++}quadDa(e,t,o,a){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[e,t,o,a])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function Oo(i=16384){let e=new Uint16Array(i*6);for(let t=0,o=0,a=0;t<i;t++,a+=4)e[o++]=a,e[o++]=a+1,e[o++]=a+2,e[o++]=a,e[o++]=a+2,e[o++]=a+3;return e}function Io(i,e,t,o){let a=1/Math.tan(i/2),n=1/(t-o);return new Float32Array([a/e,0,0,0,0,a,0,0,0,0,(o+t)*n,-1,0,0,2*o*t*n,0])}function uo(i,e,t){let o=1/(t-e);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*o,0,0,0,-(t+e)*o,1])}function Xe(i,e,t=[0,1,0]){let o=i[0]-e[0],a=i[1]-e[1],n=i[2]-e[2],r=Math.hypot(o,a,n)||1;o/=r,a/=r,n/=r;let l=t[1]*n-t[2]*a,f=t[2]*o-t[0]*n,c=t[0]*a-t[1]*o;r=Math.hypot(l,f,c)||1,l/=r,f/=r,c/=r;let u=a*c-n*f,p=n*l-o*c,m=o*f-a*l;return new Float32Array([l,u,o,0,f,p,a,0,c,m,n,0,-(l*i[0]+f*i[1]+c*i[2]),-(u*i[0]+p*i[1]+m*i[2]),-(o*i[0]+a*i[1]+n*i[2]),1])}function No(i,e=new Float32Array(16)){let[t,o,a,n,r,l,f,c,u,p,m,s,d,v,h,b]=i,x=t*l-o*r,g=t*f-a*r,z=t*c-n*r,C=o*f-a*l,R=o*c-n*l,_=a*c-n*f,A=u*v-p*d,I=u*h-m*d,L=u*b-s*d,E=p*h-m*v,M=p*b-s*v,S=m*b-s*h,N=x*S-g*M+z*E+C*L-R*I+_*A;return N?(N=1/N,e[0]=(l*S-f*M+c*E)*N,e[1]=(a*M-o*S-n*E)*N,e[2]=(v*_-h*R+b*C)*N,e[3]=(m*R-p*_-s*C)*N,e[4]=(f*L-r*S-c*I)*N,e[5]=(t*S-a*L+n*I)*N,e[6]=(h*z-d*_-b*g)*N,e[7]=(u*_-m*z+s*g)*N,e[8]=(r*M-l*L+c*A)*N,e[9]=(o*L-t*M-n*A)*N,e[10]=(d*R-v*z+b*x)*N,e[11]=(p*z-u*R-s*x)*N,e[12]=(l*I-r*E-f*A)*N,e[13]=(t*E-o*I+a*A)*N,e[14]=(v*g-d*C-h*x)*N,e[15]=(u*C-p*g+m*x)*N,e):null}function Pe(i,e,t=new Float32Array(16)){for(let o=0;o<4;o++)for(let a=0;a<4;a++)t[o*4+a]=i[a]*e[o*4]+i[4+a]*e[o*4+1]+i[8+a]*e[o*4+2]+i[12+a]*e[o*4+3];return t}function fo(i,e=new Float32Array(24)){let t=f=>[i[f],i[4+f],i[8+f],i[12+f]],o=t(0),a=t(1),n=t(2),r=t(3),l=[[r[0]+o[0],r[1]+o[1],r[2]+o[2],r[3]+o[3]],[r[0]-o[0],r[1]-o[1],r[2]-o[2],r[3]-o[3]],[r[0]+a[0],r[1]+a[1],r[2]+a[2],r[3]+a[3]],[r[0]-a[0],r[1]-a[1],r[2]-a[2],r[3]-a[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let f=0;f<6;f++){let[c,u,p,m]=l[f],s=Math.hypot(c,u,p)||1;e[f*4]=c/s,e[f*4+1]=u/s,e[f*4+2]=p/s,e[f*4+3]=m/s}return e}function mo(i,e,t,o,a,n,r){for(let l=0;l<6;l++){let f=i[l*4],c=i[l*4+1],u=i[l*4+2],p=i[l*4+3],m=f>0?a:e,s=c>0?n:t,d=u>0?r:o;if(f*m+c*s+u*d+p<0)return!1}return!0}var po=2,Da=`#version 300 es
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
}`,yo=`#version 300 es
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
    // \u26A0 DUE OSTACOLI DIVERSI, e servono tutti e due.
    //
    // Il canale G e' il terreno VERO. Col canale R (la silhouette, chioma
    // compresa) un albero metteva davanti alla lampada un disco di colonne alte
    // quattro \u2014 un ostacolo squadrato largo cinque celle, e l'ombra che ne
    // usciva era \xABun'ombra quadrata delle luci\xBB.
    //
    // Il canale B e' l'OGGETTO, e risponde a \xABl'ombra delle furniture complesse
    // rispetto alla luce dei lampioni mi sembra non avvenire, la luce passa
    // attraverso?\xBB. Passava, si': togliendo la chioma avevo tolto anche il
    // tronco. Adesso l'albero ferma la luce col suo TRONCO \u2014 e non con un
    // quadrato: si controlla che il raggio passi davvero vicino al centro della
    // cella (un cilindro), se no un tronco largo un quinto di cella farebbe
    // l'ombra di un cubo intero.
    highp vec2 uvC = (cella + 0.5 - uAltRett.xy) * uAltRett.zw;
    vec4 mappa = texture(uAltezze, uvC);
    float h = mappa.g * 255.0;
    if (h > y + 0.05 && h > pos.y + 0.6) return 0.0;
    float ho = mappa.b * 255.0;
    if (ho > y + 0.05 && ho > pos.y + 0.3) {
      // quanto passa lontano dall'asse della cella, sul piano
      highp vec2 centro = cella + 0.5;
      highp vec2 qui = pos.xz + (L.xz - pos.xz) * (t / lungo);
      if (length(qui - centro) < 0.34) return 0.0;
    }
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
}`,Ua=`#version 300 es
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
}`,wa=`#version 300 es
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
  // \u26A0 E QUI LA LETTURA \xC8 LINEARE (il sampler dell'unit\xE0 2, vedi disegnaAcqua),
  // quindi l'altezza fra due colonne \xE8 interpolata invece che a scalini. Con la
  // lettura secca ogni assaggio dava 0 o 1 di scatto sul bordo del texel, e il
  // bordo della schiuma \u2014 per quanto netto lo si tagliasse \u2014 era fatto di
  // segmenti allineati alla griglia: quadrati. Con l'altezza interpolata e uno
  // smoothstep stretto l'assaggio \xE8 continuo, e il taglio netto che viene dopo
  // cade su una curva vera. Netto NON vuol dire a quadretti.
  float h = texture(uAltezze, uv).g * 255.0;
  return smoothstep(cima - 0.85, cima - 0.15, h);
}
/**
 * C'e' un OGGETTO qui? (albero, lampione, fungo: canale B della mappa)
 *
 * \u26A0 \xABAttorno a modelli complessi come alberi non c'e' schiuma\xBB \u2014 vero, e per
 * colpa mia: togliendo la chioma dalla mappa del terreno (che curava la riva
 * finta e l'ombra squadrata) un albero nell'acqua e' diventato NIENTE. Ma un
 * albero nell'acqua l'acqua la increspa: gli serve una mappa sua.
 *
 * \u26A0 E QUESTA SCALA A MIGLIAIA. Gli otto galleggianti sono un vettore di uniform
 * \u2014 tetto di otto, un ciclo per pixel, e la schiuma che appare quando ti
 * avvicini perche' entri negli otto piu' vicini. Una mappa non ha tetto: mille
 * alberi costano quanto uno, perche' e' comunque UNA lettura. Negli uniform
 * restano solo le cose che si muovono ogni fotogramma.
 */
float oggettoLi(highp vec2 q, float cima) {
  highp vec2 uv = (q - uAltRett.xy) * uAltRett.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  // la lettura e' LINEARE (sampler dell'unita' 2): l'impronta di una cella sola
  // sfuma sui vicini, e la macchia che ne esce e' tonda invece che quadrata
  float h = texture(uAltezze, uv).b * 255.0;
  return smoothstep(cima - 1.2, cima + 0.2, h);
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
    s += terraLi(pos.xz + dir * (0.42 + onda * 0.5), cima);
    s += terraLi(pos.xz + dir * (0.92 + onda * 0.8), cima);
  }
  return s * 0.0625;
}
/** L'altezza del terreno solido qui, interpolata (il sampler dell'unita 2 e lineare). */
float altezzaLiscia(highp vec2 q) {
  highp vec2 uv = (q - uAltRett.xy) * uAltRett.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return -99.0;
  return texture(uAltezze, uv).g * 255.0;
}
/**
 * QUANTO SIAMO LONTANI DALLA RIVA, in blocchi. Sotto zero: a terra.
 *
 * \u26A0 E' LA CURA DI \xABtroppo splamata, sfocata e poco netta, e agli angoli si
 * perde, non segue i lati del blocco\xBB. La stesura di prima faceva la MEDIA di
 * sedici assaggi su due anelli: la media serviva a togliere la scaletta, ma una
 * media su un anello e' un filtro PASSA-BASSO \u2014 spiana, allarga, e a un angolo
 * CONVESSO perde meta' degli assaggi, quindi il campo cala e la schiuma
 * sparisce proprio dove il bordo gira. Curava un difetto facendone due.
 *
 * Qui invece si stima la DISTANZA vera dalla curva di livello: si legge
 * l'altezza interpolata e la si divide per la pendenza (due differenze
 * centrali). La curva di livello dell'altezza SEGUE il bordo dei blocchi,
 * angoli compresi, e la larghezza della fascia la decide un numero \u2014 non la
 * dimensione dell'anello.
 *
 * \u26A0 E COSTA MENO: cinque letture invece di sedici.
 * \u26A0 La pendenza si tiene lontana da zero: sul fondale piatto vale zero, e senza
 * il freno la distanza esploderebbe in un infinito (che a schermo e' un NaN).
 */
float distanzaRiva(highp vec3 pos, float onda) {
  float cima = floor(pos.y) + 1.0;
  highp vec2 p = pos.xz;
  float h = altezzaLiscia(p);
  if (h < -50.0) return 99.0;                       // fuori dalla finestra della mappa
  float e = 0.35;
  float gx = altezzaLiscia(p + vec2(e, 0.0)) - altezzaLiscia(p - vec2(e, 0.0));
  float gz = altezzaLiscia(p + vec2(0.0, e)) - altezzaLiscia(p - vec2(0.0, e));
  float g = max(length(vec2(gx, gz)) / (2.0 * e), 0.30);
  return (cima - 0.5 - h) / g + onda * 0.30;
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
  // \u26A0 LA SCATOLA SI RESTRINGE E IL RESTO LO FA IL RAGGIO: con la scatola piena
  // i quattro angoli si vedono, e un gatto che galleggia dentro un quadrato
  // arrotondato non e' \xABniente quadrati\xBB. Tenendo la scatola al 40 % e
  // lasciando che sia la distanza a fare il resto, l'impronta resta ALLUNGATA
  // come l'oggetto ma i bordi sono archi.
  highp vec2 q = abs(p - centro) - mezzo * 0.40;
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
  // \u26A0 IL BRILLIO NON \xC8 IL RIFLESSO, e vuole una normale SUA.
  //
  // Il committente: \xABil riflesso del sole \xE8 diventato questo mega blob brutto,
  // lo stai aumentando ad ogni update \u2014 perch\xE9 non dovrebbe essere pi\xF9 piccolo
  // e denso, un po' come la vera acqua\xBB. Ed \xE8 colpa mia: passando alle onde
  // lunghe per curare il tiling del RIFLESSO, la normale \xE8 diventata quasi
  // piatta \u2014 quindi il prodotto scalare col sole cambia lentissimo e la soglia
  // taglia una macchia enorme e continua. La stessa mossa che ha curato il
  // riflesso ha rovinato il brillio, perch\xE9 usavano la stessa normale.
  //
  // Il luccichio vero \xE8 UN CAMPO DI SCINTILLE PICCOLE, non una pozza di luce:
  // lo fanno le increspature corte, che sono proprio quelle tolte al riflesso.
  // Quindi due normali: quella lunga per lo specchio, questa (lunga + due
  // ottave di increspature) per la scintilla, con la soglia molto pi\xF9 stretta.
  // \u26A0 Le due ottave hanno frequenze NON in rapporto semplice (1,13/0,61 e
  // 2,07/1,79): con rapporti interi le scintille si allineerebbero in una
  // griglia, che \xE8 il tiling curato un attimo fa spostato di un metro.
  vec2 fine = vec2(0.0);
  fine += vec2(sin(uTempo * 1.9 + vPos.x * 1.13 + vPos.z * 0.61),
               cos(uTempo * 1.5 - vPos.x * 0.69 + vPos.z * 1.27)) * 0.052;
  fine += vec2(sin(uTempo * 2.7 - vPos.x * 2.07 + vPos.z * 1.79),
               cos(uTempo * 2.3 + vPos.x * 1.83 + vPos.z * 2.11)) * 0.031;
  vec3 nBrillio = vPelo > 0.5 ? normalize(n + vec3(fine.x, 0.0, fine.y)) : n;
  // \u26A0 E SI SPEGNE CON LA DISTANZA: le scintille sono pi\xF9 fitte dei pixel gi\xE0 a
  // venti blocchi, e una soglia dura su un campo pi\xF9 fine del pixel non fa
  // luccichio \u2014 fa rumore che sfarfalla a ogni movimento della camera.
  float brillio = step(0.9972, dot(reflect(-vista, nBrillio), -uSoleVerso)) * uSoleForza * vPelo * sfumaOnda;
  acqua += vec3(0.85) * brillio;
  // \u26A0 LA SCHIUMA: alla riva (dove il fondo \xE8 alto, vProf piccola) e attorno a
  // chi galleggia. Solo sul pelo, e sopra a tutto il resto (anche al riflesso):
  // \xE8 il segno che l'acqua tocca qualcosa, e in Leafy \xE8 quello che d\xE0 vita.
  float onda = 0.13 * sin(uTempo * 1.5 + vPos.x * 1.9 + vPos.z * 1.1) + 0.08 * sin(uTempo * 2.3 - vPos.x * 1.3 + vPos.z * 2.7);
  // \u26A0 DUE BANDE NETTE alla riva: piena attaccata a terra, magra un passo fuori.
  // \u26A0 ADESSO LE SOGLIE SONO DISTANZE IN BLOCCHI, e si leggono: la risacca piena
  // arriva a 0,26 dalla riva, quella magra a 0,55. Prima erano quote di assaggi
  // su un anello \u2014 un numero che non voleva dire niente e che cambiava senso a
  // ogni raggio toccato.
  float dRiva = distanzaRiva(vPos, onda);
  float sRiva = max(aGradini(0.26 - dRiva, 0.0), aGradini(0.55 - dRiva, 0.0) * 0.5);
  // \u26A0 LA SCHIUMA DEGLI OGGETTI FERMI viene dalla MAPPA, non dagli uniform: gli
  // alberi, i lampioni e i funghi nell'acqua la fanno tutti, quanti che siano.
  // Stesso giro di assaggi della riva \u2014 quindi stesso bordo netto e curvo \u2014 ma
  // su un anello piu' stretto, perche' l'impronta di un tronco e' una cella.
  // \u26A0 LA MEDIA SULL'ANELLO, NON IL MASSIMO \u2014 ed \xE8 la differenza fra una macchia
  // TONDA e una quadrata. Col massimo basta un assaggio che tocchi l'impronta
  // perch\xE9 il pixel sia pieno: la forma che ne esce \xE8 l'unione degli assaggi,
  // cio\xE8 il quadrato del texel allargato dal filtro bilineare (che di suo ha
  // livelli squadrati). Con la media, la quota di assaggi che cadono
  // sull'oggetto dipende SOLO dalla distanza dal centro: le curve di livello
  // sono cerchi, per costruzione. \xC8 la stessa ragione per cui la riva usa la
  // media, e ci ho messo un giro a vederlo anche qui.
  float cimaCella = floor(vPos.y) + 1.0;
  float campoOgg = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7854 - onda * 0.7;
    vec2 dir = vec2(cos(a), sin(a));
    campoOgg += oggettoLi(vPos.xz + dir * (0.30 + onda * 0.35), cimaCella);
    campoOgg += oggettoLi(vPos.xz + dir * (0.68 + onda * 0.55), cimaCella);
  }
  campoOgg *= 0.0625;
  float sTocco = max(aGradini(campoOgg, 0.40), aGradini(campoOgg, 0.14) * 0.5);
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
}`,Ba=`#version 300 es
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
}`,Va=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,Ga=`#version 300 es
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
}`,ka=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Xa=`#version 300 es
precision mediump float;
void main() {}`,He=class{constructor(e){this.gl=e,this.programma=oe(e,Da,yo),this.u={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[t]=e.getUniformLocation(this.programma,t);this.ebo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,Oo(16384),e.STATIC_DRAW),this.programmaErba=oe(e,Ba,yo.replace(/flat in /g,"in ")),this.ue={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.ue[t]=e.getUniformLocation(this.programmaErba,t);this.programmaOmbra=oe(e,ka,Xa),this.uo={uVP:e.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:e.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=oe(e,Ua,wa),this.ua={};for(let t of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[t]=e.getUniformLocation(this.programmaAcqua,t);this.programmaCielo=oe(e,Va,Ga),this.uc={};for(let t of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[t]=e.getUniformLocation(this.programmaCielo,t);this.vaoVuoto=e.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=e.createSampler(),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_MIN_FILTER,e.LINEAR),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_MAG_FILTER,e.LINEAR),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(1024),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,colonne:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!e.getExtension("EXT_color_buffer_half_float")&&!!e.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),e.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(e,t){let o=this.mappa;Math.hypot(e+8-o.centro[0],t+8-o.centro[2])<=o.raggio+12&&(o.sporca=!0)}carica(e,t){let o=this.gl;this._sporcaMappa(t.cx*16,t.cz*16);let a=this.chunks.get(e);a||(a={vao:o.createVertexArray(),vbo:o.createBuffer(),quad:0},o.bindVertexArray(a.vao),o.bindBuffer(o.ARRAY_BUFFER,a.vbo),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,2,o.UNSIGNED_INT,12,0),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,8),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ebo),o.bindVertexArray(null),this.chunks.set(e,a)),o.bindBuffer(o.ARRAY_BUFFER,a.vbo),o.bufferData(o.ARRAY_BUFFER,t.byte,o.STATIC_DRAW),a.quad=t.quad;let n=t.erba;a.verticiErba=n?n.vertici:0,a.lamelle=n?n.fili:0,a.yBaseErba=n?n.yBase:0,a.verticiErba>0&&(a.vaoErba||(a.vaoErba=o.createVertexArray(),a.vboErba=o.createBuffer(),o.bindVertexArray(a.vaoErba),o.bindBuffer(o.ARRAY_BUFFER,a.vboErba),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,4,o.UNSIGNED_BYTE,12,0),o.vertexAttribDivisor(0,1),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,4),o.vertexAttribDivisor(1,1),o.enableVertexAttribArray(2),o.vertexAttribIPointer(2,4,o.UNSIGNED_BYTE,12,8),o.vertexAttribDivisor(2,1),o.bindVertexArray(null)),o.bindBuffer(o.ARRAY_BUFFER,a.vboErba),o.bufferData(o.ARRAY_BUFFER,n.byte,o.STATIC_DRAW));let r=t.acqua;if(a.quadAcqua=r?r.quad:0,a.peloAcqua=r&&r.pelo!=null?r.pelo:null,a.quadAcqua>0&&(a.vaoAcqua||(a.vaoAcqua=o.createVertexArray(),a.vboAcqua=o.createBuffer(),o.bindVertexArray(a.vaoAcqua),o.bindBuffer(o.ARRAY_BUFFER,a.vboAcqua),o.enableVertexAttribArray(0),o.vertexAttribIPointer(0,2,o.UNSIGNED_INT,12,0),o.enableVertexAttribArray(1),o.vertexAttribIPointer(1,4,o.UNSIGNED_BYTE,12,8),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ebo),o.bindVertexArray(null)),o.bindBuffer(o.ARRAY_BUFFER,a.vboAcqua),o.bufferData(o.ARRAY_BUFFER,r.byte,o.STATIC_DRAW)),a.x0=t.cx*16,a.z0=t.cz*16,a.minY=t.minY,a.maxY=t.maxY,a.y0=t.y0||0,a.chunk=[a.x0,a.y0,a.z0],t.altezze){a.tegola||(a.tegola=new Uint8Array(1024));let l=t.solide||t.altezze,f=t.impronte;for(let c=0;c<16;c++)for(let u=0;u<16;u++){let p=(u*16+c)*4,m=c*16+u,s=t.altezze[m],d=l[m],v=f?f[m]:-1;a.tegola[p]=s<0?0:Math.max(0,Math.min(255,s+1)),a.tegola[p+1]=d<0?0:Math.max(0,Math.min(255,d+1)),a.tegola[p+2]=v<0?0:Math.max(0,Math.min(255,v+1)),a.tegola[p+3]=255}this.finestra&&this._scriviTegola(a)}}apriFinestraAltezze(e,t,o=512){let a=this.gl;this.altezze||(this.altezze=a.createTexture()),this.finestra={lato:o,x0:0,z0:0,vuota:new Uint8Array(o*o*4),spostamenti:0},a.bindTexture(a.TEXTURE_2D,this.altezze),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),this._centraFinestra(e,t,!0)}seguiAltezze(e,t){this.finestra&&this._centraFinestra(e,t,!1)}_centraFinestra(e,t,o){let a=this.gl,n=this.finestra,r=n.lato/2;if(!o&&Math.abs(e-(n.x0+r))<n.lato/4&&Math.abs(t-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((e-r)/16)*16,n.z0=Math.floor((t-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.colonne!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,this.ombre.w,this.ombre.h],a.bindTexture(a.TEXTURE_2D,this.altezze),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,n.lato,n.lato,0,a.RGBA,a.UNSIGNED_BYTE,n.vuota);for(let l of this.chunks.values())l.tegola&&this._scriviTegola(l);return n.spostamenti++,!0}_scriviTegola(e,t=!1){let o=this.gl,a=this.finestra,n=e.x0-a.x0,r=e.z0-a.z0;n<0||r<0||n+16>a.lato||r+16>a.lato||(o.bindTexture(o.TEXTURE_2D,this.altezze),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texSubImage2D(o.TEXTURE_2D,0,n,r,16,16,o.RGBA,o.UNSIGNED_BYTE,t?this._tegolaVuota:e.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(e,t,o,a=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=oe(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,e,t,o,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,e,t,o,.1),n.uniform3f(r.uColore,1,1-.45*a,1-.8*a),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(e,t,o,a,n,r,l=.3,f=.1){let c=this.gl;this.programmaPieno||(this.programmaPieno=oe(c,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:c.getUniformLocation(this.programmaPieno,"uVP"),uCella:c.getUniformLocation(this.programmaPieno,"uCella"),uColore:c.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=c.createVertexArray());let u=this.uPieno;c.useProgram(this.programmaPieno),c.uniformMatrix4fv(u.uVP,!1,this.vp),c.uniform4f(u.uCella,e,t,o,f),c.uniform4f(u.uColore,a*l,n*l,r*l,l),c.bindVertexArray(this.vaoPieno),c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.depthMask(!1),c.disable(c.CULL_FACE),c.drawArrays(c.TRIANGLES,0,36),c.enable(c.CULL_FACE),c.depthMask(!0),c.disable(c.BLEND),c.bindVertexArray(null)}rimuovi(e){let t=this.chunks.get(e);t&&(this._sporcaMappa(t.x0,t.z0),this.finestra&&t.tegola&&this._scriviTegola(t,!0),this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.vbo),t.vaoAcqua&&(this.gl.deleteVertexArray(t.vaoAcqua),this.gl.deleteBuffer(t.vboAcqua)),t.vaoErba&&(this.gl.deleteVertexArray(t.vaoErba),this.gl.deleteBuffer(t.vboErba)),this.chunks.delete(e))}_sporcaOmbre(e,t,o,a){let r=[Math.max(0,e-26),Math.max(0,t-26),Math.min(this.ombre.w||1e9,e+o+26),Math.min(this.ombre.h||1e9,t+a+26)],l=this.ombre.sporco;this.ombre.sporco=l?[Math.min(l[0],r[0]),Math.min(l[1],r[1]),Math.max(l[2],r[2]),Math.max(l[3],r[3])]:r}_preparaOmbre(e,t){let o=this.gl,a=this.ombre;a.colonne=e;let n=e*po,r=t*po;if(a.tex||(a.tex=o.createTexture(),a.fbo=o.createFramebuffer()),o.bindTexture(o.TEXTURE_2D,a.tex),a.mezzoFloat=this._ombreMezzo,a.mezzoFloat?(o.texImage2D(o.TEXTURE_2D,0,o.R16F,n,r,0,o.RED,o.HALF_FLOAT,null),a.scala=1,a.offset=0):(o.texImage2D(o.TEXTURE_2D,0,o.R8,n,r,0,o.RED,o.UNSIGNED_BYTE,null),a.scala=64,a.offset=-8),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindFramebuffer(o.FRAMEBUFFER,a.fbo),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,a.tex,0),o.checkFramebufferStatus(o.FRAMEBUFFER)!==o.FRAMEBUFFER_COMPLETE&&a.mezzoFloat)return this._ombreMezzo=!1,o.bindFramebuffer(o.FRAMEBUFFER,null),this._preparaOmbre(e,t);if(o.bindFramebuffer(o.FRAMEBUFFER,null),a.w=n,a.h=r,a.sporco=[0,0,n,r],!this.programmaOmbre){this.programmaOmbre=oe(o,`#version 300 es
void main() { vec2 q = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(q, 0.0, 1.0); }`,`#version 300 es
precision highp float;
uniform sampler2D uAltezze;   // la mappa: R silhouette (col fogliame), G solido, B oggetti
uniform vec4 uAltRett;        // x0, z0, 1/larghezza, 1/profondita DELLA MAPPA DELLE OMBRE
uniform vec3 uSole;           // direzione VERSO il sole in pianta (x, z), e la pendenza (tan dell'elevazione)
uniform vec2 uCodifica;       // scala e offset: r = (quota - offset) / scala
uniform float uSuper;         // quanti texel d'ombra per blocco
out vec4 colore;
void main() {
  // \u26A0 LA MAPPA DELLE OMBRE HA PIU' TEXEL DEL MONDO (uSuper per blocco), ed e' la
  // cura delle \xABombre seghettate che ancora infestano questo progetto\xBB. Con un
  // texel per colonna il bordo dell'ombra CADE SUL BORDO DELLA COLONNA,
  // qualunque cosa si faccia dopo: si puo' filtrare, ammorbidire, tagliare
  // stretto \u2014 la scaletta e' gia' nel DATO, e un filtro su un dato a gradini
  // fa una scaletta sfocata, non una curva. L'unico modo di toglierla e' avere
  // piu' campioni del reticolo che la produce.
  vec2 p = gl_FragCoord.xy;
  vec2 dir = uSole.xy; float tg = uSole.z;
  // la propria cima, un quarto di passo avanti: le pareti di schiena sono in ombra, le cime no
  float hs = texture(uAltezze, p * uAltRett.zw).r * 255.0 - 0.25 * tg;
  // \u26A0 PASSO FISSO DI MEZZO BLOCCO PER 24 BLOCCHI: nessuna colonna saltata, che era la causa dei puntini
  // \u26A0 E il passo va convertito in texel: t e in BLOCCHI, la texture in texel.
  for (int i = 1; i <= 48; i++) {
    float t = float(i) * 0.5;
    float h = texture(uAltezze, (p + dir * t * uSuper) * uAltRett.zw).r * 255.0;
    hs = max(hs, h - t * tg);
  }
  colore = vec4((hs - uCodifica.y) / uCodifica.x, 0.0, 0.0, 1.0);
}`),this.uOmbre={};for(let l of["uAltezze","uAltRett","uSole","uCodifica","uSuper"])this.uOmbre[l]=o.getUniformLocation(this.programmaOmbre,l);this.vaoOmbre=o.createVertexArray()}}_calcolaOmbre(){let e=this.gl,t=this.ombre,o=this.sole;if(!this.altezze||!t.tex||(o.verso[0]*t.sole[0]+o.verso[1]*t.sole[1]+o.verso[2]*t.sole[2]<.99996&&(t.sole=o.verso.slice(),t.sporco=[0,0,t.w,t.h]),!t.sporco))return;let n=96,[r,l,f,c]=t.sporco;if(f<=r||c<=l){t.sporco=null;return}let u=Math.min(c,l+n);t.sporco=u>=c?null:[r,u,f,c];let p=Math.hypot(o.verso[0],o.verso[2])||1e-4,m=[-o.verso[0]/p,-o.verso[2]/p],s=Math.max(.05,-o.verso[1]/p);e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.viewport(0,0,t.w,t.h),e.enable(e.SCISSOR_TEST),e.scissor(r,l,f-r,u-l),e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE),e.useProgram(this.programmaOmbre),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(this.uOmbre.uAltezze,0),e.bindSampler(0,this.campionatoreLiscio),e.uniform4f(this.uOmbre.uAltRett,0,0,1/t.w,1/t.h),e.uniform3f(this.uOmbre.uSole,m[0],m[1],s),e.uniform2f(this.uOmbre.uCodifica,t.scala,t.offset),e.uniform1f(this.uOmbre.uSuper,po),e.bindVertexArray(this.vaoOmbre),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.bindSampler(0,null),e.disable(e.SCISSOR_TEST),e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),t.calcoli++,this.statistiche.calcoliOmbre=t.calcoli}_disegnaCielo(e,t){let o=this.gl,a=this.uc,n=this.sole;if(this.cieloNero||!No(e,this._invVP))return;o.useProgram(this.programmaCielo),o.uniformMatrix4fv(a.uInvVP,!1,this._invVP),o.uniform3f(a.uOcchio,t[0],t[1],t[2]),o.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),o.uniform1f(a.uSoleForza,n.forza),o.uniform3f(a.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;o.uniform3f(a.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),o.disable(o.DEPTH_TEST),o.depthMask(!1),o.disable(o.CULL_FACE),o.bindVertexArray(this.vaoVuoto),o.drawArrays(o.TRIANGLES,0,3),o.bindVertexArray(null),o.enable(o.CULL_FACE),o.depthMask(!0),o.enable(o.DEPTH_TEST)}_preparaMappa(){let e=this.gl,t=this.mappa,o=a=>{let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,a,a,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_FUNC,e.LEQUAL);let r=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,n,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);let l=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:n,fbo:r,lato:a,ok:l}};t.stat=o(t.lato),t.din=o(t.latoDin),(!t.stat.ok||!t.din.ok)&&(t.attiva=!1)}legaMappa(e){let t=this.gl,o=this.mappa;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,o.stat.tex),t.uniform1i(e.uMappaStat,1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,o.din.tex),t.uniform1i(e.uMappaDin,2),t.activeTexture(t.TEXTURE0),t.uniform1f(e.uMappaOn,o.on?1:0),t.uniformMatrix4fv(e.uLuceVP,!1,o.vp),t.uniformMatrix4fv(e.uLuceVPDin,!1,o.vpDin),t.uniform2f(e.uMappaTexel,.5/o.lato,.5/o.latoDin),t.uniform2f(e.uMappaSbieco,1.5*(2*o.raggio/o.lato),.1/220),t.uniform4fv(e.uLampade,this.lampade),t.uniform1i(e.uNLampade,this.nLampade),t.uniform3f(e.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(e.uAltezze,3),t.activeTexture(t.TEXTURE0))}_aggiornaMappa(e,t){let o=this.gl,a=this.mappa,n=this.sole,r=this.statistiche;if(a.on=!1,!a.attiva||!this.ombra)return;let l=typeof performance<"u"?performance.now():0,f=e.centro[0],c=e.centro[2],u=!1;Math.hypot(f-a.centro[0],c-a.centro[2])>10&&(a.centro=[Math.round(f/2)*2,Math.round(e.centro[1]),Math.round(c/2)*2],u=!0);{let h=n.verso,b=e.centro,x=[b[0]-h[0]*120,b[1]-h[1]*120,b[2]-h[2]*120],g=Math.abs(h[1])>.95?[0,0,1]:[0,1,0];Pe(uo(a.raggioDin,10,230),Xe(x,b,g),a.vpDin)}n.verso[0]*a.sole[0]+n.verso[1]*a.sole[1]+n.verso[2]*a.sole[2]<.99985&&(a.soleMosso=!0);let m=a.sporca||a.soleMosso||t&&t.mappaSporca,s=u||m&&l-(a.ultimo||0)>=500;if(s){a.sole=n.verso.slice(),a.soleMosso=!1,a.ultimo=l;let h=n.verso,b=a.centro,x=[b[0]-h[0]*120,b[1]-h[1]*120,b[2]-h[2]*120],g=Math.abs(h[1])>.95?[0,0,1]:[0,1,0];Pe(uo(a.raggio,10,230),Xe(x,b,g),a.vp)}if(o.enable(o.POLYGON_OFFSET_FILL),o.polygonOffset(1.5,4),s){o.bindFramebuffer(o.FRAMEBUFFER,a.stat.fbo),o.viewport(0,0,a.stat.lato,a.stat.lato),o.clear(o.DEPTH_BUFFER_BIT),o.useProgram(this.programmaOmbra),o.uniformMatrix4fv(this.uo.uVP,!1,a.vp);let h=0,b=0,x=a.raggio+12;for(let g of this.chunks.values())g.quad!==0&&(Math.hypot(g.x0+8-a.centro[0],g.z0+8-a.centro[2])>x||(o.uniform3f(this.uo.uChunk,g.chunk[0],g.chunk[1],g.chunk[2]),o.bindVertexArray(g.vao),o.drawElements(o.TRIANGLES,g.quad*6,o.UNSIGNED_SHORT,0),h++,b+=g.quad*2));if(o.bindVertexArray(null),t){let[g,z]=t.disegnaOmbra(a.vp,!1);h+=g,b+=z,t.mappaSporca=!1}a.sporca=!1,a.calcoli++,a.disegni=h,a.triangoli=b}o.bindFramebuffer(o.FRAMEBUFFER,a.din.fbo),o.viewport(0,0,a.din.lato,a.din.lato),o.clear(o.DEPTH_BUFFER_BIT);let d=0,v=0;t&&([d,v]=t.disegnaOmbra(a.vpDin,!0)),o.disable(o.POLYGON_OFFSET_FILL),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),a.on=!0,r.calcoliMappa=a.calcoli,r.disegniOmbra=d+(s?a.disegni:0),r.triangoliOmbra=v+(s?a.triangoli:0)}impostaAltezze(e,t,o,a,n,r=null){let l=this.gl;this.altezze||(this.altezze=l.createTexture()),l.bindTexture(l.TEXTURE_2D,this.altezze),l.pixelStorei(l.UNPACK_ALIGNMENT,1);let f=new Uint8Array(a*n*4);for(let c=0;c<a*n;c++)f[c*4]=e[c],f[c*4+1]=r?r[c]:e[c];l.texImage2D(l.TEXTURE_2D,0,l.RGBA8,a,n,0,l.RGBA,l.UNSIGNED_BYTE,f),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),this.altRett=[t,o,1/a,1/n],this._preparaOmbre(a,n)}impostaMaterie(e){let t=new Float32Array(64);for(let o=0;o<16&&o<e.length;o++)for(let a=0;a<4;a++)t[o*4+a]=e[o][a]||0;this.materie=t}disegna(e,t,o=null){let a=this.gl,n=this.statistiche;this.tempo+=t;let r=Io(e.fov,e.rapporto,.3,400),l=Xe(e.occhio,e.centro);Pe(r,l,this.vp),fo(this.vp,this.piani),this._camera=e,this._visibili.length=0,this._visibiliErba.length=0;let f=0;for(let s of this.chunks.values())s.quad===0&&s.quadAcqua===0||(s.visto=this.tutto||mo(this.piani,s.x0,s.y0+s.minY,s.z0,s.x0+16,s.y0+s.maxY+1,s.z0+16),s.visto&&(f++,s.quadAcqua>0&&this._visibili.push(s),s.verticiErba>0&&Math.hypot(s.x0+8-e.occhio[0],s.z0+8-e.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(s)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(e,o),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(e,o),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,e.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[c,u]=this._solidi(this.vp,this.piani,e.occhio,!1),p=0,m=0;if(this._visibiliErba.length){let s=this.ue,d=this.sole;a.useProgram(this.programmaErba),a.uniformMatrix4fv(s.uVP,!1,this.vp),a.uniform1f(s.uTempo,this.tempo),a.uniform3f(s.uSoleVerso,d.verso[0],d.verso[1],d.verso[2]),a.uniform3f(s.uSoleCol,d.colore[0],d.colore[1],d.colore[2]),a.uniform1f(s.uSoleForza,d.forza),a.uniform3f(s.uCieloCol,d.cielo[0],d.cielo[1],d.cielo[2]),a.uniform2f(s.uNebbia,this.nebbia.da,this.nebbia.a),a.uniform3f(s.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),a.uniform3f(s.uCam,e.occhio[0],e.occhio[1],e.occhio[2]),a.uniform2f(s.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),a.uniform1f(s.uOmbra,this.ombra&&this.altezze?1:0),a.uniform1f(s.uTaglio,-1e9),a.uniform1f(s.uErbaFinoA,this.erbaFinoA),a.uniform4f(s.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),a.uniform3f(s.uOcchio,e.occhio[0],e.occhio[1],e.occhio[2]),this.altezze&&(a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.ombre.tex),a.uniform1i(s.uOmbre,0),a.uniform2f(s.uOmbreScala,this.ombre.scala,this.ombre.offset),a.uniform4f(s.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(s),a.disable(a.CULL_FACE);for(let v of this._visibiliErba)a.uniform3f(s.uChunk,v.chunk[0],v.yBaseErba,v.chunk[2]),a.bindVertexArray(v.vaoErba),a.drawArraysInstanced(a.TRIANGLES,0,6,v.lamelle),p++,m+=v.lamelle*2;a.enable(a.CULL_FACE),a.bindVertexArray(null)}n.disegni=c,n.triangoli=u,n.chunkVisti=f,n.chunkTotali=this.chunks.size,n.disegniErba=p,n.triangoliErba=m}_solidi(e,t,o,a){let n=this.gl,r=this.u,l=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,e),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,l.verso[0],l.verso[1],l.verso[2]),n.uniform3f(r.uSoleCol,l.colore[0],l.colore[1],l.colore[2]),n.uniform1f(r.uSoleForza,l.forza),n.uniform3f(r.uCieloCol,l.cielo[0],l.cielo[1],l.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,o[0],o[1],o[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let f=a?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,f[0],f[1],f[2],f[3]),n.uniform3f(r.uOcchio,o[0],o[1],o[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let c=0,u=0;for(let p of this.chunks.values())if(p.quad!==0){if(a){if(!this.tutto&&!mo(t,p.x0,p.y0+p.minY,p.z0,p.x0+16,p.y0+p.maxY+1,p.z0+16))continue}else if(!p.visto)continue;n.uniform3f(r.uChunk,p.chunk[0],p.chunk[1],p.chunk[2]),n.bindVertexArray(p.vao),n.drawElements(n.TRIANGLES,p.quad*6,n.UNSIGNED_SHORT,0),c++,u+=p.quad*2}return n.bindVertexArray(null),[c,u]}_peloVicino(e){let t=this._voti;t.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-e[0],n.z0+8-e[2])+2.2*Math.abs(n.peloAcqua-e[1]);t.set(n.peloAcqua,(t.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let o=null,a=0;for(let[n,r]of t)r>a&&(a=r,o=n);return o}_specchia(e,t){let o=this.gl,a=this.specchio,n=this.statistiche,r=this._peloVicino(e.occhio);if(r==null||e.occhio[1]<=r+.2)return;let l=Math.max(1,Math.round(o.drawingBufferWidth*a.scala)),f=Math.max(1,Math.round(o.drawingBufferHeight*a.scala));(!a.fbo||a.w!==l||a.h!==f)&&this._preparaSpecchio(l,f);let c=this._riflessione;c.fill(0),c[0]=1,c[5]=-1,c[10]=1,c[13]=2*r,c[15]=1,Pe(this.vp,c,this.vpSpecchio),fo(this.vpSpecchio,this.pianiSpecchio);let u=[e.occhio[0],2*r-e.occhio[1],e.occhio[2]];o.bindFramebuffer(o.FRAMEBUFFER,a.fbo),o.viewport(0,0,l,f),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),o.cullFace(o.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[p,m]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);n.disegniSpecchio=p,n.triangoliSpecchio=m,t&&(t.disegna(this,{occhio:u,centro:e.centro,fov:e.fov,rapporto:e.rapporto}),n.disegniSpecchio+=t.statistiche.disegni,n.triangoliSpecchio+=t.statistiche.triangoli),o.cullFace(o.BACK),o.bindFramebuffer(o.FRAMEBUFFER,null),o.viewport(0,0,o.drawingBufferWidth,o.drawingBufferHeight),this.taglio=-1e9,a.pelo=r,n.pelo=r}_mostraSpecchio(){let e=this.gl,t=this.specchio;this.programmaQuad||(this.programmaQuad=oe(e,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=e.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=e.createVertexArray()),e.useProgram(this.programmaQuad),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.tex),e.uniform1i(this.uQuad,0),e.bindVertexArray(this.vaoQuad),e.disable(e.DEPTH_TEST),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.enable(e.DEPTH_TEST),e.bindVertexArray(null)}_preparaSpecchio(e,t){let o=this.gl,a=this.specchio;a.fbo||(a.fbo=o.createFramebuffer(),a.tex=o.createTexture(),a.rbo=o.createRenderbuffer()),o.bindTexture(o.TEXTURE_2D,a.tex),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,e,t,0,o.RGBA,o.UNSIGNED_BYTE,null),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.LINEAR),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),o.bindRenderbuffer(o.RENDERBUFFER,a.rbo),o.renderbufferStorage(o.RENDERBUFFER,o.DEPTH_COMPONENT16,e,t),o.bindFramebuffer(o.FRAMEBUFFER,a.fbo),o.framebufferTexture2D(o.FRAMEBUFFER,o.COLOR_ATTACHMENT0,o.TEXTURE_2D,a.tex,0),o.framebufferRenderbuffer(o.FRAMEBUFFER,o.DEPTH_ATTACHMENT,o.RENDERBUFFER,a.rbo),o.checkFramebufferStatus(o.FRAMEBUFFER)!==o.FRAMEBUFFER_COMPLETE&&(a.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),o.bindFramebuffer(o.FRAMEBUFFER,null),o.bindTexture(o.TEXTURE_2D,null),a.w=e,a.h=t}disegnaAcqua(){let e=this.gl,t=this.ua,o=this.sole,a=this._camera,n=this.specchio;if(!a||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}e.useProgram(this.programmaAcqua),e.uniformMatrix4fv(t.uVP,!1,this.vp),e.uniform1f(t.uTempo,this.tempo),e.uniform3f(t.uCam,a.occhio[0],a.occhio[1],a.occhio[2]),e.uniform2f(t.uNebbia,this.nebbia.da,this.nebbia.a),e.uniform3f(t.uSoleVerso,o.verso[0],o.verso[1],o.verso[2]),e.uniform3f(t.uSoleCol,o.colore[0],o.colore[1],o.colore[2]),e.uniform1f(t.uSoleForza,o.forza),e.uniform3f(t.uCieloCol,o.cielo[0],o.cielo[1],o.cielo[2]),e.uniform3f(t.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,r?n.tex:null),e.uniform1i(t.uSpecchio,1),e.uniform3f(t.uSchermo,1/e.drawingBufferWidth,1/e.drawingBufferHeight,r?1:0),e.uniform1f(t.uMare,this.mare),e.uniform4fv(t.uGalleggianti,this.galleggianti),e.uniform1i(t.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(t.uAltezze,2),e.bindSampler(2,this.campionatoreLiscio),e.uniform4f(t.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):e.uniform4f(t.uAltRett,0,0,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.depthMask(!1),e.disable(e.CULL_FACE);let l=0,f=0;for(let c of this._visibili)e.uniform3f(t.uChunk,c.chunk[0],c.chunk[1],c.chunk[2]),e.bindVertexArray(c.vaoAcqua),e.drawElements(e.TRIANGLES,c.quadAcqua*6,e.UNSIGNED_SHORT,0),l++,f+=c.quadAcqua*2;e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),e.bindSampler(2,null),e.activeTexture(e.TEXTURE0),this.statistiche.disegniAcqua=l,this.statistiche.triangoliAcqua=f,n.mostra&&r&&this._mostraSpecchio()}};var go=class extends ze{vertice(e,t,o,a,n,r,l,f=0,c=0){super.vertice(e,t,o,Lo[a],n,r,l,f,c)}},ie={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},$e=[0,6072381,8739896,14403468,9211013,5086771,6043679,2714414,16767347],Ya=1;function ho(i,e){let t=o=>Math.max(0,Math.min(255,Math.round(o*e)));return t(i>>16&255)<<16|t(i>>8&255)<<8|t(i&255)}function me(i,e,t){let o=i*374761393+e*668265263+t*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function vo(i,e,t,o){let a=i/t,n=e/t,r=Math.floor(a),l=Math.floor(n),f=a-r,c=n-l,u=f*f*(3-2*f),p=c*c*(3-2*c),m=me(r,l,o),s=me(r+1,l,o),d=me(r,l+1,o),v=me(r+1,l+1,o);return m+(s-m)*u+(d+(v-d)*u-(m+(s-m)*u))*p}function Le(i,e,t=7){let o=vo(i,e,48,t)*14+vo(i,e,17,t+1)*5+vo(i,e,6,t+2)*1.5;return 8+Math.floor(o)}function Po(i){return i<11?ie.sabbia:i>24?ie.roccia:ie.erba}function qo(i,e,t=7){let o=[];for(let a=0;a<2;a++){if(me(i*3+a,e*5-a,t+9)<.35)continue;let r=i*16+Math.floor(me(i,e,t+11+a)*15)+.5,l=e*16+Math.floor(me(e,i,t+13+a)*15)+.5,f=Le(Math.floor(r),Math.floor(l),t);Po(f)===ie.erba&&o.push({x:r,y:f+3,z:l})}return o}function Fo(i,e,t,o){let a=0;for(let n of o){let l=15-Math.sqrt((i-n.x)**2+(e-n.y)**2+(t-n.z)**2);l>a&&(a=l)}return Math.max(0,Math.min(15,Math.round(a)))}function Do(i,e,{seme:t=7,erba:o=2,raggioLampade:a=2}={}){let n=new go(1600),r=i*16,l=e*16,f=255,c=0,u=[];for(let m=-a;m<=a;m++)for(let s=-a;s<=a;s++)u.push(...qo(i+m,e+s,t));for(let m=0;m<16;m++)for(let s=0;s<16;s++){let d=r+m,v=l+s,h=Le(d,v,t);h<f&&(f=h),h+1>c&&(c=h+1);let b=Po(h),x=.94+.12*me(d,v,t+3),g=Fo(d+.5,h+1,v+.5,u),z=ho($e[b],x);n.quadDa([m,h+1,s,2,15,g,z],[m,h+1,s+1,2,15,g,z],[m+1,h+1,s+1,2,15,g,z],[m+1,h+1,s,2,15,g,z]);let C=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[R,_,A]of C){let I=Le(d+R,v+_,t);for(let L=I+1;L<=h;L++){let E=Math.max(6,15-(h-L)*2),M=L===h&&b===ie.erba?ie.erba:h>24?ie.roccia:ie.terra,S=Fo(d+.5+R*.5,L+.5,v+.5+_*.5,u),N=L,U=L+1,w=ho($e[M],x);R===1?n.quadDa([m+1,N,s,A,E,S,w],[m+1,U,s,A,E,S,w],[m+1,U,s+1,A,E,S,w],[m+1,N,s+1,A,E,S,w]):R===-1?n.quadDa([m,N,s+1,A,E,S,w],[m,U,s+1,A,E,S,w],[m,U,s,A,E,S,w],[m,N,s,A,E,S,w]):_===1?n.quadDa([m+1,N,s+1,A,E,S,w],[m+1,U,s+1,A,E,S,w],[m,U,s+1,A,E,S,w],[m,N,s+1,A,E,S,w]):n.quadDa([m,N,s,A,E,S,w],[m,U,s,A,E,S,w],[m+1,U,s,A,E,S,w],[m+1,N,s,A,E,S,w]),L<f&&(f=L)}}if(b===ie.erba)for(let R=0;R<o;R++){if(me(d,v,t+20+R)<.25)continue;let A=1,I=m,L=s,E=ho($e[ie.filo],.94+.12*me(d,v,t+30+R));n.quadDa([I,h+1,L,2,15,g,E],[I,h+1+A,L,2,15,g,E,1],[I+1,h+1+A,L+1,2,15,g,E,1],[I+1,h+1,L+1,2,15,g,E]),n.quadDa([I+1,h+1,L,2,15,g,E],[I+1,h+1+A,L,2,15,g,E,1],[I,h+1+A,L+1,2,15,g,E,1],[I,h+1,L+1,2,15,g,E]),h+2>c&&(c=h+2)}}for(let m of qo(i,e,t)){let s=Math.floor(m.x)-r,d=Math.floor(m.z)-l,v=m.y-3;for(let h=v+1;h<=m.y;h++){let b=h===m.y?ie.lampada:ie.tronco,x=h===m.y?15:12,g=$e[b],z=h===m.y?Ya:0,C=s+.5-.15,R=s+.5+.15,_=Math.floor(C),A=Math.min(16,Math.floor(C)+1),I=d,L=d+1;n.quadDa([A,h,I,0,12,x,g,0,z],[A,h+1,I,0,12,x,g,0,z],[A,h+1,L,0,12,x,g,0,z],[A,h,L,0,12,x,g,0,z]),n.quadDa([_,h,L,1,12,x,g,0,z],[_,h+1,L,1,12,x,g,0,z],[_,h+1,I,1,12,x,g,0,z],[_,h,I,1,12,x,g,0,z]),n.quadDa([A,h,L,4,12,x,g,0,z],[A,h+1,L,4,12,x,g,0,z],[_,h+1,L,4,12,x,g,0,z],[_,h,L,4,12,x,g,0,z]),n.quadDa([_,h,I,5,12,x,g,0,z],[_,h+1,I,5,12,x,g,0,z],[A,h+1,I,5,12,x,g,0,z],[A,h,I,5,12,x,g,0,z]),h===m.y&&n.quadDa([_,h+1,I,2,15,x,g,0,z],[_,h+1,L,2,15,x,g,0,z],[A,h+1,L,2,15,x,g,0,z],[A,h+1,I,2,15,x,g,0,z]),h+1>c&&(c=h+1)}}return{...n.dati(),minY:f,maxY:c,cx:i,cz:e}}var Uo={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},wo=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],Ze={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};wo.push(Ze);var Ha={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};wo.push(Ha);function Bo(i,e,t=Ze){Uo[i]=e,t.blocchi.includes(i)||t.blocchi.push(i)}var $a={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"};function W(i){return Uo[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||$a}function Vo(i){let e=i.indexOf("~");return e<0?i:i.slice(0,e)}function Go(i){if(!i||!i.startsWith("acqua"))return null;let e=i.indexOf("~");return e<0?0:Number(i.slice(e+1))}var O=16,Za=256,je=2048,ko=64,J=(i,e,t)=>((i+je)*4096+(t+je))*256+(e+ko),Oe=i=>Math.floor(i/(256*4096))-je,Ie=i=>Math.floor(i/256)%4096-je,Ne=i=>i%256-ko;var be=(i,e)=>Math.floor(i/O)+","+Math.floor(e/O),Ke=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this.bagnate=new Map,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(e){this.generati.add(e)}_annotaModifica(e,t,o,a){if(!this.frontiera)return;let n=be(e,o),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(J(e,t,o),a)}applicaModifiche(e){let t=this.modifiche.get(e);if(!t)return 0;for(let[o,a]of t){let n=Oe(o),r=Ne(o),l=Ie(o);a===null?this.togli(n,r,l,!0):this.metti(n,r,l,a,!0)}return t.size}scaricaChunk(e){let t=this.chunks.get(e);if(!t)return this.generati.delete(e),[];let o=[];for(let[a,n]of t){let r=W(n);r&&r.forma==="modello"&&o.push([Oe(a),Ne(a),Ie(a),n])}return this.contaBlocchi-=t.size,this.chunks.delete(e),this._scordaMemo(),this.generati.delete(e),this._tocca(e,this.sporchi),o}_cambiata(e,t,o){if(this.cambiate.length>=3*Za){this.troppiCambi=!0;return}this.cambiate.push(e,t,o)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(e,t){let o=Math.floor(e/O),a=Math.floor(t/O);if(this._memoChunk!==null&&this._memoCx===o&&this._memoCz===a)return this._memoChunk;let n=this.chunks.get(o+","+a)||null;return this._memoCx=o,this._memoCz=a,this._memoChunk=n,n}tipo(e,t,o){let a=this._chunkDi(e,o);return a&&a.get(J(e,t,o))||null}pieno(e,t,o){return this.tipo(e,t,o)!==null}solido(e,t,o){let a=this.tipo(e,t,o);if(a&&W(a).solido)return!0;let n=this.furni.get(J(e,t,o));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(e,t,o){if(!this.solido(e,t-1,o)||this.solido(e,t,o)||this.solido(e,t+1,o))return!1;let a=this.tipo(e,t,o);return!(a&&W(a).acqua)}_sporca(e,t,o=this.sporchi){let a=(e%O+O)%O,n=(t%O+O)%O;this._tocca(be(e,t),o),a===0&&this._tocca(be(e-1,t),o),a===O-1&&this._tocca(be(e+1,t),o),n===0&&this._tocca(be(e,t-1),o),n===O-1&&this._tocca(be(e,t+1),o)}_tocca(e,t){t.add(e),this._rev.set(e,(this._rev.get(e)||0)+1)}revisione(e){return this._rev.get(e)||0}metti(e,t,o,a,n=!1){let r=be(e,o),l=this.chunks.get(r);l||(l=new Map,this.chunks.set(r,l),this._scordaMemo());let f=J(e,t,o),c=l.get(f);c===void 0&&this.contaBlocchi++,l.set(f,a);let u=a.charCodeAt(0)===97&&a.startsWith("acqua")&&(c===void 0||c.startsWith("acqua"));this._sporca(e,o,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(e,t,o),n||(this._annotaModifica(e,t,o,a),this.onEvento&&this.onEvento({tipo:"metti",cella:[e,t,o],blocco:a}))}togli(e,t,o,a=!1){let n=be(e,o),r=this.chunks.get(n);if(!r)return!1;let l=J(e,t,o),f=r.get(l);if(!r.delete(l))return!1;this.bagnate.delete(l),this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let c=!!(f&&f.startsWith("acqua"));return this._sporca(e,o,c?this.sporchiAcqua:this.sporchi),c||this._cambiata(e,t,o),a||(this._annotaModifica(e,t,o,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[e,t,o]})),!0}bagna(e,t,o,a=0){this.bagnate.set(J(e,t,o),Math.max(0,Math.min(15,a|0))),this._sporca(e,o,this.sporchiAcqua)}asciuga(e,t,o){return this.bagnate.delete(J(e,t,o))?(this._sporca(e,o,this.sporchiAcqua),!0):!1}bagnata(e,t,o){let a=this.bagnate.get(J(e,t,o));return a===void 0?null:a}occupaFurni(e,t){for(let[o,a,n]of e)this.furni.set(J(o,a,n),t)}liberaFurni(e){for(let[t,o,a]of e)this.furni.delete(J(t,o,a))}furniIn(e,t,o){return this.furni.get(J(e,t,o))||null}occupaOmbra(e,t=!1){for(let[o,a,n]of e){let r=J(o,a,n),l=this.ombreFurni.get(r);if(l){l.n++,t&&l.op++===0&&this._cambiata(o,a,n);continue}this.ombreFurni.set(r,{x:o,y:a,z:n,n:1,op:t?1:0}),this._cambiata(o,a,n)}}liberaOmbra(e,t=!1){for(let[o,a,n]of e){let r=J(o,a,n),l=this.ombreFurni.get(r);l&&(t&&l.op>0&&--l.op===0&&l.n>1&&this._cambiata(o,a,n),!(--l.n>0)&&(this.ombreFurni.delete(r),this._cambiata(o,a,n)))}}ombraFurniIn(e,t,o){let a=this.ombreFurni.get(J(e,t,o));return a?a.op>0?2:1:0}appoggioInColonna(e,t,o,a=8){for(let n=o;n>o-a;n--)if(this.calpestabile(e,n,t))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let e of this._rev.keys())this._rev.set(e,this._rev.get(e)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let e of this.chunks.values())for(let[t,o]of e)yield{x:Oe(t),y:Ne(t),z:Ie(t),tipo:o}}perOgni(e){for(let t of this.chunks.values())for(let[o,a]of t)e(Oe(o),Ne(o),Ie(o),a)}*blocchiDelChunk(e){let t=this.chunks.get(e);if(t)for(let[o,a]of t)yield{x:Oe(o),y:Ne(o),z:Ie(o),tipo:a}}perOgniDelChunk(e,t){let o=this.chunks.get(e);if(o)for(let[a,n]of o)t(Oe(a),Ne(a),Ie(a),n)}};var ja={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},De="primavera";var We=null;function Qe(i,e,t){let o=i>>16&255,a=i>>8&255,n=i&255,r=e>>16&255,l=e>>8&255,f=e&255,c=(u,p)=>Math.round(u+(p-u)*t);return c(o,r)<<16|c(a,l)<<8|c(n,f)}function Xo(i,e){if(We){let t=De;De=We.da;let o=bo(i,e);De=We.a;let a=bo(i,e);De=t;let n=We.mix;return{cima:Je(o.cima,a.cima,n),lato:Je(o.lato,a.lato,n),fondo:Je(o.fondo,a.fondo,n),facce:o.facce,orlo:o.orlo!=null&&a.orlo!=null?Je(o.orlo,a.orlo,n):o.orlo}}return bo(i,e)}function Je(i,e,t){let o=Math.round((i>>16&255)+((e>>16&255)-(i>>16&255))*t),a=Math.round((i>>8&255)+((e>>8&255)-(i>>8&255))*t),n=Math.round((i&255)+((e&255)-(i&255))*t);return o<<16|a<<8|n}function bo(i,e){let t=W(i),o=ja[De],{cima:a,lato:n,fondo:r}=t;if(t.cappello&&o.erba&&!t.override&&(a=o.erba[xo(e,o.erba.length)]),t.reagisce==="stagione"&&o.erba){let l=o.erba[xo(e,o.erba.length)],f=t.reagisceForza??1;a=Qe(a,l,f),n=Qe(n,l,f*.45),r=Qe(r,l,f*.3)}else if(t.reagisce==="quota"){let l=xo(e,8)/7,f=(t.reagisceForza??1)*.5,c=u=>Qe(u,16777215,l*f);a=c(a),n=c(n),r=c(r)}return i==="sabbia"&&o.sabbia&&({cima:a,lato:n,fondo:r}=o.sabbia),{cima:a,lato:n,fondo:r,facce:t.facce||null,orlo:t.orlo!=null?t.orlo:void 0}}function de(i,e,t){if(i.facce){let o=e*2+(t>0?0:1),a=i.facce[o];if(a!=null)return a}return e===1?t>0?i.cima:i.fondo:i.lato}function xo(i,e=8){let t=(e-1)*2,o=(Math.round(i)%t+t)%t;return o>=e&&(o=t-o),o}function Eo(i,e,t){let o=(i|0)*374761393+(e|0)*668265263+(t|0)*2147483647;return o=(o^o>>>13)*1274126177,o=o^o>>>16,(o>>>0)%1e3/1e3}function Ka(i,e){let t=i>>16&255,o=i>>8&255,a=i&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+e))));return n(t)<<16|n(o)<<8|n(a)}function Wa(i,e,t,o,a,n){if(!e||e==="liscio"||!t)return i;let r=0;return e==="chiazze"?r=(Eo(o,a,n)-.5)*2:e==="venature"?r=(Eo(0,a,0)-.5)*2*.7+(Eo(o,a,n)-.5)*.3:e==="sfumato"&&(r=(a%16+16)%16/16-.5),Ka(i,r*t*.34)}function Yo(i,e,t,o,a,n){if(!e||e==="liscio"||!t)return i;let r=l=>Wa(l,e,t,o,a,n);return{cima:r(i.cima),lato:r(i.lato),fondo:r(i.fondo),facce:i.facce?i.facce.map(r):null}}var Ho={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},Qa=Object.keys(Ho);function $o(i){return!i||!i.materia?null:Ho[i.materia]||null}function xe(i,e,t=0){if(!e)return i;let o=(i>>16&255)/255,a=(i>>8&255)/255,n=(i&255)/255,r=.2126*o+.7152*a+.0722*n,l=e.satura;o=r+(o-r)*l,a=r+(a-r)*l,n=r+(n-r)*l;let f=e.tinta*(1+t),c=u=>Math.max(0,Math.min(255,Math.round(u*f*255)));return c(o)<<16|c(a)<<8|c(n)}var Ja=16;function Zo(i){let e=Qa.indexOf(i);return e<0||e+1>=Ja?0:e+1}var Ao=1/16,jo=8*Ao,ne=9*Ao;function Ko(i,e,t,o,a,n,r,l){let f=(u,p,m)=>[e+u,t+p,o+m];i.quad(f(-l,r,-l),f(l,r,-l),f(l,r,l),f(-l,r,l),de(a,1,1),[0,1,0]),i.quad(f(-l,n,-l),f(l,n,-l),f(l,n,l),f(-l,n,l),de(a,1,-1),[0,-1,0]);let c=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of c){let[p,,m]=u.d,s=-m,d=p,v=(h,b)=>f(p*l+s*b,h,m*l+d*b);i.quad(v(n,-l),v(r,-l),v(r,l),v(n,l),de(a,u.asse,u.segno),u.d)}}function et(i,e,t,o,a){Ko(i,e,t,o,a,-ne,0,jo)}function ot(i,e,t,o,a){Ko(i,e,t,o,a,-ne,ne,5*Ao)}function at(i,e,t,o,a){let n=(c,u,p)=>[e+c,t+u,o+p],r=de(a,0,1),l=jo,f=[[[-l,-ne,-l],[l,-ne,l],[l,ne,l],[-l,ne,-l],[1,0,-1]],[[-l,-ne,l],[l,-ne,-l],[l,ne,-l],[-l,ne,l],[1,0,1]]];for(let[c,u,p,m,s]of f)i.quad(n(...c),n(...u),n(...p),n(...m),r,s),i.quad(n(...c),n(...u),n(...p),n(...m),r,[-s[0],-s[1],-s[2]])}function tt(){}var Wo={lastra:et,pilastro:ot,croce:at,modello:tt},Ue=new Set(["lastra","pilastro","croce","modello"]);var we=1/16,it=[[0,1],[0,2],[1,2]],nt=[[1,0],[-1,0],[0,1],[0,-1]];function Ee(i,e,t,o,a,n,r,l,f){let c=[i,e,t];return c[o]+=a,c[n]+=r,c[l]+=f,c}var Qo={tinta:1,satura:1};function Jo(i,e,t,o,a,n,r=0){let l=8*we,f=9*we,c=(u,p)=>n(u===0?p:0,u===1?p:0,u===2?p:0);for(let u=0;u<3;u++)for(let p of[-1,1]){if(c(u,p))continue;let m=(u+1)%3,s=(u+2)%3,d=de(a,u,p),v=[0,0,0];v[u]=p,i.quad(Ee(e,t,o,u,p*f,m,-l,s,-l),Ee(e,t,o,u,p*f,m,+l,s,-l),Ee(e,t,o,u,p*f,m,+l,s,+l),Ee(e,t,o,u,p*f,m,-l,s,+l),d,v)}for(let[u,p]of it){let m=3-u-p;for(let s of[-1,1])for(let d of[-1,1]){if(c(u,s)||c(p,d))continue;let v=u===1&&s>0||p===1&&d>0,h=u===1&&s<0||p===1&&d<0,b=v?a.cima:h?a.fondo:a.lato,x=r?xe(b,Qo,r):b,g=[0,0,0];g[u]=s,g[p]=d,i.quad(Ee(e,t,o,u,s*f,p,d*l,m,-l),Ee(e,t,o,u,s*l,p,d*f,m,-l),Ee(e,t,o,u,s*l,p,d*f,m,+l),Ee(e,t,o,u,s*f,p,d*l,m,+l),x,g)}}for(let u of[-1,1])for(let p of[-1,1])for(let m of[-1,1])c(0,u)||c(1,p)||c(2,m)||i.tri([e+u*f,t+p*l,o+m*l],[e+u*l,t+p*f,o+m*l],[e+u*l,t+p*l,o+m*f],r?xe(p>0?a.cima:a.fondo,Qo,r):p>0?a.cima:a.fondo,[u,p,m])}function ea(i,e,t,o,a,n){let r=(s,d)=>n(s,0,d),l=n(0,-1,0),f=a.cima,c=a.lato,u=a.fondo,p=a.orlo??a.cima,m=(s,d,v)=>[e+s*we,t+d*we,o+v*we];l||i.quad(m(-8,-9,-8),m(8,-9,-8),m(8,-9,8),m(-8,-9,8),u,[0,-1,0]);for(let[s,d]of nt){if(r(s,d))continue;let v=-d,h=s,b=(g,z,C)=>m(g*s+C*v,z,g*d+C*h),x=[s,0,d];l||i.quad(b(8,-9,-8),b(9,-8,-8),b(9,-8,8),b(8,-9,8),u,[s,-1,d]),i.quad(b(9,-8,-8),b(9,2,-8),b(9,2,8),b(9,-8,8),c,x),i.quad(b(9,2,-8),b(10,3,-8),b(10,3,8),b(9,2,8),p,x),i.quad(b(10,3,-8),b(10,7,-8),b(10,7,8),b(10,3,8),p,x),i.quad(b(10,7,-8),b(9,8,-8),b(9,8,8),b(10,7,8),f,[s,1,d]),i.quad(b(8,8,-8),b(9,8,-8),b(9,8,8),b(8,8,8),f,[0,1,0])}for(let s of[-1,1])for(let d of[-1,1]){if(r(s,0)||r(0,d))continue;let v=(b,x,g)=>m(b*s,x,g*d),h=[s,0,d];l||i.tri(v(9,-8,8),v(8,-9,8),v(8,-8,9),u,[s,-1,d]),i.quad(v(9,-8,8),v(8,-8,9),v(8,2,9),v(9,2,8),c,h),i.quad(v(9,2,8),v(8,2,9),v(8,3,10),v(10,3,8),p,h),i.quad(v(10,3,8),v(8,3,10),v(8,7,10),v(10,7,8),p,h),i.quad(v(10,7,8),v(8,7,10),v(8,8,9),v(9,8,8),f,[s,1,d]),i.tri(v(8,8,8),v(9,8,8),v(8,8,9),f,[0,1,0])}i.quad(m(-8,8,-8),m(8,8,-8),m(8,8,8),m(-8,8,8),f,[0,1,0])}var To={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function oa(){for(let[i,e]of Object.entries(To))Bo(i,{nome:e.nome,cima:e.cima,lato:e.lato,fondo:e.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:e.modello,altezza:e.altezza,mezza:e.mezza},Ze)}var rt=2,zo=6,lt=256;function aa(i){if(!i)return!1;let e=W(i);return!e.acqua&&!e.vetro&&!Ue.has(e.forma)}function ia(i,e,t,o){let a=e.indexOf(","),n=+e.slice(0,a),r=+e.slice(a+1),l=n*O-zo,f=r*O-zo,c=O+2*zo,u=o-t+1,p=c,m=c*u*p,s=new Uint8Array(m),d=new Uint8Array(m),v=new Uint8Array(m),h=(C,R,_)=>((C-l)*u+(R-t))*p+(_-f),b=(C,R,_)=>C>=l&&C<l+c&&R>=t&&R<=o&&_>=f&&_<f+p,x=[];for(let C=l;C<l+c;C++)for(let R=f;R<f+p;R++){let _=!1;for(let A=o;A>=t;A--){let I=i.tipo(C,A,R),L=h(C,A,R);if(aa(I)){v[L]=1,_=!0;continue}if(!_&&A===o){for(let E=o+1;E<lt&&E<o+40;E++)if(aa(i.tipo(C,E,R))){_=!0;break}}if(_||(s[L]=15),I){let M=W(I).forma==="modello"&&To[I];M&&M.luce&&x.push([C,A+Math.round(M.luce.quota??1),R])}}}let g=[];for(let C=0;C<m;C++)s[C]===15&&g.push(C);ta(g,s,v,c,u,p,1);let z=[];for(let[C,R,_]of x){if(!b(C,R,_))continue;let A=h(C,R,_);d[A]=15,z.push(A)}return ta(z,d,v,c,u,p,rt),{x0:l,z0:f,yMin:t,yMax:o,W:c,H:u,D:p,cielo:s,blocco:d,leggi(C,R,_){if(!b(C,R,_))return R>o?[15,0]:[0,0];let A=h(C,R,_);return[s[A],d[A]]}}}function ta(i,e,t,o,a,n,r){let l=[a*n,-a*n,n,-n,1,-1],f=0;for(;f<i.length;){let c=i[f++],u=e[c]-r;if(u<=0)continue;let p=Math.floor(c/(a*n)),m=Math.floor(c/n)%a,s=c%n;for(let d=0;d<6;d++){if(d===0&&p===o-1||d===1&&p===0||d===2&&m===a-1||d===3&&m===0||d===4&&s===n-1||d===5&&s===0)continue;let v=c+l[d];t[v]||e[v]>=u||(e[v]=u,i.push(v))}}}var na=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function pe(i,e,t){let o=i*374761393+e*668265263+t*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}var eo=class{constructor(e,t=512){this.yBase=e,this.byte=new Uint8Array(t*12),this.n=0}_lamella(e,t,o,a,n,r,l,f,c,u=0,p=8){if((this.n+1)*12>this.byte.length){let d=new Uint8Array(this.byte.length*2);d.set(this.byte),this.byte=d}let m=this.n*12,s=this.byte;s[m]=e,s[m+1]=t,s[m+2]=o,s[m+3]=a,s[m+4]=n>>16&255,s[m+5]=n>>8&255,s[m+6]=n&255,s[m+7]=(r&15)<<2,s[m+8]=Math.max(1,Math.min(255,l)),s[m+9]=Math.max(1,Math.min(255,f)),s[m+10]=Math.max(0,Math.min(255,c+128)),s[m+11]=u&15|(p&15)<<4,this.n++}ciuffo(e,t,o,a,n,r,l,f=1,c=0){let u=na[Math.floor(pe(e,o,3)*na.length)],p=Math.max(1,Math.round(u.n*f*(.82+.36*pe(e,o,5)))),m=t+1-this.yBase;if(m<0||m*8>247)return 0;for(let s=0;s<p;s++){let d=pe(e,o,s*17+5),v=pe(e,o,s*17+11),h=pe(e,o,s*17+41),b=pe(e,o,s*17+59),x=Math.min(.98,.66+u.apri),g=e+.5+(d-.5)*x,z=o+.5+(v-.5)*x,C=Math.min(.8,u.alto*(.62+.8*pe(e,o,s*17+71))*(.5+.6*Math.pow(h,1.5))),R=u.largo*(.8+.4*b),_=(pe(e,o,s*17+83)-.5)*.5,A=pe(e,o,s*17+89),I=A<.15?.9+.03*A:A>.85?1.07+.03*(A-.85):.97+.06*(A-.15)/.7,L=Math.max(0,Math.min(128,Math.round((g-a)*8))),E=Math.max(0,Math.min(128,Math.round((z-n)*8))),M=Math.floor(pe(e,o,s*17+97)*255);this._lamella(L,E,Math.round(m*8),M,r,l,Math.round(C*64),Math.round(R*128),Math.round(_*128),c,Math.round((I-.9)/.2*15))}return p}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var Ae=64,st=[[1,0,0,K(1,0,0),0,1],[-1,0,0,K(-1,0,0),0,-1],[0,1,0,K(0,1,0),1,1],[0,-1,0,K(0,-1,0),1,-1],[0,0,1,K(0,0,1),2,1],[0,0,-1,K(0,0,-1),2,-1]],ra=(i,e,t)=>((e+1)*3+(t+1))*3+(i+1),Mo=class{constructor(e,t,o,a,n){this.c=e,this.ox=t,this.oz=o,this._materia=0,this.luceDi=a,this.aria=n,this._cielo=15,this._cella=null}materia(e){this._materia=e|0}cella(e,t,o){this._cella=[e,t,o]}_cieloFaccia(e){let[t,o,a]=this._cella,n=-1;for(let r=0;r<3;r++){if(!e[r])continue;let l=this.luceDi(t+(r===0?e[0]:0),o+(r===1?e[1]:0),a+(r===2?e[2]:0))[0];l>n&&(n=l)}return n<0?this.luceDi(t,o+1,a)[0]:n}_bloccoVertice(e,t){let o=Math.hypot(t[0],t[1],t[2])||1,a=e[0]+t[0]/o*.5,n=e[1]+t[1]/o*.5,r=e[2]+t[2]/o*.5,l=0,f=0;for(let c of[-.45,.45])for(let u of[-.45,.45])for(let p of[-.45,.45]){let m=Math.floor(a+c),s=Math.floor(n+u),d=Math.floor(r+p);this.aria(m,s,d)&&(l+=this.luceDi(m,s,d)[1],f++)}return f?Math.round(l/f):0}_v(e,t,o,a){return[e[0]-this.ox,e[1]+Ae,e[2]-this.oz,t,this._cielo,this._bloccoVertice(e,a),o,0,this._materia]}_giro(e,t,o,a){let n=t[0]-e[0],r=t[1]-e[1],l=t[2]-e[2],f=o[0]-e[0],c=o[1]-e[1],u=o[2]-e[2],p=r*u-l*c,m=l*f-n*u,s=n*c-r*f;return p*a[0]+m*a[1]+s*a[2]<0}tri(e,t,o,a,n){if(this._giro(e,t,o,n)){let l=t;t=o,o=l}let r=K(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(e,r,a,n),this._v(t,r,a,n),this._v(o,r,a,n),this._v(o,r,a,n))}quad(e,t,o,a,n,r){let l=K(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(e,t,o,r)){let f=t;t=a,a=f}this.c.quadDa(this._v(e,l,n,r),this._v(t,l,n,r),this._v(o,l,n,r),this._v(a,l,n,r))}};function oo(i){if(!i)return!1;let e=W(i);return!e.acqua&&!e.vetro&&!Ue.has(e.forma)}function la(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function sa(i,e,{erba:t=2,luce:o=!0}={}){let a=e.indexOf(","),n=+e.slice(0,a),r=+e.slice(a+1),l=n*O,f=r*O,c=new ze(1024),u=new ze(64),p=-1/0,m=new Int16Array(O*O).fill(-1),s=new Int16Array(O*O).fill(-1),d=new Int16Array(O*O).fill(-1),v=255,h=0,b=1/0,x=-1/0;i.perOgniDelChunk(e,(E,M)=>{M<b&&(b=M),M>x&&(x=M)});let g=o&&b<=x?ia(i,e,b-2,x+3):null,z=new eo(Number.isFinite(b)?b:0),C=(E,M,S)=>g?g.leggi(E,M,S):[15,0],R=new Mo(c,l,f,C,(E,M,S)=>!oo(i.tipo(E,M,S))),_=new Uint8Array(27),A=(E,M,S,N,U,w,Te,te)=>[E-l,M+Ae,S-f,N,w,Te,U,te?1:0,0],I=(E,M,S)=>la(i.tipo(E,M,S))||(i.bagnate?i.bagnata(E,M,S)!==null:!1);return i.perOgniDelChunk(e,(E,M,S,N)=>{let U=W(N),w=i.bagnate?i.bagnata(E,M,S):null;if(U.forma==="modello"&&U.modello==="albero")for(let q=-2;q<=2;q++)for(let D=-2;D<=2;D++){let V=q*q+D*D;if(V>4)continue;let X=E+q-l,le=S+D-f;if(X<0||X>=O||le<0||le>=O)continue;let Z=X*O+le,k=M+(V===0?4:V<=2?3:2);k>m[Z]&&(m[Z]=k)}if(U.forma==="modello"){let q=E-l,D=S-f;if(q>=0&&q<O&&D>=0&&D<O){let V=q*O+D,X=M+Math.max(1,Math.round(U.altezza||1));X>d[V]&&(d[V]=X)}}if(Ue.has(U.forma)&&w===null)return;let Te=la(N)||w!==null,te=M+Ae;if(te<0||te>254)return;let Be=(E-l)*O+(S-f);!Te&&M>m[Be]&&(m[Be]=M),!Te&&oo(N)&&M>s[Be]&&(s[Be]=M);let $=Xo(w!==null?"acqua":Vo(N),M);U.motivo&&($=Yo($,U.motivo,U.motivoForza??1,E,M,S));let ge=$o(U);ge&&($={...$,cima:xe($.cima,ge),lato:xe($.lato,ge),fondo:xe($.fondo,ge)},$.facce&&($.facce=$.facce.map(q=>q==null?q:xe(q,ge))));let _a=ge?Zo(U.materia):0;if(!Te){_.fill(0);for(let Z=-1;Z<=1;Z++)for(let k=-1;k<=1;k++)for(let j=-1;j<=1;j++)j===0&&Z===0&&k===0||oo(i.tipo(E+j,M+Z,S+k))&&(_[ra(j,Z,k)]=1);let q=(Z,k,j)=>_[ra(Z,k,j)]===1;R.materia(_a),R.cella(E,M,S);let D=E+.5,V=M+.5,X=S+.5,le=U.forma&&Wo[U.forma];le?le(R,D,V,X,$,()=>!1):U.cappello&&!q(0,1,0)?ea(R,D,V,X,$,q):Jo(R,D,V,X,$,(k,j,F)=>q(k,j,F)?j!==0?!0:!W(i.tipo(E+k,M,S+F)).cappello||q(k,1,F):!1,ge?ge.orlo:0),te-1<v&&(v=te-1),te+2>h&&(h=te+2)}let Ve=0,_e=0;if(Te)for(_e=Math.max(0,Math.min(15,w!==null?w:Go(N)||0));Ve<15&&I(E,M-1-Ve,S);)Ve++;let La=(q,D)=>{if(!I(q,M,D))return-1;let V=0;for(;V<15&&I(q,M-1-V,D);)V++;return V},Ge=(q,D)=>{let V=0,X=0;for(let le of[q-1,q])for(let Z of[D-1,D]){let k=La(le,Z);k>=0&&(V+=k,X++)}return X?Math.round(V/X):Ve};if(Te)for(let[q,D,V,X,le,Z]of st){let k=i.tipo(E+q,M+D,S+V);if(I(E+q,M+D,S+V)||k&&oo(k))continue;let j=de($,le,Z),F=E,P=M,B=S,se,ce,ue,fe;if(q===1?(se=[F+1,P,B],ce=[F+1,P+1,B],ue=[F+1,P+1,B+1],fe=[F+1,P,B+1]):q===-1?(se=[F,P,B+1],ce=[F,P+1,B+1],ue=[F,P+1,B],fe=[F,P,B]):D===1?(se=[F,P+1,B],ce=[F,P+1,B+1],ue=[F+1,P+1,B+1],fe=[F+1,P+1,B]):D===-1?(se=[F,P,B+1],ce=[F,P,B],ue=[F+1,P,B],fe=[F+1,P,B+1]):V===1?(se=[F+1,P,B+1],ce=[F+1,P+1,B+1],ue=[F,P+1,B+1],fe=[F,P,B+1]):(se=[F,P,B],ce=[F,P+1,B],ue=[F+1,P+1,B],fe=[F+1,P,B]),D===1){let Co=M+(15-2*_e)/16;Co>p&&(p=Co)}u.quadDa(A(...se,X,j,Ge(se[0],se[2]),_e,se[1]===P+1),A(...ce,X,j,Ge(ce[0],ce[2]),_e,ce[1]===P+1),A(...ue,X,j,Ge(ue[0],ue[2]),_e,ue[1]===P+1),A(...fe,X,j,Ge(fe[0],fe[2]),_e,fe[1]===P+1)),te<v&&(v=te),te+1>h&&(h=te+1)}if(U.cappello&&t>0&&!i.tipo(E,M+1,S)){let[q,D]=C(E,M+1,S);z.ciuffo(E,M,S,l,f,$.cima,q,t/2,D),M+2+Ae>h&&(h=M+2+Ae)}}),v>h&&(v=0,h=0),{...c.dati(),minY:v,maxY:h,y0:-Ae,cx:n,cz:r,altezze:m,solide:s,impronte:d,acqua:{...u.dati(),pelo:p===-1/0?null:p},erba:z.dati()}}function ca(i,e,t,o,a){let n=(o-e+1)*O,r=(a-t+1)*O,l=new Uint8Array(n*r);for(let f of i){if(!f.altezze)continue;let c=(f.cx-e)*O,u=(f.cz-t)*O;for(let p=0;p<O;p++)for(let m=0;m<O;m++){let s=f.altezze[p*O+m];l[(u+m)*n+(c+p)]=s<0?0:Math.max(0,Math.min(255,s+1))}}return{byte:l,x0:e*O,z0:t*O,larghezza:n,profondita:r}}function Re(i,e,t){let o=i*374761393+e*668265263+t*1442695041|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function ua(i){return i*i*(3-2*i)}function Ro(i,e,t){let o=Math.floor(i),a=Math.floor(e),n=ua(i-o),r=ua(e-a),l=Re(o,a,t),f=Re(o+1,a,t),c=Re(o,a+1,t),u=Re(o+1,a+1,t);return l+(f-l)*n+(c-l)*r+(l-f-c+u)*n*r}var ye=5;function fa(i,e=1,t=64){i.svuota();let o=[],a=[],n=new Map,r=[];for(let u=-t;u<=t;u++)for(let p=-t;p<=t;p++){let m=.55*Ro(u*.028,p*.028,e)+.3*Ro(u*.07,p*.07,e+11)+.15*Ro(u*.16,p*.16,e+29),s=Math.max(2,1+Math.round(Math.pow(Math.max(0,m),1.6)*22)),d=Math.max(Math.abs(u),Math.abs(p)),v=Math.min(1,Math.max(0,(t-2-d)/8)),h=v*v*(3-2*v);s=Math.round(s*h+(ye+1)*(1-h));let b=s<=ye+1;n.set(u+"|"+p,s);for(let x=0;x<s;x++){let z=x===s-1?b?"sabbia":"erba":x<s-3?"roccia":"terra";i.metti(u,x,p,z,!0)}if(s<=ye)for(let x=s;x<=ye;x++)i.metti(u,x,p,"acqua",!0);else if(!b){let x=Re(u*3+1,p*3+7,e+101);if(x>.988&&o.length<90?o.push([u,s,p]):x<.004&&a.length<14&&a.push([u,s,p]),s>=ye+6){let g=Re(u*5+3,p*5+11,e+57);g>.99&&r.push({x:u,z:p,h:s,r:g})}}}let l=ut(i,n,e,r,t),f=u=>!l.has(u[0]+"|"+u[2]),c=[...l].map(u=>{let[p,m]=u.split("|").map(Number);return[p,n.get(u)-2,m]});return{alberi:o.filter(f),lampioni:a.filter(f),fiume:c}}var ct=[[1,0],[-1,0],[0,1],[0,-1]];function ut(i,e,t,o,a=64){let n=new Set;o.sort((f,c)=>c.h-f.h||f.r-c.r);let r=[];for(let f of o){if(r.length>=5)break;r.every(c=>(c.x-f.x)**2+(c.z-f.z)**2>=784)&&r.push(f)}let l=(f,c)=>{let u=f+"|"+c;if(n.has(u))return;let p=e.get(u);i.togli(f,p-1,c,!0),i.togli(f,p-2,c,!0),i.metti(f,p-2,c,"acqua",!0),n.add(u)};for(let f of r){let c=f.x,u=f.z,p=null,m=0,s=new Set([c+"|"+u]);for(let d=0;d<500;d++){let v=e.get(c+"|"+u);if(l(c,u),p){let g=c+p[1],z=u-p[0];e.get(g+"|"+z)===v&&l(g,z)}let h=null,b=1/0,x=1/0;for(let g of ct){let z=c+g[0],C=u+g[1];if(s.has(z+"|"+C))continue;let R=e.get(z+"|"+C);if(R===void 0)continue;let _=(g===p?-.5:0)+Re(z*7+5,C*7+13,t+71);(R<b||R===b&&_<x)&&(h=g,b=R,x=_)}if(!h||b>v||(m=b===v?m+1:0,m>24)||(c+=h[0],u+=h[1],s.add(c+"|"+u),p=h,e.get(c+"|"+u)<=ye)||Math.max(Math.abs(c),Math.abs(u))>=a-6)break}}for(let f of n){let[c,u]=f.split("|").map(Number),p=e.get(f);for(let m=-1;m<=1;m++)for(let s=-1;s<=1;s++){if(!m&&!s)continue;let d=c+m+"|"+(u+s);if(n.has(d))continue;let v=e.get(d);v===void 0||v<p||v>p+1||i.tipo(c+m,v-1,u+s)==="erba"&&(i.togli(c+m,v-1,u+s,!0),i.metti(c+m,v-1,u+s,"sabbia",!0))}}return n}function ma(i){let e=new DataView(i);if(String.fromCharCode(e.getUint8(0),e.getUint8(1),e.getUint8(2),e.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let t=e.getUint32(4,!0),o=t*3,a=new Uint8Array(i,8,o*16),n=new Uint8Array(i,8+o*16,o*4),r=new Uint8Array(o*20);for(let p=0;p<o;p++)r.set(a.subarray(p*16,p*16+16),p*20),r.set(n.subarray(p*4,p*4+4),p*20+16);let l=1/0,f=-1/0,c=0,u=new DataView(r.buffer);for(let p=0;p<o;p++){let m=u.getFloat32(p*20,!0),s=u.getFloat32(p*20+4,!0),d=u.getFloat32(p*20+8,!0);l=Math.min(l,s),f=Math.max(f,s),c=Math.max(c,Math.hypot(m,d))}return{byte:r,vertici:o,triangoli:t,minY:l,maxY:f,raggio:c}}var ft=`#version 300 es
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
}`,mt=`#version 300 es
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
    // \u26A0 GLI STESSI DUE CANALI DI resa.js, e questa riga era rimasta indietro:
    // il canale R e' la silhouette col FOGLIAME (serve al sole), e usarla qui
    // rimetteva davanti alla lampada il disco di raggio due della chioma \u2014 cioe'
    // l'ombra quadrata larga cinque celle, curata nei blocchi e ancora viva sui
    // modelli. Due file che fanno la stessa cosa in due posti divergono, e si
    // vede solo dove si guarda.
    highp vec2 uvC = (cella + 0.5 - uAltRett.xy) * uAltRett.zw;
    vec4 mappa = texture(uAltezze, uvC);
    float h = mappa.g * 255.0;
    if (h > y + 0.05 && h > pos.y + 0.6) return 0.0;
    float ho = mappa.b * 255.0;                      // l'OGGETTO: il tronco, non la chioma
    if (ho > y + 0.05 && ho > pos.y + 0.3) {
      highp vec2 qui = pos.xz + (L.xz - pos.xz) * (t / lungo);
      if (length(qui - (cella + 0.5)) < 0.34) return 0.0;   // un cilindro, non un cubo
    }
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
}`;function pt(i,e=4){if(e===8)return i instanceof Float32Array?i:new Float32Array(i);let t=i.length/4,o=new Float32Array(t*8);for(let a=0;a<t;a++)o.set([i[a*4],i[a*4+1],i[a*4+2],i[a*4+3],1,1,1,0],a*8);return o}var ht=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,dt=`#version 300 es
precision mediump float;
void main() {}`,ao=class{constructor(e){this.gl=e,this.programma=oe(e,ft,mt),this.u={};for(let t of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[t]=e.getUniformLocation(this.programma,t);this.programmaOmbra=oe(e,ht,dt),this.uoVP=e.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(e,t){let o=this.gl,a={vao:o.createVertexArray(),vbo:o.createBuffer(),ibo:o.createBuffer(),vertici:t.vertici,triangoli:t.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:t.raggio,maxY:t.maxY};return o.bindVertexArray(a.vao),o.bindBuffer(o.ARRAY_BUFFER,a.vbo),o.bufferData(o.ARRAY_BUFFER,t.byte,o.STATIC_DRAW),o.enableVertexAttribArray(0),o.vertexAttribPointer(0,3,o.FLOAT,!1,20,0),o.enableVertexAttribArray(1),o.vertexAttribPointer(1,3,o.BYTE,!0,20,12),o.enableVertexAttribArray(4),o.vertexAttribIPointer(4,1,o.UNSIGNED_BYTE,20,15),o.enableVertexAttribArray(2),o.vertexAttribPointer(2,4,o.UNSIGNED_BYTE,!0,20,16),o.bindBuffer(o.ARRAY_BUFFER,a.ibo),o.enableVertexAttribArray(3),o.vertexAttribPointer(3,4,o.FLOAT,!1,32,0),o.vertexAttribDivisor(3,1),o.enableVertexAttribArray(5),o.vertexAttribPointer(5,4,o.FLOAT,!1,32,16),o.vertexAttribDivisor(5,1),o.bindVertexArray(null),this.tipi.set(e,a),a}istanze(e,t,o=4){let a=this.tipi.get(e);a&&(a.istanze=pt(t,o),a.n=a.istanze.length/8,a.sporco=!0,this.dinamici.has(e)||(this.mappaSporca=!0))}disegnaOmbra(e,t){let o=this.gl;o.useProgram(this.programmaOmbra),o.uniformMatrix4fv(this.uoVP,!1,e);let a=0,n=0;for(let[r,l]of this.tipi)l.n===0||this.dinamici.has(r)!==t||(o.bindVertexArray(l.vao),l.sporco&&(o.bindBuffer(o.ARRAY_BUFFER,l.ibo),o.bufferData(o.ARRAY_BUFFER,l.istanze,o.DYNAMIC_DRAW),l.sporco=!1),o.drawArraysInstanced(o.TRIANGLES,0,l.vertici,l.n),a++,n+=l.triangoli*l.n);return o.bindVertexArray(null),[a,n]}disegna(e,t){let o=this.gl,a=this.u,n=e.sole;o.useProgram(this.programma),o.uniformMatrix4fv(a.uVP,!1,e.vpCorrente||e.vp),o.uniform1f(a.uTaglio,e.taglio??-1e9);let r=e.vpCorrente===e.vpSpecchio?[0,0,0,0]:e.buco||[0,0,0,0];o.uniform3f(a.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),o.uniform1f(a.uTempo,e.tempo),o.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),o.uniform3f(a.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),o.uniform1f(a.uSoleForza,n.forza),o.uniform3f(a.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),o.uniform4fv(a.uMaterie,e.materie),o.uniform2f(a.uNebbia,e.nebbia.da,e.nebbia.a),o.uniform3f(a.uNebbiaCol,e.nebbia.colore[0],e.nebbia.colore[1],e.nebbia.colore[2]),o.uniform3f(a.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),o.uniform1f(a.uOmbra,e.ombra&&e.altezze?1:0),e.altezze&&(o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,e.ombre.tex),o.uniform1i(a.uOmbre,0),o.uniform2f(a.uOmbreScala,e.ombre.scala,e.ombre.offset),o.uniform4f(a.uAltRett,e.altRett[0],e.altRett[1],e.altRett[2],e.altRett[3])),e.legaMappa(a);let l=0,f=0,c=0;o.uniform1f(a.uSagoma,0);for(let[p,m]of this.tipi)m.n!==0&&(o.uniform4f(a.uBuco,r[0],r[1],r[2],p==="omino"?0:r[3]),o.bindVertexArray(m.vao),m.sporco&&(o.bindBuffer(o.ARRAY_BUFFER,m.ibo),o.bufferData(o.ARRAY_BUFFER,m.istanze,o.DYNAMIC_DRAW),m.sporco=!1),o.drawArraysInstanced(o.TRIANGLES,0,m.vertici,m.n),l++,f+=m.triangoli*m.n,c+=m.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&e.vpCorrente!==e.vpSpecchio&&(o.uniform1f(a.uSagoma,1),o.depthFunc(o.GREATER),o.depthMask(!1),o.enable(o.BLEND),o.blendFunc(o.ONE,o.ONE_MINUS_SRC_ALPHA),o.bindVertexArray(u.vao),o.drawArraysInstanced(o.TRIANGLES,0,u.vertici,u.n),o.disable(o.BLEND),o.depthMask(!0),o.depthFunc(o.LESS),o.uniform1f(a.uSagoma,0),l++),o.bindVertexArray(null),this.statistiche.disegni=l,this.statistiche.triangoli=f,this.statistiche.istanze=c}};function pa(i={}){let e=(t,o=1)=>typeof t=="number"&&isFinite(t)?+t.toFixed(o):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:e(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?e(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:e(i.fps,0),p50ms:e(i.p50,2),p99ms:e(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:e(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(t=>Math.round(t)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[]},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:e(i.worldgenMs,0),meshMs:e(i.meshMs,0)},errori:(i.errori||[]).slice(-12).map(t=>String(t).slice(0,500)),scatto:i.scatto||null}}function ha(i){return Math.round(JSON.stringify(i).length/1024)}var vt=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),he=(i,e)=>i>>>e|i<<32-e;function da(i){let e=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),t=i.length*8,o=new Uint8Array(i.length+9+63>>6<<6);o.set(i),o[i.length]=128,new DataView(o.buffer).setUint32(o.length-4,t>>>0),new DataView(o.buffer).setUint32(o.length-8,Math.floor(t/4294967296));let a=new Uint32Array(64),n=new DataView(o.buffer);for(let l=0;l<o.length;l+=64){for(let h=0;h<16;h++)a[h]=n.getUint32(l+h*4);for(let h=16;h<64;h++){let b=he(a[h-15],7)^he(a[h-15],18)^a[h-15]>>>3,x=he(a[h-2],17)^he(a[h-2],19)^a[h-2]>>>10;a[h]=a[h-16]+b+a[h-7]+x>>>0}let[f,c,u,p,m,s,d,v]=e;for(let h=0;h<64;h++){let b=he(m,6)^he(m,11)^he(m,25),x=m&s^~m&d,g=v+b+x+vt[h]+a[h]>>>0,z=he(f,2)^he(f,13)^he(f,22),C=f&c^f&u^c&u,R=z+C>>>0;v=d,d=s,s=m,m=p+g>>>0,p=u,u=c,c=f,f=g+R>>>0}e[0]=e[0]+f>>>0,e[1]=e[1]+c>>>0,e[2]=e[2]+u>>>0,e[3]=e[3]+p>>>0,e[4]=e[4]+m>>>0,e[5]=e[5]+s>>>0,e[6]=e[6]+d>>>0,e[7]=e[7]+v>>>0}let r="";for(let l of e)r+=l.toString(16).padStart(8,"0");return r}var gt="https://ntfy.sh",bt=4096;async function xt(i){let e=new TextEncoder().encode("leafy-shadows/"+i),t;if(globalThis.crypto&&crypto.subtle){let o=await crypto.subtle.digest("SHA-256",e);t=[...new Uint8Array(o)].map(a=>a.toString(16).padStart(2,"0")).join("")}else t=da(e);return"leafy-"+t.slice(0,24)}async function va(i,e){let t=await xt(i),o=await fetch(`${gt}/${t}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:e});if(!o.ok)return{ok:!1,dice:`il servizio ha detto no: ${o.status}`};let a=await o.json().catch(()=>({})),n=e.length>bt;return{ok:!0,id:a.id||"",dice:n?`mandato \u2714 (${Math.round(e.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(e.length/1024)} KB, dura 12 ore)`}}var ga="leafy.diagnostica.chiave",Et=`
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
`,to=class{constructor(e,t){this.leggi=e,this.scatta=t,this.errori=[],addEventListener("error",a=>this._errore(a.error||a.message)),addEventListener("unhandledrejection",a=>this._errore(a.reason));let o=document.createElement("style");o.textContent=Et,document.head.appendChild(o),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(e){let t=e&&e.stack?e.stack:String(e);this.errori.push(t),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(ga)||""}catch{return""}}set chiave(e){try{localStorage.setItem(ga,e)}catch{}}apri(){let e=this.pannello;e.classList.add("aperto"),e.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,e.querySelector("#diagChiudi").onclick=()=>e.classList.remove("aperto"),e.querySelector("#diagCopia").onclick=()=>this.vai(!0),e.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let t=e.querySelector("#diagNota");t&&t.focus()},30)}_dice(e){let t=this.pannello.querySelector("#diagEsito");t&&(t.textContent=e)}async vai(e){let t=this.pannello.querySelector("#diagChiave");t&&t.value.trim()&&(this.chiave=t.value.trim());let o=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let a=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,n=null;if(a)try{n=this.scatta?await this.scatta():null}catch(u){this._errore(u)}let r=pa({...this.leggi(),quando:new Date().toISOString(),nota:o,errori:this.errori,scatto:n}),l=ha(r),f=JSON.stringify(r,null,1);if(e){await this._negliAppunti(f),this.nodo.classList.remove("corso");return}let c=!1;try{let u=await fetch("/_diagnostica",{method:"GET"});c=u.ok&&(await u.json().catch(()=>({}))).collettore===!0}catch{c=!1}if(c)try{let u=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:f});if(u.status===403)this._dice("password sbagliata."),this.chiave="";else if(u.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!u.ok)this._dice("il collettore ha detto no: "+u.status);else{let p=await u.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${p.nome||""}  (${l} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let u=await va(this.chiave,f);this._dice(u.ok?u.dice+`
(fuori casa: passa dal cloud)`:u.dice),u.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(f,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(e,t=""){try{await navigator.clipboard.writeText(e),this._dice(t+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let o=new Blob([e],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(o),a.download="leafy-diagnostica.json",a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),4e3),this._dice(t+`scaricato come file \u2714
mandami quello.`)}}};var Y=document.getElementById("tela"),At=document.getElementById("stato"),Tt=document.getElementById("fps"),ee=new URLSearchParams(location.search),y={raggio:+(ee.get("raggio")||5),erba:+(ee.get("erba")??8),ombra:ee.get("ombra")!=="no",specchio:ee.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(ee.get("specchio")??.5)||.5)),dprMax:+(ee.get("dpr")||1.5),rampa:ee.has("rampa"),tutto:ee.has("tutto"),mondo:ee.has("finto")||ee.has("rampa")?0:Math.max(16,Math.min(400,+(ee.get("mondo")||48))),ora:ee.has("ora")?Math.max(0,Math.min(1,+ee.get("ora"))):null},{gl:Fe,dpr:zt,ridimensiona:Mt}=_o(Y,{antialias:!0,dprMax:y.dprMax}),T=new He(Fe),ae=new ao(Fe);T.ombra=y.ombra;T.specchio.attivo=y.specchio>0;T.specchio.scala=y.specchio||.5;T.specchio.mostra=ee.has("vedi");var so=0,Ce=0;function Aa(i,e){let t=performance.now();for(let n of[...T.chunks.keys()])T.rimuovi(n);so=0;for(let n=-i;n<i;n++)for(let r=-i;r<i;r++)T.carica(n+","+r,Do(n,r,{erba:e})),so+=256;let o=i*2*16,a=new Uint8Array(o*o);for(let n=0;n<o;n++)for(let r=0;r<o;r++)a[n*o+r]=Le(r-i*16,n-i*16)+1;T.impostaAltezze(a,-i*16,-i*16,o,o),Ce=performance.now()-t}var re=null,Ta=0,za=0;function Rt(i,e){let t=performance.now();for(let m of[...T.chunks.keys()])T.rimuovi(m);oa(),re=new Ke;let{alberi:o,lampioni:a}=fa(re,4242,i);for(let[m,s,d]of o)re.metti(m,s,d,"albero",!0);for(let[m,s,d]of a)re.metti(m,s,d,"lampione",!0);let n=performance.now()-t,r=[],l=1e9,f=1e9,c=-1e9,u=-1e9;for(let m of re.chunks.keys()){let s=sa(re,m,{erba:e});T.carica(m,s),r.push(s),l=Math.min(l,s.cx),c=Math.max(c,s.cx),f=Math.min(f,s.cz),u=Math.max(u,s.cz)}let p=ca(r,l,f,c,u);return T.impostaAltezze(p.byte,p.x0,p.z0,p.larghezza,p.profondita),so=Ta=re.contaBlocchi,za=r.length,Ce=performance.now()-t,{tGen:n,tMesh:Ce-n}}var So=null;y.mondo?So=Rt(y.mondo,y.erba):Aa(y.raggio,y.erba);async function St(){if(!re)return;let i=new Map;re.perOgni((e,t,o,a)=>{let n=W(a);n.forma!=="modello"||!n.modello||(i.has(n.modello)||i.set(n.modello,[]),i.get(n.modello).push(e+.5,t,o+.5,1))});for(let[e,t]of i)try{let o=await fetch(`./modelli/nucleo/${e}.bin`);if(!o.ok)throw new Error(`${o.status}`);ae.registra(e,ma(await o.arrayBuffer())),ae.istanze(e,t)}catch(o){console.warn(`modello ${e}: ${o.message}`)}}St();T.tutto=y.tutto;var Ct=()=>{if(!re)return Le(0,0)+2;for(let i=120;i>-Ae;i--)if(re.tipo(0,i,0))return i+2;return 8},G={alpha:-.8,beta:1.05,raggio:46,centro:[0,Ct(),0],fov:.9};function Ma(){let i=Math.sin(G.beta),e=Math.cos(G.beta);return[G.centro[0]+G.raggio*i*Math.cos(G.alpha),G.centro[1]+G.raggio*e,G.centro[2]+G.raggio*i*Math.sin(G.alpha)]}var qe=null,io=0;Y.addEventListener("pointerdown",i=>{qe={x:i.clientX,y:i.clientY},Y.setPointerCapture(i.pointerId)});Y.addEventListener("pointermove",i=>{qe&&(G.alpha+=(i.clientX-qe.x)*.006,G.beta=Math.max(.15,Math.min(1.5,G.beta-(i.clientY-qe.y)*.006)),qe={x:i.clientX,y:i.clientY})});Y.addEventListener("pointerup",()=>{qe=null});Y.addEventListener("wheel",i=>{G.raggio=Math.max(8,Math.min(140,G.raggio*(i.deltaY>0?1.1:.9))),i.preventDefault()},{passive:!1});Y.addEventListener("touchstart",i=>{i.touches.length===2&&(io=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY))},{passive:!0});Y.addEventListener("touchmove",i=>{if(i.touches.length!==2)return;let e=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY);io>0&&(G.raggio=Math.max(8,Math.min(140,G.raggio*io/e))),io=e},{passive:!0});var no=y.ora??.35;function _t(i){y.ora===null&&(no=(no+i/300)%1);let e=no*Math.PI*2-Math.PI/2,t=.24+.5*Math.max(0,Math.sin(e)),o=e*.5;T.sole.verso=[-Math.cos(o)*Math.cos(Math.asin(t)),-t,-Math.sin(o)*Math.cos(Math.asin(t))];let a=Math.max(0,Math.min(1,(Math.sin(e)+.1)*2));T.sole.forza=a;let n=Math.min(1,Math.max(0,(t-.24)/.4));T.sole.colore=[1,.78+.22*n,.55+.45*n],T.sole.cielo=[.36+.64*a,.38+.62*a,.57+.43*a],T.nebbia.colore=[.25+.47*a,.35+.5*a,.5+.42*a],Fe.clearColor(T.nebbia.colore[0],T.nebbia.colore[1],T.nebbia.colore[2],1)}var Q=[],ve=[],ro=[],ba=performance.now(),Ra=0,xa=0;function Sa(i){let e=Math.min(.1,(i-ba)/1e3);ba=i;let t=performance.now();Mt(),_t(e);let a={occhio:Ma(),centro:G.centro,fov:G.fov,rapporto:Y.width/Y.height};T.disegna(a,e,ae),ae.disegna(T,a),T.disegnaAcqua();let n=performance.now()-t;Q.push(e*1e3),Q.length>240&&Q.shift(),ve.push(n),ve.length>240&&ve.shift(),Ra++,i-xa>500&&(xa=i,Ca()),y.rampa&&!y.mondo&&Lt(i),requestAnimationFrame(Sa)}var lo=[{raggio:5,erba:2,tutto:!1},{raggio:6,erba:3,tutto:!1},{raggio:7,erba:4,tutto:!1},{raggio:6,erba:3,tutto:!0},{raggio:8,erba:4,tutto:!0}],co=[],Se=-1,Ea=0;function Lt(i){if(Se>=0&&i-Ea<6e3)return;if(Se>=0){let t=Q.slice(-Math.min(Q.length,200)),o=lo[Se];co.push({...o,fps:+(1e3/(H(t,.5)||1)).toFixed(0),p50:+H(t,.5).toFixed(1),p99:+H(t,.99).toFixed(1),js:+H(ve,.5).toFixed(2),disegni:T.statistiche.disegni,triangoli:T.statistiche.triangoli})}if(Se++,Se>=lo.length){y.rampa=!1,Ca();return}let e=lo[Se];Aa(e.raggio,e.erba),T.tutto=e.tutto,y.erba=e.erba,y.raggio=e.raggio,Q.length=0,ve.length=0,Ea=i}var H=(i,e)=>{if(!i.length)return 0;let t=i.slice().sort((o,a)=>o-a);return t[Math.min(t.length-1,Math.floor(t.length*e))]};function Ca(){let i=H(Q,.5),e=H(Q,.99),t=i?1e3/i:0;ro.push(Math.round(t)),ro.length>120&&ro.shift();let o={disegni:T.statistiche.disegni+ae.statistiche.disegni+T.statistiche.disegniAcqua+T.statistiche.disegniErba+T.statistiche.disegniSpecchio,triangoli:T.statistiche.triangoli+ae.statistiche.triangoli+T.statistiche.triangoliAcqua+T.statistiche.triangoliErba+T.statistiche.triangoliSpecchio,chunkVisti:T.statistiche.chunkVisti,chunkTotali:T.statistiche.chunkTotali};Tt.textContent=`${t.toFixed(0)} fps
${i.toFixed(1)} / ${e.toFixed(1)} ms
JS ${H(ve,.5).toFixed(2)} ms`,At.textContent=`NUCLEO ${y.mondo?`F1 \xB7 open world vero (semilato ${y.mondo}, ${za} chunk, ${Ta.toLocaleString("it")} blocchi, gen ${So.tGen.toFixed(0)} ms + mesh ${So.tMesh.toFixed(0)} ms)`:"F0"} \xB7 ${Y.width}\xD7${Y.height} (dpr ${zt.toFixed(2)})
disegni ${o.disegni}  triangoli ${o.triangoli.toLocaleString("it")}  chunk ${o.chunkVisti}/${o.chunkTotali}
ombra del sole: ${T.ombra?"horizon mapping":"spenta"} \xB7 erba ${y.erba} \xB7 modelli ${ae.statistiche.istanze} istanze in ${ae.statistiche.disegni} disegni \xB7 acqua ${T.statistiche.disegniAcqua} disegni${T.statistiche.pelo!=null?` + specchio ${T.statistiche.disegniSpecchio} disegni (pelo ${T.statistiche.pelo.toFixed(2)}, scala ${T.specchio.scala})`:" (senza specchio)"} \xB7 erba ${T.statistiche.triangoliErba.toLocaleString("it")} fili in ${T.statistiche.disegniErba} disegni \xB7 costruzione ${Ce.toFixed(0)} ms
${ke(Fe)}
?mondo=96 ?ora=0.95 ?finto ?raggio=${y.raggio} ?erba=${y.erba} ?ombra=${y.ombra?"s\xEC":"no"} ?specchio=${y.specchio||"no"} ?dpr=${y.dprMax} ?rampa ?tutto  \xB7  tocca lo schermo per girare`+(co.length?`
RAMPA  fps  p50   p99   dis  triangoli
`+co.map(a=>`r${a.raggio} e${a.erba}${a.tutto?" tutto":""}  ${String(a.fps).padStart(3)}  ${String(a.p50).padStart(5)}  ${String(a.p99).padStart(5)}  ${String(a.disegni).padStart(3)}  ${a.triangoli.toLocaleString("it")}`).join(`
`):"")+(y.rampa?`
rampa: gradino ${Se+1}/${lo.length}\u2026`:"")}requestAnimationFrame(Sa);var Ot=new to(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[Y.clientWidth,Y.clientHeight],reso:[Y.width,Y.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:y.mondo?"nucleo F1 mondo vero":"nucleo F0",mondo:y.mondo,raggio:y.raggio,erba:y.erba,ombra:T.ombra,specchio:y.specchio,disegniSpecchio:T.statistiche.disegniSpecchio,tutto:!!T.tutto,dprMax:y.dprMax,jsMs:+H(ve,.5).toFixed(2),jsP99:+H(ve,.99).toFixed(2),rampa:co},ombreLampade:!1,antialias:!0,fps:H(Q,.5)?1e3/H(Q,.5):null,p50:H(Q,.5),p99:H(Q,.99),disegni:T.statistiche.disegni+ae.statistiche.disegni+T.statistiche.disegniAcqua+T.statistiche.disegniErba+T.statistiche.disegniSpecchio,triangoli:T.statistiche.triangoli+ae.statistiche.triangoli+T.statistiche.triangoliAcqua+T.statistiche.triangoliErba+T.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:ro,storiaLivelli:[],scheda:ke(Fe),software:/swiftshader|llvmpipe/i.test(ke(Fe)),chunk:T.statistiche.chunkTotali,blocchi:so,luci:0,decorazioni:ae.statistiche.istanze,erba:T.statistiche.triangoliErba,ora:`${Math.floor(no*24)}h`,giorno:0,worldgenMs:Ce,meshMs:Ce}),()=>{let i=Ma();return T.disegna({occhio:i,centro:G.centro,fov:G.fov,rapporto:Y.width/Y.height},0),Promise.resolve(Y.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:T,modelli:ae,cam:G,opz:y,statistiche:()=>({fps:1e3/(H(Q,.5)||1),p50:H(Q,.5),p99:H(Q,.99),js:H(ve,.5),...T.statistiche,modelli:{...ae.statistiche},costruzioneMs:Ce,fotogrammi:Ra}),diagnostica:Ot};

function Se(i,{antialias:a=!0,dprMax:t=1.5}={}){let e=i.getContext("webgl2",{antialias:a,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!e)throw new Error("WebGL2 non disponibile");let o=Math.min(t,devicePixelRatio||1),n=()=>{let l=Math.max(1,Math.round(i.clientWidth*o)),r=Math.max(1,Math.round(i.clientHeight*o));return i.width!==l||i.height!==r?(i.width=l,i.height=r,e.viewport(0,0,l,r),!0):!1};return n(),{gl:e,dpr:o,ridimensiona:n}}function ea(i,a,t){let e=(n,l)=>{let r=i.createShader(n);if(i.shaderSource(r,l),i.compileShader(r),!i.getShaderParameter(r,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(r)}
${l.split(`
`).map((u,s)=>`${s+1}: ${u}`).join(`
`)}`);return r},o=i.createProgram();if(i.attachShader(o,e(i.VERTEX_SHADER,a)),i.attachShader(o,e(i.FRAGMENT_SHADER,t)),i.linkProgram(o),!i.getProgramParameter(o,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(o)}`);return o}function Ya(i){let a=i.getExtension("WEBGL_debug_renderer_info");return a?i.getParameter(a.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function K(i,a,t){return(Math.sign(i)+1)*9+(Math.sign(a)+1)*3+(Math.sign(t)+1)}var Lo=K(1,0,0),Oo=K(-1,0,0),Co=K(0,1,0),Io=K(0,-1,0),_o=K(0,0,1),No=K(0,0,-1);var Le=[Lo,Oo,Co,Io,_o,No],za=class{constructor(a=1024){this.byte=new Uint8Array(a*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(a){let t=(this.n+a)*12;if(t<=this.byte.length)return;let e=this.byte.length*2;for(;e<t;)e*=2;let o=new Uint8Array(e);o.set(this.byte),this.byte=o,this.u32=new Uint32Array(o.buffer)}vertice(a,t,e,o,n,l,r,u=0,s=0){let f=Math.round(a*16)+16,m=Math.round(e*16)+16,p=Math.round(t*16);if(f<0||f>511||m<0||m>511||p<0||p>65535)throw new RangeError(`vertice fuori dal chunk: ${a},${t},${e}`);if(o<0||o>26||o===13)throw new RangeError(`normale non valida: ${o}`);this._spazio(1);let c=this.n*3,d=this.byte,h=this.u32;h[c]=(f|m<<9|(o&31)<<18|(u&1)<<23|(s&15)<<24)>>>0,h[c+1]=(p|(n&15)<<16|(l&15)<<20)>>>0;let v=this.n*12+8;d[v]=r>>16&255,d[v+1]=r>>8&255,d[v+2]=r&255,d[v+3]=0,this.n++}quadDa(a,t,e,o){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[a,t,e,o])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function Oe(i=16384){let a=new Uint16Array(i*6);for(let t=0,e=0,o=0;t<i;t++,o+=4)a[e++]=o,a[e++]=o+1,a[e++]=o+2,a[e++]=o,a[e++]=o+2,a[e++]=o+3;return a}function Ce(i,a,t,e){let o=1/Math.tan(i/2),n=1/(t-e);return new Float32Array([o/a,0,0,0,0,o,0,0,0,0,(e+t)*n,-1,0,0,2*e*t*n,0])}function me(i,a,t){let e=1/(t-a);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*e,0,0,0,-(t+a)*e,1])}function Ha(i,a,t=[0,1,0]){let e=i[0]-a[0],o=i[1]-a[1],n=i[2]-a[2],l=Math.hypot(e,o,n)||1;e/=l,o/=l,n/=l;let r=t[1]*n-t[2]*o,u=t[2]*e-t[0]*n,s=t[0]*o-t[1]*e;l=Math.hypot(r,u,s)||1,r/=l,u/=l,s/=l;let f=o*s-n*u,m=n*r-e*s,p=e*u-o*r;return new Float32Array([r,f,e,0,u,m,o,0,s,p,n,0,-(r*i[0]+u*i[1]+s*i[2]),-(f*i[0]+m*i[1]+p*i[2]),-(e*i[0]+o*i[1]+n*i[2]),1])}function Ie(i,a=new Float32Array(16)){let[t,e,o,n,l,r,u,s,f,m,p,c,d,h,v,b]=i,x=t*r-e*l,g=t*u-o*l,E=t*s-n*l,S=e*u-o*r,T=e*s-n*r,L=o*s-n*u,z=f*h-m*d,_=f*v-p*d,O=f*b-c*d,C=m*v-p*h,N=m*b-c*h,A=p*b-c*v,R=x*A-g*N+E*C+S*O-T*_+L*z;return R?(R=1/R,a[0]=(r*A-u*N+s*C)*R,a[1]=(o*N-e*A-n*C)*R,a[2]=(h*L-v*T+b*S)*R,a[3]=(p*T-m*L-c*S)*R,a[4]=(u*O-l*A-s*_)*R,a[5]=(t*A-o*O+n*_)*R,a[6]=(v*E-d*L-b*g)*R,a[7]=(f*L-p*E+c*g)*R,a[8]=(l*N-r*O+s*z)*R,a[9]=(e*O-t*N-n*z)*R,a[10]=(d*T-h*E+b*x)*R,a[11]=(m*E-f*T-c*x)*R,a[12]=(r*_-l*C-u*z)*R,a[13]=(t*C-e*_+o*z)*R,a[14]=(h*g-d*S-v*x)*R,a[15]=(f*S-m*g+p*x)*R,a):null}function Da(i,a,t=new Float32Array(16)){for(let e=0;e<4;e++)for(let o=0;o<4;o++)t[e*4+o]=i[o]*a[e*4]+i[4+o]*a[e*4+1]+i[8+o]*a[e*4+2]+i[12+o]*a[e*4+3];return t}function Ua(i,a=new Float32Array(24)){let t=u=>[i[u],i[4+u],i[8+u],i[12+u]],e=t(0),o=t(1),n=t(2),l=t(3),r=[[l[0]+e[0],l[1]+e[1],l[2]+e[2],l[3]+e[3]],[l[0]-e[0],l[1]-e[1],l[2]-e[2],l[3]-e[3]],[l[0]+o[0],l[1]+o[1],l[2]+o[2],l[3]+o[3]],[l[0]-o[0],l[1]-o[1],l[2]-o[2],l[3]-o[3]],[l[0]+n[0],l[1]+n[1],l[2]+n[2],l[3]+n[3]],[l[0]-n[0],l[1]-n[1],l[2]-n[2],l[3]-n[3]]];for(let u=0;u<6;u++){let[s,f,m,p]=r[u],c=Math.hypot(s,f,m)||1;a[u*4]=s/c,a[u*4+1]=f/c,a[u*4+2]=m/c,a[u*4+3]=p/c}return a}function Ca(i,a,t,e,o,n,l){for(let r=0;r<6;r++){let u=i[r*4],s=i[r*4+1],f=i[r*4+2],m=i[r*4+3],p=u>0?o:a,c=s>0?n:t,d=f>0?l:e;if(u*p+s*c+f*d+m<0)return!1}return!0}var qo=.08,Fo=4,Po=120,pe=2,Do=`#version 300 es
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
}`,_e=`#version 300 es
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
// \u26A0 IL COLORE DELLA LAMPADA \xC8 UN DATO, non pi\xF9 una costante nello shader. Fino
// al 10/09/2026 qui c'era vec3(1.30, 1.02, 0.58) scritto a mano: TUTTE le
// lampade del gioco facevano la stessa pozza calda, e def.luce.colore \u2014 che
// esiste da sempre in blocks.js, con tanto di lucciola verde e lampade rossa,
// verde e blu \u2014 non arrivava a schermo. \xABLuci colorate\xBB era una casella vuota.
// xyz = la tinta gi\xE0 moltiplicata per l'intensit\xE0, w = la QUOTA della lanterna
// sopra la cella (2,6 per il lampione, 0 per un blocco-lampada).
uniform highp vec4 uLampCol[8];
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
float ombraLampada(highp vec3 pos0, vec3 n, highp vec3 L) {
  // SI PARTE APPENA FUORI DALLA SUPERFICIE, non dal pixel: sulla faccia di un
  // blocco pos.xz cade ESATTAMENTE sul confine fra due celle e floor sceglie a
  // testa o croce secondo l'arrotondamento, quindi meta' dei pixel di una faccia
  // partivano dalla cella del blocco e meta' da quella d'aria. Uno scostamento
  // lungo la normale lo decide, e sempre nello stesso verso.
  highp vec3 pos = pos0 + n * 0.02;
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 cellaLampada = floor(L.xz);   // la sua cella non fa ombra a se stessa
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
    // IL MARGINE E' PICCOLO, e prima era 0,6. Serve solo perche' la colonna su cui
    // si posa il pixel non si faccia ombra da se': a 0,6 nessun ostacolo alto meno
    // di sei decimi PIU' del pixel poteva fermare la luce, e sulla faccia di spalle
    // di un muro restava accesa una FASCIA in cima alta sei decimi di blocco \u2014
    // \xABuna luce fantasma illuminante dalla faccia che dovrebbe essere in ombra\xBB.
    // E LA CELLA DELLA LAMPADA NON FA OMBRA A SE STESSA NEANCHE QUI. La stessa
    // guardia c'era gia' sul canale degli OGGETTI, e mancava su questo: finche'
    // le lampade erano solo lampioni (modelli, che nel terreno non ci sono) non
    // si vedeva. Un BLOCCO-lampada e' solido, quindi sta nel canale del terreno,
    // e il raggio verso di lui entra PER FORZA nella sua cella: ogni lampada
    // appoggiata a terra si spegneva da sola, tutta, e non accendeva niente.
    if (h > y + 0.05 && h > pos.y + 0.05 && !all(equal(cella, cellaLampada))) return 0.0;
    float ho = mappa.b * 255.0;
    // \u26A0 LA CELLA DELLA LAMPADA NON FA OMBRA A SE STESSA. Il lampione e' un
    // oggetto anche lui (canale B, alto tre celle) e il raggio verso la sua
    // lanterna passa NECESSARIAMENTE per la sua cella: senza questa riga ogni
    // lampione si spegneva da solo la pozza oltre il primo blocco. Trovato non
    // guardando lo schermo ma rifacendo il cammino in JavaScript sui dati veri
    // e interrogandolo in punti scelti \u2014 a schermo sembrava solo \xABuna pozza un
    // po' piccola\xBB, che e' il genere di cosa che non fa sospettare niente.
    if (ho > pos.y + 0.3 && !all(equal(cella, cellaLampada))) {
      // \u26A0 LA DISTANZA SI MISURA AL PUNTO PIU' VICINO, non dove il raggio ENTRA
      // nella cella. La prima stesura usava il punto d'ingresso, che sta per
      // costruzione sul BORDO della cella: da li' il centro e' sempre almeno
      // mezza cella lontano, e una soglia di un terzo non poteva scattare MAI.
      // Il controllo c'era, era scritto, e non poteva essere vero \u2014 ed e' il
      // motivo per cui \xABl'ombra non avviene dai lampioni se c'e' un albero
      // davanti\xBB. Un difetto che non si vede leggendo: si vede solo mettendo
      // un albero davanti a un lampione di notte e guardando.
      highp vec2 ac = (cella + 0.5) - pos.xz;
      highp float tc = clamp(dot(ac, dir), 0.0, lungo);
      highp float dist = length(ac - dir * tc);
      highp float yc = pos.y + (L.y - pos.y) * (tc / lungo);
      // \u26A0 L'OGGETTO E' UN CONO, non un palo. In basso c'e' il tronco (stretto),
      // in alto la chioma (larga): un albero che fermasse la luce solo col
      // tronco farebbe un'ombra che non somiglia a un albero. La base la dice
      // il terreno di quella colonna (canale G), la cima l'oggetto (canale B).
      float base = max(h, pos.y);
      float su = clamp((yc - base) / max(1.0, ho - base), 0.0, 1.0);
      float raggio = mix(0.30, 0.85, smoothstep(0.10, 0.70, su));
      if (dist < raggio && ho > yc + 0.05) return 0.0;
    }
  }
  return 1.0;
}
vec3 pozza(highp vec3 pos, vec3 n, float cotto) {
  float peso = 0.0;
  vec3 tinta = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 lanterna = uLampade[i].xyz + vec3(0.0, uLampCol[i].w, 0.0);
    // LA FACCIA CHE GUARDA DALL'ALTRA PARTE NON E' ILLUMINATA, e basta: e' un
    // SI'/NO, non un dot sfumato \u2014 la regola della casa dice \xABo vede la luce o
    // no\xBB, e una rampa di N dot L sarebbe il face shading che qui e' vietato.
    // Senza questa riga la pozza passava ATTRAVERSO i blocchi e accendeva la
    // faccia di dietro.
    // E NON LA PUO' FARE ombraLampada: quella cammina una mappa di ALTEZZE, che
    // per costruzione non sa da che parte del muro sta il pixel. Misurato: sulla
    // faccia di spalle di un muro, alla quota della cima, NESSUN margine per
    // quanto piccolo la spegne. Solo la normale lo sa.
    // E COSTA MENO DI NIENTE: chi e' di spalle salta le quattordici letture.
    if (dot(n, lanterna - pos) <= 0.0) continue;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    float a = anello * ombraLampada(pos, n, lanterna);
    peso += a;
    tinta += a * uLampCol[i].rgb;
  }
  // IL PESO SI SATURA, IL COLORE NO: due pozze che si sovrappongono non
  // sbiancano, prendono la MEDIA delle due tinte a piena forza. Sommando i
  // colori, un rosso e un verde vicini davano giallo pieno \u2014 che non e' nessuna
  // delle due lampade. Con una lampada sola il conto e' identico a prima.
  if (peso <= 0.0) return vec3(0.0);
  return (tinta / peso) * min(peso, 1.0);
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
  vec3 lamp = pozza(vPos, vN, vBlocco) * notte;
  float sole = vSole * step(0.99, vCielo) * luce;
  // l'ombra: il colore stilizzato (hue shift), tinto dal giorno/notte, pi\xF9 scuro senza cielo
  vec3 ombra = vOmbra * uCieloCol * (0.30 + 0.70 * cieloB);
  vec3 pieno = vBase * uSoleCol;
  if (vEmis > 0.0) { ombra = mix(ombra, vBase * 1.15, vEmis); pieno = mix(pieno, vBase * 1.15, vEmis); }   // emissiva: scavalca ombra e notte
  // \u26A0 LE POZZE DEI LAMPIONI SONO CALDE E PIENE: 1,3 sopra il bianco
  vec3 c = mix(ombra, pieno, sole) + vBase * lamp;
  // \u26A0 I CONTI SONO IN SPAZIO LINEARE: qui si torna in sRGB, o tutto esce scuro e saturo.
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, 1.0);
}`,Uo=`#version 300 es
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
}`,wo=`#version 300 es
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
}`,Bo=`#version 300 es
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
}`,Vo=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,Go=`#version 300 es
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
}`,ko=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Xo=`#version 300 es
precision mediump float;
void main() {}`,Za=class{constructor(a){this.gl=a,this.programma=ea(a,Do,_e),this.u={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[t]=a.getUniformLocation(this.programma,t);this.ebo=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.ebo),a.bufferData(a.ELEMENT_ARRAY_BUFFER,Oe(16384),a.STATIC_DRAW),this.programmaErba=ea(a,Bo,_e.replace(/flat in /g,"in ")),this.ue={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.ue[t]=a.getUniformLocation(this.programmaErba,t);this.programmaOmbra=ea(a,ko,Xo),this.uo={uVP:a.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:a.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=ea(a,Uo,wo),this.ua={};for(let t of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[t]=a.getUniformLocation(this.programmaAcqua,t);this.programmaCielo=ea(a,Vo,Go),this.uc={};for(let t of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[t]=a.getUniformLocation(this.programmaCielo,t);this.vaoVuoto=a.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=a.createSampler(),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_MIN_FILTER,a.LINEAR),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_MAG_FILTER,a.LINEAR),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.pianiCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(1024),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,colonne:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!a.getExtension("EXT_color_buffer_half_float")&&!!a.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.lampadeCol=new Float32Array(32),this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,a.enable(a.DEPTH_TEST),a.enable(a.CULL_FACE),a.cullFace(a.BACK),a.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(a,t){let e=this.mappa;Math.hypot(a+8-e.centro[0],t+8-e.centro[2])<=e.raggio+12&&(e.sporca=!0)}carica(a,t){let e=this.gl;this._sporcaMappa(t.cx*16,t.cz*16);let o=this.chunks.get(a);o||(o={vao:e.createVertexArray(),vbo:e.createBuffer(),quad:0},e.bindVertexArray(o.vao),e.bindBuffer(e.ARRAY_BUFFER,o.vbo),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null),this.chunks.set(a,o)),e.bindBuffer(e.ARRAY_BUFFER,o.vbo),e.bufferData(e.ARRAY_BUFFER,t.byte,e.STATIC_DRAW),o.quad=t.quad;let n=t.erba;o.verticiErba=n?n.vertici:0,o.lamelle=n?n.fili:0,o.yBaseErba=n?n.yBase:0,o.verticiErba>0&&(o.vaoErba||(o.vaoErba=e.createVertexArray(),o.vboErba=e.createBuffer(),e.bindVertexArray(o.vaoErba),e.bindBuffer(e.ARRAY_BUFFER,o.vboErba),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,4,e.UNSIGNED_BYTE,12,0),e.vertexAttribDivisor(0,1),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,4),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribIPointer(2,4,e.UNSIGNED_BYTE,12,8),e.vertexAttribDivisor(2,1),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,o.vboErba),e.bufferData(e.ARRAY_BUFFER,n.byte,e.STATIC_DRAW));let l=t.acqua;if(o.quadAcqua=l?l.quad:0,o.peloAcqua=l&&l.pelo!=null?l.pelo:null,o.quadAcqua>0&&(o.vaoAcqua||(o.vaoAcqua=e.createVertexArray(),o.vboAcqua=e.createBuffer(),e.bindVertexArray(o.vaoAcqua),e.bindBuffer(e.ARRAY_BUFFER,o.vboAcqua),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,o.vboAcqua),e.bufferData(e.ARRAY_BUFFER,l.byte,e.STATIC_DRAW)),o.luci=t.luci||[],o.x0=t.cx*16,o.z0=t.cz*16,o.minY=t.minY,o.maxY=t.maxY,o.y0=t.y0||0,o.chunk=[o.x0,o.y0,o.z0],t.altezze){o.tegola||(o.tegola=new Uint8Array(1024));let r=t.solide||t.altezze,u=t.impronte;for(let s=0;s<16;s++)for(let f=0;f<16;f++){let m=(f*16+s)*4,p=s*16+f,c=t.altezze[p],d=r[p],h=u?u[p]:-1;o.tegola[m]=c<0?0:Math.max(0,Math.min(255,c+1)),o.tegola[m+1]=d<0?0:Math.max(0,Math.min(255,d+1)),o.tegola[m+2]=h<0?0:Math.max(0,Math.min(255,h+1)),o.tegola[m+3]=255}this.finestra&&this._scriviTegola(o)}}apriFinestraAltezze(a,t,e=512){let o=this.gl;this.altezze||(this.altezze=o.createTexture()),this.finestra={lato:e,x0:0,z0:0,vuota:new Uint8Array(e*e*4),spostamenti:0},o.bindTexture(o.TEXTURE_2D,this.altezze),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),this._centraFinestra(a,t,!0)}seguiAltezze(a,t){this.finestra&&this._centraFinestra(a,t,!1)}_centraFinestra(a,t,e){let o=this.gl,n=this.finestra,l=n.lato/2;if(!e&&Math.abs(a-(n.x0+l))<n.lato/4&&Math.abs(t-(n.z0+l))<n.lato/4)return!1;n.x0=Math.floor((a-l)/16)*16,n.z0=Math.floor((t-l)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.colonne!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,this.ombre.w,this.ombre.h],o.bindTexture(o.TEXTURE_2D,this.altezze),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,n.lato,n.lato,0,o.RGBA,o.UNSIGNED_BYTE,n.vuota);for(let r of this.chunks.values())r.tegola&&this._scriviTegola(r);return n.spostamenti++,!0}_scriviTegola(a,t=!1){let e=this.gl,o=this.finestra,n=a.x0-o.x0,l=a.z0-o.z0;n<0||l<0||n+16>o.lato||l+16>o.lato||(e.bindTexture(e.TEXTURE_2D,this.altezze),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,n,l,16,16,e.RGBA,e.UNSIGNED_BYTE,t?this._tegolaVuota:a.tegola),this._sporcaOmbre(n,l,16,16))}evidenzia(a,t,e,o=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=ea(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let l=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(l.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(l.uCella,a,t,e,.11),n.uniform3f(l.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(l.uCella,a,t,e,.1),n.uniform3f(l.uColore,1,1-.45*o,1-.8*o),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(a,t,e,o,n,l,r=.3,u=.1){let s=this.gl;this.programmaPieno||(this.programmaPieno=ea(s,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:s.getUniformLocation(this.programmaPieno,"uVP"),uCella:s.getUniformLocation(this.programmaPieno,"uCella"),uColore:s.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=s.createVertexArray());let f=this.uPieno;s.useProgram(this.programmaPieno),s.uniformMatrix4fv(f.uVP,!1,this.vp),s.uniform4f(f.uCella,a,t,e,u),s.uniform4f(f.uColore,o*r,n*r,l*r,r),s.bindVertexArray(this.vaoPieno),s.enable(s.BLEND),s.blendFunc(s.ONE,s.ONE_MINUS_SRC_ALPHA),s.depthMask(!1),s.disable(s.CULL_FACE),s.drawArrays(s.TRIANGLES,0,36),s.enable(s.CULL_FACE),s.depthMask(!0),s.disable(s.BLEND),s.bindVertexArray(null)}rimuovi(a){let t=this.chunks.get(a);t&&(this._sporcaMappa(t.x0,t.z0),this.finestra&&t.tegola&&this._scriviTegola(t,!0),this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.vbo),t.vaoAcqua&&(this.gl.deleteVertexArray(t.vaoAcqua),this.gl.deleteBuffer(t.vboAcqua)),t.vaoErba&&(this.gl.deleteVertexArray(t.vaoErba),this.gl.deleteBuffer(t.vboErba)),this.chunks.delete(a))}_sporcaOmbre(a,t,e,o){let l=[Math.max(0,a-26),Math.max(0,t-26),Math.min(this.ombre.w||1e9,a+e+26),Math.min(this.ombre.h||1e9,t+o+26)],r=this.ombre.sporco;this.ombre.sporco=r?[Math.min(r[0],l[0]),Math.min(r[1],l[1]),Math.max(r[2],l[2]),Math.max(r[3],l[3])]:l}_preparaOmbre(a,t){let e=this.gl,o=this.ombre;o.colonne=a;let n=a*pe,l=t*pe;if(o.tex||(o.tex=e.createTexture(),o.fbo=e.createFramebuffer()),e.bindTexture(e.TEXTURE_2D,o.tex),o.mezzoFloat=this._ombreMezzo,o.mezzoFloat?(e.texImage2D(e.TEXTURE_2D,0,e.R16F,n,l,0,e.RED,e.HALF_FLOAT,null),o.scala=1,o.offset=0):(e.texImage2D(e.TEXTURE_2D,0,e.R8,n,l,0,e.RED,e.UNSIGNED_BYTE,null),o.scala=64,o.offset=-8),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,o.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o.tex,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&o.mezzoFloat)return this._ombreMezzo=!1,e.bindFramebuffer(e.FRAMEBUFFER,null),this._preparaOmbre(a,t);if(e.bindFramebuffer(e.FRAMEBUFFER,null),o.w=n,o.h=l,o.sporco=[0,0,n,l],!this.programmaOmbre){this.programmaOmbre=ea(e,`#version 300 es
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
}`),this.uOmbre={};for(let r of["uAltezze","uAltRett","uSole","uCodifica","uSuper"])this.uOmbre[r]=e.getUniformLocation(this.programmaOmbre,r);this.vaoOmbre=e.createVertexArray()}}_calcolaOmbre(){let a=this.gl,t=this.ombre,e=this.sole;if(!this.altezze||!t.tex||(e.verso[0]*t.sole[0]+e.verso[1]*t.sole[1]+e.verso[2]*t.sole[2]<.99996&&(t.sole=e.verso.slice(),t.sporco=[0,0,t.w,t.h]),!t.sporco))return;let n=96,[l,r,u,s]=t.sporco;if(u<=l||s<=r){t.sporco=null;return}let f=Math.min(s,r+n);t.sporco=f>=s?null:[l,f,u,s];let m=Math.hypot(e.verso[0],e.verso[2])||1e-4,p=[-e.verso[0]/m,-e.verso[2]/m],c=Math.max(.05,-e.verso[1]/m);a.bindFramebuffer(a.FRAMEBUFFER,t.fbo),a.viewport(0,0,t.w,t.h),a.enable(a.SCISSOR_TEST),a.scissor(l,r,u-l,f-r),a.disable(a.DEPTH_TEST),a.disable(a.CULL_FACE),a.useProgram(this.programmaOmbre),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.altezze),a.uniform1i(this.uOmbre.uAltezze,0),a.bindSampler(0,this.campionatoreLiscio),a.uniform4f(this.uOmbre.uAltRett,0,0,1/t.w,1/t.h),a.uniform3f(this.uOmbre.uSole,p[0],p[1],c),a.uniform2f(this.uOmbre.uCodifica,t.scala,t.offset),a.uniform1f(this.uOmbre.uSuper,pe),a.bindVertexArray(this.vaoOmbre),a.drawArrays(a.TRIANGLES,0,3),a.bindVertexArray(null),a.bindSampler(0,null),a.disable(a.SCISSOR_TEST),a.enable(a.DEPTH_TEST),a.enable(a.CULL_FACE),a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),t.calcoli++,this.statistiche.calcoliOmbre=t.calcoli}_disegnaCielo(a,t){let e=this.gl,o=this.uc,n=this.sole;if(this.cieloNero||!Ie(a,this._invVP))return;e.useProgram(this.programmaCielo),e.uniformMatrix4fv(o.uInvVP,!1,this._invVP),e.uniform3f(o.uOcchio,t[0],t[1],t[2]),e.uniform3f(o.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform1f(o.uSoleForza,n.forza),e.uniform3f(o.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let l=n.forza;e.uniform3f(o.uZenit,.04+.32*l,.06+.56*l,.14+.82*l),e.disable(e.DEPTH_TEST),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vaoVuoto),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.enable(e.CULL_FACE),e.depthMask(!0),e.enable(e.DEPTH_TEST)}_preparaMappa(){let a=this.gl,t=this.mappa,e=o=>{let n=a.createTexture();a.bindTexture(a.TEXTURE_2D,n),a.texImage2D(a.TEXTURE_2D,0,a.DEPTH_COMPONENT24,o,o,0,a.DEPTH_COMPONENT,a.UNSIGNED_INT,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_COMPARE_FUNC,a.LEQUAL);let l=a.createFramebuffer();a.bindFramebuffer(a.FRAMEBUFFER,l),a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,n,0),a.drawBuffers([a.NONE]),a.readBuffer(a.NONE);let r=a.checkFramebufferStatus(a.FRAMEBUFFER)===a.FRAMEBUFFER_COMPLETE;return a.bindFramebuffer(a.FRAMEBUFFER,null),{tex:n,fbo:l,lato:o,ok:r}};t.stat=e(t.lato),t.din=e(t.latoDin),(!t.stat.ok||!t.din.ok)&&(t.attiva=!1)}legaMappa(a){let t=this.gl,e=this.mappa;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,e.stat.tex),t.uniform1i(a.uMappaStat,1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,e.din.tex),t.uniform1i(a.uMappaDin,2),t.activeTexture(t.TEXTURE0),t.uniform1f(a.uMappaOn,e.on?1:0),t.uniformMatrix4fv(a.uLuceVP,!1,e.vp),t.uniformMatrix4fv(a.uLuceVPDin,!1,e.vpDin),t.uniform2f(a.uMappaTexel,.5/e.lato,.5/e.latoDin),t.uniform2f(a.uMappaSbieco,1.5*(2*e.raggio/e.lato),.1/220),t.uniform4fv(a.uLampade,this.lampade),t.uniform1i(a.uNLampade,this.nLampade),t.uniform4fv(a.uLampCol,this.lampadeCol),t.uniform3f(a.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(a.uAltezze,3),t.activeTexture(t.TEXTURE0))}_aggiornaMappa(a,t){let e=this.gl,o=this.mappa,n=this.sole,l=this.statistiche;if(o.on=!1,!o.attiva||!this.ombra)return;let r=typeof performance<"u"?performance.now():0,u=a.centro[0],s=a.centro[2],f=!1;Math.hypot(u-o.centro[0],s-o.centro[2])>10&&(o.centro=[Math.round(u/2)*2,Math.round(a.centro[1]),Math.round(s/2)*2],f=!0);{let g=n.verso,E=a.centro,S=[E[0]-g[0]*120,E[1]-g[1]*120,E[2]-g[2]*120],T=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Da(me(o.raggioDin,10,230),Ha(S,E,T),o.vpDin)}let m=Math.max(.12,-n.verso[1]),p=qo*m*m/Fo;n.verso[0]*o.sole[0]+n.verso[1]*o.sole[1]+n.verso[2]*o.sole[2]<Math.cos(p)&&(o.soleMosso=!0);let d=o.sporca||o.soleMosso||t&&t.mappaSporca,h=o.soleMosso&&!o.sporca?Po:500,v=f||d&&r-(o.ultimo||0)>=h;if(v){o.sole=n.verso.slice(),o.soleMosso=!1,o.ultimo=r;let g=n.verso,E=o.centro,S=[E[0]-g[0]*120,E[1]-g[1]*120,E[2]-g[2]*120],T=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Da(me(o.raggio,10,230),Ha(S,E,T),o.vp)}if(e.enable(e.POLYGON_OFFSET_FILL),e.polygonOffset(1.5,4),v){e.bindFramebuffer(e.FRAMEBUFFER,o.stat.fbo),e.viewport(0,0,o.stat.lato,o.stat.lato),e.clear(e.DEPTH_BUFFER_BIT),e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uo.uVP,!1,o.vp);let g=0,E=0,S=o.raggio+12;for(let T of this.chunks.values())T.quad!==0&&(Math.hypot(T.x0+8-o.centro[0],T.z0+8-o.centro[2])>S||(e.uniform3f(this.uo.uChunk,T.chunk[0],T.chunk[1],T.chunk[2]),e.bindVertexArray(T.vao),e.drawElements(e.TRIANGLES,T.quad*6,e.UNSIGNED_SHORT,0),g++,E+=T.quad*2));if(e.bindVertexArray(null),t){let[T,L]=t.disegnaOmbra(o.vp,!1);g+=T,E+=L,t.mappaSporca=!1}o.sporca=!1,o.calcoli++,o.disegni=g,o.triangoli=E}e.bindFramebuffer(e.FRAMEBUFFER,o.din.fbo),e.viewport(0,0,o.din.lato,o.din.lato),e.clear(e.DEPTH_BUFFER_BIT);let b=0,x=0;t&&([b,x]=t.disegnaOmbra(o.vpDin,!0)),e.disable(e.POLYGON_OFFSET_FILL),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),o.on=!0,l.calcoliMappa=o.calcoli,l.disegniOmbra=b+(v?o.disegni:0),l.triangoliOmbra=x+(v?o.triangoli:0)}impostaAltezze(a,t,e,o,n,l=null){let r=this.gl;this.altezze||(this.altezze=r.createTexture()),r.bindTexture(r.TEXTURE_2D,this.altezze),r.pixelStorei(r.UNPACK_ALIGNMENT,1);let u=new Uint8Array(o*n*4);for(let s=0;s<o*n;s++)u[s*4]=a[s],u[s*4+1]=l?l[s]:a[s];r.texImage2D(r.TEXTURE_2D,0,r.RGBA8,o,n,0,r.RGBA,r.UNSIGNED_BYTE,u),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),this.altRett=[t,e,1/o,1/n],this._preparaOmbre(o,n)}impostaMaterie(a){let t=new Float32Array(64);for(let e=0;e<16&&e<a.length;e++)for(let o=0;o<4;o++)t[e*4+o]=a[e][o]||0;this.materie=t}disegna(a,t,e=null){let o=this.gl,n=this.statistiche;this.tempo+=t;let l=Ce(a.fov,a.rapporto,.3,400),r=Ha(a.occhio,a.centro);Da(l,r,this.vp),Ua(this.vp,this.piani),this._camera=a,this._visibili.length=0,this._visibiliErba.length=0;let u=0;for(let c of this.chunks.values())c.quad===0&&c.quadAcqua===0||(c.visto=this.tutto||Ca(this.piani,c.x0,c.y0+c.minY,c.z0,c.x0+16,c.y0+c.maxY+1,c.z0+16),c.visto&&(u++,c.quadAcqua>0&&this._visibili.push(c),c.verticiErba>0&&Math.hypot(c.x0+8-a.occhio[0],c.z0+8-a.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(c)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(a,e),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(a,e),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,a.occhio),this.taglio=-1e9,this.vpCorrente=this.vp,this.pianiCorrente=this.piani;let[s,f]=this._solidi(this.vp,this.piani,a.occhio,!1),m=0,p=0;if(this._visibiliErba.length){let c=this.ue,d=this.sole;o.useProgram(this.programmaErba),o.uniformMatrix4fv(c.uVP,!1,this.vp),o.uniform1f(c.uTempo,this.tempo),o.uniform3f(c.uSoleVerso,d.verso[0],d.verso[1],d.verso[2]),o.uniform3f(c.uSoleCol,d.colore[0],d.colore[1],d.colore[2]),o.uniform1f(c.uSoleForza,d.forza),o.uniform3f(c.uCieloCol,d.cielo[0],d.cielo[1],d.cielo[2]),o.uniform2f(c.uNebbia,this.nebbia.da,this.nebbia.a),o.uniform3f(c.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),o.uniform3f(c.uCam,a.occhio[0],a.occhio[1],a.occhio[2]),o.uniform2f(c.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),o.uniform1f(c.uOmbra,this.ombra&&this.altezze?1:0),o.uniform1f(c.uTaglio,-1e9),o.uniform1f(c.uErbaFinoA,this.erbaFinoA),o.uniform4f(c.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),o.uniform3f(c.uOcchio,a.occhio[0],a.occhio[1],a.occhio[2]),this.altezze&&(o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.ombre.tex),o.uniform1i(c.uOmbre,0),o.uniform2f(c.uOmbreScala,this.ombre.scala,this.ombre.offset),o.uniform4f(c.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(c),o.disable(o.CULL_FACE);for(let h of this._visibiliErba)o.uniform3f(c.uChunk,h.chunk[0],h.yBaseErba,h.chunk[2]),o.bindVertexArray(h.vaoErba),o.drawArraysInstanced(o.TRIANGLES,0,6,h.lamelle),m++,p+=h.lamelle*2;o.enable(o.CULL_FACE),o.bindVertexArray(null)}n.disegni=s,n.triangoli=f,n.chunkVisti=u,n.chunkTotali=this.chunks.size,n.disegniErba=m,n.triangoliErba=p}_solidi(a,t,e,o){let n=this.gl,l=this.u,r=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(l.uVP,!1,a),n.uniform1f(l.uTempo,this.tempo),n.uniform3f(l.uSoleVerso,r.verso[0],r.verso[1],r.verso[2]),n.uniform3f(l.uSoleCol,r.colore[0],r.colore[1],r.colore[2]),n.uniform1f(l.uSoleForza,r.forza),n.uniform3f(l.uCieloCol,r.cielo[0],r.cielo[1],r.cielo[2]),n.uniform4fv(l.uMaterie,this.materie),n.uniform2f(l.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(l.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(l.uCam,e[0],e[1],e[2]),n.uniform1f(l.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(l.uTaglio,this.taglio);let u=o?[0,0,0,0]:this.buco;n.uniform4f(l.uBuco,u[0],u[1],u[2],u[3]),n.uniform3f(l.uOcchio,e[0],e[1],e[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(l.uOmbre,0),n.uniform2f(l.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(l.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(l);let s=0,f=0;for(let m of this.chunks.values())if(m.quad!==0){if(o){if(!this.tutto&&!Ca(t,m.x0,m.y0+m.minY,m.z0,m.x0+16,m.y0+m.maxY+1,m.z0+16))continue}else if(!m.visto)continue;n.uniform3f(l.uChunk,m.chunk[0],m.chunk[1],m.chunk[2]),n.bindVertexArray(m.vao),n.drawElements(n.TRIANGLES,m.quad*6,n.UNSIGNED_SHORT,0),s++,f+=m.quad*2}return n.bindVertexArray(null),[s,f]}_peloVicino(a){let t=this._voti;t.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let l=Math.hypot(n.x0+8-a[0],n.z0+8-a[2])+2.2*Math.abs(n.peloAcqua-a[1]);t.set(n.peloAcqua,(t.get(n.peloAcqua)||0)+n.quadAcqua/(1+l))}let e=null,o=0;for(let[n,l]of t)l>o&&(o=l,e=n);return e}_specchia(a,t){let e=this.gl,o=this.specchio,n=this.statistiche,l=this._peloVicino(a.occhio);if(l==null||a.occhio[1]<=l+.2)return;let r=Math.max(1,Math.round(e.drawingBufferWidth*o.scala)),u=Math.max(1,Math.round(e.drawingBufferHeight*o.scala));(!o.fbo||o.w!==r||o.h!==u)&&this._preparaSpecchio(r,u);let s=this._riflessione;s.fill(0),s[0]=1,s[5]=-1,s[10]=1,s[13]=2*l,s[15]=1,Da(this.vp,s,this.vpSpecchio),Ua(this.vpSpecchio,this.pianiSpecchio);let f=[a.occhio[0],2*l-a.occhio[1],a.occhio[2]];e.bindFramebuffer(e.FRAMEBUFFER,o.fbo),e.viewport(0,0,r,u),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,f),e.cullFace(e.FRONT),this.taglio=l-.05,this.vpCorrente=this.vpSpecchio,this.pianiCorrente=this.pianiSpecchio;let[m,p]=this._solidi(this.vpSpecchio,this.pianiSpecchio,f,!0);n.disegniSpecchio=m,n.triangoliSpecchio=p,t&&(t.disegna(this,{occhio:f,centro:a.centro,fov:a.fov,rapporto:a.rapporto}),n.disegniSpecchio+=t.statistiche.disegni,n.triangoliSpecchio+=t.statistiche.triangoli),e.cullFace(e.BACK),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),this.taglio=-1e9,o.pelo=l,n.pelo=l}_mostraSpecchio(){let a=this.gl,t=this.specchio;this.programmaQuad||(this.programmaQuad=ea(a,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=a.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=a.createVertexArray()),a.useProgram(this.programmaQuad),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,t.tex),a.uniform1i(this.uQuad,0),a.bindVertexArray(this.vaoQuad),a.disable(a.DEPTH_TEST),a.drawArrays(a.TRIANGLE_STRIP,0,4),a.enable(a.DEPTH_TEST),a.bindVertexArray(null)}_preparaSpecchio(a,t){let e=this.gl,o=this.specchio;o.fbo||(o.fbo=e.createFramebuffer(),o.tex=e.createTexture(),o.rbo=e.createRenderbuffer()),e.bindTexture(e.TEXTURE_2D,o.tex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,a,t,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindRenderbuffer(e.RENDERBUFFER,o.rbo),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,a,t),e.bindFramebuffer(e.FRAMEBUFFER,o.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o.tex,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,o.rbo),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&(o.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),o.w=a,o.h=t}disegnaAcqua(){let a=this.gl,t=this.ua,e=this.sole,o=this._camera,n=this.specchio;if(!o||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}a.useProgram(this.programmaAcqua),a.uniformMatrix4fv(t.uVP,!1,this.vp),a.uniform1f(t.uTempo,this.tempo),a.uniform3f(t.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),a.uniform2f(t.uNebbia,this.nebbia.da,this.nebbia.a),a.uniform3f(t.uSoleVerso,e.verso[0],e.verso[1],e.verso[2]),a.uniform3f(t.uSoleCol,e.colore[0],e.colore[1],e.colore[2]),a.uniform1f(t.uSoleForza,e.forza),a.uniform3f(t.uCieloCol,e.cielo[0],e.cielo[1],e.cielo[2]),a.uniform3f(t.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let l=n.pelo!=null&&n.tex;a.activeTexture(a.TEXTURE1),a.bindTexture(a.TEXTURE_2D,l?n.tex:null),a.uniform1i(t.uSpecchio,1),a.uniform3f(t.uSchermo,1/a.drawingBufferWidth,1/a.drawingBufferHeight,l?1:0),a.uniform1f(t.uMare,this.mare),a.uniform4fv(t.uGalleggianti,this.galleggianti),a.uniform1i(t.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(a.activeTexture(a.TEXTURE2),a.bindTexture(a.TEXTURE_2D,this.altezze),a.uniform1i(t.uAltezze,2),a.bindSampler(2,this.campionatoreLiscio),a.uniform4f(t.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):a.uniform4f(t.uAltRett,0,0,0,0),a.enable(a.BLEND),a.blendFunc(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA),a.depthMask(!1),a.disable(a.CULL_FACE);let r=0,u=0;for(let s of this._visibili)a.uniform3f(t.uChunk,s.chunk[0],s.chunk[1],s.chunk[2]),a.bindVertexArray(s.vaoAcqua),a.drawElements(a.TRIANGLES,s.quadAcqua*6,a.UNSIGNED_SHORT,0),r++,u+=s.quadAcqua*2;a.bindVertexArray(null),a.depthMask(!0),a.enable(a.CULL_FACE),a.disable(a.BLEND),a.bindSampler(2,null),a.activeTexture(a.TEXTURE0),this.statistiche.disegniAcqua=r,this.statistiche.triangoliAcqua=u,n.mostra&&l&&this._mostraSpecchio()}};var ve=class extends za{vertice(a,t,e,o,n,l,r,u=0,s=0){super.vertice(a,t,e,Le[o],n,l,r,u,s)}},ia={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},ja=[0,6072381,8739896,14403468,9211013,5086771,6043679,2714414,16767347],Yo=1;function de(i,a){let t=e=>Math.max(0,Math.min(255,Math.round(e*a)));return t(i>>16&255)<<16|t(i>>8&255)<<8|t(i&255)}function ma(i,a,t){let e=i*374761393+a*668265263+t*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function he(i,a,t,e){let o=i/t,n=a/t,l=Math.floor(o),r=Math.floor(n),u=o-l,s=n-r,f=u*u*(3-2*u),m=s*s*(3-2*s),p=ma(l,r,e),c=ma(l+1,r,e),d=ma(l,r+1,e),h=ma(l+1,r+1,e);return p+(c-p)*f+(d+(h-d)*f-(p+(c-p)*f))*m}function Ia(i,a,t=7){let e=he(i,a,48,t)*14+he(i,a,17,t+1)*5+he(i,a,6,t+2)*1.5;return 8+Math.floor(e)}function qe(i){return i<11?ia.sabbia:i>24?ia.roccia:ia.erba}function Ne(i,a,t=7){let e=[];for(let o=0;o<2;o++){if(ma(i*3+o,a*5-o,t+9)<.35)continue;let l=i*16+Math.floor(ma(i,a,t+11+o)*15)+.5,r=a*16+Math.floor(ma(a,i,t+13+o)*15)+.5,u=Ia(Math.floor(l),Math.floor(r),t);qe(u)===ia.erba&&e.push({x:l,y:u+3,z:r})}return e}function ye(i,a,t,e){let o=0;for(let n of e){let r=15-Math.sqrt((i-n.x)**2+(a-n.y)**2+(t-n.z)**2);r>o&&(o=r)}return Math.max(0,Math.min(15,Math.round(o)))}function Fe(i,a,{seme:t=7,erba:e=2,raggioLampade:o=2}={}){let n=new ve(1600),l=i*16,r=a*16,u=255,s=0,f=[];for(let p=-o;p<=o;p++)for(let c=-o;c<=o;c++)f.push(...Ne(i+p,a+c,t));for(let p=0;p<16;p++)for(let c=0;c<16;c++){let d=l+p,h=r+c,v=Ia(d,h,t);v<u&&(u=v),v+1>s&&(s=v+1);let b=qe(v),x=.94+.12*ma(d,h,t+3),g=ye(d+.5,v+1,h+.5,f),E=de(ja[b],x);n.quadDa([p,v+1,c,2,15,g,E],[p,v+1,c+1,2,15,g,E],[p+1,v+1,c+1,2,15,g,E],[p+1,v+1,c,2,15,g,E]);let S=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[T,L,z]of S){let _=Ia(d+T,h+L,t);for(let O=_+1;O<=v;O++){let C=Math.max(6,15-(v-O)*2),N=O===v&&b===ia.erba?ia.erba:v>24?ia.roccia:ia.terra,A=ye(d+.5+T*.5,O+.5,h+.5+L*.5,f),R=O,Y=O+1,y=de(ja[N],x);T===1?n.quadDa([p+1,R,c,z,C,A,y],[p+1,Y,c,z,C,A,y],[p+1,Y,c+1,z,C,A,y],[p+1,R,c+1,z,C,A,y]):T===-1?n.quadDa([p,R,c+1,z,C,A,y],[p,Y,c+1,z,C,A,y],[p,Y,c,z,C,A,y],[p,R,c,z,C,A,y]):L===1?n.quadDa([p+1,R,c+1,z,C,A,y],[p+1,Y,c+1,z,C,A,y],[p,Y,c+1,z,C,A,y],[p,R,c+1,z,C,A,y]):n.quadDa([p,R,c,z,C,A,y],[p,Y,c,z,C,A,y],[p+1,Y,c,z,C,A,y],[p+1,R,c,z,C,A,y]),O<u&&(u=O)}}if(b===ia.erba)for(let T=0;T<e;T++){if(ma(d,h,t+20+T)<.25)continue;let z=1,_=p,O=c,C=de(ja[ia.filo],.94+.12*ma(d,h,t+30+T));n.quadDa([_,v+1,O,2,15,g,C],[_,v+1+z,O,2,15,g,C,1],[_+1,v+1+z,O+1,2,15,g,C,1],[_+1,v+1,O+1,2,15,g,C]),n.quadDa([_+1,v+1,O,2,15,g,C],[_+1,v+1+z,O,2,15,g,C,1],[_,v+1+z,O+1,2,15,g,C,1],[_,v+1,O+1,2,15,g,C]),v+2>s&&(s=v+2)}}for(let p of Ne(i,a,t)){let c=Math.floor(p.x)-l,d=Math.floor(p.z)-r,h=p.y-3;for(let v=h+1;v<=p.y;v++){let b=v===p.y?ia.lampada:ia.tronco,x=v===p.y?15:12,g=ja[b],E=v===p.y?Yo:0,S=c+.5-.15,T=c+.5+.15,L=Math.floor(S),z=Math.min(16,Math.floor(S)+1),_=d,O=d+1;n.quadDa([z,v,_,0,12,x,g,0,E],[z,v+1,_,0,12,x,g,0,E],[z,v+1,O,0,12,x,g,0,E],[z,v,O,0,12,x,g,0,E]),n.quadDa([L,v,O,1,12,x,g,0,E],[L,v+1,O,1,12,x,g,0,E],[L,v+1,_,1,12,x,g,0,E],[L,v,_,1,12,x,g,0,E]),n.quadDa([z,v,O,4,12,x,g,0,E],[z,v+1,O,4,12,x,g,0,E],[L,v+1,O,4,12,x,g,0,E],[L,v,O,4,12,x,g,0,E]),n.quadDa([L,v,_,5,12,x,g,0,E],[L,v+1,_,5,12,x,g,0,E],[z,v+1,_,5,12,x,g,0,E],[z,v,_,5,12,x,g,0,E]),v===p.y&&n.quadDa([L,v+1,_,2,15,x,g,0,E],[L,v+1,O,2,15,x,g,0,E],[z,v+1,O,2,15,x,g,0,E],[z,v+1,_,2,15,x,g,0,E]),v+1>s&&(s=v+1)}}return{...n.dati(),minY:u,maxY:s,cx:i,cz:a}}var Pe={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},De=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],Ka={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};De.push(Ka);var Ho={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};De.push(Ho);function Ue(i,a,t=Ka){Pe[i]=a,t.blocchi.includes(i)||t.blocchi.push(i)}var $o={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"};function W(i){return Pe[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||$o}function we(i){let a=i.indexOf("~");return a<0?i:i.slice(0,a)}function Be(i){if(!i||!i.startsWith("acqua"))return null;let a=i.indexOf("~");return a<0?0:Number(i.slice(a+1))}var I=16,Zo=256,Wa=2048,Ve=64,J=(i,a,t)=>((i+Wa)*4096+(t+Wa))*256+(a+Ve),_a=i=>Math.floor(i/(256*4096))-Wa,Na=i=>Math.floor(i/256)%4096-Wa,ya=i=>i%256-Ve;var ga=(i,a)=>Math.floor(i/I)+","+Math.floor(a/I),Qa=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this.bagnate=new Map,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(a){this.generati.add(a)}_annotaModifica(a,t,e,o){if(!this.frontiera)return;let n=ga(a,e),l=this.modifiche.get(n);l||(l=new Map,this.modifiche.set(n,l)),l.set(J(a,t,e),o)}applicaModifiche(a){let t=this.modifiche.get(a);if(!t)return 0;for(let[e,o]of t){let n=_a(e),l=ya(e),r=Na(e);o===null?this.togli(n,l,r,!0):this.metti(n,l,r,o,!0)}return t.size}scaricaChunk(a){let t=this.chunks.get(a);if(!t)return this.generati.delete(a),[];let e=[];for(let[o,n]of t){let l=W(n);l&&l.forma==="modello"&&e.push([_a(o),ya(o),Na(o),n])}return this.contaBlocchi-=t.size,this.chunks.delete(a),this._scordaMemo(),this.generati.delete(a),this._tocca(a,this.sporchi),e}_cambiata(a,t,e){if(this.cambiate.length>=3*Zo){this.troppiCambi=!0;return}this.cambiate.push(a,t,e)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(a,t){let e=Math.floor(a/I),o=Math.floor(t/I);if(this._memoChunk!==null&&this._memoCx===e&&this._memoCz===o)return this._memoChunk;let n=this.chunks.get(e+","+o)||null;return this._memoCx=e,this._memoCz=o,this._memoChunk=n,n}tipo(a,t,e){let o=this._chunkDi(a,e);return o&&o.get(J(a,t,e))||null}pieno(a,t,e){return this.tipo(a,t,e)!==null}solido(a,t,e){let o=this.tipo(a,t,e);if(o&&W(o).solido)return!0;let n=this.furni.get(J(a,t,e));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(a,t,e){if(!this.solido(a,t-1,e)||this.solido(a,t,e)||this.solido(a,t+1,e))return!1;let o=this.tipo(a,t,e);return!(o&&W(o).acqua)}_sporca(a,t,e=this.sporchi){let o=(a%I+I)%I,n=(t%I+I)%I;this._tocca(ga(a,t),e),o===0&&this._tocca(ga(a-1,t),e),o===I-1&&this._tocca(ga(a+1,t),e),n===0&&this._tocca(ga(a,t-1),e),n===I-1&&this._tocca(ga(a,t+1),e)}_tocca(a,t){t.add(a),this._rev.set(a,(this._rev.get(a)||0)+1)}revisione(a){return this._rev.get(a)||0}metti(a,t,e,o,n=!1){let l=ga(a,e),r=this.chunks.get(l);r||(r=new Map,this.chunks.set(l,r),this._scordaMemo());let u=J(a,t,e),s=r.get(u);s===void 0&&this.contaBlocchi++,r.set(u,o);let f=o.charCodeAt(0)===97&&o.startsWith("acqua")&&(s===void 0||s.startsWith("acqua"));this._sporca(a,e,f?this.sporchiAcqua:this.sporchi),f||this._cambiata(a,t,e),n||(this._annotaModifica(a,t,e,o),this.onEvento&&this.onEvento({tipo:"metti",cella:[a,t,e],blocco:o}))}togli(a,t,e,o=!1){let n=ga(a,e),l=this.chunks.get(n);if(!l)return!1;let r=J(a,t,e),u=l.get(r);if(!l.delete(r))return!1;this.bagnate.delete(r),this.contaBlocchi--,l.size===0&&(this.chunks.delete(n),this._scordaMemo());let s=!!(u&&u.startsWith("acqua"));return this._sporca(a,e,s?this.sporchiAcqua:this.sporchi),s||this._cambiata(a,t,e),o||(this._annotaModifica(a,t,e,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[a,t,e]})),!0}bagna(a,t,e,o=0){this.bagnate.set(J(a,t,e),Math.max(0,Math.min(15,o|0))),this._sporca(a,e,this.sporchiAcqua)}asciuga(a,t,e){return this.bagnate.delete(J(a,t,e))?(this._sporca(a,e,this.sporchiAcqua),!0):!1}bagnata(a,t,e){let o=this.bagnate.get(J(a,t,e));return o===void 0?null:o}occupaFurni(a,t){for(let[e,o,n]of a)this.furni.set(J(e,o,n),t)}liberaFurni(a){for(let[t,e,o]of a)this.furni.delete(J(t,e,o))}furniIn(a,t,e){return this.furni.get(J(a,t,e))||null}occupaOmbra(a,t=!1){for(let[e,o,n]of a){let l=J(e,o,n),r=this.ombreFurni.get(l);if(r){r.n++,t&&r.op++===0&&this._cambiata(e,o,n);continue}this.ombreFurni.set(l,{x:e,y:o,z:n,n:1,op:t?1:0}),this._cambiata(e,o,n)}}liberaOmbra(a,t=!1){for(let[e,o,n]of a){let l=J(e,o,n),r=this.ombreFurni.get(l);r&&(t&&r.op>0&&--r.op===0&&r.n>1&&this._cambiata(e,o,n),!(--r.n>0)&&(this.ombreFurni.delete(l),this._cambiata(e,o,n)))}}ombraFurniIn(a,t,e){let o=this.ombreFurni.get(J(a,t,e));return o?o.op>0?2:1:0}appoggioInColonna(a,t,e,o=8){for(let n=e;n>e-o;n--)if(this.calpestabile(a,n,t))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let a of this._rev.keys())this._rev.set(a,this._rev.get(a)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let a of this.chunks.values())for(let[t,e]of a)yield{x:_a(t),y:ya(t),z:Na(t),tipo:e}}perOgni(a){for(let t of this.chunks.values())for(let[e,o]of t)a(_a(e),ya(e),Na(e),o)}*blocchiDelChunk(a){let t=this.chunks.get(a);if(t)for(let[e,o]of t)yield{x:_a(e),y:ya(e),z:Na(e),tipo:o}}perOgniDelChunk(a,t){let e=this.chunks.get(a);if(e)for(let[o,n]of e)t(_a(o),ya(o),Na(o),n)}};var jo={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},wa="primavera";var Ja=null;function ae(i,a,t){let e=i>>16&255,o=i>>8&255,n=i&255,l=a>>16&255,r=a>>8&255,u=a&255,s=(f,m)=>Math.round(f+(m-f)*t);return s(e,l)<<16|s(o,r)<<8|s(n,u)}function Ge(i,a){if(Ja){let t=wa;wa=Ja.da;let e=ge(i,a);wa=Ja.a;let o=ge(i,a);wa=t;let n=Ja.mix;return{cima:ee(e.cima,o.cima,n),lato:ee(e.lato,o.lato,n),fondo:ee(e.fondo,o.fondo,n),facce:e.facce,orlo:e.orlo!=null&&o.orlo!=null?ee(e.orlo,o.orlo,n):e.orlo}}return ge(i,a)}function ee(i,a,t){let e=Math.round((i>>16&255)+((a>>16&255)-(i>>16&255))*t),o=Math.round((i>>8&255)+((a>>8&255)-(i>>8&255))*t),n=Math.round((i&255)+((a&255)-(i&255))*t);return e<<16|o<<8|n}function ge(i,a){let t=W(i),e=jo[wa],{cima:o,lato:n,fondo:l}=t;if(t.cappello&&e.erba&&!t.override&&(o=e.erba[be(a,e.erba.length)]),t.reagisce==="stagione"&&e.erba){let r=e.erba[be(a,e.erba.length)],u=t.reagisceForza??1;o=ae(o,r,u),n=ae(n,r,u*.45),l=ae(l,r,u*.3)}else if(t.reagisce==="quota"){let r=be(a,8)/7,u=(t.reagisceForza??1)*.5,s=f=>ae(f,16777215,r*u);o=s(o),n=s(n),l=s(l)}return i==="sabbia"&&e.sabbia&&({cima:o,lato:n,fondo:l}=e.sabbia),{cima:o,lato:n,fondo:l,facce:t.facce||null,orlo:t.orlo!=null?t.orlo:void 0}}function da(i,a,t){if(i.facce){let e=a*2+(t>0?0:1),o=i.facce[e];if(o!=null)return o}return a===1?t>0?i.cima:i.fondo:i.lato}function be(i,a=8){let t=(a-1)*2,e=(Math.round(i)%t+t)%t;return e>=a&&(e=t-e),e}function xe(i,a,t){let e=(i|0)*374761393+(a|0)*668265263+(t|0)*2147483647;return e=(e^e>>>13)*1274126177,e=e^e>>>16,(e>>>0)%1e3/1e3}function Ko(i,a){let t=i>>16&255,e=i>>8&255,o=i&255,n=l=>Math.max(0,Math.min(255,Math.round(l*(1+a))));return n(t)<<16|n(e)<<8|n(o)}function Wo(i,a,t,e,o,n){if(!a||a==="liscio"||!t)return i;let l=0;return a==="chiazze"?l=(xe(e,o,n)-.5)*2:a==="venature"?l=(xe(0,o,0)-.5)*2*.7+(xe(e,o,n)-.5)*.3:a==="sfumato"&&(l=(o%16+16)%16/16-.5),Ko(i,l*t*.34)}function ke(i,a,t,e,o,n){if(!a||a==="liscio"||!t)return i;let l=r=>Wo(r,a,t,e,o,n);return{cima:l(i.cima),lato:l(i.lato),fondo:l(i.fondo),facce:i.facce?i.facce.map(l):null}}var Xe={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},Qo=Object.keys(Xe);function Ye(i){return!i||!i.materia?null:Xe[i.materia]||null}function ba(i,a,t=0){if(!a)return i;let e=(i>>16&255)/255,o=(i>>8&255)/255,n=(i&255)/255,l=.2126*e+.7152*o+.0722*n,r=a.satura;e=l+(e-l)*r,o=l+(o-l)*r,n=l+(n-l)*r;let u=a.tinta*(1+t),s=f=>Math.max(0,Math.min(255,Math.round(f*u*255)));return s(e)<<16|s(o)<<8|s(n)}var Jo=16;function He(i){let a=Qo.indexOf(i);return a<0||a+1>=Jo?0:a+1}var Ee=1/16,$e=8*Ee,na=9*Ee;function Ze(i,a,t,e,o,n,l,r){let u=(f,m,p)=>[a+f,t+m,e+p];i.quad(u(-r,l,-r),u(r,l,-r),u(r,l,r),u(-r,l,r),da(o,1,1),[0,1,0]),i.quad(u(-r,n,-r),u(r,n,-r),u(r,n,r),u(-r,n,r),da(o,1,-1),[0,-1,0]);let s=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let f of s){let[m,,p]=f.d,c=-p,d=m,h=(v,b)=>u(m*r+c*b,v,p*r+d*b);i.quad(h(n,-r),h(l,-r),h(l,r),h(n,r),da(o,f.asse,f.segno),f.d)}}function at(i,a,t,e,o){Ze(i,a,t,e,o,-na,0,$e)}function et(i,a,t,e,o){Ze(i,a,t,e,o,-na,na,5*Ee)}function ot(i,a,t,e,o){let n=(s,f,m)=>[a+s,t+f,e+m],l=da(o,0,1),r=$e,u=[[[-r,-na,-r],[r,-na,r],[r,na,r],[-r,na,-r],[1,0,-1]],[[-r,-na,r],[r,-na,-r],[r,na,-r],[-r,na,r],[1,0,1]]];for(let[s,f,m,p,c]of u)i.quad(n(...s),n(...f),n(...m),n(...p),l,c),i.quad(n(...s),n(...f),n(...m),n(...p),l,[-c[0],-c[1],-c[2]])}function tt(){}var je={lastra:at,pilastro:et,croce:ot,modello:tt},Ba=new Set(["lastra","pilastro","croce","modello"]);var Va=1/16,it=[[0,1],[0,2],[1,2]],nt=[[1,0],[-1,0],[0,1],[0,-1]];function xa(i,a,t,e,o,n,l,r,u){let s=[i,a,t];return s[e]+=o,s[n]+=l,s[r]+=u,s}var Ke={tinta:1,satura:1};function We(i,a,t,e,o,n,l=0){let r=8*Va,u=9*Va,s=(f,m)=>n(f===0?m:0,f===1?m:0,f===2?m:0);for(let f=0;f<3;f++)for(let m of[-1,1]){if(s(f,m))continue;let p=(f+1)%3,c=(f+2)%3,d=da(o,f,m),h=[0,0,0];h[f]=m,i.quad(xa(a,t,e,f,m*u,p,-r,c,-r),xa(a,t,e,f,m*u,p,+r,c,-r),xa(a,t,e,f,m*u,p,+r,c,+r),xa(a,t,e,f,m*u,p,-r,c,+r),d,h)}for(let[f,m]of it){let p=3-f-m;for(let c of[-1,1])for(let d of[-1,1]){if(s(f,c)||s(m,d))continue;let h=f===1&&c>0||m===1&&d>0,v=f===1&&c<0||m===1&&d<0,b=h?o.cima:v?o.fondo:o.lato,x=l?ba(b,Ke,l):b,g=[0,0,0];g[f]=c,g[m]=d,i.quad(xa(a,t,e,f,c*u,m,d*r,p,-r),xa(a,t,e,f,c*r,m,d*u,p,-r),xa(a,t,e,f,c*r,m,d*u,p,+r),xa(a,t,e,f,c*u,m,d*r,p,+r),x,g)}}for(let f of[-1,1])for(let m of[-1,1])for(let p of[-1,1])s(0,f)||s(1,m)||s(2,p)||i.tri([a+f*u,t+m*r,e+p*r],[a+f*r,t+m*u,e+p*r],[a+f*r,t+m*r,e+p*u],l?ba(m>0?o.cima:o.fondo,Ke,l):m>0?o.cima:o.fondo,[f,m,p])}function Qe(i,a,t,e,o,n){let l=(c,d)=>n(c,0,d),r=n(0,-1,0),u=o.cima,s=o.lato,f=o.fondo,m=o.orlo??o.cima,p=(c,d,h)=>[a+c*Va,t+d*Va,e+h*Va];r||i.quad(p(-8,-9,-8),p(8,-9,-8),p(8,-9,8),p(-8,-9,8),f,[0,-1,0]);for(let[c,d]of nt){if(l(c,d))continue;let h=-d,v=c,b=(g,E,S)=>p(g*c+S*h,E,g*d+S*v),x=[c,0,d];r||i.quad(b(8,-9,-8),b(9,-8,-8),b(9,-8,8),b(8,-9,8),f,[c,-1,d]),i.quad(b(9,-8,-8),b(9,2,-8),b(9,2,8),b(9,-8,8),s,x),i.quad(b(9,2,-8),b(10,3,-8),b(10,3,8),b(9,2,8),m,x),i.quad(b(10,3,-8),b(10,7,-8),b(10,7,8),b(10,3,8),m,x),i.quad(b(10,7,-8),b(9,8,-8),b(9,8,8),b(10,7,8),u,[c,1,d]),i.quad(b(8,8,-8),b(9,8,-8),b(9,8,8),b(8,8,8),u,[0,1,0])}for(let c of[-1,1])for(let d of[-1,1]){if(l(c,0)||l(0,d))continue;let h=(b,x,g)=>p(b*c,x,g*d),v=[c,0,d];r||i.tri(h(9,-8,8),h(8,-9,8),h(8,-8,9),f,[c,-1,d]),i.quad(h(9,-8,8),h(8,-8,9),h(8,2,9),h(9,2,8),s,v),i.quad(h(9,2,8),h(8,2,9),h(8,3,10),h(10,3,8),m,v),i.quad(h(10,3,8),h(8,3,10),h(8,7,10),h(10,7,8),m,v),i.quad(h(10,7,8),h(8,7,10),h(8,8,9),h(9,8,8),u,[c,1,d]),i.tri(h(8,8,8),h(9,8,8),h(8,8,9),u,[0,1,0])}i.quad(p(-8,8,-8),p(8,8,-8),p(8,8,8),p(-8,8,8),u,[0,1,0])}var rt=2,Ae=6,lt=256;function Je(i){if(!i)return!1;let a=W(i);return!a.acqua&&!a.vetro&&!Ba.has(a.forma)}function eo(i,a,t,e){let o=a.indexOf(","),n=+a.slice(0,o),l=+a.slice(o+1),r=n*I-Ae,u=l*I-Ae,s=I+2*Ae,f=e-t+1,m=s,p=s*f*m,c=new Uint8Array(p),d=new Uint8Array(p),h=new Uint8Array(p),v=(S,T,L)=>((S-r)*f+(T-t))*m+(L-u),b=(S,T,L)=>S>=r&&S<r+s&&T>=t&&T<=e&&L>=u&&L<u+m,x=[];for(let S=r;S<r+s;S++)for(let T=u;T<u+m;T++){let L=!1;for(let z=e;z>=t;z--){let _=i.tipo(S,z,T),O=v(S,z,T);if(Je(_)){h[O]=1,L=!0;continue}if(!L&&z===e){for(let C=e+1;C<lt&&C<e+40;C++)if(Je(i.tipo(S,C,T))){L=!0;break}}if(L||(c[O]=15),_){let C=W(_);C.luce&&x.push([S,z+Math.round(C.luce.quota??0),T])}}}let g=[];for(let S=0;S<p;S++)c[S]===15&&g.push(S);ao(g,c,h,s,f,m,1);let E=[];for(let[S,T,L]of x){if(!b(S,T,L))continue;let z=v(S,T,L);d[z]=15,E.push(z)}return ao(E,d,h,s,f,m,rt),{x0:r,z0:u,yMin:t,yMax:e,W:s,H:f,D:m,cielo:c,blocco:d,leggi(S,T,L){if(!b(S,T,L))return T>e?[15,0]:[0,0];let z=v(S,T,L);return[c[z],d[z]]}}}function ao(i,a,t,e,o,n,l){let r=[o*n,-o*n,n,-n,1,-1],u=0;for(;u<i.length;){let s=i[u++],f=a[s]-l;if(f<=0)continue;let m=Math.floor(s/(o*n)),p=Math.floor(s/n)%o,c=s%n;for(let d=0;d<6;d++){if(d===0&&m===e-1||d===1&&m===0||d===2&&p===o-1||d===3&&p===0||d===4&&c===n-1||d===5&&c===0)continue;let h=s+r[d];t[h]||a[h]>=f||(a[h]=f,i.push(h))}}}var oo=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function pa(i,a,t){let e=i*374761393+a*668265263+t*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}var oe=class{constructor(a,t=512){this.yBase=a,this.byte=new Uint8Array(t*12),this.n=0}_lamella(a,t,e,o,n,l,r,u,s,f=0,m=8){if((this.n+1)*12>this.byte.length){let d=new Uint8Array(this.byte.length*2);d.set(this.byte),this.byte=d}let p=this.n*12,c=this.byte;c[p]=a,c[p+1]=t,c[p+2]=e,c[p+3]=o,c[p+4]=n>>16&255,c[p+5]=n>>8&255,c[p+6]=n&255,c[p+7]=(l&15)<<2,c[p+8]=Math.max(1,Math.min(255,r)),c[p+9]=Math.max(1,Math.min(255,u)),c[p+10]=Math.max(0,Math.min(255,s+128)),c[p+11]=f&15|(m&15)<<4,this.n++}ciuffo(a,t,e,o,n,l,r,u=1,s=0){let f=oo[Math.floor(pa(a,e,3)*oo.length)],m=Math.max(1,Math.round(f.n*u*(.82+.36*pa(a,e,5)))),p=t+1-this.yBase;if(p<0||p*8>247)return 0;for(let c=0;c<m;c++){let d=pa(a,e,c*17+5),h=pa(a,e,c*17+11),v=pa(a,e,c*17+41),b=pa(a,e,c*17+59),x=Math.min(.98,.66+f.apri),g=a+.5+(d-.5)*x,E=e+.5+(h-.5)*x,S=Math.min(.8,f.alto*(.62+.8*pa(a,e,c*17+71))*(.5+.6*Math.pow(v,1.5))),T=f.largo*(.8+.4*b),L=(pa(a,e,c*17+83)-.5)*.5,z=pa(a,e,c*17+89),_=z<.15?.9+.03*z:z>.85?1.07+.03*(z-.85):.97+.06*(z-.15)/.7,O=Math.max(0,Math.min(128,Math.round((g-o)*8))),C=Math.max(0,Math.min(128,Math.round((E-n)*8))),N=Math.floor(pa(a,e,c*17+97)*255);this._lamella(O,C,Math.round(p*8),N,l,r,Math.round(S*64),Math.round(T*128),Math.round(L*128),s,Math.round((_-.9)/.2*15))}return m}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var Ea=64,st=[[1,0,0,K(1,0,0),0,1],[-1,0,0,K(-1,0,0),0,-1],[0,1,0,K(0,1,0),1,1],[0,-1,0,K(0,-1,0),1,-1],[0,0,1,K(0,0,1),2,1],[0,0,-1,K(0,0,-1),2,-1]],to=(i,a,t)=>((a+1)*3+(t+1))*3+(i+1),Te=class{constructor(a,t,e,o,n){this.c=a,this.ox=t,this.oz=e,this._materia=0,this.luceDi=o,this.aria=n,this._cielo=15,this._cella=null}materia(a){this._materia=a|0}cella(a,t,e){this._cella=[a,t,e]}_cieloFaccia(a){let[t,e,o]=this._cella,n=-1;for(let l=0;l<3;l++){if(!a[l])continue;let r=this.luceDi(t+(l===0?a[0]:0),e+(l===1?a[1]:0),o+(l===2?a[2]:0))[0];r>n&&(n=r)}return n<0?this.luceDi(t,e+1,o)[0]:n}_bloccoVertice(a,t){let e=Math.hypot(t[0],t[1],t[2])||1,o=a[0]+t[0]/e*.5,n=a[1]+t[1]/e*.5,l=a[2]+t[2]/e*.5,r=0,u=0;for(let s of[-.45,.45])for(let f of[-.45,.45])for(let m of[-.45,.45]){let p=Math.floor(o+s),c=Math.floor(n+f),d=Math.floor(l+m);this.aria(p,c,d)&&(r+=this.luceDi(p,c,d)[1],u++)}return u?Math.round(r/u):0}_v(a,t,e,o){return[a[0]-this.ox,a[1]+Ea,a[2]-this.oz,t,this._cielo,this._bloccoVertice(a,o),e,0,this._materia]}_giro(a,t,e,o){let n=t[0]-a[0],l=t[1]-a[1],r=t[2]-a[2],u=e[0]-a[0],s=e[1]-a[1],f=e[2]-a[2],m=l*f-r*s,p=r*u-n*f,c=n*s-l*u;return m*o[0]+p*o[1]+c*o[2]<0}tri(a,t,e,o,n){if(this._giro(a,t,e,n)){let r=t;t=e,e=r}let l=K(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(a,l,o,n),this._v(t,l,o,n),this._v(e,l,o,n),this._v(e,l,o,n))}quad(a,t,e,o,n,l){let r=K(l[0],l[1],l[2]);if(this._cielo=this._cieloFaccia(l),this._giro(a,t,e,l)){let u=t;t=o,o=u}this.c.quadDa(this._v(a,r,n,l),this._v(t,r,n,l),this._v(e,r,n,l),this._v(o,r,n,l))}};function te(i){if(!i)return!1;let a=W(i);return!a.acqua&&!a.vetro&&!Ba.has(a.forma)}function io(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function no(i,a,{erba:t=2,luce:e=!0}={}){let o=a.indexOf(","),n=+a.slice(0,o),l=+a.slice(o+1),r=n*I,u=l*I,s=new za(1024),f=new za(64),m=-1/0,p=new Int16Array(I*I).fill(-1),c=new Int16Array(I*I).fill(-1),d=new Int16Array(I*I).fill(-1),h=[],v=255,b=0,x=1/0,g=-1/0;i.perOgniDelChunk(a,(N,A)=>{A<x&&(x=A),A>g&&(g=A)});let E=e&&x<=g?eo(i,a,x-2,g+3):null,S=new oe(Number.isFinite(x)?x:0),T=(N,A,R)=>E?E.leggi(N,A,R):[15,0],L=new Te(s,r,u,T,(N,A,R)=>!te(i.tipo(N,A,R))),z=new Uint8Array(27),_=(N,A,R,Y,y,Aa,Ta,ta)=>[N-r,A+Ea,R-u,Y,Aa,Ta,y,ta?1:0,0],O=(N,A,R)=>io(i.tipo(N,A,R))||(i.bagnate?i.bagnata(N,A,R)!==null:!1);return i.perOgniDelChunk(a,(N,A,R,Y)=>{let y=W(Y),Aa=i.bagnate?i.bagnata(N,A,R):null;if(y.forma==="modello"&&y.modello==="albero")for(let F=-2;F<=2;F++)for(let U=-2;U<=2;U++){let B=F*F+U*U;if(B>4)continue;let k=N+F-r,la=R+U-u;if(k<0||k>=I||la<0||la>=I)continue;let Z=k*I+la,G=A+(B===0?4:B<=2?3:2);G>p[Z]&&(p[Z]=G)}if(y.forma==="modello"){let F=N-r,U=R-u;if(F>=0&&F<I&&U>=0&&U<I){let B=F*I+U,k=A+Math.max(1,Math.round(y.altezza||1));k>d[B]&&(d[B]=k)}}if(y.luce&&h.push([N,A,R,Y]),Ba.has(y.forma)&&Aa===null)return;let Ta=io(Y)||Aa!==null,ta=A+Ea;if(ta<0||ta>254)return;let Ga=(N-r)*I+(R-u);!Ta&&A>p[Ga]&&(p[Ga]=A),!Ta&&te(Y)&&A>c[Ga]&&(c[Ga]=A);let $=Ge(Aa!==null?"acqua":we(Y),A);y.motivo&&($=ke($,y.motivo,y.motivoForza??1,N,A,R));let va=Ye(y);va&&($={...$,cima:ba($.cima,va),lato:ba($.lato,va),fondo:ba($.fondo,va)},$.facce&&($.facce=$.facce.map(F=>F==null?F:ba(F,va))));let Ro=va?He(y.materia):0;if(!Ta){z.fill(0);for(let Z=-1;Z<=1;Z++)for(let G=-1;G<=1;G++)for(let j=-1;j<=1;j++)j===0&&Z===0&&G===0||te(i.tipo(N+j,A+Z,R+G))&&(z[to(j,Z,G)]=1);let F=(Z,G,j)=>z[to(Z,G,j)]===1;L.materia(Ro),L.cella(N,A,R);let U=N+.5,B=A+.5,k=R+.5,la=y.forma&&je[y.forma];la?la(L,U,B,k,$,()=>!1):y.cappello&&!F(0,1,0)?Qe(L,U,B,k,$,F):We(L,U,B,k,$,(G,j,P)=>F(G,j,P)?j!==0?!0:!W(i.tipo(N+G,A,R+P)).cappello||F(G,1,P):!1,va?va.orlo:0),ta-1<v&&(v=ta-1),ta+2>b&&(b=ta+2)}let ka=0,Oa=0;if(Ta)for(Oa=Math.max(0,Math.min(15,Aa!==null?Aa:Be(Y)||0));ka<15&&O(N,A-1-ka,R);)ka++;let So=(F,U)=>{if(!O(F,A,U))return-1;let B=0;for(;B<15&&O(F,A-1-B,U);)B++;return B},Xa=(F,U)=>{let B=0,k=0;for(let la of[F-1,F])for(let Z of[U-1,U]){let G=So(la,Z);G>=0&&(B+=G,k++)}return k?Math.round(B/k):ka};if(Ta)for(let[F,U,B,k,la,Z]of st){let G=i.tipo(N+F,A+U,R+B);if(O(N+F,A+U,R+B)||G&&te(G))continue;let j=da($,la,Z),P=N,D=A,w=R,sa,ca,ua,fa;if(F===1?(sa=[P+1,D,w],ca=[P+1,D+1,w],ua=[P+1,D+1,w+1],fa=[P+1,D,w+1]):F===-1?(sa=[P,D,w+1],ca=[P,D+1,w+1],ua=[P,D+1,w],fa=[P,D,w]):U===1?(sa=[P,D+1,w],ca=[P,D+1,w+1],ua=[P+1,D+1,w+1],fa=[P+1,D+1,w]):U===-1?(sa=[P,D,w+1],ca=[P,D,w],ua=[P+1,D,w],fa=[P+1,D,w+1]):B===1?(sa=[P+1,D,w+1],ca=[P+1,D+1,w+1],ua=[P,D+1,w+1],fa=[P,D,w+1]):(sa=[P,D,w],ca=[P,D+1,w],ua=[P+1,D+1,w],fa=[P+1,D,w]),U===1){let Re=A+(15-2*Oa)/16;Re>m&&(m=Re)}f.quadDa(_(...sa,k,j,Xa(sa[0],sa[2]),Oa,sa[1]===D+1),_(...ca,k,j,Xa(ca[0],ca[2]),Oa,ca[1]===D+1),_(...ua,k,j,Xa(ua[0],ua[2]),Oa,ua[1]===D+1),_(...fa,k,j,Xa(fa[0],fa[2]),Oa,fa[1]===D+1)),ta<v&&(v=ta),ta+1>b&&(b=ta+1)}if(y.cappello&&t>0&&!i.tipo(N,A+1,R)){let[F,U]=T(N,A+1,R);S.ciuffo(N,A,R,r,u,$.cima,F,t/2,U),A+2+Ea>b&&(b=A+2+Ea)}}),v>b&&(v=0,b=0),{...s.dati(),minY:v,maxY:b,y0:-Ea,cx:n,cz:l,altezze:p,solide:c,impronte:d,luci:h,acqua:{...f.dati(),pelo:m===-1/0?null:m},erba:S.dati()}}function ro(i,a,t,e,o){let n=(e-a+1)*I,l=(o-t+1)*I,r=new Uint8Array(n*l);for(let u of i){if(!u.altezze)continue;let s=(u.cx-a)*I,f=(u.cz-t)*I;for(let m=0;m<I;m++)for(let p=0;p<I;p++){let c=u.altezze[m*I+p];r[(f+p)*n+(s+m)]=c<0?0:Math.max(0,Math.min(255,c+1))}}return{byte:r,x0:a*I,z0:t*I,larghezza:n,profondita:l}}function Ra(i,a,t){let e=i*374761393+a*668265263+t*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function lo(i){return i*i*(3-2*i)}function ze(i,a,t){let e=Math.floor(i),o=Math.floor(a),n=lo(i-e),l=lo(a-o),r=Ra(e,o,t),u=Ra(e+1,o,t),s=Ra(e,o+1,t),f=Ra(e+1,o+1,t);return r+(u-r)*n+(s-r)*l+(r-u-s+f)*n*l}var qa=5;function so(i,a=1,t=64){i.svuota();let e=[],o=[],n=new Map,l=[];for(let f=-t;f<=t;f++)for(let m=-t;m<=t;m++){let p=.55*ze(f*.028,m*.028,a)+.3*ze(f*.07,m*.07,a+11)+.15*ze(f*.16,m*.16,a+29),c=Math.max(2,1+Math.round(Math.pow(Math.max(0,p),1.6)*22)),d=Math.max(Math.abs(f),Math.abs(m)),h=Math.min(1,Math.max(0,(t-2-d)/8)),v=h*h*(3-2*h);c=Math.round(c*v+(qa+1)*(1-v));let b=c<=qa+1;n.set(f+"|"+m,c);for(let x=0;x<c;x++){let E=x===c-1?b?"sabbia":"erba":x<c-3?"roccia":"terra";i.metti(f,x,m,E,!0)}if(c<=qa)for(let x=c;x<=qa;x++)i.metti(f,x,m,"acqua",!0);else if(!b){let x=Ra(f*3+1,m*3+7,a+101);if(x>.988&&e.length<90?e.push([f,c,m]):x<.004&&o.length<14&&o.push([f,c,m]),c>=qa+6){let g=Ra(f*5+3,m*5+11,a+57);g>.99&&l.push({x:f,z:m,h:c,r:g})}}}let r=ut(i,n,a,l,t),u=f=>!r.has(f[0]+"|"+f[2]),s=[...r].map(f=>{let[m,p]=f.split("|").map(Number);return[m,n.get(f)-2,p]});return{alberi:e.filter(u),lampioni:o.filter(u),fiume:s}}var ct=[[1,0],[-1,0],[0,1],[0,-1]];function ut(i,a,t,e,o=64){let n=new Set;e.sort((u,s)=>s.h-u.h||u.r-s.r);let l=[];for(let u of e){if(l.length>=5)break;l.every(s=>(s.x-u.x)**2+(s.z-u.z)**2>=784)&&l.push(u)}let r=(u,s)=>{let f=u+"|"+s;if(n.has(f))return;let m=a.get(f);i.togli(u,m-1,s,!0),i.togli(u,m-2,s,!0),i.metti(u,m-2,s,"acqua",!0),n.add(f)};for(let u of l){let s=u.x,f=u.z,m=null,p=0,c=new Set([s+"|"+f]);for(let d=0;d<500;d++){let h=a.get(s+"|"+f);if(r(s,f),m){let g=s+m[1],E=f-m[0];a.get(g+"|"+E)===h&&r(g,E)}let v=null,b=1/0,x=1/0;for(let g of ct){let E=s+g[0],S=f+g[1];if(c.has(E+"|"+S))continue;let T=a.get(E+"|"+S);if(T===void 0)continue;let L=(g===m?-.5:0)+Ra(E*7+5,S*7+13,t+71);(T<b||T===b&&L<x)&&(v=g,b=T,x=L)}if(!v||b>h||(p=b===h?p+1:0,p>24)||(s+=v[0],f+=v[1],c.add(s+"|"+f),m=v,a.get(s+"|"+f)<=qa)||Math.max(Math.abs(s),Math.abs(f))>=o-6)break}}for(let u of n){let[s,f]=u.split("|").map(Number),m=a.get(u);for(let p=-1;p<=1;p++)for(let c=-1;c<=1;c++){if(!p&&!c)continue;let d=s+p+"|"+(f+c);if(n.has(d))continue;let h=a.get(d);h===void 0||h<m||h>m+1||i.tipo(s+p,h-1,f+c)==="erba"&&(i.togli(s+p,h-1,f+c,!0),i.metti(s+p,h-1,f+c,"sabbia",!0))}}return n}var ft={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,pozza:16762994,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function co(){for(let[i,a]of Object.entries(ft))Ue(i,{nome:a.nome,cima:a.cima,lato:a.lato,fondo:a.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:a.modello,altezza:a.altezza,mezza:a.mezza,luce:a.luce},Ka)}function uo(i){let a=new DataView(i);if(String.fromCharCode(a.getUint8(0),a.getUint8(1),a.getUint8(2),a.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let t=a.getUint32(4,!0),e=t*3,o=new Uint8Array(i,8,e*16),n=new Uint8Array(i,8+e*16,e*4),l=new Uint8Array(e*20);for(let m=0;m<e;m++)l.set(o.subarray(m*16,m*16+16),m*20),l.set(n.subarray(m*4,m*4+4),m*20+16);let r=1/0,u=-1/0,s=0,f=new DataView(l.buffer);for(let m=0;m<e;m++){let p=f.getFloat32(m*20,!0),c=f.getFloat32(m*20+4,!0),d=f.getFloat32(m*20+8,!0);r=Math.min(r,c),u=Math.max(u,c),s=Math.max(s,Math.hypot(p,d))}return{byte:l,vertici:e,triangoli:t,minY:r,maxY:u,raggio:s}}var mt=`#version 300 es
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
}`,pt=`#version 300 es
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
// \u26A0 IL COLORE DELLA LAMPADA \xC8 UN DATO, non pi\xF9 una costante nello shader. Fino
// al 10/09/2026 qui c'era vec3(1.30, 1.02, 0.58) scritto a mano: TUTTE le
// lampade del gioco facevano la stessa pozza calda, e def.luce.colore \u2014 che
// esiste da sempre in blocks.js, con tanto di lucciola verde e lampade rossa,
// verde e blu \u2014 non arrivava a schermo. \xABLuci colorate\xBB era una casella vuota.
// xyz = la tinta gi\xE0 moltiplicata per l'intensit\xE0, w = la QUOTA della lanterna
// sopra la cella (2,6 per il lampione, 0 per un blocco-lampada).
uniform highp vec4 uLampCol[8];
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
float ombraLampada(highp vec3 pos0, vec3 n, highp vec3 L) {
  // SI PARTE APPENA FUORI DALLA SUPERFICIE, non dal pixel: sulla faccia di un
  // blocco pos.xz cade ESATTAMENTE sul confine fra due celle e floor sceglie a
  // testa o croce secondo l'arrotondamento, quindi meta' dei pixel di una faccia
  // partivano dalla cella del blocco e meta' da quella d'aria. Uno scostamento
  // lungo la normale lo decide, e sempre nello stesso verso.
  highp vec3 pos = pos0 + n * 0.02;
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 cellaLampada = floor(L.xz);   // la sua cella non fa ombra a se stessa
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
    // IL MARGINE E' PICCOLO, e prima era 0,6. Serve solo perche' la colonna su cui
    // si posa il pixel non si faccia ombra da se': a 0,6 nessun ostacolo alto meno
    // di sei decimi PIU' del pixel poteva fermare la luce, e sulla faccia di spalle
    // di un muro restava accesa una FASCIA in cima alta sei decimi di blocco \u2014
    // \xABuna luce fantasma illuminante dalla faccia che dovrebbe essere in ombra\xBB.
    // E LA CELLA DELLA LAMPADA NON FA OMBRA A SE STESSA NEANCHE QUI. La stessa
    // guardia c'era gia' sul canale degli OGGETTI, e mancava su questo: finche'
    // le lampade erano solo lampioni (modelli, che nel terreno non ci sono) non
    // si vedeva. Un BLOCCO-lampada e' solido, quindi sta nel canale del terreno,
    // e il raggio verso di lui entra PER FORZA nella sua cella: ogni lampada
    // appoggiata a terra si spegneva da sola, tutta, e non accendeva niente.
    if (h > y + 0.05 && h > pos.y + 0.05 && !all(equal(cella, cellaLampada))) return 0.0;
    float ho = mappa.b * 255.0;                      // l'OGGETTO: albero, lampione, fungo
    if (ho > pos.y + 0.3 && !all(equal(cella, cellaLampada))) {
      // \u26A0 GEMELLA DI QUELLA IN resa.js, e vanno cambiate INSIEME: sono due copie
      // della stessa regola in due programmi diversi, e sono gia' divergute una
      // volta (i canali separati erano finiti solo in resa.js, e l'ombra
      // quadrata era curata sui blocchi e viva sui modelli).
      // \u26A0 La distanza si misura al punto PIU' VICINO: il punto d'ingresso nella
      // cella sta sul bordo, quindi la soglia non scattava mai.
      highp vec2 ac = (cella + 0.5) - pos.xz;
      highp float tc = clamp(dot(ac, dir), 0.0, lungo);
      highp float dist = length(ac - dir * tc);
      highp float yc = pos.y + (L.y - pos.y) * (tc / lungo);
      float base = max(h, pos.y);
      float su = clamp((yc - base) / max(1.0, ho - base), 0.0, 1.0);
      float raggio = mix(0.30, 0.85, smoothstep(0.10, 0.70, su));
      if (dist < raggio && ho > yc + 0.05) return 0.0;
    }
  }
  return 1.0;
}
vec3 pozza(highp vec3 pos, vec3 n, float cotto) {
  float peso = 0.0;
  vec3 tinta = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 lanterna = uLampade[i].xyz + vec3(0.0, uLampCol[i].w, 0.0);
    // LA FACCIA CHE GUARDA DALL'ALTRA PARTE NON E' ILLUMINATA, e basta: e' un
    // SI'/NO, non un dot sfumato \u2014 la regola della casa dice \xABo vede la luce o
    // no\xBB, e una rampa di N dot L sarebbe il face shading che qui e' vietato.
    // Senza questa riga la pozza passava ATTRAVERSO i blocchi e accendeva la
    // faccia di dietro.
    // E NON LA PUO' FARE ombraLampada: quella cammina una mappa di ALTEZZE, che
    // per costruzione non sa da che parte del muro sta il pixel. Misurato: sulla
    // faccia di spalle di un muro, alla quota della cima, NESSUN margine per
    // quanto piccolo la spegne. Solo la normale lo sa.
    // E COSTA MENO DI NIENTE: chi e' di spalle salta le quattordici letture.
    if (dot(n, lanterna - pos) <= 0.0) continue;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    float a = anello * ombraLampada(pos, n, lanterna);
    peso += a;
    tinta += a * uLampCol[i].rgb;
  }
  // IL PESO SI SATURA, IL COLORE NO: due pozze che si sovrappongono non
  // sbiancano, prendono la MEDIA delle due tinte a piena forza. Sommando i
  // colori, un rosso e un verde vicini davano giallo pieno \u2014 che non e' nessuna
  // delle due lampade. Con una lampada sola il conto e' identico a prima.
  if (peso <= 0.0) return vec3(0.0);
  return (tinta / peso) * min(peso, 1.0);
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
  c += vBase * pozza(vPos, vN, 1.0) * mix(0.45, 1.0, 1.0 - smoothstep(0.30, 0.75, uSoleForza));   // i modelli non hanno luce cotta: passa
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  // \u26A0 LA SAGOMA: quando il gatto \xE8 dietro un albero o un muro, si vede la sua
  // ombra piatta attraverso (il committente: \xABun cono che mostra il player
  // anche attraverso i blocchi, magari in nero\xBB, non un buco nel mondo)
  if (uSagoma > 0.5) { colore = vec4(c * 0.18 * 0.55, 0.55); return; }
  colore = vec4(c, 1.0);
}`;function dt(i,a=4){if(a===8)return i instanceof Float32Array?i:new Float32Array(i);let t=i.length/4,e=new Float32Array(t*8);for(let o=0;o<t;o++)e.set([i[o*4],i[o*4+1],i[o*4+2],i[o*4+3],1,1,1,0],o*8);return e}var ht=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,vt=`#version 300 es
precision mediump float;
void main() {}`,ie=class{constructor(a){this.gl=a,this.programma=ea(a,mt,pt),this.u={};for(let t of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[t]=a.getUniformLocation(this.programma,t);this.programmaOmbra=ea(a,ht,vt),this.uoVP=a.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this._pianiOmbra=new Float32Array(24),this.statistiche={disegni:0,triangoli:0,istanze:0,saltati:0}}registra(a,t){let e=this.gl,o={vao:e.createVertexArray(),vbo:e.createBuffer(),ibo:e.createBuffer(),vertici:t.vertici,triangoli:t.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:t.raggio,maxY:t.maxY};return e.bindVertexArray(o.vao),e.bindBuffer(e.ARRAY_BUFFER,o.vbo),e.bufferData(e.ARRAY_BUFFER,t.byte,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,20,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.BYTE,!0,20,12),e.enableVertexAttribArray(4),e.vertexAttribIPointer(4,1,e.UNSIGNED_BYTE,20,15),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.UNSIGNED_BYTE,!0,20,16),e.bindBuffer(e.ARRAY_BUFFER,o.ibo),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(3,1),e.enableVertexAttribArray(5),e.vertexAttribPointer(5,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(5,1),e.bindVertexArray(null),this.tipi.set(a,o),o}istanze(a,t,e=4){let o=this.tipi.get(a);if(!o)return;o.istanze=dt(t,e),o.n=o.istanze.length/8,o.sporco=!0,this.dinamici.has(a)||(this.mappaSporca=!0);let n=o.istanze;if(o.n===0){o.scatola=null;return}let l=1/0,r=1/0,u=1/0,s=-1/0,f=-1/0,m=-1/0,p=o.raggio||1,c=o.maxY||2;for(let d=0;d<o.n;d++){let h=d*8,v=n[h+3]||1,b=p*v,x=c*v;n[h]-b<l&&(l=n[h]-b),n[h]+b>s&&(s=n[h]+b),n[h+2]-b<u&&(u=n[h+2]-b),n[h+2]+b>m&&(m=n[h+2]+b),n[h+1]<r&&(r=n[h+1]),n[h+1]+x>f&&(f=n[h+1]+x)}o.scatola=[l,r,u,s,f,m]}disegnaOmbra(a,t){let e=this.gl;e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uoVP,!1,a),Ua(a,this._pianiOmbra);let o=0,n=0;for(let[l,r]of this.tipi)r.n===0||this.dinamici.has(l)!==t||r.scatola&&!Ca(this._pianiOmbra,r.scatola[0],r.scatola[1],r.scatola[2],r.scatola[3],r.scatola[4],r.scatola[5])||(e.bindVertexArray(r.vao),r.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,r.ibo),e.bufferData(e.ARRAY_BUFFER,r.istanze,e.DYNAMIC_DRAW),r.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,r.vertici,r.n),o++,n+=r.triangoli*r.n);return e.bindVertexArray(null),[o,n]}disegna(a,t){let e=this.gl,o=this.u,n=a.sole;e.useProgram(this.programma),e.uniformMatrix4fv(o.uVP,!1,a.vpCorrente||a.vp),e.uniform1f(o.uTaglio,a.taglio??-1e9);let l=a.vpCorrente===a.vpSpecchio?[0,0,0,0]:a.buco||[0,0,0,0];e.uniform3f(o.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),e.uniform1f(o.uTempo,a.tempo),e.uniform3f(o.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform3f(o.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),e.uniform1f(o.uSoleForza,n.forza),e.uniform3f(o.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),e.uniform4fv(o.uMaterie,a.materie),e.uniform2f(o.uNebbia,a.nebbia.da,a.nebbia.a),e.uniform3f(o.uNebbiaCol,a.nebbia.colore[0],a.nebbia.colore[1],a.nebbia.colore[2]),e.uniform3f(o.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),e.uniform1f(o.uOmbra,a.ombra&&a.altezze?1:0),a.altezze&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,a.ombre.tex),e.uniform1i(o.uOmbre,0),e.uniform2f(o.uOmbreScala,a.ombre.scala,a.ombre.offset),e.uniform4f(o.uAltRett,a.altRett[0],a.altRett[1],a.altRett[2],a.altRett[3])),a.legaMappa(o);let r=0,u=0,s=0,f=0;e.uniform1f(o.uSagoma,0);let m=a.pianiCorrente;for(let[c,d]of this.tipi)if(d.n!==0){if(m&&d.scatola&&!Ca(m,d.scatola[0],d.scatola[1],d.scatola[2],d.scatola[3],d.scatola[4],d.scatola[5])){f++;continue}e.uniform4f(o.uBuco,l[0],l[1],l[2],c==="omino"?0:l[3]),e.bindVertexArray(d.vao),d.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,d.ibo),e.bufferData(e.ARRAY_BUFFER,d.istanze,e.DYNAMIC_DRAW),d.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,d.vertici,d.n),r++,u+=d.triangoli*d.n,s+=d.n}let p=this.sagoma&&this.tipi.get(this.sagoma);p&&p.n>0&&a.vpCorrente!==a.vpSpecchio&&(e.uniform1f(o.uSagoma,1),e.depthFunc(e.GREATER),e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.bindVertexArray(p.vao),e.drawArraysInstanced(e.TRIANGLES,0,p.vertici,p.n),e.disable(e.BLEND),e.depthMask(!0),e.depthFunc(e.LESS),e.uniform1f(o.uSagoma,0),r++),e.bindVertexArray(null),this.statistiche.disegni=r,this.statistiche.triangoli=u,this.statistiche.istanze=s,this.statistiche.saltati=f}};function fo(i={}){let a=(t,e=1)=>typeof t=="number"&&isFinite(t)?+t.toFixed(e):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:a(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?a(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:a(i.fps,0),p50ms:a(i.p50,2),p99ms:a(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:a(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(t=>Math.round(t)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[],ritmo:i.ritmo?{scarto:a(i.ritmo.scarto,2),scartoTipico:a(i.ritmo.scartoTipico,2),singhiozziAlSec:a(i.ritmo.singhiozziAlSec,2),passo:a(i.ritmo.passo,3),liscezza:a(i.ritmo.liscezza,3),p999:a(i.ritmo.p999,1),max:a(i.ritmo.max,1),agganciato:!!i.ritmo.regolare,n:i.ritmo.n||0}:null,voto:i.voto?{punti:i.voto.punti,giudizio:i.voto.giudizio,collo:i.voto.collo}:null},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:a(i.worldgenMs,0),meshMs:a(i.meshMs,0),avvioMs:a(i.avvioMs,0)},errori:(i.errori||[]).slice(-12).map(t=>String(t).slice(0,500)),scatto:i.scatto||null,firma:"leafy-shadows/1",allegati:i.allegati&&typeof i.allegati=="object"?i.allegati:null}}function mo(i){return Math.round(JSON.stringify(i).length/1024)}var gt="https://ntfy.sh",bt="leafy-shadows-ebdbbfaf5376beedb3";async function po(i){let a=await fetch(`${gt}/${bt}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:i});if(!a.ok)return{ok:!1,dice:`il servizio ha detto no: ${a.status}`};let t=await a.json().catch(()=>({})),e=i.length>4096;return{ok:!0,id:t.id||"",dice:e?`mandato \u2714 (${Math.round(i.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(i.length/1024)} KB, dura 12 ore)`}}var xt=`
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

#diagPanel .righe { display: flex; gap: 8px; }
#diagPanel button { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(13,42,26,.22); background: #fff; font: 13px system-ui, sans-serif; }
#diagPanel button.primo { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
#diagPanel .esito { margin-top: 8px; font: 12px ui-monospace, monospace; white-space: pre-wrap; }
`,ne=class{constructor(a,t){this.leggi=a,this.scatta=t,this.errori=[],addEventListener("error",o=>this._errore(o.error||o.message)),addEventListener("unhandledrejection",o=>this._errore(o.reason));let e=document.createElement("style");e.textContent=xt,document.head.appendChild(e),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(a){let t=a&&a.stack?a.stack:String(a);this.errori.push(t),this.errori.length>40&&this.errori.shift()}allega(a,t){this.allegati||(this.allegati={}),this.allegati[a]=t}apri(){let a=this.pannello;a.classList.add("aperto"),a.innerHTML=`
      <h4>Manda la diagnostica</h4>
      <p>Numeri, storia degli fps, errori e uno scatto. Niente di personale.${this.allegati?" <b>Con i risultati dell'omega test.</b>":""}</p>
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
      <div class="righe">
        <button class="primo" id="diagVai">Manda</button>
        <button id="diagCopia">Copia</button>
        <button id="diagChiudi">Chiudi</button>
      </div>
      <div class="esito" id="diagEsito"></div>`,a.querySelector("#diagChiudi").onclick=()=>a.classList.remove("aperto"),a.querySelector("#diagCopia").onclick=()=>this.vai(!0),a.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let t=a.querySelector("#diagNota");t&&t.focus()},30)}_dice(a){let t=this.pannello.querySelector("#diagEsito");t&&(t.textContent=a)}async vai(a){let t=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let e=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,o=null;if(e)try{o=this.scatta?await this.scatta():null}catch(s){this._errore(s)}let n=fo({...this.leggi(),quando:new Date().toISOString(),nota:t,errori:this.errori,scatto:o,allegati:this.allegati||null}),l=mo(n),r=JSON.stringify(n,null,1);if(a){await this._negliAppunti(r),this.nodo.classList.remove("corso");return}let u=!1;try{let s=await fetch("/_diagnostica",{method:"GET"});u=s.ok&&(await s.json().catch(()=>({}))).collettore===!0}catch{u=!1}if(u)try{let s=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json"},body:r});if(!s.ok)this._dice("il collettore ha detto no: "+s.status);else{let f=await s.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${f.nome||""}  (${l} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}try{let s=await po(r);this._dice(s.ok?s.dice+`
(fuori casa: passa dal cloud)`:s.dice),s.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(r,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(a,t=""){try{await navigator.clipboard.writeText(a),this._dice(t+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let e=new Blob([a],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(e),o.download="leafy-diagnostica.json",o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),4e3),this._dice(t+`scaricato come file \u2714
mandami quello.`)}}};var X=document.getElementById("tela"),Et=document.getElementById("stato"),At=document.getElementById("fps"),aa=new URLSearchParams(location.search),q={raggio:+(aa.get("raggio")||5),erba:+(aa.get("erba")??8),ombra:aa.get("ombra")!=="no",specchio:aa.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(aa.get("specchio")??.5)||.5)),dprMax:+(aa.get("dpr")||1.5),rampa:aa.has("rampa"),tutto:aa.has("tutto"),mondo:aa.has("finto")||aa.has("rampa")?0:Math.max(16,Math.min(400,+(aa.get("mondo")||48))),ora:aa.has("ora")?Math.max(0,Math.min(1,+aa.get("ora"))):null},{gl:Pa,dpr:Tt,ridimensiona:zt}=Se(X,{antialias:!0,dprMax:q.dprMax}),M=new Za(Pa),oa=new ie(Pa);M.ombra=q.ombra;M.specchio.attivo=q.specchio>0;M.specchio.scala=q.specchio||.5;M.specchio.mostra=aa.has("vedi");var ue=0,La=0;function bo(i,a){let t=performance.now();for(let n of[...M.chunks.keys()])M.rimuovi(n);ue=0;for(let n=-i;n<i;n++)for(let l=-i;l<i;l++)M.carica(n+","+l,Fe(n,l,{erba:a})),ue+=256;let e=i*2*16,o=new Uint8Array(e*e);for(let n=0;n<e;n++)for(let l=0;l<e;l++)o[n*e+l]=Ia(l-i*16,n-i*16)+1;M.impostaAltezze(o,-i*16,-i*16,e,e),La=performance.now()-t}var ra=null,xo=0,Eo=0;function Mt(i,a){let t=performance.now();for(let p of[...M.chunks.keys()])M.rimuovi(p);co(),ra=new Qa;let{alberi:e,lampioni:o}=so(ra,4242,i);for(let[p,c,d]of e)ra.metti(p,c,d,"albero",!0);for(let[p,c,d]of o)ra.metti(p,c,d,"lampione",!0);let n=performance.now()-t,l=[],r=1e9,u=1e9,s=-1e9,f=-1e9;for(let p of ra.chunks.keys()){let c=no(ra,p,{erba:a});M.carica(p,c),l.push(c),r=Math.min(r,c.cx),s=Math.max(s,c.cx),u=Math.min(u,c.cz),f=Math.max(f,c.cz)}let m=ro(l,r,u,s,f);return M.impostaAltezze(m.byte,m.x0,m.z0,m.larghezza,m.profondita),ue=xo=ra.contaBlocchi,Eo=l.length,La=performance.now()-t,{tGen:n,tMesh:La-n}}var Me=null;q.mondo?Me=Mt(q.mondo,q.erba):bo(q.raggio,q.erba);async function Rt(){if(!ra)return;let i=new Map;ra.perOgni((a,t,e,o)=>{let n=W(o);n.forma!=="modello"||!n.modello||(i.has(n.modello)||i.set(n.modello,[]),i.get(n.modello).push(a+.5,t,e+.5,1))});for(let[a,t]of i)try{let e=await fetch(`./modelli/nucleo/${a}.bin`);if(!e.ok)throw new Error(`${e.status}`);oa.registra(a,uo(await e.arrayBuffer())),oa.istanze(a,t)}catch(e){console.warn(`modello ${a}: ${e.message}`)}}Rt();M.tutto=q.tutto;var St=()=>{if(!ra)return Ia(0,0)+2;for(let i=120;i>-Ea;i--)if(ra.tipo(0,i,0))return i+2;return 8},V={alpha:-.8,beta:1.05,raggio:46,centro:[0,St(),0],fov:.9};function Ao(){let i=Math.sin(V.beta),a=Math.cos(V.beta);return[V.centro[0]+V.raggio*i*Math.cos(V.alpha),V.centro[1]+V.raggio*a,V.centro[2]+V.raggio*i*Math.sin(V.alpha)]}var Fa=null,re=0;X.addEventListener("pointerdown",i=>{Fa={x:i.clientX,y:i.clientY},X.setPointerCapture(i.pointerId)});X.addEventListener("pointermove",i=>{Fa&&(V.alpha+=(i.clientX-Fa.x)*.006,V.beta=Math.max(.15,Math.min(1.5,V.beta-(i.clientY-Fa.y)*.006)),Fa={x:i.clientX,y:i.clientY})});X.addEventListener("pointerup",()=>{Fa=null});X.addEventListener("wheel",i=>{V.raggio=Math.max(8,Math.min(140,V.raggio*(i.deltaY>0?1.1:.9))),i.preventDefault()},{passive:!1});X.addEventListener("touchstart",i=>{i.touches.length===2&&(re=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY))},{passive:!0});X.addEventListener("touchmove",i=>{if(i.touches.length!==2)return;let a=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY);re>0&&(V.raggio=Math.max(8,Math.min(140,V.raggio*re/a))),re=a},{passive:!0});var le=q.ora??.35;function Lt(i){q.ora===null&&(le=(le+i/300)%1);let a=le*Math.PI*2-Math.PI/2,t=.24+.5*Math.max(0,Math.sin(a)),e=a*.5;M.sole.verso=[-Math.cos(e)*Math.cos(Math.asin(t)),-t,-Math.sin(e)*Math.cos(Math.asin(t))];let o=Math.max(0,Math.min(1,(Math.sin(a)+.1)*2));M.sole.forza=o;let n=Math.min(1,Math.max(0,(t-.24)/.4));M.sole.colore=[1,.78+.22*n,.55+.45*n],M.sole.cielo=[.36+.64*o,.38+.62*o,.57+.43*o],M.nebbia.colore=[.25+.47*o,.35+.5*o,.5+.42*o],Pa.clearColor(M.nebbia.colore[0],M.nebbia.colore[1],M.nebbia.colore[2],1)}var Q=[],ha=[],se=[],ho=performance.now(),To=0,vo=0;function zo(i){let a=Math.min(.1,(i-ho)/1e3);ho=i;let t=performance.now();zt(),Lt(a);let o={occhio:Ao(),centro:V.centro,fov:V.fov,rapporto:X.width/X.height};M.disegna(o,a,oa),oa.disegna(M,o),M.disegnaAcqua();let n=performance.now()-t;Q.push(a*1e3),Q.length>240&&Q.shift(),ha.push(n),ha.length>240&&ha.shift(),To++,i-vo>500&&(vo=i,Mo()),q.rampa&&!q.mondo&&Ot(i),requestAnimationFrame(zo)}var ce=[{raggio:5,erba:2,tutto:!1},{raggio:6,erba:3,tutto:!1},{raggio:7,erba:4,tutto:!1},{raggio:6,erba:3,tutto:!0},{raggio:8,erba:4,tutto:!0}],fe=[],Sa=-1,go=0;function Ot(i){if(Sa>=0&&i-go<6e3)return;if(Sa>=0){let t=Q.slice(-Math.min(Q.length,200)),e=ce[Sa];fe.push({...e,fps:+(1e3/(H(t,.5)||1)).toFixed(0),p50:+H(t,.5).toFixed(1),p99:+H(t,.99).toFixed(1),js:+H(ha,.5).toFixed(2),disegni:M.statistiche.disegni,triangoli:M.statistiche.triangoli})}if(Sa++,Sa>=ce.length){q.rampa=!1,Mo();return}let a=ce[Sa];bo(a.raggio,a.erba),M.tutto=a.tutto,q.erba=a.erba,q.raggio=a.raggio,Q.length=0,ha.length=0,go=i}var H=(i,a)=>{if(!i.length)return 0;let t=i.slice().sort((e,o)=>e-o);return t[Math.min(t.length-1,Math.floor(t.length*a))]};function Mo(){let i=H(Q,.5),a=H(Q,.99),t=i?1e3/i:0;se.push(Math.round(t)),se.length>120&&se.shift();let e={disegni:M.statistiche.disegni+oa.statistiche.disegni+M.statistiche.disegniAcqua+M.statistiche.disegniErba+M.statistiche.disegniSpecchio,triangoli:M.statistiche.triangoli+oa.statistiche.triangoli+M.statistiche.triangoliAcqua+M.statistiche.triangoliErba+M.statistiche.triangoliSpecchio,chunkVisti:M.statistiche.chunkVisti,chunkTotali:M.statistiche.chunkTotali};At.textContent=`${t.toFixed(0)} fps
${i.toFixed(1)} / ${a.toFixed(1)} ms
JS ${H(ha,.5).toFixed(2)} ms`,Et.textContent=`NUCLEO ${q.mondo?`F1 \xB7 open world vero (semilato ${q.mondo}, ${Eo} chunk, ${xo.toLocaleString("it")} blocchi, gen ${Me.tGen.toFixed(0)} ms + mesh ${Me.tMesh.toFixed(0)} ms)`:"F0"} \xB7 ${X.width}\xD7${X.height} (dpr ${Tt.toFixed(2)})
disegni ${e.disegni}  triangoli ${e.triangoli.toLocaleString("it")}  chunk ${e.chunkVisti}/${e.chunkTotali}
ombra del sole: ${M.ombra?"horizon mapping":"spenta"} \xB7 erba ${q.erba} \xB7 modelli ${oa.statistiche.istanze} istanze in ${oa.statistiche.disegni} disegni \xB7 acqua ${M.statistiche.disegniAcqua} disegni${M.statistiche.pelo!=null?` + specchio ${M.statistiche.disegniSpecchio} disegni (pelo ${M.statistiche.pelo.toFixed(2)}, scala ${M.specchio.scala})`:" (senza specchio)"} \xB7 erba ${M.statistiche.triangoliErba.toLocaleString("it")} fili in ${M.statistiche.disegniErba} disegni \xB7 costruzione ${La.toFixed(0)} ms
${Ya(Pa)}
?mondo=96 ?ora=0.95 ?finto ?raggio=${q.raggio} ?erba=${q.erba} ?ombra=${q.ombra?"s\xEC":"no"} ?specchio=${q.specchio||"no"} ?dpr=${q.dprMax} ?rampa ?tutto  \xB7  tocca lo schermo per girare`+(fe.length?`
RAMPA  fps  p50   p99   dis  triangoli
`+fe.map(o=>`r${o.raggio} e${o.erba}${o.tutto?" tutto":""}  ${String(o.fps).padStart(3)}  ${String(o.p50).padStart(5)}  ${String(o.p99).padStart(5)}  ${String(o.disegni).padStart(3)}  ${o.triangoli.toLocaleString("it")}`).join(`
`):"")+(q.rampa?`
rampa: gradino ${Sa+1}/${ce.length}\u2026`:"")}requestAnimationFrame(zo);var Ct=new ne(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[X.clientWidth,X.clientHeight],reso:[X.width,X.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:q.mondo?"nucleo F1 mondo vero":"nucleo F0",mondo:q.mondo,raggio:q.raggio,erba:q.erba,ombra:M.ombra,specchio:q.specchio,disegniSpecchio:M.statistiche.disegniSpecchio,tutto:!!M.tutto,dprMax:q.dprMax,jsMs:+H(ha,.5).toFixed(2),jsP99:+H(ha,.99).toFixed(2),rampa:fe},ombreLampade:!1,antialias:!0,fps:H(Q,.5)?1e3/H(Q,.5):null,p50:H(Q,.5),p99:H(Q,.99),disegni:M.statistiche.disegni+oa.statistiche.disegni+M.statistiche.disegniAcqua+M.statistiche.disegniErba+M.statistiche.disegniSpecchio,triangoli:M.statistiche.triangoli+oa.statistiche.triangoli+M.statistiche.triangoliAcqua+M.statistiche.triangoliErba+M.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:se,storiaLivelli:[],scheda:Ya(Pa),software:/swiftshader|llvmpipe/i.test(Ya(Pa)),chunk:M.statistiche.chunkTotali,blocchi:ue,luci:0,decorazioni:oa.statistiche.istanze,erba:M.statistiche.triangoliErba,ora:`${Math.floor(le*24)}h`,giorno:0,worldgenMs:La,meshMs:La}),()=>{let i=Ao();return M.disegna({occhio:i,centro:V.centro,fov:V.fov,rapporto:X.width/X.height},0),Promise.resolve(X.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:M,modelli:oa,cam:V,opz:q,statistiche:()=>({fps:1e3/(H(Q,.5)||1),p50:H(Q,.5),p99:H(Q,.99),js:H(ha,.5),...M.statistiche,modelli:{...oa.statistiche},costruzioneMs:La,fotogrammi:To}),diagnostica:Ct};

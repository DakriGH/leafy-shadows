function Le(i,{antialias:a=!0,dprMax:t=1.5}={}){let e=i.getContext("webgl2",{antialias:a,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!e)throw new Error("WebGL2 non disponibile");let o=Math.min(t,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(i.clientWidth*o)),l=Math.max(1,Math.round(i.clientHeight*o));return i.width!==r||i.height!==l?(i.width=r,i.height=l,e.viewport(0,0,r,l),!0):!1};return n(),{gl:e,dpr:o,ridimensiona:n}}function ea(i,a,t){let e=(n,r)=>{let l=i.createShader(n);if(i.shaderSource(l,r),i.compileShader(l),!i.getShaderParameter(l,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(l)}
${r.split(`
`).map((f,c)=>`${c+1}: ${f}`).join(`
`)}`);return l},o=i.createProgram();if(i.attachShader(o,e(i.VERTEX_SHADER,a)),i.attachShader(o,e(i.FRAGMENT_SHADER,t)),i.linkProgram(o),!i.getProgramParameter(o,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(o)}`);return o}function Xa(i){let a=i.getExtension("WEBGL_debug_renderer_info");return a?i.getParameter(a.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function K(i,a,t){return(Math.sign(i)+1)*9+(Math.sign(a)+1)*3+(Math.sign(t)+1)}var Io=K(1,0,0),_o=K(-1,0,0),No=K(0,1,0),yo=K(0,-1,0),qo=K(0,0,1),Fo=K(0,0,-1);var Ce=[Io,_o,No,yo,qo,Fo],Ma=class{constructor(a=1024){this.byte=new Uint8Array(a*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(a){let t=(this.n+a)*12;if(t<=this.byte.length)return;let e=this.byte.length*2;for(;e<t;)e*=2;let o=new Uint8Array(e);o.set(this.byte),this.byte=o,this.u32=new Uint32Array(o.buffer)}vertice(a,t,e,o,n,r,l,f=0,c=0){let u=Math.round(a*16)+16,p=Math.round(e*16)+16,m=Math.round(t*16);if(u<0||u>511||p<0||p>511||m<0||m>65535)throw new RangeError(`vertice fuori dal chunk: ${a},${t},${e}`);if(o<0||o>26||o===13)throw new RangeError(`normale non valida: ${o}`);this._spazio(1);let s=this.n*3,h=this.byte,v=this.u32;v[s]=(u|p<<9|(o&31)<<18|(f&1)<<23|(c&15)<<24)>>>0,v[s+1]=(m|(n&15)<<16|(r&15)<<20)>>>0;let d=this.n*12+8;h[d]=l>>16&255,h[d+1]=l>>8&255,h[d+2]=l&255,h[d+3]=0,this.n++}quadDa(a,t,e,o){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[a,t,e,o])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function Oe(i=16384){let a=new Uint16Array(i*6);for(let t=0,e=0,o=0;t<i;t++,o+=4)a[e++]=o,a[e++]=o+1,a[e++]=o+2,a[e++]=o,a[e++]=o+2,a[e++]=o+3;return a}function Ie(i,a,t,e){let o=1/Math.tan(i/2),n=1/(t-e);return new Float32Array([o/a,0,0,0,0,o,0,0,0,0,(e+t)*n,-1,0,0,2*e*t*n,0])}function fe(i,a,t){let e=1/(t-a);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*e,0,0,0,-(t+a)*e,1])}function Ya(i,a,t=[0,1,0]){let e=i[0]-a[0],o=i[1]-a[1],n=i[2]-a[2],r=Math.hypot(e,o,n)||1;e/=r,o/=r,n/=r;let l=t[1]*n-t[2]*o,f=t[2]*e-t[0]*n,c=t[0]*o-t[1]*e;r=Math.hypot(l,f,c)||1,l/=r,f/=r,c/=r;let u=o*c-n*f,p=n*l-e*c,m=e*f-o*l;return new Float32Array([l,u,e,0,f,p,o,0,c,m,n,0,-(l*i[0]+f*i[1]+c*i[2]),-(u*i[0]+p*i[1]+m*i[2]),-(e*i[0]+o*i[1]+n*i[2]),1])}function _e(i,a=new Float32Array(16)){let[t,e,o,n,r,l,f,c,u,p,m,s,h,v,d,b]=i,x=t*l-e*r,g=t*f-o*r,M=t*c-n*r,R=e*f-o*l,L=e*c-n*l,S=o*c-n*f,A=u*v-p*h,_=u*d-m*h,C=u*b-s*h,O=p*d-m*v,N=p*b-s*v,E=m*b-s*d,z=x*E-g*N+M*O+R*C-L*_+S*A;return z?(z=1/z,a[0]=(l*E-f*N+c*O)*z,a[1]=(o*N-e*E-n*O)*z,a[2]=(v*S-d*L+b*R)*z,a[3]=(m*L-p*S-s*R)*z,a[4]=(f*C-r*E-c*_)*z,a[5]=(t*E-o*C+n*_)*z,a[6]=(d*M-h*S-b*g)*z,a[7]=(u*S-m*M+s*g)*z,a[8]=(r*N-l*C+c*A)*z,a[9]=(e*C-t*N-n*A)*z,a[10]=(h*L-v*M+b*x)*z,a[11]=(p*M-u*L-s*x)*z,a[12]=(l*_-r*O-f*A)*z,a[13]=(t*O-e*_+o*A)*z,a[14]=(v*g-h*R-d*x)*z,a[15]=(u*R-p*g+m*x)*z,a):null}function Ua(i,a,t=new Float32Array(16)){for(let e=0;e<4;e++)for(let o=0;o<4;o++)t[e*4+o]=i[o]*a[e*4]+i[4+o]*a[e*4+1]+i[8+o]*a[e*4+2]+i[12+o]*a[e*4+3];return t}function me(i,a=new Float32Array(24)){let t=f=>[i[f],i[4+f],i[8+f],i[12+f]],e=t(0),o=t(1),n=t(2),r=t(3),l=[[r[0]+e[0],r[1]+e[1],r[2]+e[2],r[3]+e[3]],[r[0]-e[0],r[1]-e[1],r[2]-e[2],r[3]-e[3]],[r[0]+o[0],r[1]+o[1],r[2]+o[2],r[3]+o[3]],[r[0]-o[0],r[1]-o[1],r[2]-o[2],r[3]-o[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let f=0;f<6;f++){let[c,u,p,m]=l[f],s=Math.hypot(c,u,p)||1;a[f*4]=c/s,a[f*4+1]=u/s,a[f*4+2]=p/s,a[f*4+3]=m/s}return a}function pe(i,a,t,e,o,n,r){for(let l=0;l<6;l++){let f=i[l*4],c=i[l*4+1],u=i[l*4+2],p=i[l*4+3],m=f>0?o:a,s=c>0?n:t,h=u>0?r:e;if(f*m+c*s+u*h+p<0)return!1}return!0}var de=2,Uo=`#version 300 es
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
}`,Ne=`#version 300 es
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
}`,Do=`#version 300 es
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
void main() {}`,$a=class{constructor(a){this.gl=a,this.programma=ea(a,Uo,Ne),this.u={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[t]=a.getUniformLocation(this.programma,t);this.ebo=a.createBuffer(),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.ebo),a.bufferData(a.ELEMENT_ARRAY_BUFFER,Oe(16384),a.STATIC_DRAW),this.programmaErba=ea(a,Bo,Ne.replace(/flat in /g,"in ")),this.ue={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.ue[t]=a.getUniformLocation(this.programmaErba,t);this.programmaOmbra=ea(a,ko,Xo),this.uo={uVP:a.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:a.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=ea(a,Do,wo),this.ua={};for(let t of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[t]=a.getUniformLocation(this.programmaAcqua,t);this.programmaCielo=ea(a,Vo,Go),this.uc={};for(let t of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[t]=a.getUniformLocation(this.programmaCielo,t);this.vaoVuoto=a.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=a.createSampler(),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_MIN_FILTER,a.LINEAR),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_MAG_FILTER,a.LINEAR),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.samplerParameteri(this.campionatoreLiscio,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(1024),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,colonne:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!a.getExtension("EXT_color_buffer_half_float")&&!!a.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.lampadeCol=new Float32Array(32),this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,a.enable(a.DEPTH_TEST),a.enable(a.CULL_FACE),a.cullFace(a.BACK),a.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(a,t){let e=this.mappa;Math.hypot(a+8-e.centro[0],t+8-e.centro[2])<=e.raggio+12&&(e.sporca=!0)}carica(a,t){let e=this.gl;this._sporcaMappa(t.cx*16,t.cz*16);let o=this.chunks.get(a);o||(o={vao:e.createVertexArray(),vbo:e.createBuffer(),quad:0},e.bindVertexArray(o.vao),e.bindBuffer(e.ARRAY_BUFFER,o.vbo),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null),this.chunks.set(a,o)),e.bindBuffer(e.ARRAY_BUFFER,o.vbo),e.bufferData(e.ARRAY_BUFFER,t.byte,e.STATIC_DRAW),o.quad=t.quad;let n=t.erba;o.verticiErba=n?n.vertici:0,o.lamelle=n?n.fili:0,o.yBaseErba=n?n.yBase:0,o.verticiErba>0&&(o.vaoErba||(o.vaoErba=e.createVertexArray(),o.vboErba=e.createBuffer(),e.bindVertexArray(o.vaoErba),e.bindBuffer(e.ARRAY_BUFFER,o.vboErba),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,4,e.UNSIGNED_BYTE,12,0),e.vertexAttribDivisor(0,1),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,4),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribIPointer(2,4,e.UNSIGNED_BYTE,12,8),e.vertexAttribDivisor(2,1),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,o.vboErba),e.bufferData(e.ARRAY_BUFFER,n.byte,e.STATIC_DRAW));let r=t.acqua;if(o.quadAcqua=r?r.quad:0,o.peloAcqua=r&&r.pelo!=null?r.pelo:null,o.quadAcqua>0&&(o.vaoAcqua||(o.vaoAcqua=e.createVertexArray(),o.vboAcqua=e.createBuffer(),e.bindVertexArray(o.vaoAcqua),e.bindBuffer(e.ARRAY_BUFFER,o.vboAcqua),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,o.vboAcqua),e.bufferData(e.ARRAY_BUFFER,r.byte,e.STATIC_DRAW)),o.luci=t.luci||[],o.x0=t.cx*16,o.z0=t.cz*16,o.minY=t.minY,o.maxY=t.maxY,o.y0=t.y0||0,o.chunk=[o.x0,o.y0,o.z0],t.altezze){o.tegola||(o.tegola=new Uint8Array(1024));let l=t.solide||t.altezze,f=t.impronte;for(let c=0;c<16;c++)for(let u=0;u<16;u++){let p=(u*16+c)*4,m=c*16+u,s=t.altezze[m],h=l[m],v=f?f[m]:-1;o.tegola[p]=s<0?0:Math.max(0,Math.min(255,s+1)),o.tegola[p+1]=h<0?0:Math.max(0,Math.min(255,h+1)),o.tegola[p+2]=v<0?0:Math.max(0,Math.min(255,v+1)),o.tegola[p+3]=255}this.finestra&&this._scriviTegola(o)}}apriFinestraAltezze(a,t,e=512){let o=this.gl;this.altezze||(this.altezze=o.createTexture()),this.finestra={lato:e,x0:0,z0:0,vuota:new Uint8Array(e*e*4),spostamenti:0},o.bindTexture(o.TEXTURE_2D,this.altezze),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),this._centraFinestra(a,t,!0)}seguiAltezze(a,t){this.finestra&&this._centraFinestra(a,t,!1)}_centraFinestra(a,t,e){let o=this.gl,n=this.finestra,r=n.lato/2;if(!e&&Math.abs(a-(n.x0+r))<n.lato/4&&Math.abs(t-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((a-r)/16)*16,n.z0=Math.floor((t-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.colonne!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,this.ombre.w,this.ombre.h],o.bindTexture(o.TEXTURE_2D,this.altezze),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,n.lato,n.lato,0,o.RGBA,o.UNSIGNED_BYTE,n.vuota);for(let l of this.chunks.values())l.tegola&&this._scriviTegola(l);return n.spostamenti++,!0}_scriviTegola(a,t=!1){let e=this.gl,o=this.finestra,n=a.x0-o.x0,r=a.z0-o.z0;n<0||r<0||n+16>o.lato||r+16>o.lato||(e.bindTexture(e.TEXTURE_2D,this.altezze),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,n,r,16,16,e.RGBA,e.UNSIGNED_BYTE,t?this._tegolaVuota:a.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(a,t,e,o=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=ea(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,a,t,e,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,a,t,e,.1),n.uniform3f(r.uColore,1,1-.45*o,1-.8*o),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(a,t,e,o,n,r,l=.3,f=.1){let c=this.gl;this.programmaPieno||(this.programmaPieno=ea(c,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:c.getUniformLocation(this.programmaPieno,"uVP"),uCella:c.getUniformLocation(this.programmaPieno,"uCella"),uColore:c.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=c.createVertexArray());let u=this.uPieno;c.useProgram(this.programmaPieno),c.uniformMatrix4fv(u.uVP,!1,this.vp),c.uniform4f(u.uCella,a,t,e,f),c.uniform4f(u.uColore,o*l,n*l,r*l,l),c.bindVertexArray(this.vaoPieno),c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.depthMask(!1),c.disable(c.CULL_FACE),c.drawArrays(c.TRIANGLES,0,36),c.enable(c.CULL_FACE),c.depthMask(!0),c.disable(c.BLEND),c.bindVertexArray(null)}rimuovi(a){let t=this.chunks.get(a);t&&(this._sporcaMappa(t.x0,t.z0),this.finestra&&t.tegola&&this._scriviTegola(t,!0),this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.vbo),t.vaoAcqua&&(this.gl.deleteVertexArray(t.vaoAcqua),this.gl.deleteBuffer(t.vboAcqua)),t.vaoErba&&(this.gl.deleteVertexArray(t.vaoErba),this.gl.deleteBuffer(t.vboErba)),this.chunks.delete(a))}_sporcaOmbre(a,t,e,o){let r=[Math.max(0,a-26),Math.max(0,t-26),Math.min(this.ombre.w||1e9,a+e+26),Math.min(this.ombre.h||1e9,t+o+26)],l=this.ombre.sporco;this.ombre.sporco=l?[Math.min(l[0],r[0]),Math.min(l[1],r[1]),Math.max(l[2],r[2]),Math.max(l[3],r[3])]:r}_preparaOmbre(a,t){let e=this.gl,o=this.ombre;o.colonne=a;let n=a*de,r=t*de;if(o.tex||(o.tex=e.createTexture(),o.fbo=e.createFramebuffer()),e.bindTexture(e.TEXTURE_2D,o.tex),o.mezzoFloat=this._ombreMezzo,o.mezzoFloat?(e.texImage2D(e.TEXTURE_2D,0,e.R16F,n,r,0,e.RED,e.HALF_FLOAT,null),o.scala=1,o.offset=0):(e.texImage2D(e.TEXTURE_2D,0,e.R8,n,r,0,e.RED,e.UNSIGNED_BYTE,null),o.scala=64,o.offset=-8),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,o.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o.tex,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&o.mezzoFloat)return this._ombreMezzo=!1,e.bindFramebuffer(e.FRAMEBUFFER,null),this._preparaOmbre(a,t);if(e.bindFramebuffer(e.FRAMEBUFFER,null),o.w=n,o.h=r,o.sporco=[0,0,n,r],!this.programmaOmbre){this.programmaOmbre=ea(e,`#version 300 es
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
}`),this.uOmbre={};for(let l of["uAltezze","uAltRett","uSole","uCodifica","uSuper"])this.uOmbre[l]=e.getUniformLocation(this.programmaOmbre,l);this.vaoOmbre=e.createVertexArray()}}_calcolaOmbre(){let a=this.gl,t=this.ombre,e=this.sole;if(!this.altezze||!t.tex||(e.verso[0]*t.sole[0]+e.verso[1]*t.sole[1]+e.verso[2]*t.sole[2]<.99996&&(t.sole=e.verso.slice(),t.sporco=[0,0,t.w,t.h]),!t.sporco))return;let n=96,[r,l,f,c]=t.sporco;if(f<=r||c<=l){t.sporco=null;return}let u=Math.min(c,l+n);t.sporco=u>=c?null:[r,u,f,c];let p=Math.hypot(e.verso[0],e.verso[2])||1e-4,m=[-e.verso[0]/p,-e.verso[2]/p],s=Math.max(.05,-e.verso[1]/p);a.bindFramebuffer(a.FRAMEBUFFER,t.fbo),a.viewport(0,0,t.w,t.h),a.enable(a.SCISSOR_TEST),a.scissor(r,l,f-r,u-l),a.disable(a.DEPTH_TEST),a.disable(a.CULL_FACE),a.useProgram(this.programmaOmbre),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.altezze),a.uniform1i(this.uOmbre.uAltezze,0),a.bindSampler(0,this.campionatoreLiscio),a.uniform4f(this.uOmbre.uAltRett,0,0,1/t.w,1/t.h),a.uniform3f(this.uOmbre.uSole,m[0],m[1],s),a.uniform2f(this.uOmbre.uCodifica,t.scala,t.offset),a.uniform1f(this.uOmbre.uSuper,de),a.bindVertexArray(this.vaoOmbre),a.drawArrays(a.TRIANGLES,0,3),a.bindVertexArray(null),a.bindSampler(0,null),a.disable(a.SCISSOR_TEST),a.enable(a.DEPTH_TEST),a.enable(a.CULL_FACE),a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),t.calcoli++,this.statistiche.calcoliOmbre=t.calcoli}_disegnaCielo(a,t){let e=this.gl,o=this.uc,n=this.sole;if(this.cieloNero||!_e(a,this._invVP))return;e.useProgram(this.programmaCielo),e.uniformMatrix4fv(o.uInvVP,!1,this._invVP),e.uniform3f(o.uOcchio,t[0],t[1],t[2]),e.uniform3f(o.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform1f(o.uSoleForza,n.forza),e.uniform3f(o.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;e.uniform3f(o.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),e.disable(e.DEPTH_TEST),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vaoVuoto),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.enable(e.CULL_FACE),e.depthMask(!0),e.enable(e.DEPTH_TEST)}_preparaMappa(){let a=this.gl,t=this.mappa,e=o=>{let n=a.createTexture();a.bindTexture(a.TEXTURE_2D,n),a.texImage2D(a.TEXTURE_2D,0,a.DEPTH_COMPONENT24,o,o,0,a.DEPTH_COMPONENT,a.UNSIGNED_INT,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_COMPARE_MODE,a.COMPARE_REF_TO_TEXTURE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_COMPARE_FUNC,a.LEQUAL);let r=a.createFramebuffer();a.bindFramebuffer(a.FRAMEBUFFER,r),a.framebufferTexture2D(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.TEXTURE_2D,n,0),a.drawBuffers([a.NONE]),a.readBuffer(a.NONE);let l=a.checkFramebufferStatus(a.FRAMEBUFFER)===a.FRAMEBUFFER_COMPLETE;return a.bindFramebuffer(a.FRAMEBUFFER,null),{tex:n,fbo:r,lato:o,ok:l}};t.stat=e(t.lato),t.din=e(t.latoDin),(!t.stat.ok||!t.din.ok)&&(t.attiva=!1)}legaMappa(a){let t=this.gl,e=this.mappa;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,e.stat.tex),t.uniform1i(a.uMappaStat,1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,e.din.tex),t.uniform1i(a.uMappaDin,2),t.activeTexture(t.TEXTURE0),t.uniform1f(a.uMappaOn,e.on?1:0),t.uniformMatrix4fv(a.uLuceVP,!1,e.vp),t.uniformMatrix4fv(a.uLuceVPDin,!1,e.vpDin),t.uniform2f(a.uMappaTexel,.5/e.lato,.5/e.latoDin),t.uniform2f(a.uMappaSbieco,1.5*(2*e.raggio/e.lato),.1/220),t.uniform4fv(a.uLampade,this.lampade),t.uniform1i(a.uNLampade,this.nLampade),t.uniform4fv(a.uLampCol,this.lampadeCol),t.uniform3f(a.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(a.uAltezze,3),t.activeTexture(t.TEXTURE0))}_aggiornaMappa(a,t){let e=this.gl,o=this.mappa,n=this.sole,r=this.statistiche;if(o.on=!1,!o.attiva||!this.ombra)return;let l=typeof performance<"u"?performance.now():0,f=a.centro[0],c=a.centro[2],u=!1;Math.hypot(f-o.centro[0],c-o.centro[2])>10&&(o.centro=[Math.round(f/2)*2,Math.round(a.centro[1]),Math.round(c/2)*2],u=!0);{let d=n.verso,b=a.centro,x=[b[0]-d[0]*120,b[1]-d[1]*120,b[2]-d[2]*120],g=Math.abs(d[1])>.95?[0,0,1]:[0,1,0];Ua(fe(o.raggioDin,10,230),Ya(x,b,g),o.vpDin)}n.verso[0]*o.sole[0]+n.verso[1]*o.sole[1]+n.verso[2]*o.sole[2]<.99985&&(o.soleMosso=!0);let m=o.sporca||o.soleMosso||t&&t.mappaSporca,s=u||m&&l-(o.ultimo||0)>=500;if(s){o.sole=n.verso.slice(),o.soleMosso=!1,o.ultimo=l;let d=n.verso,b=o.centro,x=[b[0]-d[0]*120,b[1]-d[1]*120,b[2]-d[2]*120],g=Math.abs(d[1])>.95?[0,0,1]:[0,1,0];Ua(fe(o.raggio,10,230),Ya(x,b,g),o.vp)}if(e.enable(e.POLYGON_OFFSET_FILL),e.polygonOffset(1.5,4),s){e.bindFramebuffer(e.FRAMEBUFFER,o.stat.fbo),e.viewport(0,0,o.stat.lato,o.stat.lato),e.clear(e.DEPTH_BUFFER_BIT),e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uo.uVP,!1,o.vp);let d=0,b=0,x=o.raggio+12;for(let g of this.chunks.values())g.quad!==0&&(Math.hypot(g.x0+8-o.centro[0],g.z0+8-o.centro[2])>x||(e.uniform3f(this.uo.uChunk,g.chunk[0],g.chunk[1],g.chunk[2]),e.bindVertexArray(g.vao),e.drawElements(e.TRIANGLES,g.quad*6,e.UNSIGNED_SHORT,0),d++,b+=g.quad*2));if(e.bindVertexArray(null),t){let[g,M]=t.disegnaOmbra(o.vp,!1);d+=g,b+=M,t.mappaSporca=!1}o.sporca=!1,o.calcoli++,o.disegni=d,o.triangoli=b}e.bindFramebuffer(e.FRAMEBUFFER,o.din.fbo),e.viewport(0,0,o.din.lato,o.din.lato),e.clear(e.DEPTH_BUFFER_BIT);let h=0,v=0;t&&([h,v]=t.disegnaOmbra(o.vpDin,!0)),e.disable(e.POLYGON_OFFSET_FILL),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),o.on=!0,r.calcoliMappa=o.calcoli,r.disegniOmbra=h+(s?o.disegni:0),r.triangoliOmbra=v+(s?o.triangoli:0)}impostaAltezze(a,t,e,o,n,r=null){let l=this.gl;this.altezze||(this.altezze=l.createTexture()),l.bindTexture(l.TEXTURE_2D,this.altezze),l.pixelStorei(l.UNPACK_ALIGNMENT,1);let f=new Uint8Array(o*n*4);for(let c=0;c<o*n;c++)f[c*4]=a[c],f[c*4+1]=r?r[c]:a[c];l.texImage2D(l.TEXTURE_2D,0,l.RGBA8,o,n,0,l.RGBA,l.UNSIGNED_BYTE,f),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),this.altRett=[t,e,1/o,1/n],this._preparaOmbre(o,n)}impostaMaterie(a){let t=new Float32Array(64);for(let e=0;e<16&&e<a.length;e++)for(let o=0;o<4;o++)t[e*4+o]=a[e][o]||0;this.materie=t}disegna(a,t,e=null){let o=this.gl,n=this.statistiche;this.tempo+=t;let r=Ie(a.fov,a.rapporto,.3,400),l=Ya(a.occhio,a.centro);Ua(r,l,this.vp),me(this.vp,this.piani),this._camera=a,this._visibili.length=0,this._visibiliErba.length=0;let f=0;for(let s of this.chunks.values())s.quad===0&&s.quadAcqua===0||(s.visto=this.tutto||pe(this.piani,s.x0,s.y0+s.minY,s.z0,s.x0+16,s.y0+s.maxY+1,s.z0+16),s.visto&&(f++,s.quadAcqua>0&&this._visibili.push(s),s.verticiErba>0&&Math.hypot(s.x0+8-a.occhio[0],s.z0+8-a.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(s)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(a,e),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(a,e),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,a.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[c,u]=this._solidi(this.vp,this.piani,a.occhio,!1),p=0,m=0;if(this._visibiliErba.length){let s=this.ue,h=this.sole;o.useProgram(this.programmaErba),o.uniformMatrix4fv(s.uVP,!1,this.vp),o.uniform1f(s.uTempo,this.tempo),o.uniform3f(s.uSoleVerso,h.verso[0],h.verso[1],h.verso[2]),o.uniform3f(s.uSoleCol,h.colore[0],h.colore[1],h.colore[2]),o.uniform1f(s.uSoleForza,h.forza),o.uniform3f(s.uCieloCol,h.cielo[0],h.cielo[1],h.cielo[2]),o.uniform2f(s.uNebbia,this.nebbia.da,this.nebbia.a),o.uniform3f(s.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),o.uniform3f(s.uCam,a.occhio[0],a.occhio[1],a.occhio[2]),o.uniform2f(s.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),o.uniform1f(s.uOmbra,this.ombra&&this.altezze?1:0),o.uniform1f(s.uTaglio,-1e9),o.uniform1f(s.uErbaFinoA,this.erbaFinoA),o.uniform4f(s.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),o.uniform3f(s.uOcchio,a.occhio[0],a.occhio[1],a.occhio[2]),this.altezze&&(o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.ombre.tex),o.uniform1i(s.uOmbre,0),o.uniform2f(s.uOmbreScala,this.ombre.scala,this.ombre.offset),o.uniform4f(s.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(s),o.disable(o.CULL_FACE);for(let v of this._visibiliErba)o.uniform3f(s.uChunk,v.chunk[0],v.yBaseErba,v.chunk[2]),o.bindVertexArray(v.vaoErba),o.drawArraysInstanced(o.TRIANGLES,0,6,v.lamelle),p++,m+=v.lamelle*2;o.enable(o.CULL_FACE),o.bindVertexArray(null)}n.disegni=c,n.triangoli=u,n.chunkVisti=f,n.chunkTotali=this.chunks.size,n.disegniErba=p,n.triangoliErba=m}_solidi(a,t,e,o){let n=this.gl,r=this.u,l=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,a),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,l.verso[0],l.verso[1],l.verso[2]),n.uniform3f(r.uSoleCol,l.colore[0],l.colore[1],l.colore[2]),n.uniform1f(r.uSoleForza,l.forza),n.uniform3f(r.uCieloCol,l.cielo[0],l.cielo[1],l.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,e[0],e[1],e[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let f=o?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,f[0],f[1],f[2],f[3]),n.uniform3f(r.uOcchio,e[0],e[1],e[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let c=0,u=0;for(let p of this.chunks.values())if(p.quad!==0){if(o){if(!this.tutto&&!pe(t,p.x0,p.y0+p.minY,p.z0,p.x0+16,p.y0+p.maxY+1,p.z0+16))continue}else if(!p.visto)continue;n.uniform3f(r.uChunk,p.chunk[0],p.chunk[1],p.chunk[2]),n.bindVertexArray(p.vao),n.drawElements(n.TRIANGLES,p.quad*6,n.UNSIGNED_SHORT,0),c++,u+=p.quad*2}return n.bindVertexArray(null),[c,u]}_peloVicino(a){let t=this._voti;t.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-a[0],n.z0+8-a[2])+2.2*Math.abs(n.peloAcqua-a[1]);t.set(n.peloAcqua,(t.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let e=null,o=0;for(let[n,r]of t)r>o&&(o=r,e=n);return e}_specchia(a,t){let e=this.gl,o=this.specchio,n=this.statistiche,r=this._peloVicino(a.occhio);if(r==null||a.occhio[1]<=r+.2)return;let l=Math.max(1,Math.round(e.drawingBufferWidth*o.scala)),f=Math.max(1,Math.round(e.drawingBufferHeight*o.scala));(!o.fbo||o.w!==l||o.h!==f)&&this._preparaSpecchio(l,f);let c=this._riflessione;c.fill(0),c[0]=1,c[5]=-1,c[10]=1,c[13]=2*r,c[15]=1,Ua(this.vp,c,this.vpSpecchio),me(this.vpSpecchio,this.pianiSpecchio);let u=[a.occhio[0],2*r-a.occhio[1],a.occhio[2]];e.bindFramebuffer(e.FRAMEBUFFER,o.fbo),e.viewport(0,0,l,f),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),e.cullFace(e.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[p,m]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);n.disegniSpecchio=p,n.triangoliSpecchio=m,t&&(t.disegna(this,{occhio:u,centro:a.centro,fov:a.fov,rapporto:a.rapporto}),n.disegniSpecchio+=t.statistiche.disegni,n.triangoliSpecchio+=t.statistiche.triangoli),e.cullFace(e.BACK),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),this.taglio=-1e9,o.pelo=r,n.pelo=r}_mostraSpecchio(){let a=this.gl,t=this.specchio;this.programmaQuad||(this.programmaQuad=ea(a,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=a.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=a.createVertexArray()),a.useProgram(this.programmaQuad),a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,t.tex),a.uniform1i(this.uQuad,0),a.bindVertexArray(this.vaoQuad),a.disable(a.DEPTH_TEST),a.drawArrays(a.TRIANGLE_STRIP,0,4),a.enable(a.DEPTH_TEST),a.bindVertexArray(null)}_preparaSpecchio(a,t){let e=this.gl,o=this.specchio;o.fbo||(o.fbo=e.createFramebuffer(),o.tex=e.createTexture(),o.rbo=e.createRenderbuffer()),e.bindTexture(e.TEXTURE_2D,o.tex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,a,t,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindRenderbuffer(e.RENDERBUFFER,o.rbo),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,a,t),e.bindFramebuffer(e.FRAMEBUFFER,o.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,o.tex,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,o.rbo),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&(o.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),o.w=a,o.h=t}disegnaAcqua(){let a=this.gl,t=this.ua,e=this.sole,o=this._camera,n=this.specchio;if(!o||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}a.useProgram(this.programmaAcqua),a.uniformMatrix4fv(t.uVP,!1,this.vp),a.uniform1f(t.uTempo,this.tempo),a.uniform3f(t.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),a.uniform2f(t.uNebbia,this.nebbia.da,this.nebbia.a),a.uniform3f(t.uSoleVerso,e.verso[0],e.verso[1],e.verso[2]),a.uniform3f(t.uSoleCol,e.colore[0],e.colore[1],e.colore[2]),a.uniform1f(t.uSoleForza,e.forza),a.uniform3f(t.uCieloCol,e.cielo[0],e.cielo[1],e.cielo[2]),a.uniform3f(t.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;a.activeTexture(a.TEXTURE1),a.bindTexture(a.TEXTURE_2D,r?n.tex:null),a.uniform1i(t.uSpecchio,1),a.uniform3f(t.uSchermo,1/a.drawingBufferWidth,1/a.drawingBufferHeight,r?1:0),a.uniform1f(t.uMare,this.mare),a.uniform4fv(t.uGalleggianti,this.galleggianti),a.uniform1i(t.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(a.activeTexture(a.TEXTURE2),a.bindTexture(a.TEXTURE_2D,this.altezze),a.uniform1i(t.uAltezze,2),a.bindSampler(2,this.campionatoreLiscio),a.uniform4f(t.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):a.uniform4f(t.uAltRett,0,0,0,0),a.enable(a.BLEND),a.blendFunc(a.SRC_ALPHA,a.ONE_MINUS_SRC_ALPHA),a.depthMask(!1),a.disable(a.CULL_FACE);let l=0,f=0;for(let c of this._visibili)a.uniform3f(t.uChunk,c.chunk[0],c.chunk[1],c.chunk[2]),a.bindVertexArray(c.vaoAcqua),a.drawElements(a.TRIANGLES,c.quadAcqua*6,a.UNSIGNED_SHORT,0),l++,f+=c.quadAcqua*2;a.bindVertexArray(null),a.depthMask(!0),a.enable(a.CULL_FACE),a.disable(a.BLEND),a.bindSampler(2,null),a.activeTexture(a.TEXTURE0),this.statistiche.disegniAcqua=l,this.statistiche.triangoliAcqua=f,n.mostra&&r&&this._mostraSpecchio()}};var ge=class extends Ma{vertice(a,t,e,o,n,r,l,f=0,c=0){super.vertice(a,t,e,Ce[o],n,r,l,f,c)}},ia={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},Za=[0,6072381,8739896,14403468,9211013,5086771,6043679,2714414,16767347],Yo=1;function he(i,a){let t=e=>Math.max(0,Math.min(255,Math.round(e*a)));return t(i>>16&255)<<16|t(i>>8&255)<<8|t(i&255)}function ma(i,a,t){let e=i*374761393+a*668265263+t*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function ve(i,a,t,e){let o=i/t,n=a/t,r=Math.floor(o),l=Math.floor(n),f=o-r,c=n-l,u=f*f*(3-2*f),p=c*c*(3-2*c),m=ma(r,l,e),s=ma(r+1,l,e),h=ma(r,l+1,e),v=ma(r+1,l+1,e);return m+(s-m)*u+(h+(v-h)*u-(m+(s-m)*u))*p}function Ia(i,a,t=7){let e=ve(i,a,48,t)*14+ve(i,a,17,t+1)*5+ve(i,a,6,t+2)*1.5;return 8+Math.floor(e)}function Fe(i){return i<11?ia.sabbia:i>24?ia.roccia:ia.erba}function ye(i,a,t=7){let e=[];for(let o=0;o<2;o++){if(ma(i*3+o,a*5-o,t+9)<.35)continue;let r=i*16+Math.floor(ma(i,a,t+11+o)*15)+.5,l=a*16+Math.floor(ma(a,i,t+13+o)*15)+.5,f=Ia(Math.floor(r),Math.floor(l),t);Fe(f)===ia.erba&&e.push({x:r,y:f+3,z:l})}return e}function qe(i,a,t,e){let o=0;for(let n of e){let l=15-Math.sqrt((i-n.x)**2+(a-n.y)**2+(t-n.z)**2);l>o&&(o=l)}return Math.max(0,Math.min(15,Math.round(o)))}function Pe(i,a,{seme:t=7,erba:e=2,raggioLampade:o=2}={}){let n=new ge(1600),r=i*16,l=a*16,f=255,c=0,u=[];for(let m=-o;m<=o;m++)for(let s=-o;s<=o;s++)u.push(...ye(i+m,a+s,t));for(let m=0;m<16;m++)for(let s=0;s<16;s++){let h=r+m,v=l+s,d=Ia(h,v,t);d<f&&(f=d),d+1>c&&(c=d+1);let b=Fe(d),x=.94+.12*ma(h,v,t+3),g=qe(h+.5,d+1,v+.5,u),M=he(Za[b],x);n.quadDa([m,d+1,s,2,15,g,M],[m,d+1,s+1,2,15,g,M],[m+1,d+1,s+1,2,15,g,M],[m+1,d+1,s,2,15,g,M]);let R=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[L,S,A]of R){let _=Ia(h+L,v+S,t);for(let C=_+1;C<=d;C++){let O=Math.max(6,15-(d-C)*2),N=C===d&&b===ia.erba?ia.erba:d>24?ia.roccia:ia.terra,E=qe(h+.5+L*.5,C+.5,v+.5+S*.5,u),z=C,Y=C+1,y=he(Za[N],x);L===1?n.quadDa([m+1,z,s,A,O,E,y],[m+1,Y,s,A,O,E,y],[m+1,Y,s+1,A,O,E,y],[m+1,z,s+1,A,O,E,y]):L===-1?n.quadDa([m,z,s+1,A,O,E,y],[m,Y,s+1,A,O,E,y],[m,Y,s,A,O,E,y],[m,z,s,A,O,E,y]):S===1?n.quadDa([m+1,z,s+1,A,O,E,y],[m+1,Y,s+1,A,O,E,y],[m,Y,s+1,A,O,E,y],[m,z,s+1,A,O,E,y]):n.quadDa([m,z,s,A,O,E,y],[m,Y,s,A,O,E,y],[m+1,Y,s,A,O,E,y],[m+1,z,s,A,O,E,y]),C<f&&(f=C)}}if(b===ia.erba)for(let L=0;L<e;L++){if(ma(h,v,t+20+L)<.25)continue;let A=1,_=m,C=s,O=he(Za[ia.filo],.94+.12*ma(h,v,t+30+L));n.quadDa([_,d+1,C,2,15,g,O],[_,d+1+A,C,2,15,g,O,1],[_+1,d+1+A,C+1,2,15,g,O,1],[_+1,d+1,C+1,2,15,g,O]),n.quadDa([_+1,d+1,C,2,15,g,O],[_+1,d+1+A,C,2,15,g,O,1],[_,d+1+A,C+1,2,15,g,O,1],[_,d+1,C+1,2,15,g,O]),d+2>c&&(c=d+2)}}for(let m of ye(i,a,t)){let s=Math.floor(m.x)-r,h=Math.floor(m.z)-l,v=m.y-3;for(let d=v+1;d<=m.y;d++){let b=d===m.y?ia.lampada:ia.tronco,x=d===m.y?15:12,g=Za[b],M=d===m.y?Yo:0,R=s+.5-.15,L=s+.5+.15,S=Math.floor(R),A=Math.min(16,Math.floor(R)+1),_=h,C=h+1;n.quadDa([A,d,_,0,12,x,g,0,M],[A,d+1,_,0,12,x,g,0,M],[A,d+1,C,0,12,x,g,0,M],[A,d,C,0,12,x,g,0,M]),n.quadDa([S,d,C,1,12,x,g,0,M],[S,d+1,C,1,12,x,g,0,M],[S,d+1,_,1,12,x,g,0,M],[S,d,_,1,12,x,g,0,M]),n.quadDa([A,d,C,4,12,x,g,0,M],[A,d+1,C,4,12,x,g,0,M],[S,d+1,C,4,12,x,g,0,M],[S,d,C,4,12,x,g,0,M]),n.quadDa([S,d,_,5,12,x,g,0,M],[S,d+1,_,5,12,x,g,0,M],[A,d+1,_,5,12,x,g,0,M],[A,d,_,5,12,x,g,0,M]),d===m.y&&n.quadDa([S,d+1,_,2,15,x,g,0,M],[S,d+1,C,2,15,x,g,0,M],[A,d+1,C,2,15,x,g,0,M],[A,d+1,_,2,15,x,g,0,M]),d+1>c&&(c=d+1)}}return{...n.dati(),minY:f,maxY:c,cx:i,cz:a}}var Ue={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},De=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],ja={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};De.push(ja);var Ho={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};De.push(Ho);function we(i,a,t=ja){Ue[i]=a,t.blocchi.includes(i)||t.blocchi.push(i)}var $o={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"};function W(i){return Ue[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||$o}function Be(i){let a=i.indexOf("~");return a<0?i:i.slice(0,a)}function Ve(i){if(!i||!i.startsWith("acqua"))return null;let a=i.indexOf("~");return a<0?0:Number(i.slice(a+1))}var I=16,Zo=256,Ka=2048,Ge=64,J=(i,a,t)=>((i+Ka)*4096+(t+Ka))*256+(a+Ge),_a=i=>Math.floor(i/(256*4096))-Ka,Na=i=>Math.floor(i/256)%4096-Ka,ya=i=>i%256-Ge;var ba=(i,a)=>Math.floor(i/I)+","+Math.floor(a/I),Wa=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this.bagnate=new Map,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(a){this.generati.add(a)}_annotaModifica(a,t,e,o){if(!this.frontiera)return;let n=ba(a,e),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(J(a,t,e),o)}applicaModifiche(a){let t=this.modifiche.get(a);if(!t)return 0;for(let[e,o]of t){let n=_a(e),r=ya(e),l=Na(e);o===null?this.togli(n,r,l,!0):this.metti(n,r,l,o,!0)}return t.size}scaricaChunk(a){let t=this.chunks.get(a);if(!t)return this.generati.delete(a),[];let e=[];for(let[o,n]of t){let r=W(n);r&&r.forma==="modello"&&e.push([_a(o),ya(o),Na(o),n])}return this.contaBlocchi-=t.size,this.chunks.delete(a),this._scordaMemo(),this.generati.delete(a),this._tocca(a,this.sporchi),e}_cambiata(a,t,e){if(this.cambiate.length>=3*Zo){this.troppiCambi=!0;return}this.cambiate.push(a,t,e)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(a,t){let e=Math.floor(a/I),o=Math.floor(t/I);if(this._memoChunk!==null&&this._memoCx===e&&this._memoCz===o)return this._memoChunk;let n=this.chunks.get(e+","+o)||null;return this._memoCx=e,this._memoCz=o,this._memoChunk=n,n}tipo(a,t,e){let o=this._chunkDi(a,e);return o&&o.get(J(a,t,e))||null}pieno(a,t,e){return this.tipo(a,t,e)!==null}solido(a,t,e){let o=this.tipo(a,t,e);if(o&&W(o).solido)return!0;let n=this.furni.get(J(a,t,e));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(a,t,e){if(!this.solido(a,t-1,e)||this.solido(a,t,e)||this.solido(a,t+1,e))return!1;let o=this.tipo(a,t,e);return!(o&&W(o).acqua)}_sporca(a,t,e=this.sporchi){let o=(a%I+I)%I,n=(t%I+I)%I;this._tocca(ba(a,t),e),o===0&&this._tocca(ba(a-1,t),e),o===I-1&&this._tocca(ba(a+1,t),e),n===0&&this._tocca(ba(a,t-1),e),n===I-1&&this._tocca(ba(a,t+1),e)}_tocca(a,t){t.add(a),this._rev.set(a,(this._rev.get(a)||0)+1)}revisione(a){return this._rev.get(a)||0}metti(a,t,e,o,n=!1){let r=ba(a,e),l=this.chunks.get(r);l||(l=new Map,this.chunks.set(r,l),this._scordaMemo());let f=J(a,t,e),c=l.get(f);c===void 0&&this.contaBlocchi++,l.set(f,o);let u=o.charCodeAt(0)===97&&o.startsWith("acqua")&&(c===void 0||c.startsWith("acqua"));this._sporca(a,e,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(a,t,e),n||(this._annotaModifica(a,t,e,o),this.onEvento&&this.onEvento({tipo:"metti",cella:[a,t,e],blocco:o}))}togli(a,t,e,o=!1){let n=ba(a,e),r=this.chunks.get(n);if(!r)return!1;let l=J(a,t,e),f=r.get(l);if(!r.delete(l))return!1;this.bagnate.delete(l),this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let c=!!(f&&f.startsWith("acqua"));return this._sporca(a,e,c?this.sporchiAcqua:this.sporchi),c||this._cambiata(a,t,e),o||(this._annotaModifica(a,t,e,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[a,t,e]})),!0}bagna(a,t,e,o=0){this.bagnate.set(J(a,t,e),Math.max(0,Math.min(15,o|0))),this._sporca(a,e,this.sporchiAcqua)}asciuga(a,t,e){return this.bagnate.delete(J(a,t,e))?(this._sporca(a,e,this.sporchiAcqua),!0):!1}bagnata(a,t,e){let o=this.bagnate.get(J(a,t,e));return o===void 0?null:o}occupaFurni(a,t){for(let[e,o,n]of a)this.furni.set(J(e,o,n),t)}liberaFurni(a){for(let[t,e,o]of a)this.furni.delete(J(t,e,o))}furniIn(a,t,e){return this.furni.get(J(a,t,e))||null}occupaOmbra(a,t=!1){for(let[e,o,n]of a){let r=J(e,o,n),l=this.ombreFurni.get(r);if(l){l.n++,t&&l.op++===0&&this._cambiata(e,o,n);continue}this.ombreFurni.set(r,{x:e,y:o,z:n,n:1,op:t?1:0}),this._cambiata(e,o,n)}}liberaOmbra(a,t=!1){for(let[e,o,n]of a){let r=J(e,o,n),l=this.ombreFurni.get(r);l&&(t&&l.op>0&&--l.op===0&&l.n>1&&this._cambiata(e,o,n),!(--l.n>0)&&(this.ombreFurni.delete(r),this._cambiata(e,o,n)))}}ombraFurniIn(a,t,e){let o=this.ombreFurni.get(J(a,t,e));return o?o.op>0?2:1:0}appoggioInColonna(a,t,e,o=8){for(let n=e;n>e-o;n--)if(this.calpestabile(a,n,t))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let a of this._rev.keys())this._rev.set(a,this._rev.get(a)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let a of this.chunks.values())for(let[t,e]of a)yield{x:_a(t),y:ya(t),z:Na(t),tipo:e}}perOgni(a){for(let t of this.chunks.values())for(let[e,o]of t)a(_a(e),ya(e),Na(e),o)}*blocchiDelChunk(a){let t=this.chunks.get(a);if(t)for(let[e,o]of t)yield{x:_a(e),y:ya(e),z:Na(e),tipo:o}}perOgniDelChunk(a,t){let e=this.chunks.get(a);if(e)for(let[o,n]of e)t(_a(o),ya(o),Na(o),n)}};var jo={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},Da="primavera";var Qa=null;function Ja(i,a,t){let e=i>>16&255,o=i>>8&255,n=i&255,r=a>>16&255,l=a>>8&255,f=a&255,c=(u,p)=>Math.round(u+(p-u)*t);return c(e,r)<<16|c(o,l)<<8|c(n,f)}function ke(i,a){if(Qa){let t=Da;Da=Qa.da;let e=be(i,a);Da=Qa.a;let o=be(i,a);Da=t;let n=Qa.mix;return{cima:ae(e.cima,o.cima,n),lato:ae(e.lato,o.lato,n),fondo:ae(e.fondo,o.fondo,n),facce:e.facce,orlo:e.orlo!=null&&o.orlo!=null?ae(e.orlo,o.orlo,n):e.orlo}}return be(i,a)}function ae(i,a,t){let e=Math.round((i>>16&255)+((a>>16&255)-(i>>16&255))*t),o=Math.round((i>>8&255)+((a>>8&255)-(i>>8&255))*t),n=Math.round((i&255)+((a&255)-(i&255))*t);return e<<16|o<<8|n}function be(i,a){let t=W(i),e=jo[Da],{cima:o,lato:n,fondo:r}=t;if(t.cappello&&e.erba&&!t.override&&(o=e.erba[xe(a,e.erba.length)]),t.reagisce==="stagione"&&e.erba){let l=e.erba[xe(a,e.erba.length)],f=t.reagisceForza??1;o=Ja(o,l,f),n=Ja(n,l,f*.45),r=Ja(r,l,f*.3)}else if(t.reagisce==="quota"){let l=xe(a,8)/7,f=(t.reagisceForza??1)*.5,c=u=>Ja(u,16777215,l*f);o=c(o),n=c(n),r=c(r)}return i==="sabbia"&&e.sabbia&&({cima:o,lato:n,fondo:r}=e.sabbia),{cima:o,lato:n,fondo:r,facce:t.facce||null,orlo:t.orlo!=null?t.orlo:void 0}}function ha(i,a,t){if(i.facce){let e=a*2+(t>0?0:1),o=i.facce[e];if(o!=null)return o}return a===1?t>0?i.cima:i.fondo:i.lato}function xe(i,a=8){let t=(a-1)*2,e=(Math.round(i)%t+t)%t;return e>=a&&(e=t-e),e}function Ee(i,a,t){let e=(i|0)*374761393+(a|0)*668265263+(t|0)*2147483647;return e=(e^e>>>13)*1274126177,e=e^e>>>16,(e>>>0)%1e3/1e3}function Ko(i,a){let t=i>>16&255,e=i>>8&255,o=i&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+a))));return n(t)<<16|n(e)<<8|n(o)}function Wo(i,a,t,e,o,n){if(!a||a==="liscio"||!t)return i;let r=0;return a==="chiazze"?r=(Ee(e,o,n)-.5)*2:a==="venature"?r=(Ee(0,o,0)-.5)*2*.7+(Ee(e,o,n)-.5)*.3:a==="sfumato"&&(r=(o%16+16)%16/16-.5),Ko(i,r*t*.34)}function Xe(i,a,t,e,o,n){if(!a||a==="liscio"||!t)return i;let r=l=>Wo(l,a,t,e,o,n);return{cima:r(i.cima),lato:r(i.lato),fondo:r(i.fondo),facce:i.facce?i.facce.map(r):null}}var Ye={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},Qo=Object.keys(Ye);function He(i){return!i||!i.materia?null:Ye[i.materia]||null}function xa(i,a,t=0){if(!a)return i;let e=(i>>16&255)/255,o=(i>>8&255)/255,n=(i&255)/255,r=.2126*e+.7152*o+.0722*n,l=a.satura;e=r+(e-r)*l,o=r+(o-r)*l,n=r+(n-r)*l;let f=a.tinta*(1+t),c=u=>Math.max(0,Math.min(255,Math.round(u*f*255)));return c(e)<<16|c(o)<<8|c(n)}var Jo=16;function $e(i){let a=Qo.indexOf(i);return a<0||a+1>=Jo?0:a+1}var Ae=1/16,Ze=8*Ae,na=9*Ae;function je(i,a,t,e,o,n,r,l){let f=(u,p,m)=>[a+u,t+p,e+m];i.quad(f(-l,r,-l),f(l,r,-l),f(l,r,l),f(-l,r,l),ha(o,1,1),[0,1,0]),i.quad(f(-l,n,-l),f(l,n,-l),f(l,n,l),f(-l,n,l),ha(o,1,-1),[0,-1,0]);let c=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of c){let[p,,m]=u.d,s=-m,h=p,v=(d,b)=>f(p*l+s*b,d,m*l+h*b);i.quad(v(n,-l),v(r,-l),v(r,l),v(n,l),ha(o,u.asse,u.segno),u.d)}}function at(i,a,t,e,o){je(i,a,t,e,o,-na,0,Ze)}function et(i,a,t,e,o){je(i,a,t,e,o,-na,na,5*Ae)}function ot(i,a,t,e,o){let n=(c,u,p)=>[a+c,t+u,e+p],r=ha(o,0,1),l=Ze,f=[[[-l,-na,-l],[l,-na,l],[l,na,l],[-l,na,-l],[1,0,-1]],[[-l,-na,l],[l,-na,-l],[l,na,-l],[-l,na,l],[1,0,1]]];for(let[c,u,p,m,s]of f)i.quad(n(...c),n(...u),n(...p),n(...m),r,s),i.quad(n(...c),n(...u),n(...p),n(...m),r,[-s[0],-s[1],-s[2]])}function tt(){}var Ke={lastra:at,pilastro:et,croce:ot,modello:tt},wa=new Set(["lastra","pilastro","croce","modello"]);var Ba=1/16,it=[[0,1],[0,2],[1,2]],nt=[[1,0],[-1,0],[0,1],[0,-1]];function Ea(i,a,t,e,o,n,r,l,f){let c=[i,a,t];return c[e]+=o,c[n]+=r,c[l]+=f,c}var We={tinta:1,satura:1};function Qe(i,a,t,e,o,n,r=0){let l=8*Ba,f=9*Ba,c=(u,p)=>n(u===0?p:0,u===1?p:0,u===2?p:0);for(let u=0;u<3;u++)for(let p of[-1,1]){if(c(u,p))continue;let m=(u+1)%3,s=(u+2)%3,h=ha(o,u,p),v=[0,0,0];v[u]=p,i.quad(Ea(a,t,e,u,p*f,m,-l,s,-l),Ea(a,t,e,u,p*f,m,+l,s,-l),Ea(a,t,e,u,p*f,m,+l,s,+l),Ea(a,t,e,u,p*f,m,-l,s,+l),h,v)}for(let[u,p]of it){let m=3-u-p;for(let s of[-1,1])for(let h of[-1,1]){if(c(u,s)||c(p,h))continue;let v=u===1&&s>0||p===1&&h>0,d=u===1&&s<0||p===1&&h<0,b=v?o.cima:d?o.fondo:o.lato,x=r?xa(b,We,r):b,g=[0,0,0];g[u]=s,g[p]=h,i.quad(Ea(a,t,e,u,s*f,p,h*l,m,-l),Ea(a,t,e,u,s*l,p,h*f,m,-l),Ea(a,t,e,u,s*l,p,h*f,m,+l),Ea(a,t,e,u,s*f,p,h*l,m,+l),x,g)}}for(let u of[-1,1])for(let p of[-1,1])for(let m of[-1,1])c(0,u)||c(1,p)||c(2,m)||i.tri([a+u*f,t+p*l,e+m*l],[a+u*l,t+p*f,e+m*l],[a+u*l,t+p*l,e+m*f],r?xa(p>0?o.cima:o.fondo,We,r):p>0?o.cima:o.fondo,[u,p,m])}function Je(i,a,t,e,o,n){let r=(s,h)=>n(s,0,h),l=n(0,-1,0),f=o.cima,c=o.lato,u=o.fondo,p=o.orlo??o.cima,m=(s,h,v)=>[a+s*Ba,t+h*Ba,e+v*Ba];l||i.quad(m(-8,-9,-8),m(8,-9,-8),m(8,-9,8),m(-8,-9,8),u,[0,-1,0]);for(let[s,h]of nt){if(r(s,h))continue;let v=-h,d=s,b=(g,M,R)=>m(g*s+R*v,M,g*h+R*d),x=[s,0,h];l||i.quad(b(8,-9,-8),b(9,-8,-8),b(9,-8,8),b(8,-9,8),u,[s,-1,h]),i.quad(b(9,-8,-8),b(9,2,-8),b(9,2,8),b(9,-8,8),c,x),i.quad(b(9,2,-8),b(10,3,-8),b(10,3,8),b(9,2,8),p,x),i.quad(b(10,3,-8),b(10,7,-8),b(10,7,8),b(10,3,8),p,x),i.quad(b(10,7,-8),b(9,8,-8),b(9,8,8),b(10,7,8),f,[s,1,h]),i.quad(b(8,8,-8),b(9,8,-8),b(9,8,8),b(8,8,8),f,[0,1,0])}for(let s of[-1,1])for(let h of[-1,1]){if(r(s,0)||r(0,h))continue;let v=(b,x,g)=>m(b*s,x,g*h),d=[s,0,h];l||i.tri(v(9,-8,8),v(8,-9,8),v(8,-8,9),u,[s,-1,h]),i.quad(v(9,-8,8),v(8,-8,9),v(8,2,9),v(9,2,8),c,d),i.quad(v(9,2,8),v(8,2,9),v(8,3,10),v(10,3,8),p,d),i.quad(v(10,3,8),v(8,3,10),v(8,7,10),v(10,7,8),p,d),i.quad(v(10,7,8),v(8,7,10),v(8,8,9),v(9,8,8),f,[s,1,h]),i.tri(v(8,8,8),v(9,8,8),v(8,8,9),f,[0,1,0])}i.quad(m(-8,8,-8),m(8,8,-8),m(8,8,8),m(-8,8,8),f,[0,1,0])}var rt=2,Te=6,lt=256;function ao(i){if(!i)return!1;let a=W(i);return!a.acqua&&!a.vetro&&!wa.has(a.forma)}function oo(i,a,t,e){let o=a.indexOf(","),n=+a.slice(0,o),r=+a.slice(o+1),l=n*I-Te,f=r*I-Te,c=I+2*Te,u=e-t+1,p=c,m=c*u*p,s=new Uint8Array(m),h=new Uint8Array(m),v=new Uint8Array(m),d=(R,L,S)=>((R-l)*u+(L-t))*p+(S-f),b=(R,L,S)=>R>=l&&R<l+c&&L>=t&&L<=e&&S>=f&&S<f+p,x=[];for(let R=l;R<l+c;R++)for(let L=f;L<f+p;L++){let S=!1;for(let A=e;A>=t;A--){let _=i.tipo(R,A,L),C=d(R,A,L);if(ao(_)){v[C]=1,S=!0;continue}if(!S&&A===e){for(let O=e+1;O<lt&&O<e+40;O++)if(ao(i.tipo(R,O,L))){S=!0;break}}if(S||(s[C]=15),_){let O=W(_);O.luce&&x.push([R,A+Math.round(O.luce.quota??0),L])}}}let g=[];for(let R=0;R<m;R++)s[R]===15&&g.push(R);eo(g,s,v,c,u,p,1);let M=[];for(let[R,L,S]of x){if(!b(R,L,S))continue;let A=d(R,L,S);h[A]=15,M.push(A)}return eo(M,h,v,c,u,p,rt),{x0:l,z0:f,yMin:t,yMax:e,W:c,H:u,D:p,cielo:s,blocco:h,leggi(R,L,S){if(!b(R,L,S))return L>e?[15,0]:[0,0];let A=d(R,L,S);return[s[A],h[A]]}}}function eo(i,a,t,e,o,n,r){let l=[o*n,-o*n,n,-n,1,-1],f=0;for(;f<i.length;){let c=i[f++],u=a[c]-r;if(u<=0)continue;let p=Math.floor(c/(o*n)),m=Math.floor(c/n)%o,s=c%n;for(let h=0;h<6;h++){if(h===0&&p===e-1||h===1&&p===0||h===2&&m===o-1||h===3&&m===0||h===4&&s===n-1||h===5&&s===0)continue;let v=c+l[h];t[v]||a[v]>=u||(a[v]=u,i.push(v))}}}var to=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function pa(i,a,t){let e=i*374761393+a*668265263+t*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}var ee=class{constructor(a,t=512){this.yBase=a,this.byte=new Uint8Array(t*12),this.n=0}_lamella(a,t,e,o,n,r,l,f,c,u=0,p=8){if((this.n+1)*12>this.byte.length){let h=new Uint8Array(this.byte.length*2);h.set(this.byte),this.byte=h}let m=this.n*12,s=this.byte;s[m]=a,s[m+1]=t,s[m+2]=e,s[m+3]=o,s[m+4]=n>>16&255,s[m+5]=n>>8&255,s[m+6]=n&255,s[m+7]=(r&15)<<2,s[m+8]=Math.max(1,Math.min(255,l)),s[m+9]=Math.max(1,Math.min(255,f)),s[m+10]=Math.max(0,Math.min(255,c+128)),s[m+11]=u&15|(p&15)<<4,this.n++}ciuffo(a,t,e,o,n,r,l,f=1,c=0){let u=to[Math.floor(pa(a,e,3)*to.length)],p=Math.max(1,Math.round(u.n*f*(.82+.36*pa(a,e,5)))),m=t+1-this.yBase;if(m<0||m*8>247)return 0;for(let s=0;s<p;s++){let h=pa(a,e,s*17+5),v=pa(a,e,s*17+11),d=pa(a,e,s*17+41),b=pa(a,e,s*17+59),x=Math.min(.98,.66+u.apri),g=a+.5+(h-.5)*x,M=e+.5+(v-.5)*x,R=Math.min(.8,u.alto*(.62+.8*pa(a,e,s*17+71))*(.5+.6*Math.pow(d,1.5))),L=u.largo*(.8+.4*b),S=(pa(a,e,s*17+83)-.5)*.5,A=pa(a,e,s*17+89),_=A<.15?.9+.03*A:A>.85?1.07+.03*(A-.85):.97+.06*(A-.15)/.7,C=Math.max(0,Math.min(128,Math.round((g-o)*8))),O=Math.max(0,Math.min(128,Math.round((M-n)*8))),N=Math.floor(pa(a,e,s*17+97)*255);this._lamella(C,O,Math.round(m*8),N,r,l,Math.round(R*64),Math.round(L*128),Math.round(S*128),c,Math.round((_-.9)/.2*15))}return p}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var Aa=64,st=[[1,0,0,K(1,0,0),0,1],[-1,0,0,K(-1,0,0),0,-1],[0,1,0,K(0,1,0),1,1],[0,-1,0,K(0,-1,0),1,-1],[0,0,1,K(0,0,1),2,1],[0,0,-1,K(0,0,-1),2,-1]],io=(i,a,t)=>((a+1)*3+(t+1))*3+(i+1),ze=class{constructor(a,t,e,o,n){this.c=a,this.ox=t,this.oz=e,this._materia=0,this.luceDi=o,this.aria=n,this._cielo=15,this._cella=null}materia(a){this._materia=a|0}cella(a,t,e){this._cella=[a,t,e]}_cieloFaccia(a){let[t,e,o]=this._cella,n=-1;for(let r=0;r<3;r++){if(!a[r])continue;let l=this.luceDi(t+(r===0?a[0]:0),e+(r===1?a[1]:0),o+(r===2?a[2]:0))[0];l>n&&(n=l)}return n<0?this.luceDi(t,e+1,o)[0]:n}_bloccoVertice(a,t){let e=Math.hypot(t[0],t[1],t[2])||1,o=a[0]+t[0]/e*.5,n=a[1]+t[1]/e*.5,r=a[2]+t[2]/e*.5,l=0,f=0;for(let c of[-.45,.45])for(let u of[-.45,.45])for(let p of[-.45,.45]){let m=Math.floor(o+c),s=Math.floor(n+u),h=Math.floor(r+p);this.aria(m,s,h)&&(l+=this.luceDi(m,s,h)[1],f++)}return f?Math.round(l/f):0}_v(a,t,e,o){return[a[0]-this.ox,a[1]+Aa,a[2]-this.oz,t,this._cielo,this._bloccoVertice(a,o),e,0,this._materia]}_giro(a,t,e,o){let n=t[0]-a[0],r=t[1]-a[1],l=t[2]-a[2],f=e[0]-a[0],c=e[1]-a[1],u=e[2]-a[2],p=r*u-l*c,m=l*f-n*u,s=n*c-r*f;return p*o[0]+m*o[1]+s*o[2]<0}tri(a,t,e,o,n){if(this._giro(a,t,e,n)){let l=t;t=e,e=l}let r=K(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(a,r,o,n),this._v(t,r,o,n),this._v(e,r,o,n),this._v(e,r,o,n))}quad(a,t,e,o,n,r){let l=K(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(a,t,e,r)){let f=t;t=o,o=f}this.c.quadDa(this._v(a,l,n,r),this._v(t,l,n,r),this._v(e,l,n,r),this._v(o,l,n,r))}};function oe(i){if(!i)return!1;let a=W(i);return!a.acqua&&!a.vetro&&!wa.has(a.forma)}function no(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function ro(i,a,{erba:t=2,luce:e=!0}={}){let o=a.indexOf(","),n=+a.slice(0,o),r=+a.slice(o+1),l=n*I,f=r*I,c=new Ma(1024),u=new Ma(64),p=-1/0,m=new Int16Array(I*I).fill(-1),s=new Int16Array(I*I).fill(-1),h=new Int16Array(I*I).fill(-1),v=[],d=255,b=0,x=1/0,g=-1/0;i.perOgniDelChunk(a,(N,E)=>{E<x&&(x=E),E>g&&(g=E)});let M=e&&x<=g?oo(i,a,x-2,g+3):null,R=new ee(Number.isFinite(x)?x:0),L=(N,E,z)=>M?M.leggi(N,E,z):[15,0],S=new ze(c,l,f,L,(N,E,z)=>!oe(i.tipo(N,E,z))),A=new Uint8Array(27),_=(N,E,z,Y,y,Ta,za,ta)=>[N-l,E+Aa,z-f,Y,Ta,za,y,ta?1:0,0],C=(N,E,z)=>no(i.tipo(N,E,z))||(i.bagnate?i.bagnata(N,E,z)!==null:!1);return i.perOgniDelChunk(a,(N,E,z,Y)=>{let y=W(Y),Ta=i.bagnate?i.bagnata(N,E,z):null;if(y.forma==="modello"&&y.modello==="albero")for(let F=-2;F<=2;F++)for(let D=-2;D<=2;D++){let B=F*F+D*D;if(B>4)continue;let k=N+F-l,la=z+D-f;if(k<0||k>=I||la<0||la>=I)continue;let Z=k*I+la,G=E+(B===0?4:B<=2?3:2);G>m[Z]&&(m[Z]=G)}if(y.forma==="modello"){let F=N-l,D=z-f;if(F>=0&&F<I&&D>=0&&D<I){let B=F*I+D,k=E+Math.max(1,Math.round(y.altezza||1));k>h[B]&&(h[B]=k)}}if(y.luce&&v.push([N,E,z,Y]),wa.has(y.forma)&&Ta===null)return;let za=no(Y)||Ta!==null,ta=E+Aa;if(ta<0||ta>254)return;let Va=(N-l)*I+(z-f);!za&&E>m[Va]&&(m[Va]=E),!za&&oe(Y)&&E>s[Va]&&(s[Va]=E);let $=ke(Ta!==null?"acqua":Be(Y),E);y.motivo&&($=Xe($,y.motivo,y.motivoForza??1,N,E,z));let ga=He(y);ga&&($={...$,cima:xa($.cima,ga),lato:xa($.lato,ga),fondo:xa($.fondo,ga)},$.facce&&($.facce=$.facce.map(F=>F==null?F:xa(F,ga))));let Co=ga?$e(y.materia):0;if(!za){A.fill(0);for(let Z=-1;Z<=1;Z++)for(let G=-1;G<=1;G++)for(let j=-1;j<=1;j++)j===0&&Z===0&&G===0||oe(i.tipo(N+j,E+Z,z+G))&&(A[io(j,Z,G)]=1);let F=(Z,G,j)=>A[io(Z,G,j)]===1;S.materia(Co),S.cella(N,E,z);let D=N+.5,B=E+.5,k=z+.5,la=y.forma&&Ke[y.forma];la?la(S,D,B,k,$,()=>!1):y.cappello&&!F(0,1,0)?Je(S,D,B,k,$,F):Qe(S,D,B,k,$,(G,j,P)=>F(G,j,P)?j!==0?!0:!W(i.tipo(N+G,E,z+P)).cappello||F(G,1,P):!1,ga?ga.orlo:0),ta-1<d&&(d=ta-1),ta+2>b&&(b=ta+2)}let Ga=0,Oa=0;if(za)for(Oa=Math.max(0,Math.min(15,Ta!==null?Ta:Ve(Y)||0));Ga<15&&C(N,E-1-Ga,z);)Ga++;let Oo=(F,D)=>{if(!C(F,E,D))return-1;let B=0;for(;B<15&&C(F,E-1-B,D);)B++;return B},ka=(F,D)=>{let B=0,k=0;for(let la of[F-1,F])for(let Z of[D-1,D]){let G=Oo(la,Z);G>=0&&(B+=G,k++)}return k?Math.round(B/k):Ga};if(za)for(let[F,D,B,k,la,Z]of st){let G=i.tipo(N+F,E+D,z+B);if(C(N+F,E+D,z+B)||G&&oe(G))continue;let j=ha($,la,Z),P=N,U=E,w=z,sa,ca,ua,fa;if(F===1?(sa=[P+1,U,w],ca=[P+1,U+1,w],ua=[P+1,U+1,w+1],fa=[P+1,U,w+1]):F===-1?(sa=[P,U,w+1],ca=[P,U+1,w+1],ua=[P,U+1,w],fa=[P,U,w]):D===1?(sa=[P,U+1,w],ca=[P,U+1,w+1],ua=[P+1,U+1,w+1],fa=[P+1,U+1,w]):D===-1?(sa=[P,U,w+1],ca=[P,U,w],ua=[P+1,U,w],fa=[P+1,U,w+1]):B===1?(sa=[P+1,U,w+1],ca=[P+1,U+1,w+1],ua=[P,U+1,w+1],fa=[P,U,w+1]):(sa=[P,U,w],ca=[P,U+1,w],ua=[P+1,U+1,w],fa=[P+1,U,w]),D===1){let Re=E+(15-2*Oa)/16;Re>p&&(p=Re)}u.quadDa(_(...sa,k,j,ka(sa[0],sa[2]),Oa,sa[1]===U+1),_(...ca,k,j,ka(ca[0],ca[2]),Oa,ca[1]===U+1),_(...ua,k,j,ka(ua[0],ua[2]),Oa,ua[1]===U+1),_(...fa,k,j,ka(fa[0],fa[2]),Oa,fa[1]===U+1)),ta<d&&(d=ta),ta+1>b&&(b=ta+1)}if(y.cappello&&t>0&&!i.tipo(N,E+1,z)){let[F,D]=L(N,E+1,z);R.ciuffo(N,E,z,l,f,$.cima,F,t/2,D),E+2+Aa>b&&(b=E+2+Aa)}}),d>b&&(d=0,b=0),{...c.dati(),minY:d,maxY:b,y0:-Aa,cx:n,cz:r,altezze:m,solide:s,impronte:h,luci:v,acqua:{...u.dati(),pelo:p===-1/0?null:p},erba:R.dati()}}function lo(i,a,t,e,o){let n=(e-a+1)*I,r=(o-t+1)*I,l=new Uint8Array(n*r);for(let f of i){if(!f.altezze)continue;let c=(f.cx-a)*I,u=(f.cz-t)*I;for(let p=0;p<I;p++)for(let m=0;m<I;m++){let s=f.altezze[p*I+m];l[(u+m)*n+(c+p)]=s<0?0:Math.max(0,Math.min(255,s+1))}}return{byte:l,x0:a*I,z0:t*I,larghezza:n,profondita:r}}function Ra(i,a,t){let e=i*374761393+a*668265263+t*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function so(i){return i*i*(3-2*i)}function Me(i,a,t){let e=Math.floor(i),o=Math.floor(a),n=so(i-e),r=so(a-o),l=Ra(e,o,t),f=Ra(e+1,o,t),c=Ra(e,o+1,t),u=Ra(e+1,o+1,t);return l+(f-l)*n+(c-l)*r+(l-f-c+u)*n*r}var qa=5;function co(i,a=1,t=64){i.svuota();let e=[],o=[],n=new Map,r=[];for(let u=-t;u<=t;u++)for(let p=-t;p<=t;p++){let m=.55*Me(u*.028,p*.028,a)+.3*Me(u*.07,p*.07,a+11)+.15*Me(u*.16,p*.16,a+29),s=Math.max(2,1+Math.round(Math.pow(Math.max(0,m),1.6)*22)),h=Math.max(Math.abs(u),Math.abs(p)),v=Math.min(1,Math.max(0,(t-2-h)/8)),d=v*v*(3-2*v);s=Math.round(s*d+(qa+1)*(1-d));let b=s<=qa+1;n.set(u+"|"+p,s);for(let x=0;x<s;x++){let M=x===s-1?b?"sabbia":"erba":x<s-3?"roccia":"terra";i.metti(u,x,p,M,!0)}if(s<=qa)for(let x=s;x<=qa;x++)i.metti(u,x,p,"acqua",!0);else if(!b){let x=Ra(u*3+1,p*3+7,a+101);if(x>.988&&e.length<90?e.push([u,s,p]):x<.004&&o.length<14&&o.push([u,s,p]),s>=qa+6){let g=Ra(u*5+3,p*5+11,a+57);g>.99&&r.push({x:u,z:p,h:s,r:g})}}}let l=ut(i,n,a,r,t),f=u=>!l.has(u[0]+"|"+u[2]),c=[...l].map(u=>{let[p,m]=u.split("|").map(Number);return[p,n.get(u)-2,m]});return{alberi:e.filter(f),lampioni:o.filter(f),fiume:c}}var ct=[[1,0],[-1,0],[0,1],[0,-1]];function ut(i,a,t,e,o=64){let n=new Set;e.sort((f,c)=>c.h-f.h||f.r-c.r);let r=[];for(let f of e){if(r.length>=5)break;r.every(c=>(c.x-f.x)**2+(c.z-f.z)**2>=784)&&r.push(f)}let l=(f,c)=>{let u=f+"|"+c;if(n.has(u))return;let p=a.get(u);i.togli(f,p-1,c,!0),i.togli(f,p-2,c,!0),i.metti(f,p-2,c,"acqua",!0),n.add(u)};for(let f of r){let c=f.x,u=f.z,p=null,m=0,s=new Set([c+"|"+u]);for(let h=0;h<500;h++){let v=a.get(c+"|"+u);if(l(c,u),p){let g=c+p[1],M=u-p[0];a.get(g+"|"+M)===v&&l(g,M)}let d=null,b=1/0,x=1/0;for(let g of ct){let M=c+g[0],R=u+g[1];if(s.has(M+"|"+R))continue;let L=a.get(M+"|"+R);if(L===void 0)continue;let S=(g===p?-.5:0)+Ra(M*7+5,R*7+13,t+71);(L<b||L===b&&S<x)&&(d=g,b=L,x=S)}if(!d||b>v||(m=b===v?m+1:0,m>24)||(c+=d[0],u+=d[1],s.add(c+"|"+u),p=d,a.get(c+"|"+u)<=qa)||Math.max(Math.abs(c),Math.abs(u))>=o-6)break}}for(let f of n){let[c,u]=f.split("|").map(Number),p=a.get(f);for(let m=-1;m<=1;m++)for(let s=-1;s<=1;s++){if(!m&&!s)continue;let h=c+m+"|"+(u+s);if(n.has(h))continue;let v=a.get(h);v===void 0||v<p||v>p+1||i.tipo(c+m,v-1,u+s)==="erba"&&(i.togli(c+m,v-1,u+s,!0),i.metti(c+m,v-1,u+s,"sabbia",!0))}}return n}var ft={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,pozza:16762994,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function uo(){for(let[i,a]of Object.entries(ft))we(i,{nome:a.nome,cima:a.cima,lato:a.lato,fondo:a.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:a.modello,altezza:a.altezza,mezza:a.mezza,luce:a.luce},ja)}function fo(i){let a=new DataView(i);if(String.fromCharCode(a.getUint8(0),a.getUint8(1),a.getUint8(2),a.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let t=a.getUint32(4,!0),e=t*3,o=new Uint8Array(i,8,e*16),n=new Uint8Array(i,8+e*16,e*4),r=new Uint8Array(e*20);for(let p=0;p<e;p++)r.set(o.subarray(p*16,p*16+16),p*20),r.set(n.subarray(p*4,p*4+4),p*20+16);let l=1/0,f=-1/0,c=0,u=new DataView(r.buffer);for(let p=0;p<e;p++){let m=u.getFloat32(p*20,!0),s=u.getFloat32(p*20+4,!0),h=u.getFloat32(p*20+8,!0);l=Math.min(l,s),f=Math.max(f,s),c=Math.max(c,Math.hypot(m,h))}return{byte:r,vertici:e,triangoli:t,minY:l,maxY:f,raggio:c}}var mt=`#version 300 es
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
void main() {}`,te=class{constructor(a){this.gl=a,this.programma=ea(a,mt,pt),this.u={};for(let t of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[t]=a.getUniformLocation(this.programma,t);this.programmaOmbra=ea(a,ht,vt),this.uoVP=a.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(a,t){let e=this.gl,o={vao:e.createVertexArray(),vbo:e.createBuffer(),ibo:e.createBuffer(),vertici:t.vertici,triangoli:t.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:t.raggio,maxY:t.maxY};return e.bindVertexArray(o.vao),e.bindBuffer(e.ARRAY_BUFFER,o.vbo),e.bufferData(e.ARRAY_BUFFER,t.byte,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,20,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.BYTE,!0,20,12),e.enableVertexAttribArray(4),e.vertexAttribIPointer(4,1,e.UNSIGNED_BYTE,20,15),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.UNSIGNED_BYTE,!0,20,16),e.bindBuffer(e.ARRAY_BUFFER,o.ibo),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(3,1),e.enableVertexAttribArray(5),e.vertexAttribPointer(5,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(5,1),e.bindVertexArray(null),this.tipi.set(a,o),o}istanze(a,t,e=4){let o=this.tipi.get(a);o&&(o.istanze=dt(t,e),o.n=o.istanze.length/8,o.sporco=!0,this.dinamici.has(a)||(this.mappaSporca=!0))}disegnaOmbra(a,t){let e=this.gl;e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uoVP,!1,a);let o=0,n=0;for(let[r,l]of this.tipi)l.n===0||this.dinamici.has(r)!==t||(e.bindVertexArray(l.vao),l.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,l.ibo),e.bufferData(e.ARRAY_BUFFER,l.istanze,e.DYNAMIC_DRAW),l.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,l.vertici,l.n),o++,n+=l.triangoli*l.n);return e.bindVertexArray(null),[o,n]}disegna(a,t){let e=this.gl,o=this.u,n=a.sole;e.useProgram(this.programma),e.uniformMatrix4fv(o.uVP,!1,a.vpCorrente||a.vp),e.uniform1f(o.uTaglio,a.taglio??-1e9);let r=a.vpCorrente===a.vpSpecchio?[0,0,0,0]:a.buco||[0,0,0,0];e.uniform3f(o.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),e.uniform1f(o.uTempo,a.tempo),e.uniform3f(o.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform3f(o.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),e.uniform1f(o.uSoleForza,n.forza),e.uniform3f(o.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),e.uniform4fv(o.uMaterie,a.materie),e.uniform2f(o.uNebbia,a.nebbia.da,a.nebbia.a),e.uniform3f(o.uNebbiaCol,a.nebbia.colore[0],a.nebbia.colore[1],a.nebbia.colore[2]),e.uniform3f(o.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),e.uniform1f(o.uOmbra,a.ombra&&a.altezze?1:0),a.altezze&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,a.ombre.tex),e.uniform1i(o.uOmbre,0),e.uniform2f(o.uOmbreScala,a.ombre.scala,a.ombre.offset),e.uniform4f(o.uAltRett,a.altRett[0],a.altRett[1],a.altRett[2],a.altRett[3])),a.legaMappa(o);let l=0,f=0,c=0;e.uniform1f(o.uSagoma,0);for(let[p,m]of this.tipi)m.n!==0&&(e.uniform4f(o.uBuco,r[0],r[1],r[2],p==="omino"?0:r[3]),e.bindVertexArray(m.vao),m.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,m.ibo),e.bufferData(e.ARRAY_BUFFER,m.istanze,e.DYNAMIC_DRAW),m.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,m.vertici,m.n),l++,f+=m.triangoli*m.n,c+=m.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&a.vpCorrente!==a.vpSpecchio&&(e.uniform1f(o.uSagoma,1),e.depthFunc(e.GREATER),e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.bindVertexArray(u.vao),e.drawArraysInstanced(e.TRIANGLES,0,u.vertici,u.n),e.disable(e.BLEND),e.depthMask(!0),e.depthFunc(e.LESS),e.uniform1f(o.uSagoma,0),l++),e.bindVertexArray(null),this.statistiche.disegni=l,this.statistiche.triangoli=f,this.statistiche.istanze=c}};function mo(i={}){let a=(t,e=1)=>typeof t=="number"&&isFinite(t)?+t.toFixed(e):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:a(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?a(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:a(i.fps,0),p50ms:a(i.p50,2),p99ms:a(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:a(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(t=>Math.round(t)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[]},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:a(i.worldgenMs,0),meshMs:a(i.meshMs,0)},errori:(i.errori||[]).slice(-12).map(t=>String(t).slice(0,500)),scatto:i.scatto||null}}function po(i){return Math.round(JSON.stringify(i).length/1024)}var gt=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),da=(i,a)=>i>>>a|i<<32-a;function ho(i){let a=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),t=i.length*8,e=new Uint8Array(i.length+9+63>>6<<6);e.set(i),e[i.length]=128,new DataView(e.buffer).setUint32(e.length-4,t>>>0),new DataView(e.buffer).setUint32(e.length-8,Math.floor(t/4294967296));let o=new Uint32Array(64),n=new DataView(e.buffer);for(let l=0;l<e.length;l+=64){for(let d=0;d<16;d++)o[d]=n.getUint32(l+d*4);for(let d=16;d<64;d++){let b=da(o[d-15],7)^da(o[d-15],18)^o[d-15]>>>3,x=da(o[d-2],17)^da(o[d-2],19)^o[d-2]>>>10;o[d]=o[d-16]+b+o[d-7]+x>>>0}let[f,c,u,p,m,s,h,v]=a;for(let d=0;d<64;d++){let b=da(m,6)^da(m,11)^da(m,25),x=m&s^~m&h,g=v+b+x+gt[d]+o[d]>>>0,M=da(f,2)^da(f,13)^da(f,22),R=f&c^f&u^c&u,L=M+R>>>0;v=h,h=s,s=m,m=p+g>>>0,p=u,u=c,c=f,f=g+L>>>0}a[0]=a[0]+f>>>0,a[1]=a[1]+c>>>0,a[2]=a[2]+u>>>0,a[3]=a[3]+p>>>0,a[4]=a[4]+m>>>0,a[5]=a[5]+s>>>0,a[6]=a[6]+h>>>0,a[7]=a[7]+v>>>0}let r="";for(let l of a)r+=l.toString(16).padStart(8,"0");return r}var bt="https://ntfy.sh",xt=4096;async function Et(i){let a=new TextEncoder().encode("leafy-shadows/"+i),t;if(globalThis.crypto&&crypto.subtle){let e=await crypto.subtle.digest("SHA-256",a);t=[...new Uint8Array(e)].map(o=>o.toString(16).padStart(2,"0")).join("")}else t=ho(a);return"leafy-"+t.slice(0,24)}async function vo(i,a){let t=await Et(i),e=await fetch(`${bt}/${t}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:a});if(!e.ok)return{ok:!1,dice:`il servizio ha detto no: ${e.status}`};let o=await e.json().catch(()=>({})),n=a.length>xt;return{ok:!0,id:o.id||"",dice:n?`mandato \u2714 (${Math.round(a.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(a.length/1024)} KB, dura 12 ore)`}}var go="leafy.diagnostica.chiave",At=`
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
`,ie=class{constructor(a,t){this.leggi=a,this.scatta=t,this.errori=[],addEventListener("error",o=>this._errore(o.error||o.message)),addEventListener("unhandledrejection",o=>this._errore(o.reason));let e=document.createElement("style");e.textContent=At,document.head.appendChild(e),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(a){let t=a&&a.stack?a.stack:String(a);this.errori.push(t),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(go)||""}catch{return""}}set chiave(a){try{localStorage.setItem(go,a)}catch{}}apri(){let a=this.pannello;a.classList.add("aperto"),a.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,a.querySelector("#diagChiudi").onclick=()=>a.classList.remove("aperto"),a.querySelector("#diagCopia").onclick=()=>this.vai(!0),a.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let t=a.querySelector("#diagNota");t&&t.focus()},30)}_dice(a){let t=this.pannello.querySelector("#diagEsito");t&&(t.textContent=a)}async vai(a){let t=this.pannello.querySelector("#diagChiave");t&&t.value.trim()&&(this.chiave=t.value.trim());let e=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let o=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,n=null;if(o)try{n=this.scatta?await this.scatta():null}catch(u){this._errore(u)}let r=mo({...this.leggi(),quando:new Date().toISOString(),nota:e,errori:this.errori,scatto:n}),l=po(r),f=JSON.stringify(r,null,1);if(a){await this._negliAppunti(f),this.nodo.classList.remove("corso");return}let c=!1;try{let u=await fetch("/_diagnostica",{method:"GET"});c=u.ok&&(await u.json().catch(()=>({}))).collettore===!0}catch{c=!1}if(c)try{let u=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:f});if(u.status===403)this._dice("password sbagliata."),this.chiave="";else if(u.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!u.ok)this._dice("il collettore ha detto no: "+u.status);else{let p=await u.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${p.nome||""}  (${l} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let u=await vo(this.chiave,f);this._dice(u.ok?u.dice+`
(fuori casa: passa dal cloud)`:u.dice),u.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(f,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(a,t=""){try{await navigator.clipboard.writeText(a),this._dice(t+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let e=new Blob([a],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(e),o.download="leafy-diagnostica.json",o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),4e3),this._dice(t+`scaricato come file \u2714
mandami quello.`)}}};var X=document.getElementById("tela"),Tt=document.getElementById("stato"),zt=document.getElementById("fps"),aa=new URLSearchParams(location.search),q={raggio:+(aa.get("raggio")||5),erba:+(aa.get("erba")??8),ombra:aa.get("ombra")!=="no",specchio:aa.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(aa.get("specchio")??.5)||.5)),dprMax:+(aa.get("dpr")||1.5),rampa:aa.has("rampa"),tutto:aa.has("tutto"),mondo:aa.has("finto")||aa.has("rampa")?0:Math.max(16,Math.min(400,+(aa.get("mondo")||48))),ora:aa.has("ora")?Math.max(0,Math.min(1,+aa.get("ora"))):null},{gl:Pa,dpr:Mt,ridimensiona:St}=Le(X,{antialias:!0,dprMax:q.dprMax}),T=new $a(Pa),oa=new te(Pa);T.ombra=q.ombra;T.specchio.attivo=q.specchio>0;T.specchio.scala=q.specchio||.5;T.specchio.mostra=aa.has("vedi");var ce=0,Ca=0;function Ao(i,a){let t=performance.now();for(let n of[...T.chunks.keys()])T.rimuovi(n);ce=0;for(let n=-i;n<i;n++)for(let r=-i;r<i;r++)T.carica(n+","+r,Pe(n,r,{erba:a})),ce+=256;let e=i*2*16,o=new Uint8Array(e*e);for(let n=0;n<e;n++)for(let r=0;r<e;r++)o[n*e+r]=Ia(r-i*16,n-i*16)+1;T.impostaAltezze(o,-i*16,-i*16,e,e),Ca=performance.now()-t}var ra=null,To=0,zo=0;function Rt(i,a){let t=performance.now();for(let m of[...T.chunks.keys()])T.rimuovi(m);uo(),ra=new Wa;let{alberi:e,lampioni:o}=co(ra,4242,i);for(let[m,s,h]of e)ra.metti(m,s,h,"albero",!0);for(let[m,s,h]of o)ra.metti(m,s,h,"lampione",!0);let n=performance.now()-t,r=[],l=1e9,f=1e9,c=-1e9,u=-1e9;for(let m of ra.chunks.keys()){let s=ro(ra,m,{erba:a});T.carica(m,s),r.push(s),l=Math.min(l,s.cx),c=Math.max(c,s.cx),f=Math.min(f,s.cz),u=Math.max(u,s.cz)}let p=lo(r,l,f,c,u);return T.impostaAltezze(p.byte,p.x0,p.z0,p.larghezza,p.profondita),ce=To=ra.contaBlocchi,zo=r.length,Ca=performance.now()-t,{tGen:n,tMesh:Ca-n}}var Se=null;q.mondo?Se=Rt(q.mondo,q.erba):Ao(q.raggio,q.erba);async function Lt(){if(!ra)return;let i=new Map;ra.perOgni((a,t,e,o)=>{let n=W(o);n.forma!=="modello"||!n.modello||(i.has(n.modello)||i.set(n.modello,[]),i.get(n.modello).push(a+.5,t,e+.5,1))});for(let[a,t]of i)try{let e=await fetch(`./modelli/nucleo/${a}.bin`);if(!e.ok)throw new Error(`${e.status}`);oa.registra(a,fo(await e.arrayBuffer())),oa.istanze(a,t)}catch(e){console.warn(`modello ${a}: ${e.message}`)}}Lt();T.tutto=q.tutto;var Ct=()=>{if(!ra)return Ia(0,0)+2;for(let i=120;i>-Aa;i--)if(ra.tipo(0,i,0))return i+2;return 8},V={alpha:-.8,beta:1.05,raggio:46,centro:[0,Ct(),0],fov:.9};function Mo(){let i=Math.sin(V.beta),a=Math.cos(V.beta);return[V.centro[0]+V.raggio*i*Math.cos(V.alpha),V.centro[1]+V.raggio*a,V.centro[2]+V.raggio*i*Math.sin(V.alpha)]}var Fa=null,ne=0;X.addEventListener("pointerdown",i=>{Fa={x:i.clientX,y:i.clientY},X.setPointerCapture(i.pointerId)});X.addEventListener("pointermove",i=>{Fa&&(V.alpha+=(i.clientX-Fa.x)*.006,V.beta=Math.max(.15,Math.min(1.5,V.beta-(i.clientY-Fa.y)*.006)),Fa={x:i.clientX,y:i.clientY})});X.addEventListener("pointerup",()=>{Fa=null});X.addEventListener("wheel",i=>{V.raggio=Math.max(8,Math.min(140,V.raggio*(i.deltaY>0?1.1:.9))),i.preventDefault()},{passive:!1});X.addEventListener("touchstart",i=>{i.touches.length===2&&(ne=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY))},{passive:!0});X.addEventListener("touchmove",i=>{if(i.touches.length!==2)return;let a=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY);ne>0&&(V.raggio=Math.max(8,Math.min(140,V.raggio*ne/a))),ne=a},{passive:!0});var re=q.ora??.35;function Ot(i){q.ora===null&&(re=(re+i/300)%1);let a=re*Math.PI*2-Math.PI/2,t=.24+.5*Math.max(0,Math.sin(a)),e=a*.5;T.sole.verso=[-Math.cos(e)*Math.cos(Math.asin(t)),-t,-Math.sin(e)*Math.cos(Math.asin(t))];let o=Math.max(0,Math.min(1,(Math.sin(a)+.1)*2));T.sole.forza=o;let n=Math.min(1,Math.max(0,(t-.24)/.4));T.sole.colore=[1,.78+.22*n,.55+.45*n],T.sole.cielo=[.36+.64*o,.38+.62*o,.57+.43*o],T.nebbia.colore=[.25+.47*o,.35+.5*o,.5+.42*o],Pa.clearColor(T.nebbia.colore[0],T.nebbia.colore[1],T.nebbia.colore[2],1)}var Q=[],va=[],le=[],bo=performance.now(),So=0,xo=0;function Ro(i){let a=Math.min(.1,(i-bo)/1e3);bo=i;let t=performance.now();St(),Ot(a);let o={occhio:Mo(),centro:V.centro,fov:V.fov,rapporto:X.width/X.height};T.disegna(o,a,oa),oa.disegna(T,o),T.disegnaAcqua();let n=performance.now()-t;Q.push(a*1e3),Q.length>240&&Q.shift(),va.push(n),va.length>240&&va.shift(),So++,i-xo>500&&(xo=i,Lo()),q.rampa&&!q.mondo&&It(i),requestAnimationFrame(Ro)}var se=[{raggio:5,erba:2,tutto:!1},{raggio:6,erba:3,tutto:!1},{raggio:7,erba:4,tutto:!1},{raggio:6,erba:3,tutto:!0},{raggio:8,erba:4,tutto:!0}],ue=[],La=-1,Eo=0;function It(i){if(La>=0&&i-Eo<6e3)return;if(La>=0){let t=Q.slice(-Math.min(Q.length,200)),e=se[La];ue.push({...e,fps:+(1e3/(H(t,.5)||1)).toFixed(0),p50:+H(t,.5).toFixed(1),p99:+H(t,.99).toFixed(1),js:+H(va,.5).toFixed(2),disegni:T.statistiche.disegni,triangoli:T.statistiche.triangoli})}if(La++,La>=se.length){q.rampa=!1,Lo();return}let a=se[La];Ao(a.raggio,a.erba),T.tutto=a.tutto,q.erba=a.erba,q.raggio=a.raggio,Q.length=0,va.length=0,Eo=i}var H=(i,a)=>{if(!i.length)return 0;let t=i.slice().sort((e,o)=>e-o);return t[Math.min(t.length-1,Math.floor(t.length*a))]};function Lo(){let i=H(Q,.5),a=H(Q,.99),t=i?1e3/i:0;le.push(Math.round(t)),le.length>120&&le.shift();let e={disegni:T.statistiche.disegni+oa.statistiche.disegni+T.statistiche.disegniAcqua+T.statistiche.disegniErba+T.statistiche.disegniSpecchio,triangoli:T.statistiche.triangoli+oa.statistiche.triangoli+T.statistiche.triangoliAcqua+T.statistiche.triangoliErba+T.statistiche.triangoliSpecchio,chunkVisti:T.statistiche.chunkVisti,chunkTotali:T.statistiche.chunkTotali};zt.textContent=`${t.toFixed(0)} fps
${i.toFixed(1)} / ${a.toFixed(1)} ms
JS ${H(va,.5).toFixed(2)} ms`,Tt.textContent=`NUCLEO ${q.mondo?`F1 \xB7 open world vero (semilato ${q.mondo}, ${zo} chunk, ${To.toLocaleString("it")} blocchi, gen ${Se.tGen.toFixed(0)} ms + mesh ${Se.tMesh.toFixed(0)} ms)`:"F0"} \xB7 ${X.width}\xD7${X.height} (dpr ${Mt.toFixed(2)})
disegni ${e.disegni}  triangoli ${e.triangoli.toLocaleString("it")}  chunk ${e.chunkVisti}/${e.chunkTotali}
ombra del sole: ${T.ombra?"horizon mapping":"spenta"} \xB7 erba ${q.erba} \xB7 modelli ${oa.statistiche.istanze} istanze in ${oa.statistiche.disegni} disegni \xB7 acqua ${T.statistiche.disegniAcqua} disegni${T.statistiche.pelo!=null?` + specchio ${T.statistiche.disegniSpecchio} disegni (pelo ${T.statistiche.pelo.toFixed(2)}, scala ${T.specchio.scala})`:" (senza specchio)"} \xB7 erba ${T.statistiche.triangoliErba.toLocaleString("it")} fili in ${T.statistiche.disegniErba} disegni \xB7 costruzione ${Ca.toFixed(0)} ms
${Xa(Pa)}
?mondo=96 ?ora=0.95 ?finto ?raggio=${q.raggio} ?erba=${q.erba} ?ombra=${q.ombra?"s\xEC":"no"} ?specchio=${q.specchio||"no"} ?dpr=${q.dprMax} ?rampa ?tutto  \xB7  tocca lo schermo per girare`+(ue.length?`
RAMPA  fps  p50   p99   dis  triangoli
`+ue.map(o=>`r${o.raggio} e${o.erba}${o.tutto?" tutto":""}  ${String(o.fps).padStart(3)}  ${String(o.p50).padStart(5)}  ${String(o.p99).padStart(5)}  ${String(o.disegni).padStart(3)}  ${o.triangoli.toLocaleString("it")}`).join(`
`):"")+(q.rampa?`
rampa: gradino ${La+1}/${se.length}\u2026`:"")}requestAnimationFrame(Ro);var _t=new ie(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[X.clientWidth,X.clientHeight],reso:[X.width,X.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:q.mondo?"nucleo F1 mondo vero":"nucleo F0",mondo:q.mondo,raggio:q.raggio,erba:q.erba,ombra:T.ombra,specchio:q.specchio,disegniSpecchio:T.statistiche.disegniSpecchio,tutto:!!T.tutto,dprMax:q.dprMax,jsMs:+H(va,.5).toFixed(2),jsP99:+H(va,.99).toFixed(2),rampa:ue},ombreLampade:!1,antialias:!0,fps:H(Q,.5)?1e3/H(Q,.5):null,p50:H(Q,.5),p99:H(Q,.99),disegni:T.statistiche.disegni+oa.statistiche.disegni+T.statistiche.disegniAcqua+T.statistiche.disegniErba+T.statistiche.disegniSpecchio,triangoli:T.statistiche.triangoli+oa.statistiche.triangoli+T.statistiche.triangoliAcqua+T.statistiche.triangoliErba+T.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:le,storiaLivelli:[],scheda:Xa(Pa),software:/swiftshader|llvmpipe/i.test(Xa(Pa)),chunk:T.statistiche.chunkTotali,blocchi:ce,luci:0,decorazioni:oa.statistiche.istanze,erba:T.statistiche.triangoliErba,ora:`${Math.floor(re*24)}h`,giorno:0,worldgenMs:Ca,meshMs:Ca}),()=>{let i=Mo();return T.disegna({occhio:i,centro:V.centro,fov:V.fov,rapporto:X.width/X.height},0),Promise.resolve(X.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:T,modelli:oa,cam:V,opz:q,statistiche:()=>({fps:1e3/(H(Q,.5)||1),p50:H(Q,.5),p99:H(Q,.99),js:H(va,.5),...T.statistiche,modelli:{...oa.statistiche},costruzioneMs:Ca,fotogrammi:So}),diagnostica:_t};

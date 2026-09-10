function Le(i,{antialias:e=!0,dprMax:t=1.5}={}){let a=i.getContext("webgl2",{antialias:e,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!a)throw new Error("WebGL2 non disponibile");let o=Math.min(t,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(i.clientWidth*o)),l=Math.max(1,Math.round(i.clientHeight*o));return i.width!==r||i.height!==l?(i.width=r,i.height=l,a.viewport(0,0,r,l),!0):!1};return n(),{gl:a,dpr:o,ridimensiona:n}}function ea(i,e,t){let a=(n,r)=>{let l=i.createShader(n);if(i.shaderSource(l,r),i.compileShader(l),!i.getShaderParameter(l,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(l)}
${r.split(`
`).map((u,s)=>`${s+1}: ${u}`).join(`
`)}`);return l},o=i.createProgram();if(i.attachShader(o,a(i.VERTEX_SHADER,e)),i.attachShader(o,a(i.FRAGMENT_SHADER,t)),i.linkProgram(o),!i.getProgramParameter(o,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(o)}`);return o}function ka(i){let e=i.getExtension("WEBGL_debug_renderer_info");return e?i.getParameter(e.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function K(i,e,t){return(Math.sign(i)+1)*9+(Math.sign(e)+1)*3+(Math.sign(t)+1)}var So=K(1,0,0),Oo=K(-1,0,0),Co=K(0,1,0),Io=K(0,-1,0),_o=K(0,0,1),No=K(0,0,-1);var Se=[So,Oo,Co,Io,_o,No],za=class{constructor(e=1024){this.byte=new Uint8Array(e*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(e){let t=(this.n+e)*12;if(t<=this.byte.length)return;let a=this.byte.length*2;for(;a<t;)a*=2;let o=new Uint8Array(a);o.set(this.byte),this.byte=o,this.u32=new Uint32Array(o.buffer)}vertice(e,t,a,o,n,r,l,u=0,s=0){let f=Math.round(e*16)+16,p=Math.round(a*16)+16,m=Math.round(t*16);if(f<0||f>511||p<0||p>511||m<0||m>65535)throw new RangeError(`vertice fuori dal chunk: ${e},${t},${a}`);if(o<0||o>26||o===13)throw new RangeError(`normale non valida: ${o}`);this._spazio(1);let c=this.n*3,d=this.byte,v=this.u32;v[c]=(f|p<<9|(o&31)<<18|(u&1)<<23|(s&15)<<24)>>>0,v[c+1]=(m|(n&15)<<16|(r&15)<<20)>>>0;let h=this.n*12+8;d[h]=l>>16&255,d[h+1]=l>>8&255,d[h+2]=l&255,d[h+3]=0,this.n++}quadDa(e,t,a,o){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[e,t,a,o])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function Oe(i=16384){let e=new Uint16Array(i*6);for(let t=0,a=0,o=0;t<i;t++,o+=4)e[a++]=o,e[a++]=o+1,e[a++]=o+2,e[a++]=o,e[a++]=o+2,e[a++]=o+3;return e}function Ce(i,e,t,a){let o=1/Math.tan(i/2),n=1/(t-a);return new Float32Array([o/e,0,0,0,0,o,0,0,0,0,(a+t)*n,-1,0,0,2*a*t*n,0])}function ue(i,e,t){let a=1/(t-e);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*a,0,0,0,-(t+e)*a,1])}function Xa(i,e,t=[0,1,0]){let a=i[0]-e[0],o=i[1]-e[1],n=i[2]-e[2],r=Math.hypot(a,o,n)||1;a/=r,o/=r,n/=r;let l=t[1]*n-t[2]*o,u=t[2]*a-t[0]*n,s=t[0]*o-t[1]*a;r=Math.hypot(l,u,s)||1,l/=r,u/=r,s/=r;let f=o*s-n*u,p=n*l-a*s,m=a*u-o*l;return new Float32Array([l,f,a,0,u,p,o,0,s,m,n,0,-(l*i[0]+u*i[1]+s*i[2]),-(f*i[0]+p*i[1]+m*i[2]),-(a*i[0]+o*i[1]+n*i[2]),1])}function Ie(i,e=new Float32Array(16)){let[t,a,o,n,r,l,u,s,f,p,m,c,d,v,h,b]=i,x=t*l-a*r,g=t*u-o*r,M=t*s-n*r,L=a*u-o*l,S=a*s-n*l,R=o*s-n*u,A=f*v-p*d,_=f*h-m*d,O=f*b-c*d,C=p*h-m*v,N=p*b-c*v,E=m*b-c*h,z=x*E-g*N+M*C+L*O-S*_+R*A;return z?(z=1/z,e[0]=(l*E-u*N+s*C)*z,e[1]=(o*N-a*E-n*C)*z,e[2]=(v*R-h*S+b*L)*z,e[3]=(m*S-p*R-c*L)*z,e[4]=(u*O-r*E-s*_)*z,e[5]=(t*E-o*O+n*_)*z,e[6]=(h*M-d*R-b*g)*z,e[7]=(f*R-m*M+c*g)*z,e[8]=(r*N-l*O+s*A)*z,e[9]=(a*O-t*N-n*A)*z,e[10]=(d*S-v*M+b*x)*z,e[11]=(p*M-f*S-c*x)*z,e[12]=(l*_-r*C-u*A)*z,e[13]=(t*C-a*_+o*A)*z,e[14]=(v*g-d*L-h*x)*z,e[15]=(f*L-p*g+m*x)*z,e):null}function Pa(i,e,t=new Float32Array(16)){for(let a=0;a<4;a++)for(let o=0;o<4;o++)t[a*4+o]=i[o]*e[a*4]+i[4+o]*e[a*4+1]+i[8+o]*e[a*4+2]+i[12+o]*e[a*4+3];return t}function fe(i,e=new Float32Array(24)){let t=u=>[i[u],i[4+u],i[8+u],i[12+u]],a=t(0),o=t(1),n=t(2),r=t(3),l=[[r[0]+a[0],r[1]+a[1],r[2]+a[2],r[3]+a[3]],[r[0]-a[0],r[1]-a[1],r[2]-a[2],r[3]-a[3]],[r[0]+o[0],r[1]+o[1],r[2]+o[2],r[3]+o[3]],[r[0]-o[0],r[1]-o[1],r[2]-o[2],r[3]-o[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let u=0;u<6;u++){let[s,f,p,m]=l[u],c=Math.hypot(s,f,p)||1;e[u*4]=s/c,e[u*4+1]=f/c,e[u*4+2]=p/c,e[u*4+3]=m/c}return e}function me(i,e,t,a,o,n,r){for(let l=0;l<6;l++){let u=i[l*4],s=i[l*4+1],f=i[l*4+2],p=i[l*4+3],m=u>0?o:e,c=s>0?n:t,d=f>0?r:a;if(u*m+s*c+f*d+p<0)return!1}return!0}var pe=2,yo=`#version 300 es
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
}`,Fo=`#version 300 es
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
}`,Po=`#version 300 es
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
}`,Do=`#version 300 es
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
}`,Uo=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,wo=`#version 300 es
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
}`,Bo=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Vo=`#version 300 es
precision mediump float;
void main() {}`,Ha=class{constructor(e){this.gl=e,this.programma=ea(e,yo,_e),this.u={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[t]=e.getUniformLocation(this.programma,t);this.ebo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,Oe(16384),e.STATIC_DRAW),this.programmaErba=ea(e,Do,_e.replace(/flat in /g,"in ")),this.ue={};for(let t of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.ue[t]=e.getUniformLocation(this.programmaErba,t);this.programmaOmbra=ea(e,Bo,Vo),this.uo={uVP:e.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:e.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=ea(e,Fo,Po),this.ua={};for(let t of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[t]=e.getUniformLocation(this.programmaAcqua,t);this.programmaCielo=ea(e,Uo,wo),this.uc={};for(let t of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[t]=e.getUniformLocation(this.programmaCielo,t);this.vaoVuoto=e.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=e.createSampler(),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_MIN_FILTER,e.LINEAR),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_MAG_FILTER,e.LINEAR),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(1024),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,colonne:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!e.getExtension("EXT_color_buffer_half_float")&&!!e.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.lampadeCol=new Float32Array(32),this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),e.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(e,t){let a=this.mappa;Math.hypot(e+8-a.centro[0],t+8-a.centro[2])<=a.raggio+12&&(a.sporca=!0)}carica(e,t){let a=this.gl;this._sporcaMappa(t.cx*16,t.cz*16);let o=this.chunks.get(e);o||(o={vao:a.createVertexArray(),vbo:a.createBuffer(),quad:0},a.bindVertexArray(o.vao),a.bindBuffer(a.ARRAY_BUFFER,o.vbo),a.enableVertexAttribArray(0),a.vertexAttribIPointer(0,2,a.UNSIGNED_INT,12,0),a.enableVertexAttribArray(1),a.vertexAttribIPointer(1,4,a.UNSIGNED_BYTE,12,8),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.ebo),a.bindVertexArray(null),this.chunks.set(e,o)),a.bindBuffer(a.ARRAY_BUFFER,o.vbo),a.bufferData(a.ARRAY_BUFFER,t.byte,a.STATIC_DRAW),o.quad=t.quad;let n=t.erba;o.verticiErba=n?n.vertici:0,o.lamelle=n?n.fili:0,o.yBaseErba=n?n.yBase:0,o.verticiErba>0&&(o.vaoErba||(o.vaoErba=a.createVertexArray(),o.vboErba=a.createBuffer(),a.bindVertexArray(o.vaoErba),a.bindBuffer(a.ARRAY_BUFFER,o.vboErba),a.enableVertexAttribArray(0),a.vertexAttribIPointer(0,4,a.UNSIGNED_BYTE,12,0),a.vertexAttribDivisor(0,1),a.enableVertexAttribArray(1),a.vertexAttribIPointer(1,4,a.UNSIGNED_BYTE,12,4),a.vertexAttribDivisor(1,1),a.enableVertexAttribArray(2),a.vertexAttribIPointer(2,4,a.UNSIGNED_BYTE,12,8),a.vertexAttribDivisor(2,1),a.bindVertexArray(null)),a.bindBuffer(a.ARRAY_BUFFER,o.vboErba),a.bufferData(a.ARRAY_BUFFER,n.byte,a.STATIC_DRAW));let r=t.acqua;if(o.quadAcqua=r?r.quad:0,o.peloAcqua=r&&r.pelo!=null?r.pelo:null,o.quadAcqua>0&&(o.vaoAcqua||(o.vaoAcqua=a.createVertexArray(),o.vboAcqua=a.createBuffer(),a.bindVertexArray(o.vaoAcqua),a.bindBuffer(a.ARRAY_BUFFER,o.vboAcqua),a.enableVertexAttribArray(0),a.vertexAttribIPointer(0,2,a.UNSIGNED_INT,12,0),a.enableVertexAttribArray(1),a.vertexAttribIPointer(1,4,a.UNSIGNED_BYTE,12,8),a.bindBuffer(a.ELEMENT_ARRAY_BUFFER,this.ebo),a.bindVertexArray(null)),a.bindBuffer(a.ARRAY_BUFFER,o.vboAcqua),a.bufferData(a.ARRAY_BUFFER,r.byte,a.STATIC_DRAW)),o.luci=t.luci||[],o.x0=t.cx*16,o.z0=t.cz*16,o.minY=t.minY,o.maxY=t.maxY,o.y0=t.y0||0,o.chunk=[o.x0,o.y0,o.z0],t.altezze){o.tegola||(o.tegola=new Uint8Array(1024));let l=t.solide||t.altezze,u=t.impronte;for(let s=0;s<16;s++)for(let f=0;f<16;f++){let p=(f*16+s)*4,m=s*16+f,c=t.altezze[m],d=l[m],v=u?u[m]:-1;o.tegola[p]=c<0?0:Math.max(0,Math.min(255,c+1)),o.tegola[p+1]=d<0?0:Math.max(0,Math.min(255,d+1)),o.tegola[p+2]=v<0?0:Math.max(0,Math.min(255,v+1)),o.tegola[p+3]=255}this.finestra&&this._scriviTegola(o)}}apriFinestraAltezze(e,t,a=512){let o=this.gl;this.altezze||(this.altezze=o.createTexture()),this.finestra={lato:a,x0:0,z0:0,vuota:new Uint8Array(a*a*4),spostamenti:0},o.bindTexture(o.TEXTURE_2D,this.altezze),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MIN_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_MAG_FILTER,o.NEAREST),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_S,o.CLAMP_TO_EDGE),o.texParameteri(o.TEXTURE_2D,o.TEXTURE_WRAP_T,o.CLAMP_TO_EDGE),this._centraFinestra(e,t,!0)}seguiAltezze(e,t){this.finestra&&this._centraFinestra(e,t,!1)}_centraFinestra(e,t,a){let o=this.gl,n=this.finestra,r=n.lato/2;if(!a&&Math.abs(e-(n.x0+r))<n.lato/4&&Math.abs(t-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((e-r)/16)*16,n.z0=Math.floor((t-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.colonne!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,this.ombre.w,this.ombre.h],o.bindTexture(o.TEXTURE_2D,this.altezze),o.pixelStorei(o.UNPACK_ALIGNMENT,1),o.texImage2D(o.TEXTURE_2D,0,o.RGBA8,n.lato,n.lato,0,o.RGBA,o.UNSIGNED_BYTE,n.vuota);for(let l of this.chunks.values())l.tegola&&this._scriviTegola(l);return n.spostamenti++,!0}_scriviTegola(e,t=!1){let a=this.gl,o=this.finestra,n=e.x0-o.x0,r=e.z0-o.z0;n<0||r<0||n+16>o.lato||r+16>o.lato||(a.bindTexture(a.TEXTURE_2D,this.altezze),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texSubImage2D(a.TEXTURE_2D,0,n,r,16,16,a.RGBA,a.UNSIGNED_BYTE,t?this._tegolaVuota:e.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(e,t,a,o=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=ea(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,e,t,a,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,e,t,a,.1),n.uniform3f(r.uColore,1,1-.45*o,1-.8*o),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(e,t,a,o,n,r,l=.3,u=.1){let s=this.gl;this.programmaPieno||(this.programmaPieno=ea(s,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:s.getUniformLocation(this.programmaPieno,"uVP"),uCella:s.getUniformLocation(this.programmaPieno,"uCella"),uColore:s.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=s.createVertexArray());let f=this.uPieno;s.useProgram(this.programmaPieno),s.uniformMatrix4fv(f.uVP,!1,this.vp),s.uniform4f(f.uCella,e,t,a,u),s.uniform4f(f.uColore,o*l,n*l,r*l,l),s.bindVertexArray(this.vaoPieno),s.enable(s.BLEND),s.blendFunc(s.ONE,s.ONE_MINUS_SRC_ALPHA),s.depthMask(!1),s.disable(s.CULL_FACE),s.drawArrays(s.TRIANGLES,0,36),s.enable(s.CULL_FACE),s.depthMask(!0),s.disable(s.BLEND),s.bindVertexArray(null)}rimuovi(e){let t=this.chunks.get(e);t&&(this._sporcaMappa(t.x0,t.z0),this.finestra&&t.tegola&&this._scriviTegola(t,!0),this.gl.deleteVertexArray(t.vao),this.gl.deleteBuffer(t.vbo),t.vaoAcqua&&(this.gl.deleteVertexArray(t.vaoAcqua),this.gl.deleteBuffer(t.vboAcqua)),t.vaoErba&&(this.gl.deleteVertexArray(t.vaoErba),this.gl.deleteBuffer(t.vboErba)),this.chunks.delete(e))}_sporcaOmbre(e,t,a,o){let r=[Math.max(0,e-26),Math.max(0,t-26),Math.min(this.ombre.w||1e9,e+a+26),Math.min(this.ombre.h||1e9,t+o+26)],l=this.ombre.sporco;this.ombre.sporco=l?[Math.min(l[0],r[0]),Math.min(l[1],r[1]),Math.max(l[2],r[2]),Math.max(l[3],r[3])]:r}_preparaOmbre(e,t){let a=this.gl,o=this.ombre;o.colonne=e;let n=e*pe,r=t*pe;if(o.tex||(o.tex=a.createTexture(),o.fbo=a.createFramebuffer()),a.bindTexture(a.TEXTURE_2D,o.tex),o.mezzoFloat=this._ombreMezzo,o.mezzoFloat?(a.texImage2D(a.TEXTURE_2D,0,a.R16F,n,r,0,a.RED,a.HALF_FLOAT,null),o.scala=1,o.offset=0):(a.texImage2D(a.TEXTURE_2D,0,a.R8,n,r,0,a.RED,a.UNSIGNED_BYTE,null),o.scala=64,o.offset=-8),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindFramebuffer(a.FRAMEBUFFER,o.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,o.tex,0),a.checkFramebufferStatus(a.FRAMEBUFFER)!==a.FRAMEBUFFER_COMPLETE&&o.mezzoFloat)return this._ombreMezzo=!1,a.bindFramebuffer(a.FRAMEBUFFER,null),this._preparaOmbre(e,t);if(a.bindFramebuffer(a.FRAMEBUFFER,null),o.w=n,o.h=r,o.sporco=[0,0,n,r],!this.programmaOmbre){this.programmaOmbre=ea(a,`#version 300 es
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
}`),this.uOmbre={};for(let l of["uAltezze","uAltRett","uSole","uCodifica","uSuper"])this.uOmbre[l]=a.getUniformLocation(this.programmaOmbre,l);this.vaoOmbre=a.createVertexArray()}}_calcolaOmbre(){let e=this.gl,t=this.ombre,a=this.sole;if(!this.altezze||!t.tex||(a.verso[0]*t.sole[0]+a.verso[1]*t.sole[1]+a.verso[2]*t.sole[2]<.99996&&(t.sole=a.verso.slice(),t.sporco=[0,0,t.w,t.h]),!t.sporco))return;let n=96,[r,l,u,s]=t.sporco;if(u<=r||s<=l){t.sporco=null;return}let f=Math.min(s,l+n);t.sporco=f>=s?null:[r,f,u,s];let p=Math.hypot(a.verso[0],a.verso[2])||1e-4,m=[-a.verso[0]/p,-a.verso[2]/p],c=Math.max(.05,-a.verso[1]/p);e.bindFramebuffer(e.FRAMEBUFFER,t.fbo),e.viewport(0,0,t.w,t.h),e.enable(e.SCISSOR_TEST),e.scissor(r,l,u-r,f-l),e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE),e.useProgram(this.programmaOmbre),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(this.uOmbre.uAltezze,0),e.bindSampler(0,this.campionatoreLiscio),e.uniform4f(this.uOmbre.uAltRett,0,0,1/t.w,1/t.h),e.uniform3f(this.uOmbre.uSole,m[0],m[1],c),e.uniform2f(this.uOmbre.uCodifica,t.scala,t.offset),e.uniform1f(this.uOmbre.uSuper,pe),e.bindVertexArray(this.vaoOmbre),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.bindSampler(0,null),e.disable(e.SCISSOR_TEST),e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),t.calcoli++,this.statistiche.calcoliOmbre=t.calcoli}_disegnaCielo(e,t){let a=this.gl,o=this.uc,n=this.sole;if(this.cieloNero||!Ie(e,this._invVP))return;a.useProgram(this.programmaCielo),a.uniformMatrix4fv(o.uInvVP,!1,this._invVP),a.uniform3f(o.uOcchio,t[0],t[1],t[2]),a.uniform3f(o.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),a.uniform1f(o.uSoleForza,n.forza),a.uniform3f(o.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;a.uniform3f(o.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),a.disable(a.DEPTH_TEST),a.depthMask(!1),a.disable(a.CULL_FACE),a.bindVertexArray(this.vaoVuoto),a.drawArrays(a.TRIANGLES,0,3),a.bindVertexArray(null),a.enable(a.CULL_FACE),a.depthMask(!0),a.enable(a.DEPTH_TEST)}_preparaMappa(){let e=this.gl,t=this.mappa,a=o=>{let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,o,o,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_FUNC,e.LEQUAL);let r=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,n,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);let l=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:n,fbo:r,lato:o,ok:l}};t.stat=a(t.lato),t.din=a(t.latoDin),(!t.stat.ok||!t.din.ok)&&(t.attiva=!1)}legaMappa(e){let t=this.gl,a=this.mappa;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,a.stat.tex),t.uniform1i(e.uMappaStat,1),t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,a.din.tex),t.uniform1i(e.uMappaDin,2),t.activeTexture(t.TEXTURE0),t.uniform1f(e.uMappaOn,a.on?1:0),t.uniformMatrix4fv(e.uLuceVP,!1,a.vp),t.uniformMatrix4fv(e.uLuceVPDin,!1,a.vpDin),t.uniform2f(e.uMappaTexel,.5/a.lato,.5/a.latoDin),t.uniform2f(e.uMappaSbieco,1.5*(2*a.raggio/a.lato),.1/220),t.uniform4fv(e.uLampade,this.lampade),t.uniform1i(e.uNLampade,this.nLampade),t.uniform4fv(e.uLampCol,this.lampadeCol),t.uniform3f(e.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(t.activeTexture(t.TEXTURE3),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(e.uAltezze,3),t.activeTexture(t.TEXTURE0))}_aggiornaMappa(e,t){let a=this.gl,o=this.mappa,n=this.sole,r=this.statistiche;if(o.on=!1,!o.attiva||!this.ombra)return;let l=typeof performance<"u"?performance.now():0,u=e.centro[0],s=e.centro[2],f=!1;Math.hypot(u-o.centro[0],s-o.centro[2])>10&&(o.centro=[Math.round(u/2)*2,Math.round(e.centro[1]),Math.round(s/2)*2],f=!0);{let h=n.verso,b=e.centro,x=[b[0]-h[0]*120,b[1]-h[1]*120,b[2]-h[2]*120],g=Math.abs(h[1])>.95?[0,0,1]:[0,1,0];Pa(ue(o.raggioDin,10,230),Xa(x,b,g),o.vpDin)}n.verso[0]*o.sole[0]+n.verso[1]*o.sole[1]+n.verso[2]*o.sole[2]<.99985&&(o.soleMosso=!0);let m=o.sporca||o.soleMosso||t&&t.mappaSporca,c=f||m&&l-(o.ultimo||0)>=500;if(c){o.sole=n.verso.slice(),o.soleMosso=!1,o.ultimo=l;let h=n.verso,b=o.centro,x=[b[0]-h[0]*120,b[1]-h[1]*120,b[2]-h[2]*120],g=Math.abs(h[1])>.95?[0,0,1]:[0,1,0];Pa(ue(o.raggio,10,230),Xa(x,b,g),o.vp)}if(a.enable(a.POLYGON_OFFSET_FILL),a.polygonOffset(1.5,4),c){a.bindFramebuffer(a.FRAMEBUFFER,o.stat.fbo),a.viewport(0,0,o.stat.lato,o.stat.lato),a.clear(a.DEPTH_BUFFER_BIT),a.useProgram(this.programmaOmbra),a.uniformMatrix4fv(this.uo.uVP,!1,o.vp);let h=0,b=0,x=o.raggio+12;for(let g of this.chunks.values())g.quad!==0&&(Math.hypot(g.x0+8-o.centro[0],g.z0+8-o.centro[2])>x||(a.uniform3f(this.uo.uChunk,g.chunk[0],g.chunk[1],g.chunk[2]),a.bindVertexArray(g.vao),a.drawElements(a.TRIANGLES,g.quad*6,a.UNSIGNED_SHORT,0),h++,b+=g.quad*2));if(a.bindVertexArray(null),t){let[g,M]=t.disegnaOmbra(o.vp,!1);h+=g,b+=M,t.mappaSporca=!1}o.sporca=!1,o.calcoli++,o.disegni=h,o.triangoli=b}a.bindFramebuffer(a.FRAMEBUFFER,o.din.fbo),a.viewport(0,0,o.din.lato,o.din.lato),a.clear(a.DEPTH_BUFFER_BIT);let d=0,v=0;t&&([d,v]=t.disegnaOmbra(o.vpDin,!0)),a.disable(a.POLYGON_OFFSET_FILL),a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),o.on=!0,r.calcoliMappa=o.calcoli,r.disegniOmbra=d+(c?o.disegni:0),r.triangoliOmbra=v+(c?o.triangoli:0)}impostaAltezze(e,t,a,o,n,r=null){let l=this.gl;this.altezze||(this.altezze=l.createTexture()),l.bindTexture(l.TEXTURE_2D,this.altezze),l.pixelStorei(l.UNPACK_ALIGNMENT,1);let u=new Uint8Array(o*n*4);for(let s=0;s<o*n;s++)u[s*4]=e[s],u[s*4+1]=r?r[s]:e[s];l.texImage2D(l.TEXTURE_2D,0,l.RGBA8,o,n,0,l.RGBA,l.UNSIGNED_BYTE,u),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MIN_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_MAG_FILTER,l.NEAREST),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_S,l.CLAMP_TO_EDGE),l.texParameteri(l.TEXTURE_2D,l.TEXTURE_WRAP_T,l.CLAMP_TO_EDGE),this.altRett=[t,a,1/o,1/n],this._preparaOmbre(o,n)}impostaMaterie(e){let t=new Float32Array(64);for(let a=0;a<16&&a<e.length;a++)for(let o=0;o<4;o++)t[a*4+o]=e[a][o]||0;this.materie=t}disegna(e,t,a=null){let o=this.gl,n=this.statistiche;this.tempo+=t;let r=Ce(e.fov,e.rapporto,.3,400),l=Xa(e.occhio,e.centro);Pa(r,l,this.vp),fe(this.vp,this.piani),this._camera=e,this._visibili.length=0,this._visibiliErba.length=0;let u=0;for(let c of this.chunks.values())c.quad===0&&c.quadAcqua===0||(c.visto=this.tutto||me(this.piani,c.x0,c.y0+c.minY,c.z0,c.x0+16,c.y0+c.maxY+1,c.z0+16),c.visto&&(u++,c.quadAcqua>0&&this._visibili.push(c),c.verticiErba>0&&Math.hypot(c.x0+8-e.occhio[0],c.z0+8-e.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(c)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(e,a),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(e,a),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,e.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[s,f]=this._solidi(this.vp,this.piani,e.occhio,!1),p=0,m=0;if(this._visibiliErba.length){let c=this.ue,d=this.sole;o.useProgram(this.programmaErba),o.uniformMatrix4fv(c.uVP,!1,this.vp),o.uniform1f(c.uTempo,this.tempo),o.uniform3f(c.uSoleVerso,d.verso[0],d.verso[1],d.verso[2]),o.uniform3f(c.uSoleCol,d.colore[0],d.colore[1],d.colore[2]),o.uniform1f(c.uSoleForza,d.forza),o.uniform3f(c.uCieloCol,d.cielo[0],d.cielo[1],d.cielo[2]),o.uniform2f(c.uNebbia,this.nebbia.da,this.nebbia.a),o.uniform3f(c.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),o.uniform3f(c.uCam,e.occhio[0],e.occhio[1],e.occhio[2]),o.uniform2f(c.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),o.uniform1f(c.uOmbra,this.ombra&&this.altezze?1:0),o.uniform1f(c.uTaglio,-1e9),o.uniform1f(c.uErbaFinoA,this.erbaFinoA),o.uniform4f(c.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),o.uniform3f(c.uOcchio,e.occhio[0],e.occhio[1],e.occhio[2]),this.altezze&&(o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,this.ombre.tex),o.uniform1i(c.uOmbre,0),o.uniform2f(c.uOmbreScala,this.ombre.scala,this.ombre.offset),o.uniform4f(c.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(c),o.disable(o.CULL_FACE);for(let v of this._visibiliErba)o.uniform3f(c.uChunk,v.chunk[0],v.yBaseErba,v.chunk[2]),o.bindVertexArray(v.vaoErba),o.drawArraysInstanced(o.TRIANGLES,0,6,v.lamelle),p++,m+=v.lamelle*2;o.enable(o.CULL_FACE),o.bindVertexArray(null)}n.disegni=s,n.triangoli=f,n.chunkVisti=u,n.chunkTotali=this.chunks.size,n.disegniErba=p,n.triangoliErba=m}_solidi(e,t,a,o){let n=this.gl,r=this.u,l=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,e),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,l.verso[0],l.verso[1],l.verso[2]),n.uniform3f(r.uSoleCol,l.colore[0],l.colore[1],l.colore[2]),n.uniform1f(r.uSoleForza,l.forza),n.uniform3f(r.uCieloCol,l.cielo[0],l.cielo[1],l.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,a[0],a[1],a[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let u=o?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,u[0],u[1],u[2],u[3]),n.uniform3f(r.uOcchio,a[0],a[1],a[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let s=0,f=0;for(let p of this.chunks.values())if(p.quad!==0){if(o){if(!this.tutto&&!me(t,p.x0,p.y0+p.minY,p.z0,p.x0+16,p.y0+p.maxY+1,p.z0+16))continue}else if(!p.visto)continue;n.uniform3f(r.uChunk,p.chunk[0],p.chunk[1],p.chunk[2]),n.bindVertexArray(p.vao),n.drawElements(n.TRIANGLES,p.quad*6,n.UNSIGNED_SHORT,0),s++,f+=p.quad*2}return n.bindVertexArray(null),[s,f]}_peloVicino(e){let t=this._voti;t.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-e[0],n.z0+8-e[2])+2.2*Math.abs(n.peloAcqua-e[1]);t.set(n.peloAcqua,(t.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let a=null,o=0;for(let[n,r]of t)r>o&&(o=r,a=n);return a}_specchia(e,t){let a=this.gl,o=this.specchio,n=this.statistiche,r=this._peloVicino(e.occhio);if(r==null||e.occhio[1]<=r+.2)return;let l=Math.max(1,Math.round(a.drawingBufferWidth*o.scala)),u=Math.max(1,Math.round(a.drawingBufferHeight*o.scala));(!o.fbo||o.w!==l||o.h!==u)&&this._preparaSpecchio(l,u);let s=this._riflessione;s.fill(0),s[0]=1,s[5]=-1,s[10]=1,s[13]=2*r,s[15]=1,Pa(this.vp,s,this.vpSpecchio),fe(this.vpSpecchio,this.pianiSpecchio);let f=[e.occhio[0],2*r-e.occhio[1],e.occhio[2]];a.bindFramebuffer(a.FRAMEBUFFER,o.fbo),a.viewport(0,0,l,u),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,f),a.cullFace(a.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[p,m]=this._solidi(this.vpSpecchio,this.pianiSpecchio,f,!0);n.disegniSpecchio=p,n.triangoliSpecchio=m,t&&(t.disegna(this,{occhio:f,centro:e.centro,fov:e.fov,rapporto:e.rapporto}),n.disegniSpecchio+=t.statistiche.disegni,n.triangoliSpecchio+=t.statistiche.triangoli),a.cullFace(a.BACK),a.bindFramebuffer(a.FRAMEBUFFER,null),a.viewport(0,0,a.drawingBufferWidth,a.drawingBufferHeight),this.taglio=-1e9,o.pelo=r,n.pelo=r}_mostraSpecchio(){let e=this.gl,t=this.specchio;this.programmaQuad||(this.programmaQuad=ea(e,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=e.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=e.createVertexArray()),e.useProgram(this.programmaQuad),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.tex),e.uniform1i(this.uQuad,0),e.bindVertexArray(this.vaoQuad),e.disable(e.DEPTH_TEST),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.enable(e.DEPTH_TEST),e.bindVertexArray(null)}_preparaSpecchio(e,t){let a=this.gl,o=this.specchio;o.fbo||(o.fbo=a.createFramebuffer(),o.tex=a.createTexture(),o.rbo=a.createRenderbuffer()),a.bindTexture(a.TEXTURE_2D,o.tex),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,e,t,0,a.RGBA,a.UNSIGNED_BYTE,null),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.LINEAR),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),a.bindRenderbuffer(a.RENDERBUFFER,o.rbo),a.renderbufferStorage(a.RENDERBUFFER,a.DEPTH_COMPONENT16,e,t),a.bindFramebuffer(a.FRAMEBUFFER,o.fbo),a.framebufferTexture2D(a.FRAMEBUFFER,a.COLOR_ATTACHMENT0,a.TEXTURE_2D,o.tex,0),a.framebufferRenderbuffer(a.FRAMEBUFFER,a.DEPTH_ATTACHMENT,a.RENDERBUFFER,o.rbo),a.checkFramebufferStatus(a.FRAMEBUFFER)!==a.FRAMEBUFFER_COMPLETE&&(o.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),a.bindFramebuffer(a.FRAMEBUFFER,null),a.bindTexture(a.TEXTURE_2D,null),o.w=e,o.h=t}disegnaAcqua(){let e=this.gl,t=this.ua,a=this.sole,o=this._camera,n=this.specchio;if(!o||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}e.useProgram(this.programmaAcqua),e.uniformMatrix4fv(t.uVP,!1,this.vp),e.uniform1f(t.uTempo,this.tempo),e.uniform3f(t.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform2f(t.uNebbia,this.nebbia.da,this.nebbia.a),e.uniform3f(t.uSoleVerso,a.verso[0],a.verso[1],a.verso[2]),e.uniform3f(t.uSoleCol,a.colore[0],a.colore[1],a.colore[2]),e.uniform1f(t.uSoleForza,a.forza),e.uniform3f(t.uCieloCol,a.cielo[0],a.cielo[1],a.cielo[2]),e.uniform3f(t.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,r?n.tex:null),e.uniform1i(t.uSpecchio,1),e.uniform3f(t.uSchermo,1/e.drawingBufferWidth,1/e.drawingBufferHeight,r?1:0),e.uniform1f(t.uMare,this.mare),e.uniform4fv(t.uGalleggianti,this.galleggianti),e.uniform1i(t.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(t.uAltezze,2),e.bindSampler(2,this.campionatoreLiscio),e.uniform4f(t.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):e.uniform4f(t.uAltRett,0,0,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.depthMask(!1),e.disable(e.CULL_FACE);let l=0,u=0;for(let s of this._visibili)e.uniform3f(t.uChunk,s.chunk[0],s.chunk[1],s.chunk[2]),e.bindVertexArray(s.vaoAcqua),e.drawElements(e.TRIANGLES,s.quadAcqua*6,e.UNSIGNED_SHORT,0),l++,u+=s.quadAcqua*2;e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),e.bindSampler(2,null),e.activeTexture(e.TEXTURE0),this.statistiche.disegniAcqua=l,this.statistiche.triangoliAcqua=u,n.mostra&&r&&this._mostraSpecchio()}};var ve=class extends za{vertice(e,t,a,o,n,r,l,u=0,s=0){super.vertice(e,t,a,Se[o],n,r,l,u,s)}},ia={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},$a=[0,6072381,8739896,14403468,9211013,5086771,6043679,2714414,16767347],Go=1;function de(i,e){let t=a=>Math.max(0,Math.min(255,Math.round(a*e)));return t(i>>16&255)<<16|t(i>>8&255)<<8|t(i&255)}function ma(i,e,t){let a=i*374761393+e*668265263+t*1442695041|0;return a=Math.imul(a^a>>>13,1274126177),((a^a>>>16)>>>0)/4294967296}function he(i,e,t,a){let o=i/t,n=e/t,r=Math.floor(o),l=Math.floor(n),u=o-r,s=n-l,f=u*u*(3-2*u),p=s*s*(3-2*s),m=ma(r,l,a),c=ma(r+1,l,a),d=ma(r,l+1,a),v=ma(r+1,l+1,a);return m+(c-m)*f+(d+(v-d)*f-(m+(c-m)*f))*p}function Ca(i,e,t=7){let a=he(i,e,48,t)*14+he(i,e,17,t+1)*5+he(i,e,6,t+2)*1.5;return 8+Math.floor(a)}function ye(i){return i<11?ia.sabbia:i>24?ia.roccia:ia.erba}function Ne(i,e,t=7){let a=[];for(let o=0;o<2;o++){if(ma(i*3+o,e*5-o,t+9)<.35)continue;let r=i*16+Math.floor(ma(i,e,t+11+o)*15)+.5,l=e*16+Math.floor(ma(e,i,t+13+o)*15)+.5,u=Ca(Math.floor(r),Math.floor(l),t);ye(u)===ia.erba&&a.push({x:r,y:u+3,z:l})}return a}function qe(i,e,t,a){let o=0;for(let n of a){let l=15-Math.sqrt((i-n.x)**2+(e-n.y)**2+(t-n.z)**2);l>o&&(o=l)}return Math.max(0,Math.min(15,Math.round(o)))}function Fe(i,e,{seme:t=7,erba:a=2,raggioLampade:o=2}={}){let n=new ve(1600),r=i*16,l=e*16,u=255,s=0,f=[];for(let m=-o;m<=o;m++)for(let c=-o;c<=o;c++)f.push(...Ne(i+m,e+c,t));for(let m=0;m<16;m++)for(let c=0;c<16;c++){let d=r+m,v=l+c,h=Ca(d,v,t);h<u&&(u=h),h+1>s&&(s=h+1);let b=ye(h),x=.94+.12*ma(d,v,t+3),g=qe(d+.5,h+1,v+.5,f),M=de($a[b],x);n.quadDa([m,h+1,c,2,15,g,M],[m,h+1,c+1,2,15,g,M],[m+1,h+1,c+1,2,15,g,M],[m+1,h+1,c,2,15,g,M]);let L=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[S,R,A]of L){let _=Ca(d+S,v+R,t);for(let O=_+1;O<=h;O++){let C=Math.max(6,15-(h-O)*2),N=O===h&&b===ia.erba?ia.erba:h>24?ia.roccia:ia.terra,E=qe(d+.5+S*.5,O+.5,v+.5+R*.5,f),z=O,Y=O+1,q=de($a[N],x);S===1?n.quadDa([m+1,z,c,A,C,E,q],[m+1,Y,c,A,C,E,q],[m+1,Y,c+1,A,C,E,q],[m+1,z,c+1,A,C,E,q]):S===-1?n.quadDa([m,z,c+1,A,C,E,q],[m,Y,c+1,A,C,E,q],[m,Y,c,A,C,E,q],[m,z,c,A,C,E,q]):R===1?n.quadDa([m+1,z,c+1,A,C,E,q],[m+1,Y,c+1,A,C,E,q],[m,Y,c+1,A,C,E,q],[m,z,c+1,A,C,E,q]):n.quadDa([m,z,c,A,C,E,q],[m,Y,c,A,C,E,q],[m+1,Y,c,A,C,E,q],[m+1,z,c,A,C,E,q]),O<u&&(u=O)}}if(b===ia.erba)for(let S=0;S<a;S++){if(ma(d,v,t+20+S)<.25)continue;let A=1,_=m,O=c,C=de($a[ia.filo],.94+.12*ma(d,v,t+30+S));n.quadDa([_,h+1,O,2,15,g,C],[_,h+1+A,O,2,15,g,C,1],[_+1,h+1+A,O+1,2,15,g,C,1],[_+1,h+1,O+1,2,15,g,C]),n.quadDa([_+1,h+1,O,2,15,g,C],[_+1,h+1+A,O,2,15,g,C,1],[_,h+1+A,O+1,2,15,g,C,1],[_,h+1,O+1,2,15,g,C]),h+2>s&&(s=h+2)}}for(let m of Ne(i,e,t)){let c=Math.floor(m.x)-r,d=Math.floor(m.z)-l,v=m.y-3;for(let h=v+1;h<=m.y;h++){let b=h===m.y?ia.lampada:ia.tronco,x=h===m.y?15:12,g=$a[b],M=h===m.y?Go:0,L=c+.5-.15,S=c+.5+.15,R=Math.floor(L),A=Math.min(16,Math.floor(L)+1),_=d,O=d+1;n.quadDa([A,h,_,0,12,x,g,0,M],[A,h+1,_,0,12,x,g,0,M],[A,h+1,O,0,12,x,g,0,M],[A,h,O,0,12,x,g,0,M]),n.quadDa([R,h,O,1,12,x,g,0,M],[R,h+1,O,1,12,x,g,0,M],[R,h+1,_,1,12,x,g,0,M],[R,h,_,1,12,x,g,0,M]),n.quadDa([A,h,O,4,12,x,g,0,M],[A,h+1,O,4,12,x,g,0,M],[R,h+1,O,4,12,x,g,0,M],[R,h,O,4,12,x,g,0,M]),n.quadDa([R,h,_,5,12,x,g,0,M],[R,h+1,_,5,12,x,g,0,M],[A,h+1,_,5,12,x,g,0,M],[A,h,_,5,12,x,g,0,M]),h===m.y&&n.quadDa([R,h+1,_,2,15,x,g,0,M],[R,h+1,O,2,15,x,g,0,M],[A,h+1,O,2,15,x,g,0,M],[A,h+1,_,2,15,x,g,0,M]),h+1>s&&(s=h+1)}}return{...n.dati(),minY:u,maxY:s,cx:i,cz:e}}var Pe={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},De=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],Za={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};De.push(Za);var ko={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};De.push(ko);function Ue(i,e,t=Za){Pe[i]=e,t.blocchi.includes(i)||t.blocchi.push(i)}var Xo={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"};function W(i){return Pe[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||Xo}function we(i){let e=i.indexOf("~");return e<0?i:i.slice(0,e)}function Be(i){if(!i||!i.startsWith("acqua"))return null;let e=i.indexOf("~");return e<0?0:Number(i.slice(e+1))}var I=16,Yo=256,ja=2048,Ve=64,J=(i,e,t)=>((i+ja)*4096+(t+ja))*256+(e+Ve),Ia=i=>Math.floor(i/(256*4096))-ja,_a=i=>Math.floor(i/256)%4096-ja,Na=i=>i%256-Ve;var ga=(i,e)=>Math.floor(i/I)+","+Math.floor(e/I),Ka=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this.bagnate=new Map,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(e){this.generati.add(e)}_annotaModifica(e,t,a,o){if(!this.frontiera)return;let n=ga(e,a),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(J(e,t,a),o)}applicaModifiche(e){let t=this.modifiche.get(e);if(!t)return 0;for(let[a,o]of t){let n=Ia(a),r=Na(a),l=_a(a);o===null?this.togli(n,r,l,!0):this.metti(n,r,l,o,!0)}return t.size}scaricaChunk(e){let t=this.chunks.get(e);if(!t)return this.generati.delete(e),[];let a=[];for(let[o,n]of t){let r=W(n);r&&r.forma==="modello"&&a.push([Ia(o),Na(o),_a(o),n])}return this.contaBlocchi-=t.size,this.chunks.delete(e),this._scordaMemo(),this.generati.delete(e),this._tocca(e,this.sporchi),a}_cambiata(e,t,a){if(this.cambiate.length>=3*Yo){this.troppiCambi=!0;return}this.cambiate.push(e,t,a)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(e,t){let a=Math.floor(e/I),o=Math.floor(t/I);if(this._memoChunk!==null&&this._memoCx===a&&this._memoCz===o)return this._memoChunk;let n=this.chunks.get(a+","+o)||null;return this._memoCx=a,this._memoCz=o,this._memoChunk=n,n}tipo(e,t,a){let o=this._chunkDi(e,a);return o&&o.get(J(e,t,a))||null}pieno(e,t,a){return this.tipo(e,t,a)!==null}solido(e,t,a){let o=this.tipo(e,t,a);if(o&&W(o).solido)return!0;let n=this.furni.get(J(e,t,a));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(e,t,a){if(!this.solido(e,t-1,a)||this.solido(e,t,a)||this.solido(e,t+1,a))return!1;let o=this.tipo(e,t,a);return!(o&&W(o).acqua)}_sporca(e,t,a=this.sporchi){let o=(e%I+I)%I,n=(t%I+I)%I;this._tocca(ga(e,t),a),o===0&&this._tocca(ga(e-1,t),a),o===I-1&&this._tocca(ga(e+1,t),a),n===0&&this._tocca(ga(e,t-1),a),n===I-1&&this._tocca(ga(e,t+1),a)}_tocca(e,t){t.add(e),this._rev.set(e,(this._rev.get(e)||0)+1)}revisione(e){return this._rev.get(e)||0}metti(e,t,a,o,n=!1){let r=ga(e,a),l=this.chunks.get(r);l||(l=new Map,this.chunks.set(r,l),this._scordaMemo());let u=J(e,t,a),s=l.get(u);s===void 0&&this.contaBlocchi++,l.set(u,o);let f=o.charCodeAt(0)===97&&o.startsWith("acqua")&&(s===void 0||s.startsWith("acqua"));this._sporca(e,a,f?this.sporchiAcqua:this.sporchi),f||this._cambiata(e,t,a),n||(this._annotaModifica(e,t,a,o),this.onEvento&&this.onEvento({tipo:"metti",cella:[e,t,a],blocco:o}))}togli(e,t,a,o=!1){let n=ga(e,a),r=this.chunks.get(n);if(!r)return!1;let l=J(e,t,a),u=r.get(l);if(!r.delete(l))return!1;this.bagnate.delete(l),this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let s=!!(u&&u.startsWith("acqua"));return this._sporca(e,a,s?this.sporchiAcqua:this.sporchi),s||this._cambiata(e,t,a),o||(this._annotaModifica(e,t,a,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[e,t,a]})),!0}bagna(e,t,a,o=0){this.bagnate.set(J(e,t,a),Math.max(0,Math.min(15,o|0))),this._sporca(e,a,this.sporchiAcqua)}asciuga(e,t,a){return this.bagnate.delete(J(e,t,a))?(this._sporca(e,a,this.sporchiAcqua),!0):!1}bagnata(e,t,a){let o=this.bagnate.get(J(e,t,a));return o===void 0?null:o}occupaFurni(e,t){for(let[a,o,n]of e)this.furni.set(J(a,o,n),t)}liberaFurni(e){for(let[t,a,o]of e)this.furni.delete(J(t,a,o))}furniIn(e,t,a){return this.furni.get(J(e,t,a))||null}occupaOmbra(e,t=!1){for(let[a,o,n]of e){let r=J(a,o,n),l=this.ombreFurni.get(r);if(l){l.n++,t&&l.op++===0&&this._cambiata(a,o,n);continue}this.ombreFurni.set(r,{x:a,y:o,z:n,n:1,op:t?1:0}),this._cambiata(a,o,n)}}liberaOmbra(e,t=!1){for(let[a,o,n]of e){let r=J(a,o,n),l=this.ombreFurni.get(r);l&&(t&&l.op>0&&--l.op===0&&l.n>1&&this._cambiata(a,o,n),!(--l.n>0)&&(this.ombreFurni.delete(r),this._cambiata(a,o,n)))}}ombraFurniIn(e,t,a){let o=this.ombreFurni.get(J(e,t,a));return o?o.op>0?2:1:0}appoggioInColonna(e,t,a,o=8){for(let n=a;n>a-o;n--)if(this.calpestabile(e,n,t))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let e of this._rev.keys())this._rev.set(e,this._rev.get(e)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let e of this.chunks.values())for(let[t,a]of e)yield{x:Ia(t),y:Na(t),z:_a(t),tipo:a}}perOgni(e){for(let t of this.chunks.values())for(let[a,o]of t)e(Ia(a),Na(a),_a(a),o)}*blocchiDelChunk(e){let t=this.chunks.get(e);if(t)for(let[a,o]of t)yield{x:Ia(a),y:Na(a),z:_a(a),tipo:o}}perOgniDelChunk(e,t){let a=this.chunks.get(e);if(a)for(let[o,n]of a)t(Ia(o),Na(o),_a(o),n)}};var Ho={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},Da="primavera";var Wa=null;function Qa(i,e,t){let a=i>>16&255,o=i>>8&255,n=i&255,r=e>>16&255,l=e>>8&255,u=e&255,s=(f,p)=>Math.round(f+(p-f)*t);return s(a,r)<<16|s(o,l)<<8|s(n,u)}function Ge(i,e){if(Wa){let t=Da;Da=Wa.da;let a=ge(i,e);Da=Wa.a;let o=ge(i,e);Da=t;let n=Wa.mix;return{cima:Ja(a.cima,o.cima,n),lato:Ja(a.lato,o.lato,n),fondo:Ja(a.fondo,o.fondo,n),facce:a.facce,orlo:a.orlo!=null&&o.orlo!=null?Ja(a.orlo,o.orlo,n):a.orlo}}return ge(i,e)}function Ja(i,e,t){let a=Math.round((i>>16&255)+((e>>16&255)-(i>>16&255))*t),o=Math.round((i>>8&255)+((e>>8&255)-(i>>8&255))*t),n=Math.round((i&255)+((e&255)-(i&255))*t);return a<<16|o<<8|n}function ge(i,e){let t=W(i),a=Ho[Da],{cima:o,lato:n,fondo:r}=t;if(t.cappello&&a.erba&&!t.override&&(o=a.erba[be(e,a.erba.length)]),t.reagisce==="stagione"&&a.erba){let l=a.erba[be(e,a.erba.length)],u=t.reagisceForza??1;o=Qa(o,l,u),n=Qa(n,l,u*.45),r=Qa(r,l,u*.3)}else if(t.reagisce==="quota"){let l=be(e,8)/7,u=(t.reagisceForza??1)*.5,s=f=>Qa(f,16777215,l*u);o=s(o),n=s(n),r=s(r)}return i==="sabbia"&&a.sabbia&&({cima:o,lato:n,fondo:r}=a.sabbia),{cima:o,lato:n,fondo:r,facce:t.facce||null,orlo:t.orlo!=null?t.orlo:void 0}}function da(i,e,t){if(i.facce){let a=e*2+(t>0?0:1),o=i.facce[a];if(o!=null)return o}return e===1?t>0?i.cima:i.fondo:i.lato}function be(i,e=8){let t=(e-1)*2,a=(Math.round(i)%t+t)%t;return a>=e&&(a=t-a),a}function xe(i,e,t){let a=(i|0)*374761393+(e|0)*668265263+(t|0)*2147483647;return a=(a^a>>>13)*1274126177,a=a^a>>>16,(a>>>0)%1e3/1e3}function $o(i,e){let t=i>>16&255,a=i>>8&255,o=i&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+e))));return n(t)<<16|n(a)<<8|n(o)}function Zo(i,e,t,a,o,n){if(!e||e==="liscio"||!t)return i;let r=0;return e==="chiazze"?r=(xe(a,o,n)-.5)*2:e==="venature"?r=(xe(0,o,0)-.5)*2*.7+(xe(a,o,n)-.5)*.3:e==="sfumato"&&(r=(o%16+16)%16/16-.5),$o(i,r*t*.34)}function ke(i,e,t,a,o,n){if(!e||e==="liscio"||!t)return i;let r=l=>Zo(l,e,t,a,o,n);return{cima:r(i.cima),lato:r(i.lato),fondo:r(i.fondo),facce:i.facce?i.facce.map(r):null}}var Xe={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},jo=Object.keys(Xe);function Ye(i){return!i||!i.materia?null:Xe[i.materia]||null}function ba(i,e,t=0){if(!e)return i;let a=(i>>16&255)/255,o=(i>>8&255)/255,n=(i&255)/255,r=.2126*a+.7152*o+.0722*n,l=e.satura;a=r+(a-r)*l,o=r+(o-r)*l,n=r+(n-r)*l;let u=e.tinta*(1+t),s=f=>Math.max(0,Math.min(255,Math.round(f*u*255)));return s(a)<<16|s(o)<<8|s(n)}var Ko=16;function He(i){let e=jo.indexOf(i);return e<0||e+1>=Ko?0:e+1}var Ee=1/16,$e=8*Ee,na=9*Ee;function Ze(i,e,t,a,o,n,r,l){let u=(f,p,m)=>[e+f,t+p,a+m];i.quad(u(-l,r,-l),u(l,r,-l),u(l,r,l),u(-l,r,l),da(o,1,1),[0,1,0]),i.quad(u(-l,n,-l),u(l,n,-l),u(l,n,l),u(-l,n,l),da(o,1,-1),[0,-1,0]);let s=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let f of s){let[p,,m]=f.d,c=-m,d=p,v=(h,b)=>u(p*l+c*b,h,m*l+d*b);i.quad(v(n,-l),v(r,-l),v(r,l),v(n,l),da(o,f.asse,f.segno),f.d)}}function Wo(i,e,t,a,o){Ze(i,e,t,a,o,-na,0,$e)}function Qo(i,e,t,a,o){Ze(i,e,t,a,o,-na,na,5*Ee)}function Jo(i,e,t,a,o){let n=(s,f,p)=>[e+s,t+f,a+p],r=da(o,0,1),l=$e,u=[[[-l,-na,-l],[l,-na,l],[l,na,l],[-l,na,-l],[1,0,-1]],[[-l,-na,l],[l,-na,-l],[l,na,-l],[-l,na,l],[1,0,1]]];for(let[s,f,p,m,c]of u)i.quad(n(...s),n(...f),n(...p),n(...m),r,c),i.quad(n(...s),n(...f),n(...p),n(...m),r,[-c[0],-c[1],-c[2]])}function at(){}var je={lastra:Wo,pilastro:Qo,croce:Jo,modello:at},Ua=new Set(["lastra","pilastro","croce","modello"]);var wa=1/16,et=[[0,1],[0,2],[1,2]],ot=[[1,0],[-1,0],[0,1],[0,-1]];function xa(i,e,t,a,o,n,r,l,u){let s=[i,e,t];return s[a]+=o,s[n]+=r,s[l]+=u,s}var Ke={tinta:1,satura:1};function We(i,e,t,a,o,n,r=0){let l=8*wa,u=9*wa,s=(f,p)=>n(f===0?p:0,f===1?p:0,f===2?p:0);for(let f=0;f<3;f++)for(let p of[-1,1]){if(s(f,p))continue;let m=(f+1)%3,c=(f+2)%3,d=da(o,f,p),v=[0,0,0];v[f]=p,i.quad(xa(e,t,a,f,p*u,m,-l,c,-l),xa(e,t,a,f,p*u,m,+l,c,-l),xa(e,t,a,f,p*u,m,+l,c,+l),xa(e,t,a,f,p*u,m,-l,c,+l),d,v)}for(let[f,p]of et){let m=3-f-p;for(let c of[-1,1])for(let d of[-1,1]){if(s(f,c)||s(p,d))continue;let v=f===1&&c>0||p===1&&d>0,h=f===1&&c<0||p===1&&d<0,b=v?o.cima:h?o.fondo:o.lato,x=r?ba(b,Ke,r):b,g=[0,0,0];g[f]=c,g[p]=d,i.quad(xa(e,t,a,f,c*u,p,d*l,m,-l),xa(e,t,a,f,c*l,p,d*u,m,-l),xa(e,t,a,f,c*l,p,d*u,m,+l),xa(e,t,a,f,c*u,p,d*l,m,+l),x,g)}}for(let f of[-1,1])for(let p of[-1,1])for(let m of[-1,1])s(0,f)||s(1,p)||s(2,m)||i.tri([e+f*u,t+p*l,a+m*l],[e+f*l,t+p*u,a+m*l],[e+f*l,t+p*l,a+m*u],r?ba(p>0?o.cima:o.fondo,Ke,r):p>0?o.cima:o.fondo,[f,p,m])}function Qe(i,e,t,a,o,n){let r=(c,d)=>n(c,0,d),l=n(0,-1,0),u=o.cima,s=o.lato,f=o.fondo,p=o.orlo??o.cima,m=(c,d,v)=>[e+c*wa,t+d*wa,a+v*wa];l||i.quad(m(-8,-9,-8),m(8,-9,-8),m(8,-9,8),m(-8,-9,8),f,[0,-1,0]);for(let[c,d]of ot){if(r(c,d))continue;let v=-d,h=c,b=(g,M,L)=>m(g*c+L*v,M,g*d+L*h),x=[c,0,d];l||i.quad(b(8,-9,-8),b(9,-8,-8),b(9,-8,8),b(8,-9,8),f,[c,-1,d]),i.quad(b(9,-8,-8),b(9,2,-8),b(9,2,8),b(9,-8,8),s,x),i.quad(b(9,2,-8),b(10,3,-8),b(10,3,8),b(9,2,8),p,x),i.quad(b(10,3,-8),b(10,7,-8),b(10,7,8),b(10,3,8),p,x),i.quad(b(10,7,-8),b(9,8,-8),b(9,8,8),b(10,7,8),u,[c,1,d]),i.quad(b(8,8,-8),b(9,8,-8),b(9,8,8),b(8,8,8),u,[0,1,0])}for(let c of[-1,1])for(let d of[-1,1]){if(r(c,0)||r(0,d))continue;let v=(b,x,g)=>m(b*c,x,g*d),h=[c,0,d];l||i.tri(v(9,-8,8),v(8,-9,8),v(8,-8,9),f,[c,-1,d]),i.quad(v(9,-8,8),v(8,-8,9),v(8,2,9),v(9,2,8),s,h),i.quad(v(9,2,8),v(8,2,9),v(8,3,10),v(10,3,8),p,h),i.quad(v(10,3,8),v(8,3,10),v(8,7,10),v(10,7,8),p,h),i.quad(v(10,7,8),v(8,7,10),v(8,8,9),v(9,8,8),u,[c,1,d]),i.tri(v(8,8,8),v(9,8,8),v(8,8,9),u,[0,1,0])}i.quad(m(-8,8,-8),m(8,8,-8),m(8,8,8),m(-8,8,8),u,[0,1,0])}var tt=2,Ae=6,it=256;function Je(i){if(!i)return!1;let e=W(i);return!e.acqua&&!e.vetro&&!Ua.has(e.forma)}function eo(i,e,t,a){let o=e.indexOf(","),n=+e.slice(0,o),r=+e.slice(o+1),l=n*I-Ae,u=r*I-Ae,s=I+2*Ae,f=a-t+1,p=s,m=s*f*p,c=new Uint8Array(m),d=new Uint8Array(m),v=new Uint8Array(m),h=(L,S,R)=>((L-l)*f+(S-t))*p+(R-u),b=(L,S,R)=>L>=l&&L<l+s&&S>=t&&S<=a&&R>=u&&R<u+p,x=[];for(let L=l;L<l+s;L++)for(let S=u;S<u+p;S++){let R=!1;for(let A=a;A>=t;A--){let _=i.tipo(L,A,S),O=h(L,A,S);if(Je(_)){v[O]=1,R=!0;continue}if(!R&&A===a){for(let C=a+1;C<it&&C<a+40;C++)if(Je(i.tipo(L,C,S))){R=!0;break}}if(R||(c[O]=15),_){let C=W(_);C.luce&&x.push([L,A+Math.round(C.luce.quota??0),S])}}}let g=[];for(let L=0;L<m;L++)c[L]===15&&g.push(L);ao(g,c,v,s,f,p,1);let M=[];for(let[L,S,R]of x){if(!b(L,S,R))continue;let A=h(L,S,R);d[A]=15,M.push(A)}return ao(M,d,v,s,f,p,tt),{x0:l,z0:u,yMin:t,yMax:a,W:s,H:f,D:p,cielo:c,blocco:d,leggi(L,S,R){if(!b(L,S,R))return S>a?[15,0]:[0,0];let A=h(L,S,R);return[c[A],d[A]]}}}function ao(i,e,t,a,o,n,r){let l=[o*n,-o*n,n,-n,1,-1],u=0;for(;u<i.length;){let s=i[u++],f=e[s]-r;if(f<=0)continue;let p=Math.floor(s/(o*n)),m=Math.floor(s/n)%o,c=s%n;for(let d=0;d<6;d++){if(d===0&&p===a-1||d===1&&p===0||d===2&&m===o-1||d===3&&m===0||d===4&&c===n-1||d===5&&c===0)continue;let v=s+l[d];t[v]||e[v]>=f||(e[v]=f,i.push(v))}}}var oo=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function pa(i,e,t){let a=i*374761393+e*668265263+t*1442695041|0;return a=Math.imul(a^a>>>13,1274126177),((a^a>>>16)>>>0)/4294967296}var ae=class{constructor(e,t=512){this.yBase=e,this.byte=new Uint8Array(t*12),this.n=0}_lamella(e,t,a,o,n,r,l,u,s,f=0,p=8){if((this.n+1)*12>this.byte.length){let d=new Uint8Array(this.byte.length*2);d.set(this.byte),this.byte=d}let m=this.n*12,c=this.byte;c[m]=e,c[m+1]=t,c[m+2]=a,c[m+3]=o,c[m+4]=n>>16&255,c[m+5]=n>>8&255,c[m+6]=n&255,c[m+7]=(r&15)<<2,c[m+8]=Math.max(1,Math.min(255,l)),c[m+9]=Math.max(1,Math.min(255,u)),c[m+10]=Math.max(0,Math.min(255,s+128)),c[m+11]=f&15|(p&15)<<4,this.n++}ciuffo(e,t,a,o,n,r,l,u=1,s=0){let f=oo[Math.floor(pa(e,a,3)*oo.length)],p=Math.max(1,Math.round(f.n*u*(.82+.36*pa(e,a,5)))),m=t+1-this.yBase;if(m<0||m*8>247)return 0;for(let c=0;c<p;c++){let d=pa(e,a,c*17+5),v=pa(e,a,c*17+11),h=pa(e,a,c*17+41),b=pa(e,a,c*17+59),x=Math.min(.98,.66+f.apri),g=e+.5+(d-.5)*x,M=a+.5+(v-.5)*x,L=Math.min(.8,f.alto*(.62+.8*pa(e,a,c*17+71))*(.5+.6*Math.pow(h,1.5))),S=f.largo*(.8+.4*b),R=(pa(e,a,c*17+83)-.5)*.5,A=pa(e,a,c*17+89),_=A<.15?.9+.03*A:A>.85?1.07+.03*(A-.85):.97+.06*(A-.15)/.7,O=Math.max(0,Math.min(128,Math.round((g-o)*8))),C=Math.max(0,Math.min(128,Math.round((M-n)*8))),N=Math.floor(pa(e,a,c*17+97)*255);this._lamella(O,C,Math.round(m*8),N,r,l,Math.round(L*64),Math.round(S*128),Math.round(R*128),s,Math.round((_-.9)/.2*15))}return p}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var Ea=64,nt=[[1,0,0,K(1,0,0),0,1],[-1,0,0,K(-1,0,0),0,-1],[0,1,0,K(0,1,0),1,1],[0,-1,0,K(0,-1,0),1,-1],[0,0,1,K(0,0,1),2,1],[0,0,-1,K(0,0,-1),2,-1]],to=(i,e,t)=>((e+1)*3+(t+1))*3+(i+1),Te=class{constructor(e,t,a,o,n){this.c=e,this.ox=t,this.oz=a,this._materia=0,this.luceDi=o,this.aria=n,this._cielo=15,this._cella=null}materia(e){this._materia=e|0}cella(e,t,a){this._cella=[e,t,a]}_cieloFaccia(e){let[t,a,o]=this._cella,n=-1;for(let r=0;r<3;r++){if(!e[r])continue;let l=this.luceDi(t+(r===0?e[0]:0),a+(r===1?e[1]:0),o+(r===2?e[2]:0))[0];l>n&&(n=l)}return n<0?this.luceDi(t,a+1,o)[0]:n}_bloccoVertice(e,t){let a=Math.hypot(t[0],t[1],t[2])||1,o=e[0]+t[0]/a*.5,n=e[1]+t[1]/a*.5,r=e[2]+t[2]/a*.5,l=0,u=0;for(let s of[-.45,.45])for(let f of[-.45,.45])for(let p of[-.45,.45]){let m=Math.floor(o+s),c=Math.floor(n+f),d=Math.floor(r+p);this.aria(m,c,d)&&(l+=this.luceDi(m,c,d)[1],u++)}return u?Math.round(l/u):0}_v(e,t,a,o){return[e[0]-this.ox,e[1]+Ea,e[2]-this.oz,t,this._cielo,this._bloccoVertice(e,o),a,0,this._materia]}_giro(e,t,a,o){let n=t[0]-e[0],r=t[1]-e[1],l=t[2]-e[2],u=a[0]-e[0],s=a[1]-e[1],f=a[2]-e[2],p=r*f-l*s,m=l*u-n*f,c=n*s-r*u;return p*o[0]+m*o[1]+c*o[2]<0}tri(e,t,a,o,n){if(this._giro(e,t,a,n)){let l=t;t=a,a=l}let r=K(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(e,r,o,n),this._v(t,r,o,n),this._v(a,r,o,n),this._v(a,r,o,n))}quad(e,t,a,o,n,r){let l=K(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(e,t,a,r)){let u=t;t=o,o=u}this.c.quadDa(this._v(e,l,n,r),this._v(t,l,n,r),this._v(a,l,n,r),this._v(o,l,n,r))}};function ee(i){if(!i)return!1;let e=W(i);return!e.acqua&&!e.vetro&&!Ua.has(e.forma)}function io(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function no(i,e,{erba:t=2,luce:a=!0}={}){let o=e.indexOf(","),n=+e.slice(0,o),r=+e.slice(o+1),l=n*I,u=r*I,s=new za(1024),f=new za(64),p=-1/0,m=new Int16Array(I*I).fill(-1),c=new Int16Array(I*I).fill(-1),d=new Int16Array(I*I).fill(-1),v=[],h=255,b=0,x=1/0,g=-1/0;i.perOgniDelChunk(e,(N,E)=>{E<x&&(x=E),E>g&&(g=E)});let M=a&&x<=g?eo(i,e,x-2,g+3):null,L=new ae(Number.isFinite(x)?x:0),S=(N,E,z)=>M?M.leggi(N,E,z):[15,0],R=new Te(s,l,u,S,(N,E,z)=>!ee(i.tipo(N,E,z))),A=new Uint8Array(27),_=(N,E,z,Y,q,Aa,Ta,ta)=>[N-l,E+Ea,z-u,Y,Aa,Ta,q,ta?1:0,0],O=(N,E,z)=>io(i.tipo(N,E,z))||(i.bagnate?i.bagnata(N,E,z)!==null:!1);return i.perOgniDelChunk(e,(N,E,z,Y)=>{let q=W(Y),Aa=i.bagnate?i.bagnata(N,E,z):null;if(q.forma==="modello"&&q.modello==="albero")for(let F=-2;F<=2;F++)for(let U=-2;U<=2;U++){let B=F*F+U*U;if(B>4)continue;let k=N+F-l,la=z+U-u;if(k<0||k>=I||la<0||la>=I)continue;let Z=k*I+la,G=E+(B===0?4:B<=2?3:2);G>m[Z]&&(m[Z]=G)}if(q.forma==="modello"){let F=N-l,U=z-u;if(F>=0&&F<I&&U>=0&&U<I){let B=F*I+U,k=E+Math.max(1,Math.round(q.altezza||1));k>d[B]&&(d[B]=k)}}if(q.luce&&v.push([N,E,z,Y]),Ua.has(q.forma)&&Aa===null)return;let Ta=io(Y)||Aa!==null,ta=E+Ea;if(ta<0||ta>254)return;let Ba=(N-l)*I+(z-u);!Ta&&E>m[Ba]&&(m[Ba]=E),!Ta&&ee(Y)&&E>c[Ba]&&(c[Ba]=E);let $=Ge(Aa!==null?"acqua":we(Y),E);q.motivo&&($=ke($,q.motivo,q.motivoForza??1,N,E,z));let va=Ye(q);va&&($={...$,cima:ba($.cima,va),lato:ba($.lato,va),fondo:ba($.fondo,va)},$.facce&&($.facce=$.facce.map(F=>F==null?F:ba(F,va))));let Ro=va?He(q.materia):0;if(!Ta){A.fill(0);for(let Z=-1;Z<=1;Z++)for(let G=-1;G<=1;G++)for(let j=-1;j<=1;j++)j===0&&Z===0&&G===0||ee(i.tipo(N+j,E+Z,z+G))&&(A[to(j,Z,G)]=1);let F=(Z,G,j)=>A[to(Z,G,j)]===1;R.materia(Ro),R.cella(N,E,z);let U=N+.5,B=E+.5,k=z+.5,la=q.forma&&je[q.forma];la?la(R,U,B,k,$,()=>!1):q.cappello&&!F(0,1,0)?Qe(R,U,B,k,$,F):We(R,U,B,k,$,(G,j,P)=>F(G,j,P)?j!==0?!0:!W(i.tipo(N+G,E,z+P)).cappello||F(G,1,P):!1,va?va.orlo:0),ta-1<h&&(h=ta-1),ta+2>b&&(b=ta+2)}let Va=0,Oa=0;if(Ta)for(Oa=Math.max(0,Math.min(15,Aa!==null?Aa:Be(Y)||0));Va<15&&O(N,E-1-Va,z);)Va++;let Lo=(F,U)=>{if(!O(F,E,U))return-1;let B=0;for(;B<15&&O(F,E-1-B,U);)B++;return B},Ga=(F,U)=>{let B=0,k=0;for(let la of[F-1,F])for(let Z of[U-1,U]){let G=Lo(la,Z);G>=0&&(B+=G,k++)}return k?Math.round(B/k):Va};if(Ta)for(let[F,U,B,k,la,Z]of nt){let G=i.tipo(N+F,E+U,z+B);if(O(N+F,E+U,z+B)||G&&ee(G))continue;let j=da($,la,Z),P=N,D=E,w=z,sa,ca,ua,fa;if(F===1?(sa=[P+1,D,w],ca=[P+1,D+1,w],ua=[P+1,D+1,w+1],fa=[P+1,D,w+1]):F===-1?(sa=[P,D,w+1],ca=[P,D+1,w+1],ua=[P,D+1,w],fa=[P,D,w]):U===1?(sa=[P,D+1,w],ca=[P,D+1,w+1],ua=[P+1,D+1,w+1],fa=[P+1,D+1,w]):U===-1?(sa=[P,D,w+1],ca=[P,D,w],ua=[P+1,D,w],fa=[P+1,D,w+1]):B===1?(sa=[P+1,D,w+1],ca=[P+1,D+1,w+1],ua=[P,D+1,w+1],fa=[P,D,w+1]):(sa=[P,D,w],ca=[P,D+1,w],ua=[P+1,D+1,w],fa=[P+1,D,w]),U===1){let Re=E+(15-2*Oa)/16;Re>p&&(p=Re)}f.quadDa(_(...sa,k,j,Ga(sa[0],sa[2]),Oa,sa[1]===D+1),_(...ca,k,j,Ga(ca[0],ca[2]),Oa,ca[1]===D+1),_(...ua,k,j,Ga(ua[0],ua[2]),Oa,ua[1]===D+1),_(...fa,k,j,Ga(fa[0],fa[2]),Oa,fa[1]===D+1)),ta<h&&(h=ta),ta+1>b&&(b=ta+1)}if(q.cappello&&t>0&&!i.tipo(N,E+1,z)){let[F,U]=S(N,E+1,z);L.ciuffo(N,E,z,l,u,$.cima,F,t/2,U),E+2+Ea>b&&(b=E+2+Ea)}}),h>b&&(h=0,b=0),{...s.dati(),minY:h,maxY:b,y0:-Ea,cx:n,cz:r,altezze:m,solide:c,impronte:d,luci:v,acqua:{...f.dati(),pelo:p===-1/0?null:p},erba:L.dati()}}function ro(i,e,t,a,o){let n=(a-e+1)*I,r=(o-t+1)*I,l=new Uint8Array(n*r);for(let u of i){if(!u.altezze)continue;let s=(u.cx-e)*I,f=(u.cz-t)*I;for(let p=0;p<I;p++)for(let m=0;m<I;m++){let c=u.altezze[p*I+m];l[(f+m)*n+(s+p)]=c<0?0:Math.max(0,Math.min(255,c+1))}}return{byte:l,x0:e*I,z0:t*I,larghezza:n,profondita:r}}function Ra(i,e,t){let a=i*374761393+e*668265263+t*1442695041|0;return a=Math.imul(a^a>>>13,1274126177),((a^a>>>16)>>>0)/4294967296}function lo(i){return i*i*(3-2*i)}function ze(i,e,t){let a=Math.floor(i),o=Math.floor(e),n=lo(i-a),r=lo(e-o),l=Ra(a,o,t),u=Ra(a+1,o,t),s=Ra(a,o+1,t),f=Ra(a+1,o+1,t);return l+(u-l)*n+(s-l)*r+(l-u-s+f)*n*r}var qa=5;function so(i,e=1,t=64){i.svuota();let a=[],o=[],n=new Map,r=[];for(let f=-t;f<=t;f++)for(let p=-t;p<=t;p++){let m=.55*ze(f*.028,p*.028,e)+.3*ze(f*.07,p*.07,e+11)+.15*ze(f*.16,p*.16,e+29),c=Math.max(2,1+Math.round(Math.pow(Math.max(0,m),1.6)*22)),d=Math.max(Math.abs(f),Math.abs(p)),v=Math.min(1,Math.max(0,(t-2-d)/8)),h=v*v*(3-2*v);c=Math.round(c*h+(qa+1)*(1-h));let b=c<=qa+1;n.set(f+"|"+p,c);for(let x=0;x<c;x++){let M=x===c-1?b?"sabbia":"erba":x<c-3?"roccia":"terra";i.metti(f,x,p,M,!0)}if(c<=qa)for(let x=c;x<=qa;x++)i.metti(f,x,p,"acqua",!0);else if(!b){let x=Ra(f*3+1,p*3+7,e+101);if(x>.988&&a.length<90?a.push([f,c,p]):x<.004&&o.length<14&&o.push([f,c,p]),c>=qa+6){let g=Ra(f*5+3,p*5+11,e+57);g>.99&&r.push({x:f,z:p,h:c,r:g})}}}let l=lt(i,n,e,r,t),u=f=>!l.has(f[0]+"|"+f[2]),s=[...l].map(f=>{let[p,m]=f.split("|").map(Number);return[p,n.get(f)-2,m]});return{alberi:a.filter(u),lampioni:o.filter(u),fiume:s}}var rt=[[1,0],[-1,0],[0,1],[0,-1]];function lt(i,e,t,a,o=64){let n=new Set;a.sort((u,s)=>s.h-u.h||u.r-s.r);let r=[];for(let u of a){if(r.length>=5)break;r.every(s=>(s.x-u.x)**2+(s.z-u.z)**2>=784)&&r.push(u)}let l=(u,s)=>{let f=u+"|"+s;if(n.has(f))return;let p=e.get(f);i.togli(u,p-1,s,!0),i.togli(u,p-2,s,!0),i.metti(u,p-2,s,"acqua",!0),n.add(f)};for(let u of r){let s=u.x,f=u.z,p=null,m=0,c=new Set([s+"|"+f]);for(let d=0;d<500;d++){let v=e.get(s+"|"+f);if(l(s,f),p){let g=s+p[1],M=f-p[0];e.get(g+"|"+M)===v&&l(g,M)}let h=null,b=1/0,x=1/0;for(let g of rt){let M=s+g[0],L=f+g[1];if(c.has(M+"|"+L))continue;let S=e.get(M+"|"+L);if(S===void 0)continue;let R=(g===p?-.5:0)+Ra(M*7+5,L*7+13,t+71);(S<b||S===b&&R<x)&&(h=g,b=S,x=R)}if(!h||b>v||(m=b===v?m+1:0,m>24)||(s+=h[0],f+=h[1],c.add(s+"|"+f),p=h,e.get(s+"|"+f)<=qa)||Math.max(Math.abs(s),Math.abs(f))>=o-6)break}}for(let u of n){let[s,f]=u.split("|").map(Number),p=e.get(u);for(let m=-1;m<=1;m++)for(let c=-1;c<=1;c++){if(!m&&!c)continue;let d=s+m+"|"+(f+c);if(n.has(d))continue;let v=e.get(d);v===void 0||v<p||v>p+1||i.tipo(s+m,v-1,f+c)==="erba"&&(i.togli(s+m,v-1,f+c,!0),i.metti(s+m,v-1,f+c,"sabbia",!0))}}return n}var st={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,pozza:16762994,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function co(){for(let[i,e]of Object.entries(st))Ue(i,{nome:e.nome,cima:e.cima,lato:e.lato,fondo:e.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:e.modello,altezza:e.altezza,mezza:e.mezza,luce:e.luce},Za)}function uo(i){let e=new DataView(i);if(String.fromCharCode(e.getUint8(0),e.getUint8(1),e.getUint8(2),e.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let t=e.getUint32(4,!0),a=t*3,o=new Uint8Array(i,8,a*16),n=new Uint8Array(i,8+a*16,a*4),r=new Uint8Array(a*20);for(let p=0;p<a;p++)r.set(o.subarray(p*16,p*16+16),p*20),r.set(n.subarray(p*4,p*4+4),p*20+16);let l=1/0,u=-1/0,s=0,f=new DataView(r.buffer);for(let p=0;p<a;p++){let m=f.getFloat32(p*20,!0),c=f.getFloat32(p*20+4,!0),d=f.getFloat32(p*20+8,!0);l=Math.min(l,c),u=Math.max(u,c),s=Math.max(s,Math.hypot(m,d))}return{byte:r,vertici:a,triangoli:t,minY:l,maxY:u,raggio:s}}var ct=`#version 300 es
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
}`,ut=`#version 300 es
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
}`;function ft(i,e=4){if(e===8)return i instanceof Float32Array?i:new Float32Array(i);let t=i.length/4,a=new Float32Array(t*8);for(let o=0;o<t;o++)a.set([i[o*4],i[o*4+1],i[o*4+2],i[o*4+3],1,1,1,0],o*8);return a}var mt=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,pt=`#version 300 es
precision mediump float;
void main() {}`,oe=class{constructor(e){this.gl=e,this.programma=ea(e,ct,ut),this.u={};for(let t of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[t]=e.getUniformLocation(this.programma,t);this.programmaOmbra=ea(e,mt,pt),this.uoVP=e.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(e,t){let a=this.gl,o={vao:a.createVertexArray(),vbo:a.createBuffer(),ibo:a.createBuffer(),vertici:t.vertici,triangoli:t.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:t.raggio,maxY:t.maxY};return a.bindVertexArray(o.vao),a.bindBuffer(a.ARRAY_BUFFER,o.vbo),a.bufferData(a.ARRAY_BUFFER,t.byte,a.STATIC_DRAW),a.enableVertexAttribArray(0),a.vertexAttribPointer(0,3,a.FLOAT,!1,20,0),a.enableVertexAttribArray(1),a.vertexAttribPointer(1,3,a.BYTE,!0,20,12),a.enableVertexAttribArray(4),a.vertexAttribIPointer(4,1,a.UNSIGNED_BYTE,20,15),a.enableVertexAttribArray(2),a.vertexAttribPointer(2,4,a.UNSIGNED_BYTE,!0,20,16),a.bindBuffer(a.ARRAY_BUFFER,o.ibo),a.enableVertexAttribArray(3),a.vertexAttribPointer(3,4,a.FLOAT,!1,32,0),a.vertexAttribDivisor(3,1),a.enableVertexAttribArray(5),a.vertexAttribPointer(5,4,a.FLOAT,!1,32,16),a.vertexAttribDivisor(5,1),a.bindVertexArray(null),this.tipi.set(e,o),o}istanze(e,t,a=4){let o=this.tipi.get(e);o&&(o.istanze=ft(t,a),o.n=o.istanze.length/8,o.sporco=!0,this.dinamici.has(e)||(this.mappaSporca=!0))}disegnaOmbra(e,t){let a=this.gl;a.useProgram(this.programmaOmbra),a.uniformMatrix4fv(this.uoVP,!1,e);let o=0,n=0;for(let[r,l]of this.tipi)l.n===0||this.dinamici.has(r)!==t||(a.bindVertexArray(l.vao),l.sporco&&(a.bindBuffer(a.ARRAY_BUFFER,l.ibo),a.bufferData(a.ARRAY_BUFFER,l.istanze,a.DYNAMIC_DRAW),l.sporco=!1),a.drawArraysInstanced(a.TRIANGLES,0,l.vertici,l.n),o++,n+=l.triangoli*l.n);return a.bindVertexArray(null),[o,n]}disegna(e,t){let a=this.gl,o=this.u,n=e.sole;a.useProgram(this.programma),a.uniformMatrix4fv(o.uVP,!1,e.vpCorrente||e.vp),a.uniform1f(o.uTaglio,e.taglio??-1e9);let r=e.vpCorrente===e.vpSpecchio?[0,0,0,0]:e.buco||[0,0,0,0];a.uniform3f(o.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),a.uniform1f(o.uTempo,e.tempo),a.uniform3f(o.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),a.uniform3f(o.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),a.uniform1f(o.uSoleForza,n.forza),a.uniform3f(o.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),a.uniform4fv(o.uMaterie,e.materie),a.uniform2f(o.uNebbia,e.nebbia.da,e.nebbia.a),a.uniform3f(o.uNebbiaCol,e.nebbia.colore[0],e.nebbia.colore[1],e.nebbia.colore[2]),a.uniform3f(o.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),a.uniform1f(o.uOmbra,e.ombra&&e.altezze?1:0),e.altezze&&(a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,e.ombre.tex),a.uniform1i(o.uOmbre,0),a.uniform2f(o.uOmbreScala,e.ombre.scala,e.ombre.offset),a.uniform4f(o.uAltRett,e.altRett[0],e.altRett[1],e.altRett[2],e.altRett[3])),e.legaMappa(o);let l=0,u=0,s=0;a.uniform1f(o.uSagoma,0);for(let[p,m]of this.tipi)m.n!==0&&(a.uniform4f(o.uBuco,r[0],r[1],r[2],p==="omino"?0:r[3]),a.bindVertexArray(m.vao),m.sporco&&(a.bindBuffer(a.ARRAY_BUFFER,m.ibo),a.bufferData(a.ARRAY_BUFFER,m.istanze,a.DYNAMIC_DRAW),m.sporco=!1),a.drawArraysInstanced(a.TRIANGLES,0,m.vertici,m.n),l++,u+=m.triangoli*m.n,s+=m.n);let f=this.sagoma&&this.tipi.get(this.sagoma);f&&f.n>0&&e.vpCorrente!==e.vpSpecchio&&(a.uniform1f(o.uSagoma,1),a.depthFunc(a.GREATER),a.depthMask(!1),a.enable(a.BLEND),a.blendFunc(a.ONE,a.ONE_MINUS_SRC_ALPHA),a.bindVertexArray(f.vao),a.drawArraysInstanced(a.TRIANGLES,0,f.vertici,f.n),a.disable(a.BLEND),a.depthMask(!0),a.depthFunc(a.LESS),a.uniform1f(o.uSagoma,0),l++),a.bindVertexArray(null),this.statistiche.disegni=l,this.statistiche.triangoli=u,this.statistiche.istanze=s}};function fo(i={}){let e=(t,a=1)=>typeof t=="number"&&isFinite(t)?+t.toFixed(a):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:e(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?e(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:e(i.fps,0),p50ms:e(i.p50,2),p99ms:e(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:e(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(t=>Math.round(t)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[]},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:e(i.worldgenMs,0),meshMs:e(i.meshMs,0)},errori:(i.errori||[]).slice(-12).map(t=>String(t).slice(0,500)),scatto:i.scatto||null,firma:"leafy-shadows/1",allegati:i.allegati&&typeof i.allegati=="object"?i.allegati:null}}function mo(i){return Math.round(JSON.stringify(i).length/1024)}var dt="https://ntfy.sh",ht="leafy-shadows-ebdbbfaf5376beedb3";async function po(i){let e=await fetch(`${dt}/${ht}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:i});if(!e.ok)return{ok:!1,dice:`il servizio ha detto no: ${e.status}`};let t=await e.json().catch(()=>({})),a=i.length>4096;return{ok:!0,id:t.id||"",dice:a?`mandato \u2714 (${Math.round(i.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(i.length/1024)} KB, dura 12 ore)`}}var vt=`
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
`,te=class{constructor(e,t){this.leggi=e,this.scatta=t,this.errori=[],addEventListener("error",o=>this._errore(o.error||o.message)),addEventListener("unhandledrejection",o=>this._errore(o.reason));let a=document.createElement("style");a.textContent=vt,document.head.appendChild(a),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(e){let t=e&&e.stack?e.stack:String(e);this.errori.push(t),this.errori.length>40&&this.errori.shift()}allega(e,t){this.allegati||(this.allegati={}),this.allegati[e]=t}apri(){let e=this.pannello;e.classList.add("aperto"),e.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,e.querySelector("#diagChiudi").onclick=()=>e.classList.remove("aperto"),e.querySelector("#diagCopia").onclick=()=>this.vai(!0),e.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let t=e.querySelector("#diagNota");t&&t.focus()},30)}_dice(e){let t=this.pannello.querySelector("#diagEsito");t&&(t.textContent=e)}async vai(e){let t=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let a=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,o=null;if(a)try{o=this.scatta?await this.scatta():null}catch(s){this._errore(s)}let n=fo({...this.leggi(),quando:new Date().toISOString(),nota:t,errori:this.errori,scatto:o,allegati:this.allegati||null}),r=mo(n),l=JSON.stringify(n,null,1);if(e){await this._negliAppunti(l),this.nodo.classList.remove("corso");return}let u=!1;try{let s=await fetch("/_diagnostica",{method:"GET"});u=s.ok&&(await s.json().catch(()=>({}))).collettore===!0}catch{u=!1}if(u)try{let s=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json"},body:l});if(!s.ok)this._dice("il collettore ha detto no: "+s.status);else{let f=await s.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${f.nome||""}  (${r} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}try{let s=await po(l);this._dice(s.ok?s.dice+`
(fuori casa: passa dal cloud)`:s.dice),s.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(l,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(e,t=""){try{await navigator.clipboard.writeText(e),this._dice(t+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let a=new Blob([e],{type:"application/json"}),o=document.createElement("a");o.href=URL.createObjectURL(a),o.download="leafy-diagnostica.json",o.click(),setTimeout(()=>URL.revokeObjectURL(o.href),4e3),this._dice(t+`scaricato come file \u2714
mandami quello.`)}}};var X=document.getElementById("tela"),gt=document.getElementById("stato"),bt=document.getElementById("fps"),aa=new URLSearchParams(location.search),y={raggio:+(aa.get("raggio")||5),erba:+(aa.get("erba")??8),ombra:aa.get("ombra")!=="no",specchio:aa.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(aa.get("specchio")??.5)||.5)),dprMax:+(aa.get("dpr")||1.5),rampa:aa.has("rampa"),tutto:aa.has("tutto"),mondo:aa.has("finto")||aa.has("rampa")?0:Math.max(16,Math.min(400,+(aa.get("mondo")||48))),ora:aa.has("ora")?Math.max(0,Math.min(1,+aa.get("ora"))):null},{gl:Fa,dpr:xt,ridimensiona:Et}=Le(X,{antialias:!0,dprMax:y.dprMax}),T=new Ha(Fa),oa=new oe(Fa);T.ombra=y.ombra;T.specchio.attivo=y.specchio>0;T.specchio.scala=y.specchio||.5;T.specchio.mostra=aa.has("vedi");var se=0,Sa=0;function bo(i,e){let t=performance.now();for(let n of[...T.chunks.keys()])T.rimuovi(n);se=0;for(let n=-i;n<i;n++)for(let r=-i;r<i;r++)T.carica(n+","+r,Fe(n,r,{erba:e})),se+=256;let a=i*2*16,o=new Uint8Array(a*a);for(let n=0;n<a;n++)for(let r=0;r<a;r++)o[n*a+r]=Ca(r-i*16,n-i*16)+1;T.impostaAltezze(o,-i*16,-i*16,a,a),Sa=performance.now()-t}var ra=null,xo=0,Eo=0;function At(i,e){let t=performance.now();for(let m of[...T.chunks.keys()])T.rimuovi(m);co(),ra=new Ka;let{alberi:a,lampioni:o}=so(ra,4242,i);for(let[m,c,d]of a)ra.metti(m,c,d,"albero",!0);for(let[m,c,d]of o)ra.metti(m,c,d,"lampione",!0);let n=performance.now()-t,r=[],l=1e9,u=1e9,s=-1e9,f=-1e9;for(let m of ra.chunks.keys()){let c=no(ra,m,{erba:e});T.carica(m,c),r.push(c),l=Math.min(l,c.cx),s=Math.max(s,c.cx),u=Math.min(u,c.cz),f=Math.max(f,c.cz)}let p=ro(r,l,u,s,f);return T.impostaAltezze(p.byte,p.x0,p.z0,p.larghezza,p.profondita),se=xo=ra.contaBlocchi,Eo=r.length,Sa=performance.now()-t,{tGen:n,tMesh:Sa-n}}var Me=null;y.mondo?Me=At(y.mondo,y.erba):bo(y.raggio,y.erba);async function Tt(){if(!ra)return;let i=new Map;ra.perOgni((e,t,a,o)=>{let n=W(o);n.forma!=="modello"||!n.modello||(i.has(n.modello)||i.set(n.modello,[]),i.get(n.modello).push(e+.5,t,a+.5,1))});for(let[e,t]of i)try{let a=await fetch(`./modelli/nucleo/${e}.bin`);if(!a.ok)throw new Error(`${a.status}`);oa.registra(e,uo(await a.arrayBuffer())),oa.istanze(e,t)}catch(a){console.warn(`modello ${e}: ${a.message}`)}}Tt();T.tutto=y.tutto;var zt=()=>{if(!ra)return Ca(0,0)+2;for(let i=120;i>-Ea;i--)if(ra.tipo(0,i,0))return i+2;return 8},V={alpha:-.8,beta:1.05,raggio:46,centro:[0,zt(),0],fov:.9};function Ao(){let i=Math.sin(V.beta),e=Math.cos(V.beta);return[V.centro[0]+V.raggio*i*Math.cos(V.alpha),V.centro[1]+V.raggio*e,V.centro[2]+V.raggio*i*Math.sin(V.alpha)]}var ya=null,ie=0;X.addEventListener("pointerdown",i=>{ya={x:i.clientX,y:i.clientY},X.setPointerCapture(i.pointerId)});X.addEventListener("pointermove",i=>{ya&&(V.alpha+=(i.clientX-ya.x)*.006,V.beta=Math.max(.15,Math.min(1.5,V.beta-(i.clientY-ya.y)*.006)),ya={x:i.clientX,y:i.clientY})});X.addEventListener("pointerup",()=>{ya=null});X.addEventListener("wheel",i=>{V.raggio=Math.max(8,Math.min(140,V.raggio*(i.deltaY>0?1.1:.9))),i.preventDefault()},{passive:!1});X.addEventListener("touchstart",i=>{i.touches.length===2&&(ie=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY))},{passive:!0});X.addEventListener("touchmove",i=>{if(i.touches.length!==2)return;let e=Math.hypot(i.touches[0].clientX-i.touches[1].clientX,i.touches[0].clientY-i.touches[1].clientY);ie>0&&(V.raggio=Math.max(8,Math.min(140,V.raggio*ie/e))),ie=e},{passive:!0});var ne=y.ora??.35;function Mt(i){y.ora===null&&(ne=(ne+i/300)%1);let e=ne*Math.PI*2-Math.PI/2,t=.24+.5*Math.max(0,Math.sin(e)),a=e*.5;T.sole.verso=[-Math.cos(a)*Math.cos(Math.asin(t)),-t,-Math.sin(a)*Math.cos(Math.asin(t))];let o=Math.max(0,Math.min(1,(Math.sin(e)+.1)*2));T.sole.forza=o;let n=Math.min(1,Math.max(0,(t-.24)/.4));T.sole.colore=[1,.78+.22*n,.55+.45*n],T.sole.cielo=[.36+.64*o,.38+.62*o,.57+.43*o],T.nebbia.colore=[.25+.47*o,.35+.5*o,.5+.42*o],Fa.clearColor(T.nebbia.colore[0],T.nebbia.colore[1],T.nebbia.colore[2],1)}var Q=[],ha=[],re=[],ho=performance.now(),To=0,vo=0;function zo(i){let e=Math.min(.1,(i-ho)/1e3);ho=i;let t=performance.now();Et(),Mt(e);let o={occhio:Ao(),centro:V.centro,fov:V.fov,rapporto:X.width/X.height};T.disegna(o,e,oa),oa.disegna(T,o),T.disegnaAcqua();let n=performance.now()-t;Q.push(e*1e3),Q.length>240&&Q.shift(),ha.push(n),ha.length>240&&ha.shift(),To++,i-vo>500&&(vo=i,Mo()),y.rampa&&!y.mondo&&Rt(i),requestAnimationFrame(zo)}var le=[{raggio:5,erba:2,tutto:!1},{raggio:6,erba:3,tutto:!1},{raggio:7,erba:4,tutto:!1},{raggio:6,erba:3,tutto:!0},{raggio:8,erba:4,tutto:!0}],ce=[],La=-1,go=0;function Rt(i){if(La>=0&&i-go<6e3)return;if(La>=0){let t=Q.slice(-Math.min(Q.length,200)),a=le[La];ce.push({...a,fps:+(1e3/(H(t,.5)||1)).toFixed(0),p50:+H(t,.5).toFixed(1),p99:+H(t,.99).toFixed(1),js:+H(ha,.5).toFixed(2),disegni:T.statistiche.disegni,triangoli:T.statistiche.triangoli})}if(La++,La>=le.length){y.rampa=!1,Mo();return}let e=le[La];bo(e.raggio,e.erba),T.tutto=e.tutto,y.erba=e.erba,y.raggio=e.raggio,Q.length=0,ha.length=0,go=i}var H=(i,e)=>{if(!i.length)return 0;let t=i.slice().sort((a,o)=>a-o);return t[Math.min(t.length-1,Math.floor(t.length*e))]};function Mo(){let i=H(Q,.5),e=H(Q,.99),t=i?1e3/i:0;re.push(Math.round(t)),re.length>120&&re.shift();let a={disegni:T.statistiche.disegni+oa.statistiche.disegni+T.statistiche.disegniAcqua+T.statistiche.disegniErba+T.statistiche.disegniSpecchio,triangoli:T.statistiche.triangoli+oa.statistiche.triangoli+T.statistiche.triangoliAcqua+T.statistiche.triangoliErba+T.statistiche.triangoliSpecchio,chunkVisti:T.statistiche.chunkVisti,chunkTotali:T.statistiche.chunkTotali};bt.textContent=`${t.toFixed(0)} fps
${i.toFixed(1)} / ${e.toFixed(1)} ms
JS ${H(ha,.5).toFixed(2)} ms`,gt.textContent=`NUCLEO ${y.mondo?`F1 \xB7 open world vero (semilato ${y.mondo}, ${Eo} chunk, ${xo.toLocaleString("it")} blocchi, gen ${Me.tGen.toFixed(0)} ms + mesh ${Me.tMesh.toFixed(0)} ms)`:"F0"} \xB7 ${X.width}\xD7${X.height} (dpr ${xt.toFixed(2)})
disegni ${a.disegni}  triangoli ${a.triangoli.toLocaleString("it")}  chunk ${a.chunkVisti}/${a.chunkTotali}
ombra del sole: ${T.ombra?"horizon mapping":"spenta"} \xB7 erba ${y.erba} \xB7 modelli ${oa.statistiche.istanze} istanze in ${oa.statistiche.disegni} disegni \xB7 acqua ${T.statistiche.disegniAcqua} disegni${T.statistiche.pelo!=null?` + specchio ${T.statistiche.disegniSpecchio} disegni (pelo ${T.statistiche.pelo.toFixed(2)}, scala ${T.specchio.scala})`:" (senza specchio)"} \xB7 erba ${T.statistiche.triangoliErba.toLocaleString("it")} fili in ${T.statistiche.disegniErba} disegni \xB7 costruzione ${Sa.toFixed(0)} ms
${ka(Fa)}
?mondo=96 ?ora=0.95 ?finto ?raggio=${y.raggio} ?erba=${y.erba} ?ombra=${y.ombra?"s\xEC":"no"} ?specchio=${y.specchio||"no"} ?dpr=${y.dprMax} ?rampa ?tutto  \xB7  tocca lo schermo per girare`+(ce.length?`
RAMPA  fps  p50   p99   dis  triangoli
`+ce.map(o=>`r${o.raggio} e${o.erba}${o.tutto?" tutto":""}  ${String(o.fps).padStart(3)}  ${String(o.p50).padStart(5)}  ${String(o.p99).padStart(5)}  ${String(o.disegni).padStart(3)}  ${o.triangoli.toLocaleString("it")}`).join(`
`):"")+(y.rampa?`
rampa: gradino ${La+1}/${le.length}\u2026`:"")}requestAnimationFrame(zo);var Lt=new te(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[X.clientWidth,X.clientHeight],reso:[X.width,X.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:y.mondo?"nucleo F1 mondo vero":"nucleo F0",mondo:y.mondo,raggio:y.raggio,erba:y.erba,ombra:T.ombra,specchio:y.specchio,disegniSpecchio:T.statistiche.disegniSpecchio,tutto:!!T.tutto,dprMax:y.dprMax,jsMs:+H(ha,.5).toFixed(2),jsP99:+H(ha,.99).toFixed(2),rampa:ce},ombreLampade:!1,antialias:!0,fps:H(Q,.5)?1e3/H(Q,.5):null,p50:H(Q,.5),p99:H(Q,.99),disegni:T.statistiche.disegni+oa.statistiche.disegni+T.statistiche.disegniAcqua+T.statistiche.disegniErba+T.statistiche.disegniSpecchio,triangoli:T.statistiche.triangoli+oa.statistiche.triangoli+T.statistiche.triangoliAcqua+T.statistiche.triangoliErba+T.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:re,storiaLivelli:[],scheda:ka(Fa),software:/swiftshader|llvmpipe/i.test(ka(Fa)),chunk:T.statistiche.chunkTotali,blocchi:se,luci:0,decorazioni:oa.statistiche.istanze,erba:T.statistiche.triangoliErba,ora:`${Math.floor(ne*24)}h`,giorno:0,worldgenMs:Sa,meshMs:Sa}),()=>{let i=Ao();return T.disegna({occhio:i,centro:V.centro,fov:V.fov,rapporto:X.width/X.height},0),Promise.resolve(X.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:T,modelli:oa,cam:V,opz:y,statistiche:()=>({fps:1e3/(H(Q,.5)||1),p50:H(Q,.5),p99:H(Q,.99),js:H(ha,.5),...T.statistiche,modelli:{...oa.statistiche},costruzioneMs:Sa,fotogrammi:To}),diagnostica:Lt};

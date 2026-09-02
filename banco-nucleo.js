function ao(o,{antialias:t=!0,dprMax:i=1.5}={}){let e=o.getContext("webgl2",{antialias:t,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!e)throw new Error("WebGL2 non disponibile");let a=Math.min(i,devicePixelRatio||1),c=()=>{let r=Math.max(1,Math.round(o.clientWidth*a)),l=Math.max(1,Math.round(o.clientHeight*a));return o.width!==r||o.height!==l?(o.width=r,o.height=l,e.viewport(0,0,r,l),!0):!1};return c(),{gl:e,dpr:a,ridimensiona:c}}function io(o,t,i){let e=(c,r)=>{let l=o.createShader(c);if(o.shaderSource(l,r),o.compileShader(l),!o.getShaderParameter(l,o.COMPILE_STATUS))throw new Error(`shader: ${o.getShaderInfoLog(l)}
${r.split(`
`).map((u,f)=>`${f+1}: ${u}`).join(`
`)}`);return l},a=o.createProgram();if(o.attachShader(a,e(o.VERTEX_SHADER,t)),o.attachShader(a,e(o.FRAGMENT_SHADER,i)),o.linkProgram(a),!o.getProgramParameter(a,o.LINK_STATUS))throw new Error(`programma: ${o.getProgramInfoLog(a)}`);return a}function X(o){let t=o.getExtension("WEBGL_debug_renderer_info");return t?o.getParameter(t.UNMASKED_RENDERER_WEBGL):o.getParameter(o.RENDERER)}var to=1,ro=2,j=class{constructor(t=1024){this.byte=new Uint8Array(t*4*8),this.n=0,this.quad=0}_spazio(t){let i=(this.n+t)*8;if(i<=this.byte.length)return;let e=this.byte.length*2;for(;e<i;)e*=2;let a=new Uint8Array(e);a.set(this.byte),this.byte=a}vertice(t,i,e,a,c,r,l,u=0,f=0){if(t<0||t>16||e<0||e>16||i<0||i>255)throw new RangeError(`vertice fuori dal chunk: ${t},${i},${e}`);this._spazio(1);let d=this.n*8,g=this.byte;g[d]=t,g[d+1]=e,g[d+2]=i,g[d+3]=a&7,g[d+4]=(c&15)<<4|r&15,g[d+5]=l&255,g[d+6]=u&255,g[d+7]=f&255,this.n++}quadDa(t,i,e,a){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let c of[t,i,e,a])this.vertice(...c);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*8),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function no(o=16384){let t=new Uint16Array(o*6);for(let i=0,e=0,a=0;i<o;i++,a+=4)t[e++]=a,t[e++]=a+1,t[e++]=a+2,t[e++]=a,t[e++]=a+2,t[e++]=a+3;return t}function so(o,t,i,e){let a=1/Math.tan(o/2),c=1/(i-e);return new Float32Array([a/t,0,0,0,0,a,0,0,0,0,(e+i)*c,-1,0,0,2*e*i*c,0])}function co(o,t,i=[0,1,0]){let e=o[0]-t[0],a=o[1]-t[1],c=o[2]-t[2],r=Math.hypot(e,a,c)||1;e/=r,a/=r,c/=r;let l=i[1]*c-i[2]*a,u=i[2]*e-i[0]*c,f=i[0]*a-i[1]*e;r=Math.hypot(l,u,f)||1,l/=r,u/=r,f/=r;let d=a*f-c*u,g=c*l-e*f,s=e*u-a*l;return new Float32Array([l,d,e,0,u,g,a,0,f,s,c,0,-(l*o[0]+u*o[1]+f*o[2]),-(d*o[0]+g*o[1]+s*o[2]),-(e*o[0]+a*o[1]+c*o[2]),1])}function lo(o,t,i=new Float32Array(16)){for(let e=0;e<4;e++)for(let a=0;a<4;a++)i[e*4+a]=o[a]*t[e*4]+o[4+a]*t[e*4+1]+o[8+a]*t[e*4+2]+o[12+a]*t[e*4+3];return i}function uo(o,t=new Float32Array(24)){let i=u=>[o[u],o[4+u],o[8+u],o[12+u]],e=i(0),a=i(1),c=i(2),r=i(3),l=[[r[0]+e[0],r[1]+e[1],r[2]+e[2],r[3]+e[3]],[r[0]-e[0],r[1]-e[1],r[2]-e[2],r[3]-e[3]],[r[0]+a[0],r[1]+a[1],r[2]+a[2],r[3]+a[3]],[r[0]-a[0],r[1]-a[1],r[2]-a[2],r[3]-a[3]],[r[0]+c[0],r[1]+c[1],r[2]+c[2],r[3]+c[3]],[r[0]-c[0],r[1]-c[1],r[2]-c[2],r[3]-c[3]]];for(let u=0;u<6;u++){let[f,d,g,s]=l[u],h=Math.hypot(f,d,g)||1;t[u*4]=f/h,t[u*4+1]=d/h,t[u*4+2]=g/h,t[u*4+3]=s/h}return t}function ho(o,t,i,e,a,c,r){for(let l=0;l<6;l++){let u=o[l*4],f=o[l*4+1],d=o[l*4+2],g=o[l*4+3],s=u>0?a:t,h=f>0?c:i,C=d>0?r:e;if(u*s+f*h+d*C+g<0)return!1}return!0}var No=`#version 300 es
precision highp float;
layout(location = 0) in uvec4 aA;   // x z y normale
layout(location = 1) in uvec4 aB;   // luci materia tinta segnali
uniform mat4 uVP;
uniform vec3 uChunk;
uniform float uTempo;
uniform vec3 uSoleVerso;      // da dove ARRIVA la luce (verso il basso)
uniform vec3 uSoleCol;
uniform float uSoleForza;
uniform vec3 uCieloCol;       // il colore dell'ombra: \xC8 il cielo
uniform vec3 uTavolozza[16];
uniform vec2 uNebbia;
uniform vec3 uCam;
flat out vec3 vColOmbra;      // quello che si vede anche all'ombra del sole
flat out vec3 vColSole;       // quello che il sole aggiunge (l'horizon map lo pu\xF2 togliere)
out float vNebbia;
out vec3 vPos;
const vec3 N[6] = vec3[6](vec3(1,0,0), vec3(-1,0,0), vec3(0,1,0), vec3(0,-1,0), vec3(0,0,1), vec3(0,0,-1));
void main() {
  vec3 p = uChunk + vec3(float(aA.x), float(aA.z), float(aA.y));
  uint seg = aB.w;
  if ((seg & 3u) == 3u) {   // cima di un filo d'erba: ondeggia
    float f = sin(uTempo * 1.7 + p.x * 0.9 + p.z * 1.3);
    p.x += f * 0.18; p.z += cos(uTempo * 1.1 + p.z * 0.7 + p.x * 0.4) * 0.12;
  }
  vec3 n = N[aA.w];
  float cielo = float(aB.x >> 4u) / 15.0;
  float blocco = float(aB.x & 15u) / 15.0;
  uint materia = aB.y;
  float tinta = 0.94 + 0.12 * float(aB.z) / 255.0;
  vec3 base = uTavolozza[materia] * tinta;
  // \u26A0 LA FACCIA VEDE IL SOLE O NO: la soglia a 0,12 \xE8 la cura dell'acne di Leafy
  float faccia = (materia == 5u) ? 1.0 : step(0.12, dot(n, -uSoleVerso));
  float sole = floor(cielo * faccia * uSoleForza * 3.0 + 0.5) / 3.0;   // tre bande
  float lampada = floor(blocco * blocco * 4.0 + 0.5) / 4.0;           // quattro bande, caduta quadratica
  vec3 ombra = base * (uCieloCol * (0.28 + 0.32 * cielo)) + base * vec3(1.0, 0.80, 0.50) * lampada * 0.9;
  vec3 pieno = base * uSoleCol * sole * 0.85;
  if (materia == 8u) { ombra = base * 1.15; pieno = vec3(0.0); }   // emissiva: scavalca tutto
  vColOmbra = ombra;
  vColSole = pieno;
  float d = distance(p, uCam);
  vNebbia = clamp((d - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,Io=`#version 300 es
precision mediump float;
precision mediump sampler2D;
flat in vec3 vColOmbra;
flat in vec3 vColSole;
in float vNebbia;
in vec3 vPos;
uniform vec3 uNebbiaCol;
uniform float uOmbra;            // 1 = horizon mapping acceso
// \u26A0 STESSA PRECISIONE DEL VERTEX: un uniform condiviso fra i due shader deve
// avere la stessa precisione, o il link fallisce (\xABprecisions differ\xBB).
uniform highp vec3 uSoleVerso;
uniform sampler2D uAltezze;      // R8: quota della cima / 255, un texel per colonna
uniform vec4 uAltRett;           // x0, z0, 1/larghezza, 1/profondita
out vec4 colore;
void main() {
  float luce = 1.0;
  if (uOmbra > 0.5) {
    // \u26A0 HORIZON MAPPING: si cammina verso il sole sulla mappa delle altezze.
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
  colore = vec4(mix(c, uNebbiaCol, vNebbia), 1.0);
}`,H=class{constructor(t){this.gl=t,this.programma=io(t,No,Io),this.u={};for(let i of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uTavolozza","uNebbia","uCam","uNebbiaCol","uOmbra","uAltezze","uAltRett"])this.u[i]=t.getUniformLocation(this.programma,i);this.ebo=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ebo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,no(16384),t.STATIC_DRAW),this.chunks=new Map,this.altezze=null,this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0},t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.ombra=!0,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}carica(t,i){let e=this.gl,a=this.chunks.get(t);a||(a={vao:e.createVertexArray(),vbo:e.createBuffer(),quad:0},e.bindVertexArray(a.vao),e.bindBuffer(e.ARRAY_BUFFER,a.vbo),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,4,e.UNSIGNED_BYTE,8,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,8,4),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null),this.chunks.set(t,a)),e.bindBuffer(e.ARRAY_BUFFER,a.vbo),e.bufferData(e.ARRAY_BUFFER,i.byte,e.STATIC_DRAW),a.quad=i.quad,a.x0=i.cx*16,a.z0=i.cz*16,a.minY=i.minY,a.maxY=i.maxY,a.chunk=[a.x0,0,a.z0]}rimuovi(t){let i=this.chunks.get(t);i&&(this.gl.deleteVertexArray(i.vao),this.gl.deleteBuffer(i.vbo),this.chunks.delete(t))}impostaAltezze(t,i,e,a,c){let r=this.gl;this.altezze||(this.altezze=r.createTexture()),r.bindTexture(r.TEXTURE_2D,this.altezze),r.pixelStorei(r.UNPACK_ALIGNMENT,1),r.texImage2D(r.TEXTURE_2D,0,r.R8,a,c,0,r.RED,r.UNSIGNED_BYTE,t),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),this.altRett=[i,e,1/a,1/c]}impostaTavolozza(t){let i=new Float32Array(48);for(let e=0;e<16&&e<t.length;e++)i[e*3]=t[e][0],i[e*3+1]=t[e][1],i[e*3+2]=t[e][2];this.tavolozza=i}disegna(t,i){let e=this.gl,a=this.statistiche;this.tempo+=i;let c=so(t.fov,t.rapporto,.3,400),r=co(t.occhio,t.centro);lo(c,r,this.vp),uo(this.vp,this.piani),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.useProgram(this.programma);let l=this.u,u=this.sole;e.uniformMatrix4fv(l.uVP,!1,this.vp),e.uniform1f(l.uTempo,this.tempo),e.uniform3f(l.uSoleVerso,u.verso[0],u.verso[1],u.verso[2]),e.uniform3f(l.uSoleCol,u.colore[0],u.colore[1],u.colore[2]),e.uniform1f(l.uSoleForza,u.forza),e.uniform3f(l.uCieloCol,u.cielo[0],u.cielo[1],u.cielo[2]),e.uniform3fv(l.uTavolozza,this.tavolozza),e.uniform2f(l.uNebbia,this.nebbia.da,this.nebbia.a),e.uniform3f(l.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),e.uniform3f(l.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),e.uniform1f(l.uOmbra,this.ombra&&this.altezze?1:0),this.altezze&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(l.uAltezze,0),e.uniform4f(l.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3]));let f=0,d=0,g=0;for(let s of this.chunks.values())s.quad!==0&&ho(this.piani,s.x0,s.minY,s.z0,s.x0+16,s.maxY+1,s.z0+16)&&(g++,e.uniform3f(l.uChunk,s.chunk[0],s.chunk[1],s.chunk[2]),e.bindVertexArray(s.vao),e.drawElements(e.TRIANGLES,s.quad*6,e.UNSIGNED_SHORT,0),f++,d+=s.quad*2);e.bindVertexArray(null),a.disegni=f,a.triangoli=d,a.chunkVisti=g,a.chunkTotali=this.chunks.size}};var S={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},bo=[[0,0,0],[.36,.66,.24],[.52,.36,.22],[.86,.78,.55],[.55,.55,.52],[.3,.62,.2],[.36,.22,.12],[.16,.42,.18],[1,.85,.45]];function U(o,t,i){let e=o*374761393+t*668265263+i*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function eo(o,t,i,e){let a=o/i,c=t/i,r=Math.floor(a),l=Math.floor(c),u=a-r,f=c-l,d=u*u*(3-2*u),g=f*f*(3-2*f),s=U(r,l,e),h=U(r+1,l,e),C=U(r,l+1,e),N=U(r+1,l+1,e);return s+(h-s)*d+(C+(N-C)*d-(s+(h-s)*d))*g}function V(o,t,i=7){let e=eo(o,t,48,i)*14+eo(o,t,17,i+1)*5+eo(o,t,6,i+2)*1.5;return 8+Math.floor(e)}function go(o){return o<11?S.sabbia:o>24?S.roccia:S.erba}function fo(o,t,i=7){let e=[];for(let a=0;a<2;a++){if(U(o*3+a,t*5-a,i+9)<.35)continue;let r=o*16+Math.floor(U(o,t,i+11+a)*15)+.5,l=t*16+Math.floor(U(t,o,i+13+a)*15)+.5,u=V(Math.floor(r),Math.floor(l),i);go(u)===S.erba&&e.push({x:r,y:u+3,z:l})}return e}function mo(o,t,i,e){let a=0;for(let c of e){let l=15-Math.sqrt((o-c.x)**2+(t-c.y)**2+(i-c.z)**2);l>a&&(a=l)}return Math.max(0,Math.min(15,Math.round(a)))}function xo(o,t,{seme:i=7,erba:e=2,raggioLampade:a=2}={}){let c=new j(1600),r=o*16,l=t*16,u=255,f=0,d=[];for(let s=-a;s<=a;s++)for(let h=-a;h<=a;h++)d.push(...fo(o+s,t+h,i));for(let s=0;s<16;s++)for(let h=0;h<16;h++){let C=r+s,N=l+h,n=V(C,N,i);n<u&&(u=n),n+1>f&&(f=n+1);let b=go(n),p=Math.floor(U(C,N,i+3)*255),R=mo(C+.5,n+1,N+.5,d);c.quadDa([s,n+1,h,2,15,R,b,p],[s,n+1,h+1,2,15,R,b,p],[s+1,n+1,h+1,2,15,R,b,p],[s+1,n+1,h,2,15,R,b,p]);let Y=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[v,_,m]of Y){let A=V(C+v,N+_,i);for(let L=A+1;L<=n;L++){let T=Math.max(6,15-(n-L)*2),y=L===n&&b===S.erba?S.erba:n>24?S.roccia:S.terra,x=mo(C+.5+v*.5,L+.5,N+.5+_*.5,d),P=L,D=L+1;v===1?c.quadDa([s+1,P,h,m,T,x,y,p],[s+1,D,h,m,T,x,y,p],[s+1,D,h+1,m,T,x,y,p],[s+1,P,h+1,m,T,x,y,p]):v===-1?c.quadDa([s,P,h+1,m,T,x,y,p],[s,D,h+1,m,T,x,y,p],[s,D,h,m,T,x,y,p],[s,P,h,m,T,x,y,p]):_===1?c.quadDa([s+1,P,h+1,m,T,x,y,p],[s+1,D,h+1,m,T,x,y,p],[s,D,h+1,m,T,x,y,p],[s,P,h+1,m,T,x,y,p]):c.quadDa([s,P,h,m,T,x,y,p],[s,D,h,m,T,x,y,p],[s+1,D,h,m,T,x,y,p],[s+1,P,h,m,T,x,y,p]),L<u&&(u=L)}}if(b===S.erba)for(let v=0;v<e;v++){if(U(C,N,i+20+v)<.25)continue;let m=1,A=s+0,L=h+0,T=to,y=to|ro,x=Math.floor(U(C,N,i+30+v)*255);c.quadDa([A,n+1,L,2,15,R,S.filo,x,T],[A,n+1+m,L,2,15,R,S.filo,x,y],[A+1,n+1+m,L+1,2,15,R,S.filo,x,y],[A+1,n+1,L+1,2,15,R,S.filo,x,T]),c.quadDa([A+1,n+1,L,2,15,R,S.filo,x,T],[A+1,n+1+m,L,2,15,R,S.filo,x,y],[A,n+1+m,L+1,2,15,R,S.filo,x,y],[A,n+1,L+1,2,15,R,S.filo,x,T]),n+2>f&&(f=n+2)}}for(let s of fo(o,t,i)){let h=Math.floor(s.x)-r,C=Math.floor(s.z)-l,N=s.y-3;for(let n=N+1;n<=s.y;n++){let b=n===s.y?S.lampada:S.tronco,p=n===s.y?15:12,R=h+.5-.15,Y=h+.5+.15,v=Math.floor(R),_=Math.min(16,Math.floor(R)+1),m=C,A=C+1;c.quadDa([_,n,m,0,12,p,b,0],[_,n+1,m,0,12,p,b,0],[_,n+1,A,0,12,p,b,0],[_,n,A,0,12,p,b,0]),c.quadDa([v,n,A,1,12,p,b,0],[v,n+1,A,1,12,p,b,0],[v,n+1,m,1,12,p,b,0],[v,n,m,1,12,p,b,0]),c.quadDa([_,n,A,4,12,p,b,0],[_,n+1,A,4,12,p,b,0],[v,n+1,A,4,12,p,b,0],[v,n,A,4,12,p,b,0]),c.quadDa([v,n,m,5,12,p,b,0],[v,n+1,m,5,12,p,b,0],[_,n+1,m,5,12,p,b,0],[_,n,m,5,12,p,b,0]),n===s.y&&c.quadDa([v,n+1,m,2,15,p,b,0],[v,n+1,A,2,15,p,b,0],[_,n+1,A,2,15,p,b,0],[_,n+1,m,2,15,p,b,0]),n+1>f&&(f=n+1)}}return{...c.dati(),minY:u,maxY:f,cx:o,cz:t}}function vo(o={}){let t=(i,e=1)=>typeof i=="number"&&isFinite(i)?+i.toFixed(e):null;return{quando:o.quando||null,gioco:"Leafy-Shadows",versione:o.versione||"in sviluppo",nota:typeof o.nota=="string"?o.nota.slice(0,400):"",dispositivo:{classe:o.mobile?"mobile":"desktop",tocco:!!o.tocco,modoGui:o.modoGui||"auto",ua:(o.ua||"").slice(0,220),cpu:o.cpu||null,memoriaGB:o.memoriaGB||null},schermo:{css:o.css||null,reso:o.reso||null,dpr:t(o.dpr,3),rapporto:o.css&&o.reso&&o.css[0]?t(o.reso[0]/o.css[0],2):null},qualita:{livello:o.livello,di:o.quantiLivelli,manuale:!!o.manuale,profilo:o.profilo||null,ombreLampade:!!o.ombreLampade,antialias:!!o.antialias},prestazioni:{fps:t(o.fps,0),p50ms:t(o.p50,2),p99ms:t(o.p99,2),disegni:o.disegni??null,triangoli:o.triangoli??null,ombreMs:t(o.ombreMs,2),storiaFps:Array.isArray(o.storiaFps)?o.storiaFps.slice(-60).map(i=>Math.round(i)):[],storiaLivelli:Array.isArray(o.storiaLivelli)?o.storiaLivelli.slice(-20):[]},scheda:{nome:(o.scheda||"").slice(0,120),software:!!o.software},mondo:{chunk:o.chunk??null,blocchi:o.blocchi??null,luci:o.luci??null,decorazioni:o.decorazioni??null,erba:o.erba??null,ora:o.ora||null,giorno:o.giorno??null,worldgenMs:t(o.worldgenMs,0),meshMs:t(o.meshMs,0)},errori:(o.errori||[]).slice(-12).map(i=>String(i).slice(0,500)),scatto:o.scatto||null}}function Eo(o){return Math.round(JSON.stringify(o).length/1024)}var Oo=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),k=(o,t)=>o>>>t|o<<32-t;function Ao(o){let t=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),i=o.length*8,e=new Uint8Array(o.length+9+63>>6<<6);e.set(o),e[o.length]=128,new DataView(e.buffer).setUint32(e.length-4,i>>>0),new DataView(e.buffer).setUint32(e.length-8,Math.floor(i/4294967296));let a=new Uint32Array(64),c=new DataView(e.buffer);for(let l=0;l<e.length;l+=64){for(let n=0;n<16;n++)a[n]=c.getUint32(l+n*4);for(let n=16;n<64;n++){let b=k(a[n-15],7)^k(a[n-15],18)^a[n-15]>>>3,p=k(a[n-2],17)^k(a[n-2],19)^a[n-2]>>>10;a[n]=a[n-16]+b+a[n-7]+p>>>0}let[u,f,d,g,s,h,C,N]=t;for(let n=0;n<64;n++){let b=k(s,6)^k(s,11)^k(s,25),p=s&h^~s&C,R=N+b+p+Oo[n]+a[n]>>>0,Y=k(u,2)^k(u,13)^k(u,22),v=u&f^u&d^f&d,_=Y+v>>>0;N=C,C=h,h=s,s=g+R>>>0,g=d,d=f,f=u,u=R+_>>>0}t[0]=t[0]+u>>>0,t[1]=t[1]+f>>>0,t[2]=t[2]+d>>>0,t[3]=t[3]+g>>>0,t[4]=t[4]+s>>>0,t[5]=t[5]+h>>>0,t[6]=t[6]+C>>>0,t[7]=t[7]+N>>>0}let r="";for(let l of t)r+=l.toString(16).padStart(8,"0");return r}var Uo="https://ntfy.sh",ko=4096;async function Po(o){let t=new TextEncoder().encode("leafy-shadows/"+o),i;if(globalThis.crypto&&crypto.subtle){let e=await crypto.subtle.digest("SHA-256",t);i=[...new Uint8Array(e)].map(a=>a.toString(16).padStart(2,"0")).join("")}else i=Ao(t);return"leafy-"+i.slice(0,24)}async function To(o,t){let i=await Po(o),e=await fetch(`${Uo}/${i}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:t});if(!e.ok)return{ok:!1,dice:`il servizio ha detto no: ${e.status}`};let a=await e.json().catch(()=>({})),c=t.length>ko;return{ok:!0,id:a.id||"",dice:c?`mandato \u2714 (${Math.round(t.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(t.length/1024)} KB, dura 12 ore)`}}var yo="leafy.diagnostica.chiave",Do=`
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
`,K=class{constructor(t,i){this.leggi=t,this.scatta=i,this.errori=[],addEventListener("error",a=>this._errore(a.error||a.message)),addEventListener("unhandledrejection",a=>this._errore(a.reason));let e=document.createElement("style");e.textContent=Do,document.head.appendChild(e),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(t){let i=t&&t.stack?t.stack:String(t);this.errori.push(i),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(yo)||""}catch{return""}}set chiave(t){try{localStorage.setItem(yo,t)}catch{}}apri(){let t=this.pannello;t.classList.add("aperto"),t.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,t.querySelector("#diagChiudi").onclick=()=>t.classList.remove("aperto"),t.querySelector("#diagCopia").onclick=()=>this.vai(!0),t.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let i=t.querySelector("#diagNota");i&&i.focus()},30)}_dice(t){let i=this.pannello.querySelector("#diagEsito");i&&(i.textContent=t)}async vai(t){let i=this.pannello.querySelector("#diagChiave");i&&i.value.trim()&&(this.chiave=i.value.trim());let e=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let a=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,c=null;if(a)try{c=this.scatta?await this.scatta():null}catch(d){this._errore(d)}let r=vo({...this.leggi(),quando:new Date().toISOString(),nota:e,errori:this.errori,scatto:c}),l=Eo(r),u=JSON.stringify(r,null,1);if(t){await this._negliAppunti(u),this.nodo.classList.remove("corso");return}let f=!1;try{let d=await fetch("/_diagnostica",{method:"GET"});f=d.ok&&(await d.json().catch(()=>({}))).collettore===!0}catch{f=!1}if(f)try{let d=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:u});if(d.status===403)this._dice("password sbagliata."),this.chiave="";else if(d.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!d.ok)this._dice("il collettore ha detto no: "+d.status);else{let g=await d.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${g.nome||""}  (${l} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let d=await To(this.chiave,u);this._dice(d.ok?d.dice+`
(fuori casa: passa dal cloud)`:d.dice),d.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(u,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(t,i=""){try{await navigator.clipboard.writeText(t),this._dice(i+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let e=new Blob([t],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(e),a.download="leafy-diagnostica.json",a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),4e3),this._dice(i+`scaricato come file \u2714
mandami quello.`)}}};var w=document.getElementById("tela"),qo=document.getElementById("stato"),Fo=document.getElementById("fps"),W=new URLSearchParams(location.search),M={raggio:+(W.get("raggio")||5),erba:+(W.get("erba")??2),ombra:W.get("ombra")!=="no",dprMax:+(W.get("dpr")||1.5)},{gl:G,dpr:Bo,ridimensiona:Vo}=ao(w,{antialias:!0,dprMax:M.dprMax}),z=new H(G);z.impostaTavolozza(bo);z.ombra=M.ombra;var $o=performance.now(),Co=0;for(let o=-M.raggio;o<M.raggio;o++)for(let t=-M.raggio;t<M.raggio;t++){let i=xo(o,t,{erba:M.erba});z.carica(o+","+t,i),Co+=256}var F=M.raggio*2*16,So=new Uint8Array(F*F);for(let o=0;o<F;o++)for(let t=0;t<F;t++)So[o*F+t]=V(t-M.raggio*16,o-M.raggio*16)+1;z.impostaAltezze(So,-M.raggio*16,-M.raggio*16,F,F);var oo=performance.now()-$o,E={alpha:-.8,beta:1.05,raggio:46,centro:[0,V(0,0)+2,0],fov:.9};function wo(){let o=Math.sin(E.beta),t=Math.cos(E.beta);return[E.centro[0]+E.raggio*o*Math.cos(E.alpha),E.centro[1]+E.raggio*t,E.centro[2]+E.raggio*o*Math.sin(E.alpha)]}var $=null,Q=0;w.addEventListener("pointerdown",o=>{$={x:o.clientX,y:o.clientY},w.setPointerCapture(o.pointerId)});w.addEventListener("pointermove",o=>{$&&(E.alpha+=(o.clientX-$.x)*.006,E.beta=Math.max(.15,Math.min(1.5,E.beta-(o.clientY-$.y)*.006)),$={x:o.clientX,y:o.clientY})});w.addEventListener("pointerup",()=>{$=null});w.addEventListener("wheel",o=>{E.raggio=Math.max(8,Math.min(140,E.raggio*(o.deltaY>0?1.1:.9))),o.preventDefault()},{passive:!1});w.addEventListener("touchstart",o=>{o.touches.length===2&&(Q=Math.hypot(o.touches[0].clientX-o.touches[1].clientX,o.touches[0].clientY-o.touches[1].clientY))},{passive:!0});w.addEventListener("touchmove",o=>{if(o.touches.length!==2)return;let t=Math.hypot(o.touches[0].clientX-o.touches[1].clientX,o.touches[0].clientY-o.touches[1].clientY);Q>0&&(E.raggio=Math.max(8,Math.min(140,E.raggio*Q/t))),Q=t},{passive:!0});var Z=.35;function Go(o){Z=(Z+o/300)%1;let t=Z*Math.PI*2-Math.PI/2,i=Math.max(.24,Math.sin(t)),e=t*.5;z.sole.verso=[-Math.cos(e)*Math.cos(Math.asin(i)),-i,-Math.sin(e)*Math.cos(Math.asin(i))];let a=Math.max(0,Math.min(1,(Math.sin(t)+.1)*2));z.sole.forza=a,z.sole.colore=[1,.86+.1*a,.66+.2*a],z.nebbia.colore=[.25+.47*a,.35+.5*a,.5+.42*a],G.clearColor(z.nebbia.colore[0],z.nebbia.colore[1],z.nebbia.colore[2],1)}var O=[],B=[],J=[],zo=performance.now(),Ro=0,Mo=0;function Lo(o){let t=Math.min(.1,(o-zo)/1e3);zo=o;let i=performance.now();Vo(),Go(t);let e=wo();z.disegna({occhio:e,centro:E.centro,fov:E.fov,rapporto:w.width/w.height},t);let a=performance.now()-i;O.push(t*1e3),O.length>240&&O.shift(),B.push(a),B.length>240&&B.shift(),Ro++,o-Mo>500&&(Mo=o,Yo()),requestAnimationFrame(Lo)}var I=(o,t)=>{if(!o.length)return 0;let i=o.slice().sort((e,a)=>e-a);return i[Math.min(i.length-1,Math.floor(i.length*t))]};function Yo(){let o=I(O,.5),t=I(O,.99),i=o?1e3/o:0;J.push(Math.round(i)),J.length>120&&J.shift();let e=z.statistiche;Fo.textContent=`${i.toFixed(0)} fps
${o.toFixed(1)} / ${t.toFixed(1)} ms
JS ${I(B,.5).toFixed(2)} ms`,qo.textContent=`NUCLEO F0 \xB7 ${w.width}\xD7${w.height} (dpr ${Bo.toFixed(2)})
disegni ${e.disegni}  triangoli ${e.triangoli.toLocaleString("it")}  chunk ${e.chunkVisti}/${e.chunkTotali}
ombra del sole: ${z.ombra?"horizon mapping":"spenta"} \xB7 erba ${M.erba} \xB7 costruzione ${oo.toFixed(0)} ms
${X(G)}
?raggio=${M.raggio} ?erba=${M.erba} ?ombra=${M.ombra?"s\xEC":"no"} ?dpr=${M.dprMax}  \xB7  tocca lo schermo per girare`}requestAnimationFrame(Lo);var Xo=new K(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[w.clientWidth,w.clientHeight],reso:[w.width,w.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:"nucleo F0",raggio:M.raggio,erba:M.erba,ombra:z.ombra,dprMax:M.dprMax,jsMs:+I(B,.5).toFixed(2),jsP99:+I(B,.99).toFixed(2)},ombreLampade:!1,antialias:!0,fps:I(O,.5)?1e3/I(O,.5):null,p50:I(O,.5),p99:I(O,.99),disegni:z.statistiche.disegni,triangoli:z.statistiche.triangoli,ombreMs:0,storiaFps:J,storiaLivelli:[],scheda:X(G),software:/swiftshader|llvmpipe/i.test(X(G)),chunk:z.statistiche.chunkTotali,blocchi:Co,luci:0,decorazioni:0,erba:0,ora:`${Math.floor(Z*24)}h`,giorno:0,worldgenMs:oo,meshMs:oo}),()=>{let o=wo();return z.disegna({occhio:o,centro:E.centro,fov:E.fov,rapporto:w.width/w.height},0),Promise.resolve(w.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:z,cam:E,opz:M,statistiche:()=>({fps:1e3/(I(O,.5)||1),p50:I(O,.5),p99:I(O,.99),js:I(B,.5),...z.statistiche,costruzioneMs:oo,fotogrammi:Ro}),diagnostica:Xo};

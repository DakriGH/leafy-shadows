function nt(t,{antialias:o=!0,dprMax:i=1.5}={}){let e=t.getContext("webgl2",{antialias:o,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!e)throw new Error("WebGL2 non disponibile");let a=Math.min(i,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(t.clientWidth*a)),l=Math.max(1,Math.round(t.clientHeight*a));return t.width!==r||t.height!==l?(t.width=r,t.height=l,e.viewport(0,0,r,l),!0):!1};return n(),{gl:e,dpr:a,ridimensiona:n}}function st(t,o,i){let e=(n,r)=>{let l=t.createShader(n);if(t.shaderSource(l,r),t.compileShader(l),!t.getShaderParameter(l,t.COMPILE_STATUS))throw new Error(`shader: ${t.getShaderInfoLog(l)}
${r.split(`
`).map((u,f)=>`${f+1}: ${u}`).join(`
`)}`);return l},a=t.createProgram();if(t.attachShader(a,e(t.VERTEX_SHADER,o)),t.attachShader(a,e(t.FRAGMENT_SHADER,i)),t.linkProgram(a),!t.getProgramParameter(a,t.LINK_STATUS))throw new Error(`programma: ${t.getProgramInfoLog(a)}`);return a}function H(t){let o=t.getExtension("WEBGL_debug_renderer_info");return o?t.getParameter(o.UNMASKED_RENDERER_WEBGL):t.getParameter(t.RENDERER)}var at=1,ct=2,K=class{constructor(o=1024){this.byte=new Uint8Array(o*4*8),this.n=0,this.quad=0}_spazio(o){let i=(this.n+o)*8;if(i<=this.byte.length)return;let e=this.byte.length*2;for(;e<i;)e*=2;let a=new Uint8Array(e);a.set(this.byte),this.byte=a}vertice(o,i,e,a,n,r,l,u=0,f=0){if(o<0||o>16||e<0||e>16||i<0||i>255)throw new RangeError(`vertice fuori dal chunk: ${o},${i},${e}`);this._spazio(1);let d=this.n*8,g=this.byte;g[d]=o,g[d+1]=e,g[d+2]=i,g[d+3]=a&7,g[d+4]=(n&15)<<4|r&15,g[d+5]=l&255,g[d+6]=u&255,g[d+7]=f&255,this.n++}quadDa(o,i,e,a){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[o,i,e,a])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*8),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function lt(t=16384){let o=new Uint16Array(t*6);for(let i=0,e=0,a=0;i<t;i++,a+=4)o[e++]=a,o[e++]=a+1,o[e++]=a+2,o[e++]=a,o[e++]=a+2,o[e++]=a+3;return o}function ut(t,o,i,e){let a=1/Math.tan(t/2),n=1/(i-e);return new Float32Array([a/o,0,0,0,0,a,0,0,0,0,(e+i)*n,-1,0,0,2*e*i*n,0])}function dt(t,o,i=[0,1,0]){let e=t[0]-o[0],a=t[1]-o[1],n=t[2]-o[2],r=Math.hypot(e,a,n)||1;e/=r,a/=r,n/=r;let l=i[1]*n-i[2]*a,u=i[2]*e-i[0]*n,f=i[0]*a-i[1]*e;r=Math.hypot(l,u,f)||1,l/=r,u/=r,f/=r;let d=a*f-n*u,g=n*l-e*f,c=e*u-a*l;return new Float32Array([l,d,e,0,u,g,a,0,f,c,n,0,-(l*t[0]+u*t[1]+f*t[2]),-(d*t[0]+g*t[1]+c*t[2]),-(e*t[0]+a*t[1]+n*t[2]),1])}function ht(t,o,i=new Float32Array(16)){for(let e=0;e<4;e++)for(let a=0;a<4;a++)i[e*4+a]=t[a]*o[e*4]+t[4+a]*o[e*4+1]+t[8+a]*o[e*4+2]+t[12+a]*o[e*4+3];return i}function pt(t,o=new Float32Array(24)){let i=u=>[t[u],t[4+u],t[8+u],t[12+u]],e=i(0),a=i(1),n=i(2),r=i(3),l=[[r[0]+e[0],r[1]+e[1],r[2]+e[2],r[3]+e[3]],[r[0]-e[0],r[1]-e[1],r[2]-e[2],r[3]-e[3]],[r[0]+a[0],r[1]+a[1],r[2]+a[2],r[3]+a[3]],[r[0]-a[0],r[1]-a[1],r[2]-a[2],r[3]-a[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let u=0;u<6;u++){let[f,d,g,c]=l[u],h=Math.hypot(f,d,g)||1;o[u*4]=f/h,o[u*4+1]=d/h,o[u*4+2]=g/h,o[u*4+3]=c/h}return o}function ft(t,o,i,e,a,n,r){for(let l=0;l<6;l++){let u=t[l*4],f=t[l*4+1],d=t[l*4+2],g=t[l*4+3],c=u>0?a:o,h=f>0?n:i,z=d>0?r:e;if(u*c+f*h+d*z+g<0)return!1}return!0}var Ot=`#version 300 es
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
}`,Pt=`#version 300 es
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
}`,W=class{constructor(o){this.gl=o,this.programma=st(o,Ot,Pt),this.u={};for(let i of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uTavolozza","uNebbia","uCam","uNebbiaCol","uOmbra","uAltezze","uAltRett"])this.u[i]=o.getUniformLocation(this.programma,i);this.ebo=o.createBuffer(),o.bindBuffer(o.ELEMENT_ARRAY_BUFFER,this.ebo),o.bufferData(o.ELEMENT_ARRAY_BUFFER,lt(16384),o.STATIC_DRAW),this.chunks=new Map,this.altezze=null,this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0},o.enable(o.DEPTH_TEST),o.enable(o.CULL_FACE),o.cullFace(o.BACK),o.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.ombra=!0,this.tutto=!1,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}carica(o,i){let e=this.gl,a=this.chunks.get(o);a||(a={vao:e.createVertexArray(),vbo:e.createBuffer(),quad:0},e.bindVertexArray(a.vao),e.bindBuffer(e.ARRAY_BUFFER,a.vbo),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,4,e.UNSIGNED_BYTE,8,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,8,4),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null),this.chunks.set(o,a)),e.bindBuffer(e.ARRAY_BUFFER,a.vbo),e.bufferData(e.ARRAY_BUFFER,i.byte,e.STATIC_DRAW),a.quad=i.quad,a.x0=i.cx*16,a.z0=i.cz*16,a.minY=i.minY,a.maxY=i.maxY,a.chunk=[a.x0,0,a.z0]}rimuovi(o){let i=this.chunks.get(o);i&&(this.gl.deleteVertexArray(i.vao),this.gl.deleteBuffer(i.vbo),this.chunks.delete(o))}impostaAltezze(o,i,e,a,n){let r=this.gl;this.altezze||(this.altezze=r.createTexture()),r.bindTexture(r.TEXTURE_2D,this.altezze),r.pixelStorei(r.UNPACK_ALIGNMENT,1),r.texImage2D(r.TEXTURE_2D,0,r.R8,a,n,0,r.RED,r.UNSIGNED_BYTE,o),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MAG_FILTER,r.NEAREST),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE),this.altRett=[i,e,1/a,1/n]}impostaTavolozza(o){let i=new Float32Array(48);for(let e=0;e<16&&e<o.length;e++)i[e*3]=o[e][0],i[e*3+1]=o[e][1],i[e*3+2]=o[e][2];this.tavolozza=i}disegna(o,i){let e=this.gl,a=this.statistiche;this.tempo+=i;let n=ut(o.fov,o.rapporto,.3,400),r=dt(o.occhio,o.centro);ht(n,r,this.vp),pt(this.vp,this.piani),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),e.useProgram(this.programma);let l=this.u,u=this.sole;e.uniformMatrix4fv(l.uVP,!1,this.vp),e.uniform1f(l.uTempo,this.tempo),e.uniform3f(l.uSoleVerso,u.verso[0],u.verso[1],u.verso[2]),e.uniform3f(l.uSoleCol,u.colore[0],u.colore[1],u.colore[2]),e.uniform1f(l.uSoleForza,u.forza),e.uniform3f(l.uCieloCol,u.cielo[0],u.cielo[1],u.cielo[2]),e.uniform3fv(l.uTavolozza,this.tavolozza),e.uniform2f(l.uNebbia,this.nebbia.da,this.nebbia.a),e.uniform3f(l.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),e.uniform3f(l.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(l.uOmbra,this.ombra&&this.altezze?1:0),this.altezze&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(l.uAltezze,0),e.uniform4f(l.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3]));let f=0,d=0,g=0;for(let c of this.chunks.values())c.quad!==0&&(!this.tutto&&!ft(this.piani,c.x0,c.minY,c.z0,c.x0+16,c.maxY+1,c.z0+16)||(g++,e.uniform3f(l.uChunk,c.chunk[0],c.chunk[1],c.chunk[2]),e.bindVertexArray(c.vao),e.drawElements(e.TRIANGLES,c.quad*6,e.UNSIGNED_SHORT,0),f++,d+=c.quad*2));e.bindVertexArray(null),a.disegni=f,a.triangoli=d,a.chunkVisti=g,a.chunkTotali=this.chunks.size}};var S={erba:1,terra:2,sabbia:3,roccia:4,filo:5,tronco:6,chioma:7,lampada:8},xt=[[0,0,0],[.36,.66,.24],[.52,.36,.22],[.86,.78,.55],[.55,.55,.52],[.3,.62,.2],[.36,.22,.12],[.16,.42,.18],[1,.85,.45]];function O(t,o,i){let e=t*374761393+o*668265263+i*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function it(t,o,i,e){let a=t/i,n=o/i,r=Math.floor(a),l=Math.floor(n),u=a-r,f=n-l,d=u*u*(3-2*u),g=f*f*(3-2*f),c=O(r,l,e),h=O(r+1,l,e),z=O(r,l+1,e),I=O(r+1,l+1,e);return c+(h-c)*d+(z+(I-z)*d-(c+(h-c)*d))*g}function V(t,o,i=7){let e=it(t,o,48,i)*14+it(t,o,17,i+1)*5+it(t,o,6,i+2)*1.5;return 8+Math.floor(e)}function vt(t){return t<11?S.sabbia:t>24?S.roccia:S.erba}function bt(t,o,i=7){let e=[];for(let a=0;a<2;a++){if(O(t*3+a,o*5-a,i+9)<.35)continue;let r=t*16+Math.floor(O(t,o,i+11+a)*15)+.5,l=o*16+Math.floor(O(o,t,i+13+a)*15)+.5,u=V(Math.floor(r),Math.floor(l),i);vt(u)===S.erba&&e.push({x:r,y:u+3,z:l})}return e}function gt(t,o,i,e){let a=0;for(let n of e){let l=15-Math.sqrt((t-n.x)**2+(o-n.y)**2+(i-n.z)**2);l>a&&(a=l)}return Math.max(0,Math.min(15,Math.round(a)))}function Et(t,o,{seme:i=7,erba:e=2,raggioLampade:a=2}={}){let n=new K(1600),r=t*16,l=o*16,u=255,f=0,d=[];for(let c=-a;c<=a;c++)for(let h=-a;h<=a;h++)d.push(...bt(t+c,o+h,i));for(let c=0;c<16;c++)for(let h=0;h<16;h++){let z=r+c,I=l+h,s=V(z,I,i);s<u&&(u=s),s+1>f&&(f=s+1);let b=vt(s),p=Math.floor(O(z,I,i+3)*255),R=gt(z+.5,s+1,I+.5,d);n.quadDa([c,s+1,h,2,15,R,b,p],[c,s+1,h+1,2,15,R,b,p],[c+1,s+1,h+1,2,15,R,b,p],[c+1,s+1,h,2,15,R,b,p]);let j=[[1,0,0],[-1,0,1],[0,1,4],[0,-1,5]];for(let[E,_,m]of j){let T=V(z+E,I+_,i);for(let L=T+1;L<=s;L++){let M=Math.max(6,15-(s-L)*2),y=L===s&&b===S.erba?S.erba:s>24?S.roccia:S.terra,v=gt(z+.5+E*.5,L+.5,I+.5+_*.5,d),F=L,D=L+1;E===1?n.quadDa([c+1,F,h,m,M,v,y,p],[c+1,D,h,m,M,v,y,p],[c+1,D,h+1,m,M,v,y,p],[c+1,F,h+1,m,M,v,y,p]):E===-1?n.quadDa([c,F,h+1,m,M,v,y,p],[c,D,h+1,m,M,v,y,p],[c,D,h,m,M,v,y,p],[c,F,h,m,M,v,y,p]):_===1?n.quadDa([c+1,F,h+1,m,M,v,y,p],[c+1,D,h+1,m,M,v,y,p],[c,D,h+1,m,M,v,y,p],[c,F,h+1,m,M,v,y,p]):n.quadDa([c,F,h,m,M,v,y,p],[c,D,h,m,M,v,y,p],[c+1,D,h,m,M,v,y,p],[c+1,F,h,m,M,v,y,p]),L<u&&(u=L)}}if(b===S.erba)for(let E=0;E<e;E++){if(O(z,I,i+20+E)<.25)continue;let m=1,T=c+0,L=h+0,M=at,y=at|ct,v=Math.floor(O(z,I,i+30+E)*255);n.quadDa([T,s+1,L,2,15,R,S.filo,v,M],[T,s+1+m,L,2,15,R,S.filo,v,y],[T+1,s+1+m,L+1,2,15,R,S.filo,v,y],[T+1,s+1,L+1,2,15,R,S.filo,v,M]),n.quadDa([T+1,s+1,L,2,15,R,S.filo,v,M],[T+1,s+1+m,L,2,15,R,S.filo,v,y],[T,s+1+m,L+1,2,15,R,S.filo,v,y],[T,s+1,L+1,2,15,R,S.filo,v,M]),s+2>f&&(f=s+2)}}for(let c of bt(t,o,i)){let h=Math.floor(c.x)-r,z=Math.floor(c.z)-l,I=c.y-3;for(let s=I+1;s<=c.y;s++){let b=s===c.y?S.lampada:S.tronco,p=s===c.y?15:12,R=h+.5-.15,j=h+.5+.15,E=Math.floor(R),_=Math.min(16,Math.floor(R)+1),m=z,T=z+1;n.quadDa([_,s,m,0,12,p,b,0],[_,s+1,m,0,12,p,b,0],[_,s+1,T,0,12,p,b,0],[_,s,T,0,12,p,b,0]),n.quadDa([E,s,T,1,12,p,b,0],[E,s+1,T,1,12,p,b,0],[E,s+1,m,1,12,p,b,0],[E,s,m,1,12,p,b,0]),n.quadDa([_,s,T,4,12,p,b,0],[_,s+1,T,4,12,p,b,0],[E,s+1,T,4,12,p,b,0],[E,s,T,4,12,p,b,0]),n.quadDa([E,s,m,5,12,p,b,0],[E,s+1,m,5,12,p,b,0],[_,s+1,m,5,12,p,b,0],[_,s,m,5,12,p,b,0]),s===c.y&&n.quadDa([E,s+1,m,2,15,p,b,0],[E,s+1,T,2,15,p,b,0],[_,s+1,T,2,15,p,b,0],[_,s+1,m,2,15,p,b,0]),s+1>f&&(f=s+1)}}return{...n.dati(),minY:u,maxY:f,cx:t,cz:o}}function At(t={}){let o=(i,e=1)=>typeof i=="number"&&isFinite(i)?+i.toFixed(e):null;return{quando:t.quando||null,gioco:"Leafy-Shadows",versione:t.versione||"in sviluppo",nota:typeof t.nota=="string"?t.nota.slice(0,400):"",dispositivo:{classe:t.mobile?"mobile":"desktop",tocco:!!t.tocco,modoGui:t.modoGui||"auto",ua:(t.ua||"").slice(0,220),cpu:t.cpu||null,memoriaGB:t.memoriaGB||null},schermo:{css:t.css||null,reso:t.reso||null,dpr:o(t.dpr,3),rapporto:t.css&&t.reso&&t.css[0]?o(t.reso[0]/t.css[0],2):null},qualita:{livello:t.livello,di:t.quantiLivelli,manuale:!!t.manuale,profilo:t.profilo||null,ombreLampade:!!t.ombreLampade,antialias:!!t.antialias},prestazioni:{fps:o(t.fps,0),p50ms:o(t.p50,2),p99ms:o(t.p99,2),disegni:t.disegni??null,triangoli:t.triangoli??null,ombreMs:o(t.ombreMs,2),storiaFps:Array.isArray(t.storiaFps)?t.storiaFps.slice(-60).map(i=>Math.round(i)):[],storiaLivelli:Array.isArray(t.storiaLivelli)?t.storiaLivelli.slice(-20):[]},scheda:{nome:(t.scheda||"").slice(0,120),software:!!t.software},mondo:{chunk:t.chunk??null,blocchi:t.blocchi??null,luci:t.luci??null,decorazioni:t.decorazioni??null,erba:t.erba??null,ora:t.ora||null,giorno:t.giorno??null,worldgenMs:o(t.worldgenMs,0),meshMs:o(t.meshMs,0)},errori:(t.errori||[]).slice(-12).map(i=>String(i).slice(0,500)),scatto:t.scatto||null}}function Tt(t){return Math.round(JSON.stringify(t).length/1024)}var Ut=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),P=(t,o)=>t>>>o|t<<32-o;function Mt(t){let o=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),i=t.length*8,e=new Uint8Array(t.length+9+63>>6<<6);e.set(t),e[t.length]=128,new DataView(e.buffer).setUint32(e.length-4,i>>>0),new DataView(e.buffer).setUint32(e.length-8,Math.floor(i/4294967296));let a=new Uint32Array(64),n=new DataView(e.buffer);for(let l=0;l<e.length;l+=64){for(let s=0;s<16;s++)a[s]=n.getUint32(l+s*4);for(let s=16;s<64;s++){let b=P(a[s-15],7)^P(a[s-15],18)^a[s-15]>>>3,p=P(a[s-2],17)^P(a[s-2],19)^a[s-2]>>>10;a[s]=a[s-16]+b+a[s-7]+p>>>0}let[u,f,d,g,c,h,z,I]=o;for(let s=0;s<64;s++){let b=P(c,6)^P(c,11)^P(c,25),p=c&h^~c&z,R=I+b+p+Ut[s]+a[s]>>>0,j=P(u,2)^P(u,13)^P(u,22),E=u&f^u&d^f&d,_=j+E>>>0;I=z,z=h,h=c,c=g+R>>>0,g=d,d=f,f=u,u=R+_>>>0}o[0]=o[0]+u>>>0,o[1]=o[1]+f>>>0,o[2]=o[2]+d>>>0,o[3]=o[3]+g>>>0,o[4]=o[4]+c>>>0,o[5]=o[5]+h>>>0,o[6]=o[6]+z>>>0,o[7]=o[7]+I>>>0}let r="";for(let l of o)r+=l.toString(16).padStart(8,"0");return r}var Ft="https://ntfy.sh",Dt=4096;async function qt(t){let o=new TextEncoder().encode("leafy-shadows/"+t),i;if(globalThis.crypto&&crypto.subtle){let e=await crypto.subtle.digest("SHA-256",o);i=[...new Uint8Array(e)].map(a=>a.toString(16).padStart(2,"0")).join("")}else i=Mt(o);return"leafy-"+i.slice(0,24)}async function yt(t,o){let i=await qt(t),e=await fetch(`${Ft}/${i}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:o});if(!e.ok)return{ok:!1,dice:`il servizio ha detto no: ${e.status}`};let a=await e.json().catch(()=>({})),n=o.length>Dt;return{ok:!0,id:a.id||"",dice:n?`mandato \u2714 (${Math.round(o.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(o.length/1024)} KB, dura 12 ore)`}}var zt="leafy.diagnostica.chiave",Bt=`
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
`,Q=class{constructor(o,i){this.leggi=o,this.scatta=i,this.errori=[],addEventListener("error",a=>this._errore(a.error||a.message)),addEventListener("unhandledrejection",a=>this._errore(a.reason));let e=document.createElement("style");e.textContent=Bt,document.head.appendChild(e),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(o){let i=o&&o.stack?o.stack:String(o);this.errori.push(i),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(zt)||""}catch{return""}}set chiave(o){try{localStorage.setItem(zt,o)}catch{}}apri(){let o=this.pannello;o.classList.add("aperto"),o.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,o.querySelector("#diagChiudi").onclick=()=>o.classList.remove("aperto"),o.querySelector("#diagCopia").onclick=()=>this.vai(!0),o.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let i=o.querySelector("#diagNota");i&&i.focus()},30)}_dice(o){let i=this.pannello.querySelector("#diagEsito");i&&(i.textContent=o)}async vai(o){let i=this.pannello.querySelector("#diagChiave");i&&i.value.trim()&&(this.chiave=i.value.trim());let e=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let a=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,n=null;if(a)try{n=this.scatta?await this.scatta():null}catch(d){this._errore(d)}let r=At({...this.leggi(),quando:new Date().toISOString(),nota:e,errori:this.errori,scatto:n}),l=Tt(r),u=JSON.stringify(r,null,1);if(o){await this._negliAppunti(u),this.nodo.classList.remove("corso");return}let f=!1;try{let d=await fetch("/_diagnostica",{method:"GET"});f=d.ok&&(await d.json().catch(()=>({}))).collettore===!0}catch{f=!1}if(f)try{let d=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:u});if(d.status===403)this._dice("password sbagliata."),this.chiave="";else if(d.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!d.ok)this._dice("il collettore ha detto no: "+d.status);else{let g=await d.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${g.nome||""}  (${l} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let d=await yt(this.chiave,u);this._dice(d.ok?d.dice+`
(fuori casa: passa dal cloud)`:d.dice),d.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(u,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(o,i=""){try{await navigator.clipboard.writeText(o),this._dice(i+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let e=new Blob([o],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(e),a.download="leafy-diagnostica.json",a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),4e3),this._dice(i+`scaricato come file \u2714
mandami quello.`)}}};var C=document.getElementById("tela"),Vt=document.getElementById("stato"),$t=document.getElementById("fps"),$=new URLSearchParams(location.search),w={raggio:+($.get("raggio")||5),erba:+($.get("erba")??2),ombra:$.get("ombra")!=="no",dprMax:+($.get("dpr")||1.5),rampa:$.has("rampa"),tutto:$.has("tutto")},{gl:Y,dpr:Gt,ridimensiona:Yt}=nt(C,{antialias:!0,dprMax:w.dprMax}),x=new W(Y);x.impostaTavolozza(xt);x.ombra=w.ombra;var rt=0,X=0;function Rt(t,o){let i=performance.now();for(let n of[...x.chunks.keys()])x.rimuovi(n);rt=0;for(let n=-t;n<t;n++)for(let r=-t;r<t;r++)x.carica(n+","+r,Et(n,r,{erba:o})),rt+=256;let e=t*2*16,a=new Uint8Array(e*e);for(let n=0;n<e;n++)for(let r=0;r<e;r++)a[n*e+r]=V(r-t*16,n-t*16)+1;x.impostaAltezze(a,-t*16,-t*16,e,e),X=performance.now()-i}Rt(w.raggio,w.erba);x.tutto=w.tutto;var A={alpha:-.8,beta:1.05,raggio:46,centro:[0,V(0,0)+2,0],fov:.9};function Lt(){let t=Math.sin(A.beta),o=Math.cos(A.beta);return[A.centro[0]+A.raggio*t*Math.cos(A.alpha),A.centro[1]+A.raggio*o,A.centro[2]+A.raggio*t*Math.sin(A.alpha)]}var G=null,Z=0;C.addEventListener("pointerdown",t=>{G={x:t.clientX,y:t.clientY},C.setPointerCapture(t.pointerId)});C.addEventListener("pointermove",t=>{G&&(A.alpha+=(t.clientX-G.x)*.006,A.beta=Math.max(.15,Math.min(1.5,A.beta-(t.clientY-G.y)*.006)),G={x:t.clientX,y:t.clientY})});C.addEventListener("pointerup",()=>{G=null});C.addEventListener("wheel",t=>{A.raggio=Math.max(8,Math.min(140,A.raggio*(t.deltaY>0?1.1:.9))),t.preventDefault()},{passive:!1});C.addEventListener("touchstart",t=>{t.touches.length===2&&(Z=Math.hypot(t.touches[0].clientX-t.touches[1].clientX,t.touches[0].clientY-t.touches[1].clientY))},{passive:!0});C.addEventListener("touchmove",t=>{if(t.touches.length!==2)return;let o=Math.hypot(t.touches[0].clientX-t.touches[1].clientX,t.touches[0].clientY-t.touches[1].clientY);Z>0&&(A.raggio=Math.max(8,Math.min(140,A.raggio*Z/o))),Z=o},{passive:!0});var J=.35;function Xt(t){J=(J+t/300)%1;let o=J*Math.PI*2-Math.PI/2,i=Math.max(.24,Math.sin(o)),e=o*.5;x.sole.verso=[-Math.cos(e)*Math.cos(Math.asin(i)),-i,-Math.sin(e)*Math.cos(Math.asin(i))];let a=Math.max(0,Math.min(1,(Math.sin(o)+.1)*2));x.sole.forza=a,x.sole.colore=[1,.86+.1*a,.66+.2*a],x.nebbia.colore=[.25+.47*a,.35+.5*a,.5+.42*a],Y.clearColor(x.nebbia.colore[0],x.nebbia.colore[1],x.nebbia.colore[2],1)}var k=[],U=[],tt=[],St=performance.now(),_t=0,Ct=0;function Nt(t){let o=Math.min(.1,(t-St)/1e3);St=t;let i=performance.now();Yt(),Xt(o);let e=Lt();x.disegna({occhio:e,centro:A.centro,fov:A.fov,rapporto:C.width/C.height},o);let a=performance.now()-i;k.push(o*1e3),k.length>240&&k.shift(),U.push(a),U.length>240&&U.shift(),_t++,t-Ct>500&&(Ct=t,It()),w.rampa&&jt(t),requestAnimationFrame(Nt)}var ot=[{raggio:5,erba:2,tutto:!1},{raggio:6,erba:3,tutto:!1},{raggio:7,erba:4,tutto:!1},{raggio:6,erba:3,tutto:!0},{raggio:8,erba:4,tutto:!0}],et=[],B=-1,wt=0;function jt(t){if(B>=0&&t-wt<6e3)return;if(B>=0){let i=k.slice(-Math.min(k.length,200)),e=ot[B];et.push({...e,fps:+(1e3/(N(i,.5)||1)).toFixed(0),p50:+N(i,.5).toFixed(1),p99:+N(i,.99).toFixed(1),js:+N(U,.5).toFixed(2),disegni:x.statistiche.disegni,triangoli:x.statistiche.triangoli})}if(B++,B>=ot.length){w.rampa=!1,It();return}let o=ot[B];Rt(o.raggio,o.erba),x.tutto=o.tutto,w.erba=o.erba,w.raggio=o.raggio,k.length=0,U.length=0,wt=t}var N=(t,o)=>{if(!t.length)return 0;let i=t.slice().sort((e,a)=>e-a);return i[Math.min(i.length-1,Math.floor(i.length*o))]};function It(){let t=N(k,.5),o=N(k,.99),i=t?1e3/t:0;tt.push(Math.round(i)),tt.length>120&&tt.shift();let e=x.statistiche;$t.textContent=`${i.toFixed(0)} fps
${t.toFixed(1)} / ${o.toFixed(1)} ms
JS ${N(U,.5).toFixed(2)} ms`,Vt.textContent=`NUCLEO F0 \xB7 ${C.width}\xD7${C.height} (dpr ${Gt.toFixed(2)})
disegni ${e.disegni}  triangoli ${e.triangoli.toLocaleString("it")}  chunk ${e.chunkVisti}/${e.chunkTotali}
ombra del sole: ${x.ombra?"horizon mapping":"spenta"} \xB7 erba ${w.erba} \xB7 costruzione ${X.toFixed(0)} ms
${H(Y)}
?raggio=${w.raggio} ?erba=${w.erba} ?ombra=${w.ombra?"s\xEC":"no"} ?dpr=${w.dprMax} ?rampa ?tutto  \xB7  tocca lo schermo per girare`+(et.length?`
RAMPA  fps  p50   p99   dis  triangoli
`+et.map(a=>`r${a.raggio} e${a.erba}${a.tutto?" tutto":""}  ${String(a.fps).padStart(3)}  ${String(a.p50).padStart(5)}  ${String(a.p99).padStart(5)}  ${String(a.disegni).padStart(3)}  ${a.triangoli.toLocaleString("it")}`).join(`
`):"")+(w.rampa?`
rampa: gradino ${B+1}/${ot.length}\u2026`:"")}requestAnimationFrame(Nt);var Ht=new Q(()=>({versione:(document.getElementById("versione")||{}).textContent||"nucleo in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:"nucleo",ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[C.clientWidth,C.clientHeight],reso:[C.width,C.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:"nucleo F0",raggio:w.raggio,erba:w.erba,ombra:x.ombra,tutto:!!x.tutto,dprMax:w.dprMax,jsMs:+N(U,.5).toFixed(2),jsP99:+N(U,.99).toFixed(2),rampa:et},ombreLampade:!1,antialias:!0,fps:N(k,.5)?1e3/N(k,.5):null,p50:N(k,.5),p99:N(k,.99),disegni:x.statistiche.disegni,triangoli:x.statistiche.triangoli,ombreMs:0,storiaFps:tt,storiaLivelli:[],scheda:H(Y),software:/swiftshader|llvmpipe/i.test(H(Y)),chunk:x.statistiche.chunkTotali,blocchi:rt,luci:0,decorazioni:0,erba:0,ora:`${Math.floor(J*24)}h`,giorno:0,worldgenMs:X,meshMs:X}),()=>{let t=Lt();return x.disegna({occhio:t,centro:A.centro,fov:A.fov,rapporto:C.width/C.height},0),Promise.resolve(C.toDataURL("image/webp",.6))});globalThis.NUCLEO={resa:x,cam:A,opz:w,statistiche:()=>({fps:1e3/(N(k,.5)||1),p50:N(k,.5),p99:N(k,.99),js:N(U,.5),...x.statistiche,costruzioneMs:X,fotogrammi:_t}),diagnostica:Ht};

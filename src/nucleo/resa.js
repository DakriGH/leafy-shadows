// LA RESA DEL NUCLEO — un programma, un formato, un disegno per chunk.
//
// Lo stile è quello di Leafy espresso sulla luce COTTA (docs/RIFONDAZIONE.md,
// tecnica 1): la luce del cielo e quella di blocco arrivano dal vertice, il
// ciclo del giorno le colora, «una faccia vede il sole o no» resta un gradino,
// l'ombra è del colore del cielo, le lampade fanno bande. L'unica cosa per
// pixel è l'ombra direzionale del sole via HORIZON MAPPING sulla mappa delle
// altezze (tecnica 1, seconda parte): pochi passi verso il sole, niente mappa
// d'ombra, niente acne per costruzione. È accendibile, per misurarla.
import { compila } from './gl.js';
import { BYTE_VERTICE, indiciCondivisi, QUAD_MAX } from './formato.js';
import { prospettiva, guarda, moltiplica, pianiFrustum, scatolaNelFrustum, ortografica, inverti } from './matrici.js';

const VS = `#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale vento materia · B: y cielo blocco (nucleo/formato.js)
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
flat out float vSole;         // quanto sole prende la faccia, a bande (l'horizon map lo può togliere)
flat out float vEmis;         // materia emissiva
flat out float vCielo;        // il cielo è PER FACCIA (la regola di Leafy: niente sfumature sui solidi)
flat out float vFaccia;       // 1 = la faccia guarda il sole, 0 = è di spalle (sui blocchi: sempre 1)
flat out vec3 vN;             // la normale geometrica: serve alla mappa d'ombra per non avere acne
flat out vec3 vOmbra;         // il colore d'ombra stilizzato (hue shift verso il blu), lineare
out float vBlocco;            // la luce di blocco sfuma: le pozze dei lampioni sono tonde
out float vNebbia;
out vec3 vPos;
// ⚠ L'OMBRA DI LEAFY NON È «PIÙ SCURO»: è lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' più satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: «le ombre sono solo il colore
// hue shift più scuro stilizzato».
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
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via più corta verso il blu
  h.x = fract(h.x + d * uStile.x);   // ⚠ POCO (0,07): al 14 % il terracotta diventava mattone rosso
  h.y = min(1.0, h.y * uStile.y + 0.03);
  h.z *= uStile.z;
  return hsv2rgb(h);
}
void main() {
  // ⚠ POSIZIONI IN SEDICESIMI (nucleo/formato.js): x e z con un blocco di margine, y dallo scarto del chunk
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
  // ⚠ IL COLORE È QUELLO COTTO DAL MESHER (la palette di Leafy), in spazio lineare
  vBase = pow(vec3(aC.xyz) / 255.0, vec3(2.2));
  vOmbra = pow(ombraStile(vec3(aC.xyz) / 255.0), vec3(2.2));
  vEmis = uMaterie[materia].x;
  // ⚠ LA LUCE È A DUE BANDE PER DIREZIONE DEL SOLE, come nel cel shading: una
  // faccia che guarda il sole ha il colore pieno, una di spalle ha il colore
  // d'ombra — lo STESSO di chi sta nell'ombra portata. Non è lo shading di
  // Minecraft (che scurisce i lati sempre, per convenzione): due oggetti dello
  // stesso colore hanno lo stesso colore, e cambia solo chi è al sole o in
  // ombra. Senza questo tutto era piatto («come se tutto fosse piatto»).
  // ⚠ SUI BLOCCHI NIENTE BANDE PER DIREZIONE (la regola di Leafy, ripetuta
  // tre volte dal committente: «a bordo dei blocchi vedo ancora un leggero
  // face shading e abbiamo detto di non farlo»): tutte le facce, smussi
  // compresi, hanno il colore pieno; scurisce SOLO l'ombra portata (la mappa)
  // e la mancanza di cielo. I modelli invece hanno due tinte (modelli.js).
  vFaccia = 1.0;
  vN = n;
  vSole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  float d = distance(p, uCam);
  vNebbia = clamp((d - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`;

const FS = `#version 300 es
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
in highp vec3 vPos;   // ⚠ highp: l'ombra si legge a coordinate di mondo (±256), in mediump ballerebbe di un quarto di blocco
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI più vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// ⚠ LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni («esagonale»).
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
uniform vec3 uCieloCol;          // il colore dell'ombra: È il cielo
uniform float uOmbra;            // 1 = ombra del sole accesa
uniform highp float uSoleForza;  // ⚠ highp come nel vertex, o il link fallisce («precisions differ»)
uniform highp float uTaglio;     // sotto questa quota non si disegna (la passata dello specchio)
// ⚠ STESSA PRECISIONE DEL VERTEX: un uniform condiviso fra i due shader deve
// avere la stessa precisione, o il link fallisce («precisions differ»).
uniform highp vec3 uSoleVerso;
uniform sampler2D uOmbre;        // la mappa delle ombre: quota d'ombra per colonna (Resa._calcolaOmbre)
uniform vec2 uOmbreScala;        // come si decodifica: quota = r * x + y
uniform highp vec4 uAltRett;           // x0, z0, 1/larghezza, 1/profondita
uniform highp vec4 uBuco;        // il buco di visuale della terza persona: il giocatore (xyz) e il raggio (0 = spento)
uniform highp vec3 uOcchio;      // da dove guarda la camera
uniform highp sampler2DShadow uMappaStat;   // la mappa d'ombra FERMA: terreno, lampioni, alberi (si rifà quando serve)
uniform highp sampler2DShadow uMappaDin;    // quella di chi si muove (gatto, corpi): ogni fotogramma, piccola
uniform highp mat4 uLuceVP;                 // mondo → clip del sole
uniform float uMappaOn;                     // 1 = la mappa vale
uniform vec2 uMappaSbieco;                  // x: scostamento lungo la normale (blocchi), y: bias di profondità (clip 0..1)
// ⚠ LA MAPPA D'OMBRA VERA (Resa._aggiornaMappa): profondità vista dal sole,
// quindi l'ombra ha la FORMA della cosa — il palo del lampione, il gatto, la
// chioma — non della colonna. Il confronto lo fa la texture (sampler2DShadow,
// 2×2 in hardware: bordo netto ma senza scalini); lo scostamento lungo la
// normale e il bias tolgono l'acne. Fuori dalla mappa torna -1 e si usa la
// mappa per colonna (ombraSole), che copre tutto il mondo in streaming.
uniform highp mat4 uLuceVPDin;              // mondo → clip della mappa di chi si muove (più stretta: più fitta)
uniform vec2 uMappaTexel;                   // mezzo texel delle due mappe, in uv
// ⚠ QUATTRO LETTURE A MEZZO TEXEL E POI UNA SOGLIA: il bordo resta netto ma
// senza scalini (le ombre «pixellate»). Ogni lettura è già un 2×2 in hardware.
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
// ⚠ L'OMBRA DEL SOLE È UNA LETTURA SOLA: la mappa delle ombre (uOmbre, per
// colonna: la quota sotto cui si è in ombra, calcolata dalla GPU quando il sole
// si sposta, vedi Resa._calcolaOmbre) letta mezzo blocco VERSO il sole (così
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
  // interpolata: pozze tonde), il sole diretto solo dove il cielo è pieno
  float cieloB = floor(vCielo * 4.0 + 0.5) / 4.0;
  // ⚠ LE POZZE: cerchi netti (pozza) dove la luce cotta dice che la luce arriva,
  // le bande cotte per le lampade-blocco; di giorno si spengono (il sole le sovrasta)
  float notte = 1.0 - smoothstep(0.30, 0.75, uSoleForza);
  float lamp = max(pozza(vPos) * step(0.02, vBlocco), floor(vBlocco * 4.0 + 0.5) / 4.0) * notte;
  float sole = vSole * step(0.99, vCielo) * luce;
  // l'ombra: il colore stilizzato (hue shift), tinto dal giorno/notte, più scuro senza cielo
  vec3 ombra = vOmbra * uCieloCol * (0.30 + 0.70 * cieloB);
  vec3 pieno = vBase * uSoleCol;
  if (vEmis > 0.0) { ombra = mix(ombra, vBase * 1.15, vEmis); pieno = mix(pieno, vBase * 1.15, vEmis); }   // emissiva: scavalca ombra e notte
  // ⚠ LE POZZE DEI LAMPIONI SONO CALDE E PIENE: 1,3 sopra il bianco
  vec3 c = mix(ombra, pieno, sole) + vBase * vec3(1.30, 1.02, 0.58) * lamp;
  // ⚠ I CONTI SONO IN SPAZIO LINEARE: qui si torna in sRGB, o tutto esce scuro e saturo.
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, 1.0);
}`;

// ── L'ACQUA: un programma suo, una passata sola, dopo i solidi ──────────────
// La legge del lago, parola per parola del committente («a 10 blocchi di
// profondità il tutto diventa violaceo ed è leggermente opaco; salendo hue
// shift e trasparenza maggiore verso la superficie»; «radente, il lago diventa
// il cielo capovolto»): superficie azzurra e trasparente, fondo violaceo e
// quasi pieno, la profondità viene dal VERTICE (il mesher la sa), il cielo
// capovolto è fresnel verso il colore della nebbia/cielo. Onde nel vertex, un
// brillio a gradino verso il sole. Niente rifrazione, niente depth pass.
//
// ⚠ LO SPECCHIO (F3, misurato): una passata in più PRIMA dei solidi, a mezza
// risoluzione, con la camera specchiata rispetto al pelo (matrice di
// riflessione: stesso VP per la posizione a schermo, quindi il fragment
// dell'acqua legge il riflesso con gl_FragCoord, senza coordinate in più) e
// il taglio sotto il pelo. Costa i disegni dei solidi e dei modelli visti
// dallo specchio, e si spegne da solo quando l'acqua non è a schermo o si è
// sott'acqua. È «la stessa telecamera specchiata» che chiedeva il committente.
const VS_ACQUA = `#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale cima · B: y prof livello
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
// ⚠ TRE ONDE LUNGHE DA TRE DIREZIONI, con lunghezze che non si dividono
// (12, 7 e 4,6 blocchi) e velocità diverse: così il disegno non si ripete a
// vista. Le stesse tre stanno nel fragment (la normale è la loro derivata),
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
}`;
const FS_ACQUA = `#version 300 es
// ⚠ highp come il vertex: gli uniform sono condivisi e la precisione deve coincidere
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
// ⚠ LE INCRESPATURE: tre onde corte (1,5 · 1 · 0,65 blocchi) e svelte sopra
// quelle lunghe. Sono loro a rompere la ripetizione e a fare le scintille del
// sole: senza, le onde lunghe da sole facevano bolle («metaball»).
vec2 increspa(vec2 p, float t) {
  return vec2(0.96, 0.28) * 0.50 * cos(dot(p, vec2(0.96, 0.28)) * 4.1 + t * 3.1)
       + vec2(-0.37, 0.93) * 0.35 * cos(dot(p, vec2(-0.37, 0.93)) * 6.3 + t * 2.4)
       + vec2(0.71, -0.71) * 0.20 * cos(dot(p, vec2(0.71, -0.71)) * 9.7 + t * 4.0 + 1.7);
}
void main() {
  vec3 vista = normalize(uCam - vPos);
  float dist = distance(uCam, vPos);
  // ⚠ LA NORMALE VIENE DALLE ONDE LUNGHE E BASTA: lisce e leggibili. Le
  // increspature fini facevano un riflesso «casuale» e brillii a coriandoli
  // («guardando il sole si nota che le onde non sono fatte bene»).
  vec2 g = pendenza(vPos.xz, uTempo) * mix(0.05, 0.22, uMare);
  vec3 n = vPelo > 0.5 ? normalize(vec3(-g.x, 1.0, -g.y)) : vec3(0.0, 1.0, 0.0);
  // profondità → violaceo e opaco (scala 0,12 per blocco, corpo come la ricetta)
  float k = clamp(vProf * 0.12, 0.0, 1.0);
  vec3 viola = pow(vec3(0.38, 0.30, 0.62), vec3(2.2));
  vec3 acqua = mix(vCol, viola, k * 0.75);
  float alfa = mix(0.34, 0.88, k);
  // il sole: la luce sul pelo, a gradino (prima del riflesso: il riflesso ha già la sua luce)
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  acqua *= mix(uCieloCol * 0.7, uSoleCol, sole * 0.85);
  // il cielo capovolto: fresnel verso il colore del cielo (la nebbia È il cielo all'orizzonte)
  float fres = pow(1.0 - max(dot(n, vista), 0.0), 3.0);
  vec3 cielo = pow(uNebbiaCol, vec3(2.2));
  // ⚠ LO SPECCHIO SI LEGGE A SCHERMO: la passata specchiata usa la stessa
  // proiezione, quindi il riflesso di questo pixel sta in questo pixel. Le
  // onde lo spostano di un soffio (n.xz), che è quanto basta a farlo vivere.
  // ⚠ LA DEFORMAZIONE È PICCOLA (1-4 % dello schermo, con lo 0,45 di prima
  // erano bolle) e CALA CON LA DISTANZA (da lontano un'onda è un pixel), e si
  // spegne ai bordi dello schermo: fuori dallo specchio non c'è niente, e il
  // riflesso «tagliato» era il bordo che si spalmava.
  vec2 s = gl_FragCoord.xy * uSchermo.xy;
  float bordo = smoothstep(0.0, 0.08, min(min(s.x, 1.0 - s.x), min(s.y, 1.0 - s.y)));
  vec2 uv = clamp(s + n.xz * mix(0.03, 0.10, uMare) * vPelo * bordo / (1.0 + dist * 0.02), 0.002, 0.998);
  vec3 riflesso = mix(cielo, pow(texture(uSpecchio, uv).rgb, vec3(2.2)), uSchermo.z);
  // ⚠ IL CIELO CAPOVOLTO SOLO RADENTE quando non c'è specchio: a 45° il fresnel
  // cubico vale il 2%. Con lo specchio il riflesso c'è sempre un po' (22%) e
  // radente è quasi tutto (85%): l'acqua resta acqua guardandola dall'alto.
  // dall'alto l'acqua resta del SUO colore (riflesso al 20 %, calmo; 12 % mosso), radente è cielo
  float peso = mix(fres * 0.55, mix(mix(0.20, 0.12, uMare), 0.85, fres), uSchermo.z) * vPelo;
  acqua = mix(acqua, riflesso, peso);
  alfa = mix(alfa, 0.95, fres * vPelo);
  // il brillio del sole: una banda netta sulle onde lunghe (cel), più larga col mare mosso
  float brillio = step(mix(0.994, 0.982, uMare), dot(reflect(-vista, n), -uSoleVerso)) * uSoleForza * vPelo;
  acqua += vec3(0.8) * brillio;
  vec3 c = pow(mix(acqua, cielo, vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, mix(alfa, 1.0, vNebbia));
}`;

// ── L'ERBA: fili a triangolo, un disegno per chunk, due facce, opaca ────────
const VS_ERBA = `#version 300 es
precision highp float;
// ⚠ UNA LAMELLA È UN'ISTANZA (nucleo/erba.js): la geometria la fa gl_VertexID
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
// ⚠ L'OMBRA DI LEAFY NON È «PIÙ SCURO»: è lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' più satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: «le ombre sono solo il colore
// hue shift più scuro stilizzato».
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
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via più corta verso il blu
  h.x = fract(h.x + d * uStile.x);   // ⚠ POCO (0,07): al 14 % il terracotta diventava mattone rosso
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
  // ⚠ IL COLORE È QUELLO DELLA CIMA DEL BLOCCO SOTTO, e la punta se ne scosta
  // di poco (0,90…1,10, quasi sempre ±3%): la sfumatura di Leafy, non un
  // gradiente scuro-chiaro. Cel shading alla Zelda: la lamella è del prato.
  float scosta = 0.9 + 0.2 * float(aC.w >> 4u) / 15.0;
  vBase = pow(vec3(aB.xyz) / 255.0, vec3(2.2)) * mix(1.0, scosta, punta);
  vOmbra = pow(ombraStile(vec3(aB.xyz) / 255.0), vec3(2.2)) * mix(1.0, scosta, punta);
  // l'erba è del prato: guarda il sole come la cima del blocco (normale in su), senza bande sue
  vSole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  vFaccia = 1.0; vN = vec3(0.0, 1.0, 0.0);
  vCielo = cielo; vBlocco = float(aC.w & 15u) / 15.0; vEmis = 0.0;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`;

// ── IL CIELO: un triangolo a tutto schermo, il verso di vista dall'inversa del VP ──
const VS_CIELO = `#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`;
const FS_CIELO = `#version 300 es
precision highp float;
in vec2 vNdc;
uniform mat4 uInvVP;
uniform vec3 uOcchio;
uniform vec3 uSoleVerso;
uniform float uSoleForza;
uniform vec3 uNebbiaCol;   // l'orizzonte (sRGB): la nebbia, così il lontano ci si fonde
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
}`;

// ── LA PASSATA D'OMBRA: la profondità vista dal sole, e basta ─────────────
const VS_OMBRA = `#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`;
const FS_VUOTO = `#version 300 es
precision mediump float;
void main() {}`;

export class Resa {
  constructor(gl) {
    this.gl = gl;
    this.programma = compila(gl, VS, FS);
    this.u = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uMaterie', 'uNebbia', 'uCam', 'uNebbiaCol', 'uOmbra', 'uOmbre', 'uOmbreScala', 'uAltRett', 'uTaglio', 'uBuco', 'uOcchio', 'uMappaStat', 'uMappaDin', 'uLuceVP', 'uLuceVPDin', 'uMappaTexel', 'uMappaOn', 'uMappaSbieco', 'uLampade', 'uNLampade', 'uStile']) {
      this.u[n] = gl.getUniformLocation(this.programma, n);
    }
    // ⚠ UN SOLO BUFFER DI INDICI PER TUTTI I CHUNK (formato.js)
    this.ebo = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indiciCondivisi(QUAD_MAX), gl.STATIC_DRAW);
    // stesso fragment dei solidi (horizon mapping, nebbia), ma con i colori INTERPOLATI: la lamella sfuma dalla base alla punta
    this.programmaErba = compila(gl, VS_ERBA, FS.replace(/flat in /g, 'in '));
    this.ue = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uNebbia', 'uCam', 'uVento', 'uNebbiaCol', 'uOmbra', 'uOmbre', 'uOmbreScala', 'uAltRett', 'uTaglio', 'uErbaFinoA', 'uBuco', 'uOcchio', 'uMappaStat', 'uMappaDin', 'uLuceVP', 'uLuceVPDin', 'uMappaTexel', 'uMappaOn', 'uMappaSbieco', 'uLampade', 'uNLampade', 'uStile']) this.ue[n] = gl.getUniformLocation(this.programmaErba, n);
    // ⚠ LA PASSATA D'OMBRA: solo posizione, niente colore (il fragment è vuoto)
    this.programmaOmbra = compila(gl, VS_OMBRA, FS_VUOTO);
    this.uo = { uVP: gl.getUniformLocation(this.programmaOmbra, 'uVP'), uChunk: gl.getUniformLocation(this.programmaOmbra, 'uChunk') };
    this.programmaAcqua = compila(gl, VS_ACQUA, FS_ACQUA);
    this.ua = {};
    for (const n of ['uVP', 'uChunk', 'uTempo', 'uCam', 'uNebbia', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uNebbiaCol', 'uSpecchio', 'uSchermo', 'uMare']) this.ua[n] = gl.getUniformLocation(this.programmaAcqua, n);
    // ⚠ IL CIELO: un triangolo a tutto schermo, sfumato dall'orizzonte (il colore
    // della nebbia, così il lontano ci si fonde) allo zenit, col disco del sole
    // e il suo alone. Si disegna PRIMA di tutto, senza profondità, anche nello
    // specchio. Senza, il cielo era una tinta piatta: «grezza».
    this.programmaCielo = compila(gl, VS_CIELO, FS_CIELO);
    this.uc = {}; for (const n of ['uInvVP', 'uOcchio', 'uSoleVerso', 'uSoleForza', 'uNebbiaCol', 'uZenit']) this.uc[n] = gl.getUniformLocation(this.programmaCielo, n);
    this.vaoVuoto = gl.createVertexArray();
    this._invVP = new Float32Array(16);
    this.mare = 0.25;   // il meteo: 0 specchio, 1 mosso (partita/meteo.js lo muove)
    this.chunks = new Map();
    this.altezze = null;
    this.statistiche = { disegni: 0, triangoli: 0, chunkVisti: 0, chunkTotali: 0, disegniAcqua: 0, triangoliAcqua: 0, disegniErba: 0, triangoliErba: 0, disegniSpecchio: 0, triangoliSpecchio: 0, pelo: null };
    this._visibili = [];
    this._visibiliErba = [];
    this._camera = null;
    // ⚠ LO SPECCHIO DELL'ACQUA: un framebuffer a `scala` della tela, riusato
    // finché la tela non cambia misura. `attivo` lo accende; si misura col
    // banco (`?specchio=no` per il confronto). `pelo` è la quota del piano.
    this.specchio = { attivo: true, scala: 0.5, fbo: null, tex: null, rbo: null, w: 0, h: 0, pelo: null, mostra: false };
    this.vpSpecchio = new Float32Array(16);
    this.pianiSpecchio = new Float32Array(24);
    this._riflessione = new Float32Array(16);
    this._voti = new Map();
    this.vpCorrente = null;     // il VP della passata in corso (specchio o vista): i modelli lo leggono
    // ⚠ LA FINESTRA DELLE ALTEZZE: nel mondo in streaming la mappa per l'horizon
    // mapping non può coprire tutto — è una texture quadrata che SEGUE chi
    // cammina (`apriFinestraAltezze`, `seguiAltezze`), e ogni chunk ci scrive la
    // sua tegola 16×16 quando entra o cambia. Nel banco resta la mappa intera.
    this.finestra = null;
    this._tegolaVuota = new Uint8Array(256);
    this.taglio = -1e9;         // la quota sotto cui la passata in corso non disegna
    this.buco = [0, 0, 0, 0];   // il buco di visuale (xyz, raggio; 0 = spento: di fabbrica il gatto si vede in SAGOMA attraverso i blocchi, vedi modelli.js)
    // ⚠ LA MAPPA DELLE OMBRE: per ogni colonna della mappa delle altezze, la
    // quota sotto cui si è in ombra del sole (la cima più alta incontrata
    // verso il sole, abbassata della pendenza). La calcola la GPU
    // (`_calcolaOmbre`) quando il sole si sposta o quando cambiano le altezze,
    // solo nel rettangolo cambiato; il fragment fa UNA lettura. Mezzo float se
    // la scheda lo permette (quote esatte), altrimenti R8 a quarti di blocco.
    this.ombre = { tex: null, fbo: null, w: 0, h: 0, sporco: null, sole: [0, 0, 0], scala: 1, offset: 0, mezzoFloat: false, calcoli: 0 };
    this._ombreMezzo = !!gl.getExtension('EXT_color_buffer_half_float') && !!gl.getExtension('OES_texture_half_float_linear');
    this.statistiche.calcoliOmbre = 0;
    // ⚠ LA MAPPA D'OMBRA VERA (vedi ombraMappa nel fragment): due texture di
    // profondità viste dal sole, ortografiche, centrate su chi si guarda.
    // `stat` (terreno + modelli fermi) si rifà solo quando il sole si sposta
    // di un quarto di grado, cambia un chunk o un modello fermo, o ci si
    // allontana di 8 blocchi dal centro; `din` (chi si muove) ogni fotogramma.
    // Oltre `raggio` blocchi dal centro vale la mappa per colonna qui sopra.
    this.mappa = { attiva: true, lato: 2048, latoDin: 1024, raggio: 32, raggioDin: 14, stat: null, din: null, vp: new Float32Array(16), vpDin: new Float32Array(16), centro: [1e9, 0, 1e9], sole: [0, 0, 0], sporca: true, on: false, calcoli: 0, disegni: 0, triangoli: 0 };
    // i lampioni accesi più vicini, per le pozze per pixel: [x, y, z, raggio] × 8 (la partita li scrive)
    this.lampade = new Float32Array(32); this.nLampade = 0;
    // lo stile dell'ombra (ombraStile nei vertex): tinta verso il blu, saturazione, valore
    this.stile = { tinta: 0.07, saturazione: 1.05, valore: 0.64 };
    this._preparaMappa();
    this.statistiche.calcoliMappa = 0; this.statistiche.disegniOmbra = 0; this.statistiche.triangoliOmbra = 0;
    gl.enable(gl.DEPTH_TEST);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);
    gl.clearColor(0.62, 0.81, 0.91, 1);
    this.vp = new Float32Array(16);
    this.piani = new Float32Array(24);
    this.tempo = 0;
    this.impostaMaterie([[0, 0, 0, 0], [1, 0, 0, 0]]);   // 0 nessuna, 1 emissiva (il banco)
    this.ombra = true;
    this.tutto = false;   // il banco: niente frustum, per misurare il tetto dei disegni
    this.erbaFinoA = 6 * 16;   // LOD: i fili entro sei chunk, come erbaR del profilo ULTRA
    this.sole = { verso: [-0.5, -0.7, -0.3], colore: [1.0, 0.96, 0.86], forza: 1.0, cielo: [0.60, 0.68, 0.82] };
    this.nebbia = { da: 90, a: 150, colore: [0.72, 0.85, 0.92] };
  }

  /** Carica (o sostituisce) un chunk: un VAO, un VBO, otto byte per vertice. */
  /** Un chunk a queste coordinate sta nella mappa d'ombra vera? Allora la sporca. */
  _sporcaMappa(x0, z0) {
    const m = this.mappa;
    if (Math.hypot(x0 + 8 - m.centro[0], z0 + 8 - m.centro[2]) <= m.raggio + 12) m.sporca = true;
  }

  carica(kc, dati) {
    const gl = this.gl;
    this._sporcaMappa(dati.cx * 16, dati.cz * 16);
    let c = this.chunks.get(kc);
    if (!c) {
      c = { vao: gl.createVertexArray(), vbo: gl.createBuffer(), quad: 0 };
      gl.bindVertexArray(c.vao);
      gl.bindBuffer(gl.ARRAY_BUFFER, c.vbo);
      gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 2, gl.UNSIGNED_INT, BYTE_VERTICE, 0);
      gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 8);
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
      gl.bindVertexArray(null);
      this.chunks.set(kc, c);
    }
    gl.bindBuffer(gl.ARRAY_BUFFER, c.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, dati.byte, gl.STATIC_DRAW);
    c.quad = dati.quad;
    // l'erba del chunk, se c'è: fili a triangolo, un VAO suo
    const e = dati.erba;
    c.verticiErba = e ? e.vertici : 0;
    c.lamelle = e ? e.fili : 0;
    c.yBaseErba = e ? e.yBase : 0;
    if (c.verticiErba > 0) {
      if (!c.vaoErba) {
        c.vaoErba = gl.createVertexArray(); c.vboErba = gl.createBuffer();
        gl.bindVertexArray(c.vaoErba);
        gl.bindBuffer(gl.ARRAY_BUFFER, c.vboErba);
        // ⚠ TRE ATTRIBUTI PER ISTANZA (divisor 1): dodici byte per lamella, sei vertici dal gl_VertexID
        gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 4, gl.UNSIGNED_BYTE, 12, 0); gl.vertexAttribDivisor(0, 1);
        gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, 12, 4); gl.vertexAttribDivisor(1, 1);
        gl.enableVertexAttribArray(2); gl.vertexAttribIPointer(2, 4, gl.UNSIGNED_BYTE, 12, 8); gl.vertexAttribDivisor(2, 1);
        gl.bindVertexArray(null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, c.vboErba);
      gl.bufferData(gl.ARRAY_BUFFER, e.byte, gl.STATIC_DRAW);
    }
    // l'acqua del chunk, se c'è: stesso formato, un VAO suo
    const a = dati.acqua;
    c.quadAcqua = a ? a.quad : 0;
    c.peloAcqua = a && a.pelo != null ? a.pelo : null;   // la quota del pelo più alto (per il piano dello specchio)
    if (c.quadAcqua > 0) {
      if (!c.vaoAcqua) {
        c.vaoAcqua = gl.createVertexArray(); c.vboAcqua = gl.createBuffer();
        gl.bindVertexArray(c.vaoAcqua);
        gl.bindBuffer(gl.ARRAY_BUFFER, c.vboAcqua);
        gl.enableVertexAttribArray(0); gl.vertexAttribIPointer(0, 2, gl.UNSIGNED_INT, BYTE_VERTICE, 0);
        gl.enableVertexAttribArray(1); gl.vertexAttribIPointer(1, 4, gl.UNSIGNED_BYTE, BYTE_VERTICE, 8);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.ebo);
        gl.bindVertexArray(null);
      }
      gl.bindBuffer(gl.ARRAY_BUFFER, c.vboAcqua);
      gl.bufferData(gl.ARRAY_BUFFER, a.byte, gl.STATIC_DRAW);
    }
    c.x0 = dati.cx * 16; c.z0 = dati.cz * 16; c.minY = dati.minY; c.maxY = dati.maxY;
    c.y0 = dati.y0 || 0;
    c.chunk = [c.x0, c.y0, c.z0];
    // la tegola delle altezze (quota di mondo + 1, come mappaAltezze), per la finestra
    if (dati.altezze) {
      if (!c.tegola) c.tegola = new Uint8Array(256);
      for (let lx = 0; lx < 16; lx++) for (let lz = 0; lz < 16; lz++) { const a = dati.altezze[lx * 16 + lz]; c.tegola[lz * 16 + lx] = a < 0 ? 0 : Math.max(0, Math.min(255, a + 1)); }
      if (this.finestra) this._scriviTegola(c);
    }
  }

  /**
   * Apre la finestra delle altezze (lato in blocchi, multiplo di 16) centrata
   * su (x, z). Da chiamare PRIMA di caricare i chunk del mondo in streaming.
   */
  apriFinestraAltezze(x, z, lato = 512) {
    const gl = this.gl;
    if (!this.altezze) this.altezze = gl.createTexture();
    this.finestra = { lato, x0: 0, z0: 0, vuota: new Uint8Array(lato * lato), spostamenti: 0 };
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this._centraFinestra(x, z, true);
  }

  /** La finestra segue chi cammina: si sposta (e si riscrive) solo quando si è a un quarto dal bordo. */
  seguiAltezze(x, z) { if (this.finestra) this._centraFinestra(x, z, false); }

  _centraFinestra(x, z, forza) {
    const gl = this.gl, f = this.finestra, mezzo = f.lato / 2;
    if (!forza && Math.abs(x - (f.x0 + mezzo)) < f.lato / 4 && Math.abs(z - (f.z0 + mezzo)) < f.lato / 4) return false;
    f.x0 = Math.floor((x - mezzo) / 16) * 16; f.z0 = Math.floor((z - mezzo) / 16) * 16;
    this.altRett = [f.x0, f.z0, 1 / f.lato, 1 / f.lato];
    if (this.ombre.w !== f.lato) this._preparaOmbre(f.lato, f.lato); else this.ombre.sporco = [0, 0, f.lato, f.lato];
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, f.lato, f.lato, 0, gl.RED, gl.UNSIGNED_BYTE, f.vuota);
    for (const c of this.chunks.values()) if (c.tegola) this._scriviTegola(c);
    f.spostamenti++;
    return true;
  }

  _scriviTegola(c, vuota = false) {
    const gl = this.gl, f = this.finestra;
    const px = c.x0 - f.x0, pz = c.z0 - f.z0;
    if (px < 0 || pz < 0 || px + 16 > f.lato || pz + 16 > f.lato) return;
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texSubImage2D(gl.TEXTURE_2D, 0, px, pz, 16, 16, gl.RED, gl.UNSIGNED_BYTE, vuota ? this._tegolaVuota : c.tegola);
    this._sporcaOmbre(px, pz, 16, 16);
  }

  /**
   * LA CELLA MIRATA: dodici spigoli in linea, neri e poi bianchi (si leggono su
   * ogni fondo), con `progresso` 0..1 lo scavo la tinge d'arancio. Si disegna
   * dopo i solidi e i modelli, prima dell'acqua, con la profondità.
   */
  evidenzia(x, y, z, progresso = 0) {
    const gl = this.gl;
    if (!this.programmaSpigoli) {
      this.programmaSpigoli = compila(gl, `#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,
      `#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`);
      this.uSpigoli = { uVP: gl.getUniformLocation(this.programmaSpigoli, 'uVP'), uCella: gl.getUniformLocation(this.programmaSpigoli, 'uCella'), uColore: gl.getUniformLocation(this.programmaSpigoli, 'uColore') };
      this.vaoSpigoli = gl.createVertexArray();
    }
    const u = this.uSpigoli;
    gl.useProgram(this.programmaSpigoli);
    gl.uniformMatrix4fv(u.uVP, false, this.vp);
    gl.bindVertexArray(this.vaoSpigoli);
    gl.uniform4f(u.uCella, x, y, z, 0.012); gl.uniform3f(u.uColore, 0.05, 0.16, 0.10);
    gl.drawArrays(gl.LINES, 0, 24);
    gl.uniform4f(u.uCella, x, y, z, 0.004); gl.uniform3f(u.uColore, 1.0, 1.0 - 0.45 * progresso, 1.0 - 0.8 * progresso);
    gl.drawArrays(gl.LINES, 0, 24);
    gl.bindVertexArray(null);
  }

  /**
   * UNA CELLA PIENA, TRASLUCIDA: il blocco che si sta per rompere (giallo, poi
   * arancio con lo scavo) o il fantasma di dove si posa (bianco-azzurro). Con la
   * fusione, la profondità letta e non scritta; si vede anche dietro l'erba.
   */
  scatola(x, y, z, r, g, b, alfa = 0.3, gonfia = 0.02) {
    const gl = this.gl;
    if (!this.programmaPieno) {
      this.programmaPieno = compila(gl, `#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,
      `#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`);
      this.uPieno = { uVP: gl.getUniformLocation(this.programmaPieno, 'uVP'), uCella: gl.getUniformLocation(this.programmaPieno, 'uCella'), uColore: gl.getUniformLocation(this.programmaPieno, 'uColore') };
      this.vaoPieno = gl.createVertexArray();
    }
    const u = this.uPieno;
    gl.useProgram(this.programmaPieno);
    gl.uniformMatrix4fv(u.uVP, false, this.vp);
    gl.uniform4f(u.uCella, x, y, z, gonfia); gl.uniform4f(u.uColore, r * alfa, g * alfa, b * alfa, alfa);
    gl.bindVertexArray(this.vaoPieno);
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    gl.drawArrays(gl.TRIANGLES, 0, 36);
    gl.enable(gl.CULL_FACE); gl.depthMask(true); gl.disable(gl.BLEND);
    gl.bindVertexArray(null);
  }

  rimuovi(kc) {
    const c = this.chunks.get(kc); if (!c) return;
    this._sporcaMappa(c.x0, c.z0);
    if (this.finestra && c.tegola) this._scriviTegola(c, true);
    this.gl.deleteVertexArray(c.vao); this.gl.deleteBuffer(c.vbo);
    if (c.vaoAcqua) { this.gl.deleteVertexArray(c.vaoAcqua); this.gl.deleteBuffer(c.vboAcqua); }
    if (c.vaoErba) { this.gl.deleteVertexArray(c.vaoErba); this.gl.deleteBuffer(c.vboErba); }
    this.chunks.delete(kc);
  }

  /** Segna da ricalcolare le ombre in un rettangolo della mappa (texel), allargato di quanto un'ombra può arrivare. */
  _sporcaOmbre(px, pz, w, h) {
    const M = 26;
    const r = [Math.max(0, px - M), Math.max(0, pz - M), Math.min(this.ombre.w || 1e9, px + w + M), Math.min(this.ombre.h || 1e9, pz + h + M)];
    const s = this.ombre.sporco;
    this.ombre.sporco = s ? [Math.min(s[0], r[0]), Math.min(s[1], r[1]), Math.max(s[2], r[2]), Math.max(s[3], r[3])] : r;
  }

  _preparaOmbre(w, h) {
    const gl = this.gl, o = this.ombre;
    if (!o.tex) { o.tex = gl.createTexture(); o.fbo = gl.createFramebuffer(); }
    gl.bindTexture(gl.TEXTURE_2D, o.tex);
    o.mezzoFloat = this._ombreMezzo;
    if (o.mezzoFloat) { gl.texImage2D(gl.TEXTURE_2D, 0, gl.R16F, w, h, 0, gl.RED, gl.HALF_FLOAT, null); o.scala = 1; o.offset = 0; }
    else { gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, w, h, 0, gl.RED, gl.UNSIGNED_BYTE, null); o.scala = 64; o.offset = -8; }   // (quota + 8) / 64: da −8 a 56 a quarti di blocco
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, o.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, o.tex, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE && o.mezzoFloat) {
      // la scheda non rende su mezzo float: si ripiega sull'R8
      this._ombreMezzo = false; gl.bindFramebuffer(gl.FRAMEBUFFER, null); return this._preparaOmbre(w, h);
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    o.w = w; o.h = h; o.sporco = [0, 0, w, h];
    if (!this.programmaOmbre) {
      this.programmaOmbre = compila(gl, `#version 300 es
void main() { vec2 q = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(q, 0.0, 1.0); }`,
      `#version 300 es
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
  // ⚠ PASSO FISSO DI MEZZO BLOCCO PER 24 BLOCCHI: nessuna colonna saltata, che era la causa dei puntini
  for (int i = 1; i <= 48; i++) {
    float t = float(i) * 0.5;
    float h = texture(uAltezze, (p + dir * t) * uAltRett.zw).r * 255.0;
    hs = max(hs, h - t * tg);
  }
  colore = vec4((hs - uCodifica.y) / uCodifica.x, 0.0, 0.0, 1.0);
}`);
      this.uOmbre = {}; for (const n of ['uAltezze', 'uAltRett', 'uSole', 'uCodifica']) this.uOmbre[n] = gl.getUniformLocation(this.programmaOmbre, n);
      this.vaoOmbre = gl.createVertexArray();
    }
  }

  /** Ricalcola la mappa delle ombre nel rettangolo sporco (o tutta, se il sole si è spostato). */
  _calcolaOmbre() {
    const gl = this.gl, o = this.ombre, s = this.sole;
    if (!this.altezze || !o.tex) return;
    // il sole si è spostato di più di mezzo grado? tutto da rifare
    const d = s.verso[0] * o.sole[0] + s.verso[1] * o.sole[1] + s.verso[2] * o.sole[2];
    if (d < 0.99996) { o.sole = s.verso.slice(); o.sporco = [0, 0, o.w, o.h]; }
    if (!o.sporco) return;
    const [x0, z0, x1, z1] = o.sporco; o.sporco = null;
    if (x1 <= x0 || z1 <= z0) return;
    const lx = Math.hypot(s.verso[0], s.verso[2]) || 1e-4;
    const dir = [-s.verso[0] / lx, -s.verso[2] / lx], tg = Math.max(0.05, -s.verso[1] / lx);
    gl.bindFramebuffer(gl.FRAMEBUFFER, o.fbo);
    gl.viewport(0, 0, o.w, o.h);
    gl.enable(gl.SCISSOR_TEST); gl.scissor(x0, z0, x1 - x0, z1 - z0);
    gl.disable(gl.DEPTH_TEST); gl.disable(gl.CULL_FACE);
    gl.useProgram(this.programmaOmbre);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.altezze); gl.uniform1i(this.uOmbre.uAltezze, 0);
    gl.uniform4f(this.uOmbre.uAltRett, 0, 0, 1 / o.w, 1 / o.h);   // in texel: la mappa e le ombre hanno la stessa griglia
    gl.uniform3f(this.uOmbre.uSole, dir[0], dir[1], tg);
    gl.uniform2f(this.uOmbre.uCodifica, o.scala, o.offset);
    gl.bindVertexArray(this.vaoOmbre);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
    gl.disable(gl.SCISSOR_TEST); gl.enable(gl.DEPTH_TEST); gl.enable(gl.CULL_FACE);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    o.calcoli++; this.statistiche.calcoliOmbre = o.calcoli;
  }

  /** Il cielo sfumato col sole, a tutto schermo, sotto tutto (niente profondità). */
  _disegnaCielo(vp, occhio) {
    const gl = this.gl, u = this.uc, s = this.sole;
    if (!inverti(vp, this._invVP)) return;
    gl.useProgram(this.programmaCielo);
    gl.uniformMatrix4fv(u.uInvVP, false, this._invVP);
    gl.uniform3f(u.uOcchio, occhio[0], occhio[1], occhio[2]);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
    const f = s.forza;
    gl.uniform3f(u.uZenit, 0.04 + 0.32 * f, 0.06 + 0.56 * f, 0.14 + 0.82 * f);
    gl.disable(gl.DEPTH_TEST); gl.depthMask(false); gl.disable(gl.CULL_FACE);
    gl.bindVertexArray(this.vaoVuoto);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.bindVertexArray(null);
    gl.enable(gl.CULL_FACE); gl.depthMask(true); gl.enable(gl.DEPTH_TEST);
  }

  /** Le due texture di profondità della mappa d'ombra, col confronto in hardware. */
  _preparaMappa() {
    const gl = this.gl, m = this.mappa;
    const fai = (lato) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, lato, lato, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_INT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_MODE, gl.COMPARE_REF_TO_TEXTURE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_COMPARE_FUNC, gl.LEQUAL);
      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, tex, 0);
      gl.drawBuffers([gl.NONE]); gl.readBuffer(gl.NONE);
      const ok = gl.checkFramebufferStatus(gl.FRAMEBUFFER) === gl.FRAMEBUFFER_COMPLETE;
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      return { tex, fbo, lato, ok };
    };
    m.stat = fai(m.lato); m.din = fai(m.latoDin);
    if (!m.stat.ok || !m.din.ok) m.attiva = false;
  }

  /** Lega le due mappe (unità 1 e 2) e le loro uniform a un programma già in uso. */
  legaMappa(u) {
    const gl = this.gl, m = this.mappa;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, m.stat.tex); gl.uniform1i(u.uMappaStat, 1);
    gl.activeTexture(gl.TEXTURE2); gl.bindTexture(gl.TEXTURE_2D, m.din.tex); gl.uniform1i(u.uMappaDin, 2);
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1f(u.uMappaOn, m.on ? 1 : 0);
    gl.uniformMatrix4fv(u.uLuceVP, false, m.vp);
    gl.uniformMatrix4fv(u.uLuceVPDin, false, m.vpDin);
    gl.uniform2f(u.uMappaTexel, 0.5 / m.lato, 0.5 / m.latoDin);
    // un texel e mezzo lungo la normale, e un decimo di blocco di profondità (su 220 di intervallo)
    gl.uniform2f(u.uMappaSbieco, 1.5 * (2 * m.raggio / m.lato), 0.1 / 220);
    gl.uniform4fv(u.uLampade, this.lampade); gl.uniform1i(u.uNLampade, this.nLampade);
    gl.uniform3f(u.uStile, this.stile.tinta, this.stile.saturazione, this.stile.valore);
  }

  /**
   * La mappa d'ombra vera. `stat` si rifà quando serve, `din` sempre. Il
   * centro è la mira della camera (in terza persona il gatto), a passi di due
   * blocchi, spostato solo quando ci si allontana di otto: fra uno spostamento
   * e l'altro la matrice è ferma, e le ombre non tremano.
   */
  _aggiornaMappa(camera, modelli) {
    const gl = this.gl, m = this.mappa, s = this.sole, st = this.statistiche;
    m.on = false;
    if (!m.attiva || !this.ombra) return;
    // ⚠ NON PIÙ DI OTTO RIFACIMENTI AL SECONDO: nello streaming arrivano chunk
    // a raffica, e rifare 2048² a ogni chunk mangiava il fotogramma. Solo il
    // ricentraggio non aspetta (la matrice cambia, e con lei anche `din`).
    const adesso = typeof performance !== 'undefined' ? performance.now() : 0;
    const cx = camera.centro[0], cz = camera.centro[2];
    let ricentra = false;
    if (Math.hypot(cx - m.centro[0], cz - m.centro[2]) > 6) { m.centro = [Math.round(cx / 2) * 2, Math.round(camera.centro[1]), Math.round(cz / 2) * 2]; ricentra = true; }
    // la mappa di chi si muove è stretta (raggioDin) e segue la mira ogni fotogramma: si rifà comunque
    {
      const v = s.verso, c = camera.centro;
      const occhio = [c[0] - v[0] * 120, c[1] - v[1] * 120, c[2] - v[2] * 120];
      const su = Math.abs(v[1]) > 0.95 ? [0, 0, 1] : [0, 1, 0];
      moltiplica(ortografica(m.raggioDin, 10, 230), guarda(occhio, c, su), m.vpDin);
    }
    const d = s.verso[0] * m.sole[0] + s.verso[1] * m.sole[1] + s.verso[2] * m.sole[2];
    if (d < 0.99999) m.soleMosso = true;   // un quarto di grado
    const vuole = m.sporca || m.soleMosso || (modelli && modelli.mappaSporca);
    const rifai = ricentra || (vuole && adesso - (m.ultimo || 0) >= 120);
    if (rifai) {
      m.sole = s.verso.slice(); m.soleMosso = false; m.ultimo = adesso;
      const v = s.verso, c = m.centro;
      const occhio = [c[0] - v[0] * 120, c[1] - v[1] * 120, c[2] - v[2] * 120];
      const su = Math.abs(v[1]) > 0.95 ? [0, 0, 1] : [0, 1, 0];
      moltiplica(ortografica(m.raggio, 10, 230), guarda(occhio, c, su), m.vp);
    }
    gl.enable(gl.POLYGON_OFFSET_FILL); gl.polygonOffset(1.5, 4);
    if (rifai) {
      gl.bindFramebuffer(gl.FRAMEBUFFER, m.stat.fbo);
      gl.viewport(0, 0, m.stat.lato, m.stat.lato);
      gl.clear(gl.DEPTH_BUFFER_BIT);
      gl.useProgram(this.programmaOmbra);
      gl.uniformMatrix4fv(this.uo.uVP, false, m.vp);
      let disegni = 0, tri = 0;
      const lim = m.raggio + 12;
      for (const c of this.chunks.values()) {
        if (c.quad === 0) continue;
        if (Math.hypot(c.x0 + 8 - m.centro[0], c.z0 + 8 - m.centro[2]) > lim) continue;
        gl.uniform3f(this.uo.uChunk, c.chunk[0], c.chunk[1], c.chunk[2]);
        gl.bindVertexArray(c.vao);
        gl.drawElements(gl.TRIANGLES, c.quad * 6, gl.UNSIGNED_SHORT, 0);
        disegni++; tri += c.quad * 2;
      }
      gl.bindVertexArray(null);
      if (modelli) { const [dm, tm] = modelli.disegnaOmbra(m.vp, false); disegni += dm; tri += tm; modelli.mappaSporca = false; }
      m.sporca = false; m.calcoli++; m.disegni = disegni; m.triangoli = tri;
    }
    gl.bindFramebuffer(gl.FRAMEBUFFER, m.din.fbo);
    gl.viewport(0, 0, m.din.lato, m.din.lato);
    gl.clear(gl.DEPTH_BUFFER_BIT);
    let dd = 0, td = 0;
    if (modelli) [dd, td] = modelli.disegnaOmbra(m.vpDin, true);
    gl.disable(gl.POLYGON_OFFSET_FILL);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    m.on = true;
    st.calcoliMappa = m.calcoli; st.disegniOmbra = dd + (rifai ? m.disegni : 0); st.triangoliOmbra = td + (rifai ? m.triangoli : 0);
  }

  /** La mappa delle altezze per l'ombra del sole: un byte per colonna. */
  impostaAltezze(byte, x0, z0, larghezza, profondita) {
    const gl = this.gl;
    if (!this.altezze) this.altezze = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, this.altezze);
    gl.pixelStorei(gl.UNPACK_ALIGNMENT, 1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.R8, larghezza, profondita, 0, gl.RED, gl.UNSIGNED_BYTE, byte);
    // ⚠ NEAREST, non lineare: filtrata, ogni gradino faceva una rampa d'ombra sul blocco accanto
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    this.altRett = [x0, z0, 1 / larghezza, 1 / profondita];
    this._preparaOmbre(larghezza, profondita);
  }

  /** Le sedici materie: [emissione, brillio, riflesso, libero] per riga. La riga 0 è «nessuna». */
  impostaMaterie(righe) {
    const piatto = new Float32Array(64);
    for (let i = 0; i < 16 && i < righe.length; i++) for (let k = 0; k < 4; k++) piatto[i * 4 + k] = righe[i][k] || 0;
    this.materie = piatto;
  }

  /**
   * Un fotogramma. `camera` = { occhio, centro, fov, rapporto }; `modelli`, se
   * c'è, viene disegnato anche nello specchio (nella vista lo disegna il
   * chiamante, dopo, con `modelli.disegna(resa, camera)`).
   * ⚠ ZERO ALLOCAZIONI QUI DENTRO: le matrici e i piani sono riusati.
   */
  disegna(camera, dt, modelli = null) {
    const gl = this.gl, st = this.statistiche;
    this.tempo += dt;
    const P = prospettiva(camera.fov, camera.rapporto, 0.3, 400);
    const V = guarda(camera.occhio, camera.centro);
    moltiplica(P, V, this.vp);
    pianiFrustum(this.vp, this.piani);
    this._camera = camera;
    // ── la scelta di cosa si vede: una volta sola, per solidi, acqua ed erba ──
    this._visibili.length = 0;
    this._visibiliErba.length = 0;
    let visti = 0;
    for (const c of this.chunks.values()) {
      if (c.quad === 0 && c.quadAcqua === 0) continue;
      c.visto = this.tutto || scatolaNelFrustum(this.piani, c.x0, c.y0 + c.minY, c.z0, c.x0 + 16, c.y0 + c.maxY + 1, c.z0 + 16);
      if (!c.visto) continue;
      visti++;
      if (c.quadAcqua > 0) this._visibili.push(c);
      // ⚠ LOD DELL'ERBA: i fili si disegnano solo entro `erbaFinoA` blocchi dal
      // centro del chunk (come il raggio del prato di oggi): da lontano l'erba è
      // la tinta della cima, e i triangoli risparmiati sono migliaia per chunk.
      if (c.verticiErba > 0 && Math.hypot(c.x0 + 8 - camera.occhio[0], c.z0 + 8 - camera.occhio[2]) <= this.erbaFinoA) this._visibiliErba.push(c);
    }
    // ── la mappa delle ombre, se il sole si è spostato o le altezze sono cambiate ──
    if (this.ombra && this.altezze) this._calcolaOmbre();
    // ── la mappa d'ombra vera, vista dal sole ──
    this._aggiornaMappa(camera, modelli);
    // ── lo specchio dell'acqua, prima di tutto: una passata a parte ──────────
    st.disegniSpecchio = 0; st.triangoliSpecchio = 0; st.pelo = null;
    this.specchio.pelo = null;
    if (this.specchio.attivo && this._visibili.length) this._specchia(camera, modelli);
    // ── la vista ──────────────────────────────────────────────────────────────
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this._disegnaCielo(this.vp, camera.occhio);
    this.taglio = -1e9;
    this.vpCorrente = this.vp;
    const [disegni, tri] = this._solidi(this.vp, this.piani, camera.occhio, false);
    // ── l'erba dei chunk visti: opaca, a due facce, stesso frustum ────────────
    let disegniErba = 0, triErba = 0;
    if (this._visibiliErba.length) {
      const ue = this.ue, s = this.sole;
      gl.useProgram(this.programmaErba);
      gl.uniformMatrix4fv(ue.uVP, false, this.vp);
      gl.uniform1f(ue.uTempo, this.tempo);
      gl.uniform3f(ue.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
      gl.uniform3f(ue.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
      gl.uniform1f(ue.uSoleForza, s.forza);
      gl.uniform3f(ue.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
      gl.uniform2f(ue.uNebbia, this.nebbia.da, this.nebbia.a);
      gl.uniform3f(ue.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
      gl.uniform3f(ue.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
      gl.uniform2f(ue.uVento, Math.cos(this.tempo * 0.045), Math.sin(this.tempo * 0.045));
      gl.uniform1f(ue.uOmbra, this.ombra && this.altezze ? 1 : 0);
      gl.uniform1f(ue.uTaglio, -1e9);
      gl.uniform1f(ue.uErbaFinoA, this.erbaFinoA);
      gl.uniform4f(ue.uBuco, this.buco[0], this.buco[1], this.buco[2], this.buco[3]); gl.uniform3f(ue.uOcchio, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
      if (this.altezze) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.ombre.tex); gl.uniform1i(ue.uOmbre, 0); gl.uniform2f(ue.uOmbreScala, this.ombre.scala, this.ombre.offset); gl.uniform4f(ue.uAltRett, this.altRett[0], this.altRett[1], this.altRett[2], this.altRett[3]); }
      this.legaMappa(ue);
      gl.disable(gl.CULL_FACE);
      for (const c of this._visibiliErba) {
        // ⚠ LA BASE DELL'ERBA È GIÀ IN QUOTA DI MONDO (yLo del chunk): NON si somma
        // lo scarto del chunk, o i fili finiscono 64 celle sotto, nel lago.
        gl.uniform3f(ue.uChunk, c.chunk[0], c.yBaseErba, c.chunk[2]);
        gl.bindVertexArray(c.vaoErba);
        gl.drawArraysInstanced(gl.TRIANGLES, 0, 6, c.lamelle);
        disegniErba++; triErba += c.lamelle * 2;
      }
      gl.enable(gl.CULL_FACE);
      gl.bindVertexArray(null);
    }
    st.disegni = disegni; st.triangoli = tri; st.chunkVisti = visti; st.chunkTotali = this.chunks.size;
    st.disegniErba = disegniErba; st.triangoliErba = triErba;
  }

  /**
   * I solidi con un VP e un frustum dati: la vista (`specchiato` falso: si
   * disegnano i chunk già scelti) o lo specchio (`specchiato` vero: frustum
   * suo, e le facce si scartano al contrario perché la riflessione capovolge
   * il verso dei triangoli). Torna [disegni, triangoli].
   */
  _solidi(vp, piani, occhio, specchiato) {
    const gl = this.gl, u = this.u, s = this.sole;
    gl.useProgram(this.programma);
    gl.uniformMatrix4fv(u.uVP, false, vp);
    gl.uniform1f(u.uTempo, this.tempo);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform3f(u.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
    gl.uniform4fv(u.uMaterie, this.materie);
    gl.uniform2f(u.uNebbia, this.nebbia.da, this.nebbia.a);
    gl.uniform3f(u.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
    gl.uniform3f(u.uCam, occhio[0], occhio[1], occhio[2]);
    gl.uniform1f(u.uOmbra, this.ombra && this.altezze ? 1 : 0);
    gl.uniform1f(u.uTaglio, this.taglio);
    const b = specchiato ? [0, 0, 0, 0] : this.buco;   // lo specchio non ha il buco
    gl.uniform4f(u.uBuco, b[0], b[1], b[2], b[3]); gl.uniform3f(u.uOcchio, occhio[0], occhio[1], occhio[2]);
    if (this.altezze) {
      gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, this.ombre.tex);
      gl.uniform1i(u.uOmbre, 0); gl.uniform2f(u.uOmbreScala, this.ombre.scala, this.ombre.offset);
      gl.uniform4f(u.uAltRett, this.altRett[0], this.altRett[1], this.altRett[2], this.altRett[3]);
    }
    this.legaMappa(u);
    let disegni = 0, tri = 0;
    for (const c of this.chunks.values()) {
      if (c.quad === 0) continue;
      if (specchiato) { if (!this.tutto && !scatolaNelFrustum(piani, c.x0, c.y0 + c.minY, c.z0, c.x0 + 16, c.y0 + c.maxY + 1, c.z0 + 16)) continue; }
      else if (!c.visto) continue;
      gl.uniform3f(u.uChunk, c.chunk[0], c.chunk[1], c.chunk[2]);
      gl.bindVertexArray(c.vao);
      gl.drawElements(gl.TRIANGLES, c.quad * 6, gl.UNSIGNED_SHORT, 0);
      disegni++; tri += c.quad * 2;
    }
    gl.bindVertexArray(null);
    return [disegni, tri];
  }

  /**
   * Il pelo da specchiare. Un piano solo (è il limite della tecnica), quindi si
   * sceglie l'acqua che RIEMPIE LO SCHERMO: ogni chunk visto vota per la quota
   * del suo pelo con i suoi quad d'acqua, smorzati dalla distanza (la verticale
   * pesa 2,2, come in world/pelo.js). Il lago di sessanta chunk vince sulla
   * pozza della sorgente a due passi, e la pozza vince quando ci si è sopra.
   */
  _peloVicino(occhio) {
    const voti = this._voti; voti.clear();
    for (const c of this._visibili) {
      if (c.peloAcqua == null) continue;
      const d = Math.hypot(c.x0 + 8 - occhio[0], c.z0 + 8 - occhio[2]) + 2.2 * Math.abs(c.peloAcqua - occhio[1]);
      voti.set(c.peloAcqua, (voti.get(c.peloAcqua) || 0) + c.quadAcqua / (1 + d));
    }
    let pelo = null, meglio = 0;
    for (const [q, v] of voti) if (v > meglio) { meglio = v; pelo = q; }
    return pelo;
  }

  /**
   * LA PASSATA DELLO SPECCHIO. Matrice di riflessione rispetto al piano y = pelo
   * (x, y, z) → (x, 2·pelo − y, z), moltiplicata a destra del VP: un punto del
   * mondo finisce a schermo dove finirebbe la sua immagine riflessa, quindi il
   * fragment dell'acqua legge il riflesso con le proprie coordinate a schermo.
   * La riflessione capovolge il verso dei triangoli: si scartano le facce
   * davanti. Sotto il pelo non si disegna (uTaglio). Sott'acqua non si specchia.
   */
  _specchia(camera, modelli) {
    const gl = this.gl, sp = this.specchio, st = this.statistiche;
    const pelo = this._peloVicino(camera.occhio);
    if (pelo == null || camera.occhio[1] <= pelo + 0.2) return;
    // il framebuffer, alla misura della tela per `scala`
    const w = Math.max(1, Math.round(gl.drawingBufferWidth * sp.scala)), h = Math.max(1, Math.round(gl.drawingBufferHeight * sp.scala));
    if (!sp.fbo || sp.w !== w || sp.h !== h) this._preparaSpecchio(w, h);
    const R = this._riflessione;
    R.fill(0); R[0] = 1; R[5] = -1; R[10] = 1; R[13] = 2 * pelo; R[15] = 1;
    moltiplica(this.vp, R, this.vpSpecchio);
    pianiFrustum(this.vpSpecchio, this.pianiSpecchio);
    const occhio = [camera.occhio[0], 2 * pelo - camera.occhio[1], camera.occhio[2]];
    gl.bindFramebuffer(gl.FRAMEBUFFER, sp.fbo);
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this._disegnaCielo(this.vpSpecchio, occhio);
    gl.cullFace(gl.FRONT);
    this.taglio = pelo - 0.05;
    this.vpCorrente = this.vpSpecchio;
    const [d, t] = this._solidi(this.vpSpecchio, this.pianiSpecchio, occhio, true);
    st.disegniSpecchio = d; st.triangoliSpecchio = t;
    if (modelli) {
      modelli.disegna(this, { occhio, centro: camera.centro, fov: camera.fov, rapporto: camera.rapporto });
      st.disegniSpecchio += modelli.statistiche.disegni; st.triangoliSpecchio += modelli.statistiche.triangoli;
    }
    gl.cullFace(gl.BACK);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    this.taglio = -1e9;
    sp.pelo = pelo; st.pelo = pelo;
  }

  _mostraSpecchio() {
    const gl = this.gl, sp = this.specchio;
    if (!this.programmaQuad) {
      this.programmaQuad = compila(gl, `#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`, `#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`);
      this.uQuad = gl.getUniformLocation(this.programmaQuad, 'uTex');
      this.vaoQuad = gl.createVertexArray();
    }
    gl.useProgram(this.programmaQuad);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, sp.tex); gl.uniform1i(this.uQuad, 0);
    gl.bindVertexArray(this.vaoQuad);
    gl.disable(gl.DEPTH_TEST);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    gl.enable(gl.DEPTH_TEST);
    gl.bindVertexArray(null);
  }

  _preparaSpecchio(w, h) {
    const gl = this.gl, sp = this.specchio;
    if (!sp.fbo) { sp.fbo = gl.createFramebuffer(); sp.tex = gl.createTexture(); sp.rbo = gl.createRenderbuffer(); }
    gl.bindTexture(gl.TEXTURE_2D, sp.tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, w, h, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.bindRenderbuffer(gl.RENDERBUFFER, sp.rbo);
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, w, h);
    gl.bindFramebuffer(gl.FRAMEBUFFER, sp.fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, sp.tex, 0);
    gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, sp.rbo);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) { sp.attivo = false; console.warn('specchio: framebuffer incompleto, spento'); }
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.bindTexture(gl.TEXTURE_2D, null);
    sp.w = w; sp.h = h;
  }

  /**
   * L'ACQUA, dopo tutto il resto: fusione accesa, profondità letta ma non scritta,
   * niente culling delle facce (si guarda anche da sotto). Solo i chunk d'acqua
   * già passati dal frustum in `disegna`: il culling dell'acqua è lo stesso dei
   * solidi, e un chunk senza acqua non arriva neanche qui. Lo specchio, se la
   * passata c'è stata, entra come texture letta a schermo.
   */
  disegnaAcqua() {
    const gl = this.gl, u = this.ua, s = this.sole, camera = this._camera, sp = this.specchio;
    if (!camera || this._visibili.length === 0) { this.statistiche.disegniAcqua = 0; return; }
    gl.useProgram(this.programmaAcqua);
    gl.uniformMatrix4fv(u.uVP, false, this.vp);
    gl.uniform1f(u.uTempo, this.tempo);
    gl.uniform3f(u.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform2f(u.uNebbia, this.nebbia.da, this.nebbia.a);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform3f(u.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
    gl.uniform3f(u.uNebbiaCol, this.nebbia.colore[0], this.nebbia.colore[1], this.nebbia.colore[2]);
    const conSpecchio = sp.pelo != null && sp.tex;
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, conSpecchio ? sp.tex : null); gl.uniform1i(u.uSpecchio, 1);
    gl.uniform3f(u.uSchermo, 1 / gl.drawingBufferWidth, 1 / gl.drawingBufferHeight, conSpecchio ? 1 : 0);
    gl.uniform1f(u.uMare, this.mare);
    gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.depthMask(false); gl.disable(gl.CULL_FACE);
    let disegni = 0, tri = 0;
    for (const c of this._visibili) {
      gl.uniform3f(u.uChunk, c.chunk[0], c.chunk[1], c.chunk[2]);
      gl.bindVertexArray(c.vaoAcqua);
      gl.drawElements(gl.TRIANGLES, c.quadAcqua * 6, gl.UNSIGNED_SHORT, 0);
      disegni++; tri += c.quadAcqua * 2;
    }
    gl.bindVertexArray(null);
    gl.depthMask(true); gl.enable(gl.CULL_FACE); gl.disable(gl.BLEND);
    gl.activeTexture(gl.TEXTURE0);
    this.statistiche.disegniAcqua = disegni; this.statistiche.triangoliAcqua = tri;
    // il banco: lo specchio nudo in basso a sinistra, per vedere cosa legge l'acqua
    // ⚠ NON con blitFramebuffer: la tela con antialias è multisample, e il blit
    // verso un framebuffer multisample è un GL_INVALID_OPERATION. Un quad.
    if (sp.mostra && conSpecchio) this._mostraSpecchio();
  }
}

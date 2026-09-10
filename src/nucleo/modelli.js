// I MODELLI DEL NUCLEO — alberi, lampioni, panchine: triangoli piatti cotti
// offline (scripts/converti-nucleo.mjs), disegnati A ISTANZE: un disegno per
// TIPO di modello, non per albero. Cento alberi sono una chiamata.
//
// Stessa luce dei chunk: colore piatto dal vertice, «la faccia vede il sole o
// no» a gradino, l'ombra del colore del cielo, horizon mapping per l'ombra del
// sole, nebbia. La luce cotta della cella (F2) arriverà per istanza.
import { compila } from './gl.js';
import { pianiFrustum, scatolaNelFrustum } from './matrici.js';

/** Legge un .bin del nucleo: 'LNM1', uint32 triangoli, 16 byte per vertice, poi 4 byte di colore per vertice. */
export function leggiModello(buf) {
  const dv = new DataView(buf);
  if (String.fromCharCode(dv.getUint8(0), dv.getUint8(1), dv.getUint8(2), dv.getUint8(3)) !== 'LNM1') throw new Error('non è un modello del nucleo');
  const tri = dv.getUint32(4, true), n = tri * 3;
  const geo = new Uint8Array(buf, 8, n * 16);
  const col = new Uint8Array(buf, 8 + n * 16, n * 4);
  // si intrecciano in un buffer solo da 20 byte: pos(12) n(3) materia(1) rgb(3) 0(1)
  const out = new Uint8Array(n * 20);
  for (let i = 0; i < n; i++) { out.set(geo.subarray(i * 16, i * 16 + 16), i * 20); out.set(col.subarray(i * 4, i * 4 + 4), i * 20 + 16); }
  let minY = Infinity, maxY = -Infinity, raggio = 0;
  const f = new DataView(out.buffer);
  for (let i = 0; i < n; i++) { const x = f.getFloat32(i * 20, true), y = f.getFloat32(i * 20 + 4, true), z = f.getFloat32(i * 20 + 8, true); minY = Math.min(minY, y); maxY = Math.max(maxY, y); raggio = Math.max(raggio, Math.hypot(x, z)); }
  return { byte: out, vertici: n, triangoli: tri, minY, maxY, raggio };
}

const VS = `#version 300 es
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
  // ⚠ MISURATO SULLE CONCEPT: il terracotta si sposta appena (3 %: #e59b69 →
  // #bf704b), il verde molto di più (15 %: #5ac550 → #34974c). I colori caldi
  // (tinta sotto i 40°) prendono un quinto dello spostamento.
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
  // che guarda il sole è piena, quella di spalle ha il colore d'ombra
  // ⚠ I MODELLI HANNO DUE TINTE E BASTA: la faccia che guarda il sole ha il
  // colore pieno, quella di spalle il colore d'ombra stilizzato (lo stesso
  // dell'ombra portata). Niente mezza banda: sfumava, e non è Leafy.
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
}`;

const FS = `#version 300 es
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
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI più vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// ⚠ IL COLORE DELLA LAMPADA È UN DATO, non più una costante nello shader. Fino
// al 10/09/2026 qui c'era vec3(1.30, 1.02, 0.58) scritto a mano: TUTTE le
// lampade del gioco facevano la stessa pozza calda, e def.luce.colore — che
// esiste da sempre in blocks.js, con tanto di lucciola verde e lampade rossa,
// verde e blu — non arrivava a schermo. «Luci colorate» era una casella vuota.
// xyz = la tinta già moltiplicata per l'intensità, w = la QUOTA della lanterna
// sopra la cella (2,6 per il lampione, 0 per un blocco-lampada).
uniform highp vec4 uLampCol[8];
// ⚠ LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni («esagonale»).
// La luce cotta resta come MASCHERA (dietro un muro non si passa) e per le
// lampade-blocco, che non stanno nella lista.
uniform sampler2D uAltezze;   // la mappa delle altezze (cima di ogni colonna + 1), per l'ombra della lampada
// ⚠ L'OMBRA DELLA LAMPADA SI CAMMINA CELLA PER CELLA (Amanatides–Woo, la
// traversata dei voxel in due dimensioni): dal punto si va verso la lanterna
// (a 2,6 di quota) attraversando le colonne della mappa delle altezze una per
// una, e ci si ferma sulla prima che sta sopra il raggio.
// ⚠ NON a passi fissi: con dodici passi uguali il bordo dell'ombra cadeva
// DOVE CAPITAVA IL PASSO, non sul bordo del blocco, ed era seghettato («l'ombra
// è seghettata quadrata non va bene»). Camminando i confini delle celle il
// taglio è esattamente il profilo del blocco, dritto, e le letture sono meno:
// una per cella attraversata, al massimo quattordici (il raggio è 4,6).
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
    // ⚠ GLI STESSI DUE CANALI DI resa.js, e questa riga era rimasta indietro:
    // il canale R e' la silhouette col FOGLIAME (serve al sole), e usarla qui
    // rimetteva davanti alla lampada il disco di raggio due della chioma — cioe'
    // l'ombra quadrata larga cinque celle, curata nei blocchi e ancora viva sui
    // modelli. Due file che fanno la stessa cosa in due posti divergono, e si
    // vede solo dove si guarda.
    highp vec2 uvC = (cella + 0.5 - uAltRett.xy) * uAltRett.zw;
    vec4 mappa = texture(uAltezze, uvC);
    float h = mappa.g * 255.0;
    // IL MARGINE E' PICCOLO, e prima era 0,6. Serve solo perche' la colonna su cui
    // si posa il pixel non si faccia ombra da se': a 0,6 nessun ostacolo alto meno
    // di sei decimi PIU' del pixel poteva fermare la luce, e sulla faccia di spalle
    // di un muro restava accesa una FASCIA in cima alta sei decimi di blocco —
    // «una luce fantasma illuminante dalla faccia che dovrebbe essere in ombra».
    // E LA CELLA DELLA LAMPADA NON FA OMBRA A SE STESSA NEANCHE QUI. La stessa
    // guardia c'era gia' sul canale degli OGGETTI, e mancava su questo: finche'
    // le lampade erano solo lampioni (modelli, che nel terreno non ci sono) non
    // si vedeva. Un BLOCCO-lampada e' solido, quindi sta nel canale del terreno,
    // e il raggio verso di lui entra PER FORZA nella sua cella: ogni lampada
    // appoggiata a terra si spegneva da sola, tutta, e non accendeva niente.
    if (h > y + 0.05 && h > pos.y + 0.05 && !all(equal(cella, cellaLampada))) return 0.0;
    float ho = mappa.b * 255.0;                      // l'OGGETTO: albero, lampione, fungo
    if (ho > pos.y + 0.3 && !all(equal(cella, cellaLampada))) {
      // ⚠ GEMELLA DI QUELLA IN resa.js, e vanno cambiate INSIEME: sono due copie
      // della stessa regola in due programmi diversi, e sono gia' divergute una
      // volta (i canali separati erano finiti solo in resa.js, e l'ombra
      // quadrata era curata sui blocchi e viva sui modelli).
      // ⚠ La distanza si misura al punto PIU' VICINO: il punto d'ingresso nella
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
    // SI'/NO, non un dot sfumato — la regola della casa dice «o vede la luce o
    // no», e una rampa di N dot L sarebbe il face shading che qui e' vietato.
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
    // ombra: la «fake point light» che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    float a = anello * ombraLampada(pos, n, lanterna);
    peso += a;
    tinta += a * uLampCol[i].rgb;
  }
  // IL PESO SI SATURA, IL COLORE NO: due pozze che si sovrappongono non
  // sbiancano, prendono la MEDIA delle due tinte a piena forza. Sommando i
  // colori, un rosso e un verde vicini davano giallo pieno — che non e' nessuna
  // delle due lampade. Con una lampada sola il conto e' identico a prima.
  if (peso <= 0.0) return vec3(0.0);
  return (tinta / peso) * min(peso, 1.0);
}
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
  // ⚠ LA SAGOMA: quando il gatto è dietro un albero o un muro, si vede la sua
  // ombra piatta attraverso (il committente: «un cono che mostra il player
  // anche attraverso i blocchi, magari in nero», non un buco nel mondo)
  if (uSagoma > 0.5) { colore = vec4(c * 0.18 * 0.55, 0.55); return; }
  colore = vec4(c, 1.0);
}`;

/** Da [x,y,z,scala]* a [x,y,z,scala,r,g,b,giro]* (tinta bianca, giro zero); a otto passa com'è. */
export function allungaIstanze(lista, perIstanza = 4) {
  if (perIstanza === 8) return lista instanceof Float32Array ? lista : new Float32Array(lista);
  const n = lista.length / 4, out = new Float32Array(n * 8);
  for (let i = 0; i < n; i++) { out.set([lista[i * 4], lista[i * 4 + 1], lista[i * 4 + 2], lista[i * 4 + 3], 1, 1, 1, 0], i * 8); }
  return out;
}

/**
 * UN CUBO PROCEDURALE nel formato dei modelli (20 byte per vertice), bianco:
 * la tinta la dà l'istanza. Base a y = 0, lato 1, centrato in x e z. È il
 * corpo del sandbox; con lo stesso stampo si fanno lastre e pali.
 */
export function modelloCubo(colore = [255, 255, 255], sx = 1, sy = 1, sz = 1) {
  const F = [   // [normale, quattro vertici in senso antiorario visti da fuori]
    [[0, 0, 1], [[-1, 0, 1], [1, 0, 1], [1, 1, 1], [-1, 1, 1]]],
    [[0, 0, -1], [[1, 0, -1], [-1, 0, -1], [-1, 1, -1], [1, 1, -1]]],
    [[1, 0, 0], [[1, 0, 1], [1, 0, -1], [1, 1, -1], [1, 1, 1]]],
    [[-1, 0, 0], [[-1, 0, -1], [-1, 0, 1], [-1, 1, 1], [-1, 1, -1]]],
    [[0, 1, 0], [[-1, 1, 1], [1, 1, 1], [1, 1, -1], [-1, 1, -1]]],
    [[0, -1, 0], [[-1, 0, -1], [1, 0, -1], [1, 0, 1], [-1, 0, 1]]],
  ];
  const n = 36, out = new Uint8Array(n * 20), dv = new DataView(out.buffer);
  let i = 0;
  const metti = (v, nn) => {
    const o = i * 20;
    dv.setFloat32(o, v[0] * sx / 2, true); dv.setFloat32(o + 4, v[1] * sy, true); dv.setFloat32(o + 8, v[2] * sz / 2, true);
    out[o + 12] = nn[0] * 127 & 255; out[o + 13] = nn[1] * 127 & 255; out[o + 14] = nn[2] * 127 & 255; out[o + 15] = 0;
    out[o + 16] = colore[0]; out[o + 17] = colore[1]; out[o + 18] = colore[2]; out[o + 19] = 255;
    i++;
  };
  for (const [nn, [a, b, c, d]] of F) { metti(a, nn); metti(b, nn); metti(c, nn); metti(a, nn); metti(c, nn); metti(d, nn); }
  return { byte: out, vertici: n, triangoli: 12, minY: 0, maxY: sy, raggio: Math.hypot(sx, sz) / 2 };
}

// la passata d'ombra dei modelli: solo la posizione, con giro e scala dell'istanza
const VS_OMBRA = `#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`;
const FS_VUOTO = `#version 300 es
precision mediump float;
void main() {}`;

export class Modelli {
  constructor(gl) {
    this.gl = gl;
    this.programma = compila(gl, VS, FS);
    this.u = {};
    for (const n of ['uVP', 'uTempo', 'uSoleVerso', 'uSoleCol', 'uSoleForza', 'uCieloCol', 'uMaterie', 'uNebbia', 'uCam', 'uNebbiaCol', 'uOmbra', 'uOmbre', 'uOmbreScala', 'uAltRett', 'uTaglio', 'uBuco', 'uOcchio', 'uSagoma', 'uMappaStat', 'uMappaDin', 'uLuceVP', 'uLuceVPDin', 'uMappaTexel', 'uMappaOn', 'uMappaSbieco', 'uLampade', 'uNLampade', 'uLampCol', 'uStile', 'uAltezze']) this.u[n] = gl.getUniformLocation(this.programma, n);
    this.programmaOmbra = compila(gl, VS_OMBRA, FS_VUOTO);
    this.uoVP = gl.getUniformLocation(this.programmaOmbra, 'uVP');
    // ⚠ CHI SI MUOVE STA NELLA MAPPA D'OMBRA DINAMICA (ogni fotogramma); il
    // resto in quella ferma, che si rifà quando un tipo fermo cambia istanze.
    this.dinamici = new Set(['omino', 'cubo']);
    this.mappaSporca = true;
    this.sagoma = 'omino';   // il tipo che si vede in sagoma attraverso i blocchi (null = nessuno)
    this.tipi = new Map();   // nome → { vao, vbo, ibo, vertici, istanze: Float32Array, n, scatola }
    this._pianiOmbra = new Float32Array(24);
    this.statistiche = { disegni: 0, triangoli: 0, istanze: 0, saltati: 0 };
  }

  /** Registra un tipo di modello (dati da `leggiModello`). */
  registra(nome, modello) {
    const gl = this.gl;
    const t = { vao: gl.createVertexArray(), vbo: gl.createBuffer(), ibo: gl.createBuffer(), vertici: modello.vertici, triangoli: modello.triangoli, istanze: new Float32Array(0), n: 0, sporco: false, raggio: modello.raggio, maxY: modello.maxY };
    gl.bindVertexArray(t.vao);
    gl.bindBuffer(gl.ARRAY_BUFFER, t.vbo);
    gl.bufferData(gl.ARRAY_BUFFER, modello.byte, gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 20, 0);
    gl.enableVertexAttribArray(1); gl.vertexAttribPointer(1, 3, gl.BYTE, true, 20, 12);
    gl.enableVertexAttribArray(4); gl.vertexAttribIPointer(4, 1, gl.UNSIGNED_BYTE, 20, 15);
    gl.enableVertexAttribArray(2); gl.vertexAttribPointer(2, 4, gl.UNSIGNED_BYTE, true, 20, 16);
    // ⚠ OTTO FLOAT PER ISTANZA: x y z scala | r g b giro. `istanze()` accetta
    // anche la forma corta a quattro (tinta bianca, giro zero) e la allunga.
    gl.bindBuffer(gl.ARRAY_BUFFER, t.ibo);
    gl.enableVertexAttribArray(3); gl.vertexAttribPointer(3, 4, gl.FLOAT, false, 32, 0); gl.vertexAttribDivisor(3, 1);
    gl.enableVertexAttribArray(5); gl.vertexAttribPointer(5, 4, gl.FLOAT, false, 32, 16); gl.vertexAttribDivisor(5, 1);
    gl.bindVertexArray(null);
    this.tipi.set(nome, t);
    return t;
  }

  /**
   * Le istanze di un tipo: [x, y, z, scala, …]. Si ricarica al prossimo disegno.
   *
   * ⚠ E SI CALCOLA LA SCATOLA CHE LE CONTIENE TUTTE, qui e non al disegno: qui
   * si fa UNA VOLTA quando le istanze cambiano, là si farebbe a ogni passata di
   * ogni fotogramma. È quello che permette di saltare un tipo intero senza
   * guardarlo (`disegna`), ed è il modo di rendere possibili mille arredi
   * diversi: quello che costa è il TIPO, non l'istanza.
   * ⚠ La scatola si allarga del raggio e dell'altezza del MODELLO, moltiplicati
   * per la scala dell'istanza: senza, un albero al bordo dello schermo sparirebbe
   * quando il suo centro esce dal frustum ma la chioma è ancora dentro.
   */
  istanze(nome, lista, perIstanza = 4) {
    const t = this.tipi.get(nome); if (!t) return;
    t.istanze = allungaIstanze(lista, perIstanza);
    t.n = t.istanze.length / 8; t.sporco = true;
    if (!this.dinamici.has(nome)) this.mappaSporca = true;
    const a = t.istanze;
    if (t.n === 0) { t.scatola = null; return; }
    let minX = Infinity, minY = Infinity, minZ = Infinity, maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
    const r = t.raggio || 1, h = t.maxY || 2;
    for (let i = 0; i < t.n; i++) {
      const q = i * 8, sc = a[q + 3] || 1, rr = r * sc, hh = h * sc;
      if (a[q] - rr < minX) minX = a[q] - rr;
      if (a[q] + rr > maxX) maxX = a[q] + rr;
      if (a[q + 2] - rr < minZ) minZ = a[q + 2] - rr;
      if (a[q + 2] + rr > maxZ) maxZ = a[q + 2] + rr;
      if (a[q + 1] < minY) minY = a[q + 1];
      if (a[q + 1] + hh > maxY) maxY = a[q + 1] + hh;
    }
    t.scatola = [minX, minY, minZ, maxX, maxY, maxZ];
  }

  /** La passata d'ombra: i tipi che si muovono (`dinamici` vero) o quelli fermi. Torna [disegni, triangoli]. */
  disegnaOmbra(vp, dinamici) {
    const gl = this.gl;
    gl.useProgram(this.programmaOmbra);
    gl.uniformMatrix4fv(this.uoVP, false, vp);
    // ⚠ ANCHE QUI, e qui conta il doppio: le mappe d'ombra sono DUE (la ferma e
    // quella di chi si muove), quindi un tipo non cullato si paga due volte in
    // più, oltre allo schermo e allo specchio. I piani si ricavano dal VP della
    // luce, che è proprio quello con cui si sta disegnando.
    pianiFrustum(vp, this._pianiOmbra);
    let disegni = 0, tri = 0;
    for (const [nome, t] of this.tipi) {
      if (t.n === 0 || this.dinamici.has(nome) !== dinamici) continue;
      if (t.scatola && !scatolaNelFrustum(this._pianiOmbra, t.scatola[0], t.scatola[1], t.scatola[2], t.scatola[3], t.scatola[4], t.scatola[5])) continue;
      gl.bindVertexArray(t.vao);
      if (t.sporco) { gl.bindBuffer(gl.ARRAY_BUFFER, t.ibo); gl.bufferData(gl.ARRAY_BUFFER, t.istanze, gl.DYNAMIC_DRAW); t.sporco = false; }
      gl.drawArraysInstanced(gl.TRIANGLES, 0, t.vertici, t.n);
      disegni++; tri += t.triangoli * t.n;
    }
    gl.bindVertexArray(null);
    return [disegni, tri];
  }

  /** Disegna tutti i tipi con le stesse uniform della resa dei chunk, nella
   *  passata in corso (la vista, o lo specchio: VP e taglio li dice la resa). */
  disegna(resa, camera) {
    const gl = this.gl, u = this.u, s = resa.sole;
    gl.useProgram(this.programma);
    gl.uniformMatrix4fv(u.uVP, false, resa.vpCorrente || resa.vp);
    gl.uniform1f(u.uTaglio, resa.taglio ?? -1e9);
    const buco = resa.vpCorrente === resa.vpSpecchio ? [0, 0, 0, 0] : (resa.buco || [0, 0, 0, 0]);
    gl.uniform3f(u.uOcchio, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform1f(u.uTempo, resa.tempo);
    gl.uniform3f(u.uSoleVerso, s.verso[0], s.verso[1], s.verso[2]);
    gl.uniform3f(u.uSoleCol, s.colore[0], s.colore[1], s.colore[2]);
    gl.uniform1f(u.uSoleForza, s.forza);
    gl.uniform3f(u.uCieloCol, s.cielo[0], s.cielo[1], s.cielo[2]);
    gl.uniform4fv(u.uMaterie, resa.materie);
    gl.uniform2f(u.uNebbia, resa.nebbia.da, resa.nebbia.a);
    gl.uniform3f(u.uNebbiaCol, resa.nebbia.colore[0], resa.nebbia.colore[1], resa.nebbia.colore[2]);
    gl.uniform3f(u.uCam, camera.occhio[0], camera.occhio[1], camera.occhio[2]);
    gl.uniform1f(u.uOmbra, resa.ombra && resa.altezze ? 1 : 0);
    if (resa.altezze) { gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, resa.ombre.tex); gl.uniform1i(u.uOmbre, 0); gl.uniform2f(u.uOmbreScala, resa.ombre.scala, resa.ombre.offset); gl.uniform4f(u.uAltRett, resa.altRett[0], resa.altRett[1], resa.altRett[2], resa.altRett[3]); }
    resa.legaMappa(u);
    let disegni = 0, tri = 0, ist = 0, saltati = 0;
    gl.uniform1f(u.uSagoma, 0);
    // ⚠ SI CULLA PER TIPO, e prima non si cullava AFFATTO: ogni tipo di modello
    // veniva disegnato in OGNI passata, anche quello dietro le spalle. Con mille
    // arredi diversi (l'omega test) sono mille chiamate a schermo, mille nello
    // specchio e mille in ognuna delle due mappe d'ombra — quattromila per
    // fotogramma, la maggior parte per roba che non si vede. I chunk si
    // cullavano da sempre; i modelli no, e nessuno se n'era accorto perché
    // finché i tipi erano dieci non si vedeva.
    // ⚠ E la scatola è già pronta (la calcola `istanze` quando cambiano): qui è
    // un test contro sei piani, cioè niente.
    const piani = resa.pianiCorrente;
    for (const [nome, t] of this.tipi) {
      if (t.n === 0) continue;
      if (piani && t.scatola && !scatolaNelFrustum(piani, t.scatola[0], t.scatola[1], t.scatola[2], t.scatola[3], t.scatola[4], t.scatola[5])) { saltati++; continue; }
      // ⚠ IL GIOCATORE NON SI BUCA: il buco serve a vederlo, non a cancellarlo
      gl.uniform4f(u.uBuco, buco[0], buco[1], buco[2], nome === 'omino' ? 0 : buco[3]);
      gl.bindVertexArray(t.vao);
      if (t.sporco) { gl.bindBuffer(gl.ARRAY_BUFFER, t.ibo); gl.bufferData(gl.ARRAY_BUFFER, t.istanze, gl.DYNAMIC_DRAW); t.sporco = false; }
      gl.drawArraysInstanced(gl.TRIANGLES, 0, t.vertici, t.n);
      disegni++; tri += t.triangoli * t.n; ist += t.n;
    }
    // ── la sagoma del giocatore dove è COPERTO: profondità al contrario, fusione, niente scrittura ──
    const sg = this.sagoma && this.tipi.get(this.sagoma);
    if (sg && sg.n > 0 && resa.vpCorrente !== resa.vpSpecchio) {
      gl.uniform1f(u.uSagoma, 1);
      gl.depthFunc(gl.GREATER); gl.depthMask(false);
      gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      gl.bindVertexArray(sg.vao);
      gl.drawArraysInstanced(gl.TRIANGLES, 0, sg.vertici, sg.n);
      gl.disable(gl.BLEND); gl.depthMask(true); gl.depthFunc(gl.LESS);
      gl.uniform1f(u.uSagoma, 0);
      disegni++;
    }
    gl.bindVertexArray(null);
    this.statistiche.disegni = disegni; this.statistiche.triangoli = tri; this.statistiche.istanze = ist; this.statistiche.saltati = saltati;
  }
}

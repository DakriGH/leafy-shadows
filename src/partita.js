// LA PARTITA — il sandbox sul nucleo: si cammina, si scava, si posa, si
// lanciano corpi, il mondo cresce sotto i piedi. Niente Babylon.
//
// È il gioco vero che nasce sul nucleo (docs/RIFONDAZIONE.md): la resa è
// `nucleo/resa.js`, il mondo è `world/` (lo stesso di oggi: worldgen,
// frontiera, blocchi), chi cammina è `gioco/passeggero.js`, la mira è
// `gioco/mira.js`, i corpi sono `partita/corpi.js` a passo fisso. I comandi a
// dito sono `ui/comandi.js` (joystick + salto + piccone), lo sguardo è
// `partita/sguardo.js`. Il 🩺 è lo stesso del gioco.
//
// Indirizzo: ?seme=4242 ?erba=8 ?raggio=96 ?ombra=no ?specchio=no ?dpr=1.5
//            ?ora=0.35 ?corpi=200 ?terza
import { creaContesto, nomeScheda } from './nucleo/gl.js';
import { Resa } from './nucleo/resa.js';
import { Modelli, leggiModello, modelloCubo } from './nucleo/modelli.js';
import { Mondo, CHUNK } from './world/world.js';
import { generaChunkOpenWorld } from './world/worldgen.js';
import { registraDecorazioni, DECORAZIONI } from './world/decorazioni.js';
import { defDi, tipoBase, registraBlocco, BLOCCHI } from './world/blocks.js';
import { paletteBlocco } from './world/stagioni.js';
import { Passeggero, tastiera } from './gioco/passeggero.js';
import { miraCompleta, PORTATA } from './gioco/mira.js';
import { CASSETTA, ATTREZZI } from './gioco/cantiere.js';
import { Scavo, durataPer } from './gioco/scavo.js';
import { ascoltaClic, ascoltaPressione } from './gioco/puntatore.js';
import { ComandiTocco } from './ui/comandi.js';
import { ModoGui } from './ui/modo.js';
import { Diagnostica } from './ui/diagnostica.js';
import { Streaming } from './partita/streaming.js';
import { Sguardo } from './partita/sguardo.js';
import { Corpi } from './partita/corpi.js';
import { RegistroModelli } from './partita/registro-modelli.js';
import { creaLavoro } from './nucleo/lavoro.js';
import { ARREDI, registraArredi, gatto, TAVOLOZZE } from './partita/arredi.js';
import { Bagliori } from './nucleo/bagliori.js';
import { generaChunkZoo, QUOTA as QUOTA_ZOO } from './partita/zoo.js';
import { registroResa, registroGiornoPartita, registroCorpi, registroStreaming, registroGiocatore, registroScene, registroMeteo } from './partita/registri.js';
import { Meteo } from './partita/meteo.js';
import { impacchetta, spacchetta, contaModifiche } from './partita/salvataggio.js';

const params = new URLSearchParams(location.search);
const opz = {
  seme: +(params.get('seme') || 4242),
  erba: Math.max(0, Math.min(8, +(params.get('erba') ?? 8))),
  raggio: Math.max(48, Math.min(160, +(params.get('raggio') || 96))),
  ombra: params.get('ombra') !== 'no',
  mappa: params.get('mappa') === 'no' ? 0 : Math.max(256, Math.min(4096, +(params.get('mappa') || 2048))),   // la mappa d'ombra vera: lato (2048), o `no` per misurare senza
  specchio: params.get('specchio') === 'no' ? 0 : Math.max(0.2, Math.min(1, +(params.get('specchio') ?? 0.5) || 0.5)),
  dprMax: +(params.get('dpr') || 1.5),
  ora: params.has('ora') ? +params.get('ora') : null,
  corpi: +(params.get('corpi') || 0),
  terza: params.has('terza'),
  zoo: params.has('zoo'),            // la scena di prova (partita/zoo.js) al posto dell'open world
};

const tela = document.getElementById('tela');
const { gl, dpr, ridimensiona } = creaContesto(tela, { antialias: true, dprMax: opz.dprMax });
const resa = new Resa(gl);
resa.ombra = opz.ombra;
resa.mappa.attiva = opz.mappa > 0;
if (opz.mappa > 0 && opz.mappa !== resa.mappa.lato) { resa.mappa.lato = opz.mappa; resa.mappa.latoDin = Math.max(256, opz.mappa / 2); resa._preparaMappa(); }
resa.specchio.attivo = opz.specchio > 0; resa.specchio.scala = opz.specchio || 0.5;
const modelli = new Modelli(gl);
modelli.registra('cubo', modelloCubo());
// ⚠ IL GIOCATORE È IL GATTO BLU delle concept art (partita/arredi.js), non un
// cubo arancione; gli arredi (gatto arancione, funghi, scale, attrezzi) sono
// blocchi «modello» posabili dalla cassetta.
modelli.registra('omino', gatto(TAVOLOZZE.blu));
registraArredi();
for (const [id, a] of Object.entries(ARREDI)) modelli.registra(id, a.costruisci());
// il lampione spento è un blocco come il lampione, senza luce
if (!BLOCCHI.lampioneSpento) registraBlocco('lampioneSpento', { ...defDi('lampione'), nome: 'Lampione spento', modello: 'lampioneSpento', luce: undefined, notte: false });

// ── il mondo, in streaming ───────────────────────────────────────────────────
registraDecorazioni();
const mondo = new Mondo();
const registro = new RegistroModelli();
mondo.onEvento = (e) => registro.evento(e);
const lavoro = params.get('worker') === 'no' ? null : creaLavoro();
const genera = opz.zoo ? generaChunkZoo : (m, cx, cz) => generaChunkOpenWorld(m, cx, cz, opz.seme);
const streaming = new Streaming(mondo, resa, genera, { erba: opz.erba, raggioResa: opz.raggio, lavoro });
const bagliori = new Bagliori(gl);
resa.apriFinestraAltezze(0.5, 0.5, 512);
// ⚠ IL SALVATAGGIO SI RIMETTE PRIMA DI GENERARE: sono le modifiche del
// giocatore (partita/salvataggio.js), e la frontiera le riapplica a ogni
// chunk che nasce. `?nuovo` riparte da zero.
const CHIAVE_SALVATAGGIO = opz.zoo ? 'leafy-zoo' : `leafy-partita-${opz.seme}`;
let salvate = 0;
try { if (params.has('nuovo')) localStorage.removeItem(CHIAVE_SALVATAGGIO); else salvate = spacchetta(mondo, localStorage.getItem(CHIAVE_SALVATAGGIO)); } catch { salvate = 0; }
let salvaFra = 0;   // ms: si salva un secondo dopo l'ultima modifica, non a ogni blocco
function salva() { try { localStorage.setItem(CHIAVE_SALVATAGGIO, impacchetta(mondo, { seme: opz.seme, quando: Date.now() })); } catch { /* memoria piena o privata: pazienza */ } }
const tAvvio = performance.now();
streaming.avvio(0.5, 0.5);
const tCostruzione = performance.now() - tAvvio;

// i modelli veri (alberi, lampioni, panchine), dal disco
const modelliCaricati = new Set(['cubo', 'omino', ...Object.keys(ARREDI)]);
async function caricaModello(nome) {
  if (modelliCaricati.has(nome)) return; modelliCaricati.add(nome);
  try {
    const r = await fetch(`./modelli/nucleo/${nome}.bin`);
    if (!r.ok) throw new Error(`${r.status}`);
    const modello = leggiModello(await r.arrayBuffer());
    modelli.registra(nome, modello);
    registro.sporchi.add(nome);
    if (nome === 'lampione') {
      // ⚠ IL LAMPIONE SPENTO: stessa geometria, il vetro non emette ed è grigio
      const b = new Uint8Array(modello.byte); for (let i = 0; i < modello.vertici; i++) if (b[i * 20 + 15] === 1) { b[i * 20 + 15] = 0; b[i * 20 + 16] = 0x7a; b[i * 20 + 17] = 0x78; b[i * 20 + 18] = 0x6a; }
      modelli.registra('lampioneSpento', { ...modello, byte: b }); modelliCaricati.add('lampioneSpento'); registro.sporchi.add('lampioneSpento');
    }
  } catch (e) { console.warn(`modello ${nome}: ${e.message}`); }
}
function aggiornaModelli() {
  for (const [nome, lista] of registro.cambiate()) {
    if (!modelli.tipi.has(nome)) { caricaModello(nome); registro.sporchi.add(nome); continue; }
    modelli.istanze(nome, lista);
    // ⚠ OGNI LAMPIONE HA IL SUO BAGLIORE: la lanterna sta 2,35 sopra la base
    if (nome === 'lampione') {
      const b = new Float32Array((lista.length / 4) * 8);
      for (let i = 0; i < lista.length / 4; i++) b.set([lista[i * 4], lista[i * 4 + 1] + 2.35, lista[i * 4 + 2], 1.6, 1.0, 0.85, 0.5, 1.0], i * 8);
      bagliori.istanze(b);
    }
  }
}

// ── chi cammina ──────────────────────────────────────────────────────────────
function cimaIn(x, z) { for (let y = 60; y > -60; y--) if (mondo.solido(x, y, z)) return y + 1; return 8; }
const passeggero = new Passeggero(mondo, { x: 0.5, y: (opz.zoo ? QUOTA_ZOO : cimaIn(0, 0)) + 0.5 + (opz.zoo ? 1 : 0), z: 0.5 });
const intento = tastiera();
const comandi = new ComandiTocco(intento);
const modoGui = new ModoGui((aTocco) => { if (!aTocco && comandi.azzera) comandi.azzera(); });
const sguardo = new Sguardo(tela, { alpha: 0.6, beta: -0.2 });
let volo = false, terza = opz.terza;
const giu = new Set();
window.addEventListener('keydown', (e) => {
  if (/^(INPUT|TEXTAREA)$/.test(e.target && e.target.tagName)) return;
  giu.add(e.code);
  if (e.code === 'KeyF') cambiaVolo();
  if (e.code === 'KeyH') { const st = document.getElementById('stato'); st.hidden = !st.hidden; }
  if (e.code === 'KeyV') cambiaTerza();
  if (e.code === 'KeyC') lanciaCubi(20);
  if (/^Digit[0-9]$/.test(e.code)) scegli(e.code === 'Digit0' ? 9 : +e.code.slice(5) - 1);
});
window.addEventListener('keyup', (e) => giu.delete(e.code));
window.addEventListener('blur', () => giu.clear());
// ⚠ LA ROTELLA È LO ZOOM DELLA TERZA PERSONA (il committente non poteva allontanarsi); la cassetta va coi numeri
let distanzaTerza = 6;
window.addEventListener('wheel', (e) => { if (terza) distanzaTerza = Math.max(1.5, Math.min(40, distanzaTerza * (e.deltaY > 0 ? 1.12 : 0.89))); }, { passive: true });
// ⚠ IL PIZZICO CONTA SOLO LE DITA SULLA TELA (`targetTouches`): il dito sul
// joystick sta in `e.touches` e con «length === 2» impediva di zoomare mentre
// si cammina. Con due dita sulla tela lo sguardo si ferma (se no la pinza gira
// anche la camera) e riparte da dove sono le dita quando se ne stacca una.
let pizzico = 0;
const pizzica = (e) => {
  const t = e.targetTouches;
  if (t.length < 2) { pizzico = 0; sguardo.fermo = false; return; }
  sguardo.fermo = true;
  const d = Math.hypot(t[0].clientX - t[1].clientX, t[0].clientY - t[1].clientY);
  if (pizzico > 0 && terza && d > 1) distanzaTerza = Math.max(1.5, Math.min(40, distanzaTerza * pizzico / d));
  pizzico = d;
};
for (const n of ['touchstart', 'touchmove', 'touchend', 'touchcancel']) tela.addEventListener(n, pizzica, { passive: true });
function impostaVolo(v) { volo = v; document.getElementById('volo').classList.toggle('acceso', volo); if (volo) passeggero.vy = 0; }
function impostaTerza(v) { terza = v; document.getElementById('terza').classList.toggle('acceso', terza); }
function cambiaVolo() { impostaVolo(!volo); }
function cambiaTerza() { impostaTerza(!terza); }
document.getElementById('volo').addEventListener('click', cambiaVolo);
document.getElementById('terza').addEventListener('click', cambiaTerza);
document.getElementById('cubi').addEventListener('click', () => lanciaCubi(20));
if (terza) document.getElementById('terza').classList.add('acceso');

/** Il passo del passeggero, a passo fisso come i corpi (60 Hz), o il volo.
 *  ⚠ SI INTERPOLA: la posizione disegnata sta fra il passo prima e quello dopo
 *  (`posizioneDisegnata()`), se no a 90 Hz con passi a 60 il gatto va a scatti. */
const PASSO = 1 / 60; let resto = 0;
const prima = { x: passeggero.x, y: passeggero.y, z: passeggero.z };
// ⚠ LO SCALINO NON È UN TELETRASPORTO: salendo di un blocco (SCALINO del
// passeggero) la quota disegnata insegue quella vera in ~120 ms; scendendo
// e cadendo si segue subito, se no il gatto galleggia.
let yDolce = passeggero.y, tDolce = 0;
function posizioneDisegnata() {
  const a = Math.min(1, resto / PASSO);
  const y = prima.y + (passeggero.y - prima.y) * a;
  if (y < yDolce) yDolce = y; else yDolce += (y - yDolce) * (1 - Math.exp(-tDolce / 0.12));
  return [prima.x + (passeggero.x - prima.x) * a, yDolce, prima.z + (passeggero.z - prima.z) * a];
}
function cammina(dt) {
  resto = Math.min(resto + dt, PASSO * 4);
  const av = sguardo.avantiPiano();
  while (resto >= PASSO) {
    resto -= PASSO;
    prima.x = passeggero.x; prima.y = passeggero.y; prima.z = passeggero.z;
    if (volo) {
      const v = 9 * PASSO, fx = av.x, fz = av.z;
      passeggero.x += (fx * intento.avanti - fz * intento.destra) * v;
      passeggero.z += (fz * intento.avanti + fx * intento.destra) * v;
      passeggero.y += ((intento.salta ? 1 : 0) - (giu.has('ShiftLeft') || giu.has('KeyX') ? 1 : 0)) * v;
      passeggero.vy = 0;
      continue;
    }
    passeggero.aggiorna(PASSO, intento, av);
    // in acqua si galleggia: la caduta è lenta e il salto è una bracciata
    const t = mondo.tipo(Math.floor(passeggero.x), Math.floor(passeggero.y + 0.3), Math.floor(passeggero.z));
    if (t && defDi(t).acqua) { if (passeggero.vy < -1.2) passeggero.vy = -1.2; if (intento.salta) passeggero.vy = 3; passeggero.aTerra = false; }
  }
}

/**
 * L'occhio. In prima persona la testa. In terza, alla Animal Crossing: la
 * camera SEGUE il gatto con un ritardo morbido (mira e occhio filtrati), sta
 * SEMPRE alla stessa distanza e ATTRAVERSA gli ostacoli (di fabbrica: il buco
 * di visuale nel fragment lascia vedere il gatto lo stesso); con
 * `cameraTira` invece si tira dentro davanti a un muro, come prima.
 */
const cam3 = { mira: null, occhio: null, tira: false, buco: false };
let giroGatto = 0, giroVoluto = 0;   // di spalle alla camera, come si parte
function camera(dt = 0) {
  tDolce = dt;
  const v = sguardo.verso();
  const [px, py, pz] = posizioneDisegnata();
  const testa = [px, py + (terza ? 0.8 : 1.0), pz];
  // ⚠ PRIMA PERSONA: occhio all'altezza della testa del gatto e campo largo (78°): «troppo bassa e con un fov troppo ravvicinato»
  if (!terza) { cam3.mira = null; return { occhio: testa, centro: [testa[0] + v[0], testa[1] + v[1], testa[2] + v[2]], fov: 1.36, rapporto: tela.width / tela.height }; }
  let d = distanzaTerza;
  if (cam3.tira) for (let s = 0.5; s <= distanzaTerza; s += 0.5) { if (mondo.solido(Math.floor(testa[0] - v[0] * s), Math.floor(testa[1] - v[1] * s), Math.floor(testa[2] - v[2] * s))) { d = Math.max(0.6, s - 0.6); break; } }
  const voluto = [testa[0] - v[0] * d, testa[1] - v[1] * d, testa[2] - v[2] * d];
  // il filtro: costante di tempo 90 ms sulla mira, 60 ms sull'occhio (la rotazione resta pronta)
  if (!cam3.mira) { cam3.mira = testa.slice(); cam3.occhio = voluto.slice(); }
  const km = 1 - Math.exp(-dt / 0.09), ko = 1 - Math.exp(-dt / 0.06);
  for (let i = 0; i < 3; i++) { cam3.mira[i] += (testa[i] - cam3.mira[i]) * km; cam3.occhio[i] += (voluto[i] - cam3.occhio[i]) * ko; }
  return { occhio: cam3.occhio.slice(), centro: cam3.mira.slice(), fov: 1.15, rapporto: tela.width / tela.height };
}

// ── la cassetta e il cantiere ────────────────────────────────────────────────
const barra = document.getElementById('barra');
const azioneEl = document.getElementById('azione');
let scelto = 1;
const CASSETTA_PARTITA = [...CASSETTA, ...Object.keys(ARREDI)];
const bottoni = CASSETTA_PARTITA.map((t, i) => {
  const b = document.createElement('button');
  const def = t ? defDi(t) : null;
  const nome = !t ? 'mano' : ATTREZZI[t] ? ATTREZZI[t].nome : (def && def.nome) || t;
  let col = null;
  if (t) { try { col = ATTREZZI[t] ? ATTREZZI[t].colore : ARREDI[t] ? ARREDI[t].colore : paletteBlocco(tipoBase(t), 8).cima; } catch { col = null; } }
  b.innerHTML = `<span class="q" style="background:${col != null ? '#' + (col >>> 0).toString(16).padStart(6, '0') : 'transparent'}"></span>${nome}`;
  b.addEventListener('click', () => scegli(i));
  barra.appendChild(b);
  return b;
});
function scegli(i) { scelto = ((i % CASSETTA_PARTITA.length) + CASSETTA_PARTITA.length) % CASSETTA_PARTITA.length; bottoni.forEach((b, k) => b.classList.toggle('scelto', k === scelto)); bottoni[scelto].scrollIntoView({ inline: 'center', block: 'nearest' }); }
scegli(1);

const scavo = new Scavo();
let bersaglio = null;   // { cella, faccia, prima } della mira, o null
let tienePremuto = false;
// ⚠ LA MIRA È LIBERA: si mira DOVE STA IL DITO (o il mouse), in prima e in terza
// persona, entro la portata del gatto; il mirino al centro resta un'opzione
// (`miraCentro`). `punto` è l'ultimo puntatore visto, in coordinate della tela.
const puntatore = { x: 0, y: 0, visto: false };
let miraCentro = false;
tela.addEventListener('pointermove', (e) => { puntatore.x = e.clientX; puntatore.y = e.clientY; puntatore.visto = true; });
tela.addEventListener('pointerdown', (e) => { puntatore.x = e.clientX; puntatore.y = e.clientY; puntatore.visto = true; });
// ⚠ I MODELLI NON SONO SOLIDI (lampioni, funghi, attrezzi: il passo li attraversa),
// e il raggio della mira li attraversava pure: «i lampioni non si possono
// spegnere». Si mira con le loro SCATOLE (`miraCompleta`): quella del lampione
// è alta tre e larga 0,9 (vedi `world/decorazioni.js`), gli arredi una cella.
const _scatole = [];
function scatoleDaMirare(occhio) {
  _scatole.length = 0;
  const lim = (PORTATA + 3) * (PORTATA + 3);
  for (const [nome, celle] of registro.tipi) {
    if (nome === 'omino' || nome === 'cubo') continue;
    const d = DECORAZIONI[nome] || (nome === 'lampioneSpento' ? DECORAZIONI.lampione : null);
    const altezza = d ? d.altezza : 1, mezza = d ? d.mezza : 0.5;
    for (const [x, y, z] of celle.values()) {
      const dx = x - occhio.x, dz = z - occhio.z;
      if (dx * dx + dz * dz > lim) continue;
      _scatole.push({ min: { x: x - mezza, y, z: z - mezza }, max: { x: x + mezza, y: y + altezza, z: z + mezza }, dato: { cella: [Math.floor(x), y, Math.floor(z)] } });
    }
  }
  return _scatole;
}
/** Il raggio dalla camera attraverso il punto della tela (o il centro). */
function raggioDiMira(cam) {
  const f = [cam.centro[0] - cam.occhio[0], cam.centro[1] - cam.occhio[1], cam.centro[2] - cam.occhio[2]];
  const fl = Math.hypot(...f) || 1; f[0] /= fl; f[1] /= fl; f[2] /= fl;
  const r = [f[2], 0, -f[0]]; const rl = Math.hypot(...r) || 1; r[0] /= rl; r[2] /= rl;   // destra = f × su
  const u = [r[1] * f[2] - r[2] * f[1], r[2] * f[0] - r[0] * f[2], r[0] * f[1] - r[1] * f[0]];
  let nx = 0, ny = 0;
  if (!miraCentro && puntatore.visto) { nx = (puntatore.x / tela.clientWidth) * 2 - 1; ny = 1 - (puntatore.y / tela.clientHeight) * 2; }
  const t = Math.tan(cam.fov / 2), sx = nx * t * cam.rapporto, sy = ny * t;
  const d = [f[0] + r[0] * sx + u[0] * sy, f[1] + r[1] * sx + u[1] * sy, f[2] + r[2] * sx + u[2] * sy];
  const dl = Math.hypot(...d); return { x: d[0] / dl, y: d[1] / dl, z: d[2] / dl };
}
/** Il lampione sotto una cella (la base, o fino a due celle sotto: il palo è aria). */
function lampioneIn(x, y, z) {
  for (let dy = 0; dy <= 2; dy++) { const t = mondo.tipo(x, y - dy, z); if (t === 'lampione' || t === 'lampioneSpento') return [x, y - dy, z, t]; if (t && dy === 0) return null; }
  return null;
}
function accendiSpegni(x, y, z, t) { mondo.togli(x, y, z); mondo.metti(x, y, z, t === 'lampione' ? 'lampioneSpento' : 'lampione'); streaming.tocca(x, z); salvaFra = 1000; }
/** Cosa farebbe il tocco adesso: [verbo, etichetta]. */
function azioneCorrente() {
  if (!bersaglio) return ['niente', puntatore.visto ? 'troppo lontano' : ''];
  const tipo = CASSETTA_PARTITA[scelto];
  const [x, y, z] = bersaglio.cella; const t = mondo.tipo(x, y, z);
  const lamp = lampioneIn(x, y, z);
  if (comandi.demolisci) return ['rompi', `rompi: ${t ? defDi(t).nome : ''} (tieni premuto)`];
  if (lamp && (!tipo || ATTREZZI[tipo])) return ['lampione', lamp[3] === 'lampione' ? 'spegni il lampione' : 'accendi il lampione'];
  if (tipo && !ATTREZZI[tipo]) return ['posa', `posa: ${defDi(tipo).nome}`];
  return ['tocca', `tocca: ${t ? defDi(t).nome : ''}`];
}
function cambiaBlocco(x, y, z, tipo) {
  if (tipo) mondo.metti(x, y, z, tipo); else mondo.togli(x, y, z);
  streaming.tocca(x, z);
  salvaFra = 1000;
}
function posa() {
  if (!bersaglio) return;
  const tipo = CASSETTA_PARTITA[scelto];
  if (!tipo || ATTREZZI[tipo]) return;
  const [x, y, z] = bersaglio.prima;
  if (mondo.pieno(x, y, z)) return;
  // non addosso a chi cammina
  const p = passeggero;
  if (x + 1 > p.x - 0.3 && x < p.x + 0.3 && z + 1 > p.z - 0.3 && z < p.z + 0.3 && y + 1 > p.y && y < p.y + 0.9) return;
  cambiaBlocco(x, y, z, tipo);
}
function rompiMirato() { if (!bersaglio) return; const [x, y, z] = bersaglio.cella; cambiaBlocco(x, y, z, null); }
// mouse: sinistro tenuto = scava, destro = posa; dito: tocco = posa, col piccone acceso = scava
tela.addEventListener('contextmenu', (e) => e.preventDefault());
ascoltaClic(tela, (e) => {
  if (sguardo.trascinato > 6) return;
  const [verbo] = azioneCorrente();
  // il destro (o il tocco senza piccone): posa, o accende/spegne, o tocca
  if (e.button === 2 || (e.pointerType === 'touch' && !comandi.demolisci)) {
    if (verbo === 'lampione') { const l = lampioneIn(...bersaglio.cella); accendiSpegni(l[0], l[1], l[2], l[3]); }
    else if (verbo === 'posa') posa();
  } else if (e.button === 0 && verbo === 'lampione' && e.pointerType !== 'touch') { const l = lampioneIn(...bersaglio.cella); accendiSpegni(l[0], l[1], l[2], l[3]); }
});
ascoltaPressione(tela, {
  onInizio: (e) => { tienePremuto = !(e.pointerType === 'touch' && !comandi.demolisci); },
  onFine: () => { tienePremuto = false; scavo.molla(); },
}, 0);

// ── i corpi ──────────────────────────────────────────────────────────────────
const corpi = new Corpi(mondo);
const TINTE = [[0.36, 0.72, 0.30], [0.62, 0.42, 0.26], [0.84, 0.26, 0.24], [0.28, 0.44, 0.84], [0.93, 0.78, 0.26], [0.62, 0.64, 0.66], [0.96, 0.96, 0.96]];
let bufIstanze = null;
function lanciaCubi(n) {
  const v = sguardo.verso();
  const o = camera().occhio;
  for (let i = 0; i < n && corpi.lista.length < 800; i++) {
    const s = 9 + Math.random() * 4, j = () => (Math.random() - 0.5) * 2.2;
    corpi.aggiungi({ x: o[0] + v[0] * 1.2 + (Math.random() - 0.5) * 0.4, y: o[1] + v[1] * 1.2 + Math.random() * 0.4, z: o[2] + v[2] * 1.2 + (Math.random() - 0.5) * 0.4,
      vx: v[0] * s + j(), vy: v[1] * s + 2 + j(), vz: v[2] * s + j(), lato: 0.35 + Math.random() * 0.3, colore: TINTE[Math.floor(Math.random() * TINTE.length)], giro: Math.random() * Math.PI });
  }
}
if (opz.corpi > 0) {
  for (let i = 0; i < Math.min(800, opz.corpi); i++) corpi.aggiungi({ x: passeggero.x + (Math.random() - 0.5) * 12, y: passeggero.y + 6 + Math.random() * 10, z: passeggero.z + (Math.random() - 0.5) * 12, lato: 0.35 + Math.random() * 0.3, colore: TINTE[i % TINTE.length], giro: Math.random() * Math.PI });
}

// ── la giornata (come il banco) ──────────────────────────────────────────────
const giorno = { ora: opz.ora ?? 0.35, auto: opz.ora === null, durata: 600 };
// il meteo: il mare vaga da solo (partita/meteo.js); ?mare=0.6 lo ferma lì
const meteo = new Meteo(opz.seme);
if (params.has('mare')) { meteo.auto = false; meteo.agitazione = meteo.meta = Math.max(0, Math.min(1, +params.get('mare') || 0)); }
function sole(dt) {
  if (giorno.auto) giorno.ora = (giorno.ora + dt / giorno.durata) % 1;
  const ora = giorno.ora;
  const a = ora * Math.PI * 2 - Math.PI / 2;
  // ⚠ IL SOLE NON VA MAI A PICCO: a mezzogiorno sta a 48° (0,74), se no ogni
  // parete è di spalle e il mondo è piatto; all'alba a 14°, come prima.
  const alt = 0.24 + 0.5 * Math.max(0, Math.sin(a));
  const az = a * 0.5;
  resa.sole.verso = [-Math.cos(az) * Math.cos(Math.asin(alt)), -alt, -Math.sin(az) * Math.cos(Math.asin(alt))];
  // ⚠ NON si chiama «giorno»: quello è l'oggetto qui sopra, e un const omonimo
  // dentro la funzione lo oscurava PRIMA di nascere (TDZ) — pagina bianca.
  const luce = Math.max(0, Math.min(1, (Math.sin(a) + 0.1) * 2));
  resa.sole.forza = luce;
  resa.mare = meteo.aggiorna(dt);
  // ⚠ A MEZZOGIORNO IL SOLE È BIANCO: al sole pieno si vede la palette ESATTA
  // (vivace, come le concept); il caldo entra solo col sole basso.
  const caldo = Math.min(1, Math.max(0, (alt - 0.24) / 0.4));
  resa.sole.colore = [1.0, 0.78 + 0.22 * caldo, 0.55 + 0.45 * caldo];
  // ⚠ L'OMBRA DEL CEL SHADING SI DEVE VEDERE: a mezzogiorno vale circa il 60 % del
  // sole (in sRGB), appena fredda. Con lo 0,54 di prima era all'80 %: invisibile.
  resa.sole.cielo = [0.10 + 0.18 * luce, 0.12 + 0.20 * luce, 0.24 + 0.18 * luce];   // ~56 % del sole in sRGB, appena fredda
  resa.nebbia.colore = [0.25 + 0.47 * luce, 0.35 + 0.5 * luce, 0.5 + 0.42 * luce];
  gl.clearColor(resa.nebbia.colore[0], resa.nebbia.colore[1], resa.nebbia.colore[2], 1);
}
resa.nebbia.da = opz.raggio - 24; resa.nebbia.a = opz.raggio + 8;

// ── il giro ──────────────────────────────────────────────────────────────────
const tempi = [], jsMs = [], storiaFps = [];
let ultimo = performance.now(), fotogrammi = 0, ultimaStampa = 0;
function giro(adesso) {
  const dt = Math.min(0.1, (adesso - ultimo) / 1000); ultimo = adesso;
  const tj = performance.now();
  ridimensiona();
  sole(dt);
  cammina(dt);
  corpi.avanza(dt);
  streaming.aggiorna(passeggero.x, passeggero.z, 5);
  resa.seguiAltezze(passeggero.x, passeggero.z);
  aggiornaModelli();
  const cam = camera(dt);
  resa.buco = terza && cam3.buco ? [cam.centro[0], cam.centro[1] - 0.2, cam.centro[2], 0.75] : [0, 0, 0, 0];
  // la mira, dall'occhio
  const v = sguardo.verso();
  const rm = raggioDiMira(cam);
  const occhio = { x: cam.occhio[0], y: cam.occhio[1], z: cam.occhio[2] };
  bersaglio = miraCompleta(mondo, occhio, rm, scatoleDaMirare(occhio), PORTATA + (terza ? distanzaTerza : 0));
  // una scatola presa (lampione, fungo…): la cella mirata è la SUA, non il blocco dietro
  if (bersaglio && bersaglio.scatola) bersaglio.cella = bersaglio.dato.cella;
  // ⚠ ENTRO LA PORTATA DEL GATTO, non della camera: in terza persona a 40 blocchi non si scava la collina di fronte
  if (bersaglio && Math.hypot(bersaglio.cella[0] + 0.5 - passeggero.x, bersaglio.cella[1] + 0.5 - passeggero.y - 0.5, bersaglio.cella[2] + 0.5 - passeggero.z) > PORTATA + 1.5) bersaglio = null;
  void v;
  if (tienePremuto && bersaglio) {
    const [x, y, z] = bersaglio.cella;
    scavo.premi(x + ',' + y + ',' + z, durataPer(defDi(mondo.tipo(x, y, z))), adesso);
    if (scavo.finito(adesso)) rompiMirato();
  } else if (!tienePremuto) scavo.molla();
  // i corpi e l'omino
  modelli.istanze('cubo', bufIstanze = corpi.istanze(bufIstanze), 8);
  // ⚠ ALLA ANIMAL CROSSING: il gatto si gira verso dove CAMMINA (non verso la
  // camera), con una rotazione morbida; cammina con un passetto
  if (intento.avanti || intento.destra) giroVoluto = Math.PI - passeggero.verso;
  let dg = giroVoluto - giroGatto; dg = Math.atan2(Math.sin(dg), Math.cos(dg)); giroGatto += dg * (1 - Math.exp(-dt / 0.08));
  const passo = (intento.avanti || intento.destra) && passeggero.aTerra ? Math.abs(Math.sin(adesso / 90)) * 0.06 : 0;
  const [gx, gy, gz] = posizioneDisegnata();
  if (terza) modelli.istanze('omino', [gx, gy + passo, gz, 1, 1, 1, 1, giroGatto], 8); else modelli.istanze('omino', [], 8);
  resa.disegna(cam, dt, modelli);
  modelli.disegna(resa, cam);
  // ⚠ SI VEDE COSA SI STA PER FARE: il blocco mirato pieno e traslucido (giallo;
  // arancio mentre si scava; rosso col piccone), il fantasma di dove si posa
  // (bianco-azzurro), gli spigoli, e l'etichetta in basso
  if (bersaglio) {
    const [verbo, etichetta] = azioneCorrente();
    const pr = scavo.progresso(adesso);
    const [x, y, z] = bersaglio.cella;
    if (verbo === 'rompi' || pr > 0) resa.scatola(x, y, z, 1.0, 0.35 - 0.2 * pr, 0.25, 0.28 + 0.25 * pr);
    else if (verbo === 'lampione') resa.scatola(x, y, z, 1.0, 0.9, 0.4, 0.3);
    else resa.scatola(x, y, z, 1.0, 0.95, 0.5, 0.22);
    if (verbo === 'posa' && !mondo.pieno(...bersaglio.prima)) resa.scatola(bersaglio.prima[0], bersaglio.prima[1], bersaglio.prima[2], 0.6, 0.85, 1.0, 0.35, 0.0);
    resa.evidenzia(x, y, z, pr);
    azioneEl.textContent = etichetta;
  } else azioneEl.textContent = azioneCorrente()[1];
  resa.disegnaAcqua();
  bagliori.disegna(resa, cam);   // il glow delle lanterne: sprite additivi, dopo tutto
  const js = performance.now() - tj;
  tempi.push(dt * 1000); if (tempi.length > 240) tempi.shift();
  jsMs.push(js); if (jsMs.length > 240) jsMs.shift();
  fotogrammi++;
  if (passoOfficina) passoOfficina();
  if (salvaFra > 0) { salvaFra -= dt * 1000; if (salvaFra <= 0) salva(); }
  if (adesso - ultimaStampa > 500) { ultimaStampa = adesso; stampa(); }
  requestAnimationFrame(giro);
}
const q = (a, f) => { if (!a.length) return 0; const s = [...a].sort((x, y) => x - y); return s[Math.min(s.length - 1, Math.floor(s.length * f))]; };
function stampa() {
  const p50 = q(tempi, 0.5), p99 = q(tempi, 0.99), fps = p50 ? 1000 / p50 : 0;
  storiaFps.push(Math.round(fps)); if (storiaFps.length > 120) storiaFps.shift();
  document.getElementById('fps').textContent = `${fps.toFixed(0)} fps\n${p50.toFixed(1)} / ${p99.toFixed(1)} ms\nJS ${q(jsMs, 0.5).toFixed(2)} ms`;
  const st = resa.statistiche, sm = streaming.statistiche;
  document.getElementById('stato').textContent =
    `${opz.zoo ? 'ZOO' : 'PARTITA'} sul nucleo · seme ${opz.seme} · ${tela.width}×${tela.height} (dpr ${dpr.toFixed(2)})\n`
    + `disegni ${st.disegni + modelli.statistiche.disegni + st.disegniAcqua + st.disegniErba + st.disegniSpecchio} · triangoli ${(st.triangoli + modelli.statistiche.triangoli + st.triangoliAcqua + st.triangoliErba + st.triangoliSpecchio).toLocaleString('it')} · chunk ${st.chunkVisti}/${st.chunkTotali} (coda ${sm.inCoda}${lavoro ? `, in volo ${sm.inVolo} su ${lavoro.operai.length} worker` : ''}, ${sm.ultimaMs.toFixed(1)} ms) · corpi ${corpi.statistiche.corpi} (${corpi.statistiche.svegli} svegli)\n`
    + `x ${passeggero.x.toFixed(1)} y ${passeggero.y.toFixed(1)} z ${passeggero.z.toFixed(1)} · ${volo ? 'volo' : passeggero.aTerra ? 'a terra' : 'in aria'} · modifiche ${contaModifiche(mondo)}${salvate > 0 ? ` (${salvate} ricaricate)` : ''} · in mano: ${bottoni[scelto].textContent}${bersaglio ? ` · miri ${mondo.tipo(...bersaglio.cella)}` : ''}\n`
    + `WASD/joystick cammina · trascina guarda · doppio clic/L cattura il mouse · si mira dove sta il dito o il mouse · sinistro tieni = scava · destro/tocco = posa o accendi · ⛏ col dito scava · F vola · V terza (rotella/pizzico = zoom fino a 40) · C cubi · 1-9 cassetta`;
}
requestAnimationFrame(giro);

// ── l'Officina: `?officina` o il tasto 🛠, caricata solo se la si chiede ────
let officina = null, passoOfficina = null;
async function apriOfficinaPartita() {
  if (officina) { document.body.classList.toggle('con-officina'); return; }   // il 🛠 apre e chiude
  const { apriOfficina } = await import('./officina/index.js');
  const statoGiocatore = {
    get volo() { return volo; }, get terza() { return terza; }, impostaVolo, impostaTerza,
    dove: () => `x ${passeggero.x.toFixed(1)} y ${passeggero.y.toFixed(1)} z ${passeggero.z.toFixed(1)}`,
    aCasa: () => { passeggero.x = 0.5; passeggero.z = 0.5; passeggero.y = cimaIn(0, 0) + 0.5; passeggero.vy = 0; },
    modifiche: () => contaModifiche(mondo),
    nuovo: () => { try { localStorage.removeItem(CHIAVE_SALVATAGGIO); } catch { /* niente */ } location.search = `?seme=${opz.seme}&nuovo`; },
  };
  // ⚠ FUORI DAL GIOCO, SCURA: una colonna a destra della tela (il committente:
  // «l'officina doveva essere in dark mode esterna», non un pannello sopra la GUI)
  document.body.classList.add('con-officina');
  const dock = document.getElementById('dock');
  statoGiocatore.cameraTira = () => cam3.tira; statoGiocatore.impostaCameraTira = (v) => (cam3.tira = !!v);
  statoGiocatore.buco = () => cam3.buco; statoGiocatore.impostaBuco = (v) => (cam3.buco = !!v);
  statoGiocatore.miraCentro = () => miraCentro; statoGiocatore.impostaMiraCentro = (v) => { miraCentro = !!v; document.body.classList.toggle('mira-centro', miraCentro); };
  officina = apriOfficina({
    registri: [registroGiornoPartita(giorno), registroMeteo(meteo), registroResa(resa, bagliori), registroCorpi(corpi, lanciaCubi), registroStreaming(streaming), registroGiocatore(statoGiocatore), registroScene({ zoo: opz.zoo, seme: opz.seme })],
    campione: () => ({ disegni: resa.statistiche.disegni + modelli.statistiche.disegni + resa.statistiche.disegniAcqua + resa.statistiche.disegniErba + resa.statistiche.disegniSpecchio, rtMs: null }),
    autore: 'partita', titolo: 'Officina · partita', apertoSubito: true, contenitore: dock, scuro: true,
    agganciaFrame: (fn) => (passoOfficina = fn),
  });
  document.getElementById('chiudiDock').addEventListener('click', () => document.body.classList.remove('con-officina'));
}
// ⚠ IL TASTO NON SI CHIAMA «officina»: è l'id del PANNELLO dell'Officina, e il suo
// foglio di stile lo prendeva per sé (fisso, senza puntatore): il tasto spariva.
document.getElementById('apriOfficina').addEventListener('click', apriOfficinaPartita);
if (params.has('officina')) apriOfficinaPartita();

// ── il 🩺 ────────────────────────────────────────────────────────────────────
const diagnostica = new Diagnostica(() => ({
  versione: (document.getElementById('versione') || {}).textContent || 'partita in sviluppo',
  mobile: matchMedia('(pointer: coarse)').matches, tocco: navigator.maxTouchPoints > 0, modoGui: modoGui.scelta,
  ua: navigator.userAgent, cpu: navigator.hardwareConcurrency || null, memoriaGB: navigator.deviceMemory || null,
  css: [tela.clientWidth, tela.clientHeight], reso: [tela.width, tela.height], dpr: devicePixelRatio,
  livello: 0, quantiLivelli: 1, manuale: true,
  profilo: { banco: 'partita sul nucleo', seme: opz.seme, raggio: opz.raggio, erba: opz.erba, ombra: resa.ombra, specchio: opz.specchio, disegniSpecchio: resa.statistiche.disegniSpecchio, corpi: corpi.statistiche.corpi, dprMax: opz.dprMax, jsMs: +q(jsMs, 0.5).toFixed(2), jsP99: +q(jsMs, 0.99).toFixed(2), streaming: { ...streaming.statistiche }, finestra: resa.finestra && resa.finestra.spostamenti },
  ombreLampade: false, antialias: true,
  fps: q(tempi, 0.5) ? 1000 / q(tempi, 0.5) : null, p50: q(tempi, 0.5), p99: q(tempi, 0.99),
  disegni: resa.statistiche.disegni + modelli.statistiche.disegni + resa.statistiche.disegniAcqua + resa.statistiche.disegniErba + resa.statistiche.disegniSpecchio, triangoli: resa.statistiche.triangoli + modelli.statistiche.triangoli + resa.statistiche.triangoliAcqua + resa.statistiche.triangoliErba + resa.statistiche.triangoliSpecchio, ombreMs: 0,
  storiaFps, storiaLivelli: [],
  scheda: nomeScheda(gl), software: /swiftshader|llvmpipe/i.test(nomeScheda(gl)),
  chunk: resa.statistiche.chunkTotali, blocchi: mondo.contaBlocchi, luci: 0, decorazioni: registro.istanze, erba: resa.statistiche.triangoliErba, ora: `${Math.floor(giorno.ora * 24)}h`, giorno: 0,
  worldgenMs: tCostruzione, meshMs: tCostruzione,
}), () => { resa.disegna(camera(), 0, modelli); modelli.disegna(resa, camera()); resa.disegnaAcqua(); return Promise.resolve(tela.toDataURL('image/webp', 0.6)); });

globalThis.PARTITA = { resa, modelli, mondo, passeggero, sguardo, corpi, streaming, registro, opz, lanciaCubi, intento, zoom: () => distanzaTerza, mirato: () => bersaglio, statistiche: () => ({ fps: 1000 / (q(tempi, 0.5) || 1), p50: q(tempi, 0.5), p99: q(tempi, 0.99), js: q(jsMs, 0.5), ...resa.statistiche, modelli: { ...modelli.statistiche }, streaming: { ...streaming.statistiche }, corpi: { ...corpi.statistiche }, fotogrammi }), diagnostica };

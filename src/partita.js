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
import { registraDecorazioni } from './world/decorazioni.js';
import { defDi, tipoBase } from './world/blocks.js';
import { paletteBlocco } from './world/stagioni.js';
import { Passeggero, tastiera } from './gioco/passeggero.js';
import { mira, PORTATA } from './gioco/mira.js';
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
import { registroResa, registroGiornoPartita, registroCorpi, registroStreaming, registroGiocatore } from './partita/registri.js';
import { impacchetta, spacchetta, contaModifiche } from './partita/salvataggio.js';

const params = new URLSearchParams(location.search);
const opz = {
  seme: +(params.get('seme') || 4242),
  erba: Math.max(0, Math.min(8, +(params.get('erba') ?? 8))),
  raggio: Math.max(48, Math.min(160, +(params.get('raggio') || 96))),
  ombra: params.get('ombra') !== 'no',
  specchio: params.get('specchio') === 'no' ? 0 : Math.max(0.2, Math.min(1, +(params.get('specchio') ?? 0.5) || 0.5)),
  dprMax: +(params.get('dpr') || 1.5),
  ora: params.has('ora') ? +params.get('ora') : null,
  corpi: +(params.get('corpi') || 0),
  terza: params.has('terza'),
};

const tela = document.getElementById('tela');
const { gl, dpr, ridimensiona } = creaContesto(tela, { antialias: true, dprMax: opz.dprMax });
const resa = new Resa(gl);
resa.ombra = opz.ombra;
resa.specchio.attivo = opz.specchio > 0; resa.specchio.scala = opz.specchio || 0.5;
const modelli = new Modelli(gl);
modelli.registra('cubo', modelloCubo());
// ⚠ IL GIOCATORE È IL GATTO BLU delle concept art (partita/arredi.js), non un
// cubo arancione; gli arredi (gatto arancione, funghi, scale, attrezzi) sono
// blocchi «modello» posabili dalla cassetta.
modelli.registra('omino', gatto(TAVOLOZZE.blu));
registraArredi();
for (const [id, a] of Object.entries(ARREDI)) modelli.registra(id, a.costruisci());

// ── il mondo, in streaming ───────────────────────────────────────────────────
registraDecorazioni();
const mondo = new Mondo();
const registro = new RegistroModelli();
mondo.onEvento = (e) => registro.evento(e);
const lavoro = params.get('worker') === 'no' ? null : creaLavoro();
const streaming = new Streaming(mondo, resa, (m, cx, cz) => generaChunkOpenWorld(m, cx, cz, opz.seme), { erba: opz.erba, raggioResa: opz.raggio, lavoro });
resa.apriFinestraAltezze(0.5, 0.5, 512);
// ⚠ IL SALVATAGGIO SI RIMETTE PRIMA DI GENERARE: sono le modifiche del
// giocatore (partita/salvataggio.js), e la frontiera le riapplica a ogni
// chunk che nasce. `?nuovo` riparte da zero.
const CHIAVE_SALVATAGGIO = `leafy-partita-${opz.seme}`;
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
    modelli.registra(nome, leggiModello(await r.arrayBuffer()));
    registro.sporchi.add(nome);
  } catch (e) { console.warn(`modello ${nome}: ${e.message}`); }
}
function aggiornaModelli() {
  for (const [nome, lista] of registro.cambiate()) {
    if (!modelli.tipi.has(nome)) { caricaModello(nome); registro.sporchi.add(nome); continue; }
    modelli.istanze(nome, lista);
  }
}

// ── chi cammina ──────────────────────────────────────────────────────────────
function cimaIn(x, z) { for (let y = 60; y > -60; y--) if (mondo.solido(x, y, z)) return y + 1; return 8; }
const passeggero = new Passeggero(mondo, { x: 0.5, y: cimaIn(0, 0) + 0.5, z: 0.5 });
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
  if (e.code === 'KeyV') cambiaTerza();
  if (e.code === 'KeyC') lanciaCubi(20);
  if (/^Digit[0-9]$/.test(e.code)) scegli(e.code === 'Digit0' ? 9 : +e.code.slice(5) - 1);
});
window.addEventListener('keyup', (e) => giu.delete(e.code));
window.addEventListener('blur', () => giu.clear());
window.addEventListener('wheel', (e) => scegli(scelto + Math.sign(e.deltaY)), { passive: true });
function impostaVolo(v) { volo = v; document.getElementById('volo').classList.toggle('acceso', volo); if (volo) passeggero.vy = 0; }
function impostaTerza(v) { terza = v; document.getElementById('terza').classList.toggle('acceso', terza); }
function cambiaVolo() { impostaVolo(!volo); }
function cambiaTerza() { impostaTerza(!terza); }
document.getElementById('volo').addEventListener('click', cambiaVolo);
document.getElementById('terza').addEventListener('click', cambiaTerza);
document.getElementById('cubi').addEventListener('click', () => lanciaCubi(20));
if (terza) document.getElementById('terza').classList.add('acceso');

/** Il passo del passeggero, a passo fisso come i corpi (60 Hz), o il volo. */
const PASSO = 1 / 60; let resto = 0;
function cammina(dt) {
  resto = Math.min(resto + dt, PASSO * 4);
  const av = sguardo.avantiPiano();
  while (resto >= PASSO) {
    resto -= PASSO;
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

/** L'occhio: in prima persona la testa, in terza sei blocchi dietro, tirato dentro se c'è un muro. */
function camera() {
  const v = sguardo.verso();
  const testa = [passeggero.x, passeggero.y + 0.8, passeggero.z];
  if (!terza) return { occhio: testa, centro: [testa[0] + v[0], testa[1] + v[1], testa[2] + v[2]], fov: 1.05, rapporto: tela.width / tela.height };
  let d = 6;
  for (let s = 0.5; s <= 6; s += 0.5) { if (mondo.solido(Math.floor(testa[0] - v[0] * s), Math.floor(testa[1] - v[1] * s), Math.floor(testa[2] - v[2] * s))) { d = Math.max(0.6, s - 0.6); break; } }
  const occhio = [testa[0] - v[0] * d, testa[1] - v[1] * d, testa[2] - v[2] * d];
  return { occhio, centro: testa, fov: 1.0, rapporto: tela.width / tela.height };
}

// ── la cassetta e il cantiere ────────────────────────────────────────────────
const barra = document.getElementById('barra');
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
  if (e.button === 2) posa();
  else if (e.pointerType === 'touch' && !comandi.demolisci) posa();
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
function sole(dt) {
  if (giorno.auto) giorno.ora = (giorno.ora + dt / giorno.durata) % 1;
  const ora = giorno.ora;
  const a = ora * Math.PI * 2 - Math.PI / 2;
  const alt = Math.max(0.24, Math.sin(a));
  const az = a * 0.5;
  resa.sole.verso = [-Math.cos(az) * Math.cos(Math.asin(alt)), -alt, -Math.sin(az) * Math.cos(Math.asin(alt))];
  // ⚠ NON si chiama «giorno»: quello è l'oggetto qui sopra, e un const omonimo
  // dentro la funzione lo oscurava PRIMA di nascere (TDZ) — pagina bianca.
  const luce = Math.max(0, Math.min(1, (Math.sin(a) + 0.1) * 2));
  resa.sole.forza = luce;
  resa.sole.colore = [1.0, 0.86 + 0.1 * luce, 0.66 + 0.2 * luce];
  resa.sole.cielo = [0.10 + 0.50 * luce, 0.12 + 0.56 * luce, 0.24 + 0.58 * luce];
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
  const cam = camera();
  // la mira, dall'occhio
  const v = sguardo.verso();
  bersaglio = mira(mondo, { x: cam.occhio[0], y: cam.occhio[1], z: cam.occhio[2] }, { x: v[0], y: v[1], z: v[2] }, PORTATA + (terza ? 6 : 0));
  if (tienePremuto && bersaglio) {
    const [x, y, z] = bersaglio.cella;
    scavo.premi(x + ',' + y + ',' + z, durataPer(defDi(mondo.tipo(x, y, z))), adesso);
    if (scavo.finito(adesso)) rompiMirato();
  } else if (!tienePremuto) scavo.molla();
  // i corpi e l'omino
  modelli.istanze('cubo', bufIstanze = corpi.istanze(bufIstanze), 8);
  // il gatto guarda dove guarda la camera, e cammina con un passetto
  const passo = (intento.avanti || intento.destra) && passeggero.aTerra ? Math.abs(Math.sin(adesso / 90)) * 0.06 : 0;
  if (terza) modelli.istanze('omino', [passeggero.x, passeggero.y + passo, passeggero.z, 1, 1, 1, 1, sguardo.alpha], 8); else modelli.istanze('omino', [], 8);
  resa.disegna(cam, dt, modelli);
  modelli.disegna(resa, cam);
  if (bersaglio) resa.evidenzia(bersaglio.cella[0], bersaglio.cella[1], bersaglio.cella[2], scavo.progresso(adesso));
  resa.disegnaAcqua();
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
    `PARTITA sul nucleo · seme ${opz.seme} · ${tela.width}×${tela.height} (dpr ${dpr.toFixed(2)})\n`
    + `disegni ${st.disegni + modelli.statistiche.disegni + st.disegniAcqua + st.disegniErba + st.disegniSpecchio} · triangoli ${(st.triangoli + modelli.statistiche.triangoli + st.triangoliAcqua + st.triangoliErba + st.triangoliSpecchio).toLocaleString('it')} · chunk ${st.chunkVisti}/${st.chunkTotali} (coda ${sm.inCoda}${lavoro ? `, in volo ${sm.inVolo} su ${lavoro.operai.length} worker` : ''}, ${sm.ultimaMs.toFixed(1)} ms) · corpi ${corpi.statistiche.corpi} (${corpi.statistiche.svegli} svegli)\n`
    + `x ${passeggero.x.toFixed(1)} y ${passeggero.y.toFixed(1)} z ${passeggero.z.toFixed(1)} · ${volo ? 'volo' : passeggero.aTerra ? 'a terra' : 'in aria'} · modifiche ${contaModifiche(mondo)}${salvate > 0 ? ` (${salvate} ricaricate)` : ''} · in mano: ${bottoni[scelto].textContent}${bersaglio ? ` · miri ${mondo.tipo(...bersaglio.cella)}` : ''}\n`
    + `WASD/joystick cammina · trascina guarda · doppio clic/L cattura il mouse · sinistro tieni = scava · destro/tocco = posa · ⛏ col dito scava · F vola · V terza · C cubi · 1-9 cassetta`;
}
requestAnimationFrame(giro);

// ── l'Officina: `?officina` o il tasto 🛠, caricata solo se la si chiede ────
let officina = null, passoOfficina = null;
async function apriOfficinaPartita() {
  if (officina) { officina.pannello.apri(true); return; }
  const { apriOfficina } = await import('./officina/index.js');
  const statoGiocatore = {
    get volo() { return volo; }, get terza() { return terza; }, impostaVolo, impostaTerza,
    dove: () => `x ${passeggero.x.toFixed(1)} y ${passeggero.y.toFixed(1)} z ${passeggero.z.toFixed(1)}`,
    aCasa: () => { passeggero.x = 0.5; passeggero.z = 0.5; passeggero.y = cimaIn(0, 0) + 0.5; passeggero.vy = 0; },
    modifiche: () => contaModifiche(mondo),
    nuovo: () => { try { localStorage.removeItem(CHIAVE_SALVATAGGIO); } catch { /* niente */ } location.search = `?seme=${opz.seme}&nuovo`; },
  };
  officina = apriOfficina({
    registri: [registroGiornoPartita(giorno), registroResa(resa), registroCorpi(corpi, lanciaCubi), registroStreaming(streaming), registroGiocatore(statoGiocatore)],
    campione: () => ({ disegni: resa.statistiche.disegni + modelli.statistiche.disegni + resa.statistiche.disegniAcqua + resa.statistiche.disegniErba + resa.statistiche.disegniSpecchio, rtMs: null }),
    autore: 'partita', titolo: 'Officina · partita', apertoSubito: true,
    agganciaFrame: (fn) => (passoOfficina = fn),
  });
}
document.getElementById('officina').addEventListener('click', apriOfficinaPartita);
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

globalThis.PARTITA = { resa, modelli, mondo, passeggero, sguardo, corpi, streaming, registro, opz, lanciaCubi, statistiche: () => ({ fps: 1000 / (q(tempi, 0.5) || 1), p50: q(tempi, 0.5), p99: q(tempi, 0.99), js: q(jsMs, 0.5), ...resa.statistiche, modelli: { ...modelli.statistiche }, streaming: { ...streaming.statistiche }, corpi: { ...corpi.statistiche }, fotogrammi }), diagnostica };

// IL BANCO DEL NUCLEO — fase F0 della rifondazione (docs/RIFONDAZIONE.md §4).
//
// Cento chunk di terreno finto nel formato nuovo, un disegno per chunk, luce
// cotta, erba nel mesh, horizon mapping per l'ombra del sole. Niente Babylon.
// La porta della fase: sul Mali-G68 a ULTRA ≥ 90 fps con ~300k triangoli,
// ≤ 60 disegni, JS sotto i 2 ms. Il 🩺 manda i numeri.
import { creaContesto, nomeScheda } from './nucleo/gl.js';
import { Resa } from './nucleo/resa.js';
import { costruisciChunkFinto, altezza, TAVOLOZZA } from './nucleo/terreno-finto.js';
import { Diagnostica } from './ui/diagnostica.js';

const tela = document.getElementById('tela');
const stato = document.getElementById('stato');
const fpsBox = document.getElementById('fps');
const params = new URLSearchParams(location.search);
const opz = {
  raggio: +(params.get('raggio') || 5),     // chunk per lato attorno all'origine (5 → 10×10)
  erba: +(params.get('erba') ?? 2),
  ombra: params.get('ombra') !== 'no',
  dprMax: +(params.get('dpr') || 1.5),
  // ⚠ LA RAMPA: la porta di F0 si trova SALENDO finché il vsync cede. Il primo
  // rapporto dal Mali (89 fps piatti, 52k triangoli in vista, 23 disegni) era
  // incollato al pannello: non dice quanto margine c'è. La rampa aumenta la
  // scena a gradini di sei secondi e il 🩺 porta la tabella.
  rampa: params.has('rampa'),
  tutto: params.has('tutto'),        // niente frustum: si disegnano TUTTI i chunk
};

const { gl, dpr, ridimensiona } = creaContesto(tela, { antialias: true, dprMax: opz.dprMax });
const resa = new Resa(gl);
resa.impostaTavolozza(TAVOLOZZA);
resa.ombra = opz.ombra;

// ── il mondo finto ──────────────────────────────────────────────────────────
let blocchi = 0, tCostruzione = 0;
function costruisciMondo(raggio, erba) {
  const t0 = performance.now();
  for (const kc of [...resa.chunks.keys()]) resa.rimuovi(kc);
  blocchi = 0;
  for (let cx = -raggio; cx < raggio; cx++) {
    for (let cz = -raggio; cz < raggio; cz++) {
      resa.carica(cx + ',' + cz, costruisciChunkFinto(cx, cz, { erba }));
      blocchi += 256;
    }
  }
  const lato = raggio * 2 * 16;
  const alt = new Uint8Array(lato * lato);
  for (let z = 0; z < lato; z++) for (let x = 0; x < lato; x++) alt[z * lato + x] = altezza(x - raggio * 16, z - raggio * 16) + 1;
  resa.impostaAltezze(alt, -raggio * 16, -raggio * 16, lato, lato);
  tCostruzione = performance.now() - t0;
}
costruisciMondo(opz.raggio, opz.erba);
resa.tutto = opz.tutto;

// ── la camera: orbita, come nel gioco ───────────────────────────────────────
const cam = { alpha: -0.8, beta: 1.05, raggio: 46, centro: [0, altezza(0, 0) + 2, 0], fov: 0.9 };
function occhio() {
  const sb = Math.sin(cam.beta), cb = Math.cos(cam.beta);
  return [cam.centro[0] + cam.raggio * sb * Math.cos(cam.alpha), cam.centro[1] + cam.raggio * cb, cam.centro[2] + cam.raggio * sb * Math.sin(cam.alpha)];
}
let trascino = null, pizzico = 0;
tela.addEventListener('pointerdown', (e) => { trascino = { x: e.clientX, y: e.clientY }; tela.setPointerCapture(e.pointerId); });
tela.addEventListener('pointermove', (e) => {
  if (!trascino) return;
  cam.alpha += (e.clientX - trascino.x) * 0.006; cam.beta = Math.max(0.15, Math.min(1.5, cam.beta - (e.clientY - trascino.y) * 0.006));
  trascino = { x: e.clientX, y: e.clientY };
});
tela.addEventListener('pointerup', () => { trascino = null; });
tela.addEventListener('wheel', (e) => { cam.raggio = Math.max(8, Math.min(140, cam.raggio * (e.deltaY > 0 ? 1.1 : 0.9))); e.preventDefault(); }, { passive: false });
tela.addEventListener('touchstart', (e) => { if (e.touches.length === 2) pizzico = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY); }, { passive: true });
tela.addEventListener('touchmove', (e) => {
  if (e.touches.length !== 2) return;
  const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
  if (pizzico > 0) cam.raggio = Math.max(8, Math.min(140, cam.raggio * pizzico / d));
  pizzico = d;
}, { passive: true });

// ── la giornata: il sole gira da solo, come in gioco (giorno di 5 minuti) ───
let ora = 0.35;
function sole(dt) {
  ora = (ora + dt / 300) % 1;
  const a = ora * Math.PI * 2 - Math.PI / 2;
  const alt = Math.max(0.24, Math.sin(a));     // il pavimento a 14°, come giorno.js
  const az = a * 0.5;
  resa.sole.verso = [-Math.cos(az) * Math.cos(Math.asin(alt)), -alt, -Math.sin(az) * Math.cos(Math.asin(alt))];
  const giorno = Math.max(0, Math.min(1, (Math.sin(a) + 0.1) * 2));
  resa.sole.forza = giorno;
  resa.sole.colore = [1.0, 0.86 + 0.1 * giorno, 0.66 + 0.2 * giorno];
  resa.nebbia.colore = [0.25 + 0.47 * giorno, 0.35 + 0.5 * giorno, 0.5 + 0.42 * giorno];
  gl.clearColor(resa.nebbia.colore[0], resa.nebbia.colore[1], resa.nebbia.colore[2], 1);
}

// ── il giro ─────────────────────────────────────────────────────────────────
const tempi = [], jsMs = [];
const storiaFps = [];
let ultimo = performance.now(), fotogrammi = 0, ultimaStampa = 0;
function giro(adesso) {
  const dt = Math.min(0.1, (adesso - ultimo) / 1000); ultimo = adesso;
  const tj = performance.now();
  if (ridimensiona()) { /* la viewport è già messa */ }
  sole(dt);
  const oc = occhio();
  resa.disegna({ occhio: oc, centro: cam.centro, fov: cam.fov, rapporto: tela.width / tela.height }, dt);
  const js = performance.now() - tj;
  tempi.push(dt * 1000); if (tempi.length > 240) tempi.shift();
  jsMs.push(js); if (jsMs.length > 240) jsMs.shift();
  fotogrammi++;
  if (adesso - ultimaStampa > 500) { ultimaStampa = adesso; stampa(); }
  if (opz.rampa) rampa(adesso);
  requestAnimationFrame(giro);
}

// ── la rampa: gradini di scena, sei secondi l'uno, la tabella va nel 🩺 ─────
const GRADINI_RAMPA = [
  { raggio: 5, erba: 2, tutto: false }, { raggio: 6, erba: 3, tutto: false }, { raggio: 7, erba: 4, tutto: false },
  { raggio: 6, erba: 3, tutto: true }, { raggio: 8, erba: 4, tutto: true },
];
const esitiRampa = [];
let gradinoRampa = -1, inizioGradino = 0;
function rampa(adesso) {
  if (gradinoRampa >= 0 && adesso - inizioGradino < 6000) return;
  if (gradinoRampa >= 0) {
    // si scartano i primi due secondi (il caricamento in GPU) leggendo solo la coda
    const coda = tempi.slice(-Math.min(tempi.length, 200));
    const g = GRADINI_RAMPA[gradinoRampa];
    esitiRampa.push({ ...g, fps: +(1000 / (q(coda, 0.5) || 1)).toFixed(0), p50: +q(coda, 0.5).toFixed(1), p99: +q(coda, 0.99).toFixed(1),
      js: +q(jsMs, 0.5).toFixed(2), disegni: resa.statistiche.disegni, triangoli: resa.statistiche.triangoli });
  }
  gradinoRampa++;
  if (gradinoRampa >= GRADINI_RAMPA.length) { opz.rampa = false; stampa(); return; }
  const g = GRADINI_RAMPA[gradinoRampa];
  costruisciMondo(g.raggio, g.erba); resa.tutto = g.tutto; opz.erba = g.erba; opz.raggio = g.raggio;
  tempi.length = 0; jsMs.length = 0;
  inizioGradino = adesso;
}
const q = (arr, p) => { if (!arr.length) return 0; const s = arr.slice().sort((a, b) => a - b); return s[Math.min(s.length - 1, Math.floor(s.length * p))]; };
function stampa() {
  const p50 = q(tempi, 0.5), p99 = q(tempi, 0.99), fps = p50 ? 1000 / p50 : 0;
  storiaFps.push(Math.round(fps)); if (storiaFps.length > 120) storiaFps.shift();
  const st = resa.statistiche;
  fpsBox.textContent = `${fps.toFixed(0)} fps\n${p50.toFixed(1)} / ${p99.toFixed(1)} ms\nJS ${q(jsMs, 0.5).toFixed(2)} ms`;
  stato.textContent = `NUCLEO F0 · ${tela.width}×${tela.height} (dpr ${dpr.toFixed(2)})\n`
    + `disegni ${st.disegni}  triangoli ${st.triangoli.toLocaleString('it')}  chunk ${st.chunkVisti}/${st.chunkTotali}\n`
    + `ombra del sole: ${resa.ombra ? 'horizon mapping' : 'spenta'} · erba ${opz.erba} · costruzione ${tCostruzione.toFixed(0)} ms\n`
    + `${nomeScheda(gl)}\n`
    + `?raggio=${opz.raggio} ?erba=${opz.erba} ?ombra=${opz.ombra ? 'sì' : 'no'} ?dpr=${opz.dprMax} ?rampa ?tutto  ·  tocca lo schermo per girare`
    + (esitiRampa.length ? '\nRAMPA  fps  p50   p99   dis  triangoli\n' + esitiRampa.map((e) => `r${e.raggio} e${e.erba}${e.tutto ? ' tutto' : ''}  ${String(e.fps).padStart(3)}  ${String(e.p50).padStart(5)}  ${String(e.p99).padStart(5)}  ${String(e.disegni).padStart(3)}  ${e.triangoli.toLocaleString('it')}`).join('\n') : '')
    + (opz.rampa ? `\nrampa: gradino ${gradinoRampa + 1}/${GRADINI_RAMPA.length}…` : '');
}
requestAnimationFrame(giro);

// ── il 🩺, lo stesso del gioco ──────────────────────────────────────────────
const diagnostica = new Diagnostica(() => ({
  versione: (document.getElementById('versione') || {}).textContent || 'nucleo in sviluppo',
  mobile: matchMedia('(pointer: coarse)').matches, tocco: navigator.maxTouchPoints > 0, modoGui: 'nucleo',
  ua: navigator.userAgent, cpu: navigator.hardwareConcurrency || null, memoriaGB: navigator.deviceMemory || null,
  css: [tela.clientWidth, tela.clientHeight], reso: [tela.width, tela.height], dpr: devicePixelRatio,
  livello: 0, quantiLivelli: 1, manuale: true,
  profilo: { banco: 'nucleo F0', raggio: opz.raggio, erba: opz.erba, ombra: resa.ombra, tutto: !!resa.tutto, dprMax: opz.dprMax, jsMs: +q(jsMs, 0.5).toFixed(2), jsP99: +q(jsMs, 0.99).toFixed(2), rampa: esitiRampa },
  ombreLampade: false, antialias: true,
  fps: q(tempi, 0.5) ? 1000 / q(tempi, 0.5) : null, p50: q(tempi, 0.5), p99: q(tempi, 0.99),
  disegni: resa.statistiche.disegni, triangoli: resa.statistiche.triangoli, ombreMs: 0,
  storiaFps, storiaLivelli: [],
  scheda: nomeScheda(gl), software: /swiftshader|llvmpipe/i.test(nomeScheda(gl)),
  chunk: resa.statistiche.chunkTotali, blocchi, luci: 0, decorazioni: 0, erba: 0, ora: `${Math.floor(ora * 24)}h`, giorno: 0,
  worldgenMs: tCostruzione, meshMs: tCostruzione,
}), () => { const oc = occhio(); resa.disegna({ occhio: oc, centro: cam.centro, fov: cam.fov, rapporto: tela.width / tela.height }, 0); return Promise.resolve(tela.toDataURL('image/webp', 0.6)); });

globalThis.NUCLEO = { resa, cam, opz, statistiche: () => ({ fps: 1000 / (q(tempi, 0.5) || 1), p50: q(tempi, 0.5), p99: q(tempi, 0.99), js: q(jsMs, 0.5), ...resa.statistiche, costruzioneMs: tCostruzione, fotogrammi }), diagnostica };

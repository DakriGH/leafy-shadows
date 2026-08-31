// LA REGIA DELLO ZOO — un ingresso a parte, non una modalità del gioco.
//
// ⚠ È UNA PAGINA SUA (`zoo.html`) E NON UN INTERRUTTORE DENTRO IL GIOCO. Un
// banco di prova nascosto dentro il gioco finisce per condizionare il gioco:
// una manopola in più da ricordarsi, un ramo in più da mantenere, e prima o poi
// qualcuno lo pubblica acceso. Qui il gioco non sa nemmeno che lo zoo esiste;
// lo zoo importa gli stessi moduli e li mette in una scena fatta per guardarli.

import { Rig } from './motore/motore.js';
import { Fabbrica } from './motore/fabbrica.js';
import { STILI } from './motore/acqua.js';
import { Giorno } from './motore/giorno.js';
import { Modelli } from './motore/modelli.js';
import { Particelle } from './motore/particelle.js';
import { ScalaQualita, misuraHz } from './motore/qualita.js';
import { Mondo } from './world/world.js';
import { Mesher, collegaFabbrica as fabbricaMesher } from './world/mesher.js';
import { collegaFabbrica as fabbricaStagioni } from './world/stagioni.js';
import { Erba, collegaFabbrica as fabbricaErba } from './vegetazione/erba.js';
import { generaZoo, PIAZZOLE, centroDi, SUOLO, PASSO } from './world/zoo.js';

const tela = document.getElementById('tela');
const stato = document.getElementById('stato');
const spia = document.getElementById('fps');

const rig = new Rig(tela);
const fabbrica = new Fabbrica(rig);
fabbricaMesher(fabbrica);
fabbricaStagioni(fabbrica);
fabbricaErba(fabbrica);

const mondo = new Mondo();
const mesher = new Mesher(rig.scena, mondo);
generaZoo(mondo);
mesher.ricostruisciTutto(mondo);

const erba = new Erba(rig.scena, {
  max: rig.dispositivo.mobile ? 120000 : 300000,
  densita: rig.profilo.erba, raggioChunk: rig.profilo.erbaR,
});
const giorno = new Giorno(rig, { durata: 240, ora: 0.42 });
const modelli = new Modelli(rig.scena, rig, fabbrica);
const particelle = new Particelle(rig.scena, rig);

// ⚠ E STA QUI, DOPO le particelle: l'`applica` le nomina, e in JS una const
// non esiste prima della sua riga — chiamarla sopra dà un errore di zona morta.
// ⚠ NELLO ZOO LA SCALA PARTE A MANO, ferma sul gradino migliore: qui si guarda,
// non si gioca, e una scala che si muove da sola cambierebbe la scena sotto gli
// occhi mentre si sta confrontando due scatti. K la fa scendere di un gradino.
const scala = new ScalaQualita({
  mobile: rig.dispositivo.mobile,
  applica: (p) => rig.applicaProfilo(p, { erba, particelle, fabbrica }),
});
scala.fissa(0);
// ⚠ E QUANTO VA LO SCHERMO SI MISURA, non si chiede: `screen.refreshRate` non
// esiste in Chrome e tornava `undefined`. Arriva dopo una quarantina di
// fotogrammi, che è comunque prima che la scala possa decidere qualcosa.
misuraHz().then((hz) => scala.impostaHz(hz));

// ---- le luci delle piazzole -------------------------------------------------
// ⚠ SI ACCENDONO DA UNA TABELLA, e le mobili si ricordano da sole dove stavano:
// il moto è una funzione del tempo, non uno stato da aggiornare. Così la scena
// è la stessa a ogni ricarica e due scatti si possono confrontare.
const mobili = [];
for (const p of PIAZZOLE) {
  for (const l of p.luci || []) {
    const x = p.x * PASSO + l.x, z = p.z * PASSO + l.z, y = SUOLO + (l.y || 3);
    // ⚠ TUTTI I CAMPI PASSANO DI QUI, e la piazzola non sa che esistano le
    // uniform: dichiara «ombra: false» o «semiLati: [3,0,0]» e il motore fa.
    const i = rig.luci.accendi({ x, y, z, raggio: l.raggio, colore: l.colore, forza: l.forza,
      ombra: l.ombra !== false, semiLati: l.semiLati });
    if (l.gira) mobili.push({ i, cx: x, cz: z, y, raggio: l.gira });
  }
}

// ---- i modelli delle piazzole ----------------------------------------------
const perModello = new Map();
for (const p of PIAZZOLE) {
  for (const mo of p.modelli || []) {
    if (!perModello.has(mo.nome)) perModello.set(mo.nome, []);
    perModello.get(mo.nome).push({ x: p.x * PASSO + mo.x + 0.5, y: SUOLO + 1, z: p.z * PASSO + mo.z + 0.5, giro: 0, luce: mo.luce });
  }
}

// ---- le particelle delle piazzole -------------------------------------------
for (const p of PIAZZOLE) {
  for (const pa of p.particelle || []) {
    particelle.accendi(pa.nome, { x: p.x * PASSO + pa.x, y: SUOLO + pa.y, z: p.z * PASSO + pa.z });
  }
}
for (const [nome, dove] of perModello) {
  modelli.carica(nome).then(() => {
    modelli.piazza(nome, dove);
    for (const d of dove) if (d.luce) rig.luci.accendi({ x: d.x, y: d.y + 2.6, z: d.z, raggio: 14 });
  }).catch((e) => { console.error(nome + ':', e); });
}

// ---- muoversi fra le piazzole ----------------------------------------------
let quale = 0;
const centro = { x: 0, y: 0, z: 0 };
function vaiA(i) {
  quale = ((i % PIAZZOLE.length) + PIAZZOLE.length) % PIAZZOLE.length;
  const c = centroDi(PIAZZOLE[quale]);
  centro.x = c.x; centro.y = c.y; centro.z = c.z;
  rig.camera.setTarget(new rig.camera.target.constructor(c.x, c.y + 1, c.z));
  rig.camera.radius = 26;
  rig.camera.beta = 1.05;
}
vaiA(0);

// ⚠ I COMANDI SONO POCHI E DETTI A SCHERMO. Un banco di prova con dieci scorciatoie
// da ricordare è un banco che non si usa.
addEventListener('keydown', (e) => {
  if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
  if (e.code === 'ArrowRight' || e.code === 'KeyE') vaiA(quale + 1);
  else if (e.code === 'ArrowLeft' || e.code === 'KeyQ') vaiA(quale - 1);
  else if (e.code === 'Space') { giorno.auto = !giorno.auto; e.preventDefault(); }
  else if (e.code === 'ArrowUp') { giorno.auto = false; giorno.t = (giorno.t + 0.01) % 1; giorno.applica(); }
  else if (e.code === 'ArrowDown') { giorno.auto = false; giorno.t = (giorno.t + 0.99) % 1; giorno.applica(); }
  else if (e.code === 'KeyG') erba.imposta(!erba.attiva);
  else if (e.code === 'KeyL') { const on = rig.luci.pos[3] > 0 || rig.luci.quante === 0; scambiaLuci(!on); }
  else if (e.code === 'KeyO') rig.sole.shadowEnabled = !rig.sole.shadowEnabled;
  // ⚠ V STACCA LA GRIGLIA DEI MURI, che è il modo di VEDERE cosa fa: le stesse
  // lampade, la stessa scena, e l'unica differenza a schermo è il cammino.
  // Senza un interruttore così, «funziona» resta un'opinione.
  else if (e.code === 'KeyV') rig.voxel.attiva = !rig.voxel.attiva;
  else if (e.code === 'KeyN') particelle.mostra(!particelle.accese);
  else if (e.code === 'KeyK') scala.fissa((scala.livello + 1) % scala.quanti);
  // ⚠ GLI STILI DELL'ACQUA SI CICLANO A CALDO, e serve: fermi non si giudicano.
  // Metà di quello che distingue un disegno dall'altro è COME SI MUOVE — un
  // tratteggio che scorre e una rete che respira, da fermi, sono due immagini
  // che si somigliano.
  else if (e.code === 'KeyH') stileAcqua = fabbrica.cambiaStileAcqua(NOMI_STILE[(NOMI_STILE.indexOf(stileAcqua) + 1) % NOMI_STILE.length]);
});
let raggiSalvati = null;
function scambiaLuci(accese) {
  if (!accese) { raggiSalvati = rig.luci.pos.slice(); for (let i = 0; i < rig.luci.quante; i++) rig.luci.pos[i * 4 + 3] = 0; }
  else if (raggiSalvati) rig.luci.pos.set(raggiSalvati);
}

// ---- il contatore -----------------------------------------------------------
const finestra = [];
let ultimo = performance.now();

/** Il tempo dell'acqua: si accumula qui perché il motore passa solo il DELTA. */
let tAcqua = 0;
/** Gli stili del pelo, per il tasto H. L'elenco lo dà il motore. */
const NOMI_STILE = Object.keys(STILI);
let stileAcqua = NOMI_STILE[NOMI_STILE.length - 1];

rig.avvia((dt) => {
  giorno.aggiorna(dt);
  // ⚠ IL DISEGNO DELL'ACQUA SCORRE A TEMPO, NON A FOTOGRAMMI: a 144 Hz e a 30
  // la corrente deve andare alla stessa velocità, se no su un telefono lento il
  // ruscello rallenta insieme agli fps e si legge come un difetto della fisica.
  // È lo stesso inciampo della scia della schiuma in Lantern, che svaniva in un
  // quarto di secondo a 120 fps e in un secondo a 30.
  tAcqua += dt;
  fabbrica.animaAcqua(tAcqua);
  // le lampade in moto: una funzione del tempo, niente stato
  for (const mo of mobili) {
    const a = giorno.t * Math.PI * 40;
    rig.luci.pos[mo.i * 4] = mo.cx + Math.cos(a) * mo.raggio;
    rig.luci.pos[mo.i * 4 + 2] = mo.cz + Math.sin(a) * mo.raggio;
  }
  // l'erba si semina attorno al centro della piazzola che si sta guardando
  erba.aggiorna(dt, mondo, centro, null, rig.camera.position);
  // ⚠ E LE PARTICELLE DELLE ALTRE PIAZZOLE SI SPENGONO, con una portata più
  // corta di quella del gioco: qui le piazzole distano cinquanta celle, e con i
  // novanta di fabbrica una nevicata si vedeva da due stanze più in là. Nel
  // gioco novanta è giusto (è dentro la nebbia); qui il metro è il PASSO.
  particelle.aggiorna(rig.camera, PASSO * 0.7);

  const ora = performance.now();
  finestra.push(ora - ultimo); ultimo = ora;
  if (finestra.length > 240) finestra.shift();
  if (finestra.length < 30 || finestra.length % 15) return;
  const s = finestra.slice().sort((a, b) => a - b);
  const p = (q) => s[Math.floor(s.length * q)].toFixed(1);
  spia.textContent = `${Math.round(1000 / s[s.length >> 1])} fps\n${p(0.5)} / ${p(0.99)} ms`;
  const pz = PIAZZOLE[quale];
  stato.textContent =
    `ZOO — ${quale + 1}/${PIAZZOLE.length}  ${pz.nome}\n` +
    `${pz.nota}\n\n` +
    `${giorno.orologio}${giorno.auto ? '' : ' (fermo)'}   erba ${(erba.attiva ? erba.fili : 0).toLocaleString('it')}   ` +
    `luci ${rig.luci.accese}   particelle ${particelle.vive}${particelle.suGPU ? ' (GPU)' : ''}\n` +
    `griglia muri ${rig.voxel.attiva ? `${rig.voxel.larghezza}×${rig.voxel.altezza}×${rig.voxel.profondita}` : 'staccata'}   ` +
    `${rig.dispositivo.mobile ? 'MOBILE' : 'desktop'} q${scala.livello}/${scala.quanti - 1}   ` +
    `${rig.motore.getRenderWidth()}×${rig.motore.getRenderHeight()}\n` +
    `← → piazzola   ↑ ↓ ora   spazio ciclo   G erba   L luci   O ombre del sole\n` +
    `V ombre delle lampade   N particelle   K qualità   I ispettore\n` +
    `H stile dell'acqua: ${stileAcqua}  (${NOMI_STILE.join(' · ')})`;
});

globalThis.ZOO = { rig, fabbrica, mondo, mesher, erba, giorno, modelli, particelle, scala, PIAZZOLE, vaiA };

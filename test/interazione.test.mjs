// MIRARE A COSE CHE NON SONO BLOCCHI, e la mano vuota.
//
// ⚠ Il difetto che ha generato tutto questo: un lampione è un modello piantato
// in aria, la griglia sotto è VUOTA, e il cammino ci passava attraverso —
// cliccarlo era impossibile. Il committente: «manca il modo di interagire con i
// lampioni».
import test from 'node:test';
import assert from 'node:assert/strict';
import { miraCompleta, incrociaScatola, PORTATA } from '../src/gioco/mira.js';
import { Decoro } from '../src/gioco/decoro.js';
import { registraDecorazioni, DECORAZIONI } from '../src/world/decorazioni.js';
import { azione, Cantiere, CASSETTA } from '../src/gioco/cantiere.js';
import { Luci } from '../src/motore/luci.js';
import { Mondo } from '../src/world/world.js';

// ⚠ VANNO REGISTRATE PRIMA DI POSARLE, come nel gioco: sono blocchi veri, e un
// tipo sconosciuto darebbe un difetto lontano da dove sta la causa.
registraDecorazioni();

const vers = (x, y, z) => { const n = Math.hypot(x, y, z); return { x: x / n, y: y / n, z: z / n }; };
function piano(quota = 6, raggio = 12) {
  const m = new Mondo();
  for (let x = -raggio; x <= raggio; x++) for (let z = -raggio; z <= raggio; z++) m.metti(x, quota, z, 'terra', true);
  return m;
}

test('il raggio incrocia una scatola davanti a sé', () => {
  const d = incrociaScatola({ x: 0, y: 0, z: 0 }, vers(1, 0, 0),
    { x: 4, y: -1, z: -1 }, { x: 5, y: 1, z: 1 }, 20);
  assert.ok(Math.abs(d - 4) < 1e-6);
});

test('e non quella che si ha dietro', () => {
  // ⚠ IL CASO CHE SBAGLIA IN SILENZIO: con gli intervalli non ordinati, una
  // scatola alle spalle dà una distanza NEGATIVA che sembra «vicinissima».
  const d = incrociaScatola({ x: 0, y: 0, z: 0 }, vers(1, 0, 0),
    { x: -5, y: -1, z: -1 }, { x: -4, y: 1, z: 1 }, 20);
  assert.equal(d, -1);
});

test('un raggio parallelo alla lastra non divide per zero', () => {
  // dentro sull'asse y, parallelo: deve incrociare
  assert.ok(incrociaScatola({ x: 0, y: 0, z: 0 }, vers(1, 0, 0),
    { x: 4, y: -1, z: -1 }, { x: 5, y: 1, z: 1 }, 20) >= 0);
  // fuori sull'asse y, parallelo: non deve
  assert.equal(incrociaScatola({ x: 0, y: 9, z: 0 }, vers(1, 0, 0),
    { x: 4, y: -1, z: -1 }, { x: 5, y: 1, z: 1 }, 20), -1);
});

test('si mira al lampione, non al terreno sotto di lui', () => {
  const m = piano(6);
  m.metti(3, 7, 0, 'lampione', true);
  const d = new Decoro(); d.scansiona(m);
  const r = miraCompleta(m, { x: 0.5, y: 8.5, z: 0.5 }, vers(1, 0, 0), d.scatole(), 20);
  assert.ok(r.dato, 'doveva colpire il lampione, non un blocco: ' + JSON.stringify(r));
  assert.deepEqual(r.dato.cella, [3, 7, 0]);
});

test('ma non attraverso un muro', () => {
  // ⚠ LA PROVA CHE VALE: guardando solo «c'è una scatola sul raggio?» si
  // accenderebbe un lampione attraverso la roccia.
  const m = piano(6);
  for (let y = 7; y < 12; y++) m.metti(2, y, 0, 'pietra', true);
  m.metti(5, 7, 0, 'lampione', true);
  const d = new Decoro(); d.scansiona(m);
  const r = miraCompleta(m, { x: 0.5, y: 8.5, z: 0.5 }, vers(1, 0, 0), d.scatole(), 20);
  assert.ok(!r.dato, 'il muro deve vincere');
  assert.deepEqual(r.cella, [2, 8, 0]);
});

test('senza scatole si comporta come la mira di sempre', () => {
  const m = piano(6);
  const a = miraCompleta(m, { x: 0.5, y: 12, z: 0.5 }, vers(0, -1, 0), [], 20);
  assert.deepEqual(a.cella, [0, 6, 0]);
  assert.deepEqual(a.faccia, [0, 1, 0]);
});

test("l'azione dipende da cosa si ha in mano, non da quale tasto", () => {
  assert.equal(azione(null, null), 'rompi', 'mano vuota: si rompe');
  assert.equal(azione('pietra', null), 'posa', 'con un blocco: si posa');
  // ⚠ UN LAMPIONE VINCE SEMPRE, anche con un blocco in mano: se no per
  // accendere una luce bisognerebbe prima svuotarsi le mani.
  assert.equal(azione(null, {}), 'interagisci');
  assert.equal(azione('pietra', {}), 'interagisci');
});

test('la mano vuota è il primo posto della cassetta, e non posa niente', () => {
  assert.equal(CASSETTA[0], null);
  const c = new Cantiere(piano(6), new Luci());
  c.scegli(0);
  assert.equal(c.manoVuota, true);
  assert.equal(c.nomeScelto, 'mano vuota');
  assert.equal(c.posa(0, 8, 0), false, 'con la mano vuota non deve comparire niente');
});

test('i lampioni seguono la notte, e l\'interruttore vale fino al cambio', () => {
  const m = piano(6);
  m.metti(0, 7, 0, 'lampione', true);
  m.metti(9, 7, 0, 'lampione', true);
  const d = new Decoro(); d.scansiona(m);
  assert.equal(d.quanti, 2);
  assert.equal(d.accesi, 0);
  d.aggiornaNotte(true);
  assert.equal(d.accesi, 2, 'di notte si accendono da soli');
  const a = d.per.get('0,7,0');
  d.alterna(a);
  assert.equal(a.acceso, false);
  assert.equal(d.accesi, 1, 'e uno si può spegnere a mano');
  assert.equal(d.aggiornaNotte(true), false, 'la stessa notte non rifà niente');
  assert.equal(d.accesi, 1, 'e non riaccende quello spento a mano');
  d.aggiornaNotte(false);
  assert.equal(d.accesi, 0);
  assert.equal(a.aMano, false, 'col giorno il «a mano» si azzera');
});

test('una decorazione rotta sparisce dal registro, senza dirglielo', () => {
  // ⚠ È LA RIGA CHE TIENE IN PIEDI TUTTO: il registro si nutre degli EVENTI del
  // mondo, quindi rompere un albero non richiede che qualcuno si ricordi di
  // avvisarlo. È lo stesso meccanismo con cui in Lantern un blocco-lampada
  // accende la sua luce.
  const m = piano(6);
  const d = new Decoro();
  m.onEvento = (e) => d.evento(e);
  m.metti(2, 7, 0, 'albero');
  assert.equal(d.quanti, 1);
  const v0 = d.versione;
  m.togli(2, 7, 0);
  assert.equal(d.quanti, 0, 'rompendolo deve sparire');
  assert.ok(d.versione > v0, 'e la versione deve salire, se no nessuno ridisegna');
  // un blocco normale non lo tocca
  m.metti(3, 7, 0, 'pietra');
  assert.equal(d.quanti, 0);
});

test('un albero non si accende, un lampione sì', () => {
  const m = piano(6);
  m.metti(0, 7, 0, 'albero', true);
  m.metti(4, 7, 0, 'lampione', true);
  const d = new Decoro(); d.scansiona(m);
  assert.equal(d.interattivo(d.per.get('0,7,0')), false);
  assert.equal(d.interattivo(d.per.get('4,7,0')), true);
  assert.equal(d.alterna(d.per.get('0,7,0')), false, 'alternare un albero non fa niente');
});

test('le decorazioni sono blocchi, quindi stanno nella cassetta', () => {
  assert.ok(CASSETTA.includes('albero'));
  assert.ok(CASSETTA.includes('lampione'));
});

test('mirando a una decorazione si posa DAVANTI a lei, non dietro', () => {
  // ⚠ IL DIFETTO CHE IL COMMITTENTE HA VISTO IN DUE MODI, ed erano lo stesso:
  // «non riesco a piazzare i ciuffi» (dall'alto la cella usciva dentro il
  // ciuffo stesso, occupata) e «mi piazza un blocco in diagonale» (di sbieco il
  // raggio attraversava il ciuffo e colpiva il terreno più in là).
  const m = piano(6);
  m.metti(3, 7, 0, 'ciuffo', true);
  const d = new Decoro(); d.scansiona(m);

  // dall'alto, in verticale: si deve posare SOPRA il ciuffo
  const alto = miraCompleta(m, { x: 3.5, y: 12, z: 0.5 }, vers(0, -1, 0), d.scatole(), 20);
  assert.ok(alto.dato, 'deve colpire il ciuffo');
  assert.equal(m.pieno(...alto.prima), false, 'la cella di posa dev\'essere VUOTA');
  assert.deepEqual(alto.prima, [3, 8, 0], 'e sta sopra il ciuffo, non dentro');

  // di sbieco: la cella di posa deve toccare il ciuffo, non stargli lontano
  const sbieco = miraCompleta(m, { x: 0.5, y: 8.5, z: 0.5 }, vers(1, -0.2, 0), d.scatole(), 20);
  assert.ok(sbieco.dato, 'deve colpire il ciuffo anche di sbieco');
  const c = sbieco.dato.cella, pr = sbieco.prima;
  const dist = Math.abs(pr[0] - c[0]) + Math.abs(pr[1] - c[1]) + Math.abs(pr[2] - c[2]);
  assert.ok(dist <= 1, `la cella di posa deve confinare col ciuffo, non stare a ${dist} celle`);
  assert.equal(m.pieno(...pr), false, 'e dev\'essere vuota');
});

test('una decorazione si rompe con la mano vuota', () => {
  const m = piano(6);
  m.metti(3, 7, 0, 'ciuffo', true);
  const d = new Decoro();
  m.onEvento = (e) => d.evento(e);
  d.scansiona(m);
  assert.equal(d.quanti, 1);
  const c = new Cantiere(m, new Luci());
  c.scegli(0);                                   // mano vuota
  assert.equal(azione(c.tipoScelto, d.interattivo(d.per.get('3,7,0'))), 'rompi');
  c.rompi(3, 7, 0);
  assert.equal(d.quanti, 0, 'il ciuffo deve sparire dal registro');
  assert.equal(m.tipo(3, 7, 0), null, 'e dal mondo');
});

test('le decorazioni piccole non proiettano ombra', () => {
  // ⚠ Committente: «i ciuffi d'erba e i LOD in generale non devono fare ombre».
  // Ed è giusto due volte: un ciuffo alto nove decimi proietta un trattino che
  // nessuno guarda, e ogni proiettante è geometria disegnata in OGNI cascata
  // della mappa — due su mobile, quattro su desktop.
  assert.equal(DECORAZIONI.ciuffo.proietta, false);
  // e le cose grandi sì: un albero senza ombra si stacca dal terreno
  assert.notEqual(DECORAZIONI.albero.proietta, false);
  assert.notEqual(DECORAZIONI.lampione.proietta, false);
});

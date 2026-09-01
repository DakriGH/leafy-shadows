// LA FOTOGRAFIA DÀ GLI STESSI TRIANGOLI DEL MONDO VERO — pieno, pelle e solo-acqua.
//
// ⚠ È LA PROVA CHE TIENE IN PIEDI IL WORKER: se la scatola fosse troppo
// stretta (una cascata più alta del margine, una riva che guarda una cella in
// più) il chunk costruito nel Worker avrebbe una faccia in più o in meno di
// quello costruito in linea, e a schermo si vedrebbe come «ogni tanto un buco
// che poi sparisce» — cioè come niente. Qui si confrontano i triangoli uno per
// uno, colori e canali dell'acqua compresi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { costruisciChunkDati, collegaFabbrica } from '../src/world/mesher.js';
import { fotografa, MondoFoto, allineaAllaFoto, impacchetta, trasferibili } from '../src/world/mesher-foto.js';
import { Mondo } from '../src/world/world.js';
import { registraBlocco, BLOCCHI } from '../src/world/blocks.js';
import { impostaMescolanza } from '../src/world/stagioni.js';

collegaFabbrica({ aggiornaCielo: () => {}, impostaVoxel: () => {}, spegniVoxel: () => {}, latoMassimoVoxel: () => 128, mondoVelato: () => false });

// un pezzo di mondo con tutto quello che il mesher legge: terrazze d'erba,
// una pozza con la sponda, una cascata che salta tre blocchi, ferro (materia),
// sabbia, e un blocco dell'Officina registrato a runtime
function mondoVario() {
  const m = new Mondo();
  registraBlocco('prova:lastra', { nome: 'Lastra di prova', cima: 0x808080, lato: 0x707070, fondo: 0x606060, solido: true, nav: 10, fam: 'mina', forma: 'lastra' });
  for (let x = -20; x < 36; x++) for (let z = -20; z < 36; z++) {
    const h = 4 + (((x * 5 + z * 3) % 7) + 7) % 7 % 3 + (x > 24 ? 4 : 0);
    for (let y = 0; y < h; y++) m.metti(x, y, z, y < h - 1 ? 'terra' : (x % 9 === 0 ? 'sabbia' : 'terra'), true);
    m.metti(x, h, z, x % 11 === 0 ? 'ferro' : 'erba', true);
  }
  // la pozza: 6×6 a quota 5 dentro il chunk 0,0, sponda tutta intorno
  for (let x = 4; x < 10; x++) for (let z = 4; z < 10; z++) { m.togli(x, 5, z, true); m.togli(x, 6, z, true); m.metti(x, 5, z, 'acqua', true); }
  // la cascata: sorgente in alto sul gradino (x=25) che cade nella pozza a est
  m.metti(25, 9, 12, 'acqua', true);
  for (let y = 5; y <= 8; y++) m.metti(24, y, 12, 'acqua~1', true);
  m.metti(23, 5, 12, 'acqua~2', true);
  m.metti(12, 8, 12, 'prova:lastra', true);
  return m;
}

/** I triangoli di un `dati()` come multinsieme di stringhe (l'ordine di emissione
 *  può cambiare fra Map e scatola densa, i triangoli no). */
function triangoli(d) {
  const out = [];
  const n = d.pos.length / 9;
  for (let t = 0; t < n; t++) {
    const parti = [];
    for (let i = 0; i < 9; i++) parti.push(d.pos[t * 9 + i].toFixed(4), d.col[t * 9 + i].toFixed(4));
    if (d.acq) for (let i = 0; i < 9; i++) parti.push(d.acq[t * 9 + i].toFixed(4));
    if (d.riv) for (let i = 0; i < 6; i++) parti.push(d.riv[t * 6 + i].toFixed(4));
    out.push(parti.join(' '));
  }
  return out.sort();
}

function confronta(m, kc, livello, soloAcqua) {
  const lineare = costruisciChunkDati(m, kc, livello, soloAcqua);
  const foto = fotografa(m, kc, livello, soloAcqua);
  assert.ok(foto, `foto vuota per ${kc}`);
  // come farebbe il Worker: pacchetto trasferibile, poi si ricostruisce da lì
  const clone = structuredClone(foto);
  allineaAllaFoto(clone);
  const dalWorker = impacchetta(costruisciChunkDati(new MondoFoto(clone), kc, livello, soloAcqua));
  if (!soloAcqua) {
    assert.deepEqual(triangoli(dalWorker.solidi), triangoli(lineare.solidi), `${kc} L${livello}: i solidi differiscono`);
    // ⚠ GLI INDICI NON SI CONFRONTANO: l'ordine di emissione cambia (Map contro
    // scatola densa). Si confronta DOVE stanno le cime marcate, e a che quota.
    const cime = (r) => { const out = []; for (let i = 0; i < r.erbe.length; i += 2) { const vi = r.erbe[i]; out.push(`${r.solidi.pos[vi * 3].toFixed(3)},${r.solidi.pos[vi * 3 + 1].toFixed(3)},${r.solidi.pos[vi * 3 + 2].toFixed(3)}@${r.erbe[i + 1]}`); } return out.sort(); };
    assert.deepEqual(cime(dalWorker), cime(lineare), `${kc} L${livello}: le cime d'erba marcate differiscono`);
  }
  assert.deepEqual(triangoli(dalWorker.acqua), triangoli(lineare.acqua), `${kc} L${livello}${soloAcqua ? ' solo acqua' : ''}: l'acqua differisce`);
  assert.equal(dalWorker.impatti.length, lineare.impatti.length, 'gli impatti delle cascate');
  assert.equal(dalWorker.flussi.length, lineare.flussi.length, 'le correnti');
  assert.ok(trasferibili(dalWorker).length > 0, 'i buffer sono trasferibili');
  return { lineare, dalWorker };
}

test('pieno: gli stessi triangoli, pozza e cascata comprese', () => {
  const m = mondoVario();
  for (const kc of ['0,0', '1,0', '0,1', '1,1', '-1,0', '-2,-2']) confronta(m, kc, 0, false);
});

test('pelle: gli stessi triangoli anche al bordo fra due chunk', () => {
  const m = mondoVario();
  for (const kc of ['0,0', '1,0', '1,1', '-1,-1']) confronta(m, kc, 1, false);
});

test('solo acqua: identico, e senza solidi', () => {
  const m = mondoVario();
  const { dalWorker } = confronta(m, '0,0', 0, true);
  assert.equal(dalWorker.solidi, undefined);
  assert.ok(dalWorker.acqua.pos.length > 0, 'la pozza c\'è');
});

test('la stagione viaggia nella foto: d\'inverno le cime escono bianche anche di là', () => {
  const m = mondoVario();
  impostaMescolanza('inverno', 'inverno', 0);
  try {
    const foto = fotografa(m, '0,0', 0, false);
    assert.equal(foto.stagione.corrente, 'inverno');
    // di là si parte da primavera (com'è un Worker appena nato) e la foto la corregge
    impostaMescolanza('primavera', 'primavera', 0);
    const clone = structuredClone(foto);
    allineaAllaFoto(clone);
    const r = costruisciChunkDati(new MondoFoto(clone), '0,0', 0, false);
    // una cima d'erba invernale è quasi bianca: r, g, b tutti sopra 0,7
    const vi = r.erbe[0];
    assert.ok(r.solidi.col[vi * 3] > 0.7 && r.solidi.col[vi * 3 + 1] > 0.7 && r.solidi.col[vi * 3 + 2] > 0.7, 'la cima non è invernale');
  } finally { impostaMescolanza('primavera', 'primavera', 0); }
});

test('un blocco registrato a runtime arriva con la foto', () => {
  const m = mondoVario();
  const foto = fotografa(m, '0,0', 0, false);
  assert.ok(foto.defs['prova:lastra'], 'la definizione viaggia');
  assert.ok(foto.tipi.includes('prova:lastra'));
  // se di là non esiste, allineaAllaFoto la registra
  const salva = BLOCCHI['prova:lastra']; delete BLOCCHI['prova:lastra'];
  allineaAllaFoto(structuredClone(foto));
  assert.ok(BLOCCHI['prova:lastra'], 'registrata di là');
  BLOCCHI['prova:lastra'] = salva;
});

test('un chunk vuoto non si fotografa', () => {
  const m = new Mondo();
  assert.equal(fotografa(m, '7,7', 0, false), null);
});

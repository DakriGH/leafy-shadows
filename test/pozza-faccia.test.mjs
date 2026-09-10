// LA POZZA NON ATTRAVERSA I BLOCCHI, e la faccia di spalle resta al buio.
//
// ⚠ IL COMMITTENTE, con una foto: «ogni tanto capita che sui blocchi si veda una
// luce fantasma illuminante dalla faccia che in teoria dovrebbe essere in
// ombra». Era vero, ed erano due cose diverse che davano lo stesso sintomo:
//
//  1. IL MARGINE ERA 0,6. `ombraLampada` si ferma su una colonna che sta sopra
//     il raggio, ma solo se quella colonna è più alta del pixel di almeno il
//     margine — serve perché la colonna su cui il pixel si posa non si faccia
//     ombra da sé. A 0,6 nessun ostacolo alto meno di sei decimi PIÙ del pixel
//     poteva fermare la luce: sulla faccia di spalle di un muro restava accesa
//     una FASCIA in cima alta sei decimi di blocco.
//  2. E NESSUN MARGINE, PER QUANTO PICCOLO, BASTAVA. `ombraLampada` cammina una
//     mappa di ALTEZZE: per costruzione non sa da che parte del muro sta il
//     pixel. Alla quota esatta della cima, la colonna del muro non è più alta
//     del pixel e la luce passa — con qualunque margine, anche zero. Quello che
//     lo sa è la NORMALE, e la regola è un SÌ/NO («o vede la luce o no»), non
//     una rampa di N·L: quella sarebbe il face shading, che qui è vietato.
//
// ⚠ QUESTA PROVA RISPECCHIA LO SHADER MA NON SI INVENTA I NUMERI: il margine lo
// LEGGE dal GLSL vero, e la guardia sulla normale la cerca dove deve stare.
// Rimettere 0,6 o togliere la riga della normale la fa diventare rossa —
// altrimenti sarebbe una prova sul mio JavaScript, non sul motore.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const resa = readFileSync(fileURLToPath(new URL('../src/nucleo/resa.js', import.meta.url)), 'utf8');
const modelli = readFileSync(fileURLToPath(new URL('../src/nucleo/modelli.js', import.meta.url)), 'utf8');

/** Il margine vero, letto dal GLSL: `h > y + 0.05 && h > pos.y + MARGINE`. */
function margineDal(sorgente) {
  const m = sorgente.match(/h > y \+ 0\.05 && h > pos\.y \+ ([0-9.]+)/);
  return m ? parseFloat(m[1]) : null;
}

/** La guardia sulla normale c'è? È la riga che spegne chi guarda dall'altra parte. */
function guardiaNormale(sorgente) {
  return /if \(dot\(n, lanterna - pos\) <= 0\.0\) continue;/.test(sorgente);
}

// ── lo specchio del cammino, con i numeri presi di là ─────────────────────────

/** La mappa delle altezze della scena di prova: `[cimaSolida+1, cimaOggetto+1]`. */
function mappaDiProva() {
  const m = new Map();
  const metti = (x, z, solida, oggetto = -1) => m.set(`${x},${z}`, [solida + 1, oggetto < 0 ? 0 : oggetto + 1]);
  for (let x = 0; x < 24; x++) for (let z = 0; z < 24; z++) metti(x, z, 7);   // terra piatta: superficie a 8
  for (let z = 6; z < 16; z++) metti(10, z, 10);                             // un muro alto tre: cima a 11
  metti(7, 10, 7, 10);                                                       // il lampione: oggetto alto tre
  return { leggi: (x, z) => m.get(`${x},${z}`) || [0, 0] };
}

/**
 * `pozza` rispecchiata con la guardia sulla CELLA DELLA LAMPADA anche sul canale
 * del terreno — che è quello che serve a una lampada-blocco (solida).
 */
function pozzaConCella(mappa, pos, n, lampada, { margine, cellaLampada }) {
  const lanterna = [lampada[0], lampada[1], lampada[2]];
  const v = [lanterna[0] - pos[0], lanterna[1] - pos[1], lanterna[2] - pos[2]];
  if (n[0] * v[0] + n[1] * v[1] + n[2] * v[2] <= 0) return 0;
  const d = [pos[0] - lampada[0], (pos[1] - lampada[1]) * 0.7, pos[2] - lampada[2]];
  const q = Math.hypot(d[0], d[1], d[2]) / lampada[3];
  if (q >= 1) return 0;
  const anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
  return anello * ombraLampada(pos, n, lanterna, mappa, margine, cellaLampada);
}

/** `ombraLampada` rispecchiata. `margine` viene dal GLSL. */
function ombraLampada(pos0, n, L, mappa, margine, cellaLampada = null) {
  const pos = [pos0[0] + n[0] * 0.02, pos0[1] + n[1] * 0.02, pos0[2] + n[2] * 0.02];
  const d = [L[0] - pos[0], L[2] - pos[2]];
  const lungo = Math.hypot(d[0], d[1]);
  if (lungo < 0.001) return 1;
  const dir = [d[0] / lungo, d[1] / lungo];
  const verso = [dir[0] >= 0 ? 1 : -1, dir[1] >= 0 ? 1 : -1];
  const mod_ = [Math.max(Math.abs(dir[0]), 1e-6), Math.max(Math.abs(dir[1]), 1e-6)];
  const cella = [Math.floor(pos[0]), Math.floor(pos[2])];
  const prossimo = [
    (cella[0] + Math.max(verso[0], 0) - pos[0]) / (verso[0] * mod_[0]),
    (cella[1] + Math.max(verso[1], 0) - pos[2]) / (verso[1] * mod_[1]),
  ];
  const quanto = [1 / mod_[0], 1 / mod_[1]];
  for (let i = 0; i < 14; i++) {
    const t = Math.min(prossimo[0], prossimo[1]);
    if (t >= lungo) break;
    if (prossimo[0] < prossimo[1]) { cella[0] += verso[0]; prossimo[0] += quanto[0]; }
    else { cella[1] += verso[1]; prossimo[1] += quanto[1]; }
    const y = pos[1] + (L[1] - pos[1]) * (t / lungo);
    const [h] = mappa.leggi(cella[0], cella[1]);
    const sua = cellaLampada && cella[0] === cellaLampada[0] && cella[1] === cellaLampada[1];
    if (h > y + 0.05 && h > pos[1] + margine && !sua) return 0;
  }
  return 1;
}

/** `pozza` rispecchiata, con o senza la guardia della normale. */
function pozza(pos, n, lampada, mappa, { margine, conNormale }) {
  const lanterna = [lampada[0], lampada[1] + 2.6, lampada[2]];
  if (conNormale) {
    const v = [lanterna[0] - pos[0], lanterna[1] - pos[1], lanterna[2] - pos[2]];
    if (n[0] * v[0] + n[1] * v[1] + n[2] * v[2] <= 0) return 0;
  }
  const d = [pos[0] - lampada[0], (pos[1] - lampada[1]) * 0.7, pos[2] - lampada[2]];
  const q = Math.hypot(d[0], d[1], d[2]) / lampada[3];
  if (q >= 1) return 0;
  const anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
  return anello * ombraLampada(pos, n, lanterna, mappa, margine);
}

// ── le prove ─────────────────────────────────────────────────────────────────

const LAMPADA = [7.5, 8, 10.5, 4.6];   // x y z raggio, come `uLampade`

test('il GLSL dichiara la guardia sulla normale, in tutti e due i programmi', () => {
  // ⚠ Se questa cade, la pozza è tornata ad attraversare i muri: nessuna delle
  // prove qui sotto la prenderebbe, perché rispecchiano quello che c'è scritto.
  assert.ok(guardiaNormale(resa), 'in nucleo/resa.js manca `if (dot(n, lanterna - pos) <= 0.0) continue;`');
  assert.ok(guardiaNormale(modelli), 'in nucleo/modelli.js manca la stessa riga');
});

test('e il margine è piccolo: a 0,6 restava accesa una fascia alta sei decimi', () => {
  for (const [nome, s] of [['resa', resa], ['modelli', modelli]]) {
    const m = margineDal(s);
    assert.ok(m !== null, `in ${nome} non trovo il margine di ombraLampada`);
    assert.ok(m <= 0.1, `in ${nome} il margine è ${m}: sopra 0,1 torna la fascia di luce fantasma in cima ai muri`);
  }
});

test('la faccia di spalle di un muro resta al buio a OGNI quota, cima compresa', () => {
  const mappa = mappaDiProva(), margine = margineDal(resa);
  // il muro sta alla colonna 10 e arriva a 11; il pixel sta sulla faccia +X
  for (const y of [8.2, 9.0, 9.8, 10.4, 10.8, 10.95, 11.0]) {
    const luce = pozza([11.0, y, 10.5], [1, 0, 0], LAMPADA, mappa, { margine, conNormale: true });
    assert.equal(luce, 0, `a quota ${y} la faccia di spalle è accesa (${luce}): è la luce fantasma`);
  }
});

test('e senza la normale la cima resta accesa comunque: nessun margine la salva', () => {
  // ⚠ È LA PROVA CHE LA NORMALE SERVE. Non basta stringere il margine: alla quota
  // della cima la colonna del muro non è più alta del pixel, e una mappa di
  // ALTEZZE non sa da che parte del muro sta. Con margine ZERO è ancora accesa.
  const mappa = mappaDiProva();
  const luce = pozza([11.0, 11.0, 10.5], [1, 0, 0], LAMPADA, mappa, { margine: 0, conNormale: false });
  assert.ok(luce > 0, 'senza la normale la cima dovrebbe essere accesa: se non lo è, questa prova non prova più niente');
});

test('e la faccia VERSO la lampada resta accesa: non si è spento tutto', () => {
  // ⚠ La cura sbagliata di un difetto di luce è spegnere: qui si controlla che
  // quello che deve accendersi si accenda ancora.
  const mappa = mappaDiProva(), margine = margineDal(resa);
  const casi = [
    ['faccia verso la lampada, in alto', [10.0, 10.8, 10.5], [-1, 0, 0]],
    ['faccia verso la lampada, in basso', [10.0, 8.2, 10.5], [-1, 0, 0]],
    ['terra davanti al muro', [9.5, 8.0, 10.5], [0, 1, 0]],
    ['terra sotto la lampada', [7.5, 8.0, 10.5], [0, 1, 0]],
  ];
  for (const [nome, p, n] of casi) {
    const luce = pozza(p, n, LAMPADA, mappa, { margine, conNormale: true });
    assert.ok(luce > 0, `${nome}: dovrebbe essere illuminata e vale ${luce}`);
  }
});

test('ma la CIMA di un muro più alto della lanterna no, ed è giusto così', () => {
  // ⚠ QUESTA RIGA È UN'ASPETTATIVA MIA CORRETTA DALLA PROVA, non un difetto: la
  // lanterna sta a 2,6 sopra la base del lampione (quota 10,6) e la cima del
  // muro sta a 11. Una superficie rivolta in SU e più alta della lampada non
  // riceve niente — prima si accendeva, e si accendeva per il difetto.
  // ⚠ E LA CONSEGUENZA VA SAPUTA: dopo questa correzione le cime dei muri alti
  // vicino a un lampione si SPENGONO. Non è la pozza che si è ristretta, è che
  // non erano illuminate.
  const mappa = mappaDiProva(), margine = margineDal(resa);
  const luce = pozza([10.5, 11.0, 10.5], [0, 1, 0], LAMPADA, mappa, { margine, conNormale: true });
  assert.equal(luce, 0, 'la cima del muro (11) è sopra la lanterna (10,6): non può essere illuminata dall\'alto');

  // e un blocco BASSO, la cui cima sta sotto la lanterna, si illumina eccome
  const bassa = pozza([9.5, 9.0, 10.5], [0, 1, 0], LAMPADA, mappa, { margine, conNormale: true });
  assert.ok(bassa > 0, 'la cima di un blocco sotto la lanterna deve restare illuminata');
});

test('una LAMPADA-BLOCCO illumina la terra attorno: non si fa ombra da sé', () => {
  // ⚠ IL DIFETTO: un blocco che dichiara una luce (lucciola, cristallo, lampada
  // rossa/verde/blu) è SOLIDO, quindi sta nella mappa del terreno, e il raggio
  // da qualunque pixel verso di lui entra PER FORZA nella sua cella. Il test del
  // terreno lo vedeva come un ostacolo: ogni lampada appoggiata a terra si
  // spegneva DA SOLA, tutta, senza illuminare niente. La guardia
  // `!all(equal(cella, cellaLampada))` c'era già sul canale degli OGGETTI e
  // mancava su questo — finché le lampade erano solo lampioni (che sono
  // modelli, e nel terreno non ci sono) non si poteva vedere.
  assert.ok(/h > y \+ 0\.05 && h > pos\.y \+ [0-9.]+ && !all\(equal\(cella, cellaLampada\)\)/.test(resa),
    'in nucleo/resa.js la cella della lampada fa ancora ombra a se stessa sul canale del terreno');
  assert.ok(/h > y \+ 0\.05 && h > pos\.y \+ [0-9.]+ && !all\(equal\(cella, cellaLampada\)\)/.test(modelli),
    'in nucleo/modelli.js manca la stessa guardia');

  // e la stessa cosa misurata: una lampada-blocco su una piana, a terra attorno
  const m = new Map();
  const metti = (x, z, solida) => m.set(`${x},${z}`, [solida + 1, 0]);
  for (let x = 0; x < 24; x++) for (let z = 0; z < 24; z++) metti(x, z, 6);   // piana: superficie a 7
  metti(11, 10, 7);                                                          // la lampada, blocco solido
  const mappa = { leggi: (x, z) => m.get(`${x},${z}`) || [0, 0] };
  const margine = margineDal(resa);
  // ⚠ la sorgente è il CENTRO della cella, anche in y: appoggiata sul piano che
  // deve illuminare, il prodotto scalare con la normale del suolo varrebbe zero
  const lampada = [11.5, 7.5, 10.5, 8];
  for (const x of [9.5, 12.5, 13.5, 15.5]) {
    const luce = pozzaConCella(mappa, [x, 7.0, 10.5], [0, 1, 0], lampada, { margine, cellaLampada: [11, 10] });
    assert.ok(luce > 0, `a ${x} blocchi dalla lampada la terra è spenta (${luce}): la lampada si sta facendo ombra da sé`);
  }
});

test('e la terra DIETRO il muro resta in ombra: il muro fa ancora ombra', () => {
  const mappa = mappaDiProva(), margine = margineDal(resa);
  const luce = pozza([11.5, 8.0, 10.5], [0, 1, 0], LAMPADA, mappa, { margine, conNormale: true });
  assert.equal(luce, 0, 'il muro ha smesso di fare ombra a terra');
});

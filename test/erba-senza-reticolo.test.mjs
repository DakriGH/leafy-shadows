// L'ERBA NON DEVE SAPERE NIENTE DEL RETICOLO DELLE CELLE.
//
// ⚠ TRE STESURE, DUE DIFETTI OPPOSTI, E UNA LEZIONE SULLE PROVE.
//
//  1. altezza = «tipo.alto», costante per cella → GRADINO netto sul confine fra
//     una cella e l'altra: una griglia a un blocco di passo.
//  2. curata interpolando fra i CENTRI delle celle → CUPOLA. Il centro prende il
//     valore pieno della sua cella, i bordi la media coi vicini: le celle alte
//     diventano dossi e le basse conche. Il committente l'ha descritto esatto:
//     «sono dei balzi più alti al centro del blocco e più bassi ai lati, così
//     sembra tiling». Avevo tolto il gradino e ci avevo messo una cupola.
//  3. altezza da un rumore CONTINUO letto alla posizione della lamella: delle
//     celle non sa niente, quindi non può fare né gradini né cupole.
//
// ⚠ E LA LEZIONE È SULLA PROVA, non sul codice. Avevo scritto un test che
// misurava il GRADINO — l'altezza media appena a sinistra contro appena a destra
// di un confine. Con la cupola quel test passava benissimo: sul CONFINE andava
// tutto bene, era il CENTRO ad essere sbagliato. Una prova che guarda solo dove
// si è già sbagliato una volta non trova il modo nuovo di sbagliare.
//
// Qui si misurano tutt'e due, perché la proprietà vera è una sola: l'altezza
// non deve correlare con la posizione DENTRO la cella, in nessun modo.
import './_dom-stub.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { Erba, collegaFabbrica } from '../src/vegetazione/erba.js';
import { Mondo } from '../src/world/world.js';

// una fabbrica finta: alla semina non serve una GPU, ed è il punto del confine
const fabbricaFinta = {
  creaPrato: () => ({}), scriviPrato() {}, animaPrato() {}, mostraPrato() {},
};
collegaFabbrica(fabbricaFinta);

const scenaFinta = { add() {} };

function prato(raggio = 40, quota = 4) {
  const m = new Mondo();
  for (let x = -raggio; x <= raggio; x++) for (let z = -raggio; z <= raggio; z++) m.metti(x, quota, z, 'erba', true);
  return m;
}
function semina(e, m, pos) {
  for (let i = 0; i < 400 && (e._coda.length || e.fili === 0); i++) e.aggiorna(0.016, m, pos, null, pos);
}

test('né cupole né conche: il centro della cella non è più alto del bordo', () => {
  const m = prato();
  const pos = { x: 8, y: 5, z: 8 };
  const e = new Erba(scenaFinta, { max: 400000, densita: 8 });
  semina(e, m, pos);

  let sCentro = 0, nCentro = 0, sBordo = 0, nBordo = 0;
  for (let i = 0; i < e._n; i++) {
    const px = e.sPos[i * 4], pz = e.sPos[i * 4 + 2];
    const dx = Math.abs(px - Math.floor(px) - 0.5), dz = Math.abs(pz - Math.floor(pz) - 0.5);
    const d = Math.max(dx, dz);            // 0 = centro cella, 0,5 = bordo
    const h = e.sDati[i * 4 + 1];
    if (d < 0.15) { sCentro += h; nCentro++; }
    else if (d > 0.40) { sBordo += h; nBordo++; }
  }
  assert.ok(nCentro > 300 && nBordo > 300, `campione magro: ${nCentro}/${nBordo}`);
  const rapporto = (sCentro / nCentro) / (sBordo / nBordo);
  assert.ok(rapporto > 0.97 && rapporto < 1.03,
    `al centro della cella l'erba è ${rapporto.toFixed(3)}× quella al bordo: sono cupole, e si leggono come tiling`);
});

test('e nemmeno gradini: due lamelle a cavallo di un confine sono alte uguale', () => {
  const m = prato();
  const pos = { x: 8, y: 5, z: 8 };
  const e = new Erba(scenaFinta, { max: 400000, densita: 8 });
  semina(e, m, pos);

  // le lamelle appena a sinistra e appena a destra di ogni confine verticale
  let sA = 0, nA = 0, sB = 0, nB = 0;
  for (let i = 0; i < e._n; i++) {
    const px = e.sPos[i * 4];
    const dentro = px - Math.floor(px);
    const h = e.sDati[i * 4 + 1];
    if (dentro > 0.88) { sA += h; nA++; }
    else if (dentro < 0.12) { sB += h; nB++; }
  }
  assert.ok(nA > 300 && nB > 300, `campione magro: ${nA}/${nB}`);
  const rapporto = (sA / nA) / (sB / nB);
  assert.ok(rapporto > 0.96 && rapporto < 1.04,
    `attraversando un confine l'altezza salta di ${rapporto.toFixed(3)}×: è una griglia a un blocco di passo`);
});

test('ma la variazione c\'è, ed è larga: il prato non è una moquette', () => {
  // ⚠ IL CONTROLLO OPPOSTO, e serve: le due prove qui sopra si superano tutte e
  // due mettendo l'altezza COSTANTE. Un prato tutto uguale non ha gradini né
  // cupole, e fa schifo. Qui si pretende che le zolle esistano davvero.
  const m = prato();
  const pos = { x: 8, y: 5, z: 8 };
  const e = new Erba(scenaFinta, { max: 400000, densita: 8 });
  semina(e, m, pos);

  const perCella = new Map();
  for (let i = 0; i < e._n; i++) {
    const k = Math.floor(e.sPos[i * 4]) * 4096 + Math.floor(e.sPos[i * 4 + 2]);
    const a = perCella.get(k) || [0, 0];
    a[0] += e.sDati[i * 4 + 1]; a[1]++;
    perCella.set(k, a);
  }
  const medie = [...perCella.values()].map((a) => a[0] / a[1]).sort((x, y) => x - y);
  const rapporto = medie[Math.floor(medie.length * 0.95)] / medie[Math.floor(medie.length * 0.05)];
  assert.ok(rapporto > 1.35,
    `fra la zolla più alta e la più bassa ci sono solo ${rapporto.toFixed(2)}×: il prato è piatto`);
});

test('LA BASE DEL FILO È IL BLOCCO SOTTO, al bit', async () => {
  // ⚠ REGOLA DI LEAFY, e non è estetica astratta: a quota zero il filo e la
  // faccia del blocco sono lo stesso pixel. Se i due colori differiscono anche
  // di poco, l'attacco si legge come una riga e il ciuffo sembra APPOGGIATO
  // sopra invece che cresciuto lì. Il committente l'ha visto e ridetto:
  // «la sfumatura deve sempre partire dal colore base».
  //
  // La variazione (per lamella e a chiazze) vive tutta nella PUNTA — e questo
  // test è l'unico modo di accorgersi se un giorno rientra dalla base.
  const { paletteBlocco } = await import('../src/world/stagioni.js');
  const m = prato(20, 4);
  const pos = { x: 8, y: 5, z: 8 };
  const e = new Erba(scenaFinta, { max: 400000, densita: 8 });
  semina(e, m, pos);

  const atteso = paletteBlocco('erba', 4).cima;
  const r = ((atteso >> 16) & 255) / 255, g = ((atteso >> 8) & 255) / 255, b = (atteso & 255) / 255;
  let fuori = 0;
  for (let i = 0; i < e._n; i++) {
    const j = i * 3;
    if (Math.abs(e.sCol[j] - r) > 1e-6 || Math.abs(e.sCol[j + 1] - g) > 1e-6 || Math.abs(e.sCol[j + 2] - b) > 1e-6) fuori++;
  }
  assert.equal(fuori, 0, `${fuori} lamelle su ${e._n} hanno la base di un colore diverso dal blocco sotto`);

  // e il controllo opposto: la PUNTA invece deve variare, se no il prato è piatto
  const punte = new Set();
  for (let i = 0; i < Math.min(e._n, 4000); i++) punte.add(e.sColCima[i * 3 + 1].toFixed(4));
  assert.ok(punte.size > 50, `le punte hanno solo ${punte.size} verdi diversi: la variazione è finita`);
});

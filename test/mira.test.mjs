// LA MIRA SI PROVA IN NODE, come il passeggero: è aritmetica su una griglia.
//
// ⚠ E QUESTE PROVE GUARDANO LA FACCIA, non solo la cella. La cella giusta con
// la faccia sbagliata è il difetto più insidioso di un raycast a voxel: si
// rompe il blocco che si voleva, ma il blocco NUOVO compare dalla parte
// sbagliata — e sembra un problema di mira, non di normale.
import test from 'node:test';
import assert from 'node:assert/strict';
import { mira, posabile } from '../src/gioco/mira.js';
import { Cantiere, CASSETTA } from '../src/gioco/cantiere.js';
import { Luci } from '../src/motore/luci.js';
import { Mondo } from '../src/world/world.js';

function piano(quota = 6, raggio = 10) {
  const m = new Mondo();
  for (let x = -raggio; x <= raggio; x++) for (let z = -raggio; z <= raggio; z++) m.metti(x, quota, z, 'terra', true);
  return m;
}
const vers = (x, y, z) => { const n = Math.hypot(x, y, z); return { x: x / n, y: y / n, z: z / n }; };

test('guardando in giù si colpisce il pavimento, faccia in su', () => {
  const m = piano(6);
  const r = mira(m, { x: 0.5, y: 10, z: 0.5 }, vers(0, -1, 0));
  assert.deepEqual(r.cella, [0, 6, 0]);
  assert.deepEqual(r.faccia, [0, 1, 0]);
  assert.deepEqual(r.prima, [0, 7, 0]);
});

test('la cella «prima» è sempre vuota: è lì che si posa', () => {
  const m = piano(6);
  for (const v of [vers(0, -1, 0), vers(0.3, -1, 0.2), vers(-0.6, -1, 0.4)]) {
    const r = mira(m, { x: 0.5, y: 12, z: 0.5 }, v, 20);
    assert.ok(r, 'nessun bersaglio con ' + JSON.stringify(v));
    assert.equal(m.pieno(...r.cella), true, 'la cella colpita deve essere piena');
    assert.equal(m.pieno(...r.prima), false, 'la cella prima deve essere vuota');
  }
});

test('un muro colpito di lato dà la faccia laterale, non quella di sopra', () => {
  const m = new Mondo();
  // una parete a x = 3, alta 4, e il raggio arriva orizzontale da x = 0
  for (let y = 0; y < 4; y++) for (let z = -2; z <= 2; z++) m.metti(3, y, z, 'pietra', true);
  const r = mira(m, { x: 0.5, y: 2.5, z: 0.5 }, vers(1, 0, 0));
  assert.deepEqual(r.cella, [3, 2, 0]);
  assert.deepEqual(r.faccia, [-1, 0, 0], 'la normale guarda verso chi mira');
  assert.deepEqual(r.prima, [2, 2, 0]);
});

test('senza niente davanti non si mira a niente', () => {
  const m = piano(6);
  assert.equal(mira(m, { x: 0.5, y: 10, z: 0.5 }, vers(0, 1, 0)), null);
});

test('la portata si rispetta: oltre, non si costruisce', () => {
  const m = piano(0, 40);
  // da quota 20 il pavimento è a 20 blocchi: dentro 25 sì, dentro 7 no
  assert.ok(mira(m, { x: 0.5, y: 20.5, z: 0.5 }, vers(0, -1, 0), 25));
  assert.equal(mira(m, { x: 0.5, y: 20.5, z: 0.5 }, vers(0, -1, 0), 7), null);
});

test('murati dentro un blocco, quel blocco si può rompere', () => {
  const m = piano(6);
  m.metti(0, 7, 0, 'pietra', true);
  const r = mira(m, { x: 0.5, y: 7.5, z: 0.5 }, vers(0, 0, -1));
  assert.deepEqual(r.cella, [0, 7, 0], 'la cella di partenza si guarda lo stesso');
});

test('non ci si mura addosso: la cella del corpo non è posabile', () => {
  const m = piano(6);
  // ⚠ IN PIEDI IL CORPO STA IN UNA CELLA SOLA, e la prima stesura di questa
  // prova pretendeva che ne occupasse due: alto 0,90 coi piedi a 7 la testa
  // arriva a 7,9, quindi la cella 8 è davvero libera e ci si può posare sopra
  // un blocco — come in qualunque gioco a blocchi. Era sbagliata la prova.
  const inPiedi = { x: 0.5, y: 7, z: 0.5 };
  assert.equal(posabile(m, [0, 7, 0], inPiedi), false, 'i piedi');
  assert.equal(posabile(m, [0, 8, 0], inPiedi), true, 'sopra la testa sì: alto 0,9 finisce a 7,9');
  assert.equal(posabile(m, [2, 7, 0], inPiedi), true, 'di fianco sì');

  // ⚠ IL CASO CHE CONTA È A MEZZ'ARIA, perché lì il corpo sta a cavallo di due
  // celle e tutte e due vanno vietate: saltando, con una sola vietata, ci si
  // mura da soli a mezzo salto.
  const aMezzAria = { x: 0.5, y: 7.5, z: 0.5 };
  assert.equal(posabile(m, [0, 7, 0], aMezzAria), false, 'la cella dei piedi');
  assert.equal(posabile(m, [0, 8, 0], aMezzAria), false, 'e anche quella della testa');

  // e a cavallo di due celle in orizzontale, che è la stessa trappola girata
  const suUnBordo = { x: 0.98, y: 7, z: 0.5 };
  assert.equal(posabile(m, [0, 7, 0], suUnBordo), false);
  assert.equal(posabile(m, [1, 7, 0], suUnBordo), false, 'sporge di 0,28 nella cella accanto');
});

test('posare una lampada la accende, romperla la spegne', () => {
  const m = piano(6);
  const luci = new Luci();
  const c = new Cantiere(m, luci);
  c.scegli(CASSETTA.indexOf('lampadaRossa'));
  assert.equal(c.posa(0, 8, 0), true);
  assert.equal(luci.accese, 1, 'la lampada deve accendersi da sola');
  // ⚠ IL COLORE VIENE DALLA TABELLA, non da qui: 0xff2a1a → rosso quasi puro
  assert.ok(luci.col[0] > 0.9 && luci.col[1] < 0.3, 'e col colore dichiarato dal blocco');
  c.rompi(0, 8, 0);
  assert.equal(luci.accese, 0, 'e spegnersi quando il blocco sparisce');
});

test('un blocco senza luce non accende niente', () => {
  const luci = new Luci();
  const c = new Cantiere(piano(6), luci);
  c.scegli(CASSETTA.indexOf('pietra'));
  c.posa(0, 8, 0);
  assert.equal(luci.accese, 0);
});

test('gli indici delle luci non si spostano quando una si spegne', () => {
  // ⚠ LA PROVA CHE VALE PIÙ DELLE ALTRE. Compattando l'array a ogni
  // spegnimento, chi tiene un indice (lo zoo tiene quelli delle luci in moto)
  // si ritroverebbe a muovere la lampada sbagliata.
  const luci = new Luci();
  const a = luci.accendi({ x: 0, y: 0, z: 0, raggio: 5 });
  const b = luci.accendi({ x: 10, y: 0, z: 0, raggio: 5 });
  const c = luci.accendi({ x: 20, y: 0, z: 0, raggio: 5 });
  luci.spegni(b);
  assert.equal(luci.pos[c * 4], 20, 'la terza deve stare ancora al suo posto');
  assert.equal(luci.accese, 2);
  const d = luci.accendi({ x: 30, y: 0, z: 0, raggio: 5 });
  assert.equal(d, b, 'e il buco si riusa invece di crescere');
  assert.equal(luci.pos[a * 4], 0);
});



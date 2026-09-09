// IL CATALOGO — la riga di dati per tipo, e la posa che se ne ricava.
//
// La prova che conta davvero è la PRIMA: la posa si ricava dalla cella e non
// da un numero a caso. Con lo streaming i chunk entrano e escono di continuo,
// e una posa casuale vorrebbe dire un bosco che si rimescola alle spalle di
// chi cammina — un difetto che non si vede subito e che non si sa dove cercare.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO, rigaDi, registraAsset, posaDi, istanzaDi, conAlone } from '../src/partita/catalogo.js';

const QUARTO = Math.PI / 2;

test('la posa è DETERMINISTICA dalla cella: la stessa cella dà la stessa posa, sempre', () => {
  const a = posaDi('albero', 13, 5, -7);
  for (let i = 0; i < 50; i++) {
    const b = posaDi('albero', 13, 5, -7);
    assert.equal(b.scala, a.scala);
    assert.equal(b.giro, a.giro);
  }
  // e celle diverse danno pose diverse: se no non varia niente
  const pose = new Set();
  for (let x = 0; x < 40; x++) pose.add(posaDi('albero', x, 5, 0).giro.toFixed(4));
  assert.ok(pose.size > 30, `su 40 celle solo ${pose.size} giri diversi: l'impronta non distribuisce`);
});

test('il giro A QUARTI cade solo sugli assi: una panchina a 37° si legge come sbagliata', () => {
  for (let x = -20; x < 20; x++) {
    for (let z = -3; z < 3; z++) {
      const g = posaDi('panchina', x, 4, z).giro;
      const quarti = g / QUARTO;
      assert.ok(Number.isInteger(Math.round(quarti * 1e6) / 1e6) && Math.abs(quarti - Math.round(quarti)) < 1e-9,
        `giro ${g} non è un multiplo di π/2`);
      assert.ok(Math.round(quarti) >= 0 && Math.round(quarti) <= 3, `giro fuori dai quattro quarti: ${g}`);
    }
  }
  // e li usa tutti e quattro, se no è come non girare
  const usati = new Set();
  for (let x = 0; x < 60; x++) usati.add(Math.round(posaDi('panchina', x, 4, 0).giro / QUARTO));
  assert.equal(usati.size, 4, `usa ${usati.size} quarti su 4`);
});

test('il giro LIBERO copre il cerchio, la scala sta nell\'intervallo dichiarato', () => {
  let min = Infinity, max = -Infinity, gMin = Infinity, gMax = -Infinity;
  for (let x = 0; x < 300; x++) {
    const p = posaDi('albero', x, 6, x * 3);
    min = Math.min(min, p.scala); max = Math.max(max, p.scala);
    gMin = Math.min(gMin, p.giro); gMax = Math.max(gMax, p.giro);
  }
  const [a, b] = CATALOGO.albero.scala;
  assert.ok(min >= a && max <= b, `scala fuori da [${a}, ${b}]: ${min}…${max}`);
  assert.ok(max - min > (b - a) * 0.8, 'la scala non copre l\'intervallo: varia troppo poco');
  assert.ok(gMin < 0.4 && gMax > Math.PI * 2 - 0.4, `il giro non copre il cerchio: ${gMin}…${gMax}`);
});

test('SPEGNERE UN LAMPIONE NON LO GIRA: acceso e spento hanno la stessa posa', () => {
  // ⚠ L'impronta non guarda il TIPO, solo la cella — ed è voluto: `lampione`
  // e `lampioneSpento` sono lo stesso oggetto in due stati, e un lampione che
  // scatta di novanta gradi quando lo spegni è un difetto che si vede subito.
  for (let x = -10; x < 10; x++) {
    const on = posaDi('lampione', x, 5, 2), off = posaDi('lampioneSpento', x, 5, 2);
    assert.equal(off.giro, on.giro, `il lampione in ${x} gira spegnendosi`);
    assert.equal(off.scala, on.scala);
  }
});

test('`varia: false` inchioda tutto com\'era prima del catalogo', () => {
  const p = posaDi('albero', 13, 5, -7, false);
  assert.deepEqual([p.scala, p.giro, ...p.tinta], [1, 0, 1, 1, 1]);
  assert.deepEqual(istanzaDi('albero', 3, 4, 5, false), [3, 4, 5, 1, 1, 1, 1, 0]);
});

test('un tipo fuori catalogo resta fermo: niente sorprese sui pezzi disegnati a mano', () => {
  assert.equal(rigaDi('cosa-che-non-esiste'), null);
  const p = posaDi('cosa-che-non-esiste', 1, 2, 3);
  assert.deepEqual([p.scala, p.giro], [1, 0]);
  // ⚠ e nemmeno le chiavi ereditate da Object passano per righe
  assert.equal(rigaDi('toString'), null);
  assert.equal(rigaDi('constructor'), null);
});

test('registraAsset riempie i buchi e non perde quello che gli si dice', () => {
  const r = registraAsset('prova-asset', { nome: 'Prova', giro: 'libero' });
  assert.equal(r.modello, 'prova-asset', 'il modello, se non detto, è l\'id');
  assert.equal(r.giro, 'libero');
  assert.equal(r.scala, 1);
  assert.equal(r.classe, 'fermo');
  assert.deepEqual(r.ingombro, [1, 1, 1]);
  assert.equal(rigaDi('prova-asset').nome, 'Prova');
  delete CATALOGO['prova-asset'];
});

test('l\'alone è una proprietà del catalogo, non un `if` sul nome', () => {
  const con = conAlone();
  assert.deepEqual(con.map(([id]) => id), ['lampione'], 'oggi solo il lampione ha l\'alone');
  const { quota, raggio, colore } = con[0][1].alone;
  assert.equal(quota, 2.35, 'la lanterna sta a +2,35: è la quota misurata, non un numero a caso');
  assert.ok(raggio > 0 && colore.length === 3);
});

test('ogni riga a catalogo è completa: chi ne aggiunge una non può dimenticare un campo', () => {
  for (const [id, r] of Object.entries(CATALOGO)) {
    assert.ok(r.nome, `${id}: manca il nome`);
    assert.ok(r.modello, `${id}: manca il modello`);
    assert.ok(['no', 'quarti', 'libero'].includes(r.giro), `${id}: giro sconosciuto «${r.giro}»`);
    assert.ok(typeof r.scala === 'number' || (Array.isArray(r.scala) && r.scala.length === 2 && r.scala[0] < r.scala[1]),
      `${id}: scala malformata`);
    assert.equal(typeof r.proiettaOmbra, 'boolean', `${id}: proiettaOmbra non è sì/no`);
    assert.ok(['fermo', 'vicino', 'medio', 'lontano'].includes(r.classe), `${id}: classe sconosciuta «${r.classe}»`);
    assert.ok(Array.isArray(r.ingombro) && r.ingombro.length === 3, `${id}: ingombro malformato`);
  }
});

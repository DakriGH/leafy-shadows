// LE STAGIONI LUNGO L'ANNO — due settimane di passaggio, non uno scatto.
//
// ⚠ E LA PRIMA STESURA DAVA SEMPRE MIX ZERO: guardavo solo il confine DAVANTI,
// quindi il giorno dopo un solstizio la stagione era già cambiata e il confine
// davanti stava a tre mesi. La seconda metà del passaggio non esisteva, e le
// stagioni scattavano — proprio la cosa che le due settimane devono togliere.
import test from 'node:test';
import assert from 'node:assert/strict';
import { stagioneAlGiorno, INIZIO_STAGIONE, GIORNI_PASSAGGIO, giornoDellAnno } from '../src/world/stagioni.js';

test('due settimane esatte di passaggio, centrate sul confine', () => {
  assert.equal(GIORNI_PASSAGGIO, 14, 'richiesta esplicita del committente');
  for (const { giorno, chiave } of INIZIO_STAGIONE) {
    // ⚠ CENTRATE: una settimana prima e una dopo. Un passaggio che comincia il
    // giorno esatto del solstizio farebbe arrivare l'estate piena con una
    // settimana di ritardo su sé stessa.
    const sul = stagioneAlGiorno(giorno);
    assert.equal(sul.a, chiave, 'sul confine si sta arrivando a ' + chiave);
    assert.ok(Math.abs(sul.mix - 0.5) < 1e-9, 'e a metà strada: ' + sul.mix);
  }
});

test('il mix sale da 0 a 1 senza tornare indietro', () => {
  const c = INIZIO_STAGIONE[1].giorno;          // solstizio d'estate
  let prima = -1;
  for (let g = c - 6.5; g <= c + 6.5; g += 0.25) {
    const r = stagioneAlGiorno(g);
    assert.equal(r.da, 'primavera');
    assert.equal(r.a, 'estate');
    assert.ok(r.mix >= prima, `a ${g.toFixed(2)} il mix è tornato indietro`);
    assert.ok(r.mix >= 0 && r.mix <= 1, 'e resta fra zero e uno');
    prima = r.mix;
  }
});

test('fuori dalla finestra la stagione è netta', () => {
  for (const g of [0, 40, 100, 200, 300, 340]) {
    const r = stagioneAlGiorno(g);
    assert.equal(r.da, r.a, `il giorno ${g} non deve essere in transizione`);
    assert.equal(r.mix, 0);
  }
});

test('gennaio appartiene all\'inverno cominciato a dicembre', () => {
  // ⚠ IL CASO CHE SI SBAGLIA: il primo gennaio nessuna stagione è ancora
  // «cominciata» quest'anno, e senza questo caso si finirebbe in autunno.
  assert.equal(stagioneAlGiorno(0).da, 'inverno');
  assert.equal(stagioneAlGiorno(10).da, 'inverno');
});

test('l\'anno si chiude: il giorno 365 è il giorno 0', () => {
  const a = stagioneAlGiorno(0), b = stagioneAlGiorno(365);
  assert.deepEqual(a, b);
  // e il passaggio a cavallo di capodanno non esiste (il confine è a dicembre)
  assert.equal(stagioneAlGiorno(364).da, 'inverno');
});

test('in un anno intero si passa per tutte e quattro', () => {
  const viste = new Set();
  for (let g = 0; g < 365; g += 0.5) viste.add(stagioneAlGiorno(g).da);
  assert.equal(viste.size, 4, 'viste: ' + [...viste].join(', '));
});

test('il giorno dell\'anno è quello giusto', () => {
  assert.equal(giornoDellAnno(new Date(Date.UTC(2024, 0, 1))), 0);
  assert.equal(giornoDellAnno(new Date(Date.UTC(2024, 5, 21))), 172);
});

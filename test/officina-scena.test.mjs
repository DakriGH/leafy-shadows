// L'Officina nuova: l'albero della scena, l'ispettore e la creativa.
//
// ⚠ Si prova quello che è PURO — l'ordine delle voci, il taglio, l'elenco, i
// filtri. Il DOM non si prova qui: si guarda a schermo, che è la regola della
// casa e per un pannello è anche l'unica onesta.
import test from 'node:test';
import assert from 'node:assert/strict';
import { vociVicine, leggiMeta, esa, TETTO_VOCI } from '../src/officina/scena.js';
import { voci, categorieDi, filtra, MANO_VUOTA } from '../src/officina/creativa.js';

test('l\'albero mette per prime le cose VICINE a chi guarda', () => {
  // ⚠ nel mondo vero ci sono trecentosettanta alberi: un elenco in ordine di
  // creazione è un muro, e quelle che servono sono quelle intorno a chi lavora
  const elenco = [
    { id: 1, x: 100, y: 0, z: 0 },
    { id: 2, x: 2, y: 0, z: 0 },
    { id: 3, x: 30, y: 0, z: 0 },
  ];
  const { voci: v, altri } = vociVicine(elenco, { x: 0, y: 0, z: 0 });
  assert.deepEqual(v.map((e) => e.id), [2, 3, 1]);
  assert.equal(altri, 0);
  assert.equal(Math.round(v[0].lontano), 2);
});

test('l\'albero TAGLIA, e dice quante ne ha lasciate fuori', () => {
  const elenco = [];
  for (let i = 0; i < TETTO_VOCI + 25; i++) elenco.push({ id: i, x: i, y: 0, z: 0 });
  const { voci: v, altri } = vociVicine(elenco, { x: 0, y: 0, z: 0 });
  assert.equal(v.length, TETTO_VOCI);
  assert.equal(altri, 25);
  assert.equal(v[0].id, 0, 'la più vicina resta in cima');
});

test('la quota pesa la METÀ nella distanza', () => {
  // una cosa dieci blocchi più in alto è meno «lontana» di una dieci blocchi
  // più in là: in un mondo a terrazze, se no l'elenco si riempie di roba sopra
  const { voci: v } = vociVicine([{ id: 'alto', x: 0, y: 10, z: 0 }, { id: 'lontano', x: 10, y: 0, z: 0 }], { x: 0, y: 0, z: 0 });
  assert.equal(v[0].id, 'alto');
});

test('i metadati si scrivono a righe «chiave: valore»', () => {
  assert.deepEqual(leggiMeta('nota: ciao\npiantato: 10/09/2026'), { nota: 'ciao', piantato: '10/09/2026' });
  assert.deepEqual(leggiMeta('  spazi  :  tenuti dentro  '), { spazi: 'tenuti dentro' });
  // ⚠ le righe storte si buttano invece di far esplodere il pannello: chi
  // scrive in una casella di testo scrive anche a metà
  assert.deepEqual(leggiMeta('senza due punti\n: senza chiave\n\nok: sì'), { ok: 'sì' });
  // ⚠ e un valore che contiene i due punti non si spezza al secondo
  assert.deepEqual(leggiMeta('quando: 10:45'), { quando: '10:45' });
});

test('esa() dà sempre sei cifre', () => {
  assert.equal(esa(0x5ac650), '#5ac650');
  assert.equal(esa(0x000f00), '#000f00');
  assert.equal(esa(0), '#000000');
});

// ── la creativa ──────────────────────────────────────────────────────────────

const CATEGORIE = [
  { id: 'naturali', nome: 'Naturali', blocchi: ['erba', 'terra'] },
  { id: 'luci', nome: 'Luci', blocchi: ['lucciola'] },
];
const BLOCCHI = {
  erba: { nome: 'Erba', cima: 0x5ac650, lato: 0xe59b69 },
  terra: { nome: 'Terra', cima: 0xbf704b, lato: 0xbf704b },
  lucciola: { nome: 'Lucciola', cima: 0xffe08a, lato: 0xffe08a },
  albero: { nome: 'Albero', forma: 'modello', modello: 'albero', colore: 0x4f9e46 },
  gatto: { nome: 'Gatto', forma: 'modello', modello: 'gatto', colore: 0xf3a94a },
  // ⚠ un blocco NORMALE che nessuna categoria nomina: è il caso di `acqua`, che
  // sta in `BLOCCHI` e in nessun elenco, e senza di lui la voce «Altro» non
  // sarebbe coperta da nessuna prova
  acqua: { nome: 'Acqua', cima: 0x4fc2ec, lato: 0x3dade0 },
};

test('la creativa prende TUTTO, anche quello che nessuna categoria nomina', () => {
  // ⚠ è il difetto che questo file cura: una lista scritta a mano non ha il
  // blocco aggiunto ieri. `albero` e `gatto` non stanno in nessuna categoria e
  // devono comparire lo stesso.
  const e = voci({ categorie: CATEGORIE, blocchi: BLOCCHI, catalogo: {} });
  const ids = e.map((v) => v.id);
  assert.equal(ids[0], null, 'la mano vuota è la prima voce, ed è uno strumento');
  for (const id of Object.keys(BLOCCHI)) assert.ok(ids.includes(id), `manca ${id}`);
  assert.equal(new Set(ids).size, ids.length, 'qualcosa compare due volte');
});

test('un oggetto col MODELLO si dichiara come tale: l\'icona non deve mentire', () => {
  const e = voci({ categorie: CATEGORIE, blocchi: BLOCCHI, catalogo: {} });
  assert.equal(e.find((v) => v.id === 'gatto').cosa, true);
  assert.equal(e.find((v) => v.id === 'erba').cosa, false);
  // e chi non ha cima/lato usa il suo colore invece di restare senza icona
  assert.equal(e.find((v) => v.id === 'gatto').cima, 0xf3a94a);
});

test('le categorie escono nell\'ordine in cui compaiono, senza la mano vuota', () => {
  const e = voci({ categorie: CATEGORIE, blocchi: BLOCCHI, catalogo: {} });
  const c = categorieDi(e);
  assert.deepEqual(c.map((x) => x.id), ['naturali', 'luci', 'cose', 'altro']);
  assert.ok(!c.some((x) => x.id === 'mano'));
});

test('il filtro: per categoria, per testo, e la mano vuota resta sempre', () => {
  const e = voci({ categorie: CATEGORIE, blocchi: BLOCCHI, catalogo: {} });
  const luci = filtra(e, 'luci', '');
  assert.deepEqual(luci.map((v) => v.id), [null, 'lucciola']);

  assert.deepEqual(filtra(e, null, 'gatt').map((v) => v.id), ['gatto']);
  assert.deepEqual(filtra(e, null, 'ERBA').map((v) => v.id), ['erba'], 'il filtro non deve badare alle maiuscole');
  // ⚠ si cerca anche per id, non solo per nome: chi legge il codice conosce
  // «lanaRossa», chi legge lo schermo conosce «Lana rossa»
  assert.deepEqual(filtra(e, null, 'lucciol').map((v) => v.id), ['lucciola']);
  assert.equal(filtra(e, null, 'niente-del-genere').length, 0);
  assert.equal(MANO_VUOTA.id, null);
});

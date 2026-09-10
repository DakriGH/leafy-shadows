// IL RITMO: la media non è il ritmo, e queste prove esistono per dirlo.
//
// ⚠ La prova che conta è la PRIMA: due sequenze con la STESSA media, una liscia
// e una che singhiozza, devono dare due voti diversi. Se non li dessero, tutto
// il banco misurerebbe una cosa sola — «quanti» — e il committente ha chiesto
// esplicitamente anche l'altra («raggiungere il massimo degli fps E framepacing»).
import test from 'node:test';
import assert from 'node:assert/strict';
import { Ritmo, voto } from '../src/partita/ritmo.js';

/** Riempie un Ritmo con una serie. */
function con(serie) { const r = new Ritmo(); for (const v of serie) r.campiona(v); return r; }

/** 60 Hz lisci. */
function liscio(n = 300, ms = 16.7) { return Array.from({ length: n }, () => ms); }

/** 60 Hz che ogni `ogni` fotogrammi salta: stessa MEDIA, ritmo diverso. */
function aScatti(n = 300, ogni = 20) {
  // il fotogramma lungo vale il doppio, e i successivi si accorciano per
  // tenere la media identica: così la differenza NON può venire dalla media
  const out = [];
  for (let i = 0; i < n; i++) out.push(i % ogni === 0 ? 33.4 : 16.7 - 16.7 / (ogni - 1));
  return out;
}

test('due serie con la stessa media danno voti diversi: il ritmo non è la media', () => {
  const a = con(liscio()).misura();
  const b = con(aScatti()).misura();
  assert.ok(Math.abs(a.media - b.media) < 0.5, `le due medie devono essere quasi uguali (${a.media.toFixed(2)} vs ${b.media.toFixed(2)})`);
  assert.ok(a.scarto < b.scarto, 'la serie a scatti deve avere lo scarto più alto');
  assert.equal(a.singhiozzi, 0, 'la serie liscia non deve avere singhiozzi');
  assert.ok(b.singhiozzi > 10, `la serie a scatti deve avere singhiozzi (ne ha ${b.singhiozzi})`);
  const va = voto(a), vb = voto(b);
  assert.ok(va.punti > vb.punti + 15,
    `⚠ SE QUESTA CADE il banco non misura il framepacing: liscia ${va.punti}, a scatti ${vb.punti}`);
});

test('e il voto dice QUALE delle due comanda', () => {
  // tanti fotogrammi ma irregolari: il collo è il ritmo
  const scatti = voto(con(aScatti()).misura());
  assert.equal(scatti.collo, 'ritmo');
  // pochi fotogrammi ma regolarissimi: il collo sono i fotogrammi
  const lento = voto(con(liscio(300, 50)).misura());
  assert.equal(lento.collo, 'quanti');
});

test('«agganciato allo schermo» si riconosce, ed è un AVVISO non una lode', () => {
  // ⚠ Incollati al vsync il p50 è il pannello, non il motore: leggerlo come
  // «va benissimo» è l'errore che in questo progetto è già costato una giornata.
  assert.equal(con(liscio()).misura().regolare, true);
  // una macchina in affanno consegna tempi sparsi: non è agganciata
  const sparso = [];
  for (let i = 0; i < 300; i++) sparso.push(20 + (i * 7919 % 23));
  assert.equal(con(sparso).misura().regolare, false);
});

test('sotto i trenta fotogrammi non si misura: si dice che non si sa', () => {
  // ⚠ Un ritmo su dieci fotogrammi è rumore, e un numero inventato è peggio di
  // un buco: manda a cercare dalla parte sbagliata con l'aria di aiutare.
  assert.equal(con(liscio(10)).misura(), null);
  assert.equal(voto(null).punti, 0);
});

test('i fotogrammi assurdi si scartano: una scheda in secondo piano non è una misura', () => {
  const r = con(liscio(100));
  const prima = r.misura().p50;
  r.campiona(60000);   // la scheda è tornata in primo piano dopo un minuto
  r.campiona(-3);
  assert.equal(r.misura().p50, prima, 'un fotogramma da un minuto non deve entrare nella misura');
});

test('il buffer è circolare e gli scarti non inventano un salto quando si richiude', () => {
  // ⚠ Ricavare gli scarti da un anello già riordinato darebbe un salto FINTO nel
  // punto della richiusura: per questo si tengono man mano.
  const r = new Ritmo({ tetto: 50 });
  for (const v of liscio(400)) r.campiona(v);
  const m = r.misura();
  assert.equal(m.n, 50);
  assert.equal(m.singhiozzi, 0, 'un buffer che si richiude non deve inventare singhiozzi');
  assert.ok(m.scarto < 0.001);
});

test('il «passo» è la fetta che va liscia, e crolla anche a media alta', () => {
  // metà fotogrammi velocissimi e metà lentissimi: media buona, passo pessimo
  const alterno = [];
  for (let i = 0; i < 300; i++) alterno.push(i % 2 ? 5 : 28);
  const m = con(alterno).misura();
  assert.ok(m.fps > 55, `la media deve restare alta (${m.fps.toFixed(0)} fps)`);
  assert.ok(m.liscezza < 0.05, `la liscezza deve crollare (${m.liscezza.toFixed(2)})`);
  assert.ok(voto(m).punti < 30, 'e il voto deve dire che non va');
});

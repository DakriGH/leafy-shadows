// IL MISURATORE SI PROVA PRIMA DI CREDERGLI — la regola di tutta la fase R1:
// uno strumento che mente è peggio di uno che manca (CLAUDE.md, «lo strumento
// che mentiva»). Qui si inchiodano i casi in cui un percentile scritto male
// darebbe rapporti tranquillizzanti su un gioco che singhiozza.

import test from 'node:test';
import assert from 'node:assert/strict';
import { statistiche, quadro, confronto } from '../src/gioco/misure.js';

test('il p99 becca lo scatto che la media nasconde', () => {
  // 299 fotogrammi da 7 ms e UNO da 80: l'occhio lo sente, la media no
  const tempi = Array(299).fill(7);
  tempi.push(80);
  const s = statistiche(tempi);
  assert.equal(s.p50, 7);
  assert.ok(s.media < 7.5, 'la media dice «tutto bene»…');
  assert.equal(s.max, 80, '…il max no');
  assert.ok(s.p99 >= 7, 'e il p99 sta fra i due');
});

test('p99 e max sono numeri DIVERSI, non lo stesso indice', () => {
  // ⚠ il difetto classico: floor(n*0.99) senza clamp che scivola sull'ultimo.
  // Con 300 campioni [0..299], p99 = indice 297, max = 299.
  const tempi = Array.from({ length: 300 }, (_, i) => i);
  const s = statistiche(tempi);
  assert.equal(s.max, 299);
  assert.equal(s.p99, 297, 'il p99 non deve essere il max travestito');
});

test('una serie vuota non inventa numeri', () => {
  assert.equal(statistiche([]), null);
  assert.equal(statistiche(null), null);
});

test('il quadro scarta i campioni senza numero invece di avvelenarli', () => {
  const q = quadro([
    { ms: 7, disegni: 100 },
    { ms: 8, disegni: NaN },       // il contatore non era pronto
    { ms: 9 },                     // campo assente
  ]);
  assert.equal(q.fotogramma.quanti, 3);
  assert.equal(q.disegni.quanti, 1, 'i NaN e gli assenti non entrano');
});

test('il confronto smaschera il costo SPOSTATO, non solo quello tolto', () => {
  // prima: p50 10, p99 12 — dopo: p50 8 ma p99 30 (l'ottimizzazione che
  // accumula lavoro e lo paga a raffiche)
  const prima = quadro(Array.from({ length: 100 }, (_, i) => ({ ms: i < 99 ? 10 : 12 })));
  const dopo = quadro(Array.from({ length: 100 }, (_, i) => ({ ms: i < 99 ? 8 : 30 })));
  const c = confronto(prima, dopo);
  assert.ok(c.fotogramma.p50.guadagnoMs > 0, 'il p50 migliora…');
  assert.ok(c.fotogramma.p99.guadagnoMs < 0, '…e il p99 peggiora: si deve VEDERE');
});

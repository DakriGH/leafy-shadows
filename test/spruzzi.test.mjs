// GLI SPRUZZI SI DECIDONO CON I NUMERI, e i numeri si provano qui.
//
// ⚠ Il difetto che questa prova esiste per prendere non è «non si vedono»:
// quello si nota subito. È il contrario — se ne accendono TROPPI. Una cascata
// larga sei celle produce sei impatti dal mesher, e senza raggruppamento
// diventerebbero sei sistemi di particelle affiancati: costo per sei e un
// effetto peggiore (sei fontanelle invece di un fronte). A schermo si legge
// come «le particelle sono un po' troppe», che è esattamente il genere di cosa
// che si tollera per mesi senza cercarne la causa.

import test from 'node:test';
import assert from 'node:assert/strict';
import { raggruppa, pianoSpruzzi, SOGLIA_SCHIUMA, SOGLIA_VELO } from '../src/gioco/spruzzi.js';

/** Un impatto come lo scrive il mesher. */
const imp = (x, z, h, ys = 8.9) => ({ x, y: ys + h, z, ys, h });

test('le celle contigue di una cascata sola fanno UN gruppo', () => {
  const g = raggruppa([imp(10, 5, 6), imp(11, 5, 6), imp(12, 5, 6)]);
  assert.equal(g.length, 1, 'tre celle in fila sono una cascata');
  assert.equal(g[0].celle, 3);
  assert.equal(g[0].fronte, 3, 'il fronte è il lato lungo');
  assert.equal(g[0].x, 11, 'il centro sta in mezzo');
});

test('due cascate lontane restano due', () => {
  const g = raggruppa([imp(3, 3, 4), imp(20, 18, 7)]);
  assert.equal(g.length, 2);
});

test('due cascate che sbattono a quote diverse non si fondono', () => {
  // stesse celle in pianta, due terrazze: è un dirupo a gradoni, non una cascata
  const g = raggruppa([imp(5, 5, 4, 9), imp(5, 6, 4, 13)]);
  assert.equal(g.length, 2, 'la quota d\'arrivo separa i gruppi');
});

test('l\'altezza del gruppo è la MASSIMA delle sue celle', () => {
  const g = raggruppa([imp(4, 4, 3), imp(5, 4, 9)]);
  assert.equal(g[0].alta, 9);
});

test('sotto i tre blocchi non si accende niente', () => {
  for (const h of [1, 2]) {
    assert.deepEqual(pianoSpruzzi([imp(6, 6, h)]), [], `un salto da ${h} non schizza`);
  }
  assert.ok(pianoSpruzzi([imp(6, 6, SOGLIA_SCHIUMA)]).length > 0, 'a tre sì');
});

test('il velo arriva solo dai sei blocchi', () => {
  const corta = pianoSpruzzi([imp(6, 6, SOGLIA_VELO - 1)]).map((v) => v.effetto);
  const alta = pianoSpruzzi([imp(6, 6, SOGLIA_VELO)]).map((v) => v.effetto);
  assert.ok(!corta.includes('velo'), 'a cinque blocchi niente velo');
  assert.ok(alta.includes('velo'), 'a sei sì');
  assert.ok(corta.includes('spruzzo') && corta.includes('bolle'), 'ma spruzzo e bolle ci sono già');
});

test('il fronte largo allarga lo spruzzo invece di moltiplicarlo', () => {
  const stretta = pianoSpruzzi([imp(6, 6, 8)]);
  const larga = pianoSpruzzi([imp(4, 6, 8), imp(5, 6, 8), imp(6, 6, 8), imp(7, 6, 8), imp(8, 6, 8), imp(9, 6, 8)]);
  const spruzzoStretto = stretta.find((v) => v.effetto === 'spruzzo');
  const spruzzoLargo = larga.find((v) => v.effetto === 'spruzzo');
  assert.equal(larga.filter((v) => v.effetto === 'spruzzo').length, 1, 'sei celle, UN sistema');
  assert.ok(spruzzoLargo.ritocchi.forma.raggio > spruzzoStretto.ritocchi.forma.raggio * 2,
    'ma il suo fronte è molto più largo');
  assert.ok(spruzzoLargo.ritocchi.ritmo > spruzzoStretto.ritocchi.ritmo, 'e ne emette di più');
});

test('il tetto tiene le cascate PIÙ ALTE, non le prime che capitano', () => {
  const molte = [];
  for (let i = 0; i < 20; i++) molte.push(imp(i * 3, 0, 3 + i));
  const piano = pianoSpruzzi(molte, { max: 4 });
  const altezze = piano.filter((v) => v.effetto === 'spruzzo').map((v) => v.alta);
  assert.equal(altezze.length, 4, 'il tetto vale');
  assert.deepEqual(altezze, [22, 21, 20, 19], 'e tiene le più alte');
});

test('lo spruzzo sta DOVE SBATTE, non in cima alla colonna', () => {
  // ⚠ È la distinzione che il mesher documenta fra `y` e `ys`, e confonderle
  // metteva l'anello di schiuma in cima alla cascata.
  const piano = pianoSpruzzi([imp(6, 6, 9, 8.9)]);
  const spruzzo = piano.find((v) => v.effetto === 'spruzzo');
  assert.equal(spruzzo.y, 8.9, 'la quota è quella della pozza');
});

test('le bolle nascono SOTTO il pelo', () => {
  const piano = pianoSpruzzi([imp(6, 6, 7, 10)]);
  const bolle = piano.find((v) => v.effetto === 'bolle');
  assert.ok(bolle.y < 10, 'se nascessero sopra sarebbero spruzzi lenti');
});

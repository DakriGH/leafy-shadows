// IL COLPETTO SI PROVA IN NODE, perché è una curva nel tempo — e una curva nel
// tempo guardata a schermo è l'unica cosa che non si può giudicare a occhio:
// dura duecento millisecondi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { scalaColpetto, inCorso, DURATA, GONFIO } from '../src/gioco/colpetto.js';

test('parte da 1, gonfia a metà, torna a 1', () => {
  assert.equal(scalaColpetto(0), 1);
  assert.ok(Math.abs(scalaColpetto(DURATA / 2) - (1 + GONFIO)) < 1e-9, 'il massimo sta a metà');
  assert.equal(scalaColpetto(DURATA), 1);
});

test('fuori dalla finestra vale ESATTAMENTE 1', () => {
  // ⚠ Non «circa 1»: chi lo applica confronta con 1 per sapere se c'è ancora
  // qualcosa da disegnare, e un 0,99999 lascerebbe l'animazione accesa per
  // sempre — una mesh ridisegnata a ogni fotogramma per non muoversi.
  assert.equal(scalaColpetto(-5), 1);
  assert.equal(scalaColpetto(0), 1);
  assert.equal(scalaColpetto(DURATA + 1), 1);
  assert.equal(scalaColpetto(99999), 1);
});

test('non si restringe mai: solo gonfia', () => {
  // un blocco che RIMPICCIOLISCE sembra che stia sprofondando, non che risponda
  for (let t = 0; t <= DURATA; t += 5) assert.ok(scalaColpetto(t) >= 1, 'a ' + t);
});

test('parte e finisce piano, non a scatto', () => {
  // ⚠ È LA RAGIONE DEL SENO: una rampa lineare avrebbe la stessa velocità al
  // primo millisecondo e a metà, e a schermo si legge come uno scatto. Qui la
  // velocità al bordo dev'essere molto minore che al quarto.
  const v = (t) => scalaColpetto(t + 1) - scalaColpetto(t);
  assert.ok(v(0) < v(DURATA / 4) / 3, 'deve partire molto più piano che a un quarto');
  assert.ok(Math.abs(v(DURATA - 2)) < Math.abs(v(DURATA / 4)) / 3, 'e finire piano');
});

test('«in corso» dice quando smettere di disegnare', () => {
  assert.equal(inCorso(0), false);
  assert.equal(inCorso(DURATA / 2), true);
  assert.equal(inCorso(DURATA), false);
});

test('è leggero: «leggermente», non un rimbalzo', () => {
  assert.ok(GONFIO > 0.05 && GONFIO < 0.35, 'un blocco che raddoppia sembra un difetto');
  assert.ok(DURATA >= 120 && DURATA <= 400, 'è una risposta, non un\'animazione');
});

// IL PASSEGGERO SI PROVA IN NODE, e questo è il confine che funziona.
//
// Camminare su una griglia di cubi è aritmetica: non serve una GPU per sapere
// se il personaggio si posa, se sale uno scalino, se attraversa un muro. Ogni
// difetto qui sotto l'ho già fatto una volta.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Passeggero } from '../src/gioco/passeggero.js';
import { Mondo } from '../src/world/world.js';

function terreno(quota = 6, raggio = 12) {
  const m = new Mondo();
  for (let x = -raggio; x <= raggio; x++) for (let z = -raggio; z <= raggio; z++) m.metti(x, quota, z, 'terra', true);
  return m;
}
const fermo = { avanti: 0, destra: 0, salta: false };
const giri = (p, n, m, intento = fermo) => { for (let i = 0; i < n; i++) p.aggiorna(1 / 60, intento, 0); return p; };

test('SI POSA, e ci resta: niente rimbalzo fra due quote', () => {
  // ⚠ È IL DIFETTO CHE HO FATTO. Con la sonda dei piedi dentro il corpo, il
  // personaggio atterrava a quota 7, al giro dopo la sonda finiva in aria e
  // ricadeva: oscillava per sempre senza mai toccare terra.
  const m = terreno(6);
  const p = new Passeggero(m, { x: 0.5, y: 10, z: 0.5 });
  giri(p, 200, m);
  assert.ok(p.aTerra, 'non si è mai posato');
  assert.equal(+p.y.toFixed(3), 7, `si è fermato a ${p.y}, non sulla faccia del blocco`);
  const quota = p.y;
  giri(p, 60, m);
  assert.equal(p.y, quota, 'la quota cambia da ferma: sta rimbalzando');
});

test('NON ATTRAVERSA UN MURO', () => {
  const m = terreno(6);
  for (let z = -12; z <= 12; z++) { m.metti(3, 7, z, 'terra', true); m.metti(3, 8, z, 'terra', true); }
  const p = new Passeggero(m, { x: 0.5, y: 10, z: 0.5 });
  giri(p, 120, m);
  giri(p, 200, m, { avanti: 0, destra: 1, salta: false });
  assert.ok(p.x < 3, `è finito a x=${p.x.toFixed(2)}: ha attraversato il muro a x=3`);
});

test('SALE UNO SCALINO DI UN BLOCCO senza saltare', () => {
  const m = terreno(6);
  // ⚠ UN RIALZO, NON UNA COLONNA SOLA: con un blocco singolo il personaggio ci
  // sale e ci ripassa sopra, e il test lo trovava a quota 7 dall'altra parte —
  // cioè lo trovava mentre faceva la cosa giusta.
  for (let x = 3; x <= 12; x++) for (let z = -12; z <= 12; z++) m.metti(x, 7, z, 'terra', true);
  const p = new Passeggero(m, { x: 0.5, y: 10, z: 0.5 });
  giri(p, 120, m);
  // ⚠ NOVANTA GIRI, NON DUECENTOQUARANTA: a 4,6 blocchi al secondo, quattro
  // secondi sono diciotto blocchi — cioè fuori dalla piattaforma di prova, e il
  // test falliva perché il personaggio cadeva nel vuoto DOPO aver fatto la cosa
  // giusta. Un test che misura più di quello che vuole misurare mente.
  giri(p, 90, m, { avanti: 0, destra: 1, salta: false });
  assert.ok(p.x > 3, `è rimasto a x=${p.x.toFixed(2)}: non ha salito lo scalino`);
  assert.equal(+p.y.toFixed(3), 8, `è a quota ${p.y}, non sopra il gradino`);
});

test('IL SALTO ARRIVA SOPRA UN BLOCCO, e nemmeno troppo', () => {
  // ⚠ la gravità è tarata su questo: un salto deve superare un blocco, se no il
  // mondo diventa impraticabile, e non deve superarne tre, se no non è Leafy.
  const m = terreno(6);
  const p = new Passeggero(m, { x: 0.5, y: 10, z: 0.5 });
  giri(p, 200, m);
  const base = p.y;
  let alto = base;
  for (let i = 0; i < 120; i++) { p.aggiorna(1 / 60, { avanti: 0, destra: 0, salta: i < 4 }, 0); alto = Math.max(alto, p.y); }
  const salto = alto - base;
  assert.ok(salto > 1.05, `salta ${salto.toFixed(2)} blocchi: non supera un cubo`);
  assert.ok(salto < 2.4, `salta ${salto.toFixed(2)} blocchi: sembra la luna`);
});

test('UN FOTOGRAMMA LUNGO NON LO TELETRASPORTA sotto il terreno', () => {
  const m = terreno(6);
  const p = new Passeggero(m, { x: 0.5, y: 40, z: 0.5 });
  // mezzo secondo in un colpo: succede quando la scheda torna in primo piano
  for (let i = 0; i < 40; i++) p.aggiorna(0.5, fermo, 0);
  assert.ok(p.y >= 7, `è finito a quota ${p.y.toFixed(2)}: è passato attraverso il mondo`);
});

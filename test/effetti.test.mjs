// IL COLPETTO SI PROVA IN NODE, perché è una curva nel tempo — e una curva nel
// tempo guardata a schermo è l'unica cosa che non si può giudicare a occhio:
// dura duecento millisecondi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { scalaColpetto, inCorso, DURATA, GONFIO,
         scalaPosa, DURATA_POSA, scalaDanno, tremolio } from '../src/gioco/effetti.js';

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

test('la posa ATTERRA: parte sopra la misura e ci si assesta', () => {
  // ⚠ SOPRA L'UNO, non sotto: chi disegna è una copia del blocco, e una copia
  // più piccola finisce DENTRO il blocco vero — cioè non si vede niente.
  assert.ok(scalaPosa(0) > 1.1, 'deve partire visibilmente più grande');
  assert.equal(scalaPosa(DURATA_POSA), 1, 'e finire esattamente alla misura');
  assert.equal(scalaPosa(DURATA_POSA * 3), 1, 'e restarci');
});

test('la posa scende e basta: non rimbalza', () => {
  let prima = Infinity;
  for (let t = 0; t <= DURATA_POSA; t += 2) {
    const v = scalaPosa(t);
    assert.ok(v <= prima + 1e-9, `risale a ${t} ms`);
    prima = v;
  }
});

test('la posa parte veloce e finisce piano', () => {
  // ⚠ È QUELLO CHE SI LEGGE COME PESO: la fine lenta è l'assestamento. Con la
  // velocità costante sembra una dissolvenza, non un atterraggio.
  const d = (t) => scalaPosa(t) - scalaPosa(t + 4);
  assert.ok(d(0) > d(DURATA_POSA - 10) * 3, 'la prima metà deve correre');
});

test('il danno GONFIA, e non parte mai da uno esatto', () => {
  // ⚠ A UNO ESATTO le due superfici si contendono i pixel e si vede uno
  // sfarfallio: un difetto, non un effetto.
  assert.ok(scalaDanno(0) > 1.005, 'staccato dal blocco fin da subito');
  assert.ok(scalaDanno(1) > scalaDanno(0), 'e cresce col danno');
  assert.ok(scalaDanno(1) < 1.2, 'ma resta un blocco, non un pallone');
  for (let p = 0; p <= 1; p += 0.05) assert.ok(scalaDanno(p) >= scalaDanno(Math.max(0, p - 0.05)) - 1e-9);
});

test('il tremolio cresce col danno, e a zero non c\'è', () => {
  // ⚠ È QUELLO CHE DICE QUANTO MANCA senza una barra — che in un diorama
  // sarebbe l'unico pezzo di interfaccia dentro il mondo.
  const fermo = tremolio(0, 1234);
  assert.equal(Math.abs(fermo.x) + Math.abs(fermo.y) + Math.abs(fermo.z), 0);
  const ampiezza = (p) => { let m = 0;
    for (let t = 0; t < 400; t += 3) { const s = tremolio(p, t); m = Math.max(m, Math.abs(s.x), Math.abs(s.y), Math.abs(s.z)); }
    return m; };
  assert.ok(ampiezza(1) > ampiezza(0.5), 'all\'ultimo colpo trema più che a metà');
  assert.ok(ampiezza(1) < 0.06, 'ma resta un tremolio, non un terremoto');
});

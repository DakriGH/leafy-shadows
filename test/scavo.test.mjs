// LO SCAVO SI PROVA IN NODE, ed è l'unico modo di provare una cosa che dipende
// dal TEMPO senza stare a guardare uno schermo per un minuto e mezzo.
//
// ⚠ Committente: «la distruzione non deve essere mai istantanea, devi tenere
// premuto da touchscreen e da mobile come su Minecraft».
import test from 'node:test';
import assert from 'node:assert/strict';
import { Scavo, durataPer, DURATA, SCHEGGE_OGNI } from '../src/gioco/scavo.js';
import { defDi } from '../src/world/blocks.js';

test('tenendo premuto si arriva in fondo, e non prima', () => {
  const s = new Scavo();
  s.premi('a', 500, 1000);
  assert.equal(s.finito(1000), false, 'appena premuto non è rotto');
  assert.equal(s.finito(1400), false, 'a otto decimi nemmeno');
  assert.equal(s.finito(1500), true, 'alla scadenza sì');
});

test('un solo tocco non rompe NIENTE', () => {
  // ⚠ È LA RICHIESTA, alla lettera: «non deve essere mai istantanea».
  const s = new Scavo();
  s.premi('a', 380, 1000);          // il blocco più tenero che c'è
  s.molla();
  assert.equal(s.progresso(1016), 0, 'mollato subito, non è successo niente');
  assert.equal(s.finito(9999), false);
});

test('il progresso scorre col tempo, non coi fotogrammi', () => {
  // ⚠ A 144 Hz e a 20 fps un blocco deve volerci LO STESSO. Se contassimo i
  // giri, su un telefono lento tutto diventerebbe tre volte più duro.
  const veloce = new Scavo(); veloce.premi('a', 600, 0);
  const lento = new Scavo(); lento.premi('a', 600, 0);
  for (let t = 0; t <= 300; t += 1000 / 144) veloce.premi('a', 600, t);   // tanti giri
  for (let t = 0; t <= 300; t += 1000 / 20) lento.premi('a', 600, t);     // pochi giri
  assert.equal(veloce.progresso(300).toFixed(3), lento.progresso(300).toFixed(3));
  assert.equal(veloce.progresso(300), 0.5);
});

test('mollare azzera: non si consuma un muro a spizzichi', () => {
  const s = new Scavo();
  s.premi('a', 600, 0);
  assert.equal(s.progresso(300), 0.5);
  s.molla();
  assert.equal(s.progresso(300), 0);
  s.premi('a', 600, 400);
  assert.equal(s.progresso(400), 0, 'si ricomincia da capo');
});

test('cambiare bersaglio ricomincia da zero', () => {
  const s = new Scavo();
  s.premi('a', 600, 0);
  assert.equal(s.progresso(400), 400 / 600);
  s.premi('b', 600, 400);
  assert.equal(s.progresso(400), 0);
  assert.equal(s.dove, 'b');
});

test('restare premuti sullo stesso NON riavvia', () => {
  // ⚠ `premi` si chiama a OGNI fotogramma: se riavviasse ogni volta, il
  // progresso resterebbe a zero per sempre e il blocco non cederebbe mai.
  const s = new Scavo();
  for (let t = 0; t <= 500; t += 16) s.premi('a', 600, t);
  assert.ok(s.progresso(500) > 0.8, 'il cronometro deve essere partito una volta sola');
});

test('rompendolo si smette di scavare da soli', () => {
  const s = new Scavo();
  s.premi('a', 300, 0);
  assert.equal(s.finito(300), true);
  assert.equal(s.dove, null, 'se no il blocco dietro si romperebbe di seguito');
  assert.equal(s.progresso(400), 0);
});

test('le schegge saltano a tempo, non a fotogrammi', () => {
  // ⚠ A 144 Hz uscirebbero sette volte più pezzetti che a 20: lo stesso gesto
  // darebbe due effetti diversi secondo la macchina.
  const s = new Scavo();
  s.premi('a', 2000, 0);
  let quante = 0;
  for (let t = 0; t <= 1000; t += 1000 / 144) if (s.schegge(t)) quante++;
  const atteso = Math.floor(1000 / SCHEGGE_OGNI);
  assert.ok(Math.abs(quante - atteso) <= 1, `${quante} manciate invece di ~${atteso}`);
  // e a venti fotogrammi al secondo il conto è lo stesso, non un settimo
  const s2 = new Scavo(); s2.premi('a', 2000, 0);
  let q2 = 0;
  for (let t = 0; t <= 1000; t += 1000 / 20) if (s2.schegge(t)) q2++;
  assert.ok(Math.abs(q2 - atteso) <= 2, `a 20 fps ${q2} invece di ~${atteso}`);
});

test('senza bersaglio non succede niente', () => {
  const s = new Scavo();
  assert.equal(s.progresso(1000), 0);
  assert.equal(s.finito(1000), false);
  assert.equal(s.schegge(1000), false);
});

test('un blocco duro ci mette più di uno tenero', () => {
  const duro = durataPer(defDi('cristallo'));
  const pietra = durataPer(defDi('pietra'));
  const terra = durataPer(defDi('terra'));
  assert.ok(duro > pietra, `cristallo ${duro} > pietra ${pietra}`);
  assert.ok(pietra > terra, `pietra ${pietra} > terra ${terra}`);
});

test('ma la scala resta corta: si costruisce, non si sopravvive', () => {
  // ⚠ `salute` in blocks.js arriva a 100 e NON è un tempo: usarla come
  // millisecondi darebbe blocchi da un decimo di secondo e blocchi da dieci.
  for (const t of ['erba', 'terra', 'pietra', 'roccia', 'cristallo', 'mattoni', 'legno', 'sabbia']) {
    const d = durataPer(defDi(t));
    assert.ok(d >= 250 && d <= 1400, `${t} vuole ${d} ms`);
  }
  assert.ok(durataPer(null) === DURATA, 'e senza definizione si usa il valore normale');
});

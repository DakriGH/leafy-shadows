// LE SCHEGGE SI PROVANO IN NODE — è fisica, e la fisica si misura.
//
// ⚠ Committente: «devi cliccare più volte per distruggere lo stesso
// blocco/furniture, fallo capire con degli effetti» e «manca proprio
// l'animazione di distruzione di tutto». Queste sono quegli effetti.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Schegge, MAX, PER_COLPO, PER_ROTTURA } from '../src/gioco/schegge.js';

const CENTRO = { x: 4.5, y: 7.5, z: -2.5 };
const VERDE = [[0.2, 0.7, 0.3], [0.3, 0.8, 0.4]];
const passi = (s, quanti, dt = 1 / 60) => { for (let i = 0; i < quanti; i++) s.aggiorna(dt); };

test('un colpo ne fa saltare via qualcuna, e sono lì attorno', () => {
  const s = new Schegge();
  s.scoppia(CENTRO, VERDE, PER_COLPO);
  assert.equal(s.quante, PER_COLPO);
  for (const p of s.vive) {
    assert.ok(Math.abs(p.x - CENTRO.x) <= 0.5, 'nascono dentro la cella, non nel suo centro');
    assert.ok(Math.abs(p.y - CENTRO.y) <= 0.5);
  }
  // ⚠ E NON TUTTE NELLO STESSO PUNTO: tutte dal centro sarebbe una fontana.
  const distinte = new Set(s.vive.map((p) => p.x.toFixed(4)));
  assert.ok(distinte.size > 1, 'devono nascere sparse');
});

test('saltano in SU e poi ricadono', () => {
  // ⚠ SEMPRE UN PO' VERSO L'ALTO: senza, i pezzi strisciano per terra e si
  // legge come una macchia che scivola, non come un blocco che si sbriciola.
  const s = new Schegge();
  s.scoppia(CENTRO, VERDE, 12);
  for (const p of s.vive) assert.ok(p.vy > 0, 'nessuna deve partire verso il basso');
  const y0 = s.vive.map((p) => p.y);
  passi(s, 3);
  assert.ok(s.vive.some((p, i) => p.y > y0[i]), 'nei primi fotogrammi salgono');
  const sopra = new Schegge();
  sopra.scoppia(CENTRO, VERDE, 12);
  passi(sopra, 25);
  const scese = sopra.vive.filter((p) => p.vy < 0).length;
  assert.ok(scese > 0, 'e poi la gravità le riprende');
});

test('la faccia colpita le spinge fuori da quella parte', () => {
  const a = new Schegge(); a.scoppia(CENTRO, VERDE, 24, { x: 1, y: 0, z: 0 });
  const b = new Schegge(); b.scoppia(CENTRO, VERDE, 24, { x: -1, y: 0, z: 0 });
  const media = (s) => s.vive.reduce((t, p) => t + p.vx, 0) / s.quante;
  assert.ok(media(a) > 1, 'verso +x');
  assert.ok(media(b) < -1, 'verso -x');
});

test('si spengono da sole, e in fretta', () => {
  const s = new Schegge();
  s.scoppia(CENTRO, VERDE, PER_ROTTURA);
  passi(s, 60);                       // un secondo
  assert.equal(s.quante, 0, 'dopo un secondo il cielo deve essere pulito');
});

test('spariscono RIMPICCIOLENDO, non restando puntini', () => {
  // ⚠ È la ragione per cui non serve la trasparenza: il materiale del mondo è
  // opaco, e una scheggia che svanisse in dissolvenza vorrebbe dire un secondo
  // materiale e l'ordinamento per profondità. A zero non si vede uguale.
  const s = new Schegge();
  s.scoppia(CENTRO, VERDE, 1);
  const p = s.vive[0];
  const t0 = Schegge.taglia(p);
  p.t = p.durata * 0.5;
  const t1 = Schegge.taglia(p);
  p.t = p.durata;
  assert.ok(t1 < t0 * 0.8, 'a metà vita è già molto più piccola');
  assert.equal(Schegge.taglia(p), 0, 'e alla fine è nulla');
});

test('il tetto taglia le VECCHIE, non le nuove', () => {
  // ⚠ SE TAGLIASSE LE NUOVE, un colpo dato mentre il cielo è pieno di pezzi non
  // farebbe niente: il gioco smetterebbe di rispondere proprio mentre ci si sta
  // dando da fare, che è il momento peggiore.
  const s = new Schegge(20);
  for (let i = 0; i < 10; i++) s.scoppia(CENTRO, VERDE, 8);
  assert.equal(s.quante, 20);
  const ultime = new Schegge(20);
  ultime.scoppia(CENTRO, VERDE, 8);
  const primeOtto = ultime.vive.map((p) => p.taglia);
  const pieno = new Schegge(20);
  for (let i = 0; i < 3; i++) pieno.scoppia(CENTRO, VERDE, 8);
  assert.equal(pieno.quante, 20, 'il tetto tiene');
  assert.ok(!primeOtto.every((t, i) => pieno.vive[i] && pieno.vive[i].taglia === t),
    'le prime otto non devono essere più in cima alla lista');
});

test('prende i colori del blocco, non un colore suo', () => {
  const s = new Schegge();
  s.scoppia(CENTRO, [[1, 0, 0]], 10);
  for (const p of s.vive) assert.deepEqual([p.r, p.g, p.b], [1, 0, 0]);
});

test('scrive cubetti veri, dentro lo spazio allocato', () => {
  const s = new Schegge();
  s.scoppia(CENTRO, VERDE, PER_ROTTURA);
  const n = Schegge.vertici();
  const pos = new Float32Array(n * 3), col = new Float32Array(n * 3);
  const v = s.scriviIn(pos, col);
  assert.equal(v, PER_ROTTURA * 36, '36 vertici per cubetto');
  assert.ok(v <= n, 'e mai oltre lo spazio allocato');
  // i vertici stanno attorno alla cella, non all'origine del mondo
  for (let i = 0; i < v; i++) assert.ok(Math.abs(pos[i * 3] - CENTRO.x) < 1.5);
});

test('un caso PREVEDIBILE: due scoppi uguali danno lo stesso risultato', () => {
  // ⚠ Non `Math.random`: un effetto che si comporta ogni volta diverso non si
  // può misurare, si può solo guardare. E guardare non è una prova.
  const a = new Schegge(); a.scoppia(CENTRO, VERDE, 6);
  const b = new Schegge(); b.scoppia(CENTRO, VERDE, 6);
  assert.deepEqual(a.vive.map((p) => p.x), b.vive.map((p) => p.x));
  // ma due scoppi di fila NON sono uguali fra loro, se no si vede la ripetizione
  const c = new Schegge(); c.scoppia(CENTRO, VERDE, 6); c.scoppia(CENTRO, VERDE, 6);
  assert.notDeepEqual(c.vive.slice(0, 6).map((p) => p.x), c.vive.slice(6).map((p) => p.x));
});

test('un fotogramma perso non le spara via', () => {
  // ⚠ IL PASSO SI TAGLIA: dopo uno scatto lungo `dt` può valere mezzo secondo, e
  // integrare mezzo secondo in un colpo solo manderebbe i pezzi a venti blocchi
  // di distanza — cioè l'effetto peggiore proprio nel fotogramma peggiore.
  const s = new Schegge();
  s.scoppia(CENTRO, VERDE, 8);
  s.aggiorna(0.5);
  for (const p of s.vive) assert.ok(Math.abs(p.x - CENTRO.x) < 2, 'restano in zona');
});

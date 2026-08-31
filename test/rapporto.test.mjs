// IL RAPPORTO DI DIAGNOSTICA SI PROVA, ed è il genere di cosa che nessuno prova
// perché «tanto è solo diagnostica».
//
// ⚠ È ESATTAMENTE PER QUESTO. Se un giorno smette di mettere dentro gli fps, il
// sintomo è che i rapporti continuano ad arrivare e sembrano a posto — solo che
// non c'è più il numero che serviva. Un difetto muto in uno strumento di
// misura è il peggiore che ci sia: fa sbagliare le diagnosi successive.
import test from 'node:test';
import assert from 'node:assert/strict';
import { costruisciRapporto, pesoKB, CAMPI_OBBLIGATORI, MAX_ERRORI } from '../src/ui/rapporto.js';

const LETTURE = {
  quando: '2026-08-28T10:00:00.000Z', mobile: true, tocco: true, modoGui: 'tocco',
  ua: 'Mozilla/5.0 (Linux; Android 14)', cpu: 8, memoriaGB: 4,
  css: [375, 812], reso: [562, 1218], dpr: 2,
  livello: 3, quantiLivelli: 7, manuale: false, profilo: { scala: 0.72, erba: 0.6 },
  fps: 21.4, p50: 46.72, p99: 132.5, disegni: 125, triangoli: 156703, ombreMs: 2.164,
  storiaFps: Array.from({ length: 200 }, (_, i) => 20 + (i % 5)),
  storiaLivelli: [0, 1, 2, 3],
  scheda: 'Mali-G610', software: false,
  chunk: 49, blocchi: 66890, luci: 13, decorazioni: 61, erba: 51955,
  ora: '10:25', giorno: 105, worldgenMs: 51.3, meshMs: 635.8,
  errori: ['boom'],
};

test('ci sono tutti i campi che servono', () => {
  const r = costruisciRapporto(LETTURE);
  for (const c of CAMPI_OBBLIGATORI) assert.ok(c in r, `manca «${c}»`);
  assert.equal(r.gioco, 'Leafy-Shadows');
});

test('i numeri che ho chiesto mille volte ci sono davvero', () => {
  // ⚠ QUESTI CINQUE sono quelli per cui finora chiedevo uno scatto dello
  // schermo: fps, i due millisecondi, i disegni e i triangoli. Se sparisce uno
  // di loro il rapporto è tornato inutile.
  const p = costruisciRapporto(LETTURE).prestazioni;
  for (const k of ['fps', 'p50ms', 'p99ms', 'disegni', 'triangoli', 'ombreMs']) {
    assert.ok(p[k] !== null && p[k] !== undefined, `manca prestazioni.${k}`);
  }
  assert.equal(p.fps, 21);
  assert.equal(p.p99ms, 132.5);
});

test('e il rapporto fra pixel resi e pixel a schermo, che è quello che confonde', () => {
  // ⚠ Distingue «l'immagine è sporca» da «l'immagine è INGRANDITA»: a occhio si
  // somigliano, e ci ho già perso un giro dietro a un'acne che non c'era.
  const s = costruisciRapporto(LETTURE).schermo;
  assert.equal(s.rapporto, 1.5);
  assert.deepEqual(s.css, [375, 812]);
  assert.deepEqual(s.reso, [562, 1218]);
});

test('LA CHIAVE NON ESCE MAI, in nessun campo', () => {
  // ⚠ È la prova che conta più di tutte: il gettone serve al collettore per
  // sapere che siamo noi, e non deve finire dentro la cosa che si spedisce — se
  // no basta leggere un rapporto per poterne mandare altri.
  const r = costruisciRapporto({ ...LETTURE, chiave: 'SEGRETO-123', token: 'SEGRETO-123', password: 'SEGRETO-123' });
  const testo = JSON.stringify(r);
  assert.equal(testo.includes('SEGRETO-123'), false, 'la chiave è finita nel rapporto');
  assert.equal(/chiave|token|password/i.test(testo), false, 'e nemmeno un campo che la ospiti');
});

test('la storia c\'è, ma non tutta', () => {
  // ⚠ LA STORIA VALE PIÙ DELL'ISTANTE: un p99 alto una volta è un caso, tre
  // gradini che scendono in un minuto sono un difetto. Ma duecento numeri in un
  // rapporto sono rumore.
  const p = costruisciRapporto(LETTURE).prestazioni;
  assert.equal(p.storiaFps.length, 60);
  assert.ok(p.storiaFps.every(Number.isInteger), 'arrotondati: i decimali qui non dicono niente');
});

test('gli errori si tagliano, e sono gli ULTIMI', () => {
  const errori = Array.from({ length: 40 }, (_, i) => 'errore ' + i);
  const r = costruisciRapporto({ ...LETTURE, errori });
  assert.equal(r.errori.length, MAX_ERRORI);
  assert.equal(r.errori[r.errori.length - 1], 'errore 39', 'gli ultimi, non i primi');
});

test('una riga lunghissima non fa esplodere il rapporto', () => {
  const r = costruisciRapporto({ ...LETTURE, errori: ['x'.repeat(50000)], ua: 'y'.repeat(9000), nota: 'z'.repeat(9000) });
  assert.ok(r.errori[0].length <= 500);
  assert.ok(r.dispositivo.ua.length <= 220);
  assert.ok(r.nota.length <= 400);
});

test('senza letture non esplode: esce un rapporto vuoto ma valido', () => {
  // ⚠ Serve: un rapporto lo si manda quando qualcosa non va, cioè proprio
  // quando può mancare qualunque pezzo.
  const r = costruisciRapporto();
  for (const c of CAMPI_OBBLIGATORI) assert.ok(c in r);
  assert.deepEqual(r.errori, []);
  assert.equal(r.prestazioni.fps, null);
});

test('si sa quanto pesa PRIMA di mandarlo', () => {
  // ⚠ Uno scatto a piena risoluzione da un telefono con dpr 3 sono megabyte, e
  // un rapporto che non parte è peggio di un rapporto senza figura.
  const senza = pesoKB(costruisciRapporto(LETTURE));
  const con = pesoKB(costruisciRapporto({ ...LETTURE, scatto: 'data:image/webp;base64,' + 'A'.repeat(300 * 1024) }));
  assert.ok(senza < 8, `un rapporto senza figura pesa ${senza} KB`);
  assert.ok(con > senza + 200, 'e con la figura si vede');
});

test('il rapporto dice DA QUALE BUILD arriva', () => {
  // ⚠ QUESTA PROVA NASCE DA UN ERRORE COSTATO DUE GIRI: il committente mandava
  // scatti da una pagina pubblicata ferma al giorno prima, e sia lui che io
  // leggevamo quei numeri come se fossero di adesso. Un rapporto che non dice
  // di quale versione parla non è una misura, è un aneddoto.
  const r = costruisciRapporto({ ...LETTURE, versione: '28/08, 21:48 · 1d29546+' });
  assert.equal(r.versione, '28/08, 21:48 · 1d29546+');
  // e in sviluppo lo dice, invece di lasciare un buco
  assert.equal(costruisciRapporto(LETTURE).versione, 'in sviluppo');
});

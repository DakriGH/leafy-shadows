// I LIVELLI DI DETTAGLIO DEI CHUNK: pieno vicino, pelle lontano, niente oltre.
//
// ⚠ È QUELLO CHE SLEGA LA DISTANZA DI RESA DAL COSTO, e i difetti che può
// introdurre sono tutti MUTI: un chunk lontano che non arriva si scambia per
// nebbia, una pelle che resta pelle quando ci si cammina sopra si scambia per
// «grafica bassa», una mesh mai scaricata si vede solo contando la memoria.
// Qui si contano i chunk e i vertici, non si guarda lo schermo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mesher, collegaFabbrica, Costruttore, costruisciPelle, livelloPer } from '../src/world/mesher.js';
import { Mondo, CHUNK } from '../src/world/world.js';

const vive = new Map();   // kc → vertici dei solidi, delle mesh VIVE
collegaFabbrica({
  materialeMondo: () => ({}), materialeAcqua: () => ({}),
  creaChunk: (kc) => ({ solidi: { kc, solidi: true }, acqua: { kc } }),
  scrivi: (mesh, dati) => { if (mesh && mesh.solidi) vive.set(mesh.kc, dati.pos.length / 3); },
  rimuoviChunk: (e) => { vive.delete(e.solidi.kc); },
  aggiornaCielo: () => {}, cambiaMateriale: () => {},
  colori: () => ({}), coloriCambiati: () => {},
  impostaVoxel: () => {}, spegniVoxel: () => {}, latoMassimoVoxel: () => 128,
  mondoVelato: () => false,
});

// un mondo a terrazze: erba su terra, con un gradino ogni otto colonne
// un mondo a terrazze: erba su terra. `mosso` = un gradino quasi a ogni colonna,
// che è il caso in cui il supercubo espone fianchi e smussi (il terreno vero);
// altrimenti un gradino ogni otto colonne (quasi pianura).
function mondoTerrazze(r = 80, mosso = false) {
  const m = new Mondo();
  for (let x = -r; x < r; x++) for (let z = -r; z < r; z++) {
    const h = mosso ? 5 + (((x * 7 + z * 3) % 5) + 5) % 5 : 5 + Math.floor((x + r) / 8) % 3;
    for (let y = h - 2; y < h; y++) m.metti(x, y, z, 'terra', true);
    m.metti(x, h, z, 'erba', true);
  }
  return m;
}
const svuota = (me, m, b, giri = 2000) => { for (let g = 0; g < giri && me.statistiche.inCoda > 0; g++) me.aggiorna(m, b); };

test('la pelle è geometria vera e molto più leggera del pieno', () => {
  const m = mondoTerrazze(24, true);
  const kc = '0,0';
  const pieno = new Costruttore(), pienoAcqua = new Costruttore();
  const me0 = new Mesher({}, m); me0.ricostruisciTutto(m);   // tutto pieno, senza raggi
  const verticiPieni = vive.get(kc);
  costruisciPelle(pieno, pienoAcqua, m, kc);
  const verticiPelle = pieno.pos.length / 3;
  assert.ok(verticiPelle > 0, 'la pelle non può essere vuota su un chunk pieno di terreno');
  // 256 cime × 2 tri × 3 vertici = 1536 di base, più le pareti dei gradini
  assert.ok(verticiPelle >= 256 * 6, `almeno una cima per colonna: ${verticiPelle}`);
  // misurato: 73.518 contro 4.680 sul terreno mosso, cioè quindici volte meno;
  // su una pianura il pieno è già leggero (solo cime) e il rapporto scende a 2,6
  assert.ok(verticiPelle * 8 < verticiPieni, `la pelle (${verticiPelle}) deve pesare meno di un ottavo del pieno (${verticiPieni})`);
  // e le cime d'erba restano marcate: la stagione le deve trovare
  assert.ok(pieno.erbe.length > 0, 'le cime d\'erba della pelle vanno marcate per la ritinta');
});

test('livelloPer: pieno vicino, pelle in mezzo, niente lontano, con isteresi', () => {
  const raggi = { resa: 100, pieno: 40 };
  assert.equal(livelloPer('0,0', 8, 8, raggi), 0, 'ci sto sopra: pieno');
  assert.equal(livelloPer('4,0', 0, 8, raggi), 1, 'a 64 blocchi: pelle');
  assert.equal(livelloPer('10,0', 0, 8, raggi), null, 'a 160: niente');
  // isteresi: chi è pieno resta pieno un chunk oltre il confine
  assert.equal(livelloPer('3,0', 0, 8, raggi, undefined), 1, 'nuovo a 48: pelle');
  assert.equal(livelloPer('3,0', 0, 8, raggi, 0), 0, 'ma se era pieno resta pieno fino a 56');
  assert.equal(livelloPer('7,0', 0, 8, raggi, 1), 1, 'una pelle a 112 resta viva fino a 116');
  assert.equal(livelloPer('8,0', 0, 8, raggi, 1), null, 'a 128 se ne va');
});

test('oltre la distanza di resa non si costruisce niente, e camminando arriva', () => {
  vive.clear();
  const m = mondoTerrazze(80), me = new Mesher({}, m);
  me.impostaRaggi({ resa: 48, pieno: 24 });
  const b = { x: 0.5, z: 0.5 };
  me.ricostruisciTutto(m, b);
  svuota(me, m, b);
  assert.ok(me.chunks.size < m.chunks.size, `con raggio 48 su un mondo di 160 non si costruisce tutto: ${me.chunks.size}/${m.chunks.size}`);
  assert.ok(me.chunks.size >= 25, `ma almeno il quadrato dei vicini sì: ${me.chunks.size}`);
  assert.ok(me.statistiche.pelli > 0, 'fra i costruiti ci sono delle pelli');
  assert.ok(me.statistiche.pelli < me.chunks.size, 'e dei pieni');
  // il chunk sotto i piedi è pieno, uno a quaranta blocchi è pelle
  assert.equal(me._livelli.get('0,0'), 0);
  assert.equal(me._livelli.get('2,0'), 1);
  // si cammina verso est di 60 blocchi (il mondo arriva a 80): i chunk a ovest
  // se ne vanno, quelli a est arrivano
  const prima = new Set(me.chunks.keys());
  const b2 = { x: 60.5, z: 0.5 };
  me.aggiorna(m, b2); svuota(me, m, b2);
  assert.ok(!me.chunks.has('-3,0'), 'il chunk lasciato indietro è stato scaricato');
  assert.ok(me.chunks.has('3,0'), 'il chunk davanti è stato costruito');
  assert.equal(me._livelli.get('3,0'), 0, 'ed è pieno, perché ci si sta sopra');
  // il chunk di partenza (0..16) sta ora a 44 blocchi: era pieno, e con
  // l'isteresi (24 + 16 = 40) è appena oltre → scende a pelle
  assert.equal(me._livelli.get('0,0'), 1, 'il chunk di partenza è sceso a pelle');
  assert.ok(vive.size === me.chunks.size, 'niente mesh vive senza chunk (perdita)');
  assert.ok([...prima].some((k) => !me.chunks.has(k)), 'qualcosa è uscito');
});

test('senza raggi si fa tutto pieno, come prima', () => {
  vive.clear();
  const m = mondoTerrazze(40), me = new Mesher({}, m);
  const b = { x: 0.5, z: 0.5 };
  me.ricostruisciTutto(m, b); svuota(me, m, b);
  assert.equal(me.chunks.size, m.chunks.size);
  assert.equal(me.statistiche.pelli, 0);
});

test('cambiare i raggi non rifà nulla in un colpo: mette in coda', () => {
  vive.clear();
  const m = mondoTerrazze(40), me = new Mesher({}, m);
  const b = { x: 0.5, z: 0.5 };
  me.ricostruisciTutto(m, b); svuota(me, m, b);
  me.impostaRaggi({ resa: 200, pieno: 16 });
  me.aggiorna(m, b);
  // il primo giro ne fa almeno uno (mai zero), il resto resta in coda
  assert.ok(me.statistiche.inCoda > 0, 'i chunk che diventano pelle sono in coda, non rifatti tutti insieme');
  svuota(me, m, b);
  assert.ok(me.statistiche.pelli > 0);
  assert.equal(me.chunks.size, m.chunks.size, 'a 200 di resa il mondo r40 c\'è tutto');
});

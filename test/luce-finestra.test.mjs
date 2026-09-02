// LA GRIGLIA DELLE LAMPADE CHE SEGUE CHI GUARDA: con lo streaming la griglia dei
// muri è una finestra attorno al bersaglio, si ricentra con isteresi, e i cambi
// lontani non la toccano.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mesher, collegaFabbrica } from '../src/world/mesher.js';
import { Mondo, CHUNK } from '../src/world/world.js';
import { Frontiera } from '../src/world/frontiera.js';
import { generaChunkOpenWorld } from '../src/world/worldgen.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';

registraDecorazioni();

/** La fabbrica finta: registra ogni caricamento della griglia e basta. */
function fabbricaFinta() {
  const griglie = [];
  let spenta = 0;
  collegaFabbrica({
    materialeMondo: () => ({}), materialeAcqua: () => ({}),
    creaChunk: (kc) => ({ solidi: { kc }, acqua: { kc } }),
    scrivi: () => {}, rimuoviChunk: () => {},
    aggiornaCielo: () => {}, cambiaMateriale: () => {}, colori: () => ({}), coloriCambiati: () => {},
    impostaVoxel: (solidi, scatola) => griglie.push({ scatola: { ...scatola }, solidi }),
    spegniVoxel: () => { spenta++; },
    latoMassimoVoxel: () => 2048, mondoVelato: () => false,
  });
  return { griglie, spente: () => spenta };
}

function mondoInfinito() {
  const m = new Mondo();
  const f = new Frontiera(m, (mm, cx, cz) => generaChunkOpenWorld(mm, cx, cz, 7));
  f.assicura(0.5, 0.5, { resa: 64 }, { subito: true });
  return { m, f };
}

function gira(me, m, b, n = 400) {
  for (let g = 0; g < n; g++) me.aggiorna(m, b);
}

test('con la frontiera la griglia è una finestra centrata su chi guarda, non la scatola del mondo', () => {
  const ff = fabbricaFinta();
  const { m } = mondoInfinito();
  const me = new Mesher({}, m); me.impostaRaggi({ resa: 64, pieno: 32 });
  me.ricostruisciTutto(m, { x: 0.5, z: 0.5 });
  assert.equal(ff.griglie.length, 1, 'una griglia all\'avvio');
  const s = ff.griglie[0].scatola;
  // 2·48 + 1 celle, più il margine di 2 per lato di scatolaPerMondo
  assert.equal(s.larghezza, 2 * 48 + 1 + 4);
  assert.equal(s.profondita, 2 * 48 + 1 + 4);
  assert.equal(s.minX, 1 - 48 - 2);   // il centro è Math.round(0.5) = 1
  assert.equal(s.minZ, 1 - 48 - 2);
  assert.ok(s.larghezza < 4 * CHUNK * 3, 'ben più stretta del mondo generato (resa + 32 per lato)');
  assert.match(me.statistiche.occFinestra, /^1,1 ±48$/);
});

test('camminando poco non si rifà; oltre l\'isteresi si ricentra, una volta', () => {
  const ff = fabbricaFinta();
  const { m } = mondoInfinito();
  const me = new Mesher({}, m); me.impostaRaggi({ resa: 64, pieno: 32 });
  me.ricostruisciTutto(m, { x: 0.5, z: 0.5 });
  gira(me, m, { x: 0.5, z: 0.5 });
  const dopoAvvio = ff.griglie.length;
  gira(me, m, { x: 10.5, z: 0.5 });
  assert.equal(ff.griglie.length, dopoAvvio, 'dieci blocchi: dentro l\'isteresi, niente ricalcolo');
  gira(me, m, { x: 20.5, z: 0.5 });
  assert.equal(ff.griglie.length, dopoAvvio + 1, 'venti blocchi: un ricentramento e basta');
  assert.equal(ff.griglie.at(-1).scatola.minX, 21 - 48 - 2);
  assert.equal(me.statistiche.occFinestra, '21,1 ±48');
  gira(me, m, { x: 25.5, z: 0.5 });
  assert.equal(ff.griglie.length, dopoAvvio + 1, 'e da lì altri cinque blocchi non contano');
});

test('un blocco posato dentro la finestra aggiorna la griglia sul posto, senza rifarla', () => {
  const ff = fabbricaFinta();
  const { m } = mondoInfinito();
  const me = new Mesher({}, m); me.impostaRaggi({ resa: 64, pieno: 32 });
  const b = { x: 0.5, z: 0.5 };
  me.ricostruisciTutto(m, b);
  gira(me, m, b);
  const prima = ff.griglie.length;
  const y = m.altezzaA ? m.altezzaA(3, 3) + 1 : 20;
  m.metti(3, y, 3, 'terra');
  me.aggiorna(m, b);
  assert.equal(ff.griglie.length, prima + 1, 'un caricamento in più');
  assert.deepEqual(ff.griglie.at(-1).scatola, ff.griglie[prima - 1].scatola, 'stessa scatola: è l\'aggiornamento locale');
  assert.equal(me.statistiche.occLocali, 1);
  assert.ok(me.luce.eSolido(3, y, 3), 'e la cella è un muro');
});

test('quello che la frontiera genera lontano non tocca la griglia', () => {
  const ff = fabbricaFinta();
  const { m, f } = mondoInfinito();
  const me = new Mesher({}, m); me.impostaRaggi({ resa: 64, pieno: 32 });
  const b = { x: 0.5, z: 0.5 };
  me.ricostruisciTutto(m, b);
  gira(me, m, b);
  const prima = ff.griglie.length;
  // si cammina piano verso est: la frontiera genera a novanta blocchi, la
  // finestra resta ferma finché non si supera l'isteresi
  for (let x = 1; x <= 15; x += 2) gira(me, m, { x: x + 0.5, z: 0.5 }, 30);
  assert.ok(f.statistiche.generati > 0, 'la frontiera ha generato qualcosa');
  assert.equal(ff.griglie.length, prima, 'e la griglia non si è mossa');
  assert.equal(m.cambiate.length, 0, 'i cambi lontani sono stati scartati');
});

test('senza frontiera la griglia resta la scatola del mondo intero', () => {
  const ff = fabbricaFinta();
  const m = new Mondo();
  for (let x = -30; x < 30; x++) for (let z = -30; z < 30; z++) m.metti(x, 5, z, 'erba', true);
  const me = new Mesher({}, m);
  me.ricostruisciTutto(m, { x: 0.5, z: 0.5 });
  assert.equal(ff.griglie.length, 1);
  assert.equal(ff.griglie[0].scatola.larghezza, 60 + 4);
  assert.equal(me.statistiche.occFinestra, '');
});

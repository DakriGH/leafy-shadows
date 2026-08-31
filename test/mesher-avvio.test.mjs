// L'AVVIO NON DEVE LASCIARE INDIETRO NESSUN CHUNK.
//
// ⚠ È IL DIFETTO CHE QUESTA MODIFICA POTEVA INTRODURRE, ed è muto: da quando
// `ricostruisciTutto` costruisce solo i chunk vicini e mette gli altri in coda,
// un errore nel riempimento o nello svuotamento lascerebbe pezzi di mondo che
// non arrivano MAI. A schermo si vedrebbe come un buco lontano — cioè come una
// scelta di resa, non come un guasto — e ci si convincerebbe che è il LOD.
//
// ⚠ E C'È UN PRECEDENTE ESATTO: `ricostruisciTutto` finiva svuotando TUTTE le
// code «perché parlano di un mondo che non c'è più». Verissimo per quelle
// vecchie, e fatale per quella che adesso riempie lui stesso due righe sopra.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mesher, collegaFabbrica } from '../src/world/mesher.js';
import { Mondo } from '../src/world/world.js';

// ⚠ UNA FABBRICA FINTA: qui non c'è nessun motore. È la stessa iniezione del
// gioco vero, ed è quello che rende provabile in Node un modulo che disegna.
const meshFinte = [];
collegaFabbrica({
  materialeMondo: () => ({}), materialeAcqua: () => ({}),
  creaChunk: (kc) => { const m = { kc, vertici: 0 }; meshFinte.push(m); return { solidi: m, acqua: { kc } }; },
  scrivi: (mesh, dati) => { if (mesh) mesh.vertici = dati && dati.pos ? dati.pos.length : 0; },
  rimuoviChunk: () => {}, aggiornaCielo: () => {}, cambiaMateriale: () => {},
  colori: () => ({}), coloriCambiati: () => {},
  impostaVoxel: () => {}, spegniVoxel: () => {}, latoMassimoVoxel: () => 128,
  mondoVelato: () => false,
});

function mondoLargo(r = 40) {
  const m = new Mondo();
  for (let x = -r; x <= r; x++) for (let z = -r; z <= r; z++) {
    m.metti(x, 6, z, 'erba', true); m.metti(x, 5, z, 'terra', true);
  }
  return m;
}

test('subito solo i vicini, gli altri in coda', () => {
  const m = mondoLargo(), me = new Mesher({}, m);
  me.ricostruisciTutto(m, { x: 0.5, z: 0.5 });
  assert.ok(me.statistiche.inCoda > 0, 'i lontani devono restare in coda');
  // ⚠ E NON TUTTI: se la coda contenesse anche i vicini, non avremmo tolto
  // niente al blocco dell'avvio — avremmo solo spostato il lavoro.
  assert.ok(me.statistiche.inCoda < m.chunks.size, 'ma i vicini sono già fatti');
});

test('e alla fine ci arrivano TUTTI', () => {
  // ⚠ LA PROVA CHE CONTA. Un chunk che non arriva mai si vede come un buco
  // lontano, cioè si scambia per LOD e non per guasto.
  const m = mondoLargo(), me = new Mesher({}, m);
  me.ricostruisciTutto(m, { x: 0.5, z: 0.5 });
  const attesi = m.chunks.size;
  for (let giro = 0; giro < 500 && me.statistiche.inCoda > 0; giro++) {
    me.aggiorna(m, { x: 0.5, z: 0.5 });
  }
  assert.equal(me.statistiche.inCoda, 0, 'la coda si deve svuotare');
  assert.equal(me.chunks.size, attesi, `${me.chunks.size} chunk invece di ${attesi}`);
});

test('senza un punto da cui guardare si fa tutto subito, come prima', () => {
  // ⚠ Serve: chi non passa un punto (una prova, lo zoo) non deve trovarsi un
  // mondo a metà e nessuno che scorra la coda.
  const m = mondoLargo(), me = new Mesher({}, m);
  me.ricostruisciTutto(m);
  assert.equal(me.statistiche.inCoda, 0);
  assert.equal(me.chunks.size, m.chunks.size);
});

test('i vicini sono davvero i VICINI, non i primi che capitano', () => {
  // ⚠ Il punto di tutta la faccenda è vedere subito quello che si ha addosso.
  const m = mondoLargo(), me = new Mesher({}, m);
  const lontano = { x: 500, z: 500 };
  me.ricostruisciTutto(m, lontano);
  // guardando fuori dal mondo, nessun chunk è vicino: sono tutti in coda
  assert.equal(me.statistiche.inCoda, m.chunks.size, 'da lontano non si costruisce niente subito');
});

test('ricostruire due volte non lascia doppioni in coda', () => {
  const m = mondoLargo(), me = new Mesher({}, m);
  me.ricostruisciTutto(m, { x: 0.5, z: 0.5 });
  const prima = me.statistiche.inCoda;
  me.ricostruisciTutto(m, { x: 0.5, z: 0.5 });
  assert.equal(me.statistiche.inCoda, prima, 'la coda è una Set, non una lista');
});

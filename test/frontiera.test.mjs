// LA FRONTIERA: il mondo si genera davanti a chi cammina e si scarica dietro,
// e quello che il giocatore ha fatto sopravvive allo scarico.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo, CHUNK } from '../src/world/world.js';
import { Frontiera } from '../src/world/frontiera.js';
import { generaChunkOpenWorld } from '../src/world/worldgen.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';

registraDecorazioni();
const gen = (m, cx, cz) => generaChunkOpenWorld(m, cx, cz, 7);
const raggi = { resa: 64, pieno: 32 };

test('all\'avvio «subito» genera tutto entro resa + margine, dal più vicino', () => {
  const m = new Mondo(); const f = new Frontiera(m, gen);
  f.assicura(0.5, 0.5, raggi, { subito: true });
  assert.ok(m.generati.has('0,0') && m.generati.has('-1,-1'), 'i chunk sotto i piedi');
  assert.ok(m.generati.size >= 25, `almeno il quadrato entro 64+32 blocchi: ${m.generati.size}`);
  assert.ok(!m.generati.has('20,0'), 'niente a 320 blocchi');
  assert.equal(f.statistiche.inCoda, 0);
  assert.ok(m.contaBlocchi > 1000, 'e i blocchi ci sono');
});

test('a bilancio: pochi chunk per giro, e camminando arrivano davanti e se ne vanno dietro', () => {
  const m = new Mondo(); const f = new Frontiera(m, gen);
  f.assicura(0.5, 0.5, raggi, { subito: true });
  const prima = m.generati.size;
  // si cammina a est di 400 blocchi: il primo giro genera al massimo 4 chunk
  const fatti = f.assicura(400.5, 0.5, raggi);
  assert.ok(fatti <= 4 && fatti > 0, `a bilancio: ${fatti}`);
  assert.ok(!m.generati.has('0,0'), 'il chunk di partenza, a 400 blocchi, è stato scaricato');
  assert.ok(m.generati.has('25,0'), 'quello sotto i piedi è il primo a nascere');
  for (let g = 0; g < 200 && f.statistiche.inCoda > 0; g++) f.assicura(400.5, 0.5, raggi);
  assert.equal(f.statistiche.inCoda, 0);
  assert.ok(Math.abs(m.generati.size - prima) <= 4, `la memoria resta la stessa: ${prima} → ${m.generati.size}`);
  assert.ok(f.statistiche.scaricati > 0);
});

test('lo stesso seme dà lo stesso chunk, anche dopo uno scarico', () => {
  const m = new Mondo(); const f = new Frontiera(m, gen);
  f.assicura(0.5, 0.5, raggi, { subito: true });
  const foto = [...m.blocchiDelChunk('1,1')].map((b) => `${b.x},${b.y},${b.z}:${b.tipo}`).sort();
  f.assicura(600.5, 600.5, raggi, { subito: true });     // via lontano: 1,1 scaricato
  assert.ok(!m.chunks.has('1,1'));
  f.assicura(0.5, 0.5, raggi, { subito: true });         // e ritorno
  const dopo = [...m.blocchiDelChunk('1,1')].map((b) => `${b.x},${b.y},${b.z}:${b.tipo}`).sort();
  assert.deepEqual(dopo, foto);
});

test('le modifiche del giocatore sopravvivono allo scarico; la generazione no', () => {
  const m = new Mondo(); const f = new Frontiera(m, gen);
  const eventi = []; m.onEvento = (e) => eventi.push(e);
  f.assicura(0.5, 0.5, raggi, { subito: true });
  // il giocatore posa un mattone in alto e toglie un blocco di terreno
  let y = 30; while (y > 0 && !m.tipo(3, y, 3)) y--;
  m.metti(3, y + 5, 3, 'mattoni');
  m.togli(3, y, 3);
  assert.ok(m.modifiche.get('0,0') && m.modifiche.get('0,0').size === 2, 'due modifiche annotate');
  f.assicura(600.5, 600.5, raggi, { subito: true });
  assert.ok(!m.chunks.has('0,0'));
  f.assicura(0.5, 0.5, raggi, { subito: true });
  assert.equal(m.tipo(3, y + 5, 3), 'mattoni', 'il mattone è tornato');
  assert.equal(m.tipo(3, y, 3), null, 'il buco è rimasto');
});

test('le decorazioni passano dagli eventi: posate all\'arrivo, tolte allo scarico', () => {
  const m = new Mondo(); const f = new Frontiera(m, gen);
  const eventi = []; m.onEvento = (e) => eventi.push(e);
  f.assicura(0.5, 0.5, raggi, { subito: true });
  const posati = eventi.filter((e) => e.tipo === 'metti' && (e.blocco === 'albero' || e.blocco === 'lampione'));
  assert.ok(posati.length > 0, 'con 25+ chunk qualche albero c\'è');
  assert.equal(eventi.filter((e) => e.tipo === 'metti' && e.blocco === 'erba').length, 0, 'il terreno è silenzioso');
  eventi.length = 0;
  f.assicura(600.5, 600.5, raggi, { subito: true });
  assert.equal(eventi.filter((e) => e.tipo === 'togli').length, posati.length, 'un togli per ogni decorazione scaricata');
  // e un albero tagliato dal giocatore non risorge
});

test('un albero tagliato non risorge quando il chunk torna', () => {
  const m = new Mondo(); const f = new Frontiera(m, gen);
  const eventi = []; m.onEvento = (e) => eventi.push(e);
  f.assicura(0.5, 0.5, raggi, { subito: true });
  const albero = eventi.find((e) => e.tipo === 'metti' && e.blocco === 'albero');
  const [x, y, z] = albero.cella;
  m.togli(x, y, z);
  f.assicura(600.5, 600.5, raggi, { subito: true });
  f.assicura(0.5, 0.5, raggi, { subito: true });
  assert.equal(m.tipo(x, y, z), null, 'l\'albero tagliato resta tagliato');
});

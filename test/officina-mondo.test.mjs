// I REGISTRI DEL MONDO E DELLE MATERIE passano il validatore, e scrivono dove dicono.
import './_dom-stub.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizzaRegistro } from '../src/officina/schema.js';
import { registroMesher, Mesher, collegaFabbrica } from '../src/world/mesher.js';
import { registroMaterie, tavolozzaMaterie, indiceMateria } from '../src/world/materie.js';
import { Mondo } from '../src/world/world.js';

collegaFabbrica({ materialeMondo: () => ({}), materialeAcqua: () => ({}), creaChunk: (kc) => ({ solidi: { kc }, acqua: { kc } }), scrivi: () => {}, rimuoviChunk: () => {}, aggiornaCielo: () => {}, cambiaMateriale: () => {}, colori: () => ({}), coloriCambiati: () => {}, impostaVoxel: () => {}, spegniVoxel: () => {}, latoMassimoVoxel: () => 128, mondoVelato: () => false });

test('il registro del mesher è valido, legge i numeri veri e scrive «pieno» da chi chiama', () => {
  const m = new Mondo(); for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) m.metti(x, 4, z, 'erba', true);
  const me = new Mesher({}, m); me.ricostruisciTutto(m);
  let pienoScritto = null;
  const r = normalizzaRegistro(registroMesher(me, m, { leggiPieno: () => 75, applicaPieno: (v) => { pienoScritto = v; } }));
  const per = Object.fromEntries(r.campi.map((c) => [c.chiave, c]));
  assert.equal(per.chunk.leggi(), '1 / 1');
  assert.equal(per.pelli.leggi(), 0);
  assert.equal(per.pieno.leggi(), 75);
  per.pieno.scrivi(40);
  assert.equal(pienoScritto, 40, 'il mesher non scrive il profilo: lo fa chi chiama');
  // senza le due funzioni la manopola non c'è, e il registro resta valido
  const r2 = normalizzaRegistro(registroMesher(me, m));
  assert.ok(!r2.campi.some((c) => c.chiave === 'pieno'));
});

test('il registro delle materie scrive nella tavolozza viva e alza la versione', () => {
  const tav = tavolozzaMaterie();
  const r = normalizzaRegistro(registroMaterie(tav));
  const c = r.campi.find((x) => x.chiave === 'metallo.0');
  assert.equal(c.leggi(), 0);
  c.scrivi(0.5);
  assert.equal(tav[indiceMateria('metallo') * 4], 0.5);
  assert.equal(tav.versione, 1);
  c.scrivi(0.7);
  assert.equal(tav.versione, 2, 'ogni scrittura alza la versione: è quello che il programma guarda');
});

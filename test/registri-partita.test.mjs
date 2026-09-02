import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizzaRegistro } from '../src/officina/schema.js';
import { registroResa, registroGiornoPartita, registroCorpi, registroStreaming, registroGiocatore } from '../src/partita/registri.js';

test('i registri della partita sono ben formati e leggono/scrivono davvero', () => {
  const resa = { ombra: true, specchio: { attivo: true, scala: 0.5, mostra: false }, erbaFinoA: 96, nebbia: { da: 72, a: 104 }, statistiche: { disegni: 1, disegniSpecchio: 2, chunkVisti: 3, chunkTotali: 4 } };
  const giorno = { auto: true, ora: 0.5, durata: 600 };
  const corpi = { statistiche: { corpi: 0, svegli: 0 }, svuota() { this.svuotato = true; } };
  const streaming = { raggioResa: 96, budgetMs: 5, erba: 8, statistiche: { inCoda: 0, costruiti: 1, scaricati: 0 } };
  let lanciati = 0;
  const stato = { volo: false, terza: false, impostaVolo(v) { this.volo = v; }, impostaTerza(v) { this.terza = v; }, dove: () => 'qui', aCasa() {} };
  const registri = [registroResa(resa), registroGiornoPartita(giorno), registroCorpi(corpi, (n) => (lanciati += n)), registroStreaming(streaming), registroGiocatore(stato)].map(normalizzaRegistro);
  assert.equal(registri.length, 5);
  const campo = (r, c) => registri.find((x) => x.chiave === r).campi.find((x) => x.chiave === c);
  campo('resa', 'specchio').scrivi(false); assert.equal(resa.specchio.attivo, false);
  campo('resa', 'nebbiaDa').scrivi(200); assert.equal(resa.nebbia.da, 100, 'la nebbia parte sempre prima di dove è piena');
  campo('giorno', 'ora').scrivi(0.25); assert.equal(giorno.auto, false); assert.equal(campo('giorno', 'orologio').leggi(), '06:00');
  campo('corpi', 'lancia20').fai(); assert.equal(lanciati, 20);
  campo('corpi', 'svuota').fai(); assert.ok(corpi.svuotato);
  campo('giocatore', 'volo').scrivi(true); assert.equal(stato.volo, true);
  for (const r of registri) for (const c of r.campi) if (c.tipo !== 'azione') assert.notEqual(c.leggi(), undefined, `${r.chiave}.${c.chiave} legge qualcosa`);
});

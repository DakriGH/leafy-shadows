// IL WATERLOGGING — «manca anche il waterloggare le cose».
//
// ⚠ IL DIFETTO È NELLO SCHEMA DEI DATI, non nel disegno: il mondo tiene UN
// TIPO PER CELLA, quindi posando un albero in un lago l'albero prendeva il
// posto dell'acqua e restava lì asciutto in mezzo allo specchio. La cura non è
// un tipo nuovo («albero bagnato», e poi una versione bagnata di ogni cosa
// posabile) ma un DATO ACCANTO: una mappa delle celle bagnate, che sono poche
// per definizione — solo dove qualcuno ha messo qualcosa dentro l'acqua.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { costruisciChunkNucleo } from '../src/nucleo/mesher-nucleo.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';

registraDecorazioni();

/** Un laghetto nel chunk 0,0: pietra a y=0, acqua a y=1. */
function lago() {
  const m = new Mondo();
  for (let x = 0; x < 16; x++) for (let z = 0; z < 16; z++) {
    m.metti(x, 0, z, 'pietra', true);
    m.metti(x, 1, z, 'acqua', true);
  }
  return m;
}

test('la cella bagnata si ricorda il livello, e sparisce quando si toglie la cosa', () => {
  const m = lago();
  assert.equal(m.bagnata(3, 1, 3), null, 'appena nata non è bagnata');
  m.metti(3, 1, 3, 'albero', true);
  m.bagna(3, 1, 3, 0);
  assert.equal(m.bagnata(3, 1, 3), 0);

  m.togli(3, 1, 3, true);
  assert.equal(m.bagnata(3, 1, 3), null, 'togliendo l\'albero doveva andarsene anche l\'acqua che teneva');
});

test('IL MESHER DISEGNA L\'ACQUA DI UNA CELLA BAGNATA: niente buco asciutto nel lago', () => {
  const pieno = costruisciChunkNucleo(lago(), '0,0', { erba: 0, luce: false });

  // stesso lago, ma con un albero in mezzo e SENZA waterlogging: si vede il buco
  const asciutto = lago();
  asciutto.metti(3, 1, 3, 'albero', true);
  const senza = costruisciChunkNucleo(asciutto, '0,0', { erba: 0, luce: false });
  // ⚠ NON «meno quad», ma «quad DIVERSI»: togliendo una cella d'acqua si perde
  // la sua cima (−1) ma i quattro vicini scoprono un fianco ciascuno (+4), e il
  // totale SALE. La prima stesura di questa prova diceva `<` e falliva: era
  // l'aspettativa a essere sbagliata, non il mesher.
  assert.notEqual(senza.acqua.quad, pieno.acqua.quad,
    'con un albero non bagnato l\'acqua deve cambiare: se no la prova non prova niente');

  // e con il waterlogging l'acqua torna
  const bagnato = lago();
  bagnato.metti(3, 1, 3, 'albero', true);
  bagnato.bagna(3, 1, 3, 0);
  const con = costruisciChunkNucleo(bagnato, '0,0', { erba: 0, luce: false });
  assert.equal(con.acqua.quad, pieno.acqua.quad,
    'la cella bagnata deve disegnare la sua acqua come tutte le altre');
});

test('e NON compare una parete d\'acqua attorno al tronco', () => {
  // ⚠ È il difetto che nascerebbe trattando la cella bagnata come solida per i
  // vicini: fra il lago e l'albero spunterebbe una veletta verticale attorno a
  // ogni tronco. Il conto dei quad lo dice: una parete in più sarebbe quattro
  // facce laterali in più.
  const bagnato = lago();
  bagnato.metti(8, 1, 8, 'albero', true);
  bagnato.bagna(8, 1, 8, 0);
  const con = costruisciChunkNucleo(bagnato, '0,0', { erba: 0, luce: false });
  const pieno = costruisciChunkNucleo(lago(), '0,0', { erba: 0, luce: false });
  assert.equal(con.acqua.quad, pieno.acqua.quad, 'sono comparse facce d\'acqua in più: è la veletta');
});

test('l\'albero bagnato resta un albero: la sua impronta c\'è ancora', () => {
  // ⚠ se il waterlogging rubasse l'impronta, l'albero nel lago tornerebbe a non
  // fare né schiuma né ombra alla lampada — cioè i due difetti appena curati
  const bagnato = lago();
  bagnato.metti(5, 1, 5, 'albero', true);
  bagnato.bagna(5, 1, 5, 0);
  const d = costruisciChunkNucleo(bagnato, '0,0', { erba: 0, luce: false });
  assert.ok(d.impronte[5 * 16 + 5] > 1, `l'impronta dell'albero è sparita: ${d.impronte[5 * 16 + 5]}`);
});

test('LE CELLE BAGNATE SOPRAVVIVONO AL SALVATAGGIO', async () => {
  // ⚠ Se no un albero piantato in un lago torna asciutto ricaricando: il
  // waterlogging è una decisione di chi gioca, non un dato rigenerabile dal seme.
  const { impacchetta, spacchetta } = await import('../src/partita/salvataggio.js');
  const m = lago();
  m.frontiera = {};                       // le modifiche si annotano solo con lo streaming acceso
  m.metti(6, 1, 6, 'albero');
  m.bagna(6, 1, 6, 2);
  const pacco = impacchetta(m);

  const due = new Mondo();
  spacchetta(due, pacco);
  assert.equal(due.bagnata(6, 1, 6), 2, 'il livello dell\'acqua trattenuta è andato perso');
});

test('un pacco VECCHIO (senza celle bagnate) si legge lo stesso', async () => {
  // ⚠ È la ragione per cui il campo è facoltativo e la VERSIONE non è salita:
  // alzarla avrebbe fatto rifiutare i salvataggi già esistenti — cioè buttato
  // via il mondo che il committente ha costruito.
  const { spacchetta } = await import('../src/partita/salvataggio.js');
  const m = new Mondo();
  const n = spacchetta(m, JSON.stringify({ v: 1, chunk: {} }));
  assert.equal(n, 0, 'un pacco vecchio deve essere accettato, non rifiutato');
  assert.equal(m.bagnate.size, 0);
});

test('un blocco PIENO invece l\'acqua la caccia (è la regola di Minecraft)', () => {
  // qui si prova la regola, non il codice della posa: una cella con la pietra
  // dentro non è bagnata da nessuno
  const m = lago();
  m.metti(4, 1, 4, 'pietra', true);
  assert.equal(m.bagnata(4, 1, 4), null);
  const d = costruisciChunkNucleo(m, '0,0', { erba: 0, luce: false });
  const pieno = costruisciChunkNucleo(lago(), '0,0', { erba: 0, luce: false });
  assert.ok(d.acqua.quad < pieno.acqua.quad, 'la pietra doveva togliere la sua acqua');
});

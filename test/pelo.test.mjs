// IL PIANO DELLO SPECCHIO SEGUE L'ACQUA — e i casi che contano si provano qui.
//
// ⚠ Il difetto che queste prove esistono per prendere è già costato una
// giornata al committente: «non riflette proprio nulla». La causa era un piano
// FISSO a 9,5 mentre il mare stava a 5,94 — nessun errore, nessun avviso, solo
// un'immagine riflessa sbagliata che a occhio si legge come «acqua opaca».
// Un numero sbagliato di tre blocchi e mezzo non lo vede nessun test di
// compilazione: lo vede solo una prova che sa dov'è l'acqua.

import test from 'node:test';
import assert from 'node:assert/strict';
import { peloDi, peloVicino, pianoDaTenere } from '../src/world/pelo.js';
import { Mondo } from '../src/world/world.js';

test('il pelo di una sorgente sta 15/16 sopra la sua cella', () => {
  assert.equal(peloDi(5, 'acqua'), 5 + 15 / 16);
  // e un livello parziale sta più in basso, di un ottavo per livello
  assert.equal(peloDi(5, 'acqua~2'), 5 + 11 / 16);
});

function mondoConLago(y, x0 = 0, z0 = 0, lato = 8) {
  const m = new Mondo();
  for (let x = x0; x < x0 + lato; x++) {
    for (let z = z0; z < z0 + lato; z++) {
      m.metti(x, y - 1, z, 'roccia', true);
      m.metti(x, y, z, 'acqua', true);
    }
  }
  return m;
}

test('trova il pelo del lago sotto i piedi', () => {
  const m = mondoConLago(5);
  assert.equal(peloVicino(m, 4, 6, 4), 5 + 15 / 16);
});

test('NON prende una cella d\'acqua sepolta sotto altra acqua', () => {
  // un lago profondo tre: il pelo è quello ALTO, non le celle sotto
  const m = new Mondo();
  for (let x = 0; x < 8; x++) for (let z = 0; z < 8; z++) {
    m.metti(x, 2, z, 'roccia', true);
    for (let y = 3; y <= 6; y++) m.metti(x, y, z, 'acqua', true);
  }
  assert.equal(peloVicino(m, 4, 8, 4), 6 + 15 / 16, 'il pelo è la cella più alta');
});

test('scendendo in una grotta il piano segue l\'acqua di sotto', () => {
  // il verdetto del committente: «anche se faccio una grotta e ci metto acqua»
  const m = mondoConLago(20);          // il mare in superficie
  for (let x = 0; x < 6; x++) for (let z = 0; z < 6; z++) {
    m.metti(x, 1, z, 'roccia', true);
    m.metti(x, 2, z, 'acqua', true);   // il laghetto in caverna
  }
  const inSuperficie = peloVicino(m, 3, 22, 3);
  const inGrotta = peloVicino(m, 3, 4, 3);
  assert.equal(inSuperficie, 20 + 15 / 16, 'in superficie vince il mare');
  assert.equal(inGrotta, 2 + 15 / 16, 'sotto vince il laghetto della grotta');
});

test('senza acqua intorno non si inventa un piano', () => {
  const m = new Mondo();
  for (let x = 0; x < 10; x++) for (let z = 0; z < 10; z++) m.metti(x, 5, z, 'erba', true);
  assert.equal(peloVicino(m, 5, 7, 5), null);
});

test('il piano si sposta a SCATTI, non insegue in continuo', () => {
  // stessa quota → non si tocca (niente riflesso che slitta camminando)
  assert.equal(pianoDaTenere(5.94, 5.94), 5.94);
  assert.equal(pianoDaTenere(5.94, 6.1), 5.94, 'sotto mezzo blocco si resta fermi');
  assert.equal(pianoDaTenere(5.94, 2.94), 2.94, 'un salto vero sposta il piano');
  // e senza acqua si TIENE l'ultimo: meglio un piano vecchio che nessuno
  assert.equal(pianoDaTenere(5.94, null), 5.94);
  assert.equal(pianoDaTenere(null, 5.94), 5.94, 'il primo piano si prende comunque');
});

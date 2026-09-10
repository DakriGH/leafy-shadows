// POSARE NELL'ACQUA — il difetto che il committente ha riassunto in tre
// parole: «cosa che non riesco a fare».
//
// ⚠ Erano TRE guardie in tre momenti diversi, ognuna ragionevole presa da
// sola, e nessuna sbagliata leggendola da vicino:
//   1. l'azione sopra l'acqua era sempre «nuota fin lì», quindi con un blocco
//      in mano il clic non arrivava nemmeno alla posa;
//   2. `posa()` rifiutava di suo se il bersaglio era acqua;
//   3. `mondo.pieno()` dice sì anche sull'acqua, perché l'acqua occupa la sua
//      cella come un blocco qualunque.
// Qui si prova la terza, che è quella che si può provare in Node — ed è la
// regola: **l'acqua si sostituisce**.
import test from 'node:test';
import assert from 'node:assert/strict';
import { riempibile, Cantiere } from '../src/gioco/cantiere.js';

/** Un mondo finto: solo `tipo`, `pieno`, `metti`. */
function mondoFinto(celle = {}) {
  return {
    celle,
    tipo(x, y, z) { const t = celle[`${x},${y},${z}`]; return t === undefined ? null : t; },
    pieno(x, y, z) { return this.tipo(x, y, z) !== null; },
    metti(x, y, z, t) { celle[`${x},${y},${z}`] = t; },
    togli(x, y, z) { delete celle[`${x},${y},${z}`]; },
  };
}

test('una cella vuota si riempie', () => {
  assert.equal(riempibile(mondoFinto(), 0, 0, 0), true);
});

test('UNA CELLA D\'ACQUA SI RIEMPIE: l\'acqua si sostituisce', () => {
  const m = mondoFinto({ '3,5,7': 'acqua' });
  assert.equal(m.pieno(3, 5, 7), true, 'per il mondo la cella È piena: è giusto, ci sta l\'acqua');
  assert.equal(riempibile(m, 3, 5, 7), true, 'ma per chi posa dev\'essere libera');
});

test('l\'acqua a livelli (`acqua~n`) vale come acqua', () => {
  // ⚠ il mondo scrive «acqua~3» per i livelli parziali, e un controllo che
  // guardasse la stringa esatta lascerebbe fuori proprio la riva — cioè il
  // posto dove uno prova per primo a mettere qualcosa
  const m = mondoFinto({ '1,2,3': 'acqua~3' });
  assert.equal(riempibile(m, 1, 2, 3), true);
});

test('un blocco vero NON si sostituisce', () => {
  const m = mondoFinto({ '0,0,0': 'pietra', '0,1,0': 'erba' });
  assert.equal(riempibile(m, 0, 0, 0), false);
  assert.equal(riempibile(m, 0, 1, 0), false);
});

test('il cantiere posa dentro l\'acqua, e non dentro la pietra', () => {
  const m = mondoFinto({ '5,5,5': 'acqua', '6,5,5': 'pietra' });
  const c = new Cantiere(m);
  c.scelto = 1;   // il primo blocco vero della cassetta (lo zero è la mano vuota)
  assert.ok(c.tipoScelto, 'la cassetta deve avere un blocco in posizione 1');
  assert.equal(c.posa(5, 5, 5), true, 'nell\'acqua si posa');
  assert.equal(m.tipo(5, 5, 5), c.tipoScelto, 'e l\'acqua è stata sostituita');
  assert.equal(c.posa(6, 5, 5), false, 'nella pietra no');
  assert.equal(m.tipo(6, 5, 5), 'pietra');
});

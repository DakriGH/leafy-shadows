// IL PELO IN JS E IL PELO IN GLSL DEVONO ESSERE LA STESSA FUNZIONE.
//
// ⚠ PERCHÉ È UNA PROVA E NON UNA SPERANZA: `altezzaPelo` esiste per la fisica
// (il galleggiamento — le palle del banco, e i corpi di fase 5 — si calcola
// sulla CPU con la stessa onda che la GPU disegna). Se qualcuno ritocca il
// vertex shader e non la funzione JS, gli oggetti galleggiano su un'acqua che
// non esiste — un difetto che si presenta come «la barca affonda un po'»,
// settimane dopo, a chilometri dal ritocco.
//
// ⚠ IL CONFRONTO È PER TRANSPILAZIONE, non per lista di coefficienti: il GLSL
// vero delle onde viene TRADOTTO in JavaScript riga per riga (sin→Math.sin,
// position.x→x…) ed eseguito. Le prime due stesure di questa prova leggevano i
// numeri con una regex e conoscevano la STRUTTURA (quante onde, quali segni):
// a ogni ridisegno delle onde andava riscritta anche la prova, cioè la prova
// misurava sé stessa. Questa esegue quello che c'è scritto, qualunque cosa ci
// sia scritta: chi cambia il GLSL e non `altezzaPelo` la rompe comunque.

import test from 'node:test';
import assert from 'node:assert/strict';
import { altezzaPelo, GLSL_ACQUA_ONDE_VERTICE, REGOLE } from '../src/motore/acqua.js';

/** Traduce il blocco GLSL delle onde in una funzione JS (x, z, t) → acquaSu. */
function pelodalGlsl() {
  const righe = GLSL_ACQUA_ONDE_VERTICE.split('\n')
    .map((r) => r.trim())
    // restano solo le righe di matematica pura: fuori il peso (usa aAcqua e
    // fract sulla y, che qui non esistono) e la scrittura sulla posizione
    .filter((r) => r && !r.includes('acquaPeso') && !r.includes('positionUpdated'));
  assert.ok(righe.length >= 3, 'il blocco delle onde è sparito?');
  const corpo = righe
    .map((r) => r
      .replace(/^float /, 'let ')
      .replaceAll('position.x', 'x')
      .replaceAll('position.z', 'z')
      .replaceAll('uTempo', 't')
      .replaceAll('sin(', 'Math.sin('))
    .join('\n');
  assert.ok(!/position\.|uTempo|aAcqua/.test(corpo), `resti di GLSL non tradotti:\n${corpo}`);
  // eslint-disable-next-line no-new-func
  return new Function('x', 'z', 't', `${corpo}\nreturn acquaSu;`);
}

test('altezzaPelo è la trascrizione esatta del GLSL delle onde', () => {
  const glsl = pelodalGlsl();
  const punti = [[0, 0, 0], [3, 4, 1], [-7, 2.5, 12.3], [100, -50, 999], [17.3, 41.9, 3.7], [-0.5, 0.25, 60]];
  for (const [x, z, t] of punti) {
    const attesa = glsl(x, z, t) * REGOLE.moto;
    assert.ok(Math.abs(altezzaPelo(x, z, t) - attesa) < 1e-12, `divergono in (${x}, ${z}, ${t})`);
  }
});

test('il pelo resta dentro l\'ampiezza dichiarata', () => {
  // il tetto è 1,6 volte il moto — da sempre: se un giorno la somma delle
  // ampiezze sale, l'acqua SCAVALCA la sponda (il margine è in REGOLE.moto)
  let max = 0;
  for (let i = 0; i < 20000; i++) {
    const h = Math.abs(altezzaPelo(i * 0.37, i * 0.73, i * 0.11));
    if (h > max) max = h;
  }
  assert.ok(max <= 1.6 * REGOLE.moto + 1e-9, `ampiezza ${max} oltre il tetto di ${1.6 * REGOLE.moto}`);
});

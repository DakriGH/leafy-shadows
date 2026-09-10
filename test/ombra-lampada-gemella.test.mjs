// LE DUE COPIE DI `ombraLampada` DEVONO RESTARE UGUALI.
//
// ⚠ QUESTA PROVA NASCE DA UN DIFETTO PAGATO DUE VOLTE. La stessa funzione GLSL
// esiste in `nucleo/resa.js` (i blocchi) e in `nucleo/modelli.js` (alberi,
// lampioni, arredi), perché sono due programmi diversi e il GLSL non si
// importa. Sono già divergute:
//
//  1. i due canali separati della mappa (R silhouette / G solido) erano finiti
//     solo in `resa.js`: l'ombra quadrata delle lampade era curata sui blocchi
//     e ANCORA VIVA sui modelli, e si vedeva solo guardando un albero;
//  2. il test a cilindro sull'oggetto era sbagliato in tutti e due nello stesso
//     modo — misurava la distanza dal centro della cella nel punto in cui il
//     raggio ci ENTRA, che sta sul bordo e quindi è sempre almeno mezza cella:
//     la soglia non poteva scattare, e «l'ombra non avviene dai lampioni se
//     c'è un albero davanti».
//
// Il difetto di tipo (1) è quello che questa prova prende: due file che fanno
// la stessa cosa in due posti divergono, e si vede solo dove si guarda.
//
// ⚠ NON SI CONFRONTA IL TESTO, SI CONFRONTA IL CODICE: i commenti possono (e
// devono) essere diversi — uno dei due spiega, l'altro rimanda. Si tolgono i
// commenti e gli spazi, e si confronta quello che la GPU esegue davvero.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

/** Il corpo di una funzione GLSL, senza commenti né spazi superflui. */
export function corpoGlsl(sorgente, nome) {
  const inizio = sorgente.indexOf(`float ${nome}(`);
  if (inizio < 0) return null;
  // si scorre contando le graffe: la funzione finisce quando tornano a zero
  const apre = sorgente.indexOf('{', inizio);
  let liv = 0, fine = -1;
  for (let i = apre; i < sorgente.length; i++) {
    if (sorgente[i] === '{') liv++;
    else if (sorgente[i] === '}') { liv--; if (liv === 0) { fine = i; break; } }
  }
  if (fine < 0) return null;
  return sorgente.slice(apre, fine + 1)
    .replace(/\/\/[^\n]*/g, ' ')          // via i commenti di riga
    .replace(/\/\*[\s\S]*?\*\//g, ' ')    // e quelli di blocco
    .replace(/\s+/g, ' ')                 // gli spazi non contano
    .trim();
}

const resa = readFileSync(fileURLToPath(new URL('../src/nucleo/resa.js', import.meta.url)), 'utf8');
const modelli = readFileSync(fileURLToPath(new URL('../src/nucleo/modelli.js', import.meta.url)), 'utf8');

test('`ombraLampada` è identica nei due programmi', () => {
  const a = corpoGlsl(resa, 'ombraLampada');
  const b = corpoGlsl(modelli, 'ombraLampada');
  assert.ok(a, 'ombraLampada non trovata in nucleo/resa.js');
  assert.ok(b, 'ombraLampada non trovata in nucleo/modelli.js');
  assert.equal(a, b,
    'le due copie di ombraLampada sono divergute: quello che si cambia in una va cambiato anche nell\'altra,\n' +
    'se no una correzione vale sui blocchi e non sui modelli (o viceversa) e si vede solo dove si guarda.');
});

test('e la regola vale: la cella della lampada non fa ombra a se stessa', () => {
  // ⚠ Il lampione è un oggetto anche lui (canale B, alto tre celle) e il raggio
  // verso la sua lanterna passa NECESSARIAMENTE per la sua cella: senza la
  // guardia, ogni lampione si spegneva da solo la pozza oltre il primo blocco.
  for (const [nome, s] of [['resa', resa], ['modelli', modelli]]) {
    const c = corpoGlsl(s, 'ombraLampada');
    assert.match(c, /cellaLampada/, `in ${nome} manca la guardia sulla cella della lampada`);
  }
});

test('e la distanza si misura al punto PIU VICINO, non all\'ingresso della cella', () => {
  // ⚠ Il punto d'ingresso sta sul bordo della cella: da lì il centro è sempre
  // almeno mezza cella lontano, e una soglia più stretta non può scattare mai.
  // Il segno del calcolo giusto è la proiezione (`dot(ac, dir)`) col clamp.
  for (const [nome, s] of [['resa', resa], ['modelli', modelli]]) {
    const c = corpoGlsl(s, 'ombraLampada');
    assert.match(c, /clamp\(dot\(ac, dir\)/, `in ${nome} manca la proiezione sul punto più vicino`);
  }
});

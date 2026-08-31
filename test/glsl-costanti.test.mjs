// OGNI COSTANTE DI GLSL CHE SI USA DEVE ESISTERE.
//
// ⚠ E QUESTA PROVA NASCE DA UN DIFETTO VERO, di quelli muti. Riscrivendo il
// blocco delle onde ho sostituito una fetta di `acqua.js` con `slice`, e la
// fetta ha inghiottito la costante `GLSL_ACQUA_BRILLIO_RICCO` insieme al pezzo
// che volevo cambiare. Il file continuava a importarsi senza un fiato — perché
// il riferimento vive DENTRO un metodo, e finché nessuno costruisce il
// materiale non viene valutato — e `npm test` restava tutto verde. Il guasto
// usciva solo nel browser, come «ReferenceError» dentro la costruzione della
// fabbrica, cioè con lo schermo vuoto e la scena a metà.
//
// È la stessa famiglia dei difetti che presidiano `glsl-backtick` e
// `glsl-una-riga`: roba che non si vede finché non gira su una GPU. Qui basta
// leggere il testo: un nome che si USA e non si DEFINISCE (né si importa) è
// sempre un errore, e costa un secondo scoprirlo.

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const MOTORE = fileURLToPath(new URL('../src/motore/', import.meta.url));

test('nessun GLSL_* usato senza essere definito o importato', () => {
  const colpevoli = [];
  for (const nome of readdirSync(MOTORE)) {
    if (!nome.endsWith('.js')) continue;
    const testo = readFileSync(join(MOTORE, nome), 'utf8');

    // dove NASCE un nome: definito qui, oppure importato da un altro file
    const definiti = new Set();
    for (const m of testo.matchAll(/\b(?:export\s+)?const\s+(GLSL_[A-Z_]+)\s*=/g)) definiti.add(m[1]);
    for (const m of testo.matchAll(/import\s*\{([^}]*)\}\s*from/g)) {
      for (const pezzo of m[1].split(',')) {
        const pulito = pezzo.trim().split(/\s+as\s+/)[0].trim();
        if (/^GLSL_[A-Z_]+$/.test(pulito)) definiti.add(pulito);
      }
    }

    // ⚠ E I NOMI DENTRO IL GLSL NON CONTANO: un innesto può nominare per esteso
    // una costante nei suoi commenti senza che quello sia un riferimento
    // JavaScript. Si guardano solo i nomi FUORI dai template.
    const senzaTemplate = testo.replace(/`[\s\S]*?`/g, '``');
    for (const m of senzaTemplate.matchAll(/\b(GLSL_[A-Z_]+)\b/g)) {
      if (!definiti.has(m[1])) colpevoli.push(`${nome}: ${m[1]}`);
    }
  }
  assert.deepEqual([...new Set(colpevoli)], [],
    'costanti GLSL usate e mai definite (il file si importa lo stesso: il guasto esce solo a schermo)');
});

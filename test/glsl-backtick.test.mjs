// UN BACKTICK DENTRO IL GLSL CHIUDE IL TEMPLATE.
//
// ⚠ NOVE VOLTE fra Leafy-Lantern e Leafy-Shadows, e sempre nello stesso modo:
// si cita un identificatore in un commento dentro `Vertex_Before_PositionUpdated(`…`)`
// e il template finisce lì. L'errore esce dieci righe più in là, con un nome che
// non c'entra («missing ) after argument list»), quindi si cerca nel posto
// sbagliato. In Lantern c'era già questa prova e me ne sono dimenticato al primo
// file nuovo del progetto nuovo.
//
// Dentro il GLSL si cita con «virgolette basse». Sempre.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';

const RADICE = fileURLToPath(new URL('../src/', import.meta.url));

function tuttiIFile(dir, out = []) {
  for (const n of readdirSync(dir)) {
    const p = join(dir, n);
    if (statSync(p).isDirectory()) tuttiIFile(p, out);
    else if (n.endsWith('.js')) out.push(p);
  }
  return out;
}

test('nessun backtick dentro un innesto GLSL', () => {
  const colpevoli = [];
  for (const f of tuttiIFile(RADICE)) {
    const s = readFileSync(f, 'utf8');
    // ogni template passato a un innesto o a ShadersStore
    const blocchi = s.match(/(?:(?:Vertex|Fragment)_[A-Za-z_]+\(|ShadersStore\[[^\]]+\]\s*=\s*)(?:\/\* glsl \*\/)?`[\s\S]*?`/g) || [];
    for (const b of blocchi) {
      // il template è già stato chiuso dal parser: se dentro ci fosse un
      // backtick il file non compilerebbe. Qui si cerca il caso che compila
      // per caso — un backtick nel testo che sposta il confine del template.
      const dentro = b.slice(b.indexOf('`') + 1, -1);
      if (dentro.includes('`')) colpevoli.push(f.slice(RADICE.length));
    }
    // e la rete di sicurezza vera: il file deve compilare
  }
  assert.deepEqual(colpevoli, [], 'backtick dentro il GLSL: ' + colpevoli.join(', '));
});

test('e ogni file di src/ si analizza senza errori di sintassi', async () => {
  const { execFileSync } = await import('node:child_process');
  for (const f of tuttiIFile(RADICE)) {
    try { execFileSync(process.execPath, ['--check', f], { stdio: 'pipe' }); }
    catch (e) { assert.fail(`${f.slice(RADICE.length)} non compila:\n${e.stderr}`); }
  }
});

// ⚠ E LA STESSA TRAPPOLA VALE PER IL CSS. Un backtick dentro un template
// letterale lo CHIUDE, qualunque cosa ci sia dentro — GLSL, CSS o prosa. L'ho
// ripresa scrivendo un commento in `ui/barra.js` che citava «scroll-snap» fra
// apici inversi, ed è morto tutto con «Unexpected identifier 'scroll'».
// La regola della casa sono le «virgolette basse», e qui si presidia.
test('nessun backtick dentro i template della UI', () => {
  const dir = new URL('../src/ui/', import.meta.url);
  const colpevoli = [];
  for (const n of readdirSync(dir)) {
    if (!n.endsWith('.js')) continue;
    const testo = readFileSync(new URL(n, dir), 'utf8');
    // i blocchi di stile: `const CSS = \`…\`` e simili
    for (const m of testo.matchAll(/const\s+[A-Z_]+\s*=\s*`([\s\S]*?)`;/g)) {
      if (m[1].includes('`')) colpevoli.push(n);
    }
  }
  assert.deepEqual(colpevoli, [], 'un backtick chiude il template: usare le «virgolette basse»');
});

// ⚠ E NIENTE LETTERE ACCENTATE NEI NOMI GLSL: il codice qui dentro si scrive in
// italiano (commenti compresi, ed è giusto così), ma un identificatore con la
// «ì» — `terraLì` — non è GLSL valido: il programma non compila, l'eccezione
// ferma il costruttore della resa e la pagina resta BIANCA, senza un errore che
// dica dove. Le parole accentate stanno nei commenti; i nomi no.
test('nessun identificatore accentato nel GLSL (i commenti possono)', () => {
  const colpevoli = [];
  for (const f of tuttiIFile(RADICE)) {
    const s = readFileSync(f, 'utf8');
    for (const b of s.match(/`#version 300 es[\s\S]*?`/g) || []) {
      const senzaCommenti = b.replace(/\/\/[^\n]*/g, '').replace(/\/\*[\s\S]*?\*\//g, '');
      for (const nome of senzaCommenti.match(/[A-Za-z_][A-Za-z_0-9]*[^\x00-\x7f\s][A-Za-z_0-9]*/g) || []) {
        colpevoli.push(`${f.slice(RADICE.length)}: ${nome}`);
      }
    }
  }
  assert.deepEqual(colpevoli, [], 'identificatori accentati nel GLSL: ' + colpevoli.join(', '));
});

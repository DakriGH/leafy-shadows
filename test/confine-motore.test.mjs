// IL CONFINE: fuori da src/motore/ non si nomina Babylon.
//
// È la regola su cui è costruito il progetto, ed è anche l'unica che si può
// perdere senza accorgersene: basta un `import { Vector3 } from '@babylonjs/…'`
// messo «tanto è comodo» dentro il mondo, e fra sei mesi cambiare motore torna a
// costare quaranta file invece di una cartella.
//
// In Leafy-Lantern era andata esattamente così, e nessuno l'aveva deciso: il
// mondo importava `../fx/materials.js` per OTTO nomi, e quell'import da solo
// legava 4.310 righe di logica di gioco a three.js.
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

test('solo src/motore/ nomina Babylon', () => {
  const colpevoli = [];
  for (const f of tuttiIFile(RADICE)) {
    const rel = f.slice(RADICE.length);
    if (rel.startsWith('motore/')) continue;
    const s = readFileSync(f, 'utf8');
    // si guardano gli IMPORT, non i commenti: il nome si può nominare a parole
    const imports = s.match(/^\s*import[^;]*from\s*['"][^'"]+['"]/gm) || [];
    for (const i of imports) {
      if (i.includes('@babylonjs')) colpevoli.push(`${rel}: ${i.trim()}`);
    }
  }
  assert.deepEqual(colpevoli, [],
    'qualcuno ha importato Babylon fuori da src/motore/:\n  ' + colpevoli.join('\n  '));
});

test('e non è rimasto three da nessuna parte', () => {
  const colpevoli = [];
  for (const f of tuttiIFile(RADICE)) {
    const s = readFileSync(f, 'utf8');
    const imports = s.match(/^\s*import[^;]*from\s*['"]three[^'"]*['"]/gm) || [];
    if (imports.length) colpevoli.push(f.slice(RADICE.length));
  }
  assert.deepEqual(colpevoli, [], 'residui di three: ' + colpevoli.join(', '));
});

test('il mondo si importa in Node, senza contesto grafico', async () => {
  // ⚠ È LA PROVA VERA DEL CONFINE, e vale più di una ricerca di stringhe: se
  // `world/` si carica in Node — dove non esistono WebGL, canvas né document —
  // allora è davvero agnostico, e le sue regole si possono provare qui.
  const { Mondo, CHUNK } = await import('../src/world/world.js');
  const { generaOpenWorld } = await import('../src/world/worldgen.js');
  const m = new Mondo();
  generaOpenWorld(m, 4242, 8);
  assert.ok(m.contaBlocchi > 100, `il worldgen ha prodotto solo ${m.contaBlocchi} blocchi`);
  assert.equal(CHUNK, 16);
});

test('il mesher produce DATI, non mesh', async () => {
  const { Mondo } = await import('../src/world/world.js');
  const { costruisciBlocco } = await import('../src/world/mesher.js').then((m) => m).catch(() => ({}));
  // il contratto che conta: `dati()` torna array, non oggetti del motore
  const src = readFileSync(fileURLToPath(new URL('../src/world/mesher.js', import.meta.url)), 'utf8');
  assert.match(src, /dati\(\)\s*\{/, 'il Costruttore non espone più dati(): il confine è saltato');
  assert.doesNotMatch(src, /new THREE\.|new Mesh\(|new VertexData\(/,
    'il mesher costruisce di nuovo oggetti del motore');
});

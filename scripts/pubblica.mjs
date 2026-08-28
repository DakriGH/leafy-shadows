// PUBBLICA SU GITHUB PAGES.
//
// ⚠ QUI IL BUNDLE CI VUOLE, e non contraddice lo zero-build: sono due bersagli
// diversi. In sviluppo i moduli ES + import map sono un vantaggio — si salva e
// si ricarica, niente attesa. In rete no: `@babylonjs/core` sono **2.224 file**
// e il gioco ne tocca qualche centinaio, cioè qualche centinaio di richieste
// HTTP prima del primo fotogramma. Su una connessione di casa è un'attesa; su un
// telefono in 4G è un abbandono.
//
// Quindi: zero-build per lavorare, un file solo per pubblicare. Stesso
// trattamento dell'ispettore (`npm run ispettore`).
//
// ⚠ E SI PUBBLICA SOLO IL COSTRUITO. Il sorgente resta qui; su GitHub va un repo
// pubblico che contiene la build e basta — è lo stesso schema di Leafy-Lantern,
// e la ragione è che Pages gratuito vuole un repo pubblico.

import { build } from 'esbuild';
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, rmSync, writeFileSync, readFileSync, cpSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const radice = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(radice, 'www');
const DESTINAZIONE = process.argv[2] || 'leafy-shadows';
if (!/^[a-z0-9-]+$/.test(DESTINAZIONE)) throw new Error(`nome repo sospetto: ${DESTINAZIONE}`);
const REMOTO = `https://github.com/DakriGH/${DESTINAZIONE}.git`;
const lavoro = join(radice, '.pubblicazione', DESTINAZIONE);

const esegui = (c, dove) => execSync(c, { cwd: dove, stdio: 'inherit' });
const zitto = (c, dove) => { try { return execSync(c, { cwd: dove, encoding: 'utf8' }).trim(); } catch { return ''; } };

// ── 1. il bundle ────────────────────────────────────────────────────────────
console.log('1/4  impacchetto…');
rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

const versione = zitto('git rev-parse --short HEAD', radice) || 'senza-versione';
const quando = new Date().toLocaleString('it', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

// ⚠ DUE INGRESSI: il gioco e lo ZOO. Lo zoo si pubblica insieme perché il suo
// mestiere è farsi guardare — su questa macchina, sul telefono, sul Chromebook,
// e da chiunque debba dire «qui c'è l'acne». Un banco di prova che vive solo in
// locale non lo apre nessuno.
const esito = await build({
  entryPoints: [join(radice, 'src/main.js'), join(radice, 'src/zoo.js')],

  bundle: true,
  format: 'esm',
  minify: true,
  sourcemap: false,
  outdir: join(www),
  entryNames: '[name]',
  // ⚠ L'ISPETTORE RESTA FUORI. È 12,8 MB di attrezzo da sviluppo e lo si carica
  // con un `import()` dinamico dentro un try/catch: in rete quella risoluzione
  // fallisce, il catch la raccoglie, e il gioco non se ne accorge. Metterlo
  // dentro vorrebbe dire spedire a tutti un pannello di debug.
  external: ['@babylonjs/inspector'],
  define: { 'process.env.NODE_ENV': '"production"' },
  legalComments: 'none',
  metafile: true,
  logLevel: 'info',
});

for (const [f, o] of Object.entries(esito.metafile.outputs)) {
  console.log(`     ${f.split('/').pop()} = ${(o.bytes / 1048576).toFixed(2)} MB`);
}

// ── 2. la pagina ────────────────────────────────────────────────────────────
// stessa di sviluppo, meno la import map (non serve più: è tutto dentro) e con
// la versione a schermo, che è l'unico modo di sapere COSA si sta guardando
const pagina = readFileSync(join(radice, 'index.html'), 'utf8')
  .replace(/<script type="importmap">[\s\S]*?<\/script>\s*/, '')
  // ⚠ LA VERSIONE NELL'URL, e non è pignoleria: GitHub Pages tiene in cache i
  // file per dieci minuti, e un ricaricamento normale ridà il bundle VECCHIO.
  // Il committente ci ha perso un giro pensando che due correzioni non fossero
  // state fatte — erano fatte, era la cache. Con la versione nel nome il
  // browser non ha scelta: è un file che non ha mai visto.
  .replace("import('./src/main.js').catch(guasto);", `import('./main.js?v=${versione}').catch(guasto);`)
  .replace('<div id="stato">avvio…</div>', `<div id="stato">avvio…</div>\n  <div id="versione" style="position:fixed;right:8px;bottom:6px;z-index:10;font:11px ui-monospace,monospace;color:rgba(13,42,26,.55);pointer-events:none">${quando} · ${versione}</div>`);
writeFileSync(join(www, 'index.html'), pagina);

// la pagina dello zoo, dalla stessa sorgente
const paginaZoo = readFileSync(join(radice, 'zoo.html'), 'utf8')
  .replace(/<script type="importmap">[\s\S]*?<\/script>\s*/, '')
  .replace("import('./src/zoo.js').catch(guasto);", `import('./zoo.js?v=${versione}').catch(guasto);`)
  .replace('<div id="stato">avvio…</div>', `<div id="stato">avvio…</div>\n  <div id="versione" style="position:fixed;right:8px;bottom:6px;z-index:10;font:11px ui-monospace,monospace;color:rgba(13,42,26,.55);pointer-events:none">${quando} · ${versione}</div>`);
writeFileSync(join(www, 'zoo.html'), paginaZoo);
writeFileSync(join(www, '.nojekyll'), '');
cpSync(join(radice, 'modelli'), join(www, 'modelli'), { recursive: true });

// ── 3. il clone di pubblicazione ────────────────────────────────────────────
console.log('2/4  preparo il repo…');
mkdirSync(lavoro, { recursive: true });
if (!existsSync(join(lavoro, '.git'))) {
  esegui(`git clone -q ${REMOTO} .`, lavoro);
} else {
  esegui('git fetch -q origin && git reset -q --hard origin/main', lavoro);
}
for (const n of ['index.html', 'zoo.html', 'main.js', 'zoo.js', '.nojekyll']) {
  cpSync(join(www, n), join(lavoro, n));
}
// i modelli: sono dati, non codice, e vanno accanto alla pagina
cpSync(join(radice, 'modelli'), join(lavoro, 'modelli'), { recursive: true });

// ── 4. il push ──────────────────────────────────────────────────────────────
console.log('3/4  cerco cosa è cambiato…');
esegui('git add -A', lavoro);
if (!zitto('git status --porcelain', lavoro)) {
  console.log('\n✅ Niente di nuovo da pubblicare.');
  process.exit(0);
}
console.log('4/4  pubblico…');
esegui(`git -c user.email=dakriworke@gmail.com -c user.name=DakriGH commit -q -m "build dal sorgente ${versione}"`, lavoro);
esegui('git push -q origin HEAD:main', lavoro);
console.log(`\n✅ Fatto. Fra un minuto è aggiornato su:\n   https://dakrigh.github.io/${DESTINAZIONE}/\n`);

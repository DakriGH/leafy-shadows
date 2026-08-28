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

const esito = await build({
  entryPoints: [join(radice, 'src/main.js')],
  bundle: true,
  format: 'esm',
  minify: true,
  sourcemap: false,
  outfile: join(www, 'leafy.js'),
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

const peso = Object.values(esito.metafile.outputs)[0].bytes;
console.log(`     leafy.js = ${(peso / 1048576).toFixed(2)} MB`);

// ── 2. la pagina ────────────────────────────────────────────────────────────
// stessa di sviluppo, meno la import map (non serve più: è tutto dentro) e con
// la versione a schermo, che è l'unico modo di sapere COSA si sta guardando
const pagina = readFileSync(join(radice, 'index.html'), 'utf8')
  .replace(/<script type="importmap">[\s\S]*?<\/script>\s*/, '')
  .replace("import('./src/main.js').catch(guasto);", "import('./leafy.js').catch(guasto);")
  .replace('<div id="stato">avvio…</div>', `<div id="stato">avvio…</div>\n  <div id="versione" style="position:fixed;right:8px;bottom:6px;z-index:10;font:11px ui-monospace,monospace;color:rgba(13,42,26,.55);pointer-events:none">${quando} · ${versione}</div>`);
writeFileSync(join(www, 'index.html'), pagina);
writeFileSync(join(www, '.nojekyll'), '');

// ── 3. il clone di pubblicazione ────────────────────────────────────────────
console.log('2/4  preparo il repo…');
mkdirSync(lavoro, { recursive: true });
if (!existsSync(join(lavoro, '.git'))) {
  esegui(`git clone -q ${REMOTO} .`, lavoro);
} else {
  esegui('git fetch -q origin && git reset -q --hard origin/main', lavoro);
}
for (const n of ['index.html', 'leafy.js', '.nojekyll']) {
  cpSync(join(www, n), join(lavoro, n));
}

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

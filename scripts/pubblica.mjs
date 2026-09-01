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
import { createHash } from 'node:crypto';
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

// ⚠ E IL «+» QUANDO L'ALBERO NON È COMMITTATO, che sembra un dettaglio e ha già
// fatto perdere un giro: la build pubblicata portava lo stesso codice di commit
// di quella vecchia (perché nessuno aveva committato in mezzo), e leggendo
// l'etichetta a schermo sembrava che la pubblicazione non fosse andata. Cambia
// solo l'ora, ed è facile non guardarla. Con il «+» si legge a colpo d'occhio:
// «questa è roba oltre l'ultimo commit».
const _rif = zitto('git rev-parse --short HEAD', radice) || 'senza-versione';
const _sporco = !!zitto('git status --porcelain', radice);
const versione = _sporco ? `${_rif}+` : _rif;
const quando = new Date().toLocaleString('it', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });

// ⚠ TRE INGRESSI: il gioco, lo ZOO e il BANCO DELL'ACQUA. I due banchi si
// pubblicano insieme al gioco perché il loro mestiere è farsi guardare — su
// questa macchina, sul telefono, sul Chromebook, e da chiunque debba dire «qui
// c'è l'acne» o «questo stile dell'acqua no». Un banco di prova che vive solo in
// locale non lo apre nessuno, ed è successo: gli stili dell'acqua si sceglievano
// a parole finché non sono stati raggiungibili da un link.
const esito = await build({
  // ⚠ QUATTRO INGRESSI: il quarto è il WORKER del mesher, che il browser carica
  // da solo con `new Worker(new URL('./mesher-worker.js', import.meta.url))` —
  // quindi deve esistere come file suo accanto a main.js, con lo stesso nome.
  // esbuild non segue i Worker da sé: se manca da qui, in rete il mesher
  // torna in linea in silenzio (il ripiego c'è, ma non è quello che si vuole).
  entryPoints: [join(radice, 'src/main.js'), join(radice, 'src/zoo.js'), join(radice, 'src/banco-acqua.js'), join(radice, 'src/world/mesher-worker.js')],

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

// ⚠ E L'ETICHETTA NELL'URL DEVE CAMBIARE A OGNI PUBBLICAZIONE, se no non serve
// a niente. Usava il codice del commit, che fra due pubblicazioni con l'albero
// non committato è LO STESSO — `main.js?v=1d29546+` identico, quindi il browser
// e la CDN riservivano la copia vecchia con la coscienza a posto. È lo stesso
// difetto che si stava curando, spostato di un metro.
// ⚠ SI USA L'IMPRONTA DEL FILE COSTRUITO, non l'orologio: cambia esattamente
// quando cambia il contenuto, e due pubblicazioni identiche non buttano via la
// cache per niente.
const impronta = createHash('sha256').update(readFileSync(join(www, 'main.js'))).digest('hex').slice(0, 8);
const etichetta = `${versione}.${impronta}`;

// ── 2. le pagine ────────────────────────────────────────────────────────────
// stesse di sviluppo, meno la import map (non serve più: è tutto dentro) e con
// la versione a schermo, che è l'unico modo di sapere COSA si sta guardando.
//
// ⚠ UNA FUNZIONE SOLA PER TUTTE E TRE, e non è ordine per l'ordine: con tre
// copie della stessa sequenza di `replace` la terza pagina sarebbe nata senza
// l'etichetta della versione — cioè indistinguibile fra una pubblicazione e
// l'altra, che è esattamente il difetto che l'etichetta cura.
const targa = `<div id="versione" style="position:fixed;right:8px;bottom:26px;z-index:10;font:11px ui-monospace,monospace;color:rgba(13,42,26,.55);pointer-events:none">${quando} · ${versione}</div>`;

function preparaPagina(nomeHtml, modulo) {
  const testo = readFileSync(join(radice, nomeHtml), 'utf8')
    .replace(/<script type="importmap">[\s\S]*?<\/script>\s*/, '')
    // ⚠ LA VERSIONE NELL'URL, e non è pignoleria: GitHub Pages tiene in cache i
    // file per dieci minuti, e un ricaricamento normale ridà il bundle VECCHIO.
    // Il committente ci ha perso un giro pensando che due correzioni non fossero
    // state fatte — erano fatte, era la cache. Con la versione nel nome il
    // browser non ha scelta: è un file che non ha mai visto.
    .replace(`import('./src/${modulo}.js').catch(guasto);`, `import('./${modulo}.js?v=${etichetta}').catch(guasto);`)
    // ⚠ L'ANCORA È `</body>`, NON il pannello di stato: quello ce l'hanno il
    // gioco e lo zoo, il banco dell'acqua no — e un `replace` che non trova
    // niente non si lamenta, lascia la pagina senza targa e non lo sa nessuno.
    .replace('</body>', `  ${targa}\n</body>`);
  if (!testo.includes('id="versione"')) throw new Error(`${nomeHtml}: la targa della versione non è entrata`);
  if (testo.includes('./src/')) throw new Error(`${nomeHtml}: è rimasto un riferimento al sorgente`);
  writeFileSync(join(www, nomeHtml), testo);
}

preparaPagina('index.html', 'main');
preparaPagina('zoo.html', 'zoo');
preparaPagina('water.html', 'banco-acqua');
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
for (const n of ['index.html', 'zoo.html', 'water.html', 'main.js', 'zoo.js', 'banco-acqua.js', 'mesher-worker.js', '.nojekyll']) {
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
console.log(`\n✅ Fatto. Fra un minuto sono aggiornate:`);
console.log(`   https://dakrigh.github.io/${DESTINAZIONE}/`);
console.log(`   https://dakrigh.github.io/${DESTINAZIONE}/zoo.html`);
console.log(`   https://dakrigh.github.io/${DESTINAZIONE}/water.html\n`);

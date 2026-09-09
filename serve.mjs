// Server di sviluppo, gemello di `serve.py`: come un file server qualunque ma
// con no-cache su tutto, così gli edit si vedono al primo reload e non si
// insegue mai un modulo fantasma.
//
// ⚠ ESISTE PERCHÉ SULLA MACCHINA DI CASA NON C'È PYTHON. Tiny11 non lo porta e
// quello che risponde a `python` è solo l'alias finto del Microsoft Store. Node
// invece serve comunque (npm, le prove, `npm run pubblica`), quindi il server
// si scrive con quello che c'è già: una dipendenza in meno da installare e da
// ricordarsi. `serve.py` resta per chi ha Python.
//
// Uso: `npm run avvia` (oppure `node serve.mjs 8144`).

import { createReadStream, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const PORTA = Number(process.argv[2]) || 8144;
const RADICE = fileURLToPath(new URL('.', import.meta.url)); // sempre la cartella del gioco

// ⚠ IL TIPO CONTA DAVVERO PER I MODULI: un `.js` servito come `text/plain` il
// browser si rifiuta di eseguirlo come modulo ES, e l'errore che si legge parla
// di MIME type, non di percorsi — si perde tempo a cercare il file sbagliato.
// E `.wasm` DEVE essere `application/wasm`: Havok si carica con
// `WebAssembly.instantiateStreaming`, che con un tipo diverso rifiuta e basta.
const TIPI = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.wasm': 'application/wasm',
  '.glb': 'model/gltf-binary',
  '.gltf': 'model/gltf+json',
  '.bin': 'application/octet-stream',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.md': 'text/plain; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.ogg': 'audio/ogg',
  '.wav': 'audio/wav',
};

const server = createServer((req, res) => {
  // la query si butta: `?officina`, `?mondo=48`, `?v=` sono roba della pagina
  let percorso;
  try {
    percorso = decodeURIComponent(new URL(req.url, 'http://x').pathname);
  } catch {
    res.writeHead(400).end('indirizzo storto');
    return;
  }

  // ⚠ NIENTE USCITE DALLA RADICE. `normalize` risolve i `..` PRIMA di
  // concatenare: senza, un `/../../.ssh/id_rsa` uscirebbe dalla cartella. È un
  // server di casa, ma resta in ascolto su tutte le interfacce.
  const dentro = normalize(join(RADICE, percorso));
  if (!dentro.startsWith(RADICE)) {
    res.writeHead(403).end('fuori dalla radice');
    return;
  }

  let file = dentro;
  let info;
  try {
    info = statSync(file);
    if (info.isDirectory()) {
      file = join(file, 'index.html');
      info = statSync(file);
    }
  } catch {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
       .end(`non trovato: ${percorso}`);
    return;
  }

  res.writeHead(200, {
    'Content-Type': TIPI[extname(file).toLowerCase()] || 'application/octet-stream',
    'Content-Length': info.size,
    'Cache-Control': 'no-store, must-revalidate',
  });
  if (req.method === 'HEAD') { res.end(); return; }

  const flusso = createReadStream(file);
  flusso.pipe(res);
  // il browser che annulla una richiesta (ricarica a metà caricamento) chiude il
  // socket: senza questo Node stampa un ECONNRESET e sembra un guasto del gioco
  flusso.on('error', () => res.destroy());
  res.on('close', () => flusso.destroy());
});

server.listen(PORTA, () => {
  console.log(`Leafy-Shadows su http://localhost:${PORTA}`);
  console.log(`  lo zoo      http://localhost:${PORTA}/zoo.html`);
  console.log(`  l'acqua     http://localhost:${PORTA}/water.html`);
  console.log(`  il nucleo   http://localhost:${PORTA}/nucleo.html`);
  console.log(`  la partita  http://localhost:${PORTA}/partita.html`);
});

server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`la porta ${PORTA} è già occupata — un altro server è vivo, o passane un'altra: node serve.mjs 8145`);
    process.exit(1);
  }
  throw e;
});

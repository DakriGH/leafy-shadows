#!/usr/bin/env node
// IL COLLETTORE — serve il gioco E raccoglie i rapporti di diagnostica.
//
// ⚠ UNA COSA SOLA E NON DUE, ed è il motivo per cui questo file sostituisce il
// «python3 -m http.server» che si usava prima: se il collettore stesse su una
// porta sua, il gioco caricato da un'altra origine non potrebbe parlargli senza
// CORS, e soprattutto ci sarebbero due comandi da ricordare invece di uno.
// Servendo anche le pagine, il rapporto va alla STESSA origine da cui è arrivato
// il gioco — che funziona sempre, anche da un telefono via Tailscale.
//
// ⚠ NIENTE PIÙ GETTONE (10/09/2026), e la ragione vale più della comodità: la
// password non faceva da lucchetto ma da INDIRIZZO, e se su un dispositivo ne
// finiva una diversa i rapporti da lì sparivano SENZA UN ERRORE: il gioco
// diceva «mandato ✔» e il lettore «nessun rapporto», tutt'e due veri. È
// successo davvero, col Chromebook. Adesso non c'è niente da digitare.
//
// Uso:  node strumenti/diagnostica.mjs [porta]
// Poi:  apri il gioco dal telefono su questo indirizzo e premi 🩺. Basta quello.

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises';
import { extname, join, normalize, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { networkInterfaces } from 'node:os';

// ⚠ `fileURLToPath`, NON `new URL(...).pathname`: su Windows quel campo vale
// «/C:/Users/…» — con lo slash davanti e i %20 al posto degli spazi — e
// `resolve` ci antepone la radice del disco, quindi la radice diventava un
// percorso col disco DUE VOLTE e gli spazi ancora codificati. Il collettore in
// casa non ha mai potuto aprire un file sulla macchina del committente:
// moriva con un ENOENT su un percorso che nessuno ha mai scritto. Su Linux e
// macOS il campo coincide col percorso, e per questo e' rimasto invisibile.
const RADICE = fileURLToPath(new URL('..', import.meta.url));
const CARTELLA = join(RADICE, 'diagnostica');
const PORTA = Number(process.argv[2]) || 8144;
/** ⚠ Un tetto, se no un rapporto con dentro uno scatto sbagliato riempie il
 *  disco. 8 MB stanno larghi anche per una figura a piena risoluzione. */
const MAX_CORPO = 8 * 1024 * 1024;

// ---- COSA NON SI SERVE MAI --------------------------------------------------
//
// ⚠ QUESTO SERVER PUÒ FINIRE SU INTERNET, e cambia tutto. Finché stava sulla
// rete di casa serviva la cartella del progetto e amen; aperto al mondo, un
// «GET /.env» consegnerebbe quello che ci fosse dentro a chiunque lo chieda, e
// «GET /.git/config» il resto. Non è un difetto che si nota: il file arriva e
// nessuno se ne accorge.
//
// ⚠ DIVIETI **E** PERMESSI, tutti e due. Un permesso dimenticato si vede subito
// (il gioco non parte); un divieto dimenticato non si vede MAI. Quindi il
// divieto è largo — tutto quello che comincia per punto, i rapporti già arrivati,
// i log — e in più passa solo chi ha un'estensione che al gioco serve davvero.
const VIETATI = [
  /(^|\/)\./,                  // .git, .env, .gitignore: qualunque cosa nascosta
  /^\/?diagnostica\//,         // i rapporti già arrivati
  /\.log$/i,
];

// ⚠ NIENTE PIÙ GETTONE E NIENTE PIÙ LUCCHETTO (10/09/2026). Servivano a una
// cosa sola — che un rapporto arrivasse solo da noi — e costavano una password
// da digitare su ogni dispositivo, che è precisamente il pezzo che si è rotto
// (su un coso ne era finita una diversa e i rapporti sparivano in silenzio).
// Questo server è uno STRUMENTO DI SVILUPPO su una rete di casa: chi ci arriva
// può già leggere il sorgente del gioco. Le guardie che restano sono quelle che
// contano davvero — l'elenco dei file che NON si servono, e il tetto sul corpo.

// ⚠ E MANCARE UN TIPO QUI NON DÀ UN ERRORE DI PERMESSI: dà un 404. La riga
// sotto è insieme il permesso e la tabella dei tipi, quindi un'estensione
// dimenticata sparisce come «non c'è» — si va a cercare il file, e il file
// c'è. È successo con `.bin`: i modelli del nucleo (`modelli/nucleo/*.bin`,
// formato LNM1) non arrivavano quando il gioco era servito dal collettore
// invece che da `serve.mjs`, e mancavano alberi e lampioni senza un messaggio.
const TIPI = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.webp': 'image/webp', '.glb': 'model/gltf-binary', '.gltf': 'model/gltf+json',
  '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.wasm': 'application/wasm',
  '.bin': 'application/octet-stream', '.txt': 'text/plain; charset=utf-8',
};


/** Gli indirizzi da cui il gioco è raggiungibile: comodo per aprirlo dal telefono. */
function indirizzi() {
  const fuori = [];
  for (const [nome, elenco] of Object.entries(networkInterfaces())) {
    for (const i of elenco || []) {
      if (i.family === 'IPv4' && !i.internal) fuori.push(`${i.address}  (${nome})`);
    }
  }
  return fuori;
}

async function salva(rapporto) {
  await mkdir(CARTELLA, { recursive: true });
  const esistenti = (await readdir(CARTELLA).catch(() => [])).filter((n) => n.endsWith('.json'));
  const n = String(esistenti.length + 1).padStart(3, '0');
  const cl = (rapporto.dispositivo && rapporto.dispositivo.classe) || 'ignoto';
  // ⚠ IL NOME DEL FILE DICE GIÀ LA COSA PRINCIPALE — numero, che macchina,
  // quanti fps — così l'elenco della cartella si legge senza aprire niente.
  const fps = (rapporto.prestazioni && rapporto.prestazioni.fps) ?? '?';
  const nome = `${n}-${cl}-${fps}fps.json`;
  await writeFile(join(CARTELLA, nome), JSON.stringify(rapporto, null, 1));
  // ⚠ E LO SCATTO SI SCRIVE A PARTE, come figura vera: dentro il JSON è una
  // riga di base64 lunga mezzo milione di caratteri, che rende il file
  // illeggibile proprio nello strumento (il terminale) in cui va letto.
  let figura = null;
  if (typeof rapporto.scatto === 'string' && rapporto.scatto.startsWith('data:image/')) {
    const virgola = rapporto.scatto.indexOf(',');
    const est = rapporto.scatto.slice(11, rapporto.scatto.indexOf(';')) || 'png';
    figura = `${n}-${cl}.${est}`;
    await writeFile(join(CARTELLA, figura), Buffer.from(rapporto.scatto.slice(virgola + 1), 'base64'));
  }
  return { nome, figura };
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');

  if (req.method === 'POST' && url.pathname === '/_diagnostica') {
    const ip = (req.headers['x-forwarded-for'] || '').split(',')[0].trim() || req.socket.remoteAddress || '?';
    let corpo = '', troppo = false;
    req.on('data', (c) => {
      corpo += c;
      if (corpo.length > MAX_CORPO) { troppo = true; req.destroy(); }
    });
    req.on('end', async () => {
      if (troppo) return;
      try {
        const r = JSON.parse(corpo);
        const { nome, figura } = await salva(r);
        const p = r.prestazioni || {};
        console.log(`\n📩  ${nome}${figura ? '  + ' + figura : ''}`);
        console.log(`    ${p.fps ?? '?'} fps · ${p.p50ms ?? '?'}/${p.p99ms ?? '?'} ms · ` +
          `${p.disegni ?? '?'} disegni · ${(p.triangoli ?? 0).toLocaleString('it')} triangoli`);
        if (r.nota) console.log(`    «${r.nota}»`);
        res.writeHead(200, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ ok: true, nome }));
      } catch (e) {
        res.writeHead(400, { 'content-type': 'text/plain' });
        res.end('rapporto illeggibile: ' + e.message);
      }
    });
    return;
  }

  // ⚠ SERVE A SAPERE SE IL COLLETTORE C'È, senza mandargli niente: il bottone lo
  // chiede prima, così può dire «non c'è nessuno che ascolta» invece di provare
  // a spedire e fallire con un errore di rete che non spiega niente.
  if (url.pathname === '/_diagnostica') {
    res.writeHead(200, { 'content-type': 'application/json' });
    return res.end(JSON.stringify({ collettore: true }));
  }

  // ---- file statici ---------------------------------------------------------
  let p = decodeURIComponent(url.pathname);
  if (p.endsWith('/')) p += 'index.html';
  // ⚠ NIENTE USCITE DALLA RADICE: «normalize» scioglie i «..» e poi si controlla
  // che quello che resta stia ancora dentro casa. Senza, un percorso come
  // /../../etc/passwd servirebbe qualunque file del disco.
  const dentro = join(RADICE, normalize(p));
  if (!dentro.startsWith(RADICE)) { res.writeHead(403); return res.end('no'); }
  // ⚠ E IL DIVIETO SI CONTROLLA SUL PERCORSO SCIOLTO, non su quello arrivato:
  // «/.env», «/./.env» e «/a/../.env» sono lo stesso file scritto in tre modi:
  // sono lo stesso file scritto in tre modi, e un controllo fatto prima di
  // sciogliere i «..» li lascerebbe passare tutti tranne il primo.
  const relativo = dentro.slice(RADICE.length);
  if (VIETATI.some((r) => r.test(relativo)) || !TIPI[extname(dentro)]) {
    // ⚠ E SI RISPONDE «non c'è», non «non puoi»: un 403 conferma che il file
    // esiste, e su un indirizzo pubblico è già un'informazione di troppo.
    res.writeHead(404, { 'content-type': 'text/plain' });
    return res.end('non c\'è');
  }
  try {
    const dati = await readFile(dentro);
    res.writeHead(200, {
      'content-type': TIPI[extname(dentro)],
      // ⚠ NIENTE CACHE, ed è ripreso da «serve.py» che questo sostituisce: senza,
      // il browser tiene i moduli vecchi e le modifiche non si vedono al primo
      // ricaricamento. È il difetto che fa perdere mezz'ora a cercare un errore
      // in un codice che sullo schermo non c'è ancora.
      'cache-control': 'no-store, must-revalidate',
    });
    res.end(dati);
  } catch {
    res.writeHead(404, { 'content-type': 'text/plain' });
    res.end('non c\'è: ' + p);
  }
});

// ⚠ E SE LA PORTA È OCCUPATA SI DICE DA CHI, invece di sputare una traccia di
// stack: quasi sempre è il vecchio «serve.py», che questo file sostituisce.
// Un errore che non dice cosa fare costa più di quello che è costato scriverlo.
server.on('error', (e) => {
  if (e.code === 'EADDRINUSE') {
    console.error(`\n  ⚠ la porta ${PORTA} è già occupata.`);
    console.error(`  Di solito è il vecchio server: fermalo (è «python3 serve.py»),`);
    console.error(`  oppure passa un'altra porta:  node strumenti/diagnostica.mjs 8146\n`);
    process.exit(1);
  }
  throw e;
});

server.listen(PORTA, '0.0.0.0', () => {
  console.log(`\n  Leafy-Shadows — collettore di diagnostica`);
  console.log(`  ─────────────────────────────────────────`);
  console.log(`  qui:       http://localhost:${PORTA}/`);
  for (const a of indirizzi()) console.log(`  da fuori:  http://${a.split(' ')[0]}:${PORTA}/   ${a.slice(a.indexOf('('))}`);
  console.log(`
  niente password: si preme 🩺 e basta.`);
  console.log(`\n  i rapporti finiscono in  diagnostica/\n`);
});

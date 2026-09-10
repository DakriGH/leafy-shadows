#!/usr/bin/env node
// LEGGI I RAPPORTI ARRIVATI DAL CLOUD.
//
// ⚠ È LA METÀ CHE MANCAVA: il gioco deposita un messaggio su ntfy.sh, e questo
// lo va a prendere. L'argomento è FISSO e sta in «src/ui/canale.js»: non c'è
// niente da digitare né da ricordare, di qua o di là.
//
// ⚠ PRIMA SI RICAVAVA DA UNA PASSWORD, ed è esattamente quello che si è rotto:
// su un dispositivo era finita una password diversa, i suoi rapporti andavano
// su un altro argomento, e non c'era modo di accorgersene — il gioco diceva
// «mandato ✔» e questo strumento «nessun rapporto», tutt'e due veri.
//
// ⚠ E L'ARGOMENTO SI IMPORTA DAL SORGENTE DEL GIOCO, non si riscrive qui: due
// copie dello stesso nome sono il difetto che questo canale ha già pagato una
// volta. Se divergono, nessuno dei due lati sbaglia e non arriva niente.
//
// ⚠ E SCARICA ANCHE GLI ALLEGATI. Sopra i 4 KB ntfy trasforma il corpo in un
// file a parte (misurato: 200 in tutti i casi fino a mezzo megabyte, ma il
// messaggio torna come «You received a file»). Un rapporto con lo scatto sta
// sempre sopra i 4 KB, quindi senza questo pezzo arriverebbero solo i rapporti
// senza figura — e il difetto sarebbe muto, perché gli altri arrivano.
//
// ⚠ GLI ALLEGATI DURANO TRE ORE, i messaggi dodici. Se un rapporto vecchio
// risulta «scaduto» non è rotto niente: è passato troppo tempo.
//
// Uso:  npm run leggi              una volta
//       npm run leggi -- --segui   resta in ascolto, mentre si prova

import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

// ⚠ `fileURLToPath`, NON `new URL(...).pathname`: su Windows quel campo vale
// «/C:/Users/…» — con lo slash davanti e i %20 al posto degli spazi — e
// `resolve` ci antepone la radice del disco, quindi la radice diventava un
// percorso col disco DUE VOLTE e gli spazi ancora codificati. Il collettore in
// casa non ha mai potuto aprire un file sulla macchina del committente: moriva
// con un ENOENT su un percorso che nessuno ha mai scritto. Su Linux e macOS il
// campo coincide col percorso, e per questo e' rimasto invisibile.
const RADICE = fileURLToPath(new URL('..', import.meta.url));
const CARTELLA = join(RADICE, 'diagnostica');

const { ARGOMENTO } = await import('../src/ui/canale.js');
const segui = process.argv.includes('--segui');

console.log(`\n  argomento:  ${ARGOMENTO}`);
console.log(`  (https://ntfy.sh/${ARGOMENTO})\n`);

await mkdir(CARTELLA, { recursive: true });
const gia = new Set(await readdir(CARTELLA).catch(() => []));

const primi = await giro();
console.log(`  ${primi} nuovi, in  diagnostica/\n`);

if (segui) {
  // ⚠ SI RICHIEDE, NON SI RESTA APPESI ALLO STREAM: quello di ntfy cade da solo
  // dopo un po', e un ascolto «per sempre» muore in silenzio dopo mezz'ora —
  // cioè proprio quando serve.
  // ⚠ MA NON OGNI DIECI SECONDI: la prima stesura lo faceva, e dopo pochi minuti
  // ntfy.sh ha risposto **429** e l'ascolto è MORTO — cioè lo strumento che deve
  // stare acceso mentre si prova si spegneva proprio mentre si provava, e senza
  // dirlo a nessuno. Trenta secondi bastano (un rapporto si aspetta, non si
  // insegue) e non si sfiora nessun tetto.
  console.log('  in ascolto (ctrl-C per smettere)…\n');
  let attesa = 30000;
  for (;;) {
    await new Promise((r) => setTimeout(r, attesa));
    const n = await giro();
    // ⚠ E SE ARRIVA UN 429 SI RALLENTA invece di morire: raddoppia fino a cinque
    // minuti, e torna normale appena il servizio riprende a rispondere.
    if (n < 0) { attesa = Math.min(attesa * 2, 300000); console.log(`  (ntfy chiede calma: riprovo fra ${attesa / 1000}s)`); continue; }
    attesa = 30000;
    if (n) console.log(`  ${n} nuovi.\n`);
  }
}

async function giro() {
  // ⚠ NIENTE QUI DENTRO PUÒ UCCIDERE L'ASCOLTO, e ci sono cascato due volte in
  // dieci minuti: prima con un 429 (troppe richieste), poi con un timeout di
  // connessione. Uno strumento che deve stare acceso MENTRE si prova e che muore
  // al primo intoppo è peggio di uno che non c'è — perché si crede acceso.
  let r;
  try {
    r = await fetch(`https://ntfy.sh/${ARGOMENTO}/json?poll=1`);
  } catch (e) {
    if (!segui) console.error('rete:', e.message);
    return -1;   // si rallenta e si riprova, non si muore
  }
  // ⚠ IL 429 NON È UN ERRORE FATALE, è «troppe richieste»: si torna -1 e chi
  // chiama rallenta. Trattarlo come gli altri faceva morire l'ascolto.
  if (r.status === 429) return -1;
  if (!r.ok) { console.error('ntfy ha detto no:', r.status); return 0; }
  const righe = (await r.text()).split('\n').filter(Boolean);
  if (!righe.length) { if (!segui) console.log('  nessun rapporto. (i messaggi durano 12 ore)'); return 0; }
  let nuovi = 0;

  for (const riga of righe) {
    let m;
    try { m = JSON.parse(riga); } catch { continue; }
    if (m.event !== 'message') continue;

    let testo = m.message || '';
    if (m.attachment && m.attachment.url) {
      const a = await fetch(m.attachment.url);
      if (!a.ok) { if (!segui) console.log(`  ⏳ ${m.id}: allegato scaduto (durano 3 ore)`); continue; }
      testo = await a.text();
    }

    let d;
    try { d = JSON.parse(testo); } catch { continue; }
    // ⚠ LA FIRMA SCARTA IL RUMORE, non protegge da niente: l'argomento è
    // pubblico e chiunque potrebbe scriverci. Serve a impedire che uno scherzo
    // riempia l'elenco e nasconda il rapporto vero.
    if (d.gioco !== 'Leafy-Shadows') continue;

    const p = d.prestazioni || {};
    const cl = (d.dispositivo && d.dispositivo.classe) || 'ignoto';
    const nome = `${m.id}-${cl}-${p.fps ?? '?'}fps.json`;
    if (gia.has(nome)) continue;
    gia.add(nome);

    // ⚠ LO SCATTO SI SCRIVE A PARTE, come figura vera: dentro il JSON è una riga
    // di base64 lunghissima, che rende il file illeggibile proprio nello
    // strumento (il terminale) in cui va letto.
    let figura = null;
    if (typeof d.scatto === 'string' && d.scatto.startsWith('data:image/')) {
      const est = d.scatto.slice(11, d.scatto.indexOf(';')) || 'png';
      figura = `${m.id}-${cl}.${est}`;
      await writeFile(join(CARTELLA, figura), Buffer.from(d.scatto.slice(d.scatto.indexOf(',') + 1), 'base64'));
    }
    await writeFile(join(CARTELLA, nome), JSON.stringify(d, null, 1));
    nuovi++;

    const quando = new Date(m.time * 1000).toLocaleString('it');
    console.log(`  📩 ${nome}${figura ? '  + ' + figura : ''}`);
    console.log(`     ${quando} · ${cl}${d.versione ? '  · build ' + d.versione : ''}`);
    console.log(`     ${p.fps ?? '?'} fps · ${p.p50ms ?? '?'}/${p.p99ms ?? '?'} ms · `
      + `${p.disegni ?? '?'} disegni · ${(p.triangoli ?? 0).toLocaleString('it')} triangoli`);
    if (d.scheda?.nome) console.log(`     ${d.scheda.nome.slice(0, 70)}`);
    if (d.nota) console.log(`     «${d.nota}»`);
    if (d.errori?.length) console.log(`     ⚠ ${d.errori.length} errori`);
    // ⚠ E L'OMEGA TEST SI STAMPA PER INTERO: è la tabella per cui il rapporto
    // esiste, e cercarla dentro un JSON da sessanta kilobyte è il modo sicuro
    // di non guardarla mai.
    if (d.allegati && d.allegati.omega) {
      console.log();
      for (const riga of String(d.allegati.omega).split('\n')) console.log('     ' + riga);
    }
    console.log();
  }
  return nuovi;
}

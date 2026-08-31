#!/usr/bin/env node
// LEGGI I RAPPORTI ARRIVATI DAL CLOUD.
//
// ⚠ È LA METÀ CHE MANCAVA: il gioco deposita un messaggio su ntfy.sh, e questo
// lo va a prendere. L'argomento si ricava dalla password — la stessa che si
// digita nel gioco — quindi non c'è nessun indirizzo da ricordare: chi ha la
// password ha anche il posto dove guardare.
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
// Uso:  node strumenti/leggi-diagnostica.mjs [password]
//       (senza password legge «diagnostica.chiave»)

import { createHash } from 'node:crypto';
import { mkdir, writeFile, readdir } from 'node:fs/promises';
import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

const RADICE = resolve(new URL('..', import.meta.url).pathname);
const CARTELLA = join(RADICE, 'diagnostica');
const FILE_CHIAVE = join(RADICE, 'diagnostica.chiave');

const password = process.argv[2]
  || (existsSync(FILE_CHIAVE) ? readFileSync(FILE_CHIAVE, 'utf8').trim() : '');
if (!password) {
  console.error('serve la password: node strumenti/leggi-diagnostica.mjs <password>');
  process.exit(1);
}

/** ⚠ LO STESSO CONTO DEL GIOCO, alla lettera: stesso prefisso, stesso taglio.
 *  Se le due parti calcolassero due nomi diversi non ci sarebbe nessun errore —
 *  semplicemente non arriverebbe mai niente, che è il difetto peggiore. */
function argomentoDi(pw) {
  const esa = createHash('sha256').update('leafy-shadows/' + pw).digest('hex');
  return 'leafy-' + esa.slice(0, 24);
}

const argomento = argomentoDi(password);
console.log(`\n  argomento:  ${argomento}`);
console.log(`  (https://ntfy.sh/${argomento})\n`);

const r = await fetch(`https://ntfy.sh/${argomento}/json?poll=1`);
if (!r.ok) { console.error('ntfy ha detto no:', r.status); process.exit(1); }
const righe = (await r.text()).split('\n').filter(Boolean);
if (!righe.length) { console.log('  nessun rapporto. (i messaggi durano 12 ore)\n'); process.exit(0); }

await mkdir(CARTELLA, { recursive: true });
const gia = new Set(await readdir(CARTELLA).catch(() => []));
let nuovi = 0;

for (const riga of righe) {
  let m;
  try { m = JSON.parse(riga); } catch { continue; }
  if (m.event !== 'message') continue;

  let testo = m.message || '';
  if (m.attachment && m.attachment.url) {
    const a = await fetch(m.attachment.url);
    if (!a.ok) {
      console.log(`  ⏳ ${m.id}: allegato scaduto (durano 3 ore)`);
      continue;
    }
    testo = await a.text();
  }

  let d;
  try { d = JSON.parse(testo); } catch { console.log(`  ? ${m.id}: non è un rapporto`); continue; }
  if (d.gioco !== 'Leafy-Shadows') { console.log(`  ? ${m.id}: non è roba nostra`); continue; }

  const p = d.prestazioni || {};
  const cl = (d.dispositivo && d.dispositivo.classe) || 'ignoto';
  const nome = `${m.id}-${cl}-${p.fps ?? '?'}fps.json`;
  if (gia.has(nome)) continue;

  // ⚠ LO SCATTO SI SCRIVE A PARTE, come figura vera: dentro il JSON è una riga
  // di base64 lunghissima, che rende il file illeggibile proprio nello strumento
  // (il terminale) in cui va letto.
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
  // ⚠ LO STESSO CONTO DEL PANNELLO: lì è «q0/6» perché conta i gradini da zero.
  // Due modi di scrivere lo stesso numero fanno perdere tempo a confrontarli.
  console.log(`     ${quando} · ${cl} · q${d.qualita?.livello}/${(d.qualita?.di ?? 1) - 1}` +
    `${d.versione ? '  · build ' + d.versione : ''}`);
  console.log(`     ${p.fps ?? '?'} fps · ${p.p50ms ?? '?'}/${p.p99ms ?? '?'} ms · ` +
    `${p.disegni ?? '?'} disegni · ${(p.triangoli ?? 0).toLocaleString('it')} triangoli`);
  if (d.scheda?.nome) console.log(`     ${d.scheda.nome.slice(0, 70)}`);
  if (d.nota) console.log(`     «${d.nota}»`);
  if (d.errori?.length) console.log(`     ⚠ ${d.errori.length} errori`);
  console.log();
}

console.log(`  ${nuovi} nuovi, in  diagnostica/\n`);

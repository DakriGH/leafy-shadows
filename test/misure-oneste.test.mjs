// GLI STRUMENTI NON DEVONO MENTIRE, e questo progetto l'ha già pagato tre volte.
//
// ⚠ LA STORIA, perché queste prove hanno senso solo con quella accanto:
//  1. `ombreMs` riportava 3,21 ms col sole SPENTO — più che con le ombre accese
//     — perché quel contatore conservava l'ultima media quando nessun bersaglio
//     veniva più disegnato. Mezz'ora persa a cercare dalla parte sbagliata.
//  2. `misuraHz` misurava quanti fotogrammi fa la MACCHINA e non quanti ne
//     mostra lo SCHERMO: su un Chromebook a 25 fps ha letto «25 Hz», le soglie
//     si sono invertite e la scala di qualità ha pompato per un minuto.
//  3. E il 10/09/2026, dal Chromebook: la storia degli fps nel rapporto era
//     `0, -1, -2, … -36`. **FOTOGRAMMI AL SECONDO NEGATIVI**, mentre il numero
//     grande a schermo diceva un onestissimo 30. Un `dt` di circa −14,6 secondi
//     era entrato nell'elenco dei tempi e ne teneva la MEDIA sotto zero per
//     duecentoquaranta fotogrammi.
//
// ⚠ E IL DANNO NON È IL GRAFICO STORTO: da quell'elenco escono anche gli fps, il
// p50 e il p99, cioè i numeri su cui si decide cosa ottimizzare. Uno strumento
// che mente è peggio di uno che manca — se mancasse si cercherebbe altrove.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { Ritmo } from '../src/partita/ritmo.js';

const leggi = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');

/** La media di una serie, come la fa `stampa()` in partita.js. */
const media = (a) => a.reduce((x, y) => x + y, 0) / a.length;

test('⚠ UN SOLO fotogramma negativo avvelena la media per DUECENTOQUARANTA giri', () => {
  // Questa non prova il codice: prova che il difetto era REALE e grosso, e serve
  // a spiegare perché la guardia sta dove sta. La sequenza qui sotto è quella
  // arrivata dal Chromebook, ricostruita dall'aritmetica.
  const senza = [];
  for (let n = 1; n <= 239; n++) senza.push(Math.round(1000 / media([-14640, ...Array(n).fill(33.34)])));
  const visti = [senza[0], senza[9], senza[99], senza[199], senza[238]];
  assert.deepEqual(visti, [-0, -1, -9, -25, -36],
    'la ricostruzione non torna: la spiegazione del difetto è sbagliata');
  // ⚠ e duecentoquaranta fotogrammi a trenta al secondo sono OTTO SECONDI in cui
  // ogni numero del pannello è falso, all'avvio, cioè quando lo si guarda.
  assert.ok(senza.every((v) => v <= 0), 'la media resta negativa per tutto il buffer');
});

test('e la guardia sta al PUNTO D\'INGRESSO, dove il tempo entra', () => {
  // ⚠ Non dove si legge: i lettori sono cinque (fps, p50, p99, storia, rapporto)
  // e l'ingresso è uno. Una guardia per lettore è quattro occasioni di
  // dimenticarsene, e la dimenticanza non dà nessun errore.
  const p = leggi('../src/partita.js');
  assert.match(p, /if \(grezzo > 0 && grezzo < 10000\) \{ tempi\.push/,
    'in partita.js `tempi` accetta di nuovo un tempo non positivo');
  assert.match(p, /if \(js >= 0 && js < 10000\) \{ jsMs\.push/,
    'in partita.js `jsMs` accetta di nuovo un tempo assurdo');
});

test('⚠ e IL TETTO DELLA FISICA NON È IL TETTO DELLA MISURA', () => {
  // ⚠ IL DIFETTO, dal Chromebook (omega test, 10/09/2026): **p50 100,0 e p99
  // 100,0 su tutti e sette i gradini**, identici al decimo. Non era una macchina
  // stranamente regolare: `dt` ha un tetto di 0,1 s perché un fotogramma da
  // mezz'ora (una scheda tornata in primo piano) teleporterebbe il gatto dentro
  // una montagna — e quel tetto finiva anche nella MISURA. Ogni fotogramma più
  // lento di cento millisecondi veniva registrato come cento esatti.
  // ⚠ Quindi il banco diceva «il carico pieno costa 1,00x» — «tutto gratis» — su
  // una macchina che faceva dieci fotogrammi al secondo. E non si vedeva da qui:
  // sopra i dieci fps il tetto non si tocca MAI. Il banco era cieco proprio
  // sulle macchine per cui esiste.
  const p = leggi('../src/partita.js');
  assert.match(p, /const grezzo = adesso - ultimo;/, 'il tempo vero del fotogramma non si misura più');
  assert.match(p, /const dt = Math\.min\(0\.1, grezzo \/ 1000\)/, 'la fisica ha perso il suo tetto');
  // e chi misura riceve `grezzo`, mai `dt`
  for (const [chi, re] of [
    ['il ritmo', /ritmo\.campiona\(grezzo\)/],
    ['il banco omega', /passoBanco\(grezzo\)/],
  ]) assert.match(p, re, `${chi} riceve di nuovo il tempo TAGLIATO invece di quello vero`);
  assert.equal(/campiona\(dt \* 1000\)|passoBanco\(dt \* 1000\)|tempi\.push\(dt \* 1000\)/.test(p), false,
    'da qualche parte si misura ancora il `dt` col tetto della fisica');
});

test('e `Ritmo` la aveva dalla nascita: i tempi assurdi non entrano', () => {
  const r = new Ritmo();
  for (let i = 0; i < 100; i++) r.campiona(16.7);
  const prima = r.misura();
  r.campiona(-14640);      // il dt del Chromebook
  r.campiona(0);
  r.campiona(60000);       // una scheda tornata in primo piano dopo un minuto
  const dopo = r.misura();
  assert.equal(dopo.n, prima.n, 'un tempo assurdo è entrato nel campione');
  assert.ok(dopo.fps > 55, `gli fps sono stati avvelenati: ${dopo.fps.toFixed(1)}`);
});

test('⚠ e `worldgenMs` e `meshMs` non sono più LO STESSO NUMERO sotto due nomi', () => {
  // ⚠ Il rapporto del Chromebook diceva «worldgen 19139 · mesh 19139»: sembrava
  // di sapere dove andasse il tempo dell'avvio, e invece era una variabile sola
  // stampata due volte. Diciannove secondi di attesa e nessuna indicazione su
  // da che parte guardare — che è il caso in cui una misura serve di più.
  const p = leggi('../src/partita.js');
  assert.equal(/worldgenMs: (\w+), meshMs: \1,/.test(p), false,
    'worldgenMs e meshMs sono di nuovo la stessa cosa scritta due volte');
  assert.match(p, /worldgenMs: streaming\.statistiche\.generaMs/);
  assert.match(p, /meshMs: streaming\.statistiche\.costruisciMs/);
  const s = leggi('../src/partita/streaming.js');
  assert.match(s, /this\.statistiche\.generaMs = /, 'lo streaming non misura più la generazione');
  assert.match(s, /this\.statistiche\.costruisciMs = /, 'lo streaming non misura più la costruzione');
});

test('e il rapporto porta il framepacing, non solo quanti fotogrammi', () => {
  // ⚠ «30 fps» non distingue trenta fotogrammi regolari (giocabile) da trenta
  // con un singhiozzo ogni due secondi (insopportabile). Dal Chromebook è
  // arrivato p50 33 e p99 100 — il p99 è TRE VOLTE il p50 — e senza i numeri del
  // ritmo quella firma resta un'impressione invece di essere una misura.
  const r = leggi('../src/ui/rapporto.js');
  assert.match(r, /ritmo: l\.ritmo \?/, 'il rapporto non porta più i numeri del ritmo');
  assert.match(r, /singhiozziAlSec/);
  assert.match(r, /voto: l\.voto \?/, 'il rapporto non porta più il voto');
});

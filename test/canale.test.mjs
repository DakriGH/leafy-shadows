// IL CANALE: un argomento solo, scritto in un posto solo.
//
// ⚠ QUESTE PROVE SONO STATE RIFATTE IL 10/09/2026, e la storia conta. Prima
// l'argomento su ntfy si ricavava da una password digitata sul dispositivo, e
// queste prove confrontavano TRE implementazioni di SHA-256 (il browser, il
// ripiego scritto a mano, node) per essere sicuri che i due lati calcolassero
// lo stesso nome. Erano prove giuste per un impianto sbagliato: il difetto
// vero non era il conto — era che la password su un dispositivo poteva essere
// UN'ALTRA, e allora il gioco diceva «mandato ✔» e il lettore «nessun
// rapporto», tutt'e due veri, per sempre. È successo davvero, col Chromebook.
//
// Adesso l'argomento è una costante, e quello che va presidiato è una cosa
// sola: **che esista in UN POSTO SOLO**. Due copie dello stesso nome sono
// esattamente il difetto di prima con un altro vestito — se divergono nessuno
// dei due lati sbaglia, e non arriva niente.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { ARGOMENTO, SERVIZIO, SOGLIA_ALLEGATO, FIRMA } from '../src/ui/canale.js';

const leggi = (p) => readFileSync(fileURLToPath(new URL(p, import.meta.url)), 'utf8');

test('⚠ l\'argomento esiste in UN POSTO SOLO: nessuno se lo riscrive addosso', () => {
  // ⚠ È LA PROVA CHE CONTA. Il lettore (`strumenti/leggi-diagnostica.mjs`) deve
  // IMPORTARLO, non ricopiarlo: una seconda copia che diverge non dà nessun
  // errore da nessuna parte — i rapporti partono, non arrivano, e i due lati
  // hanno tutt'e due ragione.
  const lettore = leggi('../strumenti/leggi-diagnostica.mjs');
  assert.match(lettore, /import\(['"]\.\.\/src\/ui\/canale\.js['"]\)|from ['"]\.\.\/src\/ui\/canale\.js['"]/,
    'il lettore non importa l\'argomento da ui/canale.js: se lo sta riscrivendo');
  assert.equal(lettore.includes(ARGOMENTO), false,
    'l\'argomento è scritto a mano anche nel lettore: due copie che possono divergere');
});

test('e nel gioco non c\'è più niente da digitare', () => {
  // ⚠ Se un giorno tornasse un campo password, tornerebbe anche il difetto:
  // un dispositivo con la password sbagliata manda in un posto dove nessuno
  // guarda, e lo dice a nessuno.
  // ⚠ SI GUARDA IL CODICE, NON IL TESTO: i commenti qui sopra la parola
  // «password» la dicono cinque volte apposta, perché raccontano il difetto. Una
  // prova che cercasse la parola bocciarebbe la spiegazione insieme al difetto,
  // e la cura sarebbe cancellare la spiegazione — cioè il contrario.
  const diag = senzaCommenti(leggi('../src/ui/diagnostica.js'));
  assert.equal(/localStorage/.test(diag), false, 'la diagnostica è tornata a ricordarsi qualcosa per dispositivo');
  assert.equal(/diagChiave|type="password"/.test(diag), false, 'è tornato un campo password nel pannello');
  assert.equal(/x-chiave/.test(diag), false, 'il rapporto porta di nuovo un gettone al collettore');
  const canale = leggi('../src/ui/canale.js');
  assert.equal(/export async function manda\(password/.test(canale), false, '`manda` chiede di nuovo una password');
});

test('è un nome buono per ntfy: corto, stabile, senza caratteri strani', () => {
  // ntfy accetta lettere, numeri, trattino e underscore. Uno spazio o un accento
  // darebbero un 400 al primo invio — cioè il bottone morto, e la causa lontana.
  assert.match(ARGOMENTO, /^[a-zA-Z0-9_-]{8,64}$/);
  assert.match(ARGOMENTO, /^leafy-shadows-/, 'si riconosce a occhio di chi è');
});

test('e non si indovina: abbastanza bit da non finirci per caso', () => {
  // ⚠ NON PROTEGGE DA CHI LEGGE IL SORGENTE — l'argomento è lì, in chiaro, ed è
  // una scelta dichiarata (vedi `ui/canale.js`). Protegge dall'altro caso, che
  // è quello frequente: che qualcuno ci finisca sopra per caso e ci scriva.
  const casuale = ARGOMENTO.replace('leafy-shadows-', '');
  assert.ok(casuale.length >= 16, `solo ${casuale.length} cifre di parte casuale: troppo poche`);
  assert.match(casuale, /^[0-9a-f]+$/, 'la parte casuale deve essere esadecimale');
});

test('la firma marca i rapporti nostri, e il lettore la usa per scartare il resto', () => {
  assert.match(FIRMA, /^leafy-shadows\//);
  const lettore = leggi('../strumenti/leggi-diagnostica.mjs');
  assert.match(lettore, /d\.gioco !== 'Leafy-Shadows'/, 'il lettore non scarta più quello che non è roba nostra');
});

test('la soglia dell\'allegato è quella misurata', () => {
  // Provato su ntfy.sh, non dedotto: fino a 4 KB il corpo torna come messaggio
  // (12 ore); sopra diventa un allegato (3 ore).
  assert.equal(SOGLIA_ALLEGATO, 4096);
  assert.equal(SERVIZIO, 'https://ntfy.sh');
});

/** Via i commenti: qui si giudica quello che il codice FA, non quello che dice. */
function senzaCommenti(s) {
  return s.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/^\s*\/\/[^\n]*$/gm, ' ');
}

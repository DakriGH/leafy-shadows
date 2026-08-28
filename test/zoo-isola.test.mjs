// LO ZOO DEVE ISOLARE, e questa prova esiste perché non lo faceva.
//
// ⚠ LA PIAZZOLA «distanza» È PROFONDA 200 CELLE contro le 30 di tutte le altre
// — è un corridoio di pilastri che si perde all'orizzonte, ed è giusto che sia
// lungo. Nella griglia normale però passava ATTRAVERSO le sue vicine: i suoi
// pilastri spuntavano dentro la prova delle lampade con ombra, dove ogni blocco
// in più cambia quello che si vede. Per un momento ho creduto a un difetto
// delle ombre, e stavo guardando l'arredamento di un'altra stanza.
//
// Uno zoo che non isola è peggio di nessuno zoo: dà risposte, e sono sbagliate.
import test from 'node:test';
import assert from 'node:assert/strict';
import { PIAZZOLE, ingombroDi, PASSO } from '../src/world/zoo.js';

const sovrappone = (a, b) => a.x0 < b.x1 && b.x0 < a.x1 && a.z0 < b.z1 && b.z0 < a.z1;

/**
 * L'INGOMBRO VERO, misurato POSANDO I BLOCCHI.
 *
 * ⚠ E LA PRIMA STESURA DI QUESTA PROVA LEGGEVA L'INGOMBRO DICHIARATO, cioè non
 * avrebbe preso il difetto per cui l'ho scritta: «distanza» era profonda 200 e
 * non lo diceva, quindi valeva il valore di fabbrica — trenta — e i conti
 * tornavano tutti. Una prova che chiede al sospettato di descriversi.
 *
 * Qui invece si costruisce la piazzola in un mondo di prova e si guarda dove
 * sono finiti i blocchi. Costa qualche millisecondo e non si può ingannare.
 */
function ingombroVero(p) {
  const posati = [];
  const finto = { metti: (x, y, z) => posati.push([x, z]) };
  p.costruisci(finto, p.x * PASSO, p.z * PASSO);
  if (!posati.length) return null;
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity;
  for (const [x, z] of posati) {
    if (x < x0) x0 = x; if (x + 1 > x1) x1 = x + 1;
    if (z < z0) z0 = z; if (z + 1 > z1) z1 = z + 1;
  }
  return { x0, z0, x1, z1 };
}

test('nessuna piazzola invade la vicina', () => {
  const scontri = [];
  const ing = PIAZZOLE.map(ingombroVero);
  for (let i = 0; i < PIAZZOLE.length; i++) {
    for (let j = i + 1; j < PIAZZOLE.length; j++) {
      if (ing[i] && ing[j] && sovrappone(ing[i], ing[j])) {
        scontri.push(`${PIAZZOLE[i].id} ↔ ${PIAZZOLE[j].id}`);
      }
    }
  }
  assert.deepEqual(scontri, []);
});

test("l'ingombro dichiarato copre quello vero", () => {
  // ⚠ SERVE ANCHE QUESTO: la regia (`src/zoo.js`) e la camera usano i numeri
  // DICHIARATI. Se il vero è più grande, la prova di sopra resta verde e la
  // piazzola esce lo stesso dall'inquadratura.
  for (const p of PIAZZOLE) {
    const v = ingombroVero(p), d = ingombroDi(p);
    if (!v) continue;
    assert.ok(v.x0 >= d.x0 && v.x1 <= d.x1 && v.z0 >= d.z0 && v.z1 <= d.z1,
      `${p.id}: posa blocchi fuori dall'ingombro dichiarato — vero ` +
      `${v.x0}..${v.x1} × ${v.z0}..${v.z1}, dichiarato ${d.x0}..${d.x1} × ${d.z0}..${d.z1}`);
  }
});

test('ogni piazzola ha un identificativo e una nota', () => {
  const visti = new Set();
  for (const p of PIAZZOLE) {
    assert.ok(p.id && !visti.has(p.id), 'id mancante o ripetuto: ' + p.id);
    visti.add(p.id);
    assert.ok(p.nome && p.nota, p.id + ': serve una nota, o non si sa cosa guardare');
    assert.equal(typeof p.costruisci, 'function', p.id + ': manca costruisci');
  }
});

test('ogni piazzola sta dentro il suo passo, o lo dichiara', () => {
  // ⚠ IL PUNTO NON È VIETARE LE PIAZZOLE GRANDI — «distanza» deve essere lunga.
  // È che la grandezza sia DICHIARATA, così la prova di sopra la può vedere.
  for (const p of PIAZZOLE) {
    const g = ingombroDi(p);
    const larg = g.x1 - g.x0, prof = g.z1 - g.z0;
    if (larg > PASSO || prof > PASSO) {
      assert.ok(p.larg || p.prof, p.id + ': più grande del passo ma non lo dichiara');
    }
  }
});

// ⚠ E LA GRIGLIA DEI MURI DEVE STARCI, se no le ombre delle lampade spariscono
// SENZA DIRLO. Il mesher ha un paracadute: oltre due milioni di celle la
// griglia non la calcola proprio, e a schermo l'unica cosa che cambia è che le
// lampade tornano ad attraversare i muri — cioè la piazzola «con ombra e senza»
// smette di mostrare una differenza, e sembra un difetto delle luci.
//
// Aggiungere una piazzola allarga il mondo, quindi questo limite si supera per
// sbaglio: è il caso perfetto per una prova, e costa un conto a mente.
test('la griglia dei muri dello zoo sta sotto il paracadute del mesher', async () => {
  const { LUCE_LIMITE_CELLE } = await import('../src/world/mesher.js');
  let x0 = Infinity, z0 = Infinity, x1 = -Infinity, z1 = -Infinity, y1 = -Infinity;
  for (const p of PIAZZOLE) {
    const g = ingombroDi(p);
    x0 = Math.min(x0, g.x0); x1 = Math.max(x1, g.x1);
    z0 = Math.min(z0, g.z0); z1 = Math.max(z1, g.z1);
    // l'altezza vera: la si misura posando, come l'ingombro
    const quote = [];
    p.costruisci({ metti: (x, y) => quote.push(y) }, p.x * PASSO, p.z * PASSO);
    y1 = Math.max(y1, ...quote);
  }
  // il margine che `scatolaPerMondo` aggiunge attorno (2 di lato, 6 sopra e sotto)
  const celle = (x1 - x0 + 4) * (y1 + 12) * (z1 - z0 + 4);
  assert.ok(celle < LUCE_LIMITE_CELLE,
    `griglia da ${(celle / 1e6).toFixed(2)}M celle contro un limite di ` +
    `${(LUCE_LIMITE_CELLE / 1e6).toFixed(1)}M: le lampade smetterebbero di fare ombra, in silenzio`);
});

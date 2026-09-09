// IL CATALOGO — la riga di dati per tipo, e la posa che se ne ricava.
//
// ⚠ DUE COSE DIVERSE, PROVATE SEPARATAMENTE, e la divisione è voluta:
//  · IL MECCANISMO (giro, scala, impronta dalla cella) si prova su asset di
//    PROVA registrati qui. Così resta coperto anche quando il committente
//    cambia idea su cosa deve variare — che è una decisione sua e cambierà.
//  · IL VERDETTO (quali righe vere variano) si prova a parte, in fondo. Quella
//    prova non difende il codice: difende una DECISIONE, e serve a fare
//    rumore se qualcuno la cambia senza chiedere.
import test from 'node:test';
import assert from 'node:assert/strict';
import { CATALOGO, rigaDi, registraAsset, posaDi, istanzaDi, conAlone } from '../src/partita/catalogo.js';

const QUARTO = Math.PI / 2;

// gli asset di prova: il meccanismo si misura su questi, non sulle righe vere
registraAsset('provaLibero', { nome: 'Prova libero', giro: 'libero', scala: [0.8, 1.2] });
registraAsset('provaQuarti', { nome: 'Prova quarti', giro: 'quarti' });
registraAsset('provaFermo', { nome: 'Prova fermo', giro: 'no' });

test('la posa è DETERMINISTICA dalla cella: la stessa cella dà la stessa posa, sempre', () => {
  const a = posaDi('provaLibero', 13, 5, -7);
  for (let i = 0; i < 50; i++) {
    const b = posaDi('provaLibero', 13, 5, -7);
    assert.equal(b.scala, a.scala);
    assert.equal(b.giro, a.giro);
  }
  // e celle diverse danno pose diverse: se no non varia niente
  const pose = new Set();
  for (let x = 0; x < 40; x++) pose.add(posaDi('provaLibero', x, 5, 0).giro.toFixed(4));
  assert.ok(pose.size > 30, `su 40 celle solo ${pose.size} giri diversi: l'impronta non distribuisce`);
});

test('il giro A QUARTI cade solo sugli assi: un oggetto costruito a 37° si legge come sbagliato', () => {
  for (let x = -20; x < 20; x++) {
    for (let z = -3; z < 3; z++) {
      const quarti = posaDi('provaQuarti', x, 4, z).giro / QUARTO;
      assert.ok(Math.abs(quarti - Math.round(quarti)) < 1e-9, `giro non multiplo di π/2: ${quarti}`);
      assert.ok(Math.round(quarti) >= 0 && Math.round(quarti) <= 3, `giro fuori dai quattro quarti`);
    }
  }
  // e li usa tutti e quattro, se no è come non girare
  const usati = new Set();
  for (let x = 0; x < 60; x++) usati.add(Math.round(posaDi('provaQuarti', x, 4, 0).giro / QUARTO));
  assert.equal(usati.size, 4, `usa ${usati.size} quarti su 4`);
});

test('il giro LIBERO copre il cerchio, la scala sta nell\'intervallo dichiarato', () => {
  let min = Infinity, max = -Infinity, gMin = Infinity, gMax = -Infinity;
  for (let x = 0; x < 300; x++) {
    const p = posaDi('provaLibero', x, 6, x * 3);
    min = Math.min(min, p.scala); max = Math.max(max, p.scala);
    gMin = Math.min(gMin, p.giro); gMax = Math.max(gMax, p.giro);
  }
  const [a, b] = CATALOGO.provaLibero.scala;
  assert.ok(min >= a && max <= b, `scala fuori da [${a}, ${b}]: ${min}…${max}`);
  assert.ok(max - min > (b - a) * 0.8, 'la scala non copre l\'intervallo: varia troppo poco');
  assert.ok(gMin < 0.4 && gMax > Math.PI * 2 - 0.4, `il giro non copre il cerchio: ${gMin}…${gMax}`);
});

test('l\'impronta non guarda il TIPO, solo la cella: due stati dello stesso oggetto non si scambiano posa', () => {
  // ⚠ È la ragione per cui spegnere un lampione non lo fa scattare di novanta
  // gradi: `lampione` e `lampioneSpento` sono lo stesso oggetto in due stati.
  registraAsset('provaAcceso', { giro: 'quarti', scala: [0.9, 1.1] });
  registraAsset('provaSpento', { giro: 'quarti', scala: [0.9, 1.1] });
  for (let x = -10; x < 10; x++) {
    const on = posaDi('provaAcceso', x, 5, 2), off = posaDi('provaSpento', x, 5, 2);
    assert.equal(off.giro, on.giro, `scatta girandosi in ${x}`);
    assert.equal(off.scala, on.scala);
  }
});

test('`varia: false` inchioda tutto com\'era prima del catalogo', () => {
  const p = posaDi('provaLibero', 13, 5, -7, false);
  assert.deepEqual([p.scala, p.giro, ...p.tinta], [1, 0, 1, 1, 1]);
  assert.deepEqual(istanzaDi('provaLibero', 3, 4, 5, false), [3, 4, 5, 1, 1, 1, 1, 0]);
});

test('un tipo fuori catalogo resta fermo: niente sorprese sui pezzi disegnati a mano', () => {
  assert.equal(rigaDi('cosa-che-non-esiste'), null);
  const p = posaDi('cosa-che-non-esiste', 1, 2, 3);
  assert.deepEqual([p.scala, p.giro], [1, 0]);
  // ⚠ e nemmeno le chiavi ereditate da Object passano per righe
  assert.equal(rigaDi('toString'), null);
  assert.equal(rigaDi('constructor'), null);
});

test('registraAsset riempie i buchi e non perde quello che gli si dice', () => {
  const r = registraAsset('prova-asset', { nome: 'Prova', giro: 'libero' });
  assert.equal(r.modello, 'prova-asset', 'il modello, se non detto, è l\'id');
  assert.equal(r.giro, 'libero');
  assert.equal(r.scala, 1);
  assert.equal(r.classe, 'fermo');
  assert.deepEqual(r.ingombro, [1, 1, 1]);
  assert.equal(rigaDi('prova-asset').nome, 'Prova');
  delete CATALOGO['prova-asset'];
});

test('l\'alone è una proprietà del catalogo, non un `if` sul nome', () => {
  const con = conAlone();
  assert.deepEqual(con.map(([id]) => id), ['lampione'], 'oggi solo il lampione ha l\'alone');
  const { quota, raggio, colore } = con[0][1].alone;
  assert.equal(quota, 2.35, 'la lanterna sta a +2,35: è la quota misurata, non un numero a caso');
  assert.ok(raggio > 0 && colore.length === 3);
});

test('ogni riga a catalogo è completa: chi ne aggiunge una non può dimenticare un campo', () => {
  for (const [id, r] of Object.entries(CATALOGO)) {
    assert.ok(r.nome, `${id}: manca il nome`);
    assert.ok(r.modello, `${id}: manca il modello`);
    assert.ok(['no', 'quarti', 'libero'].includes(r.giro), `${id}: giro sconosciuto «${r.giro}»`);
    assert.ok(typeof r.scala === 'number' || (Array.isArray(r.scala) && r.scala.length === 2 && r.scala[0] < r.scala[1]),
      `${id}: scala malformata`);
    assert.equal(typeof r.proiettaOmbra, 'boolean', `${id}: proiettaOmbra non è sì/no`);
    assert.ok(['fermo', 'vicino', 'medio', 'lontano'].includes(r.classe), `${id}: classe sconosciuta «${r.classe}»`);
    assert.ok(Array.isArray(r.ingombro) && r.ingombro.length === 3, `${id}: ingombro malformato`);
  }
});

// ── IL VERDETTO ──────────────────────────────────────────────────────────────
//
// ⚠ QUESTA PROVA NON DIFENDE IL CODICE, DIFENDE UNA DECISIONE. Il committente
// guarda gli scatti affiancati e dice sì o no, una cosa alla volta; quel sì e
// quel no valgono finché non li cambia LUI. Senza una prova qui, una riga del
// catalogo si muove in silenzio dentro una sessione qualsiasi e il look scivola
// senza che nessuno l'abbia deciso — che è esattamente come si è arrivati a
// «luci troppo realistiche, colori più spenti, ombre non come l'originale».
//
// Se stai leggendo questo perché la prova è rossa: non aggiustare il numero.
// Chiedi.
test('IL VERDETTO SUL LOOK (10/09/2026): cosa varia e cosa no', () => {
  const fermi = ['albero', 'lampione', 'lampioneSpento', 'panchina'];
  for (const id of fermi) {
    assert.equal(CATALOGO[id].giro, 'no', `${id} dovrebbe stare FERMO: il committente non ha approvato il giro`);
    assert.equal(CATALOGO[id].scala, 1, `${id} dovrebbe avere scala fissa`);
  }
  // l'albero è quello bocciato guardandolo: «per ora lasciali a parte»
  assert.equal(posaDi('albero', 7, 5, 3).giro, 0);
  assert.equal(posaDi('albero', 7, 5, 3).scala, 1);

  // il ciuffo-modello è approvato («mi piace che siano casuali, ha senso»),
  // ma ⚠ NON è quello che si vede a schermo: i fili d'erba li cuoce il mesher
  // (`nucleo/erba.js`) e variano per conto loro, senza passare di qui.
  assert.equal(CATALOGO.ciuffo.giro, 'libero');
  assert.ok(Array.isArray(CATALOGO.ciuffo.scala));

  // acceso e spento devono restare identici, qualunque sia il verdetto
  assert.equal(CATALOGO.lampione.giro, CATALOGO.lampioneSpento.giro);
  assert.deepEqual(CATALOGO.lampione.scala, CATALOGO.lampioneSpento.scala);
});

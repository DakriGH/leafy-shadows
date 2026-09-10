// L'OMEGA TEST — il banco di tortura, provato in Node.
//
// ⚠ SI PROVA CHE IL BANCO SIA DAVVERO UN ABOMINIO, e non è pignoleria: un banco
// che promette «migliaia di blocchi diversi» e ne mette venti è PEGGIO di
// nessun banco, perché ci si crede e si misura la scena sbagliata. Qui si
// contano le cose, invece di fidarsi di come sembra a schermo.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo, CHUNK } from '../src/world/world.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { registraArredi } from '../src/partita/arredi.js';
import { registraBlocco, rimuoviBlocco } from '../src/world/blocks.js';
import { generaChunkOmega, inventarioChunk, tipiDaColonna, tipiDaLampada, suoloOmega, canaleIn, OMEGA, QUOTA } from '../src/partita/omega.js';

registraDecorazioni();
registraArredi();

/** Genera un quadrato di chunk e torna [mondo, decorazioni]. */
function genera(raggio = 3) {
  const m = new Mondo();
  const dec = [];
  for (let cx = -raggio; cx <= raggio; cx++) for (let cz = -raggio; cz <= raggio; cz++) dec.push(...generaChunkOmega(m, cx, cz));
  return [m, dec];
}

test('MIGLIAIA DI BLOCCHI, E DIVERSI: il mandato preso alla lettera', () => {
  const [m] = genera(3);                            // 7×7 chunk = 112×112 blocchi
  const inv = inventarioChunk(m, 0, 0);
  assert.ok(m.contaBlocchi > 20000, `solo ${m.contaBlocchi} blocchi in tutto: non è un abominio`);
  assert.ok(inv.tipiDiversi >= 8, `in un chunk solo ${inv.tipiDiversi} tipi diversi`);

  // e in tutta la scena devono comparire QUASI TUTTI i tipi a catalogo
  const visti = new Set();
  for (let cx = -3; cx <= 3; cx++) for (let cz = -3; cz <= 3; cz++) for (const [t] of inventarioChunk(m, cx, cz).tipi) visti.add(t);
  const attesi = tipiDaColonna();
  const mancanti = attesi.filter((t) => !visti.has(t));
  assert.ok(mancanti.length <= attesi.length * 0.15,
    `su ${attesi.length} tipi ne mancano ${mancanti.length}: ${mancanti.slice(0, 8).join(', ')}`);
});

test('I TIPI VENGONO DALLA TABELLA VIVA, non da una lista scritta a mano', () => {
  // ⚠ È la stessa lezione della creativa: una lista a mano non ha il blocco
  // aggiunto ieri. Qui si prova registrando un blocco nuovo e chiedendo che il
  // banco lo conosca senza che nessuno lo abbia aggiunto a un elenco.
  const prima = tipiDaColonna().length;
  registraBlocco('provaOmega', { nome: 'Prova omega', cima: 0x123456, lato: 0x123456, fondo: 0x123456, solido: true, nav: 10 });
  assert.equal(tipiDaColonna().length, prima + 1, 'il banco non ha visto un blocco nuovo');
  assert.ok(tipiDaColonna().includes('provaOmega'));
  rimuoviBlocco('provaOmega');
});

test('LUCI COLORATE, e sono la voce più cara', () => {
  const lampade = tipiDaLampada();
  assert.ok(lampade.length >= 4, `solo ${lampade.length} tipi di lampada: poche per un banco di luci`);
  const [m] = genera(2);
  let quante = 0;
  for (let cx = -2; cx <= 2; cx++) for (let cz = -2; cz <= 2; cz++)
    for (const [t, n] of inventarioChunk(m, cx, cz).tipi) if (lampade.includes(t)) quante += n;
  assert.ok(quante > 40, `solo ${quante} lampade in 80×80 blocchi: non stressa le pozze`);
});

test('MESH DINAMICHE: alberi, lampioni e arredi a istanze, tanti', () => {
  const [, dec] = genera(2);
  assert.ok(dec.length > 150, `solo ${dec.length} modelli in 80×80: pochi per stressare le istanze`);
  const tipi = new Set(dec.map((d) => d[3]));
  assert.ok(tipi.has('albero') && tipi.has('lampione'), 'mancano alberi o lampioni');
  assert.ok(tipi.size >= 4, `solo ${tipi.size} tipi di modello`);
});

test('ACQUA OVUNQUE: i canali passano per tutta la scena, non in una vasca', () => {
  // ⚠ L'acqua è la cosa che costa di più (pelo, specchio, schiuma, e la
  // simulazione che la tiene viva): in un banco di tortura dev'essere in vista
  // da qualunque parte si guardi, non in un angolo che si può evitare.
  const [m] = genera(2);
  let celle = 0;
  for (let cx = -2; cx <= 2; cx++) for (let cz = -2; cz <= 2; cz++)
    for (const [t, n] of inventarioChunk(m, cx, cz).tipi) if (String(t).startsWith('acqua')) celle += n;
  assert.ok(celle > 800, `solo ${celle} celle d'acqua`);
  // e i canali si incrociano: da ogni chunk se ne vede almeno uno
  for (let cx = -2; cx <= 2; cx++) for (let cz = -2; cz <= 2; cz++) {
    let trovato = false;
    for (let x = cx * CHUNK; x < cx * CHUNK + CHUNK && !trovato; x++)
      for (let z = cz * CHUNK; z < cz * CHUNK + CHUNK; z++) if (canaleIn(x, z)) { trovato = true; break; }
    assert.ok(trovato, `il chunk ${cx},${cz} non ha canali: c'è un angolo dove il banco è facile`);
  }
});

test('IL TERRENO È MOSSO: un piano non fa lavorare né le ombre né la pelle dei chunk', () => {
  let min = Infinity, max = -Infinity;
  for (let x = -60; x < 60; x += 3) for (let z = -60; z < 60; z += 3) {
    const h = suoloOmega(x, z); min = Math.min(min, h); max = Math.max(max, h);
  }
  assert.ok(max - min >= OMEGA.rilievo - 2, `il rilievo è di ${max - min} blocchi: troppo piatto`);
  assert.ok(min > 0, 'il suolo scende sotto zero');
  assert.ok(Math.abs(suoloOmega(0, 0) - QUOTA) <= OMEGA.rilievo, 'il centro è fuori scala');
});

test('È DETERMINISTICO: due generazioni danno la stessa scena', () => {
  // ⚠ Un banco che cambia a ogni avvio non si può usare per confrontare due
  // misure — che è l'unica ragione per cui esiste.
  const [a] = genera(1), [b] = genera(1);
  assert.equal(a.contaBlocchi, b.contaBlocchi);
  const ia = inventarioChunk(a, 0, 0), ib = inventarioChunk(b, 0, 0);
  assert.equal(ia.blocchi, ib.blocchi);
  assert.deepEqual([...ia.tipi.entries()].sort(), [...ib.tipi.entries()].sort());
});

test('è INFINITO: un chunk lontano è pieno quanto quello centrale', () => {
  // ⚠ La distanza di resa è il punto del banco: se la scena finisse, «render
  // distance enormi» sarebbe aria vuota — che non costa niente e non misura niente.
  const m = new Mondo();
  generaChunkOmega(m, 0, 0);
  generaChunkOmega(m, 400, -250);
  const vicino = inventarioChunk(m, 0, 0), lontano = inventarioChunk(m, 400, -250);
  assert.ok(lontano.blocchi > vicino.blocchi * 0.6, `il chunk lontano ha ${lontano.blocchi} blocchi contro ${vicino.blocchi}`);
  assert.ok(lontano.tipiDiversi >= 5);
});

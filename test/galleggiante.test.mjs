// LA PALLA CHE GALLEGGIA: tuffo una volta, scia solo in moto, e non scappa.
//
// ⚠ PERCHÉ IN NODE: gli eventi (tuffo/scia) diventano tocchi sull'acqua, e un
// tocco di troppo o mancante a schermo si legge come «l'interattività va e
// viene» — il difetto più difficile da denunciare a occhio. Qui la semantica
// del committente («lo schizzo avviene quando un oggetto cade, se sta in acqua
// deve fare una scia») è quattro assert.

import test from 'node:test';
import assert from 'node:assert/strict';
import {
  creaPalla, aggiornaPalla, trascinaPalla, portaPalla, mollaPalla, colpisciPalla,
  azzeraPalla, scontraPalle,
} from '../src/gioco/galleggiante.js';

const AMBIENTE = {
  pelo: () => 10,
  fondo: 6,
  muri: { x0: 0, z0: 0, x1: 24, z1: 24 },
};
const DT = 1 / 60;

function passi(palla, quanti, raccogli) {
  for (let i = 0; i < quanti; i++) {
    const e = aggiornaPalla(palla, DT, AMBIENTE);
    if (raccogli) raccogli(e, i);
  }
}

test('una palla che cade fa UN tuffo e poi galleggia in equilibrio', () => {
  const palla = creaPalla(0.6, 12, 14, 12);
  let tuffi = 0;
  passi(palla, 600, (e) => { if (e.tuffo) tuffi++; });
  assert.equal(tuffi, 1, 'il tuffo deve essere uno solo, all\'ingresso');
  // dopo dieci secondi la palla è ferma sul pelo, con circa metà corpo sotto
  const immersione = (AMBIENTE.pelo() - (palla.y - palla.raggio)) / (2 * palla.raggio);
  assert.ok(Math.abs(palla.vy) < 0.05, `ancora in moto verticale: ${palla.vy}`);
  assert.ok(immersione > 0.4 && immersione < 0.75, `immersione fuori scala: ${immersione}`);
});

test('appoggiata piano, NON schizza', () => {
  const palla = creaPalla(0.6, 12, 10.55, 12);
  let tuffi = 0;
  passi(palla, 300, (e) => { if (e.tuffo) tuffi++; });
  assert.equal(tuffi, 0, 'senza velocità d\'ingresso lo schizzo è un falso');
});

test('trascinata, lascia una scia; ferma, smette', () => {
  const palla = creaPalla(0.6, 4, 10.2, 12);
  passi(palla, 120); // si assesta sul pelo
  let scie = 0;
  trascinaPalla(palla, 20, 12);
  passi(palla, 90, (e) => { if (e.scia) scie++; });
  assert.ok(scie >= 3, `in moto deve seminare segni di scia (${scie})`);
  mollaPalla(palla);
  passi(palla, 240); // l'attrito la ferma
  let scieDaFerma = 0;
  passi(palla, 120, (e) => { if (e.scia) scieDaFerma++; });
  assert.equal(scieDaFerma, 0, 'da ferma la scia deve tacere');
});

test('la scia nasce DIETRO la palla, non attorno', () => {
  const palla = creaPalla(0.6, 4, 10.2, 12);
  passi(palla, 120);
  trascinaPalla(palla, 20, 12); // si muove verso +x
  let unaScia = null;
  passi(palla, 90, (e) => { if (e.scia && !unaScia) unaScia = { ...e.scia, dovera: palla.x }; });
  assert.ok(unaScia, 'nessuna scia emessa');
  assert.ok(unaScia.x < unaScia.dovera, 'il segno deve stare dietro il moto');
});

test('colpita forte, rimbalza sulle pareti e resta nella vasca', () => {
  const palla = creaPalla(0.6, 12, 10.2, 12);
  passi(palla, 120);
  colpisciPalla(palla, 1, 0, 60); // una botta esagerata apposta
  passi(palla, 600);
  assert.ok(palla.x > AMBIENTE.muri.x0 && palla.x < AMBIENTE.muri.x1, `scappata in x: ${palla.x}`);
  assert.ok(palla.z > AMBIENTE.muri.z0 && palla.z < AMBIENTE.muri.z1, `scappata in z: ${palla.z}`);
  assert.ok(palla.y > AMBIENTE.fondo, 'sotto il fondo');
});

test('il colpetto su una palla in acqua schizza subito', () => {
  const palla = creaPalla(0.6, 12, 10.2, 12);
  passi(palla, 240); // in equilibrio
  colpisciPalla(palla, 1, 1, 8);
  let tuffi = 0;
  passi(palla, 300, (e) => { if (e.tuffo) tuffi++; });
  assert.ok(tuffi >= 1, 'la botta stessa deve muovere l\'acqua');
});

test('due palle compenetrate si respingono, e l\'urto trasferisce il moto', () => {
  const arriva = creaPalla(0.6, 12, 10, 12);
  arriva.vx = 4;
  const ferma = creaPalla(0.6, 13.0, 10, 12); // compenetrate di 0,2
  scontraPalle([arriva, ferma]);
  const dist = Math.hypot(ferma.x - arriva.x, ferma.y - arriva.y, ferma.z - arriva.z);
  assert.ok(dist >= 1.2 - 1e-9, `ancora compenetrate: ${dist}`);
  assert.ok(ferma.vx > 0, 'la ferma deve partire');
  assert.ok(arriva.vx < 4, 'chi urta deve rallentare');
});

test('la palla in mano è un\'incudine: non si sposta, l\'altra rimbalza', () => {
  const presa = creaPalla(0.6, 12, 10, 12);
  presa.presa = true;
  const libera = creaPalla(0.6, 12.8, 10, 12);
  libera.vx = -3;
  scontraPalle([presa, libera]);
  assert.equal(presa.x, 12, 'la palla in mano non si sposta');
  assert.ok(libera.x > 12.8, 'la libera viene spinta fuori');
  assert.ok(libera.vx > 0, 'e rimbalza via');
});

test('portata in aria vola alla mira; mollata, ricade e si tuffa', () => {
  const palla = creaPalla(0.6, 12, 10.2, 12);
  passi(palla, 240); // galleggia
  portaPalla(palla, 18, 14, 12);
  passi(palla, 120);
  assert.ok(Math.hypot(palla.x - 18, palla.y - 14) < 0.5, `non è arrivata: ${palla.x}, ${palla.y}`);
  assert.ok(!palla.inAcqua, 'in mano, fuori dall\'acqua');
  mollaPalla(palla);
  let tuffi = 0;
  passi(palla, 300, (e) => { if (e.tuffo) tuffi++; });
  assert.equal(tuffi, 1, 'mollata dall\'aria deve tuffarsi');
});

test('il fondo per punto: sulla spiaggia la palla si appoggia, non si incastra', () => {
  const spiaggia = { pelo: () => 10, fondo: (x) => (x > 20 ? 10.5 : 6), muri: null };
  const palla = creaPalla(0.5, 22, 14, 12);
  for (let i = 0; i < 400; i++) aggiornaPalla(palla, DT, spiaggia);
  assert.ok(Math.abs(palla.y - 11.0) < 0.05, `deve posarsi sulla spiaggia (11): ${palla.y}`);
});

test('azzeraPalla riporta tutto a casa', () => {
  const palla = creaPalla(0.6, 12, 14, 12);
  passi(palla, 300);
  colpisciPalla(palla, 1, 0, 10);
  passi(palla, 60);
  azzeraPalla(palla);
  assert.deepEqual([palla.x, palla.y, palla.z], [12, 14, 12]);
  assert.deepEqual([palla.vx, palla.vy, palla.vz], [0, 0, 0]);
});

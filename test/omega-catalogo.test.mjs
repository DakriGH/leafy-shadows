// L'ABOMINIO: migliaia di blocchi e arredi, e devono essere DAVVERO diversi.
//
// ⚠ La prova che conta è quella sui colori. Un banco che promette «migliaia di
// blocchi unici» e ne fa mille sfumature adiacenti a schermo sembra UN blocco
// solo: misurerebbe il carico giusto e mostrerebbe una parete monocroma, e chi
// lo guarda direbbe «non ha funzionato». Il committente lo guarda.
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  generaBlocchiOmega, generaArrediOmega, tavolozzaOmega, tintaRGB,
  parametriArredo, registraOmega, sbaraccaOmega, CATEGORIA_OMEGA, N_ARCHETIPI,
} from '../src/partita/omega-catalogo.js';
import { BLOCCHI, defDi } from '../src/world/blocks.js';
import { CATALOGO } from '../src/partita/catalogo.js';

test('mille blocchi sono mille tipi diversi, con id stabili', () => {
  const a = generaBlocchiOmega(1000);
  assert.equal(a.length, 1000);
  assert.equal(new Set(a.map(([id]) => id)).size, 1000, 'gli id devono essere tutti diversi');
  // deterministico: due chiamate danno la stessa identica roba
  const b = generaBlocchiOmega(1000);
  assert.deepEqual(a.map(([id, d]) => [id, d.cima, d.lato, d.fondo]), b.map(([id, d]) => [id, d.cima, d.lato, d.fondo]));
});

test('⚠ E I COLORI SONO DAVVERO DISTINTI, non mille sfumature dello stesso', () => {
  // ⚠ È la ragione per cui il giro delle tinte è AUREO e non lineare: con un
  // passo lineare mille blocchi cadono uno accanto all'altro sul cerchio dei
  // colori e la parete esce monocroma. Qui si misura sui PRIMI venti, che è
  // quello che si vede stando fermi in un punto.
  const venti = Array.from({ length: 20 }, (_, i) => tavolozzaOmega(i).cima);
  let minima = Infinity;
  for (let i = 0; i < venti.length; i++) for (let j = i + 1; j < venti.length; j++) {
    minima = Math.min(minima, distanza(venti[i], venti[j]));
  }
  assert.ok(minima > 30, `due dei primi venti blocchi sono quasi uguali (distanza ${minima.toFixed(0)} su 441): con saturazione e valore bassi due tinte lontane finiscono vicine in RGB)`);
});

test('e le tre facce sono lo STESSO colore a tre valori calanti, come vuole la casa', () => {
  // ⚠ Non tre tinte a caso: il volume dei blocchi in Leafy lo dà `coloreFaccia`,
  // e un banco con tre tinte scorrelate misurerebbe il motore giusto con blocchi
  // che non sono di Leafy — chi lo guarda direbbe «è brutto» invece di leggere.
  for (const i of [0, 7, 133, 999]) {
    const t = tavolozzaOmega(i);
    assert.ok(luminanza(t.cima) > luminanza(t.lato), `blocco ${i}: il lato non è più scuro della cima`);
    assert.ok(luminanza(t.lato) > luminanza(t.fondo), `blocco ${i}: il fondo non è più scuro del lato`);
  }
});

test('una parte dei blocchi sono LAMPADE, e la luce ha il colore del blocco', () => {
  // ⚠ «Luci colorate» in un banco vuol dire che si deve VEDERE quale lampada fa
  // quale pozza: con colori scorrelati dal blocco le pozze diventano una zuppa.
  const con = generaBlocchiOmega(240, { passoLuce: 24 }).filter(([, d]) => d.luce);
  assert.equal(con.length, 10);
  for (const [id, d] of con) {
    assert.equal(d.luce.colore, d.cima, `${id}: la luce non ha il colore del blocco`);
    assert.ok(d.luce.raggio > 0 && d.luce.intensita > 0);
  }
  // e non tutte proiettano ombra: una luce pesante cammina i voxel per pixel
  const pesanti = con.filter(([, d]) => d.luce.ombra).length;
  assert.ok(pesanti > 0 && pesanti < con.length, `${pesanti} pesanti su ${con.length}: devono essercene di tutt'e due i tipi`);
});

test('⚠ e MAI una materia su un blocco con cappello: smarcherebbe l\'erba in silenzio', () => {
  // (world/materie.js) il mesher marca i vertici d'erba dal COLORE, e una tinta
  // di materia li smarca: il cappello resta verde d'inverno, mesi dopo.
  for (const [id, d] of generaBlocchiOmega(600)) {
    assert.ok(!(d.materia && d.cappello), `${id} ha materia e cappello insieme`);
  }
});

test('mille arredi sono mille mesh diverse, e si costruiscono davvero', () => {
  const a = generaArrediOmega(1000);
  assert.equal(a.length, 1000);
  assert.equal(new Set(a.map(([id]) => id)).size, 1000);
  // ⚠ SI COSTRUISCONO SUL SERIO, non si controlla solo che ci sia la funzione:
  // un archetipo che lancia un errore con certi parametri lo si scopre a schermo
  // in mezzo al banco, cioè nel momento peggiore.
  const visti = new Set();
  for (const i of [0, 1, 2, 3, 4, 5, 37, 256, 999]) {
    const m = a[i][1].costruisci();
    assert.ok(m.triangoli > 0 && m.vertici === m.triangoli * 3, `arredo ${i}: mesh vuota`);
    assert.equal(m.byte.length, m.vertici * 20, `arredo ${i}: byte non coerenti coi vertici`);
    visti.add(m.triangoli);
  }
  assert.ok(visti.size > 3, 'nove arredi presi a caso danno quasi tutti lo stesso numero di triangoli: non sono diversi');
});

test('gli archetipi girano tutti, e le materie sono valide', () => {
  assert.ok(N_ARCHETIPI >= 5, 'servono almeno cinque forme, se no l\'abominio è una fila di cubi');
  for (let i = 0; i < N_ARCHETIPI * 3; i++) {
    const p = parametriArredo(i);
    for (const k of [0, 1, 2, 3, 4, 5]) {
      assert.ok(Number.isInteger(p.mat(k)) && p.mat(k) >= 0 && p.mat(k) < 16, `materia fuori scala all'arredo ${i}`);
      assert.ok(p.col(k) >= 0 && p.col(k) <= 0xffffff, `colore fuori scala all'arredo ${i}`);
    }
  }
});

test('registra e sbaracca: il gioco torna esattamente quello di prima', () => {
  // ⚠ IL BANCO NON DEVE LASCIARE MACERIE: duemila blocchi che restano nella
  // creativa dopo il test sono un gioco rotto, e sembrerebbe un difetto del
  // gioco, non del banco.
  const primaBlocchi = Object.keys(BLOCCHI).length, primaCatalogo = Object.keys(CATALOGO).length;
  const r = registraOmega({ blocchi: 50, arredi: 20 });
  assert.equal(r.blocchi.length, 50);
  assert.equal(r.arredi.length, 20);
  assert.equal(Object.keys(BLOCCHI).length, primaBlocchi + 70);
  assert.ok(defDi(r.blocchi[0]).cima !== undefined, 'un blocco dell\'omega non è registrato davvero');
  assert.equal(CATEGORIA_OMEGA.blocchi.length, 70, 'l\'abominio deve stare nella sua categoria, non fra i blocchi di casa');

  // idempotente: il banco sale di gradino richiamandola con un numero più grande
  const r2 = registraOmega({ blocchi: 80, arredi: 20 });
  assert.equal(r2.blocchi.length, 80);
  assert.equal(Object.keys(BLOCCHI).length, primaBlocchi + 100);

  sbaraccaOmega();
  assert.equal(Object.keys(BLOCCHI).length, primaBlocchi, 'sbaracca ha lasciato dei blocchi in giro');
  assert.equal(Object.keys(CATALOGO).length >= primaCatalogo, true);
  assert.equal(CATEGORIA_OMEGA.blocchi.length, 0);
});

test('tintaRGB è una conversione vera, non una approssimazione allegra', () => {
  assert.equal(tintaRGB(0, 1, 1), 0xff0000);
  assert.equal(tintaRGB(1 / 3, 1, 1), 0x00ff00);
  assert.equal(tintaRGB(2 / 3, 1, 1), 0x0000ff);
  assert.equal(tintaRGB(0, 0, 1), 0xffffff);
  assert.equal(tintaRGB(0.42, 0.5, 0), 0x000000);
});

const canali = (c) => [(c >> 16) & 255, (c >> 8) & 255, c & 255];
function distanza(a, b) {
  const [r1, g1, b1] = canali(a), [r2, g2, b2] = canali(b);
  return Math.hypot(r1 - r2, g1 - g2, b1 - b2);
}
function luminanza(c) { const [r, g, b] = canali(c); return 0.299 * r + 0.587 * g + 0.114 * b; }

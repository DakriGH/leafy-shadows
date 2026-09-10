// L'ABOMINIO — migliaia di blocchi e migliaia di arredi, tutti DIVERSI.
//
// ⚠ IL COMMITTENTE: «migliaia di blocchi unici con texture uniche, migliaia di
// furniture con texture e materiali unici, deve essere perfetto, così testiamo
// a fondo il framerate vero di sforzo su ogni dispositivo».
//
// ⚠ E «TEXTURE UNICA», IN QUESTO MOTORE, VUOL DIRE TAVOLOZZA UNICA — non è una
// scorciatoia, è il motore. Nel nucleo non esistono texture: il colore è cotto
// nel VERTICE (tre byte) dal mesher, ed è la ragione per cui non si vede un
// pixel da nessuna parte, che è il mandato numero uno. Quello che rende unico
// un blocco qui è la sua TAVOLOZZA (cima/lato/fondo) più la sua MATERIA, e sono
// esattamente le due cose che un blocco vero ha. Un banco che caricasse mille
// PNG misurerebbe un motore che non è questo.
//
// ⚠ E I DUE CARICHI NON SONO LO STESSO CARICO, che è la cosa che questo banco
// esiste per far vedere:
//  · MILLE BLOCCHI diversi costano quasi NIENTE a schermo. Finiscono tutti
//    nella mesh del loro chunk, con il colore cotto nei vertici: un chunk resta
//    UN disegno, che ci sia dentro un tipo o mille. Costano al MESHER (CPU, nel
//    worker) e in memoria, non alla GPU.
//  · MILLE ARREDI diversi costano MILLE DISEGNI. Le istanze accorpano le copie
//    dello STESSO modello, non modelli diversi: `nucleo/modelli.js` fa un
//    `drawArraysInstanced` per tipo. Mille tipi = mille chiamate nella passata
//    normale, altrettante in quella d'ombra, altrettante nello specchio.
// È il numero che decide se l'AR sta in piedi, ed è per questo che il banco
// sale a gradini invece di accendere tutto insieme: si cerca il GINOCCHIO, non
// un fotogramma da cartolina.
//
// ⚠ NIENTE DOM, NIENTE GL. Si prova in Node.
import { modelloDaCuboidi, scatola, piramide, tornio } from '../nucleo/cuboidi.js';
import { registraBlocco, rimuoviBlocco, BLOCCHI, CATEGORIE_BLOCCHI } from '../world/blocks.js';
import { indiceMateria } from '../world/materie.js';
import { registraAsset } from './catalogo.js';

/** La categoria dell'abominio: sta a parte, così la creativa non annega. */
export const CATEGORIA_OMEGA = { id: 'omega', nome: 'Omega', emoji: '⚡', blocchi: [] };

/** I nomi delle materie vere, più il vuoto: il banco le gira tutte. */
export const MATERIE_OMEGA = [null, 'metallo', 'fango', 'ghiaccio', 'accesa', 'specchio'];

/**
 * ⚠ IL GIRO DELLE TINTE È AUREO, non casuale né lineare. Con un passo lineare
 * mille blocchi darebbero mille sfumature adiacenti — a schermo sembrerebbe UN
 * blocco solo, e un banco che sembra un blocco solo non prova niente. Con il
 * numero aureo ogni tinta cade il più lontano possibile da tutte quelle già
 * usate, a qualunque punto ci si fermi: dieci blocchi sono dieci colori
 * distinti, e mille anche.
 */
const AUREO = 0.618033988749895;

/**
 * HSV → RGB in 0xRRGGBB. Tinta in giri (0..1), sat e val in 0..1.
 *
 * ⚠ SATURAZIONE E VALORE SI TAGLIANO A UNO, e non è pedanteria: chi chiama fa
 * `s * 1.08` per scurire la faccia di sotto, e con una saturazione di partenza
 * alta quel prodotto sfora. Sopra uno, `p = v * (1 - s)` diventa NEGATIVO, il
 * canale esce negativo e l'OR bit a bit restituisce un numero che non è un
 * colore — un blocco nero o fucsia in mezzo al banco, senza nessun errore.
 * Trovato da una prova, non guardando.
 */
export function tintaRGB(h, s, v) {
  h = ((h % 1) + 1) % 1;
  s = Math.max(0, Math.min(1, s));
  v = Math.max(0, Math.min(1, v));
  const i = Math.floor(h * 6), f = h * 6 - i;
  const p = v * (1 - s), q = v * (1 - f * s), t = v * (1 - (1 - f) * s);
  const [r, g, b] = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][i % 6];
  return (Math.round(r * 255) << 16) | (Math.round(g * 255) << 8) | Math.round(b * 255);
}

/**
 * La tavolozza del blocco numero `i`: cima, lato, fondo.
 *
 * ⚠ LE TRE FACCE NON SONO TRE COLORI A CASO: sono lo stesso colore a tre
 * valori calanti, ed è la convenzione della casa (il volume dei blocchi lo dà
 * `coloreFaccia`, non l'illuminazione). Un banco che ci mettesse tre tinte
 * diverse misurerebbe il motore giusto con blocchi che non sono di Leafy, e
 * chi lo guarda direbbe «è brutto» invece di leggere il numero.
 */
export function tavolozzaOmega(i) {
  const h = (i * AUREO) % 1;
  // sat e val girano con periodi che non si dividono fra loro né con la tinta:
  // se girassero insieme si vedrebbero fasce regolari, cioè un motivo.
  // ⚠ E RESTANO ALTI, sopra 0,62 e 0,66. Misurato: con saturazione e valore
  // liberi da 0,34 in su, due dei primi VENTI blocchi cadevano a 23 di distanza
  // RGB su 441 — cioè quasi uguali, perché due tinte lontane sul cerchio ma
  // tutt'e due slavate finiscono vicine in RGB. Tenendoli alti la distanza
  // minima sale a 32 e quella tipica fra due blocchi vicini da 158 a 220.
  // ⚠ E TIENE ANCHE LO STILE: la palette di Leafy è satura e chiara (#5ac650
  // l'erba, #e69c67 il terracotta), non pastello slavata.
  const s = 0.62 + 0.36 * ((i * 0.2360679) % 1);
  const v = 0.66 + 0.32 * ((i * 0.1010205) % 1);
  return { cima: tintaRGB(h, s, v), lato: tintaRGB(h, s * 1.04, v * 0.86), fondo: tintaRGB(h, s * 1.08, v * 0.74) };
}

/**
 * Migliaia di blocchi, tutti diversi: tavolozza propria, materia propria, e uno
 * ogni `passoLuce` è una LAMPADA del suo stesso colore.
 *
 * ⚠ LA LUCE PRENDE IL COLORE DEL BLOCCO, non uno a caso: «luci colorate» in un
 * banco vuol dire che si deve VEDERE quale lampada fa quale pozza. Con colori
 * scorrelati dal blocco le pozze diventano una zuppa e non si giudica niente.
 *
 * @returns {[string, object][]} coppie `[id, definizione]`, deterministiche
 */
export function generaBlocchiOmega(n, { passoLuce = 24, ombraDiLuce = 3 } = {}) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const id = `omega-b${String(i).padStart(4, '0')}`;
    const t = tavolozzaOmega(i);
    const materia = MATERIE_OMEGA[i % MATERIE_OMEGA.length];
    const def = {
      nome: `Omega blocco ${i}`, cima: t.cima, lato: t.lato, fondo: t.fondo,
      solido: true, nav: 10, fam: i % 3 === 0 ? 'mina' : 'scavo',
    };
    // ⚠ MAI `materia` INSIEME A `cappello`: il mesher marca i vertici d'erba dal
    // COLORE, e una tinta di materia li smarca (vedi world/materie.js). Qui
    // `cappello` non si mette mai, e questa riga è il promemoria del perché.
    if (materia) def.materia = materia;
    if (i % passoLuce === 0) {
      // ⚠ E L'OMBRA DELLA LUCE È UNA SU `ombraDiLuce`, non tutte. Una luce con
      // `ombra` cammina i voxel per pixel: è la voce più cara del motore, e un
      // banco con tutte pesanti misura solo quella e nasconde tutto il resto.
      def.luce = { colore: t.cima, raggio: 4 + (i % 5), intensita: 0.8 + 0.05 * (i % 6), ombra: (i / passoLuce) % ombraDiLuce === 0 };
    }
    out.push([id, def]);
  }
  return out;
}

// ── GLI ARCHETIPI DEGLI ARREDI ────────────────────────────────────────────────
//
// ⚠ SEI FORME PARAMETRICHE, NON SEIMILA MODELLI SCRITTI A MANO. Quello che il
// banco deve misurare è il costo di N MESH DIVERSE, e una mesh è diversa quando
// ha vertici diversi: bastano proporzioni e tavolozza. Sei archetipi × mille
// parametri danno mille mesh che non si somigliano e che restano riconoscibili
// come oggetti — un abominio di cubi a caso non si guarda, e questo banco si
// guarda anche a occhio.

const ARCHETIPI = [
  /** IL TOTEM: scatole impilate che si stringono. */
  (p) => {
    const pezzi = []; let y = 0;
    for (let k = 0; k < 3 + p.n3; k++) {
      const w = 0.62 - k * 0.09 * p.f1, h = 0.16 + 0.14 * p.f2;
      pezzi.push(scatola(0, y, 0, Math.max(0.12, w), h, Math.max(0.12, w * (0.7 + 0.5 * p.f3)), p.col(k), { materia: p.mat(k), rot: [0, k * 0.22 * p.f4, 0] }));
      y += h;
    }
    return pezzi;
  },
  /** IL VASO: un tornio con un profilo suo. */
  (p) => [tornio(0, 0, [
    [0.10 + 0.10 * p.f1, 0], [0.24 + 0.16 * p.f2, 0.10], [0.30 + 0.14 * p.f3, 0.34 + 0.2 * p.f1],
    [0.18 + 0.12 * p.f4, 0.60 + 0.2 * p.f2], [0.22 + 0.10 * p.f1, 0.74 + 0.2 * p.f3], [0.0, 0.80 + 0.24 * p.f4],
  ], p.col(0), { materia: p.mat(0), fase: p.f2 * Math.PI })],
  /** LA LANTERNA: un palo e una testa che si accende (materia «accesa»). */
  (p) => [
    scatola(0, 0, 0, 0.10 + 0.06 * p.f1, 0.70 + 0.5 * p.f2, 0.10 + 0.06 * p.f1, p.col(0), { materia: p.mat(0) }),
    tornio(0, 0, [[0, 0.70 + 0.5 * p.f2], [0.18 + 0.1 * p.f3, 0.78 + 0.5 * p.f2], [0.16 + 0.1 * p.f3, 1.00 + 0.5 * p.f2], [0, 1.06 + 0.5 * p.f2]],
      p.col(1), { materia: indiceMateria('accesa'), fase: Math.PI / 8 }),
  ],
  /** LA PANCA: un piano e le gambe. */
  (p) => {
    const w = 0.7 + 0.5 * p.f1, d = 0.28 + 0.2 * p.f2, h = 0.28 + 0.2 * p.f3;
    const g = [];
    for (const sx of [-1, 1]) for (const sz of [-1, 1]) g.push(scatola(sx * (w / 2 - 0.07), 0, sz * (d / 2 - 0.06), 0.08, h, 0.08, p.col(1), { materia: p.mat(1) }));
    g.push(scatola(0, h, 0, w, 0.09 + 0.06 * p.f4, d, p.col(0), { materia: p.mat(0) }));
    return g;
  },
  /** L'ANTENNA: un filo con gli anelli e una punta. */
  (p) => {
    const alt = 1.1 + 0.9 * p.f1, pezzi = [scatola(0, 0, 0, 0.06, alt, 0.06, p.col(0), { materia: p.mat(0) })];
    for (let k = 0; k < 2 + p.n3; k++) {
      const y = alt * (0.35 + 0.5 * (k / (2 + p.n3)));
      pezzi.push(tornio(0, 0, [[0.10 + 0.10 * p.f2, y], [0.13 + 0.10 * p.f2, y + 0.03], [0.10 + 0.10 * p.f2, y + 0.06]], p.col(1), { materia: p.mat(1), aperto: true }));
    }
    pezzi.push(piramide(0, alt, 0, 0.14 + 0.08 * p.f3, 0.22 + 0.2 * p.f4, p.col(2), 0, 0, { materia: p.mat(2) }));
    return pezzi;
  },
  /** IL CRISTALLO: due piramidi opposte, come le geode delle concept. */
  (p) => {
    const b = 0.24 + 0.20 * p.f1, alt = 0.5 + 0.6 * p.f2, giu = 0.14 + 0.2 * p.f3;
    return [
      piramide(0, giu, 0, b, alt, p.col(0), 0.04 * p.f4, -0.04 * p.f1, { materia: p.mat(0) }),
      piramide(0, giu, 0, b, -giu, p.col(1), 0, 0, { materia: p.mat(1) }),
    ];
  },
];

/** Quanti archetipi esistono: il banco lo dice, e una prova lo controlla. */
export const N_ARCHETIPI = ARCHETIPI.length;

/** Un hash stabile per indice: la stessa scena su ogni macchina e a ogni sessione. */
function h1(i, seme) {
  let h = (Math.imul(i | 0, 374761393) + Math.imul(seme | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** I parametri dell'arredo numero `i`: proporzioni, tavolozza, materie. */
export function parametriArredo(i) {
  const base = (i * 7) % 4096;   // la tavolozza non segue l'archetipo, se no gli archetipi diventano colori
  const t = [tavolozzaOmega(base), tavolozzaOmega(base + 811), tavolozzaOmega(base + 1607)];
  const mats = [i % 6, (i * 5 + 1) % 6, (i * 11 + 3) % 6].map((k) => (MATERIE_OMEGA[k] ? indiceMateria(MATERIE_OMEGA[k]) : 0));
  return {
    f1: h1(i, 1), f2: h1(i, 2), f3: h1(i, 3), f4: h1(i, 4),
    n3: Math.floor(h1(i, 5) * 3),
    col: (k) => [t[0].cima, t[1].cima, t[2].cima, t[0].lato, t[1].lato, t[2].fondo][k % 6],
    mat: (k) => mats[k % 3],
  };
}

/**
 * Migliaia di arredi, tutti diversi: forma, proporzioni, tavolozza e materie.
 *
 * ⚠ COSTA: ogni tipo è un VAO, un VBO e un DISEGNO per passata. Mille arredi
 * non sono «mille oggetti», sono MILLE CHIAMATE DI DISEGNO — ed è per questo
 * che il banco li accende a gradini invece che tutti insieme.
 *
 * @returns {[string, {nome, costruisci, colore}][]}
 */
export function generaArrediOmega(n) {
  const out = [];
  for (let i = 0; i < n; i++) {
    const id = `omega-a${String(i).padStart(4, '0')}`;
    const p = parametriArredo(i);
    const forma = ARCHETIPI[i % ARCHETIPI.length];
    out.push([id, {
      nome: `Omega arredo ${i}`,
      colore: p.col(0),
      // ⚠ PIGRA: la mesh si costruisce quando qualcuno la chiede. Mille arredi
      // costruiti all'avvio sono un secondo di pagina ferma prima ancora di
      // aver misurato qualcosa — e il banco parte a gradini, quindi la metà
      // alta spesso non serve mai.
      costruisci: () => modelloDaCuboidi(forma(p)),
    }]);
  }
  return out;
}

/**
 * Registra l'abominio: i blocchi fra i BLOCCHI (categoria «Omega»), gli arredi
 * fra i BLOCCHI come «modello» e a CATALOGO.
 *
 * ⚠ IDEMPOTENTE, e serve davvero: il banco sale di gradino chiamandola di
 * nuovo con un numero più grande. Rifare da capo mille registrazioni a ogni
 * gradino falserebbe la misura del gradino.
 *
 * @returns {{blocchi: string[], arredi: string[], arrediDef: Map}}
 */
export function registraOmega({ blocchi = 0, arredi = 0, passoLuce = 24 } = {}) {
  if (!CATEGORIE_BLOCCHI.includes(CATEGORIA_OMEGA)) CATEGORIE_BLOCCHI.push(CATEGORIA_OMEGA);
  const idBlocchi = [], idArredi = [], defArredi = new Map();

  for (const [id, def] of generaBlocchiOmega(blocchi, { passoLuce })) {
    if (!BLOCCHI[id]) registraBlocco(id, def, CATEGORIA_OMEGA);
    idBlocchi.push(id);
  }
  for (const [id, a] of generaArrediOmega(arredi)) {
    if (!BLOCCHI[id]) {
      registraBlocco(id, { nome: a.nome, forma: 'modello', modello: id, solido: false, calpestabile: true, colore: a.colore }, CATEGORIA_OMEGA);
      registraAsset(id, { nome: a.nome, modello: id, giro: 'libero', scala: 1, proiettaOmbra: true, classe: 'fermo', ingombro: [1, 1, 1] });
    }
    idArredi.push(id);
    defArredi.set(id, a);
  }
  return { blocchi: idBlocchi, arredi: idArredi, arrediDef: defArredi };
}

/** Toglie tutto l'abominio dal registro: il banco finisce e il gioco torna quello di prima. */
export function sbaraccaOmega() {
  for (const id of [...CATEGORIA_OMEGA.blocchi]) rimuoviBlocco(id);
  CATEGORIA_OMEGA.blocchi.length = 0;
  const i = CATEGORIE_BLOCCHI.indexOf(CATEGORIA_OMEGA);
  if (i >= 0) CATEGORIE_BLOCCHI.splice(i, 1);
}

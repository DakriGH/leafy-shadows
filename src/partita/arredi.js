// GLI ARREDI — i personaggi e le cose delle concept art, sfaccettati.
//
// Il committente: «non modelli cuboid temporanei per il gatto, e gli oggetti
// falli come nella reference, uguali, belli». Quindi niente scatole grezze:
// teste e corpi TORNITI a otto lati (nucleo/cuboidi.js), orecchie a punta col
// dentro rosa, occhi bianchi con la pupilla nera sull'interno, zampe tonde,
// cappelli dei funghi a cupola coi puntini, il cono del megafono, l'anello
// della canna, la rete del retino. Palette letta dalle reference. La luce
// piatta del nucleo fa il resto: ogni faccia è un colore, come nel disegno.
//
// ⚠ NIENTE DOM, NIENTE GL: torna modelli e registra BLOCCHI (forma «modello»),
// così si posano dalla cassetta e il registro dei modelli li disegna a istanze.
// Davanti = −Z, origine ai piedi.
import { modelloDaCuboidi, scatola, piramide, tornio } from '../nucleo/cuboidi.js';
import { registraBlocco, BLOCCHI } from '../world/blocks.js';

/** I colori delle reference. */
export const TAVOLOZZE = {
  blu: { corpo: 0x0c4f9a, pancia: 0x0b4283, testa: 0x1a7fd8, guance: 0x1670c4, zampe: 0x0a3d7a, orecchie: 0x0f5aa8, dentro: 0x2f96ea, occhi: 0xffffff, pupille: 0x0b1a2e, naso: 0x0a3d7a, coda: 0x0c4f9a },
  arancione: { corpo: 0xe98a2c, pancia: 0xd97a22, testa: 0xf3a94a, guance: 0xea9a3c, zampe: 0xf5a3b3, orecchie: 0xe98a2c, dentro: 0xf7b9c6, occhi: 0xffffff, pupille: 0x2a1a12, naso: 0xf7b9c6, coda: 0xe98a2c },
};

/**
 * IL GATTO delle reference: testa larga e sfaccettata, orecchie alte a punta,
 * occhi bianchi con la pupilla verso il naso, corpo a pera, zampette tonde.
 * Alto ~1,2 blocchi (le orecchie a 1,4), guarda −Z.
 */
export function gatto(t = TAVOLOZZE.blu, { zaino = false } = {}) {
  const pezzi = [
    // il corpo: una pera, larga in basso e stretta al collo; la pancia un filo più scura, dietro
    tornio(0, 0.02, [[0.14, 0.0], [0.27, 0.06], [0.31, 0.24], [0.28, 0.44], [0.19, 0.58], [0.0, 0.62]], t.corpo, { fase: Math.PI / 8, scala: [1, 1, 0.82] }),
    // le zampe davanti: due palline appiattite
    tornio(-0.21, -0.20, [[0.0, 0.0], [0.08, 0.02], [0.105, 0.08], [0.08, 0.15], [0.0, 0.17]], t.zampe, { fase: Math.PI / 8 }),
    tornio(0.21, -0.20, [[0.0, 0.0], [0.08, 0.02], [0.105, 0.08], [0.08, 0.15], [0.0, 0.17]], t.zampe, { fase: Math.PI / 8 }),
    // la testa: più larga che alta, schiacciata sotto, sfaccettata a otto lati
    tornio(0, 0, [[0.0, 0.52], [0.30, 0.58], [0.38, 0.74], [0.36, 0.94], [0.20, 1.08], [0.0, 1.11]], t.testa, { fase: Math.PI / 8, scala: [1.12, 1, 0.92] }),
    // le orecchie: alte, a punta, un filo aperte verso fuori; il dentro rosa/chiaro davanti
    piramide(-0.22, 1.02, 0.0, 0.17, 0.36, t.orecchie, -0.03, 0, { rot: [0, 0, 0.18] }),
    piramide(0.22, 1.02, 0.0, 0.17, 0.36, t.orecchie, 0.03, 0, { rot: [0, 0, -0.18] }),
    piramide(-0.22, 1.05, -0.03, 0.10, 0.24, t.dentro, -0.02, 0, { rot: [0, 0, 0.18] }),
    piramide(0.22, 1.05, -0.03, 0.10, 0.24, t.dentro, 0.02, 0, { rot: [0, 0, -0.18] }),
    // gli occhi: due rettangoli bianchi sul muso, la pupilla nera sul lato interno
    scatola(-0.15, 0.74, -0.352, 0.11, 0.15, 0.03, t.occhi), scatola(0.15, 0.74, -0.352, 0.11, 0.15, 0.03, t.occhi),
    scatola(-0.115, 0.755, -0.362, 0.032, 0.085, 0.02, t.pupille), scatola(0.115, 0.755, -0.362, 0.032, 0.085, 0.02, t.pupille),
    // il naso: un triangolino a punta in giù
    piramide(0, 0.72, -0.35, 0.06, -0.05, t.naso, 0, 0, { rot: [Math.PI / 2, 0, 0], perno: [0, 0.72, -0.35] }),
    // la coda: su, dietro, un filo girata
    tornio(0.20, 0.22, [[0.05, 0.05], [0.055, 0.40], [0.0, 0.46]], t.coda, { rot: [0.35, 0, -0.35], perno: [0.20, 0.05, 0.22] }),
  ];
  if (zaino) {
    // lo zaino rosso del gatto arancione (reference 2 e 3), con la fibbia grigia
    pezzi.push(scatola(0.06, 0.80, 0.44, 0.30, 0.30, 0.16, 0xd23b3b, { rot: [0, 0, 0.15] }));    // dietro la testa, tutto
    pezzi.push(scatola(0.06, 0.88, 0.53, 0.12, 0.12, 0.02, 0x8d98a8, { rot: [0, 0, 0.15] }));
    pezzi.push(scatola(0.30, 0.04, -0.22, 0.06, 0.36, 0.06, 0xd23b3b, { rot: [0, 0, -0.25], perno: [0.30, 0.04, -0.22] }));   // il bastoncino rosso, in zampa
  }
  return modelloDaCuboidi(pezzi);
}

/** IL FUNGO ROSSO a cupola coi puntini bianchi, e il fratellino marrone. */
export function fungo() {
  const rosso = 0xd83a34, bianco = 0xf6f0e6, gambo = 0xefe6d2, marrone = 0x5a3d2b;
  return modelloDaCuboidi([
    tornio(-0.08, -0.02, [[0.08, 0.0], [0.065, 0.10], [0.075, 0.20]], gambo),
    tornio(-0.08, -0.02, [[0.0, 0.17], [0.20, 0.20], [0.24, 0.28], [0.17, 0.36], [0.0, 0.41]], rosso, { fase: Math.PI / 8 }),
    tornio(-0.16, -0.10, [[0.05, 0.31], [0.04, 0.34]], bianco), tornio(0.02, 0.06, [[0.045, 0.31], [0.035, 0.34]], bianco), tornio(-0.06, -0.02, [[0.04, 0.39], [0.03, 0.42]], bianco),
    tornio(0.18, 0.14, [[0.05, 0.0], [0.045, 0.11]], gambo),
    tornio(0.18, 0.14, [[0.0, 0.09], [0.12, 0.11], [0.11, 0.17], [0.0, 0.21]], marrone, { fase: Math.PI / 8 }),
  ]);
}

/** IL GRADINO DI LEGNO: la tavola arancione con l'orlo, su due gambe scure. */
export function gradino() {
  const tavola = 0xe39a3c, orlo = 0xc9842f, gamba = 0x6b4a2a;
  return modelloDaCuboidi([
    scatola(0, 0.38, 0, 0.92, 0.09, 0.44, tavola), scatola(0, 0.35, 0, 0.98, 0.03, 0.50, orlo),
    scatola(-0.36, 0, 0, 0.09, 0.36, 0.09, gamba), scatola(0.36, 0, 0, 0.09, 0.36, 0.09, gamba),
  ]);
}

/** LA SCALA: tre gradini che salgono verso −Z dentro una cella. */
export function scala() {
  const tavola = 0xe39a3c, orlo = 0xc9842f, gamba = 0x6b4a2a, pezzi = [];
  for (let i = 0; i < 3; i++) {
    const z = 0.33 - i * 0.33, y = 0.24 + i * 0.28;
    pezzi.push(scatola(0, y, z, 0.9, 0.08, 0.33, tavola), scatola(0, y - 0.02, z, 0.94, 0.02, 0.37, orlo));
    pezzi.push(scatola(-0.36, 0, z, 0.07, y, 0.07, gamba), scatola(0.36, 0, z, 0.07, y, 0.07, gamba));
  }
  return modelloDaCuboidi(pezzi);
}

/** LA CANNA DA PESCA: il bastone scuro che si incurva, il manico rosso, l'anello grigio del mulinello. */
export function canna() {
  const legno = 0x35201a, rosso = 0xc0392b, grigio = 0x8d98a8;
  return modelloDaCuboidi([
    tornio(0, 0, [[0.025, 0.0], [0.02, 0.7]], legno, { rot: [0, 0, -0.35], perno: [0, 0, 0] }),
    tornio(0.24, 0, [[0.02, 0.66], [0.012, 1.31]], legno, { rot: [0, 0, -0.62], perno: [0.24, 0.66, 0] }),   // la punta, che si incurva
    tornio(0, 0, [[0.035, 0.0], [0.035, 0.26]], rosso, { rot: [0, 0, -0.35], perno: [0, 0, 0] }),
    tornio(0, 0, [[0.03, 0.40], [0.065, 0.42], [0.065, 0.50], [0.03, 0.52]], grigio, { rot: [0, 0, -0.35], perno: [0, 0, 0], aperto: true }),
  ]);
}

/** IL RETINO: il cerchio rosso a otto lati, la rete grigia a cono, il manico arancione col cappuccio rosso. */
export function retino() {
  const rosso = 0xc0392b, rete = 0x8a8a8a, manico = 0xd9772d, pezzi = [];
  // il cerchio sta a mezz'aria (0,34), la rete pende fin quasi a terra, il manico va indietro e in giù fino al suolo
  pezzi.push(tornio(0, 0, [[0.19, 0.32], [0.24, 0.32], [0.24, 0.37], [0.19, 0.37]], rosso, { aperto: true }));   // l'anello
  pezzi.push(tornio(0, 0, [[0.20, 0.33], [0.14, 0.17], [0.05, 0.05], [0.0, 0.02]], rete, { aperto: true }));      // la rete, a cono in giù
  pezzi.push(tornio(0, 0.24, [[0.03, 0.34], [0.03, 0.96]], manico, { rot: [-1.95, 0, 0], perno: [0, 0.34, 0.24] }));
  pezzi.push(tornio(0, 0.24, [[0.04, 0.96], [0.04, 1.10], [0.0, 1.12]], rosso, { rot: [-1.95, 0, 0], perno: [0, 0.34, 0.24] }));
  return modelloDaCuboidi(pezzi);
}

/** LA CAZZUOLA: la lastra grigia con l'orlo smussato, il collo, il manico arancione inclinato. */
export function cazzuola() {
  const lastra = 0xb9c3d3, orlo = 0xa5afc0, manico = 0xe0902f;
  return modelloDaCuboidi([
    scatola(0, 0.02, 0, 0.44, 0.04, 0.30, orlo), scatola(0, 0.04, 0, 0.50, 0.05, 0.34, lastra), scatola(0, 0.09, 0, 0.42, 0.02, 0.28, orlo),
    scatola(0, 0.09, 0.05, 0.12, 0.10, 0.10, lastra), scatola(0, 0.19, 0.05, 0.09, 0.09, 0.09, 0xc9d2df),
    tornio(0, 0.05, [[0.06, 0.0], [0.06, 0.62], [0.0, 0.66]], manico, { rot: [0.95, 0, 0], perno: [0, 0.24, 0.05], lati: 6, fase: Math.PI / 6 }),
  ]);
}

/** IL MEGAFONO: il cono bianco sfaccettato, gli anelli blu, la bocca azzurra, il manico blu scuro. */
export function megafono() {
  const bianco = 0xdfe6f0, blu = 0x1573b8, scuro = 0x0f4f8f, azzurro = 0x22c8f0;
  const giaci = { rot: [-Math.PI / 2, 0, 0], perno: [0, 0.42, 0] };   // il tornio sta lungo Y: lo si sdraia verso −Z
  return modelloDaCuboidi([
    tornio(0, 0, [[0.30, 0.42], [0.26, 0.52], [0.16, 0.66], [0.12, 0.80]], bianco, { ...giaci, aperto: true }),
    tornio(0, 0, [[0.13, 0.66], [0.13, 0.70]], blu, { ...giaci, aperto: true }), tornio(0, 0, [[0.14, 0.80], [0.14, 0.90], [0.0, 0.92]], blu, giaci),
    tornio(0, 0, [[0.30, 0.42], [0.22, 0.47], [0.0, 0.52]], bianco, giaci),          // il fondo bianco dell'imboccatura
    scatola(0, 0.33, -0.09, 0.14, 0.14, 0.06, azzurro),                                  // il quadratino azzurro in fondo
    scatola(0, 0.0, 0.10, 0.10, 0.44, 0.10, scuro, { rot: [-0.25, 0, 0], perno: [0, 0.44, 0.10] }),
  ]);
}

/** GLI ARREDI POSABILI: id del blocco → { nome, costruisci }. */
export const ARREDI = {
  gatto: { nome: 'Gatto (PNG)', costruisci: () => gatto(TAVOLOZZE.arancione, { zaino: true }), colore: 0xf3a94a },
  fungo: { nome: 'Fungo', costruisci: fungo, colore: 0xd83a34 },
  gradino: { nome: 'Gradino', costruisci: gradino, colore: 0xe39a3c },
  scala: { nome: 'Scala', costruisci: scala, colore: 0xc9842f },
  canna: { nome: 'Canna da pesca', costruisci: canna, colore: 0xc0392b },
  retino: { nome: 'Retino', costruisci: retino, colore: 0xd9772d },
  cazzuola: { nome: 'Cazzuola', costruisci: cazzuola, colore: 0xb9c3d3 },
  megafono: { nome: 'Megafono', costruisci: megafono, colore: 0x1573b8 },
};

/** Registra gli arredi come blocchi «modello» (non solidi: si attraversano, non cullano). Idempotente. */
export function registraArredi() {
  for (const [id, a] of Object.entries(ARREDI)) {
    if (BLOCCHI[id]) continue;
    registraBlocco(id, { nome: a.nome, forma: 'modello', modello: id, solido: false, calpestabile: true, colore: a.colore });
  }
  return Object.keys(ARREDI);
}

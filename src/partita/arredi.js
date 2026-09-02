// GLI ARREDI — i personaggi e le cose delle concept art, come cuboidi.
//
// «Se riesci a ricreare i pg delle reference e magari anche i funghi e le
// scale, strumenti… anche se sono tutti asset temporanei aiutano molto a dare
// un feeling vivo». Sono modelli scritti a mano con `nucleo/cuboidi.js`, nella
// palette delle reference: il gatto blu (il giocatore), il gatto arancione (il
// PNG), il fungo rosso con quello marrone, il gradino di legno, gli attrezzi
// (canna da pesca, retino, cazzuola, megafono). Quando arriveranno i modelli
// veri dall'Officina si sostituisce la funzione, il nome resta.
//
// ⚠ NIENTE DOM, NIENTE GL: torna modelli e registra BLOCCHI (forma «modello»),
// così si posano dalla cassetta e il registro dei modelli li disegna a istanze.
import { modelloDaCuboidi, scatola, piramide } from '../nucleo/cuboidi.js';
import { registraBlocco, BLOCCHI } from '../world/blocks.js';

/** I colori delle reference. */
export const TAVOLOZZE = {
  blu: { corpo: 0x0f4f9c, testa: 0x1f7fd6, zampe: 0x0b3b78, orecchie: 0x0e4a92, dentro: 0x2a90e8, occhi: 0xffffff, pupille: 0x111111, naso: 0x0b3b78 },
  arancione: { corpo: 0xe8892e, testa: 0xf0a648, zampe: 0xf3a0b0, orecchie: 0xe8892e, dentro: 0xf7b6c4, occhi: 0xffffff, pupille: 0x111111, naso: 0xf7b6c4 },
};

/** IL GATTO: un blocco alto, la testa larga, le orecchie a punta, gli occhi bianchi. Guarda −Z. */
export function gatto(t = TAVOLOZZE.blu) {
  return modelloDaCuboidi([
    scatola(0, 0, 0, 0.46, 0.52, 0.34, t.corpo),                 // il corpo
    scatola(-0.17, 0.02, -0.12, 0.12, 0.16, 0.16, t.zampe),      // le zampe davanti, tonde
    scatola(0.17, 0.02, -0.12, 0.12, 0.16, 0.16, t.zampe),
    scatola(0, 0.50, 0, 0.62, 0.46, 0.46, t.testa),              // la testa, più larga del corpo
    piramide(-0.19, 0.95, 0, 0.18, 0.30, t.orecchie, 0.02, 0),   // le orecchie a punta
    piramide(0.19, 0.95, 0, 0.18, 0.30, t.orecchie, -0.02, 0),
    scatola(-0.19, 0.96, -0.06, 0.08, 0.14, 0.04, t.dentro),     // il dentro rosa/chiaro
    scatola(0.19, 0.96, -0.06, 0.08, 0.14, 0.04, t.dentro),
    scatola(-0.14, 0.70, -0.235, 0.12, 0.14, 0.02, t.occhi),     // gli occhi, sul muso
    scatola(0.14, 0.70, -0.235, 0.12, 0.14, 0.02, t.occhi),
    scatola(-0.12, 0.72, -0.245, 0.05, 0.08, 0.01, t.pupille),   // le pupille
    scatola(0.16, 0.72, -0.245, 0.05, 0.08, 0.01, t.pupille),
    scatola(0, 0.62, -0.24, 0.06, 0.05, 0.02, t.naso),           // il naso
    scatola(0.26, 0.10, 0.20, 0.08, 0.30, 0.08, t.corpo, { giro: 0.5 }),   // la coda, un po' girata
  ]);
}

/** IL FUNGO ROSSO coi puntini, e il fratellino marrone accanto. */
export function fungo() {
  const rosso = 0xd83a34, bianco = 0xf6f0e6, gambo = 0xefe6d2, marrone = 0x5a3d2b;
  return modelloDaCuboidi([
    scatola(-0.08, 0, -0.02, 0.14, 0.22, 0.14, gambo),
    scatola(-0.08, 0.20, -0.02, 0.40, 0.12, 0.40, rosso),
    scatola(-0.08, 0.32, -0.02, 0.24, 0.06, 0.24, rosso),
    scatola(-0.16, 0.325, -0.10, 0.07, 0.02, 0.07, bianco), scatola(0.02, 0.325, 0.06, 0.06, 0.02, 0.06, bianco), scatola(-0.04, 0.385, -0.06, 0.06, 0.02, 0.06, bianco),
    scatola(0.18, 0, 0.14, 0.09, 0.12, 0.09, gambo),
    scatola(0.18, 0.11, 0.14, 0.22, 0.08, 0.22, marrone),
  ]);
}

/** IL GRADINO DI LEGNO: la tavola arancione su due gambe scure, come le scale delle reference. */
export function gradino() {
  const tavola = 0xe39a3c, orlo = 0xc9842f, gamba = 0x6b4a2a;
  return modelloDaCuboidi([
    scatola(0, 0.38, 0, 0.92, 0.10, 0.44, tavola),
    scatola(0, 0.36, 0, 0.96, 0.02, 0.48, orlo),
    scatola(-0.36, 0, 0, 0.10, 0.38, 0.10, gamba), scatola(0.36, 0, 0, 0.10, 0.38, 0.10, gamba),
  ]);
}

/** LA SCALA: tre gradini che salgono verso −Z dentro una cella. */
export function scala() {
  const tavola = 0xe39a3c, gamba = 0x6b4a2a;
  const pezzi = [];
  for (let i = 0; i < 3; i++) {
    const z = 0.33 - i * 0.33, y = 0.22 + i * 0.28;
    pezzi.push(scatola(0, y, z, 0.9, 0.09, 0.34, tavola));
    pezzi.push(scatola(-0.36, 0, z, 0.08, y, 0.08, gamba), scatola(0.36, 0, z, 0.08, y, 0.08, gamba));
  }
  return modelloDaCuboidi(pezzi);
}

/** LA CANNA DA PESCA: un bastone scuro inclinato, manico rosso, l'anello grigio. */
export function canna() {
  return modelloDaCuboidi([
    scatola(0, 0, 0, 0.05, 1.3, 0.05, 0x3a2418, { giro: 0 }),
    scatola(0, 0.02, 0, 0.07, 0.28, 0.07, 0xc0392b),
    scatola(0, 0.34, 0, 0.11, 0.08, 0.11, 0x8d98a8),
  ]);
}
/** IL RETINO: il cerchio rosso (otto scatole), la rete grigia, il manico arancione col cappuccio rosso. */
export function retino() {
  const pezzi = [scatola(0, 0.02, 0.34, 0.06, 0.06, 0.6, 0xd9772d), scatola(0, 0.02, 0.68, 0.07, 0.07, 0.14, 0xc0392b)];
  for (let i = 0; i < 8; i++) {
    const a = (i / 8) * Math.PI * 2, r = 0.22;
    pezzi.push(scatola(Math.cos(a) * r, 0.03, Math.sin(a) * r, 0.04, 0.05, 0.19, 0xc0392b, { giro: -a + Math.PI / 2 }));
  }
  pezzi.push(piramide(0, 0.02, 0, 0.36, -0.30, 0x8a8a8a));   // la rete: una piramide a testa in giù
  return modelloDaCuboidi(pezzi);
}
/** LA CAZZUOLA: la lastra grigia, il collo, il manico arancione inclinato. */
export function cazzuola() {
  return modelloDaCuboidi([
    scatola(0, 0, 0, 0.5, 0.05, 0.34, 0xb9c3d3),
    scatola(0, 0.05, 0.06, 0.12, 0.10, 0.10, 0xb9c3d3),
    scatola(0, 0.15, 0.06, 0.09, 0.09, 0.09, 0xc9d2df),
    { da: [-0.05, 0.22, 0.02], a: [0.05, 0.62, 0.10], colore: 0xe0902f, giro: 0 },
  ]);
}
/** IL MEGAFONO: il cono bianco a gradini, l'anello blu, il manico blu scuro. */
export function megafono() {
  const bianco = 0xdfe6f0, blu = 0x1573b8, scuro = 0x0f4f8f;
  return modelloDaCuboidi([
    scatola(0, 0.36, -0.20, 0.42, 0.42, 0.10, bianco), scatola(0, 0.40, -0.10, 0.34, 0.34, 0.10, bianco),
    scatola(0, 0.44, 0.00, 0.26, 0.26, 0.10, blu), scatola(0, 0.46, 0.10, 0.22, 0.22, 0.12, bianco), scatola(0, 0.48, 0.20, 0.18, 0.18, 0.10, blu),
    scatola(0, 0.50, -0.26, 0.10, 0.10, 0.02, 0x22c8f0),
    scatola(0, 0, 0.14, 0.10, 0.46, 0.10, scuro, { giro: 0 }),
  ]);
}

/** GLI ARREDI POSABILI: id del blocco → { nome, costruisci }. */
export const ARREDI = {
  gatto: { nome: 'Gatto (PNG)', costruisci: () => gatto(TAVOLOZZE.arancione), colore: 0xf0a648 },
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

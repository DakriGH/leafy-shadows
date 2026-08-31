// LA FLORA — le famiglie procedurali che vestono il mondo, e la loro semina.
//
// ⚠ QUESTO FILE È LA «PROVA DEI 9000» DELLA FASE R3, e insieme la risposta a
// «la grafica è troppo povera con 3 asset»: cinque famiglie nuove, generate a
// codice nello stile della casa (facce piatte, colori da palette, niente
// texture), seminate a MIGLIAIA con un solo disegno per famiglia. Quando
// arriveranno gli asset veri da Blockbench, la semina resta e le geometrie si
// sostituiscono: il meccanismo È il deliverable, le geometrie sono segnaposto
// che intanto riempiono il mondo.
//
// ⚠ NON NOMINA NESSUN MOTORE, come tutto `src/world/`: geometrie = array,
// semina = elenco di {x,y,z,scala,giro}. Chi istanzia sta in `motore/flora.js`.
// Si prova in Node: `test/flora.test.mjs`.

import { defDi } from './blocks.js';

// ── il caso deterministico ───────────────────────────────────────────────────
// ⚠ STESSO SEME → STESSO MONDO: la semina deve essere identica a ogni avvio e
// su ogni dispositivo, o le misure non si confrontano e il multiplayer di
// domani vede boschi diversi. Mulberry32, come il worldgen.
export function caso(seme) {
  let s = seme >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── le geometrie: pochi triangoli, facce piatte, colori ai vertici ───────────
// ⚠ I VERTICI NON SI CONDIVIDONO FRA FACCE (come il mesher): le normali piatte
// nascono da lì. E i colori sono PER FACCIA, scritti su ogni vertice — è la
// stessa grammatica dei blocchi, così il materiale del mondo li veste gratis.

/** Aggiunge un triangolo con colore pieno. I vertici arrivano come terne. */
function tri(g, a, b, c, colore) {
  for (const v of [a, b, c]) { g.pos.push(v[0], v[1], v[2]); g.col.push(...colore); }
}

/** Un quad da due triangoli (a,b,c,d in giro). */
function quad(g, a, b, c, d, colore) {
  tri(g, a, b, c, colore);
  tri(g, a, c, d, colore);
}

/**
 * LA ROCCIA: un masso a otto facce, irregolare ma convesso.
 * ⚠ La deformazione è per VERTICE DI FORMA (prima di duplicare per faccia):
 * deformare dopo aprirebbe cuciture fra le facce.
 */
function roccia(r) {
  const g = { pos: [], col: [] };
  const k = () => 0.75 + r() * 0.5;
  // sei punti: quattro attorno, uno sopra, uno sotto (poco: sta nel terreno)
  const p = [
    [-0.5 * k(), 0.05, -0.5 * k()], [0.5 * k(), 0.02, -0.55 * k()],
    [0.55 * k(), 0.04, 0.5 * k()], [-0.52 * k(), 0.03, 0.52 * k()],
    [0.12 * (r() - 0.5), 0.5 * k(), 0.12 * (r() - 0.5)], [0, -0.2, 0],
  ];
  const grigio = 0.42 + r() * 0.1;
  const chiaro = [grigio + 0.09, grigio + 0.1, grigio + 0.11, 1];
  const scuro = [grigio - 0.05, grigio - 0.04, grigio - 0.02, 1];
  const medio = [grigio + 0.02, grigio + 0.03, grigio + 0.05, 1];
  // il tetto (4 facce verso l'alto, chiare) e la cintura (4 verso il basso)
  tri(g, p[0], p[1], p[4], chiaro); tri(g, p[1], p[2], p[4], medio);
  tri(g, p[2], p[3], p[4], chiaro); tri(g, p[3], p[0], p[4], medio);
  tri(g, p[1], p[0], p[5], scuro); tri(g, p[2], p[1], p[5], scuro);
  tri(g, p[3], p[2], p[5], scuro); tri(g, p[0], p[3], p[5], scuro);
  return g;
}

/** IL CESPUGLIO: due «cuscini» di piramidi basse, verde fondo + verde chiaro. */
function cespuglio(r) {
  const g = { pos: [], col: [] };
  const cupola = (cx, cz, raggio, alto, fondo, cima) => {
    const lati = 5;
    for (let i = 0; i < lati; i++) {
      const a0 = (i / lati) * Math.PI * 2, a1 = ((i + 1) / lati) * Math.PI * 2;
      const v0 = [cx + Math.cos(a0) * raggio, 0.02, cz + Math.sin(a0) * raggio];
      const v1 = [cx + Math.cos(a1) * raggio, 0.02, cz + Math.sin(a1) * raggio];
      tri(g, v0, v1, [cx, alto, cz], i % 2 ? fondo : cima);
    }
  };
  const verdeF = [0.16, 0.38 + r() * 0.06, 0.18, 1];
  const verdeC = [0.30, 0.52 + r() * 0.08, 0.24, 1];
  cupola(-0.14, -0.08, 0.42, 0.72 + r() * 0.25, verdeF, verdeC);
  cupola(0.16, 0.1, 0.34, 0.55 + r() * 0.2, verdeF, verdeC);
  return g;
}

/** LA FELCE: tre lame incrociate che si piegano in fuori. */
function felce(r) {
  const g = { pos: [], col: [] };
  const lame = 3 + Math.floor(r() * 2);
  for (let i = 0; i < lame; i++) {
    const a = (i / lame) * Math.PI * 2 + r() * 0.5;
    const dx = Math.cos(a), dz = Math.sin(a);
    const alto = 0.85 + r() * 0.35, fuori = 0.42 + r() * 0.2;
    const verde = [0.14 + r() * 0.06, 0.42 + r() * 0.1, 0.2, 1];
    quad(g,
      [dx * 0.03 - dz * 0.05, 0, dz * 0.03 + dx * 0.05],
      [dx * 0.03 + dz * 0.05, 0, dz * 0.03 - dx * 0.05],
      [dx * fuori + dz * 0.02, alto, dz * fuori - dx * 0.02],
      [dx * fuori - dz * 0.02, alto, dz * fuori + dx * 0.02],
      verde);
  }
  return g;
}

/** LA CANNA DI PALUDE: due steli alti con la spiga scura in cima. */
function canna(r) {
  const g = { pos: [], col: [] };
  const steli = 2 + Math.floor(r() * 2);
  for (let i = 0; i < steli; i++) {
    const x = (r() - 0.5) * 0.3, z = (r() - 0.5) * 0.3;
    const alto = 1.3 + r() * 0.6;
    const verde = [0.32, 0.5 + r() * 0.08, 0.26, 1];
    quad(g, [x - 0.025, 0, z], [x + 0.025, 0, z], [x + 0.02, alto, z], [x - 0.02, alto, z], verde);
    quad(g, [x, 0, z - 0.025], [x, 0, z + 0.025], [x, alto, z + 0.02], [x, alto, z - 0.02], verde);
    const bruno = [0.36, 0.24, 0.13, 1];
    quad(g, [x - 0.045, alto, z], [x + 0.045, alto, z], [x + 0.045, alto + 0.22, z], [x - 0.045, alto + 0.22, z], bruno);
  }
  return g;
}

/** IL FIORE: uno stelo e quattro petali piatti attorno a un cuore. */
function fiore(r) {
  const g = { pos: [], col: [] };
  const alto = 0.62 + r() * 0.25;
  quad(g, [-0.015, 0, 0], [0.015, 0, 0], [0.015, alto, 0], [-0.015, alto, 0], [0.25, 0.45, 0.2, 1]);
  const TINTE = [[0.95, 0.55, 0.65, 1], [0.98, 0.85, 0.4, 1], [0.75, 0.6, 0.95, 1], [0.98, 0.98, 0.95, 1]];
  const t = TINTE[Math.floor(r() * TINTE.length)];
  for (let i = 0; i < 4; i++) {
    const a = (i / 4) * Math.PI * 2;
    const dx = Math.cos(a) * 0.09, dz = Math.sin(a) * 0.09;
    quad(g, [0, alto, 0], [dx - dz * 0.5, alto + 0.02, dz + dx * 0.5], [dx * 1.6, alto + 0.05, dz * 1.6], [dx + dz * 0.5, alto + 0.02, dz - dx * 0.5], t);
  }
  tri(g, [-0.03, alto + 0.06, -0.03], [0.03, alto + 0.06, -0.03], [0, alto + 0.06, 0.04], [0.98, 0.8, 0.2, 1]);
  return g;
}

/**
 * LE FAMIGLIE, in tabella — regola della casa. `ogni` è la densità (una ogni N
 * celle d'erba, in media), `proietta` decide se entra nella mappa d'ombra:
 * ⚠ i piccoli NON proiettano — un fiore nella mappa da 2048² è un texel di
 * rumore che costa un disegno per cascata.
 */
// ⚠ LE SCALE SONO TARATE CONTRO L'ERBA DI q0, che è alta e fitta: la prima
// stesura usava 0,8–1,4 e le famiglie AFFOGAVANO nel prato — si vedevano solo
// punte scure fra i fili, e il mondo sembrava vuoto come prima. Una
// decorazione che non supera l'erba di almeno mezza figura non esiste.
export const FAMIGLIE = {
  roccia: { costruisci: roccia, ogni: 90, scala: [0.9, 1.9], proietta: true },
  cespuglio: { costruisci: cespuglio, ogni: 55, scala: [1.2, 2.0], proietta: true },
  felce: { costruisci: felce, ogni: 40, scala: [1.0, 1.6], proietta: false },
  canna: { costruisci: canna, ogni: 70, scala: [1.0, 1.5], proietta: false, riva: true },
  fiore: { costruisci: fiore, ogni: 30, scala: [0.9, 1.3], proietta: false },
};

/**
 * LA SEMINA: dove va ogni istanza, deterministico dal seme.
 *
 * ⚠ SI SEMINA SULL'ERBA E BASTA (e le canne SOLO vicino all'acqua): la regola
 * viene dal mondo (`defDi`), non da elenchi. E si salta la cella se sopra non
 * c'è aria — niente cespugli dentro la collina.
 *
 * @param mondo  il mondo vero (serve `tipo`)
 * @param dove   { x0, z0, x1, z1 } l'area da vestire
 * @param yMin/yMax  la fascia di quote in cui cercare il suolo
 * @param densita  moltiplicatore globale (1 = tabella; la «prova dei 9000» lo alza)
 * @returns { famiglia → [{x,y,z,scala,giro}] }
 */
export function semina(mondo, dove, { yMin = 0, yMax = 24, densita = 1, seme = 20260830 } = {}) {
  const esito = {};
  for (const nome of Object.keys(FAMIGLIE)) esito[nome] = [];
  const r = caso(seme);
  for (let x = dove.x0; x < dove.x1; x++) {
    for (let z = dove.z0; z < dove.z1; z++) {
      // il suolo: la cella d'erba più alta della colonna nella fascia
      let y = null;
      for (let yy = yMax; yy >= yMin; yy--) {
        const t = mondo.tipo(x, yy, z);
        if (!t) continue;
        const def = defDi(t);
        if (def.acqua) break;                    // colonna d'acqua: niente
        if (t === 'erba' && !mondo.tipo(x, yy + 1, z)) y = yy;
        break;                                    // trovato il primo pieno
      }
      if (y === null) continue;
      for (const [nome, f] of Object.entries(FAMIGLIE)) {
        if (r() * f.ogni >= densita) continue;
        if (f.riva && !vicinoAcqua(mondo, x, y, z)) continue;
        esito[nome].push({
          x: x + 0.5 + (r() - 0.5) * 0.6,
          y: y + 1,
          z: z + 0.5 + (r() - 0.5) * 0.6,
          scala: f.scala[0] + r() * (f.scala[1] - f.scala[0]),
          giro: r() * Math.PI * 2,
        });
        break;                                    // una decorazione per cella
      }
    }
  }
  return esito;
}

/** C'è acqua entro due celle? (per le canne di riva) */
function vicinoAcqua(mondo, x, y, z) {
  for (let dx = -2; dx <= 2; dx++) {
    for (let dz = -2; dz <= 2; dz++) {
      const t = mondo.tipo(x + dx, y, z + dz) || mondo.tipo(x + dx, y - 1, z + dz);
      if (t && defDi(t).acqua) return true;
    }
  }
  return false;
}

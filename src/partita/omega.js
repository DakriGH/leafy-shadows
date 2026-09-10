// L'OMEGA TEST — il banco di tortura del nucleo.
//
// ⚠ IL COMMITTENTE: «manca anche un omega test con migliaia di blocchi diversi
// luci colorate blocchi dinamici e mesh dinamiche in view per capire i veri
// problemi di fps e grafici, un abominio di mesh e luci blocchi ombre per
// testare bene al massimo l'engine anche con render distance enormi».
//
// ⚠ NON È LO ZOO, e la differenza è tutta. Lo zoo (`partita/zoo.js`) è una
// scena FINITA di 64×64 con una piazzola per difetto: serve a GUARDARE una cosa
// per volta, isolata. Qui serve il contrario — tutto insieme, addosso, e senza
// bordo: un banco che finisce a trentadue blocchi non si può guardare con la
// distanza di resa a centosessanta, ed è proprio la distanza che si vuole
// mettere alla prova.
//
// ⚠ E NON È NEMMENO LA RAMPA del banco del nucleo (`?rampa`), che sale di
// TRIANGOLI su terreno finto: i triangoli non sono mai stati il problema (F0 ne
// ha retti un milione a 90 fps). Quello che non si è mai misurato insieme è il
// resto: le chiamate di disegno dei modelli, le pozze dei lampioni per pixel,
// l'ombra della lampada che cammina nei voxel, la mappa d'ombra che si rifà, i
// corpi a passo fisso, la schiuma, il pelo dell'acqua, lo specchio.
//
// COSA C'È DENTRO, e ognuna risponde a una parola del mandato:
//  · «migliaia di blocchi DIVERSI» — le colonne prendono il tipo dalla tabella
//    dei blocchi VIVA, non da una lista scritta a mano: un blocco aggiunto
//    domani entra da solo nel banco. È la stessa lezione della creativa.
//  · «luci colorate» — le lampade sono fitte, e a colori diversi. Sono la cosa
//    più cara che c'è: ognuna è una pozza per pixel e un cammino nei voxel.
//  · «blocchi dinamici» — i canali d'acqua, che la simulazione tiene vivi, e i
//    lampioni che si accendono e si spengono.
//  · «mesh dinamiche in view» — gli alberi e gli arredi a istanze, più i corpi
//    che la partita lancia.
//  · «render distance enormi» — è per CHUNK e non finisce mai: `?raggio=160`.
//
// ⚠ NIENTE DOM, NIENTE GL: torna le decorazioni come gli altri generatori.
// Si prova in Node.
import { CHUNK } from '../world/world.js';
import { BLOCCHI, defDi } from '../world/blocks.js';
import { ARREDI } from './arredi.js';

/** La quota del suolo di riferimento. */
export const QUOTA = 8;

/**
 * ⚠ LE MANOPOLE STANNO QUI E SONO POCHE. Un banco con venti parametri non lo
 * usa nessuno: si accende, si guarda il numero, si cambia UNA cosa. Quelle che
 * contano sono la fittezza delle lampade (la voce più cara) e delle colonne.
 */
export const OMEGA = {
  /** una colonna ogni quante celle, in media */
  passoColonne: 3,
  /** una lampada ogni quante celle: 11 è già un abominio, 7 è disperazione */
  passoLampade: 11,
  /** un modello (albero, arredo) ogni quante celle */
  passoModelli: 5,
  /** ogni quante celle passa un canale d'acqua, nei due assi */
  // ⚠ SEDICI COME IL CHUNK, non di più: con un periodo più largo del chunk
  //    esistono chunk che cadono FRA due canali e non ne vedono nessuno — cioè
  //    angoli dove il banco è facile, che in un banco di tortura sono il difetto
  //    peggiore (si misura là e si crede di avere margine).
  passoCanali: 16,
  /** quanto è mosso il terreno, in blocchi */
  rilievo: 7,
};

/** Un hash stabile per cella: la scena è la stessa a ogni sessione e su ogni macchina. */
function hash(x, z, seme) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(z | 0, 668265263) + Math.imul(seme | 0, 1442695041)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/**
 * I TIPI DI BLOCCO da usare per le colonne — dalla tabella VIVA.
 *
 * ⚠ NON UNA LISTA SCRITTA A MANO. Una lista a mano è quello che era la
 * `CASSETTA`, e il suo difetto è che il blocco aggiunto ieri non c'è: un banco
 * che promette «tutti i blocchi» e ne prova venti è peggio di nessun banco,
 * perché ci si crede. Si escludono solo l'acqua (ha il suo posto: i canali) e i
 * modelli (non sono colonne: vanno a istanze).
 */
export function tipiDaColonna() {
  return Object.keys(BLOCCHI).filter((id) => {
    const d = defDi(id);
    return d && !d.acqua && d.forma !== 'modello';
  }).sort();
}

/** I tipi di lampada: i blocchi che dichiarano una luce. Colori diversi = colori diversi a schermo. */
export function tipiDaLampada() {
  return Object.keys(BLOCCHI).filter((id) => { const d = defDi(id); return d && d.luce; }).sort();
}

/** L'altezza del suolo in (x, z): mosso, così l'ombra del sole ha di che lavorare. */
export function suoloOmega(x, z) {
  const a = Math.sin(x * 0.07) * Math.cos(z * 0.061);
  const b = Math.sin((x + z) * 0.023) * 0.6;
  return QUOTA + Math.round((a + b) * OMEGA.rilievo * 0.5);
}

/** Qui passa un canale d'acqua? */
export function canaleIn(x, z) {
  const mx = ((x % OMEGA.passoCanali) + OMEGA.passoCanali) % OMEGA.passoCanali;
  const mz = ((z % OMEGA.passoCanali) + OMEGA.passoCanali) % OMEGA.passoCanali;
  return mx < 3 || mz < 3;
}

/**
 * Genera il chunk (cx, cz) dell'omega test.
 * Torna `[[x, y, z, tipo], …]` da posare NON silenziose (i modelli: li deve
 * vedere il registro delle entità).
 */
export function generaChunkOmega(mondo, cx, cz) {
  const decorazioni = [];
  const x0 = cx * CHUNK, z0 = cz * CHUNK;
  const colonne = tipiDaColonna();
  const lampade = tipiDaLampada();
  const arredi = Object.keys(ARREDI);

  for (let x = x0; x < x0 + CHUNK; x++) for (let z = z0; z < z0 + CHUNK; z++) {
    const suolo = suoloOmega(x, z);
    const canale = canaleIn(x, z);

    // il terreno: tre celle di terra e la cima
    for (let y = suolo - 3; y < suolo; y++) mondo.metti(x, y, z, 'terra', true);
    if (canale) {
      // ⚠ IL CANALE È SCAVATO E PIENO: l'acqua è la cosa che costa di più a
      // schermo (pelo, specchio, schiuma, e la simulazione che lo tiene vivo),
      // e in un banco di tortura deve essercene ovunque, non in una vasca.
      mondo.metti(x, suolo - 1, z, 'sabbia', true);
      mondo.metti(x, suolo, z, 'acqua', true);
      continue;
    }
    mondo.metti(x, suolo, z, 'erba', true);

    // le colonne: un tipo di blocco diverso ogni volta, altezza variabile
    const h = hash(x, z, 1);
    if (h < 1 / OMEGA.passoColonne) {
      const tipo = colonne[Math.floor(hash(x, z, 2) * colonne.length) % colonne.length];
      const alta = 1 + Math.floor(hash(x, z, 3) * 5);
      for (let y = suolo + 1; y <= suolo + alta; y++) mondo.metti(x, y, z, tipo, true);
      continue;
    }

    // le lampade colorate: fitte, e sono la voce più cara del banco
    if (lampade.length && hash(x, z, 4) < 1 / OMEGA.passoLampade) {
      const tipo = lampade[Math.floor(hash(x, z, 5) * lampade.length) % lampade.length];
      mondo.metti(x, suolo + 1, z, tipo, true);
      continue;
    }

    // i modelli: alberi, lampioni e arredi, tutti a istanze
    if (hash(x, z, 6) < 1 / OMEGA.passoModelli) {
      const q = hash(x, z, 7);
      const tipo = q < 0.45 ? 'albero' : q < 0.7 ? 'lampione' : arredi[Math.floor(q * 1000) % arredi.length];
      decorazioni.push([x, suolo + 1, z, tipo]);
    }
  }
  return decorazioni;
}

/**
 * Il conto di quello che il banco mette in un chunk — per la diagnostica e per
 * le prove. ⚠ Non simula: conta, così una prova può dire «qui ci sono davvero
 * migliaia di blocchi diversi» invece di fidarsi.
 */
export function inventarioChunk(mondo, cx, cz) {
  const x0 = cx * CHUNK, z0 = cz * CHUNK;
  const tipi = new Map();
  let blocchi = 0;
  for (let x = x0; x < x0 + CHUNK; x++) for (let z = z0; z < z0 + CHUNK; z++) {
    for (let y = -8; y < 64; y++) {
      const t = mondo.tipo(x, y, z);
      if (!t) continue;
      blocchi++;
      tipi.set(t, (tipi.get(t) || 0) + 1);
    }
  }
  return { blocchi, tipiDiversi: tipi.size, tipi };
}

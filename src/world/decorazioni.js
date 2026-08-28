// LE DECORAZIONI — alberi e lampioni, che sono BLOCCHI con un modello addosso.
//
// ⚠ PRIMA NON ESISTEVANO NEL MONDO. Il worldgen piazzava delle istanze di mesh
// e finiva lì: non erano celle, quindi non si potevano rompere, non si
// salvavano, e la mira ci passava attraverso. Committente: «non posso piazzare
// o rompere lampioni alberi erba».
//
// La cura non è stata una seconda macchina accanto a quella dei blocchi: è
// stato farli diventare blocchi. Un blocco con `forma: 'modello'` occupa la sua
// cella e non disegna niente (vedi `forme.js`); il modello lo mette chi ascolta
// gli eventi del mondo (`gioco/decoro.js`). Così `metti`, `togli`, la mira, la
// barra e il salvataggio sono quelli di sempre.
//
// ⚠ E NON SONO SOLIDI: ci si cammina dentro. Un albero alto quattro celle
// rappresentato da UNA cella solida darebbe una collisione che non somiglia a
// niente — un muro invisibile largo un metro sotto una chioma larga tre. Meglio
// nessuna collisione che una sbagliata; il giorno che servirà, la scatola per
// darla è già scritta qui sotto.

import { registraBlocco, CATEGORIA_OFFICINA } from './blocks.js';

/**
 * ⚠ TABELLA, e le colonne servono tutte:
 *  · `modello`         il file .glb da disegnare
 *  · `altezza`/`mezza` la SCATOLA con cui si mira — non il modello vero, che è
 *    troppo sottile per prenderlo col dito (vedi sotto)
 *  · `quota`           di quanto alzare il modello rispetto alla cella
 *  · `luce`            se ce l'ha, e allora si accende e si spegne
 *  · `proietta`        se entra nella mappa d'ombra — ⚠ di fabbrica SÌ, ma le
 *    cose piccole devono dire di no: un'ombra che nessuno guarda è geometria
 *    disegnata in ogni cascata per niente
 *  · `notte`           se segue il ciclo del giorno da solo
 */
export const DECORAZIONI = {
  lampione: {
    nome: 'Lampione', modello: 'lampione',
    // ⚠ LA SCATOLA È PIÙ LARGA DEL PALO, di proposito: il palo vero è un quinto
    // di cella, e centrarci sopra un raggio col dito è una piccola tortura.
    // 0,45 per lato è ancora dentro la cella — non ruba il clic al blocco
    // accanto — ed è un bersaglio che si prende.
    altezza: 3.0, mezza: 0.45,
    cima: 0xffeab4, lato: 0x5b6270, fondo: 0x474d58,
    // ⚠ QUATTRO E SEI, che è il raggio VERO del lampione di Leafy-Lantern (nel
    // suo registro dei furni). Avevo messo 8,5 prendendolo dalla lampada-blocco,
    // e il committente l'ha visto: «il raggio di luce era più corto».
    luce: { colore: 0xffd889, raggio: 4.6, intensita: 1.0, ombra: true, quota: 2.6 },
    notte: true,
  },
  albero: {
    nome: 'Albero', modello: 'albero',
    altezza: 4.2, mezza: 0.7,
    cima: 0x4f9e46, lato: 0x7a5230, fondo: 0x6a4526,
  },
};

/**
 * Registra le decorazioni come blocchi veri.
 * ⚠ VA CHIAMATA PRIMA DI TOCCARE IL MONDO, come `collegaFabbrica`: se no il
 * worldgen prova a posare un tipo che non esiste e il difetto esce lontano.
 */
export function registraDecorazioni() {
  for (const [id, d] of Object.entries(DECORAZIONI)) {
    registraBlocco(id, {
      nome: d.nome, cima: d.cima, lato: d.lato, fondo: d.fondo,
      // ⚠ NON SOLIDO E SENZA GEOMETRIA: la cella è occupata (non ci si posa
      // dentro un altro blocco) ma non si disegna e non ferma il passo.
      solido: false, nav: 10, fam: 'taglia',
      forma: 'modello', modello: d.modello,
    }, CATEGORIA_OFFICINA);
  }
}

/** La scatola con cui si mira a una decorazione in questa cella. */
export function scatolaDi(tipo, x, y, z) {
  const d = DECORAZIONI[tipo];
  if (!d) return null;
  return {
    min: { x: x + 0.5 - d.mezza, y, z: z + 0.5 - d.mezza },
    max: { x: x + 0.5 + d.mezza, y: y + d.altezza, z: z + 0.5 + d.mezza },
  };
}

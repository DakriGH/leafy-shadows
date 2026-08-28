// LO ZOO — un mondo fatto apposta per guardare una cosa alla volta.
//
// ⚠ PERCHÉ ESISTE, ed è la lezione di questa giornata. Ogni difetto grafico di
// oggi l'ho cercato nel mondo VERO: acne su una spiaggia a caso, tiling su una
// terrazza a caso, lampade su un lampione a caso. E ogni volta ho dovuto prima
// costruire la scena giusta — il sole all'ora giusta, la camera nel punto
// giusto — e spesso ho misurato la cosa sbagliata perché la scena non isolava
// niente. Due volte ho scritto una prova che passava col difetto vivo.
//
// Uno zoo è una scena dove ogni difetto ha il suo posto e ci sta SEMPRE. Non si
// cerca più l'acne: si va alla piazzola dell'acne, che è una ventaglio di
// rampe da 0 a 90 gradi, e o c'è o non c'è.
//
// ⚠ E NON SA CHE ESISTE UN MOTORE, come tutto il resto di `src/world/`: qui si
// posano blocchi e si dichiara dove vanno le cose. Chi accende le luci e chi
// disegna i modelli lo fa altrove, leggendo `PIAZZOLE`.

/** La quota del pavimento dello zoo. Tondo, così i conti si fanno a mente. */
export const SUOLO = 8;

/** Quanto è larga una piazzola e quanto distano fra loro. */
export const PASSO = 40;

/**
 * LE PIAZZOLE, in tabella.
 *
 * ⚠ TABELLA, NON `if` SPARSI — regola della casa, e qui serve doppio: chi
 * aggiunge una prova aggiunge UNA RIGA, e la trova subito anche fra sei mesi.
 * `x`/`z` sono in celle; `costruisci` posa i blocchi; `nota` è quello che si
 * legge a schermo quando ci si arriva.
 */
export const PIAZZOLE = [
  {
    id: 'acne',
    nome: 'Acne e scarto d\'ombra',
    x: 0, z: 0,
    nota: 'Rampe da quasi piatta a quasi verticale. L\'acne nasce dove la faccia è '
        + 'quasi PARALLELA ai raggi: al variare dell\'ora, la banda che si sporca '
        + 'si sposta lungo il ventaglio. Se una rampa si tratteggia, si è visto.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30);
      // ⚠ UN VENTAGLIO, NON UNA RAMPA SOLA. Il difetto vive in una BANDA di
      // pendenze, e con una pendenza sola o la si becca o si conclude «non c'è».
      for (let g = 0; g < 10; g++) {
        const alto = g + 1;                    // 1..10 blocchi di salita
        for (let p = 0; p < alto; p++) {
          for (let l = 0; l < 2; l++) {
            for (let y = 0; y <= p; y++) m.metti(ox + 3 + g * 2 + l, SUOLO + y, oz + 4 + p, 'pietra', true);
          }
        }
      }
      // e una parete verticale piena, che è il caso estremo
      for (let x = 0; x < 24; x++) for (let y = 0; y < 6; y++) m.metti(ox + 3 + x, SUOLO + y, oz + 26, 'pietra', true);
    },
  },
  {
    id: 'ombre',
    nome: 'Ombre proiettate',
    x: 1, z: 0,
    nota: 'Pilastri di altezza crescente e un pettine di muri sottili. Si guarda '
        + 'la NETTEZZA del bordo (i gradini devono restare tre) e la scalinata '
        + 'della mappa quando il sole si abbassa.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30);
      for (let i = 0; i < 8; i++) {
        const h = 1 + i * 2;
        for (let y = 0; y < h; y++) m.metti(ox + 4 + i * 3, SUOLO + y, oz + 6, 'pietra', true);
      }
      // il pettine: muri di UN blocco di spessore, il caso che la mappa fatica
      // di più a rappresentare
      for (let i = 0; i < 8; i++) {
        for (let z = 0; z < 10; z++) for (let y = 0; y < 4; y++) {
          m.metti(ox + 4 + i * 3, SUOLO + y, oz + 14 + z, 'pietra', true);
        }
      }
    },
  },
  {
    id: 'luci',
    nome: 'Luci: raggio, colore, movimento',
    x: 2, z: 0,
    nota: 'Una fila di lampade con raggio crescente, una di colori, e una che si '
        + 'muove. Si guardano i GRADINI della pozza e dove il raggio smette di '
        + 'rendere: sotto una certa misura la quantizzazione la azzera.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30);
      // dei muretti su cui vedere la pozza salire
      for (let i = 0; i < 6; i++) {
        for (let z = 0; z < 3; z++) for (let y = 0; y < 3; y++) m.metti(ox + 4 + i * 5, SUOLO + y, oz + 20 + z, 'pietra', true);
      }
    },
    // ⚠ LE LUCI SONO DATI, non codice: chi le accende sta nel motore e legge
    // questa lista. Così la piazzola resta agnostica e la si può provare in Node.
    luci: [
      // raggio crescente, stesso colore
      ...[3, 5, 8, 12, 18, 26].map((r, i) => ({ x: 4 + i * 5, y: 4, z: 8, raggio: r, etichetta: `r=${r}` })),
      // colori
      { x: 6, y: 3, z: 14, raggio: 9, colore: [1.0, 0.35, 0.30], etichetta: 'rossa' },
      { x: 13, y: 3, z: 14, raggio: 9, colore: [0.35, 1.0, 0.55], etichetta: 'verde' },
      { x: 20, y: 3, z: 14, raggio: 9, colore: [0.40, 0.55, 1.0], etichetta: 'blu' },
      // e una che gira: serve a vedere se la banda «respira» o salta
      { x: 15, y: 4, z: 24, raggio: 12, colore: [1.0, 0.88, 0.6], gira: 6, etichetta: 'in moto' },
    ],
  },
  {
    id: 'distanza',
    nome: 'Distanza, nebbia e LOD',
    x: 0, z: 1,
    nota: 'Un corridoio di pilastri identici che si perde all\'orizzonte. Si '
        + 'guarda DOVE la nebbia li mangia, se sfarfallano prima di sparire, e '
        + 'se il passaggio si vede.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 200);
      for (let i = 0; i < 40; i++) {
        for (let y = 0; y < 5; y++) {
          m.metti(ox + 10, SUOLO + y, oz + 6 + i * 5, 'pietra', true);
          m.metti(ox + 20, SUOLO + y, oz + 6 + i * 5, 'pietra', true);
        }
      }
    },
  },
  {
    id: 'erba',
    nome: 'Erba: tiling, altezze, attacco',
    x: 1, z: 1,
    nota: 'Un tappeto piano grande, una scarpata e dei gradini. Si cerca il '
        + 'RETICOLO (motivi che si ripetono a un blocco di passo), le cupole al '
        + 'centro delle celle, e che la base del filo sia il colore del blocco.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30, 'erba');
      // una scarpata: l'erba su una pendenza si legge diversamente
      for (let i = 0; i < 8; i++) {
        for (let x = 0; x < 26; x++) for (let y = 0; y <= i; y++) {
          m.metti(ox + 2 + x, SUOLO + y, oz + 20 + i, i === y ? 'erba' : 'terra', true);
        }
      }
    },
  },
  {
    id: 'modelli',
    nome: 'Modelli: alberi e lampioni',
    x: 2, z: 1,
    nota: 'Una fila di ognuno. Si guarda che POGGINO a terra (non fluttuino), che '
        + 'i colori non siano né neri né slavati, e che l\'ombra che proiettano '
        + 'segua la forma vera.',
    costruisci(m, ox, oz) { pavimento(m, ox, oz, 30, 30, 'erba'); },
    modelli: [
      ...Array.from({ length: 5 }, (_, i) => ({ nome: 'albero', x: 5 + i * 5, z: 8 })),
      ...Array.from({ length: 4 }, (_, i) => ({ nome: 'lampione', x: 6 + i * 6, z: 20, luce: true })),
    ],
  },
];

/** Un lastrone di terreno, con la faccia di sopra del tipo che si vuole. */
function pavimento(m, ox, oz, larg, prof, cima = 'pietra') {
  for (let x = 0; x < larg; x++) {
    for (let z = 0; z < prof; z++) {
      m.metti(ox + x, SUOLO - 1, oz + z, 'terra', true);
      m.metti(ox + x, SUOLO, oz + z, cima, true);
    }
  }
}

/** Dove sta il centro di una piazzola, in coordinate di mondo. */
export function centroDi(p) {
  return { x: p.x * PASSO + 15, y: SUOLO + 1, z: p.z * PASSO + 15 };
}

/**
 * Costruisce lo zoo intero.
 * ⚠ SVUOTA IL MONDO PRIMA: uno zoo mezzo sovrapposto a un altro mondo non
 * isola niente, che è l'unica cosa che deve fare.
 */
export function generaZoo(mondo) {
  mondo.svuota();
  for (const p of PIAZZOLE) p.costruisci(mondo, p.x * PASSO, p.z * PASSO);
  return PIAZZOLE;
}

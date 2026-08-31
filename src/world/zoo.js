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

/**
 * Quanto distano fra loro i centri delle piazzole.
 *
 * ⚠ CINQUANTA E NON QUARANTA, e il motivo è l'isolamento: con quaranta restano
 * dieci celle fra una piazzola e l'altra, e una lampada da raggio dodici le
 * scavalca — le pozze della prova «con ombra e senza» finivano dentro la prova
 * del ciclo del giorno. Non è un difetto grave, è peggio: è rumore in un posto
 * che esiste per non averne.
 *
 * ⚠ E NON SI PUÒ ALZARE ALL'INFINITO: la griglia dei muri copre il mondo
 * intero, e oltre due milioni di celle il mesher la stacca DI PROPRIO — senza
 * un errore, semplicemente le lampade tornano ad attraversare i muri. Con
 * cinquanta si sta a circa 1,6 milioni. La prova `test/zoo-isola.test.mjs`
 * tiene il conto, perché è esattamente il tipo di limite che si supera per
 * sbaglio aggiungendo una piazzola.
 */
export const PASSO = 50;

/** Quanto è grande una piazzola, se non dice altro. */
export const LARG = 30, PROF = 30;

/** L'ingombro di una piazzola, in celle di mondo. Serve alla prova che nessuna
 *  invada la vicina — vedi `test/zoo-isola.test.mjs`. */
export function ingombroDi(p) {
  return { x0: p.x * PASSO, z0: p.z * PASSO,
           x1: p.x * PASSO + (p.larg || LARG), z1: p.z * PASSO + (p.prof || PROF) };
}

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
    // ⚠ UNA CORSIA TUTTA SUA, e non è estetica: questa piazzola è profonda 200
    // celle contro le 30 di tutte le altre, e nella griglia normale PASSAVA
    // ATTRAVERSO le sue vicine. I suoi pilastri spuntavano dentro la prova
    // delle lampade, e per un momento ho creduto a un difetto delle ombre.
    // Uno zoo che non isola non serve a niente — è l'unica cosa che deve fare.
    x: 3, z: 0, larg: 30, prof: 202,   // ⚠ 202 e non 200: l'ultimo pilastro sta a oz+201
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
  {
    id: 'ombraluci',
    nome: 'Lampade: con ombra e senza',
    x: 0, z: 2,
    nota: 'LA PROVA DI LANTERN, ricopiata: due lampade IDENTICHE — stesso colore, '
        + 'stesso raggio, stessa quota — dietro due muri identici. L\'unica cosa '
        + 'diversa è la classe. A sinistra PESANTE: cammina la griglia dei muri, '
        + 'e dietro il muro c\'è il buio. A destra LEGGERA: trapassa, e costa una '
        + 'distanza. Se le due metà si somigliano, il cammino non sta girando.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30);
      // due muri identici, uno per metà. ⚠ IDENTICI DAVVERO: se uno fosse più
      // alto o più spesso, la differenza a schermo non sarebbe più la classe.
      for (const cx of [7, 22]) {
        for (let z = 0; z < 12; z++) for (let y = 1; y <= 5; y++) m.metti(ox + cx, SUOLO + y, oz + 9 + z, 'pietra', true);
      }
      // il marcatore ai piedi, come in Lantern: lana bianca = pesante, rossa = leggera
      for (let d = -1; d <= 1; d++) {
        m.metti(ox + 7 + d, SUOLO, oz + 6, 'lanaBianca', true);
        m.metti(ox + 22 + d, SUOLO, oz + 6, 'lanaRossa', true);
      }
    },
    luci: [
      { x: 7, y: 4, z: 6, raggio: 12, ombra: true, etichetta: 'pesante (con ombra)' },
      { x: 22, y: 4, z: 6, raggio: 12, ombra: false, etichetta: 'leggera (trapassa)' },
    ],
  },
  {
    id: 'forme',
    nome: 'Luci ad area, neon e quadrate',
    x: 1, z: 2,
    nota: 'La stessa primitiva quattro volte: una SCATOLA con semi-lati. A zero è '
        + 'un punto; su un asse è un NEON; su due è un PANNELLO ad area; su tre è '
        + 'una luce QUADRATA. Si guarda che la pozza prenda la FORMA della '
        + 'sorgente invece di restare tonda, e che l\'ombra del pilastro nasca dal '
        + 'bordo giusto — da un neon si allarga, da un punto è un cono netto.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30);
      // ⚠ UN QUADRANTE PER FORMA, e non è ordine: con le quattro in fila le
      // pozze si sovrapponevano tutte e il pavimento andava a saturazione —
      // quattro luci bianche sommate fanno bianco, e la forma non si vedeva
      // più. Una prova che confonde ciò che deve distinguere non è una prova.
      // Un muretto basso a dividere: aiuta l'occhio senza fare ombra alle altre.
      for (let d = 0; d < 30; d++) {
        m.metti(ox + 15, SUOLO + 1, oz + d, 'roccia', true);
        m.metti(ox + d, SUOLO + 1, oz + 15, 'roccia', true);
      }
      // ⚠ E UN PILASTRO PER OGNUNA: una luce ad area si riconosce dall'OMBRA che
      // proietta, non dalla pozza — è larga, quindi il suo cono d'ombra si apre
      // invece di restare parallelo. Senza un ostacolo, neon e punto si
      // somigliano parecchio.
      for (const [px, pz] of [[7, 11], [22, 11], [7, 26], [22, 26]]) {
        for (let y = 2; y <= 5; y++) m.metti(ox + px, SUOLO + y, oz + pz, 'pietra', true);
      }
    },
    luci: [
      { x: 7, y: 5, z: 6, raggio: 9, forza: 0.9, etichetta: 'punto' },
      { x: 22, y: 5, z: 6, raggio: 9, forza: 0.9, semiLati: [3.5, 0, 0],
        colore: [0.55, 0.85, 1.0], etichetta: 'neon (un asse)' },
      { x: 7, y: 5, z: 21, raggio: 9, forza: 0.9, semiLati: [3, 0, 3],
        colore: [1.0, 0.9, 0.6], etichetta: 'area (due assi)' },
      { x: 22, y: 5, z: 21, raggio: 9, forza: 0.9, semiLati: [1.6, 1.6, 1.6],
        colore: [1.0, 0.55, 0.75], etichetta: 'quadrata (tre assi)' },
    ],
  },
  {
    id: 'particelle',
    nome: 'Particelle',
    x: 2, z: 2,
    nota: 'Quattro ricette sullo stesso pavimento: lucciole, fumo, scintille, neve. '
        + 'Si guarda la figura (quadratini pieni, mai aloni sfumati) e la fusione '
        + '(normale, non additiva: dieci sovrapposte non devono fare bianco). '
        + '⚠ LIMITE DICHIARATO: non prendono le lampade, in Lantern sì.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30);
      // uno sfondo scuro dietro: le particelle chiare su terra chiara non si leggono
      for (let x = 0; x < 30; x++) for (let y = 1; y <= 7; y++) m.metti(ox + x, SUOLO + y, oz + 28, 'roccia', true);
    },
    particelle: [
      { nome: 'lucciole', x: 6, y: 3, z: 10 },
      { nome: 'fumo', x: 13, y: 1, z: 10 },
      { nome: 'scintille', x: 20, y: 1, z: 10 },
      { nome: 'neve', x: 15, y: 1, z: 15 },
    ],
    luci: [{ x: 15, y: 6, z: 6, raggio: 14, colore: [0.7, 0.8, 1.0], etichetta: 'per vedere le particelle' }],
  },
  {
    id: 'ciclo',
    nome: 'Ciclo del giorno',
    x: 0, z: 1,
    nota: 'Le quattro facce cardinali, tre albedo diversi (erba, sabbia, roccia) e '
        + 'uno gnomone alto. Con ↑ ↓ si scorre l\'ora: si guarda che l\'ombra viri '
        + 'col CIELO e non verso il grigio, che l\'alba e il tramonto siano '
        + 'diversi fra loro, e che l\'ombra dello gnomone giri senza saltare.',
    costruisci(m, ox, oz) {
      pavimento(m, ox, oz, 30, 30);
      // ⚠ TRE ALBEDO, e servono: l'ombra si legge diversamente su un verde
      // saturo e su una sabbia chiara — in Lantern la taratura dell'ombra è
      // stata rifatta proprio perché «spariva dentro la saturazione del verde».
      for (let x = 0; x < 10; x++) for (let z = 0; z < 10; z++) {
        m.metti(ox + 2 + x, SUOLO, oz + 2 + z, 'erba', true);
        m.metti(ox + 13 + x, SUOLO, oz + 2 + z, 'sabbia', true);
        m.metti(ox + 2 + x, SUOLO, oz + 14 + z, 'roccia', true);
      }
      // le quattro facce cardinali: un cubo cavo aperto in alto
      for (let y = 1; y <= 4; y++) {
        for (let d = 0; d < 6; d++) {
          m.metti(ox + 16 + d, SUOLO + y, oz + 16, 'pietra', true);
          m.metti(ox + 16 + d, SUOLO + y, oz + 21, 'pietra', true);
          m.metti(ox + 16, SUOLO + y, oz + 16 + d, 'pietra', true);
          m.metti(ox + 21, SUOLO + y, oz + 16 + d, 'pietra', true);
        }
      }
      // lo gnomone: alto e sottile, l'ombra più lunga e più leggibile che c'è
      for (let y = 1; y <= 14; y++) m.metti(ox + 26, SUOLO + y, oz + 26, 'legno', true);
    },
  },
  {
    id: 'acqua',
    nome: 'Acqua: calma, corrente, cascata',
    // ⚠ NON A x=3: quella corsia è tutta della piazzola della distanza, che è
    // profonda 202 celle e attraversa quattro righe della griglia.
    x: 0, z: 3,
    nota: 'Tutti e tre gli stati che il mondo distingue, uno accanto all\'altro. '
        + 'Lo specchio grande serve alla STRADA DEL SOLE (muovi l\'ora con , e .) '
        + 'e alla fascia chiara di bassofondo lungo la riva. I due canali — largo '
        + 'UNO e largo DUE — sono il caso che rovina ogni soglia: se il canale '
        + 'stretto viene bianco pieno, la schiuma sta guardando la distanza dalla '
        + 'sponda e non l\'apertura. La scalinata mostra la corrente (il disegno '
        + 'deve scorrere GIÙ per la scala, non di traverso) e gli scivoli. La '
        + 'cascata mostra le striature verticali e il labbro bianco su ogni '
        + 'gradino: se le striature sono orizzontali, le coordinate del muro sono '
        + 'scambiate.',
    costruisci(m, ox, oz) {
      // ⚠ UN LASTRONE SPESSO, non il `pavimento` di una cella: qui si SCAVA, e
      // con un blocco solo il fondo delle vasche sarebbe il VUOTO — l'acqua si
      // vedrebbe appoggiata sul niente e il difetto sembrerebbe dello shader.
      for (let x = 0; x < 30; x++) {
        for (let z = 0; z < 30; z++) {
          for (let y = SUOLO - 4; y < SUOLO; y++) m.metti(ox + x, y, oz + z, 'terra', true);
          m.metti(ox + x, SUOLO, oz + z, 'erba', true);
        }
      }

      /** Scava una vasca e la riempie di SORGENTI fino a filo del suolo. */
      const vasca = (x0, z0, larg, prof, fondo) => {
        for (let x = 0; x < larg; x++) {
          for (let z = 0; z < prof; z++) {
            for (let y = fondo; y <= SUOLO; y++) m.metti(ox + x0 + x, y, oz + z0 + z, 'acqua', true);
          }
        }
        // la riva di sabbia: il bianco della schiuma su un verde saturo si
        // legge male, e qui serve vederla bene
        for (let x = -1; x <= larg; x++) {
          for (let z = -1; z <= prof; z++) {
            if (x >= 0 && x < larg && z >= 0 && z < prof) continue;
            m.metti(ox + x0 + x, SUOLO, oz + z0 + z, 'sabbia', true);
          }
        }
      };

      // ---- LO SPECCHIO GRANDE: dodici celle, cioè acqua APERTA -------------
      // ⚠ E DEVE ESSERE LARGO ALMENO CINQUE. La riva la misura il mesher su un
      // intorno 5×5 (RIVA_RAGGIO 2): in una pozza più stretta ogni cella tocca
      // una sponda, non esiste il «largo», e non si vedrebbe mai la differenza
      // fra bassofondo e fondo — cioè proprio la cosa che si viene a guardare.
      vasca(2, 2, 12, 12, SUOLO - 2);

      // ---- I DUE CANALI: largo UNO e largo DUE -----------------------------
      // Il primo è il caso che ha già rotto le soglie una volta: tutti e quattro
      // gli angoli toccano una sponda, la distanza vale zero su tutta la cella e
      // una soglia generosa lo dipinge di bianco pieno. Il secondo sta accanto
      // apposta: senza un termine di paragone «bianco» non vuol dire niente.
      vasca(17, 2, 1, 12, SUOLO - 1);
      vasca(21, 2, 2, 12, SUOLO - 1);

      // ---- LA SCALINATA: la corrente e gli scivoli -------------------------
      // Cinque gradini che scendono, e su ognuno i livelli crescono verso valle.
      // ⚠ LA CORRENTE LA RICAVA IL MESHER DAL GRADIENTE DEI LIVELLI: mettere
      // tutte sorgenti darebbe un'acqua FERMA su una scala, che non è il caso
      // che si vuole guardare. Ogni gradino riparte da zero, così la scalinata
      // ha corrente dappertutto invece che nei primi tre metri.
      // ⚠ IN RILIEVO, NON SCAVATA, ed è una correzione presa guardando: la prima
      // stesura era una TRINCEA che scendeva sotto il livello del prato, e a
      // schermo l'acqua spariva dentro il fosso — da qualunque angolo si
      // vedevano le sponde e basta. Uno zoo che nasconde la cosa che deve
      // mostrare non serve a niente. Adesso la scala SALE dal prato e l'acqua
      // sta in cima, quindi la si vede da tutti i lati.
      for (let g = 0; g < 5; g++) {
        const y = SUOLO + 4 - g;
        for (let p = 0; p < 3; p++) {
          const x = 2 + g * 3 + p;
          for (let z = 0; z < 3; z++) {
            for (let yy = SUOLO + 1; yy <= y; yy++) m.metti(ox + x, yy, oz + 17 + z, 'roccia', true);
            m.metti(ox + x, y, oz + 17 + z, p === 0 ? 'acqua' : 'acqua~' + p, true);
          }
          // le sponde: due cordoli alti uno, o l'acqua scivola via di lato e la
          // corrente punta fuori invece che lungo la scala
          m.metti(ox + x, y, oz + 16, 'roccia', true);
          m.metti(ox + x, y, oz + 20, 'roccia', true);
        }
      }

      // ---- LA CASCATA: striature verticali e labbro dei gradini ------------
      // Un altopiano con una vasca in cima, uno scarico, e una colonna che cade
      // cinque blocchi dentro una pozza.
      for (let x = 22; x <= 28; x++) {
        for (let z = 17; z <= 28; z++) {
          for (let y = SUOLO + 1; y <= SUOLO + 5; y++) m.metti(ox + x, y, oz + z, 'roccia', true);
        }
      }
      // la vasca in cima
      for (let x = 24; x <= 27; x++) {
        for (let z = 19; z <= 26; z++) m.metti(ox + x, SUOLO + 5, oz + z, 'acqua', true);
      }
      // lo scarico: due celle che scorrono verso il vuoto
      for (let z = 21; z <= 22; z++) {
        m.metti(ox + 23, SUOLO + 5, oz + z, 'acqua~1', true);
        m.metti(ox + 22, SUOLO + 5, oz + z, 'acqua~2', true);
      }
      // ⚠ LA COLONNA CHE CADE È FATTA DI CELLE IMPILATE, e il tipo «cascata» lo
      // decide il mesher da «ho acqua sopra di me» (`mioSopra`): una parete
      // isolata non basta, servono celle una sull'altra. La cima invece NON ha
      // acqua sopra, quindi tiene il suo pelo — ed è quello il labbro da cui
      // l'acqua scavalca.
      for (let z = 21; z <= 22; z++) {
        for (let y = SUOLO + 1; y <= SUOLO + 5; y++) m.metti(ox + 21, y, oz + z, 'acqua~1', true);
      }
      // la pozza in cui picchia
      vasca(16, 19, 5, 7, SUOLO - 2);
    },
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

/**
 * Dove sta il centro di una piazzola, in coordinate di mondo.
 * ⚠ SI RICAVA DALL'INGOMBRO, non da un 15 scritto a mano: il corridoio della
 * distanza è profondo 202, e con la metà del PASSO la camera si fermava sui
 * primi tre pilastri — cioè proprio dove non c'è niente da vedere.
 */
export function centroDi(p) {
  const g = ingombroDi(p);
  return { x: (g.x0 + g.x1) / 2, y: SUOLO + 1, z: (g.z0 + g.z1) / 2 };
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

// L'ACQUARIO — le vasche di prova dell'acqua, una per caso.
//
// ⚠ PERCHÉ UN BANCO A PARTE E NON LA PIAZZOLA DELLO ZOO. Nello zoo l'acqua ha
// una piazzola sola, e ci deve stare: lo zoo serve a trovare UN difetto per
// volta in tutto il gioco. Ma scegliere lo STILE dell'acqua è un'altra cosa —
// vuol dire guardare la stessa decisione su sette superfici diverse, cambiarla,
// e riguardarle tutte. Con una piazzola sola si finisce per giudicare uno stile
// sullo specchio grande e scoprire dopo che sul canale stretto è illeggibile.
//
// ⚠ E NON SA CHE ESISTE UN MOTORE, come tutto `src/world/`: qui si posano
// blocchi e basta. Chi disegna sta altrove, e questo file si prova in Node.

/** La quota del pavimento. Tondo, così i conti si fanno a mente. */
export const SUOLO = 8;

/**
 * Quanto distano i centri delle vasche.
 *
 * ⚠ TRENTAQUATTRO E NON VENTIQUATTRO: le vasche sono larghe 24, e con un margine
 * di zero due specchi confinanti si toccano. Due specchi che si toccano non sono
 * più due casi — sono un caso solo, più grande, e la prova del canale stretto
 * (che vive proprio sul fatto di essere stretto) smetterebbe di dire la verità.
 */
export const PASSO = 34;
export const LARG = 24, PROF = 24;

export function ingombroDi(v) {
  return { x0: v.x * PASSO, z0: v.z * PASSO, x1: v.x * PASSO + LARG, z1: v.z * PASSO + PROF };
}

export function centroDi(v) {
  const g = ingombroDi(v);
  return { x: (g.x0 + g.x1) / 2, y: SUOLO + 1, z: (g.z0 + g.z1) / 2 };
}

/** Il lastrone su cui si scava: spesso, o il fondo delle vasche sarebbe il vuoto. */
function terreno(m, ox, oz, cima = 'erba') {
  for (let x = 0; x < LARG; x++) {
    for (let z = 0; z < PROF; z++) {
      for (let y = SUOLO - 4; y < SUOLO; y++) m.metti(ox + x, y, oz + z, 'terra', true);
      m.metti(ox + x, SUOLO, oz + z, cima, true);
    }
  }
}

/**
 * Una vasca scavata e riempita di SORGENTI fino a filo del suolo, con l'orlo di
 * un'altra materia.
 * ⚠ L'ORLO NON È DECORAZIONE: il bianco della schiuma su un verde saturo si
 * legge male, e metà delle scelte di stile si giocano proprio sul bordo.
 */
function vasca(m, ox, oz, x0, z0, larg, prof, fondo, orlo = 'sabbia') {
  for (let x = 0; x < larg; x++) {
    for (let z = 0; z < prof; z++) {
      for (let y = fondo; y <= SUOLO; y++) m.metti(ox + x0 + x, y, oz + z0 + z, 'acqua', true);
    }
  }
  if (!orlo) return;
  for (let x = -1; x <= larg; x++) {
    for (let z = -1; z <= prof; z++) {
      if (x >= 0 && x < larg && z >= 0 && z < prof) continue;
      m.metti(ox + x0 + x, SUOLO, oz + z0 + z, orlo, true);
    }
  }
}

/**
 * LE VASCHE, in tabella — regola della casa: chi aggiunge un caso aggiunge una
 * riga. `nota` è quello che si legge a schermo, e dice COSA GUARDARE: un banco
 * che non lo dice diventa una galleria di immagini carine.
 */
export const VASCHE = [
  {
    id: 'specchio',
    nome: 'Specchio aperto',
    x: 0, z: 0,
    rettAcqua: { x0: 4, z0: 4, x1: 19, z1: 19 },
    nota: 'Quattordici celle di acqua libera. È il caso in cui uno stile si vede '
        + 'per quello che è: qui c\'è spazio per il disegno del pelo, per la fascia '
        + 'di bassofondo lungo la riva e per la strada del sole. Se uno stile è '
        + 'bello solo qui, non è ancora uno stile.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      vasca(m, ox, oz, 4, 4, 15, 15, SUOLO - 3);
    },
  },
  {
    id: 'spiaggia',
    nome: 'Spiaggia digradante',
    x: 1, z: 0,
    rettAcqua: { x0: 3, z0: 3, x1: 21, z1: 21 },
    nota: 'Il fondo sale a gradini verso riva. ⚠ Il nostro «bassofondo» NON è la '
        + 'profondità vera: è la distanza dalla sponda in pianta, che il mesher '
        + 'conta gratis. Qui si vede se quella bugia regge — la fascia chiara deve '
        + 'stare dove l\'occhio si aspetta il fondale, non dove capita.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz, 'sabbia');
      // il letto sale di un blocco ogni tre celle andando verso +z
      for (let x = 0; x < 18; x++) {
        for (let z = 0; z < 18; z++) {
          const fondo = SUOLO - 3 + Math.floor(z / 5);
          for (let y = fondo; y <= SUOLO; y++) m.metti(ox + 3 + x, y, oz + 3 + z, 'acqua', true);
        }
      }
    },
  },
  {
    id: 'canali',
    nome: 'Canali: uno, due, tre',
    x: 2, z: 0,
    rettAcqua: { x0: 4, z0: 3, x1: 18, z1: 21 },
    nota: 'Larghi UNA, DUE e TRE celle. ⚠ È il caso che rompe ogni soglia: in un '
        + 'canale largo uno tutti e quattro gli angoli toccano una sponda, quindi '
        + 'la distanza dalla riva vale zero dappertutto e una soglia generosa lo '
        + 'dipinge di bianco pieno. Se il primo canale è un nastro bianco, lo '
        + 'stile sta guardando la distanza e non l\'apertura dello specchio.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      vasca(m, ox, oz, 4, 3, 1, 18, SUOLO - 1);
      vasca(m, ox, oz, 9, 3, 2, 18, SUOLO - 1);
      vasca(m, ox, oz, 15, 3, 3, 18, SUOLO - 1);
    },
  },
  {
    id: 'pozze',
    nome: 'Pozzanghere minime',
    x: 3, z: 0,
    rettAcqua: { x0: 4, z0: 4, x1: 19, z1: 18 },
    nota: 'Una cella, due per due, tre per tre, quattro per quattro. Il limite '
        + 'inferiore: sotto una certa misura non c\'è più «largo», e ogni disegno '
        + 'del pelo o sparisce o riempie tutto. Serve a sapere DOVE smette di '
        + 'funzionare, che è un\'informazione, non un difetto.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      vasca(m, ox, oz, 4, 4, 1, 1, SUOLO - 1);
      vasca(m, ox, oz, 9, 4, 2, 2, SUOLO - 1);
      vasca(m, ox, oz, 14, 4, 3, 3, SUOLO - 1);
      vasca(m, ox, oz, 5, 12, 4, 4, SUOLO - 2);
      vasca(m, ox, oz, 13, 12, 6, 6, SUOLO - 2);
    },
  },
  {
    id: 'ruscello',
    nome: 'Ruscello che scorre',
    x: 0, z: 1,
    nota: 'Cinque gradini in rilievo, con i livelli che crescono verso valle: è '
        + 'da quel gradiente che il mesher ricava la CORRENTE. Il disegno deve '
        + 'scorrere giù per la scala, non di traverso — se va di traverso, il '
        + 'verso dello scorrimento è sbagliato di segno.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      // ⚠ IN RILIEVO, NON SCAVATO: una trincea nasconde l'acqua dietro le sponde
      // da qualunque angolo, e un banco che nasconde quello che deve mostrare
      // non serve a niente. Qui la scala sale dal prato e l'acqua sta in cima.
      for (let g = 0; g < 5; g++) {
        const y = SUOLO + 4 - g;
        for (let p = 0; p < 3; p++) {
          const x = 3 + g * 3 + p;
          for (let z = 0; z < 4; z++) {
            for (let yy = SUOLO + 1; yy <= y; yy++) m.metti(ox + x, yy, oz + 9 + z, 'roccia', true);
            m.metti(ox + x, y, oz + 9 + z, p === 0 ? 'acqua' : 'acqua~' + p, true);
          }
          m.metti(ox + x, y, oz + 8, 'roccia', true);
          m.metti(ox + x, y, oz + 13, 'roccia', true);
        }
      }
    },
  },
  {
    id: 'cascata',
    nome: 'Cascata alta',
    x: 1, z: 1,
    rettAcqua: { x0: 16, z0: 19, x1: 21, z1: 26 },
    nota: 'Una colonna che cade sei blocchi in una pozza. Le striature devono '
        + 'essere VERTICALI e CONTINUE: se sono a puntini la cascata sembra '
        + 'ferma, se sono orizzontali le coordinate della parete sono scambiate, '
        + 'e se ci sono righe bianche a ogni cella è tornato il muro di mattoni.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      for (let x = 10; x < 22; x++) {
        for (let z = 3; z < 21; z++) {
          for (let y = SUOLO + 1; y <= SUOLO + 6; y++) m.metti(ox + x, y, oz + z, 'roccia', true);
        }
      }
      for (let x = 12; x < 20; x++) {
        for (let z = 5; z < 19; z++) m.metti(ox + x, SUOLO + 6, oz + z, 'acqua', true);
      }
      for (let z = 10; z <= 12; z++) {
        m.metti(ox + 11, SUOLO + 6, oz + z, 'acqua~1', true);
        m.metti(ox + 10, SUOLO + 6, oz + z, 'acqua~2', true);
        // ⚠ LA COLONNA È FATTA DI CELLE IMPILATE: il tipo «parete di cascata» lo
        // decide il mesher da «ho acqua sopra di me», non da una faccia isolata.
        for (let y = SUOLO + 1; y <= SUOLO + 6; y++) m.metti(ox + 9, y, oz + z, 'acqua~1', true);
      }
      vasca(m, ox, oz, 3, 7, 6, 9, SUOLO - 2, 'roccia');
    },
  },
  {
    id: 'sponde',
    nome: 'Sponde di materie diverse',
    x: 2, z: 1,
    rettAcqua: { x0: 3, z0: 3, x1: 21, z1: 21 },
    nota: 'La stessa pozza con l\'orlo di erba, sabbia, pietra e legno. La '
        + 'schiuma è bianca contro tutti e quattro, e su un verde saturo un '
        + 'bianco si stacca molto più che su una sabbia. Serve a scegliere '
        + 'quanto deve essere bianca — non a guardare l\'acqua.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      vasca(m, ox, oz, 3, 3, 7, 7, SUOLO - 2, 'erba');
      vasca(m, ox, oz, 14, 3, 7, 7, SUOLO - 2, 'sabbia');
      vasca(m, ox, oz, 3, 14, 7, 7, SUOLO - 2, 'pietra');
      vasca(m, ox, oz, 14, 14, 7, 7, SUOLO - 2, 'legno');
    },
  },
  {
    id: 'isola',
    nome: 'Scogli in mezzo',
    x: 3, z: 1,
    rettAcqua: { x0: 3, z0: 3, x1: 21, z1: 21 },
    nota: 'Uno specchio con dentro degli scogli di misure diverse. È il caso '
        + 'della seconda immagine di riferimento: quello che si guarda è il '
        + 'NASTRO di schiuma che abbraccia ogni scoglio, se resta della stessa '
        + 'larghezza attorno a uno grande e a uno da una cella sola.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      vasca(m, ox, oz, 3, 3, 18, 18, SUOLO - 3);
      const scoglio = (x0, z0, lato, alto) => {
        for (let x = 0; x < lato; x++) {
          for (let z = 0; z < lato; z++) {
            for (let y = SUOLO - 3; y <= SUOLO + alto; y++) m.metti(ox + x0 + x, y, oz + z0 + z, 'roccia', true);
          }
        }
      };
      scoglio(6, 6, 3, 1);
      scoglio(13, 5, 1, 0);
      scoglio(15, 12, 2, 2);
      scoglio(6, 15, 1, 0);
      scoglio(9, 11, 1, 1);
    },
  },
  {
    id: 'salti',
    nome: 'Salti da 1 a 8 blocchi',
    x: 0, z: 2,
    nota: 'Sei cascate affiancate — 1, 2, 3, 4, 6 e 8 blocchi — che cadono nella '
        + 'STESSA pozza, con la stessa luce e la stessa ricetta. È il banco per '
        + 'l\'effetto che cambia con l\'altezza: da 3 in su deve comparire la '
        + 'schiuma al piede, da 6 in su il velo e gli spruzzi. Le prime due '
        + 'devono restare lame pulite: se schiumano anche loro, le soglie sono '
        + 'sbagliate. E guardando le sei insieme si vede se il disegno CRESCE '
        + 'con la caduta o se è lo stesso muro stirato.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      // la pozza d'arrivo, comune a tutte e sei: la stessa acqua sotto sei
      // cascate diverse è metà del confronto
      vasca(m, ox, oz, 0, 2, LARG, 11, SUOLO - 2, null);
      const ALTEZZE = [1, 2, 3, 4, 6, 8];
      for (let i = 0; i < ALTEZZE.length; i++) {
        const alta = ALTEZZE[i], x0 = 1 + i * 4;
        // il pilastro arriva a UNA cella sotto il pelo: l'acqua di cima sta
        // dentro la sua cella, e il ciglio è il suo bordo
        for (let x = x0 - 1; x <= x0 + 2; x++) {
          for (let z = 14; z < 22; z++) {
            for (let y = SUOLO + 1; y < SUOLO + alta; y++) m.metti(ox + x, y, oz + z, 'roccia', true);
          }
        }
        // le sponde del serbatoio, o l'acqua scappa di lato invece di scavalcare
        for (let z = 14; z < 22; z++) {
          m.metti(ox + x0 - 1, SUOLO + alta, oz + z, 'roccia', true);
          m.metti(ox + x0 + 2, SUOLO + alta, oz + z, 'roccia', true);
        }
        for (let x = x0; x <= x0 + 1; x++) {
          m.metti(ox + x, SUOLO + alta, oz + 21, 'roccia', true);
          for (let z = 15; z < 21; z++) m.metti(ox + x, SUOLO + alta, oz + z, 'acqua', true);
          // il ciglio: livello 1, così il mesher ci trova il gradiente e ne fa
          // una faccia in pendenza invece di un taglio netto
          m.metti(ox + x, SUOLO + alta, oz + 14, 'acqua~1', true);
          // ⚠ E LA COLONNA È FATTA DI CELLE IMPILATE: «parete di cascata» lo
          // decide il mesher da «ho acqua sopra di me».
          for (let y = SUOLO + 1; y <= SUOLO + alta; y++) m.metti(ox + x, y, oz + 13, 'acqua~1', true);
        }
      }
    },
  },
  {
    id: 'livelli',
    nome: 'Sorgente e livelli',
    x: 1, z: 2,
    nota: 'UNA sorgente su una piattaforma piana, e l\'acqua che si allarga a '
        + 'raggiera assottigliandosi: livello 0 al centro, poi 1, 2, 3, 4 — il '
        + 'rivolo più sottile, che si ferma da solo. Tutte le celle stanno alla '
        + 'STESSA quota: quello che scende è il PELO, di un ottavo di blocco per '
        + 'livello, e dal centro al bordo fa mezzo blocco. Si deve vedere una '
        + 'cupola bassa, non una lastra. È anche il banco della CORRENTE, che '
        + 'qui è radiale: il disegno deve allontanarsi dal centro in ogni '
        + 'direzione. E sul lato basso il rivolo trabocca e scende tre gradini: '
        + 'è il passaggio da livelli a caduta, cioè dove il mesher cambia il '
        + 'tipo di faccia sotto i piedi del disegno.',
    costruisci(m, ox, oz) {
      terreno(m, ox, oz);
      const cx = 11, cz = 10, RAGGIO = 8;
      // ⚠ LA PIATTAFORMA È PIANA E RIALZATA: piana perché il dislivello del
      // terreno seppellirebbe la differenza fra i livelli (mezzo blocco in
      // tutto), rialzata perché il pelo di un rivolo si legge di taglio, e da
      // terra non si vedrebbe.
      // ⚠ L'ACQUA STA SOPRA LA PIATTAFORMA, NON DENTRO UNA CONCA: riempendo la
      // roccia fino alla quota dell'acqua il rivolo finisce in un buco, e un
      // buco pieno d'acqua è una pozza — cioè l'esatto contrario di quello che
      // questa vasca deve mostrare. Il pelo di un rivolo si legge perché è
      // APPOGGIATO su un piano e degrada verso il bordo.
      for (let x = cx - RAGGIO - 2; x <= cx + RAGGIO + 2; x++) {
        for (let z = cz - RAGGIO - 2; z <= cz + RAGGIO + 2; z++) {
          for (let y = SUOLO + 1; y <= SUOLO + 2; y++) m.metti(ox + x, y, oz + z, 'roccia', true);
        }
      }
      // la raggiera: due celle per livello, così il rombo è largo abbastanza da
      // vedersi. La distanza è di Manhattan perché l'acqua dei giochi a griglia
      // si propaga per lati, non in cerchio — e il rombo che ne esce è il
      // disegno vero di una sorgente su un piano.
      for (let x = cx - RAGGIO; x <= cx + RAGGIO; x++) {
        for (let z = cz - RAGGIO; z <= cz + RAGGIO; z++) {
          const d = Math.abs(x - cx) + Math.abs(z - cz);
          if (d > RAGGIO) continue;
          const liv = Math.ceil(d / 2);
          m.metti(ox + x, SUOLO + 3, oz + z, liv === 0 ? 'acqua' : 'acqua~' + liv, true);
        }
      }
      // e il troppopieno: il rivolo esce dal rombo, arriva al ciglio della
      // piattaforma e da lì cade — è il passaggio da livello a caduta
      for (let x = cx - 1; x <= cx + 1; x++) {
        for (let z = cz + RAGGIO + 1; z <= cz + RAGGIO + 2; z++) {
          m.metti(ox + x, SUOLO + 3, oz + z, 'acqua~4', true);
        }
        for (let y = SUOLO + 1; y <= SUOLO + 3; y++) {
          m.metti(ox + x, y, oz + cz + RAGGIO + 3, 'acqua~1', true);
        }
      }
      // la pozzetta dove finisce, scavata nel prato
      vasca(m, ox, oz, cx - 3, cz + RAGGIO + 3, 6, 3, SUOLO - 2, 'pietra');
    },
  },
];

/**
 * ⚠ `rettAcqua` È IL RETTANGOLO DELL'ACQUA, NON DELLA PIAZZOLA, e la
 * distinzione è già costata un difetto: la risacca sul terreno mascherata con
 * l'ingombro della piazzola bagnava TUTTA la sua erba (che sta alla stessa
 * quota della banda), a pois. La sabbia bagnata vive attorno all'ACQUA. Le
 * coordinate sono di piazzola; chi le usa le traduce in mondo. Il ruscello non
 * ce l'ha: il suo pelo sta su cinque quote diverse, e una risacca a livello
 * unico lì mentirebbe.
 */

/** Costruisce l'acquario intero. ⚠ Svuota il mondo prima: un banco mezzo
 *  sovrapposto a un altro mondo non isola niente. */
export function generaAcquario(mondo) {
  mondo.svuota();
  for (const v of VASCHE) v.costruisci(mondo, v.x * PASSO, v.z * PASSO);
  return VASCHE;
}

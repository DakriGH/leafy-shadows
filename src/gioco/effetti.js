// LE RISPOSTE — quello che una cosa fa vedere quando la si tocca, la si posa o
// la si sta rompendo.
//
// ⚠ TUTTE E TRE SONO SOLO GRAFICA: il mondo non cambia di un bit. E tutte e tre
// sono CURVE NEL TEMPO, cioè la famiglia di cose che a occhio non si giudicano —
// durano due decimi di secondo. Qui si scrivono come funzioni pure e si provano
// in Node; chi le applica a una mesh è la regia.
//
// ⚠ È SOLO GRAFICA, e questo è il punto: il mondo non cambia di un bit.
// Committente: «se clicco tasto destro su un qualsiasi elemento solo
// graficamente deve leggermente ingrandirsi e poi tornare in posizione, solo
// graficamente mi raccomando. Anche se l'oggetto non cambia stato deve sentirsi
// questa interazione».
//
// ⚠ E SERVE DAVVERO, non è un vezzo. Fino a ora cliccare una cosa che non fa
// niente non dava NESSUN segnale: non si capiva se il clic fosse arrivato, se
// si stesse mirando al blocco giusto, o se il gioco fosse rimasto indietro. Un
// gesto senza risposta si legge come «rotto», anche quando è solo «niente da
// fare qui».
//
// ⚠ NON SA CHE ESISTE UN MOTORE: dà un NUMERO — quanto è grande adesso — e chi
// lo applica a una mesh o a una matrice è affare della regia. Così si prova in
// Node, che per una curva nel tempo è l'unico modo di provarla davvero.

/** Quanto dura, in millisecondi. Corto: è una risposta, non un'animazione. */
export const DURATA = 220;

/**
 * Quanto si gonfia al massimo. ⚠ POCO — diciotto per cento. Committente:
 * «leggermente». Un blocco che raddoppia sembra un difetto; uno che respira
 * appena si sente e non si guarda.
 */
export const GONFIO = 0.18;

/**
 * LA SCALA A UN CERTO ISTANTE: 1 → 1,18 → 1.
 *
 * ⚠ SENO AL QUADRATO, E NON UN SENO — e la differenza l'ha trovata una prova,
 * non il mio occhio. Avevo scritto `sin(πu)` col commento «parte e finisce con
 * derivata nulla»: FALSO. La derivata di un seno è un coseno, che a zero vale
 * UNO — il seno parte alla massima pendenza possibile, cioè con uno scatto,
 * esattamente il difetto che credevo di stare evitando.
 * `sin²(πu)` invece è `(1 − cos 2πu)/2`: derivata nulla a tutti e due i capi,
 * stesso massimo a metà. La cosa respira invece di sobbalzare.
 *
 * ⚠ E FUORI DALLA FINESTRA VALE ESATTAMENTE 1, non «circa 1»: chi lo applica
 * confronta con 1 per decidere se c'è ancora qualcosa da disegnare, e un
 * 0,99999 lascerebbe l'animazione accesa per sempre.
 */
export function scalaColpetto(trascorso, durata = DURATA) {
  if (!(trascorso > 0) || trascorso >= durata) return 1;
  const s = Math.sin(Math.PI * (trascorso / durata));
  return 1 + GONFIO * s * s;
}

/** È ancora in corso? */
export function inCorso(trascorso, durata = DURATA) {
  return trascorso > 0 && trascorso < durata;
}

/** Quanto dura l'atterraggio di un blocco appena posato. */
export const DURATA_POSA = 190;
/** Da quanto sopra la sua misura arriva. Più di così sembra caduto dal cielo. */
const PARTENZA_POSA = 1.30;

/**
 * LA POSA: un blocco appena messo ATTERRA, non compare.
 *
 * ⚠ SCENDE DA SOPRA L'UNO INVECE DI CRESCERE DA ZERO, e non è una scelta di
 * gusto: è l'unica che si vede. Chi disegna l'animazione è una COPIA del blocco
 * («il fantasma»), e il blocco vero è già lì — una copia più piccola dell'uno
 * finisce DENTRO al blocco e non la vede nessuno. Sopra l'uno la copia sporge, e
 * quello che si vede è il blocco che rientra nella sua misura: un atterraggio.
 *
 * ⚠ E IL BLOCCO VERO SI POSA SUBITO, non alla fine dell'animazione. Rimandarlo
 * di due decimi darebbe la pop-in «cresce dal niente», che è più bella; ma
 * sposterebbe anche lo scatto della ricostruzione del chunk a due decimi DOPO il
 * clic, cioè lo staccherebbe dal gesto. Uno scatto sul clic si legge come peso,
 * uno scatto dopo si legge come inceppo.
 */
export function scalaPosa(trascorso, durata = DURATA_POSA) {
  if (!(trascorso > 0)) return PARTENZA_POSA;
  if (trascorso >= durata) return 1;
  const u = trascorso / durata;
  // parte veloce e si assesta: la fine piano è quella che si legge come «peso»
  const e = 1 - Math.pow(1 - u, 3);
  return PARTENZA_POSA + (1 - PARTENZA_POSA) * e;
}

/**
 * IL DANNO: quanto si GONFIA un blocco che si sta rompendo.
 *
 * ⚠ GONFIA, NON SI CREPA, per due ragioni. Le crepe sono una TEXTURE, e in Leafy
 * i blocchi non ne hanno — il colore è piatto e viene dalla palette. E il
 * disegno lo fa il fantasma, che sotto l'uno sparisce dentro il blocco vero.
 * Una cosa che si gonfia e trema prima di scoppiare è un linguaggio che si legge
 * senza spiegazioni.
 *
 * ⚠ PARTE APPENA SOPRA L'UNO E NON DA UNO: a uno esatto il fantasma coinciderebbe
 * col blocco e le due superfici si contenderebbero i pixel (z-fighting), che a
 * schermo è uno sfarfallio — cioè un difetto, non un effetto.
 */
export function scalaDanno(progresso) {
  const p = Math.max(0, Math.min(1, progresso));
  return 1.02 + 0.10 * p;
}

/**
 * E QUANTO TREMA. ⚠ IL TREMOLIO CRESCE COL DANNO, quindi dice DA SOLO quanto
 * manca — senza una barra della salute, che in un diorama sarebbe l'unico pezzo
 * di interfaccia dentro il mondo.
 */
export function tremolio(progresso, t) {
  const p = Math.max(0, Math.min(1, progresso));
  const a = 0.035 * p;
  return { x: Math.sin(t * 0.09) * a, y: Math.sin(t * 0.13 + 1.7) * a, z: Math.sin(t * 0.11 + 3.1) * a };
}

// IL COLPETTO — la risposta che una cosa dà quando la si tocca.
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

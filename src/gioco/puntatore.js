// IL PUNTATORE — distinguere un CLIC da un TRASCINAMENTO.
//
// ⚠ È IL DIFETTO CHE IL COMMITTENTE HA VISTO: «hai usato il tasto sinistro e
// destro per piazzare, ma è anche il modo che uso per muovere la telecamera».
// Vero, e la colpa era di un `pointerdown` che agiva subito: qualunque
// rotazione della camera rompeva anche un blocco, sotto il punto in cui il dito
// (o il mouse) era partito.
//
// ⚠ E LA CURA NON È CAMBIARE TASTO. Su un telefono un «tasto destro» non
// esiste: spostare l'azione altrove sposta il problema. La cura è che un clic è
// un clic solo se il puntatore **non si è spostato** e **non è rimasto giù
// troppo**. È quello che fa qualunque mappa e qualunque gioco a blocchi sul
// web, e sotto quelle due soglie non c'è nessun caso ambiguo.
//
// ⚠ NON SA CHE ESISTE UN MOTORE — parla di eventi del puntatore, che sono del
// browser, non di Babylon. Chi ci fa qualcosa è la regia.

/** Quanti pixel di spostamento bastano a dire «stavo trascinando». */
export const SCARTO = 6;
/** E quanti millisecondi. ⚠ Serve anche questo: un dito che resta fermo un
 *  secondo e mezzo su un telefono non sta cliccando, sta esitando — o sta per
 *  cominciare a ruotare. Mezzo secondo è la soglia classica. */
export const DURATA = 500;

/**
 * Chiama `onClic(evento)` solo per i clic veri.
 *
 * ⚠ SI ASCOLTA `pointerup`, NON `click`: l'evento `click` del browser non arriva
 * col tasto destro, e su alcuni browser nemmeno quando in mezzo c'è stato un
 * trascinamento catturato da qualcun altro — cioè proprio il nostro caso, dato
 * che la camera cattura il puntatore.
 *
 * @param bersaglio  l'elemento su cui ascoltare (la tela)
 * @param onClic     (evento) → void, solo per i clic
 */
export function ascoltaClic(bersaglio, onClic) {
  // ⚠ UNO STATO PER PULSANTE: su un mouse si può tenere giù il destro mentre si
  // preme il sinistro. Con un solo stato il secondo clic eredita il punto di
  // partenza del primo e diventa un «trascinamento» che non c'è mai stato.
  const giu = new Map();

  bersaglio.addEventListener('pointerdown', (e) => {
    giu.set(e.pointerId + ':' + e.button, { x: e.clientX, y: e.clientY, t: performance.now() });
  });

  const finito = (e) => {
    const k = e.pointerId + ':' + e.button;
    const s = giu.get(k);
    if (!s) return;
    giu.delete(k);
    const dist = Math.hypot(e.clientX - s.x, e.clientY - s.y);
    if (dist <= SCARTO && performance.now() - s.t <= DURATA) onClic(e);
  };
  bersaglio.addEventListener('pointerup', finito);
  // ⚠ E «pointercancel» VA PULITO, se no lo stato resta: su un telefono il
  // browser annulla il puntatore quando parte uno scorrimento o una gesture di
  // sistema, e senza questa riga il prossimo `pointerup` troverebbe uno stato
  // vecchio e lo scambierebbe per un clic.
  bersaglio.addEventListener('pointercancel', (e) => {
    for (const k of [...giu.keys()]) if (k.startsWith(e.pointerId + ':')) giu.delete(k);
  });
}

// IL CANALE — dove va a finire un rapporto di diagnostica.
//
// ⚠ RIFATTO IL 10/09/2026, E LA REGOLA DI PRIMA È STATA ROVESCIATA DAL
// COMMITTENTE: «la pages l'abbiamo noi, sistemiamo il sistema in modo che ti
// arrivi tutto; distruggi e pulisci il vecchio se preferisci farlo nuovo e
// comodo». Quindi: NIENTE PASSWORD, niente impronte, niente da digitare. Un
// tocco, e il rapporto parte.
//
// COS'ERA E PERCHÉ NON ANDAVA. L'argomento su ntfy si ricavava da una password
// digitata sul dispositivo (`sha256('leafy-shadows/' + password)`), così nel
// sorgente non c'era scritto niente. Sulla carta è la cosa giusta; nella pratica
// ha fatto esattamente il danno che doveva evitare:
//  · la password si digita UNA VOLTA per dispositivo e finisce nel
//    `localStorage`. Se su un coso ne è finita una diversa — un refuso, una
//    maiuscola della tastiera, una prova di mesi fa — i rapporti da lì vanno su
//    un ALTRO argomento, e nessuno se ne accorge: il gioco dice «mandato ✔»
//    (vero) e il lettore dice «nessun rapporto» (vero). È successo davvero, con
//    il Chromebook, ed è il difetto più subdolo di tutta la faccenda: era
//    persino scritto in CLAUDE.md come rischio, e si è avverato.
//  · e per ripararlo bisognava sapere quale password c'era su quel dispositivo,
//    cioè indovinare.
//
// ⚠ IL PREZZO, DETTO UNA VOLTA E POI BASTA: l'argomento adesso è scritto qui
// sotto in chiaro, e su ntfy.sh un argomento è PUBBLICO — chi legge questo file
// può leggere i nostri rapporti e scriverci dentro. È una scelta, non una
// dimenticanza. Quello che ci passa è roba tecnica (scheda video, fotogrammi,
// uno scatto del gioco) e c'è una prova che lo pretende (`test/rapporto.test.mjs`).
// Se un giorno ci dovesse passare qualcosa che vale di più, questo canale NON è
// il posto: ci vuole un endpoint nostro, non un servizio di messaggi pubblico.
//
// ⚠ E CONTRO IL RUMORE C'È LA FIRMA, non un segreto: chi legge scarta tutto
// quello che non è un rapporto nostro. Non protegge dalla lettura — niente lo
// fa, su un argomento pubblico — protegge dal fatto che uno scherzo riempia
// l'elenco e nasconda il rapporto vero.

/** Il servizio: niente account, niente da installare, niente da tenere acceso. */
export const SERVIZIO = 'https://ntfy.sh';

/**
 * L'ARGOMENTO, fisso e per sempre.
 *
 * ⚠ NON SI CAMBIA a cuor leggero: i dispositivi non hanno più niente da
 * ricordare, quindi cambiarlo qui vuol dire che ogni pagina già aperta in giro
 * continua a mandare sul vecchio finché non si ricarica.
 */
export const ARGOMENTO = 'leafy-shadows-ebdbbfaf5376beedb3';

/** La firma che marca un rapporto come NOSTRO. Chi legge scarta il resto. */
export const FIRMA = 'leafy-shadows/1';

/** Oltre questa misura ntfy trasforma il corpo in un ALLEGATO: dura 3 ore invece di 12. */
export const SOGLIA_ALLEGATO = 4096;

/**
 * MANDA. Ritorna cosa è successo, in italiano, perché quello che l'utente legge
 * è questa frase.
 */
export async function manda(testo) {
  const r = await fetch(`${SERVIZIO}/${ARGOMENTO}`, {
    method: 'POST',
    // ⚠ NIENTE «content-type: application/json». ntfy con quel tipo prova a
    // interpretare il corpo come una SUA busta (con campi «topic», «message»,
    // «title»…) e il nostro rapporto verrebbe rifiutato o svuotato. Il corpo
    // grezzo è il messaggio, ed è quello che vogliamo.
    headers: {
      'x-title': 'Leafy-Shadows',
      // ⚠ E IL NOME DELL'ALLEGATO LO DECIDIAMO NOI: se no, sopra i 4 KB ntfy lo
      // chiama «attachment.txt» e un elenco di rapporti diventa illeggibile.
      'x-filename': 'rapporto.json',
    },
    body: testo,
  });
  if (!r.ok) return { ok: false, dice: `il servizio ha detto no: ${r.status}` };
  const d = await r.json().catch(() => ({}));
  const grosso = testo.length > SOGLIA_ALLEGATO;
  return {
    ok: true,
    id: d.id || '',
    dice: grosso
      ? `mandato ✔ (${Math.round(testo.length / 1024)} KB, come allegato: dura 3 ore)`
      : `mandato ✔ (${Math.round(testo.length / 1024)} KB, dura 12 ore)`,
  };
}

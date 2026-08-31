// IL CANALE — dove va a finire un rapporto di diagnostica.
//
// ⚠ Committente: «devo poter fare la diagnosi da qualsiasi dispositivo fuori
// dalla rete, metto la password e ti arriva da qualche parte in cloud», e
// «voglio una cosa leggerissima, alla fine è un messaggio». Quindi: un servizio
// di messaggi pubblico (ntfy.sh), niente account, niente da installare, niente
// da tenere acceso. Il rapporto è letteralmente un messaggio.
//
// ⚠ L'INDIRIZZO SI RICAVA DALLA PASSWORD, e questa è la riga che rende la cosa
// sensata. Su ntfy un «argomento» è pubblico: chi ne conosce il nome può
// leggerlo e scriverci. Se il nome stesse scritto nella pagina, chiunque apra il
// sorgente potrebbe leggere le nostre diagnostiche — e la password nella pagina
// non proteggerebbe niente, perché sarebbe lì accanto.
// Ricavandolo da un'impronta della password, invece, nel sorgente non c'è NULLA:
// l'argomento esiste solo nella testa di chi la password ce l'ha. È lo stesso
// segreto di prima, che però adesso fa anche da indirizzo.
//
// ⚠ E RESTA UN SERVIZIO DI TERZI. I messaggi stanno su ntfy.sh per dodici ore
// (gli allegati per tre), in chiaro. Dentro ci va roba tecnica — scheda video,
// fotogrammi, uno scatto della scena — e nient'altro: vedi «ui/rapporto.js».

import { sha256Esa } from './sha256.js';

export const SERVIZIO = 'https://ntfy.sh';
/** Oltre questa misura ntfy trasforma il corpo in un ALLEGATO. Non è un errore
 *  — si scarica lo stesso — ma dura tre ore invece di dodici. */
export const SOGLIA_ALLEGATO = 4096;

/**
 * L'ARGOMENTO, ricavato dalla password.
 *
 * ⚠ SHA-256, e il browser ce l'ha già — MA SOLO A VOLTE. `crypto.subtle` esiste
 * unicamente nei «contesti sicuri»: https, oppure localhost. Un telefono che
 * apre il gioco su `http://192.168.1.31:8144/` — cioè il modo normale di
 * provarlo in casa — trova `crypto.subtle` UNDEFINED, e senza impronta non c'è
 * indirizzo: il bottone sarebbe morto proprio sul dispositivo per cui esiste.
 * Peggio, l'errore usciva come «niente rete», che manda a cercare dalla parte
 * sbagliata.
 * ⚠ E IL RIPIEGO DEVE DARE LO STESSO IDENTICO NUMERO, non uno diverso ma
 * altrettanto buono: se il telefono calcolasse un nome e il lettore un altro, i
 * rapporti finirebbero in un posto dove nessuno guarda — senza nessun errore.
 * Vedi «ui/sha256.js», e la prova che confronta le tre strade.
 */
export async function argomentoDi(password) {
  const dati = new TextEncoder().encode('leafy-shadows/' + password);
  let esa;
  if (globalThis.crypto && crypto.subtle) {
    const impronta = await crypto.subtle.digest('SHA-256', dati);
    esa = [...new Uint8Array(impronta)].map((b) => b.toString(16).padStart(2, '0')).join('');
  } else {
    esa = sha256Esa(dati);
  }
  // ⚠ VENTIQUATTRO CIFRE BASTANO: sono 96 bit, cioè un nome che non si indovina.
  // Tutte e sessantaquattro sarebbero un indirizzo lunghissimo per niente.
  return 'leafy-' + esa.slice(0, 24);
}

/**
 * MANDA. Ritorna cosa è successo, in italiano, perché quello che arriva
 * all'utente è questa frase.
 */
export async function manda(password, testo) {
  const argomento = await argomentoDi(password);
  const r = await fetch(`${SERVIZIO}/${argomento}`, {
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

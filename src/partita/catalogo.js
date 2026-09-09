// IL CATALOGO DEGLI ASSET — una riga di dati per tipo, non codice sparso.
//
// ⚠ È IL PEZZO CHE MANCAVA SOTTO A TRE COSE INSIEME, ed è la ragione per cui
// nasce adesso e non «quando servirà»:
//
//  · L'OFFICINA non poteva avere un ispettore perché non c'è niente da
//    ispezionare. Un oggetto, oggi, è un blocco in una cella: nessun id,
//    nessun giro, nessuna scala, nessun dato suo. Un pannello che non ha
//    oggetti può solo diventare quello che è diventato — una lista di
//    manopole globali.
//  · I NOVEMILA ASSET (`docs/PIANO-REWORK.md`, R3) chiedono per iscritto «un
//    asset = una riga dati (modello, LOD, impronta, si-istanzia,
//    proietta-ombra, classe di aggiornamento)». Finché quella riga non esiste,
//    ogni tipo nuovo è un `if` in più dentro il ciclo di disegno — ed è già
//    successo: l'alone dei lampioni era un `if (nome === 'lampione')` in
//    `partita.js`, cioè una proprietà del lampione scritta lontano dal lampione.
//  · L'AR è un DIORAMA, cioè una lista di cose posate con la loro posa. Senza
//    un posto dove scrivere quella posa non c'è niente da mettere in un QR.
//
// ⚠ NIENTE DOM, NIENTE GL, NIENTE MOTORE: dati e funzioni pure. Si prova in
// Node come `world/`, ed è così che si provano le sue regole.

/**
 * UNA RIGA DEL CATALOGO
 *
 *   nome            come si chiama a schermo (Officina, cassetta)
 *   modello         il .bin del nucleo da disegnare (`modelli/nucleo/<x>.bin`)
 *   giro            'no' | 'quarti' | 'libero' — come si orienta l'istanza
 *   scala           1, oppure [min, max] per la variazione
 *   proiettaOmbra   entra nella passata d'ombra
 *   classe          'fermo' | 'vicino' | 'medio' — la classe di aggiornamento
 *                   (R3: il costo CPU deve crescere con quello che si VEDE)
 *   ingombro        [x, y, z] in celle: quanto occupa davvero, per la mira
 *   alone           { quota, raggio, colore } se si porta dietro un bagliore
 *
 * ⚠ IL GIRO NON È UN GUSTO, È UNA PROPRIETÀ DEL PEZZO. Un albero e un ciuffo
 * girati a caso stanno bene: sono cose cresciute. Una panchina o un lampione
 * a 37° NO — si leggono come sbagliati, perché sono oggetti costruiti e nel
 * mondo a blocchi seguono gli assi. Per quelli il giro è a QUARTI, che è come
 * li poserebbe una persona.
 */
export const CATALOGO = {
  albero: {
    nome: 'Albero', modello: 'albero',
    giro: 'libero', scala: [0.88, 1.16], proiettaOmbra: true, classe: 'fermo', ingombro: [1, 5, 1],
  },
  lampione: {
    nome: 'Lampione', modello: 'lampione',
    giro: 'quarti', scala: 1, proiettaOmbra: true, classe: 'fermo', ingombro: [1, 4, 1],
    // ⚠ L'ALONE È UNA PROPRIETÀ DEL LAMPIONE, e prima stava scritta in
    // `partita.js` dentro un `if` sul nome. I due cerchi concentrici in aria
    // attorno alla lanterna sono lo STILE (le «fake point light» di Unity) e
    // sono cosa DIVERSA dalla pozza a terra: vanno tutte e due. Toglierli
    // scambiandoli per una terza luce è già costato una sessione.
    alone: { quota: 2.35, raggio: 1.6, colore: [1.0, 0.85, 0.5] },
  },
  lampioneSpento: {
    nome: 'Lampione spento', modello: 'lampioneSpento',
    giro: 'quarti', scala: 1, proiettaOmbra: true, classe: 'fermo', ingombro: [1, 4, 1],
  },
  panchina: {
    nome: 'Panchina', modello: 'panchina',
    giro: 'quarti', scala: 1, proiettaOmbra: true, classe: 'fermo', ingombro: [2, 1, 1],
  },
  ciuffo: {
    nome: 'Ciuffo', modello: 'ciuffo',
    giro: 'libero', scala: [0.82, 1.24], proiettaOmbra: false, classe: 'fermo', ingombro: [1, 1, 1],
  },
};

/** La riga di un tipo, o `null` se non è a catalogo (e allora si disegna com'è). */
export function rigaDi(id) {
  return Object.prototype.hasOwnProperty.call(CATALOGO, id) ? CATALOGO[id] : null;
}

/** Aggiunge (o sostituisce) una riga: gli arredi e i modelli dell'Officina entrano da qui. */
export function registraAsset(id, riga) {
  CATALOGO[id] = { nome: id, giro: 'no', scala: 1, proiettaOmbra: true, classe: 'fermo', ingombro: [1, 1, 1], ...riga, modello: riga.modello || id };
  return CATALOGO[id];
}

// ⚠ L'IMPRONTA SI RICAVA DALLA CELLA, MAI DA `Math.random()`. I chunk entrano
// e escono di continuo con lo streaming: con un numero a caso lo stesso albero
// cambierebbe giro e statura ogni volta che si torna indietro di cento blocchi
// — un bosco che si rimescola alle spalle di chi cammina. Dalla cella, invece,
// la posa è la stessa per sempre e in ogni sessione, e non costa niente
// ricordarla perché non si ricorda: si ricalcola.
function impronta(x, y, z, seme) {
  let h = (Math.imul(x | 0, 374761393) + Math.imul(y | 0, 668265263) + Math.imul(z | 0, 1274126177) + Math.imul(seme | 0, 2246822519)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const QUARTO = Math.PI / 2;

/**
 * I quattro numeri per istanza che il nucleo NON ricava dalla posizione:
 * `[scala, giro]` più la tinta. Torna `[scala, r, g, b, giro]`, cioè la seconda
 * metà degli otto float di `nucleo/modelli.js` (x y z scala | r g b giro) con
 * la scala davanti, perché è lì che sta nel buffer.
 *
 * `varia` a false azzera la variazione e lascia tutto com'era: serve per
 * guardare la stessa scena prima e dopo, che è l'unico modo onesto di dire se
 * una scelta visiva è migliore.
 */
export function posaDi(id, x, y, z, varia = true) {
  const r = rigaDi(id);
  if (!r || !varia) return { scala: 1, tinta: [1, 1, 1], giro: 0 };

  let scala = 1;
  if (Array.isArray(r.scala)) {
    const t = impronta(x, y, z, 1);
    scala = r.scala[0] + t * (r.scala[1] - r.scala[0]);
  } else if (typeof r.scala === 'number') scala = r.scala;

  let giro = 0;
  if (r.giro === 'libero') giro = impronta(x, y, z, 2) * Math.PI * 2;
  else if (r.giro === 'quarti') giro = Math.floor(impronta(x, y, z, 2) * 4) * QUARTO;

  return { scala, tinta: [1, 1, 1], giro };
}

/** Gli otto float di un'istanza posata in una cella: x y z scala | r g b giro. */
export function istanzaDi(id, x, y, z, varia = true) {
  const p = posaDi(id, x, y, z, varia);
  return [x, y, z, p.scala, p.tinta[0], p.tinta[1], p.tinta[2], p.giro];
}

/** I tipi che si portano dietro un alone, con la sua riga. */
export function conAlone() {
  return Object.entries(CATALOGO).filter(([, r]) => r.alone);
}

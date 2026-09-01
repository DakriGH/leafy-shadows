// DOV'È IL PELO DELL'ACQUA CHE SI STA GUARDANDO.
//
// ⚠ NASCE DA UN VERDETTO PRECISO: «il riflesso deve stare a qualsiasi altezza
// dell'acqua, anche se faccio una grotta e ci metto acqua sotto». Un riflesso
// planare specchia rispetto a UN piano, e finora quel piano era una costante —
// prima il valore di comodo del banco (9,5), poi il livello del mare. Va bene
// per il mare, ed è sbagliato per tutto il resto: una pozza sul dirupo, un
// lago in caverna, una vasca sopraelevata riflettono il mondo shiftato.
//
// La tecnica non cambia (un piano per volta, è il suo limite), ma il piano può
// SEGUIRE: si cerca l'acqua più vicina al giocatore e si mette il piano lì.
//
// ⚠ NON NOMINA NESSUN MOTORE: legge la griglia e torna un numero. Si prova in
// Node (`test/pelo.test.mjs`), che è l'unico modo di inchiodare i casi limite
// — nessuna acqua intorno, due specchi a quote diverse, l'acqua sopra la testa.

import { defDi, livelloAcqua } from './blocks.js';

/** La quota del pelo di una cella d'acqua, come la disegna il mesher. */
export function peloDi(y, tipo) {
  const L = livelloAcqua(tipo) || 0;
  return y + (15 - 2 * Math.max(0, L)) / 16;
}

/**
 * IL PELO PIÙ VICINO a (x, y, z), o `null` se non c'è acqua nel raggio.
 *
 * ⚠ SI CERCA IL PELO LIBERO, non l'acqua: una cella d'acqua con altra acqua
 * sopra sta DENTRO il volume, e il suo «pelo» non esiste — mettendoci il piano
 * dello specchio si specchierebbe rispetto a metà lago.
 *
 * ⚠ E LA DISTANZA CHE CONTA È QUELLA VERTICALE, PESATA: fra una pozza a due
 * passi ma venti blocchi più in basso e il mare a venti passi alla mia quota,
 * quello che riempie lo schermo è il secondo. Il peso 2,2 sulla verticale è
 * quello che fa scattare il piano quando si SCENDE in una grotta, senza farlo
 * ballare mentre si cammina in riva al mare.
 *
 * @param passo ogni quante celle si campiona (4 = si guarda un sedicesimo
 *              delle colonne: basta, perché una pozza più piccola di 4 celle
 *              non merita di rubare lo specchio al lago)
 */
export function peloVicino(mondo, x, y, z, { raggio = 40, passo = 4, giu = 30, su = 12 } = {}) {
  const cx = Math.round(x), cy = Math.round(y), cz = Math.round(z);
  let miglior = null, migliorCosto = Infinity;
  for (let dx = -raggio; dx <= raggio; dx += passo) {
    for (let dz = -raggio; dz <= raggio; dz += passo) {
      const px = cx + dx, pz = cz + dz;
      const orizz = dx * dx + dz * dz;
      if (orizz > raggio * raggio) continue;
      // dall'alto verso il basso: la PRIMA acqua con aria sopra è il suo pelo
      for (let py = cy + su; py >= cy - giu; py--) {
        const t = mondo.tipo(px, py, pz);
        if (!t) continue;
        if (!defDi(t).acqua) break;               // un solido: sotto non si guarda
        const sopra = mondo.tipo(px, py + 1, pz);
        if (sopra && defDi(sopra).acqua) continue; // dentro il volume: si scende
        const pelo = peloDi(py, t);
        const dv = pelo - y;
        const costo = orizz + dv * dv * 2.2 * 2.2;
        if (costo < migliorCosto) { migliorCosto = costo; miglior = pelo; }
        break;
      }
    }
  }
  return miglior;
}

/**
 * IL PIANO SI SPOSTA A SCATTI, NON IN CONTINUO.
 *
 * ⚠ Un piano che insegue il pelo con continuità farebbe scivolare l'immagine
 * riflessa mentre si cammina — l'occhio lo legge come «il riflesso slitta»,
 * che è peggio di un riflesso su un piano leggermente sbagliato. E il pelo
 * dell'acqua nel mondo sta comunque su quote DISCRETE: si tiene quella attuale
 * finché non si trova un pelo diverso di almeno mezzo blocco.
 */
export function pianoDaTenere(attuale, trovato, soglia = 0.5) {
  if (trovato === null || trovato === undefined) return attuale;
  if (attuale === null || attuale === undefined) return trovato;
  return Math.abs(trovato - attuale) >= soglia ? trovato : attuale;
}

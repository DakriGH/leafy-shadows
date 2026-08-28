// I LAMPIONI — l'unica cosa del mondo con cui si può INTERAGIRE.
//
// ⚠ NON SONO BLOCCHI, ed è tutto il problema: sono modelli piantati in aria, e
// la griglia sotto di loro è vuota. Il cammino della mira ci passava attraverso
// e finiva sul terreno — cliccarli era impossibile. Ognuno dichiara quindi una
// SCATOLA, e `miraCompleta` (in `mira.js`) confronta le scatole con i blocchi e
// dà il più vicino.
//
// ⚠ NON SA CHE ESISTE UN MOTORE. Tiene lo stato (acceso/spento) e le scatole;
// chi accende la luce vera e chi mostra l'alone è la regia. Così si prova in
// Node, e il giorno che serviranno altre cose interattive — una panchina, una
// porta — questa classe non cambia forma.
//
// ⚠ ED È IL MODELLO DI LANTERN, in piccolo: là un furni ha `stati`, e il
// lampione ne ha due (Spento/Acceso) col secondo che porta la luce. Qui gli
// stati sono due e basta, perché due sono quelli che servono; se un giorno ne
// servissero tre, la forma da copiare è quella.

/** Quanto è alto un lampione, e quanto è largo il suo palo, in blocchi. */
export const ALTEZZA = 3.0;
export const MEZZA_LARGHEZZA = 0.45;

/**
 * ⚠ LA SCATOLA È PIÙ LARGA DEL PALO, di proposito. Il palo vero è un quinto di
 * cella: centrarci sopra un raggio col dito su un telefono è una piccola
 * tortura. Quarantacinque centesimi per lato è ancora dentro la cella — non si
 * ruba il clic al blocco accanto — ed è un bersaglio che si prende.
 */
export class Lampioni {
  constructor() {
    this.elenco = [];
    /** Quando è notte i lampioni si accendono da soli, come in Lantern. */
    this.eNotte = false;
  }

  /**
   * Registra un lampione. `indiceLuce` è la sua lampada in `rig.luci`.
   * ⚠ PARTE SPENTO: chi lo registra deve poi chiamare `applica`, e così lo
   * stato iniziale passa dalla stessa strada di tutti gli altri cambi — se no
   * il primo stato è l'unico che non passa dal controllo.
   */
  aggiungi({ x, y, z, indiceLuce }) {
    const i = this.elenco.length;
    this.elenco.push({
      i, x, y, z, indiceLuce, acceso: false,
      // ⚠ A MANO: chi tocca l'interruttore vince sul ciclo del giorno finché
      // non cambia il giorno. Senza questo, accendere un lampione a mezzogiorno
      // durerebbe fino al prossimo fotogramma.
      aMano: false,
      min: { x: x - MEZZA_LARGHEZZA, y, z: z - MEZZA_LARGHEZZA },
      max: { x: x + MEZZA_LARGHEZZA, y: y + ALTEZZA, z: z + MEZZA_LARGHEZZA },
    });
    return this.elenco[i];
  }

  /** Le scatole da dare a `miraCompleta`. */
  scatole() {
    return this.elenco.map((l) => ({ min: l.min, max: l.max, dato: l }));
  }

  /** Alterna un lampione. Torna il nuovo stato. */
  alterna(l) {
    l.aMano = true;
    l.acceso = !l.acceso;
    return l.acceso;
  }

  /**
   * IL CICLO DEL GIORNO li accende e li spegne.
   * ⚠ E AZZERA IL «a mano», come in Lantern: l'interruttore vale fino al
   * prossimo passaggio giorno/notte, poi il mondo riprende il suo corso. È la
   * scelta semplice, ed è quella che non lascia mezza città accesa a mezzogiorno.
   */
  aggiornaNotte(eNotte) {
    if (eNotte === this.eNotte) return false;
    this.eNotte = eNotte;
    for (const l of this.elenco) { l.aMano = false; l.acceso = eNotte; }
    return true;
  }

  get accesi() { return this.elenco.reduce((n, l) => n + (l.acceso ? 1 : 0), 0); }
}

// IL PASSEGGERO — chi cammina nel mondo.
//
// ⚠ NON SA CHE ESISTE UN MOTORE, e non è un vezzo: la fisica di un personaggio
// che cammina su una griglia di cubi è aritmetica sugli interi, e provarla in
// Node vale più che guardarla. Riceve il mondo e le intenzioni («avanti»,
// «salta»), restituisce una posizione. Chi la disegna, e con quale libreria,
// è affare di un altro file.
//
// ⚠ ED È KINEMATICO, NON RIGID BODY, e per adesso è giusto così. Havok arriva
// alla fase 5 e servirà a veicoli, NPC e galleggiamenti; per un personaggio che
// cammina su blocchi allineati agli assi, un rigid body è più impreciso e più
// caro di questo — si incastra negli spigoli, scivola sulle pendenze, e va
// domato con vincoli. Il giorno che il gatto salirà su una barca, quel giorno
// si cambia; non prima.

/** Quanto è largo e alto il personaggio, in blocchi. */
const MEZZA_LARGHEZZA = 0.30;
const ALTEZZA = 0.90;

/** ⚠ LA GRAVITÀ È IN BLOCCHI AL SECONDO QUADRATO, e non è quella vera: 9,81
 *  su un mondo di cubi da un metro dà un salto da cartone animato, troppo
 *  fiacco. 26 è tarato perché un salto arrivi poco sopra un blocco — che è
 *  l'unità di misura con cui un giocatore legge questo mondo. */
const GRAVITA = 26;
const SPINTA_SALTO = 8.2;
const VELOCITA = 4.6;
/** Quanto si può salire senza saltare: uno scalino di un blocco, come in Leafy. */
const SCALINO = 1.02;

export class Passeggero {
  constructor(mondo, { x = 0.5, y = 10, z = 0.5 } = {}) {
    this.mondo = mondo;
    this.x = x; this.y = y; this.z = z;
    this.vy = 0;
    this.aTerra = false;
    /** L'ultimo verso in cui si è mosso: serve a chi lo disegna per girarlo. */
    this.verso = 0;
    /** ⚠ IL COYOTE TIME. Chi salta un attimo dopo essere uscito dal bordo si
     *  aspetta di saltare lo stesso: senza, un platform sembra rotto anche
     *  quando è corretto. Ottanta millisecondi è la finestra classica. */
    this._coyote = 0;
  }

  /** Un blocco pieno in questa cella? */
  _solido(x, y, z) {
    return this.mondo.solido(Math.floor(x), Math.floor(y), Math.floor(z));
  }

  /**
   * Il CORPO urta qualcosa? Si prova ogni angolo, non solo il centro.
   *
   * ⚠ LE SONDE STANNO DENTRO IL CORPO, MAI SOTTO I PIEDI, e questa distinzione
   * è costata un rimbalzo: con la sonda a «y + 0,1» il personaggio atterrava a
   * quota 7, al giro dopo la sonda finiva a 7,1 — cioè in aria — e ricadeva.
   * Oscillava fra 6,9 e 7 per sempre, senza mai toccare terra.
   * Il corpo occupa [y, y+ALTEZZA): per gli urti si guarda DENTRO
   * quell'intervallo, e per il pavimento c'è una sonda sua (`_pavimento`).
   */
  _urta(x, y, z) {
    const m = MEZZA_LARGHEZZA;
    for (const dx of [-m, m]) {
      for (const dz of [-m, m]) {
        if (this._solido(x + dx, y + 0.05, z + dz)) return true;
        if (this._solido(x + dx, y + ALTEZZA - 0.05, z + dz)) return true;
      }
    }
    return false;
  }

  /** C'è pavimento appena SOTTO i piedi? ⚠ Un pelo sotto, non a quota esatta:
   *  a quota esatta `floor(y)` è la cella dell'aria sopra il blocco, e il
   *  personaggio non si posa mai. */
  _pavimento(x, y, z) {
    const m = MEZZA_LARGHEZZA;
    for (const dx of [-m, m]) {
      for (const dz of [-m, m]) if (this._solido(x + dx, y - 0.02, z + dz)) return true;
    }
    return false;
  }

  /**
   * Un passo di simulazione.
   * @param dt      secondi
   * @param intento { avanti, destra, salta } — avanti/destra in [-1..1]
   * @param angolo  di dove guarda la camera, in radianti: il movimento è
   *                RELATIVO ALLA VISTA, che è l'unico modo che non confonde
   */
  aggiorna(dt, intento, angolo) {
    const passo = Math.min(dt, 0.05);   // ⚠ un fotogramma lungo non teletrasporta

    // ---- il piano ----------------------------------------------------------
    const av = intento.avanti || 0, de = intento.destra || 0;
    const lung = Math.hypot(av, de);
    let mx = 0, mz = 0;
    if (lung > 0.01) {
      const c = Math.cos(angolo), s = Math.sin(angolo);
      // avanti = dove guarda la camera, proiettato sul piano
      const fx = -s, fz = -c;
      const dx = c, dz = -s;
      mx = (fx * av + dx * de) / lung;
      mz = (fz * av + dz * de) / lung;
      this.verso = Math.atan2(mx, mz);
    }

    const vx = mx * VELOCITA * passo, vz = mz * VELOCITA * passo;

    // ⚠ UN ASSE PER VOLTA, e senza questo si resta incollati agli spigoli:
    // provando lo spostamento intero, un angolo che tocca annulla ANCHE la
    // componente che sarebbe passata, e camminando lungo un muro ci si ferma.
    if (vx !== 0) {
      if (!this._urta(this.x + vx, this.y, this.z)) this.x += vx;
      else if (!this._urta(this.x + vx, this.y + SCALINO, this.z)) { this.x += vx; this.y += SCALINO; }
    }
    if (vz !== 0) {
      if (!this._urta(this.x, this.y, this.z + vz)) this.z += vz;
      else if (!this._urta(this.x, this.y + SCALINO, this.z + vz)) { this.z += vz; this.y += SCALINO; }
    }

    // ---- il salto e la caduta ---------------------------------------------
    if (this.aTerra) this._coyote = 0.08; else this._coyote = Math.max(0, this._coyote - passo);
    if (intento.salta && this._coyote > 0) { this.vy = SPINTA_SALTO; this._coyote = 0; this.aTerra = false; }

    // già appoggiato e non sta salendo: resta lì, senza accumulare velocità
    if (this.vy <= 0 && this._pavimento(this.x, this.y, this.z)) {
      this.vy = 0; this.aTerra = true;
      return this;
    }

    this.vy -= GRAVITA * passo;
    let ny = this.y + this.vy * passo;
    if (this.vy <= 0) {
      // ⚠ SI CERCA IL PAVIMENTO A PASSI, non con un salto solo: a velocità di
      // caduta alta un fotogramma lungo attraverserebbe un blocco intero e si
      // finirebbe dentro il terreno.
      const giu = this.y - ny;
      const passi = Math.max(1, Math.ceil(giu / 0.4));
      for (let i = 1; i <= passi; i++) {
        const q = this.y - (giu * i) / passi;
        if (this._pavimento(this.x, q, this.z)) {
          this.y = Math.floor(q - 0.02) + 1;   // la faccia SOPRA del blocco toccato
          this.vy = 0; this.aTerra = true;
          return this;
        }
      }
      this.aTerra = false;
      this.y = ny;
    } else {
      if (this._urta(this.x, ny, this.z)) { this.vy = 0; ny = this.y; }
      this.y = ny;
      this.aTerra = false;
    }
    return this;
  }
}

/**
 * LE INTENZIONI DALLA TASTIERA. Sta qui e non nel motore perché è una
 * traduzione, non un disegno: da «quale tasto» a «cosa vuole fare».
 */
export function tastiera(bersaglio = window) {
  const giu = new Set();
  const stato = { avanti: 0, destra: 0, salta: false };
  const mappa = {
    KeyW: 'su', ArrowUp: 'su', KeyS: 'giu', ArrowDown: 'giu',
    KeyA: 'sinistra', ArrowLeft: 'sinistra', KeyD: 'destra', ArrowRight: 'destra',
    Space: 'salta',
  };
  const cambia = (e, premuto) => {
    const a = mappa[e.code];
    if (!a) return;
    // ⚠ NON SI RUBA LA TASTIERA A CHI SCRIVE: se il fuoco è in un campo di
    // testo, WASD è testo, non movimento.
    if (e.target && /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    if (premuto) giu.add(a); else giu.delete(a);
    if (a === 'salta') e.preventDefault();
    stato.avanti = (giu.has('su') ? 1 : 0) - (giu.has('giu') ? 1 : 0);
    stato.destra = (giu.has('destra') ? 1 : 0) - (giu.has('sinistra') ? 1 : 0);
    stato.salta = giu.has('salta');
  };
  bersaglio.addEventListener('keydown', (e) => cambia(e, true));
  bersaglio.addEventListener('keyup', (e) => cambia(e, false));
  // e se la finestra perde il fuoco, i tasti si «sbloccano»: se no si resta a
  // camminare da soli mentre si è su un'altra scheda
  bersaglio.addEventListener('blur', () => { giu.clear(); stato.avanti = stato.destra = 0; stato.salta = false; });
  return stato;
}

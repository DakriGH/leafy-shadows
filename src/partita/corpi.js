// I CORPI — gli oggetti di fisica del sandbox: cubi che cadono, rimbalzano,
// scivolano e si fermano sui blocchi. Centinaia, a passo FISSO.
//
// ⚠ NIENTE MOTORE, NIENTE DOM: come `gioco/passeggero.js`, riceve il mondo
// (`solido(x,y,z)`) e restituisce posizioni. Si prova in Node
// (`test/corpi.test.mjs`), che è l'unico modo di inchiodare i casi limite: la
// caduta attraverso un blocco a passo lungo, il rimbalzo che non si spegne
// mai, la pila che si compenetra.
//
// ⚠ IL PASSO È FISSO (tecnica storica: Quake, Doom, ogni gioco di rete): la
// simulazione avanza a `PASSO` secondi e chi disegna la interroga quando
// vuole. Un fotogramma lungo fa più passi (fino a un tetto), un fotogramma
// corto nessuno: a 144 Hz e a 20 fps i cubi cadono UGUALI, e il risultato è
// deterministico dato lo stesso seme — la porta del multiplayer e del replay.
//
// ⚠ I CORPI SONO SCATOLE ALLINEATE AGLI ASSI (AABB), non sfere né rigid body
// con rotazione: contro un mondo di cubi è l'urto esatto e più economico, un
// asse per volta come il passeggero. La rotazione è solo ESTETICA (`giro`),
// non entra nella fisica. Il giorno che servirà un carrello su una rampa, si
// vedrà; non prima.

export const PASSO = 1 / 60;
const PASSI_MAX = 4;               // un fotogramma da 70 ms non fa più di 4 passi: non si teletrasporta e non si blocca
const GRAVITA = 26;                // come il passeggero: il mondo è di cubi da un metro, la gravità vera è fiacca
const RIMBALZO = 0.32;
const ATTRITO_TERRA = 0.92;        // per passo, sul piano, quando si è appoggiati
const ATTRITO_ARIA = 0.995;
const SOGLIA_SONNO = 0.06;         // sotto questa velocità, appoggiato, il corpo dorme
const PASSI_PER_DORMIRE = 20;
const SPINTA_VICINI = 0.5;         // quanto due corpi compenetrati si respingono, per passo

export class Corpi {
  /** @param mondo chi risponde a `solido(x, y, z)` */
  constructor(mondo) {
    this.mondo = mondo;
    this.lista = [];
    this._resto = 0;
    this.statistiche = { corpi: 0, svegli: 0, passi: 0 };
    this._griglia = new Map();
  }

  /**
   * Aggiunge un corpo. `lato` in blocchi (0,5 = mezzo cubo), `colore` come
   * [r, g, b] in 0..1, `giro` in radianti (solo per il disegno).
   */
  aggiungi({ x, y, z, vx = 0, vy = 0, vz = 0, lato = 0.5, colore = [1, 1, 1], giro = 0 }) {
    const c = { x, y, z, vx, vy, vz, lato, colore, giro, aTerra: false, sonno: 0, dorme: false };
    this.lista.push(c);
    return c;
  }

  svuota() { this.lista.length = 0; }

  /**
   * Avanza la simulazione di `dt` secondi, a passi fissi. Torna quanti passi
   * ha fatto (chi disegna può interpolare, o non farlo: a 60 passi al secondo
   * su un pannello a 90 Hz la differenza non si vede su un cubo che cade).
   */
  avanza(dt) {
    this._resto += dt;
    let passi = 0;
    while (this._resto >= PASSO && passi < PASSI_MAX) { this._passo(); this._resto -= PASSO; passi++; }
    if (this._resto > PASSO * PASSI_MAX) this._resto = 0;   // un'assenza lunga (scheda in secondo piano) non va recuperata
    this.statistiche.passi += passi;
    return passi;
  }

  _solido(x, y, z) { return this.mondo.solido(Math.floor(x), Math.floor(y), Math.floor(z)); }

  /** La scatola del corpo tocca un blocco pieno? Otto angoli, come il passeggero. */
  _urta(x, y, z, m) {
    // ⚠ GLI ANGOLI STANNO UN PELO DENTRO (m − 0,001): a filo esatto una scatola
    // appoggiata su un piano tocca la cella sotto e resta «murata».
    const e = m - 0.001;
    for (const dx of [-e, e]) for (const dz of [-e, e]) {
      if (this._solido(x + dx, y - e, z + dz)) return true;
      if (this._solido(x + dx, y + e, z + dz)) return true;
    }
    return false;
  }

  _passo() {
    const lista = this.lista;
    let svegli = 0;
    for (const c of lista) {
      if (c.dorme) continue;
      svegli++;
      const m = c.lato / 2;
      c.vy -= GRAVITA * PASSO;
      // ⚠ UN ASSE PER VOLTA, e a SOTTOPASSI se la velocità è alta: a 26 blocchi
      // al secondo un passo da 1/60 è 0,43 blocchi, quasi un lato; con due
      // sottopassi non si attraversa mai un blocco senza vederlo.
      const vmax = Math.max(Math.abs(c.vx), Math.abs(c.vy), Math.abs(c.vz)) * PASSO;
      const sotto = Math.max(1, Math.ceil(vmax / (m * 0.9)));
      const h = PASSO / sotto;
      let appoggiato = false;
      for (let s = 0; s < sotto; s++) {
        // x
        let nx = c.x + c.vx * h;
        if (c.vx !== 0) { if (this._urta(nx, c.y, c.z, m)) { c.vx = -c.vx * RIMBALZO; nx = c.x; } c.x = nx; }
        // z
        let nz = c.z + c.vz * h;
        if (c.vz !== 0) { if (this._urta(c.x, c.y, nz, m)) { c.vz = -c.vz * RIMBALZO; nz = c.z; } c.z = nz; }
        // y
        const ny = c.y + c.vy * h;
        if (this._urta(c.x, ny, c.z, m)) {
          if (c.vy < 0) {
            // si posa sulla faccia SOPRA del blocco toccato: quota esatta, niente tremolio
            c.y = Math.floor(ny - m + 0.001) + 1 + m;
            appoggiato = true;
            c.vy = Math.abs(c.vy) > 3 ? -c.vy * RIMBALZO : 0;
          } else { c.vy = 0; }
        } else c.y = ny;
      }
      c.aTerra = appoggiato || (c.vy <= 0 && this._urta(c.x, c.y - 0.02, c.z, m));
      if (c.aTerra) { c.vx *= ATTRITO_TERRA; c.vz *= ATTRITO_TERRA; if (c.vy < 0) c.vy = 0; }
      else { c.vx *= ATTRITO_ARIA; c.vz *= ATTRITO_ARIA; }
      // il sonno: fermo e appoggiato per un po'
      const v = Math.hypot(c.vx, c.vy, c.vz);
      if (c.aTerra && v < SOGLIA_SONNO) { c.vx = c.vz = 0; if (++c.sonno >= PASSI_PER_DORMIRE) c.dorme = true; }
      else c.sonno = 0;
    }
    this._vicini();
    this.statistiche.corpi = lista.length; this.statistiche.svegli = svegli;
  }

  /**
   * I CORPI FRA LORO: una griglia a celle di un blocco, e chi si compenetra
   * col vicino viene spinto fuori lungo l'asse di minor sovrapposizione.
   * Non è un risolutore di contatti (niente impulsi, niente attrito fra corpi):
   * è quello che basta perché cento cubi lanciati nello stesso punto facciano
   * un MUCCHIO e non una scatola sola. Un corpo urtato si sveglia.
   */
  _vicini() {
    const g = this._griglia; g.clear();
    const lista = this.lista;
    const chiave = (x, z) => ((x + 32768) << 16) | (z + 32768);
    for (let i = 0; i < lista.length; i++) {
      const c = lista[i];
      const k = chiave(Math.floor(c.x), Math.floor(c.z));
      let l = g.get(k); if (!l) { l = []; g.set(k, l); } l.push(i);
    }
    for (let i = 0; i < lista.length; i++) {
      const a = lista[i];
      const cx = Math.floor(a.x), cz = Math.floor(a.z);
      for (let dx = -1; dx <= 1; dx++) for (let dz = -1; dz <= 1; dz++) {
        const l = g.get(chiave(cx + dx, cz + dz)); if (!l) continue;
        for (const j of l) {
          if (j <= i) continue;
          const b = lista[j];
          if (a.dorme && b.dorme) continue;
          const r = (a.lato + b.lato) / 2;
          const ox = r - Math.abs(a.x - b.x); if (ox <= 0) continue;
          const oy = r - Math.abs(a.y - b.y); if (oy <= 0) continue;
          const oz = r - Math.abs(a.z - b.z); if (oz <= 0) continue;
          // lungo l'asse di minor sovrapposizione, metà per uno
          if (ox <= oy && ox <= oz) { const s = Math.sign(a.x - b.x) || 1; a.x += s * ox * SPINTA_VICINI; b.x -= s * ox * SPINTA_VICINI; }
          else if (oy <= oz) { const s = Math.sign(a.y - b.y) || 1; if (s > 0) { a.y += oy * SPINTA_VICINI; if (a.vy < 0) a.vy = 0; } else { b.y += oy * SPINTA_VICINI; if (b.vy < 0) b.vy = 0; } }
          else { const s = Math.sign(a.z - b.z) || 1; a.z += s * oz * SPINTA_VICINI; b.z -= s * oz * SPINTA_VICINI; }
          if (a.dorme) { a.dorme = false; a.sonno = 0; }
          if (b.dorme) { b.dorme = false; b.sonno = 0; }
        }
      }
    }
  }

  /**
   * Le istanze per il disegno: otto float per corpo, come le vuole
   * `nucleo/modelli.js` — x y z scala, r g b, giro. Riusa il buffer.
   */
  istanze(out = null) {
    const n = this.lista.length;
    if (!out || out.length !== n * 8) out = new Float32Array(n * 8);
    for (let i = 0; i < n; i++) {
      const c = this.lista[i], o = i * 8;
      out[o] = c.x; out[o + 1] = c.y - c.lato / 2; out[o + 2] = c.z; out[o + 3] = c.lato;
      out[o + 4] = c.colore[0]; out[o + 5] = c.colore[1]; out[o + 6] = c.colore[2]; out[o + 7] = c.giro;
    }
    return out;
  }
}

// GLI SPRUZZI DELLE CASCATE: da dove sbatte l'acqua a quali effetti accendere.
//
// ⚠ QUI NON SI NOMINA NESSUN MOTORE, ed è il motivo per cui questo file esiste
// invece di stare dentro la regia: la parte difficile degli spruzzi non è
// crearli — è DECIDERLI. Quante cascate ci sono davvero (una larga sei celle è
// UNA cascata, non sei), quanto è alta ognuna, quali meritano il velo, e quali
// si lasciano perdere perché sono già trenta. Sono conti su numeri, e conti su
// numeri si provano in Node (`test/spruzzi.test.mjs`), non guardando lo schermo.
//
// ⚠ E IL DATO ARRIVA DAL MESHER, che lo calcolava già: ogni cella d'acqua che
// ha una colonna sopra e un fondo sotto produce un impatto `{x, y, z, ys, h}` —
// `ys` è DOVE SBATTE (il pelo della pozza), `y` la cima della colonna, `h`
// l'altezza della caduta. Vedi `mesher.puntiAcqua()`.

/**
 * Le soglie dell'altezza, e sono LE STESSE dello shader (`GLSL_ACQUA_CASCATA`).
 *
 * ⚠ DEVONO RESTARE UNA COSA SOLA: la schiuma dipinta al piede compare dai tre
 * blocchi e il velo dai sei. Se le particelle usassero altre soglie si vedrebbe
 * una cascata che schizza senza schiumare (o peggio, il contrario) — e il
 * difetto sembrerebbe «le particelle sono nel posto sbagliato» mentre sarebbe
 * un disaccordo fra due tabelle che nessuno ha messo vicine.
 */
export const SOGLIA_SCHIUMA = 3;
export const SOGLIA_VELO = 6;

/** Quanti gruppi al massimo: oltre, si tengono i più alti. */
export const MAX_GRUPPI = 8;

/**
 * Raggruppa gli impatti CONTIGUI in cascate.
 *
 * ⚠ SENZA QUESTO, UNA CASCATA LARGA SEI CELLE ACCENDE SEI SISTEMI, ognuno con
 * la sua capacità e il suo ritmo: sei volte il costo per un effetto che si vede
 * peggio (sei fontanelle in fila invece di un fronte). Il raggruppamento è
 * l'unica parte di questo file che non è una soglia, ed è quella che decide il
 * prezzo.
 *
 * Contiguità a 8 vicini sul piano XZ, e solo fra impatti che sbattono ALLA
 * STESSA quota: due cascate sovrapposte su un dirupo a terrazze sono due.
 */
export function raggruppa(impatti) {
  const dove = new Map();
  for (const p of impatti) dove.set(`${Math.round(p.x)},${Math.round(p.z)},${Math.round(p.ys)}`, p);
  const visti = new Set();
  const gruppi = [];
  for (const [chiave, p] of dove) {
    if (visti.has(chiave)) continue;
    const pila = [chiave];
    visti.add(chiave);
    const celle = [];
    while (pila.length) {
      const k = pila.pop();
      const q = dove.get(k);
      celle.push(q);
      const [qx, qz, qy] = k.split(',').map(Number);
      for (let dx = -1; dx <= 1; dx++) {
        for (let dz = -1; dz <= 1; dz++) {
          if (!dx && !dz) continue;
          const vicino = `${qx + dx},${qz + dz},${qy}`;
          if (dove.has(vicino) && !visti.has(vicino)) { visti.add(vicino); pila.push(vicino); }
        }
      }
    }
    gruppi.push(riassumi(celle));
  }
  return gruppi;
}

/** Il riassunto di un gruppo: dove sta, quanto è largo, quanto cade. */
function riassumi(celle) {
  let sx = 0, sz = 0, alta = 0, minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity;
  for (const c of celle) {
    sx += c.x; sz += c.z;
    if (c.h > alta) alta = c.h;
    if (c.x < minX) minX = c.x;
    if (c.x > maxX) maxX = c.x;
    if (c.z < minZ) minZ = c.z;
    if (c.z > maxZ) maxZ = c.z;
  }
  return {
    x: sx / celle.length,
    y: celle[0].ys,
    z: sz / celle.length,
    celle: celle.length,
    alta,
    // il fronte è il lato LUNGO: una cascata larga sei e profonda una vuole uno
    // spruzzo largo sei, non un cerchio di raggio tre
    fronte: Math.max(maxX - minX, maxZ - minZ) + 1,
  };
}

/**
 * IL PIANO: da un elenco di impatti, gli effetti da accendere.
 *
 * Ogni voce è `{ effetto, x, y, z, ritocchi }` — pronta per `Particelle.accendi`.
 *
 * ⚠ LE CASCATE BASSE NON SCHIZZANO, e non è una svista: un salto di uno o due
 * blocchi non ha fatto in tempo a prendere velocità. Metterci lo spruzzo lo
 * renderebbe uno scalino che ribolle, e a quel punto l'effetto smetterebbe di
 * voler dire «da qui in giù è alta».
 *
 * ⚠ E IL TAGLIO È SULLE PIÙ BASSE, non sulle più lontane: la distanza la
 * gestisce già `Particelle.aggiorna`, che spegne quello che non si guarda. Qui
 * si sceglie CHI merita, e a parità di tutto merita la più alta.
 */
export function pianoSpruzzi(impatti, { max = MAX_GRUPPI, velo = true } = {}) {
  const gruppi = raggruppa(impatti)
    .filter((g) => g.alta >= SOGLIA_SCHIUMA)
    .sort((a, b) => b.alta - a.alta || b.celle - a.celle)
    .slice(0, max);
  const piano = [];
  for (const g of gruppi) {
    const raggio = Math.max(0.45, g.fronte * 0.42);
    // la forza cresce con la caduta, ma si appiattisce: fra sei e dodici blocchi
    // l'occhio non conta i metri, vede «alta»
    const forza = Math.min(1, 0.45 + g.alta * 0.09);
    piano.push({
      effetto: 'spruzzo', x: g.x, y: g.y, z: g.z, alta: g.alta,
      ritocchi: {
        forma: { raggio, altezza: 0.12 },
        ritmo: Math.round(70 + 55 * g.fronte * forza),
        velocita: [1.2 + forza, 2.2 + forza * 1.8],
      },
    });
    piano.push({
      effetto: 'bolle', x: g.x, y: g.y - 0.35, z: g.z, alta: g.alta,
      ritocchi: { forma: { raggio: raggio * 1.1, altezza: 0.3 }, ritmo: Math.round(20 + 20 * g.fronte) },
    });
    if (velo && g.alta >= SOGLIA_VELO) {
      piano.push({
        effetto: 'velo', x: g.x, y: g.y + 0.2, z: g.z, alta: g.alta,
        ritocchi: {
          forma: { raggio: raggio * 1.3, altezza: 0.25 },
          ritmo: Math.round(6 + 4 * g.fronte),
        },
      });
    }
  }
  return piano;
}

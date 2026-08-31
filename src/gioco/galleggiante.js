/**
 * LA FISICA DI UNA PALLA CHE GALLEGGIA — pura, senza motore, provata in Node.
 *
 * È il primo cliente vero di `altezzaPelo`: la palla si appoggia sull'ONDA
 * CALCOLATA, la stessa che la GPU disegna, quindi il galleggiamento è anche la
 * verifica visiva che JS e GLSL raccontino lo stesso pelo (se un giorno
 * divergono, le palle nuotano dentro o sopra l'acqua a vista).
 *
 * ⚠ LA SEMANTICA DEGLI EVENTI VIENE DAL COMMITTENTE, ed è una distinzione
 * giusta: «lo schizzo avviene quando un oggetto CADE, ma se STA in acqua deve
 * fare una scia». Quindi due eventi diversi:
 *  · `tuffo` — una volta sola, all'ingresso in acqua, e solo se si arriva con
 *    velocità verticale vera: appoggiare una palla piano non schizza;
 *  · `scia` — a cadenza, finché la palla si muove in orizzontale dentro
 *    l'acqua, emessa DIETRO la palla (è la scia, non un alone attorno).
 * La schiuma al bordo non sta qui: la fa la profondità `vera` da sola, per
 * qualsiasi mesh che entri nelle passate (vedi `entraNellePassate`).
 *
 * ⚠ LE PARETI DELLA VASCA SONO PARTE DELLA FISICA: una palla colpita forte
 * rimbalza e resta nel banco — un banco da cui i pezzi scappano via non prova
 * niente. Il rimbalzo perde metà dell'energia, come una palla vera sull'acqua.
 */

const GRAVITA = 22;
// la spinta: accelerazione netta = GRAVITA · (SPINTA · immersione − 1).
// Con SPINTA = 1,8 l'equilibrio cade a immersione ≈ 0,56: la palla galleggia
// con poco più di metà del corpo sotto, che è come galleggia una palla vera.
const SPINTA = 1.8;
const TUFFO_MINIMO = 2.0;     // sotto questa velocità verticale niente schizzo
const SCIA_MINIMA = 0.9;      // sotto questa velocità orizzontale niente scia
const SCIA_OGNI = 0.07;       // secondi fra un segno di scia e l'altro: fitti,
                              // perché sovrapposti devono leggersi come UNA
                              // lingua che svanisce, non come sbuffi staccati

export function creaPalla(raggio, x, y, z) {
  return {
    raggio,
    casa: { x, y, z },
    x, y, z,
    vx: 0, vy: 0, vz: 0,
    inAcqua: false,
    presa: false,
    portata: false,
    _sciaFra: 0,
    _mira: null,
  };
}

/** Torna al punto di partenza, ferma, fuori dall'acqua: il tasto ↺. */
export function azzeraPalla(palla) {
  palla.x = palla.casa.x; palla.y = palla.casa.y; palla.z = palla.casa.z;
  palla.vx = 0; palla.vy = 0; palla.vz = 0;
  palla.inAcqua = false; palla.presa = false; palla.portata = false; palla._sciaFra = 0; palla._mira = null;
}

/** Tenendo premuto: la palla insegue il punto sotto il dito (sul piano del pelo). */
export function trascinaPalla(palla, versoX, versoZ) {
  palla.presa = true;
  palla.portata = false;
  palla._mira = { x: versoX, z: versoZ };
}

/**
 * Col tasto DESTRO la palla si prende IN MANO: vola verso il punto chiesto
 * (il banco lo tiene a +2 blocchi dal terreno) ignorando acqua e gravità.
 * Mollandola ricade con l'abbrivio che aveva — e se ricade in acqua, si tuffa.
 */
export function portaPalla(palla, versoX, versoY, versoZ) {
  palla.presa = true;
  palla.portata = true;
  palla._mira = { x: versoX, y: versoY, z: versoZ };
}

export function mollaPalla(palla) {
  palla.presa = false;
  palla.portata = false;
  palla._mira = null;
}

/**
 * Il colpetto: una spinta orizzontale più un piccolo salto. ⚠ Se la palla è
 * GIÀ in acqua lo schizzo esce al momento della botta, non alla ricaduta: è
 * il colpo stesso a muovere l'acqua, e il saltello da solo rientra troppo
 * piano per superare la soglia del tuffo (misurato dalla prova).
 */
export function colpisciPalla(palla, versoX, versoZ, forza = 8) {
  const lung = Math.hypot(versoX, versoZ) || 1;
  palla.vx += (versoX / lung) * forza;
  palla.vz += (versoZ / lung) * forza;
  palla.vy += 2.2;
  palla._colpo = Math.min(1, 0.25 + forza * 0.05);
}

/**
 * Un passo di fisica. `ambiente` = { pelo(x,z), fondo, muri: {x0,z0,x1,z1} }.
 * Torna gli eventi del passo: { tuffo: {x,z,forza}|null, scia: {x,z,forza}|null }.
 */
export function aggiornaPalla(palla, dt, ambiente) {
  const eventi = { tuffo: null, scia: null };
  if (dt <= 0) return eventi;

  // in mano (tasto destro): la palla vola verso la mira, niente acqua e
  // niente gravità — ma le velocità restano vere, così mollandola conserva
  // l'abbrivio e il tuffo alla ricaduta esce dalla fisica normale
  if (palla.portata && palla._mira) {
    const passoP = Math.min(1, dt * 12);
    const tetto = 18;
    palla.vx = Math.max(-tetto, Math.min(tetto, (palla._mira.x - palla.x) / Math.max(dt, 0.05)));
    palla.vy = Math.max(-tetto, Math.min(tetto, (palla._mira.y - palla.y) / Math.max(dt, 0.05)));
    palla.vz = Math.max(-tetto, Math.min(tetto, (palla._mira.z - palla.z) / Math.max(dt, 0.05)));
    palla.x += (palla._mira.x - palla.x) * passoP;
    palla.y += (palla._mira.y - palla.y) * passoP;
    palla.z += (palla._mira.z - palla.z) * passoP;
    const peloQui = ambiente.pelo(palla.x, palla.z);
    palla.inAcqua = (peloQui - (palla.y - palla.raggio)) / (2 * palla.raggio) > 0.08;
    return eventi;
  }

  // l'inseguimento del dito: velocità verso la mira, con un tetto — così la
  // scia nasce dal MOTO vero e un trascinamento lento non schizza niente
  if (palla.presa && palla._mira) {
    const tetto = 14;
    palla.vx = Math.max(-tetto, Math.min(tetto, (palla._mira.x - palla.x) / Math.max(dt, 0.05)));
    palla.vz = Math.max(-tetto, Math.min(tetto, (palla._mira.z - palla.z) / Math.max(dt, 0.05)));
  }

  const quotaPelo = ambiente.pelo(palla.x, palla.z);
  const immersione = Math.max(0, Math.min(1, (quotaPelo - (palla.y - palla.raggio)) / (2 * palla.raggio)));
  const dentro = immersione > 0.08;

  // il tuffo si decide PRIMA di frenare: la velocità d'ingresso è quella vera
  if (dentro && !palla.inAcqua && palla.vy < -TUFFO_MINIMO) {
    const forza = Math.min(1, (-palla.vy / 9) * (0.5 + palla.raggio * 0.6));
    eventi.tuffo = { x: palla.x, z: palla.z, forza };
  }
  // lo schizzo del colpetto, se la botta arriva a palla già in acqua
  if (palla._colpo && dentro) {
    eventi.tuffo = eventi.tuffo || { x: palla.x, z: palla.z, forza: palla._colpo };
  }
  palla._colpo = 0;
  palla.inAcqua = dentro;

  // gravità e spinta di Archimede (netta, già col segno giusto)
  palla.vy += GRAVITA * (SPINTA * immersione - 1) * dt;

  // l'attrito: forte in acqua, quasi niente in aria
  const frenaXZ = Math.exp((dentro ? -2.4 : -0.12) * dt);
  const frenaY = Math.exp((dentro ? -3.4 : 0) * dt);
  palla.vx *= frenaXZ; palla.vz *= frenaXZ; palla.vy *= frenaY;

  palla.x += palla.vx * dt;
  palla.y += palla.vy * dt;
  palla.z += palla.vz * dt;

  // le pareti e il fondo della vasca: si rimbalza, non si scappa
  const m = ambiente.muri;
  if (m) {
    if (palla.x - palla.raggio < m.x0) { palla.x = m.x0 + palla.raggio; palla.vx = Math.abs(palla.vx) * 0.55; }
    if (palla.x + palla.raggio > m.x1) { palla.x = m.x1 - palla.raggio; palla.vx = -Math.abs(palla.vx) * 0.55; }
    if (palla.z - palla.raggio < m.z0) { palla.z = m.z0 + palla.raggio; palla.vz = Math.abs(palla.vz) * 0.55; }
    if (palla.z + palla.raggio > m.z1) { palla.z = m.z1 - palla.raggio; palla.vz = -Math.abs(palla.vz) * 0.55; }
  }
  // il pavimento è il TERRENO VERO se l'ambiente sa dirlo per punto (una
  // funzione), o una quota fissa: con la quota fissa la palla trascinata
  // sulla spiaggia si INCASTRAVA nel terreno — verdetto dal vivo
  const fondoQui = typeof ambiente.fondo === 'function' ? ambiente.fondo(palla.x, palla.z) : ambiente.fondo;
  if (palla.y - palla.raggio < fondoQui) {
    palla.y = fondoQui + palla.raggio;
    palla.vy = Math.abs(palla.vy) * 0.3;
  }

  // la scia: dietro la palla, a cadenza, solo se il moto è vero
  const passo = Math.hypot(palla.vx, palla.vz);
  palla._sciaFra -= dt;
  if (dentro && passo > SCIA_MINIMA && palla._sciaFra <= 0) {
    palla._sciaFra = SCIA_OGNI;
    eventi.scia = {
      x: palla.x - (palla.vx / passo) * palla.raggio,
      z: palla.z - (palla.vz / passo) * palla.raggio,
      // la «forza» qui è il RAGGIO del segno: largo quanto la palla, un po'
      // di più se corre — è quello che rende la lingua proporzionata al corpo
      forza: palla.raggio * (0.65 + Math.min(0.5, passo * 0.05)),
    };
  }
  return eventi;
}

/**
 * GLI URTI FRA PALLE — «le palle non interagiscono tra di loro».
 * Sfere contro sfere, masse ∝ raggio³, un po' d'energia persa nell'urto.
 * ⚠ CHI È IN MANO NON SI SPOSTA: la palla presa (trascinata o portata) è
 * un'incudine — l'altra prende tutta la separazione e tutto il rimbalzo. Se
 * no il dito «perderebbe» la palla a ogni contatto, e sembrerebbe un difetto
 * della presa invece che una scelta dell'urto.
 */
export function scontraPalle(palle) {
  for (let i = 0; i < palle.length; i++) {
    for (let j = i + 1; j < palle.length; j++) {
      const una = palle[i], due = palle[j];
      const inX = due.x - una.x, inY = due.y - una.y, inZ = due.z - una.z;
      const dist = Math.hypot(inX, inY, inZ);
      const minimo = una.raggio + due.raggio;
      if (dist >= minimo || dist < 1e-6) continue;
      const nx = inX / dist, ny = inY / dist, nz = inZ / dist;
      const dentro = minimo - dist;
      const massaUna = una.raggio ** 3, massaDue = due.raggio ** 3;
      let quotaUna = una.presa ? 0 : massaDue, quotaDue = due.presa ? 0 : massaUna;
      const somma = quotaUna + quotaDue;
      if (somma === 0) continue;
      quotaUna /= somma; quotaDue /= somma;
      una.x -= nx * dentro * quotaUna; una.y -= ny * dentro * quotaUna; una.z -= nz * dentro * quotaUna;
      due.x += nx * dentro * quotaDue; due.y += ny * dentro * quotaDue; due.z += nz * dentro * quotaDue;
      const lungoRel = (due.vx - una.vx) * nx + (due.vy - una.vy) * ny + (due.vz - una.vz) * nz;
      if (lungoRel >= 0) continue; // si stanno già allontanando
      const urto = -lungoRel * 1.55; // 1 + restituzione 0,55
      const controUna = due.presa ? urto : urto * massaDue / (massaUna + massaDue);
      const controDue = una.presa ? urto : urto * massaUna / (massaUna + massaDue);
      if (!una.presa) { una.vx -= nx * controUna; una.vy -= ny * controUna; una.vz -= nz * controUna; }
      if (!due.presa) { due.vx += nx * controDue; due.vy += ny * controDue; due.vz += nz * controDue; }
    }
  }
}

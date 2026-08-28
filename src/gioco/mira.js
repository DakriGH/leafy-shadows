// LA MIRA — quale cella sto guardando.
//
// ⚠ NON SA CHE ESISTE UN MOTORE, come tutto `src/gioco/`: riceve un raggio
// (origine e verso, già in coordinate di mondo) e il mondo, e risponde con una
// cella e una faccia. Chi il raggio lo tira fuori dal puntatore è affare del
// motore; qui è aritmetica, e si prova in Node.
//
// ⚠ E IL RAGGIO LO CALCOLA BABYLON, la griglia la camminiamo noi, ed è la
// divisione giusta. `scene.pick` saprebbe rispondere da solo, ma dovrebbe
// intersecare i triangoli del chunk — centomila e passa, per dire quale cubo si
// sta guardando. Il DDA ci arriva in tanti passi quanti sono i blocchi
// attraversati, cioè una decina, e dà anche la FACCIA colpita, che a `pick`
// costerebbe un conto in più. Quello che Babylon fa meglio è l'unproiezione
// (matrici di vista e proiezione, viewport, origine mobile): quella gliela si
// chiede e non si riscrive.

/**
 * QUANTO LONTANO ARRIVA IL BRACCIO, in blocchi, misurato DAL PERSONAGGIO.
 *
 * ⚠ E LA DISTINZIONE FRA BRACCIO E RAGGIO È COSTATA UN MIRINO SEMPRE SPENTO.
 * In una vista a diorama il raggio parte dalla CAMERA, che orbita venticinque
 * blocchi indietro: dandogli sette di portata non arriva nemmeno al terreno, e
 * non si può mirare a niente da nessuna parte. Sembra un difetto del raycast e
 * non lo è — il cammino era giusto, era corta la corda.
 *
 * Quindi il raggio si tira LUNGO (`portataRaggio`, che comprende la distanza
 * della camera) e il braccio si controlla DOPO, sulla cella colpita: sono due
 * numeri diversi e vanno tenuti diversi.
 */
export const PORTATA = 7;

/** Fin dove camminare la griglia, data la distanza della camera dal bersaglio. */
export function portataRaggio(distanzaCamera) { return distanzaCamera + PORTATA + 2; }

/** La cella è a portata di braccio? Si misura dal CENTRO della cella. */
export function raggiungibile([x, y, z], corpo, portata = PORTATA) {
  if (!corpo) return true;
  const dx = x + 0.5 - corpo.x, dy = y + 0.5 - (corpo.y + 0.45), dz = z + 0.5 - corpo.z;
  return dx * dx + dy * dy + dz * dz <= portata * portata;
}

/**
 * IL CAMMINO DI AMANATIDES-WOO, lo stesso algoritmo che in Lantern fa le ombre
 * delle lampade dentro lo shader.
 *
 * L'idea in una riga: dalla cella in cui si è, si guarda **quale delle tre
 * pareti** (x, y, z) il raggio incontra prima, ci si sposta di una cella in
 * quella direzione, e si ripete. Ogni passo è due confronti e una somma: niente
 * radici, niente divisioni dentro il ciclo.
 *
 * @param mondo    chi risponde a `solido(x,y,z)`
 * @param origine  {x,y,z} in coordinate di mondo
 * @param verso    {x,y,z} versore
 * @param portata  in blocchi
 * @returns `{ cella: [x,y,z], faccia: [dx,dy,dz], prima: [x,y,z] }` oppure null
 *          — `prima` è la cella VUOTA appena prima, cioè dove si posa un blocco.
 */
export function mira(mondo, origine, verso, portata = PORTATA) {
  let cx = Math.floor(origine.x), cy = Math.floor(origine.y), cz = Math.floor(origine.z);
  const px = Math.sign(verso.x), py = Math.sign(verso.y), pz = Math.sign(verso.z);

  // ⚠ INFINITO PER GLI ASSI FERMI, e va bene così: un raggio orizzontale non
  // incontra MAI una parete orizzontale, e `1/0` in JS è proprio `Infinity`, che
  // nei confronti si comporta come deve. Metterci un numero grosso a mano
  // sarebbe la stessa cosa con un limite nascosto dentro.
  const dx = px !== 0 ? Math.abs(1 / verso.x) : Infinity;
  const dy = py !== 0 ? Math.abs(1 / verso.y) : Infinity;
  const dz = pz !== 0 ? Math.abs(1 / verso.z) : Infinity;

  // quanto manca al primo attraversamento su ciascun asse
  let tx = px !== 0 ? ((px > 0 ? cx + 1 - origine.x : origine.x - cx) * dx) : Infinity;
  let ty = py !== 0 ? ((py > 0 ? cy + 1 - origine.y : origine.y - cy) * dy) : Infinity;
  let tz = pz !== 0 ? ((pz > 0 ? cz + 1 - origine.z : origine.z - cz) * dz) : Infinity;

  // ⚠ LA CELLA DI PARTENZA SI GUARDA LO STESSO: chi mira stando DENTRO un
  // blocco (la testa in una parete) deve poterlo rompere, se no si resta murati.
  if (mondo.solido(cx, cy, cz)) {
    return { cella: [cx, cy, cz], faccia: [0, 1, 0], prima: [cx, cy + 1, cz] };
  }

  for (let passi = 0; passi < portata * 3 + 3; passi++) {
    let fx = 0, fy = 0, fz = 0;
    if (tx <= ty && tx <= tz) { if (tx > portata) break; cx += px; tx += dx; fx = -px; }
    else if (ty <= tz)       { if (ty > portata) break; cy += py; ty += dy; fy = -py; }
    else                     { if (tz > portata) break; cz += pz; tz += dz; fz = -pz; }
    if (mondo.solido(cx, cy, cz)) {
      // ⚠ LA FACCIA È IL VERSO DA CUI SI È ENTRATI, cambiato di segno: è la
      // normale uscente, ed è ANCHE dove si posa il blocco nuovo. Le due cose
      // coincidono sempre, quindi non c'è un secondo conto da tenere allineato.
      return { cella: [cx, cy, cz], faccia: [fx, fy, fz], prima: [cx + fx, cy + fy, cz + fz] };
    }
  }
  return null;
}

/**
 * L'INCROCIO CON UNA SCATOLA ALLINEATA AGLI ASSI, in avanti.
 *
 * ⚠ SERVE PERCHÉ NON TUTTO È UN BLOCCO. Un lampione è un modello alto tre
 * celle piantato in mezzo all'aria: la griglia lì è VUOTA, quindi il cammino
 * gli passa attraverso e finisce sul terreno sotto. Cliccarlo era impossibile,
 * ed è il difetto che il committente ha visto come «manca il modo di interagire
 * con i lampioni».
 *
 * Il metodo è il classico «slab»: per ogni asse si trova l'intervallo di
 * cammino in cui il raggio sta dentro la lastra, e si tiene l'intersezione dei
 * tre. Se resta un intervallo, il raggio entra.
 *
 * @returns la distanza d'ingresso, o -1 se non la incrocia
 */
export function incrociaScatola(origine, verso, min, max, portata, faccia = null) {
  let dentro = 0, fuori = portata;
  let asseEntrata = -1, segnoEntrata = 0;
  const ASSI = ['x', 'y', 'z'];
  for (let i = 0; i < 3; i++) {
    const asse = ASSI[i];
    const d = verso[asse];
    if (Math.abs(d) < 1e-9) {
      // ⚠ RAGGIO PARALLELO ALLA LASTRA: o è già dentro per sempre, o è fuori
      // per sempre. Dividere qui darebbe infiniti col segno sbagliato, che è il
      // modo classico in cui questo algoritmo sbaglia in silenzio.
      if (origine[asse] < min[asse] || origine[asse] > max[asse]) return -1;
      continue;
    }
    let a = (min[asse] - origine[asse]) / d;
    let b = (max[asse] - origine[asse]) / d;
    // ⚠ LA NORMALE DELLA FACCIA «min» PUNTA SEMPRE VERSO −ASSE, e si gira solo
    // se le due distanze si scambiano (cioè se il raggio viaggia all'indietro
    // su quest'asse e quindi entra dalla faccia «max»). Ricavarla dal SEGNO
    // della direzione, come avevo fatto, dà la faccia opposta: per un raggio
    // che viene dall'alto usciva la faccia di SOTTO, e il blocco si sarebbe
    // posato dentro il terreno.
    let seg = -1;
    if (a > b) { const t = a; a = b; b = t; seg = 1; }
    // ⚠ L'ASSE D'INGRESSO È QUELLO CON LA «a» PIÙ GRANDE: si entra davvero nella
    // scatola solo quando si è entrati in TUTTE E TRE le lastre, quindi comanda
    // l'ultima. È la stessa cosa che il cammino a voxel ricava dal passo.
    if (a > dentro) { dentro = a; asseEntrata = i; segnoEntrata = seg; }
    if (b < fuori) fuori = b;
    if (dentro > fuori) return -1;
  }
  if (faccia && asseEntrata >= 0) {
    faccia[0] = faccia[1] = faccia[2] = 0;
    faccia[asseEntrata] = segnoEntrata;
  }
  return dentro;
}

/**
 * MIRA A TUTTO: prima le scatole, poi i blocchi, e vince chi è più vicino.
 *
 * ⚠ E L'ORDINE NON BASTA, SERVE IL CONFRONTO: un lampione dietro un muro non si
 * deve poter accendere. Guardando solo «c'è una scatola sul raggio?» si
 * accenderebbe attraverso la roccia.
 *
 * @param scatole elenco di `{ min:{x,y,z}, max:{x,y,z}, dato }`
 * @returns `{ cella, faccia, prima }` come `mira`, oppure `{ scatola, dato }`
 */
export function miraCompleta(mondo, origine, verso, scatole, portata = PORTATA) {
  const blocco = mira(mondo, origine, verso, portata);
  // ⚠ LA DISTANZA DEL BLOCCO SI RICAVA DAL SUO CENTRO DI FACCIA, non dalla
  // cella: due celle diverse possono stare alla stessa distanza di griglia e a
  // distanze molto diverse dall'occhio.
  let dBlocco = Infinity;
  if (blocco) {
    const c = blocco.cella;
    const dx = c[0] + 0.5 - origine.x, dy = c[1] + 0.5 - origine.y, dz = c[2] + 0.5 - origine.z;
    dBlocco = Math.sqrt(dx * dx + dy * dy + dz * dz);
  }
  let miglior = null, dMiglior = dBlocco;
  for (const s of scatole || []) {
    const d = incrociaScatola(origine, verso, s.min, s.max, portata);
    if (d >= 0 && d < dMiglior) { dMiglior = d; miglior = s; }
  }
  // ⚠ E QUANDO VINCE UNA SCATOLA, LA CELLA DOVE POSARE SI RICAVA DAL RAGGIO,
  // non dal blocco che sta dietro — e questa è la correzione a un difetto che
  // il committente ha visto in due modi diversi che erano lo stesso:
  //   · «non riesco a piazzare i ciuffi d'erba»: mirando dall'alto, il blocco
  //     dietro il ciuffo è il terreno SOTTO, quindi la sua cella «prima» era il
  //     ciuffo stesso — occupata, quindi non si posava niente;
  //   · «mi piazza un blocco in diagonale»: mirando di sbieco, il raggio
  //     attraversa il ciuffo e colpisce il terreno più in là, che da lì si vede
  //     in diagonale.
  // La cella giusta è quella in cui sta il raggio un attimo PRIMA di entrare
  // nella scatola: è dove starebbe la mano di chi tocca l'oggetto.
  if (miglior) {
    // ⚠ LA FACCIA SI PRENDE DALLA CELLA, NON DALLA SCATOLA VISIVA, e la
    // distinzione è costata una prova rossa. Un ciuffo d'erba è alto nove
    // decimi: la sua scatola sta TUTTA DENTRO la sua cella, quindi «un attimo
    // prima di entrare nella scatola» è ancora la cella del ciuffo — occupata,
    // e quindi non si posava niente. La cella confinante la dà solo la faccia
    // della CELLA, che è lo stesso conto che si fa per un blocco.
    const c = miglior.dato && miglior.dato.cella;
    let prima = blocco && blocco.prima;
    if (c) {
      const f = [0, 0, 0];
      const d = incrociaScatola(origine, verso,
        { x: c[0], y: c[1], z: c[2] }, { x: c[0] + 1, y: c[1] + 1, z: c[2] + 1 }, portata, f);
      if (d >= 0) prima = [c[0] + f[0], c[1] + f[1], c[2] + f[2]];
    }
    return { ...blocco, scatola: miglior, dato: miglior.dato, distanza: dMiglior, prima };
  }
  return blocco;
}

/**
 * SI PUÒ POSARE UN BLOCCO QUI?
 *
 * ⚠ E LA RISPOSTA DIPENDE DA DOVE STA CHI POSA. Murarsi dentro da soli è il
 * primo modo in cui un gioco a blocchi si rompe: il personaggio resta incastrato
 * e non c'è verso di uscirne se non rompendo, che è proprio quello che il blocco
 * appena messo impedisce. Quindi la cella del corpo è vietata per costruzione.
 */
export function posabile(mondo, [x, y, z], corpo, mezzaLarghezza = 0.30, altezza = 0.90) {
  if (mondo.pieno(x, y, z)) return false;
  if (!corpo) return true;
  // il corpo occupa [y, y+altezza) attorno a (x, z): si guarda se il cubo della
  // cella lo tocca, con un margine
  const dentroXZ = corpo.x + mezzaLarghezza > x && corpo.x - mezzaLarghezza < x + 1
                && corpo.z + mezzaLarghezza > z && corpo.z - mezzaLarghezza < z + 1;
  const dentroY = corpo.y + altezza > y && corpo.y < y + 1;
  return !(dentroXZ && dentroY);
}

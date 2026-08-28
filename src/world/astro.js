// L'ASTRONOMIA — dove stanno davvero il sole e la luna.
//
// ⚠ PERCHÉ NON BASTAVA UN CERCHIO. Fino a ora il sole girava su un arco fisso:
// stessa altezza tutti i giorni dell'anno, alba sempre alla stessa ora, luna
// sempre all'opposto. Committente: «la posizione del sole e della luna deve
// variare in maniera realistica, con eclissi, equinozi ecc, coordinata con una
// posizione che scegliamo noi». Con un arco fisso non esistono né equinozi né
// solstizi: esiste un solo giorno, ripetuto.
//
// ⚠ ED È MATEMATICA PURA, quindi vive in `src/world/` e si prova in Node contro
// valori NOTI — l'altezza del sole a mezzogiorno al solstizio è 90° − latitudine
// + 23,44°, e o torna o non torna. È il genere di codice in cui una prova vale
// più di dieci schermate.
//
// ── QUANTO È PRECISO, detto prima ────────────────────────────────────────────
// Sole: formule di Meeus a bassa precisione, ~0,01° — molto meglio di quanto
// serva a un diorama. Luna: i termini principali, ~0,3° in longitudine. Basta
// per fasi, sorgere e tramontare, e per far CAPITARE le eclissi nei giorni
// giusti; non basta per prevederne l'ora al minuto, e non serve.
//
// ⚠ E LE ECLISSI NON SI «FANNO»: capitano. Se si calcolano davvero le due
// posizioni, un'eclissi è il momento in cui coincidono — non c'è niente da
// programmare, e questo è tutto il punto di avere un modello invece di un arco.

const RAD = Math.PI / 180;
const GRADI = 180 / Math.PI;

/**
 * IL LUOGO. ⚠ Per adesso l'Italia, come chiesto; è un oggetto e non delle
 * costanti sparse proprio perché diventerà scelto dal giocatore.
 */
export const LUOGO = { nome: 'Italia', lat: 43.0, lon: 12.5 };

/** Il giorno giuliano: il conto continuo dei giorni da cui parte tutto. */
export function giornoGiuliano(data) {
  return data.getTime() / 86400000 + 2440587.5;
}

/** Secoli giuliani dal 2000.0, l'unità in cui sono scritte le formule. */
const secoli = (jd) => (jd - 2451545) / 36525;

const norm = (g) => ((g % 360) + 360) % 360;

/**
 * IL SOLE — declinazione, ascensione retta, e da lì altezza e azimut.
 *
 * ⚠ LA DECLINAZIONE È LA STAGIONE. È l'angolo fra il sole e l'equatore
 * celeste: +23,44° al solstizio d'estate, −23,44° a quello d'inverno, zero agli
 * equinozi. Tutto quello che chiamiamo «stagione» — quanto è alto il sole,
 * quanto dura il giorno, da che parte sorge — è questa unica grandezza.
 */
export function posizioneSole(data, lat = LUOGO.lat, lon = LUOGO.lon) {
  const jd = giornoGiuliano(data);
  const T = secoli(jd);
  // anomalia media e longitudine media (Meeus 25.2/25.3)
  const L0 = norm(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const M = norm(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const Mr = M * RAD;
  // equazione del centro: l'orbita non è un cerchio, e questo è lo scarto
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mr)
          + (0.019993 - 0.000101 * T) * Math.sin(2 * Mr)
          + 0.000289 * Math.sin(3 * Mr);
  const vera = L0 + C;                       // longitudine eclittica vera
  // obliquità dell'eclittica: l'inclinazione dell'asse terrestre, cioè il
  // motivo per cui le stagioni esistono
  const eps = (23.439291 - 0.0130042 * T) * RAD;
  const lam = vera * RAD;
  const decl = Math.asin(Math.sin(eps) * Math.sin(lam));
  const ar = Math.atan2(Math.cos(eps) * Math.sin(lam), Math.cos(lam));
  return { ...oriz(jd, ar, decl, lat, lon), declinazione: decl * GRADI, longitudine: norm(vera) };
}

/**
 * LA LUNA — i termini principali della sua orbita.
 *
 * ⚠ TRE PERTURBAZIONI, NON UNA. L'orbita della luna è la cosa più
 * disordinata del sistema solare vicino: l'evezione (il Sole che la tira), la
 * variazione e l'equazione annua spostano la sua posizione di gradi interi. Con
 * la sola orbita ellittica la luna sarebbe nel posto sbagliato di un paio di
 * diametri lunari, e le fasi si sfaserebbero di ore.
 */
export function posizioneLuna(data, lat = LUOGO.lat, lon = LUOGO.lon) {
  const jd = giornoGiuliano(data);
  const T = secoli(jd);
  const Lp = norm(218.316 + 481267.8813 * T);          // longitudine media
  const M  = norm(357.5291 + 35999.0503 * T);          // anomalia media del Sole
  const Mp = norm(134.963 + 477198.8676 * T);          // anomalia media della Luna
  const D  = norm(297.8502 + 445267.1115 * T);         // elongazione media
  const F  = norm(93.2721 + 483202.0175 * T);          // argomento di latitudine
  const r = (g) => g * RAD;
  const lung = Lp
    + 6.289 * Math.sin(r(Mp))
    - 1.274 * Math.sin(r(2 * D - Mp))     // evezione
    + 0.658 * Math.sin(r(2 * D))          // variazione
    - 0.186 * Math.sin(r(M))              // equazione annua
    - 0.059 * Math.sin(r(2 * Mp - 2 * D))
    - 0.057 * Math.sin(r(Mp - 2 * D + M));
  const latE = 5.128 * Math.sin(r(F))
    + 0.281 * Math.sin(r(Mp + F))
    - 0.278 * Math.sin(r(F - Mp))
    - 0.173 * Math.sin(r(F - 2 * D));
  const eps = (23.439291 - 0.0130042 * T) * RAD;
  const l = r(lung), b = r(latE);
  // eclittiche → equatoriali
  const decl = Math.asin(Math.sin(b) * Math.cos(eps) + Math.cos(b) * Math.sin(eps) * Math.sin(l));
  const ar = Math.atan2(Math.sin(l) * Math.cos(eps) - Math.tan(b) * Math.sin(eps), Math.cos(l));
  // ⚠ LA FASE È L'ELONGAZIONE, non un conto sui giorni: la frazione illuminata
  // dipende dall'angolo Sole-Terra-Luna, e quell'angolo lo abbiamo già.
  const sole = posizioneSole(data, lat, lon);
  const elong = norm(lung - sole.longitudine);
  return {
    ...oriz(jd, ar, decl, lat, lon),
    declinazione: decl * GRADI,
    longitudine: norm(lung),
    latitudine: latE,
    elongazione: elong,
    /** 0 = luna nuova, 0,5 = piena, 1 = nuova di nuovo. */
    fase: elong / 360,
    /** Quanta ne è illuminata, 0..1. */
    illuminata: (1 - Math.cos(elong * RAD)) / 2,
  };
}

/**
 * DA COORDINATE CELESTI A «dove guardare»: altezza sull'orizzonte e azimut.
 *
 * ⚠ QUI ENTRA IL LUOGO, ed è l'unico punto in cui entra. Il sole sta dov'è per
 * tutti; è la LATITUDINE a decidere quanto lo si vede alto, e la LONGITUDINE a
 * decidere a che ora. Tenendo il conto separato, cambiare posto è cambiare due
 * numeri e nient'altro.
 */
function oriz(jd, ar, decl, lat, lon) {
  // tempo siderale di Greenwich: di quanto ha girato la Terra
  const T = secoli(jd);
  const gmst = norm(280.46061837 + 360.98564736629 * (jd - 2451545)
    + 0.000387933 * T * T - T * T * T / 38710000);
  const oraAngolo = (gmst + lon - ar * GRADI) * RAD;
  const la = lat * RAD;
  const alt = Math.asin(Math.sin(la) * Math.sin(decl) + Math.cos(la) * Math.cos(decl) * Math.cos(oraAngolo));
  // ⚠ AZIMUT DA NORD VERSO EST, che è la convenzione astronomica: 0 = nord,
  // 90 = est, 180 = sud. Il segno del seno va girato perché l'angolo orario
  // cresce verso OVEST.
  const az = Math.atan2(-Math.sin(oraAngolo),
    Math.tan(decl) * Math.cos(la) - Math.sin(la) * Math.cos(oraAngolo));
  return { altezza: alt * GRADI, azimut: norm(az * GRADI) };
}

/**
 * IL VERSORE DEL RAGGIO, come lo vuole uno shader: dalla sorgente verso la
 * scena, in coordinate di mondo (x = est, y = alto, z = sud).
 *
 * ⚠ IL SEGNO È GIRATO APPOSTA: `direction` di una luce direzionale punta DOVE
 * VA la luce, non dove sta la sorgente. Sbagliarlo qui darebbe un mondo
 * illuminato dalla parte opposta, e le ombre nella direzione giusta ma il
 * terminatore al contrario — cioè un difetto che sembra due difetti.
 */
export function versoRaggio(altezzaGradi, azimutGradi) {
  const a = altezzaGradi * RAD, z = azimutGradi * RAD;
  // azimut 0 = nord = −z; 90 = est = +x
  const su = Math.sin(a), oriz2 = Math.cos(a);
  return { x: -(oriz2 * Math.sin(z)), y: -su, z: oriz2 * Math.cos(z) };
}

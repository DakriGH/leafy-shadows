// Stagioni e colore del terreno — dalle reference dell'utente:
//  · il verde dell'erba VARIA CON L'ALTEZZA (rampa a 8 quote: chiaro in basso,
//    profondo in alto) così le terrazze si leggono a colpo d'occhio;
//  · 4 stagioni (primavera / estate secca / autunno / inverno) ricolorano erba
//    e FOGLIAME dei modelli FBX: si rimappano in HSL solo i pixel verdi delle
//    texture (i tronchi e gli arredi restano com'erano).
// PREDISPOSIZIONE FUTURA (richiesta utente): override per blocco — stagione
// forzata e "quota colore" scelta dal giocatore. paletteBlocco(tipo, y) è già
// il punto unico di risoluzione: basterà passargli l'override della cella.

// ⚠ NIENTE MOTORE QUI DENTRO. In Leafy-Lantern questo file importava three per
// due sole cose — interpolare un colore e ritingere una texture — e quell'import
// bastava a legare le stagioni al motore grafico. Adesso il colore si interpola
// con otto righe di aritmetica (sotto) e la ritinta del fogliame la chiede alla
// FABBRICA, che è l'unico posto che sa cosa sia una texture.
import { BLOCCHI, defDi } from './blocks.js';

// la fabbrica di resa, iniettata da main: vedi src/motore/fabbrica.js
let _fabbrica = null;
export function collegaFabbrica(f) { _fabbrica = f; }

export const STAGIONI = {
  primavera: {
    nome: 'Primavera', emoji: '🌸',
    // ⚠ LA RAMPA STA ATTORNO AL VERDE DELLE CONCEPT (#5ac650, misurato): prima
    // andava da un verde giallino a uno spento, e a quota 8 il prato era #43943c
    // invece di #5ac650. Otto passi stretti (±8 %), stessa tinta, stessa saturazione.
    erba: [0x66d05a, 0x60cb55, 0x5ac650, 0x54bf4b, 0x4eb847, 0x48b143, 0x43aa3f, 0x3ea33b],
    fogliame: null, // texture originali
  },
  estate: {
    nome: 'Estate secca', emoji: '🌾',
    erba: [0xe5cf7e, 0xddc673, 0xd6bd69, 0xceb35f, 0xc6aa55, 0xbfa14c, 0xb79844, 0xb0903d],
    fogliame: { h: 0.128, sF: 0.72, l: (l) => l * 0.92 + 0.10 },
  },
  autunno: {
    nome: 'Autunno', emoji: '🍂',
    erba: [0xec9d50, 0xe59348, 0xde8941, 0xd77f3a, 0xd07534, 0xc96c2f, 0xc2632b, 0xbb5a27],
    fogliame: { h: 0.045, sF: 1.2, l: (l) => l * 1.05 + 0.09 },
  },
  inverno: {
    nome: 'Inverno', emoji: '❄️',
    erba: [0xf3f7f2, 0xebf1ea, 0xe2ebe3, 0xd9e4dc, 0xcfddd4, 0xc6d6cd, 0xbdd0c7, 0xb4c9c0],
    sabbia: { cima: 0xefe9da, lato: 0xe3dbc6, fondo: 0xd6cdb4 },
    fogliame: { h: 0.42, sF: 0.18, l: (l) => l * 0.38 + 0.58 },
  },
};

let corrente = 'primavera';

export function stagioneCorrente() { return corrente; }

// ---- LE STAGIONI LUNGO L'ANNO ----------------------------------------------
//
// ⚠ SONO ASTRONOMICHE, non da calendario: cominciano agli equinozi e ai
// solstizi, che sono gli stessi giorni in cui il modello del cielo
// (`world/astro.js`) ha la declinazione a zero o al massimo. Tenerle su due
// definizioni diverse vorrebbe dire un mondo che diventa estivo mentre il sole
// dice ancora primavera — e visto che adesso il sole lo calcoliamo davvero,
// quello scarto si vedrebbe.

/** Il giorno dell'anno in cui comincia ogni stagione (anno non bisestile). */
export const INIZIO_STAGIONE = [
  { giorno: 79,  chiave: 'primavera' },   // ~20 marzo, equinozio
  { giorno: 172, chiave: 'estate' },      // ~21 giugno, solstizio
  { giorno: 265, chiave: 'autunno' },     // ~22 settembre, equinozio
  { giorno: 355, chiave: 'inverno' },     // ~21 dicembre, solstizio
];

/**
 * QUANTO DURA IL PASSAGGIO fra una stagione e l'altra, in giorni.
 * ⚠ DUE SETTIMANE, ed è una richiesta esplicita: «vorrei che avvenissero
 * durante 2 settimane tra una stagione e l'altra». Centrate sul confine — una
 * settimana prima e una dopo — perché un passaggio che comincia il giorno
 * esatto del solstizio farebbe arrivare l'estate piena con una settimana di
 * ritardo su sé stessa.
 */
export const GIORNI_PASSAGGIO = 14;

/** Il giorno dell'anno, 0..365. */
export function giornoDellAnno(data) {
  const capodanno = Date.UTC(data.getUTCFullYear(), 0, 1);
  return (data.getTime() - capodanno) / 86400000;
}

/**
 * CHE STAGIONE È, in un punto qualunque dell'anno.
 * @returns `{ da, a, mix }` — con `mix` 0 si è in pieno `da`, con 1 in pieno `a`.
 */
export function stagioneAlGiorno(giorno) {
  const g = ((giorno % 365) + 365) % 365;
  const n = INIZIO_STAGIONE.length;
  const mezzo = GIORNI_PASSAGGIO / 2;

  // ⚠ SI CERCA IL CONFINE PIÙ VICINO NEL TEMPO, avanti O indietro, e questa è
  // la correzione al mio primo tentativo. Là guardavo solo il confine davanti:
  // il giorno DOPO un solstizio la stagione era già cambiata, quindi il confine
  // davanti era a tre mesi di distanza e la seconda metà del passaggio non
  // esisteva. Risultato: mix sempre zero, cioè le stagioni scattavano di colpo
  // — proprio la cosa che le due settimane devono togliere.
  for (let k = 0; k < n; k++) {
    const confine = INIZIO_STAGIONE[k].giorno;
    // distanza CON SEGNO al confine, sul cerchio dell'anno: negativa se è
    // passato, positiva se deve arrivare
    let d = confine - g;
    if (d > 182.5) d -= 365;
    if (d < -182.5) d += 365;
    if (Math.abs(d) >= mezzo) continue;
    const prima = INIZIO_STAGIONE[(k - 1 + n) % n].chiave;
    const dopo = INIZIO_STAGIONE[k].chiave;
    // d = +mezzo → siamo all'inizio della finestra → mix 0
    // d = −mezzo → alla fine → mix 1
    return { da: prima, a: dopo, mix: (mezzo - d) / GIORNI_PASSAGGIO };
  }

  // fuori da ogni finestra: la stagione è quella cominciata per ultima
  let i = n - 1;
  for (let k = 0; k < n; k++) if (INIZIO_STAGIONE[k].giorno <= g) i = k;
  if (g < INIZIO_STAGIONE[0].giorno) i = n - 1;
  const c = INIZIO_STAGIONE[i].chiave;
  return { da: c, a: c, mix: 0 };
}

/**
 * LA MESCOLANZA CORRENTE — due stagioni e quanto pesano.
 *
 * ⚠ STA QUI E NON NEL CHIAMANTE perché `paletteBlocco` è il punto UNICO da cui
 * escono i colori: mettendola qui, l'erba seminata, i colori dei chunk e
 * l'anteprima di un blocco vedono tutti la stessa stagione senza saperne
 * niente. È lo stesso motivo per cui la rampa per quota sta lì.
 */
let mescolanza = null;

export function impostaMescolanza(da, a, mix) {
  if (mix <= 0 || da === a) { corrente = da; mescolanza = null; return; }
  if (mix >= 1) { corrente = a; mescolanza = null; return; }
  corrente = mix < 0.5 ? da : a;      // la «corrente» resta quella dominante
  mescolanza = { da, a, mix };
}

export function mescolanzaCorrente() { return mescolanza; }

/** I colori di un blocco per (tipo, quota). Punto unico: qui entrerà l'override per cella. */
/** Sposta un colore verso un altro di una frazione k (0..1). */
function verso(colore, meta, k) {
  const r = (colore >> 16) & 255, g = (colore >> 8) & 255, b = colore & 255;
  const R = (meta >> 16) & 255, G = (meta >> 8) & 255, B = meta & 255;
  const m = (a, z) => Math.round(a + (z - a) * k);
  return (m(r, R) << 16) | (m(g, G) << 8) | m(b, B);
}

export function paletteBlocco(tipo, y) {
  // ⚠ SE C'È UNA MESCOLANZA, si calcolano le due palette e si fondono. Costa il
  // doppio, ma solo durante i quattordici giorni di passaggio — e in cambio
  // TUTTO segue la stagione dallo stesso punto: erba, chunk, anteprima.
  if (mescolanza) {
    const salva = corrente;
    corrente = mescolanza.da; const A = _paletteSecca(tipo, y);
    corrente = mescolanza.a;  const B = _paletteSecca(tipo, y);
    corrente = salva;
    const k = mescolanza.mix;
    return {
      cima: _fondi(A.cima, B.cima, k),
      lato: _fondi(A.lato, B.lato, k),
      fondo: _fondi(A.fondo, B.fondo, k),
      facce: A.facce,
      orlo: A.orlo != null && B.orlo != null ? _fondi(A.orlo, B.orlo, k) : A.orlo,
    };
  }
  return _paletteSecca(tipo, y);
}

/** ⚠ Interpolazione in sRGB, come `_mescola`: cambiare spazio qui cambierebbe
 *  l'aspetto di tutte le transizioni stagionali a schermo. */
function _fondi(a, b, k) {
  const r = Math.round(((a >> 16) & 255) + (((b >> 16) & 255) - ((a >> 16) & 255)) * k);
  const g = Math.round(((a >> 8) & 255) + (((b >> 8) & 255) - ((a >> 8) & 255)) * k);
  const l = Math.round((a & 255) + ((b & 255) - (a & 255)) * k);
  return (r << 16) | (g << 8) | l;
}

function _paletteSecca(tipo, y) {
  // defDi (non BLOCCHI[tipo]) perché ha il fallback "blocco perduto": un mondo
  // salvato può contenere un blocco custom poi CANCELLATO dall'Officina, e qui
  // destrutturare undefined faceva morire il boot con "Qualcosa è andato storto".
  const def = defDi(tipo);
  const st = STAGIONI[corrente];
  let { cima, lato, fondo } = def;
  if (def.cappello && st.erba && !def.override) {
    // rampa a PING-PONG: la variazione continua a OGNI quota — sale 0..7,
    // scende 7..0, risale… strati adiacenti sempre leggermente diversi.
    // (l'override dell'Officina scavalca la rampa: usa il colore scelto.)
    cima = st.erba[indiceRampa(y, st.erba.length)];
  }
  // REAZIONI dell'Officina: un blocco qualunque può rispondere all'ambiente
  // come fa l'erba. I colori sono cotti nella mesh, quindi qui si può reagire
  // solo a ciò che PROVOCA UN REMESH: stagione e quota. (Il giorno/notte non
  // sta qui: passa dalle luci, che sono uniform e non richiedono ricostruire.)
  if (def.reagisce === 'stagione' && st.erba) {
    const meta = st.erba[indiceRampa(y, st.erba.length)];
    const k = def.reagisceForza ?? 1;
    cima = verso(cima, meta, k); lato = verso(lato, meta, k * 0.45); fondo = verso(fondo, meta, k * 0.3);
  } else if (def.reagisce === 'quota') {
    // più in alto = più chiaro, a ping-pong come l'erba (mai una scala infinita)
    const p = indiceRampa(y, 8) / 7;
    const k = (def.reagisceForza ?? 1) * 0.5;
    const chiaro = (c) => verso(c, 0xffffff, p * k);
    cima = chiaro(cima); lato = chiaro(lato); fondo = chiaro(fondo);
  }
  if (tipo === 'sabbia' && st.sabbia) {
    ({ cima, lato, fondo } = st.sabbia);
  }
  // PITTURA PER FACCIA (Officina): se il blocco ha `facce`, ogni lato ha il suo
  // colore. Resta opzionale: senza, vale il classico cima/lato/fondo.
  // ⚠ L'ORLO del supercubo (la fascia verde sul fianco) segue il colore della cima in stagione: verde cupo in primavera
  return { cima, lato, fondo, facce: def.facce || null, orlo: def.orlo != null ? def.orlo : undefined };
}

// ordine delle facce: +X, -X, +Y(cima), -Y(fondo), +Z, -Z
export const FACCE = [
  { id: 'est',   nome: 'Est  (+X)', asse: 0, segno: 1 },
  { id: 'ovest', nome: 'Ovest (−X)', asse: 0, segno: -1 },
  { id: 'cima',  nome: 'Cima (+Y)', asse: 1, segno: 1 },
  { id: 'fondo', nome: 'Fondo (−Y)', asse: 1, segno: -1 },
  { id: 'sud',   nome: 'Sud  (+Z)', asse: 2, segno: 1 },
  { id: 'nord',  nome: 'Nord (−Z)', asse: 2, segno: -1 },
];

/** Colore della faccia piatta (asse, segno). Ricade sul modello a 3 zone. */
export function coloreFaccia(pal, asse, segno) {
  if (pal.facce) {
    const i = asse * 2 + (segno > 0 ? 0 : 1);
    const c = pal.facce[i];
    if (c !== undefined && c !== null) return c;
  }
  return asse === 1 ? (segno > 0 ? pal.cima : pal.fondo) : pal.lato;
}

/** Indice della rampa a ping-pong per una quota (condiviso con la ritinta). */
export function indiceRampa(y, n = 8) {
  const ciclo = (n - 1) * 2;
  let i = ((Math.round(y) % ciclo) + ciclo) % ciclo;
  if (i >= n) i = ciclo - i;
  return i;
}

/**
 * IL COLORE DELLA RAMPA, MA PIÙ CHIARO DI QUALCHE GRADINO.
 *
 * Serve alla punta dei fili d'erba, e la richiesta è precisa: «una sfumatura
 * leggera dal blocco di partenza a un livello o 2 più chiaro — gli strati di
 * erba cambiano leggermente tonalità a seconda dell'altezza». Cioè la punta non
 * è un verde inventato: è il verde che il TERRENO stesso avrebbe uno o due
 * gradini più su nella rampa stagionale.
 *
 * ⚠ NON BASTA GUARDARE `y + 2`. La rampa è a PING-PONG (indiceRampa): salendo
 * di quota l'indice sale fino a 7 e poi RITORNA indietro, quindi due blocchi
 * più in alto a volte è più chiaro e a volte è più scuro. Qui si sposta
 * l'INDICE, non la quota: `gradini` verso lo 0, che è l'estremo chiaro della
 * rampa. Così la punta è più chiara sempre, a qualunque quota.
 *
 * Per i blocchi senza cappello d'erba (non ne crescono ciuffi, ma i posati a
 * mano sì) si torna al colore della cima: meglio nessuna sfumatura che una
 * inventata.
 */
export function coloreRampaChiaro(tipo, y, gradini = 2) {
  const def = defDi(tipo);
  const st = STAGIONI[corrente];
  if (!(def.cappello && st.erba && !def.override)) return paletteBlocco(tipo, y).cima;
  const i = indiceRampa(y, st.erba.length);
  return st.erba[Math.max(0, i - gradini)];
}

/** Cambia stagione (ritinge anche il fogliame). Ritorna true se qualcosa è cambiato. */
export function impostaStagione(chiave, forza = false) {
  if (!STAGIONI[chiave]) return false;
  if (chiave === corrente && !forza) return false;
  corrente = chiave;
  transizione = null;
  ritingiFogliame();
  return true;
}

// ---- transizione SMOOTH -----------------------------------------------------
// L'erba scivola da una palette all'altra riscrivendo i colori marcati nel
// mesher (ritintaErba): niente remesh a scatto. Il fogliame FBX cambia a metà
// strada; la sabbia invernale (geometria uguale, solo colore baked) richiede
// un remesh singolo alla FINE (info.remesh).

let transizione = null;
/** Interpolazione fra due colori esadecimali, in [0..1] per canale.
 *  ⚠ SI MESCOLA IN sRGB, come faceva THREE.Color.lerp senza gestione colore:
 *  cambiare spazio qui cambierebbe la transizione stagionale a schermo. */
function _mescola(hexA, hexB, k) {
  const a = [(hexA >> 16) & 255, (hexA >> 8) & 255, hexA & 255];
  const b = [(hexB >> 16) & 255, (hexB >> 8) & 255, hexB & 255];
  return { r: (a[0] + (b[0] - a[0]) * k) / 255,
           g: (a[1] + (b[1] - a[1]) * k) / 255,
           b: (a[2] + (b[2] - a[2]) * k) / 255 };
}

export function avviaTransizione(chiave, durata = 4) {
  if (!STAGIONI[chiave] || chiave === corrente || transizione) return false;
  transizione = { da: corrente, a: chiave, t: 0, durata, fogliameFatto: false };
  return true;
}

export function transizioneInCorso() { return !!transizione; }

/** Da chiamare nel loop. Ritorna null, o { colorePer, fine, remesh }. */
export function aggiornaTransizione(dt) {
  if (!transizione) return null;
  transizione.t += dt / transizione.durata;
  const t = Math.min(1, transizione.t);
  const mix = t * t * (3 - 2 * t);
  const A = STAGIONI[transizione.da].erba, B = STAGIONI[transizione.a].erba;
  const memo = new Map();
  const colorePer = (y) => {
    let c = memo.get(y);
    if (!c) {
      const i = indiceRampa(y);
      c = _mescola(A[i], B[i], mix);
      memo.set(y, c);
    }
    return c;
  };
  const info = { colorePer, fine: false, remesh: false };
  if (mix >= 0.5 && !transizione.fogliameFatto) {
    transizione.fogliameFatto = true;
    ritingiFogliame(transizione.a);
  }
  if (t >= 1) {
    info.fine = true;
    info.remesh = transizione.a === 'inverno' || transizione.da === 'inverno';   // sabbia
    corrente = transizione.a;
    transizione = null;
  }
  return info;
}

// ---- remap del fogliame nelle texture ---------------------------------------

function rgbAHsl(r, g, b) {
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
  else if (max === g) h = ((b - r) / d + 2) / 6;
  else h = ((r - g) / d + 4) / 6;
  return [h, s, l];
}

function hslARgb(h, s, l) {
  if (s === 0) return [l, l, l];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
  const p = 2 * l - q;
  const f = (t) => {
    t = ((t % 1) + 1) % 1;
    if (t < 1 / 6) return p + (q - p) * 6 * t;
    if (t < 1 / 2) return q;
    if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
    return p;
  };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
}

const eVerde = (h, s) => h >= 0.16 && h <= 0.47 && s > 0.12;

function texturePer(materiale, chiave) {
  const st = STAGIONI[chiave];
  if (!st.fogliame) return materiale.userData.mapOriginale;

  const cache = (materiale.userData.stagioniCache ||= {});
  if (cache[chiave]) return cache[chiave];

  const img = materiale.userData.mapOriginale && materiale.userData.mapOriginale.image;
  if (!img || !(img.complete === undefined || img.complete) || !(img.naturalWidth || img.width)) return null;

  try {
    const w = img.naturalWidth || img.width, h = img.naturalHeight || img.height;
    const canvas = document.createElement('canvas');
    canvas.width = w; canvas.height = h;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dati = ctx.getImageData(0, 0, w, h);
    const px = dati.data;
    const F = st.fogliame;
    for (let i = 0; i < px.length; i += 4) {
      const [hh, ss, ll] = rgbAHsl(px[i] / 255, px[i + 1] / 255, px[i + 2] / 255);
      if (!eVerde(hh, ss)) continue;
      const [r, g, b] = hslARgb(F.h, Math.min(1, ss * F.sF), Math.max(0, Math.min(1, F.l(ll))));
      px[i] = r * 255; px[i + 1] = g * 255; px[i + 2] = b * 255;
    }
    ctx.putImageData(dati, 0, 0);
    // ⚠ IL RIMAPPAGGIO HSL RESTA QUI (è matematica pura e vale su ogni motore);
    // la TEXTURE la fabbrica il motore. Era l'unico altro punto in cui `world/`
    // sapeva che esistesse three.
    const tex = _fabbrica.texturaDaCanvas(canvas);
    cache[chiave] = tex;
    return tex;
  } catch (e) {
    console.warn('[lantern] remap stagionale fallito su una texture', e);
    return null;
  }
}

export function ritingiFogliame(chiave = corrente) {
  if (!_fabbrica) return;          // niente modelli caricati: niente da ritingere
  for (const m of _fabbrica.materialiConMappa()) {
    const tex = texturePer(m, chiave);
    if (tex) _fabbrica.cambiaMappa(m, tex);
  }
}

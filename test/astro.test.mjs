// L'ASTRONOMIA SI PROVA CONTRO VALORI NOTI, ed è il caso più bello per una
// prova automatica: non c'è nessun giudizio da dare, c'è un numero che o torna
// o non torna. L'altezza del sole a mezzogiorno al solstizio VALE
// 90° − latitudine + 23,44°, e non è un'opinione.
import test from 'node:test';
import assert from 'node:assert/strict';
import { posizioneSole, posizioneLuna, versoRaggio, giornoGiuliano, LUOGO } from '../src/world/astro.js';

const vicino = (a, b, tol, che) => assert.ok(Math.abs(a - b) <= tol,
  `${che}: ${a.toFixed(3)} invece di ${b.toFixed(3)} (tolleranza ${tol})`);

/** Mezzogiorno SOLARE vero al meridiano del luogo, in UTC. */
function mezzogiorno(anno, mese, giorno, lon = LUOGO.lon) {
  // il sole culmina quando l'ora locale vera è 12: in UTC è 12 − lon/15
  return new Date(Date.UTC(anno, mese - 1, giorno, 12, 0, 0) - (lon / 15) * 3600000);
}

test('il giorno giuliano parte dove deve', () => {
  // ⚠ IL VALORE DI RIFERIMENTO: il 1° gennaio 2000 a mezzogiorno UTC è
  // 2451545,0 per definizione. Se sbaglia questo, sbaglia tutto il resto.
  vicino(giornoGiuliano(new Date(Date.UTC(2000, 0, 1, 12, 0, 0))), 2451545, 1e-6, 'J2000');
});

test('al solstizio d\'estate il sole culmina a 90 − lat + 23,44', () => {
  const s = posizioneSole(mezzogiorno(2024, 6, 21), 43, 12.5);
  vicino(s.altezza, 90 - 43 + 23.44, 0.4, 'altezza al solstizio d\'estate');
  vicino(s.declinazione, 23.44, 0.1, 'declinazione');
});

test('al solstizio d\'inverno culmina a 90 − lat − 23,44', () => {
  const s = posizioneSole(mezzogiorno(2024, 12, 21), 43, 12.5);
  vicino(s.altezza, 90 - 43 - 23.44, 0.4, 'altezza al solstizio d\'inverno');
  vicino(s.declinazione, -23.44, 0.1, 'declinazione');
});

test('agli equinozi la declinazione è zero e il sole culmina a 90 − lat', () => {
  for (const [m, g] of [[3, 20], [9, 22]]) {
    const s = posizioneSole(mezzogiorno(2024, m, g), 43, 12.5);
    vicino(s.declinazione, 0, 0.6, `declinazione il ${g}/${m}`);
    vicino(s.altezza, 90 - 43, 0.7, `altezza il ${g}/${m}`);
  }
});

test('a mezzogiorno, alle nostre latitudini, il sole sta a SUD', () => {
  // ⚠ È LA PROVA CHE PRENDE UN AZIMUT SPECCHIATO, che è l'errore di segno più
  // facile da fare in tutto questo file — e a schermo si vedrebbe come ombre
  // che cadono dalla parte sbagliata, cioè come «non so, sembra strano».
  const s = posizioneSole(mezzogiorno(2024, 6, 21), 43, 12.5);
  vicino(s.azimut, 180, 2, 'azimut a mezzogiorno (180 = sud)');
});

test('all\'equinozio il sole sorge a EST', () => {
  // sei ore prima del mezzogiorno solare
  const t = new Date(mezzogiorno(2024, 3, 20).getTime() - 6 * 3600000);
  const s = posizioneSole(t, 43, 12.5);
  vicino(s.altezza, 0, 2.5, 'altezza al sorgere');
  vicino(s.azimut, 90, 3, 'azimut al sorgere (90 = est)');
});

test('d\'estate il giorno è più lungo che d\'inverno', () => {
  // ⚠ NON SI CONTA UN'ORA: si conta quante ORE il sole sta sopra l'orizzonte.
  // È la conseguenza che il giocatore VEDE, e viene gratis se la declinazione
  // è giusta — quindi provarla prova la catena intera.
  const oreDiLuce = (mese, giorno) => {
    let n = 0;
    for (let h = 0; h < 24 * 4; h++) {
      const t = new Date(Date.UTC(2024, mese - 1, giorno, 0, 0, 0) + h * 15 * 60000);
      if (posizioneSole(t, 43, 12.5).altezza > 0) n++;
    }
    return n / 4;
  };
  const estate = oreDiLuce(6, 21), inverno = oreDiLuce(12, 21);
  assert.ok(estate > 15, 'a giugno a 43° di latitudine il giorno dura più di 15 ore: ' + estate);
  assert.ok(inverno < 9.5, 'a dicembre meno di 9 ore e mezza: ' + inverno);
  assert.ok(estate - inverno > 5.5, 'e la differenza fra i due è più di cinque ore e mezza');
});

test('la luna torna nuova ogni 29,53 giorni', () => {
  // ⚠ IL MESE SINODICO È IL CONTROLLO GLOBALE della luna: se i termini
  // dell'orbita sono sbagliati, il periodo esce storto. 29,530589 giorni.
  const nuove = [];
  let prima = null;
  for (let g = 0; g < 200 * 24; g++) {
    const t = new Date(Date.UTC(2024, 0, 1) + g * 3600000);
    const f = posizioneLuna(t).fase;
    if (prima !== null && f < prima) nuove.push(g / 24);   // la fase è tornata a zero
    prima = f;
  }
  assert.ok(nuove.length >= 5, 'in duecento giorni ci devono stare almeno cinque lune nuove');
  const periodi = nuove.slice(1).map((v, i) => v - nuove[i]);
  const medio = periodi.reduce((a, b) => a + b) / periodi.length;
  vicino(medio, 29.53, 0.35, 'mese sinodico');
});

test('a luna piena la luna è illuminata, a luna nuova no', () => {
  for (let g = 0; g < 40 * 24; g++) {
    const t = new Date(Date.UTC(2024, 0, 1) + g * 3600000);
    const l = posizioneLuna(t);
    if (Math.abs(l.fase - 0.5) < 0.004) { vicino(l.illuminata, 1, 0.02, 'piena'); }
    if (l.fase < 0.004) { vicino(l.illuminata, 0, 0.02, 'nuova'); }
  }
});

test('a luna piena la luna sta dalla parte opposta al sole', () => {
  // ⚠ È LA VERIFICA INCROCIATA fra i due modelli: se sole e luna fossero
  // calcolati in convenzioni diverse, questa sarebbe l'unica prova a
  // accorgersene — e a schermo si vedrebbe come una luna che sorge di giorno.
  for (let g = 0; g < 40 * 24; g++) {
    const t = new Date(Date.UTC(2024, 0, 1) + g * 3600000);
    const l = posizioneLuna(t);
    if (Math.abs(l.fase - 0.5) > 0.003) continue;
    const s = posizioneSole(t);
    // con la luna piena, quando il sole è sotto l'orizzonte la luna è sopra
    if (s.altezza < -10) assert.ok(l.altezza > -25, 'luna piena e sole basso: ' + l.altezza.toFixed(1));
    break;
  }
});

test('le eclissi CAPITANO: ogni tanto sole e luna coincidono', () => {
  // ⚠ NON C'È NIENTE DI PROGRAMMATO. Un'eclissi è il momento in cui le due
  // posizioni coincidono, e con due modelli veri capita da sola. Questa prova
  // non chiede la data esatta — il modello della luna è a 0,3° e non la
  // saprebbe — chiede che il fenomeno ESISTA e sia raro.
  let vicini = 0, campioni = 0;
  for (let g = 0; g < 365 * 6; g++) {
    const t = new Date(Date.UTC(2024, 0, 1) + g * 6 * 3600000);
    const s = posizioneSole(t), l = posizioneLuna(t);
    campioni++;
    const d = Math.hypot(s.azimut - l.azimut, s.altezza - l.altezza);
    if (d < 1.5) vicini++;
  }
  assert.ok(vicini > 0, 'in un anno un allineamento stretto deve capitare almeno una volta');
  assert.ok(vicini / campioni < 0.02, 'ma deve restare raro, se no non è un\'eclissi');
});

test('il versore del raggio punta VERSO la scena, non verso il sole', () => {
  // ⚠ IL SEGNO PIÙ FACILE DA SBAGLIARE: `direction` di una luce direzionale
  // dice dove VA la luce. Col sole allo zenit la luce va in GIÙ.
  const v = versoRaggio(90, 180);
  vicino(v.y, -1, 1e-6, 'sole allo zenit: la luce scende');
  // sole a est all'orizzonte: la luce va verso ovest, cioè −x
  const e = versoRaggio(0, 90);
  vicino(e.x, -1, 1e-6, 'sole a est: la luce va verso ovest');
  vicino(e.y, 0, 1e-6, 'e non scende');
});

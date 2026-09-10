// IL GALLEGGIAMENTO — «le cose in acqua rimbalzano dopo un po' in modo
// glitchoso».
//
// ⚠ È IL CASO CHE SI PROVA IN NODE E NON A SCHERMO: un ciclo che non si spegne
// si vede solo guardando a lungo, e a schermo «a lungo» vuol dire aspettare.
// Qui si simulano dieci secondi in un millisecondo e si guarda il numero.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Corpi, PASSO } from '../src/partita/corpi.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';

registraDecorazioni();

/** Un laghetto: solido sotto y=0, acqua da 0 a 5, aria sopra. */
const lago = {
  solido(x, y, z) { return y < 0; },
  tipo(x, y, z) { if (y < 0) return 'pietra'; return y <= 5 ? 'acqua' : null; },
};

function simula(secondi, c, corpi) {
  const quote = [];
  for (let i = 0; i < Math.round(secondi / PASSO); i++) { corpi.avanza(PASSO); quote.push(c.y); }
  return quote;
}

test('un corpo lasciato cadere in acqua SI ASSESTA e smette di muoversi', () => {
  const corpi = new Corpi(lago);
  const c = corpi.aggiungi({ x: 0.5, y: 12, z: 0.5, lato: 0.5 });
  const quote = simula(14, c, corpi);

  // negli ultimi tre secondi non deve muoversi più di un millimetro
  const coda = quote.slice(-Math.round(3 / PASSO));
  const oscillazione = Math.max(...coda) - Math.min(...coda);
  assert.ok(oscillazione < 0.01, `oscilla ancora di ${oscillazione.toFixed(4)} blocchi dopo undici secondi`);
  assert.equal(c.dorme, true, 'un corpo fermo sul pelo deve addormentarsi, se no resta sveglio per sempre');
});

test('e si ferma AL PELO, con una parte fuori: non affonda e non schizza via', () => {
  const corpi = new Corpi(lago);
  const c = corpi.aggiungi({ x: 0.5, y: 12, z: 0.5, lato: 0.5 });
  simula(14, c, corpi);
  const pelo = 5 + 15 / 16;          // world/pelo.js: il pelo sta sotto il bordo della cella
  const m = 0.25;
  const sotto = (pelo - (c.y - m)) / (2 * m);
  assert.ok(sotto > 0.25 && sotto < 0.65, `galleggia con ${(sotto * 100).toFixed(0)} % di sé sott'acqua: fuori scala`);
  assert.ok(c.y < pelo + m, 'è saltato fuori dall\'acqua');
  assert.ok(c.y > pelo - m * 2, 'è affondato');
});

test('IL CICLO NON SI MANTIENE DA SOLO: il corpo smette di cambiare verso', () => {
  // ⚠ QUESTA PROVA È STATA RIFATTA PERCHÉ LA PRIMA ERA DEBOLE, e vale la pena
  // dirlo: misurava l'AMPIEZZA in due finestre, e col difetto in piedi passava
  // lo stesso — l'attrito l'ampiezza la riduceva, semplicemente non arrivava
  // mai a zero. Il segno vero del difetto non è quanto ampio sia il rimbalzo:
  // è che il corpo continua a CAMBIARE VERSO all'infinito. Un corpo assestato
  // non inverte più; uno in ciclo inverte a ogni giro, per sempre.
  //
  // ⚠ E il modo di saperlo è stato rimettere il difetto e rilanciare: una
  // prova che non si è mai vista fallire non è una prova, è una speranza.
  const corpi = new Corpi(lago);
  const c = corpi.aggiungi({ x: 0.5, y: 12, z: 0.5, lato: 0.5 });
  const versi = [];
  for (let i = 0; i < Math.round(16 / PASSO); i++) { corpi.avanza(PASSO); versi.push(Math.sign(c.vy)); }
  const coda = versi.slice(-Math.round(5 / PASSO));
  let inversioni = 0;
  for (let i = 1; i < coda.length; i++) if (coda[i] !== 0 && coda[i - 1] !== 0 && coda[i] !== coda[i - 1]) inversioni++;
  assert.ok(inversioni <= 1, `negli ultimi cinque secondi ha cambiato verso ${inversioni} volte: il ciclo non si spegne`);
});

test('fuori dall\'acqua non cambia niente: cade e si posa a terra', () => {
  const secco = { solido(x, y, z) { return y < 0; }, tipo(x, y, z) { return y < 0 ? 'pietra' : null; } };
  const corpi = new Corpi(secco);
  const c = corpi.aggiungi({ x: 0.5, y: 8, z: 0.5, lato: 0.5 });
  simula(6, c, corpi);
  assert.equal(c.inAcqua, false);
  assert.ok(Math.abs(c.y - 0.25) < 0.02, `si è posato a ${c.y}, non a 0,25`);
});

test('un mondo senza `tipo` (le prove vecchie) non si accorge di niente', () => {
  const finto = { solido(x, y, z) { return y < 0; } };
  const corpi = new Corpi(finto);
  const c = corpi.aggiungi({ x: 0.5, y: 4, z: 0.5, lato: 0.5 });
  simula(4, c, corpi);
  assert.equal(c.inAcqua, false);
  assert.ok(Math.abs(c.y - 0.25) < 0.02);
});

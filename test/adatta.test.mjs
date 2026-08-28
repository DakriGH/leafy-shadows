// LA SCALA DI QUALITÀ SI PROVA IN NODE, e non è un vezzo: la parte difficile
// non è applicare un livello, è decidere quando. L'unico modo di provarla a
// schermo sarebbe far scaldare una GPU per venti minuti sperando che oscilli.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Adattatore, ATTESA_CAMBIO, ATTESA_AVVIO, CAMPIONI_GIU, CAMPIONI_SU, RIPROVA_MS } from '../src/gioco/adatta.js';

/** Dà `n` misure a `fps`, un secondo l'una, e torna i cambi di livello. */
function corri(a, fps, n, t0 = ATTESA_AVVIO, passo = ATTESA_CAMBIO + 100) {
  const cambi = [];
  for (let i = 0; i < n; i++) {
    const v = a.osserva(fps, t0 + i * passo);
    if (v >= 0) cambi.push({ a: v, quando: t0 + i * passo });
  }
  return cambi;
}

test('a sessanta fps stabili non si muove', () => {
  const a = new Adattatore({ quanti: 5, hz: 60 });
  assert.equal(corri(a, 60, 30).length, 0);
  assert.equal(a.livello, 0);
});

test('sotto la soglia scende, un gradino per volta', () => {
  const a = new Adattatore({ quanti: 5, hz: 60 });
  const cambi = corri(a, 10, CAMPIONI_GIU * 5);
  assert.equal(cambi[0].a, 1, 'il primo cambio porta al livello 1');
  assert.ok(cambi.every((c, i) => c.a === i + 1), 'e poi uno alla volta');
  assert.equal(a.livello, 4, 'fino in fondo, e non oltre');
  assert.equal(corri(a, 10, 20).length, 0, 'in fondo alla scala non scende più');
});

test('non scende più spesso dell\'attesa: la scena deve assestarsi', () => {
  const a = new Adattatore({ quanti: 5, hz: 60 });
  // ⚠ MISURE FITTE: senza l'attesa, tre misure a 10 ms l'una farebbero
  // precipitare la scala fino in fondo prima che il primo gradino abbia avuto
  // il tempo di fare effetto.
  const cambi = corri(a, 10, 60, ATTESA_AVVIO, 10);
  assert.equal(cambi.length, 1, 'un solo gradino in 600 ms');
});

test('su uno schermo a 144 Hz il bersaglio resta 60', () => {
  // ⚠ È LA CORREZIONE CHE CONTA: puntando al tetto del pannello non ci si
  // arriva mai, e la qualità scenderebbe per sempre su una macchina che va
  // benissimo.
  const a = new Adattatore({ quanti: 5, hz: 144 });
  assert.equal(a.bersaglio, 60);
  assert.equal(corri(a, 62, 40).length, 0, 'a 62 fps non deve scendere');
  assert.ok(a.sogliaGiu <= 30);
});

test('a 58 su 60 si risale lo stesso: la sincronia verticale non dà il tetto esatto', () => {
  const a = new Adattatore({ quanti: 5, livello: 2, hz: 60 });
  const cambi = corri(a, 58, CAMPIONI_SU + 2);
  assert.ok(cambi.length >= 1, 'con la soglia a 60 esatti non risalirebbe mai');
  assert.equal(cambi[0].a, 1);
});

test('risalire costa più misure che scendere', () => {
  assert.ok(CAMPIONI_SU > CAMPIONI_GIU, 'chi soffre deve smettere subito; risalire è una scommessa');
});

test('il gradino che non ha retto non si riprova subito', () => {
  // ⚠ LA PROVA DELL'OSCILLAZIONE, che è il difetto nato insieme alla cura.
  const a = new Adattatore({ quanti: 5, hz: 60 });
  let t = ATTESA_AVVIO;
  const passo = ATTESA_CAMBIO + 100;
  // va male: scende a 1
  for (let i = 0; i < CAMPIONI_GIU; i++) { a.osserva(10, t); t += passo; }
  assert.equal(a.livello, 1);
  // ora va bene: dovrebbe voler risalire a 0, ma 0 è il gradino che ha fallito.
  // ⚠ E IL CICLO DEVE STARE DENTRO IL MINUTO: la prima stesura ne faceva 24 da
  // 2,6 s l'uno, cioè 62 secondi — sforava la finestra e vedeva la risalita
  // LEGITTIMA scambiandola per il difetto. La prova era sbagliata, non il codice.
  const giri = Math.floor((RIPROVA_MS * 0.9) / passo);
  let risalito = false;
  for (let i = 0; i < giri; i++) { if (a.osserva(60, t) >= 0) risalito = true; t += passo; }
  assert.equal(risalito, false, 'entro il minuto non deve riprovare il gradino fallito');
  assert.equal(a.livello, 1);
  // passato il minuto, si riprova: la scena può essere cambiata
  t += RIPROVA_MS;
  let poi = false;
  for (let i = 0; i < CAMPIONI_SU + 2; i++) { if (a.osserva(60, t) >= 0) poi = true; t += passo; }
  assert.equal(poi, true, 'dopo il minuto sì');
  assert.equal(a.livello, 0);
});

test('in mezzo alle due soglie i contatori si azzerano', () => {
  // ⚠ SENZA QUESTO la scala «ricorda» misure vecchie: dieci fotogrammi lenti
  // sparsi in un minuto sommerebbero fino a far scendere una macchina sana.
  const a = new Adattatore({ quanti: 5, hz: 60 });
  let t = ATTESA_AVVIO; const passo = ATTESA_CAMBIO + 100;
  for (let i = 0; i < CAMPIONI_GIU - 1; i++) { a.osserva(10, t); t += passo; }
  a.osserva(45, t); t += passo;                      // né su né giù
  for (let i = 0; i < CAMPIONI_GIU - 1; i++) { a.osserva(10, t); t += passo; }
  assert.equal(a.livello, 0, 'due volte «quasi» non fanno un cambio');
});

test('fissato a mano, non si muove più da solo', () => {
  const a = new Adattatore({ quanti: 5, hz: 60 });
  a.fissa(3);
  assert.equal(a.livello, 3);
  assert.equal(corri(a, 5, 40).length, 0);
  assert.equal(a.livello, 3);
  a.libera();
  assert.ok(corri(a, 5, 40).length > 0, 'liberata, riprende');
});

test('fissare fuori scala non esce dai limiti', () => {
  const a = new Adattatore({ quanti: 5 });
  assert.equal(a.fissa(99), 4);
  assert.equal(a.fissa(-3), 0);
});

test("i primi secondi non si giudicano: all'avvio tutto singhiozza", () => {
  // ⚠ MISURATO SUL GIOCO VERO: worldgen 44 ms, mesh 456 ms, più la
  // compilazione degli shader e la prima semina dell'erba. Guardando lì dentro
  // la scala precipiterebbe in fondo su QUALUNQUE macchina, e ci resterebbe un
  // minuto per via della memoria del gradino fallito.
  const a = new Adattatore({ quanti: 5, hz: 60 });
  let cambi = 0;
  for (let t = 0; t < ATTESA_AVVIO; t += 100) if (a.osserva(3, t) >= 0) cambi++;
  assert.equal(cambi, 0, "durante l'avvio non deve decidere niente");
  assert.equal(a.livello, 0);
  // e subito dopo sì
  let dopo = 0;
  for (let i = 0; i < CAMPIONI_GIU; i++) if (a.osserva(3, ATTESA_AVVIO + i * (ATTESA_CAMBIO + 100)) >= 0) dopo++;
  assert.equal(dopo, 1);
});

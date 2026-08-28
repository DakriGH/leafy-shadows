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

test('con un calo LIEVE scende un gradino per volta', () => {
  // ⚠ 28 fps su 60: sotto soglia ma sopra la riga del crollo (24). Qui la
  // prudenza deve restare — scendere di tre gradini per un rallentamento
  // passeggero è il difetto opposto a quello che la scala cura.
  const a = new Adattatore({ quanti: 5, hz: 60 });
  const cambi = corri(a, 28, CAMPIONI_GIU * 6);
  assert.equal(cambi[0].a, 1, 'il primo cambio porta al livello 1');
  assert.ok(cambi.every((c, i) => c.a === i + 1), 'e poi uno alla volta');
  assert.equal(a.livello, 4, 'fino in fondo, e non oltre');
  assert.equal(corri(a, 28, 20).length, 0, 'in fondo alla scala non scende più');
});

test('non scende più spesso dell\'attesa: la scena deve assestarsi', () => {
  const a = new Adattatore({ quanti: 5, hz: 60 });
  // ⚠ MISURE FITTE: senza l'attesa, tre misure a 10 ms l'una farebbero
  // precipitare la scala fino in fondo prima che il primo gradino abbia avuto
  // il tempo di fare effetto.
  // ⚠ L'ATTESA È FRA DUE CAMBI, NON FRA DUE MISURE, e la distinzione conta: le
  // prime tre misure ravvicinate un gradino lo fanno scendere (ed è giusto,
  // sono tre misure sotto soglia), ma da lì in poi il cronometro le blocca. Il
  // difetto che questa prova presidia è la CASCATA — sessanta misure a dieci
  // millisecondi che precipitano fino in fondo prima che il primo gradino abbia
  // fatto effetto.
  const cambi = corri(a, 28, 60, ATTESA_AVVIO, 10);
  assert.equal(cambi.length, 1, 'un solo gradino in 600 ms, non cinque');
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
  // va male, ma non malissimo: scende di uno
  for (let i = 0; i < CAMPIONI_GIU; i++) { a.osserva(28, t); t += passo; }
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
  for (let i = 0; i < CAMPIONI_GIU - 1; i++) { a.osserva(28, t); t += passo; }
  a.osserva(45, t); t += passo;                      // né su né giù
  for (let i = 0; i < CAMPIONI_GIU - 1; i++) { a.osserva(28, t); t += passo; }
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
  // e subito dopo sì — e a tre fotogrammi al secondo basta UNA misura
  assert.ok(a.osserva(3, ATTESA_AVVIO) >= 0, 'passato l\'avvio deve reagire subito');
});

test('a fps disastrosi scende subito e di più gradini', () => {
  // ⚠ È IL DIFETTO CHE IL COMMITTENTE HA FOTOGRAFATO: 23 fps sul telefono e la
  // qualità ferma a q1 su cinque. Ogni gradino costava tre misure a 2,5 s
  // l'una — trentasette secondi per arrivare in fondo, che nessuno aspetta.
  const a = new Adattatore({ quanti: 6, hz: 60 });
  const primo = a.osserva(23, ATTESA_AVVIO);
  assert.ok(primo >= 2, 'a 23 fps su 60 deve saltare almeno due gradini, non uno: ' + primo);
  // ⚠ E IL NUMERO CHE CONTA È IL TEMPO: sei gradini saltandone due, tre misure
  // a 2,5 s l'una fanno sette secondi e mezzo invece di trentasette.
  let t = ATTESA_AVVIO + ATTESA_CAMBIO + 100;
  a.osserva(23, t); t += ATTESA_CAMBIO + 100;
  a.osserva(23, t);
  assert.equal(a.livello, 5, 'tre misure devono bastare per arrivare in fondo');
});

test('ma un calo lieve resta prudente', () => {
  // ⚠ IL DIFETTO OPPOSTO: scendere per un singhiozzo. A 28 fps su 60 si è sotto
  // soglia ma non in crollo, quindi servono tre misure e si scende di UNO.
  const a = new Adattatore({ quanti: 6, hz: 60 });
  let t = ATTESA_AVVIO;
  assert.equal(a.osserva(28, t), -1, 'la prima misura non deve bastare');
  t += ATTESA_CAMBIO + 100;
  assert.equal(a.osserva(28, t), -1);
  t += ATTESA_CAMBIO + 100;
  assert.equal(a.osserva(28, t), 1, 'alla terza scende, di un gradino solo');
});

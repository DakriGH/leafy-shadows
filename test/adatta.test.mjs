// LA SCALA DI QUALITÀ SI PROVA IN NODE, e non è un vezzo: la parte difficile
// non è applicare un livello, è decidere quando. L'unico modo di provarla a
// schermo sarebbe far scaldare una GPU per venti minuti sperando che oscilli.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Adattatore, ATTESA_CAMBIO, ATTESA_AVVIO, CAMPIONI_GIU, CAMPIONI_SU, RIPROVA_MS,
         RIPROVA_MAX_MS } from '../src/gioco/adatta.js';

/** Dà `n` misure a `fps`, un secondo l'una, e torna i cambi di livello. */
/**
 * ⚠ `fps` PUÒ ESSERE UNA FUNZIONE DEL LIVELLO, e da adesso quasi sempre lo è.
 * Con un numero fisso si modella una macchina su cui abbassare la qualità NON
 * cambia niente — che esiste davvero (vedi la prova sull'Adreno più sotto) ma
 * non è il caso normale, ed è quello in cui la scala adesso RISALE apposta.
 * Una macchina normale guadagna scendendo, e le prove devono dirlo.
 */
function corri(a, fps, n, t0 = ATTESA_AVVIO, passo = ATTESA_CAMBIO + 100) {
  const cambi = [];
  const quanti = typeof fps === 'function' ? fps : () => fps;
  for (let i = 0; i < n; i++) {
    const v = a.osserva(quanti(a.livello), t0 + i * passo);
    if (v >= 0) cambi.push({ a: v, quando: t0 + i * passo });
  }
  return cambi;
}

/** Una macchina normale: ogni gradino giù vale un quarto di fps in più. */
const macchinaNormale = (base) => (livello) => base * Math.pow(1.25, livello);

test('a sessanta fps stabili non si muove', () => {
  const a = new Adattatore({ quanti: 5, hz: 60 });
  assert.equal(corri(a, 60, 30).length, 0);
  assert.equal(a.livello, 0);
});

test('con un calo LIEVE scende un gradino per volta', () => {
  // ⚠ 28 fps su 60: sotto soglia ma sopra la riga del crollo (24). Qui la
  // prudenza deve restare — scendere di tre gradini per un rallentamento
  // passeggero è il difetto opposto a quello che la scala cura.
  // ⚠ E LA MACCHINA DEVE GUADAGNARCI, se no la scala risale — giustamente:
  // scendere senza guadagnare è grafica buttata via (vedi GUADAGNO_MINIMO).
  // ⚠ QUINDI IL CASO «scende fino in fondo» NON È PIÙ ESPRIMIBILE con un
  // guadagno vero: chi guadagna il 10% a gradino arriva nella fascia comoda in
  // due mosse e si ferma lì, che è esattamente quello che deve fare. Quello che
  // questa prova continua a guardare è l'unica cosa che le importava davvero:
  // che scenda UNO ALLA VOLTA invece di tre, perché il calo è lieve.
  const a = new Adattatore({ quanti: 5, hz: 60 });
  const lenta = (livello) => 25 * Math.pow(1.10, livello);
  const cambi = corri(a, lenta, CAMPIONI_GIU * 12);
  assert.ok(cambi.length >= 2, `un solo cambio: ${JSON.stringify(cambi)}`);
  assert.equal(cambi[0].a, 1, 'il primo cambio porta al livello 1');
  assert.equal(cambi[1].a, 2, 'e il secondo al 2: uno alla volta, non tre');
  assert.equal(a.insensibile, false, 'e non si è dichiarata insensibile: guadagnava');
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

// ---------------------------------------------------------------------------
// QUANDO LA SCALA FINISCE LA STRADA.
//
// ⚠ Trovato su una macchina vera: il Chromebook del committente (Intel HD 400
// del 2015, più debole del suo telefono) è sceso fino all'ULTIMO gradino della
// scala desktop e faceva ancora 13 fps. Storia dei livelli: [0, 3, 4]. Da lì in
// poi la scala non poteva più fare niente — e le cose che avrebbero aiutato
// (cammino nei voxel, acqua ricca, MSAA) si compilano nello shader, cioè si
// decidono prima di sapere quanto va la macchina.
// L'unico modo di deciderle bene è ricordarsi com'è andata la volta scorsa,
// e per farlo serve che qualcuno se ne accorga.

test('arrivata in fondo e ancora sotto, la scala si dichiara ARRESA', () => {
  // ⚠ QUI LA MACCHINA GUADAGNA SCENDENDO ma non abbastanza da bastare: è il
  // caso del Chromebook, che è arrivato all'ultimo gradino facendo 13 fps.
  const a = new Adattatore({ quanti: 5, livello: 0, hz: 60 });
  let t = 0;
  assert.equal(a.arresa, false, 'non parte arresa');
  for (let i = 0; i < 40; i++) { t += ATTESA_CAMBIO + 1; a.osserva(10 * Math.pow(1.3, a.livello), t); }
  assert.equal(a.livello, 4, 'deve essere in fondo');
  assert.equal(a.arresa, true);
});

test('ma non si arrende per un singhiozzo solo', () => {
  // ⚠ Un fotogramma lungo mentre si costruisce il mondo non deve condannare una
  // macchina a partire leggera per sempre.
  const a = new Adattatore({ quanti: 5, livello: 4, hz: 60 });
  let t = 0;
  t += ATTESA_CAMBIO + 1; a.osserva(10, t);
  assert.equal(a.arresa, false, 'una misura non basta');
  t += ATTESA_CAMBIO + 1; a.osserva(10, t);
  assert.equal(a.arresa, false, 'nemmeno due');
});

test('e chi sta bene in fondo alla scala non è arreso', () => {
  // sull'ultimo gradino ma con gli fps a posto: è una scelta, non una resa
  const a = new Adattatore({ quanti: 5, livello: 4, hz: 60 });
  let t = 0;
  for (let i = 0; i < 10; i++) { t += ATTESA_CAMBIO + 1; a.osserva(60, t); }
  assert.equal(a.arresa, false);
});

// ---------------------------------------------------------------------------
// LE DUE SOGLIE NON SI POSSONO INVERTIRE.
//
// ⚠ TROVATO SU UNA MACCHINA VERA. Sul Chromebook del committente `misuraHz`
// aveva letto 25 Hz — che era la velocità con cui la MACCHINA disegnava, non
// quella dello schermo. Bersaglio 25 → sogliaSu 23, sogliaGiu 24: invertite.
// Con le soglie invertite ogni singola misura o fa scendere o fa salire, la
// fascia «fermi, si sta bene» sparisce, e la scala pompa senza fermarsi mai:
// storia dei gradini [5,6,5,4,3,2,3,4,5,4,3,2,3,4,5,6,5,4,3,2] — tre giri
// completi in un minuto. Lui l'ha visto come «la grafica è peggiorata di
// molto», e aveva ragione: non era più bassa, era INSTABILE.

test('per QUALUNQUE frequenza, scendere resta sotto il salire', () => {
  // ⚠ Si spazza tutto invece di provare i casi «sensati»: il caso che ha rotto
  // tutto era un 25 che non doveva nemmeno esistere.
  for (let hz = 1; hz <= 300; hz++) {
    const a = new Adattatore({ quanti: 5, hz });
    assert.ok(a.sogliaGiu < a.sogliaSu,
      `hz ${hz}: giù ${a.sogliaGiu.toFixed(1)} non è sotto su ${a.sogliaSu.toFixed(1)}`);
    assert.ok(a.sogliaSu - a.sogliaGiu >= a.margineMinimo - 1e-9,
      `hz ${hz}: fra le due soglie ci sono solo ${(a.sogliaSu - a.sogliaGiu).toFixed(1)} fps`);
  }
});

test('e la fascia in mezzo esiste davvero: si sta fermi', () => {
  const a = new Adattatore({ quanti: 5, hz: 60 });
  const dentro = (a.sogliaGiu + a.sogliaSu) / 2;
  let t = 0;
  for (let i = 0; i < 30; i++) { t += ATTESA_CAMBIO + 1; a.osserva(dentro, t); }
  assert.equal(a.livello, 0, 'con gli fps in mezzo non ci si muove');
});

test('con la frequenza letta storta NON si pompa più', () => {
  // ⚠ La riproduzione esatta del guasto: bersaglio 25, e una macchina che
  // oscilla fra 22 e 28 fps. Prima saliva e scendeva senza fermarsi.
  const a = new Adattatore({ quanti: 7, hz: 25 });
  let t = 0;
  const fps = [22, 28, 23, 27, 24, 26, 22, 28, 25, 23, 27, 24, 26, 22, 28, 25];
  const visti = [];
  for (let g = 0; g < 6; g++) {
    for (const f of fps) { t += ATTESA_CAMBIO + 1; if (a.osserva(f, t) >= 0) visti.push(a.livello); }
  }
  // ⚠ SCENDERE VA BENE — la macchina è lenta davvero. Quello che non va bene è
  // scendere E RISALIRE in continuazione: si conta quante volte cambia verso.
  let inversioni = 0;
  for (let i = 2; i < visti.length; i++) {
    const p = Math.sign(visti[i - 1] - visti[i - 2]), q = Math.sign(visti[i] - visti[i - 1]);
    if (p !== 0 && q !== 0 && p !== q) inversioni++;
  }
  assert.ok(inversioni <= 2, `la scala ha cambiato verso ${inversioni} volte: ${visti.join(',')}`);
});

// ---------------------------------------------------------------------------
// SCENDERE È UN'IPOTESI, E VA VERIFICATA.
//
// ⚠ Da un rapporto vero, Adreno 619: storia dei gradini [0,3,4,3,2,1,0,1,2,3] e
// storia degli fps 25,25,25,25,25,25,… — DIECI cambi di qualità, dal massimo al
// minimo e ritorno, e gli fps fermi a 25. Su quel dispositivo il collo di
// bottiglia era altrove, e abbassare la qualità buttava via grafica in cambio di
// zero. Una scala che non verifica è una scala che spera.

/** La macchina dell'Adreno: qualunque cosa si faccia, sempre quel numero lì. */
const macchinaSorda = (fps) => () => fps;

test('se scendere non serve, si RISALE', () => {
  const a = new Adattatore({ quanti: 7, hz: 60 });
  const cambi = corri(a, macchinaSorda(25), 40);
  assert.ok(cambi.length >= 2, 'deve aver provato a scendere e poi essere risalita');
  assert.equal(a.livello, 0, `è rimasta a ${a.livello}: doveva tornare in cima`);
  assert.equal(a.insensibile, true, 'e deve saperlo, per non riprovare subito');
});

test('e ci riprova sempre più di rado: l\'attesa raddoppia', () => {
  // ⚠ Senza questo la cura diventa il male più lento: con l'attesa fissa a un
  // minuto sono dieci cambi in cinque minuti — `1,0,1,0,1,0,1,0,1,0` — cioè un
  // lampeggio di qualità ogni sessanta secondi, che si vede benissimo.
  const a = new Adattatore({ quanti: 7, hz: 60 });
  const cambi = corri(a, macchinaSorda(25), 400);
  // 400 misure × 2,6 s ≈ 17 minuti: con l'attesa che raddoppia ci stanno
  // dentro cinque buche (1+2+4+8 minuti), non diciassette.
  const buche = cambi.length / 2;
  assert.ok(buche <= 6, `ha provato ${buche} volte in 17 minuti: ${cambi.map(c => c.a).join(',')}`);
  assert.ok(buche >= 2, 'ma qualche volta ci riprova, se no è un «mai più»');
});

test('e una discesa che SERVE azzera il conto delle buche', () => {
  // ⚠ Serve: una sordità passeggera all'avvio — mentre si costruisce il mondo —
  // non deve lasciare un'attesa lunghissima per tutta la partita.
  const a = new Adattatore({ quanti: 7, hz: 60 });
  corri(a, macchinaSorda(25), 20);
  assert.ok(a.attesaRiprova > RIPROVA_MS * 0.9, 'dopo una buca l\'attesa c\'è');
  let t = ATTESA_AVVIO + 20 * (ATTESA_CAMBIO + 100) + RIPROVA_MAX_MS;
  for (let i = 0; i < 30; i++) { t += ATTESA_CAMBIO + 100; a.osserva(20 * Math.pow(1.4, a.livello), t); }
  assert.equal(a.attesaRiprova, RIPROVA_MS, 'e dopo una discesa utile torna al minimo');
});

test('ma dopo un minuto riprova: la scena cambia, il telefono si raffredda', () => {
  const a = new Adattatore({ quanti: 7, hz: 60 });
  corri(a, macchinaSorda(25), 20);
  assert.equal(a.insensibile, true);
  // ⚠ E QUANDO RIPROVA, SE STAVOLTA SERVE, scende e resta giù.
  let t = ATTESA_AVVIO + 20 * (ATTESA_CAMBIO + 100) + RIPROVA_MS + 1000;
  for (let i = 0; i < 30; i++) { t += ATTESA_CAMBIO + 100; a.osserva(25 * Math.pow(1.3, a.livello), t); }
  assert.equal(a.insensibile, false, 'l\'insensibilità deve scadere');
  assert.ok(a.livello > 0, `stavolta scendere serviva, ed è a ${a.livello}`);
});

test('su una macchina normale la verifica non dà fastidio', () => {
  // ⚠ La prova che la cura non rompe il caso comune: chi guadagna davvero
  // scendendo non deve trovarsi risalito per colpa del controllo.
  const a = new Adattatore({ quanti: 7, hz: 60 });
  corri(a, macchinaNormale(20), 60);
  assert.ok(a.livello >= 1, `è rimasto a ${a.livello}`);
  assert.equal(a.insensibile, false);
});

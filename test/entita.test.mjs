// LE ENTITÀ — identità, posa, indice per chunk, e il pacco del diorama.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Entita } from '../src/partita/entita.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { registraBlocco } from '../src/world/blocks.js';

registraDecorazioni();
registraBlocco('provaCespo', { nome: 'Prova cespo', forma: 'modello', modello: 'ciuffo', solido: false });

test('L\'ID È STABILE: togliere una cosa non cambia l\'identità delle altre', () => {
  // ⚠ È LA PROPRIETÀ CHE RENDE POSSIBILE UN ISPETTORE. Il pannello tiene in
  // mano la selezione mentre il mondo continua a scaricare e ricaricare chunk:
  // se l'identità fosse l'indice nell'array, l'oggetto selezionato cambierebbe
  // sotto le dita di chi lo sta modificando.
  const e = new Entita();
  const a = e.aggiungi('albero', 1, 0, 1);
  const b = e.aggiungi('albero', 2, 0, 2);
  const c = e.aggiungi('albero', 3, 0, 3);
  e.togli(b);
  assert.equal(e.leggi(a).x, 1);
  assert.equal(e.leggi(c).x, 3);
  assert.equal(e.leggi(b), null, 'un id tolto non deve tornare in vita');
  // lo slot si riusa, l'id NO: se no chi teneva `b` si troverebbe in mano un'altra cosa
  const d = e.aggiungi('albero', 4, 0, 4);
  assert.notEqual(d, b, 'un id si è ripetuto: la selezione può puntare all\'oggetto sbagliato');
  assert.equal(e.leggi(b), null);
  assert.equal(e.leggi(d).x, 4);
  assert.equal(e.conta, 3);
});

test('cambiate() dà otto float nel formato delle istanze del nucleo', () => {
  const e = new Entita();
  e.aggiungi('albero', 1.5, 5, 2.5, { scala: 1.25, giro: 0.5, tinta: [0.9, 1, 0.8] });
  const [[tipo, a]] = e.cambiate();
  assert.equal(tipo, 'albero');
  assert.deepEqual([...a].map((v) => Math.round(v * 1000) / 1000), [1.5, 5, 2.5, 1.25, 0.9, 1, 0.8, 0.5]);
  assert.equal(e.cambiate().length, 0, 'niente da rifare');
});

test('si sporca solo il tipo toccato — e i METADATI non sporcano niente', () => {
  const e = new Entita();
  const alb = e.aggiungi('albero', 0, 0, 0);
  e.aggiungi('lampione', 8, 0, 8);
  e.cambiate();

  e.posa(alb, { giro: 1 });
  assert.deepEqual(e.cambiate().map((x) => x[0]), ['albero'], 'ha rifatto anche i lampioni');

  // ⚠ scrivere una nota non tocca il disegno: sporcare qui vorrebbe dire
  // ricomporre la lista e ricaricare un buffer sulla GPU a ogni tasto premuto
  e.metadati(alb, { nota: 'il primo albero' });
  assert.equal(e.cambiate().length, 0, 'i metadati hanno sporcato la resa');
  assert.equal(e.metadati(alb).nota, 'il primo albero');
});

test('il mondo che parla: metti crea, togli toglie, e riposare sulla stessa cella SOSTITUISCE', () => {
  const e = new Entita();
  e.evento({ tipo: 'metti', cella: [1, 5, 2], blocco: 'albero' });
  e.evento({ tipo: 'metti', cella: [4, 5, 2], blocco: 'lampione' });
  e.evento({ tipo: 'metti', cella: [9, 5, 9], blocco: 'terra' });     // non è un modello
  assert.equal(e.conta, 2);

  // stessa cella, altro tipo: una sola entità resta lì
  e.evento({ tipo: 'metti', cella: [1, 5, 2], blocco: 'lampione' });
  assert.equal(e.conta, 2);
  assert.equal(e.quante('albero'), 0);
  assert.equal(e.quante('lampione'), 2);

  e.evento({ tipo: 'togli', cella: [1, 5, 2] });
  assert.equal(e.conta, 1);
  // ⚠ e un togli su una cella vuota non deve far niente di brutto
  e.evento({ tipo: 'togli', cella: [77, 1, 77] });
  assert.equal(e.conta, 1);
});

test('nata da una cella prende la posa del catalogo; posata a mano vince chi la posa', () => {
  const e = new Entita();
  e.evento({ tipo: 'metti', cella: [13, 5, -7], blocco: 'provaCespo' });
  const dalMondo = e.leggi(e.tutte()[0]);
  assert.deepEqual([dalMondo.x, dalMondo.y, dalMondo.z], [13.5, 5, -6.5], 'il centro della cella');
  assert.ok(dalMondo.giro > 0, 'la posa del catalogo non è arrivata');

  const mano = e.aggiungi('ciuffo', 13.5, 5, -6.5, { giro: 0, scala: 2 });
  assert.equal(e.leggi(mano).giro, 0, 'chi posa a mano deve vincere sul catalogo');
  assert.equal(e.leggi(mano).scala, 2);
});

test('lo stesso oggetto riposato dopo lo scarico del chunk torna IDENTICO', () => {
  // ⚠ È la prova dello streaming: la frontiera scarica i chunk dietro e li
  // ripone davanti. Se la posa non venisse dalla cella, tornando indietro di
  // cento blocchi il bosco si troverebbe rimescolato — e il difetto si
  // vedrebbe solo camminando avanti e indietro, cioè quasi mai in prova.
  const uno = new Entita();
  uno.evento({ tipo: 'metti', cella: [17, 9, -4], blocco: 'provaCespo' });
  const primo = [...uno.cambiate()[0][1]];
  assert.ok(primo[7] > 0, 'il cespo di prova non varia: la prova non proverebbe niente');

  const due = new Entita();                                               // un mondo nuovo, come dopo uno scarico
  due.evento({ tipo: 'metti', cella: [99, 2, 8], blocco: 'provaCespo' }); // altra roba in mezzo
  due.evento({ tipo: 'metti', cella: [17, 9, -4], blocco: 'provaCespo' });
  const dopo = [...due.cambiate()[0][1]];
  const i = dopo.indexOf(17.5);
  assert.ok(i >= 0 && i % 8 === 0, 'il cespo cercato non è nella lista');

  assert.deepEqual(dopo.slice(i, i + 8), primo, 'lo stesso oggetto è tornato con una posa diversa');
});

test('SPOSTARE RIMETTE NELL\'INDICE: un oggetto trascinato oltre il bordo cambia chunk', () => {
  // ⚠ Senza, l'oggetto resterebbe indicizzato dove non è più e lo streaming lo
  // scaricherebbe guardando il chunk sbagliato — cioè o sparisce quando non
  // deve, o resta quando il suo chunk se n'è andato.
  const e = new Entita();
  const id = e.aggiungi('albero', 2, 0, 2);        // chunk 0,0
  assert.deepEqual(e.nelChunk(0, 0), [id]);
  e.posa(id, { x: 20, z: 34 });                    // chunk 1,2
  assert.deepEqual(e.nelChunk(0, 0), []);
  assert.deepEqual(e.nelChunk(1, 2), [id]);
});

test('l\'indice per chunk regge le coordinate negative', () => {
  // ⚠ `-1 / 16 | 0` fa 0, e allora tutto l\'angolo negativo finisce nel chunk
  // dell\'origine: si usa Math.floor, e questa prova è qui perché è un errore
  // che si scrive da solo.
  const e = new Entita();
  const id = e.aggiungi('albero', -1, 0, -1);
  assert.deepEqual(e.nelChunk(-1, -1), [id]);
  assert.deepEqual(e.nelChunk(0, 0), []);
});

test('cresce oltre gli slot iniziali senza perdere niente', () => {
  const e = new Entita();
  const ids = [];
  for (let i = 0; i < 700; i++) ids.push(e.aggiungi('albero', i, 0, 0));
  assert.equal(e.conta, 700);
  assert.equal(e.leggi(ids[0]).x, 0);
  assert.equal(e.leggi(ids[699]).x, 699);
  assert.equal(e.cambiate()[0][1].length, 700 * 8);
});

test('il pacco del diorama: si salva quello che il mondo NON sa rifare', () => {
  const e = new Entita();
  e.evento({ tipo: 'metti', cella: [1, 5, 2], blocco: 'albero' });   // la rifà il mondo
  const mio = e.aggiungi('fungo', 3.5, 5, 4.5, { giro: 1.2, scala: 0.8, nome: 'Il fungo del cancello', dati: { nota: 'ciao' } });

  const p = e.serializza();
  assert.equal(p.entita.length, 1, 'ha salvato anche quello che rifà il mondo: sarebbe doppio');
  assert.equal(p.entita[0].tipo, 'fungo');
  assert.equal(p.entita[0].n, 'Il fungo del cancello');
  assert.equal(p.entita[0].m.nota, 'ciao');
  assert.equal(p.entita[0].t, undefined, 'la tinta bianca non si scrive: è il caso normale');

  const due = new Entita();
  assert.equal(due.deserializza(p), 1);
  const tornato = due.leggi(due.tutte()[0]);
  assert.equal(tornato.tipo, 'fungo');
  assert.equal(tornato.nome, 'Il fungo del cancello');
  assert.equal(Math.round(tornato.giro * 100) / 100, 1.2);
  assert.equal(Math.round(tornato.scala * 100) / 100, 0.8);

  assert.equal(e.serializza({ tutto: true }).entita.length, 2, '`tutto` salva anche le cose del mondo');
  assert.throws(() => due.deserializza({ versione: 99 }), /non riconosciuto/);
  void mio;
});

test('l\'albero della scena: i tipi con quanti ce n\'è, in ordine', () => {
  const e = new Entita();
  e.aggiungi('lampione', 0, 0, 0);
  e.aggiungi('albero', 1, 0, 1);
  e.aggiungi('albero', 2, 0, 2);
  assert.deepEqual(e.perTipo(), [['albero', 2], ['lampione', 1]]);
  // un tipo svuotato non resta nell'elenco a fare rumore
  e.togli(e.tutte()[0]);
  assert.deepEqual(e.perTipo(), [['albero', 2]]);
});

test('`varia: false` toglie la variazione anche a chi nasce da una cella', () => {
  const e = new Entita({ varia: false });
  e.evento({ tipo: 'metti', cella: [13, 5, -7], blocco: 'provaCespo' });
  const x = e.leggi(e.tutte()[0]);
  assert.equal(x.giro, 0);
  assert.equal(x.scala, 1);
});

test('battezzare e ribattezzare', () => {
  const e = new Entita();
  const id = e.aggiungi('albero', 0, 0, 0);
  assert.equal(e.leggi(id).nome, null);
  e.battezza(id, 'Il grande');
  assert.equal(e.leggi(id).nome, 'Il grande');
  e.battezza(id, null);
  assert.equal(e.leggi(id).nome, null);
  assert.equal(e.battezza(999999, 'niente'), false, 'un id che non c\'è non deve esplodere');
});

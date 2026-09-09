import test from 'node:test';
import assert from 'node:assert/strict';
import { RegistroModelli } from '../src/partita/registro-modelli.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { registraBlocco } from '../src/world/blocks.js';
import { allungaIstanze, modelloCubo } from '../src/nucleo/modelli.js';

registraDecorazioni();

test('il registro impara dagli eventi del mondo e ricompone solo i tipi cambiati', () => {
  const r = new RegistroModelli();
  r.evento({ tipo: 'metti', cella: [1, 5, 2], blocco: 'albero' });
  r.evento({ tipo: 'metti', cella: [4, 5, 2], blocco: 'lampione' });
  r.evento({ tipo: 'metti', cella: [9, 5, 9], blocco: 'terra' });   // non è un modello
  assert.equal(r.istanze, 2);
  const c = r.cambiate();
  assert.deepEqual(c.map((x) => x[0]).sort(), ['albero', 'lampione']);
  // ⚠ OTTO FLOAT, non quattro: x y z scala | r g b giro. La posizione è il
  // CENTRO della cella (y no: i modelli poggiano a terra). L'albero sta FERMO
  // per verdetto del committente, quindi scala 1 e giro 0 — ed è giusto che
  // questa prova lo dica: se un giorno l'albero comincia a girare da solo,
  // qui si rompe qualcosa e qualcuno se ne accorge.
  const a = [...c.find((x) => x[0] === 'albero')[1]];
  assert.equal(a.length, 8);
  assert.deepEqual(a, [1.5, 5, 2.5, 1, 1, 1, 1, 0]);
  assert.equal(r.cambiate().length, 0, 'niente da rifare');
  r.evento({ tipo: 'togli', cella: [1, 5, 2] });
  const d = r.cambiate();
  assert.equal(d.length, 1); assert.equal(d[0][0], 'albero'); assert.equal(d[0][1].length, 0);
});

// ⚠ UN BLOCCO DI PROVA CHE VARIA DAVVERO. Le righe vere del catalogo oggi
// stanno quasi tutte ferme (è il verdetto del committente, non un difetto), e
// provare lo streaming su una cosa ferma non prova niente: verrebbe identica
// comunque. Il `ciuffo` è la riga approvata, e qui gli si dà un blocco.
registraBlocco('provaCespo', { nome: 'Prova cespo', forma: 'modello', modello: 'ciuffo', solido: false });

test('lo stesso oggetto riposato dopo lo scarico del chunk torna IDENTICO', () => {
  // ⚠ È la prova dello streaming: la frontiera scarica i chunk dietro e li
  // ripone davanti. Se la posa non venisse dalla cella, tornando indietro di
  // cento blocchi il bosco si troverebbe rimescolato — e il difetto si
  // vedrebbe solo camminando avanti e indietro, cioè quasi mai in prova.
  const uno = new RegistroModelli();
  uno.evento({ tipo: 'metti', cella: [17, 9, -4], blocco: 'provaCespo' });
  const primo = [...uno.cambiate()[0][1]];
  assert.ok(primo[7] > 0, 'il cespo di prova non varia: la prova non proverebbe niente');

  const due = new RegistroModelli();                                      // un mondo nuovo, come dopo uno scarico
  due.evento({ tipo: 'metti', cella: [99, 2, 8], blocco: 'provaCespo' }); // altra roba in mezzo
  due.evento({ tipo: 'metti', cella: [17, 9, -4], blocco: 'provaCespo' });
  const dopo = [...due.cambiate()[0][1]];
  const i = dopo.indexOf(17.5);
  assert.ok(i >= 0 && i % 8 === 0, 'il cespo cercato non è nella lista');

  assert.deepEqual(dopo.slice(i, i + 8), primo, 'lo stesso oggetto è tornato con una posa diversa');
});

test('`varia: false` riporta il registro a com\'era: scala 1, giro 0', () => {
  const r = new RegistroModelli({ varia: false });
  r.evento({ tipo: 'metti', cella: [1, 5, 2], blocco: 'provaCespo' });
  assert.deepEqual([...r.cambiate()[0][1]], [1.5, 5, 2.5, 1, 1, 1, 1, 0]);
});

test('le istanze corte diventano otto float con tinta bianca; il cubo ha 36 vertici a 20 byte', () => {
  assert.deepEqual([...allungaIstanze([1, 2, 3, 4])], [1, 2, 3, 4, 1, 1, 1, 0]);
  assert.equal(allungaIstanze(new Float32Array([1, 2, 3, 4, 5, 6, 7, 8]), 8).length, 8);
  const c = modelloCubo([10, 20, 30], 1, 2, 1);
  assert.equal(c.vertici, 36); assert.equal(c.byte.length, 36 * 20); assert.equal(c.maxY, 2);
  assert.deepEqual([c.byte[16], c.byte[17], c.byte[18]], [10, 20, 30]);
});

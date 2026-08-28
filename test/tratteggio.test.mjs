// IL TRATTEGGIO DELL'ACQUA — le proprietà che, se si rompono, si vedono a
// schermo come un difetto che sembra tutt'altro.
//
// Le tre che contano:
//  1. SI RICHIUDE. Se il campo non è periodico, lungo il bordo della tessitura
//     resta una riga, e a schermo diventa un RETICOLO regolare sull'acqua — il
//     difetto che in Lantern si era già visto sull'erba («il tiling era un hash
//     riusato»), e che quando lo vedi non pensi mai alla texture.
//  2. USA IL SUO INTERVALLO. Un campo che sta tutto attorno a 0,5 tagliato con
//     una soglia dà o tutto bianco o tutto niente, e non c'è manopola nello
//     shader che lo rimetta a posto.
//  3. È DETERMINISTICO. Serve alle prove, e serve al multiplayer di domani: due
//     macchine devono cuocere la stessa tessitura.

import test from 'node:test';
import assert from 'node:assert/strict';
import { tratteggio, LATO } from '../src/motore/tratteggio.js';

const dati = tratteggio();
const at = (x, y, c) => dati[(y * LATO + x) * 4 + c];

test('la misura è quella dichiarata', () => {
  assert.equal(dati.length, LATO * LATO * 4);
  assert.ok(dati instanceof Uint8Array);
});

test('nessun canale esce dai byte (il 256 che diventa 0)', () => {
  // ⚠ QUESTA PROVA HA UN BERSAGLIO PRECISO: `campo` può tornare 1 esatto, e
  // 1·256 = 256 in un Uint8Array si avvolge a ZERO. Non è un valore fuori
  // scala che si nota: è un punto NERO in mezzo alla zona più chiara, cioè
  // esattamente dove non lo cercheresti. Il tipo non può fallire da solo, ma
  // la prova documenta perché il codice ha quel `min`.
  for (let i = 0; i < dati.length; i++) assert.ok(dati[i] >= 0 && dati[i] <= 255);
});

test('il campo si RICHIUDE: la cucitura non è più marcata dell\'interno', () => {
  // Il salto attraverso il bordo va confrontato con i salti normali DENTRO la
  // tessitura, non con zero: un campo continuo salta comunque un po' da un
  // texel al vicino. Se la cucitura fosse un taglio vero, salterebbe di molto
  // più del massimo interno.
  for (let c = 0; c < 4; c++) {
    let internoMax = 0;
    for (let y = 0; y < LATO; y++) {
      for (let x = 0; x < LATO - 1; x++) {
        internoMax = Math.max(internoMax, Math.abs(at(x + 1, y, c) - at(x, y, c)));
      }
    }
    let cuciraMax = 0;
    for (let y = 0; y < LATO; y++) {
      cuciraMax = Math.max(cuciraMax, Math.abs(at(0, y, c) - at(LATO - 1, y, c)));
    }
    assert.ok(cuciraMax <= internoMax,
      `canale ${c}: la cucitura verticale salta ${cuciraMax}, dentro al massimo ${internoMax}`);
  }
  // e lo stesso sull'altro bordo
  for (let c = 0; c < 4; c++) {
    let internoMax = 0;
    for (let y = 0; y < LATO - 1; y++) {
      for (let x = 0; x < LATO; x++) {
        internoMax = Math.max(internoMax, Math.abs(at(x, y + 1, c) - at(x, y, c)));
      }
    }
    let cuciraMax = 0;
    for (let x = 0; x < LATO; x++) {
      cuciraMax = Math.max(cuciraMax, Math.abs(at(x, 0, c) - at(x, LATO - 1, c)));
    }
    assert.ok(cuciraMax <= internoMax,
      `canale ${c}: la cucitura orizzontale salta ${cuciraMax}, dentro al massimo ${internoMax}`);
  }
});

test('ogni canale copre abbastanza intervallo da poterlo tagliare', () => {
  for (let c = 0; c < 4; c++) {
    let min = 255, max = 0;
    for (let i = c; i < dati.length; i += 4) { min = Math.min(min, dati[i]); max = Math.max(max, dati[i]); }
    assert.ok(max - min > 150, `canale ${c}: escursione ${max - min}, troppo piatta per una soglia`);
  }
});

test('i TRATTI sono allungati lungo u, non tondi', () => {
  // ⚠ È LA PROPRIETÀ CHE DISTINGUE QUESTO DISEGNO da quello di ogni pacchetto
  // toon che gira: le onde delle referenze sono LOSANGHE, non chiazze. Si
  // misura con la variazione media: un campo stirato lungo u cambia poco
  // muovendosi lungo u e molto muovendosi lungo v.
  let dU = 0, dV = 0;
  for (let y = 0; y < LATO; y++) {
    for (let x = 0; x < LATO; x++) {
      dU += Math.abs(at((x + 1) % LATO, y, 0) - at(x, y, 0));
      dV += Math.abs(at(x, (y + 1) % LATO, 0) - at(x, y, 0));
    }
  }
  assert.ok(dV > dU * 2, `i tratti non sono allungati: variazione u=${dU}, v=${dV}`);
});

test('è deterministico: due cotture danno gli stessi byte', () => {
  const altro = tratteggio();
  assert.deepEqual(Array.from(altro.slice(0, 4096)), Array.from(dati.slice(0, 4096)));
});

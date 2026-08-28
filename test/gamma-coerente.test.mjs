// LO STESSO ESPONENTE IN DUE POSTI, e questa prova serve a tenerceli.
//
// ⚠ `stile.js` decodifica i colori con GAMMA e li ricodifica con 1/GAMMA;
// `luci.js` decodifica i colori delle lampade con il suo, perché importarlo
// creerebbe un anello (stile importa luci). Sono due costanti scritte a mano
// che DEVONO essere uguali: se divergono, le lampade escono dell'intensità
// sbagliata e nient'altro nella scena lo mostra. Un difetto muto in più.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const luci = readFileSync(new URL('../src/motore/luci.js', import.meta.url), 'utf8');
const stile = readFileSync(new URL('../src/motore/stile.js', import.meta.url), 'utf8');

test('le due gamma sono lo stesso numero', () => {
  const a = luci.match(/const GAMMA_LUCI = ([\d.]+);/);
  const b = stile.match(/export const GAMMA = ([\d.]+);/);
  assert.ok(a, 'GAMMA_LUCI non trovata in luci.js');
  assert.ok(b, 'GAMMA non trovata in stile.js');
  assert.equal(a[1], b[1], 'le lampade uscirebbero di intensità sbagliata');
});

test('lo stile decodifica e ricodifica con esponenti inversi', () => {
  // ⚠ SE NON SONO INVERSI, la nebbia all'orizzonte non combacia col cielo:
  // `clearColor` non passa da nessuno shader, quindi l'unica cosa che li fa
  // coincidere è che i due `pow` si annullino.
  const g = Number(stile.match(/export const GAMMA = ([\d.]+);/)[1]);
  const usoDiretto = stile.match(/pow\(max\(\$\{lift\}, vec3\(0\.0\)\), vec3\(\$\{GAMMA\.toFixed\(1\)\}\)\)/);
  const usoInverso = stile.match(/vec3\(\$\{\(1 \/ GAMMA\)\.toFixed\(6\)\}\)/);
  assert.ok(usoDiretto, 'la decodifica non usa GAMMA');
  assert.ok(usoInverso, 'la ricodifica non usa 1/GAMMA');
  assert.ok(Math.abs(Number((1 / g).toFixed(6)) * g - 1) < 1e-4);
});

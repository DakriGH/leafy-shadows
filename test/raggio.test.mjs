import test from 'node:test';
import assert from 'node:assert/strict';
import { raggioDaSchermo } from '../src/partita/raggio.js';

test('guardando -Z, la destra dello schermo è +X e l\'alto è +Y', () => {
  const o = [0, 5, 0], c = [0, 5, -10];
  const centro = raggioDaSchermo(o, c, 1.2, 16 / 9, 0, 0);
  assert.ok(Math.abs(centro.z + 1) < 1e-9 && Math.abs(centro.x) < 1e-9);
  const destra = raggioDaSchermo(o, c, 1.2, 16 / 9, 1, 0);
  assert.ok(destra.x > 0.3, 'a destra dello schermo il raggio va verso +X: ' + JSON.stringify(destra));
  const alto = raggioDaSchermo(o, c, 1.2, 16 / 9, 0, 1);
  assert.ok(alto.y > 0.3, 'in alto il raggio sale: ' + JSON.stringify(alto));
  const sinistra = raggioDaSchermo(o, c, 1.2, 16 / 9, -1, 0);
  assert.ok(sinistra.x < -0.3);
});

test('guardando +X, la destra dello schermo è +Z', () => {
  const o = [0, 5, 0], c = [10, 5, 0];
  const destra = raggioDaSchermo(o, c, 1.2, 1, 1, 0);
  assert.ok(destra.z > 0.3, JSON.stringify(destra));
});

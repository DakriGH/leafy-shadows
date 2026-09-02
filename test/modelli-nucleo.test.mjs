// I MODELLI DEL NUCLEO: il file cotto offline si rilegge, sta a terra, ha i colori.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { leggiModello } from '../src/nucleo/modelli.js';

for (const nome of ['albero', 'lampione', 'panchina']) {
  test(`${nome}.bin: intestazione, triangoli, a terra`, () => {
    const buf = readFileSync(new URL(`../modelli/nucleo/${nome}.bin`, import.meta.url));
    const m = leggiModello(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
    assert.ok(m.triangoli > 20 && m.triangoli < 5000, `${m.triangoli} triangoli`);
    assert.equal(m.byte.length, m.vertici * 20);
    assert.ok(Math.abs(m.minY) < 1e-3, `il punto più basso sta a zero: ${m.minY}`);
    assert.ok(m.maxY > 0.5 && m.maxY < 6, `alto ${m.maxY}`);
    // almeno un colore non nero
    let chiari = 0; for (let i = 0; i < m.vertici; i++) if (m.byte[i * 20 + 16] + m.byte[i * 20 + 17] + m.byte[i * 20 + 18] > 60) chiari++;
    assert.ok(chiari > m.vertici / 2, 'i colori ci sono');
  });
}

test('il lampione ha una testa emissiva (materia 1) e l\'albero no', () => {
  const leggi = (n) => { const b = readFileSync(new URL(`../modelli/nucleo/${n}.bin`, import.meta.url)); return leggiModello(b.buffer.slice(b.byteOffset, b.byteOffset + b.byteLength)); };
  const conta = (m) => { let e = 0; for (let i = 0; i < m.vertici; i++) if (m.byte[i * 20 + 15] === 1) e++; return e; };
  const l = leggi('lampione');
  assert.ok(conta(l) > 0);
  // ⚠ ED È IN ALTO: il vetro della lanterna, non la piastra alla base
  const dv = new DataView(l.byte.buffer, l.byte.byteOffset);
  for (let i = 0; i < l.vertici; i++) if (l.byte[i * 20 + 15] === 1) assert.ok(dv.getFloat32(i * 20 + 4, true) > 1.9, 'la testa accesa sta sopra il palo');
  assert.equal(conta(leggi('albero')), 0);
});

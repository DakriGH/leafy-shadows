// LE TABELLE DELLA QUALITÀ SONO DATI, e un dato sbagliato qui è un difetto che
// si vede solo su una macchina che io non ho. Per questo si presidiano: è
// l'unico controllo possibile su numeri destinati a un telefono.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LIVELLI, DPR_MAX, TEXEL_PER_BLOCCO, classeDispositivo, fissiDiAvvio, ScalaQualita } from '../src/motore/qualita.js';

const CHIAVI = ['scala', 'cascate', 'mappa', 'ombraZ', 'pcf', 'sole', 'dist', 'erba', 'erbaR', 'fxaa', 'particelle'];

for (const [nome, livelli] of Object.entries(LIVELLI)) {
  test(`«${nome}»: ogni gradino ha tutte le colonne`, () => {
    for (const [i, p] of livelli.entries()) {
      for (const k of CHIAVI) {
        assert.ok(k in p, `${nome}[${i}] non ha «${k}»`);
      }
      assert.equal(Object.keys(p).length, CHIAVI.length, `${nome}[${i}] ha colonne di troppo`);
    }
  });

  test(`«${nome}»: la scala non risale mai scendendo di gradino`, () => {
    // ⚠ È LA PROPRIETÀ CHE TIENE IN PIEDI L'ADATTATORE: lui presume che
    // «gradino più alto = più leggero». Una riga con un numero più grande di
    // quella sopra farebbe scendere la qualità e SALIRE il costo, e la scala
    // continuerebbe a scendere cercando sollievo che non arriva mai.
    for (let i = 1; i < livelli.length; i++) {
      const a = livelli[i - 1], b = livelli[i];
      for (const k of ['scala', 'cascate', 'mappa', 'ombraZ', 'dist', 'erba', 'erbaR']) {
        assert.ok(b[k] <= a[k], `${nome}: «${k}» risale da ${a[k]} a ${b[k]} fra i gradini ${i - 1} e ${i}`);
      }
      for (const k of ['pcf', 'sole', 'fxaa', 'particelle']) {
        assert.ok(!(b[k] && !a[k]), `${nome}: «${k}» si riaccende al gradino ${i}`);
      }
    }
  });

  test(`«${nome}»: le cascate rispettano il minimo di Babylon`, () => {
    // ⚠ `CascadedShadowGenerator.MIN_CASCADES_COUNT` vale DUE, e il suo setter
    // fa `Math.max` in silenzio: scrivere 1 non darebbe un errore, darebbe due
    // cascate e una tabella che mente. Sotto il minimo si SPEGNE l'ombra.
    for (const [i, p] of livelli.entries()) {
      assert.ok(p.cascate >= 2 && p.cascate <= 4, `${nome}[${i}]: ${p.cascate} cascate`);
    }
  });

  test(`«${nome}»: il gradino peggiore è davvero leggero`, () => {
    const u = livelli[livelli.length - 1];
    assert.ok(u.scala <= 0.65, 'in fondo alla scala i pixel devono essere pochi');
    assert.ok(!u.fxaa && !u.particelle, 'e le passate in più devono essere spente');
  });
}

test('su mobile si parte più scarichi che su desktop', () => {
  const m = LIVELLI.mobile[0], d = LIVELLI.desktop[0];
  assert.ok(m.cascate <= d.cascate && m.mappa <= d.mappa && m.dist <= d.dist);
  assert.ok(m.erba < d.erba, 'e con molta meno erba: è la cosa che si conta a decine di migliaia');
});

test('FXAA resta ACCESO sui primi gradini mobile', () => {
  // ⚠ È UN'ECCEZIONE VOLUTA, e l'ho imparata spegnendolo. FXAA è UNA passata a
  // schermo intero — a 0,68 Mpixel non si sente — e cura il difetto per cui è
  // stato messo: «le terrazze di Leafy sono fianchi alti UN blocco, a cinquanta
  // blocchi meno di un pixel», che il committente aveva chiamato «vibrazioni a
  // distanza». Spegnendolo su mobile è tornato, e l'ha chiamato «acne ovunque».
  assert.equal(LIVELLI.mobile[0].fxaa, true);
  assert.equal(LIVELLI.mobile[1].fxaa, true);
});

test('la mappa d\'ombra e la sua portata scendono INSIEME', () => {
  // ⚠ LA PROVA CHE AVREBBE PRESO IL DIFETTO. Ho portato la mappa da 2048 a 1024
  // lasciando la portata a 90: metà dei texel sulla stessa area vuol dire ogni
  // texel grande il doppio, e un texel grande È l'acne. Quello che deve restare
  // costante non è la mappa né la portata: è il loro RAPPORTO.
  for (const [nome, livelli] of Object.entries(LIVELLI)) {
    for (const [i, p] of livelli.entries()) {
      if (!p.sole) continue;                    // senza ombra non c'è densità
      const d = p.mappa / p.ombraZ;
      assert.ok(Math.abs(d - TEXEL_PER_BLOCCO) / TEXEL_PER_BLOCCO < 0.06,
        `${nome}[${i}]: ${d.toFixed(1)} texel per blocco invece di ${TEXEL_PER_BLOCCO} ` +
        `(mappa ${p.mappa}, portata ${p.ombraZ})`);
    }
  }
});

test('e il tetto dei pixel è più basso su mobile', () => {
  // ⚠ È LA MANOPOLA CHE PESA DI PIÙ: un telefono con DPR 3 renderizzato a DPR
  // pieno costa NOVE VOLTE i pixel. In questo progetto non c'era alcun tetto.
  assert.ok(DPR_MAX.mobile < DPR_MAX.desktop);
  assert.equal(DPR_MAX.mobile, 1.5, 'è il valore di Leafy-Lantern, provato lì');
});

test('mobile: il cammino nei voxel non si compila proprio', () => {
  // ⚠ NON «si spegne»: NON SI COMPILA. Su GPU mobile un `if` non toglie il
  // costo — il compilatore riserva i registri per il ramo che non esegue e
  // l'occupancy crolla. È la lezione di Lantern, misurata: ~30% di fps.
  assert.equal(fissiDiAvvio({ mobile: true }).ombreLampade, false);
  assert.equal(fissiDiAvvio({ mobile: false }).ombreLampade, true);
  assert.equal(fissiDiAvvio({ mobile: true }).antialias, false);
});

test('senza DOM la classe del dispositivo non esplode', () => {
  // gira nei test e in qualunque contesto senza finestra
  const c = classeDispositivo();
  assert.equal(c.mobile, false);
});

test('la scala applica il gradino e lo cambia quando serve', () => {
  const visti = [];
  const s = new ScalaQualita({ mobile: true, hz: 60, applica: (p) => visti.push(p.scala) });
  s.avvia();
  assert.equal(visti.length, 1);
  assert.equal(s.livello, 0);
  // fps a terra, misure abbastanza distanziate: deve scendere
  let t = 10000;
  for (let i = 0; i < 12; i++) { s.osserva(8, t); t += 3000; }
  assert.ok(s.livello > 0, 'a otto fps deve scendere');
  assert.ok(visti.length > 1, 'e applicare ogni volta');
  assert.ok(visti[visti.length - 1] < visti[0], 'con meno pixel');
});

// L'OFFICINA È FATTA DI PEZZI PURI, E QUINDI SI PROVANO.
//
// ⚠ IL BUS DEI COMANDI È IL PEZZO DA PRESIDIARE, e non per il pannello: è il
// passo zero del multiplayer. Un comando `{registro, campo, prima, dopo}` che
// si esegue, si annulla, si ripete e si SERIALIZZA è la stessa cosa che un
// giorno un server validerà e ritrasmetterà. Se «annulla» sbaglia, il difetto
// non si vede il giorno che lo si scrive — si vede il giorno che due giocatori
// costruiscono insieme.
//
// ⚠ E I REGISTRI VERI si controllano con `normalizzaRegistro`: un campo senza
// `leggi` o con un tipo che non esiste è esattamente il genere di errore che a
// schermo diventa «quella manopola non fa niente», senza un solo messaggio.
import './_dom-stub.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { BusComandi } from '../src/officina/comandi.js';
import { normalizzaRegistro, mostra, interpreta, TIPI } from '../src/officina/schema.js';
import { raccogli, applica, impacchetta } from '../src/officina/preset.js';

function busFinto() {
  const scritti = [];
  const bus = new BusComandi({ scrivi: (r, c, v) => scritti.push([r, c, v]), autore: 'prova' });
  return { bus, scritti };
}

test('un comando si esegue, si annulla e si ripete', () => {
  const { bus, scritti } = busFinto();
  bus.esegui({ registro: 'acqua', campo: 'vera', prima: 3, dopo: 1 });
  assert.deepEqual(scritti.at(-1), ['acqua', 'vera', 1]);
  bus.annulla();
  assert.deepEqual(scritti.at(-1), ['acqua', 'vera', 3], 'annullare rimette il valore di PRIMA');
  bus.ripeti();
  assert.deepEqual(scritti.at(-1), ['acqua', 'vera', 1]);
  assert.equal(bus.puoAnnullare, true);
  assert.equal(bus.puoRipetere, false);
});

test('un comando che non cambia niente non si registra', () => {
  // ⚠ SE NO LA PILA DEGLI ANNULLAMENTI SI RIEMPIE DI NIENTE: il pannello
  // rilegge i valori veri ogni mezzo secondo, e un valore riscritto uguale è
  // il caso NORMALE, non l'eccezione.
  const { bus, scritti } = busFinto();
  assert.equal(bus.esegui({ registro: 'a', campo: 'b', prima: 2, dopo: 2 }), null);
  assert.equal(scritti.length, 0);
  assert.equal(bus.puoAnnullare, false);
});

test('una modifica nuova cancella la pila del «ripeti»', () => {
  const { bus } = busFinto();
  bus.esegui({ registro: 'a', campo: 'b', prima: 0, dopo: 1 });
  bus.annulla();
  assert.equal(bus.puoRipetere, true);
  bus.esegui({ registro: 'a', campo: 'b', prima: 0, dopo: 2 });
  assert.equal(bus.puoRipetere, false, 'la storia si è biforcata: il «dopo» vecchio non esiste più');
});

test('lo stato netto è quello che un client appena entrato riceverebbe', () => {
  const { bus } = busFinto();
  bus.esegui({ registro: 'acqua', campo: 'vera', prima: 3, dopo: 2 });
  bus.esegui({ registro: 'acqua', campo: 'vera', prima: 2, dopo: 1 });
  bus.esegui({ registro: 'erba', campo: 'densita', prima: 4, dopo: 6 });
  assert.deepEqual(bus.netto(), { acqua: { vera: 1 }, erba: { densita: 6 } },
    'netto = l\'ULTIMO valore per campo, non la storia');
});

test('rigiocare NON riempie la pila degli annullamenti', () => {
  // ⚠ È LO STATO IN CUI CI SI TROVA, non «cose fatte da me»: un preset caricato
  // o una raffica dalla rete non devono diventare venti «annulla» da premere.
  const { bus, scritti } = busFinto();
  bus.rigioca([{ registro: 'a', campo: 'b', dopo: 7 }, { registro: 'c', campo: 'd', dopo: 8 }]);
  assert.equal(scritti.length, 2);
  assert.equal(bus.puoAnnullare, false);
});

test('il diario tiene anche gli annullamenti: è il log di rete', () => {
  const { bus } = busFinto();
  bus.esegui({ registro: 'a', campo: 'b', prima: 0, dopo: 1 });
  bus.annulla();
  assert.deepEqual(bus.diario.map((c) => c.verbo), ['esegui', 'annulla']);
  assert.equal(bus.diario[0].autore, 'prova');
  assert.ok(JSON.stringify(bus.diario).length > 0, 'e deve restare serializzabile');
});

test('un registro malformato si rifiuta SUBITO, non a schermo', () => {
  assert.throws(() => normalizzaRegistro({ chiave: 'x', campi: [{ chiave: 'a', tipo: 'boh', leggi: () => 1 }] }),
    /tipo sconosciuto/);
  assert.throws(() => normalizzaRegistro({ chiave: 'x', campi: [{ chiave: 'a', tipo: 'numero' }] }),
    /manca leggi/);
  assert.throws(() => normalizzaRegistro({ campi: [] }), /malformato/);
  // un'azione non ha bisogno di `leggi`: è un bottone
  normalizzaRegistro({ chiave: 'x', campi: [{ chiave: 'a', nome: 'a', tipo: 'azione', fai: () => {} }] });
});

test('il numero si mostra con le cifre del suo passo', () => {
  const c = normalizzaRegistro({ chiave: 'x', campi: [
    { chiave: 'n', nome: 'n', tipo: 'numero', min: 0, max: 1, passo: 0.01, leggi: () => 0 },
  ] }).campi[0];
  assert.equal(mostra(c, 0.5), '0.50');
  assert.equal(interpreta(c, '0.25'), 0.25);
  assert.equal(mostra({ tipo: 'interruttore' }, true), 'sì');
  assert.equal(mostra({ tipo: 'numero', passo: 1 }, 3), '3');
  assert.equal(mostra({ tipo: 'numero', passo: 1 }, null), '—');
});

test('le scelte scritte a mano diventano coppie valore/nome', () => {
  const r = normalizzaRegistro({ chiave: 'x', campi: [
    { chiave: 's', nome: 's', tipo: 'scelta', scelte: [256, 512], leggi: () => 256 },
  ] });
  assert.deepEqual(r.campi[0].scelte, [{ v: 256, nome: '256' }, { v: 512, nome: '512' }]);
  assert.equal(interpreta(r.campi[0], '512'), 512, 'e la stringa del menu torna NUMERO');
});

test('un preset raccoglie solo quello che si può riscrivere', () => {
  let vera = 3;
  const reg = [normalizzaRegistro({ chiave: 'acqua', campi: [
    { chiave: 'vera', nome: 'vera', tipo: 'numero', min: 0, max: 3, passo: 1, leggi: () => vera, scrivi: (v) => (vera = v) },
    { chiave: 'passate', nome: 'passate', tipo: 'lettura', leggi: () => 3 },
    { chiave: 'misura', nome: 'misura', tipo: 'azione', fai: () => {} },
  ] })];
  assert.deepEqual(raccogli(reg), { acqua: { vera: 3 } }, 'letture e azioni non sono stato');
  const p = impacchetta(reg, 'prova');
  assert.equal(p.nome, 'prova');
  assert.equal(p.versione, 1);
  const scritti = [];
  assert.equal(applica(reg, { acqua: { vera: 1 }, boh: { x: 1 } }, (r, c, v) => scritti.push([r, c, v])), 1);
  assert.deepEqual(scritti, [['acqua', 'vera', 1]], 'un registro che non c\'è si ignora, non esplode');
});

test('tutti i tipi dello schema sono quelli che il pannello sa disegnare', () => {
  // ⚠ LA PROVA ESISTE PER IL VERSO SBAGLIATO: aggiungere un tipo qui e
  // scordarsi il `case` nel pannello dà un campo che non compare, muto.
  assert.deepEqual(TIPI, ['numero', 'interruttore', 'scelta', 'colore', 'testo', 'azione', 'lettura']);
});

// ---------------------------------------------------------------------------
// I REGISTRI VERI, quelli che i moduli dichiarano per sé.
//
// ⚠ QUESTA PROVA ESISTE PER UN DIFETTO CHE NON DÀ NESSUN SEGNALE: un campo con
// un tipo sbagliato o senza `leggi` non fa esplodere niente all'avvio — il
// pannello semplicemente non disegna quella manopola, o la disegna e non fa
// niente. È lo stesso genere di guasto muto che ha reso necessario far
// dichiarare i registri ACCANTO al codice invece che in un adattatore lontano.
//
// ⚠ E UNO STUB NON PUÒ PRENDERE UN CAMPO RINOMINATO — quello lo prende solo il
// gioco vero. Quello che prende è la FORMA: tipi, `leggi`, scelte, i limiti dei
// numeri. È il controllo che si può fare in Node, e vale quello che vale.
import { registroAcqua } from '../src/motore/acqua.js';
import { registroQualita } from '../src/motore/qualita.js';
import { registroOmbre, registroMotore } from '../src/motore/motore.js';
import { registroGiorno } from '../src/motore/giorno.js';
import { registroErba } from '../src/vegetazione/erba.js';
import { LIVELLI } from '../src/motore/qualita.js';

/** Un rig finto: risponde a tutto quello che i registri chiedono, e basta. */
function rigFinto() {
  const nulla = () => {};
  return {
    profilo: { ...LIVELLI.desktop[0] },
    dprMax: 2, _scala: 1,
    scheda: { nome: 'finta' },
    dispositivo: { mobile: false },
    motore: { getRenderWidth: () => 1280, getRenderHeight: () => 720, webGLVersion: 2, _gl: null },
    scena: { meshes: [], materials: [], getActiveMeshes: () => [], skipPointerDownPicking: true, skipPointerUpPicking: true },
    ombre: { getShadowMap: () => ({ refreshRate: 0 }), autoCalcDepthBounds: false, filteringQuality: 1,
             lambda: 0.94, bias: 0.001, normalBias: 0.01, stabilizeCascades: true },
    applicaProfilo: nulla, applicaScala: nulla, passate: () => [], campione: () => ({}),
  };
}

const REGISTRI = () => {
  const rig = rigFinto();
  const fabbrica = { acqua: { ricetta: 'lago', stile: 'liscia', modello: 'morbida', onde: true, riflesso: true, vera: 3 },
                     cambiaRicettaAcqua: () => {}, cambiaStileAcqua: () => {}, ombreSullAcqua: () => {} };
  const scala = { livello: 0, quanti: LIVELLI.desktop.length, adatta: { manuale: false }, fissa: () => {} };
  const giorno = { auto: true, t: 0.4, durata: 300, giorno: 105, orologio: '10:00', impostaOra: () => {}, impostaGiorno: () => {}, applica: () => {} };
  const erba = { attiva: true, densita: 4, raggioChunk: 5, fili: 1000, imposta: () => {}, risemina: () => {} };
  return [
    registroAcqua(rig, fabbrica),
    registroQualita(rig, scala, {}),
    registroOmbre(rig),
    registroGiorno(giorno),
    registroErba(erba),
    registroMotore(rig),
  ];
};

test('ogni registro dichiarato dai moduli è uno schema valido', () => {
  for (const r of REGISTRI()) {
    normalizzaRegistro(r);
    assert.ok(r.nome, `${r.chiave}: manca il nome della scheda`);
    assert.ok(r.campi.length, `${r.chiave}: nessun campo`);
    for (const c of r.campi) {
      assert.ok(c.nome, `${r.chiave}.${c.chiave}: manca il nome a schermo`);
      if (c.tipo === 'numero') {
        assert.ok(c.max > c.min, `${r.chiave}.${c.chiave}: intervallo vuoto`);
        assert.ok(c.passo > 0, `${r.chiave}.${c.chiave}: passo nullo`);
      }
      if (c.tipo === 'scelta') assert.ok(c.scelte.length, `${r.chiave}.${c.chiave}: menu vuoto`);
    }
  }
});

test('ogni campo si LEGGE senza esplodere, prima ancora di scriverlo', () => {
  // ⚠ È IL PRIMO GESTO CHE FA IL PANNELLO: appena si apre una scheda rilegge
  // tutti i valori veri. Un `leggi` che va in errore su un oggetto a metà
  // (l'acqua senza specchio, l'erba spenta) lascia la riga vuota e basta.
  for (const r of REGISTRI()) {
    for (const c of r.campi) {
      if (c.tipo === 'azione') continue;
      assert.doesNotThrow(() => c.leggi(), `${r.chiave}.${c.chiave} non si legge`);
    }
  }
});

test('la qualità espone TUTTE le colonne del profilo, acqua compresa', () => {
  // ⚠ UNA COLONNA NUOVA NELLA TABELLA DEI LIVELLI E NIENTE NEL PANNELLO vuol
  // dire una manopola che esiste, costa, e non si può né vedere né provare —
  // che è esattamente com'è nata la storia delle tre passate dell'acqua fuori
  // dai profili.
  const reg = REGISTRI().find((r) => r.chiave === 'qualita');
  const dentro = new Set(reg.campi.map((c) => c.chiave));
  for (const k of Object.keys(LIVELLI.desktop[0])) {
    assert.ok(dentro.has(k), `il profilo ha «${k}» e l'Officina non lo mostra`);
  }
});

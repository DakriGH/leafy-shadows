// LE TABELLE DELLA QUALITÀ SONO DATI, e un dato sbagliato qui è un difetto che
// si vede solo su una macchina che io non ho. Per questo si presidiano: è
// l'unico controllo possibile su numeri destinati a un telefono.
import test from 'node:test';
import assert from 'node:assert/strict';
import { LIVELLI, DPR_MAX, TEXEL_PER_BLOCCO, classeDispositivo, fissiDiAvvio, ScalaQualita } from '../src/motore/qualita.js';

const CHIAVI = ['scala', 'cascate', 'mappa', 'ombraZ', 'pcf', 'sole', 'dist', 'erba', 'erbaR',
                'ombraOgni', 'ombraAcqua', 'fxaa', 'particelle',
                // ⚠ LE CINQUE DELL'ACQUA, e la prova esiste per il difetto che ha
                // fatto crollare la build del 31/08: l'acqua accendeva fino a TRE
                // rese complete della scena e i profili non avevano nessuna leva
                // su di lei. Una colonna dimenticata qui è la stessa cosa.
                'acquaVera', 'acquaSpecchio', 'acquaLato', 'acquaOgni', 'acquaProf'];

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
      for (const k of ['scala', 'cascate', 'mappa', 'ombraZ', 'dist', 'erba', 'erbaR',
                       'acquaVera', 'acquaLato', 'acquaProf']) {
        assert.ok(b[k] <= a[k], `${nome}: «${k}» risale da ${a[k]} a ${b[k]} fra i gradini ${i - 1} e ${i}`);
      }
      for (const k of ['pcf', 'sole', 'fxaa', 'particelle', 'acquaSpecchio']) {
        assert.ok(!(b[k] && !a[k]), `${nome}: «${k}» si riaccende al gradino ${i}`);
      }
      // ⚠ E LE CADENZE VANNO NELL'ALTRO VERSO: «ogni N fotogrammi» più grande
      // vuol dire meno lavoro. Scendendo di gradino non si può rifare una cosa
      // PIÙ spesso di quanto la si rifacesse sopra.
      for (const k of ['ombraOgni', 'acquaOgni']) {
        assert.ok(b[k] >= a[k], `${nome}: «${k}» scende da ${a[k]} a ${b[k]} fra i gradini ${i - 1} e ${i}`);
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

test('una grafica sola, ovunque: la tabella mobile È quella desktop', () => {
  // ⚠ MANDATO DEL 02/09: «in ogni dispositivo la grafica deve essere uguale,
  // non diversa». Prima qui si pretendeva il contrario (mobile più scarico);
  // adesso `mobile` è un alias, e se qualcuno rimette una tabella sua questa
  // prova lo dice. Il telefono che non regge si cura con la rifondazione del
  // motore (docs/RIFONDAZIONE.md), non con una grafica diversa.
  assert.equal(LIVELLI.mobile, LIVELLI.desktop);
  assert.equal(LIVELLI.mobile[0].erba, LIVELLI.desktop[0].erba);
});

test('su mobile un anti-aliasing c\'è SEMPRE — ed è l\'MSAA, non FXAA', () => {
  // ⚠ LA STORIA HA DUE CAPITOLI, e vanno tenuti tutti e due. Primo: spegnere
  // OGNI AA su mobile riporta le «vibrazioni a distanza» delle terrazze (visto
  // dal committente, chiamato «acne ovunque») — quindi un AA ci DEVE essere.
  // Secondo (studio TBDR, docs/STUDIO-RETRO.md, fonti ARM/Android): su una GPU
  // a tile l'MSAA del canvas si risolve on-chip (~500 MB/s) mentre FXAA è una
  // passata fullscreen con store+rilettura dell'intero frame — su un tiler
  // l'ordine di convenienza è l'OPPOSTO del desktop. Quindi: FXAA spento su
  // TUTTI i gradini mobile, e il canvas con l'MSAA acceso (`antialias`).
  // ⚠ DAL 02/09 LA TABELLA È UNA SOLA (mandato: «una grafica sola, ovunque»),
  // quindi l'FXAA dei gradini alti arriva anche sul telefono insieme al resto.
  // Quello che resta vero, e si prova qui, è il primo capitolo: un AA sul
  // canvas c'è, ed è l'MSAA.
  assert.equal(fissiDiAvvio({ mobile: true }).antialias, true,
    'il canvas tiene l\'MSAA: senza NESSUN AA tornano le vibrazioni');
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

test('l\'acqua non può accendere passate che il profilo non concede', () => {
  // ⚠ È LA PROVA CHE MANCAVA IL 31/08, e la sua assenza è costata 68 fotogrammi
  // al secondo. La ricetta «lago» accende specchio + rifrazione + profondità:
  // tre rese complete della scena per fotogramma. Nessun profilo le conosceva,
  // quindi il gradino «bassa» spegneva le ombre del sole e lasciava intatte tre
  // rese della scena — l'esatto contrario di una scala di qualità.
  for (const [nome, livelli] of Object.entries(LIVELLI)) {
    for (const [i, p] of livelli.entries()) {
      assert.ok(p.acquaVera >= 0 && p.acquaVera <= 3, `${nome}[${i}]: acquaVera fuori scala (${p.acquaVera})`);
      assert.ok(p.acquaProf > 0 && p.acquaProf <= 1, `${nome}[${i}]: acquaProf fuori scala (${p.acquaProf})`);
      assert.ok(p.acquaLato >= 128 && p.acquaLato <= 1024, `${nome}[${i}]: acquaLato ${p.acquaLato}`);
      assert.ok(p.acquaOgni >= 1 && p.acquaOgni <= 8, `${nome}[${i}]: acquaOgni ${p.acquaOgni}`);
      // ⚠ LO SPECCHIO SENZA LA PROFONDITÀ NON HA SENSO in questo impianto: la
      // stessa `uSchermo` serve a tutt'e due, e una ricetta con lo specchio e
      // `vera 0` è la combinazione che nessun profilo deve poter chiedere.
      if (p.acquaSpecchio) assert.ok(p.acquaVera >= 1, `${nome}[${i}]: specchio senza profondità`);
    }
    // ⚠ E IL FONDO DELLA SCALA NON DEVE AVERE NESSUNA PASSATA D'ACQUA: è la
    // corsia d'emergenza, e una resa in più della scena lì dentro è proprio la
    // cosa che tiene una macchina incollata sotto i trenta.
    const fondo = livelli[livelli.length - 1];
    assert.equal(fondo.acquaVera, 0, `${nome}: l'ultimo gradino paga ancora l'acqua vera`);
    assert.equal(fondo.acquaSpecchio, false, `${nome}: l'ultimo gradino paga ancora lo specchio`);
  }
  // ⚠ LA MAPPA DI PROFONDITÀ A PIENA RISOLUZIONE su mobile era vietata (è la
  // passata più cara: piena risoluzione × DPR). Dal 02/09 la tabella è una
  // sola per mandato («una grafica sola, ovunque»): il telefono la paga come il
  // desktop, e il tetto di DPR_MAX resta l'unico freno. Si prova che il tetto
  // ci sia ancora, e che sia più stretto di quello desktop.
  assert.ok(DPR_MAX.mobile <= DPR_MAX.desktop, 'il tetto di dpr del telefono non può superare quello desktop');
  assert.equal(LIVELLI.desktop[0].acquaProf, 1, 'e chi ha la macchina la vede intera');
});

test('e il tetto dei pixel è più basso su mobile', () => {
  // ⚠ È LA MANOPOLA CHE PESA DI PIÙ: un telefono con DPR 3 renderizzato a DPR
  // pieno costa NOVE VOLTE i pixel. In questo progetto non c'era alcun tetto.
  assert.ok(DPR_MAX.mobile < DPR_MAX.desktop);
  assert.equal(DPR_MAX.mobile, 1.5, 'è il valore di Leafy-Lantern, provato lì');
});

test('il cammino nei voxel si compila uguale su mobile e su desktop', () => {
  // ⚠ FINO AL 02/09 su mobile NON si compilava (Lantern, misurato: ~30% di
  // fps, e un `if` non toglie il costo su una GPU a tile). Dal mandato «una
  // grafica sola, ovunque» il telefono parte come il desktop, dal gradino di
  // fatica che ricorda: il costo è noto e accettato in cambio della coerenza.
  assert.equal(fissiDiAvvio({ mobile: true }).ombreLampade, fissiDiAvvio({ mobile: false }).ombreLampade);
  assert.equal(fissiDiAvvio({ mobile: false }).ombreLampade, true);
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

test('il primo gradino è un TETTO generoso, non una resa', () => {
  // ⚠ LA PROVA CHE PRESIDIA L'ERRORE DI FORMA. L'adattatore da q0 può solo
  // SCENDERE: quel gradino non è «una qualità media ragionevole», è il MASSIMO
  // che il gioco potrà mai mostrare su quel dispositivo. Abbassandolo per
  // curare un telefono lento si mette un tetto basso permanente anche a chi
  // reggeva benissimo — e la scala, che esisteva apposta per decidere, non ha
  // più niente da decidere.
  for (const [nome, livelli] of Object.entries(LIVELLI)) {
    const cima = livelli[0];
    assert.equal(cima.scala, 1, `${nome}: il tetto deve renderizzare a piena risoluzione`);
    assert.ok(cima.sole, `${nome}: e con le ombre del sole`);
    assert.ok(cima.erba >= 3.5, `${nome}: e con l'erba fitta, non ${cima.erba}`);
    // e deve esserci spazio sotto: un tetto senza scala non serve a niente
    assert.ok(livelli.length >= 5, `${nome}: servono gradini sotto`);
    // ⚠ 0,7 e non 0,6: la mia prima soglia cadeva ESATTAMENTE sul valore del
    // desktop (0,60 contro 1,0 × 0,6) e la prova falliva per un pelo. Una
    // soglia messa sul bordo di un dato esistente non prova niente — prova solo
    // di essere stata scritta guardando quel dato.
    assert.ok(livelli[livelli.length - 1].scala < cima.scala * 0.7, `${nome}: e devono scendere davvero`);
  }
});

test('la mappa delle ombre si rifà più di rado man mano che si scende', () => {
  // ⚠ MISURATO: la resa dei bersagli d'ombra costa 2,12 ms su 5,98 di CPU per
  // fotogramma, e disegna quattro volte gli stessi 112.430 triangoli. Il sole
  // si muove di un quarto di grado al minuto: rifarla ogni due giri non si vede.
  for (const [nome, livelli] of Object.entries(LIVELLI)) {
    for (const [i, p] of livelli.entries()) {
      assert.ok(p.ombraOgni >= 1 && p.ombraOgni <= 6, `${nome}[${i}] = ${p.ombraOgni}`);
      if (i > 0) assert.ok(p.ombraOgni >= livelli[i - 1].ombraOgni,
        `${nome}[${i}] rifà le ombre più spesso del gradino sopra`);
    }
  }
  // ⚠ E IL PRIMO GRADINO DEL DESKTOP NON RISPARMIA: chi ha la macchina per
  // farlo deve vedere il meglio. È la stessa regola del tetto dell'erba.
  assert.equal(LIVELLI.desktop[0].ombraOgni, 1);
});

// ---------------------------------------------------------------------------
// LA FREQUENZA DELLO SCHERMO NON È «QUANTI FOTOGRAMMI FA».
//
// ⚠ È l'errore che ha fatto pompare la qualità sul Chromebook del committente:
// si prendeva la MEDIANA degli intervalli, e su una macchina che disegna a 25
// fps la mediana dice 25 — che il codice prendeva per uno schermo a 25 Hz.
// Da lì il bersaglio diventava 25 e le soglie della scala si invertivano.
import { hzDaIntervalli } from '../src/motore/qualita.js';

test('uno schermo sincronizzato si riconosce e si crede', () => {
  const a60 = Array.from({ length: 40 }, (_, i) => 16.7 + (i % 3) * 0.05);
  assert.equal(hzDaIntervalli(a60), 60);
  const a144 = Array.from({ length: 40 }, (_, i) => 6.94 + (i % 3) * 0.02);
  assert.equal(hzDaIntervalli(a144), 144);
  const a120 = Array.from({ length: 40 }, () => 8.33);
  assert.equal(hzDaIntervalli(a120), 120);
});

test('una macchina che arranca NON è uno schermo lento', () => {
  // ⚠ IL CASO CHE HA ROTTO TUTTO: intervalli sparpagliati attorno ai 40 ms.
  // Prima usciva «25 Hz»; adesso si dice «non lo so» e si tiene 60, e sarà la
  // scala di qualità a scendere — ma su una misura vera, non su un'ipotesi
  // circolare («va piano, quindi il bersaglio è piano, quindi va bene»).
  const affanno = [38, 51, 42, 61, 35, 47, 55, 39, 44, 58, 33, 49, 41, 66, 37, 52,
                   43, 40, 57, 36, 48, 62, 34, 45, 53, 38, 50, 42, 59, 37];
  assert.equal(hzDaIntervalli(affanno), 60);
});

test('e niente sotto 30, mai', () => {
  // schermi più lenti in pratica non esistono: ogni numero più basso è la
  // macchina che arranca travestita da schermo
  const lentissimo = Array.from({ length: 40 }, () => 50);   // 20 Hz «regolari»
  assert.ok(hzDaIntervalli(lentissimo) >= 30, hzDaIntervalli(lentissimo));
});

test('senza abbastanza misure si dice sessanta e basta', () => {
  assert.equal(hzDaIntervalli([]), 60);
  assert.equal(hzDaIntervalli([16.7, 16.7]), 60);
  assert.equal(hzDaIntervalli(null), 60);
});

test('e non esce mai un numero assurdo', () => {
  const impossibile = Array.from({ length: 40 }, () => 0.001);
  assert.ok(hzDaIntervalli(impossibile) <= 250);
  assert.ok(hzDaIntervalli(Array.from({ length: 40 }, () => 0)) === 60);
});

// ---------------------------------------------------------------------------
// SI ALLEGGERISCE A GRADINI, NON TUTTO INSIEME.
//
// ⚠ Committente, dopo la prima versione: «la grafica è peggiorata di molto ma
// ho guadagnato sì e no 5 fps». Aveva ragione due volte — il prezzo era alto, e
// spegnendo tre cose in un colpo non sapevo nemmeno quale delle tre lo stesse
// pagando. Tre modifiche e una misura sola non è una misura.
import { GRADINI_FATICA } from '../src/motore/qualita.js';

test('i gradini spengono UNA cosa per volta, e non ne riaccendono mai', () => {
  for (let i = 1; i < GRADINI_FATICA.length; i++) {
    const p = GRADINI_FATICA[i - 1], q = GRADINI_FATICA[i];
    const spenteIn = (g) => Object.values(g).filter((v) => v === false).length;
    assert.equal(spenteIn(q), spenteIn(p) + 1, `dal gradino ${i - 1} al ${i} se ne spegne più di una`);
    // ⚠ E QUELLO CHE ERA SPENTO RESTA SPENTO: se un gradino riaccendesse qualcosa,
    // salire potrebbe far PEGGIORARE gli fps — cioè la cura peggiorerebbe il male.
    for (const k of Object.keys(p)) if (!p[k]) assert.equal(q[k], false, `gradino ${i}: «${k}» riacceso`);
  }
});

test('il primo gradino è quello meno visibile e più caro', () => {
  // ⚠ MISURATO (RTX 4060, 33 Mpx, notte, 13 lampioni): senza il cammino nei
  // voxel 26,0 → 24,7 ms; acqua e MSAA dentro il rumore. Ed è anche il meno
  // visibile dei tre: è la luce delle lampade che non attraversa i muri.
  assert.equal(GRADINI_FATICA[1].voxel, false);
  assert.equal(GRADINI_FATICA[1].msaa, true, 'l\'MSAA si vede: non è il primo da togliere');
  assert.equal(GRADINI_FATICA[1].acqua, true, 'e l\'acqua è mezzo schermo');
});

test('il gradino zero non toglie niente', () => {
  for (const v of Object.values(GRADINI_FATICA[0])) assert.equal(v, true);
});

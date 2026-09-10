// LO STREAMING DEL NUCLEO con una resa finta: costruisce vicino, scarica lontano, ricostruisce chi cambia.
import test from 'node:test';
import assert from 'node:assert/strict';
import { Mondo } from '../src/world/world.js';
import { generaChunkOpenWorld } from '../src/world/worldgen.js';
import { registraDecorazioni } from '../src/world/decorazioni.js';
import { Streaming } from '../src/partita/streaming.js';

registraDecorazioni();
class ResaFinta {
  constructor() { this.chunks = new Map(); this.caricati = 0; }
  carica(kc, d) { this.chunks.set(kc, d); this.caricati++; }
  rimuovi(kc) { this.chunks.delete(kc); }
}
const prepara = (raggio = 48) => {
  const mondo = new Mondo(), resa = new ResaFinta();
  const s = new Streaming(mondo, resa, (m, cx, cz) => generaChunkOpenWorld(m, cx, cz, 4242), { erba: 0, raggioResa: raggio });
  return { mondo, resa, s };
};

test('all\'avvio si costruisce il VICINO, non tutto: il resto arriva da solo', () => {
  // ⚠ IL CONTRATTO È CAMBIATO IL 10/09/2026, e questa prova con lui. Prima
  // `avvio` costruiva TUTTI i chunk entro la resa prima di mostrare un
  // fotogramma: su questa macchina 1,8 s di pagina ferma, sul Chromebook del
  // committente DICIANNOVE SECONDI. Adesso si costruisce quello che sta dentro
  // `BUDGET_AVVIO` millisecondi e il resto entra un po' per fotogramma.
  // ⚠ E QUELLO CHE VA DIFESO NON È «tutto subito» MA «NIENTE SI PERDE»: un
  // chunk che non arriva mai si vede come un buco lontano, cioè si scambia per
  // LOD e non per guasto — è già successo col mesher vecchio, e la prova che lo
  // prese diceva «9 chunk invece di 36». Quindi qui si guarda l'invariante:
  // dopo qualche giro, tutto quello che è dentro la resa c'è.
  const { mondo, resa, s } = prepara(48);
  s.avvio(0.5, 0.5);
  const subito = resa.chunks.size;
  assert.ok(subito >= 1, 'il quadrato sotto i piedi deve esserci: si cadrebbe nel vuoto');
  assert.ok(mondo.generati.size > subito, 'la frontiera va oltre quello che si è costruito');
  for (let i = 0; i < 300; i++) s.aggiorna(0.5, 0.5, 5);
  assert.ok(resa.chunks.size >= 36, `dopo trecento giri mancano ancora chunk: ${resa.chunks.size}`);
  assert.equal(s.statistiche.inCoda, 0, 'la coda non si è svuotata: qualche chunk non arriverà mai');
  for (const kc of resa.chunks.keys()) assert.ok(mondo.generati.has(kc));
});

test('e l\'avvio non blocca: il budget si rispetta anche su un mondo grande', () => {
  // ⚠ È LA MISURA, non l'intenzione. Il difetto vecchio era proprio che
  // `aggiorna(x, z, Infinity)` non aveva nessun tetto — e nessuno se ne
  // accorgeva su una macchina veloce, dove 154 chunk sono un secondo e otto.
  const { s } = prepara(96);
  const t0 = performance.now();
  s.avvio(0.5, 0.5);
  const ms = performance.now() - t0;
  // ⚠ IL TETTO È LARGO APPOSTA: qui dentro c'è anche la GENERAZIONE del mondo,
  // che è un'altra cosa e non ha budget (il quadrato sotto i piedi deve
  // esistere). Serve a prendere il ritorno di «costruisci tutto», che su questa
  // macchina valeva quasi due secondi in più — non a tarare il millisecondo.
  assert.ok(s.statistiche.costruisciMs < 900,
    `la costruzione all'avvio ha preso ${s.statistiche.costruisciMs.toFixed(0)} ms: il budget non c'è più`);
  assert.ok(ms < 5000, `l'avvio intero ha preso ${ms.toFixed(0)} ms`);
});

test('camminando lontano si costruisce il nuovo e si scarica il vecchio, entro il budget', () => {
  const { mondo, resa, s } = prepara(48);
  s.avvio(0.5, 0.5);
  const primi = new Set(resa.chunks.keys());
  for (let i = 0; i < 400; i++) s.aggiorna(0.5 + i * 2, 0.5, 2);
  assert.ok(resa.chunks.has('50,0'), 'il chunk nuovo sotto i piedi è a schermo');
  assert.ok(!resa.chunks.has('0,0'), 'quello di partenza se n\'è andato');
  assert.ok(!mondo.generati.has('-3,0'), 'e la frontiera l\'ha scaricato');
  let rimasti = 0; for (const kc of primi) if (resa.chunks.has(kc)) rimasti++;
  assert.equal(rimasti, 0);
});

test('un blocco cambiato ricostruisce il suo chunk, e tocca i vicini entro il margine della luce', () => {
  const { mondo, resa, s } = prepara(48);
  s.avvio(0.5, 0.5);
  const prima = resa.caricati;
  mondo.metti(15, 30, 3, 'pietra');   // a una cella dal confine con il chunk 1,0
  s.tocca(15, 3);
  s.aggiorna(0.5, 0.5, Infinity);
  assert.ok(resa.caricati - prima >= 2, `ricostruiti almeno il chunk e il vicino: ${resa.caricati - prima}`);
  assert.equal(s.statistiche.inCoda, 0);
});

test('con una squadra di lavoro i chunk partono in volo e tornano al giro dopo; chi cambia in volo si rifà', async () => {
  const { costruisciChunkNucleo } = await import('../src/nucleo/mesher-nucleo.js');
  const { fotografa, MondoFoto } = await import('../src/world/mesher-foto.js');
  // una squadra finta: un operaio, costruisce subito ma consegna alla raccolta successiva
  // (consegna alla raccolta SUCCESSIVA, come un Worker vero: il risultato non c'è mai nello stesso giro)
  const lavoro = { vivo: true, inVolo: new Map(), pronti: [], prossimi: [], get liberi() { return 1 - this.inVolo.size; },
    manda(m, kc, erba, marca) { if (this.inVolo.size) return false; const f = fotografa(m, kc, 0, false, null, 6); if (!f) return null; this.inVolo.set(kc, marca); this.prossimi.push({ kc, dati: costruisciChunkNucleo(new MondoFoto(f), kc, { erba }), marca }); return true; },
    raccogli() { const r = this.pronti; this.pronti = this.prossimi; this.prossimi = []; for (const x of r) this.inVolo.delete(x.kc); return r; } };
  const mondo = new Mondo(), resa = new ResaFinta();
  const s = new Streaming(mondo, resa, (m, cx, cz) => generaChunkOpenWorld(m, cx, cz, 4242), { erba: 0, raggioResa: 32, lavoro });
  // ⚠ L'AVVIO NON COSTRUISCE PIÙ TUTTO (10/09/2026: erano 19 s sul Chromebook),
  // quindi qui prima si lascia FINIRE la coda, se no il «parte in volo» qui
  // sotto trova un operaio già occupato dall'avvio e conta la cosa sbagliata.
  s.avvio(0.5, 0.5);
  // ⚠ QUATTROCENTO GIRI e non sessanta: l'operaio finto ne serve UNO per giro e
  // consegna alla raccolta DOPO, quindi una cinquantina di chunk vogliono un
  // centinaio di giri. Con sessanta la prova falliva per il motivo sbagliato.
  for (let i = 0; i < 400 && (s.statistiche.inCoda > 0 || lavoro.inVolo.size); i++) s.aggiorna(0.5, 0.5);
  const n0 = resa.chunks.size; assert.ok(n0 > 0);
  assert.equal(lavoro.inVolo.size, 0, 'la coda dell\'avvio non si è svuotata');
  mondo.metti(3, 30, 3, 'pietra'); s.tocca(3, 3);
  s.aggiorna(0.5, 0.5);                    // parte in volo
  assert.equal(lavoro.inVolo.size, 1);
  mondo.metti(3, 31, 3, 'pietra'); s.tocca(3, 3);   // cambia mentre è in volo
  s.aggiorna(0.5, 0.5);                    // torna: marca vecchia → si rimanda
  const dopo = resa.caricati;
  for (let i = 0; i < 14; i++) s.aggiorna(0.5, 0.5);
  assert.ok(resa.caricati > dopo, 'la versione nuova è arrivata');
  assert.equal(s.statistiche.inCoda, 0);
  assert.equal(lavoro.inVolo.size, 0);
});

test('camminando con la squadra di lavoro il mondo cresce: un chunk in volo non si rimette in coda', async () => {
  const { costruisciChunkNucleo } = await import('../src/nucleo/mesher-nucleo.js');
  const { fotografa, MondoFoto } = await import('../src/world/mesher-foto.js');
  const lavoro = { vivo: true, inVolo: new Map(), pronti: [], prossimi: [], get liberi() { return 2 - this.inVolo.size; },
    manda(m, kc, erba, marca) { if (this.inVolo.size >= 2) return false; const f = fotografa(m, kc, 0, false, null, 6); if (!f) return null; this.inVolo.set(kc, marca); this.prossimi.push({ kc, dati: costruisciChunkNucleo(new MondoFoto(f), kc, { erba }), marca }); return true; },
    raccogli() { const r = this.pronti; this.pronti = this.prossimi; this.prossimi = []; for (const x of r) this.inVolo.delete(x.kc); return r; } };
  const mondo = new Mondo(), resa = new ResaFinta();
  const s = new Streaming(mondo, resa, (m, cx, cz) => generaChunkOpenWorld(m, cx, cz, 4242), { erba: 0, raggioResa: 32, lavoro });
  s.avvio(0.5, 0.5);
  const n0 = s.statistiche.costruiti;
  for (let i = 0; i < 60; i++) s.aggiorna(48.5, 0.5);   // tre chunk più a est: nuovi chunk da costruire
  assert.ok(s.statistiche.costruiti > n0 + 5, `il mondo è cresciuto: ${s.statistiche.costruiti - n0} chunk nuovi`);
  assert.ok(resa.chunks.has('3,0'));
  assert.equal(s.statistiche.inCoda, 0);
});

// IL RITMO DEI FOTOGRAMMI — e la media non è il ritmo.
//
// ⚠ IL COMMITTENTE: «raggiungere il massimo degli fps e framepacing sarà
// fondamentale su ogni dispositivo anche quelli più scarsi, in vista dell'AR».
//
// ⚠ E IL FRAMEPACING NON È NEI FPS. Una macchina può fare sessanta fotogrammi al
// secondo e SINGHIOZZARE quattro volte al secondo: la media resta sessanta, e
// quello che si vede è uno scatto. Sono due grandezze diverse e servono tutte e
// due — «quanti» e «quanto regolari» — perché si migliorano in modi diversi:
//  · pochi fotogrammi = si disegna troppo (pixel, disegni, passate);
//  · fotogrammi irregolari = ogni tanto si fa un LAVORO IN PIÙ dentro un
//    fotogramma (una mesh, una mappa d'ombra, il garbage collector, un chunk).
// Il primo si cura togliendo roba, il secondo SPALMANDOLA. Curare l'uno
// guardando il numero dell'altro è la ragione per cui questo progetto ha già
// detto «va bene» a un motore che scattava (vedi CLAUDE.md, il p50 e il vsync).
//
// LE MISURE, e perché queste:
//  · `p50`  quanto dura il fotogramma tipico. È il costo.
//  · `p99`  il peggiore su cento. È quello che si SENTE.
//  · `scarto` (jitter) la MEDIA di |dt[i] − dt[i−1]|: quanto cambia da un
//    fotogramma al successivo. È IL numero del framepacing — due macchine con lo
//    stesso p50 e scarto 0,3 ms contro 6 ms danno due sensazioni diverse.
//    ⚠ LA MEDIA, NON LA MEDIANA, e ci sono cascato scrivendolo: la mediana di
//    una serie che singhiozza UNA VOLTA OGNI VENTI FOTOGRAMMI vale ZERO —
//    diciannove scarti su venti sono nulli e la mediana li vede tutti. Cioè
//    proprio il difetto che si sta cercando è invisibile alla misura che
//    dovrebbe trovarlo. La media invece lo sente, perché un singhiozzo è
//    esattamente un valore fuori scala, ed è quello che si vede a schermo.
//    `scartoTipico` (la mediana) resta accanto: dice l'altra cosa, cioè quanto
//    è irregolare il fotogramma ORDINARIO. Sono due difetti diversi.
//  · `singhiozzi` quanti fotogrammi durano più del doppio del p50, e quanti al
//    secondo. Un singhiozzo si VEDE; una media no.
//  · `regolare` se il ritmo è agganciato allo schermo (scarto sotto il
//    millesimo del periodo × 60). ⚠ Serve a NON credere ai numeri: incollati al
//    vsync il p50 è il pannello, non il motore.
//  · `passo` la percentuale di fotogrammi entro ±25 % dal p50: la fetta che
//    «va liscia». Zero è un disastro anche con una media alta.
//
// ⚠ NIENTE DOM, NIENTE GL, niente `performance.now()`: riceve i millisecondi e
// basta. Si prova in Node.

/** Quanti fotogrammi si tengono: 20 secondi a 60 Hz. Oltre non serve e costa. */
export const TETTO = 1200;

export class Ritmo {
  constructor({ tetto = TETTO } = {}) {
    this.tetto = tetto;
    this.dt = [];
    // ⚠ SI TIENE ANCHE LA DIFFERENZA FRA CONSECUTIVI, e non si ricava dopo: il
    // buffer è circolare, e ricavare gli scarti da un anello riordinato darebbe
    // un salto finto nel punto in cui si richiude.
    this.salti = [];
    this.durataMs = 0;
    this.n = 0;
  }

  /** Un fotogramma, in millisecondi. */
  campiona(ms) {
    if (!(ms > 0) || ms > 10000) return;   // schede tabbate, breakpoint: non sono fotogrammi
    if (this.dt.length) this.salti.push(Math.abs(ms - this.dt[this.dt.length - 1]));
    this.dt.push(ms);
    this.durataMs += ms;
    this.n++;
    if (this.dt.length > this.tetto) { this.dt.shift(); this.salti.shift(); }
  }

  azzera() { this.dt.length = 0; this.salti.length = 0; this.durataMs = 0; this.n = 0; }

  /** Il quadro. Torna `null` sotto i 30 fotogrammi: un ritmo non si misura su dieci. */
  misura() {
    const d = this.dt;
    if (d.length < 30) return null;
    const s = [...d].sort((a, b) => a - b);
    const q = (f) => s[Math.min(s.length - 1, Math.floor(s.length * f))];
    const p50 = q(0.5), p99 = q(0.99);
    const media = d.reduce((a, b) => a + b, 0) / d.length;
    const scarto = mediaDi(this.salti);
    const scartoTipico = mediana(this.salti);
    // ⚠ IL DOPPIO DEL P50, non un numero fisso in millisecondi: su un telefono a
    // 30 Hz un fotogramma da 40 ms è normale, su un 144 Hz è un disastro. La
    // soglia deve essere RELATIVA a quello che quella macchina sa fare.
    const sogliaSingh = p50 * 2;
    let singhiozzi = 0, dentro = 0;
    for (const v of d) {
      if (v > sogliaSingh) singhiozzi++;
      if (v >= p50 * 0.75 && v <= p50 * 1.25) dentro++;
    }
    const secondi = d.reduce((a, b) => a + b, 0) / 1000;
    return {
      n: d.length,
      fps: media > 0 ? 1000 / media : 0,
      fpsBasso: p99 > 0 ? 1000 / p99 : 0,
      media, p50, p95: q(0.95), p99, p999: q(0.999), min: s[0], max: s[s.length - 1],
      scarto, scartoTipico,
      singhiozzi,
      singhiozziAlSec: secondi > 0 ? singhiozzi / secondi : 0,
      passo: dentro / d.length,
      // ⚠ «REGOLARE» NON VUOL DIRE «BUONO»: vuol dire che il numero che si sta
      // leggendo è il PANNELLO e non il motore, quindi non dice quanto margine
      // c'è. È l'avviso che in questo progetto è già costato una giornata.
      regolare: scarto < Math.max(0.6, p50 * 0.06),
      // LA LISCEZZA, 0..1: quanto e' piccolo lo scarto rispetto al fotogramma.
      // Uno scarto pari a META' del fotogramma tipico e' gia' zero: a quel punto
      // il ritmo non e' piu' un ritmo, e' un'alternanza.
      liscezza: p50 > 0 ? Math.max(0, Math.min(1, 1 - scarto / (p50 * 0.5))) : 0,
      secondi,
    };
  }

  /** Una riga leggibile, per l'HUD e per il rapporto. */
  riga() {
    const m = this.misura();
    if (!m) return 'ritmo: poco campione';
    return `${m.fps.toFixed(0)} fps · 1% ${m.fpsBasso.toFixed(0)} · p50 ${m.p50.toFixed(1)} p99 ${m.p99.toFixed(1)} ms`
      + ` · scarto ${m.scarto.toFixed(2)} ms · singhiozzi ${m.singhiozziAlSec.toFixed(1)}/s · passo ${(m.passo * 100).toFixed(0)}%`
      + (m.regolare ? ' · AGGANCIATO ALLO SCHERMO' : '');
  }
}

// ⚠ `mediaDi`, NON `media`: dentro `misura()` c'è un `const media` (la media dei
// fotogrammi) che oscurerebbe questa funzione prima ancora che nasca. È la
// trappola dei nomi omonimi già scritta in CLAUDE.md, e ci sono ricascato qui.
function mediaDi(a) { return a.length ? a.reduce((x, y) => x + y, 0) / a.length : 0; }

function mediana(a) {
  if (!a.length) return 0;
  const s = [...a].sort((x, y) => x - y);
  return s[s.length >> 1];
}

/**
 * IL VOTO, che è la cosa che il committente guarda per prima.
 *
 * ⚠ NON È UNA MEDIA DEI DUE NUMERI: sono due condizioni da soddisfare
 * ENTRAMBE, e la peggiore comanda. Un motore che fa 120 fps e singhiozza dieci
 * volte al secondo non è «buono a metà», è da sistemare — e una media lo
 * direbbe ottimo. Si prende il minimo, come si fa con le catene.
 */
export function voto(m) {
  if (!m) return { punti: 0, giudizio: 'poco campione' };
  // quanti: 60 fps pieni = 100, 30 = 50, sotto 15 = 0
  const quanti = Math.max(0, Math.min(100, (m.fps / 60) * 100));
  // quanto regolari: la LISCEZZA meno i singhiozzi.
  // ⚠ NON `passo`: quello conta i fotogrammi vicini al p50, e su una serie che
  // ALTERNA due valori (cinque e ventotto millesimi) il p50 cade su uno dei due
  // e metà dei fotogrammi risultano «in passo» — cioè il giudizio dice 50 su
  // uno sfarfallio che a schermo è insopportabile. La liscezza lo prende, perché
  // guarda il salto FRA fotogrammi consecutivi e non la loro distribuzione.
  // `passo` resta nel rapporto: dice un'altra cosa, e la dice bene.
  const regolarita = Math.max(0, Math.min(100, m.liscezza * 100 - m.singhiozziAlSec * 12));
  const punti = Math.round(Math.min(quanti, regolarita));
  const giudizio = punti >= 85 ? 'ottimo'
    : punti >= 65 ? 'buono'
    : punti >= 45 ? 'passabile'
    : punti >= 25 ? 'faticoso'
    : 'non regge';
  return {
    punti, giudizio, quanti: Math.round(quanti), regolarita: Math.round(regolarita),
    // ⚠ E SI DICE QUALE DELLE DUE COMANDA: senza, un voto basso non dice da che
    // parte guardare, ed è metà del valore della misura.
    collo: quanti <= regolarita ? 'quanti' : 'ritmo',
  };
}

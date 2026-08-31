// IL RAPPORTO DI DIAGNOSTICA — quello che si sa della macchina, in un oggetto.
//
// ⚠ Committente: «non riesci a creare un bottone manda diagnostica, così in
// automatico ti arriva tutto?». Sì, e il pezzo che conta è QUESTO: decidere
// cosa entra nel rapporto. Fin qui ho lavorato su scatti dello schermo mandati a
// mano, e ogni volta mancava proprio il numero che serviva — perché il pannello
// mostra quello che ci sta, non quello che serve a quella domanda lì.
//
// ⚠ È UNA FUNZIONE PURA, e non è pedanteria: un rapporto di diagnostica è
// esattamente la cosa che non ci si accorge di aver rotto. Se un giorno smette
// di mettere dentro gli fps, il sintomo è che i rapporti arrivano e sembrano a
// posto — solo che non c'è più il numero che serve. Le prove qui sotto guardano
// che i campi ci siano tutti, e che il gettone NON ci sia mai.

/** I campi senza i quali un rapporto non serve a niente. */
export const CAMPI_OBBLIGATORI = ['quando', 'dispositivo', 'schermo', 'qualita', 'prestazioni', 'mondo'];

/** Quanti errori si portano dietro. Oltre, sono quasi sempre lo stesso ripetuto. */
export const MAX_ERRORI = 12;

/**
 * COSTRUISCE IL RAPPORTO.
 *
 * ⚠ PRENDE LETTURE GIÀ FATTE, non oggetti vivi: così si può provare in Node
 * senza un motore, e soprattutto così è chiaro a colpo d'occhio COSA esce di
 * qui — che per una cosa che parte dalla macchina di qualcuno è la domanda
 * importante.
 *
 * ⚠ E NON C'È NIENTE DI PERSONALE QUI DENTRO. Solo roba tecnica: che scheda
 * video, quanti fotogrammi, quanti triangoli. Nessun nome, nessun percorso di
 * file, nessun indirizzo. Se un giorno servisse aggiungere qualcosa, questa
 * riga è il posto dove fermarsi a pensarci.
 */
export function costruisciRapporto(l = {}) {
  const num = (v, d = 1) => (typeof v === 'number' && isFinite(v) ? +v.toFixed(d) : null);
  return {
    quando: l.quando || null,
    gioco: 'Leafy-Shadows',
    // ⚠ DA QUALE BUILD ARRIVA, e questa riga è nata da un errore che è costato
    // due giri: il committente mandava scatti da una pagina pubblicata FERMA a
    // ieri, e sia lui che io leggevamo quei numeri come se fossero di adesso.
    // Un rapporto che non dice di quale versione parla non è una misura, è un
    // aneddoto. Lo scrive «scripts/pubblica.mjs» in fondo alla pagina.
    versione: l.versione || 'in sviluppo',
    nota: typeof l.nota === 'string' ? l.nota.slice(0, 400) : '',
    dispositivo: {
      classe: l.mobile ? 'mobile' : 'desktop',
      tocco: !!l.tocco,
      modoGui: l.modoGui || 'auto',
      ua: (l.ua || '').slice(0, 220),
      cpu: l.cpu || null,
      memoriaGB: l.memoriaGB || null,
    },
    schermo: {
      css: l.css || null,
      reso: l.reso || null,
      dpr: num(l.dpr, 3),
      // ⚠ IL RAPPORTO FRA I DUE È IL NUMERO CHE DISTINGUE «l'immagine è sporca»
      // da «l'immagine è INGRANDITA», e le due cose a occhio si somigliano. Ci
      // ho già perso un giro dietro a un'acne che non c'era.
      rapporto: l.css && l.reso && l.css[0] ? num(l.reso[0] / l.css[0], 2) : null,
    },
    qualita: {
      livello: l.livello, di: l.quantiLivelli, manuale: !!l.manuale,
      profilo: l.profilo || null,
      ombreLampade: !!l.ombreLampade, antialias: !!l.antialias,
    },
    prestazioni: {
      fps: num(l.fps, 0), p50ms: num(l.p50, 2), p99ms: num(l.p99, 2),
      disegni: l.disegni ?? null,
      triangoli: l.triangoli ?? null,
      ombreMs: num(l.ombreMs, 2),
      // ⚠ LA STORIA VALE PIÙ DELL'ISTANTE: un p99 alto una volta è un caso, e
      // un gradino che scende tre volte in un minuto è un difetto. Da uno scatto
      // dello schermo questa non si vede mai.
      storiaFps: Array.isArray(l.storiaFps) ? l.storiaFps.slice(-60).map((v) => Math.round(v)) : [],
      storiaLivelli: Array.isArray(l.storiaLivelli) ? l.storiaLivelli.slice(-20) : [],
    },
    scheda: { nome: (l.scheda || '').slice(0, 120), software: !!l.software },
    mondo: {
      chunk: l.chunk ?? null, blocchi: l.blocchi ?? null,
      luci: l.luci ?? null, decorazioni: l.decorazioni ?? null,
      erba: l.erba ?? null, ora: l.ora || null, giorno: l.giorno ?? null,
      worldgenMs: num(l.worldgenMs, 0), meshMs: num(l.meshMs, 0),
    },
    errori: (l.errori || []).slice(-MAX_ERRORI).map((e) => String(e).slice(0, 500)),
    // ⚠ LO SCATTO È FACOLTATIVO e sta in fondo: è il campo grosso, e se il
    // rapporto va letto in un terminale conviene che i numeri vengano prima.
    scatto: l.scatto || null,
  };
}

/**
 * QUANTO PESA, in kilobyte. ⚠ Serve prima di mandarlo: uno scatto a piena
 * risoluzione da un telefono con dpr 3 sono megabyte, e un rapporto che non
 * parte è peggio di un rapporto senza figura.
 */
export function pesoKB(rapporto) {
  return Math.round(JSON.stringify(rapporto).length / 1024);
}

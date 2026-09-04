// I REGISTRI DELLA PARTITA — le manopole dell'Officina per il sandbox.
//
// Ogni registro sta accanto a quello che governa (la regola dell'Officina,
// `officina/index.js`): qui stanno quelli del nucleo e della partita, e
// `partita.js` li mette in fila. Niente nomi interni di un motore che non
// c'è: `leggi`/`scrivi` toccano la resa, i corpi, lo streaming, il giorno.
//
// ⚠ NIENTE DOM: torna oggetti nella forma di `officina/schema.js`, e si
// prova in Node (`test/registri-partita.test.mjs`).

export function registroResa(resa, bagliori = null) {
  return {
    chiave: 'resa', nome: 'Resa del nucleo',
    nota: 'Lo specchio e l\'ombra si possono spegnere per misurare quanto costano: la grafica è la stessa ovunque, il 🩺 dice i fotogrammi.',
    campi: [
      { chiave: 'ombra', nome: 'ombra del sole (horizon mapping)', tipo: 'interruttore', leggi: () => !!resa.ombra, scrivi: (v) => (resa.ombra = !!v) },
      { chiave: 'specchio', nome: 'specchio dell\'acqua', tipo: 'interruttore', leggi: () => !!resa.specchio.attivo, scrivi: (v) => (resa.specchio.attivo = !!v) },
      { chiave: 'scalaSpecchio', nome: 'risoluzione dello specchio', tipo: 'numero', min: 0.2, max: 1, passo: 0.05, leggi: () => resa.specchio.scala, scrivi: (v) => (resa.specchio.scala = v) },
      { chiave: 'vediSpecchio', nome: 'mostra lo specchio nudo', tipo: 'interruttore', leggi: () => !!resa.specchio.mostra, scrivi: (v) => (resa.specchio.mostra = !!v) },
      { chiave: 'bagliori', nome: 'bagliori delle lanterne (sprite additivi)', tipo: 'interruttore', leggi: () => !!(bagliori && bagliori.attivo), scrivi: (v) => { if (bagliori) bagliori.attivo = !!v; } },
      { chiave: 'erbaFinoA', nome: 'fili d\'erba fino a', tipo: 'numero', min: 0, max: 160, passo: 16, unita: 'blocchi', leggi: () => resa.erbaFinoA, scrivi: (v) => (resa.erbaFinoA = v) },
      { chiave: 'nebbiaDa', nome: 'nebbia da', tipo: 'numero', min: 8, max: 200, passo: 4, unita: 'blocchi', leggi: () => resa.nebbia.da, scrivi: (v) => (resa.nebbia.da = Math.min(v, resa.nebbia.a - 4)) },
      { chiave: 'nebbiaA', nome: 'nebbia piena a', tipo: 'numero', min: 12, max: 240, passo: 4, unita: 'blocchi', leggi: () => resa.nebbia.a, scrivi: (v) => (resa.nebbia.a = Math.max(v, resa.nebbia.da + 4)) },
      { chiave: 'disegni', nome: 'disegni (solidi + specchio)', tipo: 'lettura', leggi: () => `${resa.statistiche.disegni} + ${resa.statistiche.disegniSpecchio}` },
      { chiave: 'chunk', nome: 'chunk visti / totali', tipo: 'lettura', leggi: () => `${resa.statistiche.chunkVisti} / ${resa.statistiche.chunkTotali}` },
    ],
  };
}

export function registroStile(resa) {
  return {
    chiave: 'stile', nome: 'Stile',
    nota: 'L\'ombra di Leafy è il colore stesso con la tinta spostata verso il blu, un po\' più satura e più scura. Qui si tarano i tre numeri, e si accendono o spengono i pezzi della luce.',
    campi: [
      { chiave: 'tinta', nome: 'ombra: spostamento di tinta verso il blu', tipo: 'numero', min: 0, max: 0.3, passo: 0.01, leggi: () => resa.stile.tinta, scrivi: (v) => (resa.stile.tinta = v) },
      { chiave: 'saturazione', nome: 'ombra: saturazione', tipo: 'numero', min: 0.6, max: 1.6, passo: 0.05, leggi: () => resa.stile.saturazione, scrivi: (v) => (resa.stile.saturazione = v) },
      { chiave: 'valore', nome: 'ombra: quanto è scura (valore)', tipo: 'numero', min: 0.3, max: 1, passo: 0.02, leggi: () => resa.stile.valore, scrivi: (v) => (resa.stile.valore = v) },
      { chiave: 'mappa', nome: 'mappa d\'ombra vera (forma delle cose)', tipo: 'interruttore', leggi: () => !!resa.mappa.attiva, scrivi: (v) => (resa.mappa.attiva = !!v) },
      { chiave: 'mappaRaggio', nome: 'mappa d\'ombra: raggio', tipo: 'numero', min: 16, max: 64, passo: 4, unita: 'blocchi', leggi: () => resa.mappa.raggio, scrivi: (v) => { resa.mappa.raggio = v; resa.mappa.sporca = true; resa.mappa.centro = [1e9, 0, 1e9]; } },
      { chiave: 'lampade', nome: 'pozze dei lampioni (cerchi)', tipo: 'interruttore', leggi: () => resa.lampadeAccese !== false, scrivi: (v) => (resa.lampadeAccese = !!v) },
    ],
  };
}

export function registroMeteo(meteo) {
  return {
    chiave: 'meteo', nome: 'Meteo',
    nota: 'Il mare: 0 è uno specchio, 1 è mosso. Muoverlo a mano spegne il vagare automatico.',
    campi: [
      { chiave: 'auto', nome: 'meteo che cambia da solo', tipo: 'interruttore', leggi: () => !!meteo.auto, scrivi: (v) => (meteo.auto = !!v) },
      { chiave: 'mare', nome: 'mare mosso', tipo: 'numero', min: 0, max: 1, passo: 0.02, leggi: () => +meteo.agitazione.toFixed(2), scrivi: (v) => { meteo.auto = false; meteo.agitazione = v; meteo.meta = v; } },
    ],
  };
}

export function registroGiornoPartita(giorno) {
  return {
    chiave: 'giorno', nome: 'Giorno',
    nota: 'Muovere l\'ora spegne il ciclo automatico.',
    campi: [
      { chiave: 'auto', nome: 'ciclo automatico', tipo: 'interruttore', leggi: () => !!giorno.auto, scrivi: (v) => (giorno.auto = !!v) },
      { chiave: 'ora', nome: 'ora del giorno', tipo: 'numero', min: 0, max: 1, passo: 0.002, leggi: () => giorno.ora, scrivi: (v) => { giorno.auto = false; giorno.ora = v; } },
      { chiave: 'durata', nome: 'quanto dura un giorno', tipo: 'numero', min: 30, max: 1800, passo: 30, unita: 's', leggi: () => giorno.durata, scrivi: (v) => (giorno.durata = v) },
      { chiave: 'orologio', nome: 'orologio', tipo: 'lettura', leggi: () => `${String(Math.floor(giorno.ora * 24)).padStart(2, '0')}:${String(Math.floor((giorno.ora * 24 % 1) * 60)).padStart(2, '0')}` },
    ],
  };
}

export function registroCorpi(corpi, lancia) {
  return {
    chiave: 'corpi', nome: 'Corpi (fisica)',
    nota: 'Scatole a passo fisso (60 Hz), un asse per volta. Il tetto è 800.',
    campi: [
      { chiave: 'quanti', nome: 'corpi', tipo: 'lettura', leggi: () => `${corpi.statistiche.corpi} (${corpi.statistiche.svegli} svegli)` },
      { chiave: 'lancia20', nome: '🎲 lancia venti', tipo: 'azione', fai: () => lancia(20) },
      { chiave: 'lancia200', nome: '🎲 lancia duecento', tipo: 'azione', fai: () => lancia(200) },
      { chiave: 'svuota', nome: '🧹 togli tutti', tipo: 'azione', fai: () => corpi.svuota() },
    ],
  };
}

export function registroStreaming(streaming) {
  return {
    chiave: 'streaming', nome: 'Mondo in streaming',
    nota: 'La frontiera genera 32 blocchi oltre la resa; la coda costruisce entro il budget, almeno un chunk a giro.',
    campi: [
      { chiave: 'raggio', nome: 'raggio di resa', tipo: 'numero', min: 48, max: 160, passo: 16, unita: 'blocchi', leggi: () => streaming.raggioResa, scrivi: (v) => (streaming.raggioResa = v) },
      { chiave: 'budget', nome: 'budget di costruzione', tipo: 'numero', min: 1, max: 16, passo: 1, unita: 'ms', leggi: () => streaming.budgetMs, scrivi: (v) => (streaming.budgetMs = v) },
      { chiave: 'erba', nome: 'densità dell\'erba (ai prossimi chunk)', tipo: 'numero', min: 0, max: 8, passo: 1, leggi: () => streaming.erba, scrivi: (v) => (streaming.erba = v) },
      { chiave: 'stato', nome: 'coda / costruiti / scaricati', tipo: 'lettura', leggi: () => `${streaming.statistiche.inCoda} / ${streaming.statistiche.costruiti} / ${streaming.statistiche.scaricati}` },
    ],
  };
}

export function registroGiocatore(stato) {
  return {
    chiave: 'giocatore', nome: 'Giocatore',
    campi: [
      { chiave: 'volo', nome: 'vola', tipo: 'interruttore', leggi: () => !!stato.volo, scrivi: (v) => stato.impostaVolo(!!v) },
      { chiave: 'terza', nome: 'terza persona', tipo: 'interruttore', leggi: () => !!stato.terza, scrivi: (v) => stato.impostaTerza(!!v) },
      { chiave: 'cameraTira', nome: 'la camera si tira dentro davanti a un muro', tipo: 'interruttore', leggi: () => !!(stato.cameraTira && stato.cameraTira()), scrivi: (v) => stato.impostaCameraTira && stato.impostaCameraTira(!!v) },
      { chiave: 'buco', nome: 'buco di visuale (al posto della sagoma)', tipo: 'interruttore', leggi: () => !!(stato.buco && stato.buco()), scrivi: (v) => stato.impostaBuco && stato.impostaBuco(!!v) },
      { chiave: 'miraCentro', nome: 'mira al centro (mirino) invece che dove sta il dito', tipo: 'interruttore', leggi: () => !!(stato.miraCentro && stato.miraCentro()), scrivi: (v) => stato.impostaMiraCentro && stato.impostaMiraCentro(!!v) },
      { chiave: 'dove', nome: 'dove', tipo: 'lettura', leggi: () => stato.dove() },
      { chiave: 'casa', nome: '🏠 torna all\'origine', tipo: 'azione', fai: () => stato.aCasa() },
      { chiave: 'modifiche', nome: 'modifiche salvate', tipo: 'lettura', leggi: () => stato.modifiche ? stato.modifiche() : 0 },
      { chiave: 'nuovo', nome: '🗑 mondo nuovo (butta le modifiche)', tipo: 'azione', fai: () => stato.nuovo && stato.nuovo() },
    ],
  };
}

/** Le scene: l'open world o lo zoo di prova. Cambiare scena ricarica la pagina. */
export function registroScene(stato) {
  return {
    chiave: 'scene', nome: 'Scene',
    nota: 'Lo zoo è il piano di prova: vasca, scalinata, muro dei materiali, viale dei lampioni, lampade colorate, arredi. Cambiare scena ricarica la pagina.',
    campi: [
      { chiave: 'dove', nome: 'scena', tipo: 'lettura', leggi: () => (stato.vetrina ? 'vetrina nel nero' : stato.zoo ? 'zoo di prova' : `open world, seme ${stato.seme}`) },
      { chiave: 'vetrina', nome: '🖼 vai alla vetrina (la concept art nel nero)', tipo: 'azione', fai: () => { if (typeof location !== 'undefined') location.search = '?vetrina&officina&terza&ora=0.38'; } },
      { chiave: 'zoo', nome: '🦁 vai allo zoo', tipo: 'azione', fai: () => { if (typeof location !== 'undefined') location.search = '?zoo&officina&terza'; } },
      { chiave: 'mondo', nome: '🌍 torna all\'open world', tipo: 'azione', fai: () => { if (typeof location !== 'undefined') location.search = `?seme=${stato.seme}&officina`; } },
    ],
  };
}

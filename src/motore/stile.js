// LO STILE DI LEAFY, in un posto solo.
//
// ⚠ QUESTA È LA CORREZIONE PIÙ IMPORTANTE DELLA MIGRAZIONE, e me l'ha fatta il
// committente guardando: «non esiste un colore diverso da ombra o non in ombra,
// mentre ora le facce ottengono luce e ombre in modo semi realistico».
//
// Accettare il modello di illuminazione del motore voleva dire accettare il suo
// modo di CALCOLARE le ombre — la mappa a cascata, che è la cosa per cui abbiamo
// cambiato libreria. NON voleva dire accettare il suo modo di DIPINGERLE. Con lo
// StandardMaterial nudo ogni faccia prende il suo N·L: la cima chiara, i fianchi
// via via più scuri, una rampa continua col sole che gira. È rendering corretto
// ed è lo stile sbagliato.
//
// Lo stile di Leafy è scritto per esteso in Leafy-Lantern, e vale la pena
// ricopiarlo qui perché è una decisione, non una mancanza:
//
//   «COLORI PIATTI DA PALETTE, ED È UNA SCELTA GRAFICA. Qui NON c'è
//   ombreggiatura per direzione di faccia e NON c'è occlusione ambientale: un
//   tentativo le aveva aggiunte entrambe ed è stato BOCCIATO. Lo stacco fra le
//   facce lo dà GIÀ coloreFaccia() scegliendo cima/lato/fondo dalla palette.»
//
// Cioè: il volume c'è già, cotto nei colori dei vertici dal mesher. Aggiungerci
// sopra un secondo moltiplicatore continuo lo sporca.
//
// E l'ombra:
//
//   «L'OMBRA NON È NERA, È DEL COLORE DEL CIELO. Fuori, all'ombra, non c'è meno
//   luce e basta: c'è LUCE DIVERSA — quella del cielo. Moltiplicare l'ambiente
//   per un numero scuro sposta tutto verso il nero e appiattisce; moltiplicarlo
//   per un COLORE scurisce E vira insieme. Il salto resta uno solo.»
//
// ── COME SI OTTIENE, DENTRO UN MOTORE CHE VUOLE ILLUMINARE ──────────────────
//
// Il trucco è di una riga, e sta tutto nel fatto che a noi del calcolo della
// luce interessa UN SOLO NUMERO: sì/no all'ombra.
//
// Prima del ciclo delle luci si scrive `normalW` uguale alla direzione del sole.
// Da quel momento N·L vale 1 su OGNI faccia, quindi il motore, che continua a
// fare il suo mestiere, accumula in `diffuseBase` esattamente il fattore d'ombra
// della mappa a cascata e nient'altro. Poi lo si taglia a gradini e lo si usa
// come voleva Leafy. Il motore calcola l'ombra; noi la dipingiamo.
//
// ⚠ E LA NORMALE VERA NON SERVIVA PIÙ A NIENTE ma continua a servire alla mappa:
// lo scostamento per normale (`normalBias`) si applica nel VERTEX shader, con la
// normale vera, prima che noi tocchiamo qualsiasi cosa. Sostituirla nel fragment
// non lo disturba.

import { Color3 } from '@babylonjs/core/Maths/math.color.js';
import { Vector3 } from '@babylonjs/core/Maths/math.vector.js';
// ⚠ Le uniform NON vanno dichiarate a mano: `AddUniform` di CustomMaterial
// emette lei la riga `uniform vec4 uLuciPos[24];` e la concatena alle
// definizioni del fragment. Dichiararle anche in `Fragment_Definitions` darebbe
// una doppia dichiarazione e lo shader non compila.
import { LUCI_MAX, glslAccumuloLuci, GLSL_OMBRA_VOXEL } from './luci.js';

/** I gradini dell'ombra. In Leafy-Lantern è `BANDE_LUCE` in config.js, e sono
 *  «i gradini che il committente ha indicato come metro della nettezza». */
export const BANDE = 3;

/**
 * L'ESPONENTE DELLO SPAZIO DI VISUALIZZAZIONE.
 *
 * ⚠ 2,2 È L'APPROSSIMAZIONE, non la curva sRGB esatta (che ha un tratto lineare
 * vicino allo zero). La differenza sta sotto l'uno per cento tranne nei toni
 * quasi neri, e in cambio è un `pow` invece di un ramo per canale. Quello che
 * conta davvero è che i due esponenti siano l'UNO L'INVERSO DELL'ALTRO: così
 * decodifica e ricodifica si annullano esattamente dove non c'è luce di mezzo,
 * ed è per questo che la nebbia all'orizzonte combacia col cielo.
 */
export const GAMMA = 2.2;

/**
 * AGGIUNGE definizioni al fragment invece di SOSTITUIRLE.
 *
 * ⚠ E SERVE PERCHÉ `Fragment_Definitions` DI CustomMaterial È UN SETTORE, NON
 * UN ACCUMULATORE — e la cosa è costata un pomeriggio. Lo stile ci mette il
 * cammino nella griglia dei muri; poi `prato.js` chiamava `Fragment_Definitions`
 * per le sue funzioni e cancellava il cammino, lasciando in piedi la CHIAMATA
 * che sta dentro l'accumulo delle luci. Risultato: «'ombraVoxel' : no matching
 * overloaded function found» su UN materiale solo, cioè l'erba, mentre il mondo
 * compilava benissimo. Un difetto che sembra di sintassi e invece è di ordine.
 *
 * Chi aggiunge GLSL passa da qui e il problema non si ripresenta.
 */
export function aggiungiDefinizioniFragment(m, glsl) {
  const prima = m.CustomParts?.Fragment_Definitions || '';
  m.Fragment_Definitions(prima + '\n' + glsl);
  return m;
}

/**
 * Applica lo stile piatto a un CustomMaterial.
 *
 * @param m            il materiale
 * @param rig          per leggere sole, ambiente e tinta dell'ombra
 * @param colorePiatto l'espressione GLSL che dà il colore SENZA luce.
 *                     Di fabbrica è «baseColor.rgb · vDiffuseColor.rgb»: il
 *                     primo porta i colori dei vertici e la texture, il secondo
 *                     la tinta del materiale. ⚠ Servono TUTT'E DUE, e con il
 *                     solo `baseColor` una mesh senza texture né colori di
 *                     vertice esce BIANCA qualunque tinta le si dia — il
 *                     segnaposto del giocatore è uscito così. Per l'erba invece
 *                     si passa la sua sfumatura base→punta.
 * @param luceExtra    GLSL (vec3) di LUCE AGGIUNTA, in spazio LINEARE, sommata
 *                     dopo l'ombra e prima della nebbia. Serve all'acqua, e la
 *                     distinzione fra «sommare» e «mescolare nel colore» non è
 *                     un dettaglio: un luccichio del sole è luce che ARRIVA
 *                     all'occhio, non tinta della superficie. Mescolandolo nel
 *                     colore piatto verrebbe poi moltiplicato per l'ambiente e
 *                     per il fattore d'ombra — cioè un riflesso dentro l'ombra
 *                     di un albero uscirebbe grigio invece che bianco.
 *                     ⚠ È in ambito con `sole` e con `lampade`: chi lo scrive
 *                     decide da sé cosa l'ombra deve spegnere.
 * @param primaDellaLegge GLSL (istruzioni) eseguite dopo che `sole` e `lampade`
 *                     esistono e prima che si applichi la legge della luce.
 *                     Serve a chi la legge se la calcola da sé.
 * @param leggeLuce    GLSL (vec3) che PRENDE IL POSTO di
 *                     «uAmbiente · mix(uOmbraTinta, 1, sole)», cioè della legge
 *                     della luce di Leafy: ambiente che moltiplica, ombra a un
 *                     gradino, tinta di cielo invece che nero.
 *
 *                     ⚠ E QUESTO AGGANCIO APRE LA REGOLA PIÙ CHIUSA DEL
 *                     PROGETTO, quindi va detto forte: la legge di fabbrica
 *                     resta quella e nessuno la cambia per sbaglio. Esiste
 *                     perché il committente ha chiesto di poter PROVARE altri
 *                     modi di trattare la luce sull'acqua — sfumature comprese —
 *                     e provarli richiede di poterli scrivere. Chi passa di qui
 *                     sta deliberatamente uscendo dallo stile di casa: se il
 *                     risultato piace, è una decisione; se ci si finisce senza
 *                     accorgersene, è il difetto che questa nota previene.
 * @param alfa         GLSL (float) che PRENDE IL POSTO di `color.a`. Di fabbrica
 *                     non si tocca. ⚠ Chi lo usa scavalca anche `visibility` e
 *                     l'alfa del materiale: quella resta buona solo a dire a
 *                     Babylon che la mesh va nella coda dei trasparenti.
 */
export function applicaStilePiatto(m, rig, colorePiatto = 'baseColor.rgb * vDiffuseColor.rgb', { facce = true, schiarisci = 1, luceExtra = null, alfa = null, primaDellaLegge = null, leggeLuce = null } = {}) {
  // niente riflesso speculare: su una faccia piatta si legge come vernice
  m.specularColor = Color3.Black();
  m.diffuseColor = Color3.White();
  m.ambientColor = Color3.Black();

  // ⚠ OGGETTI, NON VALORI. CustomMaterial rilega le uniform a ogni disegno
  // leggendole da una mappa interna: passando un oggetto e poi mutandolo il
  // legame resta valido e non si alloca niente per fotogramma.
  m.AddUniform('uSoleVerso', 'vec3', rig.soleVerso);
  m.AddUniform('uAmbiente', 'vec3', rig.ambienteCol);
  m.AddUniform('uOmbraTinta', 'vec3', rig.ombraTinta);
  // ⚠ GLI ARRAY SI DICHIARANO QUI E SI LEGANO A MANO SOTTO, e la distinzione
  // costa un lampione spento. `AddUniform` fa DUE cose: scrive la riga
  // «uniform vec4 uLuciPos[24];» nello shader, e — se gli si passa un valore —
  // se lo rilega da solo a ogni disegno. La seconda però sa legare solo uniform
  // SINGOLE: per un array chiamerebbe `setVector4` su un elenco, che non fa
  // niente e non si lamenta. Quindi si dichiara senza valore (terzo argomento
  // omesso: vedi il sorgente, il legame automatico è dentro un `if (param)`) e
  // si lega nell'osservabile qui sotto.
  m.AddUniform(`uLuciPos[${LUCI_MAX}]`, 'vec4');
  m.AddUniform(`uLuciCol[${LUCI_MAX}]`, 'vec3');
  m.AddUniform(`uLuciEst[${LUCI_MAX}]`, 'vec4');   // semi-lati: area, neon, cubo
  m.AddUniform('uLuciNum', 'float');
  // ---- la griglia dei muri, per le lampade che proiettano -------------------
  // ⚠ SOLO SU WebGL2: `sampler3D` e `texelFetch` non esistono in WebGL1, e uno
  // shader che non compila fa sparire la mesh in silenzio (è già successo tre
  // volte in questo progetto). Senza griglia le lampade tornano ad attraversare
  // i muri: brutto, ma è un ripiego che si vede, non un guasto muto.
  // ⚠ DUE CONDIZIONI, NON UNA. WebGL2 è un requisito tecnico (`sampler3D` e
  // `texelFetch` in WebGL1 non esistono, e uno shader che non compila fa
  // sparire la mesh in silenzio). `fissi.ombreLampade` è invece una SCELTA di
  // qualità, presa all'avvio dalla classe del dispositivo: su mobile il cammino
  // non si compila proprio, perché lì un `if` non lo spegnerebbe (vedi
  // `qualita.js` e `luci.js`).
  const conVoxel = rig.motore.webGLVersion >= 2 && rig.fissi.ombreLampade;
  if (conVoxel) {
    // ⚠ QUESTA SI DICHIARA SOLO COL CAMMINO: senza, sarebbe una uniform che
    // nessuno legge, e legarla a ogni disegno sarebbe lavoro per niente.
    m.AddUniform(`uLuciOmbra[${LUCI_MAX}]`, 'float');
    // ⚠ «highp», E NON È PIGNOLERIA: in GLSL ES 3.0 un `sampler3D` NON ha una
    // precisione di fabbrica (il `sampler2D` sì, ma solo nel fragment), e
    // `AddUniform` scrive la riga in TUTTI E DUE gli shader — quindi l'errore
    // arriva dal VERTEX, che quella texture non la tocca nemmeno:
    // «0:285: 'sampler3D' : No precision specified». Un'ora di caccia nel posto
    // sbagliato, se non si legge da dove viene.
    m.AddUniform('uVox', 'highp sampler3D');
    m.AddUniform('uVoxMin', 'vec4');    // (minX, minY, minZ, 1 = griglia attiva)
    m.AddUniform('uVoxDim', 'vec3');
    m.AddUniform('uCamPos', 'vec3');    // per disfare l'origine mobile
    aggiungiDefinizioniFragment(m, GLSL_OMBRA_VOXEL);
  }
  m.onBindObservable.add(() => {
    const e = m.getEffect();
    if (!e) return;
    if (conVoxel) {
      const v = rig.voxel;
      // ⚠ IL FLAG STA NELLA «w», non in un uniform a parte: così lo shader fa un
      // confronto su un vettore che legge comunque, e non c'è modo di avere la
      // texture staccata e il flag acceso.
      e.setFloat4('uVoxMin', v.minX, v.minY, v.minZ, v.attiva ? 1 : 0);
      e.setFloat3('uVoxDim', v.larghezza, v.altezza, v.profondita);
      const c = rig.camera.globalPosition;
      e.setFloat3('uCamPos', c.x, c.y, c.z);
      // ⚠ LA TEXTURE SI LEGA A MANO: `CustomMaterial` rilega da solo i campionatori
      // ma sa fare solo `sampler2D` (vedi il suo sorgente, `AttachAfterBind`).
      // Un `sampler3D` dichiarato e mai legato dà nero — cioè «niente muri», che
      // è il ripiego giusto ma non quello che si voleva.
      if (v.texture) e.setTexture('uVox', v.texture);
      e.setArray('uLuciOmbra', rig.luci.ombra);
    }
    // ⚠ RELATIVE ALLA CAMERA, non assolute: vedi `luci.js`. L'origine mobile
    // trasla tutto, e una luce in coordinate di mondo finisce a chilometri di
    // distanza da dove crede di essere.
    e.setArray4('uLuciPos', rig.luci.perLoShader(rig.camera));
    e.setArray3('uLuciCol', rig.luci.col);
    e.setArray4('uLuciEst', rig.luci.est);
    e.setFloat('uLuciNum', rig.luci.quante);
  });

  // ⚠ DUE RIGHE, E LA SECONDA È LA CURA ALL'ACNE.
  //
  // La prima spegne l'illuminazione «semi realistica» senza spegnere l'ombra:
  // con la normale puntata al sole, N·L vale 1 ovunque e quello che il motore
  // accumula è il puro fattore della mappa.
  //
  // La seconda è la faccia. Committente: «ci sono degli acne importanti sui
  // lati dei blocchi, soprattutto quando il sole passa da mezzogiorno» — e
  // l'acne era MIA: forzando N·L a 1 avevo reso visibile un difetto che
  // l'illuminazione teneva nascosto. A mezzogiorno una parete verticale è
  // PARALLELA ai raggi, quindi la sua profondità in spazio-luce varia di
  // tantissimo dentro un texel e nessuno scarto costante la copre; finché
  // quella parete era buia per N·L≈0 non si vedeva, con N·L=1 si vede tutta.
  //
  // Alzare il bias è la cura sbagliata: sposta il problema e stacca le ombre da
  // terra. La cura giusta è che in Leafy **una faccia che guarda dall'altra
  // parte del sole è in ombra per GEOMETRIA**, non perché lo dice la mappa —
  // in Leafy-Lantern il raggio verso il sole entrava subito nel blocco stesso e
  // la risposta era «occluso». Qui è un prodotto scalare e uno step: binario,
  // quindi in stile (il salto resta uno solo), e piatto dentro la faccia perché
  // le normali sono piatte per costruzione — niente sfarfallio.
  //
  // ⚠ E `facce` SI SPEGNE PER I MODELLI. Sui blocchi il termine è la verità
  // geometrica: una faccia di cubo che guarda a nord, col sole a sud, è in ombra
  // e basta. Su una CHIOMA no — è fatta di piani incrociati, e metà di quei
  // piani guardano sempre dall'altra parte: col termine acceso l'albero viene
  // per metà nero, che è il difetto che il committente ha visto («i colori degli
  // alberi sbagliati»). Il fogliame in Leafy è tinta piatta, e l'ombra gliela dà
  // la mappa. Stessa ragione per cui l'erba non lo usa.
  //
  // ⚠ E LA SOGLIA NON È ZERO, ED È LA CURA ALL'ACNE CHE RESTAVA. L'acne nasce
  // dove la superficie è quasi PARALLELA ai raggi: lì la profondità in
  // spazio-luce varia di tantissimo dentro un texel, e nessuno scarto costante
  // la copre — viene il tratteggio che il committente ha fotografato sui fianchi
  // marroni delle terrazze.
  //
  // Alzare lo scarto è la cura sbagliata: sposta il difetto e in cambio accende
  // una lineetta lungo il bordo delle ombre (l'ho fatto, e si è vista subito).
  //
  // La cura giusta viene dallo stile. La banda dove nasce l'acne è LA STESSA
  // dove la luce radente non vuol dire niente: una faccia colpita di striscio
  // non è «un po' illuminata», in Leafy — o vede il sole o no. Quindi si sposta
  // la soglia dentro quella banda e il problema sparisce per costruzione,
  // gratis, e in stile.
  //
  // ⚠ 0,12 E NON PIÙ: il terreno piatto col sole al minimo (0,24 di seno, vedi
  // «giorno.js») ha un prodotto scalare di 0,24. Una soglia più alta glielo
  // spegnerebbe, e all'alba il mondo diventerebbe tutto ombra.
  m.Fragment_Before_Lights(facce ? `
    float facciaAlSole = step(0.12, dot(normalize(vNormalW), -normalize(uSoleVerso)));
    normalW = normalize(-uSoleVerso);
  ` : `
    float facciaAlSole = 1.0;
    normalW = normalize(-uSoleVerso);
  `);

  // ⚠ `schiarisci` TOGLIE L'OMBREGGIATURA COTTA NELLE TEXTURE, e serve solo ai
  // modelli. Misurato: l'albero rende (91,171,66) dove l'atlante è verde acceso,
  // cioè la resa è FEDELE — il buio non lo mettiamo noi, è dipinto dentro il
  // file. Chi ha modellato l'albero ci ha cotto dentro la sua ombreggiatura: la
  // punta chiara, i fianchi blu-verdi scuri. È proprio quello che il nostro
  // stile rifiuta («non esiste un colore diverso da ombra o non in ombra»), e
  // sui modelli arrivava dalla porta di servizio: il committente l'ha vista
  // come «i colori degli alberi e dei lampioni sono scurissimi e fuoristile».
  //
  // ⚠ SI ALZA COL GAMMA, NON MOLTIPLICANDO. Un fattore lineare schiarisce i
  // toni chiari quanto gli scuri e li sbianca; l'esponente alza molto gli scuri
  // e quasi niente i chiari, che è proprio togliere l'ombreggiatura lasciando i
  // colori. Con 1,6: un 0,10 diventa 0,24, un 0,70 diventa 0,80.
  const lift = schiarisci === 1
    ? colorePiatto
    : `pow(max(${colorePiatto}, vec3(0.0)), vec3(${(1 / schiarisci).toFixed(4)}))`;

  // ⚠ I CONTI DELLA LUCE SI FANNO IN SPAZIO LINEARE, E QUESTA È LA CORREZIONE
  // PIÙ IMPORTANTE DI QUESTO GIRO. Committente: «graficamente rendile come
  // quelle di Lantern», e la differenza non era una costante — era lo spazio.
  //
  // MISURATO, non dedotto: ho letto il pixel del cielo a mezzogiorno con un
  // valore d'ingresso NOTO (il clearColor, 0,561 0,827 1,000) e il pixel usciva
  // (143, 211, 255), cioè ESATTAMENTE il valore per 255. Babylon scrive lineare
  // in framebuffer. three.js, di fabbrica dalla r152, codifica in sRGB —
  // `outputColorSpace` vale `SRGBColorSpace` e `ColorManagement` è acceso,
  // quindi in Lantern i colori della palette entrano DECODIFICATI e il
  // risultato esce RICODIFICATO. Due mondi diversi, e io ci ho trapiantato
  // dentro le sue costanti.
  //
  // Per una MOLTIPLICAZIONE la differenza è solo un esponente: moltiplicare per
  // k in lineare equivale a moltiplicare per k^(1/2,2) in spazio di
  // visualizzazione, e infatti la mia tabella «a occhio» era finita lì attorno
  // per conto suo. Ma per una SOMMA non c'è nessun equivalente: due pozze di
  // lampada che si sovrappongono, sommate su valori già compressi, saturano e
  // sbiancano. È il difetto che si vedeva — gel colorati appoggiati sopra
  // invece di luce.
  //
  // Quindi si fa come three: si decodifica, si fanno i conti, si ricodifica. Il
  // costo sono due `pow(vec3)` per frammento, che è quello che three pagava
  // comunque per noi. E a quel punto le costanti di Lantern valgono LETTERALI,
  // che è la ragione per cui vale la pena.
  //
  // ⚠ E IL CIELO RESTA COM'È: `clearColor` lo scrive il motore senza passare da
  // nessuno shader, quindi vive in spazio di visualizzazione. Siccome qui si
  // decodifica e si ricodifica con lo stesso esponente, la nebbia all'orizzonte
  // torna esattamente il colore del cielo e la banda non si vede. Se un giorno
  // i due esponenti divergono, si vedrà lì.
  // ⚠ LE DUE RIGHE FACOLTATIVE SI COMPONGONO QUI, IN JAVASCRIPT, E NON DENTRO
  // IL TEMPLATE — e non è stile: un ternario con dentro un backtick CHIUDE il
  // template che lo contiene. È la trappola numero uno di CLAUDE.md (nove volte
  // fra i due progetti), e stavolta l'ha presa la prova prima dello schermo:
  // l'estrattore di `glsl-una-riga.test.mjs` si ferma al primo backtick e vede
  // un blocco troncato a metà espressione. Componendole fuori, dentro il GLSL
  // resta una sola interpolazione senza apici, come per `lift` e per l'accumulo
  // delle luci.
  // ⚠ LA LEGGE DELLA LUCE DI LEAFY, in una riga, ed è il cuore dello stile:
  // l'ambiente MOLTIPLICA (non è una luce), e l'ombra è un gradino verso una
  // tinta di CIELO, non verso il nero. Chi la sostituisce sa cosa sta facendo.
  const legge = leggeLuce || 'uAmbiente * mix(uOmbraTinta, vec3(1.0), sole)';
  const primaLegge = primaDellaLegge || '// (la legge di casa non ha bisogno di preparativi)';
  const sommaLuce = luceExtra
    ? `nostro += ${luceExtra};`
    : '// (nessuna luce aggiunta: la somma serve solo al brillio dell acqua)';
  const scriviAlfa = alfa
    ? `color.a = ${alfa};`
    : '// (alfa del materiale: per pixel la scrive solo l acqua)';

  m.Fragment_Before_FragColor(`
    float sole = clamp(diffuseBase.r, 0.0, 1.0) * facciaAlSole;
    sole = floor(sole * ${BANDE.toFixed(1)} + 0.5) / ${BANDE.toFixed(1)};
    ${glslAccumuloLuci(conVoxel)}
    // ⚠ LE LAMPADE SI SOMMANO DOPO L'OMBRA, non dentro: una lampada accesa deve
    // illuminare anche quello che sta all'ombra del sole. È il motivo per cui
    // di notte, sotto un lampione, in Leafy si vede.
    ${primaLegge}
    vec3 lineare = pow(max(${lift}, vec3(0.0)), vec3(${GAMMA.toFixed(1)}));
    vec3 nostro = lineare * (${legge} + lampade);
    ${sommaLuce}
    // ⚠ E LA NEBBIA VA RIMESSA, perché questo innesto sta DOPO il suo. Babylon
    // stampa il blocco della nebbia sopra di noi e poi noi riscriviamo
    // «color.rgb» di sana pianta: la nebbia veniva calcolata e buttata via, e a
    // schermo non se ne vedeva traccia. Il fattore però è ancora qui in ambito,
    // quindi basta riusarlo — e usare LO STESSO, non ricalcolarlo, o le due
    // nebbie divergono al primo ritocco.
    #ifdef FOG
      nostro = mix(pow(max(vFogColor, vec3(0.0)), vec3(${GAMMA.toFixed(1)})), nostro, fog);
    #endif
    color.rgb = pow(max(nostro, vec3(0.0)), vec3(${(1 / GAMMA).toFixed(6)}));
    ${scriviAlfa}
  `);
  return m;
}

/** I valori di partenza: mezzogiorno sereno. Li muoverà il ciclo del giorno. */
export function ambienteDiFabbrica() {
  return {
    // quanto luccica il mondo in pieno sole
    ambiente: new Color3(1.06, 1.03, 0.97),
    // ⚠ E QUESTO NON È UN GRIGIO. È il colore del cielo: l'ombra scurisce E vira
    // verso l'azzurro insieme, che è la differenza fra un'ombra e una macchia.
    ombra: new Color3(0.60, 0.68, 0.82),
    verso: new Vector3(-0.55, -0.72, -0.42),
  };
}

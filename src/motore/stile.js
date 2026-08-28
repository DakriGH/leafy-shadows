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

/** I gradini dell'ombra. In Leafy-Lantern è `BANDE_LUCE` in config.js, e sono
 *  «i gradini che il committente ha indicato come metro della nettezza». */
export const BANDE = 3;

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
 */
export function applicaStilePiatto(m, rig, colorePiatto = 'baseColor.rgb * vDiffuseColor.rgb', { facce = true } = {}) {
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
  m.Fragment_Before_Lights(facce ? `
    float facciaAlSole = step(0.0, dot(normalize(vNormalW), -normalize(uSoleVerso)));
    normalW = normalize(-uSoleVerso);
  ` : `
    float facciaAlSole = 1.0;
    normalW = normalize(-uSoleVerso);
  `);

  m.Fragment_Before_FragColor(`
    float sole = clamp(diffuseBase.r, 0.0, 1.0) * facciaAlSole;
    sole = floor(sole * ${BANDE.toFixed(1)} + 0.5) / ${BANDE.toFixed(1)};
    color.rgb = ${colorePiatto} * (uAmbiente * mix(uOmbraTinta, vec3(1.0), sole));
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

// L'ACQUA — e prima di tutto: il mondo aveva già scritto tutto quello che
// serviva, e noi lo buttavamo via.
//
// ⚠ QUESTO È IL PUNTO DI PARTENZA, ed è misurato leggendo il codice, non
// dedotto. `world/mesher.js` calcola per OGNI vertice d'acqua:
//   · la direzione della corrente, dal gradiente dei livelli;
//   · che faccia è — pelo calmo, pelo che scorre, scivolo, parete di cascata;
//   · quanto è lontana la sponda e quanto è aperto lo specchio d'acqua;
// e in più i punti delle correnti e degli impatti delle cascate. Poi
// `fabbrica.scrivi` caricava sulla scheda soltanto posizioni, colori e normali:
// `dati.acq` e `dati.riv` MORIVANO SULLA CPU, un chunk alla volta, da sempre.
// Il lavoro difficile era già fatto e nessuno lo guardava.
//
// ── PERCHÉ CONTA PIÙ DI QUANTO SEMBRI ───────────────────────────────────────
//
// Lo shader toon di riferimento (Roystan, e i due port che il committente ha
// mandato) ricava la schiuma sulla riva dal DEPTH BUFFER: guarda quanto è
// vicino il fondo dietro al pelo. Funziona perché in Unity l'acqua è un piano
// che non sa cosa ha sotto — e costa una passata di profondità di tutta la
// scena, che su una GPU a tile è esattamente la cosa da non fare.
//
// La nostra acqua non è un piano: è generata da un mesher che le celle vicine
// le ha già camminate. La sponda ce l'abbiamo per COSTRUZIONE, in un attributo
// di vertice, a costo zero. Il depth buffer qui servirebbe solo per le cose
// DINAMICHE che galleggiano, e quelle oggi non esistono ancora (la fisica è
// fase 5): quando esisteranno, la strada giusta è la silhouette dall'alto di
// Lantern — un render delle sole sagome, non della scena.
//
// ── LO STILE, e perché non è il PBR ─────────────────────────────────────────
//
// Il committente ha chiesto «riflessi del sole, luna, luci», e la parola che ha
// usato è «PBR». Il PBR vero — BRDF a microfacce, roughness, IBL — qui è la
// cosa sbagliata due volte: produce le rampe continue che in questo progetto
// sono state bocciate («non esiste un colore diverso da ombra o non in ombra»),
// e vivrebbe in un fragment dove il trucco dello stile piatto non esiste (lo
// stile scrive `normalW` prima del ciclo delle luci e legge l'ombra da
// `diffuseBase`: in un fragment PBR quella tubatura non c'è).
//
// Ma il luccichio del sole NON è PBR. Nella prima immagine di riferimento la
// strada del sole verso l'orizzonte non è una sfumatura: sono LOSANGHE BIANCHE
// PIATTE. È un termine speculare TAGLIATO A GRADINO — la stessa grammatica di
// `BANDE = 3`, applicata alla luce riflessa invece che all'ombra. Costa quattro
// istruzioni e sta in stile per costruzione.
//
// ── COSA COSTA, in ordine ───────────────────────────────────────────────────
//
//  · una lettura da texture (due su desktop, per la deriva);
//  · una manciata di `step` e di `mix`;
//  · una potenza per il Fresnel e una per il lobo del sole.
// Niente passate in più, niente render target, niente specchi. La parte cara
// (riflettere le COSE, non solo le luci) è un pass a parte e non sta qui: in
// Lantern quel pass era il secondo picco del fotogramma, 11,1 ms, e prima di
// riproporlo va misurato.

import { Color3 } from '@babylonjs/core/Maths/math.color.js';
import { Matrix, Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector.js';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture.js';
import { MirrorTexture } from '@babylonjs/core/Materials/Textures/mirrorTexture.js';
import { RenderTargetTexture } from '@babylonjs/core/Materials/Textures/renderTargetTexture.js';
// ⚠ L'IMPORT È L'INTERRUTTORE: `enableDepthRenderer` è un metodo che questo
// modulo AGGIUNGE a Scene come effetto collaterale. Senza, «is not a function»
// a runtime — la stessa famiglia degli shader importati a mano (CLAUDE.md).
import '@babylonjs/core/Rendering/depthRendererSceneComponent.js';
import { Plane } from '@babylonjs/core/Maths/math.plane.js';
import { Vector2 } from '@babylonjs/core/Maths/math.vector.js';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { Constants } from '@babylonjs/core/Engines/constants.js';
import { CustomMaterial } from '@babylonjs/materials/custom/customMaterial.js';
import { applicaStilePiatto, aggiungiDefinizioniFragment, BANDE } from './stile.js';
import { tratteggio, LATO } from './tratteggio.js';
import { BLOCCHI } from '../world/blocks.js';

/**
 * QUANTO PESA LA STRADA DEL SOLE rispetto alle scintille.
 *
 * ⚠ COMPILATA, NON UNA UNIFORM, e la distinzione è quella di CLAUDE.md: le
 * uniform si rilegano a ogni disegno, e questa non cambia mai in partita.
 *
 * ⚠ E LA STRADA È LA PARTE CHE MANCAVA. La prima stesura aveva SOLO le
 * scintille, e misurandola (due scatti identici, brillio a otto volte contro
 * zero) muoveva il 9% dei pixel con uno scarto medio di 6 su 255: granelli
 * sparsi, non la strada di luce delle referenze. Il motivo è geometrico — su
 * una pozza da dodici celle l'angolo fra sguardo riflesso e sole cambia
 * pochissimo, quindi il lobo è quasi costante e non disegna nessuna forma.
 * La strada larga la disegna, ed è a GRADINI come l'ombra: su un lago vero il
 * salto fra una banda e l'altra è una riga netta sull'acqua, che è esattamente
 * come si vede nella prima immagine di riferimento.
 */
export const STRADA = 0.22;

// ── I VARYING E LE VARIABILI CONDIVISE ──────────────────────────────────────
//
// ⚠ GLOBALI E NON LOCALI, per la stessa ragione per cui `prato.js` dichiara
// `vErbaPiega` così: il colore lo calcola un innesto (dentro l'aggiornamento
// del diffuse) e lo consumano altri due, stampati da Babylon in punti lontani
// dello stesso `main`. Una locale non arriverebbe.
//
// ⚠ E NIENTE NOMI DI UNA LETTERA: Babylon nel blocco della nebbia emette
// «#define E 2.71828» e il preprocessore non conosce ambiti (vedi CLAUDE.md).
export const GLSL_ACQUA_DEFINIZIONI = `
  varying vec3 vAcqua;        // (corrente x, corrente z, che faccia è)
  varying vec2 vRiva;         // (quanto è lontana la sponda, quanto è aperto)
  varying vec3 vAcquaPos;     // la posizione in coordinate di MONDO VERE
  vec3 acquaTinta;
  float acquaAlfa;
  float acquaBrillio;
  float acquaScintilla;
  // ⚠ DUE MANOPOLE CHE GLI STILI POSSONO GIRARE, e sono qui perché uno stile non
  // è solo «che segni ci sono»: «vetro» cambia quanto si vede il fondo e
  // «inchiostro» cambia il COLORE del segno. Senza queste due, quei due stili
  // andrebbero scritti come materiali a parte.
  float acquaVelo;        // moltiplica l'alfa: 1 = come da tabella, meno = più limpida
  float acquaInchiostro;  // 0 = segno chiaro, 1 = segno scuro
  vec3 acquaNormale;      // la normale del pelo, derivata dalle onde
  float acquaNL;          // quanto la normale guarda il sole
  float acquaSpec;        // il lobo speculare su quella normale
  float acquaSpessore;    // quanta acqua c'è dietro questo pixel (spazio camera)
  float acquaSchiumaProf; // la schiuma di contatto che nasce dallo spessore
  vec3 acquaIride;        // il velo iridescente, se il talento è acceso
  vec3 acquaCauLuce;      // il contributo delle caustiche, da spegnere con l'ombra
`;

/**
 * IL VERTICE — tre assegnazioni, e la terza merita una riga di spiegazione.
 *
 * ⚠ `position` QUI È GIÀ IL MONDO. Le geometrie dei chunk le scrive il mesher
 * in coordinate assolute e le mesh non si spostano mai (`freezeWorldMatrix` in
 * fabbrica.js), quindi l'attributo grezzo è la posizione vera. Non si può usare
 * `vPositionW`: con `useLargeWorldRendering` acceso quella è RELATIVA ALLA
 * CAMERA — è lo stesso motivo per cui il cammino nei voxel deve sommare
 * `uCamPos`. Con `vPositionW` il disegno dell'acqua NUOTEREBBE dietro alla
 * camera invece di stare fermo sull'acqua, che è un difetto che si vede solo
 * muovendosi e che a fermo sembra perfetto.
 */
export const GLSL_ACQUA_VERTICE = `
  vAcqua = aAcqua;
  vRiva = aRiva;
  vAcquaPos = position;
`;

/**
 * IL CAMPO, versione ricca: quattro letture, tre scale, due rotazioni, un warp.
 *
 * La prima è larga e lenta e non si vede mai da sola — PIEGA il piano su cui si
 * leggono le altre, sposta il punto di lettura, e sceglie zona per zona quale
 * copia si vede.
 *
 * ⚠ LA DERIVA DA SOLA NON BASTAVA, e il committente l'ha visto: «noise
 * ripetute e tileset che si notano tantissimo». La piastrella è 6 blocchi
 * (1/uAcquaMis.x): su una vasca da 15 si conta a occhio, e spostare il punto
 * di lettura sposta il motivo, non lo cambia. Prima cura: la SELEZIONE PER
 * ZONE — due letture a scale non commensurabili, e il campo largo decide dove
 * si vede quale. ⚠ Selezione, NON media: la media di due campi indipendenti si
 * stringe attorno a 0,5 e le soglie tarate sui percentili smetterebbero di
 * pescare — i segni sparirebbero, in silenzio.
 *
 * ⚠ E NON BASTAVA NEMMENO QUELLA: «si nota tantissimo il tileset ripetuto,
 * forse mancano noise sovrapposte e variazione». Aveva ragione, e la ragione è
 * geometrica: due copie della stessa immagine, per quanto scelte a zone,
 * restano due griglie ALLINEATE — gli assi della piastrella sono gli stessi, e
 * l'occhio segue quelli, non il disegno. Le tre aggiunte attaccano
 * l'allineamento, non la ripetizione:
 *  · la ROTAZIONE (una matrice di ~37°, applicata una e due volte): assi
 *    ruotati di un angolo che non è multiplo di 90° non possono riallinearsi
 *    con quelli della prima copia, mai;
 *  · il WARP DEL DOMINIO: prima di leggere, il piano stesso viene piegato da
 *    un campo a scala grande. Una griglia piegata non è più una griglia — è
 *    la stessa cosa che rende irriconoscibile una texture su una bandiera al
 *    vento. ⚠ MA DEVE RESTARE SOTTO IL BLOCCO: la prima stesura piegava di
 *    ~4 blocchi e il risultato era peggio della malattia — non «acqua senza
 *    piastrella» ma acqua piena di GHIRIGORI, perché a quell'ampiezza il warp
 *    non sposta il disegno, lo strapazza. Serve rompere l'allineamento delle
 *    griglie, non l'immagine che ci sta sopra;
 *  · una TERZA scala (1,611), con la sua zona di selezione.
 * Il periodo percepito passa da «6 blocchi» a «non si trova».
 *
 * ⚠ COSTA UNA LETTURA IN PIÙ delle due di prima (quattro invece di tre, la
 * guida fa da warp E da selettore invece di essere una lettura a parte). Sulla
 * variante mobile non cambia niente: quella resta a una lettura sola, e non per
 * un `if` — è un altro sorgente.
 */
export const GLSL_ACQUA_CAMPO_RICCO = `
  vec4 acquaGuida = texture2D(uTratto, acquaUv * 0.213 + vec2(5.3, 3.7));
  vec2 acquaPiega = (acquaGuida.gb - 0.5) * (0.05 + uAcquaMis.z * 1.1);
  vec2 acquaUvP = acquaUv + acquaPiega;
  vec2 acquaDeriva = (acquaGuida.ga - 0.5) * uAcquaMis.z;
  mat2 acquaGira = mat2(0.8, -0.6, 0.6, 0.8);
  vec4 acquaCampoA = texture2D(uTratto, acquaUvP + acquaDeriva);
  vec4 acquaCampoB = texture2D(uTratto, acquaGira * acquaUvP * 0.737 + vec2(31.7, 11.3) - acquaDeriva);
  vec4 acquaCampoC = texture2D(uTratto, acquaGira * acquaGira * acquaUvP * 1.611 + vec2(7.3, 23.9));
  vec4 acquaCampo = mix(acquaCampoA, acquaCampoB, smoothstep(0.34, 0.66, acquaGuida.g));
  acquaCampo = mix(acquaCampo, acquaCampoC, smoothstep(0.46, 0.62, acquaGuida.r));
`;

/**
 * IL CAMPO, versione povera: una lettura sola.
 *
 * ⚠ E NON È UN `if`, È UN'ALTRA COMPILAZIONE. Su una GPU mobile il compilatore
 * riserva i registri per il caso peggiore anche nei rami che non esegue: uno
 * shader con dentro il ramo ricco andrebbe piano ANCHE spegnendolo. È la
 * lezione di `glslAccumuloLuci`, e vale identica qui.
 */
export const GLSL_ACQUA_CAMPO_POVERO = `
  vec4 acquaCampo = texture2D(uTratto, acquaUv);
`;

/**
 * DOVE SI LEGGE IL DISEGNO, e come si muove. Tre andature, e sono esattamente
 * i tre stati che il mondo già distingue (vedi `world/acqua.js`):
 *
 *  · CALMA (tipo 0) — una deriva lentissima, senza verso preferito. Una
 *    sorgente ferma non ha corrente: se le si dà un verso, un lago intero
 *    scivola tutto dalla stessa parte e si legge come un tappeto che striscia.
 *  · SCORRE (tipo 1, 3) — va dove va la corrente, che il mesher ha calcolato
 *    dal gradiente dei livelli. Sullo scivolo (3) è la stessa cosa più veloce.
 *  · CASCATA (tipo 2) — la parete di una colonna che cade.
 *
 * ⚠ E SULLA PARETE LE COORDINATE SI SCAMBIANO. I tratti della tessitura sono
 * allungati lungo u (vedi `tratteggio.js`): sul pelo u è una direzione in
 * pianta e le losanghe si sdraiano sull'acqua, che è quello che si vuole. Su
 * una cascata no — lì l'acqua cade, e le striature devono essere VERTICALI.
 * Mettendo la quota in u i tratti si raddrizzano, e la stessa tessitura serve
 * due disegni opposti. Con le coordinate non scambiate viene una parete a
 * bande orizzontali, che si legge come un muro di mattoni bagnato.
 *
 * ⚠ IL SEGNO DELLO SCORRIMENTO: si campiona in `uv − verso·t`, quindi una
 * losanga si vede muoversi lungo +verso. Per far CADERE l'acqua il verso lungo
 * la quota dev'essere NEGATIVO. È il tipo di segno che si sbaglia una volta su
 * due e si vede subito a schermo: la cascata risale.
 *
 * ⚠ E IL CIGLIO NON È UNO STACCO — questa è la correzione più importante che le
 * cascate abbiano ricevuto, ed è arrivata dal committente: «odio lo stacco che
 * fanno le cascate, la transizione dev'essere graduale». Aveva ragione due
 * volte, e la seconda è peggio della prima:
 *  1. il pelo finiva e la parete cominciava di colpo, con un altro disegno;
 *  2. quel disegno era LO STESSO PER TUTTE LE RICETTE — le «linette» —, cioè
 *     l'acqua di New Horizons e quella di Wind Waker avevano la stessa identica
 *     cascata. Trentasette acque diverse e una cascata sola: da lì il verdetto
 *     «cose arrangiate», che descrive esattamente com'era fatta.
 *
 * La cura è nelle UV, non nel disegno: sulla parete si continua a campionare il
 * disegno DELLO STILE (archetti, cerchi, trattini, ragnatela — quello che la
 * ricetta ha scelto per il suo pelo), e quello che cambia scendendo è COME lo
 * si campiona. Al ciglio la coordinata lungo la caduta è ancora la quota, cioè
 * la stessa unità del pelo: il motivo attraversa il bordo senza accorgersene.
 * Più giù diventa il TEMPO DI VOLO, che cresce sempre più piano — e siccome
 * campionare in una coordinata che rallenta vuol dire STIRARE l'immagine, lo
 * stesso motivo si allunga da solo mentre l'acqua accelera. Il passaggio fra le
 * due lo fa una smoothstep su un blocco e mezzo (`acquaCadNato`).
 *
 * Così la cascata è la SUA acqua che cade, non un secondo materiale incollato
 * sotto il primo: ogni ricetta ha la cascata del suo disegno, gratis.
 */
export const GLSL_ACQUA_UV = `
  float acquaTipo = vAcqua.z;
  float acquaScorre = step(0.5, length(vAcqua.xy));
  float acquaSuMuro = step(1.5, acquaTipo) * step(acquaTipo, 2.5);
  float acquaScivolo = step(2.5, acquaTipo) * step(acquaTipo, 3.5);
  float acquaLungoZ = step(0.5, abs(normalW.x));
  float acquaCadCima = vAcqua.x;
  float acquaCadBase = vAcqua.y;
  float acquaCadAlta = max(acquaCadCima - acquaCadBase, 0.5);
  float acquaCadGiu = clamp(acquaCadCima - vAcquaPos.y, 0.0, 48.0);
  float acquaCadPiede = acquaCadAlta - acquaCadGiu;
  float acquaCadVel = sqrt(0.35 + acquaCadGiu * uCascata.y);
  float acquaCadVolo = 2.0 * (acquaCadVel - 0.5916) / max(uCascata.y, 0.02);
  float acquaCadNato = smoothstep(0.0, 1.8, acquaCadGiu);
  vec2 acquaUvPelo = vAcquaPos.xz;
  vec2 acquaUvMuro = vec2(vAcquaPos.y, mix(vAcquaPos.x, vAcquaPos.z, acquaLungoZ));
  vec2 acquaUvVolo = vec2(-acquaCadVolo * 2.8, acquaUvMuro.y);
  vec2 acquaUvCade = mix(acquaUvMuro, acquaUvVolo, acquaCadNato) * uAcquaMuro.xw;
  vec2 acquaUvFerma = mix(acquaUvPelo * uAcquaMis.x, acquaUvCade, acquaSuMuro);
  vec2 acquaVersoCalmo = vec2(0.013, 0.009);
  vec2 acquaVersoCorrente = normalize(vAcqua.xy + vec2(1e-5)) * uAcquaMis.y;
  vec2 acquaVersoMuro = vec2(-uAcquaMuro.y, 0.0);
  vec2 acquaVersoPelo = mix(acquaVersoCalmo, acquaVersoCorrente, acquaScorre);
  vec2 acquaVerso = mix(acquaVersoPelo, acquaVersoMuro, acquaSuMuro);
  vec2 acquaUv = acquaUvFerma - acquaVerso * uTempo;
`;

/**
 * ── I CINQUE STILI DEL PELO ─────────────────────────────────────────────────
 *
 * ⚠ PERCHÉ SONO CINQUE E NON UNO. Ho provato a indovinare lo stile giusto tre
 * volte di fila e tre volte il committente ha detto di no («piena di macchie»,
 * «tremenda, è tutto splattellato»). Il difetto non era la taratura: ogni volta
 * era il PRINCIPIO del disegno. A quel punto continuare a ritoccare i numeri è
 * il modo più caro di scoprire una cosa che si vede in un secondo guardando —
 * quindi si costruiscono le alternative VERE, si fotografano nella stessa
 * identica inquadratura, e si sceglie.
 *
 * Ogni stile scrive due numeri e basta:
 *  · `acquaLinea`      i segni sul PELO (0 = niente, superficie pulita);
 *  · `acquaFondale`    quanto è «basso» qui, 0..1, che decide la tinta.
 * La parete di una cascata NON passa di qui: le striature che cadono sono le
 * stesse in tutti e cinque (`acquaLineaPiena`), perché lì il problema è un
 * altro e la soluzione l'abbiamo già.
 *
 * ⚠ E LO STILE SI SCEGLIE ALLA COSTRUZIONE DEL MATERIALE, non a caldo: il
 * sorgente di un CustomMaterial si compila una volta e resta (CLAUDE.md). Il
 * banco ne costruisce uno per stile e li scambia sulle mesh, che è anche il
 * modo in cui si verifica che compilino tutti.
 */

/** Le striature che CADONO: parete di cascata e scivoli. Uguali per tutti. */
export const GLSL_ACQUA_CADUTA = `
  vec2 acquaVersoUno = mix(vec2(1.0, 0.42), vec2(0.12, 1.0), acquaSuMuro);
  vec2 acquaVersoDue = mix(vec2(0.88, 0.60), vec2(-0.09, 1.0), acquaSuMuro);
  float acquaDeforma = (acquaCampo.r - 0.5) * uAcquaOnda.w;
  float acquaOndaUno = sin(dot(acquaUv, acquaVersoUno) * uAcquaOnda.x + acquaDeforma);
  float acquaOndaDue = sin(dot(acquaUv, acquaVersoDue) * uAcquaOnda.y + acquaDeforma * 0.7);
  float acquaLineaPiena = max(step(abs(acquaOndaUno), uAcquaOnda.z), step(abs(acquaOndaDue), uAcquaOnda.z * 0.55));
  float acquaFondale = step(vRiva.x, uAcquaMis.w);
  float acquaLinea = 0.0;
  acquaVelo = 1.0;
  acquaInchiostro = 0.0;
  acquaSpessore = 0.0;
  acquaSchiumaProf = 0.0;
  acquaIride = vec3(0.0);
  acquaCauLuce = vec3(0.0);
`;

/**
 * 1 — LISCIA. Sul pelo non c'è NIENTE: una tinta piena, e l'unico segno è il
 * nastro bianco della riva. È la lettura più radicale della regola della casa
 * («in tutto Leafy non c'è una sola sfumatura») e la più vicina alla seconda
 * immagine di riferimento, dove l'acqua è un campo di colore e basta.
 */
export const GLSL_ACQUA_STILE_LISCIA = `
`;

/**
 * 2 — BANDE. La profondità diventa TRE tinte piatte concentriche, come le curve
 * di livello di una carta. Niente si muove: il disegno è la forma dello
 * specchio d'acqua. Molto grafico, e la cosa più «piatta» che si possa fare.
 */
export const GLSL_ACQUA_STILE_BANDE = `
  acquaFondale = 1.0 - floor(min(vRiva.x, 0.999) * 3.0) / 2.0;
`;

/**
 * 3 — RETE (caustiche). Anelli chiusi e sottili, come la rete di luce sul fondo
 * di una piscina. Sono il CONTORNO del rumore a metà altezza: siccome è una
 * linea e non una soglia, non fa chiazze — e siccome il campo è tondo e non
 * stirato, gli anelli si chiudono invece di correre.
 */
export const GLSL_ACQUA_STILE_RETE = `
  acquaLinea = step(abs(acquaCampo.a - 0.5), uAcquaTagli.w);
`;

/**
 * 4 — CRESTE. Linee lunghe e continue, quasi parallele, come il pettine di
 * un'onda lunga. È la versione senza tratteggio: ordinata e calma, ma da vicino
 * può leggersi come venatura del legno.
 */
export const GLSL_ACQUA_STILE_CRESTE = `
  acquaLinea = acquaLineaPiena;
`;

/**
 * 5 — TRATTI. Le stesse creste, spezzate in segmenti corti dal campo delle
 * chiazze: i segni nascono e muoiono mentre l'onda avanza.
 */
export const GLSL_ACQUA_STILE_TRATTI = `
  acquaLinea = acquaLineaPiena * step(uAcquaTagli.z, acquaCampo.a);
`;

/**
 * 6 — SCAGLIE. Anelli concentrici dentro una griglia sfalsata: è il motivo
 * «seigaiha», l'onda disegnata delle stampe giapponesi. Non imita l'acqua, la
 * DICHIARA — ed è la cosa più vicina a un disegno fatto a mano che si possa
 * ottenere senza un disegno fatto a mano.
 *
 * ⚠ LE RIGHE SFALSATE SONO METÀ DELL'EFFETTO: con la griglia dritta si legge
 * come una piastrella da bagno. Sfalsando una riga sì e una no di mezza cella
 * gli archi si incastrano, e la piastrella sparisce.
 */
export const GLSL_ACQUA_STILE_SCAGLIE = `
  vec2 acquaGriglia = acquaUv * uAcquaOnda.x * 0.22;
  float acquaRigaDispari = step(0.5, fract(acquaGriglia.y * 0.5));
  acquaGriglia.x = acquaGriglia.x + acquaRigaDispari * 0.5;
  float acquaRaggio = length(fract(acquaGriglia) - 0.5);
  float acquaAnello = fract(acquaRaggio * 3.4 - uTempo * 0.06);
  acquaLinea = step(acquaAnello, uAcquaOnda.z * 1.6) * step(acquaRaggio, 0.52);
`;

/**
 * 7 — GOCCE. Cerchi che si allargano da punti sparsi, come pioggia sul pelo.
 * È l'unico stile in cui il movimento non è uno scorrimento ma una PULSAZIONE:
 * gli anelli nascono al centro e muoiono al bordo della loro cella.
 */
export const GLSL_ACQUA_STILE_GOCCE = `
  vec2 acquaCella = acquaUv * uAcquaOnda.x * 0.20;
  float acquaRaggioGoccia = length(fract(acquaCella) - 0.5);
  float acquaFase = acquaCampo.g * 2.0;
  float acquaCerchio = fract(acquaRaggioGoccia * 2.6 - uTempo * 0.35 + acquaFase);
  acquaLinea = step(acquaCerchio, uAcquaOnda.z * 1.4) * step(acquaRaggioGoccia, 0.5);
`;

/**
 * 8 — MOSAICO. Il pelo diventa una griglia di celle piatte che cambiano tono a
 * SCATTI, come la texture animata di un gioco a blocchi.
 *
 * ⚠ ED È L'UNICO STILE CHE NON SI MUOVE IN MODO CONTINUO, di proposito: il
 * tempo entra dentro un `floor`, quindi l'acqua cambia a fotogrammi discreti
 * invece di scorrere. In un mondo fatto di cubi è l'unica animazione che non
 * tradisce la griglia — e vale la pena vederla prima di scartarla.
 */
export const GLSL_ACQUA_STILE_MOSAICO = `
  vec2 acquaQuadretto = floor(acquaUvFerma * uAcquaOnda.x * 0.30);
  float acquaScatto = floor(uTempo * 2.5);
  float acquaTono = fract(dot(acquaQuadretto, vec2(0.3183, 0.5171)) + acquaScatto * 0.137);
  acquaLinea = step(0.74, acquaTono);
`;

/**
 * 9 — VETRO. Niente segni e molto più trasparente: l'acqua quasi non c'è, e
 * quello che si vede è il FONDO più il nastro di schiuma e il luccichio del
 * sole. È il limite opposto di «liscia» — la stessa idea, portata fino a dove
 * l'acqua smette di essere una superficie e diventa una lente.
 */
export const GLSL_ACQUA_STILE_VETRO = `
  acquaVelo = 0.42;
`;

/**
 * 10 — INCHIOSTRO. Le stesse linee, ma SCURE invece che chiare: l'acqua
 * disegnata a penna su carta chiara, non a biacca su carta scura.
 *
 * ⚠ E CAMBIA PIÙ DI QUANTO SEMBRI. Un segno chiaro si legge come luce (schiuma,
 * riflesso); un segno scuro si legge come solco, cioè come FORMA. Sono due
 * grammatiche diverse, e vale la pena guardarle una accanto all'altra prima di
 * decidere che l'acqua «deve» avere i riflessi bianchi.
 */
export const GLSL_ACQUA_STILE_INCHIOSTRO = `
  acquaLinea = acquaLineaPiena * step(uAcquaTagli.z, acquaCampo.a);
  acquaInchiostro = 1.0;
`;


/**
 * ── LE ONDE VERE: la superficie si MUOVE ────────────────────────────────────
 *
 * ⚠ E FIN QUI NON L'AVEVA MAI FATTO. Tutti gli stili qui sopra sono PITTURE su
 * una lastra ferma: cambia il disegno, non il materiale. Questo è il primo che
 * tocca la geometria — e la differenza non è un dettaglio, perché una
 * superficie che si alza e si abbassa smette di essere un piano colorato.
 *
 * ── IL VINCOLO CHE LO RENDE NON BANALE ──
 *
 * L'acqua di Leafy non è un piano: è una SCATOLA per cella, con le pareti che
 * sigillano contro i vicini. Spostare i vertici a caso la apre, e una scatola
 * aperta si vede da dentro — la stessa famiglia del difetto dell'avvolgimento
 * dei triangoli, che qui è già costata una giornata.
 *
 * Perché le facce restino cucite servono due proprietà, e sono tutte e due
 * verificabili leggendo il codice invece che a schermo:
 *
 *  1. LO SPOSTAMENTO DEV'ESSERE UNA FUNZIONE DELLA SOLA POSIZIONE DI MONDO.
 *     Due celle vicine condividono gli angoli: se `f` dipende solo da (x, z, y),
 *     l'angolo condiviso riceve lo STESSO valore dai due lati e la cucitura
 *     regge per costruzione. Se dipendesse anche dalla cella (dal suo livello,
 *     dal suo tipo) i due lati si spaccherebbero.
 *
 *  2. IL PESO DEV'ESSERE ZERO IN FONDO ALLA CELLA E UNO IN CIMA. Se si spostasse
 *     tutta la scatola, le pareti uscirebbero dal terreno. `fract` sulla quota
 *     lo dà gratis, perché le celle stanno agli interi (`cy = y + 0.5`): vale 0
 *     sul fondo e ~0,94 al pelo. Ed è ancora una funzione della sola quota,
 *     quindi non rompe la proprietà 1.
 *
 * ⚠ E LE PARETI DI CASCATA (tipo 2) RESTANO FERME. In una colonna piena il
 * fondo di una cella tocca la cima di quella sotto: la prima ha peso 0, la
 * seconda peso ~1, e fra le due si aprirebbe una crepa alta quanto l'ampiezza.
 * Il tipo 2 vuol dire esattamente «ho acqua sopra», cioè «non sono un pelo
 * libero»: è già il segnale giusto, e non serve calcolare niente.
 *
 * ⚠ QUATTRO ONDE A VENTAGLIO E DUE PIEGHE DI FASE — due verdetti del
 * committente, in due giri: «si nota proprio il pattern delle distorsioni
 * ripetersi sempre», e sulla prima cura (tre onde più una piega) ancora: «si
 * nota la ripetizione, sembrano delle STRISCE IN DIAGONALE». La seconda frase
 * è la diagnosi giusta: con poche onde piane e un'ampiezza dominante il campo
 * È fatto di bande parallele alla cresta più forte — il difetto non era solo
 * la periodicità, era la DIREZIONALITÀ. Le cure, tutte ALU e tutte funzioni
 * della sola posizione di mondo (la legge delle cuciture):
 *  · QUATTRO onde con le direzioni a ventaglio (~16°, −64°, 71°, 143°: mai
 *    due quasi parallele) e ampiezze QUASI PARI (0,55/0,45/0,35/0,25) —
 *    l'interferenza diventa a chiazze, senza una striscia che comanda;
 *  · frequenze senza rapporti semplici: i battimenti non tornano mai in fase;
 *  · DUE pieghe di fase lente (periodi ~30 e ~40 blocchi, direzioni diverse)
 *    che curvano i fronti, ognuna su onde diverse: un motivo che non è dritto
 *    non si riconosce nemmeno quando torna.
 * ⚠ Le ampiezze sommano a 1,6 come sempre: il margine sulla sponda (`moto`)
 * non cambia, e la prova dell'ampiezza campiona il tetto.
 * ⚠ CHI TOCCA QUESTI NUMERI tocca anche: la normale analitica qui sotto (le
 * derivate, piega per piega), `spintaGlsl`, creste e SSS (ricalcolano
 * l'altezza), e `altezzaPelo` in fondo al file. `test/acqua-pelo.test.mjs`
 * ormai non perdona: TRANSPILA questo GLSL in JS e confronta le due funzioni
 * punto per punto.
 */
export const GLSL_ACQUA_ONDE_VERTICE = `
  float acquaPeso = fract(position.y) * (1.0 - step(1.5, aAcqua.z) * step(aAcqua.z, 2.5));
  float acquaPiegaUna = 0.8 * sin(position.x * 0.151 - position.z * 0.203);
  float acquaPiegaDue = 0.8 * sin(position.z * 0.127 + position.x * 0.089);
  float acquaSu = 0.55 * sin(position.x * 0.83 + position.z * 0.24 + uTempo * 1.07 + acquaPiegaUna);
  acquaSu = acquaSu + 0.45 * sin(position.x * 0.51 - position.z * 1.04 - uTempo * 0.71 - 0.7 * acquaPiegaDue);
  acquaSu = acquaSu + 0.35 * sin(position.x * 0.47 + position.z * 1.39 + uTempo * 0.53 + 0.6 * acquaPiegaDue);
  acquaSu = acquaSu + 0.25 * sin(position.z * 0.95 - position.x * 1.27 + uTempo * 0.89 - 0.5 * acquaPiegaUna);
  positionUpdated.y = positionUpdated.y + acquaSu * uAcquaMoto * acquaPeso;
`;



/**
 * IL RIFLESSO PLANARE — l'unico pezzo che costa un PASS, e va detto forte.
 *
 * ⚠ È LA COSA CHE HO RIMANDATO PER TUTTO IL LAVORO, con una ragione buona e una
 * cattiva. Quella buona: in Leafy-Lantern il riflesso era il SECONDO picco del
 * fotogramma, 11,1 ms — la scena intera ridisegnata specchiata, senza culling
 * proprio. Quella cattiva: non ho mai misurato la versione economica, e ho
 * continuato a citare quel numero come se fosse una legge di natura.
 *
 * Qui è una `MirrorTexture` a risoluzione ridotta con una LISTA esplicita di
 * cosa riflettere. Non è la scena: è quello che si decide di mettere dentro.
 *
 * ⚠ E SI CAMPIONA IN COORDINATE DI SCHERMO. La camera dello specchio ha la
 * stessa proiezione di quella vera, quindi l'immagine riflessa cade esattamente
 * dove deve: per un frammento SUL piano dello specchio, la sua posizione a
 * schermo È la coordinata giusta nella texture. Vale finché l'acqua sta su quel
 * piano — che è il limite vero di un riflesso planare, e va saputo: uno specchio
 * per volta, un livello per volta.
 *
 * ⚠ LA DEFORMAZIONE VIENE DALLA NORMALE DELLE ONDE, ed è quella che lo rende
 * acqua invece che vetro: senza, il riflesso è nitido e la superficie sembra
 * uno specchio appoggiato per terra.
 *
 * ⚠ E IL PESO HA UN TETTO, che è la cura a un difetto visto dal committente:
 * «da molte angolazioni l'acqua sparisce o diventa bianca». Il Fresnel a vista
 * radente tende a UNO, e senza tetto l'acqua a quelle angolazioni DIVENTAVA lo
 * specchio — cioè il cielo: chiara come il cielo (bianca) o uguale al cielo
 * (invisibile). Un'acqua stilizzata non deve mai smettere di essere acqua:
 * il riflesso è un condimento, e `uRiflTetto` gli impedisce di diventare il
 * piatto. Solo le ricette che SONO specchi (metallo, neon) lo alzano.
 *
 * ⚠ E SULLE PARETI DI CASCATA NON SI APPLICA AFFATTO — è l'ultimo pezzo del
 * «non sembra una bella cascata». Uno specchio planare ha UN piano, ed è
 * orizzontale: su una superficie verticale quell'immagine non vuol dire niente,
 * ma il Fresnel lì è quasi massimo (si guarda la parete quasi di taglio rispetto
 * alla sua normale) e quindi pesava il più possibile. Risultato: la caduta
 * prendeva fino al 45% di un'immagine sbagliata — grigia — e usciva color
 * cemento sotto qualunque ricetta, mentre il pelo da cui nasceva era smeraldo.
 * Il difetto si vedeva come «la cascata è di un altro materiale», che è
 * esattamente quello che era.
 */
export const GLSL_ACQUA_RIFLESSO = `
  vec2 acquaSchermo = gl_FragCoord.xy / uSchermo;
  acquaSchermo = acquaSchermo + acquaNormale.xz * uRiflForza;
  vec3 acquaRiflesso = texture2D(uRiflesso, clamp(acquaSchermo, vec2(0.002), vec2(0.998))).rgb;
  float acquaQuantoRifl = pow(1.0 - abs(dot(acquaNormale, viewDirectionW)), 2.0);
  acquaTinta = mix(acquaTinta, acquaRiflesso, min(acquaQuantoRifl * uRiflPeso, uRiflTetto) * (1.0 - acquaSchiuma) * (1.0 - acquaSuMuro));
`;

// ── I MODELLI DI LUCE: sei modi DIVERSI di trattare la stessa acqua ─────────
//
// ⚠ QUESTA È LA CRITICA CHE IL COMMITTENTE HA FATTO E CHE ERA GIUSTA. I dieci
// «stili» qui sopra sono DECORAZIONI: cambiano il disegno sul pelo e passano
// tutti dalla stessa identica legge della luce — quella di casa, ombra a un
// gradino e nient'altro. Dieci pitture su un materiale solo.
//
// Un modello di luce è un'altra cosa: decide COME la superficie reagisce al
// sole, e con lui cambiano la sfumatura, il volume, la lucentezza. Sono i modi
// veri di «gestire l'acqua».
//
// ⚠ E TRE DI QUESTI ESCONO DALLO STILE DI CASA DI PROPOSITO. La regola («non
// esiste un colore diverso da ombra o non in ombra») è la decisione più
// difesa del progetto, e ha ragione di esserlo. Ma è stata presa sul TERRENO —
// su cubi di tinta piatta — e l'acqua non è terreno: è l'unica superficie del
// gioco che nella realtà fa proprio quello che lo stile vieta, cioè sfumare.
// Vale la pena guardarla prima di decidere, e per guardarla bisogna scriverla.
//
// La NORMALE è la chiave di tutti e sei: senza, non c'è niente su cui la luce
// possa variare. Si ricava analiticamente dalla stessa funzione d'onda del
// vertex shader — la derivata di una somma di seni è una somma di coseni — e
// costa due coseni, non una texture di normali.

/**
 * LA NORMALE DEL PELO, dalla derivata delle onde.
 *
 * ⚠ VALE ANCHE A ONDE SPENTE, ed è il punto: la geometria può restare una
 * lastra e la LUCE comportarsi come se non lo fosse. È il vecchio trucco delle
 * normal map, qui senza texture — la funzione d'onda la conosciamo, quindi la
 * sua pendenza la sappiamo derivare invece che campionarla.
 *
 * ⚠ SULLE PARETI SI TIENE QUELLA VERA: una parete di cascata è verticale, e una
 * normale «da pelo» le farebbe prendere la luce come se fosse sdraiata.
 *
 * ⚠ MA SI GONFIA VERSO L'ALTO, ed è la riga che ha tolto alle cascate l'aria di
 * muro bagnato. Tenendo la normale esatta, una parete verticale col sole alto
 * ha N·L ≈ 0,5 contro lo 0,9 del pelo accanto: la caduta usciva SEMPRE più
 * scura dell'acqua da cui viene, e a occhio si legge come sporco, non come
 * profondità. In natura è il contrario — l'acqua che precipita ingloba aria e
 * diventa PALLIDA: una cascata è la cosa più chiara di un torrente. Un mezzo
 * verso l'alto (`+0,8 y`) le ridà quella luce senza toglierle la verticalità,
 * ed è lo stesso trucco delle normali «gonfiate» sul fogliame dei giochi:
 * quello che si vuole non è la normale giusta, è la luce giusta.
 */
export const GLSL_ACQUA_NORMALE = `
  float acquaGobbaUna = vAcquaPos.x * 0.151 - vAcquaPos.z * 0.203;
  float acquaGobbaDue = vAcquaPos.z * 0.127 + vAcquaPos.x * 0.089;
  float acquaPiegaN1 = 0.8 * sin(acquaGobbaUna);
  float acquaPiegaN2 = 0.8 * sin(acquaGobbaDue);
  float acquaPiegaN1x = 0.1208 * cos(acquaGobbaUna);
  float acquaPiegaN1z = -0.1624 * cos(acquaGobbaUna);
  float acquaPiegaN2x = 0.0712 * cos(acquaGobbaDue);
  float acquaPiegaN2z = 0.1016 * cos(acquaGobbaDue);
  float acquaFaseUno = vAcquaPos.x * 0.83 + vAcquaPos.z * 0.24 + uTempo * 1.07 + acquaPiegaN1;
  float acquaFaseDue = vAcquaPos.x * 0.51 - vAcquaPos.z * 1.04 - uTempo * 0.71 - 0.7 * acquaPiegaN2;
  float acquaFaseTre = vAcquaPos.x * 0.47 + vAcquaPos.z * 1.39 + uTempo * 0.53 + 0.6 * acquaPiegaN2;
  float acquaFaseQua = vAcquaPos.z * 0.95 - vAcquaPos.x * 1.27 + uTempo * 0.89 - 0.5 * acquaPiegaN1;
  float acquaPendX = 0.55 * cos(acquaFaseUno) * (0.83 + acquaPiegaN1x) + 0.45 * cos(acquaFaseDue) * (0.51 - 0.7 * acquaPiegaN2x) + 0.35 * cos(acquaFaseTre) * (0.47 + 0.6 * acquaPiegaN2x) + 0.25 * cos(acquaFaseQua) * (-1.27 - 0.5 * acquaPiegaN1x);
  float acquaPendZ = 0.55 * cos(acquaFaseUno) * (0.24 + acquaPiegaN1z) + 0.45 * cos(acquaFaseDue) * (-1.04 - 0.7 * acquaPiegaN2z) + 0.35 * cos(acquaFaseTre) * (1.39 + 0.6 * acquaPiegaN2z) + 0.25 * cos(acquaFaseQua) * (0.95 - 0.5 * acquaPiegaN1z);
  vec3 acquaNorm = normalize(vec3(-acquaPendX * uAcquaRilievo, 1.0, -acquaPendZ * uAcquaRilievo));
  vec3 acquaNormMuro = normalize(normalW + vec3(0.0, 0.8, 0.0));
  acquaNormale = normalize(mix(acquaNorm, acquaNormMuro, acquaSuMuro));
  acquaNL = max(dot(acquaNormale, -normalize(uSoleVerso)), 0.0);
  acquaSpec = pow(max(dot(reflect(-viewDirectionW, acquaNormale), -normalize(uSoleVerso)), 0.0), uAcquaLucido);
`;

/**
 * I SEI MODELLI, in tabella — regola della casa.
 *
 * `legge` sostituisce «uAmbiente · mix(uOmbraTinta, 1, sole)», cioè il modo in
 * cui la luce moltiplica il colore. `extra` è luce SOMMATA (i riflessi).
 * `ombraRaw` è il fattore d'ombra della cascata prima che lo stile lo tagli a
 * gradini: `diffuseBase.r` è ancora in ambito lì, ed è quello che permette a un
 * modello morbido di avere un'ombra morbida.
 */
export const MODELLI = {
  // 1. LA LEGGE DI CASA. Ombra a un gradino, ambiente che moltiplica, tinta di
  //    cielo. L'acqua si comporta come il terreno, ed è la coerenza che il
  //    progetto ha scelto.
  piatto: {
    nota: 'la legge di casa: un gradino solo',
    legge: 'uAmbiente * mix(uOmbraTinta, vec3(1.0), sole)',
  },
  // 2. CEL A QUATTRO BANDE. La luce vera (N·L) esiste, ma quantizzata: si vede
  //    il volume dell'onda senza nessuna sfumatura. È il cel shading dei
  //    cartoni, che NON è la stessa cosa di «un gradino».
  celle: {
    nota: 'quattro bande di luce vera: volume senza sfumature',
    prima: 'float acquaLuceCel = floor(clamp(acquaNL, 0.0, 1.0) * 4.0 + 0.5) / 4.0;',
    legge: 'uAmbiente * mix(uOmbraTinta, vec3(1.0), sole * (0.45 + 0.55 * acquaLuceCel))',
  },
  // 3. MORBIDA. La sfumatura vera: N·L continuo e ombra non tagliata. È
  //    l'opposto esatto della regola di casa, ed è qui per poterla vedere.
  morbida: {
    nota: 'sfumatura continua: N·L pieno, ombra non tagliata',
    prima: 'float acquaOmbraDolce = clamp(diffuseBase.r, 0.0, 1.0);',
    legge: 'uAmbiente * mix(uOmbraTinta, vec3(1.0), acquaOmbraDolce * (0.35 + 0.65 * acquaNL))',
  },
  // 4. LUCIDA. Morbida più una specularità forte: la luce ci GIOCA sopra, ed è
  //    la cosa che il committente aveva chiesto all'inizio chiamandola «PBR».
  //    Non è PBR — è Blinn-Phong su una normale analitica — ma la sensazione
  //    che cercava è questa.
  lucida: {
    nota: 'diffusa morbida + speculare vera: la luce ci gioca sopra',
    prima: 'float acquaOmbraDolce = clamp(diffuseBase.r, 0.0, 1.0);',
    legge: 'uAmbiente * mix(uOmbraTinta, vec3(1.0), acquaOmbraDolce * (0.35 + 0.65 * acquaNL))',
    extra: 'vec3(acquaSpec * uAcquaForza * sole)',
  },
  // 5. SPENTA. Nessuna luce affatto: il colore puro, nemmeno l'ombra. È come
  //    era il mondo in Leafy-Lantern prima del motore — e su una superficie
  //    che non ha volume proprio è una tesi difendibile, non una mancanza.
  spenta: {
    nota: 'nessuna luce: colore puro, nemmeno l\'ombra',
    legge: 'vec3(1.0)',
  },
  // 6. VETROSA. Il Fresnel come LEGGE e non come decorazione: guardando a picco
  //    l\'acqua è quasi trasparente e scura, radente diventa chiara e piena. La
  //    variazione è continua — un\'altra sfumatura, su un altro asse.
  vetrosa: {
    nota: 'Fresnel continuo: cambia guardandola da angoli diversi',
    prima: 'float acquaRadente = pow(1.0 - abs(dot(acquaNormale, viewDirectionW)), 2.5);',
    legge: 'uAmbiente * mix(uOmbraTinta, vec3(1.0), sole) * (0.72 + 0.85 * acquaRadente)',
  },
};

/**
 * 11 — PIXEL. Le onde quantizzate su una griglia grossa, e il TEMPO a scatti:
 * l'acqua dei giochi in pixel art, dove anche il movimento è disegnato a
 * fotogrammi. È «mosaico» portato fino in fondo — lì scattava solo il tono,
 * qui scatta tutto.
 */
export const GLSL_ACQUA_STILE_PIXEL = `
  vec2 acquaPix = floor(acquaUvFerma * 11.0) / 11.0 - acquaVerso * floor(uTempo * 3.0) * 0.34;
  float acquaOndaPix = sin(dot(acquaPix, vec2(1.0, 0.42)) * uAcquaOnda.x);
  float acquaOndaPixDue = sin(dot(acquaPix, vec2(0.88, 0.60)) * uAcquaOnda.y + 1.7);
  acquaLinea = max(step(abs(acquaOndaPix), uAcquaOnda.z * 1.2), step(abs(acquaOndaPixDue), uAcquaOnda.z * 0.7));
`;

/** Gli stili in tabella — regola della casa. L'ordine è quello dei confronti. */
export const STILI = {
  liscia: GLSL_ACQUA_STILE_LISCIA,
  bande: GLSL_ACQUA_STILE_BANDE,
  rete: GLSL_ACQUA_STILE_RETE,
  creste: GLSL_ACQUA_STILE_CRESTE,
  tratti: GLSL_ACQUA_STILE_TRATTI,
  scaglie: GLSL_ACQUA_STILE_SCAGLIE,
  gocce: GLSL_ACQUA_STILE_GOCCE,
  mosaico: GLSL_ACQUA_STILE_MOSAICO,
  vetro: GLSL_ACQUA_STILE_VETRO,
  inchiostro: GLSL_ACQUA_STILE_INCHIOSTRO,
  pixel: GLSL_ACQUA_STILE_PIXEL,
};

/**
 * IL COLORE — e l'acqua è CRISTALLINA, cioè si vede il fondo.
 *
 * ⚠ ERA OPACA, ED ERA MEZZO PROBLEMA. Nella seconda immagine di riferimento gli
 * scogli sotto il pelo si vedono benissimo: è quello che fa leggere l'acqua come
 * acqua invece che come vernice azzurra. L'avevo portata a 0,93 di alfa
 * inseguendo un difetto diverso (un canale stretto che sembrava vetro sporco) —
 * ma quel canale sembrava sporco perché il COLORE era desaturato, non perché
 * fosse trasparente. La cura giusta è satura e trasparente, non opaca.
 *
 * ⚠ `vRiva.y` (quanto è aperto lo specchio) è la riga che rende sicura la
 * schiuma: in un canale largo UNA cella tutti e quattro gli angoli toccano una
 * sponda, la distanza vale zero dappertutto, e qualunque soglia generosa
 * dipingerebbe il canale di bianco pieno.
 *
 * ⚠ E LO SCIVOLO E LA PARETE USANO LA LINEA PIENA, non quella dello stile: un
 * pelo che precipita fa striature CONTINUE, e col tratteggio la cascata veniva a
 * puntini, cioè ferma.
 *
 * ⚠ I SEGNI FINI SI CONGEDANO CON LA DISTANZA (dalla sintesi: nessuno dei
 * nostri aveva un'attenuazione, e righe e scintille a `step` sono le prime a
 * FRIGGERE al largo — un pixel pesca dentro e fuori dalla banda a ogni
 * fotogramma). `vPositionW` con l'origine mobile è già relativa alla camera,
 * quindi `length(vPositionW)` È la distanza: il congedo costa una smoothstep.
 * Lo stesso fattore spegne le scintille del brillio, più sotto.
 */
export const GLSL_ACQUA_COLORE = `
  float acquaViaFattore = 1.0 - smoothstep(uSfumaVia.x, uSfumaVia.y, length(vPositionW));
  acquaLinea = acquaLinea * acquaViaFattore;
  // ⚠ IL COLORE DELLA CADUTA ARRIVA PER GRADI, e su una rampa PIÙ LUNGA di
  // quella del disegno: «lo stacco cromatico nella cascata è troppo netto».
  // Il disegno può cambiare in fretta senza dare fastidio (un motivo che si
  // stira è un movimento), ma un salto di TINTA sul ciglio si legge come un
  // bordo dipinto — due materiali che si toccano. Due blocchi e mezzo di
  // sfumatura, contro l'uno e mezzo del disegno: quando la lama ha finito di
  // schiarirsi, il ciglio è già lontano dall'occhio.
  float acquaCadTinta = smoothstep(0.0, 2.6, acquaCadGiu) * acquaSuMuro;
  acquaFondale = max(acquaFondale, max(acquaCadTinta, acquaScivolo * 0.55) * 0.85);
  acquaTinta = mix(uAcquaFonda, uAcquaBassa, acquaFondale);
  acquaTinta = mix(acquaTinta, mix(acquaTinta, uSchiuma, 0.30), acquaCadTinta);
  acquaAlfa = mix(uAcquaAlfa.x, uAcquaAlfa.y, acquaFondale) * acquaVelo;
  vec3 acquaSegno = mix(uAcquaChiara, uAcquaScura, acquaInchiostro);
  acquaTinta = mix(acquaTinta, acquaSegno, acquaLinea);
  float acquaLargh = uAcquaTagli.x * smoothstep(0.15, 0.55, vRiva.y);
  float acquaSchiuma = step(vRiva.x, acquaLargh * (1.0 - uAcquaTagli.y + 2.0 * uAcquaTagli.y * acquaCampo.a));
  acquaSchiuma = max(acquaSchiuma, acquaSchiumaProf);
  // ⚠ LO SCIVOLO È IL CIGLIO, e il ciglio è la CERNIERA fra pelo e caduta: se
  // ci si dipinge sopra la linea piena a tutta forza si ottiene esattamente lo
  // stacco che si sta cercando di togliere — una riga bianca dove il disegno
  // dovrebbe passare da una parte all'altra senza farsi notare.
  acquaSchiuma = max(acquaSchiuma, acquaScivolo * acquaLineaPiena * 0.35);
  acquaSchiuma = max(acquaSchiuma, acquaSuMuro * max(acquaMuroSegno, acquaMuroSchiuma));
  acquaTinta = mix(acquaTinta, uSchiuma, acquaSchiuma);
  acquaAlfa = mix(acquaAlfa, uAcquaAlfa.z, acquaSchiuma);
  // ⚠ LA LAMA È PIÙ OPACA DEL PELO DA CUI VIENE, ed è la riga che ha tolto alle
  // cascate il colore del cemento. Tenendo l'alfa dell'acqua calma, la parete
  // lasciava vedere attraverso la roccia da cui salta — e siccome dietro una
  // cascata c'è quasi sempre roccia, la fusione dava grigio: misurato al pixel,
  // (104,131,133) contro i (125,209,222) della stessa acqua senza profondità.
  // Un getto che cade ingloba aria e diventa quasi opaco: si sale verso l'alfa
  // della schiuma. Quello che resta trasparente è solo dove i nastri si
  // separano davvero — cioè lo sfrangiamento, che rientra qui in coda.
  float acquaMuroAlfa = mix(acquaAlfa, uAcquaAlfa.z, 0.7) * max(acquaMuroCorpo, acquaSchiuma);
  acquaAlfa = mix(acquaAlfa, acquaMuroAlfa, acquaCadTinta);
`;




/**
 * ── I MOTIVI DI FIRMA: il disegno VERO di ogni gioco, non rumore tarato ─────
 *
 * ⚠ QUESTA È LA RISPOSTA A «le noise sono tutte uguali», e la critica coglieva
 * il difetto alla radice: tutte le ricette pescavano dallo STESSO campo di
 * rumore, quindi qualunque palette restava una variazione della stessa acqua.
 * Ma l'acqua di quei giochi non è rumore tagliato: è un MOTIVO DISEGNATO — i
 * trattini ondulati in griglia di New Leaf, gli archetti che appaiono e
 * svaniscono di New Horizons, la ragnatela di caustiche dei Pokémon e di
 * Galaxy. Sono pattern d'autore, e vanno scritti uno per uno.
 *
 * Ogni motivo è una FUNZIONE sua (niente campo condiviso), ALU pura, e prende
 * il posto del disegno dello stile quando la ricetta lo dichiara.
 *
 * ⚠ MA NIENTE FORME CHIUSE, e questa regola è costata due motivi riscritti.
 * Verdetto del committente: «le acque dove usi simboli evidenti — cerchietti,
 * "c" eccetera — sono tremende e fuori stile». Aveva ragione, e il difetto non
 * era la taratura: era il PRINCIPIO. Un anello e un archetto sono forme chiuse
 * e riconoscibili, cioè SIMBOLI: l'occhio smette di vedere una superficie e
 * comincia a leggere caratteri sparsi su un fondo, e in mezzo a un mondo di
 * tinte piatte quei caratteri diventano la cosa più forte dello schermo.
 * Peggio: essendo generati per CELLA, si dispongono su una griglia — e una
 * griglia di simboli è la firma più leggibile che esista di «questa è una
 * texture ripetuta».
 *
 * Quello che l'acqua vera mostra non sono forme: sono CRESTE, cioè linee
 * aperte, lunghe, sinuose, che nascono e muoiono senza chiudersi. Si ottengono
 * prendendo una banda stretta in cima a un campo di seni con il dominio
 * piegato da altri seni — nessuna cella, nessun hash, nessun raggio. Restano
 * distinguibili l'uno dall'altro per lunghezza d'onda e spessore della banda:
 * `archetti` fa creste corte e fitte che respirano, `cerchi` due famiglie —
 * una larga e lenta e una sottile sopra.
 */
export const MOTIVI = {
  /**
   * TRATTINI (Animal Crossing: New Leaf) — la griglia sfalsata di lineette
   * orizzontali ondulate che APPAIONO E SCOMPAIONO. La firma di New Leaf non è
   * il colore: è che i trattini non scorrono quasi — lampeggiano piano, ognuno
   * col suo orologio, su righe sfalsate di mezza cella.
   */
  trattini: `
float acquaMotivo(vec2 acquaMuv, float acquaMt) {
  float acquaSfaso = step(0.5, fract(floor(acquaMuv.y) * 0.5)) * 0.5;
  vec2 acquaCasella = vec2(acquaMuv.x + acquaSfaso, acquaMuv.y);
  vec2 acquaFraz = fract(acquaCasella);
  float acquaCaso = fract(sin(dot(floor(acquaCasella), vec2(12.9898, 78.233))) * 43758.5453);
  float acquaVivo = step(0.42, fract(acquaCaso + acquaMt * 0.10));
  float acquaOndina = sin(acquaFraz.x * 6.2831 + acquaCaso * 6.2831) * 0.07;
  float acquaDentro = step(abs(acquaFraz.x - 0.5), 0.30) * step(abs(acquaFraz.y - 0.5 - acquaOndina), 0.055);
  return acquaDentro * acquaVivo;
}
`,
  /**
   * ARCHETTI (Animal Crossing: New Horizons) — segmenti d'arco rivolti in giù,
   * radi, che sfumano dentro e fuori ognuno per conto suo. È il gesto
   * calligrafico di New Horizons: non righe, SORRISI d'acqua sparsi.
   */
  archetti: `
float acquaMotivo(vec2 acquaMuv, float acquaMt) {
  vec2 acquaP = acquaMuv * 0.5;
  acquaP += 0.42 * vec2(sin(acquaP.y * 1.31 + acquaMt * 0.33), cos(acquaP.x * 1.17 - acquaMt * 0.27));
  float acquaLunga = sin(acquaP.x * 0.62 + acquaP.y * 1.05
    + sin(acquaP.y * 1.9 - acquaMt * 0.4) * 0.75
    + sin(acquaP.x * 2.7 + acquaMt * 0.22) * 0.35);
  float acquaFine = sin(acquaP.x * 1.7 - acquaP.y * 0.9 + sin(acquaP.x * 3.1 + acquaMt * 0.5) * 0.6 - acquaMt * 0.3);
  return max(smoothstep(0.80, 0.96, acquaLunga), smoothstep(0.90, 0.99, acquaFine) * 0.6);
}
`,
  /**
   * RAGNATELA (Pokémon BDSP · Mario Galaxy · le piscine) — la rete di celle di
   * Voronoi: il confine fra una cella e l'altra è la linea, e i semi NUOTANO
   * col tempo, quindi la rete si deforma di continuo senza mai scorrere. È il
   * pattern di caustiche più riconoscibile che esista nei giochi, e non c'è
   * rumore tagliato che gli somigli.
   * ⚠ Nove distanze per pixel: è il motivo più caro dei tre, ed è ALU pura —
   * su desktop non si misura, su mobile non arriva (vive nelle ricette, e le
   * ricette ricche su mobile scalano da sole).
   */
  /**
   * CERCHI (Wind Waker) — e la tecnica viene dallo STUDIO, non da me: l'oceano
   * di Wind Waker è un pattern di CERCHI sparsi («foam pattern constructed out
   * of a series of circles»), su DUE strati — uno bianco e uno più scuro,
   * sfalsato perché le linee non si sovrappongano — con le UV che ondeggiano di
   * seni composti. Niente rumore, niente voronoi: cerchi disegnati.
   */
  cerchi: `
float acquaMotivo(vec2 acquaMuv, float acquaMt) {
  vec2 acquaP = acquaMuv * 0.42;
  acquaP += 0.55 * vec2(sin(acquaP.y * 0.83 + acquaMt * 0.21), cos(acquaP.x * 0.71 - acquaMt * 0.17));
  float acquaLenta = sin(acquaP.y * 0.9 - acquaP.x * 0.35 + sin(acquaP.x * 1.4 + acquaMt * 0.26) * 1.1);
  float acquaMedia = sin(acquaP.x * 1.25 + acquaP.y * 0.5 + sin(acquaP.y * 2.1 - acquaMt * 0.35) * 0.9 + acquaMt * 0.18);
  float acquaLarga = smoothstep(0.62, 0.93, acquaLenta);
  float acquaStretta = smoothstep(0.88, 0.99, acquaMedia);
  return max(acquaLarga * 0.75, acquaStretta);
}
`,
  /**
   * NUVOLE (anime alla CG Dash / Ghibli) — le grandi macchie bianche piatte,
   * tonde e STIRATE IN ORIZZONTALE, che ondeggiano piano sul blu pieno. Il
   * riferimento (portato dal committente) è lo shader «anime water» di CG Dash:
   * la firma non è un rumore, sono BLOB morbidi dal bordo netto, radi, che
   * respirano. Qui: Voronoi F1 con le celle larghe tre volte l'altezza e i
   * semi che nuotano — il blob è «sono vicino a un seme», e il bordo resta
   * tondo per costruzione.
   */
  nuvole: `
float acquaMotivo(vec2 acquaMuv, float acquaMt) {
  vec2 acquaStira = vec2(acquaMuv.x * 0.34, acquaMuv.y);
  vec2 acquaCella = floor(acquaStira);
  vec2 acquaFraz = fract(acquaStira);
  float acquaVicino = 8.0;
  for (int acquaGy = -1; acquaGy <= 1; acquaGy++) {
    for (int acquaGx = -1; acquaGx <= 1; acquaGx++) {
      vec2 acquaVic = vec2(float(acquaGx), float(acquaGy));
      vec2 acquaSeme = fract(sin(vec2(dot(acquaCella + acquaVic, vec2(127.1, 311.7)), dot(acquaCella + acquaVic, vec2(269.5, 183.3)))) * 43758.5453);
      float acquaViva = step(0.30, acquaSeme.x);
      vec2 acquaPunto = acquaVic + 0.5 + 0.30 * sin(acquaMt * 0.4 + 6.2831 * acquaSeme) - acquaFraz;
      float acquaDist = length(acquaPunto * vec2(1.0, 1.5)) + (1.0 - acquaViva) * 9.0;
      acquaVicino = min(acquaVicino, acquaDist);
    }
  }
  return step(acquaVicino, 0.33);
}
`,
  ragnatela: `
float acquaMotivo(vec2 acquaMuv, float acquaMt) {
  vec2 acquaCella = floor(acquaMuv);
  vec2 acquaFraz = fract(acquaMuv);
  float acquaPrima = 8.0;
  float acquaSeconda = 8.0;
  for (int acquaGy = -1; acquaGy <= 1; acquaGy++) {
    for (int acquaGx = -1; acquaGx <= 1; acquaGx++) {
      vec2 acquaVic = vec2(float(acquaGx), float(acquaGy));
      vec2 acquaSeme = fract(sin(vec2(dot(acquaCella + acquaVic, vec2(127.1, 311.7)), dot(acquaCella + acquaVic, vec2(269.5, 183.3)))) * 43758.5453);
      vec2 acquaPunto = acquaVic + 0.5 + 0.38 * sin(acquaMt * 0.7 + 6.2831 * acquaSeme) - acquaFraz;
      float acquaDist = length(acquaPunto);
      acquaSeconda = min(acquaSeconda, max(acquaDist, acquaPrima));
      acquaPrima = min(acquaPrima, acquaDist);
    }
  }
  return step(acquaSeconda - acquaPrima, 0.10);
}
`,
};

/**
 * ── I TALENTI: quattro effetti «stupendi ma leggeri» ────────────────────────
 *
 * ⚠ LA FAMIGLIA È «ALU PURA»: nessuna passata, nessuna texture nuova, solo
 * aritmetica sul frammento — cioè la valuta che anche una GPU modesta ha in
 * abbondanza. È il contrario della scala `vera`, che paga render veri: questi
 * quattro si possono accendere quasi gratis, e il loro mestiere è dare a una
 * ricetta un CARATTERE che nessuna taratura di colori può dare.
 */

/**
 * L'IRIDESCENZA — la pellicola di benzina, la bolla di sapone.
 *
 * È l'interferenza di pellicola sottile detta in una riga: il colore ruota
 * lungo l'arcobaleno al variare dell'ANGOLO di vista, quindi cambia muovendo
 * la camera e ondeggia col pelo (la normale entra nell'angolo). Il coseno a
 * tre fasi sfalsate di 120° è il modo standard di scrivere un arcobaleno
 * senza texture.
 * ⚠ Si SOMMA come luce (via `luceExtra`), non si mescola nel colore: una
 * pellicola iridescente brilla anche dove la superficie è scura — anzi,
 * soprattutto lì, ed è il motivo per cui la benzina si vede sulle pozzanghere
 * nere.
 */
export const GLSL_ACQUA_IRIDE = `
  float acquaVelame = 1.0 - abs(dot(acquaNormale, viewDirectionW));
  acquaIride = (0.5 + 0.5 * cos(6.28318 * (acquaVelame * 1.7 + uTempo * 0.03) + vec3(0.0, 2.0944, 4.1888))) * pow(acquaVelame, 1.6);
`;

/**
 * LE CRESTE BIANCHE — la schiuma dove l'onda è ALTA, non dove tocca qualcosa.
 *
 * ⚠ L'ALTEZZA NON SI CAMPIONA, SI RICALCOLA: la funzione d'onda è nostra e le
 * sue fasi sono già in ambito (le usa la normale). Due seni, una soglia, e la
 * schiuma nasce sulle creste e muore nei ventri MENTRE l'onda viaggia — che è
 * il look del mare grosso, e non c'è modo di fingerlo con un disegno che
 * scorre. Il campo delle chiazze sfrangia il bordo, come per la riva.
 */
export const GLSL_ACQUA_CRESTE = `
  float acquaOndaAlt = (0.55 * sin(acquaFaseUno) + 0.45 * sin(acquaFaseDue) + 0.35 * sin(acquaFaseTre) + 0.25 * sin(acquaFaseQua)) * 0.625;
  acquaSchiumaProf = max(acquaSchiumaProf, step(uCresteSoglia, acquaOndaAlt) * step(0.30, acquaCampo.a));
`;




/**
 * IL CONTROLUCE (SSS finto) — le creste che si accendono guardando verso il sole.
 *
 * ⚠ DALLA SINTESI (shervheim): la retroilluminazione dell'acqua sottile è un
 * dot e una moltiplicazione — colore × altezza dell'onda × «sto guardando
 * verso il sole». Niente texture, niente profondità, e al tramonto cambia la
 * scena. Da noi è a GRADINO, non in rampa (la regola di casa), e vive nella
 * stessa finestra stretta di azimut del brillio: il bottone «☀ verso il sole»
 * del banco esiste per questo.
 */
export const GLSL_ACQUA_SSS = `
  float acquaAltSss = (0.55 * sin(acquaFaseUno) + 0.45 * sin(acquaFaseDue) + 0.35 * sin(acquaFaseTre) + 0.25 * sin(acquaFaseQua)) * 0.625;
  float acquaControluce = step(0.86, dot(viewDirectionW, normalize(-uSoleVerso))) * step(0.34, acquaAltSss) * step(0.05, uBrillio.x);
  acquaTinta = mix(acquaTinta, uSssTinta, acquaControluce * 0.55 * (1.0 - acquaSchiuma));
`;

/**
 * LE RIGHE DI RIVA — le onde che MARCIANO verso la spiaggia (Animal Crossing).
 *
 * ⚠ SONO CURVE DI LIVELLO DELLO SPESSORE IN MOTO, ed è quello che le rende
 * giuste: righe a distanza fissa dal fondale che avanzano verso riva, quindi
 * SEGUONO la forma della spiaggia da sole — si piegano nelle insenature,
 * abbracciano le secche — perché la batimetria ce l'hanno dentro. Il post di
 * riferimento (le onde da spiaggia «alla Animal Crossing») le costruisce a
 * righe frazionarie sulla UV; con lo spessore vero vengono meglio: niente UV
 * da orientare verso riva, la riva se la trovano.
 * ⚠ Vive sopra la scala `vera` (serve lo spessore): senza profondità non
 * esiste, ed è giusto così.
 *
 * ⚠ E LA RISACCA RESPIRA IN FASE CON LE RIGHE, che è il dettaglio d'autore del
 * riferimento («surf foam breathing in and out», col periodo agganciato al
 * passaggio di una banda): la lingua bianca sul bagnasciuga avanza e si ritira
 * col coseno alla STESSA cadenza con cui una riga arriva a riva — se i due
 * orologi divergono l'occhio lo sente come «qualcosa non torna» senza saper
 * dire cosa. Il −2,5 è lo scarto di fase del riferimento, tenuto uguale.
 */
export const GLSL_ACQUA_RIGARIVA = `
  float acquaRigaFase = fract(acquaSpessoreGiu * uRigaRiva.x - uTempo * uRigaRiva.y);
  float acquaRigaBanda = step(acquaRigaFase, 0.16) * step(0.03, acquaSpessoreGiu) * step(acquaSpessoreGiu, 1.5) * acquaPeloLibero;
  acquaSchiumaProf = max(acquaSchiumaProf, acquaRigaBanda * step(0.28, acquaCampo.a * 0.8 + 0.35 * (1.5 - acquaSpessoreGiu)));
  float acquaRespiroRiva = 0.5 + 0.5 * cos(uTempo * uRigaRiva.y * 6.2831 / uRigaRiva.x - 2.5);
  float acquaRisacca = step(acquaSpessoreGiu, 0.06 + 0.16 * acquaRespiroRiva) * step(0.30, acquaCampo.a + 0.4 * acquaRespiroRiva);
  acquaSchiumaProf = max(acquaSchiumaProf, acquaRisacca);
`;

/**
 * LE INCRESPATURE — l'acqua che RISPONDE al tocco.
 *
 * ⚠ È LA TECNICA DEI RIFERIMENTI «interattivi», rifatta senza render target:
 * loro dipingono le scie in una texture che si dissolve (l'abbiamo fatto in
 * Lantern per la schiuma); qui gli IMPATTI sono otto vec4 in uniform —
 * (x, z, quando, forza) — e il fragment disegna anelli che si allargano
 * dall'età dell'impatto. Niente passate, niente memoria da sfumare: un anello
 * è una funzione del tempo, e otto bastano perché uno vive due secondi e mezzo.
 *
 * ⚠ SESTA STESURA, e ogni giro l'ha deciso il committente guardando. La
 * traiettoria completa, perché nessuno la ripercorra: anelli a `step` →
 * macchie di schiuma → solo onda → cerchi in dissolvenza dall'inizio («fanno
 * ridere») → QUESTA: i cerchi della prima stesura, «belli grandi» e NETTI per
 * quasi tutta la vita — due anelli concentrici, il secondo più lento, come
 * allora — e la dissolvenza SOLO SUL FINALE: «al posto di sparire
 * all'improvviso devono sfocarsi al trasparente». Quindi il tocco fa due cose:
 *  · PIEGA LA NORMALE con un treno radiale di creste (`sin` finestrato dietro
 *    il fronte): il blocco sta DOPO la normale e PRIMA di rifrazione e
 *    riflesso nell'ordine d'innesto, quindi specchio e fondo tremano ad
 *    anelli da soli. L'ampiezza decade con l'età e col raggio (1/r).
 *  · DIPINGE DUE CERCHI a `step`, pieni fino al 62% della vita, poi una
 *    smoothstep li porta al trasparente. La dissolvenza è uno strappo
 *    DICHIARATO alla regola «niente sfumature» — chiesto due volte, e
 *    funziona perché `acquaSchiumaProf` è un PESO, non un sì/no: la schiuma
 *    parziale si fonde da sola in GLSL_ACQUA_COLORE.
 * La SCIA non abita più qui: ha il suo registro (`uScia`, qui sotto).
 */
export const GLSL_ACQUA_TOCCHI = `
  for (int acquaTi = 0; acquaTi < 8; acquaTi++) {
    vec4 acquaTocco = uTocchi[acquaTi];
    float acquaEtaT = uTempo - acquaTocco.z;
    float acquaVivoT = step(0.0, acquaEtaT) * step(acquaEtaT, 2.4) * step(0.01, acquaTocco.w);
    float acquaEtaFraz = acquaEtaT * 0.4166;
    vec2 acquaDaT = vAcquaPos.xz - acquaTocco.xy;
    float acquaDistT = max(length(acquaDaT), 0.001);
    float acquaFronteT = 0.25 + acquaEtaT * 1.6;
    float acquaFaseT = (acquaDistT - acquaFronteT) * 5.2;
    float acquaCodaT = smoothstep(-10.0, -4.0, acquaFaseT) * (1.0 - smoothstep(0.2, 1.5, acquaFaseT));
    float acquaSmorzaT = acquaVivoT * acquaTocco.w * (1.0 - acquaEtaFraz) / (1.0 + acquaDistT * 0.75);
    float acquaPendaT = sin(acquaFaseT) * acquaCodaT * acquaSmorzaT * 0.9;
    acquaNormale = normalize(vec3(acquaNormale.x + acquaDaT.x / acquaDistT * acquaPendaT, acquaNormale.y, acquaNormale.z + acquaDaT.y / acquaDistT * acquaPendaT));
    float acquaCerchioT = step(abs(acquaDistT - acquaFronteT), 0.13 + acquaEtaT * 0.05);
    float acquaCerchioDueT = step(abs(acquaDistT - acquaFronteT * 0.55), 0.09) * 0.8;
    float acquaSvanisceT = 1.0 - smoothstep(0.62, 1.0, acquaEtaFraz);
    acquaSchiumaProf = max(acquaSchiumaProf, max(acquaCerchioT, acquaCerchioDueT) * acquaSvanisceT * acquaVivoT * min(acquaTocco.w, 1.0));
  }
`;

/**
 * LA SCIA — il registro dei segni che un corpo in moto lascia dietro di sé.
 *
 * ⚠ SEDICI POSTI SUOI, SEPARATI DAGLI OTTO TOCCHI, e la ragione è aritmetica:
 * una lingua continua vuole segni ogni ~7 centesimi di secondo per un secondo
 * di vita — una dozzina vivi insieme — e nel registro dei tocchi avrebbero
 * cannibalizzato ogni anello dopo mezzo secondo.
 *
 * ⚠ IL SEGNO PARLA LA GRAMMATICA DELLA SCHIUMA DI CASA, non quella delle
 * sfumature — due bocciature per arrivarci: le macchie staccate «sembrano
 * scoregge bianche», e i dischetti sfumati «sono fuori stile: non è una scia
 * di schiuma come i bordi degli oggetti». La schiuma di contatto ai bordi è
 * BIANCA PIENA con l'orlo ritagliato dal campo delle chiazze, e la scia è la
 * stessa sostanza: `step` sul raggio ritagliato dal campo, il raggio che si
 * ASSOTTIGLIA con l'età (la lingua si stringe verso la coda), e la morte per
 * SBRICIOLAMENTO — la soglia sull'età sale col campo, i fiocchi bassi cadono
 * prima. Sovrapposti fitti (un segno ogni ~7 centesimi) fanno una lingua
 * continua che si sfalda, senza un pixel di grigio.
 */
export const GLSL_ACQUA_SCIA = `
  for (int acquaSi = 0; acquaSi < 16; acquaSi++) {
    vec4 acquaSegnoS = uScia[acquaSi];
    float acquaEtaS = uTempo - acquaSegnoS.z;
    float acquaVivoS = step(0.0, acquaEtaS) * step(acquaEtaS, 1.3) * step(0.01, acquaSegnoS.w);
    float acquaFrazS = acquaEtaS * 0.769;
    float acquaDistS = length(vAcquaPos.xz - acquaSegnoS.xy);
    float acquaRaggioS = acquaSegnoS.w * (1.0 - 0.6 * acquaFrazS);
    float acquaOrloS = acquaRaggioS * (0.6 + 0.8 * acquaCampo.a);
    float acquaViveS = step(acquaFrazS, 0.3 + 0.7 * acquaCampo.a);
    acquaSchiumaProf = max(acquaSchiumaProf, step(acquaDistS, acquaOrloS) * acquaViveS * acquaVivoS);
  }
`;


/**
 * ── LA CASCATA, rifatta per FASCE D'ALTEZZA ─────────────────────────────────
 *
 * ⚠ IL VERDETTO ERA «una texture spiattellata male», ed era vero due volte: la
 * parete campionava lo stesso tratteggio del pelo (che sul muro si piastrella a
 * vista), e non sapeva NIENTE di sé — un filo d'acqua e una cascata di sei
 * blocchi vestivano identiche. Adesso il mesher dichiara la COLONNA (cima e
 * base nel canale extra: vAcqua.xy quando il tipo è 2), e il disegno cambia
 * con l'altezza e con la caduta percorsa:
 *
 *  · IL CAPPELLO (primo mezzo blocco dal labbro): acqua TESA, nessun segno —
 *    l'acqua che scavalca è vetro, i filamenti nascono dopo;
 *  · IL CORPO: filamenti verticali PROCEDURALI per colonna — larghezza, fase e
 *    velocità da hash per striscia, quindi niente piastrella per costruzione;
 *  · IL PIEDE, solo dai TRE blocchi in su: schiuma bianca sull'ultimo tratto,
 *    col bordo sbriciolato dal campo; dai SEI in su la schiuma sale più alta e
 *    sopra di lei compare una fascia RADA di spruzzi. Un salto di un blocco
 *    non schiuma: non ha avuto il tempo di far male all'acqua.
 *
 * ── SECONDA STESURA: LA CADUTA LA GOVERNA LA FISICA, NON UNA RAMPA A MANO ──
 *
 * ⚠ LA VERSIONE PER FASCE ERA GIUSTA DI STRUTTURA E FINTA DI MOTO: i filamenti
 * si allungavano con una `smoothstep` sulla quota — una rampa scelta a occhio —
 * e scorrevano a velocità COSTANTE. Ma un'acqua che cade accelera, e tutto
 * quello che l'occhio riconosce come «cascata» esce da lì. Adesso il moto ha
 * una sola sorgente, `v = sqrt(v₀² + 2·a·h)`, e le tre cose che si vedono la
 * seguono da sole invece di essere tarate una per una:
 *  · LO STIRAMENTO: si campiona nel TEMPO DI VOLO, `t = 2(v−v₀)/2a`, non nella
 *    quota. Le bande di fase costante sono i pacchetti d'acqua veri: in cima
 *    stanno fitte, in fondo si distanziano — lo stiramento È la fisica, e non
 *    c'è nessuna rampa da ritoccare.
 *  · L'ASSOTTIGLIAMENTO: portata costante vuol dire `larghezza · v = cost`, e
 *    infatti un getto si stringe scendendo. Metà effetto (`mix` a 0,55): quello
 *    pieno rende una cascata alta un filo di spago.
 *  · IL SFRANGIAMENTO: sotto, fra un nastro e l'altro, si vede ATTRAVERSO
 *    (`acquaMuroCorpo` abbassa l'alfa). È il pezzo che mancava di più — una
 *    parete d'acqua opaca uniforme si legge come una tenda di plastica. Solo
 *    dal 35% della caduta in giù e solo dai tre blocchi: un salto corto è una
 *    lama compatta, e sfrangiarlo sarebbe un difetto.
 *
 * ⚠ E IL CIGLIO ADESSO C'È — ma UNO SOLO, non uno per cella. La riga bianca su
 * ogni `fract` della quota era «la malta di un muro di mattoni» (l'errore di
 * concetto documentato sopra: il tipo 2 vuol dire «ho acqua sopra», cioè sono
 * IN MEZZO alla caduta). Sulla cima VERA della colonna, invece, il labbro
 * esiste per davvero: `acquaCadGiu` a zero è il punto dove l'acqua scavalca, e
 * lì una cresta di luce ci va. La differenza fra i due sta tutta nel fatto che
 * uno lo dice la geometria e l'altro lo diceva una periodicità inventata.
 *
 * ⚠ E I FILAMENTI NON SONO PIÙ IL DISEGNO: sono un DI PIÙ che nasce scendendo.
 * Il disegno della cascata è quello dello stile della ricetta (vedi la nota
 * delle UV: sulla parete si campiona lo stesso motivo, stirato dal tempo di
 * volo). I nastri si sommano sopra, pesati da `acquaCadNato` — zero al ciglio,
 * pieni un blocco e mezzo più in giù. Prima erano l'unica cosa che si vedeva su
 * una parete, ed è il motivo per cui tutte le cascate si somigliavano.
 *
 * ⚠ TUTTO ALU, NIENTE LETTURE: la cascata è identica su desktop e su mobile, e
 * i suoi filamenti non possono piastrellarsi perché non c'è nessuna tessitura
 * da ripetere — solo hash per striscia.
 */
export const GLSL_ACQUA_CASCATA = `
  float acquaCadU = mix(vAcquaPos.x, vAcquaPos.z, acquaLungoZ);
  float acquaCadStria = acquaCadU * uCascata.x;
  float acquaCadCol = floor(acquaCadStria);
  float acquaCadFraz = fract(acquaCadStria) - 0.5;
  float acquaCadCaso = fract(sin(acquaCadCol * 127.1) * 43758.5453);
  float acquaCadCaso2 = fract(sin(acquaCadCol * 311.7 + 1.7) * 24634.6345);
  float acquaCadMagro = mix(1.0, 0.5916 / acquaCadVel, 0.55);
  float acquaCadMezzo = 0.20 + 0.16 * acquaCadCaso;
  float acquaFiloLargo = smoothstep(acquaCadMezzo * acquaCadMagro, acquaCadMezzo * acquaCadMagro * 0.45, abs(acquaCadFraz));
  float acquaCadRitmo = 0.55 + 0.42 * acquaCadCaso2;
  float acquaFiloFase = fract((uTempo - acquaCadVolo) * acquaCadRitmo + acquaCadCaso * 7.0);
  float acquaMuroCorpo = mix(1.0, acquaFiloLargo, uCascata.w * smoothstep(0.55, 0.95, acquaCadGiu / acquaCadAlta) * step(2.9, acquaCadAlta));
  float acquaCappello = step(acquaCadGiu, 0.42);
  float acquaCiglio = smoothstep(0.14, 0.0, acquaCadGiu);
  float acquaMuroSegno = acquaFiloLargo * step(acquaFiloFase, 0.30 + 0.45 * acquaCadCaso2)
    * (1.0 - acquaCappello) * acquaCadNato * uCascata.z;
  acquaMuroSegno = max(acquaMuroSegno, acquaCiglio * 0.75);
  float acquaMuroSchiuma = step(acquaCadPiede, 0.8 + 0.35 * acquaCampo.a) * step(2.9, acquaCadAlta);
  acquaMuroSchiuma = max(acquaMuroSchiuma, step(acquaCadPiede, 1.9) * step(5.5, acquaCadAlta) * step(0.5, acquaCampo.a));
  float acquaVelo3 = smoothstep(0.9 + acquaCadAlta * 0.10, 0.0, acquaCadPiede) * step(2.9, acquaCadAlta);
  acquaMuroSchiuma = max(acquaMuroSchiuma, acquaVelo3 * (0.30 + 0.45 * acquaCampo.a) * 0.85);
  float acquaGoccia = fract(sin(floor(acquaCadStria * 2.7 + floor(uTempo * 1.7 + acquaCadCaso * 5.0)) * 78.2) * 9184.3);
  float acquaSuGiu = fract(acquaGoccia * 3.7 + uTempo * (0.5 + acquaGoccia * 0.5));
  float acquaSpruzzo = step(5.5, acquaCadAlta) * step(0.88, acquaGoccia)
    * smoothstep(0.22, 0.0, abs(acquaCadPiede - acquaSuGiu * 2.6)) * step(abs(acquaCadFraz), 0.16);
  acquaMuroSchiuma = max(acquaMuroSchiuma, acquaSpruzzo);
`;

/**
 * ── L'ACQUA VERA: profondità, rifrazione, caustiche ─────────────────────────
 *
 * ⚠ QUESTI TRE BLOCCHI SONO LA RISPOSTA A «vedo roba riciclata», e la critica
 * era esatta: ventiquattro ricette erano ventiquattro tarature dello stesso
 * fragment. Quello che distingue l'acqua di un gioco vero non è la palette — è
 * che LEGGE IL MONDO: sa quanto è profonda (depth), mostra il fondo deformato
 * (rifrazione), e ci dipinge sopra la luce (caustiche). Tre passate condivise
 * (`profonditaCondivisa`, `rifrazioneCondivisa`) e questi innesti.
 *
 * ── PRIMA DEL COLORE: lo spessore, e cosa se ne ricava ──
 *
 * ⚠ IL CONFRONTO È FRA DUE Z DELLA STESSA FONTE: la mappa tiene la Z in spazio
 * camera scritta dal DepthRenderer con la matrice di vista della scena, e
 * `vAcquaVistaZ` è calcolata nel vertex con `uVista`. «Stessa matrice, quindi
 * sbagliano insieme o giusto insieme» era la premessa — ED ERA FALSA: con
 * l'origine mobile `worldPos` è RELATIVO ALLA CAMERA, e la matrice di vista
 * intera gli riapplicava la traslazione. Misurato al pixel centrale: pelo a
 * −34,2, fondale sulla mappa a −23,9 — il fondo «davanti» al pelo, e lo
 * spessore gonfiato di ~(quota camera), che cambia col beta: METÀ del «da
 * certe angolazioni si rompe». La matrice giusta per punti relativi alla
 * camera è la vista SENZA traslazione (vedi `anima`).
 *
 * ⚠ MA IL RAPPORTO FRA LE DUE NO: qui la vista è destrorsa e le Z sono
 * NEGATIVE (misurato sulla mappa: min −65,8, max 0). Un `max(z, 0.02)` scritto
 * pensando a Z positive schiacciava il pelo a 0,02 SEMPRE → scala assurda →
 * spessore zero ovunque → tutta l'acqua latte, a ogni angolazione. La guardia
 * contro lo zero va fatta con `min(z, -0.02)`. E dove la mappa è VUOTA (cielo
 * dietro il pelo, Z=0) il rapporto direbbe «a contatto»: è l'opposto — è
 * lontanissimo, e si forza la scala a 40. Era un pezzo anche del latte
 * radente ORIGINALE: radente, molti raggi oltre il pelo bucano la vasca e
 * pescano cielo.
 *
 * ⚠ MA LA DIFFERENZA DI Z NUDA MENTE A VISTA RADENTE, e il committente l'ha
 * fotografato in tre scatti: abbassando la camera l'acqua diventava LATTE — a
 * metà vasca prima, tutta poi, e tutte le vasche insieme. Radente, il pixel
 * «dietro» il pelo sullo schermo non è il fondale sotto: è la sponda subito
 * oltre, quindi Zscena≈Zpelo e spessore≈0 su TUTTA la superficie — schiuma di
 * contatto e bassofondo ovunque. Lo studio l'aveva scritto (Uber: «modalità
 * world, differenza di Y fra superficie e fondale — stabile quando la camera
 * ruota»), e adesso si fa così: il punto del fondale si RICOSTRUISCE lungo il
 * raggio (la Z di camera scala linearmente sul raggio: basta il rapporto
 * Zscena/Zpelo, e vPositionW è già relativa alla camera) e se ne prende la Y.
 * Due spessori, due mestieri:
 *  · `acquaSpessoreGiu` — il Δy VERTICALE, stabile con la camera → fondale,
 *    schiuma di contatto, righe di riva, caustiche;
 *  · `acquaSpessore` — il PERCORSO nel volume lungo il raggio (con un tetto)
 *    → assorbimento, corpo, rifrazione, sfocatura: radente si attraversa più
 *    acqua, e infatti radente l'acqua si fa piena e satura, non bianca.
 *
 * ⚠ IL FONDALE SMETTE DI ESSERE UNA BUGIA. Finora «bassofondo» era la distanza
 * dalla sponda in pianta — un trucco che regge sulle rive e mente sugli
 * scogli. Con lo spessore vero il turchese segue il FONDO: una secca in mezzo
 * al lago diventa chiara da sola, come nella seconda referenza.
 *
 * ⚠ E LA SCHIUMA DI CONTATTO NASCE QUI, attorno a QUALSIASI cosa tocchi
 * l'acqua — anche un oggetto in movimento, che il mesher non conoscerà mai. Il
 * bordo si sfrangia col campo delle chiazze, come quella di riva: senza, è una
 * curva di livello del depth buffer e si vede che è matematica.
 *
 * ⚠ LA PROFONDITÀ È UNA LEGGE DEL PELO, NON DELLE PARETI — e questo l'ha
 * insegnato la cascata nuda. Su una parete di cascata (e su uno scivolo) lo
 * spessore è SEMPRE quasi zero: la roccia sta a contatto dietro. Quindi la
 * schiuma di contatto copriva la parete INTERA (tutta «contatto»), e dove non
 * copriva, la rifrazione con corpo→0 la sostituiva col fondo — la cascata
 * usciva o bianca uniforme o nuda, e i filamenti scritti apposta per lei non
 * si vedevano mai. Diagnosi al pixel: con `vera 0` la cascata era viva, con
 * `vera 3` nuda. `acquaPeloLibero` maschera fondale, contatto e (sotto) la
 * sostituzione col fondo: sulle superfici in caduta comanda il loro disegno.
 *
 * ⚠ E LA SOGLIA SI CORREGGE CON LA PENDENZA DEL FONDALE (dalla sintesi dello
 * studio): con la sola differenza di profondità, un fondo quasi PIATTO fa una
 * fascia enorme — su una spiaggia dolce la «schiuma di contatto» diventava
 * mezza vasca. Il riferimento (IronWarrior) la corregge con un buffer delle
 * normali, cioè un render in più; a noi la stessa informazione la danno GRATIS
 * le derivate di schermo di `acquaZScena`: fondo piatto → gradiente piccolo →
 * soglia stretta. Due `dFdx` contro una passata intera.
 */
export const GLSL_ACQUA_VERA_PRIMA = `
  vec2 acquaSchermoDritta = gl_FragCoord.xy / uSchermo;
  float acquaZScena = texture2D(uProfondita, acquaSchermoDritta).r;
  float acquaVuoto = step(-0.02, acquaZScena);
  float acquaScalaZ = mix(acquaZScena / min(vAcquaVistaZ, -0.02), 40.0, acquaVuoto);
  float acquaSpessoreGiu = max(vPositionW.y * (1.0 - acquaScalaZ), 0.0);
  acquaSpessore = clamp(length(vPositionW) * (acquaScalaZ - 1.0), 0.0, 8.0);
  float acquaPeloLibero = (1.0 - acquaSuMuro) * (1.0 - acquaScivolo);
  acquaFondale = mix(acquaFondale, clamp(exp(-acquaSpessoreGiu * uAcquaVera.y), 0.0, 1.0), acquaPeloLibero);
  float acquaPendFondo = abs(dFdx(acquaZScena)) + abs(dFdy(acquaZScena));
  float acquaSogliaProf = uAcquaVera.x * clamp(acquaPendFondo * 40.0, 0.30, 1.0);
  acquaSchiumaProf = step(acquaSpessoreGiu, acquaSogliaProf * (0.62 + 0.76 * acquaCampo.a)) * acquaPeloLibero;
`;

/**
 * ── DOPO IL COLORE: il fondo visto attraverso ──
 *
 * ⚠ LA DEFORMAZIONE CRESCE CON LO SPESSORE, ed è un dettaglio che si vede:
 * sul bagnasciuga (un dito d'acqua) il fondo è quasi fermo, al largo ondeggia.
 * Deformare tutto uguale dà l'effetto «vetro smerigliato dappertutto».
 *
 * ⚠ IL RIPIEGO DEL BORDO, o gli oggetti EMERSI colano dentro l'acqua: l'UV
 * spostato può pescare un pixel che sta DAVANTI al pelo (uno scoglio emerso, la
 * sponda). Si riconosce perché la sua Z è più vicina della nostra, e lì si
 * torna all'UV dritto. È il difetto classico di ogni rifrazione a schermo
 * (codersnotes lo mostra coi barili di Mario che «sanguinano» nell'acqua), e
 * questo è il rimedio robusto — leggere lo Z e scartare. Su Wii non si poteva:
 * Galaxy risolveva NON rifrangendo l'acqua ma facendo ondeggiare il FONDALE
 * sotto di lei, che è geniale e funziona solo con l'acqua bassa. Noi lo Z ce
 * l'abbiamo già in mano per lo spessore, quindi il metodo caro lì è gratis qui.
 *
 * ⚠ L'ASSORBIMENTO È PER CANALE (Beer-Lambert): l'acqua non scurisce il fondo,
 * lo VIRA — il rosso muore per primo, il blu resta. È il cuore dello shader di
 * Roystan che il committente ha portato come riferimento all'inizio, ed è la
 * differenza fra «fondo dietro un vetro colorato» e «fondo sott'acqua».
 *
 * ⚠ MA SOLO SUL PELO LIBERO: una CASCATA non è una lente. Il sfrangiamento dei
 * nastri è passato per un giro dentro il corpo (mescolare il fondo rifratto
 * dove la lama si assottiglia), e sembrava la cosa giusta — ma dietro una
 * cascata c'è quasi sempre la roccia da cui salta, cioè un grigio scuro, e il
 * risultato misurato al pixel è impietoso: la stessa caduta faceva (125,209,222)
 * senza la profondità e (85,114,118) con — colore cemento, mentre il pelo da
 * cui nasce restava smeraldo. La trasparenza della lama la fa l'ALFA (vedi
 * `GLSL_ACQUA_COLORE`): si vede attraverso per fusione, e il colore resta suo.
 *
 * ⚠ E L'ALFA VA A UNO: la fusione col fondale adesso la facciamo NOI dentro il
 * colore (abbiamo l'immagine rifratta), e lasciare anche il blending farebbe
 * vedere il fondo DUE volte — una deformata e una ferma, una sopra l'altra.
 * L'alpha del MATERIALE resta 0,9 solo per tenere l'acqua nella coda dei
 * trasparenti e fuori dalla mappa di profondità (vedi `profonditaCondivisa`).
 */
export const GLSL_ACQUA_VERA_DOPO = `
  vec2 acquaRifraUV = acquaSchermoDritta + acquaNormale.xz * uAcquaVera.z * clamp(acquaSpessore * 0.8, 0.12, 1.3);
  float acquaZRifra = texture2D(uProfondita, acquaRifraUV).r;
  acquaRifraUV = mix(acquaSchermoDritta, acquaRifraUV, step(acquaZRifra, vAcquaVistaZ));
  vec3 acquaFondoVisto = textureLod(uRifrazione, acquaRifraUV, clamp(acquaSpessore * uSfocaK, 0.0, 3.0)).rgb;
`;

/**
 * LE CAUSTICHE: la rete di luce che l'acqua dipinge sul fondo.
 *
 * ⚠ SI DIPINGONO SULL'IMMAGINE RIFRATTA, non sul materiale del terreno, ed è
 * la scelta che le rende contenute: il mondo non sa niente, e le caustiche
 * esistono solo dove le si vede — attraverso l'acqua. È il trucco di mezza
 * industria per le caustiche stilizzate.
 *
 * ⚠ IL `min` DI DUE CAMPIONI IN CONTRO-SCORRIMENTO è il trucco che le fa
 * BRILLARE (viene dallo studio dei riferimenti: le caustiche «nitide che si
 * spezzano» dell'Uber-Stylized-Water sono esattamente questo): la linea vive
 * solo dove TUTT'E DUE gli strati passano, quindi si accende e si spegne
 * mentre scorrono uno contro l'altro — scintilla senza nessun rumore in più.
 *
 * ⚠ L'UV È IN MONDO, SPOSTATO DALLA NORMALE PER LO SPESSORE: una parallasse
 * povera che le fa «stare sul fondo» invece che galleggiare sul pelo. E i due
 * fattori esponenziali dicono la fisica in piccolo: niente caustiche a
 * spessore zero (la luce non ha acqua da attraversare) e niente nel profondo
 * (non ci arriva più).
 * ⚠ E PASSANO DALL'OMBRA DEL SOLE, che è la correzione della sintesi: prima
 * brillavano anche sotto un ponte, perché questo blocco vive PRIMA del ciclo
 * delle luci, dove il fattore d'ombra non esiste ancora. La cura è idraulica,
 * non matematica: il contributo si ACCUMULA qui (`acquaCauLuce`) e si somma a
 * valle, in `luceExtra`, moltiplicato per il gradino d'ombra — dove `sole` è
 * in ambito. Sono caustiche: SONO luce, e la luce all'ombra non c'è.
 */
export const GLSL_ACQUA_CAUSTICHE = `
  vec2 acquaCauBase = (vAcquaPos.xz + acquaNormale.xz * acquaSpessoreGiu * 1.6) * 0.13;
  vec4 acquaCauUno = texture2D(uTratto, acquaCauBase - vec2(uTempo * 0.016, uTempo * 0.012));
  vec4 acquaCauDue = texture2D(uTratto, acquaCauBase * 1.18 + vec2(uTempo * 0.013, -uTempo * 0.010));
  float acquaCauLinea = min(step(abs(acquaCauUno.a - 0.5), 0.075), step(abs(acquaCauDue.a - 0.5), 0.075));
  float acquaCau = acquaCauLinea + min(step(abs(acquaCauUno.g - 0.52), 0.06), step(abs(acquaCauDue.g - 0.5), 0.06));
  acquaCauLuce = vec3(1.0, 0.97, 0.88) * acquaCau * uAcquaCau * (1.0 - exp(-acquaSpessoreGiu * 2.4)) * exp(-acquaSpessoreGiu * 0.45);
`;

/**
 * La chiusura: assorbimento, corpo, e la fusione fatta in casa.
 *
 * ⚠ LA VIRATA DELLE COSE COL PROFONDO STA QUI, pesata da `acquaFondale` (la
 * legge del committente: azzurro e trasparente al pelo, violaceo pieno a
 * fondo scala): il fondo visto si MOLTIPLICA per la tinta fonda — moltiplicare
 * vira e conserva il disegno, la grammatica dell'ombra di casa — e il peso è
 * zero in superficie. Metterla nell'assorbimento esponenziale è stato provato
 * ed era sbagliato: quello colora tutto da subito, anche mezzo blocco.
 */
export const GLSL_ACQUA_VERA_FINE = `
  vec3 acquaAssorbita = acquaFondoVisto * exp(-uAssorbi * acquaSpessore);
  acquaAssorbita = mix(acquaAssorbita, acquaAssorbita * uAcquaFonda * 1.7, 1.0 - acquaFondale);
  float acquaCorpo = clamp(1.0 - exp(-acquaSpessore * uAcquaVera.w), 0.0, 1.0);
  acquaCorpo = max(acquaCorpo, 1.0 - acquaPeloLibero);
  acquaTinta = mix(mix(acquaAssorbita, acquaTinta, acquaCorpo), acquaTinta, acquaSchiuma);
  acquaAlfa = mix(acquaAlfa, 1.0, acquaPeloLibero);
`;

/**
 * IL BRILLIO — sole, luna, e le lampade che scintillano nella loro pozza.
 *
 * ⚠ NON È UN RIFLESSO CALCOLATO, ED È UNA SCELTA. Uno specchio vero vorrebbe la
 * scena ridisegnata: in Lantern erano 11,1 ms, il secondo picco del fotogramma.
 * Quello che di un riflesso si VEDE su un'acqua toon, però, non è la scena — è
 * dove il sole colpisce. E dove colpisce è un conto analitico: si riflette lo
 * sguardo attorno alla normale e lo si confronta col verso del sole. Quattro
 * istruzioni contro una passata intera.
 *
 * ⚠ E POI SI TAGLIA, DUE VOLTE. Il lobo dà DOVE può esserci luccichio; il campo
 * delle scintille dà QUALI granelli si accendono lì dentro. È la composizione
 * che fa la strada di losanghe bianche della prima immagine di riferimento:
 * senza il secondo taglio verrebbe una macchia luminosa continua, cioè un faro
 * riflesso — proprio la cosa semi-realistica che qui è già stata bocciata.
 *
 * ⚠ LA STRADA LARGA È LA PARTE CHE MANCAVA, e senza di lei le sole scintille
 * non disegnano niente (misurato: 9% dei pixel, scarto medio 6/255 — granelli).
 * Va a GRADINI come l'ombra, con le stesse `BANDE`.
 *
 * ⚠ LA LUNA PORTA LA SUA FASE. `world/astro.js` la calcola già sul serio
 * (l'elongazione, non un conto sui giorni): a luna piena l'acqua ha la sua
 * strada d'argento, a luna nuova non ha niente. È vero, ed è gratis.
 *
 * ⚠ E LE LAMPADE SCINTILLANO SENZA COSTARE NIENTE. `lampade` è già in ambito
 * qui: è il numero che l'accumulo delle luci ha appena finito di comporre.
 * Moltiplicarne una parte per il campo delle scintille dà la colonna tremolante
 * di un lampione sull'acqua. Zero letture, zero uniform, una moltiplicazione.
 */
export const GLSL_ACQUA_BRILLIO_RICCO = `
  vec3 acquaRifl = reflect(-viewDirectionW, normalW);
  float acquaLobo = pow(max(dot(acquaRifl, -normalize(uSoleVerso)), 0.0), uBrillio.y);
  float acquaLuna = pow(max(dot(acquaRifl, -normalize(uLunaVerso)), 0.0), uBrillio.y);
  float acquaVia = acquaLobo * uBrillio.x + acquaLuna * uBrillio.z * uLunaFase;
  float acquaStrada = floor(acquaVia * ${BANDE}.0 + 0.5) / ${BANDE}.0;
  acquaScintilla = step(uBrillio.w, acquaCampo.b) * acquaViaFattore;
  acquaBrillio = acquaStrada * ${STRADA} + acquaVia * acquaScintilla;
  acquaBrillio = acquaBrillio * (1.0 - acquaSchiuma);
`;

/**
 * IL BRILLIO, versione povera: solo il sole, e niente scintilla delle lampade.
 * Su mobile le lampade con ombra sono già spente per intero (vedi qualita.js):
 * farle scintillare sarebbe l'unico posto dove tornerebbero a costare.
 */
export const GLSL_ACQUA_BRILLIO_POVERO = `
  vec3 acquaRifl = reflect(-viewDirectionW, normalW);
  float acquaVia = pow(max(dot(acquaRifl, -normalize(uSoleVerso)), 0.0), uBrillio.y) * uBrillio.x;
  float acquaStrada = floor(acquaVia * ${BANDE}.0 + 0.5) / ${BANDE}.0;
  acquaScintilla = 0.0;
  acquaBrillio = acquaStrada * ${STRADA} + acquaVia * step(uBrillio.w, acquaCampo.b);
  acquaBrillio = acquaBrillio * (1.0 - acquaSchiuma);
`;

/**
 * I VALORI DI PARTENZA, in tabella — regola della casa.
 *
 * ⚠ E LE TINTE VENGONO DALLA PALETTE DEL BLOCCO, non da qui: `blocks.js` dice
 * di che colore è l'acqua e resta l'unico posto dove lo dice. Qui si dichiara
 * soltanto COME si scostano le quattro tinte l'una dall'altra — più chiara di
 * tanto sul bassofondo, di tanto sui tratti — così cambiare il colore
 * dell'acqua nel gioco continua a essere una riga sola, in `blocks.js`.
 */
export const REGOLE = {
  // ⚠ SATURA E TRASPARENTE, NON OPACA E SPENTA. La prima stesura scuriva il
  // fondo del 26% e portava l'alfa a 0,93 per curare un canale stretto che
  // sembrava «vetro sporco» — ma quel canale sembrava sporco perché era
  // DESATURATO, non perché fosse trasparente. Il risultato: acqua che si legge
  // come vernice azzurra. Nella seconda immagine di riferimento gli scogli sotto
  // il pelo si vedono benissimo, ed è quello che la fa sembrare acqua.
  fondo: 0.10,          // quanto è più scuro il fondo (poco: la tinta resta viva)
  viraFondo: -22,       // e di quanti GRADI vira la tonalità verso il blu
  satura: 0.30,         // e quanto è più SATURO — è questa la riga che la fa cristallina
  bassofondo: 0.26,     // quanto è più chiaro il bassofondo
  turchese: 0.20,       // e quanto vira al verde
  tratti: 0.52,         // le linee delle onde: chiare, ma non ancora bianche
  segnoScuro: 0.42,     // e quanto è scuro il segno dello stile «inchiostro»
  // ⚠ QUANTO SI ALZA IL PELO, in blocchi. Il tetto non è estetico: la superficie
  // di una sorgente sta 1/16 sotto la cima del blocco di riva (vedi `peloDi` nel
  // mesher), quindi oltre ~0,06 l'acqua SCAVALCA la sponda e si vede il pelo
  // passare sopra la sabbia. Con 0,035 il margine resta quasi doppio.
  moto: 0.035,
  // ⚠ IL RILIEVO È DELLA NORMALE, NON DELLA GEOMETRIA, e vale anche a onde
  // spente: è quanto la luce si comporta come se il pelo fosse mosso.
  //
  // ⚠ E A 0,055 NON SERVIVA A NIENTE, che è il difetto per cui i sei modelli di
  // luce uscivano IDENTICI: con la normale quasi verticale N·L vale ~1
  // dappertutto, e tutte e sei le leggi — piatta, a bande, morbida, lucida —
  // collassano sulla stessa immagine. Una legge della luce si vede solo dove la
  // luce ha di che variare; senza pendenza non c'è niente da illuminare
  // diversamente. Le pendenze del campo arrivano a ±1,9, quindi 0,28 dà
  // inclinazioni attorno ai trenta gradi: abbastanza perché i modelli si
  // separino, poco perché il pelo resti un pelo.
  rilievo: 0.28,
  lucido: 48.0,         // quanto è stretto il lobo speculare
  forzaSpec: 1.0,       // e quanto pesa
  riflForza: 0.045,     // quanto la normale deforma il riflesso
  riflPeso: 0.85,       // e quanto il riflesso prende il posto del colore
  // ⚠ IL TETTO DEL RIFLESSO: a vista radente il Fresnel tende a 1 e senza
  // questo l'acqua DIVENTAVA il cielo («da molte angolazioni sparisce o
  // diventa bianca»). Solo metallo e neon, che sono specchi di mestiere,
  // hanno il permesso di superarlo.
  riflTetto: 0.45,
  // ── l'acqua vera (profondità · rifrazione · caustiche) ──
  // (bordo della schiuma di contatto in Z camera, scala del fondale vero,
  //  forza della rifrazione, densità del corpo — quanto in fretta l'acqua
  //  smette di essere una lente e diventa il suo colore)
  vera: [0.55, 0.85, 0.06, 0.5],
  assorbi: 0.55,        // la scala di Beer-Lambert
  caustiche: 0.75,      // quanto brillano le caustiche sul fondo
  // ⚠ DOVE I SEGNI FINI SI CONGEDANO: da qui a qui (in blocchi di distanza) le
  // righe e le scintille sfumano a zero, se no al largo FRIGGONO — un pixel
  // pesca dentro e fuori dalla banda a ogni fotogramma.
  // ⚠ ALZATO da [40, 85]: a vista radente la distanza cresce su TUTTA la pozza
  // e i segni svanivano insieme — metà del «da certe angolazioni sparisce».
  sfumaVia: [60, 130],
  sfoca: 0.9,           // quanto lo spessore sfoca il fondale (mip della rifrazione)
  // la schiuma non è bianca pura: un bianco puro in un mondo di tinte piatte si
  // stacca come un buco. È l'acqua chiarissima.
  schiuma: 0.84,
  // (scala del disegno, velocità della corrente, forza della deriva, soglia del bassofondo)
  mis: [0.16, 0.09, 0.055, 0.34],
  // ⚠ LE ONDE SONO CONTORNI DI SINUSOIDI, e i quattro numeri sono la loro forma.
  //
  // ⚠ LA DEFORMAZIONE È LA MANOPOLA PERICOLOSA, e me l'ha insegnata uno scatto:
  // la prima stesura spostava la fase di ±5 radianti, cioè quasi un periodo
  // intero. A quel punto la sinusoide non esiste più — quello che resta sono i
  // contorni del RUMORE, e a schermo erano scarabocchi. Il rumore qui deve
  // PIEGARE la linea, non sostituirla: mezzo radiante, cioè un quarto di
  // lunghezza d'onda di spostamento laterale.
  //
  // ⚠ E LE DUE FAMIGLIE SONO QUASI PARALLELE (dieci gradi), non incrociate:
  // incrociate davano un reticolo, e un reticolo su una superficie d'acqua si
  // legge come una rete da pesca. Nelle referenze i segni vanno tutti nello
  // stesso verso.
  //
  // Le frequenze si leggono con la scala del disegno: 15 · 0,16 dà un'onda ogni
  // ~2,6 blocchi, cioè cinque onde su una pozza da dodici celle. Lo spessore è
  // in radianti di fase: 0,22 vale una riga larga circa un quinto di blocco.
  // (frequenza 1, frequenza 2, spessore della linea, quanto la piega il rumore)
  onda: [15.0, 23.0, 0.22, 0.55],
  // ⚠ LA SCHIUMA È UN NASTRO, sottile e quasi regolare: nelle referenze è una
  // riga, non un orlo sfrangiato.
  // (larghezza della schiuma, irregolarità del bordo, dove si spezzano i tratti,
  //  spessore degli anelli della rete)
  tagli: [0.24, 0.16, 0.52, 0.035],
  // (alfa sul fondo, alfa sul bassofondo, alfa della schiuma)
  alfa: [0.74, 0.58, 1.0],
  // ⚠ E LA FORZA SI TARA GUARDANDO DALLA PARTE GIUSTA. A 0,95 dalle inquadrature
  // normali non si vedeva niente e sembrava rotto; puntando la camera VERSO il
  // sole la pozza diventava bianca piena. Il lobo speculare vive in una finestra
  // stretta di azimut: fuori vale zero, dentro vale uno, e tarare guardando
  // fuori vuol dire tarare al buio. Questi numeri sono presi con la camera
  // messa dalla parte opposta al sole (la vista «k-verso-sole» del banco).
  // (forza del sole, durezza del lobo, forza della luna, soglia delle scintille)
  brillio: [0.50, 6.0, 0.34, 0.62],
  // ⚠ LA PARETE VUOLE DUE SCALE, NON UNA: con una sola i segni escono alti e
  // larghi uguale, cioè lastroni. L'acqua che cade fa filamenti — lunghi lungo
  // la caduta e sottili di traverso.
  // ⚠ E NESSUN «LABBRO»: un tempo mettevo una riga bianca in cima a ogni cella
  // (`fract` sulla quota) e la colonna sembrava un MURO DI MATTONI, perché
  // quelle righe erano la malta. Errore di concetto: il tipo 2 vuol dire «ho
  // acqua SOPRA», cioè sono in mezzo alla caduta, dove un labbro non esiste. Il
  // labbro vero è la faccia in pendenza (tipo 3) che il mesher mette sul ciglio.
  // (scala lungo la caduta, velocità di caduta, libero, scala di traverso)
  muro: [0.21, 0.62, 0.0, 0.28],
  // ⚠ LE QUATTRO MANOPOLE DELLA CADUTA, e la seconda è l'unica che conta
  // davvero: `2a` governa insieme stiramento, assottigliamento e velocità,
  // perché tutti e tre escono da `v = sqrt(v₀² + 2ah)`. Alzarla fa una cascata
  // scattante da torrente di montagna, abbassarla un velo lento da grotta.
  // ⚠ E IL PESO DEI NASTRI VA TENUTO BASSO: sono un DI PIÙ sopra il disegno
  // della ricetta, non il disegno. A uno erano «le linette» — la stessa cascata
  // per tutte e trentasette le acque.
  // (nastri per blocco, 2a della caduta, peso dei nastri, sfrangiamento)
  cascata: [2.8, 3.2, 0.55, 0.30],
};

/**
 * Ruota la TONALITÀ di una tinta (gradi sul cerchio del colore) e la satura.
 *
 * ⚠ È LA CURA A «oleosa e sporca, non limpida»: il fondo che si limita a
 * SCURIRE dà un blu spento, da pozzanghera. L'acqua vera che si fa profonda
 * VIRA — il turchese scivola verso il blu — e la virata di tonalità è quello
 * che l'occhio legge come limpidezza. Stessa grammatica dell'ombra di casa,
 * che «scurisce e vira» invece di andare al nero.
 */
function viraTono(hex, gradi, sat = 0, scuro = 0) {
  const [r, g, b] = canali(hex);
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;
  let h = 0;
  const sBase = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  if (d > 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  h = ((h + gradi) % 360 + 360) % 360;
  const s2 = Math.min(1, Math.max(0, sBase + sat));
  const l2 = Math.min(1, Math.max(0, l * (1 - scuro)));
  const c = (1 - Math.abs(2 * l2 - 1)) * s2;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l2 - c / 2;
  const [rr, gg, bb] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x]
    : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return new Color3(rr + m, gg + m, bb + m);
}

/** Da esadecimale a colore del motore, senza passare per una stringa. */
const tintaDa = (hex) => new Color3(((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255);

/** I tre canali di un colore esadecimale, in 0..1. */
const canali = (hex) => [((hex >> 16) & 255) / 255, ((hex >> 8) & 255) / 255, (hex & 255) / 255];

/** Schiarisce una tinta verso il bianco di `k` (0 = com'era, 1 = bianco). */
function schiarisci(hex, k) {
  const [r, g, b] = canali(hex);
  return new Color3(r + (1 - r) * k, g + (1 - g) * k, b + (1 - b) * k);
}

/**
 * Il fondo: appena più scuro, ma molto più SATURO.
 *
 * ⚠ È LA FUNZIONE CHE FA LA DIFFERENZA FRA «ACQUA» E «VERNICE AZZURRA».
 * Scurire e basta dà un blu spento; alzare la saturazione allontana i canali dal
 * grigio tenendo la stessa tinta, ed è quello che nelle referenze fa sembrare
 * l'acqua limpida. Si fa allontanando ogni canale dalla loro media, che è la
 * definizione di saturare, e poi si abbassa appena la luminosità.
 */
function fondale(hex, scuro, sat) {
  const [r, g, b] = canali(hex);
  const media = (r + g + b) / 3;
  const via = (x) => Math.min(1, Math.max(0, media + (x - media) * (1 + sat))) * (1 - scuro);
  return new Color3(via(r), via(g), via(b));
}

/** Schiarisce E vira al verde: è il turchese dei bassifondi, che nelle
 *  referenze è la tinta che abbraccia gli scogli. Schiarire e basta darebbe
 *  «acqua sbiadita», che si legge come foschia, non come fondale vicino. */
function turchese(hex, k, verso) {
  const [r, g, b] = canali(hex);
  const su = (x) => x + (1 - x) * k;
  return new Color3(su(r) * (1 - verso * 0.35), su(g), su(b) * (1 - verso * 0.10));
}


/**
 * ── LE RICETTE: venti e passa acque diverse, in tabella ─────────────────────
 *
 * ⚠ UNA RICETTA NON È UNO STILE. Uno stile è un asse (il disegno sul pelo); una
 * ricetta sceglie TUTTI e quattro gli assi e ci ritocca sopra i numeri — colore,
 * trasparenza, ampiezza delle onde, larghezza della schiuma, lucentezza. È la
 * differenza fra «dieci pitture sullo stesso materiale», che è la critica che
 * mi sono preso e che era giusta, e venti acque che non si somigliano.
 *
 * ⚠ E OGNI RIGA DICE COSA GUARDARE, non cosa imita. «Come Animal Crossing» non
 * serve a niente fra sei mesi; «l'acqua si vede attraverso fino alla sabbia e
 * la schiuma è un nastro che respira» sì — è un'osservazione, e si può
 * verificare o smentire guardando.
 *
 * ⚠ NON SONO COPIE. Nessuno di questi giochi usa il nostro impianto: quello che
 * si ricostruisce è la LETTURA — cosa fa quell'acqua all'occhio — con i pezzi
 * che abbiamo. Dove il pezzo manca (la rifrazione, per dirne una che manca
 * davvero) la ricetta è per forza un'approssimazione, ed è meglio saperlo.
 */
export const RICETTE = {
  cristallina: {
    nome: '★ Sorgente cristallina',
    nota: 'TUTTO acceso: profondità vera (la schiuma abbraccia qualsiasi cosa e '
        + 'il turchese segue il fondo, non la sponda), il fondale visto '
        + 'attraverso e deformato dalle onde, l\'assorbimento che vira il '
        + 'colore con la profondità, le caustiche dipinte sul fondo, il '
        + 'riflesso planare, la luce speculare. È il tetto di quello che '
        + 'l\'impianto sa fare oggi — e ogni pezzo si spegne da solo sui '
        + 'gradini bassi della qualità',
    tinta: 0x27b8e0, sss: 0xaee8f2, stile: 'tratti', modello: 'lucida', onde: true, riflesso: true, vera: 3,
    // ⚠ RITARATA VERSO LA LIMPIDEZZA dopo il verdetto «oleosa e sporca»: la
    // specularità larga e forte (52·1,3) faceva chiazze lucide = unto. Lobo più
    // STRETTO e più debole: la luce diventa un punteggio, non una patina. E
    // più trasparente: la limpidezza È vedere il fondo.
    regole: { alfa: [0.70, 0.52, 1.0], moto: 0.03, rilievo: 0.22, lucido: 110,
              forzaSpec: 0.55, riflPeso: 0.45, riflForza: 0.035, satura: 0.40,
              tratti: 0.60, tagli: [0.24, 0.18, 0.52, 0.035], sfumaVia: [60, 130],
              vera: [0.55, 0.7, 0.06, 0.34], caustiche: 0.85, assorbi: 0.55 },
  },
  lago: {
    nome: '★ Lago a specchio',
    nota: 'l\'acquerello con UN effetto solo tenuto forte: azzurro chiaro e '
        + 'trasparente in superficie, VIOLACEO e quasi pieno a dieci blocchi — '
        + 'e ogni cosa vista attraverso vira con lui scendendo. Un velo di '
        + 'caustiche; radente, il lago diventa il cielo capovolto: lo specchio '
        + 'è il piatto. Guardala dalla riva, bassa, verso gli alberi',
    // ⚠ SUPER SEMPLICE PER MANDATO («deve essere super semplice e chiara come
    // ghibli, con un leggero effetto della cristallina soprattutto per il
    // cambio di sfumatura a seconda della profondità»): modello morbida come
    // l'acquerello, niente lobo speculare, niente SSS.
    // ⚠ LA LEGGE DEL PROFONDO È DEL COMMITTENTE, parola per parola: «a 10
    // blocchi di profondità il tutto diventa violaceo ed è leggermente opaco;
    // salendo abbiamo un hue shift e una trasparenza maggiore verso la
    // superficie». Da qui: viraFondo +78 (azzurro ~197° → violaceo ~275°),
    // scala del fondale 0,22 (a un blocco il 20% di virata, a dieci il 90%:
    // si COMPLETA a dieci — con 0,30 la curva exp dimezzava già a 2,3 blocchi
    // e le vasche del banco uscivano viola piene, visto dallo scatto).
    // ⚠ CORPO E ASSORBIMENTO BASSI PER VERDETTO («negli scogli in mezzo non
    // si vede il fondale, è tremendo; ci sta che non si veda a +10 blocchi»):
    // corpo 0,10 — a tre blocchi copre il ~26%, il fondale si vede; a fondo
    // corsa la sparizione la fanno l'assorbimento e la virata violacea
    // insieme, non un muro di tinta. Il primo giro era 0,19 e a tre blocchi
    // mangiava già metà fondale.
    tinta: 0x8fd4e6, stile: 'liscia', modello: 'morbida', onde: true, riflesso: true, vera: 3,
    // ⚠ riflTetto SOPRA quello di casa (0,65 contro 0,45), e non è uno strappo
    // alla regola: la regola dice che solo gli specchi di mestiere lo alzano,
    // e questa ricetta lo è per mandato — «voglio proprio vedere un lago
    // specchiato». Resta sotto metallo/neon (0,9-1,0) perché a picco deve
    // ancora vincere la trasparenza: è il Fresnel a dividere i due mestieri.
    // Moto e rilievo bassi per la stessa ragione dello specchio: un pelo
    // agitato sbriciola l'immagine riflessa, e l'immagine È la ricetta.
    regole: { alfa: [0.50, 0.34, 0.90], moto: 0.018, rilievo: 0.14,
              riflPeso: 1.15, riflTetto: 0.65, riflForza: 0.026,
              fondo: 0.10, viraFondo: 78, satura: 0.26, schiuma: 0.72,
              tagli: [0.30, 0.26, 0.52, 0.035], sfumaVia: [60, 130],
              vera: [0.55, 0.22, 0.06, 0.10], caustiche: 0.35, assorbi: 0.42 },
  },
  // ── le complesse: ogni ricetta qui accende almeno un talento ──────────────
  abisso: {
    nome: '✦ Abisso bioluminescente',
    nota: 'quasi nera, e ogni cosa che l\'acqua tocca si accende di ciano: la '
        + 'schiuma di contatto EMETTE luce, non la riflette. Mettila di notte — '
        + 'il bagliore non passa dall\'ombra del sole, quindi al buio resta '
        + 'acceso, che è il punto',
    tinta: 0x061422, bagliore: { tinta: 0x37f2e0, forza: 2.6 },
    stile: 'tratti', modello: 'lucida', onde: true, riflesso: false, vera: 1,
    regole: { alfa: [0.97, 0.94, 1.0], moto: 0.03, rilievo: 0.30, lucido: 80,
              forzaSpec: 0.8, fondo: 0.30, satura: 0.25, tratti: 0.30, schiuma: 0.9,
              vera: [0.62, 0.85, 0.06, 0.5], tagli: [0.30, 0.22, 0.52, 0.035] },
  },
  kintsugi: {
    nome: '✦ Kintsugi',
    nota: 'lacca nera e ORO che brilla di suo: i segni delle onde sono le '
        + 'crepe dorate della ceramica riparata. Il segno è dorato E emissivo — '
        + 'due talenti sulla stessa riga — e il riflesso scuro fa da lacca',
    tinta: 0x141019, segno: 0xffc24d, bagliore: { tinta: 0xffb03a, forza: 1.7 },
    stile: 'rete', modello: 'lucida', onde: true, riflesso: true, vera: 0,
    regole: { alfa: [0.99, 0.97, 1.0], moto: 0.022, rilievo: 0.22, lucido: 100,
              forzaSpec: 1.6, riflPeso: 0.9, riflForza: 0.03, fondo: 0.30,
              satura: 0.10, schiuma: 0.35, tagli: [0.14, 0.12, 0.52, 0.045] },
  },
  benzina: {
    nome: '✦ Benzina',
    nota: 'la pellicola iridescente sulle pozzanghere: il colore RUOTA '
        + 'nell\'arcobaleno muovendo la camera, e brilla di più dove la base è '
        + 'scura. Non è una palette — è l\'angolo di vista che decide il colore, '
        + 'quindi da fermo non lo vedi tutto: giragli attorno',
    tinta: 0x1a1d24, iridescenza: 0.85,
    stile: 'liscia', modello: 'lucida', onde: true, riflesso: true, vera: 0,
    regole: { alfa: [0.98, 0.96, 1.0], moto: 0.02, rilievo: 0.34, lucido: 70,
              forzaSpec: 1.2, riflPeso: 0.7, riflForza: 0.05, fondo: 0.20, satura: 0.10 },
  },
  bolla: {
    nome: '✦ Bolla di sapone',
    nota: 'l\'iridescenza sulla base CHIARA e trasparente: il velo arcobaleno è '
        + 'tenue e vive sui bordi radenti, come sulla parete di una bolla. La '
        + 'stessa fisica di «benzina», l\'opposto del carattere',
    tinta: 0xbfe4ec, iridescenza: 0.5,
    stile: 'liscia', modello: 'vetrosa', onde: true, riflesso: false, vera: 2,
    regole: { alfa: [0.42, 0.30, 0.9], moto: 0.02, rilievo: 0.24, satura: 0.12,
              vera: [0.45, 0.8, 0.05, 0.35] },
  },
  ladri: {
    nome: '✦ Mare dei ladri',
    nota: 'il mare grosso dei velieri: onde CHOPPY (i vertici si spostano anche '
        + 'in orizzontale e le creste si affollano) e schiuma DOVE L\'ONDA È '
        + 'ALTA, ricalcolata dalla funzione d\'onda — non dove tocca qualcosa. '
        + 'Verde profondo, fondo che sparisce presto',
    tinta: 0x0e6e62, cresteBianche: 0.55, spinta: 0.05, sss: 0x9fefc8,
    stile: 'tratti', modello: 'lucida', onde: true, riflesso: true, vera: 2,
    regole: { alfa: [0.96, 0.90, 1.0], moto: 0.06, rilievo: 0.44, lucido: 36,
              forzaSpec: 1.2, riflPeso: 0.5, satura: 0.35, tratti: 0.45,
              assorbi: 1.1, vera: [0.5, 0.9, 0.05, 0.7], tagli: [0.30, 0.24, 0.52, 0.035] },
  },
  tempesta: {
    nome: '✦ Tempesta',
    nota: 'grigioverde livida, onde alte e RIPIDE (la spinta orizzontale al '
        + 'massimo che le cuciture reggono), creste bianche dappertutto e la '
        + 'luce a quattro bande: il mare da cartone animato arrabbiato',
    tinta: 0x3d5a58, cresteBianche: 0.38, spinta: 0.06,
    stile: 'creste', modello: 'celle', onde: true, riflesso: false, vera: 0,
    regole: { alfa: [0.98, 0.95, 1.0], moto: 0.065, rilievo: 0.50, satura: 0.18,
              fondo: 0.16, tratti: 0.40, schiuma: 0.88, onda: [11.0, 17.0, 0.24, 0.8],
              tagli: [0.36, 0.26, 0.52, 0.035] },
  },
  moebius: {
    nome: '✦ Moebius',
    nota: 'la ligne claire: carta chiara, segni a china e il CONTORNO SCURO '
        + 'attorno a tutto quello che tocca l\'acqua — è la schiuma di contatto '
        + 'con la tinta nera, quindi abbraccia anche le cose in movimento. '
        + 'Nessuna sfumatura, nessun riflesso: solo linee',
    tinta: 0xcfe8e4, segno: 0x1a3038, schiumaTinta: 0x1a3038,
    stile: 'inchiostro', modello: 'spenta', onde: false, riflesso: false, vera: 1,
    regole: { alfa: [0.94, 0.90, 1.0], fondo: 0.0, satura: 0.06,
              vera: [0.30, 0.9, 0.05, 0.5], tagli: [0.10, 0.06, 0.50, 0.035] },
  },
  sogno: {
    nome: '✦ Acqua di sogno',
    nota: 'lavanda e rosa con un velo iridescente tenue e le caustiche chiare: '
        + 'l\'acqua dei mondi onirici, dove la palette mente apposta. La '
        + 'morbidezza è vera (N·L pieno), il colore no',
    tinta: 0xb8a8e8, iridescenza: 0.35,
    stile: 'gocce', modello: 'morbida', onde: true, riflesso: false, vera: 3,
    regole: { alfa: [0.72, 0.55, 0.96], moto: 0.028, rilievo: 0.22, satura: 0.30,
              caustiche: 0.6, assorbi: 0.4, tratti: 0.5, vera: [0.5, 0.75, 0.055, 0.4] },
  },
  smeraldo: {
    nome: '✦ Pozza di smeraldo',
    nota: 'verde giungla saturo, assorbimento FORTE (il fondo sparisce in un '
        + 'metro e mezzo) e caustiche accese sul poco che si vede: la pozza '
        + 'tropicale sotto la volta degli alberi',
    tinta: 0x0fae62, stile: 'rete', modello: 'morbida', onde: true, riflesso: false, vera: 3,
    regole: { alfa: [0.85, 0.62, 1.0], moto: 0.026, rilievo: 0.24, satura: 0.5,
              assorbi: 1.6, caustiche: 1.1, tratti: 0.5, vera: [0.5, 1.1, 0.06, 0.6] },
  },
  hd2d: {
    nome: '✦ Pixel HD-2D',
    nota: 'le onde quantizzate su una griglia grossa e il TEMPO a scatti (tre '
        + 'fotogrammi al secondo): l\'acqua dei giochi in pixel art moderni, '
        + 'dove il mondo è 3D ma l\'acqua è disegnata. Con le caustiche vere '
        + 'sotto, che è esattamente il trucco di quei giochi',
    tinta: 0x2f8fd8, stile: 'pixel', modello: 'piatto', onde: false, riflesso: false, vera: 3,
    regole: { alfa: [0.85, 0.72, 1.0], satura: 0.34, tratti: 0.5,
              caustiche: 0.8, vera: [0.5, 0.8, 0.045, 0.5], onda: [13.0, 21.0, 0.20, 0.0] },
  },
  anime: {
    nome: '✦ Anime (cielo d\'estate)',
    nota: 'il mare dei film d\'animazione: blu PIENO e saturo, e sopra grandi '
        + 'macchie bianche piatte, tonde, stirate in orizzontale, che ondeggiano '
        + 'piano. Niente rumore, niente riflessi che sporcano: due toni e '
        + 'basta, come un cel dipinto. Ricreata dal riferimento portato dal '
        + 'committente (lo shader «anime water» di CG Dash), non copiata',
    tinta: 0x1e6fd4, segno: 0xf2fbff, motivo: 'nuvole', motivoScala: 2.1,
    stile: 'liscia', modello: 'spenta', onde: true, riflesso: false, vera: 0,
    regole: { alfa: [0.98, 0.95, 1.0], moto: 0.03, satura: 0.5, fondo: 0.06,
              schiuma: 0.95, tagli: [0.30, 0.10, 0.52, 0.035] },
  },
  rime: {
    nome: '✦ RiME',
    nota: 'la massa gelatinosa turchese: pulitissima, semitrasparente, SENZA '
        + 'nessun disegno sul pelo — e tutta la personalità sta nella schiuma di '
        + 'contatto, che è SPESSA, sinuosa, e abbraccia gli scogli come un '
        + 'tratto a mano. Vai alla vasca «Scogli in mezzo»: è lì che vive',
    tinta: 0x2ec8c0, stile: 'liscia', modello: 'morbida', onde: true, riflesso: false, vera: 2,
    regole: { alfa: [0.72, 0.55, 1.0], moto: 0.03, rilievo: 0.16, satura: 0.42,
              fondo: 0.05, bassofondo: 0.30, turchese: 0.28, schiuma: 0.94,
              assorbi: 0.5, vera: [1.15, 0.55, 0.045, 0.35],
              tagli: [0.42, 0.30, 0.52, 0.035] },
  },
  // ── le tre acque nate per CADERE ─────────────────────────────────────────
  //
  // ⚠ NASCONO DA UNA MANOPOLA NUOVA, e vale la pena dire perché sono tre e non
  // una: `cascata[1]` è l'accelerazione della caduta, e non regola «la velocità
  // dell'animazione» — regola insieme velocità, stiramento e assottigliamento,
  // perché tutti e tre escono dalla stessa `v = sqrt(v₀² + 2ah)`. Cambiandola
  // sola si passa da un torrente che scatta a un velo che scende come seta, e
  // il pelo sopra resta lo stesso. È il primo asse dell'acqua che parla della
  // CADUTA invece che della superficie.
  torrente: {
    nome: '⇊ Torrente alpino',
    nota: 'acqua di montagna: fredda, chiarissima, e una caduta SCATTANTE — '
        + 'l\'accelerazione è quasi doppia del normale, quindi i nastri si '
        + 'stirano in fretta e la lama si assottiglia presto. Guardala alla '
        + 'vasca «Salti»: è la ricetta in cui la differenza fra il salto da uno '
        + 'e quello da otto si vede di più',
    tinta: 0x9fd8ec, sss: 0xe8f6ff, stile: 'creste', modello: 'lucida', onde: true, riflesso: false, vera: 2,
    regole: { alfa: [0.80, 0.62, 1.0], moto: 0.045, rilievo: 0.32, satura: 0.30,
              fondo: 0.08, bassofondo: 0.34, turchese: 0.06, schiuma: 0.97,
              lucido: 90, forzaSpec: 0.75, assorbi: 0.35,
              vera: [0.62, 0.9, 0.05, 0.42], cascata: [3.6, 5.8, 0.62, 0.42],
              tagli: [0.30, 0.22, 0.52, 0.035] },
  },
  giada: {
    nome: '⇊ Cascata di giada',
    nota: 'il verde denso e opaco delle cascate calcaree: l\'acqua scende LENTA '
        + 'e larga (accelerazione dimezzata), i nastri restano fitti fino in '
        + 'fondo e non si sfrangiano quasi. È l\'opposto esatto del torrente, e '
        + 'sulle stesse identiche geometrie',
    tinta: 0x2f9e86, stile: 'liscia', modello: 'morbida', onde: true, riflesso: false, vera: 2,
    regole: { alfa: [0.94, 0.88, 1.0], moto: 0.028, rilievo: 0.20, satura: 0.46,
              fondo: 0.14, viraFondo: -12, bassofondo: 0.22, turchese: 0.26,
              schiuma: 0.90, lucido: 40, forzaSpec: 0.5, assorbi: 0.75,
              vera: [0.5, 1.1, 0.035, 0.75], cascata: [2.2, 1.5, 0.40, 0.10],
              tagli: [0.26, 0.14, 0.52, 0.035] },
  },
  termale: {
    nome: '⇊ Sorgente termale',
    nota: 'turchese LATTIGINOSO, quasi opaco: non si vede il fondo, e la caduta '
        + 'è una colata morbida che schiuma subito. Il velo al piede è la cosa '
        + 'da guardare — con i particellari accesi la nebbia resta in aria',
    tinta: 0x6fd6d0, sss: 0xd8fbff, motivo: 'nuvole', motivoScala: 4.5, stile: 'liscia', modello: 'morbida', onde: true, riflesso: false, vera: 1,
    regole: { alfa: [0.97, 0.94, 1.0], moto: 0.025, rilievo: 0.18, satura: 0.22,
              fondo: 0.10, bassofondo: 0.30, turchese: 0.16, schiuma: 0.99,
              lucido: 24, forzaSpec: 0.4, cascata: [2.0, 2.2, 0.34, 0.06],
              tagli: [0.36, 0.26, 0.52, 0.035] },
  },
  casa: {
    nome: 'Leafy (di casa)',
    nota: 'la legge della casa: colori piatti, ombra a un gradino, nessuna sfumatura',
    stile: 'tratti', modello: 'piatto', onde: false, riflesso: false,
  },

  // ── i giochi che mi hai nominato ──────────────────────────────────────────
  acnl: {
    nome: 'Animal Crossing: New Leaf',
    nota: 'il ciano è PIENO e non cambia mai: l\'acqua è un campo di colore con '
        + 'sopra poche righe chiare che scorrono. Niente riflessi, niente profondità — '
        + 'su uno schermo da portatile la leggibilità viene prima di tutto',
    tinta: 0x35b8e0, motivo: 'trattini', motivoScala: 7.5, stile: 'creste', modello: 'spenta', onde: false, riflesso: false,
    regole: { alfa: [0.96, 0.92, 1.0], tagli: [0.20, 0.10, 0.52, 0.035], tratti: 0.30,
              onda: [12.0, 19.0, 0.16, 0.35], fondo: 0.04, satura: 0.34 },
  },
  acnh: {
    nome: 'Animal Crossing: New Horizons',
    nota: 'il salto rispetto a New Leaf è la TRASPARENZA: si vede la sabbia sotto, '
        + 'e il bordo è un nastro bianco che respira invece di una riga secca. '
        + 'Il pelo si muove appena — abbastanza da non sembrare vetro',
    tinta: 0x4fd3d6, motivo: 'archetti', motivoScala: 5.5, stile: 'tratti', modello: 'morbida', onde: true, riflesso: false, vera: 2,
    regole: { alfa: [0.62, 0.40, 0.96], tagli: [0.30, 0.22, 0.52, 0.035], moto: 0.022,
              rilievo: 0.16, bassofondo: 0.34, turchese: 0.26, tratti: 0.55 },
  },
  bayonetta: {
    nome: 'Bayonetta 2',
    nota: 'acqua da scena drammatica: quasi nera, LUCIDISSIMA, e tutto il '
        + 'contrasto sta nei riflessi e nella schiuma. Il colore proprio non lo '
        + 'ha quasi — quello che si vede è ciò che ci si specchia dentro',
    tinta: 0x14303f, stile: 'creste', modello: 'lucida', onde: true, riflesso: true, vera: 2,
    regole: { alfa: [0.97, 0.93, 1.0], lucido: 90, forzaSpec: 2.6, rilievo: 0.42,
              riflPeso: 1.5, riflForza: 0.06, moto: 0.05, fondo: 0.30, satura: 0.20,
              tagli: [0.30, 0.30, 0.52, 0.035], schiuma: 0.92 },
  },
  galaxy1: {
    nome: 'Super Mario Galaxy',
    nota: 'gelatina lucida: satura, semitrasparente, con anelli che si allargano '
        + 'come se qualcosa cadesse di continuo. È acqua giocattolo, e la '
        + 'lucentezza serve a dire «morbido», non «bagnato»',
    tinta: 0x2fa9e8, motivo: 'ragnatela', motivoScala: 3.4, stile: 'gocce', modello: 'lucida', onde: true, riflesso: true, vera: 3,
    regole: { alfa: [0.70, 0.52, 1.0], lucido: 34, forzaSpec: 1.7, rilievo: 0.30,
              riflPeso: 0.6, moto: 0.045, satura: 0.40, tratti: 0.62,
              onda: [15.0, 23.0, 0.30, 0.55] },
  },
  galaxy2: {
    nome: 'Super Mario Galaxy 2',
    nota: 'come il primo ma più DENSA: gli anelli diventano una rete continua e '
        + 'il bianco è più netto. Si legge come sciroppo invece che come acqua, '
        + 'ed è voluto — sono pianeti, non laghi',
    tinta: 0x27c6d8, motivo: 'ragnatela', motivoScala: 4.6, stile: 'rete', modello: 'lucida', onde: true, riflesso: true, vera: 3,
    regole: { alfa: [0.82, 0.66, 1.0], lucido: 26, forzaSpec: 1.9, rilievo: 0.34,
              riflPeso: 0.5, moto: 0.055, satura: 0.46, tagli: [0.26, 0.16, 0.52, 0.055] },
  },
  bdsp: {
    nome: 'Pokémon Diamante/Perla Splendente',
    nota: 'acqua da diorama in miniatura: blu pieno con sopra un MOTIVO regolare '
        + 'di archi, quasi una stoffa. Non prova a sembrare vera — prova a '
        + 'sembrare un plastico, e i bordi restano puliti',
    tinta: 0x2f7fd0, motivo: 'ragnatela', motivoScala: 5.0, stile: 'scaglie', modello: 'celle', onde: false, riflesso: true,
    regole: { alfa: [0.95, 0.90, 1.0], riflPeso: 0.42, riflForza: 0.02, satura: 0.30,
              tratti: 0.46, tagli: [0.22, 0.10, 0.52, 0.035], onda: [10.0, 16.0, 0.22, 0.30] },
  },

  // ── altre acque che vale la pena avere accanto ────────────────────────────
  windwaker: {
    nome: 'Wind Waker',
    nota: 'il cel shading dichiarato: due o tre tinte piatte e una schiuma BIANCA '
        + 'e SPESSA che fa da contorno, come un tratto di pennarello attorno a '
        + 'tutto quello che tocca l\'acqua',
    tinta: 0x1f8fd6, motivo: 'cerchi', motivoScala: 2.8, stile: 'bande', modello: 'celle', onde: true, riflesso: false, vera: 1,
    // ⚠ LA BANDA DI COSTA È LARGA E A LOBI TONDI, e la nota viene da noclip
    // (Outset Island guardata da sopra): la schiuma di WW non è un filo lungo
    // la riva, è una FASCIA che abbraccia l'isola con lobi morbidi. Quindi
    // bordo di contatto alto e irregolarità piena.
    regole: { alfa: [0.96, 0.92, 1.0], tagli: [0.54, 0.34, 0.52, 0.035], schiuma: 0.95,
              moto: 0.03, rilievo: 0.24, satura: 0.34, vera: [0.95, 0.8, 0.05, 0.6] },
  },
  botw: {
    nome: 'Breath of the Wild',
    nota: 'turchese pallido e trasparente, pochissimi segni, e la luce che ci '
        + 'gioca sopra piano. Il grosso del lavoro lo fa la trasparenza: si vede '
        + 'il fondo, e la superficie quasi non esiste finché non la colpisce il sole',
    tinta: 0x63c9c4, stile: 'tratti', modello: 'morbida', onde: true, riflesso: true, vera: 3,
    regole: { alfa: [0.55, 0.36, 0.92], tagli: [0.26, 0.18, 0.52, 0.035], moto: 0.03,
              rilievo: 0.22, riflPeso: 0.5, tratti: 0.58, bassofondo: 0.36 },
  },
  minecraft: {
    nome: 'Minecraft',
    nota: 'l\'unica animazione che non tradisce la griglia: celle piatte che '
        + 'cambiano tono a SCATTI. Nessuna luce, nessun riflesso, nessuna '
        + 'sfumatura — e in un mondo di cubi è una tesi, non una rinuncia',
    tinta: 0x3f76e4, stile: 'mosaico', modello: 'spenta', onde: false, riflesso: false,
    regole: { alfa: [0.80, 0.72, 0.90], tagli: [0.0, 0.0, 0.52, 0.035], satura: 0.20 },
  },
  ghibli: {
    nome: 'Acquerello (Ghibli)',
    nota: 'pallida e lavata: quasi niente sopra, molta trasparenza, e il colore '
        + 'che vira appena. Il contrario di ogni effetto — quello che resta è '
        + 'la FORMA dello specchio d\'acqua',
    tinta: 0x9fd8e8, stile: 'liscia', modello: 'morbida', onde: true, riflesso: false,
    regole: { alfa: [0.48, 0.30, 0.80], tagli: [0.34, 0.30, 0.52, 0.035], moto: 0.018,
              rilievo: 0.12, fondo: 0.02, satura: 0.10, schiuma: 0.70 },
  },
  sumi: {
    nome: 'Sumi-e (Ōkami)',
    nota: 'inchiostro su carta: il segno è SCURO, non chiaro. Un tratto chiaro si '
        + 'legge come luce, uno scuro come forma — sono due grammatiche, e su '
        + 'una carta pallida funziona solo la seconda',
    tinta: 0xa8c8cf, stile: 'inchiostro', modello: 'spenta', onde: false, riflesso: false,
    regole: { alfa: [0.90, 0.84, 1.0], segnoScuro: 0.62, fondo: 0.0, satura: 0.0,
              tagli: [0.20, 0.14, 0.52, 0.035], schiuma: 0.55 },
  },
  monument: {
    nome: 'Monument Valley',
    nota: 'pastello geometrico: una tinta sola, nessun disegno, nessuna luce. '
        + 'L\'acqua è una superficie di colore che serve alla composizione, e '
        + 'qualunque effetto la sporcherebbe',
    tinta: 0x7f9fd8, stile: 'liscia', modello: 'spenta', onde: false, riflesso: false,
    regole: { alfa: [1.0, 1.0, 1.0], tagli: [0.0, 0.0, 0.52, 0.035], fondo: 0.0, satura: 0.05 },
  },
  piscina: {
    nome: 'Piscina',
    nota: 'limpidissima: quasi tutta trasparenza, e l\'unica cosa che si vede è '
        + 'la RETE di luce. È il caso in cui il disegno non sta sul pelo, sta sul '
        + 'fondo — e noi lo disegniamo sul pelo perché il fondo non lo tocchiamo (ancora)',
    tinta: 0x49d0e8, motivo: 'ragnatela', motivoScala: 4.2, stile: 'rete', modello: 'lucida', onde: true, riflesso: false, vera: 3,
    regole: { alfa: [0.42, 0.26, 0.90], tagli: [0.18, 0.12, 0.52, 0.030], moto: 0.02,
              rilievo: 0.26, lucido: 60, forzaSpec: 1.4, tratti: 0.70, satura: 0.30 },
  },
  palude: {
    nome: 'Palude',
    nota: 'opaca e ferma: verde scuro, niente si vede sotto, e la superficie è '
        + 'quasi immobile. La densità si dice con l\'ALFA, non con il colore — '
        + 'un\'acqua che non lascia passare niente si legge come melma',
    tinta: 0x3f5a33, stile: 'liscia', modello: 'piatto', onde: true, riflesso: false,
    regole: { alfa: [1.0, 0.98, 1.0], tagli: [0.16, 0.24, 0.52, 0.035], moto: 0.012,
              rilievo: 0.10, fondo: 0.24, satura: 0.16, schiuma: 0.42 },
  },
  lava: {
    nome: 'Lava',
    nota: 'non è acqua ed è qui apposta: la stessa impalcatura con la roccia '
        + 'scura al posto del blu e le crepe LUMINOSE al posto della schiuma. '
        + 'Serve a vedere quanto l\'impianto regge fuori dal suo mestiere',
    tinta: 0x2a1008, segno: 0xff7a1e, stile: 'rete', modello: 'spenta', onde: true, riflesso: false,
    regole: { alfa: [1.0, 1.0, 1.0], tagli: [0.10, 0.20, 0.52, 0.075], moto: 0.02,
              schiuma: 0.0, fondo: 0.10, satura: 0.30 },
  },
  ghiaccio: {
    nome: 'Ghiaccio',
    nota: 'ferma e lucida: nessun movimento, riflesso forte, e crepe chiare che '
        + 'non scorrono. Toglie il moto e tiene tutto il resto — è il modo più '
        + 'rapido di vedere quanto del «sembra acqua» viene dal movimento',
    tinta: 0xc8e6f0, stile: 'creste', modello: 'lucida', onde: false, riflesso: true, vera: 2,
    regole: { alfa: [0.88, 0.80, 1.0], lucido: 120, forzaSpec: 2.2, rilievo: 0.10,
              riflPeso: 1.0, riflForza: 0.008, tagli: [0.16, 0.10, 0.52, 0.035],
              onda: [9.0, 14.0, 0.10, 0.25], fondo: 0.0, satura: 0.06 },
  },
  notte: {
    nome: 'Notte di luna',
    nota: 'quasi nera, e l\'unica cosa che si vede è la strada d\'argento. '
        + 'Metti l\'ora su «notte» e la vista «verso la luna»: se non la vedi, '
        + 'stai guardando dalla parte sbagliata — il lobo vive in una finestra stretta',
    tinta: 0x101e33, stile: 'tratti', modello: 'lucida', onde: true, riflesso: true,
    regole: { alfa: [0.97, 0.94, 1.0], lucido: 70, forzaSpec: 2.0, rilievo: 0.34,
              riflPeso: 1.1, moto: 0.035, brillio: [0.50, 6.0, 1.4, 0.62],
              fondo: 0.22, satura: 0.18, schiuma: 0.72 },
  },
  tropicale: {
    nome: 'Tropicale',
    nota: 'la fascia di bassofondo fa tutto il lavoro: turchese chiarissimo dove '
        + 'tocca la sabbia, blu pieno al largo, e lo stacco è netto. È l\'acqua '
        + 'in cui la PROFONDITÀ è il soggetto',
    tinta: 0x18c2d8, stile: 'tratti', modello: 'morbida', onde: true, riflesso: false, vera: 2,
    regole: { alfa: [0.72, 0.40, 0.96], mis: [0.16, 0.09, 0.055, 0.52], bassofondo: 0.46,
              turchese: 0.34, moto: 0.026, rilievo: 0.20, satura: 0.44, tratti: 0.60 },
  },
  oceano: {
    nome: 'Mare aperto',
    nota: 'onde alte e creste bianche: il moto è il doppio di tutti gli altri e '
        + 'la schiuma non sta solo sulla riva. ⚠ È anche il caso che mette alla '
        + 'prova la cucitura della mesh — se una scatola si apre, si apre qui',
    tinta: 0x1a5f9e, stile: 'creste', modello: 'lucida', onde: true, riflesso: true,
    regole: { alfa: [0.97, 0.92, 1.0], moto: 0.058, rilievo: 0.46, lucido: 40,
              forzaSpec: 1.6, riflPeso: 0.7, tagli: [0.34, 0.26, 0.46, 0.035],
              onda: [11.0, 17.0, 0.26, 0.75], fondo: 0.18, satura: 0.30 },
  },
  neon: {
    nome: 'Neon',
    nota: 'fondo scurissimo e riflessi saturi: quello che si vede è quasi tutto '
        + 'specchio. Serve a giudicare il riflesso da solo, senza il colore '
        + 'dell\'acqua che lo copre',
    tinta: 0x1b0a2e, segno: 0xff3ec8, stile: 'creste', modello: 'lucida', onde: true, riflesso: true,
    regole: { alfa: [0.98, 0.95, 1.0], lucido: 110, forzaSpec: 3.0, rilievo: 0.40,
              riflPeso: 1.8, riflTetto: 0.9, riflForza: 0.05, moto: 0.04, fondo: 0.34, satura: 0.50,
              tratti: 0.80, schiuma: 0.90 },
  },
  metallo: {
    nome: 'Metallo liquido',
    nota: 'nessun colore proprio e riflesso pieno: la superficie è solo una lente '
        + 'deformante. È il limite dell\'impianto dalla parte opposta a «liscia» — '
        + 'lì non c\'è niente sopra, qui non c\'è niente SOTTO',
    tinta: 0x8d97a0, stile: 'liscia', modello: 'lucida', onde: true, riflesso: true,
    regole: { alfa: [1.0, 1.0, 1.0], lucido: 140, forzaSpec: 2.4, rilievo: 0.52,
              riflPeso: 2.4, riflTetto: 1.0, riflForza: 0.075, moto: 0.05, fondo: 0.10, satura: 0.0 },
  },
  vetrata: {
    nome: 'Vetrata',
    nota: 'il Fresnel come legge: a picco quasi invisibile, radente piena e '
        + 'chiara. Cambia guardandola, non col tempo — è l\'unica ricetta in cui '
        + 'a muoversi devi essere tu',
    tinta: 0x5fb8d8, stile: 'liscia', modello: 'vetrosa', onde: true, riflesso: false, vera: 2,
    regole: { alfa: [0.55, 0.34, 0.92], moto: 0.024, rilievo: 0.22, satura: 0.24 },
  },
  cartone: {
    nome: 'Cartone animato',
    nota: 'quattro bande di luce vera e segni grossi: si vede il VOLUME '
        + 'dell\'onda senza una sfumatura. È il cel shading dei disegni animati, '
        + 'che non è la stessa cosa di «un gradino solo»',
    tinta: 0x35a7e8, stile: 'tratti', modello: 'celle', onde: true, riflesso: false,
    regole: { alfa: [0.94, 0.88, 1.0], moto: 0.042, rilievo: 0.40, tratti: 0.66,
              tagli: [0.32, 0.22, 0.52, 0.035], satura: 0.32 },
  },
};

/**
 * L'ALTEZZA DEL PELO, in JavaScript puro — per la fisica di domani.
 *
 * ⚠ È LA TRASCRIZIONE RIGA PER RIGA DI `GLSL_ACQUA_ONDE_VERTICE`, e DEVE
 * restarlo: quando la fase 5 porterà corpi che galleggiano, la spinta si
 * calcola qui — e un oggetto che galleggia su un'acqua diversa da quella
 * disegnata è il difetto che non si può rattoppare. La prova
 * `test/acqua-pelo.test.mjs` confronta i coefficienti con il GLSL vero, così
 * chi ritocca le onde rompe una prova invece di rompere il galleggiamento.
 * (Il peso `fract(y)` del vertex qui è ≈1: sul pelo libero vale 15/16.)
 */
export function altezzaPelo(x, z, t, moto = REGOLE.moto) {
  const piegaUna = 0.8 * Math.sin(x * 0.151 - z * 0.203);
  const piegaDue = 0.8 * Math.sin(z * 0.127 + x * 0.089);
  const uno = 0.55 * Math.sin(x * 0.83 + z * 0.24 + t * 1.07 + piegaUna);
  const due = 0.45 * Math.sin(x * 0.51 - z * 1.04 - t * 0.71 - 0.7 * piegaDue);
  const tre = 0.35 * Math.sin(x * 0.47 + z * 1.39 + t * 0.53 + 0.6 * piegaDue);
  const qua = 0.25 * Math.sin(z * 0.95 - x * 1.27 + t * 0.89 - 0.5 * piegaUna);
  return (uno + due + tre + qua) * moto;
}

/**
 * LO SPECCHIO: una `MirrorTexture` con dentro solo quello che vale la pena
 * riflettere.
 *
 * ⚠ LA LISTA È ESPLICITA, ed è tutta la differenza fra 11 ms e qualcosa di
 * sostenibile. Un riflesso «della scena» ridisegna tutto, erba compresa —
 * centomila lamelle specchiate che nessuno guarderà mai. Qui entrano i SOLIDI e
 * i modelli, e basta.
 * ⚠ E L'ACQUA NON RIFLETTE SÉ STESSA: sarebbe un anello, e Babylon lo
 * risolverebbe disegnando il fotogramma precedente — cioè uno sfarfallio.
 *
 * ⚠ IL PIANO VA IMPOSTATO DA FUORI, e cambia col livello dell'acqua che si sta
 * guardando: un riflesso planare ha UN piano. È il limite della tecnica, non
 * una svista, e nel gioco vero significa «il lago principale sì, la pozza sul
 * dirupo no».
 */
/**
 * CHI ENTRA NELLE PASSATE DELL'ACQUA (specchio, rifrazione, profondità).
 *
 * ⚠ UN FILTRO SOLO PER TUTTE E TRE, ed è la cura a un difetto trovato coi
 * numeri: lo specchio diceva «niente erba» nel commento ed escludeva solo
 * `acqua*` nel codice — ma l'erba del gioco si chiama `prato`, quindi 101.698
 * lamelle finivano SPECCHIATE e pure nella mappa di profondità, a ogni
 * fotogramma. Tre filtri scritti a mano in tre posti divergono sempre così:
 * uno si aggiorna, gli altri due mentono. Misurato al momento del fix:
 * −1,7 ms su desktop (dove la banda avanza — su un telefono è molto di più).
 *
 * Restano fuori anche le cose di GIOCO che in un riflesso non c'entrano:
 * mirino, anteprima, fantasmi del colpetto, schegge, aloni (billboard verso
 * camera: specchiati escono storti), il corpo del giocatore e le ancore delle
 * particelle (invisibili, ma ogni voce in lista è un controllo per passata).
 */
const FUORI_DALLE_PASSATE = /^(acqua|prato|corpo|alone|mirino|anteprima|colpetto|schegge|ancora)/;
function entraNellePassate(mesh) {
  return !FUORI_DALLE_PASSATE.test(mesh.name);
}

function creaSpecchio(rig) {
  const dim = rig.dispositivo.mobile ? 256 : 512;
  const specchio = new MirrorTexture('specchio-acqua', dim, rig.scena, true);
  specchio.mirrorPlane = new Plane(0, -1, 0, 9.5);
  specchio.level = 1;
  // ⚠ SFOCATO APPOSTA: un riflesso nitido su un'acqua a tinte piatte urla
  // «render target». Sfocandolo diventa una macchia di colore che si muove con
  // la scena, che è quello che di un riflesso si legge davvero da lontano.
  specchio.adaptiveBlurKernel = 12;
  specchio.renderList = rig.scena.meshes.filter(entraNellePassate);
  // ⚠ E VA REGISTRATA FRA I RENDER TARGET DELLA SCENA, O NON LA DISEGNA NESSUNO.
  // Babylon rende una `MirrorTexture` solo se la trova in
  // `scene.customRenderTargets` — e ce la mette DA SOLO quando la si assegna a
  // `material.reflectionTexture`, cioè per la strada normale. Legandola a mano
  // come campionatore nostro quella strada non si percorre: la texture resta
  // NERA, e a schermo non sembra un guasto — sembra «un riflesso scuro», che è
  // una cosa che si può quasi credere. Misurato con `readPixels`: media (0,0,0)
  // e il 100% dei texel sotto soglia, cioè non un pixel disegnato.
  if (!rig.scena.customRenderTargets.includes(specchio)) rig.scena.customRenderTargets.push(specchio);
  rig.scena.onNewMeshAddedObservable.add((mesh) => {
    if (entraNellePassate(mesh) && specchio.renderList) specchio.renderList.push(mesh);
  });
  return specchio;
}

/**
 * ⚠ LE RISORSE DI PASSATA SONO DEL RIG, NON DEL MATERIALE, e questa funzione
 * cura un guasto che avevo introdotto io: ogni materiale col riflesso creava il
 * SUO specchio e lo registrava fra i render target della scena. I materiali si
 * tengono in cache per non ricompilare — quindi cambiando ricetta gli specchi
 * si ACCUMULAVANO, e ognuno continuava a renderizzare ogni fotogramma anche se
 * il suo materiale non stava più su nessuna mesh. Dieci ricette provate = dieci
 * scene specchiate per fotogramma, in silenzio. Adesso specchio, rifrazione e
 * profondità sono UNO ciascuno, appesi al rig, e i materiali li condividono.
 */
export function specchioCondiviso(rig) {
  if (!rig._specchioAcqua) rig._specchioAcqua = creaSpecchio(rig);
  return rig._specchioAcqua;
}

/**
 * LA RIFRAZIONE: la scena SENZA l'acqua, vista dalla stessa camera.
 *
 * ⚠ È IL PEZZO CHE MANCAVA DAVVERO, e senza il quale ogni «trasparenza» era
 * una mezza bugia da alpha blending: il fondo si vedeva, ma FERMO — una lastra
 * colorata sopra un'immagine immobile. Un liquido si riconosce perché quello
 * che sta sotto si DEFORMA col pelo; per deformarlo bisogna averlo in una
 * texture, e per averla bisogna disegnare i solidi una seconda volta.
 *
 * ⚠ NIENTE ERBA NELLA LISTA: centomila lamelle ridisegnate in una passata che
 * serve a vedere il FONDALE sono il modo più caro di non vedere niente —
 * sott'acqua l'erba non c'è. Stessa esclusione dello specchio.
 */
export function rifrazioneCondivisa(rig) {
  if (!rig._rifrazioneAcqua) {
    const dim = rig.dispositivo.mobile ? 256 : 512;
    // ⚠ CON I MIP, ed è la sfocatura del fondale: `textureLod` per spessore fa
    // il fondo nitido a tre dita e morbido a tre metri — il segnale visivo più
    // forte di «c'è acqua di mezzo» (boujie lo fa con la roughness sul mip).
    // ⚠ La catena mip si rigenera OGNI fotogramma: su desktop è nel rumore, su
    // una GPU a tile è da misurare — ma lì questa texture non esiste proprio.
    const rt = new RenderTargetTexture('rifrazione-acqua', dim, rig.scena, true);
    rt.renderList = rig.scena.meshes.filter(entraNellePassate);
    rig.scena.onNewMeshAddedObservable.add((m) => { if (entraNellePassate(m) && rt.renderList) rt.renderList.push(m); });
    rig.scena.customRenderTargets.push(rt);
    rig._rifrazioneAcqua = rt;
  }
  return rig._rifrazioneAcqua;
}

/**
 * LA PROFONDITÀ: quanto è lontano quello che sta DIETRO il pelo.
 *
 * ⚠ `storeCameraSpaceZ` (l'ultimo argomento), ed è la scelta che rende il conto
 * verificabile: la mappa tiene la Z in spazio camera, e il fragment dell'acqua
 * calcola la SUA con la stessa matrice di vista (`uVista`) — stessa fonte,
 * stesse convenzioni, anche con l'origine mobile accesa. La differenza fra le
 * due è lo SPESSORE d'acqua in quel pixel: il numero da cui nascono
 * l'assorbimento, la schiuma di contatto attorno a QUALSIASI cosa (anche
 * mobile, senza che il mesher ne sappia niente) e il fondale vero al posto
 * della bugia «distanza dalla sponda in pianta».
 *
 * ⚠ L'ACQUA NON ENTRA NELLA PROPRIA MAPPA: il DepthRenderer salta i materiali
 * che fondono, e il nostro ha alpha 0,9. Per questo l'alpha del MATERIALE resta
 * sotto l'uno anche quando il fragment scrive `color.a = 1`: portarlo a 1 lo
 * farebbe diventare opaco, entrerebbe nella mappa di profondità, e lo spessore
 * misurato diventerebbe zero dappertutto — cioè schiuma piena su tutto il pelo.
 */
/**
 * IL GOVERNO DELLE PASSATE — fase R2 del rework: una passata gira SOLO se
 * qualcuno la sta guardando.
 *
 * ⚠ IL DIFETTO CHE CURA È SILENZIOSO E CUMULATIVO: specchio, rifrazione e
 * profondità sono risorse condivise del rig — giusto per non accumularle — ma
 * una volta CREATE restavano registrate per sempre. Provavi la cristallina,
 * passavi a ghibli (che non ne usa nessuna), e le tre passate continuavano a
 * ridisegnare la scena ogni fotogramma per un materiale che non le campiona
 * più. Peggio: l'acqua può essere DIETRO la camera — guardi il cielo o la
 * montagna, e paghi specchio+rifrazione+profondità per pixel che non esistono.
 *
 * Due condizioni, tutte e due necessarie:
 *  · la ricetta ATTIVA le usa (`servono`, lo sa la fabbrica);
 *  · almeno una mesh d'acqua è ABILITATA e NEL FRUSTUM (`visibile`, che la
 *    fabbrica calcola col some() più economico possibile).
 *
 * ⚠ Lo specchio e la rifrazione si tolgono da `customRenderTargets` (è la
 * lista che Babylon percorre: fuori = zero costo), la profondità ha il suo
 * `enabled`. Al rientro non serve nessun riscaldo: la texture del fotogramma
 * vecchio vive un giro solo, e su un rientro in campo non si nota.
 */
export function governaPassate(rig, servono, visibile) {
  const lista = rig.scena.customRenderTargets;
  const regola = (rt, serve) => {
    if (!rt) return;
    const dentro = lista.indexOf(rt);
    if (serve && dentro < 0) lista.push(rt);
    else if (!serve && dentro >= 0) lista.splice(dentro, 1);
  };
  regola(rig._specchioAcqua, visibile && servono.specchio);
  regola(rig._rifrazioneAcqua, visibile && servono.rifrazione);
  if (rig._profonditaAcqua) rig._profonditaAcqua.enabled = !!(visibile && servono.profondita);
}

export function profonditaCondivisa(rig) {
  if (!rig._profonditaAcqua) {
    rig._profonditaAcqua = rig.scena.enableDepthRenderer(rig.camera, false, undefined, undefined, true);
    // ⚠ ANCHE QUI LA LISTA È ESPLICITA: senza, la mappa di profondità disegna
    // TUTTO — erba compresa, cioè centomila lamelle in una passata che serve a
    // sapere quanto è fondo il lago. E l'erba nella mappa sarebbe pure un
    // DIFETTO, non solo un costo: ogni ciuffo che sporge sull'acqua diventerebbe
    // «qualcosa che tocca il pelo», cioè un anello di schiuma di contatto
    // attorno all'erba della riva.
    const mappa = rig._profonditaAcqua.getDepthMap();
    mappa.renderList = rig.scena.meshes.filter(entraNellePassate);
    rig.scena.onNewMeshAddedObservable.add((m) => { if (entraNellePassate(m) && mappa.renderList) mappa.renderList.push(m); });
  }
  return rig._profonditaAcqua;
}

/**
 * IL MATERIALE DELL'ACQUA.
 *
 * ⚠ PASSA DALLO STESSO `applicaStilePiatto` DEL MONDO, e non è pigrizia: è la
 * ragione per cui l'acqua sta nello stesso mondo dei blocchi. L'ombra di un
 * albero che cade su una pozza dev'essere LA STESSA ombra, con gli stessi tre
 * gradini e la stessa tinta di cielo, se no sul bordo si vede il confine fra
 * due leggi della luce. In Leafy-Lantern quel difetto è stato bocciato tre
 * volte, ed era proprio così che nasceva.
 */
export class Acqua {
  constructor(rig, opzioni = {}) {
    // ⚠ UNA RICETTA È UN PACCHETTO, non una manopola: sceglie tutti e quattro
    // gli assi E ritocca i numeri. Le opzioni sciolte restano possibili (il
    // banco le usa per i menu), ma la ricetta le precede.
    const base = RICETTE[opzioni.ricetta] || {};
    const { ricca = true, stile = 'tratti', onde = false, modello = 'piatto', riflesso = false } = { ...base, ...opzioni };
    this.ricetta = RICETTE[opzioni.ricetta] ? opzioni.ricetta : null;
    // ⚠ LA TECNICA È UNA SCALA, NON TRE INTERRUTTORI: le caustiche si dipingono
    // sull'immagine rifratta (senza, non avrebbero dove stare) e la rifrazione
    // ha bisogno dello spessore per deformare e per il ripiego sul bordo.
    // Quindi caustiche ⇒ rifrazione ⇒ profondità, e la si dichiara come un
    // livello: 0 pittura · 1 profondità · 2 rifrazione · 3 caustiche.
    // ⚠ E SU MOBILE NON SI COMPILA (livello forzato a 0): sono tre passate e
    // letture in più, e la regola della casa è che ciò che non si paga non
    // deve nemmeno essere compilato.
    const vera = Math.max(0, Math.min(3, ({ ...base, ...opzioni }).vera || 0));
    this.vera = ricca ? vera : 0;
    this.profondita = this.vera >= 1;
    this.rifrazione = this.vera >= 2;
    this.caustiche = this.vera >= 3;
    // ── I TALENTI: capacità in più che una ricetta può accendere ─────────────
    // ⚠ TUTTE ALU PURA, ZERO PASSATE: è la famiglia «stupenda ma leggera».
    // Ognuna si COMPILA solo se accesa (la solita regola: quello che non si
    // paga non deve nemmeno esistere nel sorgente), e ognuna è un numero della
    // ricetta, non un interruttore globale.
    const insieme = { ...base, ...opzioni };
    this.iridescenza = ricca ? (insieme.iridescenza || 0) : 0;   // benzina, bolle di sapone
    this.bagliore = insieme.bagliore || null;                    // schiuma e segni che EMETTONO luce
    this.cresteBianche = insieme.cresteBianche || 0;             // schiuma sulle creste delle onde
    this.spinta = insieme.spinta || 0;                           // onde «choppy»: si spostano anche in orizzontale
    // ⚠ IL MOTIVO SCAVALCA LO STILE: quando una ricetta dichiara la sua firma
    // («trattini», «archetti», «ragnatela»), il disegno del pelo è QUELLA
    // funzione, non uno dei dieci stili generici. È la differenza fra
    // «l'acqua di New Leaf» e «la nostra acqua tinta come New Leaf».
    this.motivo = MOTIVI[insieme.motivo] ? insieme.motivo : null;
    this.motivoScala = insieme.motivoScala || 1.3;
    // ⚠ LE INCRESPATURE SONO ACCESE SU OGNI MATERIALE RICCO: otto anelli in un
    // ciclo di ALU è il genere di costo che su desktop non si misura, e
    // un'acqua che risponde al tocco è la differenza fra una superficie e una
    // cosa viva. Su mobile, come sempre, non si compila.
    this.interattiva = ricca && insieme.interattiva !== false;
    // le righe di riva vogliono lo spessore: senza profondità non esistono
    this.rigaRiva = this.profondita ? (insieme.rigaRiva || null) : null;
    // il controluce vuole le onde (le fasi vengono dalla loro funzione)
    this.sss = ricca && insieme.sss ? insieme.sss : null;
    /** Gli impatti vivi: otto vec4 (x, z, quando, forza), giro tondo. */
    this.tocchi = new Float32Array(32);
    this._giroTocchi = 0;
    // la scia ha un registro suo: 16 vec4, vedi GLSL_ACQUA_SCIA
    this.scie = new Float32Array(64);
    this._giroScie = 0;
    this._adesso = 0;
    // ⚠ LE REGOLE SONO DI QUESTO MATERIALE, non del modulo, ed è la riga che
    // rende possibili venti acque diverse invece di venti varianti della
    // stessa: colori, ampiezza delle onde, soglie e lucentezza sono numeri
    // dell'istanza. Prima erano costanti globali, quindi due materiali vivi
    // insieme avrebbero litigato sullo stesso oggetto.
    this.R = { ...REGOLE, ...(base.regole || {}), ...(opzioni.regole || {}) };
    this.rig = rig;
    this.ricca = ricca;
    this.stile = STILI[stile] ? stile : 'tratti';
    // ⚠ LE ONDE NON SONO UNO STILE, SONO UN ALTRO MATERIALE: cambiano il VERTEX
    // shader, non il fragment. Tenerle nella stessa tabella degli stili avrebbe
    // confuso due cose diverse — un disegno sul pelo e una superficie che si
    // muove — e il committente aveva ragione a dire che dieci «stili» che
    // toccano solo il colore non sono dieci materiali.
    this.onde = !!onde;
    // ⚠ IL MODELLO DI LUCE È IL TERZO ASSE, e i tre sono indipendenti: il
    // DISEGNO sul pelo (dieci), la GEOMETRIA (ferma o a onde), e la LEGGE DELLA
    // LUCE (sei). Tenerli separati è quello che permette di dire «questa rete
    // ma con la luce morbida» invece di dover scegliere fra sedici pacchetti
    // preconfezionati.
    this.modello = MODELLI[modello] ? modello : 'piatto';
    // ⚠ IL RIFLESSO SI DECIDE ALLA COSTRUZIONE come tutto il resto: è un altro
    // sorgente (una lettura da texture in più) e un altro COSTO (un render in
    // più della lista). Non è una manopola da girare a caldo.
    this.riflesso = !!riflesso;
    this.uSchermo = new Vector2(1, 1);
    // ⚠ LA TINTA PUÒ ARRIVARE DALLA RICETTA. Di fabbrica viene da `blocks.js`,
    // che resta l'unico posto dove sta scritto di che colore è l'acqua del
    // gioco; ma una ricetta che imita l'acqua di un altro gioco ha bisogno del
    // SUO colore — e un'acqua nera di Bayonetta derivata dal celeste di Leafy
    // non è la stessa cosa.
    const pal = { cima: (RICETTE[opzioni.ricetta] || {}).tinta || opzioni.tinta || BLOCCHI.acqua.cima };

    // ⚠ LA TESSITURA SI CUOCE UNA VOLTA E VIVE PER SEMPRE: 128×128×4 sono 64 KB
    // di memoria della scheda e zero byte di rete (non è un file: la genera
    // `tratteggio.js`). Il campionamento è LINEARE e non `NEAREST` — è l'unico
    // posto di tutto il progetto in cui serve una sfumatura, perché è quella che
    // poi si TAGLIA: un campo a scalini tagliato darebbe un bordo a scalini.
    this.texture = RawTexture.CreateRGBATexture(
      tratteggio(), LATO, LATO, rig.scena, true, false, Texture.TRILINEAR_SAMPLINGMODE,
    );
    this.texture.wrapU = Constants.TEXTURE_WRAP_ADDRESSMODE;
    this.texture.wrapV = Constants.TEXTURE_WRAP_ADDRESSMODE;
    this.texture.name = 'tratteggio-acqua';
    // ⚠ ANISOTROPICO, ED È LA CURA AI «PATTERN STRANI DA CERTE ANGOLAZIONI»
    // (il committente li ha fotografati: ovali morbidi in griglia sul pelo).
    // A vista OBLIQUA E VICINA la derivata dell'UV esplode in una direzione;
    // il trilineare sceglie il mip del gradiente peggiore, e ai mip alti il
    // campo delle chiazze collassa nelle sue celle 9×9: quegli ovali SONO la
    // griglia del value noise sfumata. Il filtro anisotropico campiona più
    // volte lungo la direzione stirata e il mip resta onesto. La diagnosi era
    // del committente: «sembra un difetto della vicinanza della telecamera».
    this.texture.anisotropicFilteringLevel = 8;

    // le uniform: OGGETTI e poi si mutano, come vuole CustomMaterial (rilega a
    // ogni disegno leggendo da una mappa interna: passando valori si
    // allocherebbe per fotogramma, passando oggetti no)
    this.uMis = new Vector4(...this.R.mis);
    this.uTagli = new Vector4(...this.R.tagli);
    this.uAlfa = new Vector3(...this.R.alfa);
    this.uBrillio = new Vector4(...this.R.brillio);
    this.uMuro = new Vector4(...this.R.muro);
    this.uCascata = new Vector4(...this.R.cascata);
    this.uOnda = new Vector4(...this.R.onda);
    // (bordo schiuma in Z camera, scala del fondale, forza rifrazione, densità del corpo)
    this.uVera = new Vector4(...this.R.vera);
    // ⚠ IL PROFONDO VIRA DI TONALITÀ, non solo di valore: è la richiesta
    // esplicita del committente («che va a scurirsi con un hue shift più si va
    // in profondità») ed è quello che separa «limpida» da «sporca». La
    // DIREZIONE della virata la dice la ricetta (`viraFondo`, in gradi).
    this.uFonda = viraTono(pal.cima, this.R.viraFondo, 0.10, this.R.fondo);
    // ⚠ L'ASSORBIMENTO È IL COMPLEMENTARE DELLA TINTA DI SUPERFICIE, per
    // canale: un'acqua blu lascia passare il blu e mangia il rosso. È
    // Beer-Lambert a spanne. ⚠ E NON SI RICAVA DALLA TINTA FONDA: provato — la
    // colonna filtrava verso il viola anche mezzo blocco d'acqua e il
    // committente l'ha visto subito («adesso l'acqua è totalmente viola, no»).
    // L'esponenziale non sa quanto è fondo il fondo: colora TUTTO, subito. La
    // virata delle cose col profondo sta in `GLSL_ACQUA_VERA_FINE`, pesata da
    // `acquaFondale` — zero al pelo, piena a fondo scala.
    const [tR, tG, tB] = canali(pal.cima);
    this.uAssorbi = new Vector3(
      this.R.assorbi * (1.08 - tR),
      this.R.assorbi * (1.08 - tG),
      this.R.assorbi * (1.08 - tB),
    );
    this.uBassa = turchese(pal.cima, this.R.bassofondo, this.R.turchese);
    // ⚠ IL SEGNO PUÒ AVERE UN COLORE SUO, e senza questa riga la lava non
    // funziona: «tratti» dice quanto il segno è più CHIARO della tinta di base,
    // e su una roccia scura questo dà crepe grigie, non incandescenti. Una
    // crepa di lava non è roccia schiarita — è un'altra sostanza.
    this.uChiara = base.segno !== undefined || opzioni.segno !== undefined
      ? tintaDa(base.segno !== undefined ? base.segno : opzioni.segno)
      : schiarisci(pal.cima, this.R.tratti);
    // ⚠ ANCHE LA SCHIUMA PUÒ AVERE UNA TINTA SUA, ed è più potente di quanto
    // sembri: una schiuma SCURA trasforma il nastro di riva e la schiuma di
    // contatto in un CONTORNO a china — la ligne claire dei fumetti — senza
    // toccare una riga di GLSL. Una dorata, con il bagliore, fa il kintsugi.
    const tintaSchiuma = base.schiumaTinta !== undefined ? base.schiumaTinta : opzioni.schiumaTinta;
    this.uSchiuma = tintaSchiuma !== undefined ? tintaDa(tintaSchiuma) : schiarisci(pal.cima, this.R.schiuma);
    // ⚠ SERVE SOLO A «inchiostro», e sta qui e non nello stile perché una
    // uniform in più non costa: il ramo che non la usa la lascia a zero e il
    // compilatore la butta. Un materiale in più costerebbe una compilazione.
    this.uScura = fondale(pal.cima, this.R.segnoScuro, this.R.satura);
    this.uLuna = new Vector3(0, -1, 0);

    this.materiale = this._materiale();
  }

  _materiale() {
    // ⚠ IL NOME PORTA ANCHE LE ONDE: due materiali che si chiamano uguale non si
    // distinguono in nessuna diagnosi, e la prima verifica di questo lavoro è
    // proprio «quale dei due sto guardando».
    // ⚠ IL NOME È UNICO PER RICETTA, e non è cosmetica: due ricette possono
    // avere gli stessi quattro assi ma GLSL diverso (una ha l'iridescenza,
    // l'altra no), e due materiali omonimi con sorgenti diversi sono il tipo di
    // collisione che si manifesta come «lo shader sbagliato su quella mesh» —
    // lontano da dove è nata.
    const nome = this.ricetta
      ? `acqua+${this.ricetta}`
      : `acqua-${this.stile}-${this.modello}${this.onde ? '+onde' : ''}${this.riflesso ? '+rifl' : ''}${this.vera ? '+vera' + this.vera : ''}`;
    const m = new CustomMaterial(nome, this.rig.scena);
    // ⚠ L'ALFA RESTA SOTTO L'UNO ANCHE SE LA SCRIVIAMO NOI. Babylon decide dalla
    // proprietà `alpha` se la mesh va nella coda dei TRASPARENTI: con 1 la
    // metterebbe fra gli opachi e il nostro `color.a` per-pixel non verrebbe
    // mai fuso con niente. Il valore vero lo mette lo shader; questo serve solo
    // a dire «sono trasparente».
    m.alpha = 0.9;
    m.backFaceCulling = false;      // il pelo si guarda anche da sotto

    m.AddAttribute('aAcqua');
    m.AddAttribute('aRiva');
    m.AddUniform('uTempo', 'float', 0);
    // ⚠ DICHIARATA SEMPRE, ANCHE SENZA ONDE: `AddUniform` scrive la riga in
    // tutti e due gli shader, e una uniform dichiarata e non usata la butta il
    // compilatore. Dichiararla solo col ramo acceso vorrebbe dire due sorgenti
    // che divergono anche dove non serve.
    m.AddUniform('uAcquaMoto', 'float', 0);
    // quanto è mossa la normale, quanto è stretto il lobo, quanto brilla
    m.AddUniform('uAcquaRilievo', 'float', this.R.rilievo);
    m.AddUniform('uAcquaLucido', 'float', this.R.lucido);
    m.AddUniform('uAcquaForza', 'float', this.R.forzaSpec);
    // ⚠ `uSchermo` SERVE A DUE PADRONI (riflesso e tecnica) E SI DICHIARA UNA
    // VOLTA: la doppia dichiarazione di una uniform non compila.
    if (this.riflesso || this.profondita) m.AddUniform('uSchermo', 'vec2', this.uSchermo);
    if (this.riflesso) {
      this.specchio = specchioCondiviso(this.rig);
      m.AddUniform('uRiflesso', 'sampler2D', this.specchio);
      m.AddUniform('uRiflForza', 'float', this.R.riflForza);
      m.AddUniform('uRiflPeso', 'float', this.R.riflPeso);
      m.AddUniform('uRiflTetto', 'float', this.R.riflTetto);
    }
    if (this.profondita) {
      this.mappaZ = profonditaCondivisa(this.rig);
      m.AddUniform('uProfondita', 'sampler2D', this.mappaZ.getDepthMap());
      m.AddUniform('uVista', 'mat4');
      // (bordo schiuma in Z camera, scala del fondale, forza rifrazione, densità del corpo)
      m.AddUniform('uAcquaVera', 'vec4', this.uVera);
    }
    if (this.rifrazione) {
      this.vetro = rifrazioneCondivisa(this.rig);
      m.AddUniform('uRifrazione', 'sampler2D', this.vetro);
      // ⚠ L'ASSORBIMENTO SI RICAVA DALLA TINTA: un'acqua blu mangia il rosso.
      // «Complementare per canale» è la versione a spanne di Beer-Lambert, ed è
      // quella che fa virare il fondo invece di scurirlo.
      m.AddUniform('uAssorbi', 'vec3', this.uAssorbi);
      m.AddUniform('uSfocaK', 'float', this.R.sfoca);
    }
    if (this.caustiche) m.AddUniform('uAcquaCau', 'float', this.R.caustiche);
    // i talenti: ognuno porta la sua uniform solo se acceso
    if (this.iridescenza) m.AddUniform('uIride', 'float', this.iridescenza);
    if (this.bagliore) m.AddUniform('uBagliore', 'vec3', tintaDa(this.bagliore.tinta).scale(this.bagliore.forza || 1));
    if (this.cresteBianche) m.AddUniform('uCresteSoglia', 'float', this.cresteBianche);
    if (this.onde && this.spinta) m.AddUniform('uAcquaSpinta', 'float', this.spinta);
    if (this.interattiva) {
      // ⚠ ARRAY: si dichiara senza valore e si lega a mano nell'osservabile —
      // il legame automatico di CustomMaterial sa fare solo uniform singole
      // (stessa trappola già pagata dalle lampade, vedi stile.js).
      m.AddUniform('uTocchi[8]', 'vec4');
      m.AddUniform('uScia[16]', 'vec4');
      // ⚠ IL LEGAME STA QUI DENTRO, nel blocco dei tocchi: una sostituzione di
      // testo l'aveva spostato nel blocco delle righe di riva, e gli anelli
      // avrebbero funzionato SOLO sulle ricette con la riva accesa — un guasto
      // muto che sarebbe sembrato «l'interattività va e viene a caso».
      m.onBindObservable.add(() => { const eff = m.getEffect(); if (eff) { eff.setArray4('uTocchi', this.tocchi); eff.setArray4('uScia', this.scie); } });
    }
    if (this.rigaRiva) {
      // (quante righe per metro di spessore, velocità della marcia)
      m.AddUniform('uRigaRiva', 'vec2', new Vector2(this.rigaRiva[0], this.rigaRiva[1]));
    }
    if (this.sss) m.AddUniform('uSssTinta', 'vec3', tintaDa(this.sss));
    m.AddUniform('uTratto', 'sampler2D', this.texture);
    m.AddUniform('uAcquaMis', 'vec4', this.uMis);
    m.AddUniform('uAcquaTagli', 'vec4', this.uTagli);
    m.AddUniform('uAcquaAlfa', 'vec3', this.uAlfa);
    m.AddUniform('uBrillio', 'vec4', this.uBrillio);
    m.AddUniform('uAcquaMuro', 'vec4', this.uMuro);
    m.AddUniform('uCascata', 'vec4', this.uCascata);
    m.AddUniform('uAcquaOnda', 'vec4', this.uOnda);
    m.AddUniform('uSfumaVia', 'vec2', new Vector2(this.R.sfumaVia[0], this.R.sfumaVia[1]));
    m.AddUniform('uAcquaFonda', 'vec3', this.uFonda);
    m.AddUniform('uAcquaBassa', 'vec3', this.uBassa);
    m.AddUniform('uAcquaChiara', 'vec3', this.uChiara);
    m.AddUniform('uSchiuma', 'vec3', this.uSchiuma);
    m.AddUniform('uAcquaScura', 'vec3', this.uScura);
    m.AddUniform('uLunaVerso', 'vec3', this.uLuna);
    m.AddUniform('uLunaFase', 'float', 0);

    m.Vertex_Definitions(`
      attribute vec3 aAcqua;
      attribute vec2 aRiva;
      varying vec3 vAcqua;
      varying vec2 vRiva;
      varying vec3 vAcquaPos;
      ${this.profondita ? 'varying float vAcquaVistaZ;' : ''}
    `);
    // ⚠ LA SPINTA ORIZZONTALE È GERSTNER DETTO IN PICCOLO: le creste si
    // AFFOLLANO (i vertici scivolano verso la cresta) e l'onda smette di essere
    // un lenzuolo sinusoidale. Vale la stessa legge delle cuciture: funzione
    // della sola posizione di mondo, pesata da `fract(y)` — l'angolo condiviso
    // fra due celle riceve lo stesso spostamento dai due lati.
    const spintaGlsl = this.spinta ? `
  positionUpdated.x = positionUpdated.x + cos(position.x * 0.83 + position.z * 0.24 + uTempo * 1.07 + acquaPiegaUna) * uAcquaSpinta * acquaPeso;
  positionUpdated.z = positionUpdated.z + cos(position.x * 0.51 - position.z * 1.04 - uTempo * 0.71 - 0.7 * acquaPiegaDue) * uAcquaSpinta * 0.7 * acquaPeso;
` : '';
    m.Vertex_Before_PositionUpdated(GLSL_ACQUA_VERTICE + (this.onde ? GLSL_ACQUA_ONDE_VERTICE + spintaGlsl : ''));
    // ⚠ LA Z DI VISTA SI CALCOLA NEL VERTEX, dopo che `worldPos` esiste, con la
    // STESSA matrice che usa il DepthRenderer: così le due Z che il fragment
    // confronta sbagliano insieme o sono giuste insieme, origine mobile inclusa.
    if (this.profondita) m.Vertex_After_WorldPosComputed('vAcquaVistaZ = (uVista * worldPos).z;');

    // ⚠ SI PASSA DA `aggiungiDefinizioniFragment` E NON DA `Fragment_Definitions`:
    // quello è un SETTORE, non un accumulatore, e lo stile ci ha già messo il
    // cammino nella griglia dei muri. Chiamarlo a mano lo cancellerebbe
    // lasciando in piedi la chiamata — un errore su un materiale solo, mentre
    // tutti gli altri compilano. È già costato un pomeriggio (vedi stile.js).
    //
    // ⚠ E L'ORDINE CONTA: lo stile va applicato PRIMA, perché è lui a scrivere
    // le definizioni di partenza; poi ci si aggiunge le nostre.
    const campo = this.ricca ? GLSL_ACQUA_CAMPO_RICCO : GLSL_ACQUA_CAMPO_POVERO;
    const brillio = this.ricca ? GLSL_ACQUA_BRILLIO_RICCO : GLSL_ACQUA_BRILLIO_POVERO;

    // ⚠ IL BRILLIO SI SOMMA COME LUCE, NON SI MESCOLA COME COLORE, ed è la
    // ragione per cui `applicaStilePiatto` ha preso un aggancio nuovo. Un
    // luccichio è LUCE IN PIÙ che arriva all'occhio: se lo si mescolasse nel
    // colore piatto verrebbe poi moltiplicato per l'ambiente e per l'ombra, e
    // un riflesso del sole dentro l'ombra di un albero diventerebbe grigio.
    // Sommandolo dopo resta bianco dov'è, che è come si comporta un riflesso.
    // ⚠ MA IL SOLE SÌ CHE VA SPENTO DALL'OMBRA: `sole` è in ambito lì, e senza
    // quel fattore la pozza continuerebbe a luccicare all'ombra dell'albero.
    // Le lampade no — quelle illuminano proprio dove il sole non arriva.
    // ⚠ E ANCHE QUESTA RIGA HA DUE VERSIONI. Su mobile la scintilla vale zero,
    // quindi il termine delle lampade non farebbe niente — ma «non fa niente»
    // non vuol dire «non costa»: la regola della casa, misurata su Lantern, è
    // che su una GPU a tile il compilatore riserva i registri per quello che
    // POTREBBE servire, e lo shader va piano anche nei rami che non esegue.
    // Verificato leggendo il sorgente compilato: senza questa distinzione la
    // moltiplicazione c'era davvero, e `qualita.js` prometteva il contrario.
    const luceExtra = this.ricca
      ? 'vec3(acquaBrillio * sole) + lampade * acquaScintilla * 0.9'
      : 'vec3(acquaBrillio * sole)';
    // ⚠ IL BRILLIO DEL MODELLO SI SOMMA A QUELLO DEGLI STILI, non lo sostituisce:
    // la strada del sole è una decorazione (sta nel fragment del disegno), la
    // specularità è una legge (sta nel modello). Su «lucida» ci sono tutte e
    // due, ed è giusto — sono due fenomeni diversi che nella realtà convivono.
    const mod = MODELLI[this.modello];
    let extra = mod.extra ? `${luceExtra} + ${mod.extra}` : luceExtra;
    // ⚠ I TALENTI LUMINOSI SI SOMMANO COME LUCE, per la stessa ragione del
    // brillio: sono luce che ARRIVA all'occhio, non tinta della superficie.
    // L'iride brilla anche sull'acqua nera (è il suo mestiere: la benzina si
    // vede sulle pozzanghere scure); il bagliore è EMISSIVO — schiuma e segni
    // che illuminano da soli, e di notte restano accesi perché non passano
    // dall'ombra del sole.
    if (this.caustiche) extra = `${extra} + acquaCauLuce * sole`;
    // ⚠ LA CADUTA NON VA MAI AL BUIO, e questa riga è la differenza fra «una
    // cascata» e «una macchia grigia in una fessura». Le pareti delle cascate
    // stanno quasi sempre nell'ombra proiettata dalla rupe da cui saltano — è
    // geometricamente inevitabile — e con l'ombra a un gradino ci finivano
    // dentro tutte insieme: il pelo sopra smeraldo, la caduta color cemento.
    // In natura è il contrario, perché la schiuma è fatta di bolle e DIFFONDE
    // la luce invece di prenderla da una parte sola: una cascata all'ombra
    // resta la cosa più chiara della parete. Si restituisce un terzo della sua
    // tinta come luce propria, pesata dalla caduta — al ciglio niente, in fondo
    // tutto — così l'ombra continua a vedersi ma non la spegne.
    extra = `${extra} + acquaTinta * acquaSuMuro * acquaCadNato * 0.34`;
    if (this.iridescenza) extra = `${extra} + acquaIride * uIride`;
    if (this.bagliore) extra = `${extra} + uBagliore * max(acquaSchiuma, acquaLinea * 0.8)`;
    applicaStilePiatto(m, this.rig, 'acquaTinta', {
      alfa: 'acquaAlfa',
      luceExtra: extra,
      primaDellaLegge: mod.prima || null,
      leggeLuce: mod.legge,
    });
    aggiungiDefinizioniFragment(m, GLSL_ACQUA_DEFINIZIONI + (this.profondita ? '\n  varying float vAcquaVistaZ;' : ''));
    const rifl = this.riflesso ? GLSL_ACQUA_RIFLESSO : '';
    const veraPrima = this.profondita ? GLSL_ACQUA_VERA_PRIMA + (this.rigaRiva ? GLSL_ACQUA_RIGARIVA : '') : '';
    const veraDopo = this.rifrazione
      ? GLSL_ACQUA_VERA_DOPO + (this.caustiche ? GLSL_ACQUA_CAUSTICHE : '') + GLSL_ACQUA_VERA_FINE
      : '';
    // ⚠ L'ORDINE È IL SENSO: lo spessore PRIMA del colore (il fondale e la
    // schiuma di contatto entrano nelle stesse righe di quella di riva), la
    // rifrazione DOPO (sostituisce la trasparenza finta con il fondo vero), il
    // riflesso per ultimo (sta sopra tutto, pesato dal Fresnel).
    const talenti = (this.iridescenza ? GLSL_ACQUA_IRIDE : '') + (this.cresteBianche ? GLSL_ACQUA_CRESTE : '') + (this.interattiva ? GLSL_ACQUA_TOCCHI + GLSL_ACQUA_SCIA : '');
    if (this.motivo) aggiungiDefinizioniFragment(m, MOTIVI[this.motivo]);
    // ⚠ E IL MOTIVO NON SI SPEGNE PIÙ SULLA PARETE. C'era `* (1.0 -
    // acquaSuMuro)`: la firma della ricetta — gli archetti di New Horizons, i
    // cerchi di Wind Waker — finiva netta al ciglio, e sotto restavano le
    // «linette» uguali per tutti. Adesso il motivo continua giù per la caduta
    // (stirato dalle UV, vedi `GLSL_ACQUA_UV`) e il ciglio non è più un taglio.
    const disegno = this.motivo
      ? `\n  acquaLinea = acquaMotivo(acquaUvFerma * uMotivoScala, uTempo);\n`
      : STILI[this.stile];
    if (this.motivo) m.AddUniform('uMotivoScala', 'float', this.motivoScala);
    m.Fragment_Custom_Diffuse(GLSL_ACQUA_UV + campo + GLSL_ACQUA_CADUTA + GLSL_ACQUA_NORMALE + GLSL_ACQUA_CASCATA
      + veraPrima + talenti + disegno + GLSL_ACQUA_COLORE + (this.sss ? GLSL_ACQUA_SSS : '') + veraDopo + rifl + brillio);
    return m;
  }

  /**
   * Da chiamare una volta per fotogramma.
   *
   * ⚠ `uTempo` È UN NUMERO E I NUMERI NON SI MUTANO: va riscritto nella mappa
   * interna di CustomMaterial. È lo stesso punto in cui lo fa `prato.js`, ed è
   * l'unico posto in cui tocchiamo un campo privato di Babylon — sta qui
   * apposta, così se un giorno cambia si aggiusta in due righe.
   */
  /** Dove sta il pelo da riflettere. ⚠ Un riflesso planare ha UN piano solo. */
  quotaSpecchio(y) {
    if (this.specchio) this.specchio.mirrorPlane = new Plane(0, -1, 0, y);
  }

  /**
   * Un impatto sull'acqua: un anello che si allarga da (x, z).
   * ⚠ GIRO TONDO SUGLI OTTO POSTI: il nono tocco riprende il posto del primo,
   * che a quel punto è già morto (un anello vive 2,4 s). Niente elenchi da
   * pulire, niente allocazioni.
   */
  tocca(x, z, forza = 1) {
    if (!this.interattiva) return;
    const dove = (this._giroTocchi++ % 8) * 4;
    this.tocchi[dove] = x;
    this.tocchi[dove + 1] = z;
    this.tocchi[dove + 2] = this._adesso;
    this.tocchi[dove + 3] = forza;
  }

  /** Un segno di scia: qui `forza` è il RAGGIO del dischetto (in blocchi). */
  scia(x, z, forza = 0.5) {
    if (!this.interattiva) return;
    const dove = (this._giroScie++ % 16) * 4;
    this.scie[dove] = x;
    this.scie[dove + 1] = z;
    this.scie[dove + 2] = this._adesso;
    this.scie[dove + 3] = forza;
  }

  anima(t) {
    this._adesso = t;
    this.materiale._newUniformInstances['float-uTempo'] = t;
    this.materiale._newUniformInstances['float-uAcquaMoto'] = this.onde ? this.R.moto : 0;
    // ⚠ LA MATRICE DI VISTA SI RISCRIVE OGNI FOTOGRAMMA, e non per pigrizia di
    // non capire se l'oggetto interno della scena resti lo stesso: è il modo
    // che non dipende da come Babylon ricicla le sue matrici.
    // ⚠ E SENZA LA TRASLAZIONE: con l'origine mobile `worldPos` negli shader è
    // RELATIVO ALLA CAMERA, e la matrice intera lo spostava di nuovo — la Z del
    // pelo usciva sfalsata di ~(quota camera) rispetto alla mappa, misurato al
    // pixel: pelo a −34,2 contro il fondale a −23,9, cioè «il fondo sta DAVANTI
    // al pelo». Per punti relativi alla camera la rotazione da sola È la vista
    // assoluta (R·(p−c) = R·p − R·c = vista con la sua traslazione).
    // ⚠ E LA MATRICE PUÒ NON ESSERCI ANCORA: `anima` gira dentro il giro di
    // resa, che chiama il nostro codice PRIMA di `scena.render()` — al primo
    // fotogramma la scena non ha ancora calcolato la vista e `getViewMatrix()`
    // torna niente. Finché qui c'era un'assegnazione la cosa passava inosservata
    // (si legava `undefined` per un fotogramma); con la copia diventa
    // un'eccezione, cioè una pagina bianca all'avvio. La guardia costa un `if`.
    if (this.profondita) {
      const vista = this.rig.scena.getViewMatrix();
      if (vista) {
        if (!this._vistaRot) this._vistaRot = new Matrix();
        this._vistaRot.copyFrom(vista);
        this._vistaRot.setTranslationFromFloats(0, 0, 0);
        this.materiale._newUniformInstances['mat4-uVista'] = this._vistaRot;
      }
    }
    // ⚠ ANCHE SENZA SPECCHIO: la condizione era `if (this.specchio)`, e le
    // ricette con la profondità ma senza riflesso (New Horizons, BotW, la
    // piscina…) restavano con uSchermo = (1, 1) — cioè leggevano lo SPESSORE
    // sempre dallo stesso texel della mappa, per ogni pixel dello schermo.
    // Fondale e schiuma di contatto uscivano da un numero solo, sbagliato, e
    // il difetto cambiava con l'angolazione della camera perché cambiava quel
    // texel: un pezzo esatto del «da certe angolazioni non visualizza bene».
    if (this.specchio || this.profondita) {
      this.uSchermo.set(this.rig.motore.getRenderWidth(), this.rig.motore.getRenderHeight());
    }
    // ⚠ IL SOLE SI SPEGNE DI NOTTE, E VA FATTO QUI. La sua DIREZIONE ha un
    // pavimento a 14° (se no le cascate d'ombra si stirano), quindi a
    // mezzanotte punta ancora in giù: uno shader che riflettesse solo il verso
    // accenderebbe una strada di sole sul lago in piena notte, proveniente da
    // sottoterra. La forza vera la sa il ciclo del giorno.
    const sole = this.rig.soleLuce ?? 1;
    this.uBrillio.x = this.R.brillio[0] * sole;
    this.uLuna.copyFrom(this.rig.lunaVerso);
    // ⚠ E LA LUNA SI SPEGNE DI GIORNO, che è una correzione trovata leggendo i
    // numeri e non guardando: a mezzogiorno `lunaLuce` valeva 0,44 — cioè la
    // luna era in cielo davvero, ed è astronomicamente giusto. Ma una strada
    // d'argento sul lago in pieno sole non esiste: la sua luce c'è, e non si
    // vede, perché accanto ce n'è una centomila volte più forte. Senza questa
    // riga il lago avrebbe DUE luccichii in direzioni diverse a mezzogiorno, e
    // sarebbe il tipo di difetto che si nota senza saper dire cos'è.
    const fase = (this.rig.lunaLuce || 0) * (1 - sole);
    this.materiale._newUniformInstances['float-uLunaFase'] = fase;
  }
}

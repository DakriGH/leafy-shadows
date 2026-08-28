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
import { Vector3, Vector4 } from '@babylonjs/core/Maths/math.vector.js';
import { RawTexture } from '@babylonjs/core/Materials/Textures/rawTexture.js';
import { Texture } from '@babylonjs/core/Materials/Textures/texture.js';
import { Constants } from '@babylonjs/core/Engines/constants.js';
import { CustomMaterial } from '@babylonjs/materials/custom/customMaterial.js';
import { applicaStilePiatto, aggiungiDefinizioniFragment } from './stile.js';
import { tratteggio, LATO } from './tratteggio.js';
import { BLOCCHI } from '../world/blocks.js';

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
 * IL CAMPO, versione ricca: due letture.
 *
 * La prima è larga e lenta e non si vede mai da sola — serve a SPOSTARE il
 * punto in cui si legge la seconda. È il trucco che toglie il ripetersi della
 * tessitura: senza, a schermo si conta la griglia da 128 e l'acqua si legge
 * come un motivo stampato. È lo stesso difetto che in Lantern si era già visto
 * sull'erba, dove «il tiling era un hash riusato».
 */
export const GLSL_ACQUA_CAMPO_RICCO = `
  vec4 acquaLargo = texture2D(uTratto, acquaUv * 0.31);
  vec2 acquaDeriva = (acquaLargo.ga - 0.5) * uAcquaMis.z;
  vec4 acquaCampo = texture2D(uTratto, acquaUv + acquaDeriva);
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
 */
export const GLSL_ACQUA_UV = `
  float acquaTipo = vAcqua.z;
  float acquaScorre = step(0.5, length(vAcqua.xy));
  float acquaSuMuro = step(1.5, acquaTipo) * step(acquaTipo, 2.5);
  float acquaScivolo = step(2.5, acquaTipo) * step(acquaTipo, 3.5);
  float acquaLungoZ = step(0.5, abs(normalW.x));
  vec2 acquaUvPelo = vAcquaPos.xz;
  vec2 acquaUvMuro = vec2(vAcquaPos.y, mix(vAcquaPos.x, vAcquaPos.z, acquaLungoZ));
  vec2 acquaUvFerma = mix(acquaUvPelo, acquaUvMuro, acquaSuMuro) * uAcquaMis.x;
  vec2 acquaVersoCalmo = vec2(0.013, 0.009);
  vec2 acquaVersoCorrente = normalize(vAcqua.xy + vec2(1e-5)) * uAcquaMis.y;
  vec2 acquaVersoMuro = vec2(-uAcquaMis.y * 3.2, 0.0);
  vec2 acquaVersoPelo = mix(acquaVersoCalmo, acquaVersoCorrente, acquaScorre);
  vec2 acquaVerso = mix(acquaVersoPelo, acquaVersoMuro, acquaSuMuro);
  vec2 acquaUv = acquaUvFerma - acquaVerso * uTempo;
`;

/**
 * IL COLORE, e ogni riga qui è un GRADINO.
 *
 * ── il bassofondo ──
 * Nelle referenze la profondità non si legge come trasparenza: si legge come
 * COLORE — turchese chiaro dove è basso, blu pieno dove è fondo. Roystan lo
 * ricava dal depth buffer; noi abbiamo `vRiva.x`, cioè quanto è lontana la
 * sponda, che il mesher ha già contato. Non è la stessa grandezza — è la
 * distanza in pianta, non la profondità — ma è quella che SI VEDE: la fascia
 * chiara che abbraccia gli scogli nella seconda immagine è esattamente questo.
 * E costa zero.
 *
 * ── i tratti, e perché la soglia RESPIRA ──
 * Tagliare un campo che scorre dà losanghe che passano e basta. Muovendo anche
 * la SOGLIA le losanghe si allungano e si accorciano mentre passano, cioè
 * nascono e muoiono: è quella la differenza fra dell'acqua e una tessitura che
 * scivola sotto. Costa un seno.
 *
 * ── la schiuma, e il caso che rovina tutte le soglie ──
 * ⚠ `vRiva.y` (quanto è aperto lo specchio) non è un lusso, è la riga che rende
 * sicura tutta l'operazione, e il mesher la calcola apposta: in un canale largo
 * UNA cella tutti e quattro gli angoli toccano una sponda, quindi la distanza
 * vale zero su tutta la cella e qualunque soglia generosa dipingerebbe il
 * canale di bianco pieno. È già successo, ed è il motivo per cui a suo tempo la
 * soglia venne alzata fino a spegnere quasi tutta la schiuma.
 *
 * ⚠ E IL BORDO SI ROMPE COL CAMPO DELLE CHIAZZE. Una soglia nuda su una
 * distanza dà una curva di livello, e una curva di livello si riconosce a colpo
 * d'occhio come una curva di livello: viene una cornice, non della schiuma.
 *
 * ── il labbro dei gradini ──
 * Una cascata di Leafy è una scala di cubi. Dove l'acqua scavalca lo spigolo si
 * accende una riga bianca, e senza quella riga la parete si legge come un muro
 * dipinto di blu. `fract` sulla quota dà lo stesso segno su ogni gradino senza
 * che nessuno debba dirgli dove sono — le celle stanno agli interi
 * (`cy = y + 0.5`, scatola alta uno).
 *
 * ── il Fresnel ──
 * ⚠ È IL SINGOLO INDIZIO CHE FA LEGGERE UNA SUPERFICIE COME ACQUA. A picco si
 * guarda DENTRO; radente diventa specchio del cielo. A rampa sarebbe fuori
 * stile, quindi è un salto solo — e nella prima immagine di riferimento infatti
 * si vede proprio così: una riga netta dove il mare cambia tono.
 * E il cielo lo prende dal cielo VERO (`uCielo`, legato al colore di sfondo),
 * quindi al tramonto l'acqua vira arancione da sola, senza una riga in più.
 */
export const GLSL_ACQUA_COLORE = `
  float acquaBasso = step(vRiva.x, uAcquaMis.w);
  acquaTinta = mix(uAcquaFonda, uAcquaBassa, acquaBasso);
  acquaAlfa = mix(uAcquaAlfa.x, uAcquaAlfa.y, acquaBasso);
  float acquaRespiro = sin(uTempo * 0.9 + vAcquaPos.x * 0.21 + vAcquaPos.z * 0.17);
  float acquaSoglia = uAcquaTagli.x - uAcquaTagli.y * acquaRespiro;
  acquaTinta = mix(acquaTinta, uAcquaChiara, step(acquaSoglia, acquaCampo.r));
  float acquaLargh = uAcquaTagli.z * smoothstep(0.15, 0.55, vRiva.y);
  float acquaSchiuma = step(vRiva.x, acquaLargh * (0.55 + 0.9 * acquaCampo.a));
  acquaSchiuma = max(acquaSchiuma, acquaScivolo * step(uAcquaTagli.x - 0.16, acquaCampo.r));
  acquaSchiuma = max(acquaSchiuma, acquaSuMuro * step(uAcquaTagli.x - 0.10, acquaCampo.r));
  acquaSchiuma = max(acquaSchiuma, acquaSuMuro * step(0.80, fract(vAcquaPos.y)));
  acquaTinta = mix(acquaTinta, uSchiuma, acquaSchiuma);
  acquaAlfa = mix(acquaAlfa, uAcquaAlfa.z, acquaSchiuma);
  float acquaRadente = 1.0 - abs(dot(normalW, viewDirectionW));
  float acquaSpecchio = step(uAcquaTagli.w, acquaRadente * acquaRadente * acquaRadente);
  acquaSpecchio = acquaSpecchio * (1.0 - acquaSuMuro) * (1.0 - acquaSchiuma);
  acquaTinta = mix(acquaTinta, uCielo, acquaSpecchio);
  acquaAlfa = mix(acquaAlfa, uAcquaAlfa.z, acquaSpecchio);
`;

/**
 * IL BRILLIO — sole, luna, e le lampade che scintillano nella loro pozza.
 *
 * ⚠ NON È UN RIFLESSO CALCOLATO, ED È UNA SCELTA. Uno specchio vero vorrebbe la
 * scena ridisegnata: in Lantern erano 11,1 ms, il secondo picco del fotogramma.
 * Quello che di un riflesso si VEDE su un'acqua toon, però, non è la scena — è
 * dove il sole colpisce. E dove il sole colpisce è un conto analitico: si
 * riflette lo sguardo attorno alla normale e lo si confronta col verso del
 * sole. Quattro istruzioni contro una passata intera.
 *
 * ⚠ E POI SI TAGLIA, due volte. Il lobo dà DOVE può esserci luccichio; il campo
 * delle scintille dà QUALI granelli si accendono lì dentro. È la composizione
 * che fa la strada di losanghe bianche della prima immagine: senza il secondo
 * taglio verrebbe una macchia luminosa continua, cioè un faro riflesso, che è
 * proprio la cosa semi-realistica che qui è stata bocciata.
 *
 * ⚠ LA LUNA PORTA LA SUA FASE. `world/astro.js` la calcola già (con le tre
 * perturbazioni, «o le fasi si sfasano di ore»): a luna piena l'acqua ha la sua
 * strada d'argento, a luna nuova non ha niente. È vero, ed è gratis.
 *
 * ⚠ E LE LAMPADE SCINTILLANO SENZA COSTARE NIENTE. `lampade` è già in ambito
 * qui: è il numero che l'accumulo delle luci ha appena finito di comporre.
 * Moltiplicarne una parte per il campo delle scintille dà la colonna tremolante
 * di un lampione sull'acqua — la pozza resta dov'era, e sopra ci si accende la
 * polvere di luce. Zero letture, zero uniform, una moltiplicazione.
 */
export const GLSL_ACQUA_BRILLIO_RICCO = `
  vec3 acquaRifl = reflect(-viewDirectionW, normalW);
  float acquaLobo = max(dot(acquaRifl, -normalize(uSoleVerso)), 0.0);
  float acquaLoboLuna = max(dot(acquaRifl, -normalize(uLunaVerso)), 0.0);
  acquaScintilla = step(uBrillio.w, acquaCampo.b);
  acquaBrillio = pow(acquaLobo, uBrillio.y) * uBrillio.x;
  acquaBrillio = acquaBrillio + pow(acquaLoboLuna, uBrillio.y) * uBrillio.z * uLunaFase;
  acquaBrillio = acquaBrillio * acquaScintilla * (1.0 - acquaSchiuma);
`;

/**
 * IL BRILLIO, versione povera: solo il sole, e niente scintilla delle lampade.
 * Su mobile le lampade con ombra sono già spente per intero (vedi qualita.js):
 * farle scintillare sarebbe l'unico posto dove tornerebbero a costare.
 */
export const GLSL_ACQUA_BRILLIO_POVERO = `
  vec3 acquaRifl = reflect(-viewDirectionW, normalW);
  float acquaLobo = max(dot(acquaRifl, -normalize(uSoleVerso)), 0.0);
  acquaScintilla = 0.0;
  acquaBrillio = pow(acquaLobo, uBrillio.y) * uBrillio.x * step(uBrillio.w, acquaCampo.b);
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
  // quanto è più chiaro il bassofondo rispetto al fondo (verso il bianco)
  bassofondo: 0.34,
  // quanto sono più chiari i tratti sul pelo
  tratti: 0.20,
  // la schiuma non è bianca pura: un bianco puro in un mondo di tinte piatte si
  // stacca come un buco. È l'acqua chiarissima.
  schiuma: 0.80,
  // (scala del disegno, velocità della corrente, forza della deriva, soglia del bassofondo)
  mis: [0.16, 0.09, 0.055, 0.34],
  // (soglia dei tratti, quanto respira, larghezza della schiuma, soglia dello specchio)
  tagli: [0.60, 0.10, 0.42, 0.62],
  // (alfa sul fondo, alfa sul bassofondo, alfa di schiuma e specchio)
  alfa: [0.86, 0.62, 1.0],
  // (forza del sole, durezza del lobo, forza della luna, soglia delle scintille)
  brillio: [1.15, 22.0, 0.30, 0.66],
};

/** Schiarisce una tinta verso il bianco di `k` (0 = com'era, 1 = bianco). */
function schiarisci(hex, k) {
  const r = ((hex >> 16) & 255) / 255, g = ((hex >> 8) & 255) / 255, b = (hex & 255) / 255;
  return new Color3(r + (1 - r) * k, g + (1 - g) * k, b + (1 - b) * k);
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
  constructor(rig, { ricca = true } = {}) {
    this.rig = rig;
    this.ricca = ricca;
    const pal = BLOCCHI.acqua;

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

    // le uniform: OGGETTI e poi si mutano, come vuole CustomMaterial (rilega a
    // ogni disegno leggendo da una mappa interna: passando valori si
    // allocherebbe per fotogramma, passando oggetti no)
    this.uMis = new Vector4(...REGOLE.mis);
    this.uTagli = new Vector4(...REGOLE.tagli);
    this.uAlfa = new Vector3(...REGOLE.alfa);
    this.uBrillio = new Vector4(...REGOLE.brillio);
    this.uFonda = schiarisci(pal.cima, 0);
    this.uBassa = schiarisci(pal.cima, REGOLE.bassofondo);
    this.uChiara = schiarisci(pal.cima, REGOLE.tratti);
    this.uSchiuma = schiarisci(pal.cima, REGOLE.schiuma);
    this.uCielo = new Color3(0.561, 0.827, 1.0);
    this.uLuna = new Vector3(0, -1, 0);

    this.materiale = this._materiale();
  }

  _materiale() {
    const m = new CustomMaterial('acqua', this.rig.scena);
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
    m.AddUniform('uTratto', 'sampler2D', this.texture);
    m.AddUniform('uAcquaMis', 'vec4', this.uMis);
    m.AddUniform('uAcquaTagli', 'vec4', this.uTagli);
    m.AddUniform('uAcquaAlfa', 'vec3', this.uAlfa);
    m.AddUniform('uBrillio', 'vec4', this.uBrillio);
    m.AddUniform('uAcquaFonda', 'vec3', this.uFonda);
    m.AddUniform('uAcquaBassa', 'vec3', this.uBassa);
    m.AddUniform('uAcquaChiara', 'vec3', this.uChiara);
    m.AddUniform('uSchiuma', 'vec3', this.uSchiuma);
    m.AddUniform('uCielo', 'vec3', this.uCielo);
    m.AddUniform('uLunaVerso', 'vec3', this.uLuna);
    m.AddUniform('uLunaFase', 'float', 0);

    m.Vertex_Definitions(`
      attribute vec3 aAcqua;
      attribute vec2 aRiva;
      varying vec3 vAcqua;
      varying vec2 vRiva;
      varying vec3 vAcquaPos;
    `);
    m.Vertex_Before_PositionUpdated(GLSL_ACQUA_VERTICE);

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
    applicaStilePiatto(m, this.rig, 'acquaTinta', {
      alfa: 'acquaAlfa',
      luceExtra: 'vec3(acquaBrillio * sole) + lampade * acquaScintilla * 0.9',
    });
    aggiungiDefinizioniFragment(m, GLSL_ACQUA_DEFINIZIONI);
    m.Fragment_Custom_Diffuse(GLSL_ACQUA_UV + campo + GLSL_ACQUA_COLORE + brillio);
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
  anima(t) {
    this.materiale._newUniformInstances['float-uTempo'] = t;
    // IL CIELO VERO, non una costante: al tramonto l'acqua vira con lui, e la
    // riga in più che servirebbe a farlo non esiste perché il colore di sfondo
    // È il cielo (vedi `stile.js`, «clearColor non passa da nessuno shader»).
    const cielo = this.rig.scena.clearColor;
    this.uCielo.set(cielo.r, cielo.g, cielo.b);
    if (this.rig.lunaVerso) {
      this.uLuna.copyFrom(this.rig.lunaVerso);
      this.materiale._newUniformInstances['float-uLunaFase'] = this.rig.lunaLuce || 0;
    }
  }
}

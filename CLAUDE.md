# Leafy-Shadows — guida per chi tocca il codice (umani e Claude)

Il motore grafico di **Leafy-Lantern** rifatto su **Babylon.js 9 + Havok**, in
**zero-build** (import map → `node_modules`), tutto in **italiano** (nomi,
commenti, UI, commit).

**Il gioco non è stato riscritto: è stato riscritto lo STRATO DI RESA.** Mondo,
salvataggi, interfaccia, multiplayer, furniture e meccaniche vengono da Lantern e
restano com'erano — 34.400 righe su 44.660. Qui si rifanno le 10.300 che
disegnavano.

⚠ **Il progetto di prima è vivo e giocabile**: `progetti/Lantern`, tag
`v1.0-three`, online su https://dakrigh.github.io/leafy-lantern/ — è il punto di
ritorno e il termine di paragone. Ogni volta che qui si dice «è meglio», il
confronto si fa con quello, con un numero.

## Perché esiste questo progetto

Misurato su Lantern, 3.026 fotogrammi di sessione vera: la mediana del disegno
era **1,64 ms** (sanissima) e i picchi arrivavano a **19,1 ms**. Non andava
piano: **singhiozzava**. E la causa dei picchi era quasi tutta roba nostra —
ombre scritte a mano, istanziamento a mano, culling spento, nessuna fisica.

La domanda che ha deciso la migrazione non era «quale libreria è più veloce», ma:
**accettiamo il modello di illuminazione di un motore, rinunciando a un po' del
controllo sul look piatto, in cambio di ombre, culling, istanziamento e fisica
mantenuti da altri?** La risposta è sì. Se un giorno si torna indietro su quella,
metà delle ragioni di stare qui cadono.

## Avvio
- Dev: `python3 serve.py 8144` → http://localhost:8144
- **Lo ZOO: http://localhost:8144/zoo.html** — dieci piazzole, una per difetto
  (acne, ombre, luci, lampade con ombra e senza, forme delle luci, particelle,
  distanza e LOD, erba, modelli, ciclo del giorno). Online insieme al gioco su
  https://dakrigh.github.io/leafy-shadows/zoo.html
  ⚠ **Ogni difetto grafico si cerca LÌ, non nel mondo vero.** Prima dello zoo
  ogni volta bisognava costruire la scena giusta a mano, e spesso si finiva per
  misurare la cosa sbagliata perché la scena non isolava niente.
- Prove: `npm test`
- **`I` apre l'Inspector** (si carica a richiesta: è una dipendenza di sviluppo,
  6,8 MB, e non deve finire nel gioco pubblicato).

## La regola della casa, quella che viene prima di tutte

> **Fuori da `src/motore/` non si nomina Babylon.**

In Lantern lo strato di resa era three sparso ovunque, e cambiare motore voleva
dire toccare quaranta file. Misurato prima di partire: `src/world/` — griglia,
chunk, acqua, worldgen, stagioni, 4.310 righe — usava del motore **otto nomi in
tutto**. Il resto era già agnostico e non lo sapeva nessuno.

Quindi:
- `src/world/` produce **array grezzi** (`Costruttore.dati()`) e non sa cosa sia
  una mesh. Si può importare in Node senza contesto grafico, ed è così che si
  provano le sue regole.
- `src/motore/fabbrica.js` è **l'unico ponte**: dati grezzi → mesh. Finché sta
  sotto le duecento righe, cambiare motore è un pomeriggio.
- `src/motore/motore.js` è l'unico che crea Engine, Scene, camera, luci, ombre.

Il mondo riceve la fabbrica per iniezione (`collegaFabbrica`), e va collegata
**prima** di toccare il mondo: se no il `null` esce lontano da dove è il difetto.

## LO STILE: piatto, e l'ombra è un gradino

⚠ **La correzione più importante della migrazione**, e l'ha fatta il committente
guardando: *«non esiste un colore diverso da ombra o non in ombra, mentre ora le
facce ottengono luce e ombre in modo semi realistico»*.

Accettare il modello del motore vuol dire accettare come **calcola** l'ombra — la
mappa a cascata, che è il motivo per cui abbiamo cambiato libreria. **Non** vuol
dire accettare come la **dipinge**. Con lo StandardMaterial nudo ogni faccia
prende il suo N·L: cima chiara, fianchi degradanti, rampa continua col sole che
gira. Rendering corretto, stile sbagliato.

Lo stile di Leafy, che è una decisione e non una mancanza:
- **colori piatti da palette.** Lo stacco fra le facce lo dà GIÀ `coloreFaccia()`
  scegliendo cima/lato/fondo: è quello il volume, cotto nei vertici dal mesher.
  In Lantern un tentativo di aggiungere ombreggiatura per normale + occlusione
  ambientale **è stato bocciato** (`git show b540f50` nel repo di Lantern).
- **l'ombra è un gradino** (`BANDE = 3`), non una rampa;
- **l'ombra non è nera, è del colore del cielo**: scurisce *e vira* insieme.
  Moltiplicare per un grigio appiattisce; moltiplicare per un colore no.

**Come si ottiene, in un motore che vuole illuminare** (`src/motore/stile.js`) —
il trucco è una riga, e sta nel fatto che di tutto il calcolo della luce a noi
serve **un numero solo**: sì/no all'ombra.

```glsl
// Fragment_Before_Lights
normalW = normalize(-uSoleVerso);   // N·L = 1 su OGNI faccia
```

Da lì il motore, che continua a fare il suo mestiere, accumula in `diffuseBase`
**esattamente il fattore d'ombra** della cascata e nient'altro. Poi lo si taglia
a gradini e lo si dipinge come vuole Leafy. Il motore calcola l'ombra; noi la
dipingiamo.

⚠ E **niente luce emisferica**: sembrava il modo di avere «il cielo che
rischiara», ma è un secondo termine dentro lo stesso accumulo da cui leggiamo
l'ombra — sporcherebbe il numero. L'ambiente qui è un **colore che moltiplica**,
non una luce.

⚠ **La normale vera continua a servire alla mappa**: lo scostamento per normale
si applica nel *vertex* shader, prima che il fragment la sostituisca.

## Gotcha già pagati (non ricascarci)

- ⚠ **L'AVVOLGIMENTO DEI TRIANGOLI VA GIRATO** (`fabbrica.scrivi`). Il mesher
  scrive antiorario (convenzione three); Babylon li considera tutti «di dietro».
  Due sintomi che sembrano difetti diversi e sono lo stesso: il culling butta
  OGNI faccia e si vedono gli **interni** del terreno (una distesa grigia con le
  terrazze viste da sotto), e `ComputeNormals` ricava la normale
  dall'avvolgimento quindi esce puntata all'ingiù e **la luce non prende
  niente**. Non basta `scene.useRightHandedSystem`: quello raddrizza matrici e
  camera, non il verso con cui si legge un triangolo.
- ⚠ **`receiveShadows` è FALSO di fabbrica sulla mesh.** Con il solo
  `addShadowCaster` la mappa si riempie, il costo si paga, e a schermo non cambia
  niente: il terreno col sole a 17° non aveva **una sola ombra**. Difetto muto —
  nessun errore, nessun avviso, solo un'immagine sbagliata che sembra giusta.
- ⚠ **Con gli import profondi gli shader vanno importati a mano.** Babylon
  registra i sorgenti dei materiali come effetti collaterali di moduli separati:
  col barile arrivano da soli, con `@babylonjs/core/Materials/standardMaterial.js`
  no, e si scopre a runtime con «effect is not ready». Vedi le righe
  `import '@babylonjs/core/Shaders/...'` in `motore.js` e `fabbrica.js`.
  Si importa in profondità perché `index.js` tira dentro **2.224 moduli**, cioè
  2.224 richieste al server di sviluppo.
- ⚠ **`captureGPUFrameTime` vuole due estensioni caricate a mano**
  (`Engines/AbstractEngine/abstractEngine.timeQuery.js` e
  `Engines/Extensions/engine.query.js`), se no muore con «is not a function».
- ⚠ **Il p50 del fotogramma è VSYNC, non il nostro costo.** 13,3 ms identici con
  quattro cascate, con due, e con **zero proiettanti**: è il tetto del pannello.
  Il numero onesto lo danno `SceneInstrumentation.frameTimeCounter` e
  `renderTargetsRenderTimeCounter`. È lo stesso errore che in Lantern mi ha fatto
  dire «va bene» per una giornata mentre il committente sentiva gli scatti.
- ⚠ **`useLargeWorldRendering` si decide alla CREAZIONE del motore.** Porta le
  matrici a 64 bit e accende l'origine mobile su tutte le scene — cioè cambia il
  significato delle coordinate dentro gli shader. Accenderla a materiali scritti
  vorrebbe dire ri-verificarli tutti, quindi è accesa da subito. **E costa**: va
  misurata, non data per buona.

### ⚠ DENTRO IL GLSL INNESTATO I COMMENTI NON SONO INERTI (fase 3)
Tre difetti in una giornata, tutti nati in una riga di **commento** dentro un
innesto di `CustomMaterial`, e tutti e tre **muti**: il materiale non diventava
mai pronto, la mesh spariva, e in console non c'era niente. Centomila istanze
corrette, dati corretti, schermo vuoto.
1. un **backtick** chiude il template JS (nove volte fra i due progetti);
2. un'**espressione andata a capo** si rompe — il processore di shader di
   Babylon lavora riga per riga (`0:320: '?' : syntax error`, su un ternario);
3. una **direttiva di inclusione** scritta per esteso viene **eseguita**: il
   preprocessore la cerca con una regex su tutto il testo. Il mio commento
   citava per nome l'inclusione delle istanze e me l'ha espansa dentro la
   variante NON istanziata, dove `world0..world3` non esistono.

`test/glsl-backtick.test.mjs` e `test/glsl-una-riga.test.mjs` li presidiano.
⚠ E l'errore vero **non** è in `forceCompilation` (che rispondeva «ok»): sta in
`subMesh.effect.getCompilationError()`.

### ⚠ L'ACNE SI CURA CON LA SOGLIA, NON COL BIAS
L'acne nasce dove la superficie è quasi **parallela** ai raggi: lì la profondità
in spazio-luce varia di tantissimo dentro un texel e nessuno scarto costante la
copre. Con lo stile piatto si vede il doppio, perché non c'è nessuna sfumatura
a nasconderla.

⚠ **Alzare `normalBias` è la cura sbagliata.** Sposta il campione lungo la
normale di chi riceve: vicino al bordo di un'ombra quel campione esce da sotto
l'occlusore e si accende una **lineetta** sul contorno. Provato, e il committente
l'ha vista subito — «è come se prendesse lo sbalzo del blocco d'erba e ci
passasse la luce».

**La cura viene dallo stile**: la banda dove nasce l'acne è *la stessa* dove la
luce radente non vuol dire niente. Una faccia colpita di striscio, in Leafy, non
è «un po' illuminata» — o vede il sole o no. Quindi `facciaAlSole` usa una
**soglia di 0,12** invece di zero, e il difetto sparisce per costruzione, gratis.
⚠ Non più di 0,12: il terreno piatto col sole al minimo ha un prodotto scalare di
0,225, e una soglia più alta all'alba spegnerebbe il mondo intero.

E le altre due manopole che contano davvero, tutte e due sulla **risoluzione**:
`lambda` vicino a 1 (tessitura densa dove si guarda) e `shadowMaxZ` corto — ogni
metro che si pretende di ombreggiare toglie texel a quelli vicini. Col sole a
sei gradi le cascate si stirano e il bordo diventa una scalinata: per questo il
sole non scende sotto i **14°** (`ALTEZZA_MIN` in `giorno.js`).

### ⚠ MODELLI: proiettano ma NON ricevono
Una chioma è una pila di coni: se riceve la propria ombra i piani bassi vanno al
buio e l'albero esce mezzo nero. In Leafy il fogliame è tinta piatta.
⚠ E `facce: false` per i modelli e per l'erba: il termine «faccia al sole» è la
verità geometrica su un CUBO, non su piani incrociati né su un filo d'erba — la
cui normale, per giunta, dipende da quanto il vento lo sta piegando.
⚠ E l'origine di un `.glb` **non sta sui piedi**: si sposta l'array delle
posizioni, non la mesh — con le thin instance la matrice locale non ha più voce.

### ⚠ I CONTI DELLA LUCE SI FANNO IN SPAZIO LINEARE
**Babylon scrive lineare in framebuffer; three.js codifica in sRGB.** Misurato
con un ingresso noto: col cielo a (0,561 0,827 1,000) il pixel esce
(143, 211, 255), cioè il valore per 255 esatto. Le costanti tarate su Lantern
(ambiente, tinta dell'ombra, colori delle lampade) vivono quindi in un altro
spazio, e trapiantarle tali e quali dà tutt'altra immagine.

Per una **moltiplicazione** la differenza è solo un esponente (moltiplicare per
k in lineare = moltiplicare per k^(1/2,2) in visualizzazione). Per una **somma**
non c'è equivalente: due pozze di lampada sommate su valori già compressi
saturano e sbiancano. Quindi `stile.js` fa come three — decodifica, calcola,
ricodifica — e le costanti di Lantern valgono **letterali**.
⚠ I due esponenti devono restare l'uno l'inverso dell'altro, o la nebbia
all'orizzonte smette di combaciare col cielo (`clearColor` non passa da nessuno
shader). `test/gamma-coerente.test.mjs` lo presidia, insieme alla gamma gemella
in `luci.js` (importarla creerebbe un anello).

### ⚠ LE LAMPADE PROIETTANO OMBRA, e la griglia era già qui
`world/luce.js` costruisce la griglia dei muri, `world/mesher.js` la ricostruisce
quando il mondo cambia e chiama `fabbrica.impostaVoxel`. Erano **stub vuoti**
dalla migrazione: il sistema girava, misurava 275.427 celle in 18 ms, e buttava
via il risultato — le pozze passavano attraverso l'isola e con tredici lampioni
la notte diventava giorno. Adesso la griglia va in una `RawTexture3D` e il
fragment la cammina (Amanatides-Woo). Il bordo cade **al pixel** sullo spigolo
del cubo: niente mappa, niente bias, niente acne.
- ⚠ `sampler3D` vuole la precisione dichiarata (`highp sampler3D`): in GLSL ES
  3.0 non ne ha una di fabbrica, e `AddUniform` scrive la riga in TUTTI E DUE
  gli shader — quindi l'errore arriva dal **vertex**, che la texture non la
  tocca nemmeno.
- ⚠ Il costo: a risoluzione doppia con 16 lampade da raggio 30 a schermo pieno,
  **5,4 ms**. A raggio 8,5 non si misura. Si paga solo dentro la pozza e solo
  per le lampade *pesanti*.
- Due classi, come in Lantern: **pesante** cammina la griglia, **leggera**
  trapassa e costa una distanza (fuochi fatui, effetti).

### ⚠ NIENTE NOMI DI UNA LETTERA NEL GLSL INNESTATO
Babylon, nel blocco della nebbia, emette `#define E 2.71828`. Il preprocessore
non conosce ambiti: una variabile locale chiamata `E` è diventata
`vec3 2.71828 = …`, schermo vuoto e un errore di sintassi su un numero mai
scritto. Il nostro codice vive in mezzo a duemila righe altrui piene di macro.
⚠ E le prove sul GLSL **non l'avrebbero preso**: cercavano solo gli innesti
scritti sul posto (`Fragment_*(\`…\`)`), mentre il GLSL più delicato del
progetto vive in **costanti esportate**. Adesso l'estrattore è condiviso.

### ⚠ `Fragment_Definitions` È UN SETTORE, NON UN ACCUMULATORE
`prato.js` lo chiamava dopo `applicaStilePiatto` e cancellava il cammino nella
griglia, lasciando in piedi la chiamata: errore su **un materiale solo**, l'erba,
mentre il mondo compilava. Si passa da `aggiungiDefinizioniFragment` (stile.js),
e una prova presidia che nessuno lo chiami più a mano.

### ⚠ FERMARE UN SISTEMA DI PARTICELLE NON LO FERMA
Dalla documentazione di Babylon: `isStarted()` «will still be true after stop is
called», e su GPU «rendering is still happening but the system is frozen». Il
meccanismo vero sta nel sorgente della scena — un sistema è attivo se
`isStarted() && (!emitter.position || emitter.isEnabled())`: con un `Vector3`
come emittente la prima è sempre vera e la seconda non si valuta mai. Con una
**mesh vuota** come emittente, `setEnabled(false)` lo toglie dall'aggiornamento
e dal disegno.
⚠ E `GPUParticleSystem.IsSupported` risponde sì anche senza aver importato
`Particles/webgl2ParticleSystem.js`: dice che la scheda regge, non che il codice
sia caricato. Stessa famiglia della trappola degli shader.

### ⚠ ALTRE TRAPPOLE DI BABYLON già pagate
- **`thinInstanceBufferUpdated` spedisce l'INTERO array**, cioè il tetto. Con
  buffer allocati a 500.000 e 101.698 istanze vive: **12,4 ms**. La variante
  giusta è `thinInstancePartialBufferUpdate(kind, n, 0)`. ⚠ È **la stessa
  trappola di three** (`addUpdateRange`) su un altro motore e con un altro nome:
  il carico parziale è sempre da chiedere, e il difetto non dà nessun segnale.
- **La matrice delle thin instance è obbligatoria ma non deve costare.** Serve
  solo perché `thinInstanceCount` si tara su `matrixData.length/16`. Usarla come
  portatrice della posizione sembra furbo e non lo è: sono 16 float per istanza
  (6,5 MB dei 10,5 per semina) per portare tre numeri che stanno già in `iPos`.
  Qui resta **identità, statica, caricata una volta**.
- **`world0..world3` esistono solo dentro `#ifdef INSTANCES`**, e Babylon compila
  anche la variante non istanziata: meglio non dipenderne affatto.
- **`CustomMaterial` non è uno `ShaderMaterial`**: niente `setFloat`. Le uniform
  nostre stanno in una mappa interna e vengono rilegate a ogni disegno — si
  passano OGGETTI e poi si mutano (zero allocazioni per fotogramma).
- **L'Inspector v2 è React, e React su npm è CommonJS**: una import map non lo
  carica. Si impacchetta una volta con `npm run ispettore` → `vendor/`, tenendo
  `@babylonjs/core` **esterno** (se no l'ispettore guarda una scena che non è la
  nostra). Il gioco resta zero-build.

## Cosa è già cambiato in meglio, con i numeri

| | Lantern (three, a mano) | Shadows (Babylon) |
|---|---|---|
| ombre del sole | 1.090 righe nostre, mappa 2048² ricostruita 11 volte al secondo, picco 3,8 ms | `CascadedShadowGenerator`, 4 cascate **ogni fotogramma**, **1,4 ms** |
| culling | l'erba lo aveva **spento** (`frustumCulled = false`) | 30 mesh attive su 98, di serie |
| normali | non esistevano (unlit) | piatte gratis: il mesher non condivide i vertici |
| materiale del mondo | 2.839 righe di shader iniettato | sei righe di `StandardMaterial` |
| erba: costo a schermo | — | **0,18 ms** per 101.698 lamelle |
| erba: lo scambio | 3,6 ms (8,1 prima di `addUpdateRange`) | **0,8 ms** |
| erba: lo shader | 346 righe di GLSL | 40, e solo il vento — luci, ombre e nebbia le fa il motore |

## Si gioca
Sinistro rompe, destro posa, centrale copia il blocco guardato; 1-9 e R
scelgono; virgola e punto muovono l'ora, P ferma il ciclo. Posare una lampada
l'accende — il blocco **dichiara** la sua luce in `world/blocks.js`, qui non
c'è nessun elenco di cosa illumina.
⚠ Il raggio lo calcola Babylon (`CreatePickingRay`), la **griglia la camminiamo
noi** (`gioco/mira.js`): `scene.pick` dovrebbe intersecare centomila triangoli
per dire quale cubo si sta guardando, il DDA ci arriva in dieci passi e dà anche
la faccia. ⚠ E l'origine del raggio si prende dalla camera, non dal raggio:
l'origine mobile toglie la traslazione dalla matrice di vista.
⚠ Il **braccio** non è il **raggio**: in vista a diorama il raggio parte dalla
camera, venticinque blocchi indietro. Con sette di portata non arrivava
nemmeno al terreno, e il mirino era sempre spento.

## Da fare, in ordine
Vedi `docs/PIANO.md`. La fase 1 (scheletro + terreno vero a schermo) è **fatta**.

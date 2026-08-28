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

## Da fare, in ordine
Vedi `docs/PIANO.md`. La fase 1 (scheletro + terreno vero a schermo) è **fatta**.

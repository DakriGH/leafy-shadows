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
- **Lo ZOO: http://localhost:8144/zoo.html** — undici piazzole, una per difetto
  (acne, ombre, luci, lampade con ombra e senza, forme delle luci, particelle,
  distanza e LOD, erba, modelli, ciclo del giorno, **acqua**). Online insieme su
  https://dakrigh.github.io/leafy-shadows/zoo.html
  ⚠ **Ogni difetto grafico si cerca LÌ, non nel mondo vero.** Prima dello zoo
  ogni volta bisognava costruire la scena giusta a mano, e spesso si finiva per
  misurare la cosa sbagliata perché la scena non isolava niente.
- **Il BANCO DELL'ACQUA: http://localhost:8144/water.html** — dieci vasche
  (specchio aperto, spiaggia digradante, canali da 1/2/3 celle, pozzanghere
  minime, ruscello, cascata, sponde di materie diverse, scogli in mezzo, **salti
  da 1 a 8 blocchi**, **sorgente e livelli**) e **quaranta ricette** scambiabili
  a caldo, con i comandi a schermo.
  ⚠ Esiste perché scegliere uno stile non è guardare *una* scena: la stessa
  decisione va vista su tutte e otto insieme. Tre disegni di fila sono stati
  bocciati perché giudicati sullo specchio grande e illeggibili sul canale
  stretto. Il bottone **☀ verso il sole** non è un vezzo: il luccichio vive in
  una finestra stretta di azimut e da un'inquadratura a caso sembra rotto.
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

### ⚠ LE OMBRE A SCATTI E L'ACNE CHE RESTAVA (02/09/2026, dal cloud)

Il committente: «una cosa che odio sono le ombre a scatti e l'acne». Tre cause,
tre cure, nessuna è una manopola alzata.

- **Gli scatti erano una SCELTA, non un costo.** La firma di quiete (`main.js`,
  `firmaQuiete`) quantizzava il sole a 1/100 (≈ 0,6°) per far congelare la
  mappa anche col ciclo del giorno acceso. Ma il giorno dura cinque minuti: il
  sole fa 1,2° al secondo, la mappa si rifaceva ogni mezzo secondo e a ogni
  rifacimento TUTTE le ombre saltavano di un decimo di blocco a dieci blocchi
  d'altezza. Ora il quanto è 1/1000: lo decide lo SPOSTAMENTO dell'ombra (un
  centesimo di blocco, sotto il pixel), e la cadenza si adegua da sé alla
  velocità del sole — giorno veloce → mappa viva, ciclo spento → congelata.
  ⚠ Non si torna a un quanto largo per «far congelare di più»: si congela
  quando il sole è fermo, e basta.
- **Il passo `ombraOgni` è uno scatto anche lui**: a tre giri su trenta
  fotogrammi l'ombra del giocatore avanza ogni cento millisecondi. Desktop:
  1 sui primi tre gradini, 2 al quarto. Mobile: 2 sui primi due, 3 sotto. Il
  risparmio grosso da fermi lo fa il congelamento, non il passo.
- **L'acne del mondo si cura CAMBIANDO FACCIA** (`motore.js`, `ombreDalRetro`;
  `fabbrica.js`, `_ombraDalRetro`): la mappa d'ombra del mondo si disegna con
  le facce che il sole NON vede. Il mesher emette solo facce fra pieno e vuoto,
  quindi ogni rilievo è un guscio: la faccia illuminata non finisce nella mappa
  e non può farsi ombra da sola, a qualunque altezza del sole e con qualunque
  texel; la faccia di dietro sta sullo spigolo che fa la sagoma, quindi l'ombra
  non si stacca da terra; e la faccia di dietro, che sì fa acne con sé stessa,
  è già nera per `facciaAlSole`. ⚠ NON `forceBackFacesOnly`: è globale, e le
  chiome sono piani incrociati senza dietro — metà chioma sparirebbe
  dall'ombra. Si gira la cullatura mesh per mesh, negli osservatori
  `onBefore/AfterShadowMapRenderMeshObservable`, e la chiede solo chi ha un
  dietro chiuso. ⚠ Se un giorno il mesher emettesse geometria APERTA (un piano
  singolo, una tenda, un vetro a lastra) quella mesh NON deve avere il flag.
  Il bias resta 0,002 e il normalBias 0,006: servono ai modelli, che
  proiettano ancora con le facce davanti.

### ⚠ IL TELEFONO PAGA I DISEGNI, NON I PIXEL (rapporto 🩺 del 02/09, 10:53)

La prima build con R3 + ombre + `lago` sul Mali-G68: **30 fps piatti a q0**
(bloccato a mano), p50 33 ms, p99 105 ms, **109 disegni** — contro i 47
disegni della build da 87 fps del 31/08. Il verdetto del committente: «abbastanza
tremendo». La scala automatica, prima del blocco, era scesa 0 → 3 → 2 → 3 → 5.

Cosa aveva raddoppiato i disegni, senza toccare un pixel:
- `lago` come ricetta di partenza, e il profilo mobile q0 che le concedeva
  specchio (256²) e passata di rifrazione/profondità: **due liste di disegno
  intere in più** per fotogramma. Misurate su una RTX (361 disegni, 2,8 ms:
  gratis), mai sul Mali, dove ogni disegno è CPU del browser. Ora sul telefono
  l'acqua è pittura a ogni gradino (`acquaVera` 0, niente specchio): `lago`
  resta nel colore e nel moto, perde il riflesso vero.
- la mappa d'ombra viva col ciclo del giorno (quanto del sole 1/1000) a
  `ombraOgni` 2: ~25 disegni in più a giro. Tornato a 3 sui gradini mobili.

⚠ La regola da portarsi dietro: **una passata in più sul telefono non si giudica
dal lato in pixel** (256² è niente per la GPU) ma dalla lista che disegna. Se
una cosa costa disegni, sul Mali la si misura col 🩺 prima di concederla a q0.
⚠ E il p99 a 105 ms con p50 a 33 dice che c'è anche un lavoro a scatti (ogni
tanto un fotogramma da tre): da cercare col prossimo rapporto, con la scala
libera e una nota su cosa si stava facendo.

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

### ⚠ L'ACQUA: il mondo la calcolava già, e la buttavamo via
`world/mesher.js` scrive per ogni vertice d'acqua la **corrente**, il **tipo di
faccia** (0 calma · 1 pelo che scorre · 2 parete di cascata · 3 scivolo · 5
lato), quanto è **lontana la sponda** e quanto è **aperto** lo specchio — più i
punti delle correnti e degli impatti. `fabbrica.scrivi` caricava posizioni,
colori e normali **e basta**: `dati.acq` e `dati.riv` morivano sulla CPU a ogni
chunk. Nessun errore, nessun avviso — solo un'acqua che non poteva avere un
aspetto suo (era il materiale del mondo con `alpha = 0.72`) e un conto della
riva, 25 celle per cella d'acqua, pagato per niente.

⚠ **E QUINDI LA SCHIUMA NON COSTA UN PASS.** Lo shader di riferimento (Roystan)
la ricava dal **depth buffer**, perché in Unity l'acqua è un piano che non sa
cosa ha sotto. La nostra la sa per costruzione. Il depth servirà solo per le
cose **dinamiche** che galleggiano — e lì la strada è la silhouette dall'alto di
Lantern (un render delle sole sagome), non una passata di profondità.

**Lo stile: quattro tinte piatte, e le soglie vengono dai PERCENTILI.**
Committente: *«non è pulita come quelle delle reference»*. Il campo del
tratteggio sta quasi tutto attorno a 0,5 (p50 = 0,53): una soglia «a occhio» a
0,60 lascia passare **un terzo** della superficie, cioè macchie ovunque e zero
tinta piena. Le referenze sono l'opposto: grandi campi pieni con **pochi** segni.
Misurati sul campo vero (`tratteggio.js`, p08 0,17 · p86 0,77 · p97 0,89), le
soglie sono 0,22 / 0,79 / 0,87 → un decimo scuro, un ottavo chiaro, un
ventesimo bianco. ⚠ E il «respiro» della soglia scende con loro: ±0,10 su una
soglia al 92° percentile accende e spegne la superficie tutta insieme.

⚠ **IL FRESNEL È STATO TOLTO, e la sua storia vale più della sua assenza.**
«L'acqua non mi piace, è proprio brutta»: alle inquadrature del diorama la
soglia scattava su **tutta la pozza insieme** e l'acqua diventava una lastra
grigia piatta. Su uno specchio da dodici celle l'angolo di vista è quasi lo
stesso ovunque — un Fresnel a gradini vuole un **mare**, dove l'angolo cambia da
qui all'orizzonte. Se un giorno ci sarà, si riprende con la soglia sopra 0,80.

⚠ **IL BRILLIO VIVE IN UNA FINESTRA STRETTA DI AZIMUT, e tararlo guardando
altrove è tararlo al buio.** A forza 0,95 dalle inquadrature normali non si
vedeva niente (misurato: due scatti identici, brillio 8× contro 0, muovevano il
9% dei pixel con scarto medio 6/255 — granelli, non una strada); puntando la
camera **verso il sole** la pozza diventava bianca piena. E la parte che mancava
non erano le scintille: era la **strada larga**, tagliata a `BANDE` come
l'ombra. Le scintille la spezzano in losanghe; da sole non disegnano niente.

⚠ **LA LUNA SI SPEGNE DI GIORNO, e l'ho trovato nei numeri, non guardando.** A
mezzogiorno `lunaLuce` valeva 0,44 — la luna *era* in cielo, ed è
astronomicamente giusto. Ma due luccichii in direzioni diverse a mezzogiorno
sono un difetto che si nota senza saper dire cos'è. Si moltiplica per
`1 − soleLuce`.
⚠ E **`soleVerso` ha un pavimento a 14°**, quindi a mezzanotte punta ancora in
giù: uno shader che riflettesse solo il verso accenderebbe una strada di sole in
piena notte, da sottoterra. La forza vera è `rig.soleLuce`, dall'altezza VERA.

⚠ **LA PARETE DI UNA CASCATA VUOLE DUE SCALE E NESSUN LABBRO.** Con una scala
sola i tratti escono alti e larghi uguale, cioè lastroni; e il «labbro» bianco
in cima a ogni cella (`fract` sulla quota) disegnava **la malta di un muro di
mattoni** — errore di concetto, perché il tipo 2 vuol dire «ho acqua sopra», cioè
*in mezzo* alla caduta, dove un labbro non esiste. Il labbro vero è già la
faccia in **pendenza** (tipo 3) che il mesher mette sul ciglio.
⚠ E sulla parete le coordinate si **scambiano** (quota in `u`): i tratti della
tessitura sono allungati lungo `u`, e senza lo scambio la cascata viene a bande
orizzontali.

**Il costo: NON è misurato, e va detto così.** Il banco di scatto gira su
Firefox headless, e lì `performance.now()` è arrotondato (una volta a 1 ms, in
un'altra passata non avanzava affatto): con l'acqua a schermo e senza, a 8,05
Mpixel, le due misure sono cadute una volta a 7→8 ms e una volta a 10→8 ms, cioè
dentro il rumore. Quello che si può dire è solo che **sta sotto il pavimento
della misura**. Va rifatto sulla macchina vera con `SceneInstrumentation`, che è
lo strumento giusto (`frameTimeCounter`), prima di scrivere un numero qui. La variante **mobile** è
un altro sorgente (verificato compilandolo e facendolo disegnare davvero: **una**
lettura invece di due, niente deriva, niente scintilla delle lampade) — non un
`if`, per la solita ragione dell'occupancy.

### ⚠ L'ACQUA HA TRE ASSI, e per un pezzo ne ho avuto uno solo
Committente: *«hai solo fatto un'acqua simil-Leafy con macchie diverse, non hai
creato nulla di nuovo»*. Aveva ragione: i dieci «stili» erano DECORAZIONI —
cambiavano il disegno sul pelo e passavano tutti dalla stessa identica legge
della luce. Dieci pitture su un materiale solo. Adesso gli assi sono quattro e
si combinano:

| asse | dove | cosa cambia |
|---|---|---|
| **disegno** (10) | `STILI` | i segni sul pelo: fragment |
| **luce** (6) | `MODELLI` | come la superficie reagisce al sole: la LEGGE |
| **geometria** (2) | `onde` | il pelo si muove davvero: vertex shader |
| **riflesso** (2) | `riflesso` | un pass in più |

E sopra i quattro assi ci sono le **`RICETTE`** (24): un pacchetto che sceglie
tutti e quattro *e* ritocca i numeri — colore, trasparenza, ampiezza delle onde,
larghezza della schiuma, lucentezza. ⚠ Le regole sono **per materiale**
(`this.R`), non costanti di modulo: con le costanti globali due acque vive
insieme litigherebbero sullo stesso oggetto, ed è la riga che rende possibili
venti acque diverse invece di venti varianti della stessa.
⚠ E ogni ricetta dice **cosa guardare**, non cosa imita: «come Animal Crossing»
fra sei mesi non serve, «si vede attraverso fino alla sabbia e la schiuma è un
nastro che respira» sì — è un'osservazione, e si può smentire guardando.

⚠ **`applicaStilePiatto` ha un aggancio per sostituire la legge della luce**
(`leggeLuce`), e apre la regola più difesa del progetto. La legge di casa resta
quella di fabbrica e nessuno la cambia per sbaglio; l'aggancio esiste perché
l'acqua è l'unica superficie del gioco che nella realtà fa proprio quello che lo
stile vieta — sfumare — e per poterlo *guardare* bisogna poterlo scrivere.

⚠ **LA NORMALE È LA CHIAVE DI TUTTI E SEI I MODELLI**, e si ricava
analiticamente dalla funzione d'onda (la derivata di una somma di seni è una
somma di coseni): due coseni, niente texture di normali. E vale **anche a onde
spente** — la geometria resta una lastra e la luce si comporta come se non lo
fosse.
⚠ E il **rilievo** della normale a 0,055 non serviva a niente: con la normale
quasi verticale N·L vale ~1 dappertutto e tutti e sei i modelli uscivano
IDENTICI. Una legge della luce si vede solo dove la luce ha di che variare.

### ⚠ L'ACQUA VERA: profondità, rifrazione, caustiche (la scala `vera`)
Committente: *«non sono per niente shader completi, vedo roba riciclata»* — e le
venticinque ricette erano davvero venticinque tarature dello stesso fragment.
Quello che distingue l'acqua di un gioco vero è che **legge il mondo**: adesso
c'è una scala a quattro gradini (`vera: 0..3`), caustiche ⇒ rifrazione ⇒
profondità, con le passate condivise sul RIG:

- **profondità** (`enableDepthRenderer` con `storeCameraSpaceZ`): lo SPESSORE
  d'acqua per pixel = Z della scena − Z del pelo, **con la stessa matrice di
  vista da tutt'e due le parti** (`uVista` legata viva ogni fotogramma) — così
  origine mobile e convenzioni sbagliano insieme o sono giuste insieme. Da lì:
  fondale vero (non più «distanza dalla sponda in pianta»), schiuma di contatto
  attorno a QUALSIASI cosa anche mobile, senza mesher.
  ⚠ L'acqua non entra nella propria mappa perché il suo materiale FONDE
  (alpha 0,9): portare l'alpha del materiale a 1 la farebbe entrare → spessore
  zero ovunque → schiuma piena. `color.a = 1` lo scrive il fragment, il
  materiale resta 0,9.
- **rifrazione**: la scena senza acqua né erba in un RTT 512², campionata in
  coordinate di schermo con l'offset dalla normale **scalato dallo spessore**
  (un dito d'acqua non deforma). ⚠ Il ripiego del bordo: se l'UV spostato pesca
  un pixel più VICINO del pelo (scoglio emerso) si torna all'UV dritto, o gli
  oggetti emersi «colano» dentro l'acqua. Assorbimento Beer-Lambert per canale,
  complementare della tinta: il fondo VIRA con la profondità, non scurisce.
- **caustiche**: dipinte sull'immagine rifratta (il mondo non sa niente), UV in
  mondo spostato dalla normale per lo spessore (parallasse povera), spente a
  spessore zero e nel profondo. ⚠ Il fattore giorno è `uAmbiente`, non `sole`:
  questi blocchi stanno in `Fragment_Custom_Diffuse`, PRIMA del ciclo delle
  luci — lì il fattore d'ombra non esiste ancora.

**Misurato** (1904×1130, vasca degli scogli): la pipeline intera (`cristallina`,
riflesso compreso) costa **+0,7 ms** rispetto a `casa` — col depth renderer
acceso in tutt'e due, perché una volta abilitato resta acceso. Su mobile la
scala è forzata a 0: non si compila proprio (`ricca`).

### ⚠ I MOTIVI DI FIRMA e i TALENTI dell'acqua
Committente: *«le noise sono tutte uguali — l'acqua di Animal Crossing deve
essere uguale al 99%»*, e la radice era vera: tutte le ricette pescavano dallo
STESSO campo di rumore. L'acqua di quei giochi non è rumore tarato, è un
**motivo disegnato**, e i motivi sono funzioni dedicate in `MOTIVI` (scavalcano
lo stile quando la ricetta li dichiara): `trattini` (New Leaf — griglia
sfalsata di lineette ondulate che lampeggiano), `archetti` (New Horizons —
sorrisi d'acqua sparsi che sfumano ognuno col suo orologio), `cerchi` (Wind
Waker — **dallo studio, non da me**: cerchi sparsi su DUE strati sfalsati con
le UV mosse da seni composti; niente rumore né voronoi), `ragnatela` (BDSP,
Galaxy, piscine — Voronoi F2−F1 coi semi che nuotano).

E i **talenti**: quattro effetti ALU-pura per le ricette «stupende ma leggere» —
`iridescenza` (arcobaleno guidato dall'angolo di vista, si SOMMA come luce:
brilla sulle basi scure, come la benzina), `bagliore` (schiuma e segni
EMISSIVI: non passano dall'ombra del sole, di notte restano accesi),
`cresteBianche` (schiuma dove l'onda è ALTA, ricalcolata dalla funzione d'onda
con le fasi già in ambito), `spinta` (Gerstner in piccolo: i vertici scivolano
verso le creste — vale la stessa legge delle cuciture, funzione della sola
posizione di mondo). Più `segno`/`schiumaTinta`: il colore proprio dei segni e
della schiuma (le crepe d'oro del kintsugi, il contorno a china di Moebius).
⚠ E i materiali delle ricette hanno il NOME della ricetta: due ricette con gli
stessi assi ma GLSL diverso non devono chiamarsi uguale.

### ⚠ LA SECONDA ONDATA DI VERDETTI («sparisce», «oleosa», «tileset», «cascate orribili»)
Quattro difetti riportati dal committente, quattro cause trovate:

- **«Da molte angolazioni sparisce o diventa bianca»** → il Fresnel del riflesso
  a vista radente tende a UNO, e l'acqua DIVENTAVA lo specchio, cioè il cielo.
  Cura: `riflTetto` (0,45 di fabbrica) — il riflesso è un condimento, non il
  piatto; solo metallo e neon (specchi di mestiere) lo alzano. E il congedo
  `sfumaVia` era troppo vicino ([40,85]→[60,130]): radente, i segni svanivano
  su tutta la pozza insieme.
- **«Noise ripetute, tileset che si nota»** → la piastrella è 6 blocchi
  (1/`mis.x`) e la deriva la SPOSTAVA senza cambiarla. Cura: SELEZIONE PER ZONE
  — due letture a scale non commensurabili, il campo largo sceglie zona per
  zona quale si vede. ⚠ Selezione, NON media: la media stringe la distribuzione
  attorno a 0,5 e le soglie sui percentili smettono di pescare in silenzio.
- **«Oleosa, non limpida, hue shift col profondo»** → il profondo ora VIRA di
  tonalità (`viraTono`, −22° verso il blu) invece di scurire e basta — stessa
  grammatica dell'ombra di casa; e la cristallina è ritarata (lobo speculare
  STRETTO e debole: la luce è un punteggio, non una patina; più trasparenza).
- **«Cascate orribili, texture spiattellata, niente schiuma se alta 3+»** → la
  parete ora conosce la SUA COLONNA (il mesher scrive cima e base nel canale
  extra, `test/mesher-cascata.test.mjs`; la base si ferma sulla SORGENTE: il
  lago d'arrivo non è caduta) e il disegno va per FASCE: cappello teso senza
  segni, filamenti procedurali per striscia (hash per colonna: NIENTE tessitura
  da piastrellare) che si allungano accelerando, schiuma al piede dai 3 blocchi,
  più alta e con spruzzi radi dai 6. Tutto ALU: identica su mobile.
  ⚠ E LA PROFONDITÀ È UNA LEGGE DEL PELO, NON DELLE PARETI: su una parete lo
  spessore è ~0 (roccia a contatto dietro) — la schiuma di contatto la copriva
  INTERA e la rifrazione sostituiva il resto col fondo: la cascata usciva
  bianca o nuda, e il disegno nuovo non si vedeva mai. Diagnosi al pixel
  (`vera 0` viva, `vera 3` nuda), cura `acquaPeloLibero`.
- Le **righe di riva + risacca sono SPENTE di default** («hanno rotto tutto,
  sembra sporco»): l'infrastruttura resta, si riaccende quando ci sarà un
  disegno che merita.

### ⚠ I «PATTERN STRANI DA CERTE ANGOLAZIONI»: due bug, e la diagnosi era del committente
Fotografati dal committente: ovali morbidi in griglia sul pelo, «sembra un
difetto della vicinanza della telecamera». Esatto, due volte:

- **Mip senza anisotropia**: a vista obliqua e vicina la derivata dell'UV
  esplode in UNA direzione; il trilineare sceglie il mip del gradiente
  peggiore, e ai mip alti il campo delle chiazze collassa nelle sue celle 9×9 —
  gli ovali SONO la griglia del value noise sfumata. Cura:
  `anisotropicFilteringLevel = 8` sul tratteggio (verificato sulla GPU:
  estensione presente, max 16). Vale per QUALSIASI texture in mondo-XZ vista
  di taglio: se un pattern «si scioglie» avvicinandosi obliqui, prima
  domanda: l'aniso c'è?
- **`uSchermo` aggiornato solo col riflesso**: le ricette con la profondità ma
  SENZA specchio (New Horizons, BotW, piscina…) restavano con uSchermo=(1,1) —
  spessore letto sempre dallo stesso texel per ogni pixel. Fondale e schiuma
  di contatto da un numero solo, sbagliato, che CAMBIAVA con l'angolazione
  (cambiava quel texel): l'altro pezzo del «da certe angolazioni non
  visualizza bene». La condizione giusta è `specchio || profondita`.

### ⚠ IL LATTE A VISTA RADENTE: la modalità MONDO, e tre trappole di segno
Tre foto del committente («guarda è tremendo»): abbassando la camera ACNH
diventava LATTE — prima mezza vasca, poi tutta. La causa di fondo è nota in
letteratura: la differenza di Z a schermo misura lo spessore LUNGO IL RAGGIO
proiettato sullo schermo, e radente il pixel «dietro» il pelo è la sponda
subito oltre, non il fondale sotto → spessore≈0 ovunque → schiuma di contatto
e bassofondo su tutta la superficie. La cura è la **modalità mondo** (da Uber):
il punto del fondale si RICOSTRUISCE lungo il raggio — la Z di camera scala
linearmente, basta il rapporto Zscena/Zpelo, e `vPositionW` è già relativa
alla camera — e se ne prende la Y. **Due spessori, due mestieri**:
`acquaSpessoreGiu` (Δy verticale, stabile con la camera) per fondale, schiuma
di contatto, righe di riva e caustiche; `acquaSpessore` (percorso nel volume,
con un tetto a 8) per assorbimento, corpo, rifrazione e sfocatura — radente si
attraversa più acqua e l'acqua si fa piena e satura, non bianca.

Ma il primo patch «giusto sulla carta» ha fatto latte OVUNQUE, e le tre
trappole valgono più della formula:

- **Le Z di vista qui sono NEGATIVE** (destrorso; misurato sulla mappa: min
  −65,8, max 0). La guardia contro lo zero scritta pensando a Z positive —
  `max(z, 0.02)` — schiacciava il pelo a 0,02 SEMPRE: scala assurda, spessore
  zero, latte totale. Si scrive `min(z, -0.02)`.
- **«Stessa matrice quindi sbagliano insieme» ERA FALSO.** Con l'origine
  mobile `worldPos` negli shader è RELATIVO ALLA CAMERA, e `uVista` intera gli
  riapplicava la traslazione: misurato al pixel, pelo a −34,2 contro fondale a
  −23,9 — «il fondo davanti al pelo», spessore gonfiato di ~(quota camera),
  che CAMBIA con l'angolazione. Per punti relativi alla camera la matrice
  giusta è la vista SENZA traslazione (R·(p−c) = vista assoluta, algebra
  esatta): `anima()` la azzera con `setTranslationFromFloats(0,0,0)`.
  ⚠ E questo dice che TUTTE le tarature di profondità precedenti erano fatte
  su uno spessore sfalsato: se un'acqua ora sembra «troppo trasparente», la
  taratura era compensata, non giusta.
- **La mappa VUOTA non è «a contatto», è lontanissimo**: dove nessuno ha
  scritto (cielo dietro il pelo) la Z vale 0, e il rapporto direbbe spessore
  zero → latte. Radente succede spesso: il raggio oltre il pelo buca la vasca
  e pesca cielo. Si forza la scala a 40 (`acquaVuoto`).

E scoperto per strada, stesso segno: il ripiego del bordo della rifrazione era
INVERTITO (`step(vAcquaVistaZ, acquaZRifra)` sceglieva l'UV spostato proprio
per i campioni EMERSI, e quello dritto sul fondale normale — cioè rifrazione
mai applicata dove serviva e oggetti emersi che colavano). Con Z negative
«più vicino» significa «più grande», e ogni confronto va riletto.

⚠ La verifica a scatti ha la sua trappola: subito dopo `cambiaRicetta` il
materiale COMPILA, e un render in quel mentre salta le mesh non pronte — due
scatti «acqua sparita» erano solo questo. Prima si aspetta `isReadyForSubMesh`,
poi si scatta.

### ⚠ LE CASCATE, RIFATTE SULLA FISICA — e il verdetto «cose arrangiate»
Committente, guardando la prima riscrittura: *«odio lo stacco che fanno le
cascate, anche quelle linette sono fuori dai vari stili delle acque; dev'essere
graduale la transizione, e bisogna far capire che è una bella cascata, non cose
arrangiate»*. Tre difetti veri in una frase, e il secondo era strutturale.

**Il moto viene da una formula sola.** La versione a fasce era giusta di
struttura e finta di moto: i filamenti si allungavano con una `smoothstep` scelta
a occhio e scorrevano a velocità costante. Adesso c'è `v = sqrt(v₀² + 2ah)`, e le
tre cose che si vedono la seguono invece di essere tarate una per una — lo
STIRAMENTO (si campiona nel tempo di volo, non nella quota: le bande sono i
pacchetti d'acqua veri, fitte in cima e larghe in fondo), l'ASSOTTIGLIAMENTO
(portata costante: `larghezza · v = cost`), il SFRANGIAMENTO in basso. Una
manopola (`cascata[1]`) cambia il carattere della caduta senza toccare il pelo:
da lì le tre ricette nuove (torrente alpino, cascata di giada, sorgente termale).

**Il ciglio non è più uno stacco, e la cascata è la SUA acqua.** Il difetto
grosso: sulla parete si disegnavano «le linette», uguali per tutte e trentasette
le acque — New Horizons e Wind Waker avevano la stessa identica cascata. La cura
sta nelle UV, non nel disegno: sulla parete si continua a campionare il motivo
della ricetta, e quello che cambia scendendo è COME. Al ciglio la coordinata è
ancora la quota (stessa unità del pelo: il motivo attraversa il bordo senza
accorgersene), più giù diventa il tempo di volo — e campionare in una coordinata
che rallenta vuol dire stirare l'immagine, quindi il motivo si allunga da solo.
I nastri restano, ma come un DI PIÙ pesato da `acquaCadNato` (zero al ciglio).

**Le tre ragioni per cui usciva color cemento**, tutte misurate al pixel
(stessa cascata: `(125,209,222)` senza la profondità, `(85,114,118)` con):
- **il riflesso planare finiva sulle pareti**. Uno specchio planare ha UN piano,
  orizzontale; su una superficie verticale quell'immagine non vuol dire niente,
  ma lì il Fresnel è quasi massimo e quindi pesava il più possibile. Adesso
  `* (1.0 - acquaSuMuro)`.
- **il fondo rifratto entrava nella lama**. Il sfrangiamento era passato dentro
  `acquaCorpo`, cioè mescolava l'immagine di quello che sta dietro — e dietro una
  cascata c'è la roccia da cui salta. La trasparenza della lama la fa l'ALFA, non
  il corpo.
- **la lama aveva l'alfa del pelo**. Un getto che cade ingloba aria ed è quasi
  opaco: si sale verso l'alfa della schiuma, e resta trasparente solo dove i
  nastri si separano davvero.

⚠ **E UNA CASCATA NON VA MAI AL BUIO.** Le pareti stanno quasi sempre nell'ombra
proiettata dalla rupe da cui saltano — è geometricamente inevitabile — e con
l'ombra a un gradino ci finivano dentro tutte insieme. In natura è il contrario:
la schiuma è fatta di bolle, DIFFONDE la luce invece di prenderla da una parte
sola, e una cascata all'ombra resta la cosa più chiara della parete. Si
restituisce un terzo della tinta come luce propria (`luceExtra`), pesata dalla
caduta. Stessa famiglia della normale **gonfiata verso l'alto** (`+0,8 y`): una
parete verticale ha N·L ≈ 0,5 contro lo 0,9 del pelo accanto, e quello che si
vuole non è la normale giusta — è la luce giusta.

### ⚠ TERZA ONDATA: simboli, tileset, stacco cromatico, e il tasto nel gioco
- **«Le acque dove usi simboli evidenti — cerchietti, "c" — sono tremende e
  fuori stile.»** Vero, e il difetto era il PRINCIPIO: un anello e un archetto
  sono forme chiuse, cioè SIMBOLI — l'occhio smette di vedere una superficie e
  legge caratteri sparsi su un fondo. Peggio: generati per cella, si dispongono
  su una griglia, che è la firma più leggibile di «texture ripetuta». Quello che
  l'acqua vera mostra non sono forme, sono CRESTE: linee aperte, lunghe, sinuose,
  che nascono e muoiono senza chiudersi — bande strette in cima a un campo di
  seni col dominio piegato. Niente celle, niente hash, niente raggi.
- **«Si nota tantissimo il tileset ripetuto, mancano noise sovrapposte.»** La
  selezione per zone non bastava perché due copie della stessa immagine, per
  quanto scelte a zone, restano due griglie **allineate** — l'occhio segue gli
  assi, non il disegno. Adesso: rotazione di ~37° (un angolo non multiplo di 90°
  non può riallinearsi), warp del dominio, terza scala. ⚠ **Ma il warp deve
  restare sotto il blocco**: la prima stesura piegava di ~4 blocchi e il risultato
  era peggio della malattia — non «acqua senza piastrella» ma acqua piena di
  GHIRIGORI. A quell'ampiezza il warp non sposta il disegno, lo strapazza.
- **«Lo stacco cromatico nella cascata è troppo netto.»** Il disegno può cambiare
  in fretta senza dare fastidio (un motivo che si stira è un movimento), ma un
  salto di TINTA sul ciglio si legge come un bordo dipinto. La rampa del colore è
  ora più LUNGA di quella del disegno: 2,6 blocchi contro 1,8.
- ⚠ **E OGNI COMANDO CHE SERVE A GUARDARE VUOLE UN BOTTONE, non una lettera.**
  Committente: «voglio un tasto fisico, altrimenti da mobile come testo le varie
  acque?». È la terza volta che questo progetto paga la stessa lezione (la
  qualità si ciclava solo con `K`, la diagnostica si mandava da console), e la
  ragione è sempre la stessa: **il telefono è il posto dove i difetti grafici si
  vedono per primi** — schermo piccolo, GPU debole, luce del sole — ed è l'unico
  dove non si può digitare niente. La pillola `💧 ‹ nome 1/40 ›` sta sotto 🩺 e
  📱 (`ui/acqua.js`), stesso stampo. ⚠ E il tasto passa dal SELETTORE, non fa il
  lavoro per conto suo: due strade che fanno la stessa cosa in due modi diversi
  divergono sempre, di solito il giorno che se ne cambia una sola.
- **Il tasto `A` è stato TOLTO** (31/08/2026): ciclava le acque, ma `A` è anche
  «sinistra» del WASD — l'acqua cambiava camminando. Committente: «non ha senso
  se mi muovo con WASD, basta quello a schermo». Nel gioco l'acqua si cambia
  SOLO dalla pillola 💧 (`ui/acqua.js`); ciclarla nel mondo resta importante
  (là ci sono le ombre a cascata, i lampioni, la nebbia e le montagne dentro il
  riflesso — il banco ha un sole finto), è cambiata solo la mano.

### ⚠ LA SESSIONE DEL LAGO (31/08/2026): la ricetta di casa, e quattro leggi nuove
- **`lago` («★ Lago a specchio») è l'acqua DI PARTENZA** di gioco e banco
  (`ACQUA_DI_PARTENZA` in main.js): l'acquerello ghibli con la scala `vera`
  della cristallina e lo specchio da protagonista (riflTetto 0,65 — strappo
  concesso per mandato). Super semplice per mandato: modello morbida, niente
  speculare, niente SSS, caustiche a velo.
- **La legge del profondo è del committente, parola per parola**: azzurro
  chiaro e trasparente al pelo, VIOLACEO e quasi pieno a 10 blocchi
  (viraFondo +78, scala fondale 0,22, corpo 0,19), e «le cose» viste
  attraverso virano con lui. ⚠ La virata delle cose sta in
  `GLSL_ACQUA_VERA_FINE` pesata da `acquaFondale` — metterla
  nell'ASSORBIMENTO esponenziale è stato provato ed era sbagliato: quello non
  sa quanto è fondo il fondo, colora tutto da subito («adesso l'acqua è
  totalmente viola, no»).
- **Le onde sono QUATTRO seni a ventaglio più DUE pieghe di fase lente**, e ci
  sono voluti due verdetti: «si nota il pattern delle distorsioni ripetersi»
  (due onde piane = battimento periodico) e, sulla prima cura a tre onde,
  «sembrano delle STRISCE IN DIAGONALE» — la diagnosi giusta: il difetto era
  la DIREZIONALITÀ, non solo la periodicità. Direzioni mai quasi parallele
  (~16°/−64°/71°/143°), ampiezze quasi pari, frequenze incommensurabili, e le
  pieghe curvano i fronti. ⚠ Chi tocca i coefficienti tocca SEI posti (vertex,
  spinta, normale analitica, creste, SSS, `altezzaPelo`) —
  `test/acqua-pelo.test.mjs` ormai TRANSPILA il GLSL vero in JS e confronta le
  funzioni punto per punto: non conosce la struttura, esegue quello che c'è.
- **Il banco ha le PALLE GALLEGGIANTI** (⚽↺ le resetta): quattro misure,
  fisica pura in `gioco/galleggiante.js` (provata in Node, gli eventi sono la
  semantica del committente: TUFFO se cadi, SCIA se ti muovi in acqua, e la
  schiuma al bordo la fa la profondità `vera` da sola). SINISTRO tenuto =
  trascina sul pelo, tocco rapido = colpetto, DESTRO tenuto = la prendi IN
  MANO e la porti ovunque a +2 blocchi dal terreno (mollata, ricade e si
  tuffa). Si urtano fra loro (masse ∝ r³; la palla presa è un'incudine), e il
  pavimento è il TERRENO VERO per punto (`quotaTerreno` interroga il mondo):
  con un fondo piatto e muri a rettangolo la palla «si incastrava nel
  terreno» e certi bordi dell'acqua erano irraggiungibili. Galleggiano su
  `altezzaPelo`: sono la verifica visiva che JS e GLSL raccontino lo stesso
  pelo. ⚠ Le mesh si chiamano `palla:N` e per questo entrano DA SOLE nelle
  tre passate (specchio, rifrazione, profondità): rinominarle le fa sparire
  in silenzio.
- **Il tasto A è stato tolto** (vedi sopra): l'acqua si cambia solo dalla
  pillola 💧.

### ⚠ «IN GIOCO NON NOTO ALCUNA MIGLIORIA» — e infatti non ce n'era nessuna
Il verdetto più importante di tutta la storia dell'acqua, perché non riguardava
il disegno: *«in gioco vedo roba ripetuta, splattellata, C ovunque… come se le
novità non le hai messe correttamente o le impostazioni grafiche automatiche non
mi fanno vedere bene l'acqua»*. Aveva ragione, ed erano **due difetti diversi
che davano lo stesso sintomo**:

- **Il gioco non usava nessuna ricetta.** `Fabbrica` costruisce il suo materiale
  di fabbrica — `acqua-tratti-piatto`: stile generico, modello piatto, `vera: 0`
  — che è l'acqua più povera che l'impianto sappia fare. Le quaranta ricette
  esistevano tutte e nessuna era accesa: stavano dietro un tasto che chi apre il
  gioco non ha ancora premuto. Adesso `main.js` chiama `sceltaAcqua.applica()`
  all'avvio, e gioco e banco partono dalla stessa acqua.
- **E dove la scala aveva alleggerito, si compilava la variante POVERA**: una
  lettura sola, cioè **zero anti-tiling** (niente warp, niente rotazione, niente
  terza scala) e `vera` forzata a 0. Su mobile sempre. Tutto il lavoro contro il
  tileset semplicemente non esisteva nel sorgente che girava.

⚠ **LA LEZIONE È SUL METODO, NON SULL'ACQUA: una miglioria che vive in un ramo
compilato solo a volte non è una miglioria, è una scommessa.** E la verifica
onesta non è «l'ho scritta e i test passano», è leggere il sorgente COMPILATO
sulla macchina che si sta guardando (`gl.getShaderSource`) e cercarci dentro il
pezzo nuovo — che è come è stato trovato questo difetto in tre minuti dopo
settimane in cui il sintomo veniva scambiato per «il disegno non ti piace».

⚠ E per adesso **`acquaRicca` è forzata a `true`**, mobile compreso: finché
l'acqua si sta scegliendo, un'ottimizzazione che cambia quello che si guarda
falsa la decisione — si finisce per bocciare un disegno per un difetto che sta
nella scala di qualità. Si rimette `acceso('acqua')` quando la ricetta sarà
scelta (`qualita.js`, il commento dice cosa si riaccende).

### ⚠ I PARTICELLARI DELL'ACQUA: il mesher li calcolava già
Spruzzi, velo e bolle al piede delle cascate. E come per `dati.acq` prima
dell'acqua, **il dato era già lì e nessuno lo leggeva**: il mesher scrive per
ogni cella con una colonna sopra un impatto `{x, y, z, ys, h}` — `ys` è DOVE
SBATTE (il pelo della pozza), `y` la cima della colonna, `h` l'altezza della
caduta. Due array per chunk, riempiti a ogni ricostruzione e buttati via.
`mesher.puntiAcqua()` è tutto quello che mancava.

- **Tre effetti, tre mestieri** (`particelle.js`): le GOCCE schizzano in arco, il
  VELO ristagna e sale, le BOLLE risalgono dentro l'acqua. Un sistema solo darebbe
  la media di tre moti, che non è nessuno dei tre.
- **La decisione sta in `gioco/spruzzi.js`, provato in Node**, perché la parte
  difficile non è crearli — è decidere quanti. Una cascata larga sei celle
  produce sei impatti: senza raggruppamento sarebbero sei sistemi affiancati,
  sei volte il costo per sei fontanelle invece di un fronte.
- ⚠ **Le soglie sono LE STESSE dello shader** (schiuma da 3 blocchi, velo da 6).
  Se divergessero si vedrebbe una cascata che schizza senza schiumare, e
  sembrerebbe «le particelle sono nel posto sbagliato» invece di un disaccordo
  fra due tabelle che nessuno ha messo vicine.
- ⚠ **La trasparenza non basta a fare un velo**: al primo tentativo (alfa 0,26,
  ritmo 20) le cascate alte sparivano dentro una nuvola — venti veli al 26%
  impilati fanno un bianco pieno lo stesso. Si taglia il RITMO, non solo l'alfa.
- ⚠ E `particelle` **va passato a `applicaProfilo`**, o la scala di qualità non
  li governa: `if (particelle)` non si lamenta se manca la chiave.

### ⚠ DUE VASCHE NUOVE, e una era progettata male
- **«Salti da 1 a 8 blocchi»**: sei cascate affiancate nella stessa pozza, con la
  stessa luce e la stessa ricetta. È il banco dell'effetto che cambia con
  l'altezza — le prime due devono restare lame pulite.
- **«Sorgente e livelli»**: una sorgente e l'acqua che si allarga a raggiera
  assottigliandosi (0 al centro, fino a 4). ⚠ La prima stesura metteva i livelli
  su cinque GRADONI a quote diverse, e non mostrava niente: fra un livello e
  l'altro il pelo scende di un ottavo di blocco, quindi un dislivello di un
  blocco intero seppellisce proprio la cosa da guardare. E l'acqua va APPOGGIATA
  su un piano, non dentro una conca — una conca piena d'acqua è una pozza.

⚠ **E IL GIRO DI RESA NON GIRA NEL PANE HEADLESS**: `requestAnimationFrame` non
scatta, quindi le particelle restano ferme a zero e sembrano rotte. Per
verificarle bisogna chiamare `scena.render()` a mano in un ciclo (i sistemi
avanzano col `getDeltaTime`). Gli scatti funzionavano lo stesso, ed è il motivo
per cui la cosa non si era mai notata.

### ⚠ L'ONDATA DELLO STUDIO (9 riferimenti + noclip), e cosa ne è entrato
Un workflow ha letto nove shader di riferimento; la sintesi e le integrazioni:

- **Tocchi interattivi** (`GLSL_ACQUA_TOCCHI`): otto impatti vec4 (x, z, quando,
  forza) in uniform. ⚠ RIFATTI CINQUE VOLTE su verdetto (31/08/2026), e la
  storia insegna più della formula: anelli a `step` → «fuori stile»; macchie di
  schiuma → «non mi piacciono»; solo onda → «rimetti i cerchi bianchi, ma che
  SFUMANO al trasparente allargandosi». Adesso un tocco fa due cose: piega la
  normale (specchio e fondo tremano ad anelli da soli — il blocco sta dopo la
  normale e prima di rifrazione/riflesso nell'ordine d'innesto) e dipinge un
  cerchio morbido che muore in dissolvenza — strappo DICHIARATO alla regola
  «niente sfumature», chiesto esplicitamente; funziona perché
  `acquaSchiumaProf` è un peso, non un sì/no. La SCIA ha un registro suo
  (`uScia[16]`): dischetti morbidi che svaniscono, seminati fitti — la
  versione a macchie staccate è stata bocciata con «sembrano scoregge bianche,
  non una scia che sparisce». ⚠ Il legame `setArray4` era finito nel blocco
  sbagliato con una sostituzione di testo: tocchi vivi SOLO sulle ricette con
  la riva accesa — un guasto che sarebbe sembrato «l'interattività va e
  viene».
- **Righe di riva** (`rigaRiva`): curve di livello dello SPESSORE in moto — si
  piegano nelle insenature da sole. E la **risacca respira in fase** (stesso
  periodo, scarto −2,5 del riferimento ACNH).
- **Risacca sul TERRENO** (`fabbrica.rivaTerreno`): la lingua che avanza e si
  ritira vive nel materiale del MONDO, perché la mesh dell'acqua finisce alla
  sponda. Sabbia bagnata che scurisce E vira (regola di casa), fronte bianco a
  festone. ⚠ LA MASCHERA È IL RETTANGOLO DELL'ACQUA, non della piazzola: con
  l'ingombro intero tutta l'erba (stessa quota della banda) veniva bagnata a
  pois — trovato spegnendo e riaccendendo, con la GPU sondata via
  `getUniform` per escludere il legame. Un livello e un rettangolo soli: due
  vasche a quote diverse non possono avere lo swash insieme (limite onesto).
- **Caustiche a contro-scorrimento**: `min` di due letture opposte — la linea
  vive solo dove TUTT'E DUE gli strati passano, e scintilla. E adesso PASSANO
  DALL'OMBRA: il contributo si accumula (`acquaCauLuce`) e si somma in
  `luceExtra` moltiplicato per il gradino — prima brillavano anche sotto i ponti.
- **Soglia della schiuma corretta con la pendenza**: `dFdx/dFdy` su
  `acquaZScena` — fondo piatto → soglia stretta. Il riferimento (IronWarrior) lo
  fa con un buffer delle normali, cioè un render in più: le derivate danno la
  stessa informazione gratis.
- **Congedo con la distanza** (`sfumaVia`): righe e scintille a `step` FRIGGONO
  al largo (un pixel pesca dentro/fuori a ogni frame); con l'origine mobile
  `length(vPositionW)` È la distanza dalla camera, e il congedo costa una
  smoothstep.
- **Fondale sfocato con lo spessore**: mip sulla RTT di rifrazione +
  `textureLod` — nitido a tre dita, morbido a tre metri. ⚠ La catena mip si
  rigenera ogni frame: su tile-GPU va misurata (lì però non si compila).
- **Controluce SSS** (`sss`): creste che si accendono guardando verso il sole —
  un dot e uno step, vive nella finestra di azimut del bottone «☀».
- **`altezzaPelo(x,z,t)`**: la funzione d'onda in JS puro per il galleggiamento
  di fase 5. `test/acqua-pelo.test.mjs` confronta i coefficienti col GLSL vero:
  chi ritocca le onde rompe una prova, non il galleggiamento.
- Dallo studio, non implementato qui: su Wii Galaxy non rifrangeva l'acqua —
  faceva ondeggiare il FONDALE (codersnotes); il nostro Z-reject è il metodo
  che lì costava troppo, e a noi è gratis perché lo Z serve già allo spessore.

### ⚠ RIFRAZIONE E PROFONDITÀ SONO UNA PASSATA SOLA (02/09), e la vecchia mappa MENTIVA
Erano due rese complete della STESSA scena, con la stessa lista e la stessa
camera, e nessuno l'aveva notato perché avevano nomi diversi: un
`RenderTargetTexture` a colori e un `DepthRenderer`. Adesso c'è
`sottAcquaCondivisa`: un solo bersaglio, colore + **attacco di profondità
campionabile** (`createDepthStencilTexture`), e la Z di camera si RICOSTRUISCE:

    z = f·n / ((f − n)·d − f)      (destrorso, niente reverse-Z; uniform `uZReco`)

verificata contro la matrice di proiezione vera su otto distanze: errore zero.

⚠ **Tre trappole pagate, tutte mute:**
- **il legame vuole `setDepthStencilTexture`**, non `AddUniform(..., texture)`:
  il legame automatico di `CustomMaterial` passa da `effect.setTexture`, che è
  la strada delle texture normali. Con quella il campionatore resta sull'unità
  vuota e ogni lettura torna ZERO — cioè spessore zero ovunque, cioè un lago
  limpido che sembra una scelta di stile;
- **`resize()` butta via l'attacco di profondità** (ricrea il render target
  dalle sole opzioni iniziali): va richiamato `createDepthStencilTexture` dopo
  ogni ridimensionamento, e l'involucro (`ThinTexture`) deve restare LO STESSO
  oggetto, se no vanno rilegate tutte le uniform;
- **la profondità non si filtra**: `DEPTH_COMPONENT24` non è filtrabile in
  WebGL2, e col bilineare la texture diventa «incompleta» e legge zero.

⚠ **E la vecchia mappa sbagliava lo spessore di un fattore ~8.** Misurato con
`?acquaz` (dipinge lo spessore verticale a schermo, scala 0–8 blocchi) contro
la colonna d'acqua letta dalla griglia: dove il lago è profondo UN blocco, la
vecchia mappa diceva «otto o più» — quindi virata violacea piena dappertutto.
Era il sospetto già scritto qui sopra («se un'acqua ora sembra troppo
trasparente, la taratura era compensata, non giusta»), adesso è un numero.
**`lago` si vede più chiara di quella approvata il 31/08**: le manopole per
rimetterla dove piace sono `vera[1]` e `assorbi`, ma il verdetto è del
committente e va dato guardando.

### ⚠ LE PASSATE SI CULLANO AL FRUSTUM, E LO SPECCHIO PURE
Una `renderList` fissa Babylon la disegna TUTTA, dietro la camera compresa.
`getCustomRenderList` filtra sulle mesh dentro `scena.frustumPlanes`; funziona
anche per lo specchio perché `MirrorTexture` monta la sua matrice di vista in
`onBeforeRenderObservable`, che Babylon notifica PRIMA di
`_prepareRenderingManager` — quindi lì i piani sono già quelli RIFLESSI.
⚠ E le liste ora si SVUOTANO (`onMeshRemovedObservable`): `dispose()` toglie una
mesh dalle mappe d'ombra e non dai `customRenderTargets`. All'avvio le liste
contavano 114 e 124 voci contro 78 e 83 mesh vive.

### ⚠ LE RISORSE DI PASSATA SONO DEL RIG, NON DEL MATERIALE
Ogni materiale col riflesso creava il SUO specchio e lo registrava fra i render
target; i materiali si tengono in cache → cambiando ricetta gli specchi si
ACCUMULAVANO, ognuno a renderizzare ogni fotogramma per sempre. Adesso specchio,
rifrazione e profondità sono singleton del rig (`specchioCondiviso` &c).

### ⚠ UNA MirrorTexture LEGATA A MANO NON LA DISEGNA NESSUNO
Babylon rende una `MirrorTexture` solo se la trova in
`scene.customRenderTargets`, e ce la mette **da solo** quando la si assegna a
`material.reflectionTexture` — cioè per la strada normale. Legandola come
campionatore proprio (`AddUniform('uRiflesso', 'sampler2D', …)`) quella strada
non si percorre: la texture resta **nera**. E a schermo non sembra un guasto,
sembra «un riflesso scuro» — una cosa che si può quasi credere. Trovato con
`readPixels()`: media (0,0,0), 100% dei texel sotto soglia.

**E il riflesso planare NON costa 11,1 ms.** Quel numero viene da Lantern, dove
era la scena intera ridisegnata senza culling proprio, e l'ho citato per tutto
il lavoro come se fosse una legge di natura senza mai misurare la versione
economica. Misurato qui, isolando i render target (ombre del sole spente, così
l'unico target resta lo specchio), a 1904×1130: **1,2 ms di p50** (1,5 al p90)
con RT 512², `adaptiveBlurKernel` 12 e una `renderList` di 33 mesh. Nove volte
meno. ⚠ Il limite vero è un altro: un riflesso planare ha **un piano solo** —
il lago principale sì, la pozza sul dirupo no.
⚠ E si campiona in **coordinate di schermo**: la camera dello specchio ha la
stessa proiezione, quindi per un frammento sul piano la sua posizione a schermo
è già la coordinata giusta.

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

## ⚠ UNA GRAFICA SOLA, OVUNQUE (mandato del 02/09/2026) — e la RIFONDAZIONE

Il committente, dopo il secondo rapporto 🩺 dal Mali (44 fps a q0, 36 disegni):
«da telefono la grafica scende automaticamente e quindi non va a ultra: cosa
sbagliata per i test. In ogni dispositivo la grafica deve essere uguale, non
diversa, si crea inconsistenza. Gli fps sono disastrosi: dobbiamo puntare
all'AR e alla grafica al massimo al massimo degli fps. Serve rifare tutto da
zero con le tecnologie storiche di ottimizzazione».

Da quel momento, e ribalta tre cose scritte più sotto in questo file:
- **`LIVELLI.mobile` è un ALIAS di `LIVELLI.desktop`** (`motore/qualita.js`):
  la tabella mobile non esiste più. `fissiDiAvvio` non parte più dall'ultimo
  gradino di fatica sul telefono; l'erba ha lo stesso tetto; i nomi dei
  gradini sono gli stessi. Resta solo `DPR_MAX` (è risoluzione, non grafica).
- **La scala NON scende da sola**: `scala.adatta.manuale = true` all'avvio
  (`main.js`), ovunque. `?scala=auto` per vedere cosa sceglierebbe. Il
  contratto «automatico finché non lo tocchi» resta scritto sotto perché
  spiega le cure dell'oscillazione, che valgono ancora in `?scala=auto`.
- **Il telefono che non regge NON si cura con una tabella sua**: si cura con
  il motore. Il piano è `docs/RIFONDAZIONE.md` — luce cotta nei vertici, un
  disegno per chunk, erba nel mesh, acqua a una passata, mondo in array
  tipizzati, fisica a passo fisso, nucleo WebGL2 in casa — con la porta di
  ogni fase misurata sul Mali col 🩺. Le sezioni «MOBILE» qui sotto restano
  come STORIA delle misure (sono tutte vere), non come regole in vigore.

⚠ Il prezzo, detto prima e accettato: sul Mali a ULTRA desktop i fotogrammi
saranno pochi finché la rifondazione non arriva. È il numero vero di partenza.

## ⚠ MOBILE: perché faceva 6 fps, e cosa lo decide adesso

Il committente, sul suo telefono: **6–7 fps**, mentre sul PC andava meglio di
Leafy-Lantern. Non era un difetto: era una configurazione da desktop — l'unica
che esistesse — fatta girare su un chip con un decimo della banda e tre volte i
pixel. Non c'era **nessuna** distinzione per dispositivo.

⚠ **E il telefono non si misura da questa macchina.** Qui il vsync copre tutto:
per vedere una differenza ho dovuto salire a 17,4 milioni di pixel. Quindi i
numeri di partenza NON vengono da misure mie — vengono da Lantern, che una scala
mobile ce l'ha, tarata su hardware vero.

**Le tre cose che costano, in ordine:**
1. **I pixel.** Un telefono ha DPR 2,5–3,5: a schermo intero sono 6–12× i pixel
   di un desktop. Da Lantern: *«il cap del pixel ratio è il singolo fattore che
   pesa di più sui fps»*. Qui non c'era **nessun cap** — `adaptToDeviceRatio`
   acceso e basta, cioè si renderizzava a DPR pieno.
2. **Le cascate d'ombra.** Misurato qui a 17,4 Mpixel: da 4 cascate a 2 valgono
   **1,5 ms**, il filtro PCF solo 0,5. Non è il campionamento — ogni cascata è
   un *render* della scena in una mappa di profondità. 4 × 2048² sono 16,8 M
   pixel di profondità per fotogramma, oltre alla scena.
3. **Le ombre delle lampade.** Da Lantern, misurato su Mali-G68: **~30% di fps**.

### ⚠ SU MOBILE UN `if` NON SPEGNE NIENTE
È la lezione più importante, e viene da Lantern: su una GPU mobile il
compilatore riserva i registri per il caso peggiore **anche nei rami che non
esegue**, e con tanti registri per thread scendono i thread in volo. Lo shader va
piano *anche quando non fa niente* — è il motivo per cui laggiù abbassare la
risoluzione non spostava gli fps: non erano i pixel, era l'*occupancy*.
Quindi il cammino nei voxel non sta dentro un `if`: su mobile **non viene
compilato** (`glslAccumuloLuci(conOmbre)` in `luci.js`). Verificato leggendo il
sorgente compilato: niente `ombraVoxel`, niente `texelFetch`, niente `uLuciOmbra`.

⚠ **E si decide all'AVVIO, non a caldo.** `CustomMaterial.Builder` mette il
sorgente in cache e torna subito se lo trova; e anche svuotando quella cache il
motore tiene l'effetto già compilato — **misurato**: cambiando l'innesto e
sporcando il materiale, il sorgente a schermo non cambia.

### Le opzioni di Babylon che si usano (e quelle che NON vanno bene)
- `engine.setHardwareScalingLevel(n)` — la leva principale. ⚠ **Vuole un
  `resize()` esplicito**: senza, non fa niente e non si lamenta. Ci ho perso una
  misura intera credendo fosse il vsync.
- `ShadowGenerator.mapSize` e `CascadedShadowGenerator.numCascades` — settabili
  a caldo, ricreano la mappa. ⚠ Il minimo è **2** (`MIN_CASCADES_COUNT`) e il
  setter fa `Math.max` in silenzio: sotto si spegne l'ombra, non si scende.
- `preserveDrawingBuffer` — ⚠ **spento OVUNQUE** (era `!mobile`): serviva solo
  agli scatti, che passano da `rig.scatto` — anche su desktop era una copia a
  fotogramma pagata per niente.
- ⚠ **MSAA/FXAA: SU GPU A TILE VALE IL CONTRARIO DEL DESKTOP** (dallo studio
  `docs/STUDIO-RETRO.md`, fonti ARM/Samsung/Android): i sample MSAA vivono
  nella memoria on-chip e si risolvono on-tile (~500 MB/s), mentre FXAA è una
  passata fullscreen — store e rilettura dell'intero frame. La vecchia nota di
  casa «l'MSAA quadruplica il riempimento» era una verità da GPU desktop
  applicata a un tiler. Quindi: profili mobile con `fxaa: false` e `antialias`
  del canvas ACCESO su classe/GPU mobile.
- La perdita del contesto WebGL la gestisce **Babylon da sé** (registra
  `webglcontextlost` e chiama `preventDefault`, la riga senza cui la tela resta
  nera per sempre). In Lantern era codice nostro; qui non serve.
- ⚠ **`ScenePerformancePriority` NON va bene qui**, e vale la pena dire perché:
  `Aggressive` accende `skipFrustumClipping`, cioè spegne il culling — e noi ci
  viviamo sopra (30 mesh attive su 98). E *tutti e due* i livelli spengono
  `autoClear`, mentre il nostro cielo **è** il colore di sfondo: senza clear si
  spalma. È un pacchetto, e due dei suoi pezzi sono sbagliati per un gioco così.
- `SceneOptimizer` esiste ed è lo scheletro giusto (misura, scala per priorità),
  ma i suoi passi sono grossolani — ombre sì/no, particelle sì/no — e non sa
  niente delle tre cose che ci costano davvero. La scala qui fa lo stesso
  mestiere con le manopole nostre, e la sua parte difficile (quando scendere e
  quando risalire) è provata in Node: `test/adatta.test.mjs`.

### La scala (`motore/qualita.js` + `gioco/adatta.js`)
Sei gradini su mobile, cinque su desktop, in **tabella**. Il bersaglio è
`min(schermo, 60)`: puntare al tetto di un pannello a 144 Hz vorrebbe dire non
arrivarci mai e scendere per sempre. Si scende dopo 3 misure, si risale dopo 8, e
**si ricorda il gradino che non ha retto** per un minuto — senza quella memoria
la scala oscilla, che è il difetto che nasce insieme alla cura.
⚠ E i primi 4 secondi non si giudicano: all'avvio ci sono worldgen, mesh (456
ms) e compilazione degli shader, e una scala che guardasse lì precipiterebbe in
fondo su qualunque macchina.
⚠ `screen.refreshRate` **non esiste in Chrome**: tornava `undefined` e il
ripiego a 60 funzionava per caso. Adesso si misura dal ritmo dei fotogrammi.

**K** cicla la qualità a mano (nel gioco e nello zoo). L'HUD dice classe del
dispositivo, gradino, pixel veri, cascate, se le lampade hanno l'ombra e il nome
della scheda — perché sul telefono non c'è una console, e senza quei numeri
«va piano» resta un'opinione.

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
**Un tasto, un verbo**: il sinistro *distrugge* — sempre, e **tenendolo premuto**,
mai con un tocco; il destro *posa* quello che si ha in mano, o *interagisce* se
la mano è vuota. Centrale copia il blocco guardato; 1-9 e R scelgono; virgola e
punto muovono l'ora, P ferma il ciclo. Posare una lampada l'accende — il blocco
**dichiara** la sua luce in `world/blocks.js`, qui non c'è nessun elenco di cosa
illumina.

⚠ Prima l'azione dipendeva da cosa si aveva in mano **e** da cosa si stava
guardando, e i due tasti finivano spesso per fare la stessa cosa. Il committente
l'ha detto esatto: «la mano vuota se clicco il sinistro rompe, se clicco il
destro rompe». La mano vuota adesso **è un attrezzo** — quello con cui si tocca
il mondo — e ha la sua casella nella barra.

⚠ **Sul telefono il dito è un tasto solo**, e il piccone (⛏) dice quale dei due
sta emulando. Senza di lui metà dei verbi sarebbero irraggiungibili col tocco.

Le tre risposte a schermo stanno in `gioco/`, tutte senza motore e tutte provate
in Node, perché sono **curve nel tempo** — la famiglia di cose che a occhio non
si giudicano, visto che durano due decimi di secondo:

| | dove | cosa fa |
|---|---|---|
| il cronometro dello scavo | `gioco/scavo.js` | 0,38-1,1 s secondo la durezza; mollare azzera |
| i pezzetti | `gioco/schegge.js` | cubetti dei colori del blocco; spariscono **rimpicciolendo**, non in dissolvenza |
| le curve | `gioco/effetti.js` | il colpetto (gonfia e torna), la posa (atterra), il danno (gonfia e trema) |

⚠ **Rompere è una PRESSIONE, non un clic.** Committente: «la distruzione non
deve essere mai istantanea, devi tenere premuto come su Minecraft». La versione
a *colpi* che c'era prima era sbagliata due volte: a clic si va velocissimi,
quindi «più colpi» non rallentava niente — rendeva solo il gesto faticoso; e
soprattutto non si vedeva quanto mancasse. Con il tasto giù il tempo scorre da
solo e la barra è il blocco stesso, che si gonfia e trema. Il tempo si misura in
**millisecondi, non in fotogrammi**: a 144 Hz e a 20 fps un blocco deve volerci
lo stesso. `gioco/puntatore.js` ha due ascolti diversi perché sono due domande
diverse — `ascoltaClic` («l'ha toccato?») e `ascoltaPressione` («lo tiene
ancora?»); sopra `SCARTO` pixel la seconda molla, perché quello che si sta
facendo è girare la camera.

⚠ **Tutte e tre disegnano SOPRA il blocco, mai sotto l'uno.** Un blocco vero è
cotto dentro la mesh del suo chunk e non si può scalare da solo; quindi si
disegna una copia («il fantasma»). Una copia più *piccola* dell'uno finisce
dentro l'originale e non la vede nessuno — è la ragione per cui il danno
**gonfia** invece di crepare e la posa **atterra** invece di crescere dal niente.
⚠ Il raggio lo calcola Babylon (`CreatePickingRay`), la **griglia la camminiamo
noi** (`gioco/mira.js`): `scene.pick` dovrebbe intersecare centomila triangoli
per dire quale cubo si sta guardando, il DDA ci arriva in dieci passi e dà anche
la faccia. ⚠ E l'origine del raggio si prende dalla camera, non dal raggio:
l'origine mobile toglie la traslazione dalla matrice di vista.
⚠ Il **braccio** non è il **raggio**: in vista a diorama il raggio parte dalla
camera, venticinque blocchi indietro. Con sette di portata non arrivava
nemmeno al terreno, e il mirino era sempre spento.

## L'OFFICINA — `?officina` nell'indirizzo

Un pannello solo, generato dai DATI, per girare le manopole del motore dal vivo
— sul telefono come sul portatile — e misurare l'effetto con numeri (p50, p99,
disegni, ms dei bersagli). Sette schede: Acqua, Qualità, Ombre, Giorno, Erba,
Motore, Misura. Si carica solo se la si chiede, come l'Ispettore.

| file | fa |
|---|---|
| `src/officina/comandi.js` | il bus: esegui / annulla / ripeti, diario serializzabile, stato netto |
| `src/officina/schema.js` | i tipi di campo (numero, interruttore, scelta, colore, testo, azione, lettura) |
| `src/officina/pannello.js` | il DOM: schede per registro, controlli generati dallo schema, valori RILETTI dalla scena ogni ½ s |
| `src/officina/editor.js` | la cornice scura: qui non si gioca, qui si regola (la tela viene solo ritagliata) |
| `src/officina/misura.js` | campionatore per fotogramma e misure A/B col riscaldo scartato |
| `src/officina/preset.js` | esporta / importa / salva nel browser lo stato netto |
| `src/officina/apri.js` | mette in fila i registri e apre |

⚠ **L'OFFICINA NON TOCCA MAI LA SCENA: EMETTE COMANDI** `{registro, campo,
prima, dopo, autore, t}`. Oggi il comando scrive in locale; domani lo stesso
comando lo valida un server e lo ritrasmette agli altri giocatori. Costruire nel
sandbox e regolare il motore diventano lo stesso gesto — ed è il passo zero del
multiplayer, non un vezzo di architettura. `test/officina.test.mjs` lo presidia
in Node (annulla, ripeti, stato netto, `rigioca` che NON riempie la pila).

⚠ **E OGNI MODULO DICHIARA IL SUO REGISTRO, accanto al suo codice**:
`registroAcqua` sta in `motore/acqua.js`, `registroQualita` in
`motore/qualita.js`, `registroOmbre`/`registroMotore` in `motore/motore.js`,
`registroGiorno` in `motore/giorno.js`, `registroErba` in `vegetazione/erba.js`.
La versione che girava sopra la build pubblicata aveva un ADATTATORE unico
(`officina/leafy.js`) che conosceva i nomi interni di tutto: era l'unico modo di
parlare a un gioco senza sorgente, e per costruzione mentiva in silenzio il
giorno che un nome cambiava. Con il registro accanto alla manopola, chi rinomina
rompe la riga che ha sotto gli occhi.

⚠ **E OGNI CAMPO HA UN `leggi`**, sempre: il pannello disegna il valore VERO
della scena, mai quello che crede di aver scritto. Se la scala di qualità
abbassa il tetto dell'acqua o il ciclo del giorno muove l'ora, si vede.

⚠ **Toccare una manopola della Qualità FERMA lo scalatore automatico.** È il
contratto del gioco (automatico finché non lo tocchi), e in Officina serve
doppio: una scala che cambia il gradino mentre si sta misurando falsa la misura.

## Da fare, in ordine
Vedi `docs/PIANO.md`. La fase 1 (scheletro + terreno vero a schermo) è **fatta**.

⚠ **IL BANCO DI MISURA (R1)**: `?misura` nell'indirizzo → 4 s + 60 fotogrammi
di riscaldo, 300 misurati sulla posa standard, quadro p50/p99 a schermo e nel
rapporto 🩺 (`gioco/misure.js`, provato in Node; `rig.campione()`/`rig.passate()`
nel motore). Le baseline stanno in `docs/MISURE.md` — ogni fase del rework apre
e chiude lì.

⚠ **LE OMBRE SI CONGELANO A SCENA FERMA (R2)**: `rig.quieteOmbre(firma)` con la
firma composta in `main.js` (sole, camera, giocatore, `fabbrica.revOmbre`).
Misurato: 296 → **88** disegni per fotogramma da fermi. Chi aggiunge un
proiettante MOBILE nuovo deve o farlo entrare nella firma o chiamare
`rig._sporcaOmbre()` — se no la sua ombra resta indietro quando tutto il resto
è fermo, e sembrerà «le ombre ogni tanto si incantano».

⚠ **LE PASSATE DELL'ACQUA SONO GOVERNATE (R2)**: `governaPassate` in acqua.js,
chiamata da `fabbrica.animaAcqua` — specchio/rifrazione/profondità girano solo
se la ricetta le usa E una mesh d'acqua è nel frustum. Misurato: −2,8 ms che
prima restavano persi per sempre dopo aver provato una ricetta ricca. Il
pannello ha la riga `passate:` (da `rig.passate()`): se lì compare una voce
nuova, qualcuno la sta pagando — è il «tetto dichiarato» della fase R2.

⚠ **LA FLORA È A DOPPIA FACCIA IN GEOMETRIA, e la lezione è di metodo**: alla
prima verifica VISIVA (chiesta dal committente: «non immaginarti di aver
inserito qualcosa via codice») le rocce mostravano solo il tetto e i cespugli
sparivano dall'angolo opposto — avvolgimento scritto a occhio, metà facce di
schiena, e i test Node tutti verdi perché il winding non lo vede nessun test.
La cura non è «girare i tri giusti» (si sbaglierebbe al prossimo cespuglio):
`motore/flora.js` duplica ogni triangolo nei due versi — visibile da ogni lato
PER COSTRUZIONE. Vale per la flora procedurale; i .glb veri arrivano giusti
dall'export e non si raddoppiano. ⚠ E ogni geometria nuova si guarda DA DUE
ANGOLI OPPOSTI prima di dichiararla fatta: è il controllo che i test non
possono fare.

⚠ **LA FLORA (R3)**: cinque famiglie procedurali (`world/flora.js`: geometrie +
semina deterministica, provate in Node; `motore/flora.js`: thin instances sul
materiale del MONDO — stessa ombra, stesse lampade, zero materiali nuovi).
Misurato: 346 → 3.577 istanze con p50 e disegni IDENTICI — il costo è per
famiglia, non per istanza, ed è il meccanismo per i 9000 asset. `?carico=N`
moltiplica la densità per le prove. ⚠ E le istanze si dividono PER SETTORE
(48 celle, `latoSettore`): con una mesh sola la scatola dell'unione copre il
mondo e il frustum non scarta mai niente; a settori scarta i settori interi
(misurato: 13 attivi su 27 guardando da un lato). Le matrici dei nodi sono
congelate (`freezeWorldMatrix`): le posizioni vere stanno nelle istanze. ⚠ Le scale sono tarate contro l'erba di q0:
sotto ~1,0 le famiglie AFFOGANO nel prato e il mondo sembra vuoto come prima.
Le geometrie sono SEGNAPOSTO dichiarati: quando arrivano i .glb veri si
sostituisce `costruisci`, la semina resta.

⚠ **DAL 30/08/2026 È APERTA LA SESSIONE DEL REWORK: `docs/PIANO-REWORK.md`.**
Mandato del committente: motore modulare e «super ottimizzato» per **9000+
asset** (NPC, veicoli, automazioni) e **AR da QR code**, SENZA tagli grafici —
la grafica deve salire. La scala automatica è stata TOLTA (era «una vergogna»):
quattro livelli manuali (pillola ⚙, tasto K), massimo di default ovunque.
L'acqua di partenza è `ghibli`. Le prestazioni si guadagnano in architettura
(passate, istanze, LOD, streaming), mai spegnendo grafica.

## ⚠ R3 DAL CLOUD (02/09/2026): chunk a tre livelli, Worker, materie al pixel, Officina

Quattro pezzi entrati insieme sul ramo `claude/rework-architettura`, tutti
provati in Node (257 prove) e a schermo. Le trappole già pagate:

- **I chunk hanno tre livelli** (`world/mesher.js`): PIENO entro `raggi.pieno`,
  PELLE fino a `raggi.resa`, NIENTE oltre. La pelle è per colonna: la cima del
  blocco più alto e le pareti verso le colonne più basse (`costruisciPelle`),
  stessi colori e stessa marcatura dell'erba — misurato 15× più leggera del
  pieno sul terreno mosso, 2,6× su una pianura (lì il pieno è già solo cime).
  I raggi li dà `fabbrica.raggi()` dal profilo (`dist` e il campo `pieno`,
  se manca metà distanza). ⚠ Il riesame scatta solo quando chi guarda cambia
  chunk, con ISTERESI di un chunk: senza, camminando lungo il confine i chunk
  si rifacevano a ogni passo. ⚠ Senza raggi (prove, zoo) tutto resta pieno.
  ⚠ La pelle NON sa di grotte e sporgenze: sta oltre `pieno`, dove la nebbia
  ha già cominciato — è un LOD da orizzonte, dichiarato.
- **Il mesher costruisce in un Worker** (`world/mesher-worker.js`) STATELESS:
  ogni lavoro porta la FOTOGRAFIA della zona (`world/mesher-foto.js`, un
  Uint16Array ±4 in pianta, 33 in giù, 26 in su) più stagione e definizioni
  dei blocchi che nomina. ⚠ La prima idea — una copia del mondo tenuta in pari
  dagli eventi — sarebbe divergita al primo ruscello: la simulazione
  dell'acqua scrive SILENZIOSA. ⚠ La stagione di là si mette con
  `impostaMescolanza`, non `impostaStagione` (che ritinge il fogliame dalla
  fabbrica, che nel Worker non c'è). ⚠ `test/mesher-foto.test.mjs` pretende gli
  stessi triangoli in linea e dal Worker: se si allunga qualcosa che il mesher
  legge (una cascata più alta, una riva più larga) si allargano i margini LÌ.
  Il Worker è il quarto ingresso di `pubblica.mjs`: se manca accanto a main.js
  si torna in linea in silenzio. `costruisciChunkDati` è la funzione pura
  condivisa; `_applica` è l'unico posto che tocca la fabbrica.
- **Le materie arrivano al pixel** (`world/materie.js`, `motore/stile.js`): il
  mesher scrive `aMateria` per vertice (0 = nessuna, n = riga + 1) in OGNI
  Costruttore — anche pelle, anteprima, schegge e flora a zero — e il vertex
  shader del mondo pesca la riga in `uMaterie[16]` (emiss, curva, glintR,
  riflette). ⚠ NEL VERTEX, non nel fragment: GLSL ES 1.00 garantisce l'indice
  dinamico sugli array di uniform solo lì; la varying è costante sul triangolo.
  ⚠ Ogni mesh che usa `matMondo` DEVE avere il buffer `aMateria` (anche tutto
  a zero): senza, l'attributo è spento e si legge di traverso in silenzio.
  ⚠ `Vertex_Definitions` e `Vertex_After_WorldPosComputed` sono SETTORI come
  `Fragment_Definitions`: si passa da `aggiungiDefinizioniVertex` /
  `aggiungiDopoWorldPos` (stile.js), o la risacca cancella le materie.
  Per pixel: emissione (scavalca ombra e notte), brillio a step verso il sole,
  cielo dello specchio simulato (la tinta dell'ombra, che È il cielo), curva
  della banda delle lampade — tutto piatto, tutto binario. Il §13 è completo.
- **La frontiera** (`world/frontiera.js`, `?infinito` o `?infinito=seme`): il
  mondo si genera per chunk davanti a chi cammina (fino a `resa` + 32 blocchi,
  quattro chunk per giro, dal più vicino) e si scarica dietro (oltre `resa` +
  96). ⚠ Un chunk è il suo SEME più le MODIFICHE del giocatore: il mondo le
  annota per chunk (`mondo.modifiche`, solo scritture NON silenziose) e le
  riapplica alla rigenerazione — un albero tagliato resta tagliato. ⚠ Le
  decorazioni si posano NON silenziose e allo scarico si emette un `togli`
  per ciascuna: `gioco/decoro.js` impara dagli eventi, e una posa silenziosa
  darebbe l'albero nel mondo e nessun modello a schermo. ⚠ Con la frontiera
  la griglia dei muri è una FINESTRA che segue chi guarda (`_seguiFinestra`
  in world/mesher.js): ±48 blocchi in pianta, ricentrata quando ci si
  allontana di 16 dal centro, letta solo dai chunk che tocca. I cambi fuori
  dalla finestra in pianta si scartano PRIMA di `_rillumina` (la frontiera
  genera a novanta blocchi: sono migliaia di celle a giro che non riguardano
  nessun muro vicino); se il tetto dei cambi è scattato si guarda se un chunk
  sporco tocca la finestra e solo allora si rifà. Una lampada FUORI dalla
  finestra non trova muri e passa attraverso tutto: a 48 blocchi è già nella
  nebbia, ed è il compromesso dichiarato. Il pannello Mondo dice «griglia:
  finestra». ⚠ La scatola in pianta è fissa sulla finestra, non sui blocchi:
  un blocco posato al bordo non la fa crescere; uno posato sopra il TETTO sì,
  come senza streaming (`applicaCambi` torna false → ricalcolo).
  `generaChunkOpenWorld` è la stessa terra dell'open world senza l'anello di
  bordo e senza i fiumi (non locali); niente tetti globali su alberi e lampioni.
- **Le uniform delle lampade si scrivono una volta per fotogramma per
  PROGRAMMA** (stile.js): `onBindObservable` scatta per ogni mesh in ogni
  passata, e riscriveva tre array da 24 sempre uguali. Il programma si timbra
  col `frameId`; uno ricompilato è un oggetto nuovo e si riempie da sé. La
  tavolozza delle materie si scrive quando `materie.versione` sale (l'Officina).
- **L'Officina** (`src/officina/`, si apre con `?officina`): la cornice scura
  attorno alla tela e il pannello generato dai REGISTRI che ogni modulo dichiara
  accanto al suo codice; ogni modifica è un COMANDO annullabile e serializzabile
  (`comandi.js`). Dal cloud sono entrati i registri del MONDO (`registroMesher`
  in world/mesher.js: chunk, pelli, coda, Worker, raggi, e la colonna `pieno`
  del profilo) e delle MATERIE (`registroMaterie` in world/materie.js: la
  tavolozza per pixel dal vivo, che alza `versione`). ⚠ `world/` resta senza
  motore anche nei registri: `pieno` lo scrive chi chiama, con `rig.applicaProfilo`.

### ⚠ PER LA SESSIONE ACQUA (02/09/2026): cosa è cambiato sotto i piedi, e le corsie

Il cloud ha fuso R3 in `sorgente`. Chi riprende l'acqua parte da qui, e queste
sono le cose che la toccano direttamente:

- **`fabbrica.js` importa `aggiungiDefinizioniVertex`** e il mondo nasce con
  `{ materie: tavolozza }`. La risacca e ogni altro innesto sul vertex del
  mondo passano da `aggiungiDefinizioniVertex` / `aggiungiDopoWorldPos`
  (stile.js): una `Vertex_Definitions(...)` scritta a mano cancella le materie
  in silenzio, esattamente come `Fragment_Definitions` cancellava le lampade.
- **Ogni mesh che usa `matMondo` porta `aMateria`** (anche tutto a zero). Se
  l'acqua fa nascere una mesh nuova col materiale del mondo (schegge, riva,
  anteprime) il buffer va messo, o l'attributo si legge di traverso.
- **`costruisciChunkDati(mondo, kc, livello, soloAcqua)`** è la funzione pura
  del mesher, e gira anche nel Worker su una FOTOGRAFIA (`mesher-foto.js`:
  ±4 in pianta, 33 in giù, 26 in su). Se l'acqua legge più lontano (una
  cascata più alta, una riva più larga) i margini si allargano LÌ, e
  `test/mesher-foto.test.mjs` te lo dice: pretende gli stessi triangoli in
  linea e dal Worker. Il chunk con `soloAcqua` rifà solo la mesh dell'acqua,
  e questa strada è quella che la simulazione dei ruscelli batte di continuo.
- **Le uniform per programma si scrivono una volta per fotogramma** (timbro
  `effect._leafyGiroLuci === frameId` in stile.js). Se l'acqua aggiunge
  uniform «tutte uguali per ogni mesh» in un `onBindObservable`, si usa lo
  stesso timbro: le passate dell'acqua moltiplicano i bind, non i valori.
- **Con `?infinito` la simulazione dell'acqua scrive silenziosa e la frontiera
  NON la annota**: un chunk rigenerato torna al seme più le modifiche del
  giocatore, e i ruscelli ripartono da zero. È voluto (il diario serve alle
  mani, non alla fisica), ma se un test di acqua cammina lontano se ne ricordi.
- Le prove sono 279 e si lanciano con `npm test`: prima di ogni push, verdi.

**Le corsie**, per non pestarsi i piedi: il cloud sta sulle OMBRE
(`motore/motore.js` cascate e `_ombraOgni`, `main.js` `firmaQuiete`,
`motore/qualita.js` colonna `ombraOgni`, `motore/luci.js`) e poi griglia dei
muri che segue la camera e compressione delle colonne. La sessione acqua sta
su `motore/acqua.js`, le ricette, le passate e `docs/ACQUA*.md`. Se serve
toccare un file dell'altra corsia, si lascia una riga qui sotto prima di
farlo. Il cloud rilegge `sorgente` a ogni controllo: una nota in CLAUDE.md
spinta su `sorgente` arriva.

## ⚠ IL NUCLEO (`src/nucleo/`, dal 02/09): la rifondazione, fase per fase

Il motore nuovo cresce accanto al vecchio (docs/RIFONDAZIONE.md). Regole:
- **Niente Babylon in `nucleo/`**, mai: parla WebGL2 direttamente. La regola
  «fuori da `src/motore/` non si nomina Babylon» vale anche qui, al contrario:
  dentro `nucleo/` non si nomina neanche `motore/`.
- **Il formato del vertice sono otto byte** (`nucleo/formato.js`) e gli indici
  sono condivisi: un chunk = un VAO + un VBO + un `drawElements`. Si prova in
  Node come `world/`.
- **La luce è cotta** nel vertice (cielo 4 bit, blocco 4 bit); il sole
  direzionale è horizon mapping sulla mappa delle altezze, nel fragment.
- ⚠ Un uniform usato in tutti e due gli shader deve avere la STESSA precisione
  (`highp` dichiarato nel fragment), o il link fallisce con «precisions differ».
- Il banco `nucleo.html` ha il 🩺 del gioco: la porta di ogni fase si legge da
  lì, sul Mali, non da SwiftShader. **F0 misurata: 89-90 fps fino a 964k
  triangoli e 256 disegni, JS 0,6 ms** (rampa del 02/09).
- **Il colore è RGB cotto nel vertice** (tre byte), non un indice di palette:
  il mesher del nucleo (`nucleo/mesher-nucleo.js`) riusa `paletteBlocco`,
  `tintaPalette`, `tingiMateria` e `coloreFaccia` del mondo, quindi i colori
  sono ESATTAMENTE quelli del gioco. La materia (emissione ecc.) sta in 4 bit.
- **I modelli sono triangoli piatti cotti offline** (`scripts/converti-nucleo.mjs`
  → `modelli/nucleo/*.bin`, formato `LNM1`) e si disegnano a istanze in
  `nucleo/modelli.js`: un disegno per tipo. Il convertitore legge il GLB e il
  PNG da sé (niente Babylon, niente dipendenze): se si cambia un modello si
  rilancia lui, e `pubblica.mjs` copia `modelli/` intera. ⚠ La materia sta nel
  byte 15 e si legge con `vertexAttribIPointer`: come BYTE normalizzato si
  perderebbe.
- ⚠ Il fragment lavora in spazio lineare e RICODIFICA in sRGB alla fine
  (`pow(1/2.2)`): senza, tutto esce scuro e saturo. ⚠ La mappa delle altezze
  per l'horizon mapping è in QUOTA DI MONDO (lo scarto del chunk è dentro
  `uChunk`): con lo scarto anche lì il mondo stava sotto la mappa, tutto in
  ombra a mezzogiorno.

## «Desktop» non vuol dire «GPU da desktop»

⚠ **Il Chromebook del committente ha una Intel HD 400 del 2015, che è più debole
del Mali-G68 del suo telefono.** Ma ha un mouse, quindi prendeva la scala desktop
e le impostazioni pesanti. Misurato: sceso fino all'**ultimo** gradino
(storia `[0, 3, 4]`), faceva ancora **13 fps**, e non aveva più strada davanti.

Si era preso tutte e tre le cose più care del motore:

| | perché | costo |
|---|---|---|
| `ombreLampade` | `!mobile` | cammino nei voxel **per pixel per luce** — e alle 20:18 c'erano 13 lampioni accesi |
| `acquaRicca` | `!mobile` | shader ricco, e la scena è quasi tutta acqua |
| `antialias` | `!mobile` | MSAA sul canvas: quadruplica il riempimento |

Nel commento di `fissiDiAvvio` c'era già scritto, di mio pugno: «su Mali-G68 il
cammino nei voxel costa ~30% degli fps». Non l'avevo collegato al fatto che una
macchina con un mouse potesse essere più lenta di un telefono.

### Scendere è un'IPOTESI, e va verificata

⚠ **Da un rapporto vero, Adreno 619**: storia dei gradini `[0,3,4,3,2,1,0,1,2,3]`
e storia degli fps `25,25,25,25,25,…` — **dieci** cambi di qualità, dal massimo
al minimo e ritorno, e gli fps fermi a 25. Su quel dispositivo il collo di
bottiglia era altrove (throttling, risparmio energetico, un tetto del browser):
abbassare la qualità buttava via grafica in cambio di **zero**.

**Una scala che non verifica è una scala che spera.** Adesso: si scende, si
misura per tre giri, e se il guadagno è sotto l'8% si RISALE e ci si dichiara
`insensibile`. Stessa velocità e grafica migliore — il caso in cui non c'è niente
da scegliere.

⚠ **E l'attesa prima di riprovare RADDOPPIA a ogni buca.** Con l'attesa fissa a
un minuto la cura diventava il male più lento: `1,0,1,0,1,0,1,0,1,0` — un tuffo
al minuto, cioè un lampeggio di qualità ogni sessanta secondi. Ma «mai più» non
va bene lo stesso: il telefono si raffredda, il browser esce dal risparmio. Uno,
due, quattro, otto minuti, fino al tetto — e una discesa che *serve* azzera il
conto. La prova ha i denti: togliendo la guardia tornano 66 oscillazioni in 17
minuti.

⚠ **Una conseguenza da sapere**: il caso «scende fino in fondo» non è più
esprimibile con una macchina che guadagna davvero. Chi guadagna il 10% a gradino
arriva nella fascia comoda in due mosse e si ferma — ed è quello che deve fare.

### E la scala pompava — questo è quello che si VEDEVA

⚠ **`misuraHz` misurava quanti fotogrammi fa la MACCHINA, non quanti ne mostra
lo SCHERMO.** Sul Chromebook, che all'avvio faceva ~25 fps, ha letto «25 Hz».
Da lì: bersaglio 25 → `sogliaSu` 23, `sogliaGiu` 24 — **invertite**. Con le
soglie invertite ogni singola misura o fa scendere o fa salire, la fascia
«fermi, si sta bene» sparisce, e la scala pompa senza fermarsi:

    storia dei gradini: [5,6,5,4,3,2,3,4,5,4,3,2,3,4,5,6,5,4,3,2]

Tre giri completi in un minuto. Il committente l'ha visto come «la grafica è
peggiorata di molto» — e aveva ragione: non era più bassa, era **instabile**.

⚠ **La differenza fra le due si vede nella REGOLARITÀ, non nel valore.** Uno
schermo sincronizzato consegna 16,7 · 16,7 · 16,7; una macchina in affanno
consegna 38 · 51 · 42 · 61. Se sono regolari è lo schermo e ci si crede; se sono
sparsi si dice sessanta, e sarà la scala a scendere — ma su una misura vera
invece che su un'ipotesi circolare («va piano, quindi il bersaglio è piano,
quindi va bene»).

⚠ **E si ripara in DUE posti.** La causa è `misuraHz`, ma una scala che si
autodistrugge se qualcuno le passa un numero storto è fragile per costruzione:
`sogliaGiu` non può più scavalcare `sogliaSu`, e c'è una prova che spazza tutte
le frequenze da 1 a 300.

**Due correzioni.** La scala desktop ha adesso la stessa **corsia d'emergenza**
di quella mobile (7 gradini, fondo a `scala 0.42 · dist 40 · erba 0`) — il
commento che la giustificava («senza, le GPU più deboli restavano incollate sotto
i trenta senza via d'uscita») l'avevo scritto solo per mobile.

E i tre fissi non si decidono più con «ha un mouse?» ma con **cosa ha retto la
volta scorsa**: quando la scala tocca il fondo ed è ancora sotto, `adatta.arresa`
diventa vero e la regia sale di **un gradino** di alleggerimento.

⚠ **Un gradino per volta, non tutto insieme** — e la prima versione sbagliava
proprio qui. Committente: «la grafica è peggiorata di molto ma ho guadagnato sì e
no 5 fps». Aveva ragione due volte: il prezzo era alto, e spegnendo tre cose in
un colpo non sapevo nemmeno quale delle tre lo stesse pagando. *Tre modifiche e
una misura sola non è una misura.*

| gradino | spegne | perché in quest'ordine |
|---|---|---|
| 1 | cammino nei voxel | l'unico con un costo misurabile qui (26,0 → 24,7 ms a 33 Mpx), e il meno visibile |
| 2 | + MSAA | quadruplica la banda del framebuffer: invisibile su una RTX, forse dominante su una integrata |
| 3 | + acqua ricca | ultimo perché l'acqua è mezzo schermo |

⚠ **E la misura di quell'ordine non si trasferisce**, e va detto: una RTX 4060 ha
banda da vendere, e l'MSAA costa *banda*. Sulla Intel HD 400 può pesare dieci
volte di più che qui — le due macchine differiscono proprio nella dimensione che
conta. Per questo la scelta la fa la macchina salendo di gradino, e per questo
c'è `?senza=voxel,acqua,msaa` per misurarli uno alla volta là dove serve.

⚠ **Perché una misura e non un elenco di nomi di schede video**: l'elenco è la
soluzione che sembra ovvia e marcisce in un anno. Costa un ricaricamento la prima
volta, e in cambio non c'è niente da tenere aggiornato.

⚠ **E non si cancella mai da sé.** In modalità leggera gli fps salgono, quindi
una cancellazione automatica farebbe ripartire pesante → arrendersi → ripartire
pesante: un'altalena a ogni ricaricamento. Si azzera con **`?pesante`**
nell'indirizzo — via URL e non con un tasto, perché il caso d'uso è un Chromebook
piegato a tablet, dove una scorciatoia da tastiera non esiste. Il pannello lo dice.

## Lo strumento che mentiva

⚠ `ombreMs` riportava **3,21 ms col sole spento** — più che con le ombre accese
(2,17) — mentre i disegni crollavano da 82 a 50, cioè la passata era davvero
sparita. Quel contatore conserva l'ultima media anche quando nessun bersaglio
viene più disegnato. Sul rapporto del Chromebook diceva «ombre 34 ms» su un
fotogramma da 74, con il sole spento, e ci ho quasi passato mezz'ora dietro.

⚠ **Uno strumento che mente è peggio di uno che manca**: se non ci fosse stato
avrei cercato altrove; dicendo un numero grosso mi ha mandato dalla parte
sbagliata con l'aria di aiutarmi. Adesso vale 0 quando il sole è spento.

## L'avvio: sei secondi di schermo fermo, poi uno e mezzo

⚠ **Il numero più brutto del primo rapporto vero dal telefono** (Mali-G68) non era
il fotogramma, era l'attesa: `worldgen 620 ms · mesh 5.507 ms`. Cinque secondi e
mezzo di pagina **congelata** prima di vedere qualcosa.

Misurato dove andavano, qui: dei 657 ms, **622 sono i chunk** (12,7 l'uno per 49)
e solo 34 la griglia di luce. E la macchina per non farli tutti insieme **c'era
già, inutilizzata**: `mesher.aggiorna` scorre una coda con un bilancio di 3 ms per
fotogramma, *ordinata per distanza dal giocatore*. Bastava non riempirla di colpo.

| raggio costruito subito | chunk | blocco |
|---|---|---|
| tutti (com'era) | 49 | 657 ms |
| 2 (5×5) | 25 | 443 ms |
| **1 (3×3)** | **9** | **204 ms** |

I 40 rimasti entrano da soli in 803 ms, un chunk per fotogramma, senza che il
gioco smetta di rispondere. Sul telefono dovrebbero essere ~1,5 s di attesa invece
di 5,5.

⚠ **Il prezzo è che il mondo si vede popolare**, e vale la pena: uno schermo fermo
si legge come un gioco rotto, un mondo che si riempie si legge come un mondo che
carica. `RAGGIO_SUBITO` in `world/mesher.js` è la manopola.

⚠ **E il difetto che questa modifica poteva introdurre è muto**: `ricostruisciTutto`
finiva svuotando *tutte* le code «perché parlano di un mondo che non c'è più» —
verissimo per quelle vecchie, fatale per quella che adesso riempie lui stesso due
righe sopra. Un chunk che non arriva mai si vede come un buco lontano, cioè si
scambia per LOD e non per guasto. `test/mesher-avvio.test.mjs` lo prende:
rimettendo il difetto dice «9 chunk invece di 36».

## Le prestazioni, e dove sono andate a finire

⚠ **Prima di toccare qualcosa, si guarda il pannello.** Le tre righe in alto a
sinistra dicono `disegni`, `triangoli` e `ombre ms`, e ci sono perché su un
telefono non c'è una console: quello che arriva è uno scatto dello schermo, e
senza quei numeri «va piano» resta un'opinione. Lo strumento è
`SceneInstrumentation` di Babylon, acceso in `motore/motore.js` e riesposto come
`rig.misura` — fuori dal motore Babylon non si nomina.

Misurato su questa macchina (RTX 4060, 608×910, q0), e in quest'ordine:

| | prima | dopo | come |
|---|---|---|---|
| triangoli per fotogramma | 553.641 | **258.729** | gli aloni |
| di cui soli aloni dei lampioni | 294.912 | ~10.000 | 6 spicchi invece di 14, e solo quelli ACCESI e VICINI |
| chiamate di disegno | 273 | 273 | *(il taglio delle ombre non scatta su un mondo più piccolo di `shadowMaxZ`)* |
| resa delle ombre | 2,12 ms | 1,75 ms | rifatta ogni 2 fotogrammi dal gradino q1 in giù |

**Le manopole di Babylon che erano tutte nella posizione sbagliata** — sono
impostazioni pensate per un editor, non per un gioco:
`skipPointerMovePicking`, `constantlyUpdateMeshUnderPointer`,
`blockMaterialDirtyMechanism`, `enableOfflineSupport`.

⚠ Ma **quanto valgano va misurato, e la prima di quelle quattro vale poco**:
avevo scritto che senza `skipPointerMovePicking` Babylon interseca mezzo milione
di triangoli a ogni movimento del puntatore. Falso — quasi tutte le nostre mesh
hanno `isPickable = false`, quindi non c'è quasi niente da provare. Cronometrati
400 eventi: 11,5 ms in tutto senza, 8,1 con. Nove *millesimi* di millisecondo per
evento. Si tengono perché sono gratis e corrette, non perché spostino i numeri —
e questa riga sta qui perché è esattamente il genere di frase che, non misurata,
diventa una spiegazione comoda per un problema che sta altrove.

⚠ **Il numero che conta sul telefono sono i DISEGNI, non i triangoli**: ogni
chiamata è lavoro di CPU nel browser, e la CPU di un telefono è cinque volte più
lenta. La mappa a cascate ne fa **una per mesh PER CASCATA** — misurato:
svuotando l'elenco degli ombreggianti si passa da 273 a 65. Da qui
`fabbrica.aggiornaOmbre`, che tiene nell'elenco solo i chunk entro `shadowMaxZ`:
provato restringendo la portata a 30, 52 mesh → 22 e 273 disegni → 153.

⚠ **E si misura anche quello che NON è il problema.** Il nostro JavaScript per
fotogramma (mesher, erba, giorno, mira, decorazioni, barra) sta sotto i
**0,05 ms** in totale: anche dieci volte più lento su un telefono resterebbe
mezzo millisecondo. La risoluzione, su desktop, non sposta niente (0,14 → 3,19
Mpx a parità di tempo): lì si è incollati al vsync.

## Il bottone 🩺 — la diagnostica arriva da sola

⚠ **Il canale di prima era uno scatto dello schermo mandato a mano**, e aveva due
difetti: nel pannello ci sta quello che ci sta (non quello che serve a *quella*
domanda), e uno scatto è un **istante** — non dice che il gradino di qualità è
sceso tre volte in un minuto, che è esattamente il genere di cosa che spiega un
difetto.

Nel gioco: **🩺** sul bordo sinistro. Si scrive cosa si stava facendo, si mette la
password una volta per dispositivo, e va. Due strade, provate in quest'ordine:

| | dove finisce | quanto dura | quando |
|---|---|---|---|
| **in casa** | `diagnostica/` sul PC | per sempre | se la pagina è servita da `npm run diagnostica` |
| **cloud** | un messaggio su ntfy.sh | 12 h (3 h con lo scatto) | da qualunque parte del mondo |

```bash
npm run diagnostica   # serve il gioco E raccoglie (sostituisce serve.py)
npm run leggi         # tira giù i rapporti arrivati dal cloud
```

### L'indirizzo si ricava dalla password

⚠ **E questa è la riga che rende la cosa sensata.** Su ntfy un «argomento» è
pubblico: chi ne conosce il nome può leggerlo e scriverci. Se il nome stesse
scritto nella pagina, chiunque apra il sorgente leggerebbe le nostre
diagnostiche — e la password lì accanto non proteggerebbe niente. Ricavandolo da
`sha256('leafy-shadows/' + password)`, nel sorgente **non c'è nulla**: l'indirizzo
esiste solo nella testa di chi ha la password. 96 bit, non si indovina.

⚠ **E la password non lascia mai il dispositivo**: serve a *calcolare* l'indirizzo,
non viene spedita. A ntfy arriva solo il rapporto, su un argomento dal nome
insignificante.

⚠ **Il difetto più subdolo di tutta la faccenda** è che i due lati calcolino
indirizzi diversi: il gioco direbbe «mandato ✔» (vero), il lettore «nessun
rapporto» (vero), e i rapporti finirebbero in un angolo di internet dove non
guarda nessuno. Nessun errore, nessun avviso. `test/canale.test.mjs` confronta le
due implementazioni — `crypto.subtle` nel gioco, `node:crypto` nel lettore.

### `crypto.subtle` non c'è sempre — e questa è la trappola vera

⚠ I browser espongono `crypto.subtle` **solo nei contesti sicuri**: https, oppure
localhost. Un telefono che apre il gioco su `http://192.168.1.31:8144/` — cioè il
modo normale di provarlo in casa — lo trova **undefined**. Senza impronta non c'è
indirizzo: il bottone sarebbe morto proprio sul dispositivo per cui esiste, e
l'errore usciva come «niente rete», che manda a cercare dalla parte sbagliata.

⚠ E **il ripiego deve dare lo stesso identico numero**, non uno diverso ma
altrettanto buono: se il telefono calcolasse un nome e il lettore un altro, i
rapporti finirebbero dove non guarda nessuno, senza nessun errore. Quindi
`ui/sha256.js` — SHA-256 scritta a mano, ~40 righe — confrontata bit per bit con
`node:crypto` su **tutte** le lunghezze da 0 a 130 byte, perché i confini del
riempimento (55/56, 119/120) sono dove un'implementazione sbagliata dà
un'impronta plausibile e falsa.

### Il bottone si deve VEDERE

⚠ Committente: «sul cellulare non vedo il tasto per la diagnosi e dove mettere
poi la password». Erano due tondini da 34 px, semitrasparenti, sul bordo sinistro,
sopra una scena piena di verde. Un'icona da sola chiede di indovinare cosa fa;
una parola no. Adesso sono due **pillole con la scritta** — `📱 a dito` e
`🩺 diagnosi` — il campo della password ha un bordo scuro e il pannello dice a
cosa serve («non è un lucchetto: è l'indirizzo dove finisce il rapporto»). E il
pannello dei numeri, che è la cosa che si guarda quando qualcosa non va, finisce
con la riga che dice dov'è il bottone.

### Il numero dei disegni è una MEDIA, e c'è voluto per arrivarci

⚠ Da quando la mappa d'ombra si rifà ogni due fotogrammi, **metà dei giri non
hanno il passaggio d'ombra**: il contatore istantaneo esce 61 o 125 secondo su
quale dei due capita la lettura — cioè una moneta. Per il numero con cui si
diagnostica un telefono che non si può profilare, una moneta è peggio di niente:
la prima misura buona mi avrebbe fatto credere di aver dimezzato le chiamate.

⚠ E la media di Babylon (`drawCallsCounter.lastSecAverage`) per questo contatore
resta a **zero**: non è alimentata. Me ne sono accorto solo perché il pannello
diceva `disegni 0` invece di un numero storto — un difetto che si è denunciato
da sé, per fortuna. La media la fa `Rig.avvia`, campionando dopo `scena.render()`.

### I limiti, misurati

Provato su ntfy.sh, non dedotto: fino a **4 KB** il corpo torna come messaggio;
sopra, ntfy lo trasforma in un **allegato** (200 in tutti i casi fino a mezzo
megabyte, scaricato intero). Un rapporto con lo scatto sta sui 60 KB → allegato,
**3 ore**; senza scatto sta in **1 KB** → messaggio, 12 ore. Da qui la casella
«con lo scatto» nel pannello.

### Il collettore in casa può finire su internet

⚠ Serviva la **cartella del progetto**: aperto al mondo, un `GET
/diagnostica.chiave` avrebbe consegnato la password. Adesso c'è un elenco di
divieti (tutto ciò che comincia per punto, la chiave, i rapporti già arrivati, i
log) **più** una lista di estensioni permesse, e il controllo si fa sul percorso
*sciolto* — `/./x`, `/a/../x` e `/x` sono lo stesso file scritto in tre modi.
Verificato con `curl`: 404 su tutti e quattro i modi di chiedere la chiave.

⚠ E un **lucchetto sui tentativi**: otto sbagliati ogni dieci minuti per
indirizzo. È la protezione vera per una password corta su un indirizzo pubblico.
La chiave giusta passa *comunque* e riapre il contatore — al contrario, chi
sbaglia otto volte a digitare su un telefono resterebbe chiuso fuori proprio
quando finalmente la azzecca, e alla forza bruta non toglierebbe un tentativo.

Il rapporto lo costruisce `ui/rapporto.js`, che è una **funzione pura provata in
Node**: un rapporto di diagnostica è esattamente la cosa che non ci si accorge di
aver rotto — se un giorno smette di metterci gli fps, il sintomo è che i rapporti
arrivano e *sembrano a posto*.

⚠ **Il gettone sta in `diagnostica.chiave`, e lo decide il committente** — se il
file non c'è se ne genera uno casuale, se c'è vale quello scritto dentro. La
scelta è sua e la ragione è buona: una chiave che si ricorda si digita su cinque
dispositivi diversi senza sbagliare, una da trentadue cifre esadecimali no. Il
prezzo — detto una volta e poi basta — è che quel file è in chiaro (0600 e fuori
dal repo, ma in chiaro) e la stessa stringa finisce nel `localStorage` di ogni
dispositivo autorizzato. Va bene per decidere chi manda un rapporto su una rete
privata; non va bene per niente che valga di più.

⚠ **Il confronto si fa dopo un `trim`, di qua e di là**: una chiave si digita a
mano su un telefono, e le tastiere mobili ci attaccano volentieri uno spazio in
coda o una maiuscola all'inizio. Il campo ha `autocapitalize="none"`,
`autocorrect="off"`, `spellcheck="false"` — un rifiuto per uno spazio invisibile
è il genere di cosa che fa dare la colpa al codice sbagliato.

⚠ **E nel rapporto non c'è niente di personale**: scheda video, fotogrammi,
triangoli, errori. `ui/rapporto.js` è il posto dove fermarsi a pensarci se un
giorno servisse aggiungere un campo — e c'è una prova che verifica che il
**gettone non finisca mai dentro**, se no basterebbe leggere un rapporto per
poterne mandare altri.

⚠ **Lo scatto non si prende dalla tela.** Su mobile `preserveDrawingBuffer` è
spento apposta, e con quello spento `toDataURL` torna un'immagine **vuota** — ci
sono già cascato, con quattro misure di pixel di fila che tornavano zero. Si
ridisegna in un bersaglio apposta (`rig.scatto`), che funziona in tutti e due i
casi, a 600 px e in webp: da un telefono con dpr 3 una figura a piena risoluzione
sono megabyte, e un rapporto che non parte è peggio di un rapporto senza figura.

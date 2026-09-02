# LA RIFONDAZIONE — un motore che a ULTRA gira a vsync su un telefono medio-basso

Mandato del committente (02/09/2026, dopo il rapporto 🩺 dal Mali-G68: 44 fps a
q0 con 36 disegni, prima 30 fps con 109):

> Da telefono la grafica scende automaticamente e quindi non va a ultra: cosa
> sbagliata per i test. In ogni dispositivo la grafica deve essere uguale, non
> diversa, si crea inconsistenza. Gli fps sono disastrosi: dobbiamo puntare
> all'AR e alla grafica al massimo — centinaia di oggetti con fisica, migliaia
> di blocchi con modelli custom e materiali PBR — al massimo degli fps, quindi
> i 144 Hz di un cellulare di fascia medio-bassa. Serve rifare tutto da zero:
> il sistema perfetto, stupendo e ottimizzatissimo, con le tecnologie storiche
> di ottimizzazione che hanno reso vecchi giochi dei capolavori.

## 1. Il bilancio, prima di tutto (e perché oggi non ci sta)

| schermo | budget a fotogramma | di cui Chrome (compositing, input) | resta a noi |
|---|---|---|---|
| 60 Hz | 16,7 ms | ~1,5 ms | ~15 ms |
| 90 Hz (il Mali-G68 del committente) | 11,1 ms | ~1,5 ms | ~9,5 ms |
| 120 Hz | 8,3 ms | ~1,5 ms | ~6,8 ms |
| 144 Hz | 6,9 ms | ~1,5 ms | ~5,4 ms |

Il browser non supera il refresh del pannello: su un telefono a 90 Hz «144» non
esiste, il bersaglio è **il vsync del pannello**, cioè 90 o 120 secondo il
modello. Il numero da inseguire è il TEMPO di fotogramma sotto gli 8 ms.

Dove vanno oggi i 22,8 ms del Mali a ULTRA (rapporto delle 11:22, notte,
13 lampade, 36 disegni, 129k triangoli):
- **luce per pixel**: il ciclo delle lampade (fino a 24) in ogni frammento, più
  il campionamento della mappa d'ombra a cascate — è la fetta più grossa, e
  cresce con i pixel (dpr 1,5 su 384×721 → 576×1081) e con le lampade accese;
- **erba**: 55.716 lamelle a istanze sottili, animate nel vertex, sopra il
  terreno (overdraw);
- **passate**: la mappa d'ombra (2 cascate, ogni 3 giri) — oggi l'unica rimasta
  sul telefono, e già così vale ~8 disegni a giro di media;
- **JS a fotogramma**: Babylon per disegno (bind, uniform, osservatori) ~0,1-0,2
  ms l'uno su Android; 36 disegni sono 4-7 ms di CPU prima ancora della GPU;
- **scatti** (p99 74 ms): risemina dell'erba, caricamenti in GPU, GC.

Il punto non è «ottimizzare» questo: è che il costo non è FISSO. Ogni lampada,
ogni cascata, ogni passata aggiunge. Un motore che regge a ULTRA ovunque ha un
costo che non dipende da cosa c'è in scena, e si decide a tavolino.

## 2. Le tecniche storiche, e cosa comprano

Sono quelle di Quake, Minecraft, dei giochi PS1/PS2 e dei primi mobile 3D:
tutte fanno la stessa cosa — **spostano il costo dal fotogramma alla
costruzione**.

1. **Luce cotta nei vertici (Quake/Minecraft)**. Niente mappa d'ombra, niente
   ciclo delle lampade per pixel. Due canali per cella, 4 bit l'uno: luce del
   cielo (propagata in giù dalle colonne, con la caduta laterale che fa le
   ombre morbide sotto gli alberi e nelle grotte) e luce di blocco (propagata
   dalle lampade, raggio 15). Il mesher le scrive nel vertice; il ciclo del
   giorno moltiplica la luce del cielo per il colore del sole. Costo a
   fotogramma: **zero**. Costo a modifica: la ripropagazione locale (≤ 15
   celle), che Minecraft fa su un telefono da dieci anni.
   *Ombre direzionali del sole*: con la mappa delle altezze (una texture 2D,
   un texel per colonna) e 8-12 passi nel frammento verso il sole — «horizon
   mapping», i motori di terreno del 2000. Niente acne per costruzione, niente
   cascate, un costo fisso di poche letture di texture per pixel. È l'unica
   cosa «per pixel» che resta, ed è opzionale a schermo.
2. **Una chiamata di disegno per chunk**. Un atlante di texture, un materiale,
   vertici impacchettati in 8-12 byte (posizione intera, normale a 3 bit, luce,
   indice di materia) e greedy meshing. Cinquanta chunk visibili = cinquanta
   disegni, e basta. Le «materie» (emissione, brillio, riflesso simulato) si
   leggono per vertice come oggi: la tavolozza resta.
3. **L'erba nel mesh del chunk**. Quad incrociati generati dal mesher sulle
   cime d'erba, vento per hash nel vertex shader, colore dal vertice. Niente
   istanze da gestire, niente risemina, culling gratis col chunk, densità
   decisa a tavolino e uguale ovunque.
4. **Acqua a una passata**. Onde nel vertex, fresnel + cielo dipinto per il
   riflesso, profondità COTTA nel vertice (il mesher la sa: quante celle
   d'acqua ci sono sotto), caustiche come texture animata sul fondale. Niente
   specchio, niente depth pass, niente rifrazione: le tre rese in più che
   hanno portato la build del 31/08 da 80 a 12 fps non esistono per progetto.
   Lo specchio vero resta un LUSSO della scheda Ombre/Acqua dell'Officina per
   il desktop, non parte del gioco.
5. **Modelli in un atlante e a istanze**, un materiale solo per tutti (la
   stessa luce cotta: i modelli leggono la luce della cella in cui stanno,
   come i mob di Minecraft). Oltre una distanza, cartelli (impostor) a due
   quad. I «PBR» sono simulati per vertice e per materia: metallo = brillio a
   gradini + riflesso del cielo dipinto, specchio = tinta del cielo, emissivo =
   scavalca la luce. È il §13 di oggi, portato nel formato nuovo.
6. **Mondo in array tipizzati** (un `Uint16Array` per chunk, 16×16×H), non una
   `Map` con chiavi stringa: dieci volte meno memoria, lettura O(1) per la
   fisica e per la propagazione della luce, fotografia per il Worker gratis.
7. **Fisica a passo fisso** (30 Hz), scatole contro la griglia dei voxel
   (lettura diretta nell'array), griglia spaziale per corpo-contro-corpo,
   corpi che DORMONO. Centinaia di corpi sono decine di microsecondi l'uno se
   non c'è un motore di fisica generico in mezzo.
8. **Culling da vecchio gioco**: frustum per chunk, occlusione per colonne (chi
   sta dietro una collina intera non si disegna), nebbia nel vertex che è
   anche il confine di resa. Nessuna post-passata (niente FXAA/MSAA: lo stile
   piatto e il tetto di dpr fanno il resto).
9. **Zero allocazioni a fotogramma**, un UBO per le uniform, buffer riusati.
   Il JS a fotogramma sotto i 2 ms, misurato.

## 3. Cosa si tiene, cosa si rifà

- **Si tiene** `world/` (mondo, worldgen, frontiera, decorazioni, materie,
  stagioni, pelo): è già senza motore per la regola della casa, ed è
  esattamente il motivo per cui la separazione R3 valeva. Cambia solo il
  deposito (array tipizzati) sotto la stessa API.
- **Si tiene** l'Officina, i registri, la diagnostica 🩺, i banchi.
- **Si rifà** `motore/`: al posto di Babylon usato come motore, un NUCLEO in
  WebGL2 scritto in casa (qualche migliaio di righe: contesto, buffer, tre
  shader, atlante, camera, culling). Babylon resta come attrezzo OFFLINE per
  convertire i modelli GLB nel nostro formato. È la scelta che dà il controllo
  sui disegni, sulle uniform e sulla memoria; WebGPU si valuta dopo, quando
  Android Chrome lo darà a tutti.
- **Si rifà** lo stile: la stessa legge di Leafy (piatto, l'ombra è un
  gradino, l'ombra è del colore del cielo, lampade a bande) espressa su luce
  cotta invece che su mappa d'ombra. Il verdetto sul look resta del
  committente, a scatti affiancati.

## 4. Le fasi, con la porta di ogni fase MISURATA sul Mali (🩺)

| fase | cosa | porta (sul Mali-G68, ULTRA, notte con lampade) |
|---|---|---|
| F0 ✅ | il banco vuoto: nucleo WebGL2, chunk finti nel formato nuovo, luce cotta finta | ≥ 90 fps con 300k triangoli, ≤ 60 disegni, JS < 2 ms — **misurato: 89 fps a 964k triangoli e 256 disegni, JS 0,6 ms** |
| F1 ⏳ | mondo in array tipizzati + mesher greedy; il gioco di oggi disegnato dal nucleo (senza luce) — **primo passo fatto: `?mondo=48`, l'open world vero con la palette di Leafy** | la scena dell'open world a ≥ 90 fps di giorno |
| F2 ⏳ | luce cotta (cielo + lampade) + ciclo del giorno + horizon mapping del sole — **prima stesura fatta: propagazione per chunk, lampade a bande, notte blu** | la notte costa come il giorno; ombre senza acne né scatti |
| F3 | erba nel mesh ✅, acqua a una passata ✅ + specchio (⏳ misura), modelli a istanze ✅ con impostor | parità visiva col gioco di oggi, verdetto del committente |
| F4 | fisica a passo fisso, centinaia di corpi; camera AR (WebXR) | 200 corpi attivi a ≥ 90 fps |

Ogni fase si spinge in `sorgente` e si pubblica: il gioco di oggi resta
giocabile finché il nucleo nuovo non lo supera in TUTTO, e a quel punto si
spegne il vecchio. Nessuna fase dura più di qualche giorno di lavoro; se una
porta non passa, non si va avanti: si misura e si cambia tecnica.

## 4b. Stato

- **02/09, F0 pubblicata**: `nucleo.html` — `src/nucleo/` (formato a 8 byte,
  gl, matrici, resa) + `src/banco-nucleo.js`. Cento chunk di terreno finto,
  224k triangoli, un disegno per chunk, luce cotta, erba nel mesh, horizon
  mapping. In Chromium software: 52 disegni per 117k triangoli in vista, JS
  0,4 ms a fotogramma. La porta si misura sul Mali col 🩺 del banco
  (`?raggio=` chunk per lato, `?erba=` croci per cima, `?ombra=no` spegne
  l'horizon mapping, `?dpr=` tetto di risoluzione).
- **Primo 🩺 dal Mali sul banco (02/09, 14:07): 89 fps PIATTI** (il vsync del
  pannello a 90 Hz), p50 11,2 ms, p99 33 ms, **23 disegni, 52k triangoli in
  vista** (il telefono è verticale: inquadra meno chunk), **JS 0,3 ms**. La
  porta è passata sul primo gradino, ma incollata al pannello: non dice il
  margine. Da qui la RAMPA (`?rampa`): cinque gradini di scena da sei secondi
  (fino a 256 chunk senza frustum, 700k+ triangoli), e la tabella viaggia nel
  🩺. Il gradino in cui il vsync cede È il tetto del nucleo su questo telefono.
- **La rampa dal Mali (02/09, 14:21): 89-90 fps a TUTTI i gradini.** Fino a
  **256 disegni e 964k triangoli** senza frustum, p50 11,2 ms, p99 11,3 ms,
  JS 0,6 ms. Il vsync del pannello non ha ceduto: il tetto del nucleo su
  questo telefono sta OLTRE il milione di triangoli e i 256 disegni. **La porta
  di F0 è passata con un margine di dieci volte** rispetto alla scena del gioco
  di oggi (36 disegni, 129k triangoli, 22,8 ms). È la prova che la tesi della
  rifondazione regge: il costo era il motore, non la scena.
- ⚠ **Il look del banco NON è il look di Leafy**, e il committente l'ha detto
  subito («spero non sia la grafica definitiva o il sistema di luci»). Giusto:
  il banco misura il formato e il costo. Lo stile resta quello scritto in
  CLAUDE.md («LO STILE: piatto, e l'ombra è un gradino»): colori piatti da
  palette con lo stacco cima/lato/fondo, l'ombra a tre bande, l'ombra del
  COLORE DEL CIELO che moltiplica, niente luce emisferica, niente sfumatura per
  normale. La luce cotta (F2) darà al pixel UN numero — sì/no al sole, e la
  banda della lampada — esattamente come oggi lo dà la cascata; cambia da dove
  arriva il numero, non come si dipinge. Il verdetto sul look resta del
  committente, a scatti affiancati col gioco di oggi.
- **02/09, F1 primo passo pubblicato**: `?mondo=48` sul banco disegna l'OPEN
  WORLD VERO di Leafy (stesso seme del gioco) col mesher del nucleo
  (`nucleo/mesher-nucleo.js`): stessi blocchi, stessa palette (stagione,
  rampa per quota, motivi, tinta delle materie) cotta nel vertice. Il formato
  è passato al colore RGB (tre byte) con la materia a 4 bit: fedeltà prima
  di tutto. 49 chunk, 67k blocchi, generazione 57 ms + mesh 174 ms in
  Chromium software. Ancora fuori: alberi e lampioni (modelli, F3), l'acqua
  vera (F3), la luce cotta di grotte e lampade (F2), il greedy meshing e gli
  array tipizzati del mondo (seconda metà di F1).
- **02/09, modelli a istanze** (anticipo di F3, su richiesta del committente:
  «importa i modelli cuboid»): `scripts/converti-nucleo.mjs` cuoce i .glb in
  triangoli piatti (posizione, normale, colore campionato dalla texture a
  palette al centro del triangolo, schiarito ×1,6 come in gioco, la testa del
  lampione emissiva col colore della sua luce) in `modelli/nucleo/*.bin`, con
  un decodificatore PNG scritto in casa: niente Babylon neanche offline.
  `nucleo/modelli.js` li disegna A ISTANZE: un disegno per TIPO. Nel banco:
  61 alberi e lampioni in 2 disegni, 23k triangoli. ⚠ I modelli di Blockbench
  (cuboidi in JSON) entreranno nello stesso .bin: è il formato dell'Officina
  per «programmare nuovi modelli», e il convertitore è il posto dove aggiungerlo.
- **02/09, l'acqua a una passata** (tecnica 4, prima stesura): il mesher del
  nucleo mette l'acqua in un mesh suo (pelo e pareti verso l'aria, mai fra
  acqua e acqua), con la PROFONDITÀ della colonna e il LIVELLO (`acqua~n`)
  nei due nibble di luce del vertice; il vertex abbassa il pelo come `peloDi`
  e lo fa ondeggiare; il fragment fa la legge del lago (azzurro trasparente in
  superficie, violaceo e quasi pieno a dieci blocchi, il cielo capovolto per
  fresnel, un brillio a gradino verso il sole). Disegnata dopo solidi e
  modelli, fusione accesa, profondità non scritta. Culling: lo stesso frustum
  dei solidi, e un chunk senza acqua non arriva neanche al disegno. Niente
  specchio, niente rifrazione, niente depth pass: zero passate. Lo specchio
  vero è la prossima porta di F3, da misurare.
- **02/09, la luce cotta (F2, prima stesura)**: `nucleo/luce-cotta.js` propaga
  per chunk (con un margine di 6 celle) il CIELO dall'alto e dai lati (−1 per
  cella: la grotta è buia, l'imbocco sfuma) e le LAMPADE dalla testa del
  lampione (15, −2 per cella, fermandosi sui solidi: a terra 9, pozza da ~5
  celle come il lampione di Leafy). Il mesher scrive nel vertice la luce della
  cella davanti a ogni faccia; lo shader la usa a GRADINI: vede il sole solo
  chi ha il cielo pieno, l'ombra è del colore del cielo (che di notte è blu
  scuro), le lampade fanno quattro bande. Costo a fotogramma: zero. Tre prove.
- **02/09, l'erba a fili nel mesh** (tecnica 3): `nucleo/erba.js` cuoce nel
  chunk i fili a TRIANGOLO del prato di oggi (forme, larghezze, altezze,
  colore della cima con la punta più chiara, ondeggio per hash), otto byte
  per vertice in ottavi di cella, un disegno per chunk, culling col chunk,
  niente risemina. Con `?erba=8` (la densità ULTRA di oggi) l'open world da
  48 ha ~70k fili. ⚠ La base dell'erba è in quota di mondo: sommarle lo
  scarto del chunk mandava i fili 64 celle sotto, nel lago. ⚠ Le «punte» sul
  fondale del lago sono blocchi veri del worldgen (pilastrini da una cella)
  che l'acqua torbida di prima nascondeva: non è il nucleo.
- **Il banco apre il mondo vero di default** (`nucleo.html`); `?finto` e
  `?rampa` danno le colline di misura di F0.
- Decisioni prese dal committente («vai con i consigli»): pannello di
  riferimento il Mali a 90 Hz finché non se ne misura un altro; ombre del sole
  direzionali via horizon mapping; Babylon solo attrezzo offline.
- **Lo specchio dell'acqua rientra nel piano** (F3), e la domanda del
  committente era giusta: «è la stessa telecamera specchiata, vecchissimi giochi
  ci riescono con 64 MB». Vero. Il costo non era la RAM né i pixel: era che
  ogni passata rifaceva TUTTE le chiamate di disegno del motore vecchio, e sul
  Mali ogni chiamata è tempo di CPU. Con un disegno per chunk una passata
  specchiata sono ~50 disegni a 256², cioè quello che facevano Quake 3 e
  Mario 64. Si misura in F3 con la porta, non si vieta.
- **02/09, lo specchio dell'acqua (F3, seconda passata, da misurare)**: in
  `nucleo/resa.js` una passata in più PRIMA dei solidi, in un framebuffer a
  mezza risoluzione (`specchio.scala`, `?specchio=0.5|no`), con la MATRICE DI
  RIFLESSIONE rispetto al pelo moltiplicata a destra del VP: un punto del mondo
  finisce a schermo dove finirebbe la sua immagine, quindi il fragment
  dell'acqua legge il riflesso con `gl_FragCoord` e basta, spostato di un soffio
  dalle onde. Le facce si scartano al contrario (la riflessione capovolge il
  verso), sotto il pelo non si disegna (`uTaglio`, anche nei modelli), sott'acqua
  non si specchia, e senza acqua a schermo la passata non parte. Il piano è UNO
  (limite della tecnica): ogni chunk d'acqua visto vota la quota del suo pelo
  (`acqua.pelo` dal mesher, cioè `peloDi()`) con i suoi quad smorzati dalla
  distanza — il lago vince sulla pozza della sorgente, la pozza vince quando ci
  si è sopra. Costo in SwiftShader sul lago del mondo 96: 90 disegni la vista +
  92 lo specchio (solidi + modelli, niente erba). La porta è il 🩺 dal Mali con
  e senza `?specchio`. `?vedi` mostra lo specchio nudo in un angolo.
  Le pozze dei lampioni sono più calde e piene (1,3/1,02/0,58 sul bianco).
- **02/09, LA PARTITA (`partita.html`, `src/partita.js`, `src/partita/`)**: il
  sandbox sul nucleo, giocabile da telefono e da computer. Si cammina
  (`gioco/passeggero.js`, a passo fisso 60 Hz), si vola (F), si guarda
  trascinando o col mouse catturato, si scava tenendo premuto e si posa
  (`gioco/mira.js`, `gioco/scavo.js`, la cassetta di `gioco/cantiere.js`),
  con joystick e piccone a dito (`ui/comandi.js`). Il mondo è INFINITO: la
  frontiera di `world/` genera, `partita/streaming.js` costruisce (mesh +
  luce cotta) dal chunk più vicino entro un budget di 5 ms a fotogramma e
  scarica il lontano; la mappa delle altezze per l'ombra è una FINESTRA di
  512 blocchi che segue chi cammina (`resa.apriFinestraAltezze`, una tegola
  16×16 per chunk). I CORPI (`partita/corpi.js`) sono scatole a passo fisso,
  un asse per volta con sottopassi, sonno, mucchio: `?corpi=200` o il tasto
  🎲/C ne lancia venti; si disegnano a istanze con tinta e giro per istanza
  (otto float, `nucleo/modelli.js`). Alberi e lampioni arrivano dagli eventi
  del mondo (`partita/registro-modelli.js`), quindi posare un albero dalla
  cassetta lo fa apparire. Terza persona con V (un omino-cubo, per ora).
  In SwiftShader a 960×540: 154 chunk costruiti all'avvio (480k blocchi),
  ~165 disegni con lo specchio, 150 corpi a JS 2 ms. ⏳ La porta è il 🩺 dal
  Mali. ⚠ La lanterna del lampione è finalmente ACCESA di notte: il
  convertitore marcava come emissiva la piastra alla base (era la zona più
  chiara della texture); ora l'emissiva è il vetro (quota 2,05-2,62, raggio
  ≤ 0,3).

## 4c. Il mandato sullo stile (02/09, ripetuto dal committente)

«Non ti dimenticare lo stile grafico e la palette: niente pixel, niente
voxel, luci in cel shading, LOD». Tradotto in regole del nucleo:
- **Palette**: i colori sono quelli del gioco, cotti nel vertice dalla stessa
  `paletteBlocco`. Nessuna texture: il nucleo non ne carica una.
- **Niente pixel**: niente texture a pixel grossi, niente dithering, niente
  post-passata che sgrani. L'antialias è l'MSAA del canvas.
- **Niente voxel «alla Minecraft»**: il mondo è a blocchi ma il look no —
  colori piatti per faccia (cima/lato/fondo), fili d'erba a triangolo, alberi
  e lampioni a coni e cilindri lisci, acqua a onde. Il greedy meshing (F1)
  fonde le facce e toglie anche le cuciture fra blocchi uguali.
- **Cel shading**: la luce è a gradini ovunque — sole a tre bande, cielo a
  quattro, lampade a quattro — e l'ombra è del colore del cielo. Nessuna
  rampa continua, nessuna sfumatura per normale.
- **LOD**: l'erba solo entro sei chunk (fatto), la nebbia che è anche il
  confine di resa, i modelli come cartelli oltre una distanza (F3), la pelle
  dei chunk lontani (come oggi) e lo streaming della frontiera nel nucleo.

## 5. Le decisioni che spettano al committente

1. **Il pannello di riferimento**: 90 Hz (il Mali di oggi) o 120/144 (quale
   telefono)? Il bilancio di §1 cambia di un terzo.
2. **Le ombre del sole**: cotte nel cielo (morbide, senza direzione, come
   Minecraft) oppure direzionali via horizon mapping (poche letture per pixel,
   si vede l'ombra dell'albero girare col sole). Consiglio: la seconda, è lo
   stile di Leafy.
3. **Lo specchio dell'acqua**: fuori dal gioco (cielo dipinto + fresnel),
   lusso dell'Officina su desktop. Consiglio: fuori.
4. **Babylon**: solo attrezzo offline. Consiglio: sì.

## 6. Quello che è già cambiato oggi, in attesa della risposta

- Una tabella di qualità sola (`LIVELLI.mobile` è un alias di quella desktop),
  il telefono parte con tutto acceso come il desktop (cammino nei voxel, MSAA,
  acqua ricca), stesso tetto d'erba, stessi nomi dei gradini.
- La scala non scende più da sola: si parte da ULTRA e ci si resta, ovunque;
  `?scala=auto` per chi vuole vedere cosa sceglierebbe.
- Il prezzo, detto prima: sul Mali a ULTRA desktop (3 cascate a 2048, dist
  150, specchio e rifrazione, erba 7,8) i fotogrammi saranno POCHI. È il
  numero vero da cui parte la rifondazione, e il 🩺 lo dice.

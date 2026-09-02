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
| F0 | il banco vuoto: nucleo WebGL2, 50 chunk finti nel formato nuovo, luce cotta finta | ≥ 90 fps con 300k triangoli, ≤ 60 disegni, JS < 2 ms |
| F1 | mondo in array tipizzati + mesher greedy + atlante; il gioco di oggi disegnato dal nucleo (senza luce) | la scena dell'open world a ≥ 90 fps di giorno |
| F2 | luce cotta (cielo + lampade) + ciclo del giorno + horizon mapping del sole | la notte costa come il giorno; ombre senza acne né scatti |
| F3 | erba nel mesh, acqua a una passata, modelli a istanze con impostor | parità visiva col gioco di oggi, verdetto del committente |
| F4 | fisica a passo fisso, centinaia di corpi; camera AR (WebXR) | 200 corpi attivi a ≥ 90 fps |

Ogni fase si spinge in `sorgente` e si pubblica: il gioco di oggi resta
giocabile finché il nucleo nuovo non lo supera in TUTTO, e a quel punto si
spegne il vecchio. Nessuna fase dura più di qualche giorno di lavoro; se una
porta non passa, non si va avanti: si misura e si cambia tecnica.

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

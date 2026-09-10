# I difetti aperti — le parole del committente, per intero

> Questo file esiste perché una lista lunga detta a voce si perde. Ogni voce
> tiene le **parole originali**: un difetto riassunto da chi deve ripararlo
> diventa il difetto che quello ha capito, non quello che c'è.
>
> Si toglie una voce da qui solo quando è il committente a dire che è a posto,
> guardando. Non quando il codice sembra giusto.

Aperti dal **10/09/2026**.

## Come siamo messi

| # | difetto | stato |
|---|---|---|
| 1 | Il riflesso verso il sole: tiling e distorsione | ✅ da guardare |
| 2 | La schiuma (spessa, seghettata, un materiale solo, non dinamica, senza forma) | ✅ da guardare |
| 3 | Non si mettono oggetti in acqua | ✅ fatto |
| 4 | Gli alberi: ombra quadrata e schiuma di troppo | ✅ fatto |
| 5 | Hotbar e inventario creativo | ✅ fatto |
| 6 | **L'OMEGA TEST** | ⏳ **il prossimo** |
| + | Le cose in acqua rimbalzano (detto il 10/09) | ✅ fatto |
| + | «Niente pixel né quadrati» (detto il 10/09) | ✅ sulla schiuma; da ripassare altrove |
| 7 | Il brillio del sole: «mega blob brutto», lo si vuole piccolo e denso | ✅ da guardare |
| 8 | La schiuma segue il player **a scatti** | ✅ fatto |
| 9 | La schiuma **appare quando ti avvicini**, e va retta da migliaia di oggetti | ✅ fatto (mappa delle impronte) |
| 10 | Niente schiuma attorno ad alberi e furniture | ✅ fatto |
| 11 | Le furniture non fanno ombra alla luce dei lampioni | ✅ fatto **davvero** dal 10/09 (vedi 20) |
| 12 | **Waterlogging**: le cose posate in acqua devono TENERE l'acqua | ✅ fatto |
| 13 | **L'acqua non scorre**: una fonte piena accanto a una cella vuota deve riempirla, come Minecraft | ✅ fatto |
| 14 | **L'acqua che scala fino ai bordi**, con i livelli smooth | ✅ viene dal 13 |
| 15 | La schiuma «troppo splamata, sfocata, agli angoli si perde, non segue i lati del blocco» | ✅ da guardare |
| 16 | La schiuma attorno agli oggetti **flickera quando il player salta** | ✅ fatto |
| 17 | **Le ombre seghettate** «che ancora infestano questo progetto» | ✅ da guardare |
| 18 | L'ombra che gli alberi **castano** e che **ricevono** dalle lampade | ✅ fatto |
| 19 | La **hotbar** (di nuovo) e due cose dell'Officina | ✅ fatto |
| 20 | «L'ombra non avviene dai lampioni se c'è un albero davanti» | ✅ fatto |
| 21 | Il player «ha le mesh invertite da molte versioni» | ✅ fatto |

**Il 6 è chiuso**: `?omega`. Primo numero su questa macchina, raggio 128 —
**142 fps, p50 7,0 ms, JS 1,9 ms, 74 disegni, 7.177 istanze di modelli in 13
chiamate di disegno, 2,05 milioni di triangoli.**

⚠ **Manca ancora il 🩺 DAL TELEFONO**, che è il numero che conta davvero: su
questa macchina il vsync copre tutto. `?omega` è il posto giusto per farlo.

⚠ **«✅ da guardare» non vuol dire chiuso.** Le voci 1 e 2 sono cambiamenti
visivi, e il verdetto è del committente su scatti affiancati: finché non li
guarda restano qui.

---

## 1. L'acqua: il riflesso verso il sole

> «va aggiustato il riflesso dell'acqua e il riflesso verso il sole si notano
> tantissimo il tiling è tutto ripetuto e distorto in modo strano»

Due cose in una: il **tiling ripetuto** (un motivo che si vede ricomparire
uguale a intervalli regolari) e la **distorsione strana** guardando verso il
sole. Da cercare nel banco dell'acqua (`water.html`) col bottone **☀ verso il
sole**, che esiste apposta: il luccichio vive in una finestra stretta di azimut
e da un'inquadratura a caso il difetto non si vede.

⚠ Nota storica che c'entra: `docs/MISURE.md` ha già un caso in cui i «pattern
strani da certe angolazioni» erano **due bug distinti**, e la diagnosi giusta
era del committente.

## 2. La schiuma

> «la schiuma ci sta ma è un pochino troppo spessa e al bordo è seghettata,
> orribile la schiuma di diverso tipo e materiale e non dinamica di quando
> metto oggetti in acqua (cosa che non riesco a fare) flickererà tantissimo e
> non rappresenta per niente la forma dell'oggetto a seconda della mesh che
> entra dinamicamente»

Cinque difetti distinti, e vanno separati o si cura quello sbagliato:

1. **troppo spessa** — la fascia di riva è larga;
2. **il bordo è seghettato** — il gradino cel-shading cade sui texel della
   mappa delle altezze invece che sul bordo vero (⚠ è lo stesso difetto già
   pagato con l'ombra della lampada: «l'ombra è seghettata quadrata», curato
   camminando cella per cella invece che a passi fissi);
3. **materiale sbagliato** — la schiuma dovrebbe essere di tipo diverso a
   seconda di cosa la fa;
4. **non è dinamica** e **flickererà** — l'anello attorno a chi galleggia;
5. **non rappresenta la forma dell'oggetto** — `uGalleggianti` porta un centro
   e un raggio, cioè un cerchio: una mesh qualsiasi che entra in acqua fa
   sempre un cerchio.

## 3. ⚠ NON SI RIESCE A METTERE OGGETTI IN ACQUA

> «(cosa che non riesco a fare)»

Detto di sfuggita dentro il punto sopra, ma è un **difetto funzionale a sé** e
probabilmente il più facile dei sei. Da riprodurre prima di toccare qualsiasi
cosa dell'acqua: senza, il punto 2.4 non si può nemmeno guardare.

## 4. Gli alberi: ombra quadrata e schiuma sbagliata

> «gli alberi lasciano un'ombra quadrata delle luci e creano tantissima schiuma
> in acqua anche se vedi solo la punta o solo il tronco in acqua»

Due difetti, e tutti e due puzzano della **stessa causa**: l'albero è trattato
come la sua CELLA, non come la sua forma.

- L'ombra dalle lampade cammina sulla mappa delle **altezze** (`uAltezze`), che
  è per colonna: un albero è una colonna piena, quindi fa un'ombra quadrata.
- La schiuma di contatto guarda la cella, quindi un albero che tocca l'acqua
  con la punta o col tronco conta come un blocco intero dentro l'acqua.

⚠ E questo è esattamente il genere di cosa che il **catalogo** (`ingombro`) e le
**entità** possono raddrizzare, perché adesso un albero è un oggetto con una
forma dichiarata e non più una cella.

## 5. La hotbar e l'inventario creativo

> «Voglio una hotbar migliore questa è inutile buggata e manca l'inventario
> creativo con TUTTI i blocchi e furniture con icone comprensibili»

- La barra attuale è una **lista fissa di 19 caselle** (`gioco/cantiere.js`,
  `CASSETTA`): tutto quello che non è in quella lista non si può avere in mano.
- I blocchi veri sono molti di più e hanno **già le categorie**
  (`CATEGORIE_BLOCCHI` in `world/blocks.js`: naturali, costruzione, lane, luci,
  officina, prove), più gli **arredi** (`partita/arredi.js`) e le
  **decorazioni**. Il menu creativo ha già i dati sotto: manca la finestra.
- «icone comprensibili»: oggi l'icona è un quadratino del colore della cima.
  Per un blocco va; per un gatto, un megafono o una canna da pesca no.

## 6. L'OMEGA TEST

> «Manca anche un omega test con migliaia di blocchi diversi luci colorate
> blocchi dinamici e mesh dinamiche in view per capire i veri problemi di fps e
> grafici, un abominio di mesh e luci blocchi ombre per testare bene al massimo
> l'engine anche con render distance enormi»

Il banco di tortura del nucleo. Esiste già `?rampa` nel banco (`nucleo.html`),
ma è **terreno finto**: sale di triangoli e basta. Qui serve un abominio vero —
migliaia di tipi diversi, luci colorate, cose che si muovono, mesh dinamiche,
distanze di resa enormi — perché è l'unico posto dove i difetti di cui sopra si
vedono tutti insieme e sotto carico.

⚠ È anche il posto dove il **🩺 dal Mali** finalmente dirà qualcosa di utile:
sul mondo normale il telefono resta incollato al vsync e il numero non dice il
margine.

---

## 12-14. L'ACQUA VIVA: waterlogging, scorrimento, livelli

> «Manca anche il waterloggare le cose e l'acqua non si aggiorna in modo
> dinamico come su Minecraft, quindi fonti piene vicine a vuoto lo riempiono
> con fonte piene, e poi la funzionalità dell'acqua che scala fino ai bordi
> smooth»

Tre cose distinte, in ordine di quanto scavano:

1. **Waterlogging** — una cosa posata in acqua deve **tenere** l'acqua, non
   sostituirla. ⚠ Oggi il mondo tiene **un tipo per cella**: waterlogging vuol
   dire un secondo dato (l'acqua) accanto al primo, e quindi tocca `world/`,
   il mesher, il salvataggio. Non è una riga. ⚠ E vale solo per le cose che
   non riempiono la cella (modelli, piante): un blocco pieno l'acqua la caccia,
   come in Minecraft.
2. **Lo scorrimento** — una fonte piena accanto a una cella vuota la riempie,
   con i livelli che calano allontanandosi. La rappresentazione **c'è già**
   (`acqua~n`, `livelloAcqua`, `world/pelo.js`): manca la SIMULAZIONE, e va
   fatta a passo fisso e per chunk, se no con un mondo in streaming si paga
   ovunque invece che dove serve.
3. **I bordi smooth** — il pelo che scala verso il bordo. Anche qui il vertex
   shader **abbassa già** il pelo per livello: manca che i livelli ci siano.

⚠ **Il 2 e il 3 sono lo stesso lavoro** visto da due lati: se lo scorrimento
produce i livelli giusti, i bordi vengono da sé.

## 15. La schiuma: netta NON vuol dire a quadretti, e nemmeno spalmata

> «Troppo splamata, sfocata e poco netta e agli angoli si perde non segue i
> lati del blocco»

⚠ **Questa voce è una lezione di metodo, e vale oltre la schiuma.** Le tre cure
in fila si sono pestate i piedi a vicenda:

1. la prima stesura era **seghettata** — il campo era un test sì/no su una
   griglia di un texel per colonna, quindi il bordo ereditava la griglia;
2. per toglierla ho messo la **media di sedici assaggi su un anello**. Ha
   funzionato, ma una media su un anello è un **filtro passa-basso**: spiana,
   allarga, e a un angolo CONVESSO perde metà degli assaggi — quindi la schiuma
   spariva proprio dove il bordo gira;
3. la cura giusta non era né l'una né l'altra: si stima la **distanza vera**
   dalla riva (altezza interpolata diviso la pendenza). La curva di livello
   segue il bordo dei blocchi, angoli compresi, e la larghezza della fascia la
   decide un numero in blocchi. E costa cinque letture invece di sedici.

La morale: **netto**, **non seghettato** e **fedele al bordo** sono tre
proprietà diverse, e vanno prese da tre posti diversi — il gradino dal taglio,
la continuità dal filtro della texture, la forma dalla geometria del campo.
Confonderne due fa nascere il terzo difetto.

## L'ordine, e perché

1. **L'Officina nuova** (scena, ispettore, creativa) — chiesta per prima, e
   porta con sé il punto 5.
2. **L'omega test** — perché i punti 1, 2 e 4 si giudicano lì sotto carico, e
   perché senza non si sa quali siano «i veri problemi di fps».
3. **Il punto 3** (oggetti in acqua), che sblocca il 2.4.
4. **L'acqua e la schiuma** (1, 2), un difetto alla volta, come per il resto
   dell'acqua: è la regola già presa il 09/09.
5. **Gli alberi** (4), che a quel punto hanno il catalogo sotto.

## 20. «L'ombra non avviene dai lampioni se c'è un albero davanti»

> «L'ombra non avviene dai lampioni se c'è un albero davanti, va sistemato. Per
> il test basta che vai di notte e vedi tutto su una piana piazzando una serie
> di lampioni e alberi.»

Fatto esattamente così — notte, piana, una fila di lampioni e alberi — e il
difetto c'era. Erano **due** bug nella stessa funzione (`ombraLampada`), e
tutti e due invisibili leggendo il codice.

**Il primo: il controllo c'era, ed era impossibile.** Il raggio verso la
lanterna cammina cella per cella (Amanatides–Woo); quando la cella conteneva un
oggetto si guardava quanto passasse lontano dal suo centro e si chiedeva
`< 0,34`. Ma la distanza si misurava nel punto in cui il raggio **entra** nella
cella — un punto che sta per costruzione sul **bordo**, cioè ad almeno mezza
cella dal centro. Una soglia di un terzo di cella non poteva essere vera **mai**,
per nessun raggio, in nessuna scena: l'ombra degli oggetti alla luce dei
lampioni non è mai esistita. Adesso si misura al punto **più vicino**
(`tc = clamp(dot(ac, dir), 0, lungo)`), che è la distanza vera fra la retta e
l'asse della cella.

⚠ E per questo la riga 11 di questa tabella diceva «fatto» da giorni: il codice
c'era, la prova a occhio era stata fatta su un tronco largo, e nessuno aveva
chiesto alla funzione di rispondere su un caso scelto.

**Il secondo: il lampione si spegneva la propria pozza.** Il lampione è alto
tre celle ed è un oggetto anche lui nel canale B della mappa; il raggio verso la
sua lanterna passa **necessariamente** per la sua cella. Appena il primo bug è
stato tolto, il secondo si è acceso: ogni pozza si fermava a un blocco dal palo.
Cura: `!all(equal(cella, cellaLampada))`.

**E l'oggetto adesso è un cono, non un palo.** In basso c'è il tronco (raggio
0,30), in alto la chioma (0,85), interpolati sull'altezza a cui il raggio passa:
un albero che fermasse la luce solo col tronco farebbe un'ombra che non somiglia
a un albero.

### Come sono stati trovati, che è la parte che serve

Non guardando lo schermo: **rifacendo il cammino dello shader in JavaScript**
sui dati veri del mondo e interrogandolo nei punti scelti. A schermo il primo
difetto sembrava «un albero che non fa ombra» (che è un'assenza, e le assenze
non si notano) e il secondo «una pozza un po' piccola» — nessuno dei due fa
sospettare un errore di geometria. In JS la risposta è un numero: dietro
l'albero `luce: 0`, negli altri quadranti `luce: 1`.

⚠ **E le due copie di `ombraLampada` adesso hanno un guardiano**
(`test/ombra-lampada-gemella.test.mjs`): la stessa funzione vive in
`nucleo/resa.js` (i blocchi) e in `nucleo/modelli.js` (alberi, lampioni,
arredi), perché sono due programmi diversi e il GLSL non si importa. Erano già
divergute una volta — i due canali della mappa erano finiti solo in `resa.js`,
quindi l'ombra quadrata era curata sui blocchi e **ancora viva sui modelli**. La
prova toglie commenti e spazi e confronta quello che la GPU esegue davvero.

## 21. «Il player ha le mesh invertite da molte versioni»

Non era una mesh: era `giroVoluto = Math.PI - passeggero.verso`, cioè una
**riflessione** — giusta lungo X e rovesciata lungo Z. Un modello girato male
sbaglia sempre e si nota subito; uno specchiato sbaglia **metà delle volte**, e
sopravvive tante versioni. Misurato (giro 0 → faccia a +Z, giro π/2 → faccia a
+X): la formula giusta è `giro = verso`. E la nota in `arredi.js` diceva il
contrario in tre punti — corretta.

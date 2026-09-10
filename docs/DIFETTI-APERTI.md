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
| 11 | Le furniture non fanno ombra alla luce dei lampioni | ✅ fatto (il tronco, a cilindro) |
| 12 | **Waterlogging**: le cose posate in acqua devono TENERE l'acqua | ⏳ |
| 13 | **L'acqua non scorre**: una fonte piena accanto a una cella vuota deve riempirla, come Minecraft | ⏳ |
| 14 | **L'acqua che scala fino ai bordi**, con i livelli smooth | ⏳ |

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

## L'ordine, e perché

1. **L'Officina nuova** (scena, ispettore, creativa) — chiesta per prima, e
   porta con sé il punto 5.
2. **L'omega test** — perché i punti 1, 2 e 4 si giudicano lì sotto carico, e
   perché senza non si sa quali siano «i veri problemi di fps».
3. **Il punto 3** (oggetti in acqua), che sblocca il 2.4.
4. **L'acqua e la schiuma** (1, 2), un difetto alla volta, come per il resto
   dell'acqua: è la regola già presa il 09/09.
5. **Gli alberi** (4), che a quel punto hanno il catalogo sotto.

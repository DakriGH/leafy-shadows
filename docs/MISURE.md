# MISURE — il registro della fase R1 (e di tutte le fasi dopo)

> Regola: ogni fase del rework si apre e si chiude con un quadro preso QUI, con
> `?misura` nell'indirizzo — stessa scena (fiume dello spawn), stessa camera,
> stessa ora (13:00), 300 fotogrammi dopo 4 s + 60 fotogrammi di riscaldo.
> I numeri sono p50/p99, mai medie (vedi `gioco/misure.js` per il perché).

## Baseline 30/08/2026 — desktop RTX 4060, 1269×914, q0 (ULTRA), acqua ghibli

⚠ **Ambiente dichiarato**: presa nel pane del browser con il giro spinto a mano
(il pane non fa girare `requestAnimationFrame`), quindi il p50 del fotogramma
porta ~4 ms di attesa artificiale. Vale per i CONFRONTI nello stesso ambiente;
i numeri assoluti «veri» vanno ripresi in una finestra normale. I contatori che
non dipendono dal giro (disegni, passate, tempo dei bersagli) sono puliti.

| voce | p50 | p99 | note |
|---|---|---|---|
| fotogramma | 16,6 ms | 33,4 ms | ~4 ms sono il giro manuale del pane |
| bersagli di resa (rtMs) | 2,0 ms | 2,3 ms | solo ombre: ghibli non ha passate acqua |
| ombre (media strumento) | 1,9 ms | — | |
| **disegni** | **296** | — | **≈208 sono le 4 cascate d'ombra (52 mesh × 4)** |

**Pipeline attiva**: `ombre:sole 2048²×4 (52 mesh)` + il min/max interno delle
cascate. Con ghibli (vera 0) niente specchio/rifrazione/profondità.

**Il fatto che decide la fase R2**: il 70% delle chiamate di disegno è la mappa
d'ombra del sole — ridisegnata anche quando il sole è FERMO e il mondo non è
cambiato. È il primo bersaglio: mappa d'ombra a eventi (sole mosso / chunk
cambiato / proiettante mobile in vista), non a fotogrammi.

**Misura di contorno già presa (fuori dal banco, stesso ambiente)**: il filtro
`entraNellePassate` sulle passate dell'acqua vale −1,7 ms circa sul render puro
con acqua «vera» accesa (cristallina): 6,84 → 5,23 ms (senza erba nei bersagli
e profondità filtrata).

## R2 — prima mossa: la mappa d'ombra a eventi (30/08/2026)

La mappa del sole si CONGELA quando la scena è ferma (`rig.quieteOmbre` +
firma di quiete in `main.js`: sole, camera, giocatore, revisione del mondo;
isteresi di 3 fotogrammi) e si scongela alla prima variazione.

| voce | prima | dopo (scena ferma) |
|---|---|---|
| **disegni per fotogramma** | **296** | **88** (p50=p99: stabile) |
| di cui cascate d'ombra | ~208 | 0 |

Meccanismo verificato passo-passo nel gioco vivo: firma uguale ×3 → refreshRate
0; firma nuova → torna al passo del profilo e `resetRefreshCounter`; ×3 → di
nuovo 0. ⚠ Col ciclo del giorno ATTIVO il sole si muove oltre il quanto della
firma quasi ogni fotogramma → niente congelamento, ed è giusto così (le ombre
devono seguirlo; `ombraOgni` già le dirada). Il guadagno vero è per chi
costruisce, guarda, o gioca col ciclo fermo — e per il diorama AR, che è fermo
per definizione.

## R2 — seconda mossa: il governo delle passate dell'acqua (30/08/2026)

`governaPassate` (acqua.js) + il controllo in `fabbrica.animaAcqua`: specchio,
rifrazione e profondità girano SOLO se (a) la ricetta attiva le usa e (b)
almeno una mesh d'acqua è nel frustum. Prima, una volta create, restavano
registrate per sempre.

| scenario | prima | dopo |
|---|---|---|
| ghibli dopo aver provato cristallina | 3 passate vive per sempre, ~8,7 ms | 0 passate, **5,92 ms** (−2,8 ms) |
| cristallina guardando il cielo | 3 passate | **0 passate** |
| ritorno sull'acqua | — | riaccese in un giro, nessun riscaldo visibile |

Verificato nel gioco vivo in tutte e tre le direzioni (ricetta → spegne,
frustum → spegne, ritorno → riaccende).

## Baseline TELEFONO — Mali-G68, 30/08/2026 sera (4 rapporti 🩺 del committente)

Tutti a **q0 = ULTRA forzata** (la decisione «massimo ovunque»), 576×1081 resi
su schermo 384×721 css (dpr effettivo 1,5), erba 44.069 fili, cascate 2×1024,
`ombraOgni 3`, FXAA acceso, acqua ghibli (vera 0 → nessuna passata acqua).

| ora | fps | p50/p99 ms | disegni | triangoli | note |
|---|---|---|---|---|---|
| 19:22 | 39 | 25,9/62 | 73 | 142k | «camminando in giro», build 19:13 |
| 19:23 | 36 | 27,8/55,7 | 74 | 161k | build 19:13 |
| 19:23 | 44 | 22,9/70,4 | 63 | 144k | build 19:13 |
| 21:21 | **24** | 41,1/82,6 | 92 | 150k | build 21:14, `ombreMs` 7,34, storiaFps in calo 30→24 |

**Letture oneste:**
- Con la config di PRIMA della sessione il telefono faceva 6–7 fps; adesso fa
  24–44 **a ULTRA piena**. Ma il bersaglio è 60 stabile, e non ci siamo.
- I disegni sono POCHI (63–92): su Mali il collo non sono le chiamate — è
  **fill-rate/banda** (872k pixel + erba + FXAA) e il **vertex** dell'erba
  (44k fili col vento). È lì che la R2-mobile deve scavare.
- `ombreMs 7,34` (media strumento, con `ombraOgni 3`) è tanto: le 2 cascate
  1024² su Mali pesano anche diradato. Il congelamento a scena ferma NON
  scatta camminando col ciclo del giorno attivo — per il diorama fermo sì.
- ⚠ Il rapporto delle 21:21 (24 fps) NON è confrontabile con gli altri tre:
  build diversa, due ore dopo (termica?), inquadratura diversa (92 disegni).
  Due variabili in un confronto = nessuna conclusione. Serve la POSA STANDARD.

## R3 — la prova di carico: il costo NON cresce con le istanze (30/08/2026)

Cinque famiglie di flora procedurale (`world/flora.js` + `motore/flora.js`),
due varianti l'una = 10 mesh a thin instances, materiale del mondo condiviso.
Stessa posa `?misura`, stesso ambiente (pane, giro manuale):

| | istanze flora | mesh | p50 | p99 | disegni |
|---|---|---|---|---|---|
| baseline senza flora | 0 | 0 | 16,6 | 33,4 | 88 |
| flora normale | 346 | 10 | 16,7 | 32,9 | 108 |
| **`?carico=25`** | **3.577** | 10 | **16,7** | 31,3 | **108** |

**10× le istanze: p50, p99 e disegni IDENTICI.** Il costo è per famiglia (un
disegno l'una, più le cascate per chi proietta), non per istanza — che è
esattamente la proprietà su cui i 9000 asset veri potranno salire. Il tetto di
istanze qui è «una decorazione per cella d'erba», non il motore.

## R3 — flora a SETTORI, e due misure che hanno detto NO (30/08/2026, sera)

**Il profilo per esclusione sul desktop** (a regime, dopo il riscaldo): il
fotogramma pieno sta a **~2,4 ms** — il collo di bottiglia su questa macchina
non esiste più; i margini veri sono sul telefono (banda), dove si misura col
banco, non da qui.

**Flora divisa per settori di 48 celle** (una mesh per famiglia PER SETTORE):
27 mesh, di cui **13 attive** guardando da un lato e 25 dall'altro — il frustum
scarta i settori interi. Posa standard: p50 invariato (16,7), disegni 108→132
sul mondo piccolo (prezzo dichiarato: più voci in elenco). Il guadagno arriva
col mondo GRANDE: il costo cresce con quello che si guarda, non con l'area.

**Le misure che hanno detto NO — e valgono quanto quelle che dicono sì:**
- `material.freeze()` su tutti i 12 materiali: guadagno apparente −1,7 ms,
  ma era la DERIVA di fondo del banco (sciolto = congelato = 2,3 ms). Non
  adottato: da rimisurare su Mali col banco, dove il costo CPU per-mesh pesa
  5× — lì potrebbe valere davvero.
- Il toggle di `sole.shadowEnabled` dentro una misura la AVVELENA: cambia i
  define e ricompila i materiali dentro la finestra (14,7 ms «senza ombre»,
  peggio del pieno). Le esclusioni si misurano con 25 fotogrammi di riscaldo
  dopo OGNI interruttore.

⚠ Annotato per il raccordo R2/R3: i settori flora che proiettano entrano nella
lista ombre globale (63 mesh) — sul mondo grande andranno filtrati per
distanza come i chunk (`aggiornaOmbre`).

## R2 — `?misura=serie`: il profilo per esclusione SUL dispositivo (30/08/2026)

Un giro solo, sette configurazioni sulla stessa posa (pieno · senza erba ·
senza ombre · senza FXAA · senza acqua · materiali congelati · scala 0,75),
ognuna col suo riscaldo, tutto nel rapporto 🩺. Esiste perché il collo del
Mali non si indovina da una RTX: qui il p50 è incollato al vsync (15,5–16,7 su
tutti i passi) e i delta veri li dirà il telefono.

⚠ La serie ha già ripagato il viaggio PRIMA di partire: al primo giro i passi
dopo «senza ombre» mostravano 364–384 disegni — spegni-e-riaccendi il sole
lasciava il contatore di quiete a 3 e la mappa VIVA: «già congelata» per il
contatore, mai più congelata per la GPU. Corretto in `quieteOmbre` (si
riapplica se qualcun altro ha sciolto il congelo) e il ripristino della serie
riparte pulito (`_ombraOgni` + `_sporcaOmbre`).

**Il bersaglio dichiarato per mobile** (la risposta a «300 fps»): su un browser
il tetto MISURABILE è la frequenza dello schermo — 60 o 90 Hz, il vsync cappa
lì. Il numero da inseguire è il TEMPO di fotogramma: oggi il Mali-G68 sta a
23–41 ms; il bersaglio è **p50 < 10 ms a ULTRA** — 60 fissi col margine
termico, 120 sui pannelli che li hanno. La serie dice dove scavare.

## I rapporti 🩺 della sera del 30/08 — tre letture che cambiano il quadro

1. **A ULTRA da fermo il Mali-G68 fa 85–87 fps** (p50 **11,7 ms**, 46 disegni,
   ombre congelate): il pannello del telefono è ≥90 Hz e la build col
   congelamento ha portato la scena calma vicino al bersaglio. I 24–44 fps
   restano in movimento — lì le cascate si ridisegnano ed è giusto così: il
   prossimo scavo è il costo A CAMERA IN MOTO (la serie lo dirà).
2. **Il «desktop a 6 fps» era il telefono travestito**: scheda Mali-G68, classe
   desktop («richiedi sito desktop» → l'UA mente) → profilo desktop pieno,
   4 cascate 2048², 269k triangoli, ombre 48 ms. Curato: la classe ora guarda
   la GPU (`gpuDaTelefono`, provata sui nomi ANGLE veri) e raddrizza profilo,
   DPR e fissi prima che nasca la scena.
3. **A qualità BASSA (q5) il telefono fa 51 fps FISSI — PEGGIO di ULTRA**:
   storia piatta a 51, `ombreMs 0`. Non è la GPU: è un cap esterno (termico o
   risparmio energia). Conferma sperimentale della decisione «niente scala
   automatica»: scendere di qualità non compra niente quando il collo è
   altrove — è il pattern Adreno 619 già documentato, misurato stavolta in casa.

## La passeggiata del 30-31/08 (rapporti liberi) e la serie IN MARCIA

Dalla passeggiata del committente (Mali, ULTRA, in movimento): 23–36 fps con
`ombreMs` 5–8 — contro gli 85 da fermo. Il congelamento non copre la marcia
per definizione: camminando la firma cambia e le cascate si ridisegnano.

La serie ora ha TRE passi in movimento (camera che orbita — marcia finta,
ripetibile). Sulla RTX (p50 al vsync, ma i DISEGNI parlano):

| voce | disegni |
|---|---|
| pieno (fermo) | 132 |
| **in marcia** | **371** |
| marcia senza ombre | 119 |
| marcia senza erba | 369 |

**+239 disegni in marcia, e sono quasi tutti le cascate.** Sul Mali questo è
il primo indiziato dei 27–44 ms in movimento. La serie dal telefono darà i ms
veri per passo; da lì si sceglie fra: meno lavoro per cascata in marcia, mappa
più piccola in moto, erba a ciuffi (se «marcia senza erba» pesa).

⚠ I rapporti liberi restano utili ma NON confrontabili fra loro (inquadrature
e termica diverse): il 23 fps della build nuova e il 36 della vecchia non
dicono che la build nuova è peggio — dicono che serve la POSA per confrontare.

## 31/08 — la conferma del committente, e l'erba a punte pronta

**«Dai miei test sul telefono facevo oltre gli 80 fps»** — verdetto suo, sul
suo Mali, con la build dei tre ribaltamenti (congelamento ombre + MSAA
on-tile/FXAA via + passate governate). La strada è quella giusta; il lavoro
rimasto è la MARCIA (le cascate che si ridisegnano camminando).

**Pronto per il suo verdetto: l'erba a punte** (`?erba=punte`): una lamella =
UN triangolo — **−50% triangoli, −25% vertici** dell'erba, che è la voce
doppia del tiler (binning + raster). A/B fotografato: dalla vista di gioco è
quasi indistinguibile, da dentro il prato le punte sono perfino più «erba».
Di fabbrica resta il quad finché non decide lui.

⚠ Lezione ripagata di nuovo: con `preserveDrawingBuffer: false` uno scatto
`toDataURL` DEVE stare nella stessa task del `render()` — un `await` in mezzo
e torna bianco. (Il 🩺 è immune: usa `rig.scatto`.)

## 31/08 — 87 fps a ULTRA, e l'erba IBRIDA del committente

**Il rapporto migliore di sempre**: 87 fps, p50 **11,5 ms**, 47 disegni,
`ombreMs` 0,05, con 174k triangoli in scena — ULTRA su Mali-G68, pannello da
90 Hz quasi saturo. (Ancora nessuna `?misura=serie`: resta la voce aperta.)

**L'erba ibrida** — proposta del committente, davanti alla sua preferenza per
il quad: «vicino quadrata, lontana triangolare». Fatta così: due mesh, stesso
materiale, la coda di semina (già ordinata per distanza) smista le lamelle —
quad entro `confineVicino` chunk, punte a un triangolo oltre.

| confine | lamelle lontane | triangoli erba risparmiati |
|---|---|---|
| 2 (32 blocchi) | 12% | ~6% (il diradamento lontano ha già assottigliato) |
| **1 (16 blocchi) — default** | **66%** | **−33%** (37.587 su 114.062) |

Foto A/B della stessa inquadratura: indistinguibili. La cucitura non si vede
perché oltre 16 blocchi una lamella è larga meno di un pixel. `confineVicino`
è la manopola se mai si vedesse.

## 31/08 — IL RIFLESSO CHE NON C'ERA, e tre cause vere

Verdetto: «l'acqua è totalmente opaca… non riflette proprio nulla… di notte
non riflette le luci». Tre difetti distinti, tutti trovati misurando:

1. **Il piano dello specchio non era mai stato agganciato nel GIOCO.**
   `creaSpecchio` lo lascia al valore di comodo del banco (9,5) e il banco lo
   rimette a ogni vasca; `main.js` non lo rimetteva MAI. Il pelo del mare sta a
   `LIVELLO_ACQUA + 15/16` = **5,94**: si specchiava rispetto a un piano tre
   blocchi e mezzo troppo alto, cioè un'immagine sbagliata di sette blocchi.
   A schermo si legge come «acqua opaca e monocromatica», non come «riflesso
   sbagliato» — nessun errore, nessun avviso.
2. **Il piano ora SEGUE l'acqua** (verdetto: «deve stare a qualsiasi altezza,
   anche in una grotta»): `world/pelo.js` — `peloVicino` cerca il pelo LIBERO
   più vicino pesando la verticale ×2,2, `pianoDaTenere` lo sposta a scatti da
   mezzo blocco (in continuo, l'immagine slitterebbe camminando). 6 prove in
   Node, grotta compresa. Verificato a schermo: scavata una pozza in cima a una
   collina, il piano salta da 5,94 a 12,94 da solo.
3. **Gli aloni delle lampade erano fuori da TUTTE le passate** — esclusi da me
   per prudenza sui billboard. Il timore era infondato (un billboard si orienta
   sulla camera attiva, che nello specchio è quella specchiata) e il prezzo era
   che di notte il lago rifletteva solo il buio. Ora c'è un filtro separato per
   lo specchio (`entraNelloSpecchio`): aloni e giocatore SÌ nello specchio, NO
   in rifrazione e profondità (un alone additivo nella mappa di profondità
   scriverebbe profondità finta là dove c'è solo aria luminosa).

## 31/08 — il mondo GRANDE: i numeri prima di provarci

Richiesta: «mondo alto 300 e largo 4k per testare chunking e performance».
Generazione attuale (tutta in una volta), misurata in Node:

| semilato | colonne | tempo | heap |
|---|---|---|---|
| 48 (oggi) | 9.409 | 66 ms | 10 MB |
| 96 | 37.249 | 275 ms | 29 MB |
| 160 | 103.041 | 801 ms | 56 MB |

Lineare: ~7,8 µs e ~0,55 KB per colonna. **4000×4000 = 16 milioni di colonne →
~2 minuti di blocco e ~9 GB**, senza contare i 300 di altezza. Non è una
taratura: serve generazione per chunk a richiesta + scarico dei lontani.

**Provato a semilato 160 nel browser** (`?mondo=160`, 321×321, 871.744 blocchi,
441 chunk): **928 mesh in scena ma solo 120 attive** — il culling fa il suo
lavoro — con 370 MB di heap e **21,6 ms/frame** contro i ~2,4 del mondo
piccolo. Il collo NON è il disegno: è che **nessun chunk viene mai scaricato**
(il LOD lontano è `null`, ma la mesh resta viva e in elenco). A 4k sarebbero
~125.000 mesh: il prossimo cantiere è lo scarico dei chunk oltre la distanza,
ed è il cuore di R3.

## Da raccogliere
- [ ] Il quadro `?misura` dal **telefono** (posa standard, percentili veri):
      `https://dakrigh.github.io/leafy-shadows/?misura`, aspettare il riquadro
      📏, poi 🩺 → il quadro viaggia nel rapporto da solo. È l'unico modo di
      separare «build» da «termica» da «inquadratura».
- [ ] Quadro in finestra normale su questa macchina (fuori dal pane).
- [ ] Quadro col Chromebook (Intel HD 400), se torna in gioco.

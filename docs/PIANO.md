# Il piano della migrazione

Non un big-bang. A ogni fase Leafy-Lantern (`progetti/Lantern`, tag
`v1.0-three`) resta in piedi e giocabile, e si confronta con questo — a schermo e
con un numero. Se una fase non migliora quello che prometteva, ci si ferma lì e
si ripensa, invece di scoprirlo alla fine.

---

## Fase 1 — Scheletro e primo mondo vero ✅ *(28/08/2026)*

**La domanda**: il look regge, con la luce del motore invece che con la nostra?

**Fatto**: motore, scena, camera a diorama, sole direzionale, ombre a cascata,
il worldgen di Leafy e il mesher di Leafy che disegnano 66.829 blocchi in 49
chunk. `src/world/` non nomina più nessun motore.

**Risposta**: sì. Le terrazze si leggono, i colori sono quelli, e le ombre fra un
gradino e l'altro le fa il motore. Tre difetti trovati e curati (avvolgimento dei
triangoli, `receiveShadows`, shader da importare a mano) — tutti e tre in
`CLAUDE.md` perché nessuno ci ricaschi.

**Misurato**: fotogramma CPU 4,87 ms medio, mappa d'ombra 1,4 ms, 30 mesh attive
su 98. Contro Lantern: le ombre costavano 2,1–2,5 ms **per ricostruzione** a
11 Hz, ed erano una cascata sola e stantia fra un rifacimento e l'altro.

---

## Fase 2 — Lo stile ✅ *(28/08/2026, la parte che contava)*

**Fatto**: lo stile piatto di Leafy sopra la mappa a cascata del motore.
Facce a tinta unita dalla palette, ombra a tre gradini, e l'ombra virata verso
l'azzurro del cielo invece che verso il nero. Una legge sola per terreno ed erba
— in Lantern «il filo e il blocco sotto su due leggi diverse» era il difetto
bocciato tre volte. Vive tutto in `src/motore/stile.js`, ed è condiviso.

**Misurato dopo**: fotogramma CPU 5,32 ms medio, mappa d'ombra 1,43 ms,
scambio dell'erba 1,6 ms, 34 mesh attive. Lo stile non è costato niente.

**Resta di questa fase**: il ciclo giorno/notte (muovere `ambienteCol`,
`ombraTinta` e la direzione del sole nell'arco della giornata), le stagioni sul
prato, e la nebbia — ma solo **dopo** aver deciso la distanza di resa.

---

## Fase 2-bis — Il ciclo del giorno ✅ *(28/08/2026)*

346 righe in Leafy-Lantern, **110** qui, e non è bravura: con lo stile piatto il
colore di ogni cosa esce da tre grandezze, quindi il ciclo è muovere quelle tre
più il sole. Le ore chiave sono una **tabella** — regola della casa, e qui si
vede perché: chi vuole ritoccare l'alba tocca una riga.

⚠ **L'ombra non è grigia in nessuna riga della tabella.** Di giorno vira
azzurra, all'alba rosata, di notte blu. È la regola che tiene insieme lo stile.

**Resta**: la nebbia, ma solo dopo aver deciso la distanza di resa.

---

## Fase 2-ter — La nebbia e le stagioni

Il look non è ancora quello: manca la personalità di Leafy sopra il modello di
illuminazione del motore.

- palette per quota e stagioni **già portate** (`stagioni.js` è agnostica): va
  verificato che la ritinta in-place funzioni sul buffer di Babylon;
- ciclo giorno/notte: direzione e colore del sole, ambiente, cielo;
- nebbia, e **solo dopo** aver deciso la distanza di resa — in Lantern la nebbia
  era diventata la scusa per non guardare quanto lontano si arrivava;
- decidere se serve un materiale a nodi (Node Material) o basta lo standard.

**La domanda**: quanto del look piatto si tiene senza tornare a scrivere shader?

---

## Fase 3 — Vegetazione: il banco di prova ✅ *(28/08/2026, parziale)*

**La domanda**: i picchi dell'erba spariscono?

**Risposta**: sì. 101.698 lamelle costano **0,18 ms** a schermo, e lo scambio del
campo — che in Lantern era il picco da 3,6 ms a ogni confine di chunk — sta a
**0,8 ms**. Ci sono volute tre correzioni per arrivarci, tutte misurate:
13,8 → 6,0 → 0,8.

**Come, e cosa NON si è fatto.** Le regole di gioco (quali celle, quante
lamelle, come si dirada) vengono da Lantern e non sanno che esiste una GPU. Il
disegno è tutto nuovo: `CustomMaterial` invece di uno shader nostro, così l'erba
prende luci, nebbia e **ombre a cascata** dal motore, e noi innestiamo solo il
vento. La prima stesura era uno `ShaderMaterial` con dentro il vertex shader di
Lantern ricopiato: funzionava e sbagliava — uno ShaderMaterial non riceve le
luci della scena, cioè avrei rifatto a mano l'unica cosa per cui abbiamo
cambiato motore.

**Resta da fare in questa fase**: le foglie, e verificare l'ombra dell'erba
sull'erba (oggi il prato riceve ombra ma non la proietta — è una scelta, vedi
`prato.js`).

---

## Fase 3-bis — Il resto della vegetazione

È qui che si misura se i picchi sono spariti davvero.

- erba e foglie su **thin instances** (in Lantern erano 217.510 istanze
  ricaricate in blocco: 3,6 ms di picco a ogni confine di chunk, ed erano 8,1
  prima di limitare il carico);
- il vento nel vertex shader, o l'equivalente a nodi;
- ⚠ **e l'ombra della vegetazione deve seguire il vento** — in Lantern era il
  difetto trovato dal committente il 27/08: la regola c'era scritta e il dato per
  applicarla no.

**Il criterio d'arresto**: se qui i picchi non scendono, la migrazione non ha
mantenuto la sua promessa e va rimesso tutto in discussione.

---

## Fase 4 — Acqua, meteo, particelle

### L'acqua ✅ *(28/08/2026 — l'aspetto)*
Stile nuovo, deciso col committente sulle sue referenze (il toon water di
Roystan e due immagini): **quattro tinte piatte**, schiuma sulla riva a costo
zero (la sponda la sa già il mesher), tre andature distinte — calma, corrente,
cascata — e la **strada del sole** a gradini, con la luna e la sua fase. Vedi
`motore/acqua.js`, `motore/tratteggio.js` e la piazzola 11 dello zoo.

### Quello che manca all'acqua
- ⚠ **La simulazione non è collegata.** `world/acqua.js` importa `../config.js`,
  **che in questo progetto non esiste**: il modulo non si carica nemmeno, e
  nessuno lo istanzia. Posare una sorgente dà un cubo che non si sparge, e
  `worldgen` conta su una sim «pianificata da main» che non c'è mai stata. È
  lavoro di mondo, non di resa, e si prova in Node.
- **La schiuma attorno alle cose che galleggiano**: quando ci sarà la fisica
  (fase 5) e qualcosa galleggerà. La strada è la silhouette dall'alto di Lantern
  — un render delle sole sagome, che regala anche la **scia** — non una passata
  di profondità.
- **Gli impatti delle cascate**: il mesher li calcola già (`bAcqua.impatti`,
  posizione e altezza della colonna) e nessuno li legge.
- **Sott'acqua**: non esiste niente. Tinta e nebbia dell'acqua, il pelo visto da
  sotto, le caustiche sul fondo. Merita una piazzola sua.
- **Riflettere le COSE** (alberi, terreno): l'unica parte che costa un pass.
  ⚠ In Lantern era il **secondo** picco (11,1 ms): la scena ridisegnata
  specchiata senza culling proprio. Da rifare con `MirrorTexture` a un quarto di
  risoluzione e un `renderList` delle sole sagome vicine — e **misurato** prima
  di prometterlo, non ricopiato.

### Il resto della fase
Pioggia, neve, nuvole, lucciole, fuochi fatui. Sono effetti, non architettura.

---

## Fase 5 — Havok

- il gatto da controller scritto a mano a **rigid body**;
- da lì diventano possibili veicoli, NPC e galleggiamenti, che oggi non esistono;
- `useLargeWorldRendering` è già acceso: serve proprio a questo, e va misurato
  cosa costa.

---

## Fase 6 — AR

Il collante fra il tracker MindAR e la camera del motore.

⚠ Verificato prima di partire: `mindar-image.prod.js` (il core del tracker) ha
**zero** riferimenti a three — solo il binding li ha. Si riscrive il collante,
poche centinaia di righe; il tracker resta.

---

## Cose da portare dietro da Lantern, quando toccherà

- i modelli sono **FBX** e Babylon non li legge: vanno convertiti in `.glb` una
  volta sola, fuori dal gioco. Nove modelli. Da fare in fase 2 o 3, quando
  serviranno gli alberi.
- `src/ui/`, `src/net/`, `src/gioco/`, `src/player/`, `src/furniture/` non sono
  ancora stati copiati: si portano quando la resa sotto di loro è pronta.

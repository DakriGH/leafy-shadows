# Il REWORK — da «demo con 3 asset» a motore che regge il progetto vero

> Sessione aperta il 30/08/2026 per decisione del committente. Le sue parole,
> perché sono il mandato: *«il progetto non è stato programmato a moduli ed è
> pieno di errori … il codice ha bisogno di serio ordine e ottimizzazione
> sfruttando Babylon al meglio … un engine ampliabile super ottimizzato con
> prestazioni da urlo»* — e il tetto vero: *«sono previsti oltre 9000 asset,
> tra cui automazioni, NPC, veicoli … per non parlare dell'AR con il QR code
> per giocare a un diorama»*. E il vincolo che cambia tutto: **niente tagli
> grafici — la grafica deve SALIRE, non scendere**.

## Le tre verità da cui si parte

1. **Le prestazioni non verranno dai tagli.** Ogni millisecondo va guadagnato
   in architettura: passate più furbe, non grafica più povera.
   ⚠ **AGGIORNATO IL 02/09**: la scala automatica era stata TOLTA (era «una
   vergogna», e aveva ragione: oscillava, tagliava l'erba, spegneva il sole —
   tutte cose che si VEDONO). Adesso è tornata, ma con un contratto diverso e
   una riga sola: **automatica finché non la tocchi, ferma per sempre dopo**.
   `scala.fissa(0)` all'avvio non voleva dire «parti dal massimo» — ci si parte
   comunque — ma «parti dal massimo e non muoverti più», anche sulle macchine
   che a q0 fanno sei fotogrammi al secondo e non hanno modo di saperlo. I
   quattro livelli con un nome (ULTRA/ALTA/MEDIA/BASSA, pillola ⚙ e tasto K)
   restano e vincono sempre sull'automatismo.
2. **Il collo attuale non è il JavaScript** (misurato: <0,05 ms/frame nostro),
   **sono le PASSATE**: 4 cascate d'ombra ridisegnano ~50 mesh l'una, e
   l'acqua «vera» aggiunge specchio + rifrazione + profondità. Con 8 Mpixel e
   una RTX il fotogramma sta a ~9 ms: su un telefono, ingiocabile. Con 9000
   asset, impensabile — **il costo deve smettere di crescere col numero di
   mesh**.
3. **Il look si è allontanato da Leafy** («luci troppo realistiche, meno hue
   shift, colori più spenti e meno palettosi, ombre non come l'originale»).
   È un difetto di REGRESSIONE, non di gusto: Lantern è vivo su
   https://dakrigh.github.io/leafy-lantern/ ed è il termine di paragone — il
   confronto si fa fianco a fianco, mai a memoria.

## Le fasi — ognuna misurabile, nessuna «di pulizia generica»

### Fase R1 — Il quadro onesto (si misura PRIMA di toccare)
- Banco di misura riproducibile: stessa scena, stessa camera, 300 fotogrammi,
  p50/p99 di: fotogramma, ombre, ogni RTT, draw call, triangoli. Su questa
  macchina E sul telefono del committente (via 🩺).
- Inventario delle passate per fotogramma e di CHI le riempie.
- Mappa delle dipendenze vere fra i moduli (chi importa chi, chi tocca cosa):
  è la base del «programmato a moduli» — prima si fotografa, poi si sposta.

### Fase R2 — Le passate sotto controllo (il grosso dei ms)
- **Ombre**: cascate con `renderList` per distanza (già), `autoCalcDepthBounds`
  valutato, mappa che si rifà solo quando il sole si muove davvero (di notte e
  a mezzogiorno fermo è GRATIS); lampade: budget per pozza, mai N mappe.
- **Acqua**: specchio/rifrazione/profondità con liste già filtrate (fatto,
  −1,7 ms su desktop) → poi: risoluzione per livello, pausa quando nessuna
  acqua «vera» è a schermo, UNA passata di profondità condivisa fra tutti gli
  effetti che la vorranno (AR compresa).
- **Tetto di passate dichiarato**: una tabella che dice quante passate esistono
  e perché — ogni passata nuova si paga lì, visibile.

### Fase R3 — L'architettura per 9000 asset
- **Catalogo asset dichiarativo**: un asset = una riga dati (modello, LOD,
  impronta, si-istanzia, proietta-ombra, classe di aggiornamento). Niente
  `new Mesh` sparsi: TUTTO passa da una fabbrica che istanzia.
- **Thin instances per famiglia** (già per l'erba: 101k lamelle a 0,18 ms — è
  la prova che la strada regge); pooling per proiettili/effetti; `freeze` per
  ciò che non si muove; materiali CONDIVISI per famiglia (target: <30 materiali
  vivi, non 9000).
- **LOD a 3 livelli + impostor lontano**, deciso dal catalogo, non dal codice.
- **Streaming**: gli asset entrano/escono per distanza a bilancio per frame
  (la coda del mesher è già così — si generalizza quel pattern).
- **NPC/veicoli/automazioni**: aggiornamento a FASCE (vicino: ogni frame;
  medio: 1/4; lontano: 1/30 + nessuna animazione) — il costo CPU deve crescere
  con quello che si VEDE, non con quello che ESISTE.

**Stato R3 al 02/09 (ramo `claude/rework-architettura`, sessione cloud):**
- ✅ scarico dei chunk oltre la distanza + PELLE per i lontani + raggi dal profilo
  (`pieno`, da aggiungere alla tabella LIVELLI: con la pelle `dist` può salire);
- ✅ mesher in Worker stateless con fotografia della zona; avvio: 3×3 in linea,
  il resto dal Worker a bilancio;
- ✅ identità della materia per vertice + tavolozza per pixel (multi-materiale
  in una chiamata di disegno; §13 completo: emissione, brillio, cielo, curva);
- ✅ uniform delle lampade una volta per programma per fotogramma;
- ✅ Officina nel sorgente (`src/officina/`, `officina.html`);
- ⏳ catalogo asset dichiarativo, LOD/impostor dei modelli, streaming della
  GENERAZIONE (oggi il mondo si genera tutto: a r400 sono 2 minuti e 9 GB —
  serve worldgen per chunk a richiesta, ora che le mesh sanno scaricarsi);
- ⏳ luci in cluster (oltre 24 lampade) e UBO per fotogramma.

### Fase R4 — Il look di Leafy, riconquistato
- Confronto A/B con Lantern (stessa ora, stessa scena): palette, tinta
  dell'ombra, hue shift del ciclo del giorno, saturazione.
- Le costanti del look in UN modulo (`motore/palette.js`?) con nomi parlanti —
  oggi sono sparse fra stile.js/giorno.js/luci.js, ed è il motivo per cui il
  look è scivolato senza che nessuno lo decidesse.
- Verdetto SOLO del committente, su scatti affiancati.

### Fase R5 — La GUI di debug rifatta
- Fatta la prima metà: pillole ⚙ grafica (4 livelli manuali) e 💧 acqua.
- Da fare: pannello di debug NUOVO — oggi «confusionario, poco chiaro,
  mancano settaggi»: sezioni chiudibili (fotogramma / passate / mondo /
  memoria), interruttori singoli (ombre sole, ombre lampade, acqua vera,
  particelle, FXAA, aniso), tutto toccabile, tutto col suo costo scritto
  accanto in ms misurati vivi.

### Fase R6 — AR e diorama (il traguardo dichiarato)
- WebXR di Babylon (il motore ce l'ha nativo: `WebXRExperienceHelper`,
  hit-test, anchors) — il diorama è una scena PICCOLA e fissa: è il caso
  MIGLIORE per l'AR, se il motore non spreca passate (vedi R2).
- QR → URL con parametri (mondo, vista): la pipeline di pubblicazione c'è già.
- Budget AR: 72/90 Hz, quindi il lavoro di R2/R3 è il prerequisito, non un
  extra.

## Le regole della sessione
- **Ogni fase chiude con numeri prima/dopo** sulla stessa scena. Niente
  «dovrebbe essere più veloce».
- **Niente riscritture totali**: si sposta un modulo per volta, coi test verdi
  a ogni passo (214 oggi — la suite È la rete).
- **Fuori da `src/motore/` non si nomina Babylon** — la regola che ha reso
  possibile la migrazione resta la spina dorsale della modularità.
- Il committente vede OGNI cambiamento visivo prima che diventi definitivo.

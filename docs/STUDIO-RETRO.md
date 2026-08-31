# STUDIO — come i vecchi giochi facevano tanto con poco (e cosa ne prendiamo)

> Richiesta del committente: «studia come i vecchi giochi riuscivano con
> pochissimo calcolo e memoria ad avere grafica da paura e performance
> incredibili». Due ricerche sulle fonti (i trucchi documentati dell'era
> PS1/N64/PS2/GC/Wii, e la loro traduzione sulle GPU a tile dei telefoni), poi
> la mappatura su Leafy-Shadows. Come per l'acqua: prendere appunti, mica
> rubare. Ogni voce ha la riga **da noi** — già fatto / da fare con misura / no
> e perché.

## Il principio che unisce tutto

I vecchi giochi non erano veloci nonostante i limiti: erano veloci perché
**spostavano il lavoro dal runtime alla build** (visibilità, luce, layout del
disco calcolati offline) e perché **la direzione artistica era progettata sui
punti di forza dell'hardware** (Gouraud e vertex color dove la banda texture
non c'era, nebbia dove i poligoni finivano). E la lezione moderna è
identica, perché le GPU dei telefoni sono figlie del Dreamcast: tile-based,
banda esterna preziosa, memoria on-chip gratis.

## Le tecniche, e cosa ne facciamo

### 1. Vertex color come canale di luce/AO/materiale
Shadow of the Colossus dipinge AO e ambiente nei colori dei vertici; l'N64
(TMEM da 4 KB!) viveva di Gouraud; Spyro disegnava il lontano SENZA texture,
solo colori sfumati — ed era il suo look.
**Da noi: è già la spina dorsale** (il mesher cuoce cima/lato/fondo nei
vertici; la flora idem; niente texture sul terreno). **Candidato nuovo: l'AO
per-vertice cotta dal mesher** — gli angoli interni delle terrazze leggermente
scuriti, calcolati al meshing (il vicinato lo conosce già): profondità visiva
gratis a runtime, zero banda. Da fare con confronto A/B col committente (tocca
il LOOK: in Lantern un tentativo simile fu bocciato — qui sarebbe più sottile
e per-vertice, non per-faccia).

### 2. Micro-maschere grayscale ricolorate a runtime (TEV / Wind Waker)
L'oceano di Wind Waker: UNA micro-texture in bianco e nero, ripetuta, letta
due volte con offset, colorata a runtime; i 16 stadi del TEV facevano di una
maschera dieci effetti. La CLUT della PS1 era la stessa idea.
**Da noi: già così** — il tratteggio dell'acqua è UNA texture procedurale
128² a 4 canali (tratti/deriva/scintille/chiazze) tinta dalle ricette; 40
acque da una texture. È la conferma che la strada è giusta, non un lavoro
nuovo.

### 3. «Distorci l'oggetto, non lo schermo» (Mario Galaxy)
Su Wii la rifrazione dell'acqua bassa è il FONDALE che ondeggia, non un
effetto screen-space: niente copia del framebuffer — su una GPU a tile ogni
passata fullscreen costa un load/store completo (ARM: fino a +400% di banda
coi render target maneggiati male).
**Da noi:** la rifrazione vera (RTT) resta il tetto desktop; **il candidato
mobile è la variante Galaxy** — perturbare le UV/vertici del solo fondale
sotto l'acqua — per dare «rifrazione» anche dove oggi `vera` è 0. Da
prototipare nel banco acqua e misurare con la serie.

### 4. La nebbia è un contratto, non un ripiego (Silent Hill, Jak & Daxter)
Silent Hill: mondo visibile fino a ~13 m, chunk caricati a ~16 — la nebbia
maschera streaming E clipping, e DIVENTA l'atmosfera. Jak & Daxter: chunk
dimensionati così che non puoi mai attraversarne lo spazio più in fretta di
quanto si carichi il prossimo — lo streaming senza singhiozzi come vincolo di
level design, verificabile offline.
**Da noi: già a metà** (nebbia + `dist` + coda del mesher a bilancio). Il
patto alla Jak — «raggio caricato ≥ velocità del giocatore × tempo di mesh» —
va scritto come PROVA in Node quando il mondo diventa grande: è un teorema,
non una speranza.

### 5. Visibilità precalcolata (Quake PVS, Crash su binari)
Quake: l'occlusione più costosa del rendering ridotta a una lettura di bit
(PVS compresso: 5 MB → 20 KB). Crash: camera su binari → visibilità e sorting
per-punto calcolati la notte, runtime a costo zero, «centinaia di poligoni a
un metro da Crash» quando i rivali arrancavano.
**Da noi:** il mesher già non emette facce coperte; l'occlusione FRA chunk
(una collina davanti = chunk dietro mai disegnati) non c'è. Candidato R3 per
il mondo grande: un PVS grossolano per chunk cotto al meshing. Misurabile con
i disegni. ⚠ Non prima che il mondo sia grande: sul 7×7 attuale il frustum
basta.

### 6. Le ombre: cuocere lo statico, mappare solo il dinamico
Il consenso mobile (Meta/ARM/Samsung): le cascate sono il pattern peggiore per
un tiler — ogni cascata è un re-render con store/load della depth. La regola
retro: ombra cotta per il mondo fermo, mappa piccola SOLO per ciò che si
muove, blob oltre i 15 m.
**Da noi: già a metà con la via di mezzo giusta** — il congelamento a scena
ferma (la mappa non si rifà quando niente si muove) tiene le cascate VIVE ma
quasi gratis da fermi; su mobile sono già 2×1024 diradate. **Il passo
successivo NON si fa senza il committente**: cuocere l'ombra del sole nei
vertici significa rinunciare all'ombra mobile del ciclo del giorno sul
terreno — è una scelta di look, non di codice. Da portare in R4 con un
confronto fianco a fianco.

### 7. MSAA sì, FXAA no — su GPU a tile è il CONTRARIO del desktop
I sample MSAA vivono nella memoria on-chip e si risolvono on-tile (~500 MB/s);
FXAA è per definizione una passata fullscreen (store + rilettura totale,
ordini di grandezza di banda in più). La vecchia nota di casa «l'MSAA
quadruplica il riempimento» era una verità da GPU desktop applicata al tiler.
**Da noi: FATTO in questa tornata** — sui profili mobile FXAA è spento in
tabella e l'MSAA del canvas è acceso (`antialias` su classe/GPU mobile);
`preserveDrawingBuffer` è false ovunque (gli scatti passano da `rig.scatto`).
Da verificare coi numeri della serie sul Mali.

### 8. L'erba: i micro-triangoli pagano due volte sul tiler
ARM: ≥10 px di area per triangolo, <1,5 vertici shadati per triangolo; le
lamelle singole gonfiano il binning (la geometria fa un giro in RAM per
costruzione su Mali) e rasterizzano quasi nulla. Rimedi d'epoca: ciuffi più
grossi, LOD feroce sul numero di vertici, billboard a media distanza.
**Da noi: il candidato mobile più promettente dopo le ombre** — l'erba a
ciuffi (2-3 quad incrociati per ciuffo invece di lamelle singole) taglierebbe
i vertici di ~3-4× a parità di aspetto pieno. È un lavoro sul MESH dell'erba,
non sulla sua densità: niente tagli visivi. Da fare con confronto visivo +
serie sul Mali. ⚠ E niente `discard` nel fogliame (rompe early-Z su Mali e
HSR su PowerVR): le silhouette restino poligonali, come già sono.

### 9. Billboard e impostor (gli alberi di Mario 64)
Un albero = 2 triangoli che guardano la camera; a distanza l'occhio non
distingue. L'antenato degli impostor.
**Da noi:** candidato per il mondo grande (alberi/flora oltre ~60 blocchi
come billboard generati dai modelli veri). Insieme al LOD «alla Spyro»:
lontano = geometria dimezzata e SENZA dettagli, tanto lo stile è nei colori.

### 10. Streaming dal disco col layout deciso offline (Crash)
Pagine da 64 KB, 3 al secondo, layout del CD calcolato la notte, 2 MB di RAM
con 4 byte di margine.
**Da noi:** la traduzione è il catalogo asset di R3 — cosa serve vicino, cosa
si può caricare dopo, deciso da DATI (per-asset: priorità, raggio, LOD) e non
da codice. Il pattern della coda del mesher è già quello giusto.

## L'ordine dei lavori che ne esce (tutti con misura prima/dopo)

1. ✅ **MSAA↔FXAA ribaltati su mobile** (fatto, da confermare con la serie).
2. ✅ **Rifrazione alla Galaxy** (n. 3) — FATTA: `uFondaleOnda` nel materiale
   del mondo (vertex, dentro il rettangolo dell'acqua e sotto il pelo), zero
   passate, interruttore «〰 fondale Galaxy» nel banco. Verificata a schermo su
   ghibli (vera 0): i gradoni sommersi serpeggiano, l'asciutto è fermo.
3. **Erba a ciuffi** (n. 8) — il più grosso candidato senza-tagli sul Mali.
   ⚠ SOLO dopo la serie dal telefono: prima si attribuisce, poi si taglia.
4. ~~AO per-vertice dal mesher~~ — **NO: già bocciata in QUESTO progetto**
   (i commenti del mesher lo dicono: la rotazione della diagonale serviva
   all'AO che c'era, e l'orlo l'ha sostituita dopo il verdetto). Non si
   ripropone una cosa bocciata di propria iniziativa: se ne riparla solo se il
   committente la chiede vedendo questo studio.
5. **Ombre cotte + mappa dinamica** (n. 6) — solo dopo il verdetto sul ciclo
   del giorno in R4.
6. **PVS per chunk / impostor / patto di streaming** (n. 5, 9, 4, 10) —
   quando il mondo diventa grande (R3 avanzata).

## Fonti principali
Gavin su Crash (all-things-andy-gavin.com, gamedeveloper.com) · Sanglard su
Quake e Doom-fire (fabiensanglard.net) · Copetti sulle architetture
PS1/N64/PS2/GC (copetti.org) · Froyok su SotC · Gordon/ZeldaDungeon su Wind
Waker · codersnotes su Galaxy · ARM Mali best practices (developer.arm.com) ·
Samsung GameDev · Vulkan Guide TBR · Imagination/PowerVR · Meta (tecniche PC
da evitare su mobile) · MDN WebGL best practices · Android Developers su MSAA
on-tile. Gli URL completi stanno nei rapporti di ricerca di questa sessione.

# Leafy-Shadows — programma grafico

Obiettivo dichiarato: migliaia di poligoni, materiali simil-PBR (metallo,
specchio, emissivo) simulati e leggerissimi, mesh con più materiali, distanza
di resa e d'ombra molto più lunghe, niente acne, un sistema di luci vero. E
tutto questo su un telefono vecchio, non solo sul portatile. Qui c'è come.

La chiave di volta è UNA: **un solo materiale «uber» con l'identità del
materiale scritta nei vertici**. Tutto il resto (multi-materiale, metallo,
emissivo, luci, meno draw call) discende da lì.

## 1. Il materiale unico («LeafyLite»)

Oggi ci sono 12 materiali e ogni mesh ne ha uno; il toon shader viene
iniettato in un `CustomMaterial` per ciascuno. Domani:

- **Un attributo per vertice `aMateriale`** (un byte) che indicizza una
  **tavolozza dei materiali** in una texture 64×N (RGBA8, nearest): tinta,
  metallico, ruvidità, emissivo, e due bandiere (riceve ombre, si bagna).
  Cambiare un materiale = scrivere un texel; nessuna ricompilazione.
- **Una mesh può avere parti di materiali diversi gratis**: è lo stesso
  buffer, cambia solo il byte per vertice. Un lampione con palo di ferro,
  vetro e lampadina emissiva è UN draw call. I GLB si importano leggendo i
  loro materiali e assegnando l'indice.
- **Chunk, flora, modelli, acqua-fondale condividono lo shader**: da 12
  materiali si scende a 3 (opaco, alfa-test per le foglie, acqua). Meno
  cambi di stato, e il costo dei bind delle lampade (oggi per ogni mesh)
  sparisce con l'UBO del §4.

### PBR simulato, non calcolato

Il PBR vero di Babylon (IBL, BRDF LUT, 6–8 sampler) è fuori budget su Mali.
Quello che serve visivamente sono tre cose, e costano poco:

| effetto | come | costo per pixel |
|---|---|---|
| **metallo / specchio** | riflessione da una **cubemap del cielo** 64² prefiltrata in 4 mip (una per ruvidità), ricalcolata ogni ~5° di sole (una passata da 6×64² ogni tanto, non a frame); Fresnel di Schlick; niente specchio planare se non per l'acqua | 1 lettura cubemap + 4 mul |
| **speculare** | GGX approssimato (Karis mobile): `roughness²` e un `pow` solo | ~6 op |
| **emissivo** | il texel della tavolozza dice «emette»: colore pieno fuori dal toon, sommato; il bagliore attorno lo fanno gli **aloni** già esistenti (sprite additivi), non un bloom a schermo intero. Bloom a mezza risoluzione solo nei profili alti | 0 extra |
| **bagnato** (riva, pioggia) | ruvidità abbassata e tinta scurita dal bordo dell'acqua che il chunk già conosce (`aRiva`) | 2 op |

Lo specchio planare resta solo per l'acqua, con la passata piccola, cullata
e a bassa frequenza descritta nella diagnosi.

## 2. Migliaia di poligoni: il costo vero non sono i poligoni

Un Adreno 5xx digerisce 300–500 k triangoli a 60 fps se arrivano in poche
chiamate. Oggi il problema è che arrivano in 700 chiamate e 5 passate.

- **Smusso a costo zero**: oggi lo smusso dei blocchi è geometria (fino a
  44 triangoli per blocco). Diventa un effetto di **normale inclinata e
  occlusione per vertice** sui bordi delle facce piatte: 12 triangoli per
  blocco esposto (meno con le facce unite), stesso aspetto da un metro in là,
  e la vera geometria smussata resta solo per il livello di dettaglio vicino
  al giocatore (raggio 2 chunk).
- **Vertici condivisi e facce unite** nel mesher (in Worker): −60 % vertici.
- **Modelli veri a migliaia di poligoni** (alberi, furni): thin instances
  per tipo, con due LOD nel GLB (Blender, decimazione) e `addLODLevel`; oltre
  una distanza l'albero è un **impostor**: due quad incrociati con la
  silhouette pre-renderizzata, come l'erba lontana di oggi.
- **Budget per fascia**, scritti nei profili e misurati dall'Officina:

| fascia | scala | triangoli/frame | draw call | mappa d'ombra | luci/pixel | passate RTT |
|---|---|---|---|---|---|---|
| telefono vecchio (A11, Mali-G72, Adreno 5xx) | 0.75 | ≤ 200 k | ≤ 120 | 1 × 1024 | 4 | nessuna |
| telefono medio / Chromebook | 0.85 | ≤ 400 k | ≤ 200 | 2 × 1024 | 8 | acqua 256² ogni 3 |
| portatile integrato | 1.0 | ≤ 800 k | ≤ 300 | 3 × 1536 | 8 | acqua 256² |
| dedicata | 1.0 (DPR 2) | ≤ 2 M | ≤ 500 | 3 × 2048 + lontana | 16 | acqua 512² |

## 3. Distanza di resa e distanza d'ombra

- **Tre anelli di chunk**: vicino (geometria piena, smussi veri), medio
  (facce unite, smusso finto), lontano (**pelle del terreno**: un quad per
  colonna, solo la cima, colore per vertice, un draw call per 4×4 chunk).
  Con questo la distanza passa da 150 a 300–400 blocchi spendendo circa il
  10 % in più, e la nebbia torna a essere un effetto, non una toppa.
- **Generazione e mesh in Worker**: la distanza non deve più dipendere da
  quanto il thread principale regge senza scatti.
- **Ombra lontana come lightmap**: oltre le cascate (che restano a 60–90
  blocchi) l'ombra del sole si prende da una **mappa ortografica dall'alto
  dell'intero mondo** a 1024², rifatta quando il sole si sposta di 3–5° (una
  passata ogni decina di secondi, non a frame). Un mondo voxel con luce
  direzionale è il caso ideale: l'ombra lontana è statica per definizione.
  Costo per pixel: una lettura in più. Effetto: alberi che proiettano ombra a
  300 blocchi, cosa che nessuna cascata può dare.

## 4. Acne e qualità dell'ombra

L'acne che si vede oggi ha quattro cause, tutte con rimedio noto:

1. **Facce frontali nella mappa d'ombra**: per geometria chiusa (i blocchi)
   si rende la mappa con le **facce posteriori** (`forceBackFacesOnly`): la
   profondità dell'occlusore arriva dal retro e l'acne sulle superfici
   illuminate sparisce quasi del tutto; il piccolo distacco che ne deriva è
   invisibile su un mondo a blocchi.
2. **Bias fisso**: al suo posto **bias in pendenza** + normal offset scalato
   con il texel della cascata in cui si sta (ogni cascata ha un texel di
   dimensione diversa: un bias buono per la prima è cattivo per la terza).
3. **Cascate che tremano**: `stabilizeCascades` c'è già; va aggiunta la
   **quantizzazione della direzione del sole** (il ciclo del giorno muove il
   sole a ogni frame e la mappa non si congela mai) e il rinnovo a scaglioni:
   cascata vicina ogni frame, lontane ogni 2–4.
4. **Riduttore di profondità automatico** che costa una passata: min/max si
   conoscono dal mondo (quota minima e massima dei chunk visibili).

Filtro: PCF 3×3 con confronto hardware (`QUALITY_MEDIUM`) ovunque; PCSS solo
sulla fascia dedicata. Prova subito i valori di bias, normal bias, lambda e
filtro nella scheda **Ombre** dell'Officina: quello che trovi buono sul
telefono va nel profilo.

## 5. Il sistema di luci

Oggi: 24 lampade in tre array uniform, ricaricati a ogni bind, valutate
tutte per ogni pixel. Domani:

- **Luci in cluster**: lo schermo diviso in tegole 16×16 px (e 8 fette di
  profondità); un piccolo passo CPU (o un Worker) assegna a ogni cluster le
  luci che lo toccano e scrive due texture: lista degli indici e dati delle
  luci (posizione, raggio, colore, tipo). Per pixel si leggono solo le 2–8
  luci del suo cluster: il numero totale può salire a **256** senza toccare
  il costo per pixel.
- **Un UniformBuffer per frame** per sole, luna, ambiente, nebbia, ora, cielo:
  scritto una volta, letto da tutti i materiali.
- **Tipi di luce**: puntiforme, area (le lampade a scatola di oggi), spot
  (lanterne, fari), **emissivo di blocco** (lava, funghi: la tavolozza dei
  materiali marca «emette» e il mesher genera una luce puntiforme per gruppo
  di blocchi emissivi, come oggi fa per le lampade).
- **Ombre delle lampade**: la marcia voxel resta ma solo per le 2 luci più
  vicine al pixel e con 12 passi invece di 28; le altre luci senza ombra.
- **Luna e cielo**: la luna è una seconda direzionale senza ombre; l'ambiente
  è un emisferico con colore del cielo sopra e della terra sotto, entrambi
  dal ciclo del giorno; di notte i cluster fanno il lavoro.

## 6. Ordine, e cosa si può provare già

1. Materiale unico con tavolozza e `aMateriale` (sblocca tutto il resto).
2. Mesher in Worker: facce unite, vertici condivisi, tre anelli di distanza.
3. Ombre: facce posteriori, bias in pendenza per cascata, quantizzazione del
   sole, niente riduttore. Poi la lightmap lontana.
4. Luci in cluster + UBO per frame.
5. Cubemap del cielo, Fresnel, GGX mobile, emissivo dalla tavolozza.
6. LOD/impostor dei modelli, bloom a mezza risoluzione sulla fascia alta.

Già oggi dall'Officina: **Qualità → distanza di resa, ombre fino a, cascate,
mappa**; **Ombre → bias, normal bias, lambda, filtro, profondità
automatica**. Misura 5 secondi prima e dopo, copia il rapporto: sono i numeri
con cui si scrivono i profili quando arriva il sorgente.

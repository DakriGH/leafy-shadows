# Leafy-Shadows — diagnosi delle prestazioni (build 49394de, 31/08)

Fatta sulla build pubblicata de-minificata (i nomi delle proprietà, le stringhe
e gli shader GLSL sopravvivono alla minificazione; i commenti e i nomi locali
no) e confrontata con la build del 28/08 (`6c8aea0`, sorgente `1d29546`), che è
l'ultima prima della nuova acqua. Le righe citate sono del bundle formattato
con prettier; nel sorgente i punti si ritrovano dai nomi.

## 1. Perché da 80 fps si è passati a 12

**L'ultima build ha cambiato la ricetta d'acqua di partenza da `ghibli` a
`lago`**, e `lago` è l'unica ricetta con `riflesso: true` e `vera: 3`.
Costruendo il materiale, quelle due bandiere accendono **tre rese complete
della scena in più a ogni fotogramma**, oltre alla resa principale e alle
quattro cascate d'ombra:

| passata | dimensione | lista di resa | note |
|---|---|---|---|
| `specchio-acqua` (MirrorTexture) | 512² desktop, 256² mobile | tutte le mesh del mondo (114 nella prova) | + 2 passate di sfocatura (`adaptiveBlurKernel 12`) + mipmap; il `clipPlane` cambia i `#define` di ogni materiale due volte a frame; il piano è a y = 9.5 mentre il lago sta a 5 |
| `rifrazione-acqua` (RenderTargetTexture) | 512² / 256² | tutte le mesh del mondo | è la stessa immagine che la resa principale sta per disegnare |
| `DepthRenderer` | **piena risoluzione dello schermo** (× DPR fino a 2) | tutte le mesh del mondo | mai ridimensionata quando cambia la scala del profilo |

Tre fatti li rendono peggiori di quanto sembrino:

1. **Le liste di resa fisse non vengono cullate al frustum.** L'`ObjectRenderer`
   di Babylon disegna tutto quello che c'è in `renderList`; la resa principale
   disegna solo quello in vista. Nella prova a 1280×720: 73 mesh attive nella
   resa principale, 114 in ognuna delle tre passate.
2. **Le liste non si svuotano mai.** I chunk ricostruiti vengono aggiunti con
   `onNewMeshAddedObservable`, ma `dispose()` toglie una mesh dalle mappe
   d'ombra e non dai `customRenderTargets`: in una sessione lunga le liste
   crescono.
3. **I profili di qualità non le toccano.** L'unica leva sull'acqua nei
   profili è `ombraAcqua`. Anche a livello «bassa» (scala 0.5, senza ombre del
   sole) le tre passate restano, e la mappa di profondità resta a piena
   risoluzione. Lo scalatore adattivo, che nella build del 28/08 scendeva da
   solo, ora è fermo: `scala.fissa(0)` all'avvio e `osserva()` non viene più
   chiamata.

Numeri della prova headless (stessa scena, 1280×720, livello 0):

| build | draw call a frame | mesh attive (resa principale) | passate extra |
|---|---|---|---|
| 49394de (31/08), ricetta `lago` | **698** | 73 | ombre 2048²×4 (63 mesh) · specchio 512² (114) · rifrazione 512² (114) · profondità 1280×720 (114) · riduttore minmax |
| 6c8aea0 (28/08), ricetta `tratti` | **300** | 50 | ombre 2048²×4 (52) · riduttore minmax |

I 398 draw call in più sono le tre passate dell'acqua (114 mesh × 3, più
sfocature e mipmap). Nella build del 28/08 lo scalatore adattivo funzionava:
lasciato libero, in software scendeva da solo al livello 4 (88 draw call).

Le misure di tempo in software (SwiftShader) non sono rappresentative e non
sono riportate: quelle vanno fatte sul dispositivo, con `officina.html`.

### 1b. Conferma sul dispositivo

Aprire `officina.html`, scheda **Acqua**: spegnere «specchio» e portare «acqua
vera» a 0, misurare; poi rimettere `lago` e misurare. La differenza è il costo
di cui sopra. Con «passate cullate al frustum» acceso si vede quanto pesa la
mancanza di cull da sola.

## 2. Il costo dello shader dell'acqua

Per ogni pixel d'acqua con `lago`: circa 10 letture di texture (4 per il
rumore «ricco», profondità ×2, rifrazione, caustiche ×2, specchio), 9–18
campioni d'ombra PCF (4 cascate, qualità alta), fino a 24 lampade con marcia
voxel di 28 passi ciascuna dentro il raggio, cicli fissi su 8 tocchi e 16
scie, una trentina di funzioni trascendenti. Alpha blending, niente `discard`.
Era già quasi tutto acceso con `ghibli` a 80 fps: pesa dove il lago riempie lo
schermo a DPR 2, ma non è lui il salto 80 → 12.

## 3. Il resto del motore (quello che tiene lontani dall'obiettivo anche senza acqua)

Ordinato per impatto stimato sui dispositivi vecchi.

1. **Geometria dei blocchi: smussata, non indicizzata, per blocco.** Ogni
   blocco emette fino a 6 facce + 12 smussi + 8 angoli (44 triangoli se tutto
   esposto), tre vertici unici per triangolo, normali calcolate su CPU, array
   JS con `push`, 26 letture di `Map` a stringhe per blocco. Le cascate
   d'ombra ridisegnano tutto questo 2–4 volte. Fix: vertici condivisi, facce
   piatte unite, mesher in Worker su `Uint8Array`.
2. **Ombre desktop a livello 0: 4 × 2048² con PCF alto e `autoCalcDepthBounds`**,
   che accende una passata di profondità più una catena di riduzione min/max
   a ogni frame. La mappa non si congela quasi mai perché il sole si muove e
   la firma si arrotonda a 0.01. Fix: 3 cascate, min/max noti dal mondo,
   quantizzazione più grossa, PCF medio.
3. **Uniformi delle lampade caricate a ogni bind di materiale**: tre array da
   24 (posizioni, colori, estensioni) più la texture 3D dei voxel per OGNI
   mesh in OGNI passata; con ~700 draw call sono decine di migliaia di
   chiamate GL. Fix: un UniformBuffer per frame.
4. **Erba**: buffer di 500 000 matrici identità (32 MB) mai letto dallo
   shader; a ogni blocco piazzato si risemina TUTTO il prato con budget di
   14 ms a frame e si ricarica fino a 28 MB in un colpo. Fix: buffer di una
   matrice, risemina del solo chunk toccato.
5. **Scansioni dell'intero mondo su eventi ordinari**: griglia voxel delle
   luci ricalcolata su tutti i blocchi, ritinta stagionale che riscrive i
   colori di tutti i chunk, ricostruzione sincrona 3×3 al cambio di stagione,
   ri-istanziamento di tutti i modelli a ogni frame mentre una decorazione è
   animata.
6. **Picking di Babylon ancora attivo su pointer down/up** mentre il gioco fa
   il suo DDA: test ray-triangoli su decine di migliaia di triangoli a ogni
   tocco. Fix: `skipPointerDownPicking`, `skipPointerUpPicking`, chunk non
   pickabili.
7. **Risoluzione mobile**: DPR fino a 1.5 × scala 1 + MSAA + 2 × 1024² di
   ombre + le passate dell'acqua a 256². Fix: scala 0.85 e DPR 1.25 al
   livello 0 mobile, MSAA spento sulle GPU a tile.
8. **DOM ogni frame**: ~12 `setAttribute` sull'SVG del quadrante del cielo e
   una stringa di etichetta ricostruita a ogni frame.
9. **Scalatore adattivo scollegato** (vedi §1): ogni dispositivo parte al
   massimo e ci resta.

## 4. Ordine di lavoro proposto

1. Ricetta di partenza non-`lago` finché le passate non stanno nei profili
   (un rigo: torna a 80 fps).
2. Acqua nei profili: `vera`, `riflesso`, lato RTT, scala della profondità
   per livello; scalatore riattaccato.
3. Una passata sola per rifrazione+profondità; liste cullate e ripulite;
   specchio a 256², ogni 2–3 frame, piano alla quota giusta.
4. Ombre desktop (3 cascate, niente riduttore), picking spento: mezz'ora di
   lavoro, guadagno netto ovunque.
5. Erba (buffer e risemina), lampade in UBO.
6. Mesher in Worker con vertici condivisi: è il lavoro grosso, e quello che
   porta i telefoni vecchi sopra i 60.

# Leafy-Shadows — architettura modulare verso il sandbox MMO (AR)

Questo documento è il piano per il sorgente. È scritto guardando la build
pubblicata (49394de) dopo averla de-minificata: i nomi dei moduli sotto sono
quelli che si vedono nell'oggetto `LEAFY` e nei nomi delle proprietà; i
confini proposti sono quelli che nella build oggi NON ci sono.

## 1. La diagnosi in una riga

Il motore è già diviso in pezzi (rig, fabbrica, mondo, mesher, erba, giorno,
modelli, decoro, cantiere, scala), ma i pezzi si parlano **infilando le mani
l'uno nell'altro**: `giorno` scrive dentro `rig` cinque campi a ogni frame,
`fabbrica` legge `rig.profilo` e `rig.motore._gl`, il file di avvio tiene
quaranta variabili condivise tra mira, scavo, animazioni e HUD, e le
decorazioni vivono in tre posti (blocchi del mondo, elenco `decoro`,
istanze dei modelli) tenuti allineati con una ricostruzione totale.
Non è un problema di stile: è il motivo per cui l'acqua ha potuto accendere
tre passate di resa senza che i profili di qualità se ne accorgessero.

## 2. I confini

```
src/
  nucleo/        motore, scena, camera, loop, tempo, eventi         (nessuna regola di gioco)
  qualita/       profili, scalatore adattivo, rilevamento hardware  (UNICO posto che decide «quanto»)
  resa/          ombre, acqua, erba, cielo, luci, materiali         (ogni sistema espone: registro + costo)
  mondo/         blocchi, chunk, worldgen, stagioni, decorazioni    (dati puri, zero Babylon)
  mesher/        chunk → geometria, in Worker                       (legge mondo, produce buffer)
  gioco/         passeggero, cantiere, scavo, mira, inventario      (regole; parla al mondo con COMANDI)
  comandi/       bus: esegui / annulla / ripeti / serializza        (UNA porta di scrittura per tutti)
  officina/      pannello schema-driven, misure, preset             (legge registri, emette comandi)
  ui/            barra, pillole, modo tocco/mouse, diagnosi
  rete/          (dopo) client, sincronizzazione chunk, autorità server
```

Tre regole, non negoziabili:

1. **Verso il basso si importa, verso l'alto si osserva.** `resa` può importare
   `nucleo`; `nucleo` non sa che esiste `resa`. Chi sta sotto emette eventi
   (`onProfilo`, `onOra`, `onChunkPronto`), chi sta sopra si iscrive. Oggi
   `giorno` scrive `rig.ambienteCol`: domani `giorno` emette `{sole, ambiente,
   ombra}` e `resa/cielo` e `resa/ombre` ascoltano.
2. **Ogni sistema di resa dichiara il suo costo.** Un'interfaccia sola:
   `{ registro(), applicaProfilo(p), passate() }`. `qualita` chiama
   `applicaProfilo` su TUTTI i sistemi: l'acqua non può più avere passate
   fuori dal profilo, perché il profilo è l'unico che gliele accende.
3. **Il mondo si scrive solo con comandi.** `metti`, `rompi`, `piazza`,
   `accendi` sono comandi `{tipo, dove, cosa, autore, t}`. Il cantiere del
   giocatore, l'Officina e domani il server passano dallo stesso bus. È il
   passo zero del multiplayer: quando il bus va in rete, il gioco non cambia.

## 3. Cosa cambia per le prestazioni (ordine di lavoro)

| # | Intervento | Modulo | Effetto atteso |
|---|---|---|---|
| 1 | Acqua nei profili: `vera`, `riflesso`, lato RTT, scala della profondità per livello; default non-`lago` sotto «alta» | qualita, resa/acqua | ritorno a ≥ 80 fps subito |
| 2 | Una passata sola per rifrazione+profondità (RTT opaco con depth allegato, riusato dall'acqua) invece di RTT colore + DepthRenderer a piena risoluzione | resa/acqua | −2 rese di scena a frame |
| 3 | Liste delle passate cullate al frustum (`getCustomRenderList` dalle mesh attive; frustum riflesso per lo specchio) e ripulite quando un chunk sparisce | resa/acqua | ogni passata passa da «tutto il mondo» a «quello in vista» |
| 4 | Specchio: piano alla quota vera dell'acqua, 256², `refreshRate` 2–3, niente sfocatura a 12 | resa/acqua | costo specchio ÷ 3–6 |
| 5 | Ombre desktop: 3 cascate, `autoCalcDepthBounds` spento (min/max noti dal mondo), quantizzazione più grossa del sole per congelare la mappa | resa/ombre | −1 passata profondità, mappa ferma più a lungo |
| 6 | Mesher in Worker su `Uint8Array` per chunk (niente Map di stringhe), vertici condivisi, facce piatte unite | mesher | −40–60 % vertici, ricostruzione 5–10× |
| 7 | Erba: via il buffer di matrici identità (32 MB), risemina SOLO il chunk toccato, cap mobile | resa/erba | −40 MB, niente scatto a ogni blocco |
| 8 | Luci delle lampade in un UBO per frame invece di 3 array da 24 per OGNI bind | resa/materiali | migliaia di chiamate GL in meno a frame |
| 9 | Scalatore adattivo riattaccato al loop (oggi `fissa(0)` lo tiene fermo) | qualita | i dispositivi vecchi scendono da soli |
| 10 | `skipPointerDownPicking/UpPicking`, chunk non pickabili | nucleo | niente scatti al tocco |

I dettagli con numeri di riga della build sono in `DIAGNOSI-PRESTAZIONI.md`.

## 4. L'Officina come «super modalità creativa»

L'Officina di oggi (cartella `officina/`) regola manopole. La versione piena
è la stessa cosa con tre registri in più, e tutti e tre esistono già come
dati nel gioco:

- **blocchi**: il registro `rA` (35 tipi con colori, forma, materia, luce,
  motivo) diventa JSON modificabile dal pannello; un tipo nuovo si crea
  copiandone uno. Il mesher rilegge il registro, non ha costanti dentro.
- **ricette dell'acqua**: `wh` (41 ricette) idem; ogni regola (`alfa`, `moto`,
  `tagli`, `vera`…) è un campo. Il banco dell'acqua sparisce dentro l'Officina.
- **prefab**: i GLB in `modelli/` con la loro impronta, scala, luce, stagioni.
  Si piazzano con il comando `piazza`, come fa già il cantiere.

Con quello, «modificare il gioco in toto» vuol dire: aprire il pannello,
cambiare un valore, vederlo, misurarlo, salvare un preset e mandarlo in chat.
Quello che NON si fa nel pannello: scrivere shader e logica. Quelli restano
codice, ma leggono TUTTO dai registri, e un registro si edita dal pannello.

## 5. Verso l'MMO

- **Autorità**: il server tiene il mondo per chunk e valida i comandi; il
  client predice e corregge. Il bus dei comandi è già la forma giusta.
- **Chunk in rete**: il formato del mesher (chunk = `Uint8Array` 16×H×16 +
  metadati) è lo stesso che viaggia: niente conversioni.
- **Interesse**: si riceve solo l'anello di chunk attorno al giocatore, come
  già fa l'erba con `raggioChunk`.
- **AR**: la camera del rig diventa una sorgente tra le altre (WebXR o
  marker): il resto del motore non deve sapere da dove viene la matrice di
  vista. Oggi `rig.camera` è un `ArcRotateCamera` letto da sei moduli; deve
  diventare `nucleo.vista` con `posizione`, `verso`, `proietta()`.

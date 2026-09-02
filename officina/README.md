# Officina

Il pannello di lavoro di Leafy-Shadows: un'interfaccia unica, generata dai dati,
per girare le manopole del motore dal vivo — sul telefono come sul portatile — e
misurare l'effetto con numeri (p50, p99, disegni, ms delle passate).

**Provalo sulla build pubblicata:** `officina.html` carica il gioco normale e ci
appoggia sopra il pannello (⚙ in basso a destra). Niente del gioco viene
modificato: l'adattatore `leafy.js` parla con `globalThis.LEAFY`.

## Com'è fatto (un file, un mestiere)

| file | fa |
|---|---|
| `comandi.js` | il bus dei comandi: esegui / annulla / ripeti, diario serializzabile, stato netto |
| `schema.js` | i tipi di campo (`numero`, `interruttore`, `scelta`, `colore`, `testo`, `azione`, `lettura`) |
| `pannello.js` | il DOM: schede per registro, controlli generati dallo schema, valori riletti dalla scena ogni ½ s |
| `misura.js` | campionatore per frame e misure A/B con riscaldo scartato |
| `preset.js` | esporta / importa / salva nel browser lo stato netto dei registri |
| `index.js` | `apriOfficina({ registri, campione })` — la porta d'ingresso |
| `leafy.js` | **adattatore** alla build pubblicata: costruisce i registri sopra `LEAFY` (l'unico file che conosce i nomi interni) |

## La regola che conta

**L'Officina non tocca mai la scena: emette comandi.** `{ registro, campo, prima,
dopo, autore, t }`. Oggi il comando scrive in locale; domani lo stesso comando
lo valida un server e lo ritrasmette agli altri giocatori. Costruire nel sandbox
e regolare il motore sono lo stesso gesto.

## Come si innesta nel sorgente

Ogni modulo che ha manopole dichiara il suo registro (uno schema, due funzioni
`leggi`/`scrivi` per campo) e lo passa ad `apriOfficina`. `leafy.js` sparisce:
era il ponte verso una build senza sorgente.

# Da Arduin OS (Linux) a tiny11: guida passo passo

Obiettivo: salvare le sessioni di Claude Code su un disco esterno, formattare,
installare tiny11 pulito, rimettere Claude Code e ritrovare le sessioni.

PC di riferimento: ASUS TUF Gaming A15 FA507NVR (Ryzen 7 + RTX 4060).

Due cose da sapere prima di iniziare:

- Le sessioni che apri da **claude.ai/code** (come quella in cui è stata scritta
  questa guida) stanno nel cloud: non si perdono con la formattazione.
- Le sessioni del **terminale locale** (`claude` lanciato sul PC, comprese quelle
  usate con Remote Control dal telefono) stanno solo sul PC, in
  `~/.claude/projects/`. Sono quelle che dobbiamo salvare.

---

## FASE 1 · Sul PC Linux, prima di formattare

### 1.1 Cosa contiene il backup

| Cosa | Dove sta su Linux | A cosa serve |
|---|---|---|
| Sessioni (trascrizioni) | `~/.claude/projects/*/*.jsonl` | `claude --resume` |
| Memoria globale, impostazioni, plugin, skill, comandi | `~/.claude/` | tutto il resto di Claude Code |
| Credenziali di login | `~/.claude/.credentials.json` | evita di rifare il login (se non funziona, si rifà in 10 secondi) |
| Elenco progetti, server MCP, permessi | `~/.claude.json` | |
| Memoria e permessi per progetto | `<progetto>/.claude/` e `<progetto>/CLAUDE.md` | |
| Git e SSH | `~/.gitconfig`, `~/.ssh/` | per non rigenerare le chiavi |

### 1.2 Collega il disco esterno e trova il percorso

```bash
lsblk
ls /media/$USER /run/media/$USER
```

Di solito il disco compare come `/media/<tuonome>/<NOME-DISCO>`.

### 1.3 Scarica e lancia lo script di backup

```bash
cd ~
B=https://raw.githubusercontent.com/DakriGH/leafy-shadows/claude/migrate-sessions-tiny11-40iic4/migrazione
curl -fsSL $B/backup-claude-linux.sh   -o backup-claude-linux.sh
curl -fsSL $B/restore-claude-windows.ps1 -o restore-claude-windows.ps1
curl -fsSL $B/GUIDA-TINY11.md          -o GUIDA-TINY11.md
bash backup-claude-linux.sh "/media/$USER/NOME-DISCO"
```

Lo script copia soltanto, non cancella niente. Mette nel backup anche lo script
di ripristino e questa guida. Alla fine stampa:

- il numero di file di sessione sul PC e nel backup: **devono coincidere**;
- un elenco `ATTENZIONE-git.txt` con i repository che hanno modifiche non
  committate o commit non pushati. **Il sorgente di Leafy sta fuori da questo
  repo**: controlla che sia tutto su GitHub, oppure copia l'intera cartella
  sul disco esterno.

### 1.4 Altre cose da salvare a mano (lo script non le tocca)

- Cartelle di lavoro che non sono su GitHub (asset, PSD/Aseprite, modelli 3D,
  audio, salvataggi).
- Profilo del browser (password, segnalibri): esporta o assicurati che la
  sincronizzazione sia attiva.
- Chiavi/licenze di programmi a pagamento.
- Se vuoi conservare anche una copia "pura" di Arduin OS: `~/.config` e i tuoi
  dotfiles, sempre sul disco esterno.

### 1.5 Prepara la chiavetta USB con tiny11 (si fa da Linux)

Serve una chiavetta da almeno 8 GB. Verrà cancellata.

1. Scarica la ISO di tiny11 dalla pagina del progetto di NTDEV:
   <https://github.com/ntdevlabs/tiny11builder> (il README rimanda alla ISO
   già pronta su archive.org). Prendi **tiny11**, non "tiny11 core": core toglie
   anche Windows Update, Defender e lo Store, e per un PC da lavoro è troppo
   poco. Controlla l'hash SHA-256 pubblicato accanto al download:
   `sha256sum tiny11*.iso`.
2. Le ISO di Windows **non si scrivono con `dd`** (non partono e il file
   `install.wim` supera i 4 GB della FAT32). Usa Ventoy:

   ```bash
   # scarica ventoy-x.y.z-linux.tar.gz da https://github.com/ventoy/Ventoy/releases
   tar xzf ventoy-*-linux.tar.gz && cd ventoy-*
   lsblk                       # trova la chiavetta, es. /dev/sdb  (NON il disco esterno del backup!)
   sudo sh Ventoy2Disk.sh -i /dev/sdb
   ```

   Poi monta la prima partizione della chiavetta e copiaci dentro il file
   `.iso` così com'è. Ventoy all'avvio mostra un menu con le ISO presenti.
3. Sulla stessa chiavetta metti anche una cartella `driver` con, scaricati dal
   sito ASUS per FA507NVR: driver **Wi-Fi/Bluetooth (MediaTek)** e **LAN
   (Realtek)**. Windows di solito li riconosce da solo, ma se non vede la rete
   dopo l'installazione sei bloccato senza.

### 1.6 Smonta tutto in modo pulito

```bash
sync
umount "/media/$USER/NOME-DISCO"
```

Stacca il disco esterno del backup e **tienilo staccato durante
l'installazione di Windows**: così non c'è modo di formattarlo per sbaglio.

---

## FASE 2 · Installazione di tiny11

### 2.1 BIOS

Riavvia e tieni premuto **F2** (o **Esc**) per entrare nel BIOS ASUS.

- Boot mode: **UEFI**.
- **Secure Boot: disattivato** per l'installazione (Ventoy altrimenti chiede
  di registrare una chiave; disattivarlo è più semplice). Lo puoi riattivare
  dopo, tiny11 non lo richiede.
- Salva, riavvia, premi **Esc** al logo per il menu di avvio e scegli la
  chiavetta (voce "UEFI: ...").

### 2.2 Installazione

1. Nel menu Ventoy scegli la ISO di tiny11 → "Boot in normal mode".
2. Lingua/tastiera: Italiano. "Installa ora". Se chiede il codice prodotto:
   "Non ho un codice Product Key" (si attiva dopo con la licenza digitale
   legata al PC, se ne aveva una, o resta non attivato: funziona lo stesso).
3. Edizione: **Windows 11 Pro** (tiny11 lo include).
4. Tipo di installazione: **Personalizzata**.
5. Partizioni: sull'SSD interno **elimina tutte le partizioni** finché resta
   solo "Spazio non allocato" (via Arduin OS, EFI, swap, tutto). Seleziona lo
   spazio non allocato e "Avanti". Windows crea da solo le partizioni.
   Verifica che sia il disco interno (dimensione dell'SSD, ~512 GB o 1 TB) e
   che il disco esterno non sia collegato.
6. Aspetta il riavvio. Alla ripartenza, se riparte da USB, stacca la chiavetta.

### 2.3 Configurazione iniziale (OOBE)

tiny11 non obbliga all'account Microsoft: scegli **account locale**, nome
utente semplice **senza spazi e senza accenti** (es. `dakri`), perché finisce
nei percorsi dei progetti. Rispondi "No" a tutte le raccolte dati.

---

## FASE 3 · Windows appena installato

Apri **Terminale** come amministratore (tasto destro sul menu Start).

### 3.1 Rete, aggiornamenti, driver

1. Se il Wi-Fi manca: installa il driver dalla cartella `driver` della
   chiavetta.
2. Impostazioni → Windows Update → aggiorna tutto e riavvia (prende anche
   driver di chipset e audio).
3. Driver video: **NVIDIA** da <https://www.nvidia.com/drivers> (GeForce RTX
   4060 Laptop) e **AMD** per la grafica integrata da <https://www.amd.com/support>.
4. Facoltativo: **MyASUS** dallo Store per tastiera/ventole/batteria. Armoury
   Crate è pesante: se non ti servono i profili ventola, evitalo.

### 3.2 winget

Prova nel terminale:

```powershell
winget --version
```

Se non esiste: apri il **Microsoft Store**, cerca "Programma di installazione
app" (App Installer) e installalo. Poi riapri il terminale.

### 3.3 Strumenti di base

```powershell
winget install --id Git.Git -e
winget install --id Microsoft.PowerShell -e
winget install --id Microsoft.WindowsTerminal -e
winget install --id Microsoft.VisualStudioCode -e
winget install --id OpenJS.NodeJS.LTS -e
```

Git for Windows è **obbligatorio**: Claude Code su Windows usa la sua Git
Bash. Chiudi e riapri il terminale dopo.

### 3.4 Claude Code

```powershell
irm https://claude.ai/install.ps1 | iex
```

Riapri il terminale e verifica:

```powershell
claude --version
```

---

## FASE 4 · Ripristino delle sessioni

1. Ricollega il disco esterno (es. lettera `E:`).
2. Decidi dove tenere i progetti su Windows. Consiglio `C:\Progetti`
   (percorsi corti, senza spazi):

   ```powershell
   mkdir C:\Progetti
   cd C:\Progetti
   git clone https://github.com/DakriGH/leafy-shadows.git
   # ... e gli altri repository che usavi (l'elenco è in E:\claude-backup-...\progetti.txt)
   ```

3. Lancia lo script di ripristino (sta dentro la cartella del backup):

   ```powershell
   cd E:\claude-backup-20260901-2130
   Set-ExecutionPolicy -Scope Process Bypass
   .\restore-claude-windows.ps1 -Backup "E:\claude-backup-20260901-2130" -NewRoot "C:\Progetti"
   ```

   Lo script:
   - copia `.claude` e `.claude.json` nella tua home Windows (se esistono già,
     li rinomina in `.bak-<data>` prima);
   - rinomina le cartelle delle sessioni da `-home-tuonome-progetto` a
     `C--Progetti-progetto` e aggiorna il campo `cwd` nelle trascrizioni,
     perché Claude Code cerca le sessioni in base al percorso del progetto;
   - aggiorna i percorsi in `.claude.json`;
   - rimette `.claude/` e `CLAUDE.md` dentro i progetti che hai già clonato;
   - ti elenca i progetti ancora da clonare. Dopo averli clonati rilancia con
     `-SoloProgetti`.

4. Prova:

   ```powershell
   cd C:\Progetti\leafy-shadows
   claude
   ```

   Se chiede il login, fallo (browser). Poi `/exit` e:

   ```powershell
   claude --resume
   ```

   Compare la lista delle vecchie sessioni di quel progetto. Le sessioni di
   Arduin OS saranno sotto il progetto in cui le avevi lanciate (spesso la home
   stessa: `-home-tuonome` → `C--Progetti`, quindi lancia `claude --resume`
   dentro `C:\Progetti`).

5. Remote Control dal telefono funziona anche su Windows: nel progetto lancia
   `claude remote-control` come facevi su Linux.

---

## Se qualcosa va storto

- **`claude --resume` non mostra niente**: controlla il nome della cartella in
  `%USERPROFILE%\.claude\projects`. Deve essere il percorso del progetto con
  ogni carattere non alfanumerico sostituito da `-`
  (`C:\Progetti\leafy-shadows` → `C--Progetti-leafy-shadows`). Rinominala a
  mano se serve.
- **Claude Code si comporta in modo strano dopo il ripristino**: cancella
  `%USERPROFILE%\.claude.json` (Claude lo ricrea; perdi solo l'elenco dei
  server MCP e i permessi "ricorda sempre", che rimetti in 2 minuti). Le
  sessioni non sono lì dentro, restano al sicuro.
- **Login che gira a vuoto**: cancella `%USERPROFILE%\.claude\.credentials.json`
  e rilancia `claude`.
- **Windows non parte dopo l'installazione**: nel BIOS controlla che il primo
  dispositivo di avvio sia "Windows Boot Manager".

## Nota onesta su Linux vs Windows

Claude Code non vede lo schermo nemmeno su Windows: il terminale è lo stesso
programma sui due sistemi. Quello che cambia con Windows è la comodità
(driver, giochi, programmi grafici, meno cose da sistemare a mano) e l'app
desktop di Claude, che su Windows è più integrata. Per il lavoro sui progetti
la differenza la fa il repository ordinato, non il sistema operativo.

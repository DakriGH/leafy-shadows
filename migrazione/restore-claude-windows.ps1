<#
restore-claude-windows.ps1
Ripristina su Windows il backup fatto con backup-claude-linux.sh e adatta i
percorsi dei progetti da Linux (/home/nome/...) a Windows (C:\...).

Uso (PowerShell, nella cartella dove hai messo questo file):
  Set-ExecutionPolicy -Scope Process Bypass
  .\restore-claude-windows.ps1 -Backup "E:\claude-backup-20260901-2130" -NewRoot "C:\Progetti"

-Backup   cartella del backup sul disco esterno (quella con dentro home\ e progetti\)
-NewRoot  dove terrai i progetti su Windows (default: C:\Users\<te>\Progetti).
          /home/nome/leafy  diventa  <NewRoot>\leafy
-OldHome  la vecchia home Linux; se non lo indichi lo leggo da MANIFESTO.txt
-SoloProgetti  rilancia solo la copia di .claude/CLAUDE.md dentro i progetti
          (utile dopo aver clonato i repository)
#>
param(
  [Parameter(Mandatory = $true)][string]$Backup,
  [string]$NewRoot = (Join-Path $env:USERPROFILE "Progetti"),
  [string]$OldHome = "",
  [switch]$SoloProgetti
)
$ErrorActionPreference = "Stop"

function Enc([string]$s) { return [regex]::Replace($s, '[^A-Za-z0-9]', '-') }
function ToWin([string]$rest) { return ($rest -replace '/', '\') }
function JsonEsc([string]$s) { return ($s -replace '\\', '\\\\') }
function WriteUtf8([string]$path, [string]$text) {
  [IO.File]::WriteAllText($path, $text, (New-Object Text.UTF8Encoding($false)))
}

$Backup  = (Resolve-Path $Backup).Path
$NewRoot = $NewRoot.TrimEnd('\')
$srcHome = Join-Path $Backup "home"
if (-not (Test-Path (Join-Path $srcHome ".claude"))) {
  throw "In $Backup non trovo la cartella home\.claude: e' la cartella giusta?"
}

if (-not $OldHome) {
  $man = Join-Path $Backup "MANIFESTO.txt"
  if (Test-Path $man) {
    $line = Get-Content $man | Where-Object { $_ -like "HOME=*" } | Select-Object -First 1
    if ($line) { $OldHome = $line.Substring(5).Trim() }
  }
}
if (-not $OldHome) { throw "Non so quale fosse la home Linux: passa -OldHome /home/tuonome" }
$OldHome = $OldHome.TrimEnd('/')
$oldEnc  = Enc $OldHome
$newEnc  = Enc $NewRoot

Write-Host "Backup:      $Backup"
Write-Host "Home Linux:  $OldHome   (cartelle sessione: $oldEnc-...)"
Write-Host "Root Win:    $NewRoot   (cartelle sessione: $newEnc-...)"
Write-Host ""

$stamp = Get-Date -Format "yyyyMMdd-HHmm"
$dstClaude = Join-Path $env:USERPROFILE ".claude"
$dstJson   = Join-Path $env:USERPROFILE ".claude.json"

if (-not $SoloProgetti) {
  Write-Host "== 1. Cartella globale ~\.claude"
  if (Test-Path $dstClaude) {
    Rename-Item $dstClaude "$dstClaude.bak-$stamp"
    Write-Host "  esistente rinominata in .claude.bak-$stamp"
  }
  Copy-Item (Join-Path $srcHome ".claude") $dstClaude -Recurse
  Write-Host "  ok  $dstClaude"

  if (Test-Path (Join-Path $srcHome ".claude.json")) {
    if (Test-Path $dstJson) { Rename-Item $dstJson "$dstJson.bak-$stamp" }
    Copy-Item (Join-Path $srcHome ".claude.json") $dstJson
    Write-Host "  ok  $dstJson"
  }

  Write-Host "== 2. Rinomino le cartelle delle sessioni"
  $projDir = Join-Path $dstClaude "projects"
  $rxCwd = '"cwd":"' + [regex]::Escape($OldHome) + '(/[^"]*)?"'
  if (Test-Path $projDir) {
    foreach ($d in @(Get-ChildItem $projDir -Directory)) {
      $n = $d.Name
      if (-not ($n -eq $oldEnc -or $n.StartsWith("$oldEnc-"))) { continue }
      $rest = $n.Substring($oldEnc.Length)
      $newName = "$newEnc$rest"
      $target = Join-Path $projDir $newName
      if (Test-Path $target) {
        # unisco: copio dentro quello che manca
        Copy-Item (Join-Path $d.FullName "*") $target -Recurse -Force
        Remove-Item $d.FullName -Recurse -Force
      } else {
        Rename-Item $d.FullName $newName
      }
      Write-Host "  $n  ->  $newName"
      # aggiorno il campo cwd dentro le trascrizioni
      foreach ($f in @(Get-ChildItem $target -Filter *.jsonl -Recurse)) {
        $txt = [IO.File]::ReadAllText($f.FullName)
        $new = [regex]::Replace($txt, $rxCwd, {
          param($m)
          $r = $m.Groups[1].Value
          return '"cwd":"' + (JsonEsc ($NewRoot + (ToWin $r))) + '"'
        })
        if ($new -ne $txt) { WriteUtf8 $f.FullName $new }
      }
    }
  }

  Write-Host "== 3. Percorsi dentro ~\.claude.json"
  if (Test-Path $dstJson) {
    $rxAny = '"' + [regex]::Escape($OldHome) + '(/[^"\\]*)?"'
    $txt = [IO.File]::ReadAllText($dstJson)
    $new = [regex]::Replace($txt, $rxAny, {
      param($m)
      $r = $m.Groups[1].Value
      return '"' + (JsonEsc ($NewRoot + (ToWin $r))) + '"'
    })
    if ($new -ne $txt) { WriteUtf8 $dstJson $new; Write-Host "  aggiornato" } else { Write-Host "  niente da cambiare" }
  }

  Write-Host "== 4. Git / SSH"
  foreach ($f in @(".gitconfig")) {
    $s = Join-Path $srcHome $f
    if (Test-Path $s) { Copy-Item $s (Join-Path $env:USERPROFILE $f) -Force; Write-Host "  ok  $f" }
  }
  $sshSrc = Join-Path $srcHome ".ssh"
  if (Test-Path $sshSrc) {
    $sshDst = Join-Path $env:USERPROFILE ".ssh"
    if (-not (Test-Path $sshDst)) { New-Item $sshDst -ItemType Directory | Out-Null }
    Copy-Item (Join-Path $sshSrc "*") $sshDst -Recurse -Force
    Write-Host "  ok  .ssh"
  }
}

Write-Host "== 5. File .claude e CLAUDE.md dentro i progetti"
$progDir = Join-Path $Backup "progetti"
$daClonare = @()
if (Test-Path $progDir) {
  foreach ($d in @(Get-ChildItem $progDir -Directory)) {
    $origFile = Join-Path $d.FullName "PERCORSO-ORIGINALE.txt"
    if (-not (Test-Path $origFile)) { continue }
    $orig = (Get-Content $origFile -Raw).Trim()
    if (-not $orig.StartsWith($OldHome)) { Write-Host "  --  $orig (fuori dalla home, salto)"; continue }
    $target = $NewRoot + (ToWin $orig.Substring($OldHome.Length))
    if (-not (Test-Path $target)) {
      $daClonare += "$orig  ->  $target"
      continue
    }
    foreach ($item in @(".claude", "CLAUDE.md")) {
      $s = Join-Path $d.FullName $item
      if (Test-Path $s) { Copy-Item $s (Join-Path $target $item) -Recurse -Force }
    }
    Write-Host "  ok  $target"
  }
}
if ($daClonare.Count -gt 0) {
  Write-Host ""
  Write-Host "Questi progetti non esistono ancora su Windows. Clonali (git clone) nel percorso"
  Write-Host "indicato e poi rilancia:  .\restore-claude-windows.ps1 -Backup `"$Backup`" -NewRoot `"$NewRoot`" -SoloProgetti"
  $daClonare | ForEach-Object { Write-Host "  $_" }
}

Write-Host ""
Write-Host "Fatto. Prossimi passi:"
Write-Host "  1. apri un terminale nuovo e lancia:  claude    (se chiede il login, accedi)"
Write-Host "  2. entra in un progetto, es.  cd `"$NewRoot\leafy-shadows`"  e lancia:  claude --resume"
Write-Host "     vedrai la lista delle vecchie sessioni di quel progetto."

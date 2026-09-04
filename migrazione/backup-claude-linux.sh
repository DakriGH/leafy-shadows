#!/usr/bin/env bash
# backup-claude-linux.sh
# Copia sul disco esterno tutto quello che serve per ritrovare Claude Code
# (sessioni, memoria, impostazioni, plugin, credenziali) più git/ssh.
# NON cancella e NON modifica niente sul PC: copia soltanto.
#
# Uso:   bash backup-claude-linux.sh /percorso/del/disco/esterno
# Esempio: bash backup-claude-linux.sh "/media/$USER/BACKUP"
set -euo pipefail

DEST="${1:-}"
if [[ -z "$DEST" || ! -d "$DEST" ]]; then
  echo "Uso: $0 /percorso/del/disco/esterno"
  echo "Trova il disco con:  lsblk   oppure   ls /media/${USER:-$(id -un)} /run/media/${USER:-$(id -un)}"
  exit 1
fi
if ! touch "$DEST/.scrittura-ok" 2>/dev/null; then
  echo "Non riesco a scrivere in $DEST (disco in sola lettura o permessi). Fermo qui."
  exit 1
fi
rm -f "$DEST/.scrittura-ok"

OUT="$DEST/claude-backup-$(date +%Y%m%d-%H%M)"
mkdir -p "$OUT"
echo "Backup in: $OUT"
echo

copia() { # copia <origine> <destinazione>
  if [[ -e "$1" ]]; then
    mkdir -p "$(dirname "$2")"
    cp -a "$1" "$2"
    echo "  ok  $1"
  else
    echo "  --  $1 (non esiste, salto)"
  fi
}

echo "== Claude Code (cartella globale)"
copia "$HOME/.claude"      "$OUT/home/.claude"
copia "$HOME/.claude.json" "$OUT/home/.claude.json"

echo "== Git / SSH / GitHub CLI"
copia "$HOME/.gitconfig"   "$OUT/home/.gitconfig"
copia "$HOME/.ssh"         "$OUT/home/.ssh"
copia "$HOME/.config/gh"   "$OUT/home/.config/gh"

echo "== Progetti conosciuti da Claude Code"
PROJ_LIST="$OUT/progetti.txt"
: > "$PROJ_LIST"
if [[ -f "$HOME/.claude.json" ]]; then
  python3 - "$HOME/.claude.json" <<'PY' >> "$PROJ_LIST" || true
import json, sys
try:
    d = json.load(open(sys.argv[1]))
except Exception:
    sys.exit(0)
for p in sorted((d.get("projects") or {}).keys()):
    print(p)
PY
fi
# aggiungo anche le cartelle dedotte da ~/.claude/projects (per sicurezza)
if [[ -d "$HOME/.claude/projects" ]]; then
  for d in "$HOME/.claude/projects"/*/; do
    n="$(basename "$d")"
    # la cartella si chiama come il percorso con i caratteri speciali -> "-"
    # non è invertibile in modo sicuro, quindi la annoto solo come promemoria
    echo "# sessioni trovate per: $n ($(find "$d" -maxdepth 1 -name '*.jsonl' | wc -l) file)" >> "$OUT/sessioni-trovate.txt"
  done
fi

ATT="$OUT/ATTENZIONE-git.txt"
while IFS= read -r p; do
  [[ -n "$p" && "${p:0:1}" != "#" ]] || continue
  if [[ ! -d "$p" ]]; then
    echo "  --  $p (cartella non più presente)"
    continue
  fi
  enc="$(printf '%s' "$p" | sed 's/[^A-Za-z0-9]/-/g')"
  mkdir -p "$OUT/progetti/$enc"
  printf '%s\n' "$p" > "$OUT/progetti/$enc/PERCORSO-ORIGINALE.txt"
  [[ -d "$p/.claude"   ]] && cp -a "$p/.claude"   "$OUT/progetti/$enc/.claude"
  [[ -f "$p/CLAUDE.md" ]] && cp -a "$p/CLAUDE.md" "$OUT/progetti/$enc/CLAUDE.md"
  echo "  ok  $p"
  if git -C "$p" rev-parse --is-inside-work-tree >/dev/null 2>&1; then
    dirty="$(git -C "$p" status --porcelain 2>/dev/null | wc -l)"
    unpushed="$(git -C "$p" log --branches --not --remotes --oneline 2>/dev/null | wc -l)"
    if (( dirty > 0 || unpushed > 0 )); then
      echo "  !!  $p -> $dirty file non committati, $unpushed commit non pushati"
      echo "$p   file_non_committati=$dirty   commit_non_pushati=$unpushed" >> "$ATT"
    fi
  fi
done < "$PROJ_LIST"

echo
echo "== Verifica"
src_n=0; dst_n=0
[[ -d "$HOME/.claude/projects" ]] && src_n="$(find "$HOME/.claude/projects" -name '*.jsonl' | wc -l)"
[[ -d "$OUT/home/.claude/projects" ]] && dst_n="$(find "$OUT/home/.claude/projects" -name '*.jsonl' | wc -l)"
echo "  file di sessione (.jsonl): sul PC $src_n, nel backup $dst_n"
if [[ "$src_n" != "$dst_n" ]]; then
  echo "  !!  I numeri NON coincidono: non formattare, rilancia lo script."
fi

{
  echo "DATA=$(date -Iseconds)"
  echo "HOME=$HOME"
  echo "USER=${USER:-$(id -un)}"
  echo "HOSTNAME=$(hostname)"
  echo "SESSIONI_JSONL=$dst_n"
  echo "DIMENSIONE=$(du -sh "$OUT" | cut -f1)"
} > "$OUT/MANIFESTO.txt"

# metto nel backup anche script di ripristino e guida, se stanno accanto a questo file
for f in restore-claude-windows.ps1 GUIDA-TINY11.md; do
  [[ -f "$(dirname "$0")/$f" ]] && cp -a "$(dirname "$0")/$f" "$OUT/$f"
done

sync
echo
echo "Fatto. Dimensione backup: $(du -sh "$OUT" | cut -f1)"
if [[ -f "$ATT" ]]; then
  echo
  echo "ATTENZIONE: questi repository hanno lavoro NON salvato su GitHub."
  echo "Fai commit + push (o copia la cartella intera sul disco) PRIMA di formattare:"
  cat "$ATT"
fi
echo
echo "Ora smonta il disco in modo pulito prima di staccarlo:  umount \"$DEST\""

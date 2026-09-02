// Officina — LA SHELL DELL'EDITOR.
//
// Il gioco resta dov'è: nella sua tela. Attorno gli si costruisce una cornice
// SCURA — barra in alto, pannello di lato (o sotto, sul telefono) — così che
// si capisca a colpo d'occhio: qui non si gioca, qui si regola. La tela viene
// solo RITAGLIATA nel riquadro libero (posizione fissa via variabili CSS):
// non si sposta nel DOM, il motore non se ne accorge, gli si dice solo di
// rimisurarsi.
//
// ⚠ LA HUD DEL GIOCO SI SPEGNE, MA NON TUTTA: hotbar e comandi touch sono il
// gameplay minimo (scegliere un blocco, muoversi) e restano, riposizionati
// dentro il riquadro. Stato, fps, pillole, quadrante del cielo, diagnosi
// erano il pannello di diagnosi «da telefono»: qui li sostituisce l'Officina.

const CSS = `
:root { --ed-alto: 40px; --ed-dx: 360px; --ed-giu: 0px; --ed-sx: 0px; }
:root.ed-sotto { --ed-dx: 0px; --ed-giu: 52vh; }
:root.ed-gioca { --ed-dx: 0px; --ed-giu: 0px; }
body.editor { background: #0c110e; }
body.editor #tela { position: fixed !important; left: var(--ed-sx) !important; top: var(--ed-alto) !important;
  width: calc(100vw - var(--ed-sx) - var(--ed-dx)) !important; height: calc(100vh - var(--ed-alto) - var(--ed-giu)) !important; }
/* la HUD del gioco: spenta, tranne il gameplay minimo */
body.editor.ed-senza-hud #stato, body.editor.ed-senza-hud #fps, body.editor.ed-senza-hud #versione, body.editor.ed-senza-hud #modoGui,
body.editor.ed-senza-hud #graficaSel, body.editor.ed-senza-hud #acquaSel, body.editor.ed-senza-hud #diag, body.editor.ed-senza-hud #cielo { display: none !important; }
body.editor #comandi { left: var(--ed-sx) !important; top: var(--ed-alto) !important; right: var(--ed-dx) !important; bottom: var(--ed-giu) !important; width: auto !important; height: auto !important; }
body.editor #barra { left: calc(var(--ed-sx) + (100vw - var(--ed-sx) - var(--ed-dx)) / 2) !important; right: auto !important; transform: translateX(-50%) !important;
  bottom: calc(var(--ed-giu) + 8px) !important; max-width: calc(100vw - var(--ed-sx) - var(--ed-dx) - 16px); }
body.editor #stato, body.editor #fps, body.editor #cielo { top: calc(var(--ed-alto) + 8px) !important; }
body.editor #fps, body.editor #cielo { right: calc(var(--ed-dx) + 8px) !important; }
body.editor #versione { right: calc(var(--ed-dx) + 8px) !important; bottom: calc(var(--ed-giu) + 26px) !important; }
body.editor #modoGui, body.editor #diag, body.editor #graficaSel, body.editor #acquaSel { left: calc(var(--ed-sx) + 8px) !important; }

#editor { --fondo: #0c110e; --carta: #151c18; --testo: #dfe8e2; --muto: #8d9a92; --riga: rgba(223,232,226,.1); --accento: #79b8ff; --ocra: #d9a35c;
  font: 12px/1.4 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--testo); }
#editor * { box-sizing: border-box; }
#editor .ed-alto { position: fixed; z-index: 45; left: 0; right: 0; top: 0; height: var(--ed-alto); display: flex; align-items: center; gap: 10px; padding: 0 10px 0 12px;
  background: var(--fondo); border-bottom: 1px solid var(--riga); }
#editor .ed-marchio { font-weight: 700; letter-spacing: .08em; text-transform: uppercase; font-size: 11px; white-space: nowrap; }
#editor .ed-modo { font-size: 10px; letter-spacing: .1em; text-transform: uppercase; color: var(--accento); border: 1px solid currentColor; border-radius: 4px; padding: 2px 6px; white-space: nowrap; }
#editor .ed-vivi { flex: 1; min-width: 0; text-align: center; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; color: var(--muto); }
#editor .ed-vivi b { color: var(--testo); font-size: 14px; }
#editor .ed-alto button { font: inherit; font-size: 11px; color: var(--testo); background: rgba(223,232,226,.07); border: 1px solid var(--riga); border-radius: 6px; padding: 4px 9px; cursor: pointer; white-space: nowrap; }
#editor .ed-alto button.acceso { background: var(--accento); border-color: var(--accento); color: #0b1a2b; }
#editor .ed-alto button:focus-visible { outline: 2px solid var(--accento); outline-offset: 1px; }
#editor .ed-lato { position: fixed; z-index: 45; top: var(--ed-alto); right: 0; bottom: 0; width: var(--ed-dx); background: var(--carta); border-left: 1px solid var(--riga); overflow: hidden; }
:root.ed-sotto #editor .ed-lato { left: 0; right: 0; top: auto; bottom: 0; width: auto; height: var(--ed-giu); border-left: 0; border-top: 1px solid var(--riga); }
:root.ed-gioca #editor .ed-lato { display: none; }
#editor .ed-lato > #officina { height: 100%; }
@media (max-width: 560px) { #editor .ed-marchio { display: none; } #editor .ed-vivi { text-align: left; } }
`;

export function apriEditor({ titolo = 'Officina', vivi, onRidimensiona, hudIniziale = false } = {}) {
  if (!document.getElementById('editor-stile')) { const s = document.createElement('style'); s.id = 'editor-stile'; s.textContent = CSS; document.head.appendChild(s); }
  const html = document.documentElement, body = document.body;
  body.classList.add('editor');
  body.classList.toggle('ed-senza-hud', !hudIniziale);

  const radice = document.createElement('div'); radice.id = 'editor';
  radice.innerHTML = `
    <div class="ed-alto" role="toolbar" aria-label="${titolo}">
      <span class="ed-marchio">Leafy-Shadows</span>
      <span class="ed-modo">${titolo} · editor</span>
      <div class="ed-vivi">…</div>
      <button type="button" data-fa="hud" title="mostra o nasconde la HUD del gioco">HUD gioco</button>
      <button type="button" data-fa="gioca" title="nasconde il pannello e allarga il gioco">▶ gioca</button>
    </div>
    <div class="ed-lato"></div>`;
  body.appendChild(radice);
  const el = { vivi: radice.querySelector('.ed-vivi'), hud: radice.querySelector('[data-fa=hud]'), gioca: radice.querySelector('[data-fa=gioca]'), lato: radice.querySelector('.ed-lato') };

  // disposizione: colonna a destra con il mouse, foglio sotto con il dito o su schermi stretti
  const stretto = matchMedia('(max-width: 820px)'), dito = matchMedia('(pointer: coarse)');
  const disponi = () => { html.classList.toggle('ed-sotto', stretto.matches || dito.matches); rimisura(); };
  let giroMisura = 0;
  const rimisura = () => { cancelAnimationFrame(giroMisura); giroMisura = requestAnimationFrame(() => onRidimensiona && onRidimensiona()); };
  stretto.addEventListener('change', disponi); dito.addEventListener('change', disponi);
  addEventListener('resize', rimisura);

  el.hud.classList.toggle('acceso', hudIniziale);
  el.hud.addEventListener('click', () => { const on = body.classList.toggle('ed-senza-hud'); el.hud.classList.toggle('acceso', !on); });
  const gioca = (si) => { html.classList.toggle('ed-gioca', si); el.gioca.classList.toggle('acceso', si); el.gioca.textContent = si ? '⏸ officina' : '▶ gioca'; rimisura(); };
  el.gioca.addEventListener('click', () => gioca(!html.classList.contains('ed-gioca')));
  radice.addEventListener('keydown', (e) => e.stopPropagation());
  radice.addEventListener('keyup', (e) => e.stopPropagation());

  disponi();
  const orologio = setInterval(() => { if (vivi) el.vivi.innerHTML = vivi() || ''; }, 500);
  return { radice, contenitore: el.lato, gioca, rimisura, chiudi: () => { clearInterval(orologio); radice.remove(); body.classList.remove('editor', 'ed-senza-hud'); html.classList.remove('ed-sotto', 'ed-gioca'); } };
}

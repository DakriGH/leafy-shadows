// Officina — LA GERARCHIA E L'ISPETTORE.
//
// ⚠ È LA PARTE CHE MANCAVA, e il committente l'ha detto con precisione: «non è
// per niente l'editor stile Unity, è solo una lista buggata e brutta e
// complicata con slider, manca proprio il concetto di oggetto metadati
// inspector scene». Il difetto non era il pannello: era che **nel motore non
// esisteva l'oggetto**. Adesso esiste (`partita/entita.js`), e questo è il suo
// specchio.
//
// ⚠ DUE RIQUADRI, NON UNO — e nemmeno due schede. «Voglio comunque una GUI
// dell'officina come Unity, quindi sinistra e destra, inspector, tutto completo
// con assets». La gerarchia e l'ispettore servono INSIEME: si sfoglia l'albero
// e si guarda cosa si è preso. Due schede sono due cose che non si possono
// vedere nello stesso momento, ed è precisamente ciò che una scheda non sa
// fare — il motivo per cui un cassetto non è un editor.
//
// ⚠ LE MODIFICHE PASSANO DAL BUS DEI COMANDI, non toccano le entità a mano. È
// il motivo per cui l'ispettore ha annulla/ripeti senza scrivere una riga: il
// bus c'era già, gli mancavano solo i campi dinamici (vedi `index.js`,
// `scriviDinamico`), perché la chiave di una proprietà di un'entità nasce
// quando qualcuno posa un albero e non si può dichiarare prima.
//
// ⚠ NIENTE GL, NIENTE MOTORE: DOM e un oggetto `entita`. Le funzioni pure
// (l'ordine, il taglio, i metadati) stanno in fondo e si provano in Node.

const CSS = `
#officina .sc-barra { display: flex; gap: 4px; align-items: center; margin-bottom: 6px; }
#officina .sc-barra input { flex: 1; min-width: 0; max-width: none; }
#officina .sc-albero { max-height: 34vh; overflow: auto; border: 1px solid var(--riga); border-radius: 7px; background: var(--campo); }
/* nel riquadro suo, la gerarchia prende tutta l'altezza che ha */
#officina .sc-albero.sc-alto { max-height: none; flex: 1; min-height: 120px; }
#officina .sc-gruppo > .sc-cap { display: flex; align-items: center; gap: 6px; width: 100%; text-align: left;
  font: inherit; color: var(--inch); background: var(--tenue); border: 0; border-bottom: 1px solid var(--riga); padding: 5px 8px; cursor: pointer; }
#officina .sc-cap .sc-quanti { margin-left: auto; opacity: .6; font-variant-numeric: tabular-nums; }
#officina .sc-voce { display: flex; align-items: center; gap: 6px; width: 100%; text-align: left; font: inherit; font-size: 11px;
  color: var(--inch); background: none; border: 0; border-bottom: 1px solid var(--riga); padding: 4px 8px 4px 20px; cursor: pointer; }
#officina .sc-voce:hover { background: var(--tenue); }
#officina .sc-voce.scelta { background: var(--acceso); color: var(--accesoTesto); }
#officina .sc-voce .sc-lont { margin-left: auto; opacity: .6; font-variant-numeric: tabular-nums; }
#officina .sc-pallino { width: 10px; height: 10px; border-radius: 2px; flex: 0 0 auto; border: 1px solid rgba(0,0,0,.18); }
#officina .sc-altri { padding: 4px 8px 5px 20px; font-size: 10.5px; opacity: .6; }
#officina .sc-vuoto { padding: 10px; font-size: 11px; opacity: .7; }
#officina .sc-isp { margin-top: 8px; border-top: 1px solid var(--riga); padding-top: 8px; }
#officina .sc-isp.sc-solo { margin-top: 0; border-top: 0; padding-top: 0; }
#officina .sc-titolo { display: flex; align-items: center; gap: 6px; font-weight: 700; margin-bottom: 2px; }
#officina .sc-tipo { font-size: 10.5px; opacity: .62; margin-bottom: 6px; }
#officina .sc-tre { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }
#officina .sc-tre label { display: grid; gap: 2px; font-size: 10.5px; opacity: .75; }
#officina .sc-tre input { font: inherit; width: 100%; max-width: none; color: var(--inch); background: var(--campo);
  border: 1px solid var(--riga); border-radius: 5px; padding: 3px 5px; font-variant-numeric: tabular-nums; }
#officina .sc-azioni { display: flex; gap: 4px; margin-top: 8px; flex-wrap: wrap; }
#officina .sc-azioni button { font: inherit; font-size: 11px; color: var(--inch); background: var(--tenue);
  border: 1px solid var(--riga); border-radius: 6px; padding: 4px 9px; cursor: pointer; }
#officina .sc-azioni button.rosso { color: #e0857c; }
#officina .sc-meta { margin-top: 8px; font-size: 11px; }
#officina .sc-meta textarea { width: 100%; min-height: 46px; font: inherit; font-size: 11px; color: var(--inch);
  background: var(--campo); border: 1px solid var(--riga); border-radius: 6px; padding: 4px 6px; resize: vertical; }
#officina .sc-riga { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-top: 5px; }
#officina .sc-riga input[type=range] { flex: 1; }
#officina .sc-riga .sc-num { font-variant-numeric: tabular-nums; opacity: .8; min-width: 52px; text-align: right; }
`;

/** Quante voci si mostrano per gruppo prima di dire «e altri N». */
export const TETTO_VOCI = 60;

/**
 * Le voci di un gruppo, le più VICINE per prime.
 * ⚠ NON TUTTE, e non è pigrizia: nel mondo vero ci sono trecentosettanta
 * alberi, e un albero di scena con trecentosettanta righe uguali non è un
 * elenco, è un muro. Quelle che servono a chi sta lavorando sono quelle
 * intorno a lui, e l'ordine per distanza le mette in cima da solo.
 * Funzione pura: si prova in Node.
 */
export function vociVicine(elenco, da, tetto = TETTO_VOCI) {
  const con = elenco.map((e) => {
    const dx = e.x - da.x, dy = (e.y - da.y) * 0.5, dz = e.z - da.z;
    return { ...e, lontano: Math.sqrt(dx * dx + dy * dy + dz * dz) };
  });
  con.sort((a, b) => a.lontano - b.lontano);
  return { voci: con.slice(0, tetto), altri: Math.max(0, con.length - tetto) };
}

/** `#rrggbb` da 0xRRGGBB. */
export function esa(n) { return '#' + (n >>> 0 & 0xffffff).toString(16).padStart(6, '0'); }

/**
 * LA SCENA, IN DUE RIQUADRI che condividono la selezione.
 *
 * @param entita     lo store delle entità
 * @param dove       () => ({x, y, z}) — chi guarda, per ordinare per distanza
 * @param coloreDi   (tipo) → '#rrggbb' per il pallino
 * @param nomeDi     (tipo) → nome leggibile
 * @param rigaDi     (tipo) → la riga di catalogo, mostrata in sola lettura
 * @param onVaiA     (entità) → void: porta la camera lì (facoltativo)
 */
export function creaScena({ entita, dove, coloreDi, nomeDi, rigaDi, onVaiA = null }) {
  const stato = { scelto: null, aperti: new Set(), filtro: '' };
  const viste = {};   // chiave del riquadro → la sua funzione che ridisegna

  // ⚠ I RIQUADRI SI AVVISANO A VICENDA. Scegliere nell'albero deve rifare
  // l'ispettore; cancellare dall'ispettore deve rifare l'albero. Senza, si
  // resta a guardare i dati di una cosa che non c'è più — che è il difetto
  // classico di due pannelli che tengono lo stesso stato ognuno per sé.
  const avvisa = () => { for (const f of Object.values(viste)) if (f) f(); };

  function stile() {
    if (!document.getElementById('officina-scena-stile')) {
      const s = document.createElement('style'); s.id = 'officina-scena-stile'; s.textContent = CSS; document.head.appendChild(s);
    }
  }

  // ── LA GERARCHIA ───────────────────────────────────────────────────────────
  const gerarchia = {
    chiave: 'gerarchia',
    nome: '🗂 Gerarchia',
    disegna(box) {
      stile();
      box.style.display = 'flex'; box.style.flexDirection = 'column';
      const barra = document.createElement('div'); barra.className = 'sc-barra';
      const cerca = document.createElement('input'); cerca.type = 'text'; cerca.placeholder = 'cerca un tipo…'; cerca.value = stato.filtro;
      const conta = document.createElement('span'); conta.className = 'valore';
      barra.append(cerca, conta);
      const albero = document.createElement('div'); albero.className = 'sc-albero sc-alto';
      box.append(barra, albero);
      cerca.addEventListener('input', () => { stato.filtro = cerca.value.trim().toLowerCase(); disegna(); });

      function disegna() {
        albero.innerHTML = '';
        const tipi = entita.perTipo().filter(([t]) => !stato.filtro || t.toLowerCase().includes(stato.filtro) || (nomeDi(t) || '').toLowerCase().includes(stato.filtro));
        conta.textContent = `${entita.conta} oggetti`;
        if (!tipi.length) { const v = document.createElement('div'); v.className = 'sc-vuoto'; v.textContent = 'niente da mostrare'; albero.appendChild(v); return; }
        const da = dove();
        for (const [tipo, quanti] of tipi) {
          const g = document.createElement('div'); g.className = 'sc-gruppo';
          const cap = document.createElement('button'); cap.type = 'button'; cap.className = 'sc-cap';
          const aperto = stato.aperti.has(tipo);
          const pal = document.createElement('i'); pal.className = 'sc-pallino'; pal.style.background = coloreDi(tipo);
          const nm = document.createElement('span'); nm.textContent = (aperto ? '▾ ' : '▸ ') + (nomeDi(tipo) || tipo);
          const qn = document.createElement('span'); qn.className = 'sc-quanti'; qn.textContent = quanti;
          cap.append(pal, nm, qn);
          cap.addEventListener('click', () => { if (aperto) stato.aperti.delete(tipo); else stato.aperti.add(tipo); disegna(); });
          g.appendChild(cap);

          if (aperto) {
            const elenco = [];
            entita.ognunaDi(tipo, (x, y, z, id) => elenco.push({ id, x, y, z }));
            const { voci, altri } = vociVicine(elenco, da);
            for (const v of voci) {
              const b = document.createElement('button'); b.type = 'button'; b.className = 'sc-voce' + (v.id === stato.scelto ? ' scelta' : '');
              const e = entita.leggi(v.id);
              const et = document.createElement('span'); et.textContent = (e && e.nome) || `#${v.id}`;
              const lo = document.createElement('span'); lo.className = 'sc-lont'; lo.textContent = v.lontano.toFixed(0) + ' m';
              b.append(et, lo);
              b.addEventListener('click', () => { stato.scelto = v.id; avvisa(); });
              g.appendChild(b);
            }
            if (altri) { const a = document.createElement('div'); a.className = 'sc-altri'; a.textContent = `e altri ${altri}, più lontani`; g.appendChild(a); }
          }
          albero.appendChild(g);
        }
      }
      viste.gerarchia = disegna;
      disegna();
      // ⚠ L'AGGIORNAMENTO PERIODICO NON RIDISEGNA L'ALBERO: gira ogni mezzo
      // secondo, e rifare seicento nodi due volte al secondo cancellerebbe
      // quello che qualcuno sta scrivendo nella casella di ricerca.
      return { aggiorna() { conta.textContent = `${entita.conta} oggetti`; } };
    },
  };

  // ── L'ISPETTORE ────────────────────────────────────────────────────────────
  const ispettore = {
    chiave: 'ispettore',
    nome: '🔍 Ispettore',

    scriviDinamico(chiave, valore) {
      const p = chiave.indexOf('.');
      const id = Number(chiave.slice(0, p)), prop = chiave.slice(p + 1);
      if (prop === 'nome') { entita.battezza(id, valore || null); avvisa(); return; }
      if (prop === 'meta') { entita.metadati(id, valore); return; }
      if (prop === 'tinta') { entita.posa(id, { tinta: valore }); return; }
      entita.posa(id, { [prop]: valore });
    },

    disegna(box, pannello) {
      stile();
      const isp = document.createElement('div'); isp.className = 'sc-isp sc-solo';
      box.appendChild(isp);
      const scrivi = (id, prop, prima, dopo) =>
        pannello.bus.esegui({ registro: 'ispettore', campo: `${id}.${prop}`, prima, dopo });

      function riga(padre, etichetta, min, max, passo, leggi, prop, formato = (v) => v.toFixed(2)) {
        const r = document.createElement('div'); r.className = 'sc-riga';
        const n = document.createElement('span'); n.textContent = etichetta;
        const s = document.createElement('input'); s.type = 'range'; s.min = min; s.max = max; s.step = passo; s.value = leggi();
        const v = document.createElement('span'); v.className = 'sc-num'; v.textContent = formato(leggi());
        let prima;
        s.addEventListener('input', () => {
          if (prima === undefined) prima = leggi();
          const val = Number(s.value); v.textContent = formato(val);
          entita.posa(stato.scelto, { [prop]: val });      // a vista, senza entrare nella storia
        });
        s.addEventListener('change', () => {
          const p = prima === undefined ? leggi() : prima; prima = undefined;
          scrivi(stato.scelto, prop, p, Number(s.value));
        });
        r.append(n, s, v); padre.appendChild(r);
      }

      function disegna() {
        isp.innerHTML = '';
        const e = stato.scelto == null ? null : entita.leggi(stato.scelto);
        if (!e) {
          const v = document.createElement('div'); v.className = 'sc-vuoto';
          v.textContent = 'Nessun oggetto scelto. Cliccane uno nel gioco, o aprine un gruppo nella Gerarchia.';
          isp.appendChild(v); return;
        }

        const tit = document.createElement('div'); tit.className = 'sc-titolo';
        const pal = document.createElement('i'); pal.className = 'sc-pallino'; pal.style.background = coloreDi(e.tipo);
        const nome = document.createElement('input'); nome.type = 'text'; nome.value = e.nome || ''; nome.placeholder = `#${e.id}`;
        nome.style.flex = '1'; nome.style.maxWidth = 'none';
        nome.addEventListener('change', () => scrivi(e.id, 'nome', e.nome || '', nome.value));
        tit.append(pal, nome); isp.appendChild(tit);

        const r = rigaDi(e.tipo);
        const tipo = document.createElement('div'); tipo.className = 'sc-tipo';
        tipo.textContent = r
          ? `${nomeDi(e.tipo) || e.tipo} · id ${e.id} · giro ${r.giro} · classe ${r.classe} · ingombro ${r.ingombro.join('×')}${r.proiettaOmbra ? ' · fa ombra' : ''}`
          : `${e.tipo} · id ${e.id} · fuori catalogo`;
        isp.appendChild(tipo);

        const tre = document.createElement('div'); tre.className = 'sc-tre';
        for (const asse of ['x', 'y', 'z']) {
          const l = document.createElement('label'); l.textContent = asse;
          const i = document.createElement('input'); i.type = 'number'; i.step = '0.5'; i.value = e[asse].toFixed(2);
          i.addEventListener('change', () => scrivi(e.id, asse, e[asse], Number(i.value)));
          l.appendChild(i); tre.appendChild(l);
        }
        isp.appendChild(tre);

        riga(isp, 'giro', 0, Math.PI * 2, 0.01, () => entita.leggi(stato.scelto).giro, 'giro',
          (v) => `${Math.round(v * 180 / Math.PI)}°`);
        riga(isp, 'scala', 0.1, 4, 0.01, () => entita.leggi(stato.scelto).scala, 'scala');

        // la tinta MOLTIPLICA il colore cotto nel modello: bianco = com'è
        const rt = document.createElement('div'); rt.className = 'sc-riga';
        const nt = document.createElement('span'); nt.textContent = 'tinta';
        const ct = document.createElement('input'); ct.type = 'color';
        ct.value = esa((Math.round(e.tinta[0] * 255) << 16) | (Math.round(e.tinta[1] * 255) << 8) | Math.round(e.tinta[2] * 255));
        ct.addEventListener('change', () => {
          const n = parseInt(ct.value.slice(1), 16);
          scrivi(e.id, 'tinta', e.tinta, [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]);
        });
        rt.append(nt, ct); isp.appendChild(rt);

        const meta = document.createElement('div'); meta.className = 'sc-meta';
        const ml = document.createElement('div'); ml.textContent = 'dati (chiave: valore, uno per riga)'; ml.style.opacity = '.7';
        const ta = document.createElement('textarea');
        ta.value = Object.entries(e.dati || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
        ta.addEventListener('change', () => scrivi(e.id, 'meta', e.dati || {}, leggiMeta(ta.value)));
        meta.append(ml, ta); isp.appendChild(meta);

        const az = document.createElement('div'); az.className = 'sc-azioni';
        if (onVaiA) { const b = document.createElement('button'); b.type = 'button'; b.textContent = '⌖ vai qui'; b.addEventListener('click', () => onVaiA(entita.leggi(stato.scelto))); az.appendChild(b); }
        const dup = document.createElement('button'); dup.type = 'button'; dup.textContent = '⧉ duplica';
        dup.addEventListener('click', () => {
          const s = entita.leggi(stato.scelto); if (!s) return;
          stato.scelto = entita.aggiungi(s.tipo, s.x + 1, s.y, s.z, { giro: s.giro, scala: s.scala, tinta: s.tinta, nome: s.nome, dati: s.dati });
          avvisa();
        });
        const via = document.createElement('button'); via.type = 'button'; via.className = 'rosso'; via.textContent = '✕ elimina';
        via.addEventListener('click', () => { entita.togli(stato.scelto); stato.scelto = null; avvisa(); });
        az.append(dup, via); isp.appendChild(az);
      }

      viste.ispettore = disegna;
      disegna();
      return { aggiorna() { /* si ridisegna quando cambia la scelta, non a orologio: qui dentro si sta scrivendo */ } };
    },
  };

  return {
    gerarchia, ispettore,
    scegli(id) { stato.scelto = id; avvisa(); },
    get scelto() { return stato.scelto; },
  };
}

/** «chiave: valore» per riga → oggetto. Funzione pura: si prova in Node. */
export function leggiMeta(testo) {
  const out = {};
  for (const r of String(testo).split('\n')) {
    const i = r.indexOf(':');
    if (i <= 0) continue;
    const k = r.slice(0, i).trim();
    if (k) out[k] = r.slice(i + 1).trim();
  }
  return out;
}

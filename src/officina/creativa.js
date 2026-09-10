// Officina — LA CREATIVA: tutto quello che si può avere in mano.
//
// ⚠ IL COMMITTENTE: «voglio una hotbar migliore, questa è inutile buggata e
// manca l'inventario creativo con TUTTI i blocchi e furniture con icone
// comprensibili».
//
// Il difetto era che la barra è una LISTA FISSA di diciannove caselle
// (`CASSETTA` in `gioco/cantiere.js`): tutto quello che non stava lì dentro non
// si poteva avere in mano, per nessuna strada. E i blocchi veri sono molti di
// più, con le categorie già scritte da un pezzo (`CATEGORIE_BLOCCHI` in
// `world/blocks.js`) — i dati del menu creativo c'erano già, mancava la
// finestra.
//
// ⚠ E LE ICONE. Per un blocco, il quadratino del colore della cima va bene ed è
// l'unica icona che non mente: è lo stesso colore che comparirà a schermo. Per
// un GATTO, un megafono o una canna da pesca no — «icone comprensibili». Quindi
// gli oggetti col modello prendono un'icona a due tinte (la loro palette) e un
// contorno tondo, che a colpo d'occhio li stacca dai cubi. Niente emoji: si
// porterebbero dentro lo stile di qualcun altro (è la ragione già scritta in
// `ui/barra.js`, e vale ancora).
//
// ⚠ NIENTE GL, NIENTE MOTORE: DOM più tabelle. `voci()` è pura e si prova in Node.

const CSS = `
#officina .cr-schede { display: flex; gap: 4px; flex-wrap: wrap; margin-bottom: 6px; }
#officina .cr-schede button { font: inherit; font-size: 11px; color: var(--inch); background: var(--tenue);
  border: 1px solid var(--riga); border-radius: 999px; padding: 3px 9px; cursor: pointer; }
#officina .cr-schede button.acceso { background: var(--acceso); border-color: var(--acceso); color: var(--accesoTesto); }
#officina .cr-cerca { width: 100%; max-width: none; margin-bottom: 6px; }
#officina .cr-griglia { display: grid; grid-template-columns: repeat(auto-fill, minmax(74px, 1fr)); gap: 5px;
  max-height: 46vh; overflow: auto; padding: 2px; }
#officina .cr-cella { display: grid; justify-items: center; gap: 3px; padding: 6px 3px 5px; cursor: pointer;
  font: inherit; font-size: 10px; line-height: 1.2; text-align: center; color: var(--inch);
  background: var(--tenue); border: 1px solid var(--riga); border-radius: 8px; }
#officina .cr-cella:hover { background: var(--tenue2); }
#officina .cr-cella.scelta { border-color: var(--acceso); box-shadow: 0 0 0 2px var(--acceso) inset; }
#officina .cr-cella span { display: block; width: 100%; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
/* il cubo: tre facce come le vede il gioco (cima chiara, lato, fondo) */
#officina .cr-ico { width: 28px; height: 28px; border-radius: 4px; position: relative; overflow: hidden;
  border: 1px solid rgba(0,0,0,.2); }
#officina .cr-ico .cr-cima { position: absolute; inset: 0 0 62% 0; }
#officina .cr-ico .cr-lato { position: absolute; inset: 38% 0 0 0; }
/* un oggetto col modello: tondo e a due tinte, così NON si confonde con un blocco */
#officina .cr-ico.cr-cosa { border-radius: 50%; }
#officina .cr-ico.cr-cosa .cr-cima { inset: 0 0 50% 0; }
#officina .cr-ico.cr-cosa .cr-lato { inset: 50% 0 0 0; }
/* la mano vuota è un contorno e basta, che è esattamente quello che è */
#officina .cr-ico.cr-vuota { border: 2px dashed rgba(127,127,127,.6); background: none; }
#officina .cr-vuoto { padding: 10px; font-size: 11px; opacity: .7; }
#officina .cr-quante { font-size: 10.5px; opacity: .62; margin-bottom: 4px; }
`;

/** La mano vuota è una voce vera dell'elenco, non un buco: è uno strumento. */
export const MANO_VUOTA = { id: null, nome: 'Mano vuota', categoria: 'mano', cosa: false, cima: null, lato: null };

/**
 * L'elenco completo, categoria per categoria.
 *
 * ⚠ SI COSTRUISCE DAI DATI CHE CI SONO GIÀ (le categorie dei blocchi e il
 * catalogo degli asset), non da una lista scritta a mano: una lista a mano è
 * esattamente quello che era la `CASSETTA`, e il difetto di una lista a mano è
 * che il blocco aggiunto ieri non c'è.
 *
 * Funzione pura: si prova in Node.
 */
export function voci({ categorie, blocchi, catalogo, nomeArredo = null }) {
  const out = [MANO_VUOTA];
  const visti = new Set();
  for (const cat of categorie) {
    for (const id of cat.blocchi) {
      const d = blocchi[id];
      if (!d || visti.has(id)) continue;
      visti.add(id);
      const r = catalogo && catalogo[d.modello || id];
      out.push({
        id, nome: d.nome || id, categoria: cat.id, categoriaNome: cat.nome,
        // ⚠ una cosa col MODELLO non è un cubo, e l'icona deve dirlo
        cosa: d.forma === 'modello',
        cima: d.cima ?? d.colore ?? 0x999999,
        lato: d.lato ?? d.colore ?? 0x777777,
        ombra: r ? r.proiettaOmbra : undefined,
      });
    }
  }
  // ⚠ E QUELLO CHE LE CATEGORIE NON HANNO. `registraBlocco` mette tutto in
  // «Officina» se non gli si dice altro, ma un blocco registrato altrove (gli
  // arredi, il lampione spento) resterebbe fuori dall'inventario — cioè
  // esattamente il difetto che questo file cura, ricreato in piccolo.
  for (const [id, d] of Object.entries(blocchi)) {
    if (visti.has(id)) continue;
    visti.add(id);
    out.push({
      id, nome: (nomeArredo && nomeArredo(id)) || d.nome || id, categoria: d.forma === 'modello' ? 'cose' : 'altro',
      categoriaNome: d.forma === 'modello' ? 'Cose' : 'Altro',
      cosa: d.forma === 'modello',
      cima: d.cima ?? d.colore ?? 0x999999,
      lato: d.lato ?? d.colore ?? 0x777777,
    });
  }
  return out;
}

/** Le categorie presenti nell'elenco, nell'ordine in cui compaiono. */
export function categorieDi(elenco) {
  const out = [];
  const visti = new Set();
  for (const v of elenco) {
    if (v.categoria === 'mano' || visti.has(v.categoria)) continue;
    visti.add(v.categoria);
    out.push({ id: v.categoria, nome: v.categoriaNome || v.categoria });
  }
  return out;
}

/** Filtro: categoria (`null` = tutte) e testo. Pura. */
export function filtra(elenco, categoria, testo) {
  const t = String(testo || '').trim().toLowerCase();
  return elenco.filter((v) => {
    if (categoria && v.categoria !== categoria && v.categoria !== 'mano') return false;
    if (!t) return true;
    return (v.nome || '').toLowerCase().includes(t) || String(v.id || '').toLowerCase().includes(t);
  });
}

const esa = (n) => '#' + (n >>> 0 & 0xffffff).toString(16).padStart(6, '0');

/**
 * Il registro «Creativa» dell'Officina.
 * @param elenco    da `voci()`
 * @param inMano    () => id attualmente in mano (o null)
 * @param onPrendi  (id) → void
 */
export function registroCreativa({ elenco, inMano, onPrendi }) {
  let categoria = null, testo = '';

  return {
    chiave: 'creativa',
    nome: '🎒 Creativa',
    nota: 'Tutto quello che si può avere in mano. Un clic e ce l\'hai.',

    disegna(box) {
      if (!document.getElementById('officina-creativa-stile')) {
        const s = document.createElement('style'); s.id = 'officina-creativa-stile'; s.textContent = CSS; document.head.appendChild(s);
      }
      const schede = document.createElement('div'); schede.className = 'cr-schede';
      const cerca = document.createElement('input'); cerca.type = 'text'; cerca.className = 'cr-cerca'; cerca.placeholder = 'cerca…';
      const quante = document.createElement('div'); quante.className = 'cr-quante';
      const griglia = document.createElement('div'); griglia.className = 'cr-griglia';
      box.append(schede, cerca, quante, griglia);

      const cats = [{ id: null, nome: 'Tutto' }, ...categorieDi(elenco)];
      const bottoni = cats.map((c) => {
        const b = document.createElement('button'); b.type = 'button'; b.textContent = c.nome;
        b.addEventListener('click', () => { categoria = c.id; segnaSchede(); disegna(); });
        schede.appendChild(b);
        return { b, id: c.id };
      });
      function segnaSchede() { for (const x of bottoni) x.b.classList.toggle('acceso', x.id === categoria); }
      cerca.addEventListener('input', () => { testo = cerca.value; disegna(); });

      function disegna() {
        const v = filtra(elenco, categoria, testo);
        quante.textContent = `${v.length - (v[0] === MANO_VUOTA ? 1 : 0)} cose`;
        griglia.innerHTML = '';
        if (!v.length) { const z = document.createElement('div'); z.className = 'cr-vuoto'; z.textContent = 'niente che si chiami così'; griglia.appendChild(z); return; }
        const mano = inMano();
        for (const it of v) {
          const b = document.createElement('button'); b.type = 'button';
          b.className = 'cr-cella' + (it.id === mano ? ' scelta' : '');
          b.title = it.id ? `${it.nome} (${it.id})` : 'mano vuota — rompi e interagisci';
          const ico = document.createElement('i');
          ico.className = 'cr-ico' + (it.id === null ? ' cr-vuota' : it.cosa ? ' cr-cosa' : '');
          if (it.id !== null) {
            const c = document.createElement('b'); c.className = 'cr-cima'; c.style.background = esa(it.cima);
            const l = document.createElement('b'); l.className = 'cr-lato'; l.style.background = esa(it.lato);
            ico.append(l, c);
          }
          const n = document.createElement('span'); n.textContent = it.nome;
          b.append(ico, n);
          // ⚠ «pointerdown» e non «click»: sul telefono il click arriva dopo un
          // ritardo e in mezzo il tocco è già passato alla tela sotto — si
          // sceglieva una cosa E si posava un blocco. È lo stesso difetto già
          // pagato in `ui/barra.js`.
          b.addEventListener('pointerdown', (e) => { e.preventDefault(); e.stopPropagation(); onPrendi(it.id); disegna(); });
          griglia.appendChild(b);
        }
      }
      segnaSchede(); disegna();
      return { aggiorna() { /* la scelta si vede al prossimo disegno: qui non si tocca il DOM per niente */ } };
    },
  };
}

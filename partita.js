var mn=Object.defineProperty;var Nt=(a,t,o)=>()=>{if(o)throw o[0];try{return a&&(t=a(a=0)),t}catch(e){throw o=[e],e}};var ge=(a,t)=>{for(var o in t)mn(a,o,{get:t[o],enumerable:!0})};var Ai={};ge(Ai,{BLOCCHI:()=>pt,CATEGORIA_OFFICINA:()=>Qt,CATEGORIA_PROVE:()=>wo,CATEGORIE_BLOCCHI:()=>Io,defBlocco:()=>Nn,defDi:()=>k,livelloAcqua:()=>xe,registraBlocco:()=>kt,rimuoviBlocco:()=>In,tipoBase:()=>Yt});function kt(a,t,o=Qt){pt[a]=t,o.blocchi.includes(a)||o.blocchi.push(a)}function In(a){delete pt[a];for(let t of[Qt,wo]){let o=t.blocchi.indexOf(a);o>=0&&t.blocchi.splice(o,1)}}function Nn(a){return pt[a]}function k(a){return pt[a.charCodeAt(0)===97&&a.startsWith("acqua")?"acqua":a]||wn}function Yt(a){let t=a.indexOf("~");return t<0?a:a.slice(0,t)}function xe(a){if(!a||!a.startsWith("acqua"))return null;let t=a.indexOf("~");return t<0?0:Number(a.slice(t+1))}var pt,Io,Qt,wo,wn,ct=Nt(()=>{pt={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},Io=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],Qt={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};Io.push(Qt);wo={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};Io.push(wo);wn={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"}});var la={};ge(la,{CATALOGO:()=>re,conAlone:()=>pr,istanzaDi:()=>fr,posaDi:()=>co,registraAsset:()=>$o,rigaDi:()=>Te});function Te(a){return Object.prototype.hasOwnProperty.call(re,a)?re[a]:null}function $o(a,t){return re[a]={nome:a,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1],...t,modello:t.modello||a},re[a]}function Xo(a,t,o,e){let i=Math.imul(a|0,374761393)+Math.imul(t|0,668265263)+Math.imul(o|0,1274126177)+Math.imul(e|0,2246822519)|0;return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}function co(a,t,o,e,i=!0){let n=Te(a);if(!n||!i)return{scala:1,tinta:[1,1,1],giro:0};let r=1;if(Array.isArray(n.scala)){let c=Xo(t,o,e,1);r=n.scala[0]+c*(n.scala[1]-n.scala[0])}else typeof n.scala=="number"&&(r=n.scala);let s=0;return n.giro==="libero"?s=Xo(t,o,e,2)*Math.PI*2:n.giro==="quarti"&&(s=Math.floor(Xo(t,o,e,2)*4)*ur),{scala:r,tinta:[1,1,1],giro:s}}function fr(a,t,o,e,i=!0){let n=co(a,t,o,e,i);return[t,o,e,n.scala,n.tinta[0],n.tinta[1],n.tinta[2],n.giro]}function pr(){return Object.entries(re).filter(([,a])=>a.alone)}var re,ur,Ce=Nt(()=>{re={albero:{nome:"Albero",modello:"albero",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,5,1]},lampione:{nome:"Lampione",modello:"lampione",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1],alone:{quota:2.35,raggio:1.6,colore:[1,.85,.5]}},lampioneSpento:{nome:"Lampione spento",modello:"lampioneSpento",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1]},panchina:{nome:"Panchina",modello:"panchina",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[2,1,1]},ciuffo:{nome:"Ciuffo",modello:"ciuffo",giro:"libero",scala:[.82,1.24],proiettaOmbra:!1,classe:"fermo",ingombro:[1,1,1]}};ur=Math.PI/2});function Oa(a){return a&&typeof a=="object"?JSON.parse(JSON.stringify(a)):a}function Cr(a,t){return a===t||a&&t&&typeof a=="object"&&JSON.stringify(a)===JSON.stringify(t)}var ho,Ia=Nt(()=>{ho=class{constructor({scrivi:t,autore:o="locale",limite:e=500}={}){this._scrivi=t,this.autore=o,this.limite=e,this.fatti=[],this.disfatti=[],this.diario=[],this._osservatori=new Set}esegui({registro:t,campo:o,prima:e,dopo:i,nota:n}){if(Cr(e,i))return null;let r={registro:t,campo:o,prima:Oa(e),dopo:Oa(i),autore:this.autore,t:Date.now(),nota:n};return this._scrivi(t,o,r.dopo),this.fatti.push(r),this.fatti.length>this.limite&&this.fatti.shift(),this.disfatti.length=0,this._annota("esegui",r),r}aVista(t,o,e){this._scrivi(t,o,e)}annulla(){let t=this.fatti.pop();return t?(this._scrivi(t.registro,t.campo,t.prima),this.disfatti.push(t),this._annota("annulla",t),t):null}ripeti(){let t=this.disfatti.pop();return t?(this._scrivi(t.registro,t.campo,t.dopo),this.fatti.push(t),this._annota("ripeti",t),t):null}get puoAnnullare(){return this.fatti.length>0}get puoRipetere(){return this.disfatti.length>0}netto(){let t={};for(let o of this.fatti)(t[o.registro]||={})[o.campo]=o.dopo;return t}rigioca(t){for(let o of t)this._scrivi(o.registro,o.campo,o.dopo)}osserva(t){return this._osservatori.add(t),()=>this._osservatori.delete(t)}_annota(t,o){this.diario.push({verbo:t,...o}),this.diario.length>this.limite*2&&this.diario.shift();for(let e of this._osservatori)e(t,o)}}});function Wo(a){if(a&&a.chiave&&typeof a.disegna=="function")return a.campi=a.campi||[],a;if(!a||!a.chiave||!Array.isArray(a.campi))throw new Error(`registro malformato: ${a&&a.chiave}`);for(let t of a.campi){if(!Sr.includes(t.tipo))throw new Error(`${a.chiave}.${t.chiave}: tipo sconosciuto \xAB${t.tipo}\xBB`);if(t.tipo!=="azione"&&typeof t.leggi!="function")throw new Error(`${a.chiave}.${t.chiave}: manca leggi()`);t.tipo==="scelta"&&(t.scelte=(t.scelte||[]).map(o=>typeof o=="object"?o:{v:o,nome:String(o)})),t.tipo==="numero"&&(t.min??=0,t.max??=1,t.passo??=(t.max-t.min)/100)}return a}function mo(a,t){if(t==null)return"\u2014";switch(a.tipo){case"numero":{let o=a.passo>=1?0:a.passo>=.1?1:a.passo>=.01?2:3;return Number(t).toFixed(o)+(a.unita?" "+a.unita:"")}case"interruttore":return t?"s\xEC":"no";case"scelta":{let o=a.scelte.find(e=>e.v===t);return o?o.nome:String(t)}default:return typeof t=="object"?JSON.stringify(t):String(t)}}function wa(a,t){switch(a.tipo){case"numero":return Number(t);case"interruttore":return!!t&&t!=="false";case"scelta":{let o=a.scelte.find(e=>String(e.v)===String(t));return o?o.v:t}default:return t}}var Sr,Qo=Nt(()=>{Sr=["numero","interruttore","scelta","colore","testo","azione","lettura"]});function Jo(a,t,o){a.push(t),a.length>o&&a.shift()}function Ot(a,t){if(!a.length)return NaN;let o=a.slice().sort((e,i)=>e-i);return o[Math.min(o.length-1,Math.floor(o.length*t))]}function ce(a){return Number.isFinite(a)?Math.round(a*10)/10:null}var go,Na=Nt(()=>{go=class{constructor({campione:t,finestra:o=240}={}){this._campione=t||(()=>({})),this.finestra=o,this.ms=[],this.disegni=[],this.rtMs=[],this._prima=0,this._raccolta=null}passo(t=performance.now()){if(this._prima){let o=t-this._prima,e=this._campione()||{};Jo(this.ms,o,this.finestra),Number.isFinite(e.disegni)&&Jo(this.disegni,e.disegni,this.finestra),Number.isFinite(e.rtMs)&&Jo(this.rtMs,e.rtMs,this.finestra),this._raccolta&&t>=this._raccolta.da&&(this._raccolta.ms.push(o),Number.isFinite(e.disegni)&&this._raccolta.disegni.push(e.disegni),Number.isFinite(e.rtMs)&&this._raccolta.rtMs.push(e.rtMs))}this._prima=t}adesso(){return{fps:this.ms.length?Math.round(1e3/Ot(this.ms,.5)):null,p50:ce(Ot(this.ms,.5)),p99:ce(Ot(this.ms,.99)),disegni:this.disegni.length?Math.round(Ot(this.disegni,.5)):null,rtMs:ce(Ot(this.rtMs,.5))}}misura({secondi:t=5,riscaldo:o=1,etichetta:e=""}={}){let i=performance.now();return this._raccolta={da:i+o*1e3,ms:[],disegni:[],rtMs:[]},new Promise(n=>{let r=i+(o+t)*1e3,s=()=>{if(performance.now()<r)return requestAnimationFrame(s);let c=this._raccolta;this._raccolta=null,n({etichetta:e,frame:c.ms.length,secondi:t,fps:c.ms.length?Math.round(1e3/Ot(c.ms,.5)):null,p50:ce(Ot(c.ms,.5)),p99:ce(Ot(c.ms,.99)),disegni:c.disegni.length?Math.round(Ot(c.disegni,.5)):null,rtMs:ce(Ot(c.rtMs,.5))})};requestAnimationFrame(s)})}}});var Rr,vo,Fa=Nt(()=>{Qo();Rr=`
#officina { --inch: #0d2a1a; --carta: rgba(255,255,255,.94); --riga: rgba(13,42,26,.12); --acceso: #0d2a1a; --accesoTesto: #eaf6ef;
  --tenue: rgba(13,42,26,.06); --tenue2: rgba(13,42,26,.13); --campo: #fff; --esito: rgba(13,42,26,.035); --fuoco: #2f7d4f; --ombra: 0 4px 24px rgba(13,42,26,.16);
  position: fixed; z-index: 40; font: 12px/1.45 ui-monospace, SFMono-Regular, Menlo, monospace; color: var(--inch);
  right: 8px; bottom: 8px; width: min(380px, calc(100vw - 16px)); pointer-events: none; }
/* \u26A0 IL TEMA SCURO \xC8 DELL'EDITOR, NON DEL GIOCO: il pannello dentro la shell deve
   dire \xABsei fuori dal gioco\xBB. Stessi controlli, altra carta. */
#officina.scuro { --inch: #dfe8e2; --carta: #151c18; --riga: rgba(223,232,226,.12); --acceso: #79b8ff; --accesoTesto: #0b1a2b;
  --tenue: rgba(223,232,226,.07); --tenue2: rgba(223,232,226,.15); --campo: #0f1512; --esito: rgba(223,232,226,.05); --fuoco: #79b8ff; --ombra: none; }
#officina * { box-sizing: border-box; }
#officina .off-tasto { pointer-events: auto; position: absolute; right: 0; bottom: 0; font: inherit; font-weight: 700;
  color: var(--inch); background: var(--carta); border: 1px solid var(--riga); border-radius: 8px; padding: 7px 11px; cursor: pointer;
  box-shadow: var(--ombra); white-space: pre; }
#officina.aperta .off-tasto { display: none; }
#officina .off-corpo { display: none; pointer-events: auto; width: 100%; min-width: 0; background: var(--carta); border: 1px solid var(--riga); border-radius: 10px;
  box-shadow: var(--ombra); max-height: min(78vh, 720px); overflow: hidden; flex-direction: column; touch-action: pan-y; }
#officina.aperta .off-corpo { display: flex; }
/* incassato: dentro la shell dell'editor, niente finestra flottante */
#officina.incassato { position: static; width: auto; height: 100%; pointer-events: auto; }
#officina.incassato .off-tasto { display: none; }
#officina.incassato .off-corpo { display: flex; height: 100%; max-height: none; border: 0; border-radius: 0; box-shadow: none; animation: none; }
#officina.incassato [data-fa=chiudi], #officina.incassato .off-vivi { display: none; }
#officina header { display: flex; align-items: center; gap: 6px; padding: 7px 8px 6px; border-bottom: 1px solid var(--riga); }
#officina header .off-vivi { flex: 1; min-width: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-variant-numeric: tabular-nums; }
/* \u26A0 LA BARRETTA COL NOME DEL RIQUADRO, che \xE8 quello che fa sembrare un editor
   un editor: in una shell a pi\xF9 pannelli, senza il nome in cima non si capisce
   dove si \xE8. Maiuscoletto spaziato \u2014 \xE8 il vestito di tutti gli editor, e qui
   costa due righe. */
#officina .off-etichetta { display: none; font-size: 10.5px; font-weight: 700; letter-spacing: .09em;
  text-transform: uppercase; opacity: .66; white-space: nowrap; }
#officina.con-etichetta .off-etichetta { display: block; }
#officina.senza-schede nav { display: none; }
#officina.incassato { --carta: transparent; }
#officina.incassato .off-corpo { background: transparent; }
#officina header .off-vivi b { font-size: 14px; }
#officina header .off-spazio { flex: 1; }
#officina header button { font: inherit; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga);
  border-radius: 6px; padding: 3px 7px; cursor: pointer; min-width: 30px; }
#officina header button:disabled { opacity: .35; cursor: default; }
#officina nav { display: flex; gap: 4px; padding: 6px 8px; overflow-x: auto; border-bottom: 1px solid var(--riga); scrollbar-width: none; }
#officina.incassato nav { flex-wrap: wrap; overflow: visible; }   /* nel dock c'\xE8 spazio in altezza: le schede vanno a capo invece di sparire a destra */
#officina nav button { font: inherit; font-size: 11px; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga);
  border-radius: 999px; padding: 4px 10px; white-space: nowrap; cursor: pointer; flex: 0 0 auto; }
#officina nav button.acceso { background: var(--acceso); border-color: var(--acceso); color: var(--accesoTesto); }
#officina .off-campi { overflow: auto; padding: 6px 10px 10px; display: grid; grid-template-columns: minmax(0, 1fr); gap: 7px; min-width: 0; flex: 1; align-content: start; }   /* \u26A0 align-content: start \u2014 nel dock alto le righe della griglia si stiravano a riempirlo: un campo ogni cento pixel */
#officina .off-nota { font-size: 11px; opacity: .72; margin: 2px 0 4px; white-space: pre-wrap; }
#officina .campo { display: grid; grid-template-columns: minmax(0, 1fr); gap: 3px; min-width: 0; }
#officina .campo .riga { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
#officina .campo .nome { min-width: 0; flex: 1 1 auto; }
#officina .campo .valore { font-variant-numeric: tabular-nums; opacity: .85; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 62%; flex: 0 1 auto; }
#officina .campo small { display: block; font-size: 10.5px; opacity: .62; line-height: 1.35; }
#officina input[type=range] { width: 100%; accent-color: var(--acceso); margin: 0; height: 22px; }
#officina select, #officina input[type=text] { font: inherit; color: var(--inch); background: var(--campo); border: 1px solid var(--riga); border-radius: 6px; padding: 4px 6px; max-width: 58%; }
#officina input[type=color] { width: 44px; height: 26px; border: 1px solid var(--riga); border-radius: 6px; padding: 0; background: none; }
#officina .interruttore { font: inherit; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga); border-radius: 999px; padding: 3px 10px; cursor: pointer; min-width: 44px; }
#officina .interruttore.acceso { background: var(--acceso); border-color: var(--acceso); color: var(--accesoTesto); }
#officina .azione { font: inherit; font-weight: 600; color: var(--inch); background: var(--tenue); border: 1px solid var(--riga); border-radius: 7px; padding: 6px 10px; cursor: pointer; text-align: left; }
#officina .azione:active { background: var(--tenue2); }
#officina .off-esito { margin: 0; padding: 7px 10px; border-top: 1px solid var(--riga); max-height: 34%; overflow: auto; font-size: 11px; white-space: pre-wrap; user-select: text; background: var(--esito); }
#officina button:focus-visible, #officina input:focus-visible, #officina select:focus-visible { outline: 2px solid var(--fuoco); outline-offset: 1px; }
@media (max-width: 720px), (pointer: coarse) {
  #officina:not(.incassato) { right: 6px; left: 6px; bottom: 6px; width: auto; }
  #officina:not(.incassato) .off-corpo { max-height: 62vh; }
}
@media (prefers-reduced-motion: no-preference) { #officina:not(.incassato) .off-corpo { animation: off-sale .16s ease-out; } }
@keyframes off-sale { from { transform: translateY(8px); opacity: 0; } to { transform: none; opacity: 1; } }
`,vo=class{constructor({registri:t,bus:o,vivi:e,radice:i=document.body,titolo:n="Officina",contenitore:r=null,scuro:s=!1,etichetta:c=null,azioni:l=!0}){this.registri=t,this.bus=o,this._vivi=e||(()=>""),this.attivo=t[0]&&t[0].chiave,this._el={},this.incassato=!!r,this._etichetta=c,this._azioni=l,this._costruisci(r||i,n,s),this._orologio=setInterval(()=>this.aggiorna(),500),o.osserva(()=>this.aggiorna(!0))}apri(t=!0){this.incassato&&(t=!0),this.radice.classList.toggle("aperta",t),t&&this.aggiorna(!0)}get aperto(){return this.incassato||this.radice.classList.contains("aperta")}esito(t){this._el.esito.hidden=!t,this._el.esito.textContent=t||""}_costruisci(t,o,e){if(!document.getElementById("officina-stile")){let n=document.createElement("style");n.id="officina-stile",n.textContent=Rr,document.head.appendChild(n)}let i=this.radice=document.createElement("div");i.id="officina",this.incassato&&i.classList.add("incassato","aperta"),e&&i.classList.add("scuro"),i.innerHTML=`
      <button class="off-tasto" type="button" aria-label="apri ${o}">\u2699 ${o}</button>
      <div class="off-corpo" role="dialog" aria-label="${o}">
        <header>
          <div class="off-etichetta"></div>
          <div class="off-vivi">\u2026</div>
          <span class="off-spazio"></span>
          <button type="button" data-fa="annulla" title="annulla">\u21B6</button>
          <button type="button" data-fa="ripeti" title="ripeti">\u21B7</button>
          <button type="button" data-fa="chiudi" title="chiudi">\u2715</button>
        </header>
        <nav></nav>
        <div class="off-campi"></div>
        <pre class="off-esito" hidden></pre>
      </div>`,t.appendChild(i),this._el.tasto=i.querySelector(".off-tasto"),this._el.vivi=i.querySelector(".off-vivi"),this._el.etichetta=i.querySelector(".off-etichetta"),this._etichetta&&(this._el.etichetta.textContent=this._etichetta,i.classList.add("con-etichetta")),this._azioni||(i.querySelector("[data-fa=annulla]").hidden=!0,i.querySelector("[data-fa=ripeti]").hidden=!0),this.registri.length<2&&i.classList.add("senza-schede"),this._el.nav=i.querySelector("nav"),this._el.campi=i.querySelector(".off-campi"),this._el.esito=i.querySelector(".off-esito"),this._el.annulla=i.querySelector("[data-fa=annulla]"),this._el.ripeti=i.querySelector("[data-fa=ripeti]"),this._el.tasto.addEventListener("click",()=>this.apri(!0)),i.querySelector("[data-fa=chiudi]").addEventListener("click",()=>this.apri(!1)),this._el.annulla.addEventListener("click",()=>this.bus.annulla()),this._el.ripeti.addEventListener("click",()=>this.bus.ripeti()),i.addEventListener("keydown",n=>{n.key==="Escape"&&this.apri(!1),n.stopPropagation()}),i.addEventListener("keyup",n=>n.stopPropagation()),i.querySelector(".off-corpo").addEventListener("wheel",n=>n.stopPropagation(),{passive:!0});for(let n of this.registri){let r=document.createElement("button");r.type="button",r.textContent=n.nome,r.dataset.chiave=n.chiave,r.addEventListener("click",()=>{this.attivo=n.chiave,this._disegnaScheda()}),this._el.nav.appendChild(r)}this._disegnaScheda()}_disegnaScheda(){for(let e of this._el.nav.children)e.classList.toggle("acceso",e.dataset.chiave===this.attivo);let t=this.registri.find(e=>e.chiave===this.attivo),o=this._el.campi;if(o.innerHTML="",this._controlli=[],this._vista=null,!!t){if(t.nota){let e=document.createElement("div");e.className="off-nota",e.textContent=t.nota,o.appendChild(e)}if(typeof t.disegna=="function"){this._vista=t.disegna(o,this)||null;return}for(let e of t.campi)o.appendChild(this._controllo(t,e));this.aggiorna(!0)}}_controllo(t,o){let e=document.createElement("div");e.className="campo",e.dataset.campo=o.chiave;let i=document.createElement("div");i.className="riga";let n=document.createElement("span");n.className="nome",n.textContent=o.nome,i.appendChild(n),e.appendChild(i);let r=(c,l)=>this.bus.esegui({registro:t.chiave,campo:o.chiave,prima:c,dopo:l}),s={campo:o,el:null,mostra:null,tocco:!1};switch(o.tipo){case"numero":{let c=document.createElement("span");c.className="valore",i.appendChild(c);let l=document.createElement("input");l.type="range",l.min=o.min,l.max=o.max,l.step=o.passo;let u;l.addEventListener("input",()=>{u===void 0&&(u=o.leggi()),s.tocco=!0;let p=Number(l.value);c.textContent=mo(o,p),this.bus.aVista(t.chiave,o.chiave,p)}),l.addEventListener("change",()=>{let p=Number(l.value);s.tocco=!1;let f=u===void 0?o.leggi():u;u=void 0,r(f,p)}),e.appendChild(l),s.el=l,s.mostra=p=>{s.tocco||(l.value=p,c.textContent=mo(o,p))};break}case"interruttore":{let c=document.createElement("button");c.type="button",c.className="interruttore",c.addEventListener("click",()=>{let l=!!o.leggi();r(l,!l)}),i.appendChild(c),s.el=c,s.mostra=l=>{c.classList.toggle("acceso",!!l),c.textContent=l?"s\xEC":"no"};break}case"scelta":{let c=document.createElement("select");for(let l of o.scelte){let u=document.createElement("option");u.value=String(l.v),u.textContent=l.nome,c.appendChild(u)}c.addEventListener("change",()=>r(o.leggi(),wa(o,c.value))),i.appendChild(c),s.el=c,s.mostra=l=>{c.value=String(l)};break}case"colore":{let c=document.createElement("input");c.type="color";let l;c.addEventListener("input",()=>{l===void 0&&(l=o.leggi()),this.bus.aVista(t.chiave,o.chiave,c.value)}),c.addEventListener("change",()=>{let u=l===void 0?o.leggi():l;l=void 0,r(u,c.value)}),i.appendChild(c),s.el=c,s.mostra=u=>{document.activeElement!==c&&(c.value=u||"#000000")};break}case"testo":{let c=document.createElement("input");c.type="text",c.readOnly=!o.scrivi,c.addEventListener("change",()=>o.scrivi&&r(o.leggi(),c.value)),i.appendChild(c),s.el=c,s.mostra=l=>{document.activeElement!==c&&(c.value=l??"")};break}case"lettura":{let c=document.createElement("span");c.className="valore",i.appendChild(c),s.mostra=l=>{c.textContent=mo(o,l)};break}case"azione":{e.removeChild(i);let c=document.createElement("button");c.type="button",c.className="azione",c.textContent=o.nome,c.addEventListener("click",async()=>{c.disabled=!0;try{await o.fai(this)}finally{c.disabled=!1,this.aggiorna(!0)}}),e.appendChild(c),s.el=c;break}}if(o.nota){let c=document.createElement("small");c.textContent=o.nota,e.appendChild(c)}return this._controlli.push(s),e}aggiorna(t=!1){if(this._el.tasto.textContent=`\u2699 ${this._vivi(!0)||"Officina"}`,!(!this.aperto&&!t)){this._el.vivi.innerHTML=this._vivi(!1)||"",this._el.annulla.disabled=!this.bus.puoAnnullare,this._el.ripeti.disabled=!this.bus.puoRipetere;for(let o of this._controlli||[])if(!(!o.mostra||o.tocco))try{o.mostra(o.campo.leggi())}catch(e){o.el&&(o.el.title=String(e))}if(this._vista&&this._vista.aggiorna)try{this._vista.aggiorna()}catch{}}}vaiA(t){this.attivo!==t&&(this.attivo=t,this._disegnaScheda())}}});var Pa={};ge(Pa,{apriOfficina:()=>Lr});function Lr({registri:a,gruppi:t=null,campione:o,autore:e="officina",titolo:i="Officina",apertoSubito:n=!1,agganciaFrame:r,contenitore:s=null,scuro:c=!1}={}){t&&(a=t.flatMap(b=>b.registri)),a=a.map(Wo);let l=new Map(a.map(b=>[b.chiave,new Map(b.campi.map(x=>[x.chiave,x]))])),u=new Map(a.map(b=>[b.chiave,b])),p=(b,x,A)=>{let E=l.get(b)&&l.get(b).get(x);if(E&&E.scrivi){E.scrivi(A);return}let M=u.get(b);if(M&&typeof M.scriviDinamico=="function"){M.scriviDinamico(x,A);return}throw new Error(`campo non scrivibile: ${b}.${x}`)},f=new ho({scrivi:p,autore:e}),d=new go({campione:o}),h=b=>{let x=d.adesso();return x.fps==null?b?"Officina":"in attesa del primo fotogramma\u2026":b?`${x.fps} fps \xB7 ${x.disegni??"\u2014"}d`:`<b>${x.fps}</b> fps \xB7 p50 ${x.p50} \xB7 p99 ${x.p99} ms \xB7 <b>${x.disegni??"\u2014"}</b> disegni \xB7 rt ${x.rtMs??"\u2014"} ms`},m=(t||[{contenitore:s,registri:a,etichetta:null,azioni:!0}]).map((b,x)=>new vo({registri:b.registri.map(Wo),bus:f,vivi:h,titolo:i,contenitore:b.contenitore||s,scuro:c,etichetta:b.etichetta??null,azioni:b.azioni??x===0})),g=m[0];if(n)for(let b of m)b.apri(!0);return r&&r(()=>d.passo()),{registri:a,bus:f,campionatore:d,pannello:g,pannelli:m,vivi:h,vaiA:b=>{for(let x of m)x.registri.some(A=>A.chiave===b)&&x.vaiA(b)},passo:()=>d.passo()}}var qa=Nt(()=>{Ia();Qo();Na();Fa()});var Ba={};ge(Ba,{TETTO_VOCI:()=>Ir,creaScena:()=>wr,esa:()=>Ua,leggiMeta:()=>ka,vociVicine:()=>Da});function Da(a,t,o=60){let e=a.map(i=>{let n=i.x-t.x,r=(i.y-t.y)*.5,s=i.z-t.z;return{...i,lontano:Math.sqrt(n*n+r*r+s*s)}});return e.sort((i,n)=>i.lontano-n.lontano),{voci:e.slice(0,o),altri:Math.max(0,e.length-o)}}function Ua(a){return"#"+(a>>>0&16777215).toString(16).padStart(6,"0")}function wr({entita:a,dove:t,coloreDi:o,nomeDi:e,rigaDi:i,onVaiA:n=null}){let r={scelto:null,aperti:new Set,filtro:""},s={},c=()=>{for(let f of Object.values(s))f&&f()};function l(){if(!document.getElementById("officina-scena-stile")){let f=document.createElement("style");f.id="officina-scena-stile",f.textContent=Or,document.head.appendChild(f)}}return{gerarchia:{chiave:"gerarchia",nome:"\u{1F5C2} Gerarchia",disegna(f){l(),f.style.display="flex",f.style.flexDirection="column";let d=document.createElement("div");d.className="sc-barra";let h=document.createElement("input");h.type="text",h.placeholder="cerca un tipo\u2026",h.value=r.filtro;let m=document.createElement("span");m.className="valore",d.append(h,m);let g=document.createElement("div");g.className="sc-albero sc-alto",f.append(d,g),h.addEventListener("input",()=>{r.filtro=h.value.trim().toLowerCase(),v()});function v(){g.innerHTML="";let b=a.perTipo().filter(([A])=>!r.filtro||A.toLowerCase().includes(r.filtro)||(e(A)||"").toLowerCase().includes(r.filtro));if(m.textContent=`${a.conta} oggetti`,!b.length){let A=document.createElement("div");A.className="sc-vuoto",A.textContent="niente da mostrare",g.appendChild(A);return}let x=t();for(let[A,E]of b){let M=document.createElement("div");M.className="sc-gruppo";let O=document.createElement("button");O.type="button",O.className="sc-cap";let N=r.aperti.has(A),z=document.createElement("i");z.className="sc-pallino",z.style.background=o(A);let _=document.createElement("span");_.textContent=(N?"\u25BE ":"\u25B8 ")+(e(A)||A);let S=document.createElement("span");if(S.className="sc-quanti",S.textContent=E,O.append(z,_,S),O.addEventListener("click",()=>{N?r.aperti.delete(A):r.aperti.add(A),v()}),M.appendChild(O),N){let L=[];a.ognunaDi(A,(P,G,U,I)=>L.push({id:I,x:P,y:G,z:U}));let{voci:F,altri:R}=Da(L,x);for(let P of F){let G=document.createElement("button");G.type="button",G.className="sc-voce"+(P.id===r.scelto?" scelta":"");let U=a.leggi(P.id),I=document.createElement("span");I.textContent=U&&U.nome||`#${P.id}`;let ut=document.createElement("span");ut.className="sc-lont",ut.textContent=P.lontano.toFixed(0)+" m",G.append(I,ut),G.addEventListener("click",()=>{r.scelto=P.id,c()}),M.appendChild(G)}if(R){let P=document.createElement("div");P.className="sc-altri",P.textContent=`e altri ${R}, pi\xF9 lontani`,M.appendChild(P)}}g.appendChild(M)}}return s.gerarchia=v,v(),{aggiorna(){m.textContent=`${a.conta} oggetti`}}}},ispettore:{chiave:"ispettore",nome:"\u{1F50D} Ispettore",scriviDinamico(f,d){let h=f.indexOf("."),m=Number(f.slice(0,h)),g=f.slice(h+1);if(g==="nome"){a.battezza(m,d||null),c();return}if(g==="meta"){a.metadati(m,d);return}if(g==="tinta"){a.posa(m,{tinta:d});return}a.posa(m,{[g]:d})},disegna(f,d){l();let h=document.createElement("div");h.className="sc-isp sc-solo",f.appendChild(h);let m=(b,x,A,E)=>d.bus.esegui({registro:"ispettore",campo:`${b}.${x}`,prima:A,dopo:E});function g(b,x,A,E,M,O,N,z=_=>_.toFixed(2)){let _=document.createElement("div");_.className="sc-riga";let S=document.createElement("span");S.textContent=x;let L=document.createElement("input");L.type="range",L.min=A,L.max=E,L.step=M,L.value=O();let F=document.createElement("span");F.className="sc-num",F.textContent=z(O());let R;L.addEventListener("input",()=>{R===void 0&&(R=O());let P=Number(L.value);F.textContent=z(P),a.posa(r.scelto,{[N]:P})}),L.addEventListener("change",()=>{let P=R===void 0?O():R;R=void 0,m(r.scelto,N,P,Number(L.value))}),_.append(S,L,F),b.appendChild(_)}function v(){h.innerHTML="";let b=r.scelto==null?null:a.leggi(r.scelto);if(!b){let I=document.createElement("div");I.className="sc-vuoto",I.textContent="Nessun oggetto scelto. Cliccane uno nel gioco, o aprine un gruppo nella Gerarchia.",h.appendChild(I);return}let x=document.createElement("div");x.className="sc-titolo";let A=document.createElement("i");A.className="sc-pallino",A.style.background=o(b.tipo);let E=document.createElement("input");E.type="text",E.value=b.nome||"",E.placeholder=`#${b.id}`,E.style.flex="1",E.style.maxWidth="none",E.addEventListener("change",()=>m(b.id,"nome",b.nome||"",E.value)),x.append(A,E),h.appendChild(x);let M=i(b.tipo),O=document.createElement("div");O.className="sc-tipo",O.textContent=M?`${e(b.tipo)||b.tipo} \xB7 id ${b.id} \xB7 giro ${M.giro} \xB7 classe ${M.classe} \xB7 ingombro ${M.ingombro.join("\xD7")}${M.proiettaOmbra?" \xB7 fa ombra":""}`:`${b.tipo} \xB7 id ${b.id} \xB7 fuori catalogo`,h.appendChild(O);let N=document.createElement("div");N.className="sc-tre";for(let I of["x","y","z"]){let ut=document.createElement("label");ut.textContent=I;let ft=document.createElement("input");ft.type="number",ft.step="0.5",ft.value=b[I].toFixed(2),ft.addEventListener("change",()=>m(b.id,I,b[I],Number(ft.value))),ut.appendChild(ft),N.appendChild(ut)}h.appendChild(N),g(h,"giro",0,Math.PI*2,.01,()=>a.leggi(r.scelto).giro,"giro",I=>`${Math.round(I*180/Math.PI)}\xB0`),g(h,"scala",.1,4,.01,()=>a.leggi(r.scelto).scala,"scala");let z=document.createElement("div");z.className="sc-riga";let _=document.createElement("span");_.textContent="tinta";let S=document.createElement("input");S.type="color",S.value=Ua(Math.round(b.tinta[0]*255)<<16|Math.round(b.tinta[1]*255)<<8|Math.round(b.tinta[2]*255)),S.addEventListener("change",()=>{let I=parseInt(S.value.slice(1),16);m(b.id,"tinta",b.tinta,[(I>>16&255)/255,(I>>8&255)/255,(I&255)/255])}),z.append(_,S),h.appendChild(z);let L=document.createElement("div");L.className="sc-meta";let F=document.createElement("div");F.textContent="dati (chiave: valore, uno per riga)",F.style.opacity=".7";let R=document.createElement("textarea");R.value=Object.entries(b.dati||{}).map(([I,ut])=>`${I}: ${ut}`).join(`
`),R.addEventListener("change",()=>m(b.id,"meta",b.dati||{},ka(R.value))),L.append(F,R),h.appendChild(L);let P=document.createElement("div");if(P.className="sc-azioni",n){let I=document.createElement("button");I.type="button",I.textContent="\u2316 vai qui",I.addEventListener("click",()=>n(a.leggi(r.scelto))),P.appendChild(I)}let G=document.createElement("button");G.type="button",G.textContent="\u29C9 duplica",G.addEventListener("click",()=>{let I=a.leggi(r.scelto);I&&(r.scelto=a.aggiungi(I.tipo,I.x+1,I.y,I.z,{giro:I.giro,scala:I.scala,tinta:I.tinta,nome:I.nome,dati:I.dati}),c())});let U=document.createElement("button");U.type="button",U.className="rosso",U.textContent="\u2715 elimina",U.addEventListener("click",()=>{a.togli(r.scelto),r.scelto=null,c()}),P.append(G,U),h.appendChild(P)}return s.ispettore=v,v(),{aggiorna(){}}}},scegli(f){r.scelto=f,c()},get scelto(){return r.scelto}}}function ka(a){let t={};for(let o of String(a).split(`
`)){let e=o.indexOf(":");if(e<=0)continue;let i=o.slice(0,e).trim();i&&(t[i]=o.slice(e+1).trim())}return t}var Or,Ir,Va=Nt(()=>{Or=`
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
`,Ir=60});var Ya={};ge(Ya,{MANO_VUOTA:()=>ti,categorieDi:()=>Xa,filtra:()=>$a,registroCreativa:()=>Pr,voci:()=>Fr});function Fr({categorie:a,blocchi:t,catalogo:o,nomeArredo:e=null}){let i=[ti],n=new Set;for(let r of a)for(let s of r.blocchi){let c=t[s];if(!c||n.has(s))continue;n.add(s);let l=o&&o[c.modello||s];i.push({id:s,nome:c.nome||s,categoria:r.id,categoriaNome:r.nome,cosa:c.forma==="modello",cima:c.cima??c.colore??10066329,lato:c.lato??c.colore??7829367,ombra:l?l.proiettaOmbra:void 0})}for(let[r,s]of Object.entries(t))n.has(r)||(n.add(r),i.push({id:r,nome:e&&e(r)||s.nome||r,categoria:s.forma==="modello"?"cose":"altro",categoriaNome:s.forma==="modello"?"Cose":"Altro",cosa:s.forma==="modello",cima:s.cima??s.colore??10066329,lato:s.lato??s.colore??7829367}));return i}function Xa(a){let t=[],o=new Set;for(let e of a)e.categoria==="mano"||o.has(e.categoria)||(o.add(e.categoria),t.push({id:e.categoria,nome:e.categoriaNome||e.categoria}));return t}function $a(a,t,o){let e=String(o||"").trim().toLowerCase();return a.filter(i=>t&&i.categoria!==t&&i.categoria!=="mano"?!1:e?(i.nome||"").toLowerCase().includes(e)||String(i.id||"").toLowerCase().includes(e):!0)}function Pr({elenco:a,inMano:t,onPrendi:o}){let e=null,i="";return{chiave:"creativa",nome:"\u{1F392} Creativa",nota:"Tutto quello che si pu\xF2 avere in mano. Un clic e ce l'hai.",disegna(n){if(!document.getElementById("officina-creativa-stile")){let h=document.createElement("style");h.id="officina-creativa-stile",h.textContent=Nr,document.head.appendChild(h)}let r=document.createElement("div");r.className="cr-schede";let s=document.createElement("input");s.type="text",s.className="cr-cerca",s.placeholder="cerca\u2026";let c=document.createElement("div");c.className="cr-quante";let l=document.createElement("div");l.className="cr-griglia",n.append(r,s,c,l);let p=[{id:null,nome:"Tutto"},...Xa(a)].map(h=>{let m=document.createElement("button");return m.type="button",m.textContent=h.nome,m.addEventListener("click",()=>{e=h.id,f(),d()}),r.appendChild(m),{b:m,id:h.id}});function f(){for(let h of p)h.b.classList.toggle("acceso",h.id===e)}s.addEventListener("input",()=>{i=s.value,d()});function d(){let h=$a(a,e,i);if(c.textContent=`${h.length-(h[0]===ti?1:0)} cose`,l.innerHTML="",!h.length){let g=document.createElement("div");g.className="cr-vuoto",g.textContent="niente che si chiami cos\xEC",l.appendChild(g);return}let m=t();for(let g of h){let v=document.createElement("button");v.type="button",v.className="cr-cella"+(g.id===m?" scelta":""),v.title=g.id?`${g.nome} (${g.id})`:"mano vuota \u2014 rompi e interagisci";let b=document.createElement("i");if(b.className="cr-ico"+(g.id===null?" cr-vuota":g.cosa?" cr-cosa":""),g.id!==null){let A=document.createElement("b");A.className="cr-cima",A.style.background=Ga(g.cima);let E=document.createElement("b");E.className="cr-lato",E.style.background=Ga(g.lato),b.append(E,A)}let x=document.createElement("span");x.textContent=g.nome,v.append(b,x),v.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),o(g.id),d()}),l.appendChild(v)}}return f(),d(),{aggiorna(){}}}}}var Nr,ti,Ga,Ha=Nt(()=>{Nr=`
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
/* un oggetto col modello: tondo e a due tinte, cos\xEC NON si confonde con un blocco */
#officina .cr-ico.cr-cosa { border-radius: 50%; }
#officina .cr-ico.cr-cosa .cr-cima { inset: 0 0 50% 0; }
#officina .cr-ico.cr-cosa .cr-lato { inset: 50% 0 0 0; }
/* la mano vuota \xE8 un contorno e basta, che \xE8 esattamente quello che \xE8 */
#officina .cr-ico.cr-vuota { border: 2px dashed rgba(127,127,127,.6); background: none; }
#officina .cr-vuoto { padding: 10px; font-size: 11px; opacity: .7; }
#officina .cr-quante { font-size: 10.5px; opacity: .62; margin-bottom: 4px; }
`,ti={id:null,nome:"Mano vuota",categoria:"mano",cosa:!1,cima:null,lato:null};Ga=a=>"#"+(a>>>0&16777215).toString(16).padStart(6,"0")});function hi(a,{antialias:t=!0,dprMax:o=1.5}={}){let e=a.getContext("webgl2",{antialias:t,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!e)throw new Error("WebGL2 non disponibile");let i=Math.min(o,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(a.clientWidth*i)),s=Math.max(1,Math.round(a.clientHeight*i));return a.width!==r||a.height!==s?(a.width=r,a.height=s,e.viewport(0,0,r,s),!0):!1};return n(),{gl:e,dpr:i,ridimensiona:n}}function rt(a,t,o){let e=(n,r)=>{let s=a.createShader(n);if(a.shaderSource(s,r),a.compileShader(s),!a.getShaderParameter(s,a.COMPILE_STATUS))throw new Error(`shader: ${a.getShaderInfoLog(s)}
${r.split(`
`).map((c,l)=>`${l+1}: ${c}`).join(`
`)}`);return s},i=a.createProgram();if(a.attachShader(i,e(a.VERTEX_SHADER,t)),a.attachShader(i,e(a.FRAGMENT_SHADER,o)),a.linkProgram(i),!a.getProgramParameter(i,a.LINK_STATUS))throw new Error(`programma: ${a.getProgramInfoLog(i)}`);return i}function So(a){let t=a.getExtension("WEBGL_debug_renderer_info");return t?a.getParameter(t.UNMASKED_RENDERER_WEBGL):a.getParameter(a.RENDERER)}function st(a,t,o){return(Math.sign(a)+1)*9+(Math.sign(t)+1)*3+(Math.sign(o)+1)}var us=st(1,0,0),fs=st(-1,0,0),ps=st(0,1,0),ds=st(0,-1,0),hs=st(0,0,1),ms=st(0,0,-1);var ve=class{constructor(t=1024){this.byte=new Uint8Array(t*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(t){let o=(this.n+t)*12;if(o<=this.byte.length)return;let e=this.byte.length*2;for(;e<o;)e*=2;let i=new Uint8Array(e);i.set(this.byte),this.byte=i,this.u32=new Uint32Array(i.buffer)}vertice(t,o,e,i,n,r,s,c=0,l=0){let u=Math.round(t*16)+16,p=Math.round(e*16)+16,f=Math.round(o*16);if(u<0||u>511||p<0||p>511||f<0||f>65535)throw new RangeError(`vertice fuori dal chunk: ${t},${o},${e}`);if(i<0||i>26||i===13)throw new RangeError(`normale non valida: ${i}`);this._spazio(1);let d=this.n*3,h=this.byte,m=this.u32;m[d]=(u|p<<9|(i&31)<<18|(c&1)<<23|(l&15)<<24)>>>0,m[d+1]=(f|(n&15)<<16|(r&15)<<20)>>>0;let g=this.n*12+8;h[g]=s>>16&255,h[g+1]=s>>8&255,h[g+2]=s&255,h[g+3]=0,this.n++}quadDa(t,o,e,i){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[t,o,e,i])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function mi(a=16384){let t=new Uint16Array(a*6);for(let o=0,e=0,i=0;o<a;o++,i+=4)t[e++]=i,t[e++]=i+1,t[e++]=i+2,t[e++]=i,t[e++]=i+2,t[e++]=i+3;return t}function gi(a,t,o,e){let i=1/Math.tan(a/2),n=1/(o-e);return new Float32Array([i/t,0,0,0,0,i,0,0,0,0,(e+o)*n,-1,0,0,2*e*o*n,0])}function Ro(a,t,o){let e=1/(o-t);return new Float32Array([1/a,0,0,0,0,1/a,0,0,0,0,-2*e,0,0,0,-(o+t)*e,1])}function Ue(a,t,o=[0,1,0]){let e=a[0]-t[0],i=a[1]-t[1],n=a[2]-t[2],r=Math.hypot(e,i,n)||1;e/=r,i/=r,n/=r;let s=o[1]*n-o[2]*i,c=o[2]*e-o[0]*n,l=o[0]*i-o[1]*e;r=Math.hypot(s,c,l)||1,s/=r,c/=r,l/=r;let u=i*l-n*c,p=n*s-e*l,f=e*c-i*s;return new Float32Array([s,u,e,0,c,p,i,0,l,f,n,0,-(s*a[0]+c*a[1]+l*a[2]),-(u*a[0]+p*a[1]+f*a[2]),-(e*a[0]+i*a[1]+n*a[2]),1])}function vi(a,t=new Float32Array(16)){let[o,e,i,n,r,s,c,l,u,p,f,d,h,m,g,v]=a,b=o*s-e*r,x=o*c-i*r,A=o*l-n*r,E=e*c-i*s,M=e*l-n*s,O=i*l-n*c,N=u*m-p*h,z=u*g-f*h,_=u*v-d*h,S=p*g-f*m,L=p*v-d*m,F=f*v-d*g,R=b*F-x*L+A*S+E*_-M*z+O*N;return R?(R=1/R,t[0]=(s*F-c*L+l*S)*R,t[1]=(i*L-e*F-n*S)*R,t[2]=(m*O-g*M+v*E)*R,t[3]=(f*M-p*O-d*E)*R,t[4]=(c*_-r*F-l*z)*R,t[5]=(o*F-i*_+n*z)*R,t[6]=(g*A-h*O-v*x)*R,t[7]=(u*O-f*A+d*x)*R,t[8]=(r*L-s*_+l*N)*R,t[9]=(e*_-o*L-n*N)*R,t[10]=(h*M-m*A+v*b)*R,t[11]=(p*A-u*M-d*b)*R,t[12]=(s*z-r*S-c*N)*R,t[13]=(o*S-e*z+i*N)*R,t[14]=(m*x-h*E-g*b)*R,t[15]=(u*E-p*x+f*b)*R,t):null}function be(a,t,o=new Float32Array(16)){for(let e=0;e<4;e++)for(let i=0;i<4;i++)o[e*4+i]=a[i]*t[e*4]+a[4+i]*t[e*4+1]+a[8+i]*t[e*4+2]+a[12+i]*t[e*4+3];return o}function Lo(a,t=new Float32Array(24)){let o=c=>[a[c],a[4+c],a[8+c],a[12+c]],e=o(0),i=o(1),n=o(2),r=o(3),s=[[r[0]+e[0],r[1]+e[1],r[2]+e[2],r[3]+e[3]],[r[0]-e[0],r[1]-e[1],r[2]-e[2],r[3]-e[3]],[r[0]+i[0],r[1]+i[1],r[2]+i[2],r[3]+i[3]],[r[0]-i[0],r[1]-i[1],r[2]-i[2],r[3]-i[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let c=0;c<6;c++){let[l,u,p,f]=s[c],d=Math.hypot(l,u,p)||1;t[c*4]=l/d,t[c*4+1]=u/d,t[c*4+2]=p/d,t[c*4+3]=f/d}return t}function Oo(a,t,o,e,i,n,r){for(let s=0;s<6;s++){let c=a[s*4],l=a[s*4+1],u=a[s*4+2],p=a[s*4+3],f=c>0?i:t,d=l>0?n:o,h=u>0?r:e;if(c*f+l*d+u*h+p<0)return!1}return!0}var vn=`#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale vento materia \xB7 B: y cielo blocco (nucleo/formato.js)
layout(location = 1) in uvec4 aC;   // r g b 0
uniform mat4 uVP;
uniform vec3 uChunk;
uniform float uTempo;
uniform vec3 uSoleVerso;      // da dove ARRIVA la luce (verso il basso)
uniform float uSoleForza;
uniform vec4 uMaterie[16];    // per materia: emissione, brillio, riflesso, (libero)
uniform vec2 uNebbia;
uniform vec3 uCam;
flat out vec3 vBase;          // il colore cotto, lineare
flat out float vSole;         // quanto sole prende la faccia, a bande (l'horizon map lo pu\xF2 togliere)
flat out float vEmis;         // materia emissiva
flat out float vCielo;        // il cielo \xE8 PER FACCIA (la regola di Leafy: niente sfumature sui solidi)
flat out float vFaccia;       // 1 = la faccia guarda il sole, 0 = \xE8 di spalle (sui blocchi: sempre 1)
flat out vec3 vN;             // la normale geometrica: serve alla mappa d'ombra per non avere acne
flat out vec3 vOmbra;         // il colore d'ombra stilizzato (hue shift verso il blu), lineare
out float vBlocco;            // la luce di blocco sfuma: le pozze dei lampioni sono tonde
out float vNebbia;
out vec3 vPos;
// \u26A0 L'OMBRA DI LEAFY NON \xC8 \xABPI\xD9 SCURO\xBB: \xE8 lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' pi\xF9 satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: \xABle ombre sono solo il colore
// hue shift pi\xF9 scuro stilizzato\xBB.
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y), e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
uniform vec3 uStile;   // spostamento di tinta verso il blu, saturazione, valore (resa.stile: l'Officina li muove)
vec3 ombraStile(vec3 s) {
  vec3 h = rgb2hsv(s);
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via pi\xF9 corta verso il blu
  // \u26A0 MISURATO SULLE CONCEPT: il terracotta si sposta appena (3 %: #e59b69 \u2192
  // #bf704b), il verde molto di pi\xF9 (15 %: #5ac550 \u2192 #34974c). I colori caldi
  // (tinta sotto i 40\xB0) prendono un quinto dello spostamento.
  float caldo = 1.0 - smoothstep(0.11, 0.25, h.x);
  float freddo = smoothstep(0.42, 0.55, h.x);   // i verdi-petrolio e i blu (la chioma dell'albero) restano loro: viravano al ciano
  h.x = fract(h.x + d * uStile.x * mix(1.0, 0.2, caldo) * mix(1.0, 0.35, freddo));
  h.y = min(1.0, h.y * uStile.y + 0.03);
  h.z *= uStile.z;
  return hsv2rgb(h);
}
void main() {
  // \u26A0 POSIZIONI IN SEDICESIMI (nucleo/formato.js): x e z con un blocco di margine, y dallo scarto del chunk
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  uint ni = (A >> 18u) & 31u;
  uint vento = (A >> 23u) & 1u;
  uint materia = (A >> 24u) & 15u;
  if (vento == 1u) {   // la cima di un filo d'erba ondeggia
    float f = sin(uTempo * 1.7 + p.x * 0.9 + p.z * 1.3);
    p.x += f * 0.18; p.z += cos(uTempo * 1.1 + p.z * 0.7 + p.x * 0.4) * 0.12;
  }
  // la normale a 27: facce, smussi e angoli del supercubo
  vec3 n = normalize(vec3(float(ni / 9u) - 1.0, float((ni / 3u) % 3u) - 1.0, float(ni % 3u) - 1.0));
  vCielo = float((B >> 16u) & 15u) / 15.0;
  vBlocco = float((B >> 20u) & 15u) / 15.0;
  // \u26A0 IL COLORE \xC8 QUELLO COTTO DAL MESHER (la palette di Leafy), in spazio lineare
  vBase = pow(vec3(aC.xyz) / 255.0, vec3(2.2));
  vOmbra = pow(ombraStile(vec3(aC.xyz) / 255.0), vec3(2.2));
  vEmis = uMaterie[materia].x;
  // \u26A0 LA LUCE \xC8 A DUE BANDE PER DIREZIONE DEL SOLE, come nel cel shading: una
  // faccia che guarda il sole ha il colore pieno, una di spalle ha il colore
  // d'ombra \u2014 lo STESSO di chi sta nell'ombra portata. Non \xE8 lo shading di
  // Minecraft (che scurisce i lati sempre, per convenzione): due oggetti dello
  // stesso colore hanno lo stesso colore, e cambia solo chi \xE8 al sole o in
  // ombra. Senza questo tutto era piatto (\xABcome se tutto fosse piatto\xBB).
  // \u26A0 DUE TINTE E BASTA, MISURATE SULLE CONCEPT: il fianco al sole dell'isola
  // \xE8 #e69c67, quello di spalle #bf6f4b (lo stesso colore, tinta spostata,
  // pi\xF9 scuro). Niente mezza banda: era quella, sugli smussi, il \xABleggero
  // face shading a bordo dei blocchi\xBB. Uno smusso a 45\xB0 cade sempre nella
  // tinta di una delle due facce vicine, e non fa riga.
  vFaccia = dot(n, -uSoleVerso) > 0.0 ? 1.0 : 0.0;
  vN = n;
  vSole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  float d = distance(p, uCam);
  vNebbia = clamp((d - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,bi=`#version 300 es
precision mediump float;
precision mediump sampler2D;
flat in vec3 vBase;
flat in float vSole;
flat in float vEmis;
flat in float vCielo;
flat in float vFaccia;
flat in vec3 vN;
flat in vec3 vOmbra;
in float vBlocco;
in float vNebbia;
in highp vec3 vPos;   // \u26A0 highp: l'ombra si legge a coordinate di mondo (\xB1256), in mediump ballerebbe di un quarto di blocco

uniform vec3 uNebbiaCol;
uniform vec3 uSoleCol;
uniform vec3 uCieloCol;          // il colore dell'ombra: \xC8 il cielo
uniform float uOmbra;            // 1 = ombra del sole accesa
uniform highp float uSoleForza;  // \u26A0 highp come nel vertex, o il link fallisce (\xABprecisions differ\xBB)
uniform highp float uTaglio;     // sotto questa quota non si disegna (la passata dello specchio)
// \u26A0 STESSA PRECISIONE DEL VERTEX: un uniform condiviso fra i due shader deve
// avere la stessa precisione, o il link fallisce (\xABprecisions differ\xBB).
uniform highp vec3 uSoleVerso;
uniform sampler2D uOmbre;        // la mappa delle ombre: quota d'ombra per colonna (Resa._calcolaOmbre)
uniform vec2 uOmbreScala;        // come si decodifica: quota = r * x + y
uniform highp vec4 uAltRett;           // x0, z0, 1/larghezza, 1/profondita
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI pi\xF9 vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// \u26A0 LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni (\xABesagonale\xBB).
// La luce cotta resta come MASCHERA (dietro un muro non si passa) e per le
// lampade-blocco, che non stanno nella lista.
uniform sampler2D uAltezze;   // la mappa delle altezze (cima di ogni colonna + 1), per l'ombra della lampada
// \u26A0 L'OMBRA DELLA LAMPADA SI CAMMINA CELLA PER CELLA (Amanatides\u2013Woo, la
// traversata dei voxel in due dimensioni): dal punto si va verso la lanterna
// (a 2,6 di quota) attraversando le colonne della mappa delle altezze una per
// una, e ci si ferma sulla prima che sta sopra il raggio.
// \u26A0 NON a passi fissi: con dodici passi uguali il bordo dell'ombra cadeva
// DOVE CAPITAVA IL PASSO, non sul bordo del blocco, ed era seghettato (\xABl'ombra
// \xE8 seghettata quadrata non va bene\xBB). Camminando i confini delle celle il
// taglio \xE8 esattamente il profilo del blocco, dritto, e le letture sono meno:
// una per cella attraversata, al massimo quattordici (il raggio \xE8 4,6).
float ombraLampada(highp vec3 pos, highp vec3 L) {
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 prossimo = (cella + max(verso, vec2(0.0)) - pos.xz) / (verso * mod_);   // quanto manca al confine
  highp vec2 quanto = 1.0 / mod_;                    // e quanto da un confine al prossimo
  for (int i = 0; i < 14; i++) {
    highp float t = min(prossimo.x, prossimo.y);
    if (t >= lungo) break;                           // arrivati alla lanterna: niente in mezzo
    if (prossimo.x < prossimo.y) { cella.x += verso.x; prossimo.x += quanto.x; }
    else { cella.y += verso.y; prossimo.y += quanto.y; }
    highp float y = pos.y + (L.y - pos.y) * (t / lungo);
    // \u26A0 IL CANALE G: il solido VERO. Col canale R (la silhouette, chioma
    // compresa) un albero metteva davanti alla lampada un disco di colonne
    // alte quattro \u2014 cio\xE8 un ostacolo squadrato, e l'ombra che ne usciva era
    // \xABun'ombra quadrata delle luci\xBB. Un albero adesso non fa ombra alla
    // lampada: \xE8 meno sbagliato di una che non somiglia a lui, e la sua ombra
    // vera dal sole ce l'ha gi\xE0 dalla mappa d'ombra (che \xE8 per forma).
    float h = texture(uAltezze, (cella + 0.5 - uAltRett.xy) * uAltRett.zw).g * 255.0;
    if (h > y + 0.05 && h > pos.y + 0.6) return 0.0;
  }
  return 1.0;
}
float pozza(highp vec3 pos, float cotto) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // \u26A0 TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    s += anello * ombraLampada(pos, uLampade[i].xyz + vec3(0.0, 2.6, 0.0));
  }
  return min(s, 1.0);
}
uniform highp vec4 uBuco;        // il buco di visuale della terza persona: il giocatore (xyz) e il raggio (0 = spento)
uniform highp vec3 uOcchio;      // da dove guarda la camera
uniform highp sampler2DShadow uMappaStat;   // la mappa d'ombra FERMA: terreno, lampioni, alberi (si rif\xE0 quando serve)
uniform highp sampler2DShadow uMappaDin;    // quella di chi si muove (gatto, corpi): ogni fotogramma, piccola
uniform highp mat4 uLuceVP;                 // mondo \u2192 clip del sole
uniform float uMappaOn;                     // 1 = la mappa vale
uniform vec2 uMappaSbieco;                  // x: scostamento lungo la normale (blocchi), y: bias di profondit\xE0 (clip 0..1)
// \u26A0 LA MAPPA D'OMBRA VERA (Resa._aggiornaMappa): profondit\xE0 vista dal sole,
// quindi l'ombra ha la FORMA della cosa \u2014 il palo del lampione, il gatto, la
// chioma \u2014 non della colonna. Il confronto lo fa la texture (sampler2DShadow,
// 2\xD72 in hardware: bordo netto ma senza scalini); lo scostamento lungo la
// normale e il bias tolgono l'acne. Fuori dalla mappa torna -1 e si usa la
// mappa per colonna (ombraSole), che copre tutto il mondo in streaming.
uniform highp mat4 uLuceVPDin;              // mondo \u2192 clip della mappa di chi si muove (pi\xF9 stretta: pi\xF9 fitta)
uniform vec2 uMappaTexel;                   // mezzo texel delle due mappe, in uv
// \u26A0 QUATTRO LETTURE A MEZZO TEXEL E POI UNA SOGLIA: il bordo resta netto ma
// senza scalini (le ombre \xABpixellate\xBB). Ogni lettura \xE8 gi\xE0 un 2\xD72 in hardware.
float pcf(highp sampler2DShadow m, highp vec3 c, float t) {
  return 0.25 * (texture(m, c + vec3(-t, -t, 0.0)) + texture(m, c + vec3(t, -t, 0.0)) + texture(m, c + vec3(-t, t, 0.0)) + texture(m, c + vec3(t, t, 0.0)));
}
float ombraMappa(highp vec3 pos, vec3 n) {
  if (uMappaOn < 0.5) return -1.0;
  highp vec3 p = pos + n * uMappaSbieco.x;
  highp vec4 q = uLuceVP * vec4(p, 1.0);
  highp vec3 u = q.xyz * 0.5 + 0.5;
  if (u.x < 0.004 || u.x > 0.996 || u.y < 0.004 || u.y > 0.996 || u.z > 1.0) return -1.0;
  float s = pcf(uMappaStat, vec3(u.xy, u.z - uMappaSbieco.y), uMappaTexel.x);
  highp vec4 q2 = uLuceVPDin * vec4(p, 1.0);
  highp vec3 u2 = q2.xyz * 0.5 + 0.5;
  if (u2.x > 0.002 && u2.x < 0.998 && u2.y > 0.002 && u2.y < 0.998 && u2.z <= 1.0) s = min(s, pcf(uMappaDin, vec3(u2.xy, u2.z - uMappaSbieco.y), uMappaTexel.y));
  return smoothstep(0.3, 0.7, s);
}
out vec4 colore;
// \u26A0 L'OMBRA DEL SOLE \xC8 UNA LETTURA SOLA: la mappa delle ombre (uOmbre, per
// colonna: la quota sotto cui si \xE8 in ombra, calcolata dalla GPU quando il sole
// si sposta, vedi Resa._calcolaOmbre) letta mezzo blocco VERSO il sole (cos\xEC
// una parete al sole legge la colonna davanti, non la propria) e confrontata
// con la quota del pixel con una soglia netta: cel shading, niente acne,
// niente puntini, niente penombra sbavata.
float ombraSole(highp vec3 pos) {
  vec2 dir = -uSoleVerso.xz; float l = length(dir); dir = l > 1e-4 ? dir / l : vec2(0.0);
  highp vec2 uv = (pos.xz + dir * 0.5 - uAltRett.xy) * uAltRett.zw;
  float hs = texture(uOmbre, uv).r * uOmbreScala.x + uOmbreScala.y;
  return 1.0 - smoothstep(-0.04, 0.04, hs - (pos.y + 0.03));
}
void main() {
  if (vPos.y < uTaglio) discard;   // lo specchio non guarda sott'acqua
  if (uBuco.w > 0.0) {
    vec3 seg = uBuco.xyz - uOcchio; float lung = length(seg); vec3 dir = seg / lung;
    float t = dot(vPos - uOcchio, dir);
    if (t > 0.0 && t < lung - 0.35 && length(vPos - uOcchio - dir * t) < uBuco.w) discard;
  }
  float luce = vFaccia;
  if (uOmbra > 0.5 && luce > 0.0) { float m = ombraMappa(vPos, vN); luce *= m >= 0.0 ? m : ombraSole(vPos); }
  // le bande: il cielo a quattro (per faccia), la lampada a quattro (sulla luce
  // interpolata: pozze tonde), il sole diretto solo dove il cielo \xE8 pieno
  float cieloB = floor(vCielo * 4.0 + 0.5) / 4.0;
  // \u26A0 LA LUCE DEI LAMPIONI \xC8 SOLO LA POZZA per pixel: tre cerchi netti, tagliati
  // dall'ostacolo (ombraLampada). Le bande della luce COTTA (floor(vBlocco*4))
  // NON si sommano pi\xF9: la cottura gira attorno ai muri per inondazione e
  // dietro un cubo faceva gradini di luce che non erano l'ombra del lampione
  // (\xABi cerchi hanno un'ombra che non \xE8 normale\xBB). vBlocco resta nel vertice.
  // \u26A0 DI GIORNO I CERCHI RESTANO, in trasparenza (45 %): come i lampioni accesi di Leafy
  float notte = mix(0.45, 1.0, 1.0 - smoothstep(0.30, 0.75, uSoleForza));
  float lamp = pozza(vPos, vBlocco) * notte;
  float sole = vSole * step(0.99, vCielo) * luce;
  // l'ombra: il colore stilizzato (hue shift), tinto dal giorno/notte, pi\xF9 scuro senza cielo
  vec3 ombra = vOmbra * uCieloCol * (0.30 + 0.70 * cieloB);
  vec3 pieno = vBase * uSoleCol;
  if (vEmis > 0.0) { ombra = mix(ombra, vBase * 1.15, vEmis); pieno = mix(pieno, vBase * 1.15, vEmis); }   // emissiva: scavalca ombra e notte
  // \u26A0 LE POZZE DEI LAMPIONI SONO CALDE E PIENE: 1,3 sopra il bianco
  vec3 c = mix(ombra, pieno, sole) + vBase * vec3(1.30, 1.02, 0.58) * lamp;
  // \u26A0 I CONTI SONO IN SPAZIO LINEARE: qui si torna in sRGB, o tutto esce scuro e saturo.
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, 1.0);
}`,bn=`#version 300 es
precision highp float;
layout(location = 0) in uvec2 aAB;  // A: x z normale cima \xB7 B: y prof livello
layout(location = 1) in uvec4 aC;   // r g b 0
uniform mat4 uVP;
uniform vec3 uChunk;
uniform float uTempo;
uniform vec3 uCam;
uniform vec2 uNebbia;
out vec3 vPos;
out vec3 vCol;
out float vProf;
out float vNebbia;
flat out float vPelo;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  uint normale = (A >> 18u) & 31u;
  bool cima = ((A >> 23u) & 1u) == 1u;   // vertice in cima alla cella: il pelo, o l'orlo di una parete
  float prof = float((B >> 16u) & 15u);
  float liv = float((B >> 20u) & 15u);
  // il pelo: peloDi() di world/pelo.js, e un'onda piccola (moto 0,018 del lago)
  if (cima) p.y -= (1.0 + 2.0 * liv) / 16.0;
  p.y += 0.035 * sin(uTempo * 1.3 + p.x * 0.7 + p.z * 0.9) + 0.02 * sin(uTempo * 2.1 - p.z * 1.7);
  vPos = p;
  vCol = pow(vec3(aC.xyz) / 255.0, vec3(2.2));
  vProf = prof;
  vPelo = normale == 16u ? 1.0 : 0.0;   // 16 = (0, +1, 0) nell'indice a 27
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  gl_Position = uVP * vec4(p, 1.0);
}`,xn=`#version 300 es
// \u26A0 highp come il vertex: gli uniform sono condivisi e la precisione deve coincidere
precision highp float;
in vec3 vPos;
in vec3 vCol;
in float vProf;
in float vNebbia;
flat in float vPelo;
uniform vec3 uCam;
uniform vec3 uSoleVerso;
uniform vec3 uSoleCol;
uniform float uSoleForza;
uniform vec3 uCieloCol;
uniform vec3 uNebbiaCol;
uniform float uTempo;
uniform sampler2D uSpecchio;     // la scena specchiata, a mezza risoluzione
uniform vec3 uSchermo;           // 1/larghezza, 1/altezza, forza dello specchio (0 = spento)
// \u26A0 CHI GALLEGGIA: **[x, z, mezzoX, mezzoZ]** per otto \u2014 l'IMPRONTA, non un
// raggio. Era [x, y, z, raggio], e la y non la leggeva nessuno: un centro e un
// raggio sono un cerchio, e con un cerchio qualunque mesh entri in acqua fa
// sempre lo stesso segno. Le due mezze misure lasciano alla schiuma la forma
// della cosa che la fa.
// \u26A0 E LE MISURE SI RESTRINGONO A ZERO quando il galleggiante esce dalla
// finestra (partita.js): \xABflickerer\xE0 tantissimo\xBB \u2014 e sarebbe successo, perch\xE9
// gli otto pi\xF9 vicini cambiano di continuo e un galleggiante che esce dalla
// lista spariva di colpo. Rimpicciolendosi, se ne va senza che si veda.
uniform highp vec4 uGalleggianti[8];
uniform int uNGalleggianti;
uniform sampler2D uAltezze;      // la cima solida di ogni colonna (+1) / 255: dice dov'\xE8 la riva
uniform highp vec4 uAltRett;     // x0, z0, 1/larghezza, 1/profondita
out vec4 colore;
// \u26A0 LA RIVA NON \xC8 LA PROFONDIT\xC0: un lago basso \xE8 basso dappertutto, e a
// misurarla con vProf la schiuma copriva tutto lo specchio d'acqua. La riva
// \xE8 \xABdi qui c'\xE8 TERRA PI\xD9 ALTA a meno di un passo\xBB, e la dice la mappa delle
// altezze: sei letture attorno al pixel, su un raggio che respira.
// \u26A0 IL CONFRONTO \xC8 FRA CIME DI CELLA, non fra quote esatte: il pelo sta un po'
// sotto il bordo della sua cella (peloDi) e ondeggia, quindi con una soglia
// sulla y vera la sabbia allo stesso livello dell'acqua \u2014 cio\xE8 LA RIVA \u2014 non
// contava. La cima della cella d'acqua \xE8 floor(y) + 1: \xE8 terra tutto ci\xF2 che
// arriva lass\xF9 o pi\xF9 su.
// \u26A0 NIENTE LETTERE ACCENTATE NEI NOMI GLSL (si chiamava terraL\xEC): il programma
// non compila, l'eccezione ferma tutto e la pagina non parte proprio.
float terraLi(highp vec2 q, float cima) {
  highp vec2 uv = (q - uAltRett.xy) * uAltRett.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  // \u26A0 IL CANALE G: il solido VERO, senza la chioma degli alberi. Col canale R
  // (la silhouette per il sole) un albero con la punta nell'acqua faceva
  // tredici colonne di riva finta attorno a se': \xABcreano tantissima schiuma in
  // acqua anche se vedi solo la punta o solo il tronco\xBB.
  // \u26A0 E QUI LA LETTURA \xC8 LINEARE (il sampler dell'unit\xE0 2, vedi disegnaAcqua),
  // quindi l'altezza fra due colonne \xE8 interpolata invece che a scalini. Con la
  // lettura secca ogni assaggio dava 0 o 1 di scatto sul bordo del texel, e il
  // bordo della schiuma \u2014 per quanto netto lo si tagliasse \u2014 era fatto di
  // segmenti allineati alla griglia: quadrati. Con l'altezza interpolata e uno
  // smoothstep stretto l'assaggio \xE8 continuo, e il taglio netto che viene dopo
  // cade su una curva vera. Netto NON vuol dire a quadretti.
  float h = texture(uAltezze, uv).g * 255.0;
  return smoothstep(cima - 0.85, cima - 0.15, h);
}
float riva(highp vec3 pos, float onda) {
  // \u26A0 SENZA MARGINE: il pelo sta SEMPRE un po' SOTTO la cima della sua cella
  // (peloDi toglie almeno 1/16, l'onda al massimo 0,055), quindi floor(y) \xE8 la
  // base della cella d'acqua. Un +0,1 \xABdi sicurezza\xBB la faceva saltare alla
  // cella di sopra e la riva non contava mai: schiuma zero.
  float cima = floor(pos.y) + 1.0;
  // \u26A0 SI FA LA MEDIA DI SEDICI ASSAGGI, NON IL MASSIMO DI SEI. La mappa delle
  // altezze ha un texel per colonna: con un test s\xEC/no il bordo della schiuma
  // cade sul bordo del TEXEL, cio\xE8 fa una scaletta di blocchi interi \u2014 \xABal
  // bordo \xE8 seghettata, orribile\xBB. \xC8 parente stretto del difetto gi\xE0 pagato
  // con l'ombra della lampada (\xABseghettata quadrata\xBB), e la cura \xE8 la stessa
  // in spirito: smettere di leggere una griglia come se fosse un contorno.
  // Mediando sedici assaggi il valore diventa CONTINUO (diciassette
  // gradazioni) e il bordo si taglia dove si vuole con uno smoothstep, invece
  // di ereditare la griglia; le direzioni ruotano con l'onda, cos\xEC il taglio
  // non \xE8 mai lo stesso due volte e non si legge come un cerchio di compasso.
  // \u26A0 E I RAGGI SONO PI\xD9 CORTI di prima (era 0,78 fisso): \xABun pochino troppo
  // spessa\xBB. Adesso la fascia sta attorno a mezzo blocco.
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7854 + onda * 0.6;   // quarantacinque gradi, e ruotano
    vec2 dir = vec2(cos(a), sin(a));
    s += terraLi(pos.xz + dir * (0.35 + onda * 0.5), cima);
    s += terraLi(pos.xz + dir * (0.75 + onda * 0.8), cima);
  }
  return s * 0.0625;
}
/**
 * \u26A0 IL CAMPO \xC8 CONTINUO, IL TAGLIO NO \u2014 e la distinzione \xE8 tutta qui.
 *
 * Il committente: \xABla schiuma non \xE8 netta come quella che volevo, senza
 * sfumature fuori stile\xBB. Ha ragione, ed \xE8 la regola della casa scritta dal
 * primo giorno: **l'ombra \xE8 un gradino, non una rampa**. Una schiuma sfumata \xE8
 * il rendering di qualcun altro.
 *
 * Ma \xABnetta\xBB e \xABnon seghettata\xBB non sono in contraddizione, e crederlo \xE8
 * l'errore: la scaletta veniva dal CAMPO (sedici assaggi s\xEC/no su una griglia
 * di un texel per colonna), non dal taglio. Un campo continuo tagliato con un
 * gradino d\xE0 un bordo NETTO che segue il contorno vero della riva; un campo a
 * gradini, comunque lo si tagli, d\xE0 una scaletta di blocchi. Quindi: media per
 * il campo, gradino per il bordo.
 *
 * \u26A0 E DUE BANDE, non una \u2014 come le pozze dei lampioni e come l'ombra a tre
 * bande: una risacca piena attaccata alla riva e una pi\xF9 magra fuori. Una
 * banda sola si legge come un contorno disegnato col pennarello.
 * Il mezzo texel di smoothstep e' solo antialiasing, come nella mappa d'ombra
 * (smoothstep 0.3 - 0.7): a occhio e' un gradino.
 *
 * \u26A0 E NIENTE BACKTICK IN QUESTO COMMENTO: sta dentro un template literal di
 * JavaScript, quindi un backtick lo CHIUDE e il file non si carica proprio.
 * Ci sono appena ricascato scrivendo questa nota. C'e' un test apposta
 * (test/glsl-backtick.test.mjs) e serve.
 */
float aGradini(float v, float soglia) {
  return smoothstep(soglia - 0.03, soglia + 0.03, v);
}
/**
 * L'anello attorno a chi galleggia \u2014 e SEGUE L'IMPRONTA, non un cerchio.
 *
 * \u26A0 \xABNon rappresenta per niente la forma dell'oggetto a seconda della mesh che
 * entra dinamicamente\xBB: giusto, e la causa stava nei dati, non qui. Gli otto
 * galleggianti portavano un centro e UN RAGGIO \u2014 cio\xE8 un cerchio, e qualunque
 * cosa entrasse in acqua faceva sempre un cerchio. Adesso portano le due
 * mezze misure dell'impronta, e questa \xE8 la distanza da un rettangolo
 * arrotondato: un cubo fa una schiuma squadrata, il gatto una ovale allungata
 * come lui.
 */
float anelloForma(highp vec2 p, highp vec2 centro, highp vec2 mezzo, float onda) {
  highp vec2 q = abs(p - centro) - mezzo;
  float d = length(max(q, vec2(0.0))) + min(max(q.x, q.y), 0.0);
  float x = d + onda * 0.5;
  // \u26A0 DUE ANELLI NETTI, non una ghirlanda sfumata: dentro pieno, fuori magro,
  // e in mezzo un gradino. Il mezzo texel \xE8 antialiasing, non una rampa.
  float dentro = smoothstep(0.16, 0.13, x) * smoothstep(-0.16, -0.13, x);
  float fuori = smoothstep(0.30, 0.27, x) * smoothstep(-0.20, -0.17, x);
  return max(dentro, fuori * 0.55);
}
void main() {
  vec3 vista = normalize(uCam - vPos);
  float lontano = distance(uCam, vPos);
  // \u26A0 LA NORMALE VIENE DALLE SOLE ONDE LUNGHE, ed \xE8 una lezione gi\xE0 pagata sul
  // lato Babylon (CLAUDE.md: \xABle increspature fini facevano un riflesso
  // "casuale" e brillii a coriandoli guardando il sole\xBB) che qui non era mai
  // arrivata. Le frequenze erano 2,3 e 1,9 sul mondo, cio\xE8 un motivo che si
  // RIPETE OGNI 2,7 BLOCCHI: guardando il lago verso il sole si vedeva la
  // stessa piega tornare a intervalli regolari \u2014 il \xABtiling tutto ripetuto\xBB
  // del committente. Adesso 0,24 e 0,22: periodo ventisei blocchi, che a
  // schermo non torna mai due volte.
  float o1 = sin(uTempo * 0.50 + vPos.x * 0.24 + vPos.z * 0.10);
  float o2 = cos(uTempo * 0.37 - vPos.x * 0.09 + vPos.z * 0.22);
  vec3 n = vPelo > 0.5 ? normalize(vec3(0.055 * o1, 1.0, 0.055 * o2)) : vec3(0.0, 1.0, 0.0);
  // profondit\xE0 \u2192 violaceo e opaco (scala 0,12 per blocco, corpo come la ricetta)
  float k = clamp(vProf * 0.12, 0.0, 1.0);
  vec3 viola = pow(vec3(0.38, 0.30, 0.62), vec3(2.2));
  vec3 acqua = mix(vCol, viola, k * 0.75);
  float alfa = mix(0.34, 0.88, k);
  // il sole: la luce sul pelo, a gradino (prima del riflesso: il riflesso ha gi\xE0 la sua luce)
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  acqua *= mix(uCieloCol * 0.7, uSoleCol, sole * 0.85);
  // il cielo capovolto: fresnel verso il colore del cielo (la nebbia \xC8 il cielo all'orizzonte)
  float fres = pow(1.0 - max(dot(n, vista), 0.0), 3.0);
  vec3 cielo = pow(uNebbiaCol, vec3(2.2));
  // \u26A0 LO SPECCHIO SI LEGGE A SCHERMO: la passata specchiata usa la stessa
  // proiezione, quindi il riflesso di questo pixel sta in questo pixel. Le
  // onde lo spostano di un soffio (n.xz), che \xE8 quanto basta a farlo vivere.
  // \u26A0 E LA DEFORMAZIONE CALA CON LA DISTANZA. Era 0,16 dello SCHERMO, fissa:
  // sedici per cento della larghezza dello schermo, uguale a due metri e a
  // ottanta. Da vicino \xE8 troppa; da lontano, dove quei ventisei blocchi di
  // periodo stanno in pochi pixel, diventa un tremolio ad altissima frequenza
  // \u2014 la \xABdistorsione strana\xBB. Legandola alla distanza lo spostamento resta
  // costante nel MONDO invece che sullo schermo, ed \xE8 quello che vuole
  // l'occhio. Il tetto \xE8 il 3 % (CLAUDE.md dice 3-10 %: qui il riflesso \xE8 gi\xE0
  // a mezza risoluzione, e oltre si vede sfocare).
  float sfumaOnda = 8.0 / (8.0 + lontano);
  vec2 uv = clamp(gl_FragCoord.xy * uSchermo.xy + n.xz * 0.03 * sfumaOnda * vPelo, 0.002, 0.998);
  vec3 riflesso = mix(cielo, pow(texture(uSpecchio, uv).rgb, vec3(2.2)), uSchermo.z);
  // \u26A0 IL CIELO CAPOVOLTO SOLO RADENTE quando non c'\xE8 specchio: a 45\xB0 il fresnel
  // cubico vale il 2%. Con lo specchio il riflesso c'\xE8 sempre un po' (22%) e
  // radente \xE8 quasi tutto (85%): l'acqua resta acqua guardandola dall'alto.
  float peso = mix(fres * 0.55, mix(0.22, 0.85, fres), uSchermo.z) * vPelo;
  acqua = mix(acqua, riflesso, peso);
  alfa = mix(alfa, 0.95, fres * vPelo);
  float brillio = step(0.985, dot(reflect(-vista, n), -uSoleVerso)) * uSoleForza * vPelo;
  acqua += vec3(0.9) * brillio;
  // \u26A0 LA SCHIUMA: alla riva (dove il fondo \xE8 alto, vProf piccola) e attorno a
  // chi galleggia. Solo sul pelo, e sopra a tutto il resto (anche al riflesso):
  // \xE8 il segno che l'acqua tocca qualcosa, e in Leafy \xE8 quello che d\xE0 vita.
  float onda = 0.13 * sin(uTempo * 1.5 + vPos.x * 1.9 + vPos.z * 1.1) + 0.08 * sin(uTempo * 2.3 - vPos.x * 1.3 + vPos.z * 2.7);
  // \u26A0 DUE BANDE NETTE alla riva: piena attaccata a terra, magra un passo fuori.
  // \u26A0 LE SOGLIE SONO CONTATE, non a occhio. A distanza d da una riva dritta la
  // quota di assaggi che cadono a terra vale acos(d/r)/pi per anello: con
  // raggi 0,35 e 0,75 viene circa 0,47 a filo di riva, 0,36 a un quinto di
  // blocco, 0,16 a due quinti, 0 oltre. Quindi 0,40 taglia la risacca piena
  // (un decimo di blocco) e 0,14 quella magra (mezzo blocco): due bande nette,
  // larghe in tutto poco meno di mezzo blocco.
  float campo = riva(vPos, onda);
  float sRiva = max(aGradini(campo, 0.40), aGradini(campo, 0.14) * 0.5);
  float sTocco = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNGalleggianti) break;
    highp vec4 g = uGalleggianti[i];
    sTocco = max(sTocco, anelloForma(vPos.xz, g.xy, g.zw, onda));
  }
  // \u26A0 DUE SCHIUME DIVERSE, e il committente l'ha chiesto: \xABla schiuma di
  // diverso tipo e materiale\xBB. Non sono la stessa cosa e non devono sembrarlo:
  // quella della RIVA \xE8 una risacca \u2014 bassa, un filo sabbiosa, ferma dov'\xE8;
  // quella del CONTATTO \xE8 agitata \u2014 pi\xF9 bianca, pi\xF9 stretta, e si muove con
  // chi la fa. Dipingerle con lo stesso bianco le faceva leggere come un
  // difetto solo, ed \xE8 il motivo per cui una sola parola (\xABorribile\xBB) copriva
  // due cose lontane.
  sRiva *= vPelo * 0.72;      // 0,85 prima: \xABun pochino troppo spessa\xBB
  sTocco *= vPelo * 0.92;
  vec3 luceSchiuma = mix(uCieloCol * 0.9, uSoleCol, sole * 0.85);
  vec3 biancoRiva = pow(vec3(0.90, 0.93, 0.91), vec3(2.2));
  vec3 biancoTocco = pow(vec3(0.97, 0.99, 1.0), vec3(2.2));
  acqua = mix(acqua, biancoRiva * luceSchiuma, sRiva);
  acqua = mix(acqua, biancoTocco * luceSchiuma, sTocco);
  alfa = mix(alfa, 0.93, sRiva);
  alfa = mix(alfa, 0.98, sTocco);
  vec3 c = pow(mix(acqua, cielo, vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, mix(alfa, 1.0, vNebbia));
}`,En=`#version 300 es
precision highp float;
// \u26A0 UNA LAMELLA \xC8 UN'ISTANZA (nucleo/erba.js): la geometria la fa gl_VertexID
layout(location = 0) in uvec4 aA;   // x8 z8 y8 seme
layout(location = 1) in uvec4 aB;   // r g b (cielo<<2)
layout(location = 2) in uvec4 aC;   // altezza/64, larghezza/128, inclinazione/128+128, (blocco | punta<<4)
uniform mat4 uVP;
uniform vec3 uChunk;                // x0, yBase, z0
uniform float uTempo;
uniform vec3 uSoleVerso;
uniform float uSoleForza;
uniform vec2 uNebbia;
uniform vec3 uCam;
uniform vec2 uVento;                // direzione del vento in pianta
uniform float uErbaFinoA;           // oltre, niente lamelle: ci si arriva abbassandole, non tagliandole
out vec3 vBase;
out float vSole;
out float vEmis;
out float vCielo;
out float vBlocco;
out float vNebbia;
out vec3 vPos;
out float vFaccia;
out vec3 vN;
out vec3 vOmbra;
// \u26A0 L'OMBRA DI LEAFY NON \xC8 \xABPI\xD9 SCURO\xBB: \xE8 lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' pi\xF9 satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: \xABle ombre sono solo il colore
// hue shift pi\xF9 scuro stilizzato\xBB.
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y), e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
uniform vec3 uStile;   // spostamento di tinta verso il blu, saturazione, valore (resa.stile: l'Officina li muove)
vec3 ombraStile(vec3 s) {
  vec3 h = rgb2hsv(s);
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via pi\xF9 corta verso il blu
  // \u26A0 MISURATO SULLE CONCEPT: il terracotta si sposta appena (3 %: #e59b69 \u2192
  // #bf704b), il verde molto di pi\xF9 (15 %: #5ac550 \u2192 #34974c). I colori caldi
  // (tinta sotto i 40\xB0) prendono un quinto dello spostamento.
  float caldo = 1.0 - smoothstep(0.11, 0.25, h.x);
  float freddo = smoothstep(0.42, 0.55, h.x);   // i verdi-petrolio e i blu (la chioma dell'albero) restano loro: viravano al ciano
  h.x = fract(h.x + d * uStile.x * mix(1.0, 0.2, caldo) * mix(1.0, 0.35, freddo));
  h.y = min(1.0, h.y * uStile.y + 0.03);
  h.z *= uStile.z;
  return hsv2rgb(h);
}
void main() {
  vec3 base = uChunk + vec3(float(aA.x), float(aA.z), float(aA.y)) / 8.0;
  float seme = float(aA.w) / 255.0;
  float cielo = float(aB.w >> 2u) / 15.0;
  float alto = float(aC.x) / 64.0, largo = float(aC.y) / 128.0, inclina = (float(aC.z) - 128.0) / 128.0;
  // il verso della lamella in pianta (dal seme) e la sua perpendicolare
  float ang = seme * 6.2832;
  vec2 lungo = vec2(cos(ang), sin(ang)), largoV = vec2(-lungo.y, lungo.x);
  // la distanza decide la forma: rettangolo vicino, triangolo da 28 blocchi in poi,
  // e nell'ultimo quinto prima del confine la lamella si abbassa nel terreno
  float d = distance(base.xz, uCam.xz);
  float triangolo = smoothstep(28.0, 44.0, d);
  float fade = 1.0 - smoothstep(uErbaFinoA * 0.8, uErbaFinoA, d);
  alto *= fade;
  // i sei vertici del rettangolo: 0 basso-sx, 1 basso-dx, 2 alto-dx, 3 basso-sx, 4 alto-dx, 5 alto-sx
  int id = gl_VertexID;
  float punta = (id == 2 || id == 4 || id == 5) ? 1.0 : 0.0;
  float lato = (id == 1 || id == 2 || id == 4) ? 1.0 : -1.0;
  lato *= mix(1.0, 0.0, punta * triangolo);   // in alto, da lontano, le due punte si chiudono al centro
  vec3 p = base;
  p.xz += largoV * (lato * largo * 0.5) + lungo * (inclina * punta);
  p.y += alto * punta;
  if (punta > 0.5) {   // la punta ondeggia col vento, la base no: come il prato
    float f = sin(uTempo * 1.9 + seme * 6.28 + base.x * 0.35 + base.z * 0.5) * 0.5 + 0.5;
    p.xz += (uVento * (0.06 + 0.16 * f) + vec2(sin(uTempo * 3.1 + seme * 9.0), cos(uTempo * 2.3 + seme * 7.0)) * 0.03) * fade;
  }
  // \u26A0 IL COLORE \xC8 QUELLO DELLA CIMA DEL BLOCCO SOTTO, e la punta se ne scosta
  // di poco (0,90\u20261,10, quasi sempre \xB13%): la sfumatura di Leafy, non un
  // gradiente scuro-chiaro. Cel shading alla Zelda: la lamella \xE8 del prato.
  float scosta = 0.9 + 0.2 * float(aC.w >> 4u) / 15.0;
  vBase = pow(vec3(aB.xyz) / 255.0, vec3(2.2)) * mix(1.0, scosta, punta);
  vOmbra = pow(ombraStile(vec3(aB.xyz) / 255.0), vec3(2.2)) * mix(1.0, scosta, punta);
  // l'erba \xE8 del prato: guarda il sole come la cima del blocco (normale in su), senza bande sue
  vSole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  vFaccia = 1.0; vN = vec3(0.0, 1.0, 0.0);
  vCielo = cielo; vBlocco = float(aC.w & 15u) / 15.0; vEmis = 0.0;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,An=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,_n=`#version 300 es
precision highp float;
in vec2 vNdc;
uniform mat4 uInvVP;
uniform vec3 uOcchio;
uniform vec3 uSoleVerso;
uniform float uSoleForza;
uniform vec3 uNebbiaCol;   // l'orizzonte (sRGB): la nebbia, cos\xEC il lontano ci si fonde
uniform vec3 uZenit;       // lo zenit (sRGB)
out vec4 colore;
void main() {
  vec4 p = uInvVP * vec4(vNdc, 1.0, 1.0);
  vec3 dir = normalize(p.xyz / p.w - uOcchio);
  float h = clamp(dir.y, 0.0, 1.0);
  vec3 c = mix(uNebbiaCol, uZenit, pow(h, 0.6));
  // il disco del sole e il suo alone caldo
  float d = max(dot(dir, -uSoleVerso), 0.0);
  c += vec3(1.0, 0.95, 0.80) * (smoothstep(0.99900, 0.99945, d) + 0.30 * pow(d, 40.0)) * uSoleForza;
  colore = vec4(c, 1.0);
}`,zn=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Mn=`#version 300 es
precision mediump float;
void main() {}`,Be=class{constructor(t){this.gl=t,this.programma=rt(t,vn,bi),this.u={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[o]=t.getUniformLocation(this.programma,o);this.ebo=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ebo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,mi(16384),t.STATIC_DRAW),this.programmaErba=rt(t,En,bi.replace(/flat in /g,"in ")),this.ue={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.ue[o]=t.getUniformLocation(this.programmaErba,o);this.programmaOmbra=rt(t,zn,Mn),this.uo={uVP:t.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:t.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=rt(t,bn,xn),this.ua={};for(let o of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[o]=t.getUniformLocation(this.programmaAcqua,o);this.programmaCielo=rt(t,An,_n),this.uc={};for(let o of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[o]=t.getUniformLocation(this.programmaCielo,o);this.vaoVuoto=t.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=t.createSampler(),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_MIN_FILTER,t.LINEAR),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_MAG_FILTER,t.LINEAR),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(512),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!t.getExtension("EXT_color_buffer_half_float")&&!!t.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(t,o){let e=this.mappa;Math.hypot(t+8-e.centro[0],o+8-e.centro[2])<=e.raggio+12&&(e.sporca=!0)}carica(t,o){let e=this.gl;this._sporcaMappa(o.cx*16,o.cz*16);let i=this.chunks.get(t);i||(i={vao:e.createVertexArray(),vbo:e.createBuffer(),quad:0},e.bindVertexArray(i.vao),e.bindBuffer(e.ARRAY_BUFFER,i.vbo),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null),this.chunks.set(t,i)),e.bindBuffer(e.ARRAY_BUFFER,i.vbo),e.bufferData(e.ARRAY_BUFFER,o.byte,e.STATIC_DRAW),i.quad=o.quad;let n=o.erba;i.verticiErba=n?n.vertici:0,i.lamelle=n?n.fili:0,i.yBaseErba=n?n.yBase:0,i.verticiErba>0&&(i.vaoErba||(i.vaoErba=e.createVertexArray(),i.vboErba=e.createBuffer(),e.bindVertexArray(i.vaoErba),e.bindBuffer(e.ARRAY_BUFFER,i.vboErba),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,4,e.UNSIGNED_BYTE,12,0),e.vertexAttribDivisor(0,1),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,4),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribIPointer(2,4,e.UNSIGNED_BYTE,12,8),e.vertexAttribDivisor(2,1),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,i.vboErba),e.bufferData(e.ARRAY_BUFFER,n.byte,e.STATIC_DRAW));let r=o.acqua;if(i.quadAcqua=r?r.quad:0,i.peloAcqua=r&&r.pelo!=null?r.pelo:null,i.quadAcqua>0&&(i.vaoAcqua||(i.vaoAcqua=e.createVertexArray(),i.vboAcqua=e.createBuffer(),e.bindVertexArray(i.vaoAcqua),e.bindBuffer(e.ARRAY_BUFFER,i.vboAcqua),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,i.vboAcqua),e.bufferData(e.ARRAY_BUFFER,r.byte,e.STATIC_DRAW)),i.x0=o.cx*16,i.z0=o.cz*16,i.minY=o.minY,i.maxY=o.maxY,i.y0=o.y0||0,i.chunk=[i.x0,i.y0,i.z0],o.altezze){i.tegola||(i.tegola=new Uint8Array(512));let s=o.solide||o.altezze;for(let c=0;c<16;c++)for(let l=0;l<16;l++){let u=(l*16+c)*2,p=o.altezze[c*16+l],f=s[c*16+l];i.tegola[u]=p<0?0:Math.max(0,Math.min(255,p+1)),i.tegola[u+1]=f<0?0:Math.max(0,Math.min(255,f+1))}this.finestra&&this._scriviTegola(i)}}apriFinestraAltezze(t,o,e=512){let i=this.gl;this.altezze||(this.altezze=i.createTexture()),this.finestra={lato:e,x0:0,z0:0,vuota:new Uint8Array(e*e*2),spostamenti:0},i.bindTexture(i.TEXTURE_2D,this.altezze),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),this._centraFinestra(t,o,!0)}seguiAltezze(t,o){this.finestra&&this._centraFinestra(t,o,!1)}_centraFinestra(t,o,e){let i=this.gl,n=this.finestra,r=n.lato/2;if(!e&&Math.abs(t-(n.x0+r))<n.lato/4&&Math.abs(o-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((t-r)/16)*16,n.z0=Math.floor((o-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.w!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,n.lato,n.lato],i.bindTexture(i.TEXTURE_2D,this.altezze),i.pixelStorei(i.UNPACK_ALIGNMENT,1),i.texImage2D(i.TEXTURE_2D,0,i.RG8,n.lato,n.lato,0,i.RG,i.UNSIGNED_BYTE,n.vuota);for(let s of this.chunks.values())s.tegola&&this._scriviTegola(s);return n.spostamenti++,!0}_scriviTegola(t,o=!1){let e=this.gl,i=this.finestra,n=t.x0-i.x0,r=t.z0-i.z0;n<0||r<0||n+16>i.lato||r+16>i.lato||(e.bindTexture(e.TEXTURE_2D,this.altezze),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,n,r,16,16,e.RG,e.UNSIGNED_BYTE,o?this._tegolaVuota:t.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(t,o,e,i=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=rt(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,t,o,e,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,t,o,e,.1),n.uniform3f(r.uColore,1,1-.45*i,1-.8*i),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(t,o,e,i,n,r,s=.3,c=.1){let l=this.gl;this.programmaPieno||(this.programmaPieno=rt(l,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:l.getUniformLocation(this.programmaPieno,"uVP"),uCella:l.getUniformLocation(this.programmaPieno,"uCella"),uColore:l.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=l.createVertexArray());let u=this.uPieno;l.useProgram(this.programmaPieno),l.uniformMatrix4fv(u.uVP,!1,this.vp),l.uniform4f(u.uCella,t,o,e,c),l.uniform4f(u.uColore,i*s,n*s,r*s,s),l.bindVertexArray(this.vaoPieno),l.enable(l.BLEND),l.blendFunc(l.ONE,l.ONE_MINUS_SRC_ALPHA),l.depthMask(!1),l.disable(l.CULL_FACE),l.drawArrays(l.TRIANGLES,0,36),l.enable(l.CULL_FACE),l.depthMask(!0),l.disable(l.BLEND),l.bindVertexArray(null)}rimuovi(t){let o=this.chunks.get(t);o&&(this._sporcaMappa(o.x0,o.z0),this.finestra&&o.tegola&&this._scriviTegola(o,!0),this.gl.deleteVertexArray(o.vao),this.gl.deleteBuffer(o.vbo),o.vaoAcqua&&(this.gl.deleteVertexArray(o.vaoAcqua),this.gl.deleteBuffer(o.vboAcqua)),o.vaoErba&&(this.gl.deleteVertexArray(o.vaoErba),this.gl.deleteBuffer(o.vboErba)),this.chunks.delete(t))}_sporcaOmbre(t,o,e,i){let r=[Math.max(0,t-26),Math.max(0,o-26),Math.min(this.ombre.w||1e9,t+e+26),Math.min(this.ombre.h||1e9,o+i+26)],s=this.ombre.sporco;this.ombre.sporco=s?[Math.min(s[0],r[0]),Math.min(s[1],r[1]),Math.max(s[2],r[2]),Math.max(s[3],r[3])]:r}_preparaOmbre(t,o){let e=this.gl,i=this.ombre;if(i.tex||(i.tex=e.createTexture(),i.fbo=e.createFramebuffer()),e.bindTexture(e.TEXTURE_2D,i.tex),i.mezzoFloat=this._ombreMezzo,i.mezzoFloat?(e.texImage2D(e.TEXTURE_2D,0,e.R16F,t,o,0,e.RED,e.HALF_FLOAT,null),i.scala=1,i.offset=0):(e.texImage2D(e.TEXTURE_2D,0,e.R8,t,o,0,e.RED,e.UNSIGNED_BYTE,null),i.scala=64,i.offset=-8),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,i.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i.tex,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&i.mezzoFloat)return this._ombreMezzo=!1,e.bindFramebuffer(e.FRAMEBUFFER,null),this._preparaOmbre(t,o);if(e.bindFramebuffer(e.FRAMEBUFFER,null),i.w=t,i.h=o,i.sporco=[0,0,t,o],!this.programmaOmbre){this.programmaOmbre=rt(e,`#version 300 es
void main() { vec2 q = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(q, 0.0, 1.0); }`,`#version 300 es
precision highp float;
uniform sampler2D uAltezze;   // R8: la cima di ogni colonna (+1) / 255
uniform vec4 uAltRett;        // x0, z0, 1/larghezza, 1/profondita
uniform vec3 uSole;           // direzione VERSO il sole in pianta (x, z), e la pendenza (tan dell'elevazione)
uniform vec2 uCodifica;       // scala e offset: r = (quota - offset) / scala
out vec4 colore;
void main() {
  // la colonna di questo texel, al centro
  vec2 p = gl_FragCoord.xy;
  vec2 dir = uSole.xy; float tg = uSole.z;
  // la propria cima, un quarto di passo avanti: le pareti di schiena sono in ombra, le cime no
  float hs = texture(uAltezze, p * uAltRett.zw).r * 255.0 - 0.25 * tg;
  // \u26A0 PASSO FISSO DI MEZZO BLOCCO PER 24 BLOCCHI: nessuna colonna saltata, che era la causa dei puntini
  for (int i = 1; i <= 48; i++) {
    float t = float(i) * 0.5;
    float h = texture(uAltezze, (p + dir * t) * uAltRett.zw).r * 255.0;
    hs = max(hs, h - t * tg);
  }
  colore = vec4((hs - uCodifica.y) / uCodifica.x, 0.0, 0.0, 1.0);
}`),this.uOmbre={};for(let n of["uAltezze","uAltRett","uSole","uCodifica"])this.uOmbre[n]=e.getUniformLocation(this.programmaOmbre,n);this.vaoOmbre=e.createVertexArray()}}_calcolaOmbre(){let t=this.gl,o=this.ombre,e=this.sole;if(!this.altezze||!o.tex||(e.verso[0]*o.sole[0]+e.verso[1]*o.sole[1]+e.verso[2]*o.sole[2]<.99996&&(o.sole=e.verso.slice(),o.sporco=[0,0,o.w,o.h]),!o.sporco))return;let n=96,[r,s,c,l]=o.sporco;if(c<=r||l<=s){o.sporco=null;return}let u=Math.min(l,s+n);o.sporco=u>=l?null:[r,u,c,l];let p=Math.hypot(e.verso[0],e.verso[2])||1e-4,f=[-e.verso[0]/p,-e.verso[2]/p],d=Math.max(.05,-e.verso[1]/p);t.bindFramebuffer(t.FRAMEBUFFER,o.fbo),t.viewport(0,0,o.w,o.h),t.enable(t.SCISSOR_TEST),t.scissor(r,s,c-r,u-s),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.useProgram(this.programmaOmbre),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(this.uOmbre.uAltezze,0),t.uniform4f(this.uOmbre.uAltRett,0,0,1/o.w,1/o.h),t.uniform3f(this.uOmbre.uSole,f[0],f[1],d),t.uniform2f(this.uOmbre.uCodifica,o.scala,o.offset),t.bindVertexArray(this.vaoOmbre),t.drawArrays(t.TRIANGLES,0,3),t.bindVertexArray(null),t.disable(t.SCISSOR_TEST),t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),o.calcoli++,this.statistiche.calcoliOmbre=o.calcoli}_disegnaCielo(t,o){let e=this.gl,i=this.uc,n=this.sole;if(this.cieloNero||!vi(t,this._invVP))return;e.useProgram(this.programmaCielo),e.uniformMatrix4fv(i.uInvVP,!1,this._invVP),e.uniform3f(i.uOcchio,o[0],o[1],o[2]),e.uniform3f(i.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform1f(i.uSoleForza,n.forza),e.uniform3f(i.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;e.uniform3f(i.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),e.disable(e.DEPTH_TEST),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vaoVuoto),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.enable(e.CULL_FACE),e.depthMask(!0),e.enable(e.DEPTH_TEST)}_preparaMappa(){let t=this.gl,o=this.mappa,e=i=>{let n=t.createTexture();t.bindTexture(t.TEXTURE_2D,n),t.texImage2D(t.TEXTURE_2D,0,t.DEPTH_COMPONENT24,i,i,0,t.DEPTH_COMPONENT,t.UNSIGNED_INT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_FUNC,t.LEQUAL);let r=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,n,0),t.drawBuffers([t.NONE]),t.readBuffer(t.NONE);let s=t.checkFramebufferStatus(t.FRAMEBUFFER)===t.FRAMEBUFFER_COMPLETE;return t.bindFramebuffer(t.FRAMEBUFFER,null),{tex:n,fbo:r,lato:i,ok:s}};o.stat=e(o.lato),o.din=e(o.latoDin),(!o.stat.ok||!o.din.ok)&&(o.attiva=!1)}legaMappa(t){let o=this.gl,e=this.mappa;o.activeTexture(o.TEXTURE1),o.bindTexture(o.TEXTURE_2D,e.stat.tex),o.uniform1i(t.uMappaStat,1),o.activeTexture(o.TEXTURE2),o.bindTexture(o.TEXTURE_2D,e.din.tex),o.uniform1i(t.uMappaDin,2),o.activeTexture(o.TEXTURE0),o.uniform1f(t.uMappaOn,e.on?1:0),o.uniformMatrix4fv(t.uLuceVP,!1,e.vp),o.uniformMatrix4fv(t.uLuceVPDin,!1,e.vpDin),o.uniform2f(t.uMappaTexel,.5/e.lato,.5/e.latoDin),o.uniform2f(t.uMappaSbieco,1.5*(2*e.raggio/e.lato),.1/220),o.uniform4fv(t.uLampade,this.lampade),o.uniform1i(t.uNLampade,this.nLampade),o.uniform3f(t.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(o.activeTexture(o.TEXTURE3),o.bindTexture(o.TEXTURE_2D,this.altezze),o.uniform1i(t.uAltezze,3),o.activeTexture(o.TEXTURE0))}_aggiornaMappa(t,o){let e=this.gl,i=this.mappa,n=this.sole,r=this.statistiche;if(i.on=!1,!i.attiva||!this.ombra)return;let s=typeof performance<"u"?performance.now():0,c=t.centro[0],l=t.centro[2],u=!1;Math.hypot(c-i.centro[0],l-i.centro[2])>10&&(i.centro=[Math.round(c/2)*2,Math.round(t.centro[1]),Math.round(l/2)*2],u=!0);{let g=n.verso,v=t.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];be(Ro(i.raggioDin,10,230),Ue(b,v,x),i.vpDin)}n.verso[0]*i.sole[0]+n.verso[1]*i.sole[1]+n.verso[2]*i.sole[2]<.99985&&(i.soleMosso=!0);let f=i.sporca||i.soleMosso||o&&o.mappaSporca,d=u||f&&s-(i.ultimo||0)>=500;if(d){i.sole=n.verso.slice(),i.soleMosso=!1,i.ultimo=s;let g=n.verso,v=i.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];be(Ro(i.raggio,10,230),Ue(b,v,x),i.vp)}if(e.enable(e.POLYGON_OFFSET_FILL),e.polygonOffset(1.5,4),d){e.bindFramebuffer(e.FRAMEBUFFER,i.stat.fbo),e.viewport(0,0,i.stat.lato,i.stat.lato),e.clear(e.DEPTH_BUFFER_BIT),e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uo.uVP,!1,i.vp);let g=0,v=0,b=i.raggio+12;for(let x of this.chunks.values())x.quad!==0&&(Math.hypot(x.x0+8-i.centro[0],x.z0+8-i.centro[2])>b||(e.uniform3f(this.uo.uChunk,x.chunk[0],x.chunk[1],x.chunk[2]),e.bindVertexArray(x.vao),e.drawElements(e.TRIANGLES,x.quad*6,e.UNSIGNED_SHORT,0),g++,v+=x.quad*2));if(e.bindVertexArray(null),o){let[x,A]=o.disegnaOmbra(i.vp,!1);g+=x,v+=A,o.mappaSporca=!1}i.sporca=!1,i.calcoli++,i.disegni=g,i.triangoli=v}e.bindFramebuffer(e.FRAMEBUFFER,i.din.fbo),e.viewport(0,0,i.din.lato,i.din.lato),e.clear(e.DEPTH_BUFFER_BIT);let h=0,m=0;o&&([h,m]=o.disegnaOmbra(i.vpDin,!0)),e.disable(e.POLYGON_OFFSET_FILL),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),i.on=!0,r.calcoliMappa=i.calcoli,r.disegniOmbra=h+(d?i.disegni:0),r.triangoliOmbra=m+(d?i.triangoli:0)}impostaAltezze(t,o,e,i,n,r=null){let s=this.gl;this.altezze||(this.altezze=s.createTexture()),s.bindTexture(s.TEXTURE_2D,this.altezze),s.pixelStorei(s.UNPACK_ALIGNMENT,1);let c=new Uint8Array(i*n*2);for(let l=0;l<i*n;l++)c[l*2]=t[l],c[l*2+1]=r?r[l]:t[l];s.texImage2D(s.TEXTURE_2D,0,s.RG8,i,n,0,s.RG,s.UNSIGNED_BYTE,c),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.altRett=[o,e,1/i,1/n],this._preparaOmbre(i,n)}impostaMaterie(t){let o=new Float32Array(64);for(let e=0;e<16&&e<t.length;e++)for(let i=0;i<4;i++)o[e*4+i]=t[e][i]||0;this.materie=o}disegna(t,o,e=null){let i=this.gl,n=this.statistiche;this.tempo+=o;let r=gi(t.fov,t.rapporto,.3,400),s=Ue(t.occhio,t.centro);be(r,s,this.vp),Lo(this.vp,this.piani),this._camera=t,this._visibili.length=0,this._visibiliErba.length=0;let c=0;for(let d of this.chunks.values())d.quad===0&&d.quadAcqua===0||(d.visto=this.tutto||Oo(this.piani,d.x0,d.y0+d.minY,d.z0,d.x0+16,d.y0+d.maxY+1,d.z0+16),d.visto&&(c++,d.quadAcqua>0&&this._visibili.push(d),d.verticiErba>0&&Math.hypot(d.x0+8-t.occhio[0],d.z0+8-t.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(d)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(t,e),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(t,e),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,t.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[l,u]=this._solidi(this.vp,this.piani,t.occhio,!1),p=0,f=0;if(this._visibiliErba.length){let d=this.ue,h=this.sole;i.useProgram(this.programmaErba),i.uniformMatrix4fv(d.uVP,!1,this.vp),i.uniform1f(d.uTempo,this.tempo),i.uniform3f(d.uSoleVerso,h.verso[0],h.verso[1],h.verso[2]),i.uniform3f(d.uSoleCol,h.colore[0],h.colore[1],h.colore[2]),i.uniform1f(d.uSoleForza,h.forza),i.uniform3f(d.uCieloCol,h.cielo[0],h.cielo[1],h.cielo[2]),i.uniform2f(d.uNebbia,this.nebbia.da,this.nebbia.a),i.uniform3f(d.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),i.uniform3f(d.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),i.uniform2f(d.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),i.uniform1f(d.uOmbra,this.ombra&&this.altezze?1:0),i.uniform1f(d.uTaglio,-1e9),i.uniform1f(d.uErbaFinoA,this.erbaFinoA),i.uniform4f(d.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),i.uniform3f(d.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),this.altezze&&(i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.ombre.tex),i.uniform1i(d.uOmbre,0),i.uniform2f(d.uOmbreScala,this.ombre.scala,this.ombre.offset),i.uniform4f(d.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(d),i.disable(i.CULL_FACE);for(let m of this._visibiliErba)i.uniform3f(d.uChunk,m.chunk[0],m.yBaseErba,m.chunk[2]),i.bindVertexArray(m.vaoErba),i.drawArraysInstanced(i.TRIANGLES,0,6,m.lamelle),p++,f+=m.lamelle*2;i.enable(i.CULL_FACE),i.bindVertexArray(null)}n.disegni=l,n.triangoli=u,n.chunkVisti=c,n.chunkTotali=this.chunks.size,n.disegniErba=p,n.triangoliErba=f}_solidi(t,o,e,i){let n=this.gl,r=this.u,s=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,t),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,s.verso[0],s.verso[1],s.verso[2]),n.uniform3f(r.uSoleCol,s.colore[0],s.colore[1],s.colore[2]),n.uniform1f(r.uSoleForza,s.forza),n.uniform3f(r.uCieloCol,s.cielo[0],s.cielo[1],s.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,e[0],e[1],e[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let c=i?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,c[0],c[1],c[2],c[3]),n.uniform3f(r.uOcchio,e[0],e[1],e[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let l=0,u=0;for(let p of this.chunks.values())if(p.quad!==0){if(i){if(!this.tutto&&!Oo(o,p.x0,p.y0+p.minY,p.z0,p.x0+16,p.y0+p.maxY+1,p.z0+16))continue}else if(!p.visto)continue;n.uniform3f(r.uChunk,p.chunk[0],p.chunk[1],p.chunk[2]),n.bindVertexArray(p.vao),n.drawElements(n.TRIANGLES,p.quad*6,n.UNSIGNED_SHORT,0),l++,u+=p.quad*2}return n.bindVertexArray(null),[l,u]}_peloVicino(t){let o=this._voti;o.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-t[0],n.z0+8-t[2])+2.2*Math.abs(n.peloAcqua-t[1]);o.set(n.peloAcqua,(o.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let e=null,i=0;for(let[n,r]of o)r>i&&(i=r,e=n);return e}_specchia(t,o){let e=this.gl,i=this.specchio,n=this.statistiche,r=this._peloVicino(t.occhio);if(r==null||t.occhio[1]<=r+.2)return;let s=Math.max(1,Math.round(e.drawingBufferWidth*i.scala)),c=Math.max(1,Math.round(e.drawingBufferHeight*i.scala));(!i.fbo||i.w!==s||i.h!==c)&&this._preparaSpecchio(s,c);let l=this._riflessione;l.fill(0),l[0]=1,l[5]=-1,l[10]=1,l[13]=2*r,l[15]=1,be(this.vp,l,this.vpSpecchio),Lo(this.vpSpecchio,this.pianiSpecchio);let u=[t.occhio[0],2*r-t.occhio[1],t.occhio[2]];e.bindFramebuffer(e.FRAMEBUFFER,i.fbo),e.viewport(0,0,s,c),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),e.cullFace(e.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[p,f]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);n.disegniSpecchio=p,n.triangoliSpecchio=f,o&&(o.disegna(this,{occhio:u,centro:t.centro,fov:t.fov,rapporto:t.rapporto}),n.disegniSpecchio+=o.statistiche.disegni,n.triangoliSpecchio+=o.statistiche.triangoli),e.cullFace(e.BACK),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),this.taglio=-1e9,i.pelo=r,n.pelo=r}_mostraSpecchio(){let t=this.gl,o=this.specchio;this.programmaQuad||(this.programmaQuad=rt(t,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=t.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=t.createVertexArray()),t.useProgram(this.programmaQuad),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,o.tex),t.uniform1i(this.uQuad,0),t.bindVertexArray(this.vaoQuad),t.disable(t.DEPTH_TEST),t.drawArrays(t.TRIANGLE_STRIP,0,4),t.enable(t.DEPTH_TEST),t.bindVertexArray(null)}_preparaSpecchio(t,o){let e=this.gl,i=this.specchio;i.fbo||(i.fbo=e.createFramebuffer(),i.tex=e.createTexture(),i.rbo=e.createRenderbuffer()),e.bindTexture(e.TEXTURE_2D,i.tex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,o,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindRenderbuffer(e.RENDERBUFFER,i.rbo),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,o),e.bindFramebuffer(e.FRAMEBUFFER,i.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i.tex,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,i.rbo),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&(i.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),i.w=t,i.h=o}disegnaAcqua(){let t=this.gl,o=this.ua,e=this.sole,i=this._camera,n=this.specchio;if(!i||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}t.useProgram(this.programmaAcqua),t.uniformMatrix4fv(o.uVP,!1,this.vp),t.uniform1f(o.uTempo,this.tempo),t.uniform3f(o.uCam,i.occhio[0],i.occhio[1],i.occhio[2]),t.uniform2f(o.uNebbia,this.nebbia.da,this.nebbia.a),t.uniform3f(o.uSoleVerso,e.verso[0],e.verso[1],e.verso[2]),t.uniform3f(o.uSoleCol,e.colore[0],e.colore[1],e.colore[2]),t.uniform1f(o.uSoleForza,e.forza),t.uniform3f(o.uCieloCol,e.cielo[0],e.cielo[1],e.cielo[2]),t.uniform3f(o.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r?n.tex:null),t.uniform1i(o.uSpecchio,1),t.uniform3f(o.uSchermo,1/t.drawingBufferWidth,1/t.drawingBufferHeight,r?1:0),t.uniform1f(o.uMare,this.mare),t.uniform4fv(o.uGalleggianti,this.galleggianti),t.uniform1i(o.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(o.uAltezze,2),t.bindSampler(2,this.campionatoreLiscio),t.uniform4f(o.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):t.uniform4f(o.uAltRett,0,0,0,0),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);let s=0,c=0;for(let l of this._visibili)t.uniform3f(o.uChunk,l.chunk[0],l.chunk[1],l.chunk[2]),t.bindVertexArray(l.vaoAcqua),t.drawElements(t.TRIANGLES,l.quadAcqua*6,t.UNSIGNED_SHORT,0),s++,c+=l.quadAcqua*2;t.bindVertexArray(null),t.depthMask(!0),t.enable(t.CULL_FACE),t.disable(t.BLEND),t.bindSampler(2,null),t.activeTexture(t.TEXTURE0),this.statistiche.disegniAcqua=s,this.statistiche.triangoliAcqua=c,n.mostra&&r&&this._mostraSpecchio()}};function xi(a){let t=new DataView(a);if(String.fromCharCode(t.getUint8(0),t.getUint8(1),t.getUint8(2),t.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let o=t.getUint32(4,!0),e=o*3,i=new Uint8Array(a,8,e*16),n=new Uint8Array(a,8+e*16,e*4),r=new Uint8Array(e*20);for(let p=0;p<e;p++)r.set(i.subarray(p*16,p*16+16),p*20),r.set(n.subarray(p*4,p*4+4),p*20+16);let s=1/0,c=-1/0,l=0,u=new DataView(r.buffer);for(let p=0;p<e;p++){let f=u.getFloat32(p*20,!0),d=u.getFloat32(p*20+4,!0),h=u.getFloat32(p*20+8,!0);s=Math.min(s,d),c=Math.max(c,d),l=Math.max(l,Math.hypot(f,h))}return{byte:r,vertici:e,triangoli:o,minY:s,maxY:c,raggio:l}}var yn=`#version 300 es
precision highp float;
layout(location = 0) in vec3 aPos;
layout(location = 1) in vec3 aNor;        // int8 nx ny nz (normalizzati)
layout(location = 2) in vec4 aCol;        // rgb normalizzati
layout(location = 3) in vec4 aIst;        // per istanza: x y z, scala
layout(location = 5) in vec4 aTinta;      // per istanza: r g b (moltiplica il colore), giro attorno a Y
layout(location = 4) in uint aMat;        // materia, byte 15
uniform mat4 uVP;
uniform float uTempo;
uniform vec3 uSoleVerso;
uniform vec3 uSoleCol;
uniform float uSoleForza;
uniform vec3 uCieloCol;
uniform vec4 uMaterie[16];
uniform vec2 uNebbia;
uniform vec3 uCam;
flat out vec3 vColOmbra;
flat out vec3 vColSole;
flat out vec3 vBase;
flat out float vFaccia;
flat out vec3 vN;
out float vNebbia;
out vec3 vPos;
// \u26A0 L'OMBRA DI LEAFY NON \xC8 \xABPI\xD9 SCURO\xBB: \xE8 lo stesso colore con la tinta
// spostata verso il blu (14 % della strada), un po' pi\xF9 satura e al 62 % di
// valore. Si calcola nel vertex (una volta per faccia) in sRGB e si porta in
// lineare come il colore pieno. Il committente: \xABle ombre sono solo il colore
// hue shift pi\xF9 scuro stilizzato\xBB.
vec3 rgb2hsv(vec3 c) {
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y), e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
uniform vec3 uStile;   // spostamento di tinta verso il blu, saturazione, valore (resa.stile: l'Officina li muove)
vec3 ombraStile(vec3 s) {
  vec3 h = rgb2hsv(s);
  float d = (240.0 / 360.0) - h.x; d -= floor(d + 0.5);   // la via pi\xF9 corta verso il blu
  // \u26A0 MISURATO SULLE CONCEPT: il terracotta si sposta appena (3 %: #e59b69 \u2192
  // #bf704b), il verde molto di pi\xF9 (15 %: #5ac550 \u2192 #34974c). I colori caldi
  // (tinta sotto i 40\xB0) prendono un quinto dello spostamento.
  float caldo = 1.0 - smoothstep(0.11, 0.25, h.x);
  float freddo = smoothstep(0.42, 0.55, h.x);   // i verdi-petrolio e i blu (la chioma dell'albero) restano loro: viravano al ciano
  h.x = fract(h.x + d * uStile.x * mix(1.0, 0.2, caldo) * mix(1.0, 0.35, freddo));
  h.y = min(1.0, h.y * uStile.y + 0.03);
  h.z *= uStile.z;
  return hsv2rgb(h);
}
void main() {
  // il giro attorno a Y (i corpi del sandbox, un albero girato a caso): seno e
  // coseno per vertice costano meno di una matrice per istanza
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  vec3 p = aIst.xyz + q * aIst.w;
  vec3 n = normalize(vec3(aNor.x * cg - aNor.z * sg, aNor.y, aNor.x * sg + aNor.z * cg));
  int materia = int(aMat);
  vec3 base = pow(aCol.rgb * aTinta.rgb, vec3(2.2));
  vBase = base;
  vec4 mat = uMaterie[materia];
  // due bande per direzione del sole, come i blocchi (vedi resa.js): la faccia
  // che guarda il sole \xE8 piena, quella di spalle ha il colore d'ombra
  // \u26A0 I MODELLI HANNO DUE TINTE E BASTA: la faccia che guarda il sole ha il
  // colore pieno, quella di spalle il colore d'ombra stilizzato (lo stesso
  // dell'ombra portata). Niente mezza banda: sfumava, e non \xE8 Leafy.
  vFaccia = (mat.x > 0.0 || dot(n, -uSoleVerso) > 0.0) ? 1.0 : 0.0;
  vN = n;
  float sole = floor(uSoleForza * 3.0 + 0.5) / 3.0;
  vec3 ombra = pow(ombraStile(aCol.rgb * aTinta.rgb), vec3(2.2)) * uCieloCol;
  vec3 pieno = base * uSoleCol;
  if (mat.x > 0.0) { ombra = mix(ombra, base * 1.15, mat.x); pieno = mix(pieno, base * 1.15, mat.x); }
  vColOmbra = ombra; vColSole = (pieno - ombra) * sole;
  vNebbia = clamp((distance(p, uCam) - uNebbia.x) / (uNebbia.y - uNebbia.x), 0.0, 1.0);
  vPos = p;
  gl_Position = uVP * vec4(p, 1.0);
}`,Tn=`#version 300 es
precision mediump float;
precision mediump sampler2D;
flat in vec3 vColOmbra;
flat in vec3 vColSole;
flat in vec3 vBase;
flat in float vFaccia;
flat in vec3 vN;
in float vNebbia;
in highp vec3 vPos;
uniform highp float uSoleForza;

uniform highp vec4 uBuco;        // il buco di visuale (vedi resa.js); zero per il giocatore stesso
uniform highp vec3 uOcchio;
uniform vec3 uNebbiaCol;
uniform float uSagoma;           // 1 = la passata della sagoma: colore scuro pieno, senza luce
uniform float uOmbra;
uniform highp float uTaglio;     // la passata dello specchio non disegna sotto il pelo
uniform highp vec3 uSoleVerso;
uniform sampler2D uOmbre;
uniform vec2 uOmbreScala;
uniform highp vec4 uAltRett;
uniform highp vec4 uLampade[8];   // x y z raggio dei lampioni ACCESI pi\xF9 vicini (la resa li riceve dalla partita)
uniform int uNLampade;
// \u26A0 LE POZZE DEI LAMPIONI SONO CERCHI NETTI A DUE BANDE, per pixel: la luce
// cotta nel vertice, interpolata sui triangoli, faceva poligoni (\xABesagonale\xBB).
// La luce cotta resta come MASCHERA (dietro un muro non si passa) e per le
// lampade-blocco, che non stanno nella lista.
uniform sampler2D uAltezze;   // la mappa delle altezze (cima di ogni colonna + 1), per l'ombra della lampada
// \u26A0 L'OMBRA DELLA LAMPADA SI CAMMINA CELLA PER CELLA (Amanatides\u2013Woo, la
// traversata dei voxel in due dimensioni): dal punto si va verso la lanterna
// (a 2,6 di quota) attraversando le colonne della mappa delle altezze una per
// una, e ci si ferma sulla prima che sta sopra il raggio.
// \u26A0 NON a passi fissi: con dodici passi uguali il bordo dell'ombra cadeva
// DOVE CAPITAVA IL PASSO, non sul bordo del blocco, ed era seghettato (\xABl'ombra
// \xE8 seghettata quadrata non va bene\xBB). Camminando i confini delle celle il
// taglio \xE8 esattamente il profilo del blocco, dritto, e le letture sono meno:
// una per cella attraversata, al massimo quattordici (il raggio \xE8 4,6).
float ombraLampada(highp vec3 pos, highp vec3 L) {
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 prossimo = (cella + max(verso, vec2(0.0)) - pos.xz) / (verso * mod_);   // quanto manca al confine
  highp vec2 quanto = 1.0 / mod_;                    // e quanto da un confine al prossimo
  for (int i = 0; i < 14; i++) {
    highp float t = min(prossimo.x, prossimo.y);
    if (t >= lungo) break;                           // arrivati alla lanterna: niente in mezzo
    if (prossimo.x < prossimo.y) { cella.x += verso.x; prossimo.x += quanto.x; }
    else { cella.y += verso.y; prossimo.y += quanto.y; }
    highp float y = pos.y + (L.y - pos.y) * (t / lungo);
    float h = texture(uAltezze, (cella + 0.5 - uAltRett.xy) * uAltRett.zw).r * 255.0;
    if (h > y + 0.05 && h > pos.y + 0.6) return 0.0;
  }
  return 1.0;
}
float pozza(highp vec3 pos, float cotto) {
  float s = 0.0;
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // \u26A0 TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    s += anello * ombraLampada(pos, uLampade[i].xyz + vec3(0.0, 2.6, 0.0));
  }
  return min(s, 1.0);
}
uniform highp sampler2DShadow uMappaStat;   // la mappa d'ombra FERMA: terreno, lampioni, alberi (si rif\xE0 quando serve)
uniform highp sampler2DShadow uMappaDin;    // quella di chi si muove (gatto, corpi): ogni fotogramma, piccola
uniform highp mat4 uLuceVP;                 // mondo \u2192 clip del sole
uniform float uMappaOn;                     // 1 = la mappa vale
uniform vec2 uMappaSbieco;                  // x: scostamento lungo la normale (blocchi), y: bias di profondit\xE0 (clip 0..1)
// \u26A0 LA MAPPA D'OMBRA VERA (Resa._aggiornaMappa): profondit\xE0 vista dal sole,
// quindi l'ombra ha la FORMA della cosa \u2014 il palo del lampione, il gatto, la
// chioma \u2014 non della colonna. Il confronto lo fa la texture (sampler2DShadow,
// 2\xD72 in hardware: bordo netto ma senza scalini); lo scostamento lungo la
// normale e il bias tolgono l'acne. Fuori dalla mappa torna -1 e si usa la
// mappa per colonna (ombraSole), che copre tutto il mondo in streaming.
uniform highp mat4 uLuceVPDin;              // mondo \u2192 clip della mappa di chi si muove (pi\xF9 stretta: pi\xF9 fitta)
uniform vec2 uMappaTexel;                   // mezzo texel delle due mappe, in uv
// \u26A0 QUATTRO LETTURE A MEZZO TEXEL E POI UNA SOGLIA: il bordo resta netto ma
// senza scalini (le ombre \xABpixellate\xBB). Ogni lettura \xE8 gi\xE0 un 2\xD72 in hardware.
float pcf(highp sampler2DShadow m, highp vec3 c, float t) {
  return 0.25 * (texture(m, c + vec3(-t, -t, 0.0)) + texture(m, c + vec3(t, -t, 0.0)) + texture(m, c + vec3(-t, t, 0.0)) + texture(m, c + vec3(t, t, 0.0)));
}
float ombraMappa(highp vec3 pos, vec3 n) {
  if (uMappaOn < 0.5) return -1.0;
  highp vec3 p = pos + n * uMappaSbieco.x;
  highp vec4 q = uLuceVP * vec4(p, 1.0);
  highp vec3 u = q.xyz * 0.5 + 0.5;
  if (u.x < 0.004 || u.x > 0.996 || u.y < 0.004 || u.y > 0.996 || u.z > 1.0) return -1.0;
  float s = pcf(uMappaStat, vec3(u.xy, u.z - uMappaSbieco.y), uMappaTexel.x);
  highp vec4 q2 = uLuceVPDin * vec4(p, 1.0);
  highp vec3 u2 = q2.xyz * 0.5 + 0.5;
  if (u2.x > 0.002 && u2.x < 0.998 && u2.y > 0.002 && u2.y < 0.998 && u2.z <= 1.0) s = min(s, pcf(uMappaDin, vec3(u2.xy, u2.z - uMappaSbieco.y), uMappaTexel.y));
  return smoothstep(0.3, 0.7, s);
}
out vec4 colore;
// \u26A0 L'OMBRA DEL SOLE \xC8 UNA LETTURA SOLA: la mappa delle ombre (uOmbre, per
// colonna: la quota sotto cui si \xE8 in ombra, calcolata dalla GPU quando il sole
// si sposta, vedi Resa._calcolaOmbre) letta mezzo blocco VERSO il sole (cos\xEC
// una parete al sole legge la colonna davanti, non la propria) e confrontata
// con la quota del pixel con una soglia netta: cel shading, niente acne,
// niente puntini, niente penombra sbavata.
float ombraSole(highp vec3 pos) {
  vec2 dir = -uSoleVerso.xz; float l = length(dir); dir = l > 1e-4 ? dir / l : vec2(0.0);
  highp vec2 uv = (pos.xz + dir * 0.5 - uAltRett.xy) * uAltRett.zw;
  float hs = texture(uOmbre, uv).r * uOmbreScala.x + uOmbreScala.y;
  return 1.0 - smoothstep(-0.04, 0.04, hs - (pos.y + 0.03));
}
void main() {
  if (vPos.y < uTaglio) discard;
  if (uBuco.w > 0.0) {
    vec3 seg = uBuco.xyz - uOcchio; float lung = length(seg); vec3 dir = seg / lung;
    float t = dot(vPos - uOcchio, dir);
    if (t > 0.0 && t < lung - 0.35 && length(vPos - uOcchio - dir * t) < uBuco.w) discard;
  }
  float luce = vFaccia;
  if (uOmbra > 0.5 && luce > 0.0) { float m = ombraMappa(vPos, vN); luce *= m >= 0.0 ? m : ombraSole(vPos); }
  vec3 c = vColOmbra + vColSole * luce;
  // le pozze dei lampioni anche sui modelli (il gatto sotto il lampione, di notte)
  c += vBase * vec3(1.30, 1.02, 0.58) * pozza(vPos, 1.0) * mix(0.45, 1.0, 1.0 - smoothstep(0.30, 0.75, uSoleForza));   // i modelli non hanno luce cotta: passa
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  // \u26A0 LA SAGOMA: quando il gatto \xE8 dietro un albero o un muro, si vede la sua
  // ombra piatta attraverso (il committente: \xABun cono che mostra il player
  // anche attraverso i blocchi, magari in nero\xBB, non un buco nel mondo)
  if (uSagoma > 0.5) { colore = vec4(c * 0.18 * 0.55, 0.55); return; }
  colore = vec4(c, 1.0);
}`;function Cn(a,t=4){if(t===8)return a instanceof Float32Array?a:new Float32Array(a);let o=a.length/4,e=new Float32Array(o*8);for(let i=0;i<o;i++)e.set([a[i*4],a[i*4+1],a[i*4+2],a[i*4+3],1,1,1,0],i*8);return e}function Ei(a=[255,255,255],t=1,o=1,e=1){let i=[[[0,0,1],[[-1,0,1],[1,0,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[1,0,-1],[-1,0,-1],[-1,1,-1],[1,1,-1]]],[[1,0,0],[[1,0,1],[1,0,-1],[1,1,-1],[1,1,1]]],[[-1,0,0],[[-1,0,-1],[-1,0,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]],[[0,-1,0],[[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1]]]],n=36,r=new Uint8Array(n*20),s=new DataView(r.buffer),c=0,l=(u,p)=>{let f=c*20;s.setFloat32(f,u[0]*t/2,!0),s.setFloat32(f+4,u[1]*o,!0),s.setFloat32(f+8,u[2]*e/2,!0),r[f+12]=p[0]*127&255,r[f+13]=p[1]*127&255,r[f+14]=p[2]*127&255,r[f+15]=0,r[f+16]=a[0],r[f+17]=a[1],r[f+18]=a[2],r[f+19]=255,c++};for(let[u,[p,f,d,h]]of i)l(p,u),l(f,u),l(d,u),l(p,u),l(d,u),l(h,u);return{byte:r,vertici:n,triangoli:12,minY:0,maxY:o,raggio:Math.hypot(t,e)/2}}var Sn=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,Rn=`#version 300 es
precision mediump float;
void main() {}`,Ve=class{constructor(t){this.gl=t,this.programma=rt(t,yn,Tn),this.u={};for(let o of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[o]=t.getUniformLocation(this.programma,o);this.programmaOmbra=rt(t,Sn,Rn),this.uoVP=t.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(t,o){let e=this.gl,i={vao:e.createVertexArray(),vbo:e.createBuffer(),ibo:e.createBuffer(),vertici:o.vertici,triangoli:o.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:o.raggio,maxY:o.maxY};return e.bindVertexArray(i.vao),e.bindBuffer(e.ARRAY_BUFFER,i.vbo),e.bufferData(e.ARRAY_BUFFER,o.byte,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,20,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.BYTE,!0,20,12),e.enableVertexAttribArray(4),e.vertexAttribIPointer(4,1,e.UNSIGNED_BYTE,20,15),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.UNSIGNED_BYTE,!0,20,16),e.bindBuffer(e.ARRAY_BUFFER,i.ibo),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(3,1),e.enableVertexAttribArray(5),e.vertexAttribPointer(5,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(5,1),e.bindVertexArray(null),this.tipi.set(t,i),i}istanze(t,o,e=4){let i=this.tipi.get(t);i&&(i.istanze=Cn(o,e),i.n=i.istanze.length/8,i.sporco=!0,this.dinamici.has(t)||(this.mappaSporca=!0))}disegnaOmbra(t,o){let e=this.gl;e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uoVP,!1,t);let i=0,n=0;for(let[r,s]of this.tipi)s.n===0||this.dinamici.has(r)!==o||(e.bindVertexArray(s.vao),s.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,s.ibo),e.bufferData(e.ARRAY_BUFFER,s.istanze,e.DYNAMIC_DRAW),s.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,s.vertici,s.n),i++,n+=s.triangoli*s.n);return e.bindVertexArray(null),[i,n]}disegna(t,o){let e=this.gl,i=this.u,n=t.sole;e.useProgram(this.programma),e.uniformMatrix4fv(i.uVP,!1,t.vpCorrente||t.vp),e.uniform1f(i.uTaglio,t.taglio??-1e9);let r=t.vpCorrente===t.vpSpecchio?[0,0,0,0]:t.buco||[0,0,0,0];e.uniform3f(i.uOcchio,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(i.uTempo,t.tempo),e.uniform3f(i.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform3f(i.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),e.uniform1f(i.uSoleForza,n.forza),e.uniform3f(i.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),e.uniform4fv(i.uMaterie,t.materie),e.uniform2f(i.uNebbia,t.nebbia.da,t.nebbia.a),e.uniform3f(i.uNebbiaCol,t.nebbia.colore[0],t.nebbia.colore[1],t.nebbia.colore[2]),e.uniform3f(i.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(i.uOmbra,t.ombra&&t.altezze?1:0),t.altezze&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.ombre.tex),e.uniform1i(i.uOmbre,0),e.uniform2f(i.uOmbreScala,t.ombre.scala,t.ombre.offset),e.uniform4f(i.uAltRett,t.altRett[0],t.altRett[1],t.altRett[2],t.altRett[3])),t.legaMappa(i);let s=0,c=0,l=0;e.uniform1f(i.uSagoma,0);for(let[p,f]of this.tipi)f.n!==0&&(e.uniform4f(i.uBuco,r[0],r[1],r[2],p==="omino"?0:r[3]),e.bindVertexArray(f.vao),f.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,f.ibo),e.bufferData(e.ARRAY_BUFFER,f.istanze,e.DYNAMIC_DRAW),f.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,f.vertici,f.n),s++,c+=f.triangoli*f.n,l+=f.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&t.vpCorrente!==t.vpSpecchio&&(e.uniform1f(i.uSagoma,1),e.depthFunc(e.GREATER),e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.bindVertexArray(u.vao),e.drawArraysInstanced(e.TRIANGLES,0,u.vertici,u.n),e.disable(e.BLEND),e.depthMask(!0),e.depthFunc(e.LESS),e.uniform1f(i.uSagoma,0),s++),e.bindVertexArray(null),this.statistiche.disegni=s,this.statistiche.triangoli=c,this.statistiche.istanze=l}};var Ln=`#version 300 es
precision highp float;
layout(location = 0) in vec4 aPos;     // per istanza: x y z, raggio
layout(location = 1) in vec4 aCol;     // per istanza: r g b, forza
uniform mat4 uVP;
uniform vec3 uCam;
uniform float uSoleForza;
out vec2 vUv;
out vec4 vCol;
void main() {
  int id = gl_VertexID;
  vec2 q = vec2((id == 1 || id == 2 || id == 4) ? 1.0 : -1.0, (id == 2 || id == 4 || id == 5) ? 1.0 : -1.0);
  vec3 verso = normalize(uCam - aPos.xyz);
  vec3 destra = normalize(cross(vec3(0.0, 1.0, 0.0), verso));
  vec3 su = cross(verso, destra);
  vec3 p = aPos.xyz + verso * aPos.w * 0.25 + (destra * q.x + su * q.y) * aPos.w;
  vUv = q;
  // di notte pieno, di giorno un quarto: il sole lo copre da s\xE9
  vCol = vec4(aCol.rgb * aCol.a * mix(1.0, 0.22, uSoleForza), 1.0);
  gl_Position = uVP * vec4(p, 1.0);
}`,On=`#version 300 es
precision mediump float;
in vec2 vUv;
in vec4 vCol;
out vec4 colore;
void main() {
  float d = length(vUv);
  if (d > 1.0) discard;
  // \u26A0 DUE CERCHI CONCENTRICI PIATTI, dello stesso colore, in trasparenza: come le
  // \xABfake point light\xBB di Unity a cui ci ispiriamo. Niente alone bianco sfumato
  // (\xABfuori stile\xBB): il cuore \xE8 lo stesso colore, solo pi\xF9 pieno.
  float a = (d < 0.5 ? 0.16 : 0.0) + (d < 1.0 ? 0.14 : 0.0);   // tenui: additivi, sul verde diventavano bianchi
  colore = vec4(vCol.rgb * a, 1.0);
}`,Ge=class{constructor(t){this.gl=t,this.programma=rt(t,Ln,On),this.u={};for(let o of["uVP","uCam","uSoleForza"])this.u[o]=t.getUniformLocation(this.programma,o);this.vao=t.createVertexArray(),this.ibo=t.createBuffer(),t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.ibo),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,4,t.FLOAT,!1,32,0),t.vertexAttribDivisor(0,1),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,32,16),t.vertexAttribDivisor(1,1),t.bindVertexArray(null),this.n=0,this.attivo=!0,this.statistiche={disegni:0,bagliori:0}}istanze(t){let o=this.gl,e=t instanceof Float32Array?t:new Float32Array(t);this.n=e.length/8,o.bindBuffer(o.ARRAY_BUFFER,this.ibo),o.bufferData(o.ARRAY_BUFFER,e,o.DYNAMIC_DRAW)}disegna(t,o){let e=this.gl,i=this.u;if(!this.attivo||this.n===0){this.statistiche.disegni=0,this.statistiche.bagliori=0;return}e.useProgram(this.programma),e.uniformMatrix4fv(i.uVP,!1,t.vp),e.uniform3f(i.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(i.uSoleForza,t.sole.forza),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLES,0,6,this.n),e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),this.statistiche.disegni=1,this.statistiche.bagliori=this.n}};ct();var C=16,Fn=256,Xe=2048,_i=64,Et=(a,t,o)=>((a+Xe)*4096+(o+Xe))*256+(t+_i),Jt=a=>Math.floor(a/(256*4096))-Xe,te=a=>Math.floor(a/256)%4096-Xe,ee=a=>a%256-_i;var Bt=(a,t)=>Math.floor(a/C)+","+Math.floor(t/C),$e=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(t){this.generati.add(t)}_annotaModifica(t,o,e,i){if(!this.frontiera)return;let n=Bt(t,e),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(Et(t,o,e),i)}applicaModifiche(t){let o=this.modifiche.get(t);if(!o)return 0;for(let[e,i]of o){let n=Jt(e),r=ee(e),s=te(e);i===null?this.togli(n,r,s,!0):this.metti(n,r,s,i,!0)}return o.size}scaricaChunk(t){let o=this.chunks.get(t);if(!o)return this.generati.delete(t),[];let e=[];for(let[i,n]of o){let r=k(n);r&&r.forma==="modello"&&e.push([Jt(i),ee(i),te(i),n])}return this.contaBlocchi-=o.size,this.chunks.delete(t),this._scordaMemo(),this.generati.delete(t),this._tocca(t,this.sporchi),e}_cambiata(t,o,e){if(this.cambiate.length>=3*Fn){this.troppiCambi=!0;return}this.cambiate.push(t,o,e)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(t,o){let e=Math.floor(t/C),i=Math.floor(o/C);if(this._memoChunk!==null&&this._memoCx===e&&this._memoCz===i)return this._memoChunk;let n=this.chunks.get(e+","+i)||null;return this._memoCx=e,this._memoCz=i,this._memoChunk=n,n}tipo(t,o,e){let i=this._chunkDi(t,e);return i&&i.get(Et(t,o,e))||null}pieno(t,o,e){return this.tipo(t,o,e)!==null}solido(t,o,e){let i=this.tipo(t,o,e);if(i&&k(i).solido)return!0;let n=this.furni.get(Et(t,o,e));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(t,o,e){if(!this.solido(t,o-1,e)||this.solido(t,o,e)||this.solido(t,o+1,e))return!1;let i=this.tipo(t,o,e);return!(i&&k(i).acqua)}_sporca(t,o,e=this.sporchi){let i=(t%C+C)%C,n=(o%C+C)%C;this._tocca(Bt(t,o),e),i===0&&this._tocca(Bt(t-1,o),e),i===C-1&&this._tocca(Bt(t+1,o),e),n===0&&this._tocca(Bt(t,o-1),e),n===C-1&&this._tocca(Bt(t,o+1),e)}_tocca(t,o){o.add(t),this._rev.set(t,(this._rev.get(t)||0)+1)}revisione(t){return this._rev.get(t)||0}metti(t,o,e,i,n=!1){let r=Bt(t,e),s=this.chunks.get(r);s||(s=new Map,this.chunks.set(r,s),this._scordaMemo());let c=Et(t,o,e),l=s.get(c);l===void 0&&this.contaBlocchi++,s.set(c,i);let u=i.charCodeAt(0)===97&&i.startsWith("acqua")&&(l===void 0||l.startsWith("acqua"));this._sporca(t,e,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(t,o,e),n||(this._annotaModifica(t,o,e,i),this.onEvento&&this.onEvento({tipo:"metti",cella:[t,o,e],blocco:i}))}togli(t,o,e,i=!1){let n=Bt(t,e),r=this.chunks.get(n);if(!r)return!1;let s=Et(t,o,e),c=r.get(s);if(!r.delete(s))return!1;this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let l=!!(c&&c.startsWith("acqua"));return this._sporca(t,e,l?this.sporchiAcqua:this.sporchi),l||this._cambiata(t,o,e),i||(this._annotaModifica(t,o,e,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[t,o,e]})),!0}occupaFurni(t,o){for(let[e,i,n]of t)this.furni.set(Et(e,i,n),o)}liberaFurni(t){for(let[o,e,i]of t)this.furni.delete(Et(o,e,i))}furniIn(t,o,e){return this.furni.get(Et(t,o,e))||null}occupaOmbra(t,o=!1){for(let[e,i,n]of t){let r=Et(e,i,n),s=this.ombreFurni.get(r);if(s){s.n++,o&&s.op++===0&&this._cambiata(e,i,n);continue}this.ombreFurni.set(r,{x:e,y:i,z:n,n:1,op:o?1:0}),this._cambiata(e,i,n)}}liberaOmbra(t,o=!1){for(let[e,i,n]of t){let r=Et(e,i,n),s=this.ombreFurni.get(r);s&&(o&&s.op>0&&--s.op===0&&s.n>1&&this._cambiata(e,i,n),!(--s.n>0)&&(this.ombreFurni.delete(r),this._cambiata(e,i,n)))}}ombraFurniIn(t,o,e){let i=this.ombreFurni.get(Et(t,o,e));return i?i.op>0?2:1:0}appoggioInColonna(t,o,e,i=8){for(let n=e;n>e-i;n--)if(this.calpestabile(t,n,o))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let t of this._rev.keys())this._rev.set(t,this._rev.get(t)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let t of this.chunks.values())for(let[o,e]of t)yield{x:Jt(o),y:ee(o),z:te(o),tipo:e}}perOgni(t){for(let o of this.chunks.values())for(let[e,i]of o)t(Jt(e),ee(e),te(e),i)}*blocchiDelChunk(t){let o=this.chunks.get(t);if(o)for(let[e,i]of o)yield{x:Jt(e),y:ee(e),z:te(e),tipo:i}}perOgniDelChunk(t,o){let e=this.chunks.get(t);if(e)for(let[i,n]of e)o(Jt(i),ee(i),te(i),n)}};function Ee(a,t,o){let e=a*374761393+t*668265263+o*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function zi(a){return a*a*(3-2*a)}function No(a,t,o){let e=Math.floor(a),i=Math.floor(t),n=zi(a-e),r=zi(t-i),s=Ee(e,i,o),c=Ee(e+1,i,o),l=Ee(e,i+1,o),u=Ee(e+1,i+1,o);return s+(c-s)*n+(l-s)*r+(s-c-l+u)*n*r}var Fo=5;function Mi(a,t,o,e=1){let i=[],n=t*16,r=o*16;for(let s=n;s<n+16;s++)for(let c=r;c<r+16;c++){let l=.55*No(s*.028,c*.028,e)+.3*No(s*.07,c*.07,e+11)+.15*No(s*.16,c*.16,e+29),u=Math.max(2,1+Math.round(Math.pow(Math.max(0,l),1.6)*22)),p=u<=Fo+1;for(let f=0;f<u;f++){let h=f===u-1?p?"sabbia":"erba":f<u-3?"roccia":"terra";a.metti(s,f,c,h,!0)}if(u<=Fo)for(let f=u;f<=Fo;f++)a.metti(s,f,c,"acqua",!0);else if(!p){let f=Ee(s*3+1,c*3+7,e+101);f>.988?i.push([s,u,c,"albero"]):f<.004&&i.push([s,u,c,"lampione"])}}return i}ct();var oe={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function yi(){for(let[a,t]of Object.entries(oe))kt(a,{nome:t.nome,cima:t.cima,lato:t.lato,fondo:t.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:t.modello},Qt)}ct();ct();var Pn={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:a=>a*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:a=>a*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:a=>a*.38+.58}}},ie="primavera";function Ti(){return ie}var Ae=null;function Ci(){return Ae}function Ye(a,t,o){let e=a>>16&255,i=a>>8&255,n=a&255,r=t>>16&255,s=t>>8&255,c=t&255,l=(u,p)=>Math.round(u+(p-u)*o);return l(e,r)<<16|l(i,s)<<8|l(n,c)}function Ze(a,t){if(Ae){let o=ie;ie=Ae.da;let e=Po(a,t);ie=Ae.a;let i=Po(a,t);ie=o;let n=Ae.mix;return{cima:He(e.cima,i.cima,n),lato:He(e.lato,i.lato,n),fondo:He(e.fondo,i.fondo,n),facce:e.facce,orlo:e.orlo!=null&&i.orlo!=null?He(e.orlo,i.orlo,n):e.orlo}}return Po(a,t)}function He(a,t,o){let e=Math.round((a>>16&255)+((t>>16&255)-(a>>16&255))*o),i=Math.round((a>>8&255)+((t>>8&255)-(a>>8&255))*o),n=Math.round((a&255)+((t&255)-(a&255))*o);return e<<16|i<<8|n}function Po(a,t){let o=k(a),e=Pn[ie],{cima:i,lato:n,fondo:r}=o;if(o.cappello&&e.erba&&!o.override&&(i=e.erba[qo(t,e.erba.length)]),o.reagisce==="stagione"&&e.erba){let s=e.erba[qo(t,e.erba.length)],c=o.reagisceForza??1;i=Ye(i,s,c),n=Ye(n,s,c*.45),r=Ye(r,s,c*.3)}else if(o.reagisce==="quota"){let s=qo(t,8)/7,c=(o.reagisceForza??1)*.5,l=u=>Ye(u,16777215,s*c);i=l(i),n=l(n),r=l(r)}return a==="sabbia"&&e.sabbia&&({cima:i,lato:n,fondo:r}=e.sabbia),{cima:i,lato:n,fondo:r,facce:o.facce||null,orlo:o.orlo!=null?o.orlo:void 0}}function Ft(a,t,o){if(a.facce){let e=t*2+(o>0?0:1),i=a.facce[e];if(i!=null)return i}return t===1?o>0?a.cima:a.fondo:a.lato}function qo(a,t=8){let o=(t-1)*2,e=(Math.round(a)%o+o)%o;return e>=t&&(e=o-e),e}var je=class{constructor(t,{x:o=.5,y:e=10,z:i=.5}={}){this.mondo=t,this.x=o,this.y=e,this.z=i,this.vy=0,this.aTerra=!1,this.verso=0,this._coyote=0}_solido(t,o,e){return this.mondo.solido(Math.floor(t),Math.floor(o),Math.floor(e))}_urta(t,o,e){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(t+n,o+.05,e+r)||this._solido(t+n,o+.9-.05,e+r))return!0;return!1}_pavimento(t,o,e){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(t+n,o-.02,e+r))return!0;return!1}aggiorna(t,o,e){let i=Math.min(t,.05),n=o.avanti||0,r=o.destra||0,s=Math.hypot(n,r),c=0,l=0;if(s>.01){let d=e?e.x:0,h=e?e.z:-1,m=Math.hypot(d,h)||1;d/=m,h/=m;let g=-h,v=d;c=(d*n+g*r)/s,l=(h*n+v*r)/s,this.verso=Math.atan2(c,l)}let u=c*4.6*i,p=l*4.6*i;if(u!==0&&(this._urta(this.x+u,this.y,this.z)?this._urta(this.x+u,this.y+1.02,this.z)||(this.x+=u,this.y+=1.02):this.x+=u),p!==0&&(this._urta(this.x,this.y,this.z+p)?this._urta(this.x,this.y+1.02,this.z+p)||(this.z+=p,this.y+=1.02):this.z+=p),this.aTerra?this._coyote=.08:this._coyote=Math.max(0,this._coyote-i),o.salta&&this._coyote>0&&(this.vy=8.2,this._coyote=0,this.aTerra=!1),this.vy<=0&&this._pavimento(this.x,this.y,this.z))return this.vy=0,this.aTerra=!0,this;this.vy-=26*i;let f=this.y+this.vy*i;if(this.vy<=0){let d=this.y-f,h=Math.max(1,Math.ceil(d/.4));for(let m=1;m<=h;m++){let g=this.y-d*m/h;if(this._pavimento(this.x,g,this.z))return this.y=Math.floor(g-.02)+1,this.vy=0,this.aTerra=!0,this}this.aTerra=!1,this.y=f}else this._urta(this.x,f,this.z)&&(this.vy=0,f=this.y),this.y=f,this.aTerra=!1;return this}};function Si(a=window){let t=new Set,o={avanti:0,destra:0,salta:!1},e={KeyW:"su",ArrowUp:"su",KeyS:"giu",ArrowDown:"giu",KeyA:"sinistra",ArrowLeft:"sinistra",KeyD:"destra",ArrowRight:"destra",Space:"salta"},i=(n,r)=>{let s=e[n.code];s&&(n.target&&/^(INPUT|TEXTAREA)$/.test(n.target.tagName)||(r?t.add(s):t.delete(s),s==="salta"&&n.preventDefault(),o.avanti=(t.has("su")?1:0)-(t.has("giu")?1:0),o.destra=(t.has("destra")?1:0)-(t.has("sinistra")?1:0),o.salta=t.has("salta")))};return a.addEventListener("keydown",n=>i(n,!0)),a.addEventListener("keyup",n=>i(n,!1)),a.addEventListener("blur",()=>{t.clear(),o.avanti=o.destra=0,o.salta=!1}),o}function Uo(a,t,o,e=7){let i=Math.floor(t.x),n=Math.floor(t.y),r=Math.floor(t.z),s=Math.sign(o.x),c=Math.sign(o.y),l=Math.sign(o.z),u=s!==0?Math.abs(1/o.x):1/0,p=c!==0?Math.abs(1/o.y):1/0,f=l!==0?Math.abs(1/o.z):1/0,d=s!==0?(s>0?i+1-t.x:t.x-i)*u:1/0,h=c!==0?(c>0?n+1-t.y:t.y-n)*p:1/0,m=l!==0?(l>0?r+1-t.z:t.z-r)*f:1/0;if(a.solido(i,n,r))return{cella:[i,n,r],faccia:[0,1,0],prima:[i,n+1,r]};for(let g=0;g<e*3+3;g++){let v=0,b=0,x=0;if(d<=h&&d<=m){if(d>e)break;i+=s,d+=u,v=-s}else if(h<=m){if(h>e)break;n+=c,h+=p,b=-c}else{if(m>e)break;r+=l,m+=f,x=-l}if(a.solido(i,n,r))return{cella:[i,n,r],faccia:[v,b,x],prima:[i+v,n+b,r+x]}}return null}function Do(a,t,o,e,i,n=null){let r=0,s=i,c=-1,l=0,u=["x","y","z"];for(let p=0;p<3;p++){let f=u[p],d=t[f];if(Math.abs(d)<1e-9){if(a[f]<o[f]||a[f]>e[f])return-1;continue}let h=(o[f]-a[f])/d,m=(e[f]-a[f])/d,g=-1;if(h>m){let v=h;h=m,m=v,g=1}if(h>r&&(r=h,c=p,l=g),m<s&&(s=m),r>s)return-1}return n&&c>=0&&(n[0]=n[1]=n[2]=0,n[c]=l),r}function Ri(a,t,o,e,i=7){let n=Uo(a,t,o,i),r=1/0;if(n){let l=n.cella,u=l[0]+.5-t.x,p=l[1]+.5-t.y,f=l[2]+.5-t.z;r=Math.sqrt(u*u+p*p+f*f)}let s=null,c=r;for(let l of e||[]){let u=Do(t,o,l.min,l.max,i);u>=0&&u<c&&(c=u,s=l)}if(s){let l=s.dato&&s.dato.cella,u=n&&n.prima,p=n&&n.faccia;if(l){let f=[0,0,0],d=Do(t,o,{x:l[0],y:l[1],z:l[2]},{x:l[0]+1,y:l[1]+1,z:l[2]+1},i,f);d<0&&(d=Do(t,o,s.min,s.max,i,f)),d>=0&&(f[0]||f[1]||f[2])&&(u=[l[0]+f[0],l[1]+f[1],l[2]+f[2]],p=f),u||(u=[l[0],l[1]+1,l[2]],p=[0,1,0])}return{...n,cella:n?n.cella:l||null,faccia:p,scatola:s,dato:s.dato,distanza:c,prima:u}}return n}ct();var Ke=[null,"erba","terra","pietra","mattoni","legno","sabbia","neve","lanaRossa","lanaBlu","lanaGialla","lampadaPesante","lampadaRossa","lampadaVerde","lampadaBlu","lucciola","albero","lampione","erbetta"],At={erbetta:{nome:"Erbetta",colore:6601551,agisce:"erba"}};function Li(a,t,o,e){let i=a.tipo(t,o,e);if(i==null)return!0;let n=k(i);return!!(n&&n.acqua)}var We=class{constructor(){this.dove=null,this.durata=550,this.inizio=0,this._ultimeSchegge=0}premi(t,o,e){this.dove!==t&&(this.dove=t,this.durata=Math.max(60,o||550),this.inizio=e,this._ultimeSchegge=e)}molla(){this.dove=null,this.inizio=0}progresso(t){return this.dove?Math.min(1,(t-this.inizio)/this.durata):0}finito(t){return!this.dove||this.progresso(t)<1?!1:(this.molla(),!0)}schegge(t){return!this.dove||t-this._ultimeSchegge<130?!1:(this._ultimeSchegge=t,!0)}};function Oi(a){return a?a.salute>=100?1100:a.fam==="mina"?750:a.fam==="taglia"?600:380:550}function Ii(a,t){let o=new Map;a.addEventListener("pointerdown",i=>{o.set(i.pointerId+":"+i.button,{x:i.clientX,y:i.clientY,t:performance.now()})});let e=i=>{let n=i.pointerId+":"+i.button,r=o.get(n);if(!r)return;o.delete(n),Math.hypot(i.clientX-r.x,i.clientY-r.y)<=6&&performance.now()-r.t<=500&&t(i)};a.addEventListener("pointerup",e),a.addEventListener("pointercancel",i=>{for(let n of[...o.keys()])n.startsWith(i.pointerId+":")&&o.delete(n)})}function wi(a,{onInizio:t,onFine:o},e=0){let i=null,n=s=>{i&&(i=null,o&&o(s))};a.addEventListener("pointerdown",s=>{s.button===e&&(i={id:s.pointerId,x:s.clientX,y:s.clientY},t&&t(s))}),a.addEventListener("pointermove",s=>{!i||s.pointerId!==i.id||Math.hypot(s.clientX-i.x,s.clientY-i.y)>6&&n("trascinamento")});let r=s=>{i&&s.pointerId===i.id&&n("rilascio")};a.addEventListener("pointerup",r),a.addEventListener("pointercancel",r),addEventListener("blur",()=>n("fuoco perso"))}var qn=`
/* \u26A0 SI VEDONO SOLO IN MODALIT\xC0 A DITO, e la classe la decide \xABui/modo.js\xBB.
   Prima i comandi si creavano solo se il browser diceva \xABtocco\xBB, e su un
   convertibile quella era una scelta fatta una volta per sempre all'avvio. */
#comandi { display: none; }
.gui-tocco #comandi { display: block; position: fixed; inset: 0; z-index: 15; pointer-events: none;
  font: 12px/1 ui-monospace, monospace; color: #0d2a1a; user-select: none;
  -webkit-user-select: none; touch-action: none; }
#comandi .stick { position: absolute; left: 18px; bottom: 96px; width: 116px; height: 116px;
  border-radius: 50%; background: rgba(255,255,255,.42); border: 1px solid rgba(13,42,26,.16);
  pointer-events: auto; }
#comandi .knob { position: absolute; left: 50%; top: 50%; width: 46px; height: 46px;
  margin: -23px 0 0 -23px; border-radius: 50%; background: rgba(255,255,255,.92);
  border: 1px solid rgba(13,42,26,.22); }
#comandi .btn { position: absolute; right: 18px; width: 62px; height: 62px; border-radius: 50%;
  background: rgba(255,255,255,.72); border: 1px solid rgba(13,42,26,.18);
  pointer-events: auto; display: flex; align-items: center; justify-content: center;
  font-size: 20px; padding: 0; color: #0d2a1a; }
#comandi .btn.premuto { background: rgba(13,42,26,.16); }
#comandi .salta { bottom: 96px; }
#comandi .demolisci { bottom: 168px; font-size: 22px; }
#comandi .demolisci.acceso { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
`,Qe=class{constructor(t,{visibile:o=!0,onDemolisci:e=null}={}){this.intento=t,this.demolisci=!1;let i=document.createElement("style");i.textContent=qn,document.head.appendChild(i);let n=this.root=document.createElement("div");n.id="comandi",n.innerHTML=`
      <div class="stick"><div class="knob"></div></div>
      <button class="btn salta" title="Salta">\u2934</button>
      <!-- \u26A0 SUL TELEFONO IL DITO \xC8 UN TASTO SOLO, e questo bottone dice quale
           dei due sta emulando: acceso = il sinistro (rompe, a colpi ripetuti),
           spento = il destro (posa, o accende a mano vuota). Senza di lui met\xE0
           dei verbi del gioco sarebbero irraggiungibili col tocco. -->
      <button class="btn demolisci" title="Piccone: i tocchi rompono (a pi\xF9 colpi)">\u26CF</button>`,document.body.appendChild(n),o||this.mostra(!1);let r=n.querySelector(".stick"),s=n.querySelector(".knob"),c=null,l=0,u=0,p=58,f=(x,A)=>{s.style.transform=`translate(${x*p*.62}px, ${A*p*.62}px)`,this.intento.avanti=-A,this.intento.destra=x},d=x=>{if(x.pointerId!==c)return;let A=(x.clientX-l)/p,E=(x.clientY-u)/p,M=Math.hypot(A,E);M>1&&(A/=M,E/=M),f(A,E),x.preventDefault()};r.addEventListener("pointerdown",x=>{c=x.pointerId;try{r.setPointerCapture(x.pointerId)}catch{}let A=r.getBoundingClientRect();l=A.left+A.width/2,u=A.top+A.height/2,p=A.width/2,d(x)}),r.addEventListener("pointermove",d);let h=x=>{x.pointerId===c&&(c=null,f(0,0))};r.addEventListener("pointerup",h),r.addEventListener("pointercancel",h);let m=n.querySelector(".salta"),g=x=>{x.preventDefault(),this.intento.salta=!0,m.classList.add("premuto")},v=()=>{this.intento.salta=!1,m.classList.remove("premuto")};m.addEventListener("pointerdown",g),m.addEventListener("pointerup",v),m.addEventListener("pointercancel",v),m.addEventListener("pointerleave",v);let b=n.querySelector(".demolisci");b.addEventListener("pointerdown",x=>{x.preventDefault(),this.demolisci=!this.demolisci,b.classList.toggle("acceso",this.demolisci),e&&e(this.demolisci)})}mostra(t){this.root.style.display=t?"":"none"}azzera(){this.intento.avanti=0,this.intento.destra=0,this.intento.salta=!1;let t=this.root.querySelector(".knob");t&&(t.style.transform="")}};var Ni="leafy.gui",Dn="gui-tocco";var Je=class{constructor(t){this.onCambio=t,this.scelta=(()=>{try{return localStorage.getItem(Ni)||"auto"}catch{return"auto"}})();let o=document.createElement("style");if(o.textContent=`
`,document.head.appendChild(o),this.nodo=document.createElement("div"),this.nodo.id="modoGui",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.cicla()),typeof matchMedia=="function"){this._mq=matchMedia("(pointer: coarse)");let e=()=>{this.scelta==="auto"&&this.applica()};this._mq.addEventListener&&this._mq.addEventListener("change",e)}this.applica()}get automatico(){return!!(this._mq&&this._mq.matches)}get aTocco(){return this.scelta==="tocco"?!0:this.scelta==="mouse"?!1:this.automatico}cicla(){this.scelta=this.scelta==="auto"?"tocco":this.scelta==="tocco"?"mouse":"auto";try{localStorage.setItem(Ni,this.scelta)}catch{}this.applica()}applica(){let t=this.aTocco;document.documentElement.classList.toggle(Dn,t),this.nodo.classList.toggle("fissato",this.scelta!=="auto"),this.nodo.innerHTML=t?"<b>\u{1F4F1}</b> a dito":"<b>\u{1F5A5}</b> col mouse",this.nodo.title=this.scelta==="auto"?`Interfaccia: automatica (adesso ${t?"a dito":"col mouse"}) \u2014 tocca per fissarla`:`Interfaccia: ${t?"a dito":"col mouse"}, fissata \u2014 tocca per cambiare`,this.onCambio&&this.onCambio(t)}};function Fi(a={}){let t=(o,e=1)=>typeof o=="number"&&isFinite(o)?+o.toFixed(e):null;return{quando:a.quando||null,gioco:"Leafy-Shadows",versione:a.versione||"in sviluppo",nota:typeof a.nota=="string"?a.nota.slice(0,400):"",dispositivo:{classe:a.mobile?"mobile":"desktop",tocco:!!a.tocco,modoGui:a.modoGui||"auto",ua:(a.ua||"").slice(0,220),cpu:a.cpu||null,memoriaGB:a.memoriaGB||null},schermo:{css:a.css||null,reso:a.reso||null,dpr:t(a.dpr,3),rapporto:a.css&&a.reso&&a.css[0]?t(a.reso[0]/a.css[0],2):null},qualita:{livello:a.livello,di:a.quantiLivelli,manuale:!!a.manuale,profilo:a.profilo||null,ombreLampade:!!a.ombreLampade,antialias:!!a.antialias},prestazioni:{fps:t(a.fps,0),p50ms:t(a.p50,2),p99ms:t(a.p99,2),disegni:a.disegni??null,triangoli:a.triangoli??null,ombreMs:t(a.ombreMs,2),storiaFps:Array.isArray(a.storiaFps)?a.storiaFps.slice(-60).map(o=>Math.round(o)):[],storiaLivelli:Array.isArray(a.storiaLivelli)?a.storiaLivelli.slice(-20):[]},scheda:{nome:(a.scheda||"").slice(0,120),software:!!a.software},mondo:{chunk:a.chunk??null,blocchi:a.blocchi??null,luci:a.luci??null,decorazioni:a.decorazioni??null,erba:a.erba??null,ora:a.ora||null,giorno:a.giorno??null,worldgenMs:t(a.worldgenMs,0),meshMs:t(a.meshMs,0)},errori:(a.errori||[]).slice(-12).map(o=>String(o).slice(0,500)),scatto:a.scatto||null}}function Pi(a){return Math.round(JSON.stringify(a).length/1024)}var Un=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Rt=(a,t)=>a>>>t|a<<32-t;function qi(a){let t=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),o=a.length*8,e=new Uint8Array(a.length+9+63>>6<<6);e.set(a),e[a.length]=128,new DataView(e.buffer).setUint32(e.length-4,o>>>0),new DataView(e.buffer).setUint32(e.length-8,Math.floor(o/4294967296));let i=new Uint32Array(64),n=new DataView(e.buffer);for(let s=0;s<e.length;s+=64){for(let g=0;g<16;g++)i[g]=n.getUint32(s+g*4);for(let g=16;g<64;g++){let v=Rt(i[g-15],7)^Rt(i[g-15],18)^i[g-15]>>>3,b=Rt(i[g-2],17)^Rt(i[g-2],19)^i[g-2]>>>10;i[g]=i[g-16]+v+i[g-7]+b>>>0}let[c,l,u,p,f,d,h,m]=t;for(let g=0;g<64;g++){let v=Rt(f,6)^Rt(f,11)^Rt(f,25),b=f&d^~f&h,x=m+v+b+Un[g]+i[g]>>>0,A=Rt(c,2)^Rt(c,13)^Rt(c,22),E=c&l^c&u^l&u,M=A+E>>>0;m=h,h=d,d=f,f=p+x>>>0,p=u,u=l,l=c,c=x+M>>>0}t[0]=t[0]+c>>>0,t[1]=t[1]+l>>>0,t[2]=t[2]+u>>>0,t[3]=t[3]+p>>>0,t[4]=t[4]+f>>>0,t[5]=t[5]+d>>>0,t[6]=t[6]+h>>>0,t[7]=t[7]+m>>>0}let r="";for(let s of t)r+=s.toString(16).padStart(8,"0");return r}var kn="https://ntfy.sh",Bn=4096;async function Vn(a){let t=new TextEncoder().encode("leafy-shadows/"+a),o;if(globalThis.crypto&&crypto.subtle){let e=await crypto.subtle.digest("SHA-256",t);o=[...new Uint8Array(e)].map(i=>i.toString(16).padStart(2,"0")).join("")}else o=qi(t);return"leafy-"+o.slice(0,24)}async function Di(a,t){let o=await Vn(a),e=await fetch(`${kn}/${o}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:t});if(!e.ok)return{ok:!1,dice:`il servizio ha detto no: ${e.status}`};let i=await e.json().catch(()=>({})),n=t.length>Bn;return{ok:!0,id:i.id||"",dice:n?`mandato \u2714 (${Math.round(t.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(t.length/1024)} KB, dura 12 ore)`}}var Ui="leafy.diagnostica.chiave",Gn=`
/* \u26A0 UNA PILLOLA CON LA SCRITTA, NON UN'ICONA MUTA. La prima versione erano due
   tondini da 34 px sul bordo sinistro, semitrasparenti, sopra una scena piena di
   verde: sul telefono il committente non li ha proprio VISTI \u2014 \xABnon vedo il
   tasto per la diagnosi e dove mettere poi la password\xBB. Un'icona da sola
   chiede di indovinare cosa fa; una parola no. E costa una manciata di pixel di
   larghezza in una fascia dello schermo che \xE8 comunque vuota. */
#diag, #modoGui {
  position: fixed; left: 8px; z-index: 30; height: 34px; padding: 0 11px 0 9px;
  border-radius: 17px; cursor: pointer; white-space: nowrap;
  border: 2px solid rgba(13,42,26,.22); background: rgba(255,255,255,.92);
  font: 600 12px/1 system-ui, sans-serif; color: #0d2a1a;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(13,42,26,.14);
  -webkit-tap-highlight-color: transparent; user-select: none;
}
#diag b, #modoGui b { font: 15px/1 system-ui, sans-serif; }
#diag { top: calc(46% + 42px); }
#modoGui { top: 46%; }
#diag:hover, #modoGui:hover { background: #fff; }
#diag.corso { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
/* \u26A0 ACCESO = SCELTA A MANO. Quando segue il browser resta smorto: se no non si
   distingue \xABl'ho deciso io\xBB da \xABl'ha indovinato lui\xBB, e sono due cose diverse
   nel momento in cui una va bene e l'altra no. */
#modoGui.fissato { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
/* a dito tutto cresce: il bersaglio dev'essere un bersaglio per un pollice */
.gui-tocco #diag, .gui-tocco #modoGui { height: 42px; padding: 0 14px 0 11px; font-size: 13px; border-radius: 21px; }
.gui-tocco #diag b, .gui-tocco #modoGui b { font-size: 18px; }
.gui-tocco #diag { top: calc(46% + 50px); }

#diagPanel { position: fixed; inset: auto 12px 12px 12px; z-index: 40;
  max-width: 420px; margin: 0 auto; padding: 12px 14px; border-radius: 12px;
  background: rgba(255,255,255,.97); border: 1px solid rgba(13,42,26,.18);
  font: 13px/1.5 system-ui, sans-serif; color: #0d2a1a; display: none;
  box-shadow: 0 6px 24px rgba(13,42,26,.18); }
#diagPanel.aperto { display: block; }
#diagPanel h4 { margin: 0 0 6px; font-size: 14px; }
#diagPanel p { margin: 0 0 8px; color: #3c5a4a; }
#diagPanel input { width: 100%; box-sizing: border-box; padding: 10px; border-radius: 8px;
  border: 1px solid rgba(13,42,26,.25); font: 13px ui-monospace, monospace; margin-bottom: 8px; }
/* \u26A0 IL CAMPO DELLA PASSWORD SI DEVE VEDERE CHE \xC8 QUELLO: committente, \xABdove
   mettere poi la password per mandartelo\xBB. Bordo scuro e sfondo appena tinto. */
#diagPanel input#diagChiave { border: 2px solid #0d2a1a; background: #f4f8f5; }
#diagPanel .righe { display: flex; gap: 8px; }
#diagPanel button { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(13,42,26,.22); background: #fff; font: 13px system-ui, sans-serif; }
#diagPanel button.primo { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
#diagPanel .esito { margin-top: 8px; font: 12px ui-monospace, monospace; white-space: pre-wrap; }
`,to=class{constructor(t,o){this.leggi=t,this.scatta=o,this.errori=[],addEventListener("error",i=>this._errore(i.error||i.message)),addEventListener("unhandledrejection",i=>this._errore(i.reason));let e=document.createElement("style");e.textContent=Gn,document.head.appendChild(e),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(t){let o=t&&t.stack?t.stack:String(t);this.errori.push(o),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(Ui)||""}catch{return""}}set chiave(t){try{localStorage.setItem(Ui,t)}catch{}}apri(){let t=this.pannello;t.classList.add("aperto"),t.innerHTML=`
      <h4>Manda la diagnostica</h4>
      <p>${this.chiave?"Numeri, storia degli fps, errori e uno scatto. Niente di personale.":"<b>Serve la password.</b> Non \xE8 un lucchetto: \xE8 l'indirizzo dove finisce il rapporto. Si mette una volta sola su questo dispositivo."}</p>
      <input id="diagNota" placeholder="Cosa stavi facendo? (facoltativo)" maxlength="200">
      <!-- \u26A0 LO SCATTO \xC8 UTILISSIMO E COSTOSO INSIEME, quindi si sceglie. Con la
           figura il rapporto sta sui 60 KB e sul cloud diventa un ALLEGATO, che
           dura tre ore invece di dodici; senza sono due kilobyte, cio\xE8 davvero
           \xABun messaggio\xBB. Chi manda dal treno e mi scrive dopo mezza giornata
           deve poter togliere la figura. -->
      <label style="display:flex;gap:7px;align-items:center;margin:-2px 0 9px;color:#3c5a4a">
        <input type="checkbox" id="diagScatto" checked style="width:auto;margin:0">
        con lo scatto della scena (pi\xF9 pesante, dura meno)
      </label>
      ${this.chiave?"":'<input id="diagChiave" placeholder="password (una volta per dispositivo)" autocomplete="off" autocapitalize="none" autocorrect="off" spellcheck="false">'}
      <div class="righe">
        <button class="primo" id="diagVai">Manda</button>
        <button id="diagCopia">Copia</button>
        <button id="diagChiudi">Chiudi</button>
      </div>
      <div class="esito" id="diagEsito"></div>`,t.querySelector("#diagChiudi").onclick=()=>t.classList.remove("aperto"),t.querySelector("#diagCopia").onclick=()=>this.vai(!0),t.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let o=t.querySelector("#diagNota");o&&o.focus()},30)}_dice(t){let o=this.pannello.querySelector("#diagEsito");o&&(o.textContent=t)}async vai(t){let o=this.pannello.querySelector("#diagChiave");o&&o.value.trim()&&(this.chiave=o.value.trim());let e=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let i=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,n=null;if(i)try{n=this.scatta?await this.scatta():null}catch(u){this._errore(u)}let r=Fi({...this.leggi(),quando:new Date().toISOString(),nota:e,errori:this.errori,scatto:n}),s=Pi(r),c=JSON.stringify(r,null,1);if(t){await this._negliAppunti(c),this.nodo.classList.remove("corso");return}let l=!1;try{let u=await fetch("/_diagnostica",{method:"GET"});l=u.ok&&(await u.json().catch(()=>({}))).collettore===!0}catch{l=!1}if(l)try{let u=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:c});if(u.status===403)this._dice("password sbagliata."),this.chiave="";else if(u.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!u.ok)this._dice("il collettore ha detto no: "+u.status);else{let p=await u.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${p.nome||""}  (${s} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let u=await Di(this.chiave,c);this._dice(u.ok?u.dice+`
(fuori casa: passa dal cloud)`:u.dice),u.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(c,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(t,o=""){try{await navigator.clipboard.writeText(t),this._dice(o+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let e=new Blob([t],{type:"application/json"}),i=document.createElement("a");i.href=URL.createObjectURL(e),i.download="leafy-diagnostica.json",i.click(),setTimeout(()=>URL.revokeObjectURL(i.href),4e3),this._dice(o+`scaricato come file \u2714
mandami quello.`)}}};var Xn=4,eo=class{constructor(t,o,{margineGenera:e=2*C,margineTieni:i=6*C}={}){this.mondo=t,this.genera=o,this.margineGenera=e,this.margineTieni=i,this._coda=[],this._chunkOsservatore=null,this.statistiche={generati:0,scaricati:0,inCoda:0,ultimaMs:0},t.frontiera=this}assicura(t,o,e,{subito:i=!1}={}){let n=performance.now(),r=Math.floor(t/C),s=Math.floor(o/C),c=r+","+s,l=e&&Number.isFinite(e.resa)?e.resa:4*C;(c!==this._chunkOsservatore||i)&&(this._chunkOsservatore=c,this._riesamina(r,s,t,o,l));let u=0,p=i?1/0:Xn;for(;this._coda.length&&u<p;){let f=this._coda.shift();this.mondo.generati.has(f)||(this._generaChunk(f),u++)}return this.statistiche.inCoda=this._coda.length,this.statistiche.ultimaMs=performance.now()-n,u}_riesamina(t,o,e,i,n){let r=n+this.margineGenera,s=n+this.margineTieni,c=Math.ceil(r/C)+1,l=[];for(let u=-c;u<=c;u++)for(let p=-c;p<=c;p++){let f=t+u+","+(o+p);if(this.mondo.generati.has(f))continue;let d=ki(t+u,o+p,e,i);d<=r&&l.push([d,f])}l.sort((u,p)=>u[0]-p[0]),this._coda=l.map(u=>u[1]);for(let u of[...this.mondo.generati]){let p=u.indexOf(",");ki(+u.slice(0,p),+u.slice(p+1),e,i)>s&&this._scaricaChunk(u)}}_generaChunk(t){let o=t.indexOf(","),e=+t.slice(0,o),i=+t.slice(o+1),n=this.genera(this.mondo,e,i)||[];this.mondo.segnaGenerato(t);let r=this.mondo.modifiche.get(t);for(let[s,c,l,u]of n)r&&r.has(Vi(s,c,l))||(this.mondo.metti(s,c,l,u),this.mondo.modifiche.get(t)?.delete(Vi(s,c,l)));this.mondo.applicaModifiche(t),this.statistiche.generati++}_scaricaChunk(t){let o=this.mondo.scaricaChunk(t);if(this.mondo.onEvento)for(let[e,i,n]of o)this.mondo.onEvento({tipo:"togli",cella:[e,i,n]});this.statistiche.scaricati++}};function ki(a,t,o,e){let i=a*C,n=t*C,r=Math.max(i-o,0,o-(i+C)),s=Math.max(n-e,0,e-(n+C));return Math.sqrt(r*r+s*s)}var Bi=2048,$n=64,Vi=(a,t,o)=>((a+Bi)*4096+(o+Bi))*256+(t+$n);ct();function ko(a,t,o){let e=(a|0)*374761393+(t|0)*668265263+(o|0)*2147483647;return e=(e^e>>>13)*1274126177,e=e^e>>>16,(e>>>0)%1e3/1e3}function Yn(a,t){let o=a>>16&255,e=a>>8&255,i=a&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+t))));return n(o)<<16|n(e)<<8|n(i)}function Hn(a,t,o,e,i,n){if(!t||t==="liscio"||!o)return a;let r=0;return t==="chiazze"?r=(ko(e,i,n)-.5)*2:t==="venature"?r=(ko(0,i,0)-.5)*2*.7+(ko(e,i,n)-.5)*.3:t==="sfumato"&&(r=(i%16+16)%16/16-.5),Yn(a,r*o*.34)}function Gi(a,t,o,e,i,n){if(!t||t==="liscio"||!o)return a;let r=s=>Hn(s,t,o,e,i,n);return{cima:r(a.cima),lato:r(a.lato),fondo:r(a.fondo),facce:a.facce?a.facce.map(r):null}}var Xi={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},Zn=Object.keys(Xi);function $i(a){return!a||!a.materia?null:Xi[a.materia]||null}function Vt(a,t,o=0){if(!t)return a;let e=(a>>16&255)/255,i=(a>>8&255)/255,n=(a&255)/255,r=.2126*e+.7152*i+.0722*n,s=t.satura;e=r+(e-r)*s,i=r+(i-r)*s,n=r+(n-r)*s;let c=t.tinta*(1+o),l=u=>Math.max(0,Math.min(255,Math.round(u*c*255)));return l(e)<<16|l(i)<<8|l(n)}var jn=16;function Yi(a){let t=Zn.indexOf(a);return t<0||t+1>=jn?0:t+1}var Bo=1/16,Hi=8*Bo,_t=9*Bo;function Zi(a,t,o,e,i,n,r,s){let c=(u,p,f)=>[t+u,o+p,e+f];a.quad(c(-s,r,-s),c(s,r,-s),c(s,r,s),c(-s,r,s),Ft(i,1,1),[0,1,0]),a.quad(c(-s,n,-s),c(s,n,-s),c(s,n,s),c(-s,n,s),Ft(i,1,-1),[0,-1,0]);let l=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of l){let[p,,f]=u.d,d=-f,h=p,m=(g,v)=>c(p*s+d*v,g,f*s+h*v);a.quad(m(n,-s),m(r,-s),m(r,s),m(n,s),Ft(i,u.asse,u.segno),u.d)}}function Kn(a,t,o,e,i){Zi(a,t,o,e,i,-_t,0,Hi)}function Wn(a,t,o,e,i){Zi(a,t,o,e,i,-_t,_t,5*Bo)}function Qn(a,t,o,e,i){let n=(l,u,p)=>[t+l,o+u,e+p],r=Ft(i,0,1),s=Hi,c=[[[-s,-_t,-s],[s,-_t,s],[s,_t,s],[-s,_t,-s],[1,0,-1]],[[-s,-_t,s],[s,-_t,-s],[s,_t,-s],[-s,_t,s],[1,0,1]]];for(let[l,u,p,f,d]of c)a.quad(n(...l),n(...u),n(...p),n(...f),r,d),a.quad(n(...l),n(...u),n(...p),n(...f),r,[-d[0],-d[1],-d[2]])}function Jn(){}var ji={lastra:Kn,pilastro:Wn,croce:Qn,modello:Jn},_e=new Set(["lastra","pilastro","croce","modello"]);var ze=1/16,tr=[[0,1],[0,2],[1,2]],er=[[1,0],[-1,0],[0,1],[0,-1]];function Gt(a,t,o,e,i,n,r,s,c){let l=[a,t,o];return l[e]+=i,l[n]+=r,l[s]+=c,l}var Ki={tinta:1,satura:1};function Wi(a,t,o,e,i,n,r=0){let s=8*ze,c=9*ze,l=(u,p)=>n(u===0?p:0,u===1?p:0,u===2?p:0);for(let u=0;u<3;u++)for(let p of[-1,1]){if(l(u,p))continue;let f=(u+1)%3,d=(u+2)%3,h=Ft(i,u,p),m=[0,0,0];m[u]=p,a.quad(Gt(t,o,e,u,p*c,f,-s,d,-s),Gt(t,o,e,u,p*c,f,+s,d,-s),Gt(t,o,e,u,p*c,f,+s,d,+s),Gt(t,o,e,u,p*c,f,-s,d,+s),h,m)}for(let[u,p]of tr){let f=3-u-p;for(let d of[-1,1])for(let h of[-1,1]){if(l(u,d)||l(p,h))continue;let m=u===1&&d>0||p===1&&h>0,g=u===1&&d<0||p===1&&h<0,v=m?i.cima:g?i.fondo:i.lato,b=r?Vt(v,Ki,r):v,x=[0,0,0];x[u]=d,x[p]=h,a.quad(Gt(t,o,e,u,d*c,p,h*s,f,-s),Gt(t,o,e,u,d*s,p,h*c,f,-s),Gt(t,o,e,u,d*s,p,h*c,f,+s),Gt(t,o,e,u,d*c,p,h*s,f,+s),b,x)}}for(let u of[-1,1])for(let p of[-1,1])for(let f of[-1,1])l(0,u)||l(1,p)||l(2,f)||a.tri([t+u*c,o+p*s,e+f*s],[t+u*s,o+p*c,e+f*s],[t+u*s,o+p*s,e+f*c],r?Vt(p>0?i.cima:i.fondo,Ki,r):p>0?i.cima:i.fondo,[u,p,f])}function Qi(a,t,o,e,i,n){let r=(d,h)=>n(d,0,h),s=n(0,-1,0),c=i.cima,l=i.lato,u=i.fondo,p=i.orlo??i.cima,f=(d,h,m)=>[t+d*ze,o+h*ze,e+m*ze];s||a.quad(f(-8,-9,-8),f(8,-9,-8),f(8,-9,8),f(-8,-9,8),u,[0,-1,0]);for(let[d,h]of er){if(r(d,h))continue;let m=-h,g=d,v=(x,A,E)=>f(x*d+E*m,A,x*h+E*g),b=[d,0,h];s||a.quad(v(8,-9,-8),v(9,-8,-8),v(9,-8,8),v(8,-9,8),u,[d,-1,h]),a.quad(v(9,-8,-8),v(9,2,-8),v(9,2,8),v(9,-8,8),l,b),a.quad(v(9,2,-8),v(10,3,-8),v(10,3,8),v(9,2,8),p,b),a.quad(v(10,3,-8),v(10,7,-8),v(10,7,8),v(10,3,8),p,b),a.quad(v(10,7,-8),v(9,8,-8),v(9,8,8),v(10,7,8),c,[d,1,h]),a.quad(v(8,8,-8),v(9,8,-8),v(9,8,8),v(8,8,8),c,[0,1,0])}for(let d of[-1,1])for(let h of[-1,1]){if(r(d,0)||r(0,h))continue;let m=(v,b,x)=>f(v*d,b,x*h),g=[d,0,h];s||a.tri(m(9,-8,8),m(8,-9,8),m(8,-8,9),u,[d,-1,h]),a.quad(m(9,-8,8),m(8,-8,9),m(8,2,9),m(9,2,8),l,g),a.quad(m(9,2,8),m(8,2,9),m(8,3,10),m(10,3,8),p,g),a.quad(m(10,3,8),m(8,3,10),m(8,7,10),m(10,7,8),p,g),a.quad(m(10,7,8),m(8,7,10),m(8,8,9),m(9,8,8),c,[d,1,h]),a.tri(m(8,8,8),m(9,8,8),m(8,8,9),c,[0,1,0])}a.quad(f(-8,8,-8),f(8,8,-8),f(8,8,8),f(-8,8,8),c,[0,1,0])}ct();ct();var or=2,Me=6,ir=256;function Ji(a){if(!a)return!1;let t=k(a);return!t.acqua&&!t.vetro&&!_e.has(t.forma)}function ea(a,t,o,e){let i=t.indexOf(","),n=+t.slice(0,i),r=+t.slice(i+1),s=n*C-Me,c=r*C-Me,l=C+2*Me,u=e-o+1,p=l,f=l*u*p,d=new Uint8Array(f),h=new Uint8Array(f),m=new Uint8Array(f),g=(E,M,O)=>((E-s)*u+(M-o))*p+(O-c),v=(E,M,O)=>E>=s&&E<s+l&&M>=o&&M<=e&&O>=c&&O<c+p,b=[];for(let E=s;E<s+l;E++)for(let M=c;M<c+p;M++){let O=!1;for(let N=e;N>=o;N--){let z=a.tipo(E,N,M),_=g(E,N,M);if(Ji(z)){m[_]=1,O=!0;continue}if(!O&&N===e){for(let S=e+1;S<ir&&S<e+40;S++)if(Ji(a.tipo(E,S,M))){O=!0;break}}if(O||(d[_]=15),z){let L=k(z).forma==="modello"&&oe[z];L&&L.luce&&b.push([E,N+Math.round(L.luce.quota??1),M])}}}let x=[];for(let E=0;E<f;E++)d[E]===15&&x.push(E);ta(x,d,m,l,u,p,1);let A=[];for(let[E,M,O]of b){if(!v(E,M,O))continue;let N=g(E,M,O);h[N]=15,A.push(N)}return ta(A,h,m,l,u,p,or),{x0:s,z0:c,yMin:o,yMax:e,W:l,H:u,D:p,cielo:d,blocco:h,leggi(E,M,O){if(!v(E,M,O))return M>e?[15,0]:[0,0];let N=g(E,M,O);return[d[N],h[N]]}}}function ta(a,t,o,e,i,n,r){let s=[i*n,-i*n,n,-n,1,-1],c=0;for(;c<a.length;){let l=a[c++],u=t[l]-r;if(u<=0)continue;let p=Math.floor(l/(i*n)),f=Math.floor(l/n)%i,d=l%n;for(let h=0;h<6;h++){if(h===0&&p===e-1||h===1&&p===0||h===2&&f===i-1||h===3&&f===0||h===4&&d===n-1||h===5&&d===0)continue;let m=l+s[h];o[m]||t[m]>=u||(t[m]=u,a.push(m))}}}var oa=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function Lt(a,t,o){let e=a*374761393+t*668265263+o*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}var oo=class{constructor(t,o=512){this.yBase=t,this.byte=new Uint8Array(o*12),this.n=0}_lamella(t,o,e,i,n,r,s,c,l,u=0,p=8){if((this.n+1)*12>this.byte.length){let h=new Uint8Array(this.byte.length*2);h.set(this.byte),this.byte=h}let f=this.n*12,d=this.byte;d[f]=t,d[f+1]=o,d[f+2]=e,d[f+3]=i,d[f+4]=n>>16&255,d[f+5]=n>>8&255,d[f+6]=n&255,d[f+7]=(r&15)<<2,d[f+8]=Math.max(1,Math.min(255,s)),d[f+9]=Math.max(1,Math.min(255,c)),d[f+10]=Math.max(0,Math.min(255,l+128)),d[f+11]=u&15|(p&15)<<4,this.n++}ciuffo(t,o,e,i,n,r,s,c=1,l=0){let u=oa[Math.floor(Lt(t,e,3)*oa.length)],p=Math.max(1,Math.round(u.n*c*(.82+.36*Lt(t,e,5)))),f=o+1-this.yBase;if(f<0||f*8>247)return 0;for(let d=0;d<p;d++){let h=Lt(t,e,d*17+5),m=Lt(t,e,d*17+11),g=Lt(t,e,d*17+41),v=Lt(t,e,d*17+59),b=Math.min(.98,.66+u.apri),x=t+.5+(h-.5)*b,A=e+.5+(m-.5)*b,E=Math.min(.8,u.alto*(.62+.8*Lt(t,e,d*17+71))*(.5+.6*Math.pow(g,1.5))),M=u.largo*(.8+.4*v),O=(Lt(t,e,d*17+83)-.5)*.5,N=Lt(t,e,d*17+89),z=N<.15?.9+.03*N:N>.85?1.07+.03*(N-.85):.97+.06*(N-.15)/.7,_=Math.max(0,Math.min(128,Math.round((x-i)*8))),S=Math.max(0,Math.min(128,Math.round((A-n)*8))),L=Math.floor(Lt(t,e,d*17+97)*255);this._lamella(_,S,Math.round(f*8),L,r,s,Math.round(E*64),Math.round(M*128),Math.round(O*128),l,Math.round((z-.9)/.2*15))}return p}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var ae=64,ar=[[1,0,0,st(1,0,0),0,1],[-1,0,0,st(-1,0,0),0,-1],[0,1,0,st(0,1,0),1,1],[0,-1,0,st(0,-1,0),1,-1],[0,0,1,st(0,0,1),2,1],[0,0,-1,st(0,0,-1),2,-1]],ia=(a,t,o)=>((t+1)*3+(o+1))*3+(a+1),Vo=class{constructor(t,o,e,i,n){this.c=t,this.ox=o,this.oz=e,this._materia=0,this.luceDi=i,this.aria=n,this._cielo=15,this._cella=null}materia(t){this._materia=t|0}cella(t,o,e){this._cella=[t,o,e]}_cieloFaccia(t){let[o,e,i]=this._cella,n=-1;for(let r=0;r<3;r++){if(!t[r])continue;let s=this.luceDi(o+(r===0?t[0]:0),e+(r===1?t[1]:0),i+(r===2?t[2]:0))[0];s>n&&(n=s)}return n<0?this.luceDi(o,e+1,i)[0]:n}_bloccoVertice(t,o){let e=Math.hypot(o[0],o[1],o[2])||1,i=t[0]+o[0]/e*.5,n=t[1]+o[1]/e*.5,r=t[2]+o[2]/e*.5,s=0,c=0;for(let l of[-.45,.45])for(let u of[-.45,.45])for(let p of[-.45,.45]){let f=Math.floor(i+l),d=Math.floor(n+u),h=Math.floor(r+p);this.aria(f,d,h)&&(s+=this.luceDi(f,d,h)[1],c++)}return c?Math.round(s/c):0}_v(t,o,e,i){return[t[0]-this.ox,t[1]+ae,t[2]-this.oz,o,this._cielo,this._bloccoVertice(t,i),e,0,this._materia]}_giro(t,o,e,i){let n=o[0]-t[0],r=o[1]-t[1],s=o[2]-t[2],c=e[0]-t[0],l=e[1]-t[1],u=e[2]-t[2],p=r*u-s*l,f=s*c-n*u,d=n*l-r*c;return p*i[0]+f*i[1]+d*i[2]<0}tri(t,o,e,i,n){if(this._giro(t,o,e,n)){let s=o;o=e,e=s}let r=st(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(t,r,i,n),this._v(o,r,i,n),this._v(e,r,i,n),this._v(e,r,i,n))}quad(t,o,e,i,n,r){let s=st(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(t,o,e,r)){let c=o;o=i,i=c}this.c.quadDa(this._v(t,s,n,r),this._v(o,s,n,r),this._v(e,s,n,r),this._v(i,s,n,r))}};function io(a){if(!a)return!1;let t=k(a);return!t.acqua&&!t.vetro&&!_e.has(t.forma)}function ye(a){return!!a&&a.charCodeAt(0)===97&&a.startsWith("acqua")}function aa(a,t,{erba:o=2,luce:e=!0}={}){let i=t.indexOf(","),n=+t.slice(0,i),r=+t.slice(i+1),s=n*C,c=r*C,l=new ve(1024),u=new ve(64),p=-1/0,f=new Int16Array(C*C).fill(-1),d=new Int16Array(C*C).fill(-1),h=255,m=0,g=1/0,v=-1/0;a.perOgniDelChunk(t,(z,_)=>{_<g&&(g=_),_>v&&(v=_)});let b=e&&g<=v?ea(a,t,g-2,v+3):null,x=new oo(Number.isFinite(g)?g:0),A=(z,_,S)=>b?b.leggi(z,_,S):[15,0],E=new Vo(l,s,c,A,(z,_,S)=>!io(a.tipo(z,_,S))),M=new Uint8Array(27),O=(z,_,S,L,F,R,P,G)=>[z-s,_+ae,S-c,L,R,P,F,G?1:0,0];return a.perOgniDelChunk(t,(z,_,S,L)=>{let F=k(L);if(F.forma==="modello"&&F.modello==="albero")for(let D=-2;D<=2;D++)for(let Z=-2;Z<=2;Z++){let tt=D*D+Z*Z;if(tt>4)continue;let ot=z+D-s,Mt=S+Z-c;if(ot<0||ot>=C||Mt<0||Mt>=C)continue;let at=ot*C+Mt,j=_+(tt===0?4:tt<=2?3:2);j>f[at]&&(f[at]=j)}if(_e.has(F.forma))return;let R=ye(L),P=_+ae;if(P<0||P>254)return;let G=(z-s)*C+(S-c);!R&&_>f[G]&&(f[G]=_),!R&&io(L)&&_>d[G]&&(d[G]=_);let U=Ze(Yt(L),_);F.motivo&&(U=Gi(U,F.motivo,F.motivoForza??1,z,_,S));let I=$i(F);I&&(U={...U,cima:Vt(U.cima,I),lato:Vt(U.lato,I),fondo:Vt(U.fondo,I)},U.facce&&(U.facce=U.facce.map(D=>D==null?D:Vt(D,I))));let ut=I?Yi(F.materia):0;if(!R){M.fill(0);for(let at=-1;at<=1;at++)for(let j=-1;j<=1;j++)for(let nt=-1;nt<=1;nt++)nt===0&&at===0&&j===0||io(a.tipo(z+nt,_+at,S+j))&&(M[ia(nt,at,j)]=1);let D=(at,j,nt)=>M[ia(at,j,nt)]===1;E.materia(ut),E.cella(z,_,S);let Z=z+.5,tt=_+.5,ot=S+.5,Mt=F.forma&&ji[F.forma];Mt?Mt(E,Z,tt,ot,U,()=>!1):F.cappello&&!D(0,1,0)?Qi(E,Z,tt,ot,U,D):Wi(E,Z,tt,ot,U,(j,nt,B)=>D(j,nt,B)?nt!==0?!0:!k(a.tipo(z+j,_,S+B)).cappello||D(j,1,B):!1,I?I.orlo:0),P-1<h&&(h=P-1),P+2>m&&(m=P+2)}let ft=0,wt=0;if(R)for(wt=Math.max(0,Math.min(15,xe(L)||0));ft<15&&ye(a.tipo(z,_-1-ft,S));)ft++;let me=(D,Z)=>{if(!ye(a.tipo(D,_,Z)))return-1;let tt=0;for(;tt<15&&ye(a.tipo(D,_-1-tt,Z));)tt++;return tt},Ut=(D,Z)=>{let tt=0,ot=0;for(let Mt of[D-1,D])for(let at of[Z-1,Z]){let j=me(Mt,at);j>=0&&(tt+=j,ot++)}return ot?Math.round(tt/ot):ft};if(R)for(let[D,Z,tt,ot,Mt,at]of ar){let j=a.tipo(z+D,_+Z,S+tt);if(j&&(ye(j)||io(j)))continue;let nt=Ft(U,Mt,at),B=z,V=_,Y=S,yt,Tt,Ct,St;if(D===1?(yt=[B+1,V,Y],Tt=[B+1,V+1,Y],Ct=[B+1,V+1,Y+1],St=[B+1,V,Y+1]):D===-1?(yt=[B,V,Y+1],Tt=[B,V+1,Y+1],Ct=[B,V+1,Y],St=[B,V,Y]):Z===1?(yt=[B,V+1,Y],Tt=[B,V+1,Y+1],Ct=[B+1,V+1,Y+1],St=[B+1,V+1,Y]):Z===-1?(yt=[B,V,Y+1],Tt=[B,V,Y],Ct=[B+1,V,Y],St=[B+1,V,Y+1]):tt===1?(yt=[B+1,V,Y+1],Tt=[B+1,V+1,Y+1],Ct=[B,V+1,Y+1],St=[B,V,Y+1]):(yt=[B,V,Y],Tt=[B,V+1,Y],Ct=[B+1,V+1,Y],St=[B+1,V,Y]),Z===1){let di=_+(15-2*wt)/16;di>p&&(p=di)}u.quadDa(O(...yt,ot,nt,Ut(yt[0],yt[2]),wt,yt[1]===V+1),O(...Tt,ot,nt,Ut(Tt[0],Tt[2]),wt,Tt[1]===V+1),O(...Ct,ot,nt,Ut(Ct[0],Ct[2]),wt,Ct[1]===V+1),O(...St,ot,nt,Ut(St[0],St[2]),wt,St[1]===V+1)),P<h&&(h=P),P+1>m&&(m=P+1)}if(F.cappello&&o>0&&!a.tipo(z,_+1,S)){let[D,Z]=A(z,_+1,S);x.ciuffo(z,_,S,s,c,U.cima,D,o/2,Z),_+2+ae>m&&(m=_+2+ae)}}),h>m&&(h=0,m=0),{...l.dati(),minY:h,maxY:m,y0:-ae,cx:n,cz:r,altezze:f,solide:d,acqua:{...u.dati(),pelo:p===-1/0?null:p},erba:x.dati()}}var ao=6,no=class{constructor(t,o,e,{erba:i=8,raggioResa:n=96,budgetMs:r=5,lavoro:s=null}={}){this.mondo=t,this.resa=o,this.erba=i,this.raggioResa=n,this.budgetMs=r,this.lavoro=s,this._marca=new Map,this._vuoti=new Set,this.frontiera=new eo(t,e,{margineGenera:2*C,margineTieni:5*C}),this.coda=new Set,this.statistiche={inCoda:0,costruiti:0,scaricati:0,ultimaMs:0,chunk:0,inVolo:0},this._ordine=[]}avvio(t,o){this.frontiera.assicura(t,o,{resa:this.raggioResa},{subito:!0}),this.aggiorna(t,o,1/0)}tocca(t,o){for(let e of[-ao,0,ao])for(let i of[-ao,0,ao])this.coda.add(Math.floor((t+e)/C)+","+Math.floor((o+i)/C))}aggiorna(t,o,e=this.budgetMs){let i=performance.now(),n=this.mondo,r=this.resa;this.frontiera.assicura(t,o,{resa:this.raggioResa});for(let s of n.sporchi)this.coda.add(s),this._vuoti.delete(s);n.sporchi.clear();for(let s of n.sporchiAcqua)this.coda.add(s);n.sporchiAcqua.clear();for(let s of n.generati)!r.chunks.has(s)&&!this._vuoti.has(s)&&!(this.lavoro&&this.lavoro.inVolo.has(s))&&this.coda.add(s);for(let s of[...r.chunks.keys()])n.generati.has(s)||(r.rimuovi(s),this.coda.delete(s),this.statistiche.scaricati++);if(this.coda.size){let s=this._ordine;s.length=0;for(let l of this.coda){let u=nr(l,t,o);u<=this.raggioResa+C&&s.push([u,l])}s.sort((l,u)=>l[0]-u[0]);let c=0;this._vicini=s.length;for(let[,l]of s){if(!this.lavoro&&c>0&&performance.now()-i>e||this.lavoro&&this.lavoro.vivo&&this.lavoro.liberi===0)break;if(!(this.lavoro&&this.lavoro.vivo&&this.lavoro.inVolo.has(l))&&(this.coda.delete(l),!!n.generati.has(l))){if(!n.chunks.has(l)){r.chunks.has(l)&&r.rimuovi(l),this._vuoti.add(l),this._vicini--;continue}if(this.lavoro&&this.lavoro.vivo&&e!==1/0){let u=(this._marca.get(l)||0)+1;this._marca.set(l,u),this.lavoro.manda(n,l,this.erba,u)===null&&r.chunks.has(l)&&r.rimuovi(l),c++;continue}r.carica(l,aa(n,l,{erba:this.erba})),c++,this.statistiche.costruiti++}}this._vicini-=c}else this._vicini=0;if(this.lavoro&&this.lavoro.vivo){for(let{kc:s,dati:c,marca:l}of this.lavoro.raccogli())if(n.generati.has(s)){if(this._marca.get(s)!==l){this.coda.add(s);continue}this.coda.has(s)||(r.carica(s,c),this.statistiche.costruiti++)}this.statistiche.inVolo=this.lavoro.inVolo.size}this.statistiche.inCoda=this._vicini,this.statistiche.ultimaMs=performance.now()-i,this.statistiche.chunk=r.chunks.size}};function nr(a,t,o){let e=a.indexOf(",");return Math.hypot(+a.slice(0,e)*C+C/2-t,+a.slice(e+1)*C+C/2-o)}var ro=class{constructor(t,{alpha:o=0,beta:e=-.25,sensibilita:i=.0042}={}){this.alpha=o,this.beta=e,this.sensibilita=i,this.trascinato=0,this.fermo=!1,this.attivo=null,t.addEventListener("pointerdown",r=>{if(this.attivo===null){this.attivo=r.pointerId,this.trascinato=0,this._x=r.clientX,this._y=r.clientY;try{t.setPointerCapture(r.pointerId)}catch{}}}),t.addEventListener("pointermove",r=>{if(document.pointerLockElement===t){this._gira(r.movementX,r.movementY);return}if(r.pointerId!==this.attivo)return;let s=r.clientX-this._x,c=r.clientY-this._y;this._x=r.clientX,this._y=r.clientY,!this.fermo&&(this.trascinato+=Math.hypot(s,c),this._gira(s,c))});let n=r=>{r.pointerId===this.attivo&&(this.attivo=null)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),window.addEventListener("keydown",r=>{r.code==="KeyL"&&!/^(INPUT|TEXTAREA)$/.test(r.target&&r.target.tagName)&&(document.pointerLockElement===t?document.exitPointerLock():t.requestPointerLock&&t.requestPointerLock())})}_gira(t,o){this.alpha+=t*this.sensibilita,this.beta=Math.max(-1.45,Math.min(1.45,this.beta-o*this.sensibilita))}verso(){let t=Math.cos(this.beta);return[t*Math.sin(this.alpha),Math.sin(this.beta),-t*Math.cos(this.alpha)]}avantiPiano(){return{x:Math.sin(this.alpha),z:-Math.cos(this.alpha)}}};ct();var Ht=1/60,na=4,ra=26,Go=.32,sa=.92,ca=.995,rr=.06,sr=20,ne=.5,cr=2.4,lr=.9,so=class{constructor(t){this.mondo=t,this.lista=[],this._resto=0,this.statistiche={corpi:0,svegli:0,passi:0},this._griglia=new Map}aggiungi({x:t,y:o,z:e,vx:i=0,vy:n=0,vz:r=0,lato:s=.5,colore:c=[1,1,1],giro:l=0}){let u={x:t,y:o,z:e,vx:i,vy:n,vz:r,lato:s,colore:c,giro:l,aTerra:!1,sonno:0,dorme:!1,inAcqua:!1};return this.lista.push(u),u}svuota(){this.lista.length=0}avanza(t){this._resto+=t;let o=0;for(;this._resto>=Ht&&o<na;)this._passo(),this._resto-=Ht,o++;return this._resto>Ht*na&&(this._resto=0),this.statistiche.passi+=o,o}_solido(t,o,e){return this.mondo.solido(Math.floor(t),Math.floor(o),Math.floor(e))}_urta(t,o,e,i){let n=i-.001;for(let r of[-n,n])for(let s of[-n,n])if(this._solido(t+r,o-n,e+s)||this._solido(t+r,o+n,e+s))return!0;return!1}_sommerso(t,o){let e=this.mondo;if(!e.tipo)return 0;let i=Math.floor(t.x),n=Math.floor(t.z),r=Math.floor(t.y+o),s=Math.floor(t.y-o)-1;for(let c=r;c>=s;c--){let l=e.tipo(i,c,n);if(!l)continue;let u=k(l);if(!u||!u.acqua)continue;let p=c+(15-2*(xe(l)||0))/16;return Math.max(0,Math.min(1,(p-(t.y-o))/(2*o)))}return 0}_passo(){let t=this.lista,o=0;for(let e of t){if(e.dorme)continue;o++;let i=e.lato/2;e.vy-=ra*Ht;let n=this._sommerso(e,i);if(e.inAcqua=n>.02,e.inAcqua){e.vy+=ra*cr*n*Ht;let p=1-(1-lr)*n;e.vx*=p,e.vy*=p,e.vz*=p}let r=Math.max(Math.abs(e.vx),Math.abs(e.vy),Math.abs(e.vz))*Ht,s=Math.max(1,Math.ceil(r/(i*.9))),c=Ht/s,l=!1;for(let p=0;p<s;p++){let f=e.x+e.vx*c;e.vx!==0&&(this._urta(f,e.y,e.z,i)&&(e.vx=-e.vx*Go,f=e.x),e.x=f);let d=e.z+e.vz*c;e.vz!==0&&(this._urta(e.x,e.y,d,i)&&(e.vz=-e.vz*Go,d=e.z),e.z=d);let h=e.y+e.vy*c;this._urta(e.x,h,e.z,i)?e.vy<0?(e.y=Math.floor(h-i+.001)+1+i,l=!0,e.vy=Math.abs(e.vy)>3?-e.vy*Go:0):e.vy=0:e.y=h}e.aTerra=l||e.vy<=0&&this._urta(e.x,e.y-.02,e.z,i),e.aTerra?(e.vx*=sa,e.vz*=sa,e.vy<0&&(e.vy=0)):(e.vx*=ca,e.vz*=ca);let u=Math.hypot(e.vx,e.vy,e.vz);(e.aTerra||e.inAcqua)&&u<rr?(e.vx=e.vz=0,e.inAcqua&&(e.vy=0),++e.sonno>=sr&&(e.dorme=!0)):e.sonno=0}this._vicini(),this.statistiche.corpi=t.length,this.statistiche.svegli=o}_vicini(){let t=this._griglia;t.clear();let o=this.lista,e=(i,n)=>i+32768<<16|n+32768;for(let i=0;i<o.length;i++){let n=o[i],r=e(Math.floor(n.x),Math.floor(n.z)),s=t.get(r);s||(s=[],t.set(r,s)),s.push(i)}for(let i=0;i<o.length;i++){let n=o[i],r=Math.floor(n.x),s=Math.floor(n.z);for(let c=-1;c<=1;c++)for(let l=-1;l<=1;l++){let u=t.get(e(r+c,s+l));if(u)for(let p of u){if(p<=i)continue;let f=o[p];if(n.dorme&&f.dorme)continue;let d=(n.lato+f.lato)/2,h=d-Math.abs(n.x-f.x);if(h<=0)continue;let m=d-Math.abs(n.y-f.y);if(m<=0)continue;let g=d-Math.abs(n.z-f.z);if(!(g<=0)){if(h<=m&&h<=g){let v=Math.sign(n.x-f.x)||1;n.x+=v*h*ne,f.x-=v*h*ne}else if(m<=g)(Math.sign(n.y-f.y)||1)>0?(n.y+=m*ne,n.vy<0&&(n.vy=0)):(f.y+=m*ne,f.vy<0&&(f.vy=0));else{let v=Math.sign(n.z-f.z)||1;n.z+=v*g*ne,f.z-=v*g*ne}n.dorme&&(n.dorme=!1,n.sonno=0),f.dorme&&(f.dorme=!1,f.sonno=0)}}}}}istanze(t=null){let o=this.lista.length;(!t||t.length!==o*8)&&(t=new Float32Array(o*8));for(let e=0;e<o;e++){let i=this.lista[e],n=e*8;t[n]=i.x,t[n+1]=i.y-i.lato/2,t[n+2]=i.z,t[n+3]=i.lato,t[n+4]=i.colore[0],t[n+5]=i.colore[1],t[n+6]=i.colore[2],t[n+7]=i.giro}return t}};ct();Ce();var dr=256,mt=8,ua=16,fa=(a,t)=>a+","+t,Yo=(a,t,o)=>a+","+t+","+o,lo=class{constructor({varia:t=!0}={}){this.varia=t,this._n=dr,this._dati=new Float32Array(this._n*mt),this._id=new Int32Array(this._n),this._tipo=new Array(this._n).fill(null),this._slot=new Map,this._liberi=[],this._primo=0,this._prossimoId=1,this._perTipo=new Map,this._perChunk=new Map,this._chunk=new Map,this._perCella=new Map,this._cella=new Map,this._meta=new Map,this._nome=new Map,this.sporchi=new Set}_cresci(){let t=this._n*2,o=new Float32Array(t*mt);o.set(this._dati);let e=new Int32Array(t);e.set(this._id),this._dati=o,this._id=e,this._tipo.length=t,this._tipo.fill(null,this._n),this._n=t}_prendiSlot(){return this._liberi.length?this._liberi.pop():(this._primo>=this._n&&this._cresci(),this._primo++)}aggiungi(t,o,e,i,{giro:n,scala:r,tinta:s,nome:c,dati:l,cella:u}={}){let p=this._prendiSlot(),f=this._prossimoId++;this._id[p]=f,this._slot.set(f,p),this._tipo[p]=t;let d=u?co(t,u[0],u[1],u[2],this.varia):{scala:1,giro:0,tinta:[1,1,1]},h=p*mt;this._dati[h]=o,this._dati[h+1]=e,this._dati[h+2]=i,this._dati[h+3]=r??d.scala;let m=s||d.tinta;this._dati[h+4]=m[0],this._dati[h+5]=m[1],this._dati[h+6]=m[2],this._dati[h+7]=n??d.giro;let g=this._perTipo.get(t);if(g||(g=new Set,this._perTipo.set(t,g)),g.add(p),this._indicizza(p,o,i),u){let v=Yo(u[0],u[1],u[2]);this._perCella.set(v,p),this._cella.set(p,v)}return c&&this._nome.set(p,c),l&&this._meta.set(p,{...l}),this.sporchi.add(t),f}togli(t){let o=this._slot.get(t);if(o===void 0)return!1;let e=this._tipo[o];this._perTipo.get(e).delete(o),this._sfila(o);let i=this._cella.get(o);return i!==void 0&&(this._perCella.delete(i),this._cella.delete(o)),this._meta.delete(o),this._nome.delete(o),this._slot.delete(t),this._id[o]=0,this._tipo[o]=null,this._liberi.push(o),this.sporchi.add(e),!0}_chunkDi(t,o){return fa(Math.floor(t/ua),Math.floor(o/ua))}_indicizza(t,o,e){let i=this._chunkDi(o,e),n=this._perChunk.get(i);n||(n=new Set,this._perChunk.set(i,n)),n.add(t),this._chunk.set(t,i)}_sfila(t){let o=this._chunk.get(t);if(o===void 0)return;let e=this._perChunk.get(o);e&&(e.delete(t),e.size||this._perChunk.delete(o)),this._chunk.delete(t)}nelChunk(t,o){let e=this._perChunk.get(fa(t,o));return e?[...e].map(i=>this._id[i]):[]}leggi(t){let o=this._slot.get(t);if(o===void 0)return null;let e=o*mt;return{id:t,tipo:this._tipo[o],x:this._dati[e],y:this._dati[e+1],z:this._dati[e+2],scala:this._dati[e+3],tinta:[this._dati[e+4],this._dati[e+5],this._dati[e+6]],giro:this._dati[e+7],nome:this._nome.get(o)||null,dati:this._meta.get(o)||null}}posa(t,{x:o,y:e,z:i,giro:n,scala:r,tinta:s}={}){let c=this._slot.get(t);if(c===void 0)return!1;let l=c*mt,u=o!==void 0||i!==void 0;return o!==void 0&&(this._dati[l]=o),e!==void 0&&(this._dati[l+1]=e),i!==void 0&&(this._dati[l+2]=i),r!==void 0&&(this._dati[l+3]=r),s&&(this._dati[l+4]=s[0],this._dati[l+5]=s[1],this._dati[l+6]=s[2]),n!==void 0&&(this._dati[l+7]=n),u&&(this._sfila(c),this._indicizza(c,this._dati[l],this._dati[l+2])),this.sporchi.add(this._tipo[c]),!0}metadati(t,o){let e=this._slot.get(t);return e===void 0?null:(o&&this._meta.set(e,{...this._meta.get(e)||{},...o}),this._meta.get(e)||null)}battezza(t,o){let e=this._slot.get(t);return e===void 0?!1:(o?this._nome.set(e,o):this._nome.delete(e),!0)}evento(t){let[o,e,i]=t.cella;if(t.tipo==="metti"){let n=k(t.blocco);if(!n||n.forma!=="modello"||!n.modello)return;this._dallaCella(o,e,i),this.aggiungi(n.modello,o+.5,e,i+.5,{cella:[o,e,i]})}else t.tipo==="togli"&&this._dallaCella(o,e,i)}_dallaCella(t,o,e){let i=this._perCella.get(Yo(t,o,e));i!==void 0&&this.togli(this._id[i])}idInCella(t,o,e){let i=this._perCella.get(Yo(t,o,e));return i===void 0?null:this._id[i]}cambiate(){let t=[];for(let o of this.sporchi){let e=this._perTipo.get(o),i=new Float32Array((e?e.size:0)*mt),n=0;if(e)for(let r of e)i.set(this._dati.subarray(r*mt,r*mt+mt),n),n+=mt;t.push([o,i])}return this.sporchi.clear(),t}get conta(){return this._slot.size}quante(t){let o=this._perTipo.get(t);return o?o.size:0}tutte(){return[...this._slot.keys()]}tipiVivi(){return this._perTipo.keys()}ognunaDi(t,o){let e=this._perTipo.get(t);if(e)for(let i of e){let n=i*mt;o(this._dati[n],this._dati[n+1],this._dati[n+2],this._id[i],this._dati[n+3],this._dati[n+7])}}perTipo(){let t=[];for(let[o,e]of this._perTipo)e.size&&t.push([o,e.size]);return t.sort((o,e)=>o[0].localeCompare(e[0])),t}serializza({tutto:t=!1}={}){let o=[];for(let[e,i]of this._slot){if(!t&&this._cella.has(i))continue;let n=i*mt,r={id:e,tipo:this._tipo[i],p:[this._dati[n],this._dati[n+1],this._dati[n+2]],s:this._dati[n+3],g:this._dati[n+7]},s=[this._dati[n+4],this._dati[n+5],this._dati[n+6]];(s[0]!==1||s[1]!==1||s[2]!==1)&&(r.t=s);let c=this._nome.get(i);c&&(r.n=c);let l=this._meta.get(i);l&&(r.m=l),o.push(r)}return{versione:1,entita:o}}deserializza(t){if(!t||t.versione!==1||!Array.isArray(t.entita))throw new Error("pacco di entit\xE0 non riconosciuto");let o=0;for(let e of t.entita)this.aggiungi(e.tipo,e.p[0],e.p[1],e.p[2],{giro:e.g,scala:e.s,tinta:e.t,nome:e.n,dati:e.m}),o++;return o}};ct();var hr=4,mr=33,gr=26;function pa(a,t,o=0,e=!1,i=null,n=hr){let r=t.indexOf(","),s=+t.slice(0,r),c=+t.slice(r+1),l=1/0,u=-1/0;if(a.perOgniDelChunk(t,(E,M)=>{M<l&&(l=M),M>u&&(u=M)}),l===1/0)return null;let p=s*C-n,f=c*C-n,d=l-mr,h=C+2*n,m=h,g=u+gr-d+1,v=new Uint16Array(h*g*m),b=[],x=new Map;for(let E=-1;E<=1;E++)for(let M=-1;M<=1;M++)a.perOgniDelChunk(s+E+","+(c+M),(O,N,z,_)=>{let S=O-p,L=N-d,F=z-f;if(S<0||S>=h||L<0||L>=g||F<0||F>=m)return;let R=x.get(_);R===void 0&&(R=b.push(_),x.set(_,R)),v[(S*g+L)*m+F]=R});let A={};for(let E of b){let M=Yt(E);M in A||(A[M]=pt[M]||null)}return{kc:t,livello:o,soloAcqua:e,x0:p,y0:d,z0:f,nx:h,ny:g,nz:m,celle:v,tipi:b,defs:A,stagione:i||{corrente:Ti(),mescolanza:Ci()}}}var Ho=class{constructor(t){this.operai=[],this.pronti=[],this.inVolo=new Map;for(let o=0;o<t;o++){let e=new Worker(new URL("./mesher-nucleo-worker.js",import.meta.url),{type:"module"}),i={w:e,occupato:null};e.onmessage=n=>{i.occupato=null,this.pronti.push(n.data)},e.onerror=n=>{console.warn("lavoro: un Worker si \xE8 fermato \u2014",n&&n.message),this.operai=this.operai.filter(r=>r!==i),i.occupato&&this.inVolo.delete(i.occupato);try{e.terminate()}catch{}},this.operai.push(i)}}get vivo(){return this.operai.length>0}get liberi(){return this.operai.filter(t=>!t.occupato).length}manda(t,o,e,i=0){let n=this.operai.find(s=>!s.occupato);if(!n)return!1;let r=pa(t,o,0,!1,null,Me);return r?(r.erba=e,r.marca=i,n.occupato=o,this.inVolo.set(o,i),n.w.postMessage(r,[r.celle.buffer]),!0):null}raccogli(){let t=this.pronti;this.pronti=[];for(let o of t)this.inVolo.delete(o.kc);return t}};function da(a=null){if(typeof Worker!="function")return null;let t=a??Math.max(1,Math.min(3,(globalThis.navigator&&navigator.hardwareConcurrency||2)-1));try{let o=new Ho(t);return o.vivo?o:null}catch(o){return console.warn("lavoro: niente Worker \u2014",o&&o.message),null}}var vr=[[[0,0,1],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]],[[0,0,-1],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]],[[1,0,0],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]]],[[-1,0,0],[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]],[[0,1,0],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]],[[0,-1,0],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]]];function ha(a,t){let o=a.perno||t,e=a.scala||[1,1,1],i=a.rot||[0,a.giro||0,0],[n,r]=[Math.cos(i[0]),Math.sin(i[0])],[s,c]=[Math.cos(i[1]),Math.sin(i[1])],[l,u]=[Math.cos(i[2]),Math.sin(i[2])],p=(f,d,h)=>{let m=d*n-h*r,g=d*r+h*n;d=m,h=g;let v=f*s+h*c;return g=-f*c+h*s,f=v,h=g,v=f*l-d*u,m=f*u+d*l,f=v,d=m,[f,d,h]};return{punto:f=>{let[d,h,m]=p((f[0]-o[0])*e[0],(f[1]-o[1])*e[1],(f[2]-o[2])*e[2]);return[d+o[0],h+o[1],m+o[2]]},normale:f=>{let[d,h,m]=p(f[0]/e[0],f[1]/e[1],f[2]/e[2]),g=Math.hypot(d,h,m)||1;return[d/g,h/g,m/g]}}}function Pt(a){let t=[],o=(u,p,f,d,h,m)=>{let g=ma(u,p,f);t.push([g[0]*d[0]+g[1]*d[1]+g[2]*d[2]<0?[u,f,p]:[u,p,f],d,h,m])};for(let u of a){let p=u.colore??16777215,f=u.materia|0;if(u.tornio){let g=u.lati||8,v=u.tornio,b=u.x||0,x=u.z||0,A=Math.min(...v.map(z=>z[1])),E=Math.max(...v.map(z=>z[1])),M=ha(u,[b,(A+E)/2,x]),O=(z,_)=>{let S=[];for(let L=0;L<g;L++){let F=L/g*Math.PI*2+(u.fase||0);S.push([b+Math.cos(F)*z,_,x+Math.sin(F)*z])}return S},N=v.map(([z,_])=>O(z,_));for(let z=0;z+1<v.length;z++){let _=N[z],S=N[z+1];for(let L=0;L<g;L++){let F=(L+1)%g,R=_[L],P=_[F],G=S[F],U=S[L];if(v[z][0]===0&&v[z+1][0]===0)continue;let I=(R[0]+P[0]+G[0]+U[0])/4-b,ut=(R[2]+P[2]+G[2]+U[2])/4-x,ft=Math.hypot(I,ut)||1,wt=v[z+1][0]-v[z][0],me=v[z+1][1]-v[z][1],Ut=Math.hypot(wt,me)||1,D=[I/ft*(me/Ut),-wt/Ut,ut/ft*(me/Ut)];v[z][0]>0&&v[z+1][0]>0?(o(R,P,G,D,p,f),o(R,G,U,D,p,f)):v[z][0]>0?o(R,P,G,D,p,f):o(R,G,U,D,p,f)}}if(v[0][0]>0&&!u.aperto){let z=N[0];for(let _=1;_+1<g;_++)o(z[0],z[_+1],z[_],[0,-1,0],p,f)}if(v[v.length-1][0]>0&&!u.aperto){let z=N[v.length-1];for(let _=1;_+1<g;_++)o(z[0],z[_],z[_+1],[0,1,0],p,f)}Zo(t,M);continue}let d=[(u.da[0]+u.a[0])/2,(u.da[1]+u.a[1])/2,(u.da[2]+u.a[2])/2],h=ha(u,d);if(u.piramide){let g=[[u.da[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.a[2]],[u.da[0],u.da[1],u.a[2]]],v=u.punta,b=[(u.da[0]+u.a[0])/2,u.da[1],(u.da[2]+u.a[2])/2];for(let x=0;x<4;x++){let A=g[x],E=g[(x+1)%4],M=ma(A,v,E),O=[(A[0]+v[0]+E[0])/3-b[0],0,(A[2]+v[2]+E[2])/3-b[2]];o(A,v,E,M[0]*O[0]+M[2]*O[2]<0?[-M[0],-M[1],-M[2]]:M,p,f)}o(g[0],g[1],g[2],[0,-1,0],p,f),o(g[0],g[2],g[3],[0,-1,0],p,f),Zo(t,h);continue}let m=g=>[g[0]?u.a[0]:u.da[0],g[1]?u.a[1]:u.da[1],g[2]?u.a[2]:u.da[2]];for(let[g,v]of vr){let b=g[0]?0:g[1]?1:2;if(u.a[b]===u.da[b])continue;let x=v.map(m);o(x[0],x[1],x[2],g,p,f),o(x[0],x[2],x[3],g,p,f)}Zo(t,h)}let e=t.length*3,i=new Uint8Array(e*20),n=new DataView(i.buffer),r=0,s=1/0,c=-1/0,l=0;for(let[u,p,f,d]of t)for(let h of u){let m=r*20;n.setFloat32(m,h[0],!0),n.setFloat32(m+4,h[1],!0),n.setFloat32(m+8,h[2],!0),i[m+12]=Math.round(p[0]*127)&255,i[m+13]=Math.round(p[1]*127)&255,i[m+14]=Math.round(p[2]*127)&255,i[m+15]=d,i[m+16]=f>>16&255,i[m+17]=f>>8&255,i[m+18]=f&255,i[m+19]=255,s=Math.min(s,h[1]),c=Math.max(c,h[1]),l=Math.max(l,Math.hypot(h[0],h[2])),r++}return{byte:i,vertici:e,triangoli:t.length,minY:s,maxY:c,raggio:l}}function Zo(a,t){for(let o=a.length-1;o>=0;o--){let e=a[o];if(e[4])break;e[0]=e[0].map(t.punto),e[1]=t.normale(e[1]),e[4]=!0}}function ma(a,t,o,e=null){let i=e?[o[0]-a[0],o[1]-a[1],o[2]-a[2]]:[t[0]-a[0],t[1]-a[1],t[2]-a[2]],n=e?[e[0]-t[0],e[1]-t[1],e[2]-t[2]]:[o[0]-a[0],o[1]-a[1],o[2]-a[2]],r=i[1]*n[2]-i[2]*n[1],s=i[2]*n[0]-i[0]*n[2],c=i[0]*n[1]-i[1]*n[0],l=Math.hypot(r,s,c)||1;return[r/l,s/l,c/l]}var H=(a,t,o,e,i,n,r,s={})=>({da:[a-e/2,t,o-n/2],a:[a+e/2,t+i,o+n/2],colore:r,...s}),se=(a,t,o,e,i,n,r=0,s=0,c={})=>({piramide:!0,da:[a-e/2,t,o-e/2],a:[a+e/2,t,o+e/2],punta:[a+r,t+i,o+s],colore:n,...c}),X=(a,t,o,e,i={})=>({tornio:o,x:a,z:t,lati:8,colore:e,...i});ct();Ce();var uo={blu:{corpo:736622,pancia:533312,testa:431830,guance:691404,zampe:533312,orecchie:431830,dentro:3118826,occhi:16777215,pupille:727598,naso:533312,coda:736622},arancione:{corpo:14644537,pancia:13658672,testa:15901522,guance:15897452,zampe:16024454,orecchie:14644537,dentro:16024454,occhi:16777215,pupille:2759186,naso:16024454,coda:14644537}};function jo(a=uo.blu,{zaino:t=!1}={}){let o=[X(0,.02,[[.14,0],[.27,.06],[.31,.24],[.28,.44],[.19,.58],[0,.62]],a.corpo,{fase:Math.PI/8,scala:[1,1,.82]}),X(-.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],a.zampe,{fase:Math.PI/8}),X(.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],a.zampe,{fase:Math.PI/8}),X(0,0,[[0,.52],[.3,.58],[.38,.74],[.36,.94],[.2,1.08],[0,1.11]],a.testa,{fase:Math.PI/8,scala:[1.12,1,.92]}),se(-.22,1.02,0,.17,.36,a.orecchie,-.03,0,{rot:[0,0,.18]}),se(.22,1.02,0,.17,.36,a.orecchie,.03,0,{rot:[0,0,-.18]}),se(-.22,1.05,-.03,.1,.24,a.dentro,-.02,0,{rot:[0,0,.18]}),se(.22,1.05,-.03,.1,.24,a.dentro,.02,0,{rot:[0,0,-.18]}),H(-.15,.74,-.352,.11,.15,.03,a.occhi),H(.15,.74,-.352,.11,.15,.03,a.occhi),H(-.115,.755,-.362,.032,.085,.02,a.pupille),H(.115,.755,-.362,.032,.085,.02,a.pupille),se(0,.72,-.35,.06,-.05,a.naso,0,0,{rot:[Math.PI/2,0,0],perno:[0,.72,-.35]}),X(.2,.22,[[.05,.05],[.055,.4],[0,.46]],a.coda,{rot:[.35,0,-.35],perno:[.2,.05,.22]})];return t&&(o.push(H(.06,.8,.44,.3,.3,.16,13777723,{rot:[0,0,.15]})),o.push(H(.06,.88,.53,.12,.12,.02,9279656,{rot:[0,0,.15]})),o.push(H(.3,.04,-.22,.06,.36,.06,13777723,{rot:[0,0,-.25],perno:[.3,.04,-.22]}))),Pt(o)}function br(){return Pt([X(-.08,-.02,[[.08,0],[.065,.1],[.075,.2]],16108701),X(-.08,-.02,[[0,.17],[.2,.2],[.24,.28],[.17,.36],[0,.41]],13904952,{fase:Math.PI/8}),X(-.16,-.1,[[.05,.31],[.04,.34]],16183526),X(.02,.06,[[.045,.31],[.035,.34]],16183526),X(-.06,-.02,[[.04,.39],[.03,.42]],16183526),X(.18,.14,[[.05,0],[.045,.11]],16108701),X(.18,.14,[[0,.09],[.12,.11],[.11,.17],[0,.21]],6040869,{fase:Math.PI/8})])}function xr(){return Pt([H(0,.38,0,.92,.09,.44,15510096),H(0,.35,0,.98,.03,.5,14644537),H(-.36,0,0,.09,.36,.09,6040869),H(.36,0,0,.09,.36,.09,6040869)])}function Er(){let e=[];for(let i=0;i<3;i++){let n=.33-i*.33,r=.24+i*.28;e.push(H(0,r,n,.9,.08,.33,15510096),H(0,r-.02,n,.94,.02,.37,14644537)),e.push(H(-.36,0,n,.07,r,.07,6040869),H(.36,0,n,.07,r,.07,6040869))}return Pt(e)}function Ar(){return Pt([X(0,0,[[.025,0],[.02,.7]],3481626,{rot:[0,0,-.35],perno:[0,0,0]}),X(.24,0,[[.02,.66],[.012,1.31]],3481626,{rot:[0,0,-.62],perno:[.24,.66,0]}),X(0,0,[[.035,0],[.035,.26]],12597547,{rot:[0,0,-.35],perno:[0,0,0]}),X(0,0,[[.03,.4],[.065,.42],[.065,.5],[.03,.52]],9279656,{rot:[0,0,-.35],perno:[0,0,0],aperto:!0})])}function _r(){let e=[];return e.push(X(0,0,[[.19,.32],[.24,.32],[.24,.37],[.19,.37]],12597547,{aperto:!0})),e.push(X(0,0,[[.2,.33],[.14,.17],[.05,.05],[0,.02]],9079434,{aperto:!0})),e.push(X(0,.24,[[.03,.34],[.03,.96]],14251821,{rot:[-1.95,0,0],perno:[0,.34,.24]})),e.push(X(0,.24,[[.04,.96],[.04,1.1],[0,1.12]],12597547,{rot:[-1.95,0,0],perno:[0,.34,.24]})),Pt(e)}function zr(){return Pt([H(0,.02,0,.44,.04,.3,10858432),H(0,.04,0,.5,.05,.34,12174291),H(0,.09,0,.42,.02,.28,10858432),H(0,.09,.05,.12,.1,.1,12174291),H(0,.19,.05,.09,.09,.09,13226719),X(0,.05,[[.06,0],[.06,.62],[0,.66]],14716975,{rot:[.95,0,0],perno:[0,.24,.05],lati:6,fase:Math.PI/6})])}function Mr(){let i={rot:[-Math.PI/2,0,0],perno:[0,.42,0]};return Pt([X(0,0,[[.3,.42],[.26,.52],[.16,.66],[.12,.8]],14673648,{...i,aperto:!0}),X(0,0,[[.13,.66],[.13,.7]],1405880,{...i,aperto:!0}),X(0,0,[[.14,.8],[.14,.9],[0,.92]],1405880,i),X(0,0,[[.3,.42],[.22,.47],[0,.52]],14673648,i),H(0,.33,-.09,.14,.14,.06,2279664),H(0,0,.1,.1,.44,.1,1003407,{rot:[-.25,0,0],perno:[0,.44,.1]})])}var gt={gatto:{nome:"Gatto (PNG)",costruisci:()=>jo(uo.arancione,{zaino:!0}),colore:15968586},fungo:{nome:"Fungo",costruisci:br,colore:14170676},gradino:{nome:"Gradino",costruisci:xr,colore:14916156},scala:{nome:"Scala",costruisci:Er,colore:13206575},canna:{nome:"Canna da pesca",costruisci:Ar,colore:12597547},retino:{nome:"Retino",costruisci:_r,colore:14251821},cazzuola:{nome:"Cazzuola",costruisci:zr,colore:12174291},megafono:{nome:"Megafono",costruisci:Mr,colore:1405880}};function ga(){for(let[a,t]of Object.entries(gt))pt[a]||kt(a,{nome:t.nome,forma:"modello",modello:a,solido:!1,calpestabile:!0,colore:t.colore}),$o(a,{nome:t.nome,modello:a,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1]});return Object.keys(gt)}ct();var J=4,fo=32;function va(a,t,o){let e=[],i=t*C,n=o*C;for(let r=i;r<i+C;r++)for(let s=n;s<n+C;s++){if(r<-fo||r>=fo||s<-fo||s>=fo)continue;for(let l=J-3;l<J;l++)a.metti(r,l,s,"terra",!0);if(a.metti(r,J,s,"erba",!0),r>=6&&r<18&&s>=-20&&s<-12&&(a.togli(r,J,s,!0),a.metti(r,J-1,s,"acqua",!0),a.metti(r,J,s,"acqua",!0)),r>=-20&&r<-12&&s>=4&&s<12)for(let l=J+1;l<=J+(s-3);l++)a.metti(r,l,s,"pietra",!0);if(s===20&&r>=-24&&r<24){let l=Ke.filter(p=>p&&!At[p]&&k(p).forma!=="modello"),u=Math.floor((r+24)/2);if((r+24)%2===0&&u<l.length)for(let p=J+1;p<=J+3;p++)a.metti(r,p,s,l[u],!0)}r===-4&&s>=-28&&s<28&&(s+28)%6===0&&e.push([r,J+1,s,"lampione"]),r>=-28&&r<-8&&s>=-28&&s<-8&&(r*7+s*13)%11===0&&e.push([r,J+1,s,"albero"]);let c=Object.keys(gt);s===-4&&r>=0&&r<c.length*2&&r%2===0&&e.push([r,J+1,s,c[r/2]]),s===8&&(r===18&&a.metti(r,J+1,s,"lampadaRossa",!0),r===22&&a.metti(r,J+1,s,"lampadaBlu",!0)),r===20&&(s===6&&a.metti(r,J+1,s,"lampadaVerde",!0),s===10&&a.metti(r,J+1,s,"lampadaPesante",!0))}return e}var vt=12,yr=[[-7,6,-5,4,vt],[-3,4,-4,0,vt+1]],Tr=[1,3,2,3];function ba(a,t,[o,e,i,n]){return a>=o&&a<=e&&t>=i&&t<=n}function xa(a,t,o){let e=[],i=t*C,n=o*C;for(let s=i;s<i+C;s++)for(let c=n;c<n+C;c++){let l=-1;for(let u of yr)ba(s,c,u)&&(l=Math.max(l,u[4]));if(!(l<0)){for(let u=l-3;u<l;u++)a.metti(s,u,c,"terra",!0);if(ba(s,c,Tr)){a.metti(s,l-1,c,"acqua",!0),a.metti(s,l,c,"acqua",!0);continue}a.metti(s,l,c,"erba",!0)}}let r=[[-5,vt+1,-3,"albero"],[4,vt+1,0,"lampione"],[-1,vt+2,-2,"gatto"],[-2,vt+1,2,"fungo"],[-3,vt+1,3,"fungo"],[5,vt+1,3,"canna"],[-6,vt+1,2,"retino"],[0,vt+1,4,"cazzuola"]];for(let s of r)s[0]>=i&&s[0]<i+C&&s[2]>=n&&s[2]<n+C&&e.push(s);return e}function Ea(a,t=null){return{chiave:"resa",nome:"Resa del nucleo",nota:"Lo specchio e l'ombra si possono spegnere per misurare quanto costano: la grafica \xE8 la stessa ovunque, il \u{1FA7A} dice i fotogrammi.",campi:[{chiave:"ombra",nome:"ombra del sole (horizon mapping)",tipo:"interruttore",leggi:()=>!!a.ombra,scrivi:o=>a.ombra=!!o},{chiave:"specchio",nome:"specchio dell'acqua",tipo:"interruttore",leggi:()=>!!a.specchio.attivo,scrivi:o=>a.specchio.attivo=!!o},{chiave:"scalaSpecchio",nome:"risoluzione dello specchio",tipo:"numero",min:.2,max:1,passo:.05,leggi:()=>a.specchio.scala,scrivi:o=>a.specchio.scala=o},{chiave:"vediSpecchio",nome:"mostra lo specchio nudo",tipo:"interruttore",leggi:()=>!!a.specchio.mostra,scrivi:o=>a.specchio.mostra=!!o},{chiave:"bagliori",nome:"alone delle lanterne (due cerchi)",tipo:"interruttore",leggi:()=>!!(t&&t.attivo),scrivi:o=>{t&&(t.attivo=!!o)}},{chiave:"erbaFinoA",nome:"fili d'erba fino a",tipo:"numero",min:0,max:160,passo:16,unita:"blocchi",leggi:()=>a.erbaFinoA,scrivi:o=>a.erbaFinoA=o},{chiave:"nebbiaDa",nome:"nebbia da",tipo:"numero",min:8,max:200,passo:4,unita:"blocchi",leggi:()=>a.nebbia.da,scrivi:o=>a.nebbia.da=Math.min(o,a.nebbia.a-4)},{chiave:"nebbiaA",nome:"nebbia piena a",tipo:"numero",min:12,max:240,passo:4,unita:"blocchi",leggi:()=>a.nebbia.a,scrivi:o=>a.nebbia.a=Math.max(o,a.nebbia.da+4)},{chiave:"disegni",nome:"disegni (solidi + specchio)",tipo:"lettura",leggi:()=>`${a.statistiche.disegni} + ${a.statistiche.disegniSpecchio}`},{chiave:"chunk",nome:"chunk visti / totali",tipo:"lettura",leggi:()=>`${a.statistiche.chunkVisti} / ${a.statistiche.chunkTotali}`}]}}function Aa(a){return{chiave:"stile",nome:"Stile",nota:"L'ombra di Leafy \xE8 il colore stesso con la tinta spostata verso il blu, un po' pi\xF9 satura e pi\xF9 scura. Qui si tarano i tre numeri, e si accendono o spengono i pezzi della luce.",campi:[{chiave:"tinta",nome:"ombra: spostamento di tinta verso il blu",tipo:"numero",min:0,max:.3,passo:.01,leggi:()=>a.stile.tinta,scrivi:t=>a.stile.tinta=t},{chiave:"saturazione",nome:"ombra: saturazione",tipo:"numero",min:.6,max:1.6,passo:.05,leggi:()=>a.stile.saturazione,scrivi:t=>a.stile.saturazione=t},{chiave:"valore",nome:"ombra: quanto \xE8 scura (valore)",tipo:"numero",min:.3,max:1,passo:.02,leggi:()=>a.stile.valore,scrivi:t=>a.stile.valore=t},{chiave:"mappa",nome:"mappa d'ombra vera (forma delle cose)",tipo:"interruttore",leggi:()=>!!a.mappa.attiva,scrivi:t=>a.mappa.attiva=!!t},{chiave:"mappaRaggio",nome:"mappa d'ombra: raggio",tipo:"numero",min:16,max:64,passo:4,unita:"blocchi",leggi:()=>a.mappa.raggio,scrivi:t=>{a.mappa.raggio=t,a.mappa.sporca=!0,a.mappa.centro=[1e9,0,1e9]}},{chiave:"lampade",nome:"pozze dei lampioni (cerchi)",tipo:"interruttore",leggi:()=>a.lampadeAccese!==!1,scrivi:t=>a.lampadeAccese=!!t}]}}function _a(a){return{chiave:"meteo",nome:"Meteo",nota:"Il mare: 0 \xE8 uno specchio, 1 \xE8 mosso. Muoverlo a mano spegne il vagare automatico.",campi:[{chiave:"auto",nome:"meteo che cambia da solo",tipo:"interruttore",leggi:()=>!!a.auto,scrivi:t=>a.auto=!!t},{chiave:"mare",nome:"mare mosso",tipo:"numero",min:0,max:1,passo:.02,leggi:()=>+a.agitazione.toFixed(2),scrivi:t=>{a.auto=!1,a.agitazione=t,a.meta=t}}]}}function za(a){return{chiave:"giorno",nome:"Giorno",nota:"Muovere l'ora spegne il ciclo automatico.",campi:[{chiave:"auto",nome:"ciclo automatico",tipo:"interruttore",leggi:()=>!!a.auto,scrivi:t=>a.auto=!!t},{chiave:"ora",nome:"ora del giorno",tipo:"numero",min:0,max:1,passo:.002,leggi:()=>a.ora,scrivi:t=>{a.auto=!1,a.ora=t}},{chiave:"durata",nome:"quanto dura un giorno",tipo:"numero",min:30,max:1800,passo:30,unita:"s",leggi:()=>a.durata,scrivi:t=>a.durata=t},{chiave:"orologio",nome:"orologio",tipo:"lettura",leggi:()=>`${String(Math.floor(a.ora*24)).padStart(2,"0")}:${String(Math.floor(a.ora*24%1*60)).padStart(2,"0")}`}]}}function Ma(a,t){return{chiave:"corpi",nome:"Corpi (fisica)",nota:"Scatole a passo fisso (60 Hz), un asse per volta. Il tetto \xE8 800.",campi:[{chiave:"quanti",nome:"corpi",tipo:"lettura",leggi:()=>`${a.statistiche.corpi} (${a.statistiche.svegli} svegli)`},{chiave:"lancia20",nome:"\u{1F3B2} lancia venti",tipo:"azione",fai:()=>t(20)},{chiave:"lancia200",nome:"\u{1F3B2} lancia duecento",tipo:"azione",fai:()=>t(200)},{chiave:"svuota",nome:"\u{1F9F9} togli tutti",tipo:"azione",fai:()=>a.svuota()}]}}function ya(a){return{chiave:"streaming",nome:"Mondo in streaming",nota:"La frontiera genera 32 blocchi oltre la resa; la coda costruisce entro il budget, almeno un chunk a giro.",campi:[{chiave:"raggio",nome:"raggio di resa",tipo:"numero",min:48,max:160,passo:16,unita:"blocchi",leggi:()=>a.raggioResa,scrivi:t=>a.raggioResa=t},{chiave:"budget",nome:"budget di costruzione",tipo:"numero",min:1,max:16,passo:1,unita:"ms",leggi:()=>a.budgetMs,scrivi:t=>a.budgetMs=t},{chiave:"erba",nome:"densit\xE0 dell'erba (ai prossimi chunk)",tipo:"numero",min:0,max:8,passo:1,leggi:()=>a.erba,scrivi:t=>a.erba=t},{chiave:"stato",nome:"coda / costruiti / scaricati",tipo:"lettura",leggi:()=>`${a.statistiche.inCoda} / ${a.statistiche.costruiti} / ${a.statistiche.scaricati}`}]}}function Ta(a){return{chiave:"giocatore",nome:"Giocatore",campi:[{chiave:"volo",nome:"vola",tipo:"interruttore",leggi:()=>!!a.volo,scrivi:t=>a.impostaVolo(!!t)},{chiave:"cameraTira",nome:"la camera si tira dentro davanti a un muro",tipo:"interruttore",leggi:()=>!!(a.cameraTira&&a.cameraTira()),scrivi:t=>a.impostaCameraTira&&a.impostaCameraTira(!!t)},{chiave:"buco",nome:"buco di visuale (al posto della sagoma)",tipo:"interruttore",leggi:()=>!!(a.buco&&a.buco()),scrivi:t=>a.impostaBuco&&a.impostaBuco(!!t)},{chiave:"miraCentro",nome:"mira al centro (mirino) invece che dove sta il dito",tipo:"interruttore",leggi:()=>!!(a.miraCentro&&a.miraCentro()),scrivi:t=>a.impostaMiraCentro&&a.impostaMiraCentro(!!t)},{chiave:"dove",nome:"dove",tipo:"lettura",leggi:()=>a.dove()},{chiave:"casa",nome:"\u{1F3E0} torna all'origine",tipo:"azione",fai:()=>a.aCasa()},{chiave:"modifiche",nome:"modifiche salvate",tipo:"lettura",leggi:()=>a.modifiche?a.modifiche():0},{chiave:"nuovo",nome:"\u{1F5D1} mondo nuovo (butta le modifiche)",tipo:"azione",fai:()=>a.nuovo&&a.nuovo()}]}}function Ca(a){return{chiave:"scene",nome:"Scene",nota:"Lo zoo \xE8 il piano di prova: vasca, scalinata, muro dei materiali, viale dei lampioni, lampade colorate, arredi. Cambiare scena ricarica la pagina.",campi:[{chiave:"dove",nome:"scena",tipo:"lettura",leggi:()=>a.vetrina?"vetrina nel nero":a.zoo?"zoo di prova":`open world, seme ${a.seme}`},{chiave:"vetrina",nome:"\u{1F5BC} vai alla vetrina (la concept art nel nero)",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?vetrina&officina&terza&ora=0.38")}},{chiave:"zoo",nome:"\u{1F981} vai allo zoo",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?zoo&officina&terza")}},{chiave:"mondo",nome:"\u{1F30D} torna all'open world",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search=`?seme=${a.seme}&officina`)}}]}}var po=class{constructor(t=1){this.agitazione=.25,this.meta=.25,this.auto=!0,this.fra=20,this._s=t>>>0||1}_caso(){let t=this._s;return t^=t<<13,t^=t>>>17,t^=t<<5,this._s=t>>>0,this._s%1e5/1e5}aggiorna(t){if(!this.auto)return this.agitazione;this.fra-=t,this.fra<=0&&(this.meta=Math.pow(this._caso(),2),this.fra=25+this._caso()*50);let o=1-Math.exp(-t/12);return this.agitazione+=(this.meta-this.agitazione)*o,this.agitazione}};function Sa(a,t,o,e,i=0,n=0){let r=[t[0]-a[0],t[1]-a[1],t[2]-a[2]],s=Math.hypot(...r)||1;r[0]/=s,r[1]/=s,r[2]/=s;let c=[-r[2],0,r[0]],l=Math.hypot(...c)||1;c[0]/=l,c[2]/=l;let u=[c[1]*r[2]-c[2]*r[1],c[2]*r[0]-c[0]*r[2],c[0]*r[1]-c[1]*r[0]],p=Math.tan(o/2),f=i*p*e,d=n*p,h=[r[0]+c[0]*f+u[0]*d,r[1]+c[1]*f+u[1]*d,r[2]+c[2]*f+u[2]*d],m=Math.hypot(...h)||1;return{x:h[0]/m,y:h[1]/m,z:h[2]/m}}function Ra(a,t={}){let o={};for(let[e,i]of a.modifiche)i.size&&(o[e]=[...i].map(([n,r])=>[n,r]));return JSON.stringify({v:1,chunk:o,...t})}function La(a,t){if(!t)return 0;let o;try{o=JSON.parse(t)}catch{return-1}if(!o||o.v!==1||typeof o.chunk!="object")return-1;let e=0;for(let[i,n]of Object.entries(o.chunk)){if(!/^-?\d+,-?\d+$/.test(i)||!Array.isArray(n))continue;let r=new Map;for(let s of n)!Array.isArray(s)||s.length!==2||!Number.isInteger(s[0])||s[1]!==null&&typeof s[1]!="string"||(r.set(s[0],s[1]),e++);r.size&&a.modifiche.set(i,r)}return e}function Ko(a){let t=0;for(let o of a.modifiche.values())t+=o.size;return t}Ce();var K=new URLSearchParams(location.search),w={seme:+(K.get("seme")||4242),erba:Math.max(0,Math.min(8,+(K.get("erba")??8))),raggio:Math.max(48,Math.min(160,+(K.get("raggio")||96))),ombra:K.get("ombra")!=="no",mappa:K.get("mappa")==="no"?0:Math.max(256,Math.min(4096,+(K.get("mappa")||(matchMedia("(pointer: coarse)").matches?1024:2048)))),specchio:K.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(K.get("specchio")??.5)||.5)),dprMax:+(K.get("dpr")||1.5),ora:K.has("ora")?+K.get("ora"):null,corpi:+(K.get("corpi")||0),terza:K.has("terza"),zoo:K.has("zoo"),vetrina:K.has("vetrina"),varia:K.get("varia")!=="no"},W=document.getElementById("tela"),{gl:fe,dpr:qr,ridimensiona:Dr}=hi(W,{antialias:!0,dprMax:w.dprMax}),y=new Be(fe);y.ombra=w.ombra;y.mappa.attiva=w.mappa>0;w.mappa>0&&w.mappa!==y.mappa.lato&&(y.mappa.lato=w.mappa,y.mappa.latoDin=Math.max(256,w.mappa/2),y._preparaMappa());y.specchio.attivo=w.specchio>0;y.specchio.scala=w.specchio||.5;var Q=new Ve(fe);Q.registra("cubo",Ei());Q.registra("omino",jo(uo.blu));ga();for(let[a,t]of Object.entries(gt))Q.registra(a,t.costruisci());yi();pt.lampioneSpento||kt("lampioneSpento",{...k("lampione"),nome:"Lampione spento",modello:"lampioneSpento",luce:void 0,notte:!1});var $=new $e,bt=new lo({varia:w.varia});$.onEvento=a=>bt.evento(a);var ni=K.get("worker")==="no"?null:da(),Ur=w.vetrina?xa:w.zoo?va:(a,t,o)=>Mi(a,t,o,w.seme),Dt=new no($,y,Ur,{erba:w.erba,raggioResa:w.raggio,lavoro:ni}),pi=new Ge(fe);y.apriFinestraAltezze(.5,.5,512);var Eo=w.vetrina?"leafy-vetrina":w.zoo?"leafy-zoo":`leafy-partita-${w.seme}`,Ao=0;try{K.has("nuovo")?localStorage.removeItem(Eo):Ao=La($,localStorage.getItem(Eo))}catch{Ao=0}var Ne=0;function kr(){try{localStorage.setItem(Eo,Ra($,{seme:w.seme,quando:Date.now()}))}catch{}}var Br=performance.now();Dt.avvio(.5,.5);var Za=performance.now()-Br,ei=new Set(["cubo","omino",...Object.keys(gt)]);async function Vr(a){if(!ei.has(a)){ei.add(a);try{let t=await fetch(`./modelli/nucleo/${a}.bin`);if(!t.ok)throw new Error(`${t.status}`);let o=xi(await t.arrayBuffer());if(a==="albero"){let e=o.byte,i=new DataView(e.buffer,e.byteOffset,e.byteLength),n=[[15,73,82],[20,84,77],[38,124,77],[90,197,80]],r=Math.max(.001,o.maxY-o.minY);for(let s=0;s<o.triangoli;s++){let c=s*3*20,l=e[c+16],u=e[c+17],p=e[c+18];if(!(u>l+20&&u>p+10))continue;let f=Math.min(i.getFloat32(c+4,!0),i.getFloat32(c+24,!0),i.getFloat32(c+44,!0)),d=n[Math.min(3,Math.floor((f-o.minY)/r*4))];for(let h=0;h<3;h++){let m=c+h*20;e[m+16]=d[0],e[m+17]=d[1],e[m+18]=d[2]}}}if(a==="lampione"){let e=o.byte;for(let i=0;i<o.vertici;i++)e[i*20+15]!==1&&(e[i*20+16]=42,e[i*20+17]=47,e[i*20+18]=77)}if(Q.registra(a,o),bt.sporchi.add(a),a==="lampione"){let e=new Uint8Array(o.byte);for(let i=0;i<o.vertici;i++)e[i*20+15]===1&&(e[i*20+15]=0,e[i*20+16]=25,e[i*20+17]=25,e[i*20+18]=49);Q.registra("lampioneSpento",{...o,byte:e}),ei.add("lampioneSpento"),bt.sporchi.add("lampioneSpento")}}catch(t){console.warn(`modello ${a}: ${t.message}`)}}}function Gr(){for(let[a,t]of bt.cambiate()){if(!Q.tipi.has(a)){Vr(a),bt.sporchi.add(a);continue}Q.istanze(a,t,8);let o=Te(a);if(o&&o.alone){let{quota:e,raggio:i,colore:n}=o.alone,r=t.length/8,s=new Float32Array(r*8);for(let c=0;c<r;c++){let l=c*8,u=t[l+3];s.set([t[l],t[l+1]+e*u,t[l+2],i*u,n[0],n[1],n[2],1],l)}pi.istanze(s)}}}function an(a,t){for(let o=60;o>-60;o--)if($.solido(a,o,t))return o+1;return 8}var T=new je($,{x:.5,y:(w.vetrina?vt:w.zoo?J:an(0,0))+.5+(w.zoo||w.vetrina?1:0),z:w.vetrina?2.5:.5}),et=Si(),pe=new Qe(et),Xr=new Je(a=>{!a&&pe.azzera&&pe.azzera()}),$t=new ro(W,{alpha:.6,beta:-.2}),de=!1,he=!0,qe=new Set;window.addEventListener("keydown",a=>{if(!/^(INPUT|TEXTAREA)$/.test(a.target&&a.target.tagName)){if(qe.add(a.code),a.code==="KeyF"&&Yr(),a.code==="KeyH"){let t=document.getElementById("stato");t.hidden=!t.hidden}a.code==="KeyM"&&un(!De),a.code==="KeyC"&&Co(20),/^Digit[0-9]$/.test(a.code)&&ue(a.code==="Digit0"?9:+a.code.slice(5)-1)}});window.addEventListener("keyup",a=>qe.delete(a.code));window.addEventListener("blur",()=>qe.clear());var Wt=6;window.addEventListener("wheel",a=>{he&&(Wt=Math.max(1.5,Math.min(40,Wt*(a.deltaY>0?1.12:.89))))},{passive:!0});var bo=0,$r=a=>{let t=a.targetTouches;if(t.length<2){bo=0,$t.fermo=!1;return}$t.fermo=!0;let o=Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);bo>0&&he&&o>1&&(Wt=Math.max(1.5,Math.min(40,Wt*bo/o))),bo=o};for(let a of["touchstart","touchmove","touchend","touchcancel"])W.addEventListener(a,$r,{passive:!0});function nn(a){de=a,de&&(T.vy=0)}function Yr(){nn(!de)}document.getElementById("cubi").addEventListener("click",()=>Co(20));var Xt=1/60,Oe=0,qt={x:T.x,y:T.y,z:T.z},Se=T.y,rn=0;function sn(){let a=Math.min(1,Oe/Xt),t=qt.y+(T.y-qt.y)*a;return t<Se?Se=t:Se+=(t-Se)*(1-Math.exp(-rn/.12)),[qt.x+(T.x-qt.x)*a,Se,qt.z+(T.z-qt.z)*a]}var ri=!1;function Hr(a){Oe=Math.min(Oe+a,Xt*4);let t=$t.avantiPiano();for(;Oe>=Xt;){if(Oe-=Xt,qt.x=T.x,qt.y=T.y,qt.z=T.z,de){let e=9*Xt,i=t.x,n=t.z;T.x+=(i*et.avanti-n*et.destra)*e,T.z+=(n*et.avanti+i*et.destra)*e,T.y+=((et.salta?1:0)-(qe.has("ShiftLeft")||qe.has("KeyX")?1:0))*e,T.vy=0;continue}T.aggiorna(Xt,es(t),t);let o=e=>{let i=$.tipo(Math.floor(T.x),Math.floor(T.y+e),Math.floor(T.z));return!!(i&&k(i).acqua)};ri=o(.3),ri&&(o(.75)?T.vy=Math.min(T.vy+40*Xt,1.4):T.vy<-.8&&(T.vy=-.8),et.salta&&(T.vy=2.5),T.aTerra=!1)}}var it={mira:null,occhio:null,tira:!1,buco:!1},oi=0,ja=0;function _o(a=0){rn=a;let t=$t.verso(),[o,e,i]=sn(),n=[o,e+(he?.8:1),i];if(!he)return it.mira=null,{occhio:n,centro:[n[0]+t[0],n[1]+t[1],n[2]+t[2]],fov:1.36,rapporto:W.width/W.height};let r=Wt;if(it.tira){for(let u=.5;u<=Wt;u+=.5)if($.solido(Math.floor(n[0]-t[0]*u),Math.floor(n[1]-t[1]*u),Math.floor(n[2]-t[2]*u))){r=Math.max(.6,u-.6);break}}let s=[n[0]-t[0]*r,n[1]-t[1]*r,n[2]-t[2]*r];it.mira||(it.mira=n.slice(),it.occhio=s.slice());let c=1-Math.exp(-a/.09),l=1-Math.exp(-a/.06);for(let u=0;u<3;u++)it.mira[u]+=(n[u]-it.mira[u])*c,it.occhio[u]+=(s[u]-it.occhio[u])*l;return{occhio:it.occhio.slice(),centro:it.mira.slice(),fov:1.15,rapporto:W.width/W.height}}var Zr=document.getElementById("barra"),Ka=document.getElementById("azione"),jt=1,zt=[...Ke,...Object.keys(gt)];function cn(a){if(!a)return null;try{return At[a]?At[a].colore:gt[a]?gt[a].colore:Ze(Yt(a),8).cima}catch{return null}}function zo(a){if(!a)return"mano";if(At[a])return At[a].nome;if(gt[a])return gt[a].nome;let t=pt[a];return t&&t.nome||a}function ln(a,t){let o=document.createElement("button"),e=cn(a);return o.innerHTML=`<span class="q" style="background:${e!=null?"#"+(e>>>0).toString(16).padStart(6,"0"):"transparent"}"></span>${zo(a)}`,o.addEventListener("click",()=>ue(t)),Zr.appendChild(o),o}var Mo=zt.map(ln);function jr(a){if(a==null){ue(0);return}let t=zt.indexOf(a);if(t>=0){ue(t);return}zt.push(a),Mo.push(ln(a,zt.length-1)),ue(zt.length-1)}function ue(a){jt=(a%zt.length+zt.length)%zt.length,Mo.forEach((t,o)=>t.classList.toggle("scelto",o===jt)),Mo[jt].scrollIntoView({inline:"center",block:"nearest"})}ue(1);var Ie=new We,q=null,yo=!1,It={x:0,y:0,visto:!1},De=!1;function un(a){De=!!a,document.body.classList.toggle("mira-centro",De)}W.addEventListener("pointermove",a=>{It.x=a.clientX,It.y=a.clientY,It.visto=!0});W.addEventListener("pointerdown",a=>{It.x=a.clientX,It.y=a.clientY,It.visto=!0});var ii=[];function Kr(a){ii.length=0;let t=4e4;for(let o of bt.tipiVivi()){if(o==="omino"||o==="cubo")continue;let e=oe[o]||(o==="lampioneSpento"?oe.lampione:null),i=e?e.altezza:1,n=e?e.mezza:.5;bt.ognunaDi(o,(r,s,c)=>{let l=r-a.x,u=c-a.z;l*l+u*u>t||ii.push({min:{x:r-n,y:s,z:c-n},max:{x:r+n,y:s+i,z:c+n},dato:{cella:[Math.floor(r),s,Math.floor(c)]}})})}return ii}function Wr(a){let t=0,o=0;if(!(De||document.pointerLockElement===W||!It.visto)){let i=W.getBoundingClientRect();t=(It.x-i.left)/i.width*2-1,o=1-(It.y-i.top)/i.height*2}return Sa(a.occhio,a.centro,a.fov,a.rapporto,t,o)}function si(a,t,o){for(let e=0;e<=2;e++){let i=$.tipo(a,t-e,o);if(i==="lampione"||i==="lampioneSpento")return[a,t-e,o,i];if(i&&e===0)return null}return null}function Wa(a,t,o,e){$.togli(a,t,o),$.metti(a,t,o,e==="lampione"?"lampioneSpento":"lampione"),Dt.tocca(a,o),Ne=1e3}var Qr={solido:(a,t,o)=>{if($.solido(a,t,o))return!0;let e=$.tipo(a,t,o);return!!(e&&k(e).acqua)}};function ci(){if(!q)return["niente",It.visto?"troppo lontano":""];let a=zt[jt];if(q.acqua)return a&&!At[a]&&!pe.demolisci?["posa",`posa nell'acqua: ${zo(a)}`]:["tocca","nuota fin l\xEC"];let[t,o,e]=q.cella,i=$.tipo(t,o,e),n=si(t,o,e);return pe.demolisci?["rompi",`rompi: ${i?k(i).nome:""} (tieni premuto)`]:n&&(!a||At[a])?["lampione",n[3]==="lampione"?"spegni il lampione":"accendi il lampione"]:a&&!At[a]?["posa",`posa: ${k(a).nome}`]:["tocca",`tocca: ${i?k(i).nome:""}`]}function fn(a,t,o,e){e?$.metti(a,t,o,e):$.togli(a,t,o),Dt.tocca(a,o),Ne=1e3}function Jr(){if(!q)return;let a=zt[jt];if(!a||At[a])return;let[t,o,e]=q.acqua?q.cella:q.prima;if(!Li($,t,o,e))return;let i=T;t+1>i.x-.3&&t<i.x+.3&&e+1>i.z-.3&&e<i.z+.3&&o+1>i.y&&o<i.y+.9||fn(t,o,e,a)}function ts(){if(!q)return;let[a,t,o]=q.cella;fn(a,t,o,null)}W.addEventListener("contextmenu",a=>a.preventDefault());Ii(W,a=>{if($t.trascinato>6)return;if(Pe&&q&&q.cella){let o=bt.idInCella(q.cella[0],q.cella[1],q.cella[2]);o!=null&&Pe.scegli(o)}let[t]=ci();if(a.button===2||a.pointerType==="touch"&&!pe.demolisci)if(t==="lampione"){let o=si(...q.cella);Wa(o[0],o[1],o[2],o[3])}else t==="posa"?Jr():q&&Qa(q);else if(a.button===0&&a.pointerType!=="touch")if(t==="lampione"){let o=si(...q.cella);Wa(o[0],o[1],o[2],o[3])}else t==="tocca"&&q&&Qa(q)});var dt=null,we=0,li=0,ui=0;function Qa(a){let t=a.faccia&&a.faccia[1]>0?a.cella:a.prima;dt={x:t[0]+.5,y:a.faccia&&a.faccia[1]>0?t[1]+1:t[1],z:t[2]+.5,cella:[t[0],a.faccia&&a.faccia[1]>0?t[1]+1:t[1],t[2]]},we=0,li=T.x,ui=T.z}var Re={avanti:0,destra:0,salta:!1};function es(a){if(et.avanti||et.destra||et.salta)return dt=null,et;if(!dt)return et;let t=dt.x-T.x,o=dt.z-T.z,e=Math.hypot(t,o);if(e<.35)return dt=null,et;let i=a.x,n=a.z;return Re.avanti=(t*i+o*n)/e,Re.destra=(t*-n+o*i)/e,we+=Xt,Math.hypot(T.x-li,T.z-ui)>.05&&(we=0,li=T.x,ui=T.z),Re.salta=we>.5&&T.aTerra,Re.salta&&(we=0),Re}wi(W,{onInizio:a=>{yo=!(a.pointerType==="touch"&&!pe.demolisci)},onFine:()=>{yo=!1,Ie.molla()}},0);var xt=new so($),To=[[.36,.72,.3],[.62,.42,.26],[.84,.26,.24],[.28,.44,.84],[.93,.78,.26],[.62,.64,.66],[.96,.96,.96]],Ja=null;function Co(a){let t=$t.verso(),o=_o().occhio;for(let e=0;e<a&&xt.lista.length<800;e++){let i=9+Math.random()*4,n=()=>(Math.random()-.5)*2.2;xt.aggiungi({x:o[0]+t[0]*1.2+(Math.random()-.5)*.4,y:o[1]+t[1]*1.2+Math.random()*.4,z:o[2]+t[2]*1.2+(Math.random()-.5)*.4,vx:t[0]*i+n(),vy:t[1]*i+2+n(),vz:t[2]*i+n(),lato:.35+Math.random()*.3,colore:To[Math.floor(Math.random()*To.length)],giro:Math.random()*Math.PI})}}if(w.corpi>0)for(let a=0;a<Math.min(800,w.corpi);a++)xt.aggiungi({x:T.x+(Math.random()-.5)*12,y:T.y+6+Math.random()*10,z:T.z+(Math.random()-.5)*12,lato:.35+Math.random()*.3,colore:To[a%To.length],giro:Math.random()*Math.PI});var Zt={ora:w.ora??.35,auto:w.ora===null,durata:600},Le=[];function os(){let a=T;Le.length=0,bt.ognunaDi("lampione",(o,e,i)=>{let n=(o-a.x)*(o-a.x)+(i-a.z)*(i-a.z);n<3600&&Le.push([n,o,e,i])}),Le.sort((o,e)=>o[0]-e[0]);let t=Math.min(8,Le.length);for(let o=0;o<t;o++){let e=Le[o];y.lampade[o*4]=e[1],y.lampade[o*4+1]=e[2],y.lampade[o*4+2]=e[3],y.lampade[o*4+3]=4.6}y.nLampade=y.lampadeAccese===!1?0:t}var le=[],ai=48,is=10;function as(a){let t=T;le.length=0,a&&le.push([0,t.x,t.z,.3,.4]);for(let e of xt.lista){if(!e.inAcqua)continue;let i=(e.x-t.x)*(e.x-t.x)+(e.z-t.z)*(e.z-t.z);if(i>=ai*ai)continue;let n=Math.min(1,(ai-Math.sqrt(i))/is),r=e.lato*.45*n;le.push([i,e.x,e.z,r,r])}le.sort((e,i)=>e[0]-i[0]);let o=Math.min(8,le.length);for(let e=0;e<o;e++){let i=le[e];y.galleggianti[e*4]=i[1],y.galleggianti[e*4+1]=i[2],y.galleggianti[e*4+2]=i[3],y.galleggianti[e*4+3]=i[4]}y.nGalleggianti=o}var Fe=new po(w.seme);K.has("mare")&&(Fe.auto=!1,Fe.agitazione=Fe.meta=Math.max(0,Math.min(1,+K.get("mare")||0)));function ns(a){Zt.auto&&(Zt.ora=(Zt.ora+a/Zt.durata)%1);let o=Zt.ora*Math.PI*2-Math.PI/2,e=.24+.5*Math.max(0,Math.sin(o)),i=o*.5;y.sole.verso=[-Math.cos(i)*Math.cos(Math.asin(e)),-e,-Math.sin(i)*Math.cos(Math.asin(e))];let n=Math.max(0,Math.min(1,(Math.sin(o)+.1)*2));y.sole.forza=n,y.mare=Fe.aggiorna(a),os(),as(ri);let r=Math.min(1,Math.max(0,(e-.24)/.4));y.sole.colore=[1,.78+.22*r,.55+.45*r],y.sole.cielo=[.36+.64*n,.38+.62*n,.57+.43*n],y.nebbia.colore=w.vetrina?[0,0,0]:[.25+.47*n,.35+.5*n,.5+.42*n],fe.clearColor(y.nebbia.colore[0],y.nebbia.colore[1],y.nebbia.colore[2],1)}y.nebbia.da=w.raggio-24;y.nebbia.a=w.raggio+8;w.vetrina&&(y.cieloNero=!0,y.nebbia.da=400,y.nebbia.a=500);var lt=[],Kt=[],xo=[],tn=performance.now(),pn=0,en=0;function dn(a){let t=Math.min(.1,(a-tn)/1e3);tn=a;let o=performance.now();Dr(),ns(t),Hr(t),xt.avanza(t),Dt.aggiorna(T.x,T.z,5),y.seguiAltezze(T.x,T.z),Gr();let e=_o(t);y.buco=he&&it.buco?[e.centro[0],e.centro[1]-.2,e.centro[2],.75]:[0,0,0,0];let i=$t.verso(),n=Wr(e),r={x:e.occhio[0],y:e.occhio[1],z:e.occhio[2]};if(q=Ri($,r,n,Kr(r),200),!q){let d=Uo(Qr,r,n,200);d&&(d.acqua=!0,q=d)}if(q&&q.scatola&&(q.cella=q.dato.cella),yo&&q&&!q.acqua){let[d,h,m]=q.cella;Ie.premi(d+","+h+","+m,Oi(k($.tipo(d,h,m))),a),Ie.finito(a)&&ts()}else yo||Ie.molla();Q.istanze("cubo",Ja=xt.istanze(Ja),8),(et.avanti||et.destra||dt)&&(ja=Math.PI-T.verso);let s=ja-oi;s=Math.atan2(Math.sin(s),Math.cos(s)),oi+=s*(1-Math.exp(-t/.08));let c=(et.avanti||et.destra||dt)&&T.aTerra?Math.abs(Math.sin(a/90))*.06:0,[l,u,p]=sn();if(Q.istanze("omino",[l,u+c,p,1,1,1,1,oi],8),dt&&y.scatola(dt.cella[0],dt.cella[1],dt.cella[2],1,.95,.6,.3,.02),y.disegna(e,t,Q),Q.disegna(y,e),q){let[d,h]=ci(),m=Ie.progresso(a),[g,v,b]=q.cella;d==="rompi"||m>0?y.scatola(g,v,b,1,.35-.2*m,.25,.28+.25*m):d==="lampione"?y.scatola(g,v,b,1,.9,.4,.3):y.scatola(g,v,b,1,.95,.5,.22),d==="posa"&&!$.pieno(...q.prima)&&y.scatola(q.prima[0],q.prima[1],q.prima[2],.6,.85,1,.35,.1),y.evidenzia(g,v,b,m),Ka.textContent=h}else Ka.textContent=ci()[1];y.disegnaAcqua(),pi.disegna(y,e);let f=performance.now()-o;lt.push(t*1e3),lt.length>240&&lt.shift(),Kt.push(f),Kt.length>240&&Kt.shift(),pn++,fi&&fi(),Ne>0&&(Ne-=t*1e3,Ne<=0&&kr()),a-en>500&&(en=a,rs()),requestAnimationFrame(dn)}var ht=(a,t)=>{if(!a.length)return 0;let o=[...a].sort((e,i)=>e-i);return o[Math.min(o.length-1,Math.floor(o.length*t))]};function rs(){let a=ht(lt,.5),t=ht(lt,.99),o=lt.length?lt.reduce((s,c)=>s+c,0)/lt.length:0,e=o?1e3/o:0,i=t?1e3/t:0;xo.push(Math.round(e)),xo.length>120&&xo.shift(),document.getElementById("fps").textContent=`${e.toFixed(0)} fps \xB7 1% ${i.toFixed(0)}
${a.toFixed(1)} / ${t.toFixed(1)} ms
JS ${ht(Kt,.5).toFixed(2)} ms`;let n=y.statistiche,r=Dt.statistiche;document.getElementById("stato").textContent=`${w.vetrina?"VETRINA":w.zoo?"ZOO":"PARTITA"} sul nucleo \xB7 seme ${w.seme} \xB7 ${W.width}\xD7${W.height} (dpr ${qr.toFixed(2)})
disegni ${n.disegni+Q.statistiche.disegni+n.disegniAcqua+n.disegniErba+n.disegniSpecchio} \xB7 triangoli ${(n.triangoli+Q.statistiche.triangoli+n.triangoliAcqua+n.triangoliErba+n.triangoliSpecchio).toLocaleString("it")} \xB7 chunk ${n.chunkVisti}/${n.chunkTotali} (coda ${r.inCoda}${ni?`, in volo ${r.inVolo} su ${ni.operai.length} worker`:""}, ${r.ultimaMs.toFixed(1)} ms) \xB7 corpi ${xt.statistiche.corpi} (${xt.statistiche.svegli} svegli)
x ${T.x.toFixed(1)} y ${T.y.toFixed(1)} z ${T.z.toFixed(1)} \xB7 ${de?"volo":T.aTerra?"a terra":"in aria"} \xB7 modifiche ${Ko($)}${Ao>0?` (${Ao} ricaricate)`:""} \xB7 in mano: ${Mo[jt].textContent}${q?` \xB7 miri ${$.tipo(...q.cella)}`:""}
WASD/joystick cammina \xB7 clic a terra (mano vuota) o destro = il gatto ci va \xB7 trascina = gira la camera \xB7 rotella/pizzico = zoom \xB7 sinistro tieni = scava \xB7 destro/tocco = posa o accendi \xB7 \u26CF col dito scava \xB7 C cubi \xB7 1-9 cassetta \xB7 M mirino`}requestAnimationFrame(dn);var on=null,fi=null,Pe=null;async function hn(){if(on){document.body.classList.toggle("con-officina");return}let{apriOfficina:a}=await Promise.resolve().then(()=>(qa(),Pa)),{creaScena:t}=await Promise.resolve().then(()=>(Va(),Ba)),{registroCreativa:o,voci:e}=await Promise.resolve().then(()=>(Ha(),Ya)),{CATEGORIE_BLOCCHI:i}=await Promise.resolve().then(()=>(ct(),Ai)),{CATALOGO:n}=await Promise.resolve().then(()=>(Ce(),la));Pe=t({entita:bt,dove:()=>({x:T.x,y:T.y,z:T.z}),coloreDi:l=>{let u=cn(l);return u==null?"#888888":"#"+(u>>>0).toString(16).padStart(6,"0")},nomeDi:zo,rigaDi:Te,onVaiA:l=>{l&&(T.x=l.x,T.z=l.z,T.y=l.y+2.5,T.vy=0,dt=null)}});let s=o({elenco:e({categorie:i,blocchi:pt,catalogo:n,nomeArredo:zo}),inMano:()=>zt[jt]??null,onPrendi:jr}),c={get volo(){return de},get terza(){return he},impostaVolo:nn,dove:()=>`x ${T.x.toFixed(1)} y ${T.y.toFixed(1)} z ${T.z.toFixed(1)}`,aCasa:()=>{T.x=.5,T.z=.5,T.y=an(0,0)+.5,T.vy=0},modifiche:()=>Ko($),nuovo:()=>{try{localStorage.removeItem(Eo)}catch{}location.search=`?seme=${w.seme}&nuovo`}};document.body.classList.add("con-officina"),c.cameraTira=()=>it.tira,c.impostaCameraTira=l=>it.tira=!!l,c.buco=()=>it.buco,c.impostaBuco=l=>it.buco=!!l,c.miraCentro=()=>De,c.impostaMiraCentro=un,on=a({gruppi:[{contenitore:document.getElementById("rqGerarchia"),etichetta:"Gerarchia",registri:[Pe.gerarchia],azioni:!1},{contenitore:document.getElementById("rqAssets"),etichetta:"Assets",registri:[s],azioni:!1},{contenitore:document.getElementById("rqIspettore"),etichetta:"Ispettore",registri:[Pe.ispettore],azioni:!0},{contenitore:document.getElementById("rqImpostazioni"),etichetta:"Impostazioni",azioni:!1,registri:[Ea(y,pi),Aa(y),za(Zt),_a(Fe),Ma(xt,Co),ya(Dt),Ta(c),Ca({zoo:w.zoo,vetrina:w.vetrina,seme:w.seme})]}],campione:()=>({disegni:y.statistiche.disegni+Q.statistiche.disegni+y.statistiche.disegniAcqua+y.statistiche.disegniErba+y.statistiche.disegniSpecchio,rtMs:null}),autore:"partita",titolo:"Officina \xB7 partita",apertoSubito:!0,scuro:!0,agganciaFrame:l=>fi=l}),document.getElementById("chiudiDock").addEventListener("click",()=>document.body.classList.remove("con-officina"))}document.getElementById("apriOfficina").addEventListener("click",hn);K.has("officina")&&hn();var ss=new to(()=>({versione:(document.getElementById("versione")||{}).textContent||"partita in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:Xr.scelta,ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[W.clientWidth,W.clientHeight],reso:[W.width,W.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:"partita sul nucleo",seme:w.seme,raggio:w.raggio,erba:w.erba,ombra:y.ombra,specchio:w.specchio,disegniSpecchio:y.statistiche.disegniSpecchio,corpi:xt.statistiche.corpi,dprMax:w.dprMax,jsMs:+ht(Kt,.5).toFixed(2),jsP99:+ht(Kt,.99).toFixed(2),streaming:{...Dt.statistiche},finestra:y.finestra&&y.finestra.spostamenti},ombreLampade:!1,antialias:!0,fps:ht(lt,.5)?1e3/ht(lt,.5):null,p50:ht(lt,.5),p99:ht(lt,.99),disegni:y.statistiche.disegni+Q.statistiche.disegni+y.statistiche.disegniAcqua+y.statistiche.disegniErba+y.statistiche.disegniSpecchio,triangoli:y.statistiche.triangoli+Q.statistiche.triangoli+y.statistiche.triangoliAcqua+y.statistiche.triangoliErba+y.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:xo,storiaLivelli:[],scheda:So(fe),software:/swiftshader|llvmpipe/i.test(So(fe)),chunk:y.statistiche.chunkTotali,blocchi:$.contaBlocchi,luci:0,decorazioni:bt.conta,erba:y.statistiche.triangoliErba,ora:`${Math.floor(Zt.ora*24)}h`,giorno:0,worldgenMs:Za,meshMs:Za}),()=>(y.disegna(_o(),0,Q),Q.disegna(y,_o()),y.disegnaAcqua(),Promise.resolve(W.toDataURL("image/webp",.6))));globalThis.PARTITA={resa:y,modelli:Q,mondo:$,passeggero:T,sguardo:$t,corpi:xt,streaming:Dt,entita:bt,opz:w,lanciaCubi:Co,intento:et,zoom:()=>Wt,mirato:()=>q,statistiche:()=>({fps:1e3/(ht(lt,.5)||1),p50:ht(lt,.5),p99:ht(lt,.99),js:ht(Kt,.5),...y.statistiche,modelli:{...Q.statistiche},streaming:{...Dt.statistiche},corpi:{...xt.statistiche},fotogrammi:pn}),diagnostica:ss};

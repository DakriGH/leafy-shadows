var wn=Object.defineProperty;var De=(i,e,o)=>()=>{if(o)throw o[0];try{return i&&(e=i(i=0)),e}catch(t){throw o=[t],t}};var zt=(i,e)=>{for(var o in e)wn(i,o,{get:e[o],enumerable:!0})};var Pa={};zt(Pa,{BLOCCHI:()=>re,CATEGORIA_OFFICINA:()=>it,CATEGORIA_PROVE:()=>Go,CATEGORIE_BLOCCHI:()=>Vo,defBlocco:()=>Jn,defDi:()=>q,livelloAcqua:()=>Me,registraBlocco:()=>$e,rimuoviBlocco:()=>Wn,tipoBase:()=>Ke});function $e(i,e,o=it){re[i]=e,o.blocchi.includes(i)||o.blocchi.push(i)}function Wn(i){delete re[i];for(let e of[it,Go]){let o=e.blocchi.indexOf(i);o>=0&&e.blocchi.splice(o,1)}}function Jn(i){return re[i]}function q(i){return re[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||Qn}function Ke(i){let e=i.indexOf("~");return e<0?i:i.slice(0,e)}function Me(i){if(!i||!i.startsWith("acqua"))return null;let e=i.indexOf("~");return e<0?0:Number(i.slice(e+1))}var re,Vo,it,Go,Qn,ie=De(()=>{re={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},Vo=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],it={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};Vo.push(it);Go={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};Vo.push(Go);Qn={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"}});var yi={};zt(yi,{CATALOGO:()=>ft,conAlone:()=>Ir,istanzaDi:()=>Or,posaDi:()=>ho,registraAsset:()=>ta,rigaDi:()=>Lt});function Lt(i){return Object.prototype.hasOwnProperty.call(ft,i)?ft[i]:null}function ta(i,e){return ft[i]={nome:i,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1],...e,modello:e.modello||i},ft[i]}function ea(i,e,o,t){let a=Math.imul(i|0,374761393)+Math.imul(e|0,668265263)+Math.imul(o|0,1274126177)+Math.imul(t|0,2246822519)|0;return a=Math.imul(a^a>>>13,1274126177),((a^a>>>16)>>>0)/4294967296}function ho(i,e,o,t,a=!0){let n=Lt(i);if(!n||!a)return{scala:1,tinta:[1,1,1],giro:0};let r=1;if(Array.isArray(n.scala)){let l=ea(e,o,t,1);r=n.scala[0]+l*(n.scala[1]-n.scala[0])}else typeof n.scala=="number"&&(r=n.scala);let s=0;return n.giro==="libero"?s=ea(e,o,t,2)*Math.PI*2:n.giro==="quarti"&&(s=Math.floor(ea(e,o,t,2)*4)*Lr),{scala:r,tinta:[1,1,1],giro:s}}function Or(i,e,o,t,a=!0){let n=ho(i,e,o,t,a);return[e,o,t,n.scala,n.tinta[0],n.tinta[1],n.tinta[2],n.giro]}function Ir(){return Object.entries(ft).filter(([,i])=>i.alone)}var ft,Lr,Ot=De(()=>{ft={albero:{nome:"Albero",modello:"albero",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,5,1]},lampione:{nome:"Lampione",modello:"lampione",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1],alone:{quota:2.35,raggio:1.6,colore:[1,.85,.5]}},lampioneSpento:{nome:"Lampione spento",modello:"lampioneSpento",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1]},panchina:{nome:"Panchina",modello:"panchina",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[2,1,1]},ciuffo:{nome:"Ciuffo",modello:"ciuffo",giro:"libero",scala:[.82,1.24],proiettaOmbra:!1,classe:"fermo",ingombro:[1,1,1]}};Lr=Math.PI/2});function Wi(i){return i&&typeof i=="object"?JSON.parse(JSON.stringify(i)):i}function Wr(i,e){return i===e||i&&e&&typeof i=="object"&&JSON.stringify(i)===JSON.stringify(e)}var zo,Qi=De(()=>{zo=class{constructor({scrivi:e,autore:o="locale",limite:t=500}={}){this._scrivi=e,this.autore=o,this.limite=t,this.fatti=[],this.disfatti=[],this.diario=[],this._osservatori=new Set}esegui({registro:e,campo:o,prima:t,dopo:a,nota:n}){if(Wr(t,a))return null;let r={registro:e,campo:o,prima:Wi(t),dopo:Wi(a),autore:this.autore,t:Date.now(),nota:n};return this._scrivi(e,o,r.dopo),this.fatti.push(r),this.fatti.length>this.limite&&this.fatti.shift(),this.disfatti.length=0,this._annota("esegui",r),r}aVista(e,o,t){this._scrivi(e,o,t)}annulla(){let e=this.fatti.pop();return e?(this._scrivi(e.registro,e.campo,e.prima),this.disfatti.push(e),this._annota("annulla",e),e):null}ripeti(){let e=this.disfatti.pop();return e?(this._scrivi(e.registro,e.campo,e.dopo),this.fatti.push(e),this._annota("ripeti",e),e):null}get puoAnnullare(){return this.fatti.length>0}get puoRipetere(){return this.disfatti.length>0}netto(){let e={};for(let o of this.fatti)(e[o.registro]||={})[o.campo]=o.dopo;return e}rigioca(e){for(let o of e)this._scrivi(o.registro,o.campo,o.dopo)}osserva(e){return this._osservatori.add(e),()=>this._osservatori.delete(e)}_annota(e,o){this.diario.push({verbo:e,...o}),this.diario.length>this.limite*2&&this.diario.shift();for(let t of this._osservatori)t(e,o)}}});function sa(i){if(i&&i.chiave&&typeof i.disegna=="function")return i.campi=i.campi||[],i;if(!i||!i.chiave||!Array.isArray(i.campi))throw new Error(`registro malformato: ${i&&i.chiave}`);for(let e of i.campi){if(!Qr.includes(e.tipo))throw new Error(`${i.chiave}.${e.chiave}: tipo sconosciuto \xAB${e.tipo}\xBB`);if(e.tipo!=="azione"&&typeof e.leggi!="function")throw new Error(`${i.chiave}.${e.chiave}: manca leggi()`);e.tipo==="scelta"&&(e.scelte=(e.scelte||[]).map(o=>typeof o=="object"?o:{v:o,nome:String(o)})),e.tipo==="numero"&&(e.min??=0,e.max??=1,e.passo??=(e.max-e.min)/100)}return i}function Mo(i,e){if(e==null)return"\u2014";switch(i.tipo){case"numero":{let o=i.passo>=1?0:i.passo>=.1?1:i.passo>=.01?2:3;return Number(e).toFixed(o)+(i.unita?" "+i.unita:"")}case"interruttore":return e?"s\xEC":"no";case"scelta":{let o=i.scelte.find(t=>t.v===e);return o?o.nome:String(e)}default:return typeof e=="object"?JSON.stringify(e):String(e)}}function Ji(i,e){switch(i.tipo){case"numero":return Number(e);case"interruttore":return!!e&&e!=="false";case"scelta":{let o=i.scelte.find(t=>String(t.v)===String(e));return o?o.v:e}default:return e}}var Qr,ca=De(()=>{Qr=["numero","interruttore","scelta","colore","testo","azione","lettura"]});function la(i,e,o){i.push(e),i.length>o&&i.shift()}function qe(i,e){if(!i.length)return NaN;let o=i.slice().sort((t,a)=>t-a);return o[Math.min(o.length-1,Math.floor(o.length*e))]}function dt(i){return Number.isFinite(i)?Math.round(i*10)/10:null}var To,en=De(()=>{To=class{constructor({campione:e,finestra:o=240}={}){this._campione=e||(()=>({})),this.finestra=o,this.ms=[],this.disegni=[],this.rtMs=[],this._prima=0,this._raccolta=null}passo(e=performance.now()){if(this._prima){let o=e-this._prima,t=this._campione()||{};la(this.ms,o,this.finestra),Number.isFinite(t.disegni)&&la(this.disegni,t.disegni,this.finestra),Number.isFinite(t.rtMs)&&la(this.rtMs,t.rtMs,this.finestra),this._raccolta&&e>=this._raccolta.da&&(this._raccolta.ms.push(o),Number.isFinite(t.disegni)&&this._raccolta.disegni.push(t.disegni),Number.isFinite(t.rtMs)&&this._raccolta.rtMs.push(t.rtMs))}this._prima=e}adesso(){return{fps:this.ms.length?Math.round(1e3/qe(this.ms,.5)):null,p50:dt(qe(this.ms,.5)),p99:dt(qe(this.ms,.99)),disegni:this.disegni.length?Math.round(qe(this.disegni,.5)):null,rtMs:dt(qe(this.rtMs,.5))}}misura({secondi:e=5,riscaldo:o=1,etichetta:t=""}={}){let a=performance.now();return this._raccolta={da:a+o*1e3,ms:[],disegni:[],rtMs:[]},new Promise(n=>{let r=a+(o+e)*1e3,s=()=>{if(performance.now()<r)return requestAnimationFrame(s);let l=this._raccolta;this._raccolta=null,n({etichetta:t,frame:l.ms.length,secondi:e,fps:l.ms.length?Math.round(1e3/qe(l.ms,.5)):null,p50:dt(qe(l.ms,.5)),p99:dt(qe(l.ms,.99)),disegni:l.disegni.length?Math.round(qe(l.disegni,.5)):null,rtMs:dt(qe(l.rtMs,.5))})};requestAnimationFrame(s)})}}});var Jr,_o,tn=De(()=>{ca();Jr=`
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
`,_o=class{constructor({registri:e,bus:o,vivi:t,radice:a=document.body,titolo:n="Officina",contenitore:r=null,scuro:s=!1,etichetta:l=null,azioni:c=!0}){this.registri=e,this.bus=o,this._vivi=t||(()=>""),this.attivo=e[0]&&e[0].chiave,this._el={},this.incassato=!!r,this._etichetta=l,this._azioni=c,this._costruisci(r||a,n,s),this._orologio=setInterval(()=>this.aggiorna(),500),o.osserva(()=>this.aggiorna(!0))}apri(e=!0){this.incassato&&(e=!0),this.radice.classList.toggle("aperta",e),e&&this.aggiorna(!0)}get aperto(){return this.incassato||this.radice.classList.contains("aperta")}esito(e){this._el.esito.hidden=!e,this._el.esito.textContent=e||""}_costruisci(e,o,t){if(!document.getElementById("officina-stile")){let n=document.createElement("style");n.id="officina-stile",n.textContent=Jr,document.head.appendChild(n)}let a=this.radice=document.createElement("div");a.id="officina",this.incassato&&a.classList.add("incassato","aperta"),t&&a.classList.add("scuro"),a.innerHTML=`
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
      </div>`,e.appendChild(a),this._el.tasto=a.querySelector(".off-tasto"),this._el.vivi=a.querySelector(".off-vivi"),this._el.etichetta=a.querySelector(".off-etichetta"),this._etichetta&&(this._el.etichetta.textContent=this._etichetta,a.classList.add("con-etichetta")),this._azioni||(a.querySelector("[data-fa=annulla]").hidden=!0,a.querySelector("[data-fa=ripeti]").hidden=!0),this.registri.length<2&&a.classList.add("senza-schede"),this._el.nav=a.querySelector("nav"),this._el.campi=a.querySelector(".off-campi"),this._el.esito=a.querySelector(".off-esito"),this._el.annulla=a.querySelector("[data-fa=annulla]"),this._el.ripeti=a.querySelector("[data-fa=ripeti]"),this._el.tasto.addEventListener("click",()=>this.apri(!0)),a.querySelector("[data-fa=chiudi]").addEventListener("click",()=>this.apri(!1)),this._el.annulla.addEventListener("click",()=>this.bus.annulla()),this._el.ripeti.addEventListener("click",()=>this.bus.ripeti()),a.addEventListener("keydown",n=>{n.key==="Escape"&&this.apri(!1),n.stopPropagation()}),a.addEventListener("keyup",n=>n.stopPropagation()),a.querySelector(".off-corpo").addEventListener("wheel",n=>n.stopPropagation(),{passive:!0});for(let n of this.registri){let r=document.createElement("button");r.type="button",r.textContent=n.nome,r.dataset.chiave=n.chiave,r.addEventListener("click",()=>{this.attivo=n.chiave,this._disegnaScheda()}),this._el.nav.appendChild(r)}this._disegnaScheda()}_disegnaScheda(){for(let t of this._el.nav.children)t.classList.toggle("acceso",t.dataset.chiave===this.attivo);let e=this.registri.find(t=>t.chiave===this.attivo),o=this._el.campi;if(o.innerHTML="",this._controlli=[],this._vista=null,!!e){if(e.nota){let t=document.createElement("div");t.className="off-nota",t.textContent=e.nota,o.appendChild(t)}if(typeof e.disegna=="function"){this._vista=e.disegna(o,this)||null;return}for(let t of e.campi)o.appendChild(this._controllo(e,t));this.aggiorna(!0)}}_controllo(e,o){let t=document.createElement("div");t.className="campo",t.dataset.campo=o.chiave;let a=document.createElement("div");a.className="riga";let n=document.createElement("span");n.className="nome",n.textContent=o.nome,a.appendChild(n),t.appendChild(a);let r=(l,c)=>this.bus.esegui({registro:e.chiave,campo:o.chiave,prima:l,dopo:c}),s={campo:o,el:null,mostra:null,tocco:!1};switch(o.tipo){case"numero":{let l=document.createElement("span");l.className="valore",a.appendChild(l);let c=document.createElement("input");c.type="range",c.min=o.min,c.max=o.max,c.step=o.passo;let u;c.addEventListener("input",()=>{u===void 0&&(u=o.leggi()),s.tocco=!0;let p=Number(c.value);l.textContent=Mo(o,p),this.bus.aVista(e.chiave,o.chiave,p)}),c.addEventListener("change",()=>{let p=Number(c.value);s.tocco=!1;let f=u===void 0?o.leggi():u;u=void 0,r(f,p)}),t.appendChild(c),s.el=c,s.mostra=p=>{s.tocco||(c.value=p,l.textContent=Mo(o,p))};break}case"interruttore":{let l=document.createElement("button");l.type="button",l.className="interruttore",l.addEventListener("click",()=>{let c=!!o.leggi();r(c,!c)}),a.appendChild(l),s.el=l,s.mostra=c=>{l.classList.toggle("acceso",!!c),l.textContent=c?"s\xEC":"no"};break}case"scelta":{let l=document.createElement("select");for(let c of o.scelte){let u=document.createElement("option");u.value=String(c.v),u.textContent=c.nome,l.appendChild(u)}l.addEventListener("change",()=>r(o.leggi(),Ji(o,l.value))),a.appendChild(l),s.el=l,s.mostra=c=>{l.value=String(c)};break}case"colore":{let l=document.createElement("input");l.type="color";let c;l.addEventListener("input",()=>{c===void 0&&(c=o.leggi()),this.bus.aVista(e.chiave,o.chiave,l.value)}),l.addEventListener("change",()=>{let u=c===void 0?o.leggi():c;c=void 0,r(u,l.value)}),a.appendChild(l),s.el=l,s.mostra=u=>{document.activeElement!==l&&(l.value=u||"#000000")};break}case"testo":{let l=document.createElement("input");l.type="text",l.readOnly=!o.scrivi,l.addEventListener("change",()=>o.scrivi&&r(o.leggi(),l.value)),a.appendChild(l),s.el=l,s.mostra=c=>{document.activeElement!==l&&(l.value=c??"")};break}case"lettura":{let l=document.createElement("span");l.className="valore",a.appendChild(l),s.mostra=c=>{l.textContent=Mo(o,c)};break}case"azione":{t.removeChild(a);let l=document.createElement("button");l.type="button",l.className="azione",l.textContent=o.nome,l.addEventListener("click",async()=>{l.disabled=!0;try{await o.fai(this)}finally{l.disabled=!1,this.aggiorna(!0)}}),t.appendChild(l),s.el=l;break}}if(o.nota){let l=document.createElement("small");l.textContent=o.nota,t.appendChild(l)}return this._controlli.push(s),t}aggiorna(e=!1){if(this._el.tasto.textContent=`\u2699 ${this._vivi(!0)||"Officina"}`,!(!this.aperto&&!e)){this._el.vivi.innerHTML=this._vivi(!1)||"",this._el.annulla.disabled=!this.bus.puoAnnullare,this._el.ripeti.disabled=!this.bus.puoRipetere;for(let o of this._controlli||[])if(!(!o.mostra||o.tocco))try{o.mostra(o.campo.leggi())}catch(t){o.el&&(o.el.title=String(t))}if(this._vista&&this._vista.aggiorna)try{this._vista.aggiorna()}catch{}}}vaiA(e){this.attivo!==e&&(this.attivo=e,this._disegnaScheda())}}});var on={};zt(on,{apriOfficina:()=>es});function es({registri:i,gruppi:e=null,campione:o,autore:t="officina",titolo:a="Officina",apertoSubito:n=!1,agganciaFrame:r,contenitore:s=null,scuro:l=!1}={}){e&&(i=e.flatMap(b=>b.registri)),i=i.map(sa);let c=new Map(i.map(b=>[b.chiave,new Map(b.campi.map(x=>[x.chiave,x]))])),u=new Map(i.map(b=>[b.chiave,b])),p=(b,x,A)=>{let E=c.get(b)&&c.get(b).get(x);if(E&&E.scrivi){E.scrivi(A);return}let M=u.get(b);if(M&&typeof M.scriviDinamico=="function"){M.scriviDinamico(x,A);return}throw new Error(`campo non scrivibile: ${b}.${x}`)},f=new zo({scrivi:p,autore:t}),d=new To({campione:o}),m=b=>{let x=d.adesso();return x.fps==null?b?"Officina":"in attesa del primo fotogramma\u2026":b?`${x.fps} fps \xB7 ${x.disegni??"\u2014"}d`:`<b>${x.fps}</b> fps \xB7 p50 ${x.p50} \xB7 p99 ${x.p99} ms \xB7 <b>${x.disegni??"\u2014"}</b> disegni \xB7 rt ${x.rtMs??"\u2014"} ms`},h=(e||[{contenitore:s,registri:i,etichetta:null,azioni:!0}]).map((b,x)=>new _o({registri:b.registri.map(sa),bus:f,vivi:m,titolo:a,contenitore:b.contenitore||s,scuro:l,etichetta:b.etichetta??null,azioni:b.azioni??x===0})),g=h[0];if(n)for(let b of h)b.apri(!0);return r&&r(()=>d.passo()),{registri:i,bus:f,campionatore:d,pannello:g,pannelli:h,vivi:m,vaiA:b=>{for(let x of h)x.registri.some(A=>A.chiave===b)&&x.vaiA(b)},passo:()=>d.passo()}}var an=De(()=>{Qi();ca();en();tn()});var cn={};zt(cn,{TETTO_VOCI:()=>os,creaScena:()=>as,esa:()=>rn,leggiMeta:()=>sn,vociVicine:()=>nn});function nn(i,e,o=60){let t=i.map(a=>{let n=a.x-e.x,r=(a.y-e.y)*.5,s=a.z-e.z;return{...a,lontano:Math.sqrt(n*n+r*r+s*s)}});return t.sort((a,n)=>a.lontano-n.lontano),{voci:t.slice(0,o),altri:Math.max(0,t.length-o)}}function rn(i){return"#"+(i>>>0&16777215).toString(16).padStart(6,"0")}function as({entita:i,dove:e,coloreDi:o,nomeDi:t,rigaDi:a,onVaiA:n=null}){let r={scelto:null,aperti:new Set,filtro:""},s={},l=()=>{for(let f of Object.values(s))f&&f()};function c(){if(!document.getElementById("officina-scena-stile")){let f=document.createElement("style");f.id="officina-scena-stile",f.textContent=ts,document.head.appendChild(f)}}return{gerarchia:{chiave:"gerarchia",nome:"\u{1F5C2} Gerarchia",disegna(f){c(),f.style.display="flex",f.style.flexDirection="column";let d=document.createElement("div");d.className="sc-barra";let m=document.createElement("input");m.type="text",m.placeholder="cerca un tipo\u2026",m.value=r.filtro;let h=document.createElement("span");h.className="valore",d.append(m,h);let g=document.createElement("div");g.className="sc-albero sc-alto",f.append(d,g),m.addEventListener("input",()=>{r.filtro=m.value.trim().toLowerCase(),v()});function v(){g.innerHTML="";let b=i.perTipo().filter(([A])=>!r.filtro||A.toLowerCase().includes(r.filtro)||(t(A)||"").toLowerCase().includes(r.filtro));if(h.textContent=`${i.conta} oggetti`,!b.length){let A=document.createElement("div");A.className="sc-vuoto",A.textContent="niente da mostrare",g.appendChild(A);return}let x=e();for(let[A,E]of b){let M=document.createElement("div");M.className="sc-gruppo";let O=document.createElement("button");O.type="button",O.className="sc-cap";let w=r.aperti.has(A),L=document.createElement("i");L.className="sc-pallino",L.style.background=o(A);let I=document.createElement("span");I.textContent=(w?"\u25BE ":"\u25B8 ")+(t(A)||A);let P=document.createElement("span");if(P.className="sc-quanti",P.textContent=E,O.append(L,I,P),O.addEventListener("click",()=>{w?r.aperti.delete(A):r.aperti.add(A),v()}),M.appendChild(O),w){let C=[];i.ognunaDi(A,(U,D,Z,R)=>C.push({id:R,x:U,y:D,z:Z}));let{voci:y,altri:_}=nn(C,x);for(let U of y){let D=document.createElement("button");D.type="button",D.className="sc-voce"+(U.id===r.scelto?" scelta":"");let Z=i.leggi(U.id),R=document.createElement("span");R.textContent=Z&&Z.nome||`#${U.id}`;let H=document.createElement("span");H.className="sc-lont",H.textContent=U.lontano.toFixed(0)+" m",D.append(R,H),D.addEventListener("click",()=>{r.scelto=U.id,l()}),M.appendChild(D)}if(_){let U=document.createElement("div");U.className="sc-altri",U.textContent=`e altri ${_}, pi\xF9 lontani`,M.appendChild(U)}}g.appendChild(M)}}return s.gerarchia=v,v(),{aggiorna(){h.textContent=`${i.conta} oggetti`}}}},ispettore:{chiave:"ispettore",nome:"\u{1F50D} Ispettore",scriviDinamico(f,d){let m=f.indexOf("."),h=Number(f.slice(0,m)),g=f.slice(m+1);if(g==="nome"){i.battezza(h,d||null),l();return}if(g==="meta"){i.metadati(h,d);return}if(g==="tinta"){i.posa(h,{tinta:d});return}i.posa(h,{[g]:d})},disegna(f,d){c();let m=document.createElement("div");m.className="sc-isp sc-solo",f.appendChild(m);let h=(b,x,A,E)=>d.bus.esegui({registro:"ispettore",campo:`${b}.${x}`,prima:A,dopo:E});function g(b,x,A,E,M,O,w,L=I=>I.toFixed(2)){let I=document.createElement("div");I.className="sc-riga";let P=document.createElement("span");P.textContent=x;let C=document.createElement("input");C.type="range",C.min=A,C.max=E,C.step=M,C.value=O();let y=document.createElement("span");y.className="sc-num",y.textContent=L(O());let _;C.addEventListener("input",()=>{_===void 0&&(_=O());let U=Number(C.value);y.textContent=L(U),i.posa(r.scelto,{[w]:U})}),C.addEventListener("change",()=>{let U=_===void 0?O():_;_=void 0,h(r.scelto,w,U,Number(C.value))}),I.append(P,C,y),b.appendChild(I)}function v(){m.innerHTML="";let b=r.scelto==null?null:i.leggi(r.scelto);if(!b){let R=document.createElement("div");R.className="sc-vuoto",R.textContent="Nessun oggetto scelto. Cliccane uno nel gioco, o aprine un gruppo nella Gerarchia.",m.appendChild(R);return}let x=document.createElement("div");x.className="sc-titolo";let A=document.createElement("i");A.className="sc-pallino",A.style.background=o(b.tipo);let E=document.createElement("input");E.type="text",E.value=b.nome||"",E.placeholder=`#${b.id}`,E.style.flex="1",E.style.maxWidth="none",E.addEventListener("change",()=>h(b.id,"nome",b.nome||"",E.value)),x.append(A,E),m.appendChild(x);let M=a(b.tipo),O=document.createElement("div");O.className="sc-tipo",O.textContent=M?`${t(b.tipo)||b.tipo} \xB7 id ${b.id} \xB7 giro ${M.giro} \xB7 classe ${M.classe} \xB7 ingombro ${M.ingombro.join("\xD7")}${M.proiettaOmbra?" \xB7 fa ombra":""}`:`${b.tipo} \xB7 id ${b.id} \xB7 fuori catalogo`,m.appendChild(O);let w=document.createElement("div");w.className="sc-tre";for(let R of["x","y","z"]){let H=document.createElement("label");H.textContent=R;let de=document.createElement("input");de.type="number",de.step="0.5",de.value=b[R].toFixed(2),de.addEventListener("change",()=>h(b.id,R,b[R],Number(de.value))),H.appendChild(de),w.appendChild(H)}m.appendChild(w),g(m,"giro",0,Math.PI*2,.01,()=>i.leggi(r.scelto).giro,"giro",R=>`${Math.round(R*180/Math.PI)}\xB0`),g(m,"scala",.1,4,.01,()=>i.leggi(r.scelto).scala,"scala");let L=document.createElement("div");L.className="sc-riga";let I=document.createElement("span");I.textContent="tinta";let P=document.createElement("input");P.type="color",P.value=rn(Math.round(b.tinta[0]*255)<<16|Math.round(b.tinta[1]*255)<<8|Math.round(b.tinta[2]*255)),P.addEventListener("change",()=>{let R=parseInt(P.value.slice(1),16);h(b.id,"tinta",b.tinta,[(R>>16&255)/255,(R>>8&255)/255,(R&255)/255])}),L.append(I,P),m.appendChild(L);let C=document.createElement("div");C.className="sc-meta";let y=document.createElement("div");y.textContent="dati (chiave: valore, uno per riga)",y.style.opacity=".7";let _=document.createElement("textarea");_.value=Object.entries(b.dati||{}).map(([R,H])=>`${R}: ${H}`).join(`
`),_.addEventListener("change",()=>h(b.id,"meta",b.dati||{},sn(_.value))),C.append(y,_),m.appendChild(C);let U=document.createElement("div");if(U.className="sc-azioni",n){let R=document.createElement("button");R.type="button",R.textContent="\u2316 vai qui",R.addEventListener("click",()=>n(i.leggi(r.scelto))),U.appendChild(R)}let D=document.createElement("button");D.type="button",D.textContent="\u29C9 duplica",D.addEventListener("click",()=>{let R=i.leggi(r.scelto);R&&(r.scelto=i.aggiungi(R.tipo,R.x+1,R.y,R.z,{giro:R.giro,scala:R.scala,tinta:R.tinta,nome:R.nome,dati:R.dati}),l())});let Z=document.createElement("button");Z.type="button",Z.className="rosso",Z.textContent="\u2715 elimina",Z.addEventListener("click",()=>{i.togli(r.scelto),r.scelto=null,l()}),U.append(D,Z),m.appendChild(U)}return s.ispettore=v,v(),{aggiorna(){}}}},scegli(f){r.scelto=f,l()},get scelto(){return r.scelto}}}function sn(i){let e={};for(let o of String(i).split(`
`)){let t=o.indexOf(":");if(t<=0)continue;let a=o.slice(0,t).trim();a&&(e[a]=o.slice(t+1).trim())}return e}var ts,os,ln=De(()=>{ts=`
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
`,os=60});var dn={};zt(dn,{MANO_VUOTA:()=>ua,categorieDi:()=>fn,filtra:()=>pn,registroCreativa:()=>rs,voci:()=>ns});function ns({categorie:i,blocchi:e,catalogo:o,nomeArredo:t=null}){let a=[ua],n=new Set;for(let r of i)for(let s of r.blocchi){let l=e[s];if(!l||n.has(s))continue;n.add(s);let c=o&&o[l.modello||s];a.push({id:s,nome:l.nome||s,categoria:r.id,categoriaNome:r.nome,cosa:l.forma==="modello",cima:l.cima??l.colore??10066329,lato:l.lato??l.colore??7829367,ombra:c?c.proiettaOmbra:void 0})}for(let[r,s]of Object.entries(e))n.has(r)||(n.add(r),a.push({id:r,nome:t&&t(r)||s.nome||r,categoria:s.forma==="modello"?"cose":"altro",categoriaNome:s.forma==="modello"?"Cose":"Altro",cosa:s.forma==="modello",cima:s.cima??s.colore??10066329,lato:s.lato??s.colore??7829367}));return a}function fn(i){let e=[],o=new Set;for(let t of i)t.categoria==="mano"||o.has(t.categoria)||(o.add(t.categoria),e.push({id:t.categoria,nome:t.categoriaNome||t.categoria}));return e}function pn(i,e,o){let t=String(o||"").trim().toLowerCase();return i.filter(a=>e&&a.categoria!==e&&a.categoria!=="mano"?!1:t?(a.nome||"").toLowerCase().includes(t)||String(a.id||"").toLowerCase().includes(t):!0)}function rs({elenco:i,inMano:e,onPrendi:o}){let t=null,a="";return{chiave:"creativa",nome:"\u{1F392} Creativa",nota:"Tutto quello che si pu\xF2 avere in mano. Un clic e ce l'hai.",disegna(n){if(!document.getElementById("officina-creativa-stile")){let m=document.createElement("style");m.id="officina-creativa-stile",m.textContent=is,document.head.appendChild(m)}let r=document.createElement("div");r.className="cr-schede";let s=document.createElement("input");s.type="text",s.className="cr-cerca",s.placeholder="cerca\u2026";let l=document.createElement("div");l.className="cr-quante";let c=document.createElement("div");c.className="cr-griglia",n.append(r,s,l,c);let p=[{id:null,nome:"Tutto"},...fn(i)].map(m=>{let h=document.createElement("button");return h.type="button",h.textContent=m.nome,h.addEventListener("click",()=>{t=m.id,f(),d()}),r.appendChild(h),{b:h,id:m.id}});function f(){for(let m of p)m.b.classList.toggle("acceso",m.id===t)}s.addEventListener("input",()=>{a=s.value,d()});function d(){let m=pn(i,t,a);if(l.textContent=`${m.length-(m[0]===ua?1:0)} cose`,c.innerHTML="",!m.length){let g=document.createElement("div");g.className="cr-vuoto",g.textContent="niente che si chiami cos\xEC",c.appendChild(g);return}let h=e();for(let g of m){let v=document.createElement("button");v.type="button",v.className="cr-cella"+(g.id===h?" scelta":""),v.title=g.id?`${g.nome} (${g.id})`:"mano vuota \u2014 rompi e interagisci";let b=document.createElement("i");if(b.className="cr-ico"+(g.id===null?" cr-vuota":g.cosa?" cr-cosa":""),g.id!==null){let A=document.createElement("b");A.className="cr-cima",A.style.background=un(g.cima);let E=document.createElement("b");E.className="cr-lato",E.style.background=un(g.lato),b.append(E,A)}let x=document.createElement("span");x.textContent=g.nome,v.append(b,x),v.addEventListener("pointerdown",A=>{A.preventDefault(),A.stopPropagation(),o(g.id),d()}),c.appendChild(v)}}return f(),d(),{aggiorna(){}}}}}var is,ua,un,mn=De(()=>{is=`
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
`,ua={id:null,nome:"Mano vuota",categoria:"mano",cosa:!1,cima:null,lato:null};un=i=>"#"+(i>>>0&16777215).toString(16).padStart(6,"0")});function La(i,{antialias:e=!0,dprMax:o=1.5}={}){let t=i.getContext("webgl2",{antialias:e,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!t)throw new Error("WebGL2 non disponibile");let a=Math.min(o,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(i.clientWidth*a)),s=Math.max(1,Math.round(i.clientHeight*a));return i.width!==r||i.height!==s?(i.width=r,i.height=s,t.viewport(0,0,r,s),!0):!1};return n(),{gl:t,dpr:a,ridimensiona:n}}function ue(i,e,o){let t=(n,r)=>{let s=i.createShader(n);if(i.shaderSource(s,r),i.compileShader(s),!i.getShaderParameter(s,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(s)}
${r.split(`
`).map((l,c)=>`${c+1}: ${l}`).join(`
`)}`);return s},a=i.createProgram();if(i.attachShader(a,t(i.VERTEX_SHADER,e)),i.attachShader(a,t(i.FRAGMENT_SHADER,o)),i.linkProgram(a),!i.getProgramParameter(a,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(a)}`);return a}function Fo(i){let e=i.getExtension("WEBGL_debug_renderer_info");return e?i.getParameter(e.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function fe(i,e,o){return(Math.sign(i)+1)*9+(Math.sign(e)+1)*3+(Math.sign(o)+1)}var Fs=fe(1,0,0),Ds=fe(-1,0,0),Us=fe(0,1,0),Bs=fe(0,-1,0),ks=fe(0,0,1),Vs=fe(0,0,-1);var Mt=class{constructor(e=1024){this.byte=new Uint8Array(e*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(e){let o=(this.n+e)*12;if(o<=this.byte.length)return;let t=this.byte.length*2;for(;t<o;)t*=2;let a=new Uint8Array(t);a.set(this.byte),this.byte=a,this.u32=new Uint32Array(a.buffer)}vertice(e,o,t,a,n,r,s,l=0,c=0){let u=Math.round(e*16)+16,p=Math.round(t*16)+16,f=Math.round(o*16);if(u<0||u>511||p<0||p>511||f<0||f>65535)throw new RangeError(`vertice fuori dal chunk: ${e},${o},${t}`);if(a<0||a>26||a===13)throw new RangeError(`normale non valida: ${a}`);this._spazio(1);let d=this.n*3,m=this.byte,h=this.u32;h[d]=(u|p<<9|(a&31)<<18|(l&1)<<23|(c&15)<<24)>>>0,h[d+1]=(f|(n&15)<<16|(r&15)<<20)>>>0;let g=this.n*12+8;m[g]=s>>16&255,m[g+1]=s>>8&255,m[g+2]=s&255,m[g+3]=0,this.n++}quadDa(e,o,t,a){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[e,o,t,a])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function Oa(i=16384){let e=new Uint16Array(i*6);for(let o=0,t=0,a=0;o<i;o++,a+=4)e[t++]=a,e[t++]=a+1,e[t++]=a+2,e[t++]=a,e[t++]=a+2,e[t++]=a+3;return e}function Ia(i,e,o,t){let a=1/Math.tan(i/2),n=1/(o-t);return new Float32Array([a/e,0,0,0,0,a,0,0,0,0,(t+o)*n,-1,0,0,2*t*o*n,0])}function Do(i,e,o){let t=1/(o-e);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*t,0,0,0,-(o+e)*t,1])}function Xt(i,e,o=[0,1,0]){let t=i[0]-e[0],a=i[1]-e[1],n=i[2]-e[2],r=Math.hypot(t,a,n)||1;t/=r,a/=r,n/=r;let s=o[1]*n-o[2]*a,l=o[2]*t-o[0]*n,c=o[0]*a-o[1]*t;r=Math.hypot(s,l,c)||1,s/=r,l/=r,c/=r;let u=a*c-n*l,p=n*s-t*c,f=t*l-a*s;return new Float32Array([s,u,t,0,l,p,a,0,c,f,n,0,-(s*i[0]+l*i[1]+c*i[2]),-(u*i[0]+p*i[1]+f*i[2]),-(t*i[0]+a*i[1]+n*i[2]),1])}function Ra(i,e=new Float32Array(16)){let[o,t,a,n,r,s,l,c,u,p,f,d,m,h,g,v]=i,b=o*s-t*r,x=o*l-a*r,A=o*c-n*r,E=t*l-a*s,M=t*c-n*s,O=a*c-n*l,w=u*h-p*m,L=u*g-f*m,I=u*v-d*m,P=p*g-f*h,C=p*v-d*h,y=f*v-d*g,_=b*y-x*C+A*P+E*I-M*L+O*w;return _?(_=1/_,e[0]=(s*y-l*C+c*P)*_,e[1]=(a*C-t*y-n*P)*_,e[2]=(h*O-g*M+v*E)*_,e[3]=(f*M-p*O-d*E)*_,e[4]=(l*I-r*y-c*L)*_,e[5]=(o*y-a*I+n*L)*_,e[6]=(g*A-m*O-v*x)*_,e[7]=(u*O-f*A+d*x)*_,e[8]=(r*C-s*I+c*w)*_,e[9]=(t*I-o*C-n*w)*_,e[10]=(m*M-h*A+v*b)*_,e[11]=(p*A-u*M-d*b)*_,e[12]=(s*L-r*P-l*w)*_,e[13]=(o*P-t*L+a*w)*_,e[14]=(h*x-m*E-g*b)*_,e[15]=(u*E-p*x+f*b)*_,e):null}function Tt(i,e,o=new Float32Array(16)){for(let t=0;t<4;t++)for(let a=0;a<4;a++)o[t*4+a]=i[a]*e[t*4]+i[4+a]*e[t*4+1]+i[8+a]*e[t*4+2]+i[12+a]*e[t*4+3];return o}function Uo(i,e=new Float32Array(24)){let o=l=>[i[l],i[4+l],i[8+l],i[12+l]],t=o(0),a=o(1),n=o(2),r=o(3),s=[[r[0]+t[0],r[1]+t[1],r[2]+t[2],r[3]+t[3]],[r[0]-t[0],r[1]-t[1],r[2]-t[2],r[3]-t[3]],[r[0]+a[0],r[1]+a[1],r[2]+a[2],r[3]+a[3]],[r[0]-a[0],r[1]-a[1],r[2]-a[2],r[3]-a[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let l=0;l<6;l++){let[c,u,p,f]=s[l],d=Math.hypot(c,u,p)||1;e[l*4]=c/d,e[l*4+1]=u/d,e[l*4+2]=p/d,e[l*4+3]=f/d}return e}function Bo(i,e,o,t,a,n,r){for(let s=0;s<6;s++){let l=i[s*4],c=i[s*4+1],u=i[s*4+2],p=i[s*4+3],f=l>0?a:e,d=c>0?n:o,m=u>0?r:t;if(l*f+c*d+u*m+p<0)return!1}return!0}var ko=2,Pn=`#version 300 es
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
}`,Na=`#version 300 es
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
// \u26A0 IL COLORE DELLA LAMPADA \xC8 UN DATO, non pi\xF9 una costante nello shader. Fino
// al 10/09/2026 qui c'era vec3(1.30, 1.02, 0.58) scritto a mano: TUTTE le
// lampade del gioco facevano la stessa pozza calda, e def.luce.colore \u2014 che
// esiste da sempre in blocks.js, con tanto di lucciola verde e lampade rossa,
// verde e blu \u2014 non arrivava a schermo. \xABLuci colorate\xBB era una casella vuota.
// xyz = la tinta gi\xE0 moltiplicata per l'intensit\xE0, w = la QUOTA della lanterna
// sopra la cella (2,6 per il lampione, 0 per un blocco-lampada).
uniform highp vec4 uLampCol[8];
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
float ombraLampada(highp vec3 pos0, vec3 n, highp vec3 L) {
  // SI PARTE APPENA FUORI DALLA SUPERFICIE, non dal pixel: sulla faccia di un
  // blocco pos.xz cade ESATTAMENTE sul confine fra due celle e floor sceglie a
  // testa o croce secondo l'arrotondamento, quindi meta' dei pixel di una faccia
  // partivano dalla cella del blocco e meta' da quella d'aria. Uno scostamento
  // lungo la normale lo decide, e sempre nello stesso verso.
  highp vec3 pos = pos0 + n * 0.02;
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 cellaLampada = floor(L.xz);   // la sua cella non fa ombra a se stessa
  highp vec2 prossimo = (cella + max(verso, vec2(0.0)) - pos.xz) / (verso * mod_);   // quanto manca al confine
  highp vec2 quanto = 1.0 / mod_;                    // e quanto da un confine al prossimo
  for (int i = 0; i < 14; i++) {
    highp float t = min(prossimo.x, prossimo.y);
    if (t >= lungo) break;                           // arrivati alla lanterna: niente in mezzo
    if (prossimo.x < prossimo.y) { cella.x += verso.x; prossimo.x += quanto.x; }
    else { cella.y += verso.y; prossimo.y += quanto.y; }
    highp float y = pos.y + (L.y - pos.y) * (t / lungo);
    // \u26A0 DUE OSTACOLI DIVERSI, e servono tutti e due.
    //
    // Il canale G e' il terreno VERO. Col canale R (la silhouette, chioma
    // compresa) un albero metteva davanti alla lampada un disco di colonne alte
    // quattro \u2014 un ostacolo squadrato largo cinque celle, e l'ombra che ne
    // usciva era \xABun'ombra quadrata delle luci\xBB.
    //
    // Il canale B e' l'OGGETTO, e risponde a \xABl'ombra delle furniture complesse
    // rispetto alla luce dei lampioni mi sembra non avvenire, la luce passa
    // attraverso?\xBB. Passava, si': togliendo la chioma avevo tolto anche il
    // tronco. Adesso l'albero ferma la luce col suo TRONCO \u2014 e non con un
    // quadrato: si controlla che il raggio passi davvero vicino al centro della
    // cella (un cilindro), se no un tronco largo un quinto di cella farebbe
    // l'ombra di un cubo intero.
    highp vec2 uvC = (cella + 0.5 - uAltRett.xy) * uAltRett.zw;
    vec4 mappa = texture(uAltezze, uvC);
    float h = mappa.g * 255.0;
    // IL MARGINE E' PICCOLO, e prima era 0,6. Serve solo perche' la colonna su cui
    // si posa il pixel non si faccia ombra da se': a 0,6 nessun ostacolo alto meno
    // di sei decimi PIU' del pixel poteva fermare la luce, e sulla faccia di spalle
    // di un muro restava accesa una FASCIA in cima alta sei decimi di blocco \u2014
    // \xABuna luce fantasma illuminante dalla faccia che dovrebbe essere in ombra\xBB.
    // E LA CELLA DELLA LAMPADA NON FA OMBRA A SE STESSA NEANCHE QUI. La stessa
    // guardia c'era gia' sul canale degli OGGETTI, e mancava su questo: finche'
    // le lampade erano solo lampioni (modelli, che nel terreno non ci sono) non
    // si vedeva. Un BLOCCO-lampada e' solido, quindi sta nel canale del terreno,
    // e il raggio verso di lui entra PER FORZA nella sua cella: ogni lampada
    // appoggiata a terra si spegneva da sola, tutta, e non accendeva niente.
    if (h > y + 0.05 && h > pos.y + 0.05 && !all(equal(cella, cellaLampada))) return 0.0;
    float ho = mappa.b * 255.0;
    // \u26A0 LA CELLA DELLA LAMPADA NON FA OMBRA A SE STESSA. Il lampione e' un
    // oggetto anche lui (canale B, alto tre celle) e il raggio verso la sua
    // lanterna passa NECESSARIAMENTE per la sua cella: senza questa riga ogni
    // lampione si spegneva da solo la pozza oltre il primo blocco. Trovato non
    // guardando lo schermo ma rifacendo il cammino in JavaScript sui dati veri
    // e interrogandolo in punti scelti \u2014 a schermo sembrava solo \xABuna pozza un
    // po' piccola\xBB, che e' il genere di cosa che non fa sospettare niente.
    if (ho > pos.y + 0.3 && !all(equal(cella, cellaLampada))) {
      // \u26A0 LA DISTANZA SI MISURA AL PUNTO PIU' VICINO, non dove il raggio ENTRA
      // nella cella. La prima stesura usava il punto d'ingresso, che sta per
      // costruzione sul BORDO della cella: da li' il centro e' sempre almeno
      // mezza cella lontano, e una soglia di un terzo non poteva scattare MAI.
      // Il controllo c'era, era scritto, e non poteva essere vero \u2014 ed e' il
      // motivo per cui \xABl'ombra non avviene dai lampioni se c'e' un albero
      // davanti\xBB. Un difetto che non si vede leggendo: si vede solo mettendo
      // un albero davanti a un lampione di notte e guardando.
      highp vec2 ac = (cella + 0.5) - pos.xz;
      highp float tc = clamp(dot(ac, dir), 0.0, lungo);
      highp float dist = length(ac - dir * tc);
      highp float yc = pos.y + (L.y - pos.y) * (tc / lungo);
      // \u26A0 L'OGGETTO E' UN CONO, non un palo. In basso c'e' il tronco (stretto),
      // in alto la chioma (larga): un albero che fermasse la luce solo col
      // tronco farebbe un'ombra che non somiglia a un albero. La base la dice
      // il terreno di quella colonna (canale G), la cima l'oggetto (canale B).
      float base = max(h, pos.y);
      float su = clamp((yc - base) / max(1.0, ho - base), 0.0, 1.0);
      float raggio = mix(0.30, 0.85, smoothstep(0.10, 0.70, su));
      if (dist < raggio && ho > yc + 0.05) return 0.0;
    }
  }
  return 1.0;
}
vec3 pozza(highp vec3 pos, vec3 n, float cotto) {
  float peso = 0.0;
  vec3 tinta = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 lanterna = uLampade[i].xyz + vec3(0.0, uLampCol[i].w, 0.0);
    // LA FACCIA CHE GUARDA DALL'ALTRA PARTE NON E' ILLUMINATA, e basta: e' un
    // SI'/NO, non un dot sfumato \u2014 la regola della casa dice \xABo vede la luce o
    // no\xBB, e una rampa di N dot L sarebbe il face shading che qui e' vietato.
    // Senza questa riga la pozza passava ATTRAVERSO i blocchi e accendeva la
    // faccia di dietro.
    // E NON LA PUO' FARE ombraLampada: quella cammina una mappa di ALTEZZE, che
    // per costruzione non sa da che parte del muro sta il pixel. Misurato: sulla
    // faccia di spalle di un muro, alla quota della cima, NESSUN margine per
    // quanto piccolo la spegne. Solo la normale lo sa.
    // E COSTA MENO DI NIENTE: chi e' di spalle salta le quattordici letture.
    if (dot(n, lanterna - pos) <= 0.0) continue;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    float a = anello * ombraLampada(pos, n, lanterna);
    peso += a;
    tinta += a * uLampCol[i].rgb;
  }
  // IL PESO SI SATURA, IL COLORE NO: due pozze che si sovrappongono non
  // sbiancano, prendono la MEDIA delle due tinte a piena forza. Sommando i
  // colori, un rosso e un verde vicini davano giallo pieno \u2014 che non e' nessuna
  // delle due lampade. Con una lampada sola il conto e' identico a prima.
  if (peso <= 0.0) return vec3(0.0);
  return (tinta / peso) * min(peso, 1.0);
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
  vec3 lamp = pozza(vPos, vN, vBlocco) * notte;
  float sole = vSole * step(0.99, vCielo) * luce;
  // l'ombra: il colore stilizzato (hue shift), tinto dal giorno/notte, pi\xF9 scuro senza cielo
  vec3 ombra = vOmbra * uCieloCol * (0.30 + 0.70 * cieloB);
  vec3 pieno = vBase * uSoleCol;
  if (vEmis > 0.0) { ombra = mix(ombra, vBase * 1.15, vEmis); pieno = mix(pieno, vBase * 1.15, vEmis); }   // emissiva: scavalca ombra e notte
  // \u26A0 LE POZZE DEI LAMPIONI SONO CALDE E PIENE: 1,3 sopra il bianco
  vec3 c = mix(ombra, pieno, sole) + vBase * lamp;
  // \u26A0 I CONTI SONO IN SPAZIO LINEARE: qui si torna in sRGB, o tutto esce scuro e saturo.
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  colore = vec4(c, 1.0);
}`,Fn=`#version 300 es
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
}`,Dn=`#version 300 es
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
/**
 * C'e' un OGGETTO qui? (albero, lampione, fungo: canale B della mappa)
 *
 * \u26A0 \xABAttorno a modelli complessi come alberi non c'e' schiuma\xBB \u2014 vero, e per
 * colpa mia: togliendo la chioma dalla mappa del terreno (che curava la riva
 * finta e l'ombra squadrata) un albero nell'acqua e' diventato NIENTE. Ma un
 * albero nell'acqua l'acqua la increspa: gli serve una mappa sua.
 *
 * \u26A0 E QUESTA SCALA A MIGLIAIA. Gli otto galleggianti sono un vettore di uniform
 * \u2014 tetto di otto, un ciclo per pixel, e la schiuma che appare quando ti
 * avvicini perche' entri negli otto piu' vicini. Una mappa non ha tetto: mille
 * alberi costano quanto uno, perche' e' comunque UNA lettura. Negli uniform
 * restano solo le cose che si muovono ogni fotogramma.
 */
float oggettoLi(highp vec2 q, float cima) {
  highp vec2 uv = (q - uAltRett.xy) * uAltRett.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return 0.0;
  // la lettura e' LINEARE (sampler dell'unita' 2): l'impronta di una cella sola
  // sfuma sui vicini, e la macchia che ne esce e' tonda invece che quadrata
  float h = texture(uAltezze, uv).b * 255.0;
  return smoothstep(cima - 1.2, cima + 0.2, h);
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
    s += terraLi(pos.xz + dir * (0.42 + onda * 0.5), cima);
    s += terraLi(pos.xz + dir * (0.92 + onda * 0.8), cima);
  }
  return s * 0.0625;
}
/** L'altezza del terreno solido qui, interpolata (il sampler dell'unita 2 e lineare). */
float altezzaLiscia(highp vec2 q) {
  highp vec2 uv = (q - uAltRett.xy) * uAltRett.zw;
  if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) return -99.0;
  return texture(uAltezze, uv).g * 255.0;
}
/**
 * QUANTO SIAMO LONTANI DALLA RIVA, in blocchi. Sotto zero: a terra.
 *
 * \u26A0 E' LA CURA DI \xABtroppo splamata, sfocata e poco netta, e agli angoli si
 * perde, non segue i lati del blocco\xBB. La stesura di prima faceva la MEDIA di
 * sedici assaggi su due anelli: la media serviva a togliere la scaletta, ma una
 * media su un anello e' un filtro PASSA-BASSO \u2014 spiana, allarga, e a un angolo
 * CONVESSO perde meta' degli assaggi, quindi il campo cala e la schiuma
 * sparisce proprio dove il bordo gira. Curava un difetto facendone due.
 *
 * Qui invece si stima la DISTANZA vera dalla curva di livello: si legge
 * l'altezza interpolata e la si divide per la pendenza (due differenze
 * centrali). La curva di livello dell'altezza SEGUE il bordo dei blocchi,
 * angoli compresi, e la larghezza della fascia la decide un numero \u2014 non la
 * dimensione dell'anello.
 *
 * \u26A0 E COSTA MENO: cinque letture invece di sedici.
 * \u26A0 La pendenza si tiene lontana da zero: sul fondale piatto vale zero, e senza
 * il freno la distanza esploderebbe in un infinito (che a schermo e' un NaN).
 */
float distanzaRiva(highp vec3 pos, float onda) {
  float cima = floor(pos.y) + 1.0;
  highp vec2 p = pos.xz;
  float h = altezzaLiscia(p);
  if (h < -50.0) return 99.0;                       // fuori dalla finestra della mappa
  float e = 0.35;
  float gx = altezzaLiscia(p + vec2(e, 0.0)) - altezzaLiscia(p - vec2(e, 0.0));
  float gz = altezzaLiscia(p + vec2(0.0, e)) - altezzaLiscia(p - vec2(0.0, e));
  float g = max(length(vec2(gx, gz)) / (2.0 * e), 0.30);
  return (cima - 0.5 - h) / g + onda * 0.30;
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
  // \u26A0 LA SCATOLA SI RESTRINGE E IL RESTO LO FA IL RAGGIO: con la scatola piena
  // i quattro angoli si vedono, e un gatto che galleggia dentro un quadrato
  // arrotondato non e' \xABniente quadrati\xBB. Tenendo la scatola al 40 % e
  // lasciando che sia la distanza a fare il resto, l'impronta resta ALLUNGATA
  // come l'oggetto ma i bordi sono archi.
  highp vec2 q = abs(p - centro) - mezzo * 0.40;
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
  // \u26A0 IL BRILLIO NON \xC8 IL RIFLESSO, e vuole una normale SUA.
  //
  // Il committente: \xABil riflesso del sole \xE8 diventato questo mega blob brutto,
  // lo stai aumentando ad ogni update \u2014 perch\xE9 non dovrebbe essere pi\xF9 piccolo
  // e denso, un po' come la vera acqua\xBB. Ed \xE8 colpa mia: passando alle onde
  // lunghe per curare il tiling del RIFLESSO, la normale \xE8 diventata quasi
  // piatta \u2014 quindi il prodotto scalare col sole cambia lentissimo e la soglia
  // taglia una macchia enorme e continua. La stessa mossa che ha curato il
  // riflesso ha rovinato il brillio, perch\xE9 usavano la stessa normale.
  //
  // Il luccichio vero \xE8 UN CAMPO DI SCINTILLE PICCOLE, non una pozza di luce:
  // lo fanno le increspature corte, che sono proprio quelle tolte al riflesso.
  // Quindi due normali: quella lunga per lo specchio, questa (lunga + due
  // ottave di increspature) per la scintilla, con la soglia molto pi\xF9 stretta.
  // \u26A0 Le due ottave hanno frequenze NON in rapporto semplice (1,13/0,61 e
  // 2,07/1,79): con rapporti interi le scintille si allineerebbero in una
  // griglia, che \xE8 il tiling curato un attimo fa spostato di un metro.
  vec2 fine = vec2(0.0);
  fine += vec2(sin(uTempo * 1.9 + vPos.x * 1.13 + vPos.z * 0.61),
               cos(uTempo * 1.5 - vPos.x * 0.69 + vPos.z * 1.27)) * 0.052;
  fine += vec2(sin(uTempo * 2.7 - vPos.x * 2.07 + vPos.z * 1.79),
               cos(uTempo * 2.3 + vPos.x * 1.83 + vPos.z * 2.11)) * 0.031;
  vec3 nBrillio = vPelo > 0.5 ? normalize(n + vec3(fine.x, 0.0, fine.y)) : n;
  // \u26A0 E SI SPEGNE CON LA DISTANZA: le scintille sono pi\xF9 fitte dei pixel gi\xE0 a
  // venti blocchi, e una soglia dura su un campo pi\xF9 fine del pixel non fa
  // luccichio \u2014 fa rumore che sfarfalla a ogni movimento della camera.
  float brillio = step(0.9972, dot(reflect(-vista, nBrillio), -uSoleVerso)) * uSoleForza * vPelo * sfumaOnda;
  acqua += vec3(0.85) * brillio;
  // \u26A0 LA SCHIUMA: alla riva (dove il fondo \xE8 alto, vProf piccola) e attorno a
  // chi galleggia. Solo sul pelo, e sopra a tutto il resto (anche al riflesso):
  // \xE8 il segno che l'acqua tocca qualcosa, e in Leafy \xE8 quello che d\xE0 vita.
  float onda = 0.13 * sin(uTempo * 1.5 + vPos.x * 1.9 + vPos.z * 1.1) + 0.08 * sin(uTempo * 2.3 - vPos.x * 1.3 + vPos.z * 2.7);
  // \u26A0 DUE BANDE NETTE alla riva: piena attaccata a terra, magra un passo fuori.
  // \u26A0 ADESSO LE SOGLIE SONO DISTANZE IN BLOCCHI, e si leggono: la risacca piena
  // arriva a 0,26 dalla riva, quella magra a 0,55. Prima erano quote di assaggi
  // su un anello \u2014 un numero che non voleva dire niente e che cambiava senso a
  // ogni raggio toccato.
  float dRiva = distanzaRiva(vPos, onda);
  float sRiva = max(aGradini(0.26 - dRiva, 0.0), aGradini(0.55 - dRiva, 0.0) * 0.5);
  // \u26A0 LA SCHIUMA DEGLI OGGETTI FERMI viene dalla MAPPA, non dagli uniform: gli
  // alberi, i lampioni e i funghi nell'acqua la fanno tutti, quanti che siano.
  // Stesso giro di assaggi della riva \u2014 quindi stesso bordo netto e curvo \u2014 ma
  // su un anello piu' stretto, perche' l'impronta di un tronco e' una cella.
  // \u26A0 LA MEDIA SULL'ANELLO, NON IL MASSIMO \u2014 ed \xE8 la differenza fra una macchia
  // TONDA e una quadrata. Col massimo basta un assaggio che tocchi l'impronta
  // perch\xE9 il pixel sia pieno: la forma che ne esce \xE8 l'unione degli assaggi,
  // cio\xE8 il quadrato del texel allargato dal filtro bilineare (che di suo ha
  // livelli squadrati). Con la media, la quota di assaggi che cadono
  // sull'oggetto dipende SOLO dalla distanza dal centro: le curve di livello
  // sono cerchi, per costruzione. \xC8 la stessa ragione per cui la riva usa la
  // media, e ci ho messo un giro a vederlo anche qui.
  float cimaCella = floor(vPos.y) + 1.0;
  float campoOgg = 0.0;
  for (int i = 0; i < 8; i++) {
    float a = float(i) * 0.7854 - onda * 0.7;
    vec2 dir = vec2(cos(a), sin(a));
    campoOgg += oggettoLi(vPos.xz + dir * (0.30 + onda * 0.35), cimaCella);
    campoOgg += oggettoLi(vPos.xz + dir * (0.68 + onda * 0.55), cimaCella);
  }
  campoOgg *= 0.0625;
  float sTocco = max(aGradini(campoOgg, 0.40), aGradini(campoOgg, 0.14) * 0.5);
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
}`,Un=`#version 300 es
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
}`,Bn=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,kn=`#version 300 es
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
}`,Vn=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Gn=`#version 300 es
precision mediump float;
void main() {}`,Yt=class{constructor(e){this.gl=e,this.programma=ue(e,Pn,Na),this.u={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[o]=e.getUniformLocation(this.programma,o);this.ebo=e.createBuffer(),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bufferData(e.ELEMENT_ARRAY_BUFFER,Oa(16384),e.STATIC_DRAW),this.programmaErba=ue(e,Un,Na.replace(/flat in /g,"in ")),this.ue={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.ue[o]=e.getUniformLocation(this.programmaErba,o);this.programmaOmbra=ue(e,Vn,Gn),this.uo={uVP:e.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:e.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=ue(e,Fn,Dn),this.ua={};for(let o of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[o]=e.getUniformLocation(this.programmaAcqua,o);this.programmaCielo=ue(e,Bn,kn),this.uc={};for(let o of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[o]=e.getUniformLocation(this.programmaCielo,o);this.vaoVuoto=e.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=e.createSampler(),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_MIN_FILTER,e.LINEAR),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_MAG_FILTER,e.LINEAR),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.samplerParameteri(this.campionatoreLiscio,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(1024),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,colonne:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!e.getExtension("EXT_color_buffer_half_float")&&!!e.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.lampadeCol=new Float32Array(32),this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.cullFace(e.BACK),e.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(e,o){let t=this.mappa;Math.hypot(e+8-t.centro[0],o+8-t.centro[2])<=t.raggio+12&&(t.sporca=!0)}carica(e,o){let t=this.gl;this._sporcaMappa(o.cx*16,o.cz*16);let a=this.chunks.get(e);a||(a={vao:t.createVertexArray(),vbo:t.createBuffer(),quad:0},t.bindVertexArray(a.vao),t.bindBuffer(t.ARRAY_BUFFER,a.vbo),t.enableVertexAttribArray(0),t.vertexAttribIPointer(0,2,t.UNSIGNED_INT,12,0),t.enableVertexAttribArray(1),t.vertexAttribIPointer(1,4,t.UNSIGNED_BYTE,12,8),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ebo),t.bindVertexArray(null),this.chunks.set(e,a)),t.bindBuffer(t.ARRAY_BUFFER,a.vbo),t.bufferData(t.ARRAY_BUFFER,o.byte,t.STATIC_DRAW),a.quad=o.quad;let n=o.erba;a.verticiErba=n?n.vertici:0,a.lamelle=n?n.fili:0,a.yBaseErba=n?n.yBase:0,a.verticiErba>0&&(a.vaoErba||(a.vaoErba=t.createVertexArray(),a.vboErba=t.createBuffer(),t.bindVertexArray(a.vaoErba),t.bindBuffer(t.ARRAY_BUFFER,a.vboErba),t.enableVertexAttribArray(0),t.vertexAttribIPointer(0,4,t.UNSIGNED_BYTE,12,0),t.vertexAttribDivisor(0,1),t.enableVertexAttribArray(1),t.vertexAttribIPointer(1,4,t.UNSIGNED_BYTE,12,4),t.vertexAttribDivisor(1,1),t.enableVertexAttribArray(2),t.vertexAttribIPointer(2,4,t.UNSIGNED_BYTE,12,8),t.vertexAttribDivisor(2,1),t.bindVertexArray(null)),t.bindBuffer(t.ARRAY_BUFFER,a.vboErba),t.bufferData(t.ARRAY_BUFFER,n.byte,t.STATIC_DRAW));let r=o.acqua;if(a.quadAcqua=r?r.quad:0,a.peloAcqua=r&&r.pelo!=null?r.pelo:null,a.quadAcqua>0&&(a.vaoAcqua||(a.vaoAcqua=t.createVertexArray(),a.vboAcqua=t.createBuffer(),t.bindVertexArray(a.vaoAcqua),t.bindBuffer(t.ARRAY_BUFFER,a.vboAcqua),t.enableVertexAttribArray(0),t.vertexAttribIPointer(0,2,t.UNSIGNED_INT,12,0),t.enableVertexAttribArray(1),t.vertexAttribIPointer(1,4,t.UNSIGNED_BYTE,12,8),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ebo),t.bindVertexArray(null)),t.bindBuffer(t.ARRAY_BUFFER,a.vboAcqua),t.bufferData(t.ARRAY_BUFFER,r.byte,t.STATIC_DRAW)),a.luci=o.luci||[],a.x0=o.cx*16,a.z0=o.cz*16,a.minY=o.minY,a.maxY=o.maxY,a.y0=o.y0||0,a.chunk=[a.x0,a.y0,a.z0],o.altezze){a.tegola||(a.tegola=new Uint8Array(1024));let s=o.solide||o.altezze,l=o.impronte;for(let c=0;c<16;c++)for(let u=0;u<16;u++){let p=(u*16+c)*4,f=c*16+u,d=o.altezze[f],m=s[f],h=l?l[f]:-1;a.tegola[p]=d<0?0:Math.max(0,Math.min(255,d+1)),a.tegola[p+1]=m<0?0:Math.max(0,Math.min(255,m+1)),a.tegola[p+2]=h<0?0:Math.max(0,Math.min(255,h+1)),a.tegola[p+3]=255}this.finestra&&this._scriviTegola(a)}}apriFinestraAltezze(e,o,t=512){let a=this.gl;this.altezze||(this.altezze=a.createTexture()),this.finestra={lato:t,x0:0,z0:0,vuota:new Uint8Array(t*t*4),spostamenti:0},a.bindTexture(a.TEXTURE_2D,this.altezze),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),this._centraFinestra(e,o,!0)}seguiAltezze(e,o){this.finestra&&this._centraFinestra(e,o,!1)}_centraFinestra(e,o,t){let a=this.gl,n=this.finestra,r=n.lato/2;if(!t&&Math.abs(e-(n.x0+r))<n.lato/4&&Math.abs(o-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((e-r)/16)*16,n.z0=Math.floor((o-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.colonne!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,this.ombre.w,this.ombre.h],a.bindTexture(a.TEXTURE_2D,this.altezze),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,n.lato,n.lato,0,a.RGBA,a.UNSIGNED_BYTE,n.vuota);for(let s of this.chunks.values())s.tegola&&this._scriviTegola(s);return n.spostamenti++,!0}_scriviTegola(e,o=!1){let t=this.gl,a=this.finestra,n=e.x0-a.x0,r=e.z0-a.z0;n<0||r<0||n+16>a.lato||r+16>a.lato||(t.bindTexture(t.TEXTURE_2D,this.altezze),t.pixelStorei(t.UNPACK_ALIGNMENT,1),t.texSubImage2D(t.TEXTURE_2D,0,n,r,16,16,t.RGBA,t.UNSIGNED_BYTE,o?this._tegolaVuota:e.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(e,o,t,a=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=ue(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,e,o,t,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,e,o,t,.1),n.uniform3f(r.uColore,1,1-.45*a,1-.8*a),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(e,o,t,a,n,r,s=.3,l=.1){let c=this.gl;this.programmaPieno||(this.programmaPieno=ue(c,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:c.getUniformLocation(this.programmaPieno,"uVP"),uCella:c.getUniformLocation(this.programmaPieno,"uCella"),uColore:c.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=c.createVertexArray());let u=this.uPieno;c.useProgram(this.programmaPieno),c.uniformMatrix4fv(u.uVP,!1,this.vp),c.uniform4f(u.uCella,e,o,t,l),c.uniform4f(u.uColore,a*s,n*s,r*s,s),c.bindVertexArray(this.vaoPieno),c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.depthMask(!1),c.disable(c.CULL_FACE),c.drawArrays(c.TRIANGLES,0,36),c.enable(c.CULL_FACE),c.depthMask(!0),c.disable(c.BLEND),c.bindVertexArray(null)}rimuovi(e){let o=this.chunks.get(e);o&&(this._sporcaMappa(o.x0,o.z0),this.finestra&&o.tegola&&this._scriviTegola(o,!0),this.gl.deleteVertexArray(o.vao),this.gl.deleteBuffer(o.vbo),o.vaoAcqua&&(this.gl.deleteVertexArray(o.vaoAcqua),this.gl.deleteBuffer(o.vboAcqua)),o.vaoErba&&(this.gl.deleteVertexArray(o.vaoErba),this.gl.deleteBuffer(o.vboErba)),this.chunks.delete(e))}_sporcaOmbre(e,o,t,a){let r=[Math.max(0,e-26),Math.max(0,o-26),Math.min(this.ombre.w||1e9,e+t+26),Math.min(this.ombre.h||1e9,o+a+26)],s=this.ombre.sporco;this.ombre.sporco=s?[Math.min(s[0],r[0]),Math.min(s[1],r[1]),Math.max(s[2],r[2]),Math.max(s[3],r[3])]:r}_preparaOmbre(e,o){let t=this.gl,a=this.ombre;a.colonne=e;let n=e*ko,r=o*ko;if(a.tex||(a.tex=t.createTexture(),a.fbo=t.createFramebuffer()),t.bindTexture(t.TEXTURE_2D,a.tex),a.mezzoFloat=this._ombreMezzo,a.mezzoFloat?(t.texImage2D(t.TEXTURE_2D,0,t.R16F,n,r,0,t.RED,t.HALF_FLOAT,null),a.scala=1,a.offset=0):(t.texImage2D(t.TEXTURE_2D,0,t.R8,n,r,0,t.RED,t.UNSIGNED_BYTE,null),a.scala=64,a.offset=-8),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.bindFramebuffer(t.FRAMEBUFFER,a.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,a.tex,0),t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE&&a.mezzoFloat)return this._ombreMezzo=!1,t.bindFramebuffer(t.FRAMEBUFFER,null),this._preparaOmbre(e,o);if(t.bindFramebuffer(t.FRAMEBUFFER,null),a.w=n,a.h=r,a.sporco=[0,0,n,r],!this.programmaOmbre){this.programmaOmbre=ue(t,`#version 300 es
void main() { vec2 q = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(q, 0.0, 1.0); }`,`#version 300 es
precision highp float;
uniform sampler2D uAltezze;   // la mappa: R silhouette (col fogliame), G solido, B oggetti
uniform vec4 uAltRett;        // x0, z0, 1/larghezza, 1/profondita DELLA MAPPA DELLE OMBRE
uniform vec3 uSole;           // direzione VERSO il sole in pianta (x, z), e la pendenza (tan dell'elevazione)
uniform vec2 uCodifica;       // scala e offset: r = (quota - offset) / scala
uniform float uSuper;         // quanti texel d'ombra per blocco
out vec4 colore;
void main() {
  // \u26A0 LA MAPPA DELLE OMBRE HA PIU' TEXEL DEL MONDO (uSuper per blocco), ed e' la
  // cura delle \xABombre seghettate che ancora infestano questo progetto\xBB. Con un
  // texel per colonna il bordo dell'ombra CADE SUL BORDO DELLA COLONNA,
  // qualunque cosa si faccia dopo: si puo' filtrare, ammorbidire, tagliare
  // stretto \u2014 la scaletta e' gia' nel DATO, e un filtro su un dato a gradini
  // fa una scaletta sfocata, non una curva. L'unico modo di toglierla e' avere
  // piu' campioni del reticolo che la produce.
  vec2 p = gl_FragCoord.xy;
  vec2 dir = uSole.xy; float tg = uSole.z;
  // la propria cima, un quarto di passo avanti: le pareti di schiena sono in ombra, le cime no
  float hs = texture(uAltezze, p * uAltRett.zw).r * 255.0 - 0.25 * tg;
  // \u26A0 PASSO FISSO DI MEZZO BLOCCO PER 24 BLOCCHI: nessuna colonna saltata, che era la causa dei puntini
  // \u26A0 E il passo va convertito in texel: t e in BLOCCHI, la texture in texel.
  for (int i = 1; i <= 48; i++) {
    float t = float(i) * 0.5;
    float h = texture(uAltezze, (p + dir * t * uSuper) * uAltRett.zw).r * 255.0;
    hs = max(hs, h - t * tg);
  }
  colore = vec4((hs - uCodifica.y) / uCodifica.x, 0.0, 0.0, 1.0);
}`),this.uOmbre={};for(let s of["uAltezze","uAltRett","uSole","uCodifica","uSuper"])this.uOmbre[s]=t.getUniformLocation(this.programmaOmbre,s);this.vaoOmbre=t.createVertexArray()}}_calcolaOmbre(){let e=this.gl,o=this.ombre,t=this.sole;if(!this.altezze||!o.tex||(t.verso[0]*o.sole[0]+t.verso[1]*o.sole[1]+t.verso[2]*o.sole[2]<.99996&&(o.sole=t.verso.slice(),o.sporco=[0,0,o.w,o.h]),!o.sporco))return;let n=96,[r,s,l,c]=o.sporco;if(l<=r||c<=s){o.sporco=null;return}let u=Math.min(c,s+n);o.sporco=u>=c?null:[r,u,l,c];let p=Math.hypot(t.verso[0],t.verso[2])||1e-4,f=[-t.verso[0]/p,-t.verso[2]/p],d=Math.max(.05,-t.verso[1]/p);e.bindFramebuffer(e.FRAMEBUFFER,o.fbo),e.viewport(0,0,o.w,o.h),e.enable(e.SCISSOR_TEST),e.scissor(r,s,l-r,u-s),e.disable(e.DEPTH_TEST),e.disable(e.CULL_FACE),e.useProgram(this.programmaOmbre),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(this.uOmbre.uAltezze,0),e.bindSampler(0,this.campionatoreLiscio),e.uniform4f(this.uOmbre.uAltRett,0,0,1/o.w,1/o.h),e.uniform3f(this.uOmbre.uSole,f[0],f[1],d),e.uniform2f(this.uOmbre.uCodifica,o.scala,o.offset),e.uniform1f(this.uOmbre.uSuper,ko),e.bindVertexArray(this.vaoOmbre),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.bindSampler(0,null),e.disable(e.SCISSOR_TEST),e.enable(e.DEPTH_TEST),e.enable(e.CULL_FACE),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),o.calcoli++,this.statistiche.calcoliOmbre=o.calcoli}_disegnaCielo(e,o){let t=this.gl,a=this.uc,n=this.sole;if(this.cieloNero||!Ra(e,this._invVP))return;t.useProgram(this.programmaCielo),t.uniformMatrix4fv(a.uInvVP,!1,this._invVP),t.uniform3f(a.uOcchio,o[0],o[1],o[2]),t.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),t.uniform1f(a.uSoleForza,n.forza),t.uniform3f(a.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;t.uniform3f(a.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),t.disable(t.DEPTH_TEST),t.depthMask(!1),t.disable(t.CULL_FACE),t.bindVertexArray(this.vaoVuoto),t.drawArrays(t.TRIANGLES,0,3),t.bindVertexArray(null),t.enable(t.CULL_FACE),t.depthMask(!0),t.enable(t.DEPTH_TEST)}_preparaMappa(){let e=this.gl,o=this.mappa,t=a=>{let n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,e.DEPTH_COMPONENT24,a,a,0,e.DEPTH_COMPONENT,e.UNSIGNED_INT,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_MODE,e.COMPARE_REF_TO_TEXTURE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_COMPARE_FUNC,e.LEQUAL);let r=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.TEXTURE_2D,n,0),e.drawBuffers([e.NONE]),e.readBuffer(e.NONE);let s=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindFramebuffer(e.FRAMEBUFFER,null),{tex:n,fbo:r,lato:a,ok:s}};o.stat=t(o.lato),o.din=t(o.latoDin),(!o.stat.ok||!o.din.ok)&&(o.attiva=!1)}legaMappa(e){let o=this.gl,t=this.mappa;o.activeTexture(o.TEXTURE1),o.bindTexture(o.TEXTURE_2D,t.stat.tex),o.uniform1i(e.uMappaStat,1),o.activeTexture(o.TEXTURE2),o.bindTexture(o.TEXTURE_2D,t.din.tex),o.uniform1i(e.uMappaDin,2),o.activeTexture(o.TEXTURE0),o.uniform1f(e.uMappaOn,t.on?1:0),o.uniformMatrix4fv(e.uLuceVP,!1,t.vp),o.uniformMatrix4fv(e.uLuceVPDin,!1,t.vpDin),o.uniform2f(e.uMappaTexel,.5/t.lato,.5/t.latoDin),o.uniform2f(e.uMappaSbieco,1.5*(2*t.raggio/t.lato),.1/220),o.uniform4fv(e.uLampade,this.lampade),o.uniform1i(e.uNLampade,this.nLampade),o.uniform4fv(e.uLampCol,this.lampadeCol),o.uniform3f(e.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(o.activeTexture(o.TEXTURE3),o.bindTexture(o.TEXTURE_2D,this.altezze),o.uniform1i(e.uAltezze,3),o.activeTexture(o.TEXTURE0))}_aggiornaMappa(e,o){let t=this.gl,a=this.mappa,n=this.sole,r=this.statistiche;if(a.on=!1,!a.attiva||!this.ombra)return;let s=typeof performance<"u"?performance.now():0,l=e.centro[0],c=e.centro[2],u=!1;Math.hypot(l-a.centro[0],c-a.centro[2])>10&&(a.centro=[Math.round(l/2)*2,Math.round(e.centro[1]),Math.round(c/2)*2],u=!0);{let g=n.verso,v=e.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Tt(Do(a.raggioDin,10,230),Xt(b,v,x),a.vpDin)}n.verso[0]*a.sole[0]+n.verso[1]*a.sole[1]+n.verso[2]*a.sole[2]<.99985&&(a.soleMosso=!0);let f=a.sporca||a.soleMosso||o&&o.mappaSporca,d=u||f&&s-(a.ultimo||0)>=500;if(d){a.sole=n.verso.slice(),a.soleMosso=!1,a.ultimo=s;let g=n.verso,v=a.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Tt(Do(a.raggio,10,230),Xt(b,v,x),a.vp)}if(t.enable(t.POLYGON_OFFSET_FILL),t.polygonOffset(1.5,4),d){t.bindFramebuffer(t.FRAMEBUFFER,a.stat.fbo),t.viewport(0,0,a.stat.lato,a.stat.lato),t.clear(t.DEPTH_BUFFER_BIT),t.useProgram(this.programmaOmbra),t.uniformMatrix4fv(this.uo.uVP,!1,a.vp);let g=0,v=0,b=a.raggio+12;for(let x of this.chunks.values())x.quad!==0&&(Math.hypot(x.x0+8-a.centro[0],x.z0+8-a.centro[2])>b||(t.uniform3f(this.uo.uChunk,x.chunk[0],x.chunk[1],x.chunk[2]),t.bindVertexArray(x.vao),t.drawElements(t.TRIANGLES,x.quad*6,t.UNSIGNED_SHORT,0),g++,v+=x.quad*2));if(t.bindVertexArray(null),o){let[x,A]=o.disegnaOmbra(a.vp,!1);g+=x,v+=A,o.mappaSporca=!1}a.sporca=!1,a.calcoli++,a.disegni=g,a.triangoli=v}t.bindFramebuffer(t.FRAMEBUFFER,a.din.fbo),t.viewport(0,0,a.din.lato,a.din.lato),t.clear(t.DEPTH_BUFFER_BIT);let m=0,h=0;o&&([m,h]=o.disegnaOmbra(a.vpDin,!0)),t.disable(t.POLYGON_OFFSET_FILL),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),a.on=!0,r.calcoliMappa=a.calcoli,r.disegniOmbra=m+(d?a.disegni:0),r.triangoliOmbra=h+(d?a.triangoli:0)}impostaAltezze(e,o,t,a,n,r=null){let s=this.gl;this.altezze||(this.altezze=s.createTexture()),s.bindTexture(s.TEXTURE_2D,this.altezze),s.pixelStorei(s.UNPACK_ALIGNMENT,1);let l=new Uint8Array(a*n*4);for(let c=0;c<a*n;c++)l[c*4]=e[c],l[c*4+1]=r?r[c]:e[c];s.texImage2D(s.TEXTURE_2D,0,s.RGBA8,a,n,0,s.RGBA,s.UNSIGNED_BYTE,l),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.altRett=[o,t,1/a,1/n],this._preparaOmbre(a,n)}impostaMaterie(e){let o=new Float32Array(64);for(let t=0;t<16&&t<e.length;t++)for(let a=0;a<4;a++)o[t*4+a]=e[t][a]||0;this.materie=o}disegna(e,o,t=null){let a=this.gl,n=this.statistiche;this.tempo+=o;let r=Ia(e.fov,e.rapporto,.3,400),s=Xt(e.occhio,e.centro);Tt(r,s,this.vp),Uo(this.vp,this.piani),this._camera=e,this._visibili.length=0,this._visibiliErba.length=0;let l=0;for(let d of this.chunks.values())d.quad===0&&d.quadAcqua===0||(d.visto=this.tutto||Bo(this.piani,d.x0,d.y0+d.minY,d.z0,d.x0+16,d.y0+d.maxY+1,d.z0+16),d.visto&&(l++,d.quadAcqua>0&&this._visibili.push(d),d.verticiErba>0&&Math.hypot(d.x0+8-e.occhio[0],d.z0+8-e.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(d)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(e,t),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(e,t),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,e.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[c,u]=this._solidi(this.vp,this.piani,e.occhio,!1),p=0,f=0;if(this._visibiliErba.length){let d=this.ue,m=this.sole;a.useProgram(this.programmaErba),a.uniformMatrix4fv(d.uVP,!1,this.vp),a.uniform1f(d.uTempo,this.tempo),a.uniform3f(d.uSoleVerso,m.verso[0],m.verso[1],m.verso[2]),a.uniform3f(d.uSoleCol,m.colore[0],m.colore[1],m.colore[2]),a.uniform1f(d.uSoleForza,m.forza),a.uniform3f(d.uCieloCol,m.cielo[0],m.cielo[1],m.cielo[2]),a.uniform2f(d.uNebbia,this.nebbia.da,this.nebbia.a),a.uniform3f(d.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),a.uniform3f(d.uCam,e.occhio[0],e.occhio[1],e.occhio[2]),a.uniform2f(d.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),a.uniform1f(d.uOmbra,this.ombra&&this.altezze?1:0),a.uniform1f(d.uTaglio,-1e9),a.uniform1f(d.uErbaFinoA,this.erbaFinoA),a.uniform4f(d.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),a.uniform3f(d.uOcchio,e.occhio[0],e.occhio[1],e.occhio[2]),this.altezze&&(a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.ombre.tex),a.uniform1i(d.uOmbre,0),a.uniform2f(d.uOmbreScala,this.ombre.scala,this.ombre.offset),a.uniform4f(d.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(d),a.disable(a.CULL_FACE);for(let h of this._visibiliErba)a.uniform3f(d.uChunk,h.chunk[0],h.yBaseErba,h.chunk[2]),a.bindVertexArray(h.vaoErba),a.drawArraysInstanced(a.TRIANGLES,0,6,h.lamelle),p++,f+=h.lamelle*2;a.enable(a.CULL_FACE),a.bindVertexArray(null)}n.disegni=c,n.triangoli=u,n.chunkVisti=l,n.chunkTotali=this.chunks.size,n.disegniErba=p,n.triangoliErba=f}_solidi(e,o,t,a){let n=this.gl,r=this.u,s=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,e),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,s.verso[0],s.verso[1],s.verso[2]),n.uniform3f(r.uSoleCol,s.colore[0],s.colore[1],s.colore[2]),n.uniform1f(r.uSoleForza,s.forza),n.uniform3f(r.uCieloCol,s.cielo[0],s.cielo[1],s.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,t[0],t[1],t[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let l=a?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,l[0],l[1],l[2],l[3]),n.uniform3f(r.uOcchio,t[0],t[1],t[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let c=0,u=0;for(let p of this.chunks.values())if(p.quad!==0){if(a){if(!this.tutto&&!Bo(o,p.x0,p.y0+p.minY,p.z0,p.x0+16,p.y0+p.maxY+1,p.z0+16))continue}else if(!p.visto)continue;n.uniform3f(r.uChunk,p.chunk[0],p.chunk[1],p.chunk[2]),n.bindVertexArray(p.vao),n.drawElements(n.TRIANGLES,p.quad*6,n.UNSIGNED_SHORT,0),c++,u+=p.quad*2}return n.bindVertexArray(null),[c,u]}_peloVicino(e){let o=this._voti;o.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-e[0],n.z0+8-e[2])+2.2*Math.abs(n.peloAcqua-e[1]);o.set(n.peloAcqua,(o.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let t=null,a=0;for(let[n,r]of o)r>a&&(a=r,t=n);return t}_specchia(e,o){let t=this.gl,a=this.specchio,n=this.statistiche,r=this._peloVicino(e.occhio);if(r==null||e.occhio[1]<=r+.2)return;let s=Math.max(1,Math.round(t.drawingBufferWidth*a.scala)),l=Math.max(1,Math.round(t.drawingBufferHeight*a.scala));(!a.fbo||a.w!==s||a.h!==l)&&this._preparaSpecchio(s,l);let c=this._riflessione;c.fill(0),c[0]=1,c[5]=-1,c[10]=1,c[13]=2*r,c[15]=1,Tt(this.vp,c,this.vpSpecchio),Uo(this.vpSpecchio,this.pianiSpecchio);let u=[e.occhio[0],2*r-e.occhio[1],e.occhio[2]];t.bindFramebuffer(t.FRAMEBUFFER,a.fbo),t.viewport(0,0,s,l),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),t.cullFace(t.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[p,f]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);n.disegniSpecchio=p,n.triangoliSpecchio=f,o&&(o.disegna(this,{occhio:u,centro:e.centro,fov:e.fov,rapporto:e.rapporto}),n.disegniSpecchio+=o.statistiche.disegni,n.triangoliSpecchio+=o.statistiche.triangoli),t.cullFace(t.BACK),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),this.taglio=-1e9,a.pelo=r,n.pelo=r}_mostraSpecchio(){let e=this.gl,o=this.specchio;this.programmaQuad||(this.programmaQuad=ue(e,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=e.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=e.createVertexArray()),e.useProgram(this.programmaQuad),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,o.tex),e.uniform1i(this.uQuad,0),e.bindVertexArray(this.vaoQuad),e.disable(e.DEPTH_TEST),e.drawArrays(e.TRIANGLE_STRIP,0,4),e.enable(e.DEPTH_TEST),e.bindVertexArray(null)}_preparaSpecchio(e,o){let t=this.gl,a=this.specchio;a.fbo||(a.fbo=t.createFramebuffer(),a.tex=t.createTexture(),a.rbo=t.createRenderbuffer()),t.bindTexture(t.TEXTURE_2D,a.tex),t.texImage2D(t.TEXTURE_2D,0,t.RGBA8,e,o,0,t.RGBA,t.UNSIGNED_BYTE,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.bindRenderbuffer(t.RENDERBUFFER,a.rbo),t.renderbufferStorage(t.RENDERBUFFER,t.DEPTH_COMPONENT16,e,o),t.bindFramebuffer(t.FRAMEBUFFER,a.fbo),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,a.tex,0),t.framebufferRenderbuffer(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.RENDERBUFFER,a.rbo),t.checkFramebufferStatus(t.FRAMEBUFFER)!==t.FRAMEBUFFER_COMPLETE&&(a.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),t.bindFramebuffer(t.FRAMEBUFFER,null),t.bindTexture(t.TEXTURE_2D,null),a.w=e,a.h=o}disegnaAcqua(){let e=this.gl,o=this.ua,t=this.sole,a=this._camera,n=this.specchio;if(!a||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}e.useProgram(this.programmaAcqua),e.uniformMatrix4fv(o.uVP,!1,this.vp),e.uniform1f(o.uTempo,this.tempo),e.uniform3f(o.uCam,a.occhio[0],a.occhio[1],a.occhio[2]),e.uniform2f(o.uNebbia,this.nebbia.da,this.nebbia.a),e.uniform3f(o.uSoleVerso,t.verso[0],t.verso[1],t.verso[2]),e.uniform3f(o.uSoleCol,t.colore[0],t.colore[1],t.colore[2]),e.uniform1f(o.uSoleForza,t.forza),e.uniform3f(o.uCieloCol,t.cielo[0],t.cielo[1],t.cielo[2]),e.uniform3f(o.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,r?n.tex:null),e.uniform1i(o.uSpecchio,1),e.uniform3f(o.uSchermo,1/e.drawingBufferWidth,1/e.drawingBufferHeight,r?1:0),e.uniform1f(o.uMare,this.mare),e.uniform4fv(o.uGalleggianti,this.galleggianti),e.uniform1i(o.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_2D,this.altezze),e.uniform1i(o.uAltezze,2),e.bindSampler(2,this.campionatoreLiscio),e.uniform4f(o.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):e.uniform4f(o.uAltRett,0,0,0,0),e.enable(e.BLEND),e.blendFunc(e.SRC_ALPHA,e.ONE_MINUS_SRC_ALPHA),e.depthMask(!1),e.disable(e.CULL_FACE);let s=0,l=0;for(let c of this._visibili)e.uniform3f(o.uChunk,c.chunk[0],c.chunk[1],c.chunk[2]),e.bindVertexArray(c.vaoAcqua),e.drawElements(e.TRIANGLES,c.quadAcqua*6,e.UNSIGNED_SHORT,0),s++,l+=c.quadAcqua*2;e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),e.bindSampler(2,null),e.activeTexture(e.TEXTURE0),this.statistiche.disegniAcqua=s,this.statistiche.triangoliAcqua=l,n.mostra&&r&&this._mostraSpecchio()}};function wa(i){let e=new DataView(i);if(String.fromCharCode(e.getUint8(0),e.getUint8(1),e.getUint8(2),e.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let o=e.getUint32(4,!0),t=o*3,a=new Uint8Array(i,8,t*16),n=new Uint8Array(i,8+t*16,t*4),r=new Uint8Array(t*20);for(let p=0;p<t;p++)r.set(a.subarray(p*16,p*16+16),p*20),r.set(n.subarray(p*4,p*4+4),p*20+16);let s=1/0,l=-1/0,c=0,u=new DataView(r.buffer);for(let p=0;p<t;p++){let f=u.getFloat32(p*20,!0),d=u.getFloat32(p*20+4,!0),m=u.getFloat32(p*20+8,!0);s=Math.min(s,d),l=Math.max(l,d),c=Math.max(c,Math.hypot(f,m))}return{byte:r,vertici:t,triangoli:o,minY:s,maxY:l,raggio:c}}var $n=`#version 300 es
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
}`,Xn=`#version 300 es
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
// \u26A0 IL COLORE DELLA LAMPADA \xC8 UN DATO, non pi\xF9 una costante nello shader. Fino
// al 10/09/2026 qui c'era vec3(1.30, 1.02, 0.58) scritto a mano: TUTTE le
// lampade del gioco facevano la stessa pozza calda, e def.luce.colore \u2014 che
// esiste da sempre in blocks.js, con tanto di lucciola verde e lampade rossa,
// verde e blu \u2014 non arrivava a schermo. \xABLuci colorate\xBB era una casella vuota.
// xyz = la tinta gi\xE0 moltiplicata per l'intensit\xE0, w = la QUOTA della lanterna
// sopra la cella (2,6 per il lampione, 0 per un blocco-lampada).
uniform highp vec4 uLampCol[8];
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
float ombraLampada(highp vec3 pos0, vec3 n, highp vec3 L) {
  // SI PARTE APPENA FUORI DALLA SUPERFICIE, non dal pixel: sulla faccia di un
  // blocco pos.xz cade ESATTAMENTE sul confine fra due celle e floor sceglie a
  // testa o croce secondo l'arrotondamento, quindi meta' dei pixel di una faccia
  // partivano dalla cella del blocco e meta' da quella d'aria. Uno scostamento
  // lungo la normale lo decide, e sempre nello stesso verso.
  highp vec3 pos = pos0 + n * 0.02;
  highp vec2 d = L.xz - pos.xz;
  highp float lungo = length(d);
  if (lungo < 0.001) return 1.0;
  highp vec2 dir = d / lungo;
  highp vec2 verso = vec2(dir.x >= 0.0 ? 1.0 : -1.0, dir.y >= 0.0 ? 1.0 : -1.0);
  highp vec2 mod_ = max(abs(dir), vec2(1e-6));       // niente divisioni per zero sui raggi assiali
  highp vec2 cella = floor(pos.xz);
  highp vec2 cellaLampada = floor(L.xz);   // la sua cella non fa ombra a se stessa
  highp vec2 prossimo = (cella + max(verso, vec2(0.0)) - pos.xz) / (verso * mod_);   // quanto manca al confine
  highp vec2 quanto = 1.0 / mod_;                    // e quanto da un confine al prossimo
  for (int i = 0; i < 14; i++) {
    highp float t = min(prossimo.x, prossimo.y);
    if (t >= lungo) break;                           // arrivati alla lanterna: niente in mezzo
    if (prossimo.x < prossimo.y) { cella.x += verso.x; prossimo.x += quanto.x; }
    else { cella.y += verso.y; prossimo.y += quanto.y; }
    highp float y = pos.y + (L.y - pos.y) * (t / lungo);
    // \u26A0 GLI STESSI DUE CANALI DI resa.js, e questa riga era rimasta indietro:
    // il canale R e' la silhouette col FOGLIAME (serve al sole), e usarla qui
    // rimetteva davanti alla lampada il disco di raggio due della chioma \u2014 cioe'
    // l'ombra quadrata larga cinque celle, curata nei blocchi e ancora viva sui
    // modelli. Due file che fanno la stessa cosa in due posti divergono, e si
    // vede solo dove si guarda.
    highp vec2 uvC = (cella + 0.5 - uAltRett.xy) * uAltRett.zw;
    vec4 mappa = texture(uAltezze, uvC);
    float h = mappa.g * 255.0;
    // IL MARGINE E' PICCOLO, e prima era 0,6. Serve solo perche' la colonna su cui
    // si posa il pixel non si faccia ombra da se': a 0,6 nessun ostacolo alto meno
    // di sei decimi PIU' del pixel poteva fermare la luce, e sulla faccia di spalle
    // di un muro restava accesa una FASCIA in cima alta sei decimi di blocco \u2014
    // \xABuna luce fantasma illuminante dalla faccia che dovrebbe essere in ombra\xBB.
    // E LA CELLA DELLA LAMPADA NON FA OMBRA A SE STESSA NEANCHE QUI. La stessa
    // guardia c'era gia' sul canale degli OGGETTI, e mancava su questo: finche'
    // le lampade erano solo lampioni (modelli, che nel terreno non ci sono) non
    // si vedeva. Un BLOCCO-lampada e' solido, quindi sta nel canale del terreno,
    // e il raggio verso di lui entra PER FORZA nella sua cella: ogni lampada
    // appoggiata a terra si spegneva da sola, tutta, e non accendeva niente.
    if (h > y + 0.05 && h > pos.y + 0.05 && !all(equal(cella, cellaLampada))) return 0.0;
    float ho = mappa.b * 255.0;                      // l'OGGETTO: albero, lampione, fungo
    if (ho > pos.y + 0.3 && !all(equal(cella, cellaLampada))) {
      // \u26A0 GEMELLA DI QUELLA IN resa.js, e vanno cambiate INSIEME: sono due copie
      // della stessa regola in due programmi diversi, e sono gia' divergute una
      // volta (i canali separati erano finiti solo in resa.js, e l'ombra
      // quadrata era curata sui blocchi e viva sui modelli).
      // \u26A0 La distanza si misura al punto PIU' VICINO: il punto d'ingresso nella
      // cella sta sul bordo, quindi la soglia non scattava mai.
      highp vec2 ac = (cella + 0.5) - pos.xz;
      highp float tc = clamp(dot(ac, dir), 0.0, lungo);
      highp float dist = length(ac - dir * tc);
      highp float yc = pos.y + (L.y - pos.y) * (tc / lungo);
      float base = max(h, pos.y);
      float su = clamp((yc - base) / max(1.0, ho - base), 0.0, 1.0);
      float raggio = mix(0.30, 0.85, smoothstep(0.10, 0.70, su));
      if (dist < raggio && ho > yc + 0.05) return 0.0;
    }
  }
  return 1.0;
}
vec3 pozza(highp vec3 pos, vec3 n, float cotto) {
  float peso = 0.0;
  vec3 tinta = vec3(0.0);
  for (int i = 0; i < 8; i++) {
    if (i >= uNLampade) break;
    highp vec3 lanterna = uLampade[i].xyz + vec3(0.0, uLampCol[i].w, 0.0);
    // LA FACCIA CHE GUARDA DALL'ALTRA PARTE NON E' ILLUMINATA, e basta: e' un
    // SI'/NO, non un dot sfumato \u2014 la regola della casa dice \xABo vede la luce o
    // no\xBB, e una rampa di N dot L sarebbe il face shading che qui e' vietato.
    // Senza questa riga la pozza passava ATTRAVERSO i blocchi e accendeva la
    // faccia di dietro.
    // E NON LA PUO' FARE ombraLampada: quella cammina una mappa di ALTEZZE, che
    // per costruzione non sa da che parte del muro sta il pixel. Misurato: sulla
    // faccia di spalle di un muro, alla quota della cima, NESSUN margine per
    // quanto piccolo la spegne. Solo la normale lo sa.
    // E COSTA MENO DI NIENTE: chi e' di spalle salta le quattordici letture.
    if (dot(n, lanterna - pos) <= 0.0) continue;
    highp vec3 d = pos - uLampade[i].xyz; d.y *= 0.7;
    float q = length(d) / uLampade[i].w;
    if (q >= 1.0) continue;
    // TRE CERCHI CONCENTRICI PIATTI, un solo centro (il lampione) e una sola
    // ombra: la \xABfake point light\xBB che piace al committente. Niente sfumature.
    float anello = q < 0.35 ? 1.0 : (q < 0.65 ? 0.72 : 0.42);
    float a = anello * ombraLampada(pos, n, lanterna);
    peso += a;
    tinta += a * uLampCol[i].rgb;
  }
  // IL PESO SI SATURA, IL COLORE NO: due pozze che si sovrappongono non
  // sbiancano, prendono la MEDIA delle due tinte a piena forza. Sommando i
  // colori, un rosso e un verde vicini davano giallo pieno \u2014 che non e' nessuna
  // delle due lampade. Con una lampada sola il conto e' identico a prima.
  if (peso <= 0.0) return vec3(0.0);
  return (tinta / peso) * min(peso, 1.0);
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
  c += vBase * pozza(vPos, vN, 1.0) * mix(0.45, 1.0, 1.0 - smoothstep(0.30, 0.75, uSoleForza));   // i modelli non hanno luce cotta: passa
  c = pow(mix(c, pow(uNebbiaCol, vec3(2.2)), vNebbia), vec3(1.0 / 2.2));
  // \u26A0 LA SAGOMA: quando il gatto \xE8 dietro un albero o un muro, si vede la sua
  // ombra piatta attraverso (il committente: \xABun cono che mostra il player
  // anche attraverso i blocchi, magari in nero\xBB, non un buco nel mondo)
  if (uSagoma > 0.5) { colore = vec4(c * 0.18 * 0.55, 0.55); return; }
  colore = vec4(c, 1.0);
}`;function Hn(i,e=4){if(e===8)return i instanceof Float32Array?i:new Float32Array(i);let o=i.length/4,t=new Float32Array(o*8);for(let a=0;a<o;a++)t.set([i[a*4],i[a*4+1],i[a*4+2],i[a*4+3],1,1,1,0],a*8);return t}function qa(i=[255,255,255],e=1,o=1,t=1){let a=[[[0,0,1],[[-1,0,1],[1,0,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[1,0,-1],[-1,0,-1],[-1,1,-1],[1,1,-1]]],[[1,0,0],[[1,0,1],[1,0,-1],[1,1,-1],[1,1,1]]],[[-1,0,0],[[-1,0,-1],[-1,0,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]],[[0,-1,0],[[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1]]]],n=36,r=new Uint8Array(n*20),s=new DataView(r.buffer),l=0,c=(u,p)=>{let f=l*20;s.setFloat32(f,u[0]*e/2,!0),s.setFloat32(f+4,u[1]*o,!0),s.setFloat32(f+8,u[2]*t/2,!0),r[f+12]=p[0]*127&255,r[f+13]=p[1]*127&255,r[f+14]=p[2]*127&255,r[f+15]=0,r[f+16]=i[0],r[f+17]=i[1],r[f+18]=i[2],r[f+19]=255,l++};for(let[u,[p,f,d,m]]of a)c(p,u),c(f,u),c(d,u),c(p,u),c(d,u),c(m,u);return{byte:r,vertici:n,triangoli:12,minY:0,maxY:o,raggio:Math.hypot(e,t)/2}}var Yn=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,Zn=`#version 300 es
precision mediump float;
void main() {}`,Zt=class{constructor(e){this.gl=e,this.programma=ue(e,$n,Xn),this.u={};for(let o of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[o]=e.getUniformLocation(this.programma,o);this.programmaOmbra=ue(e,Yn,Zn),this.uoVP=e.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(e,o){let t=this.gl,a={vao:t.createVertexArray(),vbo:t.createBuffer(),ibo:t.createBuffer(),vertici:o.vertici,triangoli:o.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:o.raggio,maxY:o.maxY};return t.bindVertexArray(a.vao),t.bindBuffer(t.ARRAY_BUFFER,a.vbo),t.bufferData(t.ARRAY_BUFFER,o.byte,t.STATIC_DRAW),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,3,t.FLOAT,!1,20,0),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,3,t.BYTE,!0,20,12),t.enableVertexAttribArray(4),t.vertexAttribIPointer(4,1,t.UNSIGNED_BYTE,20,15),t.enableVertexAttribArray(2),t.vertexAttribPointer(2,4,t.UNSIGNED_BYTE,!0,20,16),t.bindBuffer(t.ARRAY_BUFFER,a.ibo),t.enableVertexAttribArray(3),t.vertexAttribPointer(3,4,t.FLOAT,!1,32,0),t.vertexAttribDivisor(3,1),t.enableVertexAttribArray(5),t.vertexAttribPointer(5,4,t.FLOAT,!1,32,16),t.vertexAttribDivisor(5,1),t.bindVertexArray(null),this.tipi.set(e,a),a}istanze(e,o,t=4){let a=this.tipi.get(e);a&&(a.istanze=Hn(o,t),a.n=a.istanze.length/8,a.sporco=!0,this.dinamici.has(e)||(this.mappaSporca=!0))}disegnaOmbra(e,o){let t=this.gl;t.useProgram(this.programmaOmbra),t.uniformMatrix4fv(this.uoVP,!1,e);let a=0,n=0;for(let[r,s]of this.tipi)s.n===0||this.dinamici.has(r)!==o||(t.bindVertexArray(s.vao),s.sporco&&(t.bindBuffer(t.ARRAY_BUFFER,s.ibo),t.bufferData(t.ARRAY_BUFFER,s.istanze,t.DYNAMIC_DRAW),s.sporco=!1),t.drawArraysInstanced(t.TRIANGLES,0,s.vertici,s.n),a++,n+=s.triangoli*s.n);return t.bindVertexArray(null),[a,n]}disegna(e,o){let t=this.gl,a=this.u,n=e.sole;t.useProgram(this.programma),t.uniformMatrix4fv(a.uVP,!1,e.vpCorrente||e.vp),t.uniform1f(a.uTaglio,e.taglio??-1e9);let r=e.vpCorrente===e.vpSpecchio?[0,0,0,0]:e.buco||[0,0,0,0];t.uniform3f(a.uOcchio,o.occhio[0],o.occhio[1],o.occhio[2]),t.uniform1f(a.uTempo,e.tempo),t.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),t.uniform3f(a.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),t.uniform1f(a.uSoleForza,n.forza),t.uniform3f(a.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),t.uniform4fv(a.uMaterie,e.materie),t.uniform2f(a.uNebbia,e.nebbia.da,e.nebbia.a),t.uniform3f(a.uNebbiaCol,e.nebbia.colore[0],e.nebbia.colore[1],e.nebbia.colore[2]),t.uniform3f(a.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),t.uniform1f(a.uOmbra,e.ombra&&e.altezze?1:0),e.altezze&&(t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,e.ombre.tex),t.uniform1i(a.uOmbre,0),t.uniform2f(a.uOmbreScala,e.ombre.scala,e.ombre.offset),t.uniform4f(a.uAltRett,e.altRett[0],e.altRett[1],e.altRett[2],e.altRett[3])),e.legaMappa(a);let s=0,l=0,c=0;t.uniform1f(a.uSagoma,0);for(let[p,f]of this.tipi)f.n!==0&&(t.uniform4f(a.uBuco,r[0],r[1],r[2],p==="omino"?0:r[3]),t.bindVertexArray(f.vao),f.sporco&&(t.bindBuffer(t.ARRAY_BUFFER,f.ibo),t.bufferData(t.ARRAY_BUFFER,f.istanze,t.DYNAMIC_DRAW),f.sporco=!1),t.drawArraysInstanced(t.TRIANGLES,0,f.vertici,f.n),s++,l+=f.triangoli*f.n,c+=f.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&e.vpCorrente!==e.vpSpecchio&&(t.uniform1f(a.uSagoma,1),t.depthFunc(t.GREATER),t.depthMask(!1),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.bindVertexArray(u.vao),t.drawArraysInstanced(t.TRIANGLES,0,u.vertici,u.n),t.disable(t.BLEND),t.depthMask(!0),t.depthFunc(t.LESS),t.uniform1f(a.uSagoma,0),s++),t.bindVertexArray(null),this.statistiche.disegni=s,this.statistiche.triangoli=l,this.statistiche.istanze=c}};var jn=`#version 300 es
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
}`,Kn=`#version 300 es
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
}`,jt=class{constructor(e){this.gl=e,this.programma=ue(e,jn,Kn),this.u={};for(let o of["uVP","uCam","uSoleForza"])this.u[o]=e.getUniformLocation(this.programma,o);this.vao=e.createVertexArray(),this.ibo=e.createBuffer(),e.bindVertexArray(this.vao),e.bindBuffer(e.ARRAY_BUFFER,this.ibo),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(0,1),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(1,1),e.bindVertexArray(null),this.n=0,this.attivo=!0,this.statistiche={disegni:0,bagliori:0}}istanze(e){let o=this.gl,t=e instanceof Float32Array?e:new Float32Array(e);this.n=t.length/8,o.bindBuffer(o.ARRAY_BUFFER,this.ibo),o.bufferData(o.ARRAY_BUFFER,t,o.DYNAMIC_DRAW)}disegna(e,o){let t=this.gl,a=this.u;if(!this.attivo||this.n===0){this.statistiche.disegni=0,this.statistiche.bagliori=0;return}t.useProgram(this.programma),t.uniformMatrix4fv(a.uVP,!1,e.vp),t.uniform3f(a.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),t.uniform1f(a.uSoleForza,e.sole.forza),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE),t.depthMask(!1),t.disable(t.CULL_FACE),t.bindVertexArray(this.vao),t.drawArraysInstanced(t.TRIANGLES,0,6,this.n),t.bindVertexArray(null),t.depthMask(!0),t.enable(t.CULL_FACE),t.disable(t.BLEND),this.statistiche.disegni=1,this.statistiche.bagliori=this.n}};ie();var T=16,er=256,Kt=2048,Fa=64,me=(i,e,o)=>((i+Kt)*4096+(o+Kt))*256+(e+Fa),nt=i=>Math.floor(i/(256*4096))-Kt,rt=i=>Math.floor(i/256)%4096-Kt,st=i=>i%256-Fa;var Xe=(i,e)=>Math.floor(i/T)+","+Math.floor(e/T),Wt=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this.bagnate=new Map,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(e){this.generati.add(e)}_annotaModifica(e,o,t,a){if(!this.frontiera)return;let n=Xe(e,t),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(me(e,o,t),a)}applicaModifiche(e){let o=this.modifiche.get(e);if(!o)return 0;for(let[t,a]of o){let n=nt(t),r=st(t),s=rt(t);a===null?this.togli(n,r,s,!0):this.metti(n,r,s,a,!0)}return o.size}scaricaChunk(e){let o=this.chunks.get(e);if(!o)return this.generati.delete(e),[];let t=[];for(let[a,n]of o){let r=q(n);r&&r.forma==="modello"&&t.push([nt(a),st(a),rt(a),n])}return this.contaBlocchi-=o.size,this.chunks.delete(e),this._scordaMemo(),this.generati.delete(e),this._tocca(e,this.sporchi),t}_cambiata(e,o,t){if(this.cambiate.length>=3*er){this.troppiCambi=!0;return}this.cambiate.push(e,o,t)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(e,o){let t=Math.floor(e/T),a=Math.floor(o/T);if(this._memoChunk!==null&&this._memoCx===t&&this._memoCz===a)return this._memoChunk;let n=this.chunks.get(t+","+a)||null;return this._memoCx=t,this._memoCz=a,this._memoChunk=n,n}tipo(e,o,t){let a=this._chunkDi(e,t);return a&&a.get(me(e,o,t))||null}pieno(e,o,t){return this.tipo(e,o,t)!==null}solido(e,o,t){let a=this.tipo(e,o,t);if(a&&q(a).solido)return!0;let n=this.furni.get(me(e,o,t));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(e,o,t){if(!this.solido(e,o-1,t)||this.solido(e,o,t)||this.solido(e,o+1,t))return!1;let a=this.tipo(e,o,t);return!(a&&q(a).acqua)}_sporca(e,o,t=this.sporchi){let a=(e%T+T)%T,n=(o%T+T)%T;this._tocca(Xe(e,o),t),a===0&&this._tocca(Xe(e-1,o),t),a===T-1&&this._tocca(Xe(e+1,o),t),n===0&&this._tocca(Xe(e,o-1),t),n===T-1&&this._tocca(Xe(e,o+1),t)}_tocca(e,o){o.add(e),this._rev.set(e,(this._rev.get(e)||0)+1)}revisione(e){return this._rev.get(e)||0}metti(e,o,t,a,n=!1){let r=Xe(e,t),s=this.chunks.get(r);s||(s=new Map,this.chunks.set(r,s),this._scordaMemo());let l=me(e,o,t),c=s.get(l);c===void 0&&this.contaBlocchi++,s.set(l,a);let u=a.charCodeAt(0)===97&&a.startsWith("acqua")&&(c===void 0||c.startsWith("acqua"));this._sporca(e,t,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(e,o,t),n||(this._annotaModifica(e,o,t,a),this.onEvento&&this.onEvento({tipo:"metti",cella:[e,o,t],blocco:a}))}togli(e,o,t,a=!1){let n=Xe(e,t),r=this.chunks.get(n);if(!r)return!1;let s=me(e,o,t),l=r.get(s);if(!r.delete(s))return!1;this.bagnate.delete(s),this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let c=!!(l&&l.startsWith("acqua"));return this._sporca(e,t,c?this.sporchiAcqua:this.sporchi),c||this._cambiata(e,o,t),a||(this._annotaModifica(e,o,t,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[e,o,t]})),!0}bagna(e,o,t,a=0){this.bagnate.set(me(e,o,t),Math.max(0,Math.min(15,a|0))),this._sporca(e,t,this.sporchiAcqua)}asciuga(e,o,t){return this.bagnate.delete(me(e,o,t))?(this._sporca(e,t,this.sporchiAcqua),!0):!1}bagnata(e,o,t){let a=this.bagnate.get(me(e,o,t));return a===void 0?null:a}occupaFurni(e,o){for(let[t,a,n]of e)this.furni.set(me(t,a,n),o)}liberaFurni(e){for(let[o,t,a]of e)this.furni.delete(me(o,t,a))}furniIn(e,o,t){return this.furni.get(me(e,o,t))||null}occupaOmbra(e,o=!1){for(let[t,a,n]of e){let r=me(t,a,n),s=this.ombreFurni.get(r);if(s){s.n++,o&&s.op++===0&&this._cambiata(t,a,n);continue}this.ombreFurni.set(r,{x:t,y:a,z:n,n:1,op:o?1:0}),this._cambiata(t,a,n)}}liberaOmbra(e,o=!1){for(let[t,a,n]of e){let r=me(t,a,n),s=this.ombreFurni.get(r);s&&(o&&s.op>0&&--s.op===0&&s.n>1&&this._cambiata(t,a,n),!(--s.n>0)&&(this.ombreFurni.delete(r),this._cambiata(t,a,n)))}}ombraFurniIn(e,o,t){let a=this.ombreFurni.get(me(e,o,t));return a?a.op>0?2:1:0}appoggioInColonna(e,o,t,a=8){for(let n=t;n>t-a;n--)if(this.calpestabile(e,n,o))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let e of this._rev.keys())this._rev.set(e,this._rev.get(e)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let e of this.chunks.values())for(let[o,t]of e)yield{x:nt(o),y:st(o),z:rt(o),tipo:t}}perOgni(e){for(let o of this.chunks.values())for(let[t,a]of o)e(nt(t),st(t),rt(t),a)}*blocchiDelChunk(e){let o=this.chunks.get(e);if(o)for(let[t,a]of o)yield{x:nt(t),y:st(t),z:rt(t),tipo:a}}perOgniDelChunk(e,o){let t=this.chunks.get(e);if(t)for(let[a,n]of t)o(nt(a),st(a),rt(a),n)}};function _t(i,e,o){let t=i*374761393+e*668265263+o*1442695041|0;return t=Math.imul(t^t>>>13,1274126177),((t^t>>>16)>>>0)/4294967296}function Da(i){return i*i*(3-2*i)}function $o(i,e,o){let t=Math.floor(i),a=Math.floor(e),n=Da(i-t),r=Da(e-a),s=_t(t,a,o),l=_t(t+1,a,o),c=_t(t,a+1,o),u=_t(t+1,a+1,o);return s+(l-s)*n+(c-s)*r+(s-l-c+u)*n*r}var Xo=5;function Ua(i,e,o,t=1){let a=[],n=e*16,r=o*16;for(let s=n;s<n+16;s++)for(let l=r;l<r+16;l++){let c=.55*$o(s*.028,l*.028,t)+.3*$o(s*.07,l*.07,t+11)+.15*$o(s*.16,l*.16,t+29),u=Math.max(2,1+Math.round(Math.pow(Math.max(0,c),1.6)*22)),p=u<=Xo+1;for(let f=0;f<u;f++){let m=f===u-1?p?"sabbia":"erba":f<u-3?"roccia":"terra";i.metti(s,f,l,m,!0)}if(u<=Xo)for(let f=u;f<=Xo;f++)i.metti(s,f,l,"acqua",!0);else if(!p){let f=_t(s*3+1,l*3+7,t+101);f>.988?a.push([s,u,l,"albero"]):f<.004&&a.push([s,u,l,"lampione"])}}return a}ie();var Qt={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,pozza:16762994,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function Ba(){for(let[i,e]of Object.entries(Qt))$e(i,{nome:e.nome,cima:e.cima,lato:e.lato,fondo:e.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:e.modello,altezza:e.altezza,mezza:e.mezza,luce:e.luce},it)}ie();ie();var tr={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},ct="primavera";function ka(){return ct}var yt=null;function Va(){return yt}function Jt(i,e,o){let t=i>>16&255,a=i>>8&255,n=i&255,r=e>>16&255,s=e>>8&255,l=e&255,c=(u,p)=>Math.round(u+(p-u)*o);return c(t,r)<<16|c(a,s)<<8|c(n,l)}function to(i,e){if(yt){let o=ct;ct=yt.da;let t=Ho(i,e);ct=yt.a;let a=Ho(i,e);ct=o;let n=yt.mix;return{cima:eo(t.cima,a.cima,n),lato:eo(t.lato,a.lato,n),fondo:eo(t.fondo,a.fondo,n),facce:t.facce,orlo:t.orlo!=null&&a.orlo!=null?eo(t.orlo,a.orlo,n):t.orlo}}return Ho(i,e)}function eo(i,e,o){let t=Math.round((i>>16&255)+((e>>16&255)-(i>>16&255))*o),a=Math.round((i>>8&255)+((e>>8&255)-(i>>8&255))*o),n=Math.round((i&255)+((e&255)-(i&255))*o);return t<<16|a<<8|n}function Ho(i,e){let o=q(i),t=tr[ct],{cima:a,lato:n,fondo:r}=o;if(o.cappello&&t.erba&&!o.override&&(a=t.erba[Yo(e,t.erba.length)]),o.reagisce==="stagione"&&t.erba){let s=t.erba[Yo(e,t.erba.length)],l=o.reagisceForza??1;a=Jt(a,s,l),n=Jt(n,s,l*.45),r=Jt(r,s,l*.3)}else if(o.reagisce==="quota"){let s=Yo(e,8)/7,l=(o.reagisceForza??1)*.5,c=u=>Jt(u,16777215,s*l);a=c(a),n=c(n),r=c(r)}return i==="sabbia"&&t.sabbia&&({cima:a,lato:n,fondo:r}=t.sabbia),{cima:a,lato:n,fondo:r,facce:o.facce||null,orlo:o.orlo!=null?o.orlo:void 0}}function Ue(i,e,o){if(i.facce){let t=e*2+(o>0?0:1),a=i.facce[t];if(a!=null)return a}return e===1?o>0?i.cima:i.fondo:i.lato}function Yo(i,e=8){let o=(e-1)*2,t=(Math.round(i)%o+o)%o;return t>=e&&(t=o-t),t}var oo=class{constructor(e,{x:o=.5,y:t=10,z:a=.5}={}){this.mondo=e,this.x=o,this.y=t,this.z=a,this.vy=0,this.aTerra=!1,this.verso=0,this._coyote=0}_solido(e,o,t){return this.mondo.solido(Math.floor(e),Math.floor(o),Math.floor(t))}_urta(e,o,t){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(e+n,o+.05,t+r)||this._solido(e+n,o+.9-.05,t+r))return!0;return!1}_pavimento(e,o,t){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(e+n,o-.02,t+r))return!0;return!1}aggiorna(e,o,t){let a=Math.min(e,.05),n=o.avanti||0,r=o.destra||0,s=Math.hypot(n,r),l=0,c=0;if(s>.01){let d=t?t.x:0,m=t?t.z:-1,h=Math.hypot(d,m)||1;d/=h,m/=h;let g=-m,v=d;l=(d*n+g*r)/s,c=(m*n+v*r)/s,this.verso=Math.atan2(l,c)}let u=l*4.6*a,p=c*4.6*a;if(u!==0&&(this._urta(this.x+u,this.y,this.z)?this._urta(this.x+u,this.y+1.02,this.z)||(this.x+=u,this.y+=1.02):this.x+=u),p!==0&&(this._urta(this.x,this.y,this.z+p)?this._urta(this.x,this.y+1.02,this.z+p)||(this.z+=p,this.y+=1.02):this.z+=p),this.aTerra?this._coyote=.08:this._coyote=Math.max(0,this._coyote-a),o.salta&&this._coyote>0&&(this.vy=8.2,this._coyote=0,this.aTerra=!1),this.vy<=0&&this._pavimento(this.x,this.y,this.z))return this.vy=0,this.aTerra=!0,this;this.vy-=26*a;let f=this.y+this.vy*a;if(this.vy<=0){let d=this.y-f,m=Math.max(1,Math.ceil(d/.4));for(let h=1;h<=m;h++){let g=this.y-d*h/m;if(this._pavimento(this.x,g,this.z))return this.y=Math.floor(g-.02)+1,this.vy=0,this.aTerra=!0,this}this.aTerra=!1,this.y=f}else this._urta(this.x,f,this.z)&&(this.vy=0,f=this.y),this.y=f,this.aTerra=!1;return this}};function Ga(i=window){let e=new Set,o={avanti:0,destra:0,salta:!1},t={KeyW:"su",ArrowUp:"su",KeyS:"giu",ArrowDown:"giu",KeyA:"sinistra",ArrowLeft:"sinistra",KeyD:"destra",ArrowRight:"destra",Space:"salta"},a=(n,r)=>{let s=t[n.code];s&&(n.target&&/^(INPUT|TEXTAREA)$/.test(n.target.tagName)||(r?e.add(s):e.delete(s),s==="salta"&&n.preventDefault(),o.avanti=(e.has("su")?1:0)-(e.has("giu")?1:0),o.destra=(e.has("destra")?1:0)-(e.has("sinistra")?1:0),o.salta=e.has("salta")))};return i.addEventListener("keydown",n=>a(n,!0)),i.addEventListener("keyup",n=>a(n,!1)),i.addEventListener("blur",()=>{e.clear(),o.avanti=o.destra=0,o.salta=!1}),o}function jo(i,e,o,t=7){let a=Math.floor(e.x),n=Math.floor(e.y),r=Math.floor(e.z),s=Math.sign(o.x),l=Math.sign(o.y),c=Math.sign(o.z),u=s!==0?Math.abs(1/o.x):1/0,p=l!==0?Math.abs(1/o.y):1/0,f=c!==0?Math.abs(1/o.z):1/0,d=s!==0?(s>0?a+1-e.x:e.x-a)*u:1/0,m=l!==0?(l>0?n+1-e.y:e.y-n)*p:1/0,h=c!==0?(c>0?r+1-e.z:e.z-r)*f:1/0;if(i.solido(a,n,r))return{cella:[a,n,r],faccia:[0,1,0],prima:[a,n+1,r]};for(let g=0;g<t*3+3;g++){let v=0,b=0,x=0;if(d<=m&&d<=h){if(d>t)break;a+=s,d+=u,v=-s}else if(m<=h){if(m>t)break;n+=l,m+=p,b=-l}else{if(h>t)break;r+=c,h+=f,x=-c}if(i.solido(a,n,r))return{cella:[a,n,r],faccia:[v,b,x],prima:[a+v,n+b,r+x]}}return null}function Zo(i,e,o,t,a,n=null){let r=0,s=a,l=-1,c=0,u=["x","y","z"];for(let p=0;p<3;p++){let f=u[p],d=e[f];if(Math.abs(d)<1e-9){if(i[f]<o[f]||i[f]>t[f])return-1;continue}let m=(o[f]-i[f])/d,h=(t[f]-i[f])/d,g=-1;if(m>h){let v=m;m=h,h=v,g=1}if(m>r&&(r=m,l=p,c=g),h<s&&(s=h),r>s)return-1}return n&&l>=0&&(n[0]=n[1]=n[2]=0,n[l]=c),r}function $a(i,e,o,t,a=7){let n=jo(i,e,o,a),r=1/0;if(n){let c=n.cella,u=c[0]+.5-e.x,p=c[1]+.5-e.y,f=c[2]+.5-e.z;r=Math.sqrt(u*u+p*p+f*f)}let s=null,l=r;for(let c of t||[]){let u=Zo(e,o,c.min,c.max,a);u>=0&&u<l&&(l=u,s=c)}if(s){let c=s.dato&&s.dato.cella,u=n&&n.prima,p=n&&n.faccia;if(c){let f=[0,0,0],d=Zo(e,o,{x:c[0],y:c[1],z:c[2]},{x:c[0]+1,y:c[1]+1,z:c[2]+1},a,f);d<0&&(d=Zo(e,o,s.min,s.max,a,f)),d>=0&&(f[0]||f[1]||f[2])&&(u=[c[0]+f[0],c[1]+f[1],c[2]+f[2]],p=f),u||(u=[c[0],c[1]+1,c[2]],p=[0,1,0])}return{...n,cella:n?n.cella:c||null,faccia:p,scatola:s,dato:s.dato,distanza:l,prima:u}}return n}ie();var Xa=[null,"erba","terra","pietra","mattoni","legno","sabbia","neve","lanaRossa","lanaBlu","lanaGialla","lampadaPesante","lampadaRossa","lampadaVerde","lampadaBlu","lucciola","albero","lampione","erbetta"],Te={erbetta:{nome:"Erbetta",colore:6601551,agisce:"erba"}};function Ha(i,e,o,t){let a=i.tipo(e,o,t);if(a==null)return!0;let n=q(a);return!!(n&&n.acqua)}var ao=class{constructor(){this.dove=null,this.durata=550,this.inizio=0,this._ultimeSchegge=0}premi(e,o,t){this.dove!==e&&(this.dove=e,this.durata=Math.max(60,o||550),this.inizio=t,this._ultimeSchegge=t)}molla(){this.dove=null,this.inizio=0}progresso(e){return this.dove?Math.min(1,(e-this.inizio)/this.durata):0}finito(e){return!this.dove||this.progresso(e)<1?!1:(this.molla(),!0)}schegge(e){return!this.dove||e-this._ultimeSchegge<130?!1:(this._ultimeSchegge=e,!0)}};function Ya(i){return i?i.salute>=100?1100:i.fam==="mina"?750:i.fam==="taglia"?600:380:550}function Za(i,e){let o=new Map;i.addEventListener("pointerdown",a=>{o.set(a.pointerId+":"+a.button,{x:a.clientX,y:a.clientY,t:performance.now()})});let t=a=>{let n=a.pointerId+":"+a.button,r=o.get(n);if(!r)return;o.delete(n),Math.hypot(a.clientX-r.x,a.clientY-r.y)<=6&&performance.now()-r.t<=500&&e(a)};i.addEventListener("pointerup",t),i.addEventListener("pointercancel",a=>{for(let n of[...o.keys()])n.startsWith(a.pointerId+":")&&o.delete(n)})}function ja(i,{onInizio:e,onFine:o},t=0){let a=null,n=s=>{a&&(a=null,o&&o(s))};i.addEventListener("pointerdown",s=>{s.button===t&&(a={id:s.pointerId,x:s.clientX,y:s.clientY},e&&e(s))}),i.addEventListener("pointermove",s=>{!a||s.pointerId!==a.id||Math.hypot(s.clientX-a.x,s.clientY-a.y)>6&&n("trascinamento")});let r=s=>{a&&s.pointerId===a.id&&n("rilascio")};i.addEventListener("pointerup",r),i.addEventListener("pointercancel",r),addEventListener("blur",()=>n("fuoco perso"))}var or=`
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
`,io=class{constructor(e,{visibile:o=!0,onDemolisci:t=null}={}){this.intento=e,this.demolisci=!1;let a=document.createElement("style");a.textContent=or,document.head.appendChild(a);let n=this.root=document.createElement("div");n.id="comandi",n.innerHTML=`
      <div class="stick"><div class="knob"></div></div>
      <button class="btn salta" title="Salta">\u2934</button>
      <!-- \u26A0 SUL TELEFONO IL DITO \xC8 UN TASTO SOLO, e questo bottone dice quale
           dei due sta emulando: acceso = il sinistro (rompe, a colpi ripetuti),
           spento = il destro (posa, o accende a mano vuota). Senza di lui met\xE0
           dei verbi del gioco sarebbero irraggiungibili col tocco. -->
      <button class="btn demolisci" title="Piccone: i tocchi rompono (a pi\xF9 colpi)">\u26CF</button>`,document.body.appendChild(n),o||this.mostra(!1);let r=n.querySelector(".stick"),s=n.querySelector(".knob"),l=null,c=0,u=0,p=58,f=(x,A)=>{s.style.transform=`translate(${x*p*.62}px, ${A*p*.62}px)`,this.intento.avanti=-A,this.intento.destra=x},d=x=>{if(x.pointerId!==l)return;let A=(x.clientX-c)/p,E=(x.clientY-u)/p,M=Math.hypot(A,E);M>1&&(A/=M,E/=M),f(A,E),x.preventDefault()};r.addEventListener("pointerdown",x=>{l=x.pointerId;try{r.setPointerCapture(x.pointerId)}catch{}let A=r.getBoundingClientRect();c=A.left+A.width/2,u=A.top+A.height/2,p=A.width/2,d(x)}),r.addEventListener("pointermove",d);let m=x=>{x.pointerId===l&&(l=null,f(0,0))};r.addEventListener("pointerup",m),r.addEventListener("pointercancel",m);let h=n.querySelector(".salta"),g=x=>{x.preventDefault(),this.intento.salta=!0,h.classList.add("premuto")},v=()=>{this.intento.salta=!1,h.classList.remove("premuto")};h.addEventListener("pointerdown",g),h.addEventListener("pointerup",v),h.addEventListener("pointercancel",v),h.addEventListener("pointerleave",v);let b=n.querySelector(".demolisci");b.addEventListener("pointerdown",x=>{x.preventDefault(),this.demolisci=!this.demolisci,b.classList.toggle("acceso",this.demolisci),t&&t(this.demolisci)})}mostra(e){this.root.style.display=e?"":"none"}azzera(){this.intento.avanti=0,this.intento.destra=0,this.intento.salta=!1;let e=this.root.querySelector(".knob");e&&(e.style.transform="")}};var Ka="leafy.gui",ar="gui-tocco";var no=class{constructor(e){this.onCambio=e,this.scelta=(()=>{try{return localStorage.getItem(Ka)||"auto"}catch{return"auto"}})();let o=document.createElement("style");if(o.textContent=`
`,document.head.appendChild(o),this.nodo=document.createElement("div"),this.nodo.id="modoGui",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.cicla()),typeof matchMedia=="function"){this._mq=matchMedia("(pointer: coarse)");let t=()=>{this.scelta==="auto"&&this.applica()};this._mq.addEventListener&&this._mq.addEventListener("change",t)}this.applica()}get automatico(){return!!(this._mq&&this._mq.matches)}get aTocco(){return this.scelta==="tocco"?!0:this.scelta==="mouse"?!1:this.automatico}cicla(){this.scelta=this.scelta==="auto"?"tocco":this.scelta==="tocco"?"mouse":"auto";try{localStorage.setItem(Ka,this.scelta)}catch{}this.applica()}applica(){let e=this.aTocco;document.documentElement.classList.toggle(ar,e),this.nodo.classList.toggle("fissato",this.scelta!=="auto"),this.nodo.innerHTML=e?"<b>\u{1F4F1}</b> a dito":"<b>\u{1F5A5}</b> col mouse",this.nodo.title=this.scelta==="auto"?`Interfaccia: automatica (adesso ${e?"a dito":"col mouse"}) \u2014 tocca per fissarla`:`Interfaccia: ${e?"a dito":"col mouse"}, fissata \u2014 tocca per cambiare`,this.onCambio&&this.onCambio(e)}};function Wa(i={}){let e=(o,t=1)=>typeof o=="number"&&isFinite(o)?+o.toFixed(t):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:e(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?e(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:e(i.fps,0),p50ms:e(i.p50,2),p99ms:e(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:e(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(o=>Math.round(o)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[]},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:e(i.worldgenMs,0),meshMs:e(i.meshMs,0)},errori:(i.errori||[]).slice(-12).map(o=>String(o).slice(0,500)),scatto:i.scatto||null}}function Qa(i){return Math.round(JSON.stringify(i).length/1024)}var ir=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),Re=(i,e)=>i>>>e|i<<32-e;function Ja(i){let e=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),o=i.length*8,t=new Uint8Array(i.length+9+63>>6<<6);t.set(i),t[i.length]=128,new DataView(t.buffer).setUint32(t.length-4,o>>>0),new DataView(t.buffer).setUint32(t.length-8,Math.floor(o/4294967296));let a=new Uint32Array(64),n=new DataView(t.buffer);for(let s=0;s<t.length;s+=64){for(let g=0;g<16;g++)a[g]=n.getUint32(s+g*4);for(let g=16;g<64;g++){let v=Re(a[g-15],7)^Re(a[g-15],18)^a[g-15]>>>3,b=Re(a[g-2],17)^Re(a[g-2],19)^a[g-2]>>>10;a[g]=a[g-16]+v+a[g-7]+b>>>0}let[l,c,u,p,f,d,m,h]=e;for(let g=0;g<64;g++){let v=Re(f,6)^Re(f,11)^Re(f,25),b=f&d^~f&m,x=h+v+b+ir[g]+a[g]>>>0,A=Re(l,2)^Re(l,13)^Re(l,22),E=l&c^l&u^c&u,M=A+E>>>0;h=m,m=d,d=f,f=p+x>>>0,p=u,u=c,c=l,l=x+M>>>0}e[0]=e[0]+l>>>0,e[1]=e[1]+c>>>0,e[2]=e[2]+u>>>0,e[3]=e[3]+p>>>0,e[4]=e[4]+f>>>0,e[5]=e[5]+d>>>0,e[6]=e[6]+m>>>0,e[7]=e[7]+h>>>0}let r="";for(let s of e)r+=s.toString(16).padStart(8,"0");return r}var nr="https://ntfy.sh",rr=4096;async function sr(i){let e=new TextEncoder().encode("leafy-shadows/"+i),o;if(globalThis.crypto&&crypto.subtle){let t=await crypto.subtle.digest("SHA-256",e);o=[...new Uint8Array(t)].map(a=>a.toString(16).padStart(2,"0")).join("")}else o=Ja(e);return"leafy-"+o.slice(0,24)}async function ei(i,e){let o=await sr(i),t=await fetch(`${nr}/${o}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:e});if(!t.ok)return{ok:!1,dice:`il servizio ha detto no: ${t.status}`};let a=await t.json().catch(()=>({})),n=e.length>rr;return{ok:!0,id:a.id||"",dice:n?`mandato \u2714 (${Math.round(e.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(e.length/1024)} KB, dura 12 ore)`}}var ti="leafy.diagnostica.chiave",cr=`
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
`,ro=class{constructor(e,o){this.leggi=e,this.scatta=o,this.errori=[],addEventListener("error",a=>this._errore(a.error||a.message)),addEventListener("unhandledrejection",a=>this._errore(a.reason));let t=document.createElement("style");t.textContent=cr,document.head.appendChild(t),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(e){let o=e&&e.stack?e.stack:String(e);this.errori.push(o),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(ti)||""}catch{return""}}set chiave(e){try{localStorage.setItem(ti,e)}catch{}}apri(){let e=this.pannello;e.classList.add("aperto"),e.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,e.querySelector("#diagChiudi").onclick=()=>e.classList.remove("aperto"),e.querySelector("#diagCopia").onclick=()=>this.vai(!0),e.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let o=e.querySelector("#diagNota");o&&o.focus()},30)}_dice(e){let o=this.pannello.querySelector("#diagEsito");o&&(o.textContent=e)}async vai(e){let o=this.pannello.querySelector("#diagChiave");o&&o.value.trim()&&(this.chiave=o.value.trim());let t=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let a=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,n=null;if(a)try{n=this.scatta?await this.scatta():null}catch(u){this._errore(u)}let r=Wa({...this.leggi(),quando:new Date().toISOString(),nota:t,errori:this.errori,scatto:n}),s=Qa(r),l=JSON.stringify(r,null,1);if(e){await this._negliAppunti(l),this.nodo.classList.remove("corso");return}let c=!1;try{let u=await fetch("/_diagnostica",{method:"GET"});c=u.ok&&(await u.json().catch(()=>({}))).collettore===!0}catch{c=!1}if(c)try{let u=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:l});if(u.status===403)this._dice("password sbagliata."),this.chiave="";else if(u.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!u.ok)this._dice("il collettore ha detto no: "+u.status);else{let p=await u.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${p.nome||""}  (${s} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let u=await ei(this.chiave,l);this._dice(u.ok?u.dice+`
(fuori casa: passa dal cloud)`:u.dice),u.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(l,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(e,o=""){try{await navigator.clipboard.writeText(e),this._dice(o+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let t=new Blob([e],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(t),a.download="leafy-diagnostica.json",a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),4e3),this._dice(o+`scaricato come file \u2714
mandami quello.`)}}};var lr=4,so=class{constructor(e,o,{margineGenera:t=2*T,margineTieni:a=6*T,onGenerato:n=null}={}){this.onGenerato=n,this.mondo=e,this.genera=o,this.margineGenera=t,this.margineTieni=a,this._coda=[],this._chunkOsservatore=null,this.statistiche={generati:0,scaricati:0,inCoda:0,ultimaMs:0},e.frontiera=this}assicura(e,o,t,{subito:a=!1}={}){let n=performance.now(),r=Math.floor(e/T),s=Math.floor(o/T),l=r+","+s,c=t&&Number.isFinite(t.resa)?t.resa:4*T;(l!==this._chunkOsservatore||a)&&(this._chunkOsservatore=l,this._riesamina(r,s,e,o,c));let u=0,p=a?1/0:lr;for(;this._coda.length&&u<p;){let f=this._coda.shift();this.mondo.generati.has(f)||(this._generaChunk(f),u++)}return this.statistiche.inCoda=this._coda.length,this.statistiche.ultimaMs=performance.now()-n,u}_riesamina(e,o,t,a,n){let r=n+this.margineGenera,s=n+this.margineTieni,l=Math.ceil(r/T)+1,c=[];for(let u=-l;u<=l;u++)for(let p=-l;p<=l;p++){let f=e+u+","+(o+p);if(this.mondo.generati.has(f))continue;let d=oi(e+u,o+p,t,a);d<=r&&c.push([d,f])}c.sort((u,p)=>u[0]-p[0]),this._coda=c.map(u=>u[1]);for(let u of[...this.mondo.generati]){let p=u.indexOf(",");oi(+u.slice(0,p),+u.slice(p+1),t,a)>s&&this._scaricaChunk(u)}}_generaChunk(e){let o=e.indexOf(","),t=+e.slice(0,o),a=+e.slice(o+1),n=this.genera(this.mondo,t,a)||[];this.mondo.segnaGenerato(e);let r=this.mondo.modifiche.get(e);for(let[s,l,c,u]of n)r&&r.has(ii(s,l,c))||(this.mondo.metti(s,l,c,u),this.mondo.modifiche.get(e)?.delete(ii(s,l,c)));this.mondo.applicaModifiche(e),this.statistiche.generati++,this.onGenerato&&this.onGenerato(e,t,a)}_scaricaChunk(e){let o=this.mondo.scaricaChunk(e);if(this.mondo.onEvento)for(let[t,a,n]of o)this.mondo.onEvento({tipo:"togli",cella:[t,a,n]});this.statistiche.scaricati++}};function oi(i,e,o,t){let a=i*T,n=e*T,r=Math.max(a-o,0,o-(a+T)),s=Math.max(n-t,0,t-(n+T));return Math.sqrt(r*r+s*s)}var ai=2048,ur=64,ii=(i,e,o)=>((i+ai)*4096+(o+ai))*256+(e+ur);ie();function Ko(i,e,o){let t=(i|0)*374761393+(e|0)*668265263+(o|0)*2147483647;return t=(t^t>>>13)*1274126177,t=t^t>>>16,(t>>>0)%1e3/1e3}function fr(i,e){let o=i>>16&255,t=i>>8&255,a=i&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+e))));return n(o)<<16|n(t)<<8|n(a)}function pr(i,e,o,t,a,n){if(!e||e==="liscio"||!o)return i;let r=0;return e==="chiazze"?r=(Ko(t,a,n)-.5)*2:e==="venature"?r=(Ko(0,a,0)-.5)*2*.7+(Ko(t,a,n)-.5)*.3:e==="sfumato"&&(r=(a%16+16)%16/16-.5),fr(i,r*o*.34)}function ni(i,e,o,t,a,n){if(!e||e==="liscio"||!o)return i;let r=s=>pr(s,e,o,t,a,n);return{cima:r(i.cima),lato:r(i.lato),fondo:r(i.fondo),facce:i.facce?i.facce.map(r):null}}var ri={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},dr=Object.keys(ri);function si(i){return!i||!i.materia?null:ri[i.materia]||null}function He(i,e,o=0){if(!e)return i;let t=(i>>16&255)/255,a=(i>>8&255)/255,n=(i&255)/255,r=.2126*t+.7152*a+.0722*n,s=e.satura;t=r+(t-r)*s,a=r+(a-r)*s,n=r+(n-r)*s;let l=e.tinta*(1+o),c=u=>Math.max(0,Math.min(255,Math.round(u*l*255)));return c(t)<<16|c(a)<<8|c(n)}var mr=16;function ci(i){let e=dr.indexOf(i);return e<0||e+1>=mr?0:e+1}var Wo=1/16,li=8*Wo,_e=9*Wo;function ui(i,e,o,t,a,n,r,s){let l=(u,p,f)=>[e+u,o+p,t+f];i.quad(l(-s,r,-s),l(s,r,-s),l(s,r,s),l(-s,r,s),Ue(a,1,1),[0,1,0]),i.quad(l(-s,n,-s),l(s,n,-s),l(s,n,s),l(-s,n,s),Ue(a,1,-1),[0,-1,0]);let c=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of c){let[p,,f]=u.d,d=-f,m=p,h=(g,v)=>l(p*s+d*v,g,f*s+m*v);i.quad(h(n,-s),h(r,-s),h(r,s),h(n,s),Ue(a,u.asse,u.segno),u.d)}}function hr(i,e,o,t,a){ui(i,e,o,t,a,-_e,0,li)}function gr(i,e,o,t,a){ui(i,e,o,t,a,-_e,_e,5*Wo)}function vr(i,e,o,t,a){let n=(c,u,p)=>[e+c,o+u,t+p],r=Ue(a,0,1),s=li,l=[[[-s,-_e,-s],[s,-_e,s],[s,_e,s],[-s,_e,-s],[1,0,-1]],[[-s,-_e,s],[s,-_e,-s],[s,_e,-s],[-s,_e,s],[1,0,1]]];for(let[c,u,p,f,d]of l)i.quad(n(...c),n(...u),n(...p),n(...f),r,d),i.quad(n(...c),n(...u),n(...p),n(...f),r,[-d[0],-d[1],-d[2]])}function br(){}var fi={lastra:hr,pilastro:gr,croce:vr,modello:br},We=new Set(["lastra","pilastro","croce","modello"]);var Ct=1/16,xr=[[0,1],[0,2],[1,2]],Er=[[1,0],[-1,0],[0,1],[0,-1]];function Ye(i,e,o,t,a,n,r,s,l){let c=[i,e,o];return c[t]+=a,c[n]+=r,c[s]+=l,c}var pi={tinta:1,satura:1};function di(i,e,o,t,a,n,r=0){let s=8*Ct,l=9*Ct,c=(u,p)=>n(u===0?p:0,u===1?p:0,u===2?p:0);for(let u=0;u<3;u++)for(let p of[-1,1]){if(c(u,p))continue;let f=(u+1)%3,d=(u+2)%3,m=Ue(a,u,p),h=[0,0,0];h[u]=p,i.quad(Ye(e,o,t,u,p*l,f,-s,d,-s),Ye(e,o,t,u,p*l,f,+s,d,-s),Ye(e,o,t,u,p*l,f,+s,d,+s),Ye(e,o,t,u,p*l,f,-s,d,+s),m,h)}for(let[u,p]of xr){let f=3-u-p;for(let d of[-1,1])for(let m of[-1,1]){if(c(u,d)||c(p,m))continue;let h=u===1&&d>0||p===1&&m>0,g=u===1&&d<0||p===1&&m<0,v=h?a.cima:g?a.fondo:a.lato,b=r?He(v,pi,r):v,x=[0,0,0];x[u]=d,x[p]=m,i.quad(Ye(e,o,t,u,d*l,p,m*s,f,-s),Ye(e,o,t,u,d*s,p,m*l,f,-s),Ye(e,o,t,u,d*s,p,m*l,f,+s),Ye(e,o,t,u,d*l,p,m*s,f,+s),b,x)}}for(let u of[-1,1])for(let p of[-1,1])for(let f of[-1,1])c(0,u)||c(1,p)||c(2,f)||i.tri([e+u*l,o+p*s,t+f*s],[e+u*s,o+p*l,t+f*s],[e+u*s,o+p*s,t+f*l],r?He(p>0?a.cima:a.fondo,pi,r):p>0?a.cima:a.fondo,[u,p,f])}function mi(i,e,o,t,a,n){let r=(d,m)=>n(d,0,m),s=n(0,-1,0),l=a.cima,c=a.lato,u=a.fondo,p=a.orlo??a.cima,f=(d,m,h)=>[e+d*Ct,o+m*Ct,t+h*Ct];s||i.quad(f(-8,-9,-8),f(8,-9,-8),f(8,-9,8),f(-8,-9,8),u,[0,-1,0]);for(let[d,m]of Er){if(r(d,m))continue;let h=-m,g=d,v=(x,A,E)=>f(x*d+E*h,A,x*m+E*g),b=[d,0,m];s||i.quad(v(8,-9,-8),v(9,-8,-8),v(9,-8,8),v(8,-9,8),u,[d,-1,m]),i.quad(v(9,-8,-8),v(9,2,-8),v(9,2,8),v(9,-8,8),c,b),i.quad(v(9,2,-8),v(10,3,-8),v(10,3,8),v(9,2,8),p,b),i.quad(v(10,3,-8),v(10,7,-8),v(10,7,8),v(10,3,8),p,b),i.quad(v(10,7,-8),v(9,8,-8),v(9,8,8),v(10,7,8),l,[d,1,m]),i.quad(v(8,8,-8),v(9,8,-8),v(9,8,8),v(8,8,8),l,[0,1,0])}for(let d of[-1,1])for(let m of[-1,1]){if(r(d,0)||r(0,m))continue;let h=(v,b,x)=>f(v*d,b,x*m),g=[d,0,m];s||i.tri(h(9,-8,8),h(8,-9,8),h(8,-8,9),u,[d,-1,m]),i.quad(h(9,-8,8),h(8,-8,9),h(8,2,9),h(9,2,8),c,g),i.quad(h(9,2,8),h(8,2,9),h(8,3,10),h(10,3,8),p,g),i.quad(h(10,3,8),h(8,3,10),h(8,7,10),h(10,7,8),p,g),i.quad(h(10,7,8),h(8,7,10),h(8,8,9),h(9,8,8),l,[d,1,m]),i.tri(h(8,8,8),h(9,8,8),h(8,8,9),l,[0,1,0])}i.quad(f(-8,8,-8),f(8,8,-8),f(8,8,8),f(-8,8,8),l,[0,1,0])}ie();ie();var Ar=2,St=6,zr=256;function hi(i){if(!i)return!1;let e=q(i);return!e.acqua&&!e.vetro&&!We.has(e.forma)}function vi(i,e,o,t){let a=e.indexOf(","),n=+e.slice(0,a),r=+e.slice(a+1),s=n*T-St,l=r*T-St,c=T+2*St,u=t-o+1,p=c,f=c*u*p,d=new Uint8Array(f),m=new Uint8Array(f),h=new Uint8Array(f),g=(E,M,O)=>((E-s)*u+(M-o))*p+(O-l),v=(E,M,O)=>E>=s&&E<s+c&&M>=o&&M<=t&&O>=l&&O<l+p,b=[];for(let E=s;E<s+c;E++)for(let M=l;M<l+p;M++){let O=!1;for(let w=t;w>=o;w--){let L=i.tipo(E,w,M),I=g(E,w,M);if(hi(L)){h[I]=1,O=!0;continue}if(!O&&w===t){for(let P=t+1;P<zr&&P<t+40;P++)if(hi(i.tipo(E,P,M))){O=!0;break}}if(O||(d[I]=15),L){let P=q(L);P.luce&&b.push([E,w+Math.round(P.luce.quota??0),M])}}}let x=[];for(let E=0;E<f;E++)d[E]===15&&x.push(E);gi(x,d,h,c,u,p,1);let A=[];for(let[E,M,O]of b){if(!v(E,M,O))continue;let w=g(E,M,O);m[w]=15,A.push(w)}return gi(A,m,h,c,u,p,Ar),{x0:s,z0:l,yMin:o,yMax:t,W:c,H:u,D:p,cielo:d,blocco:m,leggi(E,M,O){if(!v(E,M,O))return M>t?[15,0]:[0,0];let w=g(E,M,O);return[d[w],m[w]]}}}function gi(i,e,o,t,a,n,r){let s=[a*n,-a*n,n,-n,1,-1],l=0;for(;l<i.length;){let c=i[l++],u=e[c]-r;if(u<=0)continue;let p=Math.floor(c/(a*n)),f=Math.floor(c/n)%a,d=c%n;for(let m=0;m<6;m++){if(m===0&&p===t-1||m===1&&p===0||m===2&&f===a-1||m===3&&f===0||m===4&&d===n-1||m===5&&d===0)continue;let h=c+s[m];o[h]||e[h]>=u||(e[h]=u,i.push(h))}}}var bi=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function Ne(i,e,o){let t=i*374761393+e*668265263+o*1442695041|0;return t=Math.imul(t^t>>>13,1274126177),((t^t>>>16)>>>0)/4294967296}var co=class{constructor(e,o=512){this.yBase=e,this.byte=new Uint8Array(o*12),this.n=0}_lamella(e,o,t,a,n,r,s,l,c,u=0,p=8){if((this.n+1)*12>this.byte.length){let m=new Uint8Array(this.byte.length*2);m.set(this.byte),this.byte=m}let f=this.n*12,d=this.byte;d[f]=e,d[f+1]=o,d[f+2]=t,d[f+3]=a,d[f+4]=n>>16&255,d[f+5]=n>>8&255,d[f+6]=n&255,d[f+7]=(r&15)<<2,d[f+8]=Math.max(1,Math.min(255,s)),d[f+9]=Math.max(1,Math.min(255,l)),d[f+10]=Math.max(0,Math.min(255,c+128)),d[f+11]=u&15|(p&15)<<4,this.n++}ciuffo(e,o,t,a,n,r,s,l=1,c=0){let u=bi[Math.floor(Ne(e,t,3)*bi.length)],p=Math.max(1,Math.round(u.n*l*(.82+.36*Ne(e,t,5)))),f=o+1-this.yBase;if(f<0||f*8>247)return 0;for(let d=0;d<p;d++){let m=Ne(e,t,d*17+5),h=Ne(e,t,d*17+11),g=Ne(e,t,d*17+41),v=Ne(e,t,d*17+59),b=Math.min(.98,.66+u.apri),x=e+.5+(m-.5)*b,A=t+.5+(h-.5)*b,E=Math.min(.8,u.alto*(.62+.8*Ne(e,t,d*17+71))*(.5+.6*Math.pow(g,1.5))),M=u.largo*(.8+.4*v),O=(Ne(e,t,d*17+83)-.5)*.5,w=Ne(e,t,d*17+89),L=w<.15?.9+.03*w:w>.85?1.07+.03*(w-.85):.97+.06*(w-.15)/.7,I=Math.max(0,Math.min(128,Math.round((x-a)*8))),P=Math.max(0,Math.min(128,Math.round((A-n)*8))),C=Math.floor(Ne(e,t,d*17+97)*255);this._lamella(I,P,Math.round(f*8),C,r,s,Math.round(E*64),Math.round(M*128),Math.round(O*128),c,Math.round((L-.9)/.2*15))}return p}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var lt=64,Mr=[[1,0,0,fe(1,0,0),0,1],[-1,0,0,fe(-1,0,0),0,-1],[0,1,0,fe(0,1,0),1,1],[0,-1,0,fe(0,-1,0),1,-1],[0,0,1,fe(0,0,1),2,1],[0,0,-1,fe(0,0,-1),2,-1]],xi=(i,e,o)=>((e+1)*3+(o+1))*3+(i+1),Qo=class{constructor(e,o,t,a,n){this.c=e,this.ox=o,this.oz=t,this._materia=0,this.luceDi=a,this.aria=n,this._cielo=15,this._cella=null}materia(e){this._materia=e|0}cella(e,o,t){this._cella=[e,o,t]}_cieloFaccia(e){let[o,t,a]=this._cella,n=-1;for(let r=0;r<3;r++){if(!e[r])continue;let s=this.luceDi(o+(r===0?e[0]:0),t+(r===1?e[1]:0),a+(r===2?e[2]:0))[0];s>n&&(n=s)}return n<0?this.luceDi(o,t+1,a)[0]:n}_bloccoVertice(e,o){let t=Math.hypot(o[0],o[1],o[2])||1,a=e[0]+o[0]/t*.5,n=e[1]+o[1]/t*.5,r=e[2]+o[2]/t*.5,s=0,l=0;for(let c of[-.45,.45])for(let u of[-.45,.45])for(let p of[-.45,.45]){let f=Math.floor(a+c),d=Math.floor(n+u),m=Math.floor(r+p);this.aria(f,d,m)&&(s+=this.luceDi(f,d,m)[1],l++)}return l?Math.round(s/l):0}_v(e,o,t,a){return[e[0]-this.ox,e[1]+lt,e[2]-this.oz,o,this._cielo,this._bloccoVertice(e,a),t,0,this._materia]}_giro(e,o,t,a){let n=o[0]-e[0],r=o[1]-e[1],s=o[2]-e[2],l=t[0]-e[0],c=t[1]-e[1],u=t[2]-e[2],p=r*u-s*c,f=s*l-n*u,d=n*c-r*l;return p*a[0]+f*a[1]+d*a[2]<0}tri(e,o,t,a,n){if(this._giro(e,o,t,n)){let s=o;o=t,t=s}let r=fe(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(e,r,a,n),this._v(o,r,a,n),this._v(t,r,a,n),this._v(t,r,a,n))}quad(e,o,t,a,n,r){let s=fe(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(e,o,t,r)){let l=o;o=a,a=l}this.c.quadDa(this._v(e,s,n,r),this._v(o,s,n,r),this._v(t,s,n,r),this._v(a,s,n,r))}};function lo(i){if(!i)return!1;let e=q(i);return!e.acqua&&!e.vetro&&!We.has(e.forma)}function Ei(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function Ai(i,e,{erba:o=2,luce:t=!0}={}){let a=e.indexOf(","),n=+e.slice(0,a),r=+e.slice(a+1),s=n*T,l=r*T,c=new Mt(1024),u=new Mt(64),p=-1/0,f=new Int16Array(T*T).fill(-1),d=new Int16Array(T*T).fill(-1),m=new Int16Array(T*T).fill(-1),h=[],g=255,v=0,b=1/0,x=-1/0;i.perOgniDelChunk(e,(C,y)=>{y<b&&(b=y),y>x&&(x=y)});let A=t&&b<=x?vi(i,e,b-2,x+3):null,E=new co(Number.isFinite(b)?b:0),M=(C,y,_)=>A?A.leggi(C,y,_):[15,0],O=new Qo(c,s,l,M,(C,y,_)=>!lo(i.tipo(C,y,_))),w=new Uint8Array(27),L=(C,y,_,U,D,Z,R,H)=>[C-s,y+lt,_-l,U,Z,R,D,H?1:0,0],I=(C,y,_)=>Ei(i.tipo(C,y,_))||(i.bagnate?i.bagnata(C,y,_)!==null:!1);return i.perOgniDelChunk(e,(C,y,_,U)=>{let D=q(U),Z=i.bagnate?i.bagnata(C,y,_):null;if(D.forma==="modello"&&D.modello==="albero")for(let B=-2;B<=2;B++)for(let $=-2;$<=2;$++){let W=B*B+$*$;if(W>4)continue;let te=C+B-s,Ce=_+$-l;if(te<0||te>=T||Ce<0||Ce>=T)continue;let ce=te*T+Ce,J=y+(W===0?4:W<=2?3:2);J>f[ce]&&(f[ce]=J)}if(D.forma==="modello"){let B=C-s,$=_-l;if(B>=0&&B<T&&$>=0&&$<T){let W=B*T+$,te=y+Math.max(1,Math.round(D.altezza||1));te>m[W]&&(m[W]=te)}}if(D.luce&&h.push([C,y,_,U]),We.has(D.forma)&&Z===null)return;let R=Ei(U)||Z!==null,H=y+lt;if(H<0||H>254)return;let de=(C-s)*T+(_-l);!R&&y>f[de]&&(f[de]=y),!R&&lo(U)&&y>d[de]&&(d[de]=y);let ae=to(Z!==null?"acqua":Ke(U),y);D.motivo&&(ae=ni(ae,D.motivo,D.motivoForza??1,C,y,_));let be=si(D);be&&(ae={...ae,cima:He(ae.cima,be),lato:He(ae.lato,be),fondo:He(ae.fondo,be)},ae.facce&&(ae.facce=ae.facce.map(B=>B==null?B:He(B,be))));let At=be?ci(D.materia):0;if(!R){w.fill(0);for(let ce=-1;ce<=1;ce++)for(let J=-1;J<=1;J++)for(let le=-1;le<=1;le++)le===0&&ce===0&&J===0||lo(i.tipo(C+le,y+ce,_+J))&&(w[xi(le,ce,J)]=1);let B=(ce,J,le)=>w[xi(ce,J,le)]===1;O.materia(At),O.cella(C,y,_);let $=C+.5,W=y+.5,te=_+.5,Ce=D.forma&&fi[D.forma];Ce?Ce(O,$,W,te,ae,()=>!1):D.cappello&&!B(0,1,0)?mi(O,$,W,te,ae,B):di(O,$,W,te,ae,(J,le,V)=>B(J,le,V)?le!==0?!0:!q(i.tipo(C+J,y,_+V)).cappello||B(J,1,V):!1,be?be.orlo:0),H-1<g&&(g=H-1),H+2>v&&(v=H+2)}let Fe=0,at=0;if(R)for(at=Math.max(0,Math.min(15,Z!==null?Z:Me(U)||0));Fe<15&&I(C,y-1-Fe,_);)Fe++;let Nn=(B,$)=>{if(!I(B,y,$))return-1;let W=0;for(;W<15&&I(B,y-1-W,$);)W++;return W},$t=(B,$)=>{let W=0,te=0;for(let Ce of[B-1,B])for(let ce of[$-1,$]){let J=Nn(Ce,ce);J>=0&&(W+=J,te++)}return te?Math.round(W/te):Fe};if(R)for(let[B,$,W,te,Ce,ce]of Mr){let J=i.tipo(C+B,y+$,_+W);if(I(C+B,y+$,_+W)||J&&lo(J))continue;let le=Ue(ae,Ce,ce),V=C,G=y,Y=_,Se,Le,Oe,Ie;if(B===1?(Se=[V+1,G,Y],Le=[V+1,G+1,Y],Oe=[V+1,G+1,Y+1],Ie=[V+1,G,Y+1]):B===-1?(Se=[V,G,Y+1],Le=[V,G+1,Y+1],Oe=[V,G+1,Y],Ie=[V,G,Y]):$===1?(Se=[V,G+1,Y],Le=[V,G+1,Y+1],Oe=[V+1,G+1,Y+1],Ie=[V+1,G+1,Y]):$===-1?(Se=[V,G,Y+1],Le=[V,G,Y],Oe=[V+1,G,Y],Ie=[V+1,G,Y+1]):W===1?(Se=[V+1,G,Y+1],Le=[V+1,G+1,Y+1],Oe=[V,G+1,Y+1],Ie=[V,G,Y+1]):(Se=[V,G,Y],Le=[V,G+1,Y],Oe=[V+1,G+1,Y],Ie=[V+1,G,Y]),$===1){let Sa=y+(15-2*at)/16;Sa>p&&(p=Sa)}u.quadDa(L(...Se,te,le,$t(Se[0],Se[2]),at,Se[1]===G+1),L(...Le,te,le,$t(Le[0],Le[2]),at,Le[1]===G+1),L(...Oe,te,le,$t(Oe[0],Oe[2]),at,Oe[1]===G+1),L(...Ie,te,le,$t(Ie[0],Ie[2]),at,Ie[1]===G+1)),H<g&&(g=H),H+1>v&&(v=H+1)}if(D.cappello&&o>0&&!i.tipo(C,y+1,_)){let[B,$]=M(C,y+1,_);E.ciuffo(C,y,_,s,l,ae.cima,B,o/2,$),y+2+lt>v&&(v=y+2+lt)}}),g>v&&(g=0,v=0),{...c.dati(),minY:g,maxY:v,y0:-lt,cx:n,cz:r,altezze:f,solide:d,impronte:m,luci:h,acqua:{...u.dati(),pelo:p===-1/0?null:p},erba:E.dati()}}var uo=6,fo=class{constructor(e,o,t,{erba:a=8,raggioResa:n=96,budgetMs:r=5,lavoro:s=null}={}){this.mondo=e,this.resa=o,this.erba=a,this.raggioResa=n,this.budgetMs=r,this.lavoro=s,this._marca=new Map,this._vuoti=new Set,this.frontiera=new so(e,t,{margineGenera:2*T,margineTieni:5*T,onGenerato:(l,c,u)=>{for(let p=-1;p<=1;p++)for(let f=-1;f<=1;f++){if(!p&&!f)continue;let d=c+p+","+(u+f);this.resa.chunks.has(d)&&(this.coda.add(d),this.statistiche.rifattiPerLuce++)}}}),this.coda=new Set,this.statistiche={inCoda:0,costruiti:0,scaricati:0,ultimaMs:0,chunk:0,inVolo:0,rifattiPerLuce:0},this._ordine=[]}avvio(e,o){this.frontiera.assicura(e,o,{resa:this.raggioResa},{subito:!0}),this.aggiorna(e,o,1/0)}tocca(e,o){for(let t of[-uo,0,uo])for(let a of[-uo,0,uo])this.coda.add(Math.floor((e+t)/T)+","+Math.floor((o+a)/T))}aggiorna(e,o,t=this.budgetMs){let a=performance.now(),n=this.mondo,r=this.resa;this.frontiera.assicura(e,o,{resa:this.raggioResa});for(let s of n.sporchi)this.coda.add(s),this._vuoti.delete(s);n.sporchi.clear();for(let s of n.sporchiAcqua)this.coda.add(s);n.sporchiAcqua.clear();for(let s of n.generati)!r.chunks.has(s)&&!this._vuoti.has(s)&&!(this.lavoro&&this.lavoro.inVolo.has(s))&&this.coda.add(s);for(let s of[...r.chunks.keys()])n.generati.has(s)||(r.rimuovi(s),this.coda.delete(s),this.statistiche.scaricati++);if(this.coda.size){let s=this._ordine;s.length=0;for(let c of this.coda){let u=Tr(c,e,o);u<=this.raggioResa+T&&s.push([u,c])}s.sort((c,u)=>c[0]-u[0]);let l=0;this._vicini=s.length;for(let[,c]of s){if(!this.lavoro&&l>0&&performance.now()-a>t||this.lavoro&&this.lavoro.vivo&&this.lavoro.liberi===0)break;if(!(this.lavoro&&this.lavoro.vivo&&this.lavoro.inVolo.has(c))&&(this.coda.delete(c),!!n.generati.has(c))){if(!n.chunks.has(c)){r.chunks.has(c)&&r.rimuovi(c),this._vuoti.add(c),this._vicini--;continue}if(this.lavoro&&this.lavoro.vivo&&t!==1/0){let u=(this._marca.get(c)||0)+1;this._marca.set(c,u),this.lavoro.manda(n,c,this.erba,u)===null&&r.chunks.has(c)&&r.rimuovi(c),l++;continue}r.carica(c,Ai(n,c,{erba:this.erba})),l++,this.statistiche.costruiti++}}this._vicini-=l}else this._vicini=0;if(this.lavoro&&this.lavoro.vivo){for(let{kc:s,dati:l,marca:c}of this.lavoro.raccogli())if(n.generati.has(s)){if(this._marca.get(s)!==c){this.coda.add(s);continue}this.coda.has(s)||(r.carica(s,l),this.statistiche.costruiti++)}this.statistiche.inVolo=this.lavoro.inVolo.size}this.statistiche.inCoda=this._vicini,this.statistiche.ultimaMs=performance.now()-a,this.statistiche.chunk=r.chunks.size}};function Tr(i,e,o){let t=i.indexOf(",");return Math.hypot(+i.slice(0,t)*T+T/2-e,+i.slice(t+1)*T+T/2-o)}var po=class{constructor(e,{alpha:o=0,beta:t=-.25,sensibilita:a=.0042}={}){this.alpha=o,this.beta=t,this.sensibilita=a,this.trascinato=0,this.fermo=!1,this.attivo=null,e.addEventListener("pointerdown",r=>{if(this.attivo===null){this.attivo=r.pointerId,this.trascinato=0,this._x=r.clientX,this._y=r.clientY;try{e.setPointerCapture(r.pointerId)}catch{}}}),e.addEventListener("pointermove",r=>{if(document.pointerLockElement===e){this._gira(r.movementX,r.movementY);return}if(r.pointerId!==this.attivo)return;let s=r.clientX-this._x,l=r.clientY-this._y;this._x=r.clientX,this._y=r.clientY,!this.fermo&&(this.trascinato+=Math.hypot(s,l),this._gira(s,l))});let n=r=>{r.pointerId===this.attivo&&(this.attivo=null)};e.addEventListener("pointerup",n),e.addEventListener("pointercancel",n),window.addEventListener("keydown",r=>{r.code==="KeyL"&&!/^(INPUT|TEXTAREA)$/.test(r.target&&r.target.tagName)&&(document.pointerLockElement===e?document.exitPointerLock():e.requestPointerLock&&e.requestPointerLock())})}_gira(e,o){this.alpha+=e*this.sensibilita,this.beta=Math.max(-1.45,Math.min(1.45,this.beta-o*this.sensibilita))}verso(){let e=Math.cos(this.beta);return[e*Math.sin(this.alpha),Math.sin(this.beta),-e*Math.cos(this.alpha)]}avantiPiano(){return{x:Math.sin(this.alpha),z:-Math.cos(this.alpha)}}};ie();var Qe=1/60,zi=4,Mi=26,Jo=.32,Ti=.92,_i=.995,_r=.06,yr=20,ut=.5,Cr=2.4,Sr=.9,mo=class{constructor(e){this.mondo=e,this.lista=[],this._resto=0,this.statistiche={corpi:0,svegli:0,passi:0},this._griglia=new Map}aggiungi({x:e,y:o,z:t,vx:a=0,vy:n=0,vz:r=0,lato:s=.5,colore:l=[1,1,1],giro:c=0}){let u={x:e,y:o,z:t,vx:a,vy:n,vz:r,lato:s,colore:l,giro:c,aTerra:!1,sonno:0,dorme:!1,inAcqua:!1,sommerso:0};return this.lista.push(u),u}svuota(){this.lista.length=0}avanza(e){this._resto+=e;let o=0;for(;this._resto>=Qe&&o<zi;)this._passo(),this._resto-=Qe,o++;return this._resto>Qe*zi&&(this._resto=0),this.statistiche.passi+=o,o}_solido(e,o,t){return this.mondo.solido(Math.floor(e),Math.floor(o),Math.floor(t))}_urta(e,o,t,a){let n=a-.001;for(let r of[-n,n])for(let s of[-n,n])if(this._solido(e+r,o-n,t+s)||this._solido(e+r,o+n,t+s))return!0;return!1}_sommerso(e,o){let t=this.mondo;if(!t.tipo)return 0;let a=Math.floor(e.x),n=Math.floor(e.z),r=Math.floor(e.y+o),s=Math.floor(e.y-o)-1;for(let l=r;l>=s;l--){let c=t.tipo(a,l,n);if(!c)continue;let u=q(c);if(!u||!u.acqua)continue;let p=l+(15-2*(Me(c)||0))/16;return Math.max(0,Math.min(1,(p-(e.y-o))/(2*o)))}return 0}_passo(){let e=this.lista,o=0;for(let t of e){if(t.dorme)continue;o++;let a=t.lato/2;t.vy-=Mi*Qe;let n=this._sommerso(t,a);if(t.inAcqua=n>.02,t.sommerso=n,t.inAcqua){t.vy+=Mi*Cr*n*Qe;let p=1-(1-Sr)*n;t.vx*=p,t.vy*=p,t.vz*=p}let r=Math.max(Math.abs(t.vx),Math.abs(t.vy),Math.abs(t.vz))*Qe,s=Math.max(1,Math.ceil(r/(a*.9))),l=Qe/s,c=!1;for(let p=0;p<s;p++){let f=t.x+t.vx*l;t.vx!==0&&(this._urta(f,t.y,t.z,a)&&(t.vx=-t.vx*Jo,f=t.x),t.x=f);let d=t.z+t.vz*l;t.vz!==0&&(this._urta(t.x,t.y,d,a)&&(t.vz=-t.vz*Jo,d=t.z),t.z=d);let m=t.y+t.vy*l;this._urta(t.x,m,t.z,a)?t.vy<0?(t.y=Math.floor(m-a+.001)+1+a,c=!0,t.vy=Math.abs(t.vy)>3?-t.vy*Jo:0):t.vy=0:t.y=m}t.aTerra=c||t.vy<=0&&this._urta(t.x,t.y-.02,t.z,a),t.aTerra?(t.vx*=Ti,t.vz*=Ti,t.vy<0&&(t.vy=0)):(t.vx*=_i,t.vz*=_i);let u=Math.hypot(t.vx,t.vy,t.vz);(t.aTerra||t.inAcqua)&&u<_r?(t.vx=t.vz=0,t.inAcqua&&(t.vy=0),++t.sonno>=yr&&(t.dorme=!0)):t.sonno=0}this._vicini(),this.statistiche.corpi=e.length,this.statistiche.svegli=o}_vicini(){let e=this._griglia;e.clear();let o=this.lista,t=(a,n)=>a+32768<<16|n+32768;for(let a=0;a<o.length;a++){let n=o[a],r=t(Math.floor(n.x),Math.floor(n.z)),s=e.get(r);s||(s=[],e.set(r,s)),s.push(a)}for(let a=0;a<o.length;a++){let n=o[a],r=Math.floor(n.x),s=Math.floor(n.z);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let u=e.get(t(r+l,s+c));if(u)for(let p of u){if(p<=a)continue;let f=o[p];if(n.dorme&&f.dorme)continue;let d=(n.lato+f.lato)/2,m=d-Math.abs(n.x-f.x);if(m<=0)continue;let h=d-Math.abs(n.y-f.y);if(h<=0)continue;let g=d-Math.abs(n.z-f.z);if(!(g<=0)){if(m<=h&&m<=g){let v=Math.sign(n.x-f.x)||1;n.x+=v*m*ut,f.x-=v*m*ut}else if(h<=g)(Math.sign(n.y-f.y)||1)>0?(n.y+=h*ut,n.vy<0&&(n.vy=0)):(f.y+=h*ut,f.vy<0&&(f.vy=0));else{let v=Math.sign(n.z-f.z)||1;n.z+=v*g*ut,f.z-=v*g*ut}n.dorme&&(n.dorme=!1,n.sonno=0),f.dorme&&(f.dorme=!1,f.sonno=0)}}}}}istanze(e=null){let o=this.lista.length;(!e||e.length!==o*8)&&(e=new Float32Array(o*8));for(let t=0;t<o;t++){let a=this.lista[t],n=t*8;e[n]=a.x,e[n+1]=a.y-a.lato/2,e[n+2]=a.z,e[n+3]=a.lato,e[n+4]=a.colore[0],e[n+5]=a.colore[1],e[n+6]=a.colore[2],e[n+7]=a.giro}return e}};ie();Ot();var Rr=256,xe=8,Ci=16,Si=(i,e)=>i+","+e,oa=(i,e,o)=>i+","+e+","+o,go=class{constructor({varia:e=!0}={}){this.varia=e,this._n=Rr,this._dati=new Float32Array(this._n*xe),this._id=new Int32Array(this._n),this._tipo=new Array(this._n).fill(null),this._slot=new Map,this._liberi=[],this._primo=0,this._prossimoId=1,this._perTipo=new Map,this._perChunk=new Map,this._chunk=new Map,this._perCella=new Map,this._cella=new Map,this._meta=new Map,this._nome=new Map,this.sporchi=new Set}_cresci(){let e=this._n*2,o=new Float32Array(e*xe);o.set(this._dati);let t=new Int32Array(e);t.set(this._id),this._dati=o,this._id=t,this._tipo.length=e,this._tipo.fill(null,this._n),this._n=e}_prendiSlot(){return this._liberi.length?this._liberi.pop():(this._primo>=this._n&&this._cresci(),this._primo++)}aggiungi(e,o,t,a,{giro:n,scala:r,tinta:s,nome:l,dati:c,cella:u}={}){let p=this._prendiSlot(),f=this._prossimoId++;this._id[p]=f,this._slot.set(f,p),this._tipo[p]=e;let d=u?ho(e,u[0],u[1],u[2],this.varia):{scala:1,giro:0,tinta:[1,1,1]},m=p*xe;this._dati[m]=o,this._dati[m+1]=t,this._dati[m+2]=a,this._dati[m+3]=r??d.scala;let h=s||d.tinta;this._dati[m+4]=h[0],this._dati[m+5]=h[1],this._dati[m+6]=h[2],this._dati[m+7]=n??d.giro;let g=this._perTipo.get(e);if(g||(g=new Set,this._perTipo.set(e,g)),g.add(p),this._indicizza(p,o,a),u){let v=oa(u[0],u[1],u[2]);this._perCella.set(v,p),this._cella.set(p,v)}return l&&this._nome.set(p,l),c&&this._meta.set(p,{...c}),this.sporchi.add(e),f}togli(e){let o=this._slot.get(e);if(o===void 0)return!1;let t=this._tipo[o];this._perTipo.get(t).delete(o),this._sfila(o);let a=this._cella.get(o);return a!==void 0&&(this._perCella.delete(a),this._cella.delete(o)),this._meta.delete(o),this._nome.delete(o),this._slot.delete(e),this._id[o]=0,this._tipo[o]=null,this._liberi.push(o),this.sporchi.add(t),!0}_chunkDi(e,o){return Si(Math.floor(e/Ci),Math.floor(o/Ci))}_indicizza(e,o,t){let a=this._chunkDi(o,t),n=this._perChunk.get(a);n||(n=new Set,this._perChunk.set(a,n)),n.add(e),this._chunk.set(e,a)}_sfila(e){let o=this._chunk.get(e);if(o===void 0)return;let t=this._perChunk.get(o);t&&(t.delete(e),t.size||this._perChunk.delete(o)),this._chunk.delete(e)}nelChunk(e,o){let t=this._perChunk.get(Si(e,o));return t?[...t].map(a=>this._id[a]):[]}leggi(e){let o=this._slot.get(e);if(o===void 0)return null;let t=o*xe;return{id:e,tipo:this._tipo[o],x:this._dati[t],y:this._dati[t+1],z:this._dati[t+2],scala:this._dati[t+3],tinta:[this._dati[t+4],this._dati[t+5],this._dati[t+6]],giro:this._dati[t+7],nome:this._nome.get(o)||null,dati:this._meta.get(o)||null}}posa(e,{x:o,y:t,z:a,giro:n,scala:r,tinta:s}={}){let l=this._slot.get(e);if(l===void 0)return!1;let c=l*xe,u=o!==void 0||a!==void 0;return o!==void 0&&(this._dati[c]=o),t!==void 0&&(this._dati[c+1]=t),a!==void 0&&(this._dati[c+2]=a),r!==void 0&&(this._dati[c+3]=r),s&&(this._dati[c+4]=s[0],this._dati[c+5]=s[1],this._dati[c+6]=s[2]),n!==void 0&&(this._dati[c+7]=n),u&&(this._sfila(l),this._indicizza(l,this._dati[c],this._dati[c+2])),this.sporchi.add(this._tipo[l]),!0}metadati(e,o){let t=this._slot.get(e);return t===void 0?null:(o&&this._meta.set(t,{...this._meta.get(t)||{},...o}),this._meta.get(t)||null)}battezza(e,o){let t=this._slot.get(e);return t===void 0?!1:(o?this._nome.set(t,o):this._nome.delete(t),!0)}evento(e){let[o,t,a]=e.cella;if(e.tipo==="metti"){let n=q(e.blocco);if(!n||n.forma!=="modello"||!n.modello)return;this._dallaCella(o,t,a),this.aggiungi(n.modello,o+.5,t,a+.5,{cella:[o,t,a]})}else e.tipo==="togli"&&this._dallaCella(o,t,a)}_dallaCella(e,o,t){let a=this._perCella.get(oa(e,o,t));a!==void 0&&this.togli(this._id[a])}idInCella(e,o,t){let a=this._perCella.get(oa(e,o,t));return a===void 0?null:this._id[a]}cambiate(){let e=[];for(let o of this.sporchi){let t=this._perTipo.get(o),a=new Float32Array((t?t.size:0)*xe),n=0;if(t)for(let r of t)a.set(this._dati.subarray(r*xe,r*xe+xe),n),n+=xe;e.push([o,a])}return this.sporchi.clear(),e}get conta(){return this._slot.size}quante(e){let o=this._perTipo.get(e);return o?o.size:0}tutte(){return[...this._slot.keys()]}tipiVivi(){return this._perTipo.keys()}ognunaDi(e,o){let t=this._perTipo.get(e);if(t)for(let a of t){let n=a*xe;o(this._dati[n],this._dati[n+1],this._dati[n+2],this._id[a],this._dati[n+3],this._dati[n+7])}}perTipo(){let e=[];for(let[o,t]of this._perTipo)t.size&&e.push([o,t.size]);return e.sort((o,t)=>o[0].localeCompare(t[0])),e}serializza({tutto:e=!1}={}){let o=[];for(let[t,a]of this._slot){if(!e&&this._cella.has(a))continue;let n=a*xe,r={id:t,tipo:this._tipo[a],p:[this._dati[n],this._dati[n+1],this._dati[n+2]],s:this._dati[n+3],g:this._dati[n+7]},s=[this._dati[n+4],this._dati[n+5],this._dati[n+6]];(s[0]!==1||s[1]!==1||s[2]!==1)&&(r.t=s);let l=this._nome.get(a);l&&(r.n=l);let c=this._meta.get(a);c&&(r.m=c),o.push(r)}return{versione:1,entita:o}}deserializza(e){if(!e||e.versione!==1||!Array.isArray(e.entita))throw new Error("pacco di entit\xE0 non riconosciuto");let o=0;for(let t of e.entita)this.aggiungi(t.tipo,t.p[0],t.p[1],t.p[2],{giro:t.g,scala:t.s,tinta:t.t,nome:t.n,dati:t.m}),o++;return o}};ie();var Nr=4,wr=33,qr=26;function Li(i,e,o=0,t=!1,a=null,n=Nr){let r=e.indexOf(","),s=+e.slice(0,r),l=+e.slice(r+1),c=1/0,u=-1/0;if(i.perOgniDelChunk(e,(E,M)=>{M<c&&(c=M),M>u&&(u=M)}),c===1/0)return null;let p=s*T-n,f=l*T-n,d=c-wr,m=T+2*n,h=m,g=u+qr-d+1,v=new Uint16Array(m*g*h),b=[],x=new Map;for(let E=-1;E<=1;E++)for(let M=-1;M<=1;M++)i.perOgniDelChunk(s+E+","+(l+M),(O,w,L,I)=>{let P=O-p,C=w-d,y=L-f;if(P<0||P>=m||C<0||C>=g||y<0||y>=h)return;let _=x.get(I);_===void 0&&(_=b.push(I),x.set(I,_)),v[(P*g+C)*h+y]=_});let A={};for(let E of b){let M=Ke(E);M in A||(A[M]=re[M]||null)}return{kc:e,livello:o,soloAcqua:t,x0:p,y0:d,z0:f,nx:m,ny:g,nz:h,celle:v,tipi:b,defs:A,stagione:a||{corrente:ka(),mescolanza:Va()}}}var aa=class{constructor(e){this.operai=[],this.pronti=[],this.inVolo=new Map;for(let o=0;o<e;o++){let t=new Worker(new URL("./mesher-nucleo-worker.js",import.meta.url),{type:"module"}),a={w:t,occupato:null};t.onmessage=n=>{a.occupato=null,this.pronti.push(n.data)},t.onerror=n=>{console.warn("lavoro: un Worker si \xE8 fermato \u2014",n&&n.message),this.operai=this.operai.filter(r=>r!==a),a.occupato&&this.inVolo.delete(a.occupato);try{t.terminate()}catch{}},this.operai.push(a)}}get vivo(){return this.operai.length>0}get liberi(){return this.operai.filter(e=>!e.occupato).length}manda(e,o,t,a=0){let n=this.operai.find(s=>!s.occupato);if(!n)return!1;let r=Li(e,o,0,!1,null,St);return r?(r.erba=t,r.marca=a,n.occupato=o,this.inVolo.set(o,a),n.w.postMessage(r,[r.celle.buffer]),!0):null}raccogli(){let e=this.pronti;this.pronti=[];for(let o of e)this.inVolo.delete(o.kc);return e}};function Oi(i=null){if(typeof Worker!="function")return null;let e=i??Math.max(1,Math.min(3,(globalThis.navigator&&navigator.hardwareConcurrency||2)-1));try{let o=new aa(e);return o.vivo?o:null}catch(o){return console.warn("lavoro: niente Worker \u2014",o&&o.message),null}}var Pr=[[[0,0,1],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]],[[0,0,-1],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]],[[1,0,0],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]]],[[-1,0,0],[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]],[[0,1,0],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]],[[0,-1,0],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]]];function Ii(i,e){let o=i.perno||e,t=i.scala||[1,1,1],a=i.rot||[0,i.giro||0,0],[n,r]=[Math.cos(a[0]),Math.sin(a[0])],[s,l]=[Math.cos(a[1]),Math.sin(a[1])],[c,u]=[Math.cos(a[2]),Math.sin(a[2])],p=(f,d,m)=>{let h=d*n-m*r,g=d*r+m*n;d=h,m=g;let v=f*s+m*l;return g=-f*l+m*s,f=v,m=g,v=f*c-d*u,h=f*u+d*c,f=v,d=h,[f,d,m]};return{punto:f=>{let[d,m,h]=p((f[0]-o[0])*t[0],(f[1]-o[1])*t[1],(f[2]-o[2])*t[2]);return[d+o[0],m+o[1],h+o[2]]},normale:f=>{let[d,m,h]=p(f[0]/t[0],f[1]/t[1],f[2]/t[2]),g=Math.hypot(d,m,h)||1;return[d/g,m/g,h/g]}}}function Be(i){let e=[],o=(u,p,f,d,m,h)=>{let g=Ri(u,p,f);e.push([g[0]*d[0]+g[1]*d[1]+g[2]*d[2]<0?[u,f,p]:[u,p,f],d,m,h])};for(let u of i){let p=u.colore??16777215,f=u.materia|0;if(u.tornio){let g=u.lati||8,v=u.tornio,b=u.x||0,x=u.z||0,A=Math.min(...v.map(L=>L[1])),E=Math.max(...v.map(L=>L[1])),M=Ii(u,[b,(A+E)/2,x]),O=(L,I)=>{let P=[];for(let C=0;C<g;C++){let y=C/g*Math.PI*2+(u.fase||0);P.push([b+Math.cos(y)*L,I,x+Math.sin(y)*L])}return P},w=v.map(([L,I])=>O(L,I));for(let L=0;L+1<v.length;L++){let I=w[L],P=w[L+1];for(let C=0;C<g;C++){let y=(C+1)%g,_=I[C],U=I[y],D=P[y],Z=P[C];if(v[L][0]===0&&v[L+1][0]===0)continue;let R=(_[0]+U[0]+D[0]+Z[0])/4-b,H=(_[2]+U[2]+D[2]+Z[2])/4-x,de=Math.hypot(R,H)||1,ae=v[L+1][0]-v[L][0],be=v[L+1][1]-v[L][1],At=Math.hypot(ae,be)||1,Fe=[R/de*(be/At),-ae/At,H/de*(be/At)];v[L][0]>0&&v[L+1][0]>0?(o(_,U,D,Fe,p,f),o(_,D,Z,Fe,p,f)):v[L][0]>0?o(_,U,D,Fe,p,f):o(_,D,Z,Fe,p,f)}}if(v[0][0]>0&&!u.aperto){let L=w[0];for(let I=1;I+1<g;I++)o(L[0],L[I+1],L[I],[0,-1,0],p,f)}if(v[v.length-1][0]>0&&!u.aperto){let L=w[v.length-1];for(let I=1;I+1<g;I++)o(L[0],L[I],L[I+1],[0,1,0],p,f)}ia(e,M);continue}let d=[(u.da[0]+u.a[0])/2,(u.da[1]+u.a[1])/2,(u.da[2]+u.a[2])/2],m=Ii(u,d);if(u.piramide){let g=[[u.da[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.a[2]],[u.da[0],u.da[1],u.a[2]]],v=u.punta,b=[(u.da[0]+u.a[0])/2,u.da[1],(u.da[2]+u.a[2])/2];for(let x=0;x<4;x++){let A=g[x],E=g[(x+1)%4],M=Ri(A,v,E),O=[(A[0]+v[0]+E[0])/3-b[0],0,(A[2]+v[2]+E[2])/3-b[2]];o(A,v,E,M[0]*O[0]+M[2]*O[2]<0?[-M[0],-M[1],-M[2]]:M,p,f)}o(g[0],g[1],g[2],[0,-1,0],p,f),o(g[0],g[2],g[3],[0,-1,0],p,f),ia(e,m);continue}let h=g=>[g[0]?u.a[0]:u.da[0],g[1]?u.a[1]:u.da[1],g[2]?u.a[2]:u.da[2]];for(let[g,v]of Pr){let b=g[0]?0:g[1]?1:2;if(u.a[b]===u.da[b])continue;let x=v.map(h);o(x[0],x[1],x[2],g,p,f),o(x[0],x[2],x[3],g,p,f)}ia(e,m)}let t=e.length*3,a=new Uint8Array(t*20),n=new DataView(a.buffer),r=0,s=1/0,l=-1/0,c=0;for(let[u,p,f,d]of e)for(let m of u){let h=r*20;n.setFloat32(h,m[0],!0),n.setFloat32(h+4,m[1],!0),n.setFloat32(h+8,m[2],!0),a[h+12]=Math.round(p[0]*127)&255,a[h+13]=Math.round(p[1]*127)&255,a[h+14]=Math.round(p[2]*127)&255,a[h+15]=d,a[h+16]=f>>16&255,a[h+17]=f>>8&255,a[h+18]=f&255,a[h+19]=255,s=Math.min(s,m[1]),l=Math.max(l,m[1]),c=Math.max(c,Math.hypot(m[0],m[2])),r++}return{byte:a,vertici:t,triangoli:e.length,minY:s,maxY:l,raggio:c}}function ia(i,e){for(let o=i.length-1;o>=0;o--){let t=i[o];if(t[4])break;t[0]=t[0].map(e.punto),t[1]=e.normale(t[1]),t[4]=!0}}function Ri(i,e,o,t=null){let a=t?[o[0]-i[0],o[1]-i[1],o[2]-i[2]]:[e[0]-i[0],e[1]-i[1],e[2]-i[2]],n=t?[t[0]-e[0],t[1]-e[1],t[2]-e[2]]:[o[0]-i[0],o[1]-i[1],o[2]-i[2]],r=a[1]*n[2]-a[2]*n[1],s=a[2]*n[0]-a[0]*n[2],l=a[0]*n[1]-a[1]*n[0],c=Math.hypot(r,s,l)||1;return[r/c,s/c,l/c]}var j=(i,e,o,t,a,n,r,s={})=>({da:[i-t/2,e,o-n/2],a:[i+t/2,e+a,o+n/2],colore:r,...s}),pt=(i,e,o,t,a,n,r=0,s=0,l={})=>({piramide:!0,da:[i-t/2,e,o-t/2],a:[i+t/2,e,o+t/2],punta:[i+r,e+a,o+s],colore:n,...l}),X=(i,e,o,t,a={})=>({tornio:o,x:i,z:e,lati:8,colore:t,...a});ie();Ot();var vo={blu:{corpo:736622,pancia:533312,testa:431830,guance:691404,zampe:533312,orecchie:431830,dentro:3118826,occhi:16777215,pupille:727598,naso:533312,coda:736622},arancione:{corpo:14644537,pancia:13658672,testa:15901522,guance:15897452,zampe:16024454,orecchie:14644537,dentro:16024454,occhi:16777215,pupille:2759186,naso:16024454,coda:14644537}};function na(i=vo.blu,{zaino:e=!1}={}){let o=[X(0,.02,[[.14,0],[.27,.06],[.31,.24],[.28,.44],[.19,.58],[0,.62]],i.corpo,{fase:Math.PI/8,scala:[1,1,.82]}),X(-.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],i.zampe,{fase:Math.PI/8}),X(.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],i.zampe,{fase:Math.PI/8}),X(0,0,[[0,.52],[.3,.58],[.38,.74],[.36,.94],[.2,1.08],[0,1.11]],i.testa,{fase:Math.PI/8,scala:[1.12,1,.92]}),pt(-.22,1.02,0,.17,.36,i.orecchie,-.03,0,{rot:[0,0,.18]}),pt(.22,1.02,0,.17,.36,i.orecchie,.03,0,{rot:[0,0,-.18]}),pt(-.22,1.05,-.03,.1,.24,i.dentro,-.02,0,{rot:[0,0,.18]}),pt(.22,1.05,-.03,.1,.24,i.dentro,.02,0,{rot:[0,0,-.18]}),j(-.15,.74,-.352,.11,.15,.03,i.occhi),j(.15,.74,-.352,.11,.15,.03,i.occhi),j(-.115,.755,-.362,.032,.085,.02,i.pupille),j(.115,.755,-.362,.032,.085,.02,i.pupille),pt(0,.72,-.35,.06,-.05,i.naso,0,0,{rot:[Math.PI/2,0,0],perno:[0,.72,-.35]}),X(.2,.22,[[.05,.05],[.055,.4],[0,.46]],i.coda,{rot:[.35,0,-.35],perno:[.2,.05,.22]})];return e&&(o.push(j(.06,.8,.44,.3,.3,.16,13777723,{rot:[0,0,.15]})),o.push(j(.06,.88,.53,.12,.12,.02,9279656,{rot:[0,0,.15]})),o.push(j(.3,.04,-.22,.06,.36,.06,13777723,{rot:[0,0,-.25],perno:[.3,.04,-.22]}))),Be(o)}function Fr(){return Be([X(-.08,-.02,[[.08,0],[.065,.1],[.075,.2]],16108701),X(-.08,-.02,[[0,.17],[.2,.2],[.24,.28],[.17,.36],[0,.41]],13904952,{fase:Math.PI/8}),X(-.16,-.1,[[.05,.31],[.04,.34]],16183526),X(.02,.06,[[.045,.31],[.035,.34]],16183526),X(-.06,-.02,[[.04,.39],[.03,.42]],16183526),X(.18,.14,[[.05,0],[.045,.11]],16108701),X(.18,.14,[[0,.09],[.12,.11],[.11,.17],[0,.21]],6040869,{fase:Math.PI/8})])}function Dr(){return Be([j(0,.38,0,.92,.09,.44,15510096),j(0,.35,0,.98,.03,.5,14644537),j(-.36,0,0,.09,.36,.09,6040869),j(.36,0,0,.09,.36,.09,6040869)])}function Ur(){let t=[];for(let a=0;a<3;a++){let n=.33-a*.33,r=.24+a*.28;t.push(j(0,r,n,.9,.08,.33,15510096),j(0,r-.02,n,.94,.02,.37,14644537)),t.push(j(-.36,0,n,.07,r,.07,6040869),j(.36,0,n,.07,r,.07,6040869))}return Be(t)}function Br(){return Be([X(0,0,[[.025,0],[.02,.7]],3481626,{rot:[0,0,-.35],perno:[0,0,0]}),X(.24,0,[[.02,.66],[.012,1.31]],3481626,{rot:[0,0,-.62],perno:[.24,.66,0]}),X(0,0,[[.035,0],[.035,.26]],12597547,{rot:[0,0,-.35],perno:[0,0,0]}),X(0,0,[[.03,.4],[.065,.42],[.065,.5],[.03,.52]],9279656,{rot:[0,0,-.35],perno:[0,0,0],aperto:!0})])}function kr(){let t=[];return t.push(X(0,0,[[.19,.32],[.24,.32],[.24,.37],[.19,.37]],12597547,{aperto:!0})),t.push(X(0,0,[[.2,.33],[.14,.17],[.05,.05],[0,.02]],9079434,{aperto:!0})),t.push(X(0,.24,[[.03,.34],[.03,.96]],14251821,{rot:[-1.95,0,0],perno:[0,.34,.24]})),t.push(X(0,.24,[[.04,.96],[.04,1.1],[0,1.12]],12597547,{rot:[-1.95,0,0],perno:[0,.34,.24]})),Be(t)}function Vr(){return Be([j(0,.02,0,.44,.04,.3,10858432),j(0,.04,0,.5,.05,.34,12174291),j(0,.09,0,.42,.02,.28,10858432),j(0,.09,.05,.12,.1,.1,12174291),j(0,.19,.05,.09,.09,.09,13226719),X(0,.05,[[.06,0],[.06,.62],[0,.66]],14716975,{rot:[.95,0,0],perno:[0,.24,.05],lati:6,fase:Math.PI/6})])}function Gr(){let a={rot:[-Math.PI/2,0,0],perno:[0,.42,0]};return Be([X(0,0,[[.3,.42],[.26,.52],[.16,.66],[.12,.8]],14673648,{...a,aperto:!0}),X(0,0,[[.13,.66],[.13,.7]],1405880,{...a,aperto:!0}),X(0,0,[[.14,.8],[.14,.9],[0,.92]],1405880,a),X(0,0,[[.3,.42],[.22,.47],[0,.52]],14673648,a),j(0,.33,-.09,.14,.14,.06,2279664),j(0,0,.1,.1,.44,.1,1003407,{rot:[-.25,0,0],perno:[0,.44,.1]})])}var he={gatto:{nome:"Gatto (PNG)",costruisci:()=>na(vo.arancione,{zaino:!0}),colore:15968586},fungo:{nome:"Fungo",costruisci:Fr,colore:14170676},gradino:{nome:"Gradino",costruisci:Dr,colore:14916156},scala:{nome:"Scala",costruisci:Ur,colore:13206575},canna:{nome:"Canna da pesca",costruisci:Br,colore:12597547},retino:{nome:"Retino",costruisci:kr,colore:14251821},cazzuola:{nome:"Cazzuola",costruisci:Vr,colore:12174291},megafono:{nome:"Megafono",costruisci:Gr,colore:1405880}};function Ni(){for(let[i,e]of Object.entries(he))re[i]||$e(i,{nome:e.nome,forma:"modello",modello:i,solido:!1,calpestabile:!0,colore:e.colore}),ta(i,{nome:e.nome,modello:i,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1]});return Object.keys(he)}ie();var oe=4,bo=32;function wi(i,e,o){let t=[],a=e*T,n=o*T;for(let r=a;r<a+T;r++)for(let s=n;s<n+T;s++){if(r<-bo||r>=bo||s<-bo||s>=bo)continue;for(let c=oe-3;c<oe;c++)i.metti(r,c,s,"terra",!0);if(i.metti(r,oe,s,"erba",!0),r>=6&&r<18&&s>=-20&&s<-12&&(i.togli(r,oe,s,!0),i.metti(r,oe-1,s,"acqua",!0),i.metti(r,oe,s,"acqua",!0)),r>=-20&&r<-12&&s>=4&&s<12)for(let c=oe+1;c<=oe+(s-3);c++)i.metti(r,c,s,"pietra",!0);if(s===20&&r>=-24&&r<24){let c=Xa.filter(p=>p&&!Te[p]&&q(p).forma!=="modello"),u=Math.floor((r+24)/2);if((r+24)%2===0&&u<c.length)for(let p=oe+1;p<=oe+3;p++)i.metti(r,p,s,c[u],!0)}r===-4&&s>=-28&&s<28&&(s+28)%6===0&&t.push([r,oe+1,s,"lampione"]),r>=-28&&r<-8&&s>=-28&&s<-8&&(r*7+s*13)%11===0&&t.push([r,oe+1,s,"albero"]);let l=Object.keys(he);s===-4&&r>=0&&r<l.length*2&&r%2===0&&t.push([r,oe+1,s,l[r/2]]),s===8&&(r===18&&i.metti(r,oe+1,s,"lampadaRossa",!0),r===22&&i.metti(r,oe+1,s,"lampadaBlu",!0)),r===20&&(s===6&&i.metti(r,oe+1,s,"lampadaVerde",!0),s===10&&i.metti(r,oe+1,s,"lampadaPesante",!0))}return t}var Ee=12,$r=[[-7,6,-5,4,Ee],[-3,4,-4,0,Ee+1]],Xr=[1,3,2,3];function qi(i,e,[o,t,a,n]){return i>=o&&i<=t&&e>=a&&e<=n}function Pi(i,e,o){let t=[],a=e*T,n=o*T;for(let s=a;s<a+T;s++)for(let l=n;l<n+T;l++){let c=-1;for(let u of $r)qi(s,l,u)&&(c=Math.max(c,u[4]));if(!(c<0)){for(let u=c-3;u<c;u++)i.metti(s,u,l,"terra",!0);if(qi(s,l,Xr)){i.metti(s,c-1,l,"acqua",!0),i.metti(s,c,l,"acqua",!0);continue}i.metti(s,c,l,"erba",!0)}}let r=[[-5,Ee+1,-3,"albero"],[4,Ee+1,0,"lampione"],[-1,Ee+2,-2,"gatto"],[-2,Ee+1,2,"fungo"],[-3,Ee+1,3,"fungo"],[5,Ee+1,3,"canna"],[-6,Ee+1,2,"retino"],[0,Ee+1,4,"cazzuola"]];for(let s of r)s[0]>=a&&s[0]<a+T&&s[2]>=n&&s[2]<n+T&&t.push(s);return t}ie();var Hr=8,we={passoColonne:3,passoLampade:11,passoModelli:5,passoCanali:16,rilievo:7};function Je(i,e,o){let t=Math.imul(i|0,374761393)+Math.imul(e|0,668265263)+Math.imul(o|0,1442695041)|0;return t=Math.imul(t^t>>>13,1274126177),((t^t>>>16)>>>0)/4294967296}function Yr(){return Object.keys(re).filter(i=>{let e=q(i);return e&&!e.acqua&&e.forma!=="modello"}).sort()}function Zr(){return Object.keys(re).filter(i=>{let e=q(i);return e&&e.luce}).sort()}function jr(i,e){let o=Math.sin(i*.07)*Math.cos(e*.061),t=Math.sin((i+e)*.023)*.6;return Hr+Math.round((o+t)*we.rilievo*.5)}function Kr(i,e){let o=(i%we.passoCanali+we.passoCanali)%we.passoCanali,t=(e%we.passoCanali+we.passoCanali)%we.passoCanali;return o<3||t<3}function Fi(i,e,o){let t=[],a=e*T,n=o*T,r=Yr(),s=Zr(),l=Object.keys(he);for(let c=a;c<a+T;c++)for(let u=n;u<n+T;u++){let p=jr(c,u),f=Kr(c,u);for(let m=p-3;m<p;m++)i.metti(c,m,u,"terra",!0);if(f){i.metti(c,p-1,u,"sabbia",!0),i.metti(c,p,u,"acqua",!0);continue}if(i.metti(c,p,u,"erba",!0),Je(c,u,1)<1/we.passoColonne){let m=r[Math.floor(Je(c,u,2)*r.length)%r.length],h=1+Math.floor(Je(c,u,3)*5);for(let g=p+1;g<=p+h;g++)i.metti(c,g,u,m,!0);continue}if(s.length&&Je(c,u,4)<1/we.passoLampade){let m=s[Math.floor(Je(c,u,5)*s.length)%s.length];i.metti(c,p+1,u,m,!0);continue}if(Je(c,u,6)<1/we.passoModelli){let m=Je(c,u,7),h=m<.45?"albero":m<.7?"lampione":l[Math.floor(m*1e3)%l.length];t.push([c,p+1,u,h])}}return t}function Di(i,e=null){return{chiave:"resa",nome:"Resa del nucleo",nota:"Lo specchio e l'ombra si possono spegnere per misurare quanto costano: la grafica \xE8 la stessa ovunque, il \u{1FA7A} dice i fotogrammi.",campi:[{chiave:"ombra",nome:"ombra del sole (horizon mapping)",tipo:"interruttore",leggi:()=>!!i.ombra,scrivi:o=>i.ombra=!!o},{chiave:"specchio",nome:"specchio dell'acqua",tipo:"interruttore",leggi:()=>!!i.specchio.attivo,scrivi:o=>i.specchio.attivo=!!o},{chiave:"scalaSpecchio",nome:"risoluzione dello specchio",tipo:"numero",min:.2,max:1,passo:.05,leggi:()=>i.specchio.scala,scrivi:o=>i.specchio.scala=o},{chiave:"vediSpecchio",nome:"mostra lo specchio nudo",tipo:"interruttore",leggi:()=>!!i.specchio.mostra,scrivi:o=>i.specchio.mostra=!!o},{chiave:"bagliori",nome:"alone delle lanterne (due cerchi)",tipo:"interruttore",leggi:()=>!!(e&&e.attivo),scrivi:o=>{e&&(e.attivo=!!o)}},{chiave:"erbaFinoA",nome:"fili d'erba fino a",tipo:"numero",min:0,max:160,passo:16,unita:"blocchi",leggi:()=>i.erbaFinoA,scrivi:o=>i.erbaFinoA=o},{chiave:"nebbiaDa",nome:"nebbia da",tipo:"numero",min:8,max:200,passo:4,unita:"blocchi",leggi:()=>i.nebbia.da,scrivi:o=>i.nebbia.da=Math.min(o,i.nebbia.a-4)},{chiave:"nebbiaA",nome:"nebbia piena a",tipo:"numero",min:12,max:240,passo:4,unita:"blocchi",leggi:()=>i.nebbia.a,scrivi:o=>i.nebbia.a=Math.max(o,i.nebbia.da+4)},{chiave:"disegni",nome:"disegni (solidi + specchio)",tipo:"lettura",leggi:()=>`${i.statistiche.disegni} + ${i.statistiche.disegniSpecchio}`},{chiave:"chunk",nome:"chunk visti / totali",tipo:"lettura",leggi:()=>`${i.statistiche.chunkVisti} / ${i.statistiche.chunkTotali}`}]}}function Ui(i){return{chiave:"stile",nome:"Stile",nota:"L'ombra di Leafy \xE8 il colore stesso con la tinta spostata verso il blu, un po' pi\xF9 satura e pi\xF9 scura. Qui si tarano i tre numeri, e si accendono o spengono i pezzi della luce.",campi:[{chiave:"tinta",nome:"ombra: spostamento di tinta verso il blu",tipo:"numero",min:0,max:.3,passo:.01,leggi:()=>i.stile.tinta,scrivi:e=>i.stile.tinta=e},{chiave:"saturazione",nome:"ombra: saturazione",tipo:"numero",min:.6,max:1.6,passo:.05,leggi:()=>i.stile.saturazione,scrivi:e=>i.stile.saturazione=e},{chiave:"valore",nome:"ombra: quanto \xE8 scura (valore)",tipo:"numero",min:.3,max:1,passo:.02,leggi:()=>i.stile.valore,scrivi:e=>i.stile.valore=e},{chiave:"mappa",nome:"mappa d'ombra vera (forma delle cose)",tipo:"interruttore",leggi:()=>!!i.mappa.attiva,scrivi:e=>i.mappa.attiva=!!e},{chiave:"mappaRaggio",nome:"mappa d'ombra: raggio",tipo:"numero",min:16,max:64,passo:4,unita:"blocchi",leggi:()=>i.mappa.raggio,scrivi:e=>{i.mappa.raggio=e,i.mappa.sporca=!0,i.mappa.centro=[1e9,0,1e9]}},{chiave:"lampade",nome:"pozze dei lampioni (cerchi)",tipo:"interruttore",leggi:()=>i.lampadeAccese!==!1,scrivi:e=>i.lampadeAccese=!!e}]}}function Bi(i){return{chiave:"meteo",nome:"Meteo",nota:"Il mare: 0 \xE8 uno specchio, 1 \xE8 mosso. Muoverlo a mano spegne il vagare automatico.",campi:[{chiave:"auto",nome:"meteo che cambia da solo",tipo:"interruttore",leggi:()=>!!i.auto,scrivi:e=>i.auto=!!e},{chiave:"mare",nome:"mare mosso",tipo:"numero",min:0,max:1,passo:.02,leggi:()=>+i.agitazione.toFixed(2),scrivi:e=>{i.auto=!1,i.agitazione=e,i.meta=e}}]}}function ki(i){return{chiave:"giorno",nome:"Giorno",nota:"Muovere l'ora spegne il ciclo automatico.",campi:[{chiave:"auto",nome:"ciclo automatico",tipo:"interruttore",leggi:()=>!!i.auto,scrivi:e=>i.auto=!!e},{chiave:"ora",nome:"ora del giorno",tipo:"numero",min:0,max:1,passo:.002,leggi:()=>i.ora,scrivi:e=>{i.auto=!1,i.ora=e}},{chiave:"durata",nome:"quanto dura un giorno",tipo:"numero",min:30,max:1800,passo:30,unita:"s",leggi:()=>i.durata,scrivi:e=>i.durata=e},{chiave:"orologio",nome:"orologio",tipo:"lettura",leggi:()=>`${String(Math.floor(i.ora*24)).padStart(2,"0")}:${String(Math.floor(i.ora*24%1*60)).padStart(2,"0")}`}]}}function Vi(i,e){return{chiave:"corpi",nome:"Corpi (fisica)",nota:"Scatole a passo fisso (60 Hz), un asse per volta. Il tetto \xE8 800.",campi:[{chiave:"quanti",nome:"corpi",tipo:"lettura",leggi:()=>`${i.statistiche.corpi} (${i.statistiche.svegli} svegli)`},{chiave:"lancia20",nome:"\u{1F3B2} lancia venti",tipo:"azione",fai:()=>e(20)},{chiave:"lancia200",nome:"\u{1F3B2} lancia duecento",tipo:"azione",fai:()=>e(200)},{chiave:"svuota",nome:"\u{1F9F9} togli tutti",tipo:"azione",fai:()=>i.svuota()}]}}function Gi(i){return{chiave:"streaming",nome:"Mondo in streaming",nota:"La frontiera genera 32 blocchi oltre la resa; la coda costruisce entro il budget, almeno un chunk a giro.",campi:[{chiave:"raggio",nome:"raggio di resa",tipo:"numero",min:48,max:160,passo:16,unita:"blocchi",leggi:()=>i.raggioResa,scrivi:e=>i.raggioResa=e},{chiave:"budget",nome:"budget di costruzione",tipo:"numero",min:1,max:16,passo:1,unita:"ms",leggi:()=>i.budgetMs,scrivi:e=>i.budgetMs=e},{chiave:"erba",nome:"densit\xE0 dell'erba (ai prossimi chunk)",tipo:"numero",min:0,max:8,passo:1,leggi:()=>i.erba,scrivi:e=>i.erba=e},{chiave:"stato",nome:"coda / costruiti / scaricati",tipo:"lettura",leggi:()=>`${i.statistiche.inCoda} / ${i.statistiche.costruiti} / ${i.statistiche.scaricati}`}]}}function $i(i){return{chiave:"giocatore",nome:"Giocatore",campi:[{chiave:"volo",nome:"vola",tipo:"interruttore",leggi:()=>!!i.volo,scrivi:e=>i.impostaVolo(!!e)},{chiave:"cameraTira",nome:"la camera si tira dentro davanti a un muro",tipo:"interruttore",leggi:()=>!!(i.cameraTira&&i.cameraTira()),scrivi:e=>i.impostaCameraTira&&i.impostaCameraTira(!!e)},{chiave:"buco",nome:"buco di visuale (al posto della sagoma)",tipo:"interruttore",leggi:()=>!!(i.buco&&i.buco()),scrivi:e=>i.impostaBuco&&i.impostaBuco(!!e)},{chiave:"miraCentro",nome:"mira al centro (mirino) invece che dove sta il dito",tipo:"interruttore",leggi:()=>!!(i.miraCentro&&i.miraCentro()),scrivi:e=>i.impostaMiraCentro&&i.impostaMiraCentro(!!e)},{chiave:"dove",nome:"dove",tipo:"lettura",leggi:()=>i.dove()},{chiave:"casa",nome:"\u{1F3E0} torna all'origine",tipo:"azione",fai:()=>i.aCasa()},{chiave:"modifiche",nome:"modifiche salvate",tipo:"lettura",leggi:()=>i.modifiche?i.modifiche():0},{chiave:"nuovo",nome:"\u{1F5D1} mondo nuovo (butta le modifiche)",tipo:"azione",fai:()=>i.nuovo&&i.nuovo()}]}}function Xi(i){return{chiave:"scene",nome:"Scene",nota:"Lo zoo \xE8 il piano di prova: vasca, scalinata, muro dei materiali, viale dei lampioni, lampade colorate, arredi. Cambiare scena ricarica la pagina.",campi:[{chiave:"dove",nome:"scena",tipo:"lettura",leggi:()=>i.vetrina?"vetrina nel nero":i.zoo?"zoo di prova":`open world, seme ${i.seme}`},{chiave:"vetrina",nome:"\u{1F5BC} vai alla vetrina (la concept art nel nero)",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?vetrina&officina&terza&ora=0.38")}},{chiave:"zoo",nome:"\u{1F981} vai allo zoo",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?zoo&officina&terza")}},{chiave:"mondo",nome:"\u{1F30D} torna all'open world",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search=`?seme=${i.seme}&officina`)}}]}}var xo=class{constructor(e=1){this.agitazione=.25,this.meta=.25,this.auto=!0,this.fra=20,this._s=e>>>0||1}_caso(){let e=this._s;return e^=e<<13,e^=e>>>17,e^=e<<5,this._s=e>>>0,this._s%1e5/1e5}aggiorna(e){if(!this.auto)return this.agitazione;this.fra-=e,this.fra<=0&&(this.meta=Math.pow(this._caso(),2),this.fra=25+this._caso()*50);let o=1-Math.exp(-e/12);return this.agitazione+=(this.meta-this.agitazione)*o,this.agitazione}};function Hi(i,e,o,t,a=0,n=0){let r=[e[0]-i[0],e[1]-i[1],e[2]-i[2]],s=Math.hypot(...r)||1;r[0]/=s,r[1]/=s,r[2]/=s;let l=[-r[2],0,r[0]],c=Math.hypot(...l)||1;l[0]/=c,l[2]/=c;let u=[l[1]*r[2]-l[2]*r[1],l[2]*r[0]-l[0]*r[2],l[0]*r[1]-l[1]*r[0]],p=Math.tan(o/2),f=a*p*t,d=n*p,m=[r[0]+l[0]*f+u[0]*d,r[1]+l[1]*f+u[1]*d,r[2]+l[2]*f+u[2]*d],h=Math.hypot(...m)||1;return{x:m[0]/h,y:m[1]/h,z:m[2]/h}}function Yi(i,e={}){let o={};for(let[a,n]of i.modifiche)n.size&&(o[a]=[...n].map(([r,s])=>[r,s]));let t=i.bagnate&&i.bagnate.size?[...i.bagnate]:void 0;return JSON.stringify({v:1,chunk:o,...t?{bagnate:t}:{},...e})}function Zi(i,e){if(!e)return 0;let o;try{o=JSON.parse(e)}catch{return-1}if(!o||o.v!==1||typeof o.chunk!="object")return-1;let t=0;for(let[a,n]of Object.entries(o.chunk)){if(!/^-?\d+,-?\d+$/.test(a)||!Array.isArray(n))continue;let r=new Map;for(let s of n)!Array.isArray(s)||s.length!==2||!Number.isInteger(s[0])||s[1]!==null&&typeof s[1]!="string"||(r.set(s[0],s[1]),t++);r.size&&i.modifiche.set(a,r)}if(Array.isArray(o.bagnate)&&i.bagnate)for(let a of o.bagnate)!Array.isArray(a)||a.length!==2||!Number.isInteger(a[0])||!Number.isInteger(a[1])||i.bagnate.set(a[0],Math.max(0,Math.min(15,a[1])));return t}function ra(i){let e=0;for(let o of i.modifiche.values())e+=o.size;return e}Ot();ie();var Eo={portata:7,budget:256,yMin:-32},ji=[[1,0],[-1,0],[0,1],[0,-1]],Ki=(i,e,o)=>i+","+e+","+o,Ao=class{constructor(e){this.mondo=e,this.coda=new Map,this.attiva=!0}pianifica(e,o,t){this.coda.set(Ki(e,o,t),[e,o,t])}bonifica(){let e=[];for(let o of this.mondo.tutti())o.y<Eo.yMin&&o.tipo.startsWith("acqua")&&e.push([o.x,o.y,o.z]);for(let[o,t,a]of e)this.mondo.togli(o,t,a,!0);return e.length}pianificaAttorno([e,o,t]){this.pianifica(e,o,t),this.pianifica(e,o-1,t),this.pianifica(e,o+1,t);for(let[a,n]of ji)this.pianifica(e+a,o,t+n)}tick(){if(!this.attiva||this.coda.size===0)return 0;let e=[...this.coda.values()].slice(0,Eo.budget);for(let[t,a,n]of e)this.coda.delete(Ki(t,a,n));let o=0;for(let[t,a,n]of e)o+=this._riesamina(t,a,n)?1:0;return o}_riesamina(e,o,t){let a=this.mondo,n=a.tipo(e,o,t);if(n&&!q(n).acqua)return!1;if(o<Eo.yMin)return n?(a.togli(e,o,t,!0),!0):!1;let r=n?Me(n):null;if(r===0)return a.tipo(e,o-1,t)||this.pianifica(e,o-1,t),!1;let s=a.tipo(e,o+1,t),l=!!(s&&q(s).acqua),c=a.tipo(e,o-1,t),u=!!(c&&q(c).acqua),p=!!(c&&!q(c).acqua),f=0,d=1/0;for(let[h,g]of ji){let v=a.tipo(e+h,o,t+g),b=v?Me(v):null;if(b!==null){if(b===0&&f++,b!==0){let x=a.tipo(e+h,o-1,t+g);if(!x||q(x).acqua)continue}b<d&&(d=b)}}let m=null;return f>=2&&(p||u&&Me(c)===0)?m=0:l?m=1:d+1<=Eo.portata&&(m=d+1),m===r?(r!==null&&!a.tipo(e,o-1,t)&&this.pianifica(e,o-1,t),!1):(m===null?a.togli(e,o,t,!0):a.metti(e,o,t,m===0?"acqua":"acqua~"+m,!0),this.pianificaAttorno([e,o,t]),!0)}};ie();var K=new URLSearchParams(location.search),N={seme:+(K.get("seme")||4242),erba:Math.max(0,Math.min(8,+(K.get("erba")??8))),raggio:Math.max(48,Math.min(160,+(K.get("raggio")||96))),ombra:K.get("ombra")!=="no",mappa:K.get("mappa")==="no"?0:Math.max(256,Math.min(4096,+(K.get("mappa")||(matchMedia("(pointer: coarse)").matches?1024:2048)))),specchio:K.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(K.get("specchio")??.5)||.5)),dprMax:+(K.get("dpr")||1.5),ora:K.has("ora")?+K.get("ora"):null,corpi:+(K.get("corpi")||(K.has("omega")?120:0)),terza:K.has("terza"),zoo:K.has("zoo"),vetrina:K.has("vetrina"),omega:K.has("omega"),varia:K.get("varia")!=="no"},Q=document.getElementById("tela"),{gl:vt,dpr:ss,ridimensiona:cs}=La(Q,{antialias:!0,dprMax:N.dprMax}),z=new Yt(vt);z.ombra=N.ombra;z.mappa.attiva=N.mappa>0;N.mappa>0&&N.mappa!==z.mappa.lato&&(z.mappa.lato=N.mappa,z.mappa.latoDin=Math.max(256,N.mappa/2),z._preparaMappa());z.specchio.attivo=N.specchio>0;z.specchio.scala=N.specchio||.5;var ee=new Zt(vt);ee.registra("cubo",qa());ee.registra("omino",na(vo.blu));Ni();for(let[i,e]of Object.entries(he))ee.registra(i,e.costruisci());Ba();re.lampioneSpento||$e("lampioneSpento",{...q("lampione"),nome:"Lampione spento",modello:"lampioneSpento",luce:void 0,notte:!1});var k=new Wt,Ae=new go({varia:N.varia});k.onEvento=i=>Ae.evento(i);var va=K.get("worker")==="no"?null:Oi(),ls=N.vetrina?Pi:N.omega?Fi:N.zoo?wi:(i,e,o)=>Ua(i,e,o,N.seme),Ge=new fo(k,z,ls,{erba:N.erba,raggioResa:N.raggio,lavoro:va}),Ta=new Ao(k),fa=.2,yo=0,_a=new jt(vt);z.apriFinestraAltezze(.5,.5,512);var Oo=N.vetrina?"leafy-vetrina":N.omega?"leafy-omega":N.zoo?"leafy-zoo":`leafy-partita-${N.seme}`,Io=0;try{K.has("nuovo")?localStorage.removeItem(Oo):Io=Zi(k,localStorage.getItem(Oo))}catch{Io=0}var Dt=0;function us(){try{localStorage.setItem(Oo,Yi(k,{seme:N.seme,quando:Date.now()}))}catch{}}var fs=performance.now();Ge.avvio(.5,.5);var hn=performance.now()-fs,pa=new Set(["cubo","omino",...Object.keys(he)]);async function ps(i){if(!pa.has(i)){pa.add(i);try{let e=await fetch(`./modelli/nucleo/${i}.bin`);if(!e.ok)throw new Error(`${e.status}`);let o=wa(await e.arrayBuffer());if(i==="albero"){let t=o.byte,a=new DataView(t.buffer,t.byteOffset,t.byteLength),n=[[15,73,82],[20,84,77],[38,124,77],[90,197,80]],r=Math.max(.001,o.maxY-o.minY);for(let s=0;s<o.triangoli;s++){let l=s*3*20,c=t[l+16],u=t[l+17],p=t[l+18];if(!(u>c+20&&u>p+10))continue;let f=Math.min(a.getFloat32(l+4,!0),a.getFloat32(l+24,!0),a.getFloat32(l+44,!0)),d=n[Math.min(3,Math.floor((f-o.minY)/r*4))];for(let m=0;m<3;m++){let h=l+m*20;t[h+16]=d[0],t[h+17]=d[1],t[h+18]=d[2]}}}if(i==="lampione"){let t=o.byte;for(let a=0;a<o.vertici;a++)t[a*20+15]!==1&&(t[a*20+16]=42,t[a*20+17]=47,t[a*20+18]=77)}if(ee.registra(i,o),Ae.sporchi.add(i),i==="lampione"){let t=new Uint8Array(o.byte);for(let a=0;a<o.vertici;a++)t[a*20+15]===1&&(t[a*20+15]=0,t[a*20+16]=25,t[a*20+17]=25,t[a*20+18]=49);ee.registra("lampioneSpento",{...o,byte:t}),pa.add("lampioneSpento"),Ae.sporchi.add("lampioneSpento")}}catch(e){console.warn(`modello ${i}: ${e.message}`)}}}function ds(){for(let[i,e]of Ae.cambiate()){if(!ee.tipi.has(i)){ps(i),Ae.sporchi.add(i);continue}ee.istanze(i,e,8);let o=Lt(i);if(o&&o.alone){let{quota:t,raggio:a,colore:n}=o.alone,r=e.length/8,s=new Float32Array(r*8);for(let l=0;l<r;l++){let c=l*8,u=e[c+3];s.set([e[c],e[c+1]+t*u,e[c+2],a*u,n[0],n[1],n[2],1],c)}_a.istanze(s)}}}function Mn(i,e){for(let o=60;o>-60;o--)if(k.solido(i,o,e))return o+1;return 8}var S=new oo(k,{x:.5,y:(N.vetrina?Ee:N.zoo?oe:Mn(0,0))+.5+(N.zoo||N.vetrina?1:0),z:N.vetrina?2.5:.5}),ne=Ga(),bt=new io(ne),ms=new no(i=>{!i&&bt.azzera&&bt.azzera()}),je=new po(Q,{alpha:.6,beta:-.2}),xt=!1,Et=!0,kt=new Set;window.addEventListener("keydown",i=>{if(!/^(INPUT|TEXTAREA)$/.test(i.target&&i.target.tagName)){if(kt.add(i.code),i.code==="KeyF"&&gs(),i.code==="KeyH"){let e=document.getElementById("stato");e.hidden=!e.hidden}if(i.code==="KeyM"&&Sn(!Gt),i.code==="KeyC"&&Po(20),/^Digit[1-9]$/.test(i.code)&&gt(+i.code.slice(5)-1),i.code==="KeyE"){Rn();return}}});window.addEventListener("keyup",i=>kt.delete(i.code));window.addEventListener("blur",()=>kt.clear());var ot=6;window.addEventListener("wheel",i=>{Et&&(ot=Math.max(1.5,Math.min(40,ot*(i.deltaY>0?1.12:.89))))},{passive:!0});var Co=0,hs=i=>{let e=i.targetTouches;if(e.length<2){Co=0,je.fermo=!1;return}je.fermo=!0;let o=Math.hypot(e[0].clientX-e[1].clientX,e[0].clientY-e[1].clientY);Co>0&&Et&&o>1&&(ot=Math.max(1.5,Math.min(40,ot*Co/o))),Co=o};for(let i of["touchstart","touchmove","touchend","touchcancel"])Q.addEventListener(i,hs,{passive:!0});function Tn(i){xt=i,xt&&(S.vy=0)}function gs(){Tn(!xt)}document.getElementById("cubi").addEventListener("click",()=>Po(20));var Ze=1/60,qt=0,ke={x:S.x,y:S.y,z:S.z},It=S.y,_n=0;function ya(){let i=Math.min(1,qt/Ze),e=ke.y+(S.y-ke.y)*i;return e<It?It=e:It+=(e-It)*(1-Math.exp(-_n/.12)),[ke.x+(S.x-ke.x)*i,It,ke.z+(S.z-ke.z)*i]}var ba=!1;function vs(i){qt=Math.min(qt+i,Ze*4);let e=je.avantiPiano();for(;qt>=Ze;){if(qt-=Ze,ke.x=S.x,ke.y=S.y,ke.z=S.z,xt){let t=9*Ze,a=e.x,n=e.z;S.x+=(a*ne.avanti-n*ne.destra)*t,S.z+=(n*ne.avanti+a*ne.destra)*t,S.y+=((ne.salta?1:0)-(kt.has("ShiftLeft")||kt.has("KeyX")?1:0))*t,S.vy=0;continue}S.aggiorna(Ze,Cs(e),e);let o=t=>{let a=k.tipo(Math.floor(S.x),Math.floor(S.y+t),Math.floor(S.z));return!!(a&&q(a).acqua)};ba=o(.3),ba&&(o(.75)?S.vy=Math.min(S.vy+40*Ze,1.4):S.vy<-.8&&(S.vy=-.8),ne.salta&&(S.vy=2.5),S.aTerra=!1)}}var se={mira:null,occhio:null,tira:!1,buco:!1},da=0,gn=0;function Ro(i=0){_n=i;let e=je.verso(),[o,t,a]=ya(),n=[o,t+(Et?.8:1),a];if(!Et)return se.mira=null,{occhio:n,centro:[n[0]+e[0],n[1]+e[1],n[2]+e[2]],fov:1.36,rapporto:Q.width/Q.height};let r=ot;if(se.tira){for(let u=.5;u<=ot;u+=.5)if(k.solido(Math.floor(n[0]-e[0]*u),Math.floor(n[1]-e[1]*u),Math.floor(n[2]-e[2]*u))){r=Math.max(.6,u-.6);break}}let s=[n[0]-e[0]*r,n[1]-e[1]*r,n[2]-e[2]*r];se.mira||(se.mira=n.slice(),se.occhio=s.slice());let l=1-Math.exp(-i/.09),c=1-Math.exp(-i/.06);for(let u=0;u<3;u++)se.mira[u]+=(n[u]-se.mira[u])*l,se.occhio[u]+=(s[u]-se.occhio[u])*c;return{occhio:se.occhio.slice(),centro:se.mira.slice(),fov:1.15,rapporto:Q.width/Q.height}}var bs=document.getElementById("barra"),vn=document.getElementById("azione"),Ve=1,xs=9,ye=[null,"erba","terra","pietra","legno","sabbia","lampione","albero","lampadaPesante"].slice(0,xs).map(i=>i&&!re[i]?null:i);function yn(i){if(!i)return null;try{return Te[i]?Te[i].colore:he[i]?he[i].colore:to(Ke(i),8).cima}catch{return null}}function Vt(i){if(!i)return"mano";if(Te[i])return Te[i].nome;if(he[i])return he[i].nome;let e=re[i];return e&&e.nome||i}function Es(i,e){let o=document.createElement("button");return o.addEventListener("click",()=>gt(e)),bs.appendChild(o),o}var No=ye.map(Es);function Cn(i){let e=ye[i],o=No[i],t=yn(e),a=t!=null?"#"+(t>>>0).toString(16).padStart(6,"0"):"transparent",n=e?Vt(e):i===0?"mano":"\u2014";o.innerHTML=`<span class="n">${i+1}</span><span class="q" style="background:${a}"></span>${n}`,o.classList.toggle("vuota",e===null&&i!==0),o.title=e?`${Vt(e)} \u2014 tasto ${i+1}`:i===0?"mano vuota: rompi e interagisci":"vuota"}for(let i=0;i<ye.length;i++)Cn(i);function As(i){if(i==null){gt(0);return}let e=ye.indexOf(i);if(e>=0){gt(e);return}let o=Ve===0?1:Ve;ye[o]=i,Cn(o),gt(o)}function gt(i){Ve=(i%ye.length+ye.length)%ye.length,No.forEach((e,o)=>e.classList.toggle("scelto",o===Ve)),No[Ve].scrollIntoView({inline:"center",block:"nearest"})}gt(1);var Pt=new ao,F=null,wo=!1,Pe={x:0,y:0,visto:!1},Gt=!1;function Sn(i){Gt=!!i,document.body.classList.toggle("mira-centro",Gt)}Q.addEventListener("pointermove",i=>{Pe.x=i.clientX,Pe.y=i.clientY,Pe.visto=!0});Q.addEventListener("pointerdown",i=>{Pe.x=i.clientX,Pe.y=i.clientY,Pe.visto=!0});var ma=[];function zs(i){ma.length=0;let e=4e4;for(let o of Ae.tipiVivi()){if(o==="omino"||o==="cubo")continue;let t=Qt[o]||(o==="lampioneSpento"?Qt.lampione:null),a=t?t.altezza:1,n=t?t.mezza:.5;Ae.ognunaDi(o,(r,s,l)=>{let c=r-i.x,u=l-i.z;c*c+u*u>e||ma.push({min:{x:r-n,y:s,z:l-n},max:{x:r+n,y:s+a,z:l+n},dato:{cella:[Math.floor(r),s,Math.floor(l)]}})})}return ma}function Ms(i){let e=0,o=0;if(!(Gt||document.pointerLockElement===Q||!Pe.visto)){let a=Q.getBoundingClientRect();e=(Pe.x-a.left)/a.width*2-1,o=1-(Pe.y-a.top)/a.height*2}return Hi(i.occhio,i.centro,i.fov,i.rapporto,e,o)}function xa(i,e,o){for(let t=0;t<=2;t++){let a=k.tipo(i,e-t,o);if(a==="lampione"||a==="lampioneSpento")return[i,e-t,o,a];if(a&&t===0)return null}return null}function bn(i,e,o,t){k.togli(i,e,o),k.metti(i,e,o,t==="lampione"?"lampioneSpento":"lampione"),Ge.tocca(i,o),Dt=1e3}var Ts={solido:(i,e,o)=>{if(k.solido(i,e,o))return!0;let t=k.tipo(i,e,o);return!!(t&&q(t).acqua)}};function Ea(){if(!F)return["niente",Pe.visto?"troppo lontano":""];let i=ye[Ve];if(F.acqua)return i&&!Te[i]&&!bt.demolisci?["posa",`posa nell'acqua: ${Vt(i)}`]:["tocca","nuota fin l\xEC"];let[e,o,t]=F.cella,a=k.tipo(e,o,t),n=xa(e,o,t);return bt.demolisci?["rompi",`rompi: ${a?q(a).nome:""} (tieni premuto)`]:n&&(!i||Te[i])?["lampione",n[3]==="lampione"?"spegni il lampione":"accendi il lampione"]:i&&!Te[i]?["posa",`posa: ${q(i).nome}`]:["tocca",`tocca: ${a?q(a).nome:""}`]}function Ln(i,e,o,t){t?k.metti(i,e,o,t):k.togli(i,e,o),Ge.tocca(i,o),Ta.pianificaAttorno([i,e,o]),Dt=1e3}function _s(){if(!F)return;let i=ye[Ve];if(!i||Te[i])return;let[e,o,t]=F.acqua?F.cella:F.prima;if(!Ha(k,e,o,t))return;let a=k.tipo(e,o,t),n=a&&q(a).acqua&&We.has(q(i).forma),r=n?Me(a)||0:null,s=S;e+1>s.x-.3&&e<s.x+.3&&t+1>s.z-.3&&t<s.z+.3&&o+1>s.y&&o<s.y+.9||(Ln(e,o,t,i),n&&k.bagna(e,o,t,r))}function ys(){if(!F)return;let[i,e,o]=F.cella;Ln(i,e,o,null)}Q.addEventListener("contextmenu",i=>i.preventDefault());Za(Q,i=>{if(je.trascinato>6)return;if(Bt&&F&&F.cella){let o=Ae.idInCella(F.cella[0],F.cella[1],F.cella[2]);o!=null&&Bt.scegli(o)}let[e]=Ea();if(i.button===2||i.pointerType==="touch"&&!bt.demolisci)if(e==="lampione"){let o=xa(...F.cella);bn(o[0],o[1],o[2],o[3])}else e==="posa"?_s():F&&xn(F);else if(i.button===0&&i.pointerType!=="touch")if(e==="lampione"){let o=xa(...F.cella);bn(o[0],o[1],o[2],o[3])}else e==="tocca"&&F&&xn(F)});var ge=null,Ft=0,Aa=0,za=0;function xn(i){let e=i.faccia&&i.faccia[1]>0?i.cella:i.prima;ge={x:e[0]+.5,y:i.faccia&&i.faccia[1]>0?e[1]+1:e[1],z:e[2]+.5,cella:[e[0],i.faccia&&i.faccia[1]>0?e[1]+1:e[1],e[2]]},Ft=0,Aa=S.x,za=S.z}var Rt={avanti:0,destra:0,salta:!1};function Cs(i){if(ne.avanti||ne.destra||ne.salta)return ge=null,ne;if(!ge)return ne;let e=ge.x-S.x,o=ge.z-S.z,t=Math.hypot(e,o);if(t<.35)return ge=null,ne;let a=i.x,n=i.z;return Rt.avanti=(e*a+o*n)/t,Rt.destra=(e*-n+o*a)/t,Ft+=Ze,Math.hypot(S.x-Aa,S.z-za)>.05&&(Ft=0,Aa=S.x,za=S.z),Rt.salta=Ft>.5&&S.aTerra,Rt.salta&&(Ft=0),Rt}ja(Q,{onInizio:i=>{wo=!(i.pointerType==="touch"&&!bt.demolisci)},onFine:()=>{wo=!1,Pt.molla()}},0);var ze=new mo(k),qo=[[.36,.72,.3],[.62,.42,.26],[.84,.26,.24],[.28,.44,.84],[.93,.78,.26],[.62,.64,.66],[.96,.96,.96]],En=null;function Po(i){let e=je.verso(),o=Ro().occhio;for(let t=0;t<i&&ze.lista.length<800;t++){let a=9+Math.random()*4,n=()=>(Math.random()-.5)*2.2;ze.aggiungi({x:o[0]+e[0]*1.2+(Math.random()-.5)*.4,y:o[1]+e[1]*1.2+Math.random()*.4,z:o[2]+e[2]*1.2+(Math.random()-.5)*.4,vx:e[0]*a+n(),vy:e[1]*a+2+n(),vz:e[2]*a+n(),lato:.35+Math.random()*.3,colore:qo[Math.floor(Math.random()*qo.length)],giro:Math.random()*Math.PI})}}if(N.corpi>0)for(let i=0;i<Math.min(800,N.corpi);i++)ze.aggiungi({x:S.x+(Math.random()-.5)*12,y:S.y+6+Math.random()*10,z:S.z+(Math.random()-.5)*12,lato:.35+Math.random()*.3,colore:qo[i%qo.length],giro:Math.random()*Math.PI});var et={ora:N.ora??.35,auto:N.ora===null,durata:600},Nt=[],ha=new Set,So=60;function Ss(i){let e=i.pozza??i.colore??16777215,o=(e>>16&255)/255,t=(e>>8&255)/255,a=(e&255)/255,n=Math.max(o,t,a,.001),r=1.3*(i.intensita??1)/n;return[o*r,t*r,a*r]}function Ls(){let i=S;Nt.length=0,ha.clear();let e=(t,a,n,r)=>{let s=t-i.x,l=n-i.z,c=s*s+l*l;if(c>=So*So)return;let u=`${Math.floor(t)},${Math.floor(a)},${Math.floor(n)}`;if(ha.has(u))return;let p=q(r).luce;p&&(ha.add(u),Nt.push([c,t,a,n,p]))};Ae.ognunaDi("lampione",(t,a,n)=>e(t,a,n,"lampione"));for(let t of z.chunks.values())if(!(!t.luci||!t.luci.length)&&!(Math.abs(t.x0+8-i.x)>So+12||Math.abs(t.z0+8-i.z)>So+12))for(let[a,n,r,s]of t.luci)e(a+.5,n+.5,r+.5,s);Nt.sort((t,a)=>t[0]-a[0]);let o=Math.min(8,Nt.length);for(let t=0;t<o;t++){let[,a,n,r,s]=Nt[t];z.lampade[t*4]=a,z.lampade[t*4+1]=n,z.lampade[t*4+2]=r,z.lampade[t*4+3]=s.raggio??4.6;let[l,c,u]=Ss(s);z.lampadeCol[t*4]=l,z.lampadeCol[t*4+1]=c,z.lampadeCol[t*4+2]=u,z.lampadeCol[t*4+3]=s.quota??0}z.nLampade=z.lampadeAccese===!1?0:o}var mt=[],ga=48,Os=10,wt=0;function Is(i,e){let o=S;mt.length=0;let[t,,a]=ya();wt=i?1:Math.max(0,wt-e/.33),wt>.02&&mt.push([0,t,a,.3*wt,.4*wt]);for(let r of ze.lista){if(!r.inAcqua)continue;let s=(r.x-o.x)*(r.x-o.x)+(r.z-o.z)*(r.z-o.z);if(s>=ga*ga)continue;let l=Math.min(1,(ga-Math.sqrt(s))/Os),c=r.lato*.45*l*Math.min(1,(r.sommerso??1)*3);mt.push([s,r.x,r.z,c,c])}mt.sort((r,s)=>r[0]-s[0]);let n=Math.min(8,mt.length);for(let r=0;r<n;r++){let s=mt[r];z.galleggianti[r*4]=s[1],z.galleggianti[r*4+1]=s[2],z.galleggianti[r*4+2]=s[3],z.galleggianti[r*4+3]=s[4]}z.nGalleggianti=n}var Ut=new xo(N.seme);K.has("mare")&&(Ut.auto=!1,Ut.agitazione=Ut.meta=Math.max(0,Math.min(1,+K.get("mare")||0)));function Rs(i){et.auto&&(et.ora=(et.ora+i/et.durata)%1);let o=et.ora*Math.PI*2-Math.PI/2,t=.24+.5*Math.max(0,Math.sin(o)),a=o*.5;z.sole.verso=[-Math.cos(a)*Math.cos(Math.asin(t)),-t,-Math.sin(a)*Math.cos(Math.asin(t))];let n=Math.max(0,Math.min(1,(Math.sin(o)+.1)*2));z.sole.forza=n,z.mare=Ut.aggiorna(i),yo+=i,yo>=fa&&(yo=Math.min(yo-fa,fa),Ta.tick()),Ls(),Is(ba,i);let r=Math.min(1,Math.max(0,(t-.24)/.4));z.sole.colore=[1,.78+.22*r,.55+.45*r],z.sole.cielo=[.36+.64*n,.38+.62*n,.57+.43*n],z.nebbia.colore=N.vetrina?[0,0,0]:[.25+.47*n,.35+.5*n,.5+.42*n],vt.clearColor(z.nebbia.colore[0],z.nebbia.colore[1],z.nebbia.colore[2],1)}z.nebbia.da=N.raggio-24;z.nebbia.a=N.raggio+8;N.vetrina&&(z.cieloNero=!0,z.nebbia.da=400,z.nebbia.a=500);var pe=[],tt=[],Lo=[],An=performance.now(),On=0,zn=0;function In(i){let e=Math.min(.1,(i-An)/1e3);An=i;let o=performance.now();cs(),Rs(e),vs(e),ze.avanza(e),Ge.aggiorna(S.x,S.z,5),z.seguiAltezze(S.x,S.z),ds();let t=Ro(e);z.buco=Et&&se.buco?[t.centro[0],t.centro[1]-.2,t.centro[2],.75]:[0,0,0,0];let a=je.verso(),n=Ms(t),r={x:t.occhio[0],y:t.occhio[1],z:t.occhio[2]};if(F=$a(k,r,n,zs(r),200),!F){let d=jo(Ts,r,n,200);d&&(d.acqua=!0,F=d)}if(F&&F.scatola&&(F.cella=F.dato.cella),wo&&F&&!F.acqua){let[d,m,h]=F.cella;Pt.premi(d+","+m+","+h,Ya(q(k.tipo(d,m,h))),i),Pt.finito(i)&&ys()}else wo||Pt.molla();ee.istanze("cubo",En=ze.istanze(En),8),(ne.avanti||ne.destra||ge)&&(gn=S.verso);let s=gn-da;s=Math.atan2(Math.sin(s),Math.cos(s)),da+=s*(1-Math.exp(-e/.08));let l=(ne.avanti||ne.destra||ge)&&S.aTerra?Math.abs(Math.sin(i/90))*.06:0,[c,u,p]=ya();if(ee.istanze("omino",[c,u+l,p,1,1,1,1,da],8),ge&&z.scatola(ge.cella[0],ge.cella[1],ge.cella[2],1,.95,.6,.3,.02),z.disegna(t,e,ee),ee.disegna(z,t),F){let[d,m]=Ea(),h=Pt.progresso(i),[g,v,b]=F.cella;d==="rompi"||h>0?z.scatola(g,v,b,1,.35-.2*h,.25,.28+.25*h):d==="lampione"?z.scatola(g,v,b,1,.9,.4,.3):z.scatola(g,v,b,1,.95,.5,.22),d==="posa"&&!k.pieno(...F.prima)&&z.scatola(F.prima[0],F.prima[1],F.prima[2],.6,.85,1,.35,.1),z.evidenzia(g,v,b,h),vn.textContent=m}else vn.textContent=Ea()[1];z.disegnaAcqua(),_a.disegna(z,t);let f=performance.now()-o;pe.push(e*1e3),pe.length>240&&pe.shift(),tt.push(f),tt.length>240&&tt.shift(),On++,Ma&&Ma(),Dt>0&&(Dt-=e*1e3,Dt<=0&&us()),i-zn>500&&(zn=i,Ns()),requestAnimationFrame(In)}var ve=(i,e)=>{if(!i.length)return 0;let o=[...i].sort((t,a)=>t-a);return o[Math.min(o.length-1,Math.floor(o.length*e))]};function Ns(){let i=ve(pe,.5),e=ve(pe,.99),o=pe.length?pe.reduce((s,l)=>s+l,0)/pe.length:0,t=o?1e3/o:0,a=e?1e3/e:0;Lo.push(Math.round(t)),Lo.length>120&&Lo.shift(),document.getElementById("fps").textContent=`${t.toFixed(0)} fps \xB7 1% ${a.toFixed(0)}
${i.toFixed(1)} / ${e.toFixed(1)} ms
JS ${ve(tt,.5).toFixed(2)} ms`;let n=z.statistiche,r=Ge.statistiche;document.getElementById("stato").textContent=`${N.vetrina?"VETRINA":N.zoo?"ZOO":"PARTITA"} sul nucleo \xB7 seme ${N.seme} \xB7 ${Q.width}\xD7${Q.height} (dpr ${ss.toFixed(2)})
disegni ${n.disegni+ee.statistiche.disegni+n.disegniAcqua+n.disegniErba+n.disegniSpecchio} \xB7 triangoli ${(n.triangoli+ee.statistiche.triangoli+n.triangoliAcqua+n.triangoliErba+n.triangoliSpecchio).toLocaleString("it")} \xB7 chunk ${n.chunkVisti}/${n.chunkTotali} (coda ${r.inCoda}${va?`, in volo ${r.inVolo} su ${va.operai.length} worker`:""}, ${r.ultimaMs.toFixed(1)} ms) \xB7 corpi ${ze.statistiche.corpi} (${ze.statistiche.svegli} svegli)
x ${S.x.toFixed(1)} y ${S.y.toFixed(1)} z ${S.z.toFixed(1)} \xB7 ${xt?"volo":S.aTerra?"a terra":"in aria"} \xB7 modifiche ${ra(k)}${Io>0?` (${Io} ricaricate)`:""} \xB7 in mano: ${No[Ve].textContent}${F?` \xB7 miri ${k.tipo(...F.cella)}`:""}
WASD/joystick cammina \xB7 clic a terra (mano vuota) o destro = il gatto ci va \xB7 trascina = gira la camera \xB7 rotella/pizzico = zoom \xB7 sinistro tieni = scava \xB7 destro/tocco = posa o accendi \xB7 \u26CF col dito scava \xB7 C cubi \xB7 1-9 cassetta \xB7 M mirino`}requestAnimationFrame(In);var ht=null,Ma=null,Bt=null;async function Ca(){if(ht){document.body.classList.toggle("con-officina");return}let{apriOfficina:i}=await Promise.resolve().then(()=>(an(),on)),{creaScena:e}=await Promise.resolve().then(()=>(ln(),cn)),{registroCreativa:o,voci:t}=await Promise.resolve().then(()=>(mn(),dn)),{CATEGORIE_BLOCCHI:a}=await Promise.resolve().then(()=>(ie(),Pa)),{CATALOGO:n}=await Promise.resolve().then(()=>(Ot(),yi));Bt=e({entita:Ae,dove:()=>({x:S.x,y:S.y,z:S.z}),coloreDi:c=>{let u=yn(c);return u==null?"#888888":"#"+(u>>>0).toString(16).padStart(6,"0")},nomeDi:Vt,rigaDi:Lt,onVaiA:c=>{c&&(S.x=c.x,S.z=c.z,S.y=c.y+2.5,S.vy=0,ge=null)}});let s=o({elenco:t({categorie:a,blocchi:re,catalogo:n,nomeArredo:Vt}),inMano:()=>ye[Ve]??null,onPrendi:As}),l={get volo(){return xt},get terza(){return Et},impostaVolo:Tn,dove:()=>`x ${S.x.toFixed(1)} y ${S.y.toFixed(1)} z ${S.z.toFixed(1)}`,aCasa:()=>{S.x=.5,S.z=.5,S.y=Mn(0,0)+.5,S.vy=0},modifiche:()=>ra(k),nuovo:()=>{try{localStorage.removeItem(Oo)}catch{}location.search=`?seme=${N.seme}&nuovo`}};document.body.classList.add("con-officina"),l.cameraTira=()=>se.tira,l.impostaCameraTira=c=>se.tira=!!c,l.buco=()=>se.buco,l.impostaBuco=c=>se.buco=!!c,l.miraCentro=()=>Gt,l.impostaMiraCentro=Sn,ht=i({gruppi:[{contenitore:document.getElementById("rqGerarchia"),etichetta:"Gerarchia",registri:[Bt.gerarchia],azioni:!1},{contenitore:document.getElementById("rqAssets"),etichetta:"Assets",registri:[s],azioni:!1},{contenitore:document.getElementById("rqIspettore"),etichetta:"Ispettore",registri:[Bt.ispettore],azioni:!0},{contenitore:document.getElementById("rqImpostazioni"),etichetta:"Impostazioni",azioni:!1,registri:[Di(z,_a),Ui(z),ki(et),Bi(Ut),Vi(ze,Po),Gi(Ge),$i(l),Xi({zoo:N.zoo,vetrina:N.vetrina,seme:N.seme})]}],campione:()=>({disegni:z.statistiche.disegni+ee.statistiche.disegni+z.statistiche.disegniAcqua+z.statistiche.disegniErba+z.statistiche.disegniSpecchio,rtMs:null}),autore:"partita",titolo:"Officina \xB7 partita",apertoSubito:!0,scuro:!0,agganciaFrame:c=>Ma=c}),document.getElementById("chiudiDock").addEventListener("click",()=>document.body.classList.remove("con-officina"))}document.getElementById("apriOfficina").addEventListener("click",Ca);async function Rn(){ht?document.body.classList.add("con-officina"):await Ca(),ht&&ht.vaiA&&ht.vaiA("creativa")}document.getElementById("apriCreativa").addEventListener("click",Rn);K.has("officina")&&Ca();var ws=new ro(()=>({versione:(document.getElementById("versione")||{}).textContent||"partita in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:ms.scelta,ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[Q.clientWidth,Q.clientHeight],reso:[Q.width,Q.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:"partita sul nucleo",seme:N.seme,raggio:N.raggio,erba:N.erba,ombra:z.ombra,specchio:N.specchio,disegniSpecchio:z.statistiche.disegniSpecchio,corpi:ze.statistiche.corpi,dprMax:N.dprMax,jsMs:+ve(tt,.5).toFixed(2),jsP99:+ve(tt,.99).toFixed(2),streaming:{...Ge.statistiche},finestra:z.finestra&&z.finestra.spostamenti},ombreLampade:!1,antialias:!0,fps:ve(pe,.5)?1e3/ve(pe,.5):null,p50:ve(pe,.5),p99:ve(pe,.99),disegni:z.statistiche.disegni+ee.statistiche.disegni+z.statistiche.disegniAcqua+z.statistiche.disegniErba+z.statistiche.disegniSpecchio,triangoli:z.statistiche.triangoli+ee.statistiche.triangoli+z.statistiche.triangoliAcqua+z.statistiche.triangoliErba+z.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:Lo,storiaLivelli:[],scheda:Fo(vt),software:/swiftshader|llvmpipe/i.test(Fo(vt)),chunk:z.statistiche.chunkTotali,blocchi:k.contaBlocchi,luci:0,decorazioni:Ae.conta,erba:z.statistiche.triangoliErba,ora:`${Math.floor(et.ora*24)}h`,giorno:0,worldgenMs:hn,meshMs:hn}),()=>(z.disegna(Ro(),0,ee),ee.disegna(z,Ro()),z.disegnaAcqua(),Promise.resolve(Q.toDataURL("image/webp",.6))));globalThis.PARTITA={resa:z,modelli:ee,mondo:k,passeggero:S,sguardo:je,corpi:ze,streaming:Ge,entita:Ae,simAcqua:Ta,opz:N,lanciaCubi:Po,intento:ne,zoom:()=>ot,mirato:()=>F,statistiche:()=>({fps:1e3/(ve(pe,.5)||1),p50:ve(pe,.5),p99:ve(pe,.99),js:ve(tt,.5),...z.statistiche,modelli:{...ee.statistiche},streaming:{...Ge.statistiche},corpi:{...ze.statistiche},fotogrammi:On}),diagnostica:ws};

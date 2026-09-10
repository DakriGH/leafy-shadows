var Rn=Object.defineProperty;var Ft=(a,t,o)=>()=>{if(o)throw o[0];try{return a&&(t=a(a=0)),t}catch(e){throw o=[e],e}};var Ae=(a,t)=>{for(var o in t)Rn(a,o,{get:t[o],enumerable:!0})};var Oi={};Ae(Oi,{BLOCCHI:()=>rt,CATEGORIA_OFFICINA:()=>ie,CATEGORIA_PROVE:()=>ko,CATEGORIE_BLOCCHI:()=>Uo,defBlocco:()=>Zn,defDi:()=>F,livelloAcqua:()=>Mt,registraBlocco:()=>Gt,rimuoviBlocco:()=>Yn,tipoBase:()=>jt});function Gt(a,t,o=ie){rt[a]=t,o.blocchi.includes(a)||o.blocchi.push(a)}function Yn(a){delete rt[a];for(let t of[ie,ko]){let o=t.blocchi.indexOf(a);o>=0&&t.blocchi.splice(o,1)}}function Zn(a){return rt[a]}function F(a){return rt[a.charCodeAt(0)===97&&a.startsWith("acqua")?"acqua":a]||Hn}function jt(a){let t=a.indexOf("~");return t<0?a:a.slice(0,t)}function Mt(a){if(!a||!a.startsWith("acqua"))return null;let t=a.indexOf("~");return t<0?0:Number(a.slice(t+1))}var rt,Uo,ie,ko,Hn,it=Ft(()=>{rt={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},Uo=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],ie={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};Uo.push(ie);ko={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};Uo.push(ko);Hn={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"}});var Ea={};Ae(Ea,{CATALOGO:()=>fe,conAlone:()=>Tr,istanzaDi:()=>yr,posaDi:()=>po,registraAsset:()=>Qo,rigaDi:()=>Se});function Se(a){return Object.prototype.hasOwnProperty.call(fe,a)?fe[a]:null}function Qo(a,t){return fe[a]={nome:a,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1],...t,modello:t.modello||a},fe[a]}function Wo(a,t,o,e){let i=Math.imul(a|0,374761393)+Math.imul(t|0,668265263)+Math.imul(o|0,1274126177)+Math.imul(e|0,2246822519)|0;return i=Math.imul(i^i>>>13,1274126177),((i^i>>>16)>>>0)/4294967296}function po(a,t,o,e,i=!0){let n=Se(a);if(!n||!i)return{scala:1,tinta:[1,1,1],giro:0};let r=1;if(Array.isArray(n.scala)){let l=Wo(t,o,e,1);r=n.scala[0]+l*(n.scala[1]-n.scala[0])}else typeof n.scala=="number"&&(r=n.scala);let s=0;return n.giro==="libero"?s=Wo(t,o,e,2)*Math.PI*2:n.giro==="quarti"&&(s=Math.floor(Wo(t,o,e,2)*4)*_r),{scala:r,tinta:[1,1,1],giro:s}}function yr(a,t,o,e,i=!0){let n=po(a,t,o,e,i);return[t,o,e,n.scala,n.tinta[0],n.tinta[1],n.tinta[2],n.giro]}function Tr(){return Object.entries(fe).filter(([,a])=>a.alone)}var fe,_r,Re=Ft(()=>{fe={albero:{nome:"Albero",modello:"albero",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,5,1]},lampione:{nome:"Lampione",modello:"lampione",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1],alone:{quota:2.35,raggio:1.6,colore:[1,.85,.5]}},lampioneSpento:{nome:"Lampione spento",modello:"lampioneSpento",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1]},panchina:{nome:"Panchina",modello:"panchina",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[2,1,1]},ciuffo:{nome:"Ciuffo",modello:"ciuffo",giro:"libero",scala:[.82,1.24],proiettaOmbra:!1,classe:"fermo",ingombro:[1,1,1]}};_r=Math.PI/2});function $a(a){return a&&typeof a=="object"?JSON.parse(JSON.stringify(a)):a}function Yr(a,t){return a===t||a&&t&&typeof a=="object"&&JSON.stringify(a)===JSON.stringify(t)}var Eo,Ya=Ft(()=>{Eo=class{constructor({scrivi:t,autore:o="locale",limite:e=500}={}){this._scrivi=t,this.autore=o,this.limite=e,this.fatti=[],this.disfatti=[],this.diario=[],this._osservatori=new Set}esegui({registro:t,campo:o,prima:e,dopo:i,nota:n}){if(Yr(e,i))return null;let r={registro:t,campo:o,prima:$a(e),dopo:$a(i),autore:this.autore,t:Date.now(),nota:n};return this._scrivi(t,o,r.dopo),this.fatti.push(r),this.fatti.length>this.limite&&this.fatti.shift(),this.disfatti.length=0,this._annota("esegui",r),r}aVista(t,o,e){this._scrivi(t,o,e)}annulla(){let t=this.fatti.pop();return t?(this._scrivi(t.registro,t.campo,t.prima),this.disfatti.push(t),this._annota("annulla",t),t):null}ripeti(){let t=this.disfatti.pop();return t?(this._scrivi(t.registro,t.campo,t.dopo),this.fatti.push(t),this._annota("ripeti",t),t):null}get puoAnnullare(){return this.fatti.length>0}get puoRipetere(){return this.disfatti.length>0}netto(){let t={};for(let o of this.fatti)(t[o.registro]||={})[o.campo]=o.dopo;return t}rigioca(t){for(let o of t)this._scrivi(o.registro,o.campo,o.dopo)}osserva(t){return this._osservatori.add(t),()=>this._osservatori.delete(t)}_annota(t,o){this.diario.push({verbo:t,...o}),this.diario.length>this.limite*2&&this.diario.shift();for(let e of this._osservatori)e(t,o)}}});function ai(a){if(a&&a.chiave&&typeof a.disegna=="function")return a.campi=a.campi||[],a;if(!a||!a.chiave||!Array.isArray(a.campi))throw new Error(`registro malformato: ${a&&a.chiave}`);for(let t of a.campi){if(!Hr.includes(t.tipo))throw new Error(`${a.chiave}.${t.chiave}: tipo sconosciuto \xAB${t.tipo}\xBB`);if(t.tipo!=="azione"&&typeof t.leggi!="function")throw new Error(`${a.chiave}.${t.chiave}: manca leggi()`);t.tipo==="scelta"&&(t.scelte=(t.scelte||[]).map(o=>typeof o=="object"?o:{v:o,nome:String(o)})),t.tipo==="numero"&&(t.min??=0,t.max??=1,t.passo??=(t.max-t.min)/100)}return a}function Ao(a,t){if(t==null)return"\u2014";switch(a.tipo){case"numero":{let o=a.passo>=1?0:a.passo>=.1?1:a.passo>=.01?2:3;return Number(t).toFixed(o)+(a.unita?" "+a.unita:"")}case"interruttore":return t?"s\xEC":"no";case"scelta":{let o=a.scelte.find(e=>e.v===t);return o?o.nome:String(t)}default:return typeof t=="object"?JSON.stringify(t):String(t)}}function Ha(a,t){switch(a.tipo){case"numero":return Number(t);case"interruttore":return!!t&&t!=="false";case"scelta":{let o=a.scelte.find(e=>String(e.v)===String(t));return o?o.v:t}default:return t}}var Hr,ni=Ft(()=>{Hr=["numero","interruttore","scelta","colore","testo","azione","lettura"]});function ri(a,t,o){a.push(t),a.length>o&&a.shift()}function qt(a,t){if(!a.length)return NaN;let o=a.slice().sort((e,i)=>e-i);return o[Math.min(o.length-1,Math.floor(o.length*t))]}function he(a){return Number.isFinite(a)?Math.round(a*10)/10:null}var zo,Za=Ft(()=>{zo=class{constructor({campione:t,finestra:o=240}={}){this._campione=t||(()=>({})),this.finestra=o,this.ms=[],this.disegni=[],this.rtMs=[],this._prima=0,this._raccolta=null}passo(t=performance.now()){if(this._prima){let o=t-this._prima,e=this._campione()||{};ri(this.ms,o,this.finestra),Number.isFinite(e.disegni)&&ri(this.disegni,e.disegni,this.finestra),Number.isFinite(e.rtMs)&&ri(this.rtMs,e.rtMs,this.finestra),this._raccolta&&t>=this._raccolta.da&&(this._raccolta.ms.push(o),Number.isFinite(e.disegni)&&this._raccolta.disegni.push(e.disegni),Number.isFinite(e.rtMs)&&this._raccolta.rtMs.push(e.rtMs))}this._prima=t}adesso(){return{fps:this.ms.length?Math.round(1e3/qt(this.ms,.5)):null,p50:he(qt(this.ms,.5)),p99:he(qt(this.ms,.99)),disegni:this.disegni.length?Math.round(qt(this.disegni,.5)):null,rtMs:he(qt(this.rtMs,.5))}}misura({secondi:t=5,riscaldo:o=1,etichetta:e=""}={}){let i=performance.now();return this._raccolta={da:i+o*1e3,ms:[],disegni:[],rtMs:[]},new Promise(n=>{let r=i+(o+t)*1e3,s=()=>{if(performance.now()<r)return requestAnimationFrame(s);let l=this._raccolta;this._raccolta=null,n({etichetta:e,frame:l.ms.length,secondi:t,fps:l.ms.length?Math.round(1e3/qt(l.ms,.5)):null,p50:he(qt(l.ms,.5)),p99:he(qt(l.ms,.99)),disegni:l.disegni.length?Math.round(qt(l.disegni,.5)):null,rtMs:he(qt(l.rtMs,.5))})};requestAnimationFrame(s)})}}});var Zr,Mo,ja=Ft(()=>{ni();Zr=`
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
`,Mo=class{constructor({registri:t,bus:o,vivi:e,radice:i=document.body,titolo:n="Officina",contenitore:r=null,scuro:s=!1,etichetta:l=null,azioni:c=!0}){this.registri=t,this.bus=o,this._vivi=e||(()=>""),this.attivo=t[0]&&t[0].chiave,this._el={},this.incassato=!!r,this._etichetta=l,this._azioni=c,this._costruisci(r||i,n,s),this._orologio=setInterval(()=>this.aggiorna(),500),o.osserva(()=>this.aggiorna(!0))}apri(t=!0){this.incassato&&(t=!0),this.radice.classList.toggle("aperta",t),t&&this.aggiorna(!0)}get aperto(){return this.incassato||this.radice.classList.contains("aperta")}esito(t){this._el.esito.hidden=!t,this._el.esito.textContent=t||""}_costruisci(t,o,e){if(!document.getElementById("officina-stile")){let n=document.createElement("style");n.id="officina-stile",n.textContent=Zr,document.head.appendChild(n)}let i=this.radice=document.createElement("div");i.id="officina",this.incassato&&i.classList.add("incassato","aperta"),e&&i.classList.add("scuro"),i.innerHTML=`
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
      </div>`,t.appendChild(i),this._el.tasto=i.querySelector(".off-tasto"),this._el.vivi=i.querySelector(".off-vivi"),this._el.etichetta=i.querySelector(".off-etichetta"),this._etichetta&&(this._el.etichetta.textContent=this._etichetta,i.classList.add("con-etichetta")),this._azioni||(i.querySelector("[data-fa=annulla]").hidden=!0,i.querySelector("[data-fa=ripeti]").hidden=!0),this.registri.length<2&&i.classList.add("senza-schede"),this._el.nav=i.querySelector("nav"),this._el.campi=i.querySelector(".off-campi"),this._el.esito=i.querySelector(".off-esito"),this._el.annulla=i.querySelector("[data-fa=annulla]"),this._el.ripeti=i.querySelector("[data-fa=ripeti]"),this._el.tasto.addEventListener("click",()=>this.apri(!0)),i.querySelector("[data-fa=chiudi]").addEventListener("click",()=>this.apri(!1)),this._el.annulla.addEventListener("click",()=>this.bus.annulla()),this._el.ripeti.addEventListener("click",()=>this.bus.ripeti()),i.addEventListener("keydown",n=>{n.key==="Escape"&&this.apri(!1),n.stopPropagation()}),i.addEventListener("keyup",n=>n.stopPropagation()),i.querySelector(".off-corpo").addEventListener("wheel",n=>n.stopPropagation(),{passive:!0});for(let n of this.registri){let r=document.createElement("button");r.type="button",r.textContent=n.nome,r.dataset.chiave=n.chiave,r.addEventListener("click",()=>{this.attivo=n.chiave,this._disegnaScheda()}),this._el.nav.appendChild(r)}this._disegnaScheda()}_disegnaScheda(){for(let e of this._el.nav.children)e.classList.toggle("acceso",e.dataset.chiave===this.attivo);let t=this.registri.find(e=>e.chiave===this.attivo),o=this._el.campi;if(o.innerHTML="",this._controlli=[],this._vista=null,!!t){if(t.nota){let e=document.createElement("div");e.className="off-nota",e.textContent=t.nota,o.appendChild(e)}if(typeof t.disegna=="function"){this._vista=t.disegna(o,this)||null;return}for(let e of t.campi)o.appendChild(this._controllo(t,e));this.aggiorna(!0)}}_controllo(t,o){let e=document.createElement("div");e.className="campo",e.dataset.campo=o.chiave;let i=document.createElement("div");i.className="riga";let n=document.createElement("span");n.className="nome",n.textContent=o.nome,i.appendChild(n),e.appendChild(i);let r=(l,c)=>this.bus.esegui({registro:t.chiave,campo:o.chiave,prima:l,dopo:c}),s={campo:o,el:null,mostra:null,tocco:!1};switch(o.tipo){case"numero":{let l=document.createElement("span");l.className="valore",i.appendChild(l);let c=document.createElement("input");c.type="range",c.min=o.min,c.max=o.max,c.step=o.passo;let u;c.addEventListener("input",()=>{u===void 0&&(u=o.leggi()),s.tocco=!0;let p=Number(c.value);l.textContent=Ao(o,p),this.bus.aVista(t.chiave,o.chiave,p)}),c.addEventListener("change",()=>{let p=Number(c.value);s.tocco=!1;let f=u===void 0?o.leggi():u;u=void 0,r(f,p)}),e.appendChild(c),s.el=c,s.mostra=p=>{s.tocco||(c.value=p,l.textContent=Ao(o,p))};break}case"interruttore":{let l=document.createElement("button");l.type="button",l.className="interruttore",l.addEventListener("click",()=>{let c=!!o.leggi();r(c,!c)}),i.appendChild(l),s.el=l,s.mostra=c=>{l.classList.toggle("acceso",!!c),l.textContent=c?"s\xEC":"no"};break}case"scelta":{let l=document.createElement("select");for(let c of o.scelte){let u=document.createElement("option");u.value=String(c.v),u.textContent=c.nome,l.appendChild(u)}l.addEventListener("change",()=>r(o.leggi(),Ha(o,l.value))),i.appendChild(l),s.el=l,s.mostra=c=>{l.value=String(c)};break}case"colore":{let l=document.createElement("input");l.type="color";let c;l.addEventListener("input",()=>{c===void 0&&(c=o.leggi()),this.bus.aVista(t.chiave,o.chiave,l.value)}),l.addEventListener("change",()=>{let u=c===void 0?o.leggi():c;c=void 0,r(u,l.value)}),i.appendChild(l),s.el=l,s.mostra=u=>{document.activeElement!==l&&(l.value=u||"#000000")};break}case"testo":{let l=document.createElement("input");l.type="text",l.readOnly=!o.scrivi,l.addEventListener("change",()=>o.scrivi&&r(o.leggi(),l.value)),i.appendChild(l),s.el=l,s.mostra=c=>{document.activeElement!==l&&(l.value=c??"")};break}case"lettura":{let l=document.createElement("span");l.className="valore",i.appendChild(l),s.mostra=c=>{l.textContent=Ao(o,c)};break}case"azione":{e.removeChild(i);let l=document.createElement("button");l.type="button",l.className="azione",l.textContent=o.nome,l.addEventListener("click",async()=>{l.disabled=!0;try{await o.fai(this)}finally{l.disabled=!1,this.aggiorna(!0)}}),e.appendChild(l),s.el=l;break}}if(o.nota){let l=document.createElement("small");l.textContent=o.nota,e.appendChild(l)}return this._controlli.push(s),e}aggiorna(t=!1){if(this._el.tasto.textContent=`\u2699 ${this._vivi(!0)||"Officina"}`,!(!this.aperto&&!t)){this._el.vivi.innerHTML=this._vivi(!1)||"",this._el.annulla.disabled=!this.bus.puoAnnullare,this._el.ripeti.disabled=!this.bus.puoRipetere;for(let o of this._controlli||[])if(!(!o.mostra||o.tocco))try{o.mostra(o.campo.leggi())}catch(e){o.el&&(o.el.title=String(e))}if(this._vista&&this._vista.aggiorna)try{this._vista.aggiorna()}catch{}}}vaiA(t){this.attivo!==t&&(this.attivo=t,this._disegnaScheda())}}});var Ka={};Ae(Ka,{apriOfficina:()=>jr});function jr({registri:a,gruppi:t=null,campione:o,autore:e="officina",titolo:i="Officina",apertoSubito:n=!1,agganciaFrame:r,contenitore:s=null,scuro:l=!1}={}){t&&(a=t.flatMap(b=>b.registri)),a=a.map(ai);let c=new Map(a.map(b=>[b.chiave,new Map(b.campi.map(x=>[x.chiave,x]))])),u=new Map(a.map(b=>[b.chiave,b])),p=(b,x,z)=>{let A=c.get(b)&&c.get(b).get(x);if(A&&A.scrivi){A.scrivi(z);return}let M=u.get(b);if(M&&typeof M.scriviDinamico=="function"){M.scriviDinamico(x,z);return}throw new Error(`campo non scrivibile: ${b}.${x}`)},f=new Eo({scrivi:p,autore:e}),h=new zo({campione:o}),d=b=>{let x=h.adesso();return x.fps==null?b?"Officina":"in attesa del primo fotogramma\u2026":b?`${x.fps} fps \xB7 ${x.disegni??"\u2014"}d`:`<b>${x.fps}</b> fps \xB7 p50 ${x.p50} \xB7 p99 ${x.p99} ms \xB7 <b>${x.disegni??"\u2014"}</b> disegni \xB7 rt ${x.rtMs??"\u2014"} ms`},m=(t||[{contenitore:s,registri:a,etichetta:null,azioni:!0}]).map((b,x)=>new Mo({registri:b.registri.map(ai),bus:f,vivi:d,titolo:i,contenitore:b.contenitore||s,scuro:l,etichetta:b.etichetta??null,azioni:b.azioni??x===0})),g=m[0];if(n)for(let b of m)b.apri(!0);return r&&r(()=>h.passo()),{registri:a,bus:f,campionatore:h,pannello:g,pannelli:m,vivi:d,vaiA:b=>{for(let x of m)x.registri.some(z=>z.chiave===b)&&x.vaiA(b)},passo:()=>h.passo()}}var Wa=Ft(()=>{Ya();ni();Za();ja()});var en={};Ae(en,{TETTO_VOCI:()=>Wr,creaScena:()=>Qr,esa:()=>Ja,leggiMeta:()=>tn,vociVicine:()=>Qa});function Qa(a,t,o=60){let e=a.map(i=>{let n=i.x-t.x,r=(i.y-t.y)*.5,s=i.z-t.z;return{...i,lontano:Math.sqrt(n*n+r*r+s*s)}});return e.sort((i,n)=>i.lontano-n.lontano),{voci:e.slice(0,o),altri:Math.max(0,e.length-o)}}function Ja(a){return"#"+(a>>>0&16777215).toString(16).padStart(6,"0")}function Qr({entita:a,dove:t,coloreDi:o,nomeDi:e,rigaDi:i,onVaiA:n=null}){let r={scelto:null,aperti:new Set,filtro:""},s={},l=()=>{for(let f of Object.values(s))f&&f()};function c(){if(!document.getElementById("officina-scena-stile")){let f=document.createElement("style");f.id="officina-scena-stile",f.textContent=Kr,document.head.appendChild(f)}}return{gerarchia:{chiave:"gerarchia",nome:"\u{1F5C2} Gerarchia",disegna(f){c(),f.style.display="flex",f.style.flexDirection="column";let h=document.createElement("div");h.className="sc-barra";let d=document.createElement("input");d.type="text",d.placeholder="cerca un tipo\u2026",d.value=r.filtro;let m=document.createElement("span");m.className="valore",h.append(d,m);let g=document.createElement("div");g.className="sc-albero sc-alto",f.append(h,g),d.addEventListener("input",()=>{r.filtro=d.value.trim().toLowerCase(),v()});function v(){g.innerHTML="";let b=a.perTipo().filter(([z])=>!r.filtro||z.toLowerCase().includes(r.filtro)||(e(z)||"").toLowerCase().includes(r.filtro));if(m.textContent=`${a.conta} oggetti`,!b.length){let z=document.createElement("div");z.className="sc-vuoto",z.textContent="niente da mostrare",g.appendChild(z);return}let x=t();for(let[z,A]of b){let M=document.createElement("div");M.className="sc-gruppo";let I=document.createElement("button");I.type="button",I.className="sc-cap";let w=r.aperti.has(z),S=document.createElement("i");S.className="sc-pallino",S.style.background=o(z);let q=document.createElement("span");q.textContent=(w?"\u25BE ":"\u25B8 ")+(e(z)||z);let C=document.createElement("span");if(C.className="sc-quanti",C.textContent=A,I.append(S,q,C),I.addEventListener("click",()=>{w?r.aperti.delete(z):r.aperti.add(z),v()}),M.appendChild(I),w){let E=[];a.ognunaDi(z,(P,G,Z,L)=>E.push({id:L,x:P,y:G,z:Z}));let{voci:O,altri:R}=Qa(E,x);for(let P of O){let G=document.createElement("button");G.type="button",G.className="sc-voce"+(P.id===r.scelto?" scelta":"");let Z=a.leggi(P.id),L=document.createElement("span");L.textContent=Z&&Z.nome||`#${P.id}`;let nt=document.createElement("span");nt.className="sc-lont",nt.textContent=P.lontano.toFixed(0)+" m",G.append(L,nt),G.addEventListener("click",()=>{r.scelto=P.id,l()}),M.appendChild(G)}if(R){let P=document.createElement("div");P.className="sc-altri",P.textContent=`e altri ${R}, pi\xF9 lontani`,M.appendChild(P)}}g.appendChild(M)}}return s.gerarchia=v,v(),{aggiorna(){m.textContent=`${a.conta} oggetti`}}}},ispettore:{chiave:"ispettore",nome:"\u{1F50D} Ispettore",scriviDinamico(f,h){let d=f.indexOf("."),m=Number(f.slice(0,d)),g=f.slice(d+1);if(g==="nome"){a.battezza(m,h||null),l();return}if(g==="meta"){a.metadati(m,h);return}if(g==="tinta"){a.posa(m,{tinta:h});return}a.posa(m,{[g]:h})},disegna(f,h){c();let d=document.createElement("div");d.className="sc-isp sc-solo",f.appendChild(d);let m=(b,x,z,A)=>h.bus.esegui({registro:"ispettore",campo:`${b}.${x}`,prima:z,dopo:A});function g(b,x,z,A,M,I,w,S=q=>q.toFixed(2)){let q=document.createElement("div");q.className="sc-riga";let C=document.createElement("span");C.textContent=x;let E=document.createElement("input");E.type="range",E.min=z,E.max=A,E.step=M,E.value=I();let O=document.createElement("span");O.className="sc-num",O.textContent=S(I());let R;E.addEventListener("input",()=>{R===void 0&&(R=I());let P=Number(E.value);O.textContent=S(P),a.posa(r.scelto,{[w]:P})}),E.addEventListener("change",()=>{let P=R===void 0?I():R;R=void 0,m(r.scelto,w,P,Number(E.value))}),q.append(C,E,O),b.appendChild(q)}function v(){d.innerHTML="";let b=r.scelto==null?null:a.leggi(r.scelto);if(!b){let L=document.createElement("div");L.className="sc-vuoto",L.textContent="Nessun oggetto scelto. Cliccane uno nel gioco, o aprine un gruppo nella Gerarchia.",d.appendChild(L);return}let x=document.createElement("div");x.className="sc-titolo";let z=document.createElement("i");z.className="sc-pallino",z.style.background=o(b.tipo);let A=document.createElement("input");A.type="text",A.value=b.nome||"",A.placeholder=`#${b.id}`,A.style.flex="1",A.style.maxWidth="none",A.addEventListener("change",()=>m(b.id,"nome",b.nome||"",A.value)),x.append(z,A),d.appendChild(x);let M=i(b.tipo),I=document.createElement("div");I.className="sc-tipo",I.textContent=M?`${e(b.tipo)||b.tipo} \xB7 id ${b.id} \xB7 giro ${M.giro} \xB7 classe ${M.classe} \xB7 ingombro ${M.ingombro.join("\xD7")}${M.proiettaOmbra?" \xB7 fa ombra":""}`:`${b.tipo} \xB7 id ${b.id} \xB7 fuori catalogo`,d.appendChild(I);let w=document.createElement("div");w.className="sc-tre";for(let L of["x","y","z"]){let nt=document.createElement("label");nt.textContent=L;let Y=document.createElement("input");Y.type="number",Y.step="0.5",Y.value=b[L].toFixed(2),Y.addEventListener("change",()=>m(b.id,L,b[L],Number(Y.value))),nt.appendChild(Y),w.appendChild(nt)}d.appendChild(w),g(d,"giro",0,Math.PI*2,.01,()=>a.leggi(r.scelto).giro,"giro",L=>`${Math.round(L*180/Math.PI)}\xB0`),g(d,"scala",.1,4,.01,()=>a.leggi(r.scelto).scala,"scala");let S=document.createElement("div");S.className="sc-riga";let q=document.createElement("span");q.textContent="tinta";let C=document.createElement("input");C.type="color",C.value=Ja(Math.round(b.tinta[0]*255)<<16|Math.round(b.tinta[1]*255)<<8|Math.round(b.tinta[2]*255)),C.addEventListener("change",()=>{let L=parseInt(C.value.slice(1),16);m(b.id,"tinta",b.tinta,[(L>>16&255)/255,(L>>8&255)/255,(L&255)/255])}),S.append(q,C),d.appendChild(S);let E=document.createElement("div");E.className="sc-meta";let O=document.createElement("div");O.textContent="dati (chiave: valore, uno per riga)",O.style.opacity=".7";let R=document.createElement("textarea");R.value=Object.entries(b.dati||{}).map(([L,nt])=>`${L}: ${nt}`).join(`
`),R.addEventListener("change",()=>m(b.id,"meta",b.dati||{},tn(R.value))),E.append(O,R),d.appendChild(E);let P=document.createElement("div");if(P.className="sc-azioni",n){let L=document.createElement("button");L.type="button",L.textContent="\u2316 vai qui",L.addEventListener("click",()=>n(a.leggi(r.scelto))),P.appendChild(L)}let G=document.createElement("button");G.type="button",G.textContent="\u29C9 duplica",G.addEventListener("click",()=>{let L=a.leggi(r.scelto);L&&(r.scelto=a.aggiungi(L.tipo,L.x+1,L.y,L.z,{giro:L.giro,scala:L.scala,tinta:L.tinta,nome:L.nome,dati:L.dati}),l())});let Z=document.createElement("button");Z.type="button",Z.className="rosso",Z.textContent="\u2715 elimina",Z.addEventListener("click",()=>{a.togli(r.scelto),r.scelto=null,l()}),P.append(G,Z),d.appendChild(P)}return s.ispettore=v,v(),{aggiorna(){}}}},scegli(f){r.scelto=f,l()},get scelto(){return r.scelto}}}function tn(a){let t={};for(let o of String(a).split(`
`)){let e=o.indexOf(":");if(e<=0)continue;let i=o.slice(0,e).trim();i&&(t[i]=o.slice(e+1).trim())}return t}var Kr,Wr,on=Ft(()=>{Kr=`
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
`,Wr=60});var sn={};Ae(sn,{MANO_VUOTA:()=>si,categorieDi:()=>nn,filtra:()=>rn,registroCreativa:()=>es,voci:()=>ts});function ts({categorie:a,blocchi:t,catalogo:o,nomeArredo:e=null}){let i=[si],n=new Set;for(let r of a)for(let s of r.blocchi){let l=t[s];if(!l||n.has(s))continue;n.add(s);let c=o&&o[l.modello||s];i.push({id:s,nome:l.nome||s,categoria:r.id,categoriaNome:r.nome,cosa:l.forma==="modello",cima:l.cima??l.colore??10066329,lato:l.lato??l.colore??7829367,ombra:c?c.proiettaOmbra:void 0})}for(let[r,s]of Object.entries(t))n.has(r)||(n.add(r),i.push({id:r,nome:e&&e(r)||s.nome||r,categoria:s.forma==="modello"?"cose":"altro",categoriaNome:s.forma==="modello"?"Cose":"Altro",cosa:s.forma==="modello",cima:s.cima??s.colore??10066329,lato:s.lato??s.colore??7829367}));return i}function nn(a){let t=[],o=new Set;for(let e of a)e.categoria==="mano"||o.has(e.categoria)||(o.add(e.categoria),t.push({id:e.categoria,nome:e.categoriaNome||e.categoria}));return t}function rn(a,t,o){let e=String(o||"").trim().toLowerCase();return a.filter(i=>t&&i.categoria!==t&&i.categoria!=="mano"?!1:e?(i.nome||"").toLowerCase().includes(e)||String(i.id||"").toLowerCase().includes(e):!0)}function es({elenco:a,inMano:t,onPrendi:o}){let e=null,i="";return{chiave:"creativa",nome:"\u{1F392} Creativa",nota:"Tutto quello che si pu\xF2 avere in mano. Un clic e ce l'hai.",disegna(n){if(!document.getElementById("officina-creativa-stile")){let d=document.createElement("style");d.id="officina-creativa-stile",d.textContent=Jr,document.head.appendChild(d)}let r=document.createElement("div");r.className="cr-schede";let s=document.createElement("input");s.type="text",s.className="cr-cerca",s.placeholder="cerca\u2026";let l=document.createElement("div");l.className="cr-quante";let c=document.createElement("div");c.className="cr-griglia",n.append(r,s,l,c);let p=[{id:null,nome:"Tutto"},...nn(a)].map(d=>{let m=document.createElement("button");return m.type="button",m.textContent=d.nome,m.addEventListener("click",()=>{e=d.id,f(),h()}),r.appendChild(m),{b:m,id:d.id}});function f(){for(let d of p)d.b.classList.toggle("acceso",d.id===e)}s.addEventListener("input",()=>{i=s.value,h()});function h(){let d=rn(a,e,i);if(l.textContent=`${d.length-(d[0]===si?1:0)} cose`,c.innerHTML="",!d.length){let g=document.createElement("div");g.className="cr-vuoto",g.textContent="niente che si chiami cos\xEC",c.appendChild(g);return}let m=t();for(let g of d){let v=document.createElement("button");v.type="button",v.className="cr-cella"+(g.id===m?" scelta":""),v.title=g.id?`${g.nome} (${g.id})`:"mano vuota \u2014 rompi e interagisci";let b=document.createElement("i");if(b.className="cr-ico"+(g.id===null?" cr-vuota":g.cosa?" cr-cosa":""),g.id!==null){let z=document.createElement("b");z.className="cr-cima",z.style.background=an(g.cima);let A=document.createElement("b");A.className="cr-lato",A.style.background=an(g.lato),b.append(A,z)}let x=document.createElement("span");x.textContent=g.nome,v.append(b,x),v.addEventListener("pointerdown",z=>{z.preventDefault(),z.stopPropagation(),o(g.id),h()}),c.appendChild(v)}}return f(),h(),{aggiorna(){}}}}}var Jr,si,an,cn=Ft(()=>{Jr=`
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
`,si={id:null,nome:"Mano vuota",categoria:"mano",cosa:!1,cima:null,lato:null};an=a=>"#"+(a>>>0&16777215).toString(16).padStart(6,"0")});function _i(a,{antialias:t=!0,dprMax:o=1.5}={}){let e=a.getContext("webgl2",{antialias:t,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!e)throw new Error("WebGL2 non disponibile");let i=Math.min(o,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(a.clientWidth*i)),s=Math.max(1,Math.round(a.clientHeight*i));return a.width!==r||a.height!==s?(a.width=r,a.height=s,e.viewport(0,0,r,s),!0):!1};return n(),{gl:e,dpr:i,ridimensiona:n}}function ut(a,t,o){let e=(n,r)=>{let s=a.createShader(n);if(a.shaderSource(s,r),a.compileShader(s),!a.getShaderParameter(s,a.COMPILE_STATUS))throw new Error(`shader: ${a.getShaderInfoLog(s)}
${r.split(`
`).map((l,c)=>`${c+1}: ${l}`).join(`
`)}`);return s},i=a.createProgram();if(a.attachShader(i,e(a.VERTEX_SHADER,t)),a.attachShader(i,e(a.FRAGMENT_SHADER,o)),a.linkProgram(i),!a.getProgramParameter(i,a.LINK_STATUS))throw new Error(`programma: ${a.getProgramInfoLog(i)}`);return i}function qo(a){let t=a.getExtension("WEBGL_debug_renderer_info");return t?a.getParameter(t.UNMASKED_RENDERER_WEBGL):a.getParameter(a.RENDERER)}function ft(a,t,o){return(Math.sign(a)+1)*9+(Math.sign(t)+1)*3+(Math.sign(o)+1)}var Rs=ft(1,0,0),Ls=ft(-1,0,0),Os=ft(0,1,0),Is=ft(0,-1,0),Ns=ft(0,0,1),ws=ft(0,0,-1);var ze=class{constructor(t=1024){this.byte=new Uint8Array(t*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(t){let o=(this.n+t)*12;if(o<=this.byte.length)return;let e=this.byte.length*2;for(;e<o;)e*=2;let i=new Uint8Array(e);i.set(this.byte),this.byte=i,this.u32=new Uint32Array(i.buffer)}vertice(t,o,e,i,n,r,s,l=0,c=0){let u=Math.round(t*16)+16,p=Math.round(e*16)+16,f=Math.round(o*16);if(u<0||u>511||p<0||p>511||f<0||f>65535)throw new RangeError(`vertice fuori dal chunk: ${t},${o},${e}`);if(i<0||i>26||i===13)throw new RangeError(`normale non valida: ${i}`);this._spazio(1);let h=this.n*3,d=this.byte,m=this.u32;m[h]=(u|p<<9|(i&31)<<18|(l&1)<<23|(c&15)<<24)>>>0,m[h+1]=(f|(n&15)<<16|(r&15)<<20)>>>0;let g=this.n*12+8;d[g]=s>>16&255,d[g+1]=s>>8&255,d[g+2]=s&255,d[g+3]=0,this.n++}quadDa(t,o,e,i){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[t,o,e,i])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function yi(a=16384){let t=new Uint16Array(a*6);for(let o=0,e=0,i=0;o<a;o++,i+=4)t[e++]=i,t[e++]=i+1,t[e++]=i+2,t[e++]=i,t[e++]=i+2,t[e++]=i+3;return t}function Ti(a,t,o,e){let i=1/Math.tan(a/2),n=1/(o-e);return new Float32Array([i/t,0,0,0,0,i,0,0,0,0,(e+o)*n,-1,0,0,2*e*o*n,0])}function Po(a,t,o){let e=1/(o-t);return new Float32Array([1/a,0,0,0,0,1/a,0,0,0,0,-2*e,0,0,0,-(o+t)*e,1])}function Ge(a,t,o=[0,1,0]){let e=a[0]-t[0],i=a[1]-t[1],n=a[2]-t[2],r=Math.hypot(e,i,n)||1;e/=r,i/=r,n/=r;let s=o[1]*n-o[2]*i,l=o[2]*e-o[0]*n,c=o[0]*i-o[1]*e;r=Math.hypot(s,l,c)||1,s/=r,l/=r,c/=r;let u=i*c-n*l,p=n*s-e*c,f=e*l-i*s;return new Float32Array([s,u,e,0,l,p,i,0,c,f,n,0,-(s*a[0]+l*a[1]+c*a[2]),-(u*a[0]+p*a[1]+f*a[2]),-(e*a[0]+i*a[1]+n*a[2]),1])}function Ci(a,t=new Float32Array(16)){let[o,e,i,n,r,s,l,c,u,p,f,h,d,m,g,v]=a,b=o*s-e*r,x=o*l-i*r,z=o*c-n*r,A=e*l-i*s,M=e*c-n*s,I=i*c-n*l,w=u*m-p*d,S=u*g-f*d,q=u*v-h*d,C=p*g-f*m,E=p*v-h*m,O=f*v-h*g,R=b*O-x*E+z*C+A*q-M*S+I*w;return R?(R=1/R,t[0]=(s*O-l*E+c*C)*R,t[1]=(i*E-e*O-n*C)*R,t[2]=(m*I-g*M+v*A)*R,t[3]=(f*M-p*I-h*A)*R,t[4]=(l*q-r*O-c*S)*R,t[5]=(o*O-i*q+n*S)*R,t[6]=(g*z-d*I-v*x)*R,t[7]=(u*I-f*z+h*x)*R,t[8]=(r*E-s*q+c*w)*R,t[9]=(e*q-o*E-n*w)*R,t[10]=(d*M-m*z+v*b)*R,t[11]=(p*z-u*M-h*b)*R,t[12]=(s*S-r*C-l*w)*R,t[13]=(o*C-e*S+i*w)*R,t[14]=(m*x-d*A-g*b)*R,t[15]=(u*A-p*x+f*b)*R,t):null}function Me(a,t,o=new Float32Array(16)){for(let e=0;e<4;e++)for(let i=0;i<4;i++)o[e*4+i]=a[i]*t[e*4]+a[4+i]*t[e*4+1]+a[8+i]*t[e*4+2]+a[12+i]*t[e*4+3];return o}function Fo(a,t=new Float32Array(24)){let o=l=>[a[l],a[4+l],a[8+l],a[12+l]],e=o(0),i=o(1),n=o(2),r=o(3),s=[[r[0]+e[0],r[1]+e[1],r[2]+e[2],r[3]+e[3]],[r[0]-e[0],r[1]-e[1],r[2]-e[2],r[3]-e[3]],[r[0]+i[0],r[1]+i[1],r[2]+i[2],r[3]+i[3]],[r[0]-i[0],r[1]-i[1],r[2]-i[2],r[3]-i[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let l=0;l<6;l++){let[c,u,p,f]=s[l],h=Math.hypot(c,u,p)||1;t[l*4]=c/h,t[l*4+1]=u/h,t[l*4+2]=p/h,t[l*4+3]=f/h}return t}function Do(a,t,o,e,i,n,r){for(let s=0;s<6;s++){let l=a[s*4],c=a[s*4+1],u=a[s*4+2],p=a[s*4+3],f=l>0?i:t,h=c>0?n:o,d=u>0?r:e;if(l*f+c*h+u*d+p<0)return!1}return!0}var On=`#version 300 es
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
}`,Si=`#version 300 es
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
    if (h > y + 0.05 && h > pos.y + 0.6) return 0.0;
    float ho = mappa.b * 255.0;
    if (ho > y + 0.05 && ho > pos.y + 0.3) {
      // quanto passa lontano dall'asse della cella, sul piano
      highp vec2 centro = cella + 0.5;
      highp vec2 qui = pos.xz + (L.xz - pos.xz) * (t / lungo);
      if (length(qui - centro) < 0.34) return 0.0;
    }
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
}`,In=`#version 300 es
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
}`,Nn=`#version 300 es
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
}`,wn=`#version 300 es
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
}`,qn=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,Pn=`#version 300 es
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
}`,Fn=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,Dn=`#version 300 es
precision mediump float;
void main() {}`,$e=class{constructor(t){this.gl=t,this.programma=ut(t,On,Si),this.u={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[o]=t.getUniformLocation(this.programma,o);this.ebo=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ebo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,yi(16384),t.STATIC_DRAW),this.programmaErba=ut(t,wn,Si.replace(/flat in /g,"in ")),this.ue={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.ue[o]=t.getUniformLocation(this.programmaErba,o);this.programmaOmbra=ut(t,Fn,Dn),this.uo={uVP:t.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:t.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=ut(t,In,Nn),this.ua={};for(let o of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[o]=t.getUniformLocation(this.programmaAcqua,o);this.programmaCielo=ut(t,qn,Pn),this.uc={};for(let o of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[o]=t.getUniformLocation(this.programmaCielo,o);this.vaoVuoto=t.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=t.createSampler(),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_MIN_FILTER,t.LINEAR),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_MAG_FILTER,t.LINEAR),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(1024),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!t.getExtension("EXT_color_buffer_half_float")&&!!t.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(t,o){let e=this.mappa;Math.hypot(t+8-e.centro[0],o+8-e.centro[2])<=e.raggio+12&&(e.sporca=!0)}carica(t,o){let e=this.gl;this._sporcaMappa(o.cx*16,o.cz*16);let i=this.chunks.get(t);i||(i={vao:e.createVertexArray(),vbo:e.createBuffer(),quad:0},e.bindVertexArray(i.vao),e.bindBuffer(e.ARRAY_BUFFER,i.vbo),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null),this.chunks.set(t,i)),e.bindBuffer(e.ARRAY_BUFFER,i.vbo),e.bufferData(e.ARRAY_BUFFER,o.byte,e.STATIC_DRAW),i.quad=o.quad;let n=o.erba;i.verticiErba=n?n.vertici:0,i.lamelle=n?n.fili:0,i.yBaseErba=n?n.yBase:0,i.verticiErba>0&&(i.vaoErba||(i.vaoErba=e.createVertexArray(),i.vboErba=e.createBuffer(),e.bindVertexArray(i.vaoErba),e.bindBuffer(e.ARRAY_BUFFER,i.vboErba),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,4,e.UNSIGNED_BYTE,12,0),e.vertexAttribDivisor(0,1),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,4),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribIPointer(2,4,e.UNSIGNED_BYTE,12,8),e.vertexAttribDivisor(2,1),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,i.vboErba),e.bufferData(e.ARRAY_BUFFER,n.byte,e.STATIC_DRAW));let r=o.acqua;if(i.quadAcqua=r?r.quad:0,i.peloAcqua=r&&r.pelo!=null?r.pelo:null,i.quadAcqua>0&&(i.vaoAcqua||(i.vaoAcqua=e.createVertexArray(),i.vboAcqua=e.createBuffer(),e.bindVertexArray(i.vaoAcqua),e.bindBuffer(e.ARRAY_BUFFER,i.vboAcqua),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,i.vboAcqua),e.bufferData(e.ARRAY_BUFFER,r.byte,e.STATIC_DRAW)),i.x0=o.cx*16,i.z0=o.cz*16,i.minY=o.minY,i.maxY=o.maxY,i.y0=o.y0||0,i.chunk=[i.x0,i.y0,i.z0],o.altezze){i.tegola||(i.tegola=new Uint8Array(1024));let s=o.solide||o.altezze,l=o.impronte;for(let c=0;c<16;c++)for(let u=0;u<16;u++){let p=(u*16+c)*4,f=c*16+u,h=o.altezze[f],d=s[f],m=l?l[f]:-1;i.tegola[p]=h<0?0:Math.max(0,Math.min(255,h+1)),i.tegola[p+1]=d<0?0:Math.max(0,Math.min(255,d+1)),i.tegola[p+2]=m<0?0:Math.max(0,Math.min(255,m+1)),i.tegola[p+3]=255}this.finestra&&this._scriviTegola(i)}}apriFinestraAltezze(t,o,e=512){let i=this.gl;this.altezze||(this.altezze=i.createTexture()),this.finestra={lato:e,x0:0,z0:0,vuota:new Uint8Array(e*e*4),spostamenti:0},i.bindTexture(i.TEXTURE_2D,this.altezze),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),this._centraFinestra(t,o,!0)}seguiAltezze(t,o){this.finestra&&this._centraFinestra(t,o,!1)}_centraFinestra(t,o,e){let i=this.gl,n=this.finestra,r=n.lato/2;if(!e&&Math.abs(t-(n.x0+r))<n.lato/4&&Math.abs(o-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((t-r)/16)*16,n.z0=Math.floor((o-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.w!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,n.lato,n.lato],i.bindTexture(i.TEXTURE_2D,this.altezze),i.pixelStorei(i.UNPACK_ALIGNMENT,1),i.texImage2D(i.TEXTURE_2D,0,i.RGBA8,n.lato,n.lato,0,i.RGBA,i.UNSIGNED_BYTE,n.vuota);for(let s of this.chunks.values())s.tegola&&this._scriviTegola(s);return n.spostamenti++,!0}_scriviTegola(t,o=!1){let e=this.gl,i=this.finestra,n=t.x0-i.x0,r=t.z0-i.z0;n<0||r<0||n+16>i.lato||r+16>i.lato||(e.bindTexture(e.TEXTURE_2D,this.altezze),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,n,r,16,16,e.RGBA,e.UNSIGNED_BYTE,o?this._tegolaVuota:t.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(t,o,e,i=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=ut(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,t,o,e,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,t,o,e,.1),n.uniform3f(r.uColore,1,1-.45*i,1-.8*i),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(t,o,e,i,n,r,s=.3,l=.1){let c=this.gl;this.programmaPieno||(this.programmaPieno=ut(c,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:c.getUniformLocation(this.programmaPieno,"uVP"),uCella:c.getUniformLocation(this.programmaPieno,"uCella"),uColore:c.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=c.createVertexArray());let u=this.uPieno;c.useProgram(this.programmaPieno),c.uniformMatrix4fv(u.uVP,!1,this.vp),c.uniform4f(u.uCella,t,o,e,l),c.uniform4f(u.uColore,i*s,n*s,r*s,s),c.bindVertexArray(this.vaoPieno),c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.depthMask(!1),c.disable(c.CULL_FACE),c.drawArrays(c.TRIANGLES,0,36),c.enable(c.CULL_FACE),c.depthMask(!0),c.disable(c.BLEND),c.bindVertexArray(null)}rimuovi(t){let o=this.chunks.get(t);o&&(this._sporcaMappa(o.x0,o.z0),this.finestra&&o.tegola&&this._scriviTegola(o,!0),this.gl.deleteVertexArray(o.vao),this.gl.deleteBuffer(o.vbo),o.vaoAcqua&&(this.gl.deleteVertexArray(o.vaoAcqua),this.gl.deleteBuffer(o.vboAcqua)),o.vaoErba&&(this.gl.deleteVertexArray(o.vaoErba),this.gl.deleteBuffer(o.vboErba)),this.chunks.delete(t))}_sporcaOmbre(t,o,e,i){let r=[Math.max(0,t-26),Math.max(0,o-26),Math.min(this.ombre.w||1e9,t+e+26),Math.min(this.ombre.h||1e9,o+i+26)],s=this.ombre.sporco;this.ombre.sporco=s?[Math.min(s[0],r[0]),Math.min(s[1],r[1]),Math.max(s[2],r[2]),Math.max(s[3],r[3])]:r}_preparaOmbre(t,o){let e=this.gl,i=this.ombre;if(i.tex||(i.tex=e.createTexture(),i.fbo=e.createFramebuffer()),e.bindTexture(e.TEXTURE_2D,i.tex),i.mezzoFloat=this._ombreMezzo,i.mezzoFloat?(e.texImage2D(e.TEXTURE_2D,0,e.R16F,t,o,0,e.RED,e.HALF_FLOAT,null),i.scala=1,i.offset=0):(e.texImage2D(e.TEXTURE_2D,0,e.R8,t,o,0,e.RED,e.UNSIGNED_BYTE,null),i.scala=64,i.offset=-8),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,i.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i.tex,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&i.mezzoFloat)return this._ombreMezzo=!1,e.bindFramebuffer(e.FRAMEBUFFER,null),this._preparaOmbre(t,o);if(e.bindFramebuffer(e.FRAMEBUFFER,null),i.w=t,i.h=o,i.sporco=[0,0,t,o],!this.programmaOmbre){this.programmaOmbre=ut(e,`#version 300 es
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
}`),this.uOmbre={};for(let n of["uAltezze","uAltRett","uSole","uCodifica"])this.uOmbre[n]=e.getUniformLocation(this.programmaOmbre,n);this.vaoOmbre=e.createVertexArray()}}_calcolaOmbre(){let t=this.gl,o=this.ombre,e=this.sole;if(!this.altezze||!o.tex||(e.verso[0]*o.sole[0]+e.verso[1]*o.sole[1]+e.verso[2]*o.sole[2]<.99996&&(o.sole=e.verso.slice(),o.sporco=[0,0,o.w,o.h]),!o.sporco))return;let n=96,[r,s,l,c]=o.sporco;if(l<=r||c<=s){o.sporco=null;return}let u=Math.min(c,s+n);o.sporco=u>=c?null:[r,u,l,c];let p=Math.hypot(e.verso[0],e.verso[2])||1e-4,f=[-e.verso[0]/p,-e.verso[2]/p],h=Math.max(.05,-e.verso[1]/p);t.bindFramebuffer(t.FRAMEBUFFER,o.fbo),t.viewport(0,0,o.w,o.h),t.enable(t.SCISSOR_TEST),t.scissor(r,s,l-r,u-s),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.useProgram(this.programmaOmbre),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(this.uOmbre.uAltezze,0),t.uniform4f(this.uOmbre.uAltRett,0,0,1/o.w,1/o.h),t.uniform3f(this.uOmbre.uSole,f[0],f[1],h),t.uniform2f(this.uOmbre.uCodifica,o.scala,o.offset),t.bindVertexArray(this.vaoOmbre),t.drawArrays(t.TRIANGLES,0,3),t.bindVertexArray(null),t.disable(t.SCISSOR_TEST),t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),o.calcoli++,this.statistiche.calcoliOmbre=o.calcoli}_disegnaCielo(t,o){let e=this.gl,i=this.uc,n=this.sole;if(this.cieloNero||!Ci(t,this._invVP))return;e.useProgram(this.programmaCielo),e.uniformMatrix4fv(i.uInvVP,!1,this._invVP),e.uniform3f(i.uOcchio,o[0],o[1],o[2]),e.uniform3f(i.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform1f(i.uSoleForza,n.forza),e.uniform3f(i.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;e.uniform3f(i.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),e.disable(e.DEPTH_TEST),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vaoVuoto),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.enable(e.CULL_FACE),e.depthMask(!0),e.enable(e.DEPTH_TEST)}_preparaMappa(){let t=this.gl,o=this.mappa,e=i=>{let n=t.createTexture();t.bindTexture(t.TEXTURE_2D,n),t.texImage2D(t.TEXTURE_2D,0,t.DEPTH_COMPONENT24,i,i,0,t.DEPTH_COMPONENT,t.UNSIGNED_INT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_FUNC,t.LEQUAL);let r=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,n,0),t.drawBuffers([t.NONE]),t.readBuffer(t.NONE);let s=t.checkFramebufferStatus(t.FRAMEBUFFER)===t.FRAMEBUFFER_COMPLETE;return t.bindFramebuffer(t.FRAMEBUFFER,null),{tex:n,fbo:r,lato:i,ok:s}};o.stat=e(o.lato),o.din=e(o.latoDin),(!o.stat.ok||!o.din.ok)&&(o.attiva=!1)}legaMappa(t){let o=this.gl,e=this.mappa;o.activeTexture(o.TEXTURE1),o.bindTexture(o.TEXTURE_2D,e.stat.tex),o.uniform1i(t.uMappaStat,1),o.activeTexture(o.TEXTURE2),o.bindTexture(o.TEXTURE_2D,e.din.tex),o.uniform1i(t.uMappaDin,2),o.activeTexture(o.TEXTURE0),o.uniform1f(t.uMappaOn,e.on?1:0),o.uniformMatrix4fv(t.uLuceVP,!1,e.vp),o.uniformMatrix4fv(t.uLuceVPDin,!1,e.vpDin),o.uniform2f(t.uMappaTexel,.5/e.lato,.5/e.latoDin),o.uniform2f(t.uMappaSbieco,1.5*(2*e.raggio/e.lato),.1/220),o.uniform4fv(t.uLampade,this.lampade),o.uniform1i(t.uNLampade,this.nLampade),o.uniform3f(t.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(o.activeTexture(o.TEXTURE3),o.bindTexture(o.TEXTURE_2D,this.altezze),o.uniform1i(t.uAltezze,3),o.activeTexture(o.TEXTURE0))}_aggiornaMappa(t,o){let e=this.gl,i=this.mappa,n=this.sole,r=this.statistiche;if(i.on=!1,!i.attiva||!this.ombra)return;let s=typeof performance<"u"?performance.now():0,l=t.centro[0],c=t.centro[2],u=!1;Math.hypot(l-i.centro[0],c-i.centro[2])>10&&(i.centro=[Math.round(l/2)*2,Math.round(t.centro[1]),Math.round(c/2)*2],u=!0);{let g=n.verso,v=t.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Me(Po(i.raggioDin,10,230),Ge(b,v,x),i.vpDin)}n.verso[0]*i.sole[0]+n.verso[1]*i.sole[1]+n.verso[2]*i.sole[2]<.99985&&(i.soleMosso=!0);let f=i.sporca||i.soleMosso||o&&o.mappaSporca,h=u||f&&s-(i.ultimo||0)>=500;if(h){i.sole=n.verso.slice(),i.soleMosso=!1,i.ultimo=s;let g=n.verso,v=i.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Me(Po(i.raggio,10,230),Ge(b,v,x),i.vp)}if(e.enable(e.POLYGON_OFFSET_FILL),e.polygonOffset(1.5,4),h){e.bindFramebuffer(e.FRAMEBUFFER,i.stat.fbo),e.viewport(0,0,i.stat.lato,i.stat.lato),e.clear(e.DEPTH_BUFFER_BIT),e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uo.uVP,!1,i.vp);let g=0,v=0,b=i.raggio+12;for(let x of this.chunks.values())x.quad!==0&&(Math.hypot(x.x0+8-i.centro[0],x.z0+8-i.centro[2])>b||(e.uniform3f(this.uo.uChunk,x.chunk[0],x.chunk[1],x.chunk[2]),e.bindVertexArray(x.vao),e.drawElements(e.TRIANGLES,x.quad*6,e.UNSIGNED_SHORT,0),g++,v+=x.quad*2));if(e.bindVertexArray(null),o){let[x,z]=o.disegnaOmbra(i.vp,!1);g+=x,v+=z,o.mappaSporca=!1}i.sporca=!1,i.calcoli++,i.disegni=g,i.triangoli=v}e.bindFramebuffer(e.FRAMEBUFFER,i.din.fbo),e.viewport(0,0,i.din.lato,i.din.lato),e.clear(e.DEPTH_BUFFER_BIT);let d=0,m=0;o&&([d,m]=o.disegnaOmbra(i.vpDin,!0)),e.disable(e.POLYGON_OFFSET_FILL),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),i.on=!0,r.calcoliMappa=i.calcoli,r.disegniOmbra=d+(h?i.disegni:0),r.triangoliOmbra=m+(h?i.triangoli:0)}impostaAltezze(t,o,e,i,n,r=null){let s=this.gl;this.altezze||(this.altezze=s.createTexture()),s.bindTexture(s.TEXTURE_2D,this.altezze),s.pixelStorei(s.UNPACK_ALIGNMENT,1);let l=new Uint8Array(i*n*4);for(let c=0;c<i*n;c++)l[c*4]=t[c],l[c*4+1]=r?r[c]:t[c];s.texImage2D(s.TEXTURE_2D,0,s.RGBA8,i,n,0,s.RGBA,s.UNSIGNED_BYTE,l),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.altRett=[o,e,1/i,1/n],this._preparaOmbre(i,n)}impostaMaterie(t){let o=new Float32Array(64);for(let e=0;e<16&&e<t.length;e++)for(let i=0;i<4;i++)o[e*4+i]=t[e][i]||0;this.materie=o}disegna(t,o,e=null){let i=this.gl,n=this.statistiche;this.tempo+=o;let r=Ti(t.fov,t.rapporto,.3,400),s=Ge(t.occhio,t.centro);Me(r,s,this.vp),Fo(this.vp,this.piani),this._camera=t,this._visibili.length=0,this._visibiliErba.length=0;let l=0;for(let h of this.chunks.values())h.quad===0&&h.quadAcqua===0||(h.visto=this.tutto||Do(this.piani,h.x0,h.y0+h.minY,h.z0,h.x0+16,h.y0+h.maxY+1,h.z0+16),h.visto&&(l++,h.quadAcqua>0&&this._visibili.push(h),h.verticiErba>0&&Math.hypot(h.x0+8-t.occhio[0],h.z0+8-t.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(h)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(t,e),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(t,e),i.clear(i.COLOR_BUFFER_BIT|i.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,t.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[c,u]=this._solidi(this.vp,this.piani,t.occhio,!1),p=0,f=0;if(this._visibiliErba.length){let h=this.ue,d=this.sole;i.useProgram(this.programmaErba),i.uniformMatrix4fv(h.uVP,!1,this.vp),i.uniform1f(h.uTempo,this.tempo),i.uniform3f(h.uSoleVerso,d.verso[0],d.verso[1],d.verso[2]),i.uniform3f(h.uSoleCol,d.colore[0],d.colore[1],d.colore[2]),i.uniform1f(h.uSoleForza,d.forza),i.uniform3f(h.uCieloCol,d.cielo[0],d.cielo[1],d.cielo[2]),i.uniform2f(h.uNebbia,this.nebbia.da,this.nebbia.a),i.uniform3f(h.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),i.uniform3f(h.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),i.uniform2f(h.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),i.uniform1f(h.uOmbra,this.ombra&&this.altezze?1:0),i.uniform1f(h.uTaglio,-1e9),i.uniform1f(h.uErbaFinoA,this.erbaFinoA),i.uniform4f(h.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),i.uniform3f(h.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),this.altezze&&(i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,this.ombre.tex),i.uniform1i(h.uOmbre,0),i.uniform2f(h.uOmbreScala,this.ombre.scala,this.ombre.offset),i.uniform4f(h.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(h),i.disable(i.CULL_FACE);for(let m of this._visibiliErba)i.uniform3f(h.uChunk,m.chunk[0],m.yBaseErba,m.chunk[2]),i.bindVertexArray(m.vaoErba),i.drawArraysInstanced(i.TRIANGLES,0,6,m.lamelle),p++,f+=m.lamelle*2;i.enable(i.CULL_FACE),i.bindVertexArray(null)}n.disegni=c,n.triangoli=u,n.chunkVisti=l,n.chunkTotali=this.chunks.size,n.disegniErba=p,n.triangoliErba=f}_solidi(t,o,e,i){let n=this.gl,r=this.u,s=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,t),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,s.verso[0],s.verso[1],s.verso[2]),n.uniform3f(r.uSoleCol,s.colore[0],s.colore[1],s.colore[2]),n.uniform1f(r.uSoleForza,s.forza),n.uniform3f(r.uCieloCol,s.cielo[0],s.cielo[1],s.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,e[0],e[1],e[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let l=i?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,l[0],l[1],l[2],l[3]),n.uniform3f(r.uOcchio,e[0],e[1],e[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let c=0,u=0;for(let p of this.chunks.values())if(p.quad!==0){if(i){if(!this.tutto&&!Do(o,p.x0,p.y0+p.minY,p.z0,p.x0+16,p.y0+p.maxY+1,p.z0+16))continue}else if(!p.visto)continue;n.uniform3f(r.uChunk,p.chunk[0],p.chunk[1],p.chunk[2]),n.bindVertexArray(p.vao),n.drawElements(n.TRIANGLES,p.quad*6,n.UNSIGNED_SHORT,0),c++,u+=p.quad*2}return n.bindVertexArray(null),[c,u]}_peloVicino(t){let o=this._voti;o.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-t[0],n.z0+8-t[2])+2.2*Math.abs(n.peloAcqua-t[1]);o.set(n.peloAcqua,(o.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let e=null,i=0;for(let[n,r]of o)r>i&&(i=r,e=n);return e}_specchia(t,o){let e=this.gl,i=this.specchio,n=this.statistiche,r=this._peloVicino(t.occhio);if(r==null||t.occhio[1]<=r+.2)return;let s=Math.max(1,Math.round(e.drawingBufferWidth*i.scala)),l=Math.max(1,Math.round(e.drawingBufferHeight*i.scala));(!i.fbo||i.w!==s||i.h!==l)&&this._preparaSpecchio(s,l);let c=this._riflessione;c.fill(0),c[0]=1,c[5]=-1,c[10]=1,c[13]=2*r,c[15]=1,Me(this.vp,c,this.vpSpecchio),Fo(this.vpSpecchio,this.pianiSpecchio);let u=[t.occhio[0],2*r-t.occhio[1],t.occhio[2]];e.bindFramebuffer(e.FRAMEBUFFER,i.fbo),e.viewport(0,0,s,l),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),e.cullFace(e.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[p,f]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);n.disegniSpecchio=p,n.triangoliSpecchio=f,o&&(o.disegna(this,{occhio:u,centro:t.centro,fov:t.fov,rapporto:t.rapporto}),n.disegniSpecchio+=o.statistiche.disegni,n.triangoliSpecchio+=o.statistiche.triangoli),e.cullFace(e.BACK),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),this.taglio=-1e9,i.pelo=r,n.pelo=r}_mostraSpecchio(){let t=this.gl,o=this.specchio;this.programmaQuad||(this.programmaQuad=ut(t,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=t.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=t.createVertexArray()),t.useProgram(this.programmaQuad),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,o.tex),t.uniform1i(this.uQuad,0),t.bindVertexArray(this.vaoQuad),t.disable(t.DEPTH_TEST),t.drawArrays(t.TRIANGLE_STRIP,0,4),t.enable(t.DEPTH_TEST),t.bindVertexArray(null)}_preparaSpecchio(t,o){let e=this.gl,i=this.specchio;i.fbo||(i.fbo=e.createFramebuffer(),i.tex=e.createTexture(),i.rbo=e.createRenderbuffer()),e.bindTexture(e.TEXTURE_2D,i.tex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,o,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindRenderbuffer(e.RENDERBUFFER,i.rbo),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,o),e.bindFramebuffer(e.FRAMEBUFFER,i.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,i.tex,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,i.rbo),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&(i.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),i.w=t,i.h=o}disegnaAcqua(){let t=this.gl,o=this.ua,e=this.sole,i=this._camera,n=this.specchio;if(!i||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}t.useProgram(this.programmaAcqua),t.uniformMatrix4fv(o.uVP,!1,this.vp),t.uniform1f(o.uTempo,this.tempo),t.uniform3f(o.uCam,i.occhio[0],i.occhio[1],i.occhio[2]),t.uniform2f(o.uNebbia,this.nebbia.da,this.nebbia.a),t.uniform3f(o.uSoleVerso,e.verso[0],e.verso[1],e.verso[2]),t.uniform3f(o.uSoleCol,e.colore[0],e.colore[1],e.colore[2]),t.uniform1f(o.uSoleForza,e.forza),t.uniform3f(o.uCieloCol,e.cielo[0],e.cielo[1],e.cielo[2]),t.uniform3f(o.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r?n.tex:null),t.uniform1i(o.uSpecchio,1),t.uniform3f(o.uSchermo,1/t.drawingBufferWidth,1/t.drawingBufferHeight,r?1:0),t.uniform1f(o.uMare,this.mare),t.uniform4fv(o.uGalleggianti,this.galleggianti),t.uniform1i(o.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(o.uAltezze,2),t.bindSampler(2,this.campionatoreLiscio),t.uniform4f(o.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):t.uniform4f(o.uAltRett,0,0,0,0),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);let s=0,l=0;for(let c of this._visibili)t.uniform3f(o.uChunk,c.chunk[0],c.chunk[1],c.chunk[2]),t.bindVertexArray(c.vaoAcqua),t.drawElements(t.TRIANGLES,c.quadAcqua*6,t.UNSIGNED_SHORT,0),s++,l+=c.quadAcqua*2;t.bindVertexArray(null),t.depthMask(!0),t.enable(t.CULL_FACE),t.disable(t.BLEND),t.bindSampler(2,null),t.activeTexture(t.TEXTURE0),this.statistiche.disegniAcqua=s,this.statistiche.triangoliAcqua=l,n.mostra&&r&&this._mostraSpecchio()}};function Ri(a){let t=new DataView(a);if(String.fromCharCode(t.getUint8(0),t.getUint8(1),t.getUint8(2),t.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let o=t.getUint32(4,!0),e=o*3,i=new Uint8Array(a,8,e*16),n=new Uint8Array(a,8+e*16,e*4),r=new Uint8Array(e*20);for(let p=0;p<e;p++)r.set(i.subarray(p*16,p*16+16),p*20),r.set(n.subarray(p*4,p*4+4),p*20+16);let s=1/0,l=-1/0,c=0,u=new DataView(r.buffer);for(let p=0;p<e;p++){let f=u.getFloat32(p*20,!0),h=u.getFloat32(p*20+4,!0),d=u.getFloat32(p*20+8,!0);s=Math.min(s,h),l=Math.max(l,h),c=Math.max(c,Math.hypot(f,d))}return{byte:r,vertici:e,triangoli:o,minY:s,maxY:l,raggio:c}}var Un=`#version 300 es
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
}`,kn=`#version 300 es
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
}`;function Bn(a,t=4){if(t===8)return a instanceof Float32Array?a:new Float32Array(a);let o=a.length/4,e=new Float32Array(o*8);for(let i=0;i<o;i++)e.set([a[i*4],a[i*4+1],a[i*4+2],a[i*4+3],1,1,1,0],i*8);return e}function Li(a=[255,255,255],t=1,o=1,e=1){let i=[[[0,0,1],[[-1,0,1],[1,0,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[1,0,-1],[-1,0,-1],[-1,1,-1],[1,1,-1]]],[[1,0,0],[[1,0,1],[1,0,-1],[1,1,-1],[1,1,1]]],[[-1,0,0],[[-1,0,-1],[-1,0,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]],[[0,-1,0],[[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1]]]],n=36,r=new Uint8Array(n*20),s=new DataView(r.buffer),l=0,c=(u,p)=>{let f=l*20;s.setFloat32(f,u[0]*t/2,!0),s.setFloat32(f+4,u[1]*o,!0),s.setFloat32(f+8,u[2]*e/2,!0),r[f+12]=p[0]*127&255,r[f+13]=p[1]*127&255,r[f+14]=p[2]*127&255,r[f+15]=0,r[f+16]=a[0],r[f+17]=a[1],r[f+18]=a[2],r[f+19]=255,l++};for(let[u,[p,f,h,d]]of i)c(p,u),c(f,u),c(h,u),c(p,u),c(h,u),c(d,u);return{byte:r,vertici:n,triangoli:12,minY:0,maxY:o,raggio:Math.hypot(t,e)/2}}var Vn=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,Gn=`#version 300 es
precision mediump float;
void main() {}`,Ye=class{constructor(t){this.gl=t,this.programma=ut(t,Un,kn),this.u={};for(let o of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uStile","uAltezze"])this.u[o]=t.getUniformLocation(this.programma,o);this.programmaOmbra=ut(t,Vn,Gn),this.uoVP=t.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(t,o){let e=this.gl,i={vao:e.createVertexArray(),vbo:e.createBuffer(),ibo:e.createBuffer(),vertici:o.vertici,triangoli:o.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:o.raggio,maxY:o.maxY};return e.bindVertexArray(i.vao),e.bindBuffer(e.ARRAY_BUFFER,i.vbo),e.bufferData(e.ARRAY_BUFFER,o.byte,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,20,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.BYTE,!0,20,12),e.enableVertexAttribArray(4),e.vertexAttribIPointer(4,1,e.UNSIGNED_BYTE,20,15),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.UNSIGNED_BYTE,!0,20,16),e.bindBuffer(e.ARRAY_BUFFER,i.ibo),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(3,1),e.enableVertexAttribArray(5),e.vertexAttribPointer(5,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(5,1),e.bindVertexArray(null),this.tipi.set(t,i),i}istanze(t,o,e=4){let i=this.tipi.get(t);i&&(i.istanze=Bn(o,e),i.n=i.istanze.length/8,i.sporco=!0,this.dinamici.has(t)||(this.mappaSporca=!0))}disegnaOmbra(t,o){let e=this.gl;e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uoVP,!1,t);let i=0,n=0;for(let[r,s]of this.tipi)s.n===0||this.dinamici.has(r)!==o||(e.bindVertexArray(s.vao),s.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,s.ibo),e.bufferData(e.ARRAY_BUFFER,s.istanze,e.DYNAMIC_DRAW),s.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,s.vertici,s.n),i++,n+=s.triangoli*s.n);return e.bindVertexArray(null),[i,n]}disegna(t,o){let e=this.gl,i=this.u,n=t.sole;e.useProgram(this.programma),e.uniformMatrix4fv(i.uVP,!1,t.vpCorrente||t.vp),e.uniform1f(i.uTaglio,t.taglio??-1e9);let r=t.vpCorrente===t.vpSpecchio?[0,0,0,0]:t.buco||[0,0,0,0];e.uniform3f(i.uOcchio,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(i.uTempo,t.tempo),e.uniform3f(i.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform3f(i.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),e.uniform1f(i.uSoleForza,n.forza),e.uniform3f(i.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),e.uniform4fv(i.uMaterie,t.materie),e.uniform2f(i.uNebbia,t.nebbia.da,t.nebbia.a),e.uniform3f(i.uNebbiaCol,t.nebbia.colore[0],t.nebbia.colore[1],t.nebbia.colore[2]),e.uniform3f(i.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(i.uOmbra,t.ombra&&t.altezze?1:0),t.altezze&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.ombre.tex),e.uniform1i(i.uOmbre,0),e.uniform2f(i.uOmbreScala,t.ombre.scala,t.ombre.offset),e.uniform4f(i.uAltRett,t.altRett[0],t.altRett[1],t.altRett[2],t.altRett[3])),t.legaMappa(i);let s=0,l=0,c=0;e.uniform1f(i.uSagoma,0);for(let[p,f]of this.tipi)f.n!==0&&(e.uniform4f(i.uBuco,r[0],r[1],r[2],p==="omino"?0:r[3]),e.bindVertexArray(f.vao),f.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,f.ibo),e.bufferData(e.ARRAY_BUFFER,f.istanze,e.DYNAMIC_DRAW),f.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,f.vertici,f.n),s++,l+=f.triangoli*f.n,c+=f.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&t.vpCorrente!==t.vpSpecchio&&(e.uniform1f(i.uSagoma,1),e.depthFunc(e.GREATER),e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.bindVertexArray(u.vao),e.drawArraysInstanced(e.TRIANGLES,0,u.vertici,u.n),e.disable(e.BLEND),e.depthMask(!0),e.depthFunc(e.LESS),e.uniform1f(i.uSagoma,0),s++),e.bindVertexArray(null),this.statistiche.disegni=s,this.statistiche.triangoli=l,this.statistiche.istanze=c}};var Xn=`#version 300 es
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
}`,$n=`#version 300 es
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
}`,He=class{constructor(t){this.gl=t,this.programma=ut(t,Xn,$n),this.u={};for(let o of["uVP","uCam","uSoleForza"])this.u[o]=t.getUniformLocation(this.programma,o);this.vao=t.createVertexArray(),this.ibo=t.createBuffer(),t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.ibo),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,4,t.FLOAT,!1,32,0),t.vertexAttribDivisor(0,1),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,32,16),t.vertexAttribDivisor(1,1),t.bindVertexArray(null),this.n=0,this.attivo=!0,this.statistiche={disegni:0,bagliori:0}}istanze(t){let o=this.gl,e=t instanceof Float32Array?t:new Float32Array(t);this.n=e.length/8,o.bindBuffer(o.ARRAY_BUFFER,this.ibo),o.bufferData(o.ARRAY_BUFFER,e,o.DYNAMIC_DRAW)}disegna(t,o){let e=this.gl,i=this.u;if(!this.attivo||this.n===0){this.statistiche.disegni=0,this.statistiche.bagliori=0;return}e.useProgram(this.programma),e.uniformMatrix4fv(i.uVP,!1,t.vp),e.uniform3f(i.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(i.uSoleForza,t.sole.forza),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLES,0,6,this.n),e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),this.statistiche.disegni=1,this.statistiche.bagliori=this.n}};it();var _=16,jn=256,Ze=2048,Ii=64,ht=(a,t,o)=>((a+Ze)*4096+(o+Ze))*256+(t+Ii),ae=a=>Math.floor(a/(256*4096))-Ze,ne=a=>Math.floor(a/256)%4096-Ze,re=a=>a%256-Ii;var Xt=(a,t)=>Math.floor(a/_)+","+Math.floor(t/_),je=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this.bagnate=new Map,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(t){this.generati.add(t)}_annotaModifica(t,o,e,i){if(!this.frontiera)return;let n=Xt(t,e),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(ht(t,o,e),i)}applicaModifiche(t){let o=this.modifiche.get(t);if(!o)return 0;for(let[e,i]of o){let n=ae(e),r=re(e),s=ne(e);i===null?this.togli(n,r,s,!0):this.metti(n,r,s,i,!0)}return o.size}scaricaChunk(t){let o=this.chunks.get(t);if(!o)return this.generati.delete(t),[];let e=[];for(let[i,n]of o){let r=F(n);r&&r.forma==="modello"&&e.push([ae(i),re(i),ne(i),n])}return this.contaBlocchi-=o.size,this.chunks.delete(t),this._scordaMemo(),this.generati.delete(t),this._tocca(t,this.sporchi),e}_cambiata(t,o,e){if(this.cambiate.length>=3*jn){this.troppiCambi=!0;return}this.cambiate.push(t,o,e)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(t,o){let e=Math.floor(t/_),i=Math.floor(o/_);if(this._memoChunk!==null&&this._memoCx===e&&this._memoCz===i)return this._memoChunk;let n=this.chunks.get(e+","+i)||null;return this._memoCx=e,this._memoCz=i,this._memoChunk=n,n}tipo(t,o,e){let i=this._chunkDi(t,e);return i&&i.get(ht(t,o,e))||null}pieno(t,o,e){return this.tipo(t,o,e)!==null}solido(t,o,e){let i=this.tipo(t,o,e);if(i&&F(i).solido)return!0;let n=this.furni.get(ht(t,o,e));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(t,o,e){if(!this.solido(t,o-1,e)||this.solido(t,o,e)||this.solido(t,o+1,e))return!1;let i=this.tipo(t,o,e);return!(i&&F(i).acqua)}_sporca(t,o,e=this.sporchi){let i=(t%_+_)%_,n=(o%_+_)%_;this._tocca(Xt(t,o),e),i===0&&this._tocca(Xt(t-1,o),e),i===_-1&&this._tocca(Xt(t+1,o),e),n===0&&this._tocca(Xt(t,o-1),e),n===_-1&&this._tocca(Xt(t,o+1),e)}_tocca(t,o){o.add(t),this._rev.set(t,(this._rev.get(t)||0)+1)}revisione(t){return this._rev.get(t)||0}metti(t,o,e,i,n=!1){let r=Xt(t,e),s=this.chunks.get(r);s||(s=new Map,this.chunks.set(r,s),this._scordaMemo());let l=ht(t,o,e),c=s.get(l);c===void 0&&this.contaBlocchi++,s.set(l,i);let u=i.charCodeAt(0)===97&&i.startsWith("acqua")&&(c===void 0||c.startsWith("acqua"));this._sporca(t,e,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(t,o,e),n||(this._annotaModifica(t,o,e,i),this.onEvento&&this.onEvento({tipo:"metti",cella:[t,o,e],blocco:i}))}togli(t,o,e,i=!1){let n=Xt(t,e),r=this.chunks.get(n);if(!r)return!1;let s=ht(t,o,e),l=r.get(s);if(!r.delete(s))return!1;this.bagnate.delete(s),this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let c=!!(l&&l.startsWith("acqua"));return this._sporca(t,e,c?this.sporchiAcqua:this.sporchi),c||this._cambiata(t,o,e),i||(this._annotaModifica(t,o,e,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[t,o,e]})),!0}bagna(t,o,e,i=0){this.bagnate.set(ht(t,o,e),Math.max(0,Math.min(15,i|0))),this._sporca(t,e,this.sporchiAcqua)}asciuga(t,o,e){return this.bagnate.delete(ht(t,o,e))?(this._sporca(t,e,this.sporchiAcqua),!0):!1}bagnata(t,o,e){let i=this.bagnate.get(ht(t,o,e));return i===void 0?null:i}occupaFurni(t,o){for(let[e,i,n]of t)this.furni.set(ht(e,i,n),o)}liberaFurni(t){for(let[o,e,i]of t)this.furni.delete(ht(o,e,i))}furniIn(t,o,e){return this.furni.get(ht(t,o,e))||null}occupaOmbra(t,o=!1){for(let[e,i,n]of t){let r=ht(e,i,n),s=this.ombreFurni.get(r);if(s){s.n++,o&&s.op++===0&&this._cambiata(e,i,n);continue}this.ombreFurni.set(r,{x:e,y:i,z:n,n:1,op:o?1:0}),this._cambiata(e,i,n)}}liberaOmbra(t,o=!1){for(let[e,i,n]of t){let r=ht(e,i,n),s=this.ombreFurni.get(r);s&&(o&&s.op>0&&--s.op===0&&s.n>1&&this._cambiata(e,i,n),!(--s.n>0)&&(this.ombreFurni.delete(r),this._cambiata(e,i,n)))}}ombraFurniIn(t,o,e){let i=this.ombreFurni.get(ht(t,o,e));return i?i.op>0?2:1:0}appoggioInColonna(t,o,e,i=8){for(let n=e;n>e-i;n--)if(this.calpestabile(t,n,o))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let t of this._rev.keys())this._rev.set(t,this._rev.get(t)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let t of this.chunks.values())for(let[o,e]of t)yield{x:ae(o),y:re(o),z:ne(o),tipo:e}}perOgni(t){for(let o of this.chunks.values())for(let[e,i]of o)t(ae(e),re(e),ne(e),i)}*blocchiDelChunk(t){let o=this.chunks.get(t);if(o)for(let[e,i]of o)yield{x:ae(e),y:re(e),z:ne(e),tipo:i}}perOgniDelChunk(t,o){let e=this.chunks.get(t);if(e)for(let[i,n]of e)o(ae(i),re(i),ne(i),n)}};function _e(a,t,o){let e=a*374761393+t*668265263+o*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function Ni(a){return a*a*(3-2*a)}function Bo(a,t,o){let e=Math.floor(a),i=Math.floor(t),n=Ni(a-e),r=Ni(t-i),s=_e(e,i,o),l=_e(e+1,i,o),c=_e(e,i+1,o),u=_e(e+1,i+1,o);return s+(l-s)*n+(c-s)*r+(s-l-c+u)*n*r}var Vo=5;function wi(a,t,o,e=1){let i=[],n=t*16,r=o*16;for(let s=n;s<n+16;s++)for(let l=r;l<r+16;l++){let c=.55*Bo(s*.028,l*.028,e)+.3*Bo(s*.07,l*.07,e+11)+.15*Bo(s*.16,l*.16,e+29),u=Math.max(2,1+Math.round(Math.pow(Math.max(0,c),1.6)*22)),p=u<=Vo+1;for(let f=0;f<u;f++){let d=f===u-1?p?"sabbia":"erba":f<u-3?"roccia":"terra";a.metti(s,f,l,d,!0)}if(u<=Vo)for(let f=u;f<=Vo;f++)a.metti(s,f,l,"acqua",!0);else if(!p){let f=_e(s*3+1,l*3+7,e+101);f>.988?i.push([s,u,l,"albero"]):f<.004&&i.push([s,u,l,"lampione"])}}return i}it();var se={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function qi(){for(let[a,t]of Object.entries(se))Gt(a,{nome:t.nome,cima:t.cima,lato:t.lato,fondo:t.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:t.modello,altezza:t.altezza,mezza:t.mezza},ie)}it();it();var Kn={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:a=>a*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:a=>a*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:a=>a*.38+.58}}},ce="primavera";function Pi(){return ce}var ye=null;function Fi(){return ye}function Ke(a,t,o){let e=a>>16&255,i=a>>8&255,n=a&255,r=t>>16&255,s=t>>8&255,l=t&255,c=(u,p)=>Math.round(u+(p-u)*o);return c(e,r)<<16|c(i,s)<<8|c(n,l)}function Qe(a,t){if(ye){let o=ce;ce=ye.da;let e=Go(a,t);ce=ye.a;let i=Go(a,t);ce=o;let n=ye.mix;return{cima:We(e.cima,i.cima,n),lato:We(e.lato,i.lato,n),fondo:We(e.fondo,i.fondo,n),facce:e.facce,orlo:e.orlo!=null&&i.orlo!=null?We(e.orlo,i.orlo,n):e.orlo}}return Go(a,t)}function We(a,t,o){let e=Math.round((a>>16&255)+((t>>16&255)-(a>>16&255))*o),i=Math.round((a>>8&255)+((t>>8&255)-(a>>8&255))*o),n=Math.round((a&255)+((t&255)-(a&255))*o);return e<<16|i<<8|n}function Go(a,t){let o=F(a),e=Kn[ce],{cima:i,lato:n,fondo:r}=o;if(o.cappello&&e.erba&&!o.override&&(i=e.erba[Xo(t,e.erba.length)]),o.reagisce==="stagione"&&e.erba){let s=e.erba[Xo(t,e.erba.length)],l=o.reagisceForza??1;i=Ke(i,s,l),n=Ke(n,s,l*.45),r=Ke(r,s,l*.3)}else if(o.reagisce==="quota"){let s=Xo(t,8)/7,l=(o.reagisceForza??1)*.5,c=u=>Ke(u,16777215,s*l);i=c(i),n=c(n),r=c(r)}return a==="sabbia"&&e.sabbia&&({cima:i,lato:n,fondo:r}=e.sabbia),{cima:i,lato:n,fondo:r,facce:o.facce||null,orlo:o.orlo!=null?o.orlo:void 0}}function Dt(a,t,o){if(a.facce){let e=t*2+(o>0?0:1),i=a.facce[e];if(i!=null)return i}return t===1?o>0?a.cima:a.fondo:a.lato}function Xo(a,t=8){let o=(t-1)*2,e=(Math.round(a)%o+o)%o;return e>=t&&(e=o-e),e}var Je=class{constructor(t,{x:o=.5,y:e=10,z:i=.5}={}){this.mondo=t,this.x=o,this.y=e,this.z=i,this.vy=0,this.aTerra=!1,this.verso=0,this._coyote=0}_solido(t,o,e){return this.mondo.solido(Math.floor(t),Math.floor(o),Math.floor(e))}_urta(t,o,e){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(t+n,o+.05,e+r)||this._solido(t+n,o+.9-.05,e+r))return!0;return!1}_pavimento(t,o,e){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(t+n,o-.02,e+r))return!0;return!1}aggiorna(t,o,e){let i=Math.min(t,.05),n=o.avanti||0,r=o.destra||0,s=Math.hypot(n,r),l=0,c=0;if(s>.01){let h=e?e.x:0,d=e?e.z:-1,m=Math.hypot(h,d)||1;h/=m,d/=m;let g=-d,v=h;l=(h*n+g*r)/s,c=(d*n+v*r)/s,this.verso=Math.atan2(l,c)}let u=l*4.6*i,p=c*4.6*i;if(u!==0&&(this._urta(this.x+u,this.y,this.z)?this._urta(this.x+u,this.y+1.02,this.z)||(this.x+=u,this.y+=1.02):this.x+=u),p!==0&&(this._urta(this.x,this.y,this.z+p)?this._urta(this.x,this.y+1.02,this.z+p)||(this.z+=p,this.y+=1.02):this.z+=p),this.aTerra?this._coyote=.08:this._coyote=Math.max(0,this._coyote-i),o.salta&&this._coyote>0&&(this.vy=8.2,this._coyote=0,this.aTerra=!1),this.vy<=0&&this._pavimento(this.x,this.y,this.z))return this.vy=0,this.aTerra=!0,this;this.vy-=26*i;let f=this.y+this.vy*i;if(this.vy<=0){let h=this.y-f,d=Math.max(1,Math.ceil(h/.4));for(let m=1;m<=d;m++){let g=this.y-h*m/d;if(this._pavimento(this.x,g,this.z))return this.y=Math.floor(g-.02)+1,this.vy=0,this.aTerra=!0,this}this.aTerra=!1,this.y=f}else this._urta(this.x,f,this.z)&&(this.vy=0,f=this.y),this.y=f,this.aTerra=!1;return this}};function Di(a=window){let t=new Set,o={avanti:0,destra:0,salta:!1},e={KeyW:"su",ArrowUp:"su",KeyS:"giu",ArrowDown:"giu",KeyA:"sinistra",ArrowLeft:"sinistra",KeyD:"destra",ArrowRight:"destra",Space:"salta"},i=(n,r)=>{let s=e[n.code];s&&(n.target&&/^(INPUT|TEXTAREA)$/.test(n.target.tagName)||(r?t.add(s):t.delete(s),s==="salta"&&n.preventDefault(),o.avanti=(t.has("su")?1:0)-(t.has("giu")?1:0),o.destra=(t.has("destra")?1:0)-(t.has("sinistra")?1:0),o.salta=t.has("salta")))};return a.addEventListener("keydown",n=>i(n,!0)),a.addEventListener("keyup",n=>i(n,!1)),a.addEventListener("blur",()=>{t.clear(),o.avanti=o.destra=0,o.salta=!1}),o}function Yo(a,t,o,e=7){let i=Math.floor(t.x),n=Math.floor(t.y),r=Math.floor(t.z),s=Math.sign(o.x),l=Math.sign(o.y),c=Math.sign(o.z),u=s!==0?Math.abs(1/o.x):1/0,p=l!==0?Math.abs(1/o.y):1/0,f=c!==0?Math.abs(1/o.z):1/0,h=s!==0?(s>0?i+1-t.x:t.x-i)*u:1/0,d=l!==0?(l>0?n+1-t.y:t.y-n)*p:1/0,m=c!==0?(c>0?r+1-t.z:t.z-r)*f:1/0;if(a.solido(i,n,r))return{cella:[i,n,r],faccia:[0,1,0],prima:[i,n+1,r]};for(let g=0;g<e*3+3;g++){let v=0,b=0,x=0;if(h<=d&&h<=m){if(h>e)break;i+=s,h+=u,v=-s}else if(d<=m){if(d>e)break;n+=l,d+=p,b=-l}else{if(m>e)break;r+=c,m+=f,x=-c}if(a.solido(i,n,r))return{cella:[i,n,r],faccia:[v,b,x],prima:[i+v,n+b,r+x]}}return null}function $o(a,t,o,e,i,n=null){let r=0,s=i,l=-1,c=0,u=["x","y","z"];for(let p=0;p<3;p++){let f=u[p],h=t[f];if(Math.abs(h)<1e-9){if(a[f]<o[f]||a[f]>e[f])return-1;continue}let d=(o[f]-a[f])/h,m=(e[f]-a[f])/h,g=-1;if(d>m){let v=d;d=m,m=v,g=1}if(d>r&&(r=d,l=p,c=g),m<s&&(s=m),r>s)return-1}return n&&l>=0&&(n[0]=n[1]=n[2]=0,n[l]=c),r}function Ui(a,t,o,e,i=7){let n=Yo(a,t,o,i),r=1/0;if(n){let c=n.cella,u=c[0]+.5-t.x,p=c[1]+.5-t.y,f=c[2]+.5-t.z;r=Math.sqrt(u*u+p*p+f*f)}let s=null,l=r;for(let c of e||[]){let u=$o(t,o,c.min,c.max,i);u>=0&&u<l&&(l=u,s=c)}if(s){let c=s.dato&&s.dato.cella,u=n&&n.prima,p=n&&n.faccia;if(c){let f=[0,0,0],h=$o(t,o,{x:c[0],y:c[1],z:c[2]},{x:c[0]+1,y:c[1]+1,z:c[2]+1},i,f);h<0&&(h=$o(t,o,s.min,s.max,i,f)),h>=0&&(f[0]||f[1]||f[2])&&(u=[c[0]+f[0],c[1]+f[1],c[2]+f[2]],p=f),u||(u=[c[0],c[1]+1,c[2]],p=[0,1,0])}return{...n,cella:n?n.cella:c||null,faccia:p,scatola:s,dato:s.dato,distanza:l,prima:u}}return n}it();var to=[null,"erba","terra","pietra","mattoni","legno","sabbia","neve","lanaRossa","lanaBlu","lanaGialla","lampadaPesante","lampadaRossa","lampadaVerde","lampadaBlu","lucciola","albero","lampione","erbetta"],_t={erbetta:{nome:"Erbetta",colore:6601551,agisce:"erba"}};function ki(a,t,o,e){let i=a.tipo(t,o,e);if(i==null)return!0;let n=F(i);return!!(n&&n.acqua)}var eo=class{constructor(){this.dove=null,this.durata=550,this.inizio=0,this._ultimeSchegge=0}premi(t,o,e){this.dove!==t&&(this.dove=t,this.durata=Math.max(60,o||550),this.inizio=e,this._ultimeSchegge=e)}molla(){this.dove=null,this.inizio=0}progresso(t){return this.dove?Math.min(1,(t-this.inizio)/this.durata):0}finito(t){return!this.dove||this.progresso(t)<1?!1:(this.molla(),!0)}schegge(t){return!this.dove||t-this._ultimeSchegge<130?!1:(this._ultimeSchegge=t,!0)}};function Bi(a){return a?a.salute>=100?1100:a.fam==="mina"?750:a.fam==="taglia"?600:380:550}function Vi(a,t){let o=new Map;a.addEventListener("pointerdown",i=>{o.set(i.pointerId+":"+i.button,{x:i.clientX,y:i.clientY,t:performance.now()})});let e=i=>{let n=i.pointerId+":"+i.button,r=o.get(n);if(!r)return;o.delete(n),Math.hypot(i.clientX-r.x,i.clientY-r.y)<=6&&performance.now()-r.t<=500&&t(i)};a.addEventListener("pointerup",e),a.addEventListener("pointercancel",i=>{for(let n of[...o.keys()])n.startsWith(i.pointerId+":")&&o.delete(n)})}function Gi(a,{onInizio:t,onFine:o},e=0){let i=null,n=s=>{i&&(i=null,o&&o(s))};a.addEventListener("pointerdown",s=>{s.button===e&&(i={id:s.pointerId,x:s.clientX,y:s.clientY},t&&t(s))}),a.addEventListener("pointermove",s=>{!i||s.pointerId!==i.id||Math.hypot(s.clientX-i.x,s.clientY-i.y)>6&&n("trascinamento")});let r=s=>{i&&s.pointerId===i.id&&n("rilascio")};a.addEventListener("pointerup",r),a.addEventListener("pointercancel",r),addEventListener("blur",()=>n("fuoco perso"))}var Wn=`
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
`,oo=class{constructor(t,{visibile:o=!0,onDemolisci:e=null}={}){this.intento=t,this.demolisci=!1;let i=document.createElement("style");i.textContent=Wn,document.head.appendChild(i);let n=this.root=document.createElement("div");n.id="comandi",n.innerHTML=`
      <div class="stick"><div class="knob"></div></div>
      <button class="btn salta" title="Salta">\u2934</button>
      <!-- \u26A0 SUL TELEFONO IL DITO \xC8 UN TASTO SOLO, e questo bottone dice quale
           dei due sta emulando: acceso = il sinistro (rompe, a colpi ripetuti),
           spento = il destro (posa, o accende a mano vuota). Senza di lui met\xE0
           dei verbi del gioco sarebbero irraggiungibili col tocco. -->
      <button class="btn demolisci" title="Piccone: i tocchi rompono (a pi\xF9 colpi)">\u26CF</button>`,document.body.appendChild(n),o||this.mostra(!1);let r=n.querySelector(".stick"),s=n.querySelector(".knob"),l=null,c=0,u=0,p=58,f=(x,z)=>{s.style.transform=`translate(${x*p*.62}px, ${z*p*.62}px)`,this.intento.avanti=-z,this.intento.destra=x},h=x=>{if(x.pointerId!==l)return;let z=(x.clientX-c)/p,A=(x.clientY-u)/p,M=Math.hypot(z,A);M>1&&(z/=M,A/=M),f(z,A),x.preventDefault()};r.addEventListener("pointerdown",x=>{l=x.pointerId;try{r.setPointerCapture(x.pointerId)}catch{}let z=r.getBoundingClientRect();c=z.left+z.width/2,u=z.top+z.height/2,p=z.width/2,h(x)}),r.addEventListener("pointermove",h);let d=x=>{x.pointerId===l&&(l=null,f(0,0))};r.addEventListener("pointerup",d),r.addEventListener("pointercancel",d);let m=n.querySelector(".salta"),g=x=>{x.preventDefault(),this.intento.salta=!0,m.classList.add("premuto")},v=()=>{this.intento.salta=!1,m.classList.remove("premuto")};m.addEventListener("pointerdown",g),m.addEventListener("pointerup",v),m.addEventListener("pointercancel",v),m.addEventListener("pointerleave",v);let b=n.querySelector(".demolisci");b.addEventListener("pointerdown",x=>{x.preventDefault(),this.demolisci=!this.demolisci,b.classList.toggle("acceso",this.demolisci),e&&e(this.demolisci)})}mostra(t){this.root.style.display=t?"":"none"}azzera(){this.intento.avanti=0,this.intento.destra=0,this.intento.salta=!1;let t=this.root.querySelector(".knob");t&&(t.style.transform="")}};var Xi="leafy.gui",Qn="gui-tocco";var io=class{constructor(t){this.onCambio=t,this.scelta=(()=>{try{return localStorage.getItem(Xi)||"auto"}catch{return"auto"}})();let o=document.createElement("style");if(o.textContent=`
`,document.head.appendChild(o),this.nodo=document.createElement("div"),this.nodo.id="modoGui",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.cicla()),typeof matchMedia=="function"){this._mq=matchMedia("(pointer: coarse)");let e=()=>{this.scelta==="auto"&&this.applica()};this._mq.addEventListener&&this._mq.addEventListener("change",e)}this.applica()}get automatico(){return!!(this._mq&&this._mq.matches)}get aTocco(){return this.scelta==="tocco"?!0:this.scelta==="mouse"?!1:this.automatico}cicla(){this.scelta=this.scelta==="auto"?"tocco":this.scelta==="tocco"?"mouse":"auto";try{localStorage.setItem(Xi,this.scelta)}catch{}this.applica()}applica(){let t=this.aTocco;document.documentElement.classList.toggle(Qn,t),this.nodo.classList.toggle("fissato",this.scelta!=="auto"),this.nodo.innerHTML=t?"<b>\u{1F4F1}</b> a dito":"<b>\u{1F5A5}</b> col mouse",this.nodo.title=this.scelta==="auto"?`Interfaccia: automatica (adesso ${t?"a dito":"col mouse"}) \u2014 tocca per fissarla`:`Interfaccia: ${t?"a dito":"col mouse"}, fissata \u2014 tocca per cambiare`,this.onCambio&&this.onCambio(t)}};function $i(a={}){let t=(o,e=1)=>typeof o=="number"&&isFinite(o)?+o.toFixed(e):null;return{quando:a.quando||null,gioco:"Leafy-Shadows",versione:a.versione||"in sviluppo",nota:typeof a.nota=="string"?a.nota.slice(0,400):"",dispositivo:{classe:a.mobile?"mobile":"desktop",tocco:!!a.tocco,modoGui:a.modoGui||"auto",ua:(a.ua||"").slice(0,220),cpu:a.cpu||null,memoriaGB:a.memoriaGB||null},schermo:{css:a.css||null,reso:a.reso||null,dpr:t(a.dpr,3),rapporto:a.css&&a.reso&&a.css[0]?t(a.reso[0]/a.css[0],2):null},qualita:{livello:a.livello,di:a.quantiLivelli,manuale:!!a.manuale,profilo:a.profilo||null,ombreLampade:!!a.ombreLampade,antialias:!!a.antialias},prestazioni:{fps:t(a.fps,0),p50ms:t(a.p50,2),p99ms:t(a.p99,2),disegni:a.disegni??null,triangoli:a.triangoli??null,ombreMs:t(a.ombreMs,2),storiaFps:Array.isArray(a.storiaFps)?a.storiaFps.slice(-60).map(o=>Math.round(o)):[],storiaLivelli:Array.isArray(a.storiaLivelli)?a.storiaLivelli.slice(-20):[]},scheda:{nome:(a.scheda||"").slice(0,120),software:!!a.software},mondo:{chunk:a.chunk??null,blocchi:a.blocchi??null,luci:a.luci??null,decorazioni:a.decorazioni??null,erba:a.erba??null,ora:a.ora||null,giorno:a.giorno??null,worldgenMs:t(a.worldgenMs,0),meshMs:t(a.meshMs,0)},errori:(a.errori||[]).slice(-12).map(o=>String(o).slice(0,500)),scatto:a.scatto||null}}function Yi(a){return Math.round(JSON.stringify(a).length/1024)}var Jn=new Uint32Array([1116352408,1899447441,3049323471,3921009573,961987163,1508970993,2453635748,2870763221,3624381080,310598401,607225278,1426881987,1925078388,2162078206,2614888103,3248222580,3835390401,4022224774,264347078,604807628,770255983,1249150122,1555081692,1996064986,2554220882,2821834349,2952996808,3210313671,3336571891,3584528711,113926993,338241895,666307205,773529912,1294757372,1396182291,1695183700,1986661051,2177026350,2456956037,2730485921,2820302411,3259730800,3345764771,3516065817,3600352804,4094571909,275423344,430227734,506948616,659060556,883997877,958139571,1322822218,1537002063,1747873779,1955562222,2024104815,2227730452,2361852424,2428436474,2756734187,3204031479,3329325298]),It=(a,t)=>a>>>t|a<<32-t;function Hi(a){let t=new Uint32Array([1779033703,3144134277,1013904242,2773480762,1359893119,2600822924,528734635,1541459225]),o=a.length*8,e=new Uint8Array(a.length+9+63>>6<<6);e.set(a),e[a.length]=128,new DataView(e.buffer).setUint32(e.length-4,o>>>0),new DataView(e.buffer).setUint32(e.length-8,Math.floor(o/4294967296));let i=new Uint32Array(64),n=new DataView(e.buffer);for(let s=0;s<e.length;s+=64){for(let g=0;g<16;g++)i[g]=n.getUint32(s+g*4);for(let g=16;g<64;g++){let v=It(i[g-15],7)^It(i[g-15],18)^i[g-15]>>>3,b=It(i[g-2],17)^It(i[g-2],19)^i[g-2]>>>10;i[g]=i[g-16]+v+i[g-7]+b>>>0}let[l,c,u,p,f,h,d,m]=t;for(let g=0;g<64;g++){let v=It(f,6)^It(f,11)^It(f,25),b=f&h^~f&d,x=m+v+b+Jn[g]+i[g]>>>0,z=It(l,2)^It(l,13)^It(l,22),A=l&c^l&u^c&u,M=z+A>>>0;m=d,d=h,h=f,f=p+x>>>0,p=u,u=c,c=l,l=x+M>>>0}t[0]=t[0]+l>>>0,t[1]=t[1]+c>>>0,t[2]=t[2]+u>>>0,t[3]=t[3]+p>>>0,t[4]=t[4]+f>>>0,t[5]=t[5]+h>>>0,t[6]=t[6]+d>>>0,t[7]=t[7]+m>>>0}let r="";for(let s of t)r+=s.toString(16).padStart(8,"0");return r}var tr="https://ntfy.sh",er=4096;async function or(a){let t=new TextEncoder().encode("leafy-shadows/"+a),o;if(globalThis.crypto&&crypto.subtle){let e=await crypto.subtle.digest("SHA-256",t);o=[...new Uint8Array(e)].map(i=>i.toString(16).padStart(2,"0")).join("")}else o=Hi(t);return"leafy-"+o.slice(0,24)}async function Zi(a,t){let o=await or(a),e=await fetch(`${tr}/${o}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:t});if(!e.ok)return{ok:!1,dice:`il servizio ha detto no: ${e.status}`};let i=await e.json().catch(()=>({})),n=t.length>er;return{ok:!0,id:i.id||"",dice:n?`mandato \u2714 (${Math.round(t.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(t.length/1024)} KB, dura 12 ore)`}}var ji="leafy.diagnostica.chiave",ir=`
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
`,ao=class{constructor(t,o){this.leggi=t,this.scatta=o,this.errori=[],addEventListener("error",i=>this._errore(i.error||i.message)),addEventListener("unhandledrejection",i=>this._errore(i.reason));let e=document.createElement("style");e.textContent=ir,document.head.appendChild(e),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(t){let o=t&&t.stack?t.stack:String(t);this.errori.push(o),this.errori.length>40&&this.errori.shift()}get chiave(){try{return localStorage.getItem(ji)||""}catch{return""}}set chiave(t){try{localStorage.setItem(ji,t)}catch{}}apri(){let t=this.pannello;t.classList.add("aperto"),t.innerHTML=`
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
      <div class="esito" id="diagEsito"></div>`,t.querySelector("#diagChiudi").onclick=()=>t.classList.remove("aperto"),t.querySelector("#diagCopia").onclick=()=>this.vai(!0),t.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let o=t.querySelector("#diagNota");o&&o.focus()},30)}_dice(t){let o=this.pannello.querySelector("#diagEsito");o&&(o.textContent=t)}async vai(t){let o=this.pannello.querySelector("#diagChiave");o&&o.value.trim()&&(this.chiave=o.value.trim());let e=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let i=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,n=null;if(i)try{n=this.scatta?await this.scatta():null}catch(u){this._errore(u)}let r=$i({...this.leggi(),quando:new Date().toISOString(),nota:e,errori:this.errori,scatto:n}),s=Yi(r),l=JSON.stringify(r,null,1);if(t){await this._negliAppunti(l),this.nodo.classList.remove("corso");return}let c=!1;try{let u=await fetch("/_diagnostica",{method:"GET"});c=u.ok&&(await u.json().catch(()=>({}))).collettore===!0}catch{c=!1}if(c)try{let u=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json","x-chiave":this.chiave},body:l});if(u.status===403)this._dice("password sbagliata."),this.chiave="";else if(u.status===429)this._dice("troppi tentativi: riprova fra dieci minuti.");else if(!u.ok)this._dice("il collettore ha detto no: "+u.status);else{let p=await u.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${p.nome||""}  (${s} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}if(!this.chiave){this._dice("serve la password: \xE8 l'indirizzo dove finisce il rapporto."),this.nodo.classList.remove("corso");return}try{let u=await Zi(this.chiave,l);this._dice(u.ok?u.dice+`
(fuori casa: passa dal cloud)`:u.dice),u.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(l,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(t,o=""){try{await navigator.clipboard.writeText(t),this._dice(o+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let e=new Blob([t],{type:"application/json"}),i=document.createElement("a");i.href=URL.createObjectURL(e),i.download="leafy-diagnostica.json",i.click(),setTimeout(()=>URL.revokeObjectURL(i.href),4e3),this._dice(o+`scaricato come file \u2714
mandami quello.`)}}};var ar=4,no=class{constructor(t,o,{margineGenera:e=2*_,margineTieni:i=6*_}={}){this.mondo=t,this.genera=o,this.margineGenera=e,this.margineTieni=i,this._coda=[],this._chunkOsservatore=null,this.statistiche={generati:0,scaricati:0,inCoda:0,ultimaMs:0},t.frontiera=this}assicura(t,o,e,{subito:i=!1}={}){let n=performance.now(),r=Math.floor(t/_),s=Math.floor(o/_),l=r+","+s,c=e&&Number.isFinite(e.resa)?e.resa:4*_;(l!==this._chunkOsservatore||i)&&(this._chunkOsservatore=l,this._riesamina(r,s,t,o,c));let u=0,p=i?1/0:ar;for(;this._coda.length&&u<p;){let f=this._coda.shift();this.mondo.generati.has(f)||(this._generaChunk(f),u++)}return this.statistiche.inCoda=this._coda.length,this.statistiche.ultimaMs=performance.now()-n,u}_riesamina(t,o,e,i,n){let r=n+this.margineGenera,s=n+this.margineTieni,l=Math.ceil(r/_)+1,c=[];for(let u=-l;u<=l;u++)for(let p=-l;p<=l;p++){let f=t+u+","+(o+p);if(this.mondo.generati.has(f))continue;let h=Ki(t+u,o+p,e,i);h<=r&&c.push([h,f])}c.sort((u,p)=>u[0]-p[0]),this._coda=c.map(u=>u[1]);for(let u of[...this.mondo.generati]){let p=u.indexOf(",");Ki(+u.slice(0,p),+u.slice(p+1),e,i)>s&&this._scaricaChunk(u)}}_generaChunk(t){let o=t.indexOf(","),e=+t.slice(0,o),i=+t.slice(o+1),n=this.genera(this.mondo,e,i)||[];this.mondo.segnaGenerato(t);let r=this.mondo.modifiche.get(t);for(let[s,l,c,u]of n)r&&r.has(Qi(s,l,c))||(this.mondo.metti(s,l,c,u),this.mondo.modifiche.get(t)?.delete(Qi(s,l,c)));this.mondo.applicaModifiche(t),this.statistiche.generati++}_scaricaChunk(t){let o=this.mondo.scaricaChunk(t);if(this.mondo.onEvento)for(let[e,i,n]of o)this.mondo.onEvento({tipo:"togli",cella:[e,i,n]});this.statistiche.scaricati++}};function Ki(a,t,o,e){let i=a*_,n=t*_,r=Math.max(i-o,0,o-(i+_)),s=Math.max(n-e,0,e-(n+_));return Math.sqrt(r*r+s*s)}var Wi=2048,nr=64,Qi=(a,t,o)=>((a+Wi)*4096+(o+Wi))*256+(t+nr);it();function Ho(a,t,o){let e=(a|0)*374761393+(t|0)*668265263+(o|0)*2147483647;return e=(e^e>>>13)*1274126177,e=e^e>>>16,(e>>>0)%1e3/1e3}function rr(a,t){let o=a>>16&255,e=a>>8&255,i=a&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+t))));return n(o)<<16|n(e)<<8|n(i)}function sr(a,t,o,e,i,n){if(!t||t==="liscio"||!o)return a;let r=0;return t==="chiazze"?r=(Ho(e,i,n)-.5)*2:t==="venature"?r=(Ho(0,i,0)-.5)*2*.7+(Ho(e,i,n)-.5)*.3:t==="sfumato"&&(r=(i%16+16)%16/16-.5),rr(a,r*o*.34)}function Ji(a,t,o,e,i,n){if(!t||t==="liscio"||!o)return a;let r=s=>sr(s,t,o,e,i,n);return{cima:r(a.cima),lato:r(a.lato),fondo:r(a.fondo),facce:a.facce?a.facce.map(r):null}}var ta={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},cr=Object.keys(ta);function ea(a){return!a||!a.materia?null:ta[a.materia]||null}function $t(a,t,o=0){if(!t)return a;let e=(a>>16&255)/255,i=(a>>8&255)/255,n=(a&255)/255,r=.2126*e+.7152*i+.0722*n,s=t.satura;e=r+(e-r)*s,i=r+(i-r)*s,n=r+(n-r)*s;let l=t.tinta*(1+o),c=u=>Math.max(0,Math.min(255,Math.round(u*l*255)));return c(e)<<16|c(i)<<8|c(n)}var lr=16;function oa(a){let t=cr.indexOf(a);return t<0||t+1>=lr?0:t+1}var Zo=1/16,ia=8*Zo,yt=9*Zo;function aa(a,t,o,e,i,n,r,s){let l=(u,p,f)=>[t+u,o+p,e+f];a.quad(l(-s,r,-s),l(s,r,-s),l(s,r,s),l(-s,r,s),Dt(i,1,1),[0,1,0]),a.quad(l(-s,n,-s),l(s,n,-s),l(s,n,s),l(-s,n,s),Dt(i,1,-1),[0,-1,0]);let c=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of c){let[p,,f]=u.d,h=-f,d=p,m=(g,v)=>l(p*s+h*v,g,f*s+d*v);a.quad(m(n,-s),m(r,-s),m(r,s),m(n,s),Dt(i,u.asse,u.segno),u.d)}}function ur(a,t,o,e,i){aa(a,t,o,e,i,-yt,0,ia)}function fr(a,t,o,e,i){aa(a,t,o,e,i,-yt,yt,5*Zo)}function pr(a,t,o,e,i){let n=(c,u,p)=>[t+c,o+u,e+p],r=Dt(i,0,1),s=ia,l=[[[-s,-yt,-s],[s,-yt,s],[s,yt,s],[-s,yt,-s],[1,0,-1]],[[-s,-yt,s],[s,-yt,-s],[s,yt,-s],[-s,yt,s],[1,0,1]]];for(let[c,u,p,f,h]of l)a.quad(n(...c),n(...u),n(...p),n(...f),r,h),a.quad(n(...c),n(...u),n(...p),n(...f),r,[-h[0],-h[1],-h[2]])}function hr(){}var na={lastra:ur,pilastro:fr,croce:pr,modello:hr},Kt=new Set(["lastra","pilastro","croce","modello"]);var Te=1/16,dr=[[0,1],[0,2],[1,2]],mr=[[1,0],[-1,0],[0,1],[0,-1]];function Yt(a,t,o,e,i,n,r,s,l){let c=[a,t,o];return c[e]+=i,c[n]+=r,c[s]+=l,c}var ra={tinta:1,satura:1};function sa(a,t,o,e,i,n,r=0){let s=8*Te,l=9*Te,c=(u,p)=>n(u===0?p:0,u===1?p:0,u===2?p:0);for(let u=0;u<3;u++)for(let p of[-1,1]){if(c(u,p))continue;let f=(u+1)%3,h=(u+2)%3,d=Dt(i,u,p),m=[0,0,0];m[u]=p,a.quad(Yt(t,o,e,u,p*l,f,-s,h,-s),Yt(t,o,e,u,p*l,f,+s,h,-s),Yt(t,o,e,u,p*l,f,+s,h,+s),Yt(t,o,e,u,p*l,f,-s,h,+s),d,m)}for(let[u,p]of dr){let f=3-u-p;for(let h of[-1,1])for(let d of[-1,1]){if(c(u,h)||c(p,d))continue;let m=u===1&&h>0||p===1&&d>0,g=u===1&&h<0||p===1&&d<0,v=m?i.cima:g?i.fondo:i.lato,b=r?$t(v,ra,r):v,x=[0,0,0];x[u]=h,x[p]=d,a.quad(Yt(t,o,e,u,h*l,p,d*s,f,-s),Yt(t,o,e,u,h*s,p,d*l,f,-s),Yt(t,o,e,u,h*s,p,d*l,f,+s),Yt(t,o,e,u,h*l,p,d*s,f,+s),b,x)}}for(let u of[-1,1])for(let p of[-1,1])for(let f of[-1,1])c(0,u)||c(1,p)||c(2,f)||a.tri([t+u*l,o+p*s,e+f*s],[t+u*s,o+p*l,e+f*s],[t+u*s,o+p*s,e+f*l],r?$t(p>0?i.cima:i.fondo,ra,r):p>0?i.cima:i.fondo,[u,p,f])}function ca(a,t,o,e,i,n){let r=(h,d)=>n(h,0,d),s=n(0,-1,0),l=i.cima,c=i.lato,u=i.fondo,p=i.orlo??i.cima,f=(h,d,m)=>[t+h*Te,o+d*Te,e+m*Te];s||a.quad(f(-8,-9,-8),f(8,-9,-8),f(8,-9,8),f(-8,-9,8),u,[0,-1,0]);for(let[h,d]of mr){if(r(h,d))continue;let m=-d,g=h,v=(x,z,A)=>f(x*h+A*m,z,x*d+A*g),b=[h,0,d];s||a.quad(v(8,-9,-8),v(9,-8,-8),v(9,-8,8),v(8,-9,8),u,[h,-1,d]),a.quad(v(9,-8,-8),v(9,2,-8),v(9,2,8),v(9,-8,8),c,b),a.quad(v(9,2,-8),v(10,3,-8),v(10,3,8),v(9,2,8),p,b),a.quad(v(10,3,-8),v(10,7,-8),v(10,7,8),v(10,3,8),p,b),a.quad(v(10,7,-8),v(9,8,-8),v(9,8,8),v(10,7,8),l,[h,1,d]),a.quad(v(8,8,-8),v(9,8,-8),v(9,8,8),v(8,8,8),l,[0,1,0])}for(let h of[-1,1])for(let d of[-1,1]){if(r(h,0)||r(0,d))continue;let m=(v,b,x)=>f(v*h,b,x*d),g=[h,0,d];s||a.tri(m(9,-8,8),m(8,-9,8),m(8,-8,9),u,[h,-1,d]),a.quad(m(9,-8,8),m(8,-8,9),m(8,2,9),m(9,2,8),c,g),a.quad(m(9,2,8),m(8,2,9),m(8,3,10),m(10,3,8),p,g),a.quad(m(10,3,8),m(8,3,10),m(8,7,10),m(10,7,8),p,g),a.quad(m(10,7,8),m(8,7,10),m(8,8,9),m(9,8,8),l,[h,1,d]),a.tri(m(8,8,8),m(9,8,8),m(8,8,9),l,[0,1,0])}a.quad(f(-8,8,-8),f(8,8,-8),f(8,8,8),f(-8,8,8),l,[0,1,0])}it();it();var gr=2,Ce=6,vr=256;function la(a){if(!a)return!1;let t=F(a);return!t.acqua&&!t.vetro&&!Kt.has(t.forma)}function fa(a,t,o,e){let i=t.indexOf(","),n=+t.slice(0,i),r=+t.slice(i+1),s=n*_-Ce,l=r*_-Ce,c=_+2*Ce,u=e-o+1,p=c,f=c*u*p,h=new Uint8Array(f),d=new Uint8Array(f),m=new Uint8Array(f),g=(A,M,I)=>((A-s)*u+(M-o))*p+(I-l),v=(A,M,I)=>A>=s&&A<s+c&&M>=o&&M<=e&&I>=l&&I<l+p,b=[];for(let A=s;A<s+c;A++)for(let M=l;M<l+p;M++){let I=!1;for(let w=e;w>=o;w--){let S=a.tipo(A,w,M),q=g(A,w,M);if(la(S)){m[q]=1,I=!0;continue}if(!I&&w===e){for(let C=e+1;C<vr&&C<e+40;C++)if(la(a.tipo(A,C,M))){I=!0;break}}if(I||(h[q]=15),S){let E=F(S).forma==="modello"&&se[S];E&&E.luce&&b.push([A,w+Math.round(E.luce.quota??1),M])}}}let x=[];for(let A=0;A<f;A++)h[A]===15&&x.push(A);ua(x,h,m,c,u,p,1);let z=[];for(let[A,M,I]of b){if(!v(A,M,I))continue;let w=g(A,M,I);d[w]=15,z.push(w)}return ua(z,d,m,c,u,p,gr),{x0:s,z0:l,yMin:o,yMax:e,W:c,H:u,D:p,cielo:h,blocco:d,leggi(A,M,I){if(!v(A,M,I))return M>e?[15,0]:[0,0];let w=g(A,M,I);return[h[w],d[w]]}}}function ua(a,t,o,e,i,n,r){let s=[i*n,-i*n,n,-n,1,-1],l=0;for(;l<a.length;){let c=a[l++],u=t[c]-r;if(u<=0)continue;let p=Math.floor(c/(i*n)),f=Math.floor(c/n)%i,h=c%n;for(let d=0;d<6;d++){if(d===0&&p===e-1||d===1&&p===0||d===2&&f===i-1||d===3&&f===0||d===4&&h===n-1||d===5&&h===0)continue;let m=c+s[d];o[m]||t[m]>=u||(t[m]=u,a.push(m))}}}var pa=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function Nt(a,t,o){let e=a*374761393+t*668265263+o*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}var ro=class{constructor(t,o=512){this.yBase=t,this.byte=new Uint8Array(o*12),this.n=0}_lamella(t,o,e,i,n,r,s,l,c,u=0,p=8){if((this.n+1)*12>this.byte.length){let d=new Uint8Array(this.byte.length*2);d.set(this.byte),this.byte=d}let f=this.n*12,h=this.byte;h[f]=t,h[f+1]=o,h[f+2]=e,h[f+3]=i,h[f+4]=n>>16&255,h[f+5]=n>>8&255,h[f+6]=n&255,h[f+7]=(r&15)<<2,h[f+8]=Math.max(1,Math.min(255,s)),h[f+9]=Math.max(1,Math.min(255,l)),h[f+10]=Math.max(0,Math.min(255,c+128)),h[f+11]=u&15|(p&15)<<4,this.n++}ciuffo(t,o,e,i,n,r,s,l=1,c=0){let u=pa[Math.floor(Nt(t,e,3)*pa.length)],p=Math.max(1,Math.round(u.n*l*(.82+.36*Nt(t,e,5)))),f=o+1-this.yBase;if(f<0||f*8>247)return 0;for(let h=0;h<p;h++){let d=Nt(t,e,h*17+5),m=Nt(t,e,h*17+11),g=Nt(t,e,h*17+41),v=Nt(t,e,h*17+59),b=Math.min(.98,.66+u.apri),x=t+.5+(d-.5)*b,z=e+.5+(m-.5)*b,A=Math.min(.8,u.alto*(.62+.8*Nt(t,e,h*17+71))*(.5+.6*Math.pow(g,1.5))),M=u.largo*(.8+.4*v),I=(Nt(t,e,h*17+83)-.5)*.5,w=Nt(t,e,h*17+89),S=w<.15?.9+.03*w:w>.85?1.07+.03*(w-.85):.97+.06*(w-.15)/.7,q=Math.max(0,Math.min(128,Math.round((x-i)*8))),C=Math.max(0,Math.min(128,Math.round((z-n)*8))),E=Math.floor(Nt(t,e,h*17+97)*255);this._lamella(q,C,Math.round(f*8),E,r,s,Math.round(A*64),Math.round(M*128),Math.round(I*128),c,Math.round((S-.9)/.2*15))}return p}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var le=64,br=[[1,0,0,ft(1,0,0),0,1],[-1,0,0,ft(-1,0,0),0,-1],[0,1,0,ft(0,1,0),1,1],[0,-1,0,ft(0,-1,0),1,-1],[0,0,1,ft(0,0,1),2,1],[0,0,-1,ft(0,0,-1),2,-1]],ha=(a,t,o)=>((t+1)*3+(o+1))*3+(a+1),jo=class{constructor(t,o,e,i,n){this.c=t,this.ox=o,this.oz=e,this._materia=0,this.luceDi=i,this.aria=n,this._cielo=15,this._cella=null}materia(t){this._materia=t|0}cella(t,o,e){this._cella=[t,o,e]}_cieloFaccia(t){let[o,e,i]=this._cella,n=-1;for(let r=0;r<3;r++){if(!t[r])continue;let s=this.luceDi(o+(r===0?t[0]:0),e+(r===1?t[1]:0),i+(r===2?t[2]:0))[0];s>n&&(n=s)}return n<0?this.luceDi(o,e+1,i)[0]:n}_bloccoVertice(t,o){let e=Math.hypot(o[0],o[1],o[2])||1,i=t[0]+o[0]/e*.5,n=t[1]+o[1]/e*.5,r=t[2]+o[2]/e*.5,s=0,l=0;for(let c of[-.45,.45])for(let u of[-.45,.45])for(let p of[-.45,.45]){let f=Math.floor(i+c),h=Math.floor(n+u),d=Math.floor(r+p);this.aria(f,h,d)&&(s+=this.luceDi(f,h,d)[1],l++)}return l?Math.round(s/l):0}_v(t,o,e,i){return[t[0]-this.ox,t[1]+le,t[2]-this.oz,o,this._cielo,this._bloccoVertice(t,i),e,0,this._materia]}_giro(t,o,e,i){let n=o[0]-t[0],r=o[1]-t[1],s=o[2]-t[2],l=e[0]-t[0],c=e[1]-t[1],u=e[2]-t[2],p=r*u-s*c,f=s*l-n*u,h=n*c-r*l;return p*i[0]+f*i[1]+h*i[2]<0}tri(t,o,e,i,n){if(this._giro(t,o,e,n)){let s=o;o=e,e=s}let r=ft(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(t,r,i,n),this._v(o,r,i,n),this._v(e,r,i,n),this._v(e,r,i,n))}quad(t,o,e,i,n,r){let s=ft(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(t,o,e,r)){let l=o;o=i,i=l}this.c.quadDa(this._v(t,s,n,r),this._v(o,s,n,r),this._v(e,s,n,r),this._v(i,s,n,r))}};function so(a){if(!a)return!1;let t=F(a);return!t.acqua&&!t.vetro&&!Kt.has(t.forma)}function da(a){return!!a&&a.charCodeAt(0)===97&&a.startsWith("acqua")}function ma(a,t,{erba:o=2,luce:e=!0}={}){let i=t.indexOf(","),n=+t.slice(0,i),r=+t.slice(i+1),s=n*_,l=r*_,c=new ze(1024),u=new ze(64),p=-1/0,f=new Int16Array(_*_).fill(-1),h=new Int16Array(_*_).fill(-1),d=new Int16Array(_*_).fill(-1),m=255,g=0,v=1/0,b=-1/0;a.perOgniDelChunk(t,(C,E)=>{E<v&&(v=E),E>b&&(b=E)});let x=e&&v<=b?fa(a,t,v-2,b+3):null,z=new ro(Number.isFinite(v)?v:0),A=(C,E,O)=>x?x.leggi(C,E,O):[15,0],M=new jo(c,s,l,A,(C,E,O)=>!so(a.tipo(C,E,O))),I=new Uint8Array(27),w=(C,E,O,R,P,G,Z,L)=>[C-s,E+le,O-l,R,G,Z,P,L?1:0,0],S=(C,E,O)=>da(a.tipo(C,E,O))||(a.bagnate?a.bagnata(C,E,O)!==null:!1);return a.perOgniDelChunk(t,(C,E,O,R)=>{let P=F(R),G=a.bagnate?a.bagnata(C,E,O):null;if(P.forma==="modello"&&P.modello==="albero")for(let U=-2;U<=2;U++)for(let X=-2;X<=2;X++){let W=U*U+X*X;if(W>4)continue;let et=C+U-s,Ct=O+X-l;if(et<0||et>=_||Ct<0||Ct>=_)continue;let ct=et*_+Ct,J=E+(W===0?4:W<=2?3:2);J>f[ct]&&(f[ct]=J)}if(P.forma==="modello"){let U=C-s,X=O-l;if(U>=0&&U<_&&X>=0&&X<_){let W=U*_+X,et=E+Math.max(1,Math.round(P.altezza||1));et>d[W]&&(d[W]=et)}}if(Kt.has(P.forma)&&G===null)return;let Z=da(R)||G!==null,L=E+le;if(L<0||L>254)return;let nt=(C-s)*_+(O-l);!Z&&E>f[nt]&&(f[nt]=E),!Z&&so(R)&&E>h[nt]&&(h[nt]=E);let Y=Qe(G!==null?"acqua":jt(R),E);P.motivo&&(Y=Ji(Y,P.motivo,P.motivoForza??1,C,E,O));let At=ea(P);At&&(Y={...Y,cima:$t(Y.cima,At),lato:$t(Y.lato,At),fondo:$t(Y.fondo,At)},Y.facce&&(Y.facce=Y.facce.map(U=>U==null?U:$t(U,At))));let Ee=At?oa(P.materia):0;if(!Z){I.fill(0);for(let ct=-1;ct<=1;ct++)for(let J=-1;J<=1;J++)for(let lt=-1;lt<=1;lt++)lt===0&&ct===0&&J===0||so(a.tipo(C+lt,E+ct,O+J))&&(I[ha(lt,ct,J)]=1);let U=(ct,J,lt)=>I[ha(ct,J,lt)]===1;M.materia(Ee),M.cella(C,E,O);let X=C+.5,W=E+.5,et=O+.5,Ct=P.forma&&na[P.forma];Ct?Ct(M,X,W,et,Y,()=>!1):P.cappello&&!U(0,1,0)?ca(M,X,W,et,Y,U):sa(M,X,W,et,Y,(J,lt,B)=>U(J,lt,B)?lt!==0?!0:!F(a.tipo(C+J,E,O+B)).cappello||U(J,1,B):!1,At?At.orlo:0),L-1<m&&(m=L-1),L+2>g&&(g=L+2)}let Vt=0,zt=0;if(Z)for(zt=Math.max(0,Math.min(15,G!==null?G:Mt(R)||0));Vt<15&&S(C,E-1-Vt,O);)Vt++;let Sn=(U,X)=>{if(!S(U,E,X))return-1;let W=0;for(;W<15&&S(U,E-1-W,X);)W++;return W},Ve=(U,X)=>{let W=0,et=0;for(let Ct of[U-1,U])for(let ct of[X-1,X]){let J=Sn(Ct,ct);J>=0&&(W+=J,et++)}return et?Math.round(W/et):Vt};if(Z)for(let[U,X,W,et,Ct,ct]of br){let J=a.tipo(C+U,E+X,O+W);if(S(C+U,E+X,O+W)||J&&so(J))continue;let lt=Dt(Y,Ct,ct),B=C,V=E,H=O,St,Rt,Lt,Ot;if(U===1?(St=[B+1,V,H],Rt=[B+1,V+1,H],Lt=[B+1,V+1,H+1],Ot=[B+1,V,H+1]):U===-1?(St=[B,V,H+1],Rt=[B,V+1,H+1],Lt=[B,V+1,H],Ot=[B,V,H]):X===1?(St=[B,V+1,H],Rt=[B,V+1,H+1],Lt=[B+1,V+1,H+1],Ot=[B+1,V+1,H]):X===-1?(St=[B,V,H+1],Rt=[B,V,H],Lt=[B+1,V,H],Ot=[B+1,V,H+1]):W===1?(St=[B+1,V,H+1],Rt=[B+1,V+1,H+1],Lt=[B,V+1,H+1],Ot=[B,V,H+1]):(St=[B,V,H],Rt=[B,V+1,H],Lt=[B+1,V+1,H],Ot=[B+1,V,H]),X===1){let Mi=E+(15-2*zt)/16;Mi>p&&(p=Mi)}u.quadDa(w(...St,et,lt,Ve(St[0],St[2]),zt,St[1]===V+1),w(...Rt,et,lt,Ve(Rt[0],Rt[2]),zt,Rt[1]===V+1),w(...Lt,et,lt,Ve(Lt[0],Lt[2]),zt,Lt[1]===V+1),w(...Ot,et,lt,Ve(Ot[0],Ot[2]),zt,Ot[1]===V+1)),L<m&&(m=L),L+1>g&&(g=L+1)}if(P.cappello&&o>0&&!a.tipo(C,E+1,O)){let[U,X]=A(C,E+1,O);z.ciuffo(C,E,O,s,l,Y.cima,U,o/2,X),E+2+le>g&&(g=E+2+le)}}),m>g&&(m=0,g=0),{...c.dati(),minY:m,maxY:g,y0:-le,cx:n,cz:r,altezze:f,solide:h,impronte:d,acqua:{...u.dati(),pelo:p===-1/0?null:p},erba:z.dati()}}var co=6,lo=class{constructor(t,o,e,{erba:i=8,raggioResa:n=96,budgetMs:r=5,lavoro:s=null}={}){this.mondo=t,this.resa=o,this.erba=i,this.raggioResa=n,this.budgetMs=r,this.lavoro=s,this._marca=new Map,this._vuoti=new Set,this.frontiera=new no(t,e,{margineGenera:2*_,margineTieni:5*_}),this.coda=new Set,this.statistiche={inCoda:0,costruiti:0,scaricati:0,ultimaMs:0,chunk:0,inVolo:0},this._ordine=[]}avvio(t,o){this.frontiera.assicura(t,o,{resa:this.raggioResa},{subito:!0}),this.aggiorna(t,o,1/0)}tocca(t,o){for(let e of[-co,0,co])for(let i of[-co,0,co])this.coda.add(Math.floor((t+e)/_)+","+Math.floor((o+i)/_))}aggiorna(t,o,e=this.budgetMs){let i=performance.now(),n=this.mondo,r=this.resa;this.frontiera.assicura(t,o,{resa:this.raggioResa});for(let s of n.sporchi)this.coda.add(s),this._vuoti.delete(s);n.sporchi.clear();for(let s of n.sporchiAcqua)this.coda.add(s);n.sporchiAcqua.clear();for(let s of n.generati)!r.chunks.has(s)&&!this._vuoti.has(s)&&!(this.lavoro&&this.lavoro.inVolo.has(s))&&this.coda.add(s);for(let s of[...r.chunks.keys()])n.generati.has(s)||(r.rimuovi(s),this.coda.delete(s),this.statistiche.scaricati++);if(this.coda.size){let s=this._ordine;s.length=0;for(let c of this.coda){let u=xr(c,t,o);u<=this.raggioResa+_&&s.push([u,c])}s.sort((c,u)=>c[0]-u[0]);let l=0;this._vicini=s.length;for(let[,c]of s){if(!this.lavoro&&l>0&&performance.now()-i>e||this.lavoro&&this.lavoro.vivo&&this.lavoro.liberi===0)break;if(!(this.lavoro&&this.lavoro.vivo&&this.lavoro.inVolo.has(c))&&(this.coda.delete(c),!!n.generati.has(c))){if(!n.chunks.has(c)){r.chunks.has(c)&&r.rimuovi(c),this._vuoti.add(c),this._vicini--;continue}if(this.lavoro&&this.lavoro.vivo&&e!==1/0){let u=(this._marca.get(c)||0)+1;this._marca.set(c,u),this.lavoro.manda(n,c,this.erba,u)===null&&r.chunks.has(c)&&r.rimuovi(c),l++;continue}r.carica(c,ma(n,c,{erba:this.erba})),l++,this.statistiche.costruiti++}}this._vicini-=l}else this._vicini=0;if(this.lavoro&&this.lavoro.vivo){for(let{kc:s,dati:l,marca:c}of this.lavoro.raccogli())if(n.generati.has(s)){if(this._marca.get(s)!==c){this.coda.add(s);continue}this.coda.has(s)||(r.carica(s,l),this.statistiche.costruiti++)}this.statistiche.inVolo=this.lavoro.inVolo.size}this.statistiche.inCoda=this._vicini,this.statistiche.ultimaMs=performance.now()-i,this.statistiche.chunk=r.chunks.size}};function xr(a,t,o){let e=a.indexOf(",");return Math.hypot(+a.slice(0,e)*_+_/2-t,+a.slice(e+1)*_+_/2-o)}var uo=class{constructor(t,{alpha:o=0,beta:e=-.25,sensibilita:i=.0042}={}){this.alpha=o,this.beta=e,this.sensibilita=i,this.trascinato=0,this.fermo=!1,this.attivo=null,t.addEventListener("pointerdown",r=>{if(this.attivo===null){this.attivo=r.pointerId,this.trascinato=0,this._x=r.clientX,this._y=r.clientY;try{t.setPointerCapture(r.pointerId)}catch{}}}),t.addEventListener("pointermove",r=>{if(document.pointerLockElement===t){this._gira(r.movementX,r.movementY);return}if(r.pointerId!==this.attivo)return;let s=r.clientX-this._x,l=r.clientY-this._y;this._x=r.clientX,this._y=r.clientY,!this.fermo&&(this.trascinato+=Math.hypot(s,l),this._gira(s,l))});let n=r=>{r.pointerId===this.attivo&&(this.attivo=null)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),window.addEventListener("keydown",r=>{r.code==="KeyL"&&!/^(INPUT|TEXTAREA)$/.test(r.target&&r.target.tagName)&&(document.pointerLockElement===t?document.exitPointerLock():t.requestPointerLock&&t.requestPointerLock())})}_gira(t,o){this.alpha+=t*this.sensibilita,this.beta=Math.max(-1.45,Math.min(1.45,this.beta-o*this.sensibilita))}verso(){let t=Math.cos(this.beta);return[t*Math.sin(this.alpha),Math.sin(this.beta),-t*Math.cos(this.alpha)]}avantiPiano(){return{x:Math.sin(this.alpha),z:-Math.cos(this.alpha)}}};it();var Wt=1/60,ga=4,va=26,Ko=.32,ba=.92,xa=.995,Er=.06,Ar=20,ue=.5,zr=2.4,Mr=.9,fo=class{constructor(t){this.mondo=t,this.lista=[],this._resto=0,this.statistiche={corpi:0,svegli:0,passi:0},this._griglia=new Map}aggiungi({x:t,y:o,z:e,vx:i=0,vy:n=0,vz:r=0,lato:s=.5,colore:l=[1,1,1],giro:c=0}){let u={x:t,y:o,z:e,vx:i,vy:n,vz:r,lato:s,colore:l,giro:c,aTerra:!1,sonno:0,dorme:!1,inAcqua:!1,sommerso:0};return this.lista.push(u),u}svuota(){this.lista.length=0}avanza(t){this._resto+=t;let o=0;for(;this._resto>=Wt&&o<ga;)this._passo(),this._resto-=Wt,o++;return this._resto>Wt*ga&&(this._resto=0),this.statistiche.passi+=o,o}_solido(t,o,e){return this.mondo.solido(Math.floor(t),Math.floor(o),Math.floor(e))}_urta(t,o,e,i){let n=i-.001;for(let r of[-n,n])for(let s of[-n,n])if(this._solido(t+r,o-n,e+s)||this._solido(t+r,o+n,e+s))return!0;return!1}_sommerso(t,o){let e=this.mondo;if(!e.tipo)return 0;let i=Math.floor(t.x),n=Math.floor(t.z),r=Math.floor(t.y+o),s=Math.floor(t.y-o)-1;for(let l=r;l>=s;l--){let c=e.tipo(i,l,n);if(!c)continue;let u=F(c);if(!u||!u.acqua)continue;let p=l+(15-2*(Mt(c)||0))/16;return Math.max(0,Math.min(1,(p-(t.y-o))/(2*o)))}return 0}_passo(){let t=this.lista,o=0;for(let e of t){if(e.dorme)continue;o++;let i=e.lato/2;e.vy-=va*Wt;let n=this._sommerso(e,i);if(e.inAcqua=n>.02,e.sommerso=n,e.inAcqua){e.vy+=va*zr*n*Wt;let p=1-(1-Mr)*n;e.vx*=p,e.vy*=p,e.vz*=p}let r=Math.max(Math.abs(e.vx),Math.abs(e.vy),Math.abs(e.vz))*Wt,s=Math.max(1,Math.ceil(r/(i*.9))),l=Wt/s,c=!1;for(let p=0;p<s;p++){let f=e.x+e.vx*l;e.vx!==0&&(this._urta(f,e.y,e.z,i)&&(e.vx=-e.vx*Ko,f=e.x),e.x=f);let h=e.z+e.vz*l;e.vz!==0&&(this._urta(e.x,e.y,h,i)&&(e.vz=-e.vz*Ko,h=e.z),e.z=h);let d=e.y+e.vy*l;this._urta(e.x,d,e.z,i)?e.vy<0?(e.y=Math.floor(d-i+.001)+1+i,c=!0,e.vy=Math.abs(e.vy)>3?-e.vy*Ko:0):e.vy=0:e.y=d}e.aTerra=c||e.vy<=0&&this._urta(e.x,e.y-.02,e.z,i),e.aTerra?(e.vx*=ba,e.vz*=ba,e.vy<0&&(e.vy=0)):(e.vx*=xa,e.vz*=xa);let u=Math.hypot(e.vx,e.vy,e.vz);(e.aTerra||e.inAcqua)&&u<Er?(e.vx=e.vz=0,e.inAcqua&&(e.vy=0),++e.sonno>=Ar&&(e.dorme=!0)):e.sonno=0}this._vicini(),this.statistiche.corpi=t.length,this.statistiche.svegli=o}_vicini(){let t=this._griglia;t.clear();let o=this.lista,e=(i,n)=>i+32768<<16|n+32768;for(let i=0;i<o.length;i++){let n=o[i],r=e(Math.floor(n.x),Math.floor(n.z)),s=t.get(r);s||(s=[],t.set(r,s)),s.push(i)}for(let i=0;i<o.length;i++){let n=o[i],r=Math.floor(n.x),s=Math.floor(n.z);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let u=t.get(e(r+l,s+c));if(u)for(let p of u){if(p<=i)continue;let f=o[p];if(n.dorme&&f.dorme)continue;let h=(n.lato+f.lato)/2,d=h-Math.abs(n.x-f.x);if(d<=0)continue;let m=h-Math.abs(n.y-f.y);if(m<=0)continue;let g=h-Math.abs(n.z-f.z);if(!(g<=0)){if(d<=m&&d<=g){let v=Math.sign(n.x-f.x)||1;n.x+=v*d*ue,f.x-=v*d*ue}else if(m<=g)(Math.sign(n.y-f.y)||1)>0?(n.y+=m*ue,n.vy<0&&(n.vy=0)):(f.y+=m*ue,f.vy<0&&(f.vy=0));else{let v=Math.sign(n.z-f.z)||1;n.z+=v*g*ue,f.z-=v*g*ue}n.dorme&&(n.dorme=!1,n.sonno=0),f.dorme&&(f.dorme=!1,f.sonno=0)}}}}}istanze(t=null){let o=this.lista.length;(!t||t.length!==o*8)&&(t=new Float32Array(o*8));for(let e=0;e<o;e++){let i=this.lista[e],n=e*8;t[n]=i.x,t[n+1]=i.y-i.lato/2,t[n+2]=i.z,t[n+3]=i.lato,t[n+4]=i.colore[0],t[n+5]=i.colore[1],t[n+6]=i.colore[2],t[n+7]=i.giro}return t}};it();Re();var Cr=256,vt=8,Aa=16,za=(a,t)=>a+","+t,Jo=(a,t,o)=>a+","+t+","+o,ho=class{constructor({varia:t=!0}={}){this.varia=t,this._n=Cr,this._dati=new Float32Array(this._n*vt),this._id=new Int32Array(this._n),this._tipo=new Array(this._n).fill(null),this._slot=new Map,this._liberi=[],this._primo=0,this._prossimoId=1,this._perTipo=new Map,this._perChunk=new Map,this._chunk=new Map,this._perCella=new Map,this._cella=new Map,this._meta=new Map,this._nome=new Map,this.sporchi=new Set}_cresci(){let t=this._n*2,o=new Float32Array(t*vt);o.set(this._dati);let e=new Int32Array(t);e.set(this._id),this._dati=o,this._id=e,this._tipo.length=t,this._tipo.fill(null,this._n),this._n=t}_prendiSlot(){return this._liberi.length?this._liberi.pop():(this._primo>=this._n&&this._cresci(),this._primo++)}aggiungi(t,o,e,i,{giro:n,scala:r,tinta:s,nome:l,dati:c,cella:u}={}){let p=this._prendiSlot(),f=this._prossimoId++;this._id[p]=f,this._slot.set(f,p),this._tipo[p]=t;let h=u?po(t,u[0],u[1],u[2],this.varia):{scala:1,giro:0,tinta:[1,1,1]},d=p*vt;this._dati[d]=o,this._dati[d+1]=e,this._dati[d+2]=i,this._dati[d+3]=r??h.scala;let m=s||h.tinta;this._dati[d+4]=m[0],this._dati[d+5]=m[1],this._dati[d+6]=m[2],this._dati[d+7]=n??h.giro;let g=this._perTipo.get(t);if(g||(g=new Set,this._perTipo.set(t,g)),g.add(p),this._indicizza(p,o,i),u){let v=Jo(u[0],u[1],u[2]);this._perCella.set(v,p),this._cella.set(p,v)}return l&&this._nome.set(p,l),c&&this._meta.set(p,{...c}),this.sporchi.add(t),f}togli(t){let o=this._slot.get(t);if(o===void 0)return!1;let e=this._tipo[o];this._perTipo.get(e).delete(o),this._sfila(o);let i=this._cella.get(o);return i!==void 0&&(this._perCella.delete(i),this._cella.delete(o)),this._meta.delete(o),this._nome.delete(o),this._slot.delete(t),this._id[o]=0,this._tipo[o]=null,this._liberi.push(o),this.sporchi.add(e),!0}_chunkDi(t,o){return za(Math.floor(t/Aa),Math.floor(o/Aa))}_indicizza(t,o,e){let i=this._chunkDi(o,e),n=this._perChunk.get(i);n||(n=new Set,this._perChunk.set(i,n)),n.add(t),this._chunk.set(t,i)}_sfila(t){let o=this._chunk.get(t);if(o===void 0)return;let e=this._perChunk.get(o);e&&(e.delete(t),e.size||this._perChunk.delete(o)),this._chunk.delete(t)}nelChunk(t,o){let e=this._perChunk.get(za(t,o));return e?[...e].map(i=>this._id[i]):[]}leggi(t){let o=this._slot.get(t);if(o===void 0)return null;let e=o*vt;return{id:t,tipo:this._tipo[o],x:this._dati[e],y:this._dati[e+1],z:this._dati[e+2],scala:this._dati[e+3],tinta:[this._dati[e+4],this._dati[e+5],this._dati[e+6]],giro:this._dati[e+7],nome:this._nome.get(o)||null,dati:this._meta.get(o)||null}}posa(t,{x:o,y:e,z:i,giro:n,scala:r,tinta:s}={}){let l=this._slot.get(t);if(l===void 0)return!1;let c=l*vt,u=o!==void 0||i!==void 0;return o!==void 0&&(this._dati[c]=o),e!==void 0&&(this._dati[c+1]=e),i!==void 0&&(this._dati[c+2]=i),r!==void 0&&(this._dati[c+3]=r),s&&(this._dati[c+4]=s[0],this._dati[c+5]=s[1],this._dati[c+6]=s[2]),n!==void 0&&(this._dati[c+7]=n),u&&(this._sfila(l),this._indicizza(l,this._dati[c],this._dati[c+2])),this.sporchi.add(this._tipo[l]),!0}metadati(t,o){let e=this._slot.get(t);return e===void 0?null:(o&&this._meta.set(e,{...this._meta.get(e)||{},...o}),this._meta.get(e)||null)}battezza(t,o){let e=this._slot.get(t);return e===void 0?!1:(o?this._nome.set(e,o):this._nome.delete(e),!0)}evento(t){let[o,e,i]=t.cella;if(t.tipo==="metti"){let n=F(t.blocco);if(!n||n.forma!=="modello"||!n.modello)return;this._dallaCella(o,e,i),this.aggiungi(n.modello,o+.5,e,i+.5,{cella:[o,e,i]})}else t.tipo==="togli"&&this._dallaCella(o,e,i)}_dallaCella(t,o,e){let i=this._perCella.get(Jo(t,o,e));i!==void 0&&this.togli(this._id[i])}idInCella(t,o,e){let i=this._perCella.get(Jo(t,o,e));return i===void 0?null:this._id[i]}cambiate(){let t=[];for(let o of this.sporchi){let e=this._perTipo.get(o),i=new Float32Array((e?e.size:0)*vt),n=0;if(e)for(let r of e)i.set(this._dati.subarray(r*vt,r*vt+vt),n),n+=vt;t.push([o,i])}return this.sporchi.clear(),t}get conta(){return this._slot.size}quante(t){let o=this._perTipo.get(t);return o?o.size:0}tutte(){return[...this._slot.keys()]}tipiVivi(){return this._perTipo.keys()}ognunaDi(t,o){let e=this._perTipo.get(t);if(e)for(let i of e){let n=i*vt;o(this._dati[n],this._dati[n+1],this._dati[n+2],this._id[i],this._dati[n+3],this._dati[n+7])}}perTipo(){let t=[];for(let[o,e]of this._perTipo)e.size&&t.push([o,e.size]);return t.sort((o,e)=>o[0].localeCompare(e[0])),t}serializza({tutto:t=!1}={}){let o=[];for(let[e,i]of this._slot){if(!t&&this._cella.has(i))continue;let n=i*vt,r={id:e,tipo:this._tipo[i],p:[this._dati[n],this._dati[n+1],this._dati[n+2]],s:this._dati[n+3],g:this._dati[n+7]},s=[this._dati[n+4],this._dati[n+5],this._dati[n+6]];(s[0]!==1||s[1]!==1||s[2]!==1)&&(r.t=s);let l=this._nome.get(i);l&&(r.n=l);let c=this._meta.get(i);c&&(r.m=c),o.push(r)}return{versione:1,entita:o}}deserializza(t){if(!t||t.versione!==1||!Array.isArray(t.entita))throw new Error("pacco di entit\xE0 non riconosciuto");let o=0;for(let e of t.entita)this.aggiungi(e.tipo,e.p[0],e.p[1],e.p[2],{giro:e.g,scala:e.s,tinta:e.t,nome:e.n,dati:e.m}),o++;return o}};it();var Sr=4,Rr=33,Lr=26;function Ma(a,t,o=0,e=!1,i=null,n=Sr){let r=t.indexOf(","),s=+t.slice(0,r),l=+t.slice(r+1),c=1/0,u=-1/0;if(a.perOgniDelChunk(t,(A,M)=>{M<c&&(c=M),M>u&&(u=M)}),c===1/0)return null;let p=s*_-n,f=l*_-n,h=c-Rr,d=_+2*n,m=d,g=u+Lr-h+1,v=new Uint16Array(d*g*m),b=[],x=new Map;for(let A=-1;A<=1;A++)for(let M=-1;M<=1;M++)a.perOgniDelChunk(s+A+","+(l+M),(I,w,S,q)=>{let C=I-p,E=w-h,O=S-f;if(C<0||C>=d||E<0||E>=g||O<0||O>=m)return;let R=x.get(q);R===void 0&&(R=b.push(q),x.set(q,R)),v[(C*g+E)*m+O]=R});let z={};for(let A of b){let M=jt(A);M in z||(z[M]=rt[M]||null)}return{kc:t,livello:o,soloAcqua:e,x0:p,y0:h,z0:f,nx:d,ny:g,nz:m,celle:v,tipi:b,defs:z,stagione:i||{corrente:Pi(),mescolanza:Fi()}}}var ti=class{constructor(t){this.operai=[],this.pronti=[],this.inVolo=new Map;for(let o=0;o<t;o++){let e=new Worker(new URL("./mesher-nucleo-worker.js",import.meta.url),{type:"module"}),i={w:e,occupato:null};e.onmessage=n=>{i.occupato=null,this.pronti.push(n.data)},e.onerror=n=>{console.warn("lavoro: un Worker si \xE8 fermato \u2014",n&&n.message),this.operai=this.operai.filter(r=>r!==i),i.occupato&&this.inVolo.delete(i.occupato);try{e.terminate()}catch{}},this.operai.push(i)}}get vivo(){return this.operai.length>0}get liberi(){return this.operai.filter(t=>!t.occupato).length}manda(t,o,e,i=0){let n=this.operai.find(s=>!s.occupato);if(!n)return!1;let r=Ma(t,o,0,!1,null,Ce);return r?(r.erba=e,r.marca=i,n.occupato=o,this.inVolo.set(o,i),n.w.postMessage(r,[r.celle.buffer]),!0):null}raccogli(){let t=this.pronti;this.pronti=[];for(let o of t)this.inVolo.delete(o.kc);return t}};function _a(a=null){if(typeof Worker!="function")return null;let t=a??Math.max(1,Math.min(3,(globalThis.navigator&&navigator.hardwareConcurrency||2)-1));try{let o=new ti(t);return o.vivo?o:null}catch(o){return console.warn("lavoro: niente Worker \u2014",o&&o.message),null}}var Or=[[[0,0,1],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]],[[0,0,-1],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]],[[1,0,0],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]]],[[-1,0,0],[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]],[[0,1,0],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]],[[0,-1,0],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]]];function ya(a,t){let o=a.perno||t,e=a.scala||[1,1,1],i=a.rot||[0,a.giro||0,0],[n,r]=[Math.cos(i[0]),Math.sin(i[0])],[s,l]=[Math.cos(i[1]),Math.sin(i[1])],[c,u]=[Math.cos(i[2]),Math.sin(i[2])],p=(f,h,d)=>{let m=h*n-d*r,g=h*r+d*n;h=m,d=g;let v=f*s+d*l;return g=-f*l+d*s,f=v,d=g,v=f*c-h*u,m=f*u+h*c,f=v,h=m,[f,h,d]};return{punto:f=>{let[h,d,m]=p((f[0]-o[0])*e[0],(f[1]-o[1])*e[1],(f[2]-o[2])*e[2]);return[h+o[0],d+o[1],m+o[2]]},normale:f=>{let[h,d,m]=p(f[0]/e[0],f[1]/e[1],f[2]/e[2]),g=Math.hypot(h,d,m)||1;return[h/g,d/g,m/g]}}}function Ut(a){let t=[],o=(u,p,f,h,d,m)=>{let g=Ta(u,p,f);t.push([g[0]*h[0]+g[1]*h[1]+g[2]*h[2]<0?[u,f,p]:[u,p,f],h,d,m])};for(let u of a){let p=u.colore??16777215,f=u.materia|0;if(u.tornio){let g=u.lati||8,v=u.tornio,b=u.x||0,x=u.z||0,z=Math.min(...v.map(S=>S[1])),A=Math.max(...v.map(S=>S[1])),M=ya(u,[b,(z+A)/2,x]),I=(S,q)=>{let C=[];for(let E=0;E<g;E++){let O=E/g*Math.PI*2+(u.fase||0);C.push([b+Math.cos(O)*S,q,x+Math.sin(O)*S])}return C},w=v.map(([S,q])=>I(S,q));for(let S=0;S+1<v.length;S++){let q=w[S],C=w[S+1];for(let E=0;E<g;E++){let O=(E+1)%g,R=q[E],P=q[O],G=C[O],Z=C[E];if(v[S][0]===0&&v[S+1][0]===0)continue;let L=(R[0]+P[0]+G[0]+Z[0])/4-b,nt=(R[2]+P[2]+G[2]+Z[2])/4-x,Y=Math.hypot(L,nt)||1,At=v[S+1][0]-v[S][0],Ee=v[S+1][1]-v[S][1],Vt=Math.hypot(At,Ee)||1,zt=[L/Y*(Ee/Vt),-At/Vt,nt/Y*(Ee/Vt)];v[S][0]>0&&v[S+1][0]>0?(o(R,P,G,zt,p,f),o(R,G,Z,zt,p,f)):v[S][0]>0?o(R,P,G,zt,p,f):o(R,G,Z,zt,p,f)}}if(v[0][0]>0&&!u.aperto){let S=w[0];for(let q=1;q+1<g;q++)o(S[0],S[q+1],S[q],[0,-1,0],p,f)}if(v[v.length-1][0]>0&&!u.aperto){let S=w[v.length-1];for(let q=1;q+1<g;q++)o(S[0],S[q],S[q+1],[0,1,0],p,f)}ei(t,M);continue}let h=[(u.da[0]+u.a[0])/2,(u.da[1]+u.a[1])/2,(u.da[2]+u.a[2])/2],d=ya(u,h);if(u.piramide){let g=[[u.da[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.a[2]],[u.da[0],u.da[1],u.a[2]]],v=u.punta,b=[(u.da[0]+u.a[0])/2,u.da[1],(u.da[2]+u.a[2])/2];for(let x=0;x<4;x++){let z=g[x],A=g[(x+1)%4],M=Ta(z,v,A),I=[(z[0]+v[0]+A[0])/3-b[0],0,(z[2]+v[2]+A[2])/3-b[2]];o(z,v,A,M[0]*I[0]+M[2]*I[2]<0?[-M[0],-M[1],-M[2]]:M,p,f)}o(g[0],g[1],g[2],[0,-1,0],p,f),o(g[0],g[2],g[3],[0,-1,0],p,f),ei(t,d);continue}let m=g=>[g[0]?u.a[0]:u.da[0],g[1]?u.a[1]:u.da[1],g[2]?u.a[2]:u.da[2]];for(let[g,v]of Or){let b=g[0]?0:g[1]?1:2;if(u.a[b]===u.da[b])continue;let x=v.map(m);o(x[0],x[1],x[2],g,p,f),o(x[0],x[2],x[3],g,p,f)}ei(t,d)}let e=t.length*3,i=new Uint8Array(e*20),n=new DataView(i.buffer),r=0,s=1/0,l=-1/0,c=0;for(let[u,p,f,h]of t)for(let d of u){let m=r*20;n.setFloat32(m,d[0],!0),n.setFloat32(m+4,d[1],!0),n.setFloat32(m+8,d[2],!0),i[m+12]=Math.round(p[0]*127)&255,i[m+13]=Math.round(p[1]*127)&255,i[m+14]=Math.round(p[2]*127)&255,i[m+15]=h,i[m+16]=f>>16&255,i[m+17]=f>>8&255,i[m+18]=f&255,i[m+19]=255,s=Math.min(s,d[1]),l=Math.max(l,d[1]),c=Math.max(c,Math.hypot(d[0],d[2])),r++}return{byte:i,vertici:e,triangoli:t.length,minY:s,maxY:l,raggio:c}}function ei(a,t){for(let o=a.length-1;o>=0;o--){let e=a[o];if(e[4])break;e[0]=e[0].map(t.punto),e[1]=t.normale(e[1]),e[4]=!0}}function Ta(a,t,o,e=null){let i=e?[o[0]-a[0],o[1]-a[1],o[2]-a[2]]:[t[0]-a[0],t[1]-a[1],t[2]-a[2]],n=e?[e[0]-t[0],e[1]-t[1],e[2]-t[2]]:[o[0]-a[0],o[1]-a[1],o[2]-a[2]],r=i[1]*n[2]-i[2]*n[1],s=i[2]*n[0]-i[0]*n[2],l=i[0]*n[1]-i[1]*n[0],c=Math.hypot(r,s,l)||1;return[r/c,s/c,l/c]}var j=(a,t,o,e,i,n,r,s={})=>({da:[a-e/2,t,o-n/2],a:[a+e/2,t+i,o+n/2],colore:r,...s}),pe=(a,t,o,e,i,n,r=0,s=0,l={})=>({piramide:!0,da:[a-e/2,t,o-e/2],a:[a+e/2,t,o+e/2],punta:[a+r,t+i,o+s],colore:n,...l}),$=(a,t,o,e,i={})=>({tornio:o,x:a,z:t,lati:8,colore:e,...i});it();Re();var mo={blu:{corpo:736622,pancia:533312,testa:431830,guance:691404,zampe:533312,orecchie:431830,dentro:3118826,occhi:16777215,pupille:727598,naso:533312,coda:736622},arancione:{corpo:14644537,pancia:13658672,testa:15901522,guance:15897452,zampe:16024454,orecchie:14644537,dentro:16024454,occhi:16777215,pupille:2759186,naso:16024454,coda:14644537}};function oi(a=mo.blu,{zaino:t=!1}={}){let o=[$(0,.02,[[.14,0],[.27,.06],[.31,.24],[.28,.44],[.19,.58],[0,.62]],a.corpo,{fase:Math.PI/8,scala:[1,1,.82]}),$(-.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],a.zampe,{fase:Math.PI/8}),$(.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],a.zampe,{fase:Math.PI/8}),$(0,0,[[0,.52],[.3,.58],[.38,.74],[.36,.94],[.2,1.08],[0,1.11]],a.testa,{fase:Math.PI/8,scala:[1.12,1,.92]}),pe(-.22,1.02,0,.17,.36,a.orecchie,-.03,0,{rot:[0,0,.18]}),pe(.22,1.02,0,.17,.36,a.orecchie,.03,0,{rot:[0,0,-.18]}),pe(-.22,1.05,-.03,.1,.24,a.dentro,-.02,0,{rot:[0,0,.18]}),pe(.22,1.05,-.03,.1,.24,a.dentro,.02,0,{rot:[0,0,-.18]}),j(-.15,.74,-.352,.11,.15,.03,a.occhi),j(.15,.74,-.352,.11,.15,.03,a.occhi),j(-.115,.755,-.362,.032,.085,.02,a.pupille),j(.115,.755,-.362,.032,.085,.02,a.pupille),pe(0,.72,-.35,.06,-.05,a.naso,0,0,{rot:[Math.PI/2,0,0],perno:[0,.72,-.35]}),$(.2,.22,[[.05,.05],[.055,.4],[0,.46]],a.coda,{rot:[.35,0,-.35],perno:[.2,.05,.22]})];return t&&(o.push(j(.06,.8,.44,.3,.3,.16,13777723,{rot:[0,0,.15]})),o.push(j(.06,.88,.53,.12,.12,.02,9279656,{rot:[0,0,.15]})),o.push(j(.3,.04,-.22,.06,.36,.06,13777723,{rot:[0,0,-.25],perno:[.3,.04,-.22]}))),Ut(o)}function Ir(){return Ut([$(-.08,-.02,[[.08,0],[.065,.1],[.075,.2]],16108701),$(-.08,-.02,[[0,.17],[.2,.2],[.24,.28],[.17,.36],[0,.41]],13904952,{fase:Math.PI/8}),$(-.16,-.1,[[.05,.31],[.04,.34]],16183526),$(.02,.06,[[.045,.31],[.035,.34]],16183526),$(-.06,-.02,[[.04,.39],[.03,.42]],16183526),$(.18,.14,[[.05,0],[.045,.11]],16108701),$(.18,.14,[[0,.09],[.12,.11],[.11,.17],[0,.21]],6040869,{fase:Math.PI/8})])}function Nr(){return Ut([j(0,.38,0,.92,.09,.44,15510096),j(0,.35,0,.98,.03,.5,14644537),j(-.36,0,0,.09,.36,.09,6040869),j(.36,0,0,.09,.36,.09,6040869)])}function wr(){let e=[];for(let i=0;i<3;i++){let n=.33-i*.33,r=.24+i*.28;e.push(j(0,r,n,.9,.08,.33,15510096),j(0,r-.02,n,.94,.02,.37,14644537)),e.push(j(-.36,0,n,.07,r,.07,6040869),j(.36,0,n,.07,r,.07,6040869))}return Ut(e)}function qr(){return Ut([$(0,0,[[.025,0],[.02,.7]],3481626,{rot:[0,0,-.35],perno:[0,0,0]}),$(.24,0,[[.02,.66],[.012,1.31]],3481626,{rot:[0,0,-.62],perno:[.24,.66,0]}),$(0,0,[[.035,0],[.035,.26]],12597547,{rot:[0,0,-.35],perno:[0,0,0]}),$(0,0,[[.03,.4],[.065,.42],[.065,.5],[.03,.52]],9279656,{rot:[0,0,-.35],perno:[0,0,0],aperto:!0})])}function Pr(){let e=[];return e.push($(0,0,[[.19,.32],[.24,.32],[.24,.37],[.19,.37]],12597547,{aperto:!0})),e.push($(0,0,[[.2,.33],[.14,.17],[.05,.05],[0,.02]],9079434,{aperto:!0})),e.push($(0,.24,[[.03,.34],[.03,.96]],14251821,{rot:[-1.95,0,0],perno:[0,.34,.24]})),e.push($(0,.24,[[.04,.96],[.04,1.1],[0,1.12]],12597547,{rot:[-1.95,0,0],perno:[0,.34,.24]})),Ut(e)}function Fr(){return Ut([j(0,.02,0,.44,.04,.3,10858432),j(0,.04,0,.5,.05,.34,12174291),j(0,.09,0,.42,.02,.28,10858432),j(0,.09,.05,.12,.1,.1,12174291),j(0,.19,.05,.09,.09,.09,13226719),$(0,.05,[[.06,0],[.06,.62],[0,.66]],14716975,{rot:[.95,0,0],perno:[0,.24,.05],lati:6,fase:Math.PI/6})])}function Dr(){let i={rot:[-Math.PI/2,0,0],perno:[0,.42,0]};return Ut([$(0,0,[[.3,.42],[.26,.52],[.16,.66],[.12,.8]],14673648,{...i,aperto:!0}),$(0,0,[[.13,.66],[.13,.7]],1405880,{...i,aperto:!0}),$(0,0,[[.14,.8],[.14,.9],[0,.92]],1405880,i),$(0,0,[[.3,.42],[.22,.47],[0,.52]],14673648,i),j(0,.33,-.09,.14,.14,.06,2279664),j(0,0,.1,.1,.44,.1,1003407,{rot:[-.25,0,0],perno:[0,.44,.1]})])}var dt={gatto:{nome:"Gatto (PNG)",costruisci:()=>oi(mo.arancione,{zaino:!0}),colore:15968586},fungo:{nome:"Fungo",costruisci:Ir,colore:14170676},gradino:{nome:"Gradino",costruisci:Nr,colore:14916156},scala:{nome:"Scala",costruisci:wr,colore:13206575},canna:{nome:"Canna da pesca",costruisci:qr,colore:12597547},retino:{nome:"Retino",costruisci:Pr,colore:14251821},cazzuola:{nome:"Cazzuola",costruisci:Fr,colore:12174291},megafono:{nome:"Megafono",costruisci:Dr,colore:1405880}};function Ca(){for(let[a,t]of Object.entries(dt))rt[a]||Gt(a,{nome:t.nome,forma:"modello",modello:a,solido:!1,calpestabile:!0,colore:t.colore}),Qo(a,{nome:t.nome,modello:a,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1]});return Object.keys(dt)}it();var ot=4,go=32;function Sa(a,t,o){let e=[],i=t*_,n=o*_;for(let r=i;r<i+_;r++)for(let s=n;s<n+_;s++){if(r<-go||r>=go||s<-go||s>=go)continue;for(let c=ot-3;c<ot;c++)a.metti(r,c,s,"terra",!0);if(a.metti(r,ot,s,"erba",!0),r>=6&&r<18&&s>=-20&&s<-12&&(a.togli(r,ot,s,!0),a.metti(r,ot-1,s,"acqua",!0),a.metti(r,ot,s,"acqua",!0)),r>=-20&&r<-12&&s>=4&&s<12)for(let c=ot+1;c<=ot+(s-3);c++)a.metti(r,c,s,"pietra",!0);if(s===20&&r>=-24&&r<24){let c=to.filter(p=>p&&!_t[p]&&F(p).forma!=="modello"),u=Math.floor((r+24)/2);if((r+24)%2===0&&u<c.length)for(let p=ot+1;p<=ot+3;p++)a.metti(r,p,s,c[u],!0)}r===-4&&s>=-28&&s<28&&(s+28)%6===0&&e.push([r,ot+1,s,"lampione"]),r>=-28&&r<-8&&s>=-28&&s<-8&&(r*7+s*13)%11===0&&e.push([r,ot+1,s,"albero"]);let l=Object.keys(dt);s===-4&&r>=0&&r<l.length*2&&r%2===0&&e.push([r,ot+1,s,l[r/2]]),s===8&&(r===18&&a.metti(r,ot+1,s,"lampadaRossa",!0),r===22&&a.metti(r,ot+1,s,"lampadaBlu",!0)),r===20&&(s===6&&a.metti(r,ot+1,s,"lampadaVerde",!0),s===10&&a.metti(r,ot+1,s,"lampadaPesante",!0))}return e}var bt=12,Ur=[[-7,6,-5,4,bt],[-3,4,-4,0,bt+1]],kr=[1,3,2,3];function Ra(a,t,[o,e,i,n]){return a>=o&&a<=e&&t>=i&&t<=n}function La(a,t,o){let e=[],i=t*_,n=o*_;for(let s=i;s<i+_;s++)for(let l=n;l<n+_;l++){let c=-1;for(let u of Ur)Ra(s,l,u)&&(c=Math.max(c,u[4]));if(!(c<0)){for(let u=c-3;u<c;u++)a.metti(s,u,l,"terra",!0);if(Ra(s,l,kr)){a.metti(s,c-1,l,"acqua",!0),a.metti(s,c,l,"acqua",!0);continue}a.metti(s,c,l,"erba",!0)}}let r=[[-5,bt+1,-3,"albero"],[4,bt+1,0,"lampione"],[-1,bt+2,-2,"gatto"],[-2,bt+1,2,"fungo"],[-3,bt+1,3,"fungo"],[5,bt+1,3,"canna"],[-6,bt+1,2,"retino"],[0,bt+1,4,"cazzuola"]];for(let s of r)s[0]>=i&&s[0]<i+_&&s[2]>=n&&s[2]<n+_&&e.push(s);return e}it();var Br=8,wt={passoColonne:3,passoLampade:11,passoModelli:5,passoCanali:16,rilievo:7};function Qt(a,t,o){let e=Math.imul(a|0,374761393)+Math.imul(t|0,668265263)+Math.imul(o|0,1442695041)|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function Vr(){return Object.keys(rt).filter(a=>{let t=F(a);return t&&!t.acqua&&t.forma!=="modello"}).sort()}function Gr(){return Object.keys(rt).filter(a=>{let t=F(a);return t&&t.luce}).sort()}function Xr(a,t){let o=Math.sin(a*.07)*Math.cos(t*.061),e=Math.sin((a+t)*.023)*.6;return Br+Math.round((o+e)*wt.rilievo*.5)}function $r(a,t){let o=(a%wt.passoCanali+wt.passoCanali)%wt.passoCanali,e=(t%wt.passoCanali+wt.passoCanali)%wt.passoCanali;return o<3||e<3}function Oa(a,t,o){let e=[],i=t*_,n=o*_,r=Vr(),s=Gr(),l=Object.keys(dt);for(let c=i;c<i+_;c++)for(let u=n;u<n+_;u++){let p=Xr(c,u),f=$r(c,u);for(let d=p-3;d<p;d++)a.metti(c,d,u,"terra",!0);if(f){a.metti(c,p-1,u,"sabbia",!0),a.metti(c,p,u,"acqua",!0);continue}if(a.metti(c,p,u,"erba",!0),Qt(c,u,1)<1/wt.passoColonne){let d=r[Math.floor(Qt(c,u,2)*r.length)%r.length],m=1+Math.floor(Qt(c,u,3)*5);for(let g=p+1;g<=p+m;g++)a.metti(c,g,u,d,!0);continue}if(s.length&&Qt(c,u,4)<1/wt.passoLampade){let d=s[Math.floor(Qt(c,u,5)*s.length)%s.length];a.metti(c,p+1,u,d,!0);continue}if(Qt(c,u,6)<1/wt.passoModelli){let d=Qt(c,u,7),m=d<.45?"albero":d<.7?"lampione":l[Math.floor(d*1e3)%l.length];e.push([c,p+1,u,m])}}return e}function Ia(a,t=null){return{chiave:"resa",nome:"Resa del nucleo",nota:"Lo specchio e l'ombra si possono spegnere per misurare quanto costano: la grafica \xE8 la stessa ovunque, il \u{1FA7A} dice i fotogrammi.",campi:[{chiave:"ombra",nome:"ombra del sole (horizon mapping)",tipo:"interruttore",leggi:()=>!!a.ombra,scrivi:o=>a.ombra=!!o},{chiave:"specchio",nome:"specchio dell'acqua",tipo:"interruttore",leggi:()=>!!a.specchio.attivo,scrivi:o=>a.specchio.attivo=!!o},{chiave:"scalaSpecchio",nome:"risoluzione dello specchio",tipo:"numero",min:.2,max:1,passo:.05,leggi:()=>a.specchio.scala,scrivi:o=>a.specchio.scala=o},{chiave:"vediSpecchio",nome:"mostra lo specchio nudo",tipo:"interruttore",leggi:()=>!!a.specchio.mostra,scrivi:o=>a.specchio.mostra=!!o},{chiave:"bagliori",nome:"alone delle lanterne (due cerchi)",tipo:"interruttore",leggi:()=>!!(t&&t.attivo),scrivi:o=>{t&&(t.attivo=!!o)}},{chiave:"erbaFinoA",nome:"fili d'erba fino a",tipo:"numero",min:0,max:160,passo:16,unita:"blocchi",leggi:()=>a.erbaFinoA,scrivi:o=>a.erbaFinoA=o},{chiave:"nebbiaDa",nome:"nebbia da",tipo:"numero",min:8,max:200,passo:4,unita:"blocchi",leggi:()=>a.nebbia.da,scrivi:o=>a.nebbia.da=Math.min(o,a.nebbia.a-4)},{chiave:"nebbiaA",nome:"nebbia piena a",tipo:"numero",min:12,max:240,passo:4,unita:"blocchi",leggi:()=>a.nebbia.a,scrivi:o=>a.nebbia.a=Math.max(o,a.nebbia.da+4)},{chiave:"disegni",nome:"disegni (solidi + specchio)",tipo:"lettura",leggi:()=>`${a.statistiche.disegni} + ${a.statistiche.disegniSpecchio}`},{chiave:"chunk",nome:"chunk visti / totali",tipo:"lettura",leggi:()=>`${a.statistiche.chunkVisti} / ${a.statistiche.chunkTotali}`}]}}function Na(a){return{chiave:"stile",nome:"Stile",nota:"L'ombra di Leafy \xE8 il colore stesso con la tinta spostata verso il blu, un po' pi\xF9 satura e pi\xF9 scura. Qui si tarano i tre numeri, e si accendono o spengono i pezzi della luce.",campi:[{chiave:"tinta",nome:"ombra: spostamento di tinta verso il blu",tipo:"numero",min:0,max:.3,passo:.01,leggi:()=>a.stile.tinta,scrivi:t=>a.stile.tinta=t},{chiave:"saturazione",nome:"ombra: saturazione",tipo:"numero",min:.6,max:1.6,passo:.05,leggi:()=>a.stile.saturazione,scrivi:t=>a.stile.saturazione=t},{chiave:"valore",nome:"ombra: quanto \xE8 scura (valore)",tipo:"numero",min:.3,max:1,passo:.02,leggi:()=>a.stile.valore,scrivi:t=>a.stile.valore=t},{chiave:"mappa",nome:"mappa d'ombra vera (forma delle cose)",tipo:"interruttore",leggi:()=>!!a.mappa.attiva,scrivi:t=>a.mappa.attiva=!!t},{chiave:"mappaRaggio",nome:"mappa d'ombra: raggio",tipo:"numero",min:16,max:64,passo:4,unita:"blocchi",leggi:()=>a.mappa.raggio,scrivi:t=>{a.mappa.raggio=t,a.mappa.sporca=!0,a.mappa.centro=[1e9,0,1e9]}},{chiave:"lampade",nome:"pozze dei lampioni (cerchi)",tipo:"interruttore",leggi:()=>a.lampadeAccese!==!1,scrivi:t=>a.lampadeAccese=!!t}]}}function wa(a){return{chiave:"meteo",nome:"Meteo",nota:"Il mare: 0 \xE8 uno specchio, 1 \xE8 mosso. Muoverlo a mano spegne il vagare automatico.",campi:[{chiave:"auto",nome:"meteo che cambia da solo",tipo:"interruttore",leggi:()=>!!a.auto,scrivi:t=>a.auto=!!t},{chiave:"mare",nome:"mare mosso",tipo:"numero",min:0,max:1,passo:.02,leggi:()=>+a.agitazione.toFixed(2),scrivi:t=>{a.auto=!1,a.agitazione=t,a.meta=t}}]}}function qa(a){return{chiave:"giorno",nome:"Giorno",nota:"Muovere l'ora spegne il ciclo automatico.",campi:[{chiave:"auto",nome:"ciclo automatico",tipo:"interruttore",leggi:()=>!!a.auto,scrivi:t=>a.auto=!!t},{chiave:"ora",nome:"ora del giorno",tipo:"numero",min:0,max:1,passo:.002,leggi:()=>a.ora,scrivi:t=>{a.auto=!1,a.ora=t}},{chiave:"durata",nome:"quanto dura un giorno",tipo:"numero",min:30,max:1800,passo:30,unita:"s",leggi:()=>a.durata,scrivi:t=>a.durata=t},{chiave:"orologio",nome:"orologio",tipo:"lettura",leggi:()=>`${String(Math.floor(a.ora*24)).padStart(2,"0")}:${String(Math.floor(a.ora*24%1*60)).padStart(2,"0")}`}]}}function Pa(a,t){return{chiave:"corpi",nome:"Corpi (fisica)",nota:"Scatole a passo fisso (60 Hz), un asse per volta. Il tetto \xE8 800.",campi:[{chiave:"quanti",nome:"corpi",tipo:"lettura",leggi:()=>`${a.statistiche.corpi} (${a.statistiche.svegli} svegli)`},{chiave:"lancia20",nome:"\u{1F3B2} lancia venti",tipo:"azione",fai:()=>t(20)},{chiave:"lancia200",nome:"\u{1F3B2} lancia duecento",tipo:"azione",fai:()=>t(200)},{chiave:"svuota",nome:"\u{1F9F9} togli tutti",tipo:"azione",fai:()=>a.svuota()}]}}function Fa(a){return{chiave:"streaming",nome:"Mondo in streaming",nota:"La frontiera genera 32 blocchi oltre la resa; la coda costruisce entro il budget, almeno un chunk a giro.",campi:[{chiave:"raggio",nome:"raggio di resa",tipo:"numero",min:48,max:160,passo:16,unita:"blocchi",leggi:()=>a.raggioResa,scrivi:t=>a.raggioResa=t},{chiave:"budget",nome:"budget di costruzione",tipo:"numero",min:1,max:16,passo:1,unita:"ms",leggi:()=>a.budgetMs,scrivi:t=>a.budgetMs=t},{chiave:"erba",nome:"densit\xE0 dell'erba (ai prossimi chunk)",tipo:"numero",min:0,max:8,passo:1,leggi:()=>a.erba,scrivi:t=>a.erba=t},{chiave:"stato",nome:"coda / costruiti / scaricati",tipo:"lettura",leggi:()=>`${a.statistiche.inCoda} / ${a.statistiche.costruiti} / ${a.statistiche.scaricati}`}]}}function Da(a){return{chiave:"giocatore",nome:"Giocatore",campi:[{chiave:"volo",nome:"vola",tipo:"interruttore",leggi:()=>!!a.volo,scrivi:t=>a.impostaVolo(!!t)},{chiave:"cameraTira",nome:"la camera si tira dentro davanti a un muro",tipo:"interruttore",leggi:()=>!!(a.cameraTira&&a.cameraTira()),scrivi:t=>a.impostaCameraTira&&a.impostaCameraTira(!!t)},{chiave:"buco",nome:"buco di visuale (al posto della sagoma)",tipo:"interruttore",leggi:()=>!!(a.buco&&a.buco()),scrivi:t=>a.impostaBuco&&a.impostaBuco(!!t)},{chiave:"miraCentro",nome:"mira al centro (mirino) invece che dove sta il dito",tipo:"interruttore",leggi:()=>!!(a.miraCentro&&a.miraCentro()),scrivi:t=>a.impostaMiraCentro&&a.impostaMiraCentro(!!t)},{chiave:"dove",nome:"dove",tipo:"lettura",leggi:()=>a.dove()},{chiave:"casa",nome:"\u{1F3E0} torna all'origine",tipo:"azione",fai:()=>a.aCasa()},{chiave:"modifiche",nome:"modifiche salvate",tipo:"lettura",leggi:()=>a.modifiche?a.modifiche():0},{chiave:"nuovo",nome:"\u{1F5D1} mondo nuovo (butta le modifiche)",tipo:"azione",fai:()=>a.nuovo&&a.nuovo()}]}}function Ua(a){return{chiave:"scene",nome:"Scene",nota:"Lo zoo \xE8 il piano di prova: vasca, scalinata, muro dei materiali, viale dei lampioni, lampade colorate, arredi. Cambiare scena ricarica la pagina.",campi:[{chiave:"dove",nome:"scena",tipo:"lettura",leggi:()=>a.vetrina?"vetrina nel nero":a.zoo?"zoo di prova":`open world, seme ${a.seme}`},{chiave:"vetrina",nome:"\u{1F5BC} vai alla vetrina (la concept art nel nero)",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?vetrina&officina&terza&ora=0.38")}},{chiave:"zoo",nome:"\u{1F981} vai allo zoo",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?zoo&officina&terza")}},{chiave:"mondo",nome:"\u{1F30D} torna all'open world",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search=`?seme=${a.seme}&officina`)}}]}}var vo=class{constructor(t=1){this.agitazione=.25,this.meta=.25,this.auto=!0,this.fra=20,this._s=t>>>0||1}_caso(){let t=this._s;return t^=t<<13,t^=t>>>17,t^=t<<5,this._s=t>>>0,this._s%1e5/1e5}aggiorna(t){if(!this.auto)return this.agitazione;this.fra-=t,this.fra<=0&&(this.meta=Math.pow(this._caso(),2),this.fra=25+this._caso()*50);let o=1-Math.exp(-t/12);return this.agitazione+=(this.meta-this.agitazione)*o,this.agitazione}};function ka(a,t,o,e,i=0,n=0){let r=[t[0]-a[0],t[1]-a[1],t[2]-a[2]],s=Math.hypot(...r)||1;r[0]/=s,r[1]/=s,r[2]/=s;let l=[-r[2],0,r[0]],c=Math.hypot(...l)||1;l[0]/=c,l[2]/=c;let u=[l[1]*r[2]-l[2]*r[1],l[2]*r[0]-l[0]*r[2],l[0]*r[1]-l[1]*r[0]],p=Math.tan(o/2),f=i*p*e,h=n*p,d=[r[0]+l[0]*f+u[0]*h,r[1]+l[1]*f+u[1]*h,r[2]+l[2]*f+u[2]*h],m=Math.hypot(...d)||1;return{x:d[0]/m,y:d[1]/m,z:d[2]/m}}function Ba(a,t={}){let o={};for(let[i,n]of a.modifiche)n.size&&(o[i]=[...n].map(([r,s])=>[r,s]));let e=a.bagnate&&a.bagnate.size?[...a.bagnate]:void 0;return JSON.stringify({v:1,chunk:o,...e?{bagnate:e}:{},...t})}function Va(a,t){if(!t)return 0;let o;try{o=JSON.parse(t)}catch{return-1}if(!o||o.v!==1||typeof o.chunk!="object")return-1;let e=0;for(let[i,n]of Object.entries(o.chunk)){if(!/^-?\d+,-?\d+$/.test(i)||!Array.isArray(n))continue;let r=new Map;for(let s of n)!Array.isArray(s)||s.length!==2||!Number.isInteger(s[0])||s[1]!==null&&typeof s[1]!="string"||(r.set(s[0],s[1]),e++);r.size&&a.modifiche.set(i,r)}if(Array.isArray(o.bagnate)&&a.bagnate)for(let i of o.bagnate)!Array.isArray(i)||i.length!==2||!Number.isInteger(i[0])||!Number.isInteger(i[1])||a.bagnate.set(i[0],Math.max(0,Math.min(15,i[1])));return e}function ii(a){let t=0;for(let o of a.modifiche.values())t+=o.size;return t}Re();it();var bo={portata:7,budget:256,yMin:-32},Ga=[[1,0],[-1,0],[0,1],[0,-1]],Xa=(a,t,o)=>a+","+t+","+o,xo=class{constructor(t){this.mondo=t,this.coda=new Map,this.attiva=!0}pianifica(t,o,e){this.coda.set(Xa(t,o,e),[t,o,e])}bonifica(){let t=[];for(let o of this.mondo.tutti())o.y<bo.yMin&&o.tipo.startsWith("acqua")&&t.push([o.x,o.y,o.z]);for(let[o,e,i]of t)this.mondo.togli(o,e,i,!0);return t.length}pianificaAttorno([t,o,e]){this.pianifica(t,o,e),this.pianifica(t,o-1,e),this.pianifica(t,o+1,e);for(let[i,n]of Ga)this.pianifica(t+i,o,e+n)}tick(){if(!this.attiva||this.coda.size===0)return 0;let t=[...this.coda.values()].slice(0,bo.budget);for(let[e,i,n]of t)this.coda.delete(Xa(e,i,n));let o=0;for(let[e,i,n]of t)o+=this._riesamina(e,i,n)?1:0;return o}_riesamina(t,o,e){let i=this.mondo,n=i.tipo(t,o,e);if(n&&!F(n).acqua)return!1;if(o<bo.yMin)return n?(i.togli(t,o,e,!0),!0):!1;let r=n?Mt(n):null;if(r===0)return i.tipo(t,o-1,e)||this.pianifica(t,o-1,e),!1;let s=i.tipo(t,o+1,e),l=!!(s&&F(s).acqua),c=i.tipo(t,o-1,e),u=!!(c&&F(c).acqua),p=!!(c&&!F(c).acqua),f=0,h=1/0;for(let[m,g]of Ga){let v=i.tipo(t+m,o,e+g),b=v?Mt(v):null;if(b!==null){if(b===0&&f++,b!==0){let x=i.tipo(t+m,o-1,e+g);if(!x||F(x).acqua)continue}b<h&&(h=b)}}let d=null;return f>=2&&(p||u&&Mt(c)===0)?d=0:l?d=1:h+1<=bo.portata&&(d=h+1),d===r?(r!==null&&!i.tipo(t,o-1,e)&&this.pianifica(t,o-1,e),!1):(d===null?i.togli(t,o,e,!0):i.metti(t,o,e,d===0?"acqua":"acqua~"+d,!0),this.pianificaAttorno([t,o,e]),!0)}};it();var K=new URLSearchParams(location.search),N={seme:+(K.get("seme")||4242),erba:Math.max(0,Math.min(8,+(K.get("erba")??8))),raggio:Math.max(48,Math.min(160,+(K.get("raggio")||96))),ombra:K.get("ombra")!=="no",mappa:K.get("mappa")==="no"?0:Math.max(256,Math.min(4096,+(K.get("mappa")||(matchMedia("(pointer: coarse)").matches?1024:2048)))),specchio:K.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(K.get("specchio")??.5)||.5)),dprMax:+(K.get("dpr")||1.5),ora:K.has("ora")?+K.get("ora"):null,corpi:+(K.get("corpi")||(K.has("omega")?120:0)),terza:K.has("terza"),zoo:K.has("zoo"),vetrina:K.has("vetrina"),omega:K.has("omega"),varia:K.get("varia")!=="no"},Q=document.getElementById("tela"),{gl:ge,dpr:os,ridimensiona:is}=_i(Q,{antialias:!0,dprMax:N.dprMax}),y=new $e(ge);y.ombra=N.ombra;y.mappa.attiva=N.mappa>0;N.mappa>0&&N.mappa!==y.mappa.lato&&(y.mappa.lato=N.mappa,y.mappa.latoDin=Math.max(256,N.mappa/2),y._preparaMappa());y.specchio.attivo=N.specchio>0;y.specchio.scala=N.specchio||.5;var tt=new Ye(ge);tt.registra("cubo",Li());tt.registra("omino",oi(mo.blu));Ca();for(let[a,t]of Object.entries(dt))tt.registra(a,t.costruisci());qi();rt.lampioneSpento||Gt("lampioneSpento",{...F("lampione"),nome:"Lampione spento",modello:"lampioneSpento",luce:void 0,notte:!1});var k=new je,xt=new ho({varia:N.varia});k.onEvento=a=>xt.evento(a);var hi=K.get("worker")==="no"?null:_a(),as=N.vetrina?La:N.omega?Oa:N.zoo?Sa:(a,t,o)=>wi(a,t,o,N.seme),Bt=new lo(k,y,as,{erba:N.erba,raggioResa:N.raggio,lavoro:hi}),Ei=new xo(k),ci=.2,_o=0,Ai=new He(ge);y.apriFinestraAltezze(.5,.5,512);var Co=N.vetrina?"leafy-vetrina":N.omega?"leafy-omega":N.zoo?"leafy-zoo":`leafy-partita-${N.seme}`,So=0;try{K.has("nuovo")?localStorage.removeItem(Co):So=Va(k,localStorage.getItem(Co))}catch{So=0}var Fe=0;function ns(){try{localStorage.setItem(Co,Ba(k,{seme:N.seme,quando:Date.now()}))}catch{}}var rs=performance.now();Bt.avvio(.5,.5);var ln=performance.now()-rs,li=new Set(["cubo","omino",...Object.keys(dt)]);async function ss(a){if(!li.has(a)){li.add(a);try{let t=await fetch(`./modelli/nucleo/${a}.bin`);if(!t.ok)throw new Error(`${t.status}`);let o=Ri(await t.arrayBuffer());if(a==="albero"){let e=o.byte,i=new DataView(e.buffer,e.byteOffset,e.byteLength),n=[[15,73,82],[20,84,77],[38,124,77],[90,197,80]],r=Math.max(.001,o.maxY-o.minY);for(let s=0;s<o.triangoli;s++){let l=s*3*20,c=e[l+16],u=e[l+17],p=e[l+18];if(!(u>c+20&&u>p+10))continue;let f=Math.min(i.getFloat32(l+4,!0),i.getFloat32(l+24,!0),i.getFloat32(l+44,!0)),h=n[Math.min(3,Math.floor((f-o.minY)/r*4))];for(let d=0;d<3;d++){let m=l+d*20;e[m+16]=h[0],e[m+17]=h[1],e[m+18]=h[2]}}}if(a==="lampione"){let e=o.byte;for(let i=0;i<o.vertici;i++)e[i*20+15]!==1&&(e[i*20+16]=42,e[i*20+17]=47,e[i*20+18]=77)}if(tt.registra(a,o),xt.sporchi.add(a),a==="lampione"){let e=new Uint8Array(o.byte);for(let i=0;i<o.vertici;i++)e[i*20+15]===1&&(e[i*20+15]=0,e[i*20+16]=25,e[i*20+17]=25,e[i*20+18]=49);tt.registra("lampioneSpento",{...o,byte:e}),li.add("lampioneSpento"),xt.sporchi.add("lampioneSpento")}}catch(t){console.warn(`modello ${a}: ${t.message}`)}}}function cs(){for(let[a,t]of xt.cambiate()){if(!tt.tipi.has(a)){ss(a),xt.sporchi.add(a);continue}tt.istanze(a,t,8);let o=Se(a);if(o&&o.alone){let{quota:e,raggio:i,colore:n}=o.alone,r=t.length/8,s=new Float32Array(r*8);for(let l=0;l<r;l++){let c=l*8,u=t[c+3];s.set([t[c],t[c+1]+e*u,t[c+2],i*u,n[0],n[1],n[2],1],c)}Ai.istanze(s)}}}function bn(a,t){for(let o=60;o>-60;o--)if(k.solido(a,o,t))return o+1;return 8}var T=new Je(k,{x:.5,y:(N.vetrina?bt:N.zoo?ot:bn(0,0))+.5+(N.zoo||N.vetrina?1:0),z:N.vetrina?2.5:.5}),at=Di(),ve=new oo(at),ls=new io(a=>{!a&&ve.azzera&&ve.azzera()}),Zt=new uo(Q,{alpha:.6,beta:-.2}),be=!1,xe=!0,ke=new Set;window.addEventListener("keydown",a=>{if(!/^(INPUT|TEXTAREA)$/.test(a.target&&a.target.tagName)){if(ke.add(a.code),a.code==="KeyF"&&fs(),a.code==="KeyH"){let t=document.getElementById("stato");t.hidden=!t.hidden}a.code==="KeyM"&&Mn(!Be),a.code==="KeyC"&&wo(20),/^Digit[0-9]$/.test(a.code)&&me(a.code==="Digit0"?9:+a.code.slice(5)-1)}});window.addEventListener("keyup",a=>ke.delete(a.code));window.addEventListener("blur",()=>ke.clear());var oe=6;window.addEventListener("wheel",a=>{xe&&(oe=Math.max(1.5,Math.min(40,oe*(a.deltaY>0?1.12:.89))))},{passive:!0});var yo=0,us=a=>{let t=a.targetTouches;if(t.length<2){yo=0,Zt.fermo=!1;return}Zt.fermo=!0;let o=Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);yo>0&&xe&&o>1&&(oe=Math.max(1.5,Math.min(40,oe*yo/o))),yo=o};for(let a of["touchstart","touchmove","touchend","touchcancel"])Q.addEventListener(a,us,{passive:!0});function xn(a){be=a,be&&(T.vy=0)}function fs(){xn(!be)}document.getElementById("cubi").addEventListener("click",()=>wo(20));var Ht=1/60,we=0,kt={x:T.x,y:T.y,z:T.z},Le=T.y,En=0;function zi(){let a=Math.min(1,we/Ht),t=kt.y+(T.y-kt.y)*a;return t<Le?Le=t:Le+=(t-Le)*(1-Math.exp(-En/.12)),[kt.x+(T.x-kt.x)*a,Le,kt.z+(T.z-kt.z)*a]}var di=!1;function ps(a){we=Math.min(we+a,Ht*4);let t=Zt.avantiPiano();for(;we>=Ht;){if(we-=Ht,kt.x=T.x,kt.y=T.y,kt.z=T.z,be){let e=9*Ht,i=t.x,n=t.z;T.x+=(i*at.avanti-n*at.destra)*e,T.z+=(n*at.avanti+i*at.destra)*e,T.y+=((at.salta?1:0)-(ke.has("ShiftLeft")||ke.has("KeyX")?1:0))*e,T.vy=0;continue}T.aggiorna(Ht,Es(t),t);let o=e=>{let i=k.tipo(Math.floor(T.x),Math.floor(T.y+e),Math.floor(T.z));return!!(i&&F(i).acqua)};di=o(.3),di&&(o(.75)?T.vy=Math.min(T.vy+40*Ht,1.4):T.vy<-.8&&(T.vy=-.8),at.salta&&(T.vy=2.5),T.aTerra=!1)}}var st={mira:null,occhio:null,tira:!1,buco:!1},ui=0,un=0;function Ro(a=0){En=a;let t=Zt.verso(),[o,e,i]=zi(),n=[o,e+(xe?.8:1),i];if(!xe)return st.mira=null,{occhio:n,centro:[n[0]+t[0],n[1]+t[1],n[2]+t[2]],fov:1.36,rapporto:Q.width/Q.height};let r=oe;if(st.tira){for(let u=.5;u<=oe;u+=.5)if(k.solido(Math.floor(n[0]-t[0]*u),Math.floor(n[1]-t[1]*u),Math.floor(n[2]-t[2]*u))){r=Math.max(.6,u-.6);break}}let s=[n[0]-t[0]*r,n[1]-t[1]*r,n[2]-t[2]*r];st.mira||(st.mira=n.slice(),st.occhio=s.slice());let l=1-Math.exp(-a/.09),c=1-Math.exp(-a/.06);for(let u=0;u<3;u++)st.mira[u]+=(n[u]-st.mira[u])*l,st.occhio[u]+=(s[u]-st.occhio[u])*c;return{occhio:st.occhio.slice(),centro:st.mira.slice(),fov:1.15,rapporto:Q.width/Q.height}}var hs=document.getElementById("barra"),fn=document.getElementById("azione"),te=1,Tt=[...to,...Object.keys(dt)];function An(a){if(!a)return null;try{return _t[a]?_t[a].colore:dt[a]?dt[a].colore:Qe(jt(a),8).cima}catch{return null}}function Lo(a){if(!a)return"mano";if(_t[a])return _t[a].nome;if(dt[a])return dt[a].nome;let t=rt[a];return t&&t.nome||a}function zn(a,t){let o=document.createElement("button"),e=An(a);return o.innerHTML=`<span class="q" style="background:${e!=null?"#"+(e>>>0).toString(16).padStart(6,"0"):"transparent"}"></span>${Lo(a)}`,o.addEventListener("click",()=>me(t)),hs.appendChild(o),o}var Oo=Tt.map(zn);function ds(a){if(a==null){me(0);return}let t=Tt.indexOf(a);if(t>=0){me(t);return}Tt.push(a),Oo.push(zn(a,Tt.length-1)),me(Tt.length-1)}function me(a){te=(a%Tt.length+Tt.length)%Tt.length,Oo.forEach((t,o)=>t.classList.toggle("scelto",o===te)),Oo[te].scrollIntoView({inline:"center",block:"nearest"})}me(1);var qe=new eo,D=null,Io=!1,Pt={x:0,y:0,visto:!1},Be=!1;function Mn(a){Be=!!a,document.body.classList.toggle("mira-centro",Be)}Q.addEventListener("pointermove",a=>{Pt.x=a.clientX,Pt.y=a.clientY,Pt.visto=!0});Q.addEventListener("pointerdown",a=>{Pt.x=a.clientX,Pt.y=a.clientY,Pt.visto=!0});var fi=[];function ms(a){fi.length=0;let t=4e4;for(let o of xt.tipiVivi()){if(o==="omino"||o==="cubo")continue;let e=se[o]||(o==="lampioneSpento"?se.lampione:null),i=e?e.altezza:1,n=e?e.mezza:.5;xt.ognunaDi(o,(r,s,l)=>{let c=r-a.x,u=l-a.z;c*c+u*u>t||fi.push({min:{x:r-n,y:s,z:l-n},max:{x:r+n,y:s+i,z:l+n},dato:{cella:[Math.floor(r),s,Math.floor(l)]}})})}return fi}function gs(a){let t=0,o=0;if(!(Be||document.pointerLockElement===Q||!Pt.visto)){let i=Q.getBoundingClientRect();t=(Pt.x-i.left)/i.width*2-1,o=1-(Pt.y-i.top)/i.height*2}return ka(a.occhio,a.centro,a.fov,a.rapporto,t,o)}function mi(a,t,o){for(let e=0;e<=2;e++){let i=k.tipo(a,t-e,o);if(i==="lampione"||i==="lampioneSpento")return[a,t-e,o,i];if(i&&e===0)return null}return null}function pn(a,t,o,e){k.togli(a,t,o),k.metti(a,t,o,e==="lampione"?"lampioneSpento":"lampione"),Bt.tocca(a,o),Fe=1e3}var vs={solido:(a,t,o)=>{if(k.solido(a,t,o))return!0;let e=k.tipo(a,t,o);return!!(e&&F(e).acqua)}};function gi(){if(!D)return["niente",Pt.visto?"troppo lontano":""];let a=Tt[te];if(D.acqua)return a&&!_t[a]&&!ve.demolisci?["posa",`posa nell'acqua: ${Lo(a)}`]:["tocca","nuota fin l\xEC"];let[t,o,e]=D.cella,i=k.tipo(t,o,e),n=mi(t,o,e);return ve.demolisci?["rompi",`rompi: ${i?F(i).nome:""} (tieni premuto)`]:n&&(!a||_t[a])?["lampione",n[3]==="lampione"?"spegni il lampione":"accendi il lampione"]:a&&!_t[a]?["posa",`posa: ${F(a).nome}`]:["tocca",`tocca: ${i?F(i).nome:""}`]}function _n(a,t,o,e){e?k.metti(a,t,o,e):k.togli(a,t,o),Bt.tocca(a,o),Ei.pianificaAttorno([a,t,o]),Fe=1e3}function bs(){if(!D)return;let a=Tt[te];if(!a||_t[a])return;let[t,o,e]=D.acqua?D.cella:D.prima;if(!ki(k,t,o,e))return;let i=k.tipo(t,o,e),n=i&&F(i).acqua&&Kt.has(F(a).forma),r=n?Mt(i)||0:null,s=T;t+1>s.x-.3&&t<s.x+.3&&e+1>s.z-.3&&e<s.z+.3&&o+1>s.y&&o<s.y+.9||(_n(t,o,e,a),n&&k.bagna(t,o,e,r))}function xs(){if(!D)return;let[a,t,o]=D.cella;_n(a,t,o,null)}Q.addEventListener("contextmenu",a=>a.preventDefault());Vi(Q,a=>{if(Zt.trascinato>6)return;if(Ue&&D&&D.cella){let o=xt.idInCella(D.cella[0],D.cella[1],D.cella[2]);o!=null&&Ue.scegli(o)}let[t]=gi();if(a.button===2||a.pointerType==="touch"&&!ve.demolisci)if(t==="lampione"){let o=mi(...D.cella);pn(o[0],o[1],o[2],o[3])}else t==="posa"?bs():D&&hn(D);else if(a.button===0&&a.pointerType!=="touch")if(t==="lampione"){let o=mi(...D.cella);pn(o[0],o[1],o[2],o[3])}else t==="tocca"&&D&&hn(D)});var mt=null,Pe=0,vi=0,bi=0;function hn(a){let t=a.faccia&&a.faccia[1]>0?a.cella:a.prima;mt={x:t[0]+.5,y:a.faccia&&a.faccia[1]>0?t[1]+1:t[1],z:t[2]+.5,cella:[t[0],a.faccia&&a.faccia[1]>0?t[1]+1:t[1],t[2]]},Pe=0,vi=T.x,bi=T.z}var Oe={avanti:0,destra:0,salta:!1};function Es(a){if(at.avanti||at.destra||at.salta)return mt=null,at;if(!mt)return at;let t=mt.x-T.x,o=mt.z-T.z,e=Math.hypot(t,o);if(e<.35)return mt=null,at;let i=a.x,n=a.z;return Oe.avanti=(t*i+o*n)/e,Oe.destra=(t*-n+o*i)/e,Pe+=Ht,Math.hypot(T.x-vi,T.z-bi)>.05&&(Pe=0,vi=T.x,bi=T.z),Oe.salta=Pe>.5&&T.aTerra,Oe.salta&&(Pe=0),Oe}Gi(Q,{onInizio:a=>{Io=!(a.pointerType==="touch"&&!ve.demolisci)},onFine:()=>{Io=!1,qe.molla()}},0);var Et=new fo(k),No=[[.36,.72,.3],[.62,.42,.26],[.84,.26,.24],[.28,.44,.84],[.93,.78,.26],[.62,.64,.66],[.96,.96,.96]],dn=null;function wo(a){let t=Zt.verso(),o=Ro().occhio;for(let e=0;e<a&&Et.lista.length<800;e++){let i=9+Math.random()*4,n=()=>(Math.random()-.5)*2.2;Et.aggiungi({x:o[0]+t[0]*1.2+(Math.random()-.5)*.4,y:o[1]+t[1]*1.2+Math.random()*.4,z:o[2]+t[2]*1.2+(Math.random()-.5)*.4,vx:t[0]*i+n(),vy:t[1]*i+2+n(),vz:t[2]*i+n(),lato:.35+Math.random()*.3,colore:No[Math.floor(Math.random()*No.length)],giro:Math.random()*Math.PI})}}if(N.corpi>0)for(let a=0;a<Math.min(800,N.corpi);a++)Et.aggiungi({x:T.x+(Math.random()-.5)*12,y:T.y+6+Math.random()*10,z:T.z+(Math.random()-.5)*12,lato:.35+Math.random()*.3,colore:No[a%No.length],giro:Math.random()*Math.PI});var Jt={ora:N.ora??.35,auto:N.ora===null,durata:600},Ie=[];function As(){let a=T;Ie.length=0,xt.ognunaDi("lampione",(o,e,i)=>{let n=(o-a.x)*(o-a.x)+(i-a.z)*(i-a.z);n<3600&&Ie.push([n,o,e,i])}),Ie.sort((o,e)=>o[0]-e[0]);let t=Math.min(8,Ie.length);for(let o=0;o<t;o++){let e=Ie[o];y.lampade[o*4]=e[1],y.lampade[o*4+1]=e[2],y.lampade[o*4+2]=e[3],y.lampade[o*4+3]=4.6}y.nLampade=y.lampadeAccese===!1?0:t}var de=[],pi=48,zs=10,Ne=0;function Ms(a,t){let o=T;de.length=0;let[e,,i]=zi();Ne=a?1:Math.max(0,Ne-t/.33),Ne>.02&&de.push([0,e,i,.3*Ne,.4*Ne]);for(let r of Et.lista){if(!r.inAcqua)continue;let s=(r.x-o.x)*(r.x-o.x)+(r.z-o.z)*(r.z-o.z);if(s>=pi*pi)continue;let l=Math.min(1,(pi-Math.sqrt(s))/zs),c=r.lato*.45*l*Math.min(1,(r.sommerso??1)*3);de.push([s,r.x,r.z,c,c])}de.sort((r,s)=>r[0]-s[0]);let n=Math.min(8,de.length);for(let r=0;r<n;r++){let s=de[r];y.galleggianti[r*4]=s[1],y.galleggianti[r*4+1]=s[2],y.galleggianti[r*4+2]=s[3],y.galleggianti[r*4+3]=s[4]}y.nGalleggianti=n}var De=new vo(N.seme);K.has("mare")&&(De.auto=!1,De.agitazione=De.meta=Math.max(0,Math.min(1,+K.get("mare")||0)));function _s(a){Jt.auto&&(Jt.ora=(Jt.ora+a/Jt.durata)%1);let o=Jt.ora*Math.PI*2-Math.PI/2,e=.24+.5*Math.max(0,Math.sin(o)),i=o*.5;y.sole.verso=[-Math.cos(i)*Math.cos(Math.asin(e)),-e,-Math.sin(i)*Math.cos(Math.asin(e))];let n=Math.max(0,Math.min(1,(Math.sin(o)+.1)*2));y.sole.forza=n,y.mare=De.aggiorna(a),_o+=a,_o>=ci&&(_o=Math.min(_o-ci,ci),Ei.tick()),As(),Ms(di,a);let r=Math.min(1,Math.max(0,(e-.24)/.4));y.sole.colore=[1,.78+.22*r,.55+.45*r],y.sole.cielo=[.36+.64*n,.38+.62*n,.57+.43*n],y.nebbia.colore=N.vetrina?[0,0,0]:[.25+.47*n,.35+.5*n,.5+.42*n],ge.clearColor(y.nebbia.colore[0],y.nebbia.colore[1],y.nebbia.colore[2],1)}y.nebbia.da=N.raggio-24;y.nebbia.a=N.raggio+8;N.vetrina&&(y.cieloNero=!0,y.nebbia.da=400,y.nebbia.a=500);var pt=[],ee=[],To=[],mn=performance.now(),yn=0,gn=0;function Tn(a){let t=Math.min(.1,(a-mn)/1e3);mn=a;let o=performance.now();is(),_s(t),ps(t),Et.avanza(t),Bt.aggiorna(T.x,T.z,5),y.seguiAltezze(T.x,T.z),cs();let e=Ro(t);y.buco=xe&&st.buco?[e.centro[0],e.centro[1]-.2,e.centro[2],.75]:[0,0,0,0];let i=Zt.verso(),n=gs(e),r={x:e.occhio[0],y:e.occhio[1],z:e.occhio[2]};if(D=Ui(k,r,n,ms(r),200),!D){let h=Yo(vs,r,n,200);h&&(h.acqua=!0,D=h)}if(D&&D.scatola&&(D.cella=D.dato.cella),Io&&D&&!D.acqua){let[h,d,m]=D.cella;qe.premi(h+","+d+","+m,Bi(F(k.tipo(h,d,m))),a),qe.finito(a)&&xs()}else Io||qe.molla();tt.istanze("cubo",dn=Et.istanze(dn),8),(at.avanti||at.destra||mt)&&(un=Math.PI-T.verso);let s=un-ui;s=Math.atan2(Math.sin(s),Math.cos(s)),ui+=s*(1-Math.exp(-t/.08));let l=(at.avanti||at.destra||mt)&&T.aTerra?Math.abs(Math.sin(a/90))*.06:0,[c,u,p]=zi();if(tt.istanze("omino",[c,u+l,p,1,1,1,1,ui],8),mt&&y.scatola(mt.cella[0],mt.cella[1],mt.cella[2],1,.95,.6,.3,.02),y.disegna(e,t,tt),tt.disegna(y,e),D){let[h,d]=gi(),m=qe.progresso(a),[g,v,b]=D.cella;h==="rompi"||m>0?y.scatola(g,v,b,1,.35-.2*m,.25,.28+.25*m):h==="lampione"?y.scatola(g,v,b,1,.9,.4,.3):y.scatola(g,v,b,1,.95,.5,.22),h==="posa"&&!k.pieno(...D.prima)&&y.scatola(D.prima[0],D.prima[1],D.prima[2],.6,.85,1,.35,.1),y.evidenzia(g,v,b,m),fn.textContent=d}else fn.textContent=gi()[1];y.disegnaAcqua(),Ai.disegna(y,e);let f=performance.now()-o;pt.push(t*1e3),pt.length>240&&pt.shift(),ee.push(f),ee.length>240&&ee.shift(),yn++,xi&&xi(),Fe>0&&(Fe-=t*1e3,Fe<=0&&ns()),a-gn>500&&(gn=a,ys()),requestAnimationFrame(Tn)}var gt=(a,t)=>{if(!a.length)return 0;let o=[...a].sort((e,i)=>e-i);return o[Math.min(o.length-1,Math.floor(o.length*t))]};function ys(){let a=gt(pt,.5),t=gt(pt,.99),o=pt.length?pt.reduce((s,l)=>s+l,0)/pt.length:0,e=o?1e3/o:0,i=t?1e3/t:0;To.push(Math.round(e)),To.length>120&&To.shift(),document.getElementById("fps").textContent=`${e.toFixed(0)} fps \xB7 1% ${i.toFixed(0)}
${a.toFixed(1)} / ${t.toFixed(1)} ms
JS ${gt(ee,.5).toFixed(2)} ms`;let n=y.statistiche,r=Bt.statistiche;document.getElementById("stato").textContent=`${N.vetrina?"VETRINA":N.zoo?"ZOO":"PARTITA"} sul nucleo \xB7 seme ${N.seme} \xB7 ${Q.width}\xD7${Q.height} (dpr ${os.toFixed(2)})
disegni ${n.disegni+tt.statistiche.disegni+n.disegniAcqua+n.disegniErba+n.disegniSpecchio} \xB7 triangoli ${(n.triangoli+tt.statistiche.triangoli+n.triangoliAcqua+n.triangoliErba+n.triangoliSpecchio).toLocaleString("it")} \xB7 chunk ${n.chunkVisti}/${n.chunkTotali} (coda ${r.inCoda}${hi?`, in volo ${r.inVolo} su ${hi.operai.length} worker`:""}, ${r.ultimaMs.toFixed(1)} ms) \xB7 corpi ${Et.statistiche.corpi} (${Et.statistiche.svegli} svegli)
x ${T.x.toFixed(1)} y ${T.y.toFixed(1)} z ${T.z.toFixed(1)} \xB7 ${be?"volo":T.aTerra?"a terra":"in aria"} \xB7 modifiche ${ii(k)}${So>0?` (${So} ricaricate)`:""} \xB7 in mano: ${Oo[te].textContent}${D?` \xB7 miri ${k.tipo(...D.cella)}`:""}
WASD/joystick cammina \xB7 clic a terra (mano vuota) o destro = il gatto ci va \xB7 trascina = gira la camera \xB7 rotella/pizzico = zoom \xB7 sinistro tieni = scava \xB7 destro/tocco = posa o accendi \xB7 \u26CF col dito scava \xB7 C cubi \xB7 1-9 cassetta \xB7 M mirino`}requestAnimationFrame(Tn);var vn=null,xi=null,Ue=null;async function Cn(){if(vn){document.body.classList.toggle("con-officina");return}let{apriOfficina:a}=await Promise.resolve().then(()=>(Wa(),Ka)),{creaScena:t}=await Promise.resolve().then(()=>(on(),en)),{registroCreativa:o,voci:e}=await Promise.resolve().then(()=>(cn(),sn)),{CATEGORIE_BLOCCHI:i}=await Promise.resolve().then(()=>(it(),Oi)),{CATALOGO:n}=await Promise.resolve().then(()=>(Re(),Ea));Ue=t({entita:xt,dove:()=>({x:T.x,y:T.y,z:T.z}),coloreDi:c=>{let u=An(c);return u==null?"#888888":"#"+(u>>>0).toString(16).padStart(6,"0")},nomeDi:Lo,rigaDi:Se,onVaiA:c=>{c&&(T.x=c.x,T.z=c.z,T.y=c.y+2.5,T.vy=0,mt=null)}});let s=o({elenco:e({categorie:i,blocchi:rt,catalogo:n,nomeArredo:Lo}),inMano:()=>Tt[te]??null,onPrendi:ds}),l={get volo(){return be},get terza(){return xe},impostaVolo:xn,dove:()=>`x ${T.x.toFixed(1)} y ${T.y.toFixed(1)} z ${T.z.toFixed(1)}`,aCasa:()=>{T.x=.5,T.z=.5,T.y=bn(0,0)+.5,T.vy=0},modifiche:()=>ii(k),nuovo:()=>{try{localStorage.removeItem(Co)}catch{}location.search=`?seme=${N.seme}&nuovo`}};document.body.classList.add("con-officina"),l.cameraTira=()=>st.tira,l.impostaCameraTira=c=>st.tira=!!c,l.buco=()=>st.buco,l.impostaBuco=c=>st.buco=!!c,l.miraCentro=()=>Be,l.impostaMiraCentro=Mn,vn=a({gruppi:[{contenitore:document.getElementById("rqGerarchia"),etichetta:"Gerarchia",registri:[Ue.gerarchia],azioni:!1},{contenitore:document.getElementById("rqAssets"),etichetta:"Assets",registri:[s],azioni:!1},{contenitore:document.getElementById("rqIspettore"),etichetta:"Ispettore",registri:[Ue.ispettore],azioni:!0},{contenitore:document.getElementById("rqImpostazioni"),etichetta:"Impostazioni",azioni:!1,registri:[Ia(y,Ai),Na(y),qa(Jt),wa(De),Pa(Et,wo),Fa(Bt),Da(l),Ua({zoo:N.zoo,vetrina:N.vetrina,seme:N.seme})]}],campione:()=>({disegni:y.statistiche.disegni+tt.statistiche.disegni+y.statistiche.disegniAcqua+y.statistiche.disegniErba+y.statistiche.disegniSpecchio,rtMs:null}),autore:"partita",titolo:"Officina \xB7 partita",apertoSubito:!0,scuro:!0,agganciaFrame:c=>xi=c}),document.getElementById("chiudiDock").addEventListener("click",()=>document.body.classList.remove("con-officina"))}document.getElementById("apriOfficina").addEventListener("click",Cn);K.has("officina")&&Cn();var Ts=new ao(()=>({versione:(document.getElementById("versione")||{}).textContent||"partita in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:ls.scelta,ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[Q.clientWidth,Q.clientHeight],reso:[Q.width,Q.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:"partita sul nucleo",seme:N.seme,raggio:N.raggio,erba:N.erba,ombra:y.ombra,specchio:N.specchio,disegniSpecchio:y.statistiche.disegniSpecchio,corpi:Et.statistiche.corpi,dprMax:N.dprMax,jsMs:+gt(ee,.5).toFixed(2),jsP99:+gt(ee,.99).toFixed(2),streaming:{...Bt.statistiche},finestra:y.finestra&&y.finestra.spostamenti},ombreLampade:!1,antialias:!0,fps:gt(pt,.5)?1e3/gt(pt,.5):null,p50:gt(pt,.5),p99:gt(pt,.99),disegni:y.statistiche.disegni+tt.statistiche.disegni+y.statistiche.disegniAcqua+y.statistiche.disegniErba+y.statistiche.disegniSpecchio,triangoli:y.statistiche.triangoli+tt.statistiche.triangoli+y.statistiche.triangoliAcqua+y.statistiche.triangoliErba+y.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:To,storiaLivelli:[],scheda:qo(ge),software:/swiftshader|llvmpipe/i.test(qo(ge)),chunk:y.statistiche.chunkTotali,blocchi:k.contaBlocchi,luci:0,decorazioni:xt.conta,erba:y.statistiche.triangoliErba,ora:`${Math.floor(Jt.ora*24)}h`,giorno:0,worldgenMs:ln,meshMs:ln}),()=>(y.disegna(Ro(),0,tt),tt.disegna(y,Ro()),y.disegnaAcqua(),Promise.resolve(Q.toDataURL("image/webp",.6))));globalThis.PARTITA={resa:y,modelli:tt,mondo:k,passeggero:T,sguardo:Zt,corpi:Et,streaming:Bt,entita:xt,simAcqua:Ei,opz:N,lanciaCubi:wo,intento:at,zoom:()=>oe,mirato:()=>D,statistiche:()=>({fps:1e3/(gt(pt,.5)||1),p50:gt(pt,.5),p99:gt(pt,.99),js:gt(ee,.5),...y.statistiche,modelli:{...tt.statistiche},streaming:{...Bt.statistiche},corpi:{...Et.statistiche},fotogrammi:yn}),diagnostica:Ts};

var er=Object.defineProperty;var Tt=(i,t,o)=>()=>{if(o)throw o[0];try{return i&&(t=i(i=0)),t}catch(e){throw o=[e],e}};var re=(i,t)=>{for(var o in t)er(i,o,{get:t[o],enumerable:!0})};var ti={};re(ti,{BLOCCHI:()=>et,CATEGORIA_OFFICINA:()=>ce,CATEGORIA_PROVE:()=>oa,CATEGORIE_BLOCCHI:()=>se,defBlocco:()=>xr,defDi:()=>w,livelloAcqua:()=>Ct,registraBlocco:()=>_t,rimuoviBlocco:()=>Ja,tipoBase:()=>Wt});function _t(i,t,o=ce){et[i]=t,o.blocchi.includes(i)||o.blocchi.push(i)}function Ja(i){delete et[i];for(let t of[ce,oa]){let o=t.blocchi.indexOf(i);o>=0&&t.blocchi.splice(o,1)}}function xr(i){return et[i]}function w(i){return et[i.charCodeAt(0)===97&&i.startsWith("acqua")?"acqua":i]||br}function Wt(i){let t=i.indexOf("~");return t<0?i:i.slice(0,t)}function Ct(i){if(!i||!i.startsWith("acqua"))return null;let t=i.indexOf("~");return t<0?0:Number(i.slice(t+1))}var et,se,ce,oa,br,at=Tt(()=>{et={erba:{nome:"Erba",cima:5949008,lato:15047529,fondo:12546123,orlo:3446604,solido:!0,nav:10,cappello:!0,fam:"scavo"},terra:{nome:"Terra",cima:12546123,lato:12546123,fondo:11034431,solido:!0,nav:10,fam:"scavo"},sabbia:{nome:"Sabbia",cima:15324316,lato:14599048,fondo:13808246,solido:!0,nav:12,fam:"scavo"},ghiaia:{nome:"Ghiaia",cima:10130572,lato:9143677,fondo:8354162,solido:!0,nav:12,fam:"scavo"},neve:{nome:"Neve",cima:15923191,lato:14740202,fondo:13688028,solido:!0,nav:12,fam:"scavo"},roccia:{nome:"Roccia",cima:11054778,lato:9673384,fondo:8883868,solido:!0,nav:10,fam:"mina"},pietra:{nome:"Pietra liscia",cima:12436429,lato:11449535,fondo:10660019,solido:!0,nav:10,fam:"mina"},mattoni:{nome:"Mattoni",cima:11555645,lato:10570294,fondo:9650735,solido:!0,nav:10,fam:"mina"},legno:{nome:"Legno",cima:11568720,lato:10252866,fondo:9266489,solido:!0,nav:10,fam:"taglia"},tronco:{nome:"Tronco",cima:12622434,lato:8016432,fondo:12622434,solido:!0,nav:10,fam:"taglia"},asse:{nome:"Assi chiare",cima:14268798,lato:13150317,fondo:12163422,solido:!0,nav:10,fam:"taglia"},lanaBianca:{nome:"Lana bianca",cima:15724786,lato:14869478,fondo:14014170,solido:!0,nav:10,fam:"scavo"},lanaRossa:{nome:"Lana rossa",cima:14703182,lato:13388608,fondo:12206648,solido:!0,nav:10,fam:"scavo"},lanaBlu:{nome:"Lana blu",cima:4882388,lato:4157120,fondo:3629227,solido:!0,nav:10,fam:"scavo"},lanaGialla:{nome:"Lana gialla",cima:15911244,lato:14727230,fondo:13477428,solido:!0,nav:10,fam:"scavo"},lanaVerde:{nome:"Lana verde",cima:5813096,lato:4890714,fondo:4165454,solido:!0,nav:10,fam:"scavo"},ferro:{nome:"Ferro",cima:12174028,lato:10792376,fondo:9410723,solido:!0,nav:10,fam:"scavo",materia:"metallo"},fanghiglia:{nome:"Fanghiglia",cima:11569756,lato:10517842,fondo:9268551,solido:!0,nav:10,fam:"scavo",materia:"fango"},ghiaccio:{nome:"Ghiaccio",cima:12576498,lato:11131114,fondo:9685472,solido:!0,nav:10,fam:"scavo",materia:"ghiaccio"},cristallo:{nome:"Cristallo",cima:16771496,lato:16243851,fondo:15256437,solido:!0,nav:10,fam:"mina",salute:100,materia:"accesa",luce:{colore:16767370,raggio:6,intensita:1,ombra:!0}},ottone:{nome:"Ottone",cima:14267482,lato:12820556,fondo:11044927,solido:!0,nav:10,fam:"scavo",materia:"specchio"},lucciola:{nome:"Lucciola verde",cima:11075504,lato:6280814,fondo:4634967,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:8257440,raggio:5,intensita:1.1,ombra:!0}},lampadaPesante:{nome:"Lampada pesante (con ombra)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!0}},lampadaLeggera:{nome:"Lampada leggera (trapassa i muri)",cima:16771764,lato:15777891,fondo:14264132,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16767113,raggio:8,intensita:1.1,ombra:!1}},lampadaRossa:{nome:"Lampada rossa",cima:16759213,lato:15224892,fondo:13187624,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:16722458,raggio:8,intensita:1.1,ombra:!0}},lampadaVerde:{nome:"Lampada verde",cima:11993028,lato:4183135,fondo:3124809,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:1769274,raggio:8,intensita:1.1,ombra:!0}},lampadaBlu:{nome:"Lampada blu",cima:11584767,lato:4220128,fondo:3099837,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:2771711,raggio:8,intensita:1.1,ombra:!0}},fuochiFatui:{nome:"Nido di fuochi fatui",cima:13498111,lato:5083048,fondo:3500413,solido:!0,nav:10,fam:"mina",salute:100,luce:{colore:9430271,raggio:3,intensita:.7,ombra:!1},fuochiFatui:{numero:7,raggio:3.2,quota:1.9,luce:{colore:10477823,raggio:4.2,intensita:1}}},acqua:{nome:"Acqua",cima:5227244,lato:4042208,fondo:3184332,solido:!1,nav:null,acqua:!0}},se=[{id:"naturali",nome:"Naturali",emoji:"\u{1F33F}",blocchi:["erba","terra","sabbia","ghiaia","neve","roccia","lucciola","acqua"]},{id:"costruzione",nome:"Costruzione",emoji:"\u{1F9F1}",blocchi:["legno","tronco","asse","pietra","mattoni"]},{id:"lane",nome:"Lane",emoji:"\u{1F3A8}",blocchi:["lanaBianca","lanaRossa","lanaBlu","lanaGialla","lanaVerde"]},{id:"luci",nome:"Luci",emoji:"\u{1F4A1}",blocchi:["lucciola","lampadaPesante","lampadaLeggera","lampadaRossa","lampadaVerde","lampadaBlu","fuochiFatui"]}],ce={id:"officina",nome:"Officina",emoji:"\u{1F6E0}\uFE0F",blocchi:[]};se.push(ce);oa={id:"prove",nome:"Prove",emoji:"\u{1F317}",blocchi:[]};se.push(oa);br={nome:"Blocco perduto",cima:12950225,lato:11305912,fondo:9924767,solido:!0,nav:10,fam:"mina"}});var ki={};re(ki,{CATALOGO:()=>he,conAlone:()=>jr,istanzaDi:()=>Zr,posaDi:()=>To,registraAsset:()=>Pe,rigaDi:()=>we});function we(i){return Object.prototype.hasOwnProperty.call(he,i)?he[i]:null}function Pe(i,t){return he[i]={nome:i,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1],...t,modello:t.modello||i},he[i]}function pa(i,t,o,e){let a=Math.imul(i|0,374761393)+Math.imul(t|0,668265263)+Math.imul(o|0,1274126177)+Math.imul(e|0,2246822519)|0;return a=Math.imul(a^a>>>13,1274126177),((a^a>>>16)>>>0)/4294967296}function To(i,t,o,e,a=!0){let n=we(i);if(!n||!a)return{scala:1,tinta:[1,1,1],giro:0};let r=1;if(Array.isArray(n.scala)){let l=pa(t,o,e,1);r=n.scala[0]+l*(n.scala[1]-n.scala[0])}else typeof n.scala=="number"&&(r=n.scala);let s=0;return n.giro==="libero"?s=pa(t,o,e,2)*Math.PI*2:n.giro==="quarti"&&(s=Math.floor(pa(t,o,e,2)*4)*Yr),{scala:r,tinta:[1,1,1],giro:s}}function Zr(i,t,o,e,a=!0){let n=To(i,t,o,e,a);return[t,o,e,n.scala,n.tinta[0],n.tinta[1],n.tinta[2],n.giro]}function jr(){return Object.entries(he).filter(([,i])=>i.alone)}var he,Yr,ge=Tt(()=>{he={albero:{nome:"Albero",modello:"albero",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,5,1]},lampione:{nome:"Lampione",modello:"lampione",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1],alone:{quota:2.35,raggio:1.6,colore:[1,.85,.5]}},lampioneSpento:{nome:"Lampione spento",modello:"lampioneSpento",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,4,1]},panchina:{nome:"Panchina",modello:"panchina",giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[2,1,1]},ciuffo:{nome:"Ciuffo",modello:"ciuffo",giro:"libero",scala:[.82,1.24],proiettaOmbra:!1,classe:"fermo",ingombro:[1,1,1]}};Yr=Math.PI/2});function xs(i){return i.length?i.reduce((t,o)=>t+o,0)/i.length:0}function Es(i){if(!i.length)return 0;let t=[...i].sort((o,e)=>o-e);return t[t.length>>1]}function tn(i){if(!i)return{punti:0,giudizio:"poco campione"};let t=Math.max(0,Math.min(100,i.fps/60*100)),o=Math.max(0,Math.min(100,i.liscezza*100-i.singhiozziAlSec*12)),e=Math.round(Math.min(t,o)),a=e>=85?"ottimo":e>=65?"buono":e>=45?"passabile":e>=25?"faticoso":"non regge";return{punti:e,giudizio:a,quanti:Math.round(t),regolarita:Math.round(o),collo:t<=o?"quanti":"ritmo"}}var ve,Ea=Tt(()=>{ve=class{constructor({tetto:t=1200}={}){this.tetto=t,this.dt=[],this.salti=[],this.durataMs=0,this.n=0}campiona(t){!(t>0)||t>1e4||(this.dt.length&&this.salti.push(Math.abs(t-this.dt[this.dt.length-1])),this.dt.push(t),this.durataMs+=t,this.n++,this.dt.length>this.tetto&&(this.dt.shift(),this.salti.shift()))}azzera(){this.dt.length=0,this.salti.length=0,this.durataMs=0,this.n=0}misura(){let t=this.dt;if(t.length<30)return null;let o=[...t].sort((p,m)=>p-m),e=p=>o[Math.min(o.length-1,Math.floor(o.length*p))],a=e(.5),n=e(.99),r=t.reduce((p,m)=>p+m,0)/t.length,s=xs(this.salti),l=Es(this.salti),c=a*2,u=0,d=0;for(let p of t)p>c&&u++,p>=a*.75&&p<=a*1.25&&d++;let f=t.reduce((p,m)=>p+m,0)/1e3;return{n:t.length,fps:r>0?1e3/r:0,fpsBasso:n>0?1e3/n:0,media:r,p50:a,p95:e(.95),p99:n,p999:e(.999),min:o[0],max:o[o.length-1],scarto:s,scartoTipico:l,singhiozzi:u,singhiozziAlSec:f>0?u/f:0,passo:d/t.length,regolare:s<Math.max(.6,a*.06),liscezza:a>0?Math.max(0,Math.min(1,1-s/(a*.5))):0,secondi:f}}riga(){let t=this.misura();return t?`${t.fps.toFixed(0)} fps \xB7 1% ${t.fpsBasso.toFixed(0)} \xB7 p50 ${t.p50.toFixed(1)} p99 ${t.p99.toFixed(1)} ms \xB7 scarto ${t.scarto.toFixed(2)} ms \xB7 singhiozzi ${t.singhiozziAlSec.toFixed(1)}/s \xB7 passo ${(t.passo*100).toFixed(0)}%`+(t.regolare?" \xB7 AGGANCIATO ALLO SCHERMO":""):"ritmo: poco campione"}}});function hn(i){return i&&typeof i=="object"?JSON.parse(JSON.stringify(i)):i}function Ts(i,t){return i===t||i&&t&&typeof i=="object"&&JSON.stringify(i)===JSON.stringify(t)}var qo,gn=Tt(()=>{qo=class{constructor({scrivi:t,autore:o="locale",limite:e=500}={}){this._scrivi=t,this.autore=o,this.limite=e,this.fatti=[],this.disfatti=[],this.diario=[],this._osservatori=new Set}esegui({registro:t,campo:o,prima:e,dopo:a,nota:n}){if(Ts(e,a))return null;let r={registro:t,campo:o,prima:hn(e),dopo:hn(a),autore:this.autore,t:Date.now(),nota:n};return this._scrivi(t,o,r.dopo),this.fatti.push(r),this.fatti.length>this.limite&&this.fatti.shift(),this.disfatti.length=0,this._annota("esegui",r),r}aVista(t,o,e){this._scrivi(t,o,e)}annulla(){let t=this.fatti.pop();return t?(this._scrivi(t.registro,t.campo,t.prima),this.disfatti.push(t),this._annota("annulla",t),t):null}ripeti(){let t=this.disfatti.pop();return t?(this._scrivi(t.registro,t.campo,t.dopo),this.fatti.push(t),this._annota("ripeti",t),t):null}get puoAnnullare(){return this.fatti.length>0}get puoRipetere(){return this.disfatti.length>0}netto(){let t={};for(let o of this.fatti)(t[o.registro]||={})[o.campo]=o.dopo;return t}rigioca(t){for(let o of t)this._scrivi(o.registro,o.campo,o.dopo)}osserva(t){return this._osservatori.add(t),()=>this._osservatori.delete(t)}_annota(t,o){this.diario.push({verbo:t,...o}),this.diario.length>this.limite*2&&this.diario.shift();for(let e of this._osservatori)e(t,o)}}});function za(i){if(i&&i.chiave&&typeof i.disegna=="function")return i.campi=i.campi||[],i;if(!i||!i.chiave||!Array.isArray(i.campi))throw new Error(`registro malformato: ${i&&i.chiave}`);for(let t of i.campi){if(!_s.includes(t.tipo))throw new Error(`${i.chiave}.${t.chiave}: tipo sconosciuto \xAB${t.tipo}\xBB`);if(t.tipo!=="azione"&&typeof t.leggi!="function")throw new Error(`${i.chiave}.${t.chiave}: manca leggi()`);t.tipo==="scelta"&&(t.scelte=(t.scelte||[]).map(o=>typeof o=="object"?o:{v:o,nome:String(o)})),t.tipo==="numero"&&(t.min??=0,t.max??=1,t.passo??=(t.max-t.min)/100)}return i}function wo(i,t){if(t==null)return"\u2014";switch(i.tipo){case"numero":{let o=i.passo>=1?0:i.passo>=.1?1:i.passo>=.01?2:3;return Number(t).toFixed(o)+(i.unita?" "+i.unita:"")}case"interruttore":return t?"s\xEC":"no";case"scelta":{let o=i.scelte.find(e=>e.v===t);return o?o.nome:String(t)}default:return typeof t=="object"?JSON.stringify(t):String(t)}}function vn(i,t){switch(i.tipo){case"numero":return Number(t);case"interruttore":return!!t&&t!=="false";case"scelta":{let o=i.scelte.find(e=>String(e.v)===String(t));return o?o.v:t}default:return t}}var _s,Ma=Tt(()=>{_s=["numero","interruttore","scelta","colore","testo","azione","lettura"]});function Ta(i,t,o){i.push(t),i.length>o&&i.shift()}function Ut(i,t){if(!i.length)return NaN;let o=i.slice().sort((e,a)=>e-a);return o[Math.min(o.length-1,Math.floor(o.length*t))]}function be(i){return Number.isFinite(i)?Math.round(i*10)/10:null}var Po,bn=Tt(()=>{Po=class{constructor({campione:t,finestra:o=240}={}){this._campione=t||(()=>({})),this.finestra=o,this.ms=[],this.disegni=[],this.rtMs=[],this._prima=0,this._raccolta=null}passo(t=performance.now()){if(this._prima){let o=t-this._prima,e=this._campione()||{};Ta(this.ms,o,this.finestra),Number.isFinite(e.disegni)&&Ta(this.disegni,e.disegni,this.finestra),Number.isFinite(e.rtMs)&&Ta(this.rtMs,e.rtMs,this.finestra),this._raccolta&&t>=this._raccolta.da&&(this._raccolta.ms.push(o),Number.isFinite(e.disegni)&&this._raccolta.disegni.push(e.disegni),Number.isFinite(e.rtMs)&&this._raccolta.rtMs.push(e.rtMs))}this._prima=t}adesso(){return{fps:this.ms.length?Math.round(1e3/Ut(this.ms,.5)):null,p50:be(Ut(this.ms,.5)),p99:be(Ut(this.ms,.99)),disegni:this.disegni.length?Math.round(Ut(this.disegni,.5)):null,rtMs:be(Ut(this.rtMs,.5))}}misura({secondi:t=5,riscaldo:o=1,etichetta:e=""}={}){let a=performance.now();return this._raccolta={da:a+o*1e3,ms:[],disegni:[],rtMs:[]},new Promise(n=>{let r=a+(o+t)*1e3,s=()=>{if(performance.now()<r)return requestAnimationFrame(s);let l=this._raccolta;this._raccolta=null,n({etichetta:e,frame:l.ms.length,secondi:t,fps:l.ms.length?Math.round(1e3/Ut(l.ms,.5)):null,p50:be(Ut(l.ms,.5)),p99:be(Ut(l.ms,.99)),disegni:l.disegni.length?Math.round(Ut(l.disegni,.5)):null,rtMs:be(Ut(l.rtMs,.5))})};requestAnimationFrame(s)})}}});var Cs,Fo,xn=Tt(()=>{Ma();Cs=`
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
`,Fo=class{constructor({registri:t,bus:o,vivi:e,radice:a=document.body,titolo:n="Officina",contenitore:r=null,scuro:s=!1,etichetta:l=null,azioni:c=!0}){this.registri=t,this.bus=o,this._vivi=e||(()=>""),this.attivo=t[0]&&t[0].chiave,this._el={},this.incassato=!!r,this._etichetta=l,this._azioni=c,this._costruisci(r||a,n,s),this._orologio=setInterval(()=>this.aggiorna(),500),o.osserva(()=>this.aggiorna(!0))}apri(t=!0){this.incassato&&(t=!0),this.radice.classList.toggle("aperta",t),t&&this.aggiorna(!0)}get aperto(){return this.incassato||this.radice.classList.contains("aperta")}esito(t){this._el.esito.hidden=!t,this._el.esito.textContent=t||""}_costruisci(t,o,e){if(!document.getElementById("officina-stile")){let n=document.createElement("style");n.id="officina-stile",n.textContent=Cs,document.head.appendChild(n)}let a=this.radice=document.createElement("div");a.id="officina",this.incassato&&a.classList.add("incassato","aperta"),e&&a.classList.add("scuro"),a.innerHTML=`
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
      </div>`,t.appendChild(a),this._el.tasto=a.querySelector(".off-tasto"),this._el.vivi=a.querySelector(".off-vivi"),this._el.etichetta=a.querySelector(".off-etichetta"),this._etichetta&&(this._el.etichetta.textContent=this._etichetta,a.classList.add("con-etichetta")),this._azioni||(a.querySelector("[data-fa=annulla]").hidden=!0,a.querySelector("[data-fa=ripeti]").hidden=!0),this.registri.length<2&&a.classList.add("senza-schede"),this._el.nav=a.querySelector("nav"),this._el.campi=a.querySelector(".off-campi"),this._el.esito=a.querySelector(".off-esito"),this._el.annulla=a.querySelector("[data-fa=annulla]"),this._el.ripeti=a.querySelector("[data-fa=ripeti]"),this._el.tasto.addEventListener("click",()=>this.apri(!0)),a.querySelector("[data-fa=chiudi]").addEventListener("click",()=>this.apri(!1)),this._el.annulla.addEventListener("click",()=>this.bus.annulla()),this._el.ripeti.addEventListener("click",()=>this.bus.ripeti()),a.addEventListener("keydown",n=>{n.key==="Escape"&&this.apri(!1),n.stopPropagation()}),a.addEventListener("keyup",n=>n.stopPropagation()),a.querySelector(".off-corpo").addEventListener("wheel",n=>n.stopPropagation(),{passive:!0});for(let n of this.registri){let r=document.createElement("button");r.type="button",r.textContent=n.nome,r.dataset.chiave=n.chiave,r.addEventListener("click",()=>{this.attivo=n.chiave,this._disegnaScheda()}),this._el.nav.appendChild(r)}this._disegnaScheda()}_disegnaScheda(){for(let e of this._el.nav.children)e.classList.toggle("acceso",e.dataset.chiave===this.attivo);let t=this.registri.find(e=>e.chiave===this.attivo),o=this._el.campi;if(o.innerHTML="",this._controlli=[],this._vista=null,!!t){if(t.nota){let e=document.createElement("div");e.className="off-nota",e.textContent=t.nota,o.appendChild(e)}if(typeof t.disegna=="function"){this._vista=t.disegna(o,this)||null;return}for(let e of t.campi)o.appendChild(this._controllo(t,e));this.aggiorna(!0)}}_controllo(t,o){let e=document.createElement("div");e.className="campo",e.dataset.campo=o.chiave;let a=document.createElement("div");a.className="riga";let n=document.createElement("span");n.className="nome",n.textContent=o.nome,a.appendChild(n),e.appendChild(a);let r=(l,c)=>this.bus.esegui({registro:t.chiave,campo:o.chiave,prima:l,dopo:c}),s={campo:o,el:null,mostra:null,tocco:!1};switch(o.tipo){case"numero":{let l=document.createElement("span");l.className="valore",a.appendChild(l);let c=document.createElement("input");c.type="range",c.min=o.min,c.max=o.max,c.step=o.passo;let u;c.addEventListener("input",()=>{u===void 0&&(u=o.leggi()),s.tocco=!0;let d=Number(c.value);l.textContent=wo(o,d),this.bus.aVista(t.chiave,o.chiave,d)}),c.addEventListener("change",()=>{let d=Number(c.value);s.tocco=!1;let f=u===void 0?o.leggi():u;u=void 0,r(f,d)}),e.appendChild(c),s.el=c,s.mostra=d=>{s.tocco||(c.value=d,l.textContent=wo(o,d))};break}case"interruttore":{let l=document.createElement("button");l.type="button",l.className="interruttore",l.addEventListener("click",()=>{let c=!!o.leggi();r(c,!c)}),a.appendChild(l),s.el=l,s.mostra=c=>{l.classList.toggle("acceso",!!c),l.textContent=c?"s\xEC":"no"};break}case"scelta":{let l=document.createElement("select");for(let c of o.scelte){let u=document.createElement("option");u.value=String(c.v),u.textContent=c.nome,l.appendChild(u)}l.addEventListener("change",()=>r(o.leggi(),vn(o,l.value))),a.appendChild(l),s.el=l,s.mostra=c=>{l.value=String(c)};break}case"colore":{let l=document.createElement("input");l.type="color";let c;l.addEventListener("input",()=>{c===void 0&&(c=o.leggi()),this.bus.aVista(t.chiave,o.chiave,l.value)}),l.addEventListener("change",()=>{let u=c===void 0?o.leggi():c;c=void 0,r(u,l.value)}),a.appendChild(l),s.el=l,s.mostra=u=>{document.activeElement!==l&&(l.value=u||"#000000")};break}case"testo":{let l=document.createElement("input");l.type="text",l.readOnly=!o.scrivi,l.addEventListener("change",()=>o.scrivi&&r(o.leggi(),l.value)),a.appendChild(l),s.el=l,s.mostra=c=>{document.activeElement!==l&&(l.value=c??"")};break}case"lettura":{let l=document.createElement("span");l.className="valore",a.appendChild(l),s.mostra=c=>{l.textContent=wo(o,c)};break}case"azione":{e.removeChild(a);let l=document.createElement("button");l.type="button",l.className="azione",l.textContent=o.nome,l.addEventListener("click",async()=>{l.disabled=!0;try{await o.fai(this)}finally{l.disabled=!1,this.aggiorna(!0)}}),e.appendChild(l),s.el=l;break}}if(o.nota){let l=document.createElement("small");l.textContent=o.nota,e.appendChild(l)}return this._controlli.push(s),e}aggiorna(t=!1){if(this._el.tasto.textContent=`\u2699 ${this._vivi(!0)||"Officina"}`,!(!this.aperto&&!t)){this._el.vivi.innerHTML=this._vivi(!1)||"",this._el.annulla.disabled=!this.bus.puoAnnullare,this._el.ripeti.disabled=!this.bus.puoRipetere;for(let o of this._controlli||[])if(!(!o.mostra||o.tocco))try{o.mostra(o.campo.leggi())}catch(e){o.el&&(o.el.title=String(e))}if(this._vista&&this._vista.aggiorna)try{this._vista.aggiorna()}catch{}}}vaiA(t){this.attivo!==t&&(this.attivo=t,this._disegnaScheda())}}});var En={};re(En,{apriOfficina:()=>ys});function ys({registri:i,gruppi:t=null,campione:o,autore:e="officina",titolo:a="Officina",apertoSubito:n=!1,agganciaFrame:r,contenitore:s=null,scuro:l=!1}={}){t&&(i=t.flatMap(b=>b.registri)),i=i.map(za);let c=new Map(i.map(b=>[b.chiave,new Map(b.campi.map(x=>[x.chiave,x]))])),u=new Map(i.map(b=>[b.chiave,b])),d=(b,x,z)=>{let A=c.get(b)&&c.get(b).get(x);if(A&&A.scrivi){A.scrivi(z);return}let T=u.get(b);if(T&&typeof T.scriviDinamico=="function"){T.scriviDinamico(x,z);return}throw new Error(`campo non scrivibile: ${b}.${x}`)},f=new qo({scrivi:d,autore:e}),p=new Po({campione:o}),m=b=>{let x=p.adesso();return x.fps==null?b?"Officina":"in attesa del primo fotogramma\u2026":b?`${x.fps} fps \xB7 ${x.disegni??"\u2014"}d`:`<b>${x.fps}</b> fps \xB7 p50 ${x.p50} \xB7 p99 ${x.p99} ms \xB7 <b>${x.disegni??"\u2014"}</b> disegni \xB7 rt ${x.rtMs??"\u2014"} ms`},h=(t||[{contenitore:s,registri:i,etichetta:null,azioni:!0}]).map((b,x)=>new Fo({registri:b.registri.map(za),bus:f,vivi:m,titolo:a,contenitore:b.contenitore||s,scuro:l,etichetta:b.etichetta??null,azioni:b.azioni??x===0})),g=h[0];if(n)for(let b of h)b.apri(!0);return r&&r(()=>p.passo()),{registri:i,bus:f,campionatore:p,pannello:g,pannelli:h,vivi:m,vaiA:b=>{for(let x of h)x.registri.some(z=>z.chiave===b)&&x.vaiA(b)},passo:()=>p.passo()}}var An=Tt(()=>{gn();Ma();bn();xn()});var _n={};re(_n,{TETTO_VOCI:()=>Ls,creaScena:()=>Os,esa:()=>Mn,leggiMeta:()=>Tn,vociVicine:()=>zn});function zn(i,t,o=60){let e=i.map(a=>{let n=a.x-t.x,r=(a.y-t.y)*.5,s=a.z-t.z;return{...a,lontano:Math.sqrt(n*n+r*r+s*s)}});return e.sort((a,n)=>a.lontano-n.lontano),{voci:e.slice(0,o),altri:Math.max(0,e.length-o)}}function Mn(i){return"#"+(i>>>0&16777215).toString(16).padStart(6,"0")}function Os({entita:i,dove:t,coloreDi:o,nomeDi:e,rigaDi:a,onVaiA:n=null}){let r={scelto:null,aperti:new Set,filtro:""},s={},l=()=>{for(let f of Object.values(s))f&&f()};function c(){if(!document.getElementById("officina-scena-stile")){let f=document.createElement("style");f.id="officina-scena-stile",f.textContent=Ss,document.head.appendChild(f)}}return{gerarchia:{chiave:"gerarchia",nome:"\u{1F5C2} Gerarchia",disegna(f){c(),f.style.display="flex",f.style.flexDirection="column";let p=document.createElement("div");p.className="sc-barra";let m=document.createElement("input");m.type="text",m.placeholder="cerca un tipo\u2026",m.value=r.filtro;let h=document.createElement("span");h.className="valore",p.append(m,h);let g=document.createElement("div");g.className="sc-albero sc-alto",f.append(p,g),m.addEventListener("input",()=>{r.filtro=m.value.trim().toLowerCase(),v()});function v(){g.innerHTML="";let b=i.perTipo().filter(([z])=>!r.filtro||z.toLowerCase().includes(r.filtro)||(e(z)||"").toLowerCase().includes(r.filtro));if(h.textContent=`${i.conta} oggetti`,!b.length){let z=document.createElement("div");z.className="sc-vuoto",z.textContent="niente da mostrare",g.appendChild(z);return}let x=t();for(let[z,A]of b){let T=document.createElement("div");T.className="sc-gruppo";let I=document.createElement("button");I.type="button",I.className="sc-cap";let q=r.aperti.has(z),L=document.createElement("i");L.className="sc-pallino",L.style.background=o(z);let R=document.createElement("span");R.textContent=(q?"\u25BE ":"\u25B8 ")+(e(z)||z);let P=document.createElement("span");if(P.className="sc-quanti",P.textContent=A,I.append(L,R,P),I.addEventListener("click",()=>{q?r.aperti.delete(z):r.aperti.add(z),v()}),T.appendChild(I),q){let S=[];i.ognunaDi(z,(U,D,W,N)=>S.push({id:N,x:U,y:D,z:W}));let{voci:y,altri:_}=zn(S,x);for(let U of y){let D=document.createElement("button");D.type="button",D.className="sc-voce"+(U.id===r.scelto?" scelta":"");let W=i.leggi(U.id),N=document.createElement("span");N.textContent=W&&W.nome||`#${U.id}`;let Z=document.createElement("span");Z.className="sc-lont",Z.textContent=U.lontano.toFixed(0)+" m",D.append(N,Z),D.addEventListener("click",()=>{r.scelto=U.id,l()}),T.appendChild(D)}if(_){let U=document.createElement("div");U.className="sc-altri",U.textContent=`e altri ${_}, pi\xF9 lontani`,T.appendChild(U)}}g.appendChild(T)}}return s.gerarchia=v,v(),{aggiorna(){h.textContent=`${i.conta} oggetti`}}}},ispettore:{chiave:"ispettore",nome:"\u{1F50D} Ispettore",scriviDinamico(f,p){let m=f.indexOf("."),h=Number(f.slice(0,m)),g=f.slice(m+1);if(g==="nome"){i.battezza(h,p||null),l();return}if(g==="meta"){i.metadati(h,p);return}if(g==="tinta"){i.posa(h,{tinta:p});return}i.posa(h,{[g]:p})},disegna(f,p){c();let m=document.createElement("div");m.className="sc-isp sc-solo",f.appendChild(m);let h=(b,x,z,A)=>p.bus.esegui({registro:"ispettore",campo:`${b}.${x}`,prima:z,dopo:A});function g(b,x,z,A,T,I,q,L=R=>R.toFixed(2)){let R=document.createElement("div");R.className="sc-riga";let P=document.createElement("span");P.textContent=x;let S=document.createElement("input");S.type="range",S.min=z,S.max=A,S.step=T,S.value=I();let y=document.createElement("span");y.className="sc-num",y.textContent=L(I());let _;S.addEventListener("input",()=>{_===void 0&&(_=I());let U=Number(S.value);y.textContent=L(U),i.posa(r.scelto,{[q]:U})}),S.addEventListener("change",()=>{let U=_===void 0?I():_;_=void 0,h(r.scelto,q,U,Number(S.value))}),R.append(P,S,y),b.appendChild(R)}function v(){m.innerHTML="";let b=r.scelto==null?null:i.leggi(r.scelto);if(!b){let N=document.createElement("div");N.className="sc-vuoto",N.textContent="Nessun oggetto scelto. Cliccane uno nel gioco, o aprine un gruppo nella Gerarchia.",m.appendChild(N);return}let x=document.createElement("div");x.className="sc-titolo";let z=document.createElement("i");z.className="sc-pallino",z.style.background=o(b.tipo);let A=document.createElement("input");A.type="text",A.value=b.nome||"",A.placeholder=`#${b.id}`,A.style.flex="1",A.style.maxWidth="none",A.addEventListener("change",()=>h(b.id,"nome",b.nome||"",A.value)),x.append(z,A),m.appendChild(x);let T=a(b.tipo),I=document.createElement("div");I.className="sc-tipo",I.textContent=T?`${e(b.tipo)||b.tipo} \xB7 id ${b.id} \xB7 giro ${T.giro} \xB7 classe ${T.classe} \xB7 ingombro ${T.ingombro.join("\xD7")}${T.proiettaOmbra?" \xB7 fa ombra":""}`:`${b.tipo} \xB7 id ${b.id} \xB7 fuori catalogo`,m.appendChild(I);let q=document.createElement("div");q.className="sc-tre";for(let N of["x","y","z"]){let Z=document.createElement("label");Z.textContent=N;let mt=document.createElement("input");mt.type="number",mt.step="0.5",mt.value=b[N].toFixed(2),mt.addEventListener("change",()=>h(b.id,N,b[N],Number(mt.value))),Z.appendChild(mt),q.appendChild(Z)}m.appendChild(q),g(m,"giro",0,Math.PI*2,.01,()=>i.leggi(r.scelto).giro,"giro",N=>`${Math.round(N*180/Math.PI)}\xB0`),g(m,"scala",.1,4,.01,()=>i.leggi(r.scelto).scala,"scala");let L=document.createElement("div");L.className="sc-riga";let R=document.createElement("span");R.textContent="tinta";let P=document.createElement("input");P.type="color",P.value=Mn(Math.round(b.tinta[0]*255)<<16|Math.round(b.tinta[1]*255)<<8|Math.round(b.tinta[2]*255)),P.addEventListener("change",()=>{let N=parseInt(P.value.slice(1),16);h(b.id,"tinta",b.tinta,[(N>>16&255)/255,(N>>8&255)/255,(N&255)/255])}),L.append(R,P),m.appendChild(L);let S=document.createElement("div");S.className="sc-meta";let y=document.createElement("div");y.textContent="dati (chiave: valore, uno per riga)",y.style.opacity=".7";let _=document.createElement("textarea");_.value=Object.entries(b.dati||{}).map(([N,Z])=>`${N}: ${Z}`).join(`
`),_.addEventListener("change",()=>h(b.id,"meta",b.dati||{},Tn(_.value))),S.append(y,_),m.appendChild(S);let U=document.createElement("div");if(U.className="sc-azioni",n){let N=document.createElement("button");N.type="button",N.textContent="\u2316 vai qui",N.addEventListener("click",()=>n(i.leggi(r.scelto))),U.appendChild(N)}let D=document.createElement("button");D.type="button",D.textContent="\u29C9 duplica",D.addEventListener("click",()=>{let N=i.leggi(r.scelto);N&&(r.scelto=i.aggiungi(N.tipo,N.x+1,N.y,N.z,{giro:N.giro,scala:N.scala,tinta:N.tinta,nome:N.nome,dati:N.dati}),l())});let W=document.createElement("button");W.type="button",W.className="rosso",W.textContent="\u2715 elimina",W.addEventListener("click",()=>{i.togli(r.scelto),r.scelto=null,l()}),U.append(D,W),m.appendChild(U)}return s.ispettore=v,v(),{aggiorna(){}}}},scegli(f){r.scelto=f,l()},get scelto(){return r.scelto}}}function Tn(i){let t={};for(let o of String(i).split(`
`)){let e=o.indexOf(":");if(e<=0)continue;let a=o.slice(0,e).trim();a&&(t[a]=o.slice(e+1).trim())}return t}var Ss,Ls,Cn=Tt(()=>{Ss=`
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
`,Ls=60});var On={};re(On,{MANO_VUOTA:()=>_a,categorieDi:()=>Sn,filtra:()=>Ln,registroCreativa:()=>Ns,voci:()=>Rs});function Rs({categorie:i,blocchi:t,catalogo:o,nomeArredo:e=null}){let a=[_a],n=new Set;for(let r of i)for(let s of r.blocchi){let l=t[s];if(!l||n.has(s))continue;n.add(s);let c=o&&o[l.modello||s];a.push({id:s,nome:l.nome||s,categoria:r.id,categoriaNome:r.nome,cosa:l.forma==="modello",cima:l.cima??l.colore??10066329,lato:l.lato??l.colore??7829367,ombra:c?c.proiettaOmbra:void 0})}for(let[r,s]of Object.entries(t))n.has(r)||(n.add(r),a.push({id:r,nome:e&&e(r)||s.nome||r,categoria:s.forma==="modello"?"cose":"altro",categoriaNome:s.forma==="modello"?"Cose":"Altro",cosa:s.forma==="modello",cima:s.cima??s.colore??10066329,lato:s.lato??s.colore??7829367}));return a}function Sn(i){let t=[],o=new Set;for(let e of i)e.categoria==="mano"||o.has(e.categoria)||(o.add(e.categoria),t.push({id:e.categoria,nome:e.categoriaNome||e.categoria}));return t}function Ln(i,t,o){let e=String(o||"").trim().toLowerCase();return i.filter(a=>t&&a.categoria!==t&&a.categoria!=="mano"?!1:e?(a.nome||"").toLowerCase().includes(e)||String(a.id||"").toLowerCase().includes(e):!0)}function Ns({elenco:i,inMano:t,onPrendi:o}){let e=null,a="";return{chiave:"creativa",nome:"\u{1F392} Creativa",nota:"Tutto quello che si pu\xF2 avere in mano. Un clic e ce l'hai.",disegna(n){if(!document.getElementById("officina-creativa-stile")){let m=document.createElement("style");m.id="officina-creativa-stile",m.textContent=Is,document.head.appendChild(m)}let r=document.createElement("div");r.className="cr-schede";let s=document.createElement("input");s.type="text",s.className="cr-cerca",s.placeholder="cerca\u2026";let l=document.createElement("div");l.className="cr-quante";let c=document.createElement("div");c.className="cr-griglia",n.append(r,s,l,c);let d=[{id:null,nome:"Tutto"},...Sn(i)].map(m=>{let h=document.createElement("button");return h.type="button",h.textContent=m.nome,h.addEventListener("click",()=>{e=m.id,f(),p()}),r.appendChild(h),{b:h,id:m.id}});function f(){for(let m of d)m.b.classList.toggle("acceso",m.id===e)}s.addEventListener("input",()=>{a=s.value,p()});function p(){let m=Ln(i,e,a);if(l.textContent=`${m.length-(m[0]===_a?1:0)} cose`,c.innerHTML="",!m.length){let g=document.createElement("div");g.className="cr-vuoto",g.textContent="niente che si chiami cos\xEC",c.appendChild(g);return}let h=t();for(let g of m){let v=document.createElement("button");v.type="button",v.className="cr-cella"+(g.id===h?" scelta":""),v.title=g.id?`${g.nome} (${g.id})`:"mano vuota \u2014 rompi e interagisci";let b=document.createElement("i");if(b.className="cr-ico"+(g.id===null?" cr-vuota":g.cosa?" cr-cosa":""),g.id!==null){let z=document.createElement("b");z.className="cr-cima",z.style.background=yn(g.cima);let A=document.createElement("b");A.className="cr-lato",A.style.background=yn(g.lato),b.append(A,z)}let x=document.createElement("span");x.textContent=g.nome,v.append(b,x),v.addEventListener("pointerdown",z=>{z.preventDefault(),z.stopPropagation(),o(g.id),p()}),c.appendChild(v)}}return f(),p(),{aggiorna(){}}}}}var Is,_a,yn,In=Tt(()=>{Is=`
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
`,_a={id:null,nome:"Mano vuota",categoria:"mano",cosa:!1,cima:null,lato:null};yn=i=>"#"+(i>>>0&16777215).toString(16).padStart(6,"0")});var Rn={};re(Rn,{Ritmo:()=>ve,TastoOmega:()=>Ca});function ee(i){return String(i).replace(/[&<>"]/g,t=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"})[t])}var qs,Ca,Nn=Tt(()=>{Ea();qs=`
#omegaBtn {
  position: fixed; left: 8px; z-index: 30; height: 34px; padding: 0 11px 0 9px;
  border-radius: 17px; cursor: pointer; white-space: nowrap;
  border: 2px solid rgba(13,42,26,.22); background: rgba(255,255,255,.92);
  font: 600 12px/1 system-ui, sans-serif; color: #0d2a1a;
  display: flex; align-items: center; gap: 6px;
  box-shadow: 0 2px 8px rgba(13,42,26,.14);
  -webkit-tap-highlight-color: transparent; user-select: none;
  top: calc(46% + 84px);
}
#omegaBtn b { font: 15px/1 system-ui, sans-serif; }
#omegaBtn:hover { background: #fff; }
#omegaBtn.corso { background: #2a1a4d; color: #fff; border-color: #2a1a4d; }
.gui-tocco #omegaBtn { height: 42px; padding: 0 14px 0 11px; font-size: 13px; border-radius: 21px; top: 108px; }
.gui-tocco #omegaBtn b { font-size: 18px; }

#omegaPan { position: fixed; inset: auto 12px 12px 12px; z-index: 41;
  max-width: 560px; margin: 0 auto; padding: 12px 14px; border-radius: 12px;
  background: rgba(255,255,255,.97); border: 1px solid rgba(13,42,26,.18);
  font: 13px/1.5 system-ui, sans-serif; color: #0d2a1a; display: none;
  box-shadow: 0 6px 24px rgba(13,42,26,.18); max-height: 72vh; overflow: auto; }
#omegaPan.aperto { display: block; }
#omegaPan h4 { margin: 0 0 6px; font-size: 14px; }
#omegaPan p { margin: 0 0 8px; color: #3c5a4a; }
#omegaPan .righe { display: flex; gap: 8px; margin-top: 8px; }
#omegaPan button { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(13,42,26,.22); background: #fff; font: 13px system-ui, sans-serif; }
#omegaPan button.primo { background: #2a1a4d; color: #fff; border-color: #2a1a4d; }
#omegaPan pre { margin: 8px 0 0; font: 11px/1.45 ui-monospace, monospace; white-space: pre;
  overflow-x: auto; background: #f4f6f4; padding: 8px; border-radius: 6px; }
/* \u26A0 LA BARRA \xC8 UN NUMERO, NON UNA DECORAZIONE: il banco dura minuti e senza
   sapere quanto manca si crede che si sia piantato, e si ricarica la pagina
   proprio mentre stava misurando. */
#omegaPan .barra { height: 8px; border-radius: 4px; background: #e3e7e3; overflow: hidden; margin: 6px 0; }
#omegaPan .barra i { display: block; height: 100%; background: #2a1a4d; width: 0; transition: width .2s; }
#omegaPan .voce { font: 12px/1.5 ui-monospace, monospace; color: #3c5a4a; }
#omegaPan .verdetto { margin-top: 8px; padding: 8px; border-radius: 6px; background: #f2eef8; border: 1px solid #d8cdeb; }
`,Ca=class{constructor({inBanco:t=!1,vaiAlBanco:o=null,avvia:e=null,ferma:a=null,manda:n=null}={}){this.inBanco=t,this.vaiAlBanco=o,this._avvia=e,this._ferma=a,this.manda=n,this.banco=null;let r=document.createElement("style");r.textContent=qs,document.head.appendChild(r),this.nodo=document.createElement("div"),this.nodo.id="omegaBtn",this.nodo.innerHTML="<b>&#9889;</b> omega test",this.nodo.title="Il banco di tortura: migliaia di blocchi e arredi unici, luci colorate, framepacing",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pan=document.createElement("div"),this.pan.id="omegaPan",document.body.appendChild(this.pan)}apri(){this.pan.classList.add("aperto"),this.banco&&this.banco.inCorso?this._disegnaCorso():this.banco&&this.banco.fase==="finito"?this._disegnaEsito():this._disegnaInvito()}chiudi(){this.pan.classList.remove("aperto")}_disegnaInvito(){let t=this.inBanco;this.pan.innerHTML=`
      <h4>&#9889; Omega Test</h4>
      <p>Il banco di tortura: <b>duemila blocchi unici</b> (tavolozza e materia proprie),
      fino a <b>mille arredi unici</b> (una mesh diversa ognuno, cio\xE8 un disegno ognuno),
      <b>luci colorate fitte</b>, i corpi della fisica, e per ultima la
      <b>prova AR</b> \u2014 la scena disegnata due volte per fotogramma, che \xE8 il budget
      vero dell'AR.</p>
      <p>Sale a gradini e misura ognuno da solo: serve a sapere <b>dove si rompe</b>,
      non se regge tutto. Dura circa quattro minuti; non toccare niente mentre gira.</p>
      ${t?"":"<p><b>Serve il mondo dell'omega test</b>: la pagina si ricarica e il banco parte da solo.</p>"}
      <div class="righe">
        <button class="primo" id="omegaVai">${t?"Avvia il banco":"Vai al banco e avvia"}</button>
        <button id="omegaChiudi">Chiudi</button>
      </div>`,this.pan.querySelector("#omegaChiudi").onclick=()=>this.chiudi(),this.pan.querySelector("#omegaVai").onclick=()=>{if(!t){this.vaiAlBanco&&this.vaiAlBanco();return}this.banco=this._avvia&&this._avvia(),this.nodo.classList.add("corso"),this._disegnaCorso()}}_disegnaCorso(){let t=this.banco,o=t&&t.gradino;this.pan.innerHTML=`
      <h4>&#9889; Omega Test &mdash; in corso</h4>
      <div class="barra"><i style="width:${((t?t.avanzamento:0)*100).toFixed(1)}%"></i></div>
      <div class="voce" id="omegaVoce">${o?`${ee(o.nome)} &middot; ${t.fase==="riscaldo"?"riscaldo":"misura"}`:""}</div>
      <p class="voce">${o?ee(o.spiega):""}</p>
      <pre id="omegaFin">${ee((t?t.righe():[]).join(`
`))||"(ancora niente)"}</pre>
      <div class="righe">
        <button id="omegaStop">Ferma</button>
        <button id="omegaChiudi">Nascondi</button>
      </div>`,this.pan.querySelector("#omegaChiudi").onclick=()=>this.chiudi(),this.pan.querySelector("#omegaStop").onclick=()=>{this._ferma&&this._ferma(),this.nodo.classList.remove("corso"),this._disegnaInvito()}}aggiorna(){let t=this.banco;if(!t||!this.pan.classList.contains("aperto"))return;if(t.fase==="finito"){this._giaFinito||(this._giaFinito=!0,this.nodo.classList.remove("corso"),this._disegnaEsito());return}if(!t.inCorso)return;let o=this.pan.querySelector(".barra i");o&&(o.style.width=`${(t.avanzamento*100).toFixed(1)}%`);let e=this.pan.querySelector("#omegaVoce"),a=t.gradino;e&&a&&(e.innerHTML=`${ee(a.nome)} &middot; ${t.fase==="riscaldo"?"riscaldo":"misura"}`);let n=this.pan.querySelector("#omegaFin");n&&this._nEsiti!==t.esiti.length&&(this._nEsiti=t.esiti.length,n.textContent=t.righe().join(`
`)||"(ancora niente)")}testo(){let t=this.banco;if(!t||!t.esiti.length)return"";let o=t.verdetto(),e=["OMEGA TEST",...t.righe(),""];return o&&(e.push(`ultimo gradino buono: ${o.ultimoBuono||"nessuno"}`),e.push(`si rompe a:           ${o.primoRotto||"mai"}`),o.prezzoCarico&&e.push(`il carico pieno costa ${o.soloPavimento?"almeno ":""}${o.prezzoCarico.toFixed(2)}x il mondo nudo`),o.prezzoAr&&e.push(`la doppia resa (AR) costa ${o.prezzoAr.toFixed(2)}x`),e.push(`il collo di bottiglia e': ${o.collo==="ritmo"?"IL RITMO (singhiozzi), non i fotogrammi":"I FOTOGRAMMI (si disegna troppo)"}`),o.agganciato&&e.push("\u26A0 a riposo il ritmo e' AGGANCIATO ALLO SCHERMO: il p50 del riposo e' il pannello e non il motore, quindi i rapporti qui sopra sono PAVIMENTI")),e.join(`
`)}_disegnaEsito(){let t=this.banco,o=t.verdetto();this.pan.innerHTML=`
      <h4>&#9889; Omega Test &mdash; finito</h4>
      <pre>${ee(t.righe().join(`
`))}</pre>
      ${o?`<div class="verdetto">
        <div><b>Ultimo gradino buono:</b> ${ee(o.ultimoBuono||"nessuno")}</div>
        <div><b>Si rompe a:</b> ${ee(o.primoRotto||"mai")}</div>
        ${o.prezzoCarico?`<div><b>Il carico pieno costa</b> ${o.soloPavimento?"almeno ":""}${o.prezzoCarico.toFixed(2)}&times; il mondo nudo</div>`:""}
        ${o.prezzoAr?`<div><b>La doppia resa (AR) costa</b> ${o.prezzoAr.toFixed(2)}&times;</div>`:""}
        <div><b>Collo di bottiglia:</b> ${o.collo==="ritmo"?"il RITMO (singhiozzi), non i fotogrammi":"i FOTOGRAMMI (si disegna troppo)"}</div>
        ${o.agganciato?"<div>&#9888; a riposo il ritmo &egrave; agganciato allo schermo: quel p50 &egrave; il pannello, non il motore</div>":""}
      </div>`:""}
      <div class="righe">
        ${this.manda?'<button class="primo" id="omegaManda">Manda col &#129658;</button>':""}
        <button id="omegaCopia">Copia</button>
        <button id="omegaChiudi">Chiudi</button>
      </div>`,this.pan.querySelector("#omegaChiudi").onclick=()=>this.chiudi(),this.pan.querySelector("#omegaCopia").onclick=()=>{navigator.clipboard?.writeText(this.testo())};let e=this.pan.querySelector("#omegaManda");e&&(e.onclick=()=>this.manda(this.testo()))}}});function Ha(i,{antialias:t=!0,dprMax:o=1.5}={}){let e=i.getContext("webgl2",{antialias:t,alpha:!1,depth:!0,stencil:!1,preserveDrawingBuffer:!1,powerPreference:"high-performance",desynchronized:!1});if(!e)throw new Error("WebGL2 non disponibile");let a=Math.min(o,devicePixelRatio||1),n=()=>{let r=Math.max(1,Math.round(i.clientWidth*a)),s=Math.max(1,Math.round(i.clientHeight*a));return i.width!==r||i.height!==s?(i.width=r,i.height=s,e.viewport(0,0,r,s),!0):!1};return n(),{gl:e,dpr:a,ridimensiona:n}}function ut(i,t,o){let e=(n,r)=>{let s=i.createShader(n);if(i.shaderSource(s,r),i.compileShader(s),!i.getShaderParameter(s,i.COMPILE_STATUS))throw new Error(`shader: ${i.getShaderInfoLog(s)}
${r.split(`
`).map((l,c)=>`${c+1}: ${l}`).join(`
`)}`);return s},a=i.createProgram();if(i.attachShader(a,e(i.VERTEX_SHADER,t)),i.attachShader(a,e(i.FRAGMENT_SHADER,o)),i.linkProgram(a),!i.getProgramParameter(a,i.LINK_STATUS))throw new Error(`programma: ${i.getProgramInfoLog(a)}`);return a}function Wo(i){let t=i.getExtension("WEBGL_debug_renderer_info");return t?i.getParameter(t.UNMASKED_RENDERER_WEBGL):i.getParameter(i.RENDERER)}function ft(i,t,o){return(Math.sign(i)+1)*9+(Math.sign(t)+1)*3+(Math.sign(o)+1)}var mc=ft(1,0,0),hc=ft(-1,0,0),gc=ft(0,1,0),vc=ft(0,-1,0),bc=ft(0,0,1),xc=ft(0,0,-1);var Se=class{constructor(t=1024){this.byte=new Uint8Array(t*4*12),this.u32=new Uint32Array(this.byte.buffer),this.n=0,this.quad=0}_spazio(t){let o=(this.n+t)*12;if(o<=this.byte.length)return;let e=this.byte.length*2;for(;e<o;)e*=2;let a=new Uint8Array(e);a.set(this.byte),this.byte=a,this.u32=new Uint32Array(a.buffer)}vertice(t,o,e,a,n,r,s,l=0,c=0){let u=Math.round(t*16)+16,d=Math.round(e*16)+16,f=Math.round(o*16);if(u<0||u>511||d<0||d>511||f<0||f>65535)throw new RangeError(`vertice fuori dal chunk: ${t},${o},${e}`);if(a<0||a>26||a===13)throw new RangeError(`normale non valida: ${a}`);this._spazio(1);let p=this.n*3,m=this.byte,h=this.u32;h[p]=(u|d<<9|(a&31)<<18|(l&1)<<23|(c&15)<<24)>>>0,h[p+1]=(f|(n&15)<<16|(r&15)<<20)>>>0;let g=this.n*12+8;m[g]=s>>16&255,m[g+1]=s>>8&255,m[g+2]=s&255,m[g+3]=0,this.n++}quadDa(t,o,e,a){if(this.quad>=16384)throw new RangeError("troppi quad per un chunk");for(let n of[t,o,e,a])this.vertice(...n);this.quad++}dati(){return{byte:this.byte.subarray(0,this.n*12),quad:this.quad,vertici:this.n,triangoli:this.quad*2}}};function Ya(i=16384){let t=new Uint16Array(i*6);for(let o=0,e=0,a=0;o<i;o++,a+=4)t[e++]=a,t[e++]=a+1,t[e++]=a+2,t[e++]=a,t[e++]=a+2,t[e++]=a+3;return t}function Za(i,t,o,e){let a=1/Math.tan(i/2),n=1/(o-e);return new Float32Array([a/t,0,0,0,0,a,0,0,0,0,(e+o)*n,-1,0,0,2*e*o*n,0])}function Qo(i,t,o){let e=1/(o-t);return new Float32Array([1/i,0,0,0,0,1/i,0,0,0,0,-2*e,0,0,0,-(o+t)*e,1])}function to(i,t,o=[0,1,0]){let e=i[0]-t[0],a=i[1]-t[1],n=i[2]-t[2],r=Math.hypot(e,a,n)||1;e/=r,a/=r,n/=r;let s=o[1]*n-o[2]*a,l=o[2]*e-o[0]*n,c=o[0]*a-o[1]*e;r=Math.hypot(s,l,c)||1,s/=r,l/=r,c/=r;let u=a*c-n*l,d=n*s-e*c,f=e*l-a*s;return new Float32Array([s,u,e,0,l,d,a,0,c,f,n,0,-(s*i[0]+l*i[1]+c*i[2]),-(u*i[0]+d*i[1]+f*i[2]),-(e*i[0]+a*i[1]+n*i[2]),1])}function ja(i,t=new Float32Array(16)){let[o,e,a,n,r,s,l,c,u,d,f,p,m,h,g,v]=i,b=o*s-e*r,x=o*l-a*r,z=o*c-n*r,A=e*l-a*s,T=e*c-n*s,I=a*c-n*l,q=u*h-d*m,L=u*g-f*m,R=u*v-p*m,P=d*g-f*h,S=d*v-p*h,y=f*v-p*g,_=b*y-x*S+z*P+A*R-T*L+I*q;return _?(_=1/_,t[0]=(s*y-l*S+c*P)*_,t[1]=(a*S-e*y-n*P)*_,t[2]=(h*I-g*T+v*A)*_,t[3]=(f*T-d*I-p*A)*_,t[4]=(l*R-r*y-c*L)*_,t[5]=(o*y-a*R+n*L)*_,t[6]=(g*z-m*I-v*x)*_,t[7]=(u*I-f*z+p*x)*_,t[8]=(r*S-s*R+c*q)*_,t[9]=(e*R-o*S-n*q)*_,t[10]=(m*T-h*z+v*b)*_,t[11]=(d*z-u*T-p*b)*_,t[12]=(s*L-r*P-l*q)*_,t[13]=(o*P-e*L+a*q)*_,t[14]=(h*x-m*A-g*b)*_,t[15]=(u*A-d*x+f*b)*_,t):null}function Le(i,t,o=new Float32Array(16)){for(let e=0;e<4;e++)for(let a=0;a<4;a++)o[e*4+a]=i[a]*t[e*4]+i[4+a]*t[e*4+1]+i[8+a]*t[e*4+2]+i[12+a]*t[e*4+3];return o}function Jo(i,t=new Float32Array(24)){let o=l=>[i[l],i[4+l],i[8+l],i[12+l]],e=o(0),a=o(1),n=o(2),r=o(3),s=[[r[0]+e[0],r[1]+e[1],r[2]+e[2],r[3]+e[3]],[r[0]-e[0],r[1]-e[1],r[2]-e[2],r[3]-e[3]],[r[0]+a[0],r[1]+a[1],r[2]+a[2],r[3]+a[3]],[r[0]-a[0],r[1]-a[1],r[2]-a[2],r[3]-a[3]],[r[0]+n[0],r[1]+n[1],r[2]+n[2],r[3]+n[3]],[r[0]-n[0],r[1]-n[1],r[2]-n[2],r[3]-n[3]]];for(let l=0;l<6;l++){let[c,u,d,f]=s[l],p=Math.hypot(c,u,d)||1;t[l*4]=c/p,t[l*4+1]=u/p,t[l*4+2]=d/p,t[l*4+3]=f/p}return t}function ta(i,t,o,e,a,n,r){for(let s=0;s<6;s++){let l=i[s*4],c=i[s*4+1],u=i[s*4+2],d=i[s*4+3],f=l>0?a:t,p=c>0?n:o,m=u>0?r:e;if(l*f+c*p+u*m+d<0)return!1}return!0}var ea=2,ar=`#version 300 es
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
}`,Ka=`#version 300 es
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
}`,ir=`#version 300 es
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
}`,nr=`#version 300 es
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
}`,rr=`#version 300 es
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
}`,sr=`#version 300 es
out vec2 vNdc;
void main() { vNdc = vec2((gl_VertexID == 1) ? 3.0 : -1.0, (gl_VertexID == 2) ? 3.0 : -1.0); gl_Position = vec4(vNdc, 0.999999, 1.0); }`,cr=`#version 300 es
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
}`,lr=`#version 300 es
layout(location = 0) in uvec2 aAB;
uniform mat4 uVP;
uniform vec3 uChunk;
void main() {
  uint A = aAB.x, B = aAB.y;
  vec3 p = uChunk + vec3(float(A & 511u) - 16.0, float(B & 65535u), float((A >> 9u) & 511u) - 16.0) / 16.0;
  gl_Position = uVP * vec4(p, 1.0);
}`,ur=`#version 300 es
precision mediump float;
void main() {}`,oo=class{constructor(t){this.gl=t,this.programma=ut(t,ar,Ka),this.u={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[o]=t.getUniformLocation(this.programma,o);this.ebo=t.createBuffer(),t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.ebo),t.bufferData(t.ELEMENT_ARRAY_BUFFER,Ya(16384),t.STATIC_DRAW),this.programmaErba=ut(t,rr,Ka.replace(/flat in /g,"in ")),this.ue={};for(let o of["uVP","uChunk","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbia","uCam","uVento","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uErbaFinoA","uBuco","uOcchio","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.ue[o]=t.getUniformLocation(this.programmaErba,o);this.programmaOmbra=ut(t,lr,ur),this.uo={uVP:t.getUniformLocation(this.programmaOmbra,"uVP"),uChunk:t.getUniformLocation(this.programmaOmbra,"uChunk")},this.programmaAcqua=ut(t,ir,nr),this.ua={};for(let o of["uVP","uChunk","uTempo","uCam","uNebbia","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uNebbiaCol","uSpecchio","uSchermo","uMare","uGalleggianti","uNGalleggianti","uAltezze","uAltRett"])this.ua[o]=t.getUniformLocation(this.programmaAcqua,o);this.programmaCielo=ut(t,sr,cr),this.uc={};for(let o of["uInvVP","uOcchio","uSoleVerso","uSoleForza","uNebbiaCol","uZenit"])this.uc[o]=t.getUniformLocation(this.programmaCielo,o);this.vaoVuoto=t.createVertexArray(),this._invVP=new Float32Array(16),this.mare=.25,this.chunks=new Map,this.altezze=null,this.campionatoreLiscio=t.createSampler(),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_MIN_FILTER,t.LINEAR),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_MAG_FILTER,t.LINEAR),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.samplerParameteri(this.campionatoreLiscio,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),this.statistiche={disegni:0,triangoli:0,chunkVisti:0,chunkTotali:0,disegniAcqua:0,triangoliAcqua:0,disegniErba:0,triangoliErba:0,disegniSpecchio:0,triangoliSpecchio:0,pelo:null},this._visibili=[],this._visibiliErba=[],this._camera=null,this.specchio={attivo:!0,scala:.5,fbo:null,tex:null,rbo:null,w:0,h:0,pelo:null,mostra:!1},this.vpSpecchio=new Float32Array(16),this.pianiSpecchio=new Float32Array(24),this._riflessione=new Float32Array(16),this._voti=new Map,this.vpCorrente=null,this.finestra=null,this._tegolaVuota=new Uint8Array(1024),this.taglio=-1e9,this.buco=[0,0,0,0],this.ombre={tex:null,fbo:null,w:0,h:0,colonne:0,sporco:null,sole:[0,0,0],scala:1,offset:0,mezzoFloat:!1,calcoli:0},this._ombreMezzo=!!t.getExtension("EXT_color_buffer_half_float")&&!!t.getExtension("OES_texture_half_float_linear"),this.statistiche.calcoliOmbre=0,this.mappa={attiva:!0,lato:2048,latoDin:1024,raggio:32,raggioDin:14,stat:null,din:null,vp:new Float32Array(16),vpDin:new Float32Array(16),centro:[1e9,0,1e9],sole:[0,0,0],sporca:!0,on:!1,calcoli:0,disegni:0,triangoli:0},this.lampade=new Float32Array(32),this.nLampade=0,this.lampadeCol=new Float32Array(32),this.galleggianti=new Float32Array(32),this.nGalleggianti=0,this.stile={tinta:.15,saturazione:1.12,valore:.82},this._preparaMappa(),this.statistiche.calcoliMappa=0,this.statistiche.disegniOmbra=0,this.statistiche.triangoliOmbra=0,t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.cullFace(t.BACK),t.clearColor(.62,.81,.91,1),this.vp=new Float32Array(16),this.piani=new Float32Array(24),this.tempo=0,this.impostaMaterie([[0,0,0,0],[1,0,0,0]]),this.ombra=!0,this.tutto=!1,this.erbaFinoA=96,this.sole={verso:[-.5,-.7,-.3],colore:[1,.96,.86],forza:1,cielo:[.6,.68,.82]},this.nebbia={da:90,a:150,colore:[.72,.85,.92]}}_sporcaMappa(t,o){let e=this.mappa;Math.hypot(t+8-e.centro[0],o+8-e.centro[2])<=e.raggio+12&&(e.sporca=!0)}carica(t,o){let e=this.gl;this._sporcaMappa(o.cx*16,o.cz*16);let a=this.chunks.get(t);a||(a={vao:e.createVertexArray(),vbo:e.createBuffer(),quad:0},e.bindVertexArray(a.vao),e.bindBuffer(e.ARRAY_BUFFER,a.vbo),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null),this.chunks.set(t,a)),e.bindBuffer(e.ARRAY_BUFFER,a.vbo),e.bufferData(e.ARRAY_BUFFER,o.byte,e.STATIC_DRAW),a.quad=o.quad;let n=o.erba;a.verticiErba=n?n.vertici:0,a.lamelle=n?n.fili:0,a.yBaseErba=n?n.yBase:0,a.verticiErba>0&&(a.vaoErba||(a.vaoErba=e.createVertexArray(),a.vboErba=e.createBuffer(),e.bindVertexArray(a.vaoErba),e.bindBuffer(e.ARRAY_BUFFER,a.vboErba),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,4,e.UNSIGNED_BYTE,12,0),e.vertexAttribDivisor(0,1),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,4),e.vertexAttribDivisor(1,1),e.enableVertexAttribArray(2),e.vertexAttribIPointer(2,4,e.UNSIGNED_BYTE,12,8),e.vertexAttribDivisor(2,1),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,a.vboErba),e.bufferData(e.ARRAY_BUFFER,n.byte,e.STATIC_DRAW));let r=o.acqua;if(a.quadAcqua=r?r.quad:0,a.peloAcqua=r&&r.pelo!=null?r.pelo:null,a.quadAcqua>0&&(a.vaoAcqua||(a.vaoAcqua=e.createVertexArray(),a.vboAcqua=e.createBuffer(),e.bindVertexArray(a.vaoAcqua),e.bindBuffer(e.ARRAY_BUFFER,a.vboAcqua),e.enableVertexAttribArray(0),e.vertexAttribIPointer(0,2,e.UNSIGNED_INT,12,0),e.enableVertexAttribArray(1),e.vertexAttribIPointer(1,4,e.UNSIGNED_BYTE,12,8),e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,this.ebo),e.bindVertexArray(null)),e.bindBuffer(e.ARRAY_BUFFER,a.vboAcqua),e.bufferData(e.ARRAY_BUFFER,r.byte,e.STATIC_DRAW)),a.luci=o.luci||[],a.x0=o.cx*16,a.z0=o.cz*16,a.minY=o.minY,a.maxY=o.maxY,a.y0=o.y0||0,a.chunk=[a.x0,a.y0,a.z0],o.altezze){a.tegola||(a.tegola=new Uint8Array(1024));let s=o.solide||o.altezze,l=o.impronte;for(let c=0;c<16;c++)for(let u=0;u<16;u++){let d=(u*16+c)*4,f=c*16+u,p=o.altezze[f],m=s[f],h=l?l[f]:-1;a.tegola[d]=p<0?0:Math.max(0,Math.min(255,p+1)),a.tegola[d+1]=m<0?0:Math.max(0,Math.min(255,m+1)),a.tegola[d+2]=h<0?0:Math.max(0,Math.min(255,h+1)),a.tegola[d+3]=255}this.finestra&&this._scriviTegola(a)}}apriFinestraAltezze(t,o,e=512){let a=this.gl;this.altezze||(this.altezze=a.createTexture()),this.finestra={lato:e,x0:0,z0:0,vuota:new Uint8Array(e*e*4),spostamenti:0},a.bindTexture(a.TEXTURE_2D,this.altezze),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MIN_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_MAG_FILTER,a.NEAREST),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_S,a.CLAMP_TO_EDGE),a.texParameteri(a.TEXTURE_2D,a.TEXTURE_WRAP_T,a.CLAMP_TO_EDGE),this._centraFinestra(t,o,!0)}seguiAltezze(t,o){this.finestra&&this._centraFinestra(t,o,!1)}_centraFinestra(t,o,e){let a=this.gl,n=this.finestra,r=n.lato/2;if(!e&&Math.abs(t-(n.x0+r))<n.lato/4&&Math.abs(o-(n.z0+r))<n.lato/4)return!1;n.x0=Math.floor((t-r)/16)*16,n.z0=Math.floor((o-r)/16)*16,this.altRett=[n.x0,n.z0,1/n.lato,1/n.lato],this.ombre.colonne!==n.lato?this._preparaOmbre(n.lato,n.lato):this.ombre.sporco=[0,0,this.ombre.w,this.ombre.h],a.bindTexture(a.TEXTURE_2D,this.altezze),a.pixelStorei(a.UNPACK_ALIGNMENT,1),a.texImage2D(a.TEXTURE_2D,0,a.RGBA8,n.lato,n.lato,0,a.RGBA,a.UNSIGNED_BYTE,n.vuota);for(let s of this.chunks.values())s.tegola&&this._scriviTegola(s);return n.spostamenti++,!0}_scriviTegola(t,o=!1){let e=this.gl,a=this.finestra,n=t.x0-a.x0,r=t.z0-a.z0;n<0||r<0||n+16>a.lato||r+16>a.lato||(e.bindTexture(e.TEXTURE_2D,this.altezze),e.pixelStorei(e.UNPACK_ALIGNMENT,1),e.texSubImage2D(e.TEXTURE_2D,0,n,r,16,16,e.RGBA,e.UNSIGNED_BYTE,o?this._tegolaVuota:t.tegola),this._sporcaOmbre(n,r,16,16))}evidenzia(t,o,e,a=0){let n=this.gl;this.programmaSpigoli||(this.programmaSpigoli=ut(n,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;   // x y z, gonfiore
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[24] = int[24](0,1, 1,2, 2,3, 3,0, 4,5, 5,6, 6,7, 7,4, 0,4, 1,5, 2,6, 3,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec3 uColore; out vec4 colore; void main() { colore = vec4(uColore, 1.0); }`),this.uSpigoli={uVP:n.getUniformLocation(this.programmaSpigoli,"uVP"),uCella:n.getUniformLocation(this.programmaSpigoli,"uCella"),uColore:n.getUniformLocation(this.programmaSpigoli,"uColore")},this.vaoSpigoli=n.createVertexArray());let r=this.uSpigoli;n.useProgram(this.programmaSpigoli),n.uniformMatrix4fv(r.uVP,!1,this.vp),n.bindVertexArray(this.vaoSpigoli),n.uniform4f(r.uCella,t,o,e,.11),n.uniform3f(r.uColore,.05,.16,.1),n.drawArrays(n.LINES,0,24),n.uniform4f(r.uCella,t,o,e,.1),n.uniform3f(r.uColore,1,1-.45*a,1-.8*a),n.drawArrays(n.LINES,0,24),n.bindVertexArray(null)}scatola(t,o,e,a,n,r,s=.3,l=.1){let c=this.gl;this.programmaPieno||(this.programmaPieno=ut(c,`#version 300 es
uniform mat4 uVP; uniform vec4 uCella;
const vec3 V[8] = vec3[8](vec3(0,0,0), vec3(1,0,0), vec3(1,0,1), vec3(0,0,1), vec3(0,1,0), vec3(1,1,0), vec3(1,1,1), vec3(0,1,1));
const int I[36] = int[36](0,2,1, 0,3,2, 4,5,6, 4,6,7, 0,1,5, 0,5,4, 1,2,6, 1,6,5, 2,3,7, 2,7,6, 3,0,4, 3,4,7);
void main() { vec3 v = V[I[gl_VertexID]]; v = v * (1.0 + 2.0 * uCella.w) - uCella.w; gl_Position = uVP * vec4(uCella.xyz + v, 1.0); }`,`#version 300 es
precision mediump float; uniform vec4 uColore; out vec4 colore; void main() { colore = uColore; }`),this.uPieno={uVP:c.getUniformLocation(this.programmaPieno,"uVP"),uCella:c.getUniformLocation(this.programmaPieno,"uCella"),uColore:c.getUniformLocation(this.programmaPieno,"uColore")},this.vaoPieno=c.createVertexArray());let u=this.uPieno;c.useProgram(this.programmaPieno),c.uniformMatrix4fv(u.uVP,!1,this.vp),c.uniform4f(u.uCella,t,o,e,l),c.uniform4f(u.uColore,a*s,n*s,r*s,s),c.bindVertexArray(this.vaoPieno),c.enable(c.BLEND),c.blendFunc(c.ONE,c.ONE_MINUS_SRC_ALPHA),c.depthMask(!1),c.disable(c.CULL_FACE),c.drawArrays(c.TRIANGLES,0,36),c.enable(c.CULL_FACE),c.depthMask(!0),c.disable(c.BLEND),c.bindVertexArray(null)}rimuovi(t){let o=this.chunks.get(t);o&&(this._sporcaMappa(o.x0,o.z0),this.finestra&&o.tegola&&this._scriviTegola(o,!0),this.gl.deleteVertexArray(o.vao),this.gl.deleteBuffer(o.vbo),o.vaoAcqua&&(this.gl.deleteVertexArray(o.vaoAcqua),this.gl.deleteBuffer(o.vboAcqua)),o.vaoErba&&(this.gl.deleteVertexArray(o.vaoErba),this.gl.deleteBuffer(o.vboErba)),this.chunks.delete(t))}_sporcaOmbre(t,o,e,a){let r=[Math.max(0,t-26),Math.max(0,o-26),Math.min(this.ombre.w||1e9,t+e+26),Math.min(this.ombre.h||1e9,o+a+26)],s=this.ombre.sporco;this.ombre.sporco=s?[Math.min(s[0],r[0]),Math.min(s[1],r[1]),Math.max(s[2],r[2]),Math.max(s[3],r[3])]:r}_preparaOmbre(t,o){let e=this.gl,a=this.ombre;a.colonne=t;let n=t*ea,r=o*ea;if(a.tex||(a.tex=e.createTexture(),a.fbo=e.createFramebuffer()),e.bindTexture(e.TEXTURE_2D,a.tex),a.mezzoFloat=this._ombreMezzo,a.mezzoFloat?(e.texImage2D(e.TEXTURE_2D,0,e.R16F,n,r,0,e.RED,e.HALF_FLOAT,null),a.scala=1,a.offset=0):(e.texImage2D(e.TEXTURE_2D,0,e.R8,n,r,0,e.RED,e.UNSIGNED_BYTE,null),a.scala=64,a.offset=-8),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindFramebuffer(e.FRAMEBUFFER,a.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a.tex,0),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&a.mezzoFloat)return this._ombreMezzo=!1,e.bindFramebuffer(e.FRAMEBUFFER,null),this._preparaOmbre(t,o);if(e.bindFramebuffer(e.FRAMEBUFFER,null),a.w=n,a.h=r,a.sporco=[0,0,n,r],!this.programmaOmbre){this.programmaOmbre=ut(e,`#version 300 es
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
}`),this.uOmbre={};for(let s of["uAltezze","uAltRett","uSole","uCodifica","uSuper"])this.uOmbre[s]=e.getUniformLocation(this.programmaOmbre,s);this.vaoOmbre=e.createVertexArray()}}_calcolaOmbre(){let t=this.gl,o=this.ombre,e=this.sole;if(!this.altezze||!o.tex||(e.verso[0]*o.sole[0]+e.verso[1]*o.sole[1]+e.verso[2]*o.sole[2]<.99996&&(o.sole=e.verso.slice(),o.sporco=[0,0,o.w,o.h]),!o.sporco))return;let n=96,[r,s,l,c]=o.sporco;if(l<=r||c<=s){o.sporco=null;return}let u=Math.min(c,s+n);o.sporco=u>=c?null:[r,u,l,c];let d=Math.hypot(e.verso[0],e.verso[2])||1e-4,f=[-e.verso[0]/d,-e.verso[2]/d],p=Math.max(.05,-e.verso[1]/d);t.bindFramebuffer(t.FRAMEBUFFER,o.fbo),t.viewport(0,0,o.w,o.h),t.enable(t.SCISSOR_TEST),t.scissor(r,s,l-r,u-s),t.disable(t.DEPTH_TEST),t.disable(t.CULL_FACE),t.useProgram(this.programmaOmbre),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(this.uOmbre.uAltezze,0),t.bindSampler(0,this.campionatoreLiscio),t.uniform4f(this.uOmbre.uAltRett,0,0,1/o.w,1/o.h),t.uniform3f(this.uOmbre.uSole,f[0],f[1],p),t.uniform2f(this.uOmbre.uCodifica,o.scala,o.offset),t.uniform1f(this.uOmbre.uSuper,ea),t.bindVertexArray(this.vaoOmbre),t.drawArrays(t.TRIANGLES,0,3),t.bindVertexArray(null),t.bindSampler(0,null),t.disable(t.SCISSOR_TEST),t.enable(t.DEPTH_TEST),t.enable(t.CULL_FACE),t.bindFramebuffer(t.FRAMEBUFFER,null),t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),o.calcoli++,this.statistiche.calcoliOmbre=o.calcoli}_disegnaCielo(t,o){let e=this.gl,a=this.uc,n=this.sole;if(this.cieloNero||!ja(t,this._invVP))return;e.useProgram(this.programmaCielo),e.uniformMatrix4fv(a.uInvVP,!1,this._invVP),e.uniform3f(a.uOcchio,o[0],o[1],o[2]),e.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform1f(a.uSoleForza,n.forza),e.uniform3f(a.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.forza;e.uniform3f(a.uZenit,.04+.32*r,.06+.56*r,.14+.82*r),e.disable(e.DEPTH_TEST),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vaoVuoto),e.drawArrays(e.TRIANGLES,0,3),e.bindVertexArray(null),e.enable(e.CULL_FACE),e.depthMask(!0),e.enable(e.DEPTH_TEST)}_preparaMappa(){let t=this.gl,o=this.mappa,e=a=>{let n=t.createTexture();t.bindTexture(t.TEXTURE_2D,n),t.texImage2D(t.TEXTURE_2D,0,t.DEPTH_COMPONENT24,a,a,0,t.DEPTH_COMPONENT,t.UNSIGNED_INT,null),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,t.LINEAR),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_MODE,t.COMPARE_REF_TO_TEXTURE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_COMPARE_FUNC,t.LEQUAL);let r=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,r),t.framebufferTexture2D(t.FRAMEBUFFER,t.DEPTH_ATTACHMENT,t.TEXTURE_2D,n,0),t.drawBuffers([t.NONE]),t.readBuffer(t.NONE);let s=t.checkFramebufferStatus(t.FRAMEBUFFER)===t.FRAMEBUFFER_COMPLETE;return t.bindFramebuffer(t.FRAMEBUFFER,null),{tex:n,fbo:r,lato:a,ok:s}};o.stat=e(o.lato),o.din=e(o.latoDin),(!o.stat.ok||!o.din.ok)&&(o.attiva=!1)}legaMappa(t){let o=this.gl,e=this.mappa;o.activeTexture(o.TEXTURE1),o.bindTexture(o.TEXTURE_2D,e.stat.tex),o.uniform1i(t.uMappaStat,1),o.activeTexture(o.TEXTURE2),o.bindTexture(o.TEXTURE_2D,e.din.tex),o.uniform1i(t.uMappaDin,2),o.activeTexture(o.TEXTURE0),o.uniform1f(t.uMappaOn,e.on?1:0),o.uniformMatrix4fv(t.uLuceVP,!1,e.vp),o.uniformMatrix4fv(t.uLuceVPDin,!1,e.vpDin),o.uniform2f(t.uMappaTexel,.5/e.lato,.5/e.latoDin),o.uniform2f(t.uMappaSbieco,1.5*(2*e.raggio/e.lato),.1/220),o.uniform4fv(t.uLampade,this.lampade),o.uniform1i(t.uNLampade,this.nLampade),o.uniform4fv(t.uLampCol,this.lampadeCol),o.uniform3f(t.uStile,this.stile.tinta,this.stile.saturazione,this.stile.valore),this.altezze&&(o.activeTexture(o.TEXTURE3),o.bindTexture(o.TEXTURE_2D,this.altezze),o.uniform1i(t.uAltezze,3),o.activeTexture(o.TEXTURE0))}_aggiornaMappa(t,o){let e=this.gl,a=this.mappa,n=this.sole,r=this.statistiche;if(a.on=!1,!a.attiva||!this.ombra)return;let s=typeof performance<"u"?performance.now():0,l=t.centro[0],c=t.centro[2],u=!1;Math.hypot(l-a.centro[0],c-a.centro[2])>10&&(a.centro=[Math.round(l/2)*2,Math.round(t.centro[1]),Math.round(c/2)*2],u=!0);{let g=n.verso,v=t.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Le(Qo(a.raggioDin,10,230),to(b,v,x),a.vpDin)}n.verso[0]*a.sole[0]+n.verso[1]*a.sole[1]+n.verso[2]*a.sole[2]<.99985&&(a.soleMosso=!0);let f=a.sporca||a.soleMosso||o&&o.mappaSporca,p=u||f&&s-(a.ultimo||0)>=500;if(p){a.sole=n.verso.slice(),a.soleMosso=!1,a.ultimo=s;let g=n.verso,v=a.centro,b=[v[0]-g[0]*120,v[1]-g[1]*120,v[2]-g[2]*120],x=Math.abs(g[1])>.95?[0,0,1]:[0,1,0];Le(Qo(a.raggio,10,230),to(b,v,x),a.vp)}if(e.enable(e.POLYGON_OFFSET_FILL),e.polygonOffset(1.5,4),p){e.bindFramebuffer(e.FRAMEBUFFER,a.stat.fbo),e.viewport(0,0,a.stat.lato,a.stat.lato),e.clear(e.DEPTH_BUFFER_BIT),e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uo.uVP,!1,a.vp);let g=0,v=0,b=a.raggio+12;for(let x of this.chunks.values())x.quad!==0&&(Math.hypot(x.x0+8-a.centro[0],x.z0+8-a.centro[2])>b||(e.uniform3f(this.uo.uChunk,x.chunk[0],x.chunk[1],x.chunk[2]),e.bindVertexArray(x.vao),e.drawElements(e.TRIANGLES,x.quad*6,e.UNSIGNED_SHORT,0),g++,v+=x.quad*2));if(e.bindVertexArray(null),o){let[x,z]=o.disegnaOmbra(a.vp,!1);g+=x,v+=z,o.mappaSporca=!1}a.sporca=!1,a.calcoli++,a.disegni=g,a.triangoli=v}e.bindFramebuffer(e.FRAMEBUFFER,a.din.fbo),e.viewport(0,0,a.din.lato,a.din.lato),e.clear(e.DEPTH_BUFFER_BIT);let m=0,h=0;o&&([m,h]=o.disegnaOmbra(a.vpDin,!0)),e.disable(e.POLYGON_OFFSET_FILL),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),a.on=!0,r.calcoliMappa=a.calcoli,r.disegniOmbra=m+(p?a.disegni:0),r.triangoliOmbra=h+(p?a.triangoli:0)}impostaAltezze(t,o,e,a,n,r=null){let s=this.gl;this.altezze||(this.altezze=s.createTexture()),s.bindTexture(s.TEXTURE_2D,this.altezze),s.pixelStorei(s.UNPACK_ALIGNMENT,1);let l=new Uint8Array(a*n*4);for(let c=0;c<a*n;c++)l[c*4]=t[c],l[c*4+1]=r?r[c]:t[c];s.texImage2D(s.TEXTURE_2D,0,s.RGBA8,a,n,0,s.RGBA,s.UNSIGNED_BYTE,l),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE),this.altRett=[o,e,1/a,1/n],this._preparaOmbre(a,n)}impostaMaterie(t){let o=new Float32Array(64);for(let e=0;e<16&&e<t.length;e++)for(let a=0;a<4;a++)o[e*4+a]=t[e][a]||0;this.materie=o}disegna(t,o,e=null){let a=this.gl,n=this.statistiche;this.tempo+=o;let r=Za(t.fov,t.rapporto,.3,400),s=to(t.occhio,t.centro);Le(r,s,this.vp),Jo(this.vp,this.piani),this._camera=t,this._visibili.length=0,this._visibiliErba.length=0;let l=0;for(let p of this.chunks.values())p.quad===0&&p.quadAcqua===0||(p.visto=this.tutto||ta(this.piani,p.x0,p.y0+p.minY,p.z0,p.x0+16,p.y0+p.maxY+1,p.z0+16),p.visto&&(l++,p.quadAcqua>0&&this._visibili.push(p),p.verticiErba>0&&Math.hypot(p.x0+8-t.occhio[0],p.z0+8-t.occhio[2])<=this.erbaFinoA&&this._visibiliErba.push(p)));this.ombra&&this.altezze&&this._calcolaOmbre(),this._aggiornaMappa(t,e),n.disegniSpecchio=0,n.triangoliSpecchio=0,n.pelo=null,this.specchio.pelo=null,this.specchio.attivo&&this._visibili.length&&this._specchia(t,e),a.clear(a.COLOR_BUFFER_BIT|a.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vp,t.occhio),this.taglio=-1e9,this.vpCorrente=this.vp;let[c,u]=this._solidi(this.vp,this.piani,t.occhio,!1),d=0,f=0;if(this._visibiliErba.length){let p=this.ue,m=this.sole;a.useProgram(this.programmaErba),a.uniformMatrix4fv(p.uVP,!1,this.vp),a.uniform1f(p.uTempo,this.tempo),a.uniform3f(p.uSoleVerso,m.verso[0],m.verso[1],m.verso[2]),a.uniform3f(p.uSoleCol,m.colore[0],m.colore[1],m.colore[2]),a.uniform1f(p.uSoleForza,m.forza),a.uniform3f(p.uCieloCol,m.cielo[0],m.cielo[1],m.cielo[2]),a.uniform2f(p.uNebbia,this.nebbia.da,this.nebbia.a),a.uniform3f(p.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),a.uniform3f(p.uCam,t.occhio[0],t.occhio[1],t.occhio[2]),a.uniform2f(p.uVento,Math.cos(this.tempo*.045),Math.sin(this.tempo*.045)),a.uniform1f(p.uOmbra,this.ombra&&this.altezze?1:0),a.uniform1f(p.uTaglio,-1e9),a.uniform1f(p.uErbaFinoA,this.erbaFinoA),a.uniform4f(p.uBuco,this.buco[0],this.buco[1],this.buco[2],this.buco[3]),a.uniform3f(p.uOcchio,t.occhio[0],t.occhio[1],t.occhio[2]),this.altezze&&(a.activeTexture(a.TEXTURE0),a.bindTexture(a.TEXTURE_2D,this.ombre.tex),a.uniform1i(p.uOmbre,0),a.uniform2f(p.uOmbreScala,this.ombre.scala,this.ombre.offset),a.uniform4f(p.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(p),a.disable(a.CULL_FACE);for(let h of this._visibiliErba)a.uniform3f(p.uChunk,h.chunk[0],h.yBaseErba,h.chunk[2]),a.bindVertexArray(h.vaoErba),a.drawArraysInstanced(a.TRIANGLES,0,6,h.lamelle),d++,f+=h.lamelle*2;a.enable(a.CULL_FACE),a.bindVertexArray(null)}n.disegni=c,n.triangoli=u,n.chunkVisti=l,n.chunkTotali=this.chunks.size,n.disegniErba=d,n.triangoliErba=f}_solidi(t,o,e,a){let n=this.gl,r=this.u,s=this.sole;n.useProgram(this.programma),n.uniformMatrix4fv(r.uVP,!1,t),n.uniform1f(r.uTempo,this.tempo),n.uniform3f(r.uSoleVerso,s.verso[0],s.verso[1],s.verso[2]),n.uniform3f(r.uSoleCol,s.colore[0],s.colore[1],s.colore[2]),n.uniform1f(r.uSoleForza,s.forza),n.uniform3f(r.uCieloCol,s.cielo[0],s.cielo[1],s.cielo[2]),n.uniform4fv(r.uMaterie,this.materie),n.uniform2f(r.uNebbia,this.nebbia.da,this.nebbia.a),n.uniform3f(r.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]),n.uniform3f(r.uCam,e[0],e[1],e[2]),n.uniform1f(r.uOmbra,this.ombra&&this.altezze?1:0),n.uniform1f(r.uTaglio,this.taglio);let l=a?[0,0,0,0]:this.buco;n.uniform4f(r.uBuco,l[0],l[1],l[2],l[3]),n.uniform3f(r.uOcchio,e[0],e[1],e[2]),this.altezze&&(n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,this.ombre.tex),n.uniform1i(r.uOmbre,0),n.uniform2f(r.uOmbreScala,this.ombre.scala,this.ombre.offset),n.uniform4f(r.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])),this.legaMappa(r);let c=0,u=0;for(let d of this.chunks.values())if(d.quad!==0){if(a){if(!this.tutto&&!ta(o,d.x0,d.y0+d.minY,d.z0,d.x0+16,d.y0+d.maxY+1,d.z0+16))continue}else if(!d.visto)continue;n.uniform3f(r.uChunk,d.chunk[0],d.chunk[1],d.chunk[2]),n.bindVertexArray(d.vao),n.drawElements(n.TRIANGLES,d.quad*6,n.UNSIGNED_SHORT,0),c++,u+=d.quad*2}return n.bindVertexArray(null),[c,u]}_peloVicino(t){let o=this._voti;o.clear();for(let n of this._visibili){if(n.peloAcqua==null)continue;let r=Math.hypot(n.x0+8-t[0],n.z0+8-t[2])+2.2*Math.abs(n.peloAcqua-t[1]);o.set(n.peloAcqua,(o.get(n.peloAcqua)||0)+n.quadAcqua/(1+r))}let e=null,a=0;for(let[n,r]of o)r>a&&(a=r,e=n);return e}_specchia(t,o){let e=this.gl,a=this.specchio,n=this.statistiche,r=this._peloVicino(t.occhio);if(r==null||t.occhio[1]<=r+.2)return;let s=Math.max(1,Math.round(e.drawingBufferWidth*a.scala)),l=Math.max(1,Math.round(e.drawingBufferHeight*a.scala));(!a.fbo||a.w!==s||a.h!==l)&&this._preparaSpecchio(s,l);let c=this._riflessione;c.fill(0),c[0]=1,c[5]=-1,c[10]=1,c[13]=2*r,c[15]=1,Le(this.vp,c,this.vpSpecchio),Jo(this.vpSpecchio,this.pianiSpecchio);let u=[t.occhio[0],2*r-t.occhio[1],t.occhio[2]];e.bindFramebuffer(e.FRAMEBUFFER,a.fbo),e.viewport(0,0,s,l),e.clear(e.COLOR_BUFFER_BIT|e.DEPTH_BUFFER_BIT),this._disegnaCielo(this.vpSpecchio,u),e.cullFace(e.FRONT),this.taglio=r-.05,this.vpCorrente=this.vpSpecchio;let[d,f]=this._solidi(this.vpSpecchio,this.pianiSpecchio,u,!0);n.disegniSpecchio=d,n.triangoliSpecchio=f,o&&(o.disegna(this,{occhio:u,centro:t.centro,fov:t.fov,rapporto:t.rapporto}),n.disegniSpecchio+=o.statistiche.disegni,n.triangoliSpecchio+=o.statistiche.triangoli),e.cullFace(e.BACK),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,e.drawingBufferWidth,e.drawingBufferHeight),this.taglio=-1e9,a.pelo=r,n.pelo=r}_mostraSpecchio(){let t=this.gl,o=this.specchio;this.programmaQuad||(this.programmaQuad=ut(t,`#version 300 es
out vec2 vUv;
void main() { vec2 q = vec2(gl_VertexID & 1, gl_VertexID >> 1); vUv = q; gl_Position = vec4(-1.0 + q, 0.0, 1.0); }   // il quarto in basso a sinistra`,`#version 300 es
precision mediump float; in vec2 vUv; uniform sampler2D uTex; out vec4 colore;
void main() { colore = vec4(texture(uTex, vUv).rgb, 1.0); }`),this.uQuad=t.getUniformLocation(this.programmaQuad,"uTex"),this.vaoQuad=t.createVertexArray()),t.useProgram(this.programmaQuad),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,o.tex),t.uniform1i(this.uQuad,0),t.bindVertexArray(this.vaoQuad),t.disable(t.DEPTH_TEST),t.drawArrays(t.TRIANGLE_STRIP,0,4),t.enable(t.DEPTH_TEST),t.bindVertexArray(null)}_preparaSpecchio(t,o){let e=this.gl,a=this.specchio;a.fbo||(a.fbo=e.createFramebuffer(),a.tex=e.createTexture(),a.rbo=e.createRenderbuffer()),e.bindTexture(e.TEXTURE_2D,a.tex),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,t,o,0,e.RGBA,e.UNSIGNED_BYTE,null),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.bindRenderbuffer(e.RENDERBUFFER,a.rbo),e.renderbufferStorage(e.RENDERBUFFER,e.DEPTH_COMPONENT16,t,o),e.bindFramebuffer(e.FRAMEBUFFER,a.fbo),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,a.tex,0),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.DEPTH_ATTACHMENT,e.RENDERBUFFER,a.rbo),e.checkFramebufferStatus(e.FRAMEBUFFER)!==e.FRAMEBUFFER_COMPLETE&&(a.attivo=!1,console.warn("specchio: framebuffer incompleto, spento")),e.bindFramebuffer(e.FRAMEBUFFER,null),e.bindTexture(e.TEXTURE_2D,null),a.w=t,a.h=o}disegnaAcqua(){let t=this.gl,o=this.ua,e=this.sole,a=this._camera,n=this.specchio;if(!a||this._visibili.length===0){this.statistiche.disegniAcqua=0;return}t.useProgram(this.programmaAcqua),t.uniformMatrix4fv(o.uVP,!1,this.vp),t.uniform1f(o.uTempo,this.tempo),t.uniform3f(o.uCam,a.occhio[0],a.occhio[1],a.occhio[2]),t.uniform2f(o.uNebbia,this.nebbia.da,this.nebbia.a),t.uniform3f(o.uSoleVerso,e.verso[0],e.verso[1],e.verso[2]),t.uniform3f(o.uSoleCol,e.colore[0],e.colore[1],e.colore[2]),t.uniform1f(o.uSoleForza,e.forza),t.uniform3f(o.uCieloCol,e.cielo[0],e.cielo[1],e.cielo[2]),t.uniform3f(o.uNebbiaCol,this.nebbia.colore[0],this.nebbia.colore[1],this.nebbia.colore[2]);let r=n.pelo!=null&&n.tex;t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,r?n.tex:null),t.uniform1i(o.uSpecchio,1),t.uniform3f(o.uSchermo,1/t.drawingBufferWidth,1/t.drawingBufferHeight,r?1:0),t.uniform1f(o.uMare,this.mare),t.uniform4fv(o.uGalleggianti,this.galleggianti),t.uniform1i(o.uNGalleggianti,this.nGalleggianti),this.altezze&&this.altRett?(t.activeTexture(t.TEXTURE2),t.bindTexture(t.TEXTURE_2D,this.altezze),t.uniform1i(o.uAltezze,2),t.bindSampler(2,this.campionatoreLiscio),t.uniform4f(o.uAltRett,this.altRett[0],this.altRett[1],this.altRett[2],this.altRett[3])):t.uniform4f(o.uAltRett,0,0,0,0),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE_MINUS_SRC_ALPHA),t.depthMask(!1),t.disable(t.CULL_FACE);let s=0,l=0;for(let c of this._visibili)t.uniform3f(o.uChunk,c.chunk[0],c.chunk[1],c.chunk[2]),t.bindVertexArray(c.vaoAcqua),t.drawElements(t.TRIANGLES,c.quadAcqua*6,t.UNSIGNED_SHORT,0),s++,l+=c.quadAcqua*2;t.bindVertexArray(null),t.depthMask(!0),t.enable(t.CULL_FACE),t.disable(t.BLEND),t.bindSampler(2,null),t.activeTexture(t.TEXTURE0),this.statistiche.disegniAcqua=s,this.statistiche.triangoliAcqua=l,n.mostra&&r&&this._mostraSpecchio()}};function Wa(i){let t=new DataView(i);if(String.fromCharCode(t.getUint8(0),t.getUint8(1),t.getUint8(2),t.getUint8(3))!=="LNM1")throw new Error("non \xE8 un modello del nucleo");let o=t.getUint32(4,!0),e=o*3,a=new Uint8Array(i,8,e*16),n=new Uint8Array(i,8+e*16,e*4),r=new Uint8Array(e*20);for(let d=0;d<e;d++)r.set(a.subarray(d*16,d*16+16),d*20),r.set(n.subarray(d*4,d*4+4),d*20+16);let s=1/0,l=-1/0,c=0,u=new DataView(r.buffer);for(let d=0;d<e;d++){let f=u.getFloat32(d*20,!0),p=u.getFloat32(d*20+4,!0),m=u.getFloat32(d*20+8,!0);s=Math.min(s,p),l=Math.max(l,p),c=Math.max(c,Math.hypot(f,m))}return{byte:r,vertici:e,triangoli:o,minY:s,maxY:l,raggio:c}}var fr=`#version 300 es
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
}`,dr=`#version 300 es
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
}`;function pr(i,t=4){if(t===8)return i instanceof Float32Array?i:new Float32Array(i);let o=i.length/4,e=new Float32Array(o*8);for(let a=0;a<o;a++)e.set([i[a*4],i[a*4+1],i[a*4+2],i[a*4+3],1,1,1,0],a*8);return e}function Qa(i=[255,255,255],t=1,o=1,e=1){let a=[[[0,0,1],[[-1,0,1],[1,0,1],[1,1,1],[-1,1,1]]],[[0,0,-1],[[1,0,-1],[-1,0,-1],[-1,1,-1],[1,1,-1]]],[[1,0,0],[[1,0,1],[1,0,-1],[1,1,-1],[1,1,1]]],[[-1,0,0],[[-1,0,-1],[-1,0,1],[-1,1,1],[-1,1,-1]]],[[0,1,0],[[-1,1,1],[1,1,1],[1,1,-1],[-1,1,-1]]],[[0,-1,0],[[-1,0,-1],[1,0,-1],[1,0,1],[-1,0,1]]]],n=36,r=new Uint8Array(n*20),s=new DataView(r.buffer),l=0,c=(u,d)=>{let f=l*20;s.setFloat32(f,u[0]*t/2,!0),s.setFloat32(f+4,u[1]*o,!0),s.setFloat32(f+8,u[2]*e/2,!0),r[f+12]=d[0]*127&255,r[f+13]=d[1]*127&255,r[f+14]=d[2]*127&255,r[f+15]=0,r[f+16]=i[0],r[f+17]=i[1],r[f+18]=i[2],r[f+19]=255,l++};for(let[u,[d,f,p,m]]of a)c(d,u),c(f,u),c(p,u),c(d,u),c(p,u),c(m,u);return{byte:r,vertici:n,triangoli:12,minY:0,maxY:o,raggio:Math.hypot(t,e)/2}}var mr=`#version 300 es
layout(location = 0) in vec3 aPos;
layout(location = 3) in vec4 aIst;
layout(location = 5) in vec4 aTinta;
uniform mat4 uVP;
void main() {
  float cg = cos(aTinta.w), sg = sin(aTinta.w);
  vec3 q = vec3(aPos.x * cg - aPos.z * sg, aPos.y, aPos.x * sg + aPos.z * cg);
  gl_Position = uVP * vec4(aIst.xyz + q * aIst.w, 1.0);
}`,hr=`#version 300 es
precision mediump float;
void main() {}`,ao=class{constructor(t){this.gl=t,this.programma=ut(t,fr,dr),this.u={};for(let o of["uVP","uTempo","uSoleVerso","uSoleCol","uSoleForza","uCieloCol","uMaterie","uNebbia","uCam","uNebbiaCol","uOmbra","uOmbre","uOmbreScala","uAltRett","uTaglio","uBuco","uOcchio","uSagoma","uMappaStat","uMappaDin","uLuceVP","uLuceVPDin","uMappaTexel","uMappaOn","uMappaSbieco","uLampade","uNLampade","uLampCol","uStile","uAltezze"])this.u[o]=t.getUniformLocation(this.programma,o);this.programmaOmbra=ut(t,mr,hr),this.uoVP=t.getUniformLocation(this.programmaOmbra,"uVP"),this.dinamici=new Set(["omino","cubo"]),this.mappaSporca=!0,this.sagoma="omino",this.tipi=new Map,this.statistiche={disegni:0,triangoli:0,istanze:0}}registra(t,o){let e=this.gl,a={vao:e.createVertexArray(),vbo:e.createBuffer(),ibo:e.createBuffer(),vertici:o.vertici,triangoli:o.triangoli,istanze:new Float32Array(0),n:0,sporco:!1,raggio:o.raggio,maxY:o.maxY};return e.bindVertexArray(a.vao),e.bindBuffer(e.ARRAY_BUFFER,a.vbo),e.bufferData(e.ARRAY_BUFFER,o.byte,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,3,e.FLOAT,!1,20,0),e.enableVertexAttribArray(1),e.vertexAttribPointer(1,3,e.BYTE,!0,20,12),e.enableVertexAttribArray(4),e.vertexAttribIPointer(4,1,e.UNSIGNED_BYTE,20,15),e.enableVertexAttribArray(2),e.vertexAttribPointer(2,4,e.UNSIGNED_BYTE,!0,20,16),e.bindBuffer(e.ARRAY_BUFFER,a.ibo),e.enableVertexAttribArray(3),e.vertexAttribPointer(3,4,e.FLOAT,!1,32,0),e.vertexAttribDivisor(3,1),e.enableVertexAttribArray(5),e.vertexAttribPointer(5,4,e.FLOAT,!1,32,16),e.vertexAttribDivisor(5,1),e.bindVertexArray(null),this.tipi.set(t,a),a}istanze(t,o,e=4){let a=this.tipi.get(t);a&&(a.istanze=pr(o,e),a.n=a.istanze.length/8,a.sporco=!0,this.dinamici.has(t)||(this.mappaSporca=!0))}disegnaOmbra(t,o){let e=this.gl;e.useProgram(this.programmaOmbra),e.uniformMatrix4fv(this.uoVP,!1,t);let a=0,n=0;for(let[r,s]of this.tipi)s.n===0||this.dinamici.has(r)!==o||(e.bindVertexArray(s.vao),s.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,s.ibo),e.bufferData(e.ARRAY_BUFFER,s.istanze,e.DYNAMIC_DRAW),s.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,s.vertici,s.n),a++,n+=s.triangoli*s.n);return e.bindVertexArray(null),[a,n]}disegna(t,o){let e=this.gl,a=this.u,n=t.sole;e.useProgram(this.programma),e.uniformMatrix4fv(a.uVP,!1,t.vpCorrente||t.vp),e.uniform1f(a.uTaglio,t.taglio??-1e9);let r=t.vpCorrente===t.vpSpecchio?[0,0,0,0]:t.buco||[0,0,0,0];e.uniform3f(a.uOcchio,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(a.uTempo,t.tempo),e.uniform3f(a.uSoleVerso,n.verso[0],n.verso[1],n.verso[2]),e.uniform3f(a.uSoleCol,n.colore[0],n.colore[1],n.colore[2]),e.uniform1f(a.uSoleForza,n.forza),e.uniform3f(a.uCieloCol,n.cielo[0],n.cielo[1],n.cielo[2]),e.uniform4fv(a.uMaterie,t.materie),e.uniform2f(a.uNebbia,t.nebbia.da,t.nebbia.a),e.uniform3f(a.uNebbiaCol,t.nebbia.colore[0],t.nebbia.colore[1],t.nebbia.colore[2]),e.uniform3f(a.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(a.uOmbra,t.ombra&&t.altezze?1:0),t.altezze&&(e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,t.ombre.tex),e.uniform1i(a.uOmbre,0),e.uniform2f(a.uOmbreScala,t.ombre.scala,t.ombre.offset),e.uniform4f(a.uAltRett,t.altRett[0],t.altRett[1],t.altRett[2],t.altRett[3])),t.legaMappa(a);let s=0,l=0,c=0;e.uniform1f(a.uSagoma,0);for(let[d,f]of this.tipi)f.n!==0&&(e.uniform4f(a.uBuco,r[0],r[1],r[2],d==="omino"?0:r[3]),e.bindVertexArray(f.vao),f.sporco&&(e.bindBuffer(e.ARRAY_BUFFER,f.ibo),e.bufferData(e.ARRAY_BUFFER,f.istanze,e.DYNAMIC_DRAW),f.sporco=!1),e.drawArraysInstanced(e.TRIANGLES,0,f.vertici,f.n),s++,l+=f.triangoli*f.n,c+=f.n);let u=this.sagoma&&this.tipi.get(this.sagoma);u&&u.n>0&&t.vpCorrente!==t.vpSpecchio&&(e.uniform1f(a.uSagoma,1),e.depthFunc(e.GREATER),e.depthMask(!1),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE_MINUS_SRC_ALPHA),e.bindVertexArray(u.vao),e.drawArraysInstanced(e.TRIANGLES,0,u.vertici,u.n),e.disable(e.BLEND),e.depthMask(!0),e.depthFunc(e.LESS),e.uniform1f(a.uSagoma,0),s++),e.bindVertexArray(null),this.statistiche.disegni=s,this.statistiche.triangoli=l,this.statistiche.istanze=c}};var gr=`#version 300 es
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
}`,vr=`#version 300 es
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
}`,io=class{constructor(t){this.gl=t,this.programma=ut(t,gr,vr),this.u={};for(let o of["uVP","uCam","uSoleForza"])this.u[o]=t.getUniformLocation(this.programma,o);this.vao=t.createVertexArray(),this.ibo=t.createBuffer(),t.bindVertexArray(this.vao),t.bindBuffer(t.ARRAY_BUFFER,this.ibo),t.enableVertexAttribArray(0),t.vertexAttribPointer(0,4,t.FLOAT,!1,32,0),t.vertexAttribDivisor(0,1),t.enableVertexAttribArray(1),t.vertexAttribPointer(1,4,t.FLOAT,!1,32,16),t.vertexAttribDivisor(1,1),t.bindVertexArray(null),this.n=0,this.attivo=!0,this.statistiche={disegni:0,bagliori:0}}istanze(t){let o=this.gl,e=t instanceof Float32Array?t:new Float32Array(t);this.n=e.length/8,o.bindBuffer(o.ARRAY_BUFFER,this.ibo),o.bufferData(o.ARRAY_BUFFER,e,o.DYNAMIC_DRAW)}disegna(t,o){let e=this.gl,a=this.u;if(!this.attivo||this.n===0){this.statistiche.disegni=0,this.statistiche.bagliori=0;return}e.useProgram(this.programma),e.uniformMatrix4fv(a.uVP,!1,t.vp),e.uniform3f(a.uCam,o.occhio[0],o.occhio[1],o.occhio[2]),e.uniform1f(a.uSoleForza,t.sole.forza),e.enable(e.BLEND),e.blendFunc(e.ONE,e.ONE),e.depthMask(!1),e.disable(e.CULL_FACE),e.bindVertexArray(this.vao),e.drawArraysInstanced(e.TRIANGLES,0,6,this.n),e.bindVertexArray(null),e.depthMask(!0),e.enable(e.CULL_FACE),e.disable(e.BLEND),this.statistiche.disegni=1,this.statistiche.bagliori=this.n}};at();var M=16,Er=256,no=2048,ei=64,ht=(i,t,o)=>((i+no)*4096+(o+no))*256+(t+ei),le=i=>Math.floor(i/(256*4096))-no,ue=i=>Math.floor(i/256)%4096-no,fe=i=>i%256-ei;var Ht=(i,t)=>Math.floor(i/M)+","+Math.floor(t/M),ro=class{constructor(){this.chunks=new Map,this.sporchi=new Set,this.sporchiAcqua=new Set,this.bagnate=new Map,this._rev=new Map,this.furni=new Map,this.ombreFurni=new Map,this.contaBlocchi=0,this.onEvento=null,this.cambiate=[],this.troppiCambi=!1,this._memoCx=0,this._memoCz=0,this._memoChunk=null,this.generati=new Set,this.modifiche=new Map,this.frontiera=null}segnaGenerato(t){this.generati.add(t)}_annotaModifica(t,o,e,a){if(!this.frontiera)return;let n=Ht(t,e),r=this.modifiche.get(n);r||(r=new Map,this.modifiche.set(n,r)),r.set(ht(t,o,e),a)}applicaModifiche(t){let o=this.modifiche.get(t);if(!o)return 0;for(let[e,a]of o){let n=le(e),r=fe(e),s=ue(e);a===null?this.togli(n,r,s,!0):this.metti(n,r,s,a,!0)}return o.size}scaricaChunk(t){let o=this.chunks.get(t);if(!o)return this.generati.delete(t),[];let e=[];for(let[a,n]of o){let r=w(n);r&&r.forma==="modello"&&e.push([le(a),fe(a),ue(a),n])}return this.contaBlocchi-=o.size,this.chunks.delete(t),this._scordaMemo(),this.generati.delete(t),this._tocca(t,this.sporchi),e}_cambiata(t,o,e){if(this.cambiate.length>=3*Er){this.troppiCambi=!0;return}this.cambiate.push(t,o,e)}scordaCambi(){this.cambiate.length=0,this.troppiCambi=!1}_scordaMemo(){this._memoKc=null,this._memoChunk=null}_chunkDi(t,o){let e=Math.floor(t/M),a=Math.floor(o/M);if(this._memoChunk!==null&&this._memoCx===e&&this._memoCz===a)return this._memoChunk;let n=this.chunks.get(e+","+a)||null;return this._memoCx=e,this._memoCz=a,this._memoChunk=n,n}tipo(t,o,e){let a=this._chunkDi(t,e);return a&&a.get(ht(t,o,e))||null}pieno(t,o,e){return this.tipo(t,o,e)!==null}solido(t,o,e){let a=this.tipo(t,o,e);if(a&&w(a).solido)return!0;let n=this.furni.get(ht(t,o,e));return!!n&&!(n.def&&n.def.calpestabile)}calpestabile(t,o,e){if(!this.solido(t,o-1,e)||this.solido(t,o,e)||this.solido(t,o+1,e))return!1;let a=this.tipo(t,o,e);return!(a&&w(a).acqua)}_sporca(t,o,e=this.sporchi){let a=(t%M+M)%M,n=(o%M+M)%M;this._tocca(Ht(t,o),e),a===0&&this._tocca(Ht(t-1,o),e),a===M-1&&this._tocca(Ht(t+1,o),e),n===0&&this._tocca(Ht(t,o-1),e),n===M-1&&this._tocca(Ht(t,o+1),e)}_tocca(t,o){o.add(t),this._rev.set(t,(this._rev.get(t)||0)+1)}revisione(t){return this._rev.get(t)||0}metti(t,o,e,a,n=!1){let r=Ht(t,e),s=this.chunks.get(r);s||(s=new Map,this.chunks.set(r,s),this._scordaMemo());let l=ht(t,o,e),c=s.get(l);c===void 0&&this.contaBlocchi++,s.set(l,a);let u=a.charCodeAt(0)===97&&a.startsWith("acqua")&&(c===void 0||c.startsWith("acqua"));this._sporca(t,e,u?this.sporchiAcqua:this.sporchi),u||this._cambiata(t,o,e),n||(this._annotaModifica(t,o,e,a),this.onEvento&&this.onEvento({tipo:"metti",cella:[t,o,e],blocco:a}))}togli(t,o,e,a=!1){let n=Ht(t,e),r=this.chunks.get(n);if(!r)return!1;let s=ht(t,o,e),l=r.get(s);if(!r.delete(s))return!1;this.bagnate.delete(s),this.contaBlocchi--,r.size===0&&(this.chunks.delete(n),this._scordaMemo());let c=!!(l&&l.startsWith("acqua"));return this._sporca(t,e,c?this.sporchiAcqua:this.sporchi),c||this._cambiata(t,o,e),a||(this._annotaModifica(t,o,e,null),this.onEvento&&this.onEvento({tipo:"togli",cella:[t,o,e]})),!0}bagna(t,o,e,a=0){this.bagnate.set(ht(t,o,e),Math.max(0,Math.min(15,a|0))),this._sporca(t,e,this.sporchiAcqua)}asciuga(t,o,e){return this.bagnate.delete(ht(t,o,e))?(this._sporca(t,e,this.sporchiAcqua),!0):!1}bagnata(t,o,e){let a=this.bagnate.get(ht(t,o,e));return a===void 0?null:a}occupaFurni(t,o){for(let[e,a,n]of t)this.furni.set(ht(e,a,n),o)}liberaFurni(t){for(let[o,e,a]of t)this.furni.delete(ht(o,e,a))}furniIn(t,o,e){return this.furni.get(ht(t,o,e))||null}occupaOmbra(t,o=!1){for(let[e,a,n]of t){let r=ht(e,a,n),s=this.ombreFurni.get(r);if(s){s.n++,o&&s.op++===0&&this._cambiata(e,a,n);continue}this.ombreFurni.set(r,{x:e,y:a,z:n,n:1,op:o?1:0}),this._cambiata(e,a,n)}}liberaOmbra(t,o=!1){for(let[e,a,n]of t){let r=ht(e,a,n),s=this.ombreFurni.get(r);s&&(o&&s.op>0&&--s.op===0&&s.n>1&&this._cambiata(e,a,n),!(--s.n>0)&&(this.ombreFurni.delete(r),this._cambiata(e,a,n)))}}ombraFurniIn(t,o,e){let a=this.ombreFurni.get(ht(t,o,e));return a?a.op>0?2:1:0}appoggioInColonna(t,o,e,a=8){for(let n=e;n>e-a;n--)if(this.calpestabile(t,n,o))return n;return null}svuota(){this.chunks.clear(),this._scordaMemo(),this.furni.clear(),this.sporchi.clear(),this.sporchiAcqua.clear();for(let t of this._rev.keys())this._rev.set(t,this._rev.get(t)+1);this.scordaCambi(),this.contaBlocchi=0}*tutti(){for(let t of this.chunks.values())for(let[o,e]of t)yield{x:le(o),y:fe(o),z:ue(o),tipo:e}}perOgni(t){for(let o of this.chunks.values())for(let[e,a]of o)t(le(e),fe(e),ue(e),a)}*blocchiDelChunk(t){let o=this.chunks.get(t);if(o)for(let[e,a]of o)yield{x:le(e),y:fe(e),z:ue(e),tipo:a}}perOgniDelChunk(t,o){let e=this.chunks.get(t);if(e)for(let[a,n]of e)o(le(a),fe(a),ue(a),n)}};function Oe(i,t,o){let e=i*374761393+t*668265263+o*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function oi(i){return i*i*(3-2*i)}function aa(i,t,o){let e=Math.floor(i),a=Math.floor(t),n=oi(i-e),r=oi(t-a),s=Oe(e,a,o),l=Oe(e+1,a,o),c=Oe(e,a+1,o),u=Oe(e+1,a+1,o);return s+(l-s)*n+(c-s)*r+(s-l-c+u)*n*r}var ia=5;function ai(i,t,o,e=1){let a=[],n=t*16,r=o*16;for(let s=n;s<n+16;s++)for(let l=r;l<r+16;l++){let c=.55*aa(s*.028,l*.028,e)+.3*aa(s*.07,l*.07,e+11)+.15*aa(s*.16,l*.16,e+29),u=Math.max(2,1+Math.round(Math.pow(Math.max(0,c),1.6)*22)),d=u<=ia+1;for(let f=0;f<u;f++){let m=f===u-1?d?"sabbia":"erba":f<u-3?"roccia":"terra";i.metti(s,f,l,m,!0)}if(u<=ia)for(let f=u;f<=ia;f++)i.metti(s,f,l,"acqua",!0);else if(!d){let f=Oe(s*3+1,l*3+7,e+101);f>.988?a.push([s,u,l,"albero"]):f<.004&&a.push([s,u,l,"lampione"])}}return a}at();var so={lampione:{nome:"Lampione",modello:"lampione",altezza:3,mezza:.45,cima:16771764,lato:5988976,fondo:4672856,luce:{colore:16767113,pozza:16762994,raggio:4.6,intensita:1,ombra:!0,quota:2.6},notte:!0},albero:{nome:"Albero",modello:"albero",altezza:4.2,mezza:.7,cima:5217862,lato:8016432,fondo:6964518}};function ii(){for(let[i,t]of Object.entries(so))_t(i,{nome:t.nome,cima:t.cima,lato:t.lato,fondo:t.fondo,solido:!1,nav:10,fam:"taglia",forma:"modello",modello:t.modello,altezza:t.altezza,mezza:t.mezza,luce:t.luce},ce)}at();at();var Ar={primavera:{nome:"Primavera",emoji:"\u{1F338}",erba:[6738010,6343509,5949008,5553995,5158983,4763971,4434495,4105019],fogliame:null},estate:{nome:"Estate secca",emoji:"\u{1F33E}",erba:[15060862,14534259,14073193,13546335,13019733,12558668,12032068,11571261],fogliame:{h:.128,sF:.72,l:i=>i*.92+.1}},autunno:{nome:"Autunno",emoji:"\u{1F342}",erba:[15506768,15045448,14584129,14122810,13661492,13200431,12739371,12278311],fogliame:{h:.045,sF:1.2,l:i=>i*1.05+.09}},inverno:{nome:"Inverno",emoji:"\u2744\uFE0F",erba:[15988722,15462890,14871523,14279900,13622740,13031117,12439751,11848128],sabbia:{cima:15722970,lato:14932934,fondo:14077364},fogliame:{h:.42,sF:.18,l:i=>i*.38+.58}}},de="primavera";function ni(){return de}var Ie=null;function ri(){return Ie}function co(i,t,o){let e=i>>16&255,a=i>>8&255,n=i&255,r=t>>16&255,s=t>>8&255,l=t&255,c=(u,d)=>Math.round(u+(d-u)*o);return c(e,r)<<16|c(a,s)<<8|c(n,l)}function uo(i,t){if(Ie){let o=de;de=Ie.da;let e=na(i,t);de=Ie.a;let a=na(i,t);de=o;let n=Ie.mix;return{cima:lo(e.cima,a.cima,n),lato:lo(e.lato,a.lato,n),fondo:lo(e.fondo,a.fondo,n),facce:e.facce,orlo:e.orlo!=null&&a.orlo!=null?lo(e.orlo,a.orlo,n):e.orlo}}return na(i,t)}function lo(i,t,o){let e=Math.round((i>>16&255)+((t>>16&255)-(i>>16&255))*o),a=Math.round((i>>8&255)+((t>>8&255)-(i>>8&255))*o),n=Math.round((i&255)+((t&255)-(i&255))*o);return e<<16|a<<8|n}function na(i,t){let o=w(i),e=Ar[de],{cima:a,lato:n,fondo:r}=o;if(o.cappello&&e.erba&&!o.override&&(a=e.erba[ra(t,e.erba.length)]),o.reagisce==="stagione"&&e.erba){let s=e.erba[ra(t,e.erba.length)],l=o.reagisceForza??1;a=co(a,s,l),n=co(n,s,l*.45),r=co(r,s,l*.3)}else if(o.reagisce==="quota"){let s=ra(t,8)/7,l=(o.reagisceForza??1)*.5,c=u=>co(u,16777215,s*l);a=c(a),n=c(n),r=c(r)}return i==="sabbia"&&e.sabbia&&({cima:a,lato:n,fondo:r}=e.sabbia),{cima:a,lato:n,fondo:r,facce:o.facce||null,orlo:o.orlo!=null?o.orlo:void 0}}function Gt(i,t,o){if(i.facce){let e=t*2+(o>0?0:1),a=i.facce[e];if(a!=null)return a}return t===1?o>0?i.cima:i.fondo:i.lato}function ra(i,t=8){let o=(t-1)*2,e=(Math.round(i)%o+o)%o;return e>=t&&(e=o-e),e}var fo=class{constructor(t,{x:o=.5,y:e=10,z:a=.5}={}){this.mondo=t,this.x=o,this.y=e,this.z=a,this.vy=0,this.aTerra=!1,this.verso=0,this._coyote=0}_solido(t,o,e){return this.mondo.solido(Math.floor(t),Math.floor(o),Math.floor(e))}_urta(t,o,e){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(t+n,o+.05,e+r)||this._solido(t+n,o+.9-.05,e+r))return!0;return!1}_pavimento(t,o,e){for(let n of[-.3,.3])for(let r of[-.3,.3])if(this._solido(t+n,o-.02,e+r))return!0;return!1}aggiorna(t,o,e){let a=Math.min(t,.05),n=o.avanti||0,r=o.destra||0,s=Math.hypot(n,r),l=0,c=0;if(s>.01){let p=e?e.x:0,m=e?e.z:-1,h=Math.hypot(p,m)||1;p/=h,m/=h;let g=-m,v=p;l=(p*n+g*r)/s,c=(m*n+v*r)/s,this.verso=Math.atan2(l,c)}let u=l*4.6*a,d=c*4.6*a;if(u!==0&&(this._urta(this.x+u,this.y,this.z)?this._urta(this.x+u,this.y+1.02,this.z)||(this.x+=u,this.y+=1.02):this.x+=u),d!==0&&(this._urta(this.x,this.y,this.z+d)?this._urta(this.x,this.y+1.02,this.z+d)||(this.z+=d,this.y+=1.02):this.z+=d),this.aTerra?this._coyote=.08:this._coyote=Math.max(0,this._coyote-a),o.salta&&this._coyote>0&&(this.vy=8.2,this._coyote=0,this.aTerra=!1),this.vy<=0&&this._pavimento(this.x,this.y,this.z))return this.vy=0,this.aTerra=!0,this;this.vy-=26*a;let f=this.y+this.vy*a;if(this.vy<=0){let p=this.y-f,m=Math.max(1,Math.ceil(p/.4));for(let h=1;h<=m;h++){let g=this.y-p*h/m;if(this._pavimento(this.x,g,this.z))return this.y=Math.floor(g-.02)+1,this.vy=0,this.aTerra=!0,this}this.aTerra=!1,this.y=f}else this._urta(this.x,f,this.z)&&(this.vy=0,f=this.y),this.y=f,this.aTerra=!1;return this}};function si(i=window){let t=new Set,o={avanti:0,destra:0,salta:!1},e={KeyW:"su",ArrowUp:"su",KeyS:"giu",ArrowDown:"giu",KeyA:"sinistra",ArrowLeft:"sinistra",KeyD:"destra",ArrowRight:"destra",Space:"salta"},a=(n,r)=>{let s=e[n.code];s&&(n.target&&/^(INPUT|TEXTAREA)$/.test(n.target.tagName)||(r?t.add(s):t.delete(s),s==="salta"&&n.preventDefault(),o.avanti=(t.has("su")?1:0)-(t.has("giu")?1:0),o.destra=(t.has("destra")?1:0)-(t.has("sinistra")?1:0),o.salta=t.has("salta")))};return i.addEventListener("keydown",n=>a(n,!0)),i.addEventListener("keyup",n=>a(n,!1)),i.addEventListener("blur",()=>{t.clear(),o.avanti=o.destra=0,o.salta=!1}),o}function ca(i,t,o,e=7){let a=Math.floor(t.x),n=Math.floor(t.y),r=Math.floor(t.z),s=Math.sign(o.x),l=Math.sign(o.y),c=Math.sign(o.z),u=s!==0?Math.abs(1/o.x):1/0,d=l!==0?Math.abs(1/o.y):1/0,f=c!==0?Math.abs(1/o.z):1/0,p=s!==0?(s>0?a+1-t.x:t.x-a)*u:1/0,m=l!==0?(l>0?n+1-t.y:t.y-n)*d:1/0,h=c!==0?(c>0?r+1-t.z:t.z-r)*f:1/0;if(i.solido(a,n,r))return{cella:[a,n,r],faccia:[0,1,0],prima:[a,n+1,r]};for(let g=0;g<e*3+3;g++){let v=0,b=0,x=0;if(p<=m&&p<=h){if(p>e)break;a+=s,p+=u,v=-s}else if(m<=h){if(m>e)break;n+=l,m+=d,b=-l}else{if(h>e)break;r+=c,h+=f,x=-c}if(i.solido(a,n,r))return{cella:[a,n,r],faccia:[v,b,x],prima:[a+v,n+b,r+x]}}return null}function sa(i,t,o,e,a,n=null){let r=0,s=a,l=-1,c=0,u=["x","y","z"];for(let d=0;d<3;d++){let f=u[d],p=t[f];if(Math.abs(p)<1e-9){if(i[f]<o[f]||i[f]>e[f])return-1;continue}let m=(o[f]-i[f])/p,h=(e[f]-i[f])/p,g=-1;if(m>h){let v=m;m=h,h=v,g=1}if(m>r&&(r=m,l=d,c=g),h<s&&(s=h),r>s)return-1}return n&&l>=0&&(n[0]=n[1]=n[2]=0,n[l]=c),r}function ci(i,t,o,e,a=7){let n=ca(i,t,o,a),r=1/0;if(n){let c=n.cella,u=c[0]+.5-t.x,d=c[1]+.5-t.y,f=c[2]+.5-t.z;r=Math.sqrt(u*u+d*d+f*f)}let s=null,l=r;for(let c of e||[]){let u=sa(t,o,c.min,c.max,a);u>=0&&u<l&&(l=u,s=c)}if(s){let c=s.dato&&s.dato.cella,u=n&&n.prima,d=n&&n.faccia;if(c){let f=[0,0,0],p=sa(t,o,{x:c[0],y:c[1],z:c[2]},{x:c[0]+1,y:c[1]+1,z:c[2]+1},a,f);p<0&&(p=sa(t,o,s.min,s.max,a,f)),p>=0&&(f[0]||f[1]||f[2])&&(u=[c[0]+f[0],c[1]+f[1],c[2]+f[2]],d=f),u||(u=[c[0],c[1]+1,c[2]],d=[0,1,0])}return{...n,cella:n?n.cella:c||null,faccia:d,scatola:s,dato:s.dato,distanza:l,prima:u}}return n}at();var li=[null,"erba","terra","pietra","mattoni","legno","sabbia","neve","lanaRossa","lanaBlu","lanaGialla","lampadaPesante","lampadaRossa","lampadaVerde","lampadaBlu","lucciola","albero","lampione","erbetta"],yt={erbetta:{nome:"Erbetta",colore:6601551,agisce:"erba"}};function ui(i,t,o,e){let a=i.tipo(t,o,e);if(a==null)return!0;let n=w(a);return!!(n&&n.acqua)}var po=class{constructor(){this.dove=null,this.durata=550,this.inizio=0,this._ultimeSchegge=0}premi(t,o,e){this.dove!==t&&(this.dove=t,this.durata=Math.max(60,o||550),this.inizio=e,this._ultimeSchegge=e)}molla(){this.dove=null,this.inizio=0}progresso(t){return this.dove?Math.min(1,(t-this.inizio)/this.durata):0}finito(t){return!this.dove||this.progresso(t)<1?!1:(this.molla(),!0)}schegge(t){return!this.dove||t-this._ultimeSchegge<130?!1:(this._ultimeSchegge=t,!0)}};function fi(i){return i?i.salute>=100?1100:i.fam==="mina"?750:i.fam==="taglia"?600:380:550}function di(i,t){let o=new Map;i.addEventListener("pointerdown",a=>{o.set(a.pointerId+":"+a.button,{x:a.clientX,y:a.clientY,t:performance.now()})});let e=a=>{let n=a.pointerId+":"+a.button,r=o.get(n);if(!r)return;o.delete(n),Math.hypot(a.clientX-r.x,a.clientY-r.y)<=6&&performance.now()-r.t<=500&&t(a)};i.addEventListener("pointerup",e),i.addEventListener("pointercancel",a=>{for(let n of[...o.keys()])n.startsWith(a.pointerId+":")&&o.delete(n)})}function pi(i,{onInizio:t,onFine:o},e=0){let a=null,n=s=>{a&&(a=null,o&&o(s))};i.addEventListener("pointerdown",s=>{s.button===e&&(a={id:s.pointerId,x:s.clientX,y:s.clientY},t&&t(s))}),i.addEventListener("pointermove",s=>{!a||s.pointerId!==a.id||Math.hypot(s.clientX-a.x,s.clientY-a.y)>6&&n("trascinamento")});let r=s=>{a&&s.pointerId===a.id&&n("rilascio")};i.addEventListener("pointerup",r),i.addEventListener("pointercancel",r),addEventListener("blur",()=>n("fuoco perso"))}var zr=`
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
`,mo=class{constructor(t,{visibile:o=!0,onDemolisci:e=null}={}){this.intento=t,this.demolisci=!1;let a=document.createElement("style");a.textContent=zr,document.head.appendChild(a);let n=this.root=document.createElement("div");n.id="comandi",n.innerHTML=`
      <div class="stick"><div class="knob"></div></div>
      <button class="btn salta" title="Salta">\u2934</button>
      <!-- \u26A0 SUL TELEFONO IL DITO \xC8 UN TASTO SOLO, e questo bottone dice quale
           dei due sta emulando: acceso = il sinistro (rompe, a colpi ripetuti),
           spento = il destro (posa, o accende a mano vuota). Senza di lui met\xE0
           dei verbi del gioco sarebbero irraggiungibili col tocco. -->
      <button class="btn demolisci" title="Piccone: i tocchi rompono (a pi\xF9 colpi)">\u26CF</button>`,document.body.appendChild(n),o||this.mostra(!1);let r=n.querySelector(".stick"),s=n.querySelector(".knob"),l=null,c=0,u=0,d=58,f=(x,z)=>{s.style.transform=`translate(${x*d*.62}px, ${z*d*.62}px)`,this.intento.avanti=-z,this.intento.destra=x},p=x=>{if(x.pointerId!==l)return;let z=(x.clientX-c)/d,A=(x.clientY-u)/d,T=Math.hypot(z,A);T>1&&(z/=T,A/=T),f(z,A),x.preventDefault()};r.addEventListener("pointerdown",x=>{l=x.pointerId;try{r.setPointerCapture(x.pointerId)}catch{}let z=r.getBoundingClientRect();c=z.left+z.width/2,u=z.top+z.height/2,d=z.width/2,p(x)}),r.addEventListener("pointermove",p);let m=x=>{x.pointerId===l&&(l=null,f(0,0))};r.addEventListener("pointerup",m),r.addEventListener("pointercancel",m);let h=n.querySelector(".salta"),g=x=>{x.preventDefault(),this.intento.salta=!0,h.classList.add("premuto")},v=()=>{this.intento.salta=!1,h.classList.remove("premuto")};h.addEventListener("pointerdown",g),h.addEventListener("pointerup",v),h.addEventListener("pointercancel",v),h.addEventListener("pointerleave",v);let b=n.querySelector(".demolisci");b.addEventListener("pointerdown",x=>{x.preventDefault(),this.demolisci=!this.demolisci,b.classList.toggle("acceso",this.demolisci),e&&e(this.demolisci)})}mostra(t){this.root.style.display=t?"":"none"}azzera(){this.intento.avanti=0,this.intento.destra=0,this.intento.salta=!1;let t=this.root.querySelector(".knob");t&&(t.style.transform="")}};var mi="leafy.gui",Mr="gui-tocco";var ho=class{constructor(t){this.onCambio=t,this.scelta=(()=>{try{return localStorage.getItem(mi)||"auto"}catch{return"auto"}})();let o=document.createElement("style");if(o.textContent=`
`,document.head.appendChild(o),this.nodo=document.createElement("div"),this.nodo.id="modoGui",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.cicla()),typeof matchMedia=="function"){this._mq=matchMedia("(pointer: coarse)");let e=()=>{this.scelta==="auto"&&this.applica()};this._mq.addEventListener&&this._mq.addEventListener("change",e)}this.applica()}get automatico(){return!!(this._mq&&this._mq.matches)}get aTocco(){return this.scelta==="tocco"?!0:this.scelta==="mouse"?!1:this.automatico}cicla(){this.scelta=this.scelta==="auto"?"tocco":this.scelta==="tocco"?"mouse":"auto";try{localStorage.setItem(mi,this.scelta)}catch{}this.applica()}applica(){let t=this.aTocco;document.documentElement.classList.toggle(Mr,t),this.nodo.classList.toggle("fissato",this.scelta!=="auto"),this.nodo.innerHTML=t?"<b>\u{1F4F1}</b> a dito":"<b>\u{1F5A5}</b> col mouse",this.nodo.title=this.scelta==="auto"?`Interfaccia: automatica (adesso ${t?"a dito":"col mouse"}) \u2014 tocca per fissarla`:`Interfaccia: ${t?"a dito":"col mouse"}, fissata \u2014 tocca per cambiare`,this.onCambio&&this.onCambio(t)}};function hi(i={}){let t=(o,e=1)=>typeof o=="number"&&isFinite(o)?+o.toFixed(e):null;return{quando:i.quando||null,gioco:"Leafy-Shadows",versione:i.versione||"in sviluppo",nota:typeof i.nota=="string"?i.nota.slice(0,400):"",dispositivo:{classe:i.mobile?"mobile":"desktop",tocco:!!i.tocco,modoGui:i.modoGui||"auto",ua:(i.ua||"").slice(0,220),cpu:i.cpu||null,memoriaGB:i.memoriaGB||null},schermo:{css:i.css||null,reso:i.reso||null,dpr:t(i.dpr,3),rapporto:i.css&&i.reso&&i.css[0]?t(i.reso[0]/i.css[0],2):null},qualita:{livello:i.livello,di:i.quantiLivelli,manuale:!!i.manuale,profilo:i.profilo||null,ombreLampade:!!i.ombreLampade,antialias:!!i.antialias},prestazioni:{fps:t(i.fps,0),p50ms:t(i.p50,2),p99ms:t(i.p99,2),disegni:i.disegni??null,triangoli:i.triangoli??null,ombreMs:t(i.ombreMs,2),storiaFps:Array.isArray(i.storiaFps)?i.storiaFps.slice(-60).map(o=>Math.round(o)):[],storiaLivelli:Array.isArray(i.storiaLivelli)?i.storiaLivelli.slice(-20):[]},scheda:{nome:(i.scheda||"").slice(0,120),software:!!i.software},mondo:{chunk:i.chunk??null,blocchi:i.blocchi??null,luci:i.luci??null,decorazioni:i.decorazioni??null,erba:i.erba??null,ora:i.ora||null,giorno:i.giorno??null,worldgenMs:t(i.worldgenMs,0),meshMs:t(i.meshMs,0)},errori:(i.errori||[]).slice(-12).map(o=>String(o).slice(0,500)),scatto:i.scatto||null,firma:"leafy-shadows/1",allegati:i.allegati&&typeof i.allegati=="object"?i.allegati:null}}function gi(i){return Math.round(JSON.stringify(i).length/1024)}var Tr="https://ntfy.sh",_r="leafy-shadows-ebdbbfaf5376beedb3";async function vi(i){let t=await fetch(`${Tr}/${_r}`,{method:"POST",headers:{"x-title":"Leafy-Shadows","x-filename":"rapporto.json"},body:i});if(!t.ok)return{ok:!1,dice:`il servizio ha detto no: ${t.status}`};let o=await t.json().catch(()=>({})),e=i.length>4096;return{ok:!0,id:o.id||"",dice:e?`mandato \u2714 (${Math.round(i.length/1024)} KB, come allegato: dura 3 ore)`:`mandato \u2714 (${Math.round(i.length/1024)} KB, dura 12 ore)`}}var Cr=`
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

#diagPanel .righe { display: flex; gap: 8px; }
#diagPanel button { flex: 1; padding: 11px; border-radius: 8px; cursor: pointer;
  border: 1px solid rgba(13,42,26,.22); background: #fff; font: 13px system-ui, sans-serif; }
#diagPanel button.primo { background: #0d2a1a; color: #fff; border-color: #0d2a1a; }
#diagPanel .esito { margin-top: 8px; font: 12px ui-monospace, monospace; white-space: pre-wrap; }
`,go=class{constructor(t,o){this.leggi=t,this.scatta=o,this.errori=[],addEventListener("error",a=>this._errore(a.error||a.message)),addEventListener("unhandledrejection",a=>this._errore(a.reason));let e=document.createElement("style");e.textContent=Cr,document.head.appendChild(e),this.nodo=document.createElement("div"),this.nodo.id="diag",this.nodo.innerHTML="<b>\u{1FA7A}</b> diagnosi",this.nodo.title="Manda la diagnostica",document.body.appendChild(this.nodo),this.nodo.addEventListener("click",()=>this.apri()),this.pannello=document.createElement("div"),this.pannello.id="diagPanel",document.body.appendChild(this.pannello)}_errore(t){let o=t&&t.stack?t.stack:String(t);this.errori.push(o),this.errori.length>40&&this.errori.shift()}allega(t,o){this.allegati||(this.allegati={}),this.allegati[t]=o}apri(){let t=this.pannello;t.classList.add("aperto"),t.innerHTML=`
      <h4>Manda la diagnostica</h4>
      <p>Numeri, storia degli fps, errori e uno scatto. Niente di personale.${this.allegati?" <b>Con i risultati dell'omega test.</b>":""}</p>
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
      <div class="righe">
        <button class="primo" id="diagVai">Manda</button>
        <button id="diagCopia">Copia</button>
        <button id="diagChiudi">Chiudi</button>
      </div>
      <div class="esito" id="diagEsito"></div>`,t.querySelector("#diagChiudi").onclick=()=>t.classList.remove("aperto"),t.querySelector("#diagCopia").onclick=()=>this.vai(!0),t.querySelector("#diagVai").onclick=()=>this.vai(!1),setTimeout(()=>{let o=t.querySelector("#diagNota");o&&o.focus()},30)}_dice(t){let o=this.pannello.querySelector("#diagEsito");o&&(o.textContent=t)}async vai(t){let o=(this.pannello.querySelector("#diagNota")||{}).value||"";this.nodo.classList.add("corso"),this._dice("preparo\u2026");let e=(this.pannello.querySelector("#diagScatto")||{}).checked!==!1,a=null;if(e)try{a=this.scatta?await this.scatta():null}catch(c){this._errore(c)}let n=hi({...this.leggi(),quando:new Date().toISOString(),nota:o,errori:this.errori,scatto:a,allegati:this.allegati||null}),r=gi(n),s=JSON.stringify(n,null,1);if(t){await this._negliAppunti(s),this.nodo.classList.remove("corso");return}let l=!1;try{let c=await fetch("/_diagnostica",{method:"GET"});l=c.ok&&(await c.json().catch(()=>({}))).collettore===!0}catch{l=!1}if(l)try{let c=await fetch("/_diagnostica",{method:"POST",headers:{"content-type":"application/json"},body:s});if(!c.ok)this._dice("il collettore ha detto no: "+c.status);else{let u=await c.json().catch(()=>({}));this._dice(`mandato in casa \u2714  ${u.nome||""}  (${r} KB)`),setTimeout(()=>this.pannello.classList.remove("aperto"),1600)}this.nodo.classList.remove("corso");return}catch{}try{let c=await vi(s);this._dice(c.ok?c.dice+`
(fuori casa: passa dal cloud)`:c.dice),c.ok&&setTimeout(()=>this.pannello.classList.remove("aperto"),2200)}catch{await this._negliAppunti(s,"niente rete. ")}this.nodo.classList.remove("corso")}async _negliAppunti(t,o=""){try{await navigator.clipboard.writeText(t),this._dice(o+`copiato negli appunti \u2714
incollalo nella chat.`)}catch{let e=new Blob([t],{type:"application/json"}),a=document.createElement("a");a.href=URL.createObjectURL(e),a.download="leafy-diagnostica.json",a.click(),setTimeout(()=>URL.revokeObjectURL(a.href),4e3),this._dice(o+`scaricato come file \u2714
mandami quello.`)}}};var yr=4,vo=class{constructor(t,o,{margineGenera:e=2*M,margineTieni:a=6*M,onGenerato:n=null}={}){this.onGenerato=n,this.mondo=t,this.genera=o,this.margineGenera=e,this.margineTieni=a,this._coda=[],this._chunkOsservatore=null,this.statistiche={generati:0,scaricati:0,inCoda:0,ultimaMs:0},t.frontiera=this}assicura(t,o,e,{subito:a=!1}={}){let n=performance.now(),r=Math.floor(t/M),s=Math.floor(o/M),l=r+","+s,c=e&&Number.isFinite(e.resa)?e.resa:4*M;(l!==this._chunkOsservatore||a)&&(this._chunkOsservatore=l,this._riesamina(r,s,t,o,c));let u=0,d=a?1/0:yr;for(;this._coda.length&&u<d;){let f=this._coda.shift();this.mondo.generati.has(f)||(this._generaChunk(f),u++)}return this.statistiche.inCoda=this._coda.length,this.statistiche.ultimaMs=performance.now()-n,u}_riesamina(t,o,e,a,n){let r=n+this.margineGenera,s=n+this.margineTieni,l=Math.ceil(r/M)+1,c=[];for(let u=-l;u<=l;u++)for(let d=-l;d<=l;d++){let f=t+u+","+(o+d);if(this.mondo.generati.has(f))continue;let p=bi(t+u,o+d,e,a);p<=r&&c.push([p,f])}c.sort((u,d)=>u[0]-d[0]),this._coda=c.map(u=>u[1]);for(let u of[...this.mondo.generati]){let d=u.indexOf(",");bi(+u.slice(0,d),+u.slice(d+1),e,a)>s&&this._scaricaChunk(u)}}_generaChunk(t){let o=t.indexOf(","),e=+t.slice(0,o),a=+t.slice(o+1),n=this.genera(this.mondo,e,a)||[];this.mondo.segnaGenerato(t);let r=this.mondo.modifiche.get(t);for(let[s,l,c,u]of n)r&&r.has(Ei(s,l,c))||(this.mondo.metti(s,l,c,u),this.mondo.modifiche.get(t)?.delete(Ei(s,l,c)));this.mondo.applicaModifiche(t),this.statistiche.generati++,this.onGenerato&&this.onGenerato(t,e,a)}_scaricaChunk(t){let o=this.mondo.scaricaChunk(t);if(this.mondo.onEvento)for(let[e,a,n]of o)this.mondo.onEvento({tipo:"togli",cella:[e,a,n]});this.statistiche.scaricati++}};function bi(i,t,o,e){let a=i*M,n=t*M,r=Math.max(a-o,0,o-(a+M)),s=Math.max(n-e,0,e-(n+M));return Math.sqrt(r*r+s*s)}var xi=2048,Sr=64,Ei=(i,t,o)=>((i+xi)*4096+(o+xi))*256+(t+Sr);at();function la(i,t,o){let e=(i|0)*374761393+(t|0)*668265263+(o|0)*2147483647;return e=(e^e>>>13)*1274126177,e=e^e>>>16,(e>>>0)%1e3/1e3}function Lr(i,t){let o=i>>16&255,e=i>>8&255,a=i&255,n=r=>Math.max(0,Math.min(255,Math.round(r*(1+t))));return n(o)<<16|n(e)<<8|n(a)}function Or(i,t,o,e,a,n){if(!t||t==="liscio"||!o)return i;let r=0;return t==="chiazze"?r=(la(e,a,n)-.5)*2:t==="venature"?r=(la(0,a,0)-.5)*2*.7+(la(e,a,n)-.5)*.3:t==="sfumato"&&(r=(a%16+16)%16/16-.5),Lr(i,r*o*.34)}function Ai(i,t,o,e,a,n){if(!t||t==="liscio"||!o)return i;let r=s=>Or(s,t,o,e,a,n);return{cima:r(i.cima),lato:r(i.lato),fondo:r(i.fondo),facce:i.facce?i.facce.map(r):null}}var zi={metallo:{tinta:.82,satura:.55,orlo:.18,curva:1,glintR:.34,emiss:0,bagna:.2,sotto:0,riflette:.15},fango:{tinta:.72,satura:1.35,orlo:0,curva:-1,glintR:.48,emiss:0,bagna:1,sotto:0,riflette:0},ghiaccio:{tinta:1.06,satura:.62,orlo:.12,curva:.6,glintR:.3,emiss:0,bagna:.4,sotto:.3,riflette:.25},accesa:{tinta:1,satura:1,orlo:0,curva:0,glintR:0,emiss:1,bagna:0,sotto:0,riflette:0},specchio:{tinta:.95,satura:.35,orlo:.1,curva:1,glintR:.3,emiss:0,bagna:0,sotto:0,riflette:.55}},Ir=Object.keys(zi);function Mi(i){return!i||!i.materia?null:zi[i.materia]||null}function Yt(i,t,o=0){if(!t)return i;let e=(i>>16&255)/255,a=(i>>8&255)/255,n=(i&255)/255,r=.2126*e+.7152*a+.0722*n,s=t.satura;e=r+(e-r)*s,a=r+(a-r)*s,n=r+(n-r)*s;let l=t.tinta*(1+o),c=u=>Math.max(0,Math.min(255,Math.round(u*l*255)));return c(e)<<16|c(a)<<8|c(n)}var Rr=16;function Re(i){let t=Ir.indexOf(i);return t<0||t+1>=Rr?0:t+1}var ua=1/16,Ti=8*ua,St=9*ua;function _i(i,t,o,e,a,n,r,s){let l=(u,d,f)=>[t+u,o+d,e+f];i.quad(l(-s,r,-s),l(s,r,-s),l(s,r,s),l(-s,r,s),Gt(a,1,1),[0,1,0]),i.quad(l(-s,n,-s),l(s,n,-s),l(s,n,s),l(-s,n,s),Gt(a,1,-1),[0,-1,0]);let c=[{d:[1,0,0],asse:0,segno:1},{d:[-1,0,0],asse:0,segno:-1},{d:[0,0,1],asse:2,segno:1},{d:[0,0,-1],asse:2,segno:-1}];for(let u of c){let[d,,f]=u.d,p=-f,m=d,h=(g,v)=>l(d*s+p*v,g,f*s+m*v);i.quad(h(n,-s),h(r,-s),h(r,s),h(n,s),Gt(a,u.asse,u.segno),u.d)}}function Nr(i,t,o,e,a){_i(i,t,o,e,a,-St,0,Ti)}function qr(i,t,o,e,a){_i(i,t,o,e,a,-St,St,5*ua)}function wr(i,t,o,e,a){let n=(c,u,d)=>[t+c,o+u,e+d],r=Gt(a,0,1),s=Ti,l=[[[-s,-St,-s],[s,-St,s],[s,St,s],[-s,St,-s],[1,0,-1]],[[-s,-St,s],[s,-St,-s],[s,St,-s],[-s,St,s],[1,0,1]]];for(let[c,u,d,f,p]of l)i.quad(n(...c),n(...u),n(...d),n(...f),r,p),i.quad(n(...c),n(...u),n(...d),n(...f),r,[-p[0],-p[1],-p[2]])}function Pr(){}var Ci={lastra:Nr,pilastro:qr,croce:wr,modello:Pr},Qt=new Set(["lastra","pilastro","croce","modello"]);var Ne=1/16,Fr=[[0,1],[0,2],[1,2]],Dr=[[1,0],[-1,0],[0,1],[0,-1]];function Zt(i,t,o,e,a,n,r,s,l){let c=[i,t,o];return c[e]+=a,c[n]+=r,c[s]+=l,c}var yi={tinta:1,satura:1};function Si(i,t,o,e,a,n,r=0){let s=8*Ne,l=9*Ne,c=(u,d)=>n(u===0?d:0,u===1?d:0,u===2?d:0);for(let u=0;u<3;u++)for(let d of[-1,1]){if(c(u,d))continue;let f=(u+1)%3,p=(u+2)%3,m=Gt(a,u,d),h=[0,0,0];h[u]=d,i.quad(Zt(t,o,e,u,d*l,f,-s,p,-s),Zt(t,o,e,u,d*l,f,+s,p,-s),Zt(t,o,e,u,d*l,f,+s,p,+s),Zt(t,o,e,u,d*l,f,-s,p,+s),m,h)}for(let[u,d]of Fr){let f=3-u-d;for(let p of[-1,1])for(let m of[-1,1]){if(c(u,p)||c(d,m))continue;let h=u===1&&p>0||d===1&&m>0,g=u===1&&p<0||d===1&&m<0,v=h?a.cima:g?a.fondo:a.lato,b=r?Yt(v,yi,r):v,x=[0,0,0];x[u]=p,x[d]=m,i.quad(Zt(t,o,e,u,p*l,d,m*s,f,-s),Zt(t,o,e,u,p*s,d,m*l,f,-s),Zt(t,o,e,u,p*s,d,m*l,f,+s),Zt(t,o,e,u,p*l,d,m*s,f,+s),b,x)}}for(let u of[-1,1])for(let d of[-1,1])for(let f of[-1,1])c(0,u)||c(1,d)||c(2,f)||i.tri([t+u*l,o+d*s,e+f*s],[t+u*s,o+d*l,e+f*s],[t+u*s,o+d*s,e+f*l],r?Yt(d>0?a.cima:a.fondo,yi,r):d>0?a.cima:a.fondo,[u,d,f])}function Li(i,t,o,e,a,n){let r=(p,m)=>n(p,0,m),s=n(0,-1,0),l=a.cima,c=a.lato,u=a.fondo,d=a.orlo??a.cima,f=(p,m,h)=>[t+p*Ne,o+m*Ne,e+h*Ne];s||i.quad(f(-8,-9,-8),f(8,-9,-8),f(8,-9,8),f(-8,-9,8),u,[0,-1,0]);for(let[p,m]of Dr){if(r(p,m))continue;let h=-m,g=p,v=(x,z,A)=>f(x*p+A*h,z,x*m+A*g),b=[p,0,m];s||i.quad(v(8,-9,-8),v(9,-8,-8),v(9,-8,8),v(8,-9,8),u,[p,-1,m]),i.quad(v(9,-8,-8),v(9,2,-8),v(9,2,8),v(9,-8,8),c,b),i.quad(v(9,2,-8),v(10,3,-8),v(10,3,8),v(9,2,8),d,b),i.quad(v(10,3,-8),v(10,7,-8),v(10,7,8),v(10,3,8),d,b),i.quad(v(10,7,-8),v(9,8,-8),v(9,8,8),v(10,7,8),l,[p,1,m]),i.quad(v(8,8,-8),v(9,8,-8),v(9,8,8),v(8,8,8),l,[0,1,0])}for(let p of[-1,1])for(let m of[-1,1]){if(r(p,0)||r(0,m))continue;let h=(v,b,x)=>f(v*p,b,x*m),g=[p,0,m];s||i.tri(h(9,-8,8),h(8,-9,8),h(8,-8,9),u,[p,-1,m]),i.quad(h(9,-8,8),h(8,-8,9),h(8,2,9),h(9,2,8),c,g),i.quad(h(9,2,8),h(8,2,9),h(8,3,10),h(10,3,8),d,g),i.quad(h(10,3,8),h(8,3,10),h(8,7,10),h(10,7,8),d,g),i.quad(h(10,7,8),h(8,7,10),h(8,8,9),h(9,8,8),l,[p,1,m]),i.tri(h(8,8,8),h(9,8,8),h(8,8,9),l,[0,1,0])}i.quad(f(-8,8,-8),f(8,8,-8),f(8,8,8),f(-8,8,8),l,[0,1,0])}at();at();var Ur=2,qe=6,Br=256;function Oi(i){if(!i)return!1;let t=w(i);return!t.acqua&&!t.vetro&&!Qt.has(t.forma)}function Ri(i,t,o,e){let a=t.indexOf(","),n=+t.slice(0,a),r=+t.slice(a+1),s=n*M-qe,l=r*M-qe,c=M+2*qe,u=e-o+1,d=c,f=c*u*d,p=new Uint8Array(f),m=new Uint8Array(f),h=new Uint8Array(f),g=(A,T,I)=>((A-s)*u+(T-o))*d+(I-l),v=(A,T,I)=>A>=s&&A<s+c&&T>=o&&T<=e&&I>=l&&I<l+d,b=[];for(let A=s;A<s+c;A++)for(let T=l;T<l+d;T++){let I=!1;for(let q=e;q>=o;q--){let L=i.tipo(A,q,T),R=g(A,q,T);if(Oi(L)){h[R]=1,I=!0;continue}if(!I&&q===e){for(let P=e+1;P<Br&&P<e+40;P++)if(Oi(i.tipo(A,P,T))){I=!0;break}}if(I||(p[R]=15),L){let P=w(L);P.luce&&b.push([A,q+Math.round(P.luce.quota??0),T])}}}let x=[];for(let A=0;A<f;A++)p[A]===15&&x.push(A);Ii(x,p,h,c,u,d,1);let z=[];for(let[A,T,I]of b){if(!v(A,T,I))continue;let q=g(A,T,I);m[q]=15,z.push(q)}return Ii(z,m,h,c,u,d,Ur),{x0:s,z0:l,yMin:o,yMax:e,W:c,H:u,D:d,cielo:p,blocco:m,leggi(A,T,I){if(!v(A,T,I))return T>e?[15,0]:[0,0];let q=g(A,T,I);return[p[q],m[q]]}}}function Ii(i,t,o,e,a,n,r){let s=[a*n,-a*n,n,-n,1,-1],l=0;for(;l<i.length;){let c=i[l++],u=t[c]-r;if(u<=0)continue;let d=Math.floor(c/(a*n)),f=Math.floor(c/n)%a,p=c%n;for(let m=0;m<6;m++){if(m===0&&d===e-1||m===1&&d===0||m===2&&f===a-1||m===3&&f===0||m===4&&p===n-1||m===5&&p===0)continue;let h=c+s[m];o[h]||t[h]>=u||(t[h]=u,i.push(h))}}}var Ni=[{n:5,largo:.15,alto:.32,apri:.42},{n:4,largo:.12,alto:.5,apri:.34},{n:7,largo:.1,alto:.38,apri:.46},{n:3,largo:.18,alto:.28,apri:.3}];function Pt(i,t,o){let e=i*374761393+t*668265263+o*1442695041|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}var bo=class{constructor(t,o=512){this.yBase=t,this.byte=new Uint8Array(o*12),this.n=0}_lamella(t,o,e,a,n,r,s,l,c,u=0,d=8){if((this.n+1)*12>this.byte.length){let m=new Uint8Array(this.byte.length*2);m.set(this.byte),this.byte=m}let f=this.n*12,p=this.byte;p[f]=t,p[f+1]=o,p[f+2]=e,p[f+3]=a,p[f+4]=n>>16&255,p[f+5]=n>>8&255,p[f+6]=n&255,p[f+7]=(r&15)<<2,p[f+8]=Math.max(1,Math.min(255,s)),p[f+9]=Math.max(1,Math.min(255,l)),p[f+10]=Math.max(0,Math.min(255,c+128)),p[f+11]=u&15|(d&15)<<4,this.n++}ciuffo(t,o,e,a,n,r,s,l=1,c=0){let u=Ni[Math.floor(Pt(t,e,3)*Ni.length)],d=Math.max(1,Math.round(u.n*l*(.82+.36*Pt(t,e,5)))),f=o+1-this.yBase;if(f<0||f*8>247)return 0;for(let p=0;p<d;p++){let m=Pt(t,e,p*17+5),h=Pt(t,e,p*17+11),g=Pt(t,e,p*17+41),v=Pt(t,e,p*17+59),b=Math.min(.98,.66+u.apri),x=t+.5+(m-.5)*b,z=e+.5+(h-.5)*b,A=Math.min(.8,u.alto*(.62+.8*Pt(t,e,p*17+71))*(.5+.6*Math.pow(g,1.5))),T=u.largo*(.8+.4*v),I=(Pt(t,e,p*17+83)-.5)*.5,q=Pt(t,e,p*17+89),L=q<.15?.9+.03*q:q>.85?1.07+.03*(q-.85):.97+.06*(q-.15)/.7,R=Math.max(0,Math.min(128,Math.round((x-a)*8))),P=Math.max(0,Math.min(128,Math.round((z-n)*8))),S=Math.floor(Pt(t,e,p*17+97)*255);this._lamella(R,P,Math.round(f*8),S,r,s,Math.round(A*64),Math.round(T*128),Math.round(I*128),c,Math.round((L-.9)/.2*15))}return d}dati(){return{byte:this.byte.subarray(0,this.n*12),vertici:this.n*6,fili:this.n,yBase:this.yBase}}};var pe=64,kr=[[1,0,0,ft(1,0,0),0,1],[-1,0,0,ft(-1,0,0),0,-1],[0,1,0,ft(0,1,0),1,1],[0,-1,0,ft(0,-1,0),1,-1],[0,0,1,ft(0,0,1),2,1],[0,0,-1,ft(0,0,-1),2,-1]],qi=(i,t,o)=>((t+1)*3+(o+1))*3+(i+1),fa=class{constructor(t,o,e,a,n){this.c=t,this.ox=o,this.oz=e,this._materia=0,this.luceDi=a,this.aria=n,this._cielo=15,this._cella=null}materia(t){this._materia=t|0}cella(t,o,e){this._cella=[t,o,e]}_cieloFaccia(t){let[o,e,a]=this._cella,n=-1;for(let r=0;r<3;r++){if(!t[r])continue;let s=this.luceDi(o+(r===0?t[0]:0),e+(r===1?t[1]:0),a+(r===2?t[2]:0))[0];s>n&&(n=s)}return n<0?this.luceDi(o,e+1,a)[0]:n}_bloccoVertice(t,o){let e=Math.hypot(o[0],o[1],o[2])||1,a=t[0]+o[0]/e*.5,n=t[1]+o[1]/e*.5,r=t[2]+o[2]/e*.5,s=0,l=0;for(let c of[-.45,.45])for(let u of[-.45,.45])for(let d of[-.45,.45]){let f=Math.floor(a+c),p=Math.floor(n+u),m=Math.floor(r+d);this.aria(f,p,m)&&(s+=this.luceDi(f,p,m)[1],l++)}return l?Math.round(s/l):0}_v(t,o,e,a){return[t[0]-this.ox,t[1]+pe,t[2]-this.oz,o,this._cielo,this._bloccoVertice(t,a),e,0,this._materia]}_giro(t,o,e,a){let n=o[0]-t[0],r=o[1]-t[1],s=o[2]-t[2],l=e[0]-t[0],c=e[1]-t[1],u=e[2]-t[2],d=r*u-s*c,f=s*l-n*u,p=n*c-r*l;return d*a[0]+f*a[1]+p*a[2]<0}tri(t,o,e,a,n){if(this._giro(t,o,e,n)){let s=o;o=e,e=s}let r=ft(n[0],n[1],n[2]);this._cielo=this._cieloFaccia(n),this.c.quadDa(this._v(t,r,a,n),this._v(o,r,a,n),this._v(e,r,a,n),this._v(e,r,a,n))}quad(t,o,e,a,n,r){let s=ft(r[0],r[1],r[2]);if(this._cielo=this._cieloFaccia(r),this._giro(t,o,e,r)){let l=o;o=a,a=l}this.c.quadDa(this._v(t,s,n,r),this._v(o,s,n,r),this._v(e,s,n,r),this._v(a,s,n,r))}};function xo(i){if(!i)return!1;let t=w(i);return!t.acqua&&!t.vetro&&!Qt.has(t.forma)}function wi(i){return!!i&&i.charCodeAt(0)===97&&i.startsWith("acqua")}function Pi(i,t,{erba:o=2,luce:e=!0}={}){let a=t.indexOf(","),n=+t.slice(0,a),r=+t.slice(a+1),s=n*M,l=r*M,c=new Se(1024),u=new Se(64),d=-1/0,f=new Int16Array(M*M).fill(-1),p=new Int16Array(M*M).fill(-1),m=new Int16Array(M*M).fill(-1),h=[],g=255,v=0,b=1/0,x=-1/0;i.perOgniDelChunk(t,(S,y)=>{y<b&&(b=y),y>x&&(x=y)});let z=e&&b<=x?Ri(i,t,b-2,x+3):null,A=new bo(Number.isFinite(b)?b:0),T=(S,y,_)=>z?z.leggi(S,y,_):[15,0],I=new fa(c,s,l,T,(S,y,_)=>!xo(i.tipo(S,y,_))),q=new Uint8Array(27),L=(S,y,_,U,D,W,N,Z)=>[S-s,y+pe,_-l,U,W,N,D,Z?1:0,0],R=(S,y,_)=>wi(i.tipo(S,y,_))||(i.bagnate?i.bagnata(S,y,_)!==null:!1);return i.perOgniDelChunk(t,(S,y,_,U)=>{let D=w(U),W=i.bagnate?i.bagnata(S,y,_):null;if(D.forma==="modello"&&D.modello==="albero")for(let B=-2;B<=2;B++)for(let H=-2;H<=2;H++){let Q=B*B+H*H;if(Q>4)continue;let ot=S+B-s,It=_+H-l;if(ot<0||ot>=M||It<0||It>=M)continue;let ct=ot*M+It,tt=y+(Q===0?4:Q<=2?3:2);tt>f[ct]&&(f[ct]=tt)}if(D.forma==="modello"){let B=S-s,H=_-l;if(B>=0&&B<M&&H>=0&&H<M){let Q=B*M+H,ot=y+Math.max(1,Math.round(D.altezza||1));ot>m[Q]&&(m[Q]=ot)}}if(D.luce&&h.push([S,y,_,U]),Qt.has(D.forma)&&W===null)return;let N=wi(U)||W!==null,Z=y+pe;if(Z<0||Z>254)return;let mt=(S-s)*M+(_-l);!N&&y>f[mt]&&(f[mt]=y),!N&&xo(U)&&y>p[mt]&&(p[mt]=y);let nt=uo(W!==null?"acqua":Wt(U),y);D.motivo&&(nt=Ai(nt,D.motivo,D.motivoForza??1,S,y,_));let Et=Mi(D);Et&&(nt={...nt,cima:Yt(nt.cima,Et),lato:Yt(nt.lato,Et),fondo:Yt(nt.fondo,Et)},nt.facce&&(nt.facce=nt.facce.map(B=>B==null?B:Yt(B,Et))));let ye=Et?Re(D.materia):0;if(!N){q.fill(0);for(let ct=-1;ct<=1;ct++)for(let tt=-1;tt<=1;tt++)for(let lt=-1;lt<=1;lt++)lt===0&&ct===0&&tt===0||xo(i.tipo(S+lt,y+ct,_+tt))&&(q[qi(lt,ct,tt)]=1);let B=(ct,tt,lt)=>q[qi(ct,tt,lt)]===1;I.materia(ye),I.cella(S,y,_);let H=S+.5,Q=y+.5,ot=_+.5,It=D.forma&&Ci[D.forma];It?It(I,H,Q,ot,nt,()=>!1):D.cappello&&!B(0,1,0)?Li(I,H,Q,ot,nt,B):Si(I,H,Q,ot,nt,(tt,lt,$)=>B(tt,lt,$)?lt!==0?!0:!w(i.tipo(S+tt,y,_+$)).cappello||B(tt,1,$):!1,Et?Et.orlo:0),Z-1<g&&(g=Z-1),Z+2>v&&(v=Z+2)}let Vt=0,ne=0;if(N)for(ne=Math.max(0,Math.min(15,W!==null?W:Ct(U)||0));Vt<15&&R(S,y-1-Vt,_);)Vt++;let tr=(B,H)=>{if(!R(B,y,H))return-1;let Q=0;for(;Q<15&&R(B,y-1-Q,H);)Q++;return Q},Je=(B,H)=>{let Q=0,ot=0;for(let It of[B-1,B])for(let ct of[H-1,H]){let tt=tr(It,ct);tt>=0&&(Q+=tt,ot++)}return ot?Math.round(Q/ot):Vt};if(N)for(let[B,H,Q,ot,It,ct]of kr){let tt=i.tipo(S+B,y+H,_+Q);if(R(S+B,y+H,_+Q)||tt&&xo(tt))continue;let lt=Gt(nt,It,ct),$=S,X=y,j=_,Rt,Nt,qt,wt;if(B===1?(Rt=[$+1,X,j],Nt=[$+1,X+1,j],qt=[$+1,X+1,j+1],wt=[$+1,X,j+1]):B===-1?(Rt=[$,X,j+1],Nt=[$,X+1,j+1],qt=[$,X+1,j],wt=[$,X,j]):H===1?(Rt=[$,X+1,j],Nt=[$,X+1,j+1],qt=[$+1,X+1,j+1],wt=[$+1,X+1,j]):H===-1?(Rt=[$,X,j+1],Nt=[$,X,j],qt=[$+1,X,j],wt=[$+1,X,j+1]):Q===1?(Rt=[$+1,X,j+1],Nt=[$+1,X+1,j+1],qt=[$,X+1,j+1],wt=[$,X,j+1]):(Rt=[$,X,j],Nt=[$,X+1,j],qt=[$+1,X+1,j],wt=[$+1,X,j]),H===1){let Xa=y+(15-2*ne)/16;Xa>d&&(d=Xa)}u.quadDa(L(...Rt,ot,lt,Je(Rt[0],Rt[2]),ne,Rt[1]===X+1),L(...Nt,ot,lt,Je(Nt[0],Nt[2]),ne,Nt[1]===X+1),L(...qt,ot,lt,Je(qt[0],qt[2]),ne,qt[1]===X+1),L(...wt,ot,lt,Je(wt[0],wt[2]),ne,wt[1]===X+1)),Z<g&&(g=Z),Z+1>v&&(v=Z+1)}if(D.cappello&&o>0&&!i.tipo(S,y+1,_)){let[B,H]=T(S,y+1,_);A.ciuffo(S,y,_,s,l,nt.cima,B,o/2,H),y+2+pe>v&&(v=y+2+pe)}}),g>v&&(g=0,v=0),{...c.dati(),minY:g,maxY:v,y0:-pe,cx:n,cz:r,altezze:f,solide:p,impronte:m,luci:h,acqua:{...u.dati(),pelo:d===-1/0?null:d},erba:A.dati()}}var Eo=6,Ao=class{constructor(t,o,e,{erba:a=8,raggioResa:n=96,budgetMs:r=5,lavoro:s=null}={}){this.mondo=t,this.resa=o,this.erba=a,this.raggioResa=n,this.budgetMs=r,this.lavoro=s,this._marca=new Map,this._vuoti=new Set,this.frontiera=new vo(t,e,{margineGenera:2*M,margineTieni:5*M,onGenerato:(l,c,u)=>{for(let d=-1;d<=1;d++)for(let f=-1;f<=1;f++){if(!d&&!f)continue;let p=c+d+","+(u+f);this.resa.chunks.has(p)&&(this.coda.add(p),this.statistiche.rifattiPerLuce++)}}}),this.coda=new Set,this.statistiche={inCoda:0,costruiti:0,scaricati:0,ultimaMs:0,chunk:0,inVolo:0,rifattiPerLuce:0},this._ordine=[]}avvio(t,o){this.frontiera.assicura(t,o,{resa:this.raggioResa},{subito:!0}),this.aggiorna(t,o,1/0)}tocca(t,o){for(let e of[-Eo,0,Eo])for(let a of[-Eo,0,Eo])this.coda.add(Math.floor((t+e)/M)+","+Math.floor((o+a)/M))}aggiorna(t,o,e=this.budgetMs){let a=performance.now(),n=this.mondo,r=this.resa;this.frontiera.assicura(t,o,{resa:this.raggioResa});for(let s of n.sporchi)this.coda.add(s),this._vuoti.delete(s);n.sporchi.clear();for(let s of n.sporchiAcqua)this.coda.add(s);n.sporchiAcqua.clear();for(let s of n.generati)!r.chunks.has(s)&&!this._vuoti.has(s)&&!(this.lavoro&&this.lavoro.inVolo.has(s))&&this.coda.add(s);for(let s of[...r.chunks.keys()])n.generati.has(s)||(r.rimuovi(s),this.coda.delete(s),this.statistiche.scaricati++);if(this.coda.size){let s=this._ordine;s.length=0;for(let c of this.coda){let u=Vr(c,t,o);u<=this.raggioResa+M&&s.push([u,c])}s.sort((c,u)=>c[0]-u[0]);let l=0;this._vicini=s.length;for(let[,c]of s){if(!this.lavoro&&l>0&&performance.now()-a>e||this.lavoro&&this.lavoro.vivo&&this.lavoro.liberi===0)break;if(!(this.lavoro&&this.lavoro.vivo&&this.lavoro.inVolo.has(c))&&(this.coda.delete(c),!!n.generati.has(c))){if(!n.chunks.has(c)){r.chunks.has(c)&&r.rimuovi(c),this._vuoti.add(c),this._vicini--;continue}if(this.lavoro&&this.lavoro.vivo&&e!==1/0){let u=(this._marca.get(c)||0)+1;this._marca.set(c,u),this.lavoro.manda(n,c,this.erba,u)===null&&r.chunks.has(c)&&r.rimuovi(c),l++;continue}r.carica(c,Pi(n,c,{erba:this.erba})),l++,this.statistiche.costruiti++}}this._vicini-=l}else this._vicini=0;if(this.lavoro&&this.lavoro.vivo){for(let{kc:s,dati:l,marca:c}of this.lavoro.raccogli())if(n.generati.has(s)){if(this._marca.get(s)!==c){this.coda.add(s);continue}this.coda.has(s)||(r.carica(s,l),this.statistiche.costruiti++)}this.statistiche.inVolo=this.lavoro.inVolo.size}this.statistiche.inCoda=this._vicini,this.statistiche.ultimaMs=performance.now()-a,this.statistiche.chunk=r.chunks.size}};function Vr(i,t,o){let e=i.indexOf(",");return Math.hypot(+i.slice(0,e)*M+M/2-t,+i.slice(e+1)*M+M/2-o)}var zo=class{constructor(t,{alpha:o=0,beta:e=-.25,sensibilita:a=.0042}={}){this.alpha=o,this.beta=e,this.sensibilita=a,this.trascinato=0,this.fermo=!1,this.attivo=null,t.addEventListener("pointerdown",r=>{if(this.attivo===null){this.attivo=r.pointerId,this.trascinato=0,this._x=r.clientX,this._y=r.clientY;try{t.setPointerCapture(r.pointerId)}catch{}}}),t.addEventListener("pointermove",r=>{if(document.pointerLockElement===t){this._gira(r.movementX,r.movementY);return}if(r.pointerId!==this.attivo)return;let s=r.clientX-this._x,l=r.clientY-this._y;this._x=r.clientX,this._y=r.clientY,!this.fermo&&(this.trascinato+=Math.hypot(s,l),this._gira(s,l))});let n=r=>{r.pointerId===this.attivo&&(this.attivo=null)};t.addEventListener("pointerup",n),t.addEventListener("pointercancel",n),window.addEventListener("keydown",r=>{r.code==="KeyL"&&!/^(INPUT|TEXTAREA)$/.test(r.target&&r.target.tagName)&&(document.pointerLockElement===t?document.exitPointerLock():t.requestPointerLock&&t.requestPointerLock())})}_gira(t,o){this.alpha+=t*this.sensibilita,this.beta=Math.max(-1.45,Math.min(1.45,this.beta-o*this.sensibilita))}verso(){let t=Math.cos(this.beta);return[t*Math.sin(this.alpha),Math.sin(this.beta),-t*Math.cos(this.alpha)]}avantiPiano(){return{x:Math.sin(this.alpha),z:-Math.cos(this.alpha)}}};at();var Jt=1/60,Fi=4,Di=26,da=.32,Ui=.92,Bi=.995,Gr=.06,$r=20,me=.5,Xr=2.4,Hr=.9,Mo=class{constructor(t){this.mondo=t,this.lista=[],this._resto=0,this.statistiche={corpi:0,svegli:0,passi:0},this._griglia=new Map}aggiungi({x:t,y:o,z:e,vx:a=0,vy:n=0,vz:r=0,lato:s=.5,colore:l=[1,1,1],giro:c=0}){let u={x:t,y:o,z:e,vx:a,vy:n,vz:r,lato:s,colore:l,giro:c,aTerra:!1,sonno:0,dorme:!1,inAcqua:!1,sommerso:0};return this.lista.push(u),u}svuota(){this.lista.length=0}avanza(t){this._resto+=t;let o=0;for(;this._resto>=Jt&&o<Fi;)this._passo(),this._resto-=Jt,o++;return this._resto>Jt*Fi&&(this._resto=0),this.statistiche.passi+=o,o}_solido(t,o,e){return this.mondo.solido(Math.floor(t),Math.floor(o),Math.floor(e))}_urta(t,o,e,a){let n=a-.001;for(let r of[-n,n])for(let s of[-n,n])if(this._solido(t+r,o-n,e+s)||this._solido(t+r,o+n,e+s))return!0;return!1}_sommerso(t,o){let e=this.mondo;if(!e.tipo)return 0;let a=Math.floor(t.x),n=Math.floor(t.z),r=Math.floor(t.y+o),s=Math.floor(t.y-o)-1;for(let l=r;l>=s;l--){let c=e.tipo(a,l,n);if(!c)continue;let u=w(c);if(!u||!u.acqua)continue;let d=l+(15-2*(Ct(c)||0))/16;return Math.max(0,Math.min(1,(d-(t.y-o))/(2*o)))}return 0}_passo(){let t=this.lista,o=0;for(let e of t){if(e.dorme)continue;o++;let a=e.lato/2;e.vy-=Di*Jt;let n=this._sommerso(e,a);if(e.inAcqua=n>.02,e.sommerso=n,e.inAcqua){e.vy+=Di*Xr*n*Jt;let d=1-(1-Hr)*n;e.vx*=d,e.vy*=d,e.vz*=d}let r=Math.max(Math.abs(e.vx),Math.abs(e.vy),Math.abs(e.vz))*Jt,s=Math.max(1,Math.ceil(r/(a*.9))),l=Jt/s,c=!1;for(let d=0;d<s;d++){let f=e.x+e.vx*l;e.vx!==0&&(this._urta(f,e.y,e.z,a)&&(e.vx=-e.vx*da,f=e.x),e.x=f);let p=e.z+e.vz*l;e.vz!==0&&(this._urta(e.x,e.y,p,a)&&(e.vz=-e.vz*da,p=e.z),e.z=p);let m=e.y+e.vy*l;this._urta(e.x,m,e.z,a)?e.vy<0?(e.y=Math.floor(m-a+.001)+1+a,c=!0,e.vy=Math.abs(e.vy)>3?-e.vy*da:0):e.vy=0:e.y=m}e.aTerra=c||e.vy<=0&&this._urta(e.x,e.y-.02,e.z,a),e.aTerra?(e.vx*=Ui,e.vz*=Ui,e.vy<0&&(e.vy=0)):(e.vx*=Bi,e.vz*=Bi);let u=Math.hypot(e.vx,e.vy,e.vz);(e.aTerra||e.inAcqua)&&u<Gr?(e.vx=e.vz=0,e.inAcqua&&(e.vy=0),++e.sonno>=$r&&(e.dorme=!0)):e.sonno=0}this._vicini(),this.statistiche.corpi=t.length,this.statistiche.svegli=o}_vicini(){let t=this._griglia;t.clear();let o=this.lista,e=(a,n)=>a+32768<<16|n+32768;for(let a=0;a<o.length;a++){let n=o[a],r=e(Math.floor(n.x),Math.floor(n.z)),s=t.get(r);s||(s=[],t.set(r,s)),s.push(a)}for(let a=0;a<o.length;a++){let n=o[a],r=Math.floor(n.x),s=Math.floor(n.z);for(let l=-1;l<=1;l++)for(let c=-1;c<=1;c++){let u=t.get(e(r+l,s+c));if(u)for(let d of u){if(d<=a)continue;let f=o[d];if(n.dorme&&f.dorme)continue;let p=(n.lato+f.lato)/2,m=p-Math.abs(n.x-f.x);if(m<=0)continue;let h=p-Math.abs(n.y-f.y);if(h<=0)continue;let g=p-Math.abs(n.z-f.z);if(!(g<=0)){if(m<=h&&m<=g){let v=Math.sign(n.x-f.x)||1;n.x+=v*m*me,f.x-=v*m*me}else if(h<=g)(Math.sign(n.y-f.y)||1)>0?(n.y+=h*me,n.vy<0&&(n.vy=0)):(f.y+=h*me,f.vy<0&&(f.vy=0));else{let v=Math.sign(n.z-f.z)||1;n.z+=v*g*me,f.z-=v*g*me}n.dorme&&(n.dorme=!1,n.sonno=0),f.dorme&&(f.dorme=!1,f.sonno=0)}}}}}istanze(t=null){let o=this.lista.length;(!t||t.length!==o*8)&&(t=new Float32Array(o*8));for(let e=0;e<o;e++){let a=this.lista[e],n=e*8;t[n]=a.x,t[n+1]=a.y-a.lato/2,t[n+2]=a.z,t[n+3]=a.lato,t[n+4]=a.colore[0],t[n+5]=a.colore[1],t[n+6]=a.colore[2],t[n+7]=a.giro}return t}};at();ge();var Kr=256,At=8,Vi=16,Gi=(i,t)=>i+","+t,ma=(i,t,o)=>i+","+t+","+o,_o=class{constructor({varia:t=!0}={}){this.varia=t,this._n=Kr,this._dati=new Float32Array(this._n*At),this._id=new Int32Array(this._n),this._tipo=new Array(this._n).fill(null),this._slot=new Map,this._liberi=[],this._primo=0,this._prossimoId=1,this._perTipo=new Map,this._perChunk=new Map,this._chunk=new Map,this._perCella=new Map,this._cella=new Map,this._meta=new Map,this._nome=new Map,this.sporchi=new Set}_cresci(){let t=this._n*2,o=new Float32Array(t*At);o.set(this._dati);let e=new Int32Array(t);e.set(this._id),this._dati=o,this._id=e,this._tipo.length=t,this._tipo.fill(null,this._n),this._n=t}_prendiSlot(){return this._liberi.length?this._liberi.pop():(this._primo>=this._n&&this._cresci(),this._primo++)}aggiungi(t,o,e,a,{giro:n,scala:r,tinta:s,nome:l,dati:c,cella:u}={}){let d=this._prendiSlot(),f=this._prossimoId++;this._id[d]=f,this._slot.set(f,d),this._tipo[d]=t;let p=u?To(t,u[0],u[1],u[2],this.varia):{scala:1,giro:0,tinta:[1,1,1]},m=d*At;this._dati[m]=o,this._dati[m+1]=e,this._dati[m+2]=a,this._dati[m+3]=r??p.scala;let h=s||p.tinta;this._dati[m+4]=h[0],this._dati[m+5]=h[1],this._dati[m+6]=h[2],this._dati[m+7]=n??p.giro;let g=this._perTipo.get(t);if(g||(g=new Set,this._perTipo.set(t,g)),g.add(d),this._indicizza(d,o,a),u){let v=ma(u[0],u[1],u[2]);this._perCella.set(v,d),this._cella.set(d,v)}return l&&this._nome.set(d,l),c&&this._meta.set(d,{...c}),this.sporchi.add(t),f}togli(t){let o=this._slot.get(t);if(o===void 0)return!1;let e=this._tipo[o];this._perTipo.get(e).delete(o),this._sfila(o);let a=this._cella.get(o);return a!==void 0&&(this._perCella.delete(a),this._cella.delete(o)),this._meta.delete(o),this._nome.delete(o),this._slot.delete(t),this._id[o]=0,this._tipo[o]=null,this._liberi.push(o),this.sporchi.add(e),!0}_chunkDi(t,o){return Gi(Math.floor(t/Vi),Math.floor(o/Vi))}_indicizza(t,o,e){let a=this._chunkDi(o,e),n=this._perChunk.get(a);n||(n=new Set,this._perChunk.set(a,n)),n.add(t),this._chunk.set(t,a)}_sfila(t){let o=this._chunk.get(t);if(o===void 0)return;let e=this._perChunk.get(o);e&&(e.delete(t),e.size||this._perChunk.delete(o)),this._chunk.delete(t)}nelChunk(t,o){let e=this._perChunk.get(Gi(t,o));return e?[...e].map(a=>this._id[a]):[]}leggi(t){let o=this._slot.get(t);if(o===void 0)return null;let e=o*At;return{id:t,tipo:this._tipo[o],x:this._dati[e],y:this._dati[e+1],z:this._dati[e+2],scala:this._dati[e+3],tinta:[this._dati[e+4],this._dati[e+5],this._dati[e+6]],giro:this._dati[e+7],nome:this._nome.get(o)||null,dati:this._meta.get(o)||null}}posa(t,{x:o,y:e,z:a,giro:n,scala:r,tinta:s}={}){let l=this._slot.get(t);if(l===void 0)return!1;let c=l*At,u=o!==void 0||a!==void 0;return o!==void 0&&(this._dati[c]=o),e!==void 0&&(this._dati[c+1]=e),a!==void 0&&(this._dati[c+2]=a),r!==void 0&&(this._dati[c+3]=r),s&&(this._dati[c+4]=s[0],this._dati[c+5]=s[1],this._dati[c+6]=s[2]),n!==void 0&&(this._dati[c+7]=n),u&&(this._sfila(l),this._indicizza(l,this._dati[c],this._dati[c+2])),this.sporchi.add(this._tipo[l]),!0}metadati(t,o){let e=this._slot.get(t);return e===void 0?null:(o&&this._meta.set(e,{...this._meta.get(e)||{},...o}),this._meta.get(e)||null)}battezza(t,o){let e=this._slot.get(t);return e===void 0?!1:(o?this._nome.set(e,o):this._nome.delete(e),!0)}evento(t){let[o,e,a]=t.cella;if(t.tipo==="metti"){let n=w(t.blocco);if(!n||n.forma!=="modello"||!n.modello)return;this._dallaCella(o,e,a),this.aggiungi(n.modello,o+.5,e,a+.5,{cella:[o,e,a]})}else t.tipo==="togli"&&this._dallaCella(o,e,a)}_dallaCella(t,o,e){let a=this._perCella.get(ma(t,o,e));a!==void 0&&this.togli(this._id[a])}idInCella(t,o,e){let a=this._perCella.get(ma(t,o,e));return a===void 0?null:this._id[a]}cambiate(){let t=[];for(let o of this.sporchi){let e=this._perTipo.get(o),a=new Float32Array((e?e.size:0)*At),n=0;if(e)for(let r of e)a.set(this._dati.subarray(r*At,r*At+At),n),n+=At;t.push([o,a])}return this.sporchi.clear(),t}get conta(){return this._slot.size}quante(t){let o=this._perTipo.get(t);return o?o.size:0}tutte(){return[...this._slot.keys()]}tipiVivi(){return this._perTipo.keys()}ognunaDi(t,o){let e=this._perTipo.get(t);if(e)for(let a of e){let n=a*At;o(this._dati[n],this._dati[n+1],this._dati[n+2],this._id[a],this._dati[n+3],this._dati[n+7])}}perTipo(){let t=[];for(let[o,e]of this._perTipo)e.size&&t.push([o,e.size]);return t.sort((o,e)=>o[0].localeCompare(e[0])),t}serializza({tutto:t=!1}={}){let o=[];for(let[e,a]of this._slot){if(!t&&this._cella.has(a))continue;let n=a*At,r={id:e,tipo:this._tipo[a],p:[this._dati[n],this._dati[n+1],this._dati[n+2]],s:this._dati[n+3],g:this._dati[n+7]},s=[this._dati[n+4],this._dati[n+5],this._dati[n+6]];(s[0]!==1||s[1]!==1||s[2]!==1)&&(r.t=s);let l=this._nome.get(a);l&&(r.n=l);let c=this._meta.get(a);c&&(r.m=c),o.push(r)}return{versione:1,entita:o}}deserializza(t){if(!t||t.versione!==1||!Array.isArray(t.entita))throw new Error("pacco di entit\xE0 non riconosciuto");let o=0;for(let e of t.entita)this.aggiungi(e.tipo,e.p[0],e.p[1],e.p[2],{giro:e.g,scala:e.s,tinta:e.t,nome:e.n,dati:e.m}),o++;return o}};at();var Wr=4,Qr=33,Jr=26;function $i(i,t,o=0,e=!1,a=null,n=Wr){let r=t.indexOf(","),s=+t.slice(0,r),l=+t.slice(r+1),c=1/0,u=-1/0;if(i.perOgniDelChunk(t,(A,T)=>{T<c&&(c=T),T>u&&(u=T)}),c===1/0)return null;let d=s*M-n,f=l*M-n,p=c-Qr,m=M+2*n,h=m,g=u+Jr-p+1,v=new Uint16Array(m*g*h),b=[],x=new Map;for(let A=-1;A<=1;A++)for(let T=-1;T<=1;T++)i.perOgniDelChunk(s+A+","+(l+T),(I,q,L,R)=>{let P=I-d,S=q-p,y=L-f;if(P<0||P>=m||S<0||S>=g||y<0||y>=h)return;let _=x.get(R);_===void 0&&(_=b.push(R),x.set(R,_)),v[(P*g+S)*h+y]=_});let z={};for(let A of b){let T=Wt(A);T in z||(z[T]=et[T]||null)}return{kc:t,livello:o,soloAcqua:e,x0:d,y0:p,z0:f,nx:m,ny:g,nz:h,celle:v,tipi:b,defs:z,stagione:a||{corrente:ni(),mescolanza:ri()}}}var ha=class{constructor(t){this.operai=[],this.pronti=[],this.inVolo=new Map;for(let o=0;o<t;o++){let e=new Worker(new URL("./mesher-nucleo-worker.js",import.meta.url),{type:"module"}),a={w:e,occupato:null};e.onmessage=n=>{a.occupato=null,this.pronti.push(n.data)},e.onerror=n=>{console.warn("lavoro: un Worker si \xE8 fermato \u2014",n&&n.message),this.operai=this.operai.filter(r=>r!==a),a.occupato&&this.inVolo.delete(a.occupato);try{e.terminate()}catch{}},this.operai.push(a)}}get vivo(){return this.operai.length>0}get liberi(){return this.operai.filter(t=>!t.occupato).length}manda(t,o,e,a=0){let n=this.operai.find(s=>!s.occupato);if(!n)return!1;let r=$i(t,o,0,!1,null,qe);return r?(r.erba=e,r.marca=a,n.occupato=o,this.inVolo.set(o,a),n.w.postMessage(r,[r.celle.buffer]),!0):null}raccogli(){let t=this.pronti;this.pronti=[];for(let o of t)this.inVolo.delete(o.kc);return t}};function Xi(i=null){if(typeof Worker!="function")return null;let t=i??Math.max(1,Math.min(3,(globalThis.navigator&&navigator.hardwareConcurrency||2)-1));try{let o=new ha(t);return o.vivo?o:null}catch(o){return console.warn("lavoro: niente Worker \u2014",o&&o.message),null}}var ts=[[[0,0,1],[[0,0,1],[1,0,1],[1,1,1],[0,1,1]]],[[0,0,-1],[[1,0,0],[0,0,0],[0,1,0],[1,1,0]]],[[1,0,0],[[1,0,1],[1,0,0],[1,1,0],[1,1,1]]],[[-1,0,0],[[0,0,0],[0,0,1],[0,1,1],[0,1,0]]],[[0,1,0],[[0,1,1],[1,1,1],[1,1,0],[0,1,0]]],[[0,-1,0],[[0,0,0],[1,0,0],[1,0,1],[0,0,1]]]];function Hi(i,t){let o=i.perno||t,e=i.scala||[1,1,1],a=i.rot||[0,i.giro||0,0],[n,r]=[Math.cos(a[0]),Math.sin(a[0])],[s,l]=[Math.cos(a[1]),Math.sin(a[1])],[c,u]=[Math.cos(a[2]),Math.sin(a[2])],d=(f,p,m)=>{let h=p*n-m*r,g=p*r+m*n;p=h,m=g;let v=f*s+m*l;return g=-f*l+m*s,f=v,m=g,v=f*c-p*u,h=f*u+p*c,f=v,p=h,[f,p,m]};return{punto:f=>{let[p,m,h]=d((f[0]-o[0])*e[0],(f[1]-o[1])*e[1],(f[2]-o[2])*e[2]);return[p+o[0],m+o[1],h+o[2]]},normale:f=>{let[p,m,h]=d(f[0]/e[0],f[1]/e[1],f[2]/e[2]),g=Math.hypot(p,m,h)||1;return[p/g,m/g,h/g]}}}function Lt(i){let t=[],o=(u,d,f,p,m,h)=>{let g=Yi(u,d,f);t.push([g[0]*p[0]+g[1]*p[1]+g[2]*p[2]<0?[u,f,d]:[u,d,f],p,m,h])};for(let u of i){let d=u.colore??16777215,f=u.materia|0;if(u.tornio){let g=u.lati||8,v=u.tornio,b=u.x||0,x=u.z||0,z=Math.min(...v.map(L=>L[1])),A=Math.max(...v.map(L=>L[1])),T=Hi(u,[b,(z+A)/2,x]),I=(L,R)=>{let P=[];for(let S=0;S<g;S++){let y=S/g*Math.PI*2+(u.fase||0);P.push([b+Math.cos(y)*L,R,x+Math.sin(y)*L])}return P},q=v.map(([L,R])=>I(L,R));for(let L=0;L+1<v.length;L++){let R=q[L],P=q[L+1];for(let S=0;S<g;S++){let y=(S+1)%g,_=R[S],U=R[y],D=P[y],W=P[S];if(v[L][0]===0&&v[L+1][0]===0)continue;let N=(_[0]+U[0]+D[0]+W[0])/4-b,Z=(_[2]+U[2]+D[2]+W[2])/4-x,mt=Math.hypot(N,Z)||1,nt=v[L+1][0]-v[L][0],Et=v[L+1][1]-v[L][1],ye=Math.hypot(nt,Et)||1,Vt=[N/mt*(Et/ye),-nt/ye,Z/mt*(Et/ye)];v[L][0]>0&&v[L+1][0]>0?(o(_,U,D,Vt,d,f),o(_,D,W,Vt,d,f)):v[L][0]>0?o(_,U,D,Vt,d,f):o(_,D,W,Vt,d,f)}}if(v[0][0]>0&&!u.aperto){let L=q[0];for(let R=1;R+1<g;R++)o(L[0],L[R+1],L[R],[0,-1,0],d,f)}if(v[v.length-1][0]>0&&!u.aperto){let L=q[v.length-1];for(let R=1;R+1<g;R++)o(L[0],L[R],L[R+1],[0,1,0],d,f)}ga(t,T);continue}let p=[(u.da[0]+u.a[0])/2,(u.da[1]+u.a[1])/2,(u.da[2]+u.a[2])/2],m=Hi(u,p);if(u.piramide){let g=[[u.da[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.da[2]],[u.a[0],u.da[1],u.a[2]],[u.da[0],u.da[1],u.a[2]]],v=u.punta,b=[(u.da[0]+u.a[0])/2,u.da[1],(u.da[2]+u.a[2])/2];for(let x=0;x<4;x++){let z=g[x],A=g[(x+1)%4],T=Yi(z,v,A),I=[(z[0]+v[0]+A[0])/3-b[0],0,(z[2]+v[2]+A[2])/3-b[2]];o(z,v,A,T[0]*I[0]+T[2]*I[2]<0?[-T[0],-T[1],-T[2]]:T,d,f)}o(g[0],g[1],g[2],[0,-1,0],d,f),o(g[0],g[2],g[3],[0,-1,0],d,f),ga(t,m);continue}let h=g=>[g[0]?u.a[0]:u.da[0],g[1]?u.a[1]:u.da[1],g[2]?u.a[2]:u.da[2]];for(let[g,v]of ts){let b=g[0]?0:g[1]?1:2;if(u.a[b]===u.da[b])continue;let x=v.map(h);o(x[0],x[1],x[2],g,d,f),o(x[0],x[2],x[3],g,d,f)}ga(t,m)}let e=t.length*3,a=new Uint8Array(e*20),n=new DataView(a.buffer),r=0,s=1/0,l=-1/0,c=0;for(let[u,d,f,p]of t)for(let m of u){let h=r*20;n.setFloat32(h,m[0],!0),n.setFloat32(h+4,m[1],!0),n.setFloat32(h+8,m[2],!0),a[h+12]=Math.round(d[0]*127)&255,a[h+13]=Math.round(d[1]*127)&255,a[h+14]=Math.round(d[2]*127)&255,a[h+15]=p,a[h+16]=f>>16&255,a[h+17]=f>>8&255,a[h+18]=f&255,a[h+19]=255,s=Math.min(s,m[1]),l=Math.max(l,m[1]),c=Math.max(c,Math.hypot(m[0],m[2])),r++}return{byte:a,vertici:e,triangoli:t.length,minY:s,maxY:l,raggio:c}}function ga(i,t){for(let o=i.length-1;o>=0;o--){let e=i[o];if(e[4])break;e[0]=e[0].map(t.punto),e[1]=t.normale(e[1]),e[4]=!0}}function Yi(i,t,o,e=null){let a=e?[o[0]-i[0],o[1]-i[1],o[2]-i[2]]:[t[0]-i[0],t[1]-i[1],t[2]-i[2]],n=e?[e[0]-t[0],e[1]-t[1],e[2]-t[2]]:[o[0]-i[0],o[1]-i[1],o[2]-i[2]],r=a[1]*n[2]-a[2]*n[1],s=a[2]*n[0]-a[0]*n[2],l=a[0]*n[1]-a[1]*n[0],c=Math.hypot(r,s,l)||1;return[r/c,s/c,l/c]}var G=(i,t,o,e,a,n,r,s={})=>({da:[i-e/2,t,o-n/2],a:[i+e/2,t+a,o+n/2],colore:r,...s}),Ft=(i,t,o,e,a,n,r=0,s=0,l={})=>({piramide:!0,da:[i-e/2,t,o-e/2],a:[i+e/2,t,o+e/2],punta:[i+r,t+a,o+s],colore:n,...l}),k=(i,t,o,e,a={})=>({tornio:o,x:i,z:t,lati:8,colore:e,...a});at();ge();var Co={blu:{corpo:736622,pancia:533312,testa:431830,guance:691404,zampe:533312,orecchie:431830,dentro:3118826,occhi:16777215,pupille:727598,naso:533312,coda:736622},arancione:{corpo:14644537,pancia:13658672,testa:15901522,guance:15897452,zampe:16024454,orecchie:14644537,dentro:16024454,occhi:16777215,pupille:2759186,naso:16024454,coda:14644537}};function va(i=Co.blu,{zaino:t=!1}={}){let o=[k(0,.02,[[.14,0],[.27,.06],[.31,.24],[.28,.44],[.19,.58],[0,.62]],i.corpo,{fase:Math.PI/8,scala:[1,1,.82]}),k(-.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],i.zampe,{fase:Math.PI/8}),k(.21,-.2,[[0,0],[.08,.02],[.105,.08],[.08,.15],[0,.17]],i.zampe,{fase:Math.PI/8}),k(0,0,[[0,.52],[.3,.58],[.38,.74],[.36,.94],[.2,1.08],[0,1.11]],i.testa,{fase:Math.PI/8,scala:[1.12,1,.92]}),Ft(-.22,1.02,0,.17,.36,i.orecchie,-.03,0,{rot:[0,0,.18]}),Ft(.22,1.02,0,.17,.36,i.orecchie,.03,0,{rot:[0,0,-.18]}),Ft(-.22,1.05,-.03,.1,.24,i.dentro,-.02,0,{rot:[0,0,.18]}),Ft(.22,1.05,-.03,.1,.24,i.dentro,.02,0,{rot:[0,0,-.18]}),G(-.15,.74,-.352,.11,.15,.03,i.occhi),G(.15,.74,-.352,.11,.15,.03,i.occhi),G(-.115,.755,-.362,.032,.085,.02,i.pupille),G(.115,.755,-.362,.032,.085,.02,i.pupille),Ft(0,.72,-.35,.06,-.05,i.naso,0,0,{rot:[Math.PI/2,0,0],perno:[0,.72,-.35]}),k(.2,.22,[[.05,.05],[.055,.4],[0,.46]],i.coda,{rot:[.35,0,-.35],perno:[.2,.05,.22]})];return t&&(o.push(G(.06,.8,.44,.3,.3,.16,13777723,{rot:[0,0,.15]})),o.push(G(.06,.88,.53,.12,.12,.02,9279656,{rot:[0,0,.15]})),o.push(G(.3,.04,-.22,.06,.36,.06,13777723,{rot:[0,0,-.25],perno:[.3,.04,-.22]}))),Lt(o)}function es(){return Lt([k(-.08,-.02,[[.08,0],[.065,.1],[.075,.2]],16108701),k(-.08,-.02,[[0,.17],[.2,.2],[.24,.28],[.17,.36],[0,.41]],13904952,{fase:Math.PI/8}),k(-.16,-.1,[[.05,.31],[.04,.34]],16183526),k(.02,.06,[[.045,.31],[.035,.34]],16183526),k(-.06,-.02,[[.04,.39],[.03,.42]],16183526),k(.18,.14,[[.05,0],[.045,.11]],16108701),k(.18,.14,[[0,.09],[.12,.11],[.11,.17],[0,.21]],6040869,{fase:Math.PI/8})])}function os(){return Lt([G(0,.38,0,.92,.09,.44,15510096),G(0,.35,0,.98,.03,.5,14644537),G(-.36,0,0,.09,.36,.09,6040869),G(.36,0,0,.09,.36,.09,6040869)])}function as(){let e=[];for(let a=0;a<3;a++){let n=.33-a*.33,r=.24+a*.28;e.push(G(0,r,n,.9,.08,.33,15510096),G(0,r-.02,n,.94,.02,.37,14644537)),e.push(G(-.36,0,n,.07,r,.07,6040869),G(.36,0,n,.07,r,.07,6040869))}return Lt(e)}function is(){return Lt([k(0,0,[[.025,0],[.02,.7]],3481626,{rot:[0,0,-.35],perno:[0,0,0]}),k(.24,0,[[.02,.66],[.012,1.31]],3481626,{rot:[0,0,-.62],perno:[.24,.66,0]}),k(0,0,[[.035,0],[.035,.26]],12597547,{rot:[0,0,-.35],perno:[0,0,0]}),k(0,0,[[.03,.4],[.065,.42],[.065,.5],[.03,.52]],9279656,{rot:[0,0,-.35],perno:[0,0,0],aperto:!0})])}function ns(){let e=[];return e.push(k(0,0,[[.19,.32],[.24,.32],[.24,.37],[.19,.37]],12597547,{aperto:!0})),e.push(k(0,0,[[.2,.33],[.14,.17],[.05,.05],[0,.02]],9079434,{aperto:!0})),e.push(k(0,.24,[[.03,.34],[.03,.96]],14251821,{rot:[-1.95,0,0],perno:[0,.34,.24]})),e.push(k(0,.24,[[.04,.96],[.04,1.1],[0,1.12]],12597547,{rot:[-1.95,0,0],perno:[0,.34,.24]})),Lt(e)}function rs(){return Lt([G(0,.02,0,.44,.04,.3,10858432),G(0,.04,0,.5,.05,.34,12174291),G(0,.09,0,.42,.02,.28,10858432),G(0,.09,.05,.12,.1,.1,12174291),G(0,.19,.05,.09,.09,.09,13226719),k(0,.05,[[.06,0],[.06,.62],[0,.66]],14716975,{rot:[.95,0,0],perno:[0,.24,.05],lati:6,fase:Math.PI/6})])}function ss(){let a={rot:[-Math.PI/2,0,0],perno:[0,.42,0]};return Lt([k(0,0,[[.3,.42],[.26,.52],[.16,.66],[.12,.8]],14673648,{...a,aperto:!0}),k(0,0,[[.13,.66],[.13,.7]],1405880,{...a,aperto:!0}),k(0,0,[[.14,.8],[.14,.9],[0,.92]],1405880,a),k(0,0,[[.3,.42],[.22,.47],[0,.52]],14673648,a),G(0,.33,-.09,.14,.14,.06,2279664),G(0,0,.1,.1,.44,.1,1003407,{rot:[-.25,0,0],perno:[0,.44,.1]})])}var gt={gatto:{nome:"Gatto (PNG)",costruisci:()=>va(Co.arancione,{zaino:!0}),colore:15968586},fungo:{nome:"Fungo",costruisci:es,colore:14170676},gradino:{nome:"Gradino",costruisci:os,colore:14916156},scala:{nome:"Scala",costruisci:as,colore:13206575},canna:{nome:"Canna da pesca",costruisci:is,colore:12597547},retino:{nome:"Retino",costruisci:ns,colore:14251821},cazzuola:{nome:"Cazzuola",costruisci:rs,colore:12174291},megafono:{nome:"Megafono",costruisci:ss,colore:1405880}};function Zi(){for(let[i,t]of Object.entries(gt))et[i]||_t(i,{nome:t.nome,forma:"modello",modello:i,solido:!1,calpestabile:!0,colore:t.colore}),Pe(i,{nome:t.nome,modello:i,giro:"no",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1]});return Object.keys(gt)}at();var it=4,yo=32;function ji(i,t,o){let e=[],a=t*M,n=o*M;for(let r=a;r<a+M;r++)for(let s=n;s<n+M;s++){if(r<-yo||r>=yo||s<-yo||s>=yo)continue;for(let c=it-3;c<it;c++)i.metti(r,c,s,"terra",!0);if(i.metti(r,it,s,"erba",!0),r>=6&&r<18&&s>=-20&&s<-12&&(i.togli(r,it,s,!0),i.metti(r,it-1,s,"acqua",!0),i.metti(r,it,s,"acqua",!0)),r>=-20&&r<-12&&s>=4&&s<12)for(let c=it+1;c<=it+(s-3);c++)i.metti(r,c,s,"pietra",!0);if(s===20&&r>=-24&&r<24){let c=li.filter(d=>d&&!yt[d]&&w(d).forma!=="modello"),u=Math.floor((r+24)/2);if((r+24)%2===0&&u<c.length)for(let d=it+1;d<=it+3;d++)i.metti(r,d,s,c[u],!0)}r===-4&&s>=-28&&s<28&&(s+28)%6===0&&e.push([r,it+1,s,"lampione"]),r>=-28&&r<-8&&s>=-28&&s<-8&&(r*7+s*13)%11===0&&e.push([r,it+1,s,"albero"]);let l=Object.keys(gt);s===-4&&r>=0&&r<l.length*2&&r%2===0&&e.push([r,it+1,s,l[r/2]]),s===8&&(r===18&&i.metti(r,it+1,s,"lampadaRossa",!0),r===22&&i.metti(r,it+1,s,"lampadaBlu",!0)),r===20&&(s===6&&i.metti(r,it+1,s,"lampadaVerde",!0),s===10&&i.metti(r,it+1,s,"lampadaPesante",!0))}return e}var zt=12,cs=[[-7,6,-5,4,zt],[-3,4,-4,0,zt+1]],ls=[1,3,2,3];function Ki(i,t,[o,e,a,n]){return i>=o&&i<=e&&t>=a&&t<=n}function Wi(i,t,o){let e=[],a=t*M,n=o*M;for(let s=a;s<a+M;s++)for(let l=n;l<n+M;l++){let c=-1;for(let u of cs)Ki(s,l,u)&&(c=Math.max(c,u[4]));if(!(c<0)){for(let u=c-3;u<c;u++)i.metti(s,u,l,"terra",!0);if(Ki(s,l,ls)){i.metti(s,c-1,l,"acqua",!0),i.metti(s,c,l,"acqua",!0);continue}i.metti(s,c,l,"erba",!0)}}let r=[[-5,zt+1,-3,"albero"],[4,zt+1,0,"lampione"],[-1,zt+2,-2,"gatto"],[-2,zt+1,2,"fungo"],[-3,zt+1,3,"fungo"],[5,zt+1,3,"canna"],[-6,zt+1,2,"retino"],[0,zt+1,4,"cazzuola"]];for(let s of r)s[0]>=a&&s[0]<a+M&&s[2]>=n&&s[2]<n+M&&e.push(s);return e}at();var us=8,Dt={passoColonne:3,passoLampade:11,passoModelli:5,passoCanali:16,rilievo:7};function te(i,t,o){let e=Math.imul(i|0,374761393)+Math.imul(t|0,668265263)+Math.imul(o|0,1442695041)|0;return e=Math.imul(e^e>>>13,1274126177),((e^e>>>16)>>>0)/4294967296}function fs(){return Object.keys(et).filter(i=>{let t=w(i);return t&&!t.acqua&&t.forma!=="modello"}).sort()}function ds(){return Object.keys(et).filter(i=>{let t=w(i);return t&&t.luce}).sort()}function ps(i,t){let o=Math.sin(i*.07)*Math.cos(t*.061),e=Math.sin((i+t)*.023)*.6;return us+Math.round((o+e)*Dt.rilievo*.5)}function ms(i,t){let o=(i%Dt.passoCanali+Dt.passoCanali)%Dt.passoCanali,e=(t%Dt.passoCanali+Dt.passoCanali)%Dt.passoCanali;return o<3||e<3}function Qi(i,t,o){let e=[],a=t*M,n=o*M,r=fs(),s=ds(),l=Object.keys(gt);for(let c=a;c<a+M;c++)for(let u=n;u<n+M;u++){let d=ps(c,u),f=ms(c,u);for(let m=d-3;m<d;m++)i.metti(c,m,u,"terra",!0);if(f){i.metti(c,d-1,u,"sabbia",!0),i.metti(c,d,u,"acqua",!0);continue}if(i.metti(c,d,u,"erba",!0),te(c,u,1)<1/Dt.passoColonne){let m=r[Math.floor(te(c,u,2)*r.length)%r.length],h=1+Math.floor(te(c,u,3)*5);for(let g=d+1;g<=d+h;g++)i.metti(c,g,u,m,!0);continue}if(s.length&&te(c,u,4)<1/Dt.passoLampade){let m=s[Math.floor(te(c,u,5)*s.length)%s.length];i.metti(c,d+1,u,m,!0);continue}if(te(c,u,6)<1/Dt.passoModelli){let m=te(c,u,7),h=m<.45?"albero":m<.7?"lampione":l[Math.floor(m*1e3)%l.length];e.push([c,d+1,u,h])}}return e}at();ge();var So={id:"omega",nome:"Omega",emoji:"\u26A1",blocchi:[]},Oo=[null,"metallo","fango","ghiaccio","accesa","specchio"],hs=.618033988749895;function ba(i,t,o){i=(i%1+1)%1,t=Math.max(0,Math.min(1,t)),o=Math.max(0,Math.min(1,o));let e=Math.floor(i*6),a=i*6-e,n=o*(1-t),r=o*(1-a*t),s=o*(1-(1-a)*t),[l,c,u]=[[o,s,n],[r,o,n],[n,o,s],[n,r,o],[s,n,o],[o,n,r]][e%6];return Math.round(l*255)<<16|Math.round(c*255)<<8|Math.round(u*255)}function Lo(i){let t=i*hs%1,o=.62+.36*(i*.2360679%1),e=.66+.32*(i*.1010205%1);return{cima:ba(t,o,e),lato:ba(t,o*1.04,e*.86),fondo:ba(t,o*1.08,e*.74)}}function gs(i,{passoLuce:t=24,ombraDiLuce:o=3}={}){let e=[];for(let a=0;a<i;a++){let n=`omega-b${String(a).padStart(4,"0")}`,r=Lo(a),s=Oo[a%Oo.length],l={nome:`Omega blocco ${a}`,cima:r.cima,lato:r.lato,fondo:r.fondo,solido:!0,nav:10,fam:a%3===0?"mina":"scavo"};s&&(l.materia=s),a%t===0&&(l.luce={colore:r.cima,raggio:4+a%5,intensita:.8+.05*(a%6),ombra:a/t%o===0}),e.push([n,l])}return e}var xa=[i=>{let t=[],o=0;for(let e=0;e<3+i.n3;e++){let a=.62-e*.09*i.f1,n=.16+.14*i.f2;t.push(G(0,o,0,Math.max(.12,a),n,Math.max(.12,a*(.7+.5*i.f3)),i.col(e),{materia:i.mat(e),rot:[0,e*.22*i.f4,0]})),o+=n}return t},i=>[k(0,0,[[.1+.1*i.f1,0],[.24+.16*i.f2,.1],[.3+.14*i.f3,.34+.2*i.f1],[.18+.12*i.f4,.6+.2*i.f2],[.22+.1*i.f1,.74+.2*i.f3],[0,.8+.24*i.f4]],i.col(0),{materia:i.mat(0),fase:i.f2*Math.PI})],i=>[G(0,0,0,.1+.06*i.f1,.7+.5*i.f2,.1+.06*i.f1,i.col(0),{materia:i.mat(0)}),k(0,0,[[0,.7+.5*i.f2],[.18+.1*i.f3,.78+.5*i.f2],[.16+.1*i.f3,1+.5*i.f2],[0,1.06+.5*i.f2]],i.col(1),{materia:Re("accesa"),fase:Math.PI/8})],i=>{let t=.7+.5*i.f1,o=.28+.2*i.f2,e=.28+.2*i.f3,a=[];for(let n of[-1,1])for(let r of[-1,1])a.push(G(n*(t/2-.07),0,r*(o/2-.06),.08,e,.08,i.col(1),{materia:i.mat(1)}));return a.push(G(0,e,0,t,.09+.06*i.f4,o,i.col(0),{materia:i.mat(0)})),a},i=>{let t=1.1+.9*i.f1,o=[G(0,0,0,.06,t,.06,i.col(0),{materia:i.mat(0)})];for(let e=0;e<2+i.n3;e++){let a=t*(.35+.5*(e/(2+i.n3)));o.push(k(0,0,[[.1+.1*i.f2,a],[.13+.1*i.f2,a+.03],[.1+.1*i.f2,a+.06]],i.col(1),{materia:i.mat(1),aperto:!0}))}return o.push(Ft(0,t,0,.14+.08*i.f3,.22+.2*i.f4,i.col(2),0,0,{materia:i.mat(2)})),o},i=>{let t=.24+.2*i.f1,o=.5+.6*i.f2,e=.14+.2*i.f3;return[Ft(0,e,0,t,o,i.col(0),.04*i.f4,-.04*i.f1,{materia:i.mat(0)}),Ft(0,e,0,t,-e,i.col(1),0,0,{materia:i.mat(1)})]}],cu=xa.length;function Fe(i,t){let o=Math.imul(i|0,374761393)+Math.imul(t|0,1442695041)|0;return o=Math.imul(o^o>>>13,1274126177),((o^o>>>16)>>>0)/4294967296}function vs(i){let t=i*7%4096,o=[Lo(t),Lo(t+811),Lo(t+1607)],e=[i%6,(i*5+1)%6,(i*11+3)%6].map(a=>Oo[a]?Re(Oo[a]):0);return{f1:Fe(i,1),f2:Fe(i,2),f3:Fe(i,3),f4:Fe(i,4),n3:Math.floor(Fe(i,5)*3),col:a=>[o[0].cima,o[1].cima,o[2].cima,o[0].lato,o[1].lato,o[2].fondo][a%6],mat:a=>e[a%3]}}function bs(i){let t=[];for(let o=0;o<i;o++){let e=`omega-a${String(o).padStart(4,"0")}`,a=vs(o),n=xa[o%xa.length];t.push([e,{nome:`Omega arredo ${o}`,colore:a.col(0),costruisci:()=>Lt(n(a))}])}return t}function Ji({blocchi:i=0,arredi:t=0,passoLuce:o=24}={}){se.includes(So)||se.push(So);let e=[],a=[],n=new Map;for(let[r,s]of gs(i,{passoLuce:o}))et[r]||_t(r,s,So),e.push(r);for(let[r,s]of bs(t))et[r]||(_t(r,{nome:s.nome,forma:"modello",modello:r,solido:!1,calpestabile:!0,colore:s.colore},So),Pe(r,{nome:s.nome,modello:r,giro:"libero",scala:1,proiettaOmbra:!0,classe:"fermo",ingombro:[1,1,1]})),a.push(r),n.set(r,s);return{blocchi:e,arredi:a,arrediDef:n}}Ea();var As=[{id:"riposo",nome:"Il mondo omega",spiega:"2000 tipi di blocco diversi, canali, alberi: il fondo scala di questa macchina",carico:{pozze:!1,arredi:0,corpi:0,ar:!1}},{id:"luci",nome:"+ pozze colorate",spiega:"le lampade accendono: cammino nei voxel per pixel, la voce piu cara del motore",carico:{pozze:!0,arredi:0,corpi:0,ar:!1}},{id:"modelli64",nome:"+ 64 arredi unici",spiega:"sessantaquattro mesh diverse = sessantaquattro disegni per passata",carico:{pozze:!0,arredi:64,corpi:0,ar:!1}},{id:"modelli256",nome:"+ 256 arredi unici",spiega:"il gradino dove di solito si vede il ginocchio dei disegni",carico:{pozze:!0,arredi:256,corpi:0,ar:!1}},{id:"modelli1024",nome:"+ 1024 arredi unici",spiega:"mille mesh diverse: il caso peggiore onesto per una scena piena di roba",carico:{pozze:!0,arredi:1024,corpi:0,ar:!1}},{id:"fisica",nome:"+ 400 corpi",spiega:"la fisica a passo fisso sotto carico: CPU, non GPU",carico:{pozze:!0,arredi:1024,corpi:400,ar:!1}},{id:"ar",nome:"+ prova AR (doppia resa)",spiega:"la scena disegnata DUE volte per fotogramma: il budget vero dell AR",carico:{pozze:!0,arredi:1024,corpi:400,ar:!0}}],zs=45,Ms=180,De=class{constructor({gradini:t=As,riscaldo:o=zs,misurati:e=Ms}={}){this.gradini=t,this.riscaldo=o,this.misurati=e,this.i=-1,this.fatti=0,this.fase="fermo",this.contatore=0,this.ritmo=new ve({tetto:e}),this.esiti=[],this._scena=null}get gradino(){return this.i>=0&&this.i<this.gradini.length?this.gradini[this.i]:null}get inCorso(){return this.fase==="riscaldo"||this.fase==="misura"}get carico(){let t=this.gradino;return t?t.carico:null}get avanzamento(){if(this.fase==="finito")return 1;let t=this.gradini.length*(this.riscaldo+this.misurati);return t>0?Math.min(1,this.fatti/t):0}avvia(){return this.i=0,this.contatore=0,this.fatti=0,this.fase=this.riscaldo>0?"riscaldo":"misura",this.esiti.length=0,this.ritmo.azzera(),this._scena=null,this.carico}ferma(){this.fase="fermo",this.i=-1,this.contatore=0,this.fatti=0}passo(t,o=null){if(!this.inCorso)return{cambiato:!1,carico:null};if(o)if(!this._scena)this._scena={...o};else for(let e of Object.keys(o))o[e]>this._scena[e]&&(this._scena[e]=o[e]);return this.contatore++,this.fatti++,this.fase==="riscaldo"?(this.contatore>=this.riscaldo&&(this.fase="misura",this.contatore=0,this.ritmo.azzera(),this._scena=o?{...o}:null),{cambiato:!1,carico:null}):(this.ritmo.campiona(t),this.contatore<this.misurati?{cambiato:!1,carico:null}:this._chiudiGradino())}_chiudiGradino(){let t=this.gradino,o=this.ritmo.misura();return this.esiti.push({id:t.id,nome:t.nome,spiega:t.spiega,carico:t.carico,misura:o,voto:tn(o),scena:this._scena}),this.i++,this.contatore=0,this._scena=null,this.i>=this.gradini.length?(this.fase="finito",{cambiato:!0,carico:null,finito:!0}):(this.fase=this.riscaldo>0?"riscaldo":"misura",this.fase==="misura"&&this.ritmo.azzera(),{cambiato:!0,carico:this.carico})}verdetto(){if(!this.esiti.length)return null;let t=this.esiti.findIndex(s=>s.voto.punti<45),o=t>=0?this.esiti[t]:null,e=t>0?this.esiti[t-1]:t===0?null:this.esiti[this.esiti.length-1],a=this.esiti[0],n=this.esiti.find(s=>s.id==="ar"),r=this.esiti.find(s=>s.id==="fisica")||this.esiti[this.esiti.length-1];return{ultimoBuono:e?e.id:null,primoRotto:o?o.id:null,prezzoAr:n&&r&&n.misura&&r.misura&&r.misura.p50>0?n.misura.p50/r.misura.p50:null,prezzoCarico:r&&a&&r.misura&&a.misura&&a.misura.p50>0?r.misura.p50/a.misura.p50:null,collo:r&&r.voto?r.voto.collo:null,agganciato:a&&a.misura?a.misura.regolare:!1,soloPavimento:a&&a.misura?a.misura.regolare:!1}}righe(){return this.esiti.map(t=>{let o=t.misura;if(!o)return`${t.nome}: poco campione`;let e=t.scena||{};return`${t.nome.padEnd(24)} ${o.fps.toFixed(0).padStart(4)} fps \xB7 p50 ${o.p50.toFixed(1).padStart(5)} p99 ${o.p99.toFixed(1).padStart(6)} ms \xB7 scarto ${o.scarto.toFixed(2).padStart(5)} \xB7 singh ${o.singhiozziAlSec.toFixed(1)}/s \xB7 ${String(e.disegni??"?").padStart(5)} disegni \xB7 voto ${String(t.voto.punti).padStart(3)} (${t.voto.giudizio})`})}};function en(i,t=null){return{chiave:"resa",nome:"Resa del nucleo",nota:"Lo specchio e l'ombra si possono spegnere per misurare quanto costano: la grafica \xE8 la stessa ovunque, il \u{1FA7A} dice i fotogrammi.",campi:[{chiave:"ombra",nome:"ombra del sole (horizon mapping)",tipo:"interruttore",leggi:()=>!!i.ombra,scrivi:o=>i.ombra=!!o},{chiave:"specchio",nome:"specchio dell'acqua",tipo:"interruttore",leggi:()=>!!i.specchio.attivo,scrivi:o=>i.specchio.attivo=!!o},{chiave:"scalaSpecchio",nome:"risoluzione dello specchio",tipo:"numero",min:.2,max:1,passo:.05,leggi:()=>i.specchio.scala,scrivi:o=>i.specchio.scala=o},{chiave:"vediSpecchio",nome:"mostra lo specchio nudo",tipo:"interruttore",leggi:()=>!!i.specchio.mostra,scrivi:o=>i.specchio.mostra=!!o},{chiave:"bagliori",nome:"alone delle lanterne (due cerchi)",tipo:"interruttore",leggi:()=>!!(t&&t.attivo),scrivi:o=>{t&&(t.attivo=!!o)}},{chiave:"erbaFinoA",nome:"fili d'erba fino a",tipo:"numero",min:0,max:160,passo:16,unita:"blocchi",leggi:()=>i.erbaFinoA,scrivi:o=>i.erbaFinoA=o},{chiave:"nebbiaDa",nome:"nebbia da",tipo:"numero",min:8,max:200,passo:4,unita:"blocchi",leggi:()=>i.nebbia.da,scrivi:o=>i.nebbia.da=Math.min(o,i.nebbia.a-4)},{chiave:"nebbiaA",nome:"nebbia piena a",tipo:"numero",min:12,max:240,passo:4,unita:"blocchi",leggi:()=>i.nebbia.a,scrivi:o=>i.nebbia.a=Math.max(o,i.nebbia.da+4)},{chiave:"disegni",nome:"disegni (solidi + specchio)",tipo:"lettura",leggi:()=>`${i.statistiche.disegni} + ${i.statistiche.disegniSpecchio}`},{chiave:"chunk",nome:"chunk visti / totali",tipo:"lettura",leggi:()=>`${i.statistiche.chunkVisti} / ${i.statistiche.chunkTotali}`}]}}function on(i){return{chiave:"stile",nome:"Stile",nota:"L'ombra di Leafy \xE8 il colore stesso con la tinta spostata verso il blu, un po' pi\xF9 satura e pi\xF9 scura. Qui si tarano i tre numeri, e si accendono o spengono i pezzi della luce.",campi:[{chiave:"tinta",nome:"ombra: spostamento di tinta verso il blu",tipo:"numero",min:0,max:.3,passo:.01,leggi:()=>i.stile.tinta,scrivi:t=>i.stile.tinta=t},{chiave:"saturazione",nome:"ombra: saturazione",tipo:"numero",min:.6,max:1.6,passo:.05,leggi:()=>i.stile.saturazione,scrivi:t=>i.stile.saturazione=t},{chiave:"valore",nome:"ombra: quanto \xE8 scura (valore)",tipo:"numero",min:.3,max:1,passo:.02,leggi:()=>i.stile.valore,scrivi:t=>i.stile.valore=t},{chiave:"mappa",nome:"mappa d'ombra vera (forma delle cose)",tipo:"interruttore",leggi:()=>!!i.mappa.attiva,scrivi:t=>i.mappa.attiva=!!t},{chiave:"mappaRaggio",nome:"mappa d'ombra: raggio",tipo:"numero",min:16,max:64,passo:4,unita:"blocchi",leggi:()=>i.mappa.raggio,scrivi:t=>{i.mappa.raggio=t,i.mappa.sporca=!0,i.mappa.centro=[1e9,0,1e9]}},{chiave:"lampade",nome:"pozze dei lampioni (cerchi)",tipo:"interruttore",leggi:()=>i.lampadeAccese!==!1,scrivi:t=>i.lampadeAccese=!!t}]}}function an(i){return{chiave:"meteo",nome:"Meteo",nota:"Il mare: 0 \xE8 uno specchio, 1 \xE8 mosso. Muoverlo a mano spegne il vagare automatico.",campi:[{chiave:"auto",nome:"meteo che cambia da solo",tipo:"interruttore",leggi:()=>!!i.auto,scrivi:t=>i.auto=!!t},{chiave:"mare",nome:"mare mosso",tipo:"numero",min:0,max:1,passo:.02,leggi:()=>+i.agitazione.toFixed(2),scrivi:t=>{i.auto=!1,i.agitazione=t,i.meta=t}}]}}function nn(i){return{chiave:"giorno",nome:"Giorno",nota:"Muovere l'ora spegne il ciclo automatico.",campi:[{chiave:"auto",nome:"ciclo automatico",tipo:"interruttore",leggi:()=>!!i.auto,scrivi:t=>i.auto=!!t},{chiave:"ora",nome:"ora del giorno",tipo:"numero",min:0,max:1,passo:.002,leggi:()=>i.ora,scrivi:t=>{i.auto=!1,i.ora=t}},{chiave:"durata",nome:"quanto dura un giorno",tipo:"numero",min:30,max:1800,passo:30,unita:"s",leggi:()=>i.durata,scrivi:t=>i.durata=t},{chiave:"orologio",nome:"orologio",tipo:"lettura",leggi:()=>`${String(Math.floor(i.ora*24)).padStart(2,"0")}:${String(Math.floor(i.ora*24%1*60)).padStart(2,"0")}`}]}}function rn(i,t){return{chiave:"corpi",nome:"Corpi (fisica)",nota:"Scatole a passo fisso (60 Hz), un asse per volta. Il tetto \xE8 800.",campi:[{chiave:"quanti",nome:"corpi",tipo:"lettura",leggi:()=>`${i.statistiche.corpi} (${i.statistiche.svegli} svegli)`},{chiave:"lancia20",nome:"\u{1F3B2} lancia venti",tipo:"azione",fai:()=>t(20)},{chiave:"lancia200",nome:"\u{1F3B2} lancia duecento",tipo:"azione",fai:()=>t(200)},{chiave:"svuota",nome:"\u{1F9F9} togli tutti",tipo:"azione",fai:()=>i.svuota()}]}}function sn(i){return{chiave:"streaming",nome:"Mondo in streaming",nota:"La frontiera genera 32 blocchi oltre la resa; la coda costruisce entro il budget, almeno un chunk a giro.",campi:[{chiave:"raggio",nome:"raggio di resa",tipo:"numero",min:48,max:160,passo:16,unita:"blocchi",leggi:()=>i.raggioResa,scrivi:t=>i.raggioResa=t},{chiave:"budget",nome:"budget di costruzione",tipo:"numero",min:1,max:16,passo:1,unita:"ms",leggi:()=>i.budgetMs,scrivi:t=>i.budgetMs=t},{chiave:"erba",nome:"densit\xE0 dell'erba (ai prossimi chunk)",tipo:"numero",min:0,max:8,passo:1,leggi:()=>i.erba,scrivi:t=>i.erba=t},{chiave:"stato",nome:"coda / costruiti / scaricati",tipo:"lettura",leggi:()=>`${i.statistiche.inCoda} / ${i.statistiche.costruiti} / ${i.statistiche.scaricati}`}]}}function cn(i){return{chiave:"giocatore",nome:"Giocatore",campi:[{chiave:"volo",nome:"vola",tipo:"interruttore",leggi:()=>!!i.volo,scrivi:t=>i.impostaVolo(!!t)},{chiave:"cameraTira",nome:"la camera si tira dentro davanti a un muro",tipo:"interruttore",leggi:()=>!!(i.cameraTira&&i.cameraTira()),scrivi:t=>i.impostaCameraTira&&i.impostaCameraTira(!!t)},{chiave:"buco",nome:"buco di visuale (al posto della sagoma)",tipo:"interruttore",leggi:()=>!!(i.buco&&i.buco()),scrivi:t=>i.impostaBuco&&i.impostaBuco(!!t)},{chiave:"miraCentro",nome:"mira al centro (mirino) invece che dove sta il dito",tipo:"interruttore",leggi:()=>!!(i.miraCentro&&i.miraCentro()),scrivi:t=>i.impostaMiraCentro&&i.impostaMiraCentro(!!t)},{chiave:"dove",nome:"dove",tipo:"lettura",leggi:()=>i.dove()},{chiave:"casa",nome:"\u{1F3E0} torna all'origine",tipo:"azione",fai:()=>i.aCasa()},{chiave:"modifiche",nome:"modifiche salvate",tipo:"lettura",leggi:()=>i.modifiche?i.modifiche():0},{chiave:"nuovo",nome:"\u{1F5D1} mondo nuovo (butta le modifiche)",tipo:"azione",fai:()=>i.nuovo&&i.nuovo()}]}}function ln(i){return{chiave:"scene",nome:"Scene",nota:"Lo zoo \xE8 il piano di prova: vasca, scalinata, muro dei materiali, viale dei lampioni, lampade colorate, arredi. Cambiare scena ricarica la pagina.",campi:[{chiave:"dove",nome:"scena",tipo:"lettura",leggi:()=>i.vetrina?"vetrina nel nero":i.zoo?"zoo di prova":`open world, seme ${i.seme}`},{chiave:"vetrina",nome:"\u{1F5BC} vai alla vetrina (la concept art nel nero)",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?vetrina&officina&terza&ora=0.38")}},{chiave:"zoo",nome:"\u{1F981} vai allo zoo",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search="?zoo&officina&terza")}},{chiave:"mondo",nome:"\u{1F30D} torna all'open world",tipo:"azione",fai:()=>{typeof location<"u"&&(location.search=`?seme=${i.seme}&officina`)}}]}}var Io=class{constructor(t=1){this.agitazione=.25,this.meta=.25,this.auto=!0,this.fra=20,this._s=t>>>0||1}_caso(){let t=this._s;return t^=t<<13,t^=t>>>17,t^=t<<5,this._s=t>>>0,this._s%1e5/1e5}aggiorna(t){if(!this.auto)return this.agitazione;this.fra-=t,this.fra<=0&&(this.meta=Math.pow(this._caso(),2),this.fra=25+this._caso()*50);let o=1-Math.exp(-t/12);return this.agitazione+=(this.meta-this.agitazione)*o,this.agitazione}};function un(i,t,o,e,a=0,n=0){let r=[t[0]-i[0],t[1]-i[1],t[2]-i[2]],s=Math.hypot(...r)||1;r[0]/=s,r[1]/=s,r[2]/=s;let l=[-r[2],0,r[0]],c=Math.hypot(...l)||1;l[0]/=c,l[2]/=c;let u=[l[1]*r[2]-l[2]*r[1],l[2]*r[0]-l[0]*r[2],l[0]*r[1]-l[1]*r[0]],d=Math.tan(o/2),f=a*d*e,p=n*d,m=[r[0]+l[0]*f+u[0]*p,r[1]+l[1]*f+u[1]*p,r[2]+l[2]*f+u[2]*p],h=Math.hypot(...m)||1;return{x:m[0]/h,y:m[1]/h,z:m[2]/h}}function fn(i,t={}){let o={};for(let[a,n]of i.modifiche)n.size&&(o[a]=[...n].map(([r,s])=>[r,s]));let e=i.bagnate&&i.bagnate.size?[...i.bagnate]:void 0;return JSON.stringify({v:1,chunk:o,...e?{bagnate:e}:{},...t})}function dn(i,t){if(!t)return 0;let o;try{o=JSON.parse(t)}catch{return-1}if(!o||o.v!==1||typeof o.chunk!="object")return-1;let e=0;for(let[a,n]of Object.entries(o.chunk)){if(!/^-?\d+,-?\d+$/.test(a)||!Array.isArray(n))continue;let r=new Map;for(let s of n)!Array.isArray(s)||s.length!==2||!Number.isInteger(s[0])||s[1]!==null&&typeof s[1]!="string"||(r.set(s[0],s[1]),e++);r.size&&i.modifiche.set(a,r)}if(Array.isArray(o.bagnate)&&i.bagnate)for(let a of o.bagnate)!Array.isArray(a)||a.length!==2||!Number.isInteger(a[0])||!Number.isInteger(a[1])||i.bagnate.set(a[0],Math.max(0,Math.min(15,a[1])));return e}function Aa(i){let t=0;for(let o of i.modifiche.values())t+=o.size;return t}ge();at();var Ro={portata:7,budget:256,yMin:-32},pn=[[1,0],[-1,0],[0,1],[0,-1]],mn=(i,t,o)=>i+","+t+","+o,No=class{constructor(t){this.mondo=t,this.coda=new Map,this.attiva=!0}pianifica(t,o,e){this.coda.set(mn(t,o,e),[t,o,e])}bonifica(){let t=[];for(let o of this.mondo.tutti())o.y<Ro.yMin&&o.tipo.startsWith("acqua")&&t.push([o.x,o.y,o.z]);for(let[o,e,a]of t)this.mondo.togli(o,e,a,!0);return t.length}pianificaAttorno([t,o,e]){this.pianifica(t,o,e),this.pianifica(t,o-1,e),this.pianifica(t,o+1,e);for(let[a,n]of pn)this.pianifica(t+a,o,e+n)}tick(){if(!this.attiva||this.coda.size===0)return 0;let t=[...this.coda.values()].slice(0,Ro.budget);for(let[e,a,n]of t)this.coda.delete(mn(e,a,n));let o=0;for(let[e,a,n]of t)o+=this._riesamina(e,a,n)?1:0;return o}_riesamina(t,o,e){let a=this.mondo,n=a.tipo(t,o,e);if(n&&!w(n).acqua)return!1;if(o<Ro.yMin)return n?(a.togli(t,o,e,!0),!0):!1;let r=n?Ct(n):null;if(r===0)return a.tipo(t,o-1,e)||this.pianifica(t,o-1,e),!1;let s=a.tipo(t,o+1,e),l=!!(s&&w(s).acqua),c=a.tipo(t,o-1,e),u=!!(c&&w(c).acqua),d=!!(c&&!w(c).acqua),f=0,p=1/0;for(let[h,g]of pn){let v=a.tipo(t+h,o,e+g),b=v?Ct(v):null;if(b!==null){if(b===0&&f++,b!==0){let x=a.tipo(t+h,o-1,e+g);if(!x||w(x).acqua)continue}b<p&&(p=b)}}let m=null;return f>=2&&(d||u&&Ct(c)===0)?m=0:l?m=1:p+1<=Ro.portata&&(m=p+1),m===r?(r!==null&&!a.tipo(t,o-1,e)&&this.pianifica(t,o-1,e),!1):(m===null?a.togli(t,o,e,!0):a.metti(t,o,e,m===0?"acqua":"acqua~"+m,!0),this.pianificaAttorno([t,o,e]),!0)}};at();var K=new URLSearchParams(location.search),O={seme:+(K.get("seme")||4242),erba:Math.max(0,Math.min(8,+(K.get("erba")??8))),raggio:Math.max(48,Math.min(160,+(K.get("raggio")||96))),ombra:K.get("ombra")!=="no",mappa:K.get("mappa")==="no"?0:Math.max(256,Math.min(4096,+(K.get("mappa")||(matchMedia("(pointer: coarse)").matches?1024:2048)))),specchio:K.get("specchio")==="no"?0:Math.max(.2,Math.min(1,+(K.get("specchio")??.5)||.5)),dprMax:+(K.get("dpr")||1.5),ora:K.has("ora")?+K.get("ora"):null,corpi:+(K.get("corpi")||(K.has("omega")?120:0)),terza:K.has("terza"),zoo:K.has("zoo"),vetrina:K.has("vetrina"),omega:K.has("omega"),varia:K.get("varia")!=="no"},J=document.getElementById("tela"),{gl:ze,dpr:ws,ridimensiona:Ps}=Ha(J,{antialias:!0,dprMax:O.dprMax}),E=new oo(ze);E.ombra=O.ombra;E.mappa.attiva=O.mappa>0;O.mappa>0&&O.mappa!==E.mappa.lato&&(E.mappa.lato=O.mappa,E.mappa.latoDin=Math.max(256,O.mappa/2),E._preparaMappa());E.specchio.attivo=O.specchio>0;E.specchio.scala=O.specchio||.5;var Y=new ao(ze);Y.registra("cubo",Qa());Y.registra("omino",va(Co.blu));Zi();for(let[i,t]of Object.entries(gt))Y.registra(i,t.costruisci());ii();et.lampioneSpento||_t("lampioneSpento",{...w("lampione"),nome:"Lampione spento",modello:"lampioneSpento",luce:void 0,notte:!1});var Do=O.omega?Ji({blocchi:2e3,arredi:1024}):null,V=new ro,Mt=new _o({varia:O.varia});V.onEvento=i=>Mt.evento(i);var Na=K.get("worker")==="no"?null:Xi(),Fs=O.vetrina?Wi:O.omega?Qi:O.zoo?ji:(i,t,o)=>ai(i,t,o,O.seme),kt=new Ao(V,E,Fs,{erba:O.erba,raggioResa:O.raggio,lavoro:Na}),ka=new No(V),ya=.2,Uo=0,Va=new io(ze);E.apriFinestraAltezze(.5,.5,512);var Xo=O.vetrina?"leafy-vetrina":O.omega?"leafy-omega":O.zoo?"leafy-zoo":`leafy-partita-${O.seme}`,Ho=0;try{K.has("nuovo")?localStorage.removeItem(Xo):Ho=dn(V,localStorage.getItem(Xo))}catch{Ho=0}var He=0;function Ds(){try{localStorage.setItem(Xo,fn(V,{seme:O.seme,quando:Date.now()}))}catch{}}var Us=performance.now();kt.avvio(.5,.5);var qn=performance.now()-Us,Sa=new Set(["cubo","omino",...Object.keys(gt)]);async function Bs(i){if(!Sa.has(i)){Sa.add(i);try{let t=await fetch(`./modelli/nucleo/${i}.bin`);if(!t.ok)throw new Error(`${t.status}`);let o=Wa(await t.arrayBuffer());if(i==="albero"){let e=o.byte,a=new DataView(e.buffer,e.byteOffset,e.byteLength),n=[[15,73,82],[20,84,77],[38,124,77],[90,197,80]],r=Math.max(.001,o.maxY-o.minY);for(let s=0;s<o.triangoli;s++){let l=s*3*20,c=e[l+16],u=e[l+17],d=e[l+18];if(!(u>c+20&&u>d+10))continue;let f=Math.min(a.getFloat32(l+4,!0),a.getFloat32(l+24,!0),a.getFloat32(l+44,!0)),p=n[Math.min(3,Math.floor((f-o.minY)/r*4))];for(let m=0;m<3;m++){let h=l+m*20;e[h+16]=p[0],e[h+17]=p[1],e[h+18]=p[2]}}}if(i==="lampione"){let e=o.byte;for(let a=0;a<o.vertici;a++)e[a*20+15]!==1&&(e[a*20+16]=42,e[a*20+17]=47,e[a*20+18]=77)}if(Y.registra(i,o),Mt.sporchi.add(i),i==="lampione"){let e=new Uint8Array(o.byte);for(let a=0;a<o.vertici;a++)e[a*20+15]===1&&(e[a*20+15]=0,e[a*20+16]=25,e[a*20+17]=25,e[a*20+18]=49);Y.registra("lampioneSpento",{...o,byte:e}),Sa.add("lampioneSpento"),Mt.sporchi.add("lampioneSpento")}}catch(t){console.warn(`modello ${i}: ${t.message}`)}}}function ks(){for(let[i,t]of Mt.cambiate()){if(!Y.tipi.has(i)){Bs(i),Mt.sporchi.add(i);continue}Y.istanze(i,t,8);let o=we(i);if(o&&o.alone){let{quota:e,raggio:a,colore:n}=o.alone,r=t.length/8,s=new Float32Array(r*8);for(let l=0;l<r;l++){let c=l*8,u=t[c+3];s.set([t[c],t[c+1]+e*u,t[c+2],a*u,n[0],n[1],n[2],1],c)}Va.istanze(s)}}}function Vn(i,t){for(let o=60;o>-60;o--)if(V.solido(i,o,t))return o+1;return 8}var C=new fo(V,{x:.5,y:(O.vetrina?zt:O.zoo?it:Vn(0,0))+.5+(O.zoo||O.vetrina?1:0),z:O.vetrina?2.5:.5}),rt=si(),Me=new mo(rt),Vs=new ho(i=>{!i&&Me.azzera&&Me.azzera()}),Kt=new zo(J,{alpha:.6,beta:-.2}),Te=!1,_e=!0,Ke=new Set;window.addEventListener("keydown",i=>{if(!/^(INPUT|TEXTAREA)$/.test(i.target&&i.target.tagName)){if(Ke.add(i.code),i.code==="KeyF"&&$s(),i.code==="KeyH"){let t=document.getElementById("stato");t.hidden=!t.hidden}if(i.code==="KeyM"&&Yn(!Qe),i.code==="KeyC"&&Ko(20),/^Digit[1-9]$/.test(i.code)&&Ae(+i.code.slice(5)-1),i.code==="KeyE"){Wn();return}}});window.addEventListener("keyup",i=>Ke.delete(i.code));window.addEventListener("blur",()=>Ke.clear());var ie=6;window.addEventListener("wheel",i=>{_e&&(ie=Math.max(1.5,Math.min(40,ie*(i.deltaY>0?1.12:.89))))},{passive:!0});var Bo=0,Gs=i=>{let t=i.targetTouches;if(t.length<2){Bo=0,Kt.fermo=!1;return}Kt.fermo=!0;let o=Math.hypot(t[0].clientX-t[1].clientX,t[0].clientY-t[1].clientY);Bo>0&&_e&&o>1&&(ie=Math.max(1.5,Math.min(40,ie*Bo/o))),Bo=o};for(let i of["touchstart","touchmove","touchend","touchcancel"])J.addEventListener(i,Gs,{passive:!0});function Gn(i){Te=i,Te&&(C.vy=0)}function $s(){Gn(!Te)}document.getElementById("cubi").addEventListener("click",()=>Ko(20));var jt=1/60,Ge=0,$t={x:C.x,y:C.y,z:C.z},Ue=C.y,$n=0;function Ga(){let i=Math.min(1,Ge/jt),t=$t.y+(C.y-$t.y)*i;return t<Ue?Ue=t:Ue+=(t-Ue)*(1-Math.exp(-$n/.12)),[$t.x+(C.x-$t.x)*i,Ue,$t.z+(C.z-$t.z)*i]}var qa=!1;function Xs(i){Ge=Math.min(Ge+i,jt*4);let t=Kt.avantiPiano();for(;Ge>=jt;){if(Ge-=jt,$t.x=C.x,$t.y=C.y,$t.z=C.z,Te){let e=9*jt,a=t.x,n=t.z;C.x+=(a*rt.avanti-n*rt.destra)*e,C.z+=(n*rt.avanti+a*rt.destra)*e,C.y+=((rt.salta?1:0)-(Ke.has("ShiftLeft")||Ke.has("KeyX")?1:0))*e,C.vy=0;continue}C.aggiorna(jt,ec(t),t);let o=e=>{let a=V.tipo(Math.floor(C.x),Math.floor(C.y+e),Math.floor(C.z));return!!(a&&w(a).acqua)};qa=o(.3),qa&&(o(.75)?C.vy=Math.min(C.vy+40*jt,1.4):C.vy<-.8&&(C.vy=-.8),rt.salta&&(C.vy=2.5),C.aTerra=!1)}}var st={mira:null,occhio:null,tira:!1,buco:!1},La=0,wn=0;function Yo(i=0){$n=i;let t=Kt.verso(),[o,e,a]=Ga(),n=[o,e+(_e?.8:1),a];if(!_e)return st.mira=null,{occhio:n,centro:[n[0]+t[0],n[1]+t[1],n[2]+t[2]],fov:1.36,rapporto:J.width/J.height};let r=ie;if(st.tira){for(let u=.5;u<=ie;u+=.5)if(V.solido(Math.floor(n[0]-t[0]*u),Math.floor(n[1]-t[1]*u),Math.floor(n[2]-t[2]*u))){r=Math.max(.6,u-.6);break}}let s=[n[0]-t[0]*r,n[1]-t[1]*r,n[2]-t[2]*r];st.mira||(st.mira=n.slice(),st.occhio=s.slice());let l=1-Math.exp(-i/.09),c=1-Math.exp(-i/.06);for(let u=0;u<3;u++)st.mira[u]+=(n[u]-st.mira[u])*l,st.occhio[u]+=(s[u]-st.occhio[u])*c;return{occhio:st.occhio.slice(),centro:st.mira.slice(),fov:1.15,rapporto:J.width/J.height}}var Hs=document.getElementById("barra"),Pn=document.getElementById("azione"),Xt=1,Ys=9,Ot=[null,"erba","terra","pietra","legno","sabbia","lampione","albero","lampadaPesante"].slice(0,Ys).map(i=>i&&!et[i]?null:i);function Xn(i){if(!i)return null;try{return yt[i]?yt[i].colore:gt[i]?gt[i].colore:uo(Wt(i),8).cima}catch{return null}}function We(i){if(!i)return"mano";if(yt[i])return yt[i].nome;if(gt[i])return gt[i].nome;let t=et[i];return t&&t.nome||i}function Zs(i,t){let o=document.createElement("button");return o.addEventListener("click",()=>Ae(t)),Hs.appendChild(o),o}var Zo=Ot.map(Zs);function Hn(i){let t=Ot[i],o=Zo[i],e=Xn(t),a=e!=null?"#"+(e>>>0).toString(16).padStart(6,"0"):"transparent",n=t?We(t):i===0?"mano":"\u2014";o.innerHTML=`<span class="n">${i+1}</span><span class="q" style="background:${a}"></span>${n}`,o.classList.toggle("vuota",t===null&&i!==0),o.title=t?`${We(t)} \u2014 tasto ${i+1}`:i===0?"mano vuota: rompi e interagisci":"vuota"}for(let i=0;i<Ot.length;i++)Hn(i);function js(i){if(i==null){Ae(0);return}let t=Ot.indexOf(i);if(t>=0){Ae(t);return}let o=Xt===0?1:Xt;Ot[o]=i,Hn(o),Ae(o)}function Ae(i){Xt=(i%Ot.length+Ot.length)%Ot.length,Zo.forEach((t,o)=>t.classList.toggle("scelto",o===Xt)),Zo[Xt].scrollIntoView({inline:"center",block:"nearest"})}Ae(1);var $e=new po,F=null,jo=!1,Bt={x:0,y:0,visto:!1},Qe=!1;function Yn(i){Qe=!!i,document.body.classList.toggle("mira-centro",Qe)}J.addEventListener("pointermove",i=>{Bt.x=i.clientX,Bt.y=i.clientY,Bt.visto=!0});J.addEventListener("pointerdown",i=>{Bt.x=i.clientX,Bt.y=i.clientY,Bt.visto=!0});var Oa=[];function Ks(i){Oa.length=0;let t=4e4;for(let o of Mt.tipiVivi()){if(o==="omino"||o==="cubo")continue;let e=so[o]||(o==="lampioneSpento"?so.lampione:null),a=e?e.altezza:1,n=e?e.mezza:.5;Mt.ognunaDi(o,(r,s,l)=>{let c=r-i.x,u=l-i.z;c*c+u*u>t||Oa.push({min:{x:r-n,y:s,z:l-n},max:{x:r+n,y:s+a,z:l+n},dato:{cella:[Math.floor(r),s,Math.floor(l)]}})})}return Oa}function Ws(i){let t=0,o=0;if(!(Qe||document.pointerLockElement===J||!Bt.visto)){let a=J.getBoundingClientRect();t=(Bt.x-a.left)/a.width*2-1,o=1-(Bt.y-a.top)/a.height*2}return un(i.occhio,i.centro,i.fov,i.rapporto,t,o)}function wa(i,t,o){for(let e=0;e<=2;e++){let a=V.tipo(i,t-e,o);if(a==="lampione"||a==="lampioneSpento")return[i,t-e,o,a];if(a&&e===0)return null}return null}function Fn(i,t,o,e){V.togli(i,t,o),V.metti(i,t,o,e==="lampione"?"lampioneSpento":"lampione"),kt.tocca(i,o),He=1e3}var Qs={solido:(i,t,o)=>{if(V.solido(i,t,o))return!0;let e=V.tipo(i,t,o);return!!(e&&w(e).acqua)}};function Pa(){if(!F)return["niente",Bt.visto?"troppo lontano":""];let i=Ot[Xt];if(F.acqua)return i&&!yt[i]&&!Me.demolisci?["posa",`posa nell'acqua: ${We(i)}`]:["tocca","nuota fin l\xEC"];let[t,o,e]=F.cella,a=V.tipo(t,o,e),n=wa(t,o,e);return Me.demolisci?["rompi",`rompi: ${a?w(a).nome:""} (tieni premuto)`]:n&&(!i||yt[i])?["lampione",n[3]==="lampione"?"spegni il lampione":"accendi il lampione"]:i&&!yt[i]?["posa",`posa: ${w(i).nome}`]:["tocca",`tocca: ${a?w(a).nome:""}`]}function Zn(i,t,o,e){e?V.metti(i,t,o,e):V.togli(i,t,o),kt.tocca(i,o),ka.pianificaAttorno([i,t,o]),He=1e3}function Js(){if(!F)return;let i=Ot[Xt];if(!i||yt[i])return;let[t,o,e]=F.acqua?F.cella:F.prima;if(!ui(V,t,o,e))return;let a=V.tipo(t,o,e),n=a&&w(a).acqua&&Qt.has(w(i).forma),r=n?Ct(a)||0:null,s=C;t+1>s.x-.3&&t<s.x+.3&&e+1>s.z-.3&&e<s.z+.3&&o+1>s.y&&o<s.y+.9||(Zn(t,o,e,i),n&&V.bagna(t,o,e,r))}function tc(){if(!F)return;let[i,t,o]=F.cella;Zn(i,t,o,null)}J.addEventListener("contextmenu",i=>i.preventDefault());di(J,i=>{if(Kt.trascinato>6)return;if(Ze&&F&&F.cella){let o=Mt.idInCella(F.cella[0],F.cella[1],F.cella[2]);o!=null&&Ze.scegli(o)}let[t]=Pa();if(i.button===2||i.pointerType==="touch"&&!Me.demolisci)if(t==="lampione"){let o=wa(...F.cella);Fn(o[0],o[1],o[2],o[3])}else t==="posa"?Js():F&&Dn(F);else if(i.button===0&&i.pointerType!=="touch")if(t==="lampione"){let o=wa(...F.cella);Fn(o[0],o[1],o[2],o[3])}else t==="tocca"&&F&&Dn(F)});var bt=null,Xe=0,Fa=0,Da=0;function Dn(i){let t=i.faccia&&i.faccia[1]>0?i.cella:i.prima;bt={x:t[0]+.5,y:i.faccia&&i.faccia[1]>0?t[1]+1:t[1],z:t[2]+.5,cella:[t[0],i.faccia&&i.faccia[1]>0?t[1]+1:t[1],t[2]]},Xe=0,Fa=C.x,Da=C.z}var Be={avanti:0,destra:0,salta:!1};function ec(i){if(rt.avanti||rt.destra||rt.salta)return bt=null,rt;if(!bt)return rt;let t=bt.x-C.x,o=bt.z-C.z,e=Math.hypot(t,o);if(e<.35)return bt=null,rt;let a=i.x,n=i.z;return Be.avanti=(t*a+o*n)/e,Be.destra=(t*-n+o*a)/e,Xe+=jt,Math.hypot(C.x-Fa,C.z-Da)>.05&&(Xe=0,Fa=C.x,Da=C.z),Be.salta=Xe>.5&&C.aTerra,Be.salta&&(Xe=0),Be}pi(J,{onInizio:i=>{jo=!(i.pointerType==="touch"&&!Me.demolisci)},onFine:()=>{jo=!1,$e.molla()}},0);var pt=new Mo(V),Ce=[[.36,.72,.3],[.62,.42,.26],[.84,.26,.24],[.28,.44,.84],[.93,.78,.26],[.62,.64,.66],[.96,.96,.96]],Un=null;function Ko(i){let t=Kt.verso(),o=Yo().occhio;for(let e=0;e<i&&pt.lista.length<800;e++){let a=9+Math.random()*4,n=()=>(Math.random()-.5)*2.2;pt.aggiungi({x:o[0]+t[0]*1.2+(Math.random()-.5)*.4,y:o[1]+t[1]*1.2+Math.random()*.4,z:o[2]+t[2]*1.2+(Math.random()-.5)*.4,vx:t[0]*a+n(),vy:t[1]*a+2+n(),vz:t[2]*a+n(),lato:.35+Math.random()*.3,colore:Ce[Math.floor(Math.random()*Ce.length)],giro:Math.random()*Math.PI})}}if(O.corpi>0)for(let i=0;i<Math.min(800,O.corpi);i++)pt.aggiungi({x:C.x+(Math.random()-.5)*12,y:C.y+6+Math.random()*10,z:C.z+(Math.random()-.5)*12,lato:.35+Math.random()*.3,colore:Ce[i%Ce.length],giro:Math.random()*Math.PI});var oe={ora:O.ora??.35,auto:O.ora===null,durata:600},ke=[],Ia=new Set,ko=60;function oc(i){let t=i.pozza??i.colore??16777215,o=(t>>16&255)/255,e=(t>>8&255)/255,a=(t&255)/255,n=Math.max(o,e,a,.001),r=1.3*(i.intensita??1)/n;return[o*r,e*r,a*r]}function ac(){let i=C;ke.length=0,Ia.clear();let t=(e,a,n,r)=>{let s=e-i.x,l=n-i.z,c=s*s+l*l;if(c>=ko*ko)return;let u=`${Math.floor(e)},${Math.floor(a)},${Math.floor(n)}`;if(Ia.has(u))return;let d=w(r).luce;d&&(Ia.add(u),ke.push([c,e,a,n,d]))};Mt.ognunaDi("lampione",(e,a,n)=>t(e,a,n,"lampione"));for(let e of E.chunks.values())if(!(!e.luci||!e.luci.length)&&!(Math.abs(e.x0+8-i.x)>ko+12||Math.abs(e.z0+8-i.z)>ko+12))for(let[a,n,r,s]of e.luci)t(a+.5,n+.5,r+.5,s);ke.sort((e,a)=>e[0]-a[0]);let o=Math.min(8,ke.length);for(let e=0;e<o;e++){let[,a,n,r,s]=ke[e];E.lampade[e*4]=a,E.lampade[e*4+1]=n,E.lampade[e*4+2]=r,E.lampade[e*4+3]=s.raggio??4.6;let[l,c,u]=oc(s);E.lampadeCol[e*4]=l,E.lampadeCol[e*4+1]=c,E.lampadeCol[e*4+2]=u,E.lampadeCol[e*4+3]=s.quota??0}E.nLampade=E.lampadeAccese===!1?0:o}var xe=[],Ra=48,ic=10,Ve=0;function nc(i,t){let o=C;xe.length=0;let[e,,a]=Ga();Ve=i?1:Math.max(0,Ve-t/.33),Ve>.02&&xe.push([0,e,a,.3*Ve,.4*Ve]);for(let r of pt.lista){if(!r.inAcqua)continue;let s=(r.x-o.x)*(r.x-o.x)+(r.z-o.z)*(r.z-o.z);if(s>=Ra*Ra)continue;let l=Math.min(1,(Ra-Math.sqrt(s))/ic),c=r.lato*.45*l*Math.min(1,(r.sommerso??1)*3);xe.push([s,r.x,r.z,c,c])}xe.sort((r,s)=>r[0]-s[0]);let n=Math.min(8,xe.length);for(let r=0;r<n;r++){let s=xe[r];E.galleggianti[r*4]=s[1],E.galleggianti[r*4+1]=s[2],E.galleggianti[r*4+2]=s[3],E.galleggianti[r*4+3]=s[4]}E.nGalleggianti=n}var Ye=new Io(O.seme);K.has("mare")&&(Ye.auto=!1,Ye.agitazione=Ye.meta=Math.max(0,Math.min(1,+K.get("mare")||0)));function rc(i){oe.auto&&(oe.ora=(oe.ora+i/oe.durata)%1);let o=oe.ora*Math.PI*2-Math.PI/2,e=.24+.5*Math.max(0,Math.sin(o)),a=o*.5;E.sole.verso=[-Math.cos(a)*Math.cos(Math.asin(e)),-e,-Math.sin(a)*Math.cos(Math.asin(e))];let n=Math.max(0,Math.min(1,(Math.sin(o)+.1)*2));E.sole.forza=n,E.mare=Ye.aggiorna(i),Uo+=i,Uo>=ya&&(Uo=Math.min(Uo-ya,ya),ka.tick()),ac(),nc(qa,i);let r=Math.min(1,Math.max(0,(e-.24)/.4));E.sole.colore=[1,.78+.22*r,.55+.45*r],E.sole.cielo=[.36+.64*n,.38+.62*n,.57+.43*n],E.nebbia.colore=O.vetrina?[0,0,0]:[.25+.47*n,.35+.5*n,.5+.42*n],ze.clearColor(E.nebbia.colore[0],E.nebbia.colore[1],E.nebbia.colore[2],1)}E.nebbia.da=O.raggio-24;E.nebbia.a=O.raggio+8;O.vetrina&&(E.cieloNero=!0,E.nebbia.da=400,E.nebbia.a=500);var dt=[],ae=[],Go=[],Bn=performance.now(),jn=0,kn=0;function Kn(i){let t=Math.min(.1,(i-Bn)/1e3);Bn=i;let o=performance.now();Ps(),rc(t),Xs(t),pt.avanza(t),kt.aggiorna(C.x,C.z,5),E.seguiAltezze(C.x,C.z),ks();let e=Yo(t);E.buco=_e&&st.buco?[e.centro[0],e.centro[1]-.2,e.centro[2],.75]:[0,0,0,0];let a=Kt.verso(),n=Ws(e),r={x:e.occhio[0],y:e.occhio[1],z:e.occhio[2]};if(F=ci(V,r,n,Ks(r),200),!F){let p=ca(Qs,r,n,200);p&&(p.acqua=!0,F=p)}if(F&&F.scatola&&(F.cella=F.dato.cella),jo&&F&&!F.acqua){let[p,m,h]=F.cella;$e.premi(p+","+m+","+h,fi(w(V.tipo(p,m,h))),i),$e.finito(i)&&tc()}else jo||$e.molla();Y.istanze("cubo",Un=pt.istanze(Un),8),(rt.avanti||rt.destra||bt)&&(wn=C.verso);let s=wn-La;s=Math.atan2(Math.sin(s),Math.cos(s)),La+=s*(1-Math.exp(-t/.08));let l=(rt.avanti||rt.destra||bt)&&C.aTerra?Math.abs(Math.sin(i/90))*.06:0,[c,u,d]=Ga();if(Y.istanze("omino",[c,u+l,d,1,1,1,1,La],8),bt&&E.scatola(bt.cella[0],bt.cella[1],bt.cella[2],1,.95,.6,.3,.02),E.disegna(e,t,Y),Y.disegna(E,e),F){let[p,m]=Pa(),h=$e.progresso(i),[g,v,b]=F.cella;p==="rompi"||h>0?E.scatola(g,v,b,1,.35-.2*h,.25,.28+.25*h):p==="lampione"?E.scatola(g,v,b,1,.9,.4,.3):E.scatola(g,v,b,1,.95,.5,.22),p==="posa"&&!V.pieno(...F.prima)&&E.scatola(F.prima[0],F.prima[1],F.prima[2],.6,.85,1,.35,.1),E.evidenzia(g,v,b,h),Pn.textContent=m}else Pn.textContent=Pa()[1];E.disegnaAcqua(),Va.disegna(E,e),Qn&&(E.disegna(e,0,Y),Y.disegna(E,e),E.disegnaAcqua());let f=performance.now()-o;dt.push(t*1e3),dt.length>240&&dt.shift(),ae.push(f),ae.length>240&&ae.shift(),jn++,vt&&fc(t*1e3),Ua&&Ua(),He>0&&(He-=t*1e3,He<=0&&Ds()),i-kn>500&&(kn=i,sc()),requestAnimationFrame(Kn)}var xt=(i,t)=>{if(!i.length)return 0;let o=[...i].sort((e,a)=>e-a);return o[Math.min(o.length-1,Math.floor(o.length*t))]};function sc(){let i=xt(dt,.5),t=xt(dt,.99),o=dt.length?dt.reduce((s,l)=>s+l,0)/dt.length:0,e=o?1e3/o:0,a=t?1e3/t:0;Go.push(Math.round(e)),Go.length>120&&Go.shift(),document.getElementById("fps").textContent=`${e.toFixed(0)} fps \xB7 1% ${a.toFixed(0)}
${i.toFixed(1)} / ${t.toFixed(1)} ms
JS ${xt(ae,.5).toFixed(2)} ms`;let n=E.statistiche,r=kt.statistiche;document.getElementById("stato").textContent=`${O.vetrina?"VETRINA":O.zoo?"ZOO":"PARTITA"} sul nucleo \xB7 seme ${O.seme} \xB7 ${J.width}\xD7${J.height} (dpr ${ws.toFixed(2)})
disegni ${n.disegni+Y.statistiche.disegni+n.disegniAcqua+n.disegniErba+n.disegniSpecchio} \xB7 triangoli ${(n.triangoli+Y.statistiche.triangoli+n.triangoliAcqua+n.triangoliErba+n.triangoliSpecchio).toLocaleString("it")} \xB7 chunk ${n.chunkVisti}/${n.chunkTotali} (coda ${r.inCoda}${Na?`, in volo ${r.inVolo} su ${Na.operai.length} worker`:""}, ${r.ultimaMs.toFixed(1)} ms) \xB7 corpi ${pt.statistiche.corpi} (${pt.statistiche.svegli} svegli)
x ${C.x.toFixed(1)} y ${C.y.toFixed(1)} z ${C.z.toFixed(1)} \xB7 ${Te?"volo":C.aTerra?"a terra":"in aria"} \xB7 modifiche ${Aa(V)}${Ho>0?` (${Ho} ricaricate)`:""} \xB7 in mano: ${Zo[Xt].textContent}${F?` \xB7 miri ${V.tipo(...F.cella)}`:""}
WASD/joystick cammina \xB7 clic a terra (mano vuota) o destro = il gatto ci va \xB7 trascina = gira la camera \xB7 rotella/pizzico = zoom \xB7 sinistro tieni = scava \xB7 destro/tocco = posa o accendi \xB7 \u26CF col dito scava \xB7 C cubi \xB7 1-9 cassetta \xB7 M mirino`}requestAnimationFrame(Kn);var Ee=null,Ua=null,Ze=null;async function $a(){if(Ee){document.body.classList.toggle("con-officina");return}let{apriOfficina:i}=await Promise.resolve().then(()=>(An(),En)),{creaScena:t}=await Promise.resolve().then(()=>(Cn(),_n)),{registroCreativa:o,voci:e}=await Promise.resolve().then(()=>(In(),On)),{CATEGORIE_BLOCCHI:a}=await Promise.resolve().then(()=>(at(),ti)),{CATALOGO:n}=await Promise.resolve().then(()=>(ge(),ki));Ze=t({entita:Mt,dove:()=>({x:C.x,y:C.y,z:C.z}),coloreDi:c=>{let u=Xn(c);return u==null?"#888888":"#"+(u>>>0).toString(16).padStart(6,"0")},nomeDi:We,rigaDi:we,onVaiA:c=>{c&&(C.x=c.x,C.z=c.z,C.y=c.y+2.5,C.vy=0,bt=null)}});let s=o({elenco:e({categorie:a,blocchi:et,catalogo:n,nomeArredo:We}),inMano:()=>Ot[Xt]??null,onPrendi:js}),l={get volo(){return Te},get terza(){return _e},impostaVolo:Gn,dove:()=>`x ${C.x.toFixed(1)} y ${C.y.toFixed(1)} z ${C.z.toFixed(1)}`,aCasa:()=>{C.x=.5,C.z=.5,C.y=Vn(0,0)+.5,C.vy=0},modifiche:()=>Aa(V),nuovo:()=>{try{localStorage.removeItem(Xo)}catch{}location.search=`?seme=${O.seme}&nuovo`}};document.body.classList.add("con-officina"),l.cameraTira=()=>st.tira,l.impostaCameraTira=c=>st.tira=!!c,l.buco=()=>st.buco,l.impostaBuco=c=>st.buco=!!c,l.miraCentro=()=>Qe,l.impostaMiraCentro=Yn,Ee=i({gruppi:[{contenitore:document.getElementById("rqGerarchia"),etichetta:"Gerarchia",registri:[Ze.gerarchia],azioni:!1},{contenitore:document.getElementById("rqAssets"),etichetta:"Assets",registri:[s],azioni:!1},{contenitore:document.getElementById("rqIspettore"),etichetta:"Ispettore",registri:[Ze.ispettore],azioni:!0},{contenitore:document.getElementById("rqImpostazioni"),etichetta:"Impostazioni",azioni:!1,registri:[en(E,Va),on(E),nn(oe),an(Ye),rn(pt,Ko),sn(kt),cn(l),ln({zoo:O.zoo,vetrina:O.vetrina,seme:O.seme})]}],campione:()=>({disegni:E.statistiche.disegni+Y.statistiche.disegni+E.statistiche.disegniAcqua+E.statistiche.disegniErba+E.statistiche.disegniSpecchio,rtMs:null}),autore:"partita",titolo:"Officina \xB7 partita",apertoSubito:!0,scuro:!0,agganciaFrame:c=>Ua=c}),document.getElementById("chiudiDock").addEventListener("click",()=>document.body.classList.remove("con-officina"))}document.getElementById("apriOfficina").addEventListener("click",$a);async function Wn(){Ee?document.body.classList.add("con-officina"):await $a(),Ee&&Ee.vaiA&&Ee.vaiA("creativa")}document.getElementById("apriCreativa").addEventListener("click",Wn);K.has("officina")&&$a();var Ba=new go(()=>({versione:(document.getElementById("versione")||{}).textContent||"partita in sviluppo",mobile:matchMedia("(pointer: coarse)").matches,tocco:navigator.maxTouchPoints>0,modoGui:Vs.scelta,ua:navigator.userAgent,cpu:navigator.hardwareConcurrency||null,memoriaGB:navigator.deviceMemory||null,css:[J.clientWidth,J.clientHeight],reso:[J.width,J.height],dpr:devicePixelRatio,livello:0,quantiLivelli:1,manuale:!0,profilo:{banco:"partita sul nucleo",seme:O.seme,raggio:O.raggio,erba:O.erba,ombra:E.ombra,specchio:O.specchio,disegniSpecchio:E.statistiche.disegniSpecchio,corpi:pt.statistiche.corpi,dprMax:O.dprMax,jsMs:+xt(ae,.5).toFixed(2),jsP99:+xt(ae,.99).toFixed(2),streaming:{...kt.statistiche},finestra:E.finestra&&E.finestra.spostamenti},ombreLampade:!1,antialias:!0,fps:xt(dt,.5)?1e3/xt(dt,.5):null,p50:xt(dt,.5),p99:xt(dt,.99),disegni:E.statistiche.disegni+Y.statistiche.disegni+E.statistiche.disegniAcqua+E.statistiche.disegniErba+E.statistiche.disegniSpecchio,triangoli:E.statistiche.triangoli+Y.statistiche.triangoli+E.statistiche.triangoliAcqua+E.statistiche.triangoliErba+E.statistiche.triangoliSpecchio,ombreMs:0,storiaFps:Go,storiaLivelli:[],scheda:Wo(ze),software:/swiftshader|llvmpipe/i.test(Wo(ze)),chunk:E.statistiche.chunkTotali,blocchi:V.contaBlocchi,luci:0,decorazioni:Mt.conta,erba:E.statistiche.triangoliErba,ora:`${Math.floor(oe.ora*24)}h`,giorno:0,worldgenMs:qn,meshMs:qn}),()=>(E.disegna(Yo(),0,Y),Y.disegna(E,Yo()),E.disegnaAcqua(),Promise.resolve(J.toDataURL("image/webp",.6)))),Qn=!1,vt=null,je=null,Vo=new Map,Jn=0;function cc(i){if(!Do)return;let t=Math.ceil(Math.sqrt(Math.max(1,i))),o=Math.round(C.x),e=Math.round(C.z);for(let a=0;a<Do.arredi.length;a++){let n=Do.arredi[a];if(a>=i){Vo.has(n)&&(Y.istanze(n,lc,8),Vo.delete(n));continue}Y.tipi.has(n)||Y.registra(n,Do.arrediDef.get(n).costruisci());let r=o-t/2+a%t,s=e-t/2+Math.floor(a/t),l=Vo.get(n);l||(l=new Float32Array(32),Vo.set(n,l));for(let c=0;c<4;c++){let u=(c&1)*.45,d=(c>>1)*.45,f=c*8;l[f]=r+u,l[f+1]=uc(Math.floor(r+u),Math.floor(s+d)),l[f+2]=s+d,l[f+3]=1,l[f+4]=1,l[f+5]=1,l[f+6]=1,l[f+7]=(a*.7+c)%6.28}Y.istanze(n,l,8)}Jn=i}var lc=new Float32Array(0);function uc(i,t){for(let o=60;o>-8;o--)if(V.pieno(i,o,t))return o+1;return 8}function $o(i){if(!i)return;E.lampadeAccese=i.pozze!==!1,Qn=!!i.ar,i.arredi!==Jn&&cc(i.arredi|0);let t=i.corpi|0;if(t>pt.statistiche.corpi)for(let o=pt.statistiche.corpi;o<t;o++)pt.aggiungi({x:C.x+(Math.random()-.5)*24,y:C.y+8+Math.random()*14,z:C.z+(Math.random()-.5)*24,lato:.3+Math.random()*.35,colore:Ce[o%Ce.length],giro:Math.random()*Math.PI})}function fc(i){let t=E.statistiche,o=Y.statistiche,e=vt.passo(i,{disegni:t.disegni+o.disegni+t.disegniAcqua+t.disegniErba+t.disegniSpecchio,triangoli:t.triangoli+o.triangoli+t.triangoliAcqua+t.triangoliErba+t.triangoliSpecchio,istanze:o.istanze||0,chunk:t.chunkVisti});e.cambiato&&$o(e.carico),je&&je.aggiorna(),vt.fase==="finito"&&(vt=null)}Promise.resolve().then(()=>(Nn(),Rn)).then(({TastoOmega:i})=>{if(je=new i({inBanco:O.omega,vaiAlBanco:()=>{location.search="?omega&banco&raggio="+O.raggio},avvia:()=>(vt=new De,$o(vt.avvia()),vt),ferma:()=>{vt&&vt.ferma(),vt=null,$o({pozze:!0,arredi:0,corpi:0,ar:!1})},manda:t=>{Ba.allega("omega",t),Ba.apri()}}),O.omega&&K.has("banco")){let t=()=>{if(kt.statistiche.inCoda>0)return setTimeout(t,400);vt=new De,$o(vt.avvia()),je.banco=vt,je.apri()};setTimeout(t,1500)}}).catch(i=>console.warn("omega test:",i.message));globalThis.PARTITA={resa:E,modelli:Y,mondo:V,passeggero:C,sguardo:Kt,corpi:pt,streaming:kt,entita:Mt,simAcqua:ka,opz:O,lanciaCubi:Ko,intento:rt,zoom:()=>ie,mirato:()=>F,statistiche:()=>({fps:1e3/(xt(dt,.5)||1),p50:xt(dt,.5),p99:xt(dt,.99),js:xt(ae,.5),...E.statistiche,modelli:{...Y.statistiche},streaming:{...kt.statistiche},corpi:{...pt.statistiche},fotogrammi:jn}),diagnostica:Ba};

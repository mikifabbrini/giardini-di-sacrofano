// Apertura del sito, menu e pagina Contatti (Michele 14/10/2026). Solo nella copia di prova.
// Scena 1: sfondo sfocato della Vista iniziale e scritta che si scrive da sola (circa 4 s) mentre dietro carica il rendering.
// Scena 2: logo GdS, payoff, "Scorri per iniziare" quando il rendering e' pronto. Scena 3: logo in alto a sinistra, menu, rendering vero.
(function(){
const B=document.body, mob=()=>innerWidth<720, ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
const g=window.gsap;if(g)g.ticker.lagSmoothing(0); // il rendering carica dietro: i tempi restano veri anche se il browser e' occupato
let pronto=false, scena=1, entrato=false;
// pagine separate (15/10): l'apertura completa solo sulla Home la prima volta; nelle altre pagine logo e "Ci siamo quasi" finche' carica
const APT_ALL_INIZIO=(location.search.match(/apt=(\d+)/)||[])[1]||0;
const PAG=(window.SITO&&SITO.pagina)||'home',LIV=window.SITO&&SITO.livello;
let visto=false;try{visto=sessionStorage.getItem('gds-apertura')==='1';}catch(e){}
const MODO=PAG==='contatti'?'nessuna':(PAG==='home'&&!visto&&!location.search.match(/(vista|park)=/)?'piena':'breve');
const VAI=u=>{location.href=u;};
const SLUG={T:'piani/terra/','1':'piani/primo/','2':'piani/primo/',B:'piani/terra/'};
if(MODO!=='nessuna'){B.classList.add('ap-attiva');window.__apIntro=true;}
if(MODO==='breve')window.__apLibera=true;
// finche' c'e' l'apertura il rendering dietro non si ridisegna a vuoto: la scheda video resta libera per la scritta
const ferma=setInterval(()=>{if(!document.getElementById('ap-intro')){clearInterval(ferma);return;}if(window.RV)RV.forza=0;},100);

// ---------- scene 1 e 2 ----------
const intro=document.createElement('div');intro.id='ap-intro';intro.setAttribute('role','dialog');intro.setAttribute('aria-label','Giardini di Sacrofano');
const due=mob();
const lettere=t=>[...t].map(c=>c===' '?'<tspan class="sp"> </tspan>':`<tspan>${c}</tspan>`).join('');
intro.innerHTML=`<div class="ap-bg"></div><div class="ap-bg ap-bg2"></div><div class="ap-velo"></div>
 <div class="ap-scena">
  <svg id="ap-scritta" viewBox="${due?'0 0 600 360':'0 0 1200 260'}" aria-label="I giardini di Sacrofano" role="img">
   <defs><clipPath id="ap-clip"><rect id="ap-clip-r" x="0" y="0" width="0" height="${due?360:260}"/></clipPath></defs>
   <g>${due
     ?`<text x="300" y="150" text-anchor="middle" font-size="128">${lettere('I giardini')}</text><text x="300" y="300" text-anchor="middle" font-size="128">${lettere('di Sacrofano')}</text>`
     :`<text x="600" y="170" text-anchor="middle" font-size="150">${lettere('I giardini di Sacrofano')}</text>`}</g>
  </svg>
 </div>
 <div class="ap-logo"><img src="logo-chiaro.svg" alt="Giardini di Sacrofano"></div>
 <p class="ap-payoff" aria-label="Il quartiere green di Roma Nord">${[...'Il quartiere green di Roma Nord'].map(c=>`<span aria-hidden="true">${c}</span>`).join('')}</p>
 <div class="ap-attesa" aria-live="polite">Ci siamo quasi<i></i><i></i><i></i></div>
 <button class="ap-scorri" type="button"><span>Scorri per iniziare</span><span class="ap-freccia"><svg viewBox="0 0 16 16"><path d="M8 2v11M3.5 8.5 8 13l4.5-4.5"/></svg></span></button>`;
if(MODO!=='nessuna')B.appendChild(intro);
const $i=s=>intro.querySelector(s);
const testi=[...intro.querySelectorAll('#ap-scritta text')];
// il vecchio velo di caricamento del rendering resta sotto: ci pensa l'apertura a coprire
const nasc=document.createElement('style');nasc.textContent='#veloFoto{visibility:hidden!important}';document.head.appendChild(nasc);
addEventListener('ap-sito-pronto',()=>{window.__apPronto=window.__apPronto||Math.round(performance.now());pronto=true;if(MODO==='breve'){scena=2;setTimeout(entra,200);}else mostraScorri();});
// riserva: se per qualche motivo il segnale non arriva, dopo 40 s si lascia entrare comunque
setTimeout(()=>{if(!pronto){pronto=true;if(MODO==='breve'){scena=2;entra();}else mostraScorri();}},40000);

function scrivi(){window.__apW='inizio@'+Math.round(performance.now());
 // Michele 14/10: le lettere si scrivono una alla volta (I, g, i, a, r, d...), poi tutta la scritta si riempie; in tutto 5,5 secondi
 const L=[...intro.querySelectorAll('#ap-scritta tspan:not(.sp)')];
 L.forEach(t=>{let w=60;try{w=t.getComputedTextLength();}catch(e){} const d=Math.ceil(w*16+400);t.style.strokeDasharray=d;t.style.strokeDashoffset=d;t.dataset.d=d;});
 if(ridotto||!g){L.forEach(t=>{t.style.strokeDashoffset=0;});testi.forEach(t=>t.style.fillOpacity=1);setTimeout(scena2,1200);return;}
 const SCRIVI=4.2,passo=SCRIVI/(L.length+1.2),durata=passo*2.2;
 const tl=g.timeline({onComplete:scena2});
 L.forEach((t,k)=>tl.to(t,{strokeDashoffset:0,duration:durata,ease:'power1.inOut'},k*passo));
 tl.to(testi,{fillOpacity:1,duration:.9,ease:'power2.out'},SCRIVI+.05).to(testi,{strokeWidth:0,duration:.4},SCRIVI+.45).to({},{duration:.15});
}
function scena2(){window.__apW+=' fine@'+Math.round(performance.now());
 scena=2;
 if(!g){$i('#ap-scritta').style.display='none';$i('.ap-bg2').style.opacity=1;$i('.ap-logo').style.opacity=1;$i('.ap-payoff').style.opacity=1;mostraScorri();dispatchEvent(new Event('ap-via-libera'));return;}
 const tl=g.timeline();
 tl.to('#ap-scritta',{opacity:0,y:-26,scale:.96,filter:'blur(10px)',duration:.9,ease:'power2.in'})
   .to('.ap-bg2',{opacity:1,duration:1.4,ease:'power2.inOut'},0).to('.ap-velo',{opacity:.55,duration:1.4,ease:'power2.inOut'},0)
   .fromTo('.ap-logo',{opacity:0,scale:.82,filter:'blur(12px)'},{opacity:1,scale:1,filter:'blur(0px)',duration:1.2,ease:'expo.out'},'-=.15')
   .set('.ap-payoff',{opacity:1},'-=.6')
   .fromTo('.ap-payoff span',{opacity:0,y:22,rotationX:-70,transformOrigin:'50% 100%'},{opacity:1,y:0,rotationX:0,duration:.8,ease:'back.out(1.6)',stagger:.028},'-=.6')
   .add(()=>{if(!pronto)g.to('.ap-attesa',{opacity:.8,duration:.4});mostraScorri();setTimeout(()=>dispatchEvent(new Event('ap-via-libera')),120);});
}
function mostraScorri(){
 if(scena!==2||!pronto||!g&&scena!==2)return;
 if(!g){const s=$i('.ap-scorri');s.style.visibility='visible';s.style.opacity=1;return;}
 g.to('.ap-attesa',{opacity:0,duration:.3});
 g.set('.ap-scorri',{visibility:'visible'});
 g.fromTo('.ap-scorri',{opacity:0,y:14},{opacity:1,y:0,duration:.7,ease:'power2.out'});
 if(!ridotto)g.to('.ap-scorri .ap-freccia',{y:6,duration:.9,ease:'sine.inOut',yoyo:true,repeat:-1,delay:.7});
}

// ---------- scena 3: si entra nel rendering ----------
function entra(){
 if(entrato||scena!==2||!pronto)return; entrato=true;
 const logo=$i('.ap-logo'),brand=document.querySelector('.top .brand img.lg-c')||document.querySelector('.top .brand');
 const a=logo.getBoundingClientRect(),b=brand.getBoundingClientRect();
 const fine=()=>{window.__apDentro=Math.round(performance.now());B.classList.remove('ap-attiva');intro.remove();try{sessionStorage.setItem('gds-apertura','1');}catch(e){}
  if(PAG==='home'){const v=(location.search.match(/vista=(\w+)/)||[])[1],pk=(location.search.match(/park=(\d)/)||[])[1];if(v)azioni.vista(v);else if(pk)azioni.park(pk);else frase();}
  if(window.RV)RV.forza=Math.max(RV.forza,60);};
 if(!g||ridotto){fine();return;}
 const dx=(b.left+b.width/2)-(a.left+a.width/2),dy=(b.top+b.height/2)-(a.top+a.height/2),sc=b.width/a.width;
 const tl=g.timeline({onComplete:fine});
 tl.to(['.ap-payoff','.ap-scorri','.ap-attesa'],{opacity:0,y:-10,duration:.45,ease:'power2.in'},0)
   .to(logo,{x:dx,y:dy,scale:sc,transformOrigin:'50% 50%',duration:1.15,ease:'power3.inOut'},.1)
   .to('.ap-velo',{opacity:0,duration:1.1,ease:'power2.inOut'},.25)
   .to('.ap-bg',{opacity:0,filter:'blur(0px)',scale:1,duration:1.3,ease:'power2.inOut'},.25)
   .add(()=>{B.classList.remove('ap-attiva');g.fromTo(['.top .brand','#ap-nav','.ap-burger'],{opacity:0},{opacity:1,duration:.01});
     g.fromTo('#ap-nav>*',{opacity:0,y:-12},{opacity:1,y:0,duration:.55,ease:'power2.out',stagger:.06});
     g.fromTo(['.ctx','#ap-giornosera','.note'],{opacity:0,y:12},{opacity:1,y:0,duration:.6,ease:'power2.out',stagger:.08,clearProps:'transform'});
     g.to(logo,{opacity:0,duration:.25});},1.2);
}
intro.addEventListener('click',entra);
intro.addEventListener('wheel',e=>{if(Math.abs(e.deltaY)>4)entra();},{passive:true});
let y0=null;intro.addEventListener('touchstart',e=>{y0=e.touches[0].clientY;},{passive:true});
intro.addEventListener('touchmove',e=>{if(y0!==null&&Math.abs(e.touches[0].clientY-y0)>28)entra();},{passive:true});
addEventListener('keydown',e=>{if(document.getElementById('ap-intro')&&['ArrowDown','PageDown',' ','Enter'].includes(e.key)){e.preventDefault();entra();}});

function frase(){
 // Michele 14/10 sera: solo scritta, senza sfondo, su due righe; entra animata ed esce dopo qualche secondo o al primo tocco
 const f=document.createElement('div');f.id='ap-frase';f.setAttribute('role','status');
 const piccola=matchMedia('(hover:none) and (pointer:coarse)').matches||mob()?'Trascina con un dito per ruotare, zooma con due dita per entrare nei dettagli':'Trascina per ruotare, zooma per entrare nei dettagli';
 f.innerHTML=`<span class="ap-f1">La tua futura casa, da ogni angolazione</span><span class="ap-f2">${piccola}</span>`;B.appendChild(f);
 const via=()=>{if(!f.parentNode)return;if(g)g.to(f.children,{opacity:0,y:-12,filter:'blur(6px)',duration:.6,stagger:.08,ease:'power2.in',onComplete:()=>f.remove()});else f.remove();};
 if(g){g.fromTo(f.querySelector('.ap-f1'),{opacity:0,y:22,filter:'blur(8px)'},{opacity:1,y:0,filter:'blur(0px)',duration:1,ease:'power3.out',delay:.25});
   g.fromTo(f.querySelector('.ap-f2'),{opacity:0,y:14},{opacity:1,y:0,duration:.8,ease:'power2.out',delay:.65});}
 else f.style.opacity=1;
 setTimeout(via,6500); // Michele: resta almeno 5 secondi e non sparisce se si tocca o si scorre
}


// ---------- pagine: i bottoni del rendering (Esplora i piani, i piani, gli appartamenti, indietro) portano alla pagina giusta ----------
const _showPiani=showPiani,_openLevel=openLevel,_openApt=openApt,_showEdificio=showEdificio;
if(PAG==='home'){showPiani=()=>VAI('piani/');openLevel=id=>VAI(SLUG[id]);openApt=n=>VAI(SLUG[lvApt(n)]+'?apt='+n);}
if(PAG==='piani'){showEdificio=()=>VAI('./');openLevel=id=>VAI(SLUG[id]);openApt=n=>VAI(SLUG[lvApt(n)]+'?apt='+n);}
// singolo piano (Michele 15/10): la vista interna resta quella di prima (pianta con i muri tagliati), cambia solo dove stanno gli elementi, come nella divisione dei piani
const vediPiano=id=>{_openLevel(id);
  if(id==='T'&&LV.B&&typeof fadeLevel==='function'){fadeLevel(LV.B,true);wallCut(LV.B,.42);slabShow(LV.B,false);} /* il 14 sta a terra accanto al piano terra, col suo giardino */
  Object.keys(LV).forEach(k=>{LV[k].grp.visible=k===id||(id==='T'&&k==='B');});
  if(id!=='T')scene.traverse(o=>{if(o.isInstancedMesh)o.visible=false;});
  if(id==='T'||id==='1')tettiScaleVia(id);
  if(id==='T'){piantaDWG('T');piantaDWG('B');}
  if(id==='B')piantaDWG('B');
  if(id==='1'){piantaDWG('1');piantaDWG('2');}
  if(id==='1'&&LV['2']){tettiScaleVia('2');vediPiano.camino2();}
  // secondo piano (Michele 16/10): via il camino dell'11 col cappello e la girandola
  if(id==='2')vediPiano.camino2();
  if(false){const via=[];LV['2'].grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),sz=b.getSize(new THREE.Vector3());if(Math.hypot(c.x+4.05,c.z-.15)<.7&&Math.max(sz.x,sz.z)<1.3)via.push(o);});via.forEach(o=>o.visible=false);console.log('camino 11 via',via.length);}
  // forno del 14 tagliato all'altezza dei muri della pianta: segue i muri del 14 (Michele 15/10)
  if((id==='T'||id==='B')&&LV.B&&LV.B.walls){const f=[];LV.B.grp.traverse(o=>{if(!o.isMesh||o.parent===LV.B.walls)return;const m=Array.isArray(o.material)?o.material[0]:o.material,b=new THREE.Box3().setFromObject(o);
    if(m&&m.color&&m.color.getHexString()==='ededea'&&Math.abs(b.min.x-8.85)<.1&&Math.abs(b.max.z-31.27)<.1)f.push(o);});const W=LV.B.walls,sy=W.scale.y;W.scale.y=1;W.updateMatrixWorld(true);f.forEach(o=>W.attach(o));W.scale.y=sy;W.visible=true;}};
// piano terra aperto (Michele 15/10): via tetti, tegole e scale (quella dell'8, quella del 12 e quella della rampa a est con la ringhiera)
const tettiScaleVia=(id='T')=>{const G=id==='T'?[LV.T,LV.B]:[LV[id]],Y=LV[id].grp.position.y; /* quote relative al pavimento del piano */
  // gradini: almeno 3 pezzi uguali e sottili, in fila, ognuno a un'altezza diversa
  const gradini=new Set(),V=new THREE.Vector3(),cl={};G.forEach(L=>L&&L.grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||!m.color||m.color.getHexString()==='c8ccd0')return;
   const b=new THREE.Box3().setFromObject(o),sz=b.getSize(V),c=b.getCenter(new THREE.Vector3());if(sz.y<.4&&Math.max(sz.x,sz.z)<3&&Math.min(sz.x,sz.z)>.15&&b.min.y-Y>.05&&b.max.y-Y<3.2){const k=[sz.x.toFixed(1),sz.z.toFixed(1),Math.round((sz.x>sz.z?c.x:c.z)*2)].join('|'); /* i gradini salgono lungo il lato corto: in fila sull'altro asse */(cl[k]=cl[k]||[]).push([o,b.min.y.toFixed(2)]);}}));
  Object.values(cl).forEach(a=>{if(new Set(a.map(e=>e[1])).size>=3)a.forEach(e=>gradini.add(e[0]));});
  const zone=[[4.5,6.1,10.2,13.9],[-8.3,-6.1,4.8,5.9],[17.5,21.8,5.3,10.6]],scala12=[-8.45,-4.75,4.6,8.3]; /* scala che porta all'11 e al 12: gradini, rampa obliqua, corrimano */let n=0;
  G.forEach(L=>L&&L.grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m)return;
   const h=m.color?m.color.getHexString():'',src=m.map&&m.map.image&&String(m.map.image.src||m.map.image.currentSrc||'')||'';
   const tetto=/clay_roof_tiles/.test(src)||((h==='5e5048'||h==='8a8078')&&/weathered_brown_planks/.test(src))||h==='3a1206'; /* tetti, tettoie col loro legno, tegole */
   const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),sy=b.max.y-b.min.y;
   const inZona=id==='T'&&zone.some(([x0,x1,z0,z1])=>c.x>x0&&c.x<x1&&c.z>z0&&c.z<z1);
   const in12=id==='T'&&c.x>scala12[0]&&c.x<scala12[1]&&c.z>scala12[2]&&c.z<scala12[3]&&(h==='ffffff'||h==='4a2e1a')&&b.max.y>.4;
   const scala=id!=='2'&&((inZona&&b.min.y>.3&&sy<.45)||h==='6e4a33'||gradini.has(o)||in12); /* al livello 2 (zona notte dell'11) la scala interna resta */
   const lampada4=id==='T'&&Math.hypot(c.x+.59,c.z-5.3)<.4&&b.min.y>2.2&&b.max.y<2.8; /* applique sul muro del 4 (Michele 15/10) */
   const sz=b.getSize(new THREE.Vector3()),lampada=id==='1'&&(h==='151515'||h==='e8e2cf')&&Math.max(sz.x,sz.y,sz.z)<.5&&b.min.y-Y>1.9; /* primo piano: lampade a muro sopra i muri tagliati */
   // primo piano (Michele 16/10): la scala esterna verso il 13 (x 0,2/2,3) con la sua ringhiera, la ringhiera in cima alla scala del 12,
   // i travetti della pergola dell'8 e i pezzi di muro alti del portico del 12 che restano sospesi sopra la pianta
   const p1=id==='1'&&(((h==='594033'||h==='d4d6d8')&&c.x>.1&&c.x<2.4&&c.z>-5.4&&c.z<-2.5&&b.max.y-Y>.3)||(h==='1f140c'&&c.x>-8.1&&c.x<-6.1&&c.z>3.4&&c.z<3.8)||h==='24180f'||(h==='ededea'&&b.min.y-Y>2.5));
   // primo piano (Michele 16/10): via anche i telai alti delle portefinestre e la grata scura del 12; la ringhiera fra 12 e 11 resta
   const szT=b.getSize(new THREE.Vector3()),telaio=id==='1'&&b.max.y-Y>1.3&&(h==='f3f2ee'||h==='e9e9e6'||(h==='ededea'&&Math.min(szT.x,szT.z)<.25&&Math.max(szT.x,szT.z)<2.2&&szT.y>2))||(id==='1'&&h==='2b2e32');
   if(tetto||scala||lampada4||lampada||p1||telaio){o.visible=false;n++;}}));console.log('piano',id,': via tetti e scale',n);}; /* siepi e cespugli stanno a terra: solo col piano terra */ /* gli altri piani spariscono del tutto, anche tetti e camini spostati */
vediPiano.camino2=()=>{const via=[];LV['2'].grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),sz=b.getSize(new THREE.Vector3());if(Math.hypot(c.x+4.05,c.z-.15)<.7&&Math.max(sz.x,sz.z)<1.3)via.push(o);});via.forEach(o=>o.visible=false);};
// PIANTA DAL DWG (Michele 16/10): quando si apre un piano, i muri del rendering lasciano il posto ai muri ricavati
// dalle linee del DWG (pianta/pianta_<livello>.json, generata con pianta/gen.py), tagliati a 1,10 m come una pianta,
// con finestre, scale e nomi dei vani. Il rendering resta com'e'.
const PIANTE={},TAGLIO=1.1;window.PIANTE=PIANTE; /* veloce.js aspetta le piante prima di fondere i pezzi */
const piantaDWG=id=>{if(PIANTE[id]||!LV[id])return;PIANTE[id]='carica';
 fetch('pianta/pianta_'+id+'.json?v=10').then(r=>r.json()).then(P=>{const L=LV[id],G=new THREE.Group();G.name='piantaDWG';
  const forma=r=>{const sh=new THREE.Shape(r[0].map(([x,z])=>new THREE.Vector2(x,-z)));for(const h of r.slice(1))sh.holes.push(new THREE.Path(h.map(([x,z])=>new THREE.Vector2(x,-z))));return sh;};
  const estrudi=(rs,h,mats,y0=0)=>{const g=new THREE.ExtrudeGeometry(rs.map(forma),{depth:h,bevelEnabled:false,curveSegments:1});g.rotateX(-Math.PI/2);const m=new THREE.Mesh(g,mats);m.position.y=y0;m.castShadow=m.receiveShadow=true;return m;};
  const cap=new THREE.MeshLambertMaterial({color:0x3a4a40,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1}),lato=new THREE.MeshLambertMaterial({color:0xf6f5f1});
  G.add(estrudi(P.muri,TAGLIO-.006,[cap,lato],.006)); /* base staccata di 6 mm dal pavimento: niente sfarfallio */
  const davanzale=new THREE.MeshLambertMaterial({color:0xe9ecea}),vetro=new THREE.MeshBasicMaterial({color:0x8fc3d6});
  if(P.finestre.length){G.add(estrudi(P.finestre,.894,[davanzale,lato],.006));const v=estrudi(P.finestre,.012,[vetro,vetro],.906);G.add(v);}
  // pavimenti speciali (terrazzino bianco fra 5 e 7)
  for(const pv of (P.pavimenti||[])){const pm=new THREE.MeshLambertMaterial({color:parseInt(pv.colore,16)});G.add(estrudi(pv.anelli,.02,[pm,pm],.045));}
  // scale: gradini disegnati come righe sul pavimento
  const sm=new THREE.LineBasicMaterial({color:0x5a6560});const pts=[];for(const [a,b] of P.scale){pts.push(new THREE.Vector3(a[0],.03,a[1]),new THREE.Vector3(b[0],.03,b[1]));}
  if(pts.length)G.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(pts),sm));
  // nomi dei vani, appoggiati sul pavimento
  for(const [x,z,t] of P.testi){const c=document.createElement('canvas'),k=c.getContext('2d'),fs=56;k.font='600 '+fs+'px system-ui,sans-serif';const w=Math.ceil(k.measureText(t).width)+20;c.width=w;c.height=fs+20;k.font='600 '+fs+'px system-ui,sans-serif';k.fillStyle='rgba(60,72,66,.85)';k.textBaseline='middle';k.fillText(t,10,c.height/2);
   const tx=new THREE.CanvasTexture(c);tx.anisotropy=4;const hgt=.32,pl=new THREE.Mesh(new THREE.PlaneGeometry(hgt*c.width/c.height,hgt),new THREE.MeshBasicMaterial({map:tx,transparent:true,depthWrite:false}));pl.rotation.x=-Math.PI/2;pl.position.set(x+hgt*c.width/c.height/2,.035,z);G.add(pl);}
  G.position.y=0;L.grp.add(G);PIANTE[id]=G;
  // al posto dei muri del rendering: via muri, finestre e infissi del rendering dentro la sagoma dell'edificio
  const sag=P.muri.map(r=>r[0]);const dentro=(x,z)=>sag.some(poly=>{let c=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const [xi,zi]=poly[i],[xj,zj]=poly[j];if((zi>z)!==(zj>z)&&x<(xj-xi)*(z-zi)/(zj-zi)+xi)c=!c;}return c;});
  const infissi=new Set(['ededea','f3f2ee','030202','e9e9e6','d7d3c8','d2d8de','1f140c','151515','e8e2cf','2b2e32','10181d','4a2e1a','594033','c4c8cc','8e8c86']);const Y=L.grp.position.y;let n=0;
  const gruppi=id==='T'?[LV.T,LV.B]:[L];gruppi.forEach(Lx=>Lx&&Lx.grp.traverse(o=>{if(!o.isMesh||!o.visible||o.parent===G||G===o)return;let p=o;while(p){if(p===G)return;p=p.parent;}
   const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||!m.color)return;const b=new THREE.Box3().setFromObject(o);if(b.max.y-Y<.3)return;const c=b.getCenter(new THREE.Vector3());
   const vicino=dentro(c.x,c.z)||sag.some(poly=>poly.some(([x,z])=>Math.hypot(x-c.x,z-c.z)<.4));
   if(vicino&&(infissi.has(m.color.getHexString())||(m.color.getHexString()==='ffffff'&&!m.map))){o.visible=false;n++;}}));
  // (Michele 16/10 sera) anche fuori dalla sagoma: via i muri bianchi alti del rendering (portico del 5, giardino del 6),
  // il pezzo obliquo della scala dell'8 e il bordo del suo muretto rimasto sospeso
  L.grp.traverse(o=>{if(!o.isMesh||!o.visible)return;let q=o;while(q){if(q===G)return;q=q.parent;}const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||!m.color)return;const h=m.color.getHexString(),b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3());
   const alto=b.max.y-Y>1.25&&(h==='ededea'||h==='f6f5f1'||h==='ffffff'||h==='f3f2ee')&&!m.map;
   const T_=id==='T';const scala8=T_&&c.x>4.3&&c.x<5.75&&c.z>6.4&&c.z<14.6&&(b.min.y-Y>.3||b.max.y-b.min.y>.5);
   const scala1112=T_&&c.x>-6.4&&c.x<-4.5&&c.z>4.5&&c.z<8.4&&b.min.y-Y>.4; /* muro sospeso sopra la scala fra il 3 e il 4 (Michele 16/10 sera) */
   const sospeso=T_&&(h==='d4d6d8'||h==='d7d3c8'||h==='9c9a92')&&b.min.y-Y>.7&&b.max.y-b.min.y<.2&&c.x>4&&c.x<13&&c.z>6&&c.z<14.6;
   if(alto||scala8||sospeso||scala1112){o.visible=false;n++;}});
  console.log('pianta DWG',id,'muri',P.muri.length,'finestre',P.finestre.length,'nascosti del rendering',n);
  if(window.RV)RV.forza=Math.max(RV.forza||0,60);
 }).catch(e=>{console.warn('pianta DWG',e);PIANTE[id]=null;});};
// ogni fotogramma: con la pianta DWG attiva i muri del rendering restano spenti
const _rPianta=renderer.render.bind(renderer);renderer.render=(sc,ca)=>{for(const id in PIANTE){const G=PIANTE[id];if(G&&G!=='carica'&&LV[id]){LV[id].walls.visible=false;LV[id].mass.visible=false;}}_rPianta(sc,ca);};
if(PAG==='piano'){showEdificio=()=>VAI('./');showPiani=()=>VAI('piani/');openLevel=id=>id===LIV?vediPiano(id):VAI(SLUG[id]);openApt=(n,f)=>aptQui(n)?_openApt(n,f):VAI(SLUG[lvApt(n)]+'?apt='+n);}

// ---------- piani tagliati per piano (Michele 15/10, "come Fruit Ninja") ----------
// tutto resta com'era, ma ogni pezzo va col suo piano: quello che tocca terra e' del piano terra; il resto si taglia alle quote
// dei solai (+2,90 e +5,95) e ogni fetta si muove col piano a cui appartiene quando i piani si separano
if(PAG==='piani'||PAG==='piano'){
 if(PAG==='piani'&&typeof EXPLODE==='object'){EXPLODE['1']=13;EXPLODE['2']=13;} /* 16/10: due livelli staccati, la zona notte dell'11 resta appoggiata sul primo */

 // APERTURA DI ESPLORA PIANI (Michele 16/10): si vede la casa intera, poi il primo piano si solleva come un plastico che si apre
 // (GSAP, circa 2,5 s); alla fine compaiono i nomi dei piani. Un clic o un tocco durante l'animazione salta alla fine.
 const apriPlastico=m=>{
  const camFin=m?[10,62,170]:[20,50,140],tgtFin=m?[2,14,6]:[2,13,2];
  const fine=()=>{_showPiani();camTo(camFin,tgtFin,1);mostraNomi();};
  const g=window.gsap;
  if(!g||(typeof S!=='undefined'&&S.reduced)){fine();return;}
  const camIn=m?[12,34,104]:[16,24,78],tgtIn=m?[2,2,6]:[2,2,2];
  Object.values(LV).forEach(L=>{L.grp.position.y=L.base;});camera.position.set(...camIn);controls.target.set(...tgtIn);camera.lookAt(controls.target);controls.update();
  Object.values(floorLabels||{}).forEach(b=>{b.style.opacity=0;});
  S.view='piani'; /* i collegamenti (passerelle) seguono il primo piano mentre sale */
  const su={k:0},cp=camera.position,ct=controls.target,c0=cp.clone(),t0=ct.clone();
  const sali=()=>{['1','2'].forEach(id=>{const L=LV[id];if(L)L.grp.position.y=L.base+EXPLODE[id]*su.k;});
   cp.set(c0.x+(camFin[0]-c0.x)*su.c,c0.y+(camFin[1]-c0.y)*su.c,c0.z+(camFin[2]-c0.z)*su.c);
   ct.set(t0.x+(tgtFin[0]-t0.x)*su.c,t0.y+(tgtFin[1]-t0.y)*su.c,t0.z+(tgtFin[2]-t0.z)*su.c);camera.lookAt(ct);controls.update();
   if(window.RV)RV.forza=Math.max(RV.forza||0,3);};
  su.c=0;
  const tl=g.timeline({onUpdate:sali,onComplete:()=>{toglisalto();fine();}});
  tl.to(su,{k:0,duration:.7})                                   // la casa intera, un attimo ferma
    .to(su,{k:1,duration:2.3,ease:'power3.inOut'},'apre')       // il primo piano si solleva
    .to(su,{c:1,duration:2.5,ease:'power2.inOut'},'apre-=.1');  // la vista si allontana insieme
  // il prato tondo della vista intera svanisce mentre i piani si aprono: un velo del colore dello sfondo, appena sopra il prato
  // (il prato ha uno shader suo che ignora la trasparenza); alla fine la vista dei piani lo spegne del tutto
  if(typeof ground!=='undefined'&&ground){const bg=scene.fog&&scene.fog.color?'#'+scene.fog.color.getHexString():'#e3ecf2';
   const gb=new THREE.Box3().setFromObject(ground),R=Math.max(gb.max.x-gb.min.x,gb.max.z-gb.min.z)/2+.5;
   const vm=new THREE.MeshBasicMaterial({color:new THREE.Color(bg),transparent:true,opacity:0,depthWrite:false,fog:false});
   const velo=new THREE.Mesh(new THREE.CircleGeometry(R,96),vm);velo.rotation.x=-Math.PI/2;velo.position.set((gb.min.x+gb.max.x)/2,gb.max.y+.004,(gb.min.z+gb.max.z)/2);velo.renderOrder=1;scene.add(velo);
   tl.to(vm,{opacity:1,duration:1.5,ease:'power1.inOut'},'apre+=.5');
   tl.eventCallback('onComplete',()=>{toglisalto();fine();scene.remove(velo);vm.dispose();velo.geometry.dispose();});}
  let saltaFino=0;
  const salta=e=>{if(tl.progress()<1){saltaFino=performance.now()+500;tl.progress(1);}};
  const mangia=e=>{if(performance.now()<saltaFino){e.stopPropagation();e.preventDefault();}};
  addEventListener('pointerdown',salta,true);addEventListener('click',mangia,true);
  const toglisalto=()=>{removeEventListener('pointerdown',salta,true);setTimeout(()=>removeEventListener('click',mangia,true),600);};
 };
 const mostraNomi=()=>{const g=window.gsap;const bs=Object.values(floorLabels||{});if(!g){bs.forEach(b=>b.style.opacity=1);return;}
  g.fromTo(bs,{opacity:0,x:-10},{opacity:1,x:0,duration:.5,stagger:.12,ease:'power2.out',clearProps:'transform'});};
 // passando sopra un piano si illumina; il 14 si accende insieme al piano terra
 if(PAG==='piani'&&typeof hotLevel==='function'){const _hl=hotLevel;hotLevel=function(id){const k=id==='B'?'T':id;_hl(k);if(LV.B){const c=k==='T'?(S.dir==="A"?0xd4efe0:0x2f5a43):PAL[S.dir].wall;LV.B.m.mass.color.set(c);LV.B.m.slab.color.set(k==='T'?c:PAL[S.dir].slab);}if(window.RV)RV.forza=Math.max(RV.forza||0,3);};}
 const affetta=()=>{
  const gruppi=Object.values(LV).map(L=>L.grp),dellaCasa=o=>{let p=o;while(p){if(gruppi.includes(p))return true;p=p.parent;}return false;};
  // per tagliare servono i piani alla loro quota vera
  Object.values(LV).forEach(L=>{L._yPrima=L.grp.position.y;L.grp.position.y=L.base;});if(typeof connectionsGroup!=='undefined'&&connectionsGroup)connectionsGroup.position.y=0;scene.updateMatrixWorld(true);
  const Q1=LV['1'].base,Q2=LV['2'].base,FASCE=[['T',-1e9,Q1],['1',Q1,Q2],['2',Q2,1e9]],SUOLO=1.5,tagli=[];
  renderer.localClippingEnabled=true;
  const pezzi=[];scene.traverse(o=>{if((o.isMesh||o.isLine||o.isLineSegments||o.isSprite)&&!o.isInstancedMesh&&!dellaCasa(o)&&o!==ground&&o.parent)pezzi.push(o);});
  for(const o of pezzi){const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())continue;
   if(b.min.y<SUOLO||!o.isMesh){const f=b.min.y<SUOLO?'T':(FASCE.find(([k,a,z])=>b.min.y+.05>=a&&b.min.y+.05<z)||FASCE[0])[0];LV[f].grp.attach(o);continue;}
   const fasce=FASCE.filter(([k,a,z])=>b.max.y>a+.02&&b.min.y<z-.02);
   const sotto=(FASCE.find(([k,a,z])=>b.min.y+.05>=a&&b.min.y+.05<z)||FASCE[0])[0];
   if(fasce.length===1||b.max.y-b.min.y<3.2){LV[sotto].grp.attach(o);continue;} // poggia su un piano e non lo supera di un piano intero: resta tutto con quello
   // attraversa piu' piani: una fetta per piano, tagliata esattamente alla quota del solaio
   for(const [k,a,z] of fasce){const c=o.clone(false);const ms=(Array.isArray(o.material)?o.material:[o.material]).map(m=>{const n=m.clone();n.userData=m.userData;const pl=[];if(a>-1e8)pl.push(new THREE.Plane(new THREE.Vector3(0,1,0),-a));if(z<1e8)pl.push(new THREE.Plane(new THREE.Vector3(0,-1,0),z));n.clippingPlanes=pl;n.clipShadows=true;tagli.push({pl,a,z,L:LV[k]});return n;});
    c.material=Array.isArray(o.material)?ms:ms[0];o.parent.add(c);c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);c.updateMatrixWorld(true);LV[k].grp.attach(c);}
   o.visible=false;}
  // dentro i piani: quello del piano terra che sta sopra il solaio (il tetto del 3) sale col primo piano; i camini che partono
  // sopra la quota del secondo piano (quello dell'11) salgono col secondo, cosi non restano nel vuoto (Michele 15/10)
  {const sposta=[];LV['T'].grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o);if(b.min.y>=Q1-.02&&b.max.y-b.min.y<2.5)sposta.push([o,'1']);});
   // solo il camino dell'11 (x -4,3/-3,8, z -0,1/0,4) col suo cappello e la girandola sale al secondo piano
   LV['1'].grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const c=new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());if(Math.hypot(c.x+4.05,c.z-.15)<.7&&c.y>Q2)sposta.push([o,'2']);});
   const fratelli=new Set();sposta.forEach(([o,k])=>{// i pezzi del camino (cappello, girandola) vanno insieme
     LV[k].grp.attach(o);fratelli.add(o);});
   console.log('spostati di piano',sposta.length);}
  // scala dell'8 (Michele 15/10): i gradini restano al piano terra; il muretto pieno lungo la scala (A) e il pianerottolo
  // col suo parapetto, il percorso verso l'11 (B), salgono col primo piano
  {const su=[],obliquo=[];LV['T'].grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3()),sz=b.getSize(new THREE.Vector3());
    const muroA=c.x>4.55&&c.x<4.9&&sz.x<.35&&c.z>10.3&&c.z<14.4&&sz.y>.04&&b.max.y>1;
    const percorsoB=b.min.x>4.55&&b.max.x<6.35&&b.min.z>6.5&&b.max.z<10.6&&b.min.y>2.55;
    if(percorsoB&&!muroA)su.push(o);else if(muroA)obliquo.push(o);});su.forEach(o=>LV['1'].grp.attach(o));
   // muro obliquo della scala (A): tagliato alla quota del primo piano, sotto resta al piano terra, sopra sale col primo (Michele 15/10)
   obliquo.forEach(o=>{const b=new THREE.Box3().setFromObject(o);if(b.max.y<=Q1+.02)return;if(b.min.y>=Q1-.02){LV['1'].grp.attach(o);return;}
    for(const [k,a,z] of [['T',-1e9,Q1],['1',Q1,1e9]]){const c=o.clone(false);const ms=(Array.isArray(o.material)?o.material:[o.material]).map(m=>{const n=m.clone();n.userData=m.userData;const pl=[];if(a>-1e8)pl.push(new THREE.Plane(new THREE.Vector3(0,1,0),-a));if(z<1e8)pl.push(new THREE.Plane(new THREE.Vector3(0,-1,0),z));n.clippingPlanes=pl;n.clipShadows=true;tagli.push({pl,a,z,L:LV[k]});return n;});
     c.material=Array.isArray(o.material)?ms:ms[0];o.parent.add(c);c.position.copy(o.position);c.quaternion.copy(o.quaternion);c.scale.copy(o.scale);c.updateMatrixWorld(true);LV[k].grp.attach(c);}
    o.visible=false;});
   console.log('scala 8: al primo piano',su.length,'muro obliquo tagliato',obliquo.length);}
  // i 3 camini che partono da terra (x/z -14,58 10,73 · 8,76 13,79 · 15 1,61): basamento e tegola restano al piano terra,
  // la canna dalla tegola in su resta al primo piano, tagliata a filo della tegola (Michele 15/10)
  {const giu=[],canne=[];LV['1'].grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3());
    for(const [x,z] of [[-14.58,10.73],[8.76,13.79],[15,1.61]]){if(Math.abs(c.x-x)>.5||Math.abs(c.z-z)>.5)continue;const m=Array.isArray(o.material)?o.material[0]:o.material,h=m&&m.color?m.color.getHexString():'';
     if(b.max.y<2.3&&(h==='ededea'||h==='3a1206'))giu.push(o);else if(h==='ededea'&&b.min.y<2.3)canne.push([o,x,z]);}});
   const cime={};giu.forEach(o=>{const b=new THREE.Box3().setFromObject(o);const k=Math.round(b.getCenter(new THREE.Vector3()).x);cime[k]=Math.max(cime[k]||0,b.max.y);});
   giu.forEach(o=>LV['T'].grp.attach(o));
   canne.forEach(([o,x])=>{const a=cime[Math.round(x)];if(!a)return;(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>{const n=m.clone();n.userData=m.userData;const pl=[new THREE.Plane(new THREE.Vector3(0,1,0),-a)];n.clippingPlanes=pl;n.clipShadows=true;tagli.push({pl,a,z:1e9,L:LV['1']});if(Array.isArray(o.material))o.material[o.material.indexOf(m)]=n;else o.material=n;});});
   console.log('camini da terra: giu',giu.length,'canne',canne.length);}
  // (Michele 15/10) il camminamento grigio sul retro (quota +2,76/+2,94) e la lastra bianca accanto sono del piano di sopra: salgono col primo piano;
  // il forno del 14 (basamento e pavimento, x 7,4/9,5 z 29,2/31,3) sta con l'appartamento 14
  {const su=[],al14=[];LV['T'].grp.traverse(o=>{if(!o.isMesh||!o.visible)return;const m=Array.isArray(o.material)?o.material[0]:o.material,h=m&&m.color?m.color.getHexString():'',b=new THREE.Box3().setFromObject(o);
    const vicino=(x0,x1,z0,z1)=>Math.abs(b.min.x-x0)<.1&&Math.abs(b.max.x-x1)<.1&&Math.abs(b.min.z-z0)<.1&&Math.abs(b.max.z-z1)<.1;
    if((h==='d4d6d8'&&vicino(-6.16,27.58,-12.05,.25)&&b.min.y>2.6)||(h==='ededea'&&vicino(-5.57,7.22,-10.2,-8.03)&&b.min.y>2.6))su.push(o);
    if((h==='ededea'&&vicino(8.85,9.46,29.28,31.27))||(h==='d4d6d8'&&vicino(7.43,9.34,29.16,31.25)))al14.push(o);});
   su.forEach(o=>LV['1'].grp.attach(o));if(LV.B)al14.forEach(o=>LV.B.grp.attach(o));console.log('camminamento su',su.length,'forno al 14',al14.length);}
  // ringhiera della rampa sul lato est (legno, x>20): tutta intera al piano terra con la sua scala (Michele 15/10)
  {let n=0;const lista=[];scene.traverse(o=>{if(o.isMesh&&o.visible)lista.push(o);});lista.forEach(o=>{const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||!m.color||m.color.getHexString()!=='6e4a33')return;
    const c=new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());if(c.x<20||c.z>7)return;
    if(m.clippingPlanes&&m.clippingPlanes.length){if(o.parent===LV['T'].grp)(Array.isArray(o.material)?o.material:[o.material]).forEach(x=>x.clippingPlanes=[]);else o.visible=false;}
    else if(o.parent!==LV['T'].grp)LV['T'].grp.attach(o);n++;});console.log('ringhiera rampa est',n);}
  // i piani di taglio seguono il loro piano quando sale o scende
  const r0=renderer.render.bind(renderer);renderer.render=(sc,ca)=>{for(const t of tagli){const off=t.L.grp.position.y-t.L.base;let i=0;if(t.a>-1e8)t.pl[i++].constant=-(t.a+off);if(t.z<1e8)t.pl[i].constant=t.z+off;}r0(sc,ca);};
  Object.values(LV).forEach(L=>{L.grp.position.y=L._yPrima;});
  if(PAG==='piani'){const m=innerWidth<720;controls.maxDistance=Math.max(controls.maxDistance||0,m?200:150);apriPlastico(m);}
  if(PAG==='piano'){const aperto=(typeof S!=='undefined'&&S.apt)||+APT_ALL_INIZIO||0;vediPiano(LIV);if(aperto)_openApt(+aperto);} /* arrivo con ?apt=N (anche dal vecchio indirizzo del secondo piano): piano pulito e poi l'appartamento */
  if(PAG==='piani'||PAG==='piano'){let nv=0;
   // Michele 15/10: le recinzioni dei giardini e i muretti sotto restano; via quelle fuori dai giardini (confine sul viale) e i cordoli lungo strada e parcheggio
   const recinti=[];scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||!m.color)return;const b=new THREE.Box3().setFromObject(o);const cc=b.getCenter(new THREE.Vector3());if(m.color.getHexString()==='0c140d'&&(cc.z<15||(cc.x>-.5&&cc.x<12.5&&cc.z>17&&cc.z<36.5)))recinti.push(b);/* giardini e giardino del 14 */});
   const sottoRecinto=b=>recinti.some(r=>r.min.x<b.max.x+.3&&r.max.x>b.min.x-.3&&r.min.z<b.max.z+.3&&r.max.z>b.min.z-.3);
   scene.traverse(o=>{if(!o.isMesh)return;const m=Array.isArray(o.material)?o.material[0]:o.material;if(!m||!m.color)return;const h=m.color.getHexString(),b=new THREE.Box3().setFromObject(o);
    const reteTipo=h==='0c140d'||(o.geometry&&o.geometry.type==='PlaneGeometry'&&h==='ffffff'&&m.map&&m.transparent),rete=reteTipo&&!sottoRecinto(b);
    const retro=((h==='87909e'||h==='9ba3ae')&&b.max.y-b.min.y>1&&b.min.z<-12.5)||(h==='9ba3ae'&&b.min.z<-12.5); // muro di contenimento sul retro e le sue copertine a gradoni (Michele 15/10: via)
    const basso=((h==='87909e'||h==='9ba3ae')&&b.max.y<.8&&!sottoRecinto(b))||retro,filo=(h==='85878b'||h==='e8e6e0')&&b.max.y<.2;
    // rimasugli dietro al 12 (muretto e lastre del terrazzo rimasti sul piano terra) e nel retro del giardino dell'1 (paletti del cancelletto) (Michele 15/10)
    const c=b.getCenter(new THREE.Vector3());
    const dietro12=o.parent===LV['T'].grp&&c.x>-11.6&&c.x<-6.2&&c.z>3.5&&c.z<6.1&&((h==='d4d6d8'&&b.min.y>2.6)||(h==='ededea'&&b.min.x>-8.35&&b.max.x<-6.2&&b.min.z>5.75&&b.max.z<6.05));
    const giardino1=(h==='c8ccd0'&&c.x>-25&&c.x<-17.5&&c.z>2.6&&c.z<3.2)||(o.parent===LV['T'].grp&&h==='ffffff'&&o.geometry&&o.geometry.type==='PlaneGeometry'&&b.max.x<-17&&b.max.y-b.min.y>.8&&!sottoRecinto(b));
    const sporge12=o.parent===LV['T'].grp&&h==='ededea'&&c.x>-8.4&&c.x<-4.4&&c.z>4.3&&c.z<7.4&&b.max.y>2.89&&b.max.y<3.6&&b.max.x-b.min.x<2.5;
    if(rete||basso||filo||dietro12||giardino1||sporge12){o.visible=false;nv++;}});console.log('piani: tolti recinzioni e cordoli',nv);}
  if(window.RV)RV.forza=Math.max(RV.forza,90);console.log('affetta',pezzi.length,'tagli',tagli.length);};
 addEventListener('ap-sito-pronto',()=>setTimeout(affetta,50));
}

// ---------- menu ----------
const freccia='<svg viewBox="0 0 11 7"><path d="M1 1l4.5 4.5L10 1"/></svg>';
const PARK={1:[[-8,26,54],[-8,0,28]],2:[[-18,20,6],[-31,0,20]],3:[[-18,20,54],[-32,-2.5,35]]};
const sulPiano=id=>PAG==='piano'&&LIV===id, aptQui=n=>PAG==='piano'&&LEVELS[LIV]&&(LEVELS[LIV].units.includes(+n)||(LIV==='T'&&LEVELS.B&&LEVELS.B.units.includes(+n)));
const lvApt=n=>APT[n].lv;
const azioni={
 iniziale:()=>PAG==='home'?showEdificio():VAI('./'),
 piani:()=>PAG==='piani'?_showPiani():VAI('piani/'), T:()=>sulPiano('T')?vediPiano('T'):VAI(SLUG.T), 1:()=>sulPiano('1')?vediPiano('1'):VAI(SLUG['1']), 2:()=>sulPiano('2')?vediPiano('2'):VAI(SLUG['2']), B:()=>sulPiano('B')?vediPiano('B'):VAI(SLUG.B),
 park:n=>{if(PAG!=='home')return VAI('./?park='+n);showEdificio();const [p,t]=PARK[n],k=mob()?1.9:1,pp=p.map((v,i)=>t[i]+(v-t[i])*k);setTimeout(()=>camTo(pp,t,1300),30);},
 apt:n=>aptQui(n)?_openApt(+n):VAI(SLUG[lvApt(n)]+'?apt='+n), contatti:()=>PAG==='contatti'?null:VAI('contatti/'),
 vista:v=>{if(PAG!=='home')return VAI('./?vista='+v);showEdificio();const V={sud:[[2,12,46],[0,2,2]],nord:[[-6,20,-44],[0,2,-1]],alto:[[0,58,8],[0,0,2]]}[v],k=mob()?1.6:1,pp=V[0].map((x,i)=>V[1][i]+(x-V[1][i])*k);setTimeout(()=>camTo(pp,V[1],1200),30);},
 cerca:v=>{const [k,x]=v.split(':');if(k==='apt')azioni.apt(x);else if(k==='lv')(x==='piani'?azioni.piani():azioni[x]());else if(k==='park')azioni.park(x);}
};
function voceApt(n){const a=APT[n];if(!a)return '';const tag=a.sold?'<span class="ap-tag">Venduto</span>':a.rent?'<span class="ap-tag r">A reddito</span>':`<small>${a.tipo||''}</small>`;return `<button type="button" data-ap="apt" data-v="${n}">Appartamento ${n}${tag}</button>`;}
const numeri=Object.keys(APT).map(Number).sort((a,b)=>a-b);
const nav=document.createElement('nav');nav.id='ap-nav';nav.setAttribute('aria-label','Menu principale');
nav.innerHTML=`<div class="ap-gruppo ap-doppio" data-g="vista"><button type="button" data-ap="iniziale" class="ap-voce ap-logo-voce" aria-label="Giardini di Sacrofano, vista iniziale"><img src="logo-chiaro.svg" alt="Giardini di Sacrofano"></button><button type="button" class="ap-apri ap-apri-logo" aria-expanded="false" aria-label="Apri viste e parcheggi">${freccia}</button>
  <div class="ap-tendina" role="menu"><button type="button" data-ap="iniziale">Vista iniziale</button><button type="button" data-ap="vista" data-v="sud">Fronte</button><button type="button" data-ap="vista" data-v="nord">Retro</button><button type="button" data-ap="vista" data-v="alto">Dall'alto</button>
   <div class="ap-sep"><button type="button" data-apri="park">Area parcheggi ${freccia}</button>
    <div class="ap-sotto" data-sotto="park"><button type="button" data-ap="park" data-v="1">Parcheggio 1 <small>nel prato</small></button><button type="button" data-ap="park" data-v="2">Parcheggio 2 <small>ovest, in alto</small></button><button type="button" data-ap="park" data-v="3">Parcheggio 3 <small>ovest, in basso</small></button></div></div></div></div>
 <div class="ap-gruppo ap-doppio" data-g="piani"><button type="button" data-ap="piani" class="ap-voce">Esplora piani</button><button type="button" class="ap-apri" aria-expanded="false" aria-label="Scegli il piano">${freccia}</button>
  <div class="ap-tendina" role="menu">
   <button type="button" data-ap="T">Piano terra <small>con l'appartamento 14</small></button><button type="button" data-ap="1">Primo piano</button>
  </div></div>
 <div class="ap-gruppo" data-g="apt"><button type="button" aria-expanded="false">Appartamenti ${freccia}</button>
  <div class="ap-tendina" role="menu">${numeri.map(voceApt).join('')}</div></div>
 <div class="ap-cerca" role="search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input type="search" id="ap-cerca-in" placeholder="Cerca appartamento o piano" aria-label="Cerca un appartamento per numero o per piano" autocomplete="off"><div class="ap-risultati" id="ap-risultati" role="listbox" hidden></div></div>
 <button type="button" data-ap="contatti">Contatti</button>`;
const top=document.querySelector('.top');top.appendChild(nav);
const seg=document.querySelector('.tools .seg');if(seg){const box=document.createElement('div');box.id='ap-giornosera';box.appendChild(seg);B.appendChild(box);} if(PAG==='piani'||PAG==='piano'){const gs=document.getElementById('ap-giornosera');if(gs)gs.style.display='none';} /* niente Giorno/Sera nelle pagine dei piani (Michele 16/10) */ // Giorno / Sera: stessi bottoni di prima, al posto della vecchia barra delle viste
const burger=document.createElement('button');burger.className='ap-burger';burger.type='button';burger.setAttribute('aria-label','Apri il menu');burger.innerHTML='<span></span>';top.appendChild(burger);
const menu=document.createElement('div');menu.id='ap-menu';menu.setAttribute('aria-hidden','true');
menu.innerHTML=`<div class="ap-cerca ap-cerca-m" role="search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input type="search" id="ap-cerca-m" placeholder="Cerca appartamento o piano" aria-label="Cerca un appartamento per numero o per piano" autocomplete="off"><div class="ap-risultati" id="ap-risultati-m" role="listbox" hidden></div></div>
 <button class="v" data-ap="iniziale" aria-label="Giardini di Sacrofano, vista iniziale"><img src="logo-chiaro.svg" alt="Giardini di Sacrofano" style="height:30px;width:auto;display:block"></button><button class="s" data-ap="iniziale">Vista iniziale</button><button class="s" data-ap="vista" data-v="sud">Fronte</button><button class="s" data-ap="vista" data-v="nord">Retro</button><button class="s" data-ap="vista" data-v="alto">Dall'alto</button>
  <button class="s" data-apri="m-park">Area parcheggi ${freccia}</button><div class="chiuso" data-sotto="m-park"><button class="s ss" data-ap="park" data-v="1">Parcheggio 1</button><button class="s ss" data-ap="park" data-v="2">Parcheggio 2</button><button class="s ss" data-ap="park" data-v="3">Parcheggio 3</button></div>
 <button class="v" data-apri="m-piani">Esplora piani ${freccia}</button>
 <div class="chiuso" data-sotto="m-piani"><button class="s" data-ap="piani">Tutti i piani</button><button class="s" data-ap="T">Piano terra</button><button class="s" data-ap="1">Primo piano</button></div>
 <button class="v" data-apri="m-apt">Appartamenti ${freccia}</button>
 <div class="chiuso" data-sotto="m-apt">${numeri.map(n=>`<button class="s" data-ap="apt" data-v="${n}">Appartamento ${n}</button>`).join('')}</div>
 <button class="v" data-ap="contatti">Contatti</button>
 `;
B.appendChild(menu);

function chiudiTendine(){nav.querySelectorAll('.ap-gruppo').forEach(x=>{x.dataset.aperto='false';(x.querySelector('.ap-apri')||x.firstElementChild).setAttribute('aria-expanded','false');});}
nav.querySelectorAll('.ap-gruppo').forEach(gr=>{
 const btn=gr.querySelector('.ap-apri')||gr.firstElementChild;let t=null;
 const apri=v=>{chiudiTendine();gr.dataset.aperto=v?'true':'false';btn.setAttribute('aria-expanded',v);};
 btn.onclick=e=>{e.stopPropagation();apri(gr.dataset.aperto!=='true');};
 gr.addEventListener('mouseenter',()=>{if(matchMedia('(hover:hover)').matches){clearTimeout(t);apri(true);}});
 gr.addEventListener('mouseleave',()=>{if(matchMedia('(hover:hover)').matches)t=setTimeout(()=>apri(false),180);});
});
document.addEventListener('click',e=>{if(!nav.contains(e.target))chiudiTendine();});
addEventListener('keydown',e=>{if(e.key==='Escape'){chiudiTendine();chiudiMenu();}});
function esegui(el){const k=el.dataset.ap,v=el.dataset.v;if(k!=='contatti')chiudiContatti(true);chiudiTendine();chiudiMenu();(k==='park'||k==='apt'||k==='vista'||k==='cerca')?azioni[k](v):azioni[k]();}
[nav,menu].forEach(box=>box.addEventListener('click',e=>{
 const ap=e.target.closest('[data-apri]');if(ap){e.stopPropagation();const s=box.querySelector(`[data-sotto="${ap.dataset.apri}"]`);if(s){s.classList.toggle('aperta');s.classList.toggle('chiuso');ap.classList.toggle('su');}return;}
 const el=e.target.closest('[data-ap]');if(el)esegui(el);}));
function apriMenu(){B.classList.add('ap-menu-aperto');menu.setAttribute('aria-hidden','false');burger.setAttribute('aria-label','Chiudi il menu');}
function chiudiMenu(){B.classList.remove('ap-menu-aperto');menu.setAttribute('aria-hidden','true');burger.setAttribute('aria-label','Apri il menu');}
burger.onclick=()=>B.classList.contains('ap-menu-aperto')?chiudiMenu():apriMenu();


// ---------- ricerca: per numero ("4", "app 4", "appartamento 12") o per piano ("terra", "primo", "secondo", "14", "parcheggio") ----------
const PIANI=[['T','Piano terra',['terra','piano terra','pt','t','0']],['1','Primo piano',['primo','1 piano','piano primo','primo piano','secondo','2 piano','piano secondo','secondo piano']],['T','Appartamento 14 · piano terra',['fabbricato','b','fabbricato b']],['piani','Tutti i piani',['piani','tutti']]];
function trova(q){q=q.toLowerCase().trim().replace(/\s+/g,' ');if(!q)return [];const out=[];
 const n=(q.match(/\d+/)||[])[0];
 if(n&&APT[+n])out.push({v:'apt:'+n,t:'Appartamento '+n,s:LEVELS[APT[+n].lv]?LEVELS[APT[+n].lv].name:''});
 numeri.forEach(k=>{if(('appartamento '+k).startsWith(q)&&!out.some(o=>o.v==='apt:'+k))out.push({v:'apt:'+k,t:'Appartamento '+k,s:LEVELS[APT[k].lv]?LEVELS[APT[k].lv].name:''});});
 if(!/^\d/.test(q))PIANI.forEach(([id,t,ch])=>{if(ch.some(c=>c.startsWith(q)||q.startsWith(c+' ')||q===c)||t.toLowerCase().includes(q))out.push({v:'lv:'+id,t,s:id==='piani'?'divisi in due':(LEVELS[id]?LEVELS[id].desc:'')});});
 if('parcheggio'.startsWith(q.slice(0,5))&&q.length>2)[1,2,3].forEach(k=>out.push({v:'park:'+k,t:'Parcheggio '+k,s:['nel prato','ovest, in alto','ovest, in basso'][k-1]}));
 return out.slice(0,8);}
function collegaRicerca(inp,box){
 const mostra=()=>{const r=trova(inp.value);box.innerHTML=r.length?r.map((o,i)=>`<button type="button" role="option" data-ap="cerca" data-v="${o.v}"${i===0?' class="primo"':''}>${o.t}<small>${o.s}</small></button>`).join(''):(inp.value.trim()?'<p>Nessun risultato. Prova con un numero da 1 a 14 o con un piano.</p>':'');box.hidden=!box.innerHTML;};
 inp.addEventListener('input',mostra);inp.addEventListener('focus',mostra);
 inp.addEventListener('keydown',e=>{if(e.key==='Enter'){const p=box.querySelector('button');if(p){e.preventDefault();inp.value='';box.hidden=true;inp.blur();esegui(p);}}if(e.key==='Escape'){box.hidden=true;inp.blur();}});
 box.addEventListener('click',()=>{inp.value='';box.hidden=true;});
 document.addEventListener('click',e=>{if(!inp.parentNode.contains(e.target))box.hidden=true;});}
collegaRicerca(nav.querySelector('#ap-cerca-in'),nav.querySelector('#ap-risultati'));collegaRicerca(menu.querySelector('#ap-cerca-m'),menu.querySelector('#ap-risultati-m'));

// ---------- pagina Contatti ----------
const icona={err:'<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 1 15 14H1L8 1Zm0 5v4m0 2v.5" stroke="#B3261E" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>'};
const cp=document.createElement('section');cp.id='ap-contatti';cp.setAttribute('aria-label','Contatti');cp.setAttribute('aria-hidden','true');
cp.innerHTML=`<div class="ap-cont"><div class="hero"><div class="aura" aria-hidden="true"></div><div class="wrap"><span class="occhiello">Contattaci</span><h1>Parliamo della tua <em>nuova casa</em>.</h1></div></div>
<section class="sec"><div class="wrap due">
 <form id="ap-modulo" novalidate>
  <div class="f2">
   <div class="campo" data-c="nome"><label for="ap-n">Nome *</label><input id="ap-n" name="nome" autocomplete="given-name" maxlength="60" required placeholder="Mario"><span class="err" role="alert">${icona.err}Scrivi il tuo nome.</span></div>
   <div class="campo" data-c="cognome"><label for="ap-c">Cognome *</label><input id="ap-c" name="cognome" autocomplete="family-name" maxlength="60" required placeholder="Rossi"><span class="err" role="alert">${icona.err}Scrivi il tuo cognome.</span></div>
  </div>
  <div class="f2">
   <div class="campo" data-c="telefono"><label for="ap-t">Numero di telefono *</label><input id="ap-t" name="telefono" type="tel" autocomplete="tel" maxlength="40" required placeholder="+39 000 000 0000"><span class="err" role="alert">${icona.err}Serve un numero per richiamarti.</span></div>
   <div class="campo" data-c="email"><label for="ap-e">Email *</label><input id="ap-e" name="email" type="email" autocomplete="email" maxlength="254" required placeholder="nome@posta.it" autocapitalize="none" spellcheck="false"><span class="err" role="alert">${icona.err}Serve un'email valida per risponderti.</span></div>
  </div>
  <div class="campo" data-c="messaggio"><label for="ap-m">Messaggio *</label><textarea id="ap-m" name="messaggio" maxlength="4000" required placeholder="L'appartamento che ti interessa, quando vorresti visitarlo… raccontaci cosa cerchi."></textarea><span class="err" role="alert">${icona.err}Raccontaci in due righe cosa cerchi.</span></div>
  <div class="campo" data-c="privacy"><label class="spunta" for="ap-p"><input type="checkbox" id="ap-p" name="privacy" required><span class="spunta-q" aria-hidden="true"><svg viewBox="0 0 14 11" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m1 5.5 4 4 8-8"/></svg></span><span>Ho letto l'informativa privacy per la gestione della mia richiesta. *</span></label><span class="err" role="alert">${icona.err}Conferma di aver letto l'informativa privacy.</span></div>
  <div class="miele" aria-hidden="true"><label for="ap-w">Sito web</label><input id="ap-w" name="_honey" tabindex="-1" autocomplete="off"></div>
  <div class="esito" id="ap-esito" role="status" aria-live="polite"><svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 0a10 10 0 1 0 0 20A10 10 0 0 0 10 0Zm4.7 7.6-5.5 5.6a1 1 0 0 1-1.4 0L5.3 10.6a1 1 0 1 1 1.4-1.4l2 2 4.6-4.8a1 1 0 0 1 1.4 1.4Z"/></svg><span id="ap-esito-t"></span></div>
  <button class="b" type="submit" id="ap-invia">Richiedi informazioni <span aria-hidden="true">→</span></button>
 </form>
 <div>
  <div class="notte">
   <div class="riga-i"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 21s7-6.6 7-11.6A7 7 0 0 0 5 9.4C5 14.4 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg></span><div><b>Dove siamo</b>Via Monterosso 17<br>00060 Sacrofano (RM)</div></div>
   <div class="riga-i"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><rect x="3" y="5.5" width="18" height="13" rx="1.5"/><path d="m4 7 8 6 8-6"/></svg></span><div><b>Email</b><a href="mailto:michele.fabbrini@themediacompany.it">michele.fabbrini@themediacompany.it</a></div></div>
   <div class="riga-i"><span class="ic" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.5a11 11 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2C10.8 18 6 13.2 4.5 6.7A2 2 0 0 1 6.5 3.5Z"/></svg></span><div><b>Telefono</b><a href="tel:+390685304600">+39 06 85 304 600</a></div></div>
  </div>
  <a class="mappa" href="https://www.google.com/maps/search/?api=1&amp;query=Via%20Monterosso%2017%2C%2000060%20Sacrofano%20RM" target="_blank" rel="noopener" aria-label="Apri Via Monterosso 17 su Google Maps (si apre in una nuova scheda)">
   <span class="mappa-foto" aria-hidden="true"></span>
   <span class="mappa-eti"><span><b>Giardini di Sacrofano</b>Via Monterosso 17 · Sacrofano (RM)</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 16 16 8M9 8h7v7"/></svg></span>
  </a>
 </div>
</div></section></div>`;
B.appendChild(cp);
let lenis=null,lenisRaf=null;
function apriContatti(){if(PAG!=='contatti'&&false)return;
 chiudiMenu();chiudiTendine();if(cp.getAttribute('aria-hidden')==='false')return;
 cp.setAttribute('aria-hidden','false');B.classList.add('ap-contatti-aperti');cp.scrollTop=0;
 if(window.Lenis&&!ridotto){lenis=new Lenis({wrapper:cp,content:cp.firstElementChild,smoothWheel:true,lerp:.1});const raf=t=>{lenis&&lenis.raf(t);lenisRaf=requestAnimationFrame(raf);};lenisRaf=requestAnimationFrame(raf);}
 if(g){g.set(cp,{visibility:'visible'});g.fromTo(cp,{opacity:0},{opacity:1,duration:.45,ease:'power2.out'});
   g.fromTo(cp.querySelectorAll('.occhiello,h1,form,.notte,.mappa'),{opacity:0,y:26},{opacity:1,y:0,duration:.8,ease:'power3.out',stagger:.08,delay:.1});}
 else{cp.style.visibility='visible';cp.style.opacity=1;}
 if(PAG!=='contatti')try{history.replaceState(null,'',location.pathname+'#contatti');}catch(e){}
}
function chiudiContatti(subito){if(PAG==='contatti')return;
 if(cp.getAttribute('aria-hidden')==='true')return;
 cp.setAttribute('aria-hidden','true');B.classList.remove('ap-contatti-aperti');
 if(lenis){lenis.destroy();lenis=null;cancelAnimationFrame(lenisRaf);}
 if(g&&!subito)g.to(cp,{opacity:0,duration:.35,onComplete:()=>g.set(cp,{visibility:'hidden'})});else{cp.style.opacity=0;cp.style.visibility='hidden';}
 try{history.replaceState(null,'',location.pathname+location.search);}catch(e){}
 if(window.RV)RV.forza=Math.max(RV.forza,30);
}
// il logo e "Vista iniziale" riportano al rendering anche dalla pagina Contatti
document.querySelector('.top .brand').addEventListener('click',()=>chiudiContatti());

// modulo: controlli, invio a invia.php (sul server del sito vero), conferma
const f=cp.querySelector('#ap-modulo');
const ok={nome:v=>v.trim().length>1,cognome:v=>v.trim().length>1,telefono:v=>v.replace(/[^0-9]/g,'').length>=6,email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),messaggio:v=>v.trim().length>4};
function controlla(){let primo=null;f.querySelectorAll('.campo[data-c]').forEach(c=>{const k=c.dataset.c,el=c.querySelector('input,textarea');const buono=k==='privacy'?el.checked:ok[k](el.value);c.classList.toggle('ko',!buono);if(!buono&&!primo)primo=el;});if(primo)primo.focus();return !primo;}
f.querySelectorAll('input,textarea').forEach(el=>el.addEventListener('input',()=>{const c=el.closest('.campo');if(c&&c.classList.contains('ko'))controlla();}));
f.addEventListener('submit',async e=>{
 e.preventDefault();if(!controlla())return;
 const btn=f.querySelector('#ap-invia'),es=cp.querySelector('#ap-esito'),tx=cp.querySelector('#ap-esito-t');btn.disabled=true;
 const dati=new FormData(f);let inviata=false;
 try{const r=await fetch('invia.php',{method:'POST',body:dati});const j=await r.json().catch(()=>({}));inviata=r.ok&&j.ok===true;}catch(err){}
 tx.textContent=inviata
  ?`Grazie ${dati.get('nome')}, abbiamo ricevuto la tua richiesta. Ti contatteremo al più presto.`
  :`Grazie ${dati.get('nome')}, la tua richiesta è pronta. (Versione di prova: l'invio vero della mail si attiva quando il sito sarà sul suo server.)`;
 es.classList.add('on');f.querySelectorAll('.campo,.f2,#ap-invia').forEach(x=>x.style.display='none');
 if(g)g.fromTo(es,{opacity:0,y:10},{opacity:1,y:0,duration:.5,ease:'power2.out'});
});

// solo per le foto di controllo (?apdemo=menu / apt / contatti): entra da solo appena pronto e apre la voce richiesta
const demo=(location.search.match(/apdemo=(\w+)/)||[])[1];
if(demo&&demo!=='2'){const t=setInterval(()=>{if(scena===2&&pronto){clearInterval(t);entra();setTimeout(()=>{
 if(demo==='menu'){const gr=nav.querySelector('[data-g="piani"]');gr.dataset.aperto='true';const a=gr.querySelector('[data-apri="park"]');a.click();}
 if(demo==='apt'){nav.querySelector('[data-g="apt"]').dataset.aperto='true';}
 if(demo==='contatti')apriContatti();
 if(demo==='frase'){}},2600);}},300);}

// avvio: si aspetta il font corsivo per non scrivere con un font di ripiego
const base=new Promise(r=>{const c=setInterval(()=>{if(B.dataset.ready==='true'){clearInterval(c);r();}},60);setTimeout(r,6000);});
if(MODO==='piena')Promise.all([base,document.fonts&&document.fonts.load?Promise.race([document.fonts.load('150px "Great Vibes"'),new Promise(r=>setTimeout(r,2500))]):Promise.resolve()]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(scrivi,120))));

// solo per la misura di fluidita' (?apmisura): scrive in console i fotogrammi lenti durante scritta e logo
if(location.search.includes('apmisura')){const gaps=[];let last=performance.now();const f=t=>{if(t-last>50)gaps.push(Math.round(t)+':'+Math.round(t-last));last=t;if(t<30000)requestAnimationFrame(f);};requestAnimationFrame(f);
 const tl=[];['ap-via-libera','ap-sito-pronto'].forEach(e=>addEventListener(e,()=>tl.push(e+'@'+Math.round(performance.now()))));
 setTimeout(()=>console.log('MISURA scrittura '+(window.__apW||'')+' lenti '+gaps.join(' ')+' | '+tl.join(' ')),30000);}

// modalita' breve: niente scritta, subito il logo e "Ci siamo quasi", si entra da soli appena e' pronto
if(MODO==='breve'){scena=2;$i('#ap-scritta').style.display='none';$i('.ap-payoff').style.display='none';$i('.ap-bg2').style.opacity=1;$i('.ap-velo').style.opacity=.55;
 const lg=$i('.ap-logo');lg.style.opacity=1;$i('.ap-attesa').style.opacity=.8;}
if(MODO==='nessuna'){apriContatti();}
})();
// COLORI LED PER APPARTAMENTO (Michele 16/10): ogni appartamento ha la sua sfumatura, sempre nella palette verde del sito;
// "a reddito" e "venduto" restano col loro colore. Vale per luci in pianta, contorni e cerchietti col numero.
const LED_APT={1:0x19c37d,2:0x12a3a8,3:0x7cc63e,5:0x1c8fc4,6:0xb0d651,7:0x0b8a5f,8:0x19c37d,9:0x12a3a8,10:0x7cc63e,11:0x1c8fc4,12:0x45d9c0,13:0xb0d651,14:0x5bbf8f};
if(typeof PAL==='object'){if(PAL.A)PAL.A.fillOp=.34;if(PAL.B)PAL.B.fillOp=.24;} /* luci in pianta piu' presenti, per distinguere gli appartamenti */
const ledApt=()=>{if(typeof LV==='undefined')return;Object.values(LV).forEach(L=>(L.units||[]).forEach(o=>{if(window.SITO&&SITO.pagina==='piano'){o.core.visible=o.halo.visible=o.band.visible=false;} /* niente bordi luminosi sopra i muri del DWG */const a=APT[o.n],c=LED_APT[o.n];if(!a||!c||a.rent||a.sold)return;
  const col=new THREE.Color(c);o.core.color.copy(col);o.halo.color.copy(col);o.band.color.copy(col);o.fm.color.copy(col);
  if(o.el)o.el.style.setProperty('--led','#'+col.getHexString());
  // il 14 sta a terra: nella pianta del piano terra si accende anche lui
  if(L.id==='B'&&typeof S!=='undefined'&&S.view==='piano'&&S.level==='T'&&typeof tween==='function'){const P=PAL[S.dir];tween(0,()=>{o.fm.opacity=P.fillOp;o.core.opacity=1;o.halo.opacity=P.haloOp;o.extM.opacity=P.extOp;},null,'u'+o.n+o.lv);if(o.el)o.el.hidden=false;}}));};
if(typeof refreshUnits==='function'){const _ru2=refreshUnits;refreshUnits=function(...a){_ru2.apply(this,a);ledApt();};ledApt();}


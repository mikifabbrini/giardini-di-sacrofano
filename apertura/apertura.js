// Apertura del sito, menu e pagina Contatti (Michele 14/10/2026). Solo nella copia di prova.
// Scena 1: sfondo sfocato della Vista iniziale e scritta che si scrive da sola (circa 4 s) mentre dietro carica il rendering.
// Scena 2: logo GdS, payoff, "Scorri per iniziare" quando il rendering e' pronto. Scena 3: logo in alto a sinistra, menu, rendering vero.
(function(){
const B=document.body, mob=()=>innerWidth<720, ridotto=matchMedia('(prefers-reduced-motion: reduce)').matches;
const g=window.gsap;if(g)g.ticker.lagSmoothing(0); // il rendering carica dietro: i tempi restano veri anche se il browser e' occupato
let pronto=false, scena=1, entrato=false;
B.classList.add('ap-attiva');window.__apIntro=true;
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
B.appendChild(intro);
const $i=s=>intro.querySelector(s);
const testi=[...intro.querySelectorAll('#ap-scritta text')];
// il vecchio velo di caricamento del rendering resta sotto: ci pensa l'apertura a coprire
const nasc=document.createElement('style');nasc.textContent='#veloFoto{visibility:hidden!important}';document.head.appendChild(nasc);
addEventListener('ap-sito-pronto',()=>{pronto=true;mostraScorri();});
// riserva: se per qualche motivo il segnale non arriva, dopo 40 s si lascia entrare comunque
setTimeout(()=>{if(!pronto){pronto=true;mostraScorri();}},40000);

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
 const fine=()=>{B.classList.remove('ap-attiva');intro.remove();frase();if(window.RV)RV.forza=Math.max(RV.forza,60);};
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


// ---------- menu ----------
const freccia='<svg viewBox="0 0 11 7"><path d="M1 1l4.5 4.5L10 1"/></svg>';
const PARK={1:[[-8,26,54],[-8,0,28]],2:[[-18,20,6],[-31,0,20]],3:[[-18,20,54],[-32,-2.5,35]]};
const azioni={
 iniziale:()=>showEdificio(),
 piani:()=>showPiani(), T:()=>openLevel('T'), 1:()=>openLevel('1'), 2:()=>openLevel('2'), B:()=>openLevel('B'),
 park:n=>{showEdificio();const [p,t]=PARK[n],k=mob()?1.9:1,pp=p.map((v,i)=>t[i]+(v-t[i])*k);setTimeout(()=>camTo(pp,t,1300),30);},
 apt:n=>openApt(+n), contatti:()=>apriContatti(),
 vista:v=>{showEdificio();const V={sud:[[2,12,46],[0,2,2]],nord:[[-6,20,-44],[0,2,-1]],alto:[[0,58,8],[0,0,2]]}[v],k=mob()?1.6:1,pp=V[0].map((x,i)=>V[1][i]+(x-V[1][i])*k);setTimeout(()=>camTo(pp,V[1],1200),30);},
 cerca:v=>{const [k,x]=v.split(':');if(k==='apt')openApt(+x);else if(k==='lv')(x==='piani'?showPiani():openLevel(x));else if(k==='park')azioni.park(x);}
};
function voceApt(n){const a=APT[n];if(!a)return '';const tag=a.sold?'<span class="ap-tag">Venduto</span>':a.rent?'<span class="ap-tag r">A reddito</span>':`<small>${a.tipo||''}</small>`;return `<button type="button" data-ap="apt" data-v="${n}">Appartamento ${n}${tag}</button>`;}
const numeri=Object.keys(APT).map(Number).sort((a,b)=>a-b);
const nav=document.createElement('nav');nav.id='ap-nav';nav.setAttribute('aria-label','Menu principale');
nav.innerHTML=`<div class="ap-gruppo ap-doppio" data-g="vista"><button type="button" data-ap="iniziale" class="ap-voce">Vista iniziale</button><button type="button" class="ap-apri" aria-expanded="false" aria-label="Altre viste">${freccia}</button>
  <div class="ap-tendina" role="menu"><button type="button" data-ap="vista" data-v="sud">Fronte</button><button type="button" data-ap="vista" data-v="nord">Retro</button><button type="button" data-ap="vista" data-v="alto">Dall'alto</button></div></div>
 <div class="ap-gruppo" data-g="piani"><button type="button" aria-expanded="false">Esplora piani ${freccia}</button>
  <div class="ap-tendina" role="menu">
   <button type="button" data-ap="piani">Tutti i piani <small>divisi in tre</small></button>
   <button type="button" data-ap="T">Piano terra</button><button type="button" data-ap="1">Primo piano</button><button type="button" data-ap="2">Secondo piano</button>
   <button type="button" data-ap="B">Appartamento 14 <small>fabbricato B</small></button>
   <div class="ap-sep"><button type="button" data-apri="park">Area parcheggio ${freccia}</button>
    <div class="ap-sotto" data-sotto="park"><button type="button" data-ap="park" data-v="1">Parcheggio 1 <small>nel prato</small></button><button type="button" data-ap="park" data-v="2">Parcheggio 2 <small>ovest, in alto</small></button><button type="button" data-ap="park" data-v="3">Parcheggio 3 <small>ovest, in basso</small></button></div></div>
  </div></div>
 <div class="ap-gruppo" data-g="apt"><button type="button" aria-expanded="false">Appartamenti ${freccia}</button>
  <div class="ap-tendina" role="menu">${numeri.map(voceApt).join('')}</div></div>
 <div class="ap-cerca" role="search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input type="search" id="ap-cerca-in" placeholder="Cerca appartamento o piano" aria-label="Cerca un appartamento per numero o per piano" autocomplete="off"><div class="ap-risultati" id="ap-risultati" role="listbox" hidden></div></div>
 <button type="button" data-ap="contatti">Contatti</button>`;
const top=document.querySelector('.top');top.appendChild(nav);
const seg=document.querySelector('.tools .seg');if(seg){const box=document.createElement('div');box.id='ap-giornosera';box.appendChild(seg);B.appendChild(box);} // Giorno / Sera: stessi bottoni di prima, al posto della vecchia barra delle viste
const burger=document.createElement('button');burger.className='ap-burger';burger.type='button';burger.setAttribute('aria-label','Apri il menu');burger.innerHTML='<span></span>';top.appendChild(burger);
const menu=document.createElement('div');menu.id='ap-menu';menu.setAttribute('aria-hidden','true');
menu.innerHTML=`<div class="ap-cerca ap-cerca-m" role="search"><svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="8.5" cy="8.5" r="5.5"/><path d="m13 13 4 4"/></svg><input type="search" id="ap-cerca-m" placeholder="Cerca appartamento o piano" aria-label="Cerca un appartamento per numero o per piano" autocomplete="off"><div class="ap-risultati" id="ap-risultati-m" role="listbox" hidden></div></div>
 <button class="v" data-ap="iniziale">Vista iniziale</button><button class="s" data-ap="vista" data-v="sud">Fronte</button><button class="s" data-ap="vista" data-v="nord">Retro</button><button class="s" data-ap="vista" data-v="alto">Dall'alto</button>
 <button class="v" data-apri="m-piani">Esplora piani ${freccia}</button>
 <div class="chiuso" data-sotto="m-piani"><button class="s" data-ap="piani">Tutti i piani</button><button class="s" data-ap="T">Piano terra</button><button class="s" data-ap="1">Primo piano</button><button class="s" data-ap="2">Secondo piano</button><button class="s" data-ap="B">Appartamento 14</button>
  <button class="s" data-apri="m-park">Area parcheggio ${freccia}</button><div class="chiuso" data-sotto="m-park"><button class="s ss" data-ap="park" data-v="1">Parcheggio 1</button><button class="s ss" data-ap="park" data-v="2">Parcheggio 2</button><button class="s ss" data-ap="park" data-v="3">Parcheggio 3</button></div></div>
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
const PIANI=[['T','Piano terra',['terra','piano terra','pt','t','0']],['1','Primo piano',['primo','1 piano','piano primo','primo piano']],['2','Secondo piano',['secondo','2 piano','piano secondo','secondo piano']],['B','Appartamento 14 · fabbricato B',['fabbricato','b','fabbricato b']],['piani','Tutti i piani',['piani','tutti']]];
function trova(q){q=q.toLowerCase().trim().replace(/\s+/g,' ');if(!q)return [];const out=[];
 const n=(q.match(/\d+/)||[])[0];
 if(n&&APT[+n])out.push({v:'apt:'+n,t:'Appartamento '+n,s:LEVELS[APT[+n].lv]?LEVELS[APT[+n].lv].name:''});
 numeri.forEach(k=>{if(('appartamento '+k).startsWith(q)&&!out.some(o=>o.v==='apt:'+k))out.push({v:'apt:'+k,t:'Appartamento '+k,s:LEVELS[APT[k].lv]?LEVELS[APT[k].lv].name:''});});
 if(!/^\d/.test(q))PIANI.forEach(([id,t,ch])=>{if(ch.some(c=>c.startsWith(q)||q.startsWith(c+' ')||q===c)||t.toLowerCase().includes(q))out.push({v:'lv:'+id,t,s:id==='piani'?'divisi in tre':(LEVELS[id]?LEVELS[id].desc:'')});});
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
function apriContatti(){
 chiudiMenu();chiudiTendine();if(cp.getAttribute('aria-hidden')==='false')return;
 cp.setAttribute('aria-hidden','false');B.classList.add('ap-contatti-aperti');cp.scrollTop=0;
 if(window.Lenis&&!ridotto){lenis=new Lenis({wrapper:cp,content:cp.firstElementChild,smoothWheel:true,lerp:.1});const raf=t=>{lenis&&lenis.raf(t);lenisRaf=requestAnimationFrame(raf);};lenisRaf=requestAnimationFrame(raf);}
 if(g){g.set(cp,{visibility:'visible'});g.fromTo(cp,{opacity:0},{opacity:1,duration:.45,ease:'power2.out'});
   g.fromTo(cp.querySelectorAll('.occhiello,h1,form,.notte,.mappa'),{opacity:0,y:26},{opacity:1,y:0,duration:.8,ease:'power3.out',stagger:.08,delay:.1});}
 else{cp.style.visibility='visible';cp.style.opacity=1;}
 try{history.replaceState(null,'','#contatti');}catch(e){}
}
function chiudiContatti(subito){
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
Promise.all([base,document.fonts&&document.fonts.load?Promise.race([document.fonts.load('150px "Great Vibes"'),new Promise(r=>setTimeout(r,2500))]):Promise.resolve()]).then(()=>requestAnimationFrame(()=>requestAnimationFrame(()=>setTimeout(scrivi,120))));

// solo per la misura di fluidita' (?apmisura): scrive in console i fotogrammi lenti durante scritta e logo
if(location.search.includes('apmisura')){const gaps=[];let last=performance.now();const f=t=>{if(t-last>50)gaps.push(Math.round(t)+':'+Math.round(t-last));last=t;if(t<30000)requestAnimationFrame(f);};requestAnimationFrame(f);
 const tl=[];['ap-via-libera','ap-sito-pronto'].forEach(e=>addEventListener(e,()=>tl.push(e+'@'+Math.round(performance.now()))));
 setTimeout(()=>console.log('MISURA scrittura '+(window.__apW||'')+' lenti '+gaps.join(' ')+' | '+tl.join(' ')),30000);}
})();

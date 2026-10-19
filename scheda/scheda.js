// SCHEDA APPARTAMENTO (Michele 19/10). Si apre cliccando un appartamento (Esplora piani, pagine dei piani, tendina Appartamenti
// del menu). A sinistra video gia' registrati dal modello (niente 3D navigabile: troppo pesante), a destra piantina e dettagli
// presi solo dalle schede PDF. Animazioni con GSAP, scorrimento del lato destro con Lenis. Per ora solo gli appartamenti in SCHEDE.
(function(){
if(!window.SCHEDE)return;
const tel=()=>matchMedia('(max-width:719px)').matches;
const svg={
 indietro:'<svg viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7"/></svg>',
 ingrandisci:'<svg viewBox="0 0 24 24"><path d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>',
 chiudi:'<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg>',
 panorama:'<svg viewBox="0 0 24 24"><path d="M3 18l5-7 4 5 3-4 6 6z"/><circle cx="17" cy="7" r="2"/></svg>',
 infissi:'<svg viewBox="0 0 24 24"><rect x="4" y="3" width="16" height="18" rx="1"/><path d="M12 3v18M4 12h16"/></svg>',
 porta:'<svg viewBox="0 0 24 24"><path d="M6 21V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v17M4 21h16"/><rect x="10" y="11" width="4" height="4" rx=".6"/><path d="M11 11V9.5a1 1 0 0 1 2 0V11"/></svg>',
 video:'<svg viewBox="0 0 24 24"><path d="M3 8h11l3-2v8l-3-2H3z"/><path d="M8 12v4M5 20h6M8 16v4"/></svg>'
};
let el=null,stato=null,lenis=null;
function costruisci(n){
 const D=SCHEDE[n];
 const piante=D.piantine.length>1?`<div class="gs-livelli">${D.piantine.map((p,i)=>`<button type="button" data-p="${i}" class="${i?'':'attivo'}">${p[0]}</button>`).join('')}</div>`:'';
 const pianta=D.piantine[0]&&D.piantine[0][1]?`<img src="${D.piantine[0][1]}" alt="Piantina dell'appartamento ${n}">`:`<div class="gs-arrivo">Piantina in arrivo</div>`;
 const euro=v=>'€ '+Number(v).toLocaleString('it-IT');
 const ic=k=>`<i class="gs-ic" style="--ic:url(icone/${k}.png?v=2)"></i>`;
 el.innerHTML=`<div class="gs-sx">
  <div class="gs-testa"><button type="button" class="gs-indietro" aria-label="Torna indietro">${svg.indietro}</button><div><h2 class="gs-titolo">Appartamento ${n}</h2><p class="gs-sotto">${D.dove?D.dove+' · ':''}${D.tipologia}</p></div></div>
  <div class="gs-video"><img class="gs-poster" alt=""><video muted playsinline preload="none"></video><video muted playsinline preload="none"></video></div>
  <div class="gs-bottoni">${D.video.map(([k,t],i)=>`<button type="button" data-v="${k}" class="${i?'':'attivo'}"><span>${t}</span></button>`).join('')}</div>
 </div>
 <div class="gs-dx"><div class="gs-contenuto">
  <div class="gs-luogo" data-rivela><span>${D.indirizzo}</span></div>
  ${piante}<div class="gs-pianta" data-rivela>${pianta}${D.piantine[0]&&D.piantine[0][1]?'<span class="gs-ingrandisci">'+svg.ingrandisci+'Ingrandisci</span>':''}</div>
  <div class="gs-blocco gs-vendita" data-rivela>
   ${D.reddito?`<div class="gs-reddito"><i></i><b>IMMOBILE A REDDITO</b><span>${D.rendita}</span></div>`:''}
   <div class="gs-prezzo"><b data-conta="${D.prezzo}" data-euro>${euro(D.prezzo)}</b><span>oltre oneri di legge</span></div>
  </div>
  <div class="gs-numeri" data-rivela>${D.numeri.map(([v,u,t])=>`<div><strong><b data-conta="${v}">${v}</b> ${u}</strong><small>${t}</small></div>`).join('')}</div>
  <div class="gs-essenziali" data-rivela>${D.essenziali.map(([k,t,v])=>`<div>${ic(k)}<strong>${v}</strong><small>${t}</small></div>`).join('')}</div>
  ${D.gruppi.map(([g,vv])=>`<section class="gs-gruppo" data-rivela><h3>${g}</h3><ul>${vv.map(([k,t,v])=>`<li>${ic(k)}<small>${t}</small><span>${v}</span></li>`).join('')}</ul></section>`).join('')}
  <section class="gs-gruppo gs-altre" data-rivela><h3>Dotazioni</h3><ul>${D.altre.map(([k,t])=>`<li><i class="gs-ic-svg">${svg[k]||''}</i><span>${t}</span></li>`).join('')}</ul></section>
  ${D.posizione?`<section class="gs-gruppo gs-posizione" data-rivela><h3>Posizione nel complesso</h3><button type="button" class="gs-mappa"><img src="${D.posizione}" alt="Posizione dell'appartamento ${n} nel complesso"><span class="gs-ingrandisci">${svg.ingrandisci}Ingrandisci</span></button></section>`:''}
  ${D.fonte?`<p class="gs-fonte">${D.fonte}</p>`:''}
 </div></div>`;
 const mp=el.querySelector('.gs-mappa');if(mp)mp.onclick=()=>zoom(D.posizione,'Posizione nel complesso');
 anima();
 el.querySelector('.gs-indietro').onclick=chiudi;
 const pz=el.querySelector('.gs-pianta');pz.addEventListener('click',()=>{const im=pz.querySelector('img');if(!im)return;const sel=el.querySelector('.gs-livelli .attivo'),P=D.piantine[sel?+sel.dataset.p:0];zoom(P&&P[2]||im.src,im.alt);});
 el.querySelectorAll('.gs-bottoni button').forEach(b=>b.onclick=()=>mostraVideo(n,b.dataset.v,true));
 el.querySelectorAll('.gs-livelli button').forEach(b=>b.onclick=()=>{el.querySelectorAll('.gs-livelli button').forEach(x=>x.classList.toggle('attivo',x===b));el.querySelector('.gs-pianta').innerHTML=`<img src="${D.piantine[+b.dataset.p][1]}" alt="Piantina">`;});
}
// ogni blocco del lato destro entra quando arriva sullo schermo; prezzo e metri quadri contano fino al valore della scheda
let osserva=null;
function anima(){
 const g=window.gsap;if(!g||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
 if(osserva)osserva.disconnect();
 const radice=tel()?el:el.querySelector('.gs-dx');
 const conta=b=>{const v=+b.dataset.conta,o={x:0},eu=b.hasAttribute('data-euro');g.to(o,{x:v,duration:1.4,ease:'power3.out',onUpdate:()=>{const r=Math.round(o.x);b.textContent=eu?'€ '+r.toLocaleString('it-IT'):r;}});};
 const bl=[...el.querySelectorAll('[data-rivela]')];g.set(bl,{opacity:0,y:26});
 osserva=new IntersectionObserver(es=>es.forEach(e=>{if(!e.isIntersecting)return;osserva.unobserve(e.target);const t=e.target;
  g.to(t,{opacity:1,y:0,duration:.75,ease:'power3.out'});
  const figli=t.querySelectorAll('li,.gs-numeri > div,.gs-essenziali > div');if(figli.length)g.fromTo(figli,{opacity:0,y:12},{opacity:1,y:0,duration:.5,stagger:.06,ease:'power2.out',delay:.12});
  t.querySelectorAll('[data-conta]').forEach(conta);}),{root:radice,threshold:.15});
 bl.forEach(b=>osserva.observe(b));
}
// barra sottile sotto il bottone attivo: quanto manca alla fine del video
let barra=0;
function avanzamento(){cancelAnimationFrame(barra);const giro=()=>{if(!el||!el.classList.contains('aperta'))return;const v=el.querySelectorAll('.gs-video video')[corrente],b=el.querySelector('.gs-bottoni .attivo .gs-prog');
 if(v&&b&&v.duration)b.style.transform='scaleX('+Math.min(1,v.currentTime/v.duration)+')';barra=requestAnimationFrame(giro);};barra=requestAnimationFrame(giro);}
// i video: si carica solo quello scelto; prima che parta si vede l'immagine ferma della stessa inquadratura; passaggio con dissolvenza.
// Alla fine il video si ferma sull'ultima immagine; cliccando di nuovo lo stesso bottone riparte.
let corrente=0;const VER='3'; /* cambia quando si rifanno i video, cosi' il browser non tiene i vecchi */
function mostraVideo(n,k,clic){
 const vs=[...el.querySelectorAll('.gs-video video')],poster=el.querySelector('.gs-poster');
 const base='scheda/video/apt'+n+'-'+k+(tel()?'-m':'');
 el.querySelectorAll('.gs-bottoni button').forEach(b=>{b.classList.toggle('attivo',b.dataset.v===k);const p=b.querySelector('.gs-prog');if(p)p.style.transform='scaleX(0)';});
 const att=vs[corrente];
 if(clic&&att.dataset.k===k){att.currentTime=0;att.play().catch(()=>{});return;}
 const nuovo=vs[1-corrente];nuovo.dataset.k=k;nuovo.poster=base+'.jpg?v='+VER;
 if(!att.dataset.k){poster.src=base+'.jpg?v='+VER;} // la prima volta: subito l'immagine ferma
 nuovo.src=base+'.mp4?v='+VER;nuovo.load();
 const via=()=>{nuovo.classList.add('su');att.classList.remove('su');corrente=1-corrente;setTimeout(()=>{if(!att.classList.contains('su')){att.pause();}},950);};
 nuovo.addEventListener('playing',via,{once:true});nuovo.play().catch(()=>{via();});
}
// piantina a tutto schermo (Michele 19/10): riquadro grande sopra la scheda, dietro la scheda resta visibile sfocata
let zm=null;
function zoom(src,alt){
 if(!zm){zm=document.createElement('div');zm.className='gs-zoom';zm.innerHTML=`<div class="gs-zoom-cornice"><img alt=""><button type="button" class="gs-zoom-x" aria-label="Chiudi la piantina">${svg.chiudi}</button></div>`;el.appendChild(zm);
  zm.addEventListener('click',e=>{if(e.target===zm||e.target.closest('.gs-zoom-x'))chiudiZoom();});}
 const im=zm.querySelector('img');im.src=src;im.alt=alt||'';zm.classList.add('su');
 const g=window.gsap;if(g){g.fromTo(zm,{opacity:0},{opacity:1,duration:.3,ease:'power1.out'});g.fromTo(zm.querySelector('.gs-zoom-cornice'),{scale:.92,y:12},{scale:1,y:0,duration:.45,ease:'power3.out'});}
}
function chiudiZoom(){if(!zm||!zm.classList.contains('su'))return false;const g=window.gsap,fine=()=>zm.classList.remove('su');if(g)g.to(zm,{opacity:0,duration:.25,ease:'power1.in',onComplete:fine});else fine();return true;}
function apri(n){
 if(!SCHEDE[n])return false;
 if(!el){el=document.createElement('div');el.id='gs-scheda';el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');document.body.appendChild(el);}
 stato={hash:location.hash};corrente=0;costruisci(n);el.setAttribute('aria-label','Appartamento '+n);el.classList.add('aperta');
 try{history.replaceState(null,'',location.pathname+location.search+'#apt-'+n);}catch(e){}
 const g=window.gsap,sx=el.querySelector('.gs-sx'),dx=el.querySelector('.gs-dx');
 if(g&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
  const tl=g.timeline();
  if(tel()){tl.fromTo(el,{yPercent:100},{yPercent:0,duration:.7,ease:'power3.out'});}
  else{tl.fromTo(sx,{xPercent:-100},{xPercent:0,duration:.85,ease:'power3.inOut'},0).fromTo(dx,{xPercent:100},{xPercent:0,duration:.85,ease:'power3.inOut'},0);}
  tl.fromTo(el.querySelectorAll('.gs-titolo,.gs-sotto,.gs-bottoni button'),{opacity:0,y:14},{opacity:1,y:0,duration:.5,stagger:.04,ease:'power2.out'},'-=.3');
 }
 mostraVideo(n,SCHEDE[n].video[0][0],false);
 // scorrimento morbido del lato destro (sul telefono di tutta la scheda); il video a sinistra resta fermo
 if(window.Lenis){try{const w=tel()?el:el.querySelector('.gs-dx');lenis=new Lenis({wrapper:w,content:w.firstElementChild,smoothWheel:true});const raf=t=>{if(!lenis)return;lenis.raf(t);requestAnimationFrame(raf);};requestAnimationFrame(raf);}catch(e){lenis=null;}}
 addEventListener('keydown',esc,true); /* prima del sito: Esc chiude solo lo zoom o la scheda */
 return true;
}
function esc(e){if(e.key==='Escape'){e.stopImmediatePropagation();e.preventDefault();if(!chiudiZoom())chiudi();}}
function chiudi(){
 if(!el||!el.classList.contains('aperta'))return;removeEventListener('keydown',esc,true);
 const fine=()=>{el.classList.remove('aperta');el.querySelectorAll('video').forEach(v=>{v.pause();v.removeAttribute('src');v.load();});el.innerHTML='';zm=null;if(lenis){lenis.destroy();lenis=null;}if(osserva){osserva.disconnect();osserva=null;}cancelAnimationFrame(barra);if(window.RV)RV.forza=Math.max(RV.forza||0,30);};
 try{history.replaceState(null,'',location.pathname+location.search+((stato&&stato.hash&&!/^#apt-/.test(stato.hash))?stato.hash:''));}catch(e){}
 const g=window.gsap,sx=el.querySelector('.gs-sx'),dx=el.querySelector('.gs-dx');
 if(!g)return fine();
 if(tel())g.to(el,{yPercent:100,duration:.5,ease:'power2.in',onComplete:()=>{g.set(el,{yPercent:0});fine();}});
 else{g.timeline({onComplete:fine}).to(sx,{xPercent:-100,duration:.6,ease:'power3.in'},0).to(dx,{xPercent:100,duration:.6,ease:'power3.in'},0);}
}
window.apriScheda=apri;window.chiudiScheda=chiudi;
// clic sugli appartamenti: etichette e righe della lista nel 3D (passano da openApt) e tendina Appartamenti del menu
if(typeof openApt==='function'){const _o=openApt;openApt=function(n,f){if(SCHEDE[+n])return apri(+n);return _o.apply(this,arguments);};}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-ap="apt"]');if(!b||!SCHEDE[+b.dataset.v])return;e.preventDefault();e.stopImmediatePropagation();
 document.querySelectorAll('#ap-nav .ap-gruppo').forEach(x=>{x.dataset.aperto='false';const q=x.querySelector('.ap-apri')||x.firstElementChild;if(q)q.setAttribute('aria-expanded','false');}); /* come chiudiTendine del menu */
 if(document.body.classList.contains('ap-menu-aperto')){const bg=document.querySelector('[aria-label="Chiudi il menu"]');if(bg)bg.click();else document.body.classList.remove('ap-menu-aperto');}
 apri(+b.dataset.v);},true);
// arrivo con #apt-N o ?apt=N nell'indirizzo
const m=(location.hash.match(/apt-(\d+)/)||location.search.match(/apt=(\d+)/)||[])[1];if(m&&SCHEDE[+m])addEventListener('ap-sito-pronto',()=>setTimeout(()=>apri(+m),300),{once:true});
})();

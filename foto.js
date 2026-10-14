// Fase 4 · materiali fotografati dal vero (Poly Haven, CC0) sul modello navigabile, stessi della prova 3 in Blender.
// Non cambia forme né posizioni: solo materiali, luce e colore finale.
(function(){
// schermata di attesa: si vede il sito solo quando i materiali veri sono pronti, niente versione vecchia nei primi secondi (Michele 12/10)
const velo=document.createElement('div');velo.id='veloFoto';velo.style.cssText='position:fixed;inset:0;z-index:9999;background:#f4f1ea;display:flex;flex-direction:column;align-items:center;justify-content:center;font:500 15px system-ui,sans-serif;color:#5a5a50;transition:opacity .6s';
velo.innerHTML='<div style="font-size:22px;letter-spacing:.08em;margin-bottom:10px">GIARDINI DI SACROFANO</div><div>Caricamento…</div>';(document.body||document.documentElement).appendChild(velo);
const togliVelo=()=>{try{dispatchEvent(new Event('ap-sito-pronto'));}catch(e){}if(!velo.parentNode)return;velo.style.opacity='0';setTimeout(()=>velo.remove(),700);};setTimeout(togliVelo,25000);
let _car=0,_tot=0;THREE.DefaultLoadingManager.onProgress=(u,a,b)=>{_car=a;_tot=b;};
const TL=new THREE.TextureLoader(),cache={};
function pratoCurato(){if(cache.prato)return cache.prato;const W=1024,c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');
 // prato curato verde brillante (Michele 12/10): base verde campo, migliaia di fili corti in toni diversi, leggere chiazze
 let sd=21;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};x.fillStyle='rgb(84,112,52)';x.fillRect(0,0,W,W);
 for(let q=0;q<10;q++){const gx=R()*W,gy=R()*W,rr=120+R()*220;const gr=x.createRadialGradient(gx,gy,0,gx,gy,rr);const l=R()<.5;gr.addColorStop(0,l?'rgba(120,170,60,.25)':'rgba(40,90,25,.25)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);}
 for(let q=0;q<60000;q++){const xx=R()*W,yy=R()*W,l=4+R()*7,a=-1.3+R()*.6,g=105+R()*90;x.strokeStyle=`rgba(${Math.round(g*.62)},${Math.round(g*.88)},${Math.round(g*.4)},.55)`;x.lineWidth=1+R()*.8;x.beginPath();x.moveTo(xx,yy);x.lineTo(xx+Math.cos(a)*l,yy+Math.sin(a)*l);x.stroke();}
 for(let q=0;q<9000;q++){x.fillStyle=`rgba(20,45,12,${.15+R()*.2})`;x.fillRect(R()*W,R()*W,1.5,1.5);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return cache.prato=t;}
function asfaltoTex(){if(cache.asf)return cache.asf;const W=1024,c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');
 // asfalto come nel video IMG_5073 0-2 s: grigio scuro, granuli chiari del pietrisco, zone più chiare e consumate, qualche macchia
 let sd=31;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 x.fillStyle='rgb(50,50,50)';x.fillRect(0,0,W,W);
 for(let q=0;q<14;q++){const gx=R()*W,gy=R()*W,rr=80+R()*260;const gr=x.createRadialGradient(gx,gy,0,gx,gy,rr);const l=R()<.6;gr.addColorStop(0,l?'rgba(105,102,96,.24)':'rgba(25,25,25,.22)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);}
 for(let q=0;q<90000;q++){const g=R()<.6?35+R()*28:85+R()*70;x.fillStyle=`rgba(${g|0},${(g*.99)|0},${(g*.96)|0},${.32+R()*.48})`;const r=.6+R()*1.6;x.fillRect(R()*W,R()*W,r,r);}
 for(let q=0;q<5;q++){const gx=R()*W,gy=R()*W;x.fillStyle='rgba(15,15,15,.3)';x.beginPath();x.ellipse(gx,gy,6+R()*14,4+R()*9,R()*3,0,7);x.fill();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return cache.asf=t;}
function vernice(){if(cache.vern)return cache.vern;const W=512,H=32,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
 // striscia di vernice bianca stesa sull'asfalto: bordi non perfetti, consumata, si vede la grana sotto
 let sd=9;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 x.clearRect(0,0,W,H);for(let i=0;i<W;i++){const a=3+R()*2.5,b=H-3-R()*2.5;x.fillStyle='rgba(236,236,230,.92)';x.fillRect(i,a,1,b-a);}
 for(let q=0;q<2600;q++){x.fillStyle=`rgba(60,60,58,${.25+R()*.55})`;x.fillRect(R()*W,R()*H,1+R()*2,1+R()*1.5);}
 for(let q=0;q<10;q++){x.clearRect(R()*W,R()*H,8+R()*20,2+R()*4);}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return cache.vern=t;}
function intonacoCivile(){if(cache.into)return cache.into;
 // intonaco civile come nei video (IMG_5056 2 s, IMG_5018 4 s, IMG_5073 10 s): bianco neutro opaco, liscio con grana fine di sabbia,
 // leggere ondulazioni della frattazzatura e lievi aloni; niente blocchi né fughe
 const W=1024,c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');
 let sd=51;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 x.fillStyle='rgb(236,236,233)';x.fillRect(0,0,W,W);
 for(let q=0;q<0;q++){const gx=R()*W,gy=R()*W,rr=60+R()*220;const gr=x.createRadialGradient(gx,gy,0,gx,gy,rr);const l=R()<.5;gr.addColorStop(0,l?'rgba(250,250,248,.07)':'rgba(205,205,200,.05)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);}
 for(let q=0;q<0;q++){x.strokeStyle=`rgba(${R()<.5?255:200},${R()<.5?255:200},${R()<.5?252:196},.02)`;x.lineWidth=6+R()*18;x.beginPath();const a=R()*W,b=R()*W;x.arc(a,b,30+R()*120,R()*6,R()*6+1.2);x.stroke();}
 for(let q=0;q<140000;q++){const g=R()<.5?228+R()*8:240+R()*8;x.fillStyle=`rgba(${g|0},${g|0},${(g-1)|0},.4)`;x.fillRect(R()*W,R()*W,1,1);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
 // rilievo della grana: normal map da un rumore fine
 const n=document.createElement('canvas');n.width=n.height=512;const y=n.getContext('2d'),img=y.createImageData(512,512),hgt=new Float32Array(512*512);
 for(let i=0;i<hgt.length;i++)hgt[i]=R();for(let k=0;k<2;k++)for(let i=0;i<hgt.length;i++){const xx=i%512,yy=(i/512)|0;hgt[i]=(hgt[i]*2+hgt[((yy+1)%512)*512+xx]+hgt[yy*512+(xx+1)%512])/4;}
 for(let i=0;i<hgt.length;i++){const xx=i%512,yy=(i/512)|0;const dx=hgt[yy*512+(xx+1)%512]-hgt[yy*512+(xx+511)%512],dy=hgt[((yy+1)%512)*512+xx]-hgt[((yy+511)%512)*512+xx];
  img.data[i*4]=128-dx*90;img.data[i*4+1]=128-dy*90;img.data[i*4+2]=255;img.data[i*4+3]=255;}
 y.putImageData(img,0,0);const nt=new THREE.CanvasTexture(n);nt.wrapS=nt.wrapT=THREE.RepeatWrapping;
 return cache.into={map:t,nor:nt};}
function gresUnica(){if(cache.gresU)return cache.gresU;const W=512,c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');
 let sd=13;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};x.fillStyle='rgb(200,201,203)';x.fillRect(0,0,W,W);
 for(let q=0;q<5000;q++){const g=200+Math.round(R()*26-13);x.fillStyle=`rgba(${g},${g},${g+2},.5)`;x.fillRect(R()*W,R()*W,1+R()*2,1+R()*2);}
 for(let q=0;q<8;q++){const gx=R()*W,gy=R()*W,rr=20+R()*70;const gr=x.createRadialGradient(gx,gy,0,gx,gy,rr);gr.addColorStop(0,'rgba(170,170,172,.16)');gr.addColorStop(1,'rgba(170,170,172,0)');x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return cache.gresU=t;}
// cotto della corte come nel video IMG_5018 2-5 s (Michele 12/10): mattonelle 30x30 chiare e rosate, ognuna un po' diversa, fughe chiare
function cottoChiaro(){if(cache.cottoC)return cache.cottoC;const W=1024,c=document.createElement('canvas');c.width=c.height=W;const x=c.getContext('2d');
 let sd=21;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};const N=8,T=W/N,J=5;x.fillStyle='rgb(140,128,116)';x.fillRect(0,0,W,W);
 for(let r=0;r<N;r++)for(let k=0;k<N;k++){const v=R();const cr=110+v*18|0,cg=58+v*12|0,cb=50+v*10|0;x.fillStyle=`rgb(${cr},${cg},${cb})`;x.fillRect(k*T+J/2,r*T+J/2,T-J,T-J);
  for(let q=0;q<160;q++){const s=R();x.fillStyle=`rgba(${s<.5?120:235},${s<.5?60:170},${s<.5?45:140},${.05+R()*.08})`;x.fillRect(k*T+J/2+R()*(T-J-4),r*T+J/2+R()*(T-J-4),2+R()*5,2+R()*5);}
  const gx=k*T+R()*T,gy=r*T+R()*T,rr=30+R()*60,gr=x.createRadialGradient(gx,gy,0,gx,gy,rr);gr.addColorStop(0,'rgba(240,200,180,.18)');gr.addColorStop(1,'rgba(240,200,180,0)');x.save();x.beginPath();x.rect(k*T+J/2,r*T+J/2,T-J,T-J);x.clip();x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);x.restore();}
 const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.encoding=THREE.sRGBEncoding;tx.anisotropy=8;return cache.cottoC=tx;}
function gres(){if(cache.gres)return cache.gres;const W=1024,H=1024,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
 // 2,4 m x 2,4 m: 4 x 6 lastre da 60 x 40 cm, a correre
 let sd=9;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};const tw=W/4,th=H/6;
 for(let r=0;r<6;r++)for(let k=-1;k<5;k++){const x0=k*tw+(r%2?tw/2:0),y0=r*th;const v=200+Math.round(R()*14-7);x.fillStyle=`rgb(${v},${v+1},${v+3})`;x.fillRect(x0,y0,tw,th);
  for(let q=0;q<900;q++){const g=v+Math.round(R()*26-13);x.fillStyle=`rgba(${g},${g},${g+2},.5)`;x.fillRect(x0+R()*tw,y0+R()*th,1+R()*2,1+R()*2);}
  for(let q=0;q<5;q++){const gx=x0+R()*tw,gy=y0+R()*th,rr=10+R()*40;const gr=x.createRadialGradient(gx,gy,0,gx,gy,rr);gr.addColorStop(0,'rgba(170,170,172,.18)');gr.addColorStop(1,'rgba(170,170,172,0)');x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);}}
 x.strokeStyle='rgb(150,150,152)';x.lineWidth=2.2;for(let r=0;r<=6;r++){x.beginPath();x.moveTo(0,r*th);x.lineTo(W,r*th);x.stroke();}
 for(let r=0;r<6;r++)for(let k=-1;k<6;k++){const xx=k*tw+(r%2?tw/2:0);x.beginPath();x.moveTo(xx,r*th);x.lineTo(xx,(r+1)*th);x.stroke();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return cache.gres=t;}
function tex(id,f,srgb){if(id==='intonacoC'){const I=intonacoCivile();return f==='diff'?I.map:f==='nor'?I.nor:null;}if(id==='asfaltoD')return f==='diff'?asfaltoTex():null;if(id==='gres')return f==='diff'?gres():null;if(id==='cottoC')return f==='diff'?cottoChiaro():null;if(id==='prato')return f==='diff'?pratoCurato():null;const k=id+f;if(cache[k])return cache[k];const t=TL.load('texture/'+id+'/'+f+'.jpg');t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=8;if(srgb)t.encoding=THREE.sRGBEncoding;return cache[k]=t;}
// colore del materiale nel modello -> [texture, lato reale in metri, tinta]
const FOTO={intonaco:['intonacoC',1.5,[.93,.93,.92]],intonaco2:['intonacoC',1.5,[.93,.93,.92]],coppi:['clay_roof_tiles',4,0xffffff],
 tufo:['white_sandstone_bricks_03',1.5,0x87909e],tufoC:['white_sandstone_bricks_03',1.1,0x9ba3ae],pavimento:['gres',2.4,0x7b7d81],cotto:['cottoC',2.4,0xffffff],asfalto:['asphalt_02',3,0xffffff],
 prato:['prato',2.5,[.82,.82,.78]],asfaltoD:['asfaltoD',4,0xffffff],prato_armato:['grass_concrete_pavement',1.97,0xc2cdb4]};
const MAPPA={'b5643f':'coppi','956447':'coppi','d8d4c7':'intonaco','f7f5f0':'intonaco','f1efe9':'intonaco','e1dccf':'intonaco','e9e5da':'intonaco','ece8de':'intonaco','ece6d2':'intonaco','efe8d6':'intonaco','e6e0d2':'intonaco','f2f2ee':'intonaco','d9d2b8':'intonaco','bdb9ad':'intonaco2',
 'c9b48c':'tufo','c5b390':'tufo','b59a6c':'tufo','c5b391':'tufoC','d2d0c7':'pavimento','a8a49b':'pavimento','b9b6ad':'pavimento','c07a58':'cotto','b4704f':'cotto','4a4946':'asfaltoD','5f5d59':'asfaltoD','588638':'prato','819167':'prato','a7b18a':'prato_armato'};
const Z=new THREE.Vector3(0,1,0);
function uvFoto(mesh,lato){ // UV per faccia come in Blender: muri (lungo il muro, altezza), pavimenti (x, z), falde (lungo la pendenza)
 let g=mesh.geometry;if(g.userData.fotoUV)return;g=g.index?g.toNonIndexed():g.clone();mesh.updateMatrixWorld(true);
 const p=g.attributes.position,uv=new Float32Array(p.count*2),a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=new THREE.Vector3(),h=new THREE.Vector3(),d=new THREE.Vector3(),w=new THREE.Vector3();
 for(let i=0;i<p.count;i+=3){a.fromBufferAttribute(p,i).applyMatrix4(mesh.matrixWorld);b.fromBufferAttribute(p,i+1).applyMatrix4(mesh.matrixWorld);c.fromBufferAttribute(p,i+2).applyMatrix4(mesh.matrixWorld);
  n.subVectors(c,b).cross(a.clone().sub(b)).normalize();
  for(let k=0;k<3;k++){w.fromBufferAttribute(p,i+k).applyMatrix4(mesh.matrixWorld);let u,v;
   if(Math.abs(n.y)>.97){u=w.x;v=w.z;}else if(Math.abs(n.y)>.05){h.crossVectors(Z,n).normalize();d.crossVectors(n,h).normalize();u=w.dot(h);v=w.dot(d);}else{h.crossVectors(Z,n).normalize();u=w.dot(h);v=w.y;}
   uv[(i+k)*2]=u/lato;uv[(i+k)*2+1]=v/lato;}}
 g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.computeVertexNormals();g.userData.fotoUV=true;mesh.geometry=g;}
async function applica(){const P_=()=>new Promise(r=>setTimeout(r,0)); // a pezzi: tra un pezzo e l'altro il browser fa andare l'apertura (14/10)
 // stessa luce e stesso colore finale del sito originale: cambiano solo i materialirenderer.toneMappingExposure=1.0;
 const hemi=scene.children.find(o=>o.isHemisphereLight),sun=scene.children.find(o=>o.isDirectionalLight);
 if(sun){sun.shadow.radius=3;}
 const fatti=new Map();let n=0;
 scene.traverse(o=>{if(!o.isMesh)return;const M=Array.isArray(o.material)?o.material:[o.material];
  M.forEach((m,i)=>{if(!m||!m.color||m.type!=='MeshLambertMaterial')return;const k=MAPPA[m.color.getHexString()];if(!k)return;const [id,lato,tinta]=FOTO[k];
   let nm=fatti.get(m);if(!nm){nm=new THREE.MeshStandardMaterial({transparent:m.transparent,opacity:m.opacity,side:m.side,polygonOffset:m.polygonOffset,polygonOffsetFactor:m.polygonOffsetFactor,polygonOffsetUnits:m.polygonOffsetUnits,depthWrite:m.depthWrite,metalness:0});Array.isArray(tinta)?nm.color.setRGB(...tinta):nm.color.set(tinta);nm.map=tex(id,'diff',true);nm.normalMap=tex(id,'nor');nm.roughnessMap=tex(id,'rough');nm.roughness=id==='gres'?.75:id==='prato'?.95:id==='intonacoC'?.92:1;if(id==='intonacoC')nm.normalScale.set(.55,.55);nm.normalScale.set(.8,.8);nm.needsUpdate=true;
    // le dissolvenze dei piani agiscono sul materiale originale: la copia ne segue l'opacità
    nm.userData.orig=m;fatti.set(m,nm);}
   if(Array.isArray(o.material))o.material[i]=nm;else o.material=nm;uvFoto(o,lato);n++;});});
 // tettoie: legno vero (Poly Haven stained_pine), un po' più chiaro del marrone scurissimo (Michele 12/10)
 const legno=new THREE.MeshStandardMaterial({map:tex('weathered_brown_planks','diff',true),normalMap:tex('weathered_brown_planks','nor'),roughnessMap:tex('weathered_brown_planks','rough'),roughness:1,metalness:0,color:0x8a8078});
 scene.traverse(o=>{if(o.isMesh&&!Array.isArray(o.material)&&o.material.color&&o.material.color.getHexString()==='0f0805')o.material=legno;});
 persiane();await P_();vetri();await P_();gronde();await P_();lampioni();await P_();ghiaia();await P_();ghiaia5();await P_();muro7();await P_();strisciaChiara();await P_();gradiniPietra();await P_();lastre();await P_();grigliati();await P_();cordoli();await P_();pratoSalita();await P_();muroConfine();await P_();murettoSalita();await P_();parcheggioOvest();await P_();pratoArmato();await P_();otto();await P_();scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.color&&o.material.color.getHexString()==='3f5f3a')o.visible=false;});ciuffi();await P_();salita();await P_();fotinie();await P_();strisceVernice();await P_();
 const seguire=[...fatti.values()];
 const prima=renderer.render.bind(renderer);renderer.render=(s,c)=>{for(const nm of seguire){const m=nm.userData.orig;nm.opacity=m.opacity;nm.visible=m.visible;nm.transparent=m.transparent;}prima(s,c);};
 console.log('foto: materiali sostituiti su',n,'mesh');fuoriMura();await P_();vetrata8();await P_();porta5();await P_();dieci();await P_();dodici();await P_();buco1213();await P_();zoccolo12();await P_();cancellettiEntrata();await P_();paletti12();await P_();chiudiPortico12();await P_();granito();await P_();alberiVeri();await P_();parcheggi();await P_();if(!location.search.includes('nocielo'))cielo();await P_();notteInit();await P_();vistaVera();await P_();limitiVista();await P_();if(!location.search.includes('noott'))ottimizzaVerde();await P_();
 const att=setInterval(()=>{if(_car>=_tot){clearInterval(att);setTimeout(togliVelo,400);}},250);}
// ---- persiane e portoni come nel video IMG_5073: doghe orizzontali verniciate marrone scurissimo, con luce e ombra su ogni doga
function persiane(){
 // una doga: luce sul bordo alto, ombra profonda sotto
 const doghe=(x,x0,y0,w,h,n)=>{const dh=h/n;for(let i=0;i<n;i++){const y=y0+i*dh;const g=x.createLinearGradient(0,y,0,y+dh);
   g.addColorStop(0,'#7a6252');g.addColorStop(.08,'#5c4739');g.addColorStop(.55,'#2f231c');g.addColorStop(.78,'#120d0a');g.addColorStop(1,'#040302');
   x.fillStyle=g;x.fillRect(x0,y,w,dh);x.fillStyle='rgba(255,236,215,.22)';x.fillRect(x0,y+1,w,1.6);x.fillStyle='rgba(0,0,0,.55)';x.fillRect(x0,y+dh-2.2,w,2.2);}};
 // riquadro con cornice in rilievo (luce in alto a sinistra, ombra in basso a destra)
 const cornice=(x,x0,y0,w,h,b)=>{x.fillStyle='#4a392f';x.fillRect(x0-b,y0-b,w+2*b,b);x.fillRect(x0-b,y0-b,b,h+2*b);x.fillStyle='#0b0806';x.fillRect(x0-b,y0+h,w+2*b,b);x.fillRect(x0+w,y0-b,b,h+2*b);};
 const vernice=(x,W,H,seme)=>{let sd=seme;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};for(let k=0;k<1800;k++){x.fillStyle=`rgba(${R()<.5?255:0},${R()<.5?240:0},${R()<.5?220:0},${.015+R()*.02})`;x.fillRect(R()*W,R()*H,1+R()*3,1);}};
 const fa=(righe,porta)=>{const W=porta?512:256,H=porta?1024:512,c=document.createElement('canvas');c.width=W;c.height=H;const x=c.getContext('2d');
  x.fillStyle='#2e231c';x.fillRect(0,0,W,H);
  if(!porta){const T=14;doghe(x,T,T,W-2*T,H-2*T,righe);x.strokeStyle='#3d2e25';x.lineWidth=T;x.strokeRect(T/2,T/2,W-T,H-T);}
  else{// porta-persiana come il disegno di Michele: due ante che si aprono, ognuna con due riquadri di doghe uguali (alto più lungo, basso più corto)
   const T=22,M=10,R=26,aw=(W-2*T-M)/2,yr=T+(H-2*T)*.6;
   for(let a=0;a<2;a++){const x0=T+a*(aw+M)+10,ww=aw-20;
    const h1=yr-R/2-T-10,h2=H-T-10-(yr+R/2);
    doghe(x,x0,T+10,ww,h1,Math.round(h1/26));cornice(x,x0,T+10,ww,h1,4);
    doghe(x,x0,yr+R/2,ww,h2,Math.round(h2/26));cornice(x,x0,yr+R/2,ww,h2,4);}
   // battuta centrale fra le due ante
   x.fillStyle='#120d0a';x.fillRect(W/2-2,0,4,H);x.fillStyle='rgba(255,236,215,.12)';x.fillRect(W/2-6,0,2,H);}
  x.strokeStyle='rgba(255,235,215,.12)';x.lineWidth=1.5;x.strokeRect(1,1,W-2,H-2);vernice(x,W,H,porta?7:3);
  const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.anisotropy=8;return t;};
 const tp=fa(22,false),td=fa(36,true);
 try{PAL.A.win=0xffffff;PAL.B.win=0x8a8f96;}catch(e){}
 for(const L of Object.values(LV)){if(!L.m)continue;
  if(L.m.win){L.m.win.map=tp;L.m.win.color.set(0xffffff);L.m.win.emissive&&L.m.win.emissive.set(0x000000);L.m.win.needsUpdate=true;}
  if(L.m.door){L.m.door.map=td;L.m.door.color.set(0xffffff);L.m.door.needsUpdate=true;}
  if(L.m.shutterLine){L.m.shutterLine.visible=false;}}
}
// ---- striscia pavimentata lungo la casa del 2 in gres chiaro quasi beige, come nel video IMG_5056 3 s (Michele 12/10)
function strisciaChiara(){// il pavimento esterno e' un pezzo unico: sopra la striscia si posa una lastra sottile con il gres chiaro
 const x0=-18.55,x1=-17.68,z0=3.13,z1=10.44,g=new THREE.PlaneGeometry(x1-x0,z1-z0);g.rotateX(-Math.PI/2);
 const p=g.attributes.position,uv=g.attributes.uv;for(let k=0;k<p.count;k++)uv.setXY(k,(p.getX(k)+(x0+x1)/2)/2.4,(p.getZ(k)+(z0+z1)/2)/2.4);
 const m=new THREE.MeshStandardMaterial({map:gres(),roughness:.7,metalness:0,color:0xd2c9b8,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const o=new THREE.Mesh(g,m);o.position.set((x0+x1)/2,.014,(z0+z1)/2);o.receiveShadow=true;scene.add(o);}
// ---- scalini all'ingresso del 3: stessa pietra del marciapiede davanti allo zoccolo (Michele 12/10)
function gradiniPietra(){// gradini dei cancelletti del 3 e del 5 (Michele 13/10: il 5 come il 3, attaccati alla scala dell'8); pietra del marciapiede: sopra le lastre dritte rispetto al gradino, sui lati una lastra intera senza tagli (Michele 12/10)
 let mp=null;const sc=[];scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;const b=new THREE.Box3().setFromObject(o);const c=b.getCenter(new THREE.Vector3());
  if(!mp&&Math.abs(b.min.x+14.08)<.02&&Math.abs(b.max.x+12.45)<.02&&b.max.y<.1)mp=o.material;
  if(b.max.y<.25&&(c.distanceTo(new THREE.Vector3(-11.85,c.y,12.48))<.12||c.distanceTo(new THREE.Vector3(-12.06,c.y,12.69))<.12||c.distanceTo(new THREE.Vector3(3.12,c.y,13.62))<.12||c.distanceTo(new THREE.Vector3(3.12,c.y,13.92))<.12))sc.push(o);});
 if(!mp)return;
 for(const o of sc){const g=o.geometry,ps=g.attributes.position,nr=g.attributes.normal;g.computeBoundingBox();const bb=g.boundingBox,uv=new Float32Array(ps.count*2);
  for(let k=0;k<ps.count;k++){const x=ps.getX(k),y=ps.getY(k),z=ps.getZ(k),ny=nr?nr.getY(k):0;
   if(Math.abs(ny)>.5){uv[k*2]=x/1.6;uv[k*2+1]=z/1.6;}
   else{const nx=nr?Math.abs(nr.getX(k)):0,a=nx>.5?(z-bb.min.z)/(bb.max.z-bb.min.z):(x-bb.min.x)/(bb.max.x-bb.min.x);uv[k*2]=.03+a*.19;uv[k*2+1]=.03+(y-bb.min.y)/(bb.max.y-bb.min.y)*.19;}}
  g.setAttribute('uv',new THREE.BufferAttribute(uv,2));g.attributes.uv.needsUpdate=true;o.material=mp;}}
// ---- sotto le falde: tavolato di legno scuro, come le gronde nel video IMG_5018 0-2 s (Michele 12/10); le tegole solo sopra
function gronde(){const tc=tex('clay_roof_tiles','diff',true),tw=tex('weathered_brown_planks','diff',true),legnoSotto=new THREE.MeshStandardMaterial({map:tw,roughness:1,metalness:0,color:0x5e5048,side:THREE.BackSide});let n=0;const coppi=new Set();
 scene.traverse(o=>{if(!o.isMesh||Array.isArray(o.material))return;const m=o.material;if(!m.map||m.map!==tc)return;coppi.add(m);
  const s=new THREE.Mesh(o.geometry,legnoSotto);s.castShadow=false;s.receiveShadow=true;o.add(s);n++;});
 coppi.forEach(m=>{m.side=THREE.FrontSide;m.needsUpdate=true;});console.log('gronde in legno',n);}
// ---- lampione basso nero accanto all'ingresso (foto IMG_5184, Michele 12/10)
function lampioni(){const nero=new THREE.MeshStandardMaterial({color:0x151515,metalness:.6,roughness:.45}),vetro=new THREE.MeshStandardMaterial({color:0xe8e2cf,emissive:0x2a2416,roughness:.3});vetro.userData.lampada=true;
 for(const [x,z] of [[-4.98,13.55]]){const g=new THREE.Group();g.position.set(x,0,z);
  const b=new THREE.Mesh(new THREE.CylinderGeometry(.09,.11,.08,16),nero);b.position.y=.04;g.add(b);
  const p=new THREE.Mesh(new THREE.CylinderGeometry(.035,.04,1.25,12),nero);p.position.y=.08+.625;g.add(p);
  const l=new THREE.Mesh(new THREE.CylinderGeometry(.075,.065,.2,12),vetro);l.position.y=1.43;g.add(l);
  const c=new THREE.Mesh(new THREE.ConeGeometry(.12,.1,12),nero);c.position.y=1.58;g.add(c);
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(g);}
 // lanterna appesa al muro sopra la porta del 4 (scheda 4, Michele 12/10): staffa a braccio e lanterna che pende
 for(const [x,z,y,nz] of [[-0.59,5.06,2.66,1]]){const g=new THREE.Group();g.position.set(x,y,z);
  const pl=new THREE.Mesh(new THREE.BoxGeometry(.1,.16,.02),nero);pl.position.set(0,0,.01*nz);g.add(pl);
  const br=new THREE.Mesh(new THREE.BoxGeometry(.02,.02,.3),nero);br.position.set(0,.03,.16*nz);g.add(br);
  const ri=new THREE.Mesh(new THREE.TorusGeometry(.035,.007,6,12),nero);ri.position.set(0,.0,.3*nz);g.add(ri);
  const ca=new THREE.Mesh(new THREE.CylinderGeometry(.004,.004,.12,4),nero);ca.position.set(0,-.06,.3*nz);g.add(ca);
  const tp=new THREE.Mesh(new THREE.ConeGeometry(.1,.08,4),nero);tp.rotation.y=Math.PI/4;tp.position.set(0,-.14,.3*nz);g.add(tp);
  const ve=new THREE.Mesh(new THREE.CylinderGeometry(.075,.06,.2,4),vetro);ve.rotation.y=Math.PI/4;ve.position.set(0,-.28,.3*nz);g.add(ve);
  const fo=new THREE.Mesh(new THREE.CylinderGeometry(.065,.065,.025,4),nero);fo.rotation.y=Math.PI/4;fo.position.set(0,-.39,.3*nz);g.add(fo);
  g.traverse(o=>{if(o.isMesh)o.castShadow=true;});scene.add(g);}}
// ---- aiuole di ghiaia ai lati del giardino del 4, dove cresce il lauro (scheda 4, Michele 12/10), bordate con un cordolo sottile di pietra chiara
var AIUOLE_GHIAIA=[[-4.575,-3.68,7.72,13.145],[0.4,1.295,7.72,13.145],[-2.075,0.4,12.5,13.145]];
// cordoli [x0,z0,x1,z1]: chiudono le aiuole verso il pavimento (anche l'aiuola sul fronte, sotto il lauro: Michele 12/10)
var CORDOLI_AIUOLE=[[-4.575,7.745,-3.68,7.745],[-3.705,7.72,-3.705,13.145],[0.4,7.745,1.295,7.745],[0.425,7.72,0.425,12.5],[-2.075,12.525,0.45,12.525],[-2.05,12.5,-2.05,13.145]];
function ghiaia(){let sd=77;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle='#5b4a3a';x.fillRect(0,0,512,512);
 for(let i=0;i<60;i++){const gx=R()*512,gy=R()*512,rr=30+R()*90,gr=x.createRadialGradient(gx,gy,0,gx,gy,rr),v=R()<.5;gr.addColorStop(0,v?'rgba(70,55,40,.5)':'rgba(120,100,80,.35)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);}
 for(let i=0;i<6000;i++){const v=60+R()*50|0;x.fillStyle=`rgba(${v+20},${v+8},${v-6},.6)`;x.fillRect(R()*512,R()*512,1+R()*2,1+R()*2);}
 for(let i=0;i<1300;i++){const px=R()*512,py=R()*512,r=2.5+R()*6,v=135+R()*90|0;x.fillStyle='rgba(20,14,8,.45)';x.beginPath();x.ellipse(px+1.2,py+1.5,r,r*.75,0,0,6.3);x.fill();
  x.fillStyle=`rgb(${v},${v-6|0},${v-16|0})`;x.beginPath();x.ellipse(px,py,r,r*(.55+R()*.4),R()*3,0,6.3);x.fill();x.fillStyle='rgba(255,250,240,.25)';x.beginPath();x.ellipse(px-r*.3,py-r*.3,r*.35,r*.25,0,0,6.3);x.fill();}
 const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.encoding=THREE.sRGBEncoding;tx.anisotropy=8;
 const mg=new THREE.MeshStandardMaterial({map:tx,roughness:1,metalness:0,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const mb=new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.6,metalness:0,color:0xe8e6e0});
 for(const [x0,x1,z0,z1] of AIUOLE_GHIAIA){const w=x1-x0,d=z1-z0,g=new THREE.PlaneGeometry(w,d);g.rotateX(-Math.PI/2);
  const uv=g.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*w/.6,uv.getY(k)*d/.6);
  const o=new THREE.Mesh(g,mg);o.position.set((x0+x1)/2,.068,(z0+z1)/2);o.receiveShadow=true;scene.add(o);
}
 const B=.05,H=.05,y=.06+H/2-.01;for(const [a0,b0,a1,b1] of CORDOLI_AIUOLE){const L=Math.hypot(a1-a0,b1-b0),e=new THREE.Mesh(new THREE.BoxGeometry(a0===a1?B:L,H,a0===a1?L:B),mb);e.position.set((a0+a1)/2,y,(b0+b1)/2);e.castShadow=e.receiveShadow=true;scene.add(e);}}
// ---- ghiaia naturale beige-grigia del giardino del 5 (foto APPARTAMENTO 5, Michele 12/10)
function ghiaia5(){let sd=91;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 // ghiaia vera fotografata (Poly Haven gravel_floor_02, CC0) con rilievo, un filo calda come nelle foto (Michele 12/10)
 const ld=f=>{const q=TL.load('texture/gravel_floor_02/'+f+'.jpg');q.wrapS=q.wrapT=THREE.RepeatWrapping;q.anisotropy=8;return q;};const tx=ld('diff');tx.encoding=THREE.sRGBEncoding;
 const m=new THREE.MeshStandardMaterial({map:tx,normalMap:ld('nor_gl'),normalScale:new THREE.Vector2(1.6,1.6),color:0xf0e2cc,roughness:1,metalness:0,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const [x0,x1,z0,z1]=[1.66,4.82,7.52,13.3],g=new THREE.PlaneGeometry(x1-x0,z1-z0);g.rotateX(-Math.PI/2);const uv=g.attributes.uv;for(let k=0;k<uv.count;k++)uv.setXY(k,uv.getX(k)*(x1-x0)/1.3,uv.getY(k)*(z1-z0)/1.3);
 const o=new THREE.Mesh(g,m);o.position.set((x0+x1)/2,.066,(z0+z1)/2);o.receiveShadow=true;scene.add(o);
 // lastre grigio antracite a passi, appena sopra la ghiaia (foto)
 // lastre a passi: stessa pasta delle lastre dell'1 (gres, spigoli smussati, spessore), ma tinta unita antracite e misura 55 x 85 (Michele 12/10)
 const scure=new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.75,metalness:0,color:0x7b7d81});   
 const SX=.55,SZ=.85,bv=.012,sh=new THREE.Shape();sh.moveTo(-SX/2+bv,-SZ/2+bv);sh.lineTo(SX/2-bv,-SZ/2+bv);sh.lineTo(SX/2-bv,SZ/2-bv);sh.lineTo(-SX/2+bv,SZ/2-bv);
 const eg=new THREE.ExtrudeGeometry(sh,{depth:.05,bevelEnabled:true,bevelThickness:.012,bevelSize:bv,bevelSegments:2});eg.rotateX(-Math.PI/2);eg.translate(0,-.04,0);
 {const pp=eg.attributes.position,uu=new Float32Array(pp.count*2);for(let k=0;k<pp.count;k++){uu[k*2]=pp.getX(k)/3+.17;uu[k*2+1]=pp.getZ(k)/3+.21;}eg.setAttribute('uv',new THREE.BufferAttribute(uu,2));eg.computeVertexNormals();}
 const vec=[];scene.traverse(q=>{const p=q.position;if(q.isMesh&&q.geometry.type==='BoxGeometry'&&q.material.color&&q.material.color.getHexString()==='2c2e31'&&p.x>1.6&&p.x<4.9&&p.z>7.4&&p.z<13.4)vec.push(q);});
 for(const q of vec){q.updateMatrixWorld();const wp=q.getWorldPosition(new THREE.Vector3()),rq=q.getWorldQuaternion(new THREE.Quaternion());const n=new THREE.Mesh(eg,scure);n.position.set(wp.x,.1,wp.z);n.quaternion.copy(rq);n.castShadow=n.receiveShadow=true;scene.add(n);q.visible=false;}
 // striscia di terra con piantine lungo il cordolo (foto)
 const ct=document.createElement('canvas');ct.width=ct.height=256;const y=ct.getContext('2d');y.fillStyle='#4a3b2c';y.fillRect(0,0,256,256);
 for(let i=0;i<3000;i++){const v=50+R()*45|0;y.fillStyle=`rgba(${v+20},${v+8},${v-4},.7)`;y.fillRect(R()*256,R()*256,1+R()*3,1+R()*3);}
 for(let i=0;i<120;i++){const px=R()*256,py=R()*256;y.fillStyle=`rgba(${60+R()*40|0},${110+R()*50|0},${40+R()*20|0},.9)`;for(let k=0;k<5;k++){y.beginPath();y.ellipse(px+(R()-.5)*8,py+(R()-.5)*8,1.5+R()*2,1+R(),R()*3,0,6.3);y.fill();}}
 const tt=new THREE.CanvasTexture(ct);tt.wrapS=tt.wrapT=THREE.RepeatWrapping;tt.encoding=THREE.sRGBEncoding;
 const gt=new THREE.PlaneGeometry(.84,5.78);gt.rotateX(-Math.PI/2);const ut=gt.attributes.uv;for(let k=0;k<ut.count;k++)ut.setXY(k,ut.getX(k)*.84/.8,ut.getY(k)*5.78/.8);
 const ot=new THREE.Mesh(gt,new THREE.MeshStandardMaterial({map:tt,roughness:1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));ot.position.set(5.34,.07,10.39);ot.receiveShadow=true;scene.add(ot);}
// ---- vetri piu' veri: interno scuro in basso, riflesso del cielo in alto, una velatura diagonale (Michele 12/10)
function vetri(){const c=document.createElement('canvas');c.width=128;c.height=256;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,0,256);g.addColorStop(0,'#d3e3ee');g.addColorStop(.3,'#aec6d6');g.addColorStop(.46,'#90a7b5');g.addColorStop(.5,'#5f6b5c');g.addColorStop(.57,'#4d5a4c');g.addColorStop(.62,'#7f8b92');g.addColorStop(1,'#59646b');x.fillStyle=g;x.fillRect(0,0,128,256);
 const d=x.createLinearGradient(0,0,128,256);d.addColorStop(0,'rgba(255,255,255,0)');d.addColorStop(.42,'rgba(255,255,255,0)');d.addColorStop(.47,'rgba(255,255,255,.22)');d.addColorStop(.52,'rgba(255,255,255,.06)');d.addColorStop(.58,'rgba(255,255,255,0)');d.addColorStop(.64,'rgba(255,255,255,.1)');d.addColorStop(.67,'rgba(255,255,255,0)');x.fillStyle=d;x.fillRect(0,0,128,256);
 const tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;let n=0;
 for(const L of Object.values(LV)){const m=L.m&&L.m.glass;if(!m)continue;m.map=tx;m.color.set(0xffffff);m.metalness=.15;m.roughness=.04;m.needsUpdate=true;n++;}
 scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.userData||!o.material.userData.vetro)return;const g=o.geometry;g.computeBoundingBox();const b=g.boundingBox,p=g.attributes.position;if(!g.attributes.uv)return;const uv=g.attributes.uv;
  const sx=b.max.x-b.min.x,sy=b.max.y-b.min.y,sz=b.max.z-b.min.z;for(let k=0;k<p.count;k++){const u=sx>sz?(p.getX(k)-b.min.x)/(sx||1):(p.getZ(k)-b.min.z)/(sz||1);uv.setXY(k,u,(p.getY(k)-b.min.y)/(sy||1));}uv.needsUpdate=true;});}
// ---- muro di fondo del 7 in mattoni vecchi con un po' d'edera (foto APPARTAMENTO 7, Michele 12/10); Poly Haven castle_brick_02_red, CC0
function muro7(){const ld=f=>{const q=TL.load('texture/brick_wall_02/'+f+'.jpg');q.wrapS=q.wrapT=THREE.RepeatWrapping;q.anisotropy=8;return q;};const tx=ld('diff');tx.encoding=THREE.sRGBEncoding;
 const mm=new THREE.MeshStandardMaterial({map:tx,normalMap:ld('nor_gl'),color:0x9d9a94,roughness:.95,metalness:0});const muri=[];
 scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh)return;const m=o.material;if(!m||!m.userData||!m.userData.orig)return;const c=m.userData.orig.color.getHexString();if(c!=='c9b48c'&&c!=='c5b390')return;
  const b=new THREE.Box3().setFromObject(o);const cx=(b.min.x+b.max.x)/2,cz=(b.min.z+b.max.z)/2;if(cx>20.3&&cx<27.5&&cz>-10.5&&cz<7&&b.max.y>1.6)muri.push([o,b]);});
 muri.forEach(([o])=>{o.material=mm;uvFoto(o,2.2);});
 // edera: ciuffi di foglie che scendono dalla cima del muro in alcuni punti
 const lc=document.createElement('canvas');lc.width=lc.height=64;const x=lc.getContext('2d');x.clearRect(0,0,64,64);x.fillStyle='#fff';x.beginPath();x.moveTo(32,4);x.lineTo(52,22);x.lineTo(44,26);x.lineTo(58,44);x.lineTo(36,40);x.lineTo(32,60);x.lineTo(28,40);x.lineTo(6,44);x.lineTo(20,26);x.lineTo(12,22);x.closePath();x.fill();
 const lt=new THREE.CanvasTexture(lc);const lm=new THREE.MeshLambertMaterial({map:lt,alphaTest:.5,side:THREE.DoubleSide});const gq=new THREE.PlaneGeometry(.09,.09);
 let sd=55;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 // edera e erbetta solo sulla faccia del muro verso il giardino, attaccate alla pietra (Michele 12/10): si trova la faccia con un raggio dal giardino
 const A=new THREE.Vector3(26.83,0,-9.43),B=new THREE.Vector3(20.18,0,6.58),tg=B.clone().sub(A).normalize(),nw=new THREE.Vector3(-tg.z,0,tg.x);if(nw.x>0)nw.negate();
 const meshes=muri.map(m=>m[0]),rc=new THREE.Raycaster(),fog=[],erba=[];
 const faccia=(s,y)=>{const p=A.clone().addScaledVector(tg,s).addScaledVector(nw,4);p.y=y;rc.set(p,nw.clone().negate());const h=rc.intersectObjects(meshes,false)[0];return h&&h.distance<6?h.point:null;};
 const cima=(q)=>{const p=q.clone().addScaledVector(nw,-.15);p.y=8;rc.set(p,new THREE.Vector3(0,-1,0));const h=rc.intersectObjects(meshes,false)[0];return h?h.point.y:null;};
 const L=A.distanceTo(B);
 // edera: macchie che partono da terra o scendono dalla cima, sempre sulla faccia del muro
 for(let s=.6;s<L-.4;s+=.9+R()*1.6){const f0=faccia(s,1);if(!f0)continue;const top=cima(f0);if(!top||top<1)continue;
  const dalBasso=R()<.5,w=.35+R()*.7,hh=dalBasso?.5+R()*1.4:.6+R()*1.2,y0=dalBasso?0:top-hh-.05,dens=Math.round(w*hh*520);
  for(let k=0;k<dens;k++){const u=(R()-.5)*w*(dalBasso?(1-(R()*.5)):(1)),v=R();const yy=dalBasso?y0+Math.pow(v,1.3)*hh:top-.05-Math.pow(v,1.4)*hh;if(yy>top-.04)continue;
   const sw=s+u*(dalBasso?(1-(yy-y0)/hh*.6):(1-(top-yy)/hh*.5));const f=faccia(sw,yy);if(!f)continue;fog.push([f.x+nw.x*(.015+R()*.04),yy,f.z+nw.z*(.015+R()*.04)]);}}
 // erbetta varia alla base del muro, nella terra fra muro e prato
 for(let s=.3;s<L-.2;s+=.03){if(R()<.2)continue;const f=faccia(s,.3);if(!f)continue;const d=.02+Math.pow(R(),1.5)*.35;erba.push([f.x+nw.x*d,f.z+nw.z*d]);}
 const im=new THREE.InstancedMesh(gq,lm,fog.length),M=new THREE.Matrix4(),q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3(),col=new THREE.Color();
 const base=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,0,1),nw);
 fog.forEach((p,i)=>{q.copy(base).multiply(new THREE.Quaternion().setFromEuler(new THREE.Euler((R()-.5)*.9,(R()-.5)*.9,R()*6.3)));const s=.6+R()*.7;S.set(s,s,s);P.set(...p);M.compose(P,q,S);im.setMatrixAt(i,M);const l=.5+R()*.6;col.setRGB(.035*l,.085*l,.03*l);im.setColorAt(i,col);});
 im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.receiveShadow=true;scene.add(im);
 // fili d'erba di varie altezze, alcuni secchi
 const pos=[];for(let n=0;n<7;n++){const an=n/7*6.28+R(),h=.08+R()*.2,lx=Math.cos(an)*.012,lz=Math.sin(an)*.012,tx=-Math.sin(an)*.005,tz=Math.cos(an)*.005;pos.push(lx-tx,0,lz-tz,lx+tx,0,lz+tz,lx*4+Math.cos(an)*.05,h,lz*4+Math.sin(an)*.05);}
 const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));ge.computeVertexNormals();
 const ie=new THREE.InstancedMesh(ge,new THREE.MeshStandardMaterial({color:0xffffff,roughness:.9,side:THREE.DoubleSide}),erba.length);
 erba.forEach(([x,z],i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),R()*6.3);const s=.6+R()*1.2;S.set(s,s*(.6+R()*.9),s);P.set(x,.04,z);M.compose(P,q,S);ie.setMatrixAt(i,M);const sec=R()<.25,l=.7+R()*.4;sec?col.setRGB(.26*l,.23*l,.13*l):col.setRGB(.07*l,.15*l,.045*l);ie.setColorAt(i,col);});
 ie.instanceMatrix.needsUpdate=true;if(ie.instanceColor)ie.instanceColor.needsUpdate=true;scene.add(ie);
 console.log('muro7',muri.length,'edera',fog.length,'erba',erba.length);}
// ---- salita d'ingresso (Michele 12/10): asfalto con UV continue (niente righe), siepe di lauro al posto del muretto verde, strada che prosegue oltre il cancello
function salita(){const vecchie=[];scene.traverse(o=>{if(o.isMesh&&o.geometry.type==='BoxGeometry'&&o.material.color&&o.material.color.getHexString()==='4f7a3a')vecchie.push(o);});
 const pts=vecchie.map(o=>{const b=new THREE.Box3().setFromObject(o);o.visible=false;return [(b.min.x+b.max.x)/2,(b.min.z+b.max.z)/2,b.min.y];});
 {const K=SACROFANO_MODEL.landscape,H=K.ramp_hedge||[],G=K.gate.at,lon=p=>true;{const F=K.gap_fill||[];window._carry=0;for(let i=0;i<F.length-1;i++)SIEPI_FOTINIA.push([F[i][0],F[i][1],F[i+1][0],F[i+1][1],1,0,0,1,2,0]);}window._carry=0;{const C=K.corner_hedge||[];for(let i=0;i<C.length-1;i++)SIEPI_FOTINIA.push([C[i][0],C[i][1],C[i+1][0],C[i+1][1],1,0,0,1,2,0]);}{const C=K.gate_hedge||[];for(let i=0;i<C.length-1;i++)SIEPI_FOTINIA.push([C[i][0],C[i][1],C[i+1][0],C[i+1][1],1,0,0,1,2,0]);}for(let i=0;i<H.length-1;i++){const [a,b]=[H[i],H[i+1]];if(!lon(a)||!lon(b))continue;SIEPI_FOTINIA.push([a[0],a[1],b[0],b[1],1,0,0,1,2,0]);}
  for(const [a,b] of K.bottom_hedge||[]){const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.round(L/2));for(let k=0;k<n;k++){const p=[a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n],q=[a[0]+(b[0]-a[0])*(k+1)/n,a[1]+(b[1]-a[1])*(k+1)/n];if(!lon(p)&&!lon(q))continue;SIEPI_FOTINIA.push([p[0],p[1],q[0],q[1],1,0,0,1,2,0]);}}}   
 let road=null;scene.traverse(o=>{if(o.isMesh&&o.material&&o.material.userData&&o.material.userData.orig&&o.material.userData.orig.color.getHexString()==='5f5d59'&&o.geometry.attributes.position.count>300)road=o;});
 if(road){road.material=road.material.clone();road.material.polygonOffset=true;road.material.polygonOffsetFactor=-3;road.material.polygonOffsetUnits=-3;road.position.y+=.04;
  {// striscia continua: normale media in ogni punto, niente fessure fra i tratti in curva
   const L0=SACROFANO_MODEL.landscape.road,cv=new THREE.CatmullRomCurve3(L0.pts.map((p,i)=>new THREE.Vector3(p[0],(L0.y?L0.y[i]:0)+.04,p[1])),false,'centripetal'),N=240,P=cv.getPoints(N),hw=L0.w/2,pos=[],idx=[];
   for(let i=0;i<=N;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(N,i+1)],dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1,nx=-dz/l*hw,nz=dx/l*hw,q=P[i];const cl=(x,z)=>(x>6.6&&x<12.2&&z>17.7)?17.7:z,cx=x=>Math.min(x,16.9);pos.push(cx(q.x+nx),q.y,cl(q.x+nx,q.z+nz),cx(q.x-nx),q.y,cl(q.x-nx,q.z-nz));if(i<N){const k=i*2;idx.push(k,k+2,k+1,k+1,k+2,k+3);}}
   const ng=new THREE.BufferGeometry();ng.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));ng.setIndex(idx);ng.computeVertexNormals();road.geometry=ng;road.material.side=THREE.DoubleSide;}
  const g=road.geometry,p=g.attributes.position,uv=new Float32Array(p.count*2);for(let k=0;k<p.count;k++){uv[k*2]=p.getX(k)/4;uv[k*2+1]=p.getZ(k)/4;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  // prosegue oltre il cancello verso valle, come nel video d'ingresso (IMG_5073 0-1 s)
  const L=SACROFANO_MODEL.landscape.road,a=L.pts[1],b=L.pts[0],dx=b[0]-a[0],dz=b[1]-a[1],l=Math.hypot(dx,dz),ux=dx/l,uz=dz/l,w=L.w/2,y=L.y[0]+.08,len=9,pos=[];
  const c0=[b[0],b[1]],c1=[b[0]+ux*len,b[1]+uz*len],n=[-uz*w,ux*w];
  pos.push(c0[0]+n[0],y,c0[1]+n[1],c1[0]+n[0],y,c1[1]+n[1],c1[0]-n[0],y,c1[1]-n[1],c0[0]+n[0],y,c0[1]+n[1],c1[0]-n[0],y,c1[1]-n[1],c0[0]-n[0],y,c0[1]-n[1]);
  const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));const u2=[];for(let k=0;k<pos.length;k+=3)u2.push(pos[k]/4,pos[k+2]/4);ge.setAttribute('uv',new THREE.Float32BufferAttribute(u2,2));ge.computeVertexNormals();
  }}
// ---- dentro il muro della salita: continua il giardino (prato), non l'asfalto (Michele 12/10)
function pratoSalita(){const E=SACROFANO_MODEL.landscape.ramp_edge;if(!E)return;const C=SACROFANO_MODEL.landscape.gate_curve;let poly=[...E,[-18,21.5],[-17.5,29],[-8.5,37],[4.5,44],[5,47]];if(C){const k=E.findIndex(p=>Math.hypot(p[0]-C[0][0],p[1]-C[0][1])<.01);if(k>=0)poly=[...E.slice(k),[-18,21.5],[-17.5,29],[-8.5,37],[4.5,44],[5,47],...C.slice().reverse().slice(0,-1)];}
 const sh=new THREE.Shape();sh.moveTo(poly[0][0],-poly[0][1]);for(const p of poly.slice(1))sh.lineTo(p[0],-p[1]);sh.closePath();
 const g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);const pa=g.attributes.position,uv=new Float32Array(pa.count*2);for(let k=0;k<pa.count;k++){uv[k*2]=pa.getX(k)/2.5;uv[k*2+1]=pa.getZ(k)/2.5;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
 const m=new THREE.MeshStandardMaterial({map:pratoCurato(),roughness:1,metalness:0,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});m.color.setRGB(.82,.82,.78);
 const o=new THREE.Mesh(g,m);o.position.y=.025;o.receiveShadow=true;o.userData.pratoSalita=true;scene.add(o);}
// ---- muro che chiude il comprensorio (Tav2 planimetria generale, schizzo di Michele 12/10): tufo, alto 2 m dal suo piano
function muroConfine(){const M=SACROFANO_MODEL.landscape.muro_confine;if(!M)return;let tm=null;scene.traverse(o=>{if(!tm&&o.isMesh&&o.material&&o.material.userData&&o.material.userData.orig&&o.material.userData.orig.color.getHexString()==='c9b48c')tm=o.material;});
 const cp=tm?tm:new THREE.MeshStandardMaterial({color:0x9ba3ae});
 for(const [x0,z0,x1,z1,y0,h] of M){const L=Math.hypot(x1-x0,z1-z0),g=new THREE.BoxGeometry(L+.3,h,.3),o=new THREE.Mesh(g,cp);o.position.set((x0+x1)/2,y0+h/2,(z0+z1)/2);o.rotation.y=-Math.atan2(z1-z0,x1-x0);o.castShadow=o.receiveShadow=true;scene.add(o);uvFoto(o,1.5);
  const c=new THREE.Mesh(new THREE.BoxGeometry(L+.36,.08,.38),cp);c.position.set(o.position.x,y0+h+.04,o.position.z);c.rotation.y=o.rotation.y;scene.add(c);uvFoto(c,1.5);}}
// ---- muretto di tufo alto 1 m sul lato esterno della salita, dal cancello in su (video IMG_5073 0 s, Michele 12/10)
function murettoSalita(){const L=SACROFANO_MODEL.landscape.road,pl=SACROFANO_MODEL.landscape.plateau;let tm=null;scene.traverse(o=>{if(!tm&&o.isMesh&&o.material&&o.material.userData&&o.material.userData.orig&&o.material.userData.orig.color.getHexString()==='c9b48c')tm=o.material;});if(!tm)return;
 const cv=new THREE.CatmullRomCurve3(L.pts.map((p,i)=>new THREE.Vector3(p[0],(L.y?L.y[i]:0),p[1])),false,'centripetal'),N=240,P=cv.getPoints(N),hw=L.w/2+.15;
 const dentro=(x,z)=>{let c=false;for(let i=0,k=pl.length-1;i<pl.length;k=i++){const [x1,z1]=pl[i],[x2,z2]=pl[k];if((z1>z)!=(z2>z)&&x<(x2-x1)*(z-z1)/(z2-z1)+x1)c=!c;}return c;};
 const pts=[];for(let i=0;i<=N;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(N,i+1)],dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1;let nx=-dz/l,nz=dx/l;if(dentro(P[i].x+nx*4,P[i].z+nz*4)){nx=-nx;nz=-nz;}
  if(P[i].y>-.02&&i>N*.3)break;pts.push([P[i].x+nx*hw,P[i].y+.04,P[i].z+nz*hw]);}
 const idx=[];for(let i=0;i<pts.length-1;i+=4)idx.push(i);idx.push(pts.length-1);for(let k=0;k<idx.length-1;k++){const a=pts[idx[k]],b=pts[idx[k+1]],L2=Math.hypot(b[0]-a[0],b[2]-a[2]),y0=-2.5,h=Math.max(a[1],b[1])+1-y0;
  const g=new THREE.BoxGeometry(L2+.05,h,.3),o=new THREE.Mesh(g,tm);o.position.set((a[0]+b[0])/2,y0+h/2,(a[2]+b[2])/2);o.rotation.y=-Math.atan2(b[2]-a[2],b[0]-a[0]);o.castShadow=o.receiveShadow=true;scene.add(o);uvFoto(o,1.2);}}
// ---- area a parcheggio in basso a ovest (Tav2 planimetria generale, Michele 12/10): tutto asfalto, posti auto come quelli dell'1 (2,4 x 4,8 m)
function parcheggioOvest(){const K=SACROFANO_MODEL.landscape,R=K.road,GY=K.ground_y||-2.5;
 const cv=new THREE.CatmullRomCurve3(R.pts.map((p,i)=>new THREE.Vector3(p[0],(R.y?R.y[i]:0),p[1])),false,'centripetal'),N=240,P=cv.getPoints(N),pl=K.plateau;
 const dentro=(x,z)=>{let c=false;for(let i=0,k=pl.length-1;i<pl.length;k=i++){const [x1,z1]=pl[i],[x2,z2]=pl[k];if((z1>z)!=(z2>z)&&x<(x2-x1)*(z-z1)/(z2-z1)+x1)c=!c;}return c;};
 const ext=[];for(let i=0;i<=N;i++){const a=P[Math.max(0,i-1)],b=P[Math.min(N,i+1)],dx=b.x-a.x,dz=b.z-a.z,l=Math.hypot(dx,dz)||1;let nx=-dz/l,nz=dx/l;if(dentro(P[i].x+nx*4,P[i].z+nz*4)){nx=-nx;nz=-nz;}
  if(P[i].y>-.02&&i>N*.3)break;ext.push([P[i].x+nx*(R.w/2+.3),P[i].z+nz*(R.w/2+.3)]);}
 const curva=K.muro_confine.filter(m=>m[4]===-2.5&&m[1]>44.5).map(m=>[m[2],m[3]]);
 // Michele 14/10: il piazzale si stringe a nord (fondo nw, linea inclinata come il DWG) per lasciare posto alla zona alta
 const PN=K.parcheggio_ovest_nord||{nw:[-33.9,18.66],dir:[1,0]},NW=PN.nw,ND=PN.dir,zN=x=>NW[1]+(x-NW[0])*ND[1]/ND[0];
 let ext2=[],cut=null;for(let i=0;i<ext.length;i++){const e=ext[i];if(e[1]>zN(e[0]))ext2.push(e);else{if(i>0){const a=ext[i-1],fa=a[1]-zN(a[0]),fb=e[1]-zN(e[0]),t=fa/(fa-fb);cut=[a[0]+(e[0]-a[0])*t,a[1]+(e[1]-a[1])*t];}break;}}
 if(cut)ext2.push(cut);const EN=ext2[ext2.length-1];
 const poly=[NW,[-41,41],[-38.5,44],[-26,45.2],...curva,...ext2];
 const sh=new THREE.Shape();sh.moveTo(poly[0][0],-poly[0][1]);for(const p of poly.slice(1))sh.lineTo(p[0],-p[1]);sh.closePath();
 const g=new THREE.ShapeGeometry(sh);g.rotateX(-Math.PI/2);const pa=g.attributes.position,uv=new Float32Array(pa.count*2);for(let k=0;k<pa.count;k++){uv[k*2]=pa.getX(k)/4;uv[k*2+1]=pa.getZ(k)/4;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
 const ma=new THREE.MeshStandardMaterial({map:asfaltoTex(),roughness:.9,metalness:0,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const o=new THREE.Mesh(g,ma);o.position.y=GY+.03;o.receiveShadow=true;scene.add(o);
 // posti auto: righe di vernice a terra, a pettine lungo il muro ovest e lungo il muro in basso
 const mv=new THREE.MeshStandardMaterial({map:vernice(),transparent:true,roughness:.7,polygonOffset:true,polygonOffsetFactor:-4,polygonOffsetUnits:-4,depthWrite:false});
 const riga=(x0,z0,x1,z1)=>{const L=Math.hypot(x1-x0,z1-z0),gg=new THREE.PlaneGeometry(L+.1,.12);gg.rotateX(-Math.PI/2);const r=new THREE.Mesh(gg,mv);r.position.set((x0+x1)/2,GY+.045,(z0+z1)/2);r.rotation.y=-Math.atan2(z1-z0,x1-x0);scene.add(r);};
 const fila=(a,b,da,db)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]),ux=(b[0]-a[0])/L,uz=(b[1]-a[1])/L;let nx=-uz,nz=ux;if(!dentroP(a[0]+ux*L/2+nx*3,a[1]+uz*L/2+nz*3)){nx=-nx;nz=-nz;}
  const W=2.4,D=4.8,n=Math.floor((L-da-db)/W);for(let k=0;k<=n;k++){const s=da+k*W,px=a[0]+ux*s+nx*.35,pz=a[1]+uz*s+nz*.35;riga(px,pz,px+nx*D,pz+nz*D);}
  const s0=a[0]+ux*da+nx*(.35+D),z0=a[1]+uz*da+nz*(.35+D),s1=a[0]+ux*(da+n*W)+nx*(.35+D),z1=a[1]+uz*(da+n*W)+nz*(.35+D);riga(s0,z0,s1,z1);};
 const dentroP=(x,z)=>{let c=false;for(let i=0,k=poly.length-1;i<poly.length;k=i++){const [x1,z1]=poly[i],[x2,z2]=poly[k];if((z1>z)!=(z2>z)&&x<(x2-x1)*(z-z1)/(z2-z1)+x1)c=!c;}return c;};
 // ZONA ALTA (Michele 14/10, PDF "Posti auto def."): prolungamento della strada in salita, piano asfaltato a quota 0 sopra il muro nord del piazzale,
 // dal confine ovest (stessa linea del muro ovest) fino alla strada; fianchi in tufo fino al terreno; posti 4 e 3 da 2,50 x 5,00, triangolo tratteggiato, 2 e 1 inclinati
 {let iC=ext.findIndex(e=>!(e[1]>zN(e[0])));if(iC<0)iC=ext.length;const up=ext.slice(iC),A0=[-41,41],L1=Math.hypot(NW[0]-A0[0],NW[1]-A0[1]),v=[(NW[0]-A0[0])/L1,(NW[1]-A0[1])/L1];
  const top=[NW[0]+v[0]*13.83,NW[1]+v[1]*13.83],upIn=up.map(q=>{let bp=P[0],bd=1e9;for(const c of P){const d=Math.hypot(c.x-q[0],c.z-q[1]);if(d<bd){bd=d;bp=c;}}const k=Math.min(.45,bd)/bd;return [q[0]+(bp.x-q[0])*k,q[1]+(bp.z-q[1])*k];}),U=[[-28.45,10.45],top,NW,EN,...upIn];
  let tm=null;scene.traverse(o=>{if(!tm&&o.isMesh&&o.material&&o.material.userData&&o.material.userData.orig&&o.material.userData.orig.color.getHexString()==='c9b48c')tm=o.material;});
  const sh=new THREE.Shape();sh.moveTo(U[0][0],-U[0][1]);for(const q of U.slice(1))sh.lineTo(q[0],-q[1]);sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:2.5+.012,bevelEnabled:false});g.rotateX(-Math.PI/2);const pa=g.attributes.position,uv=new Float32Array(pa.count*2);for(let k=0;k<pa.count;k++){uv[k*2]=(pa.getX(k)+pa.getZ(k)*.0)/4;uv[k*2+1]=(pa.getZ(k)+pa.getY(k))/4;}g.setAttribute('uv',new THREE.BufferAttribute(uv,2));
  const top_m=new THREE.MeshStandardMaterial({map:asfaltoTex(),roughness:.9,metalness:0});const side_m=tm||new THREE.MeshStandardMaterial({color:0xc9b48c});
  // raccordo con la strada (Michele 14/10): lungo il bordo verso la strada il piano scende alla quota della strada, cosi non c'e' scalino
  {const pp=g.attributes.position,D=2.5+.012;for(let k=0;k<pp.count;k++){if(Math.abs(pp.getY(k)-D)>.001)continue;const x=pp.getX(k),z=pp.getZ(k);let bd=1e9,by=0;for(const q of [...upIn,EN]){const d=Math.hypot(q[0]-x,q[1]-z);if(d<bd)bd=d;}if(bd>.05)continue;let cd=1e9;for(const c of P){const d=Math.hypot(c.x-x,c.z-z);if(d<cd){cd=d;by=c.y;}}pp.setY(k,D+Math.min(0,by+.07));}pp.needsUpdate=true;g.computeVertexNormals();}
  const za=new THREE.Mesh(g,[top_m,side_m]);za.position.y=GY;za.castShadow=za.receiveShadow=true;scene.add(za);za.updateMatrixWorld(true);if(tm){uvFoto(za,1.5);const pu=g.attributes.position,nu=g.attributes.normal,uu=g.attributes.uv;for(let k=0;k<pu.count;k++)if(nu.getY(k)>.5)uu.setXY(k,pu.getX(k)/4,pu.getZ(k)/4);uu.needsUpdate=true;}
  // muri di confine uniformi (Michele 14/10): tutti in tufo con la stessa copertina, la cima scende in pendenza dove cambia la quota, niente salti a piombo.
  // ovest: 1 m sopra la zona alta, poi in discesa fino all'angolo in fondo al piazzale (-0,50 come il muro sud); divisione: da 1 m sopra la zona alta
  // fino alla quota del muretto della salita che prosegue; lato nord: in discesa fino al cordolo della strada (0,50)
  {const wallS=(a,b,ta,tb,y0)=>{const dx=b[0]-a[0],dz=b[1]-a[1],Lw=Math.hypot(dx,dz),e=.15,k=(tb-ta)/Lw,t0=ta-k*e,t1=tb+k*e;
     const s1=new THREE.Shape();s1.moveTo(-e,y0);s1.lineTo(Lw+e,y0);s1.lineTo(Lw+e,t1);s1.lineTo(-e,t0);s1.closePath();const g1=new THREE.ExtrudeGeometry(s1,{depth:.3,bevelEnabled:false});g1.translate(0,0,-.15);
     const s2=new THREE.Shape();s2.moveTo(-e-.03,t0-k*.03);s2.lineTo(Lw+e+.03,t1+k*.03);s2.lineTo(Lw+e+.03,t1+k*.03+.08);s2.lineTo(-e-.03,t0-k*.03+.08);s2.closePath();const g2=new THREE.ExtrudeGeometry(s2,{depth:.38,bevelEnabled:false});g2.translate(0,0,-.19);
     for(const gg of [g1,g2]){const m=new THREE.Mesh(gg,side_m);m.position.set(a[0],0,a[1]);m.rotation.y=-Math.atan2(dz,dx);m.castShadow=m.receiveShadow=true;scene.add(m);m.updateMatrixWorld(true);if(tm)uvFoto(m,1.5);}};
   let cd=1e9,yEN=-.5;for(const c of P){const d=Math.hypot(c.x-EN[0],c.z-EN[1]);if(d<cd){cd=d;yEN=c.y;}}
   // il vecchio muro ovest del piazzale (dritto, cima -0,50) si sostituisce con quello in pendenza
   scene.traverse(o=>{if(!o.isMesh||!o.visible||o===za)return;const bb=new THREE.Box3().setFromObject(o);if(bb.isEmpty()||bb.max.y>0)return;const c=bb.getCenter(new THREE.Vector3());if(Math.hypot(c.x-(NW[0]+A0[0])/2,c.z-(NW[1]+A0[1])/2)<.4)o.visible=false;});
   wallS(NW,A0,1.0,-.5,-2.5);wallS(NW,EN,1.0,yEN+1.04,-2.5);wallS(NW,top,1.0,1.0,-.2);wallS(top,[-28.45,10.45],1.0,.5,-.2);
  // angolo dove la curva si apre verso la zona alta (Michele 14/10): il muro di divisione si unisce al muretto della salita che prosegue, stessa cima e copertina
  {let best=null,bd=1e9;scene.updateMatrixWorld(true);scene.traverse(o=>{if(!o.isMesh||!o.visible||o===za||o.material!==side_m&&!(o.material&&o.material.color&&o.material.color.getHexString()==='87909e'))return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty()||b.min.y>-2.3||b.max.y<.2||b.max.y>1.6)return;const c=b.getCenter(new THREE.Vector3()),d=Math.hypot(c.x-EN[0],c.z-EN[1]);if(d<bd&&d<4&&c.z>EN[1]){bd=d;best=o;}});
   if(best){best.geometry.computeBoundingBox();const lb=best.geometry.boundingBox,hl=(lb.max.x-lb.min.x)/2,ry=best.rotation.y,dir=[Math.cos(-ry),Math.sin(-ry)],c=best.position,e1=[c.x+dir[0]*hl,c.z+dir[1]*hl],e2=[c.x-dir[0]*hl,c.z-dir[1]*hl],end=Math.hypot(e1[0]-EN[0],e1[1]-EN[1])<Math.hypot(e2[0]-EN[0],e2[1]-EN[1])?e1:e2,bb=new THREE.Box3().setFromObject(best);
    wallS(EN,end,yEN+1.04,bb.max.y,-2.5);console.log('angolo EN unito',bd.toFixed(2),end.map(v=>v.toFixed(2)));}else console.log('angolo EN: muretto non trovato');}
  }
  const n=[-v[1],v[0]],nn=(n[0]>0?n:[-n[0],-n[1]]),Q=(s,d)=>[NW[0]+v[0]*s+nn[0]*d,NW[1]+v[1]*s+nn[1]*d],yz=.02,
   rcz=new THREE.Raycaster(),hz=(x,z)=>{za.updateMatrixWorld(true);rcz.set(new THREE.Vector3(x,5,z),new THREE.Vector3(0,-1,0));const h=rcz.intersectObject(za,false)[0];return (h?h.point.y:0)+.012;},r2=(a,b)=>{const L=Math.hypot(b[0]-a[0],b[1]-a[1]),n2=Math.max(1,Math.ceil(L/.5));for(let k=0;k<n2;k++){const t0=k/n2,t1=(k+1)/n2,p0=[a[0]+(b[0]-a[0])*t0,a[1]+(b[1]-a[1])*t0],p1=[a[0]+(b[0]-a[0])*t1,a[1]+(b[1]-a[1])*t1],y0=hz(p0[0],p0[1]),y1=hz(p1[0],p1[1]),l=Math.hypot(p1[0]-p0[0],p1[1]-p0[1]),gg=new THREE.PlaneGeometry(l+.02,.12);gg.rotateX(-Math.PI/2);const m=new THREE.Mesh(gg,mv);m.position.set((p0[0]+p1[0])/2,(y0+y1)/2,(p0[1]+p1[1])/2);m.rotation.y=-Math.atan2(p1[1]-p0[1],p1[0]-p0[0]);m.rotation.z=0;scene.add(m);}};
  for(const sv of [.25,2.5,5])r2(Q(sv,.2),Q(sv,5));r2(Q(.25,5),Q(5,5));
  for(const s0 of [7.2,9.8,12.4])r2(Q(s0,.2),Q(s0-2.2,3.9));r2(Q(5,3.9),Q(10.2,3.9));
  // triangolo tratteggiato fra il 3 e il 2: dove non si parcheggia
  {const T=[Q(5,.2),Q(7.08,.2),Q(5,3.9)];r2(T[0],T[1]);for(let k=1;k<=5;k++){const t=k/6,a=[T[0][0]+(T[1][0]-T[0][0])*t,T[0][1]+(T[1][1]-T[0][1])*t],b=[T[0][0]+(T[2][0]-T[0][0])*t,T[0][1]+(T[2][1]-T[0][1])*t];r2(a,b);}}
  // il muretto della salita lungo la zona alta si toglie: dalla strada si entra nei posti
  {let nh=0;const near=(x,z)=>up.some(q=>Math.hypot(q[0]-x,q[1]-z)<1.2);scene.traverse(o=>{if(!o.isMesh||o===za||!o.visible||o.isInstancedMesh)return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty()||b.max.y<.3||b.max.y>1.6||b.min.y>-2.3)return;const sz=b.getSize(new THREE.Vector3());if(sz.x>4||sz.z>4)return;const c=b.getCenter(new THREE.Vector3());if(near(c.x,c.z)&&c.z<EN[1]+.5){o.visible=false;nh++;}});console.log('muretto salita tolto',nh);}
  // e anche il muretto basso del vecchio bordo della strada (da x -28,45 z 10,45 a x -25 z 19,2), che ora taglierebbe la zona alta dalla strada
  {let nc=0;scene.traverse(o=>{if(!o.isMesh||o===za||!o.visible||o.isInstancedMesh)return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;if(b.min.y>-.1&&b.max.y<.85&&b.min.x>-28.75&&b.max.x<-24.7&&b.min.z>10.1&&b.max.z<19.6){o.visible=false;nc++;}});console.log('bordo strada tolto',nc);}
  // blocco di tufo rimasto davanti al primo posto del parcheggio nel prato (x -13,6/-9,4, z 18,2/18,8): si toglie
  {let nb=0;scene.traverse(o=>{if(!o.isMesh||!o.visible||o.isInstancedMesh)return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;if(b.min.x>-13.7&&b.max.x<-9.3&&b.min.z>18.1&&b.max.z<18.9&&b.min.y>-.1&&b.max.y<1.0){o.visible=false;nb++;}});console.log('blocco tufo tolto',nb);}
  console.log('zona alta',U.length,EN);}
 // i 5 posti del disegno di Michele (14/10), lungo il muro ovest partendo dal fondo: 5 (fino al muro sud, angolo tagliato), 4, 3, 2 da 2,50 x 5,00, poi 1 piu grande fino al muro nord
 {const A=[-41,41],L0=Math.hypot(NW[0]-A[0],NW[1]-A[1]),v=[(NW[0]-A[0])/L0,(NW[1]-A[1])/L0],n=[-v[1],v[0]],nn=dentroP(A[0]+v[0]*5+n[0]*3,A[1]+v[1]*5+n[1]*3)?n:[-n[0],-n[1]],P=(s,d)=>[A[0]+v[0]*s+nn[0]*d,A[1]+v[1]*s+nn[1]*d],r=(a,b)=>riga(a[0],a[1],b[0],b[1]);
  for(const sv of [2.5,5,7.5])r(P(sv,.1),P(sv,5));r(P(10,.1),P(10,8.5));
  let s0=0;for(let s=0;s>-4;s-=.05){const q=P(s,5);if(!dentroP(q[0],q[1])){s0=s+.25;break;}}r(P(s0,5),P(10,5));
  const a=P(10,8.5),b=P(L0,6.3),e=[b[0]-a[0],b[1]-a[1]];let best=b,bd=1e9;for(let t=0;t<=1.6;t+=.01){const q=[a[0]+e[0]*t,a[1]+e[1]*t],d=Math.abs(q[1]-zN(q[0]));if(d<bd){bd=d;best=q;}}r(a,[best[0]-(best[0]-a[0])*.02,best[1]-(best[1]-a[1])*.02]);}}
// ---- giardino davanti in prato armato vero (Michele 12/10): blocchi di cemento a griglia con prato verde e ciuffi nei fori, anche dentro il muro della salita
function pratoArmato(){const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');let sd=17;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 // una cella = 60 cm: 2 x 2 fori quadrati di prato separati da nervature di cemento
 x.fillStyle='#8f8b82';x.fillRect(0,0,256,256);for(let i=0;i<3000;i++){const v=110+R()*55|0;x.fillStyle=`rgba(${v},${v-4|0},${v-12|0},.55)`;x.fillRect(R()*256,R()*256,1+R()*2,1+R()*2);}
 for(let i=0;i<40;i++){const gx=R()*256,gy=R()*256,rr=8+R()*25,gr=x.createRadialGradient(gx,gy,0,gx,gy,rr);gr.addColorStop(0,'rgba(60,55,40,.25)');gr.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=gr;x.fillRect(gx-rr,gy-rr,2*rr,2*rr);}
 const g=pratoCurato().image;for(const [hx,hy] of [[5,5],[133,5],[5,133],[133,133]]){x.save();x.beginPath();const w=118,r=16;x.moveTo(hx+r,hy);x.arcTo(hx+w,hy,hx+w,hy+w,r);x.arcTo(hx+w,hy+w,hx,hy+w,r);x.arcTo(hx,hy+w,hx,hy,r);x.arcTo(hx,hy,hx+w,hy,r);x.closePath();x.clip();
  x.drawImage(g,R()*700,R()*700,220,220,hx-4,hy-4,w+8,w+8);const sh=x.createLinearGradient(hx,hy,hx+12,hy+12);sh.addColorStop(0,'rgba(15,25,8,.35)');sh.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=sh;x.fillRect(hx,hy,w,w);x.restore();}
 // fili d'erba che scavalcano le nervature
 for(let i=0;i<900;i++){const px=R()*256,py=R()*256,l=3+R()*6,a=R()*6.28;x.strokeStyle=`rgba(${50+R()*40|0},${95+R()*50|0},${30+R()*20|0},.85)`;x.lineWidth=1;x.beginPath();x.moveTo(px,py);x.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);x.stroke();}
 const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.encoding=THREE.sRGBEncoding;tx.anisotropy=8;
 const m=new THREE.MeshStandardMaterial({map:tx,roughness:.95,metalness:0,color:0xe8eadf,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
 const K=SACROFANO_MODEL.landscape,polys=[K.court];if(K.corner_prato){const ex=K.corner_prato;const s3=new THREE.Shape();s3.moveTo(ex[0][0],-ex[0][1]);for(const p of ex.slice(1))s3.lineTo(p[0],-p[1]);s3.closePath();const g3=new THREE.ShapeGeometry(s3);g3.rotateX(-Math.PI/2);const o3=new THREE.Mesh(g3,new THREE.MeshBasicMaterial());o3.position.y=.03;o3.userData.pratoSalita=true;scene.add(o3);polys.push(ex);}
 {const ex=[[4.5,44],[5,47],[11.25,32.1],[9.4,30.9],[8.269,35.539]];const s2=new THREE.Shape();s2.moveTo(ex[0][0],-ex[0][1]);for(const p of ex.slice(1))s2.lineTo(p[0],-p[1]);s2.closePath();const g2=new THREE.ShapeGeometry(s2);g2.rotateX(-Math.PI/2);const o2=new THREE.Mesh(g2,new THREE.MeshBasicMaterial());o2.position.y=.03;o2.receiveShadow=true;o2.userData.pratoSalita=true;scene.add(o2);polys.push(ex);}if(K.ramp_edge)polys.push([...K.ramp_edge,[-18,21.5],[-17.5,29],[-8.5,37],[4.5,44],[5,47]]);
 const sets=(o)=>{const gg=o.geometry,p=gg.attributes.position,uv=new Float32Array(p.count*2);o.updateMatrixWorld();const v=new THREE.Vector3();for(let k=0;k<p.count;k++){v.fromBufferAttribute(p,k).applyMatrix4(o.matrixWorld);uv[k*2]=v.x/.6;uv[k*2+1]=v.z/.6;}gg.setAttribute('uv',new THREE.BufferAttribute(uv,2));o.material=m;};
 scene.traverse(o=>{if(!o.isMesh)return;const mm=o.material;if(mm&&mm.userData&&mm.userData.orig&&mm.userData.orig.color.getHexString()==='a7b18a')sets(o);if(o.userData.pratoSalita)sets(o);});
 // ciuffi nei fori: 4 fori per cella da 60 cm
 const inside=(px,pz,pl)=>{let cc=false;for(let i=0,k=pl.length-1;i<pl.length;k=i++){const [x1,z1]=pl[i],[x2,z2]=pl[k];if((z1>pz)!=(z2>pz)&&px<(x2-x1)*(pz-z1)/(z2-z1)+x1)cc=!cc;}return cc;};
 const pts=[];for(const pl of polys){const xs=pl.map(q=>q[0]),zs=pl.map(q=>q[1]);for(let gx=Math.floor(Math.min(...xs)/.3)*.3;gx<Math.max(...xs);gx+=.3)for(let gz=Math.floor(Math.min(...zs)/.3)*.3;gz<Math.max(...zs);gz+=.3){const cx=gx+.15,cz=gz+.15;if(!inside(cx,cz,pl))continue;const n=4+(R()*5|0);for(let k=0;k<n;k++)pts.push([cx+(R()-.5)*.28,cz+(R()-.5)*.28]);}}
 const pos=[];for(let k=0;k<6;k++){const an=k/6*Math.PI*2+R(),r=.01,h=.025+R()*.06,lx=Math.cos(an)*r,lz=Math.sin(an)*r,tx2=-Math.sin(an)*.004,tz=Math.cos(an)*.004;pos.push(lx-tx2,0,lz-tz,lx+tx2,0,lz+tz,lx*1.8+Math.cos(an)*.014,h,lz*1.8+Math.sin(an)*.014);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();
 const im=new THREE.InstancedMesh(geo,new THREE.MeshStandardMaterial({color:0x2f5419,roughness:.9,side:THREE.DoubleSide}),pts.length),M=new THREE.Matrix4(),q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3(),col=new THREE.Color();
 pts.forEach(([a,b],i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),R()*6.28);const s=.8+R()*.8;S.set(s,s,s);P.set(a,.03,b);M.compose(P,q,S);im.setMatrixAt(i,M);const l=.7+R()*.45;col.setRGB(.8*l,.9*l,.7*l);im.setColorAt(i,col);});
 im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;scene.add(im);console.log('prato armato ciuffi',pts.length);}
// ---- fuori dalle mura non resta niente (Michele 12/10): via il grande terreno e gli alberi esterni, un prato tondo centrato sotto il complesso
// vetrata d'ingresso dell'8 arretrata di 25 cm nel vano: il muro sotto la finestrella e la colonna a sinistra restano piu' avanti, come nel video (IMG_4597 8 s e 28 s) (Michele 13/10).
// I piani si spostano in alto e in basso con le viste: le quote si misurano rispetto al gruppo del piano, non al mondo.
// ---- porta-finestra a due ante in PVC bianco (quella dell'8, IMG_4597 28-30 s), usata anche per il 5 (Michele 13/10)
function portaPVC(t0,x0,x1,y0,y1,zf){const W=x1-x0,H=y1-y0,xm=(x0+x1)/2,due=W>1;// sotto 1 m: un'anta sola (porta del 10)
   const pvc=new THREE.MeshStandardMaterial({color:0xf3f2ee,roughness:.38,metalness:0}),G=new THREE.Group();t0.add(G);
   const B=(w,h,d,x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),pvc);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;G.add(m);};
   const tf=.07,ts=.085,dz=.07;
   // telaio fisso
   B(tf,H,dz,x0+tf/2,y0+H/2,zf+dz/2);B(tf,H,dz,x1-tf/2,y0+H/2,zf+dz/2);B(W,tf,dz,xm,y1-tf/2,zf+dz/2);B(W,.05,dz,xm,y0+.025,zf+dz/2);
   // ante: profili perimetrali, zoccolo basso piu' alto, montanti centrali accostati
   for(const [a,b] of (due?[[x0+tf,xm],[xm,x1-tf]]:[[x0+tf,x1-tf]])){const c=(a+b)/2,w=b-a,z=zf+dz+.025;
    B(ts,H-tf-.05,.05,a+ts/2,y0+.05+(H-tf-.05)/2,z);B(ts,H-tf-.05,.05,b-ts/2,y0+.05+(H-tf-.05)/2,z);
    B(w,ts,.05,c,y1-tf-ts/2,z);B(w,.13,.05,c,y0+.05+.065,z);}
   // fermavetro: profilo sottile interno attorno a ogni vetro, un filo piu' arretrato
   for(const [a,b] of (due?[[x0+tf+ts,xm-ts],[xm+ts,x1-tf-ts]]:[[x0+tf+ts,x1-tf-ts]])){const c=(a+b)/2,w=b-a,ya=y0+.05+.13,yb=y1-tf-ts,z=zf+dz+.005;
    B(.022,yb-ya,.02,a+.011,(ya+yb)/2,z);B(.022,yb-ya,.02,b-.011,(ya+yb)/2,z);B(w,.022,.02,c,yb-.011,z);B(w,.022,.02,c,ya+.011,z);}
   // soglia in alluminio a filo pavimento
   const al=new THREE.MeshStandardMaterial({color:0xc4c8cc,roughness:.3,metalness:.85});
   {const m=new THREE.Mesh(new THREE.BoxGeometry(W,.02,.09),al);m.position.set(xm,y0+.01,zf+dz+.04);G.add(m);}
   // cerniere sull'anta sinistra (quella che si apre, come nel video) e maniglia a leva sul suo montante centrale
   const hl=new THREE.MeshStandardMaterial({color:0xe9e9e6,roughness:.25,metalness:.55});
   for(const hy of [y0+.28,y0+H*.5,y0+H-.32]){const m=new THREE.Mesh(new THREE.BoxGeometry(.03,.11,.03),hl);m.position.set(x0+tf+.01,hy,zf+dz+.04);m.castShadow=true;G.add(m);}
   {const hx=due?xm-ts/2:x1-tf-ts/2,hy=y0+1.05,hz=zf+dz+.05;
    const p=new THREE.Mesh(new THREE.BoxGeometry(.035,.17,.012),hl);p.position.set(hx,hy-.02,hz+.006);G.add(p);
    const s1=new THREE.Mesh(new THREE.CylinderGeometry(.009,.009,.05,16),hl);s1.rotation.x=Math.PI/2;s1.position.set(hx,hy+.03,hz+.03);G.add(s1);
    const l=new THREE.Mesh(new THREE.CylinderGeometry(.008,.009,.12,16),hl);l.rotation.z=Math.PI/2;l.position.set(hx-.055,hy+.03,hz+.055);l.castShadow=true;G.add(l);
    const k=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.012,12),hl);k.rotation.x=Math.PI/2;k.position.set(hx,hy-.07,hz+.015);G.add(k);}
   G.traverse(o=>{if(o.isMesh)o.updateMatrixWorld(true);});}
// ---- porta del 5 a vetri come quella dell'8, sulle misure del suo vano (S-17, 1,30 x 2,30) (Michele 13/10)
function porta5(){scene.updateMatrixWorld(true);const top=o=>{let t=o;while(t.parent&&t.parent!==scene)t=t.parent;return t;};
 const rel=o=>{const t=top(o);if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const m=new THREE.Matrix4().copy(t.matrixWorld).invert().multiply(o.matrixWorld);return o.geometry.boundingBox.clone().applyMatrix4(m);};
 const sp=[];scene.traverse(o=>{if(!o.isMesh||!o.visible||!o.parent||!o.parent.isGroup||top(o)===o)return;if(top(o).position.y>.5)return;// solo il piano terra
  const b=rel(o);if(b.isEmpty())return;if(b.min.x>2.1&&b.max.x<3.56&&b.min.z>4.85&&b.max.z<5.25&&b.max.y<2.45&&b.min.y>-.1)sp.push(o);});
 const gi=sp.findIndex(o=>{const b=rel(o);return b.max.x-b.min.x>1.2&&b.max.y-b.min.y>2.1;});if(gi<0){console.log('porta5: vetro non trovato');return;}
 const g=rel(sp[gi]),t0=top(sp[gi]);sp.forEach((o,k)=>{if(k!==gi)o.visible=false;});portaPVC(t0,g.min.x,g.max.x,g.min.y,g.max.y,g.max.z);console.log('porta5',sp.length);}
function vetrata8(){
 // tutte le misure nel sistema del piano (gruppo figlio della scena): non dipendono da dove sta il piano in quel momento
 const top=o=>{let t=o;while(t.parent&&t.parent!==scene)t=t.parent;return t;};
 const rel=o=>{const t=top(o);t.updateMatrixWorld(true);if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const m=new THREE.Matrix4().copy(t.matrixWorld).invert().multiply(o.matrixWorld);return o.geometry.boundingBox.clone().applyMatrix4(m);};
 const sposta=(o,v)=>{const t=top(o);t.updateMatrixWorld(true);const w0=new THREE.Vector3().setFromMatrixPosition(o.matrixWorld),w1=t.localToWorld(t.worldToLocal(w0.clone()).add(v)),a=o.parent.worldToLocal(w0.clone()),c=o.parent.worldToLocal(w1);o.position.add(c.sub(a));o.updateMatrixWorld(true);};
 const sp=[];scene.traverse(o=>{if(!o.isMesh||!o.parent||!o.parent.isGroup||top(o)===o)return;if(Math.abs(top(o).position.y-2.9)>.5)return;// solo il primo piano
  const b=rel(o);if(b.isEmpty())return;
  if(b.min.x>6.78&&b.max.x<8.77&&b.min.z>9.4&&b.max.z<9.7&&(b.max.y-b.min.y>.2&&b.max.y-b.min.y<2.6||b.max.y-b.min.y<.1&&b.max.x-b.min.x>1.5)&&b.max.y-b.min.y<2.6)sp.push(o);});
 const t0=sp.length?top(sp[0]):null;
 for(const o of sp)sposta(o,new THREE.Vector3(0,0,-.25));
 // spallette del vano fra la vetrata arretrata e il filo del muro: bianche ai lati e sopra, gres del pavimento sotto
 let mw=null,mp=null;scene.traverse(o=>{if(!o.isMesh||!o.material||!o.material.isMeshStandardMaterial||!o.material.userData||!o.material.userData.orig||!o.material.userData.orig.isMaterial)return;const h=o.material.userData.orig.color.getHexString();if(!mw&&h==='d8d4c7')mw=o.material;if(!mp&&h==='d2d0c7')mp=o.material;});
 if(t0&&mw){const bs=sp.map(rel),yb=Math.min(...bs.map(b=>b.min.y)),xL=Math.min(...bs.map(b=>b.min.x)),xR=Math.max(...bs.map(b=>b.max.x)),xm0=(xL+xR)/2;
  sp.forEach((o,k)=>{const b=bs[k],sx=b.max.x-b.min.x,sy=b.max.y-b.min.y;if(!(sx<.1&&sy>2&&(b.min.x<6.9||b.max.x>8.6)||sy<.1&&sx>1.5))return;const bot=sy<.1&&b.min.y<yb+.1,z0=b.max.z,z1=bot?9.62:9.55,hy=bot?.033-b.min.y:sy;
   // lati: dalla battuta del telaio fino allo spigolo del vano, cosi' non restano dentini agli angoli
   let xa=b.min.x,xb=b.max.x;if(sx<.1){if(b.min.x<xm0)xa=xL;else xb=xR;}
   if(bot){const q=new THREE.Mesh(new THREE.BoxGeometry(xL-5.97,hy,.08),mp||mw);q.position.set((5.97+xL)/2,b.min.y+hy/2,9.58);q.receiveShadow=true;t0.add(q);q.updateMatrixWorld(true);uvFoto(q,1.5);const q2=new THREE.Mesh(new THREE.BoxGeometry(.5,hy,.08),mp||mw);q2.position.set(xR+.25,b.min.y+hy/2,9.58);t0.add(q2);q2.updateMatrixWorld(true);uvFoto(q2,1.5);}
   const r=new THREE.Mesh(new THREE.BoxGeometry(xb-xa,hy,z1-z0),bot&&mp?mp:mw);r.position.set((xa+xb)/2,b.min.y+hy/2,(z0+z1)/2);r.receiveShadow=true;t0.add(r);r.updateMatrixWorld(true);uvFoto(r,1.5);});}
 // elemento interno vicino alla vetrata che sporgeva di 3 cm oltre il muro: si taglia dietro la porta
 scene.traverse(o=>{if(!o.isMesh||o.geometry.type!=='BoxGeometry'||top(o)===o)return;const b=rel(o);if(!(b.min.x>6.83&&b.max.x<7.3&&b.min.z>8.7&&b.min.z<8.76&&b.max.z>9.55&&b.max.z<9.6))return;
  renderer.localClippingEnabled=true;const om=o.material;o.material=om.clone();o.material.userData={orig:om.userData&&om.userData.orig};const tt=top(o);o.onBeforeRender=function(){const z=tt.localToWorld(new THREE.Vector3(0,0,9.3)).z;this.material.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,0,-1),z)];};});
 // colonne della tettoia: partono da sopra la copertina grigia del muretto; quella a destra spostata sul muretto, non davanti (Michele 13/10)
 scene.traverse(o=>{if(!o.isMesh||o.geometry.type!=='BoxGeometry'||top(o)===o)return;const b=rel(o);const sx=b.min.x>5.74&&b.max.x<5.98,dx=b.min.x>11.75&&b.max.x<11.99;if(!((sx||dx)&&b.min.z>10.65&&b.max.z<10.95&&b.max.y-b.min.y>2.3&&b.max.y-b.min.y<2.7))return;
  const h=b.max.y-b.min.y,cut=.895,k=(h-cut)/h;o.scale.y*=k;sposta(o,new THREE.Vector3(dx?.11:0,cut/2,0));});
 // porta-finestra dell'8 come nel video (IMG_4597 28-30 s): due ante a battente in PVC bianco, profili spessi con fermavetro, cerniere e maniglia sull'anta sinistra, soglia in alluminio (Michele 13/10)
 if(t0){const gi=sp.findIndex(o=>{const b=rel(o);return b.max.x-b.min.x>1.5&&b.max.y-b.min.y>2;});
  if(gi>=0){const g=rel(sp[gi]),x0=g.min.x,x1=g.max.x,y0=g.min.y,y1=g.max.y,zf=g.max.z,W=x1-x0,H=y1-y0,xm=(x0+x1)/2;
   sp.forEach((o,k)=>{if(k!==gi)o.visible=false;});
   portaPVC(t0,x0,x1,y0,y1,zf);}}
 // testata del muretto verso la scala: si riempie fino sotto la fine della copertina grigia (z 10,5) e fino al pavimento, niente tagli (Michele 13/10)
 if(t0&&mw){const f=new THREE.Mesh(new THREE.BoxGeometry(.277,.96,.35),mw);f.position.set(5.8315,-.11+.48,10.675);f.castShadow=f.receiveShadow=true;t0.add(f);f.updateMatrixWorld(true);uvFoto(f,1.5);}
 console.log('vetrata8',sp.length);}
function fuoriMura(){// il prato tondo di sotto va centrato sul complesso (Michele 12/10)
 scene.traverse(o=>{if(!o.isMesh||!o.geometry)return;const b=new THREE.Box3().setFromObject(o);if(b.max.x-b.min.x>100&&b.max.y<-2.4){const k=.85;o.scale.x*=k;o.scale.y*=k;o.scale.z*=k;o.updateMatrixWorld();const b2=new THREE.Box3().setFromObject(o);o.position.x+=-6.7-(b2.min.x+b2.max.x)/2;o.position.z+=18.9-(b2.min.z+b2.max.z)/2;}});}
// ---- appartamento 8 (video IMG_4597, Michele 13/10): gradini della scala come le lastre del 5/dell'1, copertina di pietra grigia sui parapetti del terrazzo
// riflesso del cielo per le parti in metallo lucido (lamiera dei camini): cielo azzurro, orizzonte chiaro, alberi e terra in basso
let _cielo=null;function cieloRiflesso(){if(_cielo)return _cielo;const c=document.createElement('canvas');c.width=512;c.height=256;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,256);
 g.addColorStop(0,'#5d8fd0');g.addColorStop(.38,'#a9c8ea');g.addColorStop(.49,'#eef3f6');g.addColorStop(.52,'#6f7b5e');g.addColorStop(.6,'#8a8a80');g.addColorStop(1,'#55564f');x.fillStyle=g;x.fillRect(0,0,512,256);
 for(let k=0;k<40;k++){x.fillStyle='rgba(255,255,255,'+(.15+Math.random()*.3)+')';x.beginPath();x.ellipse(Math.random()*512,20+Math.random()*90,20+Math.random()*50,6+Math.random()*10,0,0,Math.PI*2);x.fill();}
 const t=new THREE.CanvasTexture(c);t.mapping=THREE.EquirectangularReflectionMapping;t.encoding=THREE.sRGBEncoding;const pm=new THREE.PMREMGenerator(renderer);_cielo=pm.fromEquirectangular(t).texture;pm.dispose();return _cielo;}
// ---- camino come nel video dell'8 (IMG_4597 15-17 s, 23-24 s): niente cappello di cemento sui piedini; in cima una fascia di lamiera
// d'acciaio lucida alta 14 cm che sporge di 2 cm, sopra un aspiratore a girandola di metallo scuro. Lampada (facoltativa): tonda, vetro avorio
// rigato e bombato, subito sotto la fascia e spostata verso uno spigolo. Uno fatto bene per l'8, poi si estende a tutti (Michele 13/10).
function caminoVideo(cx,cz,w,d,lamp,R0){
 scene.updateMatrixWorld(true);
 let body=null;const tolti=[];scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3());
  if(Math.abs(c.x-cx)>.1||Math.abs(c.z-cz)>.1)return;const sx=b.max.x-b.min.x,sz=b.max.z-b.min.z;
  if(Math.abs(sx-w)<.02&&Math.abs(sz-d)<.02&&b.max.y-b.min.y>.8){if(!body||b.max.y>new THREE.Box3().setFromObject(body).max.y)body=o;}});
 if(!body){console.log('caminoVideo: camino non trovato',cx,cz);return;}const bb=new THREE.Box3().setFromObject(body),top=bb.max.y,par=body.parent;
 scene.traverse(o=>{if(!o.isMesh||o===body)return;const b=new THREE.Box3().setFromObject(o);if(b.min.y>top-.02&&b.max.y<top+.6&&b.min.x>cx-w/2-.2&&b.max.x<cx+w/2+.2&&b.min.z>cz-d/2-.2&&b.max.z<cz+d/2+.2){o.visible=false;tolti.push(o);}});
 const G=new THREE.Group(),acc=new THREE.MeshStandardMaterial({color:0xffffff,roughness:.1,metalness:.92,envMap:cieloRiflesso(),envMapIntensity:1.5}),scuro=new THREE.MeshStandardMaterial({color:0x26282b,roughness:.3,metalness:.75,envMap:cieloRiflesso(),envMapIntensity:.6}),scuroL=new THREE.MeshStandardMaterial({color:0x2e3034,roughness:.35,metalness:.7,envMap:cieloRiflesso(),envMapIntensity:.6,side:THREE.DoubleSide});
 const B=(a,b,c,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
 const fh=.14,e=.02;B(w+2*e,fh,.012,cx,top-fh/2+.01,cz-d/2-e+.006,acc);B(w+2*e,fh,.012,cx,top-fh/2+.01,cz+d/2+e-.006,acc);
 B(.012,fh,d+2*e,cx-w/2-e+.006,top-fh/2+.01,cz,acc);B(.012,fh,d+2*e,cx+w/2+e-.006,top-fh/2+.01,cz,acc);B(w+2*e,.012,d+2*e,cx,top+.016,cz,acc);
 // aspiratore eolico sferico (girandola "whirlybird"): palla di lamelle curve a spirale, scura, su un collo corto, quasi largo quanto il camino
 const ay=top+.022;{const R=R0||.486,H=R*1.15,neck=.12,y0=ay+neck;
  const n=new THREE.Mesh(new THREE.CylinderGeometry(R*.5,R*.55,neck,32),scuro);n.position.set(cx,ay+neck/2,cz);n.castShadow=true;G.add(n);
  const ring=new THREE.Mesh(new THREE.TorusGeometry(R*.62,.014,10,48),scuro);ring.rotation.x=Math.PI/2;ring.position.set(cx,y0+.01,cz);G.add(ring);
  const NV=14;for(let k=0;k<NV;k++){const pts=[];for(let t=0;t<=16;t++){const u=t/16,ph=-Math.PI*.36+u*Math.PI*.80,th=k/NV*Math.PI*2+u*1.15,rr=R*Math.cos(ph)*(1-.1*u),yy=y0+H*.48+Math.sin(ph)*H*.55;pts.push(new THREE.Vector3(cx+rr*Math.cos(th),yy,cz+rr*Math.sin(th)));}
   const tb=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),24,.02,6,false),scuro);tb.scale.set(1,1,1);tb.castShadow=true;G.add(tb);
   // lamella: nastro largo fra due spirali vicine
   const pts2=pts.map(p=>{const v=p.clone().sub(new THREE.Vector3(cx,p.y,cz));v.applyAxisAngle(new THREE.Vector3(0,1,0),.33);return v.add(new THREE.Vector3(cx,p.y,cz));});
   const pos=[];for(let t=0;t<pts.length-1;t++){const a=pts[t],b=pts[t+1],c=pts2[t],e=pts2[t+1];pos.push(a.x,a.y,a.z,b.x,b.y,b.z,c.x,c.y,c.z,b.x,b.y,b.z,e.x,e.y,e.z,c.x,c.y,c.z);}
   const lg2=new THREE.BufferGeometry();lg2.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));lg2.computeVertexNormals();const lm=new THREE.Mesh(lg2,scuroL);lm.castShadow=true;G.add(lm);}
  const cap=new THREE.Mesh(new THREE.SphereGeometry(R*.42,32,12,0,Math.PI*2,0,Math.PI/2),scuro);cap.scale.y=.45;cap.position.set(cx,y0+H*.48+H*.55*Math.sin(Math.PI*.44)-.01,cz);cap.castShadow=true;G.add(cap);
  const pin=new THREE.Mesh(new THREE.SphereGeometry(.025,12,8),scuro);pin.position.set(cx,cap.position.y+R*.42*.45,cz);G.add(pin);}
 // lampada tonda, vetro avorio rigato e bombato
 if(lamp){const c=document.createElement('canvas');c.width=256;c.height=256;const x=c.getContext('2d');x.fillStyle='#e8dfc6';x.fillRect(0,0,256,256);
  for(let k=0;k<256;k+=8){x.fillStyle=k%16?'rgba(255,255,245,.35)':'rgba(150,140,110,.18)';x.fillRect(0,k,256,4);}
  const tx=new THREE.CanvasTexture(c);tx.encoding=THREE.sRGBEncoding;
  const vetro=new THREE.MeshPhysicalMaterial({map:tx,roughness:.28,metalness:0,clearcoat:1,clearcoatRoughness:.12,emissive:0x2a2618}),_l=(vetro.userData.lampada=true),bordo=new THREE.MeshStandardMaterial({color:0xd8d2c0,roughness:.45});
  const lg=new THREE.Group(),r=.16,gp=[];for(let k=0;k<=20;k++){const a=k/20*Math.PI/2;gp.push(new THREE.Vector2(r*Math.cos(a),.012+.085*Math.sin(a)));}
  const lgeo=new THREE.LatheGeometry(gp,64),lp=lgeo.attributes.position,luv=lgeo.attributes.uv;for(let k=0;k<lp.count;k++){const u=(lp.getX(k)/r+1)/2,v=(lp.getZ(k)/r+1)/2;luv.setXY(k,u*.7+v*.3,v*.7-u*.3);}luv.needsUpdate=true;
  const gl=new THREE.Mesh(lgeo,vetro);lg.add(gl);
  const rg=new THREE.Mesh(new THREE.CylinderGeometry(r+.006,r+.008,.014,64),bordo);rg.position.y=.007;lg.add(rg);
  lg.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;}});const f=lamp.faccia||-1;lg.rotation.x=f<0?-Math.PI/2:Math.PI/2;
  lg.position.set(cx,top-fh-.03-.17,cz+f*d/2);G.add(lg);}
 scene.add(G);G.updateMatrixWorld(true);par.attach(G);console.log('caminoVideo',cx,cz,'tolti',tolti.length);}
// ---- pietra dei gradini della scala dell'8 (Michele 13/10: non grigio piatto "da paint", ma una texture che sembri roccia).
// Pietra grigia naturale disegnata qui: grana a piu' scale, puntinatura chiara e scura come un granito/pietra lavica, venature leggere,
// piu' una mappa di rilievo dalla stessa grana. Le UV sono in metri (uvFoto), cosi' la grana ha la stessa scala su tutti i gradini.
function pietraScala(){if(cache.pietraS)return cache.pietraS;const W=1024,c=document.createElement('canvas'),b=document.createElement('canvas');c.width=c.height=b.width=b.height=W;
 const x=c.getContext('2d'),y=b.getContext('2d');let sd=71;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 x.fillStyle='rgb(132,134,136)';x.fillRect(0,0,W,W);y.fillStyle='rgb(128,128,128)';y.fillRect(0,0,W,W);
 for(const [n,r0,r1,a] of [[90,60,220,.10],[400,15,60,.10],[1600,4,16,.12]])for(let q=0;q<n;q++){const gx=R()*W,gy=R()*W,rr=r0+R()*(r1-r0),v=R()<.5?95:175;
  for(const [cx,cy] of [[gx,gy],[gx-W,gy],[gx,gy-W],[gx-W,gy-W]]){const g=x.createRadialGradient(cx,cy,0,cx,cy,rr);g.addColorStop(0,`rgba(${v},${v},${v+3},${a})`);g.addColorStop(1,`rgba(${v},${v},${v+3},0)`);x.fillStyle=g;x.fillRect(cx-rr,cy-rr,2*rr,2*rr);
   const h=y.createRadialGradient(cx,cy,0,cx,cy,rr);h.addColorStop(0,`rgba(${v},${v},${v},${a*1.4})`);h.addColorStop(1,`rgba(${v},${v},${v},0)`);y.fillStyle=h;y.fillRect(cx-rr,cy-rr,2*rr,2*rr);}}
 for(let q=0;q<60000;q++){const px=R()*W,py=R()*W,s=R()<.85?1+R()*1.6:2+R()*2.5,k=R();const v=k<.45?60+R()*40:k<.8?180+R()*50:120+R()*30;x.fillStyle=`rgba(${v},${v},${v+2},${.35+R()*.45})`;x.fillRect(px,py,s,s);
  y.fillStyle=`rgba(${k<.45?70:190},${k<.45?70:190},${k<.45?70:190},.5)`;y.fillRect(px,py,s,s);}
 x.lineWidth=1;for(let q=0;q<14;q++){let px=R()*W,py=R()*W;x.strokeStyle=`rgba(${R()<.5?90:190},${R()<.5?90:190},${R()<.5?90:190},.18)`;x.beginPath();x.moveTo(px,py);for(let k=0;k<30;k++){px+=(R()-.5)*30;py+=(R()-.3)*18;x.lineTo(px,py);}x.stroke();}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
 const bt=new THREE.CanvasTexture(b);bt.wrapS=bt.wrapT=THREE.RepeatWrapping;bt.anisotropy=8;
 return cache.pietraS=new THREE.MeshStandardMaterial({map:t,bumpMap:bt,bumpScale:.012,roughness:.88,metalness:0,color:0xd4d6d8});}
// ---- appartamento 12 come il video IMG_4881 15-16 s (Michele 13/10): nella rientranza la porta a vetri in PVC come quella dell'8, sulle misure
// del suo vano, e davanti la porta a grata antracite; il blocco davanti alla porta diventa il secondo gradino (non piu' 48 cm sopra la soglia)
function dodici(){scene.updateMatrixWorld(true);const top=o=>{let t=o;while(t.parent&&t.parent!==scene)t=t.parent;return t;};
 const rel=o=>{const t=top(o);if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const m=new THREE.Matrix4().copy(t.matrixWorld).invert().multiply(o.matrixWorld);return o.geometry.boundingBox.clone().applyMatrix4(m);};
 let t0=null,gradino=null,vetro=null;const via=[];scene.traverse(o=>{if(!o.isMesh||!o.visible||top(o)===o)return;if(Math.abs(top(o).position.y-2.9)>.5)return;const b=rel(o);if(b.isEmpty())return;
  if(b.min.x>-11.85&&b.max.x<-11.6&&b.min.z>1.7&&b.max.z<2.7&&b.min.y>.25&&b.max.y<2.35){t0=top(o);if(!vetro&&b.max.z-b.min.z>.6&&b.max.y-b.min.y>1.6&&b.max.x-b.min.x<.1)vetro=o;else via.push(o);}
  if(Math.abs(b.min.x+11.69)<.02&&Math.abs(b.max.x+11.37)<.02&&Math.abs(b.max.y-.48)<.02&&Math.abs(b.min.y)<.02)gradino=o;});
 if(!t0||!vetro){console.log('dodici: porta non trovata');return;}via.forEach(o=>o.visible=false);
 if(gradino&&Math.abs(gradino.position.y)<1e-6){gradino.scale.y*=.33/.48;gradino.updateMatrixWorld(true);}
 // porta a vetri: portaPVC lavora lungo x con la faccia verso +z; qui il muro corre lungo z con la faccia verso +x, quindi gruppo ruotato di 90 gradi
 const g=rel(vetro),R=new THREE.Group();R.position.set(g.max.x,0,(g.min.z+g.max.z)/2);R.rotation.y=Math.PI/2;t0.add(R);R.updateMatrixWorld(true);
 const W=g.max.z-g.min.z;portaPVC(R,-W/2,W/2,g.min.y,g.max.y,0);
 // grata davanti, sul filo esterno del muro: ferro antracite micaceo lucido, tubolari a spigoli arrotondati (non scatole piatte),
 // telaio a murare, anta con montanti passanti e traversi piatti davanti, tre cerniere a cilindro, scatola della serratura con maniglia
 const y0=.33,y1=2.277,z0=1.758,z1=2.642,x=-11.585,zm=(z0+z1)/2;
 const ant=new THREE.MeshStandardMaterial({color:0x2b2e32,roughness:.26,metalness:.62,envMap:cieloRiflesso(),envMapIntensity:.25});
 const tubo=(len,a,b,r)=>{const sh=new THREE.Shape(),w=a/2,h=b/2;sh.moveTo(-w+r,-h);sh.lineTo(w-r,-h);sh.absarc(w-r,-h+r,r,-Math.PI/2,0);sh.lineTo(w,h-r);sh.absarc(w-r,h-r,r,0,Math.PI/2);sh.lineTo(-w+r,h);sh.absarc(-w+r,h-r,r,Math.PI/2,Math.PI);sh.lineTo(-w,-h+r);sh.absarc(-w+r,-h+r,r,Math.PI,Math.PI*1.5);
  const g=new THREE.ExtrudeGeometry(sh,{depth:len,bevelEnabled:false,curveSegments:4});g.translate(0,0,-len/2);g.computeVertexNormals();return g;};
 const mesh=g=>{const m=new THREE.Mesh(g,ant);m.castShadow=m.receiveShadow=true;t0.add(m);return m;};
 // verticale: profilo a (lungo x) per b (lungo z); orizzontale lungo z: profilo a (lungo x) per b (lungo y)
 const ver=(a,b,r,cx,ya,yb,cz)=>{const m=mesh(tubo(yb-ya,a,b,r));m.rotation.x=-Math.PI/2;m.position.set(cx,(ya+yb)/2,cz);};
 const ori=(a,b,r,cx,cy,za,zb)=>{const m=mesh(tubo(zb-za,a,b,r));m.position.set(cx,cy,(za+zb)/2);};
 const tf=.03;ver(.03,tf,.004,x-.01,y0,y1,z0+tf/2);ver(.03,tf,.004,x-.01,y0,y1,z1-tf/2);ori(.03,tf,.004,x-.01,y1-tf/2,z0+tf,z1-tf);
 const a0=z0+tf+.006,a1=z1-tf-.006,b0=y0+.012,b1=y1-tf-.006,fa=.045;
 ver(.04,fa,.006,x,b0,b1,a0+fa/2);ver(.04,fa,.006,x,b0,b1,a1-fa/2);ori(.04,fa,.006,x,b1-fa/2,a0+fa,a1-fa);ori(.04,fa*1.6,.006,x,b0+fa*.8,a0+fa,a1-fa);
 const g0=a0+fa,g1=a1-fa,h0=b0+fa*1.6,h1=b1-fa,nc=3,nr=8;
 for(let k=1;k<nc;k++)ver(.022,.022,.005,x-.004,h0,h1,g0+(g1-g0)*k/nc);
 for(let k=1;k<nr;k++)ori(.012,.03,.003,x+.013,h0+(h1-h0)*k/nr,g0,g1);
 for(const hy of [b0+.25,(b0+b1)/2,b1-.25]){const c=new THREE.Mesh(new THREE.CylinderGeometry(.013,.013,.12,20),ant);c.position.set(x+.005,hy,a1+.004);c.castShadow=true;t0.add(c);}
 {const c=mesh(tubo(.2,.035,.06,.006));c.rotation.x=-Math.PI/2;c.position.set(x+.03,y0+1.0,a0+fa/2);
  const l=new THREE.Mesh(new THREE.CylinderGeometry(.009,.01,.12,16),ant);l.rotation.x=Math.PI/2;l.position.set(x+.065,y0+1.05,a0+fa/2+.05);l.castShadow=true;t0.add(l);
  const p=new THREE.Mesh(new THREE.CylinderGeometry(.01,.01,.04,16),ant);p.rotation.z=Math.PI/2;p.position.set(x+.05,y0+1.05,a0+fa/2);t0.add(p);
  const k=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,.004,16),new THREE.MeshStandardMaterial({color:0xb8a46a,roughness:.3,metalness:.9}));k.rotation.z=Math.PI/2;k.position.set(x+.049,y0+.95,a0+fa/2);t0.add(k);}
 // scala del 12 (video IMG_4881 0-3 s): pedate e alzate in cotto chiaro a lastre grandi (tre per gradino), ultimo gradino in granito
 // come il terrazzo; corrimano di legno scuro verniciato con tre staffe al muro
 {const c=document.createElement('canvas');c.width=c.height=1024;const q=c.getContext('2d');let sd=17;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
  q.fillStyle='rgb(206,186,170)';q.fillRect(0,0,1024,1024);const T=1024/3,J=4;
  for(let r=0;r<3;r++)for(let k=0;k<3;k++){const v=R()*16-8;q.fillStyle=`rgb(${182+v|0},${112+v*.7|0},${90+v*.6|0})`;q.fillRect(k*T+J/2,r*T+J/2,T-J,T-J);
   for(let n=0;n<700;n++){const w=R();q.fillStyle=`rgba(${w<.5?150:225},${w<.5?85:160},${w<.5?65:135},${.05+R()*.08})`;q.fillRect(k*T+J/2+R()*(T-J-6),r*T+J/2+R()*(T-J-6),2+R()*6,2+R()*6);}
   for(let n=0;n<3;n++){const gx=k*T+R()*T,gy=r*T+R()*T,rr=40+R()*90,g=q.createRadialGradient(gx,gy,0,gx,gy,rr);g.addColorStop(0,'rgba(230,190,170,.16)');g.addColorStop(1,'rgba(230,190,170,0)');q.save();q.beginPath();q.rect(k*T+J/2,r*T+J/2,T-J,T-J);q.clip();q.fillStyle=g;q.fillRect(gx-rr,gy-rr,2*rr,2*rr);q.restore();}}
  const tx=new THREE.CanvasTexture(c);tx.wrapS=tx.wrapT=THREE.RepeatWrapping;tx.encoding=THREE.sRGBEncoding;tx.anisotropy=8;
  const cs=new THREE.MeshStandardMaterial({map:tx,roughness:.62,metalness:0});let alto=null,ya=-1,n=0;
  scene.traverse(o=>{if(!o.isMesh||!o.visible||Array.isArray(o.material))return;const m=o.material,or=m.userData&&m.userData.orig&&m.userData.orig.isMaterial?m.userData.orig.color.getHexString():'';if(or!=='b4704f')return;
   const b=new THREE.Box3().setFromObject(o);if(b.isEmpty()||b.min.x<-8.4||b.max.x>-5.9||b.min.z<4.65||b.max.z>5.85||b.min.y<.6||b.max.y>3)return;
   o.material=cs;o.geometry.userData.fotoUV=false;uvFoto(o,1.1);n++;if(b.max.y>ya){ya=b.max.y;alto=o;}});
  if(alto){alto.material=pietraScala();alto.geometry.userData.fotoUV=false;uvFoto(alto,.9);}
  let cr=null;scene.traverse(o=>{if(!cr&&o.isMesh&&o.geometry.type==='CylinderGeometry'&&o.material.color&&o.material.color.getHexString()==='594033'){const b=new THREE.Box3().setFromObject(o);if(b.min.x>-8.5&&b.max.x<-5.8&&b.min.z>5.6&&b.max.z<5.9)cr=o;}});
  if(cr){cr.material=new THREE.MeshStandardMaterial({color:0x4a2e1a,roughness:.35,metalness:0});const b=new THREE.Box3().setFromObject(cr),zc=(b.min.z+b.max.z)/2,met=new THREE.MeshStandardMaterial({color:0x2b2e32,roughness:.3,metalness:.7,envMap:cieloRiflesso(),envMapIntensity:.25});
   for(const t of [.12,.5,.88]){const x=b.max.x+(b.min.x-b.max.x)*t,y=b.min.y+.03+(b.max.y-b.min.y-.06)*t;
    const br=new THREE.Mesh(new THREE.CylinderGeometry(.008,.008,5.80-zc,12),met);br.rotation.x=Math.PI/2;br.position.set(x,y-.035,(zc+5.80)/2);scene.add(br);
    const gm=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.035,12),met);gm.position.set(x,y-.02,zc);scene.add(gm);
    const ro=new THREE.Mesh(new THREE.CylinderGeometry(.028,.028,.012,20),met);ro.rotation.x=Math.PI/2;ro.position.set(x,y-.035,5.794);scene.add(ro);}}
  console.log('dodici: scala',n,'gradini, corrimano',!!cr);}
 console.log('dodici: porta a vetri + grata, nascosti',via.length,'gradino',!!gradino);}
// ---- buco nel pavimento del camminamento sul retro fra il 12 e il corpo basso del 13 (Michele 13/10): si vedeva il solaio bianco;
// stesse lastre del camminamento, alla stessa quota, fra il muro del 12 (x -6,08), il corpo del 13 (z -8,05) e il muro nord del 13 (x -4,38)
function buco1213(){scene.updateMatrixWorld(true);let pav=null;scene.traverse(o=>{if(pav||!o.isMesh||Array.isArray(o.material))return;const b=new THREE.Box3().setFromObject(o);if(Math.abs(b.min.x+6.16)<.05&&Math.abs(b.min.z+12.05)<.05&&Math.abs(b.max.y-2.94)<.02)pav=o;});
 const m=pav?pav.material:new THREE.MeshStandardMaterial({color:0xd4d6d8});const x0=-6.12,x1=-4.36,z0=-10.17,z1=-8.03,y=pav?new THREE.Box3().setFromObject(pav).max.y:2.94;
 const g=new THREE.PlaneGeometry(x1-x0,z1-z0);g.rotateX(-Math.PI/2);const o=new THREE.Mesh(g,m);o.position.set((x0+x1)/2,y,(z0+z1)/2);o.receiveShadow=true;scene.add(o);o.updateMatrixWorld(true);uvFoto(o,2.4);
 // angolo del muro del 12 verso il buco: tacca alla base del muro e copertina di un muretto che non c'e' piu' rimasta a mezz'aria (Michele 13/10):
 // la copertina si toglie, tutto l'angolo (testata a denti del muretto e bordo del pavimento rialzato del 12) diventa una faccia unica a filo x -5,97, dal pavimento fino sotto la copertina del 12 (4,07), z -9,95/-8,03 (a filo della faccia del muretto verso il camminamento, niente scalino); lo zoccolo ci gira davanti dritto
 let muro=null;scene.traverse(o=>{if(!o.isMesh||!o.visible||Array.isArray(o.material))return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;
  if(Math.abs(b.min.x+6.10)<.03&&Math.abs(b.max.x+6.01)<.03&&b.min.y>3.7&&b.max.y<3.85&&Math.abs(b.min.z+9.69)<.03)o.visible=false;
  if(!muro&&o.material.color&&o.material.color.getHexString()==='ededea'&&b.min.x<-15&&b.max.x>-6.2&&b.max.x<-5.8&&b.min.y<3&&b.max.y>3.9)muro=o;});
 {const mm=muro?muro.material:new THREE.MeshStandardMaterial({color:0xededea});const r=new THREE.Mesh(new THREE.BoxGeometry(.38,4.07-y,1.92),mm);r.position.set(-6.16,(y+4.07)/2,-8.99);r.castShadow=r.receiveShadow=true;scene.add(r);r.updateMatrixWorld(true);if(muro&&mm.map)uvFoto(r,1.5);}
 {const G=pietraScala(),T=.015,H=.10,z1=new THREE.Mesh(new THREE.BoxGeometry(T,H,1.92+T),G);z1.position.set(-5.97+T/2,y+H/2,-8.99-T/2);
  const z2=new THREE.Mesh(new THREE.BoxGeometry(.38+T,H,T),G);z2.position.set(-6.16+T/2,y+H/2,-9.95-T/2);
  for(const z of [z1,z2]){z.castShadow=z.receiveShadow=true;scene.add(z);z.updateMatrixWorld(true);uvFoto(z,.9);}}// zoccolo sulle due facce del blocco d'angolo, come sui muri accanto
 console.log('buco1213',!!pav,y,!!muro);}
// ---- zoccolo di granito alla base dei muri esterni del 12 (video IMG_4881 4,5-7 s, Michele 13/10): alto 10 cm, solo dove davanti c'e' il pavimento
// del terrazzo (raggio verso il basso), alla quota del pavimento trovata punto per punto, interrotto sotto le porte
function zoccolo12(){zoccoloUnita('12',new THREE.Box3(new THREE.Vector3(-18,2.4,-12.5),new THREE.Vector3(-4,4.6,4.5)),(x,z)=>x>-11.72&&x<-11.07&&z>1.2&&z<1.85);zoccoloUnita('13',new THREE.Box3(new THREE.Vector3(-6.8,2.4,-12.6),new THREE.Vector3(8,4.6,-4)),()=>false);}
function zoccoloUnita(NU,zona,escludi){scene.updateMatrixWorld(true);const M=typeof SACROFANO_MODEL!=='undefined'?SACROFANO_MODEL:window.SACROFANO_MODEL;if(!M)return;const L=M.levels.find(l=>l.id==='1');const U=L&&L.units.find(u=>String(u.n)===NU);if(!U)return;
 const P=U.poly[0],Y=2.9,H=.10,T=.015,STEP=.05,mat=pietraScala(),rc=new THREE.Raycaster(),gi=[];
 const bb=new THREE.Box3();
 const tutti=[];scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.visible||Array.isArray(o.material))return;bb.setFromObject(o);if(bb.isEmpty()||!bb.intersectsBox(zona))return;const m=o.material;if(m.transparent&&m.opacity<.2)return;if(m.visible===false||m.colorWrite===false)return;if(m.color&&m.color.getHexString()==='19c37d')return;tutti.push(o);});
 let A=0;for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length];A+=p[0]*q[1]-q[0]*p[1];}const sg=A>0?1:-1;
 const porte=L.windows.filter(w=>w.door).map(w=>({x:w.c[0],z:w.c[2],n:w.n,w:w.w}));
 const sottoPorta=(x,z,ux,uz)=>porte.some(d=>{const tx=-d.n[1],tz=d.n[0],dx=x-d.x,dz=z-d.z;if(Math.abs(ux*tx+uz*tz)<.9)return false;const along=Math.abs(dx*tx+dz*tz),perp=Math.abs(dx*d.n[0]+dz*d.n[1]);return along<d.w/2+.02&&perp<.35;});
 let n=0;
 for(let i=0;i<P.length;i++){const p=P[i],q=P[(i+1)%P.length],dx=q[0]-p[0],dz=q[1]-p[1],len=Math.hypot(dx,dz);if(len<.3)continue;const ux=dx/len,uz=dz/len,nx=sg*uz,nz=-sg*ux;
  const k=Math.max(1,Math.round(len/STEP)),seg=[];
  for(let j=0;j<k;j++){const t=(j+.5)/k,x=p[0]+dx*t,z=p[1]+dz*t;let ok=null;
   const suGradini=escludi(x,z);// fianco dei due gradini davanti alla porta a grata: niente zoccolo (Michele 13/10)
   if(!sottoPorta(x,z,ux,uz)&&!suGradini){rc.set(new THREE.Vector3(x+nx*.7,Y+.35,z+nz*.7),new THREE.Vector3(-nx,0,-nz));rc.far=1.1;const h=rc.intersectObjects(tutti,false)[0];
    if(h&&h.distance>.1){const fx=h.point.x,fz=h.point.z;rc.set(new THREE.Vector3(fx+nx*.06,Y+.6,fz+nz*.06),new THREE.Vector3(0,-1,0));rc.far=.9;const g=rc.intersectObjects(tutti,false).find(e=>e.point.y>Y-.25&&e.point.y<Y+.6);
     if(g&&g.point.y>Y-.25&&g.point.y<Y+.6)ok={d:h.distance,y:g.point.y};}}
   seg.push(ok);}
  let j=0;while(j<k){if(!seg[j]){j++;continue;}let e=j;while(e+1<k&&seg[e+1]&&Math.abs(seg[e+1].y-seg[j].y)<.02&&Math.abs(seg[e+1].d-seg[j].d)<.03)e++;
   const t0=j/k,t1=(e+1)/k,cx=p[0]+dx*(t0+t1)/2,cz=p[1]+dz*(t0+t1)/2,l=len*(t1-t0),off=.7-seg[j].d+T/2;
   if(l<.35){j=e+1;continue;}// pezzetti di pochi centimetri sui risalti del muro: si tolgono, lo zoccolo resta continuo (Michele 13/10)
   const z=new THREE.Mesh(new THREE.BoxGeometry(l+2*T,H,T),mat);z.position.set(cx+nx*off,seg[j].y+H/2,cz+nz*off);z.rotation.y=Math.atan2(-uz,ux);z.castShadow=z.receiveShadow=true;scene.add(z);z.updateMatrixWorld(true);uvFoto(z,.9);
   // lista di granito a filo del pavimento fra muro e pavimento: in certi punti il pavimento si ferma qualche centimetro prima del muro
   const fz=new THREE.Mesh(new THREE.BoxGeometry(l+.18,.03,.09),mat);fz.position.set(cx+nx*(off-T/2+.045),seg[j].y-.014,cz+nz*(off-T/2+.045));fz.rotation.y=z.rotation.y;fz.receiveShadow=true;scene.add(fz);fz.updateMatrixWorld(true);uvFoto(fz,.9);n++;j=e+1;}}
 console.log('zoccolo',NU,'pezzi',n);}
// ---- cancelletti pedonali (entry_gates, es. in cima alla scala in cotto del 12 fra i due pilastri, Michele 7/10): nel viewer usano il materiale
// delle righe delle persiane, spento quando le persiane sono diventate a doghe, e sparivano. Ferro marrone come nel vecchio sito, sbarre arrotondate
function cancellettiEntrata(){scene.updateMatrixWorld(true);const M=typeof SACROFANO_MODEL!=='undefined'?SACROFANO_MODEL:null;if(!M)return;
 const fe=new THREE.MeshStandardMaterial({color:0x3a2a1e,roughness:.35,metalness:.55,envMap:cieloRiflesso(),envMapIntensity:.25});
 const tubo=(len,a,b)=>{const r=Math.min(a,b)*.3,sh=new THREE.Shape(),w=a/2,h=b/2;sh.moveTo(-w+r,-h);sh.lineTo(w-r,-h);sh.absarc(w-r,-h+r,r,-Math.PI/2,0);sh.lineTo(w,h-r);sh.absarc(w-r,h-r,r,0,Math.PI/2);sh.lineTo(-w+r,h);sh.absarc(-w+r,h-r,r,Math.PI/2,Math.PI);sh.lineTo(-w,-h+r);sh.absarc(-w+r,-h+r,r,Math.PI,Math.PI*1.5);
  const g=new THREE.ExtrudeGeometry(sh,{depth:len,bevelEnabled:false,curveSegments:4});g.translate(0,0,-len/2);return g;};
 let n=0;for(const L of M.levels)for(const g of L.entry_gates||[]){const zona=new THREE.Box3(new THREE.Vector3(g.at[0]-g.w,-1,g.at[1]-g.w),new THREE.Vector3(g.at[0]+g.w,12,g.at[1]+g.w));
  scene.traverse(o=>{if(!o.isMesh||Array.isArray(o.material)||o.material.visible!==false||o.geometry.type!=='BoxGeometry')return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty()||!zona.containsBox(b))return;
   const {width:w,height:h,depth:d}=o.geometry.parameters;let geo;
   if(h>=w&&h>=d){geo=tubo(h,w,d);geo.rotateX(-Math.PI/2);}else if(w>=d){geo=tubo(w,d,h);geo.rotateY(Math.PI/2);geo.rotateX(0);}else geo=tubo(d,w,h);
   geo.computeVertexNormals();o.geometry=geo;o.material=fe;o.castShadow=true;n++;});}
 // piu' realistico (Michele 13/10): montanti di testa, due cardini sul pilastro, scatola della serratura con maniglia a leva e chiave,
 // al posto della maniglietta chiara schematica; tutto nel gruppo del cancelletto (x lungo il cancelletto, y in alto, z spessore)
 for(const L of M.levels)for(const g of L.entry_gates||[]){let G=null;scene.traverse(o=>{if(!G&&o.isGroup&&Math.abs(o.position.x-g.at[0])<.01&&Math.abs(o.position.z-g.at[1])<.01)G=o;});if(!G)continue;
  const w=g.w,add=(geo,x,y,z,m)=>{const k=new THREE.Mesh(geo,m||fe);k.position.set(x,y,z);k.castShadow=k.receiveShadow=true;G.add(k);return k;};
  G.children.forEach(c=>{if(c.isMesh&&c.geometry.type==='BoxGeometry'&&Math.abs(c.geometry.parameters.width-.11)<1e-3&&Math.abs(c.geometry.parameters.depth-.08)<1e-3)c.visible=false;});
  for(const sx of [-1,1]){const v=add(tubo(.96,.04,.04),sx*(w/2-.02),.14+.48,0);v.geometry.rotateX(-Math.PI/2);v.geometry.computeVertexNormals();}
  for(const hy of [.3,.92]){add(new THREE.CylinderGeometry(.014,.014,.1,20),-w/2-.012,hy,0);const p=add(new THREE.BoxGeometry(.05,.03,.012),-w/2-.04,hy,0);}
  const sc=add(tubo(.16,.035,.06),w/2-.065,.66,.035);sc.geometry.rotateX(-Math.PI/2);sc.geometry.computeVertexNormals();
  const lv=add(new THREE.CylinderGeometry(.008,.009,.11,16),w/2-.12,.7,.075);lv.rotation.z=Math.PI/2;
  const rs=add(new THREE.CylinderGeometry(.012,.012,.03,16),w/2-.065,.7,.06);rs.rotation.x=Math.PI/2;
  const kh=add(new THREE.CylinderGeometry(.007,.007,.004,16),w/2-.065,.61,.068,new THREE.MeshStandardMaterial({color:0xb8a46a,roughness:.3,metalness:.9}));kh.rotation.x=Math.PI/2;}
 console.log('cancellettiEntrata: pezzi',n);}
// ---- tettoia sopra il portone del 13 (foto IMG_4860, Michele 13/10): soletta bianca sporgente 60 cm con bordo spesso, coppi sopra in leggera
// pendenza verso l'esterno, due travetti di legno sotto; muro del portone a z -10,165 con la faccia verso -z
function tettoia13(){let cop=null;scene.traverse(o=>{if(!cop&&o.isMesh&&o.geometry.type==='CylinderGeometry'&&o.geometry.parameters.openEnded&&o.material&&!Array.isArray(o.material)){const m=o.material,or=m.userData&&m.userData.orig&&m.userData.orig.isMaterial?m.userData.orig.color.getHexString():m.color.getHexString();if(or==='b5643f'||m.color.getHexString()==='b5643f')cop=m;}});
 if(!cop)cop=new THREE.MeshStandardMaterial({color:0xa8583a,roughness:.8,side:THREE.DoubleSide});
 const G=new THREE.Group();G.position.set(3.145,0,-10.165);G.rotation.y=Math.PI;scene.add(G);
 const W=1.8,D=.6,yb=5.36,T=.14,bianco=new THREE.MeshStandardMaterial({color:0xf3f1ea,roughness:.9}),legno=new THREE.MeshStandardMaterial({color:0x4a2e1a,roughness:.6});
 const add=(geo,m,x,y,z)=>{const k=new THREE.Mesh(geo,m);k.position.set(x,y,z);k.castShadow=k.receiveShadow=true;G.add(k);return k;};
 add(new THREE.BoxGeometry(W,T,D),bianco,0,yb+T/2,D/2);
 for(const sx of [-1,1]){const b=add(new THREE.BoxGeometry(.09,.11,D-.08),legno,sx*(W/2-.22),yb-.055,(D-.08)/2);}
 if(cop){const rr=.05,sp=.11,n=Math.floor((W-.04)/sp),L=D+.06,dy=.06,ang=Math.atan2(dy,L);
  const gCh=new THREE.CylinderGeometry(rr,rr,L,12,1,true,-Math.PI/2,Math.PI);gCh.rotateX(Math.PI/2);
  const gCp=new THREE.CylinderGeometry(rr*.93,rr*.93,L,12,1,true,-Math.PI/2,Math.PI);gCp.rotateX(-Math.PI/2);
  for(let i=0;i<n;i++){const x=-W/2+.02+(i+.5)*sp;const c=add(gCh,cop,x,yb+T+rr*.6,L/2-.02);c.rotation.x=ang;
   if(i<n-1){const p=add(gCp,cop,x+sp/2,yb+T+rr*1.25,L/2-.02);p.rotation.x=ang;}}}
 G.traverse(o=>{if(o.isMesh)o.updateMatrixWorld(true);});console.log('tettoia13',!!cop);}
// ---- aree a parcheggio della planimetria generale del DWG (Michele 13/10): tre aree, contorno con una riga bianca di vernice a terra.
// La planimetria e' in scala 1:2 rispetto alla pianta: modello = 2 x (planimetria - spigolo nord-ovest dell'edificio) + spigolo nel modello
const PARCHEGGI_PLAN=[
 [[-59.79,1.62],[-57.58,3.50],[-58.87,8.33],[-61.44,7.82]],
 [[-53.16,2.6],[-52.27,2.45],[-51.31,2.6],[-50.59,2.9],[-46.71,3.42],[-44.2,3.53],[-44.28,10.06],[-47.67,10.03],[-47.66,9.26],[-49.21,9.25],[-49.28,8.03],[-52.77,8.22]],
 [[-61.62,8.48],[-58.46,9.32],[-57.17,11.91],[-56.71,12.67],[-55.67,13.85],[-54.82,14.57],[-54.84,16.71],[-62.76,15.8],[-63.18,15.14]]];
function parcheggi(){scene.updateMatrixWorld(true);const F=p=>[2*(p[0]+54)-17.63,2*(p[1]+10.94)-11.94];
 const zona=new THREE.Box3(new THREE.Vector3(-45,-6,5),new THREE.Vector3(10,3,50)),bb=new THREE.Box3(),terra=[];
 scene.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||!o.visible||Array.isArray(o.material))return;const m=o.material;if(m.transparent&&m.opacity<.2)return;bb.setFromObject(o);if(bb.isEmpty()||!bb.intersectsBox(zona))return;const sz=bb.getSize(new THREE.Vector3());if(sz.x<1.5&&sz.z<1.5)return;terra.push(o);});
 const rc=new THREE.Raycaster(),q=(x,z)=>{rc.set(new THREE.Vector3(x,8,z),new THREE.Vector3(0,-1,0));rc.far=20;const h=rc.intersectObjects(terra,false)[0];return h?h.point.y:0;};
 const mat=new THREE.MeshStandardMaterial({color:0xf2f2ee,roughness:.75,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),Wd=.12;window.PARCHEGGI=[];
 // area centrale tutta dentro il prato, centrata nel verde (Michele 13/10): stessa forma e misure, solo spostata; si cerca lo spostamento
 // che la tiene dentro il prato con 60 cm di margine e si prende il centro di quelli possibili
 const LK=SACROFANO_MODEL.landscape,verdi=[LK.court];if(LK.corner_prato)verdi.push(LK.corner_prato);if(LK.ramp_edge)verdi.push([...LK.ramp_edge,[-18,21.5],[-17.5,29],[-8.5,37],[4.5,44],[5,47]]);
 const inP=(pl,x,z)=>{let c=false;for(let i=0,k=pl.length-1;i<pl.length;k=i++){const [x1,z1]=pl[i],[x2,z2]=pl[k];if((z1>z)!=(z2>z)&&x<(x2-x1)*(z-z1)/(z2-z1)+x1)c=!c;}return c;},inC=(x,z)=>verdi.some(pl=>inP(pl,x,z));
 const sposta=(P)=>{const ok=[];for(let dx=-10;dx<=4;dx+=.25)for(let dz=-2;dz<=12;dz+=.25){let good=true;for(let i=0;i<P.length&&good;i++){const a=P[i],b=P[(i+1)%P.length];for(let t=0;t<=1;t+=.1){const x=a[0]+(b[0]-a[0])*t+dx,z=a[1]+(b[1]-a[1])*t+dz;
   for(const [ox,oz] of [[0,0],[.5,0],[-.5,0],[0,.5],[0,-.5]])if(!inC(x+ox,z+oz)){good=false;break;}if(!good)break;}}if(good)ok.push([dx,dz]);}
  if(!ok.length){console.log('parcheggio centrale: non entra nel prato');return P;}const mx=ok.reduce((s,o)=>s+o[0],0)/ok.length,mz=ok.reduce((s,o)=>s+o[1],0)/ok.length;
  let best=ok[0],bd=1e9;for(const o of ok){const d=Math.hypot(o[0]-mx,o[1]-mz);if(d<bd){bd=d;best=o;}}console.log('parcheggio centrale spostato',best,'possibili',ok.length);return P.map(p=>[p[0]+best[0],p[1]+best[1]]);};
 // Michele 14/10: al posto del contorno con lo scalino, i 9 posti auto del DWG segnati a terra con la riga bianca:
 // 4 a sinistra da 2,50 x 5,00 (fila nord-sud, bordo destro x -10,69, fondo z 31,1) e 5 a destra larghi 2,55/2,50/2,50/2,50/2,98 profondi 4,60 (bordo destro x -0,69, fondo z 35,03)
 const blocchi=[{x0:-15.69,x1:-10.69,z0:31.1-10,w:[2.5,2.5,2.5,2.5]},{x0:-5.29,x1:-0.69,z0:35.03-13.03,w:[2.55,2.5,2.5,2.5,2.98]}],seg=[];
 for(const B of blocchi){let z=B.z0;const zs=[z];for(const w of B.w){z+=w;zs.push(z);}window.PARCHEGGI.push([[B.x0,zs[0]],[B.x1,zs[0]],[B.x1,z],[B.x0,z]]);
  seg.push([[B.x0,zs[0]],[B.x0,z]],[[B.x1,zs[0]],[B.x1,z]]);for(const zz of zs)seg.push([[B.x0,zz],[B.x1,zz]]);}
 {const pos=[];for(const [a,b] of seg){const dx=b[0]-a[0],dz=b[1]-a[1],L=Math.hypot(dx,dz),ux=dx/L,uz=dz/L,nx=-uz*Wd/2,nz=ux*Wd/2,n=Math.max(1,Math.ceil(L/.25));
   for(let k=0;k<n;k++){const t0=k/n,t1=(k+1)/n,x0=a[0]+dx*t0-ux*(k===0?Wd/2:0),z0=a[1]+dz*t0-uz*(k===0?Wd/2:0),x1=a[0]+dx*t1+ux*(k===n-1?Wd/2:0),z1=a[1]+dz*t1+uz*(k===n-1?Wd/2:0),y0=q(x0,z0)+.012,y1=q(x1,z1)+.012;
    pos.push(x0+nx,y0,z0+nz, x0-nx,y0,z0-nz, x1+nx,y1,z1+nz, x0-nx,y0,z0-nz, x1-nx,y1,z1-nz, x1+nx,y1,z1+nz);}}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.computeVertexNormals();const m=new THREE.Mesh(g,mat);m.receiveShadow=true;m.material.side=THREE.DoubleSide;scene.add(m);}
 console.log('parcheggi',window.PARCHEGGI.map(P=>P.map(p=>p.map(v=>v.toFixed(1)).join(',')).join(' ')));}
// ---- paletti bianchi 8 x 8 cm rimasti sul bordo del camminamento sul retro del 12 (x -10,4/-8,3, z -11,8): resti di una vecchia rete, si tolgono (Michele 14/10)
// Michele 14/10: tetto del portico dietro al 12 alzato come il DWG; la parete della casa davanti alle colonne (faccia z -9,54) sale fino sotto il tetto, e il fianco est (x -6,08) si chiude, cosi non si vede dentro
function chiudiPortico12(){scene.updateMatrixWorld(true);let mm=null;{const rc=new THREE.Raycaster(new THREE.Vector3(-10,5.5,-11.6),new THREE.Vector3(0,0,1));const h=rc.intersectObjects(scene.children,true).find(i=>i.object.visible&&!Array.isArray(i.object.material)&&i.object.material.color&&i.object.material.color.getHexString()==='ededea');if(h)mm=h.object.material;}
 const M=mm||new THREE.MeshStandardMaterial({color:0xededea}),u=z=>6.904+.329*(z+9.54)+.03,y0=5.66,add=g=>{const w=new THREE.Mesh(g,M);w.castShadow=w.receiveShadow=true;scene.add(w);return w;};
 {const w=add(new THREE.BoxGeometry(9.41,u(-9.54)-y0,.24));w.position.set((-15.49-6.08)/2,(y0+u(-9.54))/2,-9.54+.12);w.updateMatrixWorld(true);if(mm&&mm.map)uvFoto(w,1.5);}
 {const sh=new THREE.Shape();sh.moveTo(-9.54,y0);sh.lineTo(-9.54,u(-9.54));sh.lineTo(-7.97,u(-7.97));sh.lineTo(-7.97,y0);sh.closePath();const g=new THREE.ExtrudeGeometry(sh,{depth:.24,bevelEnabled:false});g.rotateY(-Math.PI/2);const w=add(g);w.position.set(-6.08,0,0);w.updateMatrixWorld(true);if(mm&&mm.map)uvFoto(w,1.5);}
 // bordo del terrazzo sul retro (Michele 14/10): il parapetto (faccia z -11,84) era 10 cm piu indietro del muro sotto (z -11,94) e lasciava una riga bianca; si porta avanti a filo, copertina compresa
 {let par=null,cop=null;scene.traverse(o=>{if(!o.isMesh||!o.visible||Array.isArray(o.material))return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;if(Math.abs(b.min.z+11.84)<.01&&Math.abs(b.min.x+17.64)<.02){if(Math.abs(b.max.y-4.07)<.01&&Math.abs(b.min.y-2.9)<.01)par=o;if(Math.abs(b.min.y-4.07)<.01&&Math.abs(b.max.y-4.12)<.01)cop=o;}});
  const x0=-17.63,x1=-5.91,z0=-11.937,z1=-11.84;
  {const w=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,4.07-2.9,z1-z0),par?par.material:M);w.position.set((x0+x1)/2,(2.9+4.07)/2,(z0+z1)/2);w.castShadow=w.receiveShadow=true;scene.add(w);w.updateMatrixWorld(true);if(par&&par.material.map)uvFoto(w,1.5);}
  {const w=new THREE.Mesh(new THREE.BoxGeometry(x1-x0,.05,z1-z0),cop?cop.material:new THREE.MeshStandardMaterial({color:0xd4d6d8}));w.position.set((x0+x1)/2,4.095,(z0+z1)/2);w.receiveShadow=true;scene.add(w);w.updateMatrixWorld(true);if(cop&&cop.material.map)uvFoto(w,.9);}
  console.log('bordo terrazzo 12',!!par,!!cop);}
 // lato ovest del portico (Michele 14/10, DWG prospetto ovest e Tav2 prospetto 4: intonaco pieno sotto la falda): Michele: solo la parte sopra (A), da +5,40 fino sotto il tetto, lungo tutta la falda fino al bordo del tetto (z -12,26); sotto resta aperto il passaggio dal terrazzo
 {const u2=z=>6.14+.32845*(z+11.87)+.03,yb=5.4,za=-11.937,zb=-9.54;const sh=new THREE.Shape();sh.moveTo(za,yb);sh.lineTo(za,u2(za));sh.lineTo(zb,u2(zb));sh.lineTo(zb,yb);sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:.28,bevelEnabled:false});g.rotateY(-Math.PI/2);const w=new THREE.Mesh(g,M);w.position.set(-15.21,0,0);w.castShadow=w.receiveShadow=true;scene.add(w);w.updateMatrixWorld(true);if(mm&&mm.map)uvFoto(w,1.5);}
 console.log('chiudiPortico12',!!mm);}
function paletti12(){scene.updateMatrixWorld(true);let n=0;scene.traverse(o=>{if(!o.isMesh||!o.visible||!o.material||!o.material.color||o.material.color.getHexString()!=='ededea')return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;const s=b.getSize(new THREE.Vector3());
 if(s.x<.12&&s.z<.12&&s.y>1&&b.min.z>-12&&b.max.z<-11.5&&b.min.x>-11&&b.max.x<-8){o.visible=false;n++;}});
 // copertina del muretto interno del terrazzo del 12 (x -12,06/-8,30, z 5,8/6,0) che sbucava dalla faccia del muro alto a x -11,90: si accorcia fino al muro
 scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;if(Math.abs(b.min.x+12.06)<.02&&Math.abs(b.max.x+8.30)<.02&&Math.abs(b.min.z-5.80)<.02&&Math.abs(b.max.z-6.00)<.02&&b.min.y>3.8&&b.max.y<3.95){
  const L0=b.max.x-b.min.x,L1=b.max.x+11.90,k=L1/L0;o.scale.x*=k;o.updateMatrixWorld(true);const b2=new THREE.Box3().setFromObject(o);const d=b.max.x-b2.max.x;const w=o.getWorldPosition(new THREE.Vector3());w.x+=d;o.position.copy(o.parent.worldToLocal(w));o.updateMatrixWorld(true);n++;}});
 // al posto dei paletti, quattro colonne piene 30 x 30 cm che reggono il tetto sopra il camminamento sul retro del 12 (Michele 14/10):
 // stesso intonaco del muro, appoggiate sulla copertina del muretto (4,12) fino sotto il tetto, faccia esterna a filo del bordo del tetto
 {let mm=null;scene.traverse(o=>{if(!mm&&o.isMesh&&o.material&&!Array.isArray(o.material)&&o.material.color&&o.material.color.getHexString()==='ededea'&&o.material.map)mm=o.material;});
  const rc=new THREE.Raycaster(),objs=[];scene.traverse(o=>{if(o.isMesh&&o.visible&&!o.isInstancedMesh&&!Array.isArray(o.material)&&o.material.visible!==false&&!(o.material.transparent&&o.material.opacity<.2))objs.push(o);});
  for(const x of [-15.34,-12.30,-9.27,-6.23]){const z=-11.787,y0=4.12;// Michele 14/10: una per estremita e due in mezzo, tutte alla stessa distanza (3,04 m)
rc.set(new THREE.Vector3(x,y0+.02,z),new THREE.Vector3(0,1,0));rc.far=3;const h=rc.intersectObjects(objs,false)[0];const top=(h?h.point.y:4.75)+.02;
   const c=new THREE.Mesh(new THREE.BoxGeometry(.3,top-y0,.3),mm||new THREE.MeshStandardMaterial({color:0xededea}));c.position.set(x,(y0+top)/2,z);c.castShadow=c.receiveShadow=true;scene.add(c);c.updateMatrixWorld(true);if(mm)uvFoto(c,1.5);}}
 console.log('paletti12',n);}
// ---- montagnola nella curva del viale (foto della curva di Michele 14/10: terra rialzata a cupola con erba secca dietro il muretto, la magnolia
// in cima): rilievo morbido alto 90 cm lungo la fila di alberi della curva, ripido verso la rete del viale e dolce verso il piazzale
function montagnola(){const C=ALBERI_MAPPA.filter(a=>a[2]<.7).map(a=>[a[0]+.45,a[1]]);if(C.length<2)return;C.sort((a,b)=>a[1]-b[1]);
 const near=(x,z)=>{let best=1e9,bx=0,bz=0;for(let i=0;i<C.length-1;i++){const [ax,az]=C[i],[cx,cz]=C[i+1],dx=cx-ax,dz=cz-az,L=dx*dx+dz*dz,t=Math.max(0,Math.min(1,((x-ax)*dx+(z-az)*dz)/L)),px=ax+dx*t,pz=az+dz*t,d=Math.hypot(x-px,z-pz);if(d<best){best=d;bx=px;bz=pz;}}return [best,bx,bz];};
 const Hh=.8,hf=(x,z)=>{const [d,px]=near(x,z);const out=x<px;const r=out?.9:1.9;if(d>=r)return 0;const t=d/r;return Hh*Math.pow(Math.cos(t*Math.PI/2),1.6);};
 const x0=-22.6,x1=-14,z0=17.8,z1=32,st=.15,nx=Math.round((x1-x0)/st),nz=Math.round((z1-z0)/st),pos=[],uv=[],idx=[];
 for(let j=0;j<=nz;j++)for(let i=0;i<=nx;i++){const x=x0+i*st,z=z0+j*st;pos.push(x,.02+hf(x,z),z);uv.push(x/2.5,z/2.5);}
 for(let j=0;j<nz;j++)for(let i=0;i<nx;i++){const a=j*(nx+1)+i,b=a+1,c=a+nx+1,d=c+1;if(pos[a*3+1]+pos[b*3+1]+pos[c*3+1]+pos[d*3+1]<.09)continue;idx.push(a,c,b,b,c,d);}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 const m=new THREE.MeshStandardMaterial({map:pratoCurato(),roughness:1,metalness:0});m.color.setRGB(1.05,.88,.58);
 const o=new THREE.Mesh(g,m);o.receiveShadow=o.castShadow=true;o.name='montagnola';scene.add(o);console.log('montagnola',idx.length/6);}
// ---- alberi dalla mappa a puntini di Michele (14/10) sulla vista dall'alto: latifoglie medio-grandi vere, tronco e rami, chioma a piu' masse
// di foglie singole (non sagome piatte). [x, z, grandezza]: 1 = grande, .8 = medio, .62 = lungo la curva del viale (piu' fitti)
const ALBERI_MAPPA=[[24.43,-9.14,.8],[-19.16,19.87,.62],[-16.36,19.16,.62],[-20.59,21.3,.62],[-20.72,23,.62],[-21.11,24.43,.62],[-19.74,24.49,.62],[-20.26,26.25,.62],[-19.48,26.57,.62],[-19.61,28.01,.62],[-18.83,29.5,.62],[-18.44,30.67,.62],
 [3.68,20.26,1],[1.33,27.42,.8],[5.11,37.96,.85],[7.58,37.18,.8],[7.58,38.61,.75],[6.86,39.91,.7]];
function alberiVeri(){scene.updateMatrixWorld(true);let sd=311;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 const lc=document.createElement('canvas');lc.width=64;lc.height=128;{const x=lc.getContext('2d');const g=x.createLinearGradient(0,0,64,0);g.addColorStop(0,'#bdbdbd');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#a0a0a0');x.fillStyle=g;
  x.beginPath();x.moveTo(32,2);x.bezierCurveTo(60,34,58,92,32,126);x.bezierCurveTo(6,92,4,34,32,2);x.fill();x.strokeStyle='rgba(0,0,0,.3)';x.lineWidth=2;x.beginPath();x.moveTo(32,8);x.lineTo(32,122);x.stroke();}
 const lt=new THREE.CanvasTexture(lc);lt.encoding=THREE.sRGBEncoding;const foglia=new THREE.PlaneGeometry(.1,.16);foglia.translate(0,.07,0);
 const mf=new THREE.MeshStandardMaterial({map:lt,alphaTest:.5,side:THREE.DoubleSide,roughness:.62,metalness:0,emissive:0x0b1406,emissiveIntensity:.35});
 const bc=document.createElement('canvas');bc.width=128;bc.height=256;{const x=bc.getContext('2d');x.fillStyle='#4f463d';x.fillRect(0,0,128,256);
  for(let i=0;i<260;i++){const xx=R()*128,w=1+R()*4,v=R();x.fillStyle=v<.5?`rgba(30,24,19,${.35+R()*.4})`:`rgba(120,110,98,${.2+R()*.3})`;x.fillRect(xx,R()*256,w,20+R()*90);}
  for(let i=0;i<40;i++){x.fillStyle='rgba(20,16,12,.5)';x.fillRect(R()*128,R()*256,6+R()*14,2);}}
 const bt=new THREE.CanvasTexture(bc);bt.wrapS=bt.wrapT=THREE.RepeatWrapping;bt.repeat.set(2,3);bt.encoding=THREE.sRGBEncoding;
 const cort=new THREE.MeshStandardMaterial({map:bt,bumpMap:bt,bumpScale:.03,color:0x8f8478,roughness:1});
 const objs=[];scene.traverse(o=>{if(o.isMesh&&o.visible&&!o.isInstancedMesh&&!Array.isArray(o.material)&&o.material.visible!==false&&!(o.material.transparent&&o.material.opacity<.2))objs.push(o);});
 const rc=new THREE.Raycaster(),suolo=(x,z)=>{rc.set(new THREE.Vector3(x,12,z),new THREE.Vector3(0,-1,0));rc.far=20;const h=rc.intersectObjects(objs,false).find(h=>h.face&&h.face.normal.y>.5);return h?h.point.y:0;};
 const leaves=[];const G=new THREE.Group();G.name='alberiVeri';scene.add(G);
 const ramo=(a,b,r0,r1)=>{const d=new THREE.Vector3().subVectors(b,a),L=d.length();const g=new THREE.CylinderGeometry(r1,r0,L,7);g.translate(0,L/2,0);const m=new THREE.Mesh(g,cort);m.position.copy(a);m.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());m.castShadow=true;G.add(m);};
 for(const [x,z,k] of ALBERI_MAPPA){const y0=suolo(x,z),H=(5.2+R()*2.2)*k*1.25,hc=H*.34,rt=.13*k+.05;
  // tronco un po' storto e rami principali che salgono nella chioma
  const t1=new THREE.Vector3(x+(R()-.5)*.25,y0+hc,z+(R()-.5)*.25);ramo(new THREE.Vector3(x,y0-.1,z),t1,rt*1.25,rt*.8);
  const cx=t1.x,cz=t1.z,cy=y0+hc+(H-hc)*.5,rx=H*.36,ry=(H-hc)*.55;const blob=[];const nb=7+Math.floor(R()*4);
  for(let i=0;i<nb;i++){const an=i/nb*6.28+R()*.6,dd=rx*(.35+R()*.3),c=new THREE.Vector3(cx+Math.cos(an)*dd,cy+(R()-.3)*ry*.6,cz+Math.sin(an)*dd);blob.push([c,rx*(.58+R()*.22)]);ramo(t1,c.clone().lerp(t1,.25),rt*.7,rt*.25);}
  blob.push([new THREE.Vector3(cx,cy+ry*.45,cz),rx*.6]);
  for(const [c,r] of blob){const n=Math.round(r*r*r*520);for(let i=0;i<n;i++){const u=R()*2-1,an=R()*6.28,sq=Math.sqrt(1-u*u),rr=r*Math.pow(.15+R()*.85,.35);const p=new THREE.Vector3(c.x+Math.cos(an)*sq*rr,c.y+u*rr*.85,c.z+Math.sin(an)*sq*rr);
   if(p.y<y0+hc*.9)continue;leaves.push([p,new THREE.Vector3().subVectors(p,c).normalize(),(p.y-(y0+hc))/(H-hc),rr/r]);}}
  // rami secondari dentro la chioma
  for(const [c,r] of blob)for(let j=0;j<3;j++){const e=new THREE.Vector3(c.x+(R()-.5)*r*1.4,c.y+(R()-.2)*r,c.z+(R()-.5)*r*1.4);ramo(c.clone().lerp(t1,.3),e,rt*.3,rt*.1);}}
 const im=new THREE.InstancedMesh(foglia,mf,leaves.length);const o=new THREE.Object3D(),col=new THREE.Color();
 leaves.forEach(([p,nn,top,dep],i)=>{o.position.copy(p);o.lookAt(p.x+nn.x,p.y+nn.y+.3,p.z+nn.z);o.rotateZ((R()-.5)*2.4);o.rotateX(-.4-R()*.6);const s=.8+R()*.6;o.scale.set(s,s,s);o.updateMatrix();im.setMatrixAt(i,o.matrix);
  const l=(.68+R()*.45)*(.7+.35*Math.max(0,Math.min(1,top)))*(.45+.6*dep),v=R();col.setRGB((v<.15?.09:.055)*l,(v<.15?.17:.14)*l,(v<.15?.05:.04)*l);im.setColorAt(i,col);});
 im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.castShadow=true;im.receiveShadow=true;G.add(im);console.log('alberiVeri',ALBERI_MAPPA.length,'foglie',leaves.length);}
// ---- modalita' Sera (Michele 14/10): cielo notturno blu con stelle, luna fredda al posto del sole, lampade accese con la loro luce,
// finestre illuminate da dentro con luce calda. Il pulsante "Sera" del sito prima cambiava solo la tavolozza e diventava tutto verde scuro.
function notteInit(){const btA=document.getElementById('dirA'),btB=document.getElementById('dirB');if(!btA||!btB)return;
 const hemi=scene.children.find(o=>o.isHemisphereLight),sun=scene.children.find(o=>o.isDirectionalLight);
 const giorno={bg:scene.background,fog:scene.fog?scene.fog.color.clone():null,hc:hemi&&hemi.color.clone(),hg:hemi&&hemi.groundColor.clone(),hi:hemi&&hemi.intensity,sc:sun&&sun.color.clone(),si:sun&&sun.intensity,sp:sun&&sun.position.clone(),ex:renderer.toneMappingExposure};
 const c=document.createElement('canvas');c.width=2048;c.height=1024;const x=c.getContext('2d'),g=x.createLinearGradient(0,0,0,1024);
 g.addColorStop(0,'#030916');g.addColorStop(.3,'#0a1a35');g.addColorStop(.47,'#1c3460');g.addColorStop(.5,'#26406b');g.addColorStop(1,'#0b1424');x.fillStyle=g;x.fillRect(0,0,2048,1024);
 let sd=5;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};for(let i=0;i<900;i++){const yy=R()*470,a=.25+R()*.75*(1-yy/520);x.fillStyle=`rgba(255,255,${235+R()*20|0},${a})`;const r=R()<.94?.8:1.6;x.fillRect(R()*2048,yy,r,r);}
 {const lx=1500,ly=170,lg=x.createRadialGradient(lx,ly,0,lx,ly,90);lg.addColorStop(0,'rgba(220,230,255,.35)');lg.addColorStop(1,'rgba(220,230,255,0)');x.fillStyle=lg;x.fillRect(lx-90,ly-90,180,180);x.fillStyle='#eef2ff';x.beginPath();x.arc(lx,ly,16,0,6.3);x.fill();}
 const cn=new THREE.CanvasTexture(c);cn.encoding=THREE.sRGBEncoding;cn.mapping=THREE.EquirectangularReflectionMapping;
 const luci=[];let fatto=false;
 const prepara=()=>{if(fatto)return;fatto=true;scene.updateMatrixWorld(true);const visti=new Set();
  scene.traverse(o=>{if(!o.isMesh||!o.material||Array.isArray(o.material)||!o.material.userData.lampada)return;const p=new THREE.Box3().setFromObject(o).getCenter(new THREE.Vector3());const k=p.toArray().map(v=>v.toFixed(1)).join();if(visti.has(k))return;visti.add(k);
   const L=new THREE.PointLight(0xffc27a,0,9,2);L.position.copy(p);L.position.y-=.08;scene.add(L);luci.push(L);});};
 const vetriLV=()=>{const out=[];for(const L of Object.values(window.LV||(typeof LV!=='undefined'?LV:{})))if(L.m&&L.m.glass)out.push(L.m.glass);return out;};
 const lampade=()=>{const s=new Set();scene.traverse(o=>{if(o.isMesh&&o.material&&!Array.isArray(o.material)&&o.material.userData.lampada)s.add(o.material);});return [...s];};
 const sera=(on)=>{prepara();(window.__seraHooks||[]).forEach(f=>f(on));
  if(on){scene.background=cn;if(scene.fog)scene.fog.color.set(0x0c1628);if(hemi){hemi.color.set(0x6b86c4);hemi.groundColor.set(0x1b2233);hemi.intensity=.42;}if(sun){sun.color.set(0xa9bcf0);sun.intensity=.32;sun.position.set(40,55,-20);}
   for(const m of vetriLV()){m.emissive.set(0xffb766);m.emissiveIntensity=1.15;m.envMapIntensity=.15;m.needsUpdate=true;}
   for(const m of lampade()){m.emissive.set(0xffd59a);m.emissiveIntensity=2.4;}for(const L of luci)L.intensity=2.2;}
  else{scene.background=giorno.bg;if(scene.fog&&giorno.fog)scene.fog.color.copy(giorno.fog);if(hemi){hemi.color.copy(giorno.hc);hemi.groundColor.copy(giorno.hg);hemi.intensity=giorno.hi;}if(sun){sun.color.copy(giorno.sc);sun.intensity=giorno.si;sun.position.copy(giorno.sp);}
   for(const m of vetriLV()){m.emissive.set(0x000000);m.emissiveIntensity=1;m.envMapIntensity=1.1;}for(const m of lampade()){m.emissive.set(0x2a2416);m.emissiveIntensity=1;}for(const L of luci)L.intensity=0;}};
 // il sito cambia la tavolozza al click; subito dopo si rimette la luce vera
 const dopo=on=>setTimeout(()=>{const P=document.body.classList.contains('dirB');sera(P);},30);
 btB.addEventListener('click',()=>dopo(true));btA.addEventListener('click',()=>dopo(false));window.seraFoto=sera;
 if(document.body.classList.contains('dirB'))sera(true);}
// ---- vista vera di Sacrofano tutto intorno (foto di Michele 14/10): immagine gia' pronta (texture/vista/pano-giorno.png e pano-notte.png,
// fatte con fase4 scratch pano.py dalle due foto), un solo cilindro a 360 gradi lontano 150 m; il browser deve solo caricarla.
// La notte si carica solo la prima volta che si preme Sera. Il prato tondo sotto il complesso non serve piu'.
function vistaVera(){
 // il prato tondo sotto il complesso prende il colore del bosco dello sfondo (Michele 14/10: niente piattaforma verde che non esiste)
 scene.traverse(o=>{if(!o.isMesh||!o.geometry||o.isInstancedMesh)return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;if(b.max.x-b.min.x>90&&b.max.z-b.min.z>90&&b.max.y<-2.3&&o.material&&o.material.color&&!o.material.isShaderMaterial){o.material.color.setRGB(.62,.6,.42);o.material.needsUpdate=true;}});
 const TLv=new THREE.TextureLoader(),carica=n=>{const t=TLv.load('texture/vista/'+n+'.webp?v=w1');t.encoding=THREE.sRGBEncoding;t.wrapS=THREE.RepeatWrapping;return t;};
 const P=8,HL=220,Ht=667,R=150,mpp=R*(Math.PI/180)/P,Hm=Ht*mpp,yH=4+5+R*Math.tan(2*Math.PI/180),yTop=yH+HL*mpp;
 const tx=carica('pano-giorno');let tn=null;const notte=()=>tn||(tn=carica('pano-notte'));
 const g=new THREE.CylinderGeometry(R,R,Hm,96,1,true,-Math.PI,Math.PI*2);const m=new THREE.MeshBasicMaterial({map:tx,side:THREE.BackSide,transparent:true,depthWrite:false,fog:false});
 const o=new THREE.Mesh(g,m);o.position.set(0,yTop-Hm/2,10);o.renderOrder=-1;o.name='vistaVera';scene.add(o);
 (window.__seraHooks=window.__seraHooks||[]).push(on=>{m.map=on?notte():tx;m.needsUpdate=true;});if(document.body.classList.contains('dirB'))m.map=notte();console.log('vistaVera immagine pronta');}
// ---- limiti della vista, versione leggera (Michele 14/10): niente sotto terra, niente dentro gli edifici, niente sguardo sotto il paesaggio.
// Nessun calcolo pesante: solo confronti con le sagome in pianta degli edifici (poche decine di punti), fatti quando la camera si muove.
function limitiVista(){const M=SACROFANO_MODEL;controls.maxPolarAngle=Math.PI*.44;controls.minDistance=10;
 const inP=(pl,x,z)=>{let c=false;for(let i=0,k=pl.length-1;i<pl.length;k=i++){const [x1,z1]=pl[i],[x2,z2]=pl[k];if((z1>z)!=(z2>z)&&x<(x2-x1)*(z-z1)/(z2-z1)+x1)c=!c;}return c;};
 // sagome degli edifici con l'altezza minima della camera sopra di loro (un paio di metri sopra il colmo di quel corpo)
 const sag=[];const fp=L=>{const f=L&&L.footprint;return f?(Array.isArray(f[0][0])?f:[f]):[];};
 const lv=id=>M.levels.find(l=>l.id===id);
 for(const p of fp(lv('2')))sag.push([p,13.5]);for(const p of fp(lv('1')))sag.push([p,10.5]);for(const p of fp(lv('T')))sag.push([p,7]);if(M.B)for(const p of fp(M.B))sag.push([p,5.5]);
 let dentro=false;const correggi=()=>{if(dentro)return;dentro=true;const c=camera.position;
  if(c.y<1.6)c.y=1.6;let min=0;for(const [p,h] of sag)if(h>min&&inP(p,c.x,c.z))min=h;if(c.y<min)c.y=min;
  if(controls.target.y<-1)controls.target.y=-1;dentro=false;};
 controls.addEventListener('change',correggi);console.log('limitiVista leggero',sag.length);}
// ---- vegetazione leggera senza togliere foglie (Michele 14/10): (1) ogni blocco grande di foglie/erba diviso in pezzi di 6 m, cosi' la scheda
// video disegna solo i pezzi inquadrati; (2) da lontano un pezzo disegna solo una parte delle sue foglie (sono mescolate, quindi resta uniforme),
// da vicino tutte; (3) le singole foglie e i ciuffi non fanno ombra: l'ombra la fa un volume invisibile per ogni pezzo di siepe o albero
function ottimizzaVerde(){scene.updateMatrixWorld(true);const grandi=[];scene.traverse(o=>{if(o.isInstancedMesh&&o.count>3000)grandi.push(o);});
 const ombra=new THREE.MeshBasicMaterial({colorWrite:false,depthWrite:false}),CELL=6,pezzi=[];let tot=0;
 const m4=new THREE.Matrix4(),p=new THREE.Vector3(),q=new THREE.Quaternion(),sc=new THREE.Vector3(),col=new THREE.Color();
 for(const im of grandi){const erba=!im.castShadow||/ciuff|erba/i.test(im.name||'');const celle=new Map();
  for(let i=0;i<im.count;i++){im.getMatrixAt(i,m4);m4.premultiply(im.matrixWorld);p.setFromMatrixPosition(m4);const k=Math.floor(p.x/CELL)+','+Math.floor(p.z/CELL);if(!celle.has(k))celle.set(k,[]);celle.get(k).push(i);}
  for(const idx of celle.values()){for(let i=idx.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[idx[i],idx[j]]=[idx[j],idx[i]];}
   const g=new THREE.BufferGeometry();for(const n in im.geometry.attributes)g.setAttribute(n,im.geometry.attributes[n]);g.index=im.geometry.index;
   const c=new THREE.InstancedMesh(g,im.material,idx.length);const box=new THREE.Box3();
   idx.forEach((i,n)=>{im.getMatrixAt(i,m4);m4.premultiply(im.matrixWorld);c.setMatrixAt(n,m4);p.setFromMatrixPosition(m4);box.expandByPoint(p);if(im.instanceColor){im.getColorAt(i,col);c.setColorAt(n,col);}});
   box.expandByScalar(.3);g.boundingSphere=box.getBoundingSphere(new THREE.Sphere());g.boundingBox=box.clone();
   c.castShadow=false;c.receiveShadow=im.receiveShadow;c.frustumCulled=true;c.userData.pieno=idx.length;c.userData.centro=g.boundingSphere.center.clone();scene.add(c);pezzi.push(c);tot+=idx.length;
   if(!erba&&im.castShadow){const s=box.getSize(new THREE.Vector3()),ctr=box.getCenter(new THREE.Vector3());const v=new THREE.Mesh(new THREE.BoxGeometry(s.x*.85,s.y*.9,s.z*.85),ombra);v.position.copy(ctr);v.castShadow=true;v.receiveShadow=false;scene.add(v);}}
  im.visible=false;im.parent&&im.parent.remove(im);if(im.dispose)im.dispose();}
 // dettaglio con la distanza: tutte le foglie entro 22 m, poi sempre meno fino a un terzo oltre 55 m
 const prev=scene.onBeforeRender;scene.onBeforeRender=function(r,s,cam){if(prev)prev.apply(this,arguments);for(const c of pezzi){const d=cam.position.distanceTo(c.userData.centro),f=d<22?1:d>55?.33:1-.67*(d-22)/33;c.count=Math.max(1,Math.round(c.userData.pieno*f));}};
 console.log('ottimizzaVerde blocchi',grandi.length,'pezzi',pezzi.length,'istanze',tot);}
// ---- granito grigio chiaro dappertutto (Michele 13/10, dopo la copertina dell'11): copertine, gradini e zoccoli
// prendono la pietra della copertina dell'11; i pavimenti grigi diventano lastre 60 x 40 dello stesso granito
function granitoLastre(){if(cache.granL)return cache.granL;const P=pietraScala(),W=1024,c=document.createElement('canvas'),b=document.createElement('canvas');c.width=c.height=b.width=b.height=W;
 const x=c.getContext('2d'),y=b.getContext('2d'),N=3;for(let i=0;i<N;i++)for(let k=0;k<N;k++){x.drawImage(P.map.image,i*W/N,k*W/N,W/N,W/N);y.drawImage(P.bumpMap.image,i*W/N,k*W/N,W/N,W/N);}
 const tw=W/4,th=W/6;let sd=5;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 for(let r=0;r<6;r++)for(let k=-1;k<5;k++){const v=R()*.08-.04;x.fillStyle=v>0?`rgba(255,255,255,${v})`:`rgba(0,0,0,${-v})`;x.fillRect(k*tw+(r%2?tw/2:0),r*th,tw,th);}
 for(const [z,col,lw] of [[x,'rgba(95,96,98,.9)',2.2],[y,'rgb(40,40,40)',3]]){z.strokeStyle=col;z.lineWidth=lw;for(let r=0;r<=6;r++){z.beginPath();z.moveTo(0,r*th);z.lineTo(W,r*th);z.stroke();}
  for(let r=0;r<6;r++)for(let k=-1;k<6;k++){const xx=k*tw+(r%2?tw/2:0);z.beginPath();z.moveTo(xx,r*th);z.lineTo(xx,(r+1)*th);z.stroke();}}
 const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.encoding=THREE.sRGBEncoding;t.anisotropy=8;
 const bt=new THREE.CanvasTexture(b);bt.wrapS=bt.wrapT=THREE.RepeatWrapping;bt.anisotropy=8;return cache.granL={map:t,bump:bt};}
function granito(){
 scene.updateMatrixWorld(true);const G=pietraScala(),L=granitoLastre(),fatti=new Set();let nc=0,np=0;
 scene.traverse(o=>{if(!o.isMesh||Array.isArray(o.material)||!o.material||!o.material.color)return;const m=o.material;
  const or=m.userData&&m.userData.orig&&m.userData.orig.isMaterial?m.userData.orig.color.getHexString():'';
  if(['d2d0c7','b9b6ad','a8a49b'].includes(or)&&m.isMeshStandardMaterial){if(!fatti.has(m)){fatti.add(m);m.map=L.map;m.bumpMap=L.bump;m.bumpScale=.012;m.color.set(0xd4d6d8);m.roughness=.88;m.needsUpdate=true;}np++;return;}
  const h=m.color.getHexString();if(!['9c9a92','55585b','5e6064','9a988f','c7c3b8','7b7d81'].includes(h))return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;
  o.material=G;o.geometry.userData.fotoUV=false;uvFoto(o,.9);nc++;});
 console.log('granito: copertine',nc,'pavimenti',np);}
// ---- vasi con cespugli lungo la rete del camminamento dietro il 9 (Michele 13/10): solo dove c'e' la rete, dal lato del camminamento,
// attaccati alla rete; vasi di cotto con piante basse tonde, in cima all'altezza della rete (0,80)
function vasi9(){
 const y0=2.94,H=.8,cotto=new THREE.MeshStandardMaterial({color:0xa65a3a,roughness:.85}),bordo=new THREE.MeshStandardMaterial({color:0x8f4a2e,roughness:.85}),terra=new THREE.MeshStandardMaterial({color:0x3b2a1e,roughness:1});
 const verdi=[0x3f6b35,0x4a7a3c,0x365e2e,0x557f40].map(c=>new THREE.MeshStandardMaterial({color:c,roughness:.9,flatShading:true}));
 let sd=91;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};const G=new THREE.Group();
 const pianta=(x,z)=>{const p=new THREE.Mesh(new THREE.CylinderGeometry(.2,.15,.32,20),cotto);p.position.set(x,y0+.16,z);G.add(p);
  const b=new THREE.Mesh(new THREE.TorusGeometry(.19,.022,8,24),bordo);b.rotation.x=Math.PI/2;b.position.set(x,y0+.315,z);G.add(b);
  const t=new THREE.Mesh(new THREE.CircleGeometry(.18,20),terra);t.rotation.x=-Math.PI/2;t.position.set(x,y0+.3,z);G.add(t);
  for(let k=0;k<5;k++){const r=.12+R()*.05,g=new THREE.IcosahedronGeometry(r,1),ps=g.attributes.position;for(let i=0;i<ps.count;i++){const f=.85+R()*.3;ps.setXYZ(i,ps.getX(i)*f,ps.getY(i)*f,ps.getZ(i)*f);}g.computeVertexNormals();
   const m=new THREE.Mesh(g,verdi[(R()*4)|0]);const a=R()*Math.PI*2,d=k?.08+R()*.05:0,yc=k?y0+.32+r*.9:y0+H-r;m.position.set(x+Math.cos(a)*d,Math.min(yc,y0+H-r*.9),z+Math.sin(a)*d);m.castShadow=true;G.add(m);}};
 const off=.24;
 // rete lunga (11,55;-10,1)-(26,6;-9,6): il camminamento sta dal lato di z minore
 {const [ax,az,bx,bz]=[11.55,-10.1,26.6,-9.6],L=Math.hypot(bx-ax,bz-az);for(let s=.3;s<=L-.25;s+=.48){const t=s/L;pianta(ax+(bx-ax)*t,az+(bz-az)*t-off);}}
 // tratto corto (11,55;-8,35)-(11,55;-10,1): camminamento dal lato di x minore
 for(let z=-8.6;z>=-9.9;z-=.48)pianta(11.55-off,z);
 G.traverse(o=>{if(o.isMesh)o.receiveShadow=true;});scene.add(G);console.log('vasi9',G.children.length);}
// ---- camino 2-3 come la foto di Michele (13/10): in cima comignolo di tre lastre grigie sovrapposte, distanziate da piccoli pilastrini, niente girandola
function caminoLastre(cx,cz,w,d){
 scene.updateMatrixWorld(true);let body=null;scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3());
  if(Math.abs(c.x-cx)>.1||Math.abs(c.z-cz)>.1)return;if(Math.abs(b.max.x-b.min.x-w)<.02&&Math.abs(b.max.z-b.min.z-d)<.02&&b.max.y-b.min.y>.8){if(!body||b.max.y>new THREE.Box3().setFromObject(body).max.y)body=o;}});
 if(!body)return;const top=new THREE.Box3().setFromObject(body).max.y,par=body.parent;
 scene.traverse(o=>{if(!o.isMesh||o===body)return;const b=new THREE.Box3().setFromObject(o);if(b.min.y>top-.02&&b.max.y<top+.6&&b.min.x>cx-w/2-.2&&b.max.x<cx+w/2+.2&&b.min.z>cz-d/2-.2&&b.max.z<cz+d/2+.2)o.visible=false;});
 const G=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0x1f2124,roughness:.85,metalness:0});let y=top;
 for(let k=0;k<3;k++){for(const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]]){const p=new THREE.Mesh(new THREE.BoxGeometry(.06,.05,.06),m);p.position.set(cx+sx*(w/2-.05),y+.025,cz+sz*(d/2-.05));G.add(p);}
  y+=.05;const l=new THREE.Mesh(new THREE.BoxGeometry(w+.16,.08,d+.16),m);l.position.set(cx,y+.04,cz);l.castShadow=l.receiveShadow=true;G.add(l);y+=.08;}
 scene.add(G);G.updateMatrixWorld(true);par.attach(G);}
// ---- camino del secondo piano (x -4,05) come la foto di Michele (13/10): comignolo in cotto (stesso colore dei coppi, senza texture) con due aperture vuote per lato e tettino a due falde
function caminoTettoina(cx,cz,w,d){
 scene.updateMatrixWorld(true);let body=null;scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3());
  if(Math.abs(c.x-cx)>.1||Math.abs(c.z-cz)>.1)return;if(Math.abs(b.max.x-b.min.x-w)<.02&&Math.abs(b.max.z-b.min.z-d)<.02&&b.max.y-b.min.y>.8){if(!body||b.max.y>new THREE.Box3().setFromObject(body).max.y)body=o;}});
 if(!body)return;const top=new THREE.Box3().setFromObject(body).max.y,par=body.parent;
 scene.traverse(o=>{if(!o.isMesh||o===body)return;const b=new THREE.Box3().setFromObject(o);if(b.min.y>top-.02&&b.max.y<top+.6&&b.min.x>cx-w/2-.2&&b.max.x<cx+w/2+.2&&b.min.z>cz-d/2-.2&&b.max.z<cz+d/2+.2)o.visible=false;});
 const G=new THREE.Group(),m=new THREE.MeshStandardMaterial({color:0x1a0803,roughness:.9,metalness:0}),coppo=new THREE.MeshStandardMaterial({map:tex('clay_roof_tiles','diff',true),color:0xffffff,roughness:.85,side:THREE.DoubleSide});
 const B=(a,b,c,x,y,z,mm)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),mm||m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;G.add(o);return o;};
 const W=w+.04,D=d+.04,h=.3,t=.05;
 B(W+.04,.05,D+.04,cx,top+.025,cz);                                   // cordolo di base in cotto
 const y0=top+.05;
 // pilastrini in cotto: spigoli e un montante centrale per lato, fra loro aperture vuote (si vede attraverso)
 for(const [sx,sz] of [[-1,-1],[1,-1],[-1,1],[1,1]])B(t*1.6,h,t*1.6,cx+sx*(W/2-t*.8),y0+h/2,cz+sz*(D/2-t*.8));
 B(t,h,t*1.6,cx,y0+h/2,cz-D/2+t*.8);B(t,h,t*1.6,cx,y0+h/2,cz+D/2-t*.8);
 B(t*1.6,h,t,cx-W/2+t*.8,y0+h/2,cz);B(t*1.6,h,t,cx+W/2-t*.8,y0+h/2,cz);
 B(W+.06,.04,D+.06,cx,y0+h+.02,cz);                                     // piano d'appoggio
 // tettino a due falde in coppi appoggiato esattamente sul cotto: il lato inferiore delle falde passa per il bordo del piano e per il colmo,
 // i timpani in cotto riempiono tutto lo spazio sotto le falde (niente fessure)
 const yb=y0+h+.04,L=D+.2,hw=W/2+.13,rise=.14,sl=Math.hypot(hw,rise),ang=Math.atan2(rise,hw),th=.035,b=W/2+.03;
 for(const sgn of [-1,1]){const f=B(sl,th,L,0,0,cz,coppo);f.rotation.z=-sgn*ang;f.position.set(cx+sgn*hw/2+sgn*Math.sin(ang)*th/2,yb+rise/2+Math.cos(ang)*th/2,cz);}
 for(const sgn of [-1,1]){const sh=new THREE.Shape(),yy=rise*(1-b/hw);sh.moveTo(-b,0);sh.lineTo(b,0);sh.lineTo(b,yy);sh.lineTo(0,rise);sh.lineTo(-b,yy);sh.closePath();
  const g=new THREE.ExtrudeGeometry(sh,{depth:.03,bevelEnabled:false});g.translate(0,0,-.015);const o=new THREE.Mesh(g,m);o.position.set(cx,yb,cz+sgn*(D/2+.015));o.castShadow=true;G.add(o);}
 B(.07,.05,L+.02,cx,yb+rise+th+.012,cz,coppo);                          // colmo
 scene.add(G);G.updateMatrixWorld(true);par.attach(G);}
// ---- appartamento 10 come il video IMG_4637 (Michele 13/10): porta a vetri in PVC come l'8 (un'anta), copertina grigia sul muretto del terrazzo, zoccolo di pietra grigia
function dieci(){scene.updateMatrixWorld(true);const top=o=>{let t=o;while(t.parent&&t.parent!==scene)t=t.parent;return t;};
 const rel=o=>{const t=top(o);if(!o.geometry.boundingBox)o.geometry.computeBoundingBox();const m=new THREE.Matrix4().copy(t.matrixWorld).invert().multiply(o.matrixWorld);return o.geometry.boundingBox.clone().applyMatrix4(m);};
 const sp=[];scene.traverse(o=>{if(!o.isMesh||!o.visible||!o.parent||!o.parent.isGroup||top(o)===o)return;if(Math.abs(top(o).position.y-2.9)>.5)return;const b=rel(o);if(b.isEmpty())return;if(b.min.x>6.15&&b.max.x<7.0&&b.min.z>4.2&&b.max.z<4.75&&b.max.y<2.7&&b.min.y>.2)sp.push(o);});
 const gi=sp.findIndex(o=>{const b=rel(o);return b.max.x-b.min.x>.6&&b.max.y-b.min.y>2;});console.log('dieci porta',sp.length,gi);
 if(gi>=0){const g=rel(sp[gi]),t0=top(sp[gi]);sp.forEach((o,k)=>{if(k!==gi)o.visible=false;});portaPVC(t0,g.min.x,g.max.x,g.min.y,g.max.y,g.max.z);}
 const gres=new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.7,metalness:0,color:0x55585b}),pietra=new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.8,metalness:0,color:0x5e6064});
 const add=(a,b,c,x,y,z,m)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(a,b,c),m);o.position.set(x,y,z);o.castShadow=o.receiveShadow=true;scene.add(o);};
 add(4.84-1.62,.095,.51,(1.62+4.84)/2,3.75+.0475,(6.77+7.28)/2,gres);// fino al filo esterno della scala dell'8, a filo del muro alto           // copertina del muretto
 const y=3.2+.08,h=.16,t=.02;                                                    // zoccolo alto 10 cm alla base dei muri del terrazzo
 add(6.17-1.63,h,t,(1.63+6.17)/2,y,4.75+t/2,pietra);
 add(t,h,6.8-4.75,1.63+t/2,y,(4.75+6.8)/2,pietra);
 add(4.68-1.63,h,t,(1.63+4.68)/2,y,6.8-t/2,pietra);
 add(t,h,7.0-5.95,7.16-t/2,y,(5.95+7.0)/2,pietra);
 // copertina grigia uniforme anche sul muro lungo davanti all'11 e sul muro della scala dell'8 verso il pianerottolo (Michele 13/10)
 scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o);if(b.isEmpty())return;if(Math.abs(b.min.x+6.23)<.05&&Math.abs(b.max.x-1.62)<.05&&b.min.y>4.5&&b.max.y<4.65&&b.min.z>6.85)o.visible=false;});
 // copertina larga di granito grigio sul muretto del terrazzo dell'11 (foto dell'11, Michele 13/10)
 {const g=new THREE.Mesh(new THREE.BoxGeometry(1.62+6.23,.06,.5),pietraScala());g.position.set((1.62-6.23)/2,4.55+.03,7.08);g.castShadow=g.receiveShadow=true;scene.add(g);g.updateMatrixWorld(true);uvFoto(g,.9);}
 add(.22,.045,10.5-7.28,4.73,3.8+.0225,(7.28+10.5)/2,gres);// stessa quota della copertina del 10, si attacca senza sovrapporsi
 console.log('dieci',sp.length);}
function otto(){// muro a destra della scala: una sola parete bianca liscia fino al parapetto del terrazzo (Michele 13/10)
 {let mw=null;scene.traverse(o=>{if(!mw&&o.isMesh&&o.material&&o.material.userData&&o.material.userData.orig&&o.material.userData.orig.isMaterial&&o.material.userData.orig.color.getHexString()==='d8d4c7')mw=o.material;});
  if(mw){const g=new THREE.PlaneGeometry(3.05,3.75);const m2=mw.clone();m2.side=THREE.DoubleSide;m2.userData={};const w=new THREE.Mesh(g,m2);w.rotation.y=-Math.PI/2;w.position.set(5.693,1.875,12.025);w.receiveShadow=true;scene.add(w);uvFoto(w,1.5);
   // parapetto destro in basso: un solo pezzo pieno a filo della parete, la cima segue la scala (Michele 13/10)
   scene.traverse(o=>{if(!o.isMesh)return;const b=new THREE.Box3().setFromObject(o);if(Math.abs(b.min.x-5.70)<.03&&Math.abs(b.max.x-5.84)<.03&&b.max.y>3.7)o.visible=false;});
   const sh=new THREE.Shape();sh.moveTo(13.55,.7);sh.lineTo(14.25,.7);sh.lineTo(14.25,1.0);sh.lineTo(13.55,1.51);sh.closePath();
   const ge=new THREE.ExtrudeGeometry(sh,{depth:.15,bevelEnabled:false});ge.rotateY(-Math.PI/2);const pz=new THREE.Mesh(ge,m2);pz.position.set(5.843,0,0);pz.castShadow=pz.receiveShadow=true;pz.visible=false;scene.add(pz);
   // angolo fra il muro a destra della scala e la facciata del palazzo: un solo spigolo pieno, a filo della facciata (z 13,57) (Michele 13/10)
   {const ang=new THREE.Mesh(new THREE.BoxGeometry(.12,3.75,.2),m2);ang.position.set(5.753,1.875,13.47);ang.castShadow=ang.receiveShadow=true;scene.add(ang);uvFoto(ang,1.5);}
   // facciata sopra il pianterreno (bordo del solaio + parapetto del terrazzo): una sola pelle a filo della facciata sotto, niente righe ne' scalini (Michele 13/10)
   {const pf=new THREE.Mesh(new THREE.PlaneGeometry(12.06-5.693,3.75-2.55),m2);pf.position.set((5.693+12.06)/2,(2.55+3.75)/2,13.5715);pf.receiveShadow=true;scene.add(pf);uvFoto(pf,1.5);
    const ps=new THREE.Mesh(new THREE.PlaneGeometry(13.57-9.55,3.75-2.55),m2);ps.rotation.y=Math.PI/2;ps.position.set(12.0615,(2.55+3.75)/2,(9.55+13.57)/2);ps.receiveShadow=true;scene.add(ps);uvFoto(ps,1.5);}
   const tp=new THREE.Mesh(new THREE.BoxGeometry(.08,1.1,.16),m2);tp.position.set(5.733,3.2,13.475);scene.add(tp);uvFoto(tp,1.5);}}
const ml=pietraScala();
 let mb=null;const gr=[];scene.traverse(o=>{if(!mb&&o.isMesh&&o.material&&o.material.userData&&o.material.userData.orig&&o.material.userData.orig.isMaterial&&o.material.userData.orig.color.getHexString()==='d8d4c7'){mb=o.material.clone();mb.userData={};}});
 scene.traverse(o=>{if(!o.isMesh||o.geometry.type!=='BoxGeometry'||!o.material.color||o.material.color.getHexString()!=='c7c3b8')return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3());if(c.x>4.5&&c.x<6.4&&c.z>9.3&&c.z<14.6){if(b.max.y-b.min.y>.2||b.max.z-b.min.z>.5)return;o.material=ml;if(b.max.y<.7){o.visible=false;return;}const xr=c.z>10.5?Math.min(b.max.x,5.693):b.max.x,sx=xr-b.min.x,sz=b.max.z-b.min.z,top=b.max.y>2.85?2.935:b.max.y,h=b.max.y>2.85?.23:.19;o.geometry=new THREE.BoxGeometry(sx,h,sz);c.x=(b.min.x+xr)/2;if(mb){o.material=[mb,ml,ml,ml,ml,ml];o.userData.pietraMista=1;}o.rotation.set(0,0,0);o.scale.set(1,1,1);o.position.set(c.x,top-h/2,c.z);gr.push([b.min.x,b.max.x,b.max.z,top-h]);}});
 // vecchia rampa inclinata del modello (sporgeva in basso dietro il pianerottolo come un listello obliquo): via, c'e' la soletta (Michele 13/10)
 scene.traverse(o=>{if(!o.isMesh||o.geometry.type!=='BoxGeometry'||!o.material.color||o.material.color.getHexString()!=='c7c3b8')return;const b=new THREE.Box3().setFromObject(o);if(b.min.x>4.6&&b.max.x<5.9&&b.max.z-b.min.z>3&&b.max.y-b.min.y>2)o.visible=false;});
 // soletta sottile inclinata sotto i gradini: niente fessure e niente sottoscala pieno (Michele 13/10)
 if(gr.length>1&&mb){gr.sort((p,q)=>q[2]-p[2]);const A=gr[0],B=gr[gr.length-1],dz=A[2]-B[2],dy=B[3]-A[3],L=Math.hypot(dz,dy),t=.12,f=Math.atan2(dy,dz),nY=Math.cos(f),nZ=Math.sin(f),sx=A[1]-A[0];renderer.localClippingEnabled=true;const msl=mb.clone();msl.userData={orig:mb.userData.orig};msl.clippingPlanes=[new THREE.Plane(new THREE.Vector3(0,1,0),-.66)];const sl=new THREE.Mesh(new THREE.BoxGeometry(sx,t,L+.3),msl);sl.rotation.x=f;sl.position.set((A[0]+A[1])/2,(A[3]+B[3])/2-nY*t/2+.02,(A[2]+B[2])/2-nZ*t/2);sl.castShadow=sl.receiveShadow=true;scene.add(sl);uvFoto(sl,1.5);}
 // i due gradini in fondo al pianerottolo: stesso gres della scala, pieni fino al pianerottolo (Michele 13/10)
 scene.traverse(o=>{if(!o.isMesh||o.geometry.type!=='BoxGeometry'||!o.material.color||o.material.color.getHexString()!=='c7c3b8')return;const b=new THREE.Box3().setFromObject(o),c=b.getCenter(new THREE.Vector3());if(c.x>4.7&&c.x<5.8&&c.z>5.9&&c.z<6.7&&b.min.y>2.6&&b.min.y<2.7&&b.max.y<3.1){o.visible=false;return;}if(c.x>4.7&&c.x<5.8&&c.z>5.9&&c.z<6.7&&b.min.y>2.8&&b.max.y<3.3){const h=(b.max.y>3.15?3.255:b.max.y)-2.9;{let mt=null;scene.traverse(q=>{if(!mt&&q.isMesh&&q.material&&q.material.isMeshStandardMaterial&&q.material.userData&&q.material.userData.orig&&q.material.userData.orig.isMaterial&&q.material.userData.orig.color.getHexString()==='d2d0c7')mt=q.material;});o.material=mt||ml;}// stesso gres del terrazzo del 10 (Michele 13/10)
 o.geometry=new THREE.BoxGeometry(b.max.x-b.min.x,h,b.max.z-b.min.z);o.rotation.set(0,0,0);o.scale.set(1,1,1);o.position.set(c.x,2.9+h/2,c.z);o.updateMatrixWorld(true);uvFoto(o,2.4);}});
 // camino dell'8 come nel video (IMG_4597 15-17 s e 23-24 s): fascia di lamiera d'acciaio in cima, aspiratore a girandola scuro, lampada tonda con vetro avorio rigato (Michele 13/10)
 caminoVideo(8.76,13.795,.55,.45,{faccia:-1});
 // camino sud del 9 come l'8: lamiera lucida e girandola, senza lampada (Michele 13/10)
 caminoVideo(15.0,1.54,.75,.6,null,.34);
 caminoLastre(-14.58,10.735,.65,.66);
 caminoTettoina(-4.05,.15,.5,.5);
 // tutti gli altri camini come quello del 9 (Michele 13/10): lamiera lucida e girandola, ognuno con le sue misure
 for(const [x,z,w,d] of [[-10.03,1.5,.5,.5],[-10.85,8.45,.5,.5],[6.6,1.5,.55,.55],[5.335,3.9,.55,.55]])caminoVideo(x,z,w,d,null,Math.min(w,d)*.62);
 // pianerottolo in cima alla scala: stesso gres del terrazzo (Michele 13/10)
 {let mp=null;scene.traverse(o=>{if(!mp&&o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&o.material.userData&&o.material.userData.orig&&o.material.userData.orig.isMaterial&&o.material.userData.orig.color.getHexString()==='d2d0c7')mp=o.material;});
  if(mp)scene.traverse(o=>{if(!o.isMesh||o.geometry.type!=='ExtrudeGeometry'||!o.material.color||o.material.color.getHexString()!=='c7c3b8')return;const b=new THREE.Box3().setFromObject(o);if(Math.abs(b.min.x-4.72)<.05&&Math.abs(b.max.z-10.5)<.05&&b.max.y>2.9&&b.max.y<2.96){o.material=mp;uvFoto(o,2.4);}});}
 // ingresso della scala dell'8: sotto la quota del muretto di tufo (70 cm) niente gradini e niente fianchi bianchi, due blocchi grandi tipo lastre d'ingresso (Michele 13/10)
 {// DWG piano terra + Tav2 (Michele 13/10): la scala scende su un pianerottolo, poi 4 alzate verso ovest (a destra per chi scende)
  const z0=13.38,z1=14.90,h=.645/4,pz=[[4.725,5.693,4*h],[4.425,4.725,3*h],[4.125,4.425,2*h],[3.825,4.125,h]];
  const fb=mb||ml,mm=[fb,ml,ml,ml,fb,ml];for(const [xa,xb,t] of pz){const k=new THREE.Mesh(new THREE.BoxGeometry(xb-xa,t,z1-z0),mm);k.userData.pietraMista=1;k.position.set((xa+xb)/2,t/2,(z0+z1)/2);k.castShadow=k.receiveShadow=true;scene.add(k);}
  renderer.localClippingEnabled=true;const cp=[new THREE.Plane(new THREE.Vector3(0,0,-1),13.375)];
  scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const b=new THREE.Box3().setFromObject(o);if(Math.abs(b.min.x-4.66)<.03&&Math.abs(b.max.x-4.8)<.03&&b.max.z>14&&b.min.z<11){const om=o.material;o.material=om.clone();o.material.userData={orig:om.userData.orig,lucido:om.userData.lucido};o.material.clippingPlanes=cp;o.material.side=THREE.DoubleSide;
   if(mb){const c2=new THREE.Mesh(new THREE.BoxGeometry(.14,1.55,.012),mb);c2.position.set(4.73,.775,13.381);scene.add(c2);uvFoto(c2,1.5);}
   // copertina grigia sul fianco sinistro, inclinata come la scala (foto di Michele 13/10)
   {const z0=10.5,y0=3.8,z1=13.375,y1=1.547,L=Math.hypot(z1-z0,y1-y0),cp2=new THREE.Mesh(new THREE.BoxGeometry(.22,.045,L+.02),new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.7,metalness:0,color:0x55585b}));cp2.rotation.x=Math.atan2(y0-y1,z1-z0);cp2.position.set(4.73,(y0+y1)/2+.022,(z0+z1)/2);cp2.castShadow=cp2.receiveShadow=true;scene.add(cp2);}}});}
 scene.updateMatrixWorld(true);scene.traverse(o=>{if(o.isMesh&&(o.material===ml||o.userData.pietraMista))uvFoto(o,.9);});
 const mc=new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.7,metalness:0,color:0x55585b}),y=3.77;
 for(const [x0,z0,x1,z1] of [[5.67,13.46,12.08,13.46],[5.84,10.5,5.84,13.3],[11.97,9.6,11.97,13.55]]){const L=Math.hypot(x1-x0,z1-z0),o=new THREE.Mesh(new THREE.BoxGeometry(x0===x1?(x0<6?.34:.22):L,.045,x0===x1?L:.3),mc);o.position.set((x0+x1)/2,y,(z0+z1)/2);o.castShadow=o.receiveShadow=true;scene.add(o);}}
// ---- lastre del giardino come nel video IMG_5073 8,5 s: blocchetti di cemento grigio chiaro poroso, spigoli smussati, quasi a filo del prato
function lastre(){
 // lastre come nel video IMG_5073 8,5 s: cemento grigio chiaro poroso, spigoli smussati, quasi a filo del prato.
 // Michele 12/10: meno ma più grandi, a passo regolare. Si ricava il percorso dalle pietre del modello e si ridistribuisce.
 // stessa pietra dei pavimenti dei terrazzi (large_grey_tiles, stessa tinta): come pezzi staccati di quel pavimento (Michele 12/10)
 const mt=new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.75,metalness:0,color:0x7b7d81});  // lastra unica, senza fughe (Michele 12/10)
 const vecchie=[];scene.traverse(o=>{if(!o.isMesh)return;const m=o.material,g=o.geometry;if(!m||Array.isArray(m)||!m.color||m.color.getHexString()!=='9c9a94'||!g.parameters||Math.abs(g.parameters.height-.05)>1e-4)return;vecchie.push(o);});
 // percorsi: pietre consecutive (ordine del modello) a meno di 1,1 m
 const percorsi=[],sesto=[];let cur=[];for(const o of vecchie){const p=o.getWorldPosition(new THREE.Vector3());if(p.x>12.9&&p.x<16.5&&p.z>8.5&&p.z<9.6){sesto.push(p);o.visible=false;continue;}if(cur.length&&cur[cur.length-1].distanceTo(p)>1.1){percorsi.push(cur);cur=[];}cur.push(p);o.visible=false;}if(cur.length)percorsi.push(cur);
 const scure=new THREE.MeshStandardMaterial({map:gresUnica(),roughness:.85,metalness:0,color:0x46484b});for(const o of vecchie){const p=o.position;if(p.x>1.6&&p.x<4.9&&p.z>7.4&&p.z<13.4){o.visible=true;o.material=scure;o.position.y+=.05;o.castShadow=o.receiveShadow=true;}}
 const SX=.5,SZ=.7,PASSO=.82,b=.012,sh=new THREE.Shape();sh.moveTo(-SX/2+b,-SZ/2+b);sh.lineTo(SX/2-b,-SZ/2+b);sh.lineTo(SX/2-b,SZ/2-b);sh.lineTo(-SX/2+b,SZ/2-b);
 const e=new THREE.ExtrudeGeometry(sh,{depth:.05,bevelEnabled:true,bevelThickness:.012,bevelSize:b,bevelSegments:2});e.rotateX(-Math.PI/2);e.translate(0,-.04,0);
 {const p=e.attributes.position,uv=new Float32Array(p.count*2);for(let i=0;i<p.count;i++){uv[i*2]=p.getX(i)/3+.17;uv[i*2+1]=p.getZ(i)/3+.21;}e.setAttribute('uv',new THREE.BufferAttribute(uv,2));e.computeVertexNormals();}
 let sd=5;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};const tenute=[];let n=0;
 for(const pts of percorsi){if(pts.length<2)continue;const seg=[];let L=0;for(let k=1;k<pts.length;k++){const d=pts[k].distanceTo(pts[k-1]);seg.push(d);L+=d;}
  for(let t=PASSO/2;t<=L-PASSO/4+1e-6;t+=PASSO){let a=t,k=0;while(k<seg.length-1&&a>seg[k]){a-=seg[k];k++;}const A=pts[k],B=pts[k+1],f=Math.min(1,a/seg[k]);
   const p=A.clone().lerp(B,f);if(p.x>1.6&&p.x<4.9&&p.z>7.4&&p.z<13.4)continue;if(tenute.some(q=>q.distanceTo(p)<.6))continue;if(p.x>-18.95&&p.x<-17.5&&p.z>-11.6&&p.z<3)continue;if(GRIGLIATI.length&&p.x>-22.4&&p.x<-17.6&&p.z>3.1&&p.z<10.2)continue;tenute.push(p);
   const o=new THREE.Mesh(e,mt);o.position.set(p.x,.02+R()*.01,p.z);o.rotation.y=Math.atan2(B.x-A.x,B.z-A.z)+Math.PI/2+(R()-.5)*.06;o.castShadow=o.receiveShadow=true;o.userData.lastra=true;scene.add(o);n++;}}
 for(const p of sesto){const o=new THREE.Mesh(e,mt);o.position.set(p.x,.02+R()*.01,p.z);o.rotation.y=(R()-.5)*.06;o.castShadow=o.receiveShadow=true;o.userData.lastra=true;scene.add(o);n++;}   
 console.log('lastre',vecchie.length,'->',n);}
// ---- grigliato in cemento (video IMG_5056 3-4 s, giardino del 2). Michele 12/10: grigliato dritto dal cancelletto, senza la svolta a L.
// pannelli quadrati di blocchetti rettangolari in rilievo, file sfalsate, terra ed erba rada negli spazi; blocchetti veri in 3D.
// [x0,x1,z0,z1] in metri del modello
var GRIGLIATI=[[-19.55,-18.55,6.9,10.31]];  // attaccato alla striscia lungo la casa (bordo -18,55)  // spostato di 50 cm verso la casa con il cancelletto (Michele 12/10)
function grigliati(){
 let sd=31;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 // fondo: terra battuta grigio-bruna con qualche filo verde
 const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='#5a5244';x.fillRect(0,0,256,256);
 for(let i=0;i<5000;i++){const v=70+R()*60;x.fillStyle=`rgb(${v+8|0},${v|0},${v-12|0})`;x.fillRect(R()*256,R()*256,1+R()*2,1+R()*2);}
 for(let i=0;i<900;i++){x.fillStyle=`rgba(${50+R()*30|0},${85+R()*40|0},${30+R()*20|0},.8)`;x.fillRect(R()*256,R()*256,1,2+R()*3);}
 const tf=new THREE.CanvasTexture(c);tf.wrapS=tf.wrapT=THREE.RepeatWrapping;tf.encoding=THREE.sRGBEncoding;tf.repeat.set(2,2);
 const mf=new THREE.MeshStandardMaterial({map:tf,roughness:1});
 // blocchetto: cemento chiaro, spigoli smussati
 const bc=document.createElement('canvas');bc.width=bc.height=64;const y=bc.getContext('2d');y.fillStyle='#a8a59d';y.fillRect(0,0,64,64);
 for(let i=0;i<700;i++){const v=135+R()*55;y.fillStyle=`rgb(${v|0},${v-2|0},${v-8|0})`;y.fillRect(R()*64,R()*64,1,1);}
 const tb=new THREE.CanvasTexture(bc);tb.encoding=THREE.sRGBEncoding;
 const mb=new THREE.MeshStandardMaterial({map:tb,roughness:.85});
 const BW=.08,BD=.048,BH=.026,PX=.1,PZ=.07;   // blocchetto 8,5 x 5 cm, passo 11,5 x 8 cm, file sfalsate
 const sh=new THREE.Shape(),r=.004;sh.moveTo(-BW/2+r,-BD/2);sh.lineTo(BW/2-r,-BD/2);sh.quadraticCurveTo(BW/2,-BD/2,BW/2,-BD/2+r);sh.lineTo(BW/2,BD/2-r);sh.quadraticCurveTo(BW/2,BD/2,BW/2-r,BD/2);sh.lineTo(-BW/2+r,BD/2);sh.quadraticCurveTo(-BW/2,BD/2,-BW/2,BD/2-r);sh.lineTo(-BW/2,-BD/2+r);sh.quadraticCurveTo(-BW/2,-BD/2,-BW/2+r,-BD/2);
 const gb=new THREE.ExtrudeGeometry(sh,{depth:BH-.004,bevelEnabled:true,bevelThickness:.002,bevelSize:.002,bevelSegments:2,curveSegments:2});gb.rotateX(-Math.PI/2);
 const M=new THREE.Matrix4(),q=new THREE.Quaternion(),S=new THREE.Vector3(1,1,1),P=new THREE.Vector3(),col=new THREE.Color();
 for(const [x0,x1,z0,z1] of GRIGLIATI){
  const f=new THREE.Mesh(new THREE.PlaneGeometry(x1-x0,z1-z0),mf);f.rotation.x=-Math.PI/2;f.position.set((x0+x1)/2,.064,(z0+z1)/2);f.receiveShadow=true;scene.add(f);
  // un pezzo unico: blocchetti tutti attaccati a file sfalsate, appena fuori squadra uno dall'altro (Michele 12/10: niente pannelli)
  const pts=[];let rz=0;for(let lz=z0+BD/2+.01;lz+BD/2<z1-.004;lz+=PZ,rz++)for(let lx=x0+BW/2+.006+(rz%2?PX/2:0);lx+BW/2<x1-.004;lx+=PX)pts.push([lx+(R()-.5)*.008,lz+(R()-.5)*.006,(R()-.5)*.06]);
  const im=new THREE.InstancedMesh(gb,mb,pts.length);pts.forEach(([a,b,ro],i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),ro);P.set(a,.062,b);M.compose(P,q,S);im.setMatrixAt(i,M);const l=.8+R()*.25;col.setRGB(l,l,l*.98);im.setColorAt(i,col);});
  im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.castShadow=im.receiveShadow=true;scene.add(im);console.log('grigliato blocchetti',pts.length);
  // erbetta che esce fra i blocchetti: ciuffi nelle fughe, non dappertutto
  const pos=[];for(let n=0;n<6;n++){const an=n/6*Math.PI*2+R(),h=.035+R()*.035,lx=Math.cos(an)*.006,lz=Math.sin(an)*.006,tx=-Math.sin(an)*.003,tz=Math.cos(an)*.003;pos.push(lx-tx,0,lz-tz,lx+tx,0,lz+tz,lx*3+Math.cos(an)*.012,h,lz*3+Math.sin(an)*.012);}
  const ge=new THREE.BufferGeometry();ge.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));ge.computeVertexNormals();
  const me=new THREE.MeshStandardMaterial({color:0x2f5419,roughness:.9,side:THREE.DoubleSide});const cf=[];
  for(const [a,b2] of pts){if(R()<.55)cf.push([a+PX/2,b2+(R()-.5)*.03]);if(R()<.45)cf.push([a+(R()-.5)*.06,b2+PZ/2]);}
  const ie=new THREE.InstancedMesh(ge,me,cf.length);cf.forEach(([a,b2],i)=>{if(a>x1-.01)a=x1-.01;q.setFromAxisAngle(new THREE.Vector3(0,1,0),R()*6.28);const sc=.8+R()*.9;S.set(sc,sc*(.7+R()*.8),sc);P.set(a,.064,Math.min(b2,z1-.01));M.compose(P,q,S);ie.setMatrixAt(i,M);const l=.7+R()*.45;col.setRGB(.8*l,.9*l,.7*l);ie.setColorAt(i,col);});
  S.set(1,1,1);ie.instanceMatrix.needsUpdate=true;if(ie.instanceColor)ie.instanceColor.needsUpdate=true;scene.add(ie);}
}
// ---- cordolo in pietra fra marciapiede e prato (video IMG_5073 22-23 s)
function cordoli(){const mt=new THREE.MeshStandardMaterial({map:gres(),roughness:.75,color:0x85878b});
 for(const [x0,z0,x1,z1,w,h] of SACROFANO_MODEL.connections.detail_revision.cordoli||[]){const L=Math.hypot(x1-x0,z1-z0);const c=new THREE.Mesh(new THREE.BoxGeometry(w,h,L),mt);c.position.set((x0+x1)/2,h/2-.03,(z0+z1)/2);c.rotation.y=Math.atan2(x1-x0,z1-z0);c.castShadow=c.receiveShadow=true;scene.add(c);}}
// ---- ciuffi d'erba rasati sopra il prato (Michele 12/10: "un po' di ciuffi, rasati, tagliati bassi"), 4-7 cm, instanziati
function ciuffi(){
 const tp=pratoCurato(),tris=[];const lastreP=[];scene.traverse(o=>{if(o.userData&&o.userData.lastra&&o.visible)lastreP.push(o);});const loc=new THREE.Vector3();let area=0;const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3(),n=new THREE.Vector3();
 scene.traverse(o=>{if(!o.isMesh||!o.visible)return;const m=o.material;if(!m||Array.isArray(m)||m.map!==tp)return;o.updateMatrixWorld();const g=o.geometry,p=g.attributes.position,ix=g.index;const nt=(ix?ix.count:p.count)/3;
  for(let t=0;t<nt;t++){const i0=ix?ix.getX(t*3):t*3,i1=ix?ix.getX(t*3+1):t*3+1,i2=ix?ix.getX(t*3+2):t*3+2;a.fromBufferAttribute(p,i0).applyMatrix4(o.matrixWorld);b.fromBufferAttribute(p,i1).applyMatrix4(o.matrixWorld);c.fromBufferAttribute(p,i2).applyMatrix4(o.matrixWorld);
   n.subVectors(b,a).cross(c.clone().sub(a));const ar=n.length()/2;if(ar<1e-4||n.normalize().y<.9||a.y<-.5)continue;tris.push([a.clone(),b.clone(),c.clone(),ar]);area+=ar;}});
 if(!tris.length)return;
 // un ciuffo: 5 fili sottili inclinati, alti pochi centimetri
 const pos=[];let sd=1234567;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};  // generatore casuale buono: niente file in riga
 for(let k=0;k<5;k++){const an=k/5*Math.PI*2+R(),r=.012,h=.02+R()*.02,lx=Math.cos(an)*r,lz=Math.sin(an)*r,tx=-Math.sin(an)*.004,tz=Math.cos(an)*.004,lean=.012;
  pos.push(lx-tx,0,lz-tz, lx+tx,0,lz+tz, lx*1.6+Math.cos(an)*lean,h,lz*1.6+Math.sin(an)*lean);}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.computeVertexNormals();
 const mat=new THREE.MeshStandardMaterial({color:0x2f5419,roughness:.9,side:THREE.DoubleSide});
 const N=Math.min(320000,Math.round(area*900)),im=new THREE.InstancedMesh(geo,mat,N),M=new THREE.Matrix4(),q=new THREE.Quaternion(),S=new THREE.Vector3(),P=new THREE.Vector3(),col=new THREE.Color();
 const cum=[];let acc=0;for(const t of tris){acc+=t[3];cum.push(acc);}
 for(let i=0;i<N;i++){let r=R()*acc,lo=0,hi=cum.length-1;while(lo<hi){const mid=(lo+hi)>>1;if(cum[mid]<r)lo=mid+1;else hi=mid;}const [A,B,C]=tris[lo];let u=R(),v=R();if(u+v>1){u=1-u;v=1-v;}
  P.copy(A).addScaledVector(B.clone().sub(A),u).addScaledVector(C.clone().sub(A),v);P.y+=.002;let su=GRIGLIATI.some(g=>P.x>g[0]-.02&&P.x<g[1]+.02&&P.z>g[2]-.02&&P.z<g[3]+.02);for(const L of lastreP){loc.copy(P).sub(L.position).applyAxisAngle(new THREE.Vector3(0,1,0),-L.rotation.y);if(Math.abs(loc.x)<.22&&Math.abs(loc.z)<.32){su=true;break;}}if(su){P.y-=5;}q.setFromAxisAngle(new THREE.Vector3(0,1,0),R()*6.28);const sc=.7+R()*.7;S.set(sc,sc,sc);M.compose(P,q,S);im.setMatrixAt(i,M);
  const l=.7+R()*.45;col.setRGB(.8*l,.9*l,.7*l);im.setColorAt(i,col);}
 // ciuffi che si aggrappano ai bordi delle lastre e riempiono gli spazi fra una e l'altra (Michele 12/10)
 const ext=[];for(const L of lastreP){for(let k=0;k<220;k++){const lato=R()*4|0,t=R()-.5;let lx,lz;if(lato<2){lx=(lato?1:-1)*(.21+R()*.08);lz=t*.74;}else{lz=(lato>2?1:-1)*(.31+R()*.08);lx=t*.54;}
  const w=new THREE.Vector3(lx,0,lz).applyAxisAngle(new THREE.Vector3(0,1,0),L.rotation.y).add(L.position);w.y=L.position.y-.012;ext.push(w);}}
 const im2=new THREE.InstancedMesh(geo,mat,ext.length);ext.forEach((w,i)=>{q.setFromAxisAngle(new THREE.Vector3(0,1,0),R()*6.28);const sc=1.1+R()*.8;S.set(sc,sc*1.6,sc);M.compose(w,q,S);im2.setMatrixAt(i,M);const l=.7+R()*.45;col.setRGB(.8*l,.9*l,.7*l);im2.setColorAt(i,col);});
 im2.instanceMatrix.needsUpdate=true;if(im2.instanceColor)im2.instanceColor.needsUpdate=true;scene.add(im2);
 im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.receiveShadow=true;scene.add(im);console.log('ciuffi',N,'su m2',Math.round(area));}
// ---- siepe di fotinie in salute lungo la rete (video IMG_5073 3-10 s; Michele 12/10: siepe fitta, a lavori finiti)
// tratti di recinzione del giardino dell'1 (posizioni dal modello) spostati di 35 cm verso l'interno
// tratti di rete del giardino dell'1 (dal modello) con quanto accorciare agli estremi (cancello, angoli) e lato interno
const SIEPI_FOTINIA=[[-22.05,-11.6,-26.3,2.5,-1,.15,.05],[-26.3,2.5,-24.6,2.9,-1,.1,-.35],[-23.1,2.9,-17.75,2.9,-1,.12,.25],[-19.1,-11.6,-22.05,-11.6,-1,.12,.1],
 // giardino del 2 (Michele 12/10: un giro di fotinie come nell'1): lato nord, lato ovest, fronte fino al cancelletto
 [-22.3,2.95,-18.6,2.95,1,.15,.1],[-22.37,3.02,-22.67,10.44,-1,.3,.25],[-22.67,10.44,-19.49,10.44,-1,.3,.15,.62],
 // giardino del 4: siepe alta di lauro dietro il muretto, ai lati del cancelletto (foto IMG_5184, Michele 12/10)
 [-4.6,13.27,-3.79,13.27,-1,.1,.12,1.2,1],[-2.05,13.27,1.35,13.27,-1,.1,.1,1.2,1],[-4.7,13.27,-4.7,7.7,1,.35,.15,1.2,1],[1.42,13.27,1.42,7.7,-1,.35,.15,1.2,1],
 // giardino del 6: giro di fotinie come nell'1 (scheda 6, Michele 12/10)
 [12.95,2.69,17.4,3.8,1,.15,.12],[17.4,3.8,17.1,5.62,1,.12,.1],[17.1,5.62,16.35,8.45,1,.1,.2],[16.05,9.55,15.42,11.93,1,.2,.1],[15.42,11.93,12.95,11.8,1,.12,.1]]  // sul fronte piu' basse (Michele 12/10);  // fino al cancelletto e dentro gli angoli (Michele 12/10)
function fotinie(){
 // fotinie (Photinia 'Red Robin', riconosciute dal video IMG_5073: foglie lucide, punte nuove rosso-bronzo).
 // Cespugli con rametti e foglie vere (forma ellittica, nervatura, lucido), rivolte verso l'esterno del cespuglio; tutto dentro il muretto.
 let sd=77;const R=()=>{sd|=0;sd=sd+0x6D2B79F5|0;let t=Math.imul(sd^sd>>>15,1|sd);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 const lc=document.createElement('canvas');lc.width=64;lc.height=128;{const x=lc.getContext('2d');x.clearRect(0,0,64,128);
  const g=x.createLinearGradient(0,0,64,0);g.addColorStop(0,'#c8c8c8');g.addColorStop(.5,'#ffffff');g.addColorStop(1,'#a8a8a8');x.fillStyle=g;
  x.beginPath();x.moveTo(32,2);x.bezierCurveTo(62,30,60,90,32,126);x.bezierCurveTo(4,90,2,30,32,2);x.fill();
  x.strokeStyle='rgba(0,0,0,.35)';x.lineWidth=2;x.beginPath();x.moveTo(32,6);x.lineTo(32,124);x.stroke();
  x.lineWidth=1;for(let k=0;k<7;k++){const y=20+k*14;x.beginPath();x.moveTo(32,y);x.lineTo(14,y-8);x.moveTo(32,y);x.lineTo(50,y-8);x.stroke();}}
 const lt=new THREE.CanvasTexture(lc);lt.encoding=THREE.sRGBEncoding;
 const foglia=new THREE.PlaneGeometry(.06,.11);foglia.translate(0,.05,0);
 const mat=new THREE.MeshPhongMaterial({map:lt,alphaTest:.5,side:THREE.DoubleSide,shininess:55,specular:0x2a3a2a});
 const legno=new THREE.MeshStandardMaterial({color:0x2a1d14,roughness:.9});
 const bush=[];
// siepe attaccata alla rete del camminamento dietro il 9 (angolo coperto: i due tratti si sovrappongono e un cespuglio in diagonale chiude la curva), dal lato del camminamento, alta come la rete (Michele 13/10: al posto dei vasi)
// giardino del 14 (fabbricato B): lauro alto come nel 4, dietro il muretto con la rete, lato strada fino al cancelletto e lato lungo in diagonale (Michele 14/10)
SIEPI_FOTINIA.push([9.93,17.73,6.696,17.727,-1,.1,.35,1.2,1],[6.696,17.727,.337,32.178,-1,.35,.3,1.2,1],[.337,32.178,9.163,35.738,-1,.35,.3,1.2,1]);
SIEPI_FOTINIA.push([11.25,-10.11,26.6,-9.6,-1,0,.15,.78,0,2.94],[11.55,-8.35,11.55,-10.4,-1,.1,0,.7,0,2.94],[11.2,-10.05,11.6,-10.45,-1,0,0,.78,0,2.94]);
for(const [x0,z0,x1,z1,dir,t0,t1,hs=1,lauro=0,yb=0] of SIEPI_FOTINIA){const L=Math.hypot(x1-x0,z1-z0),ux=(x1-x0)/L,uz=(z1-z0)/L,nx=-uz*dir,nz=ux*dir;const usable=L-t0-t1;if(usable<.3)continue;// passo irregolare, alcuni cespugli uno sull'altro, distanza dal muretto variabile (Michele 12/10: meno perfetta, più vera)
  let d=lauro===2?(window._carry||0):t0+R()*.15;while(d<=L-t1){const off=lauro===2?(R()-.5)*.1:lauro?.42+R()*.1:.2+R()*.12;  bush.push([x0+ux*d+nx*off,z0+uz*d+nz*off,ux,uz,nx,nz,x0,z0,hs,lauro,yb]);d+=lauro===2?.45+R()*.15:lauro?.28+R()*.12:.22+R()*.45;}if(lauro===2)window._carry=Math.max(0,d-L);}
 const PER=2600,im=new THREE.InstancedMesh(foglia,mat,bush.length*PER),M=new THREE.Matrix4(),S=new THREE.Vector3(),P=new THREE.Vector3(),C=new THREE.Vector3(),col=new THREE.Color(),o=new THREE.Object3D();let k=0;
 const rami=new THREE.Group();scene.add(rami);
 for(const [bx,bz,ux,uz,nx,nz,lx0,lz0,hs,lauro,yb] of bush){const h=lauro?(1.75+R()*.3):(1.05+R()*.85)*hs,rw=lauro?.42+R()*.12:.28+R()*.3,rd=lauro?.34+R()*.06:.24+R()*.14,base=.02+(yb||0),lean=lauro?(R()-.5)*.08:(R()-.5)*.35,leanN=-.05-R()*.15;C.set(bx,base+h*.55,bz);
  for(let r=0;r<5;r++){const a=R()*6.28,len=h*(.7+R()*.3),tx=Math.cos(a)*rw*.6,tz=Math.sin(a)*rd*.6;const g=new THREE.CylinderGeometry(.004,.009,len*.75,5);g.translate(0,len/2,0);const m=new THREE.Mesh(g,legno);m.position.set(bx,base,bz);m.lookAt(bx+tx,base+len,bz+tz);m.rotateX(Math.PI/2);rami.add(m);}
  for(let i=0;i<PER;i++){let x,y,z;do{x=R()*2-1;y=R()*2-1;z=R()*2-1;}while(x*x+y*y+z*z>1);const yy=(y*.5+.5)*h,shrink=.75+.25*Math.min(1,yy/(h*.3)),out=.55+.45*Math.pow(R(),.5);
   const fy=yy/h;P.set(bx+(ux*x*rw+(-uz)*z*rd)*shrink*out+ux*lean*fy+nx*leanN*fy,base+yy,bz+(uz*x*rw+ux*z*rd)*shrink*out+uz*lean*fy+nz*leanN*fy);
   // distanza dalla linea della recinzione verso l'interno: sotto la copertina del muretto restano davanti al muretto (faccia interna a 13 cm),
   // sopra si appoggiano alla rete e la attraversano appena (fino a 2 cm), mai dall'altra parte
   if(lauro!==2){const dd=(P.x-lx0)*nx+(P.z-lz0)*nz,minimo=P.y<.42?.14:-.02;if(dd<minimo){P.x+=nx*(minimo-dd+R()*.03);P.z+=nz*(minimo-dd+R()*.03);}}
   o.position.copy(P);o.lookAt(P.x*2-C.x,P.y*2-C.y+.4,P.z*2-C.z);o.rotateZ((R()-.5)*1.4);o.rotateX(-.3-R()*.5);const sc=(.8+R()*.5)*(lauro?1.35:1);o.scale.set(sc,sc,sc);o.updateMatrix();im.setMatrixAt(k,o.matrix);
   const top=yy/h;if(lauro){const l=.75+R()*.35;col.setRGB(.03*l,.105*l,.035*l);}else if((top>.68&&R()<.7)||(top>.5&&R()<.18))col.setRGB(.55+R()*.2,.08+R()*.06,.05);else{const l=.78+R()*.3;col.setRGB(.045*l,.14*l,.04*l);}im.setColorAt(k,col);k++;}}
 // anima piena del cespuglio: volume di fogliame scuro dentro le foglie, così la siepe si vede folta anche da lontano
 {const cg=new THREE.IcosahedronGeometry(1,3),cp=cg.attributes.position;for(let i=0;i<cp.count;i++){const f=.82+R()*.3;cp.setXYZ(i,cp.getX(i)*f,cp.getY(i)*f,cp.getZ(i)*f);}cg.computeVertexNormals();
  const cm=new THREE.MeshPhongMaterial({shininess:40,specular:0x1a2a1a});cm.color.setRGB(.04,.125,.035);const core=new THREE.InstancedMesh(cg,cm,bush.length);const QQ=new THREE.Quaternion();
  bush.forEach(([bx,bz,ux,uz,nx,nz,,,hs,,yb],i)=>{const h=(1.1+R()*.6)*hs;P.set(bx+nx*.04,.02+(yb||0)+h*.5,bz+nz*.04);QQ.setFromAxisAngle(new THREE.Vector3(0,1,0),Math.atan2(ux,uz));S.set(.24,h*.46,.32);M.compose(P,QQ,S);core.setMatrixAt(i,M);});
  core.instanceMatrix.needsUpdate=true;core.castShadow=true;core.receiveShadow=true;scene.add(core);}
 im.count=k;im.instanceMatrix.needsUpdate=true;if(im.instanceColor)im.instanceColor.needsUpdate=true;im.castShadow=false;im.receiveShadow=false;scene.add(im);console.log('fotinie cespugli',bush.length,'foglie',k);}
// ---- strisce del posto auto: vernice stesa sull'asfalto, non bastoncini in rilievo
function terreno(){ // il pianoro intorno (bianco latte con la luce nuova) diventa terra battuta grigia con ghiaietto, come nel video IMG_5073 0-2 s
 const t=asfaltoTex().clone();t.needsUpdate=true;t.repeat.set(.25,.25);
 const sm=new THREE.MeshStandardMaterial({map:t,roughness:1,metalness:0});  
 scene.traverse(o=>{if(!o.isMesh)return;if(Array.isArray(o.material)){o.material=o.material.map(m=>m&&m.color&&m.color.getHexString()==='bcc3a0'?sm:m);}else if(o.material.color&&o.material.color.getHexString()==='bcc3a0')o.material=sm;});}
function strisceVernice(){terreno();const m=new THREE.MeshStandardMaterial({map:vernice(),transparent:true,roughness:.7,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2,depthWrite:false});
 for(const [x0,z0,x1,z1] of SACROFANO_MODEL.connections.detail_revision.strisce||[]){const len=Math.hypot(x1-x0,z1-z0);const g=new THREE.PlaneGeometry(len+.1,.12);g.rotateX(-Math.PI/2);const o=new THREE.Mesh(g,m);o.position.set((x0+x1)/2,.032,(z0+z1)/2);o.rotation.y=-Math.atan2(z1-z0,x1-x0);o.receiveShadow=true;scene.add(o);}
 scene.traverse(o=>{if(o.isMesh&&o.geometry&&o.geometry.parameters&&Math.abs((o.geometry.parameters.height||0)-.012)<1e-4&&o.material.color&&o.material.color.getHexString()==='f2f2ee')o.visible=false;});}
// ---- cielo e luce di giornata (Michele 12/10: luminoso e vendibile, colori dei materiali invariati)
function cielo(){
 const c=document.createElement('canvas');c.width=2048;c.height=1024;const x=c.getContext('2d');
 const g=x.createLinearGradient(0,0,0,1024);g.addColorStop(0,'#5d93d1');g.addColorStop(.32,'#8fbbe8');g.addColorStop(.47,'#cfe2f3');g.addColorStop(.5,'#e9f0f2');g.addColorStop(1,'#e9f0f2');
 x.fillStyle=g;x.fillRect(0,0,2048,1024);
 let sd=11;const R=()=>{sd=(sd*9301+49297)%233280;return sd/233280};
 for(let k=0;k<26;k++){const cx=R()*2048,cy=120+R()*300,w=120+R()*260;for(let j=0;j<14;j++){const rx=cx+(R()-.5)*w,ry=cy+(R()-.5)*w*.18,rr=w*(.12+R()*.16);const rg=x.createRadialGradient(rx,ry,0,rx,ry,rr);rg.addColorStop(0,'rgba(255,255,255,.42)');rg.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=rg;x.beginPath();x.arc(rx,ry,rr,0,7);x.fill();}}
 const t=new THREE.CanvasTexture(c);t.encoding=THREE.sRGBEncoding;t.mapping=THREE.EquirectangularReflectionMapping;
 const giorno=()=>document.querySelector('[data-mode="day"], .mode-day')||true;
 const bgPrima=scene.background;scene.background=t;
 // riflessi del cielo sui metalli zincati (cancelletti): solo sui materiali metallici, il resto non cambia
 try{const pm=new THREE.PMREMGenerator(renderer);const env=pm.fromEquirectangular(t).texture;scene.traverse(o=>{if(!o.isMesh)return;const M=Array.isArray(o.material)?o.material:[o.material];M.forEach(m=>{if(m&&m.metalness>.5){m.envMap=env;m.envMapIntensity=m.userData.vetro?1.1:m.userData.lucido?.95:.25;m.needsUpdate=true;}});});}catch(e){console.log('env',e)}
 const hemi=scene.children.find(o=>o.isHemisphereLight),sun=scene.children.find(o=>o.isDirectionalLight);
 if(hemi){hemi.color.set(0xeef4ff);hemi.groundColor.set(0xd8d0bb);hemi.intensity=.9;}
 if(sun){sun.color.set(0xfff0dc);sun.intensity=.85;sun.position.set(-35,60,45);}
 if(scene.fog){scene.fog.color.set(0xe3ecf2);}
}
// ---- alberi visti nelle foto (mappa fase4/contesto/mappa-alberi.jpg, posizioni STIMATE da confermare appartamento per appartamento)
const ALBERI=[['island_tree_01',24,0,14,2.6,30],['island_tree_01',-20,0,-18,2.4,200],['island_tree_01',16,0,-21,2.2,290],
 ['island_tree_02',-10,-2.5,49,1.1,0],['island_tree_02',-4,-2.5,50,1.25,40],['island_tree_02',3,-2.5,49.5,1.1,80],['island_tree_02',9,-2.5,48,1.25,120]];
const CIPRESSI=[[19,-19,11],[21,-18.5,12],[23,-19.5,13],[29,20,10],[28.4,23,11],[27.8,26,12],[27.2,29,10],[26.6,32,11]];
function alberi(){
 const G=new THREE.Group();G.name='alberi';scene.add(G);
 const cm=new THREE.MeshStandardMaterial({color:0x2a3a20,roughness:.95});
 for(const [x,z,h] of CIPRESSI){const pts=[];for(let i=0;i<=24;i++){const t=i/24;pts.push(new THREE.Vector2(Math.max(.02,.9*Math.sin(Math.PI*Math.pow(t,.8))*(1-.35*t)),t*h));}
  const g=new THREE.LatheGeometry(pts,18),p=g.attributes.position;for(let i=0;i<p.count;i++){const k=1+.18*Math.sin(p.getY(i)*3.1+i*.7)*Math.cos(i*1.3);p.setX(i,p.getX(i)*k);p.setZ(i,p.getZ(i)*k);}g.computeVertexNormals();
  const c=new THREE.Mesh(g,cm);c.position.set(x,0,z);c.castShadow=c.receiveShadow=true;G.add(c);}
 // albero intero calcolato in Blender (fase4/blender/sprite_alberi.py): immagine che gira sempre verso chi guarda
 const DIM={island_tree_01:[4.82,5.03],island_tree_02:[4.21,3.41]},TL2=new THREE.TextureLoader(),sm={};
 for(const [nome,x,y,z,sc] of ALBERI){if(!sm[nome]){const t=TL2.load('modelli/'+nome+'.png');t.encoding=THREE.sRGBEncoding;sm[nome]=new THREE.SpriteMaterial({map:t,alphaTest:.5,transparent:false});}
  const sp=new THREE.Sprite(sm[nome]);sp.center.set(.5,0);const [w,h]=DIM[nome];sp.scale.set(w*sc*1.02,h*sc*1.02,1);sp.position.set(x,y-.05,z);G.add(sp);}
}
// 14/10 sera (Michele): i materiali pesanti partono solo quando l'apertura ha finito scritta e logo, cosi la scritta resta fluida
let libera=!document.getElementById('ap-intro')&&!window.__apIntro;addEventListener('ap-via-libera',()=>{libera=true;});setTimeout(()=>{libera=true;},20000);
const t=setInterval(()=>{if(libera&&document.body.dataset.ready==='true'&&typeof scene!=='undefined'){clearInterval(t);setTimeout(applica,60);}},150);
})();

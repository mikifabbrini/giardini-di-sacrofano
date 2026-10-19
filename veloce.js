// VELOCITA' (16/10/2026): il sito disegnava quasi 8000 oggetti separati a ogni fotogramma (rami dei cespugli, doghe delle
// persiane, paletti, pezzi di muro...). Qui, a scena pronta, i pezzi fermi che usano lo stesso materiale vengono fusi in un solo
// oggetto per gruppo: quello che si vede non cambia, ma la scheda video riceve molte meno chiamate. Gli oggetti originali
// restano in scena nascosti, cosi' il resto del codice che li cerca (lampade, livelli, piante) continua a funzionare.
(function(){
const PAG=(window.SITO&&SITO.pagina)||'home';
if(PAG==='contatti')return;
let fatto=false;
function ancora(o){ // il gruppo in cui finisce il pezzo fuso: il volume (mass) o il gruppo del livello, oppure l'oggetto di primo livello sotto la scena
 const A=new Set([scene]);Object.values(LV).forEach(L=>{A.add(L.grp);if(L.mass)A.add(L.mass);if(L.walls)A.add(L.walls);});
 let p=o.parent,prev=o;while(p){if(A.has(p))return p===scene?(prev===o?scene:prev):p;prev=p;p=p.parent;}return scene;}
function escluso(o){
 if(!o.isMesh||o.isInstancedMesh||!o.visible||!o.geometry||!o.material||Array.isArray(o.material))return true;
 const m=o.material;if(m.clippingPlanes&&m.clippingPlanes.length)return true;
 if(m.userData&&m.userData.lampada)return true;
 if(m.transparent&&(m.opacity<1||m.depthWrite===false))return true; // vetri, reti, luci: l'ordine di disegno conta (i materiali dei livelli sono 'transparent' solo per le dissolvenze: si fondono)
 if(o.name)return true;if(o.onBeforeRender!==THREE.Object3D.prototype.onBeforeRender)return true;
 if(o.userData&&(o.userData.n!==undefined||o.userData.lv!==undefined||o.userData.pieno))return true;
 const g=o.geometry;if(!g.attributes.position||g.morphAttributes&&Object.keys(g.morphAttributes).length)return true;
 return false;}
function riferimenti(){ // pezzi che il viewer muove o accende da soli: non si toccano
 const s=new Set();Object.values(LV).forEach(L=>{[L.walls,L.slab,L.floor,L.terraces,L.low,L.internalStair8,L.internalStair11,L.stairArrival11,L.planDoors].forEach(x=>{if(x)x.traverse(y=>s.add(y));});if(L.mass)s.add(L.mass);(L.units||[]).forEach(u=>Object.values(u).forEach(v=>{if(v&&v.isObject3D)s.add(v);}));});
 if(typeof upperWalkClone!=='undefined'&&upperWalkClone)upperWalkClone.traverse(y=>s.add(y));
 if(typeof stairGrp!=='undefined'&&stairGrp)stairGrp.traverse(y=>s.add(y));
 scene.traverse(o=>{if(o.name==='piantaDWG')o.traverse(y=>s.add(y));});
 return s;}
function fondi(){
 if(fatto)return;fatto=true;const t0=performance.now();
 scene.updateMatrixWorld(true);const rif=riferimenti();const B=new Map();let n=0;
 scene.traverse(o=>{if(escluso(o)||rif.has(o))return;let p=o.parent,vis=true;while(p){if(!p.visible){vis=false;break;}p=p.parent;}if(!vis)return;
  const a=ancora(o),g=o.geometry,m=o.material;
  const k=[a.uuid,m.uuid,o.castShadow?1:0,o.receiveShadow?1:0,o.renderOrder,!!g.attributes.normal,!!g.attributes.uv,!!g.attributes.color].join('|');
  if(!B.has(k))B.set(k,{a,m,o:[]});B.get(k).o.push(o);});
 const inv=new THREE.Matrix4(),rel=new THREE.Matrix4(),nm=new THREE.Matrix3();
 for(const {a,m,o:lista} of B.values()){
  if(lista.length<2)continue;
  const pos=[],nor=[],uv=[],col=[];const hasN=!!lista[0].geometry.attributes.normal,hasUV=!!lista[0].geometry.attributes.uv,hasC=!!lista[0].geometry.attributes.color;
  inv.copy(a.matrixWorld).invert();
  for(const o of lista){let g=o.geometry;if(g.index)g=g.toNonIndexed();else g=g.clone();
   rel.multiplyMatrices(inv,o.matrixWorld);g.applyMatrix4(rel);
   pos.push(g.attributes.position.array);if(hasN)nor.push(g.attributes.normal.array);if(hasUV)uv.push(g.attributes.uv.array);if(hasC)col.push(g.attributes.color.array);
   if(g!==o.geometry)g.dispose&&0;}
  const cat=(arr,n)=>{let L=0;for(const x of arr)L+=x.length;const out=new Float32Array(L);let i=0;for(const x of arr){out.set(x,i);i+=x.length;}return new THREE.BufferAttribute(out,n);};
  const G=new THREE.BufferGeometry();G.setAttribute('position',cat(pos,3));if(hasN)G.setAttribute('normal',cat(nor,3));if(hasUV)G.setAttribute('uv',cat(uv,2));if(hasC)G.setAttribute('color',cat(col,3));
  G.computeBoundingSphere();G.computeBoundingBox();
  const M=new THREE.Mesh(G,m);M.castShadow=lista[0].castShadow;M.receiveShadow=lista[0].receiveShadow;M.renderOrder=lista[0].renderOrder;M.frustumCulled=true;M.name='fuso';M.userData.fusi=lista.length;
  a.add(M);lista.forEach(o=>{o.visible=false;o.userData.fusoIn=M;});n+=lista.length;}
 if(renderer.shadowMap)renderer.shadowMap.needsUpdate=true;if(window.RV)RV.forza=Math.max(RV.forza||0,30);
 console.log('veloce: fusi',n,'pezzi in',[...B.values()].filter(b=>b.o.length>1).length,'oggetti,',Math.round(performance.now()-t0),'ms');
 window.__veloce={fusi:n,gruppi:[...B.values()].filter(b=>b.o.length>1).length};}
// quando partire: a scena pronta; nelle pagine dei piani dopo il taglio dei piani e il caricamento delle piante dal DWG
function pronto(){const t0=performance.now();const attendi=()=>{if(window.__pianoAperto){setTimeout(attendi,300);return;} /* Esplora piani: si fonde solo nella vista dei piani */if(!window.__fotoFatto&&performance.now()-t0<180000){setTimeout(attendi,300);return;} /* 19/10: prima finiscono tutti i materiali veri, poi si fonde (prima a 25 s si fondevano anche i tetti vecchi) */let carica=false;try{if(window.PIANTE)for(const k in PIANTE)if(PIANTE[k]==='carica')carica=true;}catch(e){}
 const minimo=PAG==='home'?600:1500;if((carica||performance.now()-t0<minimo)&&performance.now()-t0<15000){setTimeout(attendi,150);return;}
 try{fondi();}catch(e){console.warn('veloce',e);}};attendi();}
if(window.__apPronto)pronto();else addEventListener('ap-sito-pronto',pronto,{once:true});
})();

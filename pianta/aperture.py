import json,sys,numpy as np
from shapely.geometry import Polygon,LineString,shape
from shapely.ops import unary_union
S='/Users/michelefabbrini/Progetti/SACROFANO/sito/check-piano-terra-20261015/sorgenti/'
def poly_from(rs):
  return unary_union([Polygon(r[0],r[1:]) for r in rs]) if rs else Polygon()
def rings(geom):
  out=[]
  for p in (geom.geoms if hasattr(geom,'geoms') else [geom]):
    if p.is_empty or p.area<0.004 or p.geom_type!='Polygon': continue
    p=p.simplify(0.002)
    out.append([[[round(x,3),round(z,3)] for x,z in p.exterior.coords[:-1]]]+[[[round(x,3),round(z,3)] for x,z in h.coords[:-1]] for h in p.interiors])
  return out
def fascia(muri,a,u,n,s):
  # fascia del muro (offset lungo la normale) nel punto s del lato
  p=a+u*s;L=LineString([p-n*1.0,p+n*1.0]);I=L.intersection(muri)
  segs=[]
  for g in (I.geoms if hasattr(I,'geoms') else [I]):
    if g.is_empty or g.geom_type!='LineString': continue
    t=sorted(np.dot(np.array(c)-p,n) for c in g.coords);segs.append(t)
  if not segs: return None
  segs.sort(key=lambda t:min(abs(t[0]),abs(t[1]),abs((t[0]+t[1])/2)))
  return segs[0]
def run(livello,pj,lj,out):
  P=json.load(open(pj));lati=json.load(open(S+lj))
  muri=poly_from(P['muri']);fin=poly_from(P['finestre'])
  pieno=unary_union([muri,fin])
  log=[];nuove_fin=[];nuove_porte=[];chiusi=[]
  for l in lati:
    a=np.array(l['a'],float);b=np.array(l['b'],float);Lg=np.hypot(*(b-a))
    if Lg<0.3 or not l['aperture']: continue
    u=(b-a)/Lg;n=np.array([-u[1],u[0]])
    aps=l['aperture']
    aps=[ap for ap in aps if ap.get('nome') or not any(o is not ap and o.get('nome') and o.get('scheda')==ap.get('scheda') for o in aps)]
    for ap in aps:
      sch,dwg,tav,mod=ap.get('scheda'),ap.get('dwg'),ap.get('tav2'),ap.get('modello')
      nome=ap.get('nome') or '';porta=ap.get('porta')
      deciso=('conferma' in nome) or ('IMG_' in nome)
      if sch: rng,fonte=sch,'scheda'
      elif deciso and mod: rng,fonte=mod,'decisione'
      else: rng,fonte=None,'chiusa (la scheda non la ha)'
      tipo='porta' if porta else ('finestra' if porta is False else ('finestra' if ap.get('dwg_finestra') else 'porta'))
      # fascia del muro presa appena fuori dall'apertura (DWG), media dei due lati
      ref=[x for x in (dwg,tav,mod,sch) if x]
      r0=min(v[0] for v in ref);r1=max(v[1] for v in ref)
      F=[fascia(pieno,a,u,n,s) for s in (r0-0.18,r1+0.18,r0-0.35,r1+0.35)]
      F=[f for f in F if f and f[1]-f[0]>0.08]
      if not F: log.append((livello,l['lato'],l['unita'],nome,tipo,fonte,rng,'SALTATA: muro non trovato'));continue
      F=[f for f in F if f[1]-f[0]<=0.8] or F
      F.sort(key=lambda f:f[1]-f[0]);F=F[:2]
      f0=np.mean([f[0] for f in F]);f1=np.mean([f[1] for f in F])
      rect=lambda s0,s1,e=0.0:Polygon([a+u*s0+n*(f0-e),a+u*s1+n*(f0-e),a+u*s1+n*(f1+e),a+u*s0+n*(f1+e)])
      # 1) chiudo tutto quello che il DWG/Tav2 aveva aperto in quel punto
      if dwg or tav:
        z=rect(r0,r1);chiusi.append(z)
      # 2) apro secondo la regola
      if rng:
        z=rect(rng[0],rng[1],0.03)
        (nuove_fin if tipo=='finestra' else nuove_porte).append(z)
      log.append((livello,l['lato'],l['unita'],nome,tipo,fonte,rng,'dwg %s tav2 %s'%(dwg,tav)))
  muri2=unary_union([muri,fin]+chiusi)
  fori=unary_union(nuove_fin+nuove_porte) if (nuove_fin or nuove_porte) else Polygon()
  # le finestre del DWG che non stanno sul perimetro dei lati (interne, cortili) restano
  fin_dwg_rimaste=[g for g in (fin.geoms if hasattr(fin,'geoms') else [fin]) if not g.is_empty and not any(g.intersects(c) for c in chiusi)]
  def vera(g):
    r=g.minimum_rotated_rectangle;c=list(r.exterior.coords)[:4];e=[(LineString([c[i],c[(i+1)%4]])) for i in range(4)];e.sort(key=lambda x:x.length)
    corto,lungo=e[0].length,e[-1].length
    if not(0.12<=corto<=0.8 and lungo>=0.45 and lungo>=1.3*corto): return False
    L=e[-1];p,q=np.array(L.coords[0]),np.array(L.coords[1]);v=(q-p)/max(np.hypot(*(q-p)),1e-9);cc=np.array(g.centroid.coords[0]);h=lungo/2
    from shapely.geometry import Point
    mb=muri.buffer(0.02)
    return mb.contains(Point(*(cc+v*(h+0.12)))) and mb.contains(Point(*(cc-v*(h+0.12))))
  scartate=[g for g in fin_dwg_rimaste if not vera(g)]
  fin_dwg_rimaste=[g for g in fin_dwg_rimaste if vera(g)]
  print(livello,'finestre DWG interne scartate',len(scartate),[tuple(round(v,2) for v in g.centroid.coords[0]) for g in scartate])
  muri2=muri2.difference(unary_union([fori]+fin_dwg_rimaste))
  fin2=unary_union([f.intersection(unary_union([muri,fin]+chiusi)) for f in nuove_fin]+fin_dwg_rimaste)
  P['muri']=rings(muri2);P['finestre']=rings(fin2)
  json.dump(P,open(out,'w'))
  return log
log=run('T','pianta_T.json','lati-T.json','pianta_T2.json')+run('B','pianta_B.json','lati-B.json','pianta_B2.json')
with open('aperture-log.txt','w') as f:
  for r in log: f.write(' | '.join(map(str,r))+'\n')
print(len(log));print(open('aperture-log.txt').read())

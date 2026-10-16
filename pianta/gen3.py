import json,sys,numpy as np
from shapely.geometry import LineString,Polygon,Point,box
from shapely.ops import unary_union,polygonize
import v3
from v2 import linee,spess,g,T
from lib import build
S='/Users/michelefabbrini/Progetti/SACROFANO/sito/check-piano-terra-20261015/sorgenti/'
DECISE={'S-19','S-24','S-26','S-28','S-31'}
def rings(geom,minA=0.004):
  out=[]
  for p in (geom.geoms if hasattr(geom,'geoms') else [geom]):
    if p.is_empty or p.geom_type!='Polygon' or p.area<minA: continue
    p=p.simplify(0.002)
    out.append([[[round(x,3),round(z,3)] for x,z in p.exterior.coords[:-1]]]+[[[round(x,3),round(z,3)] for x,z in h.coords[:-1]] for h in p.interiors])
  return out
def piano(L,FP,lati,testi,muri_dati=None):
  L=[x for x in L if np.hypot(*(x[1]-x[0]))>0.05]
  _,_,_,sc=build(L)
  zona=unary_union([LineString(L[j]).buffer(0.25) for j in sc]).buffer(0.05) if sc else Polygon()
  if muri_dati is None:
    Ls,C,F,R,D=v3.stanze(0,0,0,0,L=L,FP=FP,senza=sc)
    muri=FP.difference(unary_union(R+D)).difference(zona)
  else: muri=muri_dati
  muri=unary_union([p for p in (muri.geoms if hasattr(muri,'geoms') else [muri]) if p.area>0.02])
  fin=[];log=[]
  bordo=FP.exterior
  for l in lati:
    a=np.array(l['a'],float);b=np.array(l['b'],float);Lg=np.hypot(*(b-a))
    if Lg<0.3: continue
    u=(b-a)/Lg;n=np.array([-u[1],u[0]])
    if not FP.contains(Point(*((a+b)/2+n*0.3))): n=-n
    aps=l['aperture'];aps=[ap for ap in aps if ap.get('nome') or not any(o is not ap and o.get('nome') and o.get('dwg')==ap.get('dwg') for o in aps)]
    for ap in aps:
      nome=ap.get('nome') or ''
      if nome in DECISE or 'conferma' in nome: rng,fonte=ap.get('modello'),'decisa'
      elif ap.get('dwg'): rng,fonte=ap['dwg'],'pianta DWG'
      elif ap.get('scheda'): rng,fonte=ap['scheda'],'scheda'
      elif ap.get('tav2'): rng,fonte=ap['tav2'],'Tav2'
      else: rng,fonte=ap.get('modello'),'modello'
      if not rng: continue
      porta=ap.get('porta');tipo='porta' if porta else ('finestra' if porta is False else ('finestra' if ap.get('dwg_finestra') else 'porta'))
      z=Polygon([a+u*rng[0]-n*0.05,a+u*rng[1]-n*0.05,a+u*rng[1]+n*0.72,a+u*rng[0]+n*0.72])
      taglio=z.intersection(muri)
      # solo il pezzo di muro attaccato al lato esterno
      pezzi=[p for p in (taglio.geoms if hasattr(taglio,'geoms') else [taglio]) if p.geom_type=='Polygon' and p.distance(LineString([a,b]))<0.16]
      if not pezzi: log.append((l['lato'],nome,tipo,fonte,rng,'muro non trovato'));continue
      T_=unary_union(pezzi);muri=muri.difference(T_.buffer(0.001))
      if tipo=='finestra': fin.append(T_)
      log.append((l['lato'],nome,tipo,fonte,[round(v,3) for v in rng],'ok'))
  return muri,unary_union(fin) if fin else Polygon(),[[list(np.round(L[j][0],3)),list(np.round(L[j][1],3))] for j in sc],log
# PIANO TERRA
LT=linee(-21,22,-15,16)
te=[]
for p,t in g['T']:
  q=T(p)
  if -20<=q[0]<=21 and -14<=q[1]<=15 and t and len(t)>1 and t not in ('A','B'): te.append([round(q[0],2),round(q[1],2),t])
muri,fin,sc,log=piano(LT,v3.FP,json.load(open(S+'lati-T.json')),te)
json.dump({'livello':'T','muri':rings(muri),'finestre':rings(fin),'scale':sc,'testi':te},open('pianta3_T.json','w'))
# 14
B=json.load(open(S+'linee-DWG-B-nel-modello.json'))
def lunga(a,b,e=.03):
  a,b=np.array(a),np.array(b);u=(b-a)/max(np.hypot(*(b-a)),1e-9);return (a-u*e,b+u*e)
LB=[lunga(a,b) for _,a,b in B]
tutte=[p for p in polygonize(unary_union([LineString(x) for x in LB])) if p.area>0.01]
U=unary_union(tutte);casa=max(list(U.geoms) if hasattr(U,'geoms') else [U],key=lambda p:p.area)
FPB=Polygon(casa.exterior).buffer(0.005).buffer(-0.005)
PBold=json.load(open('pianta_B.json'))
def poly_from(rs): return unary_union([Polygon(r[0],r[1:]) for r in rs]) if rs else Polygon()
mbase=unary_union([poly_from(PBold['muri']),poly_from(PBold['finestre'])])
mb,fb,sb,logb=piano(LB,FPB,json.load(open(S+'lati-B.json')),[],muri_dati=mbase)
json.dump({'livello':'B','muri':rings(mb),'finestre':rings(fb),'scale':sb,'testi':[]},open('pianta3_B.json','w'))
with open('aperture3-log.txt','w') as f:
  for r in log+[('B',)+x for x in logb]: f.write(' | '.join(map(str,r))+'\n')
print(open('aperture3-log.txt').read())
# 4, 5 e 7: distribuzione interna dalla scheda (Michele 16/10 sera); muri esterni dal DWG
import pickle
P=json.load(open('pianta3_T.json'))
def pf(rs): return unary_union([Polygon(r[0],r[1:]) for r in rs]) if rs else Polygon()
muri=pf(P['muri']);m=json.load(open(S+'model-z147.json'));TT=[x for x in m['levels'] if x['id']=='T'][0]
for n in (4,5,7):
  U=Polygon([u for u in TT['units'] if u['n']==n][0]['poly'][0]).buffer(0)
  Z=U.buffer(-0.03).intersection(v3.FP.buffer(-0.5,join_style=2))
  SM=pickle.load(open(f'schedamuri_{n}.pkl','rb'))
  muri=muri.difference(Z).union(SM.intersection(Z))
P['muri']=rings(muri);json.dump(P,open('pianta3_T.json','w'));print('schede 4 5 7 applicate')
# terrazzino bianco fra 5 e 7 (Michele 16/10 sera: nel DWG e' la X, non un muro) e le finestre che ci affacciano
from shapely.geometry import box
P=json.load(open('pianta3_T.json'));muri=pf(P['muri']);fin=pf(P['finestre'])
terr=box(6.217,-7.304,7.167,0.296)
muri=muri.difference(terr)
ff=[box(5.947,-4.704,6.217,-3.804),box(5.947,-0.854,6.217,0.146),box(5.947,-7.104,6.217,-6.104),box(7.167,-3.254,7.437,-2.254),box(7.167,-6.254,7.267,-5.554)]
for f in ff: muri=muri.difference(f)
fin=unary_union([fin]+ff)
P['muri']=rings(muri);P['finestre']=rings(fin);P['pavimenti']=[{'colore':'f4f3ef','anelli':rings(terr)}]
json.dump(P,open('pianta3_T.json','w'));print('terrazzino 5-7 fatto')
# 14 come la scheda (Michele 16/10 sera): muri, porte e finestre dai muri grigi della scheda; il forno resta il blocco del DWG
S14=pickle.load(open('schedamuri_14.pkl','rb'))
facceB=[p for p in polygonize(unary_union([LineString(x) for x in LB])) if 0.8<p.area<4 and p.area>0.85*p.minimum_rotated_rectangle.area and p.centroid.x<10 and p.centroid.y>28]
muri14=unary_union([S14]+facceB)
fin14=[]
for l in json.load(open(S+'lati-B.json')):
  a=np.array(l['a'],float);b=np.array(l['b'],float);Lg=np.hypot(*(b-a));u=(b-a)/Lg;n=np.array([-u[1],u[0]])
  if not FPB.contains(Point(*((a+b)/2+n*0.3))): n=-n
  for ap in l['aperture']:
    if ap.get('porta') is False and ap.get('scheda'):
      s0,s1=ap['scheda'];fin14.append(Polygon([a+u*s0-n*0.12,a+u*s1-n*0.12,a+u*s1+n*0.42,a+u*s0+n*0.42]))
fin14=unary_union(fin14).difference(muri14) if fin14 else Polygon()
json.dump({'livello':'B','muri':rings(muri14),'finestre':rings(fin14),'scale':[],'testi':[]},open('pianta3_B.json','w'));print('14 dalla scheda')
# scaletta del soppalco nella camera del 3 (Michele 16/10 sera: non e' un muro, sono scale)
P=json.load(open('pianta3_T.json'));muri=pf(P['muri'])
sc3=box(-10.783,3.726,-8.633,4.296);muri=muri.difference(sc3.buffer(0.005,join_style=2))
P['muri']=rings(muri)
P['scale']=P['scale']+[[[-10.783,3.726],[-8.633,3.726]],[[-10.783,4.005],[-8.633,4.005]],[[-10.783,4.296],[-8.633,4.296]],[[-9.708,3.726],[-9.708,4.296]],[[-10.783,3.726],[-10.783,4.296]],[[-8.633,3.726],[-8.633,4.296]]]
json.dump(P,open('pianta3_T.json','w'));print('scala soppalco 3 libera')

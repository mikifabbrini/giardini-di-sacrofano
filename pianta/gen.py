import json,sys,pickle,numpy as np
from shapely.geometry import LineString,Polygon,box,mapping
from shapely.ops import unary_union,polygonize
from PIL import Image,ImageDraw,ImageFont
Ls,rects=pickle.load(open('rects_t.pkl','rb'))
D=pickle.load(open('facce_t.pkl','rb'))
x0,x1,z0,z1=-20,21,-14,15
ang=[np.arctan2((b-a)[1],(b-a)[0])%np.pi for a,b,L in Ls]
def par(i,j,tol=1.5):
  d=abs(ang[i]-ang[j]);d=min(d,np.pi-d);return d<np.radians(tol)
# finestre: >=3 linee parallele con la stessa estensione, entro 0,7 m
fin=[];usate=set()
for i,(a,b,L) in enumerate(Ls):
  if not(0.35<=L<=3.2) or i in usate: continue
  u=(b-a)/L;n=np.array([-u[1],u[0]])
  grp=[(0.0,i)]
  for j,(c,d,M) in enumerate(Ls):
    if j==i or not par(i,j) or abs(M-L)>0.04: continue
    s=sorted([np.dot(c-a,u),np.dot(d-a,u)])
    if abs(s[0])>0.04 or abs(s[1]-L)>0.04: continue
    t=np.dot(c-a,n)
    if abs(t)<=0.7: grp.append((t,j))
  if len(grp)>=3:
    ts=sorted(t for t,_ in grp)
    if ts[-1]-ts[0]<0.12: continue
    # passo regolare e tanti = scala, non finestra
    if len(grp)>=5: continue
    for _,j in grp: usate.add(j)
    fin.append(Polygon([a+n*ts[0],b+n*ts[0],b+n*ts[-1],a+n*ts[-1]]))
fin=[f for k,f in enumerate(fin) if not any(k2<k and f.intersection(f2).area>0.6*f.area for k2,f2 in enumerate(fin))]
# scale: >=5 linee parallele lunghe uguali a passo 0,2-0,4
sc_lines=set();scale=[]
for i,(a,b,L) in enumerate(Ls):
  if not(0.6<=L<=2.2): continue
  u=(b-a)/L;n=np.array([-u[1],u[0]]);grp=[(0.0,i)]
  for j,(c,d,M) in enumerate(Ls):
    if j==i or not par(i,j,3) or abs(M-L)>0.15: continue
    s=sorted([np.dot(c-a,u),np.dot(d-a,u)])
    if abs(s[0])>0.2 or abs(s[1]-L)>0.2: continue
    t=np.dot(c-a,n)
    if abs(t)<=3.5: grp.append((t,j))
  ts=sorted(grp)
  # catena con passo 0,18-0,40
  best=[]
  cur=[ts[0]]
  for t in ts[1:]:
    if 0.18<=t[0]-cur[-1][0]<=0.42: cur.append(t)
    elif t[0]-cur[-1][0]>0.42:
      if len(cur)>len(best): best=cur
      cur=[t]
  if len(cur)>len(best): best=cur
  if len(best)>=5 and any(t==0.0 for t,_ in best):
    for _,j in best: sc_lines.add(j)
for j in sc_lines: scale.append(j)
sz=unary_union([box(*LineString([Ls[j][0],Ls[j][1]]).buffer(0.05).bounds) for j in sc_lines]) if sc_lines else None
zona_scale=unary_union([LineString([Ls[j][0],Ls[j][1]]).buffer(0.2) for j in sc_lines]).buffer(0.1) if sc_lines else Polygon()
# muri: rettangoli fuori dalle scale + facce sottili chiuse (angoli)
R=[r for r,t,l,i,j in rects if not (i in sc_lines or j in sc_lines)]
R=[r for r in R if r.intersection(zona_scale).area<0.5*r.area]
muri=unary_union(R)
ang_f=[p for p,t in D if t<=0.8 and p.area<0.9 and p.area>0.85*p.minimum_rotated_rectangle.area and p.intersects(muri.buffer(0.01)) and p.intersection(zona_scale).area<0.3*p.area]
muri=unary_union([muri]+ang_f).buffer(0.004).buffer(-0.004)
muri=unary_union([p for p in (muri.geoms if hasattr(muri,'geoms') else [muri]) if p.area>0.03])
finestre=unary_union(fin)
pickle.dump((muri,finestre,sc_lines,zona_scale),open('pianta_t.pkl','wb'))
s=40;W,H=int((x1-x0)*s),int((z1-z0)*s)
im=Image.new('RGB',(W,H),'white');d=ImageDraw.Draw(im)
P=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
def fill(geom,col):
  for p in (geom.geoms if hasattr(geom,'geoms') else [geom]):
    if p.is_empty: continue
    d.polygon([P(q) for q in p.exterior.coords],fill=col)
    for h in p.interiors: d.polygon([P(q) for q in h.coords],fill='white')
fill(muri,(40,40,40));fill(finestre,(80,170,230))
for j in sc_lines: a,b,L=Ls[j]; d.line([P(a),P(b)],fill=(230,120,0),width=2)
im.save('pianta_t.png');print('finestre',len(fin),'linee scala',len(sc_lines),'pezzi muro',len(muri.geoms) if hasattr(muri,'geoms') else 1)
# esportazione per il viewer
g=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/strumenti/geom.json'))
T=lambda p:(p[0]-1053.5,-(p[1]+410))
def rings(geom):
  out=[]
  for p in (geom.geoms if hasattr(geom,'geoms') else [geom]):
    if p.is_empty or p.area<0.01: continue
    p=p.simplify(0.003)
    out.append([[[round(x,3),round(z,3)] for x,z in p.exterior.coords[:-1]]]+[[[round(x,3),round(z,3)] for x,z in h.coords[:-1]] for h in p.interiors])
  return out
muri_netti=muri.difference(finestre.buffer(0.002))
testi=[]
for p,t in g['T']:
  q=T(p)
  if x0<=q[0]<=x1 and z0<=q[1]<=z1 and t and len(t)>1 and t not in ('A','B'): testi.append([round(q[0],2),round(q[1],2),t])
out={'livello':'T','muri':rings(muri_netti),'finestre':rings(finestre),'scale':[[[round(v,3) for v in Ls[j][0]],[round(v,3) for v in Ls[j][1]]] for j in sc_lines],'testi':testi}
json.dump(out,open('pianta_T.json','w'))
print('json',len(out['muri']),len(out['finestre']),len(out['scale']),len(out['testi']))

import json,sys,numpy as np
from shapely.geometry import LineString,Polygon,Point
from shapely.ops import unary_union,polygonize
from PIL import Image,ImageDraw,ImageFont
from v2 import linee,tappi,spess,g,T
m=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/check-piano-terra-20261015/sorgenti/model-z147.json'))
LT=[x for x in m['levels'] if x['id']=='T'][0]
FP=Polygon(LT['footprint'][0]).buffer(0)
def stanze(x0,x1,z0,z1,L=None,FP=FP,senza=()):
  L=linee(x0,x1,z0,z1) if L is None else L
  L=[x for x in L if np.hypot(*(x[1]-x[0]))>0.05]
  if senza: L=[x for i,x in enumerate(L) if i not in senza]
  # crocette delle porte: due segmenti corti perpendicolari che si incrociano
  segs=[LineString(x) for x in L];corti=[i for i,(a,b) in enumerate(L) if np.hypot(*(b-a))<=0.8]
  croce=set()
  for i in corti:
    for j in corti:
      if j<=i: continue
      a,b=L[i];c,d=L[j];u=(b-a)/np.hypot(*(b-a));v=(d-c)/np.hypot(*(d-c))
      if abs(np.dot(u,v))>0.05: continue
      I=segs[i].intersection(segs[j])
      if I.is_empty or I.geom_type!='Point': continue
      p=np.array(I.coords[0])
      if min(np.hypot(*(p-a)),np.hypot(*(p-b)))>0.08 and min(np.hypot(*(p-c)),np.hypot(*(p-d)))>0.08: croce|={i,j}
  global CROCI;CROCI=[L[i] for i in croce]
  # scale: tante linee parallele uguali a passo regolare
  from lib import build
  _,_,_,sc=build(L) if False else (None,None,None,set())
  L=[x for i,x in enumerate(L) if i not in croce]
  # linee di sezione (A-A, B-B): lunghe e attraversano tanti muri
  segs=[LineString(x) for x in L];togli=set()
  for i,(a,b) in enumerate(L):
    if np.hypot(*(b-a))<6: continue
    n=0
    for j,s2 in enumerate(segs):
      if j==i: continue
      I=segs[i].intersection(s2)
      if not I.is_empty and I.geom_type=='Point' and min(I.distance(Point(a)),I.distance(Point(b)))>0.05 and min(I.distance(Point(s2.coords[0])),I.distance(Point(s2.coords[-1])))>0.05: n+=1
    if n>=6: togli.add(i)
  print('linee di sezione tolte',len(togli))
  L=[x for i,x in enumerate(L) if i not in togli]
  C=tappi(L)
  F=list(polygonize(unary_union([LineString(s) for s in L+C])))
  def ortog(p):
    c=list(p.exterior.coords);tot=0;ok=0
    for a,b in zip(c,c[1:]):
      dx,dz=b[0]-a[0],b[1]-a[1];l=np.hypot(dx,dz);tot+=l
      if l>0 and (abs(dx)/l>0.996 or abs(dz)/l>0.996): ok+=l
    return ok/tot if tot else 0
  dentro=FP.buffer(0.05)
  bordo=LineString(FP.exterior.coords)
  R=[p for p in F if p.area>0.5 and spess(p)>0.82 and p.area/p.length>0.28 and not (p.distance(bordo)<0.04 and p.area/p.length<0.42) and (ortog(p)>0.9 or p.area>3) and dentro.contains(p.representative_point())]
  # rete dei muri fusa con una stanza (contorno della stanza aperto): la stanza e' la parte larga (apertura morfologica)
  global FUSI;FUSI=[]
  from lib import build as _b
  _,muri_coppie,_,_=_b(L)
  for p in F:
    if p in R or not (p.distance(bordo)<0.04 and p.area/p.length<0.42) or spess(p)<1.3: continue
    o=p.buffer(-0.6,join_style=2).buffer(0.6,join_style=2).intersection(p)
    o=o.difference(muri_coppie.buffer(0.002))  # dentro la faccia fusa i muri a coppie di linee restano muri
    FUSI.append(p)
    for q in (o.geoms if hasattr(o,'geoms') else [o]):
      if q.geom_type=='Polygon' and q.area>1.5: R.append(q)
  # cornici chiuse dentro una stanza (soppalco, riquadri): sono pavimento
  R+=[p for p in F if p not in R and len(p.interiors)>0 and p.area<15 and any(Polygon(p.exterior).contains(q.representative_point()) for q in R) and p.area/p.length<0.28 and spess(p)<0.5 and Polygon(p.exterior).area<40]
  # simboli dentro le stanze (triangoli, croci): restano pavimento
  R+= [p for p in F if p not in R and ortog(p)<0.5 and p.area<2.5 and dentro.contains(p.representative_point())]
  # porte interne: gruppi di facce piccole fra due stanze diverse
  sott=[p for p in F if p not in R and dentro.contains(p.representative_point()) and p.area<1.2]
  def dims(p):
    r=p.minimum_rotated_rectangle;c=list(r.exterior.coords);return sorted([np.hypot(c[k+1][0]-c[k][0],c[k+1][1]-c[k][1]) for k in range(2)])
  sott=[p for p in sott if dims(p)[1]<=1.45 and dims(p)[0]<=0.9]
  grp=[];vis=set()
  for k,p in enumerate(sott):
    if k in vis: continue
    st=[k];vis.add(k);G=[]
    while st:
      a=st.pop();G.append(sott[a])
      for b,q in enumerate(sott):
        if b not in vis and q.distance(sott[a])<0.005: vis.add(b);st.append(b)
    grp.append(unary_union(G))
  D=[]
  for G in grp:
    dd=dims(G)
    if dd[1]>1.45 or dd[1]<0.55 or dd[0]>0.9: continue
    tocca=[q for q in R if q.distance(G)<0.05]
    if len(tocca)>=2: D.append(G)
  return L,C,F,R,D
if __name__=='__main__':
  x0,x1,z0,z1=map(float,sys.argv[1:5]);nome=sys.argv[5]
  L,C,F,R,D=stanze(-21,22,-15,16)
  ST=unary_union(R+D);muri=FP.difference(ST)
  s=int(sys.argv[6]) if len(sys.argv)>6 else 90;W,H=int((x1-x0)*s),int((z1-z0)*s);im=Image.new('RGB',(W,H),'white');d=ImageDraw.Draw(im,'RGBA')
  Pp=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
  for p in (muri.geoms if hasattr(muri,'geoms') else [muri]):
    d.polygon([Pp(q) for q in p.exterior.coords],fill=(220,40,40,120))
    for h in p.interiors: d.polygon([Pp(q) for q in h.coords],fill=(255,255,255,255))
  for a,b in L: d.line([Pp(a),Pp(b)],fill=(0,0,0),width=1)
  d.line([Pp(q) for q in FP.exterior.coords],fill=(0,150,0),width=2)
  f=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',14)
  for i in range(int(x0),int(x1)+1): d.text(((i-x0)*s+2,2),str(i),fill=(90,90,200),font=f)
  for i in range(int(z0),int(z1)+1): d.text((2,(i-z0)*s+2),str(i),fill=(90,90,200),font=f)
  im.save(nome);print('stanze',len(R),'porte',len(D))

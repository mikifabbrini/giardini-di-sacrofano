import json,sys,numpy as np
from shapely.geometry import LineString,Polygon,Point,box
from shapely.ops import unary_union,polygonize
from PIL import Image,ImageDraw,ImageFont
g=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/strumenti/geom.json'))
T=lambda p:(p[0]-1053.5,-(p[1]+410))
def linee(x0,x1,z0,z1):
  out=[]
  for a,b in g['L']:
    a,b=np.array(T(a)),np.array(T(b))
    if all(x0-3<=p[0]<=x1+3 and z0-3<=p[1]<=z1+3 for p in (a,b)) and np.hypot(*(b-a))>0.02: out.append((a,b))
  return out
def tappi(L):
  # stipiti: da ogni estremita' libera parte un segmento perpendicolare fino alla prima linea entro 0,85 m
  segs=[LineString([a,b]) for a,b in L]
  from shapely.strtree import STRtree
  tree=STRtree(segs)
  caps=[]
  for k,(a,b) in enumerate(L):
    for p,q in ((a,b),(b,a)):
      P=Point(p);vic=[j for j in tree.query(P.buffer(0.006)) if j!=k and segs[j].distance(P)<0.006]
      if vic: continue
      u=(q-p)/np.hypot(*(q-p));n=np.array([-u[1],u[0]]);best=None
      for sgn in (1,-1):
        R=LineString([p+n*sgn*0.01,p+n*sgn*0.85])
        for j in tree.query(R):
          if j==k: continue
          I=R.intersection(segs[j])
          if I.is_empty: continue
          pts=[I] if I.geom_type=='Point' else ([Point(c) for c in I.coords] if hasattr(I,'coords') else [])
          for pt in pts:
            dd=Point(p).distance(pt)
            if dd>0.05 and (best is None or dd<best[0]): best=(dd,np.array(pt.coords[0]))
      if best: caps.append((p,best[1]))
      # prolunga la linea interrotta fino alla prima linea entro 0,55 m (giunti a T lasciati aperti nel DWG)
      R=LineString([p-u*0.01,p-u*0.55]);hit=None
      for j in tree.query(R):
        if j==k: continue
        I=R.intersection(segs[j])
        if I.is_empty or I.geom_type!='Point': continue
        dd=Point(p).distance(I)
        if dd>0.02 and (hit is None or dd<hit[0]): hit=(dd,np.array(I.coords[0]))
      if hit: caps.append((p,hit[1]))
  return caps
def spess(p):
  lo,hi=0,3
  for _ in range(12):
    m=(lo+hi)/2
    if p.buffer(-m/2).is_empty: hi=m
    else: lo=m
  return lo
def facce(x0,x1,z0,z1):
  L=linee(x0,x1,z0,z1);C=tappi(L)
  u=unary_union([LineString(s) for s in L+C])
  F=[(p,spess(p)) for p in polygonize(u) if p.area>0.003]
  return L,C,F
if __name__=='__main__':
  x0,x1,z0,z1=map(float,sys.argv[1:5]);nome=sys.argv[5]
  L,C,F=facce(x0,x1,z0,z1)
  s=90;W,H=int((x1-x0)*s),int((z1-z0)*s);im=Image.new('RGB',(W,H),'white');d=ImageDraw.Draw(im,'RGBA')
  P=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
  for p,t in F:
    if t<=0.82 and p.area>=0.6*p.minimum_rotated_rectangle.area: d.polygon([P(q) for q in p.exterior.coords],fill=(220,40,40,110))
  for a,b in L: d.line([P(a),P(b)],fill=(0,0,0),width=1)
  for a,b in C: d.line([P(a),P(b)],fill=(0,120,255),width=2)
  f=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',14)
  for i in range(int(x0),int(x1)+1): d.text(((i-x0)*s+2,2),str(i),fill=(90,90,200),font=f)
  for i in range(int(z0),int(z1)+1): d.text((2,(i-z0)*s+2),str(i),fill=(90,90,200),font=f)
  for p,t in g['T']:
    q=T(p)
    if x0<=q[0]<=x1 and z0<=q[1]<=z1: d.text(P(q),t,fill=(0,140,0),font=f)
  im.save(nome);print(len(L),'tappi',len(C))

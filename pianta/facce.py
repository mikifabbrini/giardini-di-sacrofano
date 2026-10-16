import json,sys,pickle
from shapely.geometry import LineString,Polygon
from shapely.ops import unary_union,polygonize
from PIL import Image,ImageDraw,ImageFont
g=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/strumenti/geom.json'))
T=lambda p:(round(p[0]-1053.5,4),round(-(p[1]+410),4))
x0,x1,z0,z1=-20,21,-14,15
L=[]
for a,b in g['L']:
  a,b=T(a),T(b)
  if all(x0<=p[0]<=x1 and z0<=p[1]<=z1 for p in (a,b)) and a!=b: L.append(LineString([a,b]))
u=unary_union(L)
F=[p for p in polygonize(u) if p.area>0.004]
def spess(p):
  lo,hi=0,3
  for _ in range(14):
    m=(lo+hi)/2
    if p.buffer(-m/2).is_empty: hi=m
    else: lo=m
  return lo
D=[(p,spess(p)) for p in F]
pickle.dump(D,open('facce_t.pkl','wb'))
print(len(L),'linee',len(F),'facce')
s=40;W,H=int((x1-x0)*s),int((z1-z0)*s)
im=Image.new('RGB',(W,H),'white');d=ImageDraw.Draw(im)
P=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
for p,t in D:
  col=(40,40,40) if t<=.62 else (225,240,230)
  if t<=.62 and t<0.13: col=(70,110,200)
  d.polygon([P(q) for q in p.exterior.coords],fill=col)
for l in L: d.line([P(q) for q in l.coords],fill=(200,0,0),width=1)
im.save('facce_t.png')

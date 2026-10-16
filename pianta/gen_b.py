import json,numpy as np
from lib import build,rings
from PIL import Image,ImageDraw
B=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/check-piano-terra-20261015/sorgenti/linee-DWG-B-nel-modello.json'))
def lunga(a,b,e=.03):
  a,b=np.array(a),np.array(b);u=(b-a)/max(np.hypot(*(b-a)),1e-9);return (a-u*e,b+u*e)
Ls,muri,fin,sc=build([lunga(a,b) for _,a,b in B])
from shapely.ops import unary_union,polygonize
from shapely.geometry import LineString
muri=muri.buffer(0.14,join_style=2).buffer(-0.14,join_style=2) # angoli chiusi
facce=[p for p in polygonize(unary_union([LineString([a,b]) for a,b,L in Ls])) if 0.8<p.area<4 and p.area>0.85*p.minimum_rotated_rectangle.area]
forno=[p for p in facce if p.centroid.x<10 and p.centroid.y>28]
print('forno',[round(p.area,2) for p in forno])
muri=unary_union([muri]+forno)
from shapely.geometry import Point
tutte=[p for p in polygonize(unary_union([LineString([a,b]) for a,b,L in Ls])) if p.area>0.01]
casa=max([p for p in unary_union(tutte).geoms] if hasattr(unary_union(tutte),'geoms') else [unary_union(tutte)],key=lambda p:p.area)
casa=casa.buffer(0.01).buffer(-0.01)
cors=[casa.intersection(Point(q).buffer(0.32,cap_style=3)) for q in casa.exterior.coords[:-1]]
cors=[c for c in cors if c.intersection(muri).area>0.3*c.area]
muri=unary_union([muri]+cors).buffer(0.003).buffer(-0.003)
print('angoli',len(cors))
x0,x1,z0,z1=4,20,13,36;s=50
im=Image.new('RGB',(int((x1-x0)*s),int((z1-z0)*s)),'white');d=ImageDraw.Draw(im);P=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
def fill(g,c):
  for p in (g.geoms if hasattr(g,'geoms') else [g]):
    if p.is_empty: continue
    d.polygon([P(q) for q in p.exterior.coords],fill=c)
    for h in p.interiors: d.polygon([P(q) for q in h.coords],fill='white')
fill(muri,(40,40,40));fill(fin,(80,170,230))
for a,b,L in Ls: d.line([P(a),P(b)],fill=(220,0,0),width=1)
im.save('pianta_b.png')
json.dump({'livello':'B','muri':rings(muri.difference(fin.buffer(0.002)) if not fin.is_empty else muri),'finestre':rings(fin),'scale':[[list(np.round(Ls[j][0],3)),list(np.round(Ls[j][1],3))] for j in sc],'testi':[]},open('pianta_B.json','w'))
print(len(Ls),'muri',len(rings(muri)),'fin',len(rings(fin)))

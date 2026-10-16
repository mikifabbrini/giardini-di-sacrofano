import json
from shapely.geometry import Polygon
from shapely.ops import unary_union
from gen3 import rings
def pf(rs): return unary_union([Polygon(r[0],r[1:]).buffer(0) for r in rs]) if rs else Polygon()
def pulisci(g,min_area=0.03):
  # chiude fessure e toglie schegge sotto i 2 cm, raddrizza i dentini dei raster, butta i pezzetti
  g=g.buffer(0.012,join_style=2).buffer(-0.024,join_style=2).buffer(0.012,join_style=2)
  g=g.simplify(0.015,preserve_topology=True)
  parts=[p for p in (g.geoms if hasattr(g,'geoms') else [g]) if p.geom_type=='Polygon' and p.area>=min_area]
  out=[]
  for p in parts:
    holes=[h for h in p.interiors if Polygon(h).area>0.02]
    out.append(Polygon(p.exterior,holes))
  return unary_union(out)
for liv in ('T','B','1','2'):
  P=json.load(open(f'pianta3_{liv}.json'))
  m=pulisci(pf(P['muri']));f=pulisci(pf(P['finestre']),0.02)
  m=m.difference(f.buffer(0.002,join_style=2))
  m=unary_union([p for p in (m.geoms if hasattr(m,'geoms') else [m]) if p.geom_type=='Polygon' and p.area>=0.03])
  n0=len(P['muri']);P['muri']=rings(m,0.03);P['finestre']=rings(f,0.02)
  json.dump(P,open(f'pianta3_{liv}.json','w'));print(liv,'pezzi muro',n0,'->',len(P['muri']),'finestre',len(P['finestre']))

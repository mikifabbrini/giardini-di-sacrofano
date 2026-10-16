import json,sys,numpy as np,pickle
from shapely.geometry import LineString,Polygon,Point,box
from shapely.ops import unary_union,polygonize
import v3
from v2 import spess
from lib import build
from p1 import linee_liv,testi_liv,FP
from gen3 import rings
def pianta_liv(liv):
  L=linee_liv(liv);fp,lev=FP(liv)
  Lb,muri_c,fin,sc=build(L)
  zona=unary_union([LineString(L[j]).buffer(0.25) for j in sc]).buffer(0.05) if sc else Polygon()
  Ls,C,F,R,D=v3.stanze(0,0,0,0,L=L,FP=fp,senza=sc)
  muri=fp.difference(unary_union(R+D)).difference(zona)
  muri=unary_union([p for p in (muri.geoms if hasattr(muri,'geoms') else [muri]) if p.area>0.02])
  # finestre della pianta DWG dentro i muri esterni
  def vera(gm):
    r=gm.minimum_rotated_rectangle;c=list(r.exterior.coords)[:4];e=sorted([LineString([c[i],c[(i+1)%4]]) for i in range(4)],key=lambda x:x.length)
    corto,lungo=e[0].length,e[-1].length
    if not(0.12<=corto<=0.8 and lungo>=0.45 and lungo>=1.3*corto): return False
    q=e[-1];p0,p1=np.array(q.coords[0]),np.array(q.coords[1]);v=(p1-p0)/np.hypot(*(p1-p0));cc=np.array(gm.centroid.coords[0]);h=lungo/2
    mb=muri.buffer(0.03)
    return mb.contains(Point(*(cc+v*(h+0.12)))) and mb.contains(Point(*(cc-v*(h+0.12)))) and gm.distance(fp.exterior)<0.08
  FF=[x for x in (fin.geoms if hasattr(fin,'geoms') else [fin]) if not x.is_empty and vera(x)]
  finestre=unary_union(FF) if FF else Polygon()
  muri=muri.difference(finestre)
  return L,fp,lev,muri,finestre,sc
if __name__=='__main__':
  out={}
  for liv in ('1','2'):
    L,fp,lev,muri,fin,sc=pianta_liv(liv)
    out[liv]=(L,fp,lev,muri,fin,sc)
    json.dump({'livello':liv,'muri':rings(muri),'finestre':rings(fin),'scale':[[list(np.round(L[j][0],3)),list(np.round(L[j][1],3))] for j in sc],'testi':testi_liv(liv)},open(f'pianta3_{liv}.json','w'))
    print(liv,'muri',len(rings(muri)),'finestre',len(rings(fin)),'scale',len(sc))
  pickle.dump({k:(v[3],v[4]) for k,v in out.items()},open('p1_tmp.pkl','wb'))

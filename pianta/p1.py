import json,numpy as np
from shapely.geometry import Polygon
g=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/strumenti/geom.json'))
OFF=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/strumenti/floor_offsets.json'))
m=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/check-piano-terra-20261015/sorgenti/model-z147.json'))
def Tf(liv):
  dx,dy=OFF[liv];return lambda p:(p[0]+dx-1053.5,-(p[1]+dy+410))
def linee_liv(liv,x0=-21,x1=22,z0=-15,z1=16):
  T=Tf(liv);out=[]
  for a,b in g['L']:
    a,b=np.array(T(a)),np.array(T(b))
    if all(x0-3<=p[0]<=x1+3 and z0-3<=p[1]<=z1+3 for p in (a,b)) and np.hypot(*(b-a))>0.05: out.append((a,b))
  return out
def testi_liv(liv):
  T=Tf(liv);return [[round(T(p)[0],2),round(T(p)[1],2),t] for p,t in g['T'] if -20<=T(p)[0]<=21 and -14<=T(p)[1]<=15 and t and len(t)>1 and t not in ('A','B')]
def FP(liv):
  l=[x for x in m['levels'] if x['id']==liv][0];return Polygon(l['footprint'][0]).buffer(0),l

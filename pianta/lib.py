import numpy as np
from shapely.geometry import LineString,Polygon,box
from shapely.ops import unary_union,polygonize
def build(segs):
  Ls=[]
  for a,b in segs:
    a,b=np.array(a,float),np.array(b,float);L=np.hypot(*(b-a))
    if L>0.05: Ls.append((a,b,L))
  ang=[np.arctan2((b-a)[1],(b-a)[0])%np.pi for a,b,L in Ls]
  def par(i,j,tol=1.5):
    d=abs(ang[i]-ang[j]);d=min(d,np.pi-d);return d<np.radians(tol)
  rects=[]
  for i,(a,b,L) in enumerate(Ls):
    if L<0.12: continue
    u=(b-a)/L;n=np.array([-u[1],u[0]])
    for j,(c,d,M) in enumerate(Ls):
      if j<=i or M<0.12 or not par(i,j): continue
      dist=np.dot(c-a,n)
      if not (0.06<=abs(dist)<=0.78): continue
      s=sorted([np.dot(c-a,u),np.dot(d-a,u)]);lo=max(0,s[0]);hi=min(L,s[1])
      if hi-lo<0.1: continue
      blocked=False
      for k,(e,f,N) in enumerate(Ls):
        if k in (i,j) or N<0.1 or not par(k,i): continue
        t=np.dot(e-a,n)
        if not (min(0,dist)+0.01<t<max(0,dist)-0.01): continue
        s2=sorted([np.dot(e-a,u),np.dot(f-a,u)])
        if min(hi,s2[1])-max(lo,s2[0])>0.5*(hi-lo): blocked=True;break
      if blocked: continue
      if abs(dist)>0.3:
        def gem(k,lato):
          e0=Ls[k][0]
          for q,(e,f,N) in enumerate(Ls):
            if q==k or N<0.1 or not par(q,i): continue
            t=np.dot(e-e0,n)*lato
            if 0.04<t<=0.16:
              s2=sorted([np.dot(e-a,u),np.dot(f-a,u)])
              if min(hi,s2[1])-max(lo,s2[0])>0.3*(hi-lo): return True
          return False
        sg=1 if dist>0 else -1
        if gem(i,-sg) and gem(j,sg): continue
      p1=a+u*lo;p2=a+u*hi
      rects.append((Polygon([p1,p2,p2+n*dist,p1+n*dist]),i,j))
  # finestre
  fin=[];usate=set()
  for i,(a,b,L) in enumerate(Ls):
    if not(0.35<=L<=3.2) or i in usate: continue
    u=(b-a)/L;n=np.array([-u[1],u[0]]);grp=[(0.0,i)]
    for j,(c,d,M) in enumerate(Ls):
      if j==i or not par(i,j) or abs(M-L)>0.04: continue
      s=sorted([np.dot(c-a,u),np.dot(d-a,u)])
      if abs(s[0])>0.04 or abs(s[1]-L)>0.04: continue
      t=np.dot(c-a,n)
      if abs(t)<=0.7: grp.append((t,j))
    if 3<=len(grp)<5:
      ts=sorted(t for t,_ in grp)
      if ts[-1]-ts[0]<0.12: continue
      for _,j in grp: usate.add(j)
      fin.append(Polygon([a+n*ts[0],b+n*ts[0],b+n*ts[-1],a+n*ts[-1]]))
  fin=[f for k,f in enumerate(fin) if not any(k2<k and f.intersection(f2).area>0.6*f.area for k2,f2 in enumerate(fin))]
  # scale
  sc=set()
  for i,(a,b,L) in enumerate(Ls):
    if not(0.6<=L<=2.2): continue
    u=(b-a)/L;n=np.array([-u[1],u[0]]);grp=[(0.0,i)]
    for j,(c,d,M) in enumerate(Ls):
      if j==i or not par(i,j,3) or abs(M-L)>0.15: continue
      s=sorted([np.dot(c-a,u),np.dot(d-a,u)])
      if abs(s[0])>0.2 or abs(s[1]-L)>0.2: continue
      t=np.dot(c-a,n)
      if abs(t)<=3.5: grp.append((t,j))
    ts=sorted(grp);best=[];cur=[ts[0]]
    for t in ts[1:]:
      if 0.18<=t[0]-cur[-1][0]<=0.42: cur.append(t)
      elif t[0]-cur[-1][0]>0.42:
        if len(cur)>len(best): best=cur
        cur=[t]
    if len(cur)>len(best): best=cur
    if len(best)>=5 and any(t==0.0 for t,_ in best):
      for _,j in best: sc.add(j)
  zs=unary_union([LineString([Ls[j][0],Ls[j][1]]).buffer(0.2) for j in sc]).buffer(0.1) if sc else Polygon()
  R=[r for r,i,j in rects if not(i in sc or j in sc) and r.intersection(zs).area<0.5*r.area]
  muri=unary_union(R)
  # angoli: facce chiuse sottili e rettangolari
  u=unary_union([LineString([a,b]) for a,b,L in Ls])
  def spess(p):
    lo,hi=0,3
    for _ in range(12):
      m=(lo+hi)/2
      if p.buffer(-m/2).is_empty: hi=m
      else: lo=m
    return lo
  F=[p for p in polygonize(u) if p.area>0.004]
  ang_f=[p for p in F if p.area<0.9 and p.area>0.85*p.minimum_rotated_rectangle.area and spess(p)<=0.8 and p.intersects(muri.buffer(0.01)) and p.intersection(zs).area<0.3*p.area]
  muri=unary_union([muri]+ang_f).buffer(0.004).buffer(-0.004)
  muri=unary_union([p for p in (muri.geoms if hasattr(muri,'geoms') else [muri]) if p.area>0.03])
  return Ls,muri,unary_union(fin) if fin else Polygon(),sc
def rings(geom):
  out=[]
  for p in (geom.geoms if hasattr(geom,'geoms') else [geom]):
    if p.is_empty or p.area<0.01: continue
    p=p.simplify(0.003)
    out.append([[[round(x,3),round(z,3)] for x,z in p.exterior.coords[:-1]]]+[[[round(x,3),round(z,3)] for x,z in h.coords[:-1]] for h in p.interiors])
  return out

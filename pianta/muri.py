import json,sys,pickle,numpy as np
from shapely.geometry import LineString,Polygon
from shapely.ops import unary_union
from PIL import Image,ImageDraw
g=json.load(open('/Users/michelefabbrini/Progetti/SACROFANO/sito/strumenti/geom.json'))
T=lambda p:(p[0]-1053.5,-(p[1]+410))
x0,x1,z0,z1=-20,21,-14,15
Ls=[]
for a,b in g['L']:
  a,b=np.array(T(a)),np.array(T(b))
  if all(x0<=p[0]<=x1 and z0<=p[1]<=z1 for p in (a,b)):
    L=np.hypot(*(b-a))
    if L>0.05: Ls.append((a,b,L))
ang=[np.arctan2((b-a)[1],(b-a)[0])%np.pi for a,b,L in Ls]
rects=[]
for i,(a,b,L) in enumerate(Ls):
  if L<0.12: continue
  u=(b-a)/L; n=np.array([-u[1],u[0]])
  for j,(c,d,M) in enumerate(Ls):
    if j<=i or M<0.12: continue
    da=abs(ang[i]-ang[j]); da=min(da,np.pi-da)
    if da>np.radians(1.5): continue
    dist=np.dot(c-a,n)
    if not (0.06<=abs(dist)<=0.78): continue
    s=sorted([np.dot(c-a,u),np.dot(d-a,u)]); lo=max(0,s[0]); hi=min(L,s[1])
    if hi-lo<0.1: continue
    # nessuna linea parallela in mezzo che copra il tratto
    blocked=False
    for k,(e,f,N) in enumerate(Ls):
      if k in (i,j) or N<0.1: continue
      db=abs(ang[k]-ang[i]); db=min(db,np.pi-db)
      if db>np.radians(1.5): continue
      t=np.dot(e-a,n)
      if not (min(0,dist)+0.01<t<max(0,dist)-0.01): continue
      s2=sorted([np.dot(e-a,u),np.dot(f-a,u)])
      if min(hi,s2[1])-max(lo,s2[0])>0.5*(hi-lo): blocked=True;break
    if blocked: continue
    # coppia larga fatta dalle facce esterne di due tramezzi (un corridoio): entrambe le linee hanno una gemella a <=0,16 m dall'altra parte
    if abs(dist)>0.3:
      def gemella(k,lato):
        e0,f0,_=Ls[k]
        for q,(e,f,N) in enumerate(Ls):
          if q==k or N<0.1: continue
          db=abs(ang[q]-ang[i]); db=min(db,np.pi-db)
          if db>np.radians(1.5): continue
          t=np.dot(e-e0,n)*lato
          if 0.04<t<=0.16:
            s2=sorted([np.dot(e-a,u),np.dot(f-a,u)])
            if min(hi,s2[1])-max(lo,s2[0])>0.3*(hi-lo): return True
        return False
      sg=1 if dist>0 else -1
      if gemella(i,-sg) and gemella(j,sg): continue
    p1=a+u*lo;p2=a+u*hi
    rects.append((Polygon([p1,p2,p2+n*dist,p1+n*dist]),abs(dist),hi-lo,i,j))
pickle.dump((Ls,rects),open('rects_t.pkl','wb'))
print(len(Ls),len(rects))
s=40;W,H=int((x1-x0)*s),int((z1-z0)*s)
im=Image.new('RGB',(W,H),'white');d=ImageDraw.Draw(im)
P=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
for r,t,l,i,j in rects:
  d.polygon([P(q) for q in r.exterior.coords],fill=(40,40,40) if t>0.13 else (60,110,210))
for a,b,L in Ls: d.line([P(a),P(b)],fill=(220,0,0),width=1)
im.save('rects_t.png')

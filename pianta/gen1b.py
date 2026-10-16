import json,pickle,numpy as np
from PIL import Image
from scipy import ndimage
from shapely.geometry import box,Polygon
from shapely.ops import unary_union
from p1 import FP,testi_liv
from gen3 import rings
A='/Users/michelefabbrini/Progetti/SACROFANO/sito/astra-check-piante/sorgenti/'
def muri_scheda(img,cal,x0,x1,z0,z1,res=0.02):
  a,b,tx,tz=cal['v'];M=np.array([[a,-b],[b,a]]);I=np.linalg.inv(M)
  Aimg=np.array(Image.open(A+img).convert('RGB')).astype(int)
  xs=np.arange(x0,x1,res)+res/2;zs=np.arange(z0,z1,res)+res/2;X,Z=np.meshgrid(xs,zs)
  P=np.stack([X-tx,Z-tz],-1)@I.T;px=P[...,0].round().astype(int);py=P[...,1].round().astype(int)
  ok=(px>=0)&(py>=0)&(px<Aimg.shape[1])&(py<Aimg.shape[0])
  rgb=Aimg[np.clip(py,0,Aimg.shape[0]-1),np.clip(px,0,Aimg.shape[1]-1)]
  g=(rgb.max(-1)-rgb.min(-1)<12)&(rgb.mean(-1)>135)&(rgb.mean(-1)<172)&ok
  g=ndimage.binary_closing(g,iterations=1);g=ndimage.binary_opening(g,iterations=1)
  bx=[]
  for i in range(g.shape[0]):
    row=g[i];j=0
    while j<len(row):
      if row[j]:
        k=j
        while k<len(row) and row[k]: k+=1
        bx.append(box(x0+j*res,z0+i*res,x0+k*res,z0+(i+1)*res));j=k
      else: j+=1
  return unary_union(bx).buffer(0.005).buffer(-0.005).simplify(0.01)
tmp=pickle.load(open('p1_tmp.pkl','rb'))
SCH={('1',8):('scheda-8-4x.png','8'),('1',9):('scheda-9-4x.png','9'),('1',10):('scheda-10-4x.png','10'),('1',11):('scheda-11-4x.png','11-p1'),('1',12):('scheda-12-4x.png','12'),('1',13):('scheda-13-4x.png','13'),('2',11):('scheda-11-4x.png','11-p2')}
for liv in ('1','2'):
  muri,fin=tmp[liv];fp,lev=FP(liv)
  for u in lev['units']:
    k=(liv,u['n'])
    if k not in SCH: continue
    img,cn=SCH[k];cal=json.load(open(A+f'calibrazione-{cn}.json'))['scheda']
    U=Polygon(u['poly'][0]).buffer(0);x0,z0,x1,z1=U.bounds
    SM=muri_scheda(img,cal,x0-.5,x1+.5,z0-.5,z1+.5)
    Z=U.buffer(-0.03).intersection(fp.buffer(-0.5,join_style=2))
    muri=muri.difference(Z).union(SM.intersection(Z).difference(fin))
    print(liv,u['n'],'scheda',round(SM.intersection(Z).area,2))
  P=json.load(open(f'pianta3_{liv}.json'));P['muri']=rings(muri);json.dump(P,open(f'pianta3_{liv}.json','w'))

import json,numpy as np
from PIL import Image
from scipy import ndimage
from shapely.geometry import box,Polygon
from shapely.ops import unary_union
S='/Users/michelefabbrini/Progetti/SACROFANO/sito/check-piano-terra-20261015/sorgenti/'
C=json.load(open(S+'calibrazioni.json'))
def muri_scheda(n,x0,x1,z0,z1,res=0.02):
  c=C[str(n)]['scheda'];a,b,tx,tz=c['v'];M=np.array([[a,-b],[b,a]]);I=np.linalg.inv(M)
  A=np.array(Image.open(S+f'scheda-{n}-4x.png').convert('RGB')).astype(int)
  xs=np.arange(x0,x1,res)+res/2;zs=np.arange(z0,z1,res)+res/2;X,Z=np.meshgrid(xs,zs)
  P=np.stack([X-tx,Z-tz],-1)@I.T;px=P[...,0].round().astype(int);py=P[...,1].round().astype(int)
  ok=(px>=0)&(py>=0)&(px<A.shape[1])&(py<A.shape[0])
  rgb=A[np.clip(py,0,A.shape[0]-1),np.clip(px,0,A.shape[1]-1)]
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
  U=unary_union(bx).buffer(0.005).buffer(-0.005).simplify(0.01)
  return U

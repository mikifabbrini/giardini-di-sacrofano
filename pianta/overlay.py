import json,sys,numpy as np
from PIL import Image,ImageDraw,ImageFont
S='/Users/michelefabbrini/Progetti/SACROFANO/sito/check-piano-terra-20261015/sorgenti/'
m=json.load(open(S+'model-z147.json'));C=json.load(open(S+'calibrazioni.json'))
T=[x for x in m['levels'] if x['id']=='T'][0]
PT=json.load(open('pianta_T2.json'));PB=json.load(open('pianta_B2.json'))
tav=Image.open('/Users/michelefabbrini/Progetti/SACROFANO/sito/fase3-claude/analisi-check/tav2-pianta-terra-4x.png').rotate(90,expand=True).convert('RGB')
f=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial Bold.ttf',22)
def warp(img,c,x0,z0,W,H,s):
  a,b,tx,tz=c['v'];M=np.array([[a,-b],[b,a]]);I=np.linalg.inv(M)
  xs=x0+(np.arange(W)+.5)/s;zs=z0+(np.arange(H)+.5)/s;X,Z=np.meshgrid(xs,zs)
  P=np.stack([X-tx,Z-tz],-1)@I.T
  A=np.array(img);px=np.clip(P[...,0].round().astype(int),0,A.shape[1]-1);py=np.clip(P[...,1].round().astype(int),0,A.shape[0]-1)
  out=A[py,px];bad=(P[...,0]<0)|(P[...,1]<0)|(P[...,0]>=A.shape[1])|(P[...,1]>=A.shape[0]);out[bad]=255;return Image.fromarray(out.astype('uint8'))
def tavola(n):
  if n==14: poly=[[q[0],q[1]] for r in PB['muri'] for q in r[0]];P=PB
  else: u=[u for u in T['units'] if u['n']==n][0];poly=u['poly'][0];P=PT
  xs=[q[0] for q in poly];zs=[q[1] for q in poly];x0,x1,z0,z1=min(xs)-1.2,max(xs)+1.2,min(zs)-1.2,max(zs)+1.2
  s=90;W,H=int((x1-x0)*s),int((z1-z0)*s)
  pans=[]
  for kind in ('scheda','tav2'):
    c=C[str(n)][kind]
    src=Image.open(S+f'scheda-{n}-4x.png').convert('RGB') if kind=='scheda' else (Image.open(S+'tav2-fabbricatoB-4x.png').convert('RGB') if n==14 else tav)
    im=warp(src,c,x0,z0,W,H,s).convert('RGBA');ov=Image.new('RGBA',im.size,(0,0,0,0));d=ImageDraw.Draw(ov)
    Q=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
    for r in P['muri']:
      for ring in r: d.polygon([Q(q) for q in ring],outline=(220,0,0,255))
    for r in P['finestre']:
      d.polygon([Q(q) for q in r[0]],fill=(0,140,255,110),outline=(0,90,255,255))
    im=Image.alpha_composite(im,ov).convert('RGB');ImageDraw.Draw(im).text((8,8),f'{n} {kind}',fill=(200,0,0),font=f)
    for i in range(int(x0),int(x1)+1): ImageDraw.Draw(im).text(((i-x0)*s+2,H-20),str(i),fill=(120,120,200),font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',14))
    for i in range(int(z0),int(z1)+1): ImageDraw.Draw(im).text((2,(i-z0)*s+2),str(i),fill=(120,120,200),font=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',14))
    pans.append(im)
  o=Image.new('RGB',(W*2+10,H),'white');o.paste(pans[0],(0,0));o.paste(pans[1],(W+10,0));o.save(f'ov-{n}.jpg',quality=85);print(n,o.size)
for n in map(int,sys.argv[1:]): tavola(n)

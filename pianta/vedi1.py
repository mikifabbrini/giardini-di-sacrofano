import json,sys
from PIL import Image,ImageDraw,ImageFont
from p1 import linee_liv
liv=sys.argv[1];P=json.load(open(f'pianta3_{liv}.json'));x0,x1,z0,z1=map(float,sys.argv[2:6]);out=sys.argv[6];s=int(sys.argv[7])
W,H=int((x1-x0)*s),int((z1-z0)*s);im=Image.new('RGB',(W,H),'white');d=ImageDraw.Draw(im,'RGBA')
Q=lambda q:((q[0]-x0)*s,(q[1]-z0)*s)
for r in P['muri']:
  d.polygon([Q(q) for q in r[0]],fill=(60,60,60,200))
  for h in r[1:]: d.polygon([Q(q) for q in h],fill=(255,255,255,255))
for r in P['finestre']: d.polygon([Q(q) for q in r[0]],fill=(40,150,255,220))
for a,b in P['scale']: d.line([Q(a),Q(b)],fill=(230,120,0),width=2)
for a,b in linee_liv(liv): d.line([Q(a),Q(b)],fill=(255,0,0,150),width=1)
f=ImageFont.truetype('/System/Library/Fonts/Supplemental/Arial.ttf',13)
for i in range(int(x0),int(x1)+1): d.text(((i-x0)*s+2,2),str(i),fill=(90,90,200),font=f)
for i in range(int(z0),int(z1)+1): d.text((2,(i-z0)*s+2),str(i),fill=(90,90,200),font=f)
im.save(out)

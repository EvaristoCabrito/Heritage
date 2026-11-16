from pathlib import Path
import json, shutil, sys
import numpy as np
from scipy import ndimage
from PIL import Image, ImageOps

root=Path('public/art')
stage=root/'buildings-construction-dark-v01'
final=root/'buildings-photoreal-v03-runtime'
sources=Path('tools/construction-art-pipeline/generated/guilds-v01')
manifest=Path('tools/construction-art-pipeline/construction-phases.json')
data=json.loads(manifest.read_text(encoding='utf8'))
sets={
 'warrior':('guild','guild-l2','guild-paladin','guild-heavy-knight'),
 'archer':('archer','archer-l2','archer-ranger','archer-assassin'),
 'lancer':('lancer','lancer-l2','lancer-sentinel','lancer-templar'),
 'blackMage':('tower','tower-l2-v02','tower-elementalist-v02','tower-warlock-v02'),
 'conjurer':('conjurer','conjurer-l2','conjurer-sorcerer','conjurer-necromancer'),
 'healer':('healer','healer-l2','healer-bishop','healer-cleric'),
 'moonwarden':('guild-moonwarden','guild-moonwarden-l2','guild-moonwarden-l3'),
 'vanguard':('guild-vanguard','guild-vanguard-swordsmaster','guild-vanguard-warbringer'),
}
ids=json.loads(sys.argv[1])
def save(im,path):
    if not path.exists(): im.save(path,lossless=True,method=4)
def register(img,w,h,height=0.92):
    rgba=np.array(img)
    r,g,b,a=np.moveaxis(rgba.astype('int16'),-1,0)
    alpha=rgba[:,:,3]
    alpha[(a<28)|((r-g>80)&(b<65))|((g-b>90)&(r-b>110))]=0
    labels,count=ndimage.label(alpha>=185,np.ones((3,3)))
    areas=np.bincount(labels.ravel()); areas[0]=0
    alpha[~ndimage.binary_dilation(areas[labels]>=max(32,areas.max()//120),iterations=2)]=0
    img=Image.fromarray(rgba)
    bbox=img.getbbox()
    assert bbox
    img=ImageOps.contain(img.crop(bbox),(round(w*.91),round(h*height)),Image.Resampling.LANCZOS)
    result=Image.new('RGBA',(w,h))
    result.paste(img,((w-img.width)//2,round(h*.96)-img.height))
    assert result.getchannel('A').getextrema()[1]>=200
    return result
for kind,(base,*upgrades) in sets.items():
    if base not in ids: continue
    original=(final/f'{base}.webp')
    if not original.exists(): original=root/f'{base}-v01.webp'
    w,h=Image.open(original).size
    atlas_path=sources/f'{base}-construction-atlas-v01.png'
    if not atlas_path.exists(): shutil.copyfile(ids[base],atlas_path)
    img=Image.open(atlas_path).convert('RGBA')
    aw,ah=img.size
    rows=[base,*upgrades] if original.parent==root else upgrades
    for y,art in enumerate(rows):
        cells=[register(img.crop((round(x*aw/2),round(y*ah/3),round((x+1)*aw/2),round((y+1)*ah/3))),w,h,
                        (0.42 if x == 0 else 0.75) if art == base else 0.92) for x in range(2)]
        phases={}
        if art==base:
            source=original
            outputs=[('early',cells[0]),('mid',cells[1])]
        else:
            source=final/f'{art}.webp'
            save(cells[1],source)
            outputs=[('mid',cells[0])]
        for phase,im in outputs:
            path=stage/f'{art}-{phase}.webp'
            save(im,path)
            phases[phase]={'file':path.as_posix(),'size':[w,h],'alpha':list(im.getchannel('A').getextrema())}
        data['assets'][art]={'source':source.relative_to(root).as_posix(),'phases':phases}
        data['constructionProfiles'].setdefault(art,f'{art} · reforma fotorealista a partir de {base}.')
    data['buildingTypes'][kind]=list(dict.fromkeys([*data['buildingTypes'].get(kind, []),base,*upgrades]))
    data['upgradeLevels'][kind]=[base,*upgrades[:1],upgrades[1:]] if len(upgrades)==3 else ([base,upgrades] if kind=='vanguard' else [base,*upgrades])
manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n',encoding='utf8')

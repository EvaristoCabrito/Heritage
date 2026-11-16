"""Prepare generated transparent building art and a pixel-aligned tree foreground."""

from pathlib import Path
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[2]
GENERATED = Path(r"C:\Users\evari\.codex\generated_images\01a1c163-8396-7ed3-aa76-08a02f7a9a9e")
OUT = ROOT / "public" / "art" / "buildings-v02"
OUT.mkdir(parents=True, exist_ok=True)

SOURCES = {
    "armory": "003b5aeb-b417-4697-83dc-42c934a27dcd",
    "depot": "08173eca-92b1-4cf7-accb-4cbe6e8ec03d",
    "hut": "0d0b497c-8e2e-440c-97bf-849ef3aa097c",
    "farm-milk": "25c9ac8a-1be5-4809-a5be-5bd8e27f387e",
    "archer": "31dea501-a0cf-4d2c-8e35-cbd41c32f278",
    "market": "353ce86a-04aa-4a9c-a990-4a3d3208f2df",
    "guild": "51cb75ad-6721-45a3-84c3-c4a533308888",
    "healer": "6b424433-776c-434b-bcdf-7f435c1a6be7",
    "lancer": "7208680f-da7d-4c90-81ab-4a9bc6347c9f",
    "hut-big": "829d884f-09c4-403a-b312-ee69777b224c",
    "manor": "887c918b-f855-446d-bfc7-294733213627",
    "lumber": "9f9885e2-9555-4223-a51b-5075b174e103",
    "conjurer": "99007571-8bf2-4972-906a-ff93f4b5e741",
    "hotel": "9aaf54fd-5f00-4a3d-8ca2-36ec39e94198",
    "tower": "9c89cae4-beed-45e4-a345-5b6499da77cf",
    "farm-eggs": "9cdc85b5-67ad-4752-a001-a75cc94cf804",
    "tavern": "ad2ecf1e-1e4b-4c86-b235-ac51c173f651",
    "farm-bacon": "ad7aaeb4-68ee-4033-aa77-e4e42458d535",
    "farm-wheat": "ddc4b650-32b5-45f8-92a6-093efe71138c",
    "farm-garlic": "f53a9fd8-7caf-4619-97a5-315bdd647120",
    "mill-body": "99790836-7f4b-470f-b5bb-df819bbd88a8",
    "mill-sails": "2f9550e0-8c60-415c-886c-e36a8e62cc27",
}


def source(name):
    return GENERATED / f"exec-{SOURCES[name]}.png"


for name in SOURCES:
    image = Image.open(source(name)).convert("RGBA")
    # Drop near-zero alpha noise from the generation canvas, then retain detail.
    alpha = image.getchannel("A")
    bounds = alpha.point(lambda value: 255 if value > 6 else 0).getbbox()
    if bounds is None:
        raise ValueError(f"No visible pixels in {name}")
    image = image.crop(bounds)
    if name == "manor":
        canvas = Image.new("RGBA", (1024, 682))
        image.thumbnail((1000, 658), Image.Resampling.LANCZOS)
    else:
        canvas = Image.new("RGBA", (768, 768))
        image.thumbnail((744, 744), Image.Resampling.LANCZOS)
    canvas.alpha_composite(image, ((canvas.width - image.width) // 2, (canvas.height - image.height) // 2))
    canvas.save(OUT / f"{name}.webp", "WEBP", quality=92, method=6)

# The edit removes the old manor from the terrain. The original map remains
# available only in Git history; this new version is the active background.
map_image = Image.open(GENERATED / "exec-b60327aa-4b01-4ab7-9360-19895b05a155.png").convert("RGB")
map_image.save(ROOT / "public" / "art" / "mordavia-farmstead-clear-v03.webp", "WEBP", quality=94, method=6)
title = map_image.convert("RGBA")
manor = Image.open(OUT / "manor.webp").convert("RGBA")
manor = manor.resize((round(map_image.width * 0.44), round(map_image.width * 0.44 * manor.height / manor.width)), Image.Resampling.LANCZOS)
title.alpha_composite(manor, (round(map_image.width * 0.20), round(map_image.height * 0.11)))
title.convert("RGB").save(ROOT / "public" / "art" / "mordavia-title-v03.webp", "WEBP", quality=94, method=6)

# Image generation supplied a tree-only alpha segmentation. Apply it to the
# exact pixels of the active map to avoid a second, shifted tree painting.
tree_cutout = Image.open(GENERATED / "exec-65956684-77c3-48c9-b723-50d4a50d5e5b.png").convert("RGBA")
mask = tree_cutout.getchannel("A").resize(map_image.size, Image.Resampling.LANCZOS)
mask = mask.point(lambda value: 0 if value < 28 else value).filter(ImageFilter.GaussianBlur(0.7))
# The manor stands in front of the rear forest; keep its roof unobstructed.
pixels = mask.load()
for y in range(125, 525):
    for x in range(210, 785):
        pixels[x, y] = 0
trees = map_image.convert("RGBA")
trees.putalpha(mask)
trees.save(ROOT / "public" / "art" / "mordavia-trees-foreground-v03.png", optimize=True)

road = Image.open(GENERATED / "exec-b95d7685-d84e-4cf5-8dac-977c23c3aeb7.png").convert("RGB")
road = road.resize(map_image.size, Image.Resampling.LANCZOS)
road.save(ROOT / "public" / "art" / "mordavia-old-road-v02.webp", "WEBP", quality=94, method=6)
road_cutout = Image.open(GENERATED / "exec-3096fc5f-d281-4575-9c55-5378bf7b9b2f.png").convert("RGBA")
road_mask = road_cutout.getchannel("A").resize(road.size, Image.Resampling.LANCZOS)
road_mask = road_mask.point(lambda value: 0 if value < 28 else value).filter(ImageFilter.GaussianBlur(0.7))
road_trees = road.convert("RGBA")
road_trees.putalpha(road_mask)
road_trees.save(ROOT / "public" / "art" / "mordavia-old-road-trees-v02.png", optimize=True)

print(f"Prepared {len(SOURCES)} building assets and both map/tree layers")

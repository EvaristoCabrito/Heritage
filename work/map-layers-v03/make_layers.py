"""Create pixel-aligned alpha layers from the existing Mordavia maps."""

from pathlib import Path
from PIL import Image, ImageFilter, ImageStat

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / "public" / "art"
OUT = ROOT / "outputs" / "map-layers-v03"
GENERATED = Path(r"C:\Users\evari\.codex\generated_images\01a1c163-8396-7ed3-aa76-08a02f7a9a9e")
OUT.mkdir(parents=True, exist_ok=True)

first = Image.open(ART / "mordavia-farmstead-open-v02.webp").convert("RGB")
second_original = Image.open(ART / "mordavia-old-road-v01.png").convert("RGB")
assert first.size == second_original.size == (1199, 1312)

# Match the original ground color using flat open lots from each existing map.
first_ground = ImageStat.Stat(first.crop((720, 650, 1020, 900))).mean
second_ground = ImageStat.Stat(second_original.crop((700, 600, 1000, 850))).mean
offset = [round(a - b) for a, b in zip(first_ground, second_ground)]
channels = second_original.split()
second = Image.merge("RGB", tuple(channel.point(lambda value, d=delta: max(0, min(255, value + d))) for channel, delta in zip(channels, offset)))
second.save(OUT / "mordavia-old-road-color-match-v02.webp", "WEBP", quality=96, method=6)


def source_alpha(filename, size):
    alpha = Image.open(GENERATED / filename).convert("RGBA").getchannel("A")
    if alpha.size != size:
        alpha = alpha.resize(size, Image.Resampling.LANCZOS)
    return alpha.point(lambda value: 0 if value < 36 else value).filter(ImageFilter.GaussianBlur(0.6))


raw_manor = Image.open(GENERATED / "exec-df2f9b9f-a55e-437d-af91-4c348d914aec.png").convert("RGBA").getchannel("A")
raw_manor = raw_manor.point(lambda value: 0 if value < 36 else value)
shape = raw_manor.crop(raw_manor.getbbox()).resize((540, 350), Image.Resampling.LANCZOS)
manor_mask = Image.new("L", first.size)
manor_mask.paste(shape, (38, 145))
manor = first.convert("RGBA")
manor.putalpha(manor_mask)
bbox = manor_mask.getbbox()
assert bbox is not None
manor.crop(bbox).save(OUT / "manor-original-cutout-v01.png", optimize=True)

first_tree_mask = source_alpha("exec-1655ad05-7881-408b-a196-cf255e48359c.png", first.size)
# Original house stays in the foreground of the back forest.
for y in range(135, 560):
    for x in range(45, 655):
        first_tree_mask.putpixel((x, y), 0)
first_trees = first.convert("RGBA")
first_trees.putalpha(first_tree_mask)
first_trees.save(OUT / "mordavia-first-trees-v03.png", optimize=True)

second_tree_mask = source_alpha("exec-5e9f7de7-598d-4607-ac11-447987b0ca4e.png", second.size)
second_trees = second.convert("RGBA")
second_trees.putalpha(second_tree_mask)
second_trees.save(OUT / "mordavia-second-trees-v03.png", optimize=True)

both = Image.new("RGB", (1199, 2624))
both.paste(first, (0, 0))
both.paste(second, (0, 1312))
both.save(OUT / "existing-two-maps-color-review.jpg", quality=94, optimize=True)
print(f"Color offsets RGB: {offset}; original maps retained")

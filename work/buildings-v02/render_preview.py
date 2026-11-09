"""Offline review images. Does not open the game or a browser."""

from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[2]
ART = ROOT / "public" / "art"
BUILD = ART / "buildings-v02"
OUT = ROOT / "outputs"
OUT.mkdir(exist_ok=True)


def sprite(name, size):
    image = Image.open(BUILD / f"{name}.webp").convert("RGBA")
    image.thumbnail(size, Image.Resampling.LANCZOS)
    return image


def paste_center(canvas, name, x, y, size=(160, 160)):
    image = sprite(name, size)
    canvas.alpha_composite(image, (int(x - image.width / 2), int(y - image.height)))


first = Image.open(ART / "mordavia-farmstead-clear-v03.webp").convert("RGBA")
second = Image.open(ART / "mordavia-old-road-v02.webp").convert("RGBA")
preview = Image.new("RGBA", (first.width, first.height + second.height))
preview.alpha_composite(first, (0, 0))
preview.alpha_composite(second, (0, first.height))
manor = Image.open(BUILD / "manor.webp").convert("RGBA")
manor = manor.resize((round(first.width * .44), round(first.width * .44 * manor.height / manor.width)), Image.Resampling.LANCZOS)
preview.alpha_composite(manor, (round(first.width * .20), round(first.height * .11)))
paste_center(preview, "mill-body", 780, 820, (185, 185))
paste_center(preview, "farm-wheat", 350, 920)
paste_center(preview, "guild", 790, 1560)
paste_center(preview, "tavern", 280, 1900)
paste_center(preview, "armory", 890, 2270)
preview.alpha_composite(Image.open(ART / "mordavia-trees-foreground-v03.png").convert("RGBA"), (0, 0))
preview.alpha_composite(Image.open(ART / "mordavia-old-road-trees-v02.png").convert("RGBA"), (0, first.height))
preview.convert("RGB").save(OUT / "mordavia-two-region-preview-v02.jpg", quality=91, optimize=True)

names = [
    "manor", "hut", "hut-big", "depot", "lumber", "market", "tavern", "hotel",
    "guild", "archer", "lancer", "tower", "conjurer", "healer", "armory",
    "farm-wheat", "farm-garlic", "farm-bacon", "farm-eggs", "farm-milk",
    "mill-body", "mill-sails",
]
cell_w, cell_h, cols = 232, 225, 5
rows = (len(names) + cols - 1) // cols
sheet = Image.new("RGB", (cell_w * cols, cell_h * rows), "#393a31")
draw = ImageDraw.Draw(sheet)
font = ImageFont.load_default()
for index, name in enumerate(names):
    x, y = (index % cols) * cell_w, (index // cols) * cell_h
    draw.rectangle((x + 4, y + 4, x + cell_w - 4, y + cell_h - 4), fill="#686954", outline="#b1a17c", width=1)
    image = sprite(name, (205, 180))
    sheet.paste(image, (x + (cell_w - image.width) // 2, y + 5 + (185 - image.height) // 2), image)
    draw.text((x + 10, y + 199), name, fill="#f1e6d0", font=font)
sheet.save(OUT / "buildings-v02-gallery.jpg", quality=91, optimize=True)
print("Rendered offline map and building previews")

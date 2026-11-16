"""Match the existing southern map to the first map without generating art."""

from pathlib import Path
import numpy as np
from PIL import Image
from scipy.interpolate import PchipInterpolator

ROOT = Path(__file__).resolve().parents[1]
ART = ROOT / "public" / "art"
OUT = ROOT / "outputs"
OUT.mkdir(exist_ok=True)

first = np.asarray(Image.open(ART / "mordavia-farmstead-open-v02.webp").convert("RGB"), dtype=np.float32)
second = np.asarray(Image.open(ART / "mordavia-old-road-v01.png").convert("RGB"), dtype=np.float32)
first_trees = np.asarray(Image.open(ART / "mordavia-first-trees-v03.png").convert("RGBA"), dtype=np.float32)
second_trees = np.asarray(Image.open(ART / "mordavia-second-trees-v03.png").convert("RGBA"), dtype=np.float32)
assert first.shape == second.shape == (1312, 1199, 3)
assert first_trees.shape == second_trees.shape == (1312, 1199, 4)

# The two ground samples differ by RGB (-7, -4, -4). Keep the original texture.
second = np.clip(second + np.array([-7, -4, -4], dtype=np.float32), 0, 255)

# Trace the centre of the existing Old Road. Compress only its immediate band
# into the ~34 px wide track used on the first map; nearby land fills the sides.
centres = np.array([
    (0, 770), (100, 735), (200, 652), (300, 647), (400, 671),
    (500, 572), (600, 446), (700, 455), (800, 607), (900, 654),
    (1000, 598), (1100, 495), (1200, 456), (1311, 526),
], dtype=np.float32)
curve = PchipInterpolator(centres[:, 0], centres[:, 1])
xs = np.arange(second.shape[1], dtype=np.float32)
warped = np.empty_like(second)
warped_alpha = np.empty(second_trees.shape[:2], dtype=np.float32)
derivative = curve.derivative()
for y in range(second.shape[0]):
    centre = float(curve(y))
    inclination = min(1.5, abs(float(derivative(y))))
    perspective = np.sqrt(1 + inclination * inclination)
    old_radius = 48 * perspective
    new_radius = 18 * perspective
    outer_radius = old_radius + 90
    delta = xs - centre
    distance = np.abs(delta)
    sample_distance = np.where(
        distance <= new_radius,
        distance * old_radius / new_radius,
        np.where(
            distance <= outer_radius,
            old_radius + (distance - new_radius) * (outer_radius - old_radius) / (outer_radius - new_radius),
            distance,
        ),
    )
    sample_x = np.clip(centre + np.sign(delta) * sample_distance, 0, second.shape[1] - 1)
    for channel in range(3):
        warped[y, :, channel] = np.interp(sample_x, xs, second[y, :, channel])
    warped_alpha[y] = np.interp(sample_x, xs, second_trees[y, :, 3])

# Both halves must touch pixel for pixel at their forest seam. Reflect a short
# strip of the first map, then blend into the existing second map by row 170.
for y in range(170):
    t = np.clip((y - 18) / 152, 0, 1)
    t = t * t * (3 - 2 * t)
    warped[y] = first[1311 - y] * (1 - t) + warped[y] * t
    warped_alpha[y] = first_trees[1311 - y, :, 3] * (1 - t) + warped_alpha[y] * t

candidate = Image.fromarray(np.uint8(np.clip(np.rint(warped), 0, 255)), "RGB")
candidate.save(OUT / "road-match-candidate.png", optimize=True)
candidate.save(ART / "mordavia-old-road-seam-match-v03.webp", "WEBP", lossless=True, method=6)
tree_rgba = np.dstack((np.asarray(candidate), np.uint8(np.clip(np.rint(warped_alpha), 0, 255))))
Image.fromarray(tree_rgba, "RGBA").save(ART / "mordavia-second-trees-seam-match-v04.png", optimize=True)
joint = Image.new("RGB", (1199, 2624))
joint.paste(Image.fromarray(first.astype(np.uint8), "RGB"), (0, 0))
joint.paste(candidate, (0, 1312))
joint.save(OUT / "road-match-joint-review.jpg", quality=94, optimize=True)
print("Seam edge equals first map:", np.array_equal(np.asarray(candidate)[0], first[-1].astype(np.uint8)))
print("Tree alpha seam equals first layer:", np.array_equal(tree_rgba[0, :, 3], first_trees[-1, :, 3].astype(np.uint8)))

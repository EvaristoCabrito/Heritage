"""Validate PNG construction stages and write new lossless WebP game sprites."""
import argparse
import json
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parents[2]

def project_path(value):
    path = (PROJECT_ROOT / value).resolve()
    if path != PROJECT_ROOT and PROJECT_ROOT not in path.parents:
        raise ValueError(f"Path must stay inside the project: {value}")
    return path

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("manifest", help="JSON based on new-building.template.json")
    args = parser.parse_args()
    manifest_path = project_path(args.manifest)
    data = json.loads(manifest_path.read_text(encoding="utf-8"))
    source_path = project_path(data["source_final_sprite"])
    source_size = Image.open(source_path).size
    results = []

    for phase in ("early", "mid"):
        input_path = project_path(data["generated_inputs"][phase])
        target_path = project_path(data["runtime_outputs"][phase])
        if target_path.exists():
            raise FileExistsError(f"Will not overwrite an existing asset: {target_path}")
        image = Image.open(input_path).convert("RGBA")
        if image.size != source_size:
            raise ValueError(f"{phase}: canvas {image.size} differs from source {source_size}")
        alpha = image.getchannel("A").getextrema()
        if alpha[0] != 0 or alpha[1] < 200:
            raise ValueError(f"{phase}: expected a transparent PNG sprite, got alpha range {alpha}")
        target_path.parent.mkdir(parents=True, exist_ok=True)
        image.save(target_path, "WEBP", lossless=True, method=6)
        results.append({"phase": phase, "file": str(target_path.relative_to(PROJECT_ROOT)), "size": list(source_size), "alpha": list(alpha)})

    report = {
        "building_type_id": data["building_type_id"],
        "art_id": data["art_id"],
        "source_final_sprite": data["source_final_sprite"],
        "construction_profile": data["construction_profile"],
        "outputs": results,
    }
    report_path = manifest_path.with_name(f"{data['art_id']}-phase-report.json")
    report_path.write_text(json.dumps(report, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(f"Prepared early and mid phases for {data['art_id']}")

if __name__ == "__main__":
    main()

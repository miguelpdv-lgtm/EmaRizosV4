"""
Convierte las imágenes de public/img a WebP con un tamaño máximo por carpeta.

    python scripts/optimize_images.py            # convierte y borra los originales
    python scripts/optimize_images.py --keep     # convierte sin borrar originales
    python scripts/optimize_images.py --dry-run  # solo muestra lo que haría

Los originales quedan en el historial de git si se necesitan.
"""
import argparse
import pathlib
import sys

from PIL import Image, ImageOps

ROOT = pathlib.Path(__file__).resolve().parent.parent / "public" / "img"

# Lado mayor máximo (px) por carpeta
MAX_SIDE = {
    "products": 800,
    "services": 1400,
    "Hero": 1920,
    "mentoria": 1400,
    "historia": 1400,
    "quiz": 600,
}
DEFAULT_MAX = 1400
QUALITY = 80
SOURCE_EXT = {".png", ".jpg", ".jpeg"}
SKIP = {"favicon.png"}  # el favicon se maneja aparte (debe seguir siendo PNG)


def convert(src: pathlib.Path, max_side: int, dry: bool) -> tuple[int, int]:
    dst = src.with_suffix(".webp")
    before = src.stat().st_size
    if dry:
        return before, 0
    with Image.open(src) as im:
        im = ImageOps.exif_transpose(im)
        if im.mode not in ("RGB", "RGBA"):
            im = im.convert("RGBA" if "A" in im.getbands() or im.mode == "P" else "RGB")
        if max(im.size) > max_side:
            im.thumbnail((max_side, max_side), Image.LANCZOS)
        im.save(dst, "WEBP", quality=QUALITY, method=6)
    return before, dst.stat().st_size


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--keep", action="store_true", help="no borrar originales")
    ap.add_argument("--dry-run", action="store_true")
    args = ap.parse_args()

    total_before = total_after = 0
    count = 0
    for src in sorted(ROOT.rglob("*")):
        if not src.is_file() or src.suffix.lower() not in SOURCE_EXT or src.name in SKIP:
            continue
        rel = src.relative_to(ROOT)
        folder = rel.parts[0] if len(rel.parts) > 1 else ""
        before, after = convert(src, MAX_SIDE.get(folder, DEFAULT_MAX), args.dry_run)
        total_before += before
        total_after += after
        count += 1
        if not args.dry_run and not args.keep:
            src.unlink()

    # Favicon: PNG pequeño (también se usa como imagen al compartir en redes)
    fav = ROOT / "favicon.png"
    if fav.exists() and not args.dry_run:
        with Image.open(fav) as im:
            if max(im.size) > 512:
                b = fav.stat().st_size
                im = im.convert("RGBA")
                im.thumbnail((512, 512), Image.LANCZOS)
                im.save(fav, "PNG", optimize=True)
                total_before += b
                total_after += fav.stat().st_size

    mb = lambda n: f"{n / 1048576:.1f} MB"
    print(f"{count} imágenes: {mb(total_before)} -> {mb(total_after)}")


if __name__ == "__main__":
    sys.exit(main())

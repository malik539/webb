#!/usr/bin/env python3
"""Generate optimized responsive images for the landing page.

Usage: python3 scripts/build-images.py
Reads originals from assets/src-images/ and writes WebP (+ JPEG fallback for
the hero) renditions into assets/img/. Re-run whenever a source image changes
or a new approved image is added to the PHOTOS list below.
"""
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "src-images"
OUT = ROOT / "assets" / "img"
OUT.mkdir(parents=True, exist_ok=True)

# name -> (source file, widths, focal point (x, y) in 0..1, aspect w:h or None)
# PRECROP trims a fraction off (left, top, right, bottom) of a source before cropping,
# used to remove UI artifacts baked into a supplied screenshot.
PRECROP = {"dr-webb-brushing-demo.png": (0.08, 0.0, 0.0, 0.0)}
PHOTOS = {
    "hero-dr-webb-reading": ("dr-webb-reading-to-child.png", (480, 768, 1024, 1400), (0.55, 0.42), (4, 3)),
    "community-brushing-demo": ("dr-webb-brushing-demo.png", (480, 768, 1024), (0.5, 0.45), (4, 5)),
    "community-school-visit": ("dr-webb-school-visit-dinosaur.png", (480, 768, 1024), (0.5, 0.4), (4, 5)),
    "cta-dr-webb-reading-wide": ("dr-webb-reading-to-child.png", (768, 1200, 1800), (0.55, 0.45), (16, 9)),
}


def crop_to_aspect(im, aspect, focal):
    if not aspect:
        return im
    w, h = im.size
    aw, ah = aspect
    target = aw / ah
    if w / h > target:
        nw, nh = int(h * target), h
    else:
        nw, nh = w, int(w / target)
    fx, fy = focal
    left = min(max(int(fx * w - nw / 2), 0), w - nw)
    top = min(max(int(fy * h - nh / 2), 0), h - nh)
    return im.crop((left, top, left + nw, top + nh))


def build_photos():
    for name, (src, widths, focal, aspect) in PHOTOS.items():
        im = ImageOps.exif_transpose(Image.open(SRC / src)).convert("RGB")
        if src in PRECROP:
            l, t, r, b = PRECROP[src]
            im = im.crop((int(im.width * l), int(im.height * t), int(im.width * (1 - r)), int(im.height * (1 - b))))
        im = crop_to_aspect(im, aspect, focal)
        for w in widths:
            if w > im.width:
                continue
            r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
            r.save(OUT / f"{name}-{w}.webp", "WEBP", quality=78, method=6)
            if name.startswith("hero") and w == widths[1]:
                r.save(OUT / f"{name}-{w}.jpg", "JPEG", quality=80, optimize=True, progressive=True)
        print(name, [w for w in widths if w <= im.width], f"{im.width}x{im.height}")


def build_logo():
    im = Image.open(SRC / "webb-pediatric-logo.png").convert("RGBA")
    bbox = im.getbbox()
    pad = 12
    im = im.crop((max(bbox[0] - pad, 0), max(bbox[1] - pad, 0),
                  min(bbox[2] + pad, im.width), min(bbox[3] + pad, im.height)))
    for w in (260, 520):
        r = im.resize((w, round(im.height * w / im.width)), Image.LANCZOS)
        r.save(OUT / f"webb-pediatric-dentistry-logo-{w}.png", "PNG", optimize=True)
        r.save(OUT / f"webb-pediatric-dentistry-logo-{w}.webp", "WEBP", quality=92, method=6, lossless=False)
    print("logo", im.size)
    # Favicon from the circular "W" mark (left ~27% of the trimmed logo)
    mark = im.crop((0, 0, int(im.width * 0.27), im.height))
    side = max(mark.size)
    canvas = Image.new("RGBA", (side, side), (0, 0, 0, 0))
    canvas.paste(mark, ((side - mark.width) // 2, (side - mark.height) // 2), mark)
    canvas.resize((180, 180), Image.LANCZOS).save(OUT / "apple-touch-icon.png", "PNG", optimize=True)
    canvas.resize((64, 64), Image.LANCZOS).save(OUT / "favicon-64.png", "PNG", optimize=True)


if __name__ == "__main__":
    build_logo()
    build_photos()

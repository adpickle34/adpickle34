#!/usr/bin/env python3
"""Generate peptide vial labels for the Niimbot M2 (300 dpi, 50x30 mm labels).

Output PNGs are exactly 591x354 px so they print 1:1 with no scaling blur.
Import each PNG into the Niimbot app (New label -> 50x30 mm -> add Image,
stretch to fill) and print.
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 591, 354  # 50 x 30 mm at 300 dpi
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_REG, size)


def fit_font(draw, text, max_w, start=80, bold=True):
    """Largest font size whose rendered text fits in max_w."""
    size = start
    while size > 10:
        f = font(size, bold)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 2
    return font(10, bold)


def centered(draw, text, f, cx, cy, fill="black"):
    draw.text((cx, cy), text, font=f, fill=fill, anchor="mm")


def new_label():
    img = Image.new("L", (W, H), 255)
    return img, ImageDraw.Draw(img)


def header(draw, text, bar_h=96):
    draw.rectangle([0, 0, W, bar_h], fill=0)
    f = fit_font(draw, text, W - 40, start=64)
    centered(draw, text, f, W // 2, bar_h // 2, fill=255)
    return bar_h


def fill_line(draw, label, x, y, line_w, f):
    """'Label: _______' with a real underline for handwriting."""
    draw.text((x, y), label, font=f, fill=0, anchor="lm")
    lx = x + draw.textlength(label, font=f) + 8
    draw.line([lx, y + f.size // 2, lx + line_w, y + f.size // 2], fill=0, width=3)


def peptide_label(name, strength, filename):
    img, d = new_label()
    bar = header(d, name)

    # big strength on the left
    f_big = fit_font(d, strength, 250, start=96)
    centered(d, strength, f_big, 140, bar + 78)
    d.rectangle([265, bar + 24, 268, bar + 132], fill=0)  # divider

    # reconstitution fields on the right
    f = font(30)
    fill_line(d, "BAC:", 292, bar + 52, 130, f)
    d.text((292 + d.textlength("BAC:", font=f) + 8 + 138, bar + 52), "mL",
           font=f, fill=0, anchor="lm")
    fill_line(d, "Dose:", 292, bar + 108, 180, f)

    f2 = font(28)
    fill_line(d, "Recon:", 30, H - 60, 130, f2)
    fill_line(d, "Use by:", 320, H - 60, 130, f2)
    d.rectangle([0, 0, W - 1, H - 1], outline=0, width=3)
    img.save(filename, dpi=(300, 300))


def bac_water_label(filename):
    img, d = new_label()
    bar = header(d, "BACTERIOSTATIC WATER")
    f_sub = font(30, bold=False)
    centered(d, "0.9% benzyl alcohol", f_sub, W // 2, bar + 40)

    f = font(34)
    fill_line(d, "Opened:", 60, bar + 110, 240, f)

    f_warn = font(30)
    centered(d, "DISCARD 28 DAYS AFTER OPENING", fit_font(d, "DISCARD 28 DAYS AFTER OPENING", W - 60, start=30),
             W // 2, H - 48)
    d.rectangle([0, 0, W - 1, H - 1], outline=0, width=3)
    img.save(filename, dpi=(300, 300))


def ghk_label(filename):
    img, d = new_label()
    bar = header(d, "GHK-Cu")
    f_sub = font(26, bold=False)
    centered(d, "copper peptide", f_sub, W // 2, bar + 32)

    f = font(28)
    y = bar + 92
    x = 30
    fill_line(d, "Amount:", x, y, 90, f)
    x += d.textlength("Amount:", font=f) + 8 + 90 + 8
    d.text((x, y), "mg", font=f, fill=0, anchor="lm")
    x += d.textlength("mg", font=f) + 30
    fill_line(d, "BAC:", x, y, 80, f)
    x += d.textlength("BAC:", font=f) + 8 + 80 + 8
    d.text((x, y), "mL", font=f, fill=0, anchor="lm")

    f2 = font(28)
    fill_line(d, "Recon:", 30, H - 60, 130, f2)
    fill_line(d, "Use by:", 320, H - 60, 130, f2)
    d.rectangle([0, 0, W - 1, H - 1], outline=0, width=3)
    img.save(filename, dpi=(300, 300))


if __name__ == "__main__":
    peptide_label("RETATRUTIDE", "30 mg", "reta-30mg.png")
    peptide_label("RETATRUTIDE", "10 mg", "reta-10mg.png")
    bac_water_label("bac-water.png")
    ghk_label("ghk-cu.png")
    print("done")

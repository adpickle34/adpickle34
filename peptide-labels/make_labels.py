#!/usr/bin/env python3
"""Generate peptide vial labels for the Niimbot M2 (300 dpi).

Sized for EL40*20 label paper: 40 x 20 mm -> 472 x 236 px, printed 1:1.
Import each PNG into the Niimbot app (label size 40x20 mm -> add Image,
stretch to fill) and print.
"""

from PIL import Image, ImageDraw, ImageFont

W, H = 472, 236  # 40 x 20 mm at 300 dpi
FONT = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REG = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


def font(size, bold=True):
    return ImageFont.truetype(FONT if bold else FONT_REG, size)


def fit_font(draw, text, max_w, start=60, bold=True):
    """Largest font size whose rendered text fits in max_w."""
    size = start
    while size > 8:
        f = font(size, bold)
        if draw.textlength(text, font=f) <= max_w:
            return f
        size -= 2
    return font(8, bold)


def centered(draw, text, f, cx, cy, fill="black"):
    draw.text((cx, cy), text, font=f, fill=fill, anchor="mm")


def new_label():
    img = Image.new("L", (W, H), 255)
    return img, ImageDraw.Draw(img)


def header(draw, text, bar_h=62):
    draw.rectangle([0, 0, W, bar_h], fill=0)
    f = fit_font(draw, text, W - 30, start=46)
    centered(draw, text, f, W // 2, bar_h // 2, fill=255)
    return bar_h


def fill_line(draw, label, x, y, line_w, f):
    """'Label: _______' with a real underline for handwriting.

    Returns the x position just past the underline.
    """
    draw.text((x, y), label, font=f, fill=0, anchor="lm")
    lx = x + draw.textlength(label, font=f) + 6
    draw.line([lx, y + f.size // 2, lx + line_w, y + f.size // 2], fill=0, width=2)
    return lx + line_w + 6


def peptide_label(name, strength, filename):
    img, d = new_label()
    bar = header(d, name)

    # big strength on the left
    f_big = fit_font(d, strength, 190, start=68)
    centered(d, strength, f_big, 105, bar + 52)
    d.rectangle([210, bar + 16, 212, bar + 90], fill=0)  # divider

    # reconstitution fields on the right
    f = font(22)
    x_end = fill_line(d, "BAC:", 230, bar + 32, 100, f)
    d.text((x_end, bar + 32), "mL", font=f, fill=0, anchor="lm")
    fill_line(d, "Dose:", 230, bar + 74, 130, f)

    f2 = font(20)
    fill_line(d, "Recon:", 18, H - 32, 90, f2)
    fill_line(d, "Use by:", 250, H - 32, 90, f2)
    d.rectangle([0, 0, W - 1, H - 1], outline=0, width=2)
    img.save(filename, dpi=(300, 300))


def bac_water_label(filename):
    img, d = new_label()
    bar = header(d, "BACTERIOSTATIC WATER")

    f = font(26)
    fill_line(d, "Opened:", 90, bar + 46, 180, f)

    f_warn = fit_font(d, "DISCARD 28 DAYS AFTER OPENING", W - 40, start=24)
    centered(d, "DISCARD 28 DAYS AFTER OPENING", f_warn, W // 2, H - 34)
    d.rectangle([0, 0, W - 1, H - 1], outline=0, width=2)
    img.save(filename, dpi=(300, 300))


def ghk_label(filename):
    img, d = new_label()
    bar = header(d, "GHK-Cu")

    f = font(22)
    y = bar + 46
    x = fill_line(d, "Amount:", 20, y, 70, f)
    d.text((x, y), "mg", font=f, fill=0, anchor="lm")
    x += d.textlength("mg", font=f) + 24
    x = fill_line(d, "BAC:", x, y, 65, f)
    d.text((x, y), "mL", font=f, fill=0, anchor="lm")

    f2 = font(20)
    fill_line(d, "Recon:", 18, H - 32, 90, f2)
    fill_line(d, "Use by:", 250, H - 32, 90, f2)
    d.rectangle([0, 0, W - 1, H - 1], outline=0, width=2)
    img.save(filename, dpi=(300, 300))


if __name__ == "__main__":
    peptide_label("RETATRUTIDE", "30 mg", "reta-30mg.png")
    peptide_label("RETATRUTIDE", "10 mg", "reta-10mg.png")
    bac_water_label("bac-water.png")
    ghk_label("ghk-cu.png")
    print("done")

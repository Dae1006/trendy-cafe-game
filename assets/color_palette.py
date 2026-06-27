#!/usr/bin/env python3
"""
Generate a visual palette image for the Trendy Cafe pixel art project.
Shows all hex colors organized by category at 32x32px swatches.
Output: assets/color_palette.png
"""

from PIL import Image, ImageDraw, ImageFont
import os

# ── Color Palette Definition ───────────────────────────────────────
# Based on cozy cafe aesthetic: warm browns, creams, soft greens, golden yellows

PALETTE = {
    # ── Warm Neutrals (skin tones, backgrounds) ──────────────────
    "NEUTRALS": {
        "ivory":            "#FFF5E1",
        "cream":            "#F5DEB3",
        "warm beige":       "#E3C9A8",
        "soft sand":        "#D2B48C",
        "light oak":        "#C69C6D",
        "medium walnut":    "#A0522D",
        "rich mahogany":    "#7A442A",
        "deep espresso":    "#4B3C2D",
        "charcoal brown":   "#3E2F22",
    },

    # ── Coffee Colors (beans, drinks) ────────────────────────────
    "COFFEE": {
        "light roast":      "#C8A87C",
        "medium roast":     "#A67B5B",
        "dark roast":       "#6F4E37",
        "espresso shot":    "#3E2723",
        "latte foam":       "#FFF8F0",
        "caramel drizzle":  "#C68E32",
        "milk froth":       "#FFFDF7",
        "vanilla swirl":    "#F5E6CA",
    },

    # ── Green (plants, matcha, decor) ────────────────────────────
    "GREENS": {
        "leaf green":       "#7CB342",
        "moss green":       "#558B2F",
        "sage green":       "#9CCC65",
        "deep forest":      "#2E7D32",
        "pale mint":        "#C8E6C9",
        "matcha latte":     "#AED581",
        "olive drab":       "#7CB342",
        "lime accent":      "#C0CA33",
    },

    # ── Warm Yellows & Golds (lighting, pastries) ────────────────
    "GOLDS": {
        "golden yellow":    "#F9D6A0",
        "warm amber":       "#E6A15C",
        "soft butter":      "#FFF3D4",
        "honey gold":       "#D4A017",
        "brass accent":     "#B8860B",
        "champagne":        "#F7E7CE",
        "sunbeam yellow":   "#FFE082",
    },

    # ── Pastels (decor accents, drinks) ──────────────────────────
    "PASTELS": {
        "blush pink":       "#F8BBD0",
        "lavender mist":    "#E1BEE7",
        "sky blue":         "#90CAF9",
        "soft peach":       "#FFCCBC",
        "mint green":       "#B2DFDB",
        "cream yellow":     "#FFF9C4",
    },

    # ── UI Elements ──────────────────────────────────────────────
    "UI": {
        "panel bg":         "#2D1B14",
        "panel border":     "#5C3D2E",
        "text highlight":   "#FFF5E1",
        "stamina green":    "#66BB6A",
        "patience yellow":  "#FFCA28",
        "danger red":       "#EF5350",
        "rep star gold":    "#FFD54F",
        "coin silver":      "#BDBDBD",
        "coin gold":        "#FFA726",
        "shadow overlay":   "rgba(0, 0, 0, 0.35)",
    },

    # ── Character Accent Colors (customers & staff uniforms) ─────
    "CHARACTERS": {
        "customer skin1":   "#FDDCB5",
        "customer skin2":   "#EAC086",
        "customer skin3":   "#C68642",
        "customer skin4":   "#8D5524",
        "barista apron":    "#2E7D32",
        "cook jacket":      "#FFFFFF",
        "server vest":      "#1A237E",
        "cashier badge":    "#FF6F00",
        "hair black":       "#1B1B1B",
        "hair brown":       "#5C4033",
        "hair blonde":      "#DAA520",
        "hair red":         "#A0522D",
        "hair auburn":      "#B7410E",
        "hair platinum":    "#E8DCC8",
    },

    # ── Environment Tiles ────────────────────────────────────────
    "ENVIRONMENT": {
        "wood floor":       "#A67C52",
        "wood plank":       "#8B6914",
        "tile white":       "#E8E4DF",
        "tile grout":       "#D0CFC8",
        "brick red":        "#B22222",
        "brick mortar":     "#CDBBB0",
        "wall cream":       "#F5F0E1",
        "wall sage":        "#B5C49A",
        "window glass":     "#D6EAF8",
        "window frame":     "#F5F5DC",
        "door wood":        "#795548",
        "counter marble":   "#F0EDE6",
        "shadow":           "rgba(0, 0, 0, 0.2)",
    },

    # ── Food & Dessert Colors ────────────────────────────────────
    "FOOD": {
        "croissant":        "#E8A849",
        "cake cream":       "#FFF5EE",
        "chocolate":        "#3E2723",
        "strawberry":       "#C62828",
        "coffee bean":      "#5D4037",
        "milk":             "#FAFAFA",
        "syrup caramel":    "#B8860B",
        "whipped cream":    "#FFFFF0",
    },
}

# ── Layout Constants ───────────────────────────────────────────────
SWATCH_SIZE = 48          # px per color swatch (larger for readability)
LABEL_FONT_SIZE = 12
CATEGORIES = list(PALETTE.keys())
COLS = 5                  # number of columns per category

def draw_palette():
    """Generate the full palette image."""
    # Calculate canvas size
    rows_per_cat = {}
    max_rows_in_cat = 0
    for cat in CATEGORIES:
        colors = list(PALETTE[cat].values())
        n = len(colors)
        cols_used = min(COLS, n)
        r = (n + cols_used - 1) // cols_used
        rows_per_cat[cat] = r
        max_rows_in_cat = max(max_rows_in_cat, r)

    # Each category block: title + padding + swatches
    cat_height = 40 + 8 + (rows_per_cat[CATEGORIES[0]] if CATEGORIES else 1) * SWATCH_SIZE
    total_h = len(CATEGORIES) * cat_height + 20
    canvas_w = COLS * SWATCH_SIZE + 20

    img = Image.new("RGB", (canvas_w, total_h), "#1E1510")  # dark coffee background
    draw = ImageDraw.Draw(img)

    try:
        font = ImageFont.truetype("arial.ttf", LABEL_FONT_SIZE)
    except OSError:
        try:
            font = ImageFont.truetype("consola.ttf", LABEL_FONT_SIZE)
        except OSError:
            font = ImageFont.load_default()

    y = 10

    for ci, cat in enumerate(CATEGORIES):
        # Category title
        draw.text((10, y), f"▸ {cat}", fill="#F5DEB3", font=font)
        y += 40

        colors = PALETTE[cat]
        items = list(colors.items())
        rows_in_cat = rows_per_cat.get(cat, 1)

        for ri in range(rows_in_cat):
            row_y = y + ri * SWATCH_SIZE
            for ci2 in range(COLS):
                idx = ri * COLS + ci2
                if idx >= len(items):
                    continue
                name, hex_color = items[idx]

                # Calculate RGB from hex (handle rgba)
                r_val, g_val, b_val = parse_color(hex_color)
                rgb_str = f"#{r_val:02x}{g_val:02x}{b_val:02x}"

                # Draw swatch with subtle border
                swatch_x = 10 + ci2 * SWATCH_SIZE
                draw.rectangle(
                    [swatch_x+1, row_y+1, swatch_x+SWATCH_SIZE-1, row_y+SWATCH_SIZE-1],
                    fill=rgb_str
                )

                # Name label below swatch
                lbl = name.replace(" ", "\n")[:12]
                draw.text((swatch_x+4, row_y+SWATCH_SIZE-2), lbl[:8], fill="#FFF5E1", font=font)

        y += rows_in_cat * SWATCH_SIZE + 20

    return img


def parse_color(hex_color):
    """Convert hex/rgba string to (r, g, b) tuple."""
    if hex_color.startswith("rgba"):
        import re
        m = re.match(r"rgba\((\d+),\s*(\d+),\s*(\d+)", hex_color)
        if m:
            return int(m.group(1)), int(m.group(2)), int(m.group(3))
        return (50, 50, 50)
    # Strip # and parse hex
    hex_color = hex_color.lstrip("#")
    r = int(hex_color[0:2], 16) if len(hex_color) >= 2 else 0
    g = int(hex_color[2:4], 16) if len(hex_color) >= 4 else 0
    b = int(hex_color[4:6], 16) if len(hex_color) >= 6 else 0
    return (r, g, b)


if __name__ == "__main__":
    img = draw_palette()
    out_path = os.path.join(os.path.dirname(__file__), "color_palette.png")
    img.save(out_path, "PNG")
    print(f"✓ Color palette saved to: {out_path}")

    # Also save a JSON export for reference
    import json
    json_path = os.path.join(os.path.dirname(__file__), "palette.json")
    with open(json_path, "w") as f:
        json.dump(PALETTE, f, indent=2)
    print(f"✓ Palette JSON saved to: {json_path}")

#!/usr/bin/env python3
"""TRENDY CAFE - Vector Chill Art Sprite Generator V1.0"""
import os
from PIL import Image, ImageDraw

PALETTE = {
    "skin1": "#FDDCB5", "skin2": "#EAC086", "skin3": "#C68642", "skin4": "#8D5524",
    "hair_black": "#1B1B1B", "hair_brown": "#5C4033", "hair_blonde": "#DAA520",
    "hair_red": "#A0522D", "hair_auburn": "#B7410E", "hair_platinum": "#E8DCC8",
    "denim_blue": "#90CAF9", "sage_green": "#9CCC65", "blush_pink": "#F8BBD0",
    "forest_green": "#2E7D32", "golden_yellow": "#F9D6A0", "deep_espresso": "#4B3C2D",
    "barista_apron": "#2E7D32", "white_shirt": "#FAFAFA", "server_vest": "#1A237E",
    "cashier_badge": "#FF6F00", "cream": "#FFF5E1", "gold": "#FFD700",
    "bronze": "#B8860B", "brick_red": "#EF5350", "lavender": "#E1BEE7",
    "warm_beige": "#E3C9A8", "rich_mahogany": "#7A442A", "soft_sand": "#D2B48C",
    "moss_green": "#558B2F", "light_oak": "#C69C6D", "charcoal_brown": "#3E2F22",
    "matcha": "#AED581",
}

def circ(draw, cx, cy, r, color):
    draw.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)

def rect(draw, x, y, w, h, color):
    draw.rectangle([x, y, x+w-1, y+h-1], fill=color)

def rrect(draw, x, y, w, h, r, color):
    draw.rounded_rectangle([x, y, x+w-1, y+h-1], radius=r, fill=color)

def gen(key, drawer):
    img = Image.new("RGBA", (64, 96), None)
    d = ImageDraw.Draw(img)
    drawer(d, PALETTE)
    out = os.path.join(os.path.dirname(__file__), f"vector_assets/{key}")
    os.makedirs(out, exist_ok=True)
    fn = f"{key}.png"
    img.save(os.path.join(out, fn), "PNG")
    return key, fn

# ── CUSTOMERS ────────────────────────────────────────────────────────

def coffee_lover(d, P):
    circ(d, 32, 14, 8, P["hair_brown"])
    circ(d, 32, 26, 7, P["skin1"])
    circ(d, 29, 25, 2, P["deep_espresso"]); circ(d, 35, 25, 2, P["deep_espresso"])
    for i in range(4): rect(d, 30+i, int(29+(i-1.5)*0.5), 1, 1, P["brick_red"])
    rrect(d, 22, 36, 20, 24, 6, P["denim_blue"])
    rect(d, 12, 40, 10, 8, P["skin1"])
    rrect(d, 10, 36, 6, 7, 2, P["cream"])
    rect(d, 42, 42, 8, 6, P["skin1"])
    rrect(d, 24, 60, 7, 20, 3, P["deep_espresso"])
    rrect(d, 33, 60, 7, 20, 3, P["deep_espresso"])
    rrect(d, 24, 80, 7, 6, 3, P["charcoal_brown"]); rrect(d, 33, 80, 7, 6, 3, P["charcoal_brown"])

def nomad(d, P):
    for i in range(7): circ(d, 28+i*1.5, 14+abs(i-3)*0.5, 5, P["hair_blonde"])
    rect(d, 26, 22, 5, 5, "#FFFFFF"); rect(d, 34, 22, 5, 5, "#FFFFFF")
    circ(d, 27, 24, 1, P["deep_espresso"]); circ(d, 35, 24, 1, P["deep_espresso"])
    circ(d, 32, 26, 7, P["skin2"])
    rrect(d, 20, 36, 24, 26, 8, P["sage_green"])
    rrect(d, 26, 48, 12, 10, 4, (120, 175, 70))
    rrect(d, 38, 38, 10, 7, 2, P["deep_espresso"])
    rect(d, 39, 39, 8, 5, "#E8E4DF")
    rect(d, 42, 36, 10, 6, P["skin2"])
    rrect(d, 24, 62, 8, 16, 3, P["deep_espresso"])
    rrect(d, 32, 62, 8, 16, 3, P["deep_espresso"])
    for sx in [24, 32]: rrect(d, sx, 78, 8, 8, 4, P["soft_sand"])

def couple(d, P):
    for i in range(8): circ(d, 28+i, 14+abs(i-3)*0.7, 5, P["hair_auburn"])
    for y in range(18, 34, 2):
        rect(d, 22, y, 2, 2, P["hair_auburn"]); rect(d, 40, y, 2, 2, P["hair_auburn"])
    circ(d, 32, 24, 7, P["skin3"])
    circ(d, 30, 23, 2, P["deep_espresso"]); circ(d, 34, 23, 2, P["deep_espresso"])
    for cx in [27, 37]: d.ellipse([cx-2, 26, cx+2, 30], fill=(248, 187, 208))
    rect(d, 31, 29, 2, 1, P["brick_red"])
    rrect(d, 20, 34, 24, 40, 6, P["blush_pink"])
    rect(d, 14, 38, 8, 6, P["skin3"]); rrect(d, 12, 32, 8, 8, 3, P["bronze"])
    circ(d, 16, 36, 2, P["gold"]); rect(d, 42, 40, 6, 8, P["skin3"])
    for y in range(72, 80):
        w = max(16, 26 - (y-72)*2); d.ellipse([32-w//2, y, 32+w//2-1, y+1], fill=P["blush_pink"])
    for fx in [24, 32]: d.ellipse([fx, 78, fx+8, 90], fill=P["rich_mahogany"])

def family_dad(d, P):
    circ(d, 32, 16, 8, P["hair_black"])
    for x in range(-2, 3): rect(d, 30+x, 30, 1, 1, P["hair_brown"])
    circ(d, 32, 26, 7, P["skin1"])
    rect(d, 28, 25, 3, 1, P["deep_espresso"]); rect(d, 34, 25, 3, 1, P["deep_espresso"])
    rect(d, 30, 33, 4, 3, P["skin1"])
    rrect(d, 22, 36, 20, 28, 6, P["forest_green"])
    d.ellipse([28, 34, 36, 38], outline=P["white_shirt"], width=1)
    for ax in [12, 44]: rect(d, ax, 40, 10, 7, P["skin1"])
    for px in [24, 32]: rrect(d, px, 64, 8, 18, 3, P["warm_beige"])
    for sx in [24, 32]: rrect(d, sx, 82, 8, 6, 3, P["rich_mahogany"])

def tourist(d, P):
    for x in range(26, 38):
        y = 10 + abs(x-32)*0.15; rect(d, x, int(y), 1, 1, P["cream"])
    rrect(d, 29, 6, 8, 6, 4, P["golden_yellow"])
    for i in range(4): circ(d, 30+i*1.5, 16+abs(i-1.5)*0.5, 2, P["hair_platinum"])
    d.ellipse([25, 17, 39, 31], fill=P["skin2"])
    rrect(d, 26, 21, 12, 5, 2, P["deep_espresso"])
    for sx in [28, 34]: d.ellipse([sx-1, 22, sx+1, 25], fill=(30, 30, 60))
    for i in range(5): rect(d, int(29+i), int(28+(i-2)*0.7), 1, 1, P["cream"])
    rrect(d, 22, 34, 20, 22, 6, P["golden_yellow"])
    rrect(d, 38, 36, 14, 12, 4, "#3E2F22")
    circ(d, 45, 42, 5, P["hair_black"])
    for ax in [34, 48]: rect(d, ax, 38, 6, 6, P["skin2"])
    for px in [24, 32]: rrect(d, px, 56, 8, 16, 3, P["soft_sand"])

def business(d, P):
    for i in range(5): circ(d, 29+i, 16+abs(i-2)*0.3, 3, P["hair_brown"])
    d.ellipse([25, 17, 39, 31], fill=P["skin1"])
    rect(d, 28, 23, 3, 1, P["deep_espresso"]); rect(d, 34, 23, 3, 1, P["deep_espresso"])
    rect(d, 30, 28, 4, 1, P["brick_red"])
    d.ellipse([28, 32, 36, 36], outline=P["white_shirt"], width=1)
    rect(d, 32, 35, 2, 5, P["brick_red"])
    rrect(d, 20, 38, 24, 26, 6, P["deep_espresso"])
    rect(d, 14, 42, 8, 6, P["skin1"])
    rrect(d, 44, 50, 12, 12, 3, "#7A442A"); rect(d, 48, 48, 4, 3, P["bronze"])
    rect(d, 40, 52, 10, 5, P["skin1"])
    for px in [24, 32]: rrect(d, px, 64, 8, 20, 3, P["deep_espresso"])
    for sx in [24, 32]: d.ellipse([sx, 84, sx+8, 90], fill=P["charcoal_brown"])

def artist(d, P):
    curl_pts = [(30,14),(28,15),(32,12),(34,15),(26,16),(36,16),(29,13),(35,14)]
    for cx, cy in curl_pts: circ(d, int(cx), int(cy), 4, P["hair_auburn"])
    for y in [14, 16]:
        for x in range(24, 40):
            if abs(x-32) > 5: rect(d, x, y, 1, 1, P["hair_auburn"])
    d.ellipse([25, 17, 39, 31], fill=P["skin3"])
    circ(d, 29, 23, 2, P["deep_espresso"]); circ(d, 35, 23, 2, P["deep_espresso"])
    for y in range(27, 30):
        w = max(2, 6-abs(y-28)); rect(d, 32-w//2, y, w, 1, P["hair_auburn"])
    rrect(d, 20, 32, 24, 26, 6, P["lavender"])
    for px in [24, 28, 36]:
        for py in range(36, 56, 4): rect(d, px, py, 1, 1, P["matcha"])
    rrect(d, 12, 34, 10, 12, 2, P["cream"])
    for i in range(3): rect(d, 13+i, 35, 0.5, 10, "white")
    rect(d, 16, 36, 8, 5, P["skin3"]); rect(d, 44, 38, 10, 7, P["skin3"])
    for px in [22, 31]: rrect(d, px, 58, 9, 20, 3, P["moss_green"])
    for sx in [22, 31]: d.ellipse([sx, 78, sx+9, 88], fill="#7A442A")

CUSTOMERS = {"coffee_lover": coffee_lover, "nomad": nomad, "couple": couple,
             "family": family_dad, "tourist": tourist, "business": business, "artist": artist}


# ── STAFF ────────────────────────────────────────────────────────────

def barista(d, P):
    rrect(d, 28, 10, 8, 6, 4, P["barista_apron"])
    for x in range(26, 38): rect(d, x, int(16+abs(x-32)*0.5), 1, 1, P["barista_apron"])
    for i in range(3): circ(d, 29+i*2, 17+abs(i-1), 2, P["hair_brown"])
    circ(d, 32, 24, 7, P["skin1"])
    circ(d, 29, 23, 2, P["deep_espresso"]); circ(d, 35, 23, 2, P["deep_espresso"])
    for i in range(4): rect(d, 30+i, int(27+(i-1.5)*0.6), 1, 1, P["brick_red"])
    d.ellipse([28, 34, 36, 38], outline=P["white_shirt"], width=2)
    rrect(d, 20, 36, 24, 32, 6, P["barista_apron"])
    d.ellipse([28, 42, 36, 50], outline=P["white_shirt"], width=1)
    rect(d, 12, 40, 10, 7, P["skin1"]); rect(d, 44, 38, 12, 6, P["skin1"])
    rrect(d, 48, 36, 8, 4, 2, "#757575")
    for px in [24, 32]: rrect(d, px, 68, 8, 18, 3, P["deep_espresso"])
    for sx in [24, 32]: rrect(d, sx, 86, 8, 6, 3, P["charcoal_brown"])

def cook(d, P):
    for y_off in range(-2, 4):
        w = max(8, int(10 + abs(y_off)*0.5))
        d.ellipse([32-w//2, y_off+6, 32-w//2+w-1, y_off+12], fill="white")
    for x in range(26, 38): rect(d, x, 12, 1, 2, P["cream"])
    d.ellipse([25, 15, 39, 29], fill=P["skin4"])
    d.ellipse([26, 24, 30, 28], fill=(198, 142, 50))
    d.ellipse([34, 24, 38, 28], fill=(198, 142, 50))
    circ(d, 29, 21, 2, P["deep_espresso"]); circ(d, 35, 21, 2, P["deep_espresso"])
    for i in range(4): rect(d, 30+i, int(26+(i-1.5)*0.5), 1, 1, P["brick_red"])
    rrect(d, 18, 32, 28, 36, 6, "white")
    for by in [0, 4, 8]: d.ellipse([31, 35+by, 33, 37+by], fill=P["cream"])
    d.ellipse([20, 56, 44, 58], outline=P["brick_red"], width=1)
    for ax in [8, 48]: rect(d, ax, 36, 12, 7, "white")
    rrect(d, 52, 34, 8, 6, 4, "#757575"); rect(d, 55, 40, 1, 12, P["bronze"])
    for px in [22, 32]: rrect(d, px, 68, 10, 18, 3, P["deep_espresso"])
    for sx in [22, 32]: d.ellipse([sx, 86, sx+10, 92], fill="white")

def server(d, P):
    for i in range(3): circ(d, 30+i*1.5, 14+abs(i-1), 2, P["hair_black"])
    for y in range(16, 28, 2): rect(d, 36, y, 1, 1, P["hair_black"])
    d.ellipse([25, 15, 39, 29], fill=P["skin2"])
    circ(d, 29, 21, 2, P["deep_espresso"]); circ(d, 35, 21, 2, P["deep_espresso"])
    d.ellipse([26, 23, 30, 27], fill=(248, 187, 208))
    d.ellipse([34, 23, 38, 27], fill=(248, 187, 208))
    for i in range(4): rect(d, 30+i, int(26+(i-1.5)*0.5), 1, 1, P["brick_red"])
    rrect(d, 20, 32, 24, 36, 6, P["server_vest"])
    d.ellipse([22, 32, 30, 68], outline=P["white_shirt"], width=1)
    d.ellipse([26, 32, 30, 36], fill=P["gold"])
    rect(d, 8, 36, 8, 5, P["skin2"])
    d.ellipse([6, 38, 20, 40], outline="#BDBDBD", width=2)
    rect(d, 48, 38, 10, 5, P["skin2"])
    for px in [22, 33]: rrect(d, px, 68, 9, 18, 3, P["hair_black"])
    for sx in [22, 33]: rrect(d, sx, 86, 9, 6, 3, P["charcoal_brown"])

def cashier(d, P):
    for i in range(4): circ(d, 29+i*1.5, 14+abs(i-1.5)*0.3, 3 if i<2 else 4, P["hair_black"])
    d.ellipse([25, 17, 39, 31], fill=P["skin3"])
    circ(d, 29, 23, 2, P["deep_espresso"]); circ(d, 35, 23, 2, P["deep_espresso"])
    for i in range(4): rect(d, 30+i, int(28+(i-1.5)*0.5), 1, 1, P["brick_red"])
    rrect(d, 22, 34, 20, 36, 6, P["cashier_badge"])
    d.ellipse([28, 32, 36, 36], outline=P["cream"], width=1)
    d.ellipse([26, 34, 30, 38], fill=P["cream"])
    rect(d, 14, 38, 10, 6, P["skin3"]); rect(d, 44, 40, 10, 5, P["skin3"])
    rrect(d, 52, 38, 14, 10, 3, "#1B1B1B"); d.ellipse([53, 39, 65, 47], outline="white", width=1)
    for y in range(48, 56): draw_alpha_rect(d, 54, y, 8, 1, 255-(y-48)*30)
    for px in [24, 32]: rrect(d, px, 70, 8, 16, 3, P["warm_beige"])
    for sx in [24, 32]: d.ellipse([sx, 86, sx+8, 92], fill="#7A442A")

STAFF = {"barista": barista, "cook": cook, "server": server, "cashier": cashier}


def draw_alpha_rect(draw, x, y, w, h, alpha):
    """Helper: draw a semi-transparent rect."""
    c = int(255 - alpha)
    if 0 <= c <= 255:
        draw.rectangle([x, y, x+w-1, y+h-1], fill=(255, 255, max(0, c)))


# ── MAIN ─────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print("[OK] Trendy Cafe - Vector Asset Generator v1.0")
    print("=" * 50)
    all_ok = []
    print("\n[CUSTOMER sprites]")
    for key, drawer in CUSTOMERS.items():
        try:
            k, fn = gen(key, drawer)
            all_ok.append(f"  [OK] {key}.png")
        except Exception as e:
            print(f"  [ERR] {key}: {e}")
    print("\n[STAFF sprites]")
    for key, drawer in STAFF.items():
        try:
            k, fn = gen(key, drawer)
            all_ok.append(f"  [OK] {key}.png")
        except Exception as e:
            print(f"  [ERR] {key}: {e}")
    print(f"\n[DONE] Generated {len(all_ok)} vector-style character sprites!")
    print("   Location: assets/vector_assets/")
    for line in all_ok:
        print(line)

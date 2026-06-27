#!/usr/bin/env python3
"""
Generate placeholder pixel art PNGs for all game entities.
Each sprite is 32x32 pixels using simple geometric shapes and palette colors.
Output: assets/sprites/placeholder/*.png
"""

import os
from PIL import Image, ImageDraw

# ── Palette Reference (all values are hex strings Pillow can parse) ──────
P = {
    # Neutrals
    "ivory": "#FFF5E1", "cream": "#F5DEB3", "warm_beige": "#E3C9A8",
    "soft_sand": "#D2B48C", "light_oak": "#C69C6D", "medium_walnut": "#A0522D",
    "rich_mahogany": "#7A442A", "deep_espresso": "#4B3C2D",
    # Coffee
    "latte_foam": "#FFF8F0", "caramel": "#C68E32", "vanilla": "#F5E6CA",
    "dark_roast": "#6F4E37", "espresso": "#3E2723", "milk": "#FAFAFA",
    "whipped_cream": "#FFFFF0",
    # Greens
    "leaf_green": "#7CB342", "moss_green": "#558B2F", "deep_forest": "#2E7D32",
    "pale_mint": "#C8E6C9", "matcha": "#AED581", "sage_green": "#9CCC65",
    # Golds
    "golden_yellow": "#F9D6A0", "warm_amber": "#E6A15C", "honey_gold": "#D4A017",
    "sunbeam": "#FFE082", "champagne": "#F7E7CE", "brass": "#B8860B", "gold": "#FFD700",
    # Pastels
    "blush_pink": "#F8BBD0", "lavender": "#E1BEE7", "sky_blue": "#90CAF9",
    "soft_peach": "#FFCCBC", "mint_pastel": "#B2DFDB",
    # Characters
    "skin1": "#FDDCB5", "skin2": "#EAC086", "skin3": "#C68642", "skin4": "#8D5524",
    "hair_black": "#1B1B1B", "hair_brown": "#5C4033", "hair_blonde": "#DAA520",
    "hair_red": "#A0522D", "hair_auburn": "#B7410E", "hair_platinum": "#E8DCC8",
    # Staff uniforms
    "barista_apron": "#2E7D32", "cook_jacket": "#FFFFFF", "server_vest": "#1A237E",
    "cashier_badge": "#FF6F00", "white": "#FFFFFF", "charcoal": "#3E2F22",
    # Environment
    "wood_floor": "#A67C52", "tile_white": "#E8E4DF", "brick_red": "#B22222",
    "wall_cream": "#F5F0E1", "wall_sage": "#B5C49A", "counter_marble": "#F0EDE6",
    # UI
    "stamina_green": "#66BB6A", "patience_yellow": "#FFCA28", "danger_red": "#EF5350",
    "rep_star_gold": "#FFD54F", "coin_gold": "#FFA726", "coin_silver": "#BDBDBD",
}

def hex_to_rgb(h):
    h = h.lstrip("#")
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16))

def rect(draw, x, y, w, h, fill_key):
    """Fill a rectangle with a palette color or raw hex string."""
    if fill_key.startswith("#"):
        draw.rectangle([x, y, x+w-1, y+h-1], fill=fill_key)
    else:
        draw.rectangle([x, y, x+w-1, y+h-1], fill=P[fill_key])

def outline_rect(draw, x, y, w, h, key_or_hex):
    """Draw a rectangle outline (palette key or hex string)."""
    if key_or_hex.startswith("#"):
        rgb = tuple(int(key_or_hex[i:i+2], 16) for i in (1,3,5))
    else:
        rgb = hex_to_rgb(P[key_or_hex])
    draw.rectangle([x, y, x+w-1, y+h-1], outline=rgb)


# ─── CUSTOMER SPRITES (7 types) ──────────────────────────────────────

def create_customer(key, name, drawer):
    img = Image.new("RGBA", (32, 32), None)
    drawer(ImageDraw.Draw(img))
    out = os.path.join(os.path.dirname(__file__), "placeholder")
    fn = f"customer_{key}_{name}.png"
    img.save(os.path.join(out, fn))
    return fn

def draw_coffee_lover(draw):
    rect(draw, 14,2,5,6,"hair_brown"); rect(draw,13,3,7,2,"hair_brown")
    rect(draw,13,8,7,7,"skin1")
    rect(draw,14,9,1,1,"dark_roast"); rect(draw,18,9,1,1,"dark_roast")
    rect(draw,15,12,3,1,"rich_mahogany")
    rect(draw,13,15,7,8,"sky_blue")
    rect(draw,11,16,2,4,"skin1"); rect(draw,20,16,2,4,"skin1")
    rect(draw,14,23,3,5,"medium_walnut"); rect(draw,18,23,3,5,"medium_walnut")
    rect(draw,14,28,3,2,"deep_espresso"); rect(draw,18,28,3,2,"deep_espresso")
    rect(draw,9,15,3,4,"latte_foam"); rect(draw,9,17,3,1,"caramel")

def draw_nomad(draw):
    rect(draw,13,2,7,5,"hair_blonde"); rect(draw,12,3,8,3,"hair_blonde")
    rect(draw,13,7,7,8,"skin2")
    rect(draw,14,9,1,1,"dark_roast"); rect(draw,18,9,1,1,"dark_roast")
    outline_rect(draw,12,8,4,2,"deep_espresso")  # glasses
    outline_rect(draw,17,8,4,2,"deep_espresso")
    rect(draw,16,9,1,1,"deep_espresso"); rect(draw,15,13,3,1,"light_oak")
    rect(draw,12,15,9,9,"sage_green"); rect(draw,13,18,7,1,"moss_green")
    rect(draw,10,16,2,6,"skin2"); rect(draw,21,16,2,6,"skin2")
    rect(draw,14,14,5,3,"charcoal"); rect(draw,14,17,5,1,"tile_white")
    rect(draw,13,24,3,5,"deep_espresso"); rect(draw,18,24,3,5,"deep_espresso")
    rect(draw,13,29,3,2,"soft_sand"); rect(draw,18,29,3,2,"soft_sand")

def draw_couple(draw):
    rect(draw,13,2,7,4,"hair_auburn"); rect(draw,12,4,8,5,"hair_auburn")
    rect(draw,12,9,2,5,"hair_auburn"); rect(draw,20,9,2,5,"hair_auburn")
    rect(draw,14,6,6,7,"skin3")
    rect(draw,15,8,1,1,"dark_roast"); rect(draw,19,8,1,1,"dark_roast")
    rect(draw,16,12,2,1,"blush_pink"); rect(draw,17,13,1,1,"rich_mahogany")
    rect(draw,14,13,6,9,"blush_pink")
    rect(draw,12,15,2,5,"skin3"); rect(draw,20,15,2,5,"skin3")
    rect(draw,14,22,6,4,"blush_pink")
    rect(draw,15,26,2,3,"rich_mahogany"); rect(draw,19,26,2,3,"rich_mahogany")

def draw_family_dad(draw):
    rect(draw,14,3,5,4,"hair_black"); rect(draw,13,4,7,2,"hair_black")
    rect(draw,13,7,7,8,"skin1")
    rect(draw,15,9,1,1,"dark_roast"); rect(draw,18,9,1,1,"dark_roast")
    rect(draw,14,12,5,1,"hair_brown"); rect(draw,13,13,6,1,"hair_brown")
    rect(draw,12,15,9,8,"deep_forest")
    rect(draw,10,16,2,6,"skin1"); rect(draw,21,16,2,6,"skin1")
    rect(draw,13,23,3,5,"warm_beige"); rect(draw,18,23,3,5,"warm_beige")
    rect(draw,13,28,3,3,"rich_mahogany"); rect(draw,18,28,3,3,"rich_mahogany")

def draw_tourist(draw):
    rect(draw,14,2,5,4,"hair_platinum"); rect(draw,13,3,7,3,"hair_platinum")
    rect(draw,10,2,13,2,"cream"); rect(draw,13,0,7,3,"golden_yellow")
    rect(draw,14,5,5,7,"skin2")
    rect(draw,15,7,1,1,"dark_roast"); rect(draw,19,7,1,1,"dark_roast")
    outline_rect(draw,13,6,5,2,"deep_espresso")  # sunglasses
    rect(draw,14,12,5,9,"golden_yellow")
    rect(draw,12,14,2,5,"skin2"); rect(draw,20,14,2,5,"skin2")
    rect(draw,14,13,5,3,"dark_roast"); rect(draw,16,12,3,1,"hair_black")
    rect(draw,14,21,5,4,"soft_sand")
    rect(draw,14,25,5,3,"rich_mahogany")

def draw_business(draw):
    rect(draw,14,3,5,4,"hair_brown"); rect(draw,15,2,4,2,"hair_brown")
    rect(draw,14,7,5,7,"skin1")
    rect(draw,15,9,1,1,"dark_roast"); rect(draw,18,9,1,1,"dark_roast")
    rect(draw,16,12,2,4,"danger_red")  # tie
    rect(draw,13,14,7,8,"deep_espresso"); rect(draw,14,14,5,8,"cream")
    rect(draw,11,15,2,5,"skin1"); rect(draw,20,15,2,5,"skin1")
    rect(draw,9,18,3,4,"rich_mahogany"); rect(draw,10,17,2,1,"brass")  # briefcase
    rect(draw,14,22,5,5,"deep_espresso")
    rect(draw,14,27,2,3,"espresso"); rect(draw,19,27,2,3,"espresso")

def draw_artist(draw):
    for i in range(6):
        cx = 13 + i
        rect(draw, cx, 2, 2, 4 if i in [1,4] else 5, "hair_red")
    rect(draw,12,4,8,6,"hair_auburn")
    rect(draw,14,6,5,8,"skin3")
    rect(draw,15,8,1,1,"dark_roast"); rect(draw,18,8,1,1,"dark_roast")
    rect(draw,14,13,5,2,"hair_auburn"); rect(draw,15,14,3,1,"hair_auburn")  # beard
    rect(draw,14,13,5,9,"lavender")
    for r in range(3):
        for c in range(2):
            rect(draw, 15+c*2, 14+r*3, 1, 1, "matcha")
    rect(draw,12,15,2,6,"skin3"); rect(draw,20,15,2,6,"skin3")
    rect(draw,21,13,2,5,"cream")  # sketchbook
    rect(draw,14,22,5,5,"moss_green")
    rect(draw,14,27,2,3,"rich_mahogany"); rect(draw,19,27,2,3,"rich_mahogany")

CUSTOMERS = [
    ("coffee_lover","Coffee_Lover",draw_coffee_lover),
    ("nomad","Digital_Nomad",draw_nomad),
    ("couple","Couple_1",draw_couple),
    ("family","Family_Dad",draw_family_dad),
    ("tourist","Tourist_Influencer",draw_tourist),
    ("business","Business_Person",draw_business),
    ("artist","Artist_Creative",draw_artist),
]


# ─── STAFF SPRITES (4 types) ────────────────────────────────────────

def create_staff(key, drawer):
    img = Image.new("RGBA", (32, 32), None)
    drawer(ImageDraw.Draw(img))
    out = os.path.join(os.path.dirname(__file__), "placeholder")
    fn = f"staff_{key}.png"
    img.save(os.path.join(out, fn))
    return fn

def draw_barista(draw):
    rect(draw,14,2,5,4,"hair_brown"); rect(draw,13,3,7,2,"hair_brown")
    rect(draw,10,2,13,2,"barista_apron")
    rect(draw,14,6,5,7,"skin1")
    rect(draw,15,8,1,1,"dark_roast"); rect(draw,18,8,1,1,"dark_roast")
    rect(draw,16,11,2,1,"rich_mahogany")
    rect(draw,14,13,5,8,"milk")
    rect(draw,13,16,7,9,"deep_forest")
    outline_rect(draw,14,15,5,2,"cream")  # apron pocket trim
    rect(draw,11,14,3,5,"skin1"); rect(draw,19,14,3,5,"skin1")
    rect(draw,14,25,5,3,"deep_espresso")
    rect(draw,14,28,5,3,"espresso")

def draw_cook(draw):
    rect(draw,14,0,5,3,"whipped_cream"); rect(draw,12,1,9,2,"whipped_cream")  # chef hat
    rect(draw,14,3,5,7,"skin4")
    rect(draw,15,5,1,1,"dark_roast"); rect(draw,18,5,1,1,"dark_roast")
    rect(draw,16,9,2,1,"rich_mahogany")
    rect(draw,13,10,7,10,"white")  # jacket
    rect(draw,15,12,1,1,"cream"); rect(draw,15,16,1,1,"cream")  # buttons
    outline_rect(draw,13,18,7,2,"danger_red")  # apron stripe
    rect(draw,10,12,4,6,"white"); rect(draw,19,12,4,6,"white")  # arms
    rect(draw,13,20,7,4,"deep_espresso")
    rect(draw,13,24,7,4,"cream")

def draw_server(draw):
    rect(draw,14,2,5,4,"hair_black"); rect(draw,13,3,7,2,"hair_black")
    rect(draw,16,6,2,5,"hair_black")  # ponytail
    rect(draw,14,6,5,7,"skin2")
    rect(draw,15,8,1,1,"dark_roast"); rect(draw,18,8,1,1,"dark_roast")
    rect(draw,16,11,2,1,"rich_mahogany")
    rect(draw,14,13,5,7,"server_vest")
    rect(draw,12,13,3,7,"milk"); rect(draw,18,13,3,7,"milk")  # shirt under vest
    rect(draw,16,14,2,1,"coin_gold")  # name badge
    rect(draw,10,15,3,5,"skin2"); rect(draw,20,15,3,5,"skin2")  # arms
    rect(draw,14,20,5,2,"coin_silver")  # tray
    rect(draw,14,22,5,4,"hair_black")
    rect(draw,14,26,5,3,"espresso")

def draw_cashier(draw):
    rect(draw,14,2,5,4,"hair_black")
    rect(draw,14,6,5,7,"skin3")
    rect(draw,15,8,1,1,"dark_roast"); rect(draw,18,8,1,1,"dark_roast")
    rect(draw,16,11,2,1,"rich_mahogany")
    rect(draw,14,13,5,9,"cashier_badge")
    outline_rect(draw,14,13,5,2,"cream")  # collar trim
    rect(draw,11,14,3,6,"skin3"); rect(draw,19,14,3,6,"skin3")
    rect(draw,14,22,5,4,"warm_beige")
    rect(draw,14,26,5,3,"rich_mahogany")

STAFF = [
    ("barista",draw_barista), ("cook",draw_cook),
    ("server",draw_server), ("cashier",draw_cashier),
]


# ─── DECORATION ITEMS (7 key items) ──────────────────────────────────

def create_deco(name, drawer):
    img = Image.new("RGBA", (32, 32), None)
    drawer(ImageDraw.Draw(img))
    out = os.path.join(os.path.dirname(__file__), "placeholder")
    fn = f"decoration_{name}.png"
    img.save(os.path.join(out, fn))
    return fn

def deco_neon_cat(draw):
    rect(draw,6,8,20,20,"deep_espresso")
    outline_rect(draw,12,8,9,9,"lavender")  # cat head
    draw.polygon([(12,8),(10,4),(14,8)], fill="lavender")  # ear L
    draw.polygon([(21,8),(23,4),(20,8)], fill="lavender")  # ear R
    rect(draw,14,12,2,2,"moss_green"); rect(draw,18,12,2,2,"moss_green")

def deco_potted_plant(draw):
    rect(draw,11,20,11,7,"rich_mahogany")  # pot
    outline_rect(draw,10,19,13,2,"cream")  # rim
    for i in range(5):
        cx = 16 + (i-2)*2; cy = 18 - i*2
        rect(draw,cx,cy,2,3,"leaf_green")
    rect(draw,14,14,5,6,"moss_green")

def deco_string_lights(draw):
    for x in range(32):
        y = 4 + int(abs(x-16)*0.15)
        rect(draw,x,y,1,1,"deep_espresso")  # wire
    for bx in [4,8,12,16,20,24,28]:
        by = 4 + int(abs(bx-16)*0.15)
        rect(draw,bx,by+2,2,3,"sunbeam")

def deco_bookshelf(draw):
    outline_rect(draw,6,6,21,20,"light_oak")  # frame
    # books on two shelves
    books = [(8,8,2,4,"danger_red"),(11,8,3,4,"moss_green"),
             (15,8,2,4,"sky_blue"),(18,8,4,4,"golden_yellow"),
             (23,8,2,4,"lavender"),(8,14,3,4,"deep_forest"),
             (12,14,2,4,"blush_pink"),(15,14,4,4,"cream"),
             (20,14,3,4,"moss_green")]
    for x,y,w,h,c in books:
        rect(draw,x,y,w,h,c)

def deco_floor_lamp(draw):
    outline_rect(draw,13,26,7,5,"brass")  # base
    rect(draw,15,4,3,23,"brass")  # pole
    for y in range(4,14):
        w = max(1,(y-4)+1)*2; cx = 16 - w//2
        rect(draw,cx,y,w,1,"cream")

def deco_candle(draw):
    outline_rect(draw,13,24,7,4,"gold")  # base
    rect(draw,14,16,5,9,"whipped_cream")  # candle body
    rect(draw,16,12,1,4,"golden_yellow"); rect(draw,15,13,3,2,"sunbeam")

def deco_chandelier(draw):
    for y in range(6):
        outline_rect(draw,15,y,2,1,"coin_gold")  # chain
    rect(draw,8,6,16,10,"deep_espresso")  # body
    for y in range(6,16):
        w = max(8,8+int((y-6)*0.5)); cx = 16 - w//2
        rect(draw,cx,y,w,1,"cream")

DECORATIONS = [
    ("neon_cat",deco_neon_cat), ("potted_plant",deco_potted_plant),
    ("string_lights",deco_string_lights), ("bookshelf",deco_bookshelf),
    ("floor_lamp",deco_floor_lamp), ("candle",deco_candle),
    ("chandelier",deco_chandelier),
]


# ─── UI ELEMENTS (4 items) ──────────────────────────────────────────

def create_ui(name, drawer):
    img = Image.new("RGBA", (32, 32), None)
    drawer(ImageDraw.Draw(img))
    out = os.path.join(os.path.dirname(__file__), "placeholder")
    fn = f"ui_{name}.png"
    img.save(os.path.join(out, fn))
    return fn

def ui_stamina_bar(draw):
    outline_rect(draw,4,12,24,8,"charcoal")  # bg border
    rect(draw,5,13,22,6,"stamina_green")  # green fill
    rect(draw,6,13,8,2,"#81C784")  # shine highlight

def ui_patience_meter(draw):
    outline_rect(draw,4,12,24,8,"charcoal")
    rect(draw,5,13,11,6,"patience_yellow")  # half fill (urgent!)
    rect(draw,24,14,3,3,"danger_red")  # warning dot

def ui_rep_star(draw):
    rect(draw,15,2,2,22,"rep_star_gold")  # vertical bar
    for dy in range(-8,9):
        cx=16
        w = 6 if abs(dy)<4 else (3 if abs(dy)<7 else 1)
        rect(draw,cx-w//2,dy+8,w,1,"rep_star_gold")

def ui_coin_icon(draw):
    outline_rect(draw,4,4,24,24,"#E65100")
    rect(draw,9,9,14,14,"coin_gold")
    rect(draw,14,10,4,1,"white"); rect(draw,16,11,1,11,"white")  # $ sign
    rect(draw,14,20,4,1,"white")

UI_ITEMS = [
    ("stamina_bar",ui_stamina_bar), ("patience_meter",ui_patience_meter),
    ("rep_star",ui_rep_star), ("coin_icon",ui_coin_icon),
]


# ─── MAIN ────────────────────────────────────────────────────────────

if __name__ == "__main__":
    out = os.path.join(os.path.dirname(__file__), "placeholder")
    os.makedirs(out, exist_ok=True)
    count = 0

    for key, name, drawer in CUSTOMERS:
        create_customer(key, name, drawer); count += 1

    for key, drawer in STAFF:
        create_staff(key, drawer); count += 1

    for name, drawer in DECORATIONS:
        create_deco(name, drawer); count += 1

    for name, drawer in UI_ITEMS:
        create_ui(name, drawer); count += 1

    print(f"[OK] Generated {count} placeholder sprites to {out}")
    print()
    for f in sorted(os.listdir(out)):
        sz = os.path.getsize(os.path.join(out, f))
        print(f"  [{sz:>6}B] {f}")

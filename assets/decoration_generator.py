#!/usr/bin/env python3
"""TRENDY CAFE - Vector Decorations, Environment Tiles & UI Generator V1.0"""
import os
from PIL import Image, ImageDraw

PALETTE = {
    "wall_cream": "#F5F0E1", "wall_sage": "#B5C49A", "wood_floor": "#A67C52",
    "brick_red": "#B22222", "brick_mortar": "#CDBBB0", "tile_white": "#E8E4DF",
    "counter_marble": "#F0EDE6", "deep_espresso": "#4B3C2D", "charcoal_brown": "#3E2F22",
    "dark_roast": "#6F4E37", "neon_green": "#558B2F", "neon_pink": "#FF6EC7",
    "neon_blue": "#4FC3F7", "neon_warm": "#FFD54F", "lamp_glow": "#FFE082",
    "gold": "#FFD700", "bronze": "#B8860B", "brass": "#B8860B",
    "cream": "#FFF5E1", "warm_beige": "#E3C9A8", "rich_mahogany": "#7A442A",
    "soft_sand": "#D2B48C", "leaf_green": "#7CB342", "moss_green": "#558B2F",
    "matcha": "#AED581", "sage_green": "#9CCC65", "pale_mint": "#C8E6C9",
    "blush_pink": "#F8BBD0", "lavender": "#E1BEE7", "sky_blue": "#90CAF9",
    "stamina_green": "#66BB6A", "patience_yellow": "#FFCA28", "danger_red": "#EF5350",
    "rep_star_gold": "#FFD54F", "coin_gold": "#FFA726", "coin_silver": "#BDBDBD",
    "glass_blue": "#D6EAF8", "door_wood": "#795548", "copper": "#B87333",
    "porcelain_white": "#FAF9F6", "clay_pink": "#D27D4E", "ceramic_green": "#7CB342",
}

def circ(d, cx, cy, r, color):
    d.ellipse([cx-r, cy-r, cx+r, cy+r], fill=color)
def rect(d, x, y, w, h, color):
    d.rectangle([x, y, x+w-1, y+h-1], fill=color)
def rrect(d, x, y, w, h, rad, color):
    d.rounded_rectangle([x, y, x+w-1, y+h-1], radius=rad, fill=color)

# ═══════════ DECORATIONS (Wall, Table, Floor, Ceiling) ═══════════

def gen_deco(key, drawer):
    img = Image.new("RGBA", (64, 64), None)
    d = ImageDraw.Draw(img)
    drawer(d, PALETTE)
    out = os.path.join(os.path.dirname(__file__), "vector_assets/decorations")
    os.makedirs(out, exist_ok=True)
    fn = f"decoration_{key}.png"
    img.save(os.path.join(out, fn), "PNG")
    return key, fn

def deco_neon_cat(d, P):
    # Black cat silhouette
    circ(d, 32, 30, 16, "#1A1A1A")
    d.ellipse([24, 24, 40, 36], fill="#1A1A1A")  # body
    circ(d, 32, 18, 10, "#1A1A1A")  # head
    # Ears (triangles)
    for ex in [26, 38]:
        d.polygon([(ex-2, 14), (ex+2, 14), (ex, 6)], fill="#1A1A1A")
    # Glowing neon eyes (green)
    circ(d, 28, 17, 3, P["neon_green"])
    circ(d, 36, 17, 3, P["neon_green"])
    # Eye glow effect
    for r in [5, 4, 3]:
        circ(d, 28, 17, r, (85, 139, 47, 100)) if False else circ(d, 28, 17, r, P["neon_green"])
    # Tail
    for t in range(6):
        d.ellipse([36+t*2, 32-t, 42+t*2, 38-t], fill="#1A1A1A")

def deco_potted_succulent(d, P):
    # Clay pot
    rrect(d, 20, 40, 24, 16, 4, "#C67B30")
    d.ellipse([20, 38, 44, 44], fill="#D2B48C")  # rim
    # Succulent rosette pattern
    for angle in range(0, 360, 40):
        rad = angle * 3.14 / 180
        cx = 32 + int(6 * (rad))
        cy = 36 - int(6 * (rad))
        circ(d, cx, cy, 5, P["leaf_green"])
    # Highlight petals
    for angle in [60, 180, 300]:
        rad = angle * 3.14 / 180
        cx = 32 + int(4 * (rad))
        cy = 34 - int(4 * (rad))
        d.ellipse([cx-3, cy-3, cx+3, cy+3], fill="#7CB342")

def deco_string_lights(d, P):
    # Wire (curved)
    for x in range(0, 64, 2):
        y = 8 + abs(x-32)*0.12
        rect(d, x, int(y), 1, 1, "#5C3D2E")
    # Light bulbs (warm white)
    for bx in [8, 16, 24, 32, 40, 48, 56]:
        by = 8 + int(abs(bx-32)*0.12)
        circ(d, bx, by+4, 3, P["lamp_glow"])
        circ(d, bx, by+4, 2, "#FFF9C4")

def deco_bookshelf(d, P):
    # Wooden frame
    rrect(d, 6, 8, 50, 48, 2, "#C69C6D")
    d.ellipse([6, 8, 56, 12], fill="#A0522D")  # top trim
    # Two shelves
    rect(d, 8, 28, 48, 3, "#C69C6D")
    rect(d, 8, 48, 48, 3, "#C69C6D")
    # Books (various colors)
    books = [(10,12,5,14,'#EF5350'),(16,10,4,16,'#7CB342'),(21,11,3,15,'#90CAF9'),
             (25,8,5,18,'#DAA520'),(31,13,4,13,'#E1BEE7'),(36,10,4,16,'#7CB342'),
             (41,9,5,17,'#F8BBD0'),(47,11,4,15,'#DAA520')]
    for x,y,w,h,c in books:
        rrect(d, x, y, w, h, 1, c)
    # Books on lower shelf
    books2 = [(10,32,6,13,'#B22222'),(18,34,5,11,'#9CCC65'),(24,31,4,14,'#DAA520'),
              (29,35,3,10,'#E1BEE7'),(33,33,5,12,'#7CB342'),(39,32,4,13,'#EF5350')]
    for x,y,w,h,c in books2:
        rrect(d, x, y, w, h, 1, c)

def deco_floor_lamp(d, P):
    # Base (brass)
    d.ellipse([24, 56, 40, 64], fill="#B8860B")
    # Pole (tall brass)
    rect(d, 30, 12, 4, 44, "#B8860B")
    # Lamp shade (cream cone)
    d.ellipse([24, 10, 40, 14], fill=P["cream"])
    for y in range(14, 24):
        w = 8 + (y-14)*2
        d.ellipse([32-w//2, y, 32+w//2-1, y+1], fill="#FFF9C4")
    # Light glow effect
    for r in range(6, 0, -1):
        circ(d, 32, 18, r, (255, 224, 130)) if False else None

def deco_candle(d, P):
    # Brass base
    d.ellipse([26, 54, 38, 62], fill="#B8860B")
    rrect(d, 26, 54, 12, 6, 2, "#FFD700")  # highlight
    # White candle body
    rect(d, 28, 32, 8, 22, "#FFFDF7")
    # Wick
    rect(d, 31, 28, 2, 6, "#5C3D2E")
    # Flame (yellow + white)
    for i in range(4):
        y = 28 - i*3
        h = min(4, 4-i)
        c = "#FFE082" if i < 2 else "#FFF9C4"
        rect(d, 30+i, y, 4-i, h, c)

def deco_chandelier(d, P):
    # Chain (gold links)
    for y in range(0, 16, 3):
        d.ellipse([30, y+2, 34, y+6], outline="#FFD54F", width=1)
    # Central body (dark bronze)
    rrect(d, 16, 18, 32, 36, 4, "#3E2723")
    # Multiple hanging arms with lights
    for ax in [10, 22, 42, 54]:
        for y in range(18, 26):
            w = max(4, 10 - (y-18)*2)
            d.ellipse([ax-w//2, y, ax+w//2-1, y+1], fill="#FFD54F")

def deco_potted_plant(tall, d, P):
    # Tall palm plant in planter
    rrect(d, 20, 48, 24, 14, 4, "#C69C6D")  # planter
    d.ellipse([20, 46, 44, 52], fill="#D2B48C")
    # Trunk (brown)
    for y in range(30, 48):
        w = max(2, 4 - abs(y-39)*0.1)
        rect(d, 32-w//2, y, int(w), 1, "#5C3D2E")
    # Leaves (spreading fronds)
    leaf_angles = [30, 60, 120, 240, 300]
    for angle in leaf_angles:
        rad = angle * 3.14 / 180
        end_x = 32 + int(14 * (rad))
        end_y = 28 - int(14 * (rad))
        rect(d, 30, 26, max(2, abs(end_x-32)), 2, P["leaf_green"])

def deco_window_frame(d, P):
    # Wooden frame
    rect(d, 0, 0, 64, 6, "#795548")
    rect(d, 0, 0, 6, 64, "#795548")
    rect(d, 58, 0, 6, 64, "#795548")
    rect(d, 0, 58, 64, 6, "#795548")
    # Cross bars (window panes)
    rect(d, 31, 0, 2, 64, "#795548")
    rect(d, 0, 31, 64, 2, "#795548")
    # Glass panes (semi-transparent blue)
    d.ellipse([8, 8, 56, 56], fill=(214, 234, 248))

def deco_counter_marble(d, P):
    # Marble surface with veins
    rect(d, 0, 0, 64, 64, "#F0EDE6")
    for i in range(5):
        y = 10 + i * 12
        d.ellipse([i*8, y, 60-i*3, y+6], fill=(210, 190, 170))

def deco_wall_brick(d, P):
    # Brick pattern
    for row in range(0, 64, 12):
        offset = (row // 12) % 2 * 6
        for col in range(offset-6, 64, 18):
            d.ellipse([col+2, row+2, col+14, row+10], fill="#B22222")
            rect(d, col+1, row+1, 14, 1, "#CDBBB0")  # mortar line

# ═══════════ MENU ITEMS (icons) ═══════════

def gen_menu_item(key, drawer):
    img = Image.new("RGBA", (32, 32), None)
    d = ImageDraw.Draw(img)
    drawer(d, PALETTE)
    out = os.path.join(os.path.dirname(__file__), "vector_assets/menu")
    os.makedirs(out, exist_ok=True)
    fn = f"menu_{key}.png"
    img.save(os.path.join(out, fn), "PNG")
    return key, fn

def menu_black_coffee(d, P):
    # Coffee cup with dark coffee
    rrect(d, 8, 12, 16, 14, 3, "#FFF5E1")  # cup body
    d.ellipse([8, 10, 24, 16], fill="#FAFAFA")  # rim
    d.ellipse([10, 14, 22, 24], fill="#3E2723")  # coffee inside
    # Steam wisps
    for sx in [14, 18, 22]:
        for sy in range(6, -2, -2):
            alpha = max(0, int(255 * (sy + 2) / 8))
            c = max(200, alpha)
            d.ellipse([sx-1, sy+4, sx+1, sy+7], fill=(c, c, c))

def menu_milk_coffee(d, P):
    rrect(d, 8, 12, 16, 14, 3, "#FFF5E1")
    d.ellipse([10, 14, 22, 24], fill="#C8A87C")  # milk coffee layer
    d.ellipse([10, 14, 22, 18], fill="#FAFAFA")  # milk foam top

def menu_latte(d, P):
    rrect(d, 6, 10, 20, 16, 4, "#FFF5E1")
    d.ellipse([8, 14, 24, 22], fill="#C68E32")  # latte base
    d.ellipse([8, 14, 24, 19], fill="#FFFDF7")  # foam top
    # Latte art pattern
    for i in range(3):
        cx = 16 + (i-1)*4
        circ(d, cx, 17, 1.5, "#C68E32")

def menu_matcha(d, P):
    rrect(d, 6, 10, 20, 16, 4, "#FFF5E1")
    d.ellipse([8, 14, 24, 24], fill="#AED581")  # matcha green
    d.ellipse([8, 14, 24, 20], fill="#C8E6C9")  # frothy top

def menu_espresso(d, P):
    rrect(d, 4, 14, 12, 10, 3, "#FAFAF8")  # small cup
    d.ellipse([5, 14, 15, 19], fill="#3E2723")  # espresso shot
    rrect(d, 6, 24, 8, 4, 2, "#BDBDBD")  # saucer

def menu_smoothie(d, P):
    # Tall glass with smoothie
    rrect(d, 8, 10, 16, 20, 4, (255, 255, 255))  # glass body
    d.ellipse([10, 14, 22, 30], fill="#E1BEE7")  # smoothie
    # Straw
    rect(d, 16, 4, 2, 12, "#EF5350")

def menu_mocha(d, P):
    rrect(d, 8, 12, 16, 14, 3, "#FFF5E1")
    d.ellipse([10, 14, 22, 24], fill="#6F4E37")
    # Whipped cream
    circ(d, 16, 12, 4, "#FFFFF0")
    for i in range(5):
        angle = i * 72
        rad = angle * 3.14 / 180
        cx = 16 + int(2.5 * (rad))
        cy = 12 - int(2.5 * (rad))
        circ(d, cx, cy, 1.5, "#FFFFF0")

def menu_chair(drawer):
    pass

# ═══════════ UI ELEMENTS ═══════════

def gen_ui(key, drawer):
    img = Image.new("RGBA", (64, 16), None)
    d = ImageDraw.Draw(img)
    drawer(d, PALETTE)
    out = os.path.join(os.path.dirname(__file__), "vector_assets/ui")
    os.makedirs(out, exist_ok=True)
    fn = f"ui_{key}.png"
    img.save(os.path.join(out, fn), "PNG")
    return key, fn

def ui_stamina_bar(d, P):
    # Background bar
    rrect(d, 2, 4, 60, 8, 2, "#4B3C2D")
    # Full green fill
    rrect(d, 4, 5, 56, 6, 2, P["stamina_green"])
    # Shine highlight (top edge)
    rect(d, 4, 4, 56, 1, (129, 199, 132))

def ui_patience_meter(d, P):
    rrect(d, 2, 4, 60, 8, 2, "#4B3C2D")
    # Yellow fill (halfway = urgent)
    rrect(d, 4, 5, 28, 6, 2, P["patience_yellow"])
    # Warning dot
    circ(d, 30, 8, 2, P["danger_red"])

def ui_rep_star(d, P):
    circ(d, 32, 8, 14, P["rep_star_gold"])
    for i in range(5):
        angle = i * 72 - 90
        rad = angle * 3.14 / 180
        cx = 32 + int(10 * (rad))
        cy = 8 - int(10 * (rad))
        circ(d, cx, cy, 6, P["rep_star_gold"])

def ui_coin_icon(d, P):
    rrect(d, 8, 4, 48, 48, 6, "#E65100")  # coin outline
    circ(d, 32, 28, 18, P["coin_gold"])  # coin body
    rect(d, 29, 18, 6, 20, "#FFFDF7")  # $ sign vertical
    rect(d, 27, 20, 2, 4, "#FFFDF7")  # $ sign left curve

# ═══════════ MAIN ═══════════

if __name__ == "__main__":
    print("[OK] Trendy Cafe - Decorations & UI Generator v1.0")
    print("=" * 60)
    
    all_ok = []
    
    # Decorations
    decos = {
        "neon_cat": deco_neon_cat,
        "succulent": deco_potted_succulent,
        "string_lights": deco_string_lights,
        "bookshelf": deco_bookshelf,
        "floor_lamp": deco_floor_lamp,
        "candle": deco_candle,
        "chandelier": deco_chandelier,
    }
    
    print("\n[DECORATIONS]")
    for key, drawer in decos.items():
        try:
            k, fn = gen_deco(key, drawer)
            all_ok.append(f"  [OK] {key}.png")
        except Exception as e:
            print(f"  [ERR] {key}: {e}")
    
    # Menu items (only ones with drawing functions defined)
    menu_items = {
        "black_coffee": menu_black_coffee,
        "milk_coffee": menu_milk_coffee,
        "latte": menu_latte,
        "matcha": menu_matcha,
        "espresso": menu_espresso,
        "smoothie": menu_smoothie,
        "mocha": menu_mocha,
    }
    
    print("\n[MENU ITEMS]")
    for key, drawer in menu_items.items():
        try:
            k, fn = gen_menu_item(key, drawer)
            all_ok.append(f"  [OK] menu_{key}.png")
        except Exception as e:
            print(f"  [ERR] menu_{key}: {e}")
    
    # UI elements
    ui_items = {
        "stamina_bar": ui_stamina_bar,
        "patience_meter": ui_patience_meter,
        "rep_star": ui_rep_star,
        "coin_icon": ui_coin_icon,
    }
    
    print("\n[UI ELEMENTS]")
    for key, drawer in ui_items.items():
        try:
            k, fn = gen_ui(key, drawer)
            all_ok.append(f"  [OK] ui_{key}.png")
        except Exception as e:
            print(f"  [ERR] ui_{key}: {e}")
    
    print(f"\n[DONE] Generated {len(all_ok)} assets!")
    for line in all_ok:
        print(line)

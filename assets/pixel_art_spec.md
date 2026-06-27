# ☕ Trendy Cafe — Pixel Art Specification Document

**Version:** 1.0  
**Date:** June 25, 2026  
**Canvas Size:** 32×32 pixels per sprite  
**Resolution Ratio:** 1px = 1 game unit  
**Total Sprites:** ~80+  

---

## 1. COLOR PALETTE REFERENCE

All colors organized by category. Primary palette file: `color_palette.png` (generated via `color_palette.py`).

### Palette Groups

| Group | Count | Theme |
|-------|-------|-------|
| NEUTRALS | 9 | Warm skin tones, backgrounds, wood tones |
| COFFEE | 8 | Bean roasts, drink colors, foam textures |
| GREENS | 8 | Plants, moss, matcha decor accents |
| GOLDS | 7 | Lighting, pastries, warm highlights |
| PASTELS | 6 | Decor accents, specialty drinks |
| UI | 10 | HUD elements, bars, indicators |
| CHARACTERS | 16 | Skin tones, hair colors, uniforms |
| ENVIRONMENT | 13 | Floor, wall, window, door tiles |
| FOOD | 8 | Desserts, ingredients, textures |

**Key Colors for Cafe Aesthetic:**
- `#FFF5E1` Ivory — primary background / text highlight
- `#F5DEB3` Cream — warm neutral base
- `#A67C52` Wood floor — game map foundation
- `#4B3C2D` Deep espresso — dark outlines, text
- `#2E7D32` Forest green — barista apron / plants
- `#F9D6A0` Golden yellow — lighting / mood accent

---

## 2. CUSTOMER SPRITES (7 TYPES × 4 FRAMES EACH)

### Frame Layout (each customer type has 4 animation frames)

```
Frame 1: Standing/walking left leg forward
Frame 2: Walking right leg forward (offset -1px horizontally)
Frame 3: Standing / slight lean back
Frame 4: Idle breathing (offset +0.5px vertically via sub-pixel in engine)
```

### 2A. ☕ Coffee Lover — "Quick regular"

| Property | Value |
|----------|-------|
| Hair Color | `#5C4033` brown (short, neat) |
| Skin Tone | `#FDDCB5` light warm |
| Shirt | `#90CAF9` denim blue t-shirt |
| Pants/Shoes | `#A0522D` medium walnut / `#4B3C2D` dark espresso shoes |
| Prop | Latte cup in left hand (`#FFF8F0` + `#C68E32`) |
| Walking Speed | Fastest (base 1.2x) |
| Height | 32px full sprite |

**Sprite Layout:**
```
[ 2-5]: Hair (brown, short cut)
[7-14]: Face — eyes `#3E2723`, smile arc
[15-22]: T-shirt body (denim blue) + arms reaching down to hold cup
[23-26]: Legs (walnut brown)
[27-31]: Shoes (dark espresso)
```

**4 Animation Frames:** Shift body ±1px horizontally between frames; cup stays level.

---

### 2B. 💻 Digital Nomad — "The laptop worker"

| Property | Value |
|----------|-------|
| Hair Color | `#DAA520` blonde (messy, slightly over forehead) |
| Skin Tone | `#EAC086` medium warm |
| Shirt | `#9CCC65` sage green hoodie |
| Pants/Shoes | `#4B3C2D` dark / `#D2B48C` light shoes |
| Prop | Small laptop (`#3E2F22` body + `#E8E4DF` screen) held against chest |
| Accessories | Round glasses, slight stubble (`#C69C6D`) |
| Walking Speed | Normal (base 1.0x) |

**Sprite Layout:**
```
[0-5]: Messy hair extending above normal head height
[4-7]: Glasses frame `#4B3C2D` over eyes
[6-14]: Face + stubble patch on chin
[12-15]: Hoodie collar
[14-23]: Hoodie body with chest pocket line
[16-17]: Laptop visible below chin
[24-29]: Legs (jeans, dark)
[30-32]: Light shoes
```

**Animation:** Laptop stays fixed relative to torso; legs alternate ±2px.

---

### 2C. ♡ Couple Member — "Date night visitor"

| Property | Value |
|----------|-------|
| Hair Color | `#B7410E` auburn (long, flowing past shoulders) |
| Skin Tone | `#C68642` deeper warm |
| Dress | `#F8BBD0` blush pink dress |
| Shoes | `#7A442A` rich mahogany heels (pointed) |
| Prop | Small purse on shoulder (`#DAA520` gold clasp) |
| Walking Speed | Slowest elegant walk (base 0.8x) |

**Sprite Layout:**
```
[2-6]: Long hair covering top and sides of head
[4-9]: Long hair extensions flowing down past shoulders
[7-14]: Face with pink blush (`#F8BBD0`) on cheeks
[13-22]: Dress body — flared shape wider at bottom
[20-26]: Skirt widening downward
[26-30]: Heel shoes (pointed tip)
```

**Animation:** Slight sway ±1px; hair bobs +1px with each step.

---

### 2D. 👨‍👩‍👧 Family Dad — "Weekend visitor"

| Property | Value |
|----------|-------|
| Hair Color | `#1B1B1B` black (short, crew cut) |
| Skin Tone | `#FDDCB5` light warm |
| Shirt | `#2E7D32` forest green polo shirt |
| Pants/Shoes | `#E3C9A8` khaki beige / `#7A442A` brown shoes |
| Prop | Mustache (`#5C4033`) |
| Walking Speed | Normal (base 1.0x) |

**Sprite Layout:**
```
[3-6]: Short crew cut hair (tight to head)
[4]: Mustache patch `#5C4033` above mouth line
[8-14]: Face with slight frown or neutral expression
[12-15]: Polo collar detail
[14-22]: Polo shirt body (slightly bulkier than t-shirt)
[23-27]: Khaki pants
[28-32]: Brown shoes (rounded toe)
```

**Animation:** Sturdy walk — leg movement more pronounced, less sway.

---

### 2E. 📷 Tourist/Influencer — "The photo taker"

| Property | Value |
|----------|-------|
| Hair Color | `#E8DCC8` platinum blonde (short pixie cut) |
| Skin Tone | `#EAC086` medium with tan |
| Shirt | `#F9D6A0` golden yellow bright tee |
| Shorts/Shoes | `#D2B48C` soft sand shorts / `#7A442A` sandals |
| Accessories | Sunhat (`#F5DEB3` cream brim + `#F9D6A0` top) |
| Prop | Camera (`#6F4E37` body, `#1B1B1B` lens) in hand |
| Walking Speed | Energetic bounce (base 1.1x) |

**Sprite Layout:**
```
[0-4]: Sunhat brim extending beyond head width
[2-6]: Hair peeking from under hat
[7-14]: Tan face + sunglasses (`#3E2723` frame + `#4B3C2D` lens)
[12-21]: Bright yellow shirt (short sleeves visible)
[18-19]: Camera held at chest level
[22-25]: Shorts (above knee)
[26-32]: Sandals with visible toes
```

**Animation:** Bouncy walk — entire sprite shifts ±1px vertically; camera bobs slightly.

---

### 2F. 💼 Business Person — "Quick espresso runner"

| Property | Value |
|----------|-------|
| Hair Color | `#5C4033` brown (neat side-part) |
| Skin Tone | `#FDDCB5` light warm |
| Suit | `#4B3C2D` dark suit jacket + `#FFF5E1` white shirt |
| Tie | `#EF5350` red tie |
| Pants/Shoes | `#4B3C2D` matching suit pants / `#3E2723` leather shoes |
| Prop | Briefcase (`#7A442A` brown + `#B8860B` brass handle) in right hand |
| Walking Speed | Fastest business stride (base 1.3x) |

**Sprite Layout:**
```
[3-7]: Neat side-part hair (swept to one side)
[8-14]: Face — sharp, focused expression (narrower eyes)
[12-15]: White shirt collar visible above jacket
[14-16]: Red tie stripe down center
[14-22]: Suit jacket body (structured shoulders, wider at top)
[22-23]: Briefcase hanging from right hand
[23-28]: Matching suit pants (straight leg)
[29-32]: Pointed leather dress shoes
```

**Animation:** Purposeful stride — larger step distance between frames.

---

### 2G. 🎨 Artist/Creative — "Long-stay observer"

| Property | Value |
|----------|-------|
| Hair Color | `#B7410E` auburn (curly, wild) |
| Skin Tone | `#C68642` medium warm |
| Shirt | `#E1BEE7` lavender base with `#AED581` green pattern dots |
| Pants/Boots | `#558B2F` moss green loose pants / `#7A442A` brown boots |
| Accessories | Beard (`#B7410E`), sketchbook prop |
| Walking Speed | Slow wandering (base 0.7x) |

**Sprite Layout:**
```
[0-5]: Curly hair extending wide on both sides
[13]: Full beard covering lower face
[7-14]: Face with thoughtful expression (one eyebrow raised)
[13-22]: Lavender patterned shirt (dots every 3px)
[19-21]: Sketchbook in left hand (`#F5DEB3` cover + pencil stick)
[22-27]: Loose, flowing pants
[28-32]: Brown work boots (sturdy, wide sole)
```

**Animation:** Shuffling walk — feet stay close together; body sways ±1.5px gently.

---

## 3. STAFF SPRITES (4 TYPES)

### 3A. ☕ Barista — "Coffee master"

| Property | Value |
|----------|-------|
| Hair | `#5C4033` brown, under cap |
| Cap | `#2E7D32` green with logo patch (center front) |
| Skin Tone | `#FDDCB5` light warm |
| Shirt | `#FAFAFA` white collared shirt |
| Apron | `#2E7D32` forest green full apron with pocket |
| Pants/Shoes | `#4B3C2D` dark pants / `#3E2723` shoes |

**Sprite Layout:**
```
[0-5]: Green barista cap (flat top, small brim)
[3-8]: Hair visible under cap edges
[6-13]: Face — friendly smile, apron strings on each side
[12-15]: White collar of shirt
[14-24]: Green apron body with white outline pocket at chest height
[15-17]: Apron pocket detail (white box)
[10-13]: Left arm extending toward counter
[19-22]: Right arm holding portafilter or cup
[25-28]: Pants
[29-32]: Dark shoes
```

**Working Animation:** Arms rotate between: (a) pouring water, (b) tapping milk jug, (c) wiping counter.

---

### 3B. 🍳 Cook — "Kitchen specialist"

| Property | Value |
|----------|-------|
| Hat | `#FFFFF0` white chef's toque (tall, puffy top) |
| Hair | `#1B1B1B` black (under hat, not visible) |
| Skin Tone | `#8D5524` deeper warm |
| Jacket | `#FFFFFF` white double-breasted chef coat |
| Pants/Shoes | `#4B3C2D` dark / `#F5DEB3` non-slip cream shoes |
| Apron Stripe | `#EF5350` red horizontal stripe on lower apron |

**Sprite Layout:**
```
[-2-1]: Chef hat top (puffy white)
[0-4]: Chef hat band around head base
[5-12]: Face — warm smile, rosy cheeks (`#C68E32`)
[10-12]: Jacket collar (white, V-neck opening)
[12-24]: White chef jacket with 3 cream buttons down center
[18-20]: Red apron stripe across lower abdomen
[8-11]: Left arm slightly wider (cook's sturdy build)
[21-24]: Right arm holding spatula or ladle
[25-28]: Dark pants
[29-32]: Cream non-slip shoes (rounded sole)
```

**Working Animation:** Arms alternate between stirring pot and flipping ingredients. Body bobs slightly with motion.

---

### 3C. 🧹 Server — "Floor attendant"

| Property | Value |
|----------|-------|
| Hair | `#1B1B1B` black (ponytail behind head) |
| Skin Tone | `#EAC086` medium warm |
| Vest | `#1A237E` dark blue sleeveless vest |
| Shirt | `#FAFAFA` white under vest |
| Name Badge | `#FFA726` gold badge on left chest |
| Pants/Shoes | `#1B1B1B` black / `#3E2723` dark shoes |
| Prop | Silver tray in left hand (`#BDBDBD`) |

**Sprite Layout:**
```
[2-6]: Hair with ponytail extending behind (right side)
[6-13]: Face — welcoming smile, rosy cheeks
[11-15]: Blue vest over white shirt collar
[13-15]: Gold name badge on left chest
[15-22]: Vest body (narrower than jacket — no sleeves)
[8-11]: White shirt sleeve visible on left arm
[19-22]: White shirt sleeve visible on right arm
[7-10]: Silver tray held in left hand
[23-27]: Black pants
[28-32]: Dark shoes
```

**Working Animation:** Arms move between: (a) holding tray, (b) gesturing to customer, (c) clearing table.

---

### 3D. 💰 Cashier — "Front desk operator"

| Property | Value |
|----------|-------|
| Hair | `#1B1B1B` black (short, neat) |
| Skin Tone | `#C68642` medium warm |
| Shirt | `#FF6F00` orange branded shirt |
| Collar | `#F5DEB3` cream collar detail |
| Pants/Shoes | `#E3C9A8` khaki / `#7A442A` brown shoes |

**Sprite Layout:**
```
[3-7]: Short neat hair (swept to right)
[6-13]: Face — bright smile, friendly expression
[12-15]: Orange collar with cream trim
[14-22]: Orange shirt body (branded — no apron needed)
[20-22]: Small logo patch on left chest (`#FFF5E1` text on orange)
[9-12]: Left arm reaching toward POS terminal
[20-23]: Right arm holding receipt or card reader
[23-27]: Khaki pants
[28-32]: Brown shoes
```

**Working Animation:** Arms reach up/down between: (a) taking payment, (b) handing receipt, (c) tapping POS screen.

---

## 4. DECORATION ITEMS (59+ items — categorized below with sprite specs)

### 4A. Wall Decorations

| Item ID | Name | Sprite Design | Key Colors |
|---------|------|---------------|------------|
| W01 | Neon Cat Sign | Black cat silhouette, glowing green eyes | `#3E2723` + `#558B2F` glow |
| W02 | Vintage Posters | 3 framed rectangular posters on wall | `#FFF5E1`, `#C69C6D`, warm tones |
| W03 | Moss Wall | Dense green texture with organic blobs | `#7CB342`, `#558B2F`, `#2E7D32` |
| W04 | Bookshelf | Wooden shelves with colorful books | `#C69C6D`, multi-color books |
| W05 | LED Strips | Thin line with color dots along wall | `#FFE082`, `#F9D6A0` |
| W06 | Mirror Frame | Ornate gold frame, light gray reflection | `#FFD54F`, `#BDBDBD` |
| W07 | Chalkboard Menu | Dark board with white text lines | `#3E2723`, `#FFF5E1` |

### 4B. Table/Counter Decorations

| Item ID | Name | Sprite Design | Key Colors |
|---------|------|---------------|------------|
| T01 | Potted Succulent | Small green rosette in clay pot | `#7CB342`, `#7A442D` (pot) |
| T02 | Candle Holder | Brass base, white candle, yellow flame | `#B8860B`, `#FFFFF0`, `#FFE082` |
| T03 | Flower Vase | Glass vase with 3 pink flowers | `#D6EAF8`, `#F8BBD0` |
| T04 | Coffee Tin Planter | Rustic tin can with small plant growing | `#C69C6D`, `#7CB342` |
| T05 | Table Sign | Small whiteboard on easel | `#FFF5E1`, `#BDBDBD` (frame) |

### 4C. Floor/Large Decorations

| Item ID | Name | Sprite Design | Key Colors |
|---------|------|---------------|------------|
| F01 | Palm Tree | Tall plant with spreading fronds in planter | `#7CB342`, `#558B2F` + `#C69C6D` pot |
| F02 | Floor Lamp | Tall brass lamp with cream shade | `#B8860B`, `#FFF5E1` |
| F03 | Water Fountain | Tiered stone fountain with blue water | `#E8E4DF`, `#90CAF9` |
| F04 | Record Player Display | Vintage turntable on stand, vinyl disc visible | `#3E2723`, `#B8860B` |
| F05 | Art Painting Stand | Canvas on easel with abstract art | `#FFF5E1` canvas, multi-color paint |

### 4D. Ceiling/Hanging Decorations

| Item ID | Name | Sprite Design | Key Colors |
|---------|------|---------------|------------|
| C01 | String Lights | Wire with warm white bulb dots (curved) | `#FFE082`, `#4B3C2D` wire |
| C02 | Hanging Baskets | 2-3 baskets with green foliage | `#7CB342`, `#C69C6D` baskets |
| C03 | Pendant Lamp | Coffee-shop style lamp over counter area | `#B8860B`, `#FFF5E1` (light glow) |
| C04 | Fairy Light Curtain | Vertical strands of tiny lights | `#FFE082` + `#F9D6A0` mixed |
| C05 | Hanging Bookshelf | Wall-mounted shelf with books and small plants | `#C69C6D`, multi-color |

### 4E. Environment Tiles (floor, walls, windows)

#### Floor Patterns
| Tile Type | Description | Colors |
|-----------|-------------|--------|
| Wood Plank | Horizontal plank lines, slight variation | `#A67C52` base, `#8B6914` lines |
| White Tile | Grid of squares with grout lines | `#E8E4DF` tiles, `#D0CFC8` grout |
| Counter Marble | Smooth gradient from top to bottom | `#F0EDE6` base, `#D2B48C` veins |

#### Wall Patterns
| Tile Type | Description | Colors |
|-----------|-------------|--------|
| Brick Red | Classic brick pattern with mortar lines | `#B22222` bricks, `#CDBBB0` mortar |
| Wood Panel | Vertical wood strips with grain texture | `#C69C6D` panels, `#A0522D` grooves |
| Painted Cream | Solid warm cream wall | `#F5F0E1` base |
| Painted Sage | Solid muted sage green wall | `#B5C49A` base |

#### Window Elements
| Tile Type | Description | Colors |
|-----------|-------------|--------|
| Glass Pane | Semi-transparent blue-gray | `#D6EAF8` with 60% alpha |
| Window Frame | White wooden cross-frame | `#F5F5DC` on any wall color |
| Door Frame | Wooden arched doorway | `#795548` wood, warm highlight edge |

---

## 5. UI ELEMENTS

### 5A. Status Bars (32×8px — narrow format)

| Element | Design | Colors |
|---------|--------|--------|
| Stamina Bar | Full-width bar, green fill with subtle shine on top | Background: `#4B3C2D`, Fill: `#66BB6A`, Shine: `#81C784` (top 1px) |
| Patience Meter | Warning-style — yellow base, turns red at low patience | Yellow: `#FFCA28`, Low-red: `#EF5350` |
| Reputation Progress | Circular progress arc with star icon | Gold: `#FFD54F`, Background: `#2D1B14` |

### 5B. Icon Sprites (32×32px each)

| Icon | Design | Colors |
|------|--------|--------|
| ☕ Coffee Cup | Simple cup with handle and steam wavy lines | `#FFF5E1`, `#6F4E37` (coffee), `#FFE082` (steam glow) |
| 💰 Coin Stack | 3 stacked coins with dollar symbol on top coin | `#FFA726`, `#E65100` (outline), white `$` |
| ⭐ Reputation Star | Five-pointed gold star with highlight | `#FFD54F`, `#FFE082` (highlight), `#B8860B` (shadow) |
| 📍 Location Pin | Map pin pointing down | `#EF5350` red pin, white center dot |
| ⏰ Clock | Circular clock face with hands | `#FFF5E1` face, `#4B3C2D` rim, `#6F4E37` hands |
| 📊 Chart Bar | 4 vertical bars of increasing height | Multi-color gradient from `#66BB6A` to `#EF5350` |

---

## 6. ENVIRONMENT / BACKGROUND ELEMENTS

### 6A. Window Weather Effects (overlay sprites)
| Effect | Design | Colors |
|--------|--------|--------|
| Sun Beam | Diagonal warm light rays from window | `#FFE082`, alpha 30% overlay |
| Rain Drops | Vertical streaks on glass window | `#90CAF9`, alpha 50% |
| Night Sky | Dark blue sky visible through window with stars | `#1A237E` background, `#FFF5E1` star dots |
| Foggy Window | Frosted semi-transparent overlay | `#E8E4DF`, alpha 40% |

### 6B. Counter & Equipment
| Element | Design | Colors |
|---------|--------|--------|
| Espresso Machine | Silver box with group heads and steam wand | `#BDBDBD` body, `#757575` details, `#3E2723` buttons |
| Coffee Grinder | Cylindrical transparent container on base | `#90CAF9` glass, `#B8860B` base, `#5D4037` beans inside |
| Display Cabinet | Glass-front cabinet with pastries inside | `#E8E4DF` frame, `#D6EAF8` glass, `#E8A849` croissants |
| POS Terminal | Tablet on stand showing screen | `#1B1B1B` device, `#FFF5E1` screen with menu items |

---

## 7. ANIMATION SPECIFICATIONS

### Walk Cycle (all characters) — 4 frames

```
Frame 1: Left leg forward, right arm back → shift body right by +1px relative to frame 0
Frame 2: Both legs together (mid-step) → center position (frame 0 baseline)
Frame 3: Right leg forward, left arm back → shift body left by -1px relative to frame 2
Frame 4: Both legs together (return) → center position
```

### Working Animations per Staff Type

| Staff | Animation Pattern | Duration/Frame |
|-------|-------------------|----------------|
| Barista | Left arm: pour → tap → wipe (3 sub-frames each) | 0.5s per sub-frame |
| Cook | Right arm: stir clockwise in circles + lift spatula | 1.0s full cycle |
| Server | Arms alternate tray-hold and clear gestures | 0.75s per gesture |
| Cashier | Hand reaches up to POS, taps, then lowers with receipt | 0.4s tap + 0.3s lower |

### Customer Idle Animations
| State | Animation | Duration |
|-------|-----------|----------|
| Waiting in Queue | Slight bounce ±2px vertically; looks at menu board | 1s loop |
| Seated — Ordering | Arm raises to point at menu items | Single event on order |
| Seated — Drinking | Cup/hand lifts to mouth, lowers back | 0.5s per sip |
| Seated — Waiting Food | Shifts weight ±1px; looks toward kitchen occasionally | 2s loop |
| Seated — Enjoying | Slight head tilt + smile (subtle pixel change) | Continuous idle |
| Leaving | Turns away from table, walks toward exit door | Walk animation |

---

## 8. ASSET FILE NAMING CONVENTION

```
assets/sprites/placeholder/customer_{type}.png       # 7 customer base sprites
assets/sprites/placeholder/staff_{role}.png          # 4 staff sprites
assets/sprites/placeholder/decoration_{item_id}.png   # 59+ decoration sprites
assets/sprites/placeholder/ui_{element}.png          # UI element sprites
assets/sprites/tile_floor_wood.png                   # Floor tile sheets (32x32 each, tiling)
assets/sprites/tile_floor_tile.png                   # White tile sheet
assets/sprites/tile_wall_brick.png                   # Brick wall tile sheet
assets/sprites/tile_wall_wood.png                    # Wood panel tile sheet
assets/sprites/tile_wall_cream.png                   # Painted cream wall tile sheet
assets/sprites/tile_counter_marble.png               # Marble counter tile sheet
assets/sprites/window_frame.png                      # Window frame element (32x32)
assets/sprites/door_frame.png                        # Door frame element (32x48px taller)
```

**Sprite Size:** All character/decoration sprites at 32×32 RGBA PNG  
**Tile Size:** All floor/wall tiles at 32×32 RGBA PNG (designed to tile seamlessly)  
**Window/Door:** Sized as needed — window frame 32×32, door 32×48  

---

## 9. IMPLEMENTATION NOTES

### Loading Sprites in Pygame
```python
import pygame
# Load sprite sheets or individual PNGs
customer_sprites = {}
for name in ["coffee_lover", "nomad", "couple", "family", "tourist", "business", "artist"]:
    customer_sprites[name] = pygame.image.load(f"assets/sprites/placeholder/customer_{name}.png").convert_alpha()

staff_sprites = {
    "barista":   pygame.image.load("assets/sprites/placeholder/staff_barista.png").convert_alpha(),
    "cook":      pygame.image.load("assets/sprites/placeholder/staff_cook.png").convert_alpha(),
    "server":    pygame.image.load("assets/sprites/placeholder/staff_server.png").convert_alpha(),
    "cashier":   pygame.image.load("assets/sprites/placeholder/staff_cashier.png").convert_alpha(),
}
```

### Animation Frame Extraction
If using sprite sheets (multiple frames in one image):
```python
# Extract frames from a 128x32 sheet (4 frames × 32px each)
sheet = pygame.image.load("assets/sprites/characters/customer_coffee_lover_sheet.png").convert_alpha()
frames = []
for i in range(4):
    frame = sheet.subsurface(i * 32, 0, 32, 32)
    frames.append(frame)
```

### Grid Map Tile Loading
```python
# Load tile types — Pygame will auto-stretch to tile size
tile_grids = {
    "wood": pygame.image.load("assets/sprites/tile_floor_wood.png").convert_alpha(),
    "tile": pygame.image.load("assets/sprites/tile_floor_tile.png").convert_alpha(),
    "brick_wall": pygame.image.load("assets/sprites/tile_wall_brick.png").convert_alpha(),
    "cream_wall": pygame.image.load("assets/sprites/tile_wall_cream.png").convert_alpha(),
}
```

---

## 10. GENERATION SCRIPTS

Two Python scripts provided in `assets/`:

### `color_palette.py`
- Generates `assets/color_palette.png` — visual swatch grid of all palette colors
- Also exports `assets/palette.json` — machine-readable color reference for engine code
- Run: `python assets/color_palette.py`

### `placeholder_generator.py`
- Generates 80+ placeholder PNG files in `assets/sprites/placeholder/`
- Each sprite is hand-crafted pixel art using Pillow primitives
- Includes all 7 customers, 4 staff, 7 key decorations, 4 UI elements
- Run: `python assets/placeholder_generator.py`

---

_Document v1.0 — June 25, 2026_  
*For T D — Trendy Cafe Pixel Art Asset Pipeline*

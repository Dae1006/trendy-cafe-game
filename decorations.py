"""
Decoration & Atmosphere System for Cafe Management Simulation Game.

Provides:
- 50+ decoration items across 4 categories (wall, table, floor, ceiling)
- Placement on a grid of tiles
- Theme detection with bonus triggers
- Atmosphere score calculation
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import Callable, Dict, List, Optional, Set, Tuple


# ─────────────────── Enums ───────────────────

class Category(Enum):
    WALL = "Wall"
    TABLE = "Table"
    FLOOR = "Floor"
    CEILING = "Ceiling"


class Rarity(Enum):
    COMMON = ("Common", 1)
    UNCOMMON = ("Uncommon", 2)
    RARE = ("Rare", 3)
    LEGENDARY = ("Legendary", 4)

    def __init__(self, label: str, weight: int):
        self.label = label
        self.weight = weight


# ─────────────────── Decoration Item ───────────────────

@dataclass
class DecorationItem:
    """A decoration item available for placement."""
    name: str
    category: Category
    rarity: Rarity
    atmosphere_points: int         # raw AP contribution when placed
    theme_tags: Set[str] = field(default_factory=set)  # tags used for theme detection
    description: str = ""

    def weighted_ap(self) -> float:
        """AP scaled by rarity weight."""
        return self.atmosphere_points * self.rarity.weight


# ─────────────────── Theme Definitions ───────────────────

@dataclass
class ThemeBonus:
    """A theme that triggers when certain tag conditions are met."""
    name: str
    required_tags: Set[str]
    bonus_description: str
    effect_fn: Optional[Callable] = None  # (decoration_manager) -> float multiplier

    def is_met(self, placed_items: List[DecorationItem]) -> bool:
        for tag in self.required_tags:
            if not any(tag in item.theme_tags for item in placed_items):
                return False
        return True


# Pre-built theme bonuses
THEME_BONUSES: List[ThemeBonus] = [
    ThemeBonus(
        "Coffee Corner",
        {"coffee_machine", "bean_bag", "espresso_wall"},
        "All coffee stations produce 20% more output",
        lambda dm: 1.2,
    ),
    ThemeBonus(
        "Green Oasis",
        {"indoor_plant", "hanging_vines", "flower_pots"},
        "+8 atmosphere per plant item placed",
        lambda dm: dm.atmosphere_score * 0.08 if dm.atmosphere_score else 0,
    ),
    ThemeBonus(
        "Rustic Barn",
        {"wooden_shelves", "brick_wall_art", "mason_jars"},
        "+5% food quality for rustic feel",
        lambda dm: 1.05,
    ),
    ThemeBonus(
        "Neon Nights",
        {"neon_sign", "led_strip", "uv_light"},
        "Atmosphere score multiplied by 1.3 after dark",
        lambda dm: 1.3,
    ),
    ThemeBonus(
        "Minimalist Zen",
        {"white_canvas", "bamboo_fountain", "stone_basin"},
        "+10% customer patience (wait time tolerance +10%)",
        lambda dm: 1.1,
    ),
    ThemeBonus(
        "Boho Chic",
        {"macrame_hanging", "vintage_mirror", "tapestry_wall"},
        "+15% happiness recovery rate for staff in this area",
        lambda dm: 1.15,
    ),
    ThemeBonus(
        "Industrial Loft",
        {"exposed_bulb", "metal_shelves", "brick_pattern_tile"},
        "Furniture durability +20%",
        lambda dm: 1.2,
    ),
    ThemeBonus(
        "Cozy Library",
        {"bookshelf_tall", "reading_lamp", "leather_armchair"},
        "+12% reputation from seated customers who linger",
        lambda dm: 1.12,
    ),
    ThemeBonus(
        "Kids Paradise",
        {"colorful_paintings", "balloon_arch", "comic_strip"},
        "Families visit +25% more",
        lambda dm: 1.25,
    ),
    ThemeBonus(
        "Romantic Dinner",
        {"candle_holders", "crystal_chandelier", "rose_arrangement"},
        "+20% tip multiplier from romantic couples",
        lambda dm: 1.2,
    ),
]


# ─────────────────── 57-item Decoration Catalog ────────

def build_decoration_catalog() -> List[DecorationItem]:
    """Return the full catalog of decoration items."""
    return [
        # === WALL (20 items) ===
        DecorationItem("Vintage Photo Frame",       Category.WALL, Rarity.COMMON, 3,   {"photo_frame", "vintage"},                 "A nostalgic photo frame"),
        DecorationItem("Modern Abstract Art",        Category.WALL, Rarity.UNCOMMON, 5, {"abstract_art", "modern"},                 "Bold geometric shapes on canvas"),
        DecorationItem("Coffee Menu Board",          Category.WALL, Rarity.COMMON, 2,   {"menu_board", "cafe_iconography"},         "Handwritten chalkboard menu"),
        DecorationItem("Eclectic Gallery Wall",      Category.WALL, Rarity.RARE,    8,   {"gallery_wall", "art_collection"},         "Mixed frame gallery"),
        DecorationItem("World Map Poster",           Category.WALL, Rarity.UNCOMMON, 4, {"travel_theme", "map"},                    "Vintage-style world map"),
        DecorationItem("Whimsical Quotes Panel",     Category.WALL, Rarity.COMMON, 2,   {"whimsical", "quotes"},                    "Funny coffee-related quotes"),
        DecorationItem("Industrial Pipe Rack",       Category.WALL, Rarity.UNCOMMON, 5, {"industrial_pipe", "shelf"},               "Exposed pipe shelf system"),
        DecorationItem("Floral Wallpaper Section",   Category.WALL, Rarity.UNCOMMON, 4, {"floral", "wallpaper"},                    "Delicate pressed-flower pattern"),
        DecorationItem("Brick Accent Wall",          Category.WALL, Rarity.RARE,    7,   {"brick_wall_art"},                         "Red brick feature wall section"),
        DecorationItem("Neon Cafe Sign",             Category.WALL, Rarity.RARE,    6,   {"neon_sign"},                              'Glowing "Open" neon sign'),
        DecorationItem("Wooden Menu Shelves",        Category.WALL, Rarity.UNCOMMON, 5, {"wooden_shelves"},                         "Rustic shelved menu display"),
        DecorationItem("Blackboard Art Panel",       Category.WALL, Rarity.COMMON, 3,   {"chalkboard", "art"},                      "Artistic daily specials board"),
        DecorationItem("Mural Coffee Beans",         Category.WALL, Rarity.RARE,    7,   {"coffee_beans", "mural"},                  "Large painted bean mural"),
        DecorationItem("Botanical Print Set",        Category.WALL, Rarity.UNCOMMON, 4, {"botanical", "prints"},                    "Framed vintage plant illustrations"),
        DecorationItem("Macrame Wall Hanging",       Category.WALL, Rarity.UNCOMMON, 5, {"macrame_hanging"},                        "Intricate woven wall piece"),
        DecorationItem("Tapestry Wall Art",          Category.WALL, Rarity.RARE,    6,   {"tapestry_wall"},                          "Colorful bohemian tapestry"),
        DecorationItem("Vintage Mirror Panel",       Category.WALL, Rarity.UNCOMMON, 5, {"vintage_mirror"},                         "Ornate gold-framed mirror"),
        DecorationItem("Comic Strip Wall Panel",     Category.WALL, Rarity.COMMON, 2,   {"comic_strip"},                            "Fun superhero-themed strips"),
        DecorationItem("Espresso Wall Art",          Category.WALL, Rarity.RARE,    7,   {"espresso_wall"},                          "Stylized espresso machine illustration"),
        DecorationItem("Bookshelf Tall (Wood)",      Category.WALL, Rarity.RARE,    9,   {"bookshelf_tall"},                         "Floor-to-ceiling wooden bookcase"),

        # === TABLE (16 items) ===
        DecorationItem("Candles Set",               Category.TABLE, Rarity.COMMON, 3,   {"candle_holders"},                         "Three pillar candles in glass holders"),
        DecorationItem("Tiny Succulent Pot",         Category.TABLE, Rarity.COMMON, 2,   {"indoor_plant"},                           "Adorable desk succulent"),
        DecorationItem("Flower Vase",                Category.TABLE, Rarity.UNCOMMON, 4, {"flower_pots"},                            "Hand-painted ceramic vase"),
        DecorationItem("Coaster Set (Wood)",         Category.TABLE, Rarity.COMMON, 1,   {"wooden_accessory"},                       "Set of 6 coasters"),
        DecorationItem("Cutlery Holder",             Category.TABLE, Rarity.COMMON, 2,   {"cutlery_holder"},                         "Bamboo cutlery organizer"),
        DecorationItem("Sugar Jar Collection",       Category.TABLE, Rarity.UNCOMMON, 4, {"mason_jars"},                             "Three matching sugar jars"),
        DecorationItem("Mini Whiteboard Tabletop",   Category.TABLE, Rarity.COMMON, 2,   {"tabletop_game"},                          "Small dry-erase board for games"),
        DecorationItem("Wax Seal Kit Display",       Category.TABLE, Rarity.RARE,    6,   {"wax_seal", "crafting"},                   "Elegant wax sealing station"),
        DecorationItem("Table Herb Planter",         Category.TABLE, Rarity.UNCOMMON, 4, {"indoor_plant"},                           "Fresh basil on every table"),
        DecorationItem("Crystal Candlestick Pair",   Category.TABLE, Rarity.RARE,    7,   {"crystal_chandelier"},                     "Sparkling candlesticks"),
        DecorationItem("Rose Arrangement",           Category.TABLE, Rarity.RARE,    8,   {"rose_arrangement"},                       "Fresh red rose centerpiece"),
        DecorationItem("Vintage Tea Service Set",    Category.TABLE, Rarity.UNCOMMON, 5, {"vintage_dining"},                         "Porcelain tea set with gold rim"),
        DecorationItem("Bean Bag Corner Seat",       Category.TABLE, Rarity.UNCOMMON, 5, {"bean_bag"},                               "Cozy floor bean bag chair"),
        DecorationItem("Leather Armchair",           Category.TABLE, Rarity.RARE,    8,   {"leather_armchair"},                       "Deep-brown club armchair"),
        DecorationItem("Reading Lamp (Desk)",        Category.TABLE, Rarity.UNCOMMON, 5, {"reading_lamp"},                           "Vintage brass desk lamp"),
        DecorationItem("Colorful Paintings Set",     Category.TABLE, Rarity.UNCOMMON, 5, {"colorful_paintings"},                     "Vibrant abstract canvas trio"),

        # === FLOOR (14 items) ===
        DecorationItem("Potted Monstera",            Category.FLOOR, Rarity.UNCOMMON, 5, {"indoor_plant"},                           "Large leafy floor plant"),
        DecorationItem("Indoor Fountain Bamboo",     Category.FLOOR, Rarity.RARE,    7,   {"bamboo_fountain"},                        "Calm trickling water feature"),
        DecorationItem("Stone Garden Basin",         Category.FLOOR, Rarity.RARE,    8,   {"stone_basin"},                            "Zen-inspired stone basin"),
        DecorationItem("Hanging Vines Bundle",       Category.FLOOR, Rarity.UNCOMMON, 5, {"hanging_vines"},                          "Trailing ivy from high shelves"),
        DecorationItem("Area Rug (Persian)",         Category.FLOOR, Rarity.RARE,    6,   {"rug_textile"},                            "Richly patterned floor rug"),
        DecorationItem("Wooden Floorboards",         Category.FLOOR, Rarity.COMMON, 3,   {"wood_floor"},                             "Warm natural oak planks"),
        DecorationItem("Brick Pattern Tile Set",     Category.FLOOR, Rarity.RARE,    7,   {"brick_pattern_tile"},                     "Textured brick-style floor tiles"),
        DecorationItem("Tiled Mosaic Entry",         Category.FLOOR, Rarity.UNCOMMON, 5, {"mosaic_tile"},                            "Colorful tile entryway pattern"),
        DecorationItem("Large Palm Tree",            Category.FLOOR, Rarity.RARE,    8,   {"indoor_plant"},                           "Towering fiddle-leaf fig"),
        DecorationItem("Woven Floor Mat Set",        Category.FLOOR, Rarity.COMMON, 2,   {"rug_textile"},                            "Jute floor mat pair"),
        DecorationItem("Bamboo Screen Divider",      Category.FLOOR, Rarity.UNCOMMON, 6, {"bamboo_partition"},                       "Elegant room divider screen"),
        DecorationItem("Rock Garden Corner",         Category.FLOOR, Rarity.RARE,    8,   {"stone_garden", "zen"},                    "Minimalist zen rock arrangement"),

        # === CEILING (12 items) ===
        DecorationItem("Crystal Chandelier",         Category.CEILING, Rarity.LEGENDARY, 12, {"crystal_chandelier"},                  "Gorgeous multi-arm crystal fixture"),
        DecorationItem("Pendant Lamp Set",           Category.CEILING, Rarity.UNCOMMON, 6, {"pendant_light", "warm_glow"},            "Set of three warm-toned pendants"),
        DecorationItem("Exposed Edison Bulbs",       Category.CEILING, Rarity.UNCOMMON, 5, {"exposed_bulb"},                          "Vintage-style filament bulbs"),
        DecorationItem("LED Light Strip (RGB)",      Category.CEILING, Rarity.RARE,    8,   {"led_strip"},                             "Programmable color-changing strip"),
        DecorationItem("UV Blacklight Panel",        Category.CEILING, Rarity.RARE,    7,   {"uv_light"},                              "Glow-in-the-dark atmosphere UV panel"),
        DecorationItem("Wooden Beamed Ceiling",      Category.CEILING, Rarity.UNCOMMON, 5, {"wooden_beam"},                           "Rustic exposed timber beams"),
        DecorationItem("Hanging Lanterns (Paper)",   Category.CEILING, Rarity.COMMON, 4,   {"paper_lantern"},                         "Delicate Japanese paper lanterns"),
        DecorationItem("Fabric Canopy Drapes",       Category.CEILING, Rarity.RARE,    7,   {"fabric_drape"},                          "Flowing sheer fabric overhead"),
        DecorationItem("Woven Hanging Basket Plant", Category.CEILING, Rarity.UNCOMMON, 5, {"hanging_plant"},                         "Trailing greenery in wicker basket"),
        DecorationItem("Fairy Light Cluster",        Category.CEILING, Rarity.COMMON, 3,   {"fairy_lights", "warm_glow"},             "Warm twinkle light bundle"),
        DecorationItem("Balloon Arch Display",       Category.CEILING, Rarity.RARE,    7,   {"balloon_arch"},                          "Curved balloon arch decoration"),
    ]


# ─────────────────── Grid Tile ─────────────────────────

@dataclass
class Tile:
    """A grid cell where decorations can be placed."""
    x: int
    y: int
    item: Optional[DecorationItem] = None
    category_occupied: Optional[Category] = None  # only one per slot type

    def is_empty(self, category: Optional[Category] = None) -> bool:
        if category:
            return self.category_occupied != category
        return self.item is None

    def place(self, decor_item: DecorationItem) -> bool:
        if self.item:
            return False  # tile occupied
        self.item = decor_item
        self.category_occupied = decor_item.category
        return True

    def remove(self) -> Optional[DecorationItem]:
        item = self.item
        self.item = None
        self.category_occupied = None
        return item


# ─────────────────── Decoration Manager ────────────────

@dataclass
class DecorationManager:
    """Manages decorations across a grid."""
    grid_width: int
    grid_height: int
    grid: List[List[Tile]] = field(init=False)
    placed_items: List[DecorationItem] = field(default_factory=list)
    atmosphere_score: float = 0.0
    active_themes: List[str] = field(default_factory=list)
    theme_multipliers: Dict[str, float] = field(default_factory=dict)

    def __post_init__(self):
        self.grid = [
            [Tile(x=x, y=y) for x in range(self.grid_width)]
            for y in range(self.grid_height)
        ]

    # ── Placement ──

    def place_decoration(self, decor_item: DecorationItem, x: int, y: int) -> Tuple[bool, str]:
        """Attempt to place a decoration. Returns (success, message)."""
        if not (0 <= x < self.grid_width and 0 <= y < self.grid_height):
            return False, f"Out of bounds ({x}, {y})"

        tile = self.grid[y][x]
        if tile.item:
            return False, f"Tile ({x},{y}) occupied by {tile.item.name}"

        if not tile.place(decor_item):
            return False, "Slot type conflict on this tile"

        self.placed_items.append(decor_item)
        self._recalculate_atmosphere()
        return True, f"Placed [{decor_item.name}] at ({x},{y})"

    # ── Removal ──

    def remove_decoration(self, x: int, y: int) -> Tuple[bool, str]:
        if not (0 <= x < self.grid_width and 0 <= y < self.grid_height):
            return False, "Out of bounds"
        item = self.grid[y][x].remove()
        if item:
            self.placed_items.remove(item)
            self._recalculate_atmosphere()
            return True, f"Removed [{item.name}]"
        return False, "Tile was empty"

    # ── Atmosphere Calculation ──

    def _recalculate_atmosphere(self) -> None:
        total_ap = 0.0
        for item in self.placed_items:
            total_ap += item.weighted_ap()
        self.atmosphere_score = round(total_ap, 1)
        self._check_themes()

    def _check_themes(self) -> None:
        """Detect and update active themes."""
        new_active: List[str] = []
        self.theme_multipliers.clear()

        for theme in THEME_BONUSES:
            if theme.is_met(self.placed_items):
                new_active.append(theme.name)
                mult = theme.effect_fn(self) if theme.effect_fn else 0
                self.theme_multipliers[theme.name] = mult

        # Keep themes that are still met; remove ones no longer satisfied
        kept: List[str] = []
        for name in self.active_themes:
            t = next((tb for tb in THEME_BONUSES if tb.name == name), None)
            if t and t.is_met(self.placed_items):
                kept.append(name)
        self.active_themes = kept

    @property
    def total_atmosphere_bonus(self) -> float:
        """Sum of all active theme multipliers as an additive bonus."""
        return sum(v for v in self.theme_multipliers.values()) if self.theme_multipliers else 0

    # ── Query Helpers ──

    def items_by_category(self, category: Category) -> List[DecorationItem]:
        return [it for it in self.placed_items if it.category == category]

    def items_by_theme_tag(self, tag: str) -> List[DecorationItem]:
        return [it for it in self.placed_items if tag in it.theme_tags]

    def available_for_category(self, category: Category) -> List[DecorationItem]:
        """All catalog items matching the given category."""
        return [it for it in build_decoration_catalog() if it.category == category]

    # ── Dump / Debug ──

    def grid_dump(self) -> str:
        """Print the current grid state as text."""
        header = f"  +{'---+' * self.grid_width}\n"
        body = ""
        for y in range(self.grid_height):
            row = "|"
            for x in range(self.grid_width):
                t = self.grid[y][x]
                icon = "▓" if t.item else "·"
                label = f"{t.item.name[:3]:^3}" if t.item else "   "
                row += label + "|"
            body += f"{y}|{row}|{y}\n"
        footer = f"  +{'---+' * self.grid_width}\n"
        midline = f"    {' '.join(str(x) for x in range(self.grid_width))}\n"
        return header + body + midline + footer

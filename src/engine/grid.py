"""
grid.py - Grid-based map system for cafe management simulation.

Provides:
  - Tile / Zone data classes
  - A* pathfinding for staff movement
  - Zone detection (count tiles of each zone type in a contiguous region)
  - A two-layer grid (floor tiles + overlays such as furniture)
"""

from __future__ import annotations

import heapq
import math
from collections import deque
from dataclasses import dataclass, field
from enum import IntEnum
from typing import Dict, List, Optional, Set, Tuple


# ---------------------------------------------------------------------------
# Enums & Constants
# ---------------------------------------------------------------------------

class TileType(IntEnum):
    """Floor tile types that make up the walkable floor of the cafe."""
    FLOOR = 0
    COUNTER = 1          # service counter (staff only side)
    KITCHEN = 2          # kitchen area (staff only)
    TABLE_FLOOR = 3      # under a table
    WALKWAY = 4          # wide aisle tile

    def is_walkable(self, staff_only: bool = False) -> bool:
        """Return True if the tile may be walked on."""
        if staff_only:
            # Staff may walk everywhere except tables without chairs
            return self in (TileType.FLOOR, TileType.COUNTER, TileType.KITCHEN, TileType.WALKWAY)
        return self != TileType.TABLE_FLOOR


class ZoneType(IntEnum):
    """Logical zones that group contiguous tiles of the same functional purpose."""
    DINING_AREA = 0
    COUNTER_AREA = 1
    KITCHEN = 2
    RESTROOM = 3
    ENTRANCE = 4
    LOUNGE = 5

    def is_walkable(self) -> bool:
        return self != ZoneType.RESTROOM


@dataclass(frozen=True)
class TileKey:
    """Immutable grid coordinate."""
    col: int
    row: int

    def __hash__(self):
        return hash((self.col, self.row))


# ---------------------------------------------------------------------------
# Data classes for game entities
# ---------------------------------------------------------------------------

@dataclass
class Tile:
    """A single cell on the floor grid."""
    tile_type: TileType
    zone_type: ZoneType = ZoneType.DINING_AREA
    furniture: Optional[str] = None       # e.g. "table_4" , "chair", "plant"
    blocked: bool = False                 # temporary block (e.g. spilled coffee)

    @property
    def is_walkable(self) -> bool:
        return not self.blocked and self.tile_type.is_walkable()

    def cost_from(self, to_tile: Tile) -> float:
        """Movement cost between two tiles (higher for counter/kitchen)."""
        base = 1.0
        multiplier = {
            TileType.COUNTER: 1.5,
            TileType.KITCHEN: 2.0,
            TileType.TABLE_FLOOR: 10.0,   # effectively blocked
            TileType.FLOOR: 1.0,
            TileType.WALKWAY: 0.8,
        }
        return base * multiplier.get(to_tile.tile_type, 1.0)


@dataclass
class Zone:
    """A contiguous region of tiles sharing the same zone_type."""
    zone_type: ZoneType
    tiles: Set[TileKey] = field(default_factory=set)

    @property
    def tile_count(self) -> int:
        return len(self.tiles)

    @property
    def center(self) -> TileKey:
        """Centroid of the zone."""
        if not self.tiles:
            return TileKey(0, 0)
        avg_col = sum(t.col for t in self.tiles) / len(self.tiles)
        avg_row = sum(t.row for t in self.tiles) / len(self.tiles)
        return TileKey(int(avg_col), int(avg_row))

    @property
    def contains_table(self) -> bool:
        return any(t.furniture and "table" in t.furniture for t in self.tiles)


@dataclass
class StaffEntity:
    """A worker that moves around the grid."""
    name: str
    col: int
    row: int
    role: str                        # "barista", "cashier", "cleaner"
    current_task: Optional[str] = None
    is_busy: bool = False

    @property
    def pos(self) -> TileKey:
        return TileKey(self.col, self.row)


@dataclass
class CustomerEntity:
    """A visitor who arrives, orders, sits, eats/drinks, and leaves."""
    customer_id: int
    patience: float                  # ticks before leaving angry
    current_tick: int = 0
    status: str = "entering"         # entering | ordering | waiting | seated | eating | paying | leaving
    target_zone: Optional[ZoneType] = None
    col: int = -1
    row: int = -1


# ---------------------------------------------------------------------------
# Grid map class
# ---------------------------------------------------------------------------

class CafeGrid:
    """Two-layer grid (floor + overlay) for the cafe floor plan.

    Parameters
    ----------
    width, height : int
        Number of columns / rows.
    tile_size : int
        Pixel size used for rendering (stored for convenience).
    """

    def __init__(self, width: int, height: int, tile_size: int = 32):
        self.width = width
        self.height = height
        self.tile_size = tile_size
        # Floor layer — the base tiles
        self.floor: List[List[Tile]] = [
            [Tile(tile_type=TileType.FLOOR, zone_type=ZoneType.DINING_AREA) for _ in range(width)]
            for _ in range(height)
        ]
        # Overlay layer — furniture, decorations (None = empty overlay)
        self.overlay: List[List[Optional[str]]] = [
            [None for _ in range(width)] for _ in range(height)
        ]
        self._zones: List[Zone] = []

    # ------------------------------------------------------------------
    # Public mutators
    # ------------------------------------------------------------------

    def set_tile(self, col: int, row: int, tile_type: TileType, zone_type: ZoneType = ZoneType.DINING_AREA) -> None:
        """Change the floor tile at (col, row). Bounds-checked."""
        self._check_bounds(col, row)
        self.floor[row][col].tile_type = tile_type
        self.floor[row][col].zone_type = zone_type

    def set_overlay(self, col: int, row: int, overlay_str: str) -> None:
        """Place an overlay (furniture / decoration) at (col, row)."""
        self._check_bounds(col, row)
        self.overlay[row][col] = overlay_str

    def block_tile(self, col: int, row: int) -> None:
        """Temporarily make a tile impassable."""
        self._check_bounds(col, row)
        self.floor[row][col].blocked = True

    def unblock_tile(self, col: int, row: int) -> None:
        """Remove a blockage from a tile."""
        self._check_bounds(col, row)
        self.floor[row][col].blocked = False

    # ------------------------------------------------------------------
    # Zone detection
    # ------------------------------------------------------------------

    def detect_zones(self, zone_type: ZoneType) -> List[Zone]:
        """Find all contiguous regions of *zone_type* using flood-fill (BFS)."""
        visited: Set[TileKey] = set()
        zones: List[Zone] = []

        for r in range(self.height):
            for c in range(self.width):
                key = TileKey(c, r)
                if key in visited:
                    continue
                if self.floor[r][c].zone_type != zone_type or not self.floor[r][c].is_walkable:
                    continue
                # BFS flood-fill
                region: Set[TileKey] = set()
                queue: deque[TileKey] = deque([key])
                visited.add(key)
                while queue:
                    cur = queue.popleft()
                    region.add(cur)
                    for neighbour in self._walkable_neighbours(cur):
                        if neighbour not in visited and self.floor[neighbour.row][neighbour.col].zone_type == zone_type:
                            visited.add(neighbour)
                            queue.append(neighbour)
                zones.append(Zone(zone_type=zone_type, tiles=region))

        self._zones = zones
        return zones

    @property
    def zones(self) -> List[Zone]:
        """Cached zones (run detect_zones first)."""
        return self._zones

    def get_zone_for_tile(self, col: int, row: int) -> Optional[ZoneType]:
        """Return the zone type of a tile."""
        self._check_bounds(col, row)
        return self.floor[row][col].zone_type

    # ------------------------------------------------------------------
    # A* pathfinding
    # ------------------------------------------------------------------

    def astar(
        self,
        start_col: int,
        start_row: int,
        goal_col: int,
        goal_row: int,
        staff_only: bool = False,
    ) -> Optional[List[TileKey]]:
        """A* shortest-path search between two grid coordinates.

        Returns a list of *TileKey* waypoints from (start) → (goal),
        or ``None`` when no path exists.
        """
        start = TileKey(start_col, start_row)
        goal = TileKey(goal_col, goal_row)

        if not self._is_walkable(start.col, start.row, staff_only):
            return None
        if not self._is_walkable(goal.col, goal.row, staff_only):
            return None

        def heuristic(tk: TileKey) -> float:
            return abs(tk.col - goal.col) + abs(tk.row - goal.row)

        open_set: List[Tuple[float, int, TileKey]] = [(0.0, 0, start)]  # (f_score, counter, tile)
        came_from: Dict[TileKey, Optional[TileKey]] = {start: None}
        g_score: Dict[TileKey, float] = {start: 0.0}
        f_counter = 1  # tie-breaker for heapq

        while open_set:
            _, _, current = heapq.heappop(open_set)

            if current == goal:
                # Reconstruct path
                path: List[TileKey] = []
                node: Optional[TileKey] = current
                while node:
                    path.append(node)
                    node = came_from.get(node)
                return list(reversed(path))

            for neighbour in self._walkable_neighbours(current):
                neighbor_tile = self.floor[neighbour.row][neighbour.col]
                if not self._is_walkable(neighbour.col, neighbour.row, staff_only):
                    continue
                tentative_g = g_score[current] + self.floor[current.row][current.col].cost_from(neighbor_tile)
                if tentative_g < g_score.get(neighbour, float("inf")):
                    came_from[neighbour] = current
                    g_score[neighbour] = tentative_g
                    f_score = tentative_g + heuristic(neighbour)
                    heapq.heappush(open_set, (f_score, f_counter, neighbour))
                    f_counter += 1

        return None  # no path found

    def find_nearest_table(self, col: int, row: int, zone_type: ZoneType) -> Optional[TileKey]:
        """BFS from a position to the nearest table tile in *zone_type* zones."""
        visited: Set[TileKey] = set()
        queue: deque[Tuple[int, TileKey]] = deque([(0, TileKey(col, row))])
        while queue:
            dist, tk = queue.popleft()
            if tk in visited:
                continue
            visited.add(tk)
            tile = self.floor[tk.row][tk.col]
            if tile.furniture and "table" in tile.furniture.lower():
                return tk
            for n in self._walkable_neighbours(tk):
                if n not in visited:
                    queue.append((dist + 1, n))
        return None

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _check_bounds(self, col: int, row: int) -> None:
        if not (0 <= col < self.width and 0 <= row < self.height):
            raise IndexError(f"Grid bounds: ({col},{row}) out of range ({self.width}x{self.height})")

    def _is_walkable(self, col: int, row: int, staff_only: bool) -> bool:
        if not (0 <= col < self.width and 0 <= row < self.height):
            return False
        tile = self.floor[row][col]
        if tile.blocked:
            return False
        return tile.is_walkable or (staff_only and tile.tile_type in (TileType.COUNTER, TileType.KITCHEN))

    def _walkable_neighbours(self, tk: TileKey) -> List[TileKey]:
        """4-directional neighbours that exist on the grid."""
        result: List[TileKey] = []
        for dc, dr in [(1, 0), (-1, 0), (0, 1), (0, -1)]:
            n = TileKey(tk.col + dc, tk.row + dr)
            if 0 <= n.col < self.width and 0 <= n.row < self.height:
                result.append(n)
        return result

    # ------------------------------------------------------------------
    # Rendering hints (pure data — no Pygame draw calls here)
    # ------------------------------------------------------------------

    def get_tile_color(self, col: int, row: int):
        """Return an RGB colour tuple suitable for pygame.draw.rect."""
        self._check_bounds(col, row)
        tile = self.floor[row][col]
        color_map = {
            TileType.FLOOR: (245, 240, 230),          # cream
            TileType.COUNTER: (139, 90, 43),           # wood
            TileType.KITCHEN: (180, 180, 190),         # stainless
            TileType.TABLE_FLOOR: (255, 255, 255),     # white
            TileType.WALKWAY: (235, 230, 220),         # light grey
        }
        return color_map.get(tile.tile_type, (255, 0, 255))

    def render_description(self) -> str:
        """ASCII description of the current grid state."""
        lines = []
        for r in range(self.height):
            row_str = ""
            for c in range(self.width):
                tile = self.floor[r][c]
                ch = {
                    TileType.FLOOR: ".",
                    TileType.COUNTER: "#",
                    TileType.KITCHEN: "=",
                    TileType.TABLE_FLOOR: "o",
                    TileType.WALKWAY: "-",
                }.get(tile.tile_type, "?")
                overlay_ch = self.overlay[r][c] if self.overlay[r][c] else ""
                row_str += f"{ch}{overlay_ch}"
            lines.append(row_str)
        return "\n".join(lines)

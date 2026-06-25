"""
main.py - Demo entry point for the cafe management simulation engine.

Shows customers arriving, staff moving (via A*), and economy tracking
over one simulated day from 6 AM to 9 PM (30 ticks of 30 min each).

Run:  python main.py
No Pygame dependency required — this is a CLI demo.
A ``run_with_pygame()`` stub is included for extension.
"""

from __future__ import annotations

import random
import sys
import codecs

# Force UTF-8 stdout encoding for emoji support on Windows
if sys.stdout.encoding and sys.stdout.encoding.lower() != 'utf-8':
    sys.stdout = codecs.getwriter('utf-8')(sys.stdout.buffer)

# Ensure src/ is on sys.path so relative imports from engine.* work
# when running:  python main.py   from inside cafe-sim/
from pathlib import Path
PROJECT_ROOT = Path(__file__).resolve().parent
SRC_DIR = PROJECT_ROOT / "src"
if str(SRC_DIR) not in sys.path:
    sys.path.insert(0, str(SRC_DIR))

from engine.grid import (
    CafeGrid, TileType, ZoneType, StaffEntity, CustomerEntity, TileKey,
)
from engine.simulation import CafeSimulation, Weather, TimeOfDay
from engine.economy import (
    EconomyTracker, IncomeCategory, ExpenseCategory,
)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _sep(title: str = "") -> None:
    """Print a visual separator."""
    width = 62
    print("=" * width)
    if title:
        print(f"  {title}")
        print("-" * width)


def _status_emoji(sim: CafeSimulation, tick: int) -> str:
    tod = sim._get_time_of_day()
    if tick <= 1:
        return "🌅"
    elif tick <= 3:
        return "☀️"
    else:
        return "🌆"


# ---------------------------------------------------------------------------
# Build a sample cafe floor plan
# ---------------------------------------------------------------------------

def build_sample_grid() -> CafeGrid:
    """Create a small demo floor plan.

    Layout (20 cols × 14 rows):

      KITCHEN  | COUNTER     | ENTRANCE
      ---------|-------------|----------
      DINING   |             | LOUNGE
    """
    grid = CafeGrid(width=20, height=14, tile_size=32)

    # ── Kitchen (top-left 6×4) ──
    for r in range(0, 4):
        for c in range(0, 6):
            grid.set_tile(c, r, TileType.KITCHEN, ZoneType.KITCHEN)
    # Coffee machines overlay
    grid.set_overlay(1, 1, "☕")
    grid.set_overlay(2, 2, "🫖")

    # ── Counter (top-middle, row 3, cols 6-11) ──
    for c in range(6, 12):
        grid.set_tile(c, 3, TileType.COUNTER, ZoneType.COUNTER_AREA)
    # Register overlay
    grid.set_overlay(8, 3, "💰")
    grid.set_overlay(9, 3, "💳")

    # ── Entrance (top-right corner) ──
    for r in range(0, 4):
        for c in range(16, 20):
            grid.set_tile(c, r, TileType.WALKWAY, ZoneType.ENTRANCE)
    grid.set_overlay(17, 1, "🚪")

    # ── Floor / Walkway area below counter (rows 4-8) ──
    for r in range(4, 9):
        for c in range(0, 20):
            if r == 5 or r == 7:
                grid.set_tile(c, r, TileType.WALKWAY, ZoneType.DINING_AREA)
            else:
                grid.set_tile(c, r, TileType.FLOOR, ZoneType.DINING_AREA)

    # ── Tables in dining area (rows 5-8, scattered) ──
    table_positions = [
        (3, 5), (7, 5), (11, 5), (15, 5),
        (3, 6), (7, 6), (11, 6), (15, 6),
        (4, 8), (8, 8), (12, 8), (16, 8),
    ]
    for c, r in table_positions:
        grid.set_overlay(c, r, "🍽️")

    # ── Lounge (bottom-right 6×5) ──
    for r in range(9, 14):
        for c in range(14, 20):
            grid.set_tile(c, r, TileType.FLOOR, ZoneType.LOUNGE)
    grid.set_overlay(15, 10, "🛋️")
    grid.set_overlay(17, 11, "🎵")

    # ── Restroom (bottom-left corner) ──
    for r in range(9, 14):
        for c in range(0, 2):
            grid.set_tile(c, r, TileType.FLOOR, ZoneType.RESTROOM)
    grid.set_overlay(1, 10, "🚻")

    # ── Decorations ──
    grid.set_overlay(9, 4, "🌿")       # plant on walkway
    grid.set_overlay(5, 8, "🪴")       # potted plant
    grid.set_overlay(13, 6, "🖼️")      # artwork
    grid.set_overlay(10, 9, "🕯️")      # candle

    return grid


# ---------------------------------------------------------------------------
# Main demo
# ---------------------------------------------------------------------------

def run_demo() -> None:
    """Run one full simulated day (6 AM → 9 PM) with staff movement & economy."""

    random.seed(42)   # reproducible demo

    print("\n" + "=" * 62)
    print("       ☕ CAFE MANAGEMENT SIMULATION — DEMO")
    print("=" * 62 + "\n")

    # ── Build grid ──
    grid = build_sample_grid()
    print("📐 Cafe floor plan:")
    print(grid.render_description())
    print()

    # ── Detect zones ──
    for zt in ZoneType:
        zones = grid.detect_zones(zt)
        if zones:
            labels = {ZoneType.DINING_AREA: "Dining", ZoneType.COUNTER_AREA: "Counter",
                      ZoneType.KITCHEN: "Kitchen", ZoneType.RESTROOM: "Restroom",
                      ZoneType.ENTRANCE: "Entrance", ZoneType.LOUNGE: "Lounge"}
            for z in zones:
                print(f"  📍 {labels.get(z.zone_type, str(z.zone_type))}: {z.tile_count} tiles | center={z.center}")

    print()

    # ── Staff (start positions) ──
    staff = [
        StaffEntity(name="Alice", col=2, row=1, role="barista"),
        StaffEntity(name="Bob", col=9, row=3, role="cashier"),
        StaffEntity(name="Charlie", col=5, row=6, role="cleaner"),
    ]

    # ── Simulation ──
    sim = CafeSimulation(width=grid.width, height=grid.height)
    sim.start_game()

    # Economy tracker
    economy = EconomyTracker()

    # Record daily fixed costs
    economy.record_event(0, ExpenseCategory.RENT, 150.00, "Daily rent")
    economy.record_event(0, ExpenseCategory.WAGES, 270.00, "Staff wages (3×$90)")
    economy.record_event(0, ExpenseCategory.UTILITIES, 45.00, "Electric & water")

    weather_labels = {Weather.SUNNY: "☀️ Sunny", Weather.CLOUDY: "⛅ Cloudy",
                      Weather.RAINY: "🌧️ Rainy", Weather.STORMY: "⛈️ Stormy"}

    _sep("DAY START")
    print(f"  🌤️  Weather: {weather_labels[sim.weather]}")
    print(f"  ⭐ Reputation: {sim.reputation.score:.1f} (avg rating: {sim.reputation.average_rating:.1f}/5)\n")

    total_customers_today = 0
    revenue_today = 0.0
    expenses_today = 0.0

    # ── Simulation loop ──
    tick = 0
    while not sim.day_over and tick <= sim.TICKS_PER_DAY:
        tick += 1
        sim.current_tick = tick
        events = sim.process_tick()
        tod_label = {TimeOfDay.MORNING: "🌅 Morning", TimeOfDay.AFTERNOON: "☀️ Afternoon",
                     TimeOfDay.EVENING: "🌆 Evening", TimeOfDay.NIGHT: "🌙 Night"}
        tod = sim._get_time_of_day()

        # ── Simulate staff movement (A* to nearest table) ──
        for s in staff:
            if not s.is_busy:
                table = grid.find_nearest_table(s.col, s.row, ZoneType.DINING_AREA)
                if table:
                    path = grid.astar(s.col, s.row, table.col, table.row, staff_only=True)
                    if path and len(path) > 1:
                        next_step = path[1]
                        s.col, s.row = next_step.col, next_step.row
                        s.is_busy = True
                        s.current_task = f"Going to table at ({next_step.col},{next_step.row})"

        # ── Simulate customer service & revenue ──
        for cp in sim.all_customers_served:
            if hasattr(cp, '_served'):
                continue  # already served this tick
            if random.random() < 0.45:   # ~45% of arrivals get served each tick
                cp._served = True
                spend = round(random.uniform(8.0, 35.0), 2)
                cat = IncomeCategory.FOOD if random.random() < 0.3 else IncomeCategory.DRINK
                desc = f"Customer {cp.customer_id} bought {'food' if cat == IncomeCategory.FOOD else 'drink'}"
                economy.record_event(tick, cat, spend, desc)
                revenue_today += spend

                # Random review (10% chance per served customer)
                if random.random() < 0.10:
                    rating = round(random.uniform(3.0, 5.0), 1)
                    sim.reputation.update_review(rating)
                    print(f"    ⭐ Customer {cp.customer_id} leaves review: {rating}/5")

        # ── Print tick log ──
        if events:
            for line in events:
                emoji = _status_emoji(sim, tick)
                print(f"  {emoji} {line}")
            print()

    sim.day_over = True

    # ── End-of-day report ──
    _sep("END OF DAY REPORT")

    summary = sim.end_day()
    econ_summary = economy.daily_summary()

    print(f"\n  👥 Customers served today:     {summary['total_customers']}")
    print(f"  💵 Total revenue:              ${econ_summary['total_income']:>8.2f}")
    print(f"       by category:")
    for cat, amt in econ_summary['income_by_category'].items():
        print(f"           {cat:14s}:  ${amt:>7.2f}")
    print(f"  💸 Total expenses:             ${econ_summary['total_expenses']:>8.2f}")
    print(f"       by category:")
    for cat, amt in econ_summary['expenses_by_category'].items():
        print(f"           {cat:14s}:  ${amt:>7.2f}")
    print(f"  📊 Net profit:                 ${econ_summary['net_profit']:>8.2f}")
    print(f"  📈 Profit margin:              {econ_summary['profit_margin_pct']:>6.1f}%")

    cpc = economy.cost_per_customer_acquisition(max(summary['total_customers'], 1))
    acv = economy.average_customer_value()
    print(f"  💡 Cost per customer (fixed):   ${cpc:.2f}")
    print(f"  💡 Average spend per served:    ${acv:.2f}")

    print(f"\n  🌟 Reputation:                 {summary['reputation_score']}/100")
    print(f"  ⭐ Avg rating:                 {summary['average_rating']}/5")
    print(f"  📝 Reviews collected:          {summary['reviews_received']}")

    # ── Staff final positions ──
    _sep("STAFF STATUS")
    for s in staff:
        print(f"  👤 {s.name:<10s} → ({s.col},{s.row}) | role={s.role} | task={s.current_task or 'idle'}")

    # ── Economy trend ──
    _sep("REVENUE TREND (last 3 events)")
    trend = economy.revenue_trend(window=3)
    if trend:
        for t_tick, running in trend[-5:]:
            bar_len = min(int(running / 5), 30)
            print(f"  tick {t_tick:>2}: {'█' * bar_len} ${running:.0f}")

    _sep()
    print("✅ Demo complete! Run with --pygame to see visual rendering.\n")


# ---------------------------------------------------------------------------
# Pygame stub (visual extension point)
# ---------------------------------------------------------------------------

def run_with_pygame() -> None:
    """Launch the simulation with a Pygame visual window.

    Requires:  pip install pygame
    Uncomment and call this function to see real-time rendering.
    """
    try:
        import pygame  # type: ignore
    except ImportError:
        print("pygame is not installed. Run: pip install pygame")
        return

    WIDTH, HEIGHT = 800, 600
    TILE_SIZE = 32

    pygame.init()
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Cafe Management Sim ☕")
    clock = pygame.time.Clock()
    running = True

    grid = build_sample_grid()
    sim = CafeSimulation(width=grid.width, height=grid.height)
    sim.start_game()

    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            elif event.type == pygame.KEYDOWN:
                if event.key == pygame.K_SPACE:
                    events = sim.process_tick()
                elif event.key == pygame.K_ESCAPE:
                    running = False

        # Draw grid
        for r in range(grid.height):
            for c in range(grid.width):
                color = grid.get_tile_color(c, r)
                rect = pygame.Rect(c * TILE_SIZE, r * TILE_SIZE, TILE_SIZE, TILE_SIZE)
                pygame.draw.rect(screen, color, rect)
                pygame.draw.rect(screen, (180, 180, 180), rect, 1)

        # Draw overlays as text
        font = pygame.font.SysFont(None, 24)
        for r in range(grid.height):
            for c in range(grid.width):
                overlay = grid.overlay[r][c]
                if overlay:
                    txt = font.render(overlay, True, (0, 0, 0))
                    screen.blit(txt, (c * TILE_SIZE + 4, r * TILE_SIZE + 4))

        # Draw staff markers
        for s in [StaffEntity("Alice", 2, 1, "barista"), StaffEntity("Bob", 9, 3, "cashier")]:
            cx, cy = s.col * TILE_SIZE + TILE_SIZE // 2, s.row * TILE_SIZE + TILE_SIZE // 2
            pygame.draw.circle(screen, (0, 150, 255), (cx, cy), 8)

        # Tick counter HUD
        hud_font = pygame.font.SysFont(None, 36)
        tick_text = hud_font.render(f"Tick: {sim.current_tick} / {sim.TICKS_PER_DAY}", True, (255, 255, 0))
        screen.blit(tick_text, (10, HEIGHT - 40))

        press_text = hud_font.render("SPACE = next tick | ESC = exit", True, (200, 200, 200))
        screen.blit(press_text, (10, HEIGHT - 10))

        pygame.display.flip()
        clock.tick(2)

    pygame.quit()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    if "--pygame" in sys.argv:
        run_with_pygame()
    else:
        run_demo()

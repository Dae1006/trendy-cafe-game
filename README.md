# Cafe Management Simulation Engine ☕

A trendy cafe management simulation game engine built with Python + Pygame.

## Quick Start

```bash
cd src/engine/
python main.py          # CLI demo (no dependencies)
python main.py --pygame  # Visual mode (requires: pip install pygame)
```

## Project Structure

```
cafe-sim/
├── main.py              # Demo entry point (CLI + Pygame)
└── src/
    └── engine/
        ├── __init__.py   # Package metadata
        ├── grid.py       # Grid-based map system (A*, zones, tiles)
        ├── simulation.py # Tick-based game loop & customer lifecycle
        └── economy.py    # Income/expense tracking & profit metrics
```

## Engine Modules

### `grid.py` — Map System
- **Tile data class**: Floor types (counter, kitchen, dining, walkway), furniture overlays
- **Zone detection**: BFS flood-fill to find contiguous zones (dining, lounge, restroom…)
- **A\* pathfinding**: Weighted movement costs for staff between any two grid cells
- **find_nearest_table()**: Closest-table search from any position

### `simulation.py` — Game Loop
- **Tick = 30 min** of simulated time (30 ticks = one full day, 6 AM → 9 PM)
- **Customer spawning**: Probability-based algorithm using reputation, time-of-day, and weather multipliers
- **Reputation system**: Review accumulation shifts score and affects future arrival rates
- **Day/night cycle**: Morning rush → afternoon lull → evening peak transitions

### `economy.py` — Financial Tracking
- Per-tick income & expense recording by category
- Daily P&L summary (total, margins, per-category breakdown)
- Cost-per-customer-acquisition analysis
- Revenue trend windowing over last N events

## Game Entities

| Class            | Purpose                                  |
|------------------|------------------------------------------|
| `Tile`           | Floor cell with type, zone, furniture    |
| `Zone`           | Contiguous group of same-type tiles      |
| `StaffEntity`    | Worker (barista/cashier/cleaner)         |
| `CustomerEntity` | Visitor lifecycle (enter→leave)          |
| `Reputation`     | Score + review accumulation              |
| `EconomyEvent`   | Single financial transaction             |

## Architecture Notes

- **Decoupled rendering**: Grid stores data only; Pygame is a separate visual layer
- **Seedable RNG**: `random.seed(42)` in main.py for reproducible demos
- **Extensible**: Add new tile types, zones, staff roles, or customer behaviors by extending existing data classes

# ☕ Trendy Cafe — Management Simulation Engine

Quan Trendy Cafe — a Python + Pygame simulation of managing a trendy cafe with staff, decorations, customers, and reputation.

## Quick Start

```bash
cd src/engine/
python main.py          # CLI demo (no dependencies)
python main.py --pygame  # Visual mode (requires: pip install pygame)
```

Run the full-day simulation demo:

```bash
cd ..
python demo_new.py      # 12-hour simulated day with all systems
python demo_customer.py # Customer behavior showcase
```

## Project Structure

```
cafe-sim/
├── src/engine/                # Core engine
│   ├── __init__.py
│   ├── grid.py               # Tile map, zones, A* pathfinding
│   ├── simulation.py         # Tick-based game loop, customer lifecycle
│   └── economy.py            # Income/expense tracking & profit metrics
├── customers.py              # 7 customer types + behaviors + menu (75+ items)
├── orders.py                 # Order system: recipes, prep steps, kitchen processing
├── queue.py                  # Queue management (max 8), seat assignment, overflow
├── staff.py                  # Staff AI: Barista, Cook, Server, Cashier + skills
├── decorations.py            # 50+ decor items + theme bonus detection
├── reputation.py             # Reputation scoring & daily updates
├── create_demo.py            # Demo script generator
├── demo.py                   # Full simulation with staff/decor/reputation
├── demo_new.py               # Enhanced customer behavior demo
├── demo_customer.py          # Customer type showcase
└── main.py                   # Entry point (CLI + Pygame)
```

## Core Systems

### Engine (`src/engine/`)
| Module | Purpose |
|--------|---------|
| `grid.py` | Tile-based map, zones, A* pathfinding for staff movement |
| `simulation.py` | Tick loop (1 tick = 30 min), customer spawn algorithm, day/night cycle |
| `economy.py` | Per-tick income/expense by category, daily P&L summary |

### Entities (`cafe-sim/`)
| Module | Purpose |
|--------|---------|
| `customers.py` | 7 types (Coffee Lover, Nomad, Couple, Family, Tourist, Business, Artist) with behaviors, 75+ menu items |
| `orders.py` | 36 recipes with multi-step prep, concurrent kitchen processing, staff dispatch |
| `queue.py` | Max 8-person queue, priority seating, overflow handling |
| `staff.py` | 4 staff types with skills (Double Shot, Turbo Mode, Sweet Talk), stamina & happiness |
| `decorations.py` | 50+ decor items, theme detection (Coffee Corner, Garden Nook, etc.) |
| `reputation.py` | Rating 0-100 from service/food/atmosphere, daily updates → spawn rate multiplier |

## Game Architecture

```
Customer enters → Queue (max 8) → Seat assignment → Order placed
    → Kitchen prep (multi-step recipes) → Served by staff
    → Enjoy & possibly reorder → Leave → Revenue recorded
    → Reputation updated → affects next day's customers
```

**Tick rate:** ~1 tick/second real-time = 30 simulated minutes
**Day cycle:** 6 AM to 9 PM (30 ticks) across all scales

## Key Mechanics

- **4 cafe scales:** Kiosk → Medium → Large → Flagship (decoration slots, seating, staff capacity)
- **5 theme bonuses:** Coffee Corner, Garden Nook, Reading Room, Chill Zone, Instagram Corner
- **Staff stamina & happiness:** Affects service quality and tips
- **Time-of-day patterns:** Morning rush (7-9 AM), lunch peak (12-2 PM), evening social (5-9 PM)
- **Weather effects:** Rain increases indoor customers by 20%

## Development Roadmap

| Phase | Status | Duration |
|-------|--------|----------|
| Core engine | ✅ Done | Week 1-2 |
| Customer & order system | ✅ Done | Week 3-4 |
| Staff AI + decoration | ✅ Done | Week 5-6 |
| Pixel art assets | 🔄 In progress | Week 7-8 |

## Tech Stack

- **Language:** Python 3.10+
- **Engine:** Pygame (optional, for visual mode)
- **Pathfinding:** A* algorithm on grid tiles
- **RNG:** Seeded for reproducible simulations

## License

Private — all rights reserved.

---

*Built for T D — Game Cafe Management Simulation Project*

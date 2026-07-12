# ☕ Cafe Trendy — Management Simulator (Web Game)

A fully playable browser-based cafe management game with pixel art rendering.

## Play Online

The game is ready on **GitHub Pages** at:

👉 **https://dae1006.github.io/trendy-cafe-game/**

If it's not live yet, enable it:

1. Go to https://github.com/Dae1006/trendy-cafe-game/settings/pages
2. Under "Source" select **"Deploy from a branch"**
3. Choose **main** branch → **root** folder
4. Save — your game will be live in ~1-2 minutes!

## Play Locally

Download `index.html` from this repo and open it directly in any browser (Chrome, Firefox, Edge, Safari). No server needed — zero dependencies!

## Game Features

### Core Gameplay
- **Canvas Pixel Art** — All characters & decorations drawn via Canvas API (no external images)
- **7 Customer Types** — Coffee Lover, Digital Nomad, Couple, Family, Tourist, Business Person, Artist — each with unique spending, patience, and order patterns
- **20 Menu Items** across 6 categories (Coffee, Special, Tea, Beverage, Dessert, Food)
- **4 Staff Types** — Hire Barista, Cook, Server, Cashier; manage stamina & mood
- **18 Decoration Items** — Place decor to boost atmosphere and unlock theme bonuses
- **Time-of-Day Patterns** — Morning rush (7-9 AM), lunch peak (11 AM-1 PM), evening social (5-8 PM)
- **Dynamic Weather** — Rain increases indoor customer rate by 30%
- **Day/Night Cycle** — Ambient lighting shifts, day ends at 9 PM

### Economy & Progression
- Real-time revenue, expense, tips tracking
- Reputation system (0-100) affecting customer spawn rates
- Win: Reach $10,000 + Rep ≥ 80
- Lose: Go below -$500
- Auto-save to localStorage every 60 seconds

## Controls

| Action | How |
|--------|-----|
| Hire Staff | Shop tab → click HIRE button |
| Serve Customers | Click any menu item (Menu tab) — customer must be seated |
| Buy Decorations | Shop tab → BUY decor items |
| Pause/Resume | ⏸ / ▶ button on canvas |
| Toggle Panel | Menu button in top bar |

## Tech Stack

- **Pure HTML + CSS + JavaScript** — zero dependencies, runs anywhere
- **Canvas API** — programmatic pixel art rendering via putImageData
- **localStorage** — save/load game state
- **Responsive** — works on desktop and tablets

## Project Structure

```
cafe-sim/
├── index.html          # Complete playable game (single file, 24KB)
├── src/engine/         # Python simulation engine (reference backend)
│   ├── grid.py         # Tile map + A* pathfinding
│   ├── simulation.py   # Tick-based game loop
│   └── economy.py      # Financial tracking
├── customers.py        # 7 customer types + menu data
├── orders.py           # Recipe system
├── queue.py            # Queue management
├── staff.py            # Staff AI with skills
├── decorations.py      # 18 decoration items
├── reputation.py       # Rating algorithm
└── assets/             # Pixel art specs + palette
```

---

*Built for T D — Game Cafe Management Simulation Project | June 2026*

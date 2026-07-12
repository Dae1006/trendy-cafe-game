# ☕ Cafe Trendy — Management Simulator (Web Game)

A fully playable browser-based cafe management game with pixel art rendering.

## How to Play Online

### Option 1: Open the HTML file directly
Download `index.html` from this repo and open it in any modern browser (Chrome, Firefox, Edge, Safari). No server needed!

### Option 2: Use GitHub Pages
This repo is ready for GitHub Pages deployment. To enable:

1. Go to **Settings → Pages** on the GitHub repo
2. Under "Source", select **main branch / root folder**
3. Your game will be live at: `https://dae1006.github.io/trendy-cafe-game/`

### Option 3: Use GitHub Codespaces or VS Code Live Server
Open this repo in VS Code and use the Live Server extension to preview locally.

## Game Features

- **Canvas Pixel Art Rendering** — Characters, decorations, environment all drawn via Canvas API (no external assets needed)
- **7 Customer Types** — Coffee Lover, Digital Nomad, Couple, Family, Tourist, Business Person, Artist — each with unique behavior patterns
- **20 Menu Items** across 6 categories (Coffee, Special, Tea, Beverage, Dessert, Food)
- **4 Staff Types** — Barista, Cook, Server, Cashier with stamina & mood systems
- **18 Decoration Items** — Place decor to boost atmosphere and unlock theme bonuses
- **Time-of-Day Patterns** — Morning rush (7-9 AM), lunch peak (11 AM-1 PM), evening social (5-8 PM)
- **Dynamic Weather** — Rain increases indoor customer rate by 30%
- **Day/Night Cycle** — Ambient lighting changes, day ends at 9 PM
- **Economy Dashboard** — Real-time revenue, expenses, tips, profit tracking
- **Reputation System** — Customer satisfaction affects future spawn rates (0-100 scale)
- **Win/Lose Conditions** — Reach $10,000 + Reputation 80 to win; go below -$500 to lose
- **Auto-Save** — Game state saves to localStorage every 60 seconds

## Controls

| Action | How |
|--------|-----|
| Hire Staff | Go to Shop tab → click HIRE button |
| Serve Customers | Click menu item from Cafe tab (customer is seated) |
| Buy Decorations | Go to Shop tab → BUY decor items |
| Pause Game | Click ⏸ button on the canvas |
| Toggle Panel | Click ☰ button in top bar |

## Tech Stack

- **Pure HTML + CSS + JavaScript** — zero dependencies
- **Canvas API** — all pixel art rendered programmatically via putImageData
- **localStorage** — save/load game state
- **Responsive design** — works on desktop and tablets

## Project Structure

```
cafe-sim/
├── index.html          # Complete playable game (single file)
├── src/engine/         # Python engine reference (simulation backend)
│   ├── grid.py
│   ├── simulation.py
│   └── economy.py
├── customers.py        # 7 customer types + menu (20 items)
├── orders.py           # Recipe execution system
├── queue.py            # Queue management
├── staff.py            # Staff AI system
├── decorations.py      # 18 decoration items
├── reputation.py       # Rating algorithm
└── assets/             # Pixel art specs & placeholder sprites
```

## Screenshots

The game features:
- Canvas-based pixel art with animated characters walking, ordering, eating
- Day/night ambient lighting that shifts throughout the simulated day
- Weather effects (rain animation)
- Interactive UI panels for Menu, Staff management, Decoration Shop, and Economy Dashboard
- Patience meters above customers' heads (green → yellow → red)
- Star rating system reflecting cafe reputation

---

*Built for T D — Game Cafe Management Simulation Project*
*June 2026*

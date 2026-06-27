# Trendy Cafe v2.0 — DESIGN.md

> **Last updated:** 2026-06-19
> **Project:** C:\Users\taidu\.openclaw\workspace\cafe-game\game.js (~62KB)
> **Status:** Core game logic complete, needs UI polish & features

---

## 🎮 Game Overview

Idle/incremental cafe management game. Player starts with a street stall and expands to malls, gardens, parks.

**Core Loop:**
1. Customers place orders → Staff serve them
2. Earn coins → Hire staff, upgrade menu, expand venue
3. Level up → Unlock new menu items, venue types
4. Survive bankruptcy → Manage costs vs revenue

---

## 📐 Architecture

### Single-file game (game.js)
- **CONFIG** — All tuning parameters (difficulty, XP, costs, intervals)
- **VENUE_TYPES** — 4 venue tiers (street → mall → garden → park)
- **MENU** — 13 menu items with price/cost/rarity
- **STAFF** — 3 staff types (intern, barista, manager) with skill & buffs
- **Game State** — coins, day, orders, staff, venue, level, reputation
- **Game Loop** — tick-based simulation
- **UI Rendering** — DOM manipulation

### Key Systems
| System | Description |
|--------|-------------|
| Difficulty Scaling | 4 phases (EASY/NORMAL/HARD/EXTREME) with dynamic multipliers |
| Venue Expansion | Unlock new venue types at higher levels |
| Menu Progression | Items unlock by rarity/level |
| Staff Management | Hire/fire, salary intervals, skill buffs |
| Bankruptcy | Warning at -15s, bankruptcy at -45s |
| Reputation | 0-300 scale, affects customer flow |
| XP/Leveling | 50 levels, exponential scaling |

---

## ✅ Completed

- [x] Full game.js core (~62KB, ~1400+ lines)
- [x] CONFIG with difficulty scaling
- [x] 4 venue types
- [x] 13 menu items
- [x] 3 staff types
- [x] Game loop simulation
- [x] Bankruptcy system
- [x] XP/level progression
- [x] Reputation system
- [x] Difficulty phases with dynamic multipliers

---

## ⏳ TODO / Next Steps

### Priority 1 — UI Polish
- [ ] HTML/CSS layout (index.html, styles.css)
- [ ] Responsive design
- [ ] Animations (order pop, coin earn, staff hire)
- [ ] Visual feedback for events

### Priority 2 — Core Features
- [ ] Save/Load game (localStorage)
- [ ] Tutorial / onboarding
- [ ] Achievement system
- [ ] Daily bonus / streak

### Priority 3 — Expansion
- [ ] More menu items (unlockable)
- [ ] Events (random customer, promotion)
- [ ] Mini-games (speed serve, combo)
- [ ] Multi-venue (manage multiple cafes)

### Priority 4 — Polish
- [ ] Sound effects (TTS or Web Audio)
- [ ] Particle effects
- [ ] Pixel art sprites
- [ ] Mobile touch controls

---

## 🔧 Config Tuning Notes

Difficulty phases control gameplay balance:
- **EASY** (day 1-15): profitMult 0.9 — gentle learning curve
- **NORMAL** (day 16-40): profitMult 0.7 — costs increase
- **HARD** (day 41-75): profitMult 0.5 — tight margins
- **EXTREME** (day 76+): profitMult 0.3 — survival mode

Key tunables:
- `profitMultiplier` — base revenue % (default 0.8)
- `ingredientInflation` — cost scaling (default 1.2)
- `staffSalaryInterval` — salary frequency in game seconds
- `fixedChargesInterval` — rent/utilities frequency
- `bankruptcyTime` — grace period before game over

---

## 📁 Project Structure

```
cafe-game/
├── game.js      # Main game logic (~62KB)
├── index.html   # HTML structure (if exists)
├── styles.css   # Styling (if exists)
├── DESIGN.md    # This file
└── README.md    # Setup instructions (if exists)
```

---

## 💡 Design Principles

1. **Idle-friendly** — Should work while player is away
2. **Progressive difficulty** — Early game fun, late game challenging
3. **Clear feedback** — Every action has visible result
4. **One more day** — Hook loop should be irresistible
5. **Mobile-first** — Playable on phone

---

## 🧠 Session Notes

- Each session should read this DESIGN.md before working on game.js
- Update this file after major changes
- If game.js structure changes, update architecture notes here

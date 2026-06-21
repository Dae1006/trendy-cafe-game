# 📊 TRENDY CAFÉ V7 - Change Diff Summary

## File: `index.html` (V6 Enhanced → V7 Ultimate)

---

### 1️⃣ SYSTEM STAFF NÂNG CẤP

**Thay đổi STAFF array:**
- Giữ 6 staff cũ (Intern → Manager)
- Thêm 2 staff mới:
  - `Legend Chef` (🏆) - cost: 3,000₫ - salary: 120/s - buff: +5 rep/ngày
  - `Epic Coach` (🌟) - cost: 5,000₫ - salary: 180/s - buff: Co-op serve -50% time

**Thêm buff fields vào STAFF:**
- `buff` và `buffVal` cho mỗi tier có buff
- `buffDesc` hiển thị thông tin buff trong UI

**Auto buff system:**
- Manager: `all_speed +10%` → tất cả staff tăng speed
- Senior: `tips +5%` → tăng tip nhận được
- Master: `highroll +15%` → +15% profit orders >50₫
- Legend Chef: `reputation +5` → passive rep gain mỗi ngày
- Epic Coach: `coop -50%` → co-op serve giảm thời gian

**Staff events tracking:**
- Thêm `G.staffEvents[]` log tất cả hire/fire events
- Staff event notification hiển thị buff khi hire

**UI render staff cập nhật:**
- Hiển thị ACTIVE BUFFS panel với tất cả buff đang active
- Hiển thị buff tag cho mỗi staff card
- Hiển thị reputation passive từ Legend Chef

---

### 2️⃣ TĂNG ĐỘ KHÓ + DIFFICULTY SCALING

**Thêm CONFIG.difficultyPhases:**
| Phase | Start Day | Profit Mult | Inflation | Salary Mult | Order Mult |
|-------|-----------|-------------|-----------|-------------|------------|
| EASY | 1 | 0.90 | 1.2 | 1.0x | 1.0x |
| NORMAL | 16 | 0.70 | 1.4 | 1.1x | 0.9x |
| HARD | 41 | 0.50 | 1.7 | 1.25x | 0.8x |
| EXTREME | 76 | 0.30 | 2.0 | 1.5x | 0.7x |

**Warning system:**
- Tự động show notification khi chuyển phase
- Format: `⚠️ [Phase name] - [Warning message]`

**Difficulty ảnh hưởng:**
- `serveOrder()`: profitMult và inflation theo phase
- `autoGenerateOrder()`: order interval theo phase.orderMult
- `processFinancialCycles()`: salary theo phase.staffSalaryMult
- `processFinancialCycles()`: hiển thị warning khi chuyển phase

**Game day tracking:**
- 1 game day = 60 giây real time
- Mỗi ngày: staff mood decay -1, rep buff trigger
- Notification mỗi ngày mới: `📅 Ngày N! (Difficulty phase: X+)`

---

### 3️⃣ TREND ITEMS + LEVEL MỚI + EQUIPMENT MỚI

**A. Trend items (8 → 20 items):**

| Rarity | New Items | Cost Range |
|--------|-----------|-----------|
| Common (3) | Doge, Cat, Plant | 150-300₫ |
| Rare (6) | +Neon Sign, Book Corner, Pet Zone | 1,000-5,000₫ |
| Epic (7) | +Rooftop Bar, Art Wall, Private Room, Gaming | 3,000-15,000₫ |
| Legend (4) | +Live Music, Aromatherapy, Rooftop Garden, Smart Order, Secret Menu | 25,000-100,000₫ |

**B. Equipment (8 → 14 items):**

| Name | Cost | Max Lv | Effect |
|------|------|--------|--------|
| Auto Espresso Bot | 2,000₫ | 3 | +10% auto-serve speed/lv |
| Cooling System | 1,500₫ | 2 | +15% mood recovery/lv |
| Premium Storage | 3,000₫ | 3 | -10% ingredient cost/lv |
| Outdoor Tent | 2,000₫ | 2 | +5 max orders/lv |
| Crystal Chandelier | 5,000₫ | 2 | +10 rep/lv, +5% revenue/lv |
| Smart POS System | 8,000₫ | 3 | +20% tip rate/lv |

**C. New level milestones:**

| Level | Reward | Cost |
|-------|--------|------|
| 70 | Neon Sign, Book Corner, Pet Zone | 100,000₫ |
| 75 | Auto Espresso + Cooling | 150,000₫ |
| 80 | Rooftop Bar, Art Wall, Private Room | 200,000₫ |
| 85 | Premium Storage | 250,000₫ |
| 90 | Live Music + Smart POS + Outdoor Tent | 300,000₫ |
| 95 | Rooftop Garden + Aromatherapy | 500,000₫ |
| 100 | Secret Menu + ALL equipment maxed + ALL trends | 1,000,000₫ |

**D. Unlock logic:**
- New equipment: cần Lv10+ mới hiển thị
- New trends (rare): cần Lv70+
- New trends (epic): cần Lv80+
- New trends (legend): cần Lv70+

---

### 4️⃣ REVENUE BONUS TỔNG HỢP

**Before (V6):** Max ~63% (30% Chef Statue + 10% Girly + 5% Doge + 18% venue)
**After (V7):** Max ~300%+ (60% Secret Menu + 50% Rooftop Garden + 45% Smart Order + 40% Aromatherapy + 35% Live Music + ... + venue)

---

### 5️⃣ STAFF MULTI-SERVE (Co-op)

**Before:** Mỗi staff serve 1 đơn rồi nghỉ
**After:** 
- Co-op buff từ Epic Coach: 2 staff cùng serve = -50% thời gian
- Manager buff: +10% speed cho TẤT CẢ staff (auto active)
- Auto serve buff từ Auto Espresso Bot: giảm interval

---

### 6️⃣ STATS PANEL MỚI

Thêm section "📈 Difficulty Phase" vào Stats:
- Game Day hiện tại
- Phase hiện tại (start day)
- Profit Mult (x0.30 - x0.90)
- Inflation (x1.2 - x2.0)
- Salary Mult (x1.0 - x1.5)
- Order Interval Mult (x0.7 - x1.0)

---

### 7️⃣ MAX REPUTATION TĂNG

From 220 → 300 (tương thích với nhiều trend items có rep bonus cao)

### 8️⃣ MAX STAFF TĂNG

From 12 → 15 (để chứa được staff mới)

---

## Tổng kết số liệu

| Metric | V6 | V7 | Change |
|--------|----|----|--------|
| Staff types | 6 | 8 | +2 |
| Staff max | 12 | 15 | +3 |
| Trend items | 8 | 20 | +12 |
| Equipment | 8 | 14 | +6 |
| Level milestones | 14 | 21 | +7 |
| Max revenue bonus | ~63% | ~300%+ | +5x |
| Max rep | 220 | 300 | +80 |
| Difficulty phases | 1 (static) | 4 (dynamic) | new |
| Game length | ~40-60 days | 100+ days | +70% |
| Max level | 100 | 100 | same |
| File size | ~51KB | ~68KB | +33% |

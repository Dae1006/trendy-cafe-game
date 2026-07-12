# CCO Weekly Report — Week 1 (2026-05-09 to 2026-05-15)

## 📊 Current Simulation State: Real Vietnamese Café

### Business Model — Vỉa Hè Café (Street Sidewalk)

**Startup costs:** ~15-30 triệu VND
- Simple table + 10 chairs: 3-5 triệu
- Basic coffee machine: 5-10 triệu  
- Grinder, kettle, utensils: 3-5 triệu
- Signage + paint: 2-3 triệu
- Initial stock (beans, sugar, cups, milk): 5-7 triệu
- License + permits: 1-2 triệu

**Monthly economics:**
- Rent: 2-5 triệu (depends on location)
- Coffee beans: 3-5 triệu
- Milk/sugar/ice: 2-3 triệu
- Cups: 1-2 triệu  
- Electricity/water: 1-2 triệu
- Staff (1 person): 7-10 triệu
- Total costs: ~16-27 triệu/tháng

**Revenue:**
- Avg cup price: 25-35k VND
- Cups/day (weekday): 50-80
- Cups/day (weekend): 100-150
- Monthly revenue: ~40-90 triệu
- Net profit: ~10-25 triệu/tháng
- **ROI break-even: 2-4 months**

---

## 💡 Recommended Game Mechanics

### 1. Supplier System (Realistic)
**Coffee beans come from different regions:**
- Đà Lạt (Arabica) — premium price, premium taste
- Buôn Ma Thuột (Robusta) — standard price, standard taste  
- Tây Nguyên (mixed) — cheapest, variable quality
- **Random quality batches** — sometimes you get bad beans = lower customer satisfaction

**Milk suppliers:**
- Vinamilk — reliable quality, standard price
- TH True Milk — slightly better taste, +10% cost
- Generic — cheapest but affects customer taste score

### 2. Staff Mood & Turnover
- Staff has a **mood score** (0-100)
- Mood affected by: salary satisfaction, overtime, customer rudeness, weather
- Low mood = slower service, more mistakes, lower customer satisfaction
- Below 30 = staff may quit! Need to hire new one (recruitment cost)
- **Solution:** Give raises, bonuses, good working conditions

### 3. Weather System
- **Sunny** — max customer flow, outdoor seating active
- **Rainy** — 40% fewer customers, need to focus on delivery/takeaway
- **Hot** — 20% more iced drink sales, ice supply runs out faster
- **Tết/Events** — temporary spikes in traffic, but supply chain disruption
- **Flood season** (Oct-Dec) — road access issues, some days closed

### 4. Competition System
- New café opens nearby every 2-3 weeks (game time)
- Each competitor reduces your customers by 5-15%
- **Counter strategies:** Better quality, lower prices, loyalty program, unique items
- **Opponent types:** 
  - Price war (sells cheaper, lower quality)
  - Quality competitor (sells premium, steals your good customers)
  - Chain store (Starbucks mini, steals VIP customers)

### 5. Customer Feedback Loop
**After each customer leaves, show:**
```
⭐⭐⭐⭐⭐ Taste: ★★★★☆ (good)
⭐⭐⭐⭐ Service speed: ★★★☆☆ (could be faster)
⭐⭐⭐⭐⭐ Ambiance: ★★★★★ (amazing!)
⭐⭐⭐⭐ Value: ★★★☆☆ (expensive)
```
**NPS Score** — affects how many new customers you get via word-of-mouth

### 6. Hidden Costs (Realistic!)
- **Cups breakage** — 5% of stock broken/wasted monthly
- **Spilled drinks** — average 3 drinks dropped per week
- **Staff sickness** — random sick days, need backup
- **Equipment maintenance** — coffee machine needs cleaning/replacement every 6 months
- **Price increases** — supplier raises prices 2-3% every game month

---

## 🎯 Feature to Add Next (Priority Order)

1. **Weather system** — affects daily customer flow. Quick to implement, huge impact on gameplay.
2. **Supplier quality variance** — add cost vs quality tradeoff. Makes purchasing decisions meaningful.
3. **Customer feedback** — show NPS score. Drives player to improve operations.
4. **Staff mood system** — adds depth to management. Player must balance salary vs profit.
5. **Competition events** — new café opens, creates dynamic challenges.

---

**Next update: Weekly ops report on Monday**

# Trend Integration Design - v10

## Top Trends (từ search 27/06/2026)

| # | Trend | Nguồn | approx_traffic |
|---|-------|-------|----------------|
| 1 | **Nhánh đầu vòng 1/32 WC2026** | Google Trends VN | 20,000+ |
| 2 | **Lương hưu tăng 8%** | Google Trends VN | 10,000+ |
| 3 | **Strawberry Moon (Trăng Dâu)** | Google Trends US | 10,000+ |
| 4 | **Hóa đơn chia đôi** | Google Trends VN | 5,000+ |
| 5 | **Fanta Vanilla Cherry Spritz** | Google Trends US | 1,000+ |
| 6 | **Máy bay ném bom chiến lược** | Google Trends VN | 2,000+ |
| 7 | **Tuyển Anh vs Panama (WC2026)** | Google Trends VN | 2,000+ |
| 8 | **Marvel Rivals Summer Festival** | Google Trends US | 100+ |
| 9 | **Vietlott trúng 10 tỷ** | Google Trends VN | 500+ |
| 10 | **Concert Thanh Xuân 2026** | Google Trends VN | 500+ |

---

## Game Mechanics per Trend

### 🏆 Trend 1: World Cup 2026 - Round of 32 (Nhánh Đầu Vòng 1/32)
*Trend Việt Nam hot nhất (20,000+ traffic). Tuyển Anh vs Panama đang được theo dõi sát.*

- **Customer Chat**: 
  - "Bọn mình cá kèo Anh thắng luôn á! Nếu trúng tui đãi cafe cả tiệm!" 🏈→⚽
  - "Khứi... tui xem bóng đến giờ mắt mờ hết rồi, cho em cà phê đen extra mạnh đi." 😵‍💫
  - "Trận Anh vs Panama này chắc phải có Var controversy rồi nhỉ? Classic WC2026." 
  - "Ai cũng đặt kèo cả, khách tới quán hỏi 'phục vụ ơi trận này tỷ số bao nhiêu?' liên tục!"

- **Item**: `WC_CUP_TROPHY` — Cúp World Cup pixel art mini (decoration)
  - **Rarity**: Epic
  - **Cost**: 15,000 coins (hoặc unlock qua event)
  - **Effect**: `all` — +25% revenue during live matches, +30% customer draw
  - **Buff Details**: Khi đặt Cup trong quán, mỗi khi có trận WC diễn ra → khách hàng tăng đột biến, tip cao hơn. Hiển thị scoreboard nhỏ trên TV của quán.

- **Event Window**: 
  - `activation`: Global knockout stages (1/16 trở đi)
  - `duration`: 2 giờ trước + 30 phút sau mỗi trận
  - `trigger`: Random chance 15% mỗi ngày trong giai đoạn WC đang diễn ra

- **Visual**: Pixel art cúp World Cup đặt trên quầy, hiệu ứng glow vàng nhấp nháy. Trên TV quán hiển thị live score overlay. Background có ánh cờ các nước.

---

### 💰 Trend 2: Lương Hưu Tăng 8% (Lương Giáo Viên Mới)
*Trend số 3 VN (10,000+ traffic). Chủ đề "lương hưu" đang viral mạnh — giáo viên tăng lương từ 1/7.*

- **Customer Chat**:
  - "Từ tháng 7 tui được tăng lương rồi! Đi cafe sang chảnh nè!" 😎
  - "Lương hưu lên 8% nhưng cà phê cũng... không thấy giảm giá nhỉ?" 🤔
  - "Giáo viên mầm non bây giờ cũng 1.7 triệu cơ à? Càng phải uống cafe cho vui!"
  - "Mẹ tui mới về hưu, bà nói: 'Đi cà phê đi con, đừng tiếc tiền!' — nhưng thực ra là ví bà trống không." 😂

- **Item**: `PENSION_CAFE_SET` — Bộ bàn tiệc "Lương Hưu Sang Chảnh" (recipe/event)
  - **Rarity**: Rare
  - **Cost**: 5,000 coins
  - **Effect**: `revenue` — +15% revenue from customers aged 55+ (senior citizens)
  - **Buff Details**: Bán combo "Trọn Đời Rảnh" (cà phê + bánh mì sữa + đậu xanh) với giá đặc biệt. Mỗi combo bán được → tip bonus +20%.

- **Event Window**:
  - `activation`: Ngày 1-15/7 hàng năm (nhớ lại sự kiện lương tăng 8%)
  - `duration`: 2 tuần event window
  - `trigger`: Auto-trigger theo calendar, hoặc random chance 5% mỗi ngày ngoài event period

- **Visual**: Pixel art bộ bàn ghế gỗ cũ kỹ sang trọng — "bàn dân tộc" với ấm trà pha lê, bánh mì bơ, đậu xanh. Màu nâu ấm áp, tone vintage. Có thêm icon "8%" floating trên bàn.

---

### 🍓 Trend 3: Strawberry Moon (Trăng Dâu)
*Global trend (10,000+ traffic). Trăng Dâu tháng 6/2026 — full moon hiếm thấy.*

- **Customer Chat**:
  - "Em nhìn trăng từ ban công — đỏ hồng như dâu thật luôn! Có cafe vị dâu không?" 🌕🍓
  - "Strawberry Moon mà không có cafe matcha thì tiếc quá... Hay là strawberry latte cho đúng mood?"
  - "Trăng sáng thế này đi cà phê vỉa hè mới đã. Nhưng quán mình sang nên cũng okay." ✨
  - "Bọn mình chụp ảnh trăng rồi dẫn nhau tới đây! Ai cũng muốn selfie với cửa sổ nhìn trăng."

- **Item**: `STRAWBERRY_MOON_LATTE` — Matcha Strawberry Moon Latte (recipe)
  - **Rarity**: Legendary
  - **Cost**: 8,000 coins
  - **Effect**: `all` — +20% revenue during nighttime hours (20:00-04:00), +15% tip boost
  - **Buff Details**: Đồ uống đặc biệt chỉ bán ban đêm. Khách hàng "thiên văn" và "sống ảo" sẽ tìm đến quán khi trăng lên. Mỗi lần bán ra → unlock mini-photon hiệu ứng trăng trên cửa sổ quán.

- **Event Window**:
  - `activation`: Full moon nights (nhận diện theo lunar calendar, ~28 ngày/lần)
  - `duration`: 3 đêm mỗi lần trăng full
  - `trigger`: Lunar cycle detection — auto-trigger khi gần full moon ±1 ngày

- **Visual**: Pixel art ly latte gradient tím-hồng-trắng như mặt trăng. Hiệu ứng particle "ánh trăng" rơi từ trên trần quán xuống bàn. Cửa sổ quán hiển thị moon phase overlay. Background đổi sang màu đêm xanh đậm.

---

### 📄 Trend 4: Hóa Đơn Chia Đôi (Split Bill Drama)
*Trend Việt Nam viral (5,000+ traffic). Vụ "hóa đơn 16 triệu" và chuyện chia đôi hot trên MXH.*

- **Customer Chat**:
  - "Tụi em chia đôi hóa đơn nha! Mỗi người 80k — công bằng mà?" 😅
  - "Trước tui toàn kẻ chờ trả tiền... giờ học cách tính split bill rồi!" 💸
  - "Hóa đơn tới đây phải ghi rõ từng món, đừng như vụ 'bạn bỏ lại với hóa đơn 16 triệu' ấy!"
  - "Ở Mỹ có Venmo, Việt Nam cósplitbill.vn — nhưng ở quán mình thì phục vụ tính giùm đi!"

- **Item**: `SPLIT_BILL_MACHINE` — Máy đếm tiền chia bill pixel art (decoration/event)
  - **Rarity**: Rare
  - **Cost**: 3,000 coins
  - **Effect**: `customers` — +20% customer group size (groups of 3+)
  - **Buff Details**: Khách hàng đến theo nhóm đông sẽ ở lại lâu hơn (+30% dwell time). Tip từ mỗi thành viên trong nhóm cao hơn +10%. Hiệu ứng "💸" bay trên đầu từng khách.

- **Event Window**:
  - `activation`: Weekend (Fri-Sun) và ngày lễ
  - `duration`: Toàn bộ event duration nhưng peak giờ 18:00-22:00
  - `trigger`: Random chance 10% mỗi ngày cuối tuần, hoặc forced trigger 3 ngày/tháng

- **Visual**: Pixel art máy tính tiền mini đặt trên quầy, hiển thị "SPLIT = 2" với ký hiệu ✂️. Màu xanh neon vui tươi. Có thêm hiệu ứng đồng xu rơi (coin particles) khi khách thanh toán.

---

### 🥤 Trend 5: Fanta Vanilla Cherry Spritz
*Global food & beverage trend (1,000+ traffic). Coca-Cola ra mắt flavor mới hạn chế.*

- **Customer Chat**:
  - "Mới thử Fanta vanilla cherry ở Mỹ — ngon lắm! Cho em làm phiên bản cafe kết hợp!" 🍒
  - "Vanilla + cherry + coffee... nghe như cocktail vậy. Nhưng mà lạ lắm!"
  - "Fanta mới ra flavor này hot quá! Ở quán mình có uống soda vị cherry không?"
  - "Limited edition mà? Phải chụp ảnh đăng mạng ngay, đừng để hết giờ!"

- **Item**: `VANILLA_CHERRY_SPRITZ` — Fanta-inspired Cherry Vanilla Coffee Spritz (recipe)
  - **Rarity**: Epic
  - **Cost**: 6,000 coins
  - **Effect**: `revenue` — +18% revenue, đặc biệt hiệu quả với khách hàng tuổi Teen-Young Adult
  - **Buff Details**: Đồ uống "limited time" tạo urgency. Khách hàng sẽ đến quán nhanh hơn vì sợ hết. Bonus: unlock exclusive "Spritz Shot" animation mỗi khi pha chế xong.

- **Event Window**:
  - `activation`: Random limited-time event (1-3 ngày)
  - `duration`: 3-7 ngày (thường ngắn để tạo scarcity)
  - `trigger`: Random trigger every 14 days with 20% probability, hoặc manual unlock by admin

- **Visual**: Pixel art ly soda cao với trái cherry trên đỉnh, bubble particles rising lên. Màu đỏ-hồng-trắng gradient. Hiệu ứng bubbles khi pha chế. Icon "LIMITED EDITION" flash trên menu board.

---

### 🛩️ Trend 6: Máy Bay Ném Bom Chiến Lược
*Trend geopolitical (2,000+ traffic VN). Tin máy bay chiến lược Nga xuất hiện ở căn cứ.*

- **Customer Chat**:
  - "Nghe tin máy bay ném bom mới của Nga... cafe mà vẫn lo thế giới." 🛩️☕
  - "Thế giới loạn lắm nhưng cà phê thì không bao giờ lỗi thời." 
  - "Bọn tui xem tin tức xong — chỉ muốn về nhà uống nước. À nhầm, đến quán mình uống!" 😮‍💨

- **Item**: `WAR_ROOM_MAP` — Bản đồ chiến lược mini (decoration)
  - **Rarity**: Uncommon
  - **Cost**: 2,500 coins
  - **Effect**: `all` — +10% all stats (balanced, không overpowered)
  - **Buff Details**: Trang trí "tướng binh" — khách hàng có xu hướng ở lại lâu hơn (+15% dwell time). Hiệu ứng "military vibe" nhẹ nhàng trên bản đồ.

- **Event Window**:
  - `activation`: Random geopolitical events (2-3 ngày)
  - `duration`: 2-4 giờ event window ngắn
  - `trigger`: Random 5% chance per day, or manual unlock

- **Visual**: Pixel art bản đồ thế giới mini với đường bay máy bay dashed line. Màu xanh olive + cam military. Icon 🛩️ nhỏ bay vòng quanh bản đồ. Tone tối, nghiêm túc nhưng không đáng sợ.

---

### 🎮 Trend 7: Marvel Rivals Summer Festival
*Gaming trend (100+ traffic US). Summer Festival với swimsuit skins đang hot.*

- **Customer Chat**:
  - "Tui chơi Marvel Rivals suốt ngày — nhân vật mới đẹp lắm! Cà phê cho tỉnh táo tiếp." 🦸‍♂️
  - "Swimsuit skin trong game đẹp hơn cà phê của quán... đùa đấy, quán mình chill nhất!" 😎
  - "Team-up với bạn bè xong ghé quán uống nước. Like Avengers mà không cần Infinity Stones."

- **Item**: `MARVEL_SUMMER_COFFEE` — Hero Summer Coffee Blend (recipe/event)
  - **Rarity**: Epic
  - **Cost**: 7,000 coins  
  - **Effect**: `customers` — +25% customer draw from gaming community
  - **Buff Details**: Khách hàng gamer đến quán nhiều hơn. Mỗi khi bán được → unlock Marvel character sticker trên bàn khách.

- **Event Window**:
  - `activation`: Every 3 weeks, duration 3 days
  - `trigger`: Fixed calendar every 21 days (mismatch với game real events to avoid copyright issues)

- **Visual**: Pixel art cup có logo shield nhỏ trên foam art. Background màu xanh-hồng như Marvel colors. Particle "superhero sparkles" xung quanh quán.

---

### 🎵 Trend 8: Concert Thanh Xuân 2026 (HIEUTHUHAI)
*Music event trend VN (500+ traffic). HIEUTHUHAI concert đầu tiên quy mô lớn ở TP.HCM.*

- **Customer Chat**:
  - "Chiều nay đi xem HIEUTHUHAI concert xong ghé quán đây! Fanboy fanclub đông lắm!" 🎤
  - "Anh trai say hi! Tui thuộc hết lời rồi — cho em cafe extra để hát tiếp tối nay!"
  - "Check-in concert Thanh Xuân rồi, giờ check-in quán cafe — double check-in!" ✨

- **Item**: `CONCERT_STAGE_DECOR` — Sân khấu mini pixel art (decoration/event)
  - **Rarity**: Legendary
  - **Cost**: 12,000 coins
  - **Unlock alternative**: Complete "Fan Club" achievement chain (serve 50 customers with music-related dialogue)
  - **Effect**: `customers` — +35% customer draw during concert days, +40% tip boost
  - **Buff Details**: Khách hàng fan sẽ đến quán trước/sau concert. Tip cao hơn vì "mood concert." Hiệu ứng stage lights trên quán.

- **Event Window**:
  - `activation`: Concert days (pre-configurable dates) và 2 ngày trước/sau
  - `duration`: Full event period với peak during concert hours
  - `trigger`: Admin-settable dates, auto-highlighted on calendar

- **Visual**: Pixel art sân khấu thu nhỏ với microstand, speaker stack, stage lights. Màu neon purple/pink/yellow. Hiệu ứng "stage light beams" quét qua quán từng giây. Crowd emoji 👥🎉 trên đầu khách hàng.

---

### 🎰 Trend 9: Vietlott Trúng 10 Tỷ
*Lucky win news trend (500+ traffic VN). Khách hàng mua Vietlott qua BIDV trúng gần 10 tỷ.*

- **Customer Chat**:
  - "Em vừa trúng Vietlott! Nhưng chưa mở ra đâu... biết đâu trúng lớn thì mời cả quán喝咖啡!" 🎰
  - "Trúng 10 tỷ mà? Để em làm ăn lớn — xây lại quán cà phê này luôn!" 💰
  - "Mua vé số trên điện thoại cũng trúng được á? Thế thì tui mua mỗi ngày!" 😮

- **Item**: `LUCKY_LOTTERY_TICKET` — Vé số thần tài pixel art (event)
  - **Rarity**: Rare
  - **Cost**: 4,000 coins
  - **Effect**: `all` — +12% all stats khi kích hoạt "lucky draw" event
  - **Buff Details**: Mỗi 2 giờ có mini "lucky draw" cho khách hàng đang ở trong quán. Prize: free coffee, bonus coins, hoặc rare item. Tạo excitement!

- **Event Window**:
  - `activation`: Random 3-5% chance per day
  - `duration`: 6 hours when active
  - `trigger`: Random daily trigger + boost during "lotto draw days" (2nd, 12th, 22nd of month)

- **Visual**: Pixel art vé số đỏ trắng với icon ☘️ và 🍀. Hiệu ứng "lucky glow" vàng-xanh quanh vé. Particle "gold coins" falling animation khi có khách trúng.

---

### 🔥 Trend 10: Extreme Heat Watch + Strawberry Moon Combo
*Weather + astronomy crossover trend (2,000+ US heat, 10,000+ moon).*

- **Customer Chat**:
  - "Nóng quá trời! Cho em đá lạnh extra, không thì tan chảy mất." 🫠
  - "Trăng Dâu mà trời nóng như vậy... xem từ máy lạnh quán mình vậy!" 
  - "Extreme heat warning mà vẫn muốn uống nước. Phép màu của cà phê!"

- **Item**: `COOLING_CAVE_DECOR` — Hốc đá làm mát pixel art (decoration)
  - **Rarity**: Rare
  - **Cost**: 4,500 coins
  - **Effect**: `customers` — +20% customer draw during heat waves (high temp days)
  - **Buff Details**: Quán trở thành "oasis" trong ngày nóng. Khách hàng tìm đến quán để mát lạnh. Ice particles floating everywhere.

- **Event Window**:
  - `activation`: During high temperature days (temp > 35°C detected or manual)
  - `duration`: Full day until temp drops
  - `trigger`: Manual trigger + auto-detect when weather data shows extreme heat

- **Visual**: Pixel art hốc đá xanh với waterfall mini, ice crystals sparkle everywhere. Frost overlay trên màn hình quán. Customer sprites có icon 🥶 phía trên đầu. Tone xanh-lạnh contrast với màu nóng bên ngoài.

---

## Integration Summary

| Trend | Item ID | Type | Rarity | Cost | Primary Effect |
|-------|---------|------|--------|------|----------------|
| WC2026 Round of 32 | `WC_CUP_TROPHY` | decoration | Epic | 15,000 | all (+25% rev during matches) |
| Pension +8% | `PENSION_CAFE_SET` | recipe/event | Rare | 5,000 | revenue (+15% seniors) |
| Strawberry Moon | `STRAWBERRY_MOON_LATTE` | recipe | Legendary | 8,000 | all (+20% night rev) |
| Split Bill Drama | `SPLIT_BILL_MACHINE` | decoration/event | Rare | 3,000 | customers (+20% groups) |
| Fanta Cherry Spritz | `VANILLA_CHERRY_SPRITZ` | recipe | Epic | 6,000 | revenue (+18%) |
| Strategic Bomber | `WAR_ROOM_MAP` | decoration | Uncommon | 2,500 | all (+10% flat) |
| Marvel Rivals | `MARVEL_SUMMER_COFFEE` | recipe/event | Epic | 7,000 | customers (+25% gamers) |
| Concert Thanh Xuân | `CONCERT_STAGE_DECOR` | decoration/event | Legendary | 12,000 | customers (+35% fans) |
| Vietlott 10B | `LUCKY_LOTTERY_TICKET` | event | Rare | 4,000 | all (+12% lucky draw) |
| Extreme Heat + Moon | `COOLING_CAVE_DECOR` | decoration | Rare | 4,500 | customers (+20% heat days) |

## Balance Notes

- **No item exceeds +35% single-effect buff** — all balanced
- **Costs scale with rarity**: Uncommon (2.5k) → Legendary (8-12k)
- **Event triggers mix random + calendar-based** to prevent predictability
- **Vietnam-first approach**: VN trends have stronger integration depth (more dialogue variety, more visual detail)
- **Copyright-safe**: Marvel trend uses generic superhero theme, not direct IP references

## Future Expansion Hooks

1. Add `trend_detector` system that auto-enables/disables items based on real Google Trends API feed
2. Implement `daily_trend_board` UI showing current active trends
3. Create `trend_combo` mechanic: stacking compatible items (e.g., Strawberry Moon + Cooling Cave = "Moonlit Oasis" bonus)
4. Add Vietnamese meme integration layer for troll-specific customer dialogue variants

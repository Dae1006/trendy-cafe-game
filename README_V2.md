# ☕ Quán Trendy Café v2.0 — Pixel Art Edition

Game quản lý quán cà phê idle game với đồ họa pixel art!

## 🎮 Tính năng mới (v2.0):

### ⚡ Core Gameplay
- **Auto-serve skill scaling**: Staff có kỹ năng khác nhau ảnh hưởng đến tốc độ phục vụ
  - Fresher (60%): 1 đơn/tick
  - Senior (90%): 2 đơn/tick  
  - Manager (100%): 3 đơn/tick
- **Weather system**: Thời tiết thay đổi (nắng, mưa, mây, bão) ảnh hưởng doanh thu
- **Customer patience**: Khách hàng có thanh patience, hết patience = bỏ đi

### 🎨 Visual (Canvas Pixel Art)
- **Time-of-day sky gradient**: Sky color động theo thời gian (sáng/chiều/tối/đêm)
- **Rain/storm effects**: Hiệu ứng mưa và sét
- **Animated customers**: Khách hàng di chuyển quanh quán
- **Floating particles**: Hiển thị doanh thu khi bán hàng

### 🏭 Hệ thống quản lý
- **Supplier network**: 4 nhà cung cấp (cà phê, sữa, ly, nguyên liệu)
- **Staff management**: Thuê/đuổi nhân viên, theo dõi mood/skill
- **Revenue chart**: Biểu đồ doanh thu 7 ngày qua
- **Shop & Decorations**: Mua vật trang trí tăng buff doanh thu
- **Achievements**: Hệ thống thành tích với phần thưởng xu

### 🎪 Sự kiện đặc biệt
- **Seasonal events**: Tết Nguyên Đán, Trung Thu, Giáng Sinh (tăng doanh thu)
- **Locations**: Chuyển đổi giữa các quán (Cà phê, Trà đạo, Sinh tố, Bakery)

## 🚀 Cách chơi

1. Mở `index.html` trong trình duyệt
2. Click các tab bên dưới để chuyển đổi: Order, Menu, Chart, Staff, Supply, Shop, Items, Quests, Up, Achievements
3. Thuê nhân viên từ tab **Staff**
4. Mua nguyên liệu từ tab **Supply**
5. Quản lý đơn hàng và theo dõi doanh thu

## 📁 Cấu trúc project

```
v2.0/
├── index.html      # Giao diện chính (10 tabs)
├── styles.css      # Theme pixel art, responsive
└── game.js         # Game engine (~450 dòng code)
```

## 🔧 Tech Stack
- **HTML5 Canvas** cho pixel art rendering
- **Vanilla JavaScript** (ES6+), không dependency
- **CSS3** với custom properties, flexbox/grid
- **LocalStorage** để lưu tiến trình game

## 📝 Ghi chú kỹ thuật

### Auto-serve Formula
```javascript
Math.max(1, Math.floor(skill × mood × 3)) đơn/tick
```

### Weather System (Deterministic per day)
```javascript
let seed = (G.day * 7919 + 104729) % 1000;
let wIdx = Math.floor(seed / 250) % WEATHERS.length;
```

### Game Tick
- Mỗi **2 giây**: Spawn đơn hàng mới, staff tự động phục vụ
- Mỗi **6 ticks (~12s)**: Render lại UI (optimization)
- Auto-save mỗi **30 giây**

## 🚀 Deploy lên GitHub Pages

1. Clone repo hoặc upload 3 file `index.html`, `styles.css`, `game.js`
2. Vào **Settings → Pages**
3. Source → **Deploy from a branch** → chọn `main` → `/ (root)`
4. Link game: `https://<username>.github.io/trendy-cafe-game/v2.0/`

## 📊 Version History
- **v1.0**: Original version (emoji-based)
- **v2.0** (Current): Pixel art canvas, weather system, supplier network, revenue chart

---
*Made with ❤️ by Dae1006 | 2026*

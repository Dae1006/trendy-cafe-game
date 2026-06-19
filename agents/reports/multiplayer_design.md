# 🌐 Multiplayer System — Quán Trendy Café

## Kiến trúc: Firebase Real-time Database

### 1. **Authentication**
- Google Sign-In / Email + Password
- Mỗi player có unique UID
- Lưu profile: name, avatar, coin count, level, owned locations, staff, items

### 2. **Player Profiles** (Real-time sync)
```
players/{uid}/
  name: string
  avatar: string
  level: int
  xp: int
  coins: number
  locations: ["street", "mall"]
  staff: []
  owned_items: {itemId: count}
  recipes: ["coffee", "espresso"]
  total_revenue: number
  total_served: int
  nps: number
  created_at: timestamp
  last_login: timestamp
```

### 3. **Global Marketplace** (Real-time)
- Player A đăng bán item → Player B mua
- Giá do player A định (market dynamic)
- Commission 5% cho platform
- Real-time notification khi có người mua/bán

### 4. **Leaderboards**
- Top 100: total revenue
- Top 100: total served
- Top 100: nps score
- Top 100: chain value
- Update real-time mỗi giờ

### 5. **Visit Friend's Cafe**
- Gửi link cafe cho bạn
- Bạn có thể vào xem quán của mình
- Có thể mua đồ trong quán (nếu owner bật)
- Tips cho owner khi visit

### 6. **Competitive Events**
- Weekly challenge: ai phục vụ nhiều nhất
- Monthly: ai có doanh thu cao nhất
- Seasonal: festival events có leaderboard riêng
- Prize: rare items, coins, exclusive decor

### 7. **Social Features**
- Invite friends → both get bonus coins
- Gift items cho bạn bè
- Chat đơn giản trong cafe (text chat khi visit)
- Share cafe của bạn lên social media

## Tech Stack
- **Firebase Auth**: Google Sign-In, Email
- **Firestore**: Real-time database
- **Firebase Storage**: Avatars, images
- **Cloud Functions**: Server logic, commissions, events
- **Security Rules**: Prevent cheating, validate transactions

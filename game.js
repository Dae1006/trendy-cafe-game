// ================================
// QUÁN TRENDY CAFÉ v2.0 — GAME ENGINE
// Features: Weather, Suppliers, Staff, Feedback, Ads
// ================================

// ======= DATA: LOCATIONS ======
const LOCATIONS = {
    street: { name: "Vỉa hè", emoji: "🚶", cost: 0, revenueMult: 1, customers: 3, bgClass: "weather-sunny" },
    mall: { name: "Trung tâm TM", emoji: "🏬", cost: 5000, revenueMult: 2.5, customers: 5, bgClass: "weather-cloudy" },
    garden: { name: "Sân vườn", emoji: "🌳", cost: 15000, revenueMult: 2, customers: 4, bgClass: "weather-sunny" },
    rooftop: { name: "Rooftop", emoji: "🌃", cost: 50000, revenueMult: 3.5, customers: 6, bgClass: "weather-sunny" },
    festival: { name: "Lễ hội", emoji: "🎪", cost: 100000, revenueMult: 4, customers: 8, bgClass: "weather-tet" }
};

// ======= DATA: MENU ======
const MENU_ITEMS = [
    { id: "coffee", name: "Cà phê đen", icon: "☕", price: 25, cost: 5, needsBeans: true, needsMilk: false },
    { id: "milk_coffee", name: "Cà phê sữa", icon: "🥛", price: 30, cost: 8, needsBeans: true, needsMilk: true },
    { id: "espresso", name: "Espresso", icon: "☕", price: 35, cost: 5, needsBeans: true, needsMilk: false },
    { id: "matcha", name: "Trà matcha", icon: "🍵", price: 40, cost: 10, needsBeans: false, needsMilk: false },
    { id: "smoothie", name: "Sinh tố", icon: "🥤", price: 45, cost: 12, needsBeans: false, needsMilk: true },
    { id: "cake", name: "Bánh mì", icon: "🥪", price: 35, cost: 8, needsBeans: false, needsMilk: false },
    { id: "ice_tea", name: "Trà đá", icon: "🧊", price: 15, cost: 3, needsBeans: false, needsMilk: false },
    { id: "bubble_tea", name: "Trà sữa", icon: "🧋", price: 50, cost: 12, needsBeans: false, needsMilk: true },
    { id: "tropical", name: "Nước ép dừa", icon: "🥥", price: 55, cost: 15, needsBeans: false, needsMilk: true },
    { id: "signature", name: "Signature Drink", icon: "🍸", price: 80, cost: 20, needsBeans: true, needsMilk: true },
];

// ======= DATA: TREND ITEMS ======
const TREND_ITEMS = [
    { id: "t_meme_dog", name: "🐶 Meme Chó Vàng", rarity: "common", type: "decoration", effect: "revenue", value: 0.05, desc: "+5% doanh thu", cost: 200 },
    { id: "t_meme_cat", name: "🐱 Mèo hoang", rarity: "common", type: "decoration", effect: "revenue", value: 0.03, desc: "+3% doanh thu", cost: 150 },
    { id: "t_mu_jersey", name: "⚽ Áo MU", rarity: "common", type: "decoration", effect: "customers", value: 1, desc: "+1 khách", cost: 300 },
    { id: "t_astro_tea", name: "🧋 Trà sữa Astro", rarity: "common", type: "recipe", effect: "revenue", value: 0.1, desc: "+10% doanh thu trà sữa", cost: 400 },
    { id: "t_king_keo", name: "🍬 King Keo", rarity: "common", type: "decoration", effect: "revenue", value: 0.02, desc: "+2% doanh thu", cost: 250 },
    { id: "t_girl_boy", name: "💃 Cô Bé Chú Bé", rarity: "rare", type: "decoration", effect: "revenue", value: 0.1, desc: "+10% doanh thu", cost: 1000 },
    { id: "t_ba_tram", name: "💯 Ba Trăm", rarity: "rare", type: "decoration", effect: "customers", value: 2, desc: "+2 khách", cost: 1500 },
    { id: "t_tu_hien", name: "🎤 Tú Hien Style", rarity: "rare", type: "recipe", effect: "revenue", value: 0.15, desc: "+15% doanh thu all", cost: 2000 },
    { id: "t_lam_pham", name: "🏆 Lam Phẩm", rarity: "epic", type: "recipe", effect: "revenue", value: 0.2, desc: "+20% doanh thu signature", cost: 5000 },
    { id: "t_sieu_toc", name: "⚡ Siêu Tốc", rarity: "epic", type: "decoration", effect: "customers", value: 5, desc: "+5 khách", cost: 8000 },
    { id: "t_vua_cafe", name: "👑 Vua Cà Phê", rarity: "legendary", type: "decoration", effect: "revenue", value: 0.5, desc: "+50% doanh thu!", cost: 20000 },
    { id: "t_hoang_thu", name: "🔥 Hoảng Thủ", rarity: "legendary", type: "recipe", effect: "revenue", value: 0.4, desc: "+40% doanh thu signature", cost: 25000 },
    { id: "t_omega", name: "💫 Omega Plus", rarity: "legendary", type: "decoration", effect: "all", value: 0.3, desc: "+30% tất cả!", cost: 50000 },
];

// ======= DATA: QUESTS ======
const QUESTS = [
    { id: "q1", title: "Ngày đầu khai trương", desc: "Phục vụ 10 khách hàng đầu tiên", type: "serve", target: 10, reward: { coins: 200, xp: 50 }, done: false },
    { id: "q2", title: "Thu thập meme đầu tiên", desc: "Sở hữu 1 item trendy", type: "collect", target: 1, reward: { coins: 300, xp: 75 }, done: false },
    { id: "q3", title: "Triệu phú cà phê", desc: "Kiếm 5000 coin từ bán đồ", type: "earn", target: 5000, reward: { coins: 1000, xp: 150 }, done: false },
    { id: "q4", title: "Nâng cấp quán", desc: "Mở quán ở vị trí mới", type: "upgrade", target: 1, reward: { coins: 2000, xp: 200 }, done: false },
    { id: "q5", title: "Thu thập bộ sưu tập", desc: "Có 5 items khác nhau", type: "collect_all", target: 5, reward: { coins: 3000, xp: 300 }, done: false },
    { id: "q6", title: "Doanh thu khủng", desc: "Kiếm 20000 coin trong 1 ngày", type: "daily_earn", target: 20000, reward: { coins: 5000, xp: 500 }, done: false },
    { id: "q7", title: "Master of Trade", desc: "Giao dịch 10 lần trên chợ", type: "trade", target: 10, reward: { coins: 4000, xp: 400 }, done: false },
    { id: "q8", title: "Hoàn toàn bộ sưu tập", desc: "Sở hữu tất cả items", type: "complete_all", target: TREND_ITEMS.length, reward: { coins: 20000, xp: 2000 }, done: false },
];

// ======= DATA: UPGRADES ======
const UPGRADES = [
    { id: "u_staff1", name: "👨‍🍳 Thuê nhân viên", desc: "Tự động phục vụ 1 khách/phút", cost: 1000, type: "auto_serve", value: 1, bought: false },
    { id: "u_staff2", name: "👩‍🍳 Thêm nhân viên", desc: "Tự động phục vụ thêm 2 khách/phút", cost: 3000, type: "auto_serve", value: 2, bought: false },
    { id: "u_staff3", name: "👨‍🍳👩‍🍳 Đội bếp", desc: "Tự động phục vụ thêm 5 khách/phút", cost: 8000, type: "auto_serve", value: 5, bought: false },
    { id: "u_menu1", name: "📋 Mở rộng menu", desc: "Thêm 5 món mới vào menu", cost: 2000, type: "unlock_menu", value: 5, bought: false },
    { id: "u_deco1", name: "🪑 Bàn ghế mới", desc: "+10% doanh thu từ khách ngồi lại", cost: 1500, type: "revenue", value: 0.1, bought: false },
    { id: "u_deco2", name: "🎵 Nhạc nền", desc: "+5% doanh thu từ không khí", cost: 800, type: "revenue", value: 0.05, bought: false },
    { id: "u_sign1", name: "🪧 Bảng hiệu LED", desc: "+20% khách vãng lai", cost: 5000, type: "customers", value: 0.2, bought: false },
    { id: "u_wifi1", name: "📶 WiFi miễn phí", desc: "Khách ngồi lâu hơn (+10%)", cost: 1200, type: "revenue", value: 0.1, bought: false },
    { id: "u_aircon1", name: "❄️ Điều hòa", desc: "Khách thích ngồi lại hơn (+15% doanh thu)", cost: 3500, type: "revenue", value: 0.15, bought: false },
    { id: "u_parking1", name: "🅿️ Chỗ đỗ xe", desc: "+15% khách xa", cost: 4000, type: "customers", value: 0.15, bought: false },
];

// ======= DATA: WEATHER ======
const WEATHER_MAP = {
    sunny: { emoji: "☀️", name: "Nắng", revenueMod: 1.0, desc: "Trời nắng — khách mua nước đá tăng!" },
    cloudy: { emoji: "⛅", name: "Nhiều mây", revenueMod: 1.05, desc: "Trời mát mẻ — thời tiết lý tưởng!" },
    rainy: { emoji: "🌧️", name: "Mưa", revenueMod: 0.75, desc: "Mưa lớn — khách giảm, nước nóng bán chạy!" },
    thunderstorm: { emoji: "⛈️", name: "Dông bão", revenueMod: 0.4, desc: "Dông bão! Rất ít khách!" },
    hot: { emoji: "🔥", name: "Nóng gay gắt", revenueMod: 1.15, desc: "Nóng khủng khiếp! Nước đá cháy hàng!" },
    tet: { emoji: "🎊", name: "Tết", revenueMod: 2.5, desc: "Tết đến rồi! Khách đông, giá cao!" }
};

const SEASON_WEATHER = {
    summer: { sunny: 0.35, cloudy: 0.25, rainy: 0.20, thunderstorm: 0.10, hot: 0.10, tet: 0.00 },
    rainy: { sunny: 0.10, cloudy: 0.15, rainy: 0.45, thunderstorm: 0.20, hot: 0.00, tet: 0.10 },
    cool: { sunny: 0.15, cloudy: 0.30, rainy: 0.15, thunderstorm: 0.05, hot: 0.00, tet: 0.35 }
};

// ======= GAME STATE ======
let gameState = {
    coins: 500, level: 1, xp: 0, xpNeeded: 100,
    currentLocation: "street", unlockedLocations: ["street"],
    ownedItems: {}, ownedRecipes: [], menuUnlocked: 0,
    autoServeRate: 0, upgradesBought: [], questsCompleted: [],
    dailyRevenue: 0, totalRevenue: 0, totalServed: 0, tradesCount: 0,
    marketplace: [], decorations: [], lastTick: Date.now(), lastTradeTick: Date.now(),
    gameDay: 1, lastDayChange: Date.now(), dailyCosts: 0,
    iceStock: 100, supplierStock: { beans: 10, milk: 20, cups: 200 },
};

// ======= SAVE / LOAD ======
function saveGame() {
    localStorage.setItem("trendyCafeSave", JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem("trendyCafeSave");
    if (saved) {
        const parsed = JSON.parse(saved);
        gameState = { ...gameState, ...parsed };
    }
    // Reset quests if needed
    if (!gameState.questsCompleted) {
        QUESTS.forEach(q => q.done = false);
    }
}

// ======= WEATHER ======
function getCurrentWeather() {
    const cycle = gameState.gameDay % 180;
    let season = cycle < 60 ? 'summer' : (cycle < 120 ? 'rainy' : 'cool');
    const probs = SEASON_WEATHER[season];
    const rand = Math.random();
    let cum = 0;
    for (const [type, prob] of Object.entries(probs)) {
        cum += prob;
        if (rand <= cum) return { ...WEATHER_MAP[type], type, season };
    }
    return { ...WEATHER_MAP.sunny, type: 'sunny', season };
}

// ======= CORE REVENUE ======
function getRevenuePerMin() {
    const loc = LOCATIONS[gameState.currentLocation];
    let base = loc.customers * 30;
    let mult = loc.revenueMult;

    for (const [itemId, count] of Object.entries(gameState.ownedItems)) {
        const item = TREND_ITEMS.find(i => i.id === itemId);
        if (item && item.effect === "revenue") mult += item.value * count;
    }

    for (const uId of gameState.upgradesBought) {
        const u = UPGRADES.find(x => x.id === uId);
        if (u && u.type === "revenue") mult += u.value;
    }

    const weather = getCurrentWeather();
    mult *= weather.revenueMod || 1;

    return Math.floor(base * mult);
}

function getCustomerCount() {
    const loc = LOCATIONS[gameState.currentLocation];
    let base = loc.customers;

    for (const [itemId, count] of Object.entries(gameState.ownedItems)) {
        const item = TREND_ITEMS.find(i => i.id === itemId);
        if (item && item.effect === "customers") base += item.value * count;
    }

    for (const uId of gameState.upgradesBought) {
        const u = UPGRADES.find(x => x.id === uId);
        if (u && u.type === "customers") base = Math.floor(base * (1 + u.value));
    }
    return base;
}

function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
}

// ======= RENDER ======
function renderAll() {
    updateHeader();
    updateLocationBar();
    renderWeatherDisplay();
    renderSupplierStatus();
    renderCafeScene();
    renderOrders();
    renderMenu();
    renderStats();
    renderShop();
    renderItems();
    renderMarket();
    renderQuests();
    renderUpgrades();
}

function updateHeader() {
    document.getElementById("coin-amount").textContent = formatNumber(gameState.coins);
    document.getElementById("income-amount").textContent = formatNumber(getRevenuePerMin());
    document.getElementById("player-level").textContent = gameState.level;
    document.getElementById("xp-amount").textContent = gameState.xp;
    document.getElementById("xp-needed").textContent = gameState.xpNeeded;
}

function renderWeatherDisplay() {
    const weather = getCurrentWeather();
    const el = document.getElementById("weather-display");
    if (el) {
        el.innerHTML = `${weather.emoji} ${weather.name} — ${weather.desc}`;
    }
}

function renderSupplierStatus() {
    const beansEl = document.getElementById("beans-stock");
    const milkEl = document.getElementById("milk-stock");
    const cupsEl = document.getElementById("cups-stock");
    const iceEl = document.getElementById("ice-stock");
    if (beansEl) beansEl.textContent = Math.floor(gameState.supplierStock.beans);
    if (milkEl) milkEl.textContent = Math.floor(gameState.supplierStock.milk);
    if (cupsEl) cupsEl.textContent = Math.floor(gameState.supplierStock.cups);
    if (iceEl) iceEl.textContent = Math.floor(gameState.iceStock);
}

function updateLocationBar() {
    const buttons = document.querySelectorAll(".loc-btn");
    buttons.forEach(btn => {
        const locKey = btn.dataset.loc;
        btn.disabled = !gameState.unlockedLocations.includes(locKey);
        btn.classList.toggle("active", gameState.currentLocation === locKey);
    });
}

function renderCafeScene() {
    const bg = document.getElementById("cafe-bg");
    const container = document.getElementById("customers-container");
    const loc = LOCATIONS[gameState.currentLocation];
    const weather = getCurrentWeather();

    bg.className = loc.bgClass;
    bg.style.background = '';

    // Apply weather overlay
    const weatherColors = {
        sunny: 'linear-gradient(to bottom, #87CEEB 0%, #8B7355 60%, #696969 100%)',
        cloudy: 'linear-gradient(to bottom, #708090 0%, #778899 60%, #2F4F4F 100%)',
        rainy: 'linear-gradient(to bottom, #4a4a5a 0%, #5a5a6a 60%, #3a3a4a 100%)',
        thunderstorm: 'linear-gradient(to bottom, #2a2a3a 0%, #1a1a2a 60%, #0a0a1a 100%)',
        hot: 'linear-gradient(to bottom, #FF4500 0%, #FF6347 60%, #FF8C00 100%)',
        tet: 'linear-gradient(to bottom, #FF0000 0%, #FFD700 50%, #FF0000 100%)'
    };
    bg.style.background = weatherColors[weather.type] || weatherColors.sunny;
    container.innerHTML = "";

    const emojis = ["👨", "👩", "👦", "👧", "🧑", "👴", "👵", "🧒"];
    const count = getCustomerCount();

    for (let i = 0; i < Math.min(count, 20); i++) {
        const div = document.createElement("div");
        div.className = "customer animate-fadeIn";
        div.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        div.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(div);
    }
}

function renderOrders() {
    const list = document.getElementById("orders-list");
    const loc = LOCATIONS[gameState.currentLocation];
    const count = Math.min(loc.customers, 8);
    list.innerHTML = "";

    if (count === 0) {
        list.innerHTML = "<div style='padding:10px;color:var(--text-dim);'>Đang chờ khách...</div>";
        return;
    }

    for (let i = 0; i < count; i++) {
        const menuItem = MENU_ITEMS[Math.floor(Math.random() * Math.min(gameState.menuUnlocked + 1, MENU_ITEMS.length))];
        const div = document.createElement("div");
        div.className = "order-item animate-fadeIn";
        div.style.animationDelay = `${i * 0.1}s`;
        div.innerHTML = `
            <div class="order-info">${menuItem.icon} ${menuItem.name}</div>
            <div>
                <span class="order-price">${menuItem.price}₫</span>
                <button class="serve-btn" onclick="serveOrder('${menuItem.id}')">Phục vụ</button>
            </div>
        `;
        list.appendChild(div);
    }
}

// ======= SERVE ORDER ======
function serveOrder(menuItemId) {
    const item = MENU_ITEMS.find(m => m.id === menuItemId);
    if (!item) return;

    // Check stock
    if (item.needsBeans && gameState.supplierStock.beans <= 0) {
        showNotification("⚠️ Hết cà phê! Hãy nhập thêm!");
        return;
    }
    if (item.needsMilk && gameState.supplierStock.milk <= 0) {
        showNotification("⚠️ Hết sữa! Hãy nhập thêm!");
        return;
    }
    if (gameState.supplierStock.cups <= 0) {
        showNotification("⚠️ Hết cốc!");
        return;
    }

    // Consume supplies
    if (item.needsBeans) gameState.supplierStock.beans -= 0.1;
    if (item.needsMilk) gameState.supplierStock.milk -= 0.2;
    gameState.supplierStock.cups -= 1;

    // Calculate revenue
    let price = item.price;
    let mult = 1;
    const beanQuality = 0.9 + Math.random() * 0.2;
    const milkQuality = 0.9 + Math.random() * 0.2;

    for (const [tid, count] of Object.entries(gameState.ownedItems)) {
        const tItem = TREND_ITEMS.find(t => t.id === tid);
        if (tItem && tItem.effect === "revenue") mult += tItem.value * count;
    }

    for (const uId of gameState.upgradesBought) {
        const u = UPGRADES.find(x => x.id === uId);
        if (u && u.type === "revenue") mult += u.value;
    }

    const weather = getCurrentWeather();
    mult *= weather.revenueMod;

    if (item.needsBeans) mult *= (0.8 + beanQuality * 0.2);
    if (item.needsMilk) mult *= (0.8 + milkQuality * 0.2);

    const earned = Math.floor(price * mult);
    gameState.coins += earned;
    gameState.dailyRevenue += earned;
    gameState.totalRevenue += earned;
    gameState.totalServed++;

    addXP(10);
    checkQuestProgress("serve", 1);
    checkQuestProgress("earn", earned);
    saveGame();
    renderAll();
}

// ======= XP / LEVEL ======
function addXP(amount) {
    gameState.xp += amount;
    while (gameState.xp >= gameState.xpNeeded) {
        gameState.xp -= gameState.xpNeeded;
        gameState.level++;
        gameState.xpNeeded = Math.floor(gameState.xpNeeded * 1.5);
        showNotification(`⭐ Lên cấp ${gameState.level}!`);
    }
}

// ======= SHOP ======
function renderShop() {
    const list = document.getElementById("shop-menu-list");
    list.innerHTML = "";

    const availableItems = TREND_ITEMS.filter(item => {
        if (gameState.ownedItems[item.id] && gameState.ownedItems[item.id] > 0) return false;
        return true;
    });

    if (availableItems.length === 0) {
        list.innerHTML = "<div style='padding:10px;color:var(--text-dim);'>Đã sở hữu hết!</div>";
        return;
    }

    availableItems.forEach(item => {
        const rarityColors = { common: "var(--common)", rare: "var(--rare)", epic: "var(--epic)", legendary: "var(--legendary)" };
        const div = document.createElement("div");
        div.className = "shop-item animate-pop";
        div.innerHTML = `
            <div style="display:flex;align-items:center;gap:10px;flex:1;">
                <span class="item-icon">${item.id.replace('t_','').substring(0,4)}</span>
                <div class="item-details">
                    <div class="item-name">${item.name}</div>
                    <div class="item-desc">${item.desc}</div>
                </div>
            </div>
            <div style="text-align:right;">
                <div class="item-price">${formatNumber(item.cost)}₫</div>
                <button class="buy-btn" onclick="buyItem('${item.id}')">Mua</button>
            </div>
        `;
        div.style.borderLeft = `3px solid ${rarityColors[item.rarity]}`;
        list.appendChild(div);
    });
}

function buyItem(itemId) {
    const item = TREND_ITEMS.find(i => i.id === itemId);
    if (!item) return;

    if (gameState.coins < item.cost) {
        showNotification("❌ Không đủ coin!");
        return;
    }

    gameState.coins -= item.cost;
    gameState.ownedItems[itemId] = (gameState.ownedItems[itemId] || 0) + 1;
    if (item.type === "recipe") gameState.ownedRecipes.push(itemId);

    showNotification(`✅ Mua thành công: ${item.name}!`);
    saveGame();
    renderAll();
}

// ======= ITEMS ======
function renderItems() {
    const list = document.getElementById("items-list");
    list.innerHTML = "";

    const ownedItems = Object.entries(gameState.ownedItems).filter(([k, v]) => v > 0);
    if (ownedItems.length === 0) {
        list.innerHTML = "<div style='padding:10px;color:var(--text-dim);'>Chưa có items nào!</div>";
        return;
    }

    ownedItems.forEach(([itemId, count]) => {
        const item = TREND_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        const rarityColors = { common: "var(--common)", rare: "var(--rare)", epic: "var(--epic)", legendary: "var(--legendary)" };
        const div = document.createElement("div");
        div.className = `item-card ${item.rarity}`;
        div.innerHTML = `
            <span class="item-emoji">${item.id.replace('t_','').substring(0,4)}</span>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-rarity ${item.rarity}">${item.rarity}</div>
                <div>${item.desc} ×${count}</div>
            </div>
        `;
        list.appendChild(div);
    });
}

// ======= MARKET ======
function renderMarket() {
    const list = document.getElementById("market-list");
    list.innerHTML = "<div style='padding:10px;color:var(--text-dim);'>Chức năng marketplaceComing Soon!</div>";
}

// ======= QUESTS ======
function checkQuestProgress(type, value) {
    QUESTS.forEach(q => {
        if (!q.done && q.type === type) {
            q.progress = (q.progress || 0) + value;
            if (q.progress >= q.target) {
                q.done = true;
                gameState.questsCompleted.push(q.id);
                gameState.coins += q.reward.coins;
                addXP(q.reward.xp);
                showNotification(`✅ Quest hoàn thành: ${q.title}! +${q.reward.coins}coin +${q.reward.xp}XP`);
            }
        }
    });
}

function renderQuests() {
    const list = document.getElementById("quests-list");
    list.innerHTML = "";

    QUESTS.forEach(q => {
        const progress = q.done ? q.target : (q.progress || 0);
        const pct = Math.min(100, (progress / q.target) * 100);
        const div = document.createElement("div");
        div.className = "quest-item";
        div.innerHTML = `
            <div class="quest-title">${q.done ? '✅' : '📌'} ${q.title}</div>
            <div class="quest-desc">${q.desc}</div>
            <div class="quest-reward">Phần thưởng: ${q.reward.coins} coin, ${q.reward.xp} XP</div>
            <div class="quest-progress">
                <div class="quest-progress-bar" style="width:${pct}%"></div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:3px;">${Math.floor(progress)}/${q.target}</div>
        `;
        list.appendChild(div);
    });
}

// ======= UPGRADES ======
function renderUpgrades() {
    const list = document.getElementById("upgrades-list");
    list.innerHTML = "";

    UPGRADES.forEach(u => {
        const div = document.createElement("div");
        div.className = "upgrade-item";
        const bought = gameState.upgradesBought.includes(u.id);
        div.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${u.name}</div>
                <div class="upgrade-desc">${u.desc}</div>
            </div>
            <div style="text-align:right;">
                <div class="upgrade-cost">${formatNumber(u.cost)}₫</div>
                <button class="upgrade-btn" onclick="buyUpgrade('${u.id}')" ${bought || gameState.coins < u.cost ? 'disabled' : ''}>${bought ? '✅ Đã mua' : 'Mua'}</button>
            </div>
        `;
        list.appendChild(div);
    });
}

function buyUpgrade(upgradeId) {
    const u = UPGRADES.find(x => x.id === upgradeId);
    if (!u || gameState.coins < u.cost || gameState.upgradesBought.includes(upgradeId)) return;

    gameState.coins -= u.cost;
    gameState.upgradesBought.push(upgradeId);

    if (u.type === "auto_serve") gameState.autoServeRate += u.value;
    if (u.type === "unlock_menu") gameState.menuUnlocked += u.value;

    showNotification(`✅ Nâng cấp: ${u.name}!`);
    saveGame();
    renderAll();
}

// ======= NOTIFICATION ======
function showNotification(text) {
    // Simple inline notification
    const div = document.createElement("div");
    div.style.cssText = "position:fixed;top:20px;left:50%;transform:translateX(-50%);background:var(--primary);color:white;padding:10px 20px;border-radius:8px;z-index:9999;font-size:14px;animation:fadeIn 0.3s";
    div.textContent = text;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// ======= LOCATION SWITCH ======
function switchLocation(locKey) {
    if (!gameState.unlockedLocations.includes(locKey)) {
        const loc = LOCATIONS[locKey];
        if (gameState.coins >= loc.cost) {
            gameState.coins -= loc.cost;
            gameState.unlockedLocations.push(locKey);
            showNotification(`✅ Mở khóa: ${loc.name}!`);
        } else {
            showNotification("❌ Không đủ coin để mở khóa!");
            return;
        }
    }
    gameState.currentLocation = locKey;
    saveGame();
    renderAll();
}

// ======= EVENT LISTENERS ======
function setupEventListeners() {
    document.querySelectorAll(".loc-btn").forEach(btn => {
        btn.addEventListener("click", () => switchLocation(btn.dataset.loc));
    });
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            document.getElementById(btn.dataset.tab + "-panel").classList.add("active");
        });
    });
}

// ======= GAME LOOP ======
function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        const delta = (now - gameState.lastTick) / 1000;

        // Revenue per second
        gameState.lastTick = now;

        // Auto serve
        if (gameState.autoServeRate > 0) {
            const served = Math.floor(gameState.autoServeRate * delta / 60);
            if (served > 0) {
                gameState.coins += served * 25;
                gameState.dailyRevenue += served * 25;
                gameState.totalRevenue += served * 25;
                gameState.totalServed += served;
                saveGame();
            }
        }

        // Day change (every 60 seconds = 1 game day)
        if (now - gameState.lastDayChange > 60000) {
            gameState.gameDay++;
            gameState.lastDayChange = now;
            renderWeatherDisplay();

            // Daily costs
            const dailyWage = gameState.autoServeRate * 50000;
            gameState.dailyCosts = dailyWage;

            // Supplier price event
            if (Math.random() < 0.02) {
                showNotification("📦 Có biến động giá nguyên liệu!");
            }
        }

        renderAll();
    }, 1000);
}

// ======= INIT ======
function init() {
    loadGame();
    setupEventListeners();
    renderAll();
    renderWeatherDisplay();
    renderSupplierStatus();
    startGameLoop();
    updateTrendBanner();
}

// Make init global for HTML
window.init = init;
window.serveOrder = serveOrder;
window.buyItem = buyItem;
window.buyUpgrade = buyUpgrade;
window.switchLocation = switchLocation;

// Auto-start
init();

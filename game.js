// ================================
// QUÁN TRENDY CAFÉ — GAME ENGINE
// ================================

// ============ DATA DEFINITIONS ============

const LOCATIONS = {
    street: {
        name: "Vỉa hè", emoji: "🚶", cost: 0, revenueMult: 1,
        desc: "Quán vỉa hè — bắt đầu từ đây!", customers: 3,
        bgClass: "street"
    },
    mall: {
        name: "Trung tâm TM", emoji: "🏬", cost: 5000, revenueMult: 2.5,
        desc: "Quán trong mall — khách VIP!", customers: 5,
        bgClass: "mall"
    },
    garden: {
        name: "Sân vườn", emoji: "🌳", cost: 15000, revenueMult: 2,
        desc: "Quán sân vườn xanh mát", customers: 4,
        bgClass: "garden"
    },
    rooftop: {
        name: "Rooftop", emoji: "🌃", cost: 50000, revenueMult: 3.5,
        desc: "Rooftop view thành phố", customers: 6,
        bgClass: "rooftop"
    },
    festival: {
        name: "Lễ hội", emoji: "🎪", cost: 100000, revenueMult: 4,
        desc: "Quán lễ hội — thu thập items độc!", customers: 8,
        bgClass: "festival"
    }
};

const MENU_ITEMS = [
    { id: "coffee", name: "Cà phê đen", icon: "☕", price: 25, cost: 5, unlock: 0 },
    { id: "milk_coffee", name: "Cà phê sữa", icon: "🥛", price: 30, cost: 8, unlock: 0 },
    { id: "espresso", name: "Espresso", icon: "☕", price: 35, cost: 5, unlock: 0 },
    { id: "matcha", name: "Trà matcha", icon: "🍵", price: 40, cost: 10, unlock: 0 },
    { id: "smoothie", name: "Sinh tố", icon: "🥤", price: 45, cost: 12, unlock: 0 },
    { id: "cake", name: "Bánh mì", icon: "🥪", price: 35, cost: 8, unlock: 0 },
    { id: "ice_tea", name: "Trà đá", icon: "🧊", price: 15, cost: 3, unlock: 0 },
    { id: "bubble_tea", name: "Trà sữa", icon: "🧋", price: 50, cost: 12, unlock: 0 },
    { id: "tropical", name: "Nước ép dừa", icon: "🥥", price: 55, cost: 15, unlock: 0 },
    { id: "signature", name: "Signature Drink", icon: "🍸", price: 80, cost: 20, unlock: 0 },
];

const TREND_ITEMS = [
    // Common items
    { id: "t_meme_dog", name: "🐶 Meme Chó Vàng", rarity: "common", type: "decoration", effect: "revenue", value: 0.05, desc: "+5% doanh thu" },
    { id: "t_meme_cat", name: "🐱 Mèo hoang", rarity: "common", type: "decoration", effect: "revenue", value: 0.03, desc: "+3% doanh thu" },
    { id: "t_mu_jersey", name: "⚽ Áo MU", rarity: "common", type: "decoration", effect: "customers", value: 1, desc: "+1 khách" },
    { id: "t_astro_tea", name: "🧋 Trà sữa Astro", rarity: "common", type: "recipe", effect: "revenue", value: 0.1, desc: "+10% doanh thu trà sữa" },
    { id: "t_king_keo", name: "🍬 King Keo", rarity: "common", type: "decoration", effect: "revenue", value: 0.02, desc: "+2% doanh thu" },

    // Rare items
    { id: "t_girl_boy", name: "💃 Cô Bé Chú Bé", rarity: "rare", type: "decoration", effect: "revenue", value: 0.1, desc: "+10% doanh thu" },
    { id: "t_ba_tram", name: "💯 Ba Trăm", rarity: "rare", type: "decoration", effect: "customers", value: 2, desc: "+2 khách" },
    { id: "t_tu_hien", name: "🎤 Tú Hien Style", rarity: "rare", type: "recipe", effect: "revenue", value: 0.15, desc: "+15% doanh thu all" },
    { id: "t_ho_ho", name: "🍞 Ho Ho", rarity: "rare", type: "decoration", effect: "revenue", value: 0.08, desc: "+8% doanh thu" },
    { id: "t_cong_giong", name: "🐔 Công Giong", rarity: "rare", type: "decoration", effect: "customers", value: 3, desc: "+3 khách" },

    // Epic items
    { id: "t_lam_pham", name: "🏆 Lam Phẩm", rarity: "epic", type: "recipe", effect: "revenue", value: 0.2, desc: "+20% doanh thu signature" },
    { id: "t_sieu_toc", name: "⚡ Siêu Tốc", rarity: "epic", type: "decoration", effect: "customers", value: 5, desc: "+5 khách" },
    { id: "t_duc_phuong", name: "🌸 Đức Phương Style", rarity: "epic", type: "recipe", effect: "revenue", value: 0.25, desc: "+25% doanh thu" },
    { id: "t_vuong_dao", name: "👑 Vương Đạo", rarity: "epic", type: "decoration", effect: "revenue", value: 0.15, desc: "+15% doanh thu" },

    // Legendary items
    { id: "t_vua_cafe", name: "👑 Vua Cà Phê", rarity: "legendary", type: "decoration", effect: "revenue", value: 0.5, desc: "+50% doanh thu!" },
    { id: "t_hoang_thu", name: "🔥 Hoảng Thủ", rarity: "legendary", type: "recipe", effect: "revenue", value: 0.4, desc: "+40% doanh thu signature" },
    { id: "t_omega", name: "💫 Omega Plus", rarity: "legendary", type: "decoration", effect: "all", value: 0.3, desc: "+30% tất cả!" },
    { id: "t_chu_nhat", name: "☀️ Chủ Nhật Special", rarity: "legendary", type: "recipe", effect: "revenue", value: 0.35, desc: "+35% doanh thu" },
];

const QUESTS = [
    { id: "q1", title: "Ngày đầu khai trương", desc: "Phục vụ 10 khách hàng đầu tiên", type: "serve", target: 10, reward: { coins: 200, xp: 50 }, trendItem: null },
    { id: "q2", title: "Thu thập meme đầu tiên", desc: "Sở hữu 1 item trendy", type: "collect", target: 1, reward: { coins: 300, xp: 75 }, trendItem: "t_meme_dog" },
    { id: "q3", title: "Triệu phú cà phê", desc: "Kiếm 5000 coin từ bán đồ", type: "earn", target: 5000, reward: { coins: 1000, xp: 150 }, trendItem: "t_mu_jersey" },
    { id: "q4", title: "Nâng cấp quán", desc: "Mở quán ở vị trí mới", type: "upgrade", target: 1, reward: { coins: 2000, xp: 200 }, trendItem: "t_girl_boy" },
    { id: "q5", title: "Thu thập bộ sưu tập", desc: "Có 5 items khác nhau", type: "collect_all", target: 5, reward: { coins: 3000, xp: 300 }, trendItem: "t_lam_pham" },
    { id: "q6", title: "Doanh thu khủng", desc: "Kiếm 20000 coin trong 1 ngày", type: "daily_earn", target: 20000, reward: { coins: 5000, xp: 500 }, trendItem: "t_vua_cafe" },
    { id: "q7", title: "Master of Trade", desc: "Giao dịch 10 lần trên chợ", type: "trade", target: 10, reward: { coins: 4000, xp: 400 }, trendItem: "t_hoang_thu" },
    { id: "q8", title: "Hoàn toàn bộ sưu tập", desc: "Sở hữu tất cả items", type: "complete_all", target: TREND_ITEMS.length, reward: { coins: 20000, xp: 2000 }, trendItem: "t_omega" },
];

const UPGRADES = [
    { id: "u_staff1", name: "👨‍🍳 Thuê nhân viên", desc: "Tự động phục vụ 1 khách/phút", cost: 1000, type: "auto_serve", value: 1 },
    { id: "u_staff2", name: "👩‍🍳 Thêm nhân viên", desc: "Tự động phục vụ thêm 2 khách/phút", cost: 3000, type: "auto_serve", value: 2 },
    { id: "u_staff3", name: "👨‍🍳👩‍🍳 Đội bếp", desc: "Tự động phục vụ thêm 5 khách/phút", cost: 8000, type: "auto_serve", value: 5 },
    { id: "u_menu1", name: "📋 Mở rộng menu", desc: "Thêm 5 món mới vào menu", cost: 2000, type: "unlock_menu", value: 5 },
    { id: "u_deco1", name: "🪑 Bàn ghế mới", desc: "+10% doanh thu từ khách ngồi lại", cost: 1500, type: "revenue", value: 0.1 },
    { id: "u_deco2", name: "🎵 Nhạc nền", desc: "+5% doanh thu từ không khí", cost: 800, type: "revenue", value: 0.05 },
    { id: "u_sign1", name: "🪧 Bảng hiệu LED", desc: "+20% khách vãng lai", cost: 5000, type: "customers", value: 0.2 },
    { id: "u_wifi1", name: "📶 WiFi miễn phí", desc: "Khách ngồi lâu hơn, chi tiêu nhiều hơn (+10%)", cost: 1200, type: "revenue", value: 0.1 },
    { id: "u_aircon1", name: "❄️ Điều hòa", desc: "Khách thích ngồi lại hơn (+15% doanh thu)", cost: 3500, type: "revenue", value: 0.15 },
    { id: "u_parking1", name: "🅿️ Chỗ đỗ xe", desc: "+15% khách xa", cost: 4000, type: "customers", value: 0.15 },
];

// ============ GAME STATE ============

let gameState = {
    coins: 500,
    level: 1,
    xp: 0,
    xpNeeded: 100,
    currentLocation: "street",
    unlockedLocations: ["street"],
    ownedItems: {},        // { itemId: count }
    ownedRecipes: [],      // recipe IDs unlocked
    menuUnlocked: 0,       // how many menu items unlocked
    autoServeRate: 0,      // customers served per minute
    upgradesBought: [],
    questsCompleted: [],
    dailyRevenue: 0,
    totalRevenue: 0,
    totalServed: 0,
    tradesCount: 0,
    marketplace: [],       // { seller, itemId, price }
    decorations: [],       // placed decorations
    lastTick: Date.now(),
    lastTradeTick: Date.now(),
};

// ============ SAVE / LOAD ============

function saveGame() {
    localStorage.setItem("trendyCafeSave", JSON.stringify(gameState));
}

function loadGame() {
    const saved = localStorage.getItem("trendyCafeSave");
    if (saved) {
        const parsed = JSON.parse(saved);
        gameState = { ...gameState, ...parsed };
    }
}

// ============ CORE GAME ============

function init() {
    loadGame();
    setupEventListeners();
    renderAll();
    renderCafeScene();
    startGameLoop();
    updateTrendBanner();
}

function renderAll() {
    updateHeader();
    updateLocationBar();
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

function updateLocationBar() {
    const buttons = document.querySelectorAll(".loc-btn");
    buttons.forEach(btn => {
        const locKey = btn.dataset.loc;
        btn.disabled = !gameState.unlockedLocations.includes(locKey);
        btn.classList.toggle("active", gameState.currentLocation === locKey);
    });
}

function getRevenuePerMin() {
    const loc = LOCATIONS[gameState.currentLocation];
    let base = loc.customers * 30; // ~30k per customer
    let mult = loc.revenueMult;

    // Apply item effects
    for (const [itemId, count] of Object.entries(gameState.ownedItems)) {
        const item = TREND_ITEMS.find(i => i.id === itemId);
        if (item && item.effect === "revenue") {
            mult += item.value * count;
        }
    }

    // Apply upgrade effects
    for (const uId of gameState.upgradesBought) {
        const u = UPGRADES.find(x => x.id === uId);
        if (u && u.type === "revenue") {
            mult += u.value;
        }
    }

    return Math.floor(base * mult);
}

function getCustomerCount() {
    const loc = LOCATIONS[gameState.currentLocation];
    let base = loc.customers;

    for (const [itemId, count] of Object.entries(gameState.ownedItems)) {
        const item = TREND_ITEMS.find(i => i.id === itemId);
        if (item && item.effect === "customers") {
            base += item.value * count;
        }
    }

    for (const uId of gameState.upgradesBought) {
        const u = UPGRADES.find(x => x.id === uId);
        if (u && u.type === "customers") {
            base = Math.floor(base * (1 + u.value));
        }
    }

    return base;
}

function formatNumber(n) {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + "M";
    if (n >= 1000) return (n / 1000).toFixed(1) + "K";
    return n.toString();
}

// ============ CAFÉ SCENE ============

function renderCafeScene() {
    const bg = document.getElementById("cafe-bg");
    const container = document.getElementById("customers-container");

    bg.className = LOCATIONS[gameState.currentLocation].bgClass;
    container.innerHTML = "";

    const emojis = ["👨", "👩", "👦", "👧", "🧑", "👴", "👵", "🧒"];
    const count = getCustomerCount();

    for (let i = 0; i < Math.min(count, 20); i++) {
        const div = document.createElement("div");
        div.className = "customer";
        div.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        div.style.animationDelay = `${Math.random() * 2}s`;
        container.appendChild(div);
    }
}

// ============ ORDERS & MENU ============

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
            <div class="order-info">
                ${menuItem.icon} ${menuItem.name}
            </div>
            <div>
                <span class="order-price">${menuItem.price}₫</span>
                <button class="serve-btn" onclick="serveOrder('${menuItem.id}')">Phục vụ</button>
            </div>
        `;
        list.appendChild(div);
    }
}

function serveOrder(menuItemId) {
    const item = MENU_ITEMS.find(m => m.id === menuItemId);
    if (!item) return;

    // Apply recipe effects
    let price = item.price;
    let mult = 1;

    for (const [tid, count] of Object.entries(gameState.ownedItems)) {
        const tItem = TREND_ITEMS.find(t => t.id === tid);
        if (tItem && tItem.type === "recipe" && menuItemId.includes(tItem.id.split("_")[2] || "")) {
            // Check if recipe matches
            if (tItem.effect === "revenue" && (
                (tItem.id.includes("tea") && menuItemId.includes("tea")) ||
                (tItem.id.includes("coffee") && menuItemId.includes("coffee")) ||
                (tItem.id === "t_tu_hien") ||
                (tItem.id === "t_duc_phuong") ||
                (tItem.id === "t_chu_nhat")
            )) {
                mult += tItem.value * count;
            }
        }
        if (tItem && tItem.effect === "revenue" && (tItem.id === "t_lam_pham" && menuItemId.includes("signature"))) {
            mult += tItem.value;
        }
        if (tItem && tItem.effect === "revenue" && tItem.id === "t_hoang_thu" && menuItemId.includes("signature")) {
            mult += tItem.value;
        }
    }

    const earned = Math.floor(price * mult);
    gameState.coins += earned;
    gameState.dailyRevenue += earned;
    gameState.totalRevenue += earned;
    gameState.totalServed++;

    addXP(10);
    saveGame();
    renderAll();
}

function renderMenu() {
    const list = document.getElementById("menu-list");
    list.innerHTML = "";

    const unlocked = MENU_ITEMS.slice(0, gameState.menuUnlocked + 1);

    unlocked.forEach(item => {
        const div = document.createElement("div");
        div.className = "menu-item";
        div.innerHTML = `
            <span>${item.icon} ${item.name}</span>
            <span style="color:var(--gold)">${item.price}₫</span>
        `;
        list.appendChild(div);
    });
}

// ============ STATS ============

function renderStats() {
    document.getElementById("served-count").textContent = gameState.totalServed;
    document.getElementById("today-revenue").textContent = formatNumber(gameState.dailyRevenue);
    document.getElementById("total-items").textContent = Object.values(gameState.ownedItems).reduce((a, b) => a + b, 0);

    let rareCount = 0;
    for (const [tid, count] of Object.entries(gameState.ownedItems)) {
        const item = TREND_ITEMS.find(i => i.id === tid);
        if (item && (item.rarity === "rare" || item.rarity === "epic" || item.rarity === "legendary")) {
            rareCount += count;
        }
    }
    document.getElementById("rare-items").textContent = rareCount;
}

// ============ SHOP ============

function renderShop() {
    const list = document.getElementById("shop-menu-list");
    list.innerHTML = "";

    // Shop items (trend items available for purchase)
    const availableItems = TREND_ITEMS.filter(item => {
        if (gameState.ownedItems[item.id] && gameState.ownedItems[item.id] > 0) return false;
        return true;
    });

    if (availableItems.length === 0) {
        list.innerHTML = "<div style='padding:15px;text-align:center;color:var(--text-dim);'>Không có item mới! Hãy thử lại sau 🔥</div>";
        return;
    }

    availableItems.forEach(item => {
        const price = getTrendItemPrice(item);
        const div = document.createElement("div");
        div.className = "shop-item animate-fadeIn";
        div.innerHTML = `
            <div class="item-icon">${item.name.split(" ")[0]}</div>
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                <div class="item-desc">${item.desc}</div>
                <span class="item-rarity ${item.rarity}">${item.rarity.toUpperCase()}</span>
            </div>
            <div style="text-align:right">
                <div class="item-price">${formatNumber(price)}₫</div>
                <button class="buy-btn" onclick="buyTrendItem('${item.id}')">Mua</button>
            </div>
        `;
        list.appendChild(div);
    });
}

function getTrendItemPrice(item) {
    const basePrices = { common: 100, rare: 1000, epic: 5000, legendary: 25000 };
    return basePrices[item.rarity] || 500;
}

function buyTrendItem(itemId) {
    const item = TREND_ITEMS.find(t => t.id === itemId);
    if (!item) return;

    const price = getTrendItemPrice(item);
    if (gameState.coins < price) {
        showModal("❌ Không đủ tiền!", "Bạn cần thêm " + formatNumber(price - gameState.coins) + "₫");
        return;
    }

    gameState.coins -= price;
    gameState.ownedItems[itemId] = (gameState.ownedItems[itemId] || 0) + 1;

    // Check if it's a recipe
    if (item.type === "recipe") {
        if (!gameState.ownedRecipes.includes(itemId)) {
            gameState.ownedRecipes.push(itemId);
        }
    }

    addXP(25);
    saveGame();
    renderAll();
    showModal("🎉 Thành công!", `Bạn đã mua ${item.name}!`);
}

// ============ ITEMS COLLECTION ============

function renderItems(filter = "all") {
    const list = document.getElementById("items-list");
    list.innerHTML = "";

    const ownedEntries = Object.entries(gameState.ownedItems).filter(([_, count]) => count > 0);

    if (ownedEntries.length === 0) {
        list.innerHTML = "<div style='padding:15px;text-align:center;color:var(--text-dim);'>Chưa có item nào. Hãy mua từ shop! ☕</div>";
        return;
    }

    const rarityOrder = { legendary: 0, epic: 1, rare: 2, common: 3 };

    ownedEntries.sort((a, b) => {
        const itemA = TREND_ITEMS.find(t => t.id === a[0]);
        const itemB = TREND_ITEMS.find(t => t.id === b[0]);
        return (rarityOrder[itemA?.rarity] || 4) - (rarityOrder[itemB?.rarity] || 4);
    });

    ownedEntries.forEach(([itemId, count]) => {
        const item = TREND_ITEMS.find(t => t.id === itemId);
        if (!item) return;
        if (filter !== "all" && item.type !== filter) return;

        const div = document.createElement("div");
        div.className = `item-card ${item.rarity} animate-fadeIn`;
        div.innerHTML = `
            <div class="item-emoji">${item.name.split(" ")[0]}</div>
            <div class="item-info">
                <div class="item-name">${item.name} x${count}</div>
                <span class="item-rarity ${item.rarity}">${item.rarity}</span>
                <div style="font-size:11px;color:var(--text-dim);margin-top:3px;">${item.desc}</div>
            </div>
            <button class="buy-btn" onclick="showModal('${item.name}', '${item.desc}<br><br>Type: ${item.type}<br>Rarity: ${item.rarity}')" style="background:var(--primary-light);font-size:10px;">Chi tiết</button>
        `;
        list.appendChild(div);
    });
}

// ============ MARKETPLACE ============

function renderMarket(tab = "buy") {
    const list = document.getElementById("market-list");
    list.innerHTML = "";

    if (tab === "buy") {
        // Generate some market items
        if (gameState.marketplace.length === 0) {
            // Generate fake market items
            const sellers = ["User123", "CoffeeKing", "BaristaVN", "TrendyCafe", "MemeLover"];
            const availableItems = TREND_ITEMS.slice(0, 12);
            availableItems.forEach(item => {
                const seller = sellers[Math.floor(Math.random() * sellers.length)];
                const price = getTrendItemPrice(item) + Math.floor(Math.random() * 500);
                gameState.marketplace.push({ seller, itemId: item.id, price });
            });
        }

        gameState.marketplace.forEach((listing, idx) => {
            const item = TREND_ITEMS.find(t => t.id === listing.itemId);
            if (!item) return;

            const div = document.createElement("div");
            div.className = "market-item animate-fadeIn";
            div.innerHTML = `
                <div>
                    <div style="font-weight:bold">${item.name}</div>
                    <div class="seller">Bởi ${listing.seller}</div>
                    <span class="item-rarity ${item.rarity}">${item.rarity}</span>
                </div>
                <div style="text-align:right">
                    <div style="color:var(--gold);font-weight:bold">${formatNumber(listing.price)}₫</div>
                    <button class="buy-btn" onclick="buyFromMarket(${idx})">Mua</button>
                </div>
            `;
            list.appendChild(div);
        });
    } else if (tab === "sell") {
        list.innerHTML = "<div style='padding:15px;color:var(--text-dim);'>Chức năng bán items đang phát triển 🚧</div>";
    } else if (tab === "list") {
        list.innerHTML = "<div style='padding:15px;color:var(--text-dim);'>Chức năng đăng bán items đang phát triển 🚧</div>";
    }
}

function buyFromMarket(idx) {
    const listing = gameState.marketplace[idx];
    if (!listing) return;

    const item = TREND_ITEMS.find(t => t.id === listing.itemId);
    if (gameState.coins < listing.price) {
        showModal("❌ Không đủ tiền!", "Cần thêm " + formatNumber(listing.price - gameState.coins) + "₫");
        return;
    }

    gameState.coins -= listing.price;
    gameState.ownedItems[listing.itemId] = (gameState.ownedItems[listing.itemId] || 0) + 1;
    gameState.tradesCount++;

    if (item.type === "recipe" && !gameState.ownedRecipes.includes(listing.itemId)) {
        gameState.ownedRecipes.push(listing.itemId);
    }

    gameState.marketplace.splice(idx, 1);

    addXP(30);
    saveGame();
    renderAll();
    showModal("🎉 Mua thành công!", `Bạn đã mua ${item.name}!`);
}

// ============ QUESTS ============

function renderQuests() {
    const list = document.getElementById("quests-list");
    const banner = document.getElementById("quest-trend-banner");
    list.innerHTML = "";

    // Show current trend
    const trend = document.getElementById("trend-text");
    banner.textContent = `🔥 TREND: ${trend.textContent}`;

    QUESTS.forEach(quest => {
        const completed = gameState.questsCompleted.includes(quest.id);
        const progress = getQuestProgress(quest);
        const pct = Math.min(100, (progress / quest.target) * 100);

        const div = document.createElement("div");
        div.className = `quest-item ${completed ? "animate-pop" : "animate-fadeIn"}`;
        div.innerHTML = `
            <div class="quest-title">${completed ? "✅" : "📜"} ${quest.title}</div>
            <div class="quest-desc">${quest.desc}</div>
            <div class="quest-reward">🎁 ${quest.reward.coins} coin, ${quest.reward.xp} XP</div>
            <div class="quest-progress">
                <div class="quest-progress-bar" style="width:${pct}%"></div>
            </div>
            <div style="font-size:11px;color:var(--text-dim);margin-top:4px;">
                ${progress}/${quest.target} ${completed ? "✓" : ""}
            </div>
            ${!completed && pct >= 100 ? `<button class="complete-quest" onclick="completeQuest('${quest.id}')">Nhận quà</button>` : ""}
        `;
        list.appendChild(div);
    });
}

function getQuestProgress(quest) {
    switch (quest.type) {
        case "serve": return gameState.totalServed;
        case "collect": return Object.values(gameState.ownedItems).reduce((a, b) => a + b, 0);
        case "earn": return gameState.totalRevenue;
        case "upgrade": return gameState.upgradesBought.length;
        case "collect_all": return Object.keys(gameState.ownedItems).filter(k => gameState.ownedItems[k] > 0).length;
        case "daily_earn": return gameState.dailyRevenue;
        case "trade": return gameState.tradesCount;
        case "complete_all": return Object.keys(gameState.ownedItems).filter(k => gameState.ownedItems[k] > 0).length;
        default: return 0;
    }
}

function completeQuest(questId) {
    const quest = QUESTS.find(q => q.id === questId);
    if (!quest || gameState.questsCompleted.includes(questId)) return;

    gameState.questsCompleted.push(questId);
    gameState.coins += quest.reward.coins;
    addXP(quest.reward.xp);

    if (quest.trendItem) {
        gameState.ownedItems[quest.trendItem] = (gameState.ownedItems[quest.trendItem] || 0) + 1;
        if (quest.trendItem.includes("recipe")) {
            if (!gameState.ownedRecipes.includes(quest.trendItem)) {
                gameState.ownedRecipes.push(quest.trendItem);
            }
        }
    }

    saveGame();
    renderAll();
    showModal("🎉 Quest hoàn thành!", `+${quest.reward.coins} coin, +${quest.reward.xp} XP${quest.trendItem ? ', +1 ' + TREND_ITEMS.find(t => t.id === quest.trendItem)?.name : ''}`);
}

// ============ UPGRADES ============

function renderUpgrades() {
    const list = document.getElementById("upgrades-list");
    list.innerHTML = "";

    UPGRADES.forEach(upgrade => {
        const owned = gameState.upgradesBought.includes(upgrade.id);
        const loc = LOCATIONS[gameState.currentLocation];

        // Check location unlock requirement
        if (upgrade.cost > 5000 && !gameState.unlockedLocations.includes("mall")) {
            return; // Don't show high-cost upgrades until mall unlocked
        }

        const div = document.createElement("div");
        div.className = "upgrade-item animate-fadeIn";
        div.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${upgrade.name}</div>
                <div class="upgrade-desc">${upgrade.desc}</div>
                <div class="upgrade-cost">${formatNumber(upgrade.cost)}₫ ${owned ? "✓" : ""}</div>
            </div>
            ${owned ? '<span style="color:#4CAF50">Đã mua</span>' : `<button class="upgrade-btn" onclick="buyUpgrade('${upgrade.id}')">Mua</button>`}
        `;
        list.appendChild(div);
    });
}

function buyUpgrade(upgradeId) {
    const upgrade = UPGRADES.find(u => u.id === upgradeId);
    if (!upgrade || gameState.upgradesBought.includes(upgradeId)) return;

    if (gameState.coins < upgrade.cost) {
        showModal("❌ Không đủ tiền!", `Cần thêm ${formatNumber(upgrade.cost - gameState.coins)}₫`);
        return;
    }

    gameState.coins -= upgrade.cost;
    gameState.upgradesBought.push(upgradeId);

    if (upgrade.type === "auto_serve") {
        gameState.autoServeRate += upgrade.value;
    }
    if (upgrade.type === "unlock_menu") {
        gameState.menuUnlocked += upgrade.value;
    }

    addXP(50);
    saveGame();
    renderAll();
    showModal("🎉 Nâng cấp thành công!", upgrade.name + " đã được kích hoạt!");
}

// ============ LOCATION ============

function changeLocation(locKey) {
    if (!gameState.unlockedLocations.includes(locKey)) return;

    gameState.currentLocation = locKey;
    saveGame();
    renderAll();
}

function unlockLocation(locKey) {
    if (gameState.unlockedLocations.includes(locKey)) return;

    const loc = LOCATIONS[locKey];
    if (gameState.coins < loc.cost) {
        showModal("❌ Không đủ tiền!", `Cần ${formatNumber(loc.cost)}₫ để mở ${loc.name}`);
        return;
    }

    gameState.coins -= loc.cost;
    gameState.unlockedLocations.push(locKey);
    gameState.currentLocation = locKey;

    addXP(100);
    saveGame();
    renderAll();
    showModal("🎉 Mở quán mới!", `Quán ${loc.name} đã sẵn sàng!`);
}

// ============ XP & LEVEL ============

function addXP(amount) {
    gameState.xp += amount;
    while (gameState.xp >= gameState.xpNeeded) {
        gameState.xp -= gameState.xpNeeded;
        gameState.level++;
        gameState.xpNeeded = Math.floor(gameState.xpNeeded * 1.5);

        // Auto unlock locations at certain levels
        if (gameState.level >= 3 && !gameState.unlockedLocations.includes("mall")) {
            gameState.unlockedLocations.push("mall");
        }
        if (gameState.level >= 5 && !gameState.unlockedLocations.includes("garden")) {
            gameState.unlockedLocations.push("garden");
        }
        if (gameState.level >= 8 && !gameState.unlockedLocations.includes("rooftop")) {
            gameState.unlockedLocations.push("rooftop");
        }
        if (gameState.level >= 12 && !gameState.unlockedLocations.includes("festival")) {
            gameState.unlockedLocations.push("festival");
        }

        showModal("🎊 Lên level!", `Chúc mừng! Bạn đã lên level ${gameState.level}!`);
    }
}

// ============ TREND BANNER ============

function updateTrendBanner() {
    const trends = [
        "🐶 Meme Chó Vàng — hot nhất!",
        "⚽ MU thắng! Fan uống cà phê!",
        "🎵 Nhạc viral TikTok",
        "📱 iPhone 17 ra mắt",
        "🎬 Marvel Season 5",
        "🐱 Năm con Mèo",
        "🏐 World Cup 2026",
        "🎮 Game hot tuần này",
        "🍕 Pizza trend khắp nơi",
        "🌶️ Hotpot challenge",
        "🎪 Festival mùa hè",
        "💎 Crypto bull run",
        "🎤 Concert K-pop",
        "🌸 Mùa hoa anh đào",
        "🐕 Thú cưng viral",
    ];

    const el = document.getElementById("trend-text");
    let idx = 0;
    setInterval(() => {
        idx = (idx + 1) % trends.length;
        el.textContent = trends[idx];
    }, 5000);
    el.textContent = trends[0];
}

// ============ GAME LOOP ============

function startGameLoop() {
    // Auto-serve customers
    setInterval(() => {
        if (gameState.autoServeRate > 0) {
            const served = Math.min(gameState.autoServeRate, getCustomerCount());
            if (served > 0) {
                const loc = LOCATIONS[gameState.currentLocation];
                const revenue = Math.floor(served * 30 * loc.revenueMult);
                gameState.coins += revenue;
                gameState.dailyRevenue += revenue;
                gameState.totalRevenue += revenue;
                gameState.totalServed += served;
                addXP(served * 5);
                saveGame();
                renderAll();
            }
        }
    }, 60000); // Every minute

    // Save game every 30 seconds
    setInterval(() => {
        saveGame();
    }, 30000);

    // Refresh market every 5 minutes
    setInterval(() => {
        if (gameState.marketplace.length < 3) {
            const sellers = ["User" + Math.floor(Math.random() * 999), "CoffeeFan", "BaristaPro", "TrendHunter"];
            const item = TREND_ITEMS[Math.floor(Math.random() * TREND_ITEMS.length)];
            const price = getTrendItemPrice(item) + Math.floor(Math.random() * 1000);
            gameState.marketplace.push({ seller: sellers[Math.floor(Math.random() * sellers.length)], itemId: item.id, price });
            renderMarket();
        }
    }, 300000);

    // Random new customers
    setInterval(() => {
        renderCafeScene();
    }, 10000);
}

// ============ MODAL ============

function showModal(title, body) {
    document.getElementById("modal-title").textContent = title;
    document.getElementById("modal-body").innerHTML = body;
    document.getElementById("modal-overlay").classList.remove("hidden");
    setTimeout(() => {
        document.getElementById("modal-overlay").classList.add("hidden");
    }, 3000);
}

// ============ EVENT LISTENERS ============

function setupEventListeners() {
    // Location buttons
    document.querySelectorAll(".loc-btn").forEach(btn => {
        btn.addEventListener("click", () => changeLocation(btn.dataset.loc));
    });

    // Nav buttons
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");

            document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
            document.getElementById(btn.dataset.tab + "-panel").classList.add("active");
        });
    });

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderItems(btn.dataset.filter);
        });
    });

    // Market tabs
    document.querySelectorAll(".market-tab").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".market-tab").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderMarket(btn.dataset.marketTab);
        });
    });

    // Modal close
    document.getElementById("modal-close").addEventListener("click", () => {
        document.getElementById("modal-overlay").classList.add("hidden");
    });
}

// ============ START GAME ============
document.addEventListener("DOMContentLoaded", init);

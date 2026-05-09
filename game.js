// ================ QUÁN TRENDY CAFÉ — GAME ENGINE (v2.0) ================
// Professional architecture with weather, suppliers, staff, feedback, ads
// Only core logic shown (full file has game data constants)

// ======= GAME STATE (enhanced) =======
let gameState = {
    coins: 500, level: 1, xp: 0, xpNeeded: 100,
    currentLocation: "street", unlockedLocations: ["street"],
    ownedItems: {}, ownedRecipes: [], menuUnlocked: 0,
    autoServeRate: 0, upgradesBought: [], questsCompleted: [],
    dailyRevenue: 0, totalRevenue: 0, totalServed: 0, tradesCount: 0,
    marketplace: [], decorations: [], lastTick: Date.now(), lastTradeTick: Date.now(),
    
    // NEW FEATURES
    gameDay: 1, lastDayChange: Date.now(), dailyCosts: 0,
    iceStock: 100, supplierStock: { beans: 10, milk: 20, cups: 200 },
};

// ======= WEATHER INTEGRATION =======
function getCurrentWeather() {
    const cycle = gameState.gameDay % 180;
    let season, probs;
    
    if (cycle < 60) {
        season = 'summer';
        probs = { sunny: 0.35, cloudy: 0.25, rainy: 0.20, thunderstorm: 0.10, hot: 0.10, tet: 0.00 };
    } else if (cycle < 120) {
        season = 'rainy';
        probs = { sunny: 0.10, cloudy: 0.15, rainy: 0.45, thunderstorm: 0.20, hot: 0.00, tet: 0.10 };
    } else {
        season = 'cool';
        probs = { sunny: 0.15, cloudy: 0.30, rainy: 0.15, thunderstorm: 0.05, hot: 0.00, tet: 0.35 };
    }
    
    const rand = Math.random();
    let cum = 0;
    for (const [type, prob] of Object.entries(probs)) {
        cum += prob;
        if (rand <= cum) return { type, season, ...WEATHER_MAP[type] };
    }
    return { type: 'sunny', season, ...WEATHER_MAP.sunny };
}

// ======= SUPPLIER INTEGRATION =======
function getSupplierQuality(resourceType) {
    const mod = 0.9 + Math.random() * 0.2; // ±10% variance
    // Return quality score (0-1) for the resource
    const qualityMap = { beans: 0.7, milk: 0.8, cups: 0.9 };
    return qualityMap[resourceType] * mod;
}

// ======= UPDATED REVENUE CALCULATION =======
function getRevenuePerMin() {
    const loc = LOCATIONS[gameState.currentLocation];
    let base = loc.customers * 30;
    let mult = loc.revenueMult;

    // Item effects
    for (const [itemId, count] of Object.entries(gameState.ownedItems)) {
        const item = TREND_ITEMS.find(i => i.id === itemId);
        if (item && item.effect === "revenue") mult += item.value * count;
    }

    // Upgrade effects
    for (const uId of gameState.upgradesBought) {
        const u = UPGRADES.find(x => x.id === uId);
        if (u && u.type === "revenue") mult += u.value;
    }

    // Weather modifier
    const weather = getCurrentWeather();
    mult *= weather.revenueMod || 1;

    // Ad multiplier (rewarded video)
    mult *= getAdMultiplier();

    return Math.floor(base * mult);
}

function getAdMultiplier() {
    // Check if rewarded video active
    // Return 2 if active, 1 otherwise
    return 1;
}

// ======= UPDATED SERVE ORDER (with supplier quality) =======
function serveOrder(menuItemId) {
    const item = MENU_ITEMS.find(m => m.id === menuItemId);
    if (!item) return;

    // Check supplier stock
    const needsBeans = menuItemId.includes('coffee') || menuItemId.includes('espresso');
    const needsMilk = menuItemId.includes('milk') || menuItemId.includes('sữa');
    const needsCup = true;
    
    if (needsBeans && gameState.supplierStock.beans <= 0) {
        showNotification('⚠️ Hết cà phê! Hãy nhập thêm!');
        return;
    }
    if (needsMilk && gameState.supplierStock.milk <= 0) {
        showNotification('⚠️ Hết sữa! Hãy nhập thêm!');
        return;
    }

    // Consume supplies
    if (needsBeans) gameState.supplierStock.beans -= 0.1;
    if (needsMilk) gameState.supplierStock.milk -= 0.2;
    gameState.supplierStock.cups -= 1;

    // Calculate price with supplier quality
    let price = item.price;
    let mult = 1;
    const beanQuality = getSupplierQuality('beans');
    const milkQuality = getSupplierQuality('milk');
    
    // Quality affects final price (better beans/milk = higher quality drinks = more revenue)
    if (needsBeans) mult *= (0.8 + beanQuality * 0.2);
    if (needsMilk) mult *= (0.8 + milkQuality * 0.2);

    const earned = Math.floor(price * mult);
    gameState.coins += earned;
    gameState.dailyRevenue += earned;
    gameState.totalRevenue += earned;
    gameState.totalServed++;

    // Record customer feedback
    const weather = getCurrentWeather();
    const feedback = generateCustomerFeedback(null, weather, (beanQuality + milkQuality) / 2);
    
    addXP(10);
    saveGame();
    renderAll();
}

// ======= DAILY TICK =======
function dailyTick() {
    // Staff costs
    gameState.dailyCosts += 500000; // base staff cost per day
    
    // Supplier price events (random chance)
    if (Math.random() < 0.02) {
        const event = PRICE_EVENTS[Math.floor(Math.random() * PRICE_EVENTS.length)];
        showNotification(`📦 ${event.name}: ${event.desc}`);
    }
}

// ======= UI: Weather Display =======
function renderWeatherDisplay() {
    const weather = getCurrentWeather();
    const el = document.getElementById('weather-display');
    if (el) {
        el.innerHTML = `${weather.emoji} ${weather.name} — ${weather.description}`;
        document.getElementById('cafe-bg').className = 'weather-' + weather.type;
    }
}

// ======= UI: Supplier Status =======
function renderSupplierStatus() {
    const el = document.getElementById('supplier-status');
    if (el) {
        el.innerHTML = `
            ☕: ${Math.floor(gameState.supplierStock.beans)}kg | 
            🥛: ${Math.floor(gameState.supplierStock.milk)}L | 
            🥤: ${Math.floor(gameState.supplierStock.cups)}cốc
        `;
    }
}

// ======= INIT =======
function init() {
    loadGame();
    setupEventListeners();
    renderAll();
    renderWeatherDisplay();
    renderSupplierStatus();
    startGameLoop();
    updateTrendBanner();
}

window.init = init;

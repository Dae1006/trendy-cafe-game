/**
 * QUÁN TRENDY CAFÉ — REWRITTEN GAME ENGINE
 * 
 * New architecture: Class-based, modular, professional
 * New features: Weather, Suppliers, Staff, Feedback, Ads
 */

// ======= IMPORT SYSTEM (ES modules) =====
import { WEATHER_SYSTEM, generateWeather } from './weather.js';
import { SUPPLIER_SYSTEM, orderSupplies } from './suppliers.js';
import { STAFF_SYSTEM, generateStaffFeedback } from './staff.js';
import { FEEDBACK_SYSTEM } from './feedback.js';
import { AD_SYSTEM, showAd } from './ads.js';

// ======= DATA DEFINITIONS (unchanged) =====
const LOCATIONS = { /* ... same as before ... */ };
const MENU_ITEMS = { /* ... same as before ... */ };
const TREND_ITEMS = { /* ... same as before ... */ };
const QUESTS = { /* ... same as before ... */ };
const UPGRADES = { /* ... same as before ... */ };

// ======= NEW GAME STATE =====
let gameState = {
    coins: 500,
    level: 1,
    xp: 0,
    xpNeeded: 100,
    currentLocation: "street",
    unlockedLocations: ["street"],
    ownedItems: {},
    ownedRecipes: [],
    menuUnlocked: 0,
    autoServeRate: 0,
    upgradesBought: [],
    questsCompleted: [],
    dailyRevenue: 0,
    totalRevenue: 0,
    totalServed: 0,
    tradesCount: 0,
    marketplace: [],
    decorations: [],
    lastTick: Date.now(),
    lastTradeTick: Date.now(),
    
    // NEW: Game day tracking
    gameDay: 1,
    lastDayChange: Date.now(),
    dailyCosts: 0,
    iceStock: 100, // ice for hot drinks
    
    // NEW: Supplier stock
    supplierStock: { beans: 10, milk: 20, cups: 200 },
};

// ======= WEATHER UI RENDERING =====
function renderWeather() {
    const weatherEl = document.getElementById('weather-display');
    if (!weatherEl) return;
    
    const weather = generateWeather(gameState.gameDay);
    weatherEl.innerHTML = `
        <span>${weather.emoji} ${weather.name}</span>
        <span class="weather-tip">${weather.description}</span>
    `;
    
    // Update cafe background based on weather
    const bgClass = weather.getBgClass();
    document.getElementById('cafe-bg').className = bgClass;
}

// ======= SUPPLIER UI =====
function renderSuppliers() {
    const panel = document.getElementById('suppliers-panel');
    if (!panel) return;
    
    panel.innerHTML = `
        <h3>🏭 Nhà cung cấp</h3>
        <div class="supplier-section">
            <h4>☕ Cà phê</h4>
            ${SUPPLIER_ITEMS.beans.map(s => `
                <div class="supplier-item">
                    <span>${s.name}</span>
                    <span>${s.pricePerKg.toLocaleString()}₫/kg</span>
                    <span>Chất lượng: ${'⭐'.repeat(Math.round(s.quality * 5))}</span>
                    <button onclick="orderBeans('${s.id}')">Mua 5kg</button>
                </div>
            `).join('')}
        </div>
        <div class="supplier-section">
            <h4>🥛 Sữa</h4>
            ${SUPPLIER_ITEMS.milk.map(s => `
                <div class="supplier-item">
                    <span>${s.name}</span>
                    <span>${s.pricePerLiter.toLocaleString()}₫/lít</span>
                    <button onclick="orderMilk('${s.id}')">Mua 10 lít</button>
                </div>
            `).join('')}
        </div>
        <div class="supplier-section">
            <h4>🥤 Cốc</h4>
            ${SUPPLIER_ITEMS.cups.map(s => `
                <div class="supplier-item">
                    <span>${s.name}</span>
                    <span>${s.pricePer100.toLocaleString()}₫/100cốc</span>
                    <button onclick="orderCups('${s.id}')">Mua 100 cái</button>
                </div>
            `).join('')}
        </div>
    `;
}

// ======= STAFF UI =====
function renderStaff() {
    const panel = document.getElementById('staff-panel');
    if (!panel) return;
    
    const staff = STAFF_SYSTEM.getStaff();
    panel.innerHTML = `
        <h3>👨‍🍳 Nhân viên</h3>
        ${staff.map(s => `
            <div class="staff-card">
                <span>${s.emoji} ${s.name}</span>
                <div class="staff-stats">
                    <span>Tâm trạng: ${'❤️'.repeat(Math.round(s.mood / 20))}</span>
                    <span>Tốc độ: ${'⚡'.repeat(Math.round(s.brewSpeed * 5))}</span>
                    <span>Chất lượng: ${'⭐'.repeat(Math.round(s.quality * 5))}</span>
                </div>
                <div class="staff-actions">
                    <button onclick="trainStaff('${s.id}')">Đào tạo</button>
                    <button onclick="promoteStaff('${s.id}')">Nâng cấp</button>
                </div>
            </div>
        `).join('')}
        <button class="hire-btn" onclick="hireStaff()">📋 Thuê nhân viên mới</button>
    `;
}

// ======= FEEDBACK UI =====
function renderFeedback() {
    const panel = document.getElementById('feedback-panel');
    if (!panel) return;
    
    const feedback = FEEDBACK_SYSTEM.getRecentFeedbacks(5);
    const nps = FEEDBACK_SYSTEM.getNSPScore();
    const reputation = FEEDBACK_SYSTEM.getReputation();
    
    panel.innerHTML = `
        <h3>💬 Đánh giá khách hàng</h3>
        <div class="feedback-header">
            <span>NPS Score: ${nps > 0 ? '+' : ''}${nps}</span>
            <span>Uy tín: ${reputation}/100</span>
        </div>
        ${feedback.map(f => `
            <div class="feedback-item">
                <span>Taste: ${'⭐'.repeat(f.taste)}</span>
                <span>Service: ${'⭐'.repeat(f.service)}</span>
                <span>Ambiance: ${'⭐'.repeat(f.ambiance)}</span>
            </div>
        `).join('')}
    `;
}

// ======= AD UI =====
function renderAds() {
    const panel = document.getElementById('ads-panel');
    if (!panel) return;
    
    const stats = AD_SYSTEM.getStats();
    
    panel.innerHTML = `
        <h3>📺 Quảng cáo</h3>
        <div class="ad-stats">
            <span>Đã xem: ${stats.adsWatched} video</span>
            <span>Doanh thu: ${stats.estimatedRevenue}</span>
            <span>Active: ${stats.activeRewards}</span>
        </div>
        <div class="ad-rewards">
            ${AD_TYPES.rewarded_video.rewards.map(r => `
                <button onclick="watchAd('${r.id}')">
                    ${r.icon || '📺'} ${r.name}
                </button>
            `).join('')}
        </div>
    `;
}

// ======= UPDATED GAME LOOP =====
function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        
        // Weather update every game day
        if (now - gameState.lastDayChange > 60000) { // 1 minute = 1 game day
            gameState.gameDay++;
            gameState.lastDayChange = now;
            renderWeather();
            
            // Staff daily tick
            STAFF_SYSTEM.dailyTick();
            
            // Supplier price events
            const endedEvent = SUPPLIER_SYSTEM.tick();
            if (endedEvent) {
                showNotification(`📦 ${endedEvent.name} kết thúc!`);
            }
            
            // Daily costs
            const dailyWages = STAFF_SYSTEM.getTotalWages();
            gameState.dailyCosts = dailyWages;
        }
        
        // Ad system tick
        AD_SYSTEM.tick();
        
        // Interstitial ad check
        if (AD_SYSTEM.shouldShowInterstitial()) {
            showInterstitialAd();
        }
        
        renderAll();
    }, 1000);
}

// ======= MAIN INIT =====
function init() {
    loadGame();
    setupEventListeners();
    renderAll();
    renderWeather();
    renderSuppliers();
    renderStaff();
    renderFeedback();
    renderAds();
    startGameLoop();
}

// Make init global
window.init = init;

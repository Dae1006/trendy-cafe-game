// ============================================
// QUÁN TRENDY CAFÉ v2.0 — PIXEL ART EDITION
// Features: Weather, Suppliers, Staff, Feedback, Ads + Pixel Art
// ============================================

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
    { id: "coffee", name: "Cà phê đen", icon: "☕", price: 25, cost: 5, needsBeans: true, needsMilk: false, rarity: "common" },
    { id: "milk_coffee", name: "Cà phê sữa", icon: "🥛", price: 30, cost: 8, needsBeans: true, needsMilk: true, rarity: "common" },
    { id: "espresso", name: "Espresso", icon: "☕", price: 35, cost: 5, needsBeans: true, needsMilk: false, rarity: "common" },
    { id: "matcha", name: "Trà matcha", icon: "🍵", price: 40, cost: 10, needsBeans: false, needsMilk: false, rarity: "rare" },
    { id: "smoothie", name: "Sinh tố", icon: "🥤", price: 45, cost: 12, needsBeans: false, needsMilk: true, rarity: "rare" },
    { id: "cake", name: "Bánh mì", icon: "🥪", price: 35, cost: 8, needsBeans: false, needsMilk: false, rarity: "common" },
    { id: "ice_tea", name: "Trà đá", icon: "🧊", price: 15, cost: 3, needsBeans: false, needsMilk: false, rarity: "common" },
    { id: "bubble_tea", name: "Trà sữa", icon: "🧋", price: 50, cost: 12, needsBeans: false, needsMilk: true, rarity: "rare" },
    { id: "tropical", name: "Nước ép dừa", icon: "🥥", price: 55, cost: 15, needsBeans: false, needsMilk: true, rarity: "epic" },
    { id: "signature", name: "Signature Drink", icon: "🍸", price: 80, cost: 20, needsBeans: true, needsMilk: true, rarity: "legendary" },
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
    { id: "q1", title: "Ngày đầu khai trương", desc: "Phục vụ 10 khách hàng đầu tiên", type: "serve", target: 10, reward: { coins: 200, xp: 50 }, done: false, progress: 0 },
    { id: "q2", title: "Thu thập meme đầu tiên", desc: "Sở hữu 1 item trendy", type: "collect", target: 1, reward: { coins: 300, xp: 75 }, done: false, progress: 0 },
    { id: "q3", title: "Triệu phú cà phê", desc: "Kiếm 5000 coin từ bán đồ", type: "earn", target: 5000, reward: { coins: 1000, xp: 150 }, done: false, progress: 0 },
    { id: "q4", title: "Nâng cấp quán", desc: "Mở quán ở vị trí mới", type: "upgrade", target: 1, reward: { coins: 2000, xp: 200 }, done: false, progress: 0 },
    { id: "q5", title: "Thu thập bộ sưu tập", desc: "Có 5 items khác nhau", type: "collect_all", target: 5, reward: { coins: 3000, xp: 300 }, done: false, progress: 0 },
    { id: "q6", title: "Doanh thu khủng", desc: "Kiếm 20000 coin trong 1 ngày", type: "daily_earn", target: 20000, reward: { coins: 5000, xp: 500 }, done: false, progress: 0 },
    { id: "q7", title: "Master of Trade", desc: "Giao dịch 10 lần trên chợ", type: "trade", target: 10, reward: { coins: 4000, xp: 400 }, done: false, progress: 0 },
    { id: "q8", title: "Hoàn toàn bộ sưu tập", desc: "Sở hữu tất cả items", type: "complete_all", target: TREND_ITEMS.length, reward: { coins: 20000, xp: 2000 }, done: false, progress: 0 },
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

// ======= PIXEL ART CUSTOMER EMOJIS ======
const CUSTOMER_EMOJIS = [
    { emoji: "👨‍💻", name: "LapTOPner" },
    { emoji: "👩‍🎮", name: "GamER girl" },
    { emoji: "🧑‍🎨", name: "Pixel Artist" },
    { emoji: "👴", name: "Retro Gamer" },
    { emoji: "🤓", name: "Nerd Gamer" },
    { emoji: "😎", name: "Cool Customer" },
    { emoji: "🥳", name: "Party Guest" },
    { emoji: "👩‍🏫", name: "Teacher" },
    { emoji: "🧑‍🍳", name: "Foodie" },
    { emoji: "👨‍🎓", name: "Student" },
    { emoji: "🧔", name: "Bearded Guy" },
    { emoji: "👱‍♀️", name: "Blonde Girl" },
];

// ======= MOOD SYSTEM ======
const MOOD_TYPES = [
    { id: "happy", emoji: "😊", color: "#4CAF50", tipMult: 1.3, desc: "Hài lòng" },
    { id: "excited", emoji: "🤩", color: "#FF9800", tipMult: 1.5, desc: "Vui mừng" },
    { id: "neutral", emoji: "😐", color: "#9E9E9E", tipMult: 1.0, desc: "Bình thường" },
    { id: "impatient", emoji: "😤", color: "#FF5722", tipMult: 0.8, desc: "Khó chịu" },
    { id: "angry", emoji: "😡", color: "#F44336", tipMult: 0.5, desc: "Giận dữ" },
];

// ======= CUSTOMER AI SYSTEM ======
class CustomerAI {
    constructor(menuItem) {
        this.id = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        const charData = CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)];
        this.emoji = charData.emoji;
        this.name = charData.name;
        this.order = menuItem;
        // Mood starts neutral and degrades over time
        this.moodIndex = 2; // start neutral
        this.maxPatience = 15 + Math.random() * 30; // 15-45 seconds
        this.patienceLeft = this.maxPatience;
        this.wasServed = false;
        this.serveTime = 0;
        this.tipMult = 1.0;
        // Customer preferences
        const favorites = Math.random() > 0.6;
        this.favorites = favorites ? [menuItem.id] : [];
        // Arrival animation state
        this.arrived = false;
        this.arriveDelay = Math.random() * 2; // seconds before showing
    }
}

// Active customers pool
let activeCustomers = [];

function addCustomer(menuItem) {
    const customer = new CustomerAI(menuItem);
    activeCustomers.push(customer);
    return customer;
}

function updateCustomerAI(delta) {
    let moodChanged = false;

    // Remove served customers after a moment
    activeCustomers = activeCustomers.filter(c => {
        if (c.wasServed) {
            c.patienceLeft -= delta;
            return c.patienceLeft > 0;
        }
        return true;
    });

    // Update patience for all waiting customers
    for (const c of activeCustomers) {
        if (c.wasServed) continue;
        c.patienceLeft -= delta;

        // Recalculate mood based on patience remaining
        const patienceRatio = c.patienceLeft / c.maxPatience;
        let newMoodIndex = 2; // neutral

        if (patienceRatio > 0.7) {
            newMoodIndex = Math.random() > 0.5 ? 1 : 2; // excited or neutral
        } else if (patienceRatio > 0.4) {
            newMoodIndex = 2; // still neutral
        } else if (patienceRatio > 0.15) {
            newMoodIndex = 3; // impatient
        } else {
            newMoodIndex = 4; // angry
        }

        // Mood can only degrade, not improve (for waiting customers)
        if (newMoodIndex > c.moodIndex) {
            if (!moodChanged || newMoodIndex > MOOD_TYPES.length - 1) {
                c.moodIndex = newMoodIndex;
                moodChanged = true;
            }
        }
    }
}

// Get customer data for orders panel
function getActiveCustomerOrders() {
    const waiting = activeCustomers.filter(c => !c.wasServed);
    return waiting.slice(0, 8); // max 8 displayed
}

function formatPatienceBar(patienceLeft, maxPatience) {
    const ratio = Math.max(0, patienceLeft / maxPatience);
    let color;
    if (ratio > 0.6) color = '#4CAF50';
    else if (ratio > 0.3) color = '#FF9800';
    else color = '#F44336';

    return `<span style="color:${color};font-size:10px">⏳ ${Math.ceil(patienceLeft)}s</span>`;
}

function formatMoodEmoji(moodIndex) {
    const mood = MOOD_TYPES[moodIndex] || MOOD_TYPES[2];
    return `<span style="color:${mood.color}">${mood.emoji}</span>`;
}

// When serving, calculate tip based on customer mood
function getMoodTipMultiplier(moodIndex) {
    const mood = MOOD_TYPES[moodIndex] || MOOD_TYPES[2];
    return mood.tipMult;
}

// ======= PIXEL ART CAFÉ SCENE ======
class PixelArtCafeScene {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width || 480;
        this.height = this.canvas.height || 300;
        this.time = 0;
        this.particles = [];
        this.steamSources = [];
        this.animFrame = null;
        this.initParticles();
    }

    initParticles() {
        // Steam sources: espresso machine, counter area
        this.steamSources = [
            { x: 160, y: 210, vx: 0.3, vy: -0.5 },
            { x: 170, y: 200, vx: -0.2, vy: -0.4 },
            { x: 310, y: 215, vx: 0.2, vy: -0.3 },
        ];
    }

    addParticle(x, y) {
        if (this.particles.length > 60) return;
        this.particles.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 0.4 + (x < 240 ? 0.3 : -0.1),
            vy: -0.4 - Math.random() * 0.6,
            life: 1,
            size: 2 + Math.random() * 3,
        });
    }

    updateParticles(dt) {
        for (const p of this.steamSources) {
            if (Math.random() < 0.15) this.addParticle(p.x, p.y);
        }
        this.particles = this.particles.filter(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.life -= 0.018 * dt;
            if (p.type === 'sparkle') p.size *= 0.99;
            return p.life > 0;
        });
    }

    drawParticles(ctx) {
        for (const p of this.particles) {
            const alpha = p.life * 0.35;
            ctx.fillStyle = `rgba(200, 210, 230, ${alpha})`;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    drawBuilding(ctx, x, y, w, h, weatherType) {
        // Building body with pixel-art style
        const buildGrad = ctx.createLinearGradient(x, y, x + w, y + h);
        if (weatherType === 'rainy' || weatherType === 'thunderstorm') {
            buildGrad.addColorStop(0, '#3a3028');
            buildGrad.addColorStop(1, '#504535');
        } else {
            buildGrad.addColorStop(0, '#6b5240');
            buildGrad.addColorStop(0.5, '#7d6450');
            buildGrad.addColorStop(1, '#6b5240');
        }

        // Main building shape (pixel-style with flat edges)
        ctx.fillStyle = buildGrad;
        ctx.fillRect(x + 5, y + 30, w - 10, h - 30);

        // Roof
        ctx.fillStyle = '#4a3728';
        ctx.beginPath();
        ctx.moveTo(x, y + 30);
        ctx.lineTo(x + w / 2, y - 5);
        ctx.lineTo(x + w, y + 30);
        ctx.closePath();
        ctx.fill();

        // Roof outline
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Building outline (pixel style: thick borders)
        ctx.strokeStyle = '#5a4530';
        ctx.lineWidth = 2;
        ctx.strokeRect(x + 5, y + 30, w - 10, h - 30);

        return { x, y, w, h };
    }

    drawWindows(ctx, cx, cy, cw, ch) {
        const winW = 35;
        const winH = 45;
        const spacing = 15;
        const startX = cx + (cw - (3 * winW + 2 * spacing)) / 2;

        for (let i = 0; i < 3; i++) {
            const wx = startX + i * (winW + spacing);
            const wy = cy + 50;

            // Window frame (pixel style)
            ctx.fillStyle = '#2a1f15';
            ctx.fillRect(wx - 3, wy - 3, winW + 6, winH + 6);

            // Window glow based on customer count
            const customerCount = activeCustomers.filter(c => !c.wasServed).length;
            const glowIntensity = Math.min(1, 0.2 + (customerCount / 10) * 0.8);

            ctx.fillStyle = `rgba(255, ${Math.floor(200 * glowIntensity)}, ${Math.floor(80 * glowIntensity)}, ${glowIntensity})`;
            ctx.fillRect(wx, wy, winW, winH);

            // Window cross (pixel bars)
            ctx.strokeStyle = '#5a4530';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(wx + winW / 2, wy);
            ctx.lineTo(wx + winW / 2, wy + winH);
            ctx.moveTo(wx, wy + winH / 2);
            ctx.lineTo(wx + winW, wy + winH / 2);
            ctx.stroke();
        }
    }

    drawDoor(ctx, cx, cy, cw, ch) {
        const doorW = 36;
        const doorH = 55;
        const dx = cx + cw / 2 - doorW / 2;
        const dy = cy + ch - doorH - 5;

        // Door body
        ctx.fillStyle = '#5a3a1a';
        ctx.fillRect(dx, dy, doorW, doorH);
        ctx.strokeStyle = '#8B7355';
        ctx.lineWidth = 2;
        ctx.strokeRect(dx, dy, doorW, doorH);

        // Door handle (pixel circle)
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(dx + doorW - 8, dy + doorH / 2, 3, 0, Math.PI * 2);
        ctx.fill();

        // Door light (flickering)
        const flicker = 0.5 + Math.sin(this.time * 0.004) * 0.15;
        ctx.fillStyle = `rgba(255, 200, 80, ${flicker})`;
        ctx.beginPath();
        ctx.arc(dx + doorW / 2, dy + doorH / 2, 15 + Math.sin(this.time * 0.003) * 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawSign(ctx, cx, cy, cw, venueName) {
        const signY = cy + 28;
        // Sign board
        ctx.fillStyle = '#1a1a2e';
        ctx.fillRect(cx + cw / 2 - 70, signY - 8, 140, 28);
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx + cw / 2 - 70, signY - 8, 140, 28);

        // Neon text effect
        const glowAlpha = 0.6 + Math.sin(this.time * 0.005) * 0.2;
        ctx.shadowColor = '#FFD700';
        ctx.shadowBlur = 8;
        ctx.fillStyle = `rgba(255, 215, 0, ${glowAlpha})`;
        ctx.font = 'bold 13px Courier New';
        ctx.textAlign = 'center';
        ctx.fillText('☕ ' + venueName, cx + cw / 2, signY + 10);
        ctx.shadowBlur = 0;
    }

    drawCounter(ctx, cx, cy, cw, ch) {
        const counterY = cy + ch - 35;
        // Counter
        ctx.fillStyle = '#8B6914';
        ctx.fillRect(cx - 20, counterY, cw + 40, 18);
        ctx.strokeStyle = '#A07828';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - 20, counterY, cw + 40, 18);

        // Espresso machine on counter
        const esx = cx + cw / 2 - 30;
        ctx.fillStyle = '#4a4a4a';
        ctx.fillRect(esx, counterY - 25, 22, 25);
        ctx.fillStyle = '#666';
        ctx.fillRect(esx + 8, counterY - 32, 6, 8); // spout

        // Machine indicator light
        const blink = Math.sin(this.time * 0.01) > 0;
        ctx.fillStyle = blink ? '#FF4500' : '#8B0000';
        ctx.beginPath();
        ctx.arc(esx + 11, counterY - 12, 3, 0, Math.PI * 2);
        ctx.fill();
    }

    drawCustomers(ctx, cafeState, cw) {
        const customers = activeCustomers.filter(c => !c.wasServed);
        const baseY = cafeState.y + cafeState.h - 5;

        for (let i = 0; i < Math.min(customers.length, 8); i++) {
            const c = customers[i];
            const seatX = cafeState.x + 30 + i * ((cafeState.w - 60) / Math.max(1, Math.min(customers.length, 8) - 1));
            const bob = Math.sin(this.time * 0.004 + i * 1.2) * 1.5;

            // Draw customer emoji
            ctx.font = '16px serif';
            ctx.textAlign = 'center';
            ctx.fillText(c.emoji, seatX, baseY - 8 + bob);

            // Mood bubble (appears when impatient or angry)
            if (c.moodIndex >= 3) {
                const bubbleY = baseY - 28 + bob;
                ctx.fillStyle = 'rgba(0,0,0,0.6)';
                ctx.beginPath();
                ctx.arc(seatX, bubbleY, 10, 0, Math.PI * 2);
                ctx.fill();
                ctx.font = '10px serif';
                ctx.fillText(MOOD_TYPES[c.moodIndex].emoji, seatX, bubbleY + 4);
            }

            // Patience bar under customer (only when impatient)
            if (c.moodIndex >= 3) {
                const barW = 20;
                const ratio = c.patienceLeft / c.maxPatience;
                let color;
                if (ratio > 0.4) color = '#FF9800';
                else color = '#F44336';

                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillRect(seatX - barW / 2, baseY + 12, barW, 4);
                ctx.fillStyle = color;
                ctx.fillRect(seatX - barW / 2, baseY + 12, barW * ratio, 4);
            }
        }

        // Walking customer arriving (animated entrance)
        const walkProgress = (this.time * 0.03) % (cafeState.x + cw + 60);
        const walkX = Math.max(-20, cafeState.x - 50 + walkProgress);
        ctx.font = '14px serif';
        ctx.fillText('🚶', walkX, baseY);
    }

    drawWaiters(ctx, cafeState) {
        const waiterCount = gameState.autoServeRate > 0 ? Math.min(gameState.autoServeRate + 1, 3) : 0;
        for (let i = 0; i < waiterCount; i++) {
            const walkOffset = Math.sin(this.time * 0.002 + i * 2.5) * (cafeState.w / 3);
            const wx = cafeState.x + cafeState.w / 2 + walkOffset;
            const wy = cafeState.y + cafeState.h - 10;

            ctx.font = '16px serif';
            // Waiter carries tray
            ctx.fillText('🧑‍🍳', wx, wy);
        }
    }

    drawWeatherEffects(ctx) {
        const weather = getCurrentWeather();
        if (weather.type === 'rainy' || weather.type === 'thunderstorm') {
            ctx.strokeStyle = weather.type === 'thunderstorm'
                ? 'rgba(150, 180, 255, 0.4)'
                : 'rgba(150, 180, 255, 0.25)';
            ctx.lineWidth = 1;
            const count = weather.type === 'thunderstorm' ? 60 : 35;
            for (let i = 0; i < count; i++) {
                const x = (i * 8 + this.time * 0.08) % this.width;
                const y = (i * 11 + this.time * 0.25) % this.height;
                ctx.beginPath();
                ctx.moveTo(x, y);
                ctx.lineTo(x - 3, y + 12);
                ctx.stroke();
            }
        }

        // Thunder flash
        if (weather.type === 'thunderstorm' && Math.sin(this.time * 0.007) > 0.97) {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // Hot shimmer
        if (weather.type === 'hot') {
            const shimmer = Math.sin(this.time * 0.003) * 0.05;
            ctx.fillStyle = `rgba(255, 140, 0, ${shimmer})`;
            ctx.fillRect(0, 0, this.width, this.height);
        }

        // Tet sparkles
        if (weather.type === 'tet') {
            for (let i = 0; i < 8; i++) {
                const sx = (this.time * 0.1 + i * 70) % this.width;
                const sy = 20 + Math.sin(this.time * 0.005 + i) * 30;
                ctx.fillStyle = `rgba(255, 215, 0, ${0.4 + Math.sin(this.time * 0.01 + i) * 0.3})`;
                ctx.font = '10px serif';
                ctx.fillText('🎊', sx, sy);
            }
        }
    }

    drawGround(ctx, cafeState) {
        const groundY = cafeState.y + cafeState.h;
        // Ground line with pixels
        ctx.fillStyle = '#5a5040';
        ctx.fillRect(cafeState.x - 10, groundY, cafeState.w + 20, 8);

        // Sidewalk tiles
        ctx.strokeStyle = '#6a6050';
        ctx.lineWidth = 0.5;
        for (let i = 0; i < Math.floor(cafeState.w / 20); i++) {
            const tx = cafeState.x + i * 20;
            ctx.strokeRect(tx, groundY, 20, 8);
        }
    }

    drawInfo(ctx) {
        const weather = getCurrentWeather();
        const customerCount = activeCustomers.filter(c => !c.wasServed).length;

        ctx.fillStyle = 'rgba(0,0,0,0.75)';
        ctx.fillRect(10, this.height - 32, 220, 28);

        ctx.fillStyle = '#ddd';
        ctx.font = '11px Courier New';
        ctx.textAlign = 'left';
        ctx.fillText(`👥 ${customerCount} khách`, 16, this.height - 14);
        ctx.fillText(`${weather.emoji} ${weather.name}`, 130, this.height - 14);

        // Day counter
        ctx.fillStyle = '#FFD700';
        ctx.textAlign = 'right';
        ctx.fillText(`Ngày ${gameState.gameDay}`, this.width - 16, this.height - 14);
    }

    draw(ctx) {
        const w = this.width;
        const h = this.height;

        // Clear & draw sky gradient
        const weather = getCurrentWeather();
        const weatherColors = {
            sunny: ['#87CEEB', '#E8D5A0'],
            cloudy: ['#708090', '#B0BEC5'],
            rainy: ['#4a4a5a', '#6a6a7a'],
            thunderstorm: ['#2a2a3a', '#1a1a2a'],
            hot: ['#FF4500', '#FF8C00'],
            tet: ['#DC143C', '#FFD700'],
        };
        const colors = weatherColors[weather.type] || weatherColors.sunny;
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, colors[0]);
        grad.addColorStop(1, colors[1]);
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Draw building
        const cafeX = 50;
        const cafeY = 30;
        const cafeW = w - 100;
        const cafeH = h - 60;

        const state = this.drawBuilding(ctx, cafeX, cafeY, cafeW, cafeH, weather.type);
        this.drawWindows(ctx, cafeX, cafeY, cafeW, cafeH);
        this.drawDoor(ctx, cafeX, cafeY, cafeW, cafeH);
        this.drawSign(ctx, cafeX, cafeY, cafeW, LOCATIONS[gameState.currentLocation]?.name || 'Street');
        this.drawCounter(ctx, w / 2, cafeY + 30, cafeW, cafeH);
        this.drawGround(ctx, state);

        // Weather effects
        this.drawWeatherEffects(ctx);

        // Update & draw particles (steam)
        this.updateParticles(16);
        this.drawParticles(ctx);

        // Draw people
        this.drawCustomers(ctx, state, cafeW);
        this.drawWaiters(ctx, state);

        // Info overlay
        this.drawInfo(ctx);
    }

    loop() {
        this.time = Date.now() - this.startTime;
        this.draw();
        this.animFrame = requestAnimationFrame(() => this.loop());
    }

    start() {
        this.startTime = Date.now();
        this.loop();
    }
}

// Instance reference
let cafeSceneInstance = null;

// ======= GAME STATE ======
let gameState = {
    coins: 500, level: 1, xp: 0, xpNeeded: 100,
    currentLocation: "street", unlockedLocations: ["street"],
    ownedItems: {}, ownedRecipes: [], menuUnlocked: 1,
    autoServeRate: 0, upgradesBought: [], questsCompleted: [],
    dailyRevenue: 0, totalRevenue: 0, totalServed: 0, tradesCount: 0,
    marketplace: [], decorations: [], lastTick: Date.now(), lastTradeTick: Date.now(),
    gameDay: 1, lastDayChange: Date.now(), dailyCosts: 0,
    supplierStock: { beans: 10, milk: 20, cups: 200 },
    currentFilter: "all",
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
    // Initialize quest progress
    QUESTS.forEach(q => {
        if (typeof q.progress === 'undefined') q.progress = 0;
    });
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

// ======= RENDER ALL ======
function renderAll() {
    updateHeader();
    updateLocationBar();
    renderWeatherDisplay();
    renderCafeScene();
    renderOrders();
    renderMenu();
    renderStats();
    renderShop();
    renderItems();
    renderMarket();
    renderQuests();
    renderUpgrades();
    renderSupplierStatus();
}

function updateHeader() {
    const coinEl = document.getElementById("coin-amount");
    const xpEl = document.getElementById("xp-amount");
    const xpNeedEl = document.getElementById("xp-needed");
    const xpBar = document.getElementById("xp-bar");

    if (coinEl) coinEl.textContent = formatNumber(gameState.coins);
    if (xpEl) xpEl.textContent = gameState.xp;
    if (xpNeedEl) xpNeedEl.textContent = gameState.xpNeeded;
    if (xpBar) xpBar.style.width = ((gameState.xp / gameState.xpNeeded) * 100) + "%";
}

function renderWeatherDisplay() {
    const weather = getCurrentWeather();
    const emojiEl = document.getElementById("weather-emoji");
    const textEl = document.getElementById("weather-text");

    if (emojiEl) emojiEl.textContent = weather.emoji;
    if (textEl) textEl.textContent = weather.name + " — " + weather.desc;
}

// ======= RENDER CAFÉ SCENE (pixel art canvas) ======
function renderCafeScene() {
    const sceneEl = document.getElementById("cafe-scene");
    if (sceneEl && !cafeSceneInstance) {
        cafeSceneInstance = new PixelArtCafeScene("cafe-scene");
    }
}

// ======= ORDERS PANEL (with customer AI) ======
function renderOrders() {
    const list = document.getElementById("orders-list");
    list.innerHTML = "";

    // Get active customers from AI system
    const orderCustomers = getActiveCustomerOrders();

    if (orderCustomers.length === 0) {
        list.innerHTML = "<div style='padding:10px;color:var(--text-dim);font-size:9px;'>⏳ Đang chờ khách đến...</div>";
        return;
    }

    for (let i = 0; i < orderCustomers.length; i++) {
        const c = orderCustomers[i];
        const mood = MOOD_TYPES[c.moodIndex] || MOOD_TYPES[2];

        // Determine button style based on mood
        let btnClass = "serve-btn";
        if (c.moodIndex >= 4) btnClass += " urgent-serve";

        const div = document.createElement("div");
        div.className = `order-item animate-fadeIn`;
        div.style.animationDelay = `${i * 0.1}s`;

        // Order color tint based on mood
        let borderColor = mood.color;
        if (c.moodIndex >= 4) {
            // Flashing red border for angry customers
            const flash = Math.sin(Date.now() * 0.01) > 0;
            borderColor = flash ? '#F44336' : '#FF6B6B';
        }

        div.style.borderLeft = `3px solid ${borderColor}`;
        div.innerHTML = `
            <div class="order-info">
                <span style="font-size:18px">${c.emoji}</span>
                <div>
                    <strong>${c.name}</strong> — ${c.order.icon} ${c.order.name}
                    <br><small style="color:var(--text-dim)">Mood: ${mood.desc}</small>
                </div>
            </div>
            <div>
                <div class="order-price">${c.order.price}₫</div>
                <div>${formatPatienceBar(c.patienceLeft, c.maxPatience)}</div>
                <button class="${btnClass}" onclick="serveOrder('${c.id}')">SERVE!</button>
            </div>
        `;

        // Click handler for the serve button
        const btn = div.querySelector('button');
        btn.onclick = (e) => { e.stopPropagation(); serveOrder(c.id); };

        list.appendChild(div);
    }
}

// ======= SERVE ORDER (with customer AI) ======
function serveOrder(customerIdOrMenuId) {
    // Try to find active customer first
    let customer = null;
    if (customerIdOrMenuId && customerIdOrMenuId.startsWith('c_')) {
        customer = activeCustomers.find(c => c.id === customerIdOrMenuId);
    }

    let menuItem, earned;

    if (customer) {
        // Serving a specific customer
        menuItem = customer.order;
        customer.wasServed = true;
        customer.serveTime = Date.now();

        // Mood bonus calculation
        const moodMult = getMoodTipMultiplier(customer.moodIndex);
        const patienceBonus = customer.patienceLeft / customer.maxPatience; // 0-1

        // Calculate revenue with customer mood influence
        let price = menuItem.price;
        let mult = 1;

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
        mult *= moodMult; // mood affects tip/revenue!
        mult *= (0.8 + patienceBonus * 0.4); // patience bonus

        earned = Math.floor(price * mult);

        // Feedback message based on mood
        let feedbackMsg = `✅ +${earned}₫ | ${menuItem.name}`;
        if (customer.moodIndex >= 4) {
            feedbackMsg += " 😡 Khách giận dữ! Tip giảm mạnh!";
        } else if (customer.moodIndex >= 3) {
            feedbackMsg += " 😤 Khách khó chịu...";
        } else if (customer.moodIndex === 1) {
            feedbackMsg += " 🤩 Khách vui mừng! Tip x2!";
        } else if (customer.moodIndex === 0) {
            feedbackMsg += " 😊 Khách hài lòng! Tip +30%!";
        }
        showNotification(feedbackMsg);

    } else {
        // Fallback: legacy menuItem ID string serving
        menuItem = MENU_ITEMS.find(m => m.id === customerIdOrMenuId);
        if (!menuItem) return;

        if (menuItem.needsBeans && gameState.supplierStock.beans <= 0) {
            showNotification("⚠️ Hết cà phê!");
            return;
        }
        if (menuItem.needsMilk && gameState.supplierStock.milk <= 0) {
            showNotification("⚠️ Hết sữa!");
            return;
        }
        if (gameState.supplierStock.cups <= 0) {
            showNotification("⚠️ H hết cốc!");
            return;
        }

        if (menuItem.needsBeans) gameState.supplierStock.beans -= 0.1;
        if (menuItem.needsMilk) gameState.supplierStock.milk -= 0.2;
        gameState.supplierStock.cups -= 1;

        let price = menuItem.price;
        let mult = 1;

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

        earned = Math.floor(price * mult);
        showNotification(`✅ +${earned}₫ | ${menuItem.name}`);
    }

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
        showNotification(`⭐ UP LEVEL ${gameState.level}!`);
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
        list.innerHTML = "<div style='padding:10px;color:var(--text-dim);font-size:9px;'>✅ Đã sở hữu hết!</div>";
        return;
    }

    availableItems.forEach(item => {
        const rarityColors = { common: "#b0b0b0", rare: "#4169E1", epic: "#9932CC", legendary: "#FFD700" };
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
                <button class="buy-btn" onclick="buyItem('${item.id}')">MUA</button>
            </div>
        `;
        div.style.borderLeft = `4px solid ${rarityColors[item.rarity]}`;
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

    showNotification(`✅ Mua: ${item.name}!`);
    checkQuestProgress("collect", 1);
    saveGame();
    renderAll();
}

// ======= ITEMS ======
function renderItems() {
    const list = document.getElementById("items-list");
    list.innerHTML = "";

    const ownedItems = Object.entries(gameState.ownedItems).filter(([k, v]) => v > 0);
    const filter = gameState.currentFilter || "all";

    const filtered = filter === "all" ? ownedItems : ownedItems.filter(([id]) => {
        const item = TREND_ITEMS.find(i => i.id === id);
        return item && item.rarity === filter;
    });

    if (filtered.length === 0) {
        list.innerHTML = "<div style='padding:10px;color:var(--text-dim);font-size:9px;'>📦 Chưa có items!</div>";
        return;
    }

    filtered.forEach(([itemId, count]) => {
        const item = TREND_ITEMS.find(i => i.id === itemId);
        if (!item) return;
        const rarityColors = { common: "#b0b0b0", rare: "#4169E1", epic: "#9932CC", legendary: "#FFD700" };
        const div = document.createElement("div");
        div.className = `item-card ${item.rarity} animate-fadeIn`;
        div.innerHTML = `
            <span class="item-emoji">${item.id.replace('t_','').substring(0,4)}</span>
            <div class="item-info">
                <div class="item-name">${item.name}</div>
                <div class="item-rarity ${item.rarity}">${item.rarity.toUpperCase()}</div>
                <div style="font-size:8px;color:var(--text-dim)">${item.desc} ×${count}</div>
            </div>
        `;
        list.appendChild(div);
    });
}

// ======= MARKET ======
function renderMarket() {
    const list = document.getElementById("market-list");
    list.innerHTML = "<div style='padding:15px;color:var(--text-dim);font-size:9px;'>⚡ Coming Soon! Marketplace sắp ra mắt! 🎮</div>";
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
                showNotification(`✅ QUEST DONE: ${q.title}! +${q.reward.coins}coin +${q.reward.xp}XP`);
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
        div.className = "quest-item animate-fadeIn";
        div.innerHTML = `
            <div class="quest-title">${q.done ? '✅' : '📌'} ${q.title}</div>
            <div class="quest-desc">${q.desc}</div>
            <div class="quest-reward">🎁 ${q.reward.coins} coin | ⭐ ${q.reward.xp} XP</div>
            <div class="quest-progress">
                <div class="quest-progress-bar" style="width:${pct}%"></div>
            </div>
            <div style="font-size:8px;color:var(--text-dim);margin-top:3px;">${Math.floor(progress)}/${q.target}</div>
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
        div.className = "upgrade-item animate-fadeIn";
        const bought = gameState.upgradesBought.includes(u.id);
        div.innerHTML = `
            <div class="upgrade-info">
                <div class="upgrade-name">${u.name}</div>
                <div class="upgrade-desc">${u.desc}</div>
            </div>
            <div style="text-align:right;">
                <div class="upgrade-cost">${formatNumber(u.cost)}₫</div>
                <button class="upgrade-btn" onclick="buyUpgrade('${u.id}')" ${bought || gameState.coins < u.cost ? 'disabled' : ''}>${bought ? '✅ ĐÃ MUA' : 'MUA'}</button>
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

    showNotification(`⬆️ Nâng cấp: ${u.name}!`);
    checkQuestProgress("upgrade", 1);
    saveGame();
    renderAll();
}

// ======= NOTIFICATION (PIXEL ART STYLE) ======
function showNotification(text) {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const div = document.createElement("div");
    div.className = "notification animate-pop";
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
            showNotification(`🔓 Mở khóa: ${loc.name}!`);
            checkQuestProgress("upgrade", 1);
        } else {
            showNotification("❌ Không đủ coin!");
            return;
        }
    }
    gameState.currentLocation = locKey;
    saveGame();
    renderAll();
}

// ======= EVENT LISTENERS ======
function setupEventListeners() {
    // Location buttons
    document.querySelectorAll(".loc-btn").forEach(btn => {
        btn.addEventListener("click", () => switchLocation(btn.dataset.loc));
    });

    // Nav buttons
    document.querySelectorAll(".nav-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
            document.querySelectorAll(".panel").forEach(p => p.classList.remove("active"));
            btn.classList.add("active");
            const panelId = btn.dataset.tab + "-panel";
            const panel = document.getElementById(panelId);
            if (panel) panel.classList.add("active");
            renderAll(); // Re-render for panel-specific content
        });
    });

    // Filter buttons
    document.querySelectorAll(".filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            gameState.currentFilter = btn.dataset.filter;
            document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderItems();
        });
    });
}

// ======= GAME LOOP ======
function startGameLoop() {
    setInterval(() => {
        const now = Date.now();
        const delta = (now - gameState.lastTick) / 1000;
        gameState.lastTick = now;

        // === Customer AI: update patience, mood ===
        updateCustomerAI(delta);

        // Spawn new customer periodically based on location
        const loc = LOCATIONS[gameState.currentLocation];
        const maxCustomers = Math.floor(loc.customers * 2.5);
        const activeCount = activeCustomers.filter(c => !c.wasServed).length;

        if (activeCount < maxCustomers && Math.random() < 0.4) {
            const menuItem = MENU_ITEMS[Math.floor(Math.random() * Math.min(gameState.menuUnlocked, MENU_ITEMS.length))];
            addCustomer(menuItem);
        }

        // Remove angry customers who left
        activeCustomers = activeCustomers.filter(c => !(c.wasServed && c.patienceLeft <= 0));

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

            const dailyWage = gameState.autoServeRate * 50000;
            gameState.dailyCosts = dailyWage;
            gameState.coins -= dailyWage;

            if (Math.random() < 0.02) {
                showNotification("📦 Biến động giá nguyên liệu!");
            }
        }

        renderAll();
    }, 1000);
}

// ======= TREND BANNER SCROLLER ======
function updateTrendBanner() {
    const texts = [
        "🎮 Quán Trendy Café — Pixel Art Edition ☕",
        "🔥 Meme Chó Vàng đang hot! Mua ngay! 🐶",
        "⚡ Siêu Tốc - +5 khách ngay! ⚡",
        "👑 Vua Cà Phê - +50% doanh thu! 👑",
        "🍸 Signature Drink - Món ngon nhất quán! 🍸",
        "🌳 Mở quán sân vườn - Không gian xanh! 🌳",
    ];
    let idx = 0;
    setInterval(() => {
        const el = document.getElementById("trend-text");
        if (el) {
            el.textContent = texts[idx % texts.length];
            idx++;
        }
    }, 3000);
}

// ======= INIT ======
function init() {
    loadGame();
    setupEventListeners();
    renderAll();
    renderWeatherDisplay();
    updateTrendBanner();

    // Start PixelArt cafe scene
    const sceneEl = document.getElementById("cafe-scene");
    if (sceneEl && !cafeSceneInstance) {
        cafeSceneInstance = new PixelArtCafeScene("cafe-scene");
    }

    startGameLoop();
}

// Make functions global
window.init = init;
window.serveOrder = serveOrder;
window.buyItem = buyItem;
window.buyUpgrade = buyUpgrade;
window.switchLocation = switchLocation;

// Auto-start when DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

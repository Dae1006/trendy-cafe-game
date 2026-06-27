// ============================================
// TRENDY CAFE V10 - CUSTOMER AI MODULE
// Mood system, patience timer, cafe scene v3
// ============================================

// ======= MOOD SYSTEM ======
const MOOD_TYPES = [
    { id: "happy", emoji: "😊", color: "#4CAF50", tipMult: 1.3, desc: "Hài lòng" },
    { id: "excited", emoji: "🤩", color: "#FF9800", tipMult: 1.5, desc: "Vui mừng" },
    { id: "neutral", emoji: "😐", color: "#9E9E9E", tipMult: 1.0, desc: "Bình thường" },
    { id: "impatient", emoji: "😤", color: "#FF5722", tipMult: 0.8, desc: "Khó chịu" },
    { id: "angry", emoji: "😡", color: "#F44336", tipMult: 0.5, desc: "Giận dữ" },
];

// ======= ACTIVE CUSTOMERS ======
let activeCustomers = [];

function addCustomer(menuItem, trendBonus = null) {
    const id = 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
    const emoji = "🧑"; // will be set by V7 game engine
    const customer = {
        id, menuItem, trendBonus: trendBonus || {},
        moodIndex: 2, maxPatience: 15 + Math.random() * 30,
        patienceLeft: 0, wasServed: false, serveTime: 0,
    };
    customer.patienceLeft = customer.maxPatience;
    activeCustomers.push(customer);
    return customer;
}

function getActiveCustomerOrders() {
    return activeCustomers.filter(c => !c.wasServed).slice(0, 8);
}

function updateCustomerAI(delta) {
    for (const c of activeCustomers) {
        if (c.wasServed) continue;
        c.patienceLeft -= delta;
        const ratio = Math.max(0, c.patienceLeft / c.maxPatience);
        let newMood = 2;
        if (ratio > 0.7) newMood = 1;
        else if (ratio > 0.4) newMood = 2;
        else if (ratio > 0.15) newMood = 3;
        else newMood = 4;
        if (newMood > c.moodIndex) c.moodIndex = newMood;
    }
}

function getMoodTipMultiplier(moodIndex) {
    return (MOOD_TYPES[moodIndex] || MOOD_TYPES[2]).tipMult;
}

// ======= CAFÉ SCENE V3 (minimal pixel art) ======
class CafeSceneV3 {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return false;
        this.ctx = this.canvas.getContext('2d');
        this.w = 480, this.h = 300;
        this.time = 0;
        return this.start();
    }
    start() {
        this.startTime = Date.now();
        (function loop(s) { s.time = Date.now() - s.startTime; s.draw(); requestAnimationFrame(()=>loop(s)); })(this);
        return true;
    }
    draw() {
        const c = this.ctx, w = this.w, h = this.h;
        // sky gradient
        const grad = c.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, '#87CEEB'); grad.addColorStop(1, '#8B7355');
        c.fillStyle = grad; c.fillRect(0, 0, w, h);
        // building
        c.fillStyle = '#6b5240';
        c.fillRect(60, 80, 200, 150);
        c.fillStyle = '#4a3728';
        c.beginPath(); c.moveTo(60, 80); c.lineTo(160, 40); c.lineTo(260, 80); c.fill();
        // windows glow based on customers
        const custCount = activeCustomers.filter(x => !x.wasServed).length;
        const glow = Math.min(1, 0.3 + (custCount / 10));
        for (let i = 0; i < 3; i++) {
            c.fillStyle = `rgba(255,200,80,${glow})`;
            c.fillRect(90 + i * 60, 100, 30, 40);
        }
        // door
        c.fillStyle = '#5a3a1a'; c.fillRect(145, 170, 30, 60);
        // counter
        c.fillStyle = '#8B6914'; c.fillRect(100, 210, 120, 15);
        // customers
        const baseY = 235;
        for (let i = 0; i < Math.min(custCount, 6); i++) {
            c.font = '16px serif'; c.textAlign = 'center';
            c.fillText('🧑', 80 + i * 45, baseY - 5 + Math.sin(this.time * 0.004 + i) * 2);
            if (i < activeCustomers.length && !activeCustomers[i].wasServed && activeCustomers[i].patienceLeft < activeCustomers[i].maxPatience * 0.3) {
                c.fillStyle = '#F44336'; c.fillRect(80 + i * 45 - 12, baseY + 5, 24, 4);
                c.fillStyle = '#fff'; c.fillRect(80 + i * 45 - 12, baseY + 5, 24 * (activeCustomers[i].patienceLeft / activeCustomers[i].maxPatience), 4);
            }
        }
        // status bar
        c.fillStyle = 'rgba(0,0,0,0.7)'; c.fillRect(10, h - 25, 200, 20);
        c.fillStyle = '#FFD700'; c.font = '11px Courier New';
        c.fillText(`👥 ${custCount} khách | ☕ Trendy Cafe V10`, 16, h - 10);
    }
}

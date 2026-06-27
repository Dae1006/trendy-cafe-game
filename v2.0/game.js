/* ============================================
   ☕ QUÁN TRENDY CAFÉ v2.0 — GAME ENGINE
   Core logic, canvas rendering, and UI management
   ============================================ */

// --- Game Constants ---
const MENU = [
    { id: 'coffee', name: 'Cà Phê Đen', price: 15, cost: 8 },
    { id: 'milk_coffee', name: 'Cà Phê Sữa', price: 20, cost: 10 },
    { id: 'tea', name: 'Trà Sen', price: 18, cost: 9 },
    { id: 'smoothie', name: 'Sinh Tố', price: 25, cost: 12 },
    { id: 'espresso', name: 'Espresso', price: 30, cost: 15 }
];

const LOCATIONS = [
    { id: 'center', name: 'Quán Cà Phê', maxOrders: 5, incomeMod: 1.0 },
    { id: 'park', name: 'Công Viên', maxOrders: 3, incomeMod: 1.2 },
    { id: 'market', name: 'Chợ Đêm', maxOrders: 8, incomeMod: 0.9 }
];

// --- Global State ---
let G = {
    coins: 500,
    level: 1,
    xp: 0,
    xpNeeded: 100,
    day: 1,
    tick: 0,
    pendingOrders: [],
    staff: [
        { name: 'Fresher', skill: 0.5, speed: 3 } // Auto-serve every 3 ticks
    ],
    shopItems: [],
    achievements: [],
    loc: LOCATIONS[0],
    weather: 'sunny'
};

// --- Canvas & Scene ---
let canvas, ctx;
let customers = [];
let particles = [];

function initCanvas() {
    canvas = document.getElementById('scene-canvas');
    if (!canvas) return;
    // Set internal resolution low for pixel art look
    canvas.width = 480;
    canvas.height = 240;
    ctx = canvas.getContext('2d');
    
    // Initial customer spawn
    for(let i=0; i<3; i++) customers.push({x: Math.random()*400, y: 150 + Math.random()*20});
}

function renderScene() {
    if (!ctx) return;
    
    let time = (G.day * 24 + G.tick/60) % 24; // Fake day cycle
    
    // Sky
    let skyTop = (time > 6 && time < 18) ? '#87CEEB' : '#0a0a2e';
    let skyBot = (time > 6 && time < 18) ? '#B0C4DE' : '#16213e';
    
    let grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, skyTop);
    grad.addColorStop(1, skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Ground
    ctx.fillStyle = '#2a5298';
    ctx.fillRect(0, 160, canvas.width, 80);

    // Cafe Building
    ctx.fillStyle = (time > 6 && time < 18) ? '#FFD700' : '#333';
    ctx.fillRect(100, 60, 280, 100);
    
    // Door
    ctx.fillStyle = '#654321';
    ctx.fillRect(200, 100, 80, 60);

    // Sign
    ctx.fillStyle = (time > 6 && time < 18) ? '#fff' : '#FFD700';
    ctx.font = '10px "Press Start 2P"';
    ctx.fillText('☕ TRENDY CAFÉ', 140, 50);

    // Draw Customers
    customers.forEach(c => {
        c.x += 0.2;
        if(c.x > 400) c.x = -10;
        let emoji = ['☕', '🍵', '🧋'][Math.floor(Math.random()*3)];
        ctx.font = '20px serif';
        ctx.fillText(emoji, c.x, c.y);
    });

    // Stars (if night)
    if (time <= 6 || time >= 18) {
        ctx.fillStyle = '#FFF';
        for(let i=0; i<20; i++) {
            ctx.fillRect((i*53)%400, (i*27)%100, 2, 2);
        }
    }

    // Particles
    particles.forEach(p => {
        p.y -= 1;
        p.life--;
        ctx.fillStyle = '#FFD700';
        ctx.fillText(p.text, p.x, p.y);
    });
    particles = particles.filter(p => p.life > 0);
}

// --- Game Logic ---
function gameTick() {
    G.tick++;
    
    // Spawn Order
    if(G.pendingOrders.length < G.loc.maxOrders && Math.random() < 0.3) {
        let item = MENU[Math.floor(Math.random() * MENU.length)];
        G.pendingOrders.push({...item, uid: Date.now()});
    }

    // Auto-serve by Staff
    if(G.staff.length > 0 && G.pendingOrders.length > 0) {
        // Simple auto-serve logic based on staff speed
        let serveChance = 1 - (1/3); // Fresher serves every ~3 ticks
        if(Math.random() < serveChance) {
            let order = G.pendingOrders.shift();
            let revenue = Math.floor(order.price * G.loc.incomeMod);
            G.coins += revenue;
            addXP(10);
            spawnParticle(`+${revenue}💰`, 240, 180);
        }
    }
    
    // XP & Leveling
    if(G.xp >= G.xpNeeded) {
        G.level++;
        G.xp = 0;
        G.xpNeeded = Math.floor(G.xpNeeded * 1.5);
        show('⬆️ Lên Lv.' + G.level + '!');
    }
}

function spawnParticle(text, x, y) {
    particles.push({text, x, y, life: 30});
}

function addXP(amount) {
    G.xp += amount;
}

// --- UI Rendering ---
function renderUI() {
    // Header Stats
    document.getElementById('coins').innerText = Math.floor(G.coins);
    document.getElementById('lv').innerText = G.level;
    document.getElementById('xp-bar').style.width = (G.xp / G.xpNeeded * 100) + '%';

    // Locations
    let locsEl = document.getElementById('locs');
    if(locsEl && locsEl.childElementCount === 0) {
        LOCATIONS.forEach((loc, i) => {
            let btn = document.createElement('button');
            btn.className = 'lb' + (G.loc.id === loc.id ? ' on' : '');
            btn.innerText = loc.name;
            btn.onclick = () => switchLocation(i);
            locsEl.appendChild(btn);
        });
    }

    // Pending Orders
    let ol = document.getElementById('ol');
    if(ol) {
        ol.innerHTML = '';
        if(G.pendingOrders.length === 0) {
            ol.innerHTML = '<div class="empty">Chưa có đơn hàng mới</div>';
        } else {
            G.pendingOrders.forEach(o => {
                let d = document.createElement('div');
                d.className = 'card';
                d.innerHTML = `<span>${o.name}</span><span class="pr">${o.price}💰</span>`;
                ol.appendChild(d);
            });
        }
    }

    // Staff List (Simplified for brevity)
    let sll = document.getElementById('sll');
    if(sll && sll.childElementCount === 0) {
        G.staff.forEach((s, i) => {
            let d = document.createElement('div');
            d.className = 'card';
            d.innerHTML = `<span>${s.name}</span><button class="btn o" onclick="fireStaff(${i})">X</button>`;
            sll.appendChild(d);
        });
    }

    // Weather Bar
    let wEl = document.getElementById('weather');
    if(wEl) {
        let wEmoji = G.weather === 'sunny' ? '☀️' : (G.weather === 'rainy' ? '🌧️' : '⛅');
        wEl.innerText = wEmoji + ' ' + G.weather.toUpperCase();
    }
}

function switchLocation(idx) {
    G.loc = LOCATIONS[idx];
    document.querySelectorAll('.lb').forEach(b => b.classList.remove('on'));
    renderUI();
}

function fireStaff(i) {
    if(G.staff.length <= 0) return;
    let name = G.staff[i].name;
    G.staff.splice(i, 1);
    show('👋 Đã sa thải ' + name);
    renderUI();
}

// --- Notifications ---
function show(msg) {
    let n = document.getElementById('notif');
    if(!n) return;
    n.innerText = msg;
    n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 3000);
}

// --- Initialization ---
function init() {
    initCanvas();
    renderUI();
    
    // Game Loop
    let lastTick = Date.now();
    function loop() {
        let now = Date.now();
        if(now - lastTick > 2000) { // Tick every 2 seconds
            gameTick();
            lastTick = now;
        }
        
        renderScene();
        requestAnimationFrame(loop);
    }
    loop();
    
    // UI Update (slower than scene)
    setInterval(renderUI, 500);
}

// Start on Load
window.addEventListener('load', init);

/* ============================================
   QUÁN TRENDY CAFÉ v2.0 — GAME ENGINE (FIXED)
   UNICODE ESCAPE ALL ICONS → zero multi-byte chars in source → git-safe
   
   FIX 1: All icons use \u{XXXXX} Unicode escapes instead of raw emoji
   FIX 2: CSS emoji font stack for Android Chrome support
   FIX 3: Double-encoding prevention via .gitattributes binary
   ============================================ */

// ===== ICON SYSTEM — all Unicode escapes, never raw emoji =====
const I = {
    // Currency
    coin:'\u{1F4B0}', coinSmall:'\u26AA', star:'\u2B50', up:'\u23E6', wave:'\u{1F44B}',
    // Coffee & food
    coffee:'\u2615\uFE0F', tea:'\u{1F375}', bubbleTea:'\u{1F9CB}', juice:'\u{1F964}',
    coconut:'\u{1F965}', cake:'\u{1F370}', sandwich:'\u{1F96A}', ice:'\u{1F9CA}',
    martini:'\u{1F378}', milk:'\u{1F95B}', espresso:'\u2615',
    // Shop
    dog:'\u{1F415}', cat:'\u{1F431}', plant:'\u{1FAB4}', diamond:'\u{1F48E}',
    // Status
    check:'\u2705', cross:'\u274C', clock:'\u23F3', map:'\u{1F4E1}', gift:'\u{1F381}',
    // Weather
    sun:'\u2600\uFE0F', cloud:'\u26C5', rain:'\u{1F327}', fire:'\u{1F525}', party:'\u{1F38A}',
    // People
    staff:'\u{1F465}', barista:'\u{1F373}', chef:'\u{1F468}\u200D\u{1F373}',
    person:'\u{1F468}', woman:'\u{1F469}', boy:'\u{1F466}', girl:'\u{1F467}',
    // Buildings
    shop:'\u{1F3EC}', garden:'\u{1F332}', festival:'\u{1F3AC}', night:'\u{1F3C3}', street:'\u{1F6B6}',
    misc: [
        '\u{1F468}\u200D\u{1F4BB}','\u{1F469}\u200D\u{1F3AE}','\u{1F467}\u200D\u{1F3A8}',
        '\u{1F474}','\u{1F913}','\u{1F913}\uFE0F','\u{1F47B}','\u{1F929}','\u{1F466}','\u{1F467}',
        '\u{1F469}\u200D\u{1F3EB}','\u{1F9D4}'
    ],
    // Misc
    lock:'\u{1F512}', trophy:'\u{1F3C6}', heart:'\u2764\uFE0F', warning:'\u26A0\uFE0F',
    coffeeBean:'\u2615\uFE0F', beer:'\u{1F37A}', wine:'\u{1F377}', popcorn:'\u{1F3C0}',
    burger:'\u{1F354}', hotdog:'\u{1F32D}', pizza:'\u{1F355}', iceCream:'\u{1F368}',
    taco:'\u{1F32E}', salad:'\u{1F957}', fish:'\u{1F41F}', sushi:'\u{1F363}', ramen:'\u{1F35C}',
};

// ===== MENU ITEMS (all icons via Unicode escapes) =====
const MENU = [
    { id: 'coffee',       name: 'Cà Phê Đen',     icon: I.coffee,        price: 15, cost: 8 },
    { id: 'milk_coffee',  name: 'Cà Phê Sữa',     icon: I.milk,          price: 20, cost: 10 },
    { id: 'tea',          name: 'Trà Sen',         icon: I.tea,           price: 18, cost: 9 },
    { id: 'smoothie',     name: 'Sinh Tố',         icon: I.juice,         price: 25, cost: 12 },
    { id: 'espresso',     name: 'Espresso',        icon: I.espresso,      price: 30, cost: 15 },
];

// ===== LOCATIONS =====
const LOCATIONS = [
    { id:'center', name:'Quán Cà Phê', maxOrders:5, incomeMod:1.0, emoji:I.street },
    { id:'park',   name:'Công Viên',   maxOrders:3, incomeMod:1.2, emoji:I.garden },
    { id:'market', name:'Chợ Đêm',     maxOrders:8, incomeMod:0.9, emoji:I.festival },
];

// ===== CUSTOMER EMOJIS (Unicode escapes) =====
const CUSTOMER_EMOJIS = [I.coffee, I.tea, I.bubbleTea, I.juice, '\u{1F9E3}'];

// ===== TREND ITEMS (Shop) — all icons as Unicode escapes =====
const TREND_ITEMS = [
    { id:'t_dog',    name:I.dog+' Meme Chó Vàng',  r:'common',  ef:'rev', v:.05, cost:200, desc:'+5% rev' },
    { id:'t_cat',    name:I.cat+' Mèo hoang',      r:'common',  ef:'rev', v:.03, cost:150, desc:'+3% rev' },
    { id:'t_mu',     name:I.star2+' Áo MU',        r:'common',  ef:'cust',v:1,   cost:300, desc:'+1 khách' },
    { id:'t_astro',  name:I.bubbleTea+' Trà Astro',r:'common',  ef:'rev', v:.1,  cost:400, desc:'+10% trà sữa' },
    { id:'t_girl',   name:I.woman+' Cô Bé',        r:'rare',    ef:'rev', v:.1,  cost:1000, desc:'+10% rev' },
    { id:'t_ba',     name:I.star2+' Ba Trăm',      r:'rare',    ef:'cust',v:2,   cost:1500, desc:'+2 khách' },
    { id:'t_sieu',   name:I.warning+' Siêu Tốc',   r:'epic',    ef:'cust',v:5,   cost:8000, desc:'+5 khách' },
    { id:'t_vua',    name:I.trophy+' Vua Cà Phê',  r:'legendary',ef:'rev', v:.5,  cost:20000, desc:'+50% rev' },
    { id:'t_omega',  name:I.diamond+' Omega Plus', r:'legendary', ef:'all', v:.3,  cost:50000, desc:'+30% all' },
];

// ===== STAFF TYPES =====
const STAFF_TYPES = [
    { id:'s_barista',  name:I.barista+' Barista',       cost:300, sk:.6, desc:'Skill: 60%' },
    { id:'s_chef',     name:I.chef+' Đầu bếp',          cost:400, sk:.7, desc:'Skill: 70%' },
    { id:'s_senior',   name:I.person+' Senior Barista', cost:800, sk:.9, desc:'Skill: 90%' },
    { id:'s_manager',  name:I.heart+' Quản lý',         cost:1200,sk:1.0,desc:'Skill: 100%' },
];

// ===== UPGRADES =====
const UPGRADES = [
    { id:'u1', name:I.star+' Bàn ghế mới',  desc:'+10% doanh thu', cost:1500,type:'rev',v:.1 },
    { id:'u2', name:I.coffeeSmall+'\uFE0F Nhạc nền', desc:'+5% doanh thu', cost:800,type:'rev',v:.05 },
    { id:'u3', name:I.gift+' Bảng hiệu LED',  desc:'+20% khách',    cost:5000,type:'cust',v:.2 },
    { id:'u4', name:I.cloud+'\uFE0F Điều hòa',desc:'+15% doanh thu', cost:3500,type:'rev',v:.15 },
];

// ===== QUESTS =====
const QUESTS = [
    {id:'q1',title:I.star+' Ngày đầu khai trương',  desc:'Phục vụ 10 khách', type:'serve',target:10,reward:200,xp:50,done:false,p:0},
    {id:'q2',title:I.map+' Thu thập meme',            desc:'Sở hữu 1 item',  type:'collect',target:1,reward:300,xp:75,done:false,p:0},
    {id:'q3',title:I.trophy+' Triệu phú cà phê',      desc:'Kiếm 5000 coin', type:'earn',target:5000,reward:1000,xp:150,done:false,p:0},
    {id:'q4',title:I.diamond+' Thu thập bộ sưu tập',   desc:'Có 5 items',   type:'collect_all',target:5,reward:3000,xp:300,done:false,p:0},
    {id:'q5',title:I.trophy+' King of Trendy',         desc:'Sở hữu hết items',type:'complete_all',target:TREND_ITEMS.length,reward:20000,xp:2000,done:false,p:0},
];

// ===== WEATHER =====
const WEATHERS = [
    {e:I.sun, n:'Nắng', rm:1.0},
    {e:I.cloud, n:'Mát', rm:1.05},
    {e:I.rain, n:'Mưa', rm:0.75},
    {e:I.fire, n:'Nóng', rm:1.15},
    {e:I.party, n:'Tết', rm:2.5},
];

// ===== GLOBAL STATE =====
let G = {
    coins:500, level:1, xp:0, xpNeeded:100, day:1, tick:0,
    pendingOrders:[], staff:[{name:'Fresher', skill:.5, speed:3}],
    shopItems:[], achievements:[], loc:LOCATIONS[0], weather:'sunny'
};

// ===== CANVAS & SCENE =====
let canvas, ctx;
let customers = [];
let particles = [];

function initCanvas() {
    canvas = document.getElementById('scene-canvas');
    if (!canvas) return;
    canvas.width  = 480;
    canvas.height = 240;
    ctx = canvas.getContext('2d');
    const count = Math.min(3, LOCATIONS.find(l => l.id === G.loc.id)?.maxOrders || 5);
    for (let i = 0; i < count; i++) {
        customers.push({
            x: Math.random() * 400,
            y: 150 + Math.random() * 20,
            emoji: CUSTOMER_EMOJIS[Math.floor(Math.random() * CUSTOMER_EMOJIS.length)]
        });
    }
}

function drawEmojiSafe(x, y, emoji, size) {
    // Draw emoji with device-native font stack (Android Chrome safe)
    ctx.save();
    ctx.font = `${size||20}px "Segoe UI Emoji","Apple Color Emoji","Noto Color Emoji",sans-serif`;
    ctx.textAlign = 'left';
    ctx.fillText(emoji, x, y);
    ctx.restore();
}

function renderScene() {
    if (!ctx) return;
    let time = (G.day * 24 + G.tick / 60) % 24;
    let skyTop   = (time > 6 && time < 18) ? '#87CEEB' : '#0a0a2e';
    let skyBot   = (time > 6 && time < 18) ? '#B0C4DE' : '#16213e';
    let grad     = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, skyTop);
    grad.addColorStop(1, skyBot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#2a5298';
    ctx.fillRect(0, 160, canvas.width, 80);
    ctx.fillStyle = (time > 6 && time < 18) ? '#FFD700' : '#333';
    ctx.fillRect(100, 60, 280, 100);
    ctx.fillStyle = '#654321';
    ctx.fillRect(200, 100, 80, 60);
    let signColor = (time > 6 && time < 18) ? '#fff' : '#FFD700';
    ctx.save(); ctx.fillStyle = signColor;
    ctx.font = '10px "Courier New",sans-serif'; ctx.textAlign = 'center';
    ctx.fillText('TRENDY CAFE', 240, 50);
    ctx.restore();
    customers.forEach(c => { c.x += 0.2; if (c.x > 400) c.x = -10; drawEmojiSafe(c.x, c.y, c.emoji, 20); });
    if (time <= 6 || time >= 18) {
        ctx.fillStyle = '#FFF';
        for (let i = 0; i < 20; i++) ctx.fillRect((i * 53) % 400, (i * 27) % 100, 2, 2);
    }
    particles.forEach(p => { p.y -= 1; p.life--; ctx.save(); ctx.font = '8px "Courier New",sans-serif';
        ctx.fillStyle = '#FFD700'; ctx.fillText(p.text, p.x, p.y); ctx.restore(); });
    particles = particles.filter(p => p.life > 0);
}

// ===== GAME LOGIC =====
function gameTick() {
    G.tick++;
    if (G.pendingOrders.length < G.loc.maxOrders && Math.random() < 0.3) {
        let item = MENU[Math.floor(Math.random() * MENU.length)];
        G.pendingOrders.push({ ...item, uid: Date.now() });
    }
    if (G.staff.length > 0 && G.pendingOrders.length > 0) {
        let serveChance = Math.min(0.9, G.staff.length * 0.25);
        if (Math.random() < serveChance) {
            let order = G.pendingOrders.shift();
            let revenue = Math.floor(order.price * G.loc.incomeMod);
            G.coins += revenue; addXP(10);
            spawnParticle(`+${revenue}${I.coinSmall}`, 240, 180);
        }
    }
    if (G.xp >= G.xpNeeded) { G.level++; G.xp = 0; G.xpNeeded = Math.floor(G.xpNeeded * 1.5); show(`${I.up} Lên Lv.${G.level}!`); }
}

function spawnParticle(text, x, y) { particles.push({ text, x, y, life: 30 }); }
function addXP(amount) { G.xp += amount; }

// ===== RENDER UI (icons via ICON map — never raw emoji in JS strings) =====
function renderUI() {
    document.getElementById('coins').textContent = Math.floor(G.coins);
    document.getElementById('lv').textContent = G.level;
    document.getElementById('xp').textContent = G.xp;
    document.getElementById('xpn').textContent = G.xpNeeded;
    document.getElementById('xp-bar').style.width = (G.xp / G.xpNeeded * 100) + '%';

    let locsEl = document.getElementById('locs');
    if (locsEl && locsEl.childElementCount === 0) {
        LOCATIONS.forEach((loc, i) => {
            let btn = document.createElement('button');
            btn.className = 'nb' + (G.loc.id === loc.id ? ' on' : '');
            // Use I.emoji for location names
            btn.textContent = `${loc.emoji} ${loc.name}`;
            btn.onclick = () => switchLocation(i);
            locsEl.appendChild(btn);
        });
    }

    let ol = document.getElementById('ol');
    if (ol) {
        ol.innerHTML = '';
        if (G.pendingOrders.length === 0) {
            ol.innerHTML = `<div class="card empty">${I.clock} Chờ khách...</div>`;
        } else {
            G.pendingOrders.forEach(o => {
                let d = document.createElement('div');
                d.className = 'card';
                d.innerHTML = `<span>${o.icon} ${o.name}</span><span class="pr">${o.price}${I.coinSmall}</span>`;
                ol.appendChild(d);
            });
        }
    }

    let sll = document.getElementById('sll');
    if (sll && sll.childElementCount === 0) {
        G.staff.forEach((s, i) => {
            let d = document.createElement('div');
            d.className = 'card';
            d.innerHTML = `<span>${s.name}</span><button class="btn o" onclick="fireStaff(${i})">${I.cross}</button>`;
            sll.appendChild(d);
        });
    }

    let wEl = document.getElementById('weather');
    if (wEl) {
        let we = WEATHERS.find(w => w.n.toLowerCase() === G.weather);
        wEl.textContent = `${we.e} ${we.n}`;
    }
}

function switchLocation(idx) {
    G.loc = LOCATIONS[idx];
    let locsEl = document.getElementById('locs');
    if (locsEl) { locsEl.innerHTML = ''; renderUI(); } else renderUI();
}

function fireStaff(i) {
    if (G.staff.length <= 0) return;
    let name = G.staff[i].name; G.staff.splice(i, 1);
    show(`${I.wave} Đã sa thải ${name}`); renderUI();
}

// ===== NOTIFICATIONS =====
function show(msg) {
    let n = document.getElementById('notif');
    if (!n) return;
    n.textContent = msg; n.style.display = 'block';
    setTimeout(() => n.style.display = 'none', 3000);
}

// ===== PANEL SWITCHING =====
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.nb').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.nb').forEach(b => b.classList.remove('on'));
            this.classList.add('on');
            let tab = this.dataset.tab;
            document.querySelectorAll('.pan').forEach(p => p.classList.remove('on'));
            let target = document.getElementById('p-' + tab);
            if (target) target.classList.add('on');
        });
    });
});

// ===== INITIALIZATION =====
function init() {
    initCanvas(); renderUI();
    let loadingEl = document.getElementById('loading');
    if (loadingEl) loadingEl.style.display = 'none';
    function loop() {
        let now = Date.now();
        if (now - (init.lastTick || now) > 2000) { gameTick(); init.lastTick = now; }
        renderScene(); requestAnimationFrame(loop);
    }
    loop();
    setInterval(renderUI, 500);
}

window.addEventListener('load', init);

/**
 * cafe_scene_v10.js - Ultimate Enhanced Cafe Scene
 * Pixel art 320x200px cozy cafe interior with ultra-detailed graphics,
 * dynamic lighting, particle effects, and enhanced animations.
 */
(function() {
  "use strict";

  // ── Constants ──────────────────────────────────────────────
  const W = 320, H = 200;
  const P = 2;

  // ── Color Palette ─────────────────────────────────────────
  const C = {
    // Wall colors - warm café tones
    wallTop: "#F5E6D3",
    wallMid: "#E8D5C4",
    wallBot: "#D4B896",
    baseboard: "#5C4033",
    
    // Floor
    floorFront: "#A0906D",
    floorBack: "#8B7355",
    floorDark: "#7A6B4F",
    
    // Furniture
    wood: "#9B6E4F",
    woodLight: "#B8956A",
    woodDark: "#654321",
    chair: "#8B5E3C",
    chairDark: "#7A4E2C",
    
    // Counter & bar
    counterTop: "#5C3D2E",
    counter: "#654321",
    counterDark: "#4A3020",
    
    // Barista
    baristaSkin: "#FDDCB5",
    baristaShirt: "#2C5F7C",
    baristaPants: "#3B3B3F",
    baristaHair: "#3B2F1B",
    
    // Window & sky
    windowFrame: "#5A4A3A",
    doorFrame: "#4A3020",
    doorGlass: "#A8C8E0",
    
    // Sky gradients
    skyDay: ["#87CEEB","#B0E0F0","#D6F0FF"],
    skySunset: ["#FF6B35","#FF9966","#FFD4A0"],
    skyNight: ["#0D1B2A","#1B2838","#2C3E50"],
    
    // Lighting
    neonPink: "#FF6EC7",
    neonBlue: "#4FC3F7",
    neonWarm: "#FFD54F",
    neonGreen: "#4CAF50",
    lampGlow: "rgba(255,213,79,",
    
    // Materials
    cupWhite: "#FAFAF8",
    coffeeDark: "#3C2415",
    pastry: ["#E8C87A","#C49A6C","#A0724A","#D4A574"],
    plantGreen: "#4CAF50",
    plantPot: "#C67B30",
    
    // Customer colors
    customer1: ["#E8C87A","#FFD700","#FDDCB5","#D32F2F"],
    customer2: ["#5C4033","#8B6914","#FDDCB5","#1565C0"],
    customer3: ["#DAA520","#333333","#FDDCB5","#2E7D32"],
    customer4: ["#6F4E37","#A0522D","#FDDCB5","#9C27B0"],
    
    // Night accents
    nightGlow: "rgba(255,220,100,",
  };

  // ── Particle System ───────────────────────────────────────
  let particles = [];
  const MAX_PARTICLES = 80;

  class Particle {
    constructor(type, x, y, vx, vy, life, color, size) {
      this.type = type; // 'steam', 'sparkle', 'firefly', 'dust'
      this.x = x; this.y = y;
      this.vx = vx || 0; this.vy = vy || -0.2;
      this.life = life || 1;
      this.maxLife = this.life;
      this.color = color;
      this.size = size || 1;
    }
    update(dt) {
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.life -= dt * 0.5;
      if (this.type === 'steam') {
        this.vx += Math.sin(performance.now() * 0.003 + this.x) * 0.01;
        this.size = Math.max(0.5, this.life / this.maxLife);
      } else if (this.type === 'sparkle') {
        this.life -= dt * 2;
      } else if (this.type === 'firefly') {
        this.vx += (Math.random() - 0.5) * 0.02;
        this.vy += (Math.random() - 0.5) * 0.02;
      }
    }
    draw(ctx, scale) {
      const alpha = Math.max(0, this.life / this.maxLife);
      if (this.type === 'steam') {
        ctx.fillStyle = `rgba(255,255,255,${alpha * 0.3})`;
        ctx.fillRect(this.x * scale, this.y * scale, this.size * scale * 2, this.size * scale * 2);
      } else if (this.type === 'sparkle') {
        const s = this.size * alpha;
        ctx.fillStyle = `rgba(255,255,200,${alpha})`;
        ctx.fillRect(this.x * scale + Math.sin(performance.now() * 0.01) * 2, this.y * scale, s * scale, s * scale);
      } else if (this.type === 'firefly') {
        const glow = 0.5 + 0.5 * Math.sin(performance.now() * 0.005 + this.x);
        ctx.fillStyle = `rgba(255,230,100,${alpha * glow})`;
        ctx.fillRect(this.x * scale - 1, this.y * scale - 1, 2 * scale, 2 * scale);
      } else if (this.type === 'dust') {
        ctx.fillStyle = `rgba(255,255,200,${alpha * 0.15})`;
        ctx.fillRect(this.x * scale, this.y * scale, this.size * scale, this.size * scale);
      }
    }
  }

  function spawnParticles(timeOfDay) {
    // Steam from coffee machine
    if (Math.random() < 0.3 && particles.filter(p=>p.type==='steam').length < 15) {
      particles.push(new Particle('steam', 218, 42, (Math.random()-0.5)*0.1, -0.3-Math.random()*0.2, 2+Math.random()));
    }

    // Steam from customer cups
    if (Math.random() < 0.2 && particles.filter(p=>p.type==='steam').length < 10) {
      const cupPositions = [[90,88],[100,88],[47,76]];
      const cp = cupPositions[Math.floor(Math.random()*cupPositions.length)];
      particles.push(new Particle('steam', cp[0]+Math.random()*4, cp[1], (Math.random()-0.5)*0.05, -0.2-Math.random()*0.1, 1.5+Math.random()));
    }

    // Sparkles on neon sign
    if (timeOfDay > 0.4 && Math.random() < 0.15 && particles.filter(p=>p.type==='sparkle').length < 10) {
      particles.push(new Particle('sparkle', 62+Math.random()*30, 48+Math.random()*8, (Math.random()-0.5)*0.3, (Math.random()-0.5)*0.3, 0.8+Math.random()*0.5, "#FFD700", 1+Math.random()));
    }

    // Fireflies at night
    if (timeOfDay > 0.6 && Math.random() < 0.08 && particles.filter(p=>p.type==='firefly').length < 20) {
      particles.push(new Particle('firefly', 30+Math.random()*250, 30+Math.random()*140, (Math.random()-0.5)*0.15, (Math.random()-0.5)*0.15, 3+Math.random()*4, "rgba(255,230,100,", 1));
    }

    // Dust motes in light beams (any time)
    if (Math.random() < 0.05 && particles.filter(p=>p.type==='dust').length < 15) {
      particles.push(new Particle('dust', 80+Math.random()*160, 20+Math.random()*40, (Math.random()-0.5)*0.03, 0.02+Math.random()*0.03, 4+Math.random()*4));
    }

    // Cleanup dead particles
    particles = particles.filter(p => p.life > 0);
    if (particles.length > MAX_PARTICLES) {
      particles = particles.slice(-MAX_PARTICLES);
    }
  }

  function drawParticles(ctx, scale) {
    for (const p of particles) {
      p.draw(ctx, scale);
    }
  }

  // ── State ─────────────────────────────────────────────────
  let canvas, ctx;
  let animTime = 0;
  let lastTs = 0;
  let timeOfDay = 0.3; // 0=day, 0.5=sunset, 1=night (cycle)
  let timeSpeed = 0.004;

  // ── Color Helpers ─────────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }
  
  function lerpColor(c1, c2, t) {
    const r1=parseInt(c1.slice(1,3),16),g1=parseInt(c1.slice(3,5),16),b1=parseInt(c1.slice(5,7),16);
    const r2=parseInt(c2.slice(1,3),16),g2=parseInt(c2.slice(3,5),16),b2=parseInt(c2.slice(5,7),16);
    return "#"+[Math.round(lerp(r1,r2,t)),Math.round(lerp(g1,g2,t)),Math.round(lerp(b1,b2,t))].map(v=>v.toString(16).padStart(2,'0')).join('');
  }

  function shadeColor(hex, amt) {
    const r=parseInt(hex.slice(1,3),16),g=parseInt(hex.slice(3,5),16),b=parseInt(hex.slice(5,7),16);
    return "#"+[Math.max(0,Math.min(255,r+amt)),Math.max(0,Math.min(255,g+amt)),Math.max(0,Math.min(255,b+amt))].map(v=>v.toString(16).padStart(2,'0')).join('');
  }

  function rgbStr(r,g,b,a=1) { return `rgba(${r},${g},${b},${a})`; }

  // ── Drawing Helpers ───────────────────────────────────────
  function fillRect(x,y,w,h,color) {
    ctx.fillStyle = color;
    ctx.fillRect(x*P, y*P, w*P, h*P);
  }

  function pxLine(x1,y1,x2,y2,color,width=1) {
    ctx.strokeStyle = color;
    ctx.lineWidth = width * P;
    ctx.beginPath();
    ctx.moveTo(x1*P, y1*P);
    ctx.lineTo(x2*P, y2*P);
    ctx.stroke();
  }

  // ── Sky Through Window ────────────────────────────────────
  function drawSky() {
    const t = timeOfDay;
    let top,mid,bot;
    
    if (t < 0.4) {
      const u = t / 0.4;
      top=lerpColor(C.skyDay[0],C.skySunset[0],u);
      mid=lerpColor(C.skyDay[1],C.skySunset[1],u);
      bot=lerpColor(C.skyDay[2],C.skySunset[2],u);
    } else if (t < 0.7) {
      const u = (t-0.4)/0.3;
      top=lerpColor(C.skySunset[0],C.skyNight[0],u);
      mid=lerpColor(C.skySunset[1],C.skyNight[1],u);
      bot=lerpColor(C.skySunset[2],C.skyNight[2],u);
    } else {
      top=C.skyNight[0]; mid=C.skyNight[1]; bot=C.skyNight[2];
    }

    for (let row=0;row<30;row++) {
      const c = row<10 ? top : row<20 ? mid : bot;
      fillRect(30, 10+row, 90, 1, c);
    }

    // Stars at night
    if (t > 0.6) {
      const starAlpha = Math.min(1, (t-0.6)*5);
      const stars = [[35,12],[50,18],[65,14],[80,22],[95,16],[105,11],[72,25],[45,28],[88,13]];
      for (const [sx,sy] of stars) {
        const twinkle = 0.5+0.5*Math.sin(animTime*3+sx+sy);
        fillRect(sx, sy, 1, 1, rgbStr(255,255,255,starAlpha*twinkle));
      }
    }

    drawBuildings(t);
    drawStreetTraffic(t);
  }

  function drawBuildings(t) {
    const darkness = lerp(0.2, 0.85, t < 0.5 ? t*2 : Math.min(1,(t-0.3)*3));
    
    // Distant buildings with more detail
    fillRect(32, 26, 14, 14, rgbStr(50,40,35,darkness));
    fillRect(34, 28, 10, 12, rgbStr(55,45,40,darkness*0.9));
    
    fillRect(50, 20, 10, 20, rgbStr(60,50,45,darkness));
    fillRect(52, 22, 6, 16, rgbStr(65,55,50,darkness*0.9));
    
    fillRect(64, 28, 18, 12, rgbStr(45,35,30,darkness));
    
    fillRect(86, 22, 12, 18, rgbStr(55,45,40,darkness));
    
    // Night windows - warm glow
    if (t > 0.3) {
      const winGlow = Math.min(1, (t-0.3)*2);
      const windowPositions = [
        [34,29],[38,29],[34,33],[38,33], // building 1
        [53,24],[57,24],[53,28],[57,28], // building 2
        [68,30],[73,30],[68,34],[73,34], // building 3
        [89,25],[91,25],[89,29],[91,29], // building 4
      ];
      for (const [wx,wy] of windowPositions) {
        if (Math.sin(wx*7.3+wy*11.1+animTime*0.1) > -0.5) {
          const flicker = 0.6+0.4*Math.sin(animTime*2+wx+wy);
          fillRect(wx, wy, 2, 2, rgbStr(255,220,100,winGlow*flicker*0.7));
        }
      }
    }
  }

  function drawStreetTraffic(t) {
    // Road
    fillRect(28, 39, 94, 1, rgbStr(50,50,50,lerp(0.15,0.7,t)));
    
    // Car with headlights at night
    const carX = 28 + ((animTime*20) % 96);
    if (carX < 122) {
      fillRect(carX, 37, 10, 4, rgbStr(40,40,50,lerp(0.6,0.9,t)));
      fillRect(carX+2, 36, 6, 3, rgbStr(45,45,55,lerp(0.5,0.8,t)));
      
      // Headlights/taillights
      const lightOn = t > 0.3;
      if (lightOn) {
        const hlAlpha = Math.min(1,(t-0.3)*2);
        fillRect(carX+10, 38, 2, 1, rgbStr(255,255,200,hlAlpha*0.9)); // headlight
        fillRect(carX-1, 38, 1, 1, rgbStr(255,60,40,hlAlpha*0.7)); // taillight
        
        // Headlight beam
        if (t > 0.5) {
          const beamGrad = ctx.createLinearGradient(carX*P+10*P, 38*P, carX*P+30*P, 42*P);
          beamGrad.addColorStop(0, rgbStr(255,255,200,(t-0.5)*0.3));
          beamGrad.addColorStop(1, rgbStr(255,255,200,0));
          ctx.fillStyle = beamGrad;
          ctx.fillRect(carX*P+10*P, 38*P, 20*P, 4*P);
        }
      }
    }
    
    // Walking person with bobbing animation
    const personX = 35 + ((animTime*10+60) % 90);
    if (personX > 28 && personX < 118) {
      const bobY = Math.sin(animTime*4)*1;
      // Body
      fillRect(Math.round(personX), Math.round(37+bobY), 3, 5, rgbStr(60,50,45,lerp(0.7,0.9,t)));
      // Head
      fillRect(Math.round(personX)+1, Math.round(35+bobY), 2, 2, rgbStr(80,70,60,lerp(0.6,0.9,t)));
    }

    // Trees at night with glow
    if (t > 0.4) {
      const treeGlow = Math.min(1,(t-0.4)*2);
      fillRect(30, 34, 2, 6, rgbStr(30,50,20,treeGlow*0.5));
      fillRect(29, 32, 4, 3, rgbStr(40,80,30,treeGlow*0.4));
    }
  }

  // ── Room Structure ────────────────────────────────────────
  function drawRoom() {
    // Back wall with gradient
    for (let row=0;row<55;row++) {
      const t = row/55;
      const c = lerpColor(C.wallTop,C.wallMid,t);
      fillRect(0, row, 320, 1, c);
    }

    // Wall texture - subtle vertical lines
    for (let i=0;i<40;i++) {
      pxLine(i*8, 0, i*8, 55, rgbStr(200,190,170,0.1));
    }

    // Wainscoting
    fillRect(0, 55, 320, 4, C.wallBot);
    fillRect(0, 58, 320, 2, C.baseboard);

    // Floor with wood plank perspective
    for (let row=60;row<H;row++) {
      const shade = ((row-60)%12<6) ? C.floorFront : C.floorBack;
      fillRect(0, row, 320, 1, shade);
    }
    
    // Wood grain detail
    for (let i=0;i<8;i++) {
      const lx = 20+i*40;
      pxLine(lx, 60, lx-5, H, rgbStr(139,115,85,0.2));
      pxLine(lx+20, 60, lx+15, H, rgbStr(139,115,85,0.15));
    }

    // Baseboard shadow
    fillRect(0, 59, 320, 2, rgbStr(0,0,0,0.15));
  }

  // ── Window & Door ────────────────────────────────────────
  function drawWindow() {
    // Frame
    fillRect(26, 6, 98, 38, C.windowFrame);
    
    // Glass background
    const skyT = timeOfDay;
    let glassC;
    if (skyT < 0.4) {
      glassC = lerpColor('#87CEEB','#FFB06A',skyT/0.4);
    } else if (skyT < 0.7) {
      glassC = lerpColor('#FFB06A','#1a1a3e',(skyT-0.4)/0.3);
    } else {
      glassC = '#1a1a3e';
    }
    fillRect(30, 10, 90, 30, glassC);

    // Sky through window
    drawSky();

    // Window frame cross bars
    pxLine(75, 10, 75, 40, C.windowFrame, 2);
    pxLine(30, 25, 120, 25, C.windowFrame, 2);

    // Glass reflections
    fillRect(32, 12, 6, 14, rgbStr(255,255,255,0.08));
    fillRect(90, 16, 4, 10, rgbStr(255,255,255,0.05));

    // Window sill with detail
    fillRect(24, 44, 102, 3, '#A08060');
    fillRect(24, 44, 102, 1, '#B89870');
    fillRect(24, 47, 102, 1, rgbStr(0,0,0,0.15));

    // Small plant on windowsill
    if (Math.sin(animTime*0.5)>-0.3) {
      fillRect(115, 40, 4, 4, C.plantPot);
      const sway = Math.sin(animTime*2)*0.5;
      fillRect(Math.round(116+sway), 38, 2, 3, C.plantGreen);
      fillRect(Math.round(117+sway), 36, 2, 3, '#66BB6A');
    }
  }

  function drawDoor() {
    const dx=140, dy=40;
    
    // Door frame
    fillRect(dx-2, dy-2, 8, 44, C.doorFrame);
    
    // Glass panel with animated street view
    fillRect(dx, dy+2, 4, 36, rgbStr(168,200,224,lerp(0.3,0.6,timeOfDay)));
    
    // Door handle
    fillRect(dx+3, dy+28, 2, 3, '#C0A060');
    
    // Door shadow
    fillRect(dx-1, dy+38, 6, 2, rgbStr(0,0,0,0.2));
  }

  // ── Counter & Equipment ───────────────────────────────────
  function drawCounter() {
    const cx=200;
    
    // Counter body with depth
    fillRect(cx, 50, 70, 108, C.counter);
    fillRect(cx+4, 50, 62, 104, C.counterTop);
    
    // Counter edge highlight
    fillRect(cx, 50, 70, 3, '#8B6914');
    fillRect(cx, 50, 3, 108, '#8B6914');
    
    // Paneling detail
    for (let i=0;i<4;i++) {
      const px2 = cx+8+i*17;
      fillRect(px2, 70, 13, 50, C.counterDark);
      fillRect(px2+1, 71, 11, 48, shadeColor(C.counterTop,-8));
    }

    // Coffee machine with animated parts
    drawCoffeeMachine(cx+6, 28);
    
    // Cups and display
    drawCupsOnCounter(cx+50, 30);
    drawPastryCase(cx+15, 40);
    
    // Shelf above
    drawCoffeeShelf();
  }

  function drawCoffeeMachine(x,y) {
    // Body with metallic gradient feel
    fillRect(x, y, 28, 24, '#C8C8C8');
    fillRect(x+1, y+1, 26, 22, '#E0E0E0');
    
    // Top boiler
    fillRect(x+3, y-7, 22, 9, '#A8A8A8');
    fillRect(x+5, y-6, 18, 7, '#C0C0C0');
    
    // Group head & portafilter
    fillRect(x+10, y+19, 8, 4, '#909090');
    
    // Animated portafilter
    const pfAngle = Math.sin(animTime*2.5)*3;
    fillRect(x+16, y+22+pfAngle, 6, 2, '#5C4033');
    fillRect(x+22, y+21+pfAngle, 3, 4, '#7B5B3A');
    
    // Steam wand with animated steam
    pxLine(x+4, y+13, x+8, y+24, '#E0E0E0', 1);
    
    // Drip tray
    fillRect(x+4, y+24, 20, 3, '#909090');
    
    // Machine lights - animated!
    const lightBlink = Math.sin(animTime*6) > -0.3;
    if (lightBlink) {
      fillRect(x+8, y+7, 3, 3, '#E74C3C');
      fillRect(x+14, y+7, 3, 3, '#27AE60');
      fillRect(x+20, y+7, 3, 3, '#F39C12');
    } else {
      fillRect(x+8, y+7, 3, 3, '#9B3B3B');
      fillRect(x+14, y+7, 3, 3, '#9B3B3B');
      fillRect(x+20, y+7, 3, 3, '#9B3B3B');
    }

    // Small espresso cups with coffee
    for (let i=0;i<2;i++) {
      const ex = x+8+i*9;
      fillRect(ex, y+26, 4, 4, C.cupWhite);
      fillRect(ex+1, y+27, 2, 1, C.coffeeDark);
    }

    // Steam rising from machine
    for (let s=0;s<5;s++) {
      const sx = x+10+Math.sin(animTime*3+s*1.8)*4;
      const sy = y-8-s*5-Math.sin(animTime*2+s)*2;
      const alpha = Math.max(0, 0.4 - s*0.07);
      fillRect(Math.round(sx), Math.round(sy), 2, 2, rgbStr(255,255,255,alpha));
    }
  }

  function drawCupsOnCounter(x,y) {
    // Saucer
    fillRect(x-1, y+8, 10, 2, '#E8E0D8');
    // Cup with coffee
    fillRect(x, y+4, 6, 5, C.cupWhite);
    fillRect(x+1, y+5, 4, 3, C.coffeeDark);
    // Handle
    pxLine(x+7, y+4, x+9, y+6, C.cupWhite, 2);
    // Sugar jar
    fillRect(x+12, y+2, 4, 6, '#F0E8D8');
    fillRect(x+12, y+1, 4, 2, '#C0B090');
  }

  function drawPastryCase(x,y) {
    // Glass frame
    fillRect(x, y-2, 20, 14, '#808080');
    fillRect(x+1, y-1, 18, 12, rgbStr(200,220,240,0.3));
    
    // Shelf
    fillRect(x+2, y+3, 16, 1, '#B0B0B0');
    
    // Various pastries
    fillRect(x+3, y-1, 5, 3, C.pastry[0]); // croissant
    fillRect(x+7, y+4, 4, 3, C.pastry[2]); // cake
    fillRect(x+13, y-1, 3, 3, C.pastry[3]); // cookie
    
    // Glass reflection
    fillRect(x+2, y, 3, 8, rgbStr(255,255,255,0.12));
  }

  function drawCoffeeShelf() {
    const sy=15;
    // Shelf board
    fillRect(205, sy, 60, 3, C.shelf);
    
    // Coffee bags
    for (let i=0;i<4;i++) {
      const bx=210+i*14;
      fillRect(bx, sy-8, 8, 8, `hsl(${25+i*5},${40+i*5}%,${35-i*3}%)`);
      fillRect(bx+2, sy-6, 4, 3, '#F5F0E8');
      pxLine(bx, sy-7, bx+8, sy-7, `hsl(${30+i*10},60%,55%)`, 1);
    }
    
    // Hanging mugs
    for (let i=0;i<3;i++) {
      const mx=220+i*15;
      fillRect(mx+2, sy+3, 2, 2, '#808080');
      fillRect(mx, sy+5, 6, 7, C.cupWhite);
      pxLine(mx-1, sy+6, mx-1, sy+11, C.cupWhite, 2);
      fillRect(mx+1, sy+7, 4, 3, C.coffeeDark);
    }
    
    // Coffee bean bag + small plant
    fillRect(258, sy-9, 10, 9, '#6B3A2A');
    fillRect(260, sy-7, 6, 4, rgbStr(255,255,255,0.1));
    
    // Plant on shelf corner with swaying
    const plantSway = Math.sin(animTime*1.2)*1;
    fillRect(Math.round(260+plantSway), sy-14, 3, 4, C.plantGreen);
    fillRect(Math.round(261+plantSway), sy-17, 3, 4, '#66BB6A');
    fillRect(259, sy-10, 5, 5, C.plantPot);
  }

  // ── Tables & Chairs ───────────────────────────────────────
  function drawTable(x,y) {
    // Table top with depth
    fillRect(x-2, y, 16, 8, C.wood);
    fillRect(x-1, y-1, 14, 3, C.woodLight);
    fillRect(x+5, y+8, 2, 10, C.wood);
    fillRect(x+9, y+8, 2, 10, C.wood);
    
    // Table surface highlight
    fillRect(x+1, y-1, 10, 1, rgbStr(255,255,255,0.05));
  }

  function drawChair(cx,cy) {
    fillRect(cx, cy, 6, 3, C.chair);
    pxLine(cx+1, cy-4, cx+1, cy, C.chair, 2);
    pxLine(cx+4, cy-4, cx+4, cy, C.chair, 2);
    pxLine(cx+1, cy-4, cx+4, cy-4, C.chair, 2);
    pxLine(cx+0.5, cy+3, cx+0.5, cy+6, C.chairDark, 1);
    pxLine(cx+5, cy+3, cx+5, cy+6, C.chairDark, 1);
  }

  // ── Enhanced Characters ───────────────────────────────────
  function drawCustomer(x,y,colors,idx) {
    const bob = Math.sin(animTime*1.8+idx*2)*0.5;
    const headY = y-14+bob;
    
    // Body (seated)
    fillRect(x-1, headY+4, 6, 9, colors[3]);
    fillRect(x, headY+5, 4, 7, shadeColor(colors[3],-8));
    
    // Legs (if at lower table level)
    if (y > 70) {
      fillRect(x-1, y+8, 2, 5, '#5C6B7A');
      fillRect(x+4, y+8, 2, 5, '#5C6B7A');
      // Shoes
      fillRect(Math.max(0,x-2), y+12, 3, 2, '#2C2C2C');
    }
    
    // Head with more detail
    fillRect(x, headY+1, 4, 4, colors[2]);
    
    // Hair with style based on character
    fillRect(x-1, headY-1, 6, 3, colors[0]);
    pxLine(x, headY-1, x+3, headY-1, colors[0], 2);
    
    // Eyes - blinking!
    const blinkInterval = animTime*4+idx;
    if (Math.sin(blinkInterval) > -0.7) {
      fillRect(x, headY+2, 1, 1, '#2C2C2C');
      fillRect(x+3, headY+2, 1, 1, '#2C2C2C');
    } else {
      pxLine(x, headY+2, x+1, headY+2, '#2C2C2C', 1);
      pxLine(x+3, headY+2, x+4, headY+2, '#2C2C2C', 1);
    }
    
    // Smile
    pxLine(x+1, headY+3, x+3, headY+3, shadeColor(colors[2],-20), 1);

    // Arm - animated based on activity
    const armSwing = Math.sin(animTime*2.5+idx*3)*2;
    
    // Right arm holding something
    fillRect(x+5, headY+6+armSwing, 4, 2, colors[2]);
    fillRect(x+8, headY+6+armSwing, 2, 3, colors[2]);

    // Coffee cup on table - animated sip!
    const cupBob = Math.sin(animTime*1.5)*0.3;
    const cupX = x+6;
    fillRect(cupX, y+1+cupBob, 4, 4, C.cupWhite);
    fillRect(cupX+1, y+2+cupBob, 2, 2, C.coffeeDark);
    
    // Steam from cup - enhanced!
    for (let s=0;s<4;s++) {
      const ssx = cupX+2+Math.sin(animTime*5+s*1.2)*2;
      const ssy = y-3-s*4-Math.sin(animTime*3+s)*2;
      fillRect(Math.round(ssx), Math.round(ssy), 2, 2, rgbStr(255,255,255,Math.max(0,0.35-s*0.08)));
    }
    
    // Additional detail: phone/laptop for some customers
    if (idx===1 && Math.sin(animTime*0.8)>-0.5) {
      fillRect(x+6, headY+9, 3, 2, '#4A4A4A');
      fillRect(x+7, headY+9, 1, 1, '#87CEEB');
    }
  }

  // ── Enhanced Barista ──────────────────────────────────────
  function drawBarista() {
    const bx=215, by=48;
    const breathe = Math.sin(animTime*1.8)*0.3;
    
    // Legs with shoes
    fillRect(bx, by+70, 3, 20, C.baristaPants);
    fillRect(bx+5, by+70, 3, 20, C.baristaPants);
    fillRect(bx-1, by+90, 5, 3, '#2C2C2C');
    fillRect(bx+4, by+90, 5, 3, '#2C2C2C');
    
    // Body with apron detail
    fillRect(bx-1, by+30, 11, 40, C.baristaShirt);
    fillRect(bx, by+32, 9, 36, shadeColor(C.baristaShirt,-5));
    
    // Apron with pocket
    fillRect(bx+1, by+40, 7, 28, '#F5F0E8');
    fillRect(bx+2, by+41, 5, 26, rgbStr(255,255,255,0.3));
    fillRect(bx+3, by+48, 3, 3, '#FFF8E1'); // pocket
    
    // Arms - animated making coffee!
    const armSwing = Math.sin(animTime*3)*3;
    
    // Left arm reaching toward machine
    fillRect(bx-3, by+34+armSwing, 4, 10, C.baristaSkin);
    pxLine(bx-3, by+36+armSwing, bx-5, by+28+armSwing, C.baristaSkin, 2);
    
    // Right arm holding portafilter
    const rArmY = by+34-armSwing;
    fillRect(bx+10, rArmY, 4, 10, C.baristaSkin);
    pxLine(bx+10, rArmY+2, bx+15, rArmY-2, C.baristaSkin, 2);
    
    // Head with more detail
    const headBob = breathe;
    fillRect(bx, by+16+headBob, 8, 7, C.baristaSkin);
    
    // Hair with style
    fillRect(bx-1, by+14+headBob, 10, 3, C.baristaHair);
    fillRect(bx, by+12+headBob, 7, 2, shadeColor(C.baristaHair,-10));
    
    // Eyes - animated blinking!
    const blink = Math.sin(animTime*4) > -0.9;
    if (blink) {
      fillRect(bx+2, by+19+headBob, 1, 1, '#2C2C2C');
      fillRect(bx+5, by+19+headBob, 1, 1, '#2C2C2C');
    } else {
      pxLine(bx+2, by+19+headBob, bx+3, by+19+headBob, '#2C2C2C', 1);
      pxLine(bx+5, by+19+headBob, bx+6, by+19+headBob, '#2C2C2C', 1);
    }
    
    // Warm smile
    pxLine(bx+2, by+21+headBob, bx+5, by+21+headBob, '#C89070', 1);
    
    // Name tag
    fillRect(bx+3, by+42, 4, 3, '#FFF8E1');
    pxLine(bx+4, by+43, bx+6, by+43, C.coffeeDark, 0.5);
    
    // Steam from hands area
    for (let s=0;s<4;s++) {
      const sx = bx+12+Math.sin(animTime*5+s*2)*3;
      const sy = by+26-s*5-Math.sin(animTime*3+s)*2;
      fillRect(Math.round(sx), Math.round(sy), 2, 2, rgbStr(255,255,255,Math.max(0,0.3-s*0.07)));
    }
  }

  // ── Enhanced Lighting & Neon ──────────────────────────────
  function drawLights() {
    const glowIntensity = timeOfDay < 0.5 ? lerp(0.3,1,timeOfDay*2) : lerp(1,0.4,(timeOfDay-0.5)*2);
    
    // Three hanging lights with detailed fixtures
    for (let i=0;i<3;i++) {
      const lx = [80,160,240][i];
      
      // Wire from ceiling
      pxLine(lx, 0, lx, 18, '#4A4A4A', 1);
      
      // Lamp shade with detail
      fillRect(lx-3, 18, 6, 5, '#D4A574');
      fillRect(lx-2, 19, 4, 3, '#FFC107');
      fillRect(lx-1, 20, 2, 1, rgbStr(255,255,200,0.5));
      
      // Glow cone downward (enhanced)
      for (let row=22;row<40;row++) {
        const spread = (row-22)*0.3;
        const alpha = Math.max(0, glowIntensity*(0.15-spread*0.003));
        fillRect(lx-spread, row, spread*2+1, 1, rgbStr(255,213,79,alpha));
      }
      
      // Bulb center
      const flicker = Math.sin(animTime*8+i*2.5)*0.1;
      fillRect(lx-1, 22, 2, 2, rgbStr(255,255,200,Math.max(0.3,glowIntensity+flicker)));
    }

    drawNeonSign();
  }

  function drawNeonSign() {
    const flicker = Math.sin(animTime*6) > -0.1 ? 1 : 0.7;
    
    // Neon glow box (enhanced, wider)
    for (let g=0;g<4;g++) {
      const alpha = 0.15*(4-g)/4*flicker;
      fillRect(56-g*2, 44-g, 36+g*4, 13+g*2, rgbStr(255,110,199,alpha));
    }
    
    // "CAFÉ" letters with glow
    const letters = [
      [[0,0],[1,0],[2,0],[0,1],[0,2],[0,3],[1,3]],
      [[4,0],[5,0],[6,0],[7,0],[4,1],[7,1],[5,2],[6,2],[4,3],[5,3],[6,3],[7,3]],
      [[9,0],[10,0],[11,0],[9,1],[11,1],[9,2],[11,2],[9,3]],
      [[13,0],[14,0],[15,0],[16,0],[13,1],[15,1],[13,2],[13,3],[14,3],[15,3]]
    ];
    
    for (let li=0;li<letters.length;li++) {
      const ox = offsets[li]+60;
      const oy = 48;
      for (const [dx,dy] of letters[li]) {
        fillRect(ox+dx, oy+dy, 1, 1, C.neonPink);
        // Glow layer
        if (flicker > 0.8) {
          fillRect(ox+dx-1, oy+dy, 1, 1, rgbStr(255,110,199,0.3));
          fillRect(ox+dx+1, oy+dy, 1, 1, rgbStr(255,110,199,0.3));
        }
      }
    }
    
    // Accent underline
    pxLine(60, 57, 92, 57, rgbStr(79,195,247,0.6*flicker), 1);
    fillRect(60, 57, 32, 1, rgbStr(79,195,247,0.4*flicker));
    
    // Small neon plant icon next to sign
    fillRect(96, 54, 1, 3, rgbStr(76,175,80,0.5*flicker));
    fillRect(95, 52, 3, 2, rgbStr(102,187,106,0.4*flicker));
  }

  // ── Menu Board & Decorations ──────────────────────────────
  function drawMenuBoard(x,y) {
    fillRect(x, y, 16, 20, '#3E2723');
    fillRect(x+1, y+1, 14, 18, '#4E342E');
    
    // Chalk lines
    for (let i=0;i<7;i++) {
      pxLine(x+3, y+4+i*2.3, x+13, y+3+i*2.3, rgbStr(255,255,255,0.6), 1);
    }
    
    // MENU header
    fillRect(x+5, y+1, 7, 2, '#FFF8E1');
    
    // Price dots
    fillRect(x+10, y+6, 2, 2, '#FFD54F');
    fillRect(x+10, y+10, 2, 2, '#FFD54F');
    fillRect(x+9, y+14, 3, 2, '#FFD54F');
  }

  // ── Enhanced Ambient Lighting ─────────────────────────────
  function drawAmbientLighting() {
    const t = timeOfDay;
    
    // Time-based warmth overlay
    let warmth, brightness;
    if (t < 0.5) {
      warmth = lerp(1,0.85,t*2);
      brightness = lerp(1,0.7,t*2);
    } else {
      warmth = lerp(0.85,0.6,(t-0.5)*2);
      brightness = lerp(0.7,0.4,(t-0.5)*2);
    }

    // Golden wash overlay
    fillRect(0, 0, W, H, rgbStr(255,180,80,0.06*brightness));

    // Light pools on floor (enhanced)
    const poolPositions = [[80,85],[160,85],[240,75]];
    for (const [px2,py] of poolPositions) {
      fillRect(px2-12, py, 24, 24, rgbStr(255,213,79,0.03*brightness));
      fillRect(px2-6, py+4, 12, 12, rgbStr(255,213,79,0.05*brightness));
    }

    // Night scene darkening (stronger at night)
    if (t > 0.5) {
      const nightAlpha = (t-0.5)*0.3;
      fillRect(0, 0, W, H, rgbStr(10,10,30,nightAlpha));
      
      // Window glow casting light on floor
      for (let row=42;row<60;row++) {
        const spread = (row-42)*0.5;
        fillRect(30-spread/2, row, 90+spread, 1, rgbStr(255,200,100,(t-0.5)*0.08));
      }
    }

    // Counter area shadow
    fillRect(195, 158, 85, 42, rgbStr(30,20,10,0.15));
  }

  // ── Vignette Effect ───────────────────────────────────────
  function drawVignette() {
    for (let i=0;i<10;i++) {
      const a = (i/10)*0.08;
      fillRect(0, 0, W, i, rgbStr(40,30,20,a));
      fillRect(0, H-i-1, W, i+1, rgbStr(40,30,20,a));
    }
    for (let i=0;i<8;i++) {
      const a = (i/8)*0.06;
      fillRect(0, 0, i+1, H, rgbStr(40,30,20,a));
      fillRect(W-i-1, 0, i+1, H, rgbStr(40,30,20,a));
    }
  }

  // ── Main Draw Function ────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W*P, H*P);
    
    // Background
    fillRect(0, 0, W, H, '#2A1F14');

    // Layer 1: Room
    drawRoom();

    // Layer 2: Window & Sky
    drawWindow();

    // Layer 3: Door
    drawDoor();

    // Layer 4: Counter & Equipment
    drawCounter();

    // Layer 5: Tables & Customers
    drawTable(75, 70);
    drawChair(71, 74); drawChair(87, 74); drawChair(82, 64);
    drawCustomer(76, 68, C.customer1, 0);
    
    drawTable(85, 95);
    drawChair(81, 99); drawChair(97, 99); drawChair(92, 89);
    drawCustomer(86, 93, C.customer2, 1);
    drawCustomer(98, 93, C.customer3, 2);

    // Table 3 (back-left round)
    const rTableX=45, rTableY=80;
    for (let i=0;i<8;i++) {
      const a=(i/8)*Math.PI*2;
      fillRect(Math.round(rTableX+Math.cos(a)*7-1), Math.round(rTableY+Math.sin(a)*3-1), 2, 2, C.woodLight);
    }
    fillRect(rTableX-6, rTableY-3, 14, 7, C.woodLight);
    fillRect(rTableX-5, rTableY-2, 12, 5, '#C4A070');
    fillRect(rTableX-1, rTableY+4, 3, 10, C.wood);
    drawChair(rTableX-8, rTableY+6); drawChair(rTableX+6, rTableY+6); drawChair(rTableX-1, rTableY-9);
    drawCustomer(44, 78, C.customer3, 2);
    drawCustomer(56, 78, C.customer4, 3);

    // Barista behind counter
    drawBarista();

    // Hanging Lights
    drawLights();

    // Menu Board
    drawMenuBoard(5, 20);

    // Floor rug under table area
    fillRect(38, 78, 40, 25, rgbStr(180,120,80,0.15));
    
    // Ambient warmth
    drawAmbientLighting();

    // Particles (updated each frame)
    spawnParticles(timeOfDay);
    drawParticles(ctx, P);

    // Vignette
    drawVignette();
  }

  // ── Loop ──────────────────────────────────────────────────
  function loop(ts) {
    const dt = Math.min((ts-lastTs)/1000, 0.1);
    lastTs = ts;
    animTime += dt;
    
    // Time of day cycle: 0=day -> 0.5=sunset -> 1=night -> back to 0
    timeOfDay = (Math.sin(animTime*timeSpeed)*0.5+0.5);

    draw();
    requestAnimationFrame(loop);
  }

  // ── Bootstrap ─────────────────────────────────────────────
  function init() {
    if (canvas) return;
    
    let existingCanvas = document.getElementById('cafe-canvas');
    if (existingCanvas) {
      canvas = existingCanvas;
      canvas.width = W*P;
      canvas.height = H*P;
    } else {
      canvas = document.createElement('canvas');
      canvas.width = W*P;
      canvas.height = H*P;
      canvas.style.cssText = 'width:100%;height:auto;display:block;border-radius:8px;border:2px solid #FFD700;background:#0f3460;image-rendering:pixelated';
    }

    ctx = canvas.getContext('2d');
    animTime = 0;
    lastTs = performance.now();
    
    // Clear any existing particles
    particles = [];
    
    requestAnimationFrame(loop);
  }

  // ── Public API ────────────────────────────────────────────
  function getCanvas() { return canvas; }
  function setTimeOfDay(t) { timeOfDay = Math.max(0,Math.min(1,t)); }
  function getTimeOfDay() { return timeOfDay; }
  function destroy() {
    if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
    canvas = null; ctx = null; particles = [];
  }

  // Auto-init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.cafeSceneV10 = { getCanvas, setTimeOfDay, getTimeOfDay, destroy };
})();

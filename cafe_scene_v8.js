/**
 * cafe_scene_v8.js - Interior Cafe Scene (Bên Trong Quán)
 * Pixel art 320x200px cozy cafe interior with warm atmosphere.
 * Standalone bootstrap — runs via <script src="cafe_scene_v8.js"></script>
 */
(function() {
  "use strict";

  // ── Constants ──────────────────────────────────────────────
  const W = 320, H = 200;
  const P = 2; // pixel scale for crisp rendering

  // ── Color Palette ─────────────────────────────────────────
  const C = {
    wallTop:    "#F5E6D3",   // warm light wall
    wallBot:    "#E8D5C4",   // warm dark wall
    floorFront: "#A0906D",   // wood light
    floorBack:  "#8B7355",   // wood dark
    shelf:      "#7B5B3A",
    counterTop: "#5C3D2E",
    counter:    "#654321",
    counterDark:"#4A3020",
    baristaSkin:"#FDDCB5",
    baristaShirt:"#2C5F7C",
    baristaPants:"#3B3B3F",
    table:      "#9B6E4F",
    tableTop:   "#B8956A",
    chair:      "#8B5E3C",
    windowFrame:"#5A4A3A",
    glassDay:   "#87CEEB",
    glassSunset:"#FF8C42",
    glassNight: "#1A1A3E",
    skyDay:     ["#87CEEB","#B0E0F0","#D6F0FF"],
    skySunset:  ["#FF6B35","#FF9966","#FFD4A0"],
    skyNight:   ["#0D1B2A","#1B2838","#2C3E50"],
    neonPink:   "#FF6EC7",
    neonBlue:   "#4FC3F7",
    neonWarm:   "#FFD54F",
    lampGlow:   "rgba(255,213,79,0.15)",
    steam:      ["#FFFFFF","#E8E8E8","#D4D4D4"],
    coffeeDark: "#3C2415",
    cupWhite:   "#FAFAF8",
    pastry:     ["#E8C87A","#C49A6C","#A0724A","#D4A574"],
    plantGreen: "#4CAF50",
    plantPot:   "#C67B30",
    baristaHair:"#3B2F1B",
    customer1:  ["#E8C87A","#FFD700","Skin","#D32F2F"],
    customer2:  ["#5C4033","#8B6914","Skin","#1565C0"],
    customer3:  ["#DAA520","#333333","Skin","#2E7D32"],
    customer4:  ["#6F4E37","#A0522D","Skin","#9C27B0"],
    barLight:   "#FFF8E1",
    doorFrame:  "#4A3020",
    doorGlass:  "#A8C8E0",
};

  // ── Scene State ───────────────────────────────────────────
  let canvas, ctx;
  let animTime = 0;
  let lastTs = 0;
  let timeOfDay = 0; // 0=day, 1=sunset, 2=night (0..1..0 cycle)
  let timeSpeed = 0.008; // cycles per second

  // ── Bootstrap ─────────────────────────────────────────────
  function init() {
    if (canvas) return;

    // Try to find existing canvas element first
    let existingCanvas = document.getElementById('cafe-canvas');
    if (existingCanvas) {
      canvas = existingCanvas;
      canvas.width = W * P;
      canvas.height = H * P;
    } else {
      canvas = document.createElement("canvas");
      canvas.width = W * P;
      canvas.height = H * P;
      canvas.style.width  = (W * P) + "px";
      canvas.style.height = (H * P) + "px";
      canvas.style.imageRendering = "pixelated";
      canvas.style.display = "block";
    }

    ctx = canvas.getContext("2d");

    animTime = 0;
    lastTs = performance.now();
    requestAnimationFrame(loop);
  }

  function loop(ts) {
    const dt = Math.min((ts - lastTs) / 1000, 0.1);
    lastTs = ts;
    animTime += dt;
    timeOfDay = (Math.sin(animTime * timeSpeed) * 0.5 + 0.5); // 0→1→0

    draw();
    requestAnimationFrame(loop);
  }

  // ── Drawing Helpers ───────────────────────────────────────
  function px(x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(x * P, y * P, w * P, h * P);
  }

  function pxLine(x1,y1,x2,y2,color,width) {
    ctx.strokeStyle = color;
    ctx.lineWidth = (width || 1) * P;
    ctx.beginPath();
    ctx.moveTo(x1 * P, y1 * P);
    ctx.lineTo(x2 * P, y2 * P);
    ctx.stroke();
  }

  function fillRect(x,y,w,h,color) {
    px(x,y,w,h,color);
  }

  // ── Sky / Outside Window ──────────────────────────────────
  function drawSky() {
    const t = timeOfDay;
    let top, mid, bot;
    if (t < 0.5) {
      // day → sunset
      const u = t * 2;
      top   = lerpColor(C.skyDay[0], C.skySunset[0], u);
      mid   = lerpColor(C.skyDay[1], C.skySunset[1], u);
      bot   = lerpColor(C.skyDay[2], C.skySunset[2], u);
    } else {
      // sunset → night
      const u = (t - 0.5) * 2;
      top   = lerpColor(C.skySunset[0], C.skyNight[0], u);
      mid   = lerpColor(C.skySunset[1], C.skyNight[1], u);
      bot   = lerpColor(C.skySunset[2], C.skyNight[2], u);
    }

    // Gradient sky through window
    for (let row = 0; row < 30; row++) {
      let c;
      if (row < 10) c = top;
      else if (row < 20) c = mid;
      else c = bot;
      px(30, 10 + row, 90, 1, c);
    }

    // Distant buildings silhouette
    const darkness = t < 0.5 ? lerp(0.2, 0.7, t * 2) : lerp(0.7, 1.0, (t-0.5)*2);
    drawBuildings(darkness);

    // Street / people / cars passing by window
    drawStreetTraffic(darkness);
  }

  function drawBuildings(darkness) {
    const base = lerp(0.3, 0.8, darkness);
    pxLine(25, 40, 125, 40, `rgba(60,40,30,${base})`, 2);

    // Building blocks behind glass
    fillRect(30, 28, 12, 12, `rgba(80,60,50,${base * 0.6})`);
    fillRect(48, 22, 8, 18, `rgba(90,70,55,${base * 0.6})`);
    fillRect(60, 30, 15, 10, `rgba(70,55,40,${base * 0.6})`);
    fillRect(80, 25, 10, 15, `rgba(85,65,45,${base * 0.6})`);
    fillRect(95, 32, 20, 8,  `rgba(75,55,35,${base * 0.6})`);

    // Windows in buildings (warm glow at night)
    const winGlow = t < 0.5 ? lerp(0, 0.8, t*2 - 0.3) : lerp(0.8, 1, (t-0.6)*2.5);
    if (winGlow > 0.2) {
      fillRect(33, 31, 3, 3, `rgba(255,220,100,${winGlow * 0.5})`);
      fillRect(51, 27, 2, 4, `rgba(255,220,100,${winGlow * 0.6})`);
      fillRect(83, 29, 3, 3, `rgba(255,200,80,${winGlow * 0.4})`);
      fillRect(100, 35, 4, 2, `rgba(255,210,90,${winGlow * 0.5})`);
    }
  }

  function drawStreetTraffic(darkness) {
    const base = lerp(0.15, 0.6, darkness);
    // Road line
    fillRect(28, 39, 94, 1, `rgba(50,50,50,${base})`);

    // Passing car silhouette (animated)
    const carX = 28 + ((animTime * 15) % 96);
    if (carX < 122) {
      fillRect(carX, 37, 8, 3, `rgba(40,40,50,${base * 0.8})`);
      fillRect(carX+1, 36, 4, 2, `rgba(50,50,60,${base * 0.7})`);
      // headlights at night
      const hlGlow = t < 0.5 ? lerp(0, 1, t*2 - 0.3) : lerp(1, 0, (t-0.4)*2.5);
      if (hlGlow > 0.3) {
        fillRect(carX+8, 37, 1, 1, `rgba(255,255,200,${hlGlow * 0.8})`);
        fillRect(carX-1, 37, 1, 1, `rgba(255,60,40,${hlGlow * 0.5})`);
      }
    }

    // Walking person (animated)
    const personX = 30 + ((animTime * 8 + 50) % 90);
    const bobY = Math.sin(animTime * 4) > 0 ? -1 : 0;
    if (personX < 118 && personX > 28) {
      fillRect(personX, 36 + bobY, 2, 3, `rgba(60,50,45,${base * 0.7})`);
      fillRect(personX+0.5, 35 + bobY, 1, 1, `rgba(80,70,60,${base * 0.6})`);
    }
  }

  // ── Wall & Floor ──────────────────────────────────────────
  function drawRoom() {
    // Back wall
    fillRect(0, 0, 320, 45, C.wallTop);
    fillRect(0, 45, 320, 10, C.wallBot);

    // Wainscoting / lower wall accent
    fillRect(0, 55, 320, 3, "#D4B896");

    // Floor - wood planks perspective
    for (let row = 60; row < 200; row++) {
      const shade = ((row - 60) % 12 < 6) ? C.floorFront : C.floorBack;
      fillRect(0, row, 320, 1, shade);
    }

    // Wood grain lines
    for (let i = 0; i < 8; i++) {
      const lx = 20 + i * 40;
      pxLine(lx, 60, lx, 200, `rgba(139,115,85,0.3)`, 1);
    }

    // Baseboard
    fillRect(0, 58, 320, 2, "#5C4033");
  }

  // ── Window (behind room, drawn first for layering) ────────
  function drawWindow() {
    // Window frame outer
    fillRect(26, 6, 98, 38, C.windowFrame);

    // Glass area with sky
    fillRect(30, 10, 90, 30, C.glassDay);

    // Window mullions (cross bars)
    pxLine(75, 10, 75, 40, C.windowFrame, 2);
    pxLine(30, 25, 120, 25, C.windowFrame, 2);

    // Sky rendering inside window
    drawSky();

    // Glass reflection overlay
    fillRect(32, 12, 4, 12, "rgba(255,255,255,0.1)");
    fillRect(88, 18, 3, 8, "rgba(255,255,255,0.07)");

    // Window sill
    fillRect(24, 44, 102, 3, "#A08060");
    fillRect(24, 44, 102, 1, "#B89870");
  }

  // ── Counter / Bar (right side x=200-280) ─────────────────
  function drawCounter() {
    const cx = 200;

    // Counter body
    fillRect(cx, 50, 70, 108, C.counter);
    fillRect(cx + 4, 50, 62, 104, C.counterTop);

    // Counter edge highlight
    fillRect(cx, 50, 70, 3, "#8B6914");
    fillRect(cx, 50, 3, 108, "#8B6914");

    // Lower counter paneling
    for (let i = 0; i < 4; i++) {
      const px2 = cx + 8 + i * 17;
      fillRect(px2, 70, 13, 50, C.counterDark);
      fillRect(px2+1, 71, 11, 48, C.counterTop);
    }

    // Coffee machine on counter (left side of counter)
    drawCoffeeMachine(cx + 6, 30);

    // Cups and glasses on counter
    drawCupsOnCounter(cx + 50, 32);

    // Pastry display case near front of counter
    drawPastryCase(cx + 15, 42);

    // Shelf above counter - coffee bags & beans
    drawCoffeeShelf();
  }

  function drawCoffeeMachine(x, y) {
    // Machine body
    fillRect(x, y, 28, 22, "#C0C0C0");
    fillRect(x+1, y+1, 26, 20, "#D8D8D8");

    // Top boiler
    fillRect(x+4, y-6, 20, 8, "#A0A0A0");
    fillRect(x+5, y-5, 18, 6, "#C8C8C8");

    // Group head
    fillRect(x+10, y+18, 8, 4, "#808080");

    // Portafilter handle
    const angle = Math.sin(animTime * 2) * 0.3;
    const hfX = x + 18;
    const hfY = y + 20 + Math.sin(angle + 1) * 1;
    pxLine(x+14, y+20, hfX, hfY, "#5C4033", 2);

    // Steam wand
    pxLine(x+4, y+12, x+8, y+22, "#E0E0E0", 1);

    // Drip tray
    fillRect(x+4, y+22, 20, 3, "#909090");

    // Machine details - buttons
    fillRect(x+8, y+6, 3, 3, "#E74C3C");
    fillRect(x+14, y+6, 3, 3, "#27AE60");
    fillRect(x+20, y+6, 3, 3, "#F39C12");

    // Small espresso cups under group head
    fillRect(x+8, y+25, 4, 4, C.cupWhite);
    fillRect(x+17, y+25, 4, 4, C.cupWhite);
    fillRect(x+9, y+26, 2, 1, C.coffeeDark);
    fillRect(x+18, y+26, 2, 1, C.coffeeDark);

    // Steam from machine (animated)
    drawMachineSteam(x + 10, y - 8);
  }

  function drawMachineSteam(x, y) {
    for (let i = 0; i < 4; i++) {
      const sx = x + Math.sin(animTime * 3 + i * 1.5) * 3;
      const sy = y - i * 5 - Math.sin(animTime * 2 + i) * 2;
      const alpha = 0.4 - i * 0.1;
      fillRect(sx, sy, 2, 2, `rgba(255,255,255,${alpha})`);
    }
  }

  function drawCupsOnCounter(x, y) {
    // Saucer
    fillRect(x-1, y+8, 10, 2, "#E8E0D8");

    // Cup
    fillRect(x, y+4, 6, 5, C.cupWhite);
    fillRect(x+1, y+5, 4, 3, C.coffeeDark);

    // Handle
    pxLine(x+7, y+4, x+9, y+6, C.cupWhite, 2);

    // Small sugar jar
    fillRect(x+12, y+2, 4, 6, "#F0E8D8");
    fillRect(x+12, y+1, 4, 2, "#C0B090");
  }

  function drawPastryCase(x, y) {
    // Glass case frame
    fillRect(x, y-2, 20, 14, "#808080");
    fillRect(x+1, y-1, 18, 12, "rgba(200,220,240,0.3)");

    // Shelf inside case
    fillRect(x+2, y+3, 16, 1, "#B0B0B0");

    // Pastries on shelf
    // Croissant
    fillRect(x+3, y-1, 5, 3, C.pastry[0]);
    pxLine(x+4, y, x+7, y, C.pastry[1], 1);

    // Cake slice
    fillRect(x+10, y-1, 4, 4, C.pastry[2]);
    fillRect(x+11, y-2, 2, 1, "#FF69B4");

    // Cookie
    fillRect(x+7, y+5, 3, 3, C.pastry[3]);
    fillRect(x+8, y+6, 1, 1, "#5C4033");

    // Reflection on glass
    fillRect(x+2, y, 2, 8, "rgba(255,255,255,0.15)");
  }

  function drawCoffeeShelf() {
    const sy = 15;
    // Shelf board
    fillRect(205, sy, 60, 3, C.shelf);
    fillRect(205, sy, 60, 1, "#9B7B5A");

    // Coffee bags on shelf
    for (let i = 0; i < 4; i++) {
      const bx = 210 + i * 14;
      fillRect(bx, sy-8, 8, 8, `hsl(${25+i*5}, ${40+i*5}%, ${35-i*3}%)`);
      // Label
      fillRect(bx+2, sy-6, 4, 3, "#F5F0E8");
      // String tie
      pxLine(bx, sy-7, bx+8, sy-7, `hsl(${30+i*10}, 60%, 55%)`, 1);
    }

    // Hanging mugs below shelf
    for (let i = 0; i < 3; i++) {
      const mx = 220 + i * 15;
      // Hook
      fillRect(mx+2, sy+3, 2, 2, "#808080");
      // Mug body
      fillRect(mx, sy+5, 6, 7, C.cupWhite);
      // Handle
      pxLine(mx-1, sy+6, mx-1, sy+11, C.cupWhite, 2);
      // Coffee in mug
      fillRect(mx+1, sy+7, 4, 3, C.coffeeDark);
    }

    // Coffee bean bags
    fillRect(258, sy-9, 10, 9, "#6B3A2A");
    fillRect(260, sy-7, 6, 4, "rgba(255,255,255,0.1)");

    // Small plant on shelf corner
    drawSmallPlant(258, sy - 13);
  }

  function drawSmallPlant(x, y) {
    // Pot
    fillRect(x+2, y+2, 6, 5, C.plantPot);
    fillRect(x+1, y+4, 8, 2, "#B06B28");

    // Leaves
    const leafColors = ["#4CAF50","#388E3C","#66BB6A"];
    for (let i = 0; i < 5; i++) {
      const lx = x + Math.sin(animTime * 1.2 + i) * 1;
      fillRect(lx, y - i, 3, 3, leafColors[i % 3]);
    }
  }

  // ── Tables & Chairs ───────────────────────────────────────
  function drawTable1(x, y) {
    // Table (center-left area)
    fillRect(x-2, y, 16, 8, C.table);
    fillRect(x-1, y-1, 14, 3, C.tableTop);
    fillRect(x+5, y+8, 2, 10, C.table);
    fillRect(x+9, y+8, 2, 10, C.table);

    // Chairs around table
    drawChair(x-4, y+4);
    drawChair(x+10, y+4);
    drawChair(x+5, y-6);
  }

  function drawTable2(x, y) {
    // Table (right area near window - actually drawn before counter)
    fillRect(x-2, y, 16, 8, C.table);
    fillRect(x-1, y-1, 14, 3, C.tableTop);
    fillRect(x+5, y+8, 2, 10, C.table);
    fillRect(x+9, y+8, 2, 10, C.table);

    drawChair(x-4, y+4);
    drawChair(x+10, y+4);
    drawChair(x+5, y-6);
  }

  function drawTable3(x, y) {
    // Round table (back-left corner)
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      fillRect(
        Math.round(x + Math.cos(a) * 7 - 1),
        Math.round(y + Math.sin(a) * 3 - 1),
        2, 2, C.tableTop
      );
    }
    // Table top surface
    fillRect(x-6, y-3, 14, 7, C.tableTop);
    fillRect(x-5, y-2, 12, 5, "#C4A070");
    // Base
    fillRect(x-1, y+4, 3, 10, C.table);

    drawChair(x-8, y+6);
    drawChair(x+6, y+6);
    drawChair(x-1, y-9);
  }

  function drawTable4(x, y) {
    // Table (back-right area)
    fillRect(x-2, y, 16, 8, C.table);
    fillRect(x-1, y-1, 14, 3, C.tableTop);
    fillRect(x+5, y+8, 2, 10, C.table);
    fillRect(x+9, y+8, 2, 10, C.table);

    drawChair(x-4, y+4);
    drawChair(x+10, y+4);
    drawChair(x+5, y-6);
  }

  function drawChair(cx, cy) {
    // Seat
    fillRect(cx, cy, 6, 3, C.chair);
    // Back
    pxLine(cx+1, cy-4, cx+1, cy, C.chair, 2);
    pxLine(cx+4, cy-4, cx+4, cy, C.chair, 2);
    pxLine(cx+1, cy-4, cx+4, cy-4, C.chair, 2);
    // Legs
    pxLine(cx+0.5, cy+3, cx+0.5, cy+6, "#7A4E2C", 1);
    pxLine(cx+5, cy+3, cx+5, cy+6, "#7A4E2C", 1);
  }

  // ── Customers (seated at tables) ──────────────────────────
  function drawCustomer(x, y, colors, seatIdx) {
    const bob = Math.sin(animTime * 1.5 + seatIdx * 2) * 0.5;
    const headY = y - 14 + bob;

    // Hair
    fillRect(x-1, headY-3, 5, 4, colors[0]);
    pxLine(x, headY-3, x+3, headY-3, colors[0], 2);

    // Head
    fillRect(x, headY+1, 3, 3, colors[2] || C.baristaSkin);

    // Eyes (blink occasionally)
    if (Math.sin(animTime * 3 + seatIdx) > -0.8) {
      fillRect(x, headY+2, 1, 1, "#2C2C2C");
      fillRect(x+2, headY+2, 1, 1, "#2C2C2C");
    }

    // Body (seated - wider for sitting)
    const bodyColor = colors[3] || C.baristaShirt;
    fillRect(x-1, headY+4, 5, 8, bodyColor);
    fillRect(x, headY+5, 3, 6, shadeColor(bodyColor, -10));

    // Arm (subtle movement)
    const armAngle = Math.sin(animTime * 2 + seatIdx * 3) * 0.4;
    const armX = x + 4 + Math.round(Math.sin(armAngle) * 2);
    fillRect(armX, headY+5, 3, 1, colors[2] || C.baristaSkin);

    // Legs (seated - visible below table at table positions)
    if (y > 70) {
      fillRect(x-1, y+8, 2, 4, "#5C6B7A");
      fillRect(x+3, y+8, 2, 4, "#5C6B7A");
    }

    // Coffee cup on table near customer
    if (Math.sin(animTime * 0.8 + seatIdx) > 0) {
      const cupX = x + 5;
      fillRect(cupX, y+1, 3, 3, C.cupWhite);
      fillRect(cupX+1, y+2, 1, 1, C.coffeeDark);

      // Steam from cup
      for (let s = 0; s < 3; s++) {
        const ssx = cupX + 1 + Math.sin(animTime * 4 + s) * 1.5;
        const ssy = y - 2 - s * 3;
        fillRect(ssx, ssy, 1, 1, "rgba(255,255,255,0.3)");
      }
    }
  }

  // ── Barista (behind counter) ──────────────────────────────
  function drawBarista() {
    const bx = 215;
    const by = 48;
    const breathe = Math.sin(animTime * 1.8) * 0.3;

    // Legs
    fillRect(bx, by + 70, 3, 20, C.baristaPants);
    fillRect(bx+5, by + 70, 3, 20, C.baristaPants);
    // Shoes
    fillRect(bx-1, by+90, 5, 3, "#2C2C2C");
    fillRect(bx+4, by+90, 5, 3, "#2C2C2C");

    // Body
    fillRect(bx-1, by+30, 11, 40, C.baristaShirt);
    fillRect(bx, by+32, 9, 36, shadeColor(C.baristaShirt, -5));

    // Apron
    fillRect(bx+1, by+40, 7, 28, "#F5F0E8");
    fillRect(bx+2, by+41, 5, 26, "rgba(255,255,255,0.3)");

    // Arms - animated as if making coffee
    const armSwing = Math.sin(animTime * 3) * 3;

    // Left arm (reaching toward machine)
    fillRect(bx-3, by+34 + armSwing, 4, 10, C.baristaSkin);
    pxLine(bx-3, by+36+armSwing, bx-5, by+28+armSwing, C.baristaSkin, 2);

    // Right arm (holding portafilter)
    const rArmY = by + 34 - armSwing;
    fillRect(bx+10, rArmY, 4, 10, C.baristaSkin);
    pxLine(bx+10, rArmY+2, bx+15, rArmY-2, C.baristaSkin, 2);

    // Head
    const headBob = breathe;
    fillRect(bx, by + 16 + headBob, 8, 7, C.baristaSkin);

    // Hair
    fillRect(bx-1, by+14 + headBob, 10, 3, C.baristaHair);
    pxLine(bx, by+13 + headBob, bx+7, by+13+headBob, C.baristaHair, 2);

    // Eyes
    const blink = Math.sin(animTime * 4) > -0.9;
    if (blink) {
      fillRect(bx+2, by+19+headBob, 1, 1, "#2C2C2C");
      fillRect(bx+5, by+19+headBob, 1, 1, "#2C2C2C");
    } else {
      // Blink line
      pxLine(bx+2, by+19+headBob, bx+3, by+19+headBob, "#2C2C2C", 1);
      pxLine(bx+5, by+19+headBob, bx+6, by+19+headBob, "#2C2C2C", 1);
    }

    // Smile
    pxLine(bx+2, by+21+headBob, bx+5, by+21+headBob, "#C89070", 1);

    // Name tag
    fillRect(bx+3, by+42, 4, 3, "#FFF8E1");
    pxLine(bx+4, by+43, bx+6, by+43, C.coffeeDark, 0.5);

    // Coffee steam from hands area
    const steamBaseX = bx + 12;
    const steamBaseY = by + 28 - armSwing;
    for (let s = 0; s < 3; s++) {
      const ssx = steamBaseX + Math.sin(animTime * 5 + s * 2) * 2;
      const ssy = steamBaseY - s * 4;
      fillRect(ssx, ssy, 1, 1, `rgba(255,255,255,${0.3 - s*0.08})`);
    }
  }

  // ── Hanging Lights / Neon ─────────────────────────────────
  function drawLights() {
    const t = timeOfDay;
    const glowIntensity = t < 0.5 ? lerp(0.3, 1, t*2) : lerp(1, 0.4, (t-0.5)*2);

    // Three hanging lights from ceiling
    const lightPositions = [[80, 0], [160, 0], [240, 0]];

    for (let i = 0; i < 3; i++) {
      const lx = lightPositions[i][0];
      const ly = lightPositions[i][1];

      // Wire
      pxLine(lx, ly, lx, ly + 18, "#4A4A4A", 1);

      // Lamp shade
      fillRect(lx-3, ly+18, 6, 4, C.neonWarm);
      fillRect(lx-2, ly+19, 4, 2, "#FFC107");

      // Glow effect (flickering)
      const flicker = Math.sin(animTime * 8 + i * 2.5) * 0.1;
      const glowAlpha = Math.max(0.05, glowIntensity * (0.7 + flicker));
      fillRect(lx-12, ly+22, 24, 15, `rgba(255,213,79,${glowAlpha})`);
      fillRect(lx-6, ly+28, 12, 8, `rgba(255,213,79,${glowAlpha * 0.5})`);

      // Bulb (bright center)
      fillRect(lx-1, ly+22, 2, 2, "rgba(255,255,200,0.8)");
    }

    // Neon sign on wall
    drawNeonSign();
  }

  function drawNeonSign() {
    const flicker = Math.sin(animTime * 6) > -0.1 ? 1 : 0.7;
    const neonColor = C.neonPink;

    // Sign box glow
    fillRect(58, 46, 32, 9, `rgba(255,110,199,${0.2 * flicker})`);

    // "CAFÉ" letters (pixel style)
    const letters = [
      // C
      [[0,0],[1,0],[2,0],[0,1],[0,2],[0,3],[1,3]],
      // A
      [[4,0],[5,0],[6,0],[7,0],[4,1],[7,1],[5,2],[6,2],[4,3],[5,3],[6,3],[7,3]],
      // F
      [[9,0],[10,0],[11,0],[9,1],[11,1],[9,2],[11,2],[9,3]],
      // É
      [[13,0],[14,0],[15,0],[16,0],[13,1],[15,1],[13,2],[13,3],[14,3],[15,3]]
    ];

    const offsets = [0, 4, 9, 13];
    for (let li = 0; li < letters.length; li++) {
      const ox = offsets[li] + 60;
      const oy = 48;
      for (const [dx, dy] of letters[li]) {
        fillRect(ox+dx, oy+dy, 1, 1, neonColor);
      }
    }

    // Accent underline with glow
    pxLine(60, 57, 92, 57, `rgba(79,195,247,${0.6 * flicker})`, 1);
    fillRect(60, 57, 32, 1, `rgba(79,195,247,${0.4 * flicker})`);

    // Small neon plant icon
    fillRect(78, 54, 1, 3, `rgba(76,175,80,${0.5 * flicker})`);
    fillRect(77, 52, 3, 2, `rgba(102,187,106,${0.4 * flicker})`);
  }

  // ── Decorations & Details ─────────────────────────────────
  function drawDecorations() {
    // Menu board on left wall
    drawMenuBoard(5, 20);

    // Small potted plant near entrance
    drawSmallPlant(180, 57);

    // Floor rug under table area 1
    fillRect(38, 78, 40, 25, "rgba(180,120,80,0.15)");
    pxLine(38, 78, 78, 78, "rgba(160,100,60,0.2)", 1);
    pxLine(38, 103, 78, 103, "rgba(160,100,60,0.2)", 1);
    pxLine(38, 78, 38, 103, "rgba(160,100,60,0.2)", 1);
    pxLine(78, 78, 78, 103, "rgba(160,100,60,0.2)", 1);

    // Ambient warmth overlay (subtle)
    fillRect(0, 0, W, H, "rgba(255,200,100,0.03)");

    // Vignette effect
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * 0.08;
      fillRect(0, 0, W, i, `rgba(40,30,20,${a})`);
      fillRect(0, H-i-1, W, i+1, `rgba(40,30,20,${a})`);
    }
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * 0.06;
      fillRect(0, 0, i+1, H, `rgba(40,30,20,${a})`);
      fillRect(W-i-1, 0, i+1, H, `rgba(40,30,20,${a})`);
    }

    // Door frame (left side, behind menu board area)
    drawDoor();
  }

  function drawMenuBoard(x, y) {
    // Board
    fillRect(x, y, 16, 20, "#3E2723");
    fillRect(x+1, y+1, 14, 18, "#4E342E");

    // Chalk lines (menu items)
    const chalkColor = "rgba(255,255,255,0.6)";
    for (let i = 0; i < 7; i++) {
      pxLine(x+3, y+4+i*2.3, x+13, y+3+i*2.3, chalkColor, 1);
    }

    // "MENU" header
    fillRect(x+5, y+1, 7, 2, "#FFF8E1");

    // Price dots
    fillRect(x+10, y+6, 2, 2, "#FFD54F");
    fillRect(x+10, y+10, 2, 2, "#FFD54F");
    fillRect(x+9, y+14, 3, 2, "#FFD54F");
  }

  function drawDoor() {
    const dx = 140;
    const dy = 40;

    // Door frame
    fillRect(dx-2, dy-2, 8, 44, C.doorFrame);

    // Glass panel in door
    fillRect(dx, dy+2, 4, 36, C.doorGlass);

    // Street visible through door glass (simplified)
    const skyT = timeOfDay;
    let streetAlpha = skyT < 0.5 ? lerp(0.15, 0.3, skyT * 2) : lerp(0.3, 0.1, (skyT-0.5)*2);
    fillRect(dx+1, dy+4, 2, 10, `rgba(135,206,235,${streetAlpha})`);

    // Door handle
    fillRect(dx+3, dy+28, 2, 3, "#C0A060");

    // Door bottom shadow
    fillRect(dx-1, dy+38, 6, 2, "rgba(0,0,0,0.2)");
  }

  // ── Main Draw Function ────────────────────────────────────
  function draw() {
    ctx.clearRect(0, 0, W * P, H * P);

    // Background color (behind all elements)
    fillRect(0, 0, W, H, "#2A1F14");

    // ── Layer 1: Wall & Floor ──
    drawRoom();

    // ── Layer 2: Window & Sky (drawn early for behind effect) ─
    drawWindow();

    // ── Layer 3: Decorations (menu board, door) ─
    drawDecorations();

    // ── Layer 4: Tables & Chairs ─
    // Table 2 (near window):
    drawTable2(75, 70);
    // Table 1 (center-left):
    drawTable1(85, 95);
    // Customer at table 1:
    drawCustomer(86, 93, C.customer1, 0);
    drawCustomer(98, 93, C.customer2, 1);

    // Table 3 (back-left corner, round):
    drawTable3(45, 80);
    // Customer at table 3:
    drawCustomer(44, 78, C.customer3, 2);
    drawCustomer(56, 78, C.customer4, 3);

    // ── Layer 5: Counter & Barista ──
    drawCounter();
    drawBarista();

    // ── Layer 6: Hanging Lights ──
    drawLights();

    // ── Layer 7: Warm ambient overlay based on time of day ──
    drawAmbientLighting();
  }

  function drawAmbientLighting() {
    const t = timeOfDay;
    let warmth, brightness;

    if (t < 0.5) {
      warmth   = lerp(1.0, 0.85, t * 2);       // warm → slightly less warm
      brightness = lerp(1.0, 0.7, t * 2);        // bright → dimmer
    } else {
      warmth   = lerp(0.85, 0.6, (t - 0.5) * 2);
      brightness = lerp(0.7, 0.4, (t - 0.5) * 2);
    }

    // Warm golden wash
    fillRect(0, 0, W, H, `rgba(255,180,80,${0.06 * brightness})`);

    // Light pool from lamps on floor/table areas
    const pools = [[80, 85], [160, 85], [240, 75]];
    for (const [px2, py] of pools) {
      fillRect(px2-10, py, 20, 20, `rgba(255,213,79,${0.04 * brightness})`);
      fillRect(px2-5, py+5, 10, 10, `rgba(255,213,79,${0.06 * brightness})`);
    }

    // Subtle shadow under counter (bar area)
    fillRect(195, 158, 85, 42, "rgba(30,20,10,0.15)");
  }

  // ── Color Helpers ─────────────────────────────────────────
  function lerp(a, b, t) { return a + (b - a) * Math.max(0, Math.min(1, t)); }

  function lerpColor(c1, c2, t) {
    const r1 = parseInt(c1.slice(1,3), 16), g1 = parseInt(c1.slice(3,5), 16), b1 = parseInt(c1.slice(5,7), 16);
    const r2 = parseInt(c2.slice(1,3), 16), g2 = parseInt(c2.slice(3,5), 16), b2 = parseInt(c2.slice(5,7), 16);
    const r = Math.round(lerp(r1,r2,t)), g = Math.round(lerp(g1,g2,t)), b = Math.round(lerp(b1,b2,t));
    return "#" + [r,g,b].map(v => v.toString(16).padStart(2,"0")).join("");
  }

  function shadeColor(hex, amount) {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return "#" + [r,g,b].map(v => Math.max(0,Math.min(255,v+amount)).toString(16).padStart(2,"0")).join("");
  }

  // ── Public API ────────────────────────────────────────────
  function getCanvas() { return canvas; }
  function setTimeOfDay(t) { timeOfDay = Math.max(0, Math.min(1, t)); }
  function getTimeOfDay() { return timeOfDay; }
  function destroy() {
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
    canvas = null;
    ctx = null;
  }

  // ── Auto-init when DOM ready ──────────────────────────────
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  // Expose for external control
  window.cafeSceneV8 = { getCanvas, setTimeOfDay, getTimeOfDay, destroy };
})();

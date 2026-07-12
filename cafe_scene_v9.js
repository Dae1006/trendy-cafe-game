/**
 * cafe_scene_v9.js — Interior Cafe Scene (Bên Trong Quán)
 * Simple, complete, guaranteed to run. Pixel art 320x200 cozy cafe interior.
 */
(function() {
  'use strict';
  const W = 320, H = 200;

  let canvas, ctx;
  let t = 0; // animation time
  let frame = 0;
  
  // Time of day: 0..1 cycle (day→sunset→night)
  function tod() { return (Math.sin(t * 0.5) + 1) / 2; }

  // Helper: draw pixel rect
  function px(x, y, w, h, c) { ctx.fillStyle = c; ctx.fillRect(x, y, w, h); }

  // Helper: lerp color (simple)
  function rgb(r,g,b,a){ a=a!==undefined?'rgba('+r+','+g+','+b+','+a+')':'rgb('+r+','+g+','+b+')'; return a; }

  // ── INIT ──────────────────────────────────────────────────────
  function init() {
    if (canvas) return;
    
    // Find existing canvas from HTML
    const ec = document.getElementById('cafe-canvas');
    if (ec) {
      canvas = ec;
    } else {
      canvas = document.createElement('canvas');
      canvas.width = W;
      canvas.height = H;
      canvas.style.width = '100%';
      canvas.style.height = 'auto';
      canvas.style.display = 'block';
      const w = document.getElementById('cafe-scene-wrapper');
      if (w) { w.innerHTML = ''; w.appendChild(canvas); }
      else { document.body.appendChild(canvas); }
    }
    
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    // Start loop
    requestAnimationFrame(loop);
  }

  function loop(ts) {
    const dt = Math.min((ts - (init._last || ts)) / 1000, 0.05);
    init._last = ts;
    t += dt;
    frame++;
    
    ctx.clearRect(0, 0, W, H);
    drawScene();
    requestAnimationFrame(loop);
  }

  // ── DRAW SCENE ────────────────────────────────────────────────
  function drawScene() {
    const s = tod(); // 0=day, 1=night
    
    // SKY through window
    drawSky(s);
    
    // WALL (warm beige)
    px(0, 0, W, 50, '#F5E6D3'); // upper wall
    px(0, 50, W, 2, '#D4B896'); // wainscoting
    
    // FLOOR (wood planks)
    for (let y = 52; y < H; y++) {
      const shade = ((y - 52) % 4 < 2) ? '#A0906D' : '#8B7355';
      px(0, y, W, 1, shade);
    }
    
    // WINDOW (on back wall)
    drawWindow(s);
    
    // COUNTER / BAR (right side)
    drawCounter();
    
    // SHELF above counter
    drawShelf();
    
    // NEON SIGN "CAFÉ"
    drawNeonSign();
    
    // HANGING LIGHTS
    drawLights();
    
    // TABLES + CUSTOMERS
    drawTablesAndCustomers(s);
    
    // BISTRO BARISTA behind counter
    drawBarista();
    
    // STEAM particles
    drawSteamParticles();
    
    // VIGNETTE (dark corners)
    drawVignette();
  }

  // ── SKY ───────────────────────────────────────────────────────
  function drawSky(s) {
    // Sky gradient through window
    const skyR = Math.round(135 * (1 - s) + 26 * s);
    const skyG = Math.round(206 * (1 - s) + 43 * s);
    const skyB = Math.round(235 * (1 - s) * (1 - s*0.7) + 42 * s);
    
    // Day → sunset gradient
    if (s < 0.5) {
      px(28, 8, 96, 34, rgb(skyR, skyG, Math.max(80, skyB)));
      // Sunset glow
      const g = px;
      for (let row = 18; row < 42; row++) {
        const alpha = ((row - 18) / 24) * s;
        px(28, row, 96, 1, rgb(255, 140, 66, alpha * 0.5));
      }
    } else {
      // Night sky (dark blue)
      const n = (s - 0.5) * 2;
      px(28, 8, 96, 34, rgb(13 + Math.round(22 * n), 27 + Math.round(35 * n), 42));
    }
    
    // Stars at night
    if (s > 0.6) {
      const sa = (s - 0.6) / 0.4;
      px(35, 15, 1, 1, rgb(255, 255, 255, sa * 0.8));
      px(85, 22, 1, 1, rgb(255, 255, 255, sa * 0.6));
      px(110, 30, 1, 1, rgb(255, 255, 255, sa * 0.7));
    }
    
    // Distant buildings silhouette
    const bd = s > 0.3 ? (s - 0.3) / 0.7 : 0;
    px(30, 40 - Math.round(bd * 12), 20, 12 + Math.round(bd * 12), rgb(60, 50, 40, bd));
    px(55, 42 - Math.round(bd * 8), 15, 10 + Math.round(bd * 8), rgb(70, 55, 35, bd));
    px(75, 38 - Math.round(bd * 14), 18, 12 + Math.round(bd * 14), rgb(55, 45, 30, bd));
    
    // Windows in buildings (warm glow at night)
    if (bd > 0.2) {
      px(36, 44, 3, 3, rgb(255, 220, 100, bd * 0.6));
      px(80, 42, 3, 3, rgb(255, 200, 80, bd * 0.4));
    }
    
    // Window frame
    px(26, 6, 100, 2, '#5A4A3A'); // top
    px(26, 42, 100, 2, '#5A4A3A'); // bottom/sill
    px(26, 6, 2, 38, '#5A4A3A'); // left
    px(124, 6, 2, 38, '#5A4A3A'); // right
    px(75, 8, 1, 34, '#5A4A3A'); // vertical mullion
    px(28, 24, 96, 1, '#5A4A3A'); // horizontal mullion
    
    // Glass reflection
    px(32, 10, 6, 12, rgb(255, 255, 255, 0.08));
    px(88, 14, 4, 8, rgb(255, 255, 255, 0.06));
    
    // Car passing outside window (animated)
    const cx = (t * 30 + 28) % 100;
    if (cx < 96 && s > 0.4) {
      px(28 + cx, 35, 8, 4, rgb(40, 40, 50, 0.7));
      // Headlights at night
      const hl = (s - 0.4) / 0.6;
      if (hl > 0.1) {
        px(36 + cx, 36, 1, 2, rgb(255, 255, 200, hl * 0.8));
        px(27 + cx, 36, 1, 2, rgb(255, 60, 40, hl * 0.5));
      }
    }
    
    // Walking person outside
    const px2 = (t * 15 + 50) % 98;
    if (px2 > 2 && px2 < 96) {
      const bob = Math.sin(t * 4) > 0 ? -1 : 0;
      px(30 + px2, 36 + bob, 3, 5, rgb(60, 50, 45, 0.7));
    }
  }

  // ── COUNTER ───────────────────────────────────────────────────
  function drawCounter() {
    const x = 200, y = 50, w = 120;
    
    // Counter body (dark brown)
    px(x, y, w, 48, '#654321');
    px(x, y + 47, w, 3, '#4A3020'); // bottom shadow
    
    // Counter top (lighter)
    px(x, y, w, 4, '#5C3D2E');
    
    // Counter paneling lines
    for (let i = 0; i < 5; i++) {
      const lx = x + 8 + i * 24;
      px(lx, y + 5, 1, 39, rgb(74, 48, 32, 0.6));
    }
    
    // Espresso machine on counter
    px(x + 5, y - 18, 28, 20, '#C0C0C0'); // body
    px(x + 7, y - 16, 4, 3, '#FF4444'); // power light (red)
    px(x + 15, y - 16, 4, 3, '#44FF44'); // ready light (green)
    px(x + 23, y - 16, 4, 3, '#FFFF44'); // hot light (yellow)
    px(x + 5, y - 3, 10, 4, '#808080'); // portafilter group
    px(x + 15, y - 2, 1, 6, '#A0A0A0'); // steam wand
    
    // Cups on counter (white)
    px(x + 40, y - 3, 8, 3, '#FAFAF8'); // cup base
    px(x + 40, y - 5, 8, 2, 'rgba(196,36,27,0.7)'); // coffee inside
    px(x + 48, y - 4, 2, 4, '#FAFAF8'); // handle
    
    // Pastry case in front of counter
    const pcx = x + 50;
    px(pcx - 2, y + 5, 40, 25, 'rgba(135,206,250,0.3)'); // glass
    px(pcx - 1, y + 5, 38, 1, '#A0A0A0'); // top frame
    
    // Pastries inside case
    // Croissant
    px(pcx + 3, y + 15, 6, 4, '#E8C87A');
    // Cake slice
    px(pcx + 12, y + 10, 5, 9, '#D4A574');
    // Cookie
    px(pcx + 22, y + 16, 3, 3, '#C49A6C');
    px(pcx + 28, y + 12, 4, 5, '#E8C87A');
    
    // Shelf above counter (coffee bags)
    for (let i = 0; i < 4; i++) {
      const sx = x + 5 + i * 22;
      px(sx, y - 28, 16, 18, '#7B5B3A'); // coffee bag
      px(sx + 3, y - 24, 10, 1, '#F5E6D3'); // label
    }
    
    // Hanging glasses above shelf
    for (let i = 0; i < 3; i++) {
      const gx = x + 10 + i * 20;
      px(gx, y - 48, 6, 8, 'rgba(200,200,200,0.4)'); // glass body
      px(gx + 3, y - 48, 1, 4, '#A0A0A0'); // stem
    }
  }

  // ── NEON SIGN ─────────────────────────────────────────────────
  function drawNeonSign() {
    const flicker = Math.sin(t * 6 + frame * 0.1) > -0.5 ? 1 : 0.3;
    
    // "CAFÉ" text (simplified pixel art letters)
    const chars = 'CAFE';
    let lx = 25;
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      if (c === 'C') {
        px(lx, 14, 6, 6, rgb(255, 110, 199, flicker));
        px(lx, 14, 1, 6, rgb(255, 110, 199, flicker));
        px(lx + 6, 14, 1, 6, rgb(255, 110, 199, flicker));
        px(lx, 14, 6, 1, rgb(255, 110, 199, flicker));
      } else if (c === 'A') {
        px(lx, 20, 1, 6, rgb(79, 195, 247, flicker)); // left leg
        px(lx + 6, 20, 1, 6, rgb(79, 195, 247, flicker)); // right leg
        px(lx + 1, 18, 5, 1, rgb(79, 195, 247, flicker)); // top bar
        px(lx + 3, 20, 1, 4, rgb(79, 195, 247, flicker)); // crossbar
      } else if (c === 'F') {
        px(lx, 14, 1, 6, rgb(255, 213, 79, flicker));
        px(lx, 14, 6, 1, rgb(255, 213, 79, flicker));
        px(lx, 18, 5, 1, rgb(255, 213, 79, flicker));
      } else if (c === 'E') {
        px(lx + 1, 14, 6, 1, rgb(168, 230, 207, flicker));
        px(lx, 14, 1, 6, rgb(168, 230, 207, flicker));
        px(lx + 1, 17, 5, 1, rgb(168, 230, 207, flicker));
        px(lx + 1, 20, 6, 1, rgb(168, 230, 207, flicker));
      }
      lx += 9;
    }
  }

  // ── LIGHTS ────────────────────────────────────────────────────
  function drawLights() {
    const lights = [55, 130, 240]; // x positions
    const flicker = Math.sin(t * 3 + frame * 0.2);
    
    for (let i = 0; i < lights.length; i++) {
      const lx = lights[i];
      
      // Wire from ceiling
      px(lx, 0, 1, 8, '#333');
      
      // Light shade (yellow)
      px(lx - 4, 7, 9, 6, '#FFD54F');
      px(lx - 3, 7, 7, 1, '#FFF8E1'); // highlight
      
      // Glow effect
      const ga = (0.1 + flicker * 0.05);
      for (let gy = 12; gy < 40; gy += 3) {
        px(lx - 20 + i, gy, 50, 1, rgb(255, 213, 79, ga * (1 - gy / 40)));
      }
      
      // Light pool on floor below
      const fy = Math.min(H - 5, 180 + i * 3);
      for (let ly = 180; ly < H; ly++) {
        const la = (ly - 180) / 20 * ga;
        px(lx - 15, ly, 40, 1, rgb(255, 213, 79, la));
      }
    }
  }

  // ── TABLES + CUSTOMERS ────────────────────────────────────────
  function drawTablesAndCustomers(s) {
    const tables = [
      { x: 30, y: 130 },   // Table 1 - near window
      { x: 100, y: 140 },  // Table 2 - center left
      { x: 160, y: 150 },  // Table 3 - center right  
      { x: 245, y: 135 }   // Table 4 - near counter
    ];
    
    for (let i = 0; i < tables.length; i++) {
      const tb = tables[i];
      const hasCustomer = i < 3; // first 3 tables have customers
      
      // Chair back
      px(tb.x - 8, tb.y - 5, 16, 3, '#8B5E3C');
      px(tb.x - 7, tb.y - 2, 1, 7, '#8B5E3C');
      px(tb.x + 6, tb.y - 2, 1, 7, '#8B5E3C');
      
      // Table top (round-ish)
      px(tb.x - 10, tb.y, 20, 4, '#B8956A'); // top
      px(tb.x - 8, tb.y + 4, 16, 1, '#9B6E4F'); // edge
      
      // Table leg
      px(tb.x - 1, tb.y + 5, 2, 15, '#8B5E3C');
      
      if (hasCustomer) {
        // Customer body (sitting)
        const bobY = Math.sin(t * 1.5 + i) * 0.3; // subtle breathing
        
        // Body
        px(tb.x - 4, tb.y - 12 + bobY, 8, 8, customerColors(i)[0]);
        
        // Head (animated blinking eyes)
        const eyeOpen = Math.sin(t * 0.5 + i * 3) > 0.9;
        px(tb.x - 3, tb.y - 16 + bobY, 6, 4, customerColors(i)[1]); // head
        if (eyeOpen) {
          px(tb.x - 2, tb.y - 14 + bobY, 1, 1, '#000'); // left eye
          px(tb.x + 1, tb.y - 14 + bobY, 1, 1, '#000'); // right eye
        }
        
        // Hair on top
        px(tb.x - 3, tb.y - 17 + bobY, 6, 2, customerColors(i)[2]);
        
        // Coffee cup on table (with steam!)
        px(tb.x - 3, tb.y - 2, 4, 3, '#FAFAF8'); // cup
        px(tb.x - 2, tb.y + 1, 2, 1, 'rgba(60,36,21,0.8)'); // coffee
        
        // Steam particles
        for (let j = 0; j < 3; j++) {
          const sx2 = tb.x - 2 + Math.sin(t * 2 + j + i) * 2;
          const sy = tb.y - 4 - ((t * 15 + j * 8) % 12);
          if (sy > 0) {
            px(sx2, sy, 1, 1, rgb(255, 255, 255, 0.6 - ((t * 0.5 + j) % 0.6)));
          }
        }
      }
    }
  }

  function customerColors(i) {
    const palettes = [
      ['#E8C87A', '#FDDCB5', '#DAA520'], // Customer 1: blonde
      ['#5C4033', '#FDDCB5', '#3B2F1B'], // Customer 2: brown hair
      ['#FF6B6B', '#FDDCB5', '#A0522D'], // Customer 3: red shirt, dark hair
    ];
    return palettes[i] || ['#FFFFFF', '#FDDCB5', '#333'];
  }

  // ── BISTRO BARISTA ───────────────────────────────────────────
  function drawBarista() {
    const bx = 210, by = 85;
    
    // Barista body (blue shirt)
    px(bx - 4, by - 5, 10, 12, '#2C5F7C'); // torso
    
    // Head
    px(bx - 3, by - 16, 8, 11, '#FDDCB5'); // skin
    px(bx - 3, by - 18, 8, 3, '#3B2F1B'); // hair
    
    // Eyes (blinking)
    if (Math.sin(t * 0.4 + frame * 0.1) > 0.85) {
      px(bx, by - 13, 1, 1, '#000');
      px(bx + 3, by - 13, 1, 1, '#000');
    }
    
    // Arms (mixing animation - sin wave)
    const armAngle = Math.sin(t * 2);
    const armX1 = bx - 4 + Math.round(armAngle * 2);
    const armX2 = bx + 6 - Math.round(armAngle * 2);
    
    px(bx - 6, by - 3, 3, 8, '#FDDCB5'); // left arm
    px(bx - 7, by + 3, 2, 2, '#FFFFFF'); // hand (white glove)
    
    px(bx + 4, by - 3 + Math.round(armAngle * 1.5), 3, 8, '#FDDCB5'); // right arm
    
    // Steam from barista's movement
    if (frame % 20 < 5) {
      px(bx - 5, by - 22, 2, 2, 'rgba(232,232,232,0.4)');
    }
    
    // Apron
    px(bx - 3, by + 5, 8, 10, '#FFFFFF');
    px(bx - 2, by + 6, 6, 1, '#CCCCCC'); // apron line
    
    // Barista name tag
    px(bx - 1, by - 1, 3, 2, '#FFD700');
  }

  // ── STEAM PARTICLES ─────────────────────────────────────────
  function drawSteamParticles() {
    // Additional steam sources (from espresso machine and cups)
    for (let i = 0; i < 4; i++) {
      const sx = 215 + Math.sin(t * 1.5 + i) * 3;
      const sy = 60 - ((t * 20 + i * 15) % 25);
      if (sy > 5 && sy < H) {
        px(sx, sy, 1, 1, rgb(255, 255, 255, 0.3 - ((t * 0.2 + i) % 0.3)));
      }
    }
  }

  // ── VIGNETTE ────────────────────────────────────────────────
  function drawVignette() {
    const vIntensity = 0.15;
    
    // Top
    for (let y = 0; y < 30; y++) {
      px(0, y, W, 1, rgb(0, 0, 0, vIntensity * (y / 30)));
    }
    // Bottom  
    for (let y = H - 20; y < H; y++) {
      px(0, y, W, 1, rgb(0, 0, 0, vIntensity * ((H - y) / 20)));
    }
    // Left
    for (let x = 0; x < 20; x++) {
      px(x, 0, 1, H, rgb(0, 0, 0, vIntensity * (x / 20)));
    }
    // Right
    for (let x = W - 20; x < W; x++) {
      px(x, 0, 1, H, rgb(0, 0, 0, vIntensity * ((W - x) / 20)));
    }
  }

  // ── BOOTSTRAP ───────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Debug helper
  window.cafeScene = { getTimeOfDay: tod, getTime: () => t };

})();
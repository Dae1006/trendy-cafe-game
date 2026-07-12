// ============================================
// PIXEL ART ENGINE V8 — Trendy Café
// Upgraded visual engine with detailed pixel art
// Gameplay logic UNCHANGED - visual only
// ============================================

const PixelArtEngine = {
  canvas: null,
  ctx: null,
  animFrame: null,
  time: 0,
  startTime: 0,
  particles: [],
  stars: [],
  fireflies: [],
  clouds: [],
  
  // Pixel art color palettes
  PALETTE: {
    sky: {
      dawn:    { top: '#1a0a2e', mid: '#4a1942', bot: '#c2185b', sun: '#ff6f00' },
      day:     { top: '#1976D2', mid: '#42A5F5', bot: '#BBDEFB', sun: '#FFF176' },
      sunset:  { top: '#1a0a2e', mid: '#AD1457', bot: '#FF6F00', sun: '#FF8F00' },
      dusk:    { top: '#0D1B2A', mid: '#1B2838', bot: '#2C3E50', sun: '#E65100' },
      night:   { top: '#0a0a1a', mid: '#111133', bot: '#1a1a2e', sun: '#E0E0E0' }
    },
    building: {
      wall:      '#8D6E63',
      wallDark:  '#6D4C41',
      wallLight: '#A1887F',
      roof:      '#4E342E',
      roofLight: '#6D4C41',
      door:      '#5D4037',
      doorLight: '#795548',
      window:    '#FFF9C4',
      windowGlow:'#FFE082',
      windowDim: '#FFB74D',
      frame:     '#3E2723',
      awning:    '#E53935',
      awningAlt: '#C62828',
      signBg:    '#FFD54F',
      signText:  '#4E342E'
    },
    ground: {
      day:   '#78909C',
      dawn:  '#546E7A',
      sunset:'#6D4C41',
      dusk:  '#37474F',
      night: '#263238'
    },
    customer: [
      { skin: '#FFCCBC', shirt: '#E53935', pants: '#1565C0', hat: '#000000' },
      { skin: '#FFE0B2', shirt: '#66BB6A', pants: '#4527A0', hat: '#8D6E63' },
      { skin: '#FFAB91', shirt: '#FB8C00', pants: '#1B5E20', hat: '#FFD54F' },
      { skin: '#D7CCC8', shirt: '#8E24AA', pants: '#283593', hat: '#F44336' },
      { skin: '#BCAAA4', shirt: '#00897B', pants: '#BF360C', hat: '#78909C' },
      { skin: '#FFCCBC', shirt: '#0097A7', pants: '#F57F17', hat: '#5D4037' },
      { skin: '#FFE0B2', shirt: '#3F51B5', pants: '#00695C', hat: '#FF8A65' },
      { skin: '#FFAB91', shirt: '#D81B60', pants: '#2E7D32', hat: '#5C6BC0' }
    ],
    staff: [
      { apron: '#FFFFFF', shirt: '#FFFFFF', hat: '#FFFFFF', skin: '#FFCCBC', pants: '#212121' },
      { apron: '#4CAF50', shirt: '#FFFFFF', hat: '#4CAF50', skin: '#FFE0B2', pants: '#37474F' },
      { apron: '#FF9800', shirt: '#FFFFFF', hat: '#FF9800', skin: '#FFAB91', pants: '#4527A0' }
    ]
  },
  
  // Initialize the engine
  init() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cafe-scene';
    canvas.width = 640;
    canvas.height = 360;
    canvas.style.width = '100%';
    canvas.style.height = '360px';
    canvas.style.borderRadius = '12px';
    canvas.style.marginBottom = '8px';
    canvas.style.border = '2px solid #333';
    canvas.style.background = '#0d0d1a';
    canvas.style.imageRendering = 'pixelated';
    
    const wrapper = document.createElement('div');
    wrapper.id = 'scene-wrapper';
    wrapper.style.cssText = 'margin:10px 0;border-radius:12px;overflow:hidden;position:relative;background:#0a0a1a;padding:8px';
    wrapper.appendChild(canvas);
    
    const content = document.getElementById('content');
    if (content) {
      content.insertBefore(wrapper, content.firstChild);
    }
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.startTime = Date.now();
    
    // Generate stars
    for (let i = 0; i < 80; i++) {
      this.stars.push({
        x: Math.random() * 640,
        y: Math.random() * 180,
        size: Math.random() * 2 + 0.5,
        twinkle: Math.random() * Math.PI * 2,
        speed: Math.random() * 0.02 + 0.01
      });
    }
    
    // Generate clouds
    for (let i = 0; i < 5; i++) {
      this.clouds.push({
        x: Math.random() * 700 - 30,
        y: 30 + Math.random() * 60,
        width: 60 + Math.random() * 80,
        speed: 0.1 + Math.random() * 0.15,
        opacity: 0.3 + Math.random() * 0.3
      });
    }
    
    this.loop();
  },
  
  // Get current time-of-day period
  getTimePeriod() {
    const hour = (G.gameDay || 1) % 24;
    if (hour >= 5 && hour < 7) return 'dawn';
    if (hour >= 7 && hour < 17) return 'day';
    if (hour >= 17 && hour < 19) return 'sunset';
    if (hour >= 19 && hour < 21) return 'dusk';
    return 'night';
  },
  
  // Get current weather
  getWeather() {
    const weatherDay = (G.gameDay || 1);
    const r = weatherDay % 7;
    if (r < 3) return 'sunny';
    if (r < 5) return 'rainy';
    return 'cloudy';
  },
  
  // Get cafe state from game
  getCafeState() {
    const venue = VENUE_TYPES[G.venueLevel] || VENUE_TYPES[0];
    return {
      venue,
      decorCount: G.trendItems.length,
      staffCount: G.staff.length,
      customerCount: G.orders.length,
      level: G.level || 1,
      reputation: G.reputation || 0,
      coins: G.coins || 0
    };
  },
  
  // ===== PIXEL ART DRAWING HELPERS =====
  
  // Draw a pixelated rectangle
  drawPixelRect(ctx, x, y, w, h, color) {
    ctx.fillStyle = color;
    ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
  },
  
  // Draw a pixel art sprite (grid-based)
  drawPixelSprite(ctx, grid, startX, startY, scale, palette) {
    for (let row = 0; row < grid.length; row++) {
      for (let col = 0; col < grid[row].length; col++) {
        const c = grid[row][col];
        if (c && palette[c]) {
          this.drawPixelRect(ctx, 
            startX + col * scale, startY + row * scale, 
            scale, scale, palette[c]);
        }
      }
    }
  },
  
  // ===== DRAWING FUNCTIONS =====
  
  drawSky(ctx, w, h, period) {
    const colors = this.PALETTE.sky[period];
    const grad = ctx.createLinearGradient(0, 0, 0, h * 0.65);
    grad.addColorStop(0, colors.top);
    grad.addColorStop(0.5, colors.mid);
    grad.addColorStop(1, colors.bot);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h * 0.65);
  },
  
  drawCelestialBody(ctx, period, time) {
    const colors = this.PALETTE.sky[period];
    
    if (period === 'night') {
      // Moon
      const moonX = 500 + Math.sin(time * 0.0003) * 20;
      const moonY = 50;
      ctx.fillStyle = '#F5F5F5';
      ctx.beginPath();
      ctx.arc(moonX, moonY, 18, 0, Math.PI * 2);
      ctx.fill();
      
      // Moon craters
      ctx.fillStyle = '#E0E0E0';
      ctx.beginPath();
      ctx.arc(moonX - 5, moonY - 3, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(moonX + 7, moonY + 5, 3, 0, Math.PI * 2);
      ctx.fill();
      
      // Moon glow
      const glowGrad = ctx.createRadialGradient(moonX, moonY, 15, moonX, moonY, 60);
      glowGrad.addColorStop(0, 'rgba(255,255,255,0.15)');
      glowGrad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 60, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Sun
      let sunY;
      if (period === 'dawn') sunY = 120;
      else if (period === 'day') sunY = 40;
      else if (period === 'sunset') sunY = 100;
      else sunY = 130;
      
      const sunX = period === 'dawn' ? 80 : period === 'sunset' ? 520 : 320;
      
      // Sun glow
      const glowGrad = ctx.createRadialGradient(sunX, sunY, 10, sunX, sunY, 80);
      glowGrad.addColorStop(0, 'rgba(255,200,50,0.3)');
      glowGrad.addColorStop(1, 'rgba(255,200,50,0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 80, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun disc
      ctx.fillStyle = colors.sun;
      ctx.beginPath();
      ctx.arc(sunX, sunY, 16, 0, Math.PI * 2);
      ctx.fill();
      
      // Sun rays
      ctx.strokeStyle = `rgba(255,200,50,${period === 'day' ? 0.2 : 0.1})`;
      ctx.lineWidth = 2;
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + time * 0.001;
        ctx.beginPath();
        ctx.moveTo(sunX + Math.cos(angle) * 20, sunY + Math.sin(angle) * 20);
        ctx.lineTo(sunX + Math.cos(angle) * 30, sunY + Math.sin(angle) * 30);
        ctx.stroke();
      }
    }
  },
  
  drawStars(ctx, time) {
    this.stars.forEach(star => {
      const twinkle = Math.sin(time * star.speed + star.twinkle) * 0.5 + 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${twinkle * 0.8})`;
      ctx.fillRect(Math.round(star.x), Math.round(star.y), Math.round(star.size), Math.round(star.size));
    });
  },
  
  drawClouds(ctx, time) {
    this.clouds.forEach(cloud => {
      cloud.x += cloud.speed;
      if (cloud.x > 700) cloud.x = -cloud.width - 20;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${cloud.opacity * 0.4})`;
      // Draw fluffy cloud
      const cx = cloud.x;
      const cy = cloud.y;
      const cw = cloud.width;
      ctx.beginPath();
      ctx.arc(cx, cy, cw * 0.2, 0, Math.PI * 2);
      ctx.arc(cx + cw * 0.25, cy - cw * 0.1, cw * 0.25, 0, Math.PI * 2);
      ctx.arc(cx + cw * 0.5, cy, cw * 0.2, 0, Math.PI * 2);
      ctx.arc(cx + cw * 0.25, cy + cw * 0.05, cw * 0.18, 0, Math.PI * 2);
      ctx.fill();
    });
  },
  
  drawGround(ctx, h, period) {
    const color = this.PALETTE.ground[period];
    const grad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    grad.addColorStop(0, color);
    grad.addColorStop(1, this.darken(color, 0.3));
    ctx.fillStyle = grad;
    ctx.fillRect(0, h * 0.6, 640, h * 0.4);
    
    // Sidewalk
    ctx.fillStyle = period === 'night' ? '#1a1a2e' : '#78909C';
    ctx.fillRect(30, h * 0.6, 580, 8);
    
    // Ground texture (pixel dots)
    ctx.fillStyle = period === 'night' ? '#1a2a3e' : '#90A4AE';
    for (let i = 0; i < 100; i++) {
      const gx = (i * 6 + 10) % 600 + 20;
      const gy = h * 0.6 + 12 + (i % 3) * 8;
      ctx.fillRect(gx, gy, 2, 1);
    }
  },
  
  darken(color, factor) {
    const hex = color.replace('#', '');
    const r = Math.max(0, parseInt(hex.substr(0, 2), 16) * (1 - factor));
    const g = Math.max(0, parseInt(hex.substr(2, 2), 16) * (1 - factor));
    const b = Math.max(0, parseInt(hex.substr(4, 2), 16) * (1 - factor));
    return `rgb(${Math.round(r)},${Math.round(g)},${Math.round(b)})`;
  },
  
  // ===== CAFE BUILDING =====
  
  drawCafeBuilding(ctx, period, state, time) {
    const P = this.PALETTE.building;
    const bx = 100;
    const by = 80;
    const bw = 440;
    const bh = 180;
    const floorY = by + bh;
    
    // === ROOF (pixel art style) ===
    // Main roof body
    ctx.fillStyle = P.roof;
    ctx.beginPath();
    ctx.moveTo(bx - 15, by + 40);
    ctx.lineTo(bx + 40, by);
    ctx.lineTo(bx + bw - 40, by);
    ctx.lineTo(bx + bw + 15, by + 40);
    ctx.lineTo(bx + bw + 15, by + 50);
    ctx.lineTo(bx - 15, by + 50);
    ctx.closePath();
    ctx.fill();
    
    // Roof tiles (pixel grid)
    ctx.strokeStyle = `${P.roofLight}40`;
    ctx.lineWidth = 1;
    for (let row = 0; row < 5; row++) {
      const ry = by + 5 + row * 8;
      const shrink = row * 6;
      ctx.beginPath();
      ctx.moveTo(bx + shrink, ry);
      ctx.lineTo(bx + bw - shrink, ry);
      ctx.stroke();
    }
    for (let col = 0; col < 30; col++) {
      const cx = bx + 10 + col * 15;
      const topShrink = (by + 5 - (by + 40)) * (cx - bx) / bw * 0.3;
      ctx.beginPath();
      ctx.moveTo(cx, by + 5);
      ctx.lineTo(cx, by + 40);
      ctx.stroke();
    }
    
    // === WALL (brick pattern) ===
    const wallGrad = ctx.createLinearGradient(bx, by + 50, bx + bw, by + bh);
    wallGrad.addColorStop(0, P.wallLight);
    wallGrad.addColorStop(0.5, P.wall);
    wallGrad.addColorStop(1, P.wallDark);
    ctx.fillStyle = wallGrad;
    ctx.fillRect(bx, by + 50, bw, bh - 50);
    
    // Brick pattern
    ctx.strokeStyle = `${P.wallDark}30`;
    ctx.lineWidth = 0.5;
    for (let row = 0; row < 14; row++) {
      const y = by + 52 + row * 12;
      ctx.beginPath();
      ctx.moveTo(bx, y);
      ctx.lineTo(bx + bw, y);
      ctx.stroke();
      const offset = (row % 2) * 20;
      for (let col = 0; col < 22; col++) {
        const x = bx + col * 20 + offset;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + 12);
        ctx.stroke();
      }
    }
    
    // === FRONT AWNING ===
    const awningY = by + 45;
    const awningH = 15;
    for (let i = 0; i < 22; i++) {
      ctx.fillStyle = i % 2 === 0 ? P.awning : P.awningAlt;
      ctx.fillRect(bx + i * 20 - 5, awningY, 20, awningH);
    }
    // Awning scallops
    for (let i = 0; i < 22; i++) {
      ctx.fillStyle = i % 2 === 0 ? P.awning : P.awningAlt;
      ctx.beginPath();
      ctx.arc(bx + i * 20 + 10 - 5, awningY + awningH, 10, 0, Math.PI);
      ctx.fill();
    }
    
    // === WINDOWS (3 large windows with interior lighting) ===
    const winW = 60;
    const winH = 50;
    const winSpacing = 140;
    const winStartX = bx + 80;
    const winY = by + 70;
    const customerCount = state.customerCount;
    const nightTime = (period === 'night' || period === 'dusk' || period === 'dawn');
    
    for (let i = 0; i < 3; i++) {
      const wx = winStartX + i * winSpacing;
      
      // Window frame outer
      ctx.fillStyle = P.frame;
      ctx.fillRect(wx - 4, winY - 4, winW + 8, winH + 8);
      
      // Window interior (light based on time + activity)
      let interiorAlpha;
      if (nightTime) {
        interiorAlpha = 0.4 + (customerCount / 8) * 0.6;
      } else {
        interiorAlpha = 0.3 + Math.random() * 0.05;
      }
      
      const glowIntensity = Math.min(1, interiorAlpha);
      const glowColor = nightTime 
        ? `rgba(255, 220, 100, ${glowIntensity})` 
        : `rgba(180, 220, 255, ${0.3 + Math.random() * 0.1})`;
      
      // Window glass gradient
      const winGrad = ctx.createLinearGradient(wx, winY, wx, winY + winH);
      winGrad.addColorStop(0, glowColor);
      winGrad.addColorStop(1, nightTime ? 'rgba(255,180,50,0.2)' : 'rgba(100,180,255,0.1)');
      ctx.fillStyle = winGrad;
      ctx.fillRect(wx, winY, winW, winH);
      
      // Window reflections (glass shine)
      ctx.fillStyle = nightTime ? 'rgba(255,255,200,0.1)' : 'rgba(255,255,255,0.15)';
      ctx.fillRect(wx + 5, winY + 5, winW * 0.3, winH * 0.4);
      
      // Window cross frame
      ctx.fillStyle = P.frame;
      ctx.fillRect(wx + winW / 2 - 2, winY, 4, winH);
      ctx.fillRect(wx, winY + winH / 2 - 2, winW, 4);
      
      // Window sill
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(wx - 3, winY + winH, winW + 6, 4);
      
      // Interior details (visible at night)
      if (nightTime && customerCount > i) {
        // Draw tiny figures sitting inside
        const figBob = Math.sin(time * 0.004 + i * 2) * 1;
        ctx.fillStyle = 'rgba(255,200,100,0.5)';
        ctx.fillRect(wx + 10, winY + winH - 20 + figBob, 4, 8);
        ctx.fillRect(wx + 10, winY + winH - 24 + figBob, 5, 4);
        ctx.fillRect(wx + winW - 20, winY + winH - 20 + figBob, 4, 8);
        ctx.fillRect(wx + winW - 20, winY + winH - 24 + figBob, 5, 4);
        
        // Table inside window
        ctx.fillStyle = 'rgba(139,90,43,0.6)';
        ctx.fillRect(wx + 15, winY + winH - 16 + figBob, 30, 2);
      }
      
      // Window glow emission (at night)
      if (nightTime) {
        const emitGrad = ctx.createRadialGradient(wx + winW/2, winY + winH/2, 10, wx + winW/2, winY + winH/2, 50);
        emitGrad.addColorStop(0, `rgba(255,200,80,${0.15 * glowIntensity})`);
        emitGrad.addColorStop(1, 'rgba(255,200,80,0)');
        ctx.fillStyle = emitGrad;
        ctx.fillRect(wx - 20, winY - 20, winW + 40, winH + 40);
      }
    }
    
    // === DOOR ===
    const doorX = bx + bw / 2 - 25;
    const doorY = floorY - 55;
    
    // Door frame
    ctx.fillStyle = P.frame;
    ctx.fillRect(doorX - 3, doorY - 3, 56, 58);
    
    // Door body
    const doorGrad = ctx.createLinearGradient(doorX, doorY, doorX + 50, doorY);
    doorGrad.addColorStop(0, P.door);
    doorGrad.addColorStop(0.5, P.doorLight);
    doorGrad.addColorStop(1, P.door);
    ctx.fillStyle = doorGrad;
    ctx.fillRect(doorX, doorY, 50, 55);
    
    // Door arch top
    ctx.fillStyle = P.frame;
    ctx.beginPath();
    ctx.arc(doorX + 25, doorY, 25, Math.PI, 0);
    ctx.fill();
    
    ctx.fillStyle = P.door;
    ctx.beginPath();
    ctx.arc(doorX + 25, doorY, 22, Math.PI, 0);
    ctx.fill();
    
    // Door window
    ctx.fillStyle = nightTime ? 'rgba(255,200,100,0.6)' : 'rgba(180,220,255,0.4)';
    ctx.fillRect(doorX + 12, doorY + 5, 26, 20);
    ctx.strokeStyle = P.frame;
    ctx.lineWidth = 2;
    ctx.strokeRect(doorX + 12, doorY + 5, 26, 20);
    
    // Door handle
    ctx.fillStyle = '#BDBDBD';
    ctx.beginPath();
    ctx.arc(doorX + 42, doorY + 30, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Door light spill (at night)
    if (nightTime) {
      const doorLightGrad = ctx.createRadialGradient(doorX + 25, doorY + 55, 5, doorX + 25, doorY + 55, 40);
      doorLightGrad.addColorStop(0, 'rgba(255,200,80,0.3)');
      doorLightGrad.addColorStop(1, 'rgba(255,200,80,0)');
      ctx.fillStyle = doorLightGrad;
      ctx.fillRect(doorX - 15, doorY + 45, 80, 25);
    }
    
    // === SIGN BOARD ===
    const signX = bx + bw / 2 - 80;
    const signY = by + 5;
    const signW = 160;
    const signH = 35;
    
    // Sign glow
    const signGlow = Math.sin(time * 0.005) * 0.1 + 0.2;
    ctx.fillStyle = `rgba(255,215,0,${signGlow})`;
    ctx.fillRect(signX - 3, signY - 3, signW + 6, signH + 6);
    
    // Sign board
    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(signX, signY, signW, signH);
    ctx.strokeStyle = '#FFD700';
    ctx.lineWidth = 2;
    ctx.strokeRect(signX, signY, signW, signH);
    
    // Sign neon text
    const neonFlicker = Math.sin(time * 0.01) > -0.8 ? 1 : 0.3;
    ctx.fillStyle = `rgba(255,215,0,${neonFlicker})`;
    ctx.font = 'bold 14px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('☕ TRENDY CAFÉ', signX + signW/2, signY + signH/2 + 5);
    
    // Neon glow effect
    ctx.shadowColor = '#FFD700';
    ctx.shadowBlur = 10 * neonFlicker;
    ctx.fillText('☕ TRENDY CAFÉ', signX + signW/2, signY + signH/2 + 5);
    ctx.shadowBlur = 0;
    
    // === FLOWER BOXES ===
    for (let i = 0; i < 3; i++) {
      const fx = bx + 40 + i * 170;
      const fy = winY + winH + 2;
      
      // Box
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(fx, fy, 30, 10);
      
      // Flowers
      const flowerColors = ['#FF5252', '#FF4081', '#E040FB', '#FF6E40', '#FFAB40'];
      for (let j = 0; j < 4; j++) {
        const bob = Math.sin(time * 0.003 + i + j) * 1;
        ctx.fillStyle = flowerColors[(i + j) % flowerColors.length];
        ctx.beginPath();
        ctx.arc(fx + 5 + j * 8, fy + bob, 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Stem
        ctx.fillStyle = '#4CAF50';
        ctx.fillRect(fx + 6 + j * 8, fy + 3, 1, 5);
      }
    }
  },
  
  // ===== PIXEL ART CUSTOMERS =====
  
  drawPixelCustomer(ctx, x, y, scale, customerData, time, isWalking) {
    const bob = isWalking ? Math.sin(time * 0.01 + x) * 2 : Math.sin(time * 0.003 + x * 0.1) * 1;
    const walkBob = isWalking ? Math.sin(time * 0.015 + x) * 3 : 0;
    
    // Head
    ctx.fillStyle = customerData.skin;
    ctx.fillRect(x + 3, y + bob, 6, 6);
    
    // Hair
    ctx.fillStyle = customerData.hat;
    ctx.fillRect(x + 2, y - 1 + bob, 8, 3);
    ctx.fillRect(x + 2, y - 1 + bob, 2, 4);
    ctx.fillRect(x + 8, y - 1 + bob, 2, 4);
    
    // Body (shirt)
    ctx.fillStyle = customerData.shirt;
    ctx.fillRect(x + 2, y + 7 + bob, 8, 8);
    
    // Arms
    const armSwing = isWalking ? Math.sin(time * 0.012 + x) * 2 : 0;
    ctx.fillStyle = customerData.shirt;
    ctx.fillRect(x, y + 8 + bob + armSwing, 3, 6);
    ctx.fillRect(x + 9, y + 8 + bob - armSwing, 3, 6);
    
    // Legs
    ctx.fillStyle = customerData.pants;
    const legSpread = isWalking ? Math.sin(time * 0.015 + x) * 2 : 0;
    ctx.fillRect(x + 3, y + 15 + bob, 2, 6 + legSpread);
    ctx.fillRect(x + 7, y + 15 + bob, 2, 6 - legSpread);
    
    // Shoes
    ctx.fillStyle = '#3E2723';
    ctx.fillRect(x + 2, y + 21 + bob + legSpread, 4, 2);
    ctx.fillRect(x + 6, y + 21 + bob - legSpread, 4, 2);
  },
  
  // ===== PIXEL ART STAFF =====
  
  drawPixelStaff(ctx, x, y, scale, time, staffIndex) {
    const staff = this.PALETTE.staff[staffIndex % this.PALETTE.staff.length];
    const walkBob = Math.sin(time * 0.008 + x * 0.1) * 3;
    const bob = Math.sin(time * 0.005 + x * 0.05) * 1;
    
    // Chef hat
    ctx.fillStyle = staff.hat;
    ctx.fillRect(x + 2, y - 4 + bob, 8, 3);
    ctx.fillRect(x + 1, y - 1 + bob, 10, 3);
    
    // Head
    ctx.fillStyle = staff.skin;
    ctx.fillRect(x + 3, y + bob, 6, 5);
    
    // Body
    ctx.fillStyle = staff.shirt;
    ctx.fillRect(x + 2, y + 6 + bob, 8, 7);
    
    // Apron
    ctx.fillStyle = staff.apron;
    ctx.fillRect(x + 3, y + 8 + bob, 6, 6);
    ctx.fillRect(x + 4, y + 14 + bob, 4, 1);
    
    // Arms
    const armSwing = Math.sin(time * 0.01 + x) * 2;
    ctx.fillStyle = staff.shirt;
    ctx.fillRect(x, y + 7 + bob + armSwing, 3, 5);
    ctx.fillRect(x + 9, y + 7 + bob - armSwing, 3, 5);
    
    // Hands (holding tray)
    ctx.fillStyle = staff.skin;
    ctx.fillRect(x + 1, y + 12 + bob + armSwing, 2, 2);
    ctx.fillRect(x + 9, y + 12 + bob - armSwing, 2, 2);
    
    // Legs
    ctx.fillStyle = staff.pants;
    const legSpread = Math.sin(time * 0.012 + x) * 2;
    ctx.fillRect(x + 3, y + 15 + bob, 2, 5 + legSpread);
    ctx.fillRect(x + 7, y + 15 + bob, 2, 5 - legSpread);
    
    // Shoes
    ctx.fillStyle = '#212121';
    ctx.fillRect(x + 2, y + 20 + bob + legSpread, 4, 2);
    ctx.fillRect(x + 6, y + 20 + bob - legSpread, 4, 2);
    
    // Tray (if walking)
    ctx.fillStyle = '#BDBDBD';
    ctx.fillRect(x + 1, y + 13 + bob + armSwing, 10, 1);
  },
  
  // ===== TABLES AND SEATING =====
  
  drawTables(ctx, floorY, customerCount, time) {
    const tablePositions = [
      { x: 160, y: floorY - 5 },
      { x: 280, y: floorY - 5 },
      { x: 400, y: floorY - 5 },
      { x: 200, y: floorY + 25 },
      { x: 340, y: floorY + 25 }
    ];
    
    for (let i = 0; i < Math.min(5, tablePositions.length); i++) {
      const t = tablePositions[i];
      
      // Table
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(t.x - 15, t.y, 30, 3);
      ctx.fillRect(t.x - 12, t.y + 3, 2, 10);
      ctx.fillRect(t.x + 10, t.y + 3, 2, 10);
      
      // Table top
      ctx.fillStyle = '#6D4C41';
      ctx.fillRect(t.x - 17, t.y - 2, 34, 3);
      
      // Chairs
      ctx.fillStyle = '#795548';
      ctx.fillRect(t.x - 22, t.y + 5, 6, 8);
      ctx.fillRect(t.x + 16, t.y + 5, 6, 8);
    }
    
    // Customers sitting at tables
    for (let i = 0; i < Math.min(customerCount, 5); i++) {
      const t = tablePositions[i];
      const customer = this.PALETTE.customer[i % this.PALETTE.customer.length];
      const seatedX = t.x - 10 + (i % 2) * 20;
      const seatedY = t.y - 12;
      this.drawPixelCustomer(ctx, seatedX, seatedY, 1, customer, time, false);
      
      // Coffee cup on table
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(t.x - 2, t.y - 6, 4, 3);
      ctx.fillStyle = '#5D4037';
      ctx.fillRect(t.x - 1, t.y - 5, 2, 1);
    }
  },
  
  // ===== WALKING CUSTOMERS =====
  
  drawWalkingCustomers(ctx, floorY, customerCount, time) {
    for (let i = 0; i < Math.min(Math.ceil(customerCount / 3), 3); i++) {
      const walkProgress = ((time * 0.03 + i * 200) % 600) / 600;
      const walkX = -20 + walkProgress * 680;
      const walkY = floorY - 2;
      const customer = this.PALETTE.customer[(i + 4) % this.PALETTE.customer.length];
      this.drawPixelCustomer(ctx, walkX, walkY, 1, customer, time, true);
    }
  },
  
  // ===== WALKING STAFF =====
  
  drawWalkingStaff(ctx, floorY, staffCount, time) {
    for (let i = 0; i < Math.min(staffCount, 4); i++) {
      const walkProgress = ((time * 0.02 + i * 150 + 100) % 500) / 500;
      const walkX = -20 + walkProgress * 680;
      const walkY = floorY - 8;
      this.drawPixelStaff(ctx, walkX, walkY, 1, time, i);
    }
  },
  
  // ===== WEATHER EFFECTS =====
  
  drawRain(ctx, w, h, time) {
    ctx.strokeStyle = 'rgba(180, 200, 255, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 60; i++) {
      const x = (i * 11 + time * 0.15) % w;
      const y = (i * 14 + time * 0.4) % h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 4, y + 12);
      ctx.stroke();
    }
    
    // Rain puddles at ground
    ctx.fillStyle = 'rgba(150, 180, 220, 0.1)';
    for (let i = 0; i < 5; i++) {
      const rx = 80 + i * 120;
      const ry = h * 0.6 + 15;
      const ripple = Math.sin(time * 0.01 + i * 2) * 0.5 + 0.5;
      ctx.beginPath();
      ctx.ellipse(rx, ry, 15 + ripple * 5, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  
  drawSnow(ctx, w, h, time) {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    for (let i = 0; i < 50; i++) {
      const x = (i * 13 + Math.sin(time * 0.003 + i) * 30) % w;
      const y = (i * 12 + time * 0.2) % h;
      ctx.beginPath();
      ctx.arc(x, y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
  },
  
  // ===== PARTICLE SYSTEM =====
  
  updateParticles(ctx, cafeX, cafeY, cafeW, cafeH) {
    // Spawn particles
    if (this.particles.length < 30 && Math.random() < 0.08) {
      const types = ['steam', 'sparkle', 'leaf', 'heart'];
      this.particles.push({
        x: cafeX + Math.random() * cafeW,
        y: cafeY + cafeH - 20,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -0.3 - Math.random() * 0.6,
        life: 1,
        type: types[Math.floor(Math.random() * types.length)],
        size: 2 + Math.random() * 3
      });
    }
    
    this.particles = this.particles.filter(p => {
      p.x += p.vx + Math.sin(this.time * 0.005 + p.y * 0.1) * 0.2;
      p.y += p.vy;
      p.life -= 0.015;
      
      switch (p.type) {
        case 'steam':
          ctx.fillStyle = `rgba(220, 220, 220, ${p.life * 0.25})`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * (2 - p.life), 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'sparkle':
          ctx.fillStyle = `rgba(255, 215, 0, ${p.life * 0.5})`;
          ctx.fillRect(p.x - 1, p.y - 1, 2, 2);
          break;
        case 'leaf':
          ctx.fillStyle = `rgba(76, 175, 80, ${p.life * 0.4})`;
          ctx.beginPath();
          ctx.ellipse(p.x, p.y, p.size, p.size / 2, this.time * 0.01, 0, Math.PI * 2);
          ctx.fill();
          break;
        case 'heart':
          ctx.fillStyle = `rgba(255, 82, 82, ${p.life * 0.4})`;
          ctx.font = `${10 * p.size}px serif`;
          ctx.fillText('❤️', p.x, p.y);
          break;
      }
      
      return p.life > 0;
    });
  },
  
  // ===== DECORATIONS (trend items) =====
  
  drawDecorations(ctx, cafeX, cafeY, cafeW, cafeH, decorCount) {
    if (decorCount === 0) return;
    
    const decorItems = [
      { icon: '🌱', color: '#4CAF50', size: 14 },
      { icon: '🪴', color: '#8BC34A', size: 16 },
      { icon: '💡', color: '#FFD54F', size: 12 },
      { icon: '🎵', color: '#E91E63', size: 14 },
      { icon: '📚', color: '#795548', size: 12 },
      { icon: '🌸', color: '#F48FB1', size: 14 },
      { icon: '✨', color: '#FFD700', size: 12 },
      { icon: '🏮', color: '#FF5722', size: 16 },
      { icon: '🎪', color: '#9C27B0', size: 14 },
      { icon: '🖼️', color: '#607D8B', size: 14 },
      { icon: '🎨', color: '#FF9800', size: 14 },
      { icon: '🕯️', color: '#FFF9C4', size: 12 },
      { icon: '🌿', color: '#388E3C', size: 14 },
      { icon: '📷', color: '#455A64', size: 12 },
      { icon: '🎭', color: '#7B1FA2', size: 14 }
    ];
    
    // Place decorations around building
    const positions = [
      { x: cafeX - 15, y: cafeY + cafeH + 5 },
      { x: cafeX + cafeW + 5, y: cafeY + cafeH + 5 },
      { x: cafeX + 30, y: cafeY + cafeH + 25 },
      { x: cafeX + cafeW - 40, y: cafeY + cafeH + 25 },
      { x: cafeX + cafeW / 2, y: cafeY - 10 }
    ];
    
    for (let i = 0; i < Math.min(decorCount, decorItems.length); i++) {
      const decor = decorItems[i];
      const pos = positions[i % positions.length];
      const bob = Math.sin(this.time * 0.003 + i) * 1;
      
      ctx.fillStyle = decor.color;
      ctx.globalAlpha = 0.3;
      ctx.font = `${decor.size}px serif`;
      ctx.textAlign = 'center';
      ctx.fillText(decor.icon, pos.x + bob, pos.y);
      ctx.globalAlpha = 1;
    }
  },
  
  // ===== MAIN DRAW =====
  
  draw() {
    const ctx = this.ctx;
    const w = 640;
    const h = 360;
    const state = this.getCafeState();
    const period = this.getTimePeriod();
    const weather = this.getWeather();
    
    ctx.clearRect(0, 0, w, h);
    
    // === SKY ===
    this.drawSky(ctx, w, h, period);
    
    // === CELESTIAL (sun/moon) ===
    this.drawCelestialBody(ctx, period, this.time);
    
    // === STARS (night only) ===
    if (period === 'night' || period === 'dusk') {
      this.drawStars(ctx, this.time);
    }
    
    // === CLOUDS ===
    if (period === 'day' || period === 'dawn') {
      this.drawClouds(ctx, this.time);
    }
    
    // === GROUND ===
    this.drawGround(ctx, h, period);
    
    // === CAFE BUILDING ===
    this.drawCafeBuilding(ctx, period, state, this.time);
    
    // === WEATHER ===
    if (weather === 'rainy') {
      this.drawRain(ctx, w, h, this.time);
    }
    
    // === FLOOR / GROUND LEVEL ===
    const floorY = 80 + 180; // cafeY + cafeH
    
    // === TABLES AND CUSTOMERS ===
    this.drawTables(ctx, floorY, state.customerCount, this.time);
    
    // === WALKING CUSTOMERS ===
    this.drawWalkingCustomers(ctx, floorY, state.customerCount, this.time);
    
    // === WALKING STAFF ===
    if (state.staffCount > 0) {
      this.drawWalkingStaff(ctx, floorY, state.staffCount, this.time);
    }
    
    // === DECORATIONS ===
    this.drawDecorations(ctx, 100, 80, 440, 180, state.decorCount);
    
    // === PARTICLES ===
    this.updateParticles(ctx, 100, 80, 440, 180);
    
    // === STATUS BAR ===
    const statusBarY = h - 28;
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, statusBarY, w, 28);
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 11px Courier New';
    ctx.textAlign = 'left';
    
    const weatherEmoji = weather === 'rainy' ? '🌧️' : weather === 'cloudy' ? '⛅' : '☀️';
    const periodEmoji = period === 'dawn' ? '🌅' : period === 'day' ? '☀️' : period === 'sunset' ? '🌇' : period === 'dusk' ? '🌆' : '🌙';
    
    ctx.fillText(
      `${periodEmoji} Ngày ${(G.gameDay || 1)} | 👥 ${(G.orders || []).length} khách | 🏗️ ${state.venue.name} | ${weatherEmoji}`,
      12, statusBarY + 18
    );
    
    // Level and revenue
    ctx.fillStyle = '#4CAF50';
    ctx.font = '10px Courier New';
    ctx.fillText(
      `Lv.${G.level || 1} | 💰 ${(G.coins || 0).toLocaleString()}₫ | ⭐ Rep: ${(G.reputation || 0)}`,
      12, statusBarY + 26
    );
  },
  
  // ===== ANIMATION LOOP =====
  
  loop() {
    this.time = Date.now() - this.startTime;
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }
};

// Initialize when DOM is ready
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => PixelArtEngine.init());
  } else {
    PixelArtEngine.init();
  }
}

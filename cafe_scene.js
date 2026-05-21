// ============ CAFE SCENE CANVAS ============
// Animated cafe visualization - main motivation for playing!
const CafeScene = {
  canvas: null,
  ctx: null,
  animFrame: null,
  time: 0,
  customers: [],
  waiters: [],
  particles: [],
  
  init() {
    const canvas = document.createElement('canvas');
    canvas.id = 'cafe-scene';
    canvas.width = 450;
    canvas.height = 280;
    canvas.style.width = '100%';
    canvas.style.height = '280px';
    canvas.style.borderRadius = '12px';
    canvas.style.marginBottom = '12px';
    canvas.style.border = '2px solid #333';
    canvas.style.background = '#0d0d1a';
    
    const wrapper = document.createElement('div');
    wrapper.id = 'scene-wrapper';
    wrapper.style.cssText = 'margin:10px 0;border-radius:12px;overflow:hidden;position:relative;background:linear-gradient(180deg,#1a1a2e,#16213e);padding:10px';
    wrapper.appendChild(canvas);
    
    // Insert before panels
    const content = document.getElementById('content');
    if (content) {
      content.insertBefore(wrapper, content.firstChild);
    }
    
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    
    this.startTime = Date.now();
    this.loop();
  },
  
  // Get time-based colors
  getSkyColors() {
    const hour = (G.gameDay % 24); // simplified
    if (hour >= 6 && hour < 8) return ['#FF6B35', '#FFB347', '#87CEEB']; // sunrise
    if (hour >= 8 && hour < 17) return ['#87CEEB', '#B0E0E6', '#E0F7FA']; // day
    if (hour >= 17 && hour < 19) return ['#FF6347', '#FF8C00', '#FFD700']; // sunset
    if (hour >= 19 && hour < 21) return ['#2C3E50', '#4A6FA5', '#1a1a2e']; // dusk
    return ['#0a0a1a', '#1a1a3e', '#0d0d2a']; // night
  },
  
  // Weather based on game day
  getWeatherEmoji() {
    const weatherDay = G.gameDay || 1;
    const r = weatherDay % 7;
    if (r < 3) return '☀️'; // sunny
    if (r < 5) return '🌧️'; // rainy
    return '⛅'; // cloudy
  },
  
  // Calculate cafe state based on progress
  getCafeState() {
    const venue = VENUE_TYPES[G.venueLevel] || VENUE_TYPES[0];
    const decorCount = G.trendItems.length;
    const staffCount = G.staff.length;
    const customerCount = G.orders.length;
    
    return {
      venue,
      decorCount,
      staffCount,
      customerCount,
      totalBonus: getVenueBonus() - 1
    };
  },
  
  // Draw the cafe scene
  draw() {
    const ctx = this.ctx;
    const w = this.canvas.width;
    const h = this.canvas.height;
    const state = this.getCafeState();
    
    ctx.clearRect(0, 0, w, h);
    
    // === BACKGROUND (sky + ground) ===
    const skyColors = this.getSkyColors();
    const skyGrad = ctx.createLinearGradient(0, 0, 0, h * 0.6);
    skyColors.forEach((color, i) => skyGrad.addColorStop(i / (skyColors.length - 1), color));
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, w, h * 0.6);
    
    // Ground
    const groundGrad = ctx.createLinearGradient(0, h * 0.6, 0, h);
    groundGrad.addColorStop(0, '#3d2b1f');
    groundGrad.addColorStop(1, '#2a1a0f');
    ctx.fillStyle = groundGrad;
    ctx.fillRect(0, h * 0.6, w, h * 0.4);
    
    // === WEATHER EFFECTS ===
    const weather = this.getWeatherEmoji();
    if (weather === '🌧️') {
      this.drawRain(ctx, w, h);
    }
    
    // === CAFE BUILDING ===
    const cafeX = 50;
    const cafeY = h * 0.2;
    const cafeW = 350;
    const cafeH = h * 0.4;
    
    // Building body
    const buildGrad = ctx.createLinearGradient(cafeX, cafeY, cafeX + cafeW, cafeY + cafeH);
    buildGrad.addColorStop(0, '#4a3728');
    buildGrad.addColorStop(0.5, '#6b5240');
    buildGrad.addColorStop(1, '#4a3728');
    ctx.fillStyle = buildGrad;
    
    // Draw building with curved top
    ctx.beginPath();
    ctx.moveTo(cafeX + 20, cafeY + cafeH);
    ctx.lineTo(cafeX + 20, cafeY + 40);
    ctx.quadraticCurveTo(cafeX + cafeW / 2, cafeY - 10, cafeX + cafeW - 20, cafeY + 40);
    ctx.lineTo(cafeX + cafeW - 20, cafeY + cafeH);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#8B7355';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // === WINDOWS ===
    const winSize = 40;
    const winSpacing = 50;
    const startX = cafeX + 60;
    for (let i = 0; i < 3; i++) {
      const wx = startX + i * winSpacing;
      const wy = cafeY + 60;
      
      // Window frame
      ctx.fillStyle = '#2a1f15';
      ctx.fillRect(wx, wy, winSize, winSize);
      
      // Window glow (yellow = open, dim = quiet)
      const glowIntensity = Math.max(0.3, 0.5 + (state.customerCount / 8) * 0.5);
      ctx.fillStyle = `rgba(255, 215, 0, ${glowIntensity})`;
      ctx.fillRect(wx + 3, wy + 3, winSize - 6, winSize - 6);
      
      // Window cross
      ctx.strokeStyle = '#5a4530';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(wx + winSize / 2, wy);
      ctx.lineTo(wx + winSize / 2, wy + winSize);
      ctx.moveTo(wx, wy + winSize / 2);
      ctx.lineTo(wx + winSize, wy + winSize / 2);
      ctx.stroke();
    }
    
    // === DOOR ===
    const doorX = cafeX + cafeW / 2 - 20;
    const doorY = cafeY + cafeH - 60;
    ctx.fillStyle = '#5a3a1a';
    ctx.fillRect(doorX, doorY, 40, 60);
    ctx.strokeStyle = '#8B7355';
    ctx.strokeRect(doorX, doorY, 40, 60);
    
    // Door light
    const doorLight = 10 + Math.sin(this.time * 0.003) * 5;
    ctx.fillStyle = `rgba(255, 200, 100, ${0.3 + Math.sin(this.time * 0.003) * 0.1})`;
    ctx.beginPath();
    ctx.arc(doorX + 20, doorY + 30, doorLight, 0, Math.PI * 2);
    ctx.fill();
    
    // === SIGN ===
    ctx.fillStyle = '#FFD700';
    ctx.font = 'bold 16px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('☕ ' + state.venue.name, cafeX + cafeW / 2, cafeY + 35);
    
    // === DECORATIONS ===
    if (state.decorCount > 0) {
      // Draw decorative items around the building
      const decorIcons = ['🌱', '🪴', '✨', '💡', '🎵', '📚'];
      for (let i = 0; i < Math.min(state.decorCount, 10); i++) {
        const dx = cafeX + (i % 5) * 80 + 20;
        const dy = cafeY + cafeH + 10 + (Math.floor(i / 5)) * 25;
        ctx.font = '16px serif';
        ctx.fillText(decorIcons[i % decorIcons.length], dx, dy);
      }
    }
    
    // === CUSTOMERS (people sitting and walking) ===
    if (state.customerCount > 0) {
      this.drawCustomers(ctx, cafeX, cafeY, cafeW, cafeH, state.customerCount);
    }
    
    // === WAITERS (staff walking) ===
    if (state.staffCount > 0) {
      this.drawWaiters(ctx, cafeX, cafeY, cafeW, cafeH, state.staffCount);
    }
    
    // === AMBIENT PARTICLES (steam, sparkles) ===
    if (this.particles.length === 0 || Math.random() < 0.05) {
      this.particles.push({
        x: cafeX + Math.random() * cafeW,
        y: cafeY + cafeH - 10,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -0.5 - Math.random() * 0.5,
        life: 1,
        type: Math.random() > 0.5 ? 'steam' : 'sparkle'
      });
    }
    
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      if (p.type === 'steam') {
        ctx.fillStyle = `rgba(200, 200, 200, ${p.life * 0.3})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 + (1 - p.life) * 3, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.fillStyle = `rgba(255, 215, 0, ${p.life * 0.6})`;
        ctx.font = '8px serif';
        ctx.fillText('✨', p.x, p.y);
      }
      
      return p.life > 0;
    });
    
    // === STATUS OVERLAY ===
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(10, h - 30, 200, 22);
    ctx.fillStyle = '#FFD700';
    ctx.font = '11px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText(
      `👥 ${state.customerCount} đang ngồi | ${weather} | ${state.decorCount} đồ họa`,
      18, h - 15
    );
  },
  
  drawRain(ctx, w, h) {
    ctx.strokeStyle = 'rgba(150, 180, 255, 0.3)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 40; i++) {
      const x = (i * 12 + this.time * 0.1) % w;
      const y = (i * 17 + this.time * 0.3) % h;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x - 3, y + 10);
      ctx.stroke();
    }
  },
  
  drawCustomers(ctx, cafeX, cafeY, cafeW, cafeH, count) {
    const emojis = ['☕', '🧋', '🍵', '🧉', '🥤', '🍶'];
    const seatPositions = [];
    
    // Generate table positions
    for (let i = 0; i < Math.min(count, 6); i++) {
      const tx = cafeX + 60 + (i % 3) * 120;
      const ty = cafeY + cafeH + 20;
      seatPositions.push({ x: tx, y: ty });
      
      // Table
      ctx.fillStyle = '#5a4530';
      ctx.fillRect(tx - 15, ty, 30, 3);
      
      // Customer emoji
      const bob = Math.sin(this.time * 0.005 + i) * 2;
      ctx.font = '14px serif';
      ctx.fillText(emojis[i % emojis.length], tx - 7, ty + bob + 18);
    }
    
    // Walking customer (arriving)
    if (count > 0) {
      const walkX = cafeX - 30 + (this.time * 0.05) % (cafeW + 60);
      const walkY = cafeY + cafeH + 10;
      ctx.font = '16px serif';
      ctx.fillText('🚶', walkX, walkY);
    }
  },
  
  drawWaiters(ctx, cafeX, cafeY, cafeW, cafeH, count) {
    for (let i = 0; i < Math.min(count, 4); i++) {
      const walkOffset = Math.sin(this.time * 0.003 + i * 2) * 60;
      const wx = cafeX + cafeW / 2 + walkOffset;
      const wy = cafeY + cafeH - 5;
      
      ctx.font = '16px serif';
      ctx.fillText('🏃', wx, wy);
    }
  },
  
  // Animation loop
  loop() {
    this.time = Date.now() - this.startTime;
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }
};

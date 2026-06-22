// cafe_scene_v7.js — Pixel Art Animated Scene for Trendy Cafe
// Standalone: auto-inits, polls G object, no interference with game loop

(function() {
  'use strict';

  // === CONFIG ===
  const CANVAS_W = 320;
  const CANVAS_H = 200;
  const SCALE = 2;
  const TICK_MS = 16; // ~60fps

  // === STATE ===
  let canvas, ctx;
  let lastTick = 0;
  let gameTime = 0; // cycles through 24h
  let weather = 'clear'; // clear, rain, snow
  let weatherTimer = 0;
  let customers = []; // walking customers
  let particles = []; // steam, sparkles
  let lastVenueLevel = -1;
  let lastTrendCount = -1;
  let lastDay = -1;

  // === PIXEL ART SPRITES (1-bit per color, 8x8/16x16 grids) ===
  const COLORS = {
    sky: ['#87CEEB', '#FFB347', '#1a1a3e', '#0a0a2e'], // day, sunset, night, deep night
    ground: ['#4a7c3f', '#3d6b34', '#2d5a28'],
    building: ['#8B4513', '#A0522D', '#D2691E'],
    roof: ['#8B0000', '#B22222', '#DC143C'],
    window: ['#FFD700', '#FFF8DC', '#4a4a8a'],
    door: ['#654321', '#8B6914'],
    neon: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF'],
    tree: ['#228B22', '#32CD32', '#006400'],
    customer: ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A8E6CF', '#FF8C00'],
    staff: ['#FFFFFF', '#F5F5DC', '#DEB887'],
    rain: ['#4169E1', '#6495ED', '#87CEEB'],
    snow: ['#FFFFFF', '#F0F8FF', '#E6E6FA'],
    steam: ['#E8E8E8', '#F5F5F5', '#FFFFFF'],
    sparkle: ['#FFD700', '#FFA500', '#FF6347', '#FF69B4'],
    shadow: 'rgba(0,0,0,0.3)',
    text: '#FFD700'
  };

  // === PIXEL PATTERNS (simplified sprites) ===
  const SPRITES = {
    // 8x8 street stall
    street_stall: [
      '........',
      '..####..',
      '.######.',
      '########',
      '##..##..',
      '##..##..',
      '########',
      '##..##..'
    ],
    // 16x8 mall building
    mall: [
      '................',
      '..##....##....##',
      '.######.######..',
      '.######.######..',
      '##..##..##..##..',
      '##..##..##..##..',
      '################',
      '##..##..##..##..'
    ],
    // 16x8 garden
    garden: [
      '..####..####....',
      '.######.######..',
      '.######.######..',
      '##..##..##..##..',
      '##..##..##..##..',
      '################',
      '##..##..##..##..',
      '..####..####....'
    ],
    // 20x10 park
    park: [
      '....####....####....',
      '...######..######...',
      '..########.######...',
      '.#################..',
      '.#################..',
      '####################',
      '##..##..##..##..##..',
      '##..##..##..##..##..',
      '####################',
      '..####....####....'
    ]
  };

  // === INIT ===
  function init() {
    // Create canvas
    canvas = document.createElement('canvas');
    canvas.width = CANVAS_W;
    canvas.height = CANVAS_H;
    canvas.style.width = (CANVAS_W * SCALE) + 'px';
    canvas.style.height = (CANVAS_H * SCALE) + 'px';
    canvas.style.imageRendering = 'pixelated';
    canvas.style.display = 'block';
    canvas.style.margin = '10px auto';
    canvas.style.borderRadius = '8px';
    canvas.style.border = '2px solid #FFD700';
    canvas.style.background = '#000';

    // Insert into DOM — find first panel or body
    const panel = document.getElementById('panel-orders');
    if (panel) {
      panel.insertBefore(canvas, panel.firstChild);
    } else {
      document.body.insertBefore(canvas, document.body.firstChild);
    }

    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;

    // Start render loop
    lastTick = performance.now();
    requestAnimationFrame(renderLoop);

    console.log('🎨 cafe_scene_v7.js initialized');
  }

  // === DAY/NIGHT CYCLE (1 game day = 60s real time) ===
  function getDayTime() {
    if (!G || !G.gameDay) return 0.5;
    const hour = ((gameTime % 24) + 24) % 24;
    return hour / 24;
  }

  function getSkyColor(t) {
    // t: 0=midnight, 0.25=sunrise, 0.5=noon, 0.75=sunset
    if (t < 0.15) return COLORS.sky[3]; // deep night
    if (t < 0.25) return lerpColor(COLORS.sky[3], COLORS.sky[1], (t - 0.15) / 0.1); // sunrise
    if (t < 0.7) return COLORS.sky[0]; // day
    if (t < 0.8) return lerpColor(COLORS.sky[0], COLORS.sky[1], (t - 0.7) / 0.1); // sunset
    return lerpColor(COLORS.sky[1], COLORS.sky[3], (t - 0.8) / 0.2); // night
  }

  function lerpColor(c1, c2, t) {
    const r1 = parseInt(c1.slice(1, 3), 16);
    const g1 = parseInt(c1.slice(3, 5), 16);
    const b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16);
    const g2 = parseInt(c2.slice(3, 5), 16);
    const b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
  }

  // === WEATHER ===
  function updateWeather(dt) {
    weatherTimer -= dt;
    if (weatherTimer <= 0) {
      const r = Math.random();
      if (r < 0.5) weather = 'clear';
      else if (r < 0.8) weather = 'rain';
      else weather = 'snow';
      weatherTimer = 10000 + Math.random() * 30000;
    }
  }

  // === CUSTOMERS ===
  function spawnCustomer() {
    if (customers.length >= 3) return;
    const dir = Math.random() > 0.5 ? 1 : -1;
    customers.push({
      x: dir > 0 ? -8 : CANVAS_W + 8,
      y: CANVAS_H - 24,
      dir: dir,
      speed: 0.3 + Math.random() * 0.3,
      color: COLORS.customer[Math.floor(Math.random() * COLORS.customer.length)],
      frame: 0,
      target: CANVAS_W / 2 + (Math.random() - 0.5) * 40,
      state: 'walking' // walking, waiting, leaving
    });
  }

  function updateCustomers(dt) {
    for (let i = customers.length - 1; i >= 0; i--) {
      const c = customers[i];
      c.frame += dt * 0.005;

      if (c.state === 'walking') {
        c.x += c.dir * c.speed * dt * 0.06;
        if (Math.abs(c.x - c.target) < 2) {
          c.state = 'waiting';
          setTimeout(() => {
            if (c) { c.state = 'leaving'; c.dir = c.x < CANVAS_W / 2 ? -1 : 1; }
          }, 3000 + Math.random() * 5000);
        }
      } else if (c.state === 'leaving') {
        c.x += c.dir * c.speed * 1.5 * dt * 0.06;
        if (c.x < -16 || c.x > CANVAS_W + 16) {
          customers.splice(i, 1);
        }
      }
    }

    // Spawn new customers
    if (G && Math.random() < 0.002 * (G.staff.length > 0 ? 2 : 0.5)) {
      spawnCustomer();
    }
  }

  // === PARTICLES ===
  function spawnParticle(type) {
    if (particles.length >= 30) return;
    particles.push({
      x: type === 'steam' ? CANVAS_W / 2 + (Math.random() - 0.5) * 30 : CANVAS_W / 2 + (Math.random() - 0.5) * 60,
      y: CANVAS_H - 40 + Math.random() * 10,
      vx: (Math.random() - 0.5) * 0.2,
      vy: -0.3 - Math.random() * 0.3,
      life: 1,
      decay: 0.005 + Math.random() * 0.005,
      type: type,
      color: type === 'steam' ? COLORS.steam[Math.floor(Math.random() * COLORS.steam.length)] :
             type === 'sparkle' ? COLORS.sparkle[Math.floor(Math.random() * COLORS.sparkle.length)] :
             COLORS.rain[Math.floor(Math.random() * COLORS.rain.length)],
      size: type === 'sparkle' ? 1 : type === 'steam' ? 2 : 1
    });
  }

  function updateParticles(dt) {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx * dt * 0.06;
      p.y += p.vy * dt * 0.06;
      p.life -= p.decay * dt * 0.06;

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      // Spawn more particles
      if (Math.random() < 0.01) {
        if (p.type === 'steam') spawnParticle('steam');
        if (p.type === 'sparkle') spawnParticle('sparkle');
      }
    }

    // Weather particles
    if (weather === 'rain' && Math.random() < 0.3) {
      particles.push({
        x: Math.random() * CANVAS_W,
        y: -4,
        vx: -0.5,
        vy: 2 + Math.random(),
        life: 1,
        decay: 0.02,
        type: 'rain',
        color: COLORS.rain[Math.floor(Math.random() * COLORS.rain.length)],
        size: 1
      });
    }
    if (weather === 'snow' && Math.random() < 0.1) {
      particles.push({
        x: Math.random() * CANVAS_W,
        y: -4,
        vx: (Math.random() - 0.5) * 0.3,
        vy: 0.5 + Math.random() * 0.5,
        life: 1,
        decay: 0.005,
        type: 'snow',
        color: COLORS.snow[Math.floor(Math.random() * COLORS.snow.length)],
        size: 2
      });
    }
  }

  // === RENDER ===
  function renderScene(time) {
    const t = getDayTime();
    const skyColor = getSkyColor(t);

    // Sky
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);

    // Stars (night)
    if (t > 0.75 || t < 0.2) {
      ctx.fillStyle = '#FFFFFF';
      for (let i = 0; i < 20; i++) {
        const sx = (i * 47 + 13) % CANVAS_W;
        const sy = (i * 31 + 7) % (CANVAS_H * 0.4);
        const twinkle = Math.sin(time * 0.003 + i) * 0.5 + 0.5;
        ctx.globalAlpha = twinkle * 0.8;
        ctx.fillRect(sx, sy, 1, 1);
      }
      ctx.globalAlpha = 1;
    }

    // Sun/Moon
    const celestialY = CANVAS_H * 0.3 + Math.cos(t * Math.PI) * CANVAS_H * 0.2;
    const celestialX = t * CANVAS_W;
    if (t > 0.2 && t < 0.8) {
      // Sun
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 12, 0, Math.PI * 2);
      ctx.fill();
      // Glow
      ctx.fillStyle = 'rgba(255,215,0,0.2)';
      ctx.beginPath();
      ctx.arc(celestialX, celestialY, 20, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Moon
      ctx.fillStyle = '#F0F8FF';
      ctx.beginPath();
      ctx.arc(CANVAS_W - celestialX, celestialY, 10, 0, Math.PI * 2);
      ctx.fill();
    }

    // Ground
    const groundY = CANVAS_H - 30;
    ctx.fillStyle = COLORS.ground[Math.floor(t * 2) % COLORS.ground.length];
    ctx.fillRect(0, groundY, CANVAS_W, 30);

    // Ground texture (pixel dots)
    ctx.fillStyle = 'rgba(0,0,0,0.1)';
    for (let i = 0; i < 30; i++) {
      const gx = (i * 11) % CANVAS_W;
      const gy = groundY + 5 + (i * 7) % 20;
      ctx.fillRect(gx, gy, 1, 1);
    }

    // === BUILDING (based on venueLevel) ===
    const venueLevel = G && G.venueLevel !== undefined ? G.venueLevel : 0;
    const buildingW = venueLevel === 0 ? 32 : venueLevel === 1 ? 48 : venueLevel === 2 ? 56 : 64;
    const buildingH = venueLevel === 0 ? 24 : venueLevel === 1 ? 40 : venueLevel === 2 ? 48 : 56;
    const buildingX = (CANVAS_W - buildingW) / 2;
    const buildingY = groundY - buildingH;

    // Building body
    const buildingColors = ['#8B4513', '#6B8E23', '#4682B4', '#FFD700'];
    ctx.fillStyle = buildingColors[venueLevel] || buildingColors[0];
    ctx.fillRect(buildingX, buildingY, buildingW, buildingH);

    // Building pixel border
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(buildingX, buildingY, buildingW, 2);
    ctx.fillRect(buildingX, buildingY, 2, buildingH);
    ctx.fillRect(buildingX + buildingW - 2, buildingY, 2, buildingH);
    ctx.fillRect(buildingX, buildingY + buildingH - 2, buildingW, 2);

    // Roof
    const roofColors = ['#8B0000', '#2F4F4F', '#228B22', '#FFD700'];
    ctx.fillStyle = roofColors[venueLevel] || roofColors[0];
    ctx.fillRect(buildingX - 4, buildingY - 4, buildingW + 8, 6);
    ctx.fillRect(buildingX - 2, buildingY - 8, buildingW + 4, 4);

    // Windows
    const windowCount = venueLevel === 0 ? 1 : venueLevel === 1 ? 3 : venueLevel === 2 ? 4 : 5;
    const windowW = 6;
    const windowH = 8;
    const windowSpacing = (buildingW - windowCount * windowW) / (windowCount + 1);
    for (let i = 0; i < windowCount; i++) {
      const wx = buildingX + windowSpacing * (i + 1) + windowW * i;
      const wy = buildingY + 8;

      // Window glow (warm light at night)
      const nightGlow = (t > 0.75 || t < 0.25) ? 0.5 + Math.sin(time * 0.002 + i) * 0.2 : 0.1;
      ctx.fillStyle = COLORS.window[Math.floor(nightGlow * 2) % COLORS.window.length];
      ctx.globalAlpha = 0.3 + nightGlow;
      ctx.fillRect(wx, wy, windowW, windowH);
      ctx.globalAlpha = 1;

      // Window frame
      ctx.fillStyle = '#333';
      ctx.fillRect(wx, wy, windowW, 1);
      ctx.fillRect(wx, wy + windowH - 1, windowW, 1);
      ctx.fillRect(wx, wy, 1, windowH);
      ctx.fillRect(wx + windowW - 1, wy, 1, windowH);
      // Cross
      ctx.fillRect(wx + windowW / 2 - 0.5, wy, 1, windowH);
      ctx.fillRect(wx, wy + windowH / 2 - 0.5, windowW, 1);
    }

    // Door
    const doorW = 8;
    const doorH = 12;
    const doorX = (CANVAS_W - doorW) / 2;
    const doorY = groundY - doorH;
    ctx.fillStyle = COLORS.door[0];
    ctx.fillRect(doorX, doorY, doorW, doorH);
    ctx.fillStyle = COLORS.door[1];
    ctx.fillRect(doorX + 2, doorY + 2, doorW - 4, doorH - 4);
    // Door knob
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(doorX + doorW - 3, doorY + doorH / 2, 1, 1);

    // Neon sign
    const signText = '☕ TRENDY';
    const signX = (CANVAS_W - signText.length * 4) / 2;
    const signY = buildingY - 16;
    const neonColor = COLORS.neon[Math.floor(time * 0.001) % COLORS.neon.length];
    ctx.fillStyle = neonColor;
    ctx.font = '6px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(signText, CANVAS_W / 2, signY);
    // Neon glow
    ctx.fillStyle = neonColor.replace('#', 'rgba(').replace(/^#/, '').split('').slice(0, 3).join(',');
    ctx.globalAlpha = 0.2 + Math.sin(time * 0.003) * 0.1;
    ctx.font = '8px monospace';
    ctx.fillText(signText, CANVAS_W / 2, signY);
    ctx.globalAlpha = 1;

    // === TREND ITEMS (decorations) ===
    if (G && G.trendItems && G.trendItems.length > 0) {
      G.trendItems.forEach((item, idx) => {
        const dx = buildingX - 20 - (idx * 15);
        const dy = groundY - 10;

        if (item.id === 't_plant' || item.id === 't_girl') {
          // Plant
          ctx.fillStyle = '#228B22';
          ctx.fillRect(dx, dy, 4, 10);
          ctx.fillStyle = '#32CD32';
          ctx.fillRect(dx - 2, dy - 2, 8, 4);
          ctx.fillRect(dx - 1, dy - 6, 6, 4);
        } else if (item.id === 't_neon') {
          // Neon sign glow
          ctx.fillStyle = '#FF6B6B';
          ctx.globalAlpha = 0.3 + Math.sin(time * 0.005) * 0.2;
          ctx.fillRect(dx, dy - 8, 12, 12);
          ctx.globalAlpha = 1;
        } else if (item.id === 't_petzone') {
          // Pet (cat)
          ctx.fillStyle = '#FF8C00';
          ctx.fillRect(dx, dy, 6, 4);
          ctx.fillRect(dx + 1, dy - 2, 2, 2);
          ctx.fillRect(dx + 4, dy - 2, 2, 2);
        } else if (item.id === 't_tree' || item.id === 't_rooftopgarden') {
          // Tree
          ctx.fillStyle = '#8B4513';
          ctx.fillRect(dx + 3, dy, 2, 10);
          ctx.fillStyle = '#228B22';
          ctx.fillRect(dx - 2, dy - 6, 10, 8);
          ctx.fillRect(dx, dy - 10, 6, 4);
        }
      });
    }

    // === STAFF (visible through windows at night) ===
    if (G && G.staff && G.staff.length > 0) {
      const windowCount = venueLevel === 0 ? 1 : venueLevel === 1 ? 3 : venueLevel === 2 ? 4 : 5;
      const windowSpacing = (buildingW - windowCount * 6) / (windowCount + 1);
      const showStaff = t > 0.7 || t < 0.2;

      if (showStaff) {
        G.staff.slice(0, windowCount).forEach((staff, i) => {
          const wx = buildingX + windowSpacing * (i + 1) + 6 * i + 1;
          const wy = buildingY + 10;
          // Simple staff silhouette
          ctx.fillStyle = COLORS.staff[0];
          ctx.fillRect(wx, wy, 3, 5);
          ctx.fillRect(wx + 1, wy - 2, 1, 2);
        });
      }
    }

    // === CUSTOMERS ===
    customers.forEach(c => {
      // Body
      ctx.fillStyle = c.color;
      ctx.fillRect(c.x, c.y - 6, 4, 6);
      // Head
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(c.x + 1, c.y - 10, 2, 4);
      // Legs (animated)
      const legOffset = Math.sin(c.frame * 3) * 1;
      ctx.fillStyle = '#333';
      ctx.fillRect(c.x + 1, c.y, 1, 2 + legOffset);
      ctx.fillRect(c.x + 3, c.y, 1, 2 - legOffset);
    });

    // === PARTICLES ===
    particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      if (p.type === 'steam') {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      } else if (p.type === 'sparkle') {
        ctx.fillRect(p.x, p.y, p.size, p.size);
        ctx.fillRect(p.x - 1, p.y, p.size, p.size);
        ctx.fillRect(p.x, p.y - 1, p.size, p.size);
      } else if (p.type === 'rain') {
        ctx.fillRect(p.x, p.y, 1, 3);
      } else if (p.type === 'snow') {
        ctx.fillRect(p.x, p.y, p.size, p.size);
      }
      ctx.globalAlpha = 1;
    });

    // === WEATHER OVERLAY ===
    if (weather === 'rain') {
      ctx.fillStyle = 'rgba(100,100,150,0.1)';
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }

    // === TITLE ===
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, CANVAS_H - 14, CANVAS_W, 14);
    ctx.fillStyle = '#FFD700';
    ctx.font = '8px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('☕ Trendy Cafe v7', 4, CANVAS_H - 4);
    ctx.textAlign = 'right';
    if (G) {
      ctx.fillText('Day ' + (G.gameDay || 1) + ' Lv' + (G.lv || 1), CANVAS_W - 4, CANVAS_H - 4);
    }
  }

  // === RENDER LOOP ===
  function renderLoop(timestamp) {
    const dt = timestamp - lastTick;
    lastTick = timestamp;

    gameTime += dt * 0.001; // ~1 cycle per second for visible day/night

    updateWeather(dt);
    updateCustomers(dt);
    updateParticles(dt);

    // Periodic particle spawning
    if (Math.random() < 0.05) spawnParticle('steam');
    if (Math.random() < 0.03) spawnParticle('sparkle');

    renderScene(timestamp);

    requestAnimationFrame(renderLoop);
  }

  // === BOOT ===
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose for debugging
  window.cafeScene = {
    getWeather: () => weather,
    getCustomers: () => customers.length,
    getParticles: () => particles.length
  };

})();

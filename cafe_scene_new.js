/**
 * CafeSceneV7 — Layer cảnh quán Top-Down cho Trendy Cafe V7 Ultimate
 * File độc lập, không sửa code game core. Chỉ poll từ object G.
 * Canvas 320×200px, render qua fillRect (pixel art).
 */

(function() {
'use strict';

// ======================== CONSTANTS / PALETTE ========================
const C = {
  W: 320, H: 200,                // canvas dimensions
  BG:       '#0f3460',           // dark blue background
  ACCENT:   '#FFD700',           // gold accent
  BUILDING: '#8B4513',           // building wall brown
  BLDG_LIT: '#A0522D',           // building lit (day)
  BAR:      '#D2691E',           // bar counter wood
  FLOOR:    '#808080',           // floor tile gray
  DOOR:     '#654321',           // deep brown door
  DOOR_KNOB:'#FFD700',           // gold doorknob
  GLASS:    'rgba(255,255,255,0.12)', // window glass
  GLASS_GLOW:'rgba(255,215,0,0.35)',  // window neon glow
  WALL_INNER:'#16213e',          // interior wall dark
  STAFF_W:  '#FFFFFF',           // staff white apron
  STAFF_F:  '#F5F5DC',           // staff skin tone
  STEAM:    'rgba(255,255,255,0.6)',   // steam particles
};

// Customer pastel palette
const CUSTOMER_PALETTES = [
  {head:'#e74c3c',body:'#9b59b6'},{head:'#3498db',body:'#2ecc71'},
  {head:'#f39c12',body:'#e67e22'},{head:'#1abc9c',body:'#8e44ad'},
  {head:'#e91e63',body:'#00bcd4'},{head:'#ff5722',body:'#ffc107'},
  {head:'#607d8b',body:'#795548'},{head:'#009688',body:'#4caf50'},
];

// ======================== STATE ========================
const CafeSceneV7 = {
  // Canvas refs
  canvas: null, ctx: null, wrapper: null,

  // Simulation state
  customers: [],      // active customer entities
  particles: [],      // weather/steam particles
  neonPhase: 0,       // rotating neon sign phase
  nightAlpha: 0,      // day/night overlay darkness (0-0.55)
  lastTick: 0,        // timestamp for frame pacing

  // Polling state snapshots (from G)
  _g: null,           // reference to game global G
  _gameDay: 1,
  _venueLevel: 0,
  _weatherType: 'clear',
  _staffCount: 0,
  _orderCount: 0,

  // Weather state
  _weatherState: { type: 'clear', particles: [] },

  // Internal timing
  _spawnTimer: 0,
  _tickInterval: 60,   // ms per logic tick inside rAF loop

  /** ==================== INIT ==================== */
  init() {
    this.wrapper = document.getElementById('cafe-scene-wrapper');
    if (!this.wrapper) {
      console.warn('[CafeSceneV7] #cafe-scene-wrapper not found — skipping');
      return false;
    }

    this.canvas = document.createElement('canvas');
    this.canvas.id = 'cafe-canvas';
    this.canvas.width  = C.W;
    this.canvas.height = C.H;
    this.canvas.style.width  = '100%';
    this.canvas.style.height = 'auto';
    this.canvas.style.display = 'block';
    this.wrapper.appendChild(this.canvas);

    this.ctx = this.canvas.getContext('2d');
    this._g = window.G;
    if (!this._g) {
      console.warn('[CafeSceneV7] G not found — will poll later');
    }

    // Start render loop
    this._running = true;
    this._lastFrameTime = 0;
    requestAnimationFrame(t => this._loop(t));

    console.log('[CafeSceneV7] Cafe scene initialized ✅');
    return true;
  },

  /** ==================== MAIN LOOP ==================== */
  _loop(timestamp) {
    if (!this._running) return;

    const dt = timestamp - (this._lastFrameTime || timestamp);
    this._lastFrameTime = timestamp;

    // Throttle logic to ~60fps equivalent with fixed timestep
    this._spawnTimer += dt;
    if (this._spawnTimer >= this._tickInterval) {
      this._logic(this._spawnTimer / 1000);
      this._spawnTimer = 0;
    }

    this._draw();
    requestAnimationFrame(t => this._loop(t));
  },

  /** ==================== LOGIC (poll G each tick) ==================== */
  _logic(dtSec) {
    // Poll game state safely
    const g = window.G;
    if (g) this._g = g;
    if (!this._g) return;

    // Update snapshots
    const prevDay = this._gameDay;
    this._gameDay = (this._g.gameDay != null) ? this._g.gameDay : 1;
    this._venueLevel = (this._g.venueLevel != null) ? this._g.venueLevel : 0;
    this._orderCount = (this._g.orders || []).length;

    // Weather polling
    const weather = this._getWeather();
    if (weather !== this._weatherState.type) {
      this._weatherState.type = weather;
      this._initWeatherParticles(weather);
    }

    // Day/night cycle
    this._updateNightAlpha();

    // Neon color phase
    this.neonPhase += dtSec * 0.3;

    // Spawn customers based on order queue (simulated)
    this._spawnTimerReal = this._spawnTimerReal || 0;
    this._spawnTimerReal += dtSec;
    const spawnInterval = Math.max(2, 5 - this._venueLevel * 0.8);
    if (this._spawnTimerReal >= spawnInterval && this.customers.length < 3 + this._venueLevel) {
      this._spawnCustomer();
      this._playSFX('door');
      this._spawnTimerReal = 0;
    }

    // Update customer lifecycle
    for (let i = this.customers.length - 1; i >= 0; i--) {
      const c = this.customers[i];
      if (!c) continue;

      switch (c.state) {
        case 'walking_in':
          c.timer -= dtSec;
          if (c.timer <= 0) {
            // Find nearest empty table
            const freeTable = this._findFreeTable();
            if (freeTable !== -1) {
              c.targetTable = freeTable;
              c.state = 'seated';
              c.x = freeTable.x + 5;
              c.y = freeTable.y + 5;
              c.timer = 3 + Math.random() * 4; // sitting duration (serve time)
            } else {
              c.state = 'leaving';
              c.exitSide = 'left';
              c.timer = 1.5;
            }
          }
          break;

        case 'seated':
          c.timer -= dtSec;
          // Auto-serve: reduce timer based on staff count
          const effectiveSpeed = this._g && this._g.staffBuffs ?
            1 + (this._g.staffBuffs.all_speed || 0) : 1;
          c.serveTime -= dtSec * effectiveSpeed;
          if (c.serveTime <= 0) {
            c.state = 'finishing';
            c.timer = 0.5;
            this._playSFX('pay');
          }
          break;

        case 'finishing':
          c.timer -= dtSec;
          if (c.timer <= 0) {
            c.state = 'walking_out';
            c.exitSide = Math.random() > 0.3 ? 'right' : 'left';
            c.timer = 2;
            c.bobTimer = 0;
          }
          break;

        case 'walking_out':
          c.timer -= dtSec;
          if (c.x >= C.W + 15 || c.x <= -15) {
            this.customers.splice(i, 1);
          } else {
            c.x += (c.exitSide === 'right' ? 30 : -30) * dtSec;
          }
          break;

        case 'leaving':
          c.timer -= dtSec;
          if (c.timer <= 0) {
            this.customers.splice(i, 1);
          } else {
            c.x = c.exitSide === 'left' ? Math.max(-20, c.x - 25 * dtSec) : C.W + 20;
          }
          break;
      }

      // Idle bobbing when seated
      if (c.state === 'seated') {
        c.bobTimer = (c.bobTimer || 0) + dtSec * 3;
      }
    }

    // Update particles
    this._updateParticles(dtSec);
  },

  /** ==================== RENDERING ==================== */
  _draw() {
    const ctx = this.ctx;
    if (!ctx) return;
    const w = C.W, h = C.H;

    // === Sky / Weather layer ===
    this._drawSky(ctx);

    // === Building exterior (top half) ===
    this._drawBuilding(ctx);

    // === Bar counter ===
    this._drawBar(ctx);

    // === Tables & customers ===
    this._drawTables(ctx);

    // === Draw seated customers ===
    for (const c of this.customers) {
      if (c.state === 'seated' && c.targetTable !== undefined) {
        const bobY = Math.sin(c.bobTimer || 0) * 1.5;
        ctx.fillStyle = c.color.head;
        ctx.fillRect(c.x, c.y + bobY - 2, 4, 4); // head
        ctx.fillStyle = c.color.body;
        ctx.fillRect(c.x, c.y + bobY + 2, 4, 3); // body
      }
    }

    // === Staff walk animation (between bar and tables) ===
    this._drawStaff(ctx);

    // === Steam from bar ===
    this._drawSteam(ctx);

    // === Entrance door ===
    this._drawDoor(ctx);

    // === Neon sign ===
    this._drawNeonSign(ctx);

    // === Night overlay ===
    if (this.nightAlpha > 0.01) {
      ctx.fillStyle = `rgba(5,5,30,${this.nightAlpha})`;
      ctx.fillRect(0, 0, w, h);
      // Window glow at night
      ctx.fillStyle = `rgba(255,215,0,${this.nightAlpha * 1.8})`;
      ctx.fillRect(44, 32, 28, 28); // window1
      ctx.fillRect(96, 32, 28, 28); // window2
    }

    // === Floor tile pattern ===
    this._drawFloor(ctx);

    // === Weather overlay particles ===
    this._drawWeatherOverlay(ctx);

    // === HUD corner decorations ===
    ctx.fillStyle = C.ACCENT;
    ctx.font = '8px Courier New';
    ctx.fillText(`Day ${this._gameDay}`, 4, h - 6);
    ctx.fillText(`Lv${(this._g && this._g.lv) ? this._g.lv : '?'}`, w - 30, h - 6);
  },

  _drawSky(ctx) {
    const isNight = this.nightAlpha > 0.15;
    if (isNight) {
      ctx.fillStyle = '#0a0a2e';
    } else {
      // Gradient sky based on day progress
      const dayPhase = ((this._gameDay % 10) / 10);
      if (dayPhase < 0.35 || dayPhase > 0.85) {
        ctx.fillStyle = '#1a1a4e'; // night-ish sky
      } else {
        ctx.fillStyle = C.BG;
      }
    }
    ctx.fillRect(0, 0, C.W, 22);

    // Sun/moon
    if (!isNight) {
      const sunY = 8 + Math.sin(this._gameDay * 0.5) * 4;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(280, sunY, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillStyle = '#e0e0e0';
      ctx.beginPath();
      ctx.arc(280, 10, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Weather indicator icon
    const w = this._weatherState.type;
    ctx.font = '14px sans-serif';
    if (w === 'rain') ctx.fillText('🌧️', 8, 17);
    else if (w === 'snow') ctx.fillText('❄️', 8, 17);
    else ctx.fillText('☀️', 8, 17);
  },

  _drawBuilding(ctx) {
    // Main building wall (top-down view: outer walls)
    const isLit = this.nightAlpha < 0.2;
    ctx.fillStyle = C.BUILDING;
    // Top wall
    ctx.fillRect(30, 22, 260, 18);
    // Side walls (left/right borders)
    ctx.fillRect(30, 22, 6, 145);  // left wall
    ctx.fillRect(284, 22, 6, 145); // right wall

    // Windows (top-down = looking at glowing glass rectangles)
    const winColors = isLit ? [C.GLASS_GLOW, C.GLASS] : [C.GLASS_GLOW, C.GLASS];
    ctx.fillStyle = winColors[0];
    ctx.fillRect(44, 32, 28, 28); // window1 (warm glow inside)
    ctx.fillStyle = '#5c3317';
    ctx.fillRect(44, 32, 28, 2); // window frame top
    ctx.fillRect(44, 58, 28, 2); // window frame bottom
    ctx.fillRect(44, 32, 2, 28); // window frame left
    ctx.fillRect(70, 32, 2, 28); // window frame right

    ctx.fillStyle = winColors[1];
    ctx.fillRect(96, 32, 28, 28); // window2
    ctx.fillStyle = '#5c3317';
    ctx.fillRect(96, 32, 28, 2);
    ctx.fillRect(96, 58, 28, 2);
    ctx.fillRect(96, 32, 2, 28);
    ctx.fillRect(122, 32, 2, 28);

    // Interior walls (top-down view showing floor layout)
    ctx.fillStyle = C.WALL_INNER;
    ctx.fillRect(36, 40, 248, 105);

    // Bar counter area divider
    ctx.fillStyle = '#1a1a3e';
    ctx.fillRect(36, 72, 248, 2);

    // Floor tiles (grid pattern)
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    for (let tx = 36; tx < 284; tx += 16) {
      ctx.beginPath(); ctx.moveTo(tx, 90); ctx.lineTo(tx, 170); ctx.stroke();
    }
    for (let ty = 90; ty < 170; ty += 16) {
      ctx.beginPath(); ctx.moveTo(36, ty); ctx.lineTo(284, ty); ctx.stroke();
    }

    // Floor fill
    ctx.fillStyle = C.FLOOR;
    for (let tx = 36; tx < 284; tx += 32) {
      for (let ty = 90; ty < 170; ty += 32) {
        if ((Math.floor(tx / 16) + Math.floor(ty / 16)) % 2 === 0) {
          ctx.fillRect(tx, ty, 16, 16);
        }
      }
    }
  },

  _drawBar(ctx) {
    // Bar counter as long rectangle at bottom of interior
    ctx.fillStyle = C.BAR;
    ctx.fillRect(50, 76, 220, 14);
    // Bar top edge highlight
    ctx.fillStyle = 'rgba(255,255,200,0.3)';
    ctx.fillRect(50, 76, 220, 2);

    // Coffee cups on bar (pixel art style)
    for (let i = 0; i < 3; i++) {
      const bx = 130 + i * 20;
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(bx, 78, 6, 5);
      ctx.fillStyle = C.BAR;
      ctx.fillRect(bx + 1, 79, 4, 3); // dark coffee inside
    }

    // Bar label (tiny text)
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '6px Courier New';
    ctx.fillText('BAR', 154, 85);
  },

  _drawTables(ctx) {
    // Table positions (in interior)
    this._tablePositions = [
      {x: 50, y: 100}, {x: 106, y: 100}, {x: 162, y: 100},
      {x: 50, y: 140}, {x: 106, y: 140}, {x: 162, y: 140},
    ];

    for (const t of this._tablePositions) {
      // Table top
      ctx.fillStyle = '#8B6914';
      ctx.fillRect(t.x, t.y, 36, 22);
      // Table edge highlight
      ctx.fillStyle = 'rgba(255,255,200,0.2)';
      ctx.fillRect(t.x + 1, t.y + 1, 34, 3);
      // Chair indicators (4 small rects at corners)
      ctx.fillStyle = '#654321';
      ctx.fillRect(t.x - 3, t.y - 3, 6, 4);
      ctx.fillRect(t.x + 33, t.y - 3, 6, 4);
      ctx.fillRect(t.x - 3, t.y + 21, 6, 4);
      ctx.fillRect(t.x + 33, t.y + 21, 6, 4);
    }
  },

  _drawStaff(ctx) {
    // Walk barista from bar to tables (animated pixel figure)
    const phase = (Date.now() / 800) % (Math.PI * 2);
    const staffCount = this._g && this._g.staff ? Math.min(this._g.staff.length, 3) : 1;

    for (let s = 0; s < staffCount; s++) {
      // Interpolate between bar and nearest table
      const tables = this._tablePositions || [];
      const targetTable = tables[s % tables.length];
      if (!targetTable) continue;

      const walkCycle = Math.sin(phase + s * 2);
      const progress = (walkCycle + 1) / 2; // 0-1 oscillation

      // Bar center
      const barX = 160, barY = 83;
      const tableCenterX = targetTable.x + 18;
      const tableCenterY = targetTable.y + 11;

      const sx = barX + (tableCenterX - barX) * progress;
      const sy = barY + (tableCenterY - barY) * progress;

      // Staff body (white apron rectangle)
      ctx.fillStyle = C.STAFF_W;
      ctx.fillRect(sx, sy - 3, 6, 8);
      // Head
      ctx.fillStyle = C.STAFF_F;
      ctx.fillRect(sx + 1, sy - 5, 4, 3);
      // Apron detail
      ctx.fillStyle = '#e0e0e0';
      ctx.fillRect(sx + 2, sy, 2, 6);

      // Tray (when near table)
      if (progress > 0.6 && progress < 0.9) {
        ctx.fillStyle = C.ACCENT;
        ctx.fillRect(sx + 6, sy - 1, 3, 4);
      }
    }
  },

  _drawSteam(ctx) {
    // Steam rising from coffee cups on bar
    const t = Date.now() / 500;
    for (let i = 0; i < 8; i++) {
      const baseX = 134 + i * 5;
      const steamY = 76 - ((t * 20 + i * 15) % 40);
      const alpha = 0.4 - (steamY - 36) / 100;
      if (alpha > 0 && steamY > 36) {
        ctx.fillStyle = `rgba(255,255,255,${Math.max(0, alpha)})`;
        const size = 2 + Math.sin(t + i) * 1;
        ctx.fillRect(baseX, steamY, size, size);
      }
    }
  },

  _drawDoor(ctx) {
    // Entrance door at bottom center of building
    const dx = 150, dy = 167, dw = 20, dh = 13;
    ctx.fillStyle = C.DOOR;
    ctx.fillRect(dx, dy, dw, dh);
    // Doorknob
    ctx.fillStyle = C.DOOR_KNOB;
    ctx.fillRect(dx + 14, dy + 6, 2, 2);
    // Door frame highlight
    ctx.fillStyle = 'rgba(255,215,0,0.2)';
    ctx.fillRect(dx - 1, dy, dw + 2, dh);
  },

  _drawNeonSign(ctx) {
    // Rotating neon sign: "☕ OPEN" at top center of building
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA'];
    const ci = Math.floor(this.neonPhase * 2) % colors.length;
    ctx.fillStyle = colors[ci];
    ctx.font = 'bold 9px Courier New';
    ctx.fillText('☕ OPEN', 134, 20);

    // Glow effect
    ctx.fillStyle = colors[(ci + 1) % colors.length];
    ctx.globalAlpha = 0.2;
    ctx.fillRect(130, 14, 50, 12);
    ctx.globalAlpha = 1;
  },

  _drawFloor(ctx) {
    // Bottom area = street/patio floor
    ctx.fillStyle = '#1a1a3e';
    ctx.fillRect(0, 180, C.W, 20);
    // Street line markings
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(0, 190); ctx.lineTo(C.W, 190);
    ctx.stroke();
    ctx.setLineDash([]);
  },

  _drawWeatherOverlay(ctx) {
    // Weather particles rendered as canvas elements
    if (this._weatherState.type === 'rain') {
      ctx.strokeStyle = 'rgba(174,214,241,0.5)';
      ctx.lineWidth = 1;
      for (const p of this.particles) {
        const px = (p.x + this._weatherOffset * 60) % C.W;
        const py = p.y % (C.H + 20);
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px - 1, py + 4);
        ctx.stroke();
      }
    } else if (this._weatherState.type === 'snow') {
      ctx.fillStyle = 'rgba(255,255,255,0.7)';
      for (const p of this.particles) {
        const px = (p.x + Math.sin(this._weatherOffset * 1.5) * 30) % C.W;
        const py = (p.y + this._weatherOffset * 25) % (C.H + 10);
        ctx.beginPath();
        ctx.arc(px, py, p.size || 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },

  /** ==================== HELPERS ==================== */
  _getWeather() {
    // Poll from game G if available, else default
    if (this._g && this._g.weatherType) return this._g.weatherType;
    if (this._g && this._g.gameDay) {
      // Simple deterministic weather by game day
      const d = this._g.gameDay || 1;
      const r = (d * 7 + 3) % 5;
      if (r < 2) return 'clear';
      if (r < 4) return 'rain';
      return 'snow';
    }
    return 'clear';
  },

  _initWeatherParticles(type) {
    this.particles = [];
    if (type === 'rain') {
      for (let i = 0; i < 60; i++) {
        this.particles.push({ x: Math.random() * C.W, y: Math.random() * C.H });
      }
    } else if (type === 'snow') {
      for (let i = 0; i < 35; i++) {
        this.particles.push({ x: Math.random() * C.W, y: Math.random() * C.H, size: 1 + Math.random() * 2 });
      }
    } else {
      this.particles = [];
    }
    this._weatherOffset = 0;
  },

  _updateParticles(dtSec) {
    this._weatherOffset = (this._weatherOffset || 0) + dtSec;
    if (!this.particles.length) return;
    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      if (this._weatherState.type === 'rain') {
        p.y += 120 * dtSec;
        if (p.y > C.H) p.y = -10;
      } else if (this._weatherState.type === 'snow') {
        p.y += 30 * dtSec;
        p.x += Math.sin(this._weatherOffset * 2 + i) * 0.5;
        if (p.y > C.H) p.y = -5;
      }
    }
  },

  _updateNightAlpha() {
    const phase = ((this._gameDay % 10) / 10); // normalized day phase [0,1]
    let night = 0;
    if (phase > 0.75) {
      night = (phase - 0.75) / 0.25 * 0.55; // ramp up
    } else if (phase < 0.25) {
      night = (1 - phase / 0.25) * 0.55; // ramp down
    }
    this.nightAlpha = Math.max(0, Math.min(0.55, night));
  },

  _findFreeTable() {
    const tables = this._tablePositions || [];
    for (const t of tables) {
      // Check if any customer is already seated at this table
      const occupied = this.customers.some(c =>
        c.state === 'seated' && c.targetTable !== undefined &&
        Math.abs(t.x - tables[c.targetTable % tables.length].x) < 5
      );
      if (!occupied) return t;
    }
    return -1;
  },

  _spawnCustomer() {
    const palette = CUSTOMER_PALETTES[Math.floor(Math.random() * CUSTOMER_PALETTES.length)];
    this.customers.push({
      x: C.W + 10,          // enter from right
      y: 185,                // entrance Y position
      state: 'walking_in',
      timer: 2 + Math.random(), // walk-in duration
      targetTable: undefined,
      exitSide: 'right',
      color: palette,
      bobTimer: 0,
      serveTime: 3 + Math.random() * 4, // how long to sit before being served
    });
  },

  /** ==================== SOUND FX (Web Audio API) ==================== */
  _audioCtx: null,
  _playSFX(type) {
    try {
      if (!this._audioCtx) {
        this._audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = this._audioCtx;
      if (!ctx) return;

      const now = ctx.currentTime;
      const gain = ctx.createGain();
      gain.connect(ctx.destination);

      switch (type) {
        case 'door': {
          // Ding-dong: 523 + 659Hz
          [523, 659].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.15);
            g.gain.setValueAtTime(0.08, now + i * 0.15);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.15 + 0.12);
            osc.connect(g).connect(ctx.destination);
            osc.start(now + i * 0.15);
            osc.stop(now + i * 0.15 + 0.15);
          });
          break;
        }
        case 'pay': {
          // Cash register: two-tone chime
          [880, 1320].forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const g = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + i * 0.1);
            g.gain.setValueAtTime(0.06, now + i * 0.1);
            g.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.15);
            osc.connect(g).connect(ctx.destination);
            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.18);
          });
          break;
        }
        case 'order': {
          // Order buzzer: ascending sine sweep
          const osc = ctx.createOscillator();
          const g = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(700, now);
          osc.frequency.linearRampToValueAtTime(1400, now + 0.15);
          g.gain.setValueAtTime(0.08, now);
          g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(g).connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.22);
          break;
        }
      }
    } catch(e) { /* audio not available */ }
  },

  /** ==================== PUBLIC API ==================== */
  start() {
    this._running = true;
    this._lastFrameTime = 0;
    requestAnimationFrame(t => this._loop(t));
  },

  stop() {
    this._running = false;
  },

  getRunning() { return this._running; }
};

// ======================== AUTO-INIT ========================
(function autoInit() {
  // Wait for G to exist (game may load later)
  function tryInit() {
    if (window.G) {
      CafeSceneV7.init();
    } else {
      setTimeout(tryInit, 200);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => setTimeout(tryInit, 300));
  } else {
    tryInit();
  }
})();

// Expose globally for external control
window.CafeSceneV7 = CafeSceneV7;

})();

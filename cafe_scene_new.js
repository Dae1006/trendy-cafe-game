/**
 * CafeSceneV2 — Complete rewrite of Top-Down cafe scene (pixel art)
 * Canvas 320×200px, fully self-contained, polls G object.
 * Features: bigger detailed customers, smooth staff animation,
 *           detailed interior, weather effects, neon glow, V7 palette.
 */
(function() {
'use strict';

/* ================================================================
   PALETTE — V7 Ultimate (warm + dark)
   ================================================================ */
const PAL = Object.freeze({
  bgDark:     '#0f3460',
  bgMid:      '#16213e',
  bgNight:    '#0a1628',
  gold:       '#FFD700',
  warmRed:    '#FF6347',
  wall:       '#2c1810',
  wallLight:  '#3d2517',
  floor:      '#1a0f0a',
  floorTile:  '#23160e',
  barTop:     '#5c3a1e',
  barFront:   '#4a2e15',
  shelfWood:  '#4e3428',
  doorFrame:  '#2c1810',
  doorPanel:  '#1a0f0a',
  glassWin:   'rgba(180,210,255,0.15)',
  glassGlow:  'rgba(255,215,0,0.3)',
  neonPink:   '#ff2d95',
  neonCyan:   '#00e5ff',
  neonWarm:   '#ffb86c',
  steam:      'rgba(255,255,255,0.45)',
  plantGreen: '#2e7d32',
  plantLight: '#4caf50',
  plantPot:   '#8d6e63',
  lampGlow:   'rgba(255,215,0,0.25)',
  frameBrown: '#5d4037',
  frameGold:  '#bf9a38',
  canvasBg:   '#0d1b2a',
});

/* ================================================================
   LAYOUT CONSTANTS (grid in px on 320×200)
   ================================================================ */
const L = Object.freeze({
  // Interior area (inside building walls)
  innerLeft:   50,
  innerTop:    36,
  innerRight:  270,
  innerBottom: 184,
  innerW:      220,
  innerH:      148,

  // Bar (left wall)
  barX:        54,
  barY:        36,
  barW:        36,
  barH:        90,

  // Door (right wall)
  doorX:       270,
  doorY:       130,
  doorW:       18,
  doorH:       40,

  // Bookshelf / Decor center
  shelfX:      155,
  shelfY:      40,
  shelfW:      24,
  shelfH:      50,

  // Plant positions
  plantL: {x: 68, y: 138},
  plantR: {x: 240, y: 48},

  // Lamp drop positions (ceiling)
  lamps: [
    {x: 90, y: 52},
    {x: 130, y: 52},
    {x: 170, y: 52},
    {x: 210, y: 52},
  ],

  // Tables (seated area between bar and shelves)
  tables: [
    {x: 100, y: 90, w: 28, h: 18},
    {x: 140, y: 130, w: 28, h: 18},
    {x: 195, y: 95, w: 28, h: 18},
    {x: 230, y: 135, w: 28, h: 18},
  ],

  // Table seat offsets (relative to table center)
  seats: [
    {dx: -14, dy: 0},   // left
    {dx:  14, dy: 0},   // right
    {dx:  0, dy: -10},  // top
    {dx:  0, dy:  10},  // bottom
  ],

  // Coffee machine on bar
  coffeeMachineX: 68,
  coffeeMachineY: 50,
});

/* ================================================================
   CUSTOMER PALETTES (head + shirt + pants)
   ================================================================ */
const CUST_PAL = Object.freeze([
  { head:'#e74c3c', body:'#8e44ad', pants:'#2c3e50', skin:'#f1c27d' },
  { head:'#3498db', body:'#e67e22', pants:'#27ae60', skin:'#d4a574' },
  { head:'#f39c12', body:'#e74c3c', pants:'#16a085', skin:'#f5cba7' },
  { head:'#1abc9c', body:'#9b59b6', pants:'#2980b9', skin:'#edbb99' },
  { head:'#e91e63', body:'#00bcd4', pants:'#c0392b', skin:'#f0dbb7' },
  { head:'#ff5722', body:'#ffc107', pants:'#78909c', skin:'#d4a574' },
  { head:'#607d8b', body:'#4caf50', pants:'#e67e22', skin:'#f5cba7' },
  { head:'#009688', body:'#ff5722', pants:'#607d8b', skin:'#edbb99' },
]);

/* ================================================================
   STAFF PATHS (bar → table → bar)  (absolute coords)
   ================================================================ */
const STAFF_PATHS = Object.freeze(L.tables.map(function(t) {
  return [
    {x: L.barX + L.barW, y: t.y},        // from bar edge
    {x: t.x - 12, y: t.y + t.h/2},       // table side
    {x: t.x,      y: t.y + t.h/2 + 8},   // behind table (serving)
    {x: t.x + 12, y: t.y + t.h/2},       // other side
    {x: L.barX + L.barW, y: t.y},        // back to bar
  ];
}));

/* ================================================================
   HELPERS
   ================================================================ */
function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
function lerp(a, b, t)    { return a + (b - a) * t; }
function dist(ax, ay, bx, by) { var dx=ax-bx, dy=ay-by; return Math.sqrt(dx*dx+dy*dy); }

/* ================================================================
   ENTITY CLASSES
   ================================================================ */

/* ---- Weather Particle ---- */
class WParticle {
  constructor(type) {
    this.type = type; // 'rain' | 'snow'
    this.reset();
  }
  reset() {
    this.x = Math.random() * 320;
    this.y = -8 - Math.random() * 40;
    this.speed = 60 + Math.random() * 40;
    this.size  = this.type === 'rain' ? (1.5 + Math.random()) : (1 + Math.random() * 1.5);
    this.life  = this.type === 'rain' ? 3.5 : (5 + Math.random() * 3);
    this.maxLife = this.life;
    if (this.type === 'snow') {
      this.rot   = Math.random() * Math.PI * 2;
      this.rotSp = (Math.random() - 0.5) * 2;
      this.wobbleAmp = 8 + Math.random() * 12;
      this.wobbleSp = 1.5 + Math.random();
    }
    if (this.type === 'rain') {
      this.angle = Math.PI / 4; // diagonal
    }
    this.alive = true;
    this.splash = false;
    this.splashLife = 0;
  }
  update(dt) {
    if (!this.alive) return;
    this.life -= dt;
    if (this.type === 'rain') {
      this.x += Math.cos(this.angle) * this.speed * dt;
      this.y += Math.sin(this.angle) * this.speed * dt;
      // hit floor
      if (this.y > 186) {
        this.splash = true;
        this.splashLife = 0.25;
        setTimeout(() => { this.alive = false; }, 200);
      }
    } else {
      this.wobbleX = Math.sin(performance.now() * 0.001 * this.wobbleSp) * this.wobbleAmp;
      this.x += (this.wobbleX - (this.wobbleX - (Math.sin((performance.now() - dt*1000) * 0.001 * this.wobbleSp) * this.wobbleAmp))) * dt * 0.5;
      this.y += this.speed * dt * 0.6; // slower fall for snow
      this.rot += this.rotSp * dt;
      if (this.y > 192) { this.alive = false; }
    }
  }
  draw(ctx, time) {
    if (!this.alive) return;
    var a = clamp(this.life / this.maxLife, 0, 1);

    if (this.type === 'rain' && this.splash) {
      ctx.globalAlpha = a * 0.6;
      ctx.fillStyle = '#a8d8ea';
      // splash dots
      for (var i = 0; i < 3; i++) {
        var sx = this.x + Math.cos(i * 2.1) * (this.splashLife * 6);
        var sy = 186 - Math.sin(i * 2.1) * (this.splashLife * 4);
        ctx.fillRect(sx, sy, 1, 1);
      }
      return;
    }

    if (this.type === 'rain') {
      ctx.globalAlpha = a * 0.5;
      ctx.strokeStyle = '#89c4f4';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(this.x + Math.cos(this.angle) * 6, this.y + Math.sin(this.angle) * 6);
      ctx.stroke();
    } else {
      ctx.globalAlpha = a * 0.8;
      ctx.translate(this.x, this.y);
      ctx.rotate(this.rot);
      // 4-point star
      var s = this.size;
      ctx.fillStyle = '#fff';
      ctx.fillRect(-s/2, -s/6, s, s/3);
      ctx.fillRect(-s/6, -s/2, s/3, s);
      ctx.translate(-this.x, -this.y);
    }
    ctx.globalAlpha = 1;
  }
}

/* ---- Customer Entity ---- */
class Customer {
  constructor(paletteIdx) {
    this.palette = CUST_PAL[paletteIdx % CUST_PAL.length];
    this.tableIdx = -1;   // -1 = walking, ≥0 = seated at table
    this.state = 'entering'; // entering → walking → seated → leaving
    this.pathIdx = 0;     // current waypoint index (walking)
    this.speed = 48 + Math.random() * 24;

    this.x = L.doorX + 9;
    this.y = L.doorY + L.doorH + 4;

    // target
    this.tgtX = this.x;
    this.tgtY = this.y;

    // seat offset within table
    this.seatDx = 0;
    this.seatDy = 0;

    // animation
    this.fadeAlpha = 0;
    this.fadeDir = 1;   // 1=fade in, -1=fade out
    this.seatedTime = 0;
    this.walkPhase = 0;
    this.bobAmount = 0;   // bounce amount on seated
    this.bobTarget = 0;

    this.legPhase = 0;    // leg animation cycle
    this.armPhase = 0;

    this.exitTimer = 18 + Math.random() * 24; // seconds to wait before leaving
    this.alive = true;
    this.entered = false;

    // customer size: 6px wide × 8px tall (head+body)
    this.bodW = 6;
    this.bodH = 8;
  }

  reset() {
    this.tableIdx = -1;
    this.state = 'entering';
    this.pathIdx = 0;
    this.fadeAlpha = 0;
    this.fadeDir = 1;
    this.seatedTime = 0;
    this.walkPhase = 0;
    this.bobAmount = 0;
    this.bobTarget = 0;
    this.legPhase = 0;
    this.armPhase = 0;
    this.exitTimer = 18 + Math.random() * 24;
    this.alive = true;
    this.entered = false;
    // start at door, going in
    this.x = L.doorX + 9;
    this.y = L.doorY + L.doorH + 2;
  }

  pickTable() {
    // find empty seat slot
    for (var i = 0; i < L.tables.length; i++) {
      if (this.tableIdx === -1 && !seats[i].occupied) {
        this.seatDx = Math.random() > 0.5 ? L.seats[i % L.seats.length].dx : -L.seats[i % L.seats.length].dx;
        this.seatDy = Math.random() > 0.5 ? L.seats[i % L.seats.length].dy : -L.seats[i % L.seats.length].dy;
        this.tableIdx = i;
        seats[i].occupied = true;
        // bounce on seated
        this.bobTarget = 4;
        return;
      }
    }
    // all full → just walk to any table and stand
    var ti = Math.floor(Math.random() * L.tables.length);
    this.tgtX = L.tables[ti].x + L.tables[ti].w/2;
    this.tgtY = L.tables[ti].y - 4;
    this.state = 'waiting';
    this.bobTarget = 0;
  }

  update(dt) {
    if (!this.alive) return;

    // fade in/out
    var fadeRate = dt * 3;
    this.fadeAlpha += this.fadeDir * fadeRate;
    this.fadeAlpha = clamp(this.fadeAlpha, 0, 1);
    if (this.fadeAlpha >= 1 && this.fadeDir > 0) { this.fadeDir = 0; }
    if (this.fadeAlpha <= 0 && this.fadeDir < 0) { this.alive = false; return; }

    var t = performance.now() * 0.001;

    switch(this.state) {
      case 'entering':
        // walk toward center
        var cx = (L.innerLeft + L.innerRight) / 2;
        var cy = (L.innerTop + L.innerBottom) / 2;
        this.moveTowards(cx, cy, dt);
        if (dist(this.x, this.y, cx, cy) < 6) {
          this.state = 'walking';
          this.pickTable();
          this.bobTarget = 3; // bounce when seated
        }
        break;

      case 'walking':
        if (this.tableIdx >= 0) {
          var tt = L.tables[this.tableIdx];
          var tx = tt.x + tt.w/2 + this.seatDx;
          var ty = tt.y + tt.h/2 + this.seatDy;
          this.moveTowards(tx, ty, dt);
          if (dist(this.x, this.y, tx, ty) < 3) {
            this.state = 'seated';
            this.seatedTime = 0;
            this.bobTarget = 4; // bounce!
          }
        }
        break;

      case 'seated':
        this.seatedTime += dt;
        // bob idle (gentle up-down)
        if (this.seatDy !== 0) {
          this.bobAmount = Math.sin(t * 2.5 + this.palette.head.charCodeAt(1)) * 1.2;
        } else {
          this.bobAmount = Math.sin(t * 3 + this.palette.head.charCodeAt(1)) * 0.8;
        }
        // exit timer
        this.exitTimer -= dt;
        if (this.exitTimer <= 5 && !this.fadeDir) {
          this.fadeDir = -1;
          this.state = 'leaving';
          // free seat
          if (this.tableIdx >= 0) { seats[this.tableIdx].occupied = false; }
          // walk to door
          this.tgtX = L.doorX + 9;
          this.tgtY = L.doorY + L.doorH + 2;
        }
        break;

      case 'leaving':
        if (this.fadeAlpha <= 0) return; // dead handled by fade
        this.moveTowards(this.tgtX, this.tgtY, dt);
        if (dist(this.x, this.y, this.tgtX, this.tgtY) < 4 && this.seatedTime > 5) {
          this.alive = false;
        }
        break;

      default: // waiting / unknown
        break;
    }

    // walk animation
    this.walkPhase += dt * 6;
    this.legPhase = Math.sin(this.walkPhase) * 2;
    this.armPhase = -Math.sin(this.walkPhase) * 1.5;
  }

  moveTowards(tx, ty, dt) {
    var dx = tx - this.x;
    var dy = ty - this.y;
    var d = Math.sqrt(dx*dx + dy*dy);
    if (d < 2) return;
    var mx = (dx / d) * this.speed * dt;
    var my = (dy / d) * this.speed * dt;
    this.x += clamp(mx, -4, 4);
    this.y += clamp(my, -4, 4);

    // boundary clamping inside interior
    this.x = clamp(this.x, L.innerLeft + 3, L.innerRight - 3);
    this.y = clamp(this.y, L.innerTop + 3, L.innerBottom - 3);
  }

  draw(ctx) {
    if (!this.alive || this.fadeAlpha <= 0.01) return;
    ctx.globalAlpha = this.fadeAlpha;
    var x = Math.round(this.x);
    var y = Math.round(this.y + this.bobAmount);
    var p = this.palette;
    var isSeated = (this.state === 'seated' || this.seatDy !== 0);

    // ---- HEAD (3×3px) ----
    ctx.fillStyle = p.skin;
    ctx.fillRect(x - 1, y - 5, 3, 3);   // face

    // hair (matches shirt color — darker variant)
    var hairDk = p.body;
    ctx.fillStyle = hairDk;
    ctx.fillRect(x - 1, y - 6, 3, 2);   // top of head

    // body (4×5px torso)
    ctx.fillStyle = p.body;
    ctx.fillRect(x - 2, y - 2, 4, 5);

    // legs (visible when standing, not seated)
    if (!isSeated || this.state === 'entering' || this.state === 'walking') {
      ctx.fillStyle = p.pants;
      // left leg + right leg with animation offset
      var legOff = Math.abs(this.legPhase) > 1 ? 2 : 0;
      ctx.fillRect(x - 2, y + 3, 2, 2 + legOff);  // left
      ctx.fillRect(x + 1, y + 3, 2, 2 - legOff);  // right

      // arms with swing animation
      ctx.fillStyle = p.body;
      var armA = this.armPhase;
      ctx.fillRect(x - 3, y - 1 + armA, 2, 3);   // left arm
      ctx.fillRect(x + 2, y - 1 - armA, 2, 3);   // right arm
    } else {
      // seated: just shoulders visible, arms on table
      ctx.fillStyle = p.body;
      ctx.fillRect(x - 3, y, 2, 2);  // left shoulder/arm
      ctx.fillRect(x + 2, y, 2, 2);  // right shoulder/arm
    }

    // eyes (tiny white dots) when facing forward enough
    if (!isSeated || Math.abs(this.seatDx) > 0) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(x - 1, y - 4, 1, 1);
      ctx.fillRect(x + 1, y - 4, 1, 1);
    }

    ctx.globalAlpha = 1;
  }
}

/* ================================================================
   GLOBAL SEAT TRACKING (simple)
   ================================================================ */
var seats = []; // will be init'd when needed

function ensureSeats() {
  if (seats.length > 0) return;
  for (var i = 0; i < L.tables.length; i++) {
    seats.push({ occupied: false });
  }
}

/* ================================================================
   MAIN SCENE RENDERER
   ================================================================ */
var CafeSceneV2 = {
  canvas: null, ctx: null, wrapper: null,
  lastTick: 0,
  animPhase: 0,

  // entity pools
  customers: [],
  particles: [],

  // weather state
  weatherType: 'clear',   // clear | rain | snow | fog
  weatherIntensity: 0,    // 0-1
  lastWeatherChange: 0,

  // day/night
  nightAlpha: 0.15,       // base overlay (dynamic)
  dayPhase: 0,            // 0=noon → 0.5=midnight

  // neon sign phase
  neonPhase: 0,

  // customer spawn timer
  _spawnTimer: 2,
  _maxCustomers: 6,

  /* ---- init ---- */
  init(wrapperEl) {
    this.wrapper = wrapperEl;
    this.canvas = document.createElement('canvas');
    this.canvas.width = 320;
    this.canvas.height = 200;
    this.canvas.style.width = '320px';
    this.canvas.style.height = '200px';
    this.canvas.style.display = 'block';

    // pixel-art crisp rendering
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    wrapperEl.innerHTML = '';
    wrapperEl.appendChild(this.canvas);

    this.lastTick = performance.now();
    this._tickLoop();
  },

  /* ---- poll G object & start ---- */
  bootstrap() {
    var self = this;
    function poll() {
      if (typeof G !== 'undefined' && G.cafe_scene_wrapper) {
        self.init(G.cafe_scene_wrapper);
        // sync initial weather
        if (G.weather) {
          self.weatherType = G.weather.current || 'clear';
          self.weatherIntensity = G.weather.intensity != null ? G.weather.intensity : 0;
        }
      } else {
        setTimeout(poll, 150);
      }
    }
    poll();
  },

  /* ---- main tick loop ---- */
  _tickLoop() {
    var now = performance.now();
    var dt = Math.min((now - this.lastTick) / 1000, 0.05);
    this.lastTick = now;
    this.animPhase += dt;

    // poll G for updates
    if (typeof G !== 'undefined' && G.weather) {
      var gw = G.weather;
      if (gw.current && gw.current !== this.weatherType) {
        this.weatherType = gw.current;
        this.particles = [];
        if (this.weatherType === 'rain') { this.weatherIntensity = Math.min((gw.intensity || 0) + 0.3, 1); }
        else if (this.weatherType === 'snow') { this.weatherIntensity = Math.min((gw.intensity || 0) + 0.2, 1); }
      }
    }

    // dynamic night overlay based on dayPhase
    if (typeof G !== 'undefined' && G._timeOfDay != null) {
      var dp = G._timeOfDay; // 0=6am → 1=6pm cycle? Use it for brightness
      this.dayPhase = dp;
      this.nightAlpha = 0.05 + (1 - Math.abs(2 * dp - 1)) * 0.3;
    }

    this._update(dt);
    this._render();

    requestAnimationFrame(this._tickLoop.bind(this));
  },

  /* ---- update entities ---- */
  _update(dt) {
    // spawn customers
    this._spawnTimer -= dt;
    if (this._spawnTimer <= 0 && this.customers.filter(function(c){return c.alive && (c.state==='seated'||c.state==='entering'||c.state==='walking');}).length < this._maxCustomers) {
      var palIdx = Math.floor(Math.random() * CUST_PAL.length);
      ensureSeats();
      // check if any seat is free
      var freeSeat = false;
      for (var s = 0; s < seats.length; s++) {
        if (!seats[s].occupied) { freeSeat = true; break; }
      }
      if (freeSeat) {
        this.customers.push(new Customer(palIdx));
      }
      this._spawnTimer = 4 + Math.random() * 8;
    }

    // update customers
    for (var i = 0; i < this.customers.length; i++) {
      this.customers[i].update(dt);
    }
    // prune dead customers
    this.customers = this.customers.filter(function(c){ return c.alive || c.fadeAlpha > 0; });

    // weather particles
    if (this.weatherType === 'rain' || this.weatherType === 'snow') {
      var intensity = this.weatherIntensity;
      if (intensity < 0.05) {
        this.particles = [];
      } else {
        var spawnRate = this.weatherType === 'rain' ? 80 : 25; // per second
        if (Math.random() < spawnRate * intensity * dt) {
          this.particles.push(new WParticle(this.weatherType));
        }
        // keep max particles manageable
        while (this.particles.length > 120) this.particles.shift();
      }
    } else {
      if (this.particles.length > 0) this.particles = [];
    }

    for (var j = 0; j < this.particles.length; j++) {
      this.particles[j].update(dt);
    }
    this.particles = this.particles.filter(function(p){ return p.alive; });

    this.neonPhase += dt * 2.5;
  },

  /* ---- render everything ---- */
  _render() {
    var ctx = this.ctx;
    var W = 320, H = 200;

    // 1) Background (outside sky gradient)
    var grad = ctx.createLinearGradient(0, 0, 0, H);
    if (this.dayPhase < 0.25) { // morning
      grad.addColorStop(0, '#87CEEB');
      grad.addColorStop(0.6, '#e8d5a3');
      grad.addColorStop(1, PAL.bgDark);
    } else if (this.dayPhase < 0.45) { // noon
      grad.addColorStop(0, '#4a90d9');
      grad.addColorStop(0.6, '#f0e68c');
      grad.addColorStop(1, PAL.bgMid);
    } else if (this.dayPhase < 0.65) { // sunset
      grad.addColorStop(0, '#FF6347');
      grad.addColorStop(0.3, '#ffb86c');
      grad.addColorStop(0.7, PAL.bgMid);
      grad.addColorStop(1, PAL.bgNight);
    } else { // night
      grad.addColorStop(0, '#0a1628');
      grad.addColorStop(1, '#050d1a');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    // ground (sidewalk area)
    ctx.fillStyle = PAL.floorTile;
    ctx.fillRect(L.innerLeft, L.innerBottom + 2, L.innerW, H - L.innerBottom - 2);

    // sidewalk line
    ctx.fillStyle = '#3d2b1f';
    ctx.fillRect(L.innerLeft - 4, L.innerBottom, L.innerW + 8, 3);

    // 2) Building exterior walls
    this._drawExterior(ctx);

    // 3) Interior floor
    this._drawInteriorFloor(ctx);

    // 4) Bar counter (left wall)
    this._drawBar(ctx);

    // 5) Tables + seats
    this._drawTables(ctx);

    // 6) Bookshelf / Decor center
    this._drawBookshelf(ctx);

    // 7) Door (right wall)
    this._drawDoor(ctx);

    // 8) Plants
    this._drawPlants(ctx);

    // 9) Hanging lamps
    this._drawLamps(ctx);

    // 10) Wall art / posters
    this._drawWallArt(ctx);

    // 11) Customers (seated + standing)
    for (var i = 0; i < this.customers.length; i++) {
      if (this.customers[i].alive) this.customers[i].draw(ctx);
    }

    // 12) Weather particles (rain/snow overlay)
    for (var j = 0; j < this.particles.length; j++) {
      this.particles[j].draw(ctx, this.animPhase);
    }

    // 13) Neon sign
    this._drawNeonSign(ctx);

    // 14) Night overlay
    if (this.nightAlpha > 0.05) {
      ctx.fillStyle = 'rgba(5,10,20,' + this.nightAlpha.toFixed(2) + ')';
      ctx.fillRect(0, 0, W, H);
    }

    // 15) Vignette (corner darkening)
    this._drawVignette(ctx);
  },

  /* ---- draw: building exterior ---- */
  _drawExterior(ctx) {
    var wall = PAL.wall;
    var wallL = PAL.wallLight;

    // Top wall (ceiling visible from top-down)
    ctx.fillStyle = wall;
    ctx.fillRect(L.innerLeft, L.innerTop - 20, L.innerW + 6, 20);
    // Wall bricks pattern
    ctx.fillStyle = wallL;
    for (var bx = L.innerLeft; bx < L.innerLeft + L.innerW + 4; bx += 18) {
      ctx.fillRect(bx, L.innerTop - 18, 16, 2);
      ctx.fillRect(bx + 9, L.innerTop - 10, 16, 2);
    }

    // Right wall (excluding door gap)
    ctx.fillStyle = wall;
    ctx.fillRect(L.innerRight, L.innerTop, 8, L.doorY - L.innerTop);
    ctx.fillRect(L.innerRight, L.doorY + L.doorH, 8, L.innerBottom - L.doorY - L.doorH);

    // Roof overhang (outside)
    ctx.fillStyle = '#1a0f0a';
    ctx.fillRect(L.innerLeft - 2, L.innerTop - 24, L.innerW + 6, 5);

    // Sign board above door area
    ctx.fillStyle = '#1a0f0a';
    ctx.fillRect(L.innerRight + 2, L.doorY - 18, 16, 28);
    ctx.strokeStyle = PAL.gold;
    ctx.lineWidth = 1;
    ctx.strokeRect(L.innerRight + 3, L.doorY - 17, 14, 26);

    // "CAFE" text approximation (mini blocks)
    ctx.fillStyle = PAL.gold;
    var tx = L.innerRight + 5, ty = L.doorY - 14;
    // C
    ctx.fillRect(tx, ty, 3, 1); ctx.fillRect(tx, ty+2, 3, 1); ctx.fillRect(tx, ty+4, 1, 1); ctx.fillRect(tx, ty+5, 3, 1);
    // A
    ctx.fillRect(tx+6, ty+1, 1, 5); ctx.fillRect(tx+7, ty+4, 2, 1); ctx.fillRect(tx+8, ty, 1, 3); ctx.fillRect(tx+9, ty+1, 1, 1);
    // F
    ctx.fillRect(tx+11, ty, 2, 6); ctx.fillRect(tx+11, ty, 4, 1); ctx.fillRect(tx+11, ty+2, 3, 1);
    // E
    ctx.fillRect(tx+15, ty, 2, 6); ctx.fillRect(tx+15, ty, 4, 1); ctx.fillRect(tx+15, ty+2, 3, 1); ctx.fillRect(tx+15, ty+4, 4, 1);

    // Left wall (outside edge)
    ctx.fillStyle = wall;
    ctx.fillRect(L.innerLeft - 8, L.innerTop, 8, L.innerBottom - L.innerTop);
    // Brick pattern left wall
    ctx.fillStyle = wallL;
    for (var by = L.innerTop + 10; by < L.innerBottom; by += 12) {
      ctx.fillRect(L.innerLeft - 7, by, 6, 2);
    }

    // Corner detail (bottom-left)
    ctx.fillStyle = '#0d0705';
    ctx.fillRect(L.innerLeft - 8, L.innerBottom - 4, 10, 6);
    // step
    ctx.fillStyle = '#2c1810';
    ctx.fillRect(L.innerLeft - 10, L.innerBottom + 1, 14, 3);
  },

  /* ---- draw: interior floor with tile pattern ---- */
  _drawInteriorFloor(ctx) {
    var fl = PAL.floor;
    var ft = PAL.floorTile;
    ctx.fillStyle = fl;
    ctx.fillRect(L.innerLeft + 2, L.innerTop + 2, L.innerW - 4, L.innerH - 4);

    // Tile lines
    ctx.strokeStyle = 'rgba(60,40,30,0.4)';
    ctx.lineWidth = 0.5;
    for (var tx = L.innerLeft + 2; tx < L.innerRight - 2; tx += 14) {
      ctx.beginPath(); ctx.moveTo(tx, L.innerTop + 2); ctx.lineTo(tx, L.innerBottom - 2); ctx.stroke();
    }
    for (var ty = L.innerTop + 2; ty < L.innerBottom - 2; ty += 14) {
      ctx.beginPath(); ctx.moveTo(L.innerLeft + 2, ty); ctx.lineTo(L.innerRight - 2, ty); ctx.stroke();
    }

    // Rug under tables area
    ctx.fillStyle = 'rgba(139,69,19,0.15)';
    ctx.fillRect(L.tables[0].x - 10, L.tables[0].y - 8,
                 L.tables[L.tables.length-1].x - L.tables[0].x + 40 + 20,
                 L.tables[L.tables.length-1].y - L.tables[0].y + 36);
  },

  /* ---- draw: bar counter (left wall interior) ---- */
  _drawBar(ctx) {
    var bt = PAL.barTop;
    var bf = PAL.barFront;
    ctx.fillStyle = bt;
    ctx.fillRect(L.barX, L.barY, L.barW, L.barH);

    // Bar counter top highlight
    ctx.fillStyle = 'rgba(255,215,0,0.1)';
    ctx.fillRect(L.barX + 2, L.barY + 2, L.barW - 4, 3);

    // Front edge
    ctx.fillStyle = bf;
    ctx.fillRect(L.barX + L.barW - 2, L.barY, 6, L.barH);

    // Wood grain lines on bar top
    ctx.strokeStyle = 'rgba(80,50,30,0.3)';
    ctx.lineWidth = 0.5;
    for (var gy = L.barY + 8; gy < L.barY + L.barH - 4; gy += 6) {
      ctx.beginPath();
      ctx.moveTo(L.barX + 2, gy);
      ctx.lineTo(L.barX + L.barW - 6, gy + Math.sin(gy * 0.3) * 1);
      ctx.stroke();
    }

    // Coffee machine on bar (small pixel detail)
    var cmx = L.coffeeMachineX, cmy = L.coffeeMachineY;
    ctx.fillStyle = '#4a4a5a';
    ctx.fillRect(cmx, cmy, 8, 12);
    ctx.fillStyle = '#3a3a4a';
    ctx.fillRect(cmx + 1, cmy + 1, 6, 3); // top panel
    ctx.fillStyle = PAL.warmRed; // indicator light
    ctx.fillRect(cmx + 5, cmy + 7, 2, 2);

    // Cups on bar counter
    for (var ci = 0; ci < 3; ci++) {
      var cupY = L.barY + 20 + ci * 14;
      ctx.fillStyle = '#f5f5dc';
      ctx.fillRect(L.barX + 8, cupY, 4, 6);
      ctx.fillStyle = '#d4a574'; // coffee color inside
      ctx.fillRect(L.barX + 9, cupY + 1, 2, 3);
    }

    // Espresso steam (tiny particles)
    var t = performance.now() * 0.001;
    for (var si = 0; si < 3; si++) {
      var sOff = Math.sin(t * 1.5 + si * 2) * 2;
      ctx.fillStyle = 'rgba(255,255,255,' + (0.2 + Math.sin(t*2+si)*0.1).toFixed(2) + ')';
      ctx.fillRect(cmx + 3 + sOff, cmy - 2 - si * 4, 1, 2);
    }
  },

  /* ---- draw: tables and chairs ---- */
  _drawTables(ctx) {
    for (var i = 0; i < L.tables.length; i++) {
      var t = L.tables[i];
      // Table top (rounded rectangle approx via blocks)
      ctx.fillStyle = '#6b4423';
      ctx.fillRect(t.x, t.y, t.w, t.h);
      // Highlight edge
      ctx.fillStyle = 'rgba(255,215,0,0.08)';
      ctx.fillRect(t.x + 1, t.y + 1, t.w - 2, 2);

      // Coffee cup on table (tiny detail)
      var cupX = t.x + t.w/2 - 2;
      var cupY = t.y + t.h/2 - 3;
      ctx.fillStyle = '#fff';
      ctx.fillRect(cupX, cupY, 4, 3);
      ctx.fillStyle = '#8b4513'; // coffee
      ctx.fillRect(cupX + 1, cupY + 1, 2, 1);
    }
  },

  /* ---- draw: bookshelf / decor (center) ---- */
  _drawBookshelf(ctx) {
    var sx = L.shelfX, sy = L.shelfY;
    // Shelf body
    ctx.fillStyle = PAL.shelfWood;
    ctx.fillRect(sx, sy, L.shelfW, L.shelfH);

    // Shelves (horizontal dividers)
    ctx.fillStyle = '#3a2418';
    for (var sl = 0; sl < 5; sl++) {
      ctx.fillRect(sx + 1, sy + sl * 10 + 2, L.shelfW - 2, 2);
    }

    // Books on shelves (colorful blocks)
    var bookColors = ['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#ff6347','#FFD700'];
    for (var sh = 0; sh < 4; sh++) {
      var shelfY = sy + sh * 10 + 4;
      var bookX = sx + 2;
      while (bookX < sx + L.shelfW - 4) {
        var bw = 2 + Math.floor(Math.random() * 3); // pre-decidable, but visual only
        var bi = (sh * 3 + bookX) % bookColors.length;
        ctx.fillStyle = bookColors[bi];
        ctx.fillRect(bookX, shelfY, 2, 6);
        bookX += bw;
      }
    }

    // Small plant on top of shelf
    ctx.fillStyle = PAL.plantPot;
    ctx.fillRect(sx + 8, sy - 6, 8, 5);
    ctx.fillStyle = PAL.plantLight;
    ctx.fillRect(sx + 7, sy - 12, 10, 6);
    ctx.fillStyle = PAL.plantGreen;
    ctx.fillRect(sx + 9, sy - 14, 6, 3);

    // Top decoration (small framed picture leaning)
    ctx.fillStyle = PAL.frameGold;
    ctx.fillRect(sx + 2, sy + L.shelfH - 14, 6, 8);
    ctx.fillStyle = '#4a90d9';
    ctx.fillRect(sx + 3, sy + L.shelfH - 13, 4, 6);
  },

  /* ---- draw: door (right wall) ---- */
  _drawDoor(ctx) {
    var dx = L.doorX, dy = L.doorY;

    // Door frame
    ctx.fillStyle = PAL.doorFrame;
    ctx.fillRect(dx - 2, dy - 2, L.doorW + 4, L.doorH + 4);

    // Door panel
    ctx.fillStyle = PAL.doorPanel;
    ctx.fillRect(dx, dy, L.doorW, L.doorH);

    // Window in door
    ctx.fillStyle = PAL.glassWin;
    ctx.fillRect(dx + 4, dy + 6, 10, 8);

    // Doorknob
    ctx.fillStyle = PAL.gold;
    ctx.fillRect(dx + 14, dy + L.doorH/2 - 1, 3, 3);

    // Light coming from door (subtle glow)
    ctx.fillStyle = 'rgba(255,215,0,0.06)';
    ctx.fillRect(dx - 6, dy + L.doorH, 8, 4);
  },

  /* ---- draw: plants ---- */
  _drawPlants(ctx) {
    // Plant bottom-left
    var p1x = L.plantL.x, p1y = L.plantL.y;
    ctx.fillStyle = PAL.plantPot;
    ctx.fillRect(p1x - 4, p1y, 8, 6);
    ctx.fillRect(p1x - 2, p1y + 6, 4, 3); // pot rim
    // Foliage layers
    for (var ly = 0; ly < 3; ly++) {
      var fy = p1y - 4 - ly * 5;
      ctx.fillStyle = ly === 0 ? PAL.plantLight : PAL.plantGreen;
      ctx.fillRect(p1x - 6 + ly, fy, 12 - ly*2, 5);
    }

    // Plant top-right (hanging)
    var p2x = L.plantR.x, p2y = L.plantR.y;
    // String
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(p2x + 5, p2y - 16, 1, 10);
    // Hanging pot
    ctx.fillStyle = PAL.plantPot;
    ctx.fillRect(p2x + 1, p2y - 8, 8, 6);
    // Leaves cascading
    for (var l2 = 0; l2 < 4; l2++) {
      var leafX = p2x + 2 + Math.sin(l2 * 1.5) * 3;
      var leafY = p2y - 2 - l2 * 4;
      ctx.fillStyle = l2 % 2 === 0 ? PAL.plantLight : PAL.plantGreen;
      ctx.fillRect(leafX, leafY, 4 + (l2%2), 3);
    }
  },

  /* ---- draw: hanging lamps ---- */
  _drawLamps(ctx) {
    var t = performance.now() * 0.001;
    for (var li = 0; li < L.lamps.length; li++) {
      var lamp = L.lamps[li];

      // Hanging wire
      ctx.fillStyle = '#3a3a4a';
      ctx.fillRect(lamp.x - 1, lamp.y - 8, 2, 8);

      // Lamp shade (triangle)
      ctx.fillStyle = '#4a3020';
      ctx.fillRect(lamp.x - 5, lamp.y, 10, 4);
      ctx.fillRect(lamp.x - 3, lamp.y + 4, 6, 2);

      // Lamp glow (pulsing)
      var glowAlpha = 0.18 + Math.sin(t * 1.2 + li * 1.7) * 0.04;
      ctx.fillStyle = 'rgba(255,215,0,' + glowAlpha.toFixed(3) + ')';
      ctx.fillRect(lamp.x - 12, lamp.y + 6, 24, 28);

      // Center bulb light
      ctx.fillStyle = 'rgba(255,230,150,0.6)';
      ctx.fillRect(lamp.x - 1, lamp.y + 5, 3, 3);

      // Light cone (subtle)
      ctx.fillStyle = 'rgba(255,215,0,0.04)';
      ctx.fillRect(lamp.x - 8, lamp.y + 6, 2, 30);
      ctx.fillRect(lamp.x + 6, lamp.y + 6, 2, 30);
    }
  },

  /* ---- draw: wall art / posters ---- */
  _drawWallArt(ctx) {
    // Large artwork on back wall (above shelves area)
    var artX = L.shelfX + L.shelfW + 8;
    var artY = L.innerTop + 14;

    // Frame
    ctx.fillStyle = PAL.frameBrown;
    ctx.fillRect(artX - 2, artY - 2, 24, 16);

    // Canvas (abstract art blocks)
    ctx.fillStyle = '#2c5f7c';
    ctx.fillRect(artX, artY, 12, 10);
    ctx.fillStyle = '#FFD700';
    ctx.fillRect(artX + 4, artY + 2, 8, 4);
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(artX + 6, artY + 6, 6, 4);

    // Small photo frames on left wall (inside)
    var frameY1 = L.barY - 10;
    for (var fi = 0; fi < 2; fi++) {
      ctx.fillStyle = PAL.frameGold;
      ctx.fillRect(L.innerRight + 4, frameY1 + fi * 36, 8, 10);
      // Photo placeholder
      ctx.fillStyle = ['#d4a574','#f0dbb7'][fi];
      ctx.fillRect(artX > 0 ? L.shelfX - 28 : 10, frameY1 + fi * 36 + 1, 6, 8);
    }

    // Menu board near bar area
    var menuX = L.barX + L.barW + 4;
    var menuY = L.barY - 6;
    ctx.fillStyle = '#2c1810';
    ctx.fillRect(menuX, menuY, 12, 16);
    // Menu lines
    ctx.fillStyle = PAL.gold;
    for (var ml = 0; ml < 5; ml++) {
      ctx.fillRect(menuX + 2, menuY + 2 + ml * 3, 8, 1);
    }
  },

  /* ---- draw: neon sign ---- */
  _drawNeonSign(ctx) {
    var t = this.neonPhase;
    // Sign position (above door)
    var signX = L.innerRight + 4;
    var signY = L.doorY - 30;

    // Multi-layer glow effect
    for (var g = 3; g >= 1; g--) {
      var glowAlpha = (0.08 / g) * (0.6 + Math.sin(t) * 0.4);
      var colors = [PAL.neonPink, PAL.neonCyan, PAL.neonWarm];
      ctx.fillStyle = colors[g - 1].replace(')', ',' + glowAlpha + ')').replace('rgb', 'rgba');

      // Can't directly use hex with alpha, approximate with overlay
      var r, gr, b;
      if (g === 1) { // pink
        r=255; gr=45; b=149;
      } else if (g === 2) { // cyan
        r=0; gr=229; b=255;
      } else { // warm
        r=255; gr=184; b=108;
      }
      ctx.fillStyle = 'rgba(' + r + ',' + gr + ',' + b + ',' + glowAlpha.toFixed(3) + ')';

      // Draw text outline for this glow layer (larger each layer)
      this._drawNeonText(ctx, signX, signY, g * 1.5);
    }

    // Core text (bright white/colored center)
    this._drawNeonText(ctx, signX, signY, 1);

    // Reflection on ground below door
    var reflAlpha = 0.04 + Math.sin(t) * 0.02;
    ctx.fillStyle = 'rgba(255,45,149,' + reflAlpha.toFixed(3) + ')';
    ctx.fillRect(signX - 4, L.doorY + L.doorH + 2, 28, 4);
  },

  _drawNeonText(ctx, ox, oy, scale) {
    // "OPEN" in pixel art style
    var s = scale;
    var baseX = ox, baseY = oy;
    ctx.fillStyle = '#fff';
    if (scale > 1) ctx.globalAlpha = clamp(0.6 / scale, 0.1, 0.5);

    // O
    ctx.fillRect(baseX + s*0, baseY + s*0, s*5, s);     ctx.fillRect(baseX + s*4, baseY + s*0, s, s*3);
    ctx.fillRect(baseX + s*0, baseY + s*2, s*5, s);     ctx.fillRect(baseX + s+1, baseY + s*3, s*3, s);
    ctx.fillRect(baseX + s*0, baseY + s*4, s*5, s);

    // P
    ctx.fillRect(baseX + s*7, baseY + s*0, s*4, s);
    ctx.fillRect(baseX + s*9, baseY + s*s, s, s*3);
    ctx.fillRect(baseX + s*7, baseY + s*s, s*2, s);

    // E (smaller)
    ctx.fillRect(baseX + s*14, baseY + s*0, s*5, s);
    ctx.fillRect(baseX + s*14, baseY + s*s, s, s*3);
    ctx.fillRect(baseX + s*14, baseY + s*2, s*3, s);

    // N (tiny)
    ctx.fillRect(baseX + s*20, baseY + s*0, s, s*5);
    ctx.fillRect(baseX + s*23, baseY + s*0, s, s*5);
    ctx.fillRect(baseX + s*20, baseY + s*s, s*4, s);

    ctx.globalAlpha = 1;
  }, // end _drawNeonText

  /* ---- draw: vignette ---- */
  _drawVignette(ctx) {
    var cx = 160, cy = 100;
    var grad = ctx.createRadialGradient(cx, cy, 40, cx, cy, 180);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.25)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 320, 200);
  },

  /* ================================================================
     PUBLIC API
     ================================================================ */
  getWeather() { return this.weatherType; },
  setWeather(type) {
    if (type !== this.weatherType) {
      this.weatherType = type;
      this.particles = [];
      if (type === 'rain') this.weatherIntensity = Math.min((typeof G !== 'undefined' && G.weather ? G.weather.intensity : 0.7), 1);
      else if (type === 'snow') this.weatherIntensity = Math.min((typeof G !== 'undefined' && G.weather ? G.weather.intensity : 0.6), 1);
    }
  },
  addCustomer() { ensureSeats(); var c = new Customer(Math.floor(Math.random()*CUST_PAL.length)); this.customers.push(c); },
};

})(); // end outer IIFE

/* ================================================================
   BOOTSTRAP — poll for G object, then init
   ================================================================ */
(function bootstrapV2() {
  CafeSceneV2.bootstrap();
})();

/* expose globally */
if (typeof window !== 'undefined') { window.CafeSceneV2 = CafeSceneV2; }

// cafe_scene_v7.js — Pixel art cafe scene (standalone, no V7 dependency)
// Render: cafe building, customers, weather, time-of-day
// Call updateScene(state) with game state to reflect orders/staff

(function() {
  const canvas = document.getElementById('cafe-scene-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = 480;
  canvas.height = 240;

  // ============ COLORS ============
  const COLORS = {
    sky_day: '#87CEEB',
    sky_sunset: '#FF8C42',
    sky_night: '#1a1a2e',
    ground: '#5a7a5a',
    building: '#8B4513',
    roof: '#A0522D',
    window: '#FFD700',
    door: '#654321',
    customer: ['#FF6B6B','#4ECDC4','#45B7D1','#96CEB4','#FFEAA7','#DDA0DD','#98D8C8','#F7DC6F'],
    hair: ['#2C3E50','#8B4513','#DAA520','#FF6347','#4A4A4A'],
    grass: '#4a7a4a',
    tree: '#2d5a2d',
    treeTrunk: '#5a3a1a',
    cloud: '#ffffff',
    rain: '#6a8eff',
    star: '#ffffff',
    moon: '#f0f0f0'
  };

  // ============ STATE ============
  let state = {
    time: 12,        // 0-24 hour
    weather: 'clear', // clear, rain, cloudy
    orders: 0,        // current orders
    staff: 0,         // number of staff
    day: 1,
    customers: []
  };

  // ============ HELPERS ============
  function lerp(a, b, t) { return a + (b - a) * t; }
  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function getTimeOfDay(hour) {
    if (hour >= 6 && hour < 10) return 'sunrise';
    if (hour >= 10 && hour < 16) return 'day';
    if (hour >= 16 && hour < 19) return 'sunset';
    return 'night';
  }

  function getSkyColor(hour) {
    const tod = getTimeOfDay(hour);
    switch (tod) {
      case 'sunrise': return '#FFB347';
      case 'day': return COLORS.sky_day;
      case 'sunset': return COLORS.sky_sunset;
      case 'night': return COLORS.sky_night;
    }
  }

  // ============ DRAWING ============
  function drawSky(hour) {
    const skyColor = getSkyColor(hour);
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height * 0.6);
    grad.addColorStop(0, skyColor);
    grad.addColorStop(1, '#87CEEB');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height * 0.6);

    // Stars at night
    if (hour < 6 || hour > 19) {
      ctx.fillStyle = COLORS.star;
      for (let i = 0; i < 30; i++) {
        const x = (i * 137.5) % canvas.width;
        const y = (i * 71.3) % (canvas.height * 0.4);
        ctx.fillRect(x, y, 2, 2);
      }
      // Moon
      ctx.fillStyle = COLORS.moon;
      ctx.beginPath();
      ctx.arc(400, 50, 20, 0, Math.PI * 2);
      ctx.fill();
    }

    // Sun
    if (hour >= 6 && hour < 19) {
      const sunX = lerp(50, 430, (hour - 6) / 13);
      const sunY = 80 - Math.sin((hour - 6) / 13 * Math.PI) * 60;
      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(sunX, sunY, 25, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawClouds(hour) {
    ctx.fillStyle = COLORS.cloud;
    const offset = (hour * 10) % canvas.width;
    // Cloud 1
    ctx.fillRect(50 - offset % 100, 30, 60, 20);
    ctx.fillRect(70 - offset % 100, 20, 30, 15);
    // Cloud 2
    ctx.fillRect(250 - offset % 150, 50, 80, 25);
    ctx.fillRect(280 - offset % 150, 35, 40, 20);
  }

  function drawGround() {
    ctx.fillStyle = COLORS.ground;
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, canvas.height * 0.4);
    // Grass
    ctx.fillStyle = COLORS.grass;
    ctx.fillRect(0, canvas.height * 0.6, canvas.width, 10);
  }

  function drawBuilding() {
    const bx = 180, by = 60, bw = 200, bh = 120;
    // Building
    ctx.fillStyle = COLORS.building;
    ctx.fillRect(bx, by, bw, bh);
    // Roof
    ctx.fillStyle = COLORS.roof;
    ctx.beginPath();
    ctx.moveTo(bx - 20, by);
    ctx.lineTo(bx + bw / 2, by - 40);
    ctx.lineTo(bx + bw + 20, by);
    ctx.fill();
    // Windows
    ctx.fillStyle = COLORS.window;
    for (let i = 0; i < 3; i++) {
      ctx.fillRect(bx + 20 + i * 60, by + 20, 40, 30);
      ctx.fillStyle = '#fff';
      ctx.fillRect(bx + 20 + i * 60 + 18, by + 20, 4, 30);
      ctx.fillRect(bx + 20 + i * 60, by + 32, 40, 4);
      ctx.fillStyle = COLORS.window;
    }
    // Door
    ctx.fillStyle = COLORS.door;
    ctx.fillRect(bx + bw / 2 - 15, by + bh - 50, 30, 50);
  }

  function drawTrees() {
    // Tree 1
    ctx.fillStyle = COLORS.treeTrunk;
    ctx.fillRect(50, 120, 15, 60);
    ctx.fillStyle = COLORS.tree;
    ctx.beginPath();
    ctx.arc(57, 120, 30, 0, Math.PI * 2);
    ctx.fill();
    // Tree 2
    ctx.fillStyle = COLORS.treeTrunk;
    ctx.fillRect(400, 130, 12, 50);
    ctx.fillStyle = COLORS.tree;
    ctx.beginPath();
    ctx.arc(406, 130, 25, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawCustomers() {
    const count = Math.min(state.customers.length, 8);
    for (let i = 0; i < count; i++) {
      const x = 150 + i * 40;
      const y = 180;
      const color = COLORS.customer[i % COLORS.customer.length];
      const hairColor = COLORS.hair[i % COLORS.hair.length];
      // Body
      ctx.fillStyle = color;
      ctx.fillRect(x, y, 12, 18);
      // Head
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(x + 2, y - 12, 8, 10);
      // Hair
      ctx.fillStyle = hairColor;
      ctx.fillRect(x + 2, y - 14, 8, 4);
      // Legs
      ctx.fillStyle = '#333';
      ctx.fillRect(x + 2, y + 18, 4, 8);
      ctx.fillRect(x + 6, y + 18, 4, 8);
    }
  }

  function drawWeather() {
    if (state.weather === 'rain') {
      ctx.strokeStyle = COLORS.rain;
      ctx.lineWidth = 1;
      for (let i = 0; i < 50; i++) {
        const x = (i * 97 + Date.now() / 50) % canvas.width;
        const y = (i * 53 + Date.now() / 20) % canvas.height;
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y + 8);
        ctx.stroke();
      }
    }
  }

  // ============ MAIN RENDER ============
  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawSky(state.time);
    drawClouds(state.time);
    drawGround();
    drawTrees();
    drawBuilding();
    drawCustomers();
    drawWeather();
  }

  // ============ UPDATE ============
  function updateScene(s) {
    state = { ...state, ...s };
    state.customers = Array.from({ length: state.orders }, (_, i) => i);
  }

  // ============ LOOP ============
  let lastTime = 0;
  function loop(timestamp) {
    if (timestamp - lastTime > 100) { // 10fps for pixel art
      render();
      lastTime = timestamp;
    }
    requestAnimationFrame(loop);
  }

  // ============ INIT ============
  window.cafeScene = { updateScene };
  requestAnimationFrame(loop);

})();

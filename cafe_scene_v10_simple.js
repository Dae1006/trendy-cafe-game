/**
 * cafe_scene_v9_simple.js — Simple interior cafe scene for testing
 */
(function() {
  'use strict';
  const W = 320, H = 200;

  let canvas, ctx;
  let t = 0;

  function init() {
    if (canvas) return;
    
    // Find existing canvas from HTML
    const ec = document.getElementById('cafe-canvas');
    if (ec) {
      canvas = ec;
    } else {
      console.error('No cafe-canvas element found!');
      return;
    }
    
    ctx = canvas.getContext('2d');
    
    // Force size
    canvas.width = W;
    canvas.height = H;
    canvas.style.display = 'block';
    
    // Clear any previous styles that might hide it
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
    
    console.log('✅ Scene V9 initialized!');
    
    requestAnimationFrame(loop);
  }

  function loop(ts) {
    t += 0.016; // ~60fps
    
    // Draw background (sky through window)
    drawSky();
    
    // Draw counter
    drawCounter();
    
    // Draw tables and customers
    drawTables();
    
    // Draw barista
    drawBarista();
    
    // Draw neon sign
    drawNeonSign();
    
    requestAnimationFrame(loop);
  }

  function drawSky() {
    ctx.fillStyle = '#87CEEB'; // sky blue
    ctx.fillRect(28, 8, 96, 34); // window area
    
    // Sun
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(115, 20, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Clouds
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(40, 12, 20, 6);
    ctx.fillRect(60, 10, 15, 8);
  }

  function drawCounter() {
    ctx.fillStyle = '#654321'; // counter
    ctx.fillRect(200, 50, 120, 48);
    
    ctx.fillStyle = '#5C3D2E'; // top
    ctx.fillRect(200, 50, 120, 4);
    
    ctx.fillStyle = '#FAFAF8'; // cups
    ctx.fillRect(210, 45, 8, 3);
  }

  function drawTables() {
    const tables = [
      { x: 50, y: 120 },
      { x: 120, y: 130 },
      { x: 160, y: 140 }
    ];
    
    for (let i = 0; i < tables.length; i++) {
      const tb = tables[i];
      
      // Table
      ctx.fillStyle = '#B8956A';
      ctx.fillRect(tb.x - 10, tb.y, 20, 4);
      
      // Chair back
      ctx.fillStyle = '#8B5E3C';
      ctx.fillRect(tb.x - 8, tb.y - 5, 16, 3);
      
      // Customer (if table has customer)
      if (i < 2) {
        const bobY = Math.sin(t + i) * 0.3;
        
        // Body
        ctx.fillStyle = ['#E8C87A', '#FF6B6B'][i];
        ctx.fillRect(tb.x - 4, tb.y - 12 + bobY, 8, 8);
        
        // Head
        ctx.fillStyle = '#FDDCB5';
        ctx.fillRect(tb.x - 3, tb.y - 16 + bobY, 6, 4);
        
        // Coffee cup
        ctx.fillStyle = '#FAFAF8';
        ctx.fillRect(tb.x - 3, tb.y - 2, 4, 3);
      }
    }
  }

  function drawBarista() {
    const bx = 210, by = 70;
    
    // Body (blue shirt)
    ctx.fillStyle = '#2C5F7C';
    ctx.fillRect(bx - 4, by - 5, 10, 12);
    
    // Head
    ctx.fillStyle = '#FDDCB5';
    ctx.fillRect(bx - 3, by - 16, 8, 11);
    
    // Hair
    ctx.fillStyle = '#3B2F1B';
    ctx.fillRect(bx - 3, by - 18, 8, 3);
    
    // Eyes (blinking)
    if (Math.sin(t * 0.4) > 0.85) {
      ctx.fillStyle = '#000';
      ctx.fillRect(bx, by - 13, 1, 1);
      ctx.fillRect(bx + 3, by - 13, 1, 1);
    }
    
    // Apron
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(bx - 3, by + 5, 8, 10);
  }

  function drawNeonSign() {
    const flicker = Math.sin(t * 6) > -0.5 ? 1 : 0.3;
    
    // "CAFÉ" text (simplified)
    ctx.fillStyle = `rgba(255, 110, 199, ${flicker})`;
    
    // C
    ctx.fillRect(25, 14, 6, 6);
    ctx.fillRect(25, 14, 1, 6);
    
    // A
    ctx.fillStyle = `rgba(79, 195, 247, ${flicker})`;
    ctx.fillRect(35, 14, 1, 6);
    ctx.fillRect(40, 14, 1, 6);
    
    // F
    ctx.fillStyle = `rgba(255, 213, 79, ${flicker})`;
    ctx.fillRect(48, 14, 1, 6);
    ctx.fillRect(48, 14, 6, 1);
    
    // E
    ctx.fillStyle = `rgba(168, 230, 207, ${flicker})`;
    ctx.fillRect(56, 14, 6, 1);
    ctx.fillRect(56, 14, 1, 6);
  }

  // Bootstrap
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  // Debug helper
  window.cafeSceneV9 = { getTime: () => t };
})();
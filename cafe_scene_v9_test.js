/**
 * cafe_scene_v9_test.js — Minimal test scene to verify canvas works
 */
(function() {
  'use strict';
  
  console.log('🎬 Scene V9 Test loading...');
  
  let canvas, ctx;
  let frame = 0;
  
  function init() {
    console.log('🔍 Initializing scene...');
    
    // Get existing canvas from HTML
    const ec = document.getElementById('cafe-canvas');
    if (!ec) {
      console.error('❌ No cafe-canvas element found!');
      return;
    }
    
    console.log('✅ Found canvas element:', ec);
    
    canvas = ec;
    ctx = canvas.getContext('2d');
    
    // Force styles to ensure visibility
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    canvas.style.opacity = '1';
    canvas.style.background = '#FFFFFF'; // white background for testing
    
    console.log('🎨 Canvas ready:', canvas.width, 'x', canvas.height);
    
    drawFrame();
  }
  
  function drawFrame() {
    if (!ctx) return;
    
    frame++;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background (sky blue)
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw ground (green)
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(0, 120, canvas.width, 80);
    
    // Draw cafe building (brown)
    ctx.fillStyle = '#654321';
    ctx.fillRect(100, 40, 120, 80);
    
    // Draw window (blue glass)
    ctx.fillStyle = '#4FC3F7';
    ctx.fillRect(110, 50, 30, 30);
    ctx.fillRect(160, 50, 30, 30);
    
    // Draw door (brown)
    ctx.fillStyle = '#5C3D2E';
    ctx.fillRect(145, 70, 20, 50);
    
    // Draw "CAFÉ" sign (pink neon)
    ctx.fillStyle = '#FF6EC7';
    ctx.fillRect(130, 20, 60, 15);
    
    // Draw text outline
    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 1;
    ctx.strokeRect(130, 20, 60, 15);
    
    // Draw animated sun
    const sunX = 50 + Math.sin(frame * 0.02) * 30;
    const sunY = 30;
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(sunX, sunY, 15, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw animated clouds
    const cloudOffset = (frame * 0.3) % canvas.width;
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(cloudOffset, 10, 40, 8);
    ctx.fillRect((cloudOffset + 100) % canvas.width, 25, 30, 6);
    
    // Draw animated customer (walking)
    const custX = (frame * 0.5) % canvas.width;
    ctx.fillStyle = '#FF6B6B'; // shirt color
    ctx.fillRect(custX - 4, 95, 8, 12); // body
    ctx.fillStyle = '#FDDCB5'; // skin
    ctx.fillRect(custX - 3, 90, 6, 5); // head
    
    console.log('📺 Frame', frame, '- Scene rendered!');
    
    if (frame < 100) { // Limit frames for testing
      requestAnimationFrame(drawFrame);
    } else {
      console.log('✅ Test completed - scene is working!');
    }
  }
  
  // Bootstrap - wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  console.log('🎬 Scene V9 Test loaded successfully!');
})();
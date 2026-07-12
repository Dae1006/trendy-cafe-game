/**
 * cafe_interior_simple.js — Scene bên trong quán cafe (bên trong quán, không phải ngoài phố)
 * Đơn giản, rõ ràng, đảm bảo chạy.
 */
(function() {
  'use strict';
  
  let canvas, ctx;
  let t = 0;
  let started = false;
  
  console.log('☕ [Scene Interior] Loading...');

  function drawCafeInterior() {
    const w = canvas.width; // 320
    const h = canvas.height; // 200
    
    // === 1. WALLS (tường quán màu kem ấm) ===
    ctx.fillStyle = '#F5E6D3'; // tường trên
    ctx.fillRect(0, 0, w, 45);
    
    ctx.fillStyle = '#E8D5C4'; // tường dưới
    ctx.fillRect(0, 45, w, 12);
    
    // === 2. FLOOR (sàn gỗ) ===
    for (let y = 57; y < h; y++) {
      const isLight = ((y - 57) % 8 < 4);
      ctx.fillStyle = isLight ? '#A0906D' : '#8B7355';
      ctx.fillRect(0, y, w, 1);
    }
    
    // === 3. CỬA SỔ LỚN nhìn ra ngoài ===
    const wx = 25, wy = 8, ww = 90, wh = 40;
    
    // Khung cửa sổ gỗ
    ctx.fillStyle = '#5A4A3A';
    ctx.fillRect(wx - 2, wy - 2, ww + 4, 4); // trên
    ctx.fillRect(wx - 2, wy + wh - 2, ww + 4, 4); // dưới
    ctx.fillRect(wx - 2, wy, 4, wh); // trái
    ctx.fillRect(wx + ww - 2, wy, 4, wh); // phải
    
    // Kính cửa sổ (sky qua cửa sổ)
    const skyGrad = ctx.createLinearGradient(wx, wy, wx, wy + wh);
    skyGrad.addColorStop(0, '#87CEEB'); // xanh trời trên
    skyGrad.addColorStop(1, '#D6F0FF'); // xanh nhạt dưới
    ctx.fillStyle = skyGrad;
    ctx.fillRect(wx, wy, ww, wh);
    
    // Cross mullion (phía trong kính)
    ctx.strokeStyle = '#5A4A3A';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wx + ww/2, wy);
    ctx.lineTo(wx + ww/2, wy + wh);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(wx, wy + wh/2);
    ctx.lineTo(wx + ww, wy + wh/2);
    ctx.stroke();
    
    // === 4. CỬA CHÍNH ===
    const dx = 35, dy = 70;
    ctx.fillStyle = '#4A3020'; // khung cửa
    ctx.fillRect(dx - 3, dy - 3, 60, 90);
    
    ctx.fillStyle = '#A8C8E0'; // kính cửa chính (trong suốt)
    ctx.fillRect(dx, dy, 54, 84);
    
    // === 5. QUẦY BAR (phía phải quán) ===
    const cx = 200, cy = 75;
    
    // Thân quầy (nâu đậm)
    ctx.fillStyle = '#654321';
    ctx.fillRect(cx, cy, 115, 80);
    
    // Mặt quầy (nâu sáng hơn)
    ctx.fillStyle = '#5C3D2E';
    ctx.fillRect(cx, cy, 115, 6);
    
    // Paneling lines trên quầy
    for (let i = 0; i < 4; i++) {
      const lx = cx + 8 + i * 27;
      ctx.fillStyle = 'rgba(74, 48, 32, 0.5)';
      ctx.fillRect(lx, cy + 6, 1, 70);
    }
    
    // === 6. MÁY PHA ESPRESSO (trên quầy) ===
    const emx = cx + 10;
    ctx.fillStyle = '#C0C0C0'; // body bạc
    ctx.fillRect(emx, cy - 25, 35, 25);
    
    // Nút LED trên máy
    ctx.fillStyle = '#FF4444'; ctx.fillRect(emx + 3, cy - 23, 4, 4); // đỏ
    ctx.fillStyle = '#44FF44'; ctx.fillRect(emx + 14, cy - 23, 4, 4); // xanh
    ctx.fillStyle = '#FFFF44'; ctx.fillRect(emx + 25, cy - 23, 4, 4); // vàng
    
    // Portafilter group
    ctx.fillStyle = '#808080';
    ctx.fillRect(emx + 5, cy - 1, 12, 5);
    
    // Steam wand (ống hơi)
    ctx.fillStyle = '#A0A0A0';
    ctx.fillRect(emx + 30, cy - 1, 2, 8);
    
    // === 7. LY TÁCH TRÊN QUẦY ===
    ctx.fillStyle = '#FAFAF8'; // saucer trắng
    ctx.fillRect(cx + 55, cy - 3, 12, 4);
    ctx.fillStyle = '#FAFAF8'; // cup trắng
    ctx.fillRect(cx + 56, cy - 9, 10, 6);
    ctx.fillStyle = 'rgba(60,36,21,0.8)'; // cà phê đen bên trong
    ctx.fillRect(cx + 57, cy - 8, 8, 4);
    
    // === 8. SHELF trên quầy (túi cà phê treo) ===
    for (let i = 0; i < 4; i++) {
      const sx = cx + 10 + i * 23;
      ctx.fillStyle = '#7B5B3A'; // túi nâu
      ctx.fillRect(sx, cy - 50, 18, 22);
      ctx.fillStyle = '#F5E6D3'; // label
      ctx.fillRect(sx + 3, cy - 46, 12, 3);
    }
    
    // === 9. NEON SIGN "CAFÉ" trên tường trái ===
    const neonAlpha = Math.sin(t * 6) > 0 ? 1 : 0.5;
    
    ctx.fillStyle = `rgba(255, 110, 199, ${neonAlpha})`;
    
    // Chữ C
    ctx.fillRect(8, 48, 7, 2); // top
    ctx.fillRect(8, 48, 2, 10); // left
    ctx.fillRect(8, 56, 5, 2); // bottom
    
    // Chữ A
    ctx.fillStyle = `rgba(79, 195, 247, ${neonAlpha})`;
    ctx.fillRect(20, 48, 2, 10);
    ctx.fillRect(25, 48, 2, 10);
    ctx.fillRect(20, 48, 7, 2); // top bar
    
    // Chữ F (simplified)
    ctx.fillStyle = `rgba(255, 213, 79, ${neonAlpha})`;
    ctx.fillRect(33, 48, 6, 2);
    ctx.fillRect(33, 48, 2, 10);
    ctx.fillRect(33, 53, 5, 2); // middle bar
    
    // === 10. BÀN GHẾ KHÁCH HÀNG (bên trong quán) ===
    
    // Bàn 1 - gần cửa sổ
    const tb1 = { x: 30, y: 140 };
    ctx.fillStyle = '#8B5E3C'; // ghế back
    ctx.fillRect(tb1.x - 12, tb1.y - 6, 24, 4);
    ctx.fillStyle = '#B8956A'; // mặt bàn
    ctx.fillRect(tb1.x - 10, tb1.y, 20, 4);
    ctx.fillStyle = '#8B5E3C'; // chân bàn
    ctx.fillRect(tb1.x - 1, tb1.y + 4, 2, 15);
    
    // Khách ngồi bàn 1 (đầu người + thân)
    const bobY1 = Math.sin(t * 1.5) * 0.3; // breathing
    ctx.fillStyle = '#E8C87A'; // áo vàng
    ctx.fillRect(tb1.x - 4, tb1.y - 14 + bobY1, 8, 8); // body
    ctx.fillStyle = '#FDDCB5'; // đầu da
    ctx.fillRect(tb1.x - 3, tb1.y - 20 + bobY1, 6, 6); // head
    ctx.fillStyle = '#DAA520'; // tóc vàng
    ctx.fillRect(tb1.x - 3, tb1.y - 21 + bobY1, 6, 2); // hair top
    
    // Coffee cup trên bàn
    ctx.fillStyle = '#FAFAF8';
    ctx.fillRect(tb1.x - 5, tb1.y - 4, 4, 3); // cup
    
    // === Bàn 2 - giữa quán ===
    const tb2 = { x: 90, y: 150 };
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(tb2.x - 12, tb2.y - 6, 24, 4); // ghế back
    ctx.fillStyle = '#B8956A';
    ctx.fillRect(tb2.x - 10, tb2.y, 20, 4); // mặt bàn
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(tb2.x - 1, tb2.y + 4, 2, 15); // chân
    
    // Khách ngồi bàn 2
    const bobY2 = Math.sin(t * 1.5 + 1) * 0.3;
    ctx.fillStyle = '#FF6B6B'; // áo đỏ
    ctx.fillRect(tb2.x - 4, tb2.y - 14 + bobY2, 8, 8);
    ctx.fillStyle = '#FDDCB5'; // đầu da
    ctx.fillRect(tb2.x - 3, tb2.y - 20 + bobY2, 6, 6);
    ctx.fillStyle = '#5C4033'; // tóc nâu
    ctx.fillRect(tb2.x - 3, tb2.y - 21 + bobY2, 6, 2);
    
    // === Bàn 3 - góc phải gần quầy ===
    const tb3 = { x: 175, y: 145 };
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(tb3.x - 12, tb3.y - 6, 24, 4);
    ctx.fillStyle = '#B8956A';
    ctx.fillRect(tb3.x - 10, tb3.y, 20, 4);
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(tb3.x - 1, tb3.y + 4, 2, 15);
    
    // Khách bàn 3 (bàn trống — chỉ vẽ ghế)
    
    // === Bàn 4 - gần cửa chính ===
    const tb4 = { x: 50, y: 180 };
    ctx.fillStyle = '#8B5E3C';
    ctx.fillRect(tb4.x - 12, tb4.y - 6, 24, 4);
    ctx.fillStyle = '#B8956A';
    ctx.fillRect(tb4.x - 10, tb4.y, 20, 4);
    
    // === 11. BARISTA đứng sau quầy (phục vụ) ===
    const barX = 215, barY = 70;
    
    // Áo xanh barista
    ctx.fillStyle = '#2C5F7C';
    ctx.fillRect(barX - 4, barY - 5, 10, 18); // body
    
    // Đầu da + tóc
    ctx.fillStyle = '#FDDCB5';
    ctx.fillRect(barX - 3, barY - 16, 8, 11); // head
    ctx.fillStyle = '#3B2F1B'; // tóc nâu
    ctx.fillRect(barX - 3, barY - 18, 8, 3); // hair top
    
    // Mắt (nháy mắt)
    if (Math.sin(t * 0.4) > 0.9) {
      ctx.fillStyle = '#000';
      ctx.fillRect(barX, barY - 13, 1, 1);
      ctx.fillRect(barX + 3, barY - 13, 1, 1);
    }
    
    // Tay trái (vừa đưa ly)
    const armSwing = Math.sin(t * 2) * 2;
    ctx.fillStyle = '#FDDCB5';
    ctx.fillRect(barX - 6, barY - 3 + armSwing, 3, 10); // tay
    
    // Áo apron trắng
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(barX - 3, barY + 8, 8, 12);
    
    // === 12. STEAM rising từ ly/cafe (hiệu ứng) ===
    for (let i = 0; i < 5; i++) {
      const steamX = tb1.x - 3 + Math.sin(t * 2 + i) * 2;
      const steamY = tb1.y - 6 - ((t * 12 + i * 8) % 15);
      if (steamY > 0 && steamY < h) {
        ctx.fillStyle = `rgba(255, 255, 255, ${0.4 - ((t * 0.3 + i) % 0.4)})`;
        ctx.fillRect(steamX, steamY, 1, 1);
      }
      
      // Steam từ quầy bar (máy pha cafe)
      const steam2X = emx + 32 + Math.sin(t * 1.8 + i + 2) * 2;
      const steam2Y = cy - 28 - ((t * 10 + i * 6) % 25);
      if (steam2Y > 0 && steam2Y < h) {
        ctx.fillStyle = `rgba(232, 232, 232, ${0.3 - ((t * 0.2 + i) % 0.3)})`;
        ctx.fillRect(steam2X, steam2Y, 1, 1);
      }
    }
    
    // === 13. ĐÈN TREO TRẦN (hanging lights) ===
    const lampPositions = [65, 140, 240];
    for (let i = 0; i < lampPositions.length; i++) {
      const lx = lampPositions[i];
      
      // Dây treo
      ctx.fillStyle = '#333';
      ctx.fillRect(lx - 1, 0, 2, 10);
      
      // Bóng đèn (vàng ấm)
      ctx.fillStyle = '#FFD54F';
      ctx.fillRect(lx - 5, 9, 10, 8);
      ctx.fillRect(lx - 3, 7, 6, 2); // shade top
      
      // Glow effect (ấm)
      const glowAlpha = 0.1 + Math.sin(t * 3 + i) * 0.03;
      for (let gy = 16; gy < h - 20; gy += 4) {
        ctx.fillStyle = `rgba(255, 213, 79, ${glowAlpha * (1 - gy / (h - 20))})`;
        ctx.fillRect(lx - 20 + i * 3, gy, 45, 1);
      }
    }
    
    // === 14. CÂY CẢNH (plant decor) ===
    const plantX = 265;
    ctx.fillStyle = '#C67B30'; // chậu
    ctx.fillRect(plantX, 185, 15, 10);
    ctx.fillStyle = '#4CAF50'; // lá xanh
    ctx.fillRect(plantX + 2, 165, 11, 20);
    ctx.fillStyle = '#3E8B44'; 
    ctx.fillRect(plantX + 4, 170, 7, 12);
    
    // === 15. VIGNETTE (tối góc) ===
    const vi = 0.12;
    for (let y = 0; y < 15; y++) {
      ctx.fillStyle = `rgba(0,0,0,${vi * y / 15})`;
      ctx.fillRect(0, y, w, 1);
    }
    for (let y = h - 15; y < h; y++) {
      ctx.fillStyle = `rgba(0,0,0,${vi * (y - (h-15)) / 15})`;
      ctx.fillRect(0, y, w, 1);
    }
    
    // === 16. TITLE (ghi chú góc dưới) ===
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, h - 12, w, 12);
    ctx.fillStyle = '#FFD700';
    ctx.font = '7px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('☕ INDOOR', 4, h - 3);
    ctx.textAlign = 'right';
    if (window.G) {
      ctx.fillText('Day ' + (G.gameDay || 1) + ' Lv' + (G.lv || 1), w - 4, h - 3);
    }
  }

  function loop(ts) {
    t += 0.016; // ~60fps increment
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawCafeInterior();
    
    requestAnimationFrame(loop);
  }

  // === BOOTSTRAP ===
  function init() {
    if (started) return;
    started = true;
    
    console.log('☕ [Scene Interior] init() called');
    
    // Tìm canvas element có sẵn
    const ec = document.getElementById('cafe-canvas');
    if (!ec) {
      console.error('❌ Không tìm thấy cafe-canvas!');
      started = false;
      return;
    }
    
    canvas = ec;
    ctx = canvas.getContext('2d');
    
    // Đảm bảo canvas hiển thị
    canvas.width = 320;
    canvas.height = 200;
    canvas.style.display = 'block';
    canvas.style.visibility = 'visible';
    canvas.style.background = '#F5E6D3'; // wall color làm background
    
    console.log('✅ [Scene Interior] Canvas ready: ' + canvas.width + 'x' + canvas.height);
    
    requestAnimationFrame(loop);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() { init(); });
  } else {
    // Check a tiny delay to make sure DOM is stable
    setTimeout(function() { init(); }, 100);
  }

  // Debug helper
  window.cafeInterior = { getTimeOfDay: function() { return (Math.sin(t * 0.5) + 1) / 2; } };

})();
// ============ ACHIEVEMENTS SYSTEM ============
const ACHIEVEMENTS = [
  {id:'first_order',name:'Đơn Đầu Tiên',desc:'Hoàn thành đơn hàng đầu tiên',icon:'📋',check:()=>G.totalServed>=1,reward:{coins:100}},
  {id:'serve_10',name:'Người Mới Lớn',desc:'Phục vụ 10 đơn',icon:'☕',check:()=>G.totalServed>=10,reward:{coins:200}},
  {id:'serve_50',name:'Barista Tài Năng',desc:'Phục vụ 50 đơn',icon:'👨‍🍳',check:()=>G.totalServed>=50,reward:{coins:500,rep:5}},
  {id:'serve_100',name:'Quán Trùm',desc:'Phục vụ 100 đơn',icon:'🏆',check:()=>G.totalServed>=100,reward:{coins:1000,rep:10}},
  {id:'serve_500',name:'Siêu Quán trưởng',desc:'Phục vụ 500 đơn',icon:'🌟',check:()=>G.totalServed>=500,reward:{coins:5000,rep:20}},
  {id:'serve_1000',name:'Vua Cà Phê',desc:'Phục vụ 1000 đơn',icon:'👑',check:()=>G.totalServed>=1000,reward:{coins:10000,rep:30}},
  {id:'lv_5',name:'Quán Nhỏ',desc:'Lên Lv5',icon:'⭐',check:()=>G.lv>=5,reward:{coins:500}},
  {id:'lv_10',name:'Quán Vừa',desc:'Lên Lv10',icon:'🌟',check:()=>G.lv>=10,reward:{coins:2000,rep:5}},
  {id:'lv_20',name:'Chủ Quán Lớn',desc:'Lên Lv20',icon:'💎',check:()=>G.lv>=20,reward:{coins:5000,rep:10}},
  {id:'lv_50',name:'Tỷ Phú Cà Phê',desc:'Lên Lv50',icon:'🏅',check:()=>G.lv>=50,reward:{coins:50000,rep:25}},
  {id:'lv_100',name:'Đệ Nhất Quán Trùm',desc:'Lên Lv100 — LEGEND!',icon:'👑',check:()=>G.lv>=100,reward:{coins:500000,rep:50}},
  {id:'first_staff',name:'Nới Rộng Đội Ngũ',desc:'Thuê nhân viên đầu tiên',icon:'👥',check:()=>G.staff.length>=1,reward:{coins:100}},
  {id:'staff_3',name:'Đội Nhỏ',desc:'Có 3 nhân viên',icon:'🎯',check:()=>G.staff.length>=3,reward:{coins:500}},
  {id:'staff_7',name:'Nhà Hàng Thực Sự',desc:'Có 7 nhân viên',icon:'🏢',check:()=>G.staff.length>=7,reward:{coins:2000,rep:10}},
  {id:'staff_15',name:'Tinh Hoa Đội Ngũ',desc:'Có 15 nhân viên (MAX)',icon:'🔥',check:()=>G.staff.length>=15,reward:{coins:10000,rep:30}},
  {id:'first_equipment',name:'Trang Bị Đầu Tiên',desc:'Mua thiết bị đầu tiên',icon:'🔧',check:()=>Object.values(G.equipment).reduce((a,b)=>a+b,0)>=1,reward:{coins:200}},
  {id:'equip_5',name:'Phòng Lab Cà Phê',desc:'Có 5 level thiết bị',icon:'⚗️',check:()=>Object.values(G.equipment).reduce((a,b)=>a+b,0)>=5,reward:{coins:1000}},
  {id:'first_trend',name:'Thế Hệ Mới',desc:'Mua decor trend đầu tiên',icon:'🎨',check:()=>G.trendItems.length>=1,reward:{coins:300}},
  {id:'trends_10',name:'Thiết Kế Gia',desc:'Có 10 decor trend',icon:'🖌️',check:()=>G.trendItems.length>=10,reward:{coins:2000,rep:5}},
  {id:'trends_all',name:'Phòng Triển Lãm',desc:'Có tất cả decor trend',icon:'🏛️',check:()=>G.trendItems.length>=TRENDS.length,reward:{coins:50000,rep:50}},
  {id:'venue_mall',name:'Bước Đầu Tiên',desc:'Nâng quán lên Mall',icon:'🏬',check:()=>G.venueLevel>=1,reward:{coins:1000}},
  {id:'venue_garden',name:'Sân Vườn Dễ Thương',desc:'Nâng quán lên Garden',icon:'🌳',check:()=>G.venueLevel>=2,reward:{coins:3000,rep:10}},
  {id:'venue_park',name:'Thiên Đường Cà Phê',desc:'Nâng quán lên Park',icon:'🏞️',check:()=>G.venueLevel>=3,reward:{coins:10000,rep:20}},
  {id:'coins_10k',name:'Ngàn Đô',desc:'Có 10,000 coins',icon:'💰',check:()=>G.coins>=10000,reward:{rep:5}},
  {id:'coins_100k',name:'Bách Vạn Phú Ông',desc:'Có 100,000 coins',icon:'🤑',check:()=>G.coins>=100000,reward:{rep:15}},
  {id:'coins_1m',name:'Tỷ Phú',desc:'Có 1,000,000 coins',icon:'💎',check:()=>G.coins>=1000000,reward:{rep:30}},
  {id:'reputation_max',name:'Quán Nổi Tiếng Nhất',desc:'Rep đạt max (300)',icon:'📣',check:()=>G.rep>=280,reward:{coins:5000}},
  {id:'day_10',name:'Tuần Nổ Lực',desc:'Sống sót 10 ngày',icon:'📅',check:()=>(G.gameDay||1)>=10,reward:{coins:300}},
  {id:'day_30',name:'Một Tháng Lấp Đẫy',desc:'Sống sót 30 ngày',icon:'🗓️',check:()=>(G.gameDay||1)>=30,reward:{coins:2000,rep:5}},
  {id:'day_60',name:'Hai Tháng Hùng Mạnh',desc:'Sống sót 60 ngày',icon:'🎖️',check:()=>(G.gameDay||1)>=60,reward:{coins:5000,rep:10}},
  {id:'day_100',name:'Bách Nhật Tranh Đấu',desc:'Sống sót 100 ngày',icon:'🏅',check:()=>(G.gameDay||1)>=100,reward:{coins:20000,rep:20}},
  {id:'special_order',name:'Master Chef Order',desc:'Phục vụ đơn Special đầu tiên',icon:'✨',check:()=>G.totalServed>0&&MENU.some(m=>m.id==='special'&&G.unlockedMenu.includes('special')),reward:{coins:500,rep:10}},
  {id:'combo_10',name:'Combo Bão Tácdesc':'Phục vụ 10 đơn liên tiếp không khách bỏ về',icon:'🔥',check:()=>false,reward:{coins:3000},special:true},
];

G.achievements = G.achievements || [];
G.checksDone = G.checksDone || {};

function checkAchievements() {
  let newAchievements = [];
  ACHIEVEMENTS.forEach(a => {
    if (G.checksDone[a.id]) return;
    try {
      if (a.check()) {
        G.achievements.push({id: a.id, name: a.name, date: Date.now()});
        G.checksDone[a.id] = true;
        newAchievements.push(a);
        
        // Give rewards
        if (a.reward.coins) G.coins += a.reward.coins;
        if (a.reward.rep) G.rep = Math.min(CONFIG.maxRep, G.rep + a.reward.rep);
        
        notify(`🏆 ACHIEVEMENT! ${a.icon} ${a.name} — +${a.reward.coins||0}₫`, 5000);
      }
    } catch(e) {}
  });
  
  if (newAchievements.length > 0) {
    updateUI();
  }
}

function renderAchievements() {
  const el = document.getElementById('panel-achievements');
  if (!el) return;
  let html = `<h3 style="color:#FFD700;margin-bottom:8px">🏆 Achievements (${G.achievements.length}/${ACHIEVEMENTS.length})</h3>`;
  
  const groups = {common:[],rare:[],epic:[],legend:[]};
  ACHIEVEMENTS.forEach(a => {
    if (G.achievements.find(x=>x.id===a.id)) {
      groups.legend.push({...a, done:true});
    } else {
      groups.common.push({...a, done:false});
    }
  });
  
  if (G.achievements.length > 0) {
    html += `<div class="section-title">✅ Unlocked</div>`;
    ACHIEVEMENTS.filter(a => G.achievements.find(x=>x.id===a.id)).forEach(a => {
      html += `<div class="card" style="border-color:#28a745">
        <div><strong>${a.icon} ${a.name}</strong><div style="color:#a0a0b0;font-size:10px">${a.desc}</div></div>
        <span style="color:#28a745">✅</span>
      </div>`;
    });
  }
  
  html += `<div class="section-title">🔒 Locked (${ACHIEVEMENTS.length - G.achievements.length})</div>`;
  let shown = 0;
  ACHIEVEMENTS.filter(a => !G.achievements.find(x=>x.id===a.id)).forEach(a => {
    if (shown >= 6) {
      if (shown === 6) html += `<div style="text-align:center;color:#555;padding:10px">... và ${ACHIEVEMENTS.length - G.achievements.length - 6} achievements khác</div>`;
      return;
    }
    html += `<div class="card" style="opacity:0.5">
      <div><strong>${a.icon} ???</strong><div style="color:#555;font-size:10px">${a.desc}</div></div>
      <span style="color:#555">🔒</span>
    </div>`;
    shown++;
  });
  
  html += `<div style="margin-top:15px;padding:10px;background:linear-gradient(90deg,#16213e,#1a1a4e);border-radius:8px;text-align:center">`;
  html += `<span style="color:#FFD700;font-size:18px">${G.achievements.length}</span> / <span style="color:#a0a0b0;font-size:18px">${ACHIEVEMENTS.length}</span>`;
  html += `<div style="width:100%;height:8px;background:#333;border-radius:4px;margin-top:8px">`;
  const pct = (G.achievements.length / ACHIEVEMENTS.length) * 100;
  html += `<div style="width:${pct}%;height:100%;background:linear-gradient(90deg,#FFD700,#28a745);border-radius:4px"></div></div>`;
  html += `</div>`;
  
  el.innerHTML = html;
}

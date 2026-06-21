// ============================================
// QUÁN TRENDY CAFÉ v2.0 — ADS & MARKETING SYSTEM
// ============================================

const AD_CAMPAIGNS = [
  { id: "flyer", name: "📄 Phát tờ rơi", cost: 200, duration: 3, customerMult: 0.1, icon: "📄" },
  { id: "billboard", name: "🪧 Bảng quảng cáo", cost: 2000, duration: 7, customerMult: 0.2, icon: "🪧" },
  { id: "social", name: "📱 Social Media", cost: 500, duration: 2, customerMult: 0.15, icon: "📱" },
  { id: "influencer", name: "🌟 KOL Partnership", cost: 5000, duration: 5, customerMult: 0.35, icon: "🌟" },
  { id: "tv", name: "📺 TV Commercial", cost: 20000, duration: 10, customerMult: 0.5, icon: "📺" },
  { id: "viral", name: "🔥 Viral Campaign", cost: 10000, duration: 3, customerMult: 0.8, icon: "🔥", viralChance: 0.3 },
];

const PROMOTIONS = [
  { id: "happy_hour", name: "⏰ Happy Hour", discount: 0.2, duration: 4, icon: "⏰" },
  { id: "buy1get1", name: "🎁 Mua 1 Tặng 1", discount: 0.5, duration: 3, icon: "🎁" },
  { id: "loyalty", name: "💳 Thẻ thành viên", discount: 0.15, duration: 30, icon: "💳" },
  { id: "student", name: "🎓 Ưu đãi sinh viên", discount: 0.25, duration: 7, icon: "🎓" },
];

let activeAds = [];
let activePromotions = [];
let adEffectiveness = {}; // Tracks diminishing returns

function renderAdCampaigns() {
  const list = document.getElementById("ads-list");
  if (!list) return;
  
  list.innerHTML = "";
  
  AD_CAMPAIGNS.forEach(campaign => {
    const div = document.createElement("div");
    div.className = "shop-item animate-fadeIn";
    div.innerHTML = `
      <div style="flex:1;">
        <div style="color:#FF6B35;font-size:9px;">${campaign.icon} ${campaign.name}</div>
        <div style="color:#8888aa;font-size:7px;">${campaign.duration} ngày • +${Math.floor(campaign.customerMult * 100)}% khách</div>
      </div>
      <div style="text-align:right;">
        <div style="color:#FFD700;font-size:8px;">${formatNumber(campaign.cost)}₫</div>
        <button class="buy-btn" onclick="startCampaign('${campaign.id}')">Chạy</button>
      </div>
    `;
    list.appendChild(div);
  });
}

function startCampaign(campaignId) {
  const campaign = AD_CAMPAIGNS.find(c => c.id === campaignId);
  if (!campaign) return;
  
  if (gameState.coins < campaign.cost) {
    showNotification("❌ Không đủ coin!");
    return;
  }
  
  gameState.coins -= campaign.cost;
  
  // Check effectiveness
  const effectiveness = adEffectiveness[campaignId] || 1.0;
  const actualMult = campaign.customerMult * effectiveness;
  
  activeAds.push({
    id: `ad_${Date.now()}`,
    campaignId: campaignId,
    name: campaign.name,
    customerMult: actualMult,
    startDay: gameState.gameDay,
    endDay: gameState.gameDay + campaign.duration,
    active: true,
  });
  
  // Diminishing returns
  adEffectiveness[campaignId] = Math.max(0.3, effectiveness - 0.1);
  
  // Check viral
  if (campaign.viralChance && Math.random() < campaign.viralChance) {
    showNotification(`🔥 VIRAL! ${campaign.name} đang hot!`);
    gameState.coins += campaign.cost * 2;
  } else {
    showNotification(`📢 Đã chạy: ${campaign.name}!`);
  }
  
  saveGame();
  renderAll();
}

function renderPromotions() {
  const list = document.getElementById("promo-list");
  if (!list) return;
  
  list.innerHTML = "";
  
  PROMOTIONS.forEach(promo => {
    const isActive = activePromotions.find(p => p.id === promo.id);
    const div = document.createElement("div");
    div.className = "shop-item animate-fadeIn";
    div.innerHTML = `
      <div style="flex:1;">
        <div style="color:#FF6B35;font-size:9px;">${promo.icon} ${promo.name}</div>
        <div style="color:#8888aa;font-size:7px;">-${Math.floor(promo.discount * 100)}% • ${promo.duration} ngày</div>
      </div>
      <div style="text-align:right;">
        ${isActive 
          ? `<div style="color:#4ECDC4;font-size:7px;">✅ Đang hoạt động</div>`
          : `<button class="buy-btn" onclick="activatePromotion('${promo.id}')">Kích hoạt</button>`
        }
      </div>
    `;
    list.appendChild(div);
  });
}

function activatePromotion(promoId) {
  const promo = PROMOTIONS.find(p => p.id === promoId);
  if (!promo) return;
  
  if (activePromotions.find(p => p.id === promoId)) {
    showNotification("⚠️ Đã có promotion này!");
    return;
  }
  
  activePromotions.push({
    id: promoId,
    name: promo.name,
    discount: promo.discount,
    startDay: gameState.gameDay,
    endDay: gameState.gameDay + promo.duration,
  });
  
  showNotification(`🎉 Đã kích hoạt: ${promo.name}!`);
  saveGame();
  renderAll();
}

function updateActiveAds() {
  // Remove expired ads
  activeAds = activeAds.filter(ad => {
    if (gameState.gameDay > ad.endDay) {
      ad.active = false;
      return false;
    }
    return true;
  });
  
  // Remove expired promotions
  activePromotions = activePromotions.filter(p => gameState.gameDay <= p.endDay);
}

function getTotalAdBonus() {
  let total = 0;
  activeAds.forEach(ad => {
    total += ad.customerMult;
  });
  return total;
}

function getActivePromotionDiscount() {
  let maxDiscount = 0;
  activePromotions.forEach(p => {
    maxDiscount = Math.max(maxDiscount, p.discount);
  });
  return maxDiscount;
}

// Initialize
if (typeof gameState.reputation !== 'undefined') {
  reputation = gameState.reputation;
}

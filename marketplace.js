// ============================================
// QUÁN TRENDY CAFÉ v2.0 — MARKETPLACE SYSTEM
// ============================================

const MARKET_LISTINGS = [];
let myListings = [];
let transactionHistory = [];

// NPC listing templates
const NPC_TEMPLATES = [
  { itemId: "t_meme_dog", name: "🐶 Meme Chó Vàng", basePrice: 200 },
  { itemId: "t_meme_cat", name: "🐱 Mèo hoang", basePrice: 150 },
  { itemId: "t_mu_jersey", name: "⚽ Áo MU", basePrice: 300 },
  { itemId: "t_astro_tea", name: "🧋 Trà sữa Astro", basePrice: 400 },
  { itemId: "t_king_keo", name: "🍬 King Keo", basePrice: 250 },
  { itemId: "t_girl_boy", name: "💃 Cô Bé Chú Bé", basePrice: 1000 },
  { itemId: "t_ba_tram", name: "💯 Ba Trăm", basePrice: 1500 },
  { itemId: "t_tu_hien", name: "🎤 Tú Hien Style", basePrice: 2000 },
  { itemId: "t_lam_pham", name: "🏆 Lam Phẩm", basePrice: 5000 },
  { itemId: "t_sieu_toc", name: "⚡ Siêu Tốc", basePrice: 8000 },
  { itemId: "t_vua_cafe", name: "👑 Vua Cà Phê", basePrice: 20000 },
  { itemId: "t_hoang_thu", name: "🔥 Hoảng Thủ", basePrice: 25000 },
  { itemId: "t_omega", name: "💫 Omega Plus", basePrice: 50000 },
];

function getMarketPrice(itemId) {
  const base = NPC_TEMPLATES.find(t => t.itemId === itemId);
  if (!base) return 0;
  // Price fluctuation: 70-130% of base
  const fluctuation = 0.7 + Math.random() * 0.6;
  // Day-based multiplier
  const dayMult = 1 + (gameState.gameDay % 30) * 0.01;
  return Math.floor(base.basePrice * fluctuation * dayMult);
}

function refreshListings() {
  MARKET_LISTINGS.length = 0;
  // Generate 5-10 NPC listings
  const count = 5 + Math.floor(Math.random() * 6);
  const shuffled = [...NPC_TEMPLATES].sort(() => Math.random() - 0.5);
  
  for (let i = 0; i < Math.min(count, shuffled.length); i++) {
    const template = shuffled[i];
    const price = getMarketPrice(template.itemId);
    MARKET_LISTINGS.push({
      id: `npc_${Date.now()}_${i}`,
      seller: "NPC",
      itemId: template.itemId,
      name: template.name,
      price: price,
      createdAt: gameState.gameDay,
      expiresAt: gameState.gameDay + 3,
    });
  }
  
  // Expire old listings
  for (let i = myListings.length - 1; i >= 0; i--) {
    if (myListings[i].expiresAt && gameState.gameDay > myListings[i].expiresAt) {
      // Return item if not sold
      if (!myListings[i].sold) {
        gameState.ownedItems[myListings[i].itemId] = (gameState.ownedItems[myListings[i].itemId] || 1) - 1;
        if (gameState.ownedItems[myListings[i].itemId] <= 0) delete gameState.ownedItems[myListings[i].itemId];
      }
      myListings.splice(i, 1);
    }
  }
  
  saveGame();
}

function renderMarketplace() {
  const list = document.getElementById("market-list");
  if (!list) return;
  
  // Combine NPC + my listings
  const allListings = [...MARKET_LISTINGS, ...myListings.filter(l => !l.sold)];
  
  if (allListings.length === 0) {
    list.innerHTML = "<div style='padding:15px;color:var(--text-dim);font-size:9px;'>📦 Không có listings hiện tại. Hãy tạo một!</div>";
    return;
  }
  
  list.innerHTML = "";
  
  allListings.forEach(listing => {
    const div = document.createElement("div");
    div.className = "shop-item animate-fadeIn";
    const isMine = listing.seller === "ME";
    div.innerHTML = `
      <div style="display:flex;align-items:center;gap:10px;flex:1;">
        <span class="item-icon">${listing.itemId.replace('t_','').substring(0,4)}</span>
        <div class="item-details">
          <div class="item-name">${listing.name}</div>
          <div class="item-desc">${isMine ? '📌 Của bạn' : '🤖 NPC'} • Ngày ${listing.createdAt}</div>
        </div>
      </div>
      <div style="text-align:right;">
        <div class="item-price">${formatNumber(listing.price)}₫</div>
        ${isMine 
          ? `<button class="buy-btn" onclick="cancelMyListing('${listing.id}')">Hủy</button>`
          : `<button class="buy-btn" onclick="buyFromMarket('${listing.id}')">Mua</button>`
        }
      </div>
    `;
    list.appendChild(div);
  });
}

function buyFromMarket(listingId) {
  const listing = [...MARKET_LISTINGS, ...myListings].find(l => l.id === listingId);
  if (!listing || listing.seller === "ME") return;
  
  if (gameState.coins < listing.price) {
    showNotification("❌ Không đủ coin!");
    return;
  }
  
  gameState.coins -= listing.price;
  gameState.ownedItems[listing.itemId] = (gameState.ownedItems[listing.itemId] || 0) + 1;
  
  // Remove listing
  const idx = MARKET_LISTINGS.findIndex(l => l.id === listingId);
  if (idx >= 0) MARKET_LISTINGS.splice(idx, 1);
  
  transactionHistory.unshift({
    type: "buy",
    itemId: listing.itemId,
    name: listing.name,
    price: listing.price,
    day: gameState.gameDay,
  });
  
  showNotification(`✅ Mua: ${listing.name}!`);
  checkQuestProgress("trade", 1);
  saveGame();
  renderAll();
}

function createListing(itemId, price) {
  const item = TREND_ITEMS.find(i => i.id === itemId);
  if (!item) return;
  if (!gameState.ownedItems[itemId] || gameState.ownedItems[itemId] <= 0) {
    showNotification("❌ Bạn không có item này!");
    return;
  }
  
  // Remove from owned
  gameState.ownedItems[itemId]--;
  if (gameState.ownedItems[itemId] <= 0) delete gameState.ownedItems[itemId];
  
  myListings.push({
    id: `my_${Date.now()}`,
    seller: "ME",
    itemId: itemId,
    name: item.name,
    price: price,
    createdAt: gameState.gameDay,
    expiresAt: gameState.gameDay + 3,
    sold: false,
  });
  
  showNotification(`📌 Đã đăng bán: ${item.name}!`);
  saveGame();
  renderAll();
}

function cancelMyListing(listingId) {
  const idx = myListings.findIndex(l => l.id === listingId);
  if (idx < 0) return;
  
  const listing = myListings[idx];
  gameState.ownedItems[listing.itemId] = (gameState.ownedItems[listing.itemId] || 0) + 1;
  myListings.splice(idx, 1);
  
  showNotification(`📋 Đã hủy listing: ${listing.name}`);
  saveGame();
  renderAll();
}

function sellMyListing(listingId) {
  const idx = myListings.findIndex(l => l.id === listingId);
  if (idx < 0) return;
  
  const listing = myListings[idx];
  listing.sold = true;
  
  gameState.coins += listing.price;
  
  transactionHistory.unshift({
    type: "sell",
    itemId: listing.itemId,
    name: listing.name,
    price: listing.price,
    day: gameState.gameDay,
  });
  
  myListings.splice(idx, 1);
  
  showNotification(`💰 Đã bán: ${listing.name}! +${formatNumber(listing.price)}₫`);
  checkQuestProgress("trade", 1);
  saveGame();
  renderAll();
}

// Auto-buy for NPC (simulate random buyers)
function simulateNPCBuyers() {
  for (let i = myListings.length - 1; i >= 0; i--) {
    const listing = myListings[i];
    if (Math.random() < 0.15) { // 15% chance per day
      sellMyListing(listing.id);
    }
  }
}

// Initialize
refreshListings();

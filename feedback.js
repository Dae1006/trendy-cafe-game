// ============================================
// QUÁN TRENDY CAFÉ v2.0 — CUSTOMER FEEDBACK
// ============================================

const FEEDBACK_TYPES = [
  { mood: "happy", rating: 5, comments: ["Ngon lắm!", "Sẽ quay lại!", "Tuyệt vời!", "Đỉnh quá!"], tip: 0.1 },
  { mood: "satisfied", rating: 4, comments: ["Ổn!", "Khá ngon", "Được", "Khá tốt"], tip: 0.05 },
  { mood: "neutral", rating: 3, comments: ["Bình thường", "Không có gì đặc biệt", "Cũng được"], tip: 0 },
  { mood: "disappointed", rating: 2, comments: ["Hơi tệ", "Chưa ngon lắm", "Cần cải thiện"], tip: 0, reputationPenalty: 0.01 },
  { mood: "angry", rating: 1, comments: ["Tệ quá!", "Không bao giờ quay lại!", "Sẽ than phiền!"], tip: 0, reputationPenalty: 0.03 }
];

const VIP_CUSTOMERS = [
  { name: "Food Blogger", icon: "📸", bonusRating: 1, tipMult: 2, chance: 0.05 },
  { name: "Food Critic", icon: "🎩", bonusRating: 2, tipMult: 3, chance: 0.02 },
  { name: "KOL", icon: "⭐", bonusRating: 1, tipMult: 5, chance: 0.01 },
];

let reputation = 50; // 0-100 scale
let feedbackHistory = [];

function generateFeedback(menuItemId) {
  const item = MENU_ITEMS.find(m => m.id === menuItemId);
  if (!item) return null;
  
  // Determine mood based on quality (random)
  const quality = Math.random();
  let moodIdx;
  if (quality > 0.8) moodIdx = 0;      // happy
  else if (quality > 0.5) moodIdx = 1;  // satisfied
  else if (quality > 0.3) moodIdx = 2;  // neutral
  else if (quality > 0.1) moodIdx = 3;  // disappointed
  else moodIdx = 4;                      // angry
  
  const feedback = FEEDBACK_TYPES[moodIdx];
  const comment = feedback.comments[Math.floor(Math.random() * feedback.comments.length)];
  
  // Check VIP
  let vip = null;
  for (const v of VIP_CUSTOMERS) {
    if (Math.random() < v.chance) {
      vip = v;
      break;
    }
  }
  
  let tip = Math.floor(item.price * feedback.tip);
  if (vip) tip = Math.floor(tip * vip.tipMult);
  
  let rating = feedback.rating;
  if (vip) rating = Math.min(5, rating + vip.bonusRating);
  
  return {
    rating: rating,
    comment: comment,
    mood: feedback.mood,
    tip: tip,
    vip: vip,
    itemId: menuItemId,
    itemName: item.name,
    day: gameState.gameDay,
  };
}

function applyFeedback(feedback) {
  if (!feedback) return;
  
  // Add tips
  if (feedback.tip > 0) {
    gameState.coins += feedback.tip;
    gameState.dailyRevenue += feedback.tip;
    gameState.totalRevenue += feedback.tip;
  }
  
  // Update reputation
  if (feedback.rating >= 4) reputation += 0.5;
  if (feedback.rating <= 2) reputation -= 0.3;
  reputation = Math.max(0, Math.min(100, reputation));
  
  // Store feedback
  feedbackHistory.unshift(feedback);
  if (feedbackHistory.length > 50) feedbackHistory.pop();
  
  // Show notification
  const stars = "⭐".repeat(feedback.rating);
  const vipText = feedback.vip ? ` (${feedback.vip.icon} ${feedback.vip.name})` : "";
  const tipText = feedback.tip > 0 ? ` +${feedback.tip}₫ tip!` : "";
  showNotification(`${stars} ${feedback.comment}${vipText}${tipText}`);
}

function getReputationBonus() {
  if (reputation >= 80) return 1.2;
  if (reputation >= 60) return 1.1;
  if (reputation >= 40) return 1.0;
  if (reputation >= 20) return 0.9;
  return 0.8;
}

function renderFeedbackPanel() {
  const list = document.getElementById("feedback-list");
  if (!list) return;
  
  if (feedbackHistory.length === 0) {
    list.innerHTML = "<div style='padding:15px;color:var(--text-dim);font-size:9px;'>Chưa có đánh giá nào!</div>";
    return;
  }
  
  list.innerHTML = "";
  
  feedbackHistory.slice(0, 10).forEach(f => {
    const div = document.createElement("div");
    div.className = "shop-item animate-fadeIn";
    const stars = "⭐".repeat(f.rating);
    div.innerHTML = `
      <div style="flex:1;">
        <div style="color:#FFD700;font-size:9px;">${stars}</div>
        <div style="color:#ccccdd;font-size:8px;">${f.comment}</div>
        <div style="color:#8888aa;font-size:7px;">${f.itemName} • Ngày ${f.day}${f.vip ? ' (' + f.vip.icon + ')' : ''}</div>
      </div>
      <div style="text-align:right;">
        <div style="color:#4ECDC4;font-size:8px;">+${f.tip}₫</div>
      </div>
    `;
    list.appendChild(div);
  });
}

function updateReputation(amount) {
  reputation += amount;
  reputation = Math.max(0, Math.min(100, reputation));
}

// Initialize
if (typeof gameState.reputation !== 'undefined') {
  reputation = gameState.reputation;
}

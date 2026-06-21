// ============================================
// QUÁN TRENDY CAFÉ v2.0 — SUPPLIER UI
// ============================================

const SUPPLIERS = {
  fast: { name: "🚀 Giao Nhanh", deliveryDays: 0, priceMult: 1.5, minOrder: 1, color: "#FF6B35" },
  normal: { name: "📦 Tiết Kiệm", deliveryDays: 1, priceMult: 1.0, minOrder: 10, color: "#4ECDC4" },
  wholesale: { name: "🏭 Wholesale", deliveryDays: 3, priceMult: 0.7, minOrder: 50, color: "#9932CC" }
};

const SUPPLY_ITEMS = {
  beans: { name: "☕ Cà phê", unit: "kg", basePrice: 50, icon: "☕", minStock: 5 },
  milk: { name: "🥛 Sữa", unit: "lít", basePrice: 30, icon: "🥛", minStock: 10 },
  cups: { name: "🥤 Cốc", unit: "cái", basePrice: 5, icon: "🥤", minStock: 20 },
  ice: { name: "🧊 Đá", unit: "kg", basePrice: 10, icon: "🧊", minStock: 10 }
};

const SUPPLY_ORDERS = [];

function getSupplyPrice(supplyType, supplierId) {
  const item = SUPPLY_ITEMS[supplyType];
  const supplier = SUPPLIERS[supplierId];
  // Weather/season price fluctuation
  const weather = getCurrentWeather();
  let weatherMult = 1;
  if (weather.type === 'hot' && supplyType === 'ice') weatherMult = 1.5;
  if (weather.type === 'rainy' && supplyType === 'beans') weatherMult = 0.8;
  
  return Math.floor(item.basePrice * supplier.priceMult * weatherMult);
}

function placeOrder(supplierId, supplyType, quantity) {
  const supplier = SUPPLIERS[supplierId];
  const item = SUPPLY_ITEMS[supplyType];
  
  if (quantity < supplier.minOrder) {
    showNotification(`⚠️ Đơn tối thiểu: ${supplier.minOrder} ${item.unit}`);
    return;
  }
  
  const price = getSupplyPrice(supplyType, supplierId) * quantity;
  
  if (gameState.coins < price) {
    showNotification(`❌ Không đủ coin! Cần ${formatNumber(price)}₫`);
    return;
  }
  
  gameState.coins -= price;
  
  SUPPLY_ORDERS.push({
    id: `ord_${Date.now()}`,
    supplier: supplierId,
    supplierName: supplier.name,
    supplyType: supplyType,
    itemName: item.name,
    quantity: quantity,
    price: price,
    orderedDay: gameState.gameDay,
    deliveryDay: gameState.gameDay + supplier.deliveryDays,
    delivered: false,
  });
  
  showNotification(`📦 Đã đặt hàng: ${item.name} x${quantity}!`);
  saveGame();
  renderAll();
}

function receiveOrder(orderId) {
  const order = SUPPLY_ORDERS.find(o => o.id === orderId);
  if (!order || order.delivered) return;
  
  if (gameState.gameDay < order.deliveryDay) {
    showNotification(`⏳ Giao hàng ngày ${order.deliveryDay}!`);
    return;
  }
  
  // Deliver supplies
  if (order.supplyType === 'beans') gameState.supplierStock.beans += order.quantity;
  if (order.supplyType === 'milk') gameState.supplierStock.milk += order.quantity;
  if (order.supplyType === 'cups') gameState.supplierStock.cups += order.quantity;
  if (order.supplyType === 'ice') gameState.iceStock = (gameState.iceStock || 0) + order.quantity;
  
  order.delivered = true;
  
  showNotification(`✅ Nhận hàng: ${order.itemName} x${order.quantity}!`);
  saveGame();
  renderAll();
}

function renderSupplierUI() {
  const actions = document.getElementById("supply-actions");
  if (!actions) return;
  
  actions.innerHTML = "";
  
  // Supplier buttons
  Object.entries(SUPPLIERS).forEach(([id, supplier]) => {
    const btn = document.createElement("button");
    btn.className = "buy-btn";
    btn.style.marginBottom = "4px";
    btn.style.display = "block";
    btn.style.width = "100%";
    btn.style.borderLeft = `4px solid ${supplier.color}`;
    btn.innerHTML = `${supplier.name} (x${supplier.priceMult})`;
    btn.onclick = () => showSupplierForm(id);
    actions.appendChild(btn);
  });
  
  // Pending orders
  const pending = SUPPLY_ORDERS.filter(o => !o.delivered);
  if (pending.length > 0) {
    const h4 = document.createElement("h4");
    h4.style.cssText = "color:#FF6B35;font-size:9px;margin:8px 0 4px;";
    h4.textContent = "📦 Đơn đang giao:";
    actions.appendChild(h4);
    
    pending.forEach(order => {
      const div = document.createElement("div");
      div.className = "supply-item";
      div.style.marginBottom = "4px";
      const canReceive = gameState.gameDay >= order.deliveryDay;
      div.innerHTML = `
        <div>${order.itemName} x${order.quantity}</div>
        <div style="font-size:7px;color:#8888aa;">${order.supplierName} • Giao ngày ${order.deliveryDay}</div>
        ${canReceive 
          ? `<button class="buy-btn" style="margin-top:4px;" onclick="receiveOrder('${order.id}')">Nhận hàng</button>`
          : `<div style="font-size:7px;color:#FF6B35;margin-top:4px;">⏳ Còn ${order.deliveryDay - gameState.gameDay} ngày</div>`
        }
      `;
      actions.appendChild(div);
    });
  }
}

function showSupplierForm(supplierId) {
  const supplier = SUPPLIERS[supplierId];
  const html = `
    <div style="padding:8px;background:#0f0f1a;border:3px solid #444;margin-top:8px;">
      <div style="color:#FF6B35;font-size:9px;margin-bottom:8px;">${supplier.name} — Đơn tối thiểu: ${supplier.minOrder}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:4px;">
        <button class="buy-btn" onclick="placeOrder('${supplierId}','beans',${supplier.minOrder})">☕ ${supplier.minOrder}kg</button>
        <button class="buy-btn" onclick="placeOrder('${supplierId}','milk',${supplier.minOrder})">🥛 ${supplier.minOrder}l</button>
        <button class="buy-btn" onclick="placeOrder('${supplierId}','cups',${supplier.minOrder})">🥤 ${supplier.minOrder}cái</button>
        <button class="buy-btn" onclick="placeOrder('${supplierId}','ice',${supplier.minOrder})">🧊 ${supplier.minOrder}kg</button>
      </div>
      <button class="buy-btn" style="width:100%;margin-top:4px;background:#333;color:#8888aa;" onclick="this.parentElement.remove()">❌ Đóng</button>
    </div>
  `;
  const temp = document.createElement("div");
  temp.innerHTML = html;
  const form = temp.firstElementChild;
  actions.appendChild(form);
}

function checkLowStock() {
  const warnings = [];
  Object.entries(SUPPLY_ITEMS).forEach(([type, item]) => {
    let stock = 0;
    if (type === 'beans') stock = gameState.supplierStock.beans || 0;
    if (type === 'milk') stock = gameState.supplierStock.milk || 0;
    if (type === 'cups') stock = gameState.supplierStock.cups || 0;
    if (type === 'ice') stock = gameState.iceStock || 0;
    
    if (stock < item.minStock) {
      warnings.push(`${item.icon} ${item.name} thấp!`);
    }
  });
  
  if (warnings.length > 0 && Math.random() < 0.1) {
    showNotification("⚠️ " + warnings[0]);
  }
}

// Initialize
renderSupplierUI();

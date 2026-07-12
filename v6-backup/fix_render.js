const fs = require('fs');
const path = 'C:\\Users\\taidu\\.openclaw\\workspace\\projects\\trendy-cafe-game\\index.html';
let html = fs.readFileSync(path, 'utf8');

// Fix the broken renderMenu function
const oldRenderMenu = `function renderMenu() {
  var el = document.getElementById("menu-list");
  el.innerHTML = "";
  for (var mi = 0; mi < MENU.length; mi++) {
    var item = MENU[mi];
    var unlocked = !item.lk || G.recipes.indexOf(item.id) >= 0;
    var profit = item.pr - item.cost;
    var d = document.createElement("div");
    d.className = "card";
    var costHtml = "<div class='cost-box'><b>Cost:</b> " + fmt(item.cost) + " VND | <b>Profit:</b> " + fmt(profit) + " VND</div>";
    var unlockHtml = "";
    if (item.lk && !unlocked) {
      if (G.lv >= item.reqLv) {
        unlockHtml = "<button class='btn' onclick='buyRecipe('"'"' + item.id + "'"'"')' style='margin-top:4px;width:100%'>Unlock (" + fmt(item.uc) + " VND)</button>";
      } else {
        unlockHtml = "<div class='cost-box'><b>Required:</b> Lv" + item.reqLv + " <span style='color:#f44336'>\\ud83d\\udd12</span> (You Lv" + G.lv + ")</div>";
      }
    } else if (item.lk && unlocked) {
      unlockHtml = "<div class='cost-box'><span style='color:#4CAF50'>\\u2705 Unlocked</span></div>";
    }
    d.innerHTML = "<div class='inf'><div class='nm'>" + item.ic + " " + item.nm + (item.lk && !unlocked ? " <span class='badge' style='background:#f44336'>LOCKED</span>" : "") + (item.lk && unlocked ? " <span class='badge' style='background:#4CAF50'>UNLOCKED</span>" : "") + "</div></div><div class='pr'>" + fmt(item.pr) + " VND</div>" + costHtml + unlockHtml + "</div>";
    el.appendChild(d);
  }
}`;

const newRenderMenu = `function renderMenu() {
  var el = document.getElementById("menu-list");
  el.innerHTML = "";
  for (var mi = 0; mi < MENU.length; mi++) {
    var item = MENU[mi];
    var unlocked = !item.lk || G.recipes.indexOf(item.id) >= 0;
    var profit = item.pr - item.cost;
    var d = document.createElement("div");
    d.className = "card";

    var profitColor = profit > 0 ? "#4CAF50" : (profit < 0 ? "#f44336" : "#9E9E9E");
    var profitSign = profit > 0 ? "+" : "";

    var costHtml = "<div style='font-size:10px;color:#FF9800;margin-top:4px'><b>COST:</b> " + fmt(item.cost) + " VND</div>";
    costHtml += "<div style='font-size:10px;color:" + profitColor + ";margin-top:2px'><b>PROFIT:</b> " + profitSign + fmt(profit) + " VND per serve</div>";

    var unlockHtml = "";
    if (item.lk && !unlocked) {
      if (G.lv >= item.reqLv) {
        unlockHtml = "<button class='btn' style='margin-top:6px;width:100%;background:#FF9800;color:#000;font-weight:bold' onclick=buyRecipe('" + item.id + ")>" + "\\ud83d\\udd13 Unlock - " + fmt(item.uc) + " VND</button>";
        unlockHtml += "<div style='font-size:9px;color:#9E9E9E;text-align:center;margin-top:2px'>You have Lv" + G.lv + "</div>";
      } else {
        unlockHtml = "<div style='font-size:10px;color:#f44336;margin-top:6px'><b>" + "\\ud83d\\udd12 Need Lv" + item.reqLv + "</b> (You Lv" + G.lv + ")</div>";
        unlockHtml += "<div style='font-size:9px;color:#FF9800;margin-top:2px'>Unlock cost: " + fmt(item.uc) + " VND</div>";
      }
    } else if (item.lk && unlocked) {
      unlockHtml = "<div style='font-size:10px;color:#4CAF50;margin-top:6px'><b>" + "\\u2705 Unlocked</b> - Profit: " + profitSign + fmt(profit) + " VND</div>";
    }

    var badgeHtml = "";
    if (item.lk && !unlocked) {
      badgeHtml = " <span class='badge' style='background:#f44336;font-size:9px'>LOCKED</span>";
    } else if (item.lk && unlocked) {
      badgeHtml = " <span class='badge' style='background:#4CAF50;font-size:9px'>UNLOCKED</span>";
    }

    d.innerHTML = "<div class='inf'><div class='nm'>" + item.ic + " " + item.nm + badgeHtml + "</div><div class='pr'>" + fmt(item.pr) + " VND</div></div>" + costHtml + unlockHtml;
    el.appendChild(d);
  }
}`;

if (html.includes(oldRenderMenu)) {
  html = html.replace(oldRenderMenu, newRenderMenu);
  console.log("renderMenu FIXED!");
} else {
  console.log("ERROR: Could not find renderMenu to replace!");
  console.log("Looking for:", oldRenderMenu.substring(0, 100));
}

// Also fix buyRecipe - it needs the reqLv check which it already has, but let's make it cleaner
const oldBuyRecipe = `function buyRecipe(id) {
  var item = null;
  for (var i = 0; i < MENU.length; i++) {
    if (MENU[i].id === id) { item = MENU[i]; break; }
  }
  if (!item || !item.lk) return;
  if (G.lv < item.reqLv) {
    notify("Need Level " + item.reqLv + "! (You Lv" + G.lv + ")");
    return;
  }
  if (G.coins < item.uc) {
    notify("Need " + fmt(item.uc) + " VND to unlock!");
    return;
  }
  G.coins -= item.uc;
  G.recipes.push(id);
  item.lk = false;
  notify("Unlocked: " + item.nm + "! (profit: " + fmt(item.pr - item.cost) + " per serve)");
  saveGame();
  renderAll();
}`;

const newBuyRecipe = `function buyRecipe(id) {
  var item = null;
  for (var i = 0; i < MENU.length; i++) {
    if (MENU[i].id === id) { item = MENU[i]; break; }
  }
  if (!item || !item.lk) return;
  if (G.lv < item.reqLv) {
    notify("Need Level " + item.reqLv + "! (You Lv" + G.lv + ")");
    return;
  }
  if (G.coins < item.uc) {
    notify("Need " + fmt(item.uc) + " VND to unlock recipe!");
    return;
  }
  G.coins -= item.uc;
  G.recipes.push(id);
  item.lk = false;
  var profit = item.pr - item.cost;
  var profitStr = profit > 0 ? "+" : "";
  notify("UNLOCKED: " + item.nm + "! Cost: " + fmt(item.cost) + " | Price: " + fmt(item.pr) + " | Profit: " + profitStr + fmt(profit) + " per serve");
  saveGame();
  renderAll();
}`;

if (html.includes(oldBuyRecipe)) {
  html = html.replace(oldBuyRecipe, newBuyRecipe);
  console.log("buyRecipe FIXED!");
} else {
  console.log("ERROR: Could not find buyRecipe to replace!");
}

fs.writeFileSync(path, html, 'utf8');
console.log("Done!");

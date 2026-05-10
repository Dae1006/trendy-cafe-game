import re

path = r'C:\Users\taidu\.openclaw\workspace\projects\trendy-cafe-game\index.html'

with open(path, 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Find the start and end of renderMenu function
start_line = None
end_line = None
brace_count = 0
in_function = False

for i, line in enumerate(lines):
    if 'function renderMenu()' in line:
        start_line = i
        in_function = True
        continue
    if in_function:
        brace_count += line.count('{') - line.count('}')
        if brace_count == 0 and '{' in ''.join(lines[start_line:i+1]):
            end_line = i
            break

print(f"Found renderMenu at lines {start_line+1}-{end_line+1}")

# New renderMenu function
new_render_menu = '''function renderMenu() {
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
        unlockHtml = "<button class='btn' style='margin-top:6px;width:100%;background:#FF9800;color:#000;font-weight:bold' onclick=\"buyRecipe('" + item.id + "')\">Unlock (" + fmt(item.uc) + " VND)</button>";
        unlockHtml += "<div style='font-size:9px;color:#9E9E9E;text-align:center;margin-top:2px'>You have Lv" + G.lv + "</div>";
      } else {
        unlockHtml = "<div style='font-size:10px;color:#f44336;margin-top:6px'><b>REQUIREMENT: Lv" + item.reqLv + "</b> (You Lv" + G.lv + ")</div>";
        unlockHtml += "<div style='font-size:9px;color:#FF9800;margin-top:2px'>Unlock cost: " + fmt(item.uc) + " VND</div>";
      }
    } else if (item.lk && unlocked) {
      unlockHtml = "<div style='font-size:10px;color:#4CAF50;margin-top:6px'><b>UNLOCKED</b> - Profit: " + profitSign + fmt(profit) + " VND</div>";
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
}
'''

# Replace
new_lines = lines[:start_line] + [new_render_menu + '\n'] + lines[end_line+1:]

with open(path, 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("renderMenu FIXED!")

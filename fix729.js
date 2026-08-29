// Insert missing "function checkLevelUp(){" before the orphaned body
const fs = require('fs');
let h = fs.readFileSync(__dirname + '/index.html', 'utf8');

// The orphaned body starts with the Vietnamese comment line
const orphanStart = "  // DÙNG do...while để up nhiều level nếu XP dư";
const insertion = "function checkLevelUp(){\n" + orphanStart;

if (h.includes(orphanStart)) {
  h = h.replace(orphanStart, insertion);
  fs.writeFileSync(__dirname + '/index.html', h);
  console.log('Inserted "function checkLevelUp(){" before orphaned body');
} else {
  console.log('Orphan pattern not found');
}

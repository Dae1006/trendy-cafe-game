// Apply critical gameplay bug fixes to the restored V7 index.html
const fs = require('fs');
const path = 'C:/Users/taidu/.openclaw/workspace/trendy-cafe-merge/index.html';

let content = fs.readFileSync(path, 'utf8');

let changes = 0;

// === FIX 1: Remove duplicate `let changed = false;` in game loop ===
const old1 = content.match(/let changed = false;\s*\n\s*let changed = false;/);
if (old1) {
  content = content.replace(/let changed = false;\s*\n\s*let changed = false;/g, 'let changed = false;');
  console.log('FIX 1: Removed duplicate let changed = false');
  changes++;
} else {
  console.log('FIX 1: Already clean (no duplicates)');
}

// === FIX 2: Bankruptcy threshold -500 (not 0) ===
if (content.includes('bankruptcyThreshold: 0')) {
  content = content.replace(/bankruptcyThreshold:\s*0/g, 'bankruptcyThreshold: -500');
  console.log('FIX 2: bankruptcyThreshold changed to -500');
  changes++;
}

// === FIX 3: Bankruptcy warning time 30s ===
if (content.includes('bankruptcyWarningTime: 15000')) {
  content = content.replace(/bankruptcyWarningTime:\s*15000/g, 'bankruptcyWarningTime: 30000');
  console.log('FIX 3: bankruptcyWarningTime changed to 30s');
  changes++;
}

// === FIX 4: Bankruptcy time 90s ===
if (content.includes('bankruptcyTime: 45000')) {
  content = content.replace(/bankruptcyTime:\s*45000/g, 'bankruptcyTime: 90000');
  console.log('FIX 4: bankruptcyTime changed to 90s');
  changes++;
}

// === FIX 5: Fix Co-op serve logic ===
const oldCoop = `if (coopBuff > 0 && si < G.staff.length - 1) {
      const nextStaff = G.staff[si + 1];
      if (nextStaff && nextStaff.mood > 20) serveMod = 0.5;
    }`;
const newCoop = `if (coopBuff > 0 && si === G.staff.length - 1) {
      serveMod = Math.min(serveMod, 0.5);
    }`;
if (content.includes(oldCoop)) {
  content = content.replace(oldCoop, newCoop);
  console.log('FIX 5: Fixed Co-op serve logic');
  changes++;
}

// === FIX 6: Add gameDay initialization in start ===
if (!content.includes('G.gameDay = G.gameDay || 1;') && content.includes('loadGame();')) {
  content = content.replace(
    /(loadGame\(\);\s*\n\s*G\.lastOrderTime\s*=)/g,
    '$1\nG.gameDay = G.gameDay || 1;'
  );
  console.log('FIX 6: Added gameDay initialization');
  changes++;
}

// === FIX 7: Add restart button onclick ===
const oldBtn = '<button class="btn" style="background:#e74c3c;padding:12px 24px;font-size:14px;font-weight:bold">';
if (content.includes(oldBtn) && !content.includes('onclick="restartGame()"')) {
  content = content.replace(
    oldBtn,
    `<button class="btn" style="background:#e74c3c;padding:12px 24px;font-size:14px;font-weight:bold" onclick="restartGame()">`
  );
  console.log('FIX 7: Added restart button onclick');
  changes++;
}

// === Verify: Check for critical game functions ===
const checks = {
  'updateUI': content.includes('function updateUI'),
  'startGameLoop': content.includes('setInterval') || content.includes('startGameLoop'),
  'serveOrder': content.includes('function serveOrder') || content.includes('serveOrder('),
  'G.staffBuffs': content.includes('staffBuffs'),
  'getDifficultyPhase': content.includes('getDifficultyPhase'),
};

console.log('\n=== Verification ===');
for (const [name, ok] of Object.entries(checks)) {
  console.log(`${ok ? '✅' : '❌'} ${name}: ${ok ? 'FOUND' : 'MISSING'}`);
}

// Save
fs.writeFileSync(path, content, 'utf8');
console.log(`\nTotal fixes applied: ${changes}`);
console.log('File size:', fs.statSync(path).size, 'bytes');

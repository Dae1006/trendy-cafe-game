// Apply gameplay bug fixes to V7 Ultimate index.html
const fs = require('fs');
const path = 'C:/Users/taidu/.openclaw/workspace/trendy-cafe-merge/index.html';
let content = fs.readFileSync(path, 'utf8');
let changes = 0;

// FIX 1: duplicate `let changed = false;`
const d1 = content.match(/let changed = false;/g);
if (d1 && d1.length > 1) {
  let found = false;
  content = content.replace(/(\s*}?\s*\n)(\s*)let changed = false;/g, (m, before) => {
    if (!found) { found = true; return '\n'; } // remove first, keep second
    return m;
  });
  const d2 = content.match(/let changed = false;/g);
  console.log(`FIX 1: duplicate 'let changed' removed (${d1.length} -> ${d2?.length})`);
  changes++;
} else {
  console.log('FIX 1: No duplicates found');
}

// FIX 2: Bankruptcy threshold -500
if (content.includes('bankruptcyThreshold: 0')) {
  content = content.replace(/bankruptcyThreshold:\s*0/g, 'bankruptcyThreshold: -500');
  console.log('FIX 2: bankruptcyThreshold -> -500');
  changes++;
}

// FIX 3: Bankruptcy warning 30s
if (content.includes('bankruptcyWarningTime: 15000')) {
  content = content.replace(/bankruptcyWarningTime:\s*15000/g, 'bankruptcyWarningTime: 30000');
  console.log('FIX 3: bankruptcyWarningTime -> 30s');
  changes++;
}

// FIX 4: Bankruptcy time 90s
if (content.includes('bankruptcyTime: 45000')) {
  content = content.replace(/bankruptcyTime:\s*45000/g, 'bankruptcyTime: 90000');
  console.log('FIX 4: bankruptcyTime -> 90s');
  changes++;
}

// FIX 5: Co-op serve logic
const oldCoop = `if (coopBuff > 0 && si < G.staff.length - 1) {
      const nextStaff = G.staff[si + 1];
      if (nextStaff && nextStaff.mood > 20) serveMod = 0.5;
    }`;
const newCoop = `if (coopBuff > 0 && si === G.staff.length - 1) {
      serveMod = Math.min(serveMod, 0.5);
    }`;
if (content.includes(oldCoop)) {
  content = content.replace(oldCoop, newCoop);
  console.log('FIX 5: Co-op serve logic fixed');
  changes++;
}

// FIX 6: gameDay init
if (!content.includes('G.gameDay = G.gameDay || 1;') && content.includes('loadGame();')) {
  content = content.replace(
    /(loadGame\(\);[\s\n]*)/g,
    '$1G.gameDay = G.gameDay || 1;\n'
  );
  console.log('FIX 6: gameDay init added');
  changes++;
}

// FIX 7: restart button onclick
if (content.includes('style="background:#e74c3c;padding:12px 24px;font-size:14px;font-weight:bold"') && !content.includes('onclick="restartGame()"')) {
  content = content.replace(
    /<button class="btn" style="background:#e74c3c;padding:12px 24px;font-size:14px;font-weight:bold">/g,
    '<button class="btn" style="background:#e74c3c;padding:12px 24px;font-size:14px;font-weight:bold" onclick="restartGame()">'
  );
  console.log('FIX 7: restart button onclick added');
  changes++;
}

// Save
fs.writeFileSync(path, content, 'utf8');

// Verify
console.log('\n=== Verification ===');
const checks = ['updateUI','serveOrder','staffBuffs','getDifficultyPhase','bankruptcyThreshold','LEVEL_REWARDS','TRENDS'];
checks.forEach(k => console.log(`${k}: ${content.includes(k)?'OK':'MISSING'}`));
console.log(`\nFixes applied: ${changes}`);
console.log('File size:', fs.statSync(path).size, 'bytes');

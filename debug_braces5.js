const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
const lines = script.split('\n');

// Show all lines with their brace counts
let cum = 0;
for (let i = 0; i < lines.length; i++) {
  let lc = 0;
  for (const ch of lines[i]) {
    if (ch === '{') lc++;
    if (ch === '}') lc--;
  }
  cum += lc;
  if (lc !== 0) {
    const line = lines[i].trim();
    const truncated = line.length > 80 ? line.substring(0, 80) + '...' : line;
    console.log('Line ' + (i+1) + ' [net=' + lc + ', cum=' + cum + ']: ' + truncated);
  }
}
console.log('\nFinal cum balance: ' + cum);

// The key issue: line 54 and 57 in the script block have net=-1
// Let me look at those lines
console.log('\n--- Line 54 ---');
console.log(lines[53]);
console.log('\n--- Line 57 ---');
console.log(lines[56]);

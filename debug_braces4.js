const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
const lines = script.split('\n');

// Check each line for brace count
let cum = 0;
for (let i = 0; i < lines.length; i++) {
  let lc = 0;
  for (const ch of lines[i]) {
    if (ch === '{') lc++;
    if (ch === '}') lc--;
  }
  cum += lc;
  if (i >= 46 && i <= 58) {
    console.log('Line ' + (i+1) + ': net=' + lc + ' cum=' + cum + ' => ' + lines[i].substring(0, 100));
  }
}
console.log('\nLine 48-58 detail:');
// Line 48 in script = line 155 in file (need to check)
// Actually line numbers are 1-indexed from the <script> tag

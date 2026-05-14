const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
const lines = script.split('\n');

// Show lines 82-102
for (let i = 81; i < Math.min(102, lines.length); i++) {
  console.log((i+1) + ': ' + lines[i]);
}

// Check: is there a missing { in the first part?
// The script block is from <script> to </script>
// Lines before <script> are in the CSS <style> tag
// Lines 1-107 are CSS (in <style> tag)
// Line 108 is <script>
// Lines 109+ are inside <script>

// Let me count braces in the entire HTML
let totalBl = 0;
for (let i = 0; i < lines.length; i++) {
  for (const ch of lines[i]) {
    if (ch === '{') totalBl++;
    if (ch === '}') totalBl--;
  }
}
console.log('\nTotal HTML brace balance:', totalBl);

// Check style tag braces
let styleBl = 0;
let inStyle = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<style>') || lines[i].includes('@import')) inStyle = true;
  if (inStyle) {
    for (const ch of lines[i]) {
      if (ch === '{') styleBl++;
      if (ch === '}') styleBl--;
    }
    if (lines[i].includes('</style>')) break;
  }
}
console.log('Style tag balance:', styleBl);

// Check: CSS in HTML has its own braces
// The script is standalone
// Let me re-check: does the CSS have unbalanced braces?
console.log('\nCSS lines:');
inStyle = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<style>') || lines[i].includes('@import')) inStyle = true;
  if (inStyle) {
    for (const ch of lines[i]) {
      if (ch === '{') styleBl++;
      if (ch === '}') styleBl--;
    }
    if (lines[i].includes('</style>')) {
      console.log('End of style at line ' + (i+1) + ', balance: ' + styleBl);
      break;
    }
  }
}

// Let's check each line in the style tag
styleBl = 0;
inStyle = false;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<style>') || lines[i].includes('@import')) { inStyle = true; continue; }
  if (!inStyle) continue;
  if (lines[i].includes('</style>')) break;
  let lc = 0;
  for (const ch of lines[i]) {
    if (ch === '{') lc++;
    if (ch === '}') lc--;
  }
  styleBl += lc;
  if (lc !== 0) console.log('CSS line ' + (i+1) + ': net=' + lc + ' cum=' + styleBl);
}

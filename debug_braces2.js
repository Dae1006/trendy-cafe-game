const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
const lines = script.split('\n');

let bl = 0;
let negLine = -1;
for (let i = 0; i < lines.length; i++) {
  const prev = bl;
  for (const ch of lines[i]) {
    if (ch === '{') bl++;
    if (ch === '}') bl--;
  }
  if (bl < 0 && negLine === -1) {
    negLine = i + 1;
    console.log('First negative at line ' + negLine + ' (prev=' + prev + ')');
    console.log('  ' + lines[i].substring(0, 100));
    break;
  }
}

// Now let me check each line's net brace count
console.log('\n--- Per-line brace counts ---');
let cum = 0;
for (let i = 0; i < lines.length; i++) {
  let lc = 0;
  for (const ch of lines[i]) {
    if (ch === '{') lc++;
    if (ch === '}') lc--;
  }
  cum += lc;
  if (lc < 0 || lc > 0) {
    console.log('Line ' + (i+1) + ': net=' + lc + ' cum=' + cum);
  }
}

// Check: which function has extra close
// Let me try removing the last } and re-check
console.log('\n--- Trying to find which } is extra ---');
const lastChar = script[script.length - 1];
console.log('Last char:', JSON.stringify(lastChar));

// Let's look at each function boundary
const funcLines = [];
let inFunc = false;
let funcStart = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith('function ')) {
    if (inFunc) funcLines.push([funcStart, i-1]);
    funcStart = i;
    inFunc = true;
  }
}
if (inFunc) funcLines.push([funcStart, lines.length - 1]);

console.log('\n--- Function boundaries ---');
for (const [s, e] of funcLines) {
  let fc = 0;
  for (let i = s; i <= e; i++) {
    for (const ch of lines[i]) {
      if (ch === '{') fc++;
      if (ch === '}') fc--;
    }
  }
  if (fc !== 0) {
    console.log('Lines ' + (s+1) + '-' + (e+1) + ': net=' + fc);
  }
}

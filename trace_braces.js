// Per-line brace balance across the whole script block (string/comment aware)
const fs = require('fs');
const h = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = h.match(/<script>([\s\S]*?)<\/script>/);
const code = m[1];
const lines = code.split('\n');

let bal = 0, strCh = null, inBlockComment = false;
const trace = [];
for (let k = 0; k < lines.length; k++) {
  const line = lines[k];
  const startBal = bal;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inBlockComment) {
      if (c === '*' && line[i + 1] === '/') { inBlockComment = false; i++; }
      continue;
    }
    if (strCh) {
      if (c === '\\') { i++; continue; }
      if (c === strCh) strCh = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { strCh = c; continue; }
    if (c === '/' && line[i + 1] === '/') break;
    if (c === '/' && line[i + 1] === '*') { inBlockComment = true; i++; continue; }
    if (c === '{') bal++;
    if (c === '}') bal--;
  }
  if (bal !== startBal) trace.push({ line: k + 1, bal, startBal });
}

console.log('Final balance:', bal);
console.log('Lines that changed balance:');
trace.forEach(t => console.log(`  line ${t.line}: ${t.startBal} -> ${t.bal}`));
if (bal !== 0) {
  // find last line that pushed balance to its max and where it should close
  console.log('\nShowing last 15 balance changes:');
  trace.slice(-15).forEach(t => console.log(`  line ${t.line}: ${t.startBal} -> ${t.bal}  |  ${lines[t.line-1]}`));
}

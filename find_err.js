// Find where the syntax error actually is by binary-searching the script
const fs = require('fs');
const vm = require('vm');
const h = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = h.match(/<script>([\s\S]*?)<\/script>/);
const code = m[1];
const lines = code.split('\n');

function canParse(text) {
  try { new vm.Script(text); return true; } catch { return false; }
}

// Binary search: find smallest prefix that fails to parse
let lo = 1, hi = lines.length;
// First check: whole thing fails?
if (canParse(code)) { console.log('WHOLE THING PARSES'); process.exit(0); }

// Find first line where prefix fails
let firstBad = lines.length;
for (let n = 1; n <= lines.length; n++) {
  const prefix = lines.slice(0, n).join('\n');
  if (!canParse(prefix)) { firstBad = n; break; }
}
console.log('First failing prefix length (lines):', firstBad);
console.log('\nContext (lines around first failure):');
for (let k = Math.max(0, firstBad - 4); k < Math.min(lines.length, firstBad + 3); k++) {
  const marker = (k + 1 === firstBad) ? '>>>' : '   ';
  console.log(marker, (k + 1) + '| ' + lines[k]);
}
// Show why: parse just that line standalone for hint
try { new vm.Script(lines[firstBad - 1]); } catch (e) {
  console.log('\nLine', firstBad, 'alone error:', e.message);
}

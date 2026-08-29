// Line-level bisect: find the FIRST line L such that "up to L" cannot parse
// (accounting for legitimately unclosed brackets at the cut point).
const fs = require('fs');
const vm = require('vm');
const h = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = h.match(/<script>([\s\S]*?)<\/script>/);
const code = m[1];
const lines = code.split('\n');

function openBrackets(text) {
  // Count unclosed { ( [ in order (string-aware)
  const stack = [];
  let strCh = null;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '\n') { strCh = null; continue; }
    if (strCh) { if (c === '\\') i++; else if (c === strCh) strCh = null; continue; }
    if (c === '"' || c === "'" || c === '`') { strCh = c; continue; }
    if (c === '/' && text[i+1] === '/') { while (i < text.length && text[i] !== '\n') i++; continue; }
    if (c === '/' && text[i+1] === '*') { i += 2; while (i < text.length && !(text[i] === '*' && text[i+1] === '/')) i++; i++; continue; }
    if (c === '{' || c === '(' || c === '[') stack.push(c);
    if (c === '}' || c === ')' || c === ']') {
      const pair = { '}': '{', ')': '(', ']': '[' };
      if (stack.length && stack[stack.length-1] === pair[c]) stack.pop();
    }
  }
  return stack;
}

function parseOK(prefixText) {
  try {
    new vm.Script(prefixText);
    return true;
  } catch (e) {
    // If it's just "Unexpected end of input" and all we have are OPEN brackets,
    // that's a legitimate truncation — treat as "OK so far".
    const opens = openBrackets(prefixText);
    if (opens.length > 0 && /end of input|unexpected end|unexpected eof/i.test(e.message)) return true;
    // Also tolerate unterminated strings at very end
    return false;
  }
}

let lo = 1, hi = lines.length, firstBad = lines.length + 1;
while (lo <= hi) {
  const mid = (lo + hi) >> 1;
  if (parseOK(lines.slice(0, mid).join('\n'))) lo = mid + 1;
  else { firstBad = mid; hi = mid - 1; }
}
console.log('First failing line (1-indexed):', firstBad);
const k = firstBad - 1;
console.log('\nContext:');
for (let i = Math.max(0, k - 4); i < Math.min(lines.length, k + 4); i++) {
  console.log((i+1 === firstBad ? '>>>' : '   '), (i+1) + '| ' + lines[i]);
}

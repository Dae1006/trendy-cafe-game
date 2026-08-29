// Finds the exact line where brace balance first goes negative in an inline <script> block
const fs = require('fs');
const vm = require('vm');

const html = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = html.match(/<script>([\s\S]*?)<\/script>/);
if (!m) { console.log('no inline script found'); process.exit(1); }
const code = m[1];

// Try to parse; if it fails, walk char-by-char tracking string state to find first unbalanced '}'
try {
  new vm.Script(code);
  console.log('SYNTAX OK');
  process.exit(0);
} catch (e) {
  console.log('SYNTAX ERROR:', e.message);
}

let bal = 0;
let strCh = null; // current string quote char
let firstNeg = null;
const lines = code.split('\n');
let lineIdx = 0;

for (let i = 0; i < code.length; i++) {
  const c = code[i];
  if (c === '\n') { lineIdx++; strCh = null; continue; }
  if (strCh) {
    if (c === '\\') { i++; continue; }
    if (c === strCh) strCh = null;
    continue;
  }
  if (c === '"' || c === "'" || c === '`') { strCh = c; continue; }
  if (c === '/') {
    // possible comment: check next char
    if (code[i + 1] === '/') { // line comment: skip to EOL
      while (i < code.length && code[i] !== '\n') i++;
      continue;
    }
    if (code[i + 1] === '*') { // block comment
      i += 2;
      while (i < code.length && !(code[i] === '*' && code[i + 1] === '/')) i++;
      i++;
      continue;
    }
  }
  if (c === '{') bal++;
  if (c === '}') {
    bal--;
    if (bal < 0 && !firstNeg) firstNeg = { line: lineIdx + 1, pos: i };
  }
}

if (firstNeg) {
  const ln = firstNeg.line;
  console.log('First unbalanced } at block line ' + ln);
  for (let k = Math.max(0, ln - 5); k < Math.min(lines.length, ln + 2); k++) {
    const marker = (k + 1 === ln) ? '>>>' : '   ';
    console.log(marker, (k + 1) + '| ' + lines[k]);
  }
} else {
  console.log('balance never went negative; final balance = ' + bal);
}

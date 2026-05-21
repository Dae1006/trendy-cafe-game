const fs = require('fs');
const html = fs.readFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', 'utf8');
const lines = html.split('\n');

// The issue: init() function has too many }
// Line 205 in file: function init(){...}
// Let me count braces manually
const initLine = lines[204]; // 0-indexed = line 205
console.log('init() line length:', initLine.length);

let bl = 0;
for (const ch of initLine) {
  if (ch === '{') bl++;
  if (ch === '}') bl--;
}
console.log('init() brace balance:', bl);

// Let me also check: is there something between </style> and <script> that's not balanced?
let inStyle = false;
let inScript = false;
let styleBl = 0;
let preScriptBl = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<style>') || lines[i].includes('@import')) inStyle = true;
  if (inStyle && !inScript) {
    for (const ch of lines[i]) {
      if (ch === '{') styleBl++;
      if (ch === '}') styleBl--;
    }
    if (lines[i].includes('</style>')) {
      console.log('Style balance: ' + styleBl);
      inStyle = false;
    }
  }
  if (lines[i].includes('<script>') && !inScript) {
    inScript = true;
    // Everything before this point should be balanced
    console.log('Everything before script should be balanced since CSS is 0');
    break;
  }
}

// Check: maybe the script itself is fine, but there's a problem with the closing </script>
// Let me find all { and } in the entire file
let totalOpen = 0, totalClose = 0;
for (let i = 0; i < lines.length; i++) {
  for (const ch of lines[i]) {
    if (ch === '{') totalOpen++;
    if (ch === '}') totalClose++;
  }
}
console.log('Total file: { = ' + totalOpen + ', } = ' + totalClose + ', balance = ' + (totalOpen - totalClose));

// The script is between <script> and </script>
// Everything outside the script should be balanced
const scriptStart = lines.findIndex(l => l.includes('<script>') && !l.includes('</script>') || l.trim() === '<script>');
console.log('Script starts at line:', scriptStart + 1);

// Check braces outside script
let outBl = 0;
for (let i = 0; i <= scriptStart; i++) {
  for (const ch of lines[i]) {
    if (ch === '{') outBl++;
    if (ch === '}') outBl--;
  }
}
console.log('Outside script brace balance:', outBl);

// The difference between total and outside is inside script
const scriptBl = (totalOpen - totalClose) - outBl;
console.log('Inside script brace balance:', scriptBl);

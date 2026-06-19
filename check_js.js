const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const lines = html.split('\n');
let inScript = false, script = '';
for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('<script>') && !inScript) { inScript = true; continue; }
  if (lines[i].includes('</script>') && inScript) break;
  if (inScript) script += lines[i] + '\n';
}
console.log('Script length:', script.length);
// Brace balance
let bl = 0;
for (const ch of script) { if (ch === '{') bl++; if (ch === '}') bl--; }
console.log('Brace balance:', bl);

// Find all functions
const funcRe = /function\s+(\w+)/g;
const funcs = [];
let m;
while ((m = funcRe.exec(script)) !== null) funcs.push(m[1]);
console.log('Functions:', funcs.join(', '));
console.log('Count:', funcs.length);

// Check init() specifically for initTabs call
if (script.includes('initTabs()')) {
  console.log('initTabs called: YES');
} else {
  console.log('initTabs called: NO - THIS IS THE BUG');
}

// Check if render() is called
if (script.includes('render()')) {
  console.log('render called: YES');
}

// Check for the problematic setTimeout at end
if (script.includes('setTimeout(function(){var ld=document.getElementById')) {
  console.log('Duplicate setTimeout found');
}

// Check each function for brace balance
let pos = 0;
funcs.forEach(f => {
  const idx = script.indexOf('function ' + f, pos);
  if (idx === -1) return;
  let depth = 0, start = idx;
  let found = false;
  for (let j = idx; j < script.length; j++) {
    if (script[j] === '{') depth++;
    if (script[j] === '}') depth--;
    if (depth === 0 && script[j] === '}') { found = true; break; }
  }
  if (!found) console.log(f, '— UNCLOSED!');
  pos = idx + f.length;
});

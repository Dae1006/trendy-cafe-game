const fs = require('fs');
const html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
const lines = script.split('\n');

// Count braces for line 100 specifically
const line100 = lines[99];
console.log('Line 100:', line100);
let bl = 0;
for (const ch of line100) {
  if (ch === '{') { bl++; console.log('  { -> ' + bl); }
  if (ch === '}') { console.log('  } -> ' + (bl-1)); bl--; }
}
console.log('Line 100 final brace balance:', bl);

// Check: remove last } and test
const fixedLine = line100.slice(0, -1);
let fbl = 0;
for (const ch of fixedLine) {
  if (ch === '{') fbl++;
  if (ch === '}') fbl--;
}
console.log('After removing last }: ', fbl);

// Check the whole script without the last }
const fixedScript = script.slice(0, script.length - 1);
let total = 0;
for (const ch of fixedScript) {
  if (ch === '{') total++;
  if (ch === '}') total--;
}
console.log('Total balance without last }: ', total);

// Full balance
let total2 = 0;
for (const ch of script) {
  if (ch === '{') total2++;
  if (ch === '}') total2--;
}
console.log('Full script balance: ', total2);

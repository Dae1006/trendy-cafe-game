const fs = require('fs');
const html = fs.readFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', 'utf8');
// Fix: replace the last } with nothing in the script block
const lines = html.split('\n');
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith('if(document.readyState')) {
    console.log('Found at line ' + (i+1));
    console.log('Original:', lines[i]);
    // Remove the last }
    lines[i] = lines[i].slice(0, -1) + '\n';
    console.log('Fixed:', lines[i]);
    break;
  }
}
const fixed = lines.join('\n');
let bl = 0;
const scriptMatch = fixed.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
for (const ch of script) { if (ch === '{') bl++; if (ch === '}') bl--; }
console.log('Balance:', bl);
fs.writeFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', fixed);
console.log('File updated!');

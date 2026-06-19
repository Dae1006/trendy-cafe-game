const fs = require('fs');
let html = fs.readFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', 'utf8');

// The problem: line 207 ends with `}}` (two closing braces)
// it should end with `}` (one closing brace)
// Pattern: `setTimeout(startGame,0);}}` followed by newline
// Fix: change to `setTimeout(startGame,0);}`

html = html.replace(
  /(setTimeout\(startGame,0\);)\}\}\s*\n<\/script>/,
  '$1}\n'
);

// Verify
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
let bl = 0;
for (const ch of script) { if (ch === '{') bl++; if (ch === '}') bl--; }
console.log('Balance:', bl);
console.log('JS syntax valid:', (() => { try { new Function(script); return true; } catch(e) { return false; } })());

fs.writeFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', html);
console.log('Fixed!');

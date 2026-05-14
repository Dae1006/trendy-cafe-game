const fs = require('fs');
const html = fs.readFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const script = scriptMatch[1];
const lines = script.split('\n');

let cum = 0;
for (let i = 0; i < lines.length; i++) {
  let lc = 0;
  for (const ch of lines[i]) {
    if (ch === '{') lc++;
    if (ch === '}') lc--;
  }
  cum += lc;
  if (lc !== 0) {
    console.log('Line ' + (i+1) + ': net=' + lc + ' cum=' + cum);
  }
}
console.log('\nFinal:', cum);

// Now check: does the script start at the <script> tag?
// The HTML before the script block has a <style> with CSS braces
// We already verified CSS is balanced (0)
// So script should also be balanced

// Let me check if there's a missing { in the file
console.log('\nTotal { count:', (script.match(/{/g) || []).length);
console.log('Total } count:', (script.match(/}/g) || []).length);

// Maybe the issue is in a different part - let me find ALL function boundaries
console.log('\n--- Functions ---');
let funcBl = 0;
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim().startsWith('function ')) {
    funcBl = 0;
    for (let j = i; j < lines.length; j++) {
      for (const ch of lines[j]) {
        if (ch === '{') funcBl++;
        if (ch === '}') funcBl--;
      }
      if (lines[j].trim().endsWith('}') || (j > i && lines[j+1] && lines[j+1].trim().startsWith('function '))) {
        if (funcBl !== 0 && j > i) {
          console.log('Function starting at line ' + (i+1) + ' has unbalanced braces: ' + funcBl);
          console.log('  Ends at line ' + (j+1) + ': ' + lines[j].substring(0, 60));
        }
        break;
      }
    }
  }
}

const fs = require('fs');
const html = fs.readFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const lines = scriptMatch[1].split('\n');

for (let i = 0; i < lines.length; i++) {
  try {
    new Function(lines[i]);
  } catch(e) {
    if (e.message.includes('Unexpected')) {
      console.log('Line ' + (i+1) + ': ' + lines[i].substring(0,200));
    }
  }
}

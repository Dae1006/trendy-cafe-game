const fs = require('fs');
const html = fs.readFileSync('C:/Users/taidu/.openclaw/workspace/projects/trendy-cafe-game/index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
const code = scriptMatch[1];
const lines = code.split('\n');

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // Skip empty lines
    if (!line.trim()) continue;
    try {
        new Function(line);
    } catch(e) {
        if (e.message.includes('Unexpected') || e.message.includes('identifier')) {
            console.log('ERROR at line ' + (i+1) + ': ' + e.message);
            console.log('Line content: ' + line.substring(0,200));
        }
    }
}

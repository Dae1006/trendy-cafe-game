const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// 1. Remove Google Fonts dependency (causes loading delay)
html = html.replace(/@import url\('https:\/\/fonts\.googleapis\.com\/css2\?family=Press\+Start\+2P&disp\+lay=swap'\);/g, '');
html = html.replace(/font-family:'Press Start 2P',monospace/g, "font-family:'Courier New',monospace");

// 2. Add debug logging
html = html.replace(
  'function startGame(){console.log("startGame() called");init();}',
  'function startGame(){console.log("startGame called");console.log("DOM ready:", document.readyState);console.log("#coins:", document.getElementById("coins"));try{init();console.log("init done");}catch(e){console.error("init failed:",e.message);}}'
);

fs.writeFileSync('index.html', html);
console.log('Applied: (1) remove Google Fonts, (2) add debug logs');

// 3. Serve locally to test
const http = require('http');
const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(html);
});
server.listen(3000, () => console.log('Local server: http://localhost:3000'));

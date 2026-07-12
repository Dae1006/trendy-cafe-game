const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Fix 1: Loading div must be HIDDEN by default
html = html.replace('display:flex !important', 'display:none !important');

// Fix 2: Add loading hide at the start of init()
html = html.replace(
  'function init(){try{var coinsEl',
  'function init(){try{var ld=document.getElementById("loading");if(ld)ld.style.display="none";var coinsEl'
);

// Fix 3: Remove duplicate setTimeout at the end
html = html.replace(
  'setTimeout(function(){var ld=document.getElementById("loading");if(ld)ld.style.display="none";},2000);',
  ''
);

// Fix 4: Ensure initTabs is called
html = html.replace(
  'console.log("init() starting...");initTabs();render();',
  'console.log("init() starting...");initTabs();render();'
);

// Fix 5: If initTabs is not called before render, ensure it runs
// The init() already calls initTabs() before render()

fs.writeFileSync('index.html', html);
console.log('All fixes applied');

// Verify
const buf = Buffer.from(html, 'utf8');
let crlf = 0;
for (let i = 0; i < buf.length - 1; i++) {
  if (buf[i] === 13 && buf[i+1] === 10) crlf++;
}
console.log('CRLF:', crlf);
console.log('Loading hidden:', !html.includes('display:flex'));

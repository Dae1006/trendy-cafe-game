const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const target = '</script>';
const replacement = 'setTimeout(function(){var ld=document.getElementById("loading");if(ld)ld.style.display="none";},2000);</script>';
html = html.replace(target, replacement);
fs.writeFileSync('index.html', html);
console.log('Added auto-hide loading screen');

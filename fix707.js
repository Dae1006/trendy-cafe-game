// Fix line 707: missing semicolon after html+='...' 
const fs = require('fs');
let h = fs.readFileSync(__dirname + '/index.html', 'utf8');

const bad = "html+='<div class=\"card\" style=\"'+(d?'border-color:#28a745;background:linear-gradient(90deg,#164829,#1a1a4e)':'')+'\">'";
const good = "html+='<div class=\"card\" style=\"'+(d?'border-color:#28a745;background:linear-gradient(90deg,#164829,#1a1a4e)':'')+'\">';";

if (h.includes(bad)) {
  h = h.replace(bad, good);
  fs.writeFileSync(__dirname + '/index.html', h);
  console.log('Fixed line 707!');
} else {
  console.log('Pattern not found — checking if already fixed...');
  if (h.includes(good)) console.log('Already fixed!');
  else console.log('ERROR: neither pattern matched');
}

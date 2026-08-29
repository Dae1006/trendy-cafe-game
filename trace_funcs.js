// Find all top-level "function X(){" and check their balance
const fs = require('fs');
const h = fs.readFileSync(__dirname + '/index.html', 'utf8');
const m = h.match(/<script>([\s\S]*?)<\/script>/);
const code = m[1];
const lines = code.split('\n');

// Track brace depth; when depth goes from 0 to 1, mark start; when it goes back to 0, that's end of block
let depth = 0, strCh = null, inBlockComment = false;
let currentFuncStart = -1;
let funcName = '';

for (let k = 0; k < lines.length; k++) {
  const line = lines[k];
  if (depth === 0) {
    // check if this line starts a function at top level
    const fMatch = line.match(/^\s*function\s+(\w+)/);
    if (fMatch) { funcName = fMatch[1]; currentFuncStart = k + 1; }
  }
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inBlockComment) {
      if (c === '*' && line[i + 1] === '/') { inBlockComment = false; i++; }
      continue;
    }
    if (strCh) {
      if (c === '\\') { i++; continue; }
      if (c === strCh) strCh = null;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { strCh = c; continue; }
    if (c === '/' && line[i + 1] === '/') break;
    if (c === '/' && line[i + 1] === '*') { inBlockComment = true; i++; continue; }
    if (c === '{') depth++;
    if (c === '}') depth--;
  }
  // If we were inside a function and depth just hit 0, record the end
  if (depth === 0 && currentFuncStart >= 0) {
    console.log(`function ${funcName}: lines ${currentFuncStart}-${k + 1} OK`);
    currentFuncStart = -1;
    funcName = '';
  }
}
// Any function that never closed?
if (currentFuncStart >= 0) {
  console.log(`\n*** BROKEN: function ${funcName} starts at line ${currentFuncStart} and NEVER CLOSES ***`);
}
console.log('Final depth:', depth);

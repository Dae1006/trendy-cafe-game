const line = "function initTabs(){var bts=document.querySelectorAll('.nb');for(var i=0;i<bts.length;i++){(function(b){b.tabIndex=i;b.onclick=function(){var j=b.tabIndex;var btns=document.querySelectorAll('.nb');for(var k=0;k<btns.length;k++){btns[k].classList.remove('on');}btns[j].classList.add('on');var pnls=document.querySelectorAll('.pan');for(var k=0;k<pnls.length;k++){pnls[k].classList.remove('on');}var tab=document.getElementById('p-'+b.getAttribute('data-tab'));if(tab)tab.classList.add('on');}};})(bts[i]);}}";
let bl = 0;
const opens = [];
for (let i = 0; i < line.length; i++) {
  const ch = line[i];
  if (ch === '{') { bl++; opens.push({pos: i, depth: bl}); console.log('  {' + bl + ' at pos ' + i); }
  if (ch === '}') { 
    const matched = opens.pop();
    console.log('  } at pos ' + i + ' (matched { at ' + matched.pos + ' depth=' + matched.depth + ') -> ' + (bl-1));
    bl--; 
  }
}
console.log('Final: ' + bl);
if (opens.length > 0) console.log('Unclosed opens:', opens);

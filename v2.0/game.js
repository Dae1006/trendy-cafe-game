/* TRENDY CAFE v2.0 — ALL ENGLISH, ASCII ONLY */

var MENU=[
  {id:'coffee',name:'Black Coffee',price:15,cost:8},
  {id:'milk_coffee',name:'Milk Coffee',price:20,cost:10},
  {id:'tea',name:'Lotus Tea',price:18,cost:9},
  {id:'smoothie',name:'Smoothie',price:25,cost:12},
  {id:'espresso',name:'Espresso',price:30,cost:15}
];

var LOCS=[
  {id:'center',name:'Cafe Shop',maxOrders:5,incomeMod:1.0},
  {id:'park',name:'Park Stand',maxOrders:3,incomeMod:1.2},
  {id:'market',name:'Night Market',maxOrders:8,incomeMod:0.9}
];

var G={coins:500,lv:1,xp:0,xpn:100,day:1,tick:0,orders:[],staff:[{name:'Fresher'}],loc:LOCS[0],weather:'sunny'};
var canvas,ctx,custs=[],parts=[];

function initC(){
  canvas=document.getElementById('scene-canvas');if(!canvas)return;
  canvas.width=480;canvas.height=240;ctx=canvas.getContext('2d');
  for(var i=0;i<3;i++)custs.push({x:Math.random()*400,y:150+Math.random()*20});
}

function render(){
  if(!ctx)return;
  var t=(G.day*24+G.tick/60)%24,g;
  g=ctx.createLinearGradient(0,0,0,canvas.height);
  if(t>6&&t<18){g.addColorStop(0,'#87CEEB');g.addColorStop(1,'#B0C4DE');}
  else{g.addColorStop(0,'#0a0a2e');g.addColorStop(1,'#16213e');}
  ctx.fillStyle=g;ctx.fillRect(0,0,canvas.width,canvas.height);
  ctx.fillStyle='#2a5298';ctx.fillRect(0,160,canvas.width,80);
  ctx.fillStyle=t>6&&t<18?'#FFD700':'#333';ctx.fillRect(100,60,280,100);
  ctx.fillStyle='#654321';ctx.fillRect(200,100,80,60);
  ctx.save();ctx.font='bold 12px Courier New';ctx.textAlign='center';
  ctx.fillStyle=t>6&&t<18?'#fff':'#FFD700';
  ctx.fillText('TRENDY CAFE',240,50);ctx.restore();
  custs.forEach(function(c){c.x+=.3;if(c.x>400)c.x=-10;drawCust(c)});
  if(t<=6||t>=18){ctx.fillStyle='#FFF';for(var i=0;i<20;i++)ctx.fillRect((i*53)%400,(i*27)%100,2,2);}
  parts.forEach(function(p){p.y-=1;p.l--;ctx.save();ctx.font='10px Courier New';ctx.fillStyle='#FFD700';ctx.fillText(p.t,p.x,p.y);ctx.restore();});
  parts=parts.filter(function(p){return p.l>0;});
}

function drawCust(c){
  ctx.fillStyle='#FDBCB4';ctx.beginPath();ctx.arc(c.x+5,c.y-12,8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#8B4513';ctx.fillRect(c.x,c.y-20,10,8);
  ctx.fillStyle='#4169E1';ctx.fillRect(c.x+1,c.y,10,14);
}

function tick(){
  G.tick++;
  if(G.orders.length<G.loc.maxOrders&&Math.random()<.3){
    var item=MENU[Math.floor(Math.random()*MENU.length)];
    G.orders.push({name:item.name,price:item.price,cost:item.cost});
  }
  if(G.staff.length>0&&G.orders.length>0&&Math.random()<.66){
    var o=G.orders.shift();var rev=Math.floor(o.price*G.loc.incomeMod);
    G.coins+=rev;G.xp+=10;parts.push({t:'+ '+rev+' coins',x:240,y:180,l:30});
  }
  if(G.xp>=G.xpn){G.lv++;G.xp=0;G.xpn=Math.floor(G.xpn*1.5);notify('Level up! Lv.'+G.lv);}
}

function notify(m){var n=document.getElementById('notif');if(!n)return;n.textContent=m;n.style.display='block';setTimeout(function(){n.style.display='none'},3000);}

function renderUI(){
  document.getElementById('coins').textContent=Math.floor(G.coins);
  document.getElementById('lv').textContent=G.lv;
  document.getElementById('xp').textContent=G.xp;
  document.getElementById('xpn').textContent=G.xpn;
  document.getElementById('xp-bar').style.width=(G.xp/G.xpn*100)+'%';

  var le=document.getElementById('locs');
  if(le&&le.children.length===0){
    for(var i=0;i<LOCS.length;i++){
      (function(idx){var b=document.createElement('button');b.className='nav-btn'+(G.loc.id===LOCS[idx].id?' on':'');b.textContent=LOCS[idx].name;b.onclick=function(){switchLoc(idx);};le.appendChild(b)})(i);
    }
  }

  var ol=document.getElementById('ol');if(!ol)return;
  ol.innerHTML='';
  if(G.orders.length===0){ol.innerHTML='<div class="card"><span class="name">No new orders</span></div>'}
  else{for(var j=0;j<G.orders.length;j++){var d=document.createElement('div');d.className='card';d.innerHTML='<span class="name">'+G.orders[j].name+'</span><span class="pr">'+G.orders[j].price+' coins</span>';ol.appendChild(d)}}

  var sl=document.getElementById('sll');if(sl&&sl.children.length===0){
    for(var k=0;k<G.staff.length;k++){var d2=document.createElement('div');d2.className='card';d2.innerHTML='<span class="name">'+G.staff[k].name+'</span>';sl.appendChild(d2)}
  }

  var w=document.getElementById('weather');if(w){w.textContent='\u2600 '+G.weather.toUpperCase()}
}

function switchLoc(i){G.loc=LOCS[i];document.getElementById('locs').innerHTML='';renderUI()}
window.closeModal=function(){document.getElementById('modal').classList.add('hidden')};

document.addEventListener('DOMContentLoaded',function(){
  var nav=document.getElementById('nav');if(!nav)return;
  var tabs=[{id:'orders',icon:'\u{1F4CB}',label:'Orders'},{id:'menu',icon:'\u{1F37D}',label:'Menu'},{id:'chart',icon:'\u{1F4CA}',label:'Chart'},{id:'staff',icon:'\u{1F465}',label:'Staff'},{id:'supplier',icon:'\u{1F3ED}',label:'Supply'},{id:'shop',icon:'\u{1F6D2}',label:'Shop'},{id:'items',icon:'\u{1F38E}',label:'Items'},{id:'quests',icon:'\u{1F4CC}',label:'Quest'},{id:'up',icon:'\u2B06',label:'Up'},{id:'achieve',icon:'\u{1F3C6}',label:'Achi'}];
  for(var i=0;i<tabs.length;i++){(function(t){var b=document.createElement('button');b.className='nav-btn'+(t.id==='orders'?' on':'');b.textContent=t.icon+' '+t.label;b.onclick=function(){document.querySelectorAll('.pan').forEach(function(p){p.classList.remove('on')});var el=document.getElementById('p-'+t.id);if(el)el.classList.add('on')};nav.appendChild(b)})(tabs[i])}
});

function init(){initC();renderUI();var ld=document.getElementById('loading');if(ld)ld.style.display='none';
  var last=Date.now(),loop=function(){var now=Date.now();if(now-last>2000){tick();last=now;}render();requestAnimationFrame(loop)};loop();setInterval(renderUI,500)}

window.addEventListener('load',init);

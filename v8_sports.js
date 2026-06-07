// ============ SPORTS EVENTS SYSTEM ============
// Dynamic sports events that trigger fan merchandise trends
// When a team wins a major tournament, their jersey appears as a trend item
const SPORTS_TEAMS = [
  {id:'inter',name:'Inter Milan',icon:'🔵',league:'Serie A',fanBase:'Inter VN Fan Club',color:'#004893',primaryColor:'#004893',secondaryColor:'#000000'},
  {id:'real',name:'Real Madrid',icon:'⚪',league:'La Liga',fanBase:'Madridista VN',color:'#FEBE10',secondaryColor:'#FFFFFF'},
  {id:'barca',name:'Barcelona',icon:'🔴',league:'La Liga',fanBase:'Culés VN',color:'#A50044',secondaryColor:'#004D98'},
  {id:'psg',name:'PSG',icon:'🔵',league:'Ligue 1',fanBase:'Paris VN',color:'#004171',secondaryColor:'#DA291C'},
  {id:'manutd',name:'Manchester United',icon:'🔴',league:'Premier League',fanBase:'Red Devils VN',color:'#DA291C',secondaryColor:'#FBE122'},
  {id:'liverpool',name:'Liverpool',icon:'🔴',league:'Premier League',fanBase:'Kop VN',color:'#C8102E',secondaryColor:'#00B2A9'},
  {id:'vnm',name:'Việt Nam',icon:'🟡',league:'AFF Cup/WC',fanBase:'Tất cả VN',color:'#RED',secondaryColor:'#YELLOW'},
  {id:'japan',name:'Japan',icon:'⚽',league:'WC/AFC',fanBase:'Samurai VN',color:'#002F6C',secondaryColor:'#FFFFFF'},
  {id:'korea',name:'South Korea',icon:'⚽',league:'WC/K League',fanBase:'Hallyu VN',color:'#CD2736',secondaryColor:'#003478'},
  {id:'brazil',name:'Brazil',icon:'🇧🇷',league:'WC',fanBase:'Cruzeiro VN',color:'#009739',secondaryColor:'#FEDD00'},
  {id:'france',name:'France',icon:'🇫🇷',league:'WC',fanBase:'Les Bleus VN',color:'#002395',secondaryColor:'#ED2939'},
  {id:'argentina',name:'Argentina',icon:'🇦🇷',league:'WC',fanBase:'Albiceleste VN',color:'#75AADB',secondaryColor:'#FFFFFF'}
];

// Trigger sports events (simulated world events)
const SPORTS_EVENTS = [
  {id:'inter_scudetto',name:'Inter Milan Scudetto!',team:'inter',icon:'🏆',duration:30,desc:'Inter vô địch Serie A!',fanCustomerRate:0.15,tipBonus:0.10,category:'league'},
  {id:'ucl_final',name:'Champions League Final!',team:'all',icon:'🏆',duration:20,desc:'UCL Final — tất cả fan đến quán!',fanCustomerRate:0.20,tipBonus:0.15,category:'tournament'},
  {id:'worldcup_2026',name:'World Cup 2026!',team:'all',icon:'⚽',duration:45,desc:'World Cup — khách tăng 25%!',fanCustomerRate:0.25,tipBonus:0.20,category:'major'},
  {id:'aff_cup_2026',name:'AFF Cup 2026!',team:'vnm',icon:'🏆',duration:30,desc:'AFF Cup — VN customers +25%!',fanCustomerRate:0.25,tipBonus:0.20,category:'regional'},
  {id:'euro_2028',name:'Euro 2028!',team:'europe',icon:'🏆',duration:35,desc:'Euro 2028 — khách châu Âu!',fanCustomerRate:0.18,tipBonus:0.15,category:'tournament'},
  {id:'realmadrid_champions',name:'Real Madrid Champions!',team:'real',icon:'🏆',duration:25,desc:'Real vô địch UCL!',fanCustomerRate:0.15,tipBonus:0.10,category:'tournament'},
  {id:'barca_clasico',name:'El Clasico Victory!',team:'barca',icon:'🏆',duration:20,desc:'Barca thắng Clasico!',fanCustomerRate:0.12,tipBonus:0.08,category:'league'},
  {id:'messigoat',name:'Messi G.O.A.T.!',team:'argentina',icon:'🐐',duration:60,desc:'Messi G.O.A.T. — khách tăng 20%!',fanCustomerRate:0.20,tipBonus:0.25,category:'legend'},
  {id:'ronaldogoat',name:'Ronaldo G.O.A.T.!',team:'real',icon:'🐐',duration:60,desc:'Ronaldo G.O.A.T. — khách tăng 18%!',fanCustomerRate:0.18,tipBonus:0.20,category:'legend'},
  {id:'neymar_return',name:'Neymar Returns!',team:'psg',icon:'⭐',duration:30,desc:'Neymar trở lại — khách tăng 15%!',fanCustomerRate:0.15,tipBonus:0.12,category:'player'},
  {id:'lakers_win',name:'Lakers NBA Champions!',team:'all',icon:'🏀',duration:20,desc:'Lakers vô địch NBA!',fanCustomerRate:0.10,tipBonus:0.10,category:'other'},
  {id:'tennis_grand',name:'Grand Slam Tennis!',team:'all',icon:'🎾',duration:15,desc:'Grand Slam — khách tennis tăng!',fanCustomerRate:0.08,tipBonus:0.08,category:'other'}
];

// Current active sports event (null = no event)
let currentSportsEvent = null;
let sportsEventTimer = 0;

// Random sports event trigger
function triggerRandomSportsEvent() {
  if (currentSportsEvent) return; // Already have an event
  
  // Higher chance during weekend simulation
  const rand = Math.random();
  if (rand < 0.02) { // 2% chance per tick
    const event = SPORTS_EVENTS[Math.floor(Math.random() * SPORTS_EVENTS.length)];
    currentSportsEvent = {...event, daysLeft: event.duration};
    sportsEventTimer = event.duration;
    notify(`⚽ ${event.desc}`, 5000);
    
    // Trigger fan merchandise unlock temporarily
    const fanItems = ['t_inter','t_real','t_barca','t_psg','t_vnm','t_ucl','t_worldcup','t_taylor','t_netflix','t_livemusic'];
    fanItems.forEach(id => {
      if (!G.trendItems.find(x => x.id === id)) {
        const trendDef = TRENDS.find(x => x.id === id);
        if (trendDef && trendDef.r === 'legend') {
          G.trendItems.push({...trendDef, revenueBonus: 0.15, repBonus: 10});
        }
      }
    });
  }
}

function tickSportsEvent() {
  if (!currentSportsEvent) return;
  
  currentSportsEvent.daysLeft--;
  if (currentSportsEvent.daysLeft <= 0) {
    notify(`📅 ${currentSportsEvent.name} kết thúc!`, 3000);
    currentSportsEvent = null;
    sportsEventTimer = 0;
  }
}

function getFanCustomerModifier() {
  if (!currentSportsEvent) return 1.0;
  return 1.0 + (currentSportsEvent.fanCustomerRate || 0.10);
}

function getFanTipBonus() {
  if (!currentSportsEvent) return 0;
  return currentSportsEvent.tipBonus || 0;
}

// Check if fan customers are available
function hasFanCustomers() {
  return currentSportsEvent && currentSportsEvent.fanCustomerRate > 0;
}

// Get current active event name
function getCurrentEventName() {
  return currentSportsEvent ? currentSportsEvent.name : '';
}

// Get event fan customer rate for UI
function getEventFanRate() {
  return currentSportsEvent ? (currentSportsEvent.fanCustomerRate * 100).toFixed(0) + '%' : '0%';
}

// ============ FAN CUSTOMERS SYSTEM ============
// Special customers based on sports events & trends
const FAN_CUSTOMERS = {
  // Sports fans
  inter_fan: { name:'Inter Fan', icon:'🔵', desc:'Fan Inter Milan', tipMult:1.1, revenueMult:1.05 },
  real_fan: { name:'Real Fan', icon:'⚪', desc:'Fan Real Madrid', tipMult:1.08, revenueMult:1.05 },
  barca_fan: { name:'Barca Fan', icon:'🔴', desc:'Fan Barcelona', tipMult:1.08, revenueMult:1.05 },
  psg_fan: { name:'PSG Fan', icon:'🔵', desc:'Fan PSG', tipMult:1.1, revenueMult:1.05 },
  vnm_fan: { name:'VN Fan', icon:'🟡', desc:'VN Supporter', tipMult:1.15, revenueMult:1.0 },
  ucl_fan: { name:'UCL Fan', icon:'🏆', desc:'Champions League Fan', tipMult:1.12, revenueMult:1.05 },
  // Music fans
  taylor_fan: { name:'Taylor Fan', icon:'🎵', desc:'Taylor Swift Fan', tipMult:1.1, revenueMult:1.0 },
  netflix_fan: { name:'Netflix Fan', icon:'📺', desc:'Netflix Addict', tipMult:1.05, revenueMult:1.0 },
  // K-pop fans
  kpop_fan: { name:'K-Pop Fan', icon:'🎤', desc:'K-Pop Addict', tipMult:1.08, revenueMult:1.0 },
  // Anime fans
  anime_fan: { name:'Anime Fan', icon:'🎌', desc:'Anime Lover', tipMult:1.05, revenueMult:1.0 },
  // Gaming fans
  genshin_fan: { name:'Genshin Fan', icon:'🌟', desc:'Genshin Player', tipMult:1.05, revenueMult:1.0 },
  mlbb_fan: { name:'MLBB Fan', icon:'⚔️', desc:'Mobile Legend Fan', tipMult:1.08, revenueMult:1.0 },
  // Lifestyle
  coffee_fan: { name:'Coffee Addict', icon:'☕', desc:'Cà phê nghiện', tipMult:1.15, revenueMult:1.05 },
  healthy_fan: { name:'Healthy Fan', icon:'🥗', desc:'Healthy Lifestyle', tipMult:1.1, revenueMult:1.0 },
  art_fan: { name:'Art Fan', icon:'🎨', desc:'Art Lover', tipMult:1.05, revenueMult:1.0 },
  music_fan: { name:'Music Fan', icon:'🎶', desc:'Music Lover', tipMult:1.08, revenueMult:1.0 }
};

function getFanCustomerTypes() {
  const types = [];
  
  // Always available
  const alwaysAvailable = ['coffee_fan','healthy_fan','art_fan','music_fan'];
  alwaysAvailable.forEach(id => {
    if (!types.find(t => t.id === id)) types.push({...FAN_CUSTOMERS[id], id});
  });
  
  // Event-dependent
  if (currentSportsEvent) {
    const sportTeams = ['inter_fan','real_fan','barca_fan','psg_fan','vnm_fan','ucl_fan'];
    sportTeams.forEach(id => {
      if (!types.find(t => t.id === id)) types.push({...FAN_CUSTOMERS[id], id});
    });
  }
  
  // Trend-dependent
  if (G.trendItems.find(t => t.id === 't_taylor')) types.push({...FAN_CUSTOMERS.taylor_fan, id:'taylor_fan'});
  if (G.trendItems.find(t => t.id === 't_netflix')) types.push({...FAN_CUSTOMERS.netflix_fan, id:'netflix_fan'});
  if (G.trendItems.find(t => t.id === 't_kpop')) types.push({...FAN_CUSTOMERS.kpop_fan, id:'kpop_fan'});
  if (G.trendItems.find(t => t.id === 't_anime')) types.push({...FAN_CUSTOMERS.anime_fan, id:'anime_fan'});
  if (G.trendItems.find(t => t.id === 't_genshin')) types.push({...FAN_CUSTOMERS.genshin_fan, id:'genshin_fan'});
  if (G.trendItems.find(t => t.id === 't_mlbb')) types.push({...FAN_CUSTOMERS.mlbb_fan, id:'mlbb_fan'});
  
  return types;
}

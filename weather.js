// ============================================
// QUÁN TRENDY CAFÉ v2.0 — WEATHER SYSTEM
// ============================================

const WEATHER_EVENTS = [
  { name: "Tết Nguyên Đán", days: 3, revenueMult: 2.0, customerMult: 1.5, icon: "🧧", startDay: 1 },
  { name: "Valentine", days: 1, revenueMult: 1.5, customerMult: 2.0, icon: "💕", startDay: 14 },
  { name: "Halloween", days: 1, revenueMult: 1.3, customerMult: 1.8, icon: "🎃", startDay: 31 },
  { name: "Black Friday", days: 1, revenueMult: 1.8, customerMult: 1.5, icon: "🏷️", startDay: 29 },
  { name: "Giáng Sinh", days: 3, revenueMult: 1.5, customerMult: 2.0, icon: "🎄", startDay: 25 },
];

const SEASON_WEATHER = {
  summer: { sunny: 0.40, cloudy: 0.25, rainy: 0.15, thunderstorm: 0.10, hot: 0.10 },
  rainy: { sunny: 0.10, cloudy: 0.20, rainy: 0.45, thunderstorm: 0.25, hot: 0.00 },
  cool: { sunny: 0.20, cloudy: 0.35, rainy: 0.20, thunderstorm: 0.05, hot: 0.00, fog: 0.20 }
};

const WEATHER_MAP = {
  sunny: { emoji: "☀️", name: "Nắng", revenueMod: 1.0, desc: "Trời nắng — khách mua nước đá tăng!" },
  cloudy: { emoji: "⛅", name: "Nhiều mây", revenueMod: 1.05, desc: "Trời mát mẻ — thời tiết lý tưởng!" },
  rainy: { emoji: "🌧️", name: "Mưa", revenueMod: 0.75, desc: "Mưa lớn — khách giảm, nước nóng bán chạy!" },
  thunderstorm: { emoji: "⛈️", name: "Dông bão", revenueMod: 0.4, desc: "Dông bão! Rất ít khách!" },
  hot: { emoji: "🔥", name: "Nóng gay gắt", revenueMod: 1.15, desc: "Nóng khủng khiếp! Nước đá cháy hàng!" },
  fog: { emoji: "🌫️", name: "Sương mù", revenueMod: 0.85, desc: "Sương mù — khách giảm!" },
  tet: { emoji: "🎊", name: "Tết", revenueMod: 2.5, desc: "Tết đến rồi! Khách đông, giá cao!" }
};

function getSeason() {
  const cycle = gameState.gameDay % 180;
  if (cycle < 60) return 'summer';
  if (cycle < 120) return 'rainy';
  return 'cool';
}

function getCurrentWeather() {
  const season = getSeason();
  const probs = SEASON_WEATHER[season];
  const rand = Math.random();
  let cum = 0;
  for (const [type, prob] of Object.entries(probs)) {
    cum += prob;
    if (rand <= cum) {
      return { ...WEATHER_MAP[type], type, season };
    }
  }
  return { ...WEATHER_MAP.sunny, type: 'sunny', season };
}

function getWeatherForecast(days) {
  const forecast = [];
  for (let i = 1; i <= days; i++) {
    const futureDay = gameState.gameDay + i;
    const cycle = futureDay % 180;
    let season = cycle < 60 ? 'summer' : (cycle < 120 ? 'rainy' : 'cool');
    const probs = SEASON_WEATHER[season];
    const rand = Math.random();
    let cum = 0;
    let type = 'sunny';
    for (const [t, prob] of Object.entries(probs)) {
      cum += prob;
      if (rand <= cum) { type = t; break; }
    }
    forecast.push({
      day: futureDay,
      ...WEATHER_MAP[type],
      type: type,
      season: season,
    });
  }
  return forecast;
}

function getActiveEvent() {
  for (const event of WEATHER_EVENTS) {
    const dayInEvent = gameState.gameDay - event.startDay;
    if (dayInEvent >= 0 && dayInEvent < event.days) {
      return { ...event, remainingDays: event.days - dayInEvent };
    }
  }
  return null;
}

function applyWeatherEffects() {
  const weather = getCurrentWeather();
  const event = getActiveEvent();
  
  let revenueMod = weather.revenueMod;
  let customerMod = 1;
  
  if (event) {
    revenueMod *= event.revenueMult;
    customerMod *= event.customerMult;
  }
  
  return { revenueMod, customerMod };
}

function renderWeatherForecast() {
  const forecast = getWeatherForecast(3);
  const el = document.getElementById("weather-forecast");
  if (!el) return;
  
  el.innerHTML = forecast.map(f => 
    `<span style="margin-right:8px;">${f.emoji} N${f.day}</span>`
  ).join("");
}

// Initialize
if (typeof gameState.reputation !== 'undefined') {
  reputation = gameState.reputation;
}

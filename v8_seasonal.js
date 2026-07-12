// ============ SEASONAL MENU ROTATION SYSTEM ============
// Like weather, menu trends rotate and affect what customers order
const SEASONAL_MENUS = {
  // Spring (Mar-May): Light, fresh items
  spring: {
    name: 'Xuân',
    emoji: '🌸',
    demandShift: { latte: 1.3, matcha: 1.2, bubble_tea: 1.1, smoothie: 1.5, cheese_cake: 1.2 },
    newItems: ['rose_latte','coconut_latte','yuzu_coffee'],
    description: 'Xuân về — trà & đồ uống nhẹ hot!'
  },
  // Summer (Jun-Aug): Icy, bold flavors
  summer: {
    name: 'Hè',
    emoji: '☀️',
    demandShift: { iced: 1.8, bubble_tea: 1.4, smoothie: 1.6, mocha: 1.3 },
    newItems: ['durian_latte','salt_coffee','coconut_coffee'],
    description: 'Hè nắng — đồ uống lạnh cháy hàng!'
  },
  // Autumn (Sep-Nov): Warm, rich flavors
  autumn: {
    name: 'Thu',
    emoji: '🍂',
    demandShift: { hot: 1.5, espresso: 1.4, tiramisu: 1.3, black_coffee: 1.3 },
    newItems: ['egg_coffee','avocado_toast','croissant_art'],
    description: 'Thu về — cà phê nóng & bánh hot!'
  },
  // Winter (Dec-Feb): Comfort, holiday items
  winter: {
    name: 'Đông',
    emoji: '❄️',
    demandShift: { hot: 1.8, caramel_latte: 1.6, cheesecake: 1.4, croissant: 1.3 },
    newItems: ['hot_chocolate','pumpkin_spice','mocha_frappe'],
    description: 'Đông lạnh — đồ uống nóng & bánh hot!'
  }
};

let currentSeason = 'spring';
let currentSeasonDay = 0;
const SEASON_LENGTH = 90; // 90 game days per season

function getCurrentSeason(day) {
  const cycle = day % (SEASON_LENGTH * 4);
  if (cycle < SEASON_LENGTH) return 'spring';
  if (cycle < SEASON_LENGTH * 2) return 'summer';
  if (cycle < SEASON_LENGTH * 3) return 'autumn';
  return 'winter';
}

function getSeasonalDemand(menuId) {
  const season = SEASONAL_MENUS[currentSeason];
  if (!season) return 1.0;
  return season.demandShift[menuId] || 1.0;
}

function getSeasonalNewItems() {
  return SEASONAL_MENUS[currentSeason]?.newItems || [];
}

function getSeasonEmoji() {
  return SEASONAL_MENUS[currentSeason]?.emoji || '🌸';
}

function getSeasonName() {
  return SEASONAL_MENUS[currentSeason]?.name || 'Xuân';
}

function getSeasonDescription() {
  return SEASONAL_MENUS[currentSeason]?.description || '';
}

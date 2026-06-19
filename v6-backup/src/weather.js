/**
 * Weather System — Realistic Vietnamese climate simulation
 * 
 * Weather affects:
 * - Customer count (rain = -40%, hot = +20%)
 * - Menu demand (rain = hot drinks up, hot = iced drinks up)
 * - Supply costs (rain = delivery delays, hot = ice shortage)
 * - Revenue multiplier
 * 
 * Vietnamese weather patterns:
 * - Summer (Mar-Sep): Hot & sunny, occasional thunderstorms
 * - Rainy (Oct-Dec): Heavy rain, flooding potential
 * - Cool (Dec-Feb): Lower traffic, warm drinks sell well
 */

export const WEATHER_TYPES = {
    sunny: {
        id: 'sunny',
        emoji: '☀️',
        name: 'Nắng',
        customerMod: 1.0,
        revenueMod: 1.0,
        supplyMod: 1.0, // supply cost multiplier
        demandShift: { iced: 1.3, hot: 0.8 },
        iceConsumption: 1.5,
        description: 'Trời nắng — khách mua nước đá tăng!'
    },
    cloudy: {
        id: 'cloudy',
        emoji: '⛅',
        name: 'Nhiều mây',
        customerMod: 1.1,
        revenueMod: 1.05,
        supplyMod: 1.0,
        demandShift: { iced: 1.1, hot: 1.0 },
        iceConsumption: 1.1,
        description: 'Trời mát mẻ — thời tiết lý tưởng!'
    },
    rainy: {
        id: 'rainy',
        emoji: '🌧️',
        name: 'Mưa',
        customerMod: 0.6,
        revenueMod: 0.75,
        supplyMod: 1.3, // delivery costs +30%
        demandShift: { iced: 0.4, hot: 1.5 },
        iceConsumption: 0.5,
        description: 'Mưa lớn — khách giảm, nước nóng bán chạy!'
    },
    thunderstorm: {
        id: 'thunderstorm',
        emoji: '⛈️',
        name: 'Dông bão',
        customerMod: 0.3,
        revenueMod: 0.4,
        supplyMod: 1.8,
        demandShift: { iced: 0.2, hot: 1.8 },
        iceConsumption: 0.3,
        description: 'Dông bão! Rất ít khách — tập trung giao hàng!'
    },
    hot: {
        id: 'hot',
        emoji: '🔥',
        name: 'Nóng gay gắt',
        customerMod: 1.2,
        revenueMod: 1.15,
        supplyMod: 1.2,
        demandShift: { iced: 2.0, hot: 0.5 },
        iceConsumption: 2.0,
        description: 'Nóng khủng khiếp! Nước đá cháy hàng!'
    },
    tet: {
        id: 'tet',
        emoji: '🎊',
        name: 'Tết Nguyên Đán',
        customerMod: 2.0,
        revenueMod: 2.5,
        supplyMod: 1.5,
        demandShift: { iced: 1.0, hot: 1.2 },
        iceConsumption: 1.0,
        description: 'Tết đến rồi! Khách đông, giá cao!'
    }
};

// Vietnamese seasonal weather probabilities
export const SEASON_WEATHER = {
    summer: { // Mar - Sep
        sunny: 0.35,
        cloudy: 0.25,
        rainy: 0.20,
        thunderstorm: 0.10,
        hot: 0.10,
        tet: 0.00
    },
    rainy: { // Oct - Dec
        sunny: 0.10,
        cloudy: 0.15,
        rainy: 0.45,
        thunderstorm: 0.20,
        hot: 0.00,
        tet: 0.10
    },
    cool: { // Dec - Feb (Tết period)
        sunny: 0.15,
        cloudy: 0.30,
        rainy: 0.15,
        thunderstorm: 0.05,
        hot: 0.00,
        tet: 0.35
    }
};

export class WeatherSystem {
    constructor() {
        this.currentWeather = null;
        this.currentSeason = 'summer';
        this.gameDay = 1;
        this.lastWeatherChangeDay = 0;
        this.weatherStreak = 0; // track consecutive same weather
    }

    /** Get current season based on game day */
    getSeason() {
        // Simplified: cycle every 60 game days
        const cycle = this.gameDay % 180;
        if (cycle < 60) return 'summer';
        if (cycle < 120) return 'rainy';
        return 'cool';
    }

    /** Generate weather for a given day */
    generateWeather(day) {
        this.currentSeason = this.getSeason();
        this.gameDay = day;
        
        const probs = SEASON_WEATHER[this.currentSeason];
        const rand = Math.random();
        
        let cumulative = 0;
        for (const [type, prob] of Object.entries(probs)) {
            cumulative += prob;
            if (rand <= cumulative) {
                this.currentWeather = WEATHER_TYPES[type];
                return this.currentWeather;
            }
        }
        
        // Default fallback
        this.currentWeather = WEATHER_TYPES.sunny;
        return this.currentWeather;
    }

    /** Apply weather modifiers to customer count */
    applyCustomerModifier(baseCount) {
        if (!this.currentWeather) return baseCount;
        return Math.floor(baseCount * this.currentWeather.customerMod);
    }

    /** Apply weather modifiers to revenue */
    applyRevenueModifier(baseRevenue) {
        if (!this.currentWeather) return baseRevenue;
        return Math.floor(baseRevenue * this.currentWeather.revenueMod);
    }

    /** Get demand shift for menu items */
    getMenuDemandShift() {
        if (!this.currentWeather) return { iced: 1.0, hot: 1.0 };
        return this.currentWeather.demandShift;
    }

    /** Check if special event is active */
    isEventDay(type) {
        return this.currentWeather && this.currentWeather.id === type;
    }

    /** Get weather-based CSS class for UI */
    getBgClass() {
        if (!this.currentWeather) return '';
        const map = {
            sunny: 'weather-sunny',
            cloudy: 'weather-cloudy',
            rainy: 'weather-rainy',
            thunderstorm: 'weather-thunderstorm',
            hot: 'weather-hot',
            tet: 'weather-tet'
        };
        return map[this.currentWeather.id] || '';
    }

    /** Save weather state */
    save() {
        return JSON.stringify({
            currentWeather: this.currentWeather,
            currentSeason: this.currentSeason,
            gameDay: this.gameDay,
            lastWeatherChangeDay: this.lastWeatherChangeDay
        });
    }

    /** Load weather state */
    load(data) {
        const parsed = JSON.parse(data);
        Object.assign(this, parsed);
        // Restore weather type object
        this.currentWeather = WEATHER_TYPES[this.currentWeather.id] || null;
    }
}

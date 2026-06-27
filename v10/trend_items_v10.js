/**
 * TREND_ITEMS_V10 - Trending Topic Integration Items for Trendy Cafe v10
 * 
 * Each item represents a real-time trending topic that can be integrated
 * into the game as a decoration, recipe, or event trigger.
 * 
 * Balance: Max single-effect buff is +35%, costs scale with rarity.
 * Triggers mix random and calendar-based for variety.
 */

const TREND_ITEMS_V10 = [
    // === Trend 1: World Cup 2026 - Round of 32 ===
    {
        id: "trend_wc_cup",
        name: "WC Cup Trophy",
        icon: "🏆",
        rarity: "epic",
        type: "decoration",
        effect: "all",
        value: 25,
        desc: "Mini World Cup trophy on counter. +25% revenue & +30% customers during live matches.",
        cost: 15000,
        dialogueVariants: [
            "Bọn mình cá kèo Anh thắng luôn á! Nếu trúng tui đãi cafe cả tiệm!",
            "Khứi... tui xem bóng đến giờ mắt mờ hết rồi, cho em cà phê đen extra mạnh đi.",
            "Trận Anh vs Panama này chắc phải có Var controversy rồi nhỉ?",
            "Ai cũng đặt kèo cả, khách tới quán hỏi 'phục vụ ơi trận này tỷ số bao nhiêu?' liên tục!",
            "Bong da mà uống cafe mới đã đời! Tui gọi 3 ly nha!"
        ],
        eventTrigger: {
            type: "conditional",
            condition: "world_cup_live_matches_active",
            duration_minutes: 150,    // 2.5 hours around each match
            window_before_minutes: 120,
            window_after_minutes: 30,
            activation_chance_daily: 0.15,
        },
        visualDescription: "Pixel art World Cup trophy with golden glow pulsing on counter. TV overlay shows live mini-scoreboard. Confetti particles during goals.",
    },

    // === Trend 2: Pension +8% Raise ===
    {
        id: "trend_pension_cafe",
        name: "Trọn Đời Rảnh Cafe Set",
        icon: "☕👴",
        rarity: "rare",
        type: "recipe",
        effect: "revenue",
        value: 15,
        desc: "Premium senior combo (coffee + bread + mung bean). +15% revenue from customers aged 55+.",
        cost: 5000,
        dialogueVariants: [
            "Từ tháng 7 tui được tăng lương rồi! Đi cafe sang chảnh nè!",
            "Lương hưu lên 8% nhưng cà phê cũng... không thấy giảm giá nhỉ?",
            "Giáo viên mầm non bây giờ cũng 1.7 triệu cơ à? Càng phải uống cafe cho vui!",
            "Mẹ tui mới về hưu, bà nói: 'Đi cà phê đi con!' — nhưng ví bà trống không.",
            "Tăng lương hưu rồi! Hôm nay anh em đãi! Lọm lại!"
        ],
        eventTrigger: {
            type: "calendar",
            start_day: 1,
            end_day: 15,
            month: 7,
            duration_days: 14,
            off_season_chance_daily: 0.05,
        },
        visualDescription: "Vintage wooden table set with crystal teapot, buttered bread, mung bean bowl. Warm brown tones. Floating '8%' icon above table.",
    },

    // === Trend 3: Strawberry Moon ===
    {
        id: "trend_strawberry_moon",
        name: "Strawberry Moon Latte",
        icon: "🌕🍓",
        rarity: "legendary",
        type: "recipe",
        effect: "all",
        value: 20,
        desc: "Night-exclusive purple-pink latte. +20% revenue during nighttime (20:00-04:00).",
        cost: 8000,
        dialogueVariants: [
            "Em nhìn trăng từ ban công — đỏ hồng như dâu thật luôn! Có cafe vị dâu không?",
            "Strawberry Moon mà không có cafe matcha thì tiếc quá!",
            "Trăng sáng thế này đi cà phê vỉa hè mới đã. Quán mình cũng okay phết.",
            "Bọn mình chụp ảnh trăng rồi dẫn nhau tới đây! Selfie với cửa sổ nhìn trăng!",
            "Full moon + strawberry latte = perfect night vibes ✨"
        ],
        eventTrigger: {
            type: "lunar_cycle",
            phase: "full_moon",
            window_days_before_after: 1,   // 3 nights total
            trigger_radius_days: 3,
        },
        visualDescription: "Gradient purple-pink-white latte cup. Moonlight particles falling from ceiling to tables. Window shows moon phase overlay. Background shifts to deep night blue.",
    },

    // === Trend 4: Split Bill Drama ===
    {
        id: "trend_split_bill",
        name: "Split Bill Machine",
        icon: "💸✂️",
        rarity: "rare",
        type: "decoration",
        effect: "customers",
        value: 20,
        desc: "Mini split-bill counter. +20% group size draw (groups of 3+). Coins particle effects.",
        cost: 3000,
        dialogueVariants: [
            "Tụi em chia đôi hóa đơn nha! Mỗi người 80k — công bằng mà?",
            "Trước tui toàn kẻ chờ trả tiền... giờ học cách tính split bill rồi!",
            "Hóa đơn tới đây phải ghi rõ từng món, đừng như vụ 'bạn bỏ lại với hóa đơn 16 triệu' ấy!",
            "Ở Mỹ có Venmo, Việt Nam có splitbill.vn — nhưng ở quán mình thì phục vụ tính giùm đi!",
            "Tính tiền cho tụi em nè, chia làm 4 người nha!"
        ],
        eventTrigger: {
            type: "schedule",
            active_days: ["fri", "sat", "sun"],
            peak_hours_start: 18,
            peak_hours_end: 22,
            daily_chance_weekday: 0.05,
            daily_chance_weekend: 0.10,
        },
        visualDescription: "Neon-blue mini POS machine showing 'SPLIT = 2'. ✂️ icon floating. Golden coin particles when customers pay. Bright neon colors, cheerful vibe.",
    },

    // === Trend 5: Fanta Vanilla Cherry Spritz ===
    {
        id: "trend_fanta_spritz",
        name: "Vanilla Cherry Coffee Spritz",
        icon: "🍒🥤",
        rarity: "epic",
        type: "recipe",
        effect: "revenue",
        value: 18,
        desc: "Limited-time Fanta-inspired cherry-vanilla coffee. +18% revenue, popular with teens-young adults.",
        cost: 6000,
        dialogueVariants: [
            "Mới thử Fanta vanilla cherry ở Mỹ — ngon lắm! Cho em làm phiên bản cafe kết hợp!",
            "Vanilla + cherry + coffee... nghe như cocktail vậy. Nhưng mà lạ lắm!",
            "Fanta mới ra flavor này hot quá! Ở quán mình có uống soda vị cherry không?",
            "Limited edition mà? Phải chụp ảnh đăng mạng ngay, đừng để hết giờ!",
            "Cherry + vanilla = combo ngọt ngào cho buổi chiều! Order 2 ly nha!"
        ],
        eventTrigger: {
            type: "random",
            interval_days: 14,
            activation_chance: 0.20,
            duration_min_days: 3,
            duration_max_days: 7,
        },
        visualDescription: "Tall soda glass with cherry on top, rising bubble particles. Red-pink-white gradient. 'LIMITED EDITION' flashing on menu board. Spritz sound effect on preparation.",
    },

    // === Trend 6: Strategic Bomber (Geopolitical) ===
    {
        id: "trend_strategic_bomber",
        name: "War Room Map Display",
        icon: "🗺️🛩️",
        rarity: "uncommon",
        type: "decoration",
        effect: "all",
        value: 10,
        desc: "Mini strategic map with dashed flight paths. +10% all stats (balanced). Military aesthetic.",
        cost: 2500,
        dialogueVariants: [
            "Nghe tin máy bay ném bom mới của Nga... cafe mà vẫn lo thế giới.",
            "Thế giới loạn lắm nhưng cà phê thì không bao giờ lỗi thời.",
            "Bọn tui xem tin tức xong — chỉ muốn về nhà uống nước. À nhầm, đến quán mình uống!",
            "Tin chiến sự căng thẳng quá... cần một ly cafe ấm áp để bình tâm lại.",
            "Đứng ngồi không yên vì tin tức. Ghé quán cho đỡ căng thẳng."
        ],
        eventTrigger: {
            type: "random",
            daily_chance: 0.05,
            duration_hours: 4,
        },
        visualDescription: "Olive-green mini world map with dashed airplane flight lines. 🛩️ icon circling the map. Serious but not scary tone. Muted military colors.",
    },

    // === Trend 7: Marvel Rivals Summer Festival ===
    {
        id: "trend_marvel_summer",
        name: "Hero Summer Coffee Blend",
        icon: "🦸‍♂️☕",
        rarity: "epic",
        type: "recipe",
        effect: "customers",
        value: 25,
        desc: "Superhero-themed coffee. +25% customer draw from gaming community.",
        cost: 7000,
        dialogueVariants: [
            "Tui chơi Marvel Rivals suốt ngày — nhân vật mới đẹp lắm! Cà phê cho tỉnh táo tiếp.",
            "Swimsuit skin trong game đẹp hơn cà phê của quán... đùa đấy, quán mình chill nhất!",
            "Team-up với bạn bè xong ghé quán uống nước. Like Avengers mà không cần Infinity Stones.",
            "Mới unlock được character mới! Giải trí bằng cafe trước khi chơi tiếp!",
            "Gamer quán mình đông rồi nè, có ai trong hội không?"
        ],
        eventTrigger: {
            type: "fixed_calendar",
            interval_days: 21,
            duration_days: 3,
        },
        visualDescription: "Coffee cup with shield logo foam art. Marvel blue-pink color background. 'Superhero sparkles' particle effects around the shop.",
    },

    // === Trend 8: Concert Thanh Xuân 2026 ===
    {
        id: "trend_concert",
        name: "Thanh Xuân Stage Decor",
        icon: "🎤✨",
        rarity: "legendary",
        type: "decoration",
        effect: "customers",
        value: 35,
        desc: "Mini concert stage on counter. +35% customers & +40% tips during concert days.",
        cost: 12000,
        unlock_alternative: {
            type: "achievement",
            name: "Fan Club",
            requirement: "serve_music_related_dialogue_50times",
        },
        dialogueVariants: [
            "Chiều nay đi xem HIEUTHUHAI concert xong ghé quán đây! Fanboy fanclub đông lắm!",
            "Anh trai say hi! Tui thuộc hết lời rồi — cho em cafe extra để hát tiếp tối nay!",
            "Check-in concert Thanh Xuân rồi, giờ check-in quán cafe — double check-in!",
            "Đợi ca sĩ ra trường quay luôn nè, nhưng trước tiên gọi 2 trà sữa!",
            "Concert mà không có cafe thì như nào! Tụi mình chọn quán này smart thật!"
        ],
        eventTrigger: {
            type: "admin_configurable",
            duration_before_hours: 48,
            duration_during: "full_day",
            duration_after_hours: 48,
        },
        visualDescription: "Mini stage with microphone stand, speaker stacks, neon purple/pink/yellow lights. Stage light beams sweep across shop every few seconds. Crowd emoji 👥🎉 above customers.",
    },

    // === Trend 9: Vietlott 10Billion Win ===
    {
        id: "trend_vietlott",
        name: "Lucky Lottery Ticket",
        icon: "🍀☘️",
        rarity: "rare",
        type: "event",
        effect: "all",
        value: 12,
        desc: "Mini lucky draw every 2 hours. +12% all stats during active period.",
        cost: 4000,
        dialogueVariants: [
            "Em vừa trúng Vietlott! Nhưng chưa mở ra đâu... biết đâu trúng lớn thì mời cả quán喝咖啡!",
            "Trúng 10 tỷ mà? Để em làm ăn lớn — xây lại quán cà phê này luôn!",
            "Mua vé số trên điện thoại cũng trúng được á? Thế thì tui mua mỗi ngày!",
            "Xổ số là nghề phụ, cà phê mới là đam mê! Nhưng mà trúng thì cũng tốt.",
            "Vé số đây rồi! Trúng bao nhiêu thì đãi quán bấy nhiêu nha!"
        ],
        eventTrigger: {
            type: "random",
            daily_chance: 0.03,
            duration_hours: 6,
            boost_days: [2, 12, 22], // lotto draw days
            boost_chance: 0.08,
        },
        visualDescription: "Red-white lottery ticket with ☘️ icon. Golden-lucky glow around ticket. Falling gold coin particles when customers 'win'. Sparkle effects.",
    },

    // === Trend 10: Extreme Heat + Strawberry Moon Combo ===
    {
        id: "trend_extreme_heat",
        name: "Cooling Cave Decor",
        icon: "🧊❄️",
        rarity: "rare",
        type: "decoration",
        effect: "customers",
        value: 20,
        desc: "Ice cave oasis. +20% customer draw during heat waves (>35°C). Frost overlay effects.",
        cost: 4500,
        dialogueVariants: [
            "Nóng quá trời! Cho em đá lạnh extra, không thì tan chảy mất.",
            "Trăng Dâu mà trời nóng như vậy... xem từ máy lạnh quán mình vậy!",
            "Extreme heat warning mà vẫn muốn uống nước. Phép màu của cà phê!",
            "Ra đường là cháy da, vào quán là sống lại! Cảm ơn shop!",
            "Nóng 40 độ mà vẫn thấy quán mình cool ngầu."
        ],
        eventTrigger: {
            type: "weather_manual",
            temperature_threshold_celsius: 35,
            auto_detect_supported: true,
            duration_until_temp_drops: true,
        },
        visualDescription: "Blue ice cave mini with waterfall. Ice crystal sparkles everywhere. Frost overlay on shop screen. Customer sprites with 🥶 icon above heads. Cold blue tone vs hot orange outside.",
    },
];

// =====================================================
// HELPER: Trend detection and integration logic
// =====================================================

/**
 * Check if a trend should be active right now.
 * Returns array of { itemId, confidence, remainingDurationMinutes }
 */
function getActiveTrends() {
    const active = [];
    const now = new Date();
    
    for (const item of TREND_ITEMS_V10) {
        if (!item.eventTrigger) continue;
        
        let shouldActivate = false;
        let confidence = 0;
        
        switch (item.eventTrigger.type) {
            case "conditional":
                // World Cup matches - check if any match is happening
                if (isMatchActive()) {
                    shouldActivate = true;
                    confidence = 0.9;
                }
                break;
                
            case "calendar":
                if (now.getDate() >= item.eventTrigger.start_day && 
                    now.getDate() <= item.eventTrigger.end_day &&
                    now.getMonth() === item.eventTrigger.month - 1) {
                    shouldActivate = true;
                    confidence = 1.0;
                }
                break;
                
            case "lunar_cycle":
                if (isLunarPhaseFullMoon()) {
                    shouldActivate = true;
                    confidence = 0.95;
                }
                break;
                
            case "schedule":
                const dayOfWeek = ['sun','mon','tue','wed','thu','fri','sat'][now.getDay()];
                if (item.eventTrigger.active_days.includes(dayOfWeek)) {
                    shouldActivate = true;
                    confidence = 0.85;
                }
                break;
                
            case "random":
                if (Math.random() < item.daily_chance || Math.random() < item.activation_chance) {
                    shouldActivate = true;
                    confidence = 0.5 + Math.random() * 0.3;
                }
                break;
                
            case "fixed_calendar":
                // Every N days
                const dayOfYear = getDayOfYear(now);
                if (dayOfYear % item.interval_days < 1) {
                    shouldActivate = true;
                    confidence = 0.9;
                }
                break;
                
            case "admin_configurable":
                // Controlled by admin date picker - default active
                shouldActivate = true;
                confidence = 1.0;
                break;
                
            case "weather_manual":
                const temp = getExternalTemperature();
                if (temp >= item.temperature_threshold_celsius) {
                    shouldActivate = true;
                    confidence = Math.min(1.0, temp / 50);
                }
                break;
        }
        
        if (shouldActivate) {
            active.push({
                itemId: item.id,
                item: item,
                confidence: confidence,
            });
        }
    }
    
    return active.sort((a, b) => b.confidence - a.confidence);
}

/**
 * Get bonus multiplier for an active trend
 */
function getTrendBonus(itemId) {
    const item = TREND_ITEMS_V10.find(t => t.id === itemId);
    if (!item) return 1.0;
    
    switch (item.effect) {
        case 'revenue': return 1 + (item.value / 100);
        case 'customers': return 1 + (item.value / 100);
        case 'all': return 1 + (item.value / 100);
        default: return 1.0;
    }
}

/**
 * Get random customer dialogue for a trend
 */
function getTrendDialogue(itemId) {
    const item = TREND_ITEMS_V10.find(t => t.id === itemId);
    if (!item || !item.dialogueVariants) return null;
    return item.dialogueVariants[Math.floor(Math.random() * item.dialogueVariants.length)];
}

// --- Stub functions (replace with actual implementations) ---
function isMatchActive() { return false; } // TODO: Connect to real match schedule API
function isLunarPhaseFullMoon() { return false; } // TODO: Lunar calendar calculation
function getExternalTemperature() { return 32; } // TODO: Weather API integration
function getDayOfYear(date) { return Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 86400000); }

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { TREND_ITEMS_V10, getActiveTrends, getTrendBonus, getTrendDialogue };
}

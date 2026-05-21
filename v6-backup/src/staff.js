/**
 * Staff System — Realistic Vietnamese café staff management
 * 
 * Features:
 * - Staff with skills, mood, loyalty
 * - Mood affects performance
 * - Turnover risk when mood is low
 * - Training system to improve skills
 * - Salary management
 */

export const STAFF_TIERS = [
    {
        id: 'fresher',
        name: 'Fresher Barista',
        emoji: '🎓',
        baseSalary: 7000000,
        brewSpeed: 0.5,
        quality: 0.4,
        service: 0.3,
        loyalty: 0.5,
        description: 'Mới ra trường — nhiệt huyết nhưng chậm'
    },
    {
        id: 'junior',
        name: 'Junior Barista',
        emoji: '☕',
        baseSalary: 9000000,
        brewSpeed: 0.7,
        quality: 0.6,
        service: 0.5,
        loyalty: 0.6,
        description: 'Đã có kinh nghiệm — khá ổn'
    },
    {
        id: 'senior',
        name: 'Senior Barista',
        emoji: '👨‍🍳',
        baseSalary: 13000000,
        brewSpeed: 0.9,
        quality: 0.8,
        service: 0.8,
        loyalty: 0.7,
        description: 'Lão làng — làm việc cực hiệu quả'
    },
    {
        id: 'master',
        name: 'Master Barista',
        emoji: '🏆',
        baseSalary: 22000000,
        brewSpeed: 1.0,
        quality: 1.0,
        service: 1.0,
        loyalty: 0.8,
        description: 'Vua cà phê — chế được mọi loại đồ uống!'
    }
];

// Random events that affect staff mood
const STAFF_EVENTS = [
    { name: 'Được khách khen!', moodChange: 15, probability: 0.05 },
    { name: 'Có khách khó tính mắng', moodChange: -20, probability: 0.03 },
    { name: 'Bạn bè rủ đi chơi', moodChange: 10, probability: 0.02 },
    { name: 'Mệt vì làm việc quá giờ', moodChange: -10, probability: 0.04 },
    { name: 'Nhận được tip!', moodChange: 8, probability: 0.06 },
    { name: 'Thời tiết tốt, tâm trạng vui', moodChange: 5, probability: 0.03 },
    { name: 'Bị đồng nghiệp làm phiền', moodChange: -8, probability: 0.02 },
    { name: 'Được huấn luyện thêm', moodChange: 5, probability: 0.01 }
];

export class StaffMember {
    constructor(tierId) {
        const tier = STAFF_TIERS.find(t => t.id === tierId);
        this.id = 'staff_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
        this.name = this.generateName();
        this.tier = tierId;
        this.brewSpeed = tier.brewSpeed;
        this.quality = tier.quality;
        this.service = tier.service;
        this.loyalty = tier.loyalty;
        this.salary = tier.baseSalary;
        this.mood = 70; // starts at 70%
        this.daysWorked = 0;
        this.totalServed = 0;
        this.trainingPoints = 0;
    }

    generateName() {
        const firstNames = ['Lan', 'Hùng', 'Mai', 'Dũng', 'Hoa', 'Minh', 'Tuấn', 'Hương', 'Nam', 'Giang', 'Khoa', 'Trang', 'Phong', 'Linh', 'Hải'];
        const lastNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Huỳnh', 'Phan', 'Vũ', 'Võ', 'Đặng', 'Bùi', 'Dương', 'Hồ', 'Ngô', 'Đoàn'];
        const first = firstNames[Math.floor(Math.random() * firstNames.length)];
        const last = lastNames[Math.floor(Math.random() * lastNames.length)];
        return last + ' ' + first;
    }

    /** Apply mood changes from events */
    applyEvent() {
        for (const event of STAFF_EVENTS) {
            if (Math.random() < event.probability) {
                this.mood = Math.max(0, Math.min(100, this.mood + event.moodChange));
                return event;
            }
        }
        return null;
    }

    /** Daily tick — natural mood decay/growth */
    dailyTick() {
        this.daysWorked++;
        
        // Slight decay each day
        this.mood = Math.max(0, this.mood - 1);
        
        // Training progress
        if (this.trainingPoints > 0) {
            this.trainingPoints--;
            if (this.trainingPoints <= 0) {
                // Training complete — promote!
                this.promote();
            }
        }
        
        // Loyalty check
        if (this.mood < 30 && Math.random() < 0.01 * (1 - this.loyalty)) {
            return { type: 'quit', reason: `${this.name} nghỉ việc vì không hài lòng!` };
        }
        
        return null;
    }

    /** Apply training boost */
    train() {
        if (this.trainingPoints > 0) return 'Đang đào tạo!';
        this.trainingPoints = 3; // 3 days to train
        return `${this.name} đang được đào tạo (3 ngày)`;
    }

    /** Check if can promote */
    canPromote() {
        if (this.daysWorked < 5) return false;
        if (this.mood < 50) return false;
        
        if (this.tier === 'fresher' && this.quality >= 0.55) return 'junior';
        if (this.tier === 'junior' && this.quality >= 0.7 && this.daysWorked >= 10) return 'senior';
        if (this.tier === 'senior' && this.quality >= 0.9 && this.daysWorked >= 20) return 'master';
        return false;
    }

    /** Promote staff */
    promote() {
        const newTier = this.canPromote();
        if (!newTier) return null;
        
        const tier = STAFF_TIERS.find(t => t.id === newTier);
        this.tier = newTier;
        this.brewSpeed = tier.brewSpeed;
        this.quality = tier.quality;
        this.service = tier.service;
        this.loyalty = tier.loyoyalty;
        this.salary = tier.baseSalary;
        this.mood = Math.min(100, this.mood + 10); // promotion boosts mood!
        return tier.name;
    }

    /** Get performance multiplier based on mood */
    getPerformance() {
        const moodMod = this.mood / 100;
        return {
            brewSpeed: this.brewSpeed * (0.5 + moodMod * 0.5),
            quality: this.quality * (0.5 + moodMod * 0.5),
            service: this.service * (0.5 + moodMod * 0.5)
        };
    }

    save() {
        return JSON.stringify({
            id: this.id,
            name: this.name,
            tier: this.tier,
            brewSpeed: this.brewSpeed,
            quality: this.quality,
            service: this.service,
            loyalty: this.loyalty,
            mood: this.mood,
            daysWorked: this.daysWorked,
            totalServed: this.totalServed,
            trainingPoints: this.trainingPoints,
            salary: this.salary
        });
    }

    load(data) {
        const parsed = JSON.parse(data);
        Object.assign(this, parsed);
    }
}

/** Generate customer feedback based on staff performance */
export function generateCustomerFeedback(staff, weather, supplierQuality) {
    const perf = staff.getPerformance();
    const baseScores = {
        taste: (perf.quality * 20 + supplierQuality * 15) / 35,
        service: perf.service,
        ambiance: 0.7, // static for now
        value: 0.6 // base value
    };
    
    // Weather affects ambiance
    if (weather && weather.id === 'rainy') baseScores.ambiance = 0.4;
    if (weather && weather.id === 'sunny') baseScores.ambiance = 0.8;
    
    // Convert to 5-star ratings
    const stars = (score) => Math.max(1, Math.min(5, Math.round(score * 5)));
    
    return {
        taste: stars(baseScores.taste),
        service: stars(baseScores.service),
        ambiance: stars(baseScores.ambiance),
        value: stars(baseScores.value),
        nps: (baseScores.taste + baseScores.service + baseScores.ambiance + baseScores.value) / 4
    };
}

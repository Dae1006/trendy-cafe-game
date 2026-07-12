/**
 * Supplier System — Realistic Vietnamese coffee supply chain
 * 
 * Features:
 * - Multiple bean suppliers from different regions
 * - Quality vs price tradeoff
 * - Random quality batches
 * - Price fluctuations
 * - Delivery timing (delays during rain)
 */

export const SUPPLIERS = {
    beans: [
        {
            id: 'dalat_arabica',
            name: 'Cà phê Đà Lạt (Arabica)',
            origin: 'Đà Lạt',
            pricePerKg: 120000, // VND
            quality: 0.9,
            description: 'Arabica cao cấp, hương thơm, chua nhẹ'
        },
        {
            id: 'bm_robusta',
            name: 'Cà phê Buôn Ma Thuột (Robusta)',
            origin: 'Buôn Ma Thuột',
            pricePerKg: 75000,
            quality: 0.7,
            description: 'Robusta truyền thống, đậm đà, đắng nhẹ'
        },
        {
            id: 'tuyen_quang_robusta',
            name: 'Cà phê Tuyên Quang (Robusta)',
            origin: 'Tuyên Quang',
            pricePerKg: 55000,
            quality: 0.5,
            description: 'Robusta bình dân, rẻ, chất lượng trung bình'
        },
        {
            id: 'specialty_blend',
            name: 'Signature Blend (Private)',
            origin: 'Blend đặc biệt',
            pricePerKg: 180000,
            quality: 1.0,
            description: 'Blend độc quyền — chất lượng tuyệt đỉnh!'
        }
    ],
    milk: [
        {
            id: 'vinamilk',
            name: 'Vinamilk',
            pricePerLiter: 12000,
            quality: 0.8,
            description: 'Phổ thông, chất lượng ổn'
        },
        {
            id: 'th_true_milk',
            name: 'TH True Milk',
            pricePerLiter: 15000,
            quality: 0.9,
            description: 'Sữa tươi tươi, vị ngọt tự nhiên'
        },
        {
            id: 'fresh_cream',
            name: 'Fresh Cream Premium',
            pricePerLiter: 22000,
            quality: 1.0,
            description: 'Kem tươi cao cấp — vị rich, ngậy'
        },
        {
            id: 'generic_condensed',
            name: 'Ông Thọ (Special Brand)',
            pricePerLiter: 8000,
            quality: 0.4,
            description: 'Sữa đặc rẻ — hương vị... cũ kỹ'
        }
    ],
    cups: [
        {
            id: 'paper_standard',
            name: 'Cốc giấy thường',
            pricePer100: 25000,
            durability: 0.95,
            description: 'Cốc giấy cơ bản — đủ dùng'
        },
        {
            id: 'paper_premium',
            name: 'Cốc giấy cao cấp',
            pricePer100: 65000,
            durability: 0.99,
            description: 'Cốc đẹp — khách thích check-in!'
        },
        {
            id: 'eco_bamboo',
            name: 'Cốc tre lá (Eco-friendly)',
            pricePer100: 120000,
            durability: 1.0,
            description: 'Cốc tre lá bền — xanh, sạch, đẹp!'
        },
        {
            id: 'glass_reusable',
            name: 'Ly kính tái sử dụng',
            pricePer100: 200000,
            durability: 1.0,
            breakageRate: 0.02,
            description: 'Ly kính sang — dùng lại nhiều lần'
        }
    ]
};

// Price fluctuation events
export const PRICE_EVENTS = [
    {
        name: 'Nước biển dâng — Đà Lạt mất mùa',
        effect: 'beans',
        mod: 1.4,
        duration: 7,
        desc: 'Giá cà phê Đà Lạt tăng 40%!'
    },
    {
        name: 'Giáng sinh khuyến mãi',
        effect: 'milk',
        mod: 0.7,
        duration: 5,
        desc: 'Giảm giá sữa 30% nhân dịp lễ!'
    },
    {
        name: 'Tết nguyên đán',
        effect: 'all',
        mod: 1.3,
        duration: 14,
        desc: 'Tết đến — giá nguyên vật liệu tăng!'
    },
    {
        name: 'Mùa cà phê mới',
        effect: 'beans',
        mod: 0.6,
        duration: 10,
        desc: 'Cà phê mới thu hoạch — giá giảm 40%!'
    }
];

export class SupplierSystem {
    constructor() {
        this.activePriceEvent = null;
        this.beanSupplier = 'bm_robusta'; // default
        this.milkSupplier = 'vinamilk';
        this.cupSupplier = 'paper_standard';
        this.stock = {
            beans: 10, // kg
            milk: 20, // liters
            cups: 200 // count
        };
        this.qualitySeed = {}; // track actual quality of each batch
    }

    /** Get current effective price for a resource */
    getEffectivePrice(resourceType) {
        const mod = this.activePriceEvent && 
            (this.activePriceEvent.effect === 'all' || this.activePriceEvent.effect === resourceType)
            ? this.activePriceEvent.mod : 1.0;

        const supplier = SUPPLIERS[resourceType].find(s => s.id === 
            (resourceType === 'beans' ? this.beanSupplier :
             resourceType === 'milk' ? this.milkSupplier : this.cupSupplier));
        
        if (!supplier) return 0;
        
        if (resourceType === 'cups') {
            return Math.floor(supplier.pricePer100 * mod / 100);
        }
        return Math.floor(supplier.pricePerKg * mod);
    }

    /** Get current supplier quality (with random batch variance) */
    getQuality(resourceType) {
        const supplier = SUPPLIERS[resourceType].find(s => s.id === 
            (resourceType === 'beans' ? this.beanSupplier :
             resourceType === 'milk' ? this.milkSupplier : this.cupSupplier));
        
        if (!supplier) return 0;
        
        // Random batch quality: ±10% variance
        const variance = 0.9 + Math.random() * 0.2;
        return Math.min(1, supplier.quality * variance);
    }

    /** Deliver order (consumes money, adds stock) */
    order(resourceType, quantity) {
        const pricePerUnit = this.getEffectivePrice(resourceType);
        const totalCost = pricePerUnit * quantity;
        
        if (resourceType === 'cups') {
            this.stock.cups += quantity;
        } else {
            this.stock[resourceType] += quantity;
        }
        
        return { cost: totalCost, quantity };
    }

    /** Consume resources (used when serving a customer) */
    consume(quantity, resourceType) {
        if (this.stock[resourceType] >= quantity) {
            this.stock[resourceType] -= quantity;
            return true;
        }
        return false; // Out of stock!
    }

    /** Trigger a random price event */
    triggerPriceEvent() {
        const event = PRICE_EVENTS[Math.floor(Math.random() * PRICE_EVENTS.length)];
        this.activePriceEvent = {
            ...event,
            daysLeft: event.duration
        };
        return event;
    }

    /** Tick — decrease event duration */
    tick() {
        if (this.activePriceEvent) {
            this.activePriceEvent.daysLeft--;
            if (this.activePriceEvent.daysLeft <= 0) {
                const event = this.activePriceEvent;
                this.activePriceEvent = null;
                return event; // Event ended
            }
        }
        return null;
    }

    /** Check if stock is low */
    isLowStock(resourceType) {
        const thresholds = { beans: 2, milk: 5, cups: 50 };
        return this.stock[resourceType] < (thresholds[resourceType] || 1);
    }

    save() {
        return JSON.stringify({
            activePriceEvent: this.activePriceEvent,
            beanSupplier: this.beanSupplier,
            milkSupplier: this.milkSupplier,
            cupSupplier: this.cupSupplier,
            stock: this.stock
        });
    }

    load(data) {
        const parsed = JSON.parse(data);
        Object.assign(this, parsed);
    }
}

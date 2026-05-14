/**
 * Customer Feedback System — NPS-based review mechanism
 * 
 * Features:
 * - Real-time customer feedback after each serve
 * - NPS (Net Promoter Score) affects word-of-mouth growth
 * - Feedback influences future customer count
 * - Negative feedback spreads fast (social proof)
 * - Positive reviews unlock bonus events
 */

export class FeedbackSystem {
    constructor() {
        this.recentFeedbacks = []; // last 50 reviews
        this.avgNPS = 3.5; // starts neutral
        this.reputation = 50; // 0-100 reputation score
        this.totalReviews = 0;
        this.promoters = 0; // rating >= 4
        this.detractors = 0; // rating < 3
    }

    /** Record a customer review */
    recordReview(staff, weather, supplierQuality, priceLevel) {
        const feedback = generateCustomerFeedback(staff, weather, supplierQuality);
        
        this.recentFeedbacks.push({
            ...feedback,
            timestamp: Date.now(),
            priceLevel: priceLevel,
            date: new Date().toISOString().split('T')[0]
        });
        
        // Keep only last 50
        if (this.recentFeedbacks.length > 50) {
            this.recentFeedbacks.shift();
        }
        
        this.totalReviews++;
        
        // Update NPS
        const nps = feedback.nps;
        if (nps >= 4) this.promoters++;
        if (nps < 3) this.detractors++;
        
        // Recalculate average
        const sum = this.recentFeedbacks.reduce((a, b) => a + b.nps, 0);
        this.avgNPS = sum / this.recentFeedbacks.length;
        
        // Update reputation
        this.reputation = Math.max(0, Math.min(100, 
            this.reputation + (nps >= 3 ? 2 : -3)
        ));
        
        return feedback;
    }

    /** Get reputation-based customer multiplier */
    getReputationModifier() {
        if (this.reputation <= 30) return 0.5; // terrible reputation
        if (this.reputation <= 50) return 0.75; // poor
        if (this.reputation <= 70) return 1.0; // average
        if (this.reputation <= 90) return 1.2; // good
        return 1.4; // excellent!
    }

    /** Get NPS score (-100 to +100) */
    getNSPScore() {
        if (this.totalReviews === 0) return 0;
        const promoters = this.promoters / this.totalReviews;
        const detractors = this.detractors / this.totalReviews;
        return Math.round((promoters - detractors) * 100);
    }

    /** Check for review milestones */
    getMilestones() {
        const milestones = [];
        
        if (this.totalReviews >= 100 && !this._milestone_100) {
            this._milestone_100 = true;
            milestones.push('🏆 100 đánh giá! Quán của bạn đang nổi tiếng!');
        }
        if (this.reputation >= 90 && !this._milestone_perfect) {
            this._milestone_perfect = true;
            milestones.push('⭐ Quán xuất sắc! Khách hàng yêu thích!');
        }
        if (this.getNSPScore() >= 75 && !this._milestone_promoter) {
            this._milestone_promoter = true;
            milestones.push('🔥 NPS khủng! Khách giới thiệu cho bạn bè!');
        }
        
        return milestones;
    }

    /** Get trend indicator */
    getTrend() {
        if (this.recentFeedbacks.length < 5) return 'neutral';
        const recent = this.recentFeedbacks.slice(-5).map(f => f.nps);
        const older = this.recentFeedbacks.slice(-10, -5).map(f => f.nps);
        const recentAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
        const olderAvg = older.reduce((a, b) => a + b, 0) / older.length;
        
        if (recentAvg > olderAvg + 0.3) return 'improving';
        if (recentAvg < olderAvg - 0.3) return 'declining';
        return 'stable';
    }

    save() {
        return JSON.stringify({
            recentFeedbacks: this.recentFeedbacks,
            avgNPS: this.avgNPS,
            reputation: this.reputation,
            totalReviews: this.totalReviews,
            promoters: this.promoters,
            detractors: this.detractors
        });
    }

    load(data) {
        const parsed = JSON.parse(data);
        Object.assign(this, parsed);
    }
}

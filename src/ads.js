/**
 * Quảng cáo System — Rewarded video + Interstitial ads
 * Strategy: Free + Ads model for fast player acquisition
 */

export const AD_TYPES = {
    rewarded_video: {
        id: 'rewarded_video',
        name: 'Video quảng cáo',
        icon: '📺',
        description: 'Xem video để nhận phần thưởng!',
        rewards: [
            { id: '2x_income_1h', name: '2x doanh thu (1 giờ)', duration: 3600 },
            { id: 'free_coins_500', name: '500 coin miễn phí', amount: 500 },
            { id: 'free_ice_50', name: '50 đá miễn phí', amount: 50 },
            { id: 'restore_steam', name: 'Khôi phục steam (2x)', duration: 3600 }
        ]
    },
    interstitial: {
        id: 'interstitial',
        name: 'Quảng cáo xen kẽ',
        icon: '📱',
        description: 'Quảng cáo ngắn giữa gameplay',
        interval: 300 // 5 minutes between ads
    }
};

export class AdSystem {
    constructor() {
        this.lastInterstitial = 0;
        this.interstitialInterval = 300000; // 5 min
        this.rewardedMultiplier = { active: false, remaining: 0, type: '' };
        this.coinsFromAd = 0;
        this.iceFromAd = 0;
        this.totalAdsWatched = 0;
        this.estimatedRevenue = 0; // revenue for owner (CPM ~$1-3 for VN)
    }

    /** Show rewarded video ad (simulated — in production, use Unity Ads / AdMob) */
    watchRewardedAd(rewardType) {
        // In production: await adManager.showRewardedVideo();
        // Simulated: just give the reward
        this.totalAdsWatched++;
        
        // Revenue for owner (avg CPM in VN: $0.50-2 for rewarded video)
        this.estimatedRevenue += 0.01; // ~$0.01 per rewarded ad in VN
        
        switch (rewardType) {
            case '2x_income_1h':
                this.rewardedMultiplier = { active: true, remaining: 3600, type: '2x_income' };
                return { success: true, message: '📺 Xem video thành công! 2x doanh thu trong 1 giờ!' };
            case 'free_coins_500':
                this.coinsFromAd = 500;
                return { success: true, message: '📺 Xem video thành công! +500 coin!' };
            case 'free_ice_50':
                this.iceFromAd = 50;
                return { success: true, message: '📺 Xem video thành công! +50 đá!' };
            default:
                return { success: false, message: 'Phần thưởng không khả dụng' };
        }
    }

    /** Check if interstitial ad should show */
    shouldShowInterstitial() {
        const now = Date.now();
        if (now - this.lastInterstitial > this.interstitialInterval) {
            this.lastInterstitial = now;
            // Revenue for owner (CPM ~$0.50 for interstitial in VN)
            this.estimatedRevenue += 0.005;
            return true;
        }
        return false;
    }

    /** Skip interstitial with watching rewarded video */
    skipInterstitialWithReward() {
        this.totalAdsWatched++;
        this.estimatedRevenue += 0.01;
        return { success: true, message: 'Đã xem video để bỏ qua quảng cáo!' };
    }

    /** Tick — reduce rewarded multiplier timer */
    tick() {
        if (this.rewardedMultiplier.active) {
            this.rewardedMultiplier.remaining--;
            if (this.rewardedMultiplier.remaining <= 0) {
                this.rewardedMultiplier = { active: false, remaining: 0, type: '' };
                return { expired: true };
            }
        }
        return { expired: false };
    }

    /** Get current income multiplier */
    getIncomeMultiplier() {
        if (this.rewardedMultiplier.active && this.rewardedMultiplier.type === '2x_income') {
            return 2;
        }
        return 1;
    }

    /** Get stats for UI */
    getStats() {
        return {
            adsWatched: this.totalAdsWatched,
            coinsFromAds: this.coinsFromAd,
            iceFromAds: this.iceFromAd,
            estimatedRevenue: this.estimatedRevenue.toFixed(2) + ' USD',
            activeRewards: this.rewardedMultiplier.active ? 
                `${this.rewardedMultiplier.type} (${Math.floor(this.rewardedMultiplier.remaining / 60)} phút còn lại)` : 
                'Không có'
        };
    }

    save() {
        return JSON.stringify({
            lastInterstitial: this.lastInterstitial,
            interstitialInterval: this.interstitialInterval,
            rewardedMultiplier: this.rewardedMultiplier,
            coinsFromAd: this.coinsFromAd,
            iceFromAd: this.iceFromAd,
            totalAdsWatched: this.totalAdsWatched,
            estimatedRevenue: this.estimatedRevenue
        });
    }

    load(data) {
        const parsed = JSON.parse(data);
        Object.assign(this, parsed);
    }
}

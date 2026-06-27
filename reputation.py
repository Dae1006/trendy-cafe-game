"""
Reputation Engine for Cafe Management Simulation Game.

Rating (0-100) based on:
  - Service speed       → time from order to delivery
  - Food quality        → cook skill + mood multipliers
  - Atmosphere          → decoration theme bonuses, total AP
  - Customer satisfaction → wait tolerance vs actual wait

Daily reputation updates with drift toward current rating.
Reputation → customer spawn rate multiplier (higher = more visitors).
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Dict, List, Optional


# ─────────────────── Service Metrics ───────────────────

@dataclass
class ServiceRecord:
    """A single customer interaction record."""
    service_time_seconds: float   # how long they waited
    food_quality_score: float     # 0-10
    atmosphere_rating: float      # 0-10 (derived from decorations)
    satisfaction_raw: float       # 0-10 (base rating before adjustment)
    tip_given: bool = False
    repeated_customer: bool = False
    review_text: str = ""


# ─────────────────── Reputation State ──

@dataclass
class ReputationState:
    """Overall reputation data for the cafe."""
    current_rating: float = 70.0         # starts at average
    total_reviews: int = 0
    positive_ratio: float = 0.5           # fraction of positive reviews
    recent_trend: str = "stable"          # rising | falling | stable
    daily_change: float = 0.0             # today's net change

    @property
    def tier(self) -> str:
        if self.current_rating >= 90:
            return "Legendary (★★★★★)"
        if self.current_rating >= 80:
            return "Popular (★★★★☆)"
        if self.current_rating >= 65:
            return "Decent (★★★☆☆)"
        if self.current_rating >= 45:
            return "Average (★★☆☆☆)"
        if self.current_rating >= 25:
            return "Struggling (★☆☆☆☆)"
        return "Fading (☆☆☆☆☆)"

    @property
    def customer_multiplier(self) -> float:
        """How much this rating affects new customer spawn rate."""
        return max(0.3, self.current_rating / 50.0)


# ─────────────────── Reputation Engine ───────────────────

@dataclass
class ReputationEngine:
    """Computes and tracks cafe reputation over time."""
    state: ReputationState = field(default_factory=ReputationState)
    review_history: List[ServiceRecord] = field(default_factory=list)

    # ── Rating Components (each 0-10, then averaged) ──

    @staticmethod
    def calc_service_speed_score(service_time_seconds: float) -> float:
        """Shorter wait → higher score. <15s = 10, >120s = 0."""
        if service_time_seconds <= 15:
            return 10.0
        if service_time_seconds >= 120:
            return 0.0
        return max(0, 10 - (service_time_seconds - 15) * (10 / 105))

    @staticmethod
    def calc_food_quality_score(food_quality: float) -> float:
        """food_quality is already 0-10."""
        return max(0, min(10, food_quality))

    @staticmethod
    def calc_atmosphere_score(atmosphere_rating: float) -> float:
        """atmosphere_rating from decorations is already 0-10."""
        return max(0, min(10, atmosphere_rating))

    @staticmethod
    def calc_satisfaction_score(raw_satisfaction: float, wait_time: float, patience_base: float = 60.0) -> float:
        """Customer satisfaction from service + context."""
        # If they waited longer than patience → unhappy
        if wait_time > patience_base:
            penalty = (wait_time - patience_base) / 3.0
            return max(1, raw_satisfaction - penalty)
        return min(10, raw_satisfaction + 1.5)

    # ── Composite Rating ──

    def compute_rating_from_service(self, record: ServiceRecord) -> float:
        """Compute a single-service contribution to the overall rating (0-10)."""
        s_speed = self.calc_service_speed_score(record.service_time_seconds)
        f_quality = self.calc_food_quality_score(record.food_quality_score)
        atmos = self.calc_atmosphere_score(record.atmosphere_rating)
        satisfaction = self.calc_satisfaction_score(
            record.satisfaction_raw, record.service_time_seconds
        )

        # Weighted average: satisfaction matters most, then service speed, food, atmosphere
        weights = [0.35, 0.25, 0.20, 0.20]
        scores = [satisfaction, s_speed, f_quality, atmos]
        composite = sum(w * s for w, s in zip(weights, scores)) / sum(weights)

        # Positive review bonus
        if record.tip_given:
            composite *= 1.05
        if record.repeated_customer:
            composite *= 1.08

        return max(0, min(10, round(composite, 3)))

    def process_service_record(self, record: ServiceRecord) -> float:
        """Process a single customer interaction and update reputation."""
        score = self.compute_rating_from_service(record)
        self.review_history.append(record)
        self.state.total_reviews += 1

        is_positive = score >= 6.0
        old_pos_ratio = self.state.positive_ratio if self.state.total_reviews > 1 else 0.5
        new_count = sum(1 for r in self.review_history[-min(20, len(self.review_history)):]
                       if self.compute_rating_from_service(r) >= 6.0)
        window = min(20, len(self.review_history))
        self.state.positive_ratio = round(new_count / window, 4)

        # Weighted blend toward the composite score
        alpha = 0.15  # how fast reputation adapts
        target = score / 10.0 * 100  # scale to 0-100
        self.state.current_rating = round(
            (1 - alpha) * self.state.current_rating + alpha * target, 2
        )

        return score

    def process_batch_services(self, records: List[ServiceRecord]) -> Dict[str, float]:
        """Process multiple service records and return summary stats."""
        scores = []
        for r in records:
            s = self.process_service_record(r)
            scores.append(s)

        avg_score = sum(scores) / len(scores) if scores else 0
        return {
            "average_score": round(avg_score, 3),
            "total_reviews": self.state.total_reviews,
            "rating": self.state.current_rating,
            "positive_ratio": self.state.positive_ratio,
            "tier": self.state.tier,
        }

    # ── Daily Reputation Update ──

    def daily_update(self, day_offset: int = 0) -> str:
        """Simulate one day of reputation drift/update."""
        recent_window = min(30, len(self.review_history))
        recent_scores = [self.compute_rating_from_service(r) for r in self.review_history[-recent_window:]]

        if not recent_scores:
            return "No reviews today."

        avg_recent = sum(recent_scores) / len(recent_scores)
        yesterday_avg = 0
        if len(self.review_history) > recent_window:
            prev_window = recent_scores[recent_window:recent_window * 2] if recent_window * 2 <= len(self.review_history) else []
            if prev_window:
                yesterday_avg = sum(prev_window) / len(prev_window)

        change = round(avg_recent - (yesterday_avg or avg_recent), 3)
        self.state.daily_change = change

        # Smooth drift toward average recent score
        drift_target = (avg_recent / 10) * 100
        self.state.current_rating = round(
            (1 - 0.08) * self.state.current_rating + 0.08 * drift_target, 2
        )

        if change > 0.3:
            self.state.recent_trend = "rising"
        elif change < -0.3:
            self.state.recent_trend = "falling"
        else:
            self.state.recent_trend = "stable"

        return (f"📅 Day {day_offset}: Rating now {self.state.current_rating:.1f} ({self.state.tier}) | "
                f"Avg score {avg_recent:.2f}/10 | Change: {change:+.3f} | Trend: {self.state.recent_trend}")

    # ── Customer Spawn Rate ──

    def expected_customers_per_hour(self, base_rate: float = 5.0) -> float:
        """Expected customers per hour based on current reputation."""
        mult = self.state.customer_multiplier
        return round(base_rate * mult, 1)

    # ── Simulation Helpers ──

    @staticmethod
    def simulate_service() -> ServiceRecord:
        """Generate a realistic service record for simulation."""
        import random
        wait_time = max(5, random.gauss(45, 20))  # mean 45s
        food_quality = min(10, max(1, random.gauss(7, 2)))
        atmosphere_rating = min(10, max(1, random.gauss(6.5, 1.5)))
        base_satisfaction = (food_quality + atmosphere_rating) / 2
        satisfaction = max(1, min(10, base_satisfaction + random.gauss(0, 1.5)))
        tip_chance = max(0.05, min(0.8, satisfaction / 15))

        return ServiceRecord(
            service_time_seconds=round(wait_time, 1),
            food_quality_score=round(food_quality, 2),
            atmosphere_rating=round(atmosphere_rating, 2),
            satisfaction_raw=round(satisfaction, 2),
            tip_given=random.random() < tip_chance,
            repeated_customer=random.random() < 0.3,
            review_text=random.choice([
                "Great service!", "Fast and tasty.", "Loved the ambiance.",
                "Wait was too long.", "Food quality could be better.",
                "Will come back!", "Cozy place, nice staff.",
                "Mediocre experience.", "Exceeded expectations!",
                "Disappointing.", "Best cafe in town! 💯",
            ]),
        )

    def simulate_day(self, day_num: int, num_customers: int = 10) -> List[str]:
        """Run a full day of simulated customer interactions."""
        import random
        log: List[str] = []
        records: List[ServiceRecord] = []

        base_cust = num_customers * self.state.customer_multiplier
        log.append(f"🕐 Day {day_num}: ~{int(base_cust)} customers expected (reputation mult: {self.state.customer_multiplier:.2f})")

        for i in range(max(1, int(base_cust))):
            rec = self.simulate_service()
            score = self.process_service_record(rec)
            emoji = "⭐" if score >= 8 else ("👍" if score >= 6 else ("😐" if score >= 4 else "💔"))
            tip_str = "💰 tipped!" if rec.tip_given else ""
            log.append(f"   {emoji} Customer #{i+1:2d}: "
                       f"wait={rec.service_time_seconds:.0f}s, "
                       f"food={rec.food_quality_score:.1f}, "
                       f"score={score:.1f} | {rec.review_text} {tip_str}")

        daily_report = self.daily_update(day_num)
        log.append(daily_report)
        log.append(f"📈 Rating: {self.state.current_rating:.1f}/{100} — {self.state.tier}")
        return log

"""
simulation.py - Tick-based simulation loop for the cafe management game.

Core concepts
-------------
1 tick  = 30 minutes of simulated time
game day = 6 ticks (6 AM → 9 PM)
night   = ticks 0-2 (12 AM – 5:30 AM), morning 3-4, afternoon 5-7, evening 8+

The ``CafeSimulation`` class owns the game clock, customer lifecycle,
day/night cycle, weather state, reputation system, and orchestrates
grid / economy updates each tick.
"""

from __future__ import annotations

import random
from dataclasses import dataclass, field
from datetime import datetime, timedelta
from enum import IntEnum
from typing import Dict, List, Optional, Tuple


# ---------------------------------------------------------------------------
# Enums & data classes
# ---------------------------------------------------------------------------

class Weather(IntEnum):
    SUNNY = 0
    CLOUDY = 1
    RAINY = 2
    STORMY = 3

    def customer_modifier(self) -> float:
        """How weather affects expected customer count (multiplier)."""
        return {Weather.SUNNY: 1.3, Weather.CLOUDY: 1.0, Weather.RAINY: 0.7, Weather.STORMY: 0.4}.get(self, 1.0)


class TimeOfDay(IntEnum):
    NIGHT = 0
    MORNING = 1
    AFTERNOON = 2
    EVENING = 3

    def display_time(self, tick: int) -> str:
        """Return a human-readable time string for the given tick."""
        # Each tick = 30 min; simulate 6 AM → 9 PM over ticks 0..7 (example)
        simulated_hour = 6 + tick * 1 // 2   # simplified display
        simulated_min = (tick * 30) % 60
        return f"{simulated_hour:02d}:{simulated_min:02d}"


@dataclass
class Reputation:
    """Cafe reputation that influences customer arrival rate."""
    score: float = 50.0            # 0-100 scale
    reviews_received: int = 0
    average_rating: float = 4.0

    def update_review(self, rating: float) -> None:
        """Incorporate a new star review (1-5)."""
        self.reviews_received += 1
        total = (self.average_rating * (self.reviews_received - 1)) + rating
        self.average_rating = total / self.reviews_received
        # Reputation shifts toward the review rating
        self.score = self.score * 0.92 + rating * 10 * 0.08


@dataclass
class CustomerProfile:
    """Blueprint for a customer that will spawn during simulation."""
    customer_id: int
    patience_ticks: int              # how many ticks before they leave
    avg_spend: float                 # expected spending in dollars
    preferred_zone: int              # index into CafeGrid zones
    arrival_tick: int                # tick number at which they appear


# ---------------------------------------------------------------------------
# Simulation class
# ---------------------------------------------------------------------------

class CafeSimulation:
    """Main simulation loop controller.

    Public API (tick-to-tick)
    -------------------------
    sim.start_game()           → initialise the day
    while not sim.day_over:
        events = sim.process_tick()
        draw(events, grid, economy)
    report = sim.end_day()     → summary
    """

    TICK_MINUTES = 30                      # each tick is half an hour
    TICKS_PER_DAY = 30                       # 30 ticks for 6 AM → 9 PM (15 hours × 2)

    def __init__(self, width: int = 20, height: int = 14):
        self.grid_width = width
        self.grid_height = height
        self.reputation = Reputation()
        self.weather = Weather.SUNNY

        # Game state
        self.current_tick: int = 0           # ticks since day start
        self.total_ticks: int = 0            # accumulated across days (used for IDs)
        self.day_over: bool = False
        self.is_daytime: bool = True
        self.customers_this_tick: List[CustomerProfile] = []

        # Tracking
        self._customer_counter: int = 0
        self.all_customers_served: List[CustomerProfile] = []
        self.all_customers_left: List[str] = []   # ids of departed customers
        self.tick_log: List[str] = []              # human-readable tick log

    # ------------------------------------------------------------------
    # Lifecycle
    # ------------------------------------------------------------------

    def start_game(self) -> None:
        """Reset state for a new game day (6 AM)."""
        self.current_tick = 0
        self.day_over = False
        self.is_daytime = True
        self.customers_this_tick.clear()
        self.tick_log.clear()
        self._pick_weather()

    def process_tick(self) -> List[str]:
        """Run one simulation tick.

        Returns a list of log messages produced during this tick.
        """
        self.current_tick += 1
        total_ticks_since_start = self.TICKS_PER_DAY * (self.total_ticks // self.TICKS_PER_DAY) + self.current_tick
        # Check if the day has ended (past 9 PM → tick >= TICKS_PER_DAY for this cycle)
        if self.current_tick > self.TICKS_PER_DAY:
            self.day_over = True
            self.is_daytime = False

        events: List[str] = []
        events.append(f"--- Tick {self.current_tick} (simulated time ~{self._display_time()}) ---")

        # 1. Spawn customers
        spawned = self._spawn_customers()
        for cp in spawned:
            self.all_customers_served.append(cp)
        events.append(f"  🧑 Customers arrived: {len(spawned)}")

        # 2. Update existing customers (patience countdown, status changes)
        events.extend(self._update_customers())

        # 3. Move staff toward nearest table / task (example logic)
        events.append("  🧹 Staff movement processed")

        # 4. Check if day is over
        if self.day_over:
            events.append("  ☀️  → 🌙 Day has ended!")

        self.tick_log.append("\n".join(events))
        return events

    def end_day(self) -> Dict:
        """Finalise the day and return a summary dict."""
        report = {
            "total_customers": len(self.all_customers_served),
            "customers_left_early": len(self.all_customers_left),
            "reputation_score": round(self.reputation.score, 1),
            "average_rating": round(self.reputation.average_rating, 2),
            "reviews_received": self.reputation.reviews_received,
        }
        return report

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _display_time(self) -> str:
        """Approximate clock time from current tick (6 AM → 9 PM over TICKS_PER_DAY ticks)."""
        total_minutes = self.current_tick * self.TICK_MINUTES
        hour = 6 + total_minutes // 60
        minute = total_minutes % 60
        return f"{hour:02d}:{minute:02d}"

    def _pick_weather(self) -> None:
        """Randomly pick a weather state at day start."""
        self.weather = random.choice(list(Weather))

    def _spawn_customers(self) -> List[CustomerProfile]:
        """Spawn customers based on reputation, time of day, and weather."""
        spawned: List[CustomerProfile] = []

        # Base arrival rate per tick
        base_rate = 0.15       # probability per customer slot
        # Reputation modifier (0-1 range)
        rep_mod = self.reputation.score / 100.0
        # Time of day multiplier
        tod_mod = {
            TimeOfDay.MORNING: 1.4,      # morning rush
            TimeOfDay.AFTERNOON: 0.8,    # afternoon lull
            TimeOfDay.EVENING: 1.2,      # evening crowd
            TimeOfDay.NIGHT: 0.2,        # night = virtually no traffic
        }
        tod = self._get_time_of_day()
        weather_mod = self.weather.customer_modifier()

        effective_rate = base_rate * rep_mod * tod_mod.get(tod, 1.0) * weather_mod

        # Maximum customers at once (simulating physical space limit)
        max_simultaneous = 8
        current_count = len(self.all_customers_served) - len(self.all_customers_left)
        if current_count >= max_simultaneous:
            return spawned

        attempts = int(3 * effective_rate + 0.5)   # scale spawns by rate
        for _ in range(max(attempts, 1)):
            if random.random() < min(effective_rate * 2, 0.6):
                self._customer_counter += 1
                profile = CustomerProfile(
                    customer_id=self._customer_counter,
                    patience_ticks=random.randint(5, 15),
                    avg_spend=round(random.uniform(8.0, 35.0), 2),
                    preferred_zone=0,
                    arrival_tick=self.current_tick,
                )
                profile.customer_id = self._customer_counter
                spawned.append(profile)

        return spawned

    def _update_customers(self) -> List[str]:
        """Advance every active customer one tick. Returns log messages."""
        messages: List[str] = []
        # Simplified: just check patience decay
        departed_ids: List[int] = []
        for c in self.all_customers_served:
            if hasattr(c, 'waited') and not hasattr(c, '_active'):
                pass  # already handled below via external tracking

        # Track waited ticks separately since CustomerProfile is minimal
        return messages

    def _get_time_of_day(self) -> TimeOfDay:
        """Classify the current tick into a time-of-day bucket."""
        if self.current_tick <= 1:
            return TimeOfDay.MORNING
        elif self.current_tick <= 3:
            return TimeOfDay.AFTERNOON
        else:
            return TimeOfDay.EVENING

    def add_review(self, rating: float) -> None:
        """Manually inject a review for testing."""
        self.reputation.update_review(rating)

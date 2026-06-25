"""
Customer Types for Cafe Management Simulation Game

7 customer types, each with unique behaviors, spending patterns, patience levels,
order preferences, stay durations, and tipping behavior.

Pygame-compatible rendering hooks included for pixel-art display.
"""

from enum import Enum
from dataclasses import dataclass, field
from typing import List, Dict, Optional, Tuple
import random


# ─── Sprite / Rendering Hooks (pygame-compatible) ─────────────────────────

def get_customer_sprite(key: str) -> str:
    """Return a pixel-art ASCII preview for each customer type."""
    return CUSTOMER_SPRITES.get(key, "?")


CUSTOMER_SPRITES: Dict[str, str] = {
    "coffee_lover": [
        "  ☕  ",
        " ◉🧑 ",
        " /||\\",
    ],
    "digital_nomad": [
        "💻   ",
        " ◉🧑 ",
        " /||\\",
    ],
    "couple": [
        "♡ ♡ ",
        "◉◯🧒 ",
        " / \\/",
    ],
    "family": [
        "👶🧒",
        " ◉👩 ",
        "/||||\\",
    ],
    "tourist": [
        "📷🌍",
        " ◉🧳 ",
        " /||\\",
    ],
    "business": [
        "💼   ",
        " ◉🤵 ",
        " /||\\",
    ],
    "artist": [
        "🎨✏️",
        " ◉🧑 ",
        " /||\\",
    ],
}


# ─── Customer Type Definition ──────────────────────────────────────────────

class CustomerType(Enum):
    COFFEE_LOVER = "coffee_lover"
    DIGITAL_NOMAD = "digital_nomad"
    COUPLE = "couple"
    FAMILY = "family"
    TOURIST = "tourist"
    BUSINESS = "business"
    ARTIST = "artist"


# ─── Order Pattern Definitions ─────────────────────────────────────────────

@dataclass
class OrderPattern:
    """What this customer type typically orders."""
    most_likely_items: List[str]       # top 1-2 items they always order
    possible_addons: List[str]          # optional extras (dessert, extra shot)
    combo_rate: float                   # probability of ordering a combo (0-1)


# ─── Behavioral Profile ────────────────────────────────────────────────────

@dataclass
class CustomerProfile:
    """Static behavioral profile for a customer type."""
    display_name: str
    emoji: str

    # Spending
    avg_spend_min: float              # minimum average spend ($)
    avg_spend_max: float              # maximum average spend ($)
    tip_mean: float                   # mean tip as % of bill
    tip_std: float                    # std dev of tip percentage

    # Patience (in hours — time before customer gets impatient and leaves)
    patience_min: float               # minimum patience in hours
    patience_max: float               # maximum patience in hours

    # Stay duration (minutes after order is complete)
    stay_min: int                     # min time spent after ordering
    stay_max: int                     # max time spent after ordering

    # Order pattern
    order_pattern: OrderPattern

    # Spawn weight (relative probability of appearing at a given hour)
    # Maps hour-of-day → multiplier (1.0 = average, <1.0 = less likely, >1.0 = more likely)
    spawn_weights: Dict[int, float]

    # Preferred seat type preference
    preferred_seat: str  # "window", "table", "counter", "sofa"


# ─── Customer Profiles ─────────────────────────────────────────────────────

CUSTOMER_PROFILES: Dict[CustomerType, CustomerProfile] = {
    CustomerType.COFFEE_LOVER: CustomerProfile(
        display_name="Coffee Lover",
        emoji="☕🧑",
        avg_spend_min=8.0,
        avg_spend_max=15.0,
        tip_mean=18.0,
        tip_std=6.0,
        patience_min=0.25,   # 15 minutes
        patience_max=1.0,    # 60 minutes
        stay_min=20,
        stay_max=60,
        order_pattern=OrderPattern(
            most_likely_items=["Espresso", "Cappuccino", "Pour Over"],
            possible_addons=["Extra Shot", "Oat Milk Upgrade", "Cinnamon Latte"],
            combo_rate=0.3,
        ),
        spawn_weights={
            6: 0.8, 7: 1.2, 8: 1.5, 9: 1.0, 10: 0.7, 11: 0.5,
            12: 0.4, 13: 0.5, 14: 0.6, 15: 0.7, 16: 0.8, 17: 0.6,
            18: 0.4, 19: 0.3, 20: 0.2, 21: 0.1, 22: 0.05, 23: 0.0,
            0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.3,
        },
        preferred_seat="counter",
    ),

    CustomerType.DIGITAL_NOMAD: CustomerProfile(
        display_name="Digital Nomad",
        emoji="💻🧑",
        avg_spend_min=12.0,
        avg_spend_max=25.0,
        tip_mean=12.0,
        tip_std=5.0,
        patience_min=1.5,    # 90 minutes
        patience_max=6.0,    # 6 hours
        stay_min=90,
        stay_max=240,
        order_pattern=OrderPattern(
            most_likely_items=["Latte", "Iced Coffee"],
            possible_addons=["Croissant", "Avocado Toast", "Extra Wi-Fi Boost"],
            combo_rate=0.6,
        ),
        spawn_weights={
            6: 0.1, 7: 0.3, 8: 0.5, 9: 1.0, 10: 1.5, 11: 1.8,
            12: 1.5, 13: 1.8, 14: 2.0, 15: 1.8, 16: 1.5, 17: 1.0,
            18: 0.5, 19: 0.3, 20: 0.2, 21: 0.1, 22: 0.0, 23: 0.0,
            0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0,
        },
        preferred_seat="window",
    ),

    CustomerType.COUPLE: CustomerProfile(
        display_name="Couple",
        emoji="♡🧑‍🤝‍🧑",
        avg_spend_min=15.0,
        avg_spend_max=35.0,
        tip_mean=22.0,
        tip_std=8.0,
        patience_min=0.75,   # 45 minutes
        patience_max=2.0,    # 120 minutes
        stay_min=45,
        stay_max=120,
        order_pattern=OrderPattern(
            most_likely_items=["Cappuccino", "Mocha", "Matcha Latte"],
            possible_addons=["Tiramisu", "Chocolate Cake", "Fruit Tart"],
            combo_rate=0.8,
        ),
        spawn_weights={
            6: 0.0, 7: 0.1, 8: 0.2, 9: 0.3, 10: 0.5, 11: 0.8,
            12: 1.0, 13: 1.2, 14: 1.0, 15: 0.8, 16: 0.7, 17: 0.9,
            18: 1.5, 19: 1.8, 20: 1.5, 21: 1.0, 22: 0.5, 23: 0.2,
            0: 0.1, 1: 0.05, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0,
        },
        preferred_seat="sofa",
    ),

    CustomerType.FAMILY: CustomerProfile(
        display_name="Family w/ Kids",
        emoji="👨‍👩‍👧‍👦",
        avg_spend_min=20.0,
        avg_spend_max=45.0,
        tip_mean=15.0,
        tip_std=7.0,
        patience_min=0.3,    # 18 minutes
        patience_max=1.5,    # 90 minutes
        stay_min=30,
        stay_max=90,
        order_pattern=OrderPattern(
            most_likely_items=["Hot Chocolate", "Iced Coffee", "Coffee"],
            possible_addons=["Kids Meal", "Cookie Platter", "Fruit Smoothie"],
            combo_rate=0.7,
        ),
        spawn_weights={
            6: 0.0, 7: 0.2, 8: 1.0, 9: 1.5, 10: 1.8, 11: 1.5,
            12: 1.0, 13: 0.8, 14: 0.6, 15: 0.3, 16: 0.1, 17: 0.0,
            18: 0.0, 19: 0.0, 20: 0.0, 21: 0.0, 22: 0.0, 23: 0.0,
            0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0,
        },
        preferred_seat="table",
    ),

    CustomerType.TOURIST: CustomerProfile(
        display_name="Tourist / Influencer",
        emoji="📷🌍",
        avg_spend_min=10.0,
        avg_spend_max=20.0,
        tip_mean=10.0,
        tip_std=8.0,
        patience_min=0.5,    # 30 minutes
        patience_max=2.0,    # 120 minutes
        stay_min=15,
        stay_max=45,
        order_pattern=OrderPattern(
            most_likely_items=["Aesthetic Matcha Latte", "Cloud Coffee", "Instagram Frappe"],
            possible_addons=["Decorated Cake Slice", "Colorful Smoothie Bowl"],
            combo_rate=0.9,
        ),
        spawn_weights={
            6: 0.0, 7: 0.0, 8: 0.3, 9: 1.2, 10: 1.8, 11: 1.5,
            12: 1.0, 13: 0.8, 14: 0.6, 15: 0.5, 16: 0.4, 17: 0.3,
            18: 0.2, 19: 0.1, 20: 0.1, 21: 0.05, 22: 0.0, 23: 0.0,
            0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0,
        },
        preferred_seat="window",
    ),

    CustomerType.BUSINESS: CustomerProfile(
        display_name="Business Person",
        emoji="💼🤵",
        avg_spend_min=12.0,
        avg_spend_max=30.0,
        tip_mean=25.0,
        tip_std=5.0,
        patience_min=0.1,    # 6 minutes
        patience_max=0.3,    # 18 minutes
        stay_min=10,
        stay_max=40,
        order_pattern=OrderPattern(
            most_likely_items=["Espresso", "Americano", "Black Coffee"],
            possible_addons=["Bagel", "Chicken Sandwich", "Protein Shake"],
            combo_rate=0.5,
        ),
        spawn_weights={
            6: 1.0, 7: 2.0, 8: 2.5, 9: 1.5, 10: 0.5, 11: 0.3,
            12: 0.4, 13: 0.3, 14: 0.2, 15: 0.3, 16: 0.5, 17: 1.0,
            18: 1.5, 19: 1.2, 20: 0.8, 21: 0.3, 22: 0.1, 23: 0.0,
            0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0,
        },
        preferred_seat="counter",
    ),

    CustomerType.ARTIST: CustomerProfile(
        display_name="Artist / Creative",
        emoji="🎨🧑",
        avg_spend_min=8.0,
        avg_spend_max=18.0,
        tip_mean=15.0,
        tip_std=9.0,
        patience_min=2.0,    # 2 hours
        patience_max=6.0,    # 6 hours
        stay_min=60,
        stay_max=300,
        order_pattern=OrderPattern(
            most_likely_items=["Pour Over", "Chai Latte", "Cold Brew"],
            possible_addons=["Scone", "Avocado Toast", "Artisan Pastry"],
            combo_rate=0.4,
        ),
        spawn_weights={
            6: 0.1, 7: 0.2, 8: 0.4, 9: 0.8, 10: 1.2, 11: 1.3,
            12: 1.0, 13: 0.8, 14: 0.6, 15: 0.5, 16: 0.4, 17: 0.3,
            18: 0.5, 19: 0.8, 20: 1.0, 21: 0.8, 22: 0.4, 23: 0.1,
            0: 0.0, 1: 0.0, 2: 0.0, 3: 0.0, 4: 0.0, 5: 0.0,
        },
        preferred_seat="sofa",
    ),
}


# ─── Individual Customer Class ──────────────────────────────────────────────

class Customer:
    """A single customer with full state machine."""

    def __init__(
        self,
        customer_type: CustomerType,
        arrival_time: float,       # simulation time in hours (0-24)
        customer_id: int,
    ):
        self.customer_id = customer_id
        self.customer_type = customer_type
        self.profile = CUSTOMER_PROFILES[customer_type]

        self.arrival_time = arrival_time
        self.current_time = arrival_time       # track current sim time
        self.state = "entering"                # state machine

        # Seat & queue state
        self.seat: Optional[str] = None        # seat identifier (e.g. "W1", "T2")
        self.state_queue_time = 0.0             # time in current state (hours)

        # Order state
        self.orders_placed: List[Dict] = []     # completed order records
        self.active_order: Optional[Dict] = None # currently waiting to be served
        self.order_wait_time = 0.0               # how long the active order has waited

        # Spend tracking
        self.total_spent = 0.0
        self.total_tip = 0.0

        # Patience & stay (patience in hours for consistency with sim clock)
        self.patience_remaining_hours: float = (
            random.uniform(self.profile.patience_min, self.profile.patience_max)
        )
        self.time_after_order: float = 0.0     # time spent after order is ready
        self.max_stay: float = (
            random.uniform(self.profile.stay_min, self.profile.stay_max) / 60.0
        )

        # Visual state
        self.emoji_display = self.profile.emoji
        self.sprite = get_customer_sprite(customer_type.value)

    def __repr__(self):
        return (f"Customer#{self.customer_id} [{self.profile.display_name}] "
                f"@ t={self.current_time:.1f} in {self.state}")

    # ── State Machine Transitions ───────────────────────────────────────

    def update(self, dt: float) -> List[str]:       # dt in hours
        """Advance customer state by dt. Returns list of events fired."""
        self.current_time += dt
        self.state_queue_time += dt
        events = []

        if self.state == "entering":
            self._on_entering(dt, events)
        elif self.state == "waiting_seat":
            self._on_waiting_seat(dt, events)
        elif self.state == "seated":
            self._on_seated(dt, events)
        elif self.state == "ordering":
            self._on_ordering(dt, events)
        elif self.state == "waiting_serve":
            self._on_waiting_serve(dt, events)
        elif self.state == "served":
            self._on_served(dt, events)
        elif self.state == "leaving":
            self._on_leaving(dt, events)

        return events

    def _check_impatience(self):
        """Check if customer got too impatient and leave."""
        if self.patience_remaining_hours <= 0:
            self.state = "impatient_leave"
            return True
        return False

    # ── State Handlers ──────────────────────────────────────────────────

    def _on_entering(self, dt: float, events: List[str]):
        self.patience_remaining_hours -= dt  # patience is in hours
        if self._check_impatience():
            events.append(f"Customer#{self.customer_id} left (impatient at entrance)")
            return

        # Instantly move to seat assignment
        self.state = "waiting_seat"
        self.state_queue_time = 0.0
        events.append(f"Customer#{self.customer_id} arrived → waiting for seat")

    def _on_waiting_seat(self, dt: float, events: List[str]):
        # This state is resolved externally by the QueueManager
        pass

    def assign_seat(self, seat_id: str) -> None:
        """Called externally by QueueManager."""
        self.seat = seat_id
        self.state = "seated"
        self.state_queue_time = 0.0

    def _on_seated(self, dt: float, events: List[str]):
        if self.state_queue_time >= 2.0 / 60:  # 2 min wait before ordering
            self.state = "ordering"
            self.state_queue_time = 0.0
            events.append(f"Customer#{self.customer_id} at seat {self.seat} → ready to order")

    def _on_ordering(self, dt: float, events: List[str]):
        if self.state_queue_time >= 3.0 / 60:  # 3 min to decide
            order = self._generate_order()
            self.active_order = order
            self.orders_placed.append(order)
            self.state = "waiting_serve"
            self.state_queue_time = 0.0
            events.append(
                f"Customer#{self.customer_id} ordered: "
                f"{order['items']}"
            )

    def _on_waiting_serve(self, dt: float, events: List[str]):
        self.patience_remaining_hours -= dt
        if self._check_impatience():
            self.state = "impatient_leave"
            events.append(f"Customer#{self.customer_id} left (order never served)")
            return

    def serve_order(self):
        """Called externally when staff fulfills the order."""
        self.active_order["status"] = "ready"
        self.active_order["served_time"] = self.current_time
        self.state = "served"
        self.state_queue_time = 0.0
        self.time_after_order = 0.0

    def _on_served(self, dt: float, events: List[str]):
        self.time_after_order += dt
        # After their max stay, they leave
        if self.time_after_order >= self.max_stay:
            self.state = "leaving"
            self.state_queue_time = 0.0
            events.append(
                f"Customer#{self.customer_id} departed from seat {self.seat}"
            )

    def _on_leaving(self, dt: float, events: List[str]):
        if self.state_queue_time >= 1.0 / 60:  # instant leave
            self.state = "left"
            events.append(
                f"Customer#{self.customer_id} LEFT — spent ${self.total_spent:.2f}, tipped ${self.total_tip:.2f}"
            )

    # ── Order Generation ────────────────────────────────────────────────

    def _generate_order(self) -> Dict:
        """Generate a realistic order based on customer type profile."""
        p = self.profile.order_pattern
        items = list(p.most_likely_items)  # always get one main item
        chosen_main = random.choice(p.most_likely_items)

        # Add possible combos (desserts, food)
        if random.random() < p.combo_rate and p.possible_addons:
            extras = random.sample(p.possible_addons, k=min(2, len(p.possible_addons)))
            items.extend(extras)

        # Calculate total
        total = 0.0
        for item in items:
            total += MENU_ITEMS[item]["price"]

        # Add tip (will be applied on departure)
        tip_pct = random.gauss(self.profile.tip_mean, self.profile.tip_std)
        tip_pct = max(0, min(tip_pct, 50))  # clamp 0-50%

        return {
            "items": items,
            "total": total,
            "tip_pct": round(tip_pct, 1),
            "estimated_prep_minutes": self._estimate_prep(items),
            "status": "pending",
            "placed_time": self.current_time,
            "served_time": None,
        }

    def _estimate_prep(self, items: List[str]) -> float:
        """Estimate prep time in minutes for a list of items."""
        total_min = 0.0
        for item in items:
            if item in MENU_ITEMS:
                total_min += MENU_ITEMS[item]["prep_time_minutes"]
            else:
                total_min += 2.0  # default simple item
        # Complex drinks have some parallelism (smaller sum of parts)
        complex_items = [i for i in items if MENU_ITEMS.get(i, {}).get("complex", False)]
        if len(complex_items) > 1:
            total_min = total_min * 0.7 + max(MENU_ITEMS[i]["prep_time_minutes"] for i in complex_items) * 0.3
        return round(max(total_min, 1.0), 1)

    def apply_bill(self):
        """Apply the tip and finalize spending."""
        if self.active_order:
            tip = self.active_order["total"] * (self.active_order["tip_pct"] / 100.0)
            self.total_spent += self.active_order["total"]
            self.total_tip += tip


# ─── Menu Data Structure ───────────────────────────────────────────────────

MENU_ITEMS: Dict[str, Dict] = {
    # Coffee (core)
    "Espresso":        {"price": 3.50, "prep_time_minutes": 2.0, "category": "coffee", "complex": True},
    "Americano":       {"price": 4.00, "prep_time_minutes": 2.5, "category": "coffee", "complex": False},
    "Black Coffee":     {"price": 3.00, "prep_time_minutes": 1.0, "category": "coffee", "complex": False},
    "Cappuccino":      {"price": 5.50, "prep_time_minutes": 3.5, "category": "coffee", "complex": True},
    "Latte":           {"price": 6.00, "prep_time_minutes": 4.0, "category": "coffee", "complex": True},
    "Mocha":           {"price": 6.50, "prep_time_minutes": 4.5, "category": "coffee", "complex": True},
    "Flat White":      {"price": 5.50, "prep_time_minutes": 3.5, "category": "coffee", "complex": True},
    "Pour Over":       {"price": 7.00, "prep_time_minutes": 6.0, "category": "coffee", "complex": True},
    "Cold Brew":       {"price": 5.00, "prep_time_minutes": 1.0, "category": "coffee", "complex": False},

    # Iced / Specialty
    "Iced Coffee":     {"price": 5.50, "prep_time_minutes": 3.0, "category": "coffee", "complex": True},
    "Iced Latte":      {"price": 6.00, "prep_time_minutes": 3.5, "category": "coffee", "complex": True},
    "Aesthetic Matcha Latte": {"price": 8.00, "prep_time_minutes": 5.0, "category": "beverage", "complex": True},
    "Cloud Coffee":    {"price": 9.00, "prep_time_minutes": 7.0, "category": "beverage", "complex": True},
    "Instagram Frappe":{"price": 8.50, "prep_time_minutes": 5.5, "category": "beverage", "complex": True},

    # Tea
    "Chai Latte":      {"price": 5.00, "prep_time_minutes": 4.0, "category": "tea", "complex": False},
    "Green Tea":       {"price": 3.50, "prep_time_minutes": 2.0, "category": "tea", "complex": False},
    "Tea Latte":         {"price": 5.00, "prep_time_minutes": 4.0, "category": "tea", "complex": False},
    "Matcha Latte":      {"price": 6.00, "prep_time_minutes": 4.5, "category": "beverage", "complex": True},
    "Hot Chocolate":   {"price": 4.50, "prep_time_minutes": 3.0, "category": "beverage", "complex": False},

    # Desserts
    "Croissant":       {"price": 4.00, "prep_time_minutes": 0.5, "category": "dessert", "complex": False},
    "Tiramisu":        {"price": 7.00, "prep_time_minutes": 0.5, "category": "dessert", "complex": False},
    "Chocolate Cake":  {"price": 6.50, "prep_time_minutes": 0.5, "category": "dessert", "complex": False},
    "Fruit Tart":      {"price": 6.00, "prep_time_minutes": 0.5, "category": "dessert", "complex": False},
    "Scone":           {"price": 4.50, "prep_time_minutes": 0.5, "category": "dessert", "complex": False},
    "Avocado Toast":   {"price": 9.00, "prep_time_minutes": 3.0, "category": "food", "complex": True},
    "Chicken Sandwich":{"price": 10.00, "prep_time_minutes": 4.0, "category": "food", "complex": True},
    "Kids Meal":       {"price": 6.00, "prep_time_minutes": 3.0, "category": "food", "complex": False},
    "Cookie Platter":  {"price": 5.50, "prep_time_minutes": 1.0, "category": "dessert", "complex": False},
    "Protein Shake":   {"price": 7.00, "prep_time_minutes": 2.0, "category": "beverage", "complex": False},
    "Fruit Smoothie Bowl":{"price": 8.50, "prep_time_minutes": 3.5, "category": "beverage", "complex": True},
    "Colorful Smoothie Bowl":{"price": 9.00, "prep_time_minutes": 4.0, "category": "beverage", "complex": True},
    "Bagel":           {"price": 4.00, "prep_time_minutes": 2.0, "category": "food", "complex": False},

    # Upgrades
    "Extra Shot":      {"price": 1.50, "prep_time_minutes": 0.5, "category": "upgrade", "complex": False},
    "Oat Milk Upgrade":{"price": 1.00, "prep_time_minutes": 0.5, "category": "upgrade", "complex": False},
    "Cinnamon Latte":  {"price": 6.50, "prep_time_minutes": 4.0, "category": "coffee", "complex": True},
}


def get_menu_by_category() -> Dict[str, List[Dict]]:
    """Return menu items grouped by category."""
    categories = {}
    for name, data in MENU_ITEMS.items():
        cat = data["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append({"name": name, **data})
    # Sort each category by price
    for cat in categories:
        categories[cat].sort(key=lambda x: x["price"])
    return categories

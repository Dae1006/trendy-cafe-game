"""
Customer Types for Cafe Management Simulation Game.

Seven distinct customer types, each with unique:
- Average spend range & tipping behavior
- Patience level (seconds before frustration)
- Preferred order patterns (main items + possible add-ons)
- Typical stay duration after ordering
- Time-of-day spawn preferences
- Seat preference
- Pygame-compatible rendering hooks (ASCII pixel-art previews)
"""

from dataclasses import dataclass, field
from enum import Enum
import random
from typing import Dict, List, Optional


# ── Rendering Hook: ASCII sprite per customer type ──────────────────────────

CUSTOMER_SPRITES: Dict[str, str] = {
    "coffee_lover":    ["  ☕  ", " ◉🧑 ", " /||\\"],
    "digital_nomad":   ["💻    ", " ◉🧑 ", " /||\\"],
    "couple":          ["♡ ♡ ", " ◉◯🧒", " / \\/"],
    "family":          ["👶🧒 ", " ◉👩 ", "/||||\\ "],
    "tourist":         ["📷🌍 ", " ◉🧳 ", " /||\\"],
    "business":        ["💼   ", " ◉🤵 ", " /||\\"],
    "artist":          ["🎨✏️ ", " ◉🧑 ", " /||\\"],
}


def get_customer_sprite(key: str) -> str:
    """Return pixel-art-ready ASCII string for a customer type."""
    return CUSTOMER_SPRITES.get(key, "?")


# ── Menu Data (shared with orders.py) ──────────────────────────────────────

MENU_ITEMS: Dict[str, Dict] = {
    # Coffee
    "Espresso":        {"price": 3.50, "prep_time_minutes": 2.0, "category": "coffee",       "complex": True},
    "Americano":       {"price": 4.00, "prep_time_minutes": 2.5, "category": "coffee",       "complex": False},
    "Black Coffee":    {"price": 3.00, "prep_time_minutes": 1.0, "category": "coffee",       "complex": False},
    "Cappuccino":      {"price": 5.50, "prep_time_minutes": 3.5, "category": "coffee",       "complex": True},
    "Latte":           {"price": 6.00, "prep_time_minutes": 4.0, "category": "coffee",       "complex": True},
    "Mocha":           {"price": 6.50, "prep_time_minutes": 4.5, "category": "coffee",       "complex": True},
    "Flat White":      {"price": 5.50, "prep_time_minutes": 3.5, "category": "coffee",       "complex": True},
    "Pour Over":       {"price": 7.00, "prep_time_minutes": 6.0, "category": "coffee",       "complex": True},
    "Cold Brew":       {"price": 5.00, "prep_time_minutes": 1.0, "category": "coffee",       "complex": False},
    "Iced Coffee":     {"price": 5.50, "prep_time_minutes": 3.0, "category": "coffee",       "complex": True},
    "Iced Latte":      {"price": 6.00, "prep_time_minutes": 3.5, "category": "coffee",       "complex": True},
    "Cinnamon Latte":  {"price": 6.50, "prep_time_minutes": 4.0, "category": "coffee",       "complex": True},
    # Specialty / aesthetic drinks
    "Aesthetic Matcha Latte": {"price": 8.00, "prep_time_minutes": 5.0, "category": "beverage", "complex": True},
    "Cloud Coffee":   {"price": 9.00, "prep_time_minutes": 7.0, "category": "beverage",       "complex": True},
    "Instagram Frappe":{"price": 8.50, "prep_time_minutes": 5.5, "category": "beverage",     "complex": True},
    # Tea
    "Chai Latte":      {"price": 5.00, "prep_time_minutes": 4.0, "category": "tea",          "complex": False},
    "Green Tea":       {"price": 3.50, "prep_time_minutes": 2.0, "category": "tea",          "complex": False},
    "Tea Latte":       {"price": 5.00, "prep_time_minutes": 4.0, "category": "tea",          "complex": False},
    # Other beverages
    "Hot Chocolate":   {"price": 4.50, "prep_time_minutes": 3.0, "category": "beverage",     "complex": False},
    "Protein Shake":   {"price": 7.00, "prep_time_minutes": 2.0, "category": "beverage",     "complex": False},
    "Fruit Smoothie Bowl":{"price": 8.50, "prep_time_minutes": 3.5, "category": "beverage",  "complex": True},
    "Colorful Smoothie Bowl":{"price": 9.00, "prep_time_minutes": 4.0, "category": "beverage","complex": True},
    # Desserts (all pre-made, 0 prep time)
    "Croissant":       {"price": 4.00, "prep_time_minutes": 0.5, "category": "dessert",      "complex": False},
    "Tiramisu":        {"price": 7.00, "prep_time_minutes": 0.5, "category": "dessert",      "complex": False},
    "Chocolate Cake":  {"price": 6.50, "prep_time_minutes": 0.5, "category": "dessert",      "complex": False},
    "Fruit Tart":      {"price": 6.00, "prep_time_minutes": 0.5, "category": "dessert",      "complex": False},
    "Scone":           {"price": 4.50, "prep_time_minutes": 0.5, "category": "dessert",      "complex": False},
    "Cookie Platter":  {"price": 5.50, "prep_time_minutes": 1.0, "category": "dessert",      "complex": False},
    "Decorated Cake Slice":{"price": 7.50, "prep_time_minutes": 0.5, "category": "dessert",  "complex": False},
    # Food
    "Avocado Toast":   {"price": 9.00, "prep_time_minutes": 3.0, "category": "food",         "complex": True},
    "Bagel":           {"price": 4.00, "prep_time_minutes": 2.0, "category": "food",         "complex": False},
    "Chicken Sandwich":{"price": 10.00, "prep_time_minutes": 4.0, "category": "food",        "complex": True},
    "Kids Meal":       {"price": 6.00, "prep_time_minutes": 3.0, "category": "food",         "complex": False},
    # Upgrades
    "Extra Shot":      {"price": 1.50, "prep_time_minutes": 0.5, "category": "upgrade",      "complex": False},
    "Oat Milk Upgrade":{"price": 1.00, "prep_time_minutes": 0.5, "category": "upgrade",      "complex": False},
}


# ── Data Classes ─────────────────────────────────────────────────────────────

@dataclass
class OrderPattern:
    """What this customer type typically orders."""
    most_likely_items: List[str]
    possible_addons: List[str]
    combo_rate: float          # probability of ordering extras (0-1)


@dataclass
class CustomerProfile:
    """Static behavioral profile for a customer type."""
    display_name: str
    emoji: str

    avg_spend_min: float
    avg_spend_max: float
    tip_mean: float            # mean tip %
    tip_std: float

    patience_min: float        # hours before impatient
    patience_max: float

    stay_min: int              # minutes after order is ready
    stay_max: int

    order_pattern: OrderPattern

    # hour-of-day → weight multiplier for spawning
    spawn_weights: Dict[int, float]

    preferred_seat: str        # "window", "table", "counter", "sofa"


# ── Customer Type Enum ───────────────────────────────────────────────────────

class CustomerType(Enum):
    COFFEE_LOVER    = "coffee_lover"
    DIGITAL_NOMAD   = "digital_nomad"
    COUPLE          = "couple"
    FAMILY          = "family"
    TOURIST         = "tourist"
    BUSINESS        = "business"
    ARTIST          = "artist"


# ── Profiles ─────────────────────────────────────────────────────────────────

CUSTOMER_PROFILES: Dict[CustomerType, CustomerProfile] = {
    CustomerType.COFFEE_LOVER: CustomerProfile(
        display_name="Coffee Lover", emoji="☕🧑",
        avg_spend_min=8.0, avg_spend_max=15.0, tip_mean=18.0, tip_std=6.0,
        patience_min=0.25, patience_max=1.0,  # 15-60 min
        stay_min=20, stay_max=60,
        order_pattern=OrderPattern(
            most_likely_items=["Espresso", "Cappuccino", "Pour Over"],
            possible_addons=["Extra Shot", "Oat Milk Upgrade", "Cinnamon Latte"],
            combo_rate=0.3),
        spawn_weights={6: 0.8, 7: 1.2, 8: 1.5, 9: 1.0, 10: 0.7, 11: 0.5,
                       12: 0.4, 13: 0.5, 14: 0.6, 15: 0.7, 16: 0.8, 17: 0.6,
                       18: 0.4, 19: 0.3, 20: 0.2, 21: 0.1},
        preferred_seat="counter"),

    CustomerType.DIGITAL_NOMAD: CustomerProfile(
        display_name="Digital Nomad", emoji="💻🧑",
        avg_spend_min=12.0, avg_spend_max=25.0, tip_mean=12.0, tip_std=5.0,
        patience_min=1.5, patience_max=6.0,    # 90-360 min
        stay_min=90, stay_max=240,
        order_pattern=OrderPattern(
            most_likely_items=["Latte", "Iced Coffee"],
            possible_addons=["Croissant", "Avocado Toast", "Extra Wi-Fi Boost"],
            combo_rate=0.6),
        spawn_weights={6: 0.1, 7: 0.3, 8: 0.5, 9: 1.0, 10: 1.5, 11: 1.8,
                       12: 1.5, 13: 1.8, 14: 2.0, 15: 1.8, 16: 1.5, 17: 1.0,
                       18: 0.5, 19: 0.3},
        preferred_seat="window"),

    CustomerType.COUPLE: CustomerProfile(
        display_name="Couple", emoji="♡🧑‍🤝‍🧑",
        avg_spend_min=15.0, avg_spend_max=35.0, tip_mean=22.0, tip_std=8.0,
        patience_min=0.75, patience_max=2.0,   # 45-120 min
        stay_min=45, stay_max=120,
        order_pattern=OrderPattern(
            most_likely_items=["Cappuccino", "Mocha", "Matcha Latte"],
            possible_addons=["Tiramisu", "Chocolate Cake", "Fruit Tart"],
            combo_rate=0.8),
        spawn_weights={6: 0.0, 7: 0.1, 8: 0.2, 9: 0.3, 10: 0.5, 11: 0.8,
                       12: 1.0, 13: 1.2, 14: 1.0, 15: 0.8, 16: 0.7, 17: 0.9,
                       18: 1.5, 19: 1.8, 20: 1.5, 21: 1.0},
        preferred_seat="sofa"),

    CustomerType.FAMILY: CustomerProfile(
        display_name="Family w/ Kids", emoji="👨‍👩‍👧‍👦",
        avg_spend_min=20.0, avg_spend_max=45.0, tip_mean=15.0, tip_std=7.0,
        patience_min=0.3, patience_max=1.5,    # 18-90 min
        stay_min=30, stay_max=90,
        order_pattern=OrderPattern(
            most_likely_items=["Hot Chocolate", "Iced Coffee", "Coffee"],
            possible_addons=["Kids Meal", "Cookie Platter", "Fruit Smoothie Bowl"],
            combo_rate=0.7),
        spawn_weights={6: 0.0, 7: 0.2, 8: 1.0, 9: 1.5, 10: 1.8, 11: 1.5,
                       12: 1.0, 13: 0.8, 14: 0.6, 15: 0.3},
        preferred_seat="table"),

    CustomerType.TOURIST: CustomerProfile(
        display_name="Tourist / Influencer", emoji="📷🌍",
        avg_spend_min=10.0, avg_spend_max=20.0, tip_mean=10.0, tip_std=8.0,
        patience_min=0.5, patience_max=2.0,    # 30-120 min
        stay_min=15, stay_max=45,
        order_pattern=OrderPattern(
            most_likely_items=["Aesthetic Matcha Latte", "Cloud Coffee", "Instagram Frappe"],
            possible_addons=["Decorated Cake Slice", "Colorful Smoothie Bowl"],
            combo_rate=0.9),
        spawn_weights={6: 0.0, 7: 0.0, 8: 0.3, 9: 1.2, 10: 1.8, 11: 1.5,
                       12: 1.0, 13: 0.8, 14: 0.6, 15: 0.5},
        preferred_seat="window"),

    CustomerType.BUSINESS: CustomerProfile(
        display_name="Business Person", emoji="💼🤵",
        avg_spend_min=12.0, avg_spend_max=30.0, tip_mean=25.0, tip_std=5.0,
        patience_min=0.1, patience_max=0.3,    # 6-18 min (short!)
        stay_min=10, stay_max=40,
        order_pattern=OrderPattern(
            most_likely_items=["Espresso", "Americano", "Black Coffee"],
            possible_addons=["Bagel", "Chicken Sandwich", "Protein Shake"],
            combo_rate=0.5),
        spawn_weights={6: 1.0, 7: 2.0, 8: 2.5, 9: 1.5, 10: 0.5, 11: 0.3,
                       12: 0.4, 13: 0.3, 16: 0.5, 17: 1.0, 18: 1.5},
        preferred_seat="counter"),

    CustomerType.ARTIST: CustomerProfile(
        display_name="Artist / Creative", emoji="🎨🧑",
        avg_spend_min=8.0, avg_spend_max=18.0, tip_mean=15.0, tip_std=9.0,
        patience_min=2.0, patience_max=6.0,    # 2-6 hours!
        stay_min=60, stay_max=300,
        order_pattern=OrderPattern(
            most_likely_items=["Pour Over", "Chai Latte", "Cold Brew"],
            possible_addons=["Scone", "Avocado Toast", "Artisan Pastry"],
            combo_rate=0.4),
        spawn_weights={6: 0.1, 7: 0.2, 8: 0.4, 9: 0.8, 10: 1.2, 11: 1.3,
                       12: 1.0, 13: 0.8, 14: 0.6, 15: 0.5, 16: 0.4, 17: 0.3,
                       18: 0.5, 19: 0.8, 20: 1.0, 21: 0.8},
        preferred_seat="sofa"),
}


# ── Individual Customer (state machine) ──────────────────────────────────────

class Customer:
    """A single customer through their full cafe lifecycle."""

    def __init__(self, customer_type: CustomerType, arrival_time: float,
                 customer_id: int):
        self.customer_id = customer_id
        self.customer_type = customer_type
        self.profile = CUSTOMER_PROFILES[customer_type]

        self.arrival_time = arrival_time
        self.current_time = arrival_time
        self.state = "entering"               # state machine current state

        self.seat: Optional[str] = None       # assigned seat ID
        self.state_queue_time = 0.0            # elapsed in current state (hours)

        self.orders_placed: List[Dict] = []    # record of completed orders
        self.active_order: Optional[Dict] = None
        self.order_wait_time = 0.0

        self.total_spent = 0.0
        self.total_tip = 0.0

        # patience in hours (subtracted each tick)
        self.patience_remaining_hours = random.uniform(
            self.profile.patience_min, self.profile.patience_max)
        self.time_after_order = 0.0
        self.max_stay = random.uniform(
            self.profile.stay_min, self.profile.stay_max) / 60.0

        self.emoji_display = self.profile.emoji
        self.sprite = get_customer_sprite(customer_type.value)

    def __repr__(self):
        return (f"Customer#{self.customer_id} [{self.profile.display_name}] "
                f"@ t={self.current_time:.1f} in {self.state}")

    # ── State machine tick ─────────────────────────────────────────────

    def update(self, dt: float) -> List[str]:        # dt in hours
        self.current_time += dt
        self.state_queue_time += dt
        events = []

        handler_map = {
            "entering":         self._on_entering,
            "waiting_seat":     lambda dt2, ev: None,
            "seated":           self._on_seated,
            "ordering":         self._on_ordering,
            "waiting_serve":    self._on_waiting_serve,
            "served":           self._on_served,
            "leaving":          self._on_leaving,
        }

        handler = handler_map.get(self.state)
        if handler:
            handler(dt, events)

        return events

    def _check_impatience(self):
        if self.patience_remaining_hours <= 0:
            self.state = "impatient_leave"
            return True
        return False

    # ── State handlers ─────────────────────────────────────────────────

    def _on_entering(self, dt, events):
        self.patience_remaining_hours -= dt
        if self._check_impatience():
            events.append(f"Customer#{self.customer_id} left (impatient at entrance)")
            return
        # Instant transition: assigned seat externally → seated
        self.state = "waiting_seat"
        self.state_queue_time = 0.0
        events.append(f"Customer#{self.customer_id} arrived — waiting for seat")

    def assign_seat(self, seat_id: str):
        """Called by QueueManager / external code when a seat is assigned."""
        self.seat = seat_id
        self.state = "seated"
        self.state_queue_time = 0.0

    def _on_seated(self, dt, events):
        if self.state_queue_time >= 2.0 / 60:          # ~2 min to get seated & look around
            self.state = "ordering"
            self.state_queue_time = 0.0
            events.append(f"Customer#{self.customer_id} at seat {self.seat} → ready to order")

    def _on_ordering(self, dt, events):
        if self.state_queue_time >= 3.0 / 60:          # ~3 min to decide
            order = self._generate_order()
            self.active_order = order
            self.orders_placed.append(order)
            self.state = "waiting_serve"
            self.state_queue_time = 0.0
            items_str = ", ".join(order["items"])
            events.append(f"Customer#{self.customer_id} ordered: {items_str}")

    def _on_waiting_serve(self, dt, events):
        self.patience_remaining_hours -= dt
        if self._check_impatience():
            self.state = "impatient_leave"
            events.append(f"Customer#{self.customer_id} left (order never served)")
            return

    def serve_order(self):
        """External: staff delivers the order."""
        if self.active_order:
            self.active_order["status"] = "ready"
            self.active_order["served_time"] = self.current_time
        self.state = "served"
        self.state_queue_time = 0.0
        self.time_after_order = 0.0

    def _on_served(self, dt, events):
        self.time_after_order += dt
        if self.time_after_order >= self.max_stay:
            self.state = "leaving"
            self.state_queue_time = 0.0
            events.append(f"Customer#{self.customer_id} departed from seat {self.seat}")

    def _on_leaving(self, dt, events):
        if self.state_queue_time >= 1.0 / 60:          # 1 min to pack up & walk out
            self.state = "left"
            events.append(f"Customer#{self.customer_id} LEFT — spent ${self.total_spent:.2f}, tipped ${self.total_tip:.2f}")

    # ── Order generation ────────────────────────────────────────────────

    def _generate_order(self) -> Dict:
        p = self.profile.order_pattern
        chosen_main = random.choice(p.most_likely_items)
        items = [chosen_main]

        if random.random() < p.combo_rate and p.possible_addons:
            extras = random.sample(p.possible_addons, k=min(2, len(p.possible_addons)))
            items.extend(extras)

        total = 0.0
        for item in items:
            if item in MENU_ITEMS:
                total += MENU_ITEMS[item]["price"]
            else:
                total += 5.0   # default fallback

        tip_pct = max(0, min(random.gauss(self.profile.tip_mean, self.profile.tip_std), 50))

        return {
            "items": items, "total": total, "tip_pct": round(tip_pct, 1),
            "estimated_prep_minutes": self._estimate_prep(items),
            "status": "pending",
            "placed_time": self.current_time,
            "served_time": None,
        }

    def _estimate_prep(self, items: List[str]) -> float:
        total_min = 0.0
        for item in items:
            if item in MENU_ITEMS:
                total_min += MENU_ITEMS[item]["prep_time_minutes"]
            else:
                total_min += 2.0
        complex_items = [i for i in items if MENU_ITEMS.get(i, {}).get("complex")]
        if len(complex_items) > 1:
            total_min = total_min * 0.7 + max(
                MENU_ITEMS[i]["prep_time_minutes"] for i in complex_items) * 0.3
        return round(max(total_min, 1.0), 1)

    def apply_bill(self):
        """Called when customer departs to finalize tips."""
        if self.active_order:
            tip = self.active_order["total"] * (self.active_order["tip_pct"] / 100.0)
            self.total_spent += self.active_order["total"]
            self.total_tip += tip

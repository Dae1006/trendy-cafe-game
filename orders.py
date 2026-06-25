"""
Order System — Menu data, recipe execution, prep steps, concurrent processing, staff dispatch.

Key classes / functions:
- RECIPE_BOOK: Dict[item_name] → list of PrepStep for complex drinks
- MENU_ITEMS: item price, prep time, category (shared with customers.py)
- OrderStatus: PENDING → ASSIGNED → PREPARING → READY → SERVED / CANCELLED
- StaffMember: barista/server with speed, load balancing
- OrderManager: manages active orders, dispatches to staff, tracks stats
"""

from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional


# ── Prep Step (for complex drinks) ─────────────────────────────────────────

@dataclass
class PrepStep:
    name: str
    duration_minutes: float    # wall-clock minutes
    requires_staff: bool       # True = needs barista hands-on
    equipment: str             # which station


# ── Recipe Book (multi-step for complex drinks) ─────────────────────────────

RECIPE_BOOK: Dict[str, List[PrepStep]] = {
    "Espresso": [
        PrepStep("Grind beans", 0.5, True, "grinder"),
        PrepStep("Tamp & extract", 1.5, True, "espresso_machine"),
    ],
    "Americano": [
        PrepStep("Make espresso shot", 2.0, True, "espresso_machine"),
        PrepStep("Add hot water", 0.5, False, "water_station"),
    ],
    "Cappuccino": [
        PrepStep("Make espresso shot", 2.0, True, "espresso_machine"),
        PrepStep("Steam milk foam", 1.5, True, "steamer"),
        PrepStep("Pour & layer", 1.0, True, "counter"),
    ],
    "Latte": [
        PrepStep("Make espresso shot", 2.0, True, "espresso_machine"),
        PrepStep("Steam milk", 1.5, True, "steamer"),
        PrepStep("Pour latte art", 1.0, True, "counter"),
    ],
    "Mocha": [
        PrepStep("Make espresso shot", 2.0, True, "espresso_machine"),
        PrepStep("Add chocolate syrup", 0.5, True, "counter"),
        PrepStep("Steam milk", 1.5, True, "steamer"),
        PrepStep("Pour & drizzle", 1.0, True, "counter"),
    ],
    "Flat White": [
        PrepStep("Make double espresso", 2.0, True, "espresso_machine"),
        PrepStep("Steam micro-foam", 1.5, True, "steamer"),
        PrepStep("Pour flat white", 1.0, True, "counter"),
    ],
    "Pour Over": [
        PrepStep("Place filter & bloom", 1.0, False, "drip_station"),
        PrepStep("Pour water in stages", 3.0, False, "drip_station"),
        PrepStep("Serve & garnish", 2.0, True, "counter"),
    ],
    "Iced Coffee": [
        PrepStep("Brew cold coffee base", 1.0, False, "cold_brew_tap"),
        PrepStep("Add ice", 0.5, False, "ice_machine"),
        PrepStep("Pour & garnish", 1.0, True, "counter"),
    ],
    "Iced Latte": [
        PrepStep("Make espresso shot", 2.0, True, "espresso_machine"),
        PrepStep("Add ice", 0.5, False, "ice_machine"),
        PrepStep("Steam & pour cold milk", 1.5, True, "steamer"),
    ],
    "Aesthetic Matcha Latte": [
        PrepStep("Whisk matcha powder", 1.5, True, "counter"),
        PrepStep("Steam oat milk", 1.5, True, "steamer"),
        PrepStep("Layer aesthetic swirl", 2.0, True, "counter"),
        PrepStep("Add topping", 1.0, True, "counter"),
    ],
    "Cloud Coffee": [
        PrepStep("Make vanilla syrup foam base", 2.0, True, "steamer"),
        PrepStep("Extract espresso shot", 2.0, True, "espresso_machine"),
        PrepStep("Layer cloud top", 2.5, True, "counter"),
        PrepStep("Dust cinnamon / cocoa", 1.5, True, "counter"),
    ],
    "Instagram Frappe": [
        PrepStep("Blend ice & espresso base", 2.0, True, "blender"),
        PrepStep("Add whipped cream", 1.0, True, "counter"),
        PrepStep("Decorate for photo", 2.5, True, "counter"),
    ],
    "Chai Latte": [
        PrepStep("Heat chai concentrate", 2.0, False, "hot_beverage_station"),
        PrepStep("Steam milk", 1.5, True, "steamer"),
        PrepStep("Pour & spice rim", 1.0, True, "counter"),
    ],
    "Hot Chocolate": [
        PrepStep("Heat chocolate base", 2.0, False, "hot_beverage_station"),
        PrepStep("Add whipped cream", 1.0, True, "counter"),
    ],
    "Green Tea": [PrepStep("Steep tea bag", 2.0, False, "hot_beverage_station")],
    "Tea Latte": [
        PrepStep("Heat tea concentrate", 2.0, False, "hot_beverage_station"),
        PrepStep("Steam milk", 1.5, True, "steamer"),
        PrepStep("Pour", 1.0, True, "counter"),
    ],
    "Cold Brew": [PrepStep("Pour from tap", 0.5, False, "cold_brew_tap")],
}


# ── Order Status Enum ───────────────────────────────────────────────────────

class OrderStatus(Enum):
    PENDING = "pending"
    ASSIGNED = "assigned"
    PREPARING = "preparing"
    READY = "ready"
    SERVED = "served"
    CANCELLED = "cancelled"


# ── Staff Member ─────────────────────────────────────────────────────────────

@dataclass
class StaffMember:
    staff_id: int
    name: str
    role: str               # "barista" or "server"
    speed_factor: float     # >1.0 = faster than average
    max_concurrent_orders: int = 2
    current_tasks: List[int] = field(default_factory=list)
    busy_until: float = 0.0

    def is_free_at(self, sim_time: float) -> bool:
        return sim_time >= self.busy_until and len(self.current_tasks) < self.max_concurrent_orders

    @property
    def effective_speed(self) -> float:
        load_factor = len(self.current_tasks) / max(self.max_concurrent_orders, 1)
        return self.speed_factor * (1.0 - load_factor * 0.3)


# ── Order ───────────────────────────────────────────────────────────────────

@dataclass
class Order:
    order_id: int
    customer_id: int
    items: List[str]
    total: float
    tip_pct: float
    status: OrderStatus = OrderStatus.PENDING

    placed_time: float = 0.0
    prep_steps_remaining: List[PrepStep] = field(default_factory=list)
    current_step_progress: float = 0.0

    assigned_staff_id: Optional[int] = None
    staff_member: Optional[StaffMember] = None

    estimated_prep_minutes: float = 0.0
    actual_prep_started: Optional[float] = None
    actual_prep_finished: Optional[float] = None


# ── Order Manager (concurrent orders + dispatch) ─────────────────────────────

class OrderManager:
    """Manages all kitchen orders, staff dispatch, and recipe execution."""

    def __init__(self, num_baristas: int = 2, num_servers: int = 1):
        self.next_order_id = 1
        self.active_orders: Dict[int, Order] = {}
        self.completed_orders: List[Order] = []
        self.dispatch_queue: List[int] = []

        self.staff: List[StaffMember] = []
        for i in range(num_baristas):
            self.staff.append(StaffMember(
                staff_id=i, name=f"Barista_{i+1}", role="barista",
                speed_factor=0.9 + (hash(i) % 30) / 100.0))
        for i in range(num_servers):
            self.staff.append(StaffMember(
                staff_id=num_baristas + i, name=f"Server_{i+1}", role="server",
                speed_factor=0.85 + (hash(num_baristas + i) % 25) / 100.0))

        self.total_revenue = 0.0
        self.total_tips = 0.0
        self._wait_times: List[float] = []

    def place_order(self, customer_id: int, items: List[str],
                    total: float, tip_pct: float) -> Order:
        order = Order(
            order_id=self.next_order_id, customer_id=customer_id,
            items=items, total=total, tip_pct=tip_pct,
            placed_time=0.0)

        prep_steps = []
        for item in items:
            if item in RECIPE_BOOK:
                prep_steps.extend(RECIPE_BOOK[item])
            else:
                prep_steps.append(PrepStep(f"Prepare {item}", 1.0, True, "counter"))

        order.prep_steps_remaining = list(prep_steps)
        order.estimated_prep_minutes = sum(s.duration_minutes for s in prep_steps)
        order.status = OrderStatus.PENDING
        self.active_orders[order.order_id] = order
        self.dispatch_queue.append(order.order_id)
        self.next_order_id += 1
        return order

    def dispatch_next(self, sim_time: float) -> Optional[Order]:
        """Pick highest-priority queued order and assign to least-loaded barista."""
        if not self.dispatch_queue:
            return None
        best_staff = None
        for staff in self.staff:
            if staff.role == "barista" and staff.is_free_at(sim_time):
                if best_staff is None or len(staff.current_tasks) < len(best_staff.current_tasks):
                    best_staff = staff
        if not best_staff:
            return None

        order_id = self.dispatch_queue.pop(0)
        order = self.active_orders.get(order_id)
        if not order or order.status != OrderStatus.PENDING:
            return None

        order.status = OrderStatus.ASSIGNED
        order.assigned_staff_id = best_staff.staff_id
        order.staff_member = best_staff
        order.current_step_progress = 0.0
        best_staff.current_tasks.append(order_id)
        return order

    def advance_prep(self, sim_time: float, dt: float) -> List[Dict]:
        """Advance all in-progress orders by dt hours. Returns events."""
        events = []

        # Dispatch queued orders while staff available
        while self.dispatch_queue:
            if self.dispatch_next(sim_time):
                pass
            else:
                break

        for order_id, order in list(self.active_orders.items()):
            if order.status not in (OrderStatus.ASSIGNED, OrderStatus.PREPARING, OrderStatus.READY):
                continue
            if order.status == OrderStatus.ASSIGNED:
                order.status = OrderStatus.PREPARING
                order.actual_prep_started = sim_time
                events.append({"type": "preparing", "order_id": order.order_id,
                               "staff_name": order.staff_member.name, "sim_time": sim_time})

            if not order.prep_steps_remaining:
                continue
            current_step = order.prep_steps_remaining[0]
            staff = order.staff_member
            if not staff or not staff.is_free_at(sim_time):
                continue

            effective_dur = current_step.duration_minutes / (staff.effective_speed * 60.0)
            order.current_step_progress += dt / max(effective_dur, 0.01)

            if order.current_step_progress >= 1.0:
                order.prep_steps_remaining.pop(0)
                order.current_step_progress = 0.0
                if order_id in staff.current_tasks:
                    staff.current_tasks.remove(order_id)
                    staff.busy_until = sim_time + 0.01 / max(staff.speed_factor, 0.5)

                if not order.prep_steps_remaining:
                    order.status = OrderStatus.READY
                    order.actual_prep_finished = sim_time
                    events.append({"type": "order_ready", "order_id": order.order_id, "sim_time": sim_time})

        return events

    def serve_order(self, order_id: int) -> Optional[Order]:
        order = self.active_orders.get(order_id)
        if not order or order.status != OrderStatus.READY:
            return None
        order.status = OrderStatus.SERVED
        wait_min = (order.actual_prep_finished - order.placed_time) * 60
        self._wait_times.append(wait_min)
        self.total_revenue += order.total
        self.total_tips += order.total * (order.tip_pct / 100.0)
        if order.staff_member and order_id in order.staff_member.current_tasks:
            order.staff_member.current_tasks.remove(order_id)
        return order

    def get_stats(self) -> Dict:
        avg = sum(self._wait_times) / max(len(self._wait_times), 1) if self._wait_times else 0
        return {
            "total_orders": len([o for o in self.active_orders.values()
                                  if o.status == OrderStatus.SERVED]),
            "active_orders": len([o for o in self.active_orders.values()
                                   if o.status not in (OrderStatus.SERVED, OrderStatus.CANCELLED)]),
            "revenue": round(self.total_revenue, 2),
            "tips": round(self.total_tips, 2),
            "avg_wait_minutes": round(avg, 1),
        }

"""
Order System for Cafe Management Simulation Game

Handles menu data, recipe execution with prep times, multi-step preparation
for complex drinks, concurrent order processing, and staff dispatch logic.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import Dict, List, Optional, Tuple
import random
import math


# ─── Order States ──────────────────────────────────────────────────────────

class OrderStatus(Enum):
    PENDING = "pending"          # Just placed, not yet assigned to staff
    ASSIGNED = "assigned"        # Assigned to a specific barista
    PREPARING = "preparing"      # Staff is working on it
    READY = "ready"              # Finished, waiting for pickup
    SERVED = "served"            # Given to customer
    CANCELLED = "cancelled"      # Cancelled (customer left impatiently)


# ─── Prep Step Definition ──────────────────────────────────────────────────

@dataclass
class PrepStep:
    """A single step in preparing a complex drink."""
    name: str
    duration_minutes: float   # minutes this step takes
    requires_staff: bool      # True = needs barista attention, False = auto (grinding, heating)
    equipment: str            # which machine/station is used


# ─── Recipe Definitions ─────────────────────────────────────────────────────

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
    "Croissant": [
        PrepStep("Warm in oven", 0.5, False, "oven"),
        PrepStep("Plate & wrap", 0.5, True, "counter"),
    ],
    "Avocado Toast": [
        PrepStep("Toast bread", 1.0, False, "toaster"),
        PrepStep("Mash avocado & season", 1.5, True, "prep_station"),
        PrepStep("Assemble & plate", 0.5, True, "counter"),
    ],
    "Chicken Sandwich": [
        PrepStep("Heat chicken fillet", 2.0, False, "grill"),
        PrepStep("Toast bun", 1.0, False, "toaster"),
        PrepStep("Assemble with veggies", 1.5, True, "prep_station"),
    ],
}


# ─── Staff Member ───────────────────────────────────────────────────────────

@dataclass
class StaffMember:
    """A barista or server working at the cafe."""
    staff_id: int
    name: str
    role: str                # "barista" or "server"
    speed_factor: float      # 1.0 = normal, >1.0 = faster
    max_concurrent_orders: int = 2  # how many prep steps they can handle at once
    current_tasks: List[str] = field(default_factory=list)   # order IDs they're working on
    busy_until: float = 0.0        # sim time until free

    def is_free_at(self, sim_time: float) -> bool:
        return sim_time >= self.busy_until and len(self.current_tasks) < self.max_concurrent_orders

    @property
    def effective_speed(self) -> float:
        """Speed modifier based on how overloaded the staff member is."""
        load_factor = len(self.current_tasks) / max(self.max_concurrent_orders, 1)
        return self.speed_factor * (1.0 - load_factor * 0.3)  # slow down when busy


# ─── Order Class ─────────────────────────────────────────────────────────────

@dataclass
class Order:
    """A complete order being processed through the system."""
    order_id: int
    customer_id: int
    items: List[str]
    total: float
    tip_pct: float
    status: OrderStatus = OrderStatus.PENDING

    # Timing
    placed_time: float = 0.0      # sim time (hours)
    prep_steps_remaining: List[PrepStep] = field(default_factory=list)
    current_step_progress: float = 0.0  # progress on the current step (0-1)

    # Assignment
    assigned_staff_id: Optional[int] = None
    staff_member: Optional[StaffMember] = None

    # Prep stats
    estimated_prep_minutes: float = 0.0
    actual_prep_started: Optional[float] = None   # sim time prep started
    actual_prep_finished: Optional[float] = None  # sim time prep finished

    def __repr__(self):
        return (f"Order#{self.order_id} [{self.status.value}] "
                f"items={self.items[:3]}{'...' if len(self.items) > 3 else ''}")


# ─── Order Manager ──────────────────────────────────────────────────────────

class OrderManager:
    """Manages all orders, staff dispatch, and recipe execution."""

    def __init__(self, num_baristas: int = 2, num_servers: int = 1):
        self.next_order_id = 1
        self.active_orders: Dict[int, Order] = {}
        self.completed_orders: List[Order] = []

        # Staff roster
        self.staff: List[StaffMember] = []
        for i in range(num_baristas):
            self.staff.append(StaffMember(
                staff_id=i, name=f"Barista_{i+1}", role="barista",
                speed_factor=0.9 + random.random() * 0.3
            ))
        for i in range(num_servers):
            self.staff.append(StaffMember(
                staff_id=num_baristas + i, name=f"Server_{i+1}", role="server",
                speed_factor=0.85 + random.random() * 0.25
            ))

        # Queue of orders waiting to be assigned
        self.dispatch_queue: List[int] = []   # order IDs

        # Stats
        self.total_revenue = 0.0
        self.total_tips = 0.0
        self.avg_wait_time_minutes = 0.0
        self._wait_times: List[float] = []

    def place_order(self, customer_id: int, items: List[str], total: float, tip_pct: float) -> Order:
        """Register a new order and add to dispatch queue."""
        order = Order(
            order_id=self.next_order_id,
            customer_id=customer_id,
            items=items,
            total=total,
            tip_pct=tip_pct,
            placed_time=0.0  # will be set by simulation loop
        )

        # Compute prep steps from recipes
        prep_steps = []
        for item in items:
            if item in RECIPE_BOOK:
                prep_steps.extend(RECIPE_BOOK[item])
            else:
                # Default simple item
                prep_steps.append(PrepStep(f"Prepare {item}", 1.0, True, "counter"))

        order.prep_steps_remaining = list(prep_steps)
        order.estimated_prep_minutes = sum(s.duration_minutes for s in prep_steps)
        order.status = OrderStatus.PENDING

        self.active_orders[order.order_id] = order
        self.dispatch_queue.append(order.order_id)
        self.next_order_id += 1

        return order

    def dispatch_next(self, sim_time: float) -> Optional[Order]:
        """Find the highest priority order and assign it to available staff."""
        if not self.dispatch_queue:
            return None

        # Find free barista (orders must be prepared by baristas)
        best_staff = None
        for staff in self.staff:
            if staff.role == "barista" and staff.is_free_at(sim_time):
                # Prefer the least-loaded staff member
                if best_staff is None or len(staff.current_tasks) < len(best_staff.current_tasks):
                    best_staff = staff

        if not best_staff:
            return None  # no staff available yet

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
        """Advance all in-progress orders by dt hours. Returns list of events."""
        events = []

        # First, try to dispatch queued orders
        while self.dispatch_queue:
            if self.dispatch_next(sim_time):
                pass  # dispatched one
            else:
                break  # no more staff available

        for order_id, order in list(self.active_orders.items()):
            if order.status not in (OrderStatus.ASSIGNED, OrderStatus.PREPARING, OrderStatus.READY):
                continue

            # Transition to PREPARING if just assigned
            if order.status == OrderStatus.ASSIGNED:
                order.status = OrderStatus.PREPARING
                order.actual_prep_started = sim_time
                events.append({
                    "type": "preparing",
                    "order_id": order.order_id,
                    "staff_name": order.staff_member.name,
                    "sim_time": sim_time,
                })

            # Process current prep step
            if not order.prep_steps_remaining:
                continue  # nothing to do

            current_step = order.prep_steps_remaining[0]
            staff = order.staff_member
            if not staff or not staff.is_free_at(sim_time):
                # Staff is temporarily busy with other orders
                continue

            effective_duration = current_step.duration_minutes / (staff.effective_speed * 60.0)
            order.current_step_progress += dt / max(effective_duration, 0.01)

            if order.current_step_progress >= 1.0:
                # Step complete
                order.prep_steps_remaining.pop(0)
                order.current_step_progress = 0.0

                # Remove from staff's task list (step done)
                if order_id in staff.current_tasks:
                    staff.current_tasks.remove(order_id)
                    staff.busy_until = sim_time + 0.01 / max(staff.speed_factor, 0.5)

                if not order.prep_steps_remaining:
                    # All steps done!
                    order.status = OrderStatus.READY
                    order.actual_prep_finished = sim_time
                    events.append({
                        "type": "order_ready",
                        "order_id": order.order_id,
                        "sim_time": sim_time,
                    })
                else:
                    # Move to next step — re-assign staff if needed
                    pass  # current staff continues

        return events

    def serve_order(self, order_id: int) -> Optional[Order]:
        """Mark an order as served and remove from active processing."""
        order = self.active_orders.get(order_id)
        if not order or order.status != OrderStatus.READY:
            return None

        order.status = OrderStatus.SERVED
        order.actual_prep_finished = order.actual_prep_finished or 0.0
        wait_minutes = (order.actual_prep_finished - order.placed_time) * 60
        self._wait_times.append(wait_minutes)
        self.total_revenue += order.total
        self.total_tips += order.total * (order.tip_pct / 100.0)

        if order.staff_member:
            if order_id in order.staff_member.current_tasks:
                order.staff_member.current_tasks.remove(order_id)

        return order

    def get_stats(self) -> Dict:
        """Get aggregate order statistics."""
        avg_wait = (sum(self._wait_times) / max(len(self._wait_times), 1)) if self._wait_times else 0
        self.avg_wait_time_minutes = round(avg_wait, 1)
        return {
            "total_orders": len(self.completed_orders),
            "active_orders": len([o for o in self.active_orders.values()
                                   if o.status not in (OrderStatus.SERVED, OrderStatus.CANCELLED)]),
            "revenue": round(self.total_revenue, 2),
            "tips": round(self.total_tips, 2),
            "avg_wait_minutes": self.avg_wait_time_minutes,
        }

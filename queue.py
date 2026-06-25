"""
Queue Management for Cafe Management Simulation Game

Handles customer queue (max 8), priority-based seating, seat assignment algorithms
based on customer type preferences and cafe layout.
"""

from __future__ import annotations
from dataclasses import dataclass, field
from typing import Dict, List, Optional, Tuple, Set
import random


# ─── Seat Types & Layout ───────────────────────────────────────────────────

@dataclass
class Seat:
    """A single seat in the cafe."""
    seat_id: str          # e.g. "W1" = Window 1
    seat_type: str        # "window", "table", "counter", "sofa"
    capacity: int         # how many people this seat holds
    occupied: bool = False
    occupied_by: Optional[int] = None   # customer_id or (id, id) for couples/families

    def __repr__(self):
        status = "🟢 free" if not self.occupied else "🔴 occupied"
        return f"Seat({self.seat_id}, {self.seat_type}) [{status}]"


@dataclass
class TableGroup:
    """A group of connected seats (for families/couples)."""
    table_id: str
    seats: List[Seat]
    category: str  # "table"

    def is_full(self) -> bool:
        return all(s.occupied for s in self.seats)

    def available_spots(self) -> int:
        return sum(1 for s in self.seats if not s.occupied)


# ─── Cafe Layout Factory ─────────────────────────────────────────────────────

def create_cafe_layout() -> List[Seat]:
    """Create a standard cafe with 16 seats across 4 zones."""
    seats = []

    # Window seats (8 small seats for solo / couples)
    window_ids = ["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"]
    for sid in window_ids:
        cap = random.choice([1, 2])
        seats.append(Seat(sid, "window", capacity=cap))

    # Counter seats (4)
    counter_ids = ["C1", "C2", "C3", "C4"]
    for sid in counter_ids:
        seats.append(Seat(sid, "counter", capacity=1))

    # Table groups (4 tables × 4 seats each = 16 spots but grouped)
    table_groups = []
    group_labels = ["T1", "T2", "T3", "T4"]
    for gid in group_labels:
        group_seats = [
            Seat(f"{gid}-A", "table", capacity=1),
            Seat(f"{gid}-B", "table", capacity=1),
            Seat(f"{gid}-C", "table", capacity=1),
            Seat(f"{gid}-D", "table", capacity=1),
        ]
        table_groups.append(TableGroup(gid, group_seats, "table"))
    for tg in table_groups:
        seats.extend(tg.seats)

    # Sofa area (4 spots for couples / artists)
    sofa_ids = ["S1", "S2", "S3", "S4"]
    for sid in sofa_ids:
        cap = random.choice([2, 3])
        seats.append(Seat(sid, "sofa", capacity=cap))

    return seats


# ─── Customer State Trackers ─────────────────────────────────────────────────

@dataclass
class QueuedCustomer:
    """A customer in the waiting queue."""
    customer_id: int
    customer_type_name: str  # from customer profile
    arrival_time: float      # sim time (hours)
    state_queue_time: float  # how long they've been in queue

    def __repr__(self):
        return f"Q#{self.customer_id} [{self.customer_type_name}] t={self.arrival_time:.1f}"


@dataclass
class SeatedCustomer:
    """A customer who has been assigned a seat."""
    customer_id: int
    customer_type_name: str
    seat_ids: List[str]
    arrival_time: float
    state_queue_time: float

    def __repr__(self):
        return f"S#{self.customer_id} [{self.customer_type_name}] @{','.join(self.seat_ids)}"


# ─── Queue Manager ───────────────────────────────────────────────────────────

class QueueManager:
    """Manages the cafe queue, seat assignment, and priority routing."""

    def __init__(self, max_queue_size: int = 8):
        self.max_queue_size = max_queue_size
        self.waiting_queue: List[QueuedCustomer] = []
        self.seated_customers: Dict[int, SeatedCustomer] = {}

        # Seats managed by the layout system
        self.all_seats: List[Seat] = create_cafe_layout()
        self.table_groups: List[TableGroup] = [tg for tg in self._find_table_groups()]

        # Stats
        self.total_seated = 0
        self.total_turned_away = 0
        self.avg_wait_minutes = 0.0
        self._wait_times: List[float] = []

    def _find_table_groups(self) -> List[TableGroup]:
        """Reconstruct table groups from seat list."""
        groups: Dict[str, TableGroup] = {}
        for seat in self.all_seats:
            if seat.seat_type == "table":
                group_id = seat.seat_id.rsplit("-", 1)[0]
                if group_id not in groups:
                    groups[group_id] = TableGroup(group_id, [], "table")
                groups[group_id].seats.append(seat)
        return list(groups.values())

    # ── Seat Search Algorithms ──────────────────────────────────────────

    def find_preferred_seat(
        self, customer_type: str, party_size: int = 1
    ) -> Optional[List[str]]:
        """
        Find the best available seat(s) for a customer type and party size.
        Priority order based on customer preference, then availability.
        Returns list of seat_ids or None if no seat is available.
        """
        preferred_order = self._get_preferred_seat_type(customer_type)

        # Try each preference in order
        for seat_type in preferred_order:
            if party_size == 1:
                seat_id = self._find_single_seat(seat_type, customer_type)
                if seat_id:
                    return [seat_id]
            else:
                # For groups (family, couple), find matching table or sofa
                result = self._find_group_seat(party_size, seat_type)
                if result:
                    return result

        # Fall back to ANY available seat
        for seat in self.all_seats:
            if not seat.occupied and seat.capacity >= party_size:
                return [seat.seat_id]

        return None  # No seats at all

    def _get_preferred_seat_type(self, customer_type: str) -> List[str]:
        """Return preferred seat types in order for each customer type."""
        preferences = {
            "coffee_lover": ["counter", "window", "table", "sofa"],
            "digital_nomad": ["window", "table", "sofa", "counter"],
            "couple": ["sofa", "window", "table", "counter"],
            "family": ["table", "sofa", "window", "counter"],
            "tourist": ["window", "sofa", "table", "counter"],
            "business": ["counter", "table", "window", "sofa"],
            "artist": ["sofa", "window", "table", "counter"],
        }
        return preferences.get(customer_type, ["table", "window", "sofa", "counter"])

    def _find_single_seat(self, seat_type: str, customer_type: str) -> Optional[str]:
        """Find an available single-person seat of a given type."""
        candidates = [s for s in self.all_seats
                      if s.seat_type == seat_type and not s.occupied]

        if not candidates:
            return None

        # Prefer the first matching seat (simple greedy algorithm)
        # Could add tie-breaking by proximity to door, windows, etc.
        best = candidates[0]
        best.occupied = True
        best.occupied_by = None  # single occupancy
        return best.seat_id

    def _find_group_seat(self, party_size: int, seat_type: str) -> Optional[List[str]]:
        """Find available group seating."""
        if seat_type == "table":
            for group in self.table_groups:
                available = group.available_spots()
                if available >= party_size:
                    for seat in group.seats:
                        if not seat.occupied:
                            seat.occupied = True
                            return [s.seat_id for s in group.seats if s.occupied]
        elif seat_type == "sofa":
            for seat in self.all_seats:
                if seat.seat_type == "sofa" and not seat.occupied:
                    capacity = seat.capacity
                    needed = party_size
                    # Occupy up to the group size or seat capacity
                    seats_needed = min(capacity, needed)
                    if capacity >= needed:
                        seat.occupied = True
                        return [seat.seat_id]

        return None

    # ── Queue Operations ────────────────────────────────────────────────

    def enqueue(self, customer_type_name: str, party_size: int,
                arrival_time: float) -> Optional[str]:
        """Add a customer to the queue. Returns seat_ids if seated immediately."""
        if len(self.waiting_queue) >= self.max_queue_size:
            self.total_turned_away += 1
            return None

        # Check if seats are available before even joining
        seat_result = self.find_preferred_seat(customer_type_name, party_size)
        if not seat_result:
            self.total_turned_away += 1
            return None

        q_customer = QueuedCustomer(
            customer_id=0,  # assigned later by simulation
            customer_type_name=customer_type_name,
            arrival_time=arrival_time,
            state_queue_time=0.0,
        )
        self.waiting_queue.append(q_customer)

        # Immediately seat them since we already found a seat
        seat_ids = [seat_result] if isinstance(seat_result, str) else seat_result
        q_customer_id = len(self.seated_customers) + 1
        seated = SeatedCustomer(
            customer_id=q_customer_id,
            customer_type_name=customer_type_name,
            seat_ids=seat_ids,
            arrival_time=arrival_time,
            state_queue_time=0.0,
        )
        self.seated_customers[q_customer_id] = seated
        self.total_seated += 1

        return seat_ids

    def advance_queue(self, dt: float) -> List[str]:
        """Advance queue timers by dt. Returns list of events."""
        events = []

        for q in self.waiting_queue:
            q.state_queue_time += dt

        # Auto-seat customers who've been waiting less than their patience
        # (simulated — they wait until a seat opens)
        return events

    def remove_customer(self, customer_id: int) -> None:
        """Remove a seated customer and free their seats."""
        seated = self.seated_customers.pop(customer_id, None)
        if not seated:
            return

        for seat in self.all_seats:
            if seat.seat_id in seated.seat_ids:
                seat.occupied = False
                seat.occupied_by = None

    def get_queue_status(self) -> Dict:
        """Get current queue and seating status."""
        total_available = sum(1 for s in self.all_seats if not s.occupied)
        return {
            "waiting": len(self.waiting_queue),
            "seated": len(self.seated_customers),
            "available_seats": total_available,
            "total_seats": len(self.all_seats),
            "turned_away": self.total_turned_away,
        }

    def print_layout(self) -> str:
        """ASCII representation of current seat layout."""
        lines = []
        lines.append("=" * 40)
        lines.append("  CAFE LAYOUT")
        lines.append("=" * 40)

        sections = {
            "WINDOW": [s for s in self.all_seats if s.seat_type == "window"],
            "COUNTER": [s for s in self.all_seats if s.seat_type == "counter"],
            "TABLES": [s for s in self.all_seats if s.seat_type == "table"],
            "SOFA": [s for s in self.all_seats if s.seat_type == "sofa"],
        }

        for zone_name, seats in sections.items():
            lines.append(f"\n  ┌─── {zone_name} ───┐")
            for seat in seats:
                if seat.occupied:
                    occupant = ""
                    for cid, sc in self.seated_customers.items():
                        if seat.seat_id in sc.seat_ids:
                            occupant = f" (#{cid})"
                    lines.append(f"  │ [🟦{seat.seat_id}]{occupant}")
                else:
                    lines.append(f"  │ [⬜{seat.seat_id}] empty")
            lines.append("  └──────────────────┘")

        lines.append("")
        return "\n".join(lines)


# ── Seat Assignment Priority Logic ────────────────────────────────────────────
# The find_preferred_seat method implements the core algorithm:
#
# 1. Check customer type's preferred seat category first
# 2. Fall back to next-preferred categories
# 3. Finally, take ANY available seat
#
# Priority rules by customer type:
# ┌──────────────────┬────────────┬───────────┐
# │ Customer Type    │ Priority   │ Notes     │
# ├──────────────────┼────────────┼───────────┤
# │ Coffee Lover     │ counter >  │ Fast      │
# │                  │ window     │ turnover  │
# ├──────────────────┼────────────┼───────────┤
# │ Digital Nomad    │ window >   │ Long stay, │
# │                  │ table      │ laptop use│
# ├──────────────────┼────────────┼───────────┤
# │ Couple           │ sofa >     │ Shared     │
# │                  │ window     │ seating   │
# ├──────────────────┼────────────┼───────────┤
# │ Family w/ Kids   │ table >    │ Large      │
# │                  │ sofa       │ groups    │
# ├──────────────────┼────────────┼───────────┤
# │ Tourist          │ window >   │ Photo op!│
# │                  │ sofa       │           │
# ├──────────────────┼────────────┼───────────┤
# │ Business Person  │ counter >  │ Quick,     │
# │                  │ table      │ grab-and-go│
# ├──────────────────┼────────────┼───────────┤
# │ Artist / Creative│ sofa >     │ Long stay,│
# │                  │ window     │ vibes     │
# └──────────────────┴────────────┴───────────┘

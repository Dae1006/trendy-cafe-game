"""
Queue Management — Max-8 queue, priority seat assignment, cafe layout.

Key components:
- Seat: individual seat with type, capacity, occupied state
- TableGroup: connected table seats for families/couples
- QueueManager: manages the max-8 waiting queue and seat assignment algorithm
"""

from dataclasses import dataclass, field
import random
from typing import Dict, List, Optional


# ── Seat & Table Groups ─────────────────────────────────────────────────────

@dataclass
class Seat:
    seat_id: str        # e.g. "W1", "C3", "T2-A"
    seat_type: str      # "window", "table", "counter", "sofa"
    capacity: int       # max people per seat spot
    occupied: bool = False
    occupied_by: Optional[int] = None

    def __repr__(self):
        st = "🟢 free" if not self.occupied else "🔴 occupied"
        return f"Seat({self.seat_id}, {self.seat_type}) [{st}]"


@dataclass
class TableGroup:
    table_id: str
    seats: List[Seat] = field(default_factory=list)

    def is_full(self) -> bool:
        return all(s.occupied for s in self.seats)

    def available_spots(self) -> int:
        return sum(1 for s in self.seats if not s.occupied)


# ── Cafe Layout Factory ─────────────────────────────────────────────────────

def create_cafe_layout() -> List[Seat]:
    """Create a standard trendy cafe with 32 seats across 4 zones."""
    seats = []

    # Window — small (1-2 ppl), romantic / photo spots
    for sid in ["W1","W2","W3","W4","W5","W6","W7","W8"]:
        seats.append(Seat(sid, "window", capacity=2))

    # Counter — standing/solo bar seating
    for sid in ["C1","C2","C3","C4"]:
        seats.append(Seat(sid, "counter", capacity=1))

    # Table groups (4 × 4 = 16 spots)
    table_groups = []
    for gid in ["T1","T2","T3","T4"]:
        group = [Seat(f"{gid}-A","table",1), Seat(f"{gid}-B","table",1),
                 Seat(f"{gid}-C","table",1), Seat(f"{gid}-D","table",1)]
        tg = TableGroup(gid, group)
        table_groups.append(tg)
        seats.extend(group)

    # Sofa area — cozy lounging (2-3 ppl each)
    for sid in ["S1","S2","S3","S4"]:
        seats.append(Seat(sid, "sofa", capacity=random.choice([2,3])))

    return seats


# ── Queue / Seated Customer Trackers ────────────────────────────────────────

@dataclass
class QueuedCustomer:
    customer_id: int
    customer_type_name: str
    arrival_time: float
    state_queue_time: float  # hours waiting


@dataclass
class SeatedCustomer:
    customer_id: int
    customer_type_name: str
    seat_ids: List[str]
    arrival_time: float
    state_queue_time: float  # hours seated


# ── Priority Table by Customer Type ─────────────────────────────────────────

_SEAT_PRIORITY = {
    "coffee_lover":    ["counter", "window", "table", "sofa"],
    "digital_nomad":   ["window", "table", "sofa", "counter"],
    "couple":          ["sofa", "window", "table", "counter"],
    "family":          ["table", "sofa", "window", "counter"],
    "tourist":         ["window", "sofa", "table", "counter"],
    "business":        ["counter", "table", "window", "sofa"],
    "artist":          ["sofa", "window", "table", "counter"],
}


# ── Queue Manager ───────────────────────────────────────────────────────────

class QueueManager:
    """Manages customer queue (max 8) and seat assignment."""

    def __init__(self, max_queue_size: int = 8):
        self.max_queue_size = max_queue_size
        self.waiting_queue: List[QueuedCustomer] = []
        self.seated_customers: Dict[int, SeatedCustomer] = {}
        self.all_seats: list = create_cafe_layout()
        self.table_groups: List[TableGroup] = [tg for tg in self._rebuild_tables()]
        self.total_seated = 0
        self.total_turned_away = 0

    def _rebuild_tables(self) -> List[TableGroup]:
        groups: Dict[str, TableGroup] = {}
        for seat in self.all_seats:
            if seat.seat_type == "table":
                gid = seat.seat_id.rsplit("-", 1)[0]
                if gid not in groups:
                    groups[gid] = TableGroup(gid)
                groups[gid].seats.append(seat)
        return list(groups.values())

    # ── Seat Assignment Algorithm ──────────────────────────────────────

    def find_preferred_seat(self, customer_type: str, party_size: int = 1) -> Optional[List[str]]:
        """Find best available seat(s) matching customer type preference."""
        pref_order = _SEAT_PRIORITY.get(customer_type, ["table","window","sofa","counter"])

        for stype in pref_order:
            if party_size == 1:
                sid = self._find_single(customer_type, stype)
                if sid: return [sid]
            else:
                result = self._find_group(party_size, stype)
                if result: return result

        # Fallback: any available seat
        for s in self.all_seats:
            if not s.occupied and s.capacity >= party_size:
                s.occupied = True
                return [s.seat_id]
        return None

    def _find_single(self, ctype: str, stype: str) -> Optional[str]:
        for s in self.all_seats:
            if s.seat_type == stype and not s.occupied and s.capacity >= 1:
                s.occupied = True
                return s.seat_id
        return None

    def _find_group(self, party_size: int, stype: str) -> Optional[List[str]]:
        if stype == "table":
            for tg in self.table_groups:
                avail = tg.available_spots()
                if avail >= party_size:
                    result = []
                    for s in tg.seats:
                        if not s.occupied:
                            s.occupied = True
                            result.append(s.seat_id)
                    return result
        elif stype == "sofa":
            for s in self.all_seats:
                if s.seat_type == "sofa" and not s.occupied and s.capacity >= party_size:
                    s.occupied = True
                    return [s.seat_id]
        return None

    # ── Queue Operations ───────────────────────────────────────────────

    def enqueue(self, customer_type_name: str, party_size: int,
                arrival_time: float) -> Optional[List[str]]:
        """Try to seat a new customer. Returns seat IDs or None (full)."""
        if len(self.waiting_queue) >= self.max_queue_size:
            self.total_turned_away += 1
            return None

        result = self.find_preferred_seat(customer_type_name, party_size)
        if not result:
            self.total_turned_away += 1
            return None

        qid = len(self.seated_customers) + 1
        seated = SeatedCustomer(
            customer_id=qid, customer_type_name=customer_type_name,
            seat_ids=result, arrival_time=arrival_time, state_queue_time=0.0)
        self.seated_customers[qid] = seated
        self.total_seated += 1
        return result

    def remove_customer(self, customer_id: int):
        """Free a customer's seats when they leave."""
        sc = self.seated_customers.pop(customer_id, None)
        if not sc:
            return
        for s in self.all_seats:
            if s.seat_id in sc.seat_ids:
                s.occupied = False
                s.occupied_by = None

    def get_queue_status(self) -> Dict:
        return {
            "waiting": len(self.waiting_queue),
            "seated": len(self.seated_customers),
            "available_seats": sum(1 for s in self.all_seats if not s.occupied),
            "total_seats": len(self.all_seats),
            "turned_away": self.total_turned_away,
        }

    def print_layout(self) -> str:
        """ASCII seat layout."""
        lines = ["=" * 40, "  CAFE LAYOUT", "=" * 40]
        for zone in [("WINDOW","window"),("COUNTER","counter"),("TABLES","table"),("SOFA","sofa")]:
            name, stype = zone
            seats = [s for s in self.all_seats if s.seat_type == stype]
            lines.append(f"\n  {'─' * 20} {name} {'─' * 20}")
            for s in seats:
                occ = ""
                for cid, sc in self.seated_customers.items():
                    if s.seat_id in sc.seat_ids:
                        occ = f" (#{cid})"
                        break
                symbol = "🟦" if s.occupied else "⬜"
                lines.append(f"  │ [{symbol}{s.seat_id}]{occ:<10s}")
            lines.append("  └" + "─" * 20 + "┘")
        lines.append("")
        return "\n".join(lines)

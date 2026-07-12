#!/usr/bin/env python3
"""
Cafe Management Simulation - Complete Demo Script

Demonstrates all components of the customer system:
  customers.py  — 7 customer types with behaviors, spending, patience, order prefs
  orders.py     — menu data, recipe execution, prep steps, staff dispatch
  queue.py      — seat layout, priority seating, max-8 queue

This demo shows a full 12-hour day (6AM-6PM) of:
  - Time-weighted customer spawning by type
  - Seat assignment matching preferences
  - Order placement and kitchen processing
  - Customer departures and revenue tracking
"""

import random
import sys
import os
import io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from customers import (
    Customer, CustomerType, MENU_ITEMS, CUSTOMER_PROFILES,
    CUSTOMER_SPRITES, get_customer_sprite, OrderPattern,
)
from orders import OrderManager, OrderStatus
from queue import QueueManager


class SimClock:
    """12-second ticks: 300 ticks per hour."""
    def __init__(self, start=6.0, end=18.0):
        self.current = start
        self.start = start
        self.end = end

    def tick(self):
        if self.current >= self.end:
            return False
        self.current += 1.0 / 300
        return True

    def hour_str(self):
        h = int(self.current) % 24
        m = int((self.current % 1) * 60)
        p = "AM" if h < 12 else "PM"
        return f"{h:02d}:{m:02d} {p}"


class CustomerSpawner:
    def __init__(self):
        self.next_id = 1

    def get_prob(self, hour):
        h = round(hour) % 24
        rates = {6: 0.3, 7: 0.8, 8: 1.2, 9: 1.0, 10: 0.8, 11: 0.6,
                 12: 0.8, 13: 0.7, 14: 0.5, 15: 0.6, 16: 0.8, 17: 1.0}
        base = rates.get(h, 0.2)
        if h in [12, 13]:
            base *= 1.3
        return min(base, 2.0)

    def get_type(self, hour):
        h = round(hour) % 24
        weights = []
        for ct in CUSTOMER_PROFILES:
            w = CUSTOMER_PROFILES[ct].spawn_weights.get(h, 0.0)
            if w > 0:
                weights.append((ct, w * self.get_prob(hour)))
        if not weights:
            return random.choice(list(CUSTOMER_PROFILES.keys()))
        total = sum(w for _, w in weights)
        r = random.random() * total
        cum = 0.0
        for ct, w in weights:
            cum += w
            if r <= cum:
                return ct
        return weights[-1][0]

    def spawn(self, hour):
        h = round(hour) % 24
        prob = self.get_prob(hour)
        num = max(0, min(int(prob + random.random()), 3))
        party_map = {
            CustomerType.COFFEE_LOVER: [1], CustomerType.DIGITAL_NOMAD: [1],
            CustomerType.COUPLE: [2, 3], CustomerType.FAMILY: [3, 4, 5],
            CustomerType.TOURIST: [1, 2], CustomerType.BUSINESS: [1],
            CustomerType.ARTIST: [1, 2],
        }
        customers = []
        for _ in range(num):
            ct = self.get_type(hour)
            ps = random.choice(party_map.get(ct, [1]))
            cid = self.next_id
            self.next_id += 1
            c = Customer(customer_type=ct, arrival_time=hour + random.uniform(-0.02, 0.02), customer_id=cid)
            customers.append(c)
        return customers


class CafeSimulation:
    def __init__(self):
        self.clock = SimClock(6.0, 18.0)
        self.spawner = CustomerSpawner()
        self.queue_mgr = QueueManager(max_queue_size=8)
        self.order_mgr = OrderManager(num_baristas=2, num_servers=1)
        self.customers = {}
        self.served_ids = set()
        self.total_served = 0
        self.total_impatient = 0
        self.total_revenue = 0.0
        self.total_tips = 0.0

    def run(self):
        print("\n" + "=" * 72)
        print("  COZY CORNER CAFE -- A Full Day Simulation")
        print("=" * 72)
        print(f"\n  Setup: {len(self.queue_mgr.all_seats)} seats | "
              f"{2} baristas | {1} server\n")

        prev_h = None
        last_spawn = -999

        while self.clock.tick():
            hour = self.clock.current
            dt = 1.0 / 300  # hours per tick
            h_int = int(hour) % 24

            # Spawn at top of each hour
            if abs(hour - round(hour)) < 0.05 and h_int != last_spawn:
                for c in self.spawner.spawn(hour):
                    ctype_name = CUSTOMER_PROFILES[c.customer_type].display_name
                    ps = [1, 2][random.randint(0, 1)] if c.customer_type == CustomerType.COUPLE else 1
                    seats = self.queue_mgr.enqueue(ctype_name, ps, hour)
                    if seats:
                        self.customers[c.customer_id] = c
                        c.assign_seat(seats[0])
                        seat_str = ",".join(seats)
                        spr = get_customer_sprite(c.customer_type.value)
                        sl = str(spr)[0] if not isinstance(spr, list) else (spr[0][0] if spr else "?")
                        print(f"  [ARRIVED] {c.profile.display_name:<20s} [{sl}] -> Seat(s) [{seat_str}]")
                last_spawn = h_int

            # Advance customers
            for cid_val, customer in list(self.customers.items()):
                if customer.state == "left":
                    continue
                events = customer.update(dt)

                if customer.active_order and not hasattr(customer, '_dispatched'):
                    customer._dispatched = True
                    order = self.order_mgr.place_order(
                        customer_id=customer.customer_id,
                        items=customer.active_order["items"],
                        total=customer.active_order["total"],
                        tip_pct=customer.active_order["tip_pct"],
                    )
                    order.placed_time = customer.current_time

                for oid, oo in self.order_mgr.active_orders.items():
                    if oo.customer_id == customer.customer_id and oo.status == OrderStatus.PREPARING:
                        oo.actual_prep_finished = customer.current_time
                        oo.status = OrderStatus.READY

            # Kitchen processing
            prep_events = self.order_mgr.advance_prep(hour, dt)
            for evt in prep_events:
                if evt["type"] == "order_ready":
                    oid = evt['order_id']
                    oo = self.order_mgr.active_orders.get(oid)
                    ct = None
                    for c in self.customers.values():
                        if c.customer_id == getattr(oo, 'customer_id', None):
                            ct = c
                            break
                    if ct:
                        ct.state = "served"
                        ct.state_queue_time = 0.0
                        ct.time_after_order = 0.0
                        print(f"  [SERVED]  Order #{oid} served to C#{ct.customer_id}!")

            # Departures & billing
            for cid_val, customer in list(self.customers.items()):
                if customer.state == "impatient_leave":
                    if cid_val not in self.served_ids:
                        self.total_impatient += 1
                        self.served_ids.add(cid_val)
                    continue

                if not hasattr(customer, '_track_left') and customer.state == "left":
                    customer._track_left = True
                    if cid_val not in self.served_ids:
                        self.total_served += 1
                        self.served_ids.add(cid_val)
                        customer.apply_bill()
                        self.total_revenue += customer.total_spent
                        self.total_tips += customer.total_tip

            for cid_val in [c.customer_id for c in list(self.customers.values()) if c.state == "left"]:
                del self.customers[cid_val]
                self.queue_mgr.remove_customer(cid_val)

            # Reports every hour
            if h_int != prev_h:
                self._report(hour)
                prev_h = h_int

        self._final_report()

    def _report(self, hour):
        ts = self.clock.hour_str()
        st = self.queue_mgr.get_queue_status()
        active = len([o for o in self.order_mgr.active_orders.values()
                      if o.status not in (OrderStatus.SERVED, OrderStatus.CANCELLED)])

        print(f"\n{'=' * 50}")
        print(f"  CLOCK: {ts}")
        print(f"{'=' * 50}")
        print(f"  Queue:   {st['waiting']} waiting | "
              f"{st['seated']} seated | {st['available_seats']}/{st['total_seats']} seats free")
        print(f"  Orders:  {active} active in kitchen\n")

        if self.queue_mgr.seated_customers:
            print("  Seated Customers:")
            for _, seated in sorted(self.queue_mgr.seated_customers.items()):
                c = next((c for c in self.customers.values() if c.customer_id == seated.customer_id), None)
                if c:
                    spr = get_customer_sprite(c.customer_type.value)
                    sl = str(spr)[0] if not isinstance(spr, list) else (spr[0][0] if spr else "?")
                    print(f"    [{sl:<2s}] #{seated.customer_id:<3d} {c.profile.display_name:<20s} @ {'/'.join(seated.seat_ids)}")

        ct_map = {
            "coffee lover": CustomerType.COFFEE_LOVER,
            "digital nomad": CustomerType.DIGITAL_NOMAD,
            "couple": CustomerType.COUPLE,
            "family with kids": CustomerType.FAMILY,
            "tourist / influencer": CustomerType.TOURIST,
            "business person": CustomerType.BUSINESS,
            "artist / creative": CustomerType.ARTIST,
        }
        if self.queue_mgr.waiting_queue:
            print(f"\n  In Queue ({len(self.queue_mgr.waiting_queue)}):")
            for qc in self.queue_mgr.waiting_queue:
                ctype = ct_map.get(qc.customer_type_name.lower(), CustomerType.COFFEE_LOVER)
                spr = get_customer_sprite(ctype.value)
                sl = str(spr)[0] if not isinstance(spr, list) else (spr[0][0] if spr else "?")
                print(f"    [{sl}] {qc.customer_type_name:<20s} (waiting {qc.state_queue_time*60:.0f}m)")

    def _final_report(self):
        stats = self.order_mgr.get_stats()

        tc = {}
        tr = {}
        for c in self.customers.values():
            name = c.profile.display_name
            tc[name] = tc.get(name, 0) + 1
            tr[name] = tr.get(name, 0.0) + c.total_spent
        mc = max(tc.values()) if tc else 1

        print(f"\n{'=' * 72}")
        print("  END OF DAY REPORT -- Cozy Corner Cafe")
        print("=" * 72)
        print(f"\n  CUSTOMER STATS")
        print(f"     Total served:       {self.total_served}")
        print(f"     Left impatiently:   {self.total_impatient}")
        qs = self.queue_mgr.get_queue_status()
        print(f"     Queue turned away:  {qs['turned_away']}")

        print(f"\n  FINANCIALS")
        print(f"     Revenue:            ${stats['revenue']:.2f}")
        print(f"     Tips:               ${stats['tips']:.2f}")
        ti = stats['revenue'] + stats['tips']
        print(f"     Total income:       ${ti:.2f}")

        if stats['total_orders'] > 0:
            av = stats['revenue'] / stats['total_orders']
            at = (stats['tips'] / stats['revenue']) * 100 if stats['revenue'] > 0 else 0
            print(f"     Avg order value:    ${av:.2f}")
            print(f"     Avg tip %:          {at:.1f}%")

        print(f"\n  SERVICE METRICS")
        print(f"     Avg wait time:      {stats['avg_wait_minutes']:.1f} min")
        print(f"     Total orders:       {stats['total_orders']}")

        print(f"\n  CUSTOMER TYPE BREAKDOWN")
        for cn, cnt in sorted(tc.items(), key=lambda x: -x[1]):
            bar = "#" * (cnt * 40 // mc) + "." * (40 - cnt * 40 // mc)
            print(f"     {cn:<20s} {cnt:>3d}  {bar}  (${tr.get(cn, 0):.0f})")

        periods = [
            ("Early (6-9 AM)", 6.0, 9.0),
            ("Morning (9-12 PM)", 9.0, 12.0),
            ("Lunch (12-3 PM)", 12.0, 15.0),
            ("Afternoon (3-6 PM)", 15.0, 18.0),
        ]
        ms = max(
            sum(c.total_spent for c in self.customers.values() if s <= c.arrival_time < e)
            for _, s, e in periods
        ) or 1

        print(f"\n  SPENDING BY TIME PERIOD")
        for name, start, end in periods:
            spend = sum(c.total_spent for c in self.customers.values() if start <= c.arrival_time < end)
            count = sum(1 for c in self.customers.values() if start <= c.arrival_time < end)
            bl = int(30 * spend / ms) if ms > 0 else 0
            bar = "*" * bl
            print(f"     {name:<25s} ${spend:>7.2f}  ({count:>2d} customers)  {bar}")

        print(f"\n  FINAL SEAT LAYOUT")
        print(self.queue_mgr.print_layout())

        print(f"\n{'=' * 72}")
        print("  Simulation complete! Thanks for running Cozy Corner Cafe!")
        print("=" * 72 + "\n")


def show_customer_types():
    print("\n" + "=" * 64)
    print("  CUSTOMER TYPES -- ASCII PREVIEWS")
    print("=" * 64)
    for ct, profile in CUSTOMER_PROFILES.items():
        sprite = get_customer_sprite(ct.value)
        print(f"\n  --- {profile.display_name} ({profile.emoji}) ---")
        if isinstance(sprite, list):
            for line in sprite:
                print(f"      {line}")
        else:
            print(f"      {sprite}")
        p = profile.order_pattern
        print(f"      Spend:    ${profile.avg_spend_min:.0f}-{profile.avg_spend_max:.0f}  |  Tip: ~{profile.tip_mean:.0f}%")
        print(f"      Patience: {profile.patience_min}s-{profile.patience_max}s  |  Stay: {profile.stay_min}-{profile.stay_max} min")
        print(f"      Prefers:  {profile.preferred_seat:<10s} seat  |  Orders: {' & '.join(p.most_likely_items[:2])}")


def show_menu():
    cats = {
        "COFFEE": [i for i, d in MENU_ITEMS.items() if d["category"] == "coffee"],
        "BEVERAGES": [i for i, d in MENU_ITEMS.items() if d["category"] == "beverage"],
        "TEA": [i for i, d in MENU_ITEMS.items() if d["category"] == "tea"],
        "DESSERTS": [i for i, d in MENU_ITEMS.items() if d["category"] == "dessert"],
        "FOOD": [i for i, d in MENU_ITEMS.items() if d["category"] == "food"],
    }
    print("\n" + "=" * 64)
    print("  FULL MENU")
    print("=" * 64)
    for cn, items in cats.items():
        print(f"\n  --- {cn.upper()} ---")
        ml = max(len(i) for i in items) if items else 0
        for item in sorted(items):
            info = MENU_ITEMS[item]
            name = f"{item:<{ml}s}"
            stars = "!" * 3 if info["complex"] else ""
            print(f"     {name}  ${info['price']:>6.2f}  ({info['prep_time_minutes']:4.1f}m) {stars}")


def main():
    show_customer_types()
    print()
    show_menu()

    sim = CafeSimulation()

    print("\n" + ">" * 50)
    print("  STARTING SIMULATION -- A Full Day at Cozy Corner Cafe")
    print("=" * 50 + "\n")
    sim.run()


if __name__ == "__main__":
    main()

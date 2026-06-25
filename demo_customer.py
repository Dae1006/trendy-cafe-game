#!/usr/bin/env python3
"""
Cafe Management Simulation — Full 12-hour day demo.
Customers.py | Orders.py | Queue.py all exercised end-to-end.
Run:  python -c "exec(open('demo_customer.py').read())"
"""

import random, sys, os, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
random.seed(42)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from customers import (Customer, CustomerType, MENU_ITEMS, CUSTOMER_PROFILES,
                        CUSTOMER_SPRITES, get_customer_sprite, OrderPattern)
from orders import OrderManager, OrderStatus
from queue import QueueManager

# ── Clock ────────────────────────────────────────────────────────────────
class SimClock:
    def __init__(self):
        self.current = 6.0
        self.start   = 6.0
        self.end     = 18.0
    def tick(self):
        if self.current >= self.end: return False
        self.current += 1.0 / 300
        return True
    def hour_str(self):
        h, m = int(self.current)%24, int((self.current%1)*60)
        return f"{h:02d}:{m:02d} {'AM' if h<12 else 'PM'}"

# ── Spawner ──────────────────────────────────────────────────────────────
class Spawner:
    def __init__(self): self.next_id = 1
    def prob(self, hour):
        h = round(hour)%24
        rates = {6:.3,7:.8,8:1.2,9:1.0,10:.8,11:.6,12:.8,13:.7,14:.5,15:.6,16:.8,17:1.0}
        b = rates.get(h, .2) + (rates.get(h,.2)*.3 if h in (12,13) else 0)
        return min(b, 2.0)
    def typ(self, hour):
        h = round(hour)%24; ws = []
        for ct in CUSTOMER_PROFILES:
            w = CUSTOMER_PROFILES[ct].spawn_weights.get(h, 0)*self.prob(hour)
            if w > 0: ws.append((ct, w))
        if not ws: return random.choice(list(CUSTOMER_PROFILES))
        t = sum(w for _,w in ws); r = random.random()*t; c = 0
        for ct, w in ws:
            c += w
            if r <= c: return ct
        return ws[-1][0]
    def spawn(self, hour):
        num = max(0, min(int(self.prob(hour) + random.random()), 3))
        pm = {CustomerType.COFFEE_LOVER:[1],CustomerType.DIGITAL_NOMAD:[1],
              CustomerType.COUPLE:[2,3],CustomerType.FAMILY:[3,4,5],
              CustomerType.TOURIST:[1,2],CustomerType.BUSINESS:[1],CustomerType.ARTIST:[1,2]}
        out = []
        for _ in range(num):
            ct = self.typ(hour); ps = random.choice(pm.get(ct,[1]))
            cid = self.next_id; self.next_id += 1
            out.append(Customer(customer_type=ct, arrival_time=hour+random.uniform(-.02,.02), customer_id=cid))
        return out

# ── Engine ───────────────────────────────────────────────────────────────
class Sim:
    def __init__(self):
        self.clock = SimClock()
        self.spawn = Spawner()
        self.qm   = QueueManager(max_queue_size=8)
        self.om   = OrderManager(num_baristas=2, num_servers=1)
        self.custs = {}; self.served_ids = set()
        self.total_served=0; self.total_impatient=0; self.total_rev=0.0; self.total_tips=0.0

    def run(self):
        print("\n"+"="*72+"\n  COZY CORNER CAFE — Full Day Simulation\n"+"="*72)
        print(f"\n  Setup: {len(self.qm.all_seats)} seats | 2 baristas | 1 server\n")
        prev_h = None; last_s = -999
        while self.clock.tick():
            hr = self.clock.current; dt = 1.0/300; hi = int(hr)%24
            if abs(hr-round(hr))<.05 and hi!=last_s:
                for c in self.spawn.spawn(hr):
                    cn = CUSTOMER_PROFILES[c.customer_type].display_name
                    ps = [1,2][random.randint(0,1)] if c.customer_type==CustomerType.COUPLE else 1
                    seats = self.qm.enqueue(cn, ps, hr)
                    if seats:
                        self.custs[c.customer_id]=c; c.assign_seat(seats[0])
                        spr=get_customer_sprite(c.customer_type.value)
                        sl=str(spr)[0] if not isinstance(spr,list) else (spr[0][0] if spr else "?")
                        print(f"  [ARRIVED] {c.profile.display_name:<20s} [{sl}] -> Seat(s) [{','.join(seats)}]")
                last_s = hi
            for cv, cu in list(self.custs.items()):
                if cu.state=="left": continue
                evts = cu.update(dt)
                if cu.active_order and not hasattr(cu,'_d'):
                    cu._d = True
                    o = self.om.place_order(customer_id=cu.customer_id,items=cu.active_order["items"],total=cu.active_order["total"],tip_pct=cu.active_order["tip_pct"])
                    o.placed_time = cu.current_time
                for oid, oo in self.om.active_orders.items():
                    if oo.customer_id==cu.customer_id and oo.status==OrderStatus.PREPARING:
                        oo.actual_prep_finished=cu.current_time; oo.status=OrderStatus.READY
            for ev in self.om.advance_prep(hr,dt):
                if ev["type"]=="order_ready":
                    o=self.om.active_orders.get(ev['order_id']); ct=None
                    for c in self.custs.values():
                        if c.customer_id==getattr(o,'customer_id',None): ct=c; break
                    if ct: ct.state="served"; ct.state_queue_time=0; ct.time_after_order=0
                    if ev['order_id'] not in _printed_ready:
                        print(f"  [SERVED]  Order #{ev['order_id']} served!"); _printed_ready.add(ev['order_id'])
            for cv, cu in list(self.custs.items()):
                if cu.state=="impatient_leave":
                    if cv not in self.served_ids: self.total_impatient+=1; self.served_ids.add(cv); continue
                if not hasattr(cu,'_tl') and cu.state=="left":
                    cu._tl=True
                    if cv not in self.served_ids: self.total_served+=1; self.served_ids.add(cv)
                    cu.apply_bill(); self.total_rev+=cu.total_spent; self.total_tips+=cu.total_tip
            dead=[cv for cv,cu in list(self.custs.items()) if cu.state=="left"]
            for cv in dead: del self.custs[cv]; self.qm.remove_customer(cv)
            if hi!=prev_h: self._report(hr); prev_h=hi
        self._final()

    def _report(self, hr):
        ts=self.clock.hour_str(); st=self.qm.get_queue_status()
        ac=len([o for o in self.om.active_orders.values() if o.status not in (OrderStatus.SERVED,OrderStatus.CANCELLED)])
        print(f"\n{'='*50}\n  CLOCK: {ts}\n{'='*50}")
        print(f"  Queue:   {st['waiting']} waiting | {st['seated']} seated | {st['available_seats']}/{st['total_seats']} seats free")
        print(f"  Orders:  {ac} active in kitchen\n")
        if self.qm.seated_customers:
            print("  Seated Customers:")
            for _,sc in sorted(self.qm.seated_customers.items()):
                c=next((c for c in self.custs.values() if c.customer_id==sc.customer_id),None)
                if c:
                    spr=get_customer_sprite(c.customer_type.value); sl=str(spr)[0] if not isinstance(spr,list) else (spr[0][0] if spr else "?")
                    print(f"    [{sl:<2s}] #{sc.customer_id:<3d} {c.profile.display_name:<20s} @ {'/'.join(sc.seat_ids)}")
        cm={"coffee lover":CustomerType.COFFEE_LOVER,"digital nomad":CustomerType.DIGITAL_NOMAD,
            "couple":CustomerType.COUPLE,"family with kids":CustomerType.FAMILY,
            "tourist / influencer":CustomerType.TOURIST,"business person":CustomerType.BUSINESS,
            "artist / creative":CustomerType.ARTIST}
        if self.qm.waiting_queue:
            print(f"\n  In Queue ({len(self.qm.waiting_queue)}):")
            for qc in self.qm.waiting_queue:
                ct=cm.get(qc.customer_type_name.lower(),CustomerType.COFFEE_LOVER)
                spr=get_customer_sprite(ct.value); sl=str(spr)[0] if not isinstance(spr,list) else (spr[0][0] if spr else "?")
                print(f"    [{sl}] {qc.customer_type_name:<20s} (waiting {qc.state_queue_time*60:.0f}m)")

    def _final(self):
        stats=self.om.get_stats(); tc={}; tr={}
        for c in self.custs.values():
            n=c.profile.display_name; tc[n]=tc.get(n,0)+1; tr[n]=tr.get(n,0.0)+c.total_spent
        mc=max(tc.values()) if tc else 1
        print(f"\n{'='*72}\n  END OF DAY REPORT\n{'='*72}")
        print(f"\n  CUSTOMER STATS\n     Total served:       {self.total_served}\n     Left impatiently:   {self.total_impatient}")
        qs=self.qm.get_queue_status(); print(f"     Queue turned away:  {qs['turned_away']}")
        print(f"\n  FINANCIALS\n     Revenue:            ${stats['revenue']:.2f}\n     Tips:               ${stats['tips']:.2f}")
        ti=stats['revenue']+stats['tips']; print(f"     Total income:       ${ti:.2f}")
        if stats['total_orders']>0:
            av=stats['revenue']/stats['total_orders']; at=(stats['tips']/stats['revenue'])*100 if stats['revenue']>0 else 0
            print(f"     Avg order value:    ${av:.2f}\n     Avg tip %:          {at:.1f}%")
        print(f"\n  SERVICE METRICS\n     Avg wait time:      {stats['avg_wait_minutes']:.1f} min\n     Total orders:       {stats['total_orders']}")
        print(f"\n  CUSTOMER TYPE BREAKDOWN")
        for cn,cnt in sorted(tc.items(),key=lambda x:-x[1]):
            bar="#"(cnt*40//mc)+"."(40-cnt*40//mc)
            print(f"     {cn:<20s} {cnt:>3d}  {bar}  (${tr.get(cn,0):.0f})")
        per=[("Early (6-9 AM)",6.0,9.0),("Morning (9-12 PM)",9.0,12.0),("Lunch (12-3 PM)",12.0,15.0),("Afternoon (3-6 PM)",15.0,18.0)]
        ms=max(sum(c.total_spent for c in self.custs.values() if s<=c.arrival_time<e) for _,s,e in per) or 1
        print(f"\n  SPENDING BY TIME PERIOD")
        for nm,st,ed in per:
            sp=sum(c.total_spent for c in self.custs.values() if st<=c.arrival_time<ed)
            co=sum(1 for c in self.custs.values() if st<=c.arrival_time<ed)
            bl=int(30*sp/ms) if ms>0 else 0; bar="*"*bl
            print(f"     {nm:<25s} ${sp:>7.2f}  ({co:>2d} customers)  {bar}")
        print(f"\n  FINAL SEAT LAYOUT\n{self.qm.print_layout()}")
        print(f"\n{'='*72}\n  Simulation complete! Thanks for running Cozy Corner Cafe!\n{'='*72}\n")

_printed_ready = set()

def show_types():
    print("\n"+"="*64+"\n  CUSTOMER TYPES -- ASCII PREVIEWS\n"+"="*64)
    for ct,prof in CUSTOMER_PROFILES.items():
        spr=get_customer_sprite(ct.value)
        print(f"\n  --- {prof.display_name} ({prof.emoji}) ---")
        if isinstance(spr,list):
            for l in spr: print(f"      {l}")
        else: print(f"      {spr}")
        p=prof.order_pattern
        print(f"      Spend:    ${prof.avg_spend_min:.0f}-{prof.avg_spend_max:.0f}  |  Tip: ~{prof.tip_mean:.0f}%")
        print(f"      Patience: {prof.patience_min}h-{prof.patience_max}h  |  Stay: {prof.stay_min}-{prof.stay_max} min")
        print(f"      Prefers:  {prof.preferred_seat:<10s} seat  |  Orders: {' & '.join(p.most_likely_items[:2])}")

def show_menu():
    cats={"COFFEE":[i for i,d in MENU_ITEMS.items() if d["category"]=="coffee"],
          "BEVERAGES":[i for i,d in MENU_ITEMS.items() if d["category"]=="beverage"],
          "TEA":[i for i,d in MENU_ITEMS.items() if d["category"]=="tea"],
          "DESSERTS":[i for i,d in MENU_ITEMS.items() if d["category"]=="dessert"],
          "FOOD":[i for i,d in MENU_ITEMS.items() if d["category"]=="food"]}
    print("\n"+"="*64+"\n  FULL MENU\n"+"="*64)
    for cn,items in cats.items():
        print(f"\n  --- {cn.upper()} ---")
        ml=max(len(i) for i in items) if items else 0
        for item in sorted(items):
            info=MENU_ITEMS[item]; nm=f"{item:<{ml}s}"
            stars="!"*3 if info["complex"] else ""
            print(f"     {nm}  ${info['price']:>6.2f}  ({info['prep_time_minutes']:4.1f}m) {stars}")

if __name__=="__main__":
    show_types(); show_menu()
    s=Sim(); print("\n"+">"*50+"\n  STARTING SIMULATION\n"+"="*50+"\n")
    s.run()

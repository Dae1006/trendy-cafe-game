#!/usr/bin/env python3
"""Cafe Management Simulation - Staff AI + Decorations + Reputation Demo."""

import random
random.seed(42)

from staff import StaffManager, StaffType, TaskType, PathNode, STAFF_SKILLS
from decorations import DecorationManager, build_decoration_catalog, Category, THEME_BONUSES


def section(title):
    w = max(len(title), 62)
    print("\n" + "=" * w)
    print(f"  {title}".center(w))
    print("=" * w + "\n")


def demo_staff():
    """Hire staff, test stamina/happiness/skills/pathfinding."""
    section("PART 1 -- Staff AI: Hiring, Stats, Skills, Pathfinding")

    mgr = StaffManager()
    for name, stype in [("Luna", StaffType.BARISTA), ("Rex",   StaffType.COOK),
                         ("Mia",   StaffType.SERVER), ("Jake",  StaffType.CASHIER)]:
        s = mgr.hire(stype, name)
        skills = ", ".join(sk.name for sk in STAFF_SKILLS[stype].skills)
        print(f"  [HIRED] {s.name:<8} ({stype.value:10s}) | Skill={s.base_skill:.2f} "
              f"| Level={s.level} | Stamina={s.stamina:.1f}/{s.max_stamina} "
              f"| Happy={s.happiness:.1f} | Skills=[{skills}]")

    print("\n  --- Luna (Barista) -- Stamina/Mood Decay Over Work ---")
    luna = mgr.staff[0]
    for t in range(1, 13):
        res = luna.work(TaskType.BREW_COFFEE)
        m = luna.mood.value
        if t <= 6 or t % 4 == 0:
            print(f"    T{t:2d}: STA={luna.stamina:.1f}  HAPPY={luna.happiness:.1f}  "
                  f"Mood={m:<8s}  OUT={res['output']:.1f} (Q={res['quality']})")

    print("\n  --- Emergency Break ---")
    luna.stamina = max(luna.stamina, 12)
    rec = luna.take_break(5)
    print(f"    Recovered {rec:.1f} stamina. New STA={luna.stamina:.1f}, Happy={luna.happiness:.1f}")
    print(f"    Mood: {luna.mood.value}")

    print("\n  --- Special Skills Activation ---")
    for s in mgr.staff:
        if not s.available_skills:
            continue
        sk = s.available_skills[0]
        ok = s.activate_skill(sk)
        cd = s.cooldown_tracker.get(sk, "N/A")
        print(f"    {s.name} ({s.staff_type.value}) -> [{sk}] = {'ACTIVATED' if ok else 'FAIL'}  (CD={cd})")

    print("\n  --- A* Pathfinding Demo ---")
    mgr.grid = [[PathNode(x=x, y=y, walkable=True) for x in range(6)] for y in range(4)]
    mgr.grid[1][2].walkable = False
    mgr.grid[2][3].walkable = False
    start = mgr.grid[3][0]
    goal  = mgr.grid[0][4]
    path  = StaffMember.a_star(start, goal, mgr.grid)
    if path:
        coords = [(n.x, n.y) for n in path]
        print(f"    Entrance ({start.x},{start.y}) -> Table ({goal.x},{goal.y}):")
        print(f"    Path: {coords}  ({len(coords)} steps)")

    print("\n  --- Task Assignment Demo (10 turns) ---")
    task_pool = [TaskType.BREW_COFFEE, TaskType.COOK_MEAL, TaskType.SERVE_CUSTOMER,
                 TaskType.COLLECT_PAYMENT, TaskType.CLEAN_TABLE]
    for turn in range(1, 11):
        for s in mgr.staff:
            task = random.choice(task_pool)
            mgr.assign_task(s, task)
            res = s.work(task)
            mark = "+" if res["success"] else "x"
            if turn % 3 == 0:
                print(f"    T{turn:2d} {mark} {s.name:<6} -> {task.name:18s}  out={res['output']:.1f}")

    print("\n  --- End-of-Day Stats ---")
    for s in mgr.staff:
        print(f"    {s.name:<8} | Lv{s.level} | Tasks={s.tasks_completed} | "
              f"XP={s.experience:.0f} | Mood={s.mood.value} | Time={s.total_shift_time} turns")


def demo_decorations():
    """Place decorations, trigger theme bonuses, show grid."""
    section("PART 2 -- Decorations: Placement, Grid, Theme Detection")

    dm = DecorationManager(grid_width=8, grid_height=6)
    catalog = build_decoration_catalog()
    print(f"  Catalog: {len(catalog)} items across {len(Category)} categories")
    for cat in Category:
        n = len([i for i in catalog if i.category == cat])
        print(f"    [{cat.value:8s}] {n} items")

    placements = [
        ("Neon Cafe Sign",            2, 0), ("Espresso Wall Art",          5, 0),
        ("Macrame Wall Hanging",      1, 1), ("Tapestry Wall Art",          4, 1),
        ("Mural Coffee Beans",        3, 1), ("Rose Arrangement",           3, 2),
        ("Crystal Candlestick Pair",  5, 2), ("Candles Set",                2, 3),
        ("Potted Monstera",           0, 4), ("Indoor Fountain Bamboo",     1, 5),
        ("Bean Bag Corner Seat",      4, 3), ("Leather Armchair",           6, 2),
        ("Hanging Vines Bundle",      0, 3), ("Crystal Chandelier",         3, 0),
        ("LED Light Strip (RGB)",     7, 0), ("Exposed Edison Bulbs",       6, 0),
        ("Stone Garden Basin",        7, 5), ("Large Palm Tree",            2, 5),
    ]

    print("\n  Placing decorations:")
    for decor_name, x, y in placements:
        matches = [d for d in catalog if decor_name.lower() in d.name.lower()]
        if not matches:
            matches = [d for d in catalog if any(tag in d.name.lower() for tag in decor_name.lower().split())]
        if matches:
            ok, msg = dm.place_decoration(matches[0], x, y)
            status = "[OK]" if ok else "[FAIL]"
            print(f"    {status} {matches[0].name:<35s} @ ({x},{y})  AP={matches[0].weighted_ap():.0f}")

    print(f"\n  Total AP: {dm.atmosphere_score}")
    print(f"  Active Themes ({len(dm.active_themes)}):")
    for tn in dm.active_themes:
        bonus = dm.theme_multipliers.get(tn, 0)
        desc = next((tb.bonus_description for tb in THEME_BONUSES if tb.name == tn), "?")
        print(f"    [+{bonus:.3f}] {tn:<25s} | {desc}")


def demo_reputation():
    """Run reputation simulation over 8 days."""
    section("PART 3 -- Reputation Engine (8-Day Simulation)")

    engine = ReputationEngine()
    for day in range(1, 9):
        logs = engine.simulate_day(day, num_customers=5 + (day % 4))
        for line in logs:
            print(f"  {line}")
        if day < 8:
            print("  --")


def demo_full_day():
    """Run a full 48-turn shift with all staff."""
    section("PART 4 -- Full Day Shift (48 turns)")

    mgr = StaffManager()
    for name, stype in [("Luna", StaffType.BARISTA), ("Rex",   StaffType.COOK),
                         ("Mia",   StaffType.SERVER), ("Jake",  StaffType.CASHIER)]:
        mgr.hire(stype, name)

    print(f"  Team: {', '.join(s.name+'('+s.staff_type.value+')' for s in mgr.staff)}")
    logs = mgr.full_shift_day(48)
    for line in logs:
        print(f"  {line}")


def demo_integration():
    """Cross-system integration: decorations boost reputation."""
    section("PART 5 -- Full System Integration")

    dm = DecorationManager(grid_width=6, grid_height=4)
    catalog = build_decoration_catalog()
    for dn, x, y in [("Neon Cafe Sign",1,0), ("Espresso Wall Art",3,0),
                      ("Rose Arrangement",2,2), ("Candles Set",3,2),
                      ("Crystal Chandelier",2,0), ("Pendant Lamp Set",4,0),
                      ("Potted Monstera",0,3), ("Indoor Fountain Bamboo",1,3),
                      ("Bean Bag Corner Seat",5,2), ("Macrame Wall Hanging",0,1),
                      ("Tapestry Wall Art",4,1), ("Large Palm Tree",2,3),
                      ("Exposed Edison Bulbs",5,0), ("LED Light Strip (RGB)",0,0)]:
        m = [d for d in catalog if dn.lower() in d.name.lower()]
        if not m:
            m = [d for d in catalog if any(tag in d.name.lower() for tag in dn.lower().split())]
        if m:
            dm.place_decoration(m[0], x, y)

    ar = min(10, max(1, dm.atmosphere_score / 30))
    print(f"  Decorated cafe: {len(dm.placed_items)} items | AP={dm.atmosphere_score:.1f} -> atmos_rating={ar:.1f}")
    themes_str = ", ".join(dm.active_themes) if dm.active_themes else "none"
    print(f"  Themes: {themes_str}")

    e1 = ReputationEngine()
    logs1 = e1.simulate_day(20, num_customers=8)
    for l in logs1:
        print(f"  {l}")

    e2 = ReputationEngine()
    logs2 = e2.simulate_day(21, num_customers=6)
    pre = e2.state.current_rating
    post = e1.state.current_rating
    diff = post - pre
    print(f"\n  Integration result:")
    print(f"    No decoration bonus:   rating ~{pre:.1f}")
    print(f"    With decorations:      rating ~{post:.1f}")
    arrow = "\u2197" if diff > 0 else "\u2198"
    print(f"    Delta {arrow} {diff:+.2f}")

    ew = e1.expected_customers_per_hour(5.0)
    eu = e2.expected_customers_per_hour(5.0)
    print(f"\n  Customer spawn (base=5/hr):")
    print(f"    Boosted: {ew} | Base: {eu}")


if __name__ == "__main__":
    from staff import StaffMember

    print("=" * 66)
    print("  CAFE MANAGEMENT SIMULATION -- Full Demo".center(66))
    print("=" * 66)

    demo_staff()
    demo_decorations()
    demo_reputation()
    demo_full_day()
    demo_integration()

    print("\n" + "=" * 66)
    print("  DEMO COMPLETE -- All systems operational".center(66))
    print("  Staff AI | Decorations | Reputation | Full-day Sim")
    print("=" * 66 + "\n")

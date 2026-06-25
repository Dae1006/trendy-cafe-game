"""
Staff AI System for Cafe Management Simulation Game.

Provides 4 staff types (Barista, Cook, Server, Cashier) with:
- Skill focus per role
- Stamina system (depletes over time, recovers during breaks)
- Happiness system (affects service quality)
- Special skills with cooldowns
- Pathfinding to assigned tasks
"""

from __future__ import annotations

import math
import random
from dataclasses import dataclass, field
from enum import Enum, auto
from typing import List, Optional


# ─────────────────── Enums ───────────────────

class StaffType(Enum):
    BARISTA = "Barista"
    COOK = "Cook"
    SERVER = "Server"
    CASHIER = "Cashier"


class TaskType(Enum):
    BREW_COFFEE = auto()
    COOK_MEAL = auto()
    SERVE_CUSTOMER = auto()
    COLLECT_PAYMENT = auto()
    TAKE_BREAK = auto()
    CLEAN_TABLE = auto()
    RESTOCK = auto()


class Mood(Enum):
    ECSTATIC = "Ecstatic"
    HAPPY = "Happy"
    NEUTRAL = "Neutral"
    TIRED = "Tired"
    BURNOUT = "Burnout"


# ─────────────────── Data Classes ───────────────────

@dataclass
class CooldownSkill:
    """A special skill that can be activated with a cooldown."""
    name: str
    duration_turns: int  # how long the skill lasts when active
    cooldown_turns: int  # turns before it can be used again
    effect_multiplier: float  # multiplier applied during active
    description: str


@dataclass
class SkillDefinition:
    """All special skills for a staff type."""
    skills: List[CooldownSkill] = field(default_factory=list)


# Staff-type skill definitions
STAFF_SKILLS: dict[StaffType, SkillDefinition] = {
    StaffType.BARISTA: SkillDefinition([
        CooldownSkill("Double Shot", 5, 12, 2.0, "Doubles coffee output for 5 turns"),
        CooldownSkill("Latte Art Master", 3, 18, 1.5, "+50% quality for 3 turns"),
    ]),
    StaffType.COOK: SkillDefinition([
        CooldownSkill("Turbo Mode", 4, 15, 2.5, "Doubles cooking speed for 4 turns"),
        CooldownSkill("Perfect Plate", 2, 20, 3.0, "Triples meal quality for 2 turns"),
    ]),
    StaffType.SERVER: SkillDefinition([
        CooldownSkill("Sweet Talk", 6, 14, 1.8, "+80% tip chance for 6 turns"),
        CooldownSkill("Multitask", 5, 20, 1.5, "Serve 50% faster for 5 turns"),
    ]),
    StaffType.CASHIER: SkillDefinition([
        CooldownSkill("Speed Scan", 4, 10, 3.0, "Process payments 3x faster for 4 turns"),
        CooldownSkill("Upsell Expert", 8, 25, 1.4, "+40% upsell rate for 8 turns"),
    ]),
}


@dataclass
class PathNode:
    """A node in the cafe grid used for pathfinding."""
    x: int
    y: int
    walkable: bool = True

    def distance_to(self, other: PathNode) -> float:
        return math.sqrt((self.x - other.x) ** 2 + (self.y - other.y) ** 2)


@dataclass
class StaffMember:
    """Represents a single staff member working in the cafe."""
    staff_type: StaffType
    name: str
    base_skill: float = 0.75          # skill focus per role (0-1)
    max_stamina: float = 100.0
    stamina: float = 100.0
    happiness: float = 80.0           # 0-100
    level: int = 1
    experience: float = 0.0
    current_task: Optional[TaskType] = None
    path: List[PathNode] = field(default_factory=list)
    active_skills: List[str] = field(default_factory=list)  # names of skills currently active
    cooldown_tracker: dict[str, int] = field(default_factory=dict)  # skill_name -> remaining cooldown turns
    total_shift_time: int = 0         # turns worked this shift
    breaks_taken: int = 0
    tasks_completed: int = 0
    _mood_val: Mood = field(default=Mood.NEUTRAL, init=False)

    # ── Role-specific stat weights ──
    _role_weights: dict[StaffType, dict[str, float]] = field(
        default_factory=lambda: {
            StaffType.BARISTA: {"brew_speed": 1.3, "coffee_quality": 1.2, "payment_speed": 0.8},
            StaffType.COOK:      {"cook_speed": 1.4, "food_quality": 1.3, "serve_speed": 0.7},
            StaffType.SERVER:    {"serve_speed": 1.5, "customer_satisfaction": 1.2, "payment_speed": 0.6},
            StaffType.CASHIER:   {"payment_speed": 1.6, "coffee_quality": 0.7, "food_quality": 0.8},
        }
    )

    def _get_role_stat(self, stat_name: str) -> float:
        w = self._role_weights[self.staff_type].get(stat_name, 1.0)
        return round(w * self.base_skill * (1 + (self.level - 1) * 0.05), 4)

    # ── Stamina ──

    def work_stamina_cost(self, task: TaskType) -> float:
        """Stamina depleted per turn for a given task."""
        base = {
            TaskType.BREW_COFFEE: 3.0,
            TaskType.COOK_MEAL:   4.0,
            TaskType.SERVE_CUSTOMER: 2.5,
            TaskType.COLLECT_PAYMENT: 1.5,
            TaskType.CLEAN_TABLE: 2.0,
            TaskType.RESTOCK:     3.5,
        }.get(task, 2.0)

        # Fatigue penalty: last 20% of stamina costs +50%
        if self.stamina < self.max_stamina * 0.2:
            base *= 1.5
        return base

    def take_break(self, duration_turns: int = 5) -> float:
        """Rest and recover stamina/happiness during a break."""
        recovered = min(duration_turns * 6.0, self.max_stamina - self.stamina)
        self.stamina += recovered
        self.happiness = min(100.0, self.happiness + duration_turns * 2.0)
        self.breaks_taken += 1
        return recovered

    def check_burnout(self) -> bool:
        """Return True if staff is burnt out and cannot work."""
        return self.stamina <= 0 or self.happiness < 15

    # ── Happiness ──

    def apply_happiness_modifiers(self, event: str, amount: float) -> None:
        self.happiness = max(0.0, min(100.0, self.happiness + amount))

    @property
    def mood(self) -> Mood:
        val = self._mood_val
        # auto-update based on stats
        if self.stamina > 70 and self.happiness > 75:
            return Mood.ECSTATIC
        if self.happiness > 60:
            return Mood.HAPPY
        if self.happiness > 30 or self.stamina > 30:
            return Mood.NEUTRAL
        if self.stamina < 25:
            return Mood.TIRED
        return Mood.BURNOUT

    # ── Quality multiplier from mood & stamina ──

    @property
    def quality_multiplier(self) -> float:
        """Combined effect of mood and stamina on service quality."""
        m = {
            Mood.ECSTATIC: 1.25,
            Mood.HAPPY:    1.05,
            Mood.NEUTRAL:  1.0,
            Mood.TIRED:    0.75,
            Mood.BURNOUT:  0.4,
        }[self.mood]

        stamina_factor = self.stamina / self.max_stamina
        return max(0.3, m * (0.6 + 0.4 * stamina_factor))

    # ── Special Skills ──

    def activate_skill(self, skill_name: str) -> bool:
        """Activate a special skill if cooldown allows."""
        cd = self.cooldown_tracker.get(skill_name, 0)
        if cd > 0:
            return False
        for sk in STAFF_SKILLS[self.staff_type].skills:
            if sk.name == skill_name:
                self.active_skills.append(skill_name)
                self.cooldown_tracker[skill_name] = sk.cooldown_turns
                # Duration will expire naturally; we track via a separate counter
                return True
        return False

    def deactivate_expired_skills(self, turns_elapsed: int = 1) -> List[str]:
        """Remove skills that have expired. Returns list of just-deactivated skill names."""
        expired: List[str] = []
        newly_active = []
        for sk in STAFF_SKILLS[self.staff_type].skills:
            if sk.name in self.active_skills:
                # Skills expire after their duration — simplified: check via cooldown tracker
                pass
        # Simplified: skills deactivate after their active duration (tracked externally)
        return expired

    def tick_cooldowns(self, turns: int = 1) -> None:
        """Decrease all skill cooldowns."""
        for k in list(self.cooldown_tracker.keys()):
            self.cooldown_tracker[k] = max(0, self.cooldown_tracker[k] - turns)

    @property
    def available_skills(self) -> List[str]:
        return [sk.name for sk in STAFF_SKILLS[self.staff_type].skills
                if self.cooldown_tracker.get(sk.name, 0) == 0]

    # ── Pathfinding (A*) ──

    def set_path(self, nodes: List[PathNode]) -> None:
        self.path = list(nodes)

    @property
    def current_position(self) -> Optional[PathNode]:
        if self.path:
            return self.path[0]
        return None

    @staticmethod
    def a_star(start: PathNode, goal: PathNode, grid: List[List[PathNode]]) -> List[PathNode]:
        """A* pathfinding on a 2D grid of PathNodes."""
        def heuristic(a: PathNode, b: PathNode) -> float:
            return abs(a.x - b.x) + abs(a.y - b.y)

        open_set = [(heuristic(start, goal), start)]
        came_from: dict[tuple[int, int], Optional[PathNode]] = {}
        g_score: dict[tuple[int, int], float] = {(start.x, start.y): 0}

        while open_set:
            _, current = min(open_set, key=lambda x: x[0])
            cx, cy = current.x, current.y

            if (cx, cy) == (goal.x, goal.y):
                # Reconstruct path
                path = []
                node = goal
                while node:
                    path.insert(0, node)
                    node = came_from.get((node.x, node.y))
                return path

            open_set.remove((heuristic(current, goal), current))

            for dx, dy in [(-1, 0), (1, 0), (0, -1), (0, 1)]:
                nx, ny = cx + dx, cy + dy
                if 0 <= nx < len(grid[0]) and 0 <= ny < len(grid):
                    neighbor = grid[ny][nx]
                    if not neighbor.walkable:
                        continue
                    tentative_g = g_score[(cx, cy)] + 1
                    if tentative_g < g_score.get((nx, ny), float('inf')):
                        came_from[(nx, ny)] = current
                        g_score[(nx, ny)] = tentative_g
                        f_score = tentative_g + heuristic(neighbor, goal)
                        if not any(n[1] is neighbor for n in open_set):
                            open_set.append((f_score, neighbor))

        return []  # no path found

    # ── Work simulation ──

    def work(self, task: TaskType) -> dict:
        """Simulate one turn of work on a given task."""
        if self.check_burnout():
            return {"success": False, "reason": "burnout", "output": 0}

        stamina_cost = self.work_stamina_cost(task)
        self.stamina -= stamina_cost
        self.total_shift_time += 1

        # Reduce happiness slightly while working
        self.happiness -= 0.5

        # Calculate output quality
        speed_map = {
            TaskType.BREW_COFFEE: "brew_speed",
            TaskType.COOK_MEAL:   "cook_speed",
            TaskType.SERVE_CUSTOMER: "serve_speed",
            TaskType.COLLECT_PAYMENT: "payment_speed",
        }
        skill_stat = self._get_role_stat(speed_map.get(task, "serve_speed"))

        # Apply active skill multipliers
        skill_mult = 1.0
        for sk_name in self.active_skills[:]:
            for sk in STAFF_SKILLS[self.staff_type].skills:
                if sk.name == sk_name and self.cooldown_tracker.get(sk_name, 0) > 0:
                    skill_mult = max(skill_mult, sk.effect_multiplier)

        quality = self.quality_multiplier
        output = round(skill_stat * stamina_cost * quality * skill_mult, 2)

        # Gain experience
        exp_gain = output * random.uniform(0.8, 1.2)
        self.experience += exp_gain
        level_up_threshold = self.level * 50
        if self.experience >= level_up_threshold:
            self.experience -= level_up_threshold
            self.level += 1
            self.base_skill = min(1.0, self.base_skill + 0.05)

        # Random task success
        success_roll = random.random()
        threshold = max(0.2, 0.9 - skill_stat * 0.6 - quality * 0.3)
        if success_roll > threshold:
            self.tasks_completed += 1
            self.apply_happiness_modifiers("task_complete", 1.0)
            return {"success": True, "output": output, "quality": round(quality, 3)}

        return {"success": False, "reason": "failed", "output": 0, "quality": 0.0}


# ─────────────────── Staff Manager ───────────────────

@dataclass
class StaffManager:
    """Manages all staff in the cafe."""
    staff: List[StaffMember] = field(default_factory=list)
    grid: List[List[PathNode]] = field(default_factory=list)

    def hire(self, staff_type: StaffType, name: str) -> StaffMember:
        s = StaffMember(staff_type=staff_type, name=name)
        self.staff.append(s)
        return s

    def tick(self, turns: int = 1) -> None:
        """Advance all staff state by `turns` time units."""
        for s in self.staff:
            # Stamina passive regen (very slow when working, faster at break)
            if not s.current_task:
                s.stamina = min(s.max_stamina, s.stamina + turns * 8.0)

            s.tick_cooldowns(turns)

            # Auto-break when stamina critical
            if s.stamina < 15 and not s.check_burnout():
                recovered = s.take_break(3)
                print(f"   ⏸ {s.name} took an emergency break (recovered {recovered:.1f} stamina)")

    def assign_task(self, staff_member: StaffMember, task: TaskType) -> None:
        """Assign a task to a staff member."""
        if staff_member.check_burnout():
            return
        staff_member.current_task = task

    def find_closest_available(self, target: PathNode) -> Optional[StaffMember]:
        """Find the nearest unburnt-out staff who isn't already assigned (or is available)."""
        candidates = [s for s in self.staff if not s.check_burnout()]
        if not candidates:
            return None
        return min(candidates, key=lambda s: (s.current_position.distance_to(target) if s.current_position else 999))

    def full_shift_day(self, total_turns: int = 48) -> List[str]:
        """Run a simulated full day (48 turns = 2 hours at 15-min intervals)."""
        log: List[str] = []

        # Pre-set tasks for variety
        task_pool = [
            TaskType.BREW_COFFEE, TaskType.COOK_MEAL, TaskType.SERVE_CUSTOMER,
            TaskType.COLLECT_PAYMENT, TaskType.CLEAN_TABLE, TaskType.RESTOCK,
        ]

        log.append(f"🌅 === Full Day Shift — {total_turns} turns ===")

        for turn in range(1, total_turns + 1):
            # Decide tasks
            for s in self.staff:
                if s.check_burnout():
                    continue

                # Use a skill if available and stamina is reasonable
                if s.available_skills and random.random() < 0.25 and s.stamina > 40:
                    sk = random.choice(s.available_skills)
                    s.activate_skill(sk)
                    log.append(f"   🎯 Turn {turn:2d} — {s.name} activates [{sk}]")

                # Assign a task if not assigned
                if not s.current_task:
                    task = random.choice(task_pool)
                    self.assign_task(s, task)

                if s.current_task:
                    result = s.work(s.current_task)
                    if result["success"]:
                        log.append(f"   ✅ Turn {turn:2d} — {s.name} completed {s.current_task.name}: "
                                   f"output={result['output']:.1f}, quality={result['quality']:.3f}")
                    else:
                        log.append(f"   ❌ Turn {turn:2d} — {s.name} failed {s.current_task.name}: {result.get('reason', '?')}")

                # Unassign task after work (simulates completing it)
                if turn % random.randint(3, 6) == 0:
                    s.current_task = None

            self.tick(1)

            # End-of-turn summary for burnout checks
            burnout_staff = [s.name for s in self.staff if s.check_burnout()]
            if burnout_staff:
                log.append(f"   ⚠️  Turn {turn:2d} — Burnout alert: {', '.join(burnout_staff)}")

        log.append(f"\n📊 === End of Day Summary ===")
        for s in self.staff:
            log.append(f"   👤 {s.name} ({s.staff_type.value}): "
                       f"Lv{s.level} | Tasks={s.tasks_completed} | XP={s.experience:.0f} | "
                       f"Mood={s.mood.value} | ShiftTime={s.total_shift_time}")

        return log

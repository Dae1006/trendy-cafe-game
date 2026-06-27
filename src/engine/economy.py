"""
economy.py - Income / expense tracking with profit margin analysis.

Tracks:
  - Daily income (by category)
  - Daily expenses (by category)
  - Running profit & loss per tick
  - Cost per customer acquisition
  - Average spend per customer
  - Revenue trend line
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Dict, List, Optional


# ---------------------------------------------------------------------------
# Enums & categories
# ---------------------------------------------------------------------------

class IncomeCategory:
    """Fixed strings for income categorisation."""
    DRINK = "drink"
    FOOD = "food"
    MERCHANDISE = "merchandise"
    OTHER = "other"


class ExpenseCategory:
    """Fixed strings for expense categorisation."""
    WAGES = "wages"
    INGREDIENTS = "ingredients"
    RENT = "rent"
    UTILITIES = "utilities"
    MAINTENANCE = "maintenance"
    OTHER = "other"


# ---------------------------------------------------------------------------
# Data class
# ---------------------------------------------------------------------------

@dataclass
class EconomyEvent:
    """A single financial transaction recorded by the simulation."""
    tick: int                        # which game tick this occurred at
    category: str                    # one of IncomeCategory / ExpenseCategory
    amount: float                    # positive dollar value
    description: Optional[str] = None

    @property
    def is_income(self) -> bool:
        return self.category in IncomeCategory.__dict__.values() if hasattr(IncomeCategory, '__dict__') else False


# ---------------------------------------------------------------------------
# Economy tracker
# ---------------------------------------------------------------------------

class EconomyTracker:
    """Accumulates financial events and computes derived metrics.

    Usage (per tick)
    ----------------
    tracker.record_event(tick, IncomeCategory.DRINK, 12.50, "Latte x3")
    tracker.record_event(tick, ExpenseCategory.WAGES, 45.00, "Barista hourly")
    summary = tracker.daily_summary()
    """

    def __init__(self):
        self.events: List[EconomyEvent] = []
        # Running totals
        self.total_income: float = 0.0
        self.total_expenses: float = 0.0
        self._daily_income_by_category: Dict[str, float] = {}
        self._daily_expense_by_category: Dict[str, float] = {}

    def record_event(self, tick: int, category: str, amount: float, description: Optional[str] = None) -> EconomyEvent:
        """Record a financial event and update running totals."""
        evt = EconomyEvent(tick=tick, category=category, amount=amount, description=description)
        self.events.append(evt)

        if category in (IncomeCategory.DRINK, IncomeCategory.FOOD, IncomeCategory.MERCHANDISE, IncomeCategory.OTHER):
            self.total_income += amount
            self._daily_income_by_category[category] = self._daily_income_by_category.get(category, 0.0) + amount
        else:
            self.total_expenses += amount
            self._daily_expense_by_category[category] = self._daily_expense_by_category.get(category, 0.0) + amount

        return evt

    # ------------------------------------------------------------------
    # Derived metrics
    # ------------------------------------------------------------------

    def daily_summary(self) -> Dict:
        """Return a dict with all daily financial summaries."""
        profit = self.total_income - self.total_expenses
        margin = (profit / self.total_income * 100) if self.total_income > 0 else 0.0
        return {
            "total_income": round(self.total_income, 2),
            "total_expenses": round(self.total_expenses, 2),
            "net_profit": round(profit, 2),
            "profit_margin_pct": round(margin, 1),
            "income_by_category": {k: round(v, 2) for k, v in self._daily_income_by_category.items()},
            "expenses_by_category": {k: round(v, 2) for k, v in self._daily_expense_by_category.items()},
            "event_count": len(self.events),
        }

    def cost_per_customer_acquisition(self, customers_served: int) -> float:
        """Marketing / fixed cost allocated per customer."""
        if customers_served == 0:
            return 0.0
        # Assume wages + rent + utilities = acquisition-fixed cost; ingredients = variable
        fixed_cost = self._daily_expense_by_category.get(ExpenseCategory.WAGES, 0) \
                     + self._daily_expense_by_category.get(ExpenseCategory.RENT, 0) \
                     + self._daily_expense_by_category.get(ExpenseCategory.UTILITIES, 0)
        return fixed_cost / customers_served

    def average_customer_value(self) -> float:
        """Total revenue divided by number of distinct income events."""
        if not self.events or self.total_income == 0:
            return 0.0
        income_events = [e for e in self.events if e.category in (IncomeCategory.DRINK, IncomeCategory.FOOD)]
        if not income_events:
            return 0.0
        return self.total_income / len(income_events)

    def revenue_trend(self, window: int = 3) -> List[Tuple[int, float]]:
        """Revenue over a sliding *window* of ticks (last N events)."""
        trend: List[Tuple[int, float]] = []
        income_in_window: List[float] = []
        for evt in self.events:
            if evt.category not in (IncomeCategory.DRINK, IncomeCategory.FOOD, IncomeCategory.MERCHANDISE, IncomeCategory.OTHER):
                continue
            income_in_window.append(evt.amount)
            if len(income_in_window) > window:
                income_in_window.pop(0)
            trend.append((evt.tick, sum(income_in_window)))
        return trend

    def clear_daily(self) -> Dict:
        """Checkpoint & reset — call at day end to archive. Returns daily summary then resets."""
        summary = self.daily_summary()
        # Reset (keeping the summary for archiving)
        self.events.clear()
        self.total_income = 0.0
        self.total_expenses = 0.0
        self._daily_income_by_category.clear()
        self._daily_expense_by_category.clear()
        return summary

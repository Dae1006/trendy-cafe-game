# Trendy Cafe - Difficulty Fix (Patch)
## Issue: Customers leave before staff can serve at high levels (lv12+)

### Root Cause
1. **Patience shrunk with level**: Formula `baseServeTime * (1 + (6-lv)*0.1)` caused patience to DECREASE when lv > 6
   - Lv1: 8000ms patience
   - Lv12: 3200ms patience (40% of original!)
   
2. **Fixed serve interval**: Staff served every 3500ms regardless of difficulty
   - Result: Customer patience (3.2s) < Serve interval (3.5s) → game impossible

3. **Difficulty increased order rate** but didn't compensate with serve speed

### Fix Applied

1. **Patience now INCREASES with level** (line 562-563):
   - Formula: `baseServeTime * (1 + (lv-1) * 0.05)`
   - Lv1: 8000ms → Lv12: 12400ms → Lv30: 19600ms ✅

2. **Dynamic serve interval** (line 1522-1537):
   - Interval scales with difficulty: `3500 * phase.orderMult`
   - Easy(1.0): 3500ms → Normal(0.9): 3150ms → Hard(0.8): 2800ms → Extreme(0.7): 2450ms
   - Minimum floor: 1500ms

3. **Minimum patience enforcement** (line 1589-1597):
   - Ensures patience >= serveInterval * 1.2 (20% buffer)
   - Auto-corrects any orders that would be unserviceable

4. **Service capacity calculation** updated (line 614):
   - Uses dynamic interval instead of fixed 3.5s

5. **Auto Espresso Bot** recalculation uses dynamic interval (line 1581)

### Backup
Original saved to: `index.html.backup`

# Slice 13 — Statistics Dashboard

## Context

The backend has a stub `getStatistics()` that returns `{ tasksCompleted: 0, statGrowth: {} }`. The frontend has no statistics page. This slice implements a first-pass statistics dashboard: period tabs (Day/Week/Month/Year), completion rate, and streak tracking — visible on the existing Stats page as a first expansion.

**Scope for this slice:** Wire up backend `getStatistics()` with real queries, then extend the existing `StatsPageComponent` with period selector + completion-rate card + streak counter. No new chart library needed — reuse existing patterns.

---

## Backend Changes

### `backend/src/database/db.js` — `getStatistics(period, { startDate, endDate })`

```javascript
async getStatistics(period, { startDate, endDate }) {
  // Compute date range from period, or use provided start/end
  const { start, end } = this.computeDateRange(period, startDate, endDate);

  // Query all days in range
  const days = await this.getDaysRange(start, end);

  // 1. Total slots: each day has 3 slots = days.length * 3
  // 2. Completed slots: count where slot.completed === true
  // 3. Per-slot completion: morning/afternoon/evening breakdown
  // 4. Stat gains in period: sum of statGain for each completed task (need to track history — requires schema change)

  // For statGrowth: we need to track historical stat values.
  // Quick workaround: stats table has currentValue; we could store a snapshot or use a different approach.
  // For v1: show current stat values + today's gains.
}
```

**Schema addition for stat history** — add to `days` table at migration time:
```sql
-- Already in days: morningCompleted, afternoonCompleted, eveningCompleted
-- No schema change needed for basic completion stats
```

**v1 implementation approach:**
- `getStatistics` accepts `period` and optional `startDate/endDate`
- For `day`: use today; for `week`: Monday→Sunday of current week; for `month`: 1st→last of month; for `year`: Jan 1→Dec 31
- Returns: `{ period, start, end, totalSlots, completedSlots, completionRate, bySlot: { morning, afternoon, evening }, streakDays }`
- `streakDays`: count backwards from today/endDate counting consecutive days where ≥1 slot was completed

### `backend/src/routes/statistics.js`

Already exists, just needs real data from `db.getStatistics()`.

---

## Frontend Changes

### `frontend/src/app/pages/stats-page/stats-page.component.ts`

Extend the existing Stats page (don't create a new page — add to the existing one):

1. **Period Selector** — tab bar above the chart: `DAY | WEEK | MONTH | YEAR`
2. **Completion Rate Card** — above the stat list: `XX% COMPLETED (N/N SLOTS)`
3. **Streak Counter** — below completion rate: `🔥 X-DAY STREAK`
4. **Today's Gains** — list of stat gains from today's completed tasks (shown only for DAY view)

**Service**: Add `getStatistics(period: string)` to `StatService`.

---

## Data Model (return type)

```typescript
interface PeriodStats {
  period: 'day' | 'week' | 'month' | 'year';
  startDate: string;
  endDate: string;
  totalSlots: number;
  completedSlots: number;
  completionRate: number; // 0–100
  bySlot: {
    morning: { total: number; completed: number; rate: number };
    afternoon: { total: number; completed: number; rate: number };
    evening: { total: number; completed: number; rate: number };
  };
  streakDays: number;
  todayGains: { statId: string; statName: string; gain: number }[];
}
```

---

## Tasks

- [ ] `db.getStatistics()` — real queries for completion rate, bySlot, streak
- [ ] `GET /api/statistics/:period` — wire up real data
- [ ] `StatService.getStatistics(period)` — new method
- [ ] Stats page: period tabs (DAY/WEEK/MONTH/YEAR)
- [ ] Stats page: completion rate card
- [ ] Stats page: streak counter
- [ ] Stats page: today's gains (day view only)

---

## Files

- `backend/src/database/db.js` — implement `getStatistics()`
- `backend/src/routes/statistics.js` — already exists
- `frontend/src/app/services/stat.service.ts` — add `getStatistics()`
- `frontend/src/app/pages/stats-page/stats-page.component.ts` — extend with period tabs + cards

---

## Out of Scope (future slices)

- Stat-growth chart over time (needs historical data tracking)
- Completion-rate line chart
- Time-of-day heatmap
- Custom date range picker (use period tabs only for now)

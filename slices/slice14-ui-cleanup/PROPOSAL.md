# Slice 14 — UI Cleanup & Polish

## Overview

Two groups of changes: (1) nav/skills/stats refinements already implemented, (2) day-view UI fixes.

---

## Part A — Previously Implemented (in working tree)

### Nav Reorder — TASKS and SKILLS Adjacent
**Fix:** Move SKILLS directly below TASKS in the side nav.

**New nav order:**
```
DAY (/)
TASKS (/tasks)
SKILLS (/skills)
RECURRING (/templates)
STATS (/stats)
CONFIG (/settings)
```

### Emoji Picker for Custom Skills
- `icon` field added to Skill model
- `POST/PUT /api/skills` accept `icon`
- Skills page has emoji picker in add/edit forms
- Default skills seeded with emoji icons (⚔️💪📚💗🔧)

### Skills Page = Chart Hub, Stats Page = Pure Analytics
- Skills page: spider chart + skill list + CRUD with emoji picker
- Stats page: completion rate, streak, today's gains, popular tasks — no spider chart
- `GET /api/statistics/popular-tasks` endpoint added

---

## Part B — Day Planner UI Fixes

### 1. Date Range Header
**Problem:** Shows only center date "Tuesday, June 30, 2026" even though 3 days are displayed.
**Fix:** `getDateRangeLabel()` computes the date range from `daysData()` and shows "Jun 29 – Jul 1" style label.

### 2. Recurring Section Label
**Fix:** Changed "RECURRING TODAY" → "RECURRING" since it reflects recurring tasks active for the visible days, not just today.

### 3. Colored Border Around Days Grid
**Fix:** Added `border: var(--card-border-width) var(--card-border-style) var(--color-primary)` and `background: var(--color-surface)` to `.days-grid`. Theme-colored border now frames the 3-day view.

### 4. --font-display-scale Applied
**Problem:** CSS variable defined per theme (1.2/0.9/1.0) but never used.
**Fix:** Applied `calc(Xrem * var(--font-display-scale, 1))` to `.page-title`, `.day-range`, `.day-num`.

### 5. Drip Divider SVG Fixed
**Problem:** Jagged irregular path (`L25 12 L30 4 L35 14 L40 6 L45 10`) looked broken.
**Fix:** Replaced with clean symmetric zigzag: `M0,0 L20,0 L25,10 L30,0 L50,0 L50,16 L0,16 Z`. Applied to P5 (red), P4 (yellow), P3 (teal).

### 6. Page Transitions Fixed for P4/P3
**Problem:** P5 transition worked (uses `::before` with `inset:0`), P4/P3 didn't (gradient applied to element with no dimensions → invisible).
**Fix:** P4 and P3 overlays now use `::before` pseudo-elements with `inset:0` just like P5, guaranteeing the animation is visible. P4: TV static flicker. P3: moonrise teal glow.

---

## Files Modified

| File | Change |
|------|--------|
| `frontend/src/app/components/side-nav/side-nav.component.ts` | Nav reorder |
| `frontend/src/app/models/index.ts` | Skill.icon |
| `frontend/src/app/services/skill.service.ts` | icon in create/update |
| `backend/database/migrate.js` | icon column, default icons |
| `backend/src/database/db.js` | createSkill/updateSkill icon |
| `backend/src/routes/skills.js` | Accept icon |
| `backend/src/routes/statistics.js` | popular-tasks endpoint |
| `frontend/src/app/services/stat.service.ts` | getPopularTasks |
| `frontend/src/app/pages/skills-page/skills-page.component.ts` | Spider chart + emoji picker |
| `frontend/src/app/pages/stats-page/stats-page.component.ts` | Popular tasks, no chart |
| `frontend/src/app/pages/day-view/day-view.component.ts` | Date range, recurring label, border, font scale |
| `frontend/src/styles.css` | Drip divider, transitions, font scale |

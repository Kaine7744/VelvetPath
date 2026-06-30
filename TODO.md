# VelvetPath — Slices & Todo

## Slice Roadmap

---

## ✅ Slice 1 — Day Planner
**Status:** Completed (`b701ed9`)

- [x] 3-Slot Day View (Morning/Afternoon/Evening)
- [x] Date Navigation (← → Today)
- [x] Task Dropdown per Slot
- [x] Template Auto-Population (Work Mo–Fr Morning)
- [x] Backend API (GET/PUT `/api/days/:date`, GET `/api/tasks`)
- [x] 5 Seed Tasks + Work Template

---

## ✅ Slice 2 — Stats & Completion
**Status:** Completed (`18e38e7`)

### Features
- [x] **FR-7**: Check-Button → Task als erledigt markieren → Stat wächst
- [x] **FR-8**: Stats-Dashboard (`/stats`) mit aktuellen Werten + Growth

### Backend
- [x] `updateDay`: Bei `completed: true` → `growStat()` → `stat.currentValue += statGain`
- [x] PUT Response enthält `statGrowths[]` mit Details
- [x] `GET /api/stats` liefert alle Stats mit `currentValue`

### Frontend
- [x] `SlotCardComponent`: Check-Button (grüner Kreis), completed-State
- [x] "+X Stat" Float-Up Animation bei Erledigung
- [x] `StatsPageComponent`: Stat-Cards mit Icon, Wert, Fortschrittsbalken
- [x] Route `/stats` → StatsPageComponent
- [x] Nav-Link von Day-View → Stats

---

## ✅ Slice 3 — Persona UI
**Status:** Completed (`557772e`)

### Features
- [x] Side-Navigation (P5 Style)
- [x] Spider/Radar Chart für Stats
- [x] Tier-System (★×N) im Spider-Chart + Stat-Liste
- [x] P5 Dark Theme (CSS Custom Properties)
- [x] Montserrat Font, Grid-Pattern Hintergrund
- [x] Theme-Switcher (P3 / P4 / P5) — cycles on click in SideNav
- [x] Glow-Effekte auf Slot-Cards (left border glow on hover)
- [x] Persona-Style Check-Button
- [x] UI Polish: P5 typography, borders, spacing
- [x] Tier-Up Animation (bei 100 erreichen) — backend returns oldTier/newTier, AppComponent shows celebration overlay
- [x] Page-Transition-Animationen — CSS overlay per theme on NavigationStart

---

## ✅ Slice 4 — Dev Tools (Settings)
**Status:** Completed (`e6ab8cb`)

- [x] **Dev Section** in Settings page (`/settings/dev`, only in dev mode via `isDevMode()`)
- [x] **Clear Database** — Wipes all days, recurring tasks, and resets stats to seed state (requires typing "DELETE" to confirm)
- [x] **Remove Non-Default Tasks** — Deletes all tasks where `isDefault === false` (requires checkbox confirmation)
- [x] Backend endpoints: `POST /api/dev/reset-db`, `DELETE /api/dev/tasks/non-default`

---

## ✅ Slice 5 — Recurring Tasks & Task CRUD
**Status:** Completed

### Features
- [x] Recurring-Task-Management-UI (auflisten, erstellen, bearbeiten, löschen)
- [x] Task CRUD via UI (erstellen, bearbeiten, löschen)
- [x] Backend task endpoints: `POST/PUT/DELETE /api/tasks`
- [x] Backend recurring-task endpoints: `GET/POST/PUT/DELETE /api/templates`
- [x] `TemplateService` frontend + `/templates` page (renamed labels to "Recurring Tasks")
- [x] `GET /api/templates/for-day/:date` endpoint — shows recurring tasks for a given date
- [x] "Recurring Today" section on Day Planner — visible pills showing which recurring tasks auto-fill the day
- [x] `daysOfWeek` CSV→array fix in `getAllTemplates()`

---

## ✅ Slice 6 — Settings & Theme Management
**Status:** Completed

### Features
- [x] Settings-Page (`/settings`) with sub-nav (Appearance / General)
- [x] Theme-Switcher (P3/P4/P5) — persisted to backend via `PUT /api/settings`
- [x] Morning/Evening slot visibility toggles — persisted to backend
- [x] Day View respects slot visibility settings (morning/evening slots hidden when disabled)
- [x] `SettingsService` frontend service calling `GET/PUT /api/settings`
- [x] Theme loaded from backend on startup (localStorage as fast fallback)
- [x] `morningEnabled: 'true'` added to DB seed

### Files
- `frontend/src/app/services/settings.service.ts` — **NEW**
- `frontend/src/app/services/theme.service.ts` — wired to backend
- `frontend/src/app/pages/settings-page/settings-page.component.ts` — General tab + slot toggles
- `frontend/src/app/pages/day-view/day-view.component.ts` — honors slot visibility
- `frontend/src/app/models/index.ts` — added `AppSettings` interface
- `backend/database/migrate.js` — added `morningEnabled` seed

---

## ✅ Slice 7 — Statistics Dashboard
**Status:** Backlog

### Features
- [ ] Day / Week / Month / Year Views
- [ ] Completion-Rate-Chart
- [ ] Time-of-day Patterns
- [ ] Streak-Tracking (consecutive days with completed tasks)
- [ ] Stat-Growth-Chart über Zeit

---

## ✅ Slice 8 — Spider Chart Dynamic Scale
**Status:** Completed (`f0f3d48`, `cfde8fa`, `a04c40c`)

### Fix
- Scale `max` should be `Math.ceil(highestStatValue / 100) * 100 + 100` — so a stat at 150 gets a chart with max=200 (one full tier headroom above)
- `getSkillValue()` returns `currentValue % 100` — inner-tier progress within that scale
- When stat is exactly on a tier boundary (e.g. 200), inner value = 0 (correct — sits at center of that tier's ring)
- Tier badge (centered "★ ×N") is to be removed

---

## ✅ Slice 9 — Recurring Tasks Frontend
**Status:** Completed

### Overview
Renamed "Templates" → "Recurring Tasks" throughout the UI. Add a visible "Recurring Today" section on the Day Planner so users can see which recurring tasks auto-fill the current day.

### Features
- [x] `GET /api/templates/for-day/:date` — returns active recurring tasks for a given date (slot + taskId + taskName)
- [x] `TemplateService.getTemplatesForDate(date)` — frontend method for the above
- [x] `GET /api/templates/for-day/:date` JOIN fix — `getTemplatesForDay()` now JOINs with tasks so `taskName` is populated (was always null before)
- [x] `daysOfWeek` CSV→array fix — `getAllTemplates()` and `getTemplatesForDay()` split CSV into `number[]` so frontend `Template` interface is satisfied
- [x] Recurring Tasks management page (`/templates`) — create/edit/delete recurring tasks with task dropdown, slot radio, day-of-week toggle chips
- [x] "Recurring Today" section on Day Planner — dashed-border pill section above slot grid, shows which recurring tasks auto-fill the current day, updates on date navigation
- [x] `TemplateService` — full CRUD service with `getTemplatesForDate()`
- [x] CSS class rename: `.template-*` → `.recurring-*` throughout templates page

### Files
- `backend/src/routes/templates.js` — added `GET /for-day/:date`
- `backend/src/database/db.js` — fixed `getAllTemplates()` and `getTemplatesForDay()` CSV→array + JOIN
- `frontend/src/app/services/template.service.ts` — added `getTemplatesForDate()`
- `frontend/src/app/pages/templates-page/templates-page.component.ts` — full CRUD UI, renamed to recurring
- `frontend/src/app/pages/day-view/day-view.component.ts` — added "Recurring Today" section with `effect()` on `centerDate`
- `frontend/src/app/components/side-nav/side-nav.component.ts` — nav label "RECURRING"

---

## ✅ Slice 10 — Task Management Improvements
**Status:** Completed

### Overview
Improve task lifecycle management on the Day Planner. Currently tasks can be placed in slots and marked complete, but lack full lifecycle controls.

### Features

- [x] **Remove Planned Tasks** — Add a remove/unassign button to tasks that are placed in a slot. Clicking removes the task from the slot, returning it to 'free' status. Does not delete the task itself from the task list.

- [x] **Reversible Completion** — Allow un-completing a finished task. Add an "unfinish" or "undo" button on completed slots. Clicking sends `{ completed: false }` to revert the task to "set but not completed" state.

- [x] **Hide Check-Button on Completed Tasks** — Already implemented — the check button only renders when `status === 'set' && !completed`.

### UI Behavior

| Slot State | Check Button | Remove Button | Unfinish Button |
|-----------|--------------|---------------|-----------------|
| `free` (empty) | Hidden | Hidden | Hidden |
| `set` (task placed, not done) | Visible (green circle) | Visible (X/remove icon) | Hidden |
| `completed` (task done) | Hidden | Hidden | Visible (undo/minus icon) |

### Backend Changes
- No new endpoints required — `PUT /api/days/:date` with `{ slots: { [slot]: { completed: false } } }` already supported

### Files
- `frontend/src/app/components/slot-card/slot-card.component.ts` — added remove/unfinish buttons, `uncompleted` output, CSS for new buttons
- `frontend/src/app/pages/day-view/day-view.component.ts` — wired `uncompleted` event, added `onSlotUncompleted` handler
- `frontend/src/styles.css` — added `--color-danger` and `--color-warning` to all three themes

---

## ✅ Slice 11 — Spider Chart Dynamic Scale 2
**Status:** Completed (`b3ca577`)

### Fix
- Dynamic `max` — chart scale now uses `Math.ceil(highestStatValue / 100) * 100` instead of hardcoded `100`
- Tier badge (centered "★ ×N") removed from spider chart overlay

### Known Bug (next session)
- **Level-up reset**: When a stat levels up (reaches 100, 200, etc.) the chart polygon briefly shows 0 before recovering
  - `getSkillValue()` at exact multiples of 100 returns 0 instead of 100 → chart drops to center
  - Sometimes only triggers at 101 instead of 100 — timing inconsistent
  - The ceiling increases correctly, but the stat value visualization resets to 0 at the boundary
  - Need to: ensure stat value stays at edge (100/200/etc.) during the level-up moment, not 0

---

## ✅ Slice 12 — Spider Chart Level-Up Fix
**Status:** Completed

### Fix
- `getSkillValue()`: returns 100 at exact tier boundaries (was: 0) — polygon stays at edge
- `getScaleMax()`: at exact tier boundary, returns `maxValue + 100` (one full extra tier headroom) — was accidentally reverted in `b3ca577`, now restored
- Stat at 99: chart shows ~99% (near edge) ✓
- Stat at 100: chart shows 100% (at edge) ✓ — ceiling shifts to 200
- Stat at 101: chart shows ~50% (halfway through tier 2) ✓

### Files
- `frontend/src/app/components/spider-chart/spider-chart.component.ts`

---

## ✅ Slice 13 — Statistics Dashboard
**Status:** Completed

### Overview
Wire up real data for the existing `GET /api/statistics/:period` stub and extend the existing `StatsPageComponent` with period tabs + completion rate + streak.

### Backend
- [x] `db.getStatistics(period, { startDate, endDate })` — real queries for completion rate, bySlot breakdown, streak counter
- [x] `GET /api/statistics/:period` — wire up real data

### Frontend
- [x] `StatService.getStatistics(period)` — new method
- [x] Period tabs: DAY | WEEK | MONTH | YEAR
- [x] Completion Rate card: `XX% COMPLETED (N/N SLOTS)`
- [x] Streak counter: `🔥 X-DAY STREAK`
- [x] Today's gains (day view only)

### Out of Scope
- Historical stat-growth chart
- Completion-rate line chart
- Custom date picker

### Files
- `backend/src/database/db.js` — implement `getStatistics()`
- `frontend/src/app/services/stat.service.ts` — add `getStatistics()`
- `frontend/src/app/pages/stats-page/stats-page.component.ts` — extend with period tabs + cards

---

## ✅ Slice 14 — UI Cleanup & Polish
**Status:** Completed (`b5ad8d7`)

### Features
- [x] Date range header: shows "Jun 29 – Jul 1" when 3 days shown
- [x] Recurring label: "RECURRING" (not "TODAY")
- [x] Days grid: theme-colored border frame
- [x] --font-display-scale applied to page-title, day-range, day-num
- [x] Drip divider: clean symmetric zigzag SVG (P5/P4/P3)
- [x] Page transitions fixed for P4/P3 (::before with inset:0)
- [x] Nav reorder: SKILLS between TASKS and RECURRING
- [x] Skill.icon field + emoji picker in skills page
- [x] Skills page = chart hub, Stats page = pure analytics
- [x] GET /api/statistics/popular-tasks endpoint

---

## ✅ Slice 15 — Full App Polish
**Status:** Completed (`4fff1b8`)

### Features
- [x] **M3: VP logo fix** — removed glow, smaller font, tighter spacing
- [x] **O2: Templates with end-date** — backend + frontend support, ONGOING badge
- [x] **O3: Today Summary view** — new /summary page with completion bar, slot cards, recurring tasks
- [x] **O1: Custom Stats** — already implemented (skills page with emoji picker)

### Remaining
- [ ] "Recurring Today" placement — move to cleaner position (e.g. small box to right of day date)

---

## ✅ Slice 16 — Day Planner UI Polish
**Status:** Completed (`0e1ed64`)

### Features
- [x] Fix horizontal scrollbar reflow — base scrollbar 5px→6px, overflow-x:hidden on html
- [x] Remove drip-divider from day planner header
- [x] Make days-grid horizontally scrollable with scroll-snap
- [x] Improve recurring pill styling — larger slot badges (0.65rem), left-border accent

---

## ✅ Slice 17 — Day View UX Overhaul + Radical Theme Differentiation
**Status:** Completed (`d5a2295`)

### Features

**Recurring Per-Day-Column:**
- [x] `recurringPerDay` signal: `Record<string, RecurringTask[]>` replaces single `recurringForCenter`
- [x] `forkJoin` loads recurring for all 3 visible days in parallel after each `loadDays()`
- [x] Recurring pills moved **inside** each `.day-column` day-header, compact styling
- [x] Removed old standalone `recurring-section` above the grid

**Horizontal Scroll Navigation:**
- [x] `@ViewChild` scroll container with `scrollBy({ behavior: 'smooth' })` on ← → buttons
- [x] `scrollToCenter()` called in `ngAfterViewInit` on init
- [x] `goToToday()` scrolls container to start before reloading

**Radical Theme Differentiation:**
- [x] P5 "Phantom Thief": near-black `#050508`, diagonal red stripe bg pattern, clip-path cards, Bebas Neue, hard 5px shadow
- [x] P4 "Midnight Channel": `#1a1a1a`, Junes yellow `#f7d000`, top-border only panels, Arial Black, TV frame cards with inner shadow, CRT scanlines overlay
- [x] P3 "Dark Moon": `#0a0e1a` navy, teal `#00b4c8`, Cinzel + Share Tech Mono, glass morphism `backdrop-filter: blur()`, diagonal clip-path
- [x] P4/P3 `.slots-wrapper` skew bug fixed — targets `.slots-wrapper` directly (not just `.skew-outer`)
- [x] All 3 themes use the new `persona-ui.md` spec as reference

### Files
- `frontend/src/app/pages/day-view/day-view.component.ts` — recurring-per-day, scroll navigation
- `frontend/src/app/services/theme.service.ts` — updated cssVars for all 3 themes
- `frontend/src/styles.css` — complete P5/P4/P3 rewrite with maximal visual distinction

---

## ✅ Slice 18 — Infinite Horizontal Day Scroll (iPhone Timer Wheel)
**Status:** Completed (`8d5422f`)

### Overview
Native horizontal scroll IS the navigation. Scroll through days like an iPhone timer picker — new days load infinitely as you approach the edges.

### Features
- [x] `onScroll()`: calculates `centerIndex` from `scrollLeft / columnWidth`
- [x] `loadMoreDays('forward'|'backward')`: fetches next/prev 3-day batches when approaching edges
- [x] `centerIndex` signal tracks which column is centered; `centerDate` derived from it
- [x] Recurring pills: only shown for center day (`i === centerIndex()`)
- [x] `← →` buttons: `scrollBy(±1 column)`, no date mutation — scroll handler does all state updates
- [x] `scrollToToday()`: finds today in loaded days, scrolls to it; reloads if not present
- [x] `reloadDay(date)`: single-day reload via `getDay(date)` after slot updates (no full `loadDays()`)
- [x] 7 days loaded initially (today ± 3), more fetched on scroll

### Files
- `frontend/src/app/pages/day-view/day-view.component.ts`

---

## Misbehavior Tally

| # | Slice | Issue | Status |
|---|-------|-------|--------|
| M1 | Slice 6 | Settings sub-nav disappears on `/settings/dev` — no back nav | Open |
| M2 | Slice 3 | Spider chart renders nothing when all stats are 0 | Open (by design) |
| M3 | Slice 3 | VP logo looks off/wrong | **Fixed** |
| M4 | Slice 3 | Colored border boxes inconsistent | **Fixed** |
| M5 | Slice 3 | Page animations P4/P3 broken | **Fixed** |

---

## Open Questions / Decisions Needed

| # | Question | Status |
|---|----------|--------|
| O1 | Custom-Stats neben den 5 Defaults? | **Done** (already implemented) |
| O2 | Templates mit End-Datum? | **Done** |
| O3 | "Heute zusammenfassen" Ansicht? | **Done** |

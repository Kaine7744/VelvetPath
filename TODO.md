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

## 📋 Slice 7 — Statistics Dashboard (Detailed)
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

## 📋 Slice 9 — Recurring Tasks Frontend
**Status:** Backlog

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
**Status:** Completed

### Fix
- Dynamic `max` — chart scale now uses `Math.ceil(highestStatValue / 100) * 100 + 100` instead of hardcoded `100`
- Tier badge (centered "★ ×N") removed from spider chart overlay

## 📋 Slice 12 — Cleanup UI and Other
**Status:** Backlog

### Features
- [ ] Fix drip-divider SVG encoding issues
- [ ] Consistent font sizes across themes (--font-display-scale)
- [ ] Remove duplicate CSS from components (drip-divider, etc.)
- [ ] Fix any remaining UI glitches and inconsistencies
- [ ] Remove unused CSS rules
- [ ] Cleanup Task check button and redo button
- [ ] Implement "Recurring Today" more cleanly, e.g small box to the right of day date
- [ ] Design UI closer to Persona Games

---

## Open Questions / Decisions Needed

| # | Question | Status |
|---|----------|--------|
| O1 | Sollen Custom-Stats erstellt werden können? (neben den 5 Defaults) | Offen |
| O2 | Sollen Templates einen End-Datum haben? | Offen |
| O3 | Soll es eine "Heute zusammenfassen" Ansicht geben? | Offen |

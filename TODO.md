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

## 📋 Slice 4 — Dev Tools (Settings)
**Status:** Backlog

### Overview
A hidden/dev section in the Settings page for development utilities. Actions require confirmation to prevent accidental data loss.

### Features
- [ ] **Dev Section** in Settings page (`/settings/dev`, only in dev mode via `isDevMode()`)
- [ ] **Clear Database** — Wipes all days, templates, and resets stats to seed state (requires typing "DELETE" to confirm)
- [ ] **Remove Non-Default Tasks** — Deletes all tasks where `isDefault === false` (requires checkbox confirmation)
- [ ] Backend endpoints: `POST /api/dev/reset-db`, `DELETE /api/dev/tasks/non-default`

### UI Behavior
- Confirmation modal for each destructive action
- Clear visual distinction between dev tools and regular settings
- Only accessible when `NODE_ENV !== 'production'`

---

## 📋 Slice 5 — Recurring Templates & Task CRUD
**Status:** Backlog

### Features
- [ ] Template-Management-UI (Templates auflisten, erstellen, bearbeiten, löschen)
- [ ] Neue Tasks erstellen via UI (neben dem Dropdown "Add new…")
- [ ] Task bearbeiten/löschen
- [ ] `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` Backend
- [ ] `POST/PUT/DELETE /api/templates`

---

## 📋 Slice 6 — Settings & Theme Management
**Status:** Backlog

### Features
- [ ] Settings-Page (`/settings`)
- [ ] Theme-Switcher (P3/P4/P5) — Speicherung in DB
- [ ] Evening-Slot aktivieren/deaktivieren
- [ ] `GET/PUT /api/settings` Backend

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

## 📋 Slice X — Cleanup UI and Other
**Status:** Backlog

### Features
- [ ] Fix drip-divider SVG encoding issues
- [ ] Consistent font sizes across themes (--font-display-scale)
- [ ] Remove duplicate CSS from components (drip-divider, etc.)
- [ ] Fix any remaining UI glitches
- [ ] Remove unused CSS rules

---

## Open Questions / Decisions Needed

| # | Question | Status |
|---|----------|--------|
| O1 | Sollen Custom-Stats erstellt werden können? (neben den 5 Defaults) | Offen |
| O2 | Sollen Templates einen End-Datum haben? | Offen |
| O3 | Soll es eine "Heute zusammenfassen" Ansicht geben? | Offen |

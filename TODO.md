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

## 📋 Slice 3 — Persona UI
**Status:** Spec fertig (`specs/slice3-persona-ui.md`)

### Features
- [ ] **FR-9**: Komplettes P5-Style UI-Redesign
- [ ] **FR-10**: Theme-Switcher (P3 / P4 / P5)

### UI-Elemente
- [ ] Glow-Effekte auf allen interaktiven Elementen
- [ ] Animierte Border-Glow auf Slot-Cards
- [ ] Persona-Style Check-Button (Circle → Green ✓)
- [ ] Stat-Fortschrittsbalken animiert
- [ ] P5 Farbschema als CSS Custom Properties
- [ ] Montserrat Font für Headlines
- [ ] Page-Transition-Animationen
- [ ] Scrollbar / Selection / Focus States

---

## 📋 Slice 4 — Recurring Templates & Task CRUD
**Status:** Backlog

### Features
- [ ] Template-Management-UI (Templates auflisten, erstellen, bearbeiten, löschen)
- [ ] Neue Tasks erstellen via UI (neben dem Dropdown "Add new…")
- [ ] Task bearbeiten/löschen
- [ ] `POST /api/tasks`, `PUT /api/tasks/:id`, `DELETE /api/tasks/:id` Backend
- [ ] `POST/PUT/DELETE /api/templates`

---

## 📋 Slice 5 — Settings & Theme Management
**Status:** Backlog

### Features
- [ ] Settings-Page (`/settings`)
- [ ] Theme-Switcher (P3/P4/P5) — Speicherung in DB
- [ ] Evening-Slot aktivieren/deaktivieren
- [ ] `GET/PUT /api/settings` Backend

---

## 📋 Slice 6 — Statistics Dashboard (Detailed)
**Status:** Backlog

### Features
- [ ] Day / Week / Month / Year Views
- [ ] Completion-Rate-Chart
- [ ] Time-of-day Patterns
- [ ] Streak-Tracking (consecutive days with completed tasks)
- [ ] Stat-Growth-Chart über Zeit

---

## 📋 Slice 7 — PDF Export
**Status:** Backlog

### Features
- [ ] PDF-Export-Button auf Stats-Seite
- [ ] `POST /api/pdf` — Puppeteer rendert HTML → PDF
- [ ] PDF-Download als Datei

---

## 📋 Slice 8 — Profile Image Upload
**Status:** Backlog

### Features
- [ ] Profile-Bild hochladen (Crop + Upload)
- [ ] `POST /api/upload` mit Multer
- [ ] Bild-URL in CV/Settings speichern

---

## Open Questions / Decisions Needed

| # | Question | Status |
|---|----------|--------|
| O1 | Sollen Custom-Stats erstellt werden können? (neben den 5 Defaults) | Offen |
| O2 | Sollen Templates einen End-Datum haben? | Offen |
| O3 | Soll es eine "Heute zusammenfassen" Ansicht geben? | Offen |

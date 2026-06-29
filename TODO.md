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

## 🔄 Slice 3 — Persona UI (in progress)
**Status:** Side nav + Spider chart done (`e2f6d47`)

### Features (done)
- [x] Side-Navigation (P5 Style)
- [x] Spider/Radar Chart für Stats
- [x] Tier-System (★×N) im Spider-Chart + Stat-Liste
- [x] P5 Dark Theme (CSS Custom Properties)
- [x] Montserrat Font
- [x] Grid-Pattern Hintergrund

### Features (remaining)
- [ ] Glow-Effekte auf Slot-Cards animiert
- [ ] Persona-Style Check-Button Animation
- [ ] Tier-Up Animation (bei 100 erreichen)
- [ ] Theme-Switcher (P3 / P4 / P5)
- [ ] Page-Transition-Animationen

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

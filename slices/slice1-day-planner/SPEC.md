# Spec: Slice 1 — Day Planner

## Overview

Zeigt einen einzelnen Tag mit 3 Slots (Morning, Afternoon, Evening). Slots können mit Tasks befüllt werden. Recurring Templates füllen automatisch Slots (Work Mo-Fr Morning).

---

## Funktionale Requirements

### FR-1: Tagesnavigation ✅

**Akzeptanzkriterien:**
- [x] "←" navigiert zum Vortag, "→" zum Folgetag
- [x] "Today" springt zum heutigen Tag
- [x] Das aktuelle Datum wird angezeigt ("Monday, June 29, 2026")
- [x] Beim Start wird automatisch der heutige Tag angezeigt

---

### FR-2: 3-Slot-Tagesansicht ✅

**Akzeptanzkriterien:**
- [x] Jeder Slot zeigt seinen Namen (Morning / Afternoon / Evening)
- [x] Jeder Slot zeigt seinen Status: "free" (leer) oder den Task-Namen
- [x] Ein "free"-Slot hat eine gedimmte/graue Darstellung
- [x] Ein "set"-Slot zeigt Task-Namen prominent + Stat-Badge

---

### FR-3: Task-Auswahl pro Slot ✅

**Akzeptanzkriterien:**
- [x] Klick auf Slot öffnet ein Dropdown-Menü
- [x] Dropdown zeigt alle verfügbaren Tasks aus `GET /api/tasks`
- [x] Task-Name + Stat-Badge sind im Dropdown sichtbar
- [x] Auswahl eines Tasks: Slot wechselt zu "set", Slot zeigt Task-Namen
- [x] Klick außerhalb des Dropdowns schließt es wieder
- [x] Dropdown bietet "Remove / Free Slot" um Slot zu leeren

---

### FR-4: Template-Auto-Population ✅

**Akzeptanzkriterien:**
- [x] `GET /api/days/:date` gibt im Response bereits `status: 'set'` mit `taskId` zurück wenn ein Template matcht
- [x] Work-Template (Mo-Fr, Morning) ist beim Start bereits aktiv
- [x] Templates können Slots auf "free" zurücksetzen (Template-Override auf Tagesebene)

---

### FR-5: Backend API ✅

| Method | Endpoint | Status |
|--------|----------|--------|
| GET | `/api/days/:date` | ✅ Implementiert |
| PUT | `/api/days/:date` | ✅ Implementiert |
| GET | `/api/tasks` | ✅ Implementiert |

---

### FR-6: Seed-Daten ✅

| ID | Name | Stat |
|----|------|------|
| work | Work | Academics (3) |
| study | Study | Academics (2) |
| gym | Gym | Proficiency (2) |
| social | Social | Kindness (2) |
| hobbies | Hobbies | Guts (2) |

**Template:** Work → Morning, Mo-Fr, enabled

---

## Out of Scope (diese Slice)

- ~~Stat-Growth-Logik~~ → **FR-7 (Slice 2)**
- ~~Stat-Dashboard~~ → **Slice 2**
- ~~Persona-Style UI~~ → **Slice 3**
- PDF-Export
- Bildupload
- Task-CRUD UI
- Template-Management UI
- Theme-Switcher

---

## Slice 2 — Coming Next

1. **FR-7: Task als erledigt markieren** — Check-Button/Knopf pro Slot → `completed: true` → Stat-Growth berechnen
2. **FR-8: Stats-Dashboard** — Übersicht aller Stats (Guts/Courage/Academics/Kindness/Proficiency) mit aktuellen Werten und Wachstum

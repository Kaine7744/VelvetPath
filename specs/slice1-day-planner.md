# Spec: Slice 1 — Day Planner

## Overview

Zeigt einen einzelnen Tag mit 3 Slots (Morning, Afternoon, Evening). Slots können mit Tasks befüllt werden. Recurring Templates füllen automatisch Slots (Work Mo-Fr Morning).

---

## Funktionale Requirements

### FR-1: Tagesnavigation

**Beschreibung:** Der Benutzer kann zwischen Tagen navigieren.

**Akzeptanzkriterien:**
- [ ] "←" navigiert zum Vortag, "→" zum Folgetag
- [ ] "Today" springt zum heutigen Tag
- [ ] Das aktuelle Datum wird angezeigt ("Monday, June 29, 2026")
- [ ] Beim Start wird automatisch der heutige Tag angezeigt

**Technische Anforderung:** Kein Full-Page-Reload bei Navigation (Angular Router oder Signal-basiertes Rendering).

---

### FR-2: 3-Slot-Tagesansicht

**Beschreibung:** Drei Slots untereinander — Morning, Afternoon, Evening.

**Akzeptanzkriterien:**
- [ ] Jeder Slot zeigt seinen Namen (Morning / Afternoon / Evening)
- [ ] Jeder Slot zeigt seinen Status: "free" (leer) oder den Task-Namen
- [ ] Ein "free"-Slot hat eine gedimmte/graue Darstellung
- [ ] Ein "set"-Slot zeigt Task-Namen prominent + Stat-Badge

**Visuals:**
- Free: Grauer Hintergrund, "— Free —" Text
- Set: Dunklerer Hintergrund, Task-Name fett, Stat-Badge rechts

---

### FR-3: Task-Auswahl pro Slot

**Beschreibung:** Klick auf einen Slot öffnet ein Dropdown mit verfügbaren Tasks.

**Akzeptanzkriterien:**
- [ ] Klick auf Slot öffnet ein Dropdown-Menü
- [ ] Dropdown zeigt alle verfügbaren Tasks aus `GET /api/tasks`
- [ ] Task-Name + Stat-Badge sind im Dropdown sichtbar
- [ ] Auswahl eines Tasks: Slot wechselt zu "set", Slot zeigt Task-Namen
- [ ] Klick außerhalb des Dropdowns schließt es wieder
- [ ] Dropdown kann "Remove" / "Freigeben" anbieten um Slot zu leeren

**Datenfluss:**
1. `GET /api/tasks` → liste aller Tasks
2. `PUT /api/days/:date` → `{ slots: { morning: { status: 'set', taskId: 'xyz' } } }`

---

### FR-4: Template-Auto-Population

**Beschreibung:** Beim Laden eines Tages werden Slots automatisch aus aktiven Templates befüllt.

**Akzeptanzkriterien:**
- [ ] `GET /api/days/:date` gibt im Response bereits `morningStatus: 'set'` mit `morningTaskId` zurück wenn ein Template matcht
- [ ] Work-Template (Mo-Fr, Morning) ist beim Start bereits aktiv
- [ ] Templates können Slots auf "free" zurücksetzen (Template-Override auf Tagesebene)

**Hinweis:** Die Logik "Template auf Tag anwenden" passiert serverseitig in `GET /api/days/:date`:
1. Prüfe alle aktiven Templates
2. Prüfe für jeden Slot ob ein Template matcht (Slot + Wochentag)
3. Falls ja, fülle `taskId` im Response

---

### FR-5: Backend API

**Endpoints:**

| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| GET | `/api/days/:date` | Tag abrufen (YYYY-MM-DD). Liefert Slots mit Status, TaskId, Completed. Wendet aktive Templates an. |
| PUT | `/api/days/:date` | Slot(s) eines Tags aktualisieren. Body: `{ slots: { morning?: { status, taskId } } }` |
| GET | `/api/tasks` | Alle verfügbaren Tasks. Body: `[{ id, name, statId, statGain }]` |

**GET /api/days/:date Response:**
```json
{
  "date": "2026-06-29",
  "slots": {
    "morning": { "status": "set", "taskId": "work-1", "taskName": "Work", "statName": "Academics", "completed": false },
    "afternoon": { "status": "free" },
    "evening": { "status": "free" }
  }
}
```

**PUT /api/days/:date Request:**
```json
{
  "slots": {
    "morning": { "status": "set", "taskId": "study-1" },
    "afternoon": { "status": "free" }
  }
}
```

---

### FR-6: Seed-Daten

**Tasks (vordefiniert, geladen durch Migration):**
| ID | Name | Stat |
|----|------|------|
| work-1 | Work | Academics |
| study-1 | Study | Academics |
| gym-1 | Gym | Proficiency |
| social-1 | Social | Kindness |
| hobbies-1 | Hobbies | Guts |

**Templates (vordefiniert, geladen durch Migration):**
| ID | Task | Slot | DaysOfWeek | Enabled |
|----|------|------|------------|---------|
| work-template | work-1 | morning | 1,2,3,4,5 | true |

---

## Non-Functional Requirements

- **Performance:** Tag laden < 200ms (DB ist lokal, minimal)
- **UX:** Slot-Interaktion in < 100ms optisch反馈
- **Keine Fehler** im Browser bei Offline/Leerer DB

---

## Out of Scope (diese Slice)

- Statistik-Seite / Stat-Dashboard
- PDF-Export
- Bildupload
- Task-CRUD UI (neue Tasks erstellen)
- Template-Management UI (Templates bearbeiten)
- Theme-Switcher
- Stat-Growth-Logik

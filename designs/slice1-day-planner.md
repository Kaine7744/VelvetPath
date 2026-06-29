# Design: Slice 1 — Day Planner

## Technischer Ansatz

### Frontend

**Framework:** Angular 18, Standalone Components, Signals

**Komponenten:**
```
app/pages/
└── day-view/                    # Route: /
    ├── day-view.component.ts   # Hauptseite, hält currentDate Signal
    ├── day-view.component.html  # Template: Kalender-Nav + 3 Slots
    └── day-view.component.scss  # Styles für Slot-Cards

app/components/
├── slot-card/                   # Ein einzelner Slot (Morning/Afternoon/Evening)
│   ├── slot-card.component.ts   # Inputs: slot, date, tasks
│   ├── slot-card.component.html
│   └── slot-card.component.scss
└── task-dropdown/              # Dropdown-Overlay für Task-Auswahl
    ├── task-dropdown.component.ts
    ├── task-dropdown.component.html
    └── task-dropdown.component.scss
```

**Services:**
```
app/services/
├── day.service.ts              # GET/PUT /api/days/:date
├── task.service.ts              # GET /api/tasks
└── template.service.ts          # GET /api/templates (intern, nur für Tag-Logik)
```

**State (Signals):**
```typescript
// day-view hält:
currentDate = signal<Date>(new Date());          // Navigiertes Datum
dayData = signal<DayData | null>(null);          // Geladene Tag-Daten
tasks = signal<Task[]>([]);                       // Verfügbare Tasks
isLoading = signal<boolean>(false);

// computed:
daySlots = computed(() => dayData()?.slots);
```

**Datum-Navigation:** Einfache +/- 1 Tag-Logik, kein Full-Router-Navigate. URL ändert sich nicht.

**Task-Dropdown:** Overlay-Position basierend auf Slot-Position im Viewport. Schließt bei ESC oder Click-Outside.

---

### Backend

**Controller:** `backend/src/controllers/daysController.js`
- `getDay(req, res)` — liest Tag aus DB, wendet Templates an
- `updateDay(req, res)` — updated Slot(s)

**Service:** `backend/src/services/daysService.js`
- `applyTemplatesToDay(date, dayRecord)` — prüft alle aktiven Templates gegen Wochentag + Slot
- `getOrCreateDayRecord(date)` — holt oder erstellt Day-Record

**Model:** `backend/src/models/dayModel.js`
- `getDayByDate(date)` — SELECT aus days WHERE date = ?
- `upsertDay(date, slots)` — INSERT OR REPLACE

**Routes:** `backend/src/routes/days.js` (existiert bereits als Stub)

**Tasks:** `backend/src/routes/tasks.js` (existiert bereits als Stub — nur GET implementieren)

---

### API-Design

**GET /api/days/:date**
```
Response 200:
{
  "date": "2026-06-29",
  "slots": {
    "morning": { "status": "set", "taskId": "work-1", "task": { "id": "work-1", "name": "Work", "statName": "Academics" }, "completed": false },
    "afternoon": { "status": "free" },
    "evening": { "status": "free" }
  }
}

Response 404:
{ "error": "DAY_NOT_FOUND" }
```

**PUT /api/days/:date**
```
Request:
{
  "slots": {
    "morning": { "status": "set", "taskId": "study-1" }
  }
}

Response 200:
{ "date": "2026-06-29", "slots": { ... } }

Response 400 (validation error):
{ "error": "VALIDATION_ERROR", "message": "Invalid slot data" }
```

**GET /api/tasks**
```
Response 200:
[
  { "id": "work-1", "name": "Work", "statId": "academics-1", "statName": "Academics", "statGain": 3 },
  { "id": "study-1", "name": "Study", "statId": "academics-1", "statName": "Academics", "statGain": 2 },
  ...
]
```

---

### Template-Application-Logik (serverseitig)

```
GET /api/days/:date
1. Parse date → dayOfWeek (0=Sun ... 6=Sat)
2. SELECT * FROM days WHERE date = ?
3. Falls kein Record → erstelle leeres Day-Objekt
4. SELECT * FROM templates WHERE enabled = 1
5. Für jeden Slot (morning/afternoon/evening):
   a. Finde Template das für slot + dayOfWeek matcht
   b. Falls kein expliziter Day-Record für den Slot existiert → nimm Template.taskId
6. Für jeden Task in Slots: JOIN mit tasks TABLE für statName
7. Return formatiertes Day-Objekt
```

---

### Datenmodell-Erweiterung (keine neue Tabelle nötig)

Die `days` Tabelle speichert explizite Overrides. Templates werden zur Laufzeit angewendet. Keine Änderung am Schema nötig für Slice 1.

---

### Date-Parsing

- Backend: `new Date(dateString)` → `date.getDay()` für Wochentag
- Frontend: `date.pipe('EEEE, MMMM d, y')` für Anzeige

---

### Test-Strategie

- **Backend:** curl-Tests für API-Endpoints nach Migration
- **Frontend:** Manuelles Testen (noch keine Unit-Tests in Slice 1)
- **Template-Logik:** Testfälle im Headless definieren:
  - Montag → Work in Morning
  - Samstag → kein Work in Morning
  - Tag mit explizitem Override → Template wird nicht angewendet

# Tasks: Slice 1 — Day Planner

Reihenfolge: Backend zuerst (da Frontend davon abhängt), dann Frontend.

---

## Backend

### T-1: Backend — Migration erweitern (Seed-Tasks + Work-Template)

**File:** `backend/database/migrate.js`

**Was:**
- Seed 5 Tasks (Work, Study, Gym, Social, Hobbies)
- Seed 1 Template (Work → Morning, Mo-Fr, enabled=1)

**Steps:**
- [ ] Bestehendes Schema prüfen (Stats + Tasks + Days + Templates + Settings existieren bereits)
- [ ] Nach `INSERT INTO tasks` Block hinzufügen: 5 Tasks mit statId + statGain
- [ ] Nach `INSERT INTO templates` Block hinzufügen: Work-Template
- [ ] `npm run migrate` ausführen → verifizieren dass Seeds eingetragen

---

### T-2: Backend — Days Controller erweitern

**File:** `backend/src/controllers/daysController.js` (neu)

**Was:** Holt Day + wendet Templates an

**Steps:**
- [ ] `daysController.js` erstellen mit `getDay` und `updateDay`
- [ ] `getDay`: Hole Day-Record, Parse Wochentag, Lade aktive Templates
- [ ] `getDay`: Für jeden Slot — prüfe Template-Match, überschreibe nicht wenn Day-Record explizit gesetzt hat
- [ ] `getDay`: JOIN mit tasks für taskName + statName in Response
- [ ] `updateDay`: Validiere Request-Body, Update Day-Record (INSERT OR REPLACE)
- [ ] `updateDay`: Bei Erfolg `getDay` aufrufen und zurückgeben

---

### T-3: Backend — Days Service erstellen

**File:** `backend/src/services/daysService.js` (neu)

**Was:** Business-Logik für Tag + Template-Application

**Steps:**
- [ ] `daysService.js` erstellen
- [ ] `getOrCreateDayRecord(date)`: SELECT oder INSERT
- [ ] `applyTemplatesToDay(date, dayRecord, templates)`: Template-Matching-Logik
- [ ] `buildDayResponse(day, tasksMap)`: Formatiere für API-Response (inkl. statName aus JOIN)

---

### T-4: Backend — Days Model erstellen

**File:** `backend/src/models/dayModel.js` (neu)

**Was:** Datenbankzugriff für Days

**Steps:**
- [ ] `dayModel.js` erstellen
- [ ] `getDayByDate(date)`: `SELECT * FROM days WHERE date = ?`
- [ ] `upsertDay(date, slots)`: `INSERT OR REPLACE INTO days ...`
- [ ] `getActiveTemplates()`: `SELECT * FROM templates WHERE enabled = 1`
- [ ] `getAllTasks()`: `SELECT t.*, s.name as statName FROM tasks t LEFT JOIN stats s ON t.statId = s.id`

---

### T-5: Backend — Days Route updaten

**File:** `backend/src/routes/days.js`

**Was:** Stub → echte Implementation mit Controller

**Steps:**
- [ ] Alte Stub-Implementierung ersetzen durch Import + Nutzung von `daysController`
- [ ] GET `/:date` → `daysController.getDay`
- [ ] PUT `/:date` → `daysController.updateDay`
- [ ] Testen: `curl http://localhost:3000/api/days/2026-06-29`

---

### T-6: Backend — Tasks Route: GET implementieren

**File:** `backend/src/routes/tasks.js`

**Was:** POST/DELETE sind Out-of-Scope, aber GET muss Tasks mit statName liefern

**Steps:**
- [ ] GET `/tasks` → lade alle Tasks mit LEFT JOIN stats für statName
- [ ] Response: `[{ id, name, statId, statName, statGain }]`
- [ ] Testen: `curl http://localhost:3000/api/tasks`

---

### T-7: Backend — Verify

**Steps:**
- [ ] `npm run migrate` — neu seeden
- [ ] `curl http://localhost:3000/api/tasks` → 5 Tasks
- [ ] `curl http://localhost:3000/api/days/2026-06-29` → Montag → Work in Morning
- [ ] `curl http://localhost:3000/api/days/2026-06-27` → Samstag → kein Work
- [ ] `curl -X PUT http://localhost:3000/api/days/2026-06-29 -H "Content-Type: application/json" -d '{"slots":{"afternoon":{"status":"set","taskId":"study-1"}}}'` → Update verifizieren

---

## Frontend

### T-8: Frontend — App-Routing + Config

**Files:** `frontend/src/app/app.routes.ts`, `frontend/src/app/app.config.ts`

**Steps:**
- [ ] `app.routes.ts` erstellen: Route `{ path: '', component: DayViewComponent }`
- [ ] `app.config.ts` erstellen: `provideRouter`, `provideHttpClient`
- [ ] `main.ts` updaten: `bootstrapApplication(AppComponent, appConfig)`
- [ ] `app.component.ts`: `<router-outlet>` statt aktueller Inline-Template

---

### T-9: Frontend — TypeScript Models

**File:** `frontend/src/app/models/index.ts`

**Steps:**
- [ ] `Day`, `Slot`, `Task`, `Stat`, `Template` Interfaces definieren
- [ ] API-Response-Typen: `DayResponse`, `TaskResponse`, `UpdateSlotPayload`

---

### T-10: Frontend — Day Service

**File:** `frontend/src/app/services/day.service.ts`

**Steps:**
- [ ] `DayService` mit `HttpClient`
- [ ] `getDay(date: string): Observable<DayResponse>`
- [ ] `updateDay(date: string, slots: Partial<Slots>): Observable<DayResponse>`

---

### T-11: Frontend — Task Service

**File:** `frontend/src/app/services/task.service.ts`

**Steps:**
- [ ] `TaskService` mit `HttpClient`
- [ ] `getTasks(): Observable<Task[]>`

---

### T-12: Frontend — DayView Page Component

**File:** `frontend/src/app/pages/day-view/`

**Steps:**
- [ ] `day-view.component.ts` — Signal-basiert: `currentDate`, `dayData`, `tasks`, `isLoading`
- [ ] `goToPreviousDay()`, `goToNextDay()`, `goToToday()` Methoden
- [ ] On `currentDate` change → `dayService.getDay()` aufrufen
- [ ] Template: Kalender-Navigation + 3 `<app-slot-card>` Komponenten
- [ ] SCSS: Tagesansicht, Slot-Layout

---

### T-13: Frontend — Slot-Card Component

**File:** `frontend/src/app/components/slot-card/`

**Steps:**
- [ ] `slot-card.component.ts` mit `input()` für `slot`, `tasks`, `date`
- [ ] `output()` für `taskSelected` Event
- [ ] Visuelle Darstellung: Slot-Name, Status (free/set), Task-Name + Stat-Badge
- [ ] Click-Handler öffnet `<app-task-dropdown>` Overlay
- [ ] SCSS: Free-State (grau), Set-State (dunkel, prominent), Hover-Effekt

---

### T-14: Frontend — Task-Dropdown Component

**File:** `frontend/src/app/components/task-dropdown/`

**Steps:**
- [ ] `task-dropdown.component.ts` mit `input()` für `tasks`, `position`
- [ ] Click auf Task → `taskSelected.emit(taskId)`
- [ ] "Remove" Option → `taskSelected.emit(null)`
- [ ] Schließen bei ESC oder Click-Outside
- [ ] SCSS: Overlay-Dropdown, Task-Liste, Stat-Badge pro Eintrag

---

### T-15: Frontend — Entry-Point Styles

**File:** `frontend/src/styles.scss`

**Steps:**
- [ ] CSS Custom Properties für Theme (P5 default)
- [ ] Globale Reset/Base-Styles
- [ ] Font-Setup (Google Fonts? oder System-Fonts)

---

### T-16: Frontend — Build + Verify

**Steps:**
- [ ] `cd frontend && npm start` → Kompiliert ohne Fehler
- [ ] Browser öffnet `http://localhost:4200`
- [ ] Heutiger Tag wird angezeigt (Montag → Work in Morning)
- [ ] Slot-Klick öffnet Dropdown
- [ ] Task-Auswahl aktualisiert Slot
- [ ] Navigation ← → funktioniert
- [ ] Keine TypeScript-Fehler in Console

---

## Misbehavior-Tally (wird während Implementierung geführt)

| # | Was | Abweichung von Proposal/Design | Status |
|---|-----|-------------------------------|--------|
| M1 | | | |

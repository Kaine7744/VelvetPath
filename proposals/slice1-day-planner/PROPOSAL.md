# Proposal: Slice 1 — Day Planner (3-Slot View)

## Ziel

Ein funktionierender Tagesplaner mit 3 Slots (Morning, Afternoon, Evening), Template-Auto-Population für Work (Mo-Fr) und Task-Auswahl pro Slot.

## Scope

### In Scope
- [ ] Kalendernavigation (← Heute →)
- [ ] 3-Slot-Tagesansicht (Morning / Afternoon / Evening)
- [ ] Slot befüllen: Dropdown mit vordefinierten Tasks (Work, Study, Gym, etc.)
- [ ] Template-Auto-Population: Work erscheint automatisch Mo-Fr im Morning-Slot
- [ ] Slot leeren (Task entfernen)
- [ ] Task-Objekt zeigt Stat-Zugehörigkeit (Tooltip oder Badge)
- [ ] Backend: GET/PUT `/api/days/:date`
- [ ] Backend: GET `/api/tasks`
- [ ] Backend: GET `/api/templates`
- [ ] Backend: Seed-Tasks (Work, Study, Gym, Social, Hobbies)
- [ ] Backend: Seed-Template (Work → Morning, Mon-Fri)

### Out of Scope (diese Slice)
- Statistics Dashboard
- PDF Export
- Profile Image Upload
- Custom Task Creation (Dropdown ist statisch, vorausgefüllt)
- Recurring Template UI (Template-Management-Seite)
- Theme Switcher
- Stat-Growth-Berechnung

## Erwartetes Ergebnis

Ein Benutzer kann:
1. Tage navigieren (zurück/heute/vor)
2. Einen Slot anklicken → Dropdown mit Tasks erscheint
3. Task auswählen → Slot zeigt Task-Namen + Stat-Badge
4. Task entfernen → Slot wird "free"
5. Mo-Fr hat Work automatisch im Morning-Slot

## Risiken / Annahmen

- **Annahme:** Slot-Daten (`status: 'free' | 'set'`, `taskId`, `completed`) reichen vorerst für das Datenmodell
- **Risiko:** Stat-Badge-Anzeige ist nur ein einfaches Label, kein ausführliches Stat-Dashboard
- **Risiko:** Task-Dropdown ist statisch (kein CRUD für Tasks in dieser Slice)

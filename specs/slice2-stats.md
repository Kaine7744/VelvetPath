# Spec: Slice 2 — Stats & Completion

## Overview

Tasks können als "erledigt" markiert werden. Bei Erledigung wächst der zugehörige Stat. Alle Stats werden in einem Dashboard angezeigt.

---

## FR-7: Task als erledigt markieren

### Beschreibung

Ein "set"-Slot zeigt einen Check-Button. Bei Klick wird `completed: true` gesetzt → der Stat des Tasks wächst um `statGain`.

### Akzeptanzkriterien

- [ ] Check-Button erscheint nur bei Slots mit `status: 'set'` und `completed: false`
- [ ] Check-Button ist visuell prominent (z.B. grüner Kreis mit Haken, Persona-Stil)
- [ ] Bei Klick: `PUT /api/days/:date` mit `completed: true` → Backend berechnet Stat-Growth
- [ ] Nach Erledigung: Slot zeigt visuell "abgehakt" (z.B. grüner Hintergrund, durchgestrichen oder Icon)
- [ ] Erledigter Slot kann nicht mehr auf "free" gesetzt werden (nur via Check-Button rückgängig)
- [ ] Stat-Growth wird in Echtzeit im Slot angezeigt (z.B. "+2 Academics" Animation)

### Datenfluss

1. `PUT /api/days/:date` mit `{ slots: { morning: { completed: true } } }`
2. Backend: Liest `task.statGain`, addiert zu `stat.currentValue`
3. Backend: Persistiert neuen `stat.currentValue` in DB
4. Backend: Gibt aktualisierten Slot + neuen Stat-Wert zurück
5. Frontend: Slot-UI aktualisiert sich, "+X Stat" Animation

### Backend-Logik

```javascript
// in updateDay or separate endpoint
const task = await db.getTaskById(taskId);
const stat = await db.getStatById(task.statId);
const newValue = stat.currentValue + task.statGain;
await db.updateStat(stat.id, newValue);
```

---

## FR-8: Stats-Dashboard

### Beschreibung

Eine neue Seite `/stats` zeigt alle Stats mit aktuellen Werten, Icon/Visualisierung und 最近 Wachstum.

### Akzeptanzkriterien

- [ ] `/stats` Route mit `StatsPageComponent`
- [ ] Zeigt alle 5 Default-Stats (Guts, Courage, Academics, Kindness, Proficiency)
- [ ] Pro Stat: Icon/Visualisierung, Name, aktueller Wert, Fortschrittsbalken (0–100)
- [ ] Growth-Anzeige: "Heute +5", "Diese Woche +12" etc.
- [ ] Navigation von Day-View zu Stats (Header-Link)
- [ ] Custom Stats (falls vorhanden) werden ebenfalls angezeigt

### UI-Layout

```
┌─────────────────────────────────────────────┐
│  ≋ STATS              [Day Planner]        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌─────────────┐  ┌─────────────┐         │
│  │ ⚔️ GUTS     │  │ 💪 COURAGE  │         │
│  │ ████░░ 65   │  │ ███░░░ 50   │         │
│  │ Today: +2   │  │ Today: +0   │         │
│  └─────────────┘  └─────────────┘         │
│                                             │
│  ┌─────────────┐  ┌─────────────┐         │
│  │ 📚 ACADEMICS│  │ 💗 KINDNESS  │         │
│  │ ██████░ 80  │  │ ████░░ 55   │         │
│  │ Today: +5   │  │ Today: +2   │         │
│  └─────────────┘  └─────────────┘         │
│                                             │
│  ┌─────────────┐                           │
│  │ 🔧 PROFICIENCY│                          │
│  │ ███░░░ 45   │                           │
│  │ Today: +0   │                           │
│  └─────────────┘                           │
│                                             │
└─────────────────────────────────────────────┘
```

### API-Endpoints

| Method | Endpoint | Beschreibung |
|--------|----------|--------------|
| GET | `/api/stats` | Alle Stats mit currentValue |
| POST | `/api/stats/:id/grow` | Stat um statGain erhöhen (intern, von updateDay aufgerufen) |

### Backend-Änderungen

- `updateDay` muss bei `completed: true` den Stat-Growth trigger
- Neuer Endpoint `POST /api/stats/:id/grow` oder inline in `updateDay`
- `days` Tabelle braucht `completed` Spalten (existieren bereits)

---

## Out of Scope (Slice 2)

- Persona-Style UI komplett (kommt in Slice 3)
- PDF-Export
- Bildupload
- Custom Stat Creation UI
- Statistik-Seite (Day/Week/Month/Year views)

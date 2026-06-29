# VelvetPath

A Persona-inspired daily planner that divides your day into meaningful slots, tracks task completion, and grows your stats over time.

## Overview

Inspired by the Persona 3/4/5 Free Time mechanics, VelvetPath helps you focus on 2-3 intentions per day rather than overwhelming yourself with unlimited tasks. Unlike traditional todo apps, you never "finish" tasks by clicking them — you simply record what you did, and stats grow accordingly.

## Workflow — Spec-Driven mit OpenSpec (OPSX)

### Phasen

| Phase | Was passiert | User-Input |
|-------|--------------|------------|
| **Phase 1** | Scaffold + Git-Baseline setzen | Review der Struktur |
| **Phase 2** | CLAUDE.md bootstrapping (erster Entwurf) | Feedback + Approve |
| **Phase 3** | Architektur-Dokumentation (`docs/ARCHITECTURE.md`, `docs/GUIDELINES.md`) | Review |
| **Phase 4** | Erste Slice vorschlagen (`/opsx:propose`) — proposal, spec, design, tasks | **Approval bevor Implementierung** |
| **Phase 5** | Implementieren (`/opsx:apply`) — kleine, nachvollziehbare Diffs | — |
| **Phase 6** | Harness weiterentwickeln — CLAUDE.md/GUIDELINES.md anpassen basierend auf Feedback | Review |

### OPSX-Slice-Prinzip

- **Immer nur EINE kleine Slice auf einmal** — nicht die ganze App auf einmal bauen
- Eine Slice = z.B. "Dateneingabe-Formular + Live-Preview für EIN Template, ohne PDF-Export"
- Jede Slice bringt ein ** Ende-zu-Ende funktionierendes** Feature, auch wenn reduziert
- Nach jeder Slice: kurzer Rückblick + Misbehavior-Tally besprechen

### Misbehavior-Tally

Während der Implementierung notiere ich:
- Wo ich vom Proposal/Design abgewichen bin
- Unsicherheiten oder Kompromisse die ich eingehen musste
- Das besprechen wir nach der Slice — bevor die nächste beginnt

### Diffs klein halten

- pro Task nur eine fokussierte Änderung
- kein "commit when done" — regelmäßig committen
- Jeder Diff soll in 5 Minuten reviewbar sein

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 18 (standalone, SCSS) |
| Backend | Express/Node (MVC) |
| Database | SQLite (via sql.js) |
| PDF Export | Puppeteer (server-side) |
| Image Upload | Multer (server-side) |
| Deployment | Railway / Render (free tier) |

## Project Structure

```
VelvetPath/
├── frontend/                 # Angular 18 standalone app
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Route pages (views)
│   │   │   ├── services/   # State management & API
│   │   │   └── models/     # TypeScript interfaces
│   │   ├── assets/         # Static assets, themes
│   │   └── styles/         # Global styles (SCSS)
├── backend/                 # Express API (MVC)
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Data models & DB queries
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   └── database/       # SQLite setup & migrations
│   └── uploads/            # Uploaded profile images
├── docs/                    # Architecture & guideline docs
├── CLAUDE.md               # This file
└── README.md               # User-facing documentation
```

## Code Conventions

- **Clean Code** — meaningful names, small functions, single responsibility
- **Angular**: Standalone components, signals for state, feature-based organization
- **Express/MVC**: Controllers handle requests, services contain logic, models handle data
- **Always ask when unclear** — if requirements are ambiguous, ask the user before proceeding
- **Small Diffs** — one focused change per commit, reviewable in 5 minutes
- **TypeScript strict mode** — no `any`, fully typed

## CLI Commands

| Command | Purpose |
|---------|---------|
| `npm run start` | Run both frontend and backend in dev mode |
| `npm run build` | Production build for both frontend and backend |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
| `npm run db:migrate` | Run database migrations |

## Development Notes

- Frontend dev server: `http://localhost:4200`
- Backend API: `http://localhost:3000`
- SQLite database file: `backend/database/velvetpath.db`
- Proxy: `/api` requests from Angular → Express via `frontend/proxy.conf.json`

---

## VelvetPath Domain — Detail

### Day Structure

Like an Outlook Calendar divided into 3 time slots per day:

| Day Type | Morning | Afternoon | Evening |
|----------|---------|-----------|---------|
| Weekday (Mon-Fri) | Work (recurring) | Free | Free |
| Weekend (Sat-Sun) | Free | Free | Free |

- **3 slots total** on all days (Morning, Afternoon, Evening)
- **Each slot** is either **empty** (`free`) or **has an event set** (`set`)
- **Work** is a default recurring event pre-populated in Morning slot Mon-Fri
  - Can be deleted from any specific day (like removing an Outlook occurrence)
  - Like Outlook: the template defines the pattern, individual days can override

### Default Stats (Persona 5 Royal)

| Stat | Description |
|------|-------------|
| Guts | Courage and bravery |
| Courage | Willingness to take risks |
| Academics | Knowledge and learning |
| Kindness | Compassion and empathy |
| Proficiency | Skill and dexterity |

### Features

1. **Day Planner** — View/edit 3-slot day like a mini Outlook Calendar
2. **Event Management** — Dropdown event selection, stat assignment, no forced completion
3. **Recurring Templates** — Outlook-style recurrence (e.g., Work every Mon-Fri Morning)
4. **Statistics Dashboard** — Day/Week/Month/Year views with date selectors
5. **Settings** — Theme switcher (P3/P4/P5 inspired)

### Themes

| Theme | Primary Colors |
|-------|---------------|
| Persona 5 (default) | Red accents, black/dark background |
| Persona 4 | Golden yellow, bright atmosphere |
| Persona 3 | Dark blue, melancholic tones |

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/days/:date` | Get a specific day's data |
| PUT | `/api/days/:date` | Update a day's slots |
| GET | `/api/tasks` | Get all available tasks (for dropdown) |
| POST | `/api/tasks` | Create a new task (auto-added to dropdown) |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/stats` | Get all stats |
| POST | `/api/stats` | Create a custom stat |
| GET | `/api/statistics/:period` | Get statistics for period (day/week/month/year) |
| GET | `/api/templates` | Get recurring templates |
| POST | `/api/templates` | Create a recurring template |
| PUT | `/api/templates/:id` | Update a recurring template |
| DELETE | `/api/templates/:id` | Delete a recurring template |
| GET | `/api/settings` | Get user settings |
| PUT | `/api/settings` | Update user settings |

### Data Models

```typescript
interface Day {
  date: string; // YYYY-MM-DD
  slots: {
    morning: Slot;
    afternoon: Slot;
    evening: Slot;
  };
}

interface Slot {
  status: 'free' | 'set';
  taskId?: string;
  completed: boolean;
}

interface Task {
  id: string;
  name: string;
  statId?: string;
  statGain?: number;
}

interface RecurringTemplate {
  id: string;
  taskId: string;
  slot: 'morning' | 'afternoon' | 'evening';
  daysOfWeek: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  enabled: boolean;
}

interface Stat {
  id: string;
  name: string;
  description: string;
  isDefault: boolean;
  currentValue: number;
}
```

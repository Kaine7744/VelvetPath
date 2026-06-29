# VelvetPath

A Persona-inspired daily planner that divides your day into meaningful slots, tracks task completion, and grows your stats over time.

## Overview

Inspired by the Persona 3/4/5 Free Time mechanics, VelvetPath helps you focus on 2-3 intentions per day rather than overwhelming yourself with unlimited tasks. Unlike traditional todo apps, you never "finish" tasks by clicking them — you simply record what you did, and stats grow accordingly.

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular (component-based) |
| Backend | Express/Node (MVC) |
| Database | SQLite (via better-sqlite3) |
| Deployment | Railway / Render (free tier) |

## Project Structure

```
VelvetPath/
├── frontend/                 # Angular application
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/  # Reusable UI components
│   │   │   ├── pages/       # Route pages (views)
│   │   │   ├── services/    # State management & API
│   │   │   └── models/      # TypeScript interfaces
│   │   ├── assets/          # Static assets, themes
│   │   └── styles/          # Global styles
├── backend/                  # Express API (MVC)
│   ├── controllers/         # Request handlers
│   ├── models/              # Data models & DB queries
│   ├── routes/              # API route definitions
│   ├── services/            # Business logic
│   └── database/            # SQLite setup & migrations
├── CLAUDE.md                # This file
└── README.md                # User-facing documentation
```

## Day Structure

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
- **Evening slot**: Available on weekends by default (user preference)

## Default Stats (Persona 5 Royal)

| Stat | Description |
|------|-------------|
| Guts | Courage and bravery |
| Courage | Willingness to take risks |
| Academics | Knowledge and learning |
| Kindness | Compassion and empathy |
| Proficiency | Skill and dexterity |

Users can add **custom stats** beyond these defaults. Stats increase when associated tasks are completed.

## Features

1. **Day Planner** — View/edit 3-slot day like a mini Outlook Calendar
2. **Event Management** — Dropdown event selection, stat assignment, no forced completion
3. **Recurring Templates** — Outlook-style recurrence (e.g., Work every Mon-Fri Morning)
4. **Statistics Dashboard** — Day/Week/Month/Year views with date selectors
5. **Settings** — Theme switcher (P3/P4/P5 inspired)

## Statistics Tracked

- Tasks completed per period (day/week/month/year)
- Time-of-day completion patterns
- Stat growth over time
- Completion rate per category
- Streaks (consecutive days with completed tasks)

## Themes

| Theme | Primary Colors |
|-------|---------------|
| Persona 5 (default) | Red accents, black/dark background |
| Persona 4 | Golden yellow, bright atmosphere |
| Persona 3 | Dark blue, melancholic tones |

## CLI Commands

| Command | Purpose |
|---------|---------|
| `npm run start` | Run both frontend and backend in dev mode |
| `npm run build` | Production build for both frontend and backend |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
| `npm run db:migrate` | Run database migrations |

## API Endpoints

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

## Data Models

### Day
```
{
  date: string,           // YYYY-MM-DD
  slots: {
    morning: Slot,
    afternoon: Slot,
    evening: Slot
  }
}
```

### Slot
```
{
  status: 'free' | 'set',  // empty or has a task assigned
  taskId?: string,        // Reference to Task if status === 'set'
  completed: boolean      // Did you do this? (persisted, never forced)
}
```

### Task (what you choose from dropdown)
```
{
  id: string,
  name: string,           // e.g., "Work", "Study Japanese", "Gym"
  statId?: string,        // Which stat this grows (optional)
  statGain?: number       // How much stat increases on completion
}
```

### RecurringTemplate (like Outlook Calendar recurrence)
```
{
  id: string,
  taskId: string,         // The task to assign (e.g., "Work")
  slot: 'morning' | 'afternoon' | 'evening',
  daysOfWeek: number[],   // 0=Sun, 1=Mon, ..., 6=Sat
  enabled: boolean        // Master toggle for this template
}
```

**How it works:**
1. User opens a slot → dropdown shows all available Tasks
2. User picks existing Task OR creates new one (added to dropdown for future use)
3. Recurring templates auto-populate slots on matching days

### Stat
```
{
  id: string,
  name: string,          // e.g., "Guts", "Academics"
  description: string,
  isDefault: boolean,    // true for P5R defaults
  currentValue: number
}
```

## Code Conventions

- **Clean Code** — meaningful names, small functions, single responsibility
- **Angular**: Standalone components, signals for state, feature-based organization
- **Express/MVC**: Controllers handle requests, services contain logic, models handle data
- **Always ask when unclear** — if requirements are ambiguous, ask the user before proceeding

## Development Notes

- Frontend dev server: `http://localhost:4200`
- Backend API: `http://localhost:3000`
- SQLite database file: `backend/database/velvetpath.db`

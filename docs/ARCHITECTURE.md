# VelvetPath — Architecture

## Overview

VelvetPath is a single-user daily planner with recurring events, stat tracking, and statistics. Data is stored in SQLite (sql.js). No authentication.

## Component Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Angular 18 Frontend                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │ DayView  │  │TaskModal │  │StatsPage│  │SettingsPage │  │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       └──────────────┼────────────┴───────────────┘          │
│                      │ Services (Angular Signals)           │
│                      │ CVDataService, TemplateService        │
└──────────────────────┼──────────────────────────────────────┘
                       │ HTTP (proxied /api → :3000)
┌──────────────────────┼──────────────────────────────────────┐
│                Express.js Backend                            │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌─────────────┐  │
│  │  Days   │  │  Tasks   │  │  Stats   │  │  Templates  │  │
│  │ Routes  │  │  Routes  │  │  Routes  │  │   Routes   │  │
│  └────┬────┘  └────┬─────┘  └────┬─────┘  └──────┬──────┘  │
│       └─────────────┼────────────┴───────────────┘          │
│                     │ Controllers                            │
│                     ▼                                        │
│            ┌────────────────┐  ┌────────────────────────┐   │
│            │    Services    │  │      Database          │   │
│            │ (business logic)│◄─►│  (sql.js / SQLite)   │   │
│            └────────────────┘  └────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Structure
```
frontend/src/app/
├── components/        # Reusable UI components (slot, dropdown, stat-badge)
├── pages/             # Route-level pages (day-view, stats-dashboard, settings)
├── services/          # Angular services + signals for state
└── models/           # TypeScript interfaces (Day, Slot, Task, Stat, etc.)
```

### State Management
- **Angular Signals** (`signal()`, `computed()`) for reactive state
- **Services** hold state, components consume via `input()`/`output()` and signal reads
- No external state library (NgRx etc.) needed for a single-user app

### Key Services
- `DayService` — CRUD for day slots, template application
- `TaskService` — Task CRUD, stat assignment
- `StatService` — Stat values, growth calculation
- `TemplateService` — Recurring template management
- `SettingsService` — Theme, user preferences

## Backend Architecture

### MVC Pattern
```
routes/   → HTTP endpoints (GET, POST, PUT, DELETE)
         ↓
controllers/ → Request parsing, validation, response formatting
         ↓
services/    → Business logic (stat growth, template application, statistics)
         ↓
models/      → sql.js queries, database persistence
```

### Database (sql.js)

SQLite via sql.js (WebAssembly). Single file: `backend/database/velvetpath.db`.

**Schema:**
```sql
CREATE TABLE stats (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  isDefault INTEGER DEFAULT 0,
  currentValue INTEGER DEFAULT 0
);

CREATE TABLE tasks (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  statId TEXT REFERENCES stats(id),
  statGain INTEGER DEFAULT 0,
  createdAt TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE days (
  id TEXT PRIMARY KEY,
  date TEXT UNIQUE NOT NULL, -- YYYY-MM-DD
  morningStatus TEXT DEFAULT 'free',  -- 'free' | 'set'
  morningTaskId TEXT REFERENCES tasks(id),
  morningCompleted INTEGER DEFAULT 0,
  afternoonStatus TEXT DEFAULT 'free',
  afternoonTaskId TEXT REFERENCES tasks(id),
  afternoonCompleted INTEGER DEFAULT 0,
  eveningStatus TEXT DEFAULT 'free',
  eveningTaskId TEXT REFERENCES tasks(id),
  eveningCompleted INTEGER DEFAULT 0
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  taskId TEXT REFERENCES tasks(id),
  slot TEXT NOT NULL,           -- 'morning' | 'afternoon' | 'evening'
  daysOfWeek TEXT NOT NULL,      -- CSV, e.g. "1,2,3,4,5"
  enabled INTEGER DEFAULT 1
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT
);
```

### PDF Export (Puppeteer)

```
POST /api/pdf
Body: { html: string, data: CVData }
     ↓
Express Controller receives HTML template + data
     ↓
PuppeteerService renders HTML in headless Chrome
     ↓
Returns PDF as application/pdf response
```

Preview in Angular uses the **same HTML template** — just rendered in a `<div>` instead of Puppeteer. This guarantees WYSIWYG.

### Image Upload (Multer)

```
POST /api/upload
Content-Type: multipart/form-data
Body: { image: File }
     ↓
Multer saves to backend/uploads/:filename
     ↓
Returns { url: "/uploads/:filename" }
     ↓
Angular stores URL in CV data JSON
```

## Theme System

Three Persona-themed color schemes via CSS custom properties:

| Variable | P5 (default) | P4 | P3 |
|----------|-------------|-----|-----|
| `--color-primary` | `#e91e63` | `#ffca28` | `#1a237e` |
| `--color-bg` | `#121212` | `#fafafa` | `#0d1b2a` |
| `--color-surface` | `#1e1e1e` | `#ffffff` | `#1b263b` |
| `--color-text` | `#ffffff` | `#212121` | `#e0e0e0` |

Themes are pure CSS — no JavaScript theme switching library needed.

## First Slice Scope (Phase 4)

See `specs/slice1-day-planner.md` for the first incremental feature slice.

For the initial slice, the focus is: **Day Planner view with 3-slot display, template auto-population, and task selection** — no statistics dashboard, no PDF export yet.

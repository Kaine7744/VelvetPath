# VelvetPath — Code Guidelines

## General

- **Small commits** — one focused change per commit, reviewable in 5 minutes
- **TypeScript strict mode** — no `any`, fully typed
- **Meaningful names** — variables/functions describe their purpose
- **Single responsibility** — each function does one thing

## Angular

- **Standalone components** — no NgModules
- **Signals** for state — `signal()` for mutable state, `computed()` for derived
- **Feature-based folders** — `pages/`, `components/`, `services/`, `models/`
- **Input/Output** — use `input()`, `output()` decorators (Angular 18)
- **No `any`** — use proper interfaces for all data shapes
- **SCSS** — use CSS custom properties for theming, no Tailwind

## Express / Node

- **MVC** — routes call controllers, controllers call services, services call models
- **Async/await** — always use `async`/`await`, never callback-style
- **Error handling** — try/catch in every handler, meaningful error messages
- **No magic strings** — define route constants, status codes as constants

## API Design

- **REST conventions** — `GET` (read), `POST` (create), `PUT` (replace), `DELETE` (remove)
- **JSON responses** — always `Content-Type: application/json`
- **Error format** — `{ error: string, message: string }`
- **Validation** — validate all input in controllers before calling services

## Git

- **Branch naming** — `feat/`, `fix/`, `chore/`, `docs/` prefixes
- **Commit messages** — imperative mood, short first line, description after blank
  - `feat: add day planner view`
  - `fix: correct slot status toggle behavior`
- **Never force-push** on shared branches

## Database

- **Migrations** — never modify existing tables in-place; add new migrations
- **IDs** — use UUID or timestamp+random strings, never auto-increment integers
- **Timestamps** — ISO 8601 strings (`YYYY-MM-DDTHH:mm:ssZ`)

## File Structure

```
backend/src/
├── controllers/     # One file per resource (days.js, tasks.js, stats.js)
├── services/        # Business logic separate from HTTP handling
├── routes/          # Route definitions (thin, delegate to controllers)
├── models/          # Database queries (optional layer if needed)
└── database/        # sql.js setup, migrations

frontend/src/app/
├── components/      # Small, reusable (slot-card, task-dropdown, stat-badge)
├── pages/           # Route-level (day-view, stats-page, settings-page)
├── services/        # API calls, state management
└── models/          # TypeScript interfaces
```

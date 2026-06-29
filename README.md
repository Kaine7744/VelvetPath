# VelvetPath

A Persona-inspired daily planner that divides your day into 3 meaningful slots, tracks what you actually did, and grows your stats over time.

## Overview

Inspired by the Persona 3/4/5 Free Time mechanics, VelvetPath helps you focus on just 2-3 intentions per day — not an overwhelming list of tasks. Unlike traditional todo apps:

- You **never "finish" tasks** by clicking them
- You simply **record what you did** at the end of the day
- Stats **grow automatically** based on what you completed
- Like an **Outlook Calendar** divided into 3 slots per day

## Quick Start

```bash
# Install dependencies
npm run install:all

# Start development (frontend + backend)
npm run start

# Build for production
npm run build
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular 18+ |
| Backend | Express.js |
| Database | SQLite |
| Deployment | Railway / Render |

## Features

- **3-Slot Day Planner** — Morning, Afternoon, Evening (like Outlook Calendar)
- **Recurring Events** — Set up "Work every Mon-Fri Morning" once
- **Stat Tracking** — Grow Guts, Courage, Academics, Kindness, Proficiency (Persona 5 style)
- **Statistics Dashboard** — Day/Week/Month/Year views
- **Theme Support** — Persona 3, 4, or 5 aesthetic

## Project Structure

```
VelvetPath/
├── frontend/          # Angular app
├── backend/           # Express API
├── CLAUDE.md          # Developer docs (you're reading this)
└── README.md
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | Angular (component-based) |
| Backend | Express/Node (MVC) |
| Database | SQLite (via better-sqlite3) |
| Deployment | Railway / Render (free tier) |

## CLI Commands

| Command | Description |
|---------|------------|
| `npm run start` | Start dev servers (frontend + backend) |
| `npm run build` | Production build |
| `npm run test` | Run tests |
| `npm run lint` | Lint code |
| `npm run db:migrate` | Run database migrations |

## License

MIT

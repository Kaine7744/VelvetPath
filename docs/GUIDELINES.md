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

---

## Persona UI Design Guidelines

### Overview

VelvetPath UI is inspired by Shin Megami Tensei/Persona games. The design should feel **dark, futuristic, and premium** — like a social management interface from Persona 5.

### Core Principles

1. **Dark base, glowing accents** — Near-black backgrounds with vibrant colored glows
2. **Hard edges, no rounded corners** — Sharp rectangles, no border-radius on main elements
3. **Typography as design element** — Bold headlines, strong contrast between headline and body
4. **Animation is communication** — Elements don't just appear; they arrive with intention
5. **Glow on interaction** — Everything that can be interacted with has a glow response

### Color (P5 Theme — default)

```scss
--color-primary: #e91e63;        // P5 Red/Pink
--color-accent: #ff1744;         // Brighter accent red
--color-glow: rgba(233,30,99,0.5); // Glow shadow color
--color-bg: #0a0a0f;             // Near-black background
--color-surface: #1a1a24;        // Card/surface background
--color-card: #252532;            // Elevated card background
--color-border: #3a3a4a;         // Subtle borders
--color-text: #ffffff;            // Primary text
--color-text-dim: #8888aa;       // Secondary/muted text
--color-success: #00e676;         // Completion green
--color-stat-guts: #e65100;       // Orange-red
--color-stat-courage: #f9a825;   // Yellow
--color-stat-academics: #1565c0;  // Blue
--color-stat-kindness: #c2185b;   // Pink
--color-stat-proficiency: #2e7d32; // Green
```

### Typography

```scss
// Headlines — Montserrat Bold/Black
font-family: 'Montserrat', sans-serif;
font-weight: 700;

// Body — Noto Sans
font-family: 'Noto Sans', sans-serif;
font-weight: 400;
```

### Component Patterns

**Buttons:**
- Sharp corners (border-radius: 0 or 2px max)
- Glow shadow on hover: `box-shadow: 0 0 20px var(--color-glow)`
- Transform scale(1.02) on hover
- Press effect: scale(0.98) on active

**Cards (Slot Cards, Stat Cards):**
- Background: `--color-card`
- Border: 1px solid `--color-border`
- On hover: border color transitions to `--color-primary` with glow
- Transition: 0.2s ease

**Check/Complete Button:**
- Circle with "✓" glyph inside
- Unchecked: dark with dim border
- Hover: glow appears
- Checked: `--color-success` green with bright glow, glyph visible

**Stat Badges:**
- Small pill shape (border-radius: 4px)
- Background: stat-specific color at 80% opacity
- Text: white, uppercase, small font
- Glow matching stat color on hover

### Animation Guidelines

| Animation | Duration | Easing | Description |
|-----------|----------|--------|-------------|
| Hover glow | 150ms | ease | Border/shadow color transition |
| Check success | 400ms | ease-out | Scale + color change + glow burst |
| Stat growth | 600ms | ease-out | Number counts up, glow pulse |
| Slot set | 300ms | ease | Border starts glowing |
| Page transition | 200ms | ease | Fade + slight slide |
| Dropdown open | 150ms | ease-out | Scale from 0.95 + fade |

### Spacing

- Base unit: 8px
- Component padding: 16px (2 units)
- Card gap: 16px
- Section gap: 32px (4 units)

### Shadows & Glows

```scss
// Standard glow
box-shadow: 0 0 20px var(--color-glow);

// Glow with spread
box-shadow: 0 0 30px 5px var(--color-glow);

// Inset glow (for active states)
box-shadow: inset 0 0 20px rgba(233,30,99,0.3);
```

### Scrollbar

```scss
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: 3px;
  &:hover {
    background: var(--color-primary);
  }
}
```

### Selection

```scss
::selection {
  background: var(--color-primary);
  color: white;
}
```

### Focus States

```scss
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
  box-shadow: 0 0 10px var(--color-glow);
}
```

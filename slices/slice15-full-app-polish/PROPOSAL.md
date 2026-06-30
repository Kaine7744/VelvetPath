# Slice 15 — Full App Polish

## Overview

Three items: VP logo fix, templates with end-date, and today summary view. Custom stats (O1) was already implemented.

---

## 1. Fix VP Logo (M3)

**File:** `frontend/src/app/components/side-nav/side-nav.component.ts`

The "VP" text logo at the top of the side-nav looked off due to glow and proportions.

**Fix:** Removed text-shadow glow, reduced font-size from 1.1rem to 0.9rem, increased letter-spacing to 0.3em, added text-transform uppercase.

---

## 2. Templates with End-Date (O2)

### Backend

**`backend/database/migrate.js`**
- Added `endDate TEXT` column to templates table
- Added `ALTER TABLE templates ADD COLUMN endDate TEXT` migration

**`backend/src/database/db.js`**
- `createTemplate()` — accepts `endDate` (null = indefinite)
- `updateTemplate()` — accepts `endDate`
- `getTemplatesForDay(dayOfWeek, date)` — second param `date` filters: `endDate IS NULL OR endDate >= date`
- Updated both callers (`getDay`, `updateDay`) to pass the concrete date to `getTemplatesForDay`

**`backend/src/routes/templates.js`**
- `POST /api/templates` — accepts `endDate`
- `PUT /api/templates/:id` — accepts `endDate`
- `GET /api/templates/for-day/:date` — passes date to `getTemplatesForDay`

### Frontend

**`frontend/src/app/models/index.ts`**
- `Template` interface: added `endDate?: string | null`

**`frontend/src/app/services/template.service.ts`**
- `createTemplate`/`updateTemplate` — accept `endDate`

**`frontend/src/app/pages/templates-page/templates-page.component.ts`**
- Added `endDate` signals (`editEndDate`, `newEndDate`)
- Edit form: date input for end date + "Empty = ongoing" hint
- Create form: date input for end date
- Template rows: show end date or "ONGOING" badge

---

## 3. Today Summary View (O3)

### New Page

**`frontend/src/app/pages/summary-page/summary-page.component.ts`** (new)
- Route: `/summary`
- Shows today's date with a persona-styled header
- Completion bar: X/3 slots completed with percentage
- 3 slot cards: Morning / Afternoon / Evening — each shows task name, completed status, stat gain
- Recurring tasks section: which recurring tasks are filling today
- Uses existing `DayService.getDay()`, `TemplateService.getTemplatesForDate()`, `TaskService`

### Navigation

**`frontend/src/app/app.routes.ts`**
- Added `{ path: 'summary', component: SummaryPageComponent }`

**`frontend/src/app/components/side-nav/side-nav.component.ts`**
- Added SUMMARY nav item between DAY and TASKS (clipboard/summary icon)

---

## Files Modified/Created

| File | Change |
|------|--------|
| `backend/database/migrate.js` | endDate column in templates table |
| `backend/src/database/db.js` | endDate in create/updateTemplate, date filter in getTemplatesForDay |
| `backend/src/routes/templates.js` | Accept endDate in POST/PUT |
| `frontend/src/app/models/index.ts` | Template.endDate |
| `frontend/src/app/services/template.service.ts` | endDate in create/update methods |
| `frontend/src/app/pages/templates-page/templates-page.component.ts` | endDate signals, form inputs, display |
| `frontend/src/app/pages/summary-page/summary-page.component.ts` | **NEW** — Today Summary page |
| `frontend/src/app/app.routes.ts` | /summary route |
| `frontend/src/app/components/side-nav/side-nav.component.ts` | SUMMARY nav, VP logo fix |

---

## Out of Scope
- Templates with start-date (O2 — only end-date done)
- Historical stat-growth chart
- Custom date range picker

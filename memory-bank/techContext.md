# Technical Context — Brasaland Monorepo

## Repository layout

| Path | Purpose |
|------|---------|
| `CONTEXT.md` | Company briefing — read before any feature work |
| `memory-bank/` | Active agent context (this folder) |
| `AGENTS.md` | Mandatory delivery workflow for coding agents |
| `.agents/` | Dev-tool config: rules + skills (NOT product code) |
| `uis/` | All user-facing frontends |
| `services/` | Backend APIs and workers (FastAPI per template) |
| `apps/` | Standalone apps/utilities (e.g. MS-2 operations) |
| `agents/` | Product agents built for the company (later modules) |
| `skills/` | Product skill integrations (later modules) |
| `archive/` | Milestone plans and historical context |

**Important:** `.agents/` configures Cursor/Windsurf/Claude Code. `/agents` and `/skills` are product code — do not confuse them.

## Current applications

### `uis/website` (MS-1 / MS-4)

- **Next.js App Router** + TypeScript + Tailwind CSS v4
- Dev: `npm run dev` → http://localhost:8080
- Routes: `/` (landing), `/application` (Brasa Points form)
- Legacy static M1: `archive/ms-1-website-static/`

### `uis/backoffice` (MS-4)

- Next.js App Router + TypeScript + Tailwind CSS v4
- Dev: `npm run dev` → http://localhost:3001
- Imports **`@brasaland/operations`** for dashboard metrics (revenue, rankings, top sellers, margins)
- Department table from `CONTEXT.md` via `data/departments.ts`

### `uis/talent-pipeline-tracker` (MS-3)

- Next.js App Router + TypeScript + Tailwind CSS v4
- Dev: `npm run dev` → http://localhost:3000
- API: `https://playground.4geeks.com/tracker/api/v1`
- **UI rule:** status/stage fields must show human-readable labels, never raw API values (`in_progress`, `personal_interview`, etc.)
- Full assignment: `archive/ms-3-plan/ms-3-CONTEXT.md` or `uis/talent-pipeline-tracker/CONTEXT.md`

### `apps/operations` (MS-2)

- TypeScript data-processing utilities (filter, search, financial calcs, validations)
- Dev: `npm run demo`, `npm run typecheck`
- Sample data in `src/data/samples.ts`

## Port conventions

| App | Port |
|-----|------|
| talent-pipeline-tracker | 3000 |
| backoffice | 3001 |
| website | 8080 |

## Architectural decisions

- Each UI app owns its layout, README, and dev command — no shared layout between public site and internal apps
- Company data for UI prototypes lives in app-local `data/` modules sourced from `CONTEXT.md`
- Bilingual EN/ES where user-facing; internal tools may start English-only
- Do not commit secrets; use `.env.local` for app-specific env vars (gitignored)

## Constraints

- Follow folder README before adding files in any top-level directory
- Do not modify `node_modules/` or vendor directories
- Do not duplicate apps at repo root — use `uis/`, `services/`, `apps/`
- Update `memory-bank/progress.md` after meaningful delivery steps

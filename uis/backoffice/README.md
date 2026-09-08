# Brasaland Backoffice · Milestone 4

Internal dashboard for **Brasaland Digital** — company KPIs, location network, and department priorities sourced from root `CONTEXT.md`.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Setup

```bash
cd uis/backoffice
npm install
```

## Run

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Routes

| Path | Purpose |
| ---- | ------- |
| `/` | Dashboard with KPIs, locations, and departments |

## Layout

Uses a slate sidebar + white content area — intentionally distinct from the public amber marketing site in `uis/website/`.

## Data

Company facts live in `data/company.ts`, aligned with root [`CONTEXT.md`](../../CONTEXT.md) and the location hierarchy from `uis/website/data/locations.js`.

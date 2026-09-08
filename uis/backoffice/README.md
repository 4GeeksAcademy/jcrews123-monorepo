# Brasaland Backoffice · Milestone 4+

Internal dashboard for **Brasaland Digital** — company KPIs, location network, department priorities, and operational tools.

## Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS v4

## Setup

```bash
cd uis/backoffice
npm install
cp .env.local.example .env.local   # optional; defaults API to localhost:8000
```

## Run

```bash
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

For **Incident Analysis** (`/incidents`), start the API first — see [`services/api/README.md`](../../services/api/README.md).

```bash
# Terminal 1 — API (port 8000)
cd services/api
pip install -r requirements.txt && pip install -e ../../packages/incident-analysis
uvicorn main:app --reload --port 8000

# Terminal 2 — Backoffice (port 3001)
cd uis/backoffice && npm run dev
```

## Routes

| Path | Purpose |
| ---- | ------- |
| `/` | Dashboard with KPIs, locations, and departments |
| `/incidents` | Upload incident CSV, view validation summary, export results |

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI base URL for incident analysis |

## Layout

Slate sidebar + white content area — intentionally distinct from the public amber marketing site in `uis/website/`.

## Data sources

| Feature | Source |
|---------|--------|
| Dashboard KPIs | `@brasaland/operations` via `lib/operations-dashboard.ts` |
| Departments | `data/departments.ts` (from root `CONTEXT.md`) |
| Incident analysis | `services/api` — see [`archive/incidents-file-analyzer-plan/`](../../archive/incidents-file-analyzer-plan/) |

## Verify

```bash
npm run lint
```

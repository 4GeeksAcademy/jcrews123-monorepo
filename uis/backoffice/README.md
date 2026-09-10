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

For protected routes (`/`, `/incidents`, `/suppliers`, account pages), start the API first — see [`services/api/README.md`](../../services/api/README.md).

```bash
# Terminal 1 — API (port 8000)
cd services/api
pip install -r requirements.txt && pip install -e ../../packages/incident-analysis
cp .env.example .env
python seed.py
python -m uvicorn main:app --reload --port 8000

# Terminal 2 — Backoffice (port 3001)
cd uis/backoffice && npm run dev
```

Register at `/register` or sign in at `/login`. JWT is stored in `localStorage` and sent as `Authorization: Bearer` on API calls.

## Routes

| Path | Purpose |
| ---- | ------- |
| `/login` | Sign in |
| `/register` | Create account |
| `/forgot-password` | Request password reset email |
| `/reset-password?token=…` | Set new password from email link |
| `/` | Dashboard with KPIs, locations, and departments |
| `/incidents` | Upload incident CSV, view validation summary, export results |
| `/suppliers` | Supplier directory — filter, register, update rates and status |
| `/account/profile` | View and edit profile |
| `/account/change-password` | Change password while signed in |

## Environment

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:8000` | FastAPI base URL |

## Layout

Slate sidebar + white content area — intentionally distinct from the public amber marketing site in `uis/website/`. Auth pages (`/login`, `/register`, forgot/reset) use a minimal full-screen layout without the sidebar.

## Data sources

| Feature | Source |
|---------|--------|
| Dashboard KPIs | `@brasaland/operations` via `lib/operations-dashboard.ts` |
| Departments | `data/departments.ts` (from root `CONTEXT.md`) |
| Authentication | `services/api` — JWT in `localStorage` |
| Incident analysis | `services/api` — see [`archive/incidents-file-analyzer-plan/`](../../archive/incidents-file-analyzer-plan/) |
| Supplier directory | `services/api` — see [`archive/supplier-directory-plan/`](../../archive/supplier-directory-plan/) |
| Password reset | `services/api` + Resend — see [`archive/user-authentication-plan/`](../../archive/user-authentication-plan/) |

## Verify

```bash
npm run lint
```

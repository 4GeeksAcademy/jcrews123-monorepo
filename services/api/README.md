# Brasaland API (`services/api`)

FastAPI service for Brasaland Digital. Exposes:

- **Incident File Analyzer** (syllabus #27) — CSV analysis at `/api/incidents/*`
- **Supplier Directory** (syllabus #29) — TinyDB CRUD at `/suppliers`
- **Authentication** (syllabus #30–#32) — JWT users/profiles, protected routes, password reset
- **Inventory Management** (syllabus MS-5) — SQLModel + Supabase ingredients/orders at `/inventory`

**Archives:** [`archive/incidents-file-analyzer-plan/`](../../archive/incidents-file-analyzer-plan/) · [`archive/supplier-directory-plan/`](../../archive/supplier-directory-plan/) · [`archive/user-authentication-plan/`](../../archive/user-authentication-plan/) · [`archive/ms-5-plan/`](../../archive/ms-5-plan/)

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | Public | Health check |
| `POST` | `/users` | Public | Register user + profile |
| `POST` | `/auth/login` | Public | JWT login |
| `GET` | `/auth/me` | Bearer | Current user + profile |
| `POST` | `/auth/forgot-password` | Public | Request reset email |
| `POST` | `/auth/reset-password` | Public | Reset with one-time token |
| `POST` | `/auth/change-password` | Bearer | Change password while signed in |
| `GET` | `/users` | Bearer | List users |
| `GET` | `/users/{id}` | Bearer | User detail (self or admin) |
| `PUT` | `/users/{id}` | Bearer | Update credentials (self or admin) |
| `DELETE` | `/users/{id}` | Bearer | Delete user + profile |
| `GET` | `/profiles/me` | Bearer | Current profile |
| `PUT` | `/profiles/me` | Bearer | Update profile |
| `POST` | `/api/incidents/analyze` | Bearer | Upload incident CSV |
| `GET` | `/api/incidents/results/export` | Bearer | Download last analysis CSV |
| `POST` | `/suppliers` | Bearer | Register supplier |
| `GET` | `/suppliers` | Bearer | List suppliers (`?country=`, `?category=`) |
| `GET` | `/suppliers/{id}` | Bearer | Supplier detail |
| `PATCH` | `/suppliers/{id}/rate` | Bearer | Update rate + `updated_at` |
| `PATCH` | `/suppliers/{id}/status` | Bearer | Activate or suspend |
| `DELETE` | `/suppliers/{id}` | Bearer | Remove supplier |
| `GET` | `/inventory/products` | Bearer | List ingredients with computed `current_stock` |
| `POST` | `/inventory/products` | Bearer | Create ingredient |
| `GET` | `/inventory/products/{id}` | Bearer | Ingredient detail with stock |
| `POST` | `/inventory/orders/inbound` | Bearer | Register delivery (`IngredientEntry`) |
| `POST` | `/inventory/orders/outbound` | Bearer | Register consumption/waste exit |
| `GET` | `/inventory/orders` | Bearer | Order history with product names |

> Incident paths use `/api/incidents/*` for grading compatibility. Supplier and inventory paths use flat prefixes per syllabus.

## Environment

Copy `.env.example` to `.env` in this folder:

| Variable | Purpose |
|----------|---------|
| `SECRET_KEY` | JWT signing secret (required) |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | Session token lifetime |
| `RESET_TOKEN_EXPIRE_MINUTES` | Password reset token lifetime |
| `FRONTEND_RESET_URL` | Backoffice reset page base URL |
| `RESEND_API_KEY` | Resend API key for reset emails |
| `RESEND_FROM_EMAIL` | Verified sender address |
| `DATABASE_URL` | Supabase PostgreSQL connection string (Transaction pooler URI) |

**Dual database:** TinyDB (`users.json`) for auth; Supabase for inventory via SQLModel. Stock is computed from inbound minus outbound orders — never stored directly on ingredients.

**Resend dev note:** With `onboarding@resend.dev`, Resend only delivers to the email address verified on your Resend account. To test with another address, verify a domain at [resend.com/domains](https://resend.com/domains) and use a `from` address on that domain. If email delivery fails, the API logs a **local dev reset link** in the terminal.

## Setup

```bash
cd services/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
cp .env.example .env   # edit SECRET_KEY, RESEND_API_KEY, etc. — loaded automatically on startup
```

## Run

```bash
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
uv run seed
python -m uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs for Swagger UI. Register via `POST /users`, login via `POST /auth/login`, then use **Authorize** with the Bearer token.

## Tests

```bash
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
$env:SECRET_KEY="test-secret"   # PowerShell
python -m pytest tests
```

## Shared logic

Validation and metrics live in [`packages/incident-analysis/`](../../packages/incident-analysis/). The CLI (`scripts/analyze.py`) and this API import the same module — no duplicated business rules.

## CORS

Configured for backoffice dev server at `http://localhost:3001`.

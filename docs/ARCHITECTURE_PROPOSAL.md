# Backend Architecture Proposal — Brasaland Digital

_Document for Nicolás Park (CTO) · Brasaland Digital · 4Geeks Academy_

---

## 1. Executive Summary

This proposal defines how Brasaland Digital will structure its centralized backend under `services/api/` before implementation begins. The recommendation is a **layered, domain-oriented monolith** — one FastAPI application with routers grouped by business domain (locations, sales, inventory, suppliers, customers, HR, menus, telemetry). This pattern fits a small CTO-led team serving 14 locations across two countries: complexity comes from domain breadth and multi-market rules (CO/US, COP/USD), not from scale that would justify microservices. The first implementation slice will be the **inventory domain** (`/api/v1/inventory`), giving Felipe's operations team a single source of truth for ingredient stock. Frontends in `uis/` will communicate via REST, with explicit CORS and environment configuration per app.

---

## 2. Business Context and Backend Goals

Brasaland operates 14 company-owned restaurants in Colombia and Florida, employing ~115 people and generating ~$6M in annual revenue. Each department in `CONTEXT.md` drives distinct backend requirements:

| Department | Lead | Backend need |
|------------|------|--------------|
| Restaurant Operations | Felipe Guerrero | Real-time sales per location, ingredient stock, opening-hour alerts |
| Procurement | Lucía Fernández | Supplier records, price history, consolidated purchasing data |
| Marketing & Digital | Camila Ospina | Customer profiles, Brasa Points loyalty enrollment |
| People & Culture | Ashley Turner | HR records, onboarding workflows, turnover KPIs |
| Training & Quality | Jake Morrison | Recipe catalogue, versioned menu/training content |
| Technology | Nicolás Park | Central API, telemetry ingestion, data pipeline hooks |
| Executive | Mariana Restrepo | Cross-domain aggregates (chain-wide sales in USD and COP) |

**Backend goals for v1:**

1. Provide a **single API entry point** for all Brasaland Digital frontends and future agents.
2. Enforce **domain separation** so multi-country rules (country filters, currency display) live in one place.
3. Support **incremental delivery** — ship inventory first (Milestone 5), then sales, locations, and remaining domains.
4. Generate **OpenAPI contracts** so Next.js apps in `uis/` integrate predictably.
5. Leave extension points for later syllabus work: JWT auth, telemetry storage, Celery workers, RAG agents.

---

## 3. Architectural Pattern

### Chosen pattern: Layered, domain-oriented monolith

The backend follows four layers within one FastAPI process:

| Layer | Responsibility | Example |
|-------|----------------|---------|
| **API (routers)** | HTTP routing, request validation, response serialization | `api/v1/endpoints/inventory.py` |
| **Services** | Business rules, cross-entity logic | Stock validation before exit; country filtering |
| **Repositories** | Database queries, persistence | SQLModel queries for ingredients and orders |
| **Models / Schemas** | DB tables (SQLModel) and I/O contracts (Pydantic) | `Ingredient`, `IngredientEntry`, response DTOs |

Routers never contain business logic. Services never return HTTP responses. Repositories never enforce business rules.

### Why this pattern fits Brasaland

- **Team size:** Nicolás leads a small engineering unit. One deployable API reduces operational overhead compared to microservices or serverless functions per domain.
- **Cross-domain queries:** Mariana's executive dashboard needs sales, inventory, and location data in one view. A monolith allows service-layer composition without network calls between services.
- **Monorepo alignment:** The root `README.md` already recommends one centralized FastAPI app under `services/`, with workers extracted only when necessary.
- **Multi-market rules:** Country (`CO` / `US`) and currency (COP / USD) filtering belong in the service layer, not duplicated across eight router files.
- **Future milestones:** Auth (JWT), telemetry (`POST /telemetry/events`), Celery background jobs, and LangGraph agents all extend the same app rather than requiring new repositories.

### Alternatives considered and rejected

| Pattern | Why not for v1 |
|---------|----------------|
| **Microservices** | 14 locations and ~115 staff do not justify the deployment, monitoring, and cross-service query complexity. Premature split would slow Felipe's inventory launch. |
| **Serverless (Lambda/Cloud Functions)** | Cold starts and per-function deployment add friction for a team building continuous domain features. Long-running Celery workers (later milestone) also fit poorly. |
| **Flat single-file API** | Works for demos but breaks down once inventory, sales, HR, and telemetry coexist — the syllabus MS-5 inventory milestone uses a simpler flat layout as a starting point, but the target structure below scales with the full platform. |

---

## 4. Proposed Backend Structure

All backend code lives under `services/api/`. The MS-5 inventory milestone may begin with a flatter layout (`main.py`, `routers/inventory.py` at the `services/` root) and refactor into this target structure as domains accumulate.

```text
services/
└── api/
    ├── main.py                     # App factory, CORS middleware, router registration
    ├── core/
    │   ├── config.py               # Settings: DATABASE_URL, CORS_ORIGINS, API_V1_PREFIX
    │   ├── deps.py                 # get_db session, future auth dependencies
    │   └── logging.py              # Structured logging configuration
    ├── api/v1/
    │   ├── router.py               # Aggregates all domain routers under /api/v1
    │   └── endpoints/
    │       ├── locations.py
    │       ├── sales.py
    │       ├── inventory.py        # First implementation (Milestone 5)
    │       ├── suppliers.py
    │       ├── customers.py
    │       ├── hr.py
    │       ├── menus.py
    │       └── telemetry.py        # Stub until telemetry milestone
    ├── schemas/                    # Pydantic request/response per domain
    │   ├── inventory.py
    │   └── ...
    ├── services/                   # Business logic per domain
    │   ├── inventory.py            # Stock calculation, negative-stock rejection
    │   └── ...
    ├── repositories/               # DB access per domain
    │   ├── inventory.py
    │   └── ...
    └── models/                     # SQLModel table definitions
        ├── inventory.py            # Ingredient, IngredientEntry, IngredientExit
        └── ...
```

### Layer responsibilities

- **`core/config.py`** — Single source for environment-driven settings (database URL, allowed CORS origins, API prefix). Uses Pydantic Settings so local, staging, and production differ only by env vars.
- **`api/v1/endpoints/`** — One file per domain. Each file defines an `APIRouter` with a domain prefix (e.g. `/inventory`). Endpoints delegate to services and return schema objects.
- **`schemas/`** — Pydantic models for request bodies and response shapes. Keeps OpenAPI accurate and decouples API contracts from DB models.
- **`services/`** — Business rules. Example: `current_stock` is computed as `SUM(entries) − SUM(exits)` and never stored; exits that would cause negative stock are rejected before write.
- **`repositories/`** — SQLModel queries only. No HTTP concerns, no business validation.
- **`models/`** — SQLModel table definitions shared across repositories and services.

---

## 5. FastAPI Router Organization

All routes are versioned under **`/api/v1`**. Each domain gets its own router file and URL prefix.

| Domain | Prefix | Example routes | Primary consumer | Brasaland driver |
|--------|--------|-----------------|------------------|------------------|
| Locations | `/locations` | `GET /locations`, `GET /locations/{id}/summary` | Backoffice | 14 locations across CO and US |
| Sales | `/sales` | `GET /sales/daily`, `GET /sales/by-location` | Backoffice, Executive | Felipe and Mariana need real-time dashboards |
| Inventory | `/inventory` | `GET /inventory/products`, `POST /inventory/orders/inbound` | Backoffice | Ingredient stock truth (Milestone 5) |
| Suppliers | `/suppliers` | `GET /suppliers`, `GET /suppliers/{id}/price-history` | Backoffice | Lucía's consolidated purchasing |
| Customers | `/customers` | `POST /customers/enroll`, `GET /customers/{id}` | Website, future loyalty app | Brasa Points digital replacement |
| HR | `/hr` | `GET /hr/onboarding/{id}`, `POST /hr/absences` | Backoffice | Ashley — 115 staff, two labour markets |
| Menus | `/menus` | `GET /menus/recipes`, `GET /menus/recipes/{id}` | Backoffice | Jake — quality standards, recipe updates |
| Telemetry | `/telemetry` | `POST /telemetry/events` | All UIs | Nicolás — observability foundation |

### Inventory domain detail (Milestone 5 alignment)

The inventory router is the first domain implemented. It follows the Milestone 5 specification:

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/inventory/products` | List ingredients with computed `current_stock` |
| `POST` | `/inventory/products` | Create a new ingredient |
| `GET` | `/inventory/products/{id}` | Get one ingredient with current stock |
| `POST` | `/inventory/orders/inbound` | Log a supplier delivery (`IngredientEntry`) |
| `POST` | `/inventory/orders/outbound` | Log consumption or waste (`IngredientExit`) |
| `GET` | `/inventory/orders` | List all entries and exits with ingredient data |

Business rules enforced in `services/inventory.py`:

1. **`current_stock` is computed, never stored** — net of all entries minus all exits.
2. **Negative stock is rejected** — outbound orders return HTTP 400 before write if quantity exceeds available stock.
3. **Country field (`CO` / `US`)** on ingredients enables market filtering without separate tables.
4. **Locations are numeric IDs 1–14** — stored as integers, not foreign keys in the first milestone.

### Public vs protected endpoints

| Access | Routes | Notes |
|--------|--------|-------|
| **Public (no auth)** | `POST /customers/enroll`, `GET /menus/recipes` (read-only catalogue) | Website loyalty signup; auth added later |
| **Protected (JWT)** | All backoffice routes: `/sales`, `/inventory`, `/suppliers`, `/hr`, `/locations` | JWT auth deferred to syllabus auth milestones; router structure reserves `core/deps.py` for `get_current_user` |

### Request flow

```
Client (uis/backoffice)
  → HTTP request to /api/v1/inventory/products
  → api/v1/endpoints/inventory.py  (validate input via Pydantic schema)
  → services/inventory.py          (compute stock, apply business rules)
  → repositories/inventory.py      (SQLModel query)
  → Response serialized via Pydantic schema
```

---

## 6. FastAPI Conventions Applied

This structure follows established FastAPI practices, cited explicitly:

1. **[Bigger Applications — Multiple Files](https://fastapi.tiangolo.com/tutorial/bigger-applications/)** — Domain routers live in separate files under `api/v1/endpoints/`. `main.py` uses `app.include_router()` to register each router with a shared `/api/v1` prefix. This avoids a single monolithic routes file and matches FastAPI's recommended scaling pattern.

2. **[Dependencies](https://fastapi.tiangolo.com/tutorial/dependencies/)** — Shared concerns (database session, future authentication) are injected via `core/deps.py` using FastAPI's `Depends()`. Endpoints declare `db: Session = Depends(get_db)` rather than opening connections inline.

3. **[Pydantic Settings](https://docs.pydantic.dev/latest/concepts/pydantic_settings/)** — Environment-specific configuration (database URL, CORS origins, API prefix) is centralized in `core/config.py` using `BaseSettings`. This prevents hardcoded values and supports `.env` files per environment.

4. **Separation of concerns** — Routers handle HTTP only. Pydantic schemas define I/O contracts. Services contain business rules. Repositories handle persistence. This mirrors the layered architecture described in FastAPI community guides and keeps each layer independently testable.

---

## 7. Frontend-Backend Coexistence

### Monorepo layout (chosen model)

Brasaland Digital uses a **monorepo**: Next.js frontends in `uis/`, the FastAPI backend in `services/api/`, shared types eventually in `packages/shared`, and data pipelines in `data/`. This is already the repo structure from Milestone 4.

```
uis/website          (port 8080)  ──┐
uis/backoffice       (port 3001)  ──┼── REST / HTTPS ──→  services/api/  (port 8000)
uis/talent-pipeline  (port 3000)  ──┘                              │
                                                                   ↓
                                                          Supabase / Postgres
                                                          data/ (pipelines)
```

### API communication

- **Protocol:** REST over HTTP/HTTPS. FastAPI auto-generates OpenAPI docs at `/docs`.
- **Contract-first:** Frontends consume typed API responses. Shared TypeScript interfaces can be generated from OpenAPI and placed in `packages/shared` when multiple UIs need the same types.
- **Versioning:** All routes under `/api/v1`. Breaking changes require a new version prefix, not silent modifications.

### Environment variables

| Variable | Where | Purpose |
|----------|-------|---------|
| `NEXT_PUBLIC_API_URL` | Each UI app (`.env.local`) | Base URL for API calls, e.g. `http://localhost:8000` |
| `DATABASE_URL` | `services/api/.env` | Supabase/Postgres connection string |
| `CORS_ORIGINS` | `services/api/.env` | Comma-separated allowed origins: `http://localhost:8080,http://localhost:3001,http://localhost:3000` |
| `API_V1_PREFIX` | `services/api/.env` | Default `/api/v1` |

A root `.env.example` documents all variables. Each app may override locally via `.env.local` (gitignored).

### CORS policy

The API enables CORS middleware in `main.py`, reading allowed origins from `core/config.py`. In development, all three UI ports are permitted. In production, origins are restricted to deployed frontend URLs only.

### Migration from current state

Today, `uis/backoffice` imports `@brasaland/operations` (Milestone 2 TypeScript utilities) for dashboard metrics. As backend domains come online:

1. **Inventory (Milestone 5)** — Backoffice inventory views call `/api/v1/inventory/*` instead of local mock data.
2. **Sales** — Dashboard revenue and rankings migrate from `@brasaland/operations` computed output to `/api/v1/sales/*`.
3. **Locations** — The backoffice Locations nav stub (currently a placeholder) connects to `/api/v1/locations/*`.

`uis/talent-pipeline-tracker` continues using the external playground API for Milestone 3 scope. Future internalization under `/api/v1/hr` is optional and documented here for completeness.

---

## 8. Risks and Attention Points

| Risk | What goes wrong | Mitigation |
|------|----------------|------------|
| **Business logic in routers** | Stock validation, country filtering, or negative-stock checks written directly in endpoint handlers. Hard to test, duplicated across routes. | All business rules live in `services/`. Routers call one service function and return the result. MS-5 negative-stock rule is enforced in `services/inventory.py`, not in the POST handler. |
| **Domain boundary blur** | Sales endpoints embed inventory SQL queries, or supplier data leaks into customer routes. Coupling makes changes risky. | One router file per domain. Cross-domain reads go through explicit service calls (e.g. sales service calls inventory service for stock levels), never through shared SQL in unrelated repositories. |
| **Multi-market complexity handled ad hoc** | Country and currency logic scattered across endpoints — some filter by `CO`, others hardcode USD. Inconsistent reports for Mariana. | `country` and currency are first-class fields on relevant models. Filtering rules centralized in services. API responses include the market context explicitly. |
| **Environment and config drift** | Frontends point to wrong API URL; CORS blocks requests after port changes; database credentials committed to git. | Root `.env.example` documents all variables. CORS origins match dev ports in `memory-bank/techContext.md`. Secrets stay in gitignored `.env.local` files. |
| **Premature microservice split** | Team extracts inventory, sales, and HR into separate deployable services before cross-domain features (executive dashboard) are needed. Operational overhead exceeds team capacity. | Keep one FastAPI app until a workload truly requires a separate process (e.g. Celery worker for background jobs in the message-queue milestone). Document the extraction criteria: sustained independent scaling need or failure isolation requirement. |

---

## 9. Initial Technical Decisions and Next Steps

### Decisions locked for v1

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Framework | FastAPI + SQLModel + Pydantic | Course standard; auto-generates OpenAPI; type-safe ORM |
| Database | Supabase (Postgres) | Managed Postgres; aligns with later milestones |
| API versioning | `/api/v1` prefix on all routes | Safe evolution without breaking existing clients |
| Auth | Deferred | JWT auth added in syllabus auth milestones; router structure prepared via `core/deps.py` |
| Deployment port | 8000 (API), existing UI ports unchanged | Matches FastAPI convention; no conflict with uis/ ports |

### Implementation sequence

1. **Milestone 5 — Inventory API** — Implement `/api/v1/inventory` with Ingredient, IngredientEntry, IngredientExit models. Seed data per Milestone 5 spec. Wire backoffice inventory views.
2. **Sales and Locations** — Replace `@brasaland/operations` dashboard data with `/api/v1/sales` and `/api/v1/locations`. Enable Felipe's real-time visibility and Mariana's executive aggregates.
3. **Suppliers and Customers** — Lucía's supplier platform and Camila's Brasa Points digital enrollment.
4. **HR and Menus** — Ashley's onboarding portal and Jake's recipe catalogue.
5. **Telemetry** — `POST /telemetry/events` stub, then full storage pipeline per syllabus telemetry milestones.
6. **Auth** — JWT protection on backoffice routes per syllabus auth projects.
7. **Background workers** — Extract Celery consumer only when message-queue milestone requires it.

### What this document does not cover

- Docker/container orchestration (future containerization milestone)
- AI agents, RAG, or LangGraph workflows (Milestones 7–9)
- Real-time SSE/WebSocket systems (Milestone 10)

Those layers build on top of this API foundation and are out of scope for this proposal.

---

_Prepared by Brasaland Digital · Syllabus project: Backend Architecture Proposal_

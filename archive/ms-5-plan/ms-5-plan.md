# MS-5 Plan — Inventory Management (Backend + Backoffice)

**Status:** implemented  
**Syllabus:** [#38 Backend](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-milestone-backend-development) · [#39 Backoffice](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-inventory-management-backoffice)  
**Context:** [`ms-5-CONTEXT.md`](./ms-5-CONTEXT.md) (from [CONTEXT-brasaland.en.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/05-backend-development/CONTEXT-brasaland.en.md))

## Locked decisions

- Extend [`services/api/`](../services/api/) — dual DB: TinyDB auth + Supabase SQLModel inventory
- API prefix `/inventory/*` (matches syllabus grading)
- Backoffice routes at `/inventory/*` under `(dashboard)` (not `/backoffice/...`)
- Global stock per ingredient; `location_id` stored but not used in stock math
- `user_uuid` string on orders; JWT still uses integer `sub`

## Deliverables

| Area | Path |
|------|------|
| Postgres engine | `services/api/db/postgres.py` |
| ORM models | `services/api/models/inventory.py` |
| Pydantic schemas | `services/api/schemas/inventory.py` |
| Business logic | `services/api/services/inventory.py` |
| Router | `services/api/routers/inventory.py` |
| Seed | `services/api/inventory_seed.py` |
| Tests | `services/api/tests/test_inventory_api.py` (8 cases) |
| API client | `uis/backoffice/lib/inventory-api.ts` |
| UI | `uis/backoffice/app/(dashboard)/inventory/*` |

## Backend evaluation checklist

- [x] TinyDB auth + Supabase SQLModel both active
- [x] `/inventory` router with six endpoints
- [x] FK relationships on entries/exits → ingredients
- [x] `current_stock` computed, not stored
- [x] Outbound over-stock → HTTP 400 with exact CONTEXT message
- [x] Orders store authenticated `user_uuid`
- [x] Separate ORM vs Pydantic files
- [x] Per-request `get_db` session
- [x] `DATABASE_URL` in `.env.example`; `.env` gitignored
- [x] Seed data + net stock (beef = 40)

## Backoffice evaluation checklist

- [x] Central `inventory-api.ts` module (no raw fetch in components)
- [x] Bearer token via existing `apiFetch`
- [x] Products page with stock indicators
- [x] Inbound form with confirmation/errors
- [x] Outbound reactive stock + client warning + API 400 display
- [x] Order history read-only with inbound/outbound distinction
- [x] Auth guard via `(dashboard)` layout

## Edge cases implemented

- Quantity `> 0`, unique SKU, Decimal/Numeric quantities
- Transaction + row lock on outbound (PostgreSQL)
- Idempotent seed, UUID backfill for legacy users
- Disable submit while saving; empty states

# Progress — Brasaland Digital Monorepo

_Last updated: Company monorepo containerization implemented_

## Completed

| Milestone | Deliverable | Location |
|-----------|-------------|----------|
| MS-1 | Public corporate website + Brasa Points form | `uis/website/` |
| MS-2 | TypeScript operations utilities | `apps/operations/` |
| MS-3 | Talent Pipeline Tracker (Next.js) | `uis/talent-pipeline-tracker/` |
| — | MS-1/2/3 merged to `main` via PR #1 | — |

## In progress (MS-4 audit remediation)

- [x] Syllabus reference layer (`memory-bank/syllabusReference.md`, syllabus-first rule)
- [x] Wire backoffice to `apps/operations` (M2 computed output)
- [x] Migrate `uis/website` to Next.js + TypeScript
- [ ] PR #2 updated with description and screenshots

## Completed (MS-4 initial)

- [x] `memory-bank/`, `AGENTS.md`, `.agents/`
- [x] `uis/backoffice/` shell
- [x] `archive/ms-4-plan/`

## Completed (agent rules consolidation)

- [x] `.cursor/rules/` — `monorepo-structure` (`alwaysApply`), `uis-isolation` (`uis/**` globs)
- [x] Removed duplicate `archive-milestone` / `progress-sync` from `.cursor/rules/` (canonical in `.agents/rules/`)
- [x] `AGENTS.md` Rules section documents split between auto-loaded and agent-requested rules

## Completed (Backend Architecture Proposal)

- [x] `docs/ARCHITECTURE_PROPOSAL.md` — layered domain monolith, FastAPI router map, FE/BE separation, risks

## Completed (Company Incident File Analyzer)

- [x] `packages/incident-analysis/` — shared Brasaland CSV validation, metrics, console report, CSV export
- [x] `scripts/analyze.py` + `scripts/incidents-brasaland.csv` — Phase 1 CLI (verified counts vs syllabus CONTEXT: 100/96/4, avg satisfaction 3.46)
- [x] `services/api/` — FastAPI `POST /api/incidents/analyze`, `GET /api/incidents/results/export`, CORS for backoffice
- [x] `uis/backoffice/app/incidents/` — upload UI, summary metrics, invalid-record alerts, CSV download
- [x] `archive/incidents-file-analyzer-plan/` — plan, CONTEXT copy, `plan.json` (`status: implemented`)
- [x] Folder READMEs updated: `scripts/`, `services/`, `packages/`, `uis/backoffice/`
- [x] Regression tests pushed: `packages/incident-analysis/tests/` (6) + `services/api/tests/` (4)
- [x] Commit `e04646c` pushed to `company-incident-file-analyzer` — package, CLI, fixture, archive, tests
- [x] Fresh-clone verification: 10/10 tests pass, uvicorn starts, CLI matches CONTEXT (100/96/4, avg 3.46)
- [ ] PR description updated with CLI + backoffice screenshots (see `archive/incidents-file-analyzer-plan/PR_TEST_PLAN.md`)

## In progress (Supplier Directory — syllabus #29)

- [x] `services/api/` — TinyDB supplier CRUD at `/suppliers`, Pydantic validation, idempotent `seed.py`
- [x] `uis/backoffice/app/suppliers/` — directory table, filters, create form, rate/status controls
- [x] `archive/supplier-directory-plan/` — plan, CONTEXT copy, `plan.json`, tests
- [ ] PR screenshots attached (see `archive/supplier-directory-plan/PR_TEST_PLAN.md`)

## Completed (User Authentication trilogy — syllabus #30–#32)

- [x] **Phase 1 (AUTH-01):** JWT auth in `services/api/` — users/profiles TinyDB, `/auth`, `/users`, `/profiles`, `get_current_user`, all supplier + incident routes protected
- [x] **Phase 2 (AUTH-02):** Backoffice login/register/profile, client route guard, shared API client with Bearer + 401 handling
- [x] **Phase 3 (AUTH-03):** Forgot/reset/change password API + Resend integration, backoffice `/forgot-password`, `/reset-password`, `/account/change-password`
- [x] `archive/user-authentication-plan/` — plan and verification notes
- [x] API tests: 29 passing (`services/api/tests/`)
- [x] Backoffice lint passing

## Completed (Milestone 5 — Inventory Management)

- [x] **Part 1 (Backend):** SQLModel + Supabase inventory at `/inventory` — `Ingredient`, `IngredientEntry`, `IngredientExit`, dual DB with TinyDB auth, UUID on orders, seed data
- [x] **Part 2 (Backoffice):** Four authenticated inventory views under `/inventory/*`, centralized `inventory-api.ts`, stock indicators, inbound/outbound forms, order history
- [x] `archive/ms-5-plan/` — plan, CONTEXT copy, `plan.json`
- [x] API tests: 37 passing (8 inventory cases)
- [x] Backoffice lint passing

## Completed (Company Monorepo Containerization — syllabus #41)

- [x] One `uis` development container runs website `:3000` and backoffice
  `:3001` with bind mounts and polling.
- [x] One `services` container runs FastAPI `:8000` with `uv` and Uvicorn
  reload.
- [x] Root Compose orchestration, named `brasaland-dev` network, ignored root
  environment contract, and Docker build exclusions.
- [x] Browser-safe `/backend` proxy forwards through Docker DNS to
  `http://services:8000`.
- [x] Cross-monorepo build contexts include `apps/operations` and
  `packages/incident-analysis`.
- [x] [`archive/containerization-plan/`](../archive/containerization-plan/) —
  plan, assignment context, verification record, and Docker teaching TLDR.
- [x] Static YAML validation, API tests (37), backoffice lint, website build,
  and local API proxy smoke test passed.
- [x] Docker build, two-container startup, HTTP checks, service-name proxy, and
  API/UI bind-mount hot reload verified from a non-OneDrive working copy.
- [x] Containerization audit aligned primary build contexts with `uis/` and
  `services/`, added lockfile-aware dependency-volume sync, and restored the
  incident fixture for all 37 API tests.
- [x] Next.js upgraded from 16.2.10 to 16.3.4 in both UIs to resolve the
  production dependency audit findings.
- [ ] Capture the final `docker compose ps` screenshot with the real ignored
  Supabase environment values.

## Next (future milestones)

- MS-5: Inventory API under `services/api/` (`/inventory`) — **done**; see `archive/ms-5-plan/`
- Real-time telemetry and data pipelines under `data/`
- Product agents under `agents/`
- Workflows and automations under `workflows/`

## Known gaps

- Attach CLI + backoffice screenshots to the incident analyzer PR before re-grade (template: `archive/incidents-file-analyzer-plan/PR_TEST_PLAN.md`)
- Root `README.md` still mentions template placeholder status — update after MS-4 merge
- OneDrive Files On-Demand paths expose source files as reparse points that
  Docker BuildKit rejects; use `C:\dev\jcrews123-monorepo-3` for Docker work
- Final `docker compose ps` PR screenshot with real Supabase values remains
  pending
- Backoffice hash links (`#locations`, `#departments`) on dashboard only — no separate routes yet
- Python runtime required locally for `scripts/analyze.py` and `services/api/` (`pip install -r services/api/requirements.txt` + editable `packages/incident-analysis`)

## Reference docs

- Backend architecture proposal: `docs/ARCHITECTURE_PROPOSAL.md`
- Incident File Analyzer plan: `archive/incidents-file-analyzer-plan/incidents-file-analyzer-plan.md`
- Supplier Directory plan: `archive/supplier-directory-plan/supplier-directory-plan.md`
- Incident File Analyzer CONTEXT (Brasaland): `archive/incidents-file-analyzer-plan/incidents-file-analyzer-CONTEXT.md`
- MS-4 plan: `archive/ms-4-plan/ms-4-plan.md`
- MS-3 assignment: `archive/ms-3-plan/ms-3-CONTEXT.md`
- MS-1 plan: `archive/ms-1-plan/ms-1-plan.md`

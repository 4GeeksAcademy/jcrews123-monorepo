# Progress — Brasaland Digital Monorepo

_Last updated: Supplier Directory implementation — FastAPI + TinyDB + backoffice UI_

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

## Next (future milestones)

- MS-5: Inventory API under `services/api/` (`/api/v1/inventory`)
- Real-time telemetry and data pipelines under `data/`
- Product agents under `agents/`
- Workflows and automations under `workflows/`

## Known gaps

- Attach CLI + backoffice screenshots to the incident analyzer PR before re-grade (template: `archive/incidents-file-analyzer-plan/PR_TEST_PLAN.md`)
- Root `README.md` still mentions template placeholder status — update after MS-4 merge
- No `docker-compose.yml` orchestration yet
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

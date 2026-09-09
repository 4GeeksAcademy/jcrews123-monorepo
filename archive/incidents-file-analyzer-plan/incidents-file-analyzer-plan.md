# Company Incident File Analyzer — Brasaland

**Syllabus project #27** (not an MS-N milestone). Grading spec remains the syllabus README; this archive is implementation history per [`.agents/rules/archive-milestone.md`](../../.agents/rules/archive-milestone.md).

## Source documents

| Document | Link |
|----------|------|
| Project README | [ai-eng-company-incidents-file-analyzer](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-company-incidents-file-analyzer/README.md) |
| Brasaland CONTEXT (canonical) | [CONTEXT-brasaland.en.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/incidents-file-analysis/CONTEXT-brasaland.en.md) |
| Local CONTEXT copy | [incidents-file-analyzer-CONTEXT.md](./incidents-file-analyzer-CONTEXT.md) |
| Solution guide | [.learn/solution/README.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-company-incidents-file-analyzer/.learn/solution/README.md) |
| Company briefing | [CONTEXT.md](../../CONTEXT.md) |

## Decisions locked

- **Company:** Brasaland — field names, categories, statuses, and expected numeric outputs from syllabus CONTEXT
- **Shared logic:** Python package `packages/incident-analysis/` (existing `packages/shared/` stays TypeScript-only)
- **Phase 1:** `scripts/analyze.py` + `scripts/incidents-brasaland.csv`; stdlib `csv` (no pandas)
- **Phase 2 API:** FastAPI under `services/api/`; syllabus paths `/api/incidents/*` (not `/api/v1/*`)
- **Phase 2 UI:** `uis/backoffice/app/incidents/`; requires API at port **8000**
- **Last-result store:** in-memory in `services/api/state.py` (no DB for this project)

## Scope / deliverables

| Phase | Deliverable | Path |
|-------|-------------|------|
| Shared | Validation, metrics, report, export | `packages/incident-analysis/` |
| 1 | CLI analyzer | `scripts/analyze.py` |
| 1 | Test CSV | `scripts/incidents-brasaland.csv` |
| 2 | FastAPI service | `services/api/` |
| 2 | Backoffice upload + summary | `uis/backoffice/app/incidents/` |
| 2 | API client | `uis/backoffice/lib/incidents-api.ts` |
| Docs | Archive plan | `archive/incidents-file-analyzer-plan/` |

## Verification gate (Phase 1)

CLI output against `incidents-brasaland.csv` must match CONTEXT exactly:

- Total 100 · Valid 96 · Invalid 4
- Category counts: 29 / 17 / 22 / 19 / 9
- Status counts: 32 / 50 / 14
- Average satisfaction: **3.46**

## Evaluation checklist

### Script

- [x] Accepts CSV path as CLI argument
- [x] Detects, classifies, and shows invalid records by rule type
- [x] Five required metric groups in console output
- [x] CSV export prompt (`y` / `n`) writes `results.csv`
- [x] Results match CONTEXT expected values

### Backend

- [x] `POST /api/incidents/analyze` accepts CSV, returns JSON summary
- [x] `GET /api/incidents/results/export` returns downloadable CSV
- [x] Input errors return appropriate HTTP status + message

### Frontend

- [x] Upload from browser (drag-drop + file picker)
- [x] Summary on screen: totals, categories, status, satisfaction
- [x] Export button downloads CSV
- [x] Invalid record counts communicated to user

### Cross-cutting

- [x] Same analysis logic in CLI and API via `packages/incident-analysis/`
- [x] Monorepo folder layout per syllabus submission section

### Tests

- [x] `packages/incident-analysis/tests/test_brasaland_regression.py` — syllabus CONTEXT expected values
- [x] `services/api/tests/test_incidents_api.py` — analyze + export endpoints

Run from repo root:

```bash
pip install -e "packages/incident-analysis[dev]"
python -m pytest packages/incident-analysis/tests

cd services/api
pip install -r requirements.txt && pip install -e ../../packages/incident-analysis
python -m pytest tests
```

### PR artifacts (manual)

- [ ] Screenshot: CLI console output (`python scripts/analyze.py scripts/incidents-brasaland.csv`) — expected output in [`screenshots/cli-output.txt`](screenshots/cli-output.txt)
- [ ] Screenshot: backoffice with loaded analysis (`http://localhost:3001/incidents`) — paste PR body from [`PR_TEST_PLAN.md`](PR_TEST_PLAN.md)

## Run commands

```bash
# Phase 1
python scripts/analyze.py scripts/incidents-brasaland.csv

# Phase 2 — API
cd services/api && pip install -r requirements.txt && pip install -e ../../packages/incident-analysis
uvicorn main:app --reload --port 8000

# Phase 2 — Backoffice
cd uis/backoffice && npm run dev
# Open http://localhost:3001/incidents
```

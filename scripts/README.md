# `scripts` folder

Helper scripts for the monorepo: development automation, maintenance utilities, and internal tooling.

- **Purpose:** Tools that do not belong to a specific app, agent, or pipeline.
- **Convention:** Document each script below (what it does, parameters, requirements, examples).

## Scripts

### `analyze.py` — Incident CSV analyzer (Phase 1)

Brasaland syllabus project **Company Incident File Analyzer**. Validates and summarizes operational incident CSV exports using rules from [`archive/incidents-file-analyzer-plan/incidents-file-analyzer-CONTEXT.md`](../archive/incidents-file-analyzer-plan/incidents-file-analyzer-CONTEXT.md).

| Item | Detail |
|------|--------|
| **Requirements** | Python 3.10+; shared package at `packages/incident-analysis/` (on `PYTHONPATH` via script bootstrap or `pip install -e packages/incident-analysis`) |
| **Usage** | `python scripts/analyze.py <path-to-csv>` |
| **Example** | `python scripts/analyze.py scripts/incidents-brasaland.csv` |
| **Output** | Formatted console summary; optional `results.csv` when prompted |
| **Test file** | `scripts/incidents-brasaland.csv` — 100-row syllabus sample; metrics must match CONTEXT exactly |

Phase 2 uses the same logic via `services/api/` and `uis/backoffice/app/incidents/`. See [`archive/incidents-file-analyzer-plan/`](../archive/incidents-file-analyzer-plan/).

> _Spanish version: [README.es.md](./README.es.md)._

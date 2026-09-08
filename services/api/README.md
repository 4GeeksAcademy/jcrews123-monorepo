# Brasaland API (`services/api`)

First FastAPI service in the monorepo. Currently exposes incident CSV analysis endpoints for the **Company Incident File Analyzer** syllabus project.

**Project archive:** [`archive/incidents-file-analyzer-plan/`](../../archive/incidents-file-analyzer-plan/) — plan, Brasaland CONTEXT, evaluation checklist, `plan.json`.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/incidents/analyze` | Upload CSV (`multipart/form-data`, field `file`) |
| `GET` | `/api/incidents/results/export` | Download last analysis as CSV |

> Syllabus paths use `/api/incidents/*` (not `/api/v1/*`) for grading compatibility.

## Setup

```bash
cd services/api
python -m venv .venv
# Windows: .venv\Scripts\activate
# macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
```

## Run

```bash
uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs for Swagger UI.

## Shared logic

Validation and metrics live in [`packages/incident-analysis/`](../../packages/incident-analysis/). The CLI (`scripts/analyze.py`) and this API import the same module — no duplicated business rules.

## CORS

Configured for backoffice dev server at `http://localhost:3001`.

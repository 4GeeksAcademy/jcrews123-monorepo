# Brasaland API (`services/api`)

FastAPI service for Brasaland Digital. Exposes:

- **Incident File Analyzer** (syllabus #27) — CSV analysis at `/api/incidents/*`
- **Supplier Directory** (syllabus #29) — TinyDB CRUD at `/suppliers`

**Archives:** [`archive/incidents-file-analyzer-plan/`](../../archive/incidents-file-analyzer-plan/) · [`archive/supplier-directory-plan/`](../../archive/supplier-directory-plan/)

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `POST` | `/api/incidents/analyze` | Upload incident CSV |
| `GET` | `/api/incidents/results/export` | Download last incident analysis CSV |
| `POST` | `/suppliers` | Register supplier |
| `GET` | `/suppliers` | List suppliers (`?country=`, `?category=`) |
| `GET` | `/suppliers/{id}` | Supplier detail |
| `PATCH` | `/suppliers/{id}/rate` | Update rate + `updated_at` |
| `PATCH` | `/suppliers/{id}/status` | Activate or suspend |
| `DELETE` | `/suppliers/{id}` | Remove supplier |

> Incident paths use `/api/incidents/*` for grading compatibility. Supplier paths use `/suppliers` per syllabus #29.

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
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
uv run seed
python -m uvicorn main:app --reload --port 8000
```

Open http://localhost:8000/docs for Swagger UI.

## Tests

```bash
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
python -m pytest tests
```

## Shared logic

Validation and metrics live in [`packages/incident-analysis/`](../../packages/incident-analysis/). The CLI (`scripts/analyze.py`) and this API import the same module — no duplicated business rules.

## CORS

Configured for backoffice dev server at `http://localhost:3001`.

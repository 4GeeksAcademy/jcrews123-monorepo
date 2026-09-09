# Supplier Directory — Brasaland

**Syllabus project #29** — Lightweight Storage API. Grading spec: [ai-eng-supplier-directory README](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-supplier-directory/README.md).

## Source documents

| Document | Link |
|----------|------|
| Project README | [ai-eng-supplier-directory](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-supplier-directory/README.md) |
| Brasaland CONTEXT (canonical) | [CONTEXT-brasaland.en.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/supplier-directory/CONTEXT-brasaland.en.md) |
| Local CONTEXT copy | [supplier-directory-CONTEXT.md](./supplier-directory-CONTEXT.md) |
| Solution guide | [.learn/solution/README.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/ai-eng-supplier-directory/.learn/solution/README.md) |

## Decisions locked

- **Stack:** FastAPI + TinyDB + Pydantic in [`services/api/`](../../services/api/)
- **Endpoints:** syllabus paths `/suppliers` (not `/api/v1/suppliers`)
- **Router layout:** [`routers/suppliers.py`](../../services/api/routers/suppliers.py) (matches incident analyzer pattern)
- **Seeder:** [`seed.py`](../../services/api/seed.py) — `uv run seed` or `python seed.py`; 15 suppliers from CONTEXT
- **UI:** [`uis/backoffice/app/suppliers/`](../../uis/backoffice/app/suppliers/) on port **3001**
- **Persistence:** TinyDB file at `services/api/data/suppliers.json` (gitignored)

## Deliverables

| Area | Path |
|------|------|
| Constants + seed data | `services/api/supplier_constants.py` |
| Pydantic schemas | `services/api/schemas/suppliers.py` |
| TinyDB layer | `services/api/database.py` |
| API routes | `services/api/routers/suppliers.py` |
| Seeder | `services/api/seed.py` |
| Tests | `services/api/tests/test_suppliers_api.py` |
| Backoffice page | `uis/backoffice/app/suppliers/` |
| API client | `uis/backoffice/lib/suppliers-api.ts` |
| Archive | `archive/supplier-directory-plan/` |

## Evaluation checklist

### Model and validation

- [x] Pydantic model matches Brasaland CONTEXT fields
- [x] Status enum rejects invalid values with 422
- [x] Rate must be strictly positive
- [x] Country/currency cross-validation (Colombia→COP, USA→USD)
- [x] `updated_at` server-generated

### Seeder

- [x] Loads 15 CONTEXT suppliers
- [x] Idempotent (no duplicates on re-run)
- [x] Prints inserted count

### Endpoints

- [x] `POST /suppliers`
- [x] `GET /suppliers` with optional country/category filters
- [x] `GET /suppliers/{id}`
- [x] `PATCH /suppliers/{id}/rate` with timestamp
- [x] `PATCH /suppliers/{id}/status`
- [x] `DELETE /suppliers/{id}`

### Frontend

- [x] Supplier list from API
- [x] Country and category filters
- [x] Create form with API error display
- [x] Rate update and status toggle
- [x] Active vs suspended visual distinction

### PR artifacts (manual)

- [ ] Screenshot: `uv run seed` output
- [ ] Screenshot: filtered GET in Swagger/HTTP client
- [ ] Screenshot: backoffice list with filter applied

## Run commands

```bash
cd services/api
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
uv run seed   # or: python seed.py
python -m uvicorn main:app --reload --port 8000

cd uis/backoffice && npm run dev
# Open http://localhost:3001/suppliers
```

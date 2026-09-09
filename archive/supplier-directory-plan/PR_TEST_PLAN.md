# Paste into GitHub PR description

## Summary

- Adds Brasaland supplier directory API (FastAPI + TinyDB + Pydantic) at `/suppliers`
- Idempotent seeder with 15 CONTEXT suppliers (`uv run seed`)
- Backoffice `/suppliers` page: filters, create form, rate updates, status toggles

## Test plan

- [x] `cd services/api && python -m pytest tests` — all tests pass
- [x] `uv run seed` (or `python seed.py`) — inserts 15 on first run, 0 on second
- [x] `GET /suppliers?country=Colombia` and `?category=carne` return filtered lists
- [ ] **Screenshot:** seed terminal output (attach below)
- [ ] **Screenshot:** Swagger filter response (attach below)
- [ ] **Screenshot:** backoffice with filter applied (attach below)

### Commands

```powershell
cd services/api
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
python seed.py
python -m uvicorn main:app --reload --port 8000

cd uis/backoffice
npm run dev
# http://localhost:3001/suppliers
```

## Screenshots

<!-- Attach three images before requesting grade -->

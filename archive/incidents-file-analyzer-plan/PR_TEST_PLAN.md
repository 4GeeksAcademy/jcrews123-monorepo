# Paste into GitHub PR description

## Summary

- Adds missing Phase 1 deliverables: `packages/incident-analysis/`, `scripts/analyze.py`, `scripts/incidents-brasaland.csv`
- Adds regression tests (6 package + 4 API) and archive plan docs
- Fixes fresh-clone failure: API and CLI now import shared `incident_analysis` from the repo

## Test plan

- [x] Fresh clone: `pip install -e ../../packages/incident-analysis` + `python -m uvicorn main:app` starts without global package
- [x] `python -m pytest` — 10/10 tests pass
- [x] CLI on `scripts/incidents-brasaland.csv` — 100 total, 96 valid, 4 invalid, avg satisfaction 3.46
- [ ] **Screenshot:** CLI full console output (attach below)
- [ ] **Screenshot:** Backoffice `/incidents` with CSV loaded (attach below)

### CLI verification

```powershell
python scripts/analyze.py scripts/incidents-brasaland.csv
```

See [`archive/incidents-file-analyzer-plan/screenshots/cli-output.txt`](archive/incidents-file-analyzer-plan/screenshots/cli-output.txt) for expected output.

### Web UI verification

1. Start API on port 8000 and backoffice on port 3001
2. Open http://localhost:3001/incidents
3. Upload `scripts/incidents-brasaland.csv`
4. Confirm KPI cards, invalid breakdown, category/status tables, and satisfaction distribution

## Screenshots

<!-- Attach two images here before requesting re-grade:
1. CLI terminal output
2. Backoffice incidents page with analysis loaded
-->

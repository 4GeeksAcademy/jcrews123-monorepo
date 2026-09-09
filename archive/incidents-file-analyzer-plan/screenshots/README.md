# PR verification artifacts

Syllabus grading requires **two screenshots attached to the PR description** (not just files in the repo). Use these artifacts to confirm output before capturing screenshots.

## CLI screenshot

Run from repo root:

```powershell
python scripts/analyze.py scripts/incidents-brasaland.csv
```

Type `n` at the export prompt unless you also want to show CSV export.

Expected headline numbers (see [`cli-output.txt`](./cli-output.txt)):

- Total records: **100**
- Valid: **96** · Invalid: **4**
- Average satisfaction: **3.46**

Capture a screenshot of the **full terminal output** and attach it to the PR.

## Web UI screenshot

```powershell
# Terminal 1
cd services/api
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
python -m uvicorn main:app --reload --port 8000

# Terminal 2
cd uis/backoffice
npm run dev
```

Open http://localhost:3001/incidents, upload `scripts/incidents-brasaland.csv`, and screenshot the loaded analysis (KPI cards, invalid breakdown, category/status tables, satisfaction scores).

## Fresh-clone verification (grader workflow)

```powershell
git clone --branch company-incident-file-analyzer https://github.com/4GeeksAcademy/jcrews123-monorepo.git test-clone
cd test-clone/services/api
pip install -r requirements.txt
pip install -e ../../packages/incident-analysis
python -m pytest ../../packages/incident-analysis/tests tests
python -m uvicorn main:app --port 8000
python ../../scripts/analyze.py ../../scripts/incidents-brasaland.csv
```

Verified locally: **10/10 tests pass**, uvicorn starts without a globally installed package, CLI matches Brasaland CONTEXT.

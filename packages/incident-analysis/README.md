# incident-analysis

Shared **Python** library for Brasaland incident CSV validation, metrics, and export. Single source of truth for CLI and API — do not duplicate rules in `scripts/` or `services/api/`.

## Consumers

| Consumer | Path |
|----------|------|
| Phase 1 CLI | `scripts/analyze.py` |
| Phase 2 API | `services/api/routers/incidents.py` |

## Install (editable)

```bash
pip install -e packages/incident-analysis
```

From `services/api/` after activating a venv:

```bash
pip install -e ../../packages/incident-analysis
```

## Module map

| Module | Responsibility |
|--------|----------------|
| `constants.py` | Valid locations, categories, statuses |
| `validation.py` | Invalid-record rules and per-rule counts |
| `metrics.py` | Category/status/satisfaction aggregates (valid rows only) |
| `analyze.py` | `analyze_csv_rows`, `analyze_csv_text` entry points |
| `report.py` | Console output formatter |
| `export.py` | CSV export rows (`metric`, `value`, `percentage`) |
| `loader.py` | CSV file/text loading |

## Brasaland rules

Local copy: [`archive/incidents-file-analyzer-plan/incidents-file-analyzer-CONTEXT.md`](../../archive/incidents-file-analyzer-plan/incidents-file-analyzer-CONTEXT.md)  
Canonical syllabus: [CONTEXT-brasaland.en.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/incidents-file-analysis/CONTEXT-brasaland.en.md)

## Usage

```python
from incident_analysis.analyze import analyze_csv_text
from incident_analysis.report import format_console_report

text = open("scripts/incidents-brasaland.csv", encoding="utf-8").read()
result = analyze_csv_text(text, source_file="incidents-brasaland.csv")
print(format_console_report(result))
```

Expected test file metrics: 100 total, 96 valid, 4 invalid, avg satisfaction **3.46**.

## Tests

```bash
pip install -e "packages/incident-analysis[dev]"
python -m pytest packages/incident-analysis/tests
```

## Project archive

Implementation plan and evaluation checklist: [`archive/incidents-file-analyzer-plan/`](../../archive/incidents-file-analyzer-plan/)

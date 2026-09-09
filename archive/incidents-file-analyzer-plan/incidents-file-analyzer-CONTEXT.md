# CONTEXT — Brasaland · Incident File Analyzer

> **Canonical source:** [CONTEXT-brasaland.en.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/incidents-file-analysis/CONTEXT-brasaland.en.md)  
> **Test data:** [`scripts/incidents-brasaland.csv`](../../scripts/incidents-brasaland.csv) (copy of syllabus file)

---

## Company

**Brasaland** — 14 locations (Colombia + Florida). **Brasaland Digital** under **Nicolás Park (CTO)** and **Felipe Guerrero (Operations)**.

Operations tracks incidents: equipment, supply, customer complaints, food quality, staff. Data exported as CSV; analysis must stay internal (PII — no external AI tools).

---

## CSV structure

UTF-8, comma-separated, header row.

| Field | Required | Valid values |
|-------|----------|--------------|
| `incident_id` | Yes | `BRS-XXXXXX` |
| `date` | Yes | `YYYY-MM-DD` |
| `location_id` | Yes | `COL-01`–`COL-10`, `FLA-01`–`FLA-04` |
| `category` | Yes | `CUSTOMER_COMPLAINT`, `EQUIPMENT`, `SUPPLY`, `FOOD_QUALITY`, `STAFF` |
| `description` | Yes | Min 5 characters |
| `status` | Yes | `OPEN`, `CLOSED`, `DISCARDED` |
| `customer_id` | No | `CLI-XXXXXX` or empty |
| `satisfaction_score` | Conditional | 1–5; **required when `status = CLOSED`** |
| `reporter_id` | Yes | `MGR-XX` |

---

## Invalid record rules

Flag invalid when any rule applies; report counts **per rule type**:

- Missing or invalid `location_id`
- Missing or invalid `category`
- Empty or too-short `description` (< 5 chars)
- Missing `reporter_id`
- `CLOSED` without `satisfaction_score`
- `satisfaction_score` outside 1–5

Invalid rows are excluded from category/status/satisfaction metrics but never silently ignored.

---

## Expected results — `incidents-brasaland.csv` (100 rows)

| Metric | Value |
|--------|-------|
| Total | 100 |
| Valid | 96 |
| Invalid | 4 |
| Invalid: missing location | 1 |
| Invalid: bad category | 1 |
| Invalid: bad description | 1 |
| Invalid: closed, no score | 1 |
| CUSTOMER_COMPLAINT | 29 |
| EQUIPMENT | 17 |
| SUPPLY | 22 |
| FOOD_QUALITY | 19 |
| STAFF | 9 |
| OPEN | 32 |
| CLOSED | 50 |
| DISCARDED | 14 |
| Avg satisfaction (closed) | **3.46** |
| Score distribution 1–5 | 4, 6, 12, 19, 9 |

---

## Stakeholder note (Nicolás Park, CTO)

Console output for Felipe's morning ops review; CSV export for Ashley (`metric`, `value`, optional `percentage` columns).

---

## Repository paths (this monorepo)

| Concern | Path |
|---------|------|
| CLI | `scripts/analyze.py` |
| Shared logic | `packages/incident-analysis/` |
| API | `services/api/` |
| UI | `uis/backoffice/app/incidents/` |

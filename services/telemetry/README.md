# Telemetry analysis

Shared technical-report analysis for the Brasaland API. The canonical path follows syllabus project #48.

`analysis.py` reads only the required date range and event types from `telemetry_events`, then uses Pandas for refinement, UTC conversion, grouping, and aggregation. The FastAPI router in `services/api/routers/telemetry.py` serves these metrics.

This folder is not a second API or UI. Runtime ingestion and persistence remain in `services/api/telemetry/`.

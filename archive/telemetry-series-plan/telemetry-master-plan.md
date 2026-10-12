# Brasaland Telemetry Series Master Plan

This archive tracks syllabus projects **#45–48** as four sequential, independently verifiable deliveries.

## Sources

- [Project index](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/projects/README.md)
- [#45 Telemetry plan](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-telemetry-plan)
- [#46 Frontend capture](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-telemetry-capture)
- [#47 Storage](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-telemetry-storage)
- [#48 Technical report](https://github.com/4GeeksAcademy/ai-engineering-syllabus/tree/main/content/projects/ai-eng-telemetry-report)
- [Brasaland telemetry CONTEXT](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/06-telemetry-data-pipelines/telemetry/CONTEXT-brasaland.md)

## Locked decisions

- Scope is the internal backoffice and inventory system, not the public website.
- The six CONTEXT events are mandatory end-to-end.
- Capture uses one client `track()` function, a 10-second/20-event queue, beacon flush, and bounded retries.
- Storage is append-only Supabase PostgreSQL with per-event validation and one bulk insert per batch.
- Reporting is technical only: event volume, errors, latency, and authentication failure rate.
- No Prefect, cron, Celery, Redis, RAG, agents, or executive business dashboard.

## Delivery sequence

1. `plan-45-design.md` — approve event names, properties, privacy, and delivery.
2. `plan-46-capture.md` — implement the receiver, client queue, inventory fields, and instrumentation.
3. `plan-47-storage.md` — replace the receiver with validated bulk persistence.
4. `plan-48-report.md` — analyze stored data and expose the technical dashboard.

Each phase is complete only when its local evaluation checklist and the evidence in `PR_TEST_PLAN.md` are complete.

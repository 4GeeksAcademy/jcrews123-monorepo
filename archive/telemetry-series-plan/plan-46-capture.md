# Project #46 — Frontend Capture

## Deliverables

- `POST /telemetry/events` with the stable `TelemetryEvent` envelope.
- `uis/backoffice/lib/telemetry.ts` as the only telemetry transport.
- Queue, 10-second/20-event flush, beacon flush, and three retries.
- All six mandatory inventory events and the technical baseline.
- Minimal inventory fields needed for thresholds, price variance, and waste reasons.

## Evaluation checklist

- [x] Stub accepts event arrays and returns `{ "received": N }`.
- [x] Pydantic model implements the approved envelope.
- [x] Frontend endpoint comes from `NEXT_PUBLIC_TELEMETRY_ENDPOINT`.
- [x] Backend declares `TELEMETRY_ENDPOINT`.
- [x] Queue, batch/debounce, beacon, and retry are present.
- [x] Envelope metadata is generated automatically.
- [x] No direct telemetry HTTP calls exist outside the service.
- [x] All mandatory metrics have capture points.
- [x] Errors, performance, and navigation are instrumented.
- [x] Event names and properties follow project #45.
- [x] No names, emails, passwords, request bodies, or customer data are sent.
- [ ] Browser Network evidence shows a valid batch and HTTP 200.

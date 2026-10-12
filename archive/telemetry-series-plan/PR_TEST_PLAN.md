# Telemetry Series PR and Test Evidence

## #45 — `docs: telemetry design plan`

- Parse `docs/telemetry/event-schemas.json`.
- Confirm 6 mandatory and 10 identified event definitions.

## #46 — `feat: telemetry event capture`

- API test output.
- Backoffice lint/build output.
- DevTools Network screenshot showing a batch and HTTP 200.
- List each event and its capture hook in the PR description.

## #47 — `feat: telemetry event storage`

- Supabase table screenshot with at least five mixed events.
- Mixed valid/invalid request and `{ received, stored, rejected }` response.
- Confirm no frontend file changed in this phase.

## #48 — `feat: telemetry report endpoint`

- At least 20 real events before reporting verification.
- Sample `GET /telemetry/report` JSON.
- Screenshot of the protected `/telemetry` page.
- API tests, backoffice lint/build, and both UI HTTP checks.

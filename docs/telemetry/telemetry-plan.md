# Brasaland Telemetry Plan

**Syllabus project #45** · Schema version `1.0.0`  
**Scope:** authenticated backoffice and inventory workflows. The public website is excluded.

## Purpose

Brasaland needs operational facts about its inventory system without collecting employee names, email addresses, passwords, or customer information. Every event below answers a defined question and supports a concrete decision.

## Standard event envelope

Every event contains:

| Field | Type | Rule |
|---|---|---|
| `eventId` | UUID string | Generated when captured |
| `timestamp` | ISO 8601 UTC string | Capture time, not flush time |
| `sessionId` | UUID string | Created on first backoffice load and retained in `sessionStorage` |
| `userId` | string or null | Authenticated `profile.user_id` converted to string; null before login |
| `event_type` | string | Lowercase `entity_action` taxonomy |
| `schemaVersion` | string | `1.0.0` for this contract |
| `requestId` | UUID string | Correlates UI activity and API calls |
| `properties` | object | Event-specific allowlisted keys only |

All events are queued in memory and delivered in batches every 10 seconds or at 20 events. Pending events are flushed with `sendBeacon` when the page becomes hidden. Failed delivery retries three times with exponential backoff and never blocks business workflows.

## Canonical location rules

Locations `1–10` are Colombia (`CO`, `COP`) and locations `11–14` are Florida, United States (`US`, `USD`). Inventory telemetry derives country and currency from `location_id`; UI language never determines country.

## Event catalogue

### Mandatory Brasaland inventory events

#### `inbound_order_created`

We capture `inbound_order_created` because we need to know what is purchased by location and supplier, which allows Lucía to consolidate purchasing and negotiate prices.

- Delivery: batch. Purchasing analysis is not urgent enough to require a per-event request.
- Required properties: `location_id`, `country`, `product_id`, `product_category`, `quantity`, `unit`, `currency`, `supplier_id`, `unit_cost`.
- Sensitivity: no PII. Supplier and product identifiers are operational business data.

#### `outbound_order_created`

We capture `outbound_order_created` because we need to know ingredient consumption rates by location, which allows Felipe to adjust replenishment suggestions.

- Delivery: batch.
- Required properties: shared inventory fields plus `reason`, fixed to `consumption`.
- Sensitivity: no PII.

#### `stock_waste_registered`

We capture `stock_waste_registered` because we need to know how much product is lost and why, which allows Felipe to prioritize waste audits.

- Delivery: batch.
- Required properties: shared inventory fields plus `reason` (`expired`, `kitchen_error`, or `theft_suspected`).
- Sensitivity: no employee names or free-text accusations; only the controlled reason.

#### `stock_threshold_triggered`

We capture `stock_threshold_triggered` because we need to know when stock crosses below its configured minimum, which allows operations to adjust thresholds or replenishment frequency.

- Delivery: stream-priority within the normal queue: reaching 20 events flushes immediately. The event can drive an operational alert, but telemetry must not block the order.
- Required properties: shared inventory fields plus `min_stock` and `stock_after`.
- Rule: emit only when stock changes from `>= min_stock` to `< min_stock`.
- Sensitivity: no PII.

#### `direct_stock_edit_rejected`

We capture `direct_stock_edit_rejected` because we need to know where staff attempt to bypass order traceability, which allows Jake to target training and Nicolás to review permissions.

- Delivery: batch.
- Required properties: shared inventory fields plus `rejection_reason`, fixed to `order_required`.
- Rule: capture only after the API returns the deliberate rejection; stock is never changed.
- Sensitivity: `userId` is pseudonymous and retained only for access/training audits; no employee profile data is copied into properties.

#### `ingredient_price_variance_detected`

We capture `ingredient_price_variance_detected` because we need to know when a supplier price changes abnormally, which allows Lucía and Mariana to renegotiate or source alternatives.

- Delivery: stream-priority within the queue because procurement should see material price changes quickly.
- Required properties: shared inventory fields plus `supplier_id`, `unit_cost`, `previous_unit_cost`, and `variance_percent`.
- Rule: compare with the most recent prior purchase for the same product, supplier, and currency; emit when absolute variance is greater than 10%. The first purchase establishes a baseline.
- Sensitivity: no PII.

The shared inventory fields are `location_id`, `country`, `product_id`, `product_category`, `quantity`, `unit`, and `currency`.

### Identified technical and usage opportunities

#### `user_login_succeeded`

We capture `user_login_succeeded` because we need to know successful access volume, which allows Nicolás to distinguish genuine usage from authentication failures.

- Delivery: batch.
- Properties: `auth_method` (`password`).
- Sensitivity: pseudonymous envelope `userId`; never email or password.

#### `user_login_failed`

We capture `user_login_failed` because we need to know why operators cannot enter the system, which allows Nicolás to separate credential, session, and network problems.

- Delivery: stream-priority when the queue threshold is reached.
- Properties: `failure_reason` (`invalid_credentials`, `session_expired`, or `network_error`).
- Sensitivity: `userId` is null; never email or password.

#### `session_expired`

We capture `session_expired` because we need to know whether token lifetime interrupts work, which allows Nicolás to tune session policy.

- Delivery: batch.
- Properties: `route`.
- Sensitivity: route is sanitized to a pathname without query strings.

#### `page_viewed`

We capture `page_viewed` because we need to know which backoffice sections operators use, which allows the product team to prioritize navigation and support.

- Delivery: batch with duplicate consecutive route views suppressed for one second.
- Properties: `route`, `section`.
- Sensitivity: pathnames only; query strings and form values are removed.

#### `frontend_error`

We capture `frontend_error` because we need to know where uncaught browser failures happen, which allows engineering to prioritize reliability fixes.

- Delivery: stream-priority.
- Properties: `error_kind`, `route`, `message_code`.
- Sensitivity: raw stack traces and arbitrary exception text are excluded; `message_code` is sanitized and truncated.

#### `api_request_failed`

We capture `api_request_failed` because we need to know which API operations fail, which allows engineering to prioritize unstable endpoints.

- Delivery: stream-priority for server errors, otherwise batch.
- Properties: `endpoint`, `method`, `status`.
- Sensitivity: endpoint contains route templates only, never query strings or bodies.

#### `api_latency_recorded`

We capture `api_latency_recorded` because we need to know which API operations are slow, which allows engineering to optimize the worst paths.

- Delivery: batch.
- Properties: `endpoint`, `method`, `duration_ms`, `status`.
- Sensitivity: no request/response bodies.

#### `web_vital_recorded`

We capture `web_vital_recorded` because we need to know whether backoffice pages remain responsive, which allows engineering to prioritize regressions affecting operators.

- Delivery: batch and sampled once per metric/page lifecycle.
- Properties: `metric`, `value`, `rating`, `route`.
- Sensitivity: no PII.

#### `inventory_validation_failed`

We capture `inventory_validation_failed` because we need to know which inventory fields commonly block order entry, which allows the team to improve forms and training.

- Delivery: batch and debounced per field/error for one second.
- Properties: `form`, `field`, `error_code`.
- Sensitivity: controlled field and error codes only; entered values are excluded.

#### `inventory_flow_abandoned`

We capture `inventory_flow_abandoned` because we need to know where started inventory workflows are left incomplete, which allows the team to simplify confusing forms.

- Delivery: batch on route change or page hide after interaction and before success.
- Properties: `form`, `stage`.
- Sensitivity: no field values.

## Storage mapping

The storage endpoint maps the envelope to `telemetry_events`:

- `timestamp`, `event_type`: direct columns.
- `service`: `backoffice`.
- `level`: `error` for `frontend_error`; `warn` for request/login/validation/rejection/threshold/variance failures; otherwise `info`.
- `value`: `duration_ms`, Web Vital `value`, or `variance_percent` for their corresponding events; otherwise null.
- `message`: a controlled non-PII summary or null.
- `tags`: allowlisted `properties`, plus `_meta` containing `eventId`, `sessionId`, nullable `userId`, `requestId`, and `schemaVersion`.

Events are immutable. The application has no update or delete operation for telemetry.

## Risks and exclusions

- Duplicate client events can occur after a double submit or retry. Deduplication belongs to the later pipeline milestone; `eventId` preserves the future option.
- In-memory queues can be lost on a hard browser crash. Telemetry is non-critical and must not block inventory.
- Price variance is not emitted without prior comparable history.
- Threshold telemetry uses API-computed before/after stock to avoid stale browser calculations.
- Raw error stacks, request bodies, form values, customer data, names, email addresses, and passwords are never captured.
- The public marketing and Brasa Points website is excluded.
- Sales/revenue KPIs, Prefect pipelines, cron, queues, RAG, and agents are excluded from projects #45–48.

## Implementation contract

[`event-schemas.json`](./event-schemas.json) is the machine-readable contract. Implementations must reject unknown event types, missing required properties, wrong property types, and extra property keys. Any schema change requires a new `schemaVersion`.

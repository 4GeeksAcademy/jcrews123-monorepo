# Project #47 — Telemetry Storage

## Deliverables

- Supabase `telemetry_events` table with eight required columns and three indexes.
- Append-only application behavior.
- Per-event validation with partial batch acceptance.
- One SQL bulk insert per accepted batch.
- `{ "received", "stored", "rejected" }` response without frontend changes.

## Evaluation checklist

- [x] Migration defines the required columns, types, defaults, and indexes.
- [x] Endpoint returns all three counts.
- [x] Invalid events are rejected individually.
- [x] Project #46 `TelemetryEvent` remains unchanged.
- [x] Frontend transport and instrumentation remain unchanged.
- [x] Business and technical events map to core columns and tags.
- [x] Tags contain only allowlisted properties plus documented `_meta`.
- [x] Storage uses one bulk insert operation.
- [ ] Supabase evidence shows at least five mixed real rows.
- [ ] Mixed valid/invalid live request evidence is captured.

## Remote status

The tracked migrations are complete, but the configured Supabase MCP executes in a read-only transaction and rejected `ALTER TABLE`. Apply both files through an authorized Supabase SQL Editor/CLI session before collecting live evidence.

Supabase also reports RLS disabled on the pre-existing `ingredients`, `ingredient_entries`, and `ingredient_exits` tables. That security finding predates telemetry and is not changed here: enabling RLS without agreed policies could block the inventory API.

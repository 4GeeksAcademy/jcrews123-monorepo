create table if not exists public.telemetry_events (
  id uuid primary key default gen_random_uuid(),
  timestamp timestamptz not null,
  service text not null,
  event_type text not null,
  level text not null default 'info'
    check (level in ('info', 'warn', 'error')),
  value numeric,
  message text,
  tags jsonb not null default '{}'::jsonb
);

create index if not exists telemetry_events_timestamp_idx
  on public.telemetry_events (timestamp);

create index if not exists telemetry_events_event_type_idx
  on public.telemetry_events (event_type);

create index if not exists telemetry_events_tags_gin_idx
  on public.telemetry_events using gin (tags);

alter table public.telemetry_events enable row level security;
revoke all on table public.telemetry_events from anon, authenticated;

comment on table public.telemetry_events is
  'Append-only operational telemetry written by the Brasaland FastAPI service.';

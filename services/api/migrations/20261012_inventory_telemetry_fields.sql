-- Inventory fields required by Brasaland telemetry projects #45-48.
-- Existing inbound rows keep NULL cost/currency because historical values are unknown.

alter table public.ingredients
  add column if not exists min_stock numeric(12, 3) not null default 10;

alter table public.ingredient_entries
  add column if not exists unit_cost numeric(14, 2),
  add column if not exists currency text;

alter table public.ingredient_exits
  add column if not exists waste_reason text;

alter table public.ingredient_entries
  drop constraint if exists ingredient_entries_currency_check;
alter table public.ingredient_entries
  add constraint ingredient_entries_currency_check
  check (currency is null or currency in ('COP', 'USD'));

alter table public.ingredient_exits
  drop constraint if exists ingredient_exits_waste_reason_check;
alter table public.ingredient_exits
  add constraint ingredient_exits_waste_reason_check
  check (
    (reason = 'consumption' and waste_reason is null)
    or
    (reason = 'waste' and waste_reason in ('expired', 'kitchen_error', 'theft_suspected'))
  );

# CONTEXT — Milestone 5: Backend Inventory Management (Brasaland)

Canonical source: [CONTEXT-brasaland.en.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/05-backend-development/CONTEXT-brasaland.en.md)

## Entities

### Ingredient

| Field | Notes |
|-------|-------|
| `id`, `name`, `sku`, `unit`, `category`, `country` | `country`: `CO` or `US` |
| `current_stock` | Computed only — never stored |

### IngredientEntry (inbound)

Delivery from supplier: `ingredient_id`, `quantity`, `supplier_name`, `location_id` (1–14), `created_at`, `user_uuid`.

### IngredientExit (outbound)

Consumption or waste: `ingredient_id`, `quantity`, `reason` (`consumption` \| `waste`), `location_id`, `created_at`, `user_uuid`.

## Business rules

1. `current_stock = SUM(entries) − SUM(exits)` globally per ingredient.
2. Outbound exceeding stock → HTTP 400: `Insufficient stock for ingredient '{name}'. Available: {available}, requested: {requested}.`
3. No user table in Supabase — `user_uuid` references TinyDB users only.

## Seed (minimum)

Six ingredients (beef, pork, chimichurri, BBQ sauce, yuca, takeaway box), four+ entries, three+ exits including one waste. Beef net stock after seed: **40 kg** (50 + 30 − 25 − 10 − 5).

## API routes

All under `/inventory`: products CRUD/list, orders inbound/outbound, orders history.

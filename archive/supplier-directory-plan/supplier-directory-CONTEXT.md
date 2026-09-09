# CONTEXT — Supplier Directory · Brasaland (local copy)

> **Canonical source:** [CONTEXT-brasaland.en.md](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/supplier-directory/CONTEXT-brasaland.en.md)  
> **Seed implementation:** [`services/api/supplier_constants.py`](../../services/api/supplier_constants.py)

## Supplier fields

| Field | Rules |
|-------|-------|
| `name` | required string |
| `country` | `"Colombia"` or `"USA"` |
| `categories` | list, min 1, valid category slugs |
| `rate_per_unit` | float, strictly > 0 |
| `currency` | `"COP"` for Colombia, `"USD"` for USA |
| `updated_at` | system-generated on create and rate change |
| `status` | `"active"` or `"suspended"` |
| `contact_email`, `notes` | optional |

## Valid categories

`carne`, `verduras_y_hortalizas`, `salsas_y_condimentos`, `bebidas`, `packaging`, `productos_limpieza`, `lacteos`, `carbon_y_combustible`

## Business rules

- Reject country/currency mismatches with HTTP 422
- Record `updated_at` on every rate change (audit trail for Lucía)
- Seeder loads **15** suppliers verbatim from syllabus CONTEXT
- Suspension is the normal offboarding workflow; DELETE is for erroneous records only

## Frontend expectations

Lucía needs list view, country/category filters, create form, inline rate updates, and one-click activate/suspend with clear visual status badges.

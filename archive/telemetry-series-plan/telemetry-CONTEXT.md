# CONTEXT — Brasaland Telemetry

Canonical source: [4Geeks AI Engineering syllabus](https://github.com/4GeeksAcademy/ai-engineering-syllabus/blob/main/content/contexts/06-telemetry-data-pipelines/telemetry/CONTEXT-brasaland.md)

Brasaland has 14 restaurant locations across Colombia and Florida. Telemetry for projects #45–48 revolves around the existing inventory system and must support future aggregation by location, country, and week.

## Entities

- `Product`: ingredient or supply with unit and category.
- `InboundOrder`: goods received from a supplier at a location.
- `OutboundOrder`: consumption or waste at a location.
- `location`: one of 14 locations, identified by country and city.
- `supplier`: one of approximately 20 suppliers split by country.

## Mandatory events

| Event | Meaning |
|---|---|
| `inbound_order_created` | Goods received from a supplier |
| `outbound_order_created` | Ingredient consumption |
| `stock_waste_registered` | Expired product, kitchen error, or suspected theft/loss |
| `stock_threshold_triggered` | Stock falls below configured minimum |
| `direct_stock_edit_rejected` | Traceability bypass attempt is rejected |
| `ingredient_price_variance_detected` | Unit cost differs materially from prior supplier history |

Minimum inventory properties: `location_id`, `country`, `product_id`, `product_category`, `quantity`, `unit`, and `currency`; outbound/waste events also carry controlled reasons.

## Constraints

- Colombia uses `COP`; Florida uses `USD`. Telemetry does not convert currencies.
- Stock changes only through inbound/outbound orders traceable to a user.
- Do not include employee names or customer data.
- UI language is independent from a location's country.

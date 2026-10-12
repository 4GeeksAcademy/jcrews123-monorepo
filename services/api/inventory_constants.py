from __future__ import annotations

from decimal import Decimal

# Fixed UUID for seeded inventory orders when no operator user exists yet.
SEED_OPERATOR_UUID = "a1111111-1111-4111-8111-111111111111"
SEED_OPERATOR_EMAIL = "inventory.seed@brasaland.dev"

INGREDIENTS_SEED: list[dict[str, str]] = [
    {
        "name": "Beef brisket",
        "sku": "BRS-BEEF-001",
        "unit": "kg",
        "category": "meat",
        "country": "CO",
        "min_stock": Decimal("15"),
    },
    {
        "name": "Pork ribs",
        "sku": "BRS-PORK-001",
        "unit": "kg",
        "category": "meat",
        "country": "US",
        "min_stock": Decimal("12"),
    },
    {
        "name": "Chimichurri sauce",
        "sku": "BRS-SAUCE-001",
        "unit": "litre",
        "category": "sauce",
        "country": "CO",
        "min_stock": Decimal("5"),
    },
    {
        "name": "House BBQ sauce",
        "sku": "BRS-SAUCE-002",
        "unit": "litre",
        "category": "sauce",
        "country": "US",
        "min_stock": Decimal("5"),
    },
    {
        "name": "Yuca (cassava)",
        "sku": "BRS-PROD-001",
        "unit": "kg",
        "category": "produce",
        "country": "CO",
        "min_stock": Decimal("8"),
    },
    {
        "name": "Takeaway box (M)",
        "sku": "BRS-PKG-001",
        "unit": "unit",
        "category": "packaging",
        "country": "CO",
        "min_stock": Decimal("20"),
    },
]

# Entries reference SKUs; resolved to ingredient_id at seed time.
ENTRY_SEED: list[dict[str, object]] = [
    {
        "sku": "BRS-BEEF-001",
        "quantity": Decimal("50"),
        "supplier_name": "Carnes del Valle S.A.",
        "unit_cost": Decimal("32000"),
        "currency": "COP",
        "location_id": 1,
    },
    {
        "sku": "BRS-BEEF-001",
        "quantity": Decimal("30"),
        "supplier_name": "Carnes del Valle S.A.",
        "unit_cost": Decimal("33500"),
        "currency": "COP",
        "location_id": 1,
    },
    {
        "sku": "BRS-PORK-001",
        "quantity": Decimal("40"),
        "supplier_name": "MiamiMeat Co.",
        "unit_cost": Decimal("8.50"),
        "currency": "USD",
        "location_id": 11,
    },
    {
        "sku": "BRS-SAUCE-001",
        "quantity": Decimal("20"),
        "supplier_name": "Salsas Artesanales Ltda.",
        "unit_cost": Decimal("18000"),
        "currency": "COP",
        "location_id": 2,
    },
]

EXIT_SEED: list[dict[str, object]] = [
    {
        "sku": "BRS-BEEF-001",
        "quantity": Decimal("25"),
        "reason": "consumption",
        "location_id": 1,
    },
    {
        "sku": "BRS-BEEF-001",
        "quantity": Decimal("10"),
        "reason": "consumption",
        "location_id": 1,
    },
    {
        "sku": "BRS-BEEF-001",
        "quantity": Decimal("5"),
        "reason": "waste",
        "waste_reason": "expired",
        "location_id": 1,
    },
]

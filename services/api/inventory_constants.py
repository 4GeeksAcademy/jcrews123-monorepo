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
    },
    {
        "name": "Pork ribs",
        "sku": "BRS-PORK-001",
        "unit": "kg",
        "category": "meat",
        "country": "US",
    },
    {
        "name": "Chimichurri sauce",
        "sku": "BRS-SAUCE-001",
        "unit": "litre",
        "category": "sauce",
        "country": "CO",
    },
    {
        "name": "House BBQ sauce",
        "sku": "BRS-SAUCE-002",
        "unit": "litre",
        "category": "sauce",
        "country": "US",
    },
    {
        "name": "Yuca (cassava)",
        "sku": "BRS-PROD-001",
        "unit": "kg",
        "category": "produce",
        "country": "CO",
    },
    {
        "name": "Takeaway box (M)",
        "sku": "BRS-PKG-001",
        "unit": "unit",
        "category": "packaging",
        "country": "CO",
    },
]

# Entries reference SKUs; resolved to ingredient_id at seed time.
ENTRY_SEED: list[dict[str, object]] = [
    {
        "sku": "BRS-BEEF-001",
        "quantity": Decimal("50"),
        "supplier_name": "Carnes del Valle S.A.",
        "location_id": 1,
    },
    {
        "sku": "BRS-BEEF-001",
        "quantity": Decimal("30"),
        "supplier_name": "Carnes del Valle S.A.",
        "location_id": 1,
    },
    {
        "sku": "BRS-PORK-001",
        "quantity": Decimal("40"),
        "supplier_name": "MiamiMeat Co.",
        "location_id": 10,
    },
    {
        "sku": "BRS-SAUCE-001",
        "quantity": Decimal("20"),
        "supplier_name": "Salsas Artesanales Ltda.",
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
        "location_id": 1,
    },
]

from __future__ import annotations

from sqlmodel import Session, select

from auth_database import get_auth_db, get_user_by_email, insert_profile, insert_user
from core.security import hash_password
from db.postgres import create_inventory_tables, get_session
from inventory_constants import (
    ENTRY_SEED,
    EXIT_SEED,
    INGREDIENTS_SEED,
    SEED_OPERATOR_EMAIL,
    SEED_OPERATOR_UUID,
)
from models.inventory import Ingredient, IngredientEntry, IngredientExit
from services.users import utc_now_iso


def ensure_seed_operator_uuid() -> str:
    db = get_auth_db()
    existing = get_user_by_email(db, SEED_OPERATOR_EMAIL)
    if existing is not None:
        from auth_database import ensure_user_uuid

        return ensure_user_uuid(db, existing)["uuid"]

    user = insert_user(
        db,
        {
            "email": SEED_OPERATOR_EMAIL,
            "hashed_password": hash_password("SeedOperator123!"),
            "is_active": True,
            "role": "manager",
            "created_at": utc_now_iso(),
            "uuid": SEED_OPERATOR_UUID,
        },
    )
    insert_profile(
        db,
        {
            "user_id": user["id"],
            "name": "Inventory Seed Operator",
            "phone": "",
            "address": "",
        },
    )
    return user["uuid"]


def seed_inventory(user_uuid: str | None = None) -> int:
    create_inventory_tables()
    operator_uuid = user_uuid or ensure_seed_operator_uuid()
    inserted = 0

    with get_session() as session:
        beef = session.exec(
            select(Ingredient).where(Ingredient.sku == "BRS-BEEF-001")
        ).first()
        if beef is not None:
            print("Inventory seed already present; skipping.")
            return 0

        sku_to_id: dict[str, int] = {}
        for row in INGREDIENTS_SEED:
            ingredient = Ingredient(**row)
            session.add(ingredient)
            session.commit()
            session.refresh(ingredient)
            sku_to_id[ingredient.sku] = ingredient.id  # type: ignore[assignment]
            inserted += 1

        for row in ENTRY_SEED:
            entry = IngredientEntry(
                ingredient_id=sku_to_id[str(row["sku"])],
                quantity=row["quantity"],  # type: ignore[arg-type]
                supplier_name=str(row["supplier_name"]),
                location_id=int(row["location_id"]),
                user_uuid=operator_uuid,
            )
            session.add(entry)
            inserted += 1

        for row in EXIT_SEED:
            exit_row = IngredientExit(
                ingredient_id=sku_to_id[str(row["sku"])],
                quantity=row["quantity"],  # type: ignore[arg-type]
                reason=str(row["reason"]),
                location_id=int(row["location_id"]),
                user_uuid=operator_uuid,
            )
            session.add(exit_row)
            inserted += 1

        session.commit()

    print(f"Inserted {inserted} inventory records")
    return inserted

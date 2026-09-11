from __future__ import annotations

from pathlib import Path

from dotenv import load_dotenv

_API_DIR = Path(__file__).resolve().parent
load_dotenv(_API_DIR / ".env", override=False)

from database import find_by_name_country, get_db, insert_supplier
from inventory_seed import seed_inventory
from supplier_constants import SUPPLIERS_SEED
from services.users import utc_now_iso


def run_seed() -> int:
    db = get_db()
    inserted = 0
    now = utc_now_iso()

    for seed in SUPPLIERS_SEED:
        if find_by_name_country(db, seed["name"], seed["country"]):
            continue
        payload = {**seed, "updated_at": now}
        insert_supplier(db, payload)
        inserted += 1

    print(f"Inserted {inserted} suppliers")
    seed_inventory()
    return inserted


def main() -> int:
    run_seed()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

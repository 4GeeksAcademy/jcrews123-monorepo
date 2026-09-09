from __future__ import annotations

from datetime import datetime, timezone

from database import find_by_name_country, get_db, insert_supplier
from supplier_constants import SUPPLIERS_SEED


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


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
    return inserted


def main() -> int:
    run_seed()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())

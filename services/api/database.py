from __future__ import annotations

import os
from pathlib import Path
from typing import Any

from tinydb import Query, TinyDB

DEFAULT_DB_PATH = Path(__file__).resolve().parent / "data" / "suppliers.json"
SUPPLIERS_TABLE = "suppliers"


def get_db_path() -> Path:
    override = os.environ.get("SUPPLIERS_DB_PATH")
    if override:
        return Path(override)
    return DEFAULT_DB_PATH


def get_db(db_path: Path | None = None) -> TinyDB:
    path = db_path or get_db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    return TinyDB(path)


def get_suppliers_table(db: TinyDB) -> Any:
    return db.table(SUPPLIERS_TABLE)


def document_to_dict(doc_id: int, document: dict[str, Any]) -> dict[str, Any]:
    return {"id": doc_id, **document}


def list_suppliers(db: TinyDB) -> list[dict[str, Any]]:
    table = get_suppliers_table(db)
    return [document_to_dict(doc.doc_id, dict(doc)) for doc in table]


def get_supplier_by_id(db: TinyDB, supplier_id: int) -> dict[str, Any] | None:
    table = get_suppliers_table(db)
    document = table.get(doc_id=supplier_id)
    if document is None:
        return None
    return document_to_dict(supplier_id, dict(document))


def find_by_name_country(
    db: TinyDB, name: str, country: str
) -> dict[str, Any] | None:
    table = get_suppliers_table(db)
    Supplier = Query()
    results = table.search(
        (Supplier.name == name) & (Supplier.country == country)
    )
    if not results:
        return None
    for doc in results:
        return document_to_dict(doc.doc_id, dict(doc))
    return None


def insert_supplier(db: TinyDB, data: dict[str, Any]) -> dict[str, Any]:
    table = get_suppliers_table(db)
    doc_id = table.insert(data)
    return document_to_dict(doc_id, data)


def update_supplier(
    db: TinyDB, supplier_id: int, updates: dict[str, Any]
) -> dict[str, Any] | None:
    table = get_suppliers_table(db)
    if table.get(doc_id=supplier_id) is None:
        return None
    table.update(updates, doc_ids=[supplier_id])
    return get_supplier_by_id(db, supplier_id)


def delete_supplier(db: TinyDB, supplier_id: int) -> bool:
    table = get_suppliers_table(db)
    removed = table.remove(doc_ids=[supplier_id])
    return len(removed) > 0

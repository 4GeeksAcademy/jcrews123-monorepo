from __future__ import annotations

from datetime import datetime, timezone
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query
from tinydb import TinyDB

from core.deps import get_current_user
from database import (
    delete_supplier,
    get_db,
    get_supplier_by_id,
    insert_supplier,
    list_suppliers,
    update_supplier,
)
from schemas.suppliers import (
    SupplierCreate,
    SupplierResponse,
    SupplierUpdateRate,
    SupplierUpdateStatus,
)

router = APIRouter(prefix="/suppliers", tags=["suppliers"])


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def get_database() -> TinyDB:
    return get_db()


def to_response(record: dict) -> SupplierResponse:
    return SupplierResponse.model_validate(record)


@router.post("", response_model=SupplierResponse, status_code=201)
def create_supplier(
    payload: SupplierCreate,
    db: Annotated[TinyDB, Depends(get_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> SupplierResponse:
    _ = current_user
    data = payload.model_dump()
    data["updated_at"] = utc_now_iso()
    record = insert_supplier(db, data)
    return to_response(record)


@router.get("", response_model=list[SupplierResponse])
def list_all_suppliers(
    db: Annotated[TinyDB, Depends(get_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
    country: str | None = Query(default=None),
    category: str | None = Query(default=None),
) -> list[SupplierResponse]:
    _ = current_user
    records = list_suppliers(db)

    if country:
        records = [record for record in records if record["country"] == country]

    if category:
        records = [
            record
            for record in records
            if category in record.get("categories", [])
        ]

    return [to_response(record) for record in records]


@router.get("/{supplier_id}", response_model=SupplierResponse)
def get_supplier(
    supplier_id: int,
    db: Annotated[TinyDB, Depends(get_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> SupplierResponse:
    _ = current_user
    record = get_supplier_by_id(db, supplier_id)
    if record is None:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    return to_response(record)


@router.patch("/{supplier_id}/rate", response_model=SupplierResponse)
def update_supplier_rate(
    supplier_id: int,
    payload: SupplierUpdateRate,
    db: Annotated[TinyDB, Depends(get_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> SupplierResponse:
    _ = current_user
    record = update_supplier(
        db,
        supplier_id,
        {
            "rate_per_unit": payload.rate_per_unit,
            "updated_at": utc_now_iso(),
        },
    )
    if record is None:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    return to_response(record)


@router.patch("/{supplier_id}/status", response_model=SupplierResponse)
def update_supplier_status(
    supplier_id: int,
    payload: SupplierUpdateStatus,
    db: Annotated[TinyDB, Depends(get_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> SupplierResponse:
    _ = current_user
    record = update_supplier(
        db,
        supplier_id,
        {"status": payload.status.value},
    )
    if record is None:
        raise HTTPException(status_code=404, detail="Supplier not found.")
    return to_response(record)


@router.delete("/{supplier_id}", status_code=200)
def remove_supplier(
    supplier_id: int,
    db: Annotated[TinyDB, Depends(get_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> dict[str, str]:
    _ = current_user
    if not delete_supplier(db, supplier_id):
        raise HTTPException(status_code=404, detail="Supplier not found.")
    return {"detail": "Supplier deleted."}

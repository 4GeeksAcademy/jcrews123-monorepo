from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlmodel import Session

from core.deps import get_current_user, get_db, get_user_uuid
from schemas.inventory import (
    InboundOrderCreate,
    IngredientCreate,
    IngredientResponse,
    InventoryOrderResponse,
    OutboundOrderCreate,
)
from services import inventory as inventory_service

router = APIRouter(prefix="/inventory", tags=["inventory"])


@router.get("/products", response_model=list[IngredientResponse])
def list_products(
    session: Annotated[Session, Depends(get_db)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> list[IngredientResponse]:
    _ = current_user
    return inventory_service.list_ingredients(session)


@router.post("/products", response_model=IngredientResponse, status_code=201)
def create_product(
    payload: IngredientCreate,
    session: Annotated[Session, Depends(get_db)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> IngredientResponse:
    _ = current_user
    return inventory_service.create_ingredient(session, payload)


@router.get("/products/{ingredient_id}", response_model=IngredientResponse)
def get_product(
    ingredient_id: int,
    session: Annotated[Session, Depends(get_db)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> IngredientResponse:
    _ = current_user
    return inventory_service.get_ingredient(session, ingredient_id)


@router.post("/orders/inbound", response_model=InventoryOrderResponse, status_code=201)
def register_inbound_order(
    payload: InboundOrderCreate,
    session: Annotated[Session, Depends(get_db)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> InventoryOrderResponse:
    return inventory_service.create_inbound_order(
        session, payload, get_user_uuid(current_user)
    )


@router.post("/orders/outbound", response_model=InventoryOrderResponse, status_code=201)
def register_outbound_order(
    payload: OutboundOrderCreate,
    session: Annotated[Session, Depends(get_db)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> InventoryOrderResponse:
    return inventory_service.create_outbound_order(
        session, payload, get_user_uuid(current_user)
    )


@router.get("/orders", response_model=list[InventoryOrderResponse])
def list_inventory_orders(
    session: Annotated[Session, Depends(get_db)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> list[InventoryOrderResponse]:
    _ = current_user
    return inventory_service.list_orders(session)

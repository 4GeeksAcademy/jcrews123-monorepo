from __future__ import annotations

from decimal import Decimal

from fastapi import HTTPException, status
from sqlalchemy import func
from sqlmodel import Session, select

from models.inventory import Ingredient, IngredientEntry, IngredientExit
from schemas.inventory import (
    InboundOrderCreate,
    IngredientCreate,
    IngredientResponse,
    InventoryOrderResponse,
    OutboundOrderCreate,
)


def compute_current_stock(session: Session, ingredient_id: int) -> Decimal:
    inbound = session.exec(
        select(func.coalesce(func.sum(IngredientEntry.quantity), 0)).where(
            IngredientEntry.ingredient_id == ingredient_id
        )
    ).one()
    outbound = session.exec(
        select(func.coalesce(func.sum(IngredientExit.quantity), 0)).where(
            IngredientExit.ingredient_id == ingredient_id
        )
    ).one()
    return Decimal(str(inbound)) - Decimal(str(outbound))


def ingredient_to_response(session: Session, ingredient: Ingredient) -> IngredientResponse:
    stock = compute_current_stock(session, ingredient.id)  # type: ignore[arg-type]
    return IngredientResponse(
        id=ingredient.id,  # type: ignore[arg-type]
        name=ingredient.name,
        sku=ingredient.sku,
        unit=ingredient.unit,
        category=ingredient.category,
        country=ingredient.country,
        current_stock=stock,
    )


def get_ingredient_or_404(session: Session, ingredient_id: int) -> Ingredient:
    ingredient = session.get(Ingredient, ingredient_id)
    if ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found.")
    return ingredient


def lock_ingredient(session: Session, ingredient_id: int) -> Ingredient:
    stmt = select(Ingredient).where(Ingredient.id == ingredient_id)
    bind = session.get_bind()
    if bind is not None and bind.dialect.name == "postgresql":
        stmt = stmt.with_for_update()
    ingredient = session.exec(stmt).first()
    if ingredient is None:
        raise HTTPException(status_code=404, detail="Ingredient not found.")
    return ingredient


def create_ingredient(session: Session, payload: IngredientCreate) -> IngredientResponse:
    existing = session.exec(select(Ingredient).where(Ingredient.sku == payload.sku)).first()
    if existing is not None:
        raise HTTPException(status_code=409, detail="SKU already registered.")

    ingredient = Ingredient(**payload.model_dump())
    session.add(ingredient)
    session.commit()
    session.refresh(ingredient)
    return ingredient_to_response(session, ingredient)


def list_ingredients(session: Session) -> list[IngredientResponse]:
    ingredients = session.exec(select(Ingredient).order_by(Ingredient.name)).all()
    return [ingredient_to_response(session, row) for row in ingredients]


def get_ingredient(session: Session, ingredient_id: int) -> IngredientResponse:
    ingredient = get_ingredient_or_404(session, ingredient_id)
    return ingredient_to_response(session, ingredient)


def create_inbound_order(
    session: Session, payload: InboundOrderCreate, user_uuid: str
) -> InventoryOrderResponse:
    ingredient = get_ingredient_or_404(session, payload.ingredient_id)
    entry = IngredientEntry(
        ingredient_id=ingredient.id,  # type: ignore[arg-type]
        quantity=payload.quantity,
        supplier_name=payload.supplier_name,
        location_id=payload.location_id,
        user_uuid=user_uuid,
    )
    session.add(entry)
    session.commit()
    session.refresh(entry)
    return InventoryOrderResponse(
        id=entry.id,  # type: ignore[arg-type]
        order_type="inbound",
        ingredient_id=ingredient.id,  # type: ignore[arg-type]
        product_name=ingredient.name,
        quantity=entry.quantity,
        user_uuid=entry.user_uuid,
        created_at=entry.created_at,
        location_id=entry.location_id,
        supplier_name=entry.supplier_name,
    )


def create_outbound_order(
    session: Session, payload: OutboundOrderCreate, user_uuid: str
) -> InventoryOrderResponse:
    ingredient = lock_ingredient(session, payload.ingredient_id)
    available = compute_current_stock(session, ingredient.id)  # type: ignore[arg-type]
    if payload.quantity > available:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=(
                f"Insufficient stock for ingredient '{ingredient.name}'. "
                f"Available: {available}, requested: {payload.quantity}."
            ),
        )

    exit_row = IngredientExit(
        ingredient_id=ingredient.id,  # type: ignore[arg-type]
        quantity=payload.quantity,
        reason=payload.reason.value,
        location_id=payload.location_id,
        user_uuid=user_uuid,
    )
    session.add(exit_row)
    session.commit()
    session.refresh(exit_row)
    return InventoryOrderResponse(
        id=exit_row.id,  # type: ignore[arg-type]
        order_type="outbound",
        ingredient_id=ingredient.id,  # type: ignore[arg-type]
        product_name=ingredient.name,
        quantity=exit_row.quantity,
        user_uuid=exit_row.user_uuid,
        created_at=exit_row.created_at,
        location_id=exit_row.location_id,
        reason=exit_row.reason,
    )


def list_orders(session: Session) -> list[InventoryOrderResponse]:
    entries = session.exec(
        select(IngredientEntry, Ingredient)
        .join(Ingredient, IngredientEntry.ingredient_id == Ingredient.id)
        .order_by(IngredientEntry.created_at.desc())
    ).all()
    exits = session.exec(
        select(IngredientExit, Ingredient)
        .join(Ingredient, IngredientExit.ingredient_id == Ingredient.id)
        .order_by(IngredientExit.created_at.desc())
    ).all()

    orders: list[InventoryOrderResponse] = []
    for entry, ingredient in entries:
        orders.append(
            InventoryOrderResponse(
                id=entry.id,  # type: ignore[arg-type]
                order_type="inbound",
                ingredient_id=ingredient.id,  # type: ignore[arg-type]
                product_name=ingredient.name,
                quantity=entry.quantity,
                user_uuid=entry.user_uuid,
                created_at=entry.created_at,
                location_id=entry.location_id,
                supplier_name=entry.supplier_name,
            )
        )
    for exit_row, ingredient in exits:
        orders.append(
            InventoryOrderResponse(
                id=exit_row.id,  # type: ignore[arg-type]
                order_type="outbound",
                ingredient_id=ingredient.id,  # type: ignore[arg-type]
                product_name=ingredient.name,
                quantity=exit_row.quantity,
                user_uuid=exit_row.user_uuid,
                created_at=exit_row.created_at,
                location_id=exit_row.location_id,
                reason=exit_row.reason,
            )
        )

    orders.sort(key=lambda row: row.created_at, reverse=True)
    return orders

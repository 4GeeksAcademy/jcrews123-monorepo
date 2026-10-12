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

PRICE_VARIANCE_THRESHOLD = Decimal("10")


def location_country_currency(location_id: int) -> tuple[str, str]:
    if 1 <= location_id <= 10:
        return ("CO", "COP")
    if 11 <= location_id <= 14:
        return ("US", "USD")
    raise HTTPException(status_code=422, detail="Location must be between 1 and 14.")


def validate_location_market(
    ingredient: Ingredient, location_id: int, currency: str | None = None
) -> tuple[str, str]:
    country, expected_currency = location_country_currency(location_id)
    if ingredient.country != country:
        raise HTTPException(
            status_code=422,
            detail="Ingredient country does not match the selected location.",
        )
    if currency is not None and currency != expected_currency:
        raise HTTPException(
            status_code=422,
            detail=f"Location {location_id} requires currency {expected_currency}.",
        )
    return country, expected_currency


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
        min_stock=ingredient.min_stock,
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
    country, currency = validate_location_market(
        ingredient, payload.location_id, payload.currency.value
    )
    previous = session.exec(
        select(IngredientEntry)
        .where(
            IngredientEntry.ingredient_id == ingredient.id,
            IngredientEntry.supplier_name == payload.supplier_name,
            IngredientEntry.currency == currency,
            IngredientEntry.unit_cost.is_not(None),  # type: ignore[union-attr]
        )
        .order_by(IngredientEntry.created_at.desc())
    ).first()
    previous_cost = previous.unit_cost if previous is not None else None
    variance_percent = (
        ((payload.unit_cost - previous_cost) / previous_cost * Decimal("100"))
        if previous_cost
        else None
    )
    variance_detected = (
        variance_percent is not None
        and abs(variance_percent) > PRICE_VARIANCE_THRESHOLD
    )
    entry = IngredientEntry(
        ingredient_id=ingredient.id,  # type: ignore[arg-type]
        quantity=payload.quantity,
        supplier_name=payload.supplier_name,
        unit_cost=payload.unit_cost,
        currency=currency,
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
        product_category=ingredient.category,
        unit=ingredient.unit,
        country=country,
        currency=currency,
        quantity=entry.quantity,
        user_uuid=entry.user_uuid,
        created_at=entry.created_at,
        location_id=entry.location_id,
        supplier_name=entry.supplier_name,
        unit_cost=entry.unit_cost,
        previous_unit_cost=previous_cost,
        variance_percent=variance_percent,
        price_variance_detected=variance_detected,
        min_stock=ingredient.min_stock,
        stock_after=compute_current_stock(session, ingredient.id),  # type: ignore[arg-type]
    )


def create_outbound_order(
    session: Session, payload: OutboundOrderCreate, user_uuid: str
) -> InventoryOrderResponse:
    ingredient = lock_ingredient(session, payload.ingredient_id)
    country, currency = validate_location_market(ingredient, payload.location_id)
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
        waste_reason=payload.waste_reason.value if payload.waste_reason else None,
        location_id=payload.location_id,
        user_uuid=user_uuid,
    )
    session.add(exit_row)
    session.commit()
    session.refresh(exit_row)
    stock_after = available - payload.quantity
    threshold_triggered = (
        available >= ingredient.min_stock and stock_after < ingredient.min_stock
    )
    return InventoryOrderResponse(
        id=exit_row.id,  # type: ignore[arg-type]
        order_type="outbound",
        ingredient_id=ingredient.id,  # type: ignore[arg-type]
        product_name=ingredient.name,
        product_category=ingredient.category,
        unit=ingredient.unit,
        country=country,
        currency=currency,
        quantity=exit_row.quantity,
        user_uuid=exit_row.user_uuid,
        created_at=exit_row.created_at,
        location_id=exit_row.location_id,
        reason=exit_row.reason,
        waste_reason=exit_row.waste_reason,
        min_stock=ingredient.min_stock,
        stock_after=stock_after,
        threshold_triggered=threshold_triggered,
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
                product_category=ingredient.category,
                unit=ingredient.unit,
                country=location_country_currency(entry.location_id)[0],
                currency=entry.currency
                or location_country_currency(entry.location_id)[1],
                quantity=entry.quantity,
                user_uuid=entry.user_uuid,
                created_at=entry.created_at,
                location_id=entry.location_id,
                supplier_name=entry.supplier_name,
                unit_cost=entry.unit_cost,
                min_stock=ingredient.min_stock,
                stock_after=compute_current_stock(session, ingredient.id),  # type: ignore[arg-type]
            )
        )
    for exit_row, ingredient in exits:
        orders.append(
            InventoryOrderResponse(
                id=exit_row.id,  # type: ignore[arg-type]
                order_type="outbound",
                ingredient_id=ingredient.id,  # type: ignore[arg-type]
                product_name=ingredient.name,
                product_category=ingredient.category,
                unit=ingredient.unit,
                country=location_country_currency(exit_row.location_id)[0],
                currency=location_country_currency(exit_row.location_id)[1],
                quantity=exit_row.quantity,
                user_uuid=exit_row.user_uuid,
                created_at=exit_row.created_at,
                location_id=exit_row.location_id,
                reason=exit_row.reason,
                waste_reason=exit_row.waste_reason,
                min_stock=ingredient.min_stock,
                stock_after=compute_current_stock(session, ingredient.id),  # type: ignore[arg-type]
            )
        )

    orders.sort(key=lambda row: row.created_at, reverse=True)
    return orders

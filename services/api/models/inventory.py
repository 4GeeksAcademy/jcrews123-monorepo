from __future__ import annotations

from datetime import datetime, timezone
from decimal import Decimal

from sqlalchemy import Column, Numeric
from sqlmodel import Field, SQLModel


def utc_now() -> datetime:
    return datetime.now(timezone.utc)


class Ingredient(SQLModel, table=True):
    __tablename__ = "ingredients"

    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(index=True)
    sku: str = Field(unique=True, index=True)
    unit: str
    category: str
    country: str


class IngredientEntry(SQLModel, table=True):
    __tablename__ = "ingredient_entries"

    id: int | None = Field(default=None, primary_key=True)
    ingredient_id: int = Field(foreign_key="ingredients.id", index=True)
    quantity: Decimal = Field(sa_column=Column(Numeric(12, 3), nullable=False))
    supplier_name: str
    location_id: int = Field(ge=1, le=14)
    created_at: datetime = Field(default_factory=utc_now)
    user_uuid: str = Field(index=True)


class IngredientExit(SQLModel, table=True):
    __tablename__ = "ingredient_exits"

    id: int | None = Field(default=None, primary_key=True)
    ingredient_id: int = Field(foreign_key="ingredients.id", index=True)
    quantity: Decimal = Field(sa_column=Column(Numeric(12, 3), nullable=False))
    reason: str
    location_id: int = Field(ge=1, le=14)
    created_at: datetime = Field(default_factory=utc_now)
    user_uuid: str = Field(index=True)

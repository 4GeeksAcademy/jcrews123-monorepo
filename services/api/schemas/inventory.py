from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, field_validator


class IngredientCategory(str, Enum):
    meat = "meat"
    produce = "produce"
    sauce = "sauce"
    beverage = "beverage"
    packaging = "packaging"
    cleaning = "cleaning"


class IngredientCountry(str, Enum):
    CO = "CO"
    US = "US"


class ExitReason(str, Enum):
    consumption = "consumption"
    waste = "waste"


class IngredientCreate(BaseModel):
    name: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    unit: str = Field(min_length=1)
    category: IngredientCategory
    country: IngredientCountry


class IngredientResponse(BaseModel):
    id: int
    name: str
    sku: str
    unit: str
    category: str
    country: str
    current_stock: Decimal


class InboundOrderCreate(BaseModel):
    ingredient_id: int = Field(gt=0)
    quantity: Decimal = Field(gt=0)
    supplier_name: str = Field(min_length=1)
    location_id: int = Field(ge=1, le=14)

    @field_validator("quantity", mode="before")
    @classmethod
    def coerce_quantity(cls, value: object) -> object:
        if isinstance(value, (int, float, str)):
            return Decimal(str(value))
        return value


class OutboundOrderCreate(BaseModel):
    ingredient_id: int = Field(gt=0)
    quantity: Decimal = Field(gt=0)
    reason: ExitReason
    location_id: int = Field(ge=1, le=14)

    @field_validator("quantity", mode="before")
    @classmethod
    def coerce_quantity(cls, value: object) -> object:
        if isinstance(value, (int, float, str)):
            return Decimal(str(value))
        return value


class InventoryOrderResponse(BaseModel):
    id: int
    order_type: Literal["inbound", "outbound"]
    ingredient_id: int
    product_name: str
    quantity: Decimal
    user_uuid: str
    created_at: datetime
    location_id: int
    supplier_name: str | None = None
    reason: str | None = None

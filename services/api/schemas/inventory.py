from __future__ import annotations

from datetime import datetime
from decimal import Decimal
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator


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


class WasteReason(str, Enum):
    expired = "expired"
    kitchen_error = "kitchen_error"
    theft_suspected = "theft_suspected"


class Currency(str, Enum):
    COP = "COP"
    USD = "USD"


class IngredientCreate(BaseModel):
    name: str = Field(min_length=1)
    sku: str = Field(min_length=1)
    unit: str = Field(min_length=1)
    category: IngredientCategory
    country: IngredientCountry
    min_stock: Decimal = Field(default=Decimal("10"), ge=0)


class IngredientResponse(BaseModel):
    id: int
    name: str
    sku: str
    unit: str
    category: str
    country: str
    current_stock: Decimal
    min_stock: Decimal


class InboundOrderCreate(BaseModel):
    ingredient_id: int = Field(gt=0)
    quantity: Decimal = Field(gt=0)
    supplier_name: str = Field(min_length=1)
    unit_cost: Decimal = Field(gt=0)
    currency: Currency
    location_id: int = Field(ge=1, le=14)

    @field_validator("quantity", "unit_cost", mode="before")
    @classmethod
    def coerce_quantity(cls, value: object) -> object:
        if isinstance(value, (int, float, str)):
            return Decimal(str(value))
        return value


class OutboundOrderCreate(BaseModel):
    ingredient_id: int = Field(gt=0)
    quantity: Decimal = Field(gt=0)
    reason: ExitReason
    waste_reason: WasteReason | None = None
    location_id: int = Field(ge=1, le=14)

    @field_validator("quantity", mode="before")
    @classmethod
    def coerce_quantity(cls, value: object) -> object:
        if isinstance(value, (int, float, str)):
            return Decimal(str(value))
        return value

    @model_validator(mode="after")
    def validate_waste_reason(self) -> "OutboundOrderCreate":
        if self.reason == ExitReason.waste and self.waste_reason is None:
            raise ValueError("waste_reason is required when reason is waste")
        if self.reason == ExitReason.consumption and self.waste_reason is not None:
            raise ValueError("waste_reason is only allowed when reason is waste")
        return self


class StockEditAttempt(BaseModel):
    quantity: Decimal = Field(gt=0)
    location_id: int = Field(ge=1, le=14)


class InventoryOrderResponse(BaseModel):
    id: int
    order_type: Literal["inbound", "outbound"]
    ingredient_id: int
    product_name: str
    product_category: str
    unit: str
    country: str
    currency: str
    quantity: Decimal
    user_uuid: str
    created_at: datetime
    location_id: int
    supplier_name: str | None = None
    reason: str | None = None
    waste_reason: str | None = None
    unit_cost: Decimal | None = None
    previous_unit_cost: Decimal | None = None
    variance_percent: Decimal | None = None
    price_variance_detected: bool = False
    min_stock: Decimal
    stock_after: Decimal
    threshold_triggered: bool = False

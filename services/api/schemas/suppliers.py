from __future__ import annotations

from datetime import datetime
from enum import Enum
from typing import Literal

from pydantic import BaseModel, Field, field_validator, model_validator

from supplier_constants import COUNTRY_CURRENCY, VALID_CATEGORIES


class SupplierStatus(str, Enum):
    active = "active"
    suspended = "suspended"


class SupplierBase(BaseModel):
    name: str = Field(min_length=1)
    country: Literal["Colombia", "USA"]
    categories: list[str] = Field(min_length=1)
    rate_per_unit: float = Field(gt=0)
    currency: Literal["COP", "USD"]
    status: SupplierStatus
    contact_email: str | None = None
    notes: str | None = None

    @field_validator("categories")
    @classmethod
    def validate_categories(cls, value: list[str]) -> list[str]:
        invalid = [category for category in value if category not in VALID_CATEGORIES]
        if invalid:
            raise ValueError(
                f"Invalid categories: {invalid}. Must be one of {VALID_CATEGORIES}."
            )
        return value

    @model_validator(mode="after")
    def validate_country_currency(self) -> SupplierBase:
        expected = COUNTRY_CURRENCY[self.country]
        if self.currency != expected:
            raise ValueError(
                f"Currency must be {expected} for country {self.country}."
            )
        return self


class SupplierCreate(SupplierBase):
    pass


class SupplierUpdateRate(BaseModel):
    rate_per_unit: float = Field(gt=0)


class SupplierUpdateStatus(BaseModel):
    status: SupplierStatus


class SupplierResponse(SupplierBase):
    id: int
    updated_at: datetime

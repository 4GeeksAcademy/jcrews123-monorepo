from __future__ import annotations

from pydantic import BaseModel


class ProfileResponse(BaseModel):
    id: int
    user_id: int
    name: str
    phone: str
    address: str


class ProfileUpdate(BaseModel):
    name: str | None = None
    phone: str | None = None
    address: str | None = None

from __future__ import annotations

from enum import Enum

from pydantic import BaseModel, EmailStr, Field


class UserRole(str, Enum):
    admin = "admin"
    manager = "manager"
    user = "user"


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)
    name: str | None = None
    phone: str | None = None
    address: str | None = None


class UserUpdate(BaseModel):
    email: EmailStr | None = None
    role: UserRole | None = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    is_active: bool
    role: UserRole
    created_at: str

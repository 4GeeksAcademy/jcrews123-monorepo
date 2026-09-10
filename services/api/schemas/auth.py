from __future__ import annotations

from pydantic import BaseModel, EmailStr, Field

from schemas.profiles import ProfileResponse
from schemas.users import UserRole


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class AuthMeResponse(BaseModel):
    email: EmailStr
    role: UserRole
    profile: ProfileResponse

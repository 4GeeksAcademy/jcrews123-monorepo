from __future__ import annotations

from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError
from tinydb import TinyDB

from auth_database import get_auth_db, get_user_by_id
from core.security import decode_access_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_auth_database() -> TinyDB:
    return get_auth_db()


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> dict:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        user_id = decode_access_token(token)
    except JWTError as exc:
        raise credentials_exception from exc

    user = get_user_by_id(db, user_id)
    if user is None or not user.get("is_active", True):
        raise credentials_exception
    return user


def require_self_or_admin(user_id: int, current_user: dict) -> None:
    if current_user["id"] == user_id:
        return
    if current_user.get("role") == "admin":
        return
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Not authorized to access this user.",
    )

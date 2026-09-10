from __future__ import annotations

from datetime import datetime, timezone

from auth_database import (
    delete_profile_by_user_id,
    delete_user,
    get_profile_by_user_id,
    get_user_by_email,
    get_user_by_id,
    insert_profile,
    insert_user,
    list_users,
    update_user,
)
from core.security import hash_password, verify_password
from schemas.users import UserCreate, UserRole, UserUpdate
from tinydb import TinyDB


def utc_now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def to_user_response(record: dict) -> dict:
    return {
        "id": record["id"],
        "email": record["email"],
        "is_active": record["is_active"],
        "role": record["role"],
        "created_at": record["created_at"],
    }


def create_user(db: TinyDB, payload: UserCreate) -> dict:
    if get_user_by_email(db, payload.email):
        raise ValueError("Email already registered.")

    user = insert_user(
        db,
        {
            "email": payload.email,
            "hashed_password": hash_password(payload.password),
            "is_active": True,
            "role": UserRole.user.value,
            "created_at": utc_now_iso(),
        },
    )
    insert_profile(
        db,
        {
            "user_id": user["id"],
            "name": payload.name or "",
            "phone": payload.phone or "",
            "address": payload.address or "",
        },
    )
    return to_user_response(user)


def get_user(db: TinyDB, user_id: int) -> dict | None:
    record = get_user_by_id(db, user_id)
    if record is None:
        return None
    return to_user_response(record)


def get_users(db: TinyDB) -> list[dict]:
    return [to_user_response(record) for record in list_users(db)]


def get_user_record_by_email(db: TinyDB, email: str) -> dict | None:
    return get_user_by_email(db, email)


def authenticate_user(db: TinyDB, email: str, password: str) -> dict | None:
    user = get_user_by_email(db, email)
    if user is None or not user.get("is_active", True):
        return None
    if not verify_password(password, user["hashed_password"]):
        return None
    return user


def update_user_record(
    db: TinyDB, user_id: int, payload: UserUpdate
) -> dict | None:
    updates: dict[str, str] = {}
    if payload.email is not None:
        existing = get_user_by_email(db, payload.email)
        if existing and existing["id"] != user_id:
            raise ValueError("Email already registered.")
        updates["email"] = payload.email
    if payload.role is not None:
        updates["role"] = payload.role.value

    if not updates:
        record = get_user_by_id(db, user_id)
        return to_user_response(record) if record else None

    record = update_user(db, user_id, updates)
    return to_user_response(record) if record else None


def remove_user(db: TinyDB, user_id: int) -> bool:
    delete_profile_by_user_id(db, user_id)
    return delete_user(db, user_id)

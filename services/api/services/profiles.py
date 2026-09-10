from __future__ import annotations

from auth_database import get_profile_by_user_id, update_profile
from schemas.profiles import ProfileUpdate
from tinydb import TinyDB


def get_profile(db: TinyDB, user_id: int) -> dict | None:
    return get_profile_by_user_id(db, user_id)


def update_profile_record(
    db: TinyDB, user_id: int, payload: ProfileUpdate
) -> dict | None:
    profile = get_profile_by_user_id(db, user_id)
    if profile is None:
        return None

    updates = payload.model_dump(exclude_unset=True)
    if not updates:
        return profile

    return update_profile(db, profile["id"], updates)

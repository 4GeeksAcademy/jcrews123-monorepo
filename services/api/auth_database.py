from __future__ import annotations

import os
import uuid
from pathlib import Path
from typing import Any

from tinydb import Query, TinyDB

DEFAULT_AUTH_DB_PATH = Path(__file__).resolve().parent / "data" / "users.json"
USERS_TABLE = "users"
PROFILES_TABLE = "profiles"
RESET_TOKENS_TABLE = "reset_tokens"


def get_auth_db_path() -> Path:
    override = os.environ.get("USERS_DB_PATH")
    if override:
        return Path(override)
    return DEFAULT_AUTH_DB_PATH


def get_auth_db(db_path: Path | None = None) -> TinyDB:
    path = db_path or get_auth_db_path()
    path.parent.mkdir(parents=True, exist_ok=True)
    return TinyDB(path)


def document_to_dict(doc_id: int, document: dict[str, Any]) -> dict[str, Any]:
    return {"id": doc_id, **document}


def get_users_table(db: TinyDB) -> Any:
    return db.table(USERS_TABLE)


def get_profiles_table(db: TinyDB) -> Any:
    return db.table(PROFILES_TABLE)


def get_reset_tokens_table(db: TinyDB) -> Any:
    return db.table(RESET_TOKENS_TABLE)


def list_users(db: TinyDB) -> list[dict[str, Any]]:
    table = get_users_table(db)
    return [document_to_dict(doc.doc_id, dict(doc)) for doc in table]


def get_user_by_id(db: TinyDB, user_id: int) -> dict[str, Any] | None:
    table = get_users_table(db)
    document = table.get(doc_id=user_id)
    if document is None:
        return None
    return document_to_dict(user_id, dict(document))


def get_user_by_email(db: TinyDB, email: str) -> dict[str, Any] | None:
    table = get_users_table(db)
    User = Query()
    results = table.search(User.email == email.lower())
    if not results:
        return None
    for doc in results:
        return document_to_dict(doc.doc_id, dict(doc))
    return None


def insert_user(db: TinyDB, data: dict[str, Any]) -> dict[str, Any]:
    table = get_users_table(db)
    payload = {**data, "email": data["email"].lower()}
    if "uuid" not in payload:
        payload["uuid"] = str(uuid.uuid4())
    doc_id = table.insert(payload)
    return document_to_dict(doc_id, payload)


def ensure_user_uuid(db: TinyDB, user: dict[str, Any]) -> dict[str, Any]:
    if user.get("uuid"):
        return user
    user_uuid = str(uuid.uuid4())
    updated = update_user(db, user["id"], {"uuid": user_uuid})
    return updated or {**user, "uuid": user_uuid}


def update_user(
    db: TinyDB, user_id: int, updates: dict[str, Any]
) -> dict[str, Any] | None:
    table = get_users_table(db)
    if table.get(doc_id=user_id) is None:
        return None
    if "email" in updates:
        updates = {**updates, "email": updates["email"].lower()}
    table.update(updates, doc_ids=[user_id])
    return get_user_by_id(db, user_id)


def delete_user(db: TinyDB, user_id: int) -> bool:
    table = get_users_table(db)
    removed = table.remove(doc_ids=[user_id])
    return len(removed) > 0


def get_profile_by_user_id(db: TinyDB, user_id: int) -> dict[str, Any] | None:
    table = get_profiles_table(db)
    Profile = Query()
    results = table.search(Profile.user_id == user_id)
    if not results:
        return None
    for doc in results:
        return document_to_dict(doc.doc_id, dict(doc))
    return None


def insert_profile(db: TinyDB, data: dict[str, Any]) -> dict[str, Any]:
    table = get_profiles_table(db)
    doc_id = table.insert(data)
    return document_to_dict(doc_id, data)


def update_profile(
    db: TinyDB, profile_id: int, updates: dict[str, Any]
) -> dict[str, Any] | None:
    table = get_profiles_table(db)
    if table.get(doc_id=profile_id) is None:
        return None
    table.update(updates, doc_ids=[profile_id])
    document = table.get(doc_id=profile_id)
    if document is None:
        return None
    return document_to_dict(profile_id, dict(document))


def delete_profile_by_user_id(db: TinyDB, user_id: int) -> bool:
    table = get_profiles_table(db)
    Profile = Query()
    removed = table.remove(Profile.user_id == user_id)
    return len(removed) > 0

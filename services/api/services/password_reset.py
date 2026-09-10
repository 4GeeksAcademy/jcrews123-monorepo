from __future__ import annotations

import hashlib
import logging
import secrets
from datetime import datetime, timezone

import httpx

from auth_database import (
    get_reset_tokens_table,
    get_user_by_email,
    get_user_by_id,
    update_user,
)
from core.email_config import (
    get_frontend_reset_url,
    get_resend_api_key,
    get_resend_from_email,
    reset_expiry_iso,
)
from core.security import hash_password, verify_password
from tinydb import Query, TinyDB

logger = logging.getLogger(__name__)


def hash_reset_token(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


def create_reset_token(db: TinyDB, email: str) -> tuple[str, str] | None:
    user = get_user_by_email(db, email)
    if user is None:
        return None

    raw_token = secrets.token_urlsafe(32)
    token_hash = hash_reset_token(raw_token)
    table = get_reset_tokens_table(db)
    table.insert(
        {
            "token_hash": token_hash,
            "user_id": user["id"],
            "expires_at": reset_expiry_iso(),
            "used_at": None,
        }
    )
    reset_url = f"{get_frontend_reset_url()}?token={raw_token}"
    return raw_token, reset_url


def _find_active_token(db: TinyDB, token: str) -> dict | None:
    token_hash = hash_reset_token(token)
    table = get_reset_tokens_table(db)
    ResetToken = Query()
    results = table.search(ResetToken.token_hash == token_hash)
    if not results:
        return None
    for doc in results:
        return {"id": doc.doc_id, **dict(doc)}
    return None


def validate_reset_token(db: TinyDB, token: str) -> dict | None:
    record = _find_active_token(db, token)
    if record is None:
        return None
    if record.get("used_at"):
        return None

    expires_at = datetime.fromisoformat(record["expires_at"])
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        return None

    user = get_user_by_id(db, record["user_id"])
    if user is None:
        return None

    return {"token_record": record, "user": user}


def consume_reset_token(db: TinyDB, token: str, new_password: str) -> bool:
    validated = validate_reset_token(db, token)
    if validated is None:
        return False

    user = validated["user"]
    token_record = validated["token_record"]
    update_user(db, user["id"], {"hashed_password": hash_password(new_password)})

    table = get_reset_tokens_table(db)
    table.update({"used_at": datetime.now(timezone.utc).isoformat()}, doc_ids=[token_record["id"]])
    return True


def change_password(
    db: TinyDB, user_id: int, current_password: str, new_password: str
) -> bool:
    user = get_user_by_id(db, user_id)
    if user is None:
        return False
    if not verify_password(current_password, user["hashed_password"]):
        return False
    update_user(db, user_id, {"hashed_password": hash_password(new_password)})
    return True


def send_reset_email(to_email: str, reset_url: str) -> None:
    api_key = get_resend_api_key()
    if not api_key:
        raise RuntimeError("RESEND_API_KEY is not configured.")

    response = httpx.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "from": get_resend_from_email(),
            "to": [to_email],
            "subject": "Reset your Brasaland Digital password",
            "html": (
                "<p>You requested a password reset for Brasaland Digital.</p>"
                f'<p><a href="{reset_url}">Reset your password</a></p>'
                "<p>This link expires soon and can only be used once.</p>"
            ),
        },
        timeout=10.0,
    )
    if response.is_error:
        logger.warning(
            "Resend rejected password reset email to %s: %s",
            to_email,
            response.text,
        )
        response.raise_for_status()

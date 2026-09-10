from __future__ import annotations

import os
from datetime import datetime, timedelta, timezone


def get_reset_token_expire_minutes() -> int:
    raw = os.environ.get("RESET_TOKEN_EXPIRE_MINUTES", "30")
    return int(raw)


def get_frontend_reset_url() -> str:
    return os.environ.get(
        "FRONTEND_RESET_URL",
        "http://localhost:3001/reset-password",
    )


def get_resend_api_key() -> str | None:
    value = os.environ.get("RESEND_API_KEY")
    if not value:
        return None
    stripped = value.strip()
    return stripped or None


def get_resend_from_email() -> str:
    return os.environ.get("RESEND_FROM_EMAIL", "onboarding@resend.dev")


def reset_expiry_iso(minutes: int | None = None) -> str:
    window = minutes if minutes is not None else get_reset_token_expire_minutes()
    expires = datetime.now(timezone.utc) + timedelta(minutes=window)
    return expires.isoformat()

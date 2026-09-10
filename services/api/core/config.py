from __future__ import annotations

import os


def get_secret_key() -> str:
    secret = os.environ.get("SECRET_KEY")
    if not secret:
        raise RuntimeError("SECRET_KEY environment variable is required.")
    return secret


def get_access_token_expire_minutes() -> int:
    raw = os.environ.get("ACCESS_TOKEN_EXPIRE_MINUTES", "60")
    return int(raw)


JWT_ALGORITHM = "HS256"

from __future__ import annotations

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt
from passlib.hash import bcrypt

from core.config import JWT_ALGORITHM, get_access_token_expire_minutes, get_secret_key


def hash_password(password: str) -> str:
    return bcrypt.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.verify(plain_password, hashed_password)


def create_access_token(user_id: int) -> str:
    expire_minutes = get_access_token_expire_minutes()
    expire = datetime.now(timezone.utc) + timedelta(minutes=expire_minutes)
    payload = {"sub": str(user_id), "exp": expire}
    return jwt.encode(payload, get_secret_key(), algorithm=JWT_ALGORITHM)


def decode_access_token(token: str) -> int:
    try:
        payload = jwt.decode(token, get_secret_key(), algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise JWTError("Missing subject")
        return int(user_id)
    except (JWTError, ValueError) as exc:
        raise JWTError("Invalid token") from exc

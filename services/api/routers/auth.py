from __future__ import annotations

import logging
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from tinydb import TinyDB

from core.deps import get_auth_database, get_current_user
from core.security import create_access_token
from schemas.auth import AuthMeResponse, LoginRequest, TokenResponse
from schemas.password_reset import (
    ChangePasswordRequest,
    ForgotPasswordRequest,
    MessageResponse,
    ResetPasswordRequest,
)
from schemas.profiles import ProfileResponse
from schemas.users import UserRole
from services.password_reset import (
    change_password,
    consume_reset_token,
    create_reset_token,
    send_reset_email,
)
from services.profiles import get_profile
from services.users import authenticate_user

FORGOT_PASSWORD_MESSAGE = (
    "If that address is registered, you'll receive a reset link shortly."
)

logger = logging.getLogger("brasaland.api")

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=TokenResponse)
def login(
    payload: LoginRequest,
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> TokenResponse:
    user = authenticate_user(db, payload.email, payload.password)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    token = create_access_token(user["id"])
    return TokenResponse(access_token=token)


@router.get("/me", response_model=AuthMeResponse)
def auth_me(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> AuthMeResponse:
    profile = get_profile(db, current_user["id"])
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found.")

    return AuthMeResponse(
        email=current_user["email"],
        role=UserRole(current_user["role"]),
        profile=ProfileResponse.model_validate(profile),
    )


@router.post("/forgot-password", response_model=MessageResponse)
def forgot_password(
    payload: ForgotPasswordRequest,
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> MessageResponse:
    email = str(payload.email).strip().lower()
    result = create_reset_token(db, email)
    if result is None:
        logger.info("forgot-password: no registered user for %s", email)
        return MessageResponse(detail=FORGOT_PASSWORD_MESSAGE)

    _, reset_url = result
    try:
        logger.info("forgot-password: sending reset email to %s", email)
        send_reset_email(email, reset_url)
        logger.info("forgot-password: reset email accepted by Resend for %s", email)
        print(f"PASSWORD RESET EMAIL SENT: {email}", flush=True)
    except Exception as exc:
        logger.warning(
            "Password reset email could not be sent to %s: %s",
            email,
            exc,
        )
        logger.warning("Local dev reset link: %s", reset_url)
        print(f"PASSWORD RESET LINK: {reset_url}", flush=True)
    return MessageResponse(detail=FORGOT_PASSWORD_MESSAGE)


@router.post("/reset-password", response_model=MessageResponse)
def reset_password(
    payload: ResetPasswordRequest,
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> MessageResponse:
    if not consume_reset_token(db, payload.token, payload.new_password):
        raise HTTPException(status_code=400, detail="Invalid or expired reset token.")
    return MessageResponse(detail="Password updated successfully.")


@router.post("/change-password", response_model=MessageResponse)
def change_user_password(
    payload: ChangePasswordRequest,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> MessageResponse:
    if not change_password(
        db,
        current_user["id"],
        payload.current_password,
        payload.new_password,
    ):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")
    return MessageResponse(detail="Password updated successfully.")

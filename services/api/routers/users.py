from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from tinydb import TinyDB

from core.deps import get_auth_database, get_current_user, require_self_or_admin
from schemas.users import UserCreate, UserResponse, UserRole, UserUpdate
from services.users import create_user, get_user, get_users, remove_user, update_user_record

router = APIRouter(prefix="/users", tags=["users"])


@router.post("", response_model=UserResponse, status_code=201)
def register_user(
    payload: UserCreate,
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> UserResponse:
    try:
        user = create_user(db, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    return UserResponse.model_validate(user)


@router.get("", response_model=list[UserResponse])
def list_all_users(
    db: Annotated[TinyDB, Depends(get_auth_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> list[UserResponse]:
    _ = current_user
    return [UserResponse.model_validate(user) for user in get_users(db)]


@router.get("/{user_id}", response_model=UserResponse)
def get_single_user(
    user_id: int,
    db: Annotated[TinyDB, Depends(get_auth_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> UserResponse:
    require_self_or_admin(user_id, current_user)
    user = get_user(db, user_id)
    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return UserResponse.model_validate(user)


@router.put("/{user_id}", response_model=UserResponse)
def update_single_user(
    user_id: int,
    payload: UserUpdate,
    db: Annotated[TinyDB, Depends(get_auth_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> UserResponse:
    require_self_or_admin(user_id, current_user)

    if payload.role is not None and current_user.get("role") != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can change roles.",
        )

    try:
        user = update_user_record(db, user_id, payload)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    if user is None:
        raise HTTPException(status_code=404, detail="User not found.")
    return UserResponse.model_validate(user)


@router.delete("/{user_id}", status_code=200)
def delete_single_user(
    user_id: int,
    db: Annotated[TinyDB, Depends(get_auth_database)],
    current_user: Annotated[dict, Depends(get_current_user)],
) -> dict[str, str]:
    require_self_or_admin(user_id, current_user)
    if not remove_user(db, user_id):
        raise HTTPException(status_code=404, detail="User not found.")
    return {"detail": "User deleted."}

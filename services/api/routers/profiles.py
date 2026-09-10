from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException
from tinydb import TinyDB

from core.deps import get_auth_database, get_current_user
from schemas.profiles import ProfileResponse, ProfileUpdate
from services.profiles import get_profile, update_profile_record

router = APIRouter(prefix="/profiles", tags=["profiles"])


@router.get("/me", response_model=ProfileResponse)
def get_my_profile(
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> ProfileResponse:
    profile = get_profile(db, current_user["id"])
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return ProfileResponse.model_validate(profile)


@router.put("/me", response_model=ProfileResponse)
def update_my_profile(
    payload: ProfileUpdate,
    current_user: Annotated[dict, Depends(get_current_user)],
    db: Annotated[TinyDB, Depends(get_auth_database)],
) -> ProfileResponse:
    profile = update_profile_record(db, current_user["id"], payload)
    if profile is None:
        raise HTTPException(status_code=404, detail="Profile not found.")
    return ProfileResponse.model_validate(profile)

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.auth.google import GoogleUser
from app.models.profile import Profile, ProfileUpdate
from app.services.store import store

router = APIRouter(prefix="/profile", tags=["profile"])


@router.get("", response_model=Profile)
def get_profile(current_user: GoogleUser = Depends(get_current_user)) -> Profile:
    return store.get_profile(current_user)


@router.put("", response_model=Profile)
def update_profile(
    payload: ProfileUpdate,
    current_user: GoogleUser = Depends(get_current_user),
) -> Profile:
    return store.update_profile(current_user, Profile.model_validate(payload.model_dump()))

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.auth.google import GoogleUser
from app.models.settings import UserSettings, UserSettingsUpdate
from app.services.store import store

router = APIRouter(prefix="/settings", tags=["settings"])


@router.get("", response_model=UserSettings)
def get_settings(current_user: GoogleUser = Depends(get_current_user)) -> UserSettings:
    return store.get_settings(current_user)


@router.put("", response_model=UserSettings)
def update_settings(
    payload: UserSettingsUpdate,
    current_user: GoogleUser = Depends(get_current_user),
) -> UserSettings:
    return store.update_settings(current_user, UserSettings.model_validate(payload.model_dump()))

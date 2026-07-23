from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.auth.google import GoogleUser
from app.models.sync import SyncPayload
from app.services.store import store

router = APIRouter(prefix="/sync", tags=["sync"])


@router.get("", response_model=SyncPayload)
def get_sync(current_user: GoogleUser = Depends(get_current_user)) -> SyncPayload:
    data = store.get_sync(current_user)
    return SyncPayload(profile=data.profile, tasks=data.tasks, settings=data.settings)


@router.put("", response_model=SyncPayload)
def put_sync(
    payload: SyncPayload,
    current_user: GoogleUser = Depends(get_current_user),
) -> SyncPayload:
    data = store.put_sync(current_user, payload.profile, payload.tasks, payload.settings)
    return SyncPayload(profile=data.profile, tasks=data.tasks, settings=data.settings)

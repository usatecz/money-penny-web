from pydantic import BaseModel, Field

from app.models.profile import Profile
from app.models.settings import UserSettings
from app.models.task import Task


class SyncPayload(BaseModel):
    profile: Profile
    tasks: list[Task] = Field(default_factory=list)
    settings: UserSettings = Field(default_factory=UserSettings)

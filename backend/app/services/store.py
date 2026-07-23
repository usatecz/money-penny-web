from dataclasses import dataclass, field
from threading import Lock

from app.auth.google import GoogleUser
from app.models.profile import Profile
from app.models.settings import UserSettings
from app.models.task import Task, TaskCreate, TaskUpdate, new_task_id


def profile_from_google(user: GoogleUser) -> Profile:
    trimmed = user.name.strip()
    space_index = trimmed.find(" ")

    if space_index == -1:
        return Profile(
            name=trimmed,
            surname="",
            address="",
            email=user.email,
            phone="",
        )

    return Profile(
        name=trimmed[:space_index],
        surname=trimmed[space_index + 1 :].strip(),
        address="",
        email=user.email,
        phone="",
    )


@dataclass
class UserData:
    profile: Profile
    tasks: list[Task] = field(default_factory=list)
    settings: UserSettings = field(default_factory=UserSettings)


class InMemoryStore:
    def __init__(self) -> None:
        self._users: dict[str, UserData] = {}
        self._lock = Lock()

    def _get_or_create_user_data(self, user: GoogleUser) -> UserData:
        if user.sub not in self._users:
            self._users[user.sub] = UserData(profile=profile_from_google(user))
        return self._users[user.sub]

    def _ensure_user(self, user: GoogleUser) -> UserData:
        with self._lock:
            return self._get_or_create_user_data(user)

    def get_profile(self, user: GoogleUser) -> Profile:
        return self._ensure_user(user).profile

    def update_profile(self, user: GoogleUser, profile: Profile) -> Profile:
        with self._lock:
            data = self._get_or_create_user_data(user)
            data.profile = profile
            return data.profile

    def list_tasks(self, user: GoogleUser) -> list[Task]:
        return list(self._ensure_user(user).tasks)

    def get_task(self, user: GoogleUser, task_id: str) -> Task | None:
        data = self._ensure_user(user)
        for task in data.tasks:
            if task.id == task_id:
                return task
        return None

    def create_task(self, user: GoogleUser, payload: TaskCreate) -> Task:
        task = Task(id=new_task_id(), **payload.model_dump())
        with self._lock:
            data = self._get_or_create_user_data(user)
            data.tasks.append(task)
        return task

    def update_task(self, user: GoogleUser, task_id: str, payload: TaskUpdate) -> Task | None:
        with self._lock:
            data = self._get_or_create_user_data(user)
            for index, task in enumerate(data.tasks):
                if task.id != task_id:
                    continue
                updated = task.model_copy(
                    update={k: v for k, v in payload.model_dump(exclude_unset=True).items()}
                )
                data.tasks[index] = updated
                return updated
        return None

    def delete_task(self, user: GoogleUser, task_id: str) -> bool:
        with self._lock:
            data = self._get_or_create_user_data(user)
            original_length = len(data.tasks)
            data.tasks = [task for task in data.tasks if task.id != task_id]
            return len(data.tasks) != original_length

    def get_settings(self, user: GoogleUser) -> UserSettings:
        return self._ensure_user(user).settings

    def update_settings(self, user: GoogleUser, settings: UserSettings) -> UserSettings:
        with self._lock:
            data = self._get_or_create_user_data(user)
            data.settings = settings
            return data.settings

    def get_sync(self, user: GoogleUser) -> UserData:
        return self._ensure_user(user)

    def put_sync(self, user: GoogleUser, profile: Profile, tasks: list[Task], settings: UserSettings) -> UserData:
        with self._lock:
            self._users[user.sub] = UserData(profile=profile, tasks=list(tasks), settings=settings)
            return self._users[user.sub]


store = InMemoryStore()

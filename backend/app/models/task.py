from typing import Literal
from uuid import uuid4

from pydantic import BaseModel, Field

TaskPriority = Literal["low", "medium", "high"]
TaskStatus = Literal["pending", "in-progress", "completed"]


class Task(BaseModel):
    id: str
    reminderDay: str = ""
    startDay: str = ""
    deadline: str = ""
    priority: TaskPriority = "medium"
    title: str
    description: str = ""
    status: TaskStatus = "pending"
    tags: list[str] = Field(default_factory=list)


class TaskCreate(BaseModel):
    reminderDay: str = ""
    startDay: str = ""
    deadline: str = ""
    priority: TaskPriority = "medium"
    title: str = Field(min_length=1, max_length=500)
    description: str = Field(default="", max_length=5000)
    status: TaskStatus = "pending"
    tags: list[str] = Field(default_factory=list)


class TaskUpdate(BaseModel):
    reminderDay: str | None = None
    startDay: str | None = None
    deadline: str | None = None
    priority: TaskPriority | None = None
    title: str | None = Field(default=None, min_length=1, max_length=500)
    description: str | None = Field(default=None, max_length=5000)
    status: TaskStatus | None = None
    tags: list[str] | None = None


def new_task_id() -> str:
    return str(uuid4())

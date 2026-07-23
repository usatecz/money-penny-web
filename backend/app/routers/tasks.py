from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.auth.google import GoogleUser
from app.models.task import Task, TaskCreate, TaskUpdate
from app.services.store import store

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("", response_model=list[Task])
def list_tasks(current_user: GoogleUser = Depends(get_current_user)) -> list[Task]:
    return store.list_tasks(current_user)


@router.post("", response_model=Task, status_code=status.HTTP_201_CREATED)
def create_task(
    payload: TaskCreate,
    current_user: GoogleUser = Depends(get_current_user),
) -> Task:
    return store.create_task(current_user, payload)


@router.get("/{task_id}", response_model=Task)
def get_task(
    task_id: str,
    current_user: GoogleUser = Depends(get_current_user),
) -> Task:
    task = store.get_task(current_user, task_id)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.put("/{task_id}", response_model=Task)
def update_task(
    task_id: str,
    payload: TaskUpdate,
    current_user: GoogleUser = Depends(get_current_user),
) -> Task:
    task = store.update_task(current_user, task_id, payload)
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(
    task_id: str,
    current_user: GoogleUser = Depends(get_current_user),
) -> None:
    deleted = store.delete_task(current_user, task_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

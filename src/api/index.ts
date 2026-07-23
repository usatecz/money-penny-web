import type { Profile } from '../types/Profile'
import type { Settings } from '../types/Settings'
import type { Task } from '../types/Task'
import { apiFetch } from './client'

export {
  API_BASE_URL,
  ApiError,
  checkBackendHealth,
  getAuthToken,
  setAuthToken,
} from './client'

export interface SyncPayload {
  profile: Profile
  tasks: Task[]
  settings: Settings
}

const LOGIN_SYNC_TIMEOUT_MS = 15_000

export function fetchSync(options?: { timeoutMs?: number }): Promise<SyncPayload> {
  return apiFetch<SyncPayload>('/api/sync', {
    timeoutMs: options?.timeoutMs ?? LOGIN_SYNC_TIMEOUT_MS,
  })
}

export function updateProfile(profile: Profile): Promise<Profile> {
  return apiFetch<Profile>('/api/profile', {
    method: 'PUT',
    body: JSON.stringify(profile),
  })
}

export type TaskInput = Omit<Task, 'id'>

export function createTask(task: TaskInput): Promise<Task> {
  return apiFetch<Task>('/api/tasks', {
    method: 'POST',
    body: JSON.stringify(task),
  })
}

export function updateTask(id: string, task: TaskInput): Promise<Task> {
  return apiFetch<Task>(`/api/tasks/${id}`, {
    method: 'PUT',
    body: JSON.stringify(task),
  })
}

export function deleteTask(id: string): Promise<void> {
  return apiFetch<void>(`/api/tasks/${id}`, {
    method: 'DELETE',
  })
}

export function updateSettings(settings: Settings): Promise<Settings> {
  return apiFetch<Settings>('/api/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
}

export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ??
  'http://127.0.0.1:8000'

const DEFAULT_REQUEST_TIMEOUT_MS = 30_000
const HEALTH_CHECK_TIMEOUT_MS = 5_000

export interface ApiFetchOptions extends RequestInit {
  timeoutMs?: number
}

export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

function networkErrorMessage(err: unknown): string {
  if (err instanceof DOMException && err.name === 'AbortError') {
    return 'Request timed out. Check that the backend is running.'
  }

  if (err instanceof TypeError) {
    return 'Could not reach the backend. Check that it is running and CORS allows this origin.'
  }

  if (err instanceof Error) {
    return err.message
  }

  return 'Something went wrong.'
}

let authToken: string | null = null

export function setAuthToken(token: string | null) {
  authToken = token
}

export function getAuthToken() {
  return authToken
}

export async function checkBackendHealth(
  timeoutMs = HEALTH_CHECK_TIMEOUT_MS,
): Promise<void> {
  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
    })
    if (!response.ok) {
      throw new ApiError(response.status, 'Backend health check failed.')
    }
  } catch (err) {
    if (err instanceof ApiError) {
      throw err
    }
    throw new ApiError(0, networkErrorMessage(err))
  } finally {
    window.clearTimeout(timeoutId)
  }
}

export async function apiFetch<T>(
  path: string,
  options: ApiFetchOptions = {},
): Promise<T> {
  const { timeoutMs = DEFAULT_REQUEST_TIMEOUT_MS, ...fetchOptions } = options
  const headers = new Headers(fetchOptions.headers)
  headers.set('Content-Type', 'application/json')

  if (authToken) {
    headers.set('Authorization', `Bearer ${authToken}`)
  }

  const controller = new AbortController()
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs)

  let response: Response
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      headers,
      signal: controller.signal,
    })
  } catch (err) {
    throw new ApiError(0, networkErrorMessage(err))
  } finally {
    window.clearTimeout(timeoutId)
  }

  if (!response.ok) {
    let message = response.statusText
    try {
      const body = (await response.json()) as {
        detail?: string | Array<{ msg?: string; loc?: unknown[] }>
      }
      if (typeof body.detail === 'string') {
        message = body.detail
      } else if (Array.isArray(body.detail) && body.detail.length > 0) {
        message = body.detail
          .map((item) => item.msg ?? 'Validation error')
          .join('; ')
      }
    } catch {
      // keep statusText
    }
    throw new ApiError(response.status, message)
  }

  if (response.status === 204) {
    return undefined as T
  }

  return response.json() as Promise<T>
}

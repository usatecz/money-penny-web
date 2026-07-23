# Money Penny Backend

FastAPI sync API for user profile, tasks, and settings. Data is stored in memory (per Google user ID) and is lost when the process restarts.

## Prerequisites

- Python 3.12+
- Google OAuth 2.0 Web Client ID (same as the frontend `VITE_GOOGLE_CLIENT_ID`)

## Local development

1. Create a virtual environment and install dependencies:

   ```bash
   cd backend
   python -m venv .venv
   source .venv/bin/activate  # Windows: .venv\Scripts\activate
   pip install -r requirements.txt
   ```

2. Configure environment variables:

   ```bash
   cp .env.example .env
   ```

   Set `GOOGLE_CLIENT_ID` to the same client ID used by the frontend.

3. Run the API:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

4. Open [http://localhost:8000/docs](http://localhost:8000/docs) for interactive API docs.

## Authentication

Send the Google ID token from the frontend login in the `Authorization` header:

```http
Authorization: Bearer <google-id-token>
```

The backend validates the token with Google's public keys and scopes all data to the token's `sub` claim.

## API overview

| Method | Path | Description |
| ------ | ---- | ----------- |
| GET | `/health` | Health check (no auth) |
| GET | `/api/profile` | Get user profile |
| PUT | `/api/profile` | Update user profile |
| GET | `/api/tasks` | List tasks |
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/{task_id}` | Get one task |
| PUT | `/api/tasks/{task_id}` | Update task |
| DELETE | `/api/tasks/{task_id}` | Delete task |
| GET | `/api/settings` | Get settings |
| PUT | `/api/settings` | Update settings |
| GET | `/api/sync` | Bulk read profile, tasks, settings |
| PUT | `/api/sync` | Bulk replace profile, tasks, settings |

JSON field names use camelCase to match the frontend TypeScript types.

## Docker

From the repository root:

```bash
docker compose up --build backend
```

Or build and run the backend image directly:

```bash
docker build -t money-penny-backend ./backend
docker run --rm -p 8000:8000 \
  -e GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com \
  -e CORS_ORIGINS=http://localhost:5173 \
  money-penny-backend
```

## Azure Container Apps

- Expose port **8000**
- Set environment variables: `GOOGLE_CLIENT_ID`, `CORS_ORIGINS` (comma-separated frontend origins)
- Use `/health` for liveness/readiness probes
- Data is in-memory only; use persistent storage later for production

## Environment variables

| Variable | Description | Default |
| -------- | ----------- | ------- |
| `GOOGLE_CLIENT_ID` | Google OAuth web client ID | (required) |
| `CORS_ORIGINS` | Allowed frontend origins (comma-separated) | `http://localhost:5173` |
| `HOST` | Bind host | `0.0.0.0` |
| `PORT` | Bind port | `8000` |

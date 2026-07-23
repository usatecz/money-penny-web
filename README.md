# Money Penny Web

Monorepo with a React frontend and a FastAPI backend for syncing user profile, tasks, and settings.

- **Frontend** — React + Vite app at the repo root (`npm run dev`)
- **Backend** — FastAPI API in [`backend/`](backend/README.md) (profile, tasks, settings sync)

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm
- A Google Cloud OAuth 2.0 Client ID

## Google Cloud Console setup

Google Sign-In sends the browser’s **exact origin** (scheme + host + port). If that origin is missing from your OAuth client, you’ll see: *“The given origin is not allowed for the given client ID.”*

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or select an existing one).
3. Go to **APIs & Services** → **OAuth consent screen** and configure the consent screen (External is fine for development).
4. Go to **APIs & Services** → **Credentials**.
5. Open your **OAuth 2.0 Client ID** (type **Web application**) — or create one via **Create Credentials** → **OAuth client ID** → **Web application**.
6. Under **Authorized JavaScript origins**, add **both** of these (Google treats `localhost` and `127.0.0.1` as different origins):
   - `http://localhost:5173`
   - `http://127.0.0.1:5173`
7. Leave **Authorized redirect URIs** empty for this app (the `@react-oauth/google` button uses the ID token flow, not a redirect).
8. Click **Save**. Changes can take a few minutes to propagate.
9. Copy the **Client ID** (ends with `.apps.googleusercontent.com`) into `.env` as `VITE_GOOGLE_CLIENT_ID`.

**Use one URL in the browser:** open [http://localhost:5173](http://localhost:5173) (recommended). If you bookmark or type `http://127.0.0.1:5173` instead, that origin must also be listed above.

**Port must match:** this project pins the dev server to port `5173`. If Vite fails with “Port 5173 is already in use”, stop other dev servers before running `npm run dev` again — do not add alternate ports (5174, 5175, …) to Google unless you intentionally run on those ports.

## Local setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env
   ```

3. Set your Google OAuth client ID in `.env`:

   ```env
   VITE_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

   Do not commit `.env` — it is listed in `.gitignore`.

4. Start the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:5173](http://localhost:5173) and sign in with Google.

### Google sign-in console warning (harmless)

If login succeeds but the browser console shows:

`Cross-Origin-Opener-Policy policy would block the window.postMessage call.`

that message is expected with Google Identity Services popup mode. The dev/preview servers send `Cross-Origin-Opener-Policy: same-origin-allow-popups` (see `vite.config.ts`), which is the value Google recommends. The warning is emitted by Google's own `gsi/client` script while it probes COOP compatibility; it does not block the credential callback. No action is needed unless sign-in itself fails (blank popup, no callback).

## Backend (optional)

See [`backend/README.md`](backend/README.md) for local run and Docker instructions. Start the API with:

```bash
docker compose up --build backend
```

The API listens on [http://localhost:8000](http://localhost:8000). Set `VITE_API_BASE_URL=http://localhost:8000` in `.env` when wiring the frontend to the backend.

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start dev server         |
| `npm run build` | Production build         |
| `npm run preview` | Preview production build |
| `npm run lint`  | Run ESLint               |

## App behavior

- **Login page** — Google sign-in button; shows an error message if login fails.
- **Profile page** — Displays name, email, profile picture, and Google ID after successful login.
- **Logout** — Returns to the login page.

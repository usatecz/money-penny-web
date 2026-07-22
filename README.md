# Money Penny Web

A simple React web app with Google account sign-in. After login, it shows the signed-in user's name, email, profile picture, and Google ID.

## Prerequisites

- Node.js 18+ (20+ recommended)
- npm
- A Google Cloud OAuth 2.0 Client ID

## Google Cloud Console setup

1. Open [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (or select an existing one).
3. Go to **APIs & Services** → **OAuth consent screen** and configure the consent screen (External is fine for development).
4. Go to **APIs & Services** → **Credentials**.
5. Click **Create Credentials** → **OAuth client ID**.
6. Choose **Web application**.
7. Add authorized JavaScript origins:
   - `http://localhost:5173` (Vite dev server)
8. Copy the **Client ID** (ends with `.apps.googleusercontent.com`).

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

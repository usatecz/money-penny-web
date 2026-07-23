import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Required for @react-oauth/google popup sign-in (default ux_mode).
// See https://developers.google.com/identity/gsi/web/guides/get-google-api-clientid#cross_origin_opener_policy
//
// Chrome may still log "Cross-Origin-Opener-Policy policy would block the
// window.postMessage call" after a successful login. That warning comes from
// Google's gsi/client script (report-only COOP on accounts.google.com), not
// from a misconfigured app header. Safe to ignore when sign-in completes.
const googleSignInCoopHeaders = {
  'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    headers: googleSignInCoopHeaders,
  },
  preview: {
    headers: googleSignInCoopHeaders,
  },
})

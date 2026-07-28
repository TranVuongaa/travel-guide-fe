# Vạn Nẻo frontend

Frontend-only Next.js App Router application for the Vietnam Travel Guide API.

## Local setup

```powershell
Copy-Item .env.example .env.local
npm install
npm run dev
```

Open `http://localhost:3000`. The confirmed API base URL is:

```env
NEXT_PUBLIC_API_BASE_URL=http://52.62.25.92
```

The application preserves HTTP and does not configure HSTS, an HTTPS redirect, or
`upgrade-insecure-requests`. The backend must allow the frontend origin through CORS.

## Google OAuth

Google login and account linking remain unavailable until both variables are supplied:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-browser-client-id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

In Google Cloud Console:

1. Create an OAuth 2.0 Web application client.
2. Add the frontend origin, for example `http://localhost:3000`, to Authorized JavaScript origins.
3. Add the exact callback URL to Authorized redirect URIs.
4. Copy the client ID into `.env.local` and restart Next.js.

The frontend uses Authorization Code with PKCE in a popup. No Google client secret belongs in this repository.

## Checks

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

## Security notes

- Access and refresh tokens are held only in module memory.
- Reloading the page intentionally ends the local session.
- Route guards are UX only; the external API remains the authorization authority.
- Apple login and Apple account linking are not implemented.

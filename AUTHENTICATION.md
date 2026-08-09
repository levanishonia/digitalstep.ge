# Authentication and database operations

Digital Step runs its Vite frontend and Express API as one production service. Express handles `/api/*`, serves `dist`, and returns `index.html` only for non-API routes. During development, Vite proxies `/api` to the Express server on port 3000.

## Required environment variables

- `DATABASE_URL`: Railway PostgreSQL connection URL.
- `AUTH_SECRET`: a cryptographically random value of at least 32 characters used to sign sessions.
- `NODE_ENV=production`: enables secure cookies in production. Railway supplies `PORT`; it should not be configured manually.

Copy `.env.example` to an untracked `.env` for local development. Never commit credentials.

## Deployment

Use `npm run build` as the build command and `npm start` as the start command. Configure this safe Railway pre-deploy command:

```sh
npx prisma migrate deploy
```

The build generates Prisma Client, checks both TypeScript projects, and builds Vite. The server listens on `0.0.0.0` and Railway's `PORT`.

## Session security

Sessions are seven-day, signed HS256 tokens kept only in an `httpOnly` cookie. The cookie is `Secure` in production, `SameSite=Lax`, and scoped to `/`. Same-origin deployment and `SameSite=Lax` reduce CSRF exposure; no permissive CORS is enabled. Login and registration have a basic per-process rate limiter. A shared/distributed limiter is a recommended follow-up if the service scales to multiple replicas.

Passwords are hashed with bcryptjs at cost 12 for native-build-free Railway portability. API user projections explicitly omit `passwordHash`. Public validation accepts only `CUSTOMER` and `PROVIDER`; `ADMIN` cannot be registered publicly. Registration also requires literal terms acceptance, and the database records the acceptance timestamp for auditability.

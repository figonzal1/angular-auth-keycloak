# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Use `pnpm` as the package manager (not npm or yarn).

```bash
pnpm start      # Dev server at http://localhost:4200
pnpm build      # Production build
pnpm watch      # Build in watch mode (development config)
pnpm test       # Run tests with Vitest
pnpm lint       # ESLint on *.ts and *.html
pnpm format     # Prettier formatting

# Run a single test file or by name pattern:
pnpm test -- --reporter=verbose src/app/auth/auth.service.spec.ts
pnpm test -- --reporter=verbose -t "should login"
```

To start Keycloak + PostgreSQL locally:
```bash
docker compose up -d
```

## Architecture

Angular 21+ standalone components app implementing OIDC authentication via Keycloak.

**Auth flow:** Login → Keycloak (OIDC authorization code + PKCE) → `/callback` → Dashboard

### Key directories

- `src/app/auth/` — All authentication logic:
  - `auth.config.ts` — OIDC config factory (clientId, authority, scopes, silent renew)
  - `auth.service.ts` — Wrapper over `OidcSecurityService` with `login()`, `logout()`, `checkAuth()`, `isAuthenticated()`, `getAccessToken$()`, `getUserData$()`
  - `auth.guard.ts` — `CanActivateFn` that redirects unauthenticated users to `/login`
  - `auth.interceptor.ts` — `HttpInterceptorFn` that injects `Authorization: Bearer {token}` on all HTTP requests
- `src/app/components/` — Three pages: `login/`, `callback/` (handles OIDC redirect), `dashboard/` (protected)
- `src/environments/` — Dev and production environments with Keycloak URLs and `apiUrl`

### App bootstrap (`app.config.ts`)

Registers the router, HTTP client with `authInterceptor`, `OidcSecurityService` via `provideAuth(authConfig)`, and an `APP_INITIALIZER` that calls `authService.checkAuth()` on startup.

### Route structure (`app.routes.ts`)

```
/login      → LoginComponent (public)
/callback   → CallbackComponent (public, processes OIDC redirect)
/dashboard  → DashboardComponent (protected by authGuard)
/           → redirects to /login
```

### Environment config

Keycloak realm is `angular-auth-realm`, client is `angular-client` (public OIDC client). Update production URLs in `environment.production.ts` before deploying. Angular's file replacement swaps `environment.ts` for the appropriate file per build target.

### Technology stack

- Angular 21 standalone components with `inject()` functional DI
- `angular-auth-oidc-client` v21 for all OIDC operations
- RxJS with async pipe in templates (no manual subscriptions)
- TailwindCSS 4 for styling
- Vitest for testing
- ESLint with `@angular-eslint` (component selector prefix: `app-`, kebab-case)

### Keycloak setup (docker-compose)

- Keycloak: `http://localhost:8080`, admin credentials: `admin/admin`
- PostgreSQL on port `5432`, credentials: `keycloak/keycloak`
- Required realm config: redirect URIs `http://localhost:4200/*`, web origins `http://localhost:4200`

## Devcontainer

`.devcontainer/` configures a self-contained dev environment with:
- **mise** (`.mise.toml`) manages Node version — do not install it manually
- **corepack** (built into Node) manages pnpm — version pinned via `"packageManager"` in `package.json`
- **Docker-in-Docker** via `ghcr.io/devcontainers/features/docker-in-docker:2` (moby:false, compose v2)
  — chosen over DooD so each developer gets an isolated Docker daemon; Keycloak + Postgres
  run inside the devcontainer and are cleaned up with it
- pnpm store persisted in a named volume `pnpm-store` at `/home/vscode/.pnpm-store`
- Ports forwarded: `4200` (Angular, auto-open) and `8080` (Keycloak, notify)

## Gotchas

**Auth interceptor applies to all outgoing HTTP requests.** If you add calls to third-party APIs that should not receive the Bearer token, filter by URL inside `src/app/auth/auth.interceptor.ts` before attaching the header.

**Adding a new protected route:** import `authGuard` in `app.routes.ts` and add `canActivate: [authGuard]` to the route definition.

**Keycloak runs in production mode (`start`, not `start-dev`).** This requires a healthy Postgres connection. The `depends_on` healthcheck handles startup ordering. Do not switch to `start-dev` unless you also remove the `KC_DB_*` env vars — it will fail trying to connect to Postgres with dev defaults.

**SonarQube analysis:** `sonar-project.properties` is configured for `http://localhost:9000`. Run SonarQube locally via Docker to use it; no `pnpm` script exists for it yet.

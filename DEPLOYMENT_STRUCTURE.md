# Deployment and Structure Guide

This project is organized as a full-stack app with clear boundaries:

- `client/`: frontend UI (React + Vite)
- `server/`: backend API and realtime runtime (Express + tRPC + WS)
- `shared/`: shared types/constants used by both client and server
- `drizzle/`: SQL schema and migrations
- `nginx/`: reverse-proxy config for public URL deployments
- `supabase/`: Supabase local/project config

## Backend Ownership Rules

- Put API routes, auth, DB access, queue/realtime, and integrations only in `server/`.
- Keep browser/UI logic only in `client/`.
- Shared DTOs and constants that are used by both sides should go in `shared/`.
- Do not import `client/*` from `server/*`.

## Production Environment

Minimum required backend env values:

- `NODE_ENV=production`
- `PORT=3000`
- `APP_BASE_URL=https://your-public-domain`
- `CORS_ORIGIN=https://your-frontend-domain` (same as `APP_BASE_URL` if single-domain)
- `JWT_SECRET=<long-random-secret>`
- `DATABASE_URL=<postgres-connection-string>`
- `DB_STRATEGY=postgres`

Optional but recommended:

- `REDIS_URL=redis://redis:6379`
- `VITE_APP_ID=<app-id>`

## Public URL Deployment (Docker Compose)

1. Fill `.env` with production values (especially `APP_BASE_URL`, `CORS_ORIGIN`, `JWT_SECRET`, `DATABASE_URL`).
2. Start services:

```bash
docker compose up -d --build
```

3. Verify health:

- `GET /healthz` should return `200`.
- `GET /readyz` should return `200` when required env values are configured.

4. Point your domain DNS to the server, then place TLS (Cloudflare or certbot/Nginx TLS) in front of port `8080`/`80`.

## Operations Checks

- API health endpoint: `/healthz`
- Readiness endpoint: `/readyz`
- Websocket path: `/ws`

For stable production usage, run this behind a proper TLS terminator and enable monitoring on `/healthz`.

## GitHub + My Docker Flow

This repo includes GitHub Actions workflow:

- `.github/workflows/docker-release.yml`
- Trigger: push to `main` or manual run
- Output image: `DOCKERHUB_USERNAME/ai-command-center-mm:latest`

Required GitHub repository secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Server deploy command example:

```bash
docker pull <your-dockerhub-username>/ai-command-center-mm:latest
docker compose up -d
```

Important: set real production domain in env before deploy:

- `APP_BASE_URL=https://your-real-domain.com`
- `CORS_ORIGIN=https://your-real-domain.com`

## TLS + DNS Cutover Checklist (Cloudflare + Nginx)

1. Prepare DNS:
- Create `A` record: `@ -> <server_public_ip>`.
- Create `A` record: `www -> <server_public_ip>` (optional).
- Set proxy mode to `DNS only` during first TLS validation.

2. Install TLS cert on Nginx host:
- If using certbot:
  - `sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com`
- Confirm auto-renew:
  - `sudo certbot renew --dry-run`

3. Update app env:
- `APP_BASE_URL=https://yourdomain.com`
- `CORS_ORIGIN=https://yourdomain.com`
- `NODE_ENV=production`

4. Redeploy stack:
- `docker compose up -d --build`

5. Verify endpoints over HTTPS:
- `https://yourdomain.com/healthz` => `200`
- `https://yourdomain.com/readyz` => `200`

6. Enable Cloudflare proxy:
- Switch DNS records to `Proxied` (orange cloud).
- Set SSL/TLS mode to `Full (strict)`.

7. Post-cutover validation:
- Login/session cookie works over HTTPS.
- WebSocket path `/ws` connects.
- Error logs and latency are normal for at least 15 minutes.

# WORKFLOW_RULES

This file is the project operating manual for current and future chats.

## 1) Primary Goal

- Build and maintain a real, stable, production-ready system.
- Keep backend concerns in backend, frontend concerns in frontend.
- Deploy via Docker and GitHub Actions to public URL with HTTPS.

## 2) Project Boundaries

- `client/` = frontend only
- `server/` = backend API, auth, DB, realtime, integrations
- `shared/` = shared types/constants only
- `drizzle/` = schema + migrations
- `nginx/` = reverse proxy config

Rules:

- Do not put backend logic in `client/`.
- Do not import `client/*` from `server/*`.
- Shared DTO/constants go to `shared/`.

## 3) Deployment Standard (GitHub + Docker Hub)

- CI/CD workflow file: `.github/workflows/docker-release.yml`
- Trigger: push to `main` (and manual run)
- Image target: `<DOCKERHUB_USERNAME>/ai-command-center-mm:latest`

Required GitHub Secrets:

- `DOCKERHUB_USERNAME`
- `DOCKERHUB_TOKEN`

Required production env:

- `NODE_ENV=production`
- `APP_BASE_URL=https://<real-domain>`
- `CORS_ORIGIN=https://<real-domain>`
- `DATABASE_URL=<postgres-url>`
- `JWT_SECRET=<long-random-secret>`
- `REDIS_URL=redis://redis:6379` (or managed Redis URL)

## 4) Health and Readiness Policy

- `/healthz` must return HTTP 200 when process is alive.
- `/readyz` must return HTTP 200 only when:
- DB is configured and ping successful.
- Redis is configured and ping successful.
- Required auth secret is configured.

If any check fails, `/readyz` returns 503.

## 5) Branch Protection Baseline (main)

Enable classic branch protection on `main`:

- Require pull request before merging.
- Require at least 1 approval.
- Dismiss stale approvals on new commits.
- Require status checks to pass.
- Require branch up-to-date before merging.
- Do not allow force pushes.
- Do not allow deletions.

Note:

- If status check is not visible yet, run the workflow once from `Actions` tab, then select it.

## 6) Secret Handling Rules (Critical)

- Never paste tokens/passwords/keys into chat, code, commits, or docs.
- If a token is exposed, revoke immediately and create a new one.
- Store secrets only in:
- GitHub Actions Secrets
- Server `.env` (not committed)
- Secret managers (if available)

Never commit real `.env` values.

## 7) Local-to-Production Execution Order

1. Update code
2. Typecheck/tests pass
3. Commit to feature branch
4. Open PR to `main`
5. Wait for green checks
6. Merge PR
7. GitHub Actions builds/pushes Docker image
8. Server pulls latest image and deploys
9. Verify `https://<domain>/healthz` and `/readyz`
10. Monitor logs and websocket behavior

## 8) Coding Style and Safety

- Make small, reviewable commits.
- Prefer clear structure over clever shortcuts.
- Keep production-safe defaults.
- Add short docs when behavior changes.
- Do not use destructive git commands unless explicitly requested.

## 9) Do / Don’t Quick List

Do:

- Keep backend/frontend separation strict.
- Validate deploy with health/readiness endpoints.
- Use PR + protected `main`.
- Use HTTPS public domain for production.

Don’t:

- Don’t hardcode secrets.
- Don’t force push `main`.
- Don’t bypass failed status checks.
- Don’t deploy without setting `APP_BASE_URL` and `CORS_ORIGIN`.

## 10) Future Chat Instruction

At start of any new chat, provide this instruction:

"Please follow `WORKFLOW_RULES.md` in this repo as the system workflow and deployment policy."

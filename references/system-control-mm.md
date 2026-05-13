# AI Company OS Control Guide (Myanmar)

## 1) DB Strategy (Finalized)

ဒီ codebase အတွက် default strategy ကို `postgres` သတ်မှတ်ထားပါတယ်။

- `DB_STRATEGY=postgres` (default)
- `DATABASE_URL` မှာ Supabase PostgreSQL URL ထည့်ပါ
- transitional compatibility အတွက် legacy MySQL code တွေကိုထားပြီး, core new services တွေကို postgres-first direction နဲ့တည်ဆောက်ထားပါတယ်

Config file:
- `server/platform/dbStrategy.ts`

## 2) Realtime Backbone

WebSocket server ကို app server နဲ့တစ်ပြိုင်နက် register လုပ်ထားပါတယ်။

- WS endpoint: `/ws`
- event publisher: `publishRealtimeEvent(channel, type, payload)`
- channels: `agent`, `workflow`, `notification`, `integration`, `system`

Files:
- `server/platform/realtime.ts`
- `server/_core/index.ts`
- `server/realtime/router.ts`

## 3) Queue Backbone (Redis + BullMQ)

Agent execution jobs အတွက် queue layer ထည့်ထားပါတယ်။

- Redis ရှိရင် BullMQ mode
- Redis မရှိရင် inline fallback mode (dev-friendly)

File:
- `server/platform/queue.ts`

Env:
- `REDIS_URL=redis://host:6379`

## 4) Agent Run Engine (Plan / Execute / Report + Memory)

run lifecycle:
- queued
- planning
- running
- reporting
- completed

memory kinds:
- conversation
- task
- knowledge
- profile

Files:
- `server/agents/engine.ts`
- `server/agents/memory.ts`
- `server/agents/router.ts`

## 5) Integrations Connectors

connector framework ထည့်ပြီး provider list/ping API ရပါတယ် (mock connectors အဆင့်)။

providers:
- telegram
- gmail
- google_drive
- notion
- shopify
- youtube
- tiktok

Files:
- `server/integrations/connectors.ts`
- `server/integrations/router.ts`

## 6) Deployment

deployment baseline files:
- `Dockerfile`
- `docker-compose.yml`
- `nginx/default.conf`

compose services:
- `api`
- `redis`
- `nginx`

## 7) API Control Endpoints (tRPC)

new routers:
- `agentRuns.list`
- `agentRuns.start`
- `agentRuns.executeNow`
- `agentRuns.memory`
- `realtime.ping`
- `integrations.list`
- `integrations.ping`

## 8) Run Commands

local check:
```bash
pnpm run check
```

dev start:
```bash
pnpm dev
```

docker start:
```bash
docker compose up --build
```

## 9) Required Env (Minimum)

```env
DB_STRATEGY=postgres
DATABASE_URL=postgresql://...
REDIS_URL=redis://localhost:6379
JWT_SECRET=...
```


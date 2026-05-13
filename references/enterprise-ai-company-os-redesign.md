# Enterprise AI Company OS Redesign

ဒီ document က လက်ရှိ dashboard/demo project ကို production-grade AI Agent Company OS အဖြစ်တက်နိုင်ဖို့ target architecture ဖြစ်ပါတယ်။ လက်ရှိ UI modules တွေကို မဖျက်ဘဲ backend orchestration, realtime execution, memory, queue, integrations layer တွေနဲ့ ချိတ်ဆက်သွားမယ်။

## Current State

လက်ရှိ project မှာ အခြေခံ foundation က မဆိုးပါဘူး။

- Frontend: Vite, React, tRPC client, module-based dashboard UI
- Backend: Express, tRPC, protected procedures, Manus OAuth context
- Database: Drizzle schema, current MySQL dialect tables
- Existing domain tables: users, agents, activityFeed, videos, notes, researchData, designReviews, withdrawalRequests
- Strongest part: module UI, dashboard layout, product direction
- Weakest part: real agent execution, queue, websocket, long-term memory, integration workers, production auth/permissions

## Target System

Target architecture:

```text
Client React App
  |
  | tRPC HTTP + WebSocket stream
  v
API Gateway / Express App
  |
  |-- Auth + RBAC + API keys
  |-- Realtime event gateway
  |-- Agent orchestration API
  |-- Integration API
  |
  v
Application Services
  |
  |-- Agent Brain Service
  |-- Workflow Engine
  |-- Memory Service
  |-- Tool Registry
  |-- Integration Connectors
  |-- Notification Service
  |
  v
Infrastructure
  |
  |-- PostgreSQL or MySQL primary DB
  |-- Redis cache + pub/sub
  |-- BullMQ task queue
  |-- Qdrant/Pinecone vector DB
  |-- Object storage: Cloudflare R2/S3
```

Recommended migration path: keep Express + tRPC for now, then add service folders and workers around it. Replace database engine only if production hosting requires it; PostgreSQL is better for SaaS analytics and JSON workloads, but current Drizzle MySQL schema can evolve first.

## Production Folder Structure

```text
client/
  src/
    components/modules/
    components/realtime/
    features/
      agents/
      workflows/
      memory/
      integrations/
      billing/
    hooks/
    lib/

server/
  app.ts
  routers.ts
  db.ts
  auth/
    permissions.ts
    apiKeys.ts
    sessions.ts
  agents/
    brain.ts
    orchestrator.ts
    modelRouter.ts
    prompts.ts
    toolRegistry.ts
  workflows/
    engine.ts
    planner.ts
    executor.ts
    reporter.ts
  memory/
    shortTerm.ts
    longTerm.ts
    embeddings.ts
    retrieval.ts
  realtime/
    websocket.ts
    events.ts
    presence.ts
  queue/
    bullmq.ts
    jobs.ts
    workers.ts
  integrations/
    telegram.ts
    discord.ts
    gmail.ts
    googleDrive.ts
    notion.ts
    stripe.ts
    shopify.ts
    tiktok.ts
    youtube.ts
  observability/
    logger.ts
    metrics.ts
    audit.ts
  storage/
    objectStorage.ts
    signedUrls.ts

workers/
  agentWorker.ts
  integrationWorker.ts
  scheduledWorker.ts

shared/
  contracts/
    agents.ts
    workflows.ts
    memory.ts
    realtime.ts
```

## Core Backend Upgrades

### Authentication

Keep current Manus OAuth, but formalize user identity into:

- session auth for web app users
- API key auth for external automation
- service token auth for internal workers
- organization membership for SaaS teams

### Roles And Permissions

Use role-based access control first:

- owner: billing, users, API keys, destructive settings
- admin: manage agents, workflows, integrations
- operator: run workflows, review outputs
- viewer: read dashboards and reports

Later add permission flags:

- agents.run
- workflows.write
- integrations.connect
- billing.manage
- memory.delete
- apiKeys.manage

### API Keys

API keys should be hashed before storage. Never store raw keys after creation.

Suggested table:

```text
apiKeys
- id
- userId
- organizationId
- name
- keyHash
- prefix
- scopes
- lastUsedAt
- expiresAt
- revokedAt
- createdAt
```

### Agent Memory

Memory should be split by purpose:

- short-term memory: current run state, Redis, expires fast
- conversation memory: chat/user interaction history
- task memory: completed agent runs and decisions
- knowledge memory: notes, documents, extracted facts, embeddings
- user profile memory: preferences, business goals, channels, constraints

Memory retrieval flow:

```text
User task
  -> classify intent
  -> fetch user/org profile
  -> retrieve relevant task memory
  -> retrieve vector knowledge
  -> build model context
  -> execute agent
  -> store run trace + summary
  -> embed useful outputs
```

### Task Queue

Use BullMQ for all work that can outlive one HTTP request:

- research crawl
- video generation
- image generation
- content scheduling
- competitor scan
- email summarization
- workflow execution
- integration sync
- embedding generation

Queue naming:

```text
agent.execute
agent.plan
agent.report
memory.embed
integration.sync
media.generate
notification.send
```

### Realtime Layer

Use WebSocket for:

- AI thinking stream
- token streaming
- task status changes
- live agent execution logs
- notifications
- multi-user presence

Event shape:

```ts
type RealtimeEvent = {
  id: string;
  organizationId: number;
  userId?: number;
  channel: "agent" | "workflow" | "notification" | "presence";
  type: string;
  payload: unknown;
  createdAt: string;
};
```

Client subscribes by organization and workflow/agent run id.

## Database Expansion

Minimum enterprise schema expansion:

```text
organizations
organizationMembers
apiKeys

agentDefinitions
agentRuns
agentRunSteps
agentTools
agentToolCalls

workflows
workflowRuns
workflowSteps
workflowApprovals

memories
memoryDocuments
memoryChunks
memoryEmbeddings

integrationAccounts
integrationEvents
integrationSyncJobs

notifications
auditLogs
usageEvents
billingSubscriptions
```

Important fields:

- every business table should include organizationId
- agent runs should store status, input, output, error, token usage, cost, duration
- tool calls should store tool name, sanitized input, sanitized output, success/failure
- audit logs should capture userId, action, resource type, resource id, ip, user agent

## Multi-Model Agent Brain

The agent brain should not call one model directly from UI routes. Put all model selection behind a model router.

```text
Agent Brain
  |
  |-- Model Router
  |     |-- OpenAI
  |     |-- Claude
  |     |-- Gemini
  |     |-- Local LLM
  |
  |-- Memory Retrieval
  |-- Tool Calling
  |-- Safety Policy
  |-- Cost/Latency Policy
```

Model routing rules:

- planning: strongest reasoning model
- summarization: cheaper fast model
- extraction: structured-output model
- image/video prompts: creative model
- local/private tasks: local LLM when possible

## Autonomous Workflow Pipeline

Every serious agent run should follow this lifecycle:

```text
intake
  -> classify
  -> retrieve memory
  -> plan
  -> request approval if risky
  -> execute steps
  -> call tools
  -> stream progress
  -> verify output
  -> write report
  -> store memory
  -> notify user
```

Run states:

```text
queued
planning
waiting_for_approval
running
blocked
completed
failed
cancelled
```

## AI Department Mapping

### ResearchLab

Production role:

- web research
- trend analysis
- competitor scanning
- market opportunity reports

Backend services:

- research workflow templates
- source scraper/connectors
- summarization agent
- insight memory writer

### WarRoom

Production role:

- command center for all agents
- live task execution
- strategy planning
- approvals

Backend services:

- agent run list
- live websocket execution logs
- approval queue
- system health

### MediaBay

Production role:

- content calendar
- image/video generation
- channel scheduling
- asset library

Backend services:

- media.generate queue
- object storage
- TikTok/YouTube/Instagram connectors
- approval gates before publishing

### FactoryRoom

Production role:

- automation pipeline builder
- product generation
- store sync
- fulfillment automations

Backend services:

- workflow builder
- Shopify/Printify/Printful connectors
- scheduled jobs
- retry and rollback policy

### RevenueD

Production role:

- revenue analytics
- monetization tracking
- billing
- ROI per agent/workflow

Backend services:

- usage events
- payment provider integration
- store analytics imports
- cost tracking per model and workflow

### CommunicationHub

Production role:

- unified inbox
- AI response drafting
- customer support routing
- escalation to human

Backend services:

- Gmail/Telegram/Discord/WhatsApp connectors
- inbox sync jobs
- reply generation agent
- sentiment and priority classifier

### FeedbackLoop

Production role:

- review queue
- human approval
- quality control
- continuous improvement

Backend services:

- approval workflow
- output ratings
- rejection reasons
- prompt/workflow improvement memory

## Integrations Strategy

Build connectors with the same interface:

```ts
type IntegrationConnector = {
  provider: string;
  connect(input: unknown): Promise<unknown>;
  sync(accountId: number): Promise<unknown>;
  send?(accountId: number, payload: unknown): Promise<unknown>;
  disconnect(accountId: number): Promise<void>;
};
```

First integrations to implement:

1. Telegram bot: easiest realtime external command surface
2. Gmail: high-value communication automation
3. Google Drive: document knowledge ingestion
4. Notion: workspace memory and reports
5. Stripe: SaaS billing
6. YouTube/TikTok: media publishing and analytics
7. Shopify: commerce automation

## Security Requirements

Production rules:

- hash API keys
- encrypt OAuth tokens and provider credentials
- never send secrets to the client
- store real-money and publishing actions in audit logs
- require approval for withdrawals, external publish, bulk messaging, destructive workflow actions
- rate-limit auth, agent execution, and public API routes
- redact secrets from agent tool logs
- use scoped API keys
- add organization-level tenant isolation

## Deployment Architecture

Lean production setup:

```text
Frontend: Vercel
Backend API: Railway / Render / Fly.io
Workers: Railway / Fly.io
DB: Neon / Supabase / PlanetScale / RDS
Redis: Upstash / Railway Redis
Vector DB: Qdrant Cloud / Pinecone
Storage: Cloudflare R2 / S3
CDN/Nginx: Cloudflare
```

Enterprise setup:

```text
Frontend CDN
  -> Nginx/API Gateway
  -> API containers
  -> Worker containers
  -> Managed PostgreSQL
  -> Redis cluster
  -> Vector DB
  -> Object storage
  -> Observability stack
```

## Build Phases

### Phase 1: Core Backend Foundation

- Add organizations and membership
- Add RBAC helper
- Add API key table and auth path
- Add audit logs
- Add service folders
- Add queue abstraction
- Add realtime event contract

### Phase 2: Agent Execution Engine

- Add agentDefinitions, agentRuns, agentRunSteps
- Build Agent Brain service
- Build model router interface
- Add workflow lifecycle states
- Add run reporting
- Wire WarRoom to live agent run data

### Phase 3: Memory System

- Add memory tables
- Add memory service
- Add embeddings queue
- Add vector DB adapter
- Wire Archives to knowledge memory
- Add retrieval to agent runs

### Phase 4: Realtime System

- Add websocket server
- Add Redis pub/sub
- Add client realtime hooks
- Stream token output and execution events
- Add notifications table and UI

### Phase 5: Integrations And Automation

- Add integrationAccounts and encrypted token storage
- Add Telegram connector
- Add Gmail connector
- Add Google Drive ingestion
- Add media/channel publishing queue
- Add approval gates

### Phase 6: Production SaaS

- Add usage events
- Add Stripe billing
- Add organization settings
- Add deployment Dockerfile and compose
- Add health checks
- Add observability
- Add backup and disaster recovery process

## First Implementation Slice

The first coding slice should be deliberately small:

1. Add database schema for organizations, memberships, apiKeys, auditLogs, agentDefinitions, agentRuns, agentRunSteps, notifications.
2. Add shared contracts for agent run status and realtime events.
3. Add server services for audit logging and agent run creation.
4. Add tRPC router for starting/listing agent runs.
5. Update WarRoom to display real agent runs instead of only agent cards/activityFeed.

That turns the app from "dashboard that displays agents" into "dashboard that starts and tracks real work."


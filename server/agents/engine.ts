import { enqueueJob } from "../platform/queue";
import { publishRealtimeEvent } from "../platform/realtime";
import { writeMemory } from "./memory";

export type AgentRunStatus =
  | "queued"
  | "planning"
  | "running"
  | "reporting"
  | "completed"
  | "failed";

export type AgentRun = {
  id: string;
  userId: number;
  goal: string;
  status: AgentRunStatus;
  plan: string[];
  report?: string;
  createdAt: string;
  updatedAt: string;
};

const runs: AgentRun[] = [];

function nowIso() {
  return new Date().toISOString();
}

function createPlan(goal: string): string[] {
  return [
    `Research context for: ${goal}`,
    "Build execution checklist",
    "Execute tool/actions",
    "Summarize outcomes and next actions",
  ];
}

export async function startAgentRun(userId: number, goal: string) {
  const run: AgentRun = {
    id: `run-${Date.now()}`,
    userId,
    goal,
    status: "queued",
    plan: [],
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };

  runs.unshift(run);
  publishRealtimeEvent("agent", "run.queued", run);

  const queued = await enqueueJob("agent.run", { runId: run.id, userId, goal });
  return { run, queued };
}

export async function executeAgentRunInline(runId: string) {
  const run = runs.find(r => r.id === runId);
  if (!run) throw new Error(`Run not found: ${runId}`);

  run.status = "planning";
  run.plan = createPlan(run.goal);
  run.updatedAt = nowIso();
  publishRealtimeEvent("agent", "run.planning", run);

  run.status = "running";
  run.updatedAt = nowIso();
  publishRealtimeEvent("agent", "run.running", run);

  const report = [
    `Goal: ${run.goal}`,
    `Plan steps: ${run.plan.length}`,
    "Execution completed with scaffold mode",
    "Next: connect real tools + external connectors",
  ].join("\n");

  run.status = "reporting";
  run.report = report;
  run.updatedAt = nowIso();
  publishRealtimeEvent("agent", "run.reporting", run);

  await writeMemory({
    userId: run.userId,
    kind: "task",
    content: `Run ${run.id} completed. ${report}`,
  });

  run.status = "completed";
  run.updatedAt = nowIso();
  publishRealtimeEvent("agent", "run.completed", run);
  return run;
}

export async function listAgentRuns(userId: number) {
  return runs.filter(r => r.userId === userId);
}


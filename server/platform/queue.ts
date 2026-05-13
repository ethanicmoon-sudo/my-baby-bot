import { Queue } from "bullmq";
import IORedis from "ioredis";

type Json = Record<string, unknown>;

const redisUrl = process.env.REDIS_URL || "";
const redisConnection = redisUrl ? new IORedis(redisUrl, { maxRetriesPerRequest: null }) : null;

const queue = redisConnection
  ? new Queue("agent-execution", {
      connection: redisConnection,
    })
  : null;

export function isRedisConfigured() {
  return Boolean(redisUrl);
}

export async function pingRedis(): Promise<boolean> {
  if (!redisConnection) return false;
  try {
    const result = await redisConnection.ping();
    return result === "PONG";
  } catch {
    return false;
  }
}

export async function enqueueJob(name: string, data: Json) {
  if (!queue) {
    return {
      mode: "inline-fallback",
      id: `inline-${Date.now()}`,
      name,
      data,
    } as const;
  }

  const job = await queue.add(name, data, {
    removeOnComplete: 500,
    removeOnFail: 500,
  });

  return {
    mode: "bullmq",
    id: String(job.id),
    name,
    data,
  } as const;
}

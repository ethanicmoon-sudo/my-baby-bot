import { z } from "zod";
import { getBinanceStatus } from "../binance";
import { getDb } from "../db";
import { getDbStrategy } from "../platform/dbStrategy";
import { notifyOwner } from "./notification";
import { adminProcedure, protectedProcedure, publicProcedure, router } from "./trpc";

export const systemRouter = router({
  health: publicProcedure
    .input(
      z.object({
        timestamp: z.number().min(0, "timestamp cannot be negative"),
      })
    )
    .query(() => ({
      ok: true,
    })),

  notifyOwner: adminProcedure
    .input(
      z.object({
        title: z.string().min(1, "title is required"),
        content: z.string().min(1, "content is required"),
      })
    )
    .mutation(async ({ input }) => {
      const delivered = await notifyOwner(input);
      return {
        success: delivered,
      } as const;
    }),
  readiness: protectedProcedure.query(async () => {
    const db = await getDb();
    const dbConfigured = Boolean(process.env.DATABASE_URL);
    const redisConfigured = Boolean(process.env.REDIS_URL);
    const authConfigured = Boolean(process.env.JWT_SECRET && process.env.OAUTH_SERVER_URL && process.env.VITE_APP_ID);
    const storageConfigured = Boolean(process.env.BUILT_IN_FORGE_API_URL && process.env.BUILT_IN_FORGE_API_KEY);
    const binance = getBinanceStatus();

    return {
      checkedAt: new Date().toISOString(),
      db: {
        strategy: getDbStrategy(),
        configured: dbConfigured,
        connected: Boolean(db),
      },
      redis: {
        configured: redisConfigured,
      },
      auth: {
        configured: authConfigured,
      },
      storage: {
        configured: storageConfigured,
      },
      binance,
      websocket: {
        endpoint: "/ws",
      },
    };
  }),
});

import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { executeAgentRunInline, listAgentRuns, startAgentRun } from "./engine";
import { readMemory } from "./memory";

export const agentRunRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return listAgentRuns(ctx.user.id);
  }),
  start: protectedProcedure
    .input(
      z.object({
        goal: z.string().min(3),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return startAgentRun(ctx.user.id, input.goal);
    }),
  executeNow: protectedProcedure
    .input(
      z.object({
        runId: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      return executeAgentRunInline(input.runId);
    }),
  memory: protectedProcedure
    .input(
      z.object({
        kind: z.enum(["conversation", "task", "knowledge", "profile"]).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      return readMemory(ctx.user.id, input.kind);
    }),
});


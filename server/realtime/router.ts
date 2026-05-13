import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { publishRealtimeEvent } from "../platform/realtime";

export const realtimeRouter = router({
  ping: protectedProcedure
    .input(
      z.object({
        message: z.string().default("ping"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const event = publishRealtimeEvent("system", "ping", {
        userId: ctx.user.id,
        message: input.message,
      });
      return event;
    }),
});


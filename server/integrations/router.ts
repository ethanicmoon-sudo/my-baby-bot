import { z } from "zod";
import { protectedProcedure, router } from "../_core/trpc";
import { getConnector, listConnectors } from "./connectors";

export const integrationRouter = router({
  list: protectedProcedure.query(async () => {
    return listConnectors();
  }),
  ping: protectedProcedure
    .input(
      z.object({
        provider: z.enum([
          "telegram",
          "gmail",
          "google_drive",
          "notion",
          "shopify",
          "youtube",
          "tiktok",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      return getConnector(input.provider).ping();
    }),
});


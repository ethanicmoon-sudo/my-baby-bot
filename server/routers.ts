import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router, protectedProcedure } from "./_core/trpc";
import { z } from "zod";
import {
  getAgents,
  createAgent,
  updateAgentStatus,
  getActivityFeed,
  createActivityEntry,
  getVideosByUser,
  createVideo,
  updateVideoStatus,
  deleteVideo,
  getNotesByUser,
  createNote,
  updateNote,
  deleteNote,
  getResearchDataByUser,
  createResearchData,
  getDesignReviewsByUser,
  createDesignReview,
  updateDesignReviewStatus,
  createWithdrawalRequest,
  getWithdrawalRequestsByUser,
  getDb,
} from "./db";
import { getBinanceStatus, submitBinanceWithdrawal } from "./binance";
import { agentRunRouter } from "./agents/router";
import { realtimeRouter } from "./realtime/router";
import { integrationRouter } from "./integrations/router";
import { publishRealtimeEvent } from "./platform/realtime";

export const appRouter = router({
  system: systemRouter,
  agentRuns: agentRunRouter,
  realtime: realtimeRouter,
  integrations: integrationRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Agent operations
  agents: router({
    list: protectedProcedure.query(async () => {
      return await getAgents();
    }),
    create: protectedProcedure
      .input(z.object({
        name: z.string(),
        status: z.enum(["online", "offline", "working", "idle"]),
        tasksCompleted: z.number().optional(),
      }))
      .mutation(async ({ input }) => {
        return await createAgent({
          name: input.name,
          status: input.status,
          tasksCompleted: input.tasksCompleted || 0,
        });
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        agentId: z.number(),
        status: z.enum(["online", "offline", "working", "idle"]),
      }))
      .mutation(async ({ input }) => {
        const result = await updateAgentStatus(input.agentId, input.status);
        publishRealtimeEvent("agent", "agent.status.updated", {
          agentId: input.agentId,
          status: input.status,
        });
        return result;
      }),
  }),

  // Activity feed operations
  activityFeed: router({
    list: protectedProcedure.query(async () => {
      return await getActivityFeed();
    }),
    create: protectedProcedure
      .input(z.object({
        agentId: z.number(),
        action: z.string(),
      }))
      .mutation(async ({ input }) => {
        const result = await createActivityEntry({
          agentId: input.agentId,
          action: input.action,
        });
        publishRealtimeEvent("agent", "activity.created", {
          agentId: input.agentId,
          action: input.action,
        });
        return result;
      }),
  }),

  // Video operations
  videos: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getVideosByUser(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        platform: z.enum(["tiktok", "instagram", "youtube"]),
        scheduledTime: z.date().optional(),
        status: z.enum(["draft", "scheduled", "published"]).optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await createVideo({
          title: input.title,
          platform: input.platform,
          scheduledTime: input.scheduledTime,
          status: input.status || "draft",
          userId: ctx.user.id,
        });
        publishRealtimeEvent("workflow", "video.created", {
          userId: ctx.user.id,
          platform: input.platform,
          status: input.status || "draft",
        });
        return result;
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        videoId: z.number(),
        status: z.enum(["draft", "scheduled", "published"]),
      }))
      .mutation(async ({ input }) => {
        const result = await updateVideoStatus(input.videoId, input.status);
        publishRealtimeEvent("workflow", "video.status.updated", {
          videoId: input.videoId,
          status: input.status,
        });
        return result;
      }),
    reschedule: protectedProcedure
      .input(z.object({
        videoId: z.number(),
        scheduledTime: z.date(),
      }))
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");
        const { videos } = await import("../drizzle/schema");
        const { eq } = await import("drizzle-orm");
        const result = await db.update(videos).set({
          scheduledTime: input.scheduledTime,
          status: "scheduled",
          updatedAt: new Date(),
        }).where(eq(videos.id, input.videoId));
        publishRealtimeEvent("workflow", "video.rescheduled", {
          videoId: input.videoId,
          scheduledTime: input.scheduledTime.toISOString(),
        });
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({
        videoId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const result = await deleteVideo(input.videoId);
        publishRealtimeEvent("workflow", "video.deleted", {
          videoId: input.videoId,
        });
        return result;
      }),
  }),

  // Note operations
  notes: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getNotesByUser(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        content: z.string(),
        category: z.string(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await createNote({
          title: input.title,
          content: input.content,
          category: input.category,
          userId: ctx.user.id,
        });
        publishRealtimeEvent("workflow", "note.created", {
          userId: ctx.user.id,
          category: input.category,
        });
        return result;
      }),
    update: protectedProcedure
      .input(z.object({
        noteId: z.number(),
        title: z.string().optional(),
        content: z.string().optional(),
        category: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const result = await updateNote(input.noteId, {
          title: input.title,
          content: input.content,
          category: input.category,
        });
        publishRealtimeEvent("workflow", "note.updated", {
          noteId: input.noteId,
        });
        return result;
      }),
    delete: protectedProcedure
      .input(z.object({
        noteId: z.number(),
      }))
      .mutation(async ({ input }) => {
        const result = await deleteNote(input.noteId);
        publishRealtimeEvent("workflow", "note.deleted", {
          noteId: input.noteId,
        });
        return result;
      }),
  }),

  // Research data operations
  research: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getResearchDataByUser(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        storeName: z.string(),
        revenue: z.number(),
        products: z.number(),
        rating: z.string(),
        trend: z.enum(["up", "down", "stable"]),
        insights: z.array(z.string()),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await createResearchData({
          storeName: input.storeName,
          revenue: input.revenue,
          products: input.products,
          rating: input.rating,
          trend: input.trend,
          insights: JSON.stringify(input.insights),
          userId: ctx.user.id,
        });
        publishRealtimeEvent("workflow", "research.created", {
          userId: ctx.user.id,
          storeName: input.storeName,
          trend: input.trend,
        });
        return result;
      }),
    analyze: protectedProcedure.query(async ({ ctx }) => {
      const data = await getResearchDataByUser(ctx.user.id);
      if (data.length === 0) {
        return {
          totalAnalyzed: 0,
          avgRevenue: 0,
          topTrend: "No data",
          marketGrowth: "0%",
        };
      }

      const totalRevenue = data.reduce((sum, d) => sum + d.revenue, 0);
      const avgRevenue = Math.round(totalRevenue / data.length);
      const upCount = data.filter(d => d.trend === "up").length;
      const downCount = data.filter(d => d.trend === "down").length;

      const topTrend = upCount > downCount ? "Neon Aesthetic ဒီဇိုင်းများ" : "Minimalist Designs";
      const marketGrowth = upCount > downCount ? `${Math.round((upCount / data.length) * 100)}% တစ်လတစ်ခါ` : "Declining";

      return {
        totalAnalyzed: data.length,
        avgRevenue,
        topTrend,
        marketGrowth,
      };
    }),
  }),

  // Design review operations
  designReviews: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getDesignReviewsByUser(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        generatedBy: z.string(),
        imageUrl: z.string().optional(),
      }))
      .mutation(async ({ input, ctx }) => {
        const result = await createDesignReview({
          title: input.title,
          generatedBy: input.generatedBy,
          imageUrl: input.imageUrl,
          userId: ctx.user.id,
        });
        publishRealtimeEvent("workflow", "designReview.created", {
          userId: ctx.user.id,
          title: input.title,
        });
        return result;
      }),
    updateStatus: protectedProcedure
      .input(z.object({
        reviewId: z.number(),
        status: z.enum(["pending", "approved", "rejected", "iterating"]),
      }))
      .mutation(async ({ input }) => {
        const result = await updateDesignReviewStatus(input.reviewId, input.status);
        publishRealtimeEvent("workflow", "designReview.status.updated", {
          reviewId: input.reviewId,
          status: input.status,
        });
        return result;
      }),
  }),

  wallet: router({
    binanceStatus: protectedProcedure.query(() => {
      return getBinanceStatus();
    }),
    withdrawalHistory: protectedProcedure.query(async ({ ctx }) => {
      return await getWithdrawalRequestsByUser(ctx.user.id);
    }),
    withdrawToBinance: protectedProcedure
      .input(z.object({
        coin: z.string().trim().min(2).max(16).regex(/^[A-Za-z0-9]+$/),
        network: z.string().trim().min(2).max(32).regex(/^[A-Za-z0-9_-]+$/).optional().or(z.literal("")),
        address: z.string().trim().min(8).max(256),
        addressTag: z.string().trim().max(128).optional().or(z.literal("")),
        amount: z.string().trim().regex(/^(?:0|[1-9]\d*)(?:\.\d{1,18})?$/),
        walletType: z.enum(["spot", "funding"]).default("spot"),
        confirmationText: z.string().trim(),
      }))
      .mutation(async ({ input, ctx }) => {
        const coin = input.coin.toUpperCase();
        const expectedConfirmation = `WITHDRAW ${input.amount} ${coin}`;
        if (input.confirmationText !== expectedConfirmation) {
          throw new Error(`Confirmation must exactly match: ${expectedConfirmation}`);
        }

        const withdrawOrderId = `user-${ctx.user.id}-${Date.now()}`;

        try {
          const result = await submitBinanceWithdrawal({
            coin,
            network: input.network ? input.network : undefined,
            address: input.address,
            addressTag: input.addressTag ? input.addressTag : undefined,
            amount: input.amount,
            walletType: input.walletType === "funding" ? 1 : 0,
            withdrawOrderId,
          });

          await createWithdrawalRequest({
            userId: ctx.user.id,
            status: "submitted",
            coin,
            network: input.network || null,
            address: input.address,
            addressTag: input.addressTag || null,
            amount: input.amount,
            walletType: input.walletType === "funding" ? 1 : 0,
            withdrawOrderId,
            providerWithdrawalId: result.id,
          });
          publishRealtimeEvent("notification", "withdrawal.submitted", {
            userId: ctx.user.id,
            withdrawOrderId,
            providerWithdrawalId: result.id,
            coin,
            amount: input.amount,
          });

          return {
            success: true,
            providerWithdrawalId: result.id,
            withdrawOrderId,
          } as const;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Withdrawal failed";
          await createWithdrawalRequest({
            userId: ctx.user.id,
            status: "failed",
            coin,
            network: input.network || null,
            address: input.address,
            addressTag: input.addressTag || null,
            amount: input.amount,
            walletType: input.walletType === "funding" ? 1 : 0,
            withdrawOrderId,
            errorMessage: message,
          });
          publishRealtimeEvent("notification", "withdrawal.failed", {
            userId: ctx.user.id,
            withdrawOrderId,
            coin,
            amount: input.amount,
            error: message,
          });
          throw error;
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;

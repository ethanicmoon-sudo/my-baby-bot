import { describe, it, expect, beforeEach, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

const mockDb = vi.hoisted(() => {
  let id = 1;
  const nextId = () => id++;

  return {
    reset: () => {
      id = 1;
    },
    getAgents: vi.fn(async () => []),
    createAgent: vi.fn(async (agent: Record<string, unknown>) => ({
      id: nextId(),
      ...agent,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    updateAgentStatus: vi.fn(async (agentId: number, status: string) => ({
      agentId,
      status,
    })),
    getActivityFeed: vi.fn(async () => []),
    createActivityEntry: vi.fn(async (entry: Record<string, unknown>) => ({
      id: nextId(),
      ...entry,
      createdAt: new Date(),
    })),
    getVideosByUser: vi.fn(async () => []),
    createVideo: vi.fn(async (video: Record<string, unknown>) => ({
      id: nextId(),
      ...video,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    updateVideoStatus: vi.fn(async (videoId: number, status: string) => ({
      videoId,
      status,
    })),
    getNotesByUser: vi.fn(async () => []),
    createNote: vi.fn(async (note: Record<string, unknown>) => ({
      id: nextId(),
      ...note,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    updateNote: vi.fn(async (noteId: number, note: Record<string, unknown>) => ({
      id: noteId,
      ...note,
      updatedAt: new Date(),
    })),
    deleteNote: vi.fn(async (noteId: number) => ({ id: noteId })),
    getResearchDataByUser: vi.fn(async () => []),
    createResearchData: vi.fn(async (data: Record<string, unknown>) => ({
      id: nextId(),
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    getDesignReviewsByUser: vi.fn(async () => []),
    createDesignReview: vi.fn(async (review: Record<string, unknown>) => ({
      id: nextId(),
      ...review,
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    updateDesignReviewStatus: vi.fn(async (reviewId: number, status: string) => ({
      reviewId,
      status,
    })),
    createWithdrawalRequest: vi.fn(async () => null),
    getDb: vi.fn(async () => null),
  };
});

vi.mock("./db", () => mockDb);

function createAuthContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("Dashboard tRPC Procedures", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockDb.reset();
  });

  describe("agents", () => {
    it("should list agents", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // This will return empty array initially since DB is empty
      const result = await caller.agents.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create an agent", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.agents.create({
        name: "Ultron",
        status: "online",
        tasksCompleted: 5,
      });

      expect(result).toBeDefined();
    });

    it("should update agent status", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create an agent first
      await caller.agents.create({
        name: "Forge",
        status: "offline",
      });

      // Update status
      const result = await caller.agents.updateStatus({
        agentId: 1,
        status: "working",
      });

      expect(result).toBeDefined();
    });
  });

  describe("notes", () => {
    it("should list notes for user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notes.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a note", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.notes.create({
        title: "Test Note",
        content: "This is a test note",
        category: "အဆိုပြုချက်",
      });

      expect(result).toBeDefined();
    });

    it("should update a note", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a note first
      await caller.notes.create({
        title: "Original Title",
        content: "Original content",
        category: "သုတေသန",
      });

      // Update it
      const result = await caller.notes.update({
        noteId: 1,
        title: "Updated Title",
        content: "Updated content",
      });

      expect(result).toBeDefined();
    });

    it("should delete a note", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a note first
      await caller.notes.create({
        title: "To Delete",
        content: "This will be deleted",
        category: "ပြုလုပ်ခြင်း",
      });

      // Delete it
      const result = await caller.notes.delete({
        noteId: 1,
      });

      expect(result).toBeDefined();
    });
  });

  describe("videos", () => {
    it("should list videos for user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.videos.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a video", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.videos.create({
        title: "Test Video",
        platform: "tiktok",
        status: "draft",
      });

      expect(result).toBeDefined();
    });

    it("should update video status", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a video first
      await caller.videos.create({
        title: "Schedulable Video",
        platform: "youtube",
        status: "draft",
      });

      // Update status
      const result = await caller.videos.updateStatus({
        videoId: 1,
        status: "scheduled",
      });

      expect(result).toBeDefined();
    });
  });

  describe("research", () => {
    it("should list research data for user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.research.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create research data", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.research.create({
        storeName: "Competitor Store",
        revenue: 50000,
        products: 1200,
        rating: "4.8",
        trend: "up",
        insights: [
          "High-quality designs",
          "Fast shipping",
          "Great customer service",
        ],
      });

      expect(result).toBeDefined();
    });
  });

  describe("designReviews", () => {
    it("should list design reviews for user", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.designReviews.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create a design review", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.designReviews.create({
        title: "Neon Design v1",
        generatedBy: "Ultron",
        imageUrl: "https://example.com/design.jpg",
      });

      expect(result).toBeDefined();
    });

    it("should update design review status", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      // Create a design review first
      await caller.designReviews.create({
        title: "Design to Review",
        generatedBy: "Forge",
      });

      // Update status
      const result = await caller.designReviews.updateStatus({
        reviewId: 1,
        status: "approved",
      });

      expect(result).toBeDefined();
    });
  });

  describe("activityFeed", () => {
    it("should list activity feed", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.activityFeed.list();
      expect(Array.isArray(result)).toBe(true);
    });

    it("should create activity entry", async () => {
      const { ctx } = createAuthContext();
      const caller = appRouter.createCaller(ctx);

      const result = await caller.activityFeed.create({
        agentId: 1,
        action: "Started design generation task",
      });

      expect(result).toBeDefined();
    });
  });

  describe("authorization", () => {
    it("should require authentication for protected procedures", async () => {
      const caller = appRouter.createCaller({
        user: null,
        req: { protocol: "https", headers: {} } as TrpcContext["req"],
        res: {} as TrpcContext["res"],
      });

      try {
        await caller.notes.list();
        expect.fail("Should have thrown unauthorized error");
      } catch (error: any) {
        expect(error.code).toBe("UNAUTHORIZED");
      }
    });
  });
});

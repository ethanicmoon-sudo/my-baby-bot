import { desc, eq, sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import {
  InsertUser,
  users,
  agents,
  InsertAgent,
  videos,
  InsertVideo,
  notes,
  InsertNote,
  researchData,
  InsertResearchData,
  designReviews,
  InsertDesignReview,
  activityFeed,
  InsertActivityFeed,
  withdrawalRequests,
  InsertWithdrawalRequest,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function pingDatabase(): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.execute(sql`select 1`);
    return true;
  } catch {
    return false;
  }
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onConflictDoUpdate({
      target: users.openId,
      set: {
        ...updateSet,
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Agent queries
export async function getAgents() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(agents);
}

export async function createAgent(agent: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.insert(agents).values(agent);
  return result;
}

export async function updateAgentStatus(agentId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(agents).set({ status: status as any, updatedAt: new Date() }).where(eq(agents.id, agentId));
}

// Activity feed queries
export async function getActivityFeed() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(activityFeed);
}

export async function createActivityEntry(entry: InsertActivityFeed) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(activityFeed).values(entry);
}

// Video queries
export async function getVideosByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(videos).where(eq(videos.userId, userId));
}

export async function createVideo(video: InsertVideo) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(videos).values(video);
}

export async function updateVideoStatus(videoId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(videos).set({ status: status as any, updatedAt: new Date() }).where(eq(videos.id, videoId));
}

export async function deleteVideo(videoId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(videos).where(eq(videos.id, videoId));
}

// Note queries
export async function getNotesByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(notes).where(eq(notes.userId, userId));
}

export async function createNote(note: InsertNote) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(notes).values(note);
}

export async function updateNote(noteId: number, note: Partial<InsertNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(notes).set({ ...note, updatedAt: new Date() }).where(eq(notes.id, noteId));
}

export async function deleteNote(noteId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.delete(notes).where(eq(notes.id, noteId));
}

// Research data queries
export async function getResearchDataByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(researchData).where(eq(researchData.userId, userId));
}

export async function createResearchData(data: InsertResearchData) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(researchData).values(data);
}

// Design review queries
export async function getDesignReviewsByUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(designReviews).where(eq(designReviews.userId, userId));
}

export async function createDesignReview(review: InsertDesignReview) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.insert(designReviews).values(review);
}

export async function updateDesignReviewStatus(reviewId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.update(designReviews).set({ status: status as any, updatedAt: new Date() }).where(eq(designReviews.id, reviewId));
}

export async function createWithdrawalRequest(request: InsertWithdrawalRequest) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create withdrawal audit row: database not available");
    return null;
  }

  return await db.insert(withdrawalRequests).values(request);
}

export async function getWithdrawalRequestsByUser(userId: number, limitCount = 25) {
  const db = await getDb();
  if (!db) return [];

  return await db
    .select()
    .from(withdrawalRequests)
    .where(eq(withdrawalRequests.userId, userId))
    .orderBy(desc(withdrawalRequests.createdAt))
    .limit(limitCount);
}

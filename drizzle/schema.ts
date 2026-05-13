import { integer, pgEnum, pgTable, serial, text, timestamp, varchar } from "drizzle-orm/pg-core";

const userRoleEnum = pgEnum("user_role_enum", ["user", "admin"]);
const agentStatusEnum = pgEnum("agent_status_enum", ["online", "offline", "working", "idle"]);
const videoPlatformEnum = pgEnum("video_platform_enum", ["tiktok", "instagram", "youtube"]);
const videoStatusEnum = pgEnum("video_status_enum", ["draft", "scheduled", "published"]);
const researchTrendEnum = pgEnum("research_trend_enum", ["up", "down", "stable"]);
const designReviewStatusEnum = pgEnum("design_review_status_enum", ["pending", "approved", "rejected", "iterating"]);
const withdrawalProviderEnum = pgEnum("withdrawal_provider_enum", ["binance"]);
const withdrawalStatusEnum = pgEnum("withdrawal_status_enum", ["submitted", "failed"]);

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = pgTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: serial("id").primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Agents table - stores AI agent information and status
 */
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  status: agentStatusEnum("status").default("offline").notNull(),
  tasksCompleted: integer("tasksCompleted").default(0).notNull(),
  lastActive: timestamp("lastActive", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type Agent = typeof agents.$inferSelect;
export type InsertAgent = typeof agents.$inferInsert;

/**
 * Activity feed table - stores agent activity logs
 */
export const activityFeed = pgTable("activityFeed", {
  id: serial("id").primaryKey(),
  agentId: integer("agentId").notNull(),
  action: text("action").notNull(),
  timestamp: timestamp("timestamp", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type ActivityFeed = typeof activityFeed.$inferSelect;
export type InsertActivityFeed = typeof activityFeed.$inferInsert;

/**
 * Videos table - stores media content for scheduling
 */
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  platform: videoPlatformEnum("platform").notNull(),
  scheduledTime: timestamp("scheduledTime", { mode: "date", withTimezone: true }),
  status: videoStatusEnum("status").default("draft").notNull(),
  thumbnailUrl: text("thumbnailUrl"),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type Video = typeof videos.$inferSelect;
export type InsertVideo = typeof videos.$inferInsert;

/**
 * Notes table - stores knowledge base entries for Archives
 */
export const notes = pgTable("notes", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  category: varchar("category", { length: 100 }).notNull(),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

/**
 * Note links table - stores relationships between notes
 */
export const noteLinks = pgTable("noteLinks", {
  id: serial("id").primaryKey(),
  sourceNoteId: integer("sourceNoteId").notNull(),
  targetNoteId: integer("targetNoteId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type NoteLink = typeof noteLinks.$inferSelect;
export type InsertNoteLink = typeof noteLinks.$inferInsert;

/**
 * Research data table - stores competitor analysis and insights
 */
export const researchData = pgTable("researchData", {
  id: serial("id").primaryKey(),
  storeName: varchar("storeName", { length: 255 }).notNull(),
  revenue: integer("revenue").notNull(),
  products: integer("products").notNull(),
  rating: varchar("rating", { length: 10 }).notNull(),
  trend: researchTrendEnum("trend").default("stable").notNull(),
  insights: text("insights").notNull(), // JSON string array
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type ResearchData = typeof researchData.$inferSelect;
export type InsertResearchData = typeof researchData.$inferInsert;

/**
 * Design reviews table - stores AI-generated designs for feedback
 */
export const designReviews = pgTable("designReviews", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  generatedBy: varchar("generatedBy", { length: 100 }).notNull(),
  status: designReviewStatusEnum("status").default("pending").notNull(),
  imageUrl: text("imageUrl"),
  userId: integer("userId").notNull(),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type DesignReview = typeof designReviews.$inferSelect;
export type InsertDesignReview = typeof designReviews.$inferInsert;

/**
 * Binance withdrawal audit table - records every attempted real-money withdrawal.
 * API keys and secrets must never be stored here.
 */
export const withdrawalRequests = pgTable("withdrawalRequests", {
  id: serial("id").primaryKey(),
  userId: integer("userId").notNull(),
  provider: withdrawalProviderEnum("provider").default("binance").notNull(),
  status: withdrawalStatusEnum("status").notNull(),
  coin: varchar("coin", { length: 16 }).notNull(),
  network: varchar("network", { length: 32 }),
  address: text("address").notNull(),
  addressTag: varchar("addressTag", { length: 128 }),
  amount: varchar("amount", { length: 64 }).notNull(),
  walletType: integer("walletType").default(0).notNull(),
  withdrawOrderId: varchar("withdrawOrderId", { length: 128 }).notNull(),
  providerWithdrawalId: varchar("providerWithdrawalId", { length: 128 }),
  errorMessage: text("errorMessage"),
  createdAt: timestamp("createdAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updatedAt", { mode: "date", withTimezone: true }).defaultNow().notNull(),
});

export type WithdrawalRequest = typeof withdrawalRequests.$inferSelect;
export type InsertWithdrawalRequest = typeof withdrawalRequests.$inferInsert;

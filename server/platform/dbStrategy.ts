export type DbStrategy = "postgres" | "mysql";

export function getDbStrategy(): DbStrategy {
  const raw = (process.env.DB_STRATEGY || "postgres").toLowerCase();
  if (raw === "mysql") return "mysql";
  return "postgres";
}

export function getDatabaseUrl(): string {
  return process.env.DATABASE_URL || "";
}

export function assertDatabaseConfigured() {
  const url = getDatabaseUrl();
  if (!url) {
    throw new Error("DATABASE_URL is required");
  }
}

export function logDbStrategy() {
  const strategy = getDbStrategy();
  const maskedUrl = getDatabaseUrl().replace(/\/\/([^:]+):([^@]+)@/, "//$1:***@");
  console.log(`[DB] strategy=${strategy} url=${maskedUrl || "(missing)"}`);
}


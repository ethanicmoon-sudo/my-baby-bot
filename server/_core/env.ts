export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  appBaseUrl: process.env.APP_BASE_URL ?? "",
  corsOrigin: process.env.CORS_ORIGIN ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  dbStrategy: process.env.DB_STRATEGY ?? "postgres",
  redisUrl: process.env.REDIS_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
};

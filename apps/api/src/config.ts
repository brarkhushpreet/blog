const nodeEnv = process.env.NODE_ENV ?? "development";
export const config = {
  nodeEnv,
  isProduction: nodeEnv === "production",
  port: Number(process.env.PORT ?? 4000),
  mongoUri: process.env.MONGO_URI ?? process.env.MONGO ?? "",
  mongoDbName: process.env.MONGO_DB_NAME ?? "blog_db",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  isCloudflareWorker: process.env.CLOUDFLARE_WORKER === "true",
};

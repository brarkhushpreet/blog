import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import { config } from "./config.js";
import { databaseStatus } from "./db.js";
import { errorHandler, notFound } from "./middleware/errors.js";
import { contactRouter } from "./routes/contact.js";
import { postsRouter } from "./routes/posts.js";

export const app = express();

app.disable("x-powered-by");
app.set("trust proxy", 1);
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: config.frontendUrl, credentials: true }));
if (!config.isCloudflareWorker) app.use(compression());
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", async (_request, response) => {
  response.json({
    status: "ok",
    service: "creative-thoughts-api",
    database: await databaseStatus(),
    timestamp: new Date().toISOString(),
  });
});

app.use("/api/posts", postsRouter);
app.use("/api/contact", contactRouter);
app.use(notFound);
app.use(errorHandler);

export default app;

import { MongoClient, type Db } from "mongodb";
import { config } from "./config.js";

let nodeClientPromise: Promise<MongoClient> | null = null;

function createClient() {
  return new MongoClient(config.mongoUri, {
    maxPoolSize: config.isCloudflareWorker ? 1 : 10,
    minPoolSize: 0,
    serverSelectionTimeoutMS: 5000,
  });
}

async function connectNodeClient() {
  nodeClientPromise ??= createClient().connect().catch((error) => {
    nodeClientPromise = null;
    throw error;
  });

  return nodeClientPromise;
}

export async function withDatabase<T>(operation: (database: Db) => Promise<T>) {
  if (!config.mongoUri) throw new Error("MONGO_URI is not configured");

  if (config.isCloudflareWorker) {
    const client = createClient();
    try {
      await client.connect();
      return await operation(client.db(config.mongoDbName));
    } finally {
      await client.close();
    }
  }

  const client = await connectNodeClient();
  return operation(client.db(config.mongoDbName));
}

export async function closeDatabase() {
  if (!nodeClientPromise) return;
  const client = await nodeClientPromise;
  nodeClientPromise = null;
  await client.close();
}

export async function databaseStatus() {
  if (!config.mongoUri) return "not_configured";
  try {
    await withDatabase(async (database) => {
      await database.command({ ping: 1 });
    });
    return "connected";
  } catch {
    return "unavailable";
  }
}

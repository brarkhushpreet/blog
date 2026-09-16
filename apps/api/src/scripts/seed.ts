import "../load-env.js";
import { closeDatabase, withDatabase } from "../db.js";
import { seedPosts, supersededSeedSlugs } from "../content/seed-posts.js";

const result = await withDatabase(async (database) => {
  const posts = database.collection("posts");
  await posts.createIndex({ slug: 1 }, { unique: true });
  await posts.createIndex({ title: "text", desc: "text", content: "text" });

  const removed = await posts.deleteMany({ slug: { $in: [...supersededSeedSlugs] } });
  const now = new Date();
  const operations = seedPosts.map((post) => ({
    updateOne: {
      filter: { slug: post.slug },
      update: {
        $set: { ...post, tags: [...post.tags], updatedAt: now },
        $setOnInsert: { createdAt: now },
      },
      upsert: true,
    },
  }));

  const seeded = await posts.bulkWrite(operations);
  const total = await posts.countDocuments({ published: true });
  return { removed, seeded, total };
});

console.log(`Seed complete: ${result.removed.deletedCount} superseded seed articles removed, ${result.seeded.upsertedCount} inserted, ${result.seeded.modifiedCount} updated, ${result.total} published articles total.`);
await closeDatabase();

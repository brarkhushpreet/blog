import { Router } from "express";
import type { Document, Filter } from "mongodb";
import { withDatabase } from "../db.js";
import { seedPosts } from "../content/seed-posts.js";
import { serializePost } from "../content/serialize.js";

export const postsRouter = Router();

function escapeRegex(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function seedFallback(search: string, category: string) {
  const needle = search.toLowerCase();
  return seedPosts
    .map((post, index) => serializePost({ ...post, _id: `seed-${index + 1}` }))
    .filter((post) => {
      const haystack = `${post.title} ${post.excerpt} ${post.tags.join(" ")}`.toLowerCase();
      const matchesSearch = !needle || haystack.includes(needle);
      const matchesCategory = !category || category === "All" || post.category.toLowerCase() === category.toLowerCase();
      return matchesSearch && matchesCategory;
    });
}

postsRouter.get("/", async (request, response) => {
  const search = String(request.query.search ?? "").trim();
  const category = String(request.query.category ?? "").trim();
  const page = Math.max(1, Number(request.query.page ?? 1));
  const limit = Math.min(50, Math.max(1, Number(request.query.limit ?? 20)));

  try {
    const filters: Filter<Document>[] = [
      { $or: [{ published: true }, { published: { $exists: false } }] },
    ];
    if (search) {
      const regex = new RegExp(escapeRegex(search), "i");
      filters.push({ $or: [{ title: regex }, { desc: regex }, { content: regex }, { tags: regex }] });
    }
    if (category && category !== "All") {
      filters.push({ category: new RegExp(`^${escapeRegex(category)}$`, "i") });
    }

    const query = filters.length === 1 ? filters[0] : { $and: filters };
    const [rawPosts, total] = await withDatabase(async (database) => {
      const posts = database.collection("posts");
      return Promise.all([
        posts.find(query).sort({ featured: -1, publishedAt: -1, createdAt: -1 }).skip((page - 1) * limit).limit(limit).toArray(),
        posts.countDocuments(query),
      ]);
    });
    response.json({ data: rawPosts.map(serializePost), meta: { page, limit, total, source: "database" } });
  } catch (error) {
    console.warn("Serving local fallback articles:", error instanceof Error ? error.message : error);
    const filtered = seedFallback(search, category);
    response.json({ data: filtered.slice((page - 1) * limit, page * limit), meta: { page, limit, total: filtered.length, source: "fallback" } });
  }
});

postsRouter.get("/:slug", async (request, response) => {
  try {
    const post = await withDatabase((database) => database.collection("posts").findOne({
      slug: request.params.slug,
      $or: [{ published: true }, { published: { $exists: false } }],
    }));
    if (!post) return response.status(404).json({ error: "Article not found." });
    return response.json({ data: serializePost(post), meta: { source: "database" } });
  } catch {
    const fallback = seedFallback("", "").find((post) => post.slug === request.params.slug);
    if (fallback) return response.json({ data: fallback, meta: { source: "fallback" } });
    return response.status(503).json({ error: "Articles are temporarily unavailable." });
  }
});

import type { ApiItem, ApiList, Post } from "./types";

export const serverApiUrl = process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";
export const browserApiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function getPosts(options: { search?: string; category?: string; limit?: number } = {}) {
  const url = new URL(`${serverApiUrl}/posts`);
  if (options.search) url.searchParams.set("search", options.search);
  if (options.category && options.category !== "All") url.searchParams.set("category", options.category);
  if (options.limit) url.searchParams.set("limit", String(options.limit));

  try {
    const response = await fetch(url, { next: { revalidate: 60 } });
    if (!response.ok) throw new Error("Could not load stories");
    return (await response.json() as ApiList<Post>).data;
  } catch { return []; }
}

export async function getPost(slug: string) {
  try {
    const response = await fetch(`${serverApiUrl}/posts/${encodeURIComponent(slug)}`, { next: { revalidate: 60 } });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error("Could not load story");
    return (await response.json() as ApiItem<Post>).data;
  } catch { return null; }
}

export type PublicPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  category: string;
  tags: string[];
  featured: boolean;
  readingMinutes: number;
  publishedAt: string;
  author: { id: string; name: string; avatar: string; bio: string };
};

function excerptFrom(value: string) {
  const clean = value.replace(/\s+/g, " ").trim();
  return clean.length > 220 ? `${clean.slice(0, 217)}…` : clean;
}

export function serializePost(post: any): PublicPost {
  const content = post.content?.trim() || post.desc || "";
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return {
    id: String(post._id ?? post.id),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt?.trim() || excerptFrom(post.desc || content),
    content,
    coverImage: post.img || "/download.jpg",
    category: post.category || "Ideas",
    tags: Array.isArray(post.tags) ? post.tags : [],
    featured: Boolean(post.featured),
    readingMinutes: Math.max(1, Math.ceil(words / 220)),
    publishedAt: new Date(post.publishedAt ?? post.createdAt ?? Date.now()).toISOString(),
    author: {
      id: "khushpreet",
      name: post.authorName ?? "Khushpreet",
      avatar: post.authorAvatar ?? "/noavatar.png",
      bio: post.authorBio ?? "Software engineer writing about JavaScript, React, Node.js, distributed systems, Docker, and AWS.",
    },
  };
}

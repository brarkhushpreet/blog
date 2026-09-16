export type Author = {
  id: string;
  name: string;
  avatar: string;
  bio: string;
};

export type Post = {
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
  author: Author;
};

export type ApiList<T> = {
  data: T[];
  meta: { page: number; limit: number; total: number; source: "database" | "fallback" };
};

export type ApiItem<T> = { data: T; meta?: { source: "database" | "fallback" } };

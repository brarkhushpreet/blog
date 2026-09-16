import type { Metadata } from "next";
import Link from "next/link";
import { Search } from "lucide-react";
import { PostCard } from "@/components/stories/PostCard";
import { getPosts } from "@/lib/api";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Articles", description: "Articles about JavaScript, React, Node.js, real-time systems, Docker, AWS, and software architecture." };

const categories = ["All", "JavaScript", "Real-time", "React", "Node.js", "Docker", "AWS", "Architecture"];

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ search?: string; category?: string }> }) {
  const params = await searchParams;
  const activeCategory = params.category || "All";
  const posts = await getPosts({ search: params.search, category: activeCategory, limit: 50 });

  return (
    <div className="archive-page page-shell">
      <header className="archive-header"><span className="kicker">Writing</span><h1>Articles</h1><p>Deep dives and practical notes across the full software stack.</p></header>
      <form id="search" className="search-bar" action="/blog"><Search size={18} /><input type="search" name="search" defaultValue={params.search} placeholder="Search articles" aria-label="Search articles" />{activeCategory !== "All" && <input type="hidden" name="category" value={activeCategory} />}<button type="submit">Search</button></form>
      <nav className="archive-filters" aria-label="Filter articles by category">{categories.map((category) => <Link key={category} href={category === "All" ? "/blog" : `/blog?category=${encodeURIComponent(category)}`} className={activeCategory === category ? "active" : ""}>{category}</Link>)}</nav>
      <div className="archive-body"><div className="archive-count">{posts.length} {posts.length === 1 ? "article" : "articles"}{params.search ? ` matching “${params.search}”` : ""}</div>{posts.length ? posts.map((post, index) => <PostCard key={post.id} post={post} priority={index === 0} />) : <div className="empty-state"><h2>No articles found</h2><p>Try a different topic or search term.</p><Link href="/blog">Clear filters</Link></div>}</div>
    </div>
  );
}

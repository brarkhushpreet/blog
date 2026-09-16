import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PostCard } from "@/components/stories/PostCard";
import { getPosts } from "@/lib/api";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-dynamic";

const topics = ["JavaScript", "Real-time", "React", "Node.js", "Docker", "AWS"];

export default async function HomePage() {
  const posts = await getPosts({ limit: 10 });
  const featured = posts.find((post) => post.featured) ?? posts[0];
  const latest = posts.filter((post) => post.id !== featured?.id);

  return (
    <div className="home-page page-shell">
      <section className="home-intro">
        <span className="kicker">Software engineering, from first principles</span>
        <h1>Clear explanations for systems that are easy to build and <em>hard to understand.</em></h1>
        <p>{siteConfig.intro}</p>
      </section>

      {featured && <article className="featured-post">
        <Link href={`/blog/${featured.slug}`} className="featured-post-image"><Image src={featured.coverImage} alt="" fill priority sizes="(max-width: 800px) 100vw, 58vw" /></Link>
        <div className="featured-post-copy"><div className="post-meta"><span>Featured</span><span>{featured.category}</span><span>{featured.readingMinutes} min</span></div><h2><Link href={`/blog/${featured.slug}`}>{featured.title}</Link></h2><p>{featured.excerpt}</p><div className="featured-footer"><span>{formatDate(featured.publishedAt)}</span><Link href={`/blog/${featured.slug}`}>Read article <ArrowRight size={15} /></Link></div></div>
      </article>}

      <div className="home-content-grid">
        <section className="article-feed"><div className="feed-heading"><h2>Latest articles</h2><Link href="/blog">View all</Link></div>{latest.map((post) => <PostCard key={post.id} post={post} />)}</section>
        <aside className="home-sidebar"><div className="sidebar-block"><span className="sidebar-label">Topics</span>{topics.map((topic) => <Link key={topic} href={`/blog?category=${encodeURIComponent(topic)}`}>{topic}<span>→</span></Link>)}</div><div className="sidebar-note"><span className="sidebar-label">About this blog</span><p>Long-form notes on building full-stack systems that stay reliable as they grow.</p><Link href="/about">More about me</Link></div></aside>
      </div>
    </div>
  );
}

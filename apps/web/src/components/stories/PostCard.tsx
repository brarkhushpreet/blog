import Image from "next/image";
import Link from "next/link";
import { formatDate } from "@/lib/format";
import type { Post } from "@/lib/types";

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="post-row">
      <div className="post-row-copy">
        <div className="post-meta"><span>{post.category}</span><span>{formatDate(post.publishedAt)}</span><span>{post.readingMinutes} min read</span></div>
        <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
        <p>{post.excerpt}</p>
        <div className="post-tags">{post.tags.slice(0, 3).map((tag) => <span key={tag}>{tag}</span>)}</div>
      </div>
      <Link href={`/blog/${post.slug}`} className="post-row-image" aria-label={`Read ${post.title}`}>
        <Image src={post.coverImage} alt="" fill sizes="(max-width: 700px) 34vw, 220px" priority={priority} />
      </Link>
    </article>
  );
}

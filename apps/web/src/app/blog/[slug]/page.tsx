import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { ArticleBody } from "@/components/stories/ArticleBody";
import { ShareActions } from "@/components/stories/ShareActions";
import { getPost, getPosts } from "@/lib/api";
import { formatDate } from "@/lib/format";

export const dynamic = "force-dynamic";

type ArticlePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article not found" };
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { type: "article", title: post.title, description: post.excerpt, images: [post.coverImage] },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([getPost(slug), getPosts({ limit: 20 })]);
  if (!post) notFound();

  const related = allPosts
    .filter((item) => item.id !== post.id && (item.category === post.category || item.tags.some((tag) => post.tags.includes(tag))))
    .slice(0, 2);

  return (
    <article className="article-page">
      <header className="article-header page-shell">
        <Link href="/blog" className="article-back"><ArrowLeft size={15} /> All articles</Link>
        <div className="article-heading">
          <div className="post-meta"><span>{post.category}</span><span>{post.readingMinutes} min read</span></div>
          <h1>{post.title}</h1>
          <p>{post.excerpt}</p>
          <div className="article-byline">
            <div><strong>{post.author.name}</strong><span>{formatDate(post.publishedAt)}</span></div>
            <ShareActions title={post.title} />
          </div>
        </div>
      </header>

      <div className="article-cover page-shell">
        <Image src={post.coverImage} alt="" fill priority sizes="(max-width: 1180px) 100vw, 1120px" />
      </div>

      <div className="article-content-shell page-shell">
        <ArticleBody content={post.content} />
        <footer className="article-footer">
          <div className="article-tags">{post.tags.map((tag) => <Link key={tag} href={`/blog?search=${encodeURIComponent(tag)}`}>{tag}</Link>)}</div>
          <div className="author-note"><span>Written by</span><h2>{post.author.name}</h2><p>{post.author.bio}</p></div>
        </footer>
      </div>

      {related.length > 0 && <section className="related-section page-shell"><div className="section-heading"><div><span className="kicker">Keep reading</span><h2>Related articles</h2></div><Link href="/blog">All articles <ArrowRight size={15} /></Link></div><div className="related-grid">{related.map((item) => <Link href={`/blog/${item.slug}`} className="related-card" key={item.id}><div><span>{item.category}</span><span>{item.readingMinutes} min</span></div><h3>{item.title}</h3><p>{item.excerpt}</p></Link>)}</div></section>}
    </article>
  );
}

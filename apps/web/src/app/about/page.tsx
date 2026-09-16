import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = { title: "About", description: `About ${siteConfig.name} and this software engineering blog.` };

const topics = [
  ["JavaScript & React", "The event loop, concurrency, rendering behavior, and performance in real applications."],
  ["Node.js", "Backend architecture, streams, APIs, reliability, and operating services in production."],
  ["Cloud & AWS", "Containers, deployment, event-driven systems, observability, and infrastructure tradeoffs."],
  ["System design", "Practical decisions that keep full-stack systems understandable as they grow."],
];

export default function AboutPage() {
  return (
    <div className="about-page page-shell">
      <header className="about-header"><span className="kicker">About</span><h1>I write about the decisions behind reliable software systems.</h1></header>
      <div className="about-layout">
        <aside><span>{siteConfig.name}</span><p>{siteConfig.role}</p></aside>
        <div className="about-prose">
          <p className="about-lede">I am a full-stack software engineer working across frontend, backend, cloud infrastructure, and the boundaries between them.</p>
          <p>This is my personal technical blog: a place for clear explanations of complex JavaScript behavior, React performance, Node.js services, real-time communication, Docker, AWS, and system architecture.</p>
          <p>I start with practical production problems, build a useful mental model, and finish with tradeoffs and patterns you can apply in real projects.</p>
          <p>There is no publishing platform or member area here. I write every article, and everything is free to read.</p>
          <Link href="/blog" className="text-link">Browse all articles <ArrowRight size={16} /></Link>
        </div>
      </div>
      <section className="about-topics"><div className="section-heading"><div><span className="kicker">What I cover</span><h2>Topics</h2></div></div><div className="topic-grid">{topics.map(([name, description]) => <article key={name}><h3>{name}</h3><p>{description}</p></article>)}</div></section>
      <section className="about-contact"><div><span className="kicker">Say hello</span><h2>Have a question or an article idea?</h2></div><Link href="/contact" className="button button-accent">Contact me <ArrowRight size={16} /></Link></section>
    </div>
  );
}

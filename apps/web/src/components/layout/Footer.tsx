import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="page-shell footer-inner">
        <div><strong>{siteConfig.name}</strong><span>{siteConfig.role}. Writing across the software stack.</span></div>
        <nav aria-label="Footer navigation"><Link href="/blog">Articles</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link></nav>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </footer>
  );
}

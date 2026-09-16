"use client";

import Link from "next/link";
import { Menu, Search, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { siteConfig } from "@/lib/site";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  { href: "/blog", label: "Articles" },
  { href: "/about", label: "About" },
] as const;

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="header-inner page-shell">
        <Link href="/" className="wordmark" aria-label={`${siteConfig.name} home`} onClick={() => setOpen(false)}>
          <span className="wordmark-name">{siteConfig.name}</span>
          <span className="wordmark-role">/ engineering notes</span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} className={pathname.startsWith(link.href) ? "active" : ""}>{link.label}</Link>)}
        </nav>
        <div className="header-actions">
          <Link href="/blog#search" className="icon-button" aria-label="Search articles"><Search size={17} /></Link>
          <ThemeToggle />
          <button className="mobile-menu-button icon-button" type="button" aria-label="Toggle menu" onClick={() => setOpen((value) => !value)}>{open ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>
      {open && <nav className="mobile-nav page-shell" aria-label="Mobile navigation">{links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>)}<Link href="/contact" onClick={() => setOpen(false)}>Contact</Link></nav>}
    </header>
  );
}

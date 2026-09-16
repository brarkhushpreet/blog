import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return <div className="not-found page-shell"><span>404</span><h1>This page could not be found.</h1><p>It may have moved, or the address may be incorrect.</p><Link href="/blog" className="button"><ArrowLeft size={17} /> Browse articles</Link></div>;
}

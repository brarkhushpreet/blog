"use client";

import { Link as LinkIcon, Share2 } from "lucide-react";
import { useState } from "react";

export function ShareActions({ title }: { title: string }) {
  const [copied, setCopied] = useState(false);

  async function share() {
    if (navigator.share) await navigator.share({ title, url: window.location.href });
    else await copy();
  }
  async function copy() {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="share-actions">
      <button type="button" onClick={() => void copy()} aria-label="Copy story link"><LinkIcon size={18} /><span>{copied ? "Copied" : "Copy"}</span></button>
      <button type="button" onClick={() => void share()} aria-label="Share story"><Share2 size={18} /><span>Share</span></button>
    </div>
  );
}

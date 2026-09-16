"use client";

export default function ErrorPage({ reset }: { reset: () => void }) {
  return <div className="not-found page-shell"><span>Something went wrong</span><h1>This page could not be loaded.</h1><p>Try again. If the problem continues, send me a message.</p><button className="button" type="button" onClick={reset}>Try again</button></div>;
}

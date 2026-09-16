import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function ArticleBody({ content }: { content: string }) {
  return <div className="article-prose"><ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown></div>;
}

import type { Metadata } from "next";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata: Metadata = { title: "Contact", description: "Send a message about an article, a speaking opportunity, or software engineering work." };

export default function ContactPage() {
  return (
    <div className="contact-page page-shell">
      <header className="contact-header"><span className="kicker">Contact</span><h1>Let’s talk about software.</h1><p>Send feedback on an article, suggest a topic, or get in touch about full-stack engineering, cloud infrastructure, and speaking.</p></header>
      <div className="contact-layout"><aside><strong>A short note is perfect.</strong><p>I read every message and reply when a response would be useful.</p></aside><ContactForm /></div>
    </div>
  );
}

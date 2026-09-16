"use client";

import { FormEvent, useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { browserApiUrl } from "@/lib/api";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [error, setError] = useState("");

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    try {
      const response = await fetch(`${browserApiUrl}/contact`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error ?? "Your message could not be sent.");
      form.reset();
      setStatus("sent");
    } catch (reason) {
      setStatus("idle");
      setError(reason instanceof Error ? reason.message : "Something went wrong.");
    }
  }

  return (
    <form className="contact-form form-stack" onSubmit={submit}>
      <div className="form-row"><label><span>Name</span><input name="name" required minLength={2} placeholder="Your name" /></label><label><span>Email</span><input name="email" type="email" required placeholder="you@example.com" /></label></div>
      <label><span>What is this about?</span><select name="subject" defaultValue="Article feedback"><option>Article feedback</option><option>Work enquiry</option><option>Speaking</option><option>Just saying hello</option></select></label>
      <label><span>Your message</span><textarea name="message" required minLength={10} rows={7} placeholder="What’s on your mind?" /></label>
      {error && <div className="form-message form-error" role="alert">{error}</div>}
      {status === "sent" && <div className="form-message form-success" role="status"><Check size={17} /> Thanks — your note reached me.</div>}
      <button className="button button-accent" type="submit" disabled={status === "sending"}>{status === "sending" ? "Sending…" : "Send message"}<ArrowRight size={17} /></button>
    </form>
  );
}

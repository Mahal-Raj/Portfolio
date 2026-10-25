"use client"

import { FormEvent, useState } from "react"
import { useSearchParams } from "next/navigation"
import { ArrowUpRight } from "lucide-react"
import { siteConfig } from "@/data/site"

export function ContactForm() {
  const searchParams = useSearchParams()
  const [message, setMessage] = useState(() =>
    searchParams.get("subject") === "match" ? "I'm taking you up on that match." : "",
  )

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const name = String(form.get("name") || "")
    const email = String(form.get("email") || "")
    const body = String(form.get("message") || "")
    const subject = searchParams.get("subject") === "match" ? "Challenge accepted" : `Portfolio hello from ${name}`
    const composed = `${body}\n\nFrom: ${name}\nEmail: ${email}`
    window.location.href = `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(composed)}`
  }

  return (
    <form className="contact-form" onSubmit={submit}>
      {/* TODO: Replace the mailto fallback with a verified email API when a backend is configured. */}
      <label>
        <span>Name</span>
        <input name="name" autoComplete="name" required placeholder="Your name" />
      </label>
      <label>
        <span>Email</span>
        <input name="email" type="email" autoComplete="email" required placeholder="you@example.com" />
      </label>
      <label className="contact-message">
        <span>Message</span>
        <textarea name="message" required rows={6} value={message} onChange={(event) => setMessage(event.target.value)} placeholder="What would you like to talk about?" />
      </label>
      <button type="submit">Open in your email app <ArrowUpRight size={17} /></button>
      <p>No data is stored. This opens a pre-addressed email in your email app.</p>
    </form>
  )
}

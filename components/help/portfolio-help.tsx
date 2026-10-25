"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { ArrowUpRight, MessageCircle, RotateCcw, Send, X } from "lucide-react"
import type { GuideReply } from "@/lib/portfolio-guide"

type Message = GuideReply & { id: number; from: "visitor" | "guide" }
const welcome: Message = {
  id: 0, from: "guide",
  text: "Hi, welcome! I’m Sukhraj’s portfolio guide. Ask me about his experience, projects, skills or education, and I’ll help you find the useful bits.",
  suggestions: ["Nokia experience", "What has he built?", "Technical skills", "Get his résumé"],
}

export function PortfolioHelp() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([welcome])
  const [question, setQuestion] = useState("")
  const [pending, setPending] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const conversationRef = useRef<HTMLDivElement>(null)
  const widgetRef = useRef<HTMLDivElement>(null)
  const topicRef = useRef<string | undefined>(undefined)
  const nextId = useRef(1)
  const busyRef = useRef(false)
  const generationRef = useRef(0)
  const suggestions = messages.at(-1)?.suggestions ?? []

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])
  useEffect(() => {
    const conversation = conversationRef.current
    if (conversation && open) conversation.scrollTop = conversation.scrollHeight
  }, [messages, pending, open])
  useEffect(() => {
    const viewport = window.visualViewport
    const widget = widgetRef.current
    if (!open || !viewport || !widget) return
    const fitKeyboard = () => {
      widget.style.setProperty("--help-viewport-height", `${viewport.height}px`)
      widget.style.setProperty("--help-keyboard-offset", `${Math.max(0, window.innerHeight - viewport.height - viewport.offsetTop)}px`)
      widget.dataset.compact = String(viewport.height < 480)
    }
    fitKeyboard()
    viewport.addEventListener("resize", fitKeyboard)
    viewport.addEventListener("scroll", fitKeyboard)
    return () => {
      viewport.removeEventListener("resize", fitKeyboard)
      viewport.removeEventListener("scroll", fitKeyboard)
      widget.style.removeProperty("--help-viewport-height")
      widget.style.removeProperty("--help-keyboard-offset")
      delete widget.dataset.compact
    }
  }, [open])

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus({ preventScroll: true })
  }
  const reset = () => {
    generationRef.current += 1
    busyRef.current = false
    topicRef.current = undefined
    setMessages([welcome])
    setQuestion("")
    setPending(false)
    inputRef.current?.focus({ preventScroll: true })
  }
  const send = async (value: string) => {
    const text = value.trim().slice(0, 600)
    if (!text || busyRef.current) return
    busyRef.current = true
    const generation = generationRef.current
    setQuestion("")
    setPending(true)
    setMessages((previous) => [...previous.slice(-49), { id: nextId.current++, from: "visitor", text }])
    try {
      // Load the answer catalogue only after someone asks a question.
      const { answerPortfolioQuestion } = await import("@/lib/portfolio-guide")
      if (generation !== generationRef.current) return
      const reply = answerPortfolioQuestion(text, topicRef.current)
      topicRef.current = reply.topic
      setMessages((previous) => [...previous, { ...reply, id: nextId.current++, from: "guide" }])
    } catch {
      if (generation !== generationRef.current) return
      setMessages((previous) => [...previous, { id: nextId.current++, from: "guide", text: "I couldn’t load the guide just now. Please try again, or open the résumé directly.", links: [{ label: "Read the résumé", href: "/Sukhraj-Singh-Resume.pdf" }] }])
    } finally {
      if (generation === generationRef.current) {
        busyRef.current = false
        setPending(false)
        inputRef.current?.focus({ preventScroll: true })
      }
    }
  }
  const submit = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); void send(question) }

  return <div className="p-help" ref={widgetRef}>
    <section className="p-help-panel" id="portfolio-help" role="dialog" aria-modal="false" aria-labelledby="portfolio-help-title" hidden={!open}
      onKeyDown={(event) => { if (event.key === "Escape") { event.stopPropagation(); close() } }}>
      <header className="p-help-header">
        <span className="p-help-avatar" aria-hidden="true"><MessageCircle size={21} /></span>
        <div><h2 id="portfolio-help-title">Ask about Sukhraj</h2><p>Résumé & portfolio guide</p></div>
        <button type="button" className="p-help-icon" onClick={reset} aria-label="Start a new conversation" title="Start over"><RotateCcw size={17} /></button>
        <button type="button" className="p-help-icon" onClick={close} aria-label="Close portfolio help"><X size={20} /></button>
      </header>
      <div className="p-help-conversation" ref={conversationRef} role="log" aria-label="Conversation" aria-live="polite" aria-relevant="additions" aria-busy={pending}>
        {messages.map((message) => <div key={message.id} className={`p-help-message p-help-${message.from}`}>
          <span className="p-visually-hidden">{message.from === "visitor" ? "You" : "Portfolio guide"}: </span>
          <p>{message.text}</p>
          {message.bullets?.length ? <ul>{message.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul> : null}
          {message.links?.length ? <div className="p-help-links">{message.links.map((link) => {
            const external = /^(https?:|mailto:)/.test(link.href) || link.href.endsWith(".pdf")
            return <Link key={link.href} href={link.href} target={external ? "_blank" : undefined} rel={external ? "noreferrer" : undefined}
              onClick={() => { if (!external) setOpen(false) }}>{link.label}<ArrowUpRight size={13} aria-hidden="true" /></Link>
          })}</div> : null}
        </div>)}
        {pending ? <p className="p-help-loading" role="status">Finding the useful bits…</p> : null}
      </div>
      {!pending && suggestions.length ? <div className="p-help-suggestions" aria-label="Suggested questions">{suggestions.map((suggestion) => <button key={suggestion} type="button" onClick={() => void send(suggestion)}>{suggestion}</button>)}</div> : null}
      <form className="p-help-form" onSubmit={submit}>
        <label className="p-visually-hidden" htmlFor="portfolio-help-question">Ask about Sukhraj’s résumé</label>
        <input ref={inputRef} id="portfolio-help-question" value={question} onChange={(event) => setQuestion(event.target.value)} maxLength={600} placeholder="What would you like to know?" autoComplete="off" enterKeyHint="send" />
        <button type="submit" disabled={!question.trim() || pending} aria-label="Send question"><Send size={17} /></button>
      </form>
      <p className="p-help-note">Short answers. Source links. A little less searching.</p>
    </section>
    <button ref={triggerRef} className="p-help-launcher" type="button" onClick={() => { if (open) close(); else setOpen(true) }} aria-label={open ? "Close portfolio help" : "Open portfolio help"} aria-expanded={open} aria-controls="portfolio-help" aria-haspopup="dialog">
      {open ? <X size={21} aria-hidden="true" /> : <MessageCircle size={21} aria-hidden="true" />}<span>Ask about me</span>
    </button>
  </div>
}

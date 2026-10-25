"use client"

import { useRef, useState } from "react"
import { ArrowUpRight, Sparkles } from "lucide-react"
import { nextEncouragement, quoteStorageKey, type QuoteHistory } from "@/lib/quote-cycle"

export function EncouragementCard() {
  const memory = useRef<QuoteHistory | null>(null)
  const [thought, setThought] = useState({ id: "welcome", text: "You don’t need to have it all figured out to take your next step." })
  const [greeting, setGreeting] = useState("A small reminder, just for you.")

  const refresh = () => {
    let saved: unknown = memory.current
    try {
      const stored = localStorage.getItem(quoteStorageKey)
      if (stored) saved = JSON.parse(stored)
    } catch { /* Memory still works if storage is unavailable or corrupted. */ }
    const next = nextEncouragement(saved, () => {
      if (typeof globalThis.crypto !== "undefined") return crypto.getRandomValues(new Uint32Array(1))[0] / 4294967296
      return Math.random()
    })
    memory.current = next.history
    try { localStorage.setItem(quoteStorageKey, JSON.stringify(next.history)) } catch { /* Private storage may be unavailable. */ }
    setGreeting(next.returning ? "Good to have you here. Take this with you." : "Hey, welcome. I’m glad you’re here.")
    setThought(next.quote)
  }

  return <aside className="p-shell p-encouragement" id="encouragement" aria-label="A moment of encouragement">
    <button className="p-quote-card" type="button" onClick={refresh} aria-label="Give me a new encouraging quote" aria-describedby="encouragement-thought">
      <span className="p-quote-label"><Sparkles size={17} aria-hidden="true" />A moment for you</span>
      <span className="p-quote-main" key={thought.id}>
        <span className="p-quote-greeting">{greeting}</span>
        <span className="p-quote-text" id="encouragement-thought">“{thought.text}”</span>
      </span>
      <span className="p-quote-action">{thought.id === "welcome" ? "A fresh thought" : "One more thought"}<ArrowUpRight size={17} aria-hidden="true" /></span>
    </button>
    <span className="p-visually-hidden" role="status" aria-live="polite" aria-atomic="true">{thought.id !== "welcome" ? `${greeting} ${thought.text}` : ""}</span>
  </aside>
}

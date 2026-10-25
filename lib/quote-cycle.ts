import { encouragement } from "../data/encouragement"

export const quoteStorageKey = "sukhraj.encouragement.v1"
export type QuoteHistory = { version: 1; seen: string[]; last: string | null }

export function nextEncouragement(saved: unknown, random: () => number = Math.random) {
  const ids = new Set(encouragement.map((quote) => quote.id))
  const candidate = saved && typeof saved === "object" ? saved as Partial<QuoteHistory> : null
  let seen = candidate?.version === 1 && Array.isArray(candidate.seen)
    ? [...new Set(candidate.seen.filter((id): id is string => typeof id === "string" && ids.has(id)))]
    : []
  const last = typeof candidate?.last === "string" && ids.has(candidate.last) ? candidate.last : null
  let available = encouragement.filter((quote) => !seen.includes(quote.id) && quote.id !== last)
  if (!available.length) {
    seen = []
    available = encouragement.filter((quote) => quote.id !== last)
  }
  const value = random()
  const fraction = Number.isFinite(value) ? Math.max(0, Math.min(value, 0.999999999)) : 0
  const quote = available[Math.floor(fraction * available.length)]
  const history: QuoteHistory = { version: 1, seen: [...seen, quote.id], last: quote.id }
  return { quote, history, returning: last !== null }
}

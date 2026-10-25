"use client"

import { useState } from "react"
import { Check, Copy } from "lucide-react"

export function CopyEmail({ email }: { email: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button className="copy-email" type="button" onClick={copy} aria-live="polite">
      {copied ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
      {copied ? "Email copied" : "Copy email"}
    </button>
  )
}

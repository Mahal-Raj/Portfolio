"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"
import { ArrowUpRight, BookOpen, ChevronRight, X } from "lucide-react"
import type { ResearchPaper } from "@/data/research"

const PaperBook = dynamic(() => import("./paper-book"), {
  ssr: false,
  loading: () => <div className="p-paper-loading" role="status">Opening the paper…</div>,
})

export function PaperCard({ paper }: { paper: ResearchPaper }) {
  const [open, setOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const readerId = `${paper.id}-reader`

  const close = () => {
    setOpen(false)
    triggerRef.current?.focus()
  }

  return <article className="p-paper-card" aria-labelledby={`${paper.id}-title`}>
    <div className="p-paper-summary">
      <div className="p-paper-cover" aria-hidden="true">
        <Image src={paper.pages[0]} alt="" fill sizes="(max-width: 600px) 140px, 180px" />
      </div>
      <div className="p-paper-copy">
        <p className="p-eyebrow">{paper.category}</p>
        <h2 id={`${paper.id}-title`}>{paper.title}</h2>
        <p>{paper.description}</p>
        <p className="p-paper-note">{paper.note}</p>
        <div className="p-actions">
          <button ref={triggerRef} type="button" className="p-button" aria-expanded={open} aria-controls={readerId} onClick={() => setOpen(!open)}>
            {open ? <X size={17} /> : <BookOpen size={17} />}{open ? "Close book" : "Open book"}
          </button>
          <a className="p-text-link" href={paper.pdf} target="_blank" rel="noreferrer">Read PDF <ArrowUpRight size={16} /></a>
          <Link className="p-text-link" href={paper.caseStudy}>Case study <ChevronRight size={16} /></Link>
        </div>
      </div>
    </div>
    <div id={readerId} hidden={!open}>
      {open && <PaperBook paper={paper} onClose={close} />}
    </div>
  </article>
}

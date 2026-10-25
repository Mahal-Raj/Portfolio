"use client"

import Image from "next/image"
import { forwardRef, useEffect, useRef, useState } from "react"
import HTMLFlipBook from "react-pageflip"
import { useReducedMotion } from "framer-motion"
import { ArrowLeft, ArrowRight, RotateCcw, X } from "lucide-react"
import type { ResearchPaper } from "@/data/research"

type PaperPageApi = { setDensity: (density: "soft") => void; setDrawingDensity: (density: "soft") => void }
type BookApi = {
  flipNext: (corner?: "top" | "bottom") => void
  flipPrev: (corner?: "top" | "bottom") => void
  turnToPage: (page: number) => void
  getPageCount: () => number
  getPage: (page: number) => PaperPageApi
  update: () => void
  destroy: () => void
}
type BookRef = { pageFlip: () => BookApi }
type Orientation = "portrait" | "landscape"

const PaperPage = forwardRef<HTMLDivElement, { src: string; page: number; title: string }>(
  function PaperPage({ src, page, title }, ref) {
    return <div className="p-paper-page" ref={ref} data-density="soft">
      <Image src={src} alt={`${title}, page ${page}`} width={880} height={1140} sizes="(max-width: 600px) 85vw, 440px" draggable={false} />
    </div>
  },
)

export default function PaperBook({ paper, onClose }: { paper: ResearchPaper; onClose: () => void }) {
  const bookRef = useRef<BookRef>(null)
  const reducedMotion = useReducedMotion()
  const [page, setPage] = useState(0)
  const [orientation, setOrientation] = useState<Orientation>("portrait")
  const [ready, setReady] = useState(false)
  const [turning, setTurning] = useState(false)
  useEffect(() => {
    const book = bookRef.current
    return () => book?.pageFlip()?.destroy()
  }, [])
  const lastVisiblePage = page === 0 ? 0 : Math.min(page + (orientation === "landscape" ? 1 : 0), paper.pages.length - 1)
  const atStart = page === 0
  const atEnd = lastVisiblePage === paper.pages.length - 1
  const previous = () => { if (ready && !turning && !atStart) bookRef.current?.pageFlip().flipPrev("bottom") }
  const next = () => { if (ready && !turning && !atEnd) bookRef.current?.pageFlip().flipNext("bottom") }

  return <section className="p-paper-reader" aria-label={`${paper.title} book viewer`}>
    <div className="p-paper-reader-top">
      <p>Drag a corner, or use the arrows.</p>
      <button type="button" className="p-paper-icon" onClick={onClose} aria-label={`Close ${paper.title} book`}><X size={20} /></button>
    </div>
    <div className="p-paper-stage" tabIndex={0} aria-label="Paper pages. Use the left and right arrow keys to turn pages." onKeyDown={(event) => {
      if (event.key === "ArrowRight") { event.preventDefault(); next() }
      if (event.key === "ArrowLeft") { event.preventDefault(); previous() }
      if (event.key === "Home") { event.preventDefault(); bookRef.current?.pageFlip().turnToPage(0) }
    }}>
      <HTMLFlipBook ref={bookRef} className="p-paper-flipbook" style={{}} startPage={0}
        size="stretch" width={440} height={570} minWidth={240} maxWidth={440} minHeight={310} maxHeight={570}
        drawShadow={!reducedMotion} flippingTime={reducedMotion ? 80 : 1150} usePortrait startZIndex={1}
        autoSize maxShadowOpacity={0.42} showCover mobileScrollSupport={false} clickEventForward={false}
        useMouseEvents swipeDistance={30} showPageCorners={!reducedMotion} disableFlipByClick={false}
        renderOnlyPageLengthChange
        onFlip={(event: { data: number }) => setPage(event.data)}
        onChangeOrientation={(event: { data: Orientation }) => setOrientation(event.data)}
        onChangeState={(event: { data: string }) => {
          setTurning(event.data === "flipping")
          // Re-measure after a turn so cached page bounds match the responsive wrapper.
          if (event.data === "read") bookRef.current?.pageFlip()?.update()
        }}
        onInit={(event: { data: { page: number; mode: Orientation } }) => {
          const book = bookRef.current?.pageFlip()
          // Keep the single-page opening, but let every sheet bend instead of turning as a rigid cover.
          if (book) {
            for (let index = 0; index < book.getPageCount(); index++) {
              book.getPage(index).setDensity("soft")
              book.getPage(index).setDrawingDensity("soft")
            }
            book.update()
          }
          setPage(event.data.page)
          setOrientation(event.data.mode)
          setReady(true)
        }}>
        {paper.pages.map((src, index) => <PaperPage key={src} src={src} page={index + 1} title={paper.title} />)}
      </HTMLFlipBook>
    </div>
    <div className="p-paper-controls">
      <button type="button" disabled={!ready || turning || atStart} onClick={previous}><ArrowLeft size={17} />Previous</button>
      <p role="status" aria-live="polite" aria-atomic="true">{page === lastVisiblePage ? `Page ${page + 1}` : `Pages ${page + 1}–${lastVisiblePage + 1}`} of {paper.pages.length}</p>
      <button type="button" disabled={!ready || turning || atEnd} onClick={next}>Next<ArrowRight size={17} /></button>
    </div>
    <div className="p-paper-reader-foot">
      <button type="button" disabled={!ready || turning || atStart} onClick={() => bookRef.current?.pageFlip().turnToPage(0)}><RotateCcw size={14} />Start over</button>
      <a href={paper.pdf} target="_blank" rel="noreferrer">Open PDF for full-size reading ↗</a>
    </div>
  </section>
}

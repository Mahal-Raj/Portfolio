"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import { forwardRef, useRef, useState, type KeyboardEvent } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, BookOpen, ChevronLeft, RotateCcw } from "lucide-react"

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false })

const repositoryUrl = "https://github.com/Mahal-Raj/NewsHeadlinesExtractor_OCR"

type ReaderState = "cover" | "inside" | "back"

type PageFlipApi = {
  flipNext: (corner?: "top" | "bottom") => void
  flipPrev: (corner?: "top" | "bottom") => void
  getCurrentPageIndex: () => number
  turnToPage: (page: number) => void
}

type PageFlipRef = {
  pageFlip: () => PageFlipApi
}

type ResearchPageProps = {
  page?: number
  label?: string
  onActivate?: () => void
  onBeginTurn?: () => void
}

const ResearchPage = forwardRef<HTMLDivElement, ResearchPageProps>(function ResearchPage(
  { page, label, onActivate, onBeginTurn },
  ref,
) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onActivate || (event.key !== "Enter" && event.key !== " ")) return
    event.preventDefault()
    onActivate()
  }

  if (!page) {
    return (
      <div ref={ref} className="folding-book-page folding-book-page-blank" data-density="soft" aria-hidden="true">
        <span />
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className="folding-book-page"
      data-density="soft"
      role={onActivate ? "button" : undefined}
      tabIndex={onActivate ? 0 : -1}
      aria-label={label}
      onKeyDown={handleKeyDown}
      onPointerDown={onBeginTurn}
    >
      <div className="folding-book-page-surface">
        <Image
          src={`/images/research/paper-page-${page}.webp`}
          alt={`Page ${page} of Sukhraj Singh's temporal-consensus OCR research paper`}
          fill
          sizes="(max-width: 820px) 82vw, 47vw"
          draggable={false}
        />
      </div>
    </div>
  )
})

const stateDetails: Record<ReaderState, { instruction: string; pages: string }> = {
  cover: { instruction: "Drag page 1 left to fold it open", pages: "Page 1 of 4" },
  inside: { instruction: "Drag page 3 left to turn it", pages: "Pages 2-3 of 4" },
  back: { instruction: "The final page returns beside the introduction", pages: "Page 4 of 4" },
}

function stateFromPage(page: number): ReaderState {
  if (page >= 4) return "back"
  if (page >= 2) return "inside"
  return "cover"
}

export function ResearchPaperShowcase() {
  const bookRef = useRef<PageFlipRef | null>(null)
  const [readerState, setReaderState] = useState<ReaderState>("cover")
  const [isTurning, setIsTurning] = useState(false)
  const [isFinalTurn, setIsFinalTurn] = useState(false)
  const reduceMotion = Boolean(useReducedMotion())
  const showCopy = readerState !== "inside" || isFinalTurn

  const flipNext = () => bookRef.current?.pageFlip().flipNext("bottom")
  const turnToFinalPage = () => {
    setIsFinalTurn(true)
    flipNext()
  }
  const flipPrevious = () => {
    setIsFinalTurn(false)
    bookRef.current?.pageFlip().flipPrev("bottom")
  }
  const restart = () => {
    setIsFinalTurn(false)
    bookRef.current?.pageFlip().turnToPage(0)
  }

  const handleFlip = (page: number) => {
    const nextState = stateFromPage(page)
    setReaderState(nextState)
    if (nextState === "cover") setIsFinalTurn(false)
  }

  const handleTurnState = (state: string) => {
    setIsTurning(state !== "read")

    if (state === "read" && readerState === "inside" && isFinalTurn) {
      const currentPage = bookRef.current?.pageFlip().getCurrentPageIndex() ?? 2
      if (currentPage < 4) setIsFinalTurn(false)
    }
  }

  return (
    <section className="research-paper-section" aria-label="Interactive research paper">
      <div className={`site-shell folding-paper-layout folding-state-${readerState}${isTurning ? " is-turning" : ""}${isFinalTurn ? " is-final-turn" : ""}`}>
        <AnimatePresence initial={false}>
          {showCopy && (
            <motion.div
              key="research-copy"
              className="folding-paper-copy"
              initial={reduceMotion ? false : isFinalTurn
                ? { opacity: 0, x: -12, clipPath: "inset(0 100% 0 0)" }
                : { opacity: 0, x: -18, clipPath: "inset(0 0% 0 0)" }}
              animate={{ opacity: 1, x: 0, clipPath: "inset(0 0% 0 0)" }}
              exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
              transition={reduceMotion ? { duration: 0 } : isFinalTurn
                ? { duration: 0.82, delay: 0.08, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.34, ease: "easeOut" }}
            >
              <p className="section-label">RESEARCH PAPER / OCR + ACCESSIBILITY</p>
              <h2>Temporal-Consensus<br />OCR for News<br />Headlines.</h2>
              <div className="research-paper-summary">
                <p>I explored how OCR can recover static lower-thirds and scrolling news tickers.</p>
                <p>The method combines evidence across video frames instead of trusting one image.</p>
                <p>I built the local pipeline, reproducible benchmark and four-page manuscript.</p>
              </div>
              <div className="research-paper-topics" aria-label="Research topics">
                <span>OCR</span><span>Video text</span><span>Accessibility</span><span>Reproducibility</span>
              </div>
              <div className="research-paper-links">
                <a className="arrow-link" href="/research/temporal-consensus-ocr.pdf" target="_blank" rel="noreferrer">Read full paper <ArrowUpRight /></a>
                <a className="research-repository-link" href={repositoryUrl} target="_blank" rel="noreferrer">View repository <ArrowUpRight /></a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="folding-book-layer">
          <div className="folding-book-stage">
            <HTMLFlipBook
              ref={bookRef}
              className="research-flipbook"
              style={{}}
              startPage={0}
              size="stretch"
              width={590}
              height={764}
              minWidth={260}
              maxWidth={620}
              minHeight={337}
              maxHeight={802}
              drawShadow={!reduceMotion}
              flippingTime={reduceMotion ? 80 : 1150}
              usePortrait={false}
              startZIndex={10}
              autoSize
              maxShadowOpacity={0.48}
              showCover={false}
              mobileScrollSupport
              clickEventForward={false}
              useMouseEvents
              swipeDistance={24}
              showPageCorners={!reduceMotion}
              disableFlipByClick={false}
              renderOnlyPageLengthChange
              onFlip={(event) => handleFlip(Number(event.data))}
              onChangeState={(event) => handleTurnState(String(event.data))}
            >
              <ResearchPage />
              <ResearchPage page={1} label="Fold page 1 open to pages 2 and 3" onActivate={flipNext} />
              <ResearchPage page={2} label="Page 2 of the research paper" />
              <ResearchPage
                page={3}
                label="Fold page 3 to the final page"
                onActivate={turnToFinalPage}
                onBeginTurn={() => setIsFinalTurn(true)}
              />
              <ResearchPage />
              <ResearchPage page={4} label="Page 4 of the research paper" />
            </HTMLFlipBook>
          </div>

          <div className="folding-book-controls">
            <button type="button" onClick={flipPrevious} disabled={readerState === "cover"} aria-label="Turn to the previous paper spread">
              <span><ChevronLeft aria-hidden="true" />Previous</span>
            </button>
            <p aria-live="polite">
              <BookOpen aria-hidden="true" />
              <span>{stateDetails[readerState].instruction}</span>
              <small>{stateDetails[readerState].pages}</small>
            </p>
            <button className="folding-book-restart" type="button" onClick={restart} disabled={readerState === "cover"}>
              <span><RotateCcw aria-hidden="true" />Start over</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

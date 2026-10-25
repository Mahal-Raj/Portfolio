"use client"

import Image from "next/image"
import dynamic from "next/dynamic"
import { forwardRef, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { AnimatePresence, motion, useReducedMotion } from "framer-motion"
import { ArrowUpRight, BookOpen, ChevronLeft, RotateCcw } from "lucide-react"

const HTMLFlipBook = dynamic(() => import("react-pageflip"), { ssr: false })

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

export type InteractivePaperConfig = {
  id: string
  theme?: "scampa"
  ariaLabel: string
  sectionLabel: string
  title: ReactNode
  summary: string[]
  topics: string[]
  pageCount: 3 | 4
  imagePrefix: string
  imageAlt: string
  links: Array<{
    label: string
    href: string
    primary?: boolean
    external?: boolean
  }>
}

type PaperPageProps = {
  src?: string
  alt?: string
  label?: string
  onActivate?: () => void
  onBeginTurn?: () => void
}

const PaperPage = forwardRef<HTMLDivElement, PaperPageProps>(function PaperPage(
  { src, alt, label, onActivate, onBeginTurn },
  ref,
) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!onActivate || (event.key !== "Enter" && event.key !== " ")) return
    event.preventDefault()
    onActivate()
  }

  if (!src) {
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
          src={src}
          alt={alt ?? "Research paper page"}
          fill
          sizes="(max-width: 820px) 82vw, 47vw"
          draggable={false}
        />
      </div>
    </div>
  )
})

function stateFromPage(page: number, pageCount: 3 | 4): ReaderState {
  if (pageCount === 4 && page >= 4) return "back"
  if (page >= 2) return "inside"
  return "cover"
}

function readerDetails(state: ReaderState, pageCount: 3 | 4) {
  if (state === "cover") return { instruction: "Drag page 1 left to fold it open", pages: `Page 1 of ${pageCount}` }
  if (state === "back") return { instruction: "The final page returns beside the introduction", pages: `Page ${pageCount} of ${pageCount}` }
  if (pageCount === 3) return { instruction: "The complete paper is now open", pages: "Pages 2-3 of 3" }
  return { instruction: "Drag page 3 left to turn it", pages: "Pages 2-3 of 4" }
}

export function InteractivePaperShowcase({ config }: { config: InteractivePaperConfig }) {
  const bookRef = useRef<PageFlipRef | null>(null)
  const [readerState, setReaderState] = useState<ReaderState>("cover")
  const [isTurning, setIsTurning] = useState(false)
  const [isFinalTurn, setIsFinalTurn] = useState(false)
  const reduceMotion = Boolean(useReducedMotion())
  const showCopy = readerState !== "inside" || isFinalTurn
  const details = readerDetails(readerState, config.pageCount)

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
    const nextState = stateFromPage(page, config.pageCount)
    setReaderState(nextState)
    if (nextState === "cover") setIsFinalTurn(false)
  }

  const handleTurnState = (state: string) => {
    setIsTurning(state !== "read")

    if (state === "read" && config.pageCount === 4 && readerState === "inside" && isFinalTurn) {
      const currentPage = bookRef.current?.pageFlip().getCurrentPageIndex() ?? 2
      if (currentPage < 4) setIsFinalTurn(false)
    }
  }

  const pages: ReactNode[] = [<PaperPage key={`${config.id}-opening-blank`} />]
  for (let page = 1; page <= config.pageCount; page += 1) {
    pages.push(
      <PaperPage
        key={`${config.id}-page-${page}`}
        src={`${config.imagePrefix}-${page}.webp`}
        alt={`Page ${page} of ${config.imageAlt}`}
        label={page === 1
          ? `Fold page 1 open to read ${config.imageAlt}`
          : page === 3 && config.pageCount === 4
            ? "Fold page 3 to the final page"
            : `Page ${page} of ${config.imageAlt}`}
        onActivate={page === 1 ? flipNext : page === 3 && config.pageCount === 4 ? turnToFinalPage : undefined}
        onBeginTurn={page === 3 && config.pageCount === 4 ? () => setIsFinalTurn(true) : undefined}
      />,
    )
    if (page === 3 && config.pageCount === 4) pages.push(<PaperPage key={`${config.id}-final-blank`} />)
  }

  return (
    <section className={`research-paper-section${config.theme ? ` research-paper-section-${config.theme}` : ""}`} aria-label={config.ariaLabel}>
      <div className={`site-shell folding-paper-layout folding-state-${readerState}${isTurning ? " is-turning" : ""}${isFinalTurn ? " is-final-turn" : ""}`}>
        <AnimatePresence initial={false}>
          {showCopy && (
            <motion.div
              key={`${config.id}-copy`}
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
              <p className="section-label">{config.sectionLabel}</p>
              <h2>{config.title}</h2>
              <div className="research-paper-summary">
                {config.summary.map((line) => <p key={line}>{line}</p>)}
              </div>
              <div className="research-paper-topics" aria-label="Research topics">
                {config.topics.map((topic) => <span key={topic}>{topic}</span>)}
              </div>
              <div className="research-paper-links">
                {config.links.map((link) => (
                  <a
                    key={link.href}
                    className={link.primary ? "arrow-link" : "research-repository-link"}
                    href={link.href}
                    target={link.external ? "_blank" : undefined}
                    rel={link.external ? "noreferrer" : undefined}
                  >
                    {link.label} <ArrowUpRight aria-hidden="true" />
                  </a>
                ))}
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
              {pages}
            </HTMLFlipBook>
          </div>

          <div className="folding-book-controls">
            <button type="button" onClick={flipPrevious} disabled={readerState === "cover"} aria-label="Turn to the previous paper spread">
              <span><ChevronLeft aria-hidden="true" />Previous</span>
            </button>
            <p aria-live="polite">
              <BookOpen aria-hidden="true" />
              <span>{details.instruction}</span>
              <small>{details.pages}</small>
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

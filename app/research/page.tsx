import { PageHero } from "@/components/ui/page-hero"
import { PaperCard } from "@/components/research/paper-card"
import { researchPapers } from "@/data/research"
import { pageMetadata } from "@/lib/metadata"
import "./research.css"

export const metadata = pageMetadata(
  "Research",
  "Explore Sukhraj Singh's research on temporal-consensus OCR and local voice AI. Read both papers in an interactive book or open the original PDFs.",
  "/research",
)

export default function ResearchPage() {
  return <>
    <PageHero eyebrow="Research" title={<>Two papers.<br />A closer look.</>} description="Questions explored through computer vision and voice AI. Open a paper, turn the pages, or read the full PDF." />
    <section className="p-shell p-research-list" aria-label="Research papers">
      {researchPapers.map((paper) => <PaperCard key={paper.id} paper={paper} />)}
    </section>
  </>
}

export type ResearchPaper = {
  id: string
  title: string
  category: string
  description: string
  note: string
  pdf: string
  caseStudy: string
  pages: string[]
}

export const researchPapers: ResearchPaper[] = [
  {
    id: "temporal-consensus-ocr",
    title: "Temporal-Consensus OCR",
    category: "Computer vision · Independent research",
    description: "Can neighbouring video frames help read a headline more accurately? This paper explores combining evidence over time to improve text recognition.",
    note: "Evaluated on 50 synthetic clips; real-world broadcast performance remains unverified.",
    pdf: "/research/temporal-consensus-ocr.pdf",
    caseStudy: "/projects/temporal-consensus-ocr-research",
    pages: Array.from({ length: 4 }, (_, i) => `/images/research/paper-page-${i + 1}.webp`),
  },
  {
    id: "scampa",
    title: "SCAMPA / ScamShield",
    category: "Voice AI · Co-authored course research",
    description: "A proposal for a local voice agent that connects speech recognition, language models and speech synthesis for controlled, defensive scam research.",
    note: "Phase 1 architecture proposal in an IEEE-formatted course report; not a deployed voice system.",
    pdf: "/research/scamshield-phase-1.pdf",
    caseStudy: "/projects/scamshield-local-voice-agent",
    pages: Array.from({ length: 3 }, (_, i) => `/images/research/scampa-page-${i + 1}.webp`),
  },
]

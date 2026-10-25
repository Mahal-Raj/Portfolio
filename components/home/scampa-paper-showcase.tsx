"use client"

import { InteractivePaperShowcase, type InteractivePaperConfig } from "@/components/home/interactive-paper-showcase"

const scampaPaper: InteractivePaperConfig = {
  id: "scampa-phase-one",
  theme: "scampa",
  ariaLabel: "Interactive SCAMPA defensive AI research paper",
  sectionLabel: "RESEARCH PAPER / DEFENSIVE AI + VOICE SECURITY",
  title: <>SCAMPA: A local<br />voice agent with<br />a safety boundary.</>,
  summary: [
    "I co-designed a local-first voice-agent architecture for controlled defensive scambaiting research.",
    "The paper connects speech recognition, explicit policy enforcement, local LLM inference and speech synthesis.",
    "Phase 1 defines the modular C++20 system, safety boundary and measurable evaluation plan.",
  ],
  topics: ["Local AI", "Voice security", "C++20", "Safety policy"],
  pageCount: 3,
  imagePrefix: "/images/research/scampa-page",
  imageAlt: "Sukhraj Singh's SCAMPA Phase 1 IEEE research paper",
  links: [
    { label: "Read full paper", href: "/research/scamshield-phase-1.pdf", primary: true, external: true },
    { label: "View case study", href: "/projects/scamshield-local-voice-agent" },
    { label: "View repository", href: "https://github.com/Mahal-Raj/ScamShield-LLM", external: true },
  ],
}

export function ScampaPaperShowcase() {
  return <InteractivePaperShowcase config={scampaPaper} />
}

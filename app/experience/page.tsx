import { cache } from "react"
import { ExperienceTimeline } from "@/components/experience/experience-timeline"
import { PageHero } from "@/components/ui/page-hero"
import { resumeHref } from "@/data/site"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata("Experience", "Roles, dates and practical contributions across Nokia, Syncrope, Algoma University, AWS Cloud Club and Toys R Us.", "/experience")
// Refresh the date-based role label without requiring another deployment.
export const revalidate = 3600
// A stable timestamp for each server render; refreshed by ISR on later visits.
const getRenderTime = cache(() => Date.now())
export default function ExperiencePage() {
  const asOf = getRenderTime()
  return <><PageHero eyebrow="Experience" title="Where I’ve contributed." description="The roles, the work, and what I brought to each team."><a className="p-text-link" href={resumeHref} target="_blank" rel="noreferrer">Download résumé ↗</a></PageHero><section className="p-shell p-section p-role-section"><ExperienceTimeline asOf={asOf} /></section></>
}

import { ProjectFilterGrid } from "@/components/projects/project-filter-grid"
import { PageHero } from "@/components/ui/page-hero"
import { pageMetadata } from "@/lib/metadata"
export const metadata = pageMetadata("Projects", "Explore Sukhraj Singh's cloud, DevOps, networking and AI projects, with demos, source code and clear contributions.", "/projects")
export default function ProjectsPage() {
  return <><PageHero eyebrow="Projects" title="Ideas, made practical." description="A collection of things I built, tested and learned from. Choose a project for the demo, my contribution and the code." /><section className="p-section p-catalogue"><div className="p-shell"><ProjectFilterGrid /></div></section></>
}

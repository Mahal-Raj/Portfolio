import Link from "next/link"
import { ArrowUpRight, ChevronRight } from "lucide-react"
import type { Project } from "@/data/projects"
import { projectPresentation } from "@/data/presentation"
import { ProjectArtwork } from "@/components/projects/project-artwork"
export function ProjectCard({ project, featured = false }: { project: Project; featured?: boolean }) {
  const presentation = projectPresentation[project.visual]
  return <article className={`p-project-card${featured ? " p-project-featured" : ""}`}>
    <Link className="p-art-link" href={`/projects/${project.slug}`} aria-label={`Explore ${presentation.title}`}><ProjectArtwork type={project.visual} /></Link>
    <div className="p-project-copy"><p className="p-eyebrow">{presentation.category}</p><h2><Link href={`/projects/${project.slug}`}>{presentation.title}</Link></h2><p>{presentation.line}</p><p className="p-project-status">{presentation.status}</p><div className="p-project-links"><Link href={`/projects/${project.slug}`}>Explore project <ChevronRight size={16} /></Link><a href={project.repository} target="_blank" rel="noreferrer">GitHub <ArrowUpRight size={15} /></a></div></div>
  </article>
}

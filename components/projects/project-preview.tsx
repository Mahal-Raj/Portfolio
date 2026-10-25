import { ArrowLink } from "@/components/ui/arrow-link"
import { ProjectVisual } from "@/components/projects/project-visual"
import type { Project } from "@/data/projects"

export function ProjectPreview({ project }: { project: Project }) {
  return (
    <article className={`project-preview project-${project.visual}`}>
      <ProjectVisual type={project.visual} />
      <div className="project-preview-copy">
        <div className="project-index"><span>{project.number}</span><span>{project.type}</span></div>
        <h3>{project.title}</h3>
        <p>{project.summary}</p>
        <p className="project-preview-status"><strong>{project.status}</strong> · {project.ownership} · {project.date}</p>
        <ul aria-label="Technologies">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>
        <div className="project-actions">
          <ArrowLink href={`/projects/${project.slug}`}>View case study</ArrowLink>
          {project.demo ? <ArrowLink href={`/projects/${project.slug}#demo`}>Watch demo</ArrowLink> : null}
          {project.report ? <ArrowLink href={project.report} external>Project report</ArrowLink> : null}
          <ArrowLink href={project.repository} external>Repository</ArrowLink>
        </div>
      </div>
    </article>
  )
}
